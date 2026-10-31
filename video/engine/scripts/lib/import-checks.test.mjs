import assert from 'node:assert/strict';
import test from 'node:test';
import { expectedReadingMs, joinNegativeValues, longClips, longPauses, recutAdvice, repeatedOpenings, restartGap, unheardVoice, withoutStretch } from './recording.mjs';

/** Words read one after another from `startMs`, 350 ms each with 50 ms between them; `pauses` = {index: ms before it}. */
function read(text, startMs, pauses = {}) {
  const out = [];
  let t = startMs;
  text.split(' ').forEach((w, k) => {
    t += pauses[k] ?? 0;
    out.push({ text: w, startMs: t, endMs: t + 350 });
    t += 400;
  });
  return out;
}

const WORDS_8S = 'La autoridad portuaria guarda cada copia del registro en dos sitios distintos, y solo una de ellas se puede tocar desde la red.';

test('expectedReadingMs: the text read once at 2.7 words a second', () => {
  assert.equal(expectedReadingMs('uno dos tres cuatro cinco seis siete ocho nueve diez once doce trece catorce quince dieciséis diecisiete dieciocho diecinueve veinte veintiuno veintidós veintitrés veinticuatro veinticinco veintiséis veintisiete'), 10000);
  assert.equal(expectedReadingMs('Hola — ¿qué tal?'), Math.round((3 / 2.7) * 1000)); // a dash is not a word
});

test('longClips: producto-bluf s03-06 lasted 20 s and s06-01 13 s for sentences of about 8 s; a slow clean reading does not count', () => {
  const expected = expectedReadingMs(WORDS_8S);
  assert.ok(expected > 8000 && expected < 9000, String(expected));
  const out = longClips([
    { id: 's03-06', text: WORDS_8S, durationMs: 20000 },
    { id: 's06-01', text: WORDS_8S, durationMs: 13500 },
    { id: 's02-01', text: WORDS_8S, durationMs: 11000 }, // slow, but under 1.5×
    { id: 's01-01', text: 'Buenas noches, Halden.', durationMs: 2700 }, // 2.4× of 1.1 s, but only 1.6 s over
  ]);
  assert.deepEqual(out.map((c) => c.id), ['s03-06', 's06-01']);
  assert.deepEqual(out[0], { id: 's03-06', durationMs: 20000, expectedMs: expected, ratio: Math.round((20000 / expected) * 100) / 100 });
});

test('repeatedOpenings: a first sentence read again after a pause of more than 1 s is a take the cut kept whole', () => {
  const seg = { id: 's06-03', text: 'Hoy revisamos la cadena de custodia. Después vemos el informe.' };
  const half = read('Hoy revisamos la cadena', 10000);
  const full = read('Hoy revisamos la cadena de custodia. Después vemos el informe.', half.at(-1).endMs + 1400);
  const words = [...half, ...full];
  const cut = { id: 's06-03', startMs: 9800, endMs: full.at(-1).endMs + 200 };
  const silences = [{ startMs: half.at(-1).endMs + 50, endMs: full[0].startMs - 30 }];
  const [row, ...rest] = repeatedOpenings([seg], [cut], words, silences);
  assert.deepEqual(rest, []);
  assert.equal(row.id, 's06-03');
  assert.equal(row.sentence, 0);
  assert.equal(row.firstMs, 10000);
  assert.equal(row.againMs, full[0].startMs);
  assert.ok(row.pauseMs >= 1400);
  // keep from just before the restart to the end of the clip
  assert.deepEqual(restartGap(row, cut), { ids: ['s06-03'], startMs: full[0].startMs - 300, endMs: cut.endMs + 300 });
  // the same pause found by silencedetect when Whisper stretched the last word over it
  const stretched = words.map((w, k) => (k === half.length - 1 ? { ...w, endMs: full[0].startMs - 100 } : w));
  assert.equal(repeatedOpenings([seg], [cut], stretched, silences).length, 1);
  assert.deepEqual(repeatedOpenings([seg], [cut], stretched, []), []); // no pause of 1 s anywhere: a stutter, not a take
});

test('repeatedOpenings: a later sentence restarted keeps what comes before its first reading, spliced (s09-07)', () => {
  const seg = { id: 's09-07', text: 'El aviso llegó a las tres. Después vemos el informe final.' };
  const first = read('El aviso llegó a las tres.', 50000);
  const half = read('Después vemos el', first.at(-1).endMs + 600);
  const again = read('Después vemos el informe final.', half.at(-1).endMs + 1200);
  const words = [...first, ...half, ...again];
  const cut = { id: 's09-07', startMs: 49800, endMs: again.at(-1).endMs + 200 };
  const [row] = repeatedOpenings([seg], [cut], words, []);
  assert.equal(row.sentence, 1);
  assert.equal(row.firstMs, half[0].startMs);
  assert.equal(row.beforeFirstMs, first.at(-1).endMs);
  const gap = restartGap(row, cut);
  assert.deepEqual(gap.parts, [
    { startMs: 49800, endMs: first.at(-1).endMs + 150 },
    { startMs: again[0].startMs - 300, endMs: cut.endMs + 300 },
  ]);
  const lines = recutAdvice(gap, { file: 'video/engine/voices/x.wav', out: 'video/engine/voices/x arreglo.wav', slug: 'demo', name: 'lidia', python: 'py', lufs: -18.5 });
  assert.equal((lines[1].match(/--part /g) ?? []).length, 2);
  assert.match(lines[2], /--only s09-07 --lufs=-18.5$/);
});

test('repeatedOpenings: sentences read once with their natural pauses, or a clip with no cut, are left alone', () => {
  const seg = { id: 's02-01', text: 'Hoy revisamos la cadena de custodia. Después vemos el informe.' };
  const words = [...read('Hoy revisamos la cadena de custodia.', 1000), ...read('Después vemos el informe.', 5000)];
  const cut = { id: 's02-01', startMs: 800, endMs: 7000 };
  assert.deepEqual(repeatedOpenings([seg], [cut], words, [{ startMs: 3400, endMs: 4950 }]), []);
  assert.deepEqual(repeatedOpenings([seg], [], words, []), []);
  // words outside the cut (the next segment's) do not count
  const next = read('Hoy revisamos la cadena', 9000);
  assert.deepEqual(repeatedOpenings([seg], [cut], [...words, ...next], []), []);
});

test('longPauses: the pauses of 1 s or more inside a cut, part by part', () => {
  const cut = { startMs: 0, endMs: 20000, parts: [{ startMs: 0, endMs: 8000 }, { startMs: 12000, endMs: 20000 }] };
  const silences = [{ startMs: 2000, endMs: 2500 }, { startMs: 5000, endMs: 6200 }, { startMs: 9000, endMs: 11000 }, { startMs: 15000, endMs: 16500 }];
  assert.deepEqual(longPauses(cut, silences), [silences[1], silences[3]]);
});

test('joinNegativeValues: «--lufs -18» reaches parseArgs as «--lufs=-18»; other arguments are left as they are', () => {
  assert.deepEqual(joinNegativeValues(['--video', 'x', '--lufs', '-18', '--only', 's01-01']), ['--video', 'x', '--lufs=-18', '--only', 's01-01']);
  assert.deepEqual(joinNegativeValues(['--gain', '-2.5', '--noise', '-40dB']), ['--gain=-2.5', '--noise=-40dB']);
  assert.deepEqual(joinNegativeValues(['--lufs=-18', '--gain', '3']), ['--lufs=-18', '--gain', '3']);
  assert.deepEqual(joinNegativeValues(['--lufs', '--force-asr']), ['--lufs', '--force-asr']); // parseArgs reports the missing value
  assert.deepEqual(joinNegativeValues(['--only', '-18']), ['--only', '-18']);
  assert.deepEqual(joinNegativeValues(['--lufs']), ['--lufs']);
});

test('unheardVoice: producto-bluf s06-03, 1.9 s of voice between «periódico,» and «lo lees» that Whisper left out', () => {
  // times as the importer had them for the full recording (7:35.9 on)
  const words = [
    { text: 'es', startMs: 456047, endMs: 456200 },
    { text: 'como', startMs: 456200, endMs: 456420 },
    { text: 'el', startMs: 456420, endMs: 456560 },
    { text: 'titular', startMs: 456560, endMs: 456920 },
    { text: 'de', startMs: 456920, endMs: 457140 },
    { text: 'un', startMs: 457140, endMs: 457260 },
    { text: 'periódico,', startMs: 457260, endMs: 457780 },
    { text: 'lo', startMs: 459950, endMs: 460230 },
    { text: 'lees', startMs: 460230, endMs: 460690 },
    { text: 'y', startMs: 460690, endMs: 460910 },
    { text: 'decides', startMs: 460910, endMs: 461500 },
    { text: 'noticia.', startMs: 462100, endMs: 462700 },
  ];
  const cut = { id: 's06-03', startMs: 455967, endMs: 462900 };
  const silences = [{ startMs: 457530, endMs: 457780 }, { startMs: 459640, endMs: 460060 }, { startMs: 462750, endMs: 463400 }];
  const [row, ...rest] = unheardVoice([cut], words, silences);
  assert.deepEqual(rest, []);
  assert.equal(row.id, 's06-03');
  assert.equal(row.startMs, 457930); // «periódico,» + 150 ms
  assert.equal(row.endMs, 459640); // where the silence before the retake starts
  assert.ok(row.voicedMs >= 1500 && row.voicedMs <= 1900, String(row.voicedMs));
  // the clip without it: before + after, spliced in the silences around it
  const gap = withoutStretch(row, cut);
  assert.deepEqual(gap.parts, [{ startMs: 455967, endMs: 457910 }, { startMs: 459660, endMs: 463200 }]);
});

test('unheardVoice: s09-07, the 1.3 s came in two bits split by a short silence; a pause between sentences is silence, not voice', () => {
  const words = [
    { text: 'Eso', startMs: 10000, endMs: 10250 },
    { text: 'sí,', startMs: 10300, endMs: 10600 },
    { text: 'en', startMs: 12330, endMs: 12450 },
    { text: 'un', startMs: 12450, endMs: 12600 },
    { text: 'producto', startMs: 12600, endMs: 13000 },
  ];
  const cut = { id: 's09-07', startMs: 9900, endMs: 13100 };
  const split = [{ startMs: 11320, endMs: 11570 }, { startMs: 12110, endMs: 12360 }];
  assert.equal(unheardVoice([cut], words, split).length, 1);
  // the same 1.7 s all silent but for a breath: nothing
  assert.deepEqual(unheardVoice([cut], words, [{ startMs: 10650, endMs: 11900 }, { startMs: 12000, endMs: 12300 }]), []);
});

test('unheardVoice: the end of a figure Whisper timed short is the number itself; voice after the last word counts', () => {
  const words = [
    { text: 'la', startMs: 1000, endMs: 1150 },
    { text: '203', startMs: 1200, endMs: 1500 }, // «doscientos tres» goes on to 2.6 s
    { text: 'pide', startMs: 2750, endMs: 3000 },
  ];
  const cut = { id: 'x', startMs: 900, endMs: 3100 };
  assert.deepEqual(unheardVoice([cut], words, []), []);
  const inLetters = words.map((w) => (w.text === '203' ? { ...w, text: 'tres' } : w));
  assert.equal(unheardVoice([cut], inLetters, []).length, 1);
  // a voiced tail after the last word, inside the cut, counts too
  assert.equal(unheardVoice([{ id: 'y', startMs: 900, endMs: 4500 }], words, []).length, 1);
});
