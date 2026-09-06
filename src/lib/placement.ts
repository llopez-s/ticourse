import type { ExemptEntry, PlacementResult, ProgressSnapshot, TrackId } from './types';
import { pct } from './util';

/** A block is passed at 80% — the same bar as a passed quiz and a downed boss. */
export const PLACEMENT_PASS_PCT = 80;
/** Questions per block. */
export const PLACEMENT_BLOCK_N = 12;

type WithExempt = Pick<ProgressSnapshot, 'exempt'>;
type WithProgress = Pick<ProgressSnapshot, 'lessons' | 'exempt'>;

/** A revoked entry reads exactly like no entry at all. */
export function exemptActive(s: WithExempt, moduleId: string): boolean {
  return s.exempt[moduleId]?.status === 'exempt';
}

export function exemptScore(s: WithExempt, moduleId: string): number | null {
  const e = s.exempt[moduleId];
  return e && e.status === 'exempt' ? e.score : null;
}

/** Studied or convalidated — the single question every progress read asks. */
export function isDone(s: WithProgress, moduleId: string): boolean {
  return !!s.lessons[moduleId] || exemptActive(s, moduleId);
}

export function sectionExempt(s: WithExempt, moduleIds: string[]): boolean {
  return moduleIds.some((id) => exemptActive(s, id));
}

/** Score shown on the "Sección convalidada" band: the latest active grant. */
export function sectionExemptScore(s: WithExempt, moduleIds: string[]): number | null {
  let best: ExemptEntry | null = null;
  for (const id of moduleIds) {
    const e = s.exempt[id];
    if (e?.status !== 'exempt') continue;
    if (!best || e.at > best.at) best = e;
  }
  return best ? best.score : null;
}

export function gradePlacement(
  blockId: string,
  sectionId: string,
  track: TrackId,
  correct: number,
  total: number,
  at: string,
): PlacementResult {
  const p = pct(correct, total);
  return {
    date: at,
    track,
    blockId,
    sectionId,
    correct,
    total,
    pct: p,
    passed: p >= PLACEMENT_PASS_PCT,
  };
}

/**
 * Entries to write when cashing in a passed block. Modules already studied are
 * skipped: a lesson genuinely read is never relabelled as convalidated.
 */
export function exemptionsFor(
  moduleIds: string[],
  lessons: Record<string, boolean>,
  blockId: string,
  score: number,
  at: string,
): Record<string, ExemptEntry> {
  const out: Record<string, ExemptEntry> = {};
  for (const id of moduleIds) {
    if (lessons[id]) continue;
    out[id] = { status: 'exempt', at, via: blockId, score };
  }
  return out;
}

/** Tombstones for every actively exempt module of a section. */
export function revocationsFor(
  exempt: Record<string, ExemptEntry>,
  moduleIds: string[],
  at: string,
): Record<string, ExemptEntry> {
  const out: Record<string, ExemptEntry> = {};
  for (const id of moduleIds) {
    const e = exempt[id];
    if (e?.status !== 'exempt') continue;
    out[id] = { ...e, status: 'revoked', at };
  }
  return out;
}
