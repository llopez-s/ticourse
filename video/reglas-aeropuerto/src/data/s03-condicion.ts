/**
 * On-screen strings of s03-condicion «La condición decide» (canon: out/scene-brief.md, s03).
 * The rule itself comes from `rules.ts` (YARA_RULE) — never retyped here.
 */

/** Before the rule: the reply to VELVET CICADA, in the narrator's own words (s03-01). */
export const REPLY = {
  common: 'una palabra corriente',
  commonVerdict: 'salta con todos',
  own: 'una que solo lleva su programa',
  ownVerdict: 'puede ir sola',
} as const;

/** The three parts of the rule, each with its exam term (s03-02). */
export const PARTS = {
  meta: { term: 'meta', gloss: 'el contexto' },
  strings: { term: 'strings', gloss: 'las cadenas que busca' },
  condition: { term: 'condition', gloss: 'la que decide' },
} as const;

/** Tags on the strings (s03-03 … s03-05). */
export const TAGS = {
  apiNote: 'está en miles de programas legítimos',
  company: 'de compañía',
  pipe: 'molde propio · aquí, de compañía',
  pipeSub: 'el molde, no el nombre de cada ejecución',
  pdb: 'único',
} as const;

/** The flood of false alerts on the SOC strip (s03-03). Never «alarma». */
export const SOC = { label: 'el SOC', alert: 'aviso' } as const;

/** The condition read as three plain lines (s03-06). */
export const COND_PLAIN = [
  'que sea un ejecutable (empieza por MZ)',
  'que pese menos de 250 KB',
  'o el PDB, que es único y va solo, o dos señales de las otras tres',
] as const;

/** Chapter close (s03-07), the voice's words. */
export const WRAP = ['lo corriente pide compañía', 'lo único puede ir solo'] as const;
