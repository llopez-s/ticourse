// Self-hosts Vite without file watching; LAB_TEST_URL can use an existing Vite server.
// PLAYWRIGHT_MODULE_PATH may point to a bundled Playwright installation.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile, mkdir } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const base = process.env.LAB_TEST_URL || 'http://127.0.0.1:5174/ticourse/';
let server;
if (!process.env.LAB_TEST_URL) {
  const { createServer } = await import('vite');
  server = await createServer({ server: { host: '127.0.0.1', port: 5174, strictPort: true, watch: null } });
  await server.listen();
  console.log('Local verification server ready (file watching disabled)');
}
let browser;
try { browser = await chromium.launch({ channel: 'chrome', headless: true }); }
catch (error) { await server?.close(); throw error; }
const context = await browser.newContext({ acceptDownloads: true, viewport: { width: 1440, height: 1000 } });
// Fonts and video embeds are not part of this local workbook story.
await context.route('**/*', (route) => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort());
const page = await context.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
const audit = process.env.LAB_TEST_ARTIFACTS || 'node_modules/.cache/lab-browser';
await mkdir(audit, { recursive: true });
const escaped = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const navigate = async (id, suffix = '') => {
  await page.goto(`${base}#/lab/${id}${suffix}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.getByRole('heading', { name: /Qué vas a practicar/ }).waitFor();
};
const profile = () => page.evaluate(async (base) => {
  const { useStore } = await import(`${base}src/lib/store.ts`);
  const { xp, labs } = useStore.getState(); return { xp, labs };
}, base);
const assertCompleted = async (id) => {
  await page.waitForFunction(async ({ base, id }) => (await import(`${base}src/lib/store.ts`)).useStore.getState().labs[id] === true, { base, id });
};

try {
  await navigate('lab2a');
  const fixtures = await page.evaluate(async (base) => {
    const labs = await import(`${base}src/data/labs.ts`);
    const { CHALLENGE_CASES } = await import(`${base}src/data/lab-challenges/index.ts`);
    const { WRITING_FIELDS } = await import(`${base}src/lib/labChallenge.ts`);
    return { classify: labs.CLASSIFY_DATA.lab2a, select: labs.SELECT_DATA.spl4c, order: labs.ORDER_DATA.spl4b,
      pivot: labs.PIVOT, yara: labs.YARA, ach: labs.ACH, calibration: labs.CALIB, report: labs.REPORT, cases: CHALLENGE_CASES, writing: WRITING_FIELDS };
  }, base);
  const data = fixtures.classify;
  for (const item of data.items) await page.getByRole('combobox', { name: item.text, exact: true }).selectOption(data.categories.find((c) => c.id !== item.answer).id);
  await page.getByRole('button', { name: /^Corregir \(/ }).click();
  assert.match(await page.getByRole('region', { name: 'Resumen de práctica' }).textContent(), /Primer resultado: 0\/12/);
  await page.getByRole('button', { name: 'Corregir mis fallos', exact: false }).click();
  for (const item of data.items) await page.getByRole('combobox', { name: item.text, exact: true }).selectOption(item.answer);
  await page.reload();
  assert.equal(await page.getByRole('combobox', { name: data.items[0].text, exact: true }).inputValue(), data.items[0].answer);
  await page.getByRole('button', { name: /^Corregir \(/ }).click();
  await assertCompleted('lab2a');
  assert.match(await page.getByRole('region', { name: 'Resumen de práctica' }).textContent(), /Corregido con ayuda/);
  console.log('PASS guided classification: reload, first score, assisted retry and XP');

  await navigate('spl4c');
  for (const item of fixtures.select.options.filter((o) => o.good)) await page.getByRole('button', { name: item.text, exact: false }).click();
  await page.getByRole('button', { name: 'Validar selección', exact: true }).click();
  await assertCompleted('spl4c');
  await page.reload();
  await page.getByText('Selección correcta — lab completado', { exact: false }).waitFor();

  await navigate('spl4b');
  for (const step of fixtures.order.steps) await page.getByRole('button', { name: step.text, exact: true }).click();
  await page.getByRole('button', { name: 'Comprobar orden', exact: true }).click();
  await assertCompleted('spl4b');

  await navigate('lab3a');
  for (const id of ['whois1', 'd2', 'd3', 'ip1', 'd4', 'cert1', 'd5']) {
    await page.getByText(fixtures.pivot.nodes[id].label, { exact: true }).locator('..').getByRole('button', { name: 'Pivotar (1 query)', exact: true }).click();
  }
  await assertCompleted('lab3a');
  await page.reload();
  await page.getByText('Grafo mapeado — lab completado', { exact: false }).waitFor();

  await navigate('lab3b');
  let yaraSolution;
  for (let mask = 1; mask < (1 << fixtures.yara.strings.length); mask++) {
    const ids = fixtures.yara.strings.filter((_, i) => mask & (1 << i)).map((s) => s.id);
    for (const [cond, threshold] of [['any', 1], ['two', 2], ['all', ids.length]]) {
      if (cond === 'two' && ids.length < 2) continue;
      if (fixtures.yara.samples.every((s) => (ids.filter((id) => s.contains.includes(id)).length >= threshold) === s.malicious)) yaraSolution ??= { ids, cond };
    }
  }
  assert.ok(yaraSolution);
  for (const id of yaraSolution.ids) await page.getByRole('button').filter({ has: page.locator('code').filter({ hasText: new RegExp(`^\\$${id} =`) }) }).click();
  await page.getByRole('button', { name: { any: 'any of them', two: '2 of them', all: 'all of them' }[yaraSolution.cond], exact: true }).click();
  await page.getByRole('button', { name: 'Evaluar simulación', exact: false }).click();
  await assertCompleted('lab3b');
  await page.reload();
  await page.getByText('Objetivo de la simulación cumplido', { exact: false }).waitFor();

  await navigate('lab4b');
  for (const evidence of fixtures.ach.evidence) for (const hypothesis of fixtures.ach.hypotheses) {
    await page.getByRole('button', { name: `${evidence.id} · ${hypothesis.label} · ${evidence.expert[hypothesis.id]}`, exact: true }).click();
  }
  await page.getByRole('button', { name: /^Evaluar matriz/ }).click();
  await page.getByRole('button', { name: fixtures.ach.hypotheses.find((h) => h.id === fixtures.ach.answer).label, exact: true }).click();
  await page.getByRole('button', { name: 'Emitir el assessment', exact: true }).click();
  await assertCompleted('lab4b');

  await navigate('lab5a');
  for (const phrase of fixtures.calibration.phrases) await page.getByRole('combobox', { name: `Banda de ${phrase.phrase}`, exact: true }).selectOption(phrase.band);
  await page.getByRole('button', { name: 'Comprobar bandas', exact: true }).click();
  for (const scenario of fixtures.calibration.scenarios) {
    const slider = page.getByRole('slider', { name: `Probabilidad: ${scenario.text}`, exact: true });
    await slider.focus(); await slider.press('Home');
    for (let i = 1; i < scenario.lo; i++) await slider.press('ArrowRight');
  }
  await page.getByRole('button', { name: 'Puntuar estimaciones', exact: true }).click();
  await assertCompleted('lab5a');

  await navigate('lab5b');
  const report = fixtures.report;
  await page.getByRole('button', { name: report.blufOptions.find((o) => o.good).text, exact: true }).click();
  await page.getByText('1 · Elige el BLUF del informe', { exact: true }).locator('..').getByRole('button', { name: 'Validar', exact: true }).click();
  for (const section of report.sections) await page.getByRole('button', { name: section.text, exact: true }).click();
  await page.getByRole('button', { name: 'Validar orden', exact: true }).click();
  for (const [i, finding] of report.findings.entries()) {
    const card = page.getByText(`${3 + i} · Asigna confianza — ${finding.finding}`, { exact: true }).locator('..');
    await card.getByRole('button', { name: finding.options.find((o) => o.good).label, exact: true }).click();
    await card.getByRole('button', { name: 'Validar', exact: true }).click();
  }
  for (const [i, tlp] of report.tlp.entries()) {
    const card = page.getByText(`${3 + report.findings.length + i} · Marca TLP — ${tlp.product}`, { exact: true }).locator('..');
    await card.getByRole('button', { name: tlp.options.find((o) => o.good).label, exact: true }).click();
    await card.getByRole('button', { name: 'Validar', exact: true }).click();
  }
  await assertCompleted('lab5b');
  await page.reload();
  await page.getByText('Pasos superados: 7/7', { exact: false }).waitFor();
  console.log('PASS all eight guided engines: completed, restored and compatible with profile');

  for (const [kind, cases] of Object.entries(fixtures.cases)) for (const data of cases) {
    const labId = { pivot: 'lab3a', report: 'lab5b', logs: 'spl4a' }[kind];
    await navigate(labId, `?mode=challenge&case=${data.id}`);
    await page.getByRole('heading', { name: data.title, exact: true }).waitFor();
    const before = await profile();
    if (kind === 'pivot') {
      for (const e of data.evidence.filter((e) => e.cost && !e.id.startsWith('N'))) await page.getByRole('button', { name: new RegExp(`^Consultar ${e.id} ·`) }).click();
      for (const candidate of data.candidates) {
        const card = page.getByRole('group', { name: candidate.label, exact: true });
        await card.getByRole('combobox').selectOption(candidate.verdict);
        for (const id of candidate.evidenceSets[0]) await card.getByRole('checkbox', { name: id, exact: true }).check();
      }
    } else if (kind === 'report') {
      await page.getByRole('combobox', { name: 'Alcance demostrado', exact: true }).selectOption(data.assessment);
      await page.getByRole('combobox', { name: 'Confianza en ese juicio', exact: true }).selectOption(data.confidence[0]);
      await page.getByRole('combobox', { name: 'Marca de distribución', exact: true }).selectOption(data.tlp[0]);
      for (const id of data.evidenceSets[0]) await page.getByRole('checkbox', { name: id, exact: true }).check();
    } else {
      await page.getByRole('textbox', { name: 'Buscar en registros', exact: true }).fill(data.account);
      await page.getByRole('combobox', { name: 'Campo', exact: true }).selectOption('user');
      assert.equal(await page.locator('tbody tr').count(), 5);
      for (const id of data.timeline) await page.getByRole('button', { name: `Añadir evento ${id}`, exact: true }).click();
      await page.getByRole('textbox', { name: 'Equipo afectado', exact: true }).fill(data.host);
      await page.getByRole('textbox', { name: 'Cuenta afectada', exact: true }).fill(data.account);
    }
    for (const field of fixtures.writing[kind]) await page.getByRole('textbox', { name: new RegExp(`^${escaped(field.label)}`) }).fill(`Mi entrega ${data.id}: evidencia, alternativa, límites y acción proporcionada para el equipo responsable.`);
    await page.reload();
    await page.getByRole('heading', { name: data.title, exact: true }).waitFor();
    assert.match(await page.getByRole('textbox', { name: new RegExp(`^${escaped(fixtures.writing[kind][0].label)}`) }).inputValue(), new RegExp(data.id));
    await page.getByRole('button', { name: 'Entregar y comprobar datos', exact: true }).click();
    await page.getByRole('heading', { name: /Entregado ·/ }).waitFor();
    const result = await page.getByRole('region', { name: 'Resultado del reto', exact: true }).textContent();
    const total = kind === 'pivot' ? 8 : kind === 'report' ? 4 : 3;
    assert.ok(result.includes(`${total}/${total} comprobaciones`), result);
    for (const group of ['Evidencia', 'Razonamiento', 'Incertidumbre', 'Utilidad de la acción']) await page.getByRole('group', { name: group, exact: true }).getByRole('radio').nth(2).check();
    await page.getByText('Autoevaluación: 8/8 (declarada por ti)', { exact: true }).waitFor();
    await page.getByRole('button', { name: 'Ver solución comentada', exact: true }).click();
    const downloadEvent = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Descargar entrega (.md)', exact: true }).click();
    const download = await downloadEvent;
    assert.match(await readFile(await download.path(), 'utf8'), new RegExp(data.id));
    assert.deepEqual(await profile(), before, 'challenge must not modify XP/completion');
    await page.screenshot({ path: `${audit}/${data.id}.png`, fullPage: true });
    console.log(`PASS ${data.id}: submission, rubric, reload, export and no XP`);
  }

  await navigate('lab3a', '?mode=challenge&case=pivot-a');
  await page.getByRole('heading', { name: 'A · Vecinos con historia', exact: true }).waitFor();
  assert.match(await page.getByRole('textbox', { name: /^Conclusión y evidencia/ }).inputValue(), /pivot-a/);
  await page.getByRole('button', { name: 'Caso B', exact: true }).click();
  await page.getByRole('heading', { name: 'B · El certificado compartido', exact: true }).waitFor();
  assert.match(await page.getByRole('textbox', { name: /^Conclusión y evidencia/ }).inputValue(), /pivot-b/);
  const xpBeforeRestart = (await profile()).xp;
  await page.getByRole('button', { name: 'Nuevo intento', exact: true }).click();
  await page.getByRole('button', { name: 'Empezar de nuevo', exact: true }).click();
  assert.equal(await page.getByRole('textbox', { name: /^Conclusión y evidencia/ }).inputValue(), '');
  assert.equal((await profile()).xp, xpBeforeRestart);
  await page.getByText('Historial local (1)', { exact: true }).waitFor();
  const jsonDownloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Exportar trabajo', exact: true }).click();
  const jsonDownload = await jsonDownloadEvent;
  const workbook = JSON.parse(await readFile(await jsonDownload.path(), 'utf8'));
  assert.equal(workbook.identity, 'lab3a/challenge/pivot-b/v1');
  assert.equal(workbook.history.length, 1);
  assert.match(workbook.history[0].draft.answer.text.conclusion, /pivot-b/);
  console.log('PASS case isolation and archived restart');

  await navigate('lab3b');
  await page.getByRole('link', { name: /^Abrir editor libre/ }).click();
  const yaraEditor = page.getByRole('textbox', { name: 'Tu regla YARA (borrador local)', exact: true });
  await yaraEditor.fill('rule Persisted { condition: true }');
  await page.reload();
  assert.equal(await yaraEditor.inputValue(), 'rule Persisted { condition: true }');
  console.log('PASS YARA free editor draft');

  await navigate('spl4a', '?mode=challenge&case=logs-b');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('heading', { name: 'B · La cuenta que no debía iniciar sesión', exact: true }).waitFor();
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'mobile page must not overflow');
  await page.getByRole('textbox', { name: 'Buscar en registros', exact: true }).focus();
  await page.keyboard.press('Tab');
  assert.equal(await page.getByRole('combobox', { name: 'Campo', exact: true }).evaluate((el) => el === document.activeElement), true);
  await page.screenshot({ path: `${audit}/mobile-logs.png`, fullPage: true });
  console.log('PASS mobile layout and keyboard focus');

  const blocked = await browser.newContext();
  await blocked.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException('quota exceeded', 'QuotaExceededError'); }; });
  const blockedPage = await blocked.newPage();
  await blockedPage.goto(`${base}#/lab/lab1a`, { waitUntil: 'domcontentloaded' });
  await blockedPage.getByRole('button', { name: 'Exportar trabajo', exact: true }).waitFor();
  await blockedPage.getByRole('button', { name: 'Nuevo intento', exact: true }).click();
  await blockedPage.getByRole('button', { name: 'Empezar de nuevo', exact: true }).click();
  await blockedPage.getByText('No se pudo guardar. Exporta tu trabajo antes de salir.', { exact: false }).waitFor();
  await blocked.close();
  assert.deepEqual(errors, [], 'no browser runtime errors');
  console.log('PASS quota failure remains usable; no browser runtime errors');
} finally {
  await context.close();
  await browser.close();
  await server?.close();
}
