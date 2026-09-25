import { TIMELINE, enterFramesFor, sceneTiming } from '../../../timeline/load';
import type { SceneId } from '../../../timeline/types';

/** Lower-case, accent-free, letters and digits only: "Agregar," -> "agregar", "6.000" -> "6000". */
function norm(text: string): string {
  return text
    .toLocaleLowerCase('es-ES')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]/g, '');
}

/**
 * LOCAL frame at which `word` starts being spoken in `scene` (the n-th match
 * when `occurrence` > 0), read from the per-word timing in timeline.json so
 * word-synced beats follow the voice if it is re-timed. Falls back to
 * `fallback` (which callers anchor to a cue) when the word is not found.
 */
export function wordFrame(scene: SceneId, word: string, fallback: number, occurrence = 0): number {
  const origin = sceneTiming(scene).from - enterFramesFor(scene);
  const target = norm(word);
  let seen = 0;
  for (const segment of TIMELINE.segments) {
    if (segment.scene !== scene) continue;
    for (const w of segment.words) {
      if (norm(w.text) !== target) continue;
      if (seen === occurrence) return w.from - origin;
      seen++;
    }
  }
  return fallback;
}
