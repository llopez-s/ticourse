import type { IconName, Tone } from '../../../engine/src/ui';

/** s01-hook: scene-only text (canon: out/scene-brief.md). `word` is where the narration says it. */

/** The problem: Lucía's laptop spent the night isolated, and still 38 GB left the port. */
export const HOOK_HOST = { host: 'OPS-WS-14', role: 'portátil de Lucía' } as const;
export const ISOLATED_TAG = 'aislado toda la noche';
export const LEAK = { gb: 38, unit: 'GB', caption: 'han salido del puerto', when: 'de madrugada' } as const;
export const PORT_NAME = 'Autoridad Portuaria de Halden';

/** The title and the promise (s01-02). */
export const TITLE = { lead: 'Respuesta a', accent: 'incidentes' } as const;
export const PROMISE = [
  { text: 'Llevar un incidente entero', word: 'llevar' },
  { text: 'y saber cuándo cerrar cada fase', word: 'saber' },
] as const;

/** The catch-up strip of the night (s01-03, s01-04). */
export const NIGHT_HEADER = 'La noche del 3 al 4 de septiembre';

/** One line of a night card. `seg` + `word` = when it appears. */
export type NightLine =
  | { kind: 'title'; text: string; icon: IconName; tone: Tone; seg: string; word: string }
  | { kind: 'mono'; text: string; icon?: IconName; tone: Tone; seg: string; word: string; size?: number }
  | { kind: 'sub'; text: string; seg: string; word: string }
  | { kind: 'chip'; text: string; icon: IconName; accent: 'emerald' | 'cyan' | 'rose' | 'amber'; seg: string; word: string }
  | { kind: 'big'; text: string; unit: string; seg: string; word: string };

export interface NightEvent {
  time: string;
  /** Word-like times («3-9 · tarde») are drawn in sans, clock times in mono. */
  sans?: boolean;
  tone: Tone;
  icon: IconName;
  /** When the node lights: the segment and the word. */
  seg: string;
  word: string;
  lines: NightLine[];
}

export const NIGHT: NightEvent[] = [
  {
    time: '3-9 · tarde',
    sans: true,
    tone: 'amber',
    icon: 'mail',
    seg: 's01-03',
    word: 'tarde,',
    lines: [
      { kind: 'title', text: 'correo trampa', icon: 'mail', tone: 'amber', seg: 's01-03', word: 'correo' },
      { kind: 'sub', text: 'el portátil habla', seg: 's01-03', word: 'hablar' },
      { kind: 'sub', text: 'con la atacante', seg: 's01-03', word: 'hablar' },
    ],
  },
  {
    time: '16:11',
    tone: 'cyan',
    icon: 'lock',
    seg: 's01-03',
    word: 'aislaron',
    lines: [
      { kind: 'mono', text: 'OPS-WS-14', icon: 'laptop', tone: 'cyan', seg: 's01-03', word: 'aislaron' },
      { kind: 'sub', text: 'aislado de la red', seg: 's01-03', word: 'red' },
      { kind: 'chip', text: 'encendido', icon: 'power', accent: 'emerald', seg: 's01-03', word: 'apagarlo.' },
    ],
  },
  {
    time: '01:52',
    tone: 'rose',
    icon: 'key',
    seg: 's01-04',
    word: '01:52',
    lines: [
      { kind: 'mono', text: 'svc_tosreport', icon: 'key', tone: 'amber', seg: 's01-04', word: 'cuenta', size: 36 },
      { kind: 'mono', text: 'en srv-tc-app03', icon: 'server', tone: 'sky', seg: 's01-04', word: 'servidor', size: 32 },
      { kind: 'sub', text: 'de la terminal', seg: 's01-04', word: 'terminal' },
      { kind: 'sub', text: 'de contenedores', seg: 's01-04', word: 'terminal' },
    ],
  },
  {
    time: '02:00–04:30',
    tone: 'rose',
    icon: 'globe',
    seg: 's01-04',
    word: 'salieron',
    lines: [
      { kind: 'big', text: '38', unit: 'GB', seg: 's01-04', word: 'salieron' },
      { kind: 'mono', text: 'hacia 203.0.113.47', tone: 'rose', seg: 's01-04', word: 'datos.', size: 30 },
    ],
  },
];

/** The crisis room at noon (s01-05). */
export const CRISIS = { date: '4-9', time: '12:00', room: 'sala de crisis' } as const;

/** s01-06: the question over the board's silhouette. */
export const QUESTION = '¿cerradas de verdad?';
