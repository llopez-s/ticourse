import assert from 'node:assert/strict';
import test from 'node:test';
import { analyzeNarration } from './narration.mjs';

const storyboard = {
  chapters: [{ n: 1, title: 'Uno' }],
  scenes: [
    { id: 's01-a', chapter: 1, requiredCues: [] },
    { id: 's02-b', chapter: 1, requiredCues: [] },
  ],
};
const voice = 'es-ES-ElviraNeural';
const run = (segments, opts) => analyzeNarration({ storyboard, narration: { voice, segments }, lexicon: {} }, opts);
const segments = [
  { id: 's01-01', scene: 's01-a', text: '<curious> ¿Cómo llegan los logs al SIEM? Depende de quién hable en cada caso.' },
  { id: 's01-02', scene: 's01-a', text: '<curious> Los servidores llevan un agente; los firewalls hablan syslog con el colector.' },
  { id: 's02-01', scene: 's02-b', text: 'La nube contesta por API y los routers exportan NetFlow sin contenido.' },
  { id: 's02-02', scene: 's02-b', text: 'Todo converge en un punto central con la hora sincronizada por NTP.' },
];

test('chispa checks: repeated emotion, semicolon, scene without a question', () => {
  const { errors, warnings } = run(segments, { chispa: true });
  assert.deepEqual(errors, []);
  assert.ok(warnings.some((w) => /s01-02: same emotion <curious> as the previous segment/.test(w)), warnings.join('\n'));
  assert.ok(warnings.some((w) => /s01-02: ";" in the narration/.test(w)));
  assert.ok(warnings.some((w) => /scene s02-b: no question/.test(w)));
  assert.ok(!warnings.some((w) => /scene s01-a: no question/.test(w)));
});

test('the legacy profiles do not run the chispa checks', () => {
  const { warnings } = run(segments, {});
  assert.ok(!warnings.some((w) => /same emotion|";" in the narration|no question/.test(w)), warnings.join('\n'));
});
