import { C } from '../../../engine/src/theme/tokens';
import type { Accent } from '../../../engine/src/theme/tokens';
import type { IconName, MonoToken } from '../../../engine/src/ui';

/**
 * S05 "Correlacionar y alertar": three harmless-looking events from three
 * different sources that one correlation rule stitches into an alert.
 * Fictitious data only; the clock (16:40–17:00) deliberately stays clear of
 * the CASO 0412 times used in chapter IV.
 */
export const ACCOUNT = 'ext.soporte';
export const HOST = 'srv-fich02';

/** Time axis: minutes after 16:40, 20 minutes wide. */
export const AXIS = { baseHour: 16, baseMinute: 40, span: 20, ticks: [0, 5, 10, 15, 20] } as const;

export function clock(minutes: number): string {
  const total = AXIS.baseHour * 60 + AXIS.baseMinute + Math.floor(minutes);
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export const LANES: { icon: IconName; label: string; host?: string }[] = [
  // A Windows host (failed RDP logons are logged there as 4625), not a VPN gateway.
  { icon: 'desktop', label: 'Escritorio remoto', host: 'rdp01' },
  { icon: 'server', label: 'Servidor', host: HOST },
  { icon: 'users', label: 'Controlador de dominio' },
];

export type EventKind = 'fail' | 'success' | 'create';

export interface TimelineEvent {
  id: string;
  kind: EventKind;
  lane: number;
  /** Minutes after 16:40. */
  minute: number;
  code: string;
  label?: string;
  accent: Accent;
}

/** 4625 ×3 inside 5 minutes, then 4624, then 4720 exactly ten minutes later. */
export const EVENTS: TimelineEvent[] = [
  { id: 'f1', kind: 'fail', lane: 0, minute: 1, code: '4625', accent: 'amber' },
  { id: 'f2', kind: 'fail', lane: 0, minute: 3, code: '4625', accent: 'amber' },
  { id: 'f3', kind: 'fail', lane: 0, minute: 5, code: '4625', accent: 'amber' },
  { id: 'ok', kind: 'success', lane: 1, minute: 6, code: '4624', label: 'correcto', accent: 'cyan' },
  { id: 'new', kind: 'create', lane: 2, minute: 16, code: '4720', label: 'cuenta creada', accent: 'cyan' },
];

const KW = { c: C.cyan, bold: true };
const ARG = { c: C.cyanSoft };
const NUM = { c: C.textStrong, bold: true };

/** Spanish pseudo-syntax, one clause per line (no arrows: the font subset lacks them). */
export const RULE: MonoToken[][] = [
  [{ t: 'si       ', ...KW }, { t: 'logon_fallido(' }, { t: 'cuenta=C', ...ARG }, { t: ') ' }, { t: '>= 3', ...NUM }, { t: ' en 5 min', ...NUM }],
  [{ t: 'y luego  ', ...KW }, { t: 'logon_correcto(' }, { t: 'cuenta=C', ...ARG }, { t: ')' }],
  [{ t: 'y luego  ', ...KW }, { t: 'cuenta_creada(' }, { t: 'por=C', ...ARG }, { t: ') ' }, { t: 'en 10 min', ...NUM }],
  [{ t: 'entonces ', ...KW }, { t: 'alerta ' }, { t: 'ALTA', c: C.roseSoft, bold: true }],
];

export interface AlertField {
  label: string;
  value?: string;
  /** Frames after the `alert` cue at which the value lands (synced to the words). */
  delay: number;
}

export const ALERT_FIELDS: AlertField[] = [
  { label: 'Qué pasó', value: 'acceso tras fallos + cuenta nueva', delay: 46 },
  { label: 'Dónde', value: `${HOST} · cuenta ${ACCOUNT}`, delay: 62 },
  { label: 'Gravedad', delay: 82 },
  { label: 'Acción esperada', value: `revisar ${ACCOUNT} y la cuenta nueva`, delay: 100 },
];
