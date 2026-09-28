import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { analyzeNarration, isSpelledIdentifier } from './narration.mjs';
import { VIDEOS_DIR, readManifest } from './paths.mjs';
import { profileFor } from './profiles.mjs';

const storyboard = {
  chapters: [{ n: 1, title: 'Uno' }],
  scenes: [
    { id: 's01-a', chapter: 1, requiredCues: [] },
    { id: 's02-b', chapter: 1, requiredCues: [] },
  ],
};
const voice = 'es-ES-ElviraNeural';
const run = (segments, opts, board = storyboard) => analyzeNarration({ storyboard: board, narration: { voice, segments }, lexicon: {} }, opts);
const segments = [
  { id: 's01-01', scene: 's01-a', text: '<curious> ¿Cómo llegan los logs al SIEM? Depende de quién hable en cada caso.' },
  { id: 's01-02', scene: 's01-a', text: '<curious> Los servidores llevan un agente; los firewalls hablan syslog con el colector.' },
  { id: 's02-01', scene: 's02-b', text: 'La nube contesta por API y los routers exportan NetFlow sin contenido.' },
  { id: 's02-02', scene: 's02-b', text: 'Todo converge en un punto central con la hora sincronizada por NTP.' },
];
const SPOKEN = /spoken style/;

test('chispa checks: repeated emotion and semicolon; a scene without a question is fine', () => {
  const { errors, warnings } = run(segments, { chispa: true });
  assert.deepEqual(errors, []);
  assert.ok(warnings.some((w) => /s01-02: same emotion <curious> as the previous segment/.test(w)), warnings.join('\n'));
  assert.ok(warnings.some((w) => /s01-02: ";" in the narration/.test(w)));
  assert.ok(!warnings.some((w) => /no question/.test(w)), 'the per-scene question quota bred a «¿Y …?» tic; it is gone');
});

test('the legacy profiles do not run the chispa or spoken-style checks', () => {
  const { warnings } = run([...segments, { id: 's02-03', scene: 's02-b', text: 'Remite haldenport.example: de casa. Abres las cabeceras: nadie las mira.' }], {});
  assert.ok(!warnings.some((w) => /same emotion|";" in the narration/.test(w) || SPOKEN.test(w)), warnings.join('\n'));
});

test('isSpelledIdentifier: domains, IPs, hosts, hashes, addresses and pipe names — not exam terms', () => {
  for (const t of ['haldenport.example', 'update-svc-cdn.com.', '«hdn-mailer.example»', '185.220.x.x', '141.98.6.10,', 'ADM-WS-02', 'ENG-WS-041.', '9f3a...e1', 'kazuo.tanji@protonmail.com', 'vc_pipe_%08x']) {
    assert.ok(isSpelledIdentifier(t), t);
  }
  for (const t of ['443', 'SNMPv3', 'p=none', 'SY0-701', '4.5', '04:12', 'DMARC.', 'Diamond', 'X.509', 'C2', 'Authentication-Results', '¿Y']) {
    assert.ok(!isSpelledIdentifier(t), t);
  }
});

test('spoken style: colons, spelled identifiers and formula questions are flagged', () => {
  const board = { chapters: [{ n: 1, title: 'Uno' }], scenes: [{ id: 's01-a', chapter: 1, requiredCues: [] }] };
  const segs = [
    { id: 's01-01', scene: 's01-a', text: 'Remite [haldenport.example|haldenport punto example]: de casa. Abres las cabeceras: nadie las mira.' },
    { id: 's01-02', scene: 's01-a', text: '¿Y el gateway? Filtra el contenido del correo que llega.' },
    { id: 's01-03', scene: 's01-a', text: '¿Y lo nunca visto? Lo detectan las anomalías de la red.' },
    { id: 's01-04', scene: 's01-a', text: '¿Y telnet? Se sustituye por SSH, que va cifrado de punta a punta.' },
    { id: 's01-05', scene: 's01-a', text: 'Una cosa más. ¿Y esa cuenta que descarga de madrugada? La vigila UBA.' },
  ];
  const { errors, warnings } = run(segs, { chispa: true }, board);
  assert.deepEqual(errors, []);
  assert.ok(warnings.some((w) => /s01-01: 2 colons/.test(w)), warnings.join('\n'));
  assert.ok(warnings.some((w) => /s01-01: "haldenport\.example" is read aloud/.test(w)));
  assert.ok(warnings.some((w) => /4 questions open with "¿y" \(s01-02, s01-03, s01-04, s01-05\)/.test(w)));
  assert.ok(!warnings.some((w) => /segments use a colon/.test(w)), 'one colon segment out of five is under a third');
});

test('spoken style: the rewritten sample of capas-halden s02 passes clean', () => {
  const board = {
    chapters: [{ n: 1, title: 'Uno' }],
    scenes: [{ id: 's02-spoof', chapter: 1, requiredCues: ['inbox', 'headers', 'spf-pass', 'dkim-pass', 'dmarc-fail'] }],
  };
  const segs = [
    'Estamos en el muelle tres. {inbox}A Lucía, de Operaciones, le llega un correo con los turnos de atraque. Y viene de casa, del dominio del puerto.',
    'Bueno, eso parece. Pero antes de fiarte, mira las {headers}cabeceras. Son como la etiqueta de envío de un paquete, y casi nadie las mira.',
    'Hay dos comprobaciones en verde. {spf-pass}SPF dice que el servidor tenía permiso para enviarlo. {dkim-pass}Y DKIM, que la firma es buena.',
    'Todo en orden, ¿no? Pues mira de quién es ese permiso. Y esa firma. Del dominio del atacante, no del puerto.',
    'Lo que falla es que no cuadran. {dmarc-fail}DMARC compara el remitente que ve Lucía con el dominio que han comprobado SPF y DKIM. Si no es el mismo, suspenso.',
    'Eso es la alineación. O sea, que el correo trae dos aprobados y un suspenso… y aun así está en su bandeja. ¿Cómo ha entrado?',
  ].map((text, k) => ({ id: `s02-0${k + 1}`, scene: 's02-spoof', text }));
  const { errors, warnings } = run(segs, { chispa: true }, board);
  assert.deepEqual(errors, []);
  assert.deepEqual(warnings.filter((w) => SPOKEN.test(w)), []);
});

/** analyzeNarration over a real video's sources, with its own profile. */
function analyzeVideo(slug) {
  const dir = path.join(VIDEOS_DIR, slug);
  const read = (f) => JSON.parse(readFileSync(path.join(dir, f), 'utf8'));
  const narration = read('narration.json');
  const manifest = readManifest(slug);
  return analyzeNarration(
    { storyboard: read('storyboard.json'), narration, lexicon: read(narration.lexicon ?? 'lexicon.json') },
    { ...profileFor(manifest.profile), track: manifest.track },
  );
}

test('spoken style: the two scripts written before it (capas-halden, diamond-e7) trip every new check', () => {
  for (const slug of ['capas-halden', 'diamond-e7']) {
    const { errors, warnings } = analyzeVideo(slug);
    assert.deepEqual(errors, [], slug);
    assert.ok(warnings.some((w) => /colons — join the ideas/.test(w)), `${slug}: colon warning`);
    assert.ok(warnings.some((w) => /segments use a colon as a connector/.test(w)), `${slug}: colon share`);
    assert.ok(warnings.some((w) => /is read aloud — put it on screen/.test(w)), `${slug}: spelled identifier`);
    assert.ok(warnings.some((w) => /questions open with "¿y"/.test(w)), `${slug}: «¿Y …?» formula`);
  }
});
