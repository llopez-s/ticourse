#!/usr/bin/env node
// Writes the reading sheets of a video into video/<slug>/out/ (from storyboard.json,
// narration.json and video.json; see lib/script-sheets.mjs):
//
//   node video/engine/scripts/script-sheets.mjs --video <slug>                  # both sheets below
//   node video/engine/scripts/script-sheets.mjs --video <slug> --recording      # guion-grabacion.md only
//   node video/engine/scripts/script-sheets.mjs --video <slug> --voice-studio   # guion-voice-studio.md only
//   node video/engine/scripts/script-sheets.mjs --video <slug> --only s01-01,s11-02   # guion-regrabacion.md
//   ... [--out-dir <dir>]   write somewhere else (e.g. to compare with the current sheets)
//
// guion-grabacion.md is what the narrator reads aloud for import-recording.mjs; guion-regrabacion.md
// lists just the segments to record again (import it with --only); guion-voice-studio.md is the same
// script in Voice Studio markup. narration.json "studio" can add Voice Studio marks per segment:
//   "studio": { "s03-06": [["catorce mil dominios.", "[emphasis]catorce mil dominios.[/emphasis]"]],
//               "s07-03-intercept": [["otro hobby.", "otro hobby. [laughter]"]] }
// (each find must match exactly once in that segment's spoken text, or in its intercepted message).
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { parseJsonText } from './lib/narration.mjs';
import { MANIFEST, PATHS, REPO_ROOT, isMainModule } from './lib/paths.mjs';
import { parseOnly, recordingSheet, rerecordSheet, voiceStudioSheet } from './lib/script-sheets.mjs';

function main() {
  const { values } = parseArgs({
    options: {
      video: { type: 'string' },
      recording: { type: 'boolean', default: false },
      'voice-studio': { type: 'boolean', default: false },
      only: { type: 'string' },
      'out-dir': { type: 'string' },
    },
  });
  const read = (file) => parseJsonText(readFileSync(file, 'utf8'), file);
  const sources = { storyboard: read(PATHS.storyboard), narration: read(PATHS.narration), manifest: MANIFEST };
  const outDir = values['out-dir'] ? path.resolve(values['out-dir']) : PATHS.outDir;

  const sheets = [];
  if (values.only !== undefined) {
    if (values['voice-studio']) throw new Error('--only writes the re-recording sheet; run --voice-studio separately');
    const ids = parseOnly(values.only, sources.narration.segments);
    sheets.push(['guion-regrabacion.md', rerecordSheet({ ...sources, ids })]);
  } else {
    const both = !values.recording && !values['voice-studio'];
    if (both || values.recording) {
      sheets.push(['guion-grabacion.md', recordingSheet(sources)]);
      if (!MANIFEST.frozen) {
        console.warn('script-sheets: the script is not frozen (video.json has no "frozen"): the recording sheet is a DRAFT.');
        console.warn('  Freeze it (both reviews applied, canon-check read) before sending it to the narrator.');
      }
    }
    if (both || values['voice-studio']) sheets.push(['guion-voice-studio.md', voiceStudioSheet(sources)]);
  }
  mkdirSync(outDir, { recursive: true });
  for (const [name, text] of sheets) {
    const file = path.join(outDir, name);
    writeFileSync(file, text);
    console.log(`script-sheets: ${path.relative(REPO_ROOT, file).split(path.sep).join('/')}`);
  }
}

if (isMainModule(import.meta.url)) {
  try {
    main();
  } catch (err) {
    console.error(`script-sheets: ${err.message}`);
    process.exit(1);
  }
}
