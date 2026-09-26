#!/usr/bin/env node
// Writes video/<slug>/out/youtube.md for a video whose profile goes to YouTube: title,
// description (hook, lesson link, chapters, voice credit, disclaimer, hashtags), tags and the
// files to upload. Needs an audio-mode timeline (run audio.mjs, then render.mjs, first).
//
//   node video/engine/scripts/youtube-meta.mjs --video <slug>
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { ELEVENLABS_CREDIT, captionsPathFor } from './build-timeline.mjs';
import { loadSources, parseJsonText } from './lib/narration.mjs';
import { MANIFEST, PATHS, isMainModule } from './lib/paths.mjs';
import { profileFor, trackNotice } from './lib/profiles.mjs';
import { writeFileAtomic } from './lib/remotion.mjs';

export const APP_URL = 'https://llopez-s.github.io/ticourse/';
export const TITLE_MAX = 100;
export const TAGS_MAX_CHARS = 500;
export const THUMB_MAX_BYTES = 2 * 1024 * 1024;
export const CHATTERBOX_CREDIT = 'Voz: Chatterbox, de Resemble AI (licencia MIT)';
const TRACK_LABEL = { secplus: 'Security+ SY0-701 en español', gcti: 'GIAC GCTI en español' };
const TRACK_TAGS = {
  secplus: ['Security+', 'SY0-701', 'CompTIA Security+ en español', 'ciberseguridad', 'blue team', 'Alertópolis'],
  gcti: ['GCTI', 'threat intelligence', 'inteligencia de amenazas', 'ciberseguridad', 'FOR578', 'Alertópolis'],
};
const HASHTAGS = { secplus: '#SecurityPlus #Ciberseguridad #Alertópolis', gcti: '#ThreatIntelligence #Ciberseguridad #Alertópolis' };
/** A lexicon key usable as a tag: no markup, no single letters (spec §6.2). */
const LEXICON_TAG = /^[\p{L}\p{N}][\p{L}\p{N}+.\-]*$/u;

const stamp = (frame, fps) => {
  const s = Math.floor(frame / fps);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

export function youtubeTitle(title, track) {
  return `${title} | ${TRACK_LABEL[track]}`;
}

/** YouTube chapters, one per scene: the first at 00:00, at least 3, each at least 10 s long. */
export function youtubeChapters(timeline) {
  const errors = [];
  const lines = timeline.scenes.map((s) => `${stamp(s.from, timeline.fps)} ${s.title}`);
  if (timeline.scenes[0]?.from !== 0) errors.push('the first chapter must start at 00:00');
  if (timeline.scenes.length < 3) errors.push(`YouTube needs at least 3 chapters (have ${timeline.scenes.length})`);
  for (const s of timeline.scenes) {
    const sec = s.durationInFrames / timeline.fps;
    if (sec < 10) errors.push(`${s.id} lasts ${sec.toFixed(1)} s (a YouTube chapter needs 10 s)`);
  }
  return { lines, errors };
}

export function voiceCredit(voice) {
  if (voice.startsWith('elevenlabs/')) return ELEVENLABS_CREDIT;
  if (voice.startsWith('chatterbox/')) return CHATTERBOX_CREDIT;
  return null;
}

/**
 * Length YouTube Studio actually charges against the 500-char tag budget: `tags.join(',')`, plus 2
 * extra characters for every tag containing a space, because Studio wraps those in quotes.
 */
export function tagsLength(tags) {
  const quoting = tags.reduce((n, tag) => n + (tag.includes(' ') ? 2 : 0), 0);
  return tags.join(',').length + quoting;
}

/** Track/exam tags (spec §6.2), then lexicon terms, deduplicated in that order and fit to the 500-char budget. */
export function youtubeTags(timeline, track, lexiconTerms = []) {
  const fixed = [...new Set([...TRACK_TAGS[track], ...timeline.exam.map((e) => `objetivo ${e.objective}`)])];
  const seen = new Set(fixed);
  const extra = [];
  for (const term of lexiconTerms) {
    if (term.length >= 2 && LEXICON_TAG.test(term) && !seen.has(term)) {
      seen.add(term);
      extra.push(term);
    }
  }
  const tags = [...fixed, ...extra];
  while (tags.length > fixed.length && tagsLength(tags) > TAGS_MAX_CHARS) tags.pop();
  return tags;
}

export function youtubeDescription({ timeline, lesson, track, notice }) {
  const hook = timeline.segments.slice(0, 2).map((s) => s.text).join(' ');
  const credit = voiceCredit(timeline.voice);
  return [
    hook,
    '',
    `Practica esta lección gratis en Alertópolis: ${APP_URL}#/learn/${lesson}`,
    '',
    'Capítulos',
    ...youtubeChapters(timeline).lines,
    '',
    ...(credit ? [credit] : []),
    notice,
    '',
    HASHTAGS[track],
    '',
  ].join('\n');
}

function main() {
  parseArgs({ options: { video: { type: 'string' } } });
  const errors = [];
  if (profileFor(MANIFEST.profile).host !== 'youtube') errors.push(`profile "${MANIFEST.profile}" is not a YouTube profile (principal-yt / capsula-yt)`);
  if (!MANIFEST.lesson) errors.push('video.json needs "lesson" (the module id the description links to)');
  const timeline = parseJsonText(readFileSync(PATHS.timeline, 'utf8'), PATHS.timeline);
  if (timeline.mode !== 'audio') errors.push('timeline.json is in estimate mode — run audio.mjs first');
  const storyboard = parseJsonText(readFileSync(PATHS.storyboard, 'utf8'), PATHS.storyboard);
  const title = youtubeTitle(storyboard.title, MANIFEST.track);
  if (title.length > TITLE_MAX) errors.push(`title is ${title.length} characters (YouTube max ${TITLE_MAX}): shorten storyboard.title`);
  errors.push(...youtubeChapters(timeline).errors);
  const { lexicon } = loadSources({ storyboard: PATHS.storyboard, narration: PATHS.narration, lexicon: PATHS.lexicon });
  const tags = youtubeTags(timeline, MANIFEST.track, Object.keys(lexicon));
  if (tagsLength(tags) > TAGS_MAX_CHARS) errors.push(`tags take ${tagsLength(tags)} characters, quoted (max ${TAGS_MAX_CHARS})`);
  if (!existsSync(PATHS.poster)) errors.push(`no poster at ${PATHS.poster} — run render.mjs`);
  else if (statSync(PATHS.poster).size > THUMB_MAX_BYTES) errors.push(`poster is over 2 MB, YouTube's thumbnail limit`);
  const captions = captionsPathFor(PATHS.transcript);
  if (!existsSync(captions)) errors.push(`no captions at ${captions}`);
  if (errors.length) throw new Error(`${errors.length} problem(s):\n${errors.map((e) => `  - ${e}`).join('\n')}`);

  const notice = trackNotice(MANIFEST.track, MANIFEST.profile);
  const description = youtubeDescription({ timeline, lesson: MANIFEST.lesson, track: MANIFEST.track, notice });
  const out = path.join(PATHS.outDir, 'youtube.md');
  writeFileAtomic(
    out,
    [
      `# YouTube · ${MANIFEST.slug}`,
      '',
      '## Título',
      '',
      title,
      '',
      '## Descripción',
      '',
      '```text',
      description.trimEnd(),
      '```',
      '',
      '## Etiquetas',
      '',
      tags.join(', '),
      '',
      '## Archivos',
      '',
      `- Vídeo: ${PATHS.video}${existsSync(PATHS.video) ? '' : ' (todavía no renderizado)'}`,
      `- Subtítulos (español): ${captions}`,
      `- Miniatura: ${PATHS.poster}`,
      '',
      '## Ajustes',
      '',
      '- Visibilidad: pública (se publica solo con el OK de Lidia).',
      '- Audiencia: «No, no es contenido creado para niños».',
      `- Lista: ${MANIFEST.track === 'secplus' ? 'Security+ SY0-701' : 'GCTI'}.`,
      '',
    ].join('\n'),
  );
  console.log(`youtube.md -> ${out}`);
}

if (isMainModule(import.meta.url)) {
  try {
    main();
  } catch (error) {
    console.error(`youtube-meta: ${error.message}`);
    process.exit(1);
  }
}
