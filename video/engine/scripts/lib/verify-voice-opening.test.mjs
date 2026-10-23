// The voice check's second net for a clip that lost its opening (documentos s02-01: the importer's own check is the first).
import assert from 'node:assert/strict';
import test from 'node:test';
import { clipFindings, missingOpening } from './verify-voice.mjs';

const ok = { head: 0.02, tail: 0.05, dropped: 0.01 };
const SCRIPT = 'Empezamos con un caso. El puerto necesita una regla para mandar documentos.';

test('missingOpening: a clip heard from the second word on lost its opening, the ASR garbling a word does not', () => {
  assert.deepEqual(missingOpening(SCRIPT, 'Con un caso. El puerto necesita una regla para mandar documentos.'), { skipped: 1, words: 'Empezamos' });
  assert.deepEqual(missingOpening(SCRIPT, 'Un caso. El puerto necesita una regla para mandar documentos.'), { skipped: 2, words: 'Empezamos con' });
  assert.equal(missingOpening(SCRIPT, 'Empezamos con un caso. El puerto necesita una regla para mandar documentos.'), null);
  // one word misheard is not a shifted sentence
  assert.equal(missingOpening(SCRIPT, 'Empesamos con un caso. El puerto necesita una regla para mandar documentos.'), null);
  assert.equal(missingOpening(SCRIPT, 'Zapatos con un caso. El puerto necesita una regla para mandar documentos.'), null);
  // too short to be sure
  assert.equal(missingOpening('Hola a todos.', 'A todos.'), null);
});

test('clipFindings warns, without blocking, about a clip that seems to start at its second word', () => {
  const f = clipFindings({ id: 's02-01', script: SCRIPT, heard: 'Con un caso. El puerto necesita una regla para mandar documentos.', ...ok });
  assert.deepEqual(f.errors, []);
  assert.ok(f.warnings.some((w) => /seems to start at its 2nd word, «Empezamos»/.test(w)), f.warnings.join('|'));
  assert.deepEqual(clipFindings({ id: 's02-01', script: SCRIPT, heard: SCRIPT, ...ok }).warnings, []);
});
