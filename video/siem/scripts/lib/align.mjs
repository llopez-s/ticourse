// Aligns our spoken tokens with the WordBoundary events edge-tts returns.
//
// The voice usually emits one boundary per spoken word, but not always: it
// drops punctuation, may split identifiers ("srv-tc-app03" -> srv / tc / app03)
// or merge words, and occasionally skips or adds one. The aligner walks both
// lists greedily with a small look-ahead to re-synchronise, then fills any
// token it could not match by interpolating between its matched neighbours.

/** NFD, strip combining marks, lowercase, keep only letters and digits. */
export function normalizeToken(s) {
  return String(s)
    .normalize('NFD')
    .replace(/\p{M}+/gu, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '');
}

const MAX_JOIN = 6; // max tokens/boundaries merged into one match

/**
 * @param {string[]} spokenTokens
 * @param {{text: string, offsetMs: number, durationMs: number}[]} boundaries in order
 * @param {{window?: number, totalMs?: number, msPerChar?: number}} [opts]
 * @returns {{startMs: number, endMs: number, matched: boolean}[]} one per spoken token, monotonic
 */
export function alignSpokenTokens(spokenTokens, boundaries, opts = {}) {
  const window = opts.window ?? 4;
  const msPerChar = opts.msPerChar ?? 65;
  const n = spokenTokens.length;
  const times = new Array(n).fill(null);

  const content = [];
  spokenTokens.forEach((t, idx) => {
    const norm = normalizeToken(t);
    if (norm) content.push({ idx, norm });
  });
  const bs = [];
  for (const b of boundaries ?? []) {
    const norm = normalizeToken(b.text);
    const start = Number(b.offsetMs);
    const end = start + Math.max(0, Number(b.durationMs) || 0);
    if (norm && Number.isFinite(start)) bs.push({ norm, start, end });
  }

  const set = (ci, startMs, endMs) => {
    times[content[ci].idx] = { startMs, endMs, matched: true };
  };
  /** Spread content tokens [c0, c1) over [startMs, endMs] by character share. */
  const spread = (c0, c1, startMs, endMs, matched = true) => {
    const lens = [];
    for (let c = c0; c < c1; c += 1) lens.push(Math.max(1, content[c].norm.length));
    const total = lens.reduce((a, b) => a + b, 0);
    let acc = 0;
    for (let c = c0; c < c1; c += 1) {
      const a = startMs + ((endMs - startMs) * acc) / total;
      acc += lens[c - c0];
      const b = startMs + ((endMs - startMs) * acc) / total;
      times[content[c].idx] = { startMs: a, endMs: b, matched };
    }
  };

  const exact = (ci, bj) => content[ci].norm === bs[bj].norm;
  /** A strong re-sync point: exact match, confirmed by the next pair when the word is short. */
  const anchorAt = (ci, bj) => {
    if (ci >= content.length || bj >= bs.length || !exact(ci, bj)) return false;
    if (content[ci].norm.length >= 4) return true;
    if (ci + 1 >= content.length || bj + 1 >= bs.length) return true;
    return exact(ci + 1, bj + 1) || content[ci + 1].norm.startsWith(bs[bj + 1].norm) || bs[bj + 1].norm.startsWith(content[ci + 1].norm);
  };
  const findAnchor = (ci, bj) => {
    const candidates = [];
    for (let di = 0; di <= window; di += 1) {
      for (let dj = 0; dj <= window; dj += 1) {
        if (di + dj > 0) candidates.push([di, dj]);
      }
    }
    candidates.sort((x, y) => x[0] + x[1] - (y[0] + y[1]) || Math.abs(x[0] - x[1]) - Math.abs(y[0] - y[1]));
    for (const [di, dj] of candidates) {
      if (anchorAt(ci + di, bj + dj)) return { di, dj };
    }
    return null;
  };

  let i = 0;
  let j = 0;
  while (i < content.length && j < bs.length) {
    const t = content[i].norm;
    const b = bs[j].norm;
    if (t === b) {
      set(i, bs[j].start, bs[j].end);
      i += 1;
      j += 1;
      continue;
    }
    // Several boundaries voice one token ("srvtcapp03" <- srv, tc, app03).
    if (t.startsWith(b)) {
      let acc = b;
      let k = j + 1;
      while (k < bs.length && k - j < MAX_JOIN && acc.length < t.length && t.startsWith(acc + bs[k].norm)) {
        acc += bs[k].norm;
        k += 1;
      }
      if (acc === t) {
        set(i, bs[j].start, bs[k - 1].end);
        i += 1;
        j = k;
        continue;
      }
    }
    // One boundary voices several tokens.
    if (b.startsWith(t)) {
      let acc = t;
      let k = i + 1;
      while (k < content.length && k - i < MAX_JOIN && acc.length < b.length && b.startsWith(acc + content[k].norm)) {
        acc += content[k].norm;
        k += 1;
      }
      if (acc === b) {
        spread(i, k, bs[j].start, bs[j].end);
        i = k;
        j += 1;
        continue;
      }
    }
    // Mismatch: find the nearest point where both lists agree again.
    const anchor = findAnchor(i, j);
    if (anchor) {
      const { di, dj } = anchor;
      // The skipped tokens were voiced by the skipped boundaries, whatever they say.
      if (di > 0 && dj > 0) spread(i, i + di, bs[j].start, bs[j + dj - 1].end);
      // di > 0, dj === 0: tokens without a boundary -> interpolated below.
      // di === 0, dj > 0: extra boundaries -> ignored.
      i += di;
      j += dj;
      continue;
    }
    // No re-sync point in sight: assume a respelling and pair them up.
    set(i, bs[j].start, bs[j].end);
    i += 1;
    j += 1;
  }

  // Interpolate unmatched content tokens between their matched neighbours.
  const firstStart = bs.length ? bs[0].start : 0;
  let c = 0;
  while (c < content.length) {
    if (times[content[c].idx]) {
      c += 1;
      continue;
    }
    let d = c;
    while (d < content.length && !times[content[d].idx]) d += 1;
    const prevEnd = c > 0 ? times[content[c - 1].idx].endMs : Math.min(firstStart, d < content.length ? times[content[d].idx].startMs : firstStart);
    let nextStart;
    if (d < content.length) {
      nextStart = times[content[d].idx].startMs;
    } else {
      const chars = content.slice(c, d).reduce((a, x) => a + x.norm.length, 0);
      const guess = prevEnd + chars * msPerChar;
      nextStart = opts.totalMs !== undefined ? Math.max(prevEnd, Math.min(guess, opts.totalMs)) : guess;
      if (opts.totalMs !== undefined && nextStart <= prevEnd) nextStart = prevEnd;
    }
    spread(c, d, prevEnd, Math.max(prevEnd, nextStart), false);
    c = d;
  }

  // Punctuation-only tokens: zero length at the previous end; then force monotonic.
  let prevEnd = 0;
  const out = [];
  for (let k = 0; k < n; k += 1) {
    const tm = times[k];
    let startMs;
    let endMs;
    let matched = false;
    if (!tm) {
      startMs = prevEnd;
      endMs = prevEnd;
    } else {
      startMs = Math.max(tm.startMs, prevEnd);
      endMs = Math.max(tm.endMs, startMs);
      matched = tm.matched;
    }
    out.push({ startMs, endMs, matched });
    prevEnd = endMs;
  }
  // A leading punctuation token should sit at the first word, not at 0.
  for (let k = 0; k < n && !times[k]; k += 1) {
    const next = out.find((x, idx) => idx > k && times[idx]);
    if (next) {
      out[k].startMs = next.startMs;
      out[k].endMs = next.startMs;
    }
  }
  return out;
}

/**
 * Display-token times from spoken-token times. Display tokens that share the
 * same spoken range split it by character share; tokens with an empty range get
 * a zero-length time at the previous end.
 * @param {{text: string, spokenStart: number, spokenEnd: number}[]} displayTokens
 * @param {{startMs: number, endMs: number}[]} spokenTimes
 * @returns {{startMs: number, endMs: number}[]}
 */
export function displayTimes(displayTokens, spokenTimes) {
  const out = new Array(displayTokens.length).fill(null);
  let k = 0;
  while (k < displayTokens.length) {
    const { spokenStart: a, spokenEnd: b } = displayTokens[k];
    let m = k + 1;
    if (b > a) {
      while (m < displayTokens.length && displayTokens[m].spokenStart === a && displayTokens[m].spokenEnd === b) m += 1;
      const start = spokenTimes[a].startMs;
      const end = spokenTimes[b - 1].endMs;
      const lens = displayTokens.slice(k, m).map((t) => Math.max(1, normalizeToken(t.text).length || t.text.length));
      const total = lens.reduce((x, y) => x + y, 0);
      let acc = 0;
      for (let q = k; q < m; q += 1) {
        const s = start + ((end - start) * acc) / total;
        acc += lens[q - k];
        out[q] = { startMs: s, endMs: start + ((end - start) * acc) / total };
      }
    }
    k = m;
  }
  let prevEnd = null;
  for (let q = 0; q < out.length; q += 1) {
    if (!out[q]) {
      const t = displayTokens[q];
      const at = prevEnd ?? (spokenTimes[t.spokenStart]?.startMs ?? spokenTimes[spokenTimes.length - 1]?.endMs ?? 0);
      out[q] = { startMs: at, endMs: at };
    } else if (prevEnd !== null) {
      out[q].startMs = Math.max(out[q].startMs, prevEnd);
      out[q].endMs = Math.max(out[q].endMs, out[q].startMs);
    }
    prevEnd = out[q].endMs;
  }
  return out;
}
