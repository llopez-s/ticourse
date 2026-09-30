#!/usr/bin/env node
// Lists, for every name, number and time a video shows or says (hosts, accounts, IPs, domains, hashes,
// cases, HH:MM), where else its campaign already uses it: the other videos of the same track (their
// src/data, scenes and narration), the track's lessons and the campaign's canon registry
// (docs/superpowers/canon/<campaign>.md). Writes video/<slug>/out/canon-refs.md for the accuracy
// reviewer, who checks that no token means something else elsewhere (another time, another origin host).
//
//   node video/engine/scripts/canon-check.mjs --video <slug>
//
// Informational: it never fails a build. Run it after writing the script and again after the scenes.
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { canonReport, canonTokens, findRefs, narrationTexts, stringLiterals } from './lib/canon-refs.mjs';
import { parseJsonText } from './lib/narration.mjs';
import { MANIFEST, PATHS, REPO_ROOT, VIDEO, VIDEOS_DIR, isMainModule } from './lib/paths.mjs';

/** The campaign registry each track's videos continue. */
export const CAMPAIGN = Object.freeze({ secplus: 'glass-harbor', gcti: 'velvet-cicada' });

const rel = (p) => path.relative(REPO_ROOT, p).split(path.sep).join('/');

function walk(dir, keep, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) walk(p, keep, out);
    else if (keep(name)) out.push(p);
  }
  return out;
}

const isSource = (n) => /\.(ts|tsx)$/.test(n) && !/\.test\.tsx?$/.test(n) && n !== 'timeline.json';
const readLines = (file) => readFileSync(file, 'utf8').split(/\r?\n/);

/** Files of the campaign other than this video's, as [{file, lines}]. */
function campaignCorpus(track) {
  const files = [];
  for (const slug of readdirSync(VIDEOS_DIR)) {
    if (slug === VIDEO) continue;
    const manifestFile = path.join(VIDEOS_DIR, slug, 'video.json');
    if (!existsSync(manifestFile)) continue;
    const manifest = parseJsonText(readFileSync(manifestFile, 'utf8'), manifestFile);
    if (manifest.track !== track) continue;
    files.push(...walk(path.join(VIDEOS_DIR, slug, 'src'), isSource));
    const narration = path.join(VIDEOS_DIR, slug, 'narration.json');
    if (existsSync(narration)) files.push(narration);
  }
  const data = path.join(REPO_ROOT, 'src', 'data');
  if (track === 'secplus') files.push(...walk(path.join(data, 'secplus'), isSource));
  else files.push(...readdirSync(data).filter((n) => isSource(n)).map((n) => path.join(data, n)));
  const registry = path.join(REPO_ROOT, 'docs', 'superpowers', 'canon', `${CAMPAIGN[track]}.md`);
  if (existsSync(registry)) files.unshift(registry);
  return files.map((file) => ({ file: rel(file), lines: readLines(file) }));
}

/** Everything this video puts on screen or says: narration, storyboard and its own scene data. */
function videoTokens() {
  const narration = parseJsonText(readFileSync(PATHS.narration, 'utf8'), PATHS.narration);
  const storyboard = parseJsonText(readFileSync(PATHS.storyboard, 'utf8'), PATHS.storyboard);
  const texts = [...narrationTexts(narration), ...storyboard.scenes.flatMap((s) => [s.title, s.goal ?? ''])];
  for (const file of walk(path.join(PATHS.dir, 'src', 'data'), isSource)) texts.push(...stringLiterals(readFileSync(file, 'utf8')));
  const tokens = new Set();
  for (const t of texts) for (const token of canonTokens(t)) tokens.add(token);
  return tokens;
}

function main() {
  parseArgs({ options: { video: { type: 'string' } } });
  const track = MANIFEST.track;
  if (!CAMPAIGN[track]) throw new Error(`no campaign registry for track "${track}"`);
  const tokens = videoTokens();
  const refs = findRefs(tokens, campaignCorpus(track));
  const md = canonReport({ video: VIDEO, campaign: CAMPAIGN[track], tokens, refs });
  mkdirSync(PATHS.outDir, { recursive: true });
  const out = path.join(PATHS.outDir, 'canon-refs.md');
  writeFileSync(out, md);
  const known = [...tokens].filter((t) => refs.get(t).length).length;
  console.log(`canon-check: ${tokens.size} tokens, ${known} already used in the campaign, ${tokens.size - known} new -> ${rel(out)}`);
}

if (isMainModule(import.meta.url)) main();
