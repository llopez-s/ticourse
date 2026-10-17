/**
 * s02-escaneo «Un servidor, dos escaneos» — on-screen strings (canon: out/scene-brief.md). No versions, no numbers of
 * findings, no scanner name, no «banner»: the rows are texture bars with their tag.
 */

export const SERVER_LABEL = 'servidor de las oficinas';

export const OUTSIDE = {
  head: 'Sin cuenta · desde la red',
  seen: ['puertos abiertos', 'lo que anuncia cada servicio'],
  rows: 3,
  tag: 'posible',
  verb: 'deduce',
  term: 'non-credentialed',
} as const;

export const INSIDE = {
  head: 'Con cuenta de escaneo',
  seen: ['lo instalado', 'los parches que faltan'],
  rows: 4,
  tag: 'confirmado',
  verb: 'lee',
  term: 'credentialed',
} as const;

/** The doctor minis under the server (s02-04). */
export const DOCTOR = { door: 'adivina', lab: 'la analítica' } as const;

/** On `monthly`: the port's monthly scan, no date and no scanner name, and the small note under it. */
export const MONTHLY = 'escaneo mensual del puerto · credentialed';
export const PRIVILEGED = 'la cuenta de escaneo es privilegiada · se guarda bien';

/** Phase B: where the scan looks from. */
export const CENTRAL = {
  head: 'desde un servidor central',
  sub: 'solo ve lo encendido y conectado',
  off: 'apagado',
  away: 'fuera',
  term: 'agentless',
} as const;

export const AGENT = {
  head: 'un portátil con agente',
  office: 'oficina',
  away: 'semanas fuera de la oficina',
  badge: 'agente de escaneo',
  sub: 'informa desde donde esté',
  term: 'agent-based',
} as const;
