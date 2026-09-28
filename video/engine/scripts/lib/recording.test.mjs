import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { analyzeNarration, isRecordingVoice, spokenForVoice, ttsKey } from './narration.mjs';
import { ffmpegBinary } from './remotion.mjs';
import { parseSegmentText } from './text.mjs';
import {
  REVIEW_SCORE,
  asrPrompt,
  clipArgs,
  clipWords,
  cutPoints,
  gainDb,
  importReport,
  keepRanges,
  locateSegments,
  parseLoudness,
  parseSilences,
  recordingRecord,
  selectSegments,
  similarity,
  unusedRanges,
} from './recording.mjs';

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
