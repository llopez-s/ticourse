/**
 * On-screen text of s06-solo-huella «La huella sola no basta» (storyboard goal). The forged
 * offer is a HYPOTHETICAL drawn as such (labelled «ejemplo · así no»); no portal behind it.
 * Its fingerprint is INVENTED and must match nothing in the registry (`b41f0e7c…c7a2`,
 * `9f2b7c…41d0`, `4e81a0…c92f`, `9f3a…e1`, `4c81…b3`) nor the other prints of V11
 * (`e3a1…9c07`, `58bd…f26e`, `a46f…0d3b`, `7c1d…a4b0`, `2f9e…11c3`, `b80a…6d57`).
 */

export const DOUBTS = ['¿es del puerto?', '¿la ha tocado alguien?'] as const;

/** Small tag on the fingerprint stuck to the offer while NULL CIPHER's proposal is up. */
export const ATTACHED = 'hash adjunto';

export const ANYONE = 'cualquiera echa cartas';

/** The frame around the hypothetical (45 characters). */
export const EXAMPLE = 'ejemplo · así no · lo que propone NULL CIPHER';

export const FAKE = {
  label: 'oferta falsa',
  /** The forged offer's own rows (fictional): cheaper berth, bigger discount. */
  rows: [
    { label: 'atraque, por metro', value: '9,90' },
    { label: 'practicaje', value: '8,75' },
    { label: 'bonificación', value: '15 %' },
  ],
  /** Its fingerprint, correctly computed (invented). */
  print: '71c4…d2e8',
  received: 'lo que recibe la naviera',
  recomputed: 'la naviera la comprueba',
  match: 'encaja',
  stamp: 'encaja, y es falsa',
} as const;

export const RULE = { a: 'la huella dice que no cambió', b: 'no dice quién la hizo' } as const;
/** Small, on screen only. */
export const NOTE = 'y cerrarla para la naviera tampoco dice quién la escribió';
