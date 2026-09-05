import type { Module } from '../../lib/types';
import { SP3_PART1 } from './sp3-part1';
import { SP3_PART2 } from './sp3-part2';
import { SP3_PART3 } from './sp3-part3';
import { SP3_PART4 } from './sp3-part4';

/** Domain 3 — Security Architecture (SY0-701 objectives 3.1–3.4). */
export const SP3_MODULES: Module[] = [
  ...SP3_PART1, // sp3m1, sp3m2
  ...SP3_PART2, // sp3m3, sp3m4
  ...SP3_PART3, // sp3m5, sp3m6
  ...SP3_PART4, // sp3m7
];
