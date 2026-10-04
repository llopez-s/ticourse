import type { EvId } from './matrix';

/** On-screen strings of s06-diagnosticidad (canon: the lesson's contrast, s4m3 callout «Diagnosticidad»). */
export const S06_TEXT = {
  /** The name the voice says first, then the exam term. */
  termEs: 'diagnosticidad',
  termEn: 'DIAGNOSTICITY',
  /** The lesson's contrast, one line per row (E1 nula, E2 alta). */
  contrast: [
    { ev: 'E1' as EvId, text: 'usa phishing: vale para las tres' },
    { ev: 'E2' as EvId, text: 'nada de cobrar en seis meses: choca con el dinero' },
  ],
} as const;
