/**
 * s06-recap «Tres reglas» — on-screen strings (storyboard `goal`). One card per rule, in the order the voice says
 * them; each sub line lights on its own word (`word`, in the rule's segment `seg`; `nth` picks a repeated word).
 * Words in capitals are exam terms (violet). Titles are two hard lines of at most 15 characters. The third rule carries
 * the storyboard's text, «parameterized queries en la consulta · output encoding en la página», as two wrapped
 * blocks; its words are not spoken in that segment, so they light on «junta» and «código».
 */
export type RuleArt = 'form' | 'board' | 'case';

export interface RecapLine {
  /** Text; a block that wraps is drawn with `wrap`. */
  text: string;
  word: string;
  nth?: number;
  strong?: boolean;
  /** The line may wrap inside the card (storyboard text that is longer than one line). */
  wrap?: boolean;
}

export interface RecapRule {
  art: RuleArt;
  seg: string;
  title: readonly [string, string];
  sub: readonly RecapLine[];
}

export const RULES: readonly RecapRule[] = [
  // «Un texto dentro de la consulta es SQL injection. Se arregla mandándolo aparte, con parameterized queries.»
  {
    art: 'form',
    seg: 's06-01',
    title: ['Texto en la', 'consulta'],
    sub: [
      { text: 'es SQL INJECTION', word: 'injection', strong: true },
      { text: 'se manda aparte', word: 'aparte' },
      { text: 'PARAMETERIZED QUERIES', word: 'parameterized' },
    ],
  },
  // «Un script que corre en otro navegador es XSS, reflected si viaja en el enlace y stored si se guarda.»
  {
    art: 'board',
    seg: 's06-02',
    title: ['Script en otro', 'navegador'],
    sub: [
      { text: 'es XSS', word: 'XSS', strong: true },
      { text: 'REFLECTED · en el enlace', word: 'reflected' },
      { text: 'STORED · se guarda', word: 'stored' },
    ],
  },
  // «La defensa va donde el dato se junta con el código, y cifrar la base no lo arregla. En el examen, input validation, o su versión específica.»
  {
    art: 'case',
    seg: 's06-03',
    title: ['La defensa va', 'donde se juntan'],
    sub: [
      { text: 'parameterized queries en la consulta', word: 'junta', strong: true, wrap: true },
      { text: 'output encoding en la página', word: 'código', wrap: true },
    ],
  },
];

/** The one next step (s06-04 «Termina tú la lección y sus preguntas»), as the end card's «Tu turno». */
export const NEXT = 'Tu turno: termina la lección y sus preguntas';

export const END = {
  title: ['SQL injection y XSS:', 'cuando un texto se vuelve orden'],
  /** The remate (s06-04 «Cada dato, en su sitio»), exactly so. */
  remate: 'Cada dato, en su sitio',
  objective: 'Security+ SY0-701 · objetivo 2.3',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;
