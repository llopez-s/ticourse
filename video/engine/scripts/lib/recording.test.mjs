import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { analyzeNarration, isRecordingVoice, spokenForVoice, ttsKey } from './narration.mjs';
import { ffmpegBinary } from './remotion.mjs';
import { parseSegmentText } from './text.mjs';
import {
  REVIEW_SCORE,
  asrCacheValid,
  asrClips,
  asrPrompt,
  clipArgs,
  clipWords,
  cutPoints,
  stretchedWords,
  gainDb,
  importReport,
  keepRanges,
  locateSegments,
  matchKey,
  missingGaps,
  parseDuration,
  parseLoudness,
  parseSilences,
  recutAdvice,
  recutLoudnessFilter,
  recordingRecord,
  recordingSettings,
  repairSwallowedPauses,
  trailingSpeechEnd,
  selectSegments,
  similarity,
  unusedRanges,
} from './recording.mjs';
import { withTempo } from '../import-recording.mjs';

/** ASR words from a list of [text, startMs, endMs]. */
const W = (rows) => rows.map(([text, startMs, endMs]) => ({ text, startMs, endMs }));

/** Words spoken one after another at 400 ms per word, 100 ms apart, from `t0`. */
function spoken(sentence, t0 = 0) {
  return sentence.split(' ').map((text, k) => ({ text, startMs: t0 + k * 500, endMs: t0 + k * 500 + 400 }));
}

const seg = (id, text) => ({ id, parsed: parseSegmentText(text, {}) });

test('recording voices: "recording/<name>", keyed on the plain spoken text', () => {
  for (const ok of ['recording/lidia', 'recording/lidia_2', 'recording/a-b']) assert.ok(isRecordingVoice(ok), ok);
  for (const bad of ['recording/', 'recording/Lidia', 'chatterbox/es-es/default', 'es-ES-ElviraNeural']) assert.equal(isRecordingVoice(bad), false, bad);
  const parsed = parseSegmentText('<serious> Halden, [04:12|las cuatro y doce].', {});
  assert.equal(spokenForVoice('recording/lidia', parsed), parsed.spoken);
});

test('analyzeNarration accepts a recording voice', () => {
  const storyboard = { scenes: [{ id: 's01', title: 'Uno', layout: 'map', chapter: 'I' }] };
  const narration = { voice: 'recording/lidia', segments: [{ id: 's01-01', scene: 's01', text: 'Hola.' }] };
  const { errors } = analyzeNarration({ storyboard, narration, lexicon: {}, storyboardText: '', narrationText: '', lexiconText: '' });
  assert.ok(!errors.some((e) => /narration\.voice/.test(e)), errors.join('\n'));
});

test('similarity: 1 for equal text, ignores case, accents, spaces and punctuation', () => {
  assert.equal(similarity('Sala de control', 'sala de control'), 1);
  assert.equal(similarity('¿Quién lo detiene?', 'quien lo detiene'), 1);
  assert.equal(similarity('de Kim', 'dekim'), 1);
  assert.ok(similarity('SPF y DKIM no bastan', 'SPF y de Kim no bastan') > 0.8);
  assert.ok(similarity('Sala de control', 'El paquete sigue') < 0.4);
  assert.equal(similarity('', 'algo'), 0);
});

test('similarity reads digits as Spanish words, so «7» and «siete» are the same', () => {
  assert.equal(similarity('Su regla 7', 'su regla siete'), 1);
  assert.equal(similarity('por el 443', 'por el cuatrocientos cuarenta y tres'), 1);
  assert.equal(similarity('6.000 alertas', 'seis mil alertas'), 1);
  assert.equal(similarity('a las 21 horas', 'a las veintiuna horas') > 0.9, true);
});

test('locateSegments matches a time the ASR wrote in digits against its spoken words', () => {
  const words = [
    ...spoken('Y así pasará la noche, hasta que lo incauten a las 4 .00 y 12 .00 de la madrugada,'),
    ...spoken('lo que aún nadie sabía: antes de aislarlo, ya había salido la credencial.', 12000),
  ];
  const found = locateSegments(
    [
      seg('a', 'Y así pasará la noche, hasta que lo incauten [a las 04:12|a las cuatro y doce de la madrugada].'),
      seg('b', 'Lo que aún nadie sabía: antes de aislarlo, ya había salido la credencial.'),
    ],
    words,
  );
  assert.deepEqual(found.map((f) => [f.first, f.last]), [[0, 18], [19, 31]]);
});

test('locateSegments keeps «802.1X» at the end of a sentence when the ASR splits it into «802» and «.1X.»', () => {
  // V17 s09-08: the script's «802.1X» used to read as one number («ocho mil veintiuno equis»), so the take
  // matched better without its last word and the clip stopped at «802».
  const words = [
    ...spoken('Propones túnel completo, y el comité lo aprueba, junto con 802 .1X.'),
    ...spoken('Vamos, que desde fuera se entra por TLS.', 8000),
  ];
  const found = locateSegments(
    [seg('a', 'Propones túnel completo, y el comité lo aprueba, junto con 802.1X.'), seg('b', 'Vamos, que desde fuera se entra por TLS.')],
    words,
  );
  assert.deepEqual(found.map((f) => [f.first, f.last]), [[0, 11], [12, 19]]);
  assert.equal(found[0].score, 1);
});

test('matchKey: a dot before exactly three digits groups thousands, any other dot between digits splits two numbers', () => {
  assert.equal(matchKey('6.000 alertas'), matchKey('seis mil alertas'));
  assert.equal(matchKey('1.000.000'), matchKey('1000000'));
  assert.equal(matchKey('802.1X'), matchKey('802') + matchKey('.1X.'));
  assert.equal(matchKey('802.1X'), 'ochocientosdosunox');
});

test('locateSegments finds consecutive segments in order', () => {
  const words = [...spoken('Sala de control del muelle tres.'), ...spoken('¿Seguro que es de casa?', 4000)];
  const found = locateSegments([seg('a', 'Sala de control del muelle tres.'), seg('b', '¿Seguro que es de casa?')], words);
  assert.deepEqual(found.map((f) => [f.id, f.found, f.first, f.last]), [['a', true, 0, 5], ['b', true, 6, 10]]);
  assert.ok(found.every((f) => f.score > 0.95));
});

test('locateSegments skips audio that is not in the script (exam cards, intercepts)', () => {
  const words = [
    ...spoken('Salta la alerta y el paquete sigue.'),
    ...spoken('Tu sensor me vio pasar, qué detalle.', 4000),
    ...spoken('No podía: es un IDS.', 8000),
  ];
  const found = locateSegments([seg('a', 'Salta la alerta y el paquete sigue.'), seg('b', 'No podía: es un IDS.')], words);
  assert.deepEqual(found.map((f) => [f.first, f.last]), [[0, 6], [14, 18]]);
});

test('locateSegments keeps the last take of a repeated sentence', () => {
  const words = [
    ...spoken('Ninguna lo para sola.'),
    ...spoken('Ninguna lo para sola.', 3000),
    ...spoken('Enfrente, SILENT PAGER.', 6000),
  ];
  const found = locateSegments([seg('a', 'Ninguna lo para sola.'), seg('b', 'Enfrente, SILENT PAGER.')], words);
  assert.deepEqual(found.map((f) => [f.first, f.last]), [[4, 7], [8, 10]]);
});

test('locateSegments keeps a short first word: the same take minus a word is not a second take', () => {
  const sentence = 'Y aun así, la conexión con el C2, el mando y control, sale tan tranquila.';
  const words = [...spoken('Siguiente capa: el firewall.'), ...spoken(sentence, 3000)];
  const found = locateSegments([seg('a', 'Siguiente capa: el firewall.'), seg('b', sentence)], words);
  assert.deepEqual(found.map((f) => [f.first, f.last]), [[0, 3], [4, 18]]);
});

test('locateSegments keeps a first word the ASR misheard rather than cut the sentence short', () => {
  const sentence = 'Y aun así, la conexión con el C2, el mando y control, sale tan tranquila.';
  const words = [...spoken('Siguiente capa: el firewall.'), ...spoken(sentence.replace(/^Y /, 'Hay '), 3000)];
  const found = locateSegments([seg('a', 'Siguiente capa: el firewall.'), seg('b', sentence)], words);
  assert.deepEqual(found.map((f) => [f.first, f.last]), [[0, 3], [4, 18]]);
});

test('locateSegments keeps a last word the ASR misheard rather than cut the sentence short', () => {
  const sentence = 'Y esa credencial volverá de madrugada. Pero esa ya es otra alerta: la del SIEM.';
  const words = [...spoken(sentence.replace('SIEM.', 'CN.')), ...spoken('Ahora te toca a ti.', 9000)];
  const found = locateSegments([seg('a', sentence), seg('b', 'Ahora te toca a ti.')], words);
  assert.deepEqual(found.map((f) => [f.first, f.last]), [[0, 14], [15, 19]]);
});

test('locateSegments does not pull a stray word that follows a sentence into its clip', () => {
  const sentence = 'Duele, pero acierta. Tu DNS publica p=none: DMARC solo informa, y el correo entra igual en la bandeja, sin que nadie lo note nunca.';
  const words = [
    ...spoken(sentence),
    ...spoken('Tu DMARC solo mira, como tu turno de noche.', 13000),
    ...spoken('¿Para qué sirve eso?', 18000),
  ];
  const found = locateSegments([seg('a', sentence), seg('b', '¿Para qué sirve eso?')], words);
  assert.deepEqual(found.map((f) => [f.first, f.last]), [[0, 23], [33, 36]]);
});

test('locateSegments drops a false start before the good take', () => {
  const words = [
    ...spoken('Telnet, LDAP y'),
    ...spoken('Telnet, LDAP y SNMPv2c se sustituyen por SSH.', 2000),
    ...spoken('Cada capa tiene un punto ciego.', 8000),
  ];
  const found = locateSegments(
    [seg('a', 'Telnet, LDAP y SNMPv2c se sustituyen por SSH.'), seg('b', 'Cada capa tiene un punto ciego.')],
    words,
  );
  assert.deepEqual(found.map((f) => [f.first, f.last]), [[3, 10], [11, 16]]);
});

test('locateSegments keeps the last take of each sentence: a re-read last sentence replaces the first attempt', () => {
  const text = 'Empezamos por el passive DNS. Le das un nombre y te devuelve un número.';
  const words = [
    ...spoken('Empezamos por el passive DNS. Le das nombre y te devuelve un número.'), // 0–12, a word missing
    ...spoken('Le das un nombre y te devuelve un número.', 7000), // 13–21: the narrator re-reads that sentence
    ...spoken('Pues el passive DNS es ese listín.', 12000), // 22–28
  ];
  const [a, b] = locateSegments([seg('a', text), seg('b', 'Pues el passive DNS es ese listín.')], words);
  assert.deepEqual(a.parts, [{ first: 0, last: 4 }, { first: 13, last: 21 }]);
  assert.deepEqual([a.first, a.last], [0, 21]);
  assert.equal(a.heard, 'Empezamos por el passive DNS. Le das un nombre y te devuelve un número.');
  assert.ok(a.score > 0.95, JSON.stringify(a));
  assert.deepEqual([b.first, b.last, b.parts], [22, 28, undefined]);
});

test('locateSegments drops a false start inside a sentence', () => {
  const text = 'Una última cosa. Todo lo de hoy lo has sacado del listín, sin tocar al actor.';
  const words = [
    ...spoken('Una última cosa. Todo lo que has sacado hoy, todo lo de hoy lo has sacado del listín, sin tocar al actor.'),
    ...spoken('Ni se te ocurra, que te ven.', 14000),
  ];
  const [a] = locateSegments([seg('a', text), seg('b', 'Ni se te ocurra, que te ven.')], words);
  assert.deepEqual(a.parts, [{ first: 0, last: 2 }, { first: 9, last: 21 }]);
  assert.ok(a.score > 0.95, JSON.stringify(a));
});

test('locateSegments splices an identical re-read too (the later reading wins a tie), scoring the spoken form', () => {
  const text = 'Hoy sí. Pero el [WHOIS|júis] también tiene memoria. Quedan fichas antiguas.';
  const words = [
    ...spoken('Hoy sí. Pero el júis también tiene memoria. Quedan fichas antiguas.'), // 0–10
    ...spoken('Quedan fichas antiguas.', 6000), // 11–13
    ...spoken('Y aparece un correo.', 9000), // 14–17
  ];
  const [a] = locateSegments([seg('a', text), seg('b', 'Y aparece un correo.')], words);
  assert.deepEqual(a.parts, [{ first: 0, last: 7 }, { first: 11, last: 13 }]);
});

test('locateSegments leaves a take read in one go alone (no parts)', () => {
  const sentence = 'Y esa credencial volverá de madrugada. Pero esa ya es otra alerta: la del SIEM.';
  const words = [...spoken(sentence), ...spoken('Ahora te toca a ti.', 9000)];
  const found = locateSegments([seg('a', sentence), seg('b', 'Ahora te toca a ti.')], words);
  assert.ok(found.every((f) => f.parts === undefined), JSON.stringify(found));
});

test('cutPoints cuts each part of a spliced take on its own, never into the dropped words', () => {
  const words = W([['a', 0, 400], ['b', 500, 900], ['x', 1000, 1400], ['c', 2000, 2400]]);
  const located = [{ id: 's', found: true, first: 0, last: 3, parts: [{ first: 0, last: 1 }, { first: 3, last: 3 }] }];
  const [cut] = cutPoints(located, words, [], 3000);
  assert.deepEqual(cut.parts.map((p) => [p.startMs, p.endMs]), [[0, 950], [1750, 2650]]);
  assert.deepEqual([cut.startMs, cut.endMs], [0, 2650]);
});

test('clipWords and unusedRanges follow the parts of a spliced take', () => {
  const words = W([['a', 0, 400], ['b', 500, 900], ['x', 1000, 1400], ['c', 2000, 2400]]);
  const parts = [{ first: 0, last: 1 }, { first: 3, last: 3 }];
  const ranges = [{ startMs: 0, endMs: 950 }, { startMs: 1750, endMs: 2650 }];
  assert.deepEqual(clipWords(words, 0, 3, ranges, parts).map((w) => [w.text, w.offsetMs]), [['a', 0], ['b', 500], ['c', 1200]]);
  const unused = unusedRanges([{ id: 's', found: true, first: 0, last: 3, parts }], words);
  assert.deepEqual(unused.map((r) => r.text), ['x']);
});

test('locateSegments compares with both the shown and the spoken form', () => {
  const words = spoken('Autoridad Portuaria de Halden, 3 de septiembre.');
  const [f] = locateSegments([seg('a', 'Autoridad Portuaria de Halden, [3 de septiembre|tres de septiembre].')], words);
  assert.ok(f.found && f.score > 0.95, JSON.stringify(f));
});

test('locateSegments marks a sentence that was never read and still finds the next one', () => {
  const words = [...spoken('Sala de control del muelle tres.'), ...spoken('Cada capa tiene un punto ciego.', 4000)];
  const found = locateSegments(
    [seg('a', 'Sala de control del muelle tres.'), seg('b', 'La macro acaba lanzando PowerShell.'), seg('c', 'Cada capa tiene un punto ciego.')],
    words,
  );
  assert.deepEqual(found.map((f) => [f.id, f.found]), [['a', true], ['b', false], ['c', true]]);
  assert.deepEqual([found[2].first, found[2].last], [6, 11]);
});

test('parseSilences reads ffmpeg silencedetect output', () => {
  const stderr = [
    '[silencedetect @ 000001] silence_start: 0',
    '[silencedetect @ 000001] silence_end: 1.25 | silence_duration: 1.25',
    'size=N/A time=00:00:05.00',
    '[silencedetect @ 000001] silence_start: 3.5',
    '[silencedetect @ 000001] silence_end: 4.1 | silence_duration: 0.6',
    '[silencedetect @ 000001] silence_start: 9.9',
  ].join('\n');
  assert.deepEqual(parseSilences(stderr, 10000), [
    { startMs: 0, endMs: 1250 },
    { startMs: 3500, endMs: 4100 },
    { startMs: 9900, endMs: 10000 },
  ]);
});

test('cutPoints snaps each edge to the nearest silence, with a little air', () => {
  const words = W([['uno', 1000, 1400], ['dos', 1500, 1900], ['tres', 3000, 3400]]);
  const silences = [{ startMs: 0, endMs: 950 }, { startMs: 2000, endMs: 2900 }];
  const [cut] = cutPoints([{ id: 'a', found: true, first: 0, last: 1 }], words, silences, 5000);
  assert.deepEqual(cut, { id: 'a', startMs: 870, endMs: 2120 });
});

test('cutPoints cuts between two words when there is no silence, never inside a neighbour', () => {
  const words = W([['uno', 1000, 1400], ['dos', 1500, 1900], ['tres', 2000, 2400]]);
  const [cut] = cutPoints([{ id: 'a', found: true, first: 1, last: 1 }], words, [], 5000);
  assert.deepEqual(cut, { id: 'a', startMs: 1450, endMs: 1950 });
});

test('cutPoints skips segments that were not found', () => {
  assert.deepEqual(cutPoints([{ id: 'a', found: false }], W([['uno', 0, 400]]), [], 1000), []);
});

test('clipWords gives word boundaries relative to the clip start', () => {
  const words = W([['uno', 1000, 1400], ['dos', 1500, 1900]]);
  assert.deepEqual(clipWords(words, 0, 1, [{ startMs: 870, endMs: 2120 }]), [
    { text: 'uno', offsetMs: 130, durationMs: 400 },
    { text: 'dos', offsetMs: 630, durationMs: 400 },
  ]);
});

test('clipWords moves the words after a shortened pause back by what was removed', () => {
  const words = W([['uno', 1000, 1400], ['dos', 3000, 3400]]);
  const ranges = [{ startMs: 900, endMs: 1600 }, { startMs: 2900, endMs: 3500 }];
  assert.deepEqual(clipWords(words, 0, 1, ranges), [
    { text: 'uno', offsetMs: 100, durationMs: 400 },
    { text: 'dos', offsetMs: 800, durationMs: 400 },
  ]);
});

test('keepRanges shortens every pause inside the clip to maxPauseMs, keeping half of it on each side', () => {
  const cut = { startMs: 1000, endMs: 9000 };
  const silences = [
    { startMs: 500, endMs: 1100 }, // straddles the start: the edge is cutPoints' business
    { startMs: 3000, endMs: 4000 }, // 1000 ms inside: shortened to 300
    { startMs: 5000, endMs: 5250 }, // already short: kept
    { startMs: 6000, endMs: 7200 }, // 1200 ms inside: shortened to 300
    { startMs: 8900, endMs: 9500 }, // straddles the end
  ];
  assert.deepEqual(keepRanges(cut, silences, 300), [
    { startMs: 1000, endMs: 3150 },
    { startMs: 3850, endMs: 6150 },
    { startMs: 7050, endMs: 9000 },
  ]);
});

test('keepRanges leaves the clip whole without maxPauseMs or internal pauses', () => {
  const cut = { startMs: 1000, endMs: 9000 };
  assert.deepEqual(keepRanges(cut, [{ startMs: 3000, endMs: 4000 }], null), [cut]);
  assert.deepEqual(keepRanges(cut, [], 300), [cut]);
});

test('unusedRanges lists the recorded words that no segment uses', () => {
  const words = [...spoken('uno dos'), ...spoken('tres cuatro', 2000), ...spoken('cinco', 4000)];
  const ranges = unusedRanges([{ found: true, first: 0, last: 1 }, { found: true, first: 4, last: 4 }], words);
  assert.deepEqual(ranges, [{ startMs: 2000, endMs: 2900, text: 'tres cuatro' }]);
});

test('parseLoudness reads the loudnorm analysis JSON', () => {
  const stderr = 'blah\n[Parsed_loudnorm_0 @ 0001]\n{\n\t"input_i" : "-27.31",\n\t"input_tp" : "-6.02",\n\t"input_lra" : "5.10"\n}\n';
  assert.deepEqual(parseLoudness(stderr), { integrated: -27.31, truePeak: -6.02 });
});

test('gainDb reaches the target loudness unless that would push the peak past -1 dBTP', () => {
  assert.equal(gainDb({ integrated: -27, truePeak: -10 }, -20), 7);
  assert.equal(gainDb({ integrated: -27, truePeak: -4 }, -20), 3);
});

test('clipArgs (for the ffmpeg binary) seeks to the cut, applies the gain and encodes like the other providers', () => {
  const args = clipArgs({ source: 'rec.wav', ranges: [{ startMs: 870, endMs: 2120 }], gain: 3.5, out: 'a.mp3' });
  const input = args.indexOf('-i');
  assert.deepEqual(args.slice(input - 4, input + 2), ['-ss', '0.87', '-t', '1.25', '-i', 'rec.wav']);
  assert.equal(args.at(-1), 'a.mp3');
  assert.equal(args[args.indexOf('-af') + 1], 'volume=3.5dB');
  for (const flag of ['-ac', '1', '-ar', '24000', 'libmp3lame', '96k', '-write_xing', '0']) assert.ok(args.includes(flag), flag);
});

test('clipArgs splices the kept ranges of a clip whose pauses were shortened', () => {
  const ranges = [{ startMs: 1000, endMs: 3150 }, { startMs: 3850, endMs: 6000 }];
  const args = clipArgs({ source: 'rec.wav', ranges, gain: -1, out: 'a.mp3' });
  const input = args.indexOf('-i');
  assert.deepEqual(args.slice(input - 4, input + 2), ['-ss', '1', '-t', '5', '-i', 'rec.wav']);
  assert.equal(
    args[args.indexOf('-filter_complex') + 1],
    '[0:a]atrim=start=0:end=2.15,asetpts=PTS-STARTPTS[a0];[0:a]atrim=start=2.85:end=5,asetpts=PTS-STARTPTS[a1];[a0][a1]concat=n=2:v=0:a=1,volume=-1dB[out]',
  );
  assert.equal(args[args.indexOf('-map') + 1], '[out]');
  assert.ok(!args.includes('-af'));
  assert.equal(args.at(-1), 'a.mp3');
});

test('clipArgs speeds a clip up with atempo after the gain, and only when tempo is not 1', () => {
  const one = clipArgs({ source: 'rec.wav', ranges: [{ startMs: 870, endMs: 2120 }], gain: 3.5, out: 'a.mp3', tempo: 1.08 });
  assert.equal(one[one.indexOf('-af') + 1], 'volume=3.5dB,atempo=1.08');
  const ranges = [{ startMs: 1000, endMs: 3150 }, { startMs: 3850, endMs: 6000 }];
  const two = clipArgs({ source: 'rec.wav', ranges, gain: -1, out: 'a.mp3', tempo: 1.08 });
  assert.ok(two[two.indexOf('-filter_complex') + 1].endsWith('concat=n=2:v=0:a=1,volume=-1dB,atempo=1.08[out]'));
  assert.deepEqual(clipArgs({ source: 'rec.wav', ranges, gain: -1, out: 'a.mp3', tempo: 1 }), clipArgs({ source: 'rec.wav', ranges, gain: -1, out: 'a.mp3' }));
});

test('recordingSettings: narration.json "recording", overridden by the flags; none means tempo 1 and no pause limit', () => {
  assert.deepEqual(recordingSettings({}), { tempo: 1, maxPauseMs: null });
  assert.deepEqual(recordingSettings({ recording: { tempo: 1.08, maxPauseMs: 250 } }), { tempo: 1.08, maxPauseMs: 250 });
  assert.deepEqual(recordingSettings({ recording: { tempo: 1.08, maxPauseMs: 250 } }, { tempo: 1, maxPauseMs: 400 }), { tempo: 1, maxPauseMs: 400 });
  assert.throws(() => recordingSettings({ recording: { tempo: 1.5 } }), /between 0.8 and 1.25/);
  assert.throws(() => recordingSettings({ recording: { maxPauseMs: 50 } }), /at least 100/);
  assert.throws(() => recordingSettings({ recording: { speed: 1.1 } }), /unknown key\(s\) speed/);
  assert.throws(() => recordingSettings({ recording: [] }), /must be an object/);
});

test('withTempo shrinks the duration and word timings of a sped-up clip, and leaves tempo 1 alone', () => {
  const record = { provider: 'recording', durationMs: 2500, words: [{ text: 'hola', offsetMs: 0, durationMs: 500 }, { text: 'mundo', offsetMs: 1250, durationMs: 1000 }] };
  assert.equal(withTempo(record, 1), record);
  const fast = withTempo(record, 1.25);
  assert.equal(fast.tempo, 1.25);
  assert.equal(fast.durationMs, 2000);
  assert.deepEqual(fast.words, [{ text: 'hola', offsetMs: 0, durationMs: 400 }, { text: 'mundo', offsetMs: 1000, durationMs: 800 }]);
  assert.equal(fast.provider, 'recording');
});

test('asrCacheValid: the same recording and model reuse the transcript, whatever the prompt', () => {
  const cached = { sha256: 'abc', model: 'small', prompt: 'Antes empezaba así.', words: [] };
  assert.equal(asrCacheValid(cached, { sha256: 'abc', model: 'small' }), true);
  assert.equal(asrCacheValid(cached, { sha256: 'def', model: 'small' }), false); // another recording
  assert.equal(asrCacheValid(cached, { sha256: 'abc', model: 'medium' }), false); // another model
  assert.equal(asrCacheValid({ sha256: 'abc', model: 'small' }, { sha256: 'abc', model: 'small' }), false); // no words
});

test('asrCacheValid: a transcript is only reused for the same stretches Whisper heard', () => {
  const old = { sha256: 'abc', model: 'small', words: [] }; // made before Whisper skipped long silences
  const clips = [{ startMs: 27000, endMs: 346000 }];
  assert.equal(asrCacheValid(old, { sha256: 'abc', model: 'small', clips: null }), true); // a published recording: unchanged
  assert.equal(asrCacheValid(old, { sha256: 'abc', model: 'small', clips }), false); // V10: heard the silence, redo it
  assert.equal(asrCacheValid({ ...old, clips }, { sha256: 'abc', model: 'small', clips: [{ startMs: 27000, endMs: 346000 }] }), true);
  assert.equal(asrCacheValid({ ...old, clips }, { sha256: 'abc', model: 'small', clips: [{ startMs: 26000, endMs: 346000 }] }), false);
  assert.equal(asrCacheValid({ ...old, clips }, { sha256: 'abc', model: 'small', clips: null }), false);
});

/** Silences of a recording: a lead of `lead` ms, then `gaps` (ms) spread out, then a tail of `tail` ms. */
function silencesOf({ lead = 0, gaps = [], tail = 0, totalMs }) {
  const out = lead ? [{ startMs: 0, endMs: lead }] : [];
  gaps.forEach((g, k) => out.push({ startMs: lead + (k + 1) * 60000, endMs: lead + (k + 1) * 60000 + g }));
  if (tail) out.push({ startMs: totalMs - tail, endMs: totalMs });
  return out;
}

test('asrClips: published recordings (silences up to 5.9 s at the edges, 13.7 s inside) are heard whole, as before', () => {
  // The longest silences of every published master (silencedetect -40 dB): pivot-infra's 5.9 s lead,
  // iam-halden's 13.7 s and ach-matriz's 12.6 s pauses, iam-halden's 5.3 s tail (its re-recording).
  assert.equal(asrClips(silencesOf({ lead: 5892, gaps: [13685, 12576, 11032], tail: 5263, totalMs: 713860 }), 713860), null);
  assert.equal(asrClips([], 60000), null);
});

test('asrClips: Whisper skips a long leading silence (V10 lost its first sentence after 28.5 s of it)', () => {
  const fx = JSON.parse(readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures', 'recording-lead-silence.json'), 'utf8'));
  // From 1 s before the voice, rounded out to whole seconds, to the end of the file.
  assert.deepEqual(asrClips(fx.silences, fx.totalMs), [{ startMs: 27000, endMs: 346000 }]);
});

test('asrClips: a long pause inside the recording and a long tail are skipped too, keeping 1 s of air', () => {
  const silences = [{ startMs: 0, endMs: 2000 }, { startMs: 100400, endMs: 130600 }, { startMs: 200300, endMs: 240000 }];
  assert.deepEqual(asrClips(silences, 240000), [{ startMs: 0, endMs: 102000 }, { startMs: 129000, endMs: 202000 }]);
  // edges count from 8 s, pauses inside from 15 s (a 12 s pause stays)
  assert.deepEqual(asrClips([{ startMs: 0, endMs: 9000 }, { startMs: 60000, endMs: 72000 }], 120000), [{ startMs: 8000, endMs: 120000 }]);
  // ffmpeg's duration is rounded to 10 ms: a silence that ends 5 ms before it still ends the file
  assert.deepEqual(asrClips([{ startMs: 100000, endMs: 109995 }], 110000), [{ startMs: 0, endMs: 101000 }]);
  // a click in the first few ms does not make the leading silence a pause, nor give Whisper a window of nothing
  assert.deepEqual(asrClips([{ startMs: 50, endMs: 28497 }], 345165), [{ startMs: 27000, endMs: 346000 }]);
  assert.deepEqual(asrClips([{ startMs: 50, endMs: 9000 }], 60000), [{ startMs: 8000, endMs: 60000 }]);
  // a recording that is all silence has nothing to transcribe: heard whole, Whisper finds nothing
  assert.equal(asrClips([{ startMs: 0, endMs: 60000 }], 60000), null);
});

test('parseDuration reads the input duration ffmpeg prints, in ms', () => {
  assert.equal(parseDuration('Input #0, wav, from \'a.wav\':\n  Duration: 00:05:45.17, bitrate: 1058 kb/s\n'), 345170);
  assert.equal(parseDuration('  Duration: 01:02:03.5, start: 0\n'), 3723500);
  assert.equal(parseDuration('no duration here'), null);
});

/** The V10 fixture located and cut as import-recording does it. */
function v10() {
  const fx = JSON.parse(readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures', 'recording-lead-silence.json'), 'utf8'));
  const segments = fx.segments.map((s) => seg(s.id, s.text));
  const words = repairSwallowedPauses(W(fx.words), fx.silences);
  const located = locateSegments(segments, words);
  const cuts = cutPoints(located, words, fx.silences, fx.totalMs);
  return { ...fx, words, located, cuts };
}

test('missingGaps: where a sentence that was not found should be, trimmed to the voice (V10 s01-01: 28.5–32.4 s)', () => {
  const { located, cuts, words, silences, totalMs } = v10();
  assert.deepEqual(located.map((f) => f.found), [false, true, true]);
  // From the start of the file to s01-02's cut; the voice starts after the 28.5 s silence and stops at the one
  // before «Cada», with 300 ms of that silence kept on each side.
  assert.deepEqual(missingGaps(located, cuts, words, silences, totalMs), [{ ids: ['s01-01'], startMs: 28197, endMs: 32653, heard: '' }]);
});

test('missingGaps: consecutive missing sentences share one gap, with what Whisper heard there', () => {
  const words = [...spoken('uno dos'), ...spoken('algo raro', 2000), ...spoken('cinco seis', 5000)];
  const located = [
    { id: 'a', found: true, score: 1, first: 0, last: 1 },
    { id: 'b', found: false, score: 0 },
    { id: 'c', found: false, score: 0 },
    { id: 'd', found: true, score: 1, first: 4, last: 5 },
  ];
  const cuts = [{ id: 'a', startMs: 0, endMs: 1000 }, { id: 'd', startMs: 4900, endMs: 6000 }];
  const silences = [{ startMs: 1000, endMs: 1900 }, { startMs: 2900, endMs: 4950 }];
  assert.deepEqual(missingGaps(located, cuts, words, silences, 6000), [{ ids: ['b', 'c'], startMs: 1600, endMs: 3200, heard: 'algo raro' }]);
  // no voice between the neighbours: nothing to cut
  const quiet = [{ startMs: 900, endMs: 5000 }];
  assert.deepEqual(missingGaps(located, cuts, W([['uno', 0, 400], ['dos', 500, 900], ['cinco', 5000, 5400], ['seis', 5500, 5900]]), quiet, 6000), [
    { ids: ['b', 'c'], startMs: null, endMs: null, heard: '' },
  ]);
});

test('recutLoudnessFilter measures a gap as recut_recording.py writes it: the voice, then its silence after each part', () => {
  // V10: the bare excerpt measured -19.23 LUFS, the recut file -19.53, so --lufs gave the clip 0.3 dB more gain.
  const recut = readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'recut_recording.py'), 'utf8');
  const gap = /"--gap", type=float, default=([\d.]+)/.exec(recut)[1];
  assert.equal(recutLoudnessFilter(), `apad=pad_dur=${gap},loudnorm=print_format=json`);
});

test('recutAdvice: the cause and the exact commands to cut the sentence out and import just that', () => {
  const gap = { ids: ['s01-01'], startMs: 28197, endMs: 32653, heard: '' };
  const lines = recutAdvice(gap, {
    file: 'video/engine/voices/logs-halden lidia (master).wav',
    out: 'video/engine/voices/logs-halden lidia s01-01 (recorte).wav',
    slug: 'logs-halden',
    name: 'lidia',
    python: 'video/engine/.venv-chatterbox/Scripts/python.exe',
    lufs: -18.07,
  }).join('\n');
  assert.match(lines, /s01-01 .*0:28\.2–0:32\.7/);
  assert.match(lines, /Whisper heard nothing/);
  assert.ok(lines.includes('video/engine/.venv-chatterbox/Scripts/python.exe video/engine/scripts/recut_recording.py --out "video/engine/voices/logs-halden lidia s01-01 (recorte).wav" --part "video/engine/voices/logs-halden lidia (master).wav@28.20-32.65"'), lines);
  assert.ok(lines.includes('node video/engine/scripts/import-recording.mjs --video logs-halden --file "video/engine/voices/logs-halden lidia s01-01 (recorte).wav" --name lidia --only s01-01 --lufs=-18.07'), lines);
  // heard but too far from the script: listen first
  assert.match(recutAdvice({ ...gap, heard: 'esta manana tu' }, { file: 'a.wav', out: 'b.wav', slug: 'x', name: 'n', python: 'py', lufs: -18 }).join('\n'), /heard «esta manana tu»/);
  // no voice at all: it was not recorded, no commands
  const none = recutAdvice({ ids: ['s02-03', 's02-04'], startMs: null, endMs: null, heard: '' }, { file: 'a.wav', out: 'b.wav', slug: 'x', name: 'n', python: 'py', lufs: -18 });
  assert.match(none.join('\n'), /s02-03, s02-04.*no voice/);
  assert.ok(!none.join('\n').includes('recut_recording'));
});

test('repairSwallowedPauses: a word whose span swallowed a pause starts after it (V4 s03-05/06: «IP» was cut)', () => {
  // Whisper gave «y» 151.22–153.10 s: the pause after «IP» (really 151.39–152.53) is inside it, off its edges.
  const words = W([['misma', 150640, 150980], ['IP', 150980, 151220], ['y', 151220, 153100], ['el', 153100, 153240]]);
  const silences = [{ startMs: 151390, endMs: 152530 }];
  const fixed = repairSwallowedPauses(words, silences);
  assert.deepEqual(fixed.map((w) => [w.text, w.startMs, w.endMs]), [['misma', 150640, 150980], ['IP', 150980, 151220], ['y', 152530, 153100], ['el', 153100, 153240]]);
  // and a word whose end swallowed the pause after it ends where the pause starts
  const tail = repairSwallowedPauses(W([['suya.', 1000, 3000], ['Ese', 3000, 3200]]), [{ startMs: 1500, endMs: 2950 }]);
  assert.deepEqual(tail.map((w) => [w.startMs, w.endMs]), [[1000, 1500], [3000, 3200]]);
  // short pauses and pauses between words are left alone
  const same = W([['a', 0, 400], ['b', 600, 1000]]);
  assert.deepEqual(repairSwallowedPauses(same, [{ startMs: 400, endMs: 600 }, { startMs: 700, endMs: 800 }]), same);
});

test('cutPoints no longer cuts «IP» once the swallowed pause is repaired', () => {
  const words = W([['misma', 150640, 150980], ['IP', 150980, 151220], ['y', 151220, 153100], ['el', 153100, 153240]]);
  const silences = [{ startMs: 151390, endMs: 152530 }];
  const located = [{ id: 'a', found: true, first: 0, last: 1 }, { id: 'b', found: true, first: 2, last: 3 }];
  const [a, b] = cutPoints(located, repairSwallowedPauses(words, silences), silences, 160000);
  assert.ok(a.endMs >= 151390, `«IP» must end in the pause, got ${a.endMs}`);
  assert.ok(b.startMs >= 152400, `the next clip must start at the end of the pause, got ${b.startMs}`);
});

test('cutPoints: a word Whisper dropped stays in its clip (V4 s02-03 lost «WHOIS» to the next one)', () => {
  // «Eso es el júis. [pause] Y la tercera…»: Whisper never wrote «júis» and stretched «Y» over it, so the pause
  // after «júis» (70824–72044) starts inside «Y» and ends inside «la», and no silence touches the el|Y edge.
  const words = W([['Eso', 69160, 69500], ['es', 69500, 69840], ['el', 69840, 70120], ['Y', 70120, 71180], ['la', 71180, 72240], ['tercera', 72240, 72860]]);
  const silences = [{ startMs: 69068, endMs: 69276 }, { startMs: 70824, endMs: 72044 }];
  const located = [{ id: 'a', found: true, first: 0, last: 2 }, { id: 'b', found: true, first: 3, last: 5 }];
  const [a, b] = cutPoints(located, repairSwallowedPauses(words, silences), silences, 80000);
  assert.ok(a.endMs >= 70824, `«júis» must stay in the first clip, got ${a.endMs}`);
  assert.ok(b.startMs >= 72044 - 80, `the next clip must start after the pause, got ${b.startMs}`);
  // a correctly timed pair (no pause starting inside a word) keeps the old midpoint fallback
  const tight = W([['el', 0, 300], ['Y', 300, 450], ['la', 450, 600]]);
  const [c, d] = cutPoints([{ id: 'c', found: true, first: 0, last: 0 }, { id: 'd', found: true, first: 1, last: 2 }], tight, [{ startMs: 700, endMs: 1200 }], 2000);
  assert.deepEqual([c.endMs, d.startMs], [300, 300]);
});

test('trailingSpeechEnd: where the voice of a clip really stops (a silence that runs to its end), else its length', () => {
  assert.equal(trailingSpeechEnd([{ startMs: 300, endMs: 500 }, { startMs: 4200, endMs: 4510 }], 4520), 4200);
  assert.equal(trailingSpeechEnd([{ startMs: 300, endMs: 500 }], 4520), 4520);
  assert.equal(trailingSpeechEnd([], 4520), 4520);
});

test('ffmpegBinary finds the ffmpeg that Remotion ships, to run it without the CLI wrapper', () => {
  const bin = ffmpegBinary();
  assert.ok(existsSync(bin), bin);
  assert.match(path.basename(bin), /^ffmpeg(\.exe)?$/);
});

test('asrPrompt opens with a sentence of the script, then the adversary and the lexicon terms', () => {
  // A bare comma list reads to Whisper as a list: it then numbers the sentences («2. 3. 4.»).
  const opening = 'Autoridad Portuaria de Halden, 3 de septiembre, por la tarde. Por la puerta del correo entra un mensaje.';
  assert.equal(
    asrPrompt({ opening, adversary: 'SILENT PAGER', lexicon: { SOC: 'soc', DMARC: 'de marc' } }),
    'Autoridad Portuaria de Halden, 3 de septiembre, por la tarde. SILENT PAGER. SOC, DMARC.',
  );
  assert.equal(asrPrompt({ opening: 'Hola, mundo', lexicon: { SOC: 'soc' } }), 'Hola, mundo. SOC.');
  assert.equal(asrPrompt({ lexicon: {} }), '');
});

test('selectSegments keeps the listed segments in script order and rejects unknown ids', () => {
  const segments = [{ id: 's01-01' }, { id: 's01-02' }, { id: 's02-01' }];
  assert.equal(selectSegments(segments, null), segments);
  assert.deepEqual(selectSegments(segments, ['s02-01', 's01-01']).map((s) => s.id), ['s01-01', 's02-01']);
  assert.throws(() => selectSegments(segments, ['s01-01', 's09-09']), /s09-09/);
});

test('recordingRecord is a TTS record keyed like every provider, with the cut and the ASR check', () => {
  const words = W([['uno', 1000, 1400], ['dos', 1500, 1900]]);
  const rec = recordingRecord({
    voice: 'recording/lidia',
    rate: '+0%',
    pitch: '+0Hz',
    spoken: 'uno dos',
    bytes: 1234,
    ranges: [{ startMs: 870, endMs: 1500 }, { startMs: 1600, endMs: 2120 }],
    located: { first: 0, last: 1, score: 0.97, heard: 'uno dos' },
    words,
    source: { file: 'rec.wav', sha256: 'abc', gainDb: 3.5 },
    asrModel: 'small',
  });
  assert.equal(rec.provider, 'recording');
  assert.equal(rec.key, ttsKey('recording/lidia', '+0%', '+0Hz', 'uno dos'));
  assert.equal(rec.durationMs, 1150);
  assert.equal(rec.bytes, 1234);
  assert.equal(rec.bitrateKbps, 96);
  assert.deepEqual(rec.source, { file: 'rec.wav', sha256: 'abc', gainDb: 3.5, startMs: 870, endMs: 2120, pausesRemovedMs: 100 });
  assert.deepEqual(rec.asr, { model: 'small', text: 'uno dos', score: 0.97 });
  assert.deepEqual(rec.words, clipWords(words, 0, 1, [{ startMs: 870, endMs: 1500 }, { startMs: 1600, endMs: 2120 }]));
});

test('importReport flags weak and missing sentences and lists what was left out', () => {
  const words = [...spoken('uno dos'), ...spoken('tres cuatro', 2000)];
  const located = [
    { id: 's01-01', found: true, score: 0.99, first: 0, last: 1, heard: 'uno dos' },
    { id: 's01-02', found: true, score: REVIEW_SCORE - 0.01, first: 2, last: 3, heard: 'tres cuatro' },
    { id: 's01-03', found: false, score: 0 },
  ];
  const cuts = [{ id: 's01-01', startMs: 0, endMs: 900 }, { id: 's01-02', startMs: 2000, endMs: 3000 }];
  const report = importReport({ located, cuts, words: [...words, ...spoken('sobra', 5000)], gain: 2.5, pausesRemovedMs: 54300 });
  assert.match(report, /pausas internas recortadas: 54\.3 s/i);
  assert.match(report, /\| s01-01 \| 0\.99 \| 0:00\.0–0:00\.9 \| ok \|/);
  assert.match(report, /\| s01-02 \| 0\.8\d \| 0:02\.0–0:03\.0 \| revisar \|/);
  assert.match(report, /\| s01-03 \| — \| — \| no encontrada \|/);
  assert.match(report, /0:05\.0–0:05\.4 · sobra/);
  assert.match(report, /\+2\.5 dB/);
});

test('cutPoints caps the air before the first word when maxLeadMs is given (a breath ended the silence early)', () => {
  const words = [
    { text: 'uno', startMs: 1000, endMs: 1400 },
    { text: 'dos', startMs: 1500, endMs: 1900 },
  ];
  // the silence ends at 600 ms: a breath from 600 to 950 ms sits between it and the first word
  const silences = [{ startMs: 0, endMs: 600 }];
  const found = [{ id: 'a', found: true, first: 0, last: 1 }];
  const [plain] = cutPoints(found, words, silences, 5000);
  const [capped] = cutPoints(found, words, silences, 5000, { maxLeadMs: 250 });
  assert.equal(plain.startMs, 520); // the breath rides in, as before
  assert.equal(capped.startMs, 750); // 250 ms before the word, no breath
  assert.equal(capped.endMs, plain.endMs);
});

test('cutPoints with maxLeadMs leaves an edge that is already close alone', () => {
  const words = [{ text: 'uno', startMs: 1000, endMs: 1400 }];
  const silences = [{ startMs: 0, endMs: 960 }];
  const found = [{ id: 'a', found: true, first: 0, last: 0 }];
  const [plain] = cutPoints(found, words, silences, 5000);
  const [capped] = cutPoints(found, words, silences, 5000, { maxLeadMs: 250 });
  assert.equal(capped.startMs, plain.startMs);
});

test('cutPoints follows the sound when Whisper starts the first word long before the voice', () => {
  // the word is stamped at 1000 ms but the voice only begins where the silence ends, at 1700 ms
  const words = [
    { text: 'uno', startMs: 1000, endMs: 2400 },
    { text: 'dos', startMs: 2500, endMs: 2900 },
  ];
  const silences = [{ startMs: 200, endMs: 1700 }];
  const [cut] = cutPoints([{ id: 'a', found: true, first: 0, last: 1 }], words, silences, 6000);
  assert.equal(cut.startMs, 1620); // 80 ms of air before the real onset, not 250 ms before the stamped start
});

test('cutPoints keeps the old edge when the silence it would snap to ends after the next word', () => {
  const words = [
    { text: 'uno', startMs: 1000, endMs: 1300 },
    { text: 'dos', startMs: 1400, endMs: 1800 },
  ];
  const silences = [{ startMs: 200, endMs: 1500 }]; // would swallow «uno» whole: not an onset
  const [cut] = cutPoints([{ id: 'a', found: true, first: 0, last: 1 }], words, silences, 6000);
  assert.ok(cut.startMs <= 1000);
});

test('stretchedWords flags a word Whisper stretched over a dropped retake, and says where the clean take starts', () => {
  const words = [
    { text: 'protege', startMs: 77000, endMs: 77800 },
    { text: 'disco', startMs: 78000, endMs: 83100 },
    { text: 'si', startMs: 83200, endMs: 83400 },
    { text: 'CVSS,', startMs: 84000, endMs: 86400 }, // a spelled acronym is slow on its own
  ];
  const silences = [{ startMs: 78350, endMs: 81150 }];
  const found = [{ id: 's03-03', found: true, first: 0, last: 3 }];
  const out = stretchedWords(found, words, silences);
  assert.equal(out.length, 1);
  assert.deepEqual(out[0], { id: 's03-03', text: 'disco', startMs: 78000, endMs: 83100, retakeMs: 81150 });
  assert.deepEqual(stretchedWords([{ id: 'x', found: false }], words, silences), []);
});
