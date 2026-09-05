import { dayDiff } from './util';
import type { CardState, Conf, ProgressSnapshot } from './types';

/** A zero-valued snapshot. Mirrors initialState() in store.ts. */
export function emptySnapshot(): ProgressSnapshot {
  return {
    track: 'gcti',
    xp: 0,
    streak: { current: 0, best: 0, lastDay: null, freezes: 1 },
    activity: {},
    lessons: {},
    quizBest: {},
    labs: {},
    bosses: {},
    exams: [],
    srs: {},
    calibration: {
      low: { n: 0, c: 0 },
      med: { n: 0, c: 0 },
      high: { n: 0, c: 0 },
    },
    totals: {
      questions: 0,
      correct: 0,
      cards: 0,
      maxCombo: 0,
      highConfCorrect: 0,
      perfectQuizzes: 0,
      questsDone: 0,
      checkpoints: 0,
    },
    achievements: {},
    exempt: {},
    placement: [],
    day: {
      date: '1970-01-01',
      lessons: 0,
      questions: 0,
      correct: 0,
      cards: 0,
      labs: 0,
      highConfCorrect: 0,
      xpEarned: 0,
      newCards: 0,
      questsAwarded: [],
    },
  };
}

const keysOf = <T>(a: Record<string, T>, b: Record<string, T>) =>
  Array.from(new Set([...Object.keys(a), ...Object.keys(b)]));

/** Union of two boolean maps: present-and-true on either side wins. */
function unionFlags(
  a: Record<string, boolean>,
  b: Record<string, boolean>,
): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  for (const k of keysOf(a, b)) if (a[k] || b[k]) out[k] = true;
  return out;
}

/** Union of two numeric maps, keeping the larger value per key. */
function maxNumbers(
  a: Record<string, number>,
  b: Record<string, number>,
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const k of keysOf(a, b)) out[k] = Math.max(a[k] ?? 0, b[k] ?? 0);
  return out;
}

/** '' sorts before any 'YYYY-MM-DD', so a null lastDay is treated as oldest. */
const dayKey = (d: string | null) => d ?? '';

function mergeStreak(
  a: ProgressSnapshot,
  b: ProgressSnapshot,
): ProgressSnapshot['streak'] {
  const best = Math.max(a.streak.best, b.streak.best);
  const ka = dayKey(a.streak.lastDay);
  const kb = dayKey(b.streak.lastDay);
  if (ka === kb) {
    // same day on both sides: keep the strongest state
    return {
      current: Math.max(a.streak.current, b.streak.current),
      best,
      lastDay: a.streak.lastDay,
      freezes: Math.max(a.streak.freezes, b.streak.freezes),
    };
  }
  // Different days: the later-dated side is "live", but it is NOT automatically
  // better informed. A device that has been offline for a week sees a gap on
  // its next study day and resets `current` to 1 with today's date; taking it
  // wholesale would destroy a 57-day streak still recorded on the other
  // device. So when the two days are contiguous, carry the stale streak
  // forward one day instead of dropping it. `dayDiff` is pure (it reads no
  // clock), which is what keeps this merge deterministic and commutative.
  const [live, stale] = ka > kb ? [a.streak, b.streak] : [b.streak, a.streak];
  const gap = stale.lastDay && live.lastDay ? dayDiff(stale.lastDay, live.lastDay) : Infinity;
  const carried = gap === 1 ? stale.current + 1 : 0;
  return { ...live, best, current: Math.max(live.current, carried) };
}

/** Identity of a stored exam attempt; ExamResult has no id field. */
const examKey = (e: ProgressSnapshot['exams'][number]) =>
  `${e.date}|${e.track}|${e.pct}|${e.correct}|${e.total}`;

function mergeExams(
  a: ProgressSnapshot,
  b: ProgressSnapshot,
): ProgressSnapshot['exams'] {
  const byKey = new Map<string, ProgressSnapshot['exams'][number]>();
  for (const e of [...a.exams, ...b.exams]) {
    const key = examKey(e);
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, e);
      continue;
    }
    // Two exams can collide on examKey (it deliberately excludes `domains`)
    // while carrying different per-domain breakdowns — e.g. two 30-question
    // exams on the same day both scoring 24/30. The survivor must be decided
    // from the entries' own content, never from which snapshot is `a` vs
    // `b`, or mergeProgress(a, b) and mergeProgress(b, a) could disagree.
    if (JSON.stringify(e.domains) < JSON.stringify(existing.domains)) {
      byKey.set(key, e);
    }
  }
  return Array.from(byKey.values()).sort((x, y) =>
    x.date === y.date ? examKey(x).localeCompare(examKey(y)) : x.date < y.date ? -1 : 1,
  );
}

/**
 * Pick the better-established of two schedules for the same card. The
 * comparison is total and decided purely by content, which is what keeps
 * mergeProgress commutative.
 */
function betterCard(x: CardState, y: CardState): CardState {
  if (x.reps !== y.reps) return x.reps > y.reps ? x : y;
  if (x.interval !== y.interval) return x.interval > y.interval ? x : y;
  if (x.due !== y.due) return x.due > y.due ? x : y;
  if (x.lapses !== y.lapses) return x.lapses < y.lapses ? x : y;
  return x.ease >= y.ease ? x : y;
}

function mergeSrs(
  a: ProgressSnapshot,
  b: ProgressSnapshot,
): ProgressSnapshot['srs'] {
  const out: ProgressSnapshot['srs'] = {};
  for (const k of keysOf(a.srs, b.srs)) {
    const x = a.srs[k];
    const y = b.srs[k];
    out[k] = x && y ? { ...betterCard(x, y) } : { ...(x ?? y) };
  }
  return out;
}

function mergeDay(
  a: ProgressSnapshot,
  b: ProgressSnapshot,
): ProgressSnapshot['day'] {
  if (a.day.date !== b.day.date) return a.day.date > b.day.date ? a.day : b.day;
  return {
    date: a.day.date,
    lessons: Math.max(a.day.lessons, b.day.lessons),
    questions: Math.max(a.day.questions, b.day.questions),
    correct: Math.max(a.day.correct, b.day.correct),
    cards: Math.max(a.day.cards, b.day.cards),
    labs: Math.max(a.day.labs, b.day.labs),
    highConfCorrect: Math.max(a.day.highConfCorrect, b.day.highConfCorrect),
    xpEarned: Math.max(a.day.xpEarned, b.day.xpEarned),
    newCards: Math.max(a.day.newCards, b.day.newCards),
    questsAwarded: Array.from(
      new Set([...a.day.questsAwarded, ...b.day.questsAwarded]),
    ).sort(),
  };
}

/**
 * Merge two progress snapshots. Commutative, idempotent and monotonic: no
 * counter decreases and no completed work is lost, so merge order never
 * matters and repeating a sync changes nothing.
 *
 * `a` is treated as the local snapshot: its `track` (a UI preference, not
 * progress) is preserved.
 */
export function mergeProgress(
  a: ProgressSnapshot,
  b: ProgressSnapshot,
): ProgressSnapshot {
  const achievements: Record<string, string> = {};
  for (const k of keysOf(a.achievements, b.achievements)) {
    const x = a.achievements[k];
    const y = b.achievements[k];
    // earliest unlock wins — an achievement cannot be un-earned
    achievements[k] = x && y ? (x < y ? x : y) : (x ?? y);
  }

  const calibration = {} as ProgressSnapshot['calibration'];
  for (const level of ['low', 'med', 'high'] as Conf[]) {
    const x = a.calibration[level];
    const y = b.calibration[level];
    // take one side wholesale: field-wise maxima could yield c > n
    calibration[level] =
      y.n > x.n || (y.n === x.n && y.c > x.c) ? { ...y } : { ...x };
  }

  return {
    track: a.track,
    xp: Math.max(a.xp, b.xp),
    streak: mergeStreak(a, b),
    activity: maxNumbers(a.activity, b.activity),
    lessons: unionFlags(a.lessons, b.lessons),
    quizBest: maxNumbers(a.quizBest, b.quizBest),
    labs: unionFlags(a.labs, b.labs),
    bosses: maxNumbers(a.bosses, b.bosses),
    exams: mergeExams(a, b),
    srs: mergeSrs(a, b),
    calibration,
    totals: {
      questions: Math.max(a.totals.questions, b.totals.questions),
      correct: Math.max(a.totals.correct, b.totals.correct),
      cards: Math.max(a.totals.cards, b.totals.cards),
      maxCombo: Math.max(a.totals.maxCombo, b.totals.maxCombo),
      highConfCorrect: Math.max(a.totals.highConfCorrect, b.totals.highConfCorrect),
      perfectQuizzes: Math.max(a.totals.perfectQuizzes, b.totals.perfectQuizzes),
      questsDone: Math.max(a.totals.questsDone, b.totals.questsDone),
      checkpoints: Math.max(a.totals.checkpoints, b.totals.checkpoints),
    },
    achievements,
    // Placeholder: Task 5 implements the exempt/placement merge rules.
    exempt: {},
    placement: [],
    day: mergeDay(a, b),
  };
}

/**
 * Base URL of the sync Worker. Public, not a secret. Empty disables the whole
 * feature: no network call is ever attempted and the UI says so.
 */
export const SYNC_URL: string =
  'https://ticourse-sync.ojamajo.workers.dev';

/** Stored blob schema version. Bump when the snapshot shape changes. */
export const SYNC_SCHEMA = 1;

/** Codes shorter than this are guessable enough to warn about. */
const MIN_CODE_LENGTH = 16;

/**
 * NFC first: an accented code typed on one device may arrive decomposed (NFD)
 * and on another composed (NFC). Those are different byte strings and would
 * hash to two different buckets for what the user typed as one code.
 */
export const normalizeCode = (code: string) =>
  code.normalize('NFC').trim().toLowerCase();

/**
 * SHA-256 of the normalized code, hex encoded. Runs in the browser, so the
 * code itself never reaches the network — the server only ever sees a digest.
 */
export async function hashCode(code: string): Promise<string> {
  const bytes = new TextEncoder().encode(normalizeCode(code));
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export const isWeakCode = (code: string) =>
  normalizeCode(code).length < MIN_CODE_LENGTH;

const WORDS = [
  'ancla', 'faro', 'muelle', 'grua', 'marea', 'proa', 'brisa', 'dique',
  'norte', 'calma', 'niebla', 'rumbo', 'quilla', 'popa', 'costa', 'vela',
];

/**
 * A memorable, high-entropy code: three words plus twelve random base-36 chars.
 *
 * Each 32-bit draw is truncated to its low six base-36 digits (36^6 < 2^32), so
 * one draw carries ~31 bits, not 32. Two draws plus the three word picks
 * (4 bits each) put the code at roughly 74 bits — well past anything a bucket
 * scan could reach, and the digest stored server-side is unsalted, so the code
 * itself has to carry all the strength.
 */
export function generateCode(): string {
  const rnd = new Uint32Array(5);
  crypto.getRandomValues(rnd);
  const words = Array.from(rnd.slice(0, 3), (n) => WORDS[n % WORDS.length]);
  const chunk = (n: number) => n.toString(36).padStart(6, '0').slice(-6);
  const tail = chunk(rnd[3]) + chunk(rnd[4]);
  return [...words, tail].join('-');
}

const endpoint = (hash: string) => `${SYNC_URL}/p/${hash}`;

/** Fetch the remote snapshot. Returns null when the bucket does not exist yet. */
export async function pull(hash: string): Promise<ProgressSnapshot | null> {
  const res = await fetch(endpoint(hash), { headers: { accept: 'application/json' } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Sync pull failed (${res.status})`);
  const body = (await res.json()) as { v?: number; data?: ProgressSnapshot };
  // Reject only blobs NEWER than this client understands. An older `v` is
  // still readable, and rejecting it would strand every existing bucket the
  // moment SYNC_SCHEMA is bumped: the throw happens before the push, so the
  // client could never rewrite the blob at the new version. When SYNC_SCHEMA
  // is bumped, add the upgrade for each older `v` right here, before the
  // shape guard below.
  if (typeof body.v !== 'number' || body.v > SYNC_SCHEMA || !body.data) {
    throw new Error('Datos de sincronización de una versión desconocida');
  }
  // Runtime shape guard. The blob is public and writable by anyone who knows
  // the code, and mergeProgress trusts its inputs: a snapshot missing `totals`
  // would make Math.max(x, undefined) === NaN, which then gets written into
  // local state and persisted. Throwing here leaves local progress untouched
  // (syncNow catches, and neither applies the merge nor pushes).
  const d = body.data as Partial<ProgressSnapshot>;
  if (typeof d.xp !== 'number' || !d.streak || !d.totals || !d.calibration || !d.day || !Array.isArray(d.exams)) {
    throw new Error('Datos de sincronización incompletos');
  }
  return body.data;
}

/**
 * Write the snapshot to the bucket.
 *
 * `keepalive` is opt-in and off by default: per the Fetch standard a keepalive
 * request whose body exceeds 64 KiB fails with a TypeError before it is even
 * sent, and a heavy user's snapshot grows past that (activity gains an entry
 * every day, forever) while the Worker itself accepts 512 KB. Only the
 * tab-hide path — where the document may be torn down mid-flight — asks for it.
 */
export async function push(
  hash: string,
  data: ProgressSnapshot,
  opts: { keepalive?: boolean } = {},
): Promise<void> {
  const res = await fetch(endpoint(hash), {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ v: SYNC_SCHEMA, data }),
    keepalive: opts.keepalive ?? false,
  });
  if (!res.ok) throw new Error(`Sync push failed (${res.status})`);
}
