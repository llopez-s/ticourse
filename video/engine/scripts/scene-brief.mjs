#!/usr/bin/env node
// Writes the «scene-builder brief» for one video: the Markdown handed to the agents that write its scenes.
// Generic rules come from video/engine/docs/scene-brief-template.md; scenes, goals, cues, think prompts,
// intercepted messages and exam cards are computed from the video's own files. The «Canon» section is a
// TODO block for the author. A brief that already exists (possibly hand-edited) is never overwritten
// without --force.
//
//   node video/engine/scripts/scene-brief.mjs --video <slug> [--out <path>] [--force]
//   (default output: video/<slug>/out/scene-brief.md, which is git-ignored)
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { loadSources, parseJsonText } from './lib/narration.mjs';
import { MANIFEST, PATHS, REPO_ROOT, VIDEO, VIDEOS_DIR, isMainModule } from './lib/paths.mjs';
import { CATALOG_REL, TODO_MARK, readTemplate, sceneBrief, writeDecision } from './lib/scene-brief.mjs';

/** Finds the lesson module (e.g. "s3m3") under src/data: file, first line, and the line before the next module. */
export function locateLesson(lesson, dataDir = path.join(REPO_ROOT, 'src', 'data')) {
  if (!lesson || !existsSync(dataDir)) return null;
  const files = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = path.join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (name.endsWith('.ts') && !name.endsWith('.test.ts')) files.push(p);
    }
  };
  walk(dataDir);
  const idLine = (id) => new RegExp(`^\\s*id:\\s*['"]${id}['"]`);
  const moduleLine = /^\s*id:\s*['"]s(p)?\d+m\d+['"]/;
  for (const file of files.sort()) {
    const lines = readFileSync(file, 'utf8').split(/\r?\n/);
    const from = lines.findIndex((l) => idLine(lesson).test(l));
    if (from < 0) continue;
    const next = lines.findIndex((l, k) => k > from && moduleLine.test(l));
    return { file: path.relative(REPO_ROOT, file).replace(/\\/g, '/'), from: from + 1, to: next < 0 ? lines.length : next };
  }
  return null;
}

/** Other videos on the shared engine that already have scenes (a kit.tsx), sorted by name. */
export function referenceVideos(slug) {
  return readdirSync(VIDEOS_DIR)
    .filter((d) => d !== slug && d !== 'engine' && existsSync(path.join(VIDEOS_DIR, d, 'src', 'scenes', 'kit.tsx')))
    .sort();
}

function workspace() {
  let branch = null;
  try {
    branch = execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd: REPO_ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    branch = null;
  }
  const dotGit = path.join(REPO_ROOT, '.git');
  const worktree = existsSync(dotGit) && statSync(dotGit).isFile();
  return { root: REPO_ROOT, branch, worktree };
}

function main() {
  const { values } = parseArgs({
    options: { video: { type: 'string' }, out: { type: 'string' }, force: { type: 'boolean', default: false } },
    allowPositionals: false,
  });
  const out = path.resolve(values.out ?? path.join(PATHS.outDir, 'scene-brief.md'));
  const decision = writeDecision({ exists: existsSync(out), force: values.force });
  if (!decision.write) {
    console.error(`${out} already exists (it may be hand-edited) — not overwriting. Use --force, or --out <other path>.`);
    process.exit(1);
  }

  const sources = loadSources({ storyboard: PATHS.storyboard, narration: PATHS.narration, lexicon: PATHS.lexicon });
  const catalogFile = path.join(REPO_ROOT, CATALOG_REL);
  const catalog = existsSync(catalogFile) ? readFileSync(catalogFile, 'utf8') : null;
  const timelineMode = existsSync(PATHS.timeline) ? parseJsonText(readFileSync(PATHS.timeline, 'utf8'), PATHS.timeline).mode ?? null : null;

  const md = sceneBrief({
    slug: VIDEO,
    manifest: MANIFEST,
    storyboard: sources.storyboard,
    narration: sources.narration,
    lexicon: sources.lexicon,
    catalog,
    template: readTemplate(),
    workspace: workspace(),
    lessonSource: locateLesson(MANIFEST.lesson),
    references: referenceVideos(VIDEO),
    timelineMode,
  });
  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(out, md, 'utf8');
  const scenes = sources.storyboard.scenes.length;
  console.log(`${decision.action === 'overwrite' ? 'overwrote' : 'wrote'} ${path.relative(process.cwd(), out) || out} (${scenes} scenes)`);
  console.log(`  next: fill the «Canon» block (${TODO_MARK})${catalog ? '' : `; ${CATALOG_REL} is missing, the brief links to it`}.`);
}

if (isMainModule(import.meta.url)) {
  try {
    main();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
