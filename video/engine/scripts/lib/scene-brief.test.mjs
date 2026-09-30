import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  REQUIRED_PLACEHOLDERS,
  TODO_MARK,
  componentName,
  demoteHeadings,
  fillTemplate,
  gitBashPath,
  identifierCandidates,
  readTemplate,
  sceneBrief,
  writeDecision,
} from './scene-brief.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const fixture = (name) => JSON.parse(readFileSync(path.join(here, 'fixtures', name), 'utf8'));
const TEMPLATE = readTemplate();

const manifest = { slug: 'mini', output: 'mini', composition: 'Mini', poster: 'MiniPoster', profile: 'principal-yt', track: 'secplus', adversary: 'SILENT PAGER', lesson: 'sp4m6' };

/** The mini fixtures (exam on s01-01 at "needle", think on s02-02) plus an intercepted message on s03-01. */
function sources() {
  const storyboard = fixture('storyboard.mini.json');
  const narration = fixture('narration.mini.json');
  narration.segments.find((s) => s.id === 's03-01').intercept = { text: 'Vuestros relojes no coinciden. Yo sí.', holdMs: 3000 };
  return { storyboard, narration, lexicon: fixture('lexicon.mini.json') };
}

function brief(overrides = {}) {
  const { storyboard, narration, lexicon } = sources();
  return sceneBrief({
    slug: 'mini',
    manifest,
    storyboard,
    narration,
    lexicon,
    catalog: null,
    template: TEMPLATE,
    workspace: { root: 'D:\\LLM projects\\TICourse', branch: 'video-mini', worktree: false },
    lessonSource: { file: 'src/data/secplus/sp4-part3.ts', from: 10, to: 200 },
    references: ['mini', 'capas-halden'],
    timelineMode: 'estimate',
    ...overrides,
  });
}

/** The text of one scene's section: from its heading to the next heading of any level ≤ 3. */
function section(md, sceneId) {
  const start = md.indexOf(`### \`${sceneId}\``);
  assert.ok(start >= 0, `no section for ${sceneId}`);
  const rest = md.slice(start + 4);
  const end = rest.search(/\n#{2,3} /);
  return end < 0 ? rest : rest.slice(0, end);
}

test('lists every scene with its component, chapter and title, and fills every placeholder', () => {
  const md = brief();
  assert.match(md, /^# Scene-builder brief — video `mini` \(«SIEM en acción: del ruido a la evidencia»\)/);
  for (const [id, comp, title] of [
    ['s01-hook', 'S01Hook', 'Seis mil avisos, uno importa'],
    ['s02-collect', 'S02Collect', 'Recoger'],
    ['s03-normalize', 'S03Normalize', 'Normalizar'],
  ]) {
    const s = section(md, id);
    assert.ok(s.includes(title), `${id} title`);
    assert.ok(s.includes(`\`${comp}\` (\`video/mini/src/scenes/${comp}.tsx\`)`), `${id} component`);
    assert.match(md, new RegExp(`\\| \`${id}\` \\| \`${comp}\` \\|`));
  }
  assert.ok(section(md, 's02-collect').includes('chapter 2 «Cómo funciona»'));
  assert.doesNotMatch(md, /\{\{\w+\}\}/);
  assert.ok(md.includes('Work in the main checkout `D:\\LLM projects\\TICourse` (Git Bash: `/d/LLM projects/TICourse`), branch `video-mini`.'));
  assert.ok(md.includes('`src/data/secplus/sp4-part3.ts`, module sp4m6 (~lines 10–200)'));
  assert.ok(md.includes('estimate-mode timing'));
  assert.ok(md.includes('`video/capas-halden/src/scenes/*.tsx`') && !md.includes('`video/mini/src/scenes/*.tsx`'), 'references exclude the video itself');
  assert.ok(md.includes('tsc --noEmit -p video/mini/tsconfig.json') && md.includes('qa-frames.mjs --video mini --scene'));
  assert.ok(md.includes('export function S01Hook(props: SceneProps)'));
  assert.ok(md.includes("this section's adversary is **SILENT PAGER**"));
});

test('lists every cue of a scene in narration order, with its segment and what is being said', () => {
  const md = brief();
  const order = (id, cues) => {
    const s = section(md, id);
    const at = cues.map((c) => s.indexOf(`\`${c}\` (`));
    at.forEach((k, i) => assert.ok(k >= 0, `${id}: cue ${cues[i]} missing`));
    assert.deepEqual([...at].sort((a, b) => a - b), at, `${id}: cues out of order`);
  };
  order('s01-hook', ['flood', 'needle', 'title']);
  order('s02-collect', ['src-systems', 'm-netflow', 'ntp']);
  order('s03-normalize', ['raw', 'utc', 'end']);
  const s1 = section(md, 's01-hook');
  assert.ok(s1.includes('1. `flood` (s01-01) — «Cada día llegan 6.000 avisos al SOC…»'));
  assert.ok(s1.includes('3. `title` (s01-02) — «Veamos cómo convierte el ruido en evidencia.»'));
  assert.ok(section(md, 's03-normalize').includes('`end` (s03-02) — (end of the segment)'));
});

test('keep-clear notes name the right segments: intercept before, think after', () => {
  const md = brief();
  const layout = md.slice(md.indexOf('## Layout rules'), md.indexOf('## Scenes'));
  assert.match(layout, /- intercept before `s03-01` \(the card types out during the silent lead before that segment's audio/);
  assert.match(layout, /- think prompt after `s02-02` \(the silent hold at the end of that segment/);
  assert.doesNotMatch(layout, /s01-0\d|s02-01|s03-02/);

  const s2 = section(md, 's02-collect');
  assert.ok(s2.includes("Think prompt after `s02-02`: «Con NetFlow, ¿sabes qué datos salieron?» — a 2.2 s silent hold"));
  assert.ok(s2.includes("`segment(props, 's02-02').to`"));
  const s3 = section(md, 's03-normalize');
  assert.ok(s3.includes('Intercepted message (SILENT PAGER) before `s03-01`: «Vuestros relojes no coinciden. Yo sí.»'));
  assert.ok(s3.includes("≥ 3 s silent lead before `segment(props, 's03-01').from` and on screen until `segment(props, 's03-01').to`"));
  assert.ok(!s3.includes('and voiced'), 'no adversaryVoice in the fixture');
  assert.ok(section(md, 's01-hook').includes('Timing notes:') && !section(md, 's01-hook').includes('Think prompt'));
});

test('a video without think prompts or intercepts says so', () => {
  const { storyboard, narration } = sources();
  for (const s of narration.segments) {
    delete s.think;
    delete s.intercept;
  }
  const md = sceneBrief({ slug: 'mini', manifest, storyboard, narration, template: TEMPLATE });
  assert.ok(md.includes('  - nothing in this video: it has no think prompts or intercepted messages.'));
  assert.ok(section(md, 's02-collect').includes('Timing notes: none'));
  assert.ok(md.includes('Work in the repository checkout (TODO: path and branch).'));
});

test('exam cards: text, badge, objective and cue, in their own scene only', () => {
  const md = brief();
  const s1 = section(md, 's01-hook');
  assert.ok(s1.includes('Exam card (SY0-701 · 4.4, 5 s) on cue `needle`: «Un SIEM agrega, normaliza, correlaciona y alerta». It draws in the top band'));
  assert.ok(!section(md, 's02-collect').includes('Exam card'));
  const gcti = brief({ manifest: { ...manifest, track: 'gcti' } });
  assert.ok(section(gcti, 's01-hook').includes('Exam card (GCTI · 4.4, 5 s)'));
  const { storyboard, narration } = sources();
  narration.examTiming = 'sentence-end';
  const late = sceneBrief({ slug: 'mini', manifest, storyboard, narration, template: TEMPLATE });
  assert.ok(section(late, 's01-hook').includes('on cue `needle`, once the sentence holding it has been heard'));
});

test('the canon is a TODO block, seeded with identifier-like strings from the goals', () => {
  const md = brief();
  const canon = md.slice(md.indexOf('## Canon'), md.indexOf('## Text rules'));
  assert.ok(canon.includes(`<!-- ${TODO_MARK}:`));
  assert.ok(canon.includes('**TODO (author):**'));
  for (const what of ['TODO visual metaphors', 'TODO canon strings', 'TODO redactions', 'TODO anti-spoilers']) assert.ok(canon.includes(what), what);
  assert.ok(md.indexOf('## Canon') < md.indexOf('## Scenes'));

  const { storyboard, narration } = sources();
  storyboard.scenes[1].goal = 'El registro de (update-svc-cdn.com, en 185.220.x.x) y el correo kazuo.tanji@protonmail.com.';
  const found = identifierCandidates(storyboard, new Map());
  assert.deepEqual(found.map((f) => f.text), ['update-svc-cdn.com', '185.220.x.x', 'kazuo.tanji@protonmail.com']);
  assert.deepEqual(found[0].scenes, ['s02-collect']);
  const seeded = sceneBrief({ slug: 'mini', manifest, storyboard, narration, template: TEMPLATE });
  assert.ok(seeded.includes('- `update-svc-cdn.com` — s02-collect'));
});

test('flags required cues the narration lacks, and cues it adds', () => {
  const { storyboard, narration } = sources();
  const seg = narration.segments.find((s) => s.id === 's02-02');
  seg.text = seg.text.replace('{ntp}', '');
  storyboard.scenes[0].requiredCues = ['flood', 'needle'];
  const md = sceneBrief({ slug: 'mini', manifest, storyboard, narration, template: TEMPLATE });
  assert.ok(section(md, 's02-collect').includes('Required cue(s) missing from the narration: `ntp`'));
  assert.ok(section(md, 's01-hook').includes('Cue(s) in the narration but not in requiredCues: `title`'));
});

test('the engine catalog is embedded with demoted headings, or linked when missing', () => {
  const missing = brief();
  assert.ok(missing.includes('## Componentes del motor'));
  assert.ok(missing.includes('`video/engine/src/ui/CATALOG.md` does not exist yet'));
  const withCatalog = brief({ catalog: '# UI catalog\n\n## Panel\nA box.\n\n```md\n# not a heading\n```\n' });
  const cat = withCatalog.slice(withCatalog.indexOf('## Componentes del motor'));
  assert.ok(cat.includes('### UI catalog') && cat.includes('#### Panel') && cat.includes('\n# not a heading'));
  assert.ok(withCatalog.indexOf('## Componentes del motor') > withCatalog.indexOf('## Verify'));
});

test('fillTemplate: one pass, unknown and missing placeholders are errors, the notes comment is dropped', () => {
  const all = Object.fromEntries(REQUIRED_PLACEHOLDERS.map((k) => [k, k.toUpperCase()]));
  const t = `<!-- notes {{nope}} -->\n${REQUIRED_PLACEHOLDERS.map((k) => `{{${k}}}`).join(' ')} {{slug}}`;
  assert.equal(fillTemplate(t, { ...all, slug: '{{canon}}' }), 'CANON SCENES KEEPCLEAR CATALOG {{canon}}');
  assert.throws(() => fillTemplate(t, all), /unknown placeholder\(s\) \{\{slug\}\}/);
  assert.throws(() => fillTemplate('{{canon}} {{scenes}}', all), /template lacks \{\{keepClear\}\}, \{\{catalog\}\}/);
  for (const k of REQUIRED_PLACEHOLDERS) assert.ok(TEMPLATE.includes(`{{${k}}}`), `the real template keeps {{${k}}}`);
});

test('writeDecision: a brief that exists is only replaced with --force', () => {
  assert.deepEqual(writeDecision({ exists: false }), { write: true, action: 'create' });
  assert.deepEqual(writeDecision({ exists: false, force: true }), { write: true, action: 'create' });
  assert.deepEqual(writeDecision({ exists: true }), { write: false, action: 'refuse' });
  assert.deepEqual(writeDecision({ exists: true, force: true }), { write: true, action: 'overwrite' });
});

test('helpers: component names, Git Bash paths, heading demotion', () => {
  assert.equal(componentName('s08-lifecycle'), 'S08Lifecycle');
  assert.equal(componentName('s02-volatility'), 'S02Volatility');
  assert.equal(componentName('s10-foo-bar'), 'S10FooBar');
  assert.equal(gitBashPath('D:\\LLM projects\\TICourse'), '/d/LLM projects/TICourse');
  assert.equal(gitBashPath('/home/x'), '/home/x');
  assert.equal(demoteHeadings('# A\n###### F\n#nospace', 2), '### A\n###### F\n#nospace');
});
