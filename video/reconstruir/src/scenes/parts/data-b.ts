/**
 * On-screen strings of s07 to s12 (half B). Identifiers come from `data.ts`; only the wording that is new in these
 * scenes lives here. No arrow characters, no dates, no new identifiers.
 */
import { PROGRAM, UPLOAD_SITE_IP } from './data';

// ---- s07: the three threads.
export const THREAD_HOST = 'equipo';
export const THREAD_USER = 'cuenta';
export const THREAD_LABEL = 'origen y destino';
export const PORT_CALLOUT = { title: 'puerto efímero', lines: ['un número temporal', 'por conversación'] } as const;
export const SAME_CALLOUT = { lead: 'la misma conexión', then: 'la abrió', tail: 'y no otro' } as const;
export const CORRELATE = 'correlacionar: unir fuentes por lo que comparten';
export const QUESTION_LINES = ['¿hablan de lo mismo?', 'campos que coinciden'] as const;
export const GAP_SECONDS = '7 s';
export const CLOCK_RULE = { ok: 'segundos: habitual', check: 'minutos u horas enteras: revisa reloj o zona' } as const;

// ---- s08/s09/s11: the three columns and the two hypotheses.
export const COLUMN_NAMES = ['observado', 'hipótesis', 'conclusión'] as const;
export const NOT_YET = 'todavía no';
export const HYPOTHESES = [
  { id: 'H1', text: 'tras el bloqueo, subió el archivo por otra vía' },
  { id: 'H2', text: 'es la sincronización autorizada de Comercial, la de cada día' },
] as const;

/** Short facts for the narrow «observado» column (same facts as the chronology, wording kept). */
export const OBSERVED_NOTE = 'tal cual, sin añadir nada';

// ---- s09
export const ALLOW_MEANING = 'decisión de paso';
export const BYTES_MEANING = 'cuánto, no qué';
export const GAPS = [
  { id: 'gap1', text: `¿qué es ${PROGRAM} y está autorizado?` },
  { id: 'gap2', text: `¿de quién es ${UPLOAD_SITE_IP}?` },
  { id: 'gap3', text: '¿qué archivos leyó antes?' },
] as const;

// ---- s10
export const PATH_LABELS = {
  blocked: '403 BLOQUEADO',
  allowed: 'ALLOW',
  finding: '¿sale sin proxy?',
  findingTail: 'a comprobar',
  witnessCaption: 'imagen · no es del puerto',
  notThrough: 'por aquí no salió',
  close: ['ni el bloqueo te tranquiliza', 'ni el permitido te condena'],
} as const;

// ---- s11: the report, in the three beats the voice gives it.
export const REPORT = [
  'Hubo un intento de subida bloqueado por el proxy.',
  'Poco más de un minuto después, desde el mismo equipo y con la misma cuenta, un programa abrió una conexión hacia una dirección externa que el proxy no registra, según el EDR y el cortafuegos.',
  'El cortafuegos la permitió, con unos cuarenta y seis megas de salida. El contenido no se conoce.',
] as const;
export const NEXT_STEPS_TITLE = 'siguientes pasos';
export const NEXT_STEPS = [
  'identificar el programa y el destino',
  'revisar qué archivos se leyeron',
  'comprobar si ese equipo puede salir sin proxy',
] as const;
export const STRUCK = ['no ha pasado nada', 'nos han robado'] as const;
export const HAS_AND_LACKS = 'lo que hay, y lo que falta';

// ---- s12: the three rules and the end card.
export const RULES = [
  { title: ['Un testigo', 'de su sitio'] as const, sub: ['lo que falta', 'no es un no'] as const },
  { title: ['Todo a UTC'] as const, sub: ['con la hora original', 'al lado, en gris'] as const },
  {
    title: ['Lo que ves', 'y lo que crees'] as const,
    sub: ['un bloqueo no descarta', 'otras vías; un permitido', 'no demuestra una fuga'] as const,
  },
] as const;
export const END = {
  title: ['Cómo reconstruir', 'lo ocurrido'] as const,
  button: 'Práctica · Cronología y límites',
  objective: 'Security+ SY0-701 · objetivos 4.8 y 4.9',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;
