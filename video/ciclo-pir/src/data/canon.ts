/**
 * On-screen strings shared by several scenes (canon: out/scene-brief.md, storyboard goals). Everything here is
 * wording the course or the storyboard already fixes; nothing is a new fact about the campaign.
 */

/** V22/V23's frame: Meridian's labels. */
export const WHERE = { org: 'Meridian Dynamics', sector: 'aeroespacial', you: 'tú, su analista de inteligencia' } as const;

/** The CISO's card (V23: «CISO · responsable de seguridad», no name, no face). */
export const CISO_WHO = { term: 'CISO', role: 'responsable de seguridad' } as const;
/** The task the CISO sends (s1m5's VELVET CICADA block, with tuteo). */
export const CISO_ASK = 'Propónme nuestros primeros PIRs';

/** EMBER FOX's card (course-gcti.ts:17-19): the same one G01 and G02 draw. */
export const EMBER = { name: 'EMBER FOX', role: 'célula de acceso inicial', does: 'spearphishing' } as const;

/** The twelve feeds of s03 and s08: only numbered, never named. */
export const FEED_COUNT = 12;
