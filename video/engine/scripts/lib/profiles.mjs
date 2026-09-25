// Per-video formats (video.json "profile") and per-track disclaimers (video.json "track").
// See docs/superpowers/plans/2026-09-25-lesson-videos.md §1.

export const PROFILES = Object.freeze({
  /** Explainer: 5 chapters, 10–12 scenes, ~5 min. */
  principal: Object.freeze({
    minTotalSec: 280,
    maxTotalSec: 340,
    maxChapters: 5,
    examCards: [8, 11],
    thinkPrompts: 2,
    crf: 23,
    size: Object.freeze({ targetMin: 15, targetMax: 25, warn: 30, fail: 45 }), // MB (10^6 bytes)
  }),
  /** Practical capsule: 3 chapters, 5–6 scenes, ~3 min, at least half demo. */
  capsula: Object.freeze({
    minTotalSec: 140,
    maxTotalSec: 200,
    maxChapters: 3,
    examCards: [4, 6],
    thinkPrompts: 1,
    crf: 27,
    size: Object.freeze({ targetMin: 4, targetMax: 12, warn: 15, fail: 25 }),
  }),
});

const NOTICE = 'Simulación educativa con datos ficticios · IntelForge Academy — material independiente, no afiliado a';

export const TRACK_NOTICES = Object.freeze({
  secplus: `${NOTICE} CompTIA`,
  gcti: `${NOTICE} SANS/GIAC`,
});

export function profileFor(name) {
  const profile = PROFILES[name];
  if (!profile) throw new Error(`unknown video profile "${name}" (known: ${Object.keys(PROFILES).join(', ')})`);
  return profile;
}

export function trackNotice(track) {
  const notice = TRACK_NOTICES[track];
  if (!notice) throw new Error(`unknown track "${track}" (known: ${Object.keys(TRACK_NOTICES).join(', ')})`);
  return notice;
}
