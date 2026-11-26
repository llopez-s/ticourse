// Practical-case ("supuesto") engine: content types and structural validation.
// Grading, UI and store build on these types; this module has no side effects.
import type { Block, TrackId } from './types';

export type SupuestoMode = 'practice' | 'exam';

/** `href` is an internal route ('/learn/op1m2') or an external URL. */
export interface Ref { label: string; href?: string }

export interface NetNode {
  id: string;
  label: string;
  kind: 'router' | 'switch' | 'l3switch' | 'firewall' | 'server' | 'pc' | 'ap' | 'cloud';
  x: number;
  y: number;
  sub?: string;
}

export interface NetDiagram {
  width: number;
  height: number;
  nodes: NetNode[];
  links: { from: string; to: string; label?: string }[];
  zones?: { label: string; x: number; y: number; w: number; h: number }[];
}

export interface DossierDoc {
  id: string;
  title: string;
  kind: 'memo' | 'email' | 'table' | 'diagram' | 'config' | 'log' | 'norma' | 'acta';
  body?: Block[];
  diagram?: NetDiagram;
  /** Phase id that makes the document visible; absent = visible from the start. */
  unlockedBy?: string;
}

interface TaskBase {
  id: string;
  prompt: string;
  points: number;
  explain: string;
  refs: Ref[];
  hint?: { text: string; cost: number };
  topic?: string;
}

export type Task = TaskBase & (
  | { kind: 'choice'; options: { id: string; text: string }[]; answer: string }
  | { kind: 'multi'; options: { id: string; text: string }[]; answer: string[] }
  | { kind: 'numeric'; answer: number; tolerance?: number; unit?: string }
  | { kind: 'table'; fields: { id: string; label: string; options: string[] }[]; rows: { id: string; label: string; answer: Record<string, string> }[] }
  | { kind: 'order'; items: { id: string; text: string }[]; answer: string[] }
  | { kind: 'match'; left: { id: string; text: string }[]; right: { id: string; text: string }[]; answer: Record<string, string> }
  | { kind: 'cite'; answerSets: string[][] }
  | { kind: 'written'; words?: number; model: string; rubric: { id: string; text: string; points: number }[] });

export type Condition = { task: string; is: 'correct' | 'wrong' } | { task: string; chose: string };

export interface Phase {
  id: string;
  title: string;
  context: string;
  variants?: { when: Condition; context: string; unlocks?: string[] }[];
  carry?: string;
  tasks: Task[];
}

export interface Supuesto {
  id: string;
  track: TrackId;
  sectionIds: string[];
  version: number;
  title: string;
  brief: string;
  minutes: number;
  prerequisites: string[];
  dossier: DossierDoc[];
  phases: Phase[];
  sources: Ref[];
  integrator?: boolean;
}

export type SupuestoMeta = Pick<Supuesto, 'id' | 'track' | 'sectionIds' | 'version' | 'title' | 'brief' | 'minutes' | 'integrator'>;

export const metaOf = (s: Supuesto): SupuestoMeta => ({
  id: s.id,
  track: s.track,
  sectionIds: s.sectionIds,
  version: s.version,
  title: s.title,
  brief: s.brief,
  minutes: s.minutes,
  integrator: s.integrator,
});

export interface ValidationContext { moduleIds: Set<string>; sectionIds: Set<string> }

const LESSON_HREF = /^\/learn\/([^/?#]+)/;

const sameSet = (a: string[], b: string[]) =>
  a.length === b.length && new Set(a).size === a.length && b.every((x) => a.includes(x));

/** Structural checks only; returns human-readable problems, [] when valid. */
export function validateSupuesto(s: Supuesto, ctx: ValidationContext): string[] {
  const errors: string[] = [];
  const err = (msg: string) => errors.push(`${s.id}: ${msg}`);

  if (!(s.minutes > 0)) err(`minutes must be > 0 (got ${s.minutes})`);
  for (const sec of s.sectionIds) if (!ctx.sectionIds.has(sec)) err(`unknown section "${sec}"`);

  const checkRefs = (refs: Ref[], where: string) => {
    for (const r of refs) {
      const m = r.href && LESSON_HREF.exec(r.href);
      if (m && !ctx.moduleIds.has(m[1])) err(`${where}: ref to missing lesson "${m[1]}"`);
    }
  };
  checkRefs(s.sources, 'sources');

  // Ids of phases, tasks and dossier docs share one namespace.
  const seen = new Set<string>();
  const claim = (id: string, what: string) => {
    if (seen.has(id)) err(`duplicate id "${id}" (${what})`);
    seen.add(id);
  };
  s.phases.forEach((p) => { claim(p.id, 'phase'); p.tasks.forEach((t) => claim(t.id, 'task')); });
  s.dossier.forEach((d) => claim(d.id, 'dossier doc'));

  const phaseIds = new Set(s.phases.map((p) => p.id));
  const docIds = new Set(s.dossier.map((d) => d.id));
  for (const d of s.dossier) {
    if (d.unlockedBy !== undefined && !phaseIds.has(d.unlockedBy)) err(`doc "${d.id}": unlockedBy unknown phase "${d.unlockedBy}"`);
  }

  // task id -> index of its phase
  const taskPhase = new Map<string, number>();
  const taskById = new Map<string, Task>();
  s.phases.forEach((p, i) => p.tasks.forEach((t) => { taskPhase.set(t.id, i); taskById.set(t.id, t); }));

  s.phases.forEach((p, pi) => {
    for (const v of p.variants ?? []) {
      const ref = taskPhase.get(v.when.task);
      if (ref === undefined) err(`phase "${p.id}": variant refers to unknown task "${v.when.task}"`);
      else if (ref >= pi) err(`phase "${p.id}": variant must look at an earlier phase (task "${v.when.task}")`);
      else if ('chose' in v.when) {
        const t = taskById.get(v.when.task)!;
        const ok = (t.kind === 'choice' || t.kind === 'multi') && t.options.some((o) => o.id === (v.when as { chose: string }).chose);
        if (!ok) err(`phase "${p.id}": variant chose "${v.when.chose}" is not an option of task "${t.id}"`);
      }
      for (const u of v.unlocks ?? []) if (!docIds.has(u)) err(`phase "${p.id}": variant unlocks unknown doc "${u}"`);
    }
    p.tasks.forEach((t) => validateTask(t, `task "${t.id}"`));
  });

  function validateTask(t: Task, where: string) {
    if (!(t.points > 0)) err(`${where}: points must be > 0`);
    if (t.hint && !(t.hint.cost >= 0 && t.hint.cost <= t.points)) err(`${where}: hint cost ${t.hint.cost} must be between 0 and points ${t.points}`);
    checkRefs(t.refs, where);

    switch (t.kind) {
      case 'choice':
        if (!t.options.some((o) => o.id === t.answer)) err(`${where}: answer "${t.answer}" is not an option`);
        break;
      case 'multi': {
        const ids = t.options.map((o) => o.id);
        if (t.answer.length === 0) err(`${where}: multi answer is empty`);
        else if (new Set(t.answer).size !== t.answer.length || !t.answer.every((a) => ids.includes(a))) err(`${where}: multi answer has ids that are not options`);
        break;
      }
      case 'numeric':
        if (!Number.isFinite(t.answer)) err(`${where}: numeric answer must be finite`);
        if (t.tolerance !== undefined && !(t.tolerance >= 0)) err(`${where}: tolerance must be >= 0`);
        break;
      case 'table':
        for (const r of t.rows) {
          for (const f of t.fields) {
            const a = r.answer[f.id];
            if (a === undefined || !f.options.includes(a)) err(`${where}: table row "${r.id}" answer for "${f.id}" is not in its options`);
          }
          for (const k of Object.keys(r.answer)) if (!t.fields.some((f) => f.id === k)) err(`${where}: table row "${r.id}" answers unknown field "${k}"`);
        }
        break;
      case 'order':
        if (!sameSet(t.answer, t.items.map((i) => i.id))) err(`${where}: order answer must list every item exactly once`);
        break;
      case 'match': {
        const lefts = t.left.map((l) => l.id);
        const rights = t.right.map((r) => r.id);
        const keys = Object.keys(t.answer);
        if (!sameSet(keys, lefts) || !Object.values(t.answer).every((v) => rights.includes(v))) err(`${where}: match answer must map every left id to a right id`);
        break;
      }
      case 'cite':
        if (t.answerSets.length === 0) err(`${where}: cite needs at least one answer set`);
        for (const set of t.answerSets) for (const d of set) if (!docIds.has(d)) err(`${where}: cite refers to unknown doc "${d}"`);
        break;
      case 'written': {
        const sum = t.rubric.reduce((n, r) => n + r.points, 0);
        if (t.rubric.length === 0 || sum !== t.points) err(`${where}: rubric points (${sum}) must equal task points (${t.points})`);
        break;
      }
    }
  }

  return errors;
}
