import type { Module } from '../../lib/types';
import { SP4_PART1 } from './sp4-part1';
import { SP4_PART2 } from './sp4-part2';
import { SP4_PART3 } from './sp4-part3';
import { SP4_PART4 } from './sp4-part4';
import { SP4_PART5 } from './sp4-part5';
import { SP4_PART6 } from './sp4-part6';

/** Domain 4 — Security Operations (SY0-701 objectives 4.1–4.9). Largest domain, 28%. */
export const SP4_MODULES: Module[] = [
  ...SP4_PART1, // sp4m1, sp4m2
  ...SP4_PART2, // sp4m3, sp4m4
  ...SP4_PART3, // sp4m5, sp4m6
  ...SP4_PART4, // sp4m7, sp4m8
  ...SP4_PART5, // sp4m9, sp4m10
  ...SP4_PART6, // sp4m11
];
