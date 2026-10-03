/**
 * s04-grafo «Un pósit o un contacto»: on-screen text (canon: out/scene-brief.md).
 * Strings that do not fit one line are broken only at a « · » (word order kept).
 */

/** «¿y si aparece en tus registros?», two lines above the post-it. */
export const S04_QUESTION = ['¿y si aparece', 'en tus registros?'] as const;

export const S04_DOMAIN = 'cdn-sync-status.example';

/** Graph nodes: «indicator · cdn-sync-status.example», «malware · loader GLASS VIPER», «intrusion-set · VELVET CICADA». */
export const S04_NODES = {
  indicator: { kind: 'indicator', name: 'cdn-sync-status.example' },
  malware: { kind: 'malware', name: 'loader GLASS VIPER' },
  intrusionSet: { kind: 'intrusion-set', name: 'VELVET CICADA' },
} as const;

/** Relationship types on the edges (indicator indicates malware; intrusion-set uses malware). */
export const S04_EDGES = { indicates: 'indicates', uses: 'uses' } as const;

/** «si aparece en un equipo: busca allí el loader» (two lines, broken after the colon). */
export const S04_ACTION = ['si aparece en un equipo:', 'busca allí el loader'] as const;

/** «relationship · también es un objeto STIX». */
export const S04_RELATIONSHIP = { kind: 'relationship', text: 'también es un objeto STIX' } as const;

/** Header of the contact's source list (label added for the address-book card). */
export const S04_SOURCES_LABEL = 'fuentes';

/** «incidente propio · correo del 02-03». */
export const S04_OWN_SOURCE = 'incidente propio · correo del 02-03';

/** «ISAC aeroespacial · 11-03 · confianza 70 · AMBER+STRICT · caducado» (three lines; the last = the two amber chips). */
export const S04_ISAC_SOURCE = {
  line: ['ISAC aeroespacial · 11-03', 'confianza 70'] as const,
  marking: 'AMBER+STRICT',
  expired: 'caducado',
} as const;
