import type { Module } from '../../lib/types';
import { SP2_PART1 } from './sp2-part1';
import { SP2_PART2 } from './sp2-part2';
import { SP2_PART3 } from './sp2-part3';
import { SP2_PART4 } from './sp2-part4';

/** Domain 2 — Threats, Vulnerabilities & Mitigations (SY0-701 objectives 2.1–2.5). */
export const SP2_MODULES: Module[] = [
  ...SP2_PART1, // sp2m1, sp2m2
  ...SP2_PART2, // sp2m3, sp2m4
  ...SP2_PART3, // sp2m5, sp2m6
  ...SP2_PART4, // sp2m7, sp2m8
];
