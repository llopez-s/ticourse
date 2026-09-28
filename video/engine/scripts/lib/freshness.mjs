// Checks that src/timeline.json still matches its sources before rendering.
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { adversaryClipId, adversaryConfig, hashKeys } from './adversary.mjs';
import { analyzeNarration, loadSources, parseJsonText, sourceHash } from './narration.mjs';
import { AUDIO_CMD, PATHS } from './paths.mjs';

/**
 * @returns {{ok: boolean, problems: string[], timeline: object|null}}
 */
export function checkTimelineFresh({ requireAudio = true, timelinePath = PATHS.timeline } = {}) {
  const problems = [];
  if (!existsSync(timelinePath)) return { ok: false, problems: [`${timelinePath} does not exist`], timeline: null };
  const timeline = parseJsonText(readFileSync(timelinePath, 'utf8'), timelinePath);
  if (requireAudio && timeline.mode !== 'audio') {
    problems.push(`timeline.json is in "${timeline.mode}" mode — run: ${AUDIO_CMD}`);
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
    const adversaryVoice = sources.narration.adversaryVoice ? adversaryConfig(sources.narration.adversaryVoice) : null;
    const recordKey = (id) => {
      const file = path.join(PATHS.ttsDir, `${id}.json`);
      if (!existsSync(file)) {
        problems.push(`missing ${file}`);
        return null;
      }
      return parseJsonText(readFileSync(file, 'utf8'), file).key;
    };
    keys = hashKeys({
      segments: analysis.segments,
      adversaryVoice,
      narrationKey: (seg) => recordKey(seg.id),
      adversaryKeyOf: (seg) => recordKey(adversaryClipId(seg.id)),
    });
  }
  if (!problems.length && sourceHash(sources, keys) !== timeline.sourceHash) {
    problems.push(`timeline.json is stale (storyboard, narration, lexicon or voice changed) — run: ${AUDIO_CMD}`);
  }
  if (timeline.mode === 'audio') {
    for (const seg of timeline.segments) {
      const mp3 = seg.audio && path.join(PATHS.publicDir, seg.audio);
      if (!mp3 || !existsSync(mp3)) problems.push(`${seg.id}: audio file missing (${mp3 ?? 'null'})`);
    }
    for (const i of timeline.intercept ?? []) {
      if (i.audio && !existsSync(path.join(PATHS.publicDir, i.audio))) problems.push(`adversary voice missing (${i.audio})`);
    }
    for (const s of timeline.sfx ?? []) {
      if (!existsSync(path.join(PATHS.publicDir, s.src))) problems.push(`sound effect missing (${s.src})`);
    }
  }
  return { ok: problems.length === 0, problems, timeline };
}
