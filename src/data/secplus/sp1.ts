import type { Module } from '../../lib/types';
import { SP1_PART1 } from './sp1-part1';
import { SP1_PART2 } from './sp1-part2';
import { SP1_PART3 } from './sp1-part3';
import { SP1_PART4 } from './sp1-part4';

/** Domain 1 — General Security Concepts (SY0-701 objectives 1.1–1.4). */
export const SP1_MODULES: Module[] = [
  ...SP1_PART1, // sp1m1, sp1m2
  ...SP1_PART2, // sp1m3, sp1m4
  ...SP1_PART3, // sp1m5
  ...SP1_PART4, // sp1m6, sp1m7
];
