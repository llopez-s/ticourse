import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import {
  ALL_STEPS,
  UsageError,
  checkDuration,
  checkPreconditions,
  decideVideoSource,
  formatCommand,
  gitSafeDirEnv,
  outPaths,
  parseProduceArgs,
  planSteps,
  resolveTools,
  resumeCommand,
  selectStepIds,
  summarizeMaster,
  summarizeRender,
  tailLines,
} from './produce.mjs';

const REPO = path.resolve('/work/repo');
const MAIN = path.resolve('/work/main');
const SLUG = 'demo-halden';
const MANIFEST = { slug: SLUG, output: 'demo-halden', profile: 'caso-yt', track: 'secplus', music: 'Go On Going - Stayloose.mp3' };
const P = outPaths(REPO, SLUG, MANIFEST.output);
const ffmpegIn = (root) => path.join(root, 'node_modules', '@remotion', 'compositor-win32-x64-msvc', 'ffmpeg.exe');
const venv = (root) => path.join(root, 'video', 'engine', '.venv-chatterbox', 'Scripts', 'python.exe');
const musicIn = (root) => path.join(root, 'video', 'engine', 'music', 'library', MANIFEST.music);

/** fs falso: un Map de ruta -> contenido (objeto = JSON), con readdir por prefijo. */
function fakeFs(files) {
  const map = new Map(Object.entries(files));
  return {
    exists: (p) => map.has(p) || [...map.keys()].some((k) => k.startsWith(p + path.sep)),
    readJson: (p) => (map.has(p) && typeof map.get(p) === 'object' ? map.get(p) : null),
    readdir: (dir) => [...new Set([...map.keys()].filter((k) => k.startsWith(dir + path.sep)).map((k) => k.slice(dir.length + 1).split(path.sep)[0]))],
  };
}

/** Un repo completo y sano: grabación importada, timeline en modo audio, herramientas y música. */
function healthyFiles({ segments = ['s01-01', 's01-02'], extra = {} } = {}) {
  const files = {
    [path.join(REPO, 'node_modules', '@remotion', 'cli', 'remotion-cli.js')]: 'x',
    [ffmpegIn(REPO)]: 'x',
    [venv(MAIN)]: 'x',
    [musicIn(REPO)]: 'x',
    [P.narration]: { voice: 'recording/lidia' },
    [P.timeline]: { mode: 'audio', sourceHash: 'h1', fps: 30, durationInFrames: 900, voice: 'recording/lidia', segments: segments.map((id) => ({ id })) },
    [P.verifyVoice]: { sourceHash: 'h1', errors: [], warnings: [] },
  };
  for (const id of segments) {
    files[path.join(P.ttsDir, `${id}.json`)] = { key: id };
    files[path.join(P.voiceDir, `${id}.mp3`)] = 'x';
  }
  return { ...files, ...extra };
}

const opts = (o = {}) => ({ video: SLUG, concurrency: 4, privacy: 'private', generatedBed: false, masterInRender: false, upload: false, dryRun: false, ...o });
const tools = (o = {}) => ({ python: venv(MAIN), ffmpeg: ffmpegIn(REPO), ffprobe: 'ffprobe', music: musicIn(REPO), ...o });
const plan = (o = {}, t = tools()) => planSteps({ repoRoot: REPO, video: { slug: SLUG, output: MANIFEST.output, voice: 'recording/lidia' }, options: opts(o), tools: t, env: {} });

// --- argumentos y selección de pasos ---------------------------------------------------------------------------

test('parseProduceArgs: valores por defecto y validaciones', () => {
  const o = parseProduceArgs(['--video', SLUG]);
  assert.equal(o.concurrency, 4);
  assert.equal(o.privacy, 'private');
  assert.equal(o.upload, false);
  assert.throws(() => parseProduceArgs([]), UsageError);
  assert.throws(() => parseProduceArgs(['--video', SLUG, '--concurrency', '0']), /entero de 1 a 64/);
  assert.throws(() => parseProduceArgs(['--video', SLUG, '--from', 'audio', '--only', 'audio']), /no se combinan/);
  assert.throws(() => parseProduceArgs(['--video', SLUG, '--privacy', 'public-ish']), /--privacy/);
  assert.throws(() => parseProduceArgs(['--video', '../x']), UsageError);
  assert.throws(() => parseProduceArgs(['--video', SLUG, '--nope']), UsageError);
});

test('selectStepIds: cadena completa, --from, --only y errores', () => {
  assert.deepEqual(selectStepIds(opts()), [...ALL_STEPS]);
  assert.deepEqual(selectStepIds(opts({ from: 'master1' })), ['master1', 'frames', 'master2', 'report']);
  assert.deepEqual(selectStepIds(opts({ only: 'frames' })), ['frames']);
  assert.throws(() => selectStepIds(opts({ only: 'nada' })), /paso desconocido «nada».*audio, program/);
  assert.throws(() => selectStepIds(opts({ from: 'zzz' })), UsageError);
});

test('selectStepIds: --upload añade meta y upload; nombrarlos los activa', () => {
  assert.deepEqual(selectStepIds(opts({ upload: true })), [...ALL_STEPS, 'meta', 'upload']);
  assert.deepEqual(selectStepIds(opts({ upload: true, from: 'report' })), ['report', 'meta', 'upload']);
  assert.deepEqual(selectStepIds(opts({ only: 'upload' })), ['upload']);
  assert.deepEqual(selectStepIds(opts({ from: 'meta' })), ['meta', 'upload']);
  assert.ok(!selectStepIds(opts()).includes('upload'));
});

test('selectStepIds: --master-in-render sustituye program/master1/frames/master2 por render', () => {
  assert.deepEqual(selectStepIds(opts({ masterInRender: true })), ['audio', 'render', 'report']);
  assert.throws(() => selectStepIds(opts({ masterInRender: true, only: 'master1' })), /dentro de «render»/);
});

// --- plan ---------------------------------------------------------------------------------------------------

test('planSteps: cadena completa con los comandos de produce.sh', () => {
  const steps = plan();
  assert.deepEqual(steps.map((s) => s.id), [...ALL_STEPS]);
  const by = Object.fromEntries(steps.map((s) => [s.id, s]));
  assert.deepEqual(by.audio.args.slice(1), ['--video', SLUG]);
  assert.deepEqual(by.program.args.slice(1), ['--video', SLUG, '--out', P.program]);
  assert.deepEqual(by.master1.args.slice(1), ['--audio-in', P.program, '--timeline', P.timeline, '--premaster-out', P.premasterWav, '--ffmpeg', ffmpegIn(REPO), '--bed-style', 'music', '--music', musicIn(REPO)]);
  assert.deepEqual(by.frames.args.slice(1), ['--video', SLUG, '--concurrency', '4']);
  assert.ok(!by.frames.args.includes('--master'));
  assert.deepEqual(by.master2.args.slice(1), ['--video-in', P.premasterMp4, '--premaster', P.premasterWav, '--out', P.mp4, '--ffmpeg', ffmpegIn(REPO), '--bed-style', 'music', '--music', musicIn(REPO), '--timeline', P.timeline]);
  assert.equal(by.master2.pre.kind, 'promote-premaster');
  assert.equal(by.report.cmd, null);
  // el candado: lo toman ellos mismos audio.mjs y render.mjs; produce solo envuelve los pasos que no lo toman
  assert.deepEqual(steps.filter((s) => s.lock).map((s) => s.id), ['program', 'master1', 'master2']);
});

test('planSteps: --concurrency, --from, --only', () => {
  assert.deepEqual(plan({ concurrency: 2, only: 'frames' })[0].args.slice(-2), ['--concurrency', '2']);
  assert.deepEqual(plan({ from: 'frames' }).map((s) => s.id), ['frames', 'master2', 'report']);
  assert.equal(plan({ only: 'report' }).length, 1);
});

test('planSteps: sin --upload nunca hay meta ni upload; con --upload van al final y son privados', () => {
  assert.ok(!plan().some((s) => ['meta', 'upload'].includes(s.id)));
  const steps = plan({ upload: true });
  assert.deepEqual(steps.slice(-2).map((s) => s.id), ['meta', 'upload']);
  assert.deepEqual(steps.at(-1).args.slice(-2), ['--privacy', 'private']);
  assert.deepEqual(plan({ upload: true, privacy: 'unlisted' }).at(-1).args.slice(-2), ['--privacy', 'unlisted']);
});

test('planSteps: --master-in-render usa render.mjs --master y nada de master_mix aparte', () => {
  const steps = plan({ masterInRender: true });
  assert.deepEqual(steps.map((s) => s.id), ['audio', 'render', 'report']);
  assert.ok(steps[1].args.includes('--master'));
  assert.ok(!steps.some((s) => s.args.some((a) => String(a).endsWith('master_mix.py'))));
  assert.ok(plan({ masterInRender: true, generatedBed: true })[1].args.includes('--generated-bed'));
});

test('planSteps: --generated-bed quita --bed-style/--music de master_mix', () => {
  const steps = plan({ generatedBed: true }, tools({ music: null }));
  assert.ok(!steps.find((s) => s.id === 'master1').args.includes('--music'));
  assert.ok(!steps.find((s) => s.id === 'master2').args.includes('--bed-style'));
});

test('planSteps: el ffmpeg va por ruta absoluta y el comando se imprime con comillas', () => {
  const m1 = plan().find((s) => s.id === 'master1');
  assert.ok(path.isAbsolute(m1.args[m1.args.indexOf('--ffmpeg') + 1]));
  const line = formatCommand({ ...m1, env: { MASTER_PYTHON: 'C:/Program Files/py/python.exe' } });
  assert.match(line, /^"C:\/Program Files\/py\/python\.exe" /);
  assert.match(line, /--music ".*Go On Going - Stayloose\.mp3"/);
});

// --- guardias de entorno ---------------------------------------------------------------------------------------------

const resolve = (files, o = {}, extra = {}) =>
  resolveTools({ repoRoot: REPO, mainRoot: MAIN, manifest: MANIFEST, options: opts(o), selected: selectStepIds(opts(o)), env: {}, platform: 'win32', fs: fakeFs(files), ...extra });

test('guardia de música: video.json sin "music" para en seco', () => {
  const r = resolve(healthyFiles(), {}, { manifest: { ...MANIFEST, music: undefined } });
  assert.equal(r.errors.length, 1);
  assert.match(r.errors[0], /no tiene "music"/);
  assert.match(r.errors[0], /--generated-bed/);
  assert.match(r.errors[0], /baja la voz/);
});

test('guardia de música: --generated-bed lo admite a propósito y avisa', () => {
  const r = resolve(healthyFiles(), { generatedBed: true }, { manifest: { ...MANIFEST, music: undefined } });
  assert.deepEqual(r.errors, []);
  assert.equal(r.tools.music, null);
  assert.match(r.warnings[0], /fondo generado/);
});

test('guardia de música: archivo ausente en un worktree dice cómo copiarlo del principal', () => {
  const files = healthyFiles();
  delete files[musicIn(REPO)];
  files[musicIn(MAIN)] = 'x';
  const r = resolve(files);
  assert.equal(r.errors.length, 1);
  assert.match(r.errors[0], /falta .*Go On Going - Stayloose\.mp3/);
  assert.match(r.errors[0], /cp ".*main.*Go On Going - Stayloose\.mp3"/);
  // sin copia en el principal: remite a LICENSES.md
  delete files[musicIn(MAIN)];
  assert.match(resolve(files).errors[0], /LICENSES\.md/);
});

test('guardia de música: pasos sin master (--only audio) no la exigen', () => {
  const files = healthyFiles();
  delete files[musicIn(REPO)];
  assert.deepEqual(resolve(files, { only: 'audio' }).errors, []);
});

test('entorno: el Python por defecto es el venv del checkout principal; CHATTERBOX/MASTER_PYTHON mandan si existen', () => {
  const r = resolve(healthyFiles());
  assert.equal(r.tools.python, venv(MAIN));
  assert.equal(r.env.CHATTERBOX_PYTHON, venv(MAIN));
  assert.equal(r.env.MASTER_PYTHON, venv(MAIN));
  const own = resolve({ ...healthyFiles(), [venv(REPO)]: 'x' });
  assert.equal(own.tools.python, venv(REPO));
  const custom = resolve(healthyFiles(), {}, { env: { MASTER_PYTHON: path.resolve('/otro/python.exe') } });
  assert.match(custom.errors[0], /no encuentro el Python de master_mix/);
  const files = healthyFiles();
  delete files[venv(MAIN)];
  assert.match(resolve(files).errors.join('\n'), /MASTER_PYTHON o CHATTERBOX_PYTHON/);
});

test('entorno: GIT_CONFIG_* safe.directory (y sin pisar los que ya hubiera)', () => {
  assert.deepEqual(resolve(healthyFiles()).env.GIT_CONFIG_COUNT, '1');
  assert.deepEqual(gitSafeDirEnv({}), { GIT_CONFIG_COUNT: '1', GIT_CONFIG_KEY_0: 'safe.directory', GIT_CONFIG_VALUE_0: '*' });
  assert.deepEqual(gitSafeDirEnv({ GIT_CONFIG_COUNT: '2' }), { GIT_CONFIG_COUNT: '3', GIT_CONFIG_KEY_2: 'safe.directory', GIT_CONFIG_VALUE_2: '*' });
});

test('entorno: ffmpeg absoluto; sin node_modules hay error claro con «npm ci»', () => {
  const r = resolve(healthyFiles());
  assert.ok(path.isAbsolute(r.tools.ffmpeg));
  assert.equal(r.tools.ffprobe, path.join(path.dirname(r.tools.ffmpeg), 'ffprobe.exe'));
  const bare = resolve({ [venv(MAIN)]: 'x', [musicIn(REPO)]: 'x' });
  assert.ok(bare.errors.some((e) => /node_modules/.test(e) && /npm ci/.test(e)));
  assert.ok(bare.errors.some((e) => /ffmpeg/.test(e)));
});

test('credenciales de YouTube: solo con --upload, del principal por defecto', () => {
  assert.equal(resolve(healthyFiles()).tools.credentialsDir, null);
  const dir = path.join(MAIN, 'video', 'engine', 'youtube');
  const ok = resolve({ ...healthyFiles(), [path.join(dir, 'client_secret.json')]: 'x', [path.join(dir, 'token.json')]: 'x' }, { upload: true });
  assert.deepEqual(ok.errors, []);
  assert.equal(ok.env.YOUTUBE_CREDENTIALS_DIR, dir);
  assert.match(resolve(healthyFiles(), { upload: true }).errors[0], /client_secret\.json/);
  assert.match(resolve({ ...healthyFiles(), [path.join(dir, 'client_secret.json')]: 'x' }, { upload: true }).errors[0], /token\.json.*--auth/);
});

// --- guardias de estado ---------------------------------------------------------------------------------------------

const check = (files, o = {}) => {
  const options = opts(o);
  const selected = selectStepIds(options);
  return checkPreconditions({ repoRoot: REPO, slug: SLUG, manifest: MANIFEST, options, selected, steps: plan(o), fs: fakeFs(files) });
};

test('estado sano: sin errores desde el principio', () => {
  const r = check(healthyFiles());
  assert.deepEqual(r.errors, []);
});

test('estado: perfil que no es -yt se rechaza', () => {
  const r = checkPreconditions({ repoRoot: REPO, slug: SLUG, manifest: { ...MANIFEST, profile: 'capsula' }, options: opts(), selected: ['audio'], fs: fakeFs(healthyFiles()) });
  assert.match(r.errors[0], /perfiles -yt/);
});

test('estado: tts/ vacío o con menos clips que segmentos se avisa al principio', () => {
  const files = healthyFiles();
  delete files[path.join(P.ttsDir, 's01-02.json')];
  assert.match(check(files).errors[0], /falta importar la grabación: 1 de 2 clips.*s01-02.*import-recording\.mjs --video demo-halden/);
  // sin segmentos en el timeline (aún en estimate) y sin registros en tts/: vacío
  const empty = healthyFiles({ segments: [], extra: { [P.timeline]: { mode: 'estimate', fps: 30, durationInFrames: 1 }, [path.join(P.ttsDir, 'notas.txt')]: 'x' } });
  assert.match(check(empty).errors.join('\n'), /tts\/ está vacío/);
});

test('estado: sin pasar por audio, el timeline en modo estimate bloquea', () => {
  const files = healthyFiles({ extra: { [P.timeline]: { mode: 'estimate', sourceHash: 'h1', segments: [{ id: 's01-01' }, { id: 's01-02' }] } } });
  const e = check(files, { from: 'program' }).errors.join('\n');
  assert.match(e, /modo «estimate», no «audio».*--from audio/);
  // con el paso audio en la tanda no hace falta: audio.mjs lo reconstruye
  assert.ok(!check(files).errors.some((x) => /modo «estimate»/.test(x)));
});

test('estado: verify-voice.json con errores, de otro timeline o ausente bloquea al saltarse audio', () => {
  const bad = healthyFiles({ extra: { [P.verifyVoice]: { sourceHash: 'h1', errors: ['s01-01: palabra cortada'], warnings: [] } } });
  assert.match(check(bad, { from: 'program' }).errors.join('\n'), /1 error\(es\).*palabra cortada.*--from audio/);
  const stale = healthyFiles({ extra: { [P.verifyVoice]: { sourceHash: 'viejo', errors: [] } } });
  assert.match(check(stale, { from: 'frames' }).errors.join('\n'), /otro timeline/);
  const none = healthyFiles();
  delete none[P.verifyVoice];
  assert.match(check(none, { from: 'frames' }).errors.join('\n'), /no existe out\/verify-voice\.json/);
  // con audio en la tanda, un informe viejo con errores solo avisa
  const r = check(bad);
  assert.deepEqual(r.errors, []);
  assert.match(r.warnings[0], /1 error/);
});

test('estado: cada paso exige lo que no crea un paso anterior de la tanda', () => {
  // --from master1 sin program.wav
  const e = check(healthyFiles(), { from: 'master1' }).errors.join('\n');
  assert.match(e, /master1: falta .*program\.wav.*--from program/);
  // --only master2 necesita premaster.wav y un MP4 (crudo o -premaster)
  const e2 = check(healthyFiles(), { only: 'master2' }).errors.join('\n');
  assert.match(e2, /premaster\.wav/);
  assert.match(e2, /no hay ninguno de/);
  const ready = healthyFiles({ extra: { [P.premasterWav]: 'x', [P.premasterMp4]: 'x' } });
  assert.deepEqual(check(ready, { only: 'master2' }).errors, []);
  // --only report necesita el MP4
  assert.match(check(healthyFiles(), { only: 'report' }).errors.join('\n'), /report: falta .*demo-halden\.mp4/);
});

// --- video de partida de master2 ------------------------------------------------------------------------------------

test('decideVideoSource: nunca renombra un master anterior encima del render crudo', () => {
  assert.equal(decideVideoSource({ framesRan: true, mp4Exists: true, premasterExists: true }).action, 'rename');
  assert.equal(decideVideoSource({ framesRan: false, mp4Exists: true, premasterExists: true }).action, 'reuse');
  assert.equal(decideVideoSource({ framesRan: false, mp4Exists: false, premasterExists: true }).action, 'reuse');
  assert.equal(decideVideoSource({ framesRan: false, mp4Exists: true, premasterExists: false }).action, 'rename');
  assert.equal(decideVideoSource({ framesRan: false, mp4Exists: false, premasterExists: false }).action, 'error');
});

// --- reanudar y resúmenes -----------------------------------------------------------------------------------------------

test('resumeCommand: conserva las opciones de la tanda', () => {
  assert.equal(resumeCommand(opts(), 'master1'), 'node video/engine/scripts/produce.mjs --video demo-halden --from master1');
  assert.equal(
    resumeCommand(opts({ concurrency: 2, upload: true, privacy: 'unlisted', generatedBed: true }), 'frames'),
    'node video/engine/scripts/produce.mjs --video demo-halden --from frames --concurrency 2 --upload --privacy unlisted --generated-bed',
  );
  assert.match(resumeCommand(opts({ masterInRender: true }), 'render'), /--from render --master-in-render$/);
});

test('tailLines: cuenta \\r como salto y descarta vacías', () => {
  const text = `uno\n\ndos\r30%\r60%\r100%\ntres\n`;
  assert.deepEqual(tailLines(text, 3), ['60%', '100%', 'tres']);
  assert.deepEqual(tailLines(undefined), []);
});

const MASTER_OUT = `master_mix: program -21.3 LUFS, true peak -3.2 dBTP, 264.0 s
  bed (music): -34.5 LUFS (-13.2 LU vs program)
  auto-level: -0.0 dB -> limiter active 2.10% of the time, max 1.6 dB
  auto-level: -1.0 dB -> limiter active 0.40% of the time, max 0.8 dB
  auto-level: programme lowered by 1.0 dB
  master: -15.0 LUFS, true peak -1.0 dBTP (limiter at -1.00), limiter active 0.40% of the time, max 0.8 dB
  delivered MP4: -15.1 LUFS, true peak -1.05 dBTP
  -> out/demo-halden.mp4`;

test('summarizeMaster: LUFS entregados, fondo, limitador y nivel automático', () => {
  const s = summarizeMaster(MASTER_OUT);
  assert.equal(s.deliveredLufs, -15.1);
  assert.equal(s.deliveredTruePeak, -1.05);
  assert.equal(s.programLufs, -21.3);
  assert.equal(s.bedStyle, 'music');
  assert.equal(s.bedVsProgramLu, -13.2);
  assert.equal(s.limiterActivePct, 0.4);
  assert.equal(s.limiterMaxDb, 0.8);
  assert.equal(s.autoLevelDropDb, 1.0);
  assert.equal(s.generatedBed, false);
  assert.deepEqual(s.warnings, []);
});

test('summarizeMaster: detecta el fondo generado y los avisos; sin datos todo es null', () => {
  const s = summarizeMaster('master_mix: WARNING: generated \'story\' bed, not the library music\n  bed (story): -30.0 LUFS (-8.0 LU vs program)\n  warning: the MP4\'s true peak is still -0.5 dBTP, over -1.0 dBTP');
  assert.equal(s.generatedBed, true);
  assert.equal(s.warnings.length, 2);
  const none = summarizeMaster('');
  assert.equal(none.deliveredLufs, null);
  assert.equal(none.generatedBed, false);
});

test('summarizeRender: sincronía y avisos de render.mjs', () => {
  const s = summarizeRender('  A/V sync: 20/28 segment onsets next to a silence end, median offset 0.00 frames\n  aviso: file is 12.0 MB (target 1–3 MB)\nrendered');
  assert.match(s.sync, /median offset 0\.00 frames/);
  assert.deepEqual(s.warnings, ['file is 12.0 MB (target 1–3 MB)']);
});

test('checkDuration: tolerancia de 0,2 s contra el timeline', () => {
  const tl = { durationInFrames: 7925, fps: 30 };
  assert.equal(checkDuration(264.2, tl).ok, true);
  assert.equal(checkDuration(265.0, tl).ok, false);
  assert.equal(checkDuration(NaN, tl).ok, false);
});
