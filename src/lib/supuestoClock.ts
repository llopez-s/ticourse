// Practical-case ("supuesto") timed mode: pure clock helpers.
import type { Supuesto } from './supuesto';
import type { SupuestoRun } from './supuestoGrade';

const MIN_MS = 60_000;

/** Milliseconds left before the deadline; never negative (0 when passed or startedAt is invalid). */
export function remainingMs(startedAt: string, minutes: number, now: number): number {
  const start = Date.parse(startedAt);
  if (Number.isNaN(start)) return 0;
  return Math.max(0, start + minutes * MIN_MS - now);
}

/** Only an unfinished exam-mode run can expire; practice has no clock. */
export function isExpired(run: SupuestoRun, minutes: number, now: number): boolean {
  return run.mode === 'exam' && run.finishedAt === undefined && remainingMs(run.startedAt, minutes, now) === 0;
}

/** '1:05:09', '38:12', '0:07'. Rounds up so the clock never shows 0:00 while time remains. */
export function formatClock(ms: number): string {
  const total = Math.ceil(Math.max(0, ms) / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const sec = total % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
}

/**
 * Closes a run whose time is up: every phase counts as submitted, answers are kept,
 * and the finish time is the deadline (not `now`, which may be hours later after a closed tab).
 */
export function expireRun(s: Supuesto, run: SupuestoRun, now: Date): SupuestoRun {
  const deadline = Date.parse(run.startedAt) + s.minutes * MIN_MS;
  const finished = Math.min(deadline, now.getTime());
  return {
    ...run,
    submitted: s.phases.map((p) => p.id),
    phaseIndex: Math.max(0, s.phases.length - 1),
    finishedAt: new Date(finished).toISOString(),
  };
}
