/**
 * Every on-screen string of V43 that is shared between scenes (or between a scene and the poster). The proposal stamp,
 * the image tag and the question label are the exact strings of the storyboard; nothing here is dated or names a person.
 */

/** s01's stamp. The port's lost-property office is a proposal: nothing is said to work yet, and there is no date. */
export const STAMP = ['Autoridad Portuaria de Halden', 'objetos perdidos', 'propuesta', 'sin fecha'] as const;
/** The compact stamp that keeps the proposal visible in the port's beats (s02, s06). */
export const STAMP_SHORT = ['objetos perdidos', 'propuesta', 'sin fecha'] as const;

export const TITLE = ['Antes, después', 'y a tiempo'] as const;
export const PLAQUE = 'SY0-701 · 5.4';

/** The promise of s01: one chip per chapter; `word` is the voice's word in s01-02 that lights it. */
export const PROMISE = [
  { text: 'antes de lanzarlo', word: 'lanzarlo', icon: 'search' },
  { text: 'mientras funciona', word: 'funciona', icon: 'gear' },
  { text: 'cuánto se guarda', word: 'guarda', icon: 'archive' },
] as const;

/** Labels every everyday image (the cat, the hair salon, the filing cabinet). */
export const IMAGE_TAG = 'imagen · no es del puerto';
/** Drawn by each question scene: the engine's panel only prints «EXAMEN · SY0-701 · 5.4». */
export const QUESTION_TAG = 'pregunta tipo examen · ejemplo';
export const SUPPOSE_TAG = 'supuesto · sin efectos';

/** s02: the five questions the port asks before launching (the voice says three of them), and the four routines after. */
export const BEFORE_QUESTIONS = [
  '¿qué ley aplica?',
  '¿con qué base guardamos el documento?',
  '¿quién lo verá?',
  '¿cuánto se guarda?',
  '¿quién responde?',
] as const;
/** The voice says «revisar quién entra, poner el sistema al día y arreglar lo que salga en las revisiones». */
export const AFTER_ROUTINES = [
  { text: 'revisar quién entra', every: 'cada trimestre' },
  { text: 'poner el sistema al día' },
  { text: 'formar a quien llega al mostrador' },
  { text: 'arreglar lo que salga en la revisión' },
] as const;

/** s04: the consequences of not complying, by who imposes them. */
export interface Consequence {
  term: string;
  gloss: string;
  /** A second, smaller line (on screen only). */
  note?: string;
}
export const FINES: Consequence = { term: 'FINES', gloss: 'dinero' };
export const SANCTIONS: Consequence = { term: 'SANCTIONS', gloss: 'te prohíbe o te limita algo: parar el sistema hasta corregirlo' };
export const LICENSE: Consequence = { term: 'LOSS OF LICENSE', gloss: 'dejas de poder operar', note: 'en un puerto, que ciertos buques no puedan atracar' };
export const CONTRACT: Consequence = { term: 'CONTRACTUAL IMPACTS', gloss: 'una naviera aplica su cláusula: retiene pagos o cancela el contrato' };
export const REPUTATION: Consequence = { term: 'REPUTATIONAL DAMAGE', gloss: 'prensa, clientes, plantilla' };

export const REPORTING = ['reporting interno: dirección y comité', 'externo: reguladores y clientes, con plazo'] as const;

/** s06: the three places where a claimant's data lives, the retention rule and the right to be forgotten. */
export const PLACES = [
  { title: 'el sistema', icon: 'database', word: 'sistema' },
  { title: 'su copia de seguridad', icon: 'archive', word: 'copia' },
  { title: 'el registro de avisos', sub: 'los que se mandan a quien reclama', icon: 'mail', word: 'avisos' },
] as const;
export const CLAIMANT_DATA = ['nombre', 'teléfono', 'documento'] as const;

/** s08: the three rules, with the full text of the storyboard split into lines (the voice says a short version). */
export const RULES = [
  {
    art: 'cat',
    title: 'Antes y después',
    seg: 's08-01',
    lines: [
      'La due diligence es mirar',
      'antes de comprometerte;',
      'la due care, seguir cuidando',
      'después. Hacer bien una',
      'no cubre la otra',
    ],
  },
  {
    art: 'salon',
    title: 'Quién te lo impone',
    seg: 's08-02',
    lines: [
      'Mira quién te lo impone:',
      'la autoridad (fines y sanctions),',
      'quien te habilitó (la licencia),',
      'la otra parte del contrato',
      '(impactos contractuales)',
      'o todo el mundo (la reputación)',
    ],
  },
  {
    art: 'drawer',
    title: 'Inventario y retención',
    seg: 's08-03',
    lines: [
      'Sin inventario no hay retención:',
      'se guarda lo que pide la ley o',
      'justifica el propósito y se borra',
      'lo que sobra, en todas las copias;',
      'si alguien pide que lo borren,',
      'se borra salvo lo que una ley o',
      'un legal hold obliguen a guardar',
    ],
  },
] as const;
export type RuleArt = (typeof RULES)[number]['art'];

/** The exam phrase on `phrase`. */
export const PHRASE = ['Antes, mira. Después, cuida.', 'Y guarda lo que pide la ley o el propósito, ni un día más'] as const;
/** The one next step (the voice says «Y ahora, tu turno, con las preguntas de la lección»). */
export const NEXT = 'Tu turno: las preguntas de la lección';

export const END = {
  /** The video's title, in two lines; the first in cyan. */
  title: ['Mirar antes, cuidar después', 'y borrar a tiempo'],
  objective: 'Security+ SY0-701 · objetivo 5.4',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;
