import type { Module } from '../../lib/types';
import { OP3_M1 } from './op3-m1';
import { OP3_M2 } from './op3-m2';
import { OP3_M3 } from './op3-m3';
import { OP3_M4 } from './op3-m4';
import { OP3_M5 } from './op3-m5';

/** Bloque 3 — Servicios de red (DNS, DHCP, NTP y servicios de conectividad; una lección por archivo). */
export const OP3_MODULES: Module[] = [OP3_M1, OP3_M2, OP3_M3, OP3_M4, OP3_M5];
