/** s02-mapa «El mapa de la recepción» — on-screen strings (canon: out/scene-brief.md; the map's own are in map.ts). */

/** On `none-broken`, two lines under the reception. */
export const NONE_BROKEN = ['ninguna tiene hoy un fallo conocido', 'cuentan las cinco'] as const;

/** On `one` and `all`: the exam term and its plain meaning. */
export const VECTOR = { term: 'Threat vector', plain: 'un camino' } as const;
export const SURFACE = { term: 'Attack surface', plain: 'todos los caminos' } as const;

/** The backpack's labels (the image is tagged «imagen · no es del puerto»). */
export const POCKET_VECTOR = 'el vector';
export const POCKET_SURFACE = 'la superficie: todos';
export const BELL = 'te avisa, pero sigue ahí';
