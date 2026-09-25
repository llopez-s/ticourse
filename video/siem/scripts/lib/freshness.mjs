// Checks that src/timeline.json still matches its sources before rendering.
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { analyzeNarration, loadSources, parseJsonText, sourceHash } from './narration.mjs';
import { PATHS } from './paths.mjs';

/**
 * @returns {{ok: boolean, problems: string[], timeline: object|null}}
 */
export function checkTimelineFresh({ requireAudio = true, timelinePath = PATHS.timeline } = {}) {
  const problems = [];
  if (!existsSync(timelinePath)) return { ok: false, problems: [`${timelinePath} does not exist`], timeline: null };
  const timeline = parseJsonText(readFileSync(timelinePath, 'utf8'), timelinePath);
  if (requireAudio && timeline.mode !== 'audio') {
    problems.push(`timeline.json is in "${timeline.mode}" mode — run: node video/siem/scripts/audio.mjs`);
    return { ok: false, problems, timeline };
  }
  const sources = loadSources({ storyboard: PATHS.storyboard, narration: PATHS.narration, lexicon: PATHS.lexicon });
  let keys = null;
  if (timeline.mode === 'audio') {
    const analysis = analyzeNarration(sources);
    if (analysis.errors.length) {
      problems.push(`narration.json no longer validates (${analysis.errors.length} errors) — run build-timeline.mjs`);
      return { ok: false, problems, timeline };
    }
    keys = [];
    for (const seg of analysis.segments) {
      const file = path.join(PATHS.ttsDir, `${seg.id}.json`);
      if (!existsSync(file)) {
        problems.push(`missing ${file}`);
        continue;
      }
      keys.push([seg.id, parseJsonText(readFileSync(file, 'utf8'), file).key]);
    }
  }
  if (!problems.length && sourceHash(sources, keys) !== timeline.sourceHash) {
    problems.push('timeline.json is stale (storyboard, narration, lexicon or voice changed) — run: node video/siem/scripts/audio.mjs');
  }
  if (timeline.mode === 'audio') {
    for (const seg of timeline.segments) {
      const mp3 = seg.audio && path.join(PATHS.publicDir, seg.audio);
      if (!mp3 || !existsSync(mp3)) problems.push(`${seg.id}: audio file missing (${mp3 ?? 'null'})`);
    }
  }
  return { ok: problems.length === 0, problems, timeline };
}
