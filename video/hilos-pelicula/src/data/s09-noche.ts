/**
 * s09-noche «Orbital, a medio camino» — on-screen strings (canon: out/scene-brief.md «Canon», s09). The plan comes from
 * the lesson's check («archive staging in temp paths and large outbound transfers», `src/data/s2.ts:929`), NOT from E9's
 * frame: its wording stays the check's, never harmonised with «compresión en una carpeta temporal · salida grande». The
 * plan has no date and no result; Meridian passes Orbital what to look for and Orbital watches (nobody enters its
 * machines). Nothing is ticked anywhere: the boxes of the wrap-iv list stay empty.
 */

/** The bad option (`wait`), struck, and why. The option is one string on two hard lines. */
export const WAIT = {
  option: ['esperar a que saque los datos', 'para confirmarlo'] as const,
  cost: 'cuesta justo lo que quieres proteger',
} as const;

/** The good option (`hunt`), marked with a ring — never a tick. */
export const HUNT = 'buscar ya';

/** The plan card (`plan`), padlocked with `tonight`. */
export const PLAN = {
  from: 'Meridian',
  to: 'Orbital',
  head: 'esta noche:',
  /** The check's two actions; the first is long, so it breaks after «archivos» (same words, two hard lines). */
  lines: [['buscar compresión de archivos', 'en carpetas temporales'], ['vigilar transferencias salientes grandes']] as const,
} as const;

/**
 * `wrap-iv`: Meridian's film turns into a list of things to look for. Each row is one of Meridian's frames as s02 put
 * it on screen (phase + its one line; the two C2 frames are one row), with an EMPTY box: there is no result.
 */
export const HUNT_LIST = {
  head: 'cosas que buscar',
  rows: [
    { phase: 'Delivery', what: 'correo con un CV' },
    { phase: 'Exploitation', what: 'se abre el adjunto' },
    { phase: 'Installation', what: 'loader y tarea programada' },
    { phase: 'C2', what: 'primera llamada a casa' },
    { phase: 'Actions on Objectives', what: 'compresión en una carpeta temporal · salida grande' },
  ],
} as const;
