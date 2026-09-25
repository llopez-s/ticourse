import assert from 'node:assert/strict';
import { test } from 'node:test';
import { MarkupError, applyLexicon, parseSegmentText, pronunciationRisks } from './text.mjs';

const LEX = { NetFlow: 'net flou', SIEM: 'síem', NTP: 'ene te pe', UEBA: 'u e be a', SOC: 'soc' };

const range = (p, i) => p.spokenTokens.slice(p.displayTokens[i].spokenStart, p.displayTokens[i].spokenEnd).join(' ');

test('plain text: display equals spoken, one spoken token per display token', () => {
  const p = parseSegmentText('Un aviso, y otro.', {});
  assert.equal(p.display, 'Un aviso, y otro.');
  assert.equal(p.spoken, 'Un aviso, y otro.');
  assert.deepEqual(p.displayTokens.map((t) => [t.text, t.spokenStart, t.spokenEnd]), [
    ['Un', 0, 1],
    ['aviso,', 1, 2],
    ['y', 2, 3],
    ['otro.', 3, 4],
  ]);
  assert.deepEqual(p.cues, []);
});

test('numbers read as several words map one display token to a spoken range', () => {
  const p = parseSegmentText('Llegan [6.000|seis mil] avisos al día.', {});
  assert.equal(p.display, 'Llegan 6.000 avisos al día.');
  assert.equal(p.spoken, 'Llegan seis mil avisos al día.');
  assert.equal(range(p, 1), 'seis mil');
  assert.equal(range(p, 2), 'avisos');
});

test('multi-word groups split proportionally and keep attached punctuation', () => {
  const p = parseSegmentText('Salieron {38gb}[38 GB|treinta y ocho gigabytes], el [78 %|setenta y ocho por ciento].', {});
  assert.equal(p.display, 'Salieron 38 GB, el 78 %.');
  assert.equal(p.spoken, 'Salieron treinta y ocho gigabytes, el setenta y ocho por ciento.');
  assert.equal(range(p, 1), 'treinta y');
  assert.equal(range(p, 2), 'ocho gigabytes,');
  // Proportional by word count: 2 display words over 5 spoken words -> 2 + 3.
  assert.equal(range(p, 4), 'setenta y');
  assert.equal(range(p, 5), 'ocho por ciento.');
  assert.deepEqual(p.cues, [{ id: '38gb', displayIndex: 1 }]);
});

test('more display words than spoken words share a spoken token, never an empty range', () => {
  const p = parseSegmentText('Mira [ADM-WS-07 ahora mismo|ya].', {});
  assert.equal(p.display, 'Mira ADM-WS-07 ahora mismo.');
  assert.equal(p.spoken, 'Mira ya.');
  for (let i = 1; i < 4; i += 1) {
    assert.ok(p.displayTokens[i].spokenEnd > p.displayTokens[i].spokenStart, `token ${i} has a range`);
    assert.equal(range(p, i), 'ya.');
  }
});

test('times inside running text and prefixes glued to groups', () => {
  const p = parseSegmentText('Entre las [02:00|dos] y las [04:30|cuatro y media] («[01:52|la una y cincuenta y dos]»).', {});
  assert.equal(p.display, 'Entre las 02:00 y las 04:30 («01:52»).');
  assert.equal(p.spoken, 'Entre las dos y las cuatro y media («la una y cincuenta y dos»).');
  assert.equal(p.displayTokens.length, 7);
  assert.equal(range(p, 6), '(«la una y cincuenta y dos»).');
});

test('acronyms are respelled via the lexicon, keeping punctuation and case-sensitivity', () => {
  const p = parseSegmentText('El SIEM recibe «NetFlow», NTP y UEBA: todo. siem no cambia.', LEX);
  assert.equal(p.spoken, 'El síem recibe «net flou», ene te pe y u e be a: todo. siem no cambia.');
  assert.equal(p.display, 'El SIEM recibe «NetFlow», NTP y UEBA: todo. siem no cambia.');
  assert.equal(range(p, 1), 'síem');
  assert.equal(range(p, 3), '«net flou»,');
  assert.equal(range(p, 4), 'ene te pe');
  assert.equal(range(p, 6), 'u e be a:');
});

test('the lexicon never applies inside [display|spoken] groups', () => {
  const p = parseSegmentText('[SIEM|sistema] y SIEM', LEX);
  assert.equal(p.spoken, 'sistema y síem');
});

test('applyLexicon matches only whole tokens', () => {
  assert.equal(applyLexicon('SIEMs', LEX), 'SIEMs');
  assert.equal(applyLexicon('(SOC)', LEX), '(soc)');
  assert.equal(applyLexicon('¿SIEM?', LEX), '¿síem?');
});

test('accents and Spanish punctuation survive intact', () => {
  const p = parseSegmentText('¿Apagarlo o aislarlo? ¡Aíslalo, sin apagar!', {});
  assert.equal(p.display, '¿Apagarlo o aislarlo? ¡Aíslalo, sin apagar!');
  assert.equal(p.spokenTokens.length, 6);
});

test('cues attach to the next display token, or to the end', () => {
  const p = parseSegmentText('{flood}Seis mil avisos, {needle}una importa.{title}', {});
  assert.deepEqual(p.cues, [
    { id: 'flood', displayIndex: 0 },
    { id: 'needle', displayIndex: 3 },
    { id: 'title', displayIndex: 5 },
  ]);
  assert.equal(p.displayTokens.length, 5);
  const q = parseSegmentText('Fin. {endcard}', {});
  assert.deepEqual(q.cues, [{ id: 'endcard', displayIndex: 1 }]);
});

test('a cue may precede a group and the whitespace is normalised', () => {
  const p = parseSegmentText('  Hubo   {38gb}[38 GB|treinta y ocho gigabytes]   fuera. ', {});
  assert.equal(p.display, 'Hubo 38 GB fuera.');
  assert.deepEqual(p.cues, [{ id: '38gb', displayIndex: 1 }]);
});

test('markup errors throw MarkupError', () => {
  const bad = [
    'texto {sin cerrar',
    'texto [sin cerrar|x',
    'texto } suelto',
    'texto ] suelto',
    'uno {} vacío',
    'uno { } vacío',
    'anidado [a {b} c|d]',
    'anidado [a [b|c] d|e]',
    'dos barras [a|b|c]',
    'sin barra [a b]',
    'lado vacío [|b]',
    'lado vacío [a| ]',
    'barra | suelta',
    'id raro {con espacio}',
  ];
  for (const text of bad) assert.throws(() => parseSegmentText(text, {}), MarkupError, text);
});

test('pronunciationRisks flags digits, identifiers and unknown acronyms outside markup', () => {
  const p = parseSegmentText('El SIEM de ADM-WS-07 vio 38 GB en srv-tc-app03 vía NetFlow y SOAR.', LEX);
  const risks = pronunciationRisks(p.plainTokens, LEX);
  assert.deepEqual(risks.sort(), ['38', 'ADM-WS-07', 'GB', 'SOAR', 'srv-tc-app03'].sort());
});
