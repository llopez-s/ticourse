// Caption paging: timed display words -> CaptionPage[] (see src/timeline/types.ts).
//
// Rules: at most 2 lines x 42 characters per page; a narration segment always
// starts a new page; break after sentence-ending punctuation first, then after
// , ; : once the page holds >= 18 characters, else at the character limit (and
// balance the last two pages of a segment); the two lines of a page are
// balanced; pages shorter than 12 frames are merged or re-split when possible.

export const CAPTION_DEFAULTS = Object.freeze({
  maxChars: 42,
  maxLines: 2,
  minClauseChars: 18,
  leadIn: 3,
  tail: 24,
  minFrames: 12,
});

const CLOSERS = '["»”’\')\\]]*';
const SENTENCE_END = new RegExp(`[.!?…]${CLOSERS}$`);
const CLAUSE_END = new RegExp(`[,;:]${CLOSERS}$`);

export const endsSentence = (text) => SENTENCE_END.test(text);
export const endsClause = (text) => CLAUSE_END.test(text);

// Spanish words a caption line or page should not end on (articles, prepositions, conjunctions).
const FUNCTION_WORDS = new Set(
  (
    'a al ante bajo cada como con contra cuando de del desde e el en entre es ha hacia hasta la las le les lo los ' +
    'mi mis muy más ni no nos o para pero por que se si sin sobre su sus tan tras tu tus u un una unas uno unos y ya'
  ).split(' '),
);
/** True when a line/page ending on this word would read badly ("… de / servidores"). */
export const weakEnding = (text) => !/[^\p{L}]$/u.test(text) && FUNCTION_WORDS.has(text.toLowerCase());

/** Characters of words[a..b) laid out on one line. */
function span(words, a, b) {
  let n = Math.max(0, b - a - 1);
  for (let k = a; k < b; k += 1) n += words[k].text.length;
  return n;
}

/**
 * Best line layout of words[a..b): one line if it fits, else two balanced
 * lines. Returns an array of [start, end) ranges, or null if it cannot fit.
 */
export function layoutLines(words, a, b, opts = CAPTION_DEFAULTS) {
  const { maxChars, maxLines } = opts;
  if (b <= a) return null;
  if (span(words, a, b) <= maxChars) return [[a, b]];
  if (b - a === 1) return [[a, b]]; // a single over-long word still gets a page
  if (maxLines < 2) return null;
  let best = null;
  let bestScore = Infinity;
  for (let k = a + 1; k < b; k += 1) {
    const l1 = span(words, a, k);
    const l2 = span(words, k, b);
    if (l1 > maxChars || l2 > maxChars) continue;
    let score = Math.abs(l1 - l2);
    if (l1 > l2) score += 0.5; // prefer the longer line at the bottom
    const prev = words[k - 1].text;
    if (endsSentence(prev)) score -= 12;
    else if (endsClause(prev)) score -= 8;
    else if (weakEnding(prev)) score += 10;
    if (score < bestScore) {
      bestScore = score;
      best = [[a, k], [k, b]];
    }
  }
  return best;
}

const fits = (words, a, b, opts) => layoutLines(words, a, b, opts) !== null;

/** Splits one segment's word range [s, e) into page ranges. */
function pageSegment(words, s, e, opts) {
  const pages = [];
  let a = s;
  while (a < e) {
    let K = a; // last word index that still fits on this page
    while (K + 1 < e && fits(words, a, K + 2, opts)) K += 1;
    if (K === e - 1) {
      pages.push([a, e]);
      break;
    }
    let brk = -1;
    for (let k = K; k >= a && brk < 0; k -= 1) if (endsSentence(words[k].text)) brk = k;
    for (let k = K; k >= a && brk < 0; k -= 1) {
      if (endsClause(words[k].text) && span(words, a, k + 1) >= opts.minClauseChars) brk = k;
    }
    if (brk < 0) {
      brk = K;
      // Do not end a page on an article or preposition when a nearby word will do.
      for (let k = K; k >= Math.max(a, K - 3); k -= 1) {
        if (!weakEnding(words[k].text)) {
          brk = k;
          break;
        }
      }
      // If the rest fits on one more page, balance the two instead of leaving a stub.
      if (fits(words, K + 1, e, opts)) {
        let bestScore = -Infinity;
        for (let k = a; k <= K; k += 1) {
          if (!fits(words, a, k + 1, opts) || !fits(words, k + 1, e, opts)) continue;
          const score = Math.min(span(words, a, k + 1), span(words, k + 1, e)) - (weakEnding(words[k].text) ? 10 : 0);
          if (score > bestScore) {
            bestScore = score;
            brk = k;
          }
        }
      }
    }
    pages.push([a, brk + 1]);
    a = brk + 1;
  }
  return pages;
}

/** Frame interval of each page range (ranges in global word order). */
function timePages(words, ranges, opts) {
  const times = ranges.map(([a]) => ({ from: Math.max(0, words[a].from - opts.leadIn) }));
  ranges.forEach(([, b], p) => {
    const lastTo = words[b - 1].to + opts.tail;
    const to = p + 1 < ranges.length ? Math.min(times[p + 1].from, lastTo) : lastTo;
    times[p].to = Math.max(to, times[p].from + 1);
  });
  return times;
}

/**
 * New page ranges that fix the short page `p` by merging it with a neighbour of
 * the same segment (if the union fits) or by moving the break between them so
 * that both pages reach `minFrames`. Null when neither is possible.
 */
function shortPageFix(words, ranges, p, segOf, opts) {
  const seg = segOf[ranges[p][0]];
  const neighbours = [p - 1, p + 1].filter((q) => q >= 0 && q < ranges.length && segOf[ranges[q][0]] === seg);
  const replace = (lo, parts) => [...ranges.slice(0, lo), ...parts, ...ranges.slice(lo + 2)];
  for (const q of neighbours) {
    const lo = Math.min(p, q);
    const [a, b] = [ranges[lo][0], ranges[lo + 1][1]];
    if (fits(words, a, b, opts)) return replace(lo, [[a, b]]);
  }
  for (const q of neighbours) {
    const lo = Math.min(p, q);
    const [a, b] = [ranges[lo][0], ranges[lo + 1][1]];
    const current = ranges[lo][1];
    const followingFrom = lo + 2 < ranges.length ? Math.max(0, words[ranges[lo + 2][0]].from - opts.leadIn) : Infinity;
    let best = null;
    let bestMin = -Infinity;
    for (let k = a + 1; k < b; k += 1) {
      if (k === current || !fits(words, a, k, opts) || !fits(words, k, b, opts)) continue;
      const from1 = Math.max(0, words[a].from - opts.leadIn);
      const from2 = Math.max(0, words[k].from - opts.leadIn);
      const d1 = Math.min(from2, words[k - 1].to + opts.tail) - from1;
      const d2 = Math.min(followingFrom, words[b - 1].to + opts.tail) - from2;
      const m = Math.min(d1, d2);
      if (m > bestMin) {
        bestMin = m;
        best = k;
      }
    }
    if (best !== null && bestMin >= opts.minFrames) return replace(lo, [[a, best], [best, b]]);
  }
  return null;
}

/**
 * @param {{text: string, from: number, to: number}[]} words all timed display words, in order
 * @param {number[]} segmentStarts word indices where a narration segment starts (0 implied)
 * @param {Partial<typeof CAPTION_DEFAULTS>} [options]
 * @returns {{from: number, to: number, lines: {text: string, from: number, to: number}[][]}[]}
 */
export function paginate(words, segmentStarts = [], options = {}) {
  const opts = { ...CAPTION_DEFAULTS, ...options };
  if (!words.length) return [];
  const starts = [...new Set([0, ...segmentStarts])].filter((x) => x >= 0 && x < words.length).sort((x, y) => x - y);
  const segOf = new Array(words.length);
  starts.forEach((s, k) => {
    const e = k + 1 < starts.length ? starts[k + 1] : words.length;
    for (let w = s; w < e; w += 1) segOf[w] = k;
  });

  let ranges = [];
  starts.forEach((s, k) => {
    const e = k + 1 < starts.length ? starts[k + 1] : words.length;
    ranges.push(...pageSegment(words, s, e, opts));
  });

  // Fix pages that would flash by: merge with a neighbour of the same segment,
  // or move the break between them so both last long enough.
  for (let pass = 0; pass < 16; pass += 1) {
    const times = timePages(words, ranges, opts);
    let fixed = false;
    for (let p = 0; p < ranges.length && !fixed; p += 1) {
      if (times[p].to - times[p].from >= opts.minFrames) continue;
      const fix = shortPageFix(words, ranges, p, segOf, opts);
      if (fix) {
        ranges = fix;
        fixed = true;
      }
    }
    if (!fixed) break;
  }

  const times = timePages(words, ranges, opts);
  return ranges.map(([a, b], p) => ({
    from: times[p].from,
    to: times[p].to,
    lines: layoutLines(words, a, b, opts).map(([x, y]) => words.slice(x, y).map((w) => ({ text: w.text, from: w.from, to: w.to }))),
  }));
}
