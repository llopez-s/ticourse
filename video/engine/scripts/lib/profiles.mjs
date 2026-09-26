// Per-video formats (video.json "profile") and per-track disclaimers (video.json "track").
// See docs/superpowers/plans/2026-09-25-lesson-videos.md §1 and
// docs/superpowers/specs/2026-09-26-video-narration-style-design.md §3.

/** The app's public name (2026-09-26). Videos rendered for YouTube carry it. */
export const APP_NAME = 'Alertópolis';
/** The name the videos published before the rename carry in their MP4s, transcripts and posters. */
export const LEGACY_APP_NAME = 'IntelForge Academy';

export const PROFILES = Object.freeze({
  /** Explainer: 5 chapters, 10–12 scenes, ~5 min. Rendered into the app (public/videos). */
  principal: Object.freeze({
    minTotalSec: 280,
    maxTotalSec: 340,
    maxChapters: 5,
    examCards: [8, 11],
    thinkPrompts: 2,
    intercepts: [0, 0],
    chispa: false,
    host: 'repo',
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
    intercepts: [0, 0],
    chispa: false,
    host: 'repo',
    crf: 27,
    size: Object.freeze({ targetMin: 4, targetMax: 12, warn: 15, fail: 25 }),
  }),
  /** Lively explainer for YouTube: ~6–8 min, intercepted messages, no size target (YouTube re-encodes). */
  'principal-yt': Object.freeze({
    minTotalSec: 380,
    maxTotalSec: 500,
    maxChapters: 5,
    examCards: [8, 11],
    thinkPrompts: 2,
    intercepts: [2, 4],
    chispa: true,
    host: 'youtube',
    crf: 18,
    size: null,
  }),
  /** Lively capsule for YouTube: ~3–4 min. */
  'capsula-yt': Object.freeze({
    minTotalSec: 190,
    maxTotalSec: 260,
    maxChapters: 3,
    examCards: [4, 6],
    thinkPrompts: 1,
    intercepts: [1, 2],
    chispa: true,
    host: 'youtube',
    crf: 18,
    size: null,
  }),
});

const AFFILIATION = Object.freeze({ secplus: 'CompTIA', gcti: 'SANS/GIAC' });

export function profileFor(name) {
  const profile = PROFILES[name];
  if (!profile) throw new Error(`unknown video profile "${name}" (known: ${Object.keys(PROFILES).join(', ')})`);
  return profile;
}

/** Disclaimer line of a video: its track's affiliation, under the name its host shows. */
export function trackNotice(track, profile = 'principal') {
  const affiliation = AFFILIATION[track];
  if (!affiliation) throw new Error(`unknown track "${track}" (known: ${Object.keys(AFFILIATION).join(', ')})`);
  const brand = profileFor(profile).host === 'youtube' ? APP_NAME : LEGACY_APP_NAME;
  return `Simulación educativa con datos ficticios · ${brand} — material independiente, no afiliado a ${affiliation}`;
}
