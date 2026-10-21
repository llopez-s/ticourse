import assert from 'node:assert/strict';
import test from 'node:test';
import { clipFindings, repeatedPhrases, reportIsCurrent, voiceReport } from './verify-voice.mjs';

const ok = { head: 0.02, tail: 0.05, dropped: 0.01 };

test('repeatedPhrases: a phrase heard twice that the script says once is a leftover take', () => {
  const script = 'Hoy sí. Pero el WHOIS también tiene memoria. Quedan fichas antiguas, de antes de que activaran la privacidad.';
  const heard = 'Hoy sí, pero el juiz también tiene memoria. Quedan fichas antiguas. Quedan fichas antiguas de antes de que activaran la privacidad.';
  assert.ok(repeatedPhrases(script, heard).includes('quedan fichas antiguas'));
  // mishearings replace words, they do not repeat phrases
  assert.deepEqual(repeatedPhrases('El C2 usa uno autofirmado.', 'El cedos usa uno auto firmado.'), []);
  // a phrase the script itself repeats is fine
  assert.deepEqual(repeatedPhrases('Una, cuenta. Una, cuenta.', 'Una cuenta. Una cuenta.'), []);
});

test('clipFindings: V4 s03-05 lost «IP» (stopped loud), s08-04 lost «siguiente» (voice after the cut)', () => {
  const ip = clipFindings({ id: 's03-05', script: '¿Qué otros dominios han vivido en esa misma IP?', heard: '¿Qué otros dominios han vivido en esa misma...', ...ok, tail: 1.0 });
  assert.ok(ip.errors.some((e) => /s03-05: stops inside a word/.test(e)), ip.errors.join('\n'));
  const end = clipFindings({ id: 's08-04', script: 'Y el actor pasa al siguiente.', heard: 'Y el actor pasa al sigui', ...ok, dropped: 0.46 });
  assert.ok(end.errors.some((e) => /voice goes on after the part the video plays/.test(e)));
});

test('clipFindings: a clean clip has no errors; a clip the ASR mangles is only a warning to listen', () => {
  const clean = clipFindings({ id: 's01-01', script: 'Hoy las seguimos.', heard: 'Hoy las seguimos.', ...ok });
  assert.deepEqual([clean.errors, clean.warnings], [[], []]);
  // V4 s04-02 as Whisper heard it alone: close enough (0.84), nothing to report
  const misheard = clipFindings({ id: 's04-02', script: 'Que tu sospechoso viva en el bloque no convierte a sus vecinos en cómplices.', heard: 'Que tus suspechos subivan el bloco y no conviertes sus vecinos en cómplices.', ...ok });
  assert.deepEqual([misheard.errors, misheard.warnings], [[], []]);
  // far from the script: listen, but it does not stop the render
  const garbled = clipFindings({ id: 's01-01', script: 'Tienes un dominio malicioso y una IP con catorce mil vecinos. ¿Por dónde tiras?', heard: 'Quiénes el dinero mágico y unas pipas con catorce villanos por dónde', ...ok });
  assert.deepEqual(garbled.errors, []);
  assert.equal(garbled.warnings.length, 1);
});

test('reportIsCurrent and voiceReport', () => {
  assert.equal(reportIsCurrent({ sourceHash: 'a' }, { sourceHash: 'a' }), true);
  assert.equal(reportIsCurrent({ sourceHash: 'a' }, { sourceHash: 'b' }), false);
  assert.equal(reportIsCurrent(null, { sourceHash: 'a' }), false);
  const md = voiceReport({ slug: 'x', rows: [{ id: 's01-01', similarity: 1, head: 0, tail: 0, dropped: 0, heard: 'hola' }], errors: ['s01-01: stops inside a word'], warnings: [] });
  assert.match(md, /Errores: 1/);
  assert.match(md, /\| s01-01 \| 1\.00 \|/);
});

test('clipFindings: V19 s03-03 hid a half-said take under a stretched word and untranscribed voice', () => {
  const script = 'El cifrado en reposo protege el disco si se lo llevan. Pero la consulta trucada sale de la propia aplicación.';
  const heard = 'El cifrado en reposo protege el disco si se lo llevan. Pero la consulta trucada sale de la propia aplicación.';
  const words = [
    { text: 'El', start: 0.0, end: 0.4 },
    { text: 'disco', start: 2.2, end: 4.4 }, // Whisper stretched it over the retake it did not transcribe
    { text: 'si', start: 4.4, end: 4.6 },
  ];
  const f = clipFindings({ id: 's03-03', script, heard, ...ok, words, unheard: [[2.6, 2.8]], gaps: [[2.0, 0.5]] });
  assert.equal(f.errors.length, 2);
  assert.match(f.errors[0], /«disco» lasts 2\.2 s/);
  assert.match(f.errors[1], /2\.8 s of voice at 2\.6 s/);
  assert.equal(f.warnings.length, 0); // a 0.5 s silence alone is not enough to warn
});

test('clipFindings: V21 s01-01, the tail of a number Whisper wrote in figures is not a leftover take', () => {
  const script = 'La clave del wifi de las tabletas la sabe toda la terminal, y no cambia desde dos mil veintidós.';
  const heard = 'La clave del wifi de las tabletas la sabe toda la terminal y no cambia desde 2022.';
  const words = [
    { text: 'desde', start: 4.1, end: 4.4 },
    { text: '2022.', start: 4.4, end: 4.94 }, // «dos mil veintidós» goes on until 5.54 s
  ];
  const f = clipFindings({ id: 's01-01', script, heard, ...ok, words, unheard: [[5.1, 0.44]], gaps: [] });
  assert.deepEqual(f.errors, []);
  assert.equal(f.warnings.length, 1);
  assert.match(f.warnings[0], /0\.4 s of voice right after «2022»/);
  // the same voice after a word in letters, far from the figure or much longer than the figure could take, is still an error
  const inLetters = clipFindings({ id: 's01-01', script, heard, ...ok, words: [{ text: 'veintidós.', start: 4.4, end: 4.94 }], unheard: [[5.1, 0.44]] });
  assert.equal(inLetters.errors.length, 1);
  const far = clipFindings({ id: 's01-01', script, heard, ...ok, words, unheard: [[5.6, 0.44]] });
  assert.equal(far.errors.length, 1);
  const long = clipFindings({ id: 's01-01', script, heard, ...ok, words, unheard: [[5.1, 1.6]] });
  assert.equal(long.errors.length, 1);
});

test('clipFindings: AP03 s06-01, «95 %» is spoken «noventa y cinco por ciento»: the voice after the % is the number itself', () => {
  const script = 'El percentil noventa y cinco indica el tiempo dentro del que llegó el noventa y cinco por ciento de los elementos.';
  const words = [
    { text: '95', start: 6.1, end: 6.6 },
    { text: '%', start: 6.6, end: 7.0 },
  ];
  const f = clipFindings({ id: 's06-01', script, heard: script, ...ok, words, unheard: [[7.1, 0.45]] });
  assert.deepEqual(f.errors, []);
  assert.equal(f.warnings.length, 1);
  // the ASR often writes «95%» as one word, ending early: «por ciento» follows it
  const glued = [{ text: '95%', start: 6.1, end: 6.9 }];
  assert.deepEqual(clipFindings({ id: 's06-01', script, heard: script, ...ok, words: glued, unheard: [[7.5, 0.4]] }).errors, []);
  // far from the percent sign, or longer than «por ciento» can take, it is still an error
  assert.equal(clipFindings({ id: 's06-01', script, heard: script, ...ok, words, unheard: [[8.3, 0.45]] }).errors.length, 1);
  assert.equal(clipFindings({ id: 's06-01', script, heard: script, ...ok, words, unheard: [[7.1, 1.9]] }).errors.length, 1);
});

test('clipFindings: spelled acronyms may be long, a long silence only asks to listen', () => {
  const script = 'Esta es la nota base del CVSS, de cero a diez.';
  const words = [{ text: 'CVSS,', start: 1.5, end: 3.9 }];
  const f = clipFindings({ id: 's02-02', script, heard: script, ...ok, words, unheard: [], gaps: [[4.0, 0.7]] });
  assert.deepEqual(f.errors, []);
  assert.equal(f.warnings.length, 1);
  assert.match(f.warnings[0], /0\.7 s silence at 4\.0 s/);
});

test('clipFindings: V26 s01-03 «PaperGovernor» is two words glued by Whisper, not a stretched half-said take', () => {
  const glued = clipFindings({
    id: 's01-03',
    script: 'Y vuelve PAPER GOVERNOR, que vive en los huecos de tu gobernanza.',
    heard: 'Y vuelve PaperGovernor, que vive en los huecos de tu gobernanza.',
    ...ok,
    words: [{ text: 'PaperGovernor,', start: 0.7, end: 2.1 }],
  });
  assert.deepEqual(glued.errors, []);
  // one word of the same length is still suspicious
  const single = clipFindings({ id: 's01-03', script: 'Y vuelve.', heard: 'Y vuelve.', ...ok, words: [{ text: 'gobernanza', start: 0.7, end: 2.1 }] });
  assert.ok(single.errors.some((e) => /lasts 1\.4 s/.test(e)));
});

test('repeatedPhrases: a word the ASR writes the same wrong way twice is not a leftover take (AP01 s08-01, «token» heard as «toque»)', () => {
  const script = 'La ficha dice que pudo exponerse un token de acceso, con lectura delegada. No menciona un token de renovación.';
  const heard = 'La ficha dice que pudo exponerse un toque de acceso, con lectura delegada. No menciona un toque de renovación.';
  assert.deepEqual(repeatedPhrases(script, heard), []);
});

test('repeatedPhrases: «50.000 € al año … 20.000 € al año» is the script saying «euros al año» twice', () => {
  const script = 'La ALE son 50.000 € al año. Y el control cuesta 20.000 € al año.';
  const heard = 'La ale son 50.000 euros al año y el control cuesta 20.000 euros al año.';
  assert.deepEqual(repeatedPhrases(script, heard), []);
});
