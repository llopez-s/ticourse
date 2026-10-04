/**
 * s03-caducado «Caducado para bloquear» — on-screen strings and the dates of
 * the retention timeline. The pDNS row is s3m4's (`src/data/s3.ts`, the
 * `pdns lookup` block): last seen of the domain on 198.51.100.84. Retention
 * windows are those of Meridian's CMF (EDR 90 days, proxy 30 days) counted
 * back from today, 02-07-2026. No search results are shown.
 */

export const PDNS = {
  title: 'passive DNS · historial',
  domain: 'cdn-sync-status.example',
  ip: '198.51.100.84',
  sep: ' · ',
  lastSeenLead: 'last seen ',
  lastSeen: '2026-04-18 11:31:55',
  nothing: 'nada después',
} as const;

export const RULE = 'si lo ves vivo hoy, manda tu evidencia';

/** Days counted from 27-02-2026 (the domain's registration) to 02-07-2026 (today). */
export const DAYS = {
  total: 125,
  /** 18-04: last seen in passive DNS (end of the seen stretch). */
  seenEnd: 50,
  /** 03-04: first day the EDR still keeps (90 days back from 02-07). */
  edrFrom: 35,
  /** 02-06: first day the proxy still keeps (30 days back from 02-07). */
  proxyFrom: 95,
} as const;

export const RETENTION = {
  start: '27-02',
  startNote: 'registro del dominio',
  seenEnd: '18-04',
  end: '02-07',
  edr: 'EDR · 90 días · desde el 03-04',
  proxy: 'proxy · 30 días · desde el 02-06 · ya no llega',
} as const;

export const RETRO = { term: 'retro-hunt', sep: ' · ', rest: 'hasta donde llegue lo que guardas' } as const;

export const CLOSE = { lead: 'caducado:', a: 'no se bloquea a ciegas', sep: ' · ', b: 'se busca hacia atrás' } as const;
