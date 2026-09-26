// Voice register per emotion direction, for a voice that takes no inline direction (Chatterbox).
// ElevenLabs reads the <direction> itself; Chatterbox has two dials (exaggeration, cfg_weight),
// so each direction maps to one of four registers.
// See docs/superpowers/specs/2026-09-26-video-narration-style-design.md §5.2.

export const REGISTERS = Object.freeze({
  sereno: Object.freeze({ exaggeration: 0.4, cfg_weight: 0.5 }),
  neutro: Object.freeze({ exaggeration: 0.5, cfg_weight: 0.5 }),
  calido: Object.freeze({ exaggeration: 0.6, cfg_weight: 0.45 }),
  vivo: Object.freeze({ exaggeration: 0.75, cfg_weight: 0.35 }),
});

const WORDS = {
  sereno: ['calm', 'serious', 'steady', 'grave', 'focused', 'firm', 'concerned', 'warning', 'ominous', 'tired', 'sighs'],
  neutro: ['clear', 'thoughtful'],
  calido: ['curious', 'intrigued', 'confident', 'warm', 'warmly', 'satisfied', 'relieved', 'reassuring', 'casual', 'engaging'],
  vivo: ['enthusiastic', 'cheerful', 'mischievously', 'sarcastic', 'urgent', 'suspicious', 'emphatic', 'tense'],
};
const REGISTER_OF = new Map(Object.entries(WORDS).flatMap(([register, words]) => words.map((w) => [w, register])));

/**
 * Register of one segment from its <directions>: the first direction decides, and within it
 * ("serious, warning") the first word the table knows. No direction reads as neutro; a direction
 * with no known word too, and it is reported in `unknown`.
 * @param {string[]} directions parsed.directions
 * @returns {{ register: string, exaggeration: number, cfg_weight: number, unknown: string[] }}
 */
export function moodFor(directions = []) {
  const first = directions[0];
  if (!first) return { register: 'neutro', ...REGISTERS.neutro, unknown: [] };
  const words = first.split(',').map((w) => w.trim().toLowerCase()).filter(Boolean);
  const known = words.find((w) => REGISTER_OF.has(w));
  if (!known) return { register: 'neutro', ...REGISTERS.neutro, unknown: words };
  const register = REGISTER_OF.get(known);
  return { register, ...REGISTERS[register], unknown: [] };
}
