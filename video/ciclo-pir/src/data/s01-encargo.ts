import { CISO_ASK } from './canon';

/** s01-encargo «Un encargo de una frase» — on-screen strings (canon: storyboard goal, exact). */
export const S01_ASK = CISO_ASK;

export const S01_TITLE = { lead: 'Antes de recoger nada:', rest: 'la pregunta', sub: 'el ciclo de inteligencia y los PIRs', def: ['PIR', 'una de las pocas preguntas cuya respuesta cambia una decisión'] } as const;

/** The promise as three rows; `word` is the narration word each lights on (null: not voiced, lit between its neighbours). */
export const S01_PROMISE = [
  { text: 'las seis fases y dónde falla cada una', word: 'seis', icon: 'layers' },
  { text: 'el ciclo rápido de los incidentes', word: null, icon: 'bolt' },
  { text: 'cómo se escribe un buen PIR', word: 'cómo', icon: 'target' },
] as const;

/** Two small notes, ideas of the lesson (s1m5's story block) and nothing more. */
export const S01_WORRY = [
  { text: 'rumores de robo de diseños en el sector', word: 'rumores' },
  { text: 'consejo: inquieto', word: 'consejo' },
] as const;
