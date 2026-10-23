import { C } from '../../../engine/src/theme/tokens';

/**
 * On-screen text and colours of «Niveles de CTI y la Sliding Scale» (G02, lesson s1m3).
 * Table cells are the lesson's exact strings (src/data/s1.ts, s1m3); nothing here is a dated fact,
 * a domain, an IP or a hash. Colour meaning in this video:
 *   cyan    tactical (data: indicators, rules)       and the SOC's envelope
 *   amber   operational                               (and the noise of the 4.000 list)
 *   emerald strategic (decisions)                     and the board's envelope
 *   rose    the adversary (EMBER FOX) and the failed delivery
 */

/** The same strip as V22, V23 and V27: no date, no hour, no alert. */
export const CONTEXT = ['Meridian Dynamics', 'aeroespacial', 'tú, su analista de inteligencia'] as const;

export const TONE = {
  tactical: C.cyan,
  operational: C.amber,
  strategic: C.emerald,
} as const;

export type EnvelopeId = 'board' | 'soc';

export const ENVELOPES = {
  board: {
    label: 'consejo',
    ask: '¿hacia dónde va el sector?',
    askLines: ['¿hacia dónde va', 'el sector?'] as const,
    small: '¿dónde invertimos?',
    /** What the analyst prepares for the board (s05). */
    product: 'evaluación de tendencias del sector',
    tone: TONE.strategic,
  },
  soc: {
    label: 'SOC',
    ask: '¿qué bloqueamos hoy?',
    askLines: ['¿qué bloqueamos', 'hoy?'] as const,
    small: undefined,
    product: 'indicadores y reglas de detección',
    tone: TONE.tactical,
  },
} as const;

export const S01_TITLE = {
  main: ['Niveles de CTI y', 'la Sliding Scale'] as const,
  sub: ['el producto correcto', 'para la persona correcta'] as const,
} as const;

/** Promise chips; `word` is the spoken word that lights each one (s01-02). */
export const PROMISE = [
  { text: 'los tres niveles', word: 'niveles', icon: 'layers' },
  { text: 'la escala de la seguridad', word: 'escala', icon: 'chart' },
  { text: 'por qué no empezar por el tejado', word: 'tejado', icon: 'alert' },
] as const;

export const CLUB_LABEL = 'la inteligencia es para alguien';

/** The football club: one vignette per level. */
export const VIGNETTES = [
  { level: 'tactical', who: 'El jugador', line: 'necesita la jugada de ahora', tone: TONE.tactical },
  { level: 'operational', who: 'El entrenador', line: 'estudia al rival toda la semana', tone: TONE.operational },
  { level: 'strategic', who: 'La directiva', line: 'decide en qué invertir los próximos años', tone: TONE.strategic },
] as const;

export const TABLE_HEAD = ['Nivel', 'Audiencia', 'Pregunta típica', 'Productos', 'Horizonte'] as const;

/** The lesson's table, verbatim (src/data/s1.ts, s1m3). */
export const TABLE = [
  {
    level: 'Tactical',
    audience: 'SOC, detección, IR',
    question: '¿Qué bloqueo/detecto hoy?',
    products: 'IOCs, reglas (YARA/Sigma/Snort), feeds',
    horizon: 'Horas–días',
    tone: TONE.tactical,
  },
  {
    level: 'Operational',
    audience: 'Threat hunters, IR leads, CTI peers',
    question: '¿Cómo opera este grupo? ¿Qué campañas hay activas?',
    products: 'Informes de campaña, análisis de TTPs, mapeos ATT&CK',
    horizon: 'Semanas–meses',
    tone: TONE.operational,
  },
  {
    level: 'Strategic',
    audience: 'CISO, dirección, board',
    question: '¿Dónde invertimos? ¿Qué riesgo aceptamos?',
    products: 'Assessments, tendencias, panorama de amenazas',
    horizon: 'Meses–años',
    tone: TONE.strategic,
  },
] as const;

export const LENS = 'el nivel lo marca quién lee, qué decide y para cuándo';

// ---------------------------------------------------------------------------------------------
// s03 «Si se cruzan los sobres»

export const HYPOTHETICAL = 'Ejemplo hipotético · no ha pasado en Meridian';

/** The adversary's card (same wording in G01 and G03). */
export const FOX_CARD = { name: 'EMBER FOX', role: 'célula de acceso inicial', does: 'spearphishing' } as const;

export const S03 = {
  boardQuestions: ['¿dónde invertimos?', '¿qué riesgo aceptamos?'] as const,
  trends: 'evaluación de tendencias del sector',
  socQuestion: '¿qué bloqueamos hoy?',
  counter: '4.000 IP',
  error: 'EL ERROR CLÁSICO',
  errorLine: 'darle a cada uno lo del otro',
  rule: ['producto correcto', 'audiencia correcta'] as const,
  ruleSub: 'mira quién lo va a leer',
} as const;

// ---------------------------------------------------------------------------------------------
// s04 / s05 — the Sliding Scale

export const SCALE_HEAD = { main: 'Sliding Scale of Cyber Security', sub: 'ordena las inversiones de seguridad' } as const;

export const SCALE_ARROW = 'base con mejor retorno a la izquierda · lo de la derecha rinde si lo anterior existe';

/** The five stops. `detail` are the lesson's own words (src/data/s1.ts, s1m3 list). */
export const STOPS = [
  {
    id: 'arch',
    name: 'Architecture',
    lines: ['Architecture'] as const,
    detail: ['sistemas defendibles', 'segmentación', 'hardening', 'parcheo'] as const,
    tone: C.sky,
  },
  {
    id: 'passive',
    name: 'Passive Defense',
    lines: ['Passive', 'Defense'] as const,
    detail: ['protección sin operador en el bucle', 'firewalls, filtrado'] as const,
    tone: C.sky,
  },
  {
    id: 'active',
    name: 'Active Defense',
    lines: ['Active', 'Defense'] as const,
    detail: ['analistas en el bucle', 'monitorización', 'threat hunting', 'respuesta a incidentes'] as const,
    tone: C.sky,
  },
  {
    id: 'intel',
    name: 'Intelligence',
    lines: ['Intelligence'] as const,
    detail: ['consumir y producir conocimiento del adversario para informar al resto'] as const,
    tone: C.cyan,
  },
  {
    id: 'offense',
    name: 'Offense',
    lines: ['Offense'] as const,
    detail: ['acciones legales de respuesta contra el adversario', 'terreno casi exclusivo de estados'] as const,
    tone: C.muted,
  },
] as const;

export const INTEL_EXAMPLE = 'informes de actor';

export const CLASSIFY = {
  card: 'EDR que bloquea malware conocido sin que nadie intervenga',
  cardLines: ['EDR que bloquea malware', 'conocido sin que nadie intervenga'] as const,
  answerTag: 'firewalls, EDR/AV, filtrado',
  answerQuestion: '¿hay una persona al mando?',
} as const;

export const S05 = {
  multiplies: ['Intelligence multiplica el valor', 'de las demás, no las sustituye'] as const,
  left: 'base, mejor retorno',
  right: 'solo rinde si la base existe',
  rightLines: ['solo rinde si', 'la base existe'] as const,
  roof: 'sin base defendible, nadie lo aplica',
  report: 'informe de inteligencia',
  /** The lesson's «La inteligencia habilita a otros equipos» list. */
  enables: [
    { name: 'SOC', sub: 'priorización de alertas con contexto de actor y campaña' },
    { name: 'IR', sub: 'saber quién probablemente es y qué hará cambia la contención' },
    { name: 'Gestión de vulnerabilidades', sub: 'priorizar los CVEs que las amenazas reales explotan' },
    { name: 'Red team', sub: 'emulación de adversarios basada en TTPs observados' },
    { name: 'Dirección', sub: 'decisiones de inversión y riesgo basadas en el panorama real' },
  ],
} as const;

// ---------------------------------------------------------------------------------------------
// s06 — recap

export const S06_NEXT = 'Tu turno: las preguntas de la lección';
export const S06_NEXT_SUB = 's1m3 · 6 preguntas';

export const S06_END = {
  title: 'Niveles de CTI',
  sub: 'y la Sliding Scale',
  tagline: 'el producto correcto para la persona correcta',
  objective: 'GIAC GCTI · Requirements',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a SANS/GIAC.',
} as const;
