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
