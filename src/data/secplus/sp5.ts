import type { Module } from '../../lib/types';
import { SP5_PART1 } from './sp5-part1';
import { SP5_PART2 } from './sp5-part2';
import { SP5_PART3 } from './sp5-part3';
import { SP5_PART4 } from './sp5-part4';

/** Domain 5 — Security Program Management & Oversight (SY0-701 objectives 5.1–5.6). */
export const SP5_MODULES: Module[] = [
  ...SP5_PART1, // sp5m1, sp5m2
  ...SP5_PART2, // sp5m3, sp5m4
  ...SP5_PART3, // sp5m5, sp5m6
  ...SP5_PART4, // sp5m7, sp5m8
];
