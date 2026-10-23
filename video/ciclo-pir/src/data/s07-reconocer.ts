/** s07-reconocer «Dos candidatas» — on-screen strings (canon: storyboard goal, exact). Lesson example, not Meridian's case. */
/** A generic double question, only to show «y también» splitting in two; nothing from the lab. */
export const S07_DOUBLE = { a: '¿Qué técnicas usa el actor?', glue: 'y también', b: '¿qué proveedor de correo contratamos?', tags: ['requirement 1', 'requirement 2'] } as const;
export const S07_LABEL = 'Ejemplo de la lección · no es el caso de Meridian';
/** The second pair of the lesson's table (src/data/s1.ts:735-738); B's long sentence is on screen only. */
export const S07_A = 'Tell me about ransomware.';
export const S07_B = ['Which ransomware affiliates exploit internet-facing VPN appliances like ours', ',', ' and which initial-access behaviors should our SOC alert on?'] as const;
export const S07_REVEAL = { good: ['concreta', 'acaba en algo que vigilar', 'se puede responder'], topic: 'un tema, no una pregunta', comma: 'misma pregunta, su consecuencia de detección' } as const;
export const S07_END = { stamp: 'bien formado no es lo mismo que prioritario', who: 'lo valida quien decide' } as const;
