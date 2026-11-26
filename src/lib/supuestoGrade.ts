// Practical-case ("supuesto") engine: pure grading, branching and score.
// No side effects; the UI and store consume these functions.
import type { DossierDoc, Phase, Ref, Supuesto, SupuestoMode, Task } from './supuesto';

/**
 * Shape of an answer per task kind:
 * choice -> option id; numeric -> number or raw text; multi/order/cite -> id list;
 * match -> { leftId: rightId }; table -> { "rowId.fieldId": option };
 * written -> unused (graded through the self-assessment).
 */
export type TaskAnswer = string | string[] | number | Record<string, string> | undefined;

export interface TaskOutcome { earned: number; max: number; correct: boolean }

const round1 = (x: number) => Math.round(x * 10) / 10;
const round2 = (x: number) => Math.round(x * 100) / 100;
const clamp = (lo: number, x: number, hi: number) => Math.min(hi, Math.max(lo, x));

/** Both ',' and '.' are decimal separators (no thousands separators). */
export function parseNumber(raw: string): number | undefined {
  const t = raw.trim().replace(',', '.');
  if (!/^[+-]?(\d+\.?\d*|\.\d+)$/.test(t)) return undefined;
  const n = Number(t);
  return Number.isFinite(n) ? n : undefined;
}

const asList = (a: TaskAnswer): string[] =>
  Array.isArray(a) ? a : typeof a === 'string' && a !== '' ? [a] : [];

const asRecord = (a: TaskAnswer): Record<string, string> =>
  a && typeof a === 'object' && !Array.isArray(a) ? a : {};

/** Fraction in [0, 1] of the task earned, before applying points. */
function fraction(task: Task, answer: TaskAnswer, selfChecked: string[]): number {
  switch (task.kind) {
    case 'choice':
      return answer === task.answer ? 1 : 0;
    case 'numeric': {
      const v = typeof answer === 'number' ? answer : typeof answer === 'string' ? parseNumber(answer) : undefined;
      if (v === undefined || !Number.isFinite(v)) return 0;
      return Math.abs(v - task.answer) <= (task.tolerance ?? 0) + 1e-9 ? 1 : 0;
    }
    case 'multi': {
      const marked = new Set(asList(answer));
      const hits = [...marked].filter((m) => task.answer.includes(m)).length;
      const wrong = marked.size - hits;
      return Math.max(0, hits - wrong) / task.answer.length;
    }
    case 'table': {
      const a = asRecord(answer);
      let total = 0;
      let ok = 0;
      for (const r of task.rows) {
        for (const f of task.fields) {
          total++;
          if (a[`${r.id}.${f.id}`] === r.answer[f.id]) ok++;
        }
      }
      return total === 0 ? 0 : ok / total;
    }
    case 'order': {
      const a = asList(answer);
      const ok = task.answer.filter((id, i) => a[i] === id).length;
      return ok / task.answer.length;
    }
    case 'match': {
      const a = asRecord(answer);
      const keys = Object.keys(task.answer);
      return keys.length === 0 ? 0 : keys.filter((k) => a[k] === task.answer[k]).length / keys.length;
    }
    case 'cite': {
      const sel = new Set(asList(answer));
      const union = new Set(task.answerSets.flat());
      if ([...sel].some((d) => !union.has(d))) return 0;
      return task.answerSets.some((set) => set.length > 0 && set.every((d) => sel.has(d))) ? 1 : 0;
    }
    case 'written': {
      const checked = new Set(selfChecked);
      const got = task.rubric.filter((r) => checked.has(r.id)).reduce((n, r) => n + r.points, 0);
      return task.points === 0 ? 0 : got / task.points;
    }
  }
}

export function gradeTask(task: Task, answer: TaskAnswer, selfChecked: string[] = []): TaskOutcome {
  const earned = round2(fraction(task, answer, selfChecked) * task.points);
  return { earned, max: task.points, correct: earned === task.points };
}

export interface SupuestoRun {
  mode: SupuestoMode;
  startedAt: string;
  finishedAt?: string;
  phaseIndex: number;
  /** Ids of submitted phases, in order. */
  submitted: string[];
  answers: Record<string, TaskAnswer>;
  /** Task ids whose hint was seen. */
  hints: string[];
  /** Written task id -> ids of the rubric criteria ticked. */
  self: Record<string, string[]>;
  /** Self-assessment closed / result sent to the store. */
  selfDone: boolean;
  recorded: boolean;
}

export function freshRun(mode: SupuestoMode, now: Date): SupuestoRun {
  return {
    mode,
    startedAt: now.toISOString(),
    phaseIndex: 0,
    submitted: [],
    answers: {},
    hints: [],
    self: {},
    selfDone: false,
    recorded: false,
  };
}

const allTasks = (s: Supuesto): Task[] => s.phases.flatMap((p) => p.tasks);

/** First variant whose condition holds replaces the context and adds its unlocks. `carry` is the UI's job. */
export function resolvePhase(phase: Phase, s: Supuesto, run: SupuestoRun): { context: string; unlocks: string[] } {
  const tasks = allTasks(s);
  for (const v of phase.variants ?? []) {
    const t = tasks.find((x) => x.id === v.when.task);
    if (!t) continue;
    const answer = run.answers[t.id];
    let holds: boolean;
    if ('chose' in v.when) {
      holds = Array.isArray(answer) ? answer.includes(v.when.chose) : answer === v.when.chose;
    } else {
      const correct = gradeTask(t, answer, run.self[t.id] ?? []).correct;
      holds = v.when.is === 'correct' ? correct : !correct;
    }
    if (holds) return { context: v.context, unlocks: v.unlocks ?? [] };
  }
  return { context: phase.context, unlocks: [] };
}

/** Documents shown so far: no gate, gate phase submitted, or unlocked by a variant of an already shown phase. */
export function visibleDocs(s: Supuesto, run: SupuestoRun): DossierDoc[] {
  const unlocked = new Set<string>();
  s.phases.forEach((p, i) => {
    if (i <= run.phaseIndex) resolvePhase(p, s, run).unlocks.forEach((u) => unlocked.add(u));
  });
  return s.dossier.filter((d) => d.unlockedBy === undefined || run.submitted.includes(d.unlockedBy) || unlocked.has(d.id) || unlocked.has(d.unlockedBy));
}

export interface Score {
  earned: number;
  max: number;
  autoEarned: number;
  autoMax: number;
  hintCost: number;
  grade: number;
  autoGrade: number;
  passed: boolean;
  byPhase: { id: string; title: string; earned: number; max: number }[];
  byTopic: { topic: string; earned: number; max: number }[];
  review: Ref[];
}

/** Pass mark on the 0-10 scale. */
export const PASS_GRADE = 5;

export function scoreRun(s: Supuesto, run: SupuestoRun): Score {
  let earned = 0, max = 0, autoEarned = 0, autoMax = 0, hintCost = 0, autoHintCost = 0;
  const byTopic = new Map<string, { earned: number; max: number }>();
  const review: Ref[] = [];
  const seen = new Set<string>();

  const byPhase = s.phases.map((p) => {
    let pe = 0, pm = 0;
    for (const t of p.tasks) {
      const o = gradeTask(t, run.answers[t.id], run.self[t.id] ?? []);
      pe += o.earned;
      pm += o.max;
      earned += o.earned;
      max += o.max;
      const auto = t.kind !== 'written';
      if (auto) { autoEarned += o.earned; autoMax += o.max; }
      if (t.hint && run.hints.includes(t.id)) {
        hintCost += t.hint.cost;
        if (auto) autoHintCost += t.hint.cost;
      }
      const topic = t.topic ?? s.sectionIds[0];
      const agg = byTopic.get(topic) ?? { earned: 0, max: 0 };
      agg.earned += o.earned;
      agg.max += o.max;
      byTopic.set(topic, agg);
      if (!o.correct) {
        for (const r of t.refs) {
          if (r.href?.startsWith('/learn/') && !seen.has(r.href)) { seen.add(r.href); review.push(r); }
        }
      }
    }
    return { id: p.id, title: p.title, earned: round2(pe), max: round2(pm) };
  });

  const toGrade = (e: number, h: number, m: number) => (m > 0 ? round1(clamp(0, ((e - h) / m) * 10, 10)) : 0);
  const grade = toGrade(earned, hintCost, max);
  return {
    earned: round2(earned),
    max,
    autoEarned: round2(autoEarned),
    autoMax,
    hintCost,
    grade,
    autoGrade: toGrade(autoEarned, autoHintCost, autoMax),
    passed: grade >= PASS_GRADE,
    byPhase,
    byTopic: [...byTopic].map(([topic, v]) => ({ topic, earned: round2(v.earned), max: v.max })),
    review,
  };
}
