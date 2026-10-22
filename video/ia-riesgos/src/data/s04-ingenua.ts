/** s04-ingenua «Por qué no basta»: scene-only text. Nothing here is an attack text. */

/** The three reasons, one card each. */
export const REASONS = [
  {
    title: 'el mismo canal',
    /** Two sentences facing each other: shown as labelled gray bars. */
    left: 'defensa',
    right: 'ataque',
    versus: 'frase contra frase',
  },
  {
    title: 'se rodea',
    /** The same sentence, rephrased, translated and split: labels only. */
    variants: ['reformulada', 'traducida', 'partida'],
    blocked: 'lista de frases prohibidas',
  },
  {
    title: 'el 1 %',
    tally: '99 de cada 100',
    fail: 'la que falla',
    reads: 'lo lee todo',
    out: 'lo saca fuera',
  },
] as const;

/** The closing line (`hope`). */
export const HOPE = {
  not: 'un control',
  is: 'una esperanza',
  lead: 'si depende de que el modelo se porte bien:',
} as const;
