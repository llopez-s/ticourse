/**
 * s02-dentro «Todos con chaleco» — on-screen strings (canon: out/scene-brief.md «Canon»).
 *
 * The rule card's own strings (and its reading «chaleco de Operaciones: pasa») live with its drawing,
 * scenes/parts/RuleCard.tsx. Standalone lines keep the storyboard's lower case except for their first
 * letter. The stolen credential and the compromised laptop carry no hostname, e-mail, document or macro,
 * and nothing here belongs to NULL CIPHER: its message is the engine's card.
 */

/** s02-01: the vest is the port's; it opens nothing. */
export const VEST = { opens: 'El chaleco no debería abrir nada', says: 'solo dice que estás dentro' } as const;

/**
 * The three who reach the same rule (s02-02), in the voice's order. `word` is the word of s02-02 the
 * label waits for; `smallWord` the one for its second, smaller line.
 */
export const WALKERS: { id: 'worker' | 'stolen' | 'laptop'; lines: [string, string]; small?: string; word: string; smallWord?: string }[] = [
  { id: 'worker', lines: ['quien trabaja', 'allí'], word: 'trabaja' },
  { id: 'stolen', lines: ['una credencial', 'robada'], small: 'usada desde dentro', word: 'credencial', smallWord: 'desde' },
  { id: 'laptop', lines: ['un portátil', 'comprometido'], word: 'portátil' },
];

/** s02-03, the answer to the intercepted message: «haber pasado el control solo dice que está dentro» / «de si es de fiar, no dice nada». */
export const ANSWER = {
  passed: ['Haber pasado el control', 'solo dice que está dentro'],
  trust: 'de si es de fiar, no dice nada',
} as const;

/** s02-04, the lesson's row: where access is decided. */
export const MODELS = {
  perimeter: { head: 'Perímetro', lines: ['se decide una vez, en la entrada'] },
  zeroTrust: { head: 'Zero Trust', lines: ['se decide en cada petición,', 'venga de donde venga'] },
} as const;

/** s02-05: the name and its motto (exam terms, kept in English); each half lights on its word. */
export const NAME = {
  term: 'ZERO TRUST',
  motto: [
    { text: 'never trust,', word: 'never' },
    { text: 'always verify', word: 'always' },
  ],
} as const;
