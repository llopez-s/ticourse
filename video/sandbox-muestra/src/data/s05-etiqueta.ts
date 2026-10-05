/**
 * s05-etiqueta «Lo que lleva escrito» — the scene's own captions (fictional data, VELVET CICADA canon).
 * The report's static lines (hash, imphash, ssdeep, compile time, PDB path, imports) are builder A's
 * (src/data/report.ts); the strings below are the brief's on-screen wording for s05, exactly.
 */

export const S05_TEXT = {
  /** `garment`: the hash is this exact garment. */
  hash: 'esta prenda exacta · un byte y ya es otra',
  /** `imphash`: the lesson's parenthesis, without the brackets, and what it means. */
  imphashNote: 'comparte tabla de imports con 3 muestras previas',
  family: 'apunta a la familia',
  /** `ssdeep`: the match, as one line. */
  ssdeep: { key: 'ssdeep', rest: ' · 94 % · variante de 2026-01' },
  /** `label` / `pdb`: always «la etiqueta del taller», never «la etiqueta» alone. */
  label: 'la etiqueta del taller',
  notAlways: 'no siempre la lleva',
  /** The rule under the label, on TWO lines (the same two lines as V14). */
  rule: ['si otro programa trae la misma', 'mismo taller · enlace fuerte'],
  /** `date`: compared with nothing. */
  date: 'la pone quien compila · a veces, falsa',
  weak: 'enlace débil',
  /** `close`: the domain, cheap. */
  domain: 'se cambia en un rato',
} as const;

/** Exam terms (violet name entrances), with the storyboard's gloss where it gives one. */
export const S05_NAMES = {
  imphash: { en: 'IMPHASH' },
  ssdeep: { en: 'SSDEEP', gloss: 'fuzzy hashing' },
  pdb: { en: 'PDB PATH' },
} as const;
