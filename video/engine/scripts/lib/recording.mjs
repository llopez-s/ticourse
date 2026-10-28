// Cuts a narrator's own recording of the whole script into one clip per segment.
//
// The recording is transcribed once with word timings (recording_asr.py, faster-whisper).
// locateSegments finds each segment's words in that transcript, in script order, tolerating
// ASR misspellings («de Mark» for DMARC) and audio that is not in the script (exam cards,
// intercepted messages, false starts); when a sentence was read more than once it keeps the
// last take, which is usually the good one. cutPoints then moves each edge of a clip to the
// nearest silence, so a clip neither loses a syllable nor carries the next sentence's breath.
import { normalizeToken } from './align.mjs';
import { ttsKey } from './narration.mjs';

export const MIN_SCORE = 0.55; // a segment whose best match scores below this was not found
export const REVIEW_SCORE = 0.9; // below this the import report asks to listen to the clip
export const CLIP_SAMPLE_RATE = 24000; // same as the Chatterbox clips
export const CLIP_BITRATE_KBPS = 96;
const ANCHOR_SLACK = 0.1; // first pass: the earliest take within this of the best anchors the segment
const NEAR_BEST = 0.05; // second pass: takes within this of the best count as equally good; the last wins
const SENTENCE_SCORE = 0.8; // third pass: every sentence of a segment must be found at least this well to splice
const EDGE_SLACK = 0.02; // within a take, an extra first word is kept if it costs at most this much score
const EDGE_PAUSE_MS = 700; // ...and if it is not cut off from the take by a pause this long
const LOOKAHEAD = 300; // words searched past the previous segment for the next one
const MIN_LEN = 0.6; // candidate span length, relative to the segment text (in characters)
const MAX_LEN = 1.5;
const PRE_ROLL_MS = 80; // air kept before the first word when a silence precedes it
const POST_ROLL_MS = 120; // and after the last word, before the silence that follows
const SNAP_EARLY_MS = 500; // how far a silence may sit before an ASR word edge and still be snapped to
const SNAP_LATE_MS = 200; // and how far past it (ASR edges drift both ways, more often late at a start)
const LATE_ONSET_MAX_MS = 1200; // a word may start this far ahead of the silence it is stretched over
const FALLBACK_MS = 250; // with no silence nearby, never reach further than this past the word edge
const MISTIMED_PAUSE_MS = 300; // a pause this long starting inside a word means Whisper mistimed that word

const UNITS = 'cero uno dos tres cuatro cinco seis siete ocho nueve diez once doce trece catorce quince dieciseis diecisiete dieciocho diecinueve veinte veintiuno veintidos veintitres veinticuatro veinticinco veintiseis veintisiete veintiocho veintinueve'.split(' ');
const TENS = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
const HUNDREDS = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

/** 0–999999 in Spanish words, without spaces or accents (the form normalizeToken leaves). */
function numberWords(n) {
  if (n >= 1000) {
    const k = Math.floor(n / 1000);
    return `${k === 1 ? '' : numberWords(k)}mil${n % 1000 ? numberWords(n % 1000) : ''}`;
  }
  if (n >= 100) return n === 100 ? 'cien' : `${HUNDREDS[Math.floor(n / 100)]}${n % 100 ? numberWords(n % 100) : ''}`;
  if (n >= 30) return `${TENS[Math.floor(n / 10)]}${n % 10 ? `y${UNITS[n % 10]}` : ''}`;
  return UNITS[n];
}

/**
 * The form two texts are compared in: normalized (no case, accents, spaces or punctuation)
 * with every run of digits spelled out, so the ASR's «7» matches the script's «siete».
 * Digits are spelled before punctuation goes, so a dot between two numbers keeps them apart
 * («802.1X» is «ochocientos dos» + «uno equis», as the ASR's two words «802» «.1X.» read), unless
 * it is a thousands separator: a dot before exactly three digits («6.000» is «seis mil»).
 */
export function matchKey(text) {
  const spelled = String(text)
    .replace(/(\d)\.(?=\d{3}(?!\d))/g, '$1')
    .replace(/\d+/g, (d) => (d.length > 6 ? [...d].map((c) => UNITS[Number(c)]).join('') : numberWords(Number(d))));
  return normalizeToken(spelled);
}

/** Match key of one ASR word; drops the «.00» Whisper writes after an hour («4.00 y 12.00»). */
function asrKey(text) {
  return /^[.,:]?00$/.test(String(text).trim()) ? '' : matchKey(text);
}

/** Text similarity in [0, 1]: 1 − Levenshtein distance / longer length, over matchKey forms. */
export function similarity(a, b) {
  const x = matchKey(a);
  const y = matchKey(b);
  if (!x || !y) return 0;
  const row = levenshteinRow(y);
  let last = null;
  for (const ch of x) last = row(ch);
  return 1 - last / Math.max(x.length, y.length);
}

/**
 * Incremental Levenshtein against a fixed `target`: each call feeds one more character of
 * the other string and returns the distance between everything fed so far and `target`.
 */
function levenshteinRow(target) {
  const m = target.length;
  let prev = Int32Array.from({ length: m + 1 }, (_, k) => k);
  let cur = new Int32Array(m + 1);
  let fed = 0;
  return (ch) => {
    fed += 1;
    cur[0] = fed;
    for (let k = 1; k <= m; k++) {
      const sub = prev[k - 1] + (target[k - 1] === ch ? 0 : 1);
      cur[k] = Math.min(sub, prev[k] + 1, cur[k - 1] + 1);
    }
    [prev, cur] = [cur, prev];
    return prev[m];
  };
}

/**
 * Best span starting at each word in [from, to) (and ending before `limit`) for one segment,
 * scored against every form of its text. With `longestOnTie`, of the spans that share the best
 * score the one that ends last wins: a misheard last word («CN» for SIEM) replaces the script's
 * and ties with leaving it out, while a stray word after the sentence always scores lower.
 * @returns {{first: number, last: number, score: number}[]}
 */
function scanStarts(forms, tokens, from, to, limit, longestOnTie = false) {
  const minLen = Math.min(...forms.map((f) => f.length)) * MIN_LEN;
  const maxLen = Math.max(...forms.map((f) => f.length)) * MAX_LEN;
  const out = [];
  for (let i = from; i < to; i++) {
    if (!tokens[i]) continue;
    const spans = [];
    for (const form of forms) {
      const feed = levenshteinRow(form);
      let len = 0;
      let d = null;
      for (let j = i; j < limit && len <= maxLen; j++) {
        for (const ch of tokens[j]) d = feed(ch);
        len += tokens[j].length;
        if (d === null || len < minLen || len > maxLen) continue;
        spans.push({ first: i, last: j, score: 1 - d / Math.max(len, form.length) });
      }
    }
    if (!spans.length) continue;
    const top = bestScore(spans);
    const tied = spans.filter((s) => s.score === top);
    out.push(longestOnTie ? tied.reduce((a, b) => (b.last > a.last ? b : a)) : tied[0]);
  }
  return out;
}

const bestScore = (cands) => cands.reduce((m, c) => Math.max(m, c.score), -Infinity);

/**
 * Candidates that overlap are the same take read with a word more or less at the start; one
 * that starts after a take ends is a new take. Returns one candidate per take, in recording
 * order: the earliest-starting one within EDGE_SLACK of the take's best, because a clip that
 * loses its first word («¿Y…») is worse than one that keeps a word the ASR misheard.
 *
 * A take is a cluster around its best-scoring span, not a chain of overlaps: when a paragraph is
 * read again right away, a span that holds the last word of one reading and the start of the next
 * scores within a few points of both and overlaps both, so chaining by overlap fused consecutive
 * readings into one and the first always won (AP01 s01-04, read three times: the first reading
 * was kept). A candidate joins the seed it shares at least half its words with, or seeds a take.
 * The extra first word is only kept when it is said in one go with the rest: with `words`, a
 * pause of EDGE_PAUSE_MS or more between the extra words and the next candidate's start means they
 * belong to the take before (the tail of one reading glued to the next), so they are left out.
 * @param {{first: number, last: number, score: number}[]} cands
 * @param {{startMs: number, endMs: number}[]} [words] the ASR words the candidates index
 */
function groupTakes(cands, words = null) {
  const overlap = (a, b) => Math.min(a.last, b.last) - Math.max(a.first, b.first) + 1;
  const size = (c) => c.last - c.first + 1;
  const seeds = [];
  const members = [];
  for (const c of [...cands].sort((a, b) => b.score - a.score || a.first - b.first)) {
    let join = -1;
    for (let k = 0; k < seeds.length; k++) {
      const shared = overlap(c, seeds[k]);
      if (shared >= Math.min(size(c), size(seeds[k])) / 2 && (join < 0 || shared > overlap(c, seeds[join]))) join = k;
    }
    if (join < 0) {
      seeds.push(c);
      members.push([c]);
    } else {
      members[join].push(c);
    }
  }
  const joined = (from, to) => !words || ![...Array(to - from).keys()].some((k) => words[from + k + 1].startMs - words[from + k].endMs >= EDGE_PAUSE_MS);
  return seeds
    .map((seed, k) => ({ seed, group: members[k].sort((a, b) => a.first - b.first) }))
    .sort((a, b) => a.seed.first - b.seed.first)
    .map(({ seed, group }) => {
      const near = group.filter((c) => c.score >= seed.score - EDGE_SLACK);
      let pick = near[near.length - 1];
      for (let k = near.length - 2; k >= 0 && joined(near[k].first, pick.first); k--) pick = near[k];
      return pick;
    });
}

/**
 * Finds each segment in the transcript, in order.
 * @param {{id: string, parsed: {display: string, spoken: string}}[]} segments script order
 * @param {{text: string, startMs: number, endMs: number}[]} words ASR words of the whole recording
 * @returns {{id: string, found: boolean, score: number, first?: number, last?: number, heard?: string}[]}
 */
export function locateSegments(segments, words, { minScore = MIN_SCORE, lookahead = LOOKAHEAD } = {}) {
  const tokens = words.map((w) => asrKey(w.text));
  const n = tokens.length;
  const forms = segments.map((s) => [...new Set([matchKey(s.parsed.display), matchKey(s.parsed.spoken)])].filter(Boolean));

  // Pass 1: anchor every segment at its earliest good match after the previous one.
  const anchors = [];
  let cursor = 0;
  for (let k = 0; k < segments.length; k++) {
    const cands = forms[k].length ? scanStarts(forms[k], tokens, cursor, Math.min(n, cursor + lookahead), n) : [];
    const best = bestScore(cands);
    if (!(best >= minScore)) {
      anchors.push(null);
      continue;
    }
    const [pick] = groupTakes(cands.filter((c) => c.score >= best - ANCHOR_SLACK), words);
    anchors.push(pick);
    cursor = pick.last + 1;
  }

  // Pass 2: between its anchor and the next segment's, keep the last take that is as good as the best.
  const picks = segments.map((s, k) => {
    const anchor = anchors[k];
    if (!anchor) return null;
    const next = anchors.slice(k + 1).find(Boolean);
    const limit = next ? next.first : n;
    const cands = scanStarts(forms[k], tokens, anchor.first, limit, limit, true);
    const best = bestScore(cands);
    const takes = groupTakes(cands.filter((c) => c.score >= best - NEAR_BEST), words);
    return takes.length ? takes[takes.length - 1] : anchor;
  });

  // Pass 3: a narrator often re-reads just the sentence that went wrong, or restarts one half-way. Up to
  // the next segment's take, keep the last take of every sentence, and splice them when that reads better.
  const heardOf = (spans) => spans.flatMap((p) => words.slice(p.first, p.last + 1).map((w) => w.text)).join(' ');
  return segments.map((s, k) => {
    const pick = picks[k];
    if (!pick) return { id: s.id, found: false, score: 0 };
    // The sentences are looked for between the previous segment's take and the next one's: a false start
    // can make pass 2 begin the take late, after the first sentence.
    const prev = picks.slice(0, k).reverse().find(Boolean);
    const next = picks.slice(k + 1).find(Boolean);
    const parts = sentenceTakes(s, tokens, prev ? prev.last + 1 : 0, next ? next.first : n, words);
    const spliced = parts && parts.length > 1 ? parts : null;
    const whole = { first: pick.first, last: pick.last };
    const heard = heardOf(spliced ?? [whole]);
    // Scored like pass 2 scores a take: against the shown and the spoken form, whichever is closer.
    const score = spliced ? Math.max(similarity(s.parsed.display, heard), similarity(s.parsed.spoken, heard)) : pick.score;
    // A splice must read at least as well as the take it replaces; on a tie the later reading wins.
    const useSplice = spliced && score >= pick.score - 0.01;
    return {
      id: s.id,
      found: true,
      score: Math.round((useSplice ? score : pick.score) * 100) / 100,
      first: useSplice ? spliced[0].first : pick.first,
      last: useSplice ? spliced.at(-1).last : pick.last,
      ...(useSplice ? { parts: spliced } : {}),
      heard: useSplice ? heard : heardOf([whole]),
    };
  });
}

/** A segment's sentences, each with its match forms (shown and spoken), or null when the two forms split differently. */
function sentenceForms(segment) {
  const split = (text) => text.split(/(?<=[.!?…])\s+/).map((x) => x.trim()).filter(Boolean);
  const shown = split(segment.parsed.display);
  const said = split(segment.parsed.spoken);
  if (said.length !== shown.length) return shown.map((x) => [matchKey(x)].filter(Boolean));
  return shown.map((x, j) => [...new Set([matchKey(x), matchKey(said[j])])].filter(Boolean));
}

/**
 * The last take of every sentence of a segment in words [from, limit), chosen from the last sentence
 * backwards so they stay in order, as merged runs of words ({first, last}); null when the segment has a
 * single sentence or some sentence is not there.
 */
function sentenceTakes(segment, tokens, from, limit, words) {
  const sentences = sentenceForms(segment);
  if (sentences.length < 2 || sentences.some((f) => !f.length)) return null;
  const chosen = [];
  let end = limit;
  for (let j = sentences.length - 1; j >= 0; j--) {
    const cands = scanStarts(sentences[j], tokens, from, end, end, true);
    const best = bestScore(cands);
    if (!(best >= SENTENCE_SCORE)) return null;
    const takes = groupTakes(cands.filter((c) => c.score >= best - NEAR_BEST), words);
    const take = takes[takes.length - 1];
    chosen.unshift({ first: take.first, last: take.last });
    end = take.first;
  }
  const merged = [];
  for (const p of chosen) {
    const prev = merged[merged.length - 1];
    if (prev && p.first === prev.last + 1) prev.last = p.last;
    else merged.push({ ...p });
  }
  return merged;
}

/**
 * Whisper sometimes stretches a word over the pause next to it (V4: «y» got 151.22–153.10 s, with the pause
 * after the previous «IP» inside it), so a cut placed from those edges lands in the wrong place and chops a
 * word. For a pause of at least `minMs` strictly inside a word's span, the word is the longer of the two sides
 * (the shorter one is the tail or onset of its neighbour): after the pause, the start moves to its end; before
 * it, the end moves to its start. (V4: «y» 151.22–153.10 with a pause 151.39–152.53 is really 152.53–153.10.)
 */
export function repairSwallowedPauses(words, silences, { minMs = 300 } = {}) {
  return words.map((w) => {
    let { startMs, endMs } = w;
    for (const s of silences) {
      if (s.endMs - s.startMs < minMs || s.startMs <= startMs || s.endMs >= endMs) continue;
      if (endMs - s.endMs >= s.startMs - startMs) startMs = s.endMs;
      else endMs = s.startMs;
    }
    return startMs === w.startMs && endMs === w.endMs ? w : { ...w, startMs, endMs };
  });
}

/** Where a clip's voice really stops: the start of a silence that runs to its end (within 40 ms), else its length. */
export function trailingSpeechEnd(silences, durationMs) {
  const tail = silences.find((s) => s.endMs >= durationMs - 40 && s.startMs < durationMs);
  return tail ? tail.startMs : durationMs;
}

/** Silences from ffmpeg silencedetect's stderr; one still open at the end runs to `totalMs`. */
export function parseSilences(stderr, totalMs) {
  const out = [];
  let open = null;
  for (const m of stderr.matchAll(/silence_(start|end): (-?[\d.]+)/g)) {
    const ms = Math.max(0, Math.round(Number.parseFloat(m[2]) * 1000));
    if (m[1] === 'start') open = ms;
    else if (open !== null) {
      out.push({ startMs: open, endMs: ms });
      open = null;
    }
  }
  if (open !== null) out.push({ startMs: open, endMs: totalMs });
  return out;
}

/** The candidate whose `at(c)` is nearest to `target`, or null. */
function nearest(cands, at, target) {
  let best = null;
  for (const c of cands) if (!best || Math.abs(at(c) - target) < Math.abs(at(best) - target)) best = c;
  return best;
}

/**
 * Clip edges for every found segment: each edge snaps to the nearest silence around the ASR
 * word edge (keeping a little air), or — with no silence nearby, as in continuous speech —
 * falls halfway into the gap to the neighbouring word. An edge never reaches into a word
 * the segment does not own. `maxLeadMs` (off by default) caps the air kept before the first word.
 */
export function cutPoints(located, words, silences, totalMs, { maxLeadMs = null } = {}) {
  const cutSpan = (span) => cutEdges(span, words, silences, totalMs, maxLeadMs);
  return located
    .filter((f) => f.found)
    .map((f) => {
      if (!f.parts) return { id: f.id, ...cutSpan(f) };
      // A spliced take: every part is cut on its own, so a join never reaches into the dropped words.
      const parts = f.parts.map(cutSpan);
      return { id: f.id, startMs: parts[0].startMs, endMs: parts[parts.length - 1].endMs, parts };
    });
}

/** Clip edges of one run of words ({first, last}), as cutPoints describes. */
function cutEdges(f, words, silences, totalMs, maxLeadMs = null) {
  // Whisper writes a figure like «50.000» as «50» + «.000» and times the first part short, so the fragments that
  // follow at once are the rest of the same word, not the next one (V25 s04-06 was cut inside «cincuenta mil»).
  let last = f.last;
  while (last + 1 < words.length && /^[.,]\d{1,3}[.,]?$/.test(words[last + 1].text.trim()) && words[last + 1].startMs - words[last].endMs <= 200) last++;
  const rawStart = words[f.first].startMs;
  const rawEnd = words[last].endMs;
  const prevEnd = f.first > 0 ? words[f.first - 1].endMs : 0;
  const nextStart = last + 1 < words.length ? words[last + 1].startMs : totalMs;
  // With no silence at an edge, a long pause that starts inside the word across it means that word is mistimed:
  // Whisper dropped a word and stretched its neighbour over the dropped audio (V4 s02-03: «júis» was never
  // transcribed, so «Y» got 70.12–71.18 s with the pause after «júis», 70.82–72.04, starting inside it). Both
  // clips then cut in that pause, whatever the word edges say — the next word's for the end, the first's for the start.
  const mistimedPause = (w) =>
    w ? nearest(silences.filter((s) => s.endMs - s.startMs >= MISTIMED_PAUSE_MS && s.startMs > w.startMs && s.startMs < w.endMs), (s) => s.startMs, w.startMs) : null;

  // Whisper often starts a sentence's first word long before the voice does, over the silence ahead of it
  // (V18 and V19: 0.5–0.8 s early). A word that "starts" inside a silence starts where that silence ends — as long
  // as the next word of the run starts after it — and the cut follows the sound, not the stretched timestamp.
  const afterFirst = f.first < f.last ? words[f.first + 1].startMs : rawEnd;
  const lateOnset = nearest(
    silences.filter((s) => s.startMs <= rawStart && s.endMs > rawStart + SNAP_LATE_MS && s.endMs - rawStart <= LATE_ONSET_MAX_MS && s.endMs <= afterFirst),
    (s) => s.endMs,
    rawStart,
  );
  const lead =
    lateOnset ??
    nearest(
      silences.filter((s) => s.endMs >= Math.max(prevEnd, rawStart - SNAP_EARLY_MS) && s.endMs <= rawStart + SNAP_LATE_MS),
      (s) => s.endMs,
      rawStart,
    );
  const leadPause = lead ? null : mistimedPause(words[f.first]);
  const startMs = lead
    ? Math.max(lead.startMs, prevEnd, lead.endMs - PRE_ROLL_MS)
    : leadPause
      ? Math.max(leadPause.startMs, leadPause.endMs - PRE_ROLL_MS)
      : Math.max(Math.min(rawStart, Math.round((prevEnd + rawStart) / 2)), rawStart - FALLBACK_MS);

  const tail = nearest(
    silences.filter((s) => s.startMs >= rawEnd - SNAP_LATE_MS && s.startMs <= Math.min(nextStart, rawEnd + SNAP_EARLY_MS)),
    (s) => s.startMs,
    rawEnd,
  );
  const tailPause = tail ? null : mistimedPause(words[last + 1]);
  const endMs = tail
    ? Math.min(tail.endMs, nextStart, tail.startMs + POST_ROLL_MS)
    : tailPause
      ? Math.min(tailPause.endMs, tailPause.startMs + POST_ROLL_MS)
      : Math.min(Math.max(rawEnd, Math.round((rawEnd + nextStart) / 2)), rawEnd + FALLBACK_MS);

  // A breath or a click before the sentence ends the silence long before the first word does (V18, V19: clips that
  // began 500–800 ms ahead of the voice), so the air kept in front of the word is capped when asked to.
  const leadCapped = maxLeadMs === null ? startMs : Math.max(startMs, rawStart - maxLeadMs);
  return { startMs: leadCapped, endMs: Math.max(endMs, leadCapped + 1) };
}

/**
 * The parts of a cut to keep: all of it, minus the middle of every pause inside it longer than
 * `maxPauseMs` — half of `maxPauseMs` stays on each side, so the join falls in silence and the
 * reading keeps its breath without the dead air. Pauses at the edges are cutPoints' business.
 */
export function keepRanges(cut, silences, maxPauseMs) {
  if (!maxPauseMs) return [cut];
  const half = Math.round(maxPauseMs / 2);
  const ranges = [];
  let from = cut.startMs;
  for (const s of silences) {
    if (s.startMs <= cut.startMs || s.endMs >= cut.endMs || s.endMs - s.startMs <= maxPauseMs) continue;
    ranges.push({ startMs: from, endMs: s.startMs + half });
    from = s.endMs - half;
  }
  ranges.push({ startMs: from, endMs: cut.endMs });
  return ranges;
}

/** A recording time in the clip made of `ranges`; a time in a removed pause lands on the join. */
function clipTime(t, ranges) {
  let acc = 0;
  for (const r of ranges) {
    if (t < r.startMs) return acc;
    if (t <= r.endMs) return acc + t - r.startMs;
    acc += r.endMs - r.startMs;
  }
  return acc;
}

const rangesMs = (ranges) => ranges.reduce((sum, r) => sum + r.endMs - r.startMs, 0);

/** Word boundaries of one clip (words[first..last]) made of `ranges`, in the TTS record format. */
export function clipWords(words, first, last, ranges, parts = null) {
  // The «.000» Whisper splits off a figure is part of the clip (cutEdges keeps its audio), so its word stays too.
  let end = last;
  while (end + 1 < words.length && /^[.,]\d{1,3}[.,]?$/.test(words[end + 1].text.trim()) && words[end + 1].startMs - words[end].endMs <= 200) end++;
  // A spliced take keeps only its parts' words; the dropped ones are not in the clip.
  const kept = parts ? parts.flatMap((p) => words.slice(p.first, p.last + 1)) : words.slice(first, end + 1);
  return kept.map((w) => {
    const offsetMs = clipTime(w.startMs, ranges);
    return { text: w.text, offsetMs, durationMs: Math.max(1, clipTime(w.endMs, ranges) - offsetMs) };
  });
}

/** For every recorded word, whether a found segment uses it. */
function usedWords(located, count) {
  const used = new Array(count).fill(false);
  for (const f of located) if (f.found) for (const p of f.parts ?? [f]) for (let k = p.first; k <= p.last; k++) used[k] = true;
  return used;
}

/**
 * Readings of a found segment (or of one of its sentences) that the import left out although they come AFTER
 * the one it used and before the next segment's: the narrator's last take is the good one, so each of these is a
 * clip to check or rebuild (`recutAdvice`). Only unused stretches that read the text at least `minScore` are listed.
 * @returns {{id: string, startMs: number, endMs: number, score: number, sentence: boolean}[]}
 */
export function laterTakes(segments, located, words, { minScore = 0.85, minWords = 4 } = {}) {
  const tokens = words.map((w) => asrKey(w.text));
  const used = usedWords(located, words.length);
  const out = [];
  located.forEach((f, k) => {
    if (!f.found) return;
    const whole = [...new Set([matchKey(segments[k].parsed.display), matchKey(segments[k].parsed.spoken)])].filter(Boolean);
    const sentences = sentenceForms(segments[k]).filter((forms) => forms.length && Math.min(...forms.map((x) => x.length)) >= minWords * 3);
    const targets = [{ forms: whole, sentence: false }, ...(sentences.length > 1 ? sentences.map((forms) => ({ forms, sentence: true })) : [])].filter((t) => t.forms.length);
    const end = Math.max(...(f.parts ?? [f]).map((p) => p.last));
    const nextUsed = located.slice(k + 1).find((g) => g.found);
    const limit = nextUsed ? Math.min(...(nextUsed.parts ?? [nextUsed]).map((p) => p.first)) : words.length;
    for (let i = end + 1; i < limit; i++) {
      if (used[i]) continue;
      let j = i;
      while (j + 1 < limit && !used[j + 1]) j++;
      for (const t of targets) {
        const spans = scanStarts(t.forms, tokens, i, j + 1, j + 1, true);
        const best = bestScore(spans);
        if (!(best >= minScore)) continue;
        const span = spans.filter((s) => s.score === best).reduce((a, b) => (b.first > a.first ? b : a));
        out.push({ id: f.id, startMs: words[span.first].startMs, endMs: words[span.last].endMs, score: Math.round(best * 100) / 100, sentence: t.sentence });
      }
      i = j;
    }
  });
  return out.filter((h) => !h.sentence || !out.some((o) => !o.sentence && o.id === h.id && o.startMs <= h.endMs && h.startMs <= o.endMs));
}

/**
 * Segments whose clip starts after the first word of the script. The mark is a clip that begins at a word the
 * script does not start with, while the words right before it (unused, said without a pause) include one that does:
 * Whisper garbled the opening and the best match began a little late (documentos s02-01: «Empezamos con un caso»
 * was heard as "Empezamos con el examen. Con un caso", the clip began at «Con» and the narrator's first word was
 * left out; nothing else flagged it). The clip is cut at the voice, so it really misses those words.
 * @returns {{id: string, word: string, missed: string, startMs: number, endMs: number}[]}
 */
export function midSentenceStarts(segments, located, words, { maxGapMs = 600, lookback = 4, minSimilarity = 0.75 } = {}) {
  const tokens = words.map((w) => asrKey(w.text));
  const used = usedWords(located, words.length);
  const out = [];
  located.forEach((f, k) => {
    if (!f.found) return;
    const openers = [...new Set([segments[k].parsed.display, segments[k].parsed.spoken].map((t) => matchKey(String(t).trim().split(/\s+/)[0] ?? '')).filter(Boolean))];
    if (!openers.length) return;
    const first = (f.parts ?? [f])[0].first;
    const fits = (i) => openers.some((o) => tokens[i] && similarity(tokens[i], o) >= minSimilarity);
    if (fits(first)) return;
    let from = first;
    for (let i = first - 1; i >= 0 && first - i <= lookback; i--) {
      if (used[i] || !tokens[i] || words[i + 1].startMs - words[i].endMs > maxGapMs) break;
      if (fits(i)) from = i;
    }
    if (from === first) return;
    out.push({
      id: f.id,
      word: words[from].text.replace(/[¿?¡!«»".,;:]/g, ''),
      missed: words.slice(from, first).map((w) => w.text).join(' '),
      startMs: words[from].startMs,
      endMs: words[first - 1].endMs,
    });
  });
  return out;
}

/**
 * The stretches to transcribe again after the first pass left segments out: each run of missing segments with voice
 * where it should be (missingGaps), at least `minMs` long and at most `maxMs`.
 */
export function retryTargets(gaps, { minMs = 800, maxMs = 120000 } = {}) {
  return gaps
    .filter((g) => g.startMs !== null && g.endMs - g.startMs >= minMs)
    .map((g) => ({ ids: g.ids, startMs: g.startMs, endMs: Math.min(g.endMs, g.startMs + maxMs) }));
}

/** `words` with those of `range` replaced by `patch` (the words of a second transcription of that stretch). */
export function mergeAsrWords(words, patch, { startMs, endMs }) {
  const inside = (w) => (w.startMs + w.endMs) / 2 >= startMs && (w.startMs + w.endMs) / 2 < endMs;
  return [...words.filter((w) => !inside(w)), ...patch.filter(inside)].sort((a, b) => a.startMs - b.startMs || a.endMs - b.endMs);
}

/** Runs of recorded words that no found segment uses (what was skipped), for the import report. */
export function unusedRanges(located, words) {
  const used = usedWords(located, words.length);
  const out = [];
  let run = null;
  words.forEach((w, k) => {
    if (used[k]) {
      run = null;
      return;
    }
    if (!run) out.push((run = { startMs: w.startMs, endMs: w.endMs, text: w.text }));
    else {
      run.endMs = w.endMs;
      run.text += ` ${w.text}`;
    }
  });
  return out;
}

const RECUT_PAD_MS = 300; // silence kept on each side of the voice in a recut suggestion
const RECUT_GAP_S = 0.8; // the digital silence recut_recording.py writes after each part (its --gap default)

/**
 * ffmpeg filter that measures a stretch of the recording as loud as recut_recording.py will write it: on a
 * sentence the silence after it weighs in (V10 s01-01: -19.23 LUFS bare, -19.53 cut), and --lufs must match the cut.
 */
export function recutLoudnessFilter() {
  return `apad=pad_dur=${RECUT_GAP_S},loudnorm=print_format=json`;
}

/**
 * Where each run of consecutive segments that were not found should be in the recording: between the cut of the
 * found segment before it (or the start) and the one after it (or the end), trimmed to the voice inside — a
 * silence over either edge is dropped but RECUT_PAD_MS of it — with what Whisper heard there that no segment uses.
 * @returns {{ids: string[], startMs: number | null, endMs: number | null, heard: string}[]} null edges: no voice there
 */
export function missingGaps(located, cuts, words, silences, totalMs) {
  const cutOf = new Map(cuts.map((c) => [c.id, c]));
  const used = usedWords(located, words.length);
  const runs = [];
  located.forEach((f, k) => {
    if (f.found) return;
    const run = runs[runs.length - 1];
    if (run && run.last === k - 1) {
      run.ids.push(f.id);
      run.last = k;
    } else runs.push({ ids: [f.id], first: k, last: k });
  });
  return runs.map(({ ids, first, last }) => {
    const prev = located.slice(0, first).reverse().find((f) => f.found);
    const next = located.slice(last + 1).find((f) => f.found);
    const from = prev ? cutOf.get(prev.id).endMs : 0;
    const to = next ? cutOf.get(next.id).startMs : totalMs;
    const heard = words.filter((w, k) => !used[k] && w.startMs >= from && w.startMs < to).map((w) => w.text).join(' ');
    const lead = silences.find((s) => s.startMs <= from && from < s.endMs);
    const tail = silences.find((s) => s.startMs < to && to <= s.endMs);
    const voiceFrom = lead ? lead.endMs : from;
    const voiceTo = tail ? tail.startMs : to;
    if (voiceTo <= voiceFrom) return { ids, startMs: null, endMs: null, heard };
    return {
      ids,
      startMs: lead ? Math.max(lead.startMs, voiceFrom - RECUT_PAD_MS) : from,
      endMs: tail ? Math.min(tail.endMs, voiceTo + RECUT_PAD_MS) : to,
      heard,
    };
  });
}

/**
 * What to tell the narrator about one missingGaps entry: the likely cause and, when there is voice there, the
 * exact commands that cut it into its own file (recut_recording.py) and import just those segments with the
 * full import's gain (`lufs` = that excerpt's loudness + the gain; --match measured on one sentence gives more).
 * Paths are as the commands are run, from the repo root.
 */
export function recutAdvice(gap, { file, out, slug, name, python, lufs, cause: given }) {
  const ids = gap.ids.join(', ');
  if (gap.startMs === null) {
    return [`${ids}: no voice between the sentences around it — was it recorded? Record it and import that file with --only ${gap.ids.join(',')}`];
  }
  const cause = given ?? (gap.heard
    ? `Whisper heard «${gap.heard}» there, too far from the script — listen to it, and if it was misread, re-record it`
    : 'there is voice there but Whisper heard nothing (it drops audio after a long silence, more so when it repeats the start of its prompt)');
  const sec = (ms) => (ms / 1000).toFixed(2);
  const quote = (p) => (/\s/.test(p) ? `"${p}"` : p);
  return [
    `${ids} should be at ${clock(gap.startMs)}–${clock(gap.endMs)}: ${cause}. If it is read right there, cut it out and import just that:`,
    `  ${quote(python)} video/engine/scripts/recut_recording.py --out "${out}" --part "${file}@${sec(gap.startMs)}-${sec(gap.endMs)}"`,
    `  node video/engine/scripts/import-recording.mjs --video ${slug} --file "${out}" --name ${name} --only ${gap.ids.join(',')} --lufs=${lufs}`,
  ];
}

/** Longest a spoken word can plausibly last; beyond it Whisper stretched it over voice it did not transcribe. */
export const MAX_WORD_MS = 1200;

/**
 * Words of the found segments that last too long: the mark of a half-said sentence glued to its retake. Whisper
 * drops the first words of the retake and stretches the word before them over it (V19 s03-03: «disco» lasted 5 s
 * across 2.8 s of silence and the voice that followed), and the clip then keeps both takes. Spelled acronyms
 * and numbers (CVSS, 9.8) are slow by nature and are left out. `retakeMs` is where the voice resumes after the
 * last silence inside the word: the likely start of the clean take.
 */
export function stretchedWords(located, words, silences, { maxMs = MAX_WORD_MS, minPauseMs = 300 } = {}) {
  const out = [];
  for (const f of located) {
    if (!f.found) continue;
    for (const p of f.parts ?? [f]) {
      for (let k = p.first; k <= p.last; k++) {
        const w = words[k];
        // Whisper times a figure short and stretches the next word over the rest of the number («450
        // dispositivos», AP07 s04-03): that word may last a quarter second more per digit.
        const prev = words[k - 1];
        const digits = prev && /\d/.test(prev.text) && w.startMs - prev.endMs <= 300 ? prev.text.replace(/\D/g, '').length : 0;
        if (w.endMs - w.startMs <= maxMs + digits * 250) continue;
        if (/^[A-Z0-9][A-Z0-9.,\-]*$/.test(w.text.replace(/[¿?¡!«»".;:]/g, ''))) continue;
        const inside = silences.filter((s) => s.endMs - s.startMs >= minPauseMs && s.startMs > w.startMs - 1 && s.endMs < w.endMs + 1);
        const last = inside.length ? inside[inside.length - 1] : null;
        out.push({ id: f.id, text: w.text.replace(/[¿?¡!«»".,;:]/g, ''), startMs: w.startMs, endMs: w.endMs, retakeMs: last ? last.endMs : null });
      }
    }
  }
  return out;
}

/** Integrated loudness (LUFS) and true peak (dBTP) from ffmpeg loudnorm's print_format=json analysis. */
export function parseLoudness(stderr) {
  const json = stderr.slice(stderr.lastIndexOf('{'), stderr.lastIndexOf('}') + 1);
  const data = JSON.parse(json);
  const integrated = Number(data.input_i);
  const truePeak = Number(data.input_tp);
  if (!Number.isFinite(integrated) || !Number.isFinite(truePeak)) throw new Error(`loudnorm measured no signal (input_i ${data.input_i})`);
  return { integrated, truePeak };
}

/** Gain (dB, one decimal) that brings `measured` to `targetLufs` without pushing its peak past `ceilingDbtp`. */
export function gainDb(measured, targetLufs, ceilingDbtp = -1) {
  return Math.round(Math.min(targetLufs - measured.integrated, ceilingDbtp - measured.truePeak) * 10) / 10;
}

/**
 * Args for the ffmpeg binary (runFfmpeg) that cut a clip from `source` — seeking in the input,
 * which on a WAV is sample-exact and skips decoding what comes before — splice its `ranges`
 * together when there is more than one (atrim + concat), apply `gain` dB and encode it. A `tempo`
 * other than 1 speeds the clip up (or slows it down) with ffmpeg's pitch-preserving atempo.
 */
export function clipArgs({ source, ranges, gain, out, tempo = 1 }) {
  const start = ranges[0].startMs;
  const end = ranges[ranges.length - 1].endMs;
  const sec = (ms) => String(ms / 1000);
  // tempo 1 keeps the arguments byte-identical to before recordings had a tempo.
  const level = tempo === 1 ? `volume=${gain}dB` : `volume=${gain}dB,atempo=${tempo}`;
  const filter =
    ranges.length === 1
      ? ['-af', level]
      : [
          '-filter_complex',
          `${ranges.map((r, k) => `[0:a]atrim=start=${sec(r.startMs - start)}:end=${sec(r.endMs - start)},asetpts=PTS-STARTPTS[a${k}]`).join(';')};` +
            `${ranges.map((_, k) => `[a${k}]`).join('')}concat=n=${ranges.length}:v=0:a=1,${level}[out]`,
          '-map', '[out]',
        ];
  return [
    '-v', 'error', '-y', '-ss', sec(start), '-t', sec(end - start), '-i', source,
    ...filter, '-ac', '1', '-ar', String(CLIP_SAMPLE_RATE),
    '-c:a', 'libmp3lame', '-b:a', `${CLIP_BITRATE_KBPS}k`, '-write_xing', '0', '-id3v2_version', '0', out,
  ];
}

/** Speed-ups a human recording keeps sounding natural with: from a touch slower to a quarter faster. */
export const RECORDING_TEMPO = Object.freeze([0.8, 1.25]);

/**
 * Tempo and pause limit of an import: narration.json "recording": { "tempo", "maxPauseMs" }, each
 * overridden by its command-line flag. Without either, tempo 1 and no pause limit — what every import
 * did before the setting existed, so older videos re-import byte-identically.
 */
export function recordingSettings(narration, { tempo, maxPauseMs } = {}) {
  const own = narration?.recording ?? {};
  if (own === null || typeof own !== 'object' || Array.isArray(own)) throw new Error('narration.json "recording" must be an object');
  const unknown = Object.keys(own).filter((k) => !['tempo', 'maxPauseMs'].includes(k));
  if (unknown.length) throw new Error(`narration.json "recording": unknown key(s) ${unknown.join(', ')} (known: tempo, maxPauseMs)`);
  const settings = { tempo: tempo ?? own.tempo ?? 1, maxPauseMs: maxPauseMs ?? own.maxPauseMs ?? null };
  const [lo, hi] = RECORDING_TEMPO;
  if (typeof settings.tempo !== 'number' || !(settings.tempo >= lo && settings.tempo <= hi)) {
    throw new Error(`recording tempo must be a number between ${lo} and ${hi} (got ${JSON.stringify(settings.tempo)})`);
  }
  if (settings.maxPauseMs !== null && !(Number.isInteger(settings.maxPauseMs) && settings.maxPauseMs >= 100)) {
    throw new Error(`recording maxPauseMs must be a whole number of milliseconds, at least 100 (got ${JSON.stringify(settings.maxPauseMs)})`);
  }
  return settings;
}

/**
 * Whether a cached transcript still fits: same recording (hash), same model and same stretches heard (asrClips;
 * a transcript cached before Whisper skipped long silences heard the whole file, `clips` null). The prompt is not
 * part of it: it opens with the script's first sentence, so rewriting that sentence re-transcribed the whole
 * recording (~5 min, and a different spelling of the numbers) although the audio had not changed. --force-asr redoes it.
 */
export function asrCacheValid(cached, { sha256, model, clips = null }) {
  return (
    Boolean(cached) &&
    cached.sha256 === sha256 &&
    cached.model === model &&
    Array.isArray(cached.words) &&
    JSON.stringify(cached.clips ?? null) === JSON.stringify(clips)
  );
}

/**
 * Silences Whisper is not given (asrClips). At the edges from 8 s: Whisper's initial prompt only counts in the
 * first 30 s window it decodes, and over a silence it gets lost — V10 (logs-halden) opened with 28.5 s of it, the
 * first window was dropped as «no speech» and the next one skipped «…cola de alertas trae tres rastros de
 * anoche», the end of the prompt's first sentence; with 10 s, Whisper wrote the prompt's tail into the silence.
 * Inside the recording from 15 s: a window that is mostly silence can be dropped whole, with the start of the
 * sentence that follows it. Every published recording stays under both (at most 5.9 s at an edge, pivot-infra,
 * and 13.7 s inside, iam-halden), so its transcript and clips do not change.
 */
export const LONG_EDGE_SILENCE_MS = 8000;
export const LONG_PAUSE_MS = 15000;
const ASR_MARGIN_MS = 1000; // air Whisper still hears on each side of a skipped silence
// A silence this close to an edge is at that edge: ffmpeg prints the duration rounded to 10 ms, and a click in the
// first few ms of a recording makes its leading silence start just after 0.
const EDGE_TOLERANCE_MS = 100;

/** ms from the "Duration: HH:MM:SS.cc" line ffmpeg prints for its input, or null. */
export function parseDuration(stderr) {
  const m = /Duration: (\d+):(\d{2}):(\d{2}(?:\.\d+)?)/.exec(stderr);
  return m ? Math.round(((Number(m[1]) * 60 + Number(m[2])) * 60 + Number(m[3])) * 1000) : null;
}

/**
 * The stretches of the recording Whisper transcribes: all of it but its long silences (LONG_EDGE_SILENCE_MS at
 * the start or end, LONG_PAUSE_MS inside), keeping ASR_MARGIN_MS of each, rounded out to whole seconds so a
 * slightly different silence detection keeps the cached transcript. Its timestamps stay in the recording's time.
 * @returns {{startMs: number, endMs: number}[] | null} null when there is no such silence: the whole file, as before
 */
export function asrClips(silences, totalMs) {
  const atStart = (s) => s.startMs <= EDGE_TOLERANCE_MS;
  const atEdge = (s) => atStart(s) || s.endMs >= totalMs - EDGE_TOLERANCE_MS;
  const long = silences.filter((s) => s.endMs - s.startMs >= (atEdge(s) ? LONG_EDGE_SILENCE_MS : LONG_PAUSE_MS));
  if (!long.length) return null;
  const clips = [];
  let from = 0;
  for (const s of long) {
    if (!atStart(s) && s.startMs > from) clips.push({ startMs: from, endMs: Math.ceil((s.startMs + ASR_MARGIN_MS) / 1000) * 1000 });
    if (s.endMs >= totalMs - EDGE_TOLERANCE_MS) return clips.length ? clips : null;
    from = Math.max(0, Math.floor((s.endMs - ASR_MARGIN_MS) / 1000) * 1000);
  }
  clips.push({ startMs: from, endMs: Math.ceil(totalMs / 1000) * 1000 });
  return clips;
}

/**
 * Whisper's initial prompt: the script's first sentence, then the adversary's name and the
 * lexicon's terms, so it spells them as the script does. The sentence goes first because a bare
 * comma list reads to Whisper as a list, and it starts numbering what it hears («2. 3. 4.»).
 */
export function asrPrompt({ opening, adversary, lexicon }) {
  const first = String(opening ?? '').trim().split(/(?<=[.!?…])\s+/)[0];
  const sentence = (s) => (/[.!?…]$/.test(s) ? s : `${s}.`);
  const terms = Object.keys(lexicon ?? {});
  return [first && sentence(first), adversary && sentence(adversary), terms.length && `${terms.join(', ')}.`].filter(Boolean).join(' ');
}

/** The segments named in `only` (all of them when it is null), in script order; unknown ids throw. */
export function selectSegments(segments, only) {
  if (!only) return segments;
  const unknown = only.filter((id) => !segments.some((s) => s.id === id));
  if (unknown.length) throw new Error(`--only names segments that are not in narration.json: ${unknown.join(', ')}`);
  return segments.filter((s) => only.includes(s.id));
}

/** The tts/<id>.json record of one clip: keyed like every provider's, plus where it came from and how well it matched. */
export function recordingRecord({ voice, rate, pitch, spoken, bytes, ranges, located, words, source, asrModel }) {
  const startMs = ranges[0].startMs;
  const endMs = ranges[ranges.length - 1].endMs;
  const durationMs = rangesMs(ranges);
  return {
    provider: 'recording',
    key: ttsKey(voice, rate, pitch, spoken),
    voice,
    rate,
    pitch,
    spoken,
    bytes,
    bitrateKbps: CLIP_BITRATE_KBPS,
    durationMs,
    source: { ...source, startMs, endMs, pausesRemovedMs: endMs - startMs - durationMs },
    asr: { model: asrModel, text: located.heard, score: located.score },
    words: clipWords(words, located.first, located.last, ranges, located.parts ?? null),
  };
}

/** m:ss.s */
export function clock(ms) {
  const tenths = Math.round(ms / 100);
  return `${Math.floor(tenths / 600)}:${((tenths % 600) / 10).toFixed(1).padStart(4, '0')}`;
}

/** Markdown report of one import: every segment's match, and the recorded audio that no segment uses. */
export function importReport({ located, cuts, words, gain, pausesRemovedMs = 0, later = [], midStarts = [], retried = [], silentRuns = [], ghosts = [], edgeFixes = [], edgeOffenders: offenders = null }) {
  const cutOf = new Map(cuts.map((c) => [c.id, c]));
  const rows = located.map((f) => {
    if (!f.found) return `| ${f.id} | — | — | no encontrada |`;
    const c = cutOf.get(f.id);
    const state = f.score < REVIEW_SCORE ? 'revisar' : 'ok';
    return `| ${f.id} | ${f.score.toFixed(2)} | ${clock(c.startMs)}–${clock(c.endMs)} | ${f.parts ? `${state} · empalme de la última toma de cada oración` : state} |`;
  });
  const unused = unusedRanges(located, words).map((r) => `- ${clock(r.startMs)}–${clock(r.endMs)} · ${r.text}`);
  return [
    '# Importación de la grabación',
    '',
    `Ganancia aplicada: ${gain >= 0 ? '+' : ''}${gain} dB.${pausesRemovedMs > 0 ? ` Pausas internas recortadas: ${(pausesRemovedMs / 1000).toFixed(1)} s.` : ''} «revisar»: coincide menos de ${REVIEW_SCORE} con el guion (palabras de más o de menos); escúchala.`,
    '',
    '| Frase | Coincidencia | En la grabación | Estado |',
    '|---|---|---|---|',
    ...rows,
    '',
    ...(silentRuns.length
      ? [
          '## Palabras sin duración descartadas',
          '',
          'Whisper inventó texto sin tiempo propio (todas las palabras en el mismo instante). Se ignoran al colocar los cortes; la transcripción guardada no se toca.',
          '',
          ...silentRuns.map((r) => `- ${(r.startMs / 1000).toFixed(2)} s · ${r.count} palabras sin duración descartadas: ${r.text}`),
          '',
        ]
      : []),
    ...(ghosts.length
      ? [
          '## Palabras fantasma recortadas',
          '',
          'Palabras cortas que Whisper estiró sobre un silencio; se recortan a la parte con voz.',
          '',
          ...ghosts.map((g) => `- «${g.text}» ${clock(g.startMs)}–${clock(g.endMs)} → ${clock(g.toStartMs)}–${clock(g.toEndMs)}`),
          '',
        ]
      : []),
    ...(edgeFixes.length
      ? [
          '## Bordes movidos fuera de la voz',
          '',
          'El corte caía dentro de la voz (energía en los 30 ms del borde por encima de lo que verify-voice tolera); se movió al silencio más cercano.',
          '',
          ...edgeFixes.flatMap((f) => [
            ...(f.head ? [`- ${f.id} · inicio ${clock(f.head.fromMs)} → ${clock(f.head.toMs)} (energía ${f.head.before.toFixed(2)} → ${f.head.after.toFixed(2)})`] : []),
            ...(f.tail ? [`- ${f.id} · final ${clock(f.tail.fromMs)} → ${clock(f.tail.toMs)} (energía ${f.tail.before.toFixed(2)} → ${f.tail.after.toFixed(2)})`] : []),
          ]),
          '',
        ]
      : []),
    ...(offenders && offenders.length
      ? ['## Comprobación de bordes', '', `${edgeCheckLine(offenders)}. Es la misma señal que verify-voice marcará como error: reconstruye esos clips (recut_recording.py) o regraba la frase.`, '']
      : []),
    ...(retried.length
      ? [
          '## Frases que Whisper se saltó y se buscaron otra vez',
          '',
          'La primera pasada no las encontró; se volvió a transcribir ese tramo sin pista inicial (Whisper se salta la frase que repite su pista).',
          '',
          ...retried.map((r) => `- ${clock(r.startMs)}–${clock(r.endMs)} · ${r.ids.join(', ')} · ${r.recovered.length ? `recuperadas: ${r.recovered.join(', ')}` : 'siguen sin encontrarse'}`),
          '',
        ]
      : []),
    ...(midStarts.length
      ? [
          '## Clips que empiezan a mitad de frase',
          '',
          'El clip no empieza por la primera palabra del guion y justo antes hay voz sin usar que sí lo hace: se pierde el principio. Reconstruye el clip desde la toma (recut_recording.py).',
          '',
          ...midStarts.map((m) => `- ${m.id} · falta «${m.missed}» (${clock(m.startMs)}–${clock(m.endMs)})`),
          '',
        ]
      : []),
    ...(later.length
      ? [
          '## Tomas posteriores sin usar',
          '',
          'La última toma de cada párrafo es la buena. Estas lecturas son POSTERIORES a la que se usó: escúchalas y, si valen, reconstruye el clip con ellas.',
          '',
          ...later.map((l) => `- ${l.id} · ${clock(l.startMs)}–${clock(l.endMs)} · ${l.sentence ? 'una frase' : 'entera'} (${l.score.toFixed(2)})`),
          '',
        ]
      : []),
    '## Trozos de la grabación que no se han usado',
    '',
    ...(unused.length ? unused : ['(ninguno)']),
    '',
  ].join('\n');
}

// ---------------------------------------------------------------------------------------------------------------
// Guards added on 2026-10-25 (V39, V43): hallucinated zero-length words, ghost words, clips cut inside the voice.
// ---------------------------------------------------------------------------------------------------------------

/** A run of at least this many consecutive words, each no longer than SILENT_WORD_MS, is a Whisper hallucination. */
export const SILENT_RUN_MIN = 3;
export const SILENT_WORD_MS = 10;

/**
 * Drops the runs of SILENT_RUN_MIN or more consecutive words with no duration (`endMs - startMs <= maxMs`): Whisper
 * invents text over a stretch it cannot place and stamps it all on one instant (V43 cumplimiento-halden: 11 words
 * at 29.98 s inside «Antes de lanzar el sistema…», the clip began at 29.98 s and lost «Antes de lanzar el»). One or
 * two such words are normal (a word swallowed by its neighbour) and stay. The input is not modified.
 * @returns {{words: object[], dropped: {count: number, startMs: number, endMs: number, text: string}[]}}
 */
export function dropSilentWordRuns(words, { minRun = SILENT_RUN_MIN, maxMs = SILENT_WORD_MS } = {}) {
  const silent = (w) => w.endMs - w.startMs <= maxMs;
  const kept = [];
  const dropped = [];
  let i = 0;
  while (i < words.length) {
    if (silent(words[i])) {
      let j = i;
      while (j + 1 < words.length && silent(words[j + 1])) j++;
      if (j - i + 1 >= minRun) {
        dropped.push({ count: j - i + 1, startMs: words[i].startMs, endMs: words[j].endMs, text: words.slice(i, j + 1).map((w) => w.text).join(' ') });
        i = j + 1;
        continue;
      }
    }
    kept.push(words[i]);
    i++;
  }
  return { words: kept, dropped };
}

/** The «y» of V39 s05-01: three characters or fewer. */
export const GHOST_MAX_CHARS = 3;

/**
 * A very short word (GHOST_MAX_CHARS or fewer, no digits) that lasts longer than `maxMs` with a silence inside it is a
 * ghost: Whisper stretched it over the pause (V39 s05-01: «y» 167.70–170.08 s right after «entrar», over the
 * silence). It is cut down to its longest voiced stretch (the rest of the span is silence) and flagged `ghost: true`, so
 * the edge refinement does not take its start for the beginning of a real word. Words are replaced, never removed:
 * indices stay valid.
 * @returns {{words: object[], trimmed: {text: string, startMs: number, endMs: number, toStartMs: number, toEndMs: number}[]}}
 */
export function trimGhostWords(words, silences, { maxMs = MAX_WORD_MS, maxChars = GHOST_MAX_CHARS, minSilenceMs = 100, minVoiceMs = 40 } = {}) {
  const trimmed = [];
  const out = words.map((w) => {
    const bare = w.text.replace(/[¿?¡!«»".,;:\s]/g, '');
    if (!bare || bare.length > maxChars || /\d/.test(bare) || w.endMs - w.startMs <= maxMs) return w;
    const inside = silences.filter((s) => s.endMs - s.startMs >= minSilenceMs && s.startMs < w.endMs && s.endMs > w.startMs);
    if (!inside.length) return w;
    const voiced = [];
    let cursor = w.startMs;
    for (const s of inside) {
      if (s.startMs > cursor) voiced.push({ startMs: cursor, endMs: Math.min(s.startMs, w.endMs) });
      cursor = Math.max(cursor, s.endMs);
    }
    if (cursor < w.endMs) voiced.push({ startMs: cursor, endMs: w.endMs });
    const solid = voiced.filter((v) => v.endMs - v.startMs >= minVoiceMs);
    const pool = solid.length ? solid : voiced;
    const pick = pool.length ? pool.reduce((a, b) => (b.endMs - b.startMs > a.endMs - a.startMs ? b : a)) : { startMs: w.startMs, endMs: w.startMs };
    trimmed.push({ text: bare, startMs: w.startMs, endMs: w.endMs, toStartMs: pick.startMs, toEndMs: pick.endMs });
    return { ...w, startMs: pick.startMs, endMs: pick.endMs, ghost: true };
  });
  return { words: out, trimmed };
}

// Edge energy: the same measure verify_voice.py makes on the finished clip (RMS of the first / last 30 ms over the
// RMS of the whole clip), taken on the recording itself so a cut inside the voice shows when it is made.
export const EDGE_SAMPLE_RATE = 16000; // verify_voice.py measures at 16 kHz
export const EDGE_WINDOW_MS = 30;
export const EDGE_ENERGY_LIMIT = 0.35; // LIMITS.head / LIMITS.tail of verify-voice.mjs (pinned by a test)
export const EDGE_FIX_ENERGY = 0.3; // an edge above this is moved (a margin under the limit: the measures differ a little)
const EDGE_QUIET = 0.12; // an edge at or under this is in silence
const EDGE_HOP_MS = 10;
export const EDGE_TAIL_MAX_MS = 500; // how far an end may be pushed past the cut
export const EDGE_HEAD_MAX_MS = 300; // how far a start may be pulled back

const toIndex = (sampleRate, ms) => Math.round((ms * sampleRate) / 1000);

function rmsBetween(samples, from, to) {
  const a = Math.max(0, from);
  const b = Math.min(samples.length, to);
  if (b <= a) return 0;
  let sum = 0;
  for (let i = a; i < b; i++) sum += samples[i] * samples[i];
  return Math.sqrt(sum / (b - a));
}

/** RMS of a stretch of samples over [startMs, endMs). */
export function rmsOfSpan(samples, sampleRate, startMs, endMs) {
  return rmsBetween(samples, toIndex(sampleRate, startMs), toIndex(sampleRate, endMs));
}

/**
 * Relative energy of the first and last EDGE_WINDOW_MS of a clip made of `ranges` (what recordingRecord / clipArgs
 * keep), against the RMS of everything it keeps: verify_voice.py's `head` and `tail`.
 * @returns {{head: number, tail: number}}
 */
export function edgeEnergies(samples, sampleRate, ranges) {
  let sum = 0;
  let n = 0;
  for (const r of ranges) {
    const a = Math.max(0, toIndex(sampleRate, r.startMs));
    const b = Math.min(samples.length, toIndex(sampleRate, r.endMs));
    for (let i = a; i < b; i++) sum += samples[i] * samples[i];
    n += Math.max(0, b - a);
  }
  const rms = (n ? Math.sqrt(sum / n) : 0) + 1e-9;
  const first = ranges[0];
  const last = ranges[ranges.length - 1];
  const head = rmsOfSpan(samples, sampleRate, first.startMs, Math.min(first.startMs + EDGE_WINDOW_MS, first.endMs)) / rms;
  const tail = rmsOfSpan(samples, sampleRate, Math.max(last.endMs - EDGE_WINDOW_MS, last.startMs), last.endMs) / rms;
  return { head, tail };
}

/**
 * Moves the end of a clip that stops inside the voice to the next quiet spot. When the last EDGE_WINDOW_MS carry more
 * than EDGE_FIX_ENERGY of the clip's RMS, the end walks forward 10 ms at a time (at most `maxMs`, never past `guardMs`)
 * to the first spot whose last 30 ms are quiet; if the energy rises again first (the next word starts), it stops at the
 * valley before it. Nothing moves when no such spot is found. (V39 s05-01: the voice of «entrar» decays until 167.95 s,
 * Whisper ended the word at 167.70 s, the clip stopped there at energy 0.72.)
 * @returns {{endMs: number, before: number, after: number, moved: boolean}}
 */
export function pushEndToQuiet(samples, sampleRate, { startMs, endMs }, { guardMs = Infinity, maxMs = EDGE_TAIL_MAX_MS } = {}) {
  const rms = rmsOfSpan(samples, sampleRate, startMs, endMs) + 1e-9;
  const ratioAt = (t) => rmsOfSpan(samples, sampleRate, t - EDGE_WINDOW_MS, t) / rms;
  const before = ratioAt(endMs);
  if (!(before > EDGE_FIX_ENERGY)) return { endMs, before, after: before, moved: false };
  const limit = Math.min(endMs + maxMs, guardMs, (samples.length / sampleRate) * 1000);
  let best = { t: endMs, r: before };
  for (let t = endMs + EDGE_HOP_MS; t <= limit; t += EDGE_HOP_MS) {
    const r = ratioAt(t);
    if (r < best.r) best = { t, r };
    if (r <= EDGE_QUIET) break;
    if (best.r <= EDGE_FIX_ENERGY && r > best.r * 1.5 + 0.02) break;
  }
  return best.r <= EDGE_FIX_ENERGY ? { endMs: best.t, before, after: best.r, moved: true } : { endMs, before, after: before, moved: false };
}

/** The mirror of pushEndToQuiet: a clip that starts inside the voice begins up to `maxMs` earlier, not before `guardMs`. */
export function pullStartToQuiet(samples, sampleRate, { startMs, endMs }, { guardMs = 0, maxMs = EDGE_HEAD_MAX_MS } = {}) {
  const rms = rmsOfSpan(samples, sampleRate, startMs, endMs) + 1e-9;
  const ratioAt = (t) => rmsOfSpan(samples, sampleRate, t, t + EDGE_WINDOW_MS) / rms;
  const before = ratioAt(startMs);
  if (!(before > EDGE_FIX_ENERGY)) return { startMs, before, after: before, moved: false };
  const limit = Math.max(startMs - maxMs, guardMs, 0);
  let best = { t: startMs, r: before };
  for (let t = startMs - EDGE_HOP_MS; t >= limit; t -= EDGE_HOP_MS) {
    const r = ratioAt(t);
    if (r < best.r) best = { t, r };
    if (r <= EDGE_QUIET) break;
    if (best.r <= EDGE_FIX_ENERGY && r > best.r * 1.5 + 0.02) break;
  }
  return best.r <= EDGE_FIX_ENERGY ? { startMs: best.t, before, after: best.r, moved: true } : { startMs, before, after: before, moved: false };
}

/**
 * cutPoints' cuts with both clip edges moved out of the voice where they sit inside it (pullStartToQuiet,
 * pushEndToQuiet). The start never goes back past the word before the clip or the previous clip's end; the end never
 * past the next clip's start or the next word that is not a ghost (trimGhostWords flags those: Whisper puts them over
 * the very silence the end has to reach). A spliced take keeps its parts; only the first start and the last end move.
 * @returns {{cuts: object[], fixes: {id: string, head?: object, tail?: object}[]}}
 */
export function refineCuts(samples, sampleRate, cuts, located, words) {
  const fixes = [];
  const out = cuts.map((cut, k) => {
    const f = located.find((x) => x.id === cut.id);
    if (!f) return cut;
    const spans = f.parts ?? [f];
    const first = spans[0].first;
    const last = spans[spans.length - 1].last;
    let j = last + 1;
    while (j < words.length && words[j].ghost) j++;
    const nextWord = j < words.length ? words[j].startMs : Infinity;
    const prevGuard = Math.max(first > 0 ? words[first - 1].endMs : 0, k > 0 ? cuts[k - 1].endMs : 0);
    const nextGuard = Math.min(nextWord, k + 1 < cuts.length ? cuts[k + 1].startMs : Infinity);
    const tail = pushEndToQuiet(samples, sampleRate, cut, { guardMs: nextGuard });
    const head = pullStartToQuiet(samples, sampleRate, cut, { guardMs: Math.min(prevGuard, cut.startMs) });
    if (!tail.moved && !head.moved) return cut;
    fixes.push({
      id: cut.id,
      ...(head.moved ? { head: { fromMs: cut.startMs, toMs: head.startMs, before: head.before, after: head.after } } : {}),
      ...(tail.moved ? { tail: { fromMs: cut.endMs, toMs: tail.endMs, before: tail.before, after: tail.after } } : {}),
    });
    const startMs = head.startMs;
    const endMs = tail.endMs;
    if (!cut.parts) return { ...cut, startMs, endMs };
    const parts = cut.parts.map((p, i) => ({ ...p, ...(i === 0 ? { startMs } : {}), ...(i === cut.parts.length - 1 ? { endMs } : {}) }));
    return { ...cut, startMs, endMs, parts };
  });
  return { cuts: out, fixes };
}

/**
 * The clips whose first or last EDGE_WINDOW_MS carry more than EDGE_ENERGY_LIMIT of their RMS: the same signal
 * verify-voice turns into «starts / stops inside a word».
 * @param {{id: string, ranges: {startMs: number, endMs: number}[]}[]} clips
 * @returns {{id: string, head: number, tail: number}[]}
 */
export function edgeOffenders(samples, sampleRate, clips, limit = EDGE_ENERGY_LIMIT) {
  return clips
    .map((c) => ({ id: c.id, ...edgeEnergies(samples, sampleRate, c.ranges) }))
    .filter((e) => e.head > limit || e.tail > limit);
}

/** The console line (and report entry) of the edge check: «Comprobación de bordes: N clips con energía alta en el borde». */
export function edgeCheckLine(offenders) {
  const detail = offenders.map((o) => `${o.id} (${[o.head > EDGE_ENERGY_LIMIT ? `inicio ${o.head.toFixed(2)}` : '', o.tail > EDGE_ENERGY_LIMIT ? `final ${o.tail.toFixed(2)}` : ''].filter(Boolean).join(', ')})`);
  return `Comprobación de bordes: ${offenders.length} clips con energía alta en el borde${detail.length ? `: ${detail.join(', ')}` : ''}`;
}

// Loudness of a partial re-import -------------------------------------------------------------------------------

/**
 * The full import a partial one belongs to, read from the clips already written when there is no import-gain.json
 * (imports made before it existed): the recording most clips of `voice` were cut from, and the gain they got.
 * @returns {{sha256: string, gainDb: number, file: string | null, inferred: true} | null}
 */
export function inferFullImport(records, voice) {
  const own = records.filter((r) => r?.provider === 'recording' && r.voice === voice && r.source?.sha256 && Number.isFinite(r.source?.gainDb));
  if (!own.length) return null;
  const count = new Map();
  for (const r of own) count.set(r.source.sha256, (count.get(r.source.sha256) ?? 0) + 1);
  const [sha256] = [...count].reduce((a, b) => (b[1] > a[1] ? b : a));
  const from = own.find((r) => r.source.sha256 === sha256);
  return { sha256, gainDb: from.source.gainDb, file: from.source.file ?? null, inferred: true };
}

/** What a full import leaves in out/recording/<name>/import-gain.json for the partial imports that follow it. */
export function importGainRecord({ gainDb, sha256, file, voice, target, durationMs, at }) {
  return { gainDb, sha256, file, voice, target, durationMs, at };
}

const signed = (db) => `${db >= 0 ? '+' : ''}${db}`;

/**
 * How an import fixes its gain. With `--gain` it is that; with `--reuse-gain` it is the full import's; with `--lufs` or
 * `--match` the recording is measured as always. With none of them, a partial import (`only`) reuses the full import's
 * gain when there is one (`saved`): a cut of the recording must not be measured on its own, a sentence is not as loud
 * as the whole (V39: +1.8 dB for the recording, --lufs had to be worked out by hand for each sentence).
 * `fullFile` says that the file IS the full import's recording (same hash).
 * @returns {{mode: 'measure' | 'explicit' | 'reuse', gainDb?: number, fullFile: boolean, message?: string}}
 */
export function planGain({ only = null, sha256, saved = null, match, lufs, gain, reuseGain = false }) {
  const measuring = Boolean(match) || lufs !== undefined;
  if (gain !== undefined && !Number.isFinite(gain)) throw new Error('--gain debe ser un número de dB (por ejemplo --gain 1.8)');
  if ((gain !== undefined || reuseGain) && (measuring || (gain !== undefined && reuseGain))) {
    throw new Error('--gain y --reuse-gain no se pueden combinar entre sí ni con --lufs / --match: elige una sola forma de fijar la ganancia');
  }
  const fullFile = Boolean(saved && saved.sha256 === sha256);
  if (gain !== undefined) return { mode: 'explicit', gainDb: gain, fullFile, message: `ganancia fija ${signed(gain)} dB (--gain)` };
  const reuse = () => ({
    mode: 'reuse',
    gainDb: saved.gainDb,
    fullFile,
    message:
      `se reutiliza la ganancia de la importación completa: ${signed(saved.gainDb)} dB` +
      ` (${saved.file ?? saved.sha256.slice(0, 8)}${saved.inferred ? ', leída de los clips ya importados' : ''}); no se mide el audio. --lufs, --match o --gain la cambian`,
  });
  if (reuseGain) {
    if (!saved) {
      throw new Error('--reuse-gain: no hay una importación completa anterior (ni out/recording/<nombre>/import-gain.json ni clips de esa voz en tts/); haz primero la importación completa o pasa --gain <dB>');
    }
    return reuse();
  }
  if (!measuring && only && saved) return reuse();
  return { mode: 'measure', fullFile };
}

/**
 * Samples (-1..1) of a 16-bit mono PCM WAV held in memory, as ffmpeg writes it to a pipe (RIFF sizes unknown, a LIST
 * chunk before `data` is possible). Remotion's ffmpeg has no raw `s16le` / `f32le` muxer, only `wav`.
 */
export function pcm16FromWav(buffer) {
  let pos = 12;
  while (pos + 8 <= buffer.length) {
    const id = buffer.toString('latin1', pos, pos + 4);
    const size = buffer.readUInt32LE(pos + 4);
    if (id === 'data') {
      const bytes = Math.min(size, buffer.length - pos - 8);
      const count = Math.floor(bytes / 2);
      const out = new Float32Array(count);
      for (let i = 0; i < count; i++) out[i] = buffer.readInt16LE(pos + 8 + i * 2) / 32768;
      return out;
    }
    pos += 8 + size + (size % 2);
  }
  throw new Error('no data chunk in the WAV ffmpeg wrote');
}
