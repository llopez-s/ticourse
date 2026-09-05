import type { Conf, ProgressSnapshot } from './types';

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
  const live = ka > kb ? a.streak : b.streak;
  return { ...live, best };
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
    if (!byKey.has(examKey(e))) byKey.set(examKey(e), e);
  }
  return Array.from(byKey.values()).sort((x, y) =>
    x.date === y.date ? examKey(x).localeCompare(examKey(y)) : x.date < y.date ? -1 : 1,
  );
}

function mergeSrs(a: ProgressSnapshot, b: ProgressSnapshot) {
  return { ...b.srs, ...a.srs };
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
    day: mergeDay(a, b),
  };
}
