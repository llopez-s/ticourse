// Narration markup parser — the single source of truth for what is SHOWN
// (captions, transcript) and what is SPOKEN (sent to the TTS voice).
//
// Markup inside a segment's "text":
//   {cue-id}          zero-width marker: the visual `cue-id` fires on the next display token
//   [display|spoken]  show `display`, say `spoken` (either side may be several words)
// Outside markup, a lexicon maps whole display tokens (punctuation stripped) to
// a respelling for the neural voice, keeping the surrounding punctuation.

export class MarkupError extends Error {
  constructor(message, text) {
    super(text === undefined ? message : `${message} — in: ${JSON.stringify(text)}`);
    this.name = 'MarkupError';
  }
}

const CUE_ID = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;
const EDGE_PUNCT = /^([^\p{L}\p{N}]*)(.*?)([^\p{L}\p{N}]*)$/su;
const WS = /\s+/;

/** Splits the raw text into text / group / cue pieces, validating the markup. */
export function parsePieces(text) {
  if (typeof text !== 'string') throw new MarkupError('Segment text must be a string');
  const pieces = [];
  let buf = '';
  const flush = () => {
    if (buf) pieces.push({ type: 'text', value: buf });
    buf = '';
  };
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (ch === '{' || ch === '[') {
      const closer = ch === '{' ? '}' : ']';
      let j = i + 1;
      while (j < text.length && text[j] !== closer) {
        if ('{}[]'.includes(text[j])) {
          throw new MarkupError(`Nested or unbalanced markup at position ${j} ("${text[j]}" inside "${ch}…")`, text);
        }
        j += 1;
      }
      if (j >= text.length) throw new MarkupError(`Unbalanced markup: "${ch}" at position ${i} is never closed`, text);
      const inner = text.slice(i + 1, j);
      flush();
      if (ch === '{') {
        if (!inner.trim()) throw new MarkupError(`Empty cue id at position ${i}`, text);
        if (!CUE_ID.test(inner)) throw new MarkupError(`Invalid cue id "{${inner}}" (letters, digits, - and _ only)`, text);
        pieces.push({ type: 'cue', id: inner });
      } else {
        const bars = inner.split('|').length - 1;
        if (bars !== 1) throw new MarkupError(`Group "[${inner}]" must contain exactly one "|"`, text);
        const [display, spoken] = inner.split('|').map((s) => s.trim());
        if (!display) throw new MarkupError(`Group "[${inner}]" has an empty display side`, text);
        if (!spoken) throw new MarkupError(`Group "[${inner}]" has an empty spoken side`, text);
        pieces.push({ type: 'group', display, spoken });
      }
      i = j + 1;
      continue;
    }
    if (ch === '}' || ch === ']') throw new MarkupError(`Unbalanced markup: stray "${ch}" at position ${i}`, text);
    if (ch === '|') throw new MarkupError(`Stray "|" outside a [display|spoken] group at position ${i}`, text);
    buf += ch;
    i += 1;
  }
  flush();
  return pieces;
}

/** Splits a token into leading punctuation, core, trailing punctuation. */
export function splitEdgePunctuation(token) {
  const m = EDGE_PUNCT.exec(token);
  return { lead: m[1], core: m[2], trail: m[3] };
}

/** Spoken form of one display token outside markup (lexicon applied, punctuation kept). */
export function applyLexicon(token, lexicon) {
  if (!lexicon) return token;
  if (Object.hasOwn(lexicon, token)) return lexicon[token];
  const { lead, core, trail } = splitEdgePunctuation(token);
  if (core && core !== token && Object.hasOwn(lexicon, core)) return `${lead}${lexicon[core]}${trail}`;
  return token;
}

const words = (s) => s.split(WS).filter(Boolean);

/**
 * Parses one segment.
 * @returns {{
 *   display: string, spoken: string,
 *   displayTokens: {text: string, spokenStart: number, spokenEnd: number}[],
 *   spokenTokens: string[],
 *   cues: {id: string, displayIndex: number}[],
 *   plainTokens: string[],
 * }}
 * `plainTokens` lists the display tokens that came from outside [..|..] groups
 * (used for pronunciation lint); `displayIndex === displayTokens.length` means
 * the cue sits at the very end of the segment.
 */
export function parseSegmentText(text, lexicon = {}) {
  const pieces = parsePieces(text);

  // 1. Fragments: whitespace-free chunks, flagged `glue` when no whitespace
  //    separates them from the previous chunk (e.g. "[78 %|…]." -> "%" + ".").
  const dFrags = []; // { text, glue }
  const sFrags = [];
  const units = []; // { d0, d1, s0, s1 } fragment ranges of one plain word or one group
  const cueAt = []; // { id, frag } -> index of the next display fragment
  const plainTokens = [];
  let glue = false;

  const addUnit = (displayWords, spokenWords) => {
    const d0 = dFrags.length;
    const s0 = sFrags.length;
    displayWords.forEach((w, k) => dFrags.push({ text: w, glue: k === 0 && glue && dFrags.length > 0 }));
    spokenWords.forEach((w, k) => sFrags.push({ text: w, glue: k === 0 && glue && sFrags.length > 0 }));
    units.push({ d0, d1: dFrags.length, s0, s1: sFrags.length });
    glue = true;
  };

  for (const piece of pieces) {
    if (piece.type === 'cue') {
      cueAt.push({ id: piece.id, frag: dFrags.length });
    } else if (piece.type === 'group') {
      addUnit(words(piece.display), words(piece.spoken));
    } else {
      for (const m of piece.value.matchAll(/(\s+)|(\S+)/g)) {
        if (m[1]) {
          glue = false;
        } else {
          plainTokens.push(m[2]);
          addUnit([m[2]], words(applyLexicon(m[2], lexicon)));
        }
      }
    }
  }

  // 2. Merge glued fragments into tokens.
  const merge = (frags) => {
    const tokens = [];
    const tokenOf = frags.map((f) => {
      if (f.glue && tokens.length) tokens[tokens.length - 1] += f.text;
      else tokens.push(f.text);
      return tokens.length - 1;
    });
    return { tokens, tokenOf };
  };
  const D = merge(dFrags);
  const S = merge(sFrags);

  // 3. Map every display fragment to a range of spoken fragments, proportionally
  //    inside its unit, then lift the ranges to token space.
  const fragRange = new Array(dFrags.length);
  for (const u of units) {
    const d = u.d1 - u.d0;
    const s = u.s1 - u.s0;
    for (let k = 0; k < d; k += 1) {
      let a;
      let b;
      if (s === 0) {
        a = u.s0;
        b = u.s0;
      } else if (s >= d) {
        a = u.s0 + Math.floor((k * s) / d);
        b = u.s0 + Math.floor(((k + 1) * s) / d);
      } else {
        // Fewer spoken than display words: consecutive display words share one.
        a = u.s0 + Math.floor((k * s) / d);
        b = a + 1;
      }
      fragRange[u.d0 + k] = [a, b];
    }
  }
  const toTokenRange = ([a, b]) => {
    if (b > a) return [S.tokenOf[a], S.tokenOf[b - 1] + 1];
    const p = a < sFrags.length ? S.tokenOf[a] : S.tokens.length;
    return [p, p];
  };

  const displayTokens = D.tokens.map((textTok) => ({ text: textTok, spokenStart: Infinity, spokenEnd: -Infinity, empty: true }));
  dFrags.forEach((_, f) => {
    const [a, b] = toTokenRange(fragRange[f]);
    const t = displayTokens[D.tokenOf[f]];
    if (b > a) {
      if (t.empty) {
        t.spokenStart = a;
        t.spokenEnd = b;
        t.empty = false;
      } else {
        t.spokenStart = Math.min(t.spokenStart, a);
        t.spokenEnd = Math.max(t.spokenEnd, b);
      }
    } else if (t.empty && t.spokenStart === Infinity) {
      t.spokenStart = a;
      t.spokenEnd = a;
    }
  });
  for (const t of displayTokens) delete t.empty;

  const cues = cueAt.map(({ id, frag }) => ({
    id,
    displayIndex: frag < dFrags.length ? D.tokenOf[frag] : D.tokens.length,
  }));

  return {
    display: D.tokens.join(' '),
    spoken: S.tokens.join(' '),
    displayTokens,
    spokenTokens: S.tokens,
    cues,
    plainTokens,
  };
}

/** Display text with all markup resolved (convenience for transcripts). */
export function displayText(text) {
  return parseSegmentText(text, {}).display;
}

/**
 * Tokens outside markup that a neural voice is likely to misread: digits,
 * times, units, acronyms not in the lexicon, identifiers with - or _.
 */
export function pronunciationRisks(plainTokens, lexicon = {}) {
  const risky = new Set();
  for (const token of plainTokens) {
    const { core } = splitEdgePunctuation(token);
    if (!core || Object.hasOwn(lexicon, core) || Object.hasOwn(lexicon, token)) continue;
    const hasDigitOrSymbol = /\d/.test(core) || /[_%/@#&+=<>]/.test(core);
    const acronym = /^\p{Lu}{2,}s?$/u.test(core); // SIEM, SOCs
    const camelCase = /^\p{Lu}+\p{Ll}*\p{Lu}/u.test(core); // NetFlow
    const identifier = /-/.test(core) && /\p{Lu}/u.test(core); // ADM-WS
    if (hasDigitOrSymbol || acronym || camelCase || identifier) risky.add(core);
  }
  return [...risky];
}
