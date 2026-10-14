/**
 * The three attribution levels as the lesson's table gives them (src/data/s4.ts, s4m5 «La escalera de
 * evidencia»), with the storyboard's exact on-screen strings. Index 0 = level 1 = the BOTTOM band of the
 * canvas. Confidences are the lesson's for each KIND of evidence — never a judgment on Meridian's case.
 */
export type LevelDef = {
  /** The question about the painting that opens the band. */
  question: string;
  /** The level's name: the lesson's Spanish name, or the exam term (SPONSOR). */
  name: string;
  /** What the level answers in an attack. */
  sub: string;
  /** The evidence that unlocks it, already cut into lines; `lead` is its heading (then the lines are a list). */
  lead?: string;
  evidence: readonly string[];
  /** A caveat on that evidence (small). */
  note?: string;
  /** Who usually reaches the level (small). */
  reach: string;
  /** Realistic confidence: the word, an optional tail, and how many of three pips it fills. */
  confidence: string;
  caveat?: string;
  pips: 1 | 2 | 3;
};

export const LEVELS: readonly [LevelDef, LevelDef, LevelDef] = [
  {
    question: '¿con qué se hizo?',
    name: 'MÁQUINA / INFRAESTRUCTURA',
    sub: 'qué máquinas y herramientas actuaron',
    evidence: ['tu telemetría,', 'el malware, el C2'],
    reach: 'llega cualquier defensor con visibilidad',
    confidence: 'alta',
    pips: 3,
  },
  {
    question: '¿quién lo pintó?',
    name: 'OPERADOR',
    sub: 'quién tecleó',
    lead: 'errores humanos (opsec):',
    evidence: ['una cuenta personal desde la infraestructura,', 'un alias reutilizado,', 'hábitos propios años seguidos'],
    reach: 'llegan vendors con visibilidad global y años de seguimiento',
    confidence: 'moderada',
    pips: 2,
  },
  {
    question: '¿quién lo encargó y lo pagó?',
    name: 'SPONSOR',
    sub: 'por cuenta de quién',
    evidence: ['dinero, órdenes,', 'registros legales,', 'años de victimología', 'alineada con intereses'],
    note: 'la victimología sola no llega a quién dirige',
    reach: 'llegan gobiernos, o fusión público-privada',
    confidence: 'moderada',
    caveat: ', y solo con fuentes que tu red no tiene',
    pips: 2,
  },
];

/** The word that precedes every confidence value (the storyboard's own: «confianza moderada»). */
export const CONFIDENCE_WORD = 'confianza';
