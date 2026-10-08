// On-screen strings of s06-grupo (out/scene-brief.md «Canon», s06). Owner: builder B3.

/** The answer to s05's question («Dominios distintos, mismo PDB. ¿Los agrupas?»), in the voice's words. */
export const ANSWER = { yes: 'Sí,', rest: 'los agrupas' } as const;

/**
 * The note on what the group becomes (src/data/s2.ts:828): «lo que fuera se llama “APT-X” o intrusion set».
 * Inner quotes “ ” so the guillemets of the brief do not nest. Split so the two names can light on the voice.
 */
export const APT_NOTE = { lead: 'lo que fuera se llama ', apt: '“APT-X”', mid: ' o ', set: 'intrusion set' } as const;
