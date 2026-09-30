import type { IconName, Tone } from '../../../engine/src/ui';

/** s04-key: scene-only text (canon: out/scene-brief.md). `word` is where the narration says it (its `seg`). */

/** s04-01: in the body of the (full) Contención column. */
export const STILL_HARM = 'todavía podía hacer daño';

/** s04-02: the ADM-WS-02 row, zoomed. */
export const NOT_ISOLATED = 'sin aislar';
export const ADM_REASONS: readonly { text: string; icon: IconName; word: string }[] = [
  { text: 'responsable sin localizar', icon: 'user', word: 'localizar' },
  { text: 'nadie de guardia podía autorizarlo', icon: 'users', word: 'autorizarlo.' },
];

/** s04-03 / s04-04: the finding of this morning, a timeline of the night. */
export type TrailLine =
  | { kind: 'host'; text: string; tone: Tone; size?: number; seg: string; word: string }
  | { kind: 'chevron'; seg: string; word: string }
  | { kind: 'mono'; text: string; tone: Tone; size?: number; seg: string; word: string }
  | { kind: 'title'; text: string; icon: IconName; tone: Tone; seg: string; word: string }
  | { kind: 'chip'; text: string; icon: IconName; accent: 'rose' | 'amber' | 'cyan' | 'emerald'; seg: string; word: string }
  | { kind: 'sub'; text: string; seg: string; word: string }
  | { kind: 'big'; text: string; unit: string; seg: string; word: string };

export interface TrailEvent {
  time: string;
  sans?: boolean;
  tone: Tone;
  icon: IconName;
  seg: string;
  word: string;
  /** Optional delay (frames) after the word. */
  after?: number;
  dashed?: boolean;
  lines: TrailLine[];
}

export const TRAIL: readonly TrailEvent[] = [
  {
    time: '21:14',
    tone: 'rose',
    icon: 'link',
    seg: 's04-03',
    word: '21:14,',
    lines: [
      { kind: 'host', text: 'ADM-WS-02', tone: 'amber', size: 34, seg: 's04-03', word: '21:14,' },
      { kind: 'sub', text: 'sesión remota', seg: 's04-03', word: 'desde' },
      { kind: 'chevron', seg: 's04-03', word: 'saltó' },
      { kind: 'host', text: 'ADM-WS-07', tone: 'rose', size: 40, seg: 's04-03', word: 'saltó' },
      { kind: 'mono', text: '10.20.4.17', tone: 'muted', size: 28, seg: 's04-03', word: 'saltó' },
      { kind: 'chip', text: 'sin agente EDR', icon: 'eyeOff', accent: 'rose', seg: 's04-03', word: 'vigilaba.' },
    ],
  },
  {
    time: '01:52',
    tone: 'rose',
    icon: 'key',
    seg: 's04-04',
    word: '01:52,',
    lines: [
      { kind: 'title', text: 'svc_tosreport', icon: 'key', tone: 'amber', seg: 's04-04', word: 'cuenta' },
      { kind: 'mono', text: 'logon 4624', tone: 'muted', size: 30, seg: 's04-04', word: 'cuenta' },
      { kind: 'host', text: 'ADM-WS-07', tone: 'rose', size: 32, seg: 's04-04', word: 'entrar' },
      { kind: 'chevron', seg: 's04-04', word: 'entrar' },
      { kind: 'host', text: 'srv-tc-app03', tone: 'sky', size: 36, seg: 's04-04', word: 'servidor.' },
    ],
  },
  {
    time: '02:00–04:30',
    tone: 'rose',
    icon: 'bell',
    seg: 's04-04',
    word: 'alarma',
    lines: [
      { kind: 'big', text: '38', unit: 'GB', seg: 's04-04', word: 'alarma' },
      { kind: 'mono', text: '203.0.113.47:443', tone: 'rose', size: 30, seg: 's04-04', word: 'alarma' },
      { kind: 'title', text: 'salta la alarma', icon: 'bell', tone: 'amber', seg: 's04-04', word: 'saltó' },
      { kind: 'chip', text: 'nadie la mira', icon: 'eyeOff', accent: 'amber', seg: 's04-04', word: 'nadie' },
    ],
  },
  {
    time: '4-9 · mañana',
    sans: true,
    tone: 'cyan',
    icon: 'search',
    seg: 's04-04',
    word: 'mañana.',
    dashed: true,
    lines: [
      { kind: 'title', text: 'triaje', icon: 'eye', tone: 'cyan', seg: 's04-04', word: 'mañana.' },
      { kind: 'sub', text: 'el hallazgo de hoy', seg: 's04-04', word: 'mañana.' },
    ],
  },
];

/** s04-05: the analogy. */
export const NAVES: readonly { host: string; sub: string; keys?: boolean }[] = [
  { host: 'OPS-WS-14', sub: 'portátil de Lucía' },
  { host: 'OPS-WS-08', sub: 'Operaciones' },
  { host: 'ADM-WS-02', sub: 'donde viven las llaves', keys: true },
];
export const KEY_LABEL = { account: 'svc_tosreport', role: 'cuenta de servicio' } as const;

/** s04-06: the rule. */
export const RULE_HEAD = 'Contener es echar el candado a todo';
export const RULE_SCOPE: readonly { text: string; icon: IconName; word: string }[] = [
  { text: 'los equipos del alcance', icon: 'desktop', word: 'equipos' },
  { text: 'las cuentas que pasan por ellos', icon: 'key', word: 'cuentas' },
];
export const RULE_STEPS: readonly { title: string; sub: string; mono?: boolean; icon: IconName; word: string }[] = [
  { title: 'anular contraseñas', sub: 'como la de svc_tosreport', icon: 'key', word: 'Anulas' },
  { title: 'cortar sesiones', sub: 'las que siguen abiertas', icon: 'unplug', word: 'cortas' },
  { title: 'bloquear su servidor', sub: '203.0.113.47', mono: true, icon: 'firewall', word: 'bloqueas' },
];

/** s04-07: the lesson and the exam term. */
export const LESSON = { a: 'un equipo aislado', not: 'no es', b: 'un incidente contenido' } as const;
export const EXAM_TERM = { tag: 'EN EL EXAMEN', es: 'Contención · fase 4', term: 'containment' } as const;
