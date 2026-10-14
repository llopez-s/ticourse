/**
 * s04-enterprise «La clave de todos»: on-screen strings, exactly as the storyboard gives them.
 * The decision stamp's text lives in `scenes/parts/DecisionStamp.tsx` (s05 completes it): the
 * method it gains there is never written in this scene.
 */

/** The shared key, on a sign. */
export const SIGN = {
  network: 'HALDEN-OPS',
  one: 'una clave',
  who: 'toda la terminal',
  since: 'sin cambiar desde 2022',
} as const;

/** The answer to SILENT PAGER's advice, in two lines. */
export const REPLY = ['larga aguanta las pruebas, sí', 'mira quién la sabe'] as const;

/** The image: the stairwell door code that the whole building knows. */
export const KEYPAD_CAPTION = 'el código de la escalera';

/** The example of the lost tablet (it has not happened). */
export const EXAMPLE = {
  label: ['ejemplo', 'sin fecha'],
  logLabel: ['ejemplo', 'sin fecha', 'no es el registro del puerto'],
  lost: 'si una tableta se pierde',
} as const;

export type LogTone = 'plain' | 'soft' | 'emerald' | 'rose';
export interface LogToken {
  t: string;
  tone?: LogTone;
}

/** The RADIUS server's log, four lines (mono). Joined, each line is the storyboard's string. */
export const LOG: readonly (readonly LogToken[])[] = [
  [{ t: 'tableta 07' }, { t: ' · ', tone: 'soft' }, { t: 'certificado válido' }, { t: ' · ', tone: 'soft' }, { t: 'Access-Accept', tone: 'emerald' }],
  [{ t: 'ejemplo: ', tone: 'soft' }, { t: 'certificado de la tableta 07 ' }, { t: 'revocado', tone: 'rose' }],
  [{ t: 'tableta 07' }, { t: ' · ', tone: 'soft' }, { t: 'Access-Reject', tone: 'rose' }],
  [{ t: 'tableta 08' }, { t: ' · ', tone: 'soft' }, { t: 'Access-Accept', tone: 'emerald' }],
];

/** The word on the server box. */
export const SERVER = 'RADIUS';

/** «El carné»: the two words the voice gives it. */
export const CARNET = { card: 'carné', seal: 'certificado' } as const;

/** The exam name and what stands under it. */
export const NAME = {
  term: 'WPA3-ENTERPRISE',
  sub: ['802.1X', 'RADIUS (AAA)', 'autenticación, autorización y registro'],
} as const;

/** What enterprise mode needs. */
export const NEEDS = ['servidor RADIUS', 'directorio', 'PKI'] as const;
