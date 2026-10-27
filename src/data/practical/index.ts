import { IDENTITY_EXPANSIONS } from './identity';
import { COLLECTION_EXPANSIONS } from './collection';
import { ANALYSIS_EXPANSIONS } from './analysis-yara';
import { HUNTING_EXPANSIONS } from './hunting';
import { expandLesson, type LessonExpansion } from './shared';
import type { Module } from '../../lib/types';

/** Joins expansion sets; a lesson expanded by several sets gets their blocks in order. */
function mergeExpansions(...sets: Record<string, LessonExpansion>[]): Record<string, LessonExpansion> {
  const out: Record<string, LessonExpansion> = {};
  for (const set of sets) for (const [id, extra] of Object.entries(set)) {
    const prev = out[id];
    out[id] = prev ? {
      minutes: prev.minutes + extra.minutes,
      objectives: [...prev.objectives, ...extra.objectives],
      blocks: [...prev.blocks, ...extra.blocks],
    } : extra;
  }
  return out;
}

export const PRACTICAL_EXPANSIONS = mergeExpansions(IDENTITY_EXPANSIONS, COLLECTION_EXPANSIONS, ANALYSIS_EXPANSIONS, HUNTING_EXPANSIONS);
export const withPracticalExpansion = (mod: Module) => expandLesson(mod, PRACTICAL_EXPANSIONS);
