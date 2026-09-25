import type { Accent } from '../theme/tokens';
import type { IconName } from '../ui';

/**
 * S04 "Enriquecer": one normalised event and the four pieces of context the
 * SIEM bolts onto it. Every identifier is fictitious (RFC 5737 addresses,
 * internal 10.20.x.x, *.puerto-halden.example).
 */
export const EVENT = {
  kind: 'Conexión saliente',
  source: 'fuente: firewall',
  fields: [
    // A different container-terminal server and service account than CASO 0412
    // (srv-tc-app03 / svc_tosreport): chapter IV must not be shown here first.
    { key: 'origen  ', value: 'srv-tc-app01' },
    { key: 'destino ', value: '198.51.100.23 · 443/tcp' },
    { key: 'usuario ', value: 'svc_edi' },
  ],
} as const;

export interface ContextRow {
  /** Narration cue that snaps this row onto the event. */
  cue: 'enr-asset' | 'enr-identity' | 'enr-geo' | 'enr-ti';
  icon: IconName;
  /** Where the SIEM looks it up (right-hand source tile). */
  source: string;
  key: string;
  value: string;
  accent: Accent;
  /** Optional pill after the value (lands a beat later, on "cuánto importa"). */
  chip?: { text: string; accent: Accent; delay: number };
  /** Optional warning line under the row. */
  note?: { text: string; delay: number };
}

export const CONTEXT_ROWS: ContextRow[] = [
  {
    cue: 'enr-asset',
    icon: 'server',
    source: 'Inventario de activos',
    key: 'Activo:',
    value: 'terminal de contenedores',
    accent: 'cyan',
    chip: { text: 'criticidad ALTA', accent: 'rose', delay: 20 },
  },
  {
    cue: 'enr-identity',
    icon: 'user',
    source: 'Directorio de identidades',
    key: 'Usuario:',
    value: 'cuenta de servicio',
    accent: 'cyan',
  },
  {
    cue: 'enr-geo',
    icon: 'globe',
    source: 'Geolocalización de IP',
    key: 'IP:',
    value: 'externa · país sin relación con el puerto',
    accent: 'amber',
  },
  {
    cue: 'enr-ti',
    icon: 'radar',
    source: 'Inteligencia de amenazas',
    key: 'Inteligencia de amenazas:',
    value: 'sin coincidencias',
    accent: 'muted',
    note: { text: 'sin coincidencia no significa benigno', delay: 36 },
  },
];

/** The same alert on a low-value asset: it stays BAJA. */
export const GHOST = {
  title: 'Mismo aviso',
  kind: 'Conexión saliente',
  host: 'ptl-pruebas-02',
  dest: '198.51.100.23 · 443/tcp',
  asset: 'portátil de pruebas',
} as const;
