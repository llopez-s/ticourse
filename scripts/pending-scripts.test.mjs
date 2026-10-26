// node --test scripts/pending-scripts.test.mjs   (no network; uses a throw-away git repo for the git bits)
import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import {
  RECORDING_STATES,
  branchesOfVideo,
  compareSegments,
  divergeNote,
  divergeWarning,
  normalizeText,
  parseCatBatch,
  parseLogDates,
  stateOf,
  textLabel,
} from './lib/pending-text.mjs'
import { mdToHtml, parseArgs, sheetPageHtml } from './pending-scripts.mjs'

const narr = (...segs) => ({ segments: segs.map(([id, text]) => ({ id, text })) })

test('normalizeText drops {cue} marks and <emotion> tags and collapses spaces', () => {
  assert.equal(normalizeText('<curious> {table}En el  puerto,\n {three}sus controles.'), 'En el puerto, sus controles.')
  assert.equal(normalizeText(undefined), '')
  assert.equal(normalizeText('  A  {x}  B '), 'A B')
})

test('compareSegments: same spoken text (only cues / emotions / spacing differ) is not a divergence', () => {
  const main = narr(['s01-01', '<calm> {a}Hola   mundo.'], ['s01-02', 'Adiós.'])
  const other = narr(['s01-01', 'Hola mundo. {b}'], ['s01-02', '<sad> Adiós.'])
  assert.equal(compareSegments(main, other), null)
})

test('compareSegments counts changed, added and removed segments by id', () => {
  const main = narr(['s01-01', 'uno'], ['s01-02', 'dos'], ['s01-03', 'tres'])
  const other = narr(['s01-01', 'uno'], ['s01-02', 'DOS distinto'], ['s02-01', 'nuevo'], ['s02-02', 'otro nuevo'])
  const d = compareSegments(main, other)
  assert.equal(d.changedSegments, 1)
  assert.equal(d.addedSegments, 2)
  assert.equal(d.removedSegments, 1)
  assert.deepEqual(d.ids.changed, ['s01-02'])
  assert.deepEqual(d.ids.added, ['s02-01', 's02-02'])
  assert.deepEqual(d.ids.removed, ['s01-03'])
})

test('compareSegments tolerates a missing narration', () => {
  assert.equal(compareSegments(narr(), narr()), null)
  assert.equal(compareSegments(narr(['s01-01', 'x']), null).removedSegments, 1)
})

test('branchesOfVideo does not take the branches of a longer slug (ir-halden vs ir-halden-pruebas)', () => {
  const names = ['video-ir-halden', 'video-ir-halden-pruebas', 'video-siem']
  const branches = ['video-ir-halden', 'video-ir-halden-voz', 'video-ir-halden-pruebas', 'video-ir-halden-pruebas-voz', 'video-siem', 'main']
  assert.deepEqual(branchesOfVideo('video-ir-halden', branches, names), ['video-ir-halden', 'video-ir-halden-voz'])
  assert.deepEqual(branchesOfVideo('video-ir-halden-pruebas', branches, names), ['video-ir-halden-pruebas', 'video-ir-halden-pruebas-voz'])
  assert.deepEqual(branchesOfVideo('video-siem', branches, names), ['video-siem'])
})

test('stateOf keeps the original precedence', () => {
  const base = { inLesson: false, yt: null, youtubeId: '', mp4: '', clips: 0, recorded: false, frozen: '2026-10-23', hasSheet: true }
  assert.equal(stateOf({ ...base, inLesson: true, youtubeId: 'x' }), 'integrado')
  assert.equal(stateOf({ ...base, youtubeId: 'abc', yt: 200 }), 'publicado')
  assert.equal(stateOf({ ...base, youtubeId: 'abc', yt: 401 }), 'subido')
  assert.equal(stateOf({ ...base, youtubeId: 'abc', yt: null }), 'subido')
  assert.equal(stateOf({ ...base, youtubeId: 'abc', yt: 404, mp4: 'a.mp4' }), 'renderizado')
  assert.equal(stateOf({ ...base, clips: 3 }), 'importado')
  assert.equal(stateOf({ ...base, recorded: true }), 'grabado')
  assert.equal(stateOf(base), 'por-grabar')
  assert.equal(stateOf({ ...base, frozen: '' }), 'borrador')
  assert.equal(stateOf({ ...base, hasSheet: false }), 'borrador')
})

test('labels and warnings use the wording the page promises', () => {
  assert.equal(textLabel({ textSource: 'main', textDate: '2026-10-23', textWhere: 'origin/main' }), 'Texto de main · 2026-10-23')
  assert.equal(
    textLabel({ textSource: 'rama', textDate: '', textWhere: 'la carpeta video-x' }),
    'Guion sin mergear · está en la carpeta video-x',
  )
  const d = { where: 'rama video-x-voz', changedSegments: 3, addedSegments: 1, removedSegments: 1 }
  assert.equal(
    divergeWarning(d),
    'Ojo: la rama video-x-voz tiene otro texto (5 frases distintas). Esta hoja sigue main; si ya grabaste otra versión, avísame antes de importar.',
  )
  assert.equal(divergeNote(d), 'Hay otro texto en rama video-x-voz (5 frases distintas).')
  assert.match(divergeWarning({ where: 'carpeta v', changedSegments: 1, addedSegments: 0, removedSegments: 0 }), /\(1 frase distinta\)/)
  assert.deepEqual(RECORDING_STATES, ['por-grabar', 'borrador'])
})

test('parseLogDates keeps the newest commit date per file', () => {
  const log = '@@2026-10-24\n\nvideo/a/narration.json\n\n@@2026-10-23\n\nvideo/a/narration.json\nvideo/b/narration.json\n'
  const dates = parseLogDates(log)
  assert.equal(dates.get('video/a/narration.json'), '2026-10-24')
  assert.equal(dates.get('video/b/narration.json'), '2026-10-23')
})

test('parseCatBatch reads sized blobs (multi-byte text) and missing objects in request order', () => {
  const text = 'ñandú — «sí»'
  const bytes = Buffer.from(text, 'utf8')
  const buf = Buffer.concat([
    Buffer.from(`abc blob ${bytes.length}\n`),
    bytes,
    Buffer.from('\n'),
    Buffer.from('origin/main:video/zz/narration.json missing\n'),
    Buffer.from('def blob 2\nhi\n'),
  ])
  assert.deepEqual(parseCatBatch(buf, 3), [text, null, 'hi'])
})

test('git bits against a real throw-away repo: cat-file batch and log dates', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pending-test-'))
  const git = (...args) =>
    execFileSync('git', ['-C', dir, '-c', 'user.name=t', '-c', 'user.email=t@t', ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
  try {
    git('init', '-q', '-b', 'main')
    fs.mkdirSync(path.join(dir, 'video', 'a'), { recursive: true })
    fs.writeFileSync(path.join(dir, 'video', 'a', 'narration.json'), JSON.stringify(narr(['s01-01', 'ñ uno'])))
    git('add', '.')
    git('commit', '-q', '-m', 'one', '--date=2026-10-20T10:00:00', )
    const res = spawnSync('git', ['-C', dir, 'cat-file', '--batch'], {
      input: 'main:video/a/narration.json\nmain:video/nope.json\n',
      stdio: ['pipe', 'pipe', 'ignore'],
    })
    const [a, b] = parseCatBatch(res.stdout, 2)
    assert.equal(JSON.parse(a).segments[0].text, 'ñ uno')
    assert.equal(b, null)
    const dates = parseLogDates(git('log', '--name-only', '--format=@@%cs', 'main', '--', 'video/a/narration.json'))
    assert.match(dates.get('video/a/narration.json'), /^\d{4}-\d\d-\d\d$/)
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

test('parseArgs takes the output file and --repo in any order', () => {
  assert.deepEqual(parseArgs(['out.html']), { outFile: 'out.html', repo: null })
  assert.deepEqual(parseArgs(['--repo', 'D:/x', 'out.html']), { outFile: 'out.html', repo: 'D:/x' })
  assert.deepEqual(parseArgs(['out.html', '--repo=D:/y']), { outFile: 'out.html', repo: 'D:/y' })
  assert.equal(parseArgs([]).outFile, '')
})

test('sheet pages carry the label and the warning, escaped', () => {
  const html = sheetPageHtml({
    title: 'T <x>',
    tokens: ':root{}',
    body: mdToHtml('# Guion\n\n**s01-01** — hola'),
    textLabel: 'Texto de main · 2026-10-23',
    warnings: ['Ojo: la rama a<b tiene otro texto (2 frases distintas).'],
  })
  assert.match(html, /<p class="src">Texto de main · 2026-10-23<\/p>/)
  assert.match(html, /<p class="warn">Ojo: la rama a&lt;b tiene otro texto/)
  assert.match(html, /<title>T &lt;x&gt;<\/title>/)
  assert.match(html, /<p class="seg"><b>s01-01<\/b>/)
})

test('importing pending-scripts.mjs does not run the scan (no output, no exit)', () => {
  // The imports at the top of this file already did; make it explicit with a child process.
  const res = spawnSync(process.execPath, ['-e', "import('./scripts/pending-scripts.mjs').then(() => console.log('imported'))"], {
    cwd: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'),
    encoding: 'utf8',
  })
  assert.equal(res.status, 0)
  assert.equal(res.stdout.trim(), 'imported')
})
