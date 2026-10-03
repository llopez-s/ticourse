/**
 * s05-oauth «Un vale para recoger un paquete» — on-screen strings (canon: scene brief «Canon» > s05).
 * The permission is issued by Halden's IdP (cyan), never by the user; the
 * third-party app is sky. Voucher strings live in parts/Voucher.tsx (VOUCHER_TEXT).
 */
import type { LaneDef } from '../scenes/parts/Lanes';

export const APP = {
  name: 'Planificador de atraques',
  vendor: 'proveedor externo',
  form: 'usuario y contraseña del puerto',
} as const;

export const CALENDAR = 'calendario de atraques';

export const CROSSED = {
  lead: 'con tu contraseña:',
  items: [
    { label: 'correo', icon: 'mail' as const, word: 'correo' },
    { label: 'archivos', icon: 'file' as const, word: 'archivos' },
    { label: 'todo', icon: 'layers' as const, word: 'todo' },
  ],
  tail: 'y solo se corta cambiándola',
} as const;

export const LANES: LaneDef[] = [
  { title: 'app', tone: 'sky', icon: 'app' },
  { title: 'IdP de Halden', tone: 'cyan', icon: 'shield' },
  { title: 'calendario de atraques', tone: 'cyan', icon: 'clock' },
];

export const CONSENT = {
  head: 'Planificador de atraques quiere:',
  scope: 'leer el calendario de atraques',
  allow: 'Permitir',
  deny: 'Rechazar',
} as const;

export const TOKEN = {
  title: 'permiso, no contraseña',
  scope: 'alcance: calendario.leer',
  expires: 'caduca: 60 min',
} as const;

export const READ = 'leído';
export const OUT_OF_SCOPE = 'correo · fuera de alcance';

export const REVOKE = { button: 'retirar permiso', intact: 'contraseña · intacta' } as const;

export const OAUTH = { term: 'OAUTH', line: 'autoriza y delega · no autentica' } as const;

export const DESK = 'conserjería';
