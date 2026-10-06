/**
 * On-screen strings of s02-pelicula (canon: out/scene-brief.md «Canon», s02). Meridian's frames are
 * `MERIDIAN_FRAMES` in `scenes/parts/FilmRail.tsx`; the build order's labels are `BUILD_STEPS_THREAD` in
 * `scenes/parts/BuildOrder.tsx`. `word` = the spoken word (segment, nth) the item lands on.
 */

/** The big name entrance on `film` (exam term, upper case, violet). */
export const NAME = 'ACTIVITY THREAD';

/** The three chips under the film (s02-07 / s02-08). */
export const CHIPS = [
  { text: 'una intrusión', seg: 's02-07', word: 'intrusión' },
  { text: 'una víctima', seg: 's02-08', word: 'víctima' },
  { text: 'en orden de tiempo y de fase', seg: 's02-08', word: 'orden' },
] as const;

/**
 * When each of Meridian's frames drops into its slot: [frame key, segment, word]. Delivery lands on its date («El
 * lunes dos»), not on «correo»: in the voiced take some seconds pass between the two, and the rail would stand empty.
 */
export const FRAME_WORDS = [
  ['m-delivery', 's02-02', 'lunes'],
  ['m-exploitation', 's02-03', 'Se'],
  ['m-installation', 's02-03', 'instala'],
  ['m-c2', 's02-03', 'llama'],
  ['m-e7', 's02-04', 'alerta'],
  ['m-e9', 's02-05', 'E9'],
] as const;
