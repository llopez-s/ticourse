/**
 * s04-vuelve «Un texto que vuelve» — on-screen strings (storyboard `goal`). The search address has no domain; the
 * script (data/echo.ts) is illustrative text, `enviar(...)` does not exist and nothing leaves anywhere: the cookie
 * only «podría» (conditional), the staff only «abrirá» and the script only «ejecutaría» (nothing has run, and every
 * person is a silhouette, not an account). The two names carry what the voice says about each, one line per sentence.
 */
import type { IconName } from '../../../engine/src/ui';

export const BOX2 = { n: '2', text: 'el buscador de citas' } as const;
export const BOX3 = { n: '3', text: 'las observaciones' } as const;

/** The two answers of the pause (s04-02 «¿Quién ejecuta ese script, el servidor o el navegador?»). */
export const ANSWERS = ['servidor', 'navegador'] as const;

/** The person's browser, the page it received and the cookie that «podría» leave (s04-03). */
export const RUN = {
  server: 'servidor',
  text: 'texto',
  browser: ['navegador de', 'quien pulsó el enlace'],
  script: 'script',
  maybe: 'podría',
  external: 'sitio externo',
} as const;

export const XSS = { title: 'CROSS-SITE SCRIPTING', abbr: 'XSS' } as const;

/** What the voice says of REFLECTED (s04-04, s04-05), each line lit on its own word. */
export const REFLECTED = {
  title: 'REFLECTED',
  attrs: [
    { icon: 'link', text: 'viaja en el enlace', seg: 's04-05', word: 'Viaja' },
    { icon: 'cursor', text: 'alguien tiene que pulsarlo', seg: 's04-05', word: 'alguien' },
    { icon: 'mail', text: 'suele ir con phishing', seg: 's04-05', word: 'phishing' },
  ],
  cartel: 'repite lo que preguntas',
} as const satisfies { title: string; attrs: readonly { icon: IconName; text: string; seg: string; word: string }[]; cartel: string };

/** The third box (s04-06, s04-07): the observations, the saved appointment, the day's list. */
export const NOTES = {
  label: ['observaciones para', 'el personal de la puerta'],
  saved: 'cita guardada',
  plate: 'matrícula',
  obs: 'observaciones',
  sim: 'simulación · en la copia de pruebas',
  list: 'Listado del día · puerta',
  staff: 'personal de la puerta',
} as const;

/** The day's list: fictitious plates; the second row is the one saved above. */
export const LIST = [
  { plate: '1932 TRP', note: '' },
  { plate: '4821 KLM', note: 'script' },
  { plate: '7740 DFN', note: '' },
  { plate: '0516 PXL', note: '' },
] as const;

/** What the voice says of STORED (s04-08). */
export const STORED = {
  title: 'STORED',
  attrs: [
    { icon: 'database', text: 'queda guardado en el servidor', seg: 's04-08', word: 'guardado' },
    { icon: 'users', text: 'salta para todo el que abra la página', seg: 's04-08', word: 'salta' },
  ],
  tablon: 'se clava lo que otro lee',
} as const satisfies { title: string; attrs: readonly { icon: IconName; text: string; seg: string; word: string }[]; tablon: string };
