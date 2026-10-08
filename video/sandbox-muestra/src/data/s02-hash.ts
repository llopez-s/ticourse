/** s02 «Antes de abrirla»: on-screen text (canon: out/scene-brief.md, «Canon strings» → s02). */

/** The public analysis service: generic, no brand (nothing like a real service's logo, colours or detection ratio). */
export const SERVICE = {
  title: 'servicio público · decenas de antivirus',
  upload: 'Subir muestra',
} as const;

/** `reply`: the eye beside the button and the chain. */
export const REPLY = {
  eye: 'también puede mirar el atacante',
  chain: ['si la ve', 'puede saber que lo has descubierto', 'cambia de dominios'] as const,
} as const;

/**
 * The odd car in your street. The plate is NOT a real-format number plate: it is the sample's short hash in V3's
 * spelling, upper case. The search of `lookup` uses the lesson's spelling (`9f3a2c...e1`): same sample, never unify.
 */
export const CAR = {
  plate: '9F3A...E1',
  notebook: 'la buscas tú, en silencio',
  note: 'te he visto',
} as const;

/** `lookup` / `no-hits`. */
export const LOOKUP = {
  verb: 'buscar',
  hash: '9f3a2c...e1',
  chip: 'no sube el fichero',
  result: 'sin resultados',
  also: 'y lo que se sube, otros lo pueden descargar',
} as const;

/** `own-sandbox`: the CMF row «Sandbox interno» (src/data/s3.ts:72). */
export const OWN_SANDBOX = {
  title: 'sandbox interno de Meridian',
  sub: 'máquina aislada, de usar y tirar',
} as const;
