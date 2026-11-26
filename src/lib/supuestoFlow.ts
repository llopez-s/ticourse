// Practical-case ("supuesto") page flow: pure state transitions over a SupuestoRun.
import type { Supuesto, SupuestoMeta, SupuestoMode } from './supuesto';
import { visibleDocs, type SupuestoRun } from './supuestoGrade';

/**
 * Submits the current phase: adds it to `submitted` and moves to the next one,
 * or sets `finishedAt` when it was the last. A phase already submitted, or a
 * finished run, is returned unchanged.
 */
export function submitPhase(s: Supuesto, run: SupuestoRun, now: Date = new Date()): SupuestoRun {
  const phase = s.phases[run.phaseIndex];
  if (!phase || run.finishedAt !== undefined || run.submitted.includes(phase.id)) return run;
  const submitted = [...run.submitted, phase.id];
  const last = run.phaseIndex >= s.phases.length - 1;
  return last
    ? { ...run, submitted, finishedAt: now.toISOString() }
    : { ...run, submitted, phaseIndex: run.phaseIndex + 1 };
}

/** Records that a task's hint was seen (once). Exam mode has no hints. */
export function applyHint(run: SupuestoRun, taskId: string): SupuestoRun {
  if (run.mode === 'exam' || run.hints.includes(taskId)) return run;
  return { ...run, hints: [...run.hints, taskId] };
}

/** There is at least one written task and the self-assessment is not closed. */
export function needsSelfAssessment(s: Supuesto, run: SupuestoRun): boolean {
  return !run.selfDone && s.phases.some((p) => p.tasks.some((t) => t.kind === 'written'));
}

export const workspaceIdentity = (s: SupuestoMeta, mode: SupuestoMode): string =>
  `supuesto/${s.id}/${mode}/v${s.version}`;

/** Documents that became visible when the current phase opened. */
export function newDocIds(s: Supuesto, run: SupuestoRun): string[] {
  if (run.phaseIndex === 0) return [];
  const prevPhase = s.phases[run.phaseIndex - 1].id;
  const before = visibleDocs(s, {
    ...run,
    phaseIndex: run.phaseIndex - 1,
    submitted: run.submitted.filter((id) => id !== prevPhase),
  }).map((d) => d.id);
  return visibleDocs(s, run).map((d) => d.id).filter((id) => !before.includes(id));
}
