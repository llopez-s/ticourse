import assert from 'node:assert/strict';
import test from 'node:test';
import { APP_URL, TAGS_MAX_CHARS, TITLE_MAX, voiceCredit, youtubeChapters, youtubeDescription, youtubeTags, youtubeTitle } from '../youtube-meta.mjs';

const scene = (id, title, from, sec) => ({ id, title, from, durationInFrames: sec * 30, chapter: 1, chapterTitle: 'Uno' });
const timeline = {
  fps: 30,
  voice: 'chatterbox/es-es/default',
  scenes: [scene('s01-a', 'Seis mil avisos', 0, 40), scene('s02-b', 'Recoger', 1200, 65), scene('s03-c', 'Normalizar', 3150, 30)],
  segments: [
    { scene: 's01-a', text: '¿Seis mil alertas al día?' },
    { scene: 's01-a', text: 'Solo una importa.' },
    { scene: 's02-b', text: 'Otra cosa.' },
  ],
  exam: [{ objective: '4.4' }, { objective: '4.4' }, { objective: '4.9' }],
};

test('youtubeChapters: one per scene, mm:ss, first at 00:00', () => {
  const { lines, errors } = youtubeChapters(timeline);
  assert.deepEqual(lines, ['00:00 Seis mil avisos', '00:40 Recoger', '01:45 Normalizar']);
  assert.deepEqual(errors, []);
  const short = { ...timeline, scenes: [scene('s01-a', 'A', 0, 8), scene('s02-b', 'B', 240, 20)] };
  const bad = youtubeChapters(short).errors.join('\n');
  assert.match(bad, /at least 3 chapters/);
  assert.match(bad, /s01-a lasts 8\.0 s/);
});

test('title, credit and tags', () => {
  assert.equal(youtubeTitle('SIEM explicado: del ruido a la evidencia', 'secplus'), 'SIEM explicado: del ruido a la evidencia | Security+ SY0-701 en español');
  assert.ok(TITLE_MAX === 100);
  assert.match(voiceCredit('elevenlabs/eleven_v3/x'), /ElevenLabs/);
  assert.match(voiceCredit('chatterbox/es-es/default'), /Chatterbox/);
  assert.equal(voiceCredit('es-ES-ElviraNeural'), null);
  const tags = youtubeTags(timeline, 'secplus');
  assert.ok(tags.includes('Security+') && tags.includes('objetivo 4.4') && tags.includes('objetivo 4.9'));
  assert.equal(tags.filter((t) => t === 'objetivo 4.4').length, 1);
});

test('description: hook, lesson link, chapters, credit, notice, hashtags', () => {
  const d = youtubeDescription({ timeline, lesson: 'sp4m7', track: 'secplus', notice: 'AVISO' });
  assert.ok(d.startsWith('¿Seis mil alertas al día? Solo una importa.'));
  assert.ok(d.includes(`${APP_URL}#/learn/sp4m7`));
  assert.ok(d.includes('00:40 Recoger'));
  assert.ok(d.includes('Chatterbox'));
  assert.ok(d.includes('AVISO'));
  assert.ok(d.trimEnd().endsWith('#SecurityPlus #Ciberseguridad #Alertópolis'));
});

test('youtubeTags: lexicon terms are appended after the objectives, deduplicated, and filtered', () => {
  const tags = youtubeTags(timeline, 'secplus', ['SIEM', 'Security+', 'a', '¡hola!', 'NetFlow']);
  const objectiveIdx = tags.indexOf('objetivo 4.9');
  assert.ok(objectiveIdx !== -1);
  assert.ok(tags.indexOf('SIEM') > objectiveIdx);
  assert.ok(tags.indexOf('NetFlow') > objectiveIdx);
  assert.equal(tags.filter((t) => t === 'Security+').length, 1);
  assert.ok(!tags.includes('a'));
  assert.ok(!tags.includes('¡hola!'));
});

test('youtubeTags: over-budget lexicon terms are dropped, never the track/objective tags', () => {
  const longTerms = Array.from({ length: 200 }, (_, i) => `terminolargolexico${i}`);
  const tags = youtubeTags(timeline, 'secplus', longTerms);
  assert.ok(tags.join(',').length <= TAGS_MAX_CHARS);
  assert.ok(tags.includes('Security+'));
  assert.ok(tags.includes('objetivo 4.4'));
  assert.ok(tags.includes('objetivo 4.9'));
});

test('description: hook is the first two segments of the whole video, even with a one-segment first scene', () => {
  const oneSegTimeline = {
    ...timeline,
    segments: [
      { scene: 's01-a', text: 'Único segmento del principio.' },
      { scene: 's02-b', text: 'Segundo segmento de otra escena.' },
      { scene: 's02-b', text: 'Otra cosa.' },
    ],
  };
  const d = youtubeDescription({ timeline: oneSegTimeline, lesson: 'sp4m7', track: 'secplus', notice: 'AVISO' });
  assert.ok(d.startsWith('Único segmento del principio. Segundo segmento de otra escena.'));
});
