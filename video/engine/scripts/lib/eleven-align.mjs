// Pure helpers for ElevenLabs output: character alignment -> words, and how to
// cut one scene-long take into per-segment clips.
//
// A whole scene is synthesised in ONE request (v3 has no request stitching, so
// this keeps intonation and emotion continuous). The take is then cut in the
// silences between segments so every segment still gets its own clip and word
// timings, exactly like the edge-tts pipeline expects.

const TAG = /^\[[^\]]*\]$/;

/**
 * Words (whitespace-separated, audio tags removed) with times in ms, from an
 * alignment { characters, character_start_times_seconds, character_end_times_seconds }.
 */
export function wordsFromAlignment(alignment) {
  const chars = alignment?.characters ?? [];
  const starts = alignment?.character_start_times_seconds ?? [];
  const ends = alignment?.character_end_times_seconds ?? [];
  const words = [];
  let cur = null;
  let depth = 0;
  const close = () => {
    if (cur && !TAG.test(cur.text)) words.push({ text: cur.text, startMs: cur.startMs, endMs: cur.endMs });
    cur = null;
  };
  for (let i = 0; i < chars.length; i += 1) {
    const ch = chars[i];
    if (ch === '[') depth += 1;
    if (/\s/.test(ch) && depth === 0) {
      close();
      continue;
    }
    const startMs = starts[i] * 1000;
    const endMs = ends[i] * 1000;
    if (!cur) cur = { text: '', startMs, endMs };
    cur.text += ch;
    cur.endMs = Math.max(cur.endMs, endMs);
    if (ch === ']' && depth > 0) {
      depth -= 1;
      if (depth === 0 && TAG.test(cur.text)) cur = null; // a tag glued to nothing: drop it
    }
  }
  close();
  return words;
}

const norm = (s) =>
  s
    .normalize('NFD')
    .replace(/\p{M}+/gu, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '');

/**
 * Splits the scene's words into segments by word count and plans the clip of
 * each segment inside the scene take.
 *
 * @param {object} p
 * @param {{id: string, tokens: string[], leadMs?: number}[]} p.segments  spoken tokens of each segment (no tags), in order
 * @param {{text: string, startMs: number, endMs: number}[]} p.words  from wordsFromAlignment
 * @param {number} p.totalMs  length of the scene take
 * @param {number} [p.leadMs]  silence kept before a segment's first word
 * @param {number} [p.maxTailMs]  most silence kept after a segment's last word
 * @returns {{ segments: {id, clipStartMs, clipEndMs, words: {text, offsetMs, durationMs}[]}[], mismatches: string[] }}
 */
export function planSceneCuts({ segments, words, totalMs, leadMs = 60, maxTailMs = 300 }) {
  const want = segments.reduce((n, s) => n + s.tokens.length, 0);
  if (words.length !== want) {
    throw new Error(`alignment has ${words.length} words but the scene's segments have ${want} spoken tokens`);
  }
  const mismatches = [];
  let w = 0;
  const spans = segments.map((seg) => {
    const own = words.slice(w, w + seg.tokens.length);
    own.forEach((word, k) => {
      if (norm(word.text) !== norm(seg.tokens[k])) mismatches.push(`${seg.id}: "${seg.tokens[k]}" vs "${word.text}"`);
    });
    w += seg.tokens.length;
    return { id: seg.id, words: own, startMs: own[0].startMs, endMs: Math.max(...own.map((x) => x.endMs)) };
  });

  // A segment may ask for a longer lead (e.g. it opens with an audible [sighs]),
  // so the silence before it is given to it instead of to the previous clip.
  const leadOf = (k) => segments[k].leadMs ?? leadMs;
  const out = [];
  let prevEnd = 0;
  spans.forEach((span, k) => {
    const next = spans[k + 1];
    const clipStartMs = Math.max(prevEnd, span.startMs - leadOf(k), 0);
    const gap = next ? Math.max(0, next.startMs - span.endMs) : Math.max(0, totalMs - span.endMs);
    let clipEndMs = Math.min(totalMs, span.endMs + Math.min(next ? gap / 2 : gap, maxTailMs));
    if (next && leadOf(k + 1) > leadMs) {
      clipEndMs = Math.min(clipEndMs, Math.max(span.endMs + 120, next.startMs - leadOf(k + 1)));
    }
    prevEnd = clipEndMs;
    out.push({
      id: span.id,
      clipStartMs,
      clipEndMs,
      words: span.words.map((x) => ({
        text: x.text,
        offsetMs: Math.max(0, x.startMs - clipStartMs),
        durationMs: Math.max(1, x.endMs - x.startMs),
      })),
    });
  });
  return { segments: out, mismatches };
}

/** Non-verbal v3 audio tags that make a sound of their own before the words. */
export const AUDIBLE_TAGS = /^(sighs?|laughs?|chuckles?|giggles?|exhales?|inhales?|gasps?|breathes?|clears throat)$/i;

/** Lead to keep before a segment: longer when its directed text opens with an audible tag. */
export function leadForSegment(directedSpoken, { leadMs = 60, audibleLeadMs = 900 } = {}) {
  const m = /^\[([^\]]+)\]/.exec(directedSpoken.trim());
  return m && AUDIBLE_TAGS.test(m[1].trim()) ? audibleLeadMs : leadMs;
}

/** Byte range of [startMs, endMs) in 16-bit mono PCM at `sampleRate`. */
export function pcmRange(startMs, endMs, sampleRate) {
  const a = Math.max(0, Math.round((startMs * sampleRate) / 1000)) * 2;
  const b = Math.max(a, Math.round((endMs * sampleRate) / 1000) * 2);
  return [a, b];
}
