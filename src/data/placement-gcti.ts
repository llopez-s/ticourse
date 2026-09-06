import type { PlacementBlock } from '../lib/types';
import { S1_PLACEMENT } from './placement-gcti-s1';
import { S2_PLACEMENT } from './placement-gcti-s2';
import { S3_PLACEMENT } from './placement-gcti-s3';
import { S4_PLACEMENT } from './placement-gcti-s4';
import { S5_PLACEMENT } from './placement-gcti-s5';

/**
 * GCTI placement blocks, one per content section (s1-s5). s6 is exam prep, has
 * no domain and no lessons to convalidate, so it gets no block — the
 * completeness test in content.test.ts counts content sections only.
 */
export const GCTI_PLACEMENT: PlacementBlock[] = [
  S1_PLACEMENT,
  S2_PLACEMENT,
  S3_PLACEMENT,
  S4_PLACEMENT,
  S5_PLACEMENT,
];
