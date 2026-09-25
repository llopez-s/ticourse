/**
 * Case facts shown on screen. They must match the lesson (src/data/secplus/
 * sp4-part6.ts, sp4m11: the chain-of-custody form and its integrity check).
 */
export const CASE = {
  id: 'IR-2026-0147',
  evidence: 'HPA-EV-003',
  device: 'SSD 512 GB',
  serial: '8FQ2ZT3',
  laptop: 'Portátil de operaciones',
  place: 'Sala de control · muelle 3',
  blocker: 'WB-04',
  image: 'HPA-EV-003.E01',
  fragments: 12,
  sizeGiB: 476,
  hash: '9f2b7c…41d0',
  /** The broken copy of scene 4 (never in the lesson; it is the counterfactual). */
  badHash: '4e81a0…c92f',
  sealSeizure: '0091',
  sealVault: '0114',
} as const;

export const PEOPLE = {
  seizer: 'M. Aalto',
  seizerRole: 'SOC',
  witness: 'J. Rekola',
  witnessRole: 'Asesoría jurídica',
  lab: 'R. Sandoval',
} as const;

/** The integrity check of the lesson's form (CEST, 4-9-2026). */
export const HASH_ROWS = [
  { key: 'orig-pre', label: 'Original · antes', time: '05:41' },
  { key: 'image', label: 'Datos adquiridos (E01)', time: '07:58' },
  { key: 'orig-post', label: 'Original · después', time: '08:02' },
] as const;

/** The chain-of-custody rows of the lesson's form. */
export const CUSTODY_ROWS = [
  { n: 1, when: '04-09 04:12', from: '(incautación)', to: 'M. Aalto', why: 'Precinto 0091, bolsa antiestática' },
  { n: 2, when: '04-09 05:40', from: 'M. Aalto', to: 'R. Sandoval (Lab)', why: 'Adquisición de la imagen' },
  { n: 3, when: '04-09 09:55', from: 'R. Sandoval', to: 'Caja fuerte SOC', why: 'Custodia, precinto 0114' },
  { n: 4, when: '05-09 11:20', from: 'Caja fuerte SOC', to: 'R. Sandoval', why: 'Análisis (sobre la COPIA)' },
] as const;
