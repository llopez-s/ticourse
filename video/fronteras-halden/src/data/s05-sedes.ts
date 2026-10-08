import { SITES_TEXT } from '../scenes/parts/Sites';

/**
 * s05-sedes «Un pasillo y una lancha» — on-screen strings (canon: out/scene-brief.md, «Canon»).
 * The tunnel between the two sites ALREADY exists: on 25-11 it is being reviewed, never built.
 * Anti-spoiler: no gateway or server names (only «pasarela de la sede» / «pasarela de la terminal»,
 * drawn by Sites), nothing about what each site holds, since when or why they are joined; no VPN host;
 * the person on the launch has no name, area or gender.
 */
export const S05 = {
  /** «25-11 · miércoles · revisión del túnel entre la sede y la terminal». */
  stamp: { day: '25-11', weekday: 'miércoles', what: 'revisión del túnel entre la sede y la terminal' },
  /** The two exam names (s05-07). */
  terms: { site: 'SITE-TO-SITE VPN', remote: 'REMOTE ACCESS VPN' },
  /** The client program on the laptop (the launch's tag says the same). */
  client: SITES_TEXT.client,
} as const;
