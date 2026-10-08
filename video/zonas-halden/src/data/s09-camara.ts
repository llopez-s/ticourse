/**
 * s09-camara «La cámara no baja la barrera» — on-screen strings (canon: out/scene-brief.md «Canon strings»).
 * The voice never says «puerto espejo» or «IPS»: they live on screen only (script-notes «El IPS en la voz»).
 * The sensors are network sensors: they sit on the traffic, never inside a zone, and carry no system names.
 */

/** s09-01: the plan adds sensors that receive a copy of the traffic. */
export const SENSORS = {
  chip: 'más sensores',
  copy: 'reciben una copia del tráfico',
  traffic: 'tráfico',
  tap: 'tap',
  mirror: 'puerto espejo',
  sensor: 'sensor',
} as const;

/** s09-02: the fence camera (the voice: «Ve pasar a todos y avisa, pero no baja la barrera»). */
export const CAMERA = {
  title: 'la cámara de la valla',
  sees: 've pasar a todos',
  alerts: 'avisa',
  noBarrier: 'no baja la barrera',
} as const;

/**
 * s09-03: the two axes, exactly «dónde está: inline (el tráfico lo atraviesa) · tap (recibe una copia)» and
 * «qué puede hacer: active (corta, bloquea, reescribe) · passive (mira, registra, avisa)». The left/right
 * descriptions are broken in two lines to fit beside the cross; read in order they are the canon words.
 */
export const AXES = {
  where: 'dónde está',
  what: 'qué puede hacer',
  inline: { name: 'INLINE', desc: ['el tráfico', 'lo atraviesa'] },
  tap: { name: 'TAP', desc: ['recibe', 'una copia'] },
  active: { name: 'ACTIVE', desc: 'corta, bloquea, reescribe' },
  passive: { name: 'PASSIVE', desc: 'mira, registra, avisa' },
} as const;

/** s09-04: the same bad packet, through a tap and through an inline + active device. */
export const DEMO = {
  tapLane: 'TAP · PASSIVE',
  inlineLane: 'INLINE · ACTIVE',
  alert: 'alerta',
  passes: 'sigue su camino',
  dropped: 'descartado',
} as const;

/** s09-05 (screen only): the IPS on a mirror port, its name struck through. */
export const IPS = {
  name: 'IPS',
  port: 'puerto espejo',
  caption: ['un IPS en un puerto espejo no para nada,', 'aunque se llame IPS'],
} as const;

/** s09-06. */
export const BLIND = 'punto ciego · no corta nada';
/** s09-06, as the voice says it («para», not «en»). */
export const ONLY_INLINE = ['el modo de fallo solo se decide', 'para lo que va en línea'] as const;

/** s09-07: the line of the scene (voice), then the plan's stamp. */
export const PUNCH = 'ver no es parar';

/** The stamp, exactly as canon (one string); the scene breaks it into two lines at a « · ». */
export const STAMP = 'plan de zonas · aprobado en el comité de cambios · 20-11 · lo ejecuta Infraestructura (L. Ferrer) · por fases desde el 1-12';
const STAMP_BREAK = ' · lo ejecuta';
/** The stamp's two printed lines: the first ends with « ·» so the separator stays visible. */
export const STAMP_LINES: readonly [string, string] = [
  `${STAMP.slice(0, STAMP.indexOf(STAMP_BREAK))} ·`,
  STAMP.slice(STAMP.indexOf(STAMP_BREAK) + 3),
];
