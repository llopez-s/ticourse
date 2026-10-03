/**
 * s05-taxii «La carta y el correo»: on-screen text (canon: out/scene-brief.md).
 * The exam terms (STIX, TAXII) are split out only to colour them.
 */

/** «STIX · qué se cuenta y cómo», under the letter. */
export const S05_STIX = { term: 'STIX', rest: 'qué se cuenta y cómo' } as const;

/** «TAXII · cómo llega», under the envelope. */
export const S05_TAXII = { term: 'TAXII', rest: 'cómo llega' } as const;

/** The letter's date: the STIX `created` (11-03), on the letter, never on the envelope. */
export const S05_LETTER_DATE = '11-03';

/** The sharing mark, printed inside the letter. */
export const S05_MARKING = 'tlp-amber-strict';

/** Labels added for the diagram (canon names only): the ISAC's wall of PO boxes and Meridian's platform. */
export const S05_ISAC = 'ISAC aeroespacial';
export const S05_COLLECTIONS = 'colecciones';
export const S05_MERIDIAN = ['Meridian', 'Dynamics'] as const;

/** «consulta (pull) · 02-07 · primera vez». */
export const S05_PULL = 'consulta (pull) · 02-07 · primera vez';

/** «llega todo lo que había». */
export const S05_BACKLOG = 'llega todo lo que había';

/** «STIX describe · TAXII transporta». */
export const S05_MNEMONIC = { stix: 'STIX', describe: 'describe', taxii: 'TAXII', transports: 'transporta' } as const;

/** «el contexto viaja en la carta · tu plataforma la recoge». */
export const S05_CLOSE = 'el contexto viaja en la carta · tu plataforma la recoge';
