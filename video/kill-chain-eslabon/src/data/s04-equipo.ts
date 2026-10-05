/**
 * s04-equipo «Dentro del equipo» — on-screen strings (canon: out/scene-brief.md «Canon»). The EDR lines live in
 * `scenes/parts/LessonLog.tsx`; the observed times in its `OBSERVED`. The beacon line carries NO phase name until `c2`
 * (the think prompt «Ese beacon, ¿C2 o Actions on Objectives?» comes with the beacon line alone).
 */

/** Glosses under the phase entrances (the names come from KillChain's PHASES). */
export const EXPLOITATION_GLOSS = ['se ejecuta código', 'al abrirlo'] as const;
export const INSTALLATION_GLOSS = ['quedarse'] as const;

/** The only label of the beacon line before the answer. */
export const BEACON_LABEL = 'beacon · cada 60 s';

/** The two columns of the answer: the beacon line falls into the first. */
export const COLUMNS = {
  c2: { head: 'C2:', text: 'el canal que permite la misión' },
  aoo: { head: 'Actions on Objectives:', text: 'leer las carpetas de diseño, comprimirlas, sacarlas' },
} as const;
