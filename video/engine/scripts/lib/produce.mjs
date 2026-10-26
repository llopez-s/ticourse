// Lógica pura de produce.mjs (la cadena de producción de un vídeo ya importado): qué pasos hay, en qué
// orden, con qué comandos, qué hay que comprobar antes de empezar y cómo se resume lo que dijeron master_mix y
// render.mjs. No importa paths.mjs (que lee --video al cargarse) ni lanza procesos: todo lo que toca el disco
// entra por un objeto `fs` ({exists, readJson, readdir}), así los tests usan carpetas falsas.
//
// La cadena (la que se hacía a mano con produce.sh en V39/V43):
//   audio   -> audio.mjs (build-timeline + verify-voice)
//   program -> render-audio.mjs  (out/<output>-program.wav)
//   master1 -> master_mix.py etapa 1 (música de biblioteca bajo la voz -> out/<output>-premaster.wav)
//   frames  -> render.mjs (sin --master) -> out/<output>.mp4 + póster
//   master2 -> master_mix.py etapa 2 (limitador, AAC, mux) sobre out/<output>-premaster.mp4
//   report  -> duración vs timeline, LUFS entregados, avisos; borra el program.wav
// y con --upload: meta (youtube-meta.mjs) y upload (youtube-upload.mjs, privado por defecto).
// La etapa 1 y la 2 de master_mix van SIEMPRE separadas del render: render.mjs --master las encadena en
// paralelo y agota la RAM de este PC (--master-in-render lo reactiva para máquinas con memoria).
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { profileFor } from './profiles.mjs';

export const ALL_STEPS = Object.freeze(['audio', 'program', 'master1', 'frames', 'master2', 'report']);
/** Con --master-in-render: master_mix corre dentro de render.mjs, en paralelo con los fotogramas. */
export const RENDER_MASTER_STEPS = Object.freeze(['audio', 'render', 'report']);
export const UPLOAD_STEPS = Object.freeze(['meta', 'upload']);

export const STEP_LABELS = Object.freeze({
  audio: 'audio.mjs (timeline + comprobación de la voz)',
  program: 'render-audio.mjs (audio del programa)',
  master1: 'master_mix etapa 1 (música bajo la voz)',
  frames: 'render.mjs (fotogramas, sin --master)',
  master2: 'master_mix etapa 2 (limitador + AAC + mux)',
  render: 'render.mjs --master (fotogramas y master en paralelo)',
  report: 'informe final',
  meta: 'youtube-meta.mjs',
  upload: 'youtube-upload.mjs',
});

/** Pasos que ningún script bloquea por su cuenta: produce.mjs toma el candado de trabajos pesados por ellos. */
const LOCKED_BY_PRODUCE = new Set(['program', 'master1', 'master2']);

export const PRIVACY = Object.freeze(['private', 'unlisted', 'public']);
export const DURATION_TOLERANCE_S = 0.2;
export const DEFAULT_CONCURRENCY = 4;

export class UsageError extends Error {}

export const USAGE = `uso: node video/engine/scripts/produce.mjs --video <slug> [--concurrency 4] [--from <paso>] [--only <paso>] [--dry-run] [--upload]
                                                     [--privacy private|unlisted|public] [--generated-bed] [--master-in-render]
pasos: ${ALL_STEPS.join(' -> ')}   (con --upload: ${UPLOAD_STEPS.join(' -> ')}; con --master-in-render: ${RENDER_MASTER_STEPS.join(' -> ')})`;

// --- argumentos ---------------------------------------------------------------------------------------------

/** argv (sin node ni el script) -> opciones validadas. Lanza UsageError. */
export function parseProduceArgs(argv) {
  let values;
  try {
    ({ values } = parseArgs({
      args: argv,
      allowPositionals: false,
      options: {
        video: { type: 'string' },
        concurrency: { type: 'string' },
        from: { type: 'string' },
        only: { type: 'string' },
        'dry-run': { type: 'boolean', default: false },
        upload: { type: 'boolean', default: false },
        privacy: { type: 'string', default: 'private' },
        'generated-bed': { type: 'boolean', default: false },
        'master-in-render': { type: 'boolean', default: false },
        help: { type: 'boolean', default: false },
      },
    }));
  } catch (err) {
    throw new UsageError(`${err.message}\n${USAGE}`);
  }
  if (values.help) return { help: true };
  if (!values.video || !/^[a-z0-9][a-z0-9-]*$/.test(values.video)) throw new UsageError(`falta --video <slug> (carpeta de video/)\n${USAGE}`);
  const concurrency = values.concurrency === undefined ? DEFAULT_CONCURRENCY : Number(values.concurrency);
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 64) throw new UsageError(`--concurrency debe ser un entero de 1 a 64 (recibido «${values.concurrency}»)`);
  if (values.from && values.only) throw new UsageError('--from y --only no se combinan: elige uno');
  if (!PRIVACY.includes(values.privacy)) throw new UsageError(`--privacy debe ser ${PRIVACY.join(', ')} (recibido «${values.privacy}»)`);
  return {
    video: values.video,
    concurrency,
    from: values.from,
    only: values.only,
    dryRun: values['dry-run'],
    upload: values.upload,
    privacy: values.privacy,
    generatedBed: values['generated-bed'],
    masterInRender: values['master-in-render'],
  };
}

/** Nombrar meta/upload en --from/--only equivale a pedir --upload. */
export function wantsUpload(options) {
  return Boolean(options.upload || UPLOAD_STEPS.includes(options.from) || UPLOAD_STEPS.includes(options.only));
}

/** Todos los pasos del modo elegido, en orden. */
export function stepIdsFor(options) {
  return [...(options.masterInRender ? RENDER_MASTER_STEPS : ALL_STEPS), ...(wantsUpload(options) ? UPLOAD_STEPS : [])];
}

/** Pasos que se ejecutan una vez aplicados --from / --only. Lanza UsageError si el nombre no existe. */
export function selectStepIds(options) {
  const ids = stepIdsFor(options);
  const named = options.from ?? options.only;
  if (named === undefined) return ids;
  if (!ids.includes(named)) {
    const hint = ALL_STEPS.includes(named) && options.masterInRender ? ' (con --master-in-render program, master1, frames y master2 van dentro de «render»)' : '';
    throw new UsageError(`paso desconocido «${named}»${hint}. Pasos de este modo: ${ids.join(', ')}`);
  }
  return options.only ? [named] : ids.slice(ids.indexOf(named));
}

/** El comando para retomar desde un paso, con las mismas opciones que la tanda. */
export function resumeCommand(options, stepId) {
  const parts = ['node video/engine/scripts/produce.mjs', `--video ${options.video}`, `--from ${stepId}`];
  if (options.concurrency !== DEFAULT_CONCURRENCY) parts.push(`--concurrency ${options.concurrency}`);
  if (wantsUpload(options)) parts.push('--upload');
  if (options.privacy && options.privacy !== 'private') parts.push(`--privacy ${options.privacy}`);
  if (options.generatedBed) parts.push('--generated-bed');
  if (options.masterInRender) parts.push('--master-in-render');
  return parts.join(' ');
}

// --- rutas -------------------------------------------------------------------------------------------------

/** Todo lo que la cadena lee o escribe, para un vídeo de perfil -yt. */
export function outPaths(repoRoot, slug, output) {
  const dir = path.join(repoRoot, 'video', slug);
  const outDir = path.join(dir, 'out');
  return {
    dir,
    outDir,
    timeline: path.join(dir, 'src', 'timeline.json'),
    narration: path.join(dir, 'narration.json'),
    ttsDir: path.join(dir, 'tts'),
    voiceDir: path.join(dir, 'public', 'voice'),
    verifyVoice: path.join(outDir, 'verify-voice.json'),
    program: path.join(outDir, `${output}-program.wav`),
    premasterWav: path.join(outDir, `${output}-premaster.wav`),
    premasterMp4: path.join(outDir, `${output}-premaster.mp4`),
    mp4: path.join(outDir, `${output}.mp4`),
    poster: path.join(repoRoot, 'public', 'videos', `${output}-poster.png`),
    youtubeMd: path.join(outDir, 'youtube.md'),
    uploadJson: path.join(outDir, 'youtube-upload.json'),
    scripts: path.join(repoRoot, 'video', 'engine', 'scripts'),
    musicDir: path.join(repoRoot, 'video', 'engine', 'music', 'library'),
  };
}

export const isRecordingVoice = (voice) => typeof voice === 'string' && voice.startsWith('recording/');

// --- herramientas y entorno ---------------------------------------------------------------------------------

/** fs real, con la forma que esperan las funciones de este módulo. */
export const nodeFs = {
  exists: (p) => existsSync(p),
  readJson: (p) => {
    try {
      return JSON.parse(readFileSync(p, 'utf8').replace(/^﻿/, ''));
    } catch {
      return null;
    }
  },
  readdir: (p) => {
    try {
      return readdirSync(p);
    } catch {
      return [];
    }
  },
};

/** GIT_CONFIG_* para que `git check-ignore` de render.mjs no falle por «dubious ownership» en un worktree. */
export function gitSafeDirEnv(env = {}) {
  const n = Number.parseInt(env.GIT_CONFIG_COUNT ?? '0', 10) || 0;
  return { GIT_CONFIG_COUNT: String(n + 1), [`GIT_CONFIG_KEY_${n}`]: 'safe.directory', [`GIT_CONFIG_VALUE_${n}`]: '*' };
}

const venvPython = (root, platform) =>
  platform === 'win32' ? path.join(root, 'video', 'engine', '.venv-chatterbox', 'Scripts', 'python.exe') : path.join(root, 'video', 'engine', '.venv-chatterbox', 'bin', 'python');

const hasSeparator = (p) => /[\\/]/.test(p);

/** El compositor de Remotion (ffmpeg y ffprobe, por ruta ABSOLUTA: en Windows master_mix no acepta una relativa). */
export function findFfmpeg(repoRoot, platform, fs) {
  const dir = path.join(repoRoot, 'node_modules', '@remotion');
  const ext = platform === 'win32' ? '.exe' : '';
  for (const name of fs.readdir(dir)) {
    const ffmpeg = path.resolve(dir, name, `ffmpeg${ext}`);
    if (name.startsWith('compositor-') && fs.exists(ffmpeg)) return { ffmpeg, ffprobe: path.resolve(dir, name, `ffprobe${ext}`) };
  }
  return null;
}

/**
 * Resuelve Python, ffmpeg, música y credenciales y comprueba los guardias de entorno que corresponden a los
 * pasos elegidos. Devuelve {tools, env, errors, warnings}; si hay errors no se planifica nada.
 * @param {object} c {repoRoot, mainRoot, manifest, options, selected, env, platform, fs}
 */
export function resolveTools({ repoRoot, mainRoot = repoRoot, manifest, options, selected, env = {}, platform = process.platform, fs = nodeFs }) {
  const errors = [];
  const warnings = [];
  const has = (...ids) => ids.some((id) => selected.includes(id));
  const needsMaster = has('master1', 'master2', 'render');
  const needsRemotion = has('program', 'frames', 'render');

  // node_modules del repo actual: un worktree sin `npm ci` ni enlace no renderiza nada.
  if (needsRemotion || needsMaster) {
    const cli = path.join(repoRoot, 'node_modules', '@remotion', 'cli', 'remotion-cli.js');
    if (!fs.exists(cli)) errors.push(`falta ${cli}: este checkout no tiene node_modules. Ejecuta «npm ci» en ${repoRoot} (o enlaza el node_modules del checkout principal)`);
  }

  // Python de master_mix / Chatterbox: el worktree no trae .venv-chatterbox, se pide prestado el del principal.
  const own = venvPython(repoRoot, platform);
  const main = venvPython(mainRoot, platform);
  const chatterbox = env.CHATTERBOX_PYTHON || [own, main].find((p) => fs.exists(p)) || main;
  const master = env.MASTER_PYTHON || chatterbox;
  if (needsMaster && hasSeparator(master) && !fs.exists(master)) {
    errors.push(`no encuentro el Python de master_mix (${master}). Define MASTER_PYTHON o CHATTERBOX_PYTHON con un Python que tenga pedalboard, pyloudnorm, soundfile, scipy y librosa (en el checkout principal: video/engine/.venv-chatterbox)`);
  }

  // ffmpeg por ruta absoluta.
  const ff = findFfmpeg(repoRoot, platform, fs);
  if ((needsMaster || has('report')) && !ff) errors.push(`no encuentro el ffmpeg de Remotion bajo ${path.join(repoRoot, 'node_modules', '@remotion')} (compositor-*): ejecuta «npm ci» en ${repoRoot}`);

  // Música: sin ella master_mix usa su fondo generado, que sonó a ruido y bajó la voz (V47, AP01–AP04, V49/V50).
  let music = null;
  if (needsMaster) {
    if (options.generatedBed) {
      warnings.push('--generated-bed: se masteriza sobre el fondo generado de master_mix (más fuerte y suena a ruido de fondo; solo a propósito)');
    } else if (!manifest.music) {
      errors.push('video.json no tiene "music": añade "music": "Go On Going - Stayloose.mp3" (la pista de biblioteca que usan todos los vídeos) o pasa --generated-bed para masterizar sobre el fondo generado A PROPÓSITO. Sin música el fondo generado suena a ruido y baja la voz');
    } else {
      music = path.join(repoRoot, 'video', 'engine', 'music', 'library', manifest.music);
      if (!fs.exists(music)) {
        const fromMain = path.join(mainRoot, 'video', 'engine', 'music', 'library', manifest.music);
        const where = path.dirname(music);
        const tip =
          mainRoot !== repoRoot && fs.exists(fromMain)
            ? `cópiala desde el checkout principal: mkdir -p "${where}" && cp "${fromMain}" "${where}${path.sep}"`
            : 'descárgala otra vez (music/LICENSES.md dice de dónde) y déjala ahí; la carpeta music/library/ está fuera de git y un clon o worktree nuevo no la trae (README del motor, «Masterización»)';
        errors.push(`video.json nombra la música «${manifest.music}» pero falta ${music}: ${tip}`);
        music = null;
      }
    }
  }

  // Credenciales de YouTube: solo si se sube.
  let credentialsDir = null;
  if (has('upload')) {
    const candidates = [env.YOUTUBE_CREDENTIALS_DIR, path.join(repoRoot, 'video', 'engine', 'youtube'), path.join(mainRoot, 'video', 'engine', 'youtube')].filter(Boolean);
    credentialsDir = candidates.find((d) => fs.exists(path.join(d, 'client_secret.json'))) ?? null;
    const dir = credentialsDir ?? candidates[0] ?? path.join(mainRoot, 'video', 'engine', 'youtube');
    if (!credentialsDir) errors.push(`no encuentro client_secret.json de YouTube (probé ${candidates.join(', ')}): define YOUTUBE_CREDENTIALS_DIR o crea ${dir} (youtube-upload.mjs --auth, cabecera del script)`);
    else if (!fs.exists(path.join(dir, 'token.json'))) errors.push(`falta ${path.join(dir, 'token.json')}: ejecuta node video/engine/scripts/youtube-upload.mjs --auth una vez`);
  }

  const stepEnv = {
    CHATTERBOX_PYTHON: chatterbox,
    MASTER_PYTHON: master,
    ...gitSafeDirEnv(env),
    ...(credentialsDir ? { YOUTUBE_CREDENTIALS_DIR: credentialsDir } : {}),
  };
  return { tools: { python: master, chatterbox, ffmpeg: ff?.ffmpeg ?? null, ffprobe: ff?.ffprobe ?? null, music, credentialsDir }, env: stepEnv, errors, warnings };
}

// --- plan ---------------------------------------------------------------------------------------------------

/**
 * Los pasos a ejecutar, con el comando exacto de cada uno.
 * Cada paso: {id, label, cmd, args, env, cwd, lock, requires, requiresAny, pre, expects}. `cmd` es 'node',
 * 'python' (tools.python) o null para pasos internos (report).
 * @param {object} c {repoRoot, video: {slug, output, voice}, options, tools, env}
 */
export function planSteps({ repoRoot, video, options, tools, env }) {
  const p = outPaths(repoRoot, video.slug, video.output);
  const script = (name) => path.join(p.scripts, name);
  const bed = tools.music ? ['--bed-style', 'music', '--music', tools.music] : [];
  const ffmpeg = tools.ffmpeg ?? '<ffmpeg>'; // sin ffmpeg resolveTools ya dio error: el plan solo sirve para comprobar requisitos
  const recording = isRecordingVoice(video.voice);
  const base = { cwd: repoRoot, env, requires: [], requiresAny: [], expects: [], lock: false, pre: null };
  const defs = {
    audio: { cmd: 'node', args: [script('audio.mjs'), '--video', video.slug], expects: [p.timeline, ...(recording ? [p.verifyVoice] : [])] },
    program: { cmd: 'node', args: [script('render-audio.mjs'), '--video', video.slug, '--out', p.program], requires: [p.timeline], expects: [p.program] },
    master1: {
      cmd: 'python',
      args: [script('master_mix.py'), '--audio-in', p.program, '--timeline', p.timeline, '--premaster-out', p.premasterWav, '--ffmpeg', ffmpeg, ...bed],
      requires: [p.program],
      expects: [p.premasterWav],
    },
    frames: { cmd: 'node', args: [script('render.mjs'), '--video', video.slug, '--concurrency', String(options.concurrency)], expects: [p.mp4, p.poster] },
    master2: {
      cmd: 'python',
      args: [script('master_mix.py'), '--video-in', p.premasterMp4, '--premaster', p.premasterWav, '--out', p.mp4, '--ffmpeg', ffmpeg, ...bed, '--timeline', p.timeline],
      requires: [p.premasterWav],
      requiresAny: [[p.mp4, p.premasterMp4]],
      // El render crudo se aparta a -premaster.mp4 y el master toma el nombre final (ver decideVideoSource).
      pre: { kind: 'promote-premaster', mp4: p.mp4, premasterMp4: p.premasterMp4 },
      expects: [p.mp4],
    },
    render: {
      cmd: 'node',
      args: [script('render.mjs'), '--video', video.slug, '--concurrency', String(options.concurrency), '--master', ...(options.generatedBed ? ['--generated-bed'] : [])],
      expects: [p.mp4, p.poster],
    },
    report: { cmd: null, args: [], requires: [p.mp4], internal: 'report' },
    meta: { cmd: 'node', args: [script('youtube-meta.mjs'), '--video', video.slug], requires: [p.mp4], expects: [p.youtubeMd] },
    upload: { cmd: 'node', args: [script('youtube-upload.mjs'), '--video', video.slug, '--privacy', options.privacy], requires: [p.mp4, p.youtubeMd], expects: [p.uploadJson] },
  };
  return selectStepIds(options).map((id) => ({ id, label: STEP_LABELS[id], ...base, ...defs[id], lock: LOCKED_BY_PRODUCE.has(id), paths: p }));
}

/** Una línea de shell legible para un paso (los argumentos con espacios van entre comillas). */
export function formatCommand(step, nodeName = 'node') {
  if (!step.cmd) return `(interno: ${step.internal})`;
  // Entre comillas dobles sin duplicar las barras invertidas de Windows: la línea se puede copiar tal cual.
  const q = (a) => (/[\s"]/.test(a) ? `"${a.replaceAll('"', '\\"')}"` : a);
  const cmd = step.cmd === 'node' ? nodeName : step.cmd === 'python' ? step.env?.MASTER_PYTHON ?? 'python' : step.cmd;
  return [cmd, ...step.args].map(q).join(' ');
}

// --- comprobaciones previas -----------------------------------------------------------------------------------

/**
 * Guardias sobre el estado del vídeo antes de lanzar nada (perfil, importación, timeline, informe de la voz y
 * ficheros que cada paso necesita y ningún paso anterior de esta tanda va a crear).
 * @param {object} c {repoRoot, slug, manifest, options, selected, steps?, fs}
 * @returns {{errors: string[], warnings: string[]}}
 */
export function checkPreconditions({ repoRoot, slug, manifest, options, selected, steps = null, fs = nodeFs }) {
  const errors = [];
  const warnings = [];
  const has = (...ids) => ids.some((id) => selected.includes(id));
  const p = outPaths(repoRoot, slug, manifest.output);
  const resume = (id) => resumeCommand(options, id);

  if (profileFor(manifest.profile).host !== 'youtube') {
    errors.push(`el perfil «${manifest.profile}» renderiza a public/videos y se sube al repo; produce.mjs trabaja los perfiles -yt (out/ ignorado por git)`);
    return { errors, warnings };
  }

  const timeline = fs.exists(p.timeline) ? fs.readJson(p.timeline) : null;
  const narration = fs.exists(p.narration) ? fs.readJson(p.narration) : null;
  const recording = isRecordingVoice(narration?.voice ?? timeline?.voice);
  const runsAudio = has('audio');
  const needsClips = has('audio', 'program', 'frames', 'render');

  // 1. Importación: sin clips no hay nada que montar.
  if (recording && needsClips) {
    const segments = Array.isArray(timeline?.segments) ? timeline.segments.filter((s) => s.id) : [];
    if (segments.length) {
      const missing = segments.filter((s) => !fs.exists(path.join(p.ttsDir, `${s.id}.json`)) || !fs.exists(path.join(p.voiceDir, `${s.id}.mp3`))).map((s) => s.id);
      if (missing.length) {
        errors.push(`falta importar la grabación: ${missing.length} de ${segments.length} clips no están en tts/ y public/voice (${missing.slice(0, 6).join(', ')}${missing.length > 6 ? ', …' : ''}). Ejecuta import-recording.mjs --video ${slug} antes de producir`);
      }
    } else if (!fs.readdir(p.ttsDir).some((f) => f.endsWith('.json') && !f.endsWith('-intercept.json'))) {
      errors.push(`tts/ está vacío o no existe (${p.ttsDir}): la grabación no está importada. Ejecuta import-recording.mjs --video ${slug} antes de producir`);
    }
  }

  // 2. Timeline: sin el audio.mjs de esta tanda tiene que estar ya en modo audio.
  if (!runsAudio && has('program', 'frames', 'master1', 'master2', 'render')) {
    if (!timeline) errors.push(`no existe ${p.timeline}: empieza por el paso audio (${resume('audio')})`);
    else if (timeline.mode !== 'audio') errors.push(`src/timeline.json está en modo «${timeline.mode}», no «audio»: ejecuta primero el paso audio (${resume('audio')})`);
  }

  // 3. Informe de la voz (render.mjs lo exige para una grabación): con errores, o de otro timeline, no se sigue.
  if (recording && !runsAudio && has('program', 'frames', 'master1', 'master2', 'render')) {
    const report = fs.exists(p.verifyVoice) ? fs.readJson(p.verifyVoice) : null;
    if (!report) errors.push(`no existe out/verify-voice.json: la voz no se ha comprobado. Ejecuta el paso audio (${resume('audio')})`);
    else if (Array.isArray(report.errors) && report.errors.length) {
      errors.push(`out/verify-voice.json tiene ${report.errors.length} error(es) (${String(report.errors[0]).slice(0, 120)}…): arregla los clips y repite desde audio (${resume('audio')})`);
    } else if (timeline && report.sourceHash !== timeline.sourceHash) {
      errors.push(`out/verify-voice.json es de otro timeline: repite la comprobación (${resume('audio')})`);
    }
  } else if (recording && runsAudio && fs.exists(p.verifyVoice)) {
    const report = fs.readJson(p.verifyVoice);
    if (report?.errors?.length) warnings.push(`el out/verify-voice.json anterior tenía ${report.errors.length} error(es); el paso audio lo vuelve a generar y se para si siguen`);
  }

  // 4. Ficheros que cada paso necesita y que no crea un paso anterior de esta misma tanda.
  const produced = new Set();
  for (const step of steps ?? []) {
    for (const need of step.requires ?? []) {
      if (!produced.has(need) && !fs.exists(need)) errors.push(`${step.id}: falta ${path.relative(repoRoot, need)}; lo crea un paso anterior (retoma desde ahí, p. ej. ${resume(creatorOf(need, p, options))})`);
    }
    for (const group of step.requiresAny ?? []) {
      if (!group.some((f) => produced.has(f) || fs.exists(f))) errors.push(`${step.id}: no hay ninguno de ${group.map((f) => path.relative(repoRoot, f)).join(' / ')}; renderiza antes (${resume(options.masterInRender ? 'render' : 'frames')})`);
    }
    for (const out of step.expects ?? []) produced.add(out);
  }
  return { errors, warnings };
}

/** Paso que normalmente crea un fichero (para el mensaje de «retoma desde»). */
function creatorOf(file, p, options) {
  if (file === p.program) return 'program';
  if (file === p.premasterWav) return 'master1';
  if (file === p.youtubeMd) return 'meta';
  return options.masterInRender ? 'render' : 'frames';
}

/**
 * Qué hacer con el MP4 antes de master2: tras un `frames` de esta tanda, <output>.mp4 es el render crudo y se
 * aparta a -premaster.mp4; si no se renderizó ahora y -premaster.mp4 existe, ese ES el crudo y <output>.mp4 es un
 * master anterior (se sobrescribe, nunca se renombra encima del crudo).
 */
export function decideVideoSource({ framesRan, mp4Exists, premasterExists }) {
  if (framesRan && mp4Exists) return { action: 'rename', note: 'el render nuevo pasa a -premaster.mp4 (se sustituye el anterior)' };
  if (!framesRan && premasterExists) return { action: 'reuse', note: 'se usa el -premaster.mp4 que ya existe; el .mp4 final se sobrescribe' };
  if (!framesRan && mp4Exists) return { action: 'rename', note: 'no había -premaster.mp4: el .mp4 es el render crudo y se aparta' };
  return { action: 'error', note: 'no hay ni <output>.mp4 ni <output>-premaster.mp4: renderiza los fotogramas (--from frames)' };
}

// --- salidas de los subprocesos -----------------------------------------------------------------------------

/** Últimas `n` líneas no vacías (cuenta \r como salto: Remotion repinta su progreso). */
export function tailLines(text, n = 30) {
  return String(text ?? '')
    .split(/\r\n|\r|\n/)
    .filter((l) => l.trim())
    .slice(-n);
}

/** Lo que master_mix.py cuenta de su mezcla (etapa 1 y/o 2). Los campos que no aparecen quedan en null. */
export function summarizeMaster(output) {
  const text = String(output ?? '');
  const last = (re) => {
    const all = [...text.matchAll(re)];
    return all.length ? all[all.length - 1] : null;
  };
  const num = (m, i) => (m ? Number(m[i]) : null);
  const prog = last(/master_mix: program (-?\d+(?:\.\d+)?) LUFS, true peak (-?\d+(?:\.\d+)?) dBTP/g);
  const bed = last(/bed \((\w+)\): (-?\d+(?:\.\d+)?) LUFS \(([+-]\d+(?:\.\d+)?) LU vs program\)/g);
  const delivered = last(/delivered MP4: (-?\d+(?:\.\d+)?) LUFS, true peak (-?\d+(?:\.\d+)?) dBTP/g);
  const limiter = last(/limiter active (\d+(?:\.\d+)?)% of the time, max (\d+(?:\.\d+)?) dB/g);
  const lowered = last(/programme lowered by (\d+(?:\.\d+)?) dB/g);
  return {
    programLufs: num(prog, 1),
    bedStyle: bed ? bed[1] : null,
    bedVsProgramLu: num(bed, 3),
    deliveredLufs: num(delivered, 1),
    deliveredTruePeak: num(delivered, 2),
    limiterActivePct: num(limiter, 1),
    limiterMaxDb: num(limiter, 2),
    autoLevelDropDb: num(lowered, 1),
    generatedBed: /WARNING: generated/i.test(text) || (bed ? bed[1] !== 'music' : false),
    warnings: text.split(/\r?\n/).map((l) => l.trim()).filter((l) => /^warning:|^master_mix: WARNING/i.test(l)),
  };
}

/** Avisos y comprobación de sincronía que imprime render.mjs («  aviso: …», «  A/V sync: …»). */
export function summarizeRender(output) {
  const lines = String(output ?? '').split(/\r?\n/).map((l) => l.trim());
  const sync = lines.find((l) => l.startsWith('A/V sync:') && /median offset/.test(l)) ?? null;
  return { sync, warnings: lines.filter((l) => l.startsWith('aviso:')).map((l) => l.slice('aviso:'.length).trim()) };
}

/** ¿Dura el MP4 lo que dice el timeline? (misma tolerancia que render.mjs) */
export function checkDuration(actualSec, timeline, tolerance = DURATION_TOLERANCE_S) {
  const expected = timeline.durationInFrames / timeline.fps;
  if (!Number.isFinite(actualSec)) return { ok: false, expected, actual: actualSec, message: 'ffprobe no devolvió una duración' };
  const ok = Math.abs(actualSec - expected) <= tolerance;
  return { ok, expected, actual: actualSec, message: `${actualSec.toFixed(2)} s, el timeline dice ${expected.toFixed(2)} s` };
}

/** 4 s, 2 min 5 s, 1 h 3 min */
export function formatDuration(seconds) {
  const s = Math.round(seconds);
  if (s < 60) return `${s} s`;
  if (s < 3600) return `${Math.floor(s / 60)} min ${s % 60} s`;
  return `${Math.floor(s / 3600)} h ${Math.floor((s % 3600) / 60)} min`;
}
