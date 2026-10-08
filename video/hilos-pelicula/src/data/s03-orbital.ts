/**
 * On-screen strings of s03-orbital (canon: out/scene-brief.md «Canon», s03). The raw lines are in
 * `scenes/parts/s03-orbital/OrbitalLog.tsx`; Orbital's frames are `ORBITAL_FRAMES` in `scenes/parts/FilmRail.tsx`.
 * `word` = the spoken word (in `seg`) the tag lands on.
 */

/** One tag per step, beside the row the voice explains. `lines` = how it breaks in its column. */
export const TAGS = [
  { row: 'mail', lines: ['un pedido falso', 'a Finanzas'], cue: 'lure' },
  { row: 'runs', lines: ['se ejecuta el adjunto', 'y deja un programa'], cue: 'runs' },
  { row: 'beacon', lines: ['llama a casa'], cue: 'calls' },
] as const;

/** Orbital's film is partial: the tag on its label, on «parcial». */
export const PARTIAL = { text: 'hilo parcial', seg: 's03-05', word: 'parcial' } as const;
