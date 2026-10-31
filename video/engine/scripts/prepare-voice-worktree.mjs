#!/usr/bin/env node
// Deja listo un worktree para importar y producir la grabación de un vídeo, con lo que hasta ahora se hacía a mano:
//
//   node video/engine/scripts/prepare-voice-worktree.mjs --video <slug> --wav "<grabación>.wav"
//        [--name lidia] [--dir <carpeta>] [--branch video-<slug>-voz] [--base origin/main] [--video-from <ref>]
//        [--no-fetch] [--no-master] [--no-import] [--fix] [--dry-run]
//   node video/engine/scripts/prepare-voice-worktree.mjs --video <slug> --remove [--dir <carpeta>]
//
// 1. git fetch y un worktree en NTFS (por defecto %TEMP%\alertopolis-voz\<slug>; el disco D: es exFAT y no admite
//    enlaces): rama nueva <branch> desde <base>, o la rama tal cual si ya existe (entonces su video/engine se pone al
//    día con <base>: un importador viejo se salta la última toma). --video-from <ref> trae video/<slug> de otra rama
//    (el guion que aún no está en main), con el motor de <base>.
// 2. Uniones de directorio a node_modules y video/engine/.cache del checkout principal (Remotion, ffmpeg, Whisper).
// 3. La música de video.json -> "music" copiada a video/engine/music/library/ (fuera de git: un worktree no la trae).
// 4. narration.json sin "recording.tempo" (su voz se importa a su ritmo desde 2026-10-24).
// 5. master_voice.py sobre la grabación -> «<grabación> (master).wav» (si no existe ya o es más vieja que la grabación).
// 6. import-recording.mjs con --lufs=-18 y el Python del checkout principal (CHATTERBOX_PYTHON).
// 7. Con --fix, fix-recording.mjs: los avisos seguros del importador (toma posterior, apertura repetida, inicio perdido,
//    borde dentro de una palabra) se arreglan con tomas de la propia grabación, en un solo recorte (ver ese script).
// Se puede repetir: lo que ya está hecho se salta. Después: cd <carpeta> && node video/engine/scripts/produce.mjs --video <slug>
// --remove quita primero las uniones y luego el worktree (git worktree remove, sin --force: si hay cambios sin
// commit, se para). Nunca borres el worktree a mano con las uniones dentro: borrarías el node_modules y la .cache
// del checkout principal. La lógica pura está en lib/prepare-voice.mjs.
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, lstatSync, mkdirSync, readFileSync, rmdirSync, statSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { gitSafeDirEnv } from './lib/produce.mjs';
import { DEFAULT_BASE, defaultBranch, defaultDir, dropRecordingTempo, importArgs, junctions, masterArgs, masteredPath, musicPaths, worktreeArgs } from './lib/prepare-voice.mjs';

const HERE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const gitEnv = { ...process.env, ...gitSafeDirEnv(process.env) };

function git(cwd, args, { check = true } = {}) {
  const res = spawnSync('git', args, { cwd, encoding: 'utf8', windowsHide: true, env: gitEnv });
  if (check && res.status !== 0) throw new Error(`git ${args.join(' ')} falló: ${(res.stderr || res.error?.message || '').trim()}`);
  return res;
}

/** Raíz del checkout principal (el que tiene la carpeta .git), aunque esto se lance desde otro worktree. */
function mainRootOf(root) {
  const res = git(root, ['rev-parse', '--path-format=absolute', '--git-common-dir'], { check: false });
  const dir = res.status === 0 ? res.stdout.trim() : '';
  return dir && path.basename(dir) === '.git' ? path.dirname(dir) : root;
}

const exists = (p) => {
  try {
    lstatSync(p);
    return true;
  } catch {
    return false;
  }
};

function main() {
  const { values } = parseArgs({
    options: {
      video: { type: 'string' },
      wav: { type: 'string' },
      name: { type: 'string' },
      dir: { type: 'string' },
      branch: { type: 'string' },
      base: { type: 'string', default: DEFAULT_BASE },
      'video-from': { type: 'string' },
      'no-fetch': { type: 'boolean', default: false },
      'no-master': { type: 'boolean', default: false },
      'no-import': { type: 'boolean', default: false },
      fix: { type: 'boolean', default: false },
      'dry-run': { type: 'boolean', default: false },
      remove: { type: 'boolean', default: false },
    },
  });
  if (values.remove) return remove(values);
  const slug = values.video;
  if (!slug || (!values.wav && !values['no-import'])) {
    throw new Error('uso: prepare-voice-worktree.mjs --video <slug> --wav <grabación.wav> [--name lidia] [--dir <carpeta>] [--branch <rama>] [--base origin/main] [--video-from <ref>] [--no-fetch] [--no-master] [--no-import] [--dry-run]');
  }
  const dry = values['dry-run'];
  const mainRoot = mainRootOf(HERE_ROOT);
  const dir = path.resolve(values.dir ?? defaultDir(slug, os.tmpdir()));
  const branch = values.branch ?? defaultBranch(slug);
  const base = values.base;
  const wav = values.wav ? path.resolve(values.wav) : null;
  if (wav && !existsSync(wav)) throw new Error(`no existe la grabación ${wav}`);
  const act = (what, fn) => {
    console.log(`${dry ? '[dry-run] ' : ''}${what}`);
    if (!dry) fn();
  };
  console.log(`prepare-voice-worktree · ${slug} · principal ${mainRoot}`);

  // 1. worktree
  if (!values['no-fetch']) act('git fetch origin', () => git(mainRoot, ['fetch', 'origin']));
  let branchExisted = false;
  if (existsSync(path.join(dir, '.git'))) {
    console.log(`worktree: ya existe ${dir}`);
    branchExisted = true;
  } else {
    branchExisted = git(mainRoot, ['rev-parse', '--verify', '--quiet', `refs/heads/${branch}`], { check: false }).status === 0;
    // A branch checked out in another worktree cannot be checked out again: say where it is.
    const list = git(mainRoot, ['worktree', 'list', '--porcelain']).stdout.split(/\r?\n\r?\n/);
    const other = list.find((w) => w.split(/\r?\n/).includes(`branch refs/heads/${branch}`));
    if (other) throw new Error(`la rama ${branch} ya está abierta en ${other.split(/\r?\n/)[0].replace(/^worktree /, '')}: pasa ese --dir (si está en NTFS) u otra --branch`);
    const args = worktreeArgs({ dir, branch, base, branchExists: branchExisted });
    act(`git ${args.join(' ')}`, () => git(mainRoot, args));
  }
  if (values['video-from']) act(`git checkout ${values['video-from']} -- video/${slug}`, () => git(dir, ['checkout', values['video-from'], '--', `video/${slug}`]));
  if (branchExisted && !dry && git(dir, ['diff', '--quiet', base, '--', 'video/engine'], { check: false }).status !== 0) {
    act(`video/engine de la rama difiere de ${base}: git checkout ${base} -- video/engine`, () => git(dir, ['checkout', base, '--', 'video/engine']));
  }
  const manifestFile = path.join(dir, 'video', slug, 'video.json');
  if (!dry && !existsSync(manifestFile)) throw new Error(`no hay ${manifestFile}: ¿el guion está en otra rama? Pásala con --video-from <rama>`);

  // 2. uniones
  for (const j of junctions(mainRoot, dir)) {
    if (exists(j.path)) {
      console.log(`unión: ya existe ${j.rel}`);
      continue;
    }
    if (!existsSync(j.target)) throw new Error(`falta ${j.target} en el checkout principal (¿npm ci allí?)`);
    act(`unión ${j.rel} -> ${j.target}`, () => {
      mkdirSync(path.dirname(j.path), { recursive: true });
      symlinkSync(j.target, j.path, 'junction'); // = New-Item -ItemType Junction
    });
  }

  // 3. música, 4. tempo
  const manifest = existsSync(manifestFile) ? JSON.parse(readFileSync(manifestFile, 'utf8').replace(/^﻿/, '')) : null;
  const music = musicPaths(manifest, mainRoot, dir);
  if (!manifest) console.log('música: video.json todavía no está (dry-run)');
  else if (!music) console.warn('aviso: video.json no tiene "music": produce.mjs lo pedirá («Go On Going - Stayloose.mp3»)');
  else if (existsSync(music.to)) console.log(`música: ya está ${music.name}`);
  else if (!existsSync(music.from)) throw new Error(`falta ${music.from} en el checkout principal: descárgala (music/LICENSES.md dice de dónde)`);
  else act(`copiar música ${music.name}`, () => {
    mkdirSync(path.dirname(music.to), { recursive: true });
    copyFileSync(music.from, music.to);
  });
  const narrationFile = path.join(dir, 'video', slug, 'narration.json');
  let narration = null;
  if (existsSync(narrationFile)) {
    const text = readFileSync(narrationFile, 'utf8');
    narration = JSON.parse(text.replace(/^﻿/, ''));
    const edit = dropRecordingTempo(text);
    if (edit.changed) act(`narration.json: quitar recording.tempo (${narration.recording.tempo})`, () => writeFileSync(narrationFile, edit.text));
    else console.log('narration.json: sin recording.tempo');
  }
  if (values['no-import'] && values['no-master']) return done(dir, slug);

  // 5. master_voice, 6. import
  const python = process.env.MASTER_PYTHON || process.env.CHATTERBOX_PYTHON || path.join(mainRoot, 'video', 'engine', '.venv-chatterbox', process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python');
  if (!existsSync(python)) throw new Error(`no encuentro el Python del motor (${python}): define CHATTERBOX_PYTHON`);
  const run = (cmd, args) => {
    const res = spawnSync(cmd, args, { cwd: dir, stdio: 'inherit', windowsHide: true, env: { ...gitEnv, CHATTERBOX_PYTHON: process.env.CHATTERBOX_PYTHON || python } });
    if (res.error) throw new Error(`no se pudo lanzar ${cmd}: ${res.error.message}`);
    if (res.status !== 0) throw new Error(`${path.basename(args.find((a) => /\.(py|mjs)$/.test(a)) ?? cmd)} salió con código ${res.status}`);
  };
  let file = wav;
  if (wav && !values['no-master']) {
    file = masteredPath(wav);
    if (file === wav) console.log('master_voice: la grabación ya es un master');
    else if (existsSync(file) && statSync(file).mtimeMs >= statSync(wav).mtimeMs) console.log(`master_voice: ya está ${path.basename(file)}`);
    else act(`master_voice.py -> ${file}`, () => run(python, masterArgs(path.join(dir, 'video', 'engine', 'scripts'), wav, file)));
  }
  if (!values['no-import']) {
    const name = values.name ?? (String(narration?.voice ?? '').startsWith('recording/') ? narration.voice.slice('recording/'.length) : 'lidia');
    const args = importArgs(path.join(dir, 'video', 'engine', 'scripts'), { slug, file, name });
    act(`node ${args.map((a) => (/\s/.test(a) ? `"${a}"` : a)).join(' ')}`, () => run(process.execPath, args));
    if (values.fix) {
      const fixArgs = [path.join(dir, 'video', 'engine', 'scripts', 'fix-recording.mjs'), '--video', slug];
      act(`node ${fixArgs.map((a) => (/\s/.test(a) ? `"${a}"` : a)).join(' ')}`, () => run(process.execPath, fixArgs));
    }
  }
  return done(dir, slug);
}

function remove(values) {
  if (!values.video) throw new Error('uso: prepare-voice-worktree.mjs --video <slug> --remove [--dir <carpeta>]');
  const mainRoot = mainRootOf(HERE_ROOT);
  const dir = path.resolve(values.dir ?? defaultDir(values.video, os.tmpdir()));
  for (const j of junctions(mainRoot, dir)) {
    if (!exists(j.path)) continue;
    if (!lstatSync(j.path).isSymbolicLink()) throw new Error(`${j.path} no es una unión: no lo toco`);
    try {
      unlinkSync(j.path);
    } catch {
      rmdirSync(j.path); // a junction is removed as an empty directory, never its target
    }
    console.log(`unión quitada: ${j.rel}`);
  }
  git(mainRoot, ['worktree', 'remove', dir]);
  console.log(`worktree quitado: ${dir} (la rama sigue ahí)`);
}

function done(dir, slug) {
  console.log(`\nListo. Siguiente paso, desde el worktree:\n  cd "${dir}"\n  node video/engine/scripts/produce.mjs --video ${slug}`);
}

try {
  main();
} catch (error) {
  console.error(`prepare-voice-worktree: ${error.message}`);
  process.exit(1);
}
