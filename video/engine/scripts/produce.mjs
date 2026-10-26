#!/usr/bin/env node
// Un solo comando para la cadena de producción de un vídeo YA IMPORTADO (clips en tts/ y public/voice): comprueba
// el entorno, ejecuta los pasos en orden y SE DETIENE AL PRIMER ERROR diciendo qué paso falló y cómo retomar.
//
//   node video/engine/scripts/produce.mjs --video <slug> [--concurrency 4] [--from <paso>] [--only <paso>]
//                                         [--dry-run] [--upload [--privacy private|unlisted|public]]
//                                         [--generated-bed] [--master-in-render]
//
//   pasos: audio -> program -> master1 -> frames -> master2 -> report   (+ meta -> upload con --upload)
//   audio    audio.mjs: build-timeline + verify-voice
//   program  render-audio.mjs -> out/<output>-program.wav
//   master1  master_mix.py etapa 1 (música de biblioteca bajo la voz) -> out/<output>-premaster.wav
//   frames   render.mjs (sin --master) -> out/<output>.mp4 + póster
//   master2  master_mix.py etapa 2 sobre out/<output>-premaster.mp4 -> out/<output>.mp4
//   report   duración vs timeline, LUFS entregados, avisos; borra el program.wav
//   meta     youtube-meta.mjs                      (solo con --upload)
//   upload   youtube-upload.mjs, privado por defecto (solo con --upload; sin él NUNCA se sube nada)
//
// --dry-run imprime los guardias y el plan con los comandos exactos y no ejecuta nada.
// --master-in-render usa render.mjs --master (master_mix en paralelo con los fotogramas): más rápido, pero
//   agota la RAM de este PC; los pasos pasan a ser audio -> render -> report.
// --generated-bed masteriza sobre el fondo generado de master_mix a propósito (sin la música de video.json).
// Entorno: CHATTERBOX_PYTHON / MASTER_PYTHON por defecto = .venv-chatterbox del checkout principal; ffmpeg por
// ruta absoluta; GIT_CONFIG_* para el git check-ignore de render.mjs en worktrees; YOUTUBE_CREDENTIALS_DIR
// por defecto = video/engine/youtube del checkout principal. La lógica está en lib/produce.mjs.
//
// Códigos de salida: 0 bien · 1 un paso falló · 2 uso incorrecto o guardia de entorno/estado.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { acquireHeavyLock } from './lib/heavy-lock.mjs';
import {
  USAGE,
  UsageError,
  checkDuration,
  checkPreconditions,
  decideVideoSource,
  formatCommand,
  formatDuration,
  gitSafeDirEnv,
  isRecordingVoice,
  nodeFs,
  outPaths,
  parseProduceArgs,
  planSteps,
  resolveTools,
  resumeCommand,
  selectStepIds,
  summarizeMaster,
  summarizeRender,
  tailLines,
} from './lib/produce.mjs';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const KEEP_CHARS = 400_000;

/** Raíz del checkout principal (el de .git), para pedirle prestados venv, música y credenciales. */
function findMainRoot(repoRoot) {
  const res = spawnSync('git', ['rev-parse', '--git-common-dir'], { cwd: repoRoot, encoding: 'utf8', windowsHide: true, env: { ...process.env, ...gitSafeDirEnv(process.env) } });
  if (res.status !== 0 || !res.stdout.trim()) return repoRoot;
  const gitDir = path.resolve(repoRoot, res.stdout.trim());
  return path.basename(gitDir) === '.git' ? path.dirname(gitDir) : repoRoot;
}

function readManifest(slug) {
  const file = path.join(REPO_ROOT, 'video', slug, 'video.json');
  if (!existsSync(file)) throw new UsageError(`no existe ${file}: ¿está bien el slug «${slug}»?`);
  const manifest = JSON.parse(readFileSync(file, 'utf8').replace(/^﻿/, ''));
  for (const key of ['slug', 'output', 'profile']) if (typeof manifest[key] !== 'string' || !manifest[key]) throw new UsageError(`${file}: "${key}" debe ser un texto no vacío`);
  if (manifest.slug !== slug) throw new UsageError(`${file}: slug «${manifest.slug}» no coincide con su carpeta «${slug}»`);
  return manifest;
}

const stamp = (sec) => (sec < 60 ? `${sec.toFixed(0)} s` : formatDuration(sec));

/** Ejecuta un subproceso mostrando su salida en directo y guardando el final para el informe o el error. */
function runProcess(cmd, args, { cwd, env }) {
  return new Promise((resolve) => {
    let output = '';
    const keep = (chunk) => {
      output += chunk;
      if (output.length > KEEP_CHARS) output = output.slice(-KEEP_CHARS * 0.75);
    };
    let child;
    try {
      child = spawn(cmd, args, { cwd, env, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
    } catch (err) {
      resolve({ status: null, error: err, output });
      return;
    }
    child.stdout.on('data', (d) => {
      process.stdout.write(d);
      keep(d.toString('utf8'));
    });
    child.stderr.on('data', (d) => {
      process.stderr.write(d);
      keep(d.toString('utf8'));
    });
    child.on('error', (err) => resolve({ status: null, error: err, output }));
    child.on('close', (status, signal) => resolve({ status: status ?? (signal ? 1 : 0), signal, output }));
  });
}

class StepFailure extends Error {}

async function runStep(step, run) {
  const { options, tools, results, steps } = run;
  // Los ficheros que el paso necesita tienen que estar ya (los de pasos anteriores de esta tanda acaban de crearse).
  for (const need of step.requires) if (!existsSync(need)) throw new StepFailure(`falta ${path.relative(REPO_ROOT, need)}`);
  for (const group of step.requiresAny) if (!group.some((f) => existsSync(f))) throw new StepFailure(`no hay ninguno de ${group.map((f) => path.relative(REPO_ROOT, f)).join(' / ')}`);

  if (step.internal === 'report') return report(step, run);

  if (step.pre?.kind === 'promote-premaster') {
    const decision = decideVideoSource({
      framesRan: steps.some((s) => s.id === 'frames') && results.has('frames'),
      mp4Exists: existsSync(step.pre.mp4),
      premasterExists: existsSync(step.pre.premasterMp4),
    });
    console.log(`  vídeo de partida: ${decision.note}`);
    if (decision.action === 'error') throw new StepFailure(decision.note);
    if (decision.action === 'rename') {
      rmSync(step.pre.premasterMp4, { force: true });
      renameSync(step.pre.mp4, step.pre.premasterMp4);
    }
  }

  const cmd = step.cmd === 'node' ? process.execPath : step.cmd === 'python' ? tools.python : step.cmd;
  // El candado de trabajos pesados lo toman ellos mismos audio.mjs (verify-voice) y render.mjs; los demás pasos
  // pesados no, y aquí se envuelven. Tomarlo también para los primeros haría que el hijo esperase para siempre.
  const release = step.lock ? acquireHeavyLock(`produce ${step.id} ${options.video}`) : () => {};
  let res;
  try {
    res = await runProcess(cmd, step.args, { cwd: step.cwd, env: { ...process.env, ...step.env } });
  } finally {
    release();
  }
  if (res.error) throw Object.assign(new StepFailure(`no se pudo lanzar ${cmd}: ${res.error.message}`), { output: res.output });
  if (res.status !== 0) throw Object.assign(new StepFailure(`salió con código ${res.status}${res.signal ? ` (${res.signal})` : ''}`), { output: res.output });
  const missing = step.expects.filter((f) => !existsSync(f));
  if (missing.length) throw Object.assign(new StepFailure(`terminó bien pero no dejó ${missing.map((f) => path.relative(REPO_ROOT, f)).join(', ')}`), { output: res.output });
  return { output: res.output };
}

/** Paso final: duración del MP4 contra el timeline, qué dijeron master_mix y render.mjs, y limpieza del program.wav. */
function report(step, run) {
  const { tools, results, video, timeline: timelineFile, started } = run;
  const p = step.paths;
  const timeline = JSON.parse(readFileSync(timelineFile, 'utf8'));
  const probe = spawnSync(tools.ffprobe, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'json', p.mp4], { encoding: 'utf8', windowsHide: true });
  if (probe.status !== 0) throw new StepFailure(`ffprobe no pudo leer ${p.mp4}: ${(probe.stderr || probe.error?.message || '').trim().split('\n').pop()}`);
  const dur = checkDuration(Number(JSON.parse(probe.stdout).format?.duration), timeline);
  if (!dur.ok) throw new StepFailure(`el MP4 final dura ${dur.message} (tolerancia 0,2 s)`);

  const out = (id) => results.get(id)?.output ?? '';
  const master = summarizeMaster(`${out('master1')}\n${out('master2')}\n${out('render')}`);
  const render = summarizeRender(`${out('frames')}\n${out('render')}`);
  const voice = existsSync(p.verifyVoice) ? JSON.parse(readFileSync(p.verifyVoice, 'utf8')) : null;
  rmSync(p.program, { force: true });

  const fmt = (v, unit = '') => (v === null || v === undefined ? '?' : `${v}${unit}`);
  console.log(`\n== resumen de ${video.slug}`);
  console.log(`  MP4        ${p.mp4}`);
  console.log(`             ${formatDuration(dur.actual)} (${dur.message}) · ${(statSync(p.mp4).size / 1e6).toFixed(1)} MB · duración OK`);
  if (master.deliveredLufs !== null) {
    console.log(`  sonoridad  ${master.deliveredLufs} LUFS entregados, pico real ${fmt(master.deliveredTruePeak, ' dBTP')}`);
    console.log(`             fondo: ${fmt(master.bedStyle)}${master.bedVsProgramLu !== null ? ` (${master.bedVsProgramLu > 0 ? '+' : ''}${master.bedVsProgramLu} LU respecto al programa)` : ''}` + `${master.limiterActivePct !== null ? ` · limitador activo ${master.limiterActivePct}% (máx ${master.limiterMaxDb} dB)` : ''}${master.autoLevelDropDb ? ` · programa bajado ${master.autoLevelDropDb} dB` : ''}`);
  } else {
    console.log('  sonoridad  no medida en esta tanda (master_mix etapa 2 no corrió aquí)');
  }
  if (master.generatedBed) console.log('  AVISO      se usó el fondo generado, no la música de biblioteca: suena a ruido de fondo y baja la voz. Repite con la música (video.json "music")');
  for (const w of master.warnings) console.log(`  aviso      master_mix: ${w}`);
  if (render.sync) console.log(`  sincronía  ${render.sync.replace(/^A\/V sync:\s*/, '')}`);
  for (const w of render.warnings) console.log(`  aviso      render: ${w}`);
  if (voice && Array.isArray(voice.warnings) && voice.warnings.length) console.log(`  aviso      verify-voice: ${voice.warnings.length} aviso(s), mira out/verify-voice.md`);
  const times = [...results.entries()].map(([id, r]) => `${id} ${stamp(r.seconds)}`);
  console.log(`  tiempos    ${times.join(' · ')} · total ${stamp((Date.now() - started) / 1000)}`);
  return { output: '' };
}

function printPlan(run, preconditionWarnings) {
  const { options, tools, steps, mainRoot, video } = run;
  console.log(`produce.mjs --dry-run · ${video.slug} (${video.output}, perfil ${video.profile}${video.music ? `, música ${video.music}` : ''})`);
  console.log(`  repo       ${REPO_ROOT}${mainRoot !== REPO_ROOT ? `\n  principal  ${mainRoot}` : ''}`);
  console.log(`  python     ${tools.python}`);
  console.log(`  ffmpeg     ${tools.ffmpeg ?? '(no encontrado)'}`);
  console.log(`  música     ${tools.music ?? (options.generatedBed ? '(fondo generado, a propósito)' : '(ninguna)')}`);
  if (tools.credentialsDir) console.log(`  YouTube    ${tools.credentialsDir}  (subida ${options.privacy})`);
  for (const w of preconditionWarnings) console.log(`  aviso      ${w}`);
  console.log(`\nPlan (${steps.length} paso${steps.length === 1 ? '' : 's'}; se para en el primero que falle):`);
  steps.forEach((step, i) => {
    console.log(`\n${i + 1}. ${step.id} — ${step.label}${step.lock ? '  [toma el candado de trabajos pesados]' : ''}`);
    console.log(`   $ ${formatCommand(step)}`);
    if (step.pre) console.log('   antes: el render crudo <output>.mp4 pasa a <output>-premaster.mp4 (o se reutiliza si ya existe)');
    if (step.internal) console.log('   mide la duración del MP4 final (ffprobe) contra el timeline, resume LUFS y avisos y borra el program.wav');
    for (const f of step.expects) console.log(`   deja: ${path.relative(REPO_ROOT, f)}`);
    if (step.id === 'upload') console.log('   (sin --upload este paso no existe: nunca se sube nada por accidente)');
  });
  console.log(`\nSi un paso falla: ${resumeCommand(options, '<paso>')}`);
}

async function main() {
  const options = parseProduceArgs(process.argv.slice(2));
  if (options.help) {
    console.log(USAGE);
    return 0;
  }
  const manifest = readManifest(options.video);
  const p = outPaths(REPO_ROOT, options.video, manifest.output);
  const narration = nodeFs.exists(p.narration) ? nodeFs.readJson(p.narration) : null;
  const video = { slug: options.video, output: manifest.output, profile: manifest.profile, music: manifest.music, voice: narration?.voice };
  const mainRoot = findMainRoot(REPO_ROOT);
  const selected = selectStepIds(options);

  const resolved = resolveTools({ repoRoot: REPO_ROOT, mainRoot, manifest, options, selected, env: process.env });
  const steps = planSteps({ repoRoot: REPO_ROOT, video, options, tools: resolved.tools, env: resolved.env });
  const pre = checkPreconditions({ repoRoot: REPO_ROOT, slug: options.video, manifest, options, selected, steps });
  const errors = [...resolved.errors, ...pre.errors];
  const warnings = [...resolved.warnings, ...pre.warnings];

  if (errors.length) {
    console.error(`produce.mjs: no empiezo, ${errors.length} guardia${errors.length === 1 ? '' : 's'} sin cumplir:`);
    for (const e of errors) console.error(`  - ${e}`);
    return 2;
  }
  const run = { options, tools: resolved.tools, steps, mainRoot, video, results: new Map(), timeline: p.timeline, started: Date.now() };
  if (options.dryRun) {
    printPlan(run, warnings);
    return 0;
  }
  for (const w of warnings) console.warn(`aviso: ${w}`);
  if (isRecordingVoice(video.voice) === false && narration) console.log(`nota: la voz es «${video.voice}», no una grabación: audio.mjs la sintetizará si hace falta`);
  mkdirSync(p.outDir, { recursive: true });

  console.log(`produce.mjs · ${options.video} · pasos: ${steps.map((s) => s.id).join(' -> ')}`);
  for (const step of steps) {
    console.log(`\n== paso ${step.id} — ${step.label}`);
    const t0 = Date.now();
    try {
      const result = await runStep(step, run);
      const seconds = (Date.now() - t0) / 1000;
      run.results.set(step.id, { ...result, seconds });
      console.log(`== paso ${step.id} terminado en ${stamp(seconds)}`);
    } catch (err) {
      if (!(err instanceof StepFailure)) throw err;
      console.error(`\n== paso ${step.id} FALLÓ tras ${stamp((Date.now() - t0) / 1000)}: ${err.message}`);
      const tail = tailLines(err.output, 30);
      if (tail.length) console.error(`-- últimas ${tail.length} líneas de su salida:\n${tail.join('\n')}\n--`);
      console.error(`produce.mjs: se detuvo en «${step.id}». Corrige la causa y retoma con:\n  ${resumeCommand(options, step.id)}`);
      return 1;
    }
  }
  console.log(`\n== TERMINADO ${options.video} en ${stamp((Date.now() - run.started) / 1000)}`);
  return 0;
}

main().then(
  (code) => process.exit(code),
  (err) => {
    if (err instanceof UsageError) {
      console.error(`produce.mjs: ${err.message}`);
      process.exit(2);
    }
    console.error(`produce.mjs: ${err.stack ?? err.message}`);
    process.exit(1);
  },
);
