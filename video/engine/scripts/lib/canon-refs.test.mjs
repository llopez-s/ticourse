import assert from 'node:assert/strict';
import test from 'node:test';
import { canonReport, canonTokens, findRefs, narrationTexts, refSource, stringLiterals } from './canon-refs.mjs';

test('canonTokens: hosts, accounts, IPs, domains, cases, hashes and times; not prose', () => {
  const text =
    'A las 21:14, ADM-WS-02 abre una sesión hacia ADM-WS-07 (10.20.4.17); svc_tosreport entra en srv-tc-app03. ' +
    'Caso IR-2026-0147 · 02:00–04:30 · 38 GB hacia 203.0.113.47:443, dominio cdn-halden-sync.example, hash b41f0e7c…c7a2.';
  const tokens = canonTokens(text);
  for (const t of ['21:14', 'ADM-WS-02', 'ADM-WS-07', '10.20.4.17', 'svc_tosreport', 'IR-2026-0147', '02:00', '04:30', '203.0.113.47', 'cdn-halden-sync.example', 'b41f0e7c…c7a2']) {
    assert.ok(tokens.has(t), `missing ${t}`);
  }
  for (const t of ['A', 'las', 'sesión', '38', 'GB', 'srv-tc-app03']) {
    if (t === 'srv-tc-app03') continue; // a lowercase host is not one of the patterns; it is caught by its own rule below
    assert.ok(!tokens.has(t), `prose token ${t}`);
  }
  assert.ok(canonTokens('entra en srv-tc-app03.').has('srv-tc-app03'), 'lowercase server names with a digit suffix');
});

test('findRefs: whole tokens only, first hits per token, with file and line', () => {
  const corpus = [
    { file: 'video/siem/src/data/s09-pivot.ts', lines: ["  time: '01:52',", "  origin: 'ADM-WS-07',", "  x: '101:520'"] },
    { file: 'src/data/secplus/sp4-part6.ts', lines: ['Incautado: 2026-09-04 04:12 CEST', 'ADM-WS-070 is another host'] },
  ];
  const refs = findRefs(new Set(['01:52', 'ADM-WS-07', '04:12', '23:00']), corpus);
  assert.deepEqual(refs.get('01:52'), [{ file: 'video/siem/src/data/s09-pivot.ts', line: 1, text: "time: '01:52'," }]);
  assert.deepEqual(refs.get('ADM-WS-07').map((r) => r.line), [2], 'ADM-WS-070 is not ADM-WS-07');
  assert.equal(refs.get('04:12')[0].file, 'src/data/secplus/sp4-part6.ts');
  assert.deepEqual(refs.get('23:00'), []);
});

test('stringLiterals: only the strings of a TS source, not its identifiers', () => {
  const src = "export const CLOSED_BOXES = { host: 'ADM-WS-02', note: \"a las 16:15\", t: `sin ${x} agente` };";
  assert.deepEqual(stringLiterals(src), ['ADM-WS-02', 'a las 16:15', 'sin ${x} agente']);
});

test('narrationTexts: what is shown, without cues, directions or the spoken side', () => {
  const texts = narrationTexts({
    segments: [
      { text: '<calm> {logon}Pero [a las 01:52|a las dos menos ocho] entró.', intercept: { text: 'Formatea ya.' }, exam: { text: 'Contener: 16:15' } },
      { text: 'Hola.', think: { q: '¿Copia de las 23:00?' } },
    ],
  });
  assert.deepEqual(texts, ['Pero a las 01:52 entró.', 'Formatea ya.', 'Contener: 16:15', 'Hola.', '¿Copia de las 23:00?']);
});

test('canonReport: tokens with history first, then the new ones to add to the registry', () => {
  const md = canonReport({
    video: 'ir-halden',
    campaign: 'glass-harbor',
    tokens: new Set(['ADM-WS-07', 'OPS-WS-99']),
    refs: new Map([
      ['ADM-WS-07', [{ file: 'video/siem/src/data/s09-pivot.ts', line: 37, text: "origin: 'ADM-WS-07'," }]],
      ['OPS-WS-99', []],
    ]),
  });
  assert.match(md, /^# Canon · ir-halden/);
  assert.match(md, /docs\/superpowers\/canon\/glass-harbor\.md/);
  assert.ok(md.indexOf('ADM-WS-07') < md.indexOf('OPS-WS-99'));
  assert.match(md, /video\/siem\/src\/data\/s09-pivot\.ts:37/);
  assert.match(md, /## Sin rastro fuera de este vídeo[\s\S]*OPS-WS-99/);
});

test('findRefs: a few hits per source, so one busy video does not hide the others', () => {
  const corpus = [
    ...[1, 2, 3, 4, 5].map((n) => ({ file: `video/capas-halden/src/scenes/S0${n}.tsx`, lines: ["time: '01:52'"] })),
    { file: 'video/siem/src/data/s09-pivot.ts', lines: ["time: '01:52', origin: 'ADM-WS-07'"] },
  ];
  const hits = findRefs(new Set(['01:52']), corpus, { maxPerSource: 2 }).get('01:52');
  assert.equal(hits.filter((h) => h.file.startsWith('video/capas-halden/')).length, 2);
  assert.ok(hits.some((h) => h.file === 'video/siem/src/data/s09-pivot.ts'), 'the SIEM line still shows');
});

test('refSource: a video, the lessons of a track, or the file itself', () => {
  assert.equal(refSource('video/siem/src/data/s09-pivot.ts'), 'video/siem');
  assert.equal(refSource('src/data/secplus/sp4-part6.ts'), 'src/data/secplus');
  assert.equal(refSource('docs/superpowers/canon/glass-harbor.md'), 'docs/superpowers/canon/glass-harbor.md');
});
