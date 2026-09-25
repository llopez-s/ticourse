import { random } from 'remotion';
import type { Severity } from '../../../engine/src/ui';

/**
 * S08 "Triaje" — fictitious data only (RFC 5737 external IPs, 10.20.x.x
 * internal, *.puerto-halden.example). Numbers match the narration exactly:
 * 400 alertas/día after tuning; NetFlow 38 GB to 203.0.113.47 between 02:00
 * and 04:30 (≈ 4,2 MB/s × 2 h 30 min ≈ 37,8 GB).
 */

/** Calm, already-tuned queue rows (texture: they dim once the real alert lands). */
export const CALM_ROWS: { severity: Severity; title: string; source: string }[] = [
  { severity: 'MEDIA', title: 'Inicios de sesión fallidos en la VPN', source: 'vpn.puerto-halden.example' },
  { severity: 'BAJA', title: 'Cambio de regla aprobado', source: 'fw-perimetro-01' },
  { severity: 'BAJA', title: 'Certificado próximo a caducar', source: 'portal.puerto-halden.example' },
  { severity: 'MEDIA', title: 'Escaneo de puertos bloqueado', source: '192.0.2.10' },
  { severity: 'BAJA', title: 'Firmas del antivirus actualizadas', source: 'ws-ops-12' },
];

export const ALERT = {
  severity: 'ALTA' as Severity,
  title: 'Volumen saliente inusual',
  host: 'srv-tc-app03',
  hostIp: '10.20.8.31',
  role: 'terminal de contenedores',
};

export const EXFIL = {
  destination: '203.0.113.47:443',
  start: '02:00',
  end: '04:30',
  /** Hours on the 00:00–06:00 axis. */
  startH: 2,
  endH: 4.5,
  rateLabel: '4,2 MB/s',
  rate: 4.2,
  totalGb: 38,
};

/** Axis maximum in MB/s. */
export const NETFLOW_MAX = 5;

/** Daily queue volume since the tuning (14 days, all around 400). */
export const DAILY_VOLUME: number[] = Array.from({ length: 14 }, (_, i) => 400 + (random(`s08-day-${i}`) - 0.5) * 60);

/**
 * Outbound rate of srv-tc-app03 in MB/s, one sample every 5 minutes from
 * 00:00 to 06:00 (73 points). Quiet baseline, then a flat ~4,2 MB/s plateau
 * from 02:00 to 04:30.
 */
export const NETFLOW_SERIES: { h: number; v: number }[] = Array.from({ length: 73 }, (_, i) => {
  const h = i / 12;
  const inPlateau = h >= EXFIL.startH - 1e-6 && h <= EXFIL.endH + 1e-6;
  const noise = random(`s08-flow-${i}`);
  const v = inPlateau ? EXFIL.rate + (noise - 0.5) * 0.14 : 0.16 + noise * 0.26;
  return { h, v };
});
