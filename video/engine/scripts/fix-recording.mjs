#!/usr/bin/env node
// Applies the fixes import-recording.mjs suggested for a recording, the ones that are safe to do without listening:
//
//   node video/engine/scripts/fix-recording.mjs --video <slug> [--file <grabación (master).wav>] [--kinds safe|all|later,edge,…]
//        [--dry-run]
//
// After a full import, the importer prints warnings with three lines each (the sentence's place, the recut command, the
// import command) and saves them as data in out/recording/<name>/fixes-<file>.json. This script reads that file and, for
// the clips to fix, in one go:
//   1. cuts every range into ONE recut WAV next to the recording («<slug> <name> arreglos (recorte).wav») with
//      recut_recording.py, in script order;
//   2. imports just those clips with import-recording.mjs --only … --reuse-gain (the gain of the full import: no loudness
//      arithmetic, which is where V5b and V6 went wrong).
// Safe kinds (default, --kinds safe): later (a take after the one used: her last take is the good one), restart (the
// opening read twice in one clip), midstart (the clip lost its first words), edge (the clip ends/starts inside a word) and
// stretched (a half-said take glued to its retake: verify-voice calls it an error).
// The other kinds — unheard, long, missing — are listed and left to a listen (voice nobody transcribed, a long clip, a
// sentence not found: the cut that keeps the right part is a guess). --kinds all applies them too.
// A clip is tried once per recording: the same cut would give the same clip (out/recording/<name>/fixes-applied.json).
// Her words said in another order than the script (s02-05 of viaje-conexion, s02-04 of abrir-web) are not here: that is
// an edit of narration.json (the recorded text wins), then import-recording.mjs --only <id> --file <master> --reuse-gain.
// The pure parts (plan, cut that moves an edge into a pause, commands) are in lib/recording-fixes.mjs.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { FIX_KINDS, SAFE_KINDS, clockOf, planFixes, recutArgs, recutPath, reimportArgs } from './lib/recording-fixes.mjs';
import { PATHS, REPO_ROOT, SCRIPTS_DIR, isMainModule } from './lib/paths.mjs';
import { writeFileAtomic } from './lib/remotion.mjs';
import { VENV_PYTHON } from './tts-chatterbox.mjs';

const readJson = (file) => JSON.parse(readFileSync(file, 'utf8').replace(/^﻿/, ''));

/** The saved fixes of the full recording (the newest, or the one of `file`). */
function loadFixes(workDir, file) {
  if (!existsSync(workDir)) throw new Error(`no hay importación de la grabación (${workDir}): importa primero con import-recording.mjs`);
  const found = readdirSync(workDir)
    .filter((f) => /^fixes-.*\.json$/.test(f) && f !== 'fixes-applied.json')
    .map((f) => path.join(workDir, f))
    .map((f) => ({ path: f, data: readJson(f), mtime: statSync(f).mtimeMs }))
    .filter((f) => f.data.full && (!file || path.resolve(f.data.file) === path.resolve(file)))
    .sort((a, b) => b.mtime - a.mtime);
  if (!found.length) throw new Error(`no hay ${file ? `fixes de ${file}` : 'fixes de una importación completa'} en ${workDir}: vuelve a importar la grabación completa (el importador los guarda desde esta versión del motor)`);
  return found[0].data;
}

function parseKinds(spec) {
  if (!spec || spec === 'safe') return SAFE_KINDS;
  if (spec === 'all') return FIX_KINDS;
  const list = spec.split(',').map((k) => k.trim()).filter(Boolean);
  const bad = list.filter((k) => !FIX_KINDS.includes(k));
  if (bad.length) throw new Error(`--kinds: no conozco ${bad.join(', ')} (${FIX_KINDS.join(', ')}, safe o all)`);
  return list;
}

function run(cmd, args) {
  const res = spawnSync(cmd, args, { cwd: REPO_ROOT, stdio: 'inherit', windowsHide: true, env: process.env });
  if (res.error) throw new Error(`no se pudo lanzar ${cmd}: ${res.error.message}`);
  if (res.status !== 0) throw new Error(`${path.basename(args.find((a) => /\.(py|mjs)$/.test(a)) ?? cmd)} salió con código ${res.status}`);
}

function main() {
  const { values } = parseArgs({
    options: { video: { type: 'string' }, file: { type: 'string' }, kinds: { type: 'string' }, 'dry-run': { type: 'boolean', default: false } },
  });
  if (!values.video) throw new Error('uso: fix-recording.mjs --video <slug> [--file <grabación.wav>] [--kinds safe|all|later,edge,…] [--dry-run]');
  const narration = readJson(PATHS.narration);
  const name = String(narration.voice ?? '').startsWith('recording/') ? narration.voice.slice('recording/'.length) : null;
  if (!name) throw new Error(`narration.json "voice" no es «recording/<nombre>» (es ${JSON.stringify(narration.voice)})`);
  const workDir = path.join(PATHS.outDir, 'recording', name);
  const saved = loadFixes(workDir, values.file);
  const file = path.resolve(saved.file);
  if (!existsSync(file)) throw new Error(`no existe la grabación ${file}`);
  const appliedPath = path.join(workDir, 'fixes-applied.json');
  const applied = existsSync(appliedPath) ? readJson(appliedPath) : { rounds: [] };
  const done = applied.rounds.filter((r) => r.sha256 === saved.sha256).flatMap((r) => r.ids);
  const kinds = parseKinds(values.kinds);
  const plan = planFixes(saved.fixes, { kinds, done });

  console.log(`fix-recording · ${saved.slug} · ${path.basename(file)} · ${kinds.join(', ')}`);
  for (const f of plan.apply) console.log(`  arreglar ${f.ids.join(', ')} (${f.kind}): ${f.parts.map((p) => `${clockOf(p.startMs)}–${clockOf(p.endMs)}`).join(' + ')}`);
  for (const m of plan.manual) console.log(`  a mano ${m.id} (${m.kind}): escúchalo; --kinds ${m.kind} lo arregla igualmente`);
  for (const id of plan.repeated) console.log(`  ya intentado ${id}: el mismo recorte daría el mismo clip; escúchalo o mira su aviso`);
  if (!plan.apply.length) return console.log('Nada que arreglar automáticamente.');
  if (values['dry-run']) return console.log('[dry-run] no se corta ni se importa nada.');

  const out = recutPath(file, existsSync);
  run(VENV_PYTHON, recutArgs(SCRIPTS_DIR, { out, file, apply: plan.apply }));
  const ids = plan.apply.flatMap((f) => f.ids);
  run(process.execPath, reimportArgs(SCRIPTS_DIR, { slug: saved.slug, file: out, name, ids }));
  applied.rounds.push({ at: new Date().toISOString(), sha256: saved.sha256, ids, out: path.basename(out), kinds: plan.apply.map((f) => f.kind) });
  writeFileAtomic(appliedPath, `${JSON.stringify(applied, null, 1)}\n`);
  console.log(`\nArreglados: ${ids.join(', ')} (${path.basename(out)}). Los avisos de arriba son de ese reimport: si alguno sigue, escúchalo.`);
  if (plan.manual.length) console.log(`Pendientes de escuchar: ${plan.manual.map((m) => `${m.id} (${m.kind})`).join(', ')}.`);
}

if (isMainModule(import.meta.url)) {
  try {
    main();
  } catch (error) {
    console.error(`fix-recording: ${error.message}`);
    process.exit(1);
  }
}
