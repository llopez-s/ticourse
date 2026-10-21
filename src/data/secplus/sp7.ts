import type { Module } from '../../lib/types';
import { SP7M1 } from './sp7-m1';
import { SP7M2 } from './sp7-m2';
import { SP7M3 } from './sp7-m3';
import { SP7M4 } from './sp7-m4';
import { SP7M5 } from './sp7-m5';
import { SP7M6 } from './sp7-m6';
import { SP7M7 } from './sp7-m7';

export { SP7M1, SP7M2, SP7M3, SP7M4, SP7M5, SP7M6, SP7M7 };

/** Optional section «Novedades del SY0-801»: lessons only (no quiz, labs, boss or placement). */
export const SP7_MODULES: Module[] = [SP7M1, SP7M2, SP7M3, SP7M4, SP7M5, SP7M6, SP7M7];
