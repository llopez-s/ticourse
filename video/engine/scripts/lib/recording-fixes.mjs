// Pure pieces of the automatic fix-up of a recording import (import-recording.mjs writes the fixes it suggests;
// fix-recording.mjs applies the safe ones). The import prints each fix as three lines to copy; here they are data.
import path from 'node:path';

/** Every kind of fix the importer suggests, in the order they win when one clip has several. */
export const FIX_KINDS = ['later', 'restart', 'midstart', 'edge', 'stretched', 'unheard', 'long', 'missing'];

/**
 * Applied without asking. `later`: a take AFTER the one used (her last take is the good one); `restart`: the opening read
 * twice in one clip; `midstart`: the clip lost its first words; `edge`: the clip ends or starts inside a word;
 * `stretched`: a half-said take glued to its retake (verify-voice calls it an error: abrir-web s08-06 was real, not
 * Whisper's doing). The other kinds (`unheard`, `long`, `missing`) need a listen: they flag voice nobody transcribed or
 * a long clip, and there the cut that keeps the right part is a guess.
 */
export const SAFE_KINDS = ['later', 'restart', 'midstart', 'edge', 'stretched'];

/** Silence the edge fix keeps inside the pause it moves a cut into, at most (it stays in the middle of a shorter one). */
const EDGE_INSIDE_MS = 150;
/** How far from the cut the pause it moves into may be. */
const EDGE_REACH_MS = 2000;

/** A fix of one clip as it is saved: null when the importer found no voice there (no recording range to cut). */
export function fixEntry(kind, gap) {
  if (gap.startMs === null || gap.startMs === undefined) return null;
  const parts = (gap.parts ?? [gap]).map((p) => ({ startMs: Math.round(p.startMs), endMs: Math.round(p.endMs) }));
  return { kind, ids: [...gap.ids], parts };
}

/**
 * A clip whose edge is still inside a word after the importer moved it as far as the word timings allowed (Whisper puts
 * the next sentence's first word on top of the pause): the cut ends (or starts) inside the middle of the next real
 * silence of the recording. `offender` is edgeOffenders' row, `cut` the clip's cut ({startMs, endMs, parts?}), `silences`
 * the recording's {startMs, endMs}. Null when there is no silence close enough to move into.
 */
export function edgeGap(offender, cut, silences, { limit, insideMs = EDGE_INSIDE_MS, reachMs = EDGE_REACH_MS } = {}) {
  const parts = (cut.parts ?? [cut]).map((p) => ({ startMs: p.startMs, endMs: p.endMs }));
  const first = parts[0];
  const last = parts[parts.length - 1];
  const bad = (energy) => (limit === undefined ? energy > 0 : energy > limit);
  let moved = false;
  if (bad(offender.tail)) {
    const s = silences.find((x) => x.endMs > last.endMs && x.startMs >= last.endMs - 100 && x.startMs <= last.endMs + reachMs);
    if (s) {
      const to = Math.round(s.startMs + Math.min(insideMs, (s.endMs - s.startMs) / 2));
      if (to > last.endMs) {
        last.endMs = to;
        moved = true;
      }
    }
  }
  if (bad(offender.head)) {
    const s = [...silences].reverse().find((x) => x.startMs < first.startMs && x.endMs <= first.startMs + 100 && x.endMs >= first.startMs - reachMs);
    if (s) {
      const to = Math.round(s.endMs - Math.min(insideMs, (s.endMs - s.startMs) / 2));
      if (to < first.startMs) {
        first.startMs = to;
        moved = true;
      }
    }
  }
  if (!moved) return null;
  return { ids: [offender.id], startMs: first.startMs, endMs: last.endMs, ...(parts.length > 1 ? { parts } : {}) };
}

/**
 * The fixes of a partial import (--only on the full recording) replace the saved ones of the clips it rewrote and keep
 * the rest, so the list is not lost when one clip is imported again.
 */
export function mergeFixes(previous, current, writtenIds) {
  const written = new Set(writtenIds);
  return [...(previous ?? []).filter((f) => !f.ids.some((id) => written.has(id))), ...current];
}

/**
 * What to apply. One fix per clip (the first kind in FIX_KINDS that is enabled), the kinds not enabled left as `manual`,
 * a clip already tried (`done`) left as `repeated`: the same fix would give the same clip.
 * @returns {{apply: {ids: string[], kind: string, parts: object[]}[], manual: {id: string, kind: string}[], repeated: string[]}}
 */
export function planFixes(fixes, { kinds = SAFE_KINDS, done = [] } = {}) {
  const enabled = new Set(kinds);
  const tried = new Set(done);
  const rank = (k) => FIX_KINDS.indexOf(k);
  const byId = new Map();
  for (const f of [...fixes].sort((a, b) => rank(a.kind) - rank(b.kind))) {
    for (const id of f.ids) {
      if (!byId.has(id)) byId.set(id, []);
      byId.get(id).push(f);
    }
  }
  const apply = [];
  const manual = [];
  const repeated = [];
  const picked = new Set();
  for (const [id, list] of byId) {
    const pick = list.find((f) => enabled.has(f.kind));
    if (!pick) manual.push({ id, kind: list[0].kind });
    else if (tried.has(id)) repeated.push(id);
    else if (!picked.has(pick)) {
      // one entry per fix: a gap that names two clips is cut once
      picked.add(pick);
      apply.push({ ids: [...pick.ids].sort(), kind: pick.kind, parts: pick.parts });
    }
  }
  apply.sort((a, b) => (a.ids[0] < b.ids[0] ? -1 : 1));
  manual.sort((a, b) => (a.id < b.id ? -1 : 1));
  repeated.sort();
  return { apply, manual, repeated };
}

/** «<dir>/x (master).wav» -> «<dir>/x arreglos (recorte).wav», «… arreglos 2 (recorte).wav» … the first that is free. */
export function recutPath(master, exists) {
  const dir = path.dirname(master);
  const base = path.basename(master).replace(/\s*\(master\)\.wav$/i, '').replace(/\.wav$/i, '');
  for (let n = 1; ; n++) {
    const candidate = path.join(dir, `${base} arreglos${n === 1 ? '' : ` ${n}`} (recorte).wav`);
    if (!exists(candidate)) return candidate;
  }
}

/** recut_recording.py: the ranges of every clip to fix, in script order, spliced in one WAV. */
export function recutArgs(scriptsDir, { out, file, apply }) {
  return [
    '-X', 'utf8', path.join(scriptsDir, 'recut_recording.py'), '--out', out,
    ...apply.flatMap((f) => f.parts.flatMap((p) => ['--part', `${file}@${(p.startMs / 1000).toFixed(2)}-${(p.endMs / 1000).toFixed(2)}`])),
  ];
}

/** import-recording.mjs on that WAV, only the clips fixed, with the gain of the full import (no loudness arithmetic). */
export const reimportArgs = (scriptsDir, { slug, file, name, ids }) => [
  path.join(scriptsDir, 'import-recording.mjs'), '--video', slug, '--file', file, '--name', name, '--only', ids.join(','), '--reuse-gain',
];

/** «10:12.5» style clock for the plan printed before anything is cut. */
export function clockOf(ms) {
  const s = ms / 1000;
  return `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, '0')}`;
}
