// Per-video formats (video.json "profile") and per-track disclaimers (video.json "track").
// See docs/superpowers/plans/2026-09-25-lesson-videos.md §1 and
// docs/superpowers/specs/2026-09-26-video-narration-style-design.md §3 and, for the -yt exam-card ranges,
// docs/superpowers/specs/2026-09-28-spoken-narration-design.md §3 (fewer concepts, better told).

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
    examQuestions: [0, 0],
    chispa: false,
    host: 'repo',
    crf: 23,
    x264Preset: 'slow',
    captionsOnScreen: true, // the MP4 plays in the app, burned-in captions included
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
    examQuestions: [0, 0],
    chispa: false,
    host: 'repo',
    crf: 27,
    x264Preset: 'slow',
    captionsOnScreen: true, // the MP4 plays in the app, burned-in captions included
    size: Object.freeze({ targetMin: 4, targetMax: 12, warn: 15, fail: 25 }),
  }),
  /** Lively explainer for YouTube: ~6–10 min, intercepted messages, no size target (YouTube re-encodes). */
  'principal-yt': Object.freeze({
    minTotalSec: 380,
    maxTotalSec: 600,
    maxChapters: 5,
    examCards: [5, 8],
    thinkPrompts: 2,
    intercepts: [2, 4],
    examQuestions: [0, 0],
    chispa: true,
    host: 'youtube',
    crf: 18,
    x264Preset: 'medium', // YouTube re-encodes the upload: 'slow' bought nothing visible, at ~2× the encode time
    captionsOnScreen: false, // YouTube shows the uploaded VTT (the app's embed forces it on): burned-in ones were redundant
    size: null,
  }),
  /** Lively capsule for YouTube: ~3–4 min. */
  'capsula-yt': Object.freeze({
    minTotalSec: 190,
    maxTotalSec: 260,
    maxChapters: 3,
    examCards: [3, 5],
    thinkPrompts: 1,
    intercepts: [1, 2],
    examQuestions: [0, 0],
    chispa: true,
    host: 'youtube',
    crf: 18,
    x264Preset: 'medium', // YouTube re-encodes the upload: 'slow' bought nothing visible, at ~2× the encode time
    captionsOnScreen: false, // YouTube shows the uploaded VTT (the app's embed forces it on): burned-in ones were redundant
    size: null,
  }),
  /** Case-and-exam capsule for YouTube: ~4–5.5 min, the case told in chapters and three exam questions (spec 2026-10-16-secplus-casos-examen-design.md). */
  'caso-yt': Object.freeze({
    minTotalSec: 240,
    maxTotalSec: 330,
    maxChapters: 3,
    examCards: [3, 5],
    thinkPrompts: 0,
    intercepts: [0, 1],
    examQuestions: [3, 3],
    chispa: true,
    host: 'youtube',
    crf: 18,
    x264Preset: 'medium', // YouTube re-encodes the upload: 'slow' bought nothing visible, at ~2× the encode time
    captionsOnScreen: false, // YouTube shows the uploaded VTT (the app's embed forces it on): burned-in ones were redundant
    size: null,
  }),
  /** Case-and-exam explainer for YouTube: ~7–10 min, the case told in chapters and four or five exam questions (spec 2026-10-16-secplus-casos-examen-design.md). */
  'caso-principal-yt': Object.freeze({
    minTotalSec: 420,
    maxTotalSec: 600,
    maxChapters: 5,
    examCards: [5, 8],
    thinkPrompts: 0,
    intercepts: [0, 2],
    examQuestions: [4, 5],
    chispa: true,
    host: 'youtube',
    crf: 18,
    x264Preset: 'medium', // YouTube re-encodes the upload: 'slow' bought nothing visible, at ~2× the encode time
    captionsOnScreen: false, // YouTube shows the uploaded VTT (the app's embed forces it on): burned-in ones were redundant
    size: null,
  }),
});

const AFFILIATION = Object.freeze({ secplus: 'CompTIA', gcti: 'SANS/GIAC' });

/** Exam named on the badge of an exam card ("EXAMEN · SY0-701 · 4.5"). */
export const EXAM_BADGE = Object.freeze({ secplus: 'SY0-701', gcti: 'GCTI' });

/** GCTI publishes no numbered objectives, so a GCTI exam card names the course domain (src/lib/types.ts). */
export const GCTI_DOMAINS = Object.freeze(['Requirements', 'Intrusion Analysis', 'Collection', 'Analysis', 'Dissemination']);

/** Why `objective` is not valid on an exam card of `track`, or null when it is. */
export function examObjectiveError(track, objective) {
  if (!EXAM_BADGE[track]) throw new Error(`unknown track "${track}" (known: ${Object.keys(EXAM_BADGE).join(', ')})`);
  if (track === 'gcti') {
    return GCTI_DOMAINS.includes(objective) ? null : `exam.objective must be a GCTI domain (${GCTI_DOMAINS.join(', ')})`;
  }
  return typeof objective === 'string' && /^[1-5]\.\d{1,2}$/.test(objective) ? null : 'exam.objective must be an SY0-701 objective like "4.4"';
}

/** The profiles that publish to YouTube (host "youtube"), for messages that name them. */
export const YOUTUBE_PROFILES = Object.freeze(Object.keys(PROFILES).filter((name) => PROFILES[name].host === 'youtube'));

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
