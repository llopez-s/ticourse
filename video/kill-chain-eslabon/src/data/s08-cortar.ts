/**
 * s08-cortar «Lo primero que cortas» — on-screen strings (canon: out/scene-brief.md «Canon»; s2m1q7,
 * `src/data/s2.ts:200-213`, and the check of `:101-115`). The two zones carry no position label until the answer:
 * «en la red · antes del equipo» lands with s08-03 (no cue: synced with `wordFrame`). The 5-3 card of `today` is the
 * shared AlertCard (compact), with no success / blocked mark; «por lo que ves» (never «en lo que tienes»).
 */
export const ZONES = { gateway: 'pasarela de correo', host: 'estación de ingeniería' } as const;

/** The answer's label under the gateway (s08-03 «La entrega pasa antes, en la pasarela, que es un control de red»). */
export const NETWORK = 'en la red · antes del equipo';

/** `later` (s08-05): the cuts that also work, further on — grey. */
export const LATER = {
  items: ['borrar el programa', 'cortar el beacon'],
  note: 'también sirven, pero ya ha avanzado más',
} as const;

/** `today` (s08-06): the alert over the phase row; the marker sits on Command & Control. */
export const TODAY = 'por lo que ves, la séptima no aparece';
