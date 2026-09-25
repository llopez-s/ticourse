import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CAPTION_DEFAULTS, layoutLines, paginate } from './captions.mjs';

/** Timed words from a sentence: each word lasts 8 frames + 2 per char, no gaps. */
function timed(text, start = 0) {
  let t = start;
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => {
      const from = t;
      t += 8 + 2 * w.length;
      return { text: w, from, to: t };
    });
}

const lineText = (line) => line.map((w) => w.text).join(' ');

function assertPageLimits(pages) {
  for (const page of pages) {
    assert.ok(page.lines.length >= 1 && page.lines.length <= CAPTION_DEFAULTS.maxLines, 'one or two lines');
    for (const line of page.lines) {
      assert.ok(line.length > 0, 'no empty line');
      if (line.length > 1) assert.ok(lineText(line).length <= CAPTION_DEFAULTS.maxChars, `line fits: "${lineText(line)}"`);
    }
    assert.ok(page.to > page.from, 'page has a positive duration');
  }
  for (let p = 1; p < pages.length; p += 1) assert.ok(pages[p].from >= pages[p - 1].to, 'pages do not overlap');
}

const words = (pages) => pages.flatMap((p) => p.lines.flat().map((w) => w.text));

test('short text fits on one single-line page', () => {
  const w = timed('Un SIEM agrega y correlaciona.');
  const pages = paginate(w);
  assert.equal(pages.length, 1);
  assert.equal(pages[0].lines.length, 1);
  assert.equal(pages[0].from, 0); // clamped at 0
  assert.equal(pages[0].to, w.at(-1).to + 24);
});

test('long text: pages of at most 2 x 42 characters, all words kept in order', () => {
  const text =
    'Un SIEM recoge los registros de servidores, estaciones, cortafuegos y aplicaciones, los normaliza a un esquema común y los correlaciona para que el equipo azul vea en una sola pantalla lo que de otro modo quedaría enterrado en miles de líneas sin contexto.';
  const w = timed(text, 100);
  const pages = paginate(w);
  assertPageLimits(pages);
  assert.deepEqual(words(pages), w.map((x) => x.text));
  assert.ok(pages.length >= 3);
  assert.equal(pages[0].from, 97); // first word - 3
});

test('two-line pages are balanced', () => {
  const w = timed('La regla une tres eventos inocentes dentro de una ventana de diez minutos.');
  const lines = layoutLines(w, 0, w.length);
  assert.equal(lines.length, 2);
  const l1 = lineText(w.slice(...lines[0])).length;
  const l2 = lineText(w.slice(...lines[1])).length;
  assert.ok(Math.abs(l1 - l2) <= 10, `balanced: ${l1} vs ${l2}`);
});

test('a sentence end is preferred as a page break', () => {
  const w = timed('Seis mil avisos al día. Solo uno de ellos importa de verdad y nadie lo ha abierto todavía en la cola.');
  const pages = paginate(w);
  assertPageLimits(pages);
  assert.equal(pages[0].lines.flat().at(-1).text, 'día.');
});

test('a clause break is used once the page has at least 18 characters', () => {
  const w = timed('Primero recogemos los eventos de toda la red, después los normalizamos a un esquema común con hora UTC y campos iguales.');
  const pages = paginate(w);
  assertPageLimits(pages);
  assert.equal(pages[0].lines.flat().at(-1).text, 'red,');
});

test('a segment boundary always starts a new page', () => {
  const a = timed('Uno.', 0);
  const b = timed('Dos palabras.', 60);
  const pages = paginate([...a, ...b], [a.length]);
  assert.equal(pages.length, 2);
  assert.deepEqual(words([pages[0]]), ['Uno.']);
  assert.ok(pages[0].to <= pages[1].from);
});

test('page timing: from = first word - 3, to = min(next from, last word + 24)', () => {
  const a = timed('Primera frase corta.', 30);
  const b = timed('Segunda frase.', a.at(-1).to + 6);
  const pages = paginate([...a, ...b], [a.length]);
  assert.equal(pages[0].from, 27);
  assert.equal(pages[0].to, pages[1].from); // next page starts before last + 24
  assert.equal(pages[1].to, b.at(-1).to + 24);
});

test('no page shorter than 12 frames when a merge is possible', () => {
  // A one-word sentence spoken very fast followed by more text in the same segment.
  const w = [
    { text: 'Sí.', from: 0, to: 3 },
    ...timed('Y ahora el equipo azul revisa la cola completa de alertas pendientes con calma.', 4),
  ];
  const pages = paginate(w);
  assertPageLimits(pages);
  for (const page of pages) assert.ok(page.to - page.from >= 12, `page ${page.from}-${page.to} lasts >= 12 frames`);
  assert.deepEqual(words(pages), w.map((x) => x.text));
});

test('an over-long single token still gets its own line', () => {
  const w = timed('identificador-larguísimo-que-no-cabe-en-una-línea-de-subtítulos aquí');
  const pages = paginate(w);
  assert.deepEqual(words(pages), w.map((x) => x.text));
});
