import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  applyStudioMarks,
  parseOnly,
  readingText,
  recordingSheet,
  rerecordFile,
  rerecordSheet,
  segmentMood,
  toneLabel,
  studioMarks,
  studioText,
  voiceStudioSheet,
} from './script-sheets.mjs';

const FIX = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures');
const read = (f) => JSON.parse(readFileSync(path.join(FIX, f), 'utf8'));
const MANIFEST = { slug: 'siem', adversary: 'SILENT PAGER', frozen: '2026-10-01' };

/** The mini fixtures, plus an intercepted message before s01-02 and a mood on s02-01. */
function sources({ intercept = false, narration: extra = {} } = {}) {
  const storyboard = read('storyboard.mini.json');
  const narration = { ...read('narration.mini.json'), ...extra };
  if (intercept) narration.segments[1].intercept = { text: 'Seis mil avisos.  Y ninguno es mío.', holdMs: 3000 };
  narration.segments[2].text = `<curious> ${narration.segments[2].text}`;
  return { storyboard, narration, manifest: MANIFEST };
}

test('toneLabel: each emotion tag in Spanish, unknown ones as they are', () => {
  assert.equal(toneLabel('curious'), 'con curiosidad');
  assert.equal(toneLabel('serious, warning'), 'seria, de aviso');
  assert.equal(toneLabel('whispering'), 'whispering');
});

test('segmentMood: the leading direction(s) only', () => {
  assert.equal(segmentMood('<intrigued> Tienes un dominio.'), 'intrigued');
  assert.equal(segmentMood('{flood}<tense> Mil, cinco mil.'), 'tense');
  assert.equal(segmentMood('<calm> <warm> Hola.'), 'calm, warm');
  assert.equal(segmentMood('Sin dirección. <serious> Luego sí.'), null);
});

test('readingText: pronunciation hints, cues gone, later directions kept in italics', () => {
  assert.equal(readingText('<intrigued> Llegan {flood}[6.000|seis mil] avisos.'), 'Llegan 6.000 *(lee: «seis mil»)* avisos.');
  assert.equal(readingText('Grupo [SILENT PAGER|Silent Pager].'), 'Grupo SILENT PAGER.');
  assert.equal(readingText('<a> Uno, <serious> y dos.'), 'Uno, *(serious)* y dos.');
});

test('studioText: the spoken side, capitals kept from the shown side and at a sentence start', () => {
  assert.equal(studioText('<x> En el [Lab 3A|lab tres a], {c}ya.'), 'En el Lab tres a, ya.');
  assert.equal(studioText('Hola. [SILENT PAGER|silent pager] llama.'), 'Hola. Silent pager llama.');
  assert.equal(studioText('Mira [SILENT PAGER|silent pager] ahora.'), 'Mira silent pager ahora.');
  assert.equal(studioText('[6.000|seis mil] avisos.'), 'Seis mil avisos.');
});

test('recordingSheet: headings, one line per segment, long pauses, on-screen notes and the header', () => {
  const md = recordingSheet(sources());
  assert.match(md, /^# Guion para grabar · SIEM en acción: del ruido a la evidencia\n/);
  assert.match(md, /última toma de cada oración/);
  assert.match(md, /Las preguntas para pensar y las tarjetas de examen salen en pantalla: \*\*no se leen\*\*/);
  assert.doesNotMatch(md, /×/, 'no tempo without narration.json "recording"');
  assert.ok(md.indexOf('## 1. Qué es') < md.indexOf('### Seis mil avisos, uno importa'));
  assert.ok(md.indexOf('## 2. Cómo funciona') < md.indexOf('### Recoger'), 'chapter 2 opens before its first scene');
  assert.equal(md.split('## 2. Cómo funciona').length, 2, 'each chapter heading once');
  assert.match(md, /\*\*s01-01\*\* — Cada día llegan 6\.000 \*\(lee: «seis mil»\)\* avisos .* \*\*\(pausa larga\)\*\*\n/);
  assert.match(md, /\*\*s02-01\*\* · \*con curiosidad\* — Primero recogemos/, 'the tone in Spanish');
  assert.doesNotMatch(md, /\*\*s02-02\*\*[^\n]*pausa larga/, '500 ms is not a long pause');
  assert.match(md, /\*\*s02-02\*\*[^\n]*\n\n> \*\(En pantalla: «Con NetFlow, ¿sabes qué datos salieron\?». Deja un segundo de silencio\.\)\*/);
  assert.doesNotMatch(md, /\{|\}|\|/, 'no markup left');
});

test('recordingSheet: the tempo from narration.json and the intercepted message before its answer', () => {
  const md = recordingSheet(sources({ intercept: true, narration: { recording: { tempo: 1.08 } } }));
  assert.match(md, /el vídeo se acelera un poco \(×1,08\) al montarlo/);
  assert.match(md, /Los mensajes interceptados, las preguntas para pensar y las tarjetas de examen salen en pantalla/);
  assert.match(md, /> \*\(En pantalla, no se lee: mensaje de SILENT PAGER — «Seis mil avisos\. {2}Y ninguno es mío\.»\. Tú contestas:\)\*\n\n\*\*s01-02\*\*/);
});

test('voiceStudioSheet: chapters, one narrator paragraph per scene, the adversary between', () => {
  const md = voiceStudioSheet(sources({ intercept: true }));
  const lines = md.split('\n').filter(Boolean);
  assert.deepEqual(lines.slice(0, 2), ['# SIEM en acción: del ruido a la evidencia', '# Capítulo 1 — Qué es']);
  assert.match(lines[2], /^\[voice:Narradora\] Cada día llegan seis mil avisos al SOC .* Solo uno importa de verdad\.$/);
  assert.equal(lines[3], '[voice:SILENT PAGER] Seis mil avisos. Y ninguno es mío. [pause 600ms]');
  assert.match(lines[4], /^\[voice:Narradora\] Para encontrarlo, el equipo azul usa un SIEM\. Veamos/);
  assert.equal(lines[5], '# Capítulo 2 — Cómo funciona');
  assert.match(lines[6], /^\[voice:Narradora\] Primero recogemos .* \[pause 400ms\] Todo con la hora/);
  assert.match(md, /a las la una y cincuenta y dos\./, 'groups resolve to the spoken side');
  assert.doesNotMatch(md, /<|\{|\||curious/, 'no directions or cues');
  assert.ok(md.endsWith('.\n') && !md.endsWith('\n\n'));
});

test('studio marks: applied when present, exact and single matches only', () => {
  const marked = sources({
    intercept: true,
    narration: {
      studio: {
        's01-01': [['Solo uno', '[emphasis]Solo uno[/emphasis]']],
        's01-02-intercept': [['es mío.', 'es mío. [laughter]']],
      },
    },
  });
  const md = voiceStudioSheet(marked);
  assert.match(md, /\[emphasis\]Solo uno\[\/emphasis\] importa/);
  assert.match(md, /\[voice:SILENT PAGER\] Seis mil avisos\. Y ninguno es mío\. \[laughter\] \[pause 600ms\]/);
  assert.equal(voiceStudioSheet(sources()).includes('[emphasis]'), false);

  assert.throws(() => applyStudioMarks('uno y uno', [['uno', 'dos']], 's01-01'), /studio\.s01-01: "uno" found 2 times/);
  assert.throws(() => applyStudioMarks('uno', [['tres', 'dos']], 's01-01'), /"tres" found 0 times/);
  assert.equal(applyStudioMarks('a $1 b', [['$1', '$$ [x]']], 'k'), 'a $$ [x] b', 'replacement is literal');
  const bad = (studio) => () => studioMarks({ ...sources().narration, studio });
  assert.throws(bad({ 's09-09': [['a', 'b']] }), /studio\.s09-09: no such segment/);
  assert.throws(bad({ 's01-01-intercept': [['a', 'b']] }), /no such segment with an intercepted message/);
  assert.throws(bad({ 's01-01': ['a', 'b'] }), /\["find", "replace"\] pairs/);
  assert.throws(bad({ 's01-01': [['', 'b']] }), /non-empty find/);
  assert.throws(bad([]), /must be an object/);
});

test('parseOnly and rerecordSheet: script order, the file to save and only the scenes involved', () => {
  const src = sources();
  assert.deepEqual(parseOnly('s03-01, s01-02', src.narration.segments), ['s01-02', 's03-01']);
  assert.throws(() => parseOnly('s01-02,s07-07', src.narration.segments), /unknown segment\(s\) s07-07/);
  assert.throws(() => parseOnly(' , ', src.narration.segments), /no segment ids/);

  assert.equal(rerecordFile('pivot-infra', 'recording/lidia'), 'video/engine/voices/pivot-infra regrabacion lidia.wav');
  assert.equal(rerecordFile('siem', 'es-ES-ElviraNeural'), 'video/engine/voices/siem regrabacion.wav');

  const md = rerecordSheet({ ...src, narration: { ...src.narration, voice: 'recording/lidia' }, ids: ['s01-02', 's03-01'] });
  assert.match(md, /^# Regrabación · SIEM en acción/);
  assert.match(md, /Graba estas 2 frases en un archivo aparte/);
  assert.match(md, /Guárdalo como `video\/engine\/voices\/siem regrabacion lidia\.wav`\./);
  assert.deepEqual(md.match(/\*\*s\d\d-\d\d\*\*/g), ['**s01-02**', '**s03-01**']);
  assert.deepEqual(md.match(/^#{2,3} .*$/gm), ['## 1. Qué es', '### Seis mil avisos, uno importa', '## 2. Cómo funciona', '### Normalizar']);
  assert.match(rerecordSheet({ ...src, ids: ['s01-01'] }), /Graba esta frase en un archivo aparte/);
});

test('sheets reject a segment whose scene is not in the storyboard', () => {
  const src = sources();
  src.narration.segments[0].scene = 's99-nope';
  assert.throws(() => recordingSheet(src), /segment s01-01: unknown scene "s99-nope"/);
  assert.throws(() => voiceStudioSheet(src), /unknown scene/);
});

test('recordingSheet: a script that is not frozen yet comes out as a draft nobody should record', () => {
  const draft = recordingSheet({ ...sources(), manifest: { slug: 'siem', adversary: 'SILENT PAGER' } });
  assert.match(draft, /^# BORRADOR · no grabes todavía · SIEM en acción/);
  assert.match(draft, /"frozen"/);
  const final = recordingSheet(sources());
  assert.match(final, /\*\*Versión definitiva\*\* · guion congelado el 2026-10-01/);
  assert.doesNotMatch(final, /BORRADOR/);
});

test('recordingSheet: the recording habits that spare cutting by hand, and where to save the file', () => {
  const md = recordingSheet(sources());
  assert.match(md, /calla un segundo/);
  assert.match(md, /pausas largas dentro de una frase/);
  assert.match(md, /dos segundos de silencio/);
  assert.match(md, /Guárdala como `video\/engine\/voices\/siem[^`]*\.wav`/);
});
