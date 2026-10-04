/**
 * On-screen strings of s09-informe. The four memo lines, the stamp and the two
 * strips are canon (scene brief «Canon strings»); each memo line is stored
 * whole and drawn as label + value broken into lines — the break is checked
 * below so the joined text stays exact.
 */

export interface MemoLine {
  /** The canon line, exactly. */
  text: string;
  /** Label column (bold). */
  label: string;
  /** Value, broken into display lines. `${label} ${lines.join(' ')}` must equal `text`. */
  lines: readonly string[];
}

export const MEMO_LINES: readonly MemoLine[] = [
  {
    text: 'Juicio: H1, la menos inconsistente (extracto de 4 pruebas)',
    label: 'Juicio:',
    lines: ['H1, la menos inconsistente', '(extracto de 4 pruebas)'],
  },
  {
    text: 'Confianza: moderada · 4 pruebas de un extracto; aguanta sin E4',
    label: 'Confianza:',
    lines: ['moderada · 4 pruebas de un extracto;', 'aguanta sin E4'],
  },
  {
    text: 'Descartadas: H2 (E2, E3, E4) · H3 (E3, E4)',
    label: 'Descartadas:',
    lines: ['H2 (E2, E3, E4) · H3 (E3, E4)'],
  },
  { text: 'Vigilar: E4', label: 'Vigilar:', lines: ['E4'] },
];

export const S09_TEXT = {
  /** Memo kicker. «Para el CISO» is invented furniture (the voice: «Ya puedes escribirle al CISO»); «Meridian Dynamics» is canon. */
  kicker: 'Para el CISO · Meridian Dynamics',
  /** Memo title: the CISO's question from s01 (canon), which the memo answers. */
  title: '¿Qué busca el intruso?',
  stamp: 'provisional',
  strips: {
    confidence: 'cómo se dice la confianza: s5m2',
    lab: 'la matriz completa, en el Lab 4B',
  },
} as const;

// Fail loudly at bundle time if a display break changes the canon text.
for (const m of MEMO_LINES) {
  if (`${m.label} ${m.lines.join(' ')}` !== m.text) throw new Error(`data/s09-informe.ts: memo line does not rebuild «${m.text}»`);
}
