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
const LOOKAHEAD = 300; // words searched past the previous segment for the next one
const MIN_LEN = 0.6; // candidate span length, relative to the segment text (in characters)
const MAX_LEN = 1.5;
const PRE_ROLL_MS = 80; // air kept before the first word when a silence precedes it
const POST_ROLL_MS = 120; // and after the last word, before the silence that follows
const SNAP_EARLY_MS = 500; // how far a silence may sit before an ASR word edge and still be snapped to
const SNAP_LATE_MS = 200; // and how far past it (ASR edges drift both ways, more often late at a start)
const FALLBACK_MS = 250; // with no silence nearby, never reach further than this past the word edge

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
 */
export function matchKey(text) {
  return normalizeToken(text).replace(/\d+/g, (d) => (d.length > 6 ? [...d].map((c) => UNITS[Number(c)]).join('') : numberWords(Number(d))));
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
 * Candidates (sorted by start) that overlap are the same take read with a word more or less
 * at the start; only one that starts after the previous take ends is a new take. Returns one
 * candidate per take, in recording order: the earliest-starting one within EDGE_SLACK of the
 * take's best, because a clip that loses its first word («¿Y…») is worse than one that keeps
 * a word the ASR misheard.
 */
function groupTakes(cands) {
  const groups = [];
  let end = -1;
  for (const c of cands) {
    if (c.first > end) groups.push([c]);
    else groups[groups.length - 1].push(c);
    end = Math.max(end, c.last);
  }
  return groups.map((g) => {
    const top = bestScore(g);
    return g.find((c) => c.score >= top - EDGE_SLACK);
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
    const [pick] = groupTakes(cands.filter((c) => c.score >= best - ANCHOR_SLACK));
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
    const takes = groupTakes(cands.filter((c) => c.score >= best - NEAR_BEST));
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
    const parts = sentenceTakes(s, tokens, prev ? prev.last + 1 : 0, next ? next.first : n);
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
function sentenceTakes(segment, tokens, from, limit) {
  const sentences = sentenceForms(segment);
  if (sentences.length < 2 || sentences.some((f) => !f.length)) return null;
  const chosen = [];
  let end = limit;
  for (let j = sentences.length - 1; j >= 0; j--) {
    const cands = scanStarts(sentences[j], tokens, from, end, end, true);
    const best = bestScore(cands);
    if (!(best >= SENTENCE_SCORE)) return null;
    const takes = groupTakes(cands.filter((c) => c.score >= best - NEAR_BEST));
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
 * the segment does not own.
 */
export function cutPoints(located, words, silences, totalMs) {
  const cutSpan = (span) => cutEdges(span, words, silences, totalMs);
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
function cutEdges(f, words, silences, totalMs) {
  const rawStart = words[f.first].startMs;
  const rawEnd = words[f.last].endMs;
  const prevEnd = f.first > 0 ? words[f.first - 1].endMs : 0;
  const nextStart = f.last + 1 < words.length ? words[f.last + 1].startMs : totalMs;

  const lead = nearest(
    silences.filter((s) => s.endMs >= Math.max(prevEnd, rawStart - SNAP_EARLY_MS) && s.endMs <= rawStart + SNAP_LATE_MS),
    (s) => s.endMs,
    rawStart,
  );
  const startMs = lead
    ? Math.max(lead.startMs, prevEnd, lead.endMs - PRE_ROLL_MS)
    : Math.max(Math.min(rawStart, Math.round((prevEnd + rawStart) / 2)), rawStart - FALLBACK_MS);

  const tail = nearest(
    silences.filter((s) => s.startMs >= rawEnd - SNAP_LATE_MS && s.startMs <= Math.min(nextStart, rawEnd + SNAP_EARLY_MS)),
    (s) => s.startMs,
    rawEnd,
  );
  const endMs = tail
    ? Math.min(tail.endMs, nextStart, tail.startMs + POST_ROLL_MS)
    : Math.min(Math.max(rawEnd, Math.round((rawEnd + nextStart) / 2)), rawEnd + FALLBACK_MS);

  return { startMs, endMs: Math.max(endMs, startMs + 1) };
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
  // A spliced take keeps only its parts' words; the dropped ones are not in the clip.
  const kept = parts ? parts.flatMap((p) => words.slice(p.first, p.last + 1)) : words.slice(first, last + 1);
  return kept.map((w) => {
    const offsetMs = clipTime(w.startMs, ranges);
    return { text: w.text, offsetMs, durationMs: Math.max(1, clipTime(w.endMs, ranges) - offsetMs) };
  });
}

/** Runs of recorded words that no found segment uses (what was skipped), for the import report. */
export function unusedRanges(located, words) {
  const used = new Array(words.length).fill(false);
  for (const f of located) if (f.found) for (const p of f.parts ?? [f]) for (let k = p.first; k <= p.last; k++) used[k] = true;
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
 * Whether a cached transcript still fits: same recording (hash) and same model. The prompt is not part of it:
 * it opens with the script's first sentence, so rewriting that sentence re-transcribed the whole recording
 * (~5 min, and a different spelling of the numbers) although the audio had not changed. --force-asr redoes it.
 */
export function asrCacheValid(cached, { sha256, model }) {
  return Boolean(cached) && cached.sha256 === sha256 && cached.model === model && Array.isArray(cached.words);
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
function clock(ms) {
  const tenths = Math.round(ms / 100);
  return `${Math.floor(tenths / 600)}:${((tenths % 600) / 10).toFixed(1).padStart(4, '0')}`;
}

/** Markdown report of one import: every segment's match, and the recorded audio that no segment uses. */
export function importReport({ located, cuts, words, gain, pausesRemovedMs = 0 }) {
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
    '## Trozos de la grabación que no se han usado',
    '',
    ...(unused.length ? unused : ['(ninguno)']),
    '',
  ].join('\n');
}
