import { IDENTITY_EXPANSIONS } from './identity';
import { COLLECTION_EXPANSIONS } from './collection';
import { ANALYSIS_EXPANSIONS } from './analysis-yara';
import { expandLesson } from './shared';
import type { Module } from '../../lib/types';

export const PRACTICAL_EXPANSIONS = { ...IDENTITY_EXPANSIONS, ...COLLECTION_EXPANSIONS, ...ANALYSIS_EXPANSIONS };
export const withPracticalExpansion = (mod: Module) => expandLesson(mod, PRACTICAL_EXPANSIONS);
