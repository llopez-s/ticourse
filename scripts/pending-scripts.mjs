#!/usr/bin/env node
// Scans every video worktree and writes the "Guiones pendientes" artifact page.
//   node scripts/pending-scripts.mjs <out.html> [--repo <main repo root>]
// --repo is the root that holds .claude/worktrees and video/engine/voices (default: the root of this
// script, which is the main checkout when it is run from there; pass it when running from another worktree).
//
// WHICH TEXT THE RECORDING SHEET FOLLOWS. The sheet is generated from the video's folder on origin/main
// (narration.json + storyboard.json + video.json, with the engine's own sheet writer taken from origin/main
// too), NOT from the work folder .claude/worktrees/video-<slug>, which can lag behind main: on 2026-10-25 V39 and
// V43 were recorded from the 2026-10-20 text while main already had the 2026-10-23 one (segment ids, words and
// {cue} marks differ). A video that exists only in a branch/worktree keeps the old behaviour (the work
// folder's out/guion-grabacion.md) and is labelled «Guion sin mergear». Each video's spoken text is also
// compared with every video-<slug>* branch and with the work folder (`diverges`), so a recording made from
// another version cannot go unnoticed.
//
// The script lives in .claude/worktrees/video-<slug>, but the voice work does not: it is done on a
// branch video-<slug>-voz in an NTFS worktree somewhere else (another session's scratchpad), and it
// reaches main through a PR or a batch branch. So every video is looked up in ALL its branches
// (video-<slug>*) and ALL worktrees (git worktree list), against origin/main after a fetch: the
// local main of the main checkout is often far behind (134 commits on 2026-10-22).
// State per video (first match wins):
//   integrado   its YouTube id is in a lesson on origin/main (or, without an id, a video-<slug>* branch
//               with clips is merged there)
//   publicado   public on YouTube, not in the lesson yet: link the lesson + canon, PR, merge
//   subido      uploaded, still private: Lidia publishes it
//   renderizado an .mp4 exists in some worktree's out/
//   importado   her recording is imported (tts/ has clips in some worktree or branch)
//   grabado     her recording exists, no clips anywhere
//   por-grabar  script frozen, recording sheet written, no recording yet
//   borrador    script not frozen yet
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync, spawnSync } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import {
  RECORDING_STATES,
  branchesOfVideo,
  compareSegments,
  divergeNote,
  divergeWarning,
  parseCatBatch,
  parseLogDates,
  stateOf,
  textLabel,
} from './lib/pending-text.mjs'

const scriptRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

/** Pure: usage `<out.html> [--repo <dir>]` -> { outFile, repo } (repo null = default). */
export function parseArgs(argv) {
  const rest = []
  let repo = null
  for (let k = 0; k < argv.length; k += 1) {
    if (argv[k] === '--repo') repo = argv[(k += 1)] ?? null
    else if (argv[k].startsWith('--repo=')) repo = argv[k].slice(7)
    else rest.push(argv[k])
  }
  return { outFile: rest[0] ?? '', repo }
}

const listDir = (p) => {
  try {
    return fs.readdirSync(p)
  } catch {
    return []
  }
}
const readJson = (p) => {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8').replace(/^﻿/, ''))
  } catch {
    return null
  }
}
const parseJson = (text) => {
  if (text == null) return null
  try {
    return JSON.parse(text.replace(/^﻿/, ''))
  } catch {
    return null
  }
}
const countWords = (text) =>
  text
    .replace(/<[^>]*>/g, ' ')
    .replace(/\{[^}]*\}/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length

// 200 = public, 401/403 = private, 404 = gone; null when the check could not run
async function youtubeStatus(id) {
  try {
    const url = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}`
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    return res.status
  } catch {
    return null
  }
}

// Recording sheets as small HTML pages next to the artifact (guiones/<slug>.html): the page
// fetches them into its reader panel and also links to them.
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const inline = (s) =>
  esc(s).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\*([^*]+)\*/g, '<i>$1</i>').replace(/`([^`]+)`/g, '<code>$1</code>')
export function mdToHtml(md) {
  const out = []
  let para = []
  const flush = () => {
    if (!para.length) return
    const text = para.join(' ')
    out.push(/^\*\*s\d+-\d+\*\*/.test(text) ? `<p class="seg">${inline(text)}</p>` : `<p>${inline(text)}</p>`)
    para = []
  }
  for (const line of md.split(/\r?\n/)) {
    let m
    if (!line.trim()) flush()
    else if ((m = line.match(/^(#{1,3}) (.*)$/))) (flush(), out.push(`<h${m[1].length}>${inline(m[2])}</h${m[1].length}>`))
    else if ((m = line.match(/^> (.*)$/))) (flush(), out.push(`<blockquote>${inline(m[1])}</blockquote>`))
    else para.push(line.trim())
  }
  flush()
  return out.join('\n')
}
const SHEET_CSS = `
.sheet{font:16px/1.65 var(--f-body);max-width:68ch}
.sheet h1{font:700 26px/1.2 var(--f-display);margin:0 0 14px;text-wrap:balance}
.sheet h2{font:700 20px/1.3 var(--f-display);margin:30px 0 8px;padding-top:14px;border-top:1px solid var(--line)}
.sheet h3{font:700 12px/1.3 var(--f-display);text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin:20px 0 6px}
.sheet p{margin:0 0 10px}
.sheet p.seg{padding:8px 12px;border-radius:6px;background:var(--bg)}
.sheet p.seg b:first-child{font:500 12px var(--f-mono);color:var(--cyan);margin-right:2px}
.sheet blockquote{margin:8px 0;padding:6px 12px;border-left:3px solid var(--amber);color:var(--muted);background:var(--amber-bg);border-radius:0 6px 6px 0}
.sheet code{font:400 13px var(--f-mono);background:var(--bg);padding:1px 5px;border-radius:4px}
.sheet p.src{display:inline-block;margin:0 0 10px;padding:3px 10px;border-radius:4px;background:var(--amber-bg);color:var(--amber);font:600 13px var(--f-mono)}
.sheet p.warn{margin:0 0 10px;padding:8px 12px;border-radius:6px;background:var(--rose-bg);color:var(--rose);border-left:3px solid var(--rose);font-weight:600}
`

export function sheetPageHtml({ title, tokens, body, textLabel: label, warnings }) {
  const banner =
    (label ? `<p class="src">${esc(label)}</p>` : '') + (warnings ?? []).map((w) => `<p class="warn">${esc(w)}</p>`).join('')
  return (
    `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">` +
    `<title>${esc(title)}</title>` +
    `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@500;700&family=Hanken+Grotesk:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap">` +
    `<style>${tokens}body{background:var(--bg);color:var(--ink);margin:0;padding:28px max(16px,env(safe-area-inset-right,0px)) 48px max(16px,env(safe-area-inset-left,0px))}.sheet{margin:0 auto}${SHEET_CSS}</style></head>` +
    `<body><article class="sheet">${banner}${body}</article></body></html>\n`
  )
}

async function main() {
  const { outFile, repo } = parseArgs(process.argv.slice(2))
  if (!outFile) {
    console.error('usage: node scripts/pending-scripts.mjs <out.html> [--repo <main repo root>]')
    process.exit(1)
  }
  const root = path.resolve(repo ?? scriptRoot)
  const worktrees = path.join(root, '.claude', 'worktrees')
  const voices = path.join(root, 'video', 'engine', 'voices')

  const git = (...args) => {
    try {
      return execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 256 * 1024 * 1024 })
    } catch {
      return ''
    }
  }
  /** Contents of `rev:path` specs in one git process; null where missing. */
  const catFiles = (specs) => {
    if (!specs.length) return []
    const res = spawnSync('git', ['-C', root, 'cat-file', '--batch'], {
      input: `${specs.join('\n')}\n`,
      maxBuffer: 512 * 1024 * 1024,
      stdio: ['pipe', 'pipe', 'ignore'],
    })
    return parseCatBatch(res.stdout ?? Buffer.alloc(0), specs.length)
  }

  git('fetch', '--quiet', 'origin', 'main')
  const base = git('rev-parse', '--verify', '--quiet', 'origin/main').trim() ? 'origin/main' : 'main'
  const behind = Number(git('rev-list', '--count', `main..${base}`).trim() || 0)
  const allBranches = git('for-each-ref', '--format=%(refname:short)', 'refs/heads/')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
  // branch -> worktree path, for every worktree of this repo (scratchpads included)
  const worktreeOf = new Map()
  let wtPath = null
  for (const line of git('worktree', 'list', '--porcelain').split('\n')) {
    if (line.startsWith('worktree ')) wtPath = line.slice(9).trim()
    else if (line.startsWith('branch refs/heads/') && wtPath) worktreeOf.set(line.slice(18).trim(), wtPath)
  }

  // The lesson's video blocks on origin/main: slug (from its poster/transcript path) -> YouTube id.
  // This is what the site shows, so it is the source of truth for «integrado».
  const lessonVideo = new Map()
  for (const file of git('grep', '-l', '-e', "t: 'video'", base, '--', 'src/data').split('\n').filter(Boolean)) {
    const text = git('show', file)
    for (const block of text.split(/t: 'video'/).slice(1)) {
      const body = block.slice(0, block.indexOf('}'))
      const id = body.match(/youtube:\s*'([^']+)'/)?.[1]
      const slug = body.match(/videos\/([a-z0-9-]+)-(?:poster|transcript)/)?.[1]
      if (id && slug) lessonVideo.set(slug, id)
    }
  }
  const voiceFiles = fs.existsSync(voices) ? fs.readdirSync(voices) : []

  // Script worktrees of .claude/worktrees, plus any worktree (scratchpads included) checked out on a
  // branch video-<slug> that holds video/<slug>/video.json: a script written in an NTFS scratch worktree
  // is still a script (2026-10-24: V54–V59 lived only there).
  const candidates = new Map()
  for (const n of listDir(worktrees)) if (n.startsWith('video-')) candidates.set(n, path.join(worktrees, n))
  for (const [branch, wt] of worktreeOf) {
    const m = branch.match(/^video-(.+)$/)
    if (m && !candidates.has(branch) && fs.existsSync(path.join(wt, 'video', m[1], 'video.json'))) candidates.set(branch, wt)
  }
  const names = [...candidates.keys()]
  const branchesByName = new Map(names.map((n) => [n, branchesOfVideo(n, allBranches, names)]))

  // ONE git process reads, for every video: main's files, and each of its branches' narration.json.
  const FILES = ['narration.json', 'video.json', 'storyboard.json']
  const specs = []
  const at = new Map() // spec -> index
  const want = (spec) => {
    if (!at.has(spec)) (at.set(spec, specs.length), specs.push(spec))
    return at.get(spec)
  }
  for (const name of names) {
    const slug = name.slice(6)
    for (const f of FILES) want(`${base}:video/${slug}/${f}`)
    for (const b of branchesByName.get(name)) want(`${b}:video/${slug}/narration.json`)
  }
  const blobs = catFiles(specs)
  const blob = (spec) => blobs[at.get(spec)] ?? null

  // Date of the newest main commit that touched each narration.json.
  const mainNarrationPaths = names
    .map((n) => `video/${n.slice(6)}/narration.json`)
    .filter((p) => blob(`${base}:${p}`) != null)
  const textDates = mainNarrationPaths.length
    ? parseLogDates(git('log', '--name-only', '--format=@@%cs', base, '--', ...mainNarrationPaths))
    : new Map()

  // Sheet writer: the engine's own library taken from origin/main, extracted into a temp dir (it resolves its
  // repo root from its own location and reads video/<anchor>/video.json when loaded). null when unavailable.
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pending-scripts-'))
  let recordingSheet = null
  let engineError = ''
  if (mainNarrationPaths.length) {
    try {
      const libDir = 'video/engine/scripts/lib'
      const files = git('ls-tree', '--name-only', base, `${libDir}/`)
        .split('\n')
        .filter((f) => /\.mjs$/.test(f) && !/\.test\.mjs$/.test(f))
      const texts = catFiles(files.map((f) => `${base}:${f}`))
      files.forEach((f, k) => {
        if (texts[k] == null) return
        const dest = path.join(tmp, f)
        fs.mkdirSync(path.dirname(dest), { recursive: true })
        fs.writeFileSync(dest, texts[k])
      })
      const anchor = path.join(tmp, 'video', 'anchor')
      fs.mkdirSync(anchor, { recursive: true })
      fs.writeFileSync(
        path.join(anchor, 'video.json'),
        JSON.stringify({ slug: 'anchor', output: 'anchor', composition: 'anchor', poster: 'anchor', profile: 'principal-yt', track: 'secplus' }),
      )
      process.env.VIDEO = 'anchor'
      const mod = await import(pathToFileURL(path.join(tmp, libDir, 'script-sheets.mjs')).href)
      recordingSheet = mod.recordingSheet
    } catch (err) {
      engineError = `no se pudo cargar el generador de hojas de ${base}: ${err.message}`
      console.warn(`pending-scripts: ${engineError}`)
    }
  }

  const items = []
  const sheetMd = new Map() // slug -> markdown of the sheet
  for (const name of names) {
    const slug = name.slice(6)
    const dir = path.join(candidates.get(name), 'video', slug)
    const folderMeta = readJson(path.join(dir, 'video.json'))
    const folderNarration = readJson(path.join(dir, 'narration.json'))

    // Main's version of the script, when it has one.
    const mainNarration = parseJson(blob(`${base}:video/${slug}/narration.json`))
    const mainMeta = parseJson(blob(`${base}:video/${slug}/video.json`))
    const mainStoryboard = parseJson(blob(`${base}:video/${slug}/storyboard.json`))
    let mainSheet = ''
    let sheetError = ''
    if (mainNarration && mainMeta) {
      if (!mainStoryboard) sheetError = `${base} no tiene storyboard.json de ${slug}`
      else if (!recordingSheet) sheetError = engineError || 'sin generador de hojas'
      else {
        try {
          mainSheet = recordingSheet({ storyboard: mainStoryboard, narration: mainNarration, manifest: mainMeta })
        } catch (err) {
          sheetError = `la hoja de ${base} falló: ${err.message}`
        }
      }
    }
    const fromMain = Boolean(mainSheet)
    const meta = fromMain ? mainMeta : folderMeta
    if (!meta) continue
    const narration = fromMain ? mainNarration : folderNarration
    const segments = narration?.segments ?? []
    const words = segments.reduce((n, s) => n + countWords(s.text ?? ''), 0)
    const outDir = path.join(dir, 'out')
    const folderSheet = path.join(outDir, 'guion-grabacion.md')
    const hasFolderSheet = fs.existsSync(folderSheet)
    const hasSheet = fromMain || hasFolderSheet
    const recorded = voiceFiles.some((f) => f === `${slug} lidia.wav` || f === `${slug} lidia (master).wav`)
    const extras = voiceFiles.filter(
      (f) => f.startsWith(`${slug} `) && !f.includes('(master)') && f !== `${slug} lidia.wav`,
    ).length
    // Every branch of this video (script, -voz, -scenes...) and the worktree each one is checked out in.
    const branches = branchesByName.get(name)
    const places = [...new Set([candidates.get(name), ...branches.map((b) => worktreeOf.get(b)).filter(Boolean)])]
    let clips = 0
    let mp4 = ''
    let upload = null
    for (const wt of places) {
      const vdir = path.join(wt, 'video', slug)
      clips = Math.max(clips, listDir(path.join(vdir, 'tts')).filter((f) => f.endsWith('.json')).length)
      const found = listDir(path.join(vdir, 'out')).find((f) => f === `${slug}.mp4`)
      if (found && !mp4) mp4 = path.join(vdir, 'out', found)
      const up = readJson(path.join(vdir, 'out', 'youtube-upload.json'))
      if (up?.videoId) {
        const stamp = fs.statSync(path.join(vdir, 'out', 'youtube-upload.json')).mtimeMs
        if (!upload || stamp > upload.at) upload = { id: up.videoId, at: stamp, where: wt }
      }
    }
    const branchClips = (b) =>
      git('ls-tree', '--name-only', `${b}:video/${slug}/tts`).split('\n').filter((f) => f.endsWith('.json')).length
    for (const b of branches) clips = Math.max(clips, branchClips(b))
    // The lesson's id wins; else the newest upload file; else «YouTube <id>» in a commit that only a -voz
    // branch has (base..branch: the rest of its log is main's history, full of other videos' ids).
    const inLesson = lessonVideo.has(slug)
    let youtubeId = lessonVideo.get(slug) ?? upload?.id ?? ''
    if (!youtubeId) {
      for (const b of branches.filter((b) => b.endsWith('-voz'))) {
        const log = git('log', '-F', `--grep=${slug}`, '--format=%s %b', `${base}..${b}`)
        const m = log.match(/YouTube[^A-Za-z0-9_-]+([A-Za-z0-9_-]{11})\b/)
        if (m) {
          youtubeId = m[1]
          break
        }
      }
    }
    const yt = youtubeId && !inLesson ? await youtubeStatus(youtubeId) : null
    const state = stateOf({ inLesson, yt, youtubeId, mp4, clips, recorded, frozen: meta.frozen, hasSheet })

    // Does any other copy of the script say something else than main?
    const diverges = []
    if (fromMain) {
      const seen = new Map() // JSON of the comparison -> where
      for (const b of branches) {
        const other = parseJson(blob(`${b}:video/${slug}/narration.json`))
        const cmp = other && compareSegments(mainNarration, other)
        if (cmp) {
          diverges.push({ where: `rama ${b}`, ...cmp })
          seen.set(JSON.stringify(cmp), b)
        }
      }
      const cmp = folderNarration && compareSegments(mainNarration, folderNarration)
      // A work folder checked out on one of those branches repeats its difference: report it once.
      if (cmp && !seen.has(JSON.stringify(cmp))) diverges.push({ where: `carpeta ${name}`, ...cmp })
    }

    const textSource = fromMain ? 'main' : 'rama'
    const textDate = fromMain ? (textDates.get(`video/${slug}/narration.json`) ?? '') : ''
    const textWhere = fromMain ? base : `la carpeta ${name}`
    const item = {
      slug,
      title: meta.youtubeTitle ?? slug,
      lesson: meta.lesson ?? '',
      track: meta.track ?? '',
      profile: meta.profile ?? '',
      adversary: meta.adversary ?? '',
      frozen: meta.frozen ?? '',
      state,
      segments: segments.length,
      words,
      minutes: Math.round((words / 2.5 / 60) * 10) / 10,
      sheet: '',
      sheetDate: '',
      wav: path.join(voices, `${slug} lidia.wav`),
      extraTakes: extras,
      clips,
      mp4,
      youtubeId,
      youtubeChecked: yt != null,
      vozBranch: branches.find((b) => b.endsWith('-voz')) ?? '',
      vozWorktree: '',
      textSource,
      textDate,
      textWhere,
      textLabel: hasSheet ? textLabel({ textSource, textDate, textWhere }) : '',
      diverges,
      warnings: RECORDING_STATES.includes(state) ? diverges.map(divergeWarning) : [],
      notes: state !== 'integrado' && !RECORDING_STATES.includes(state) ? diverges.map(divergeNote) : [],
    }
    item.vozWorktree = (item.vozBranch && worktreeOf.get(item.vozBranch)) || ''
    if (sheetError) item.sheetError = sheetError
    if (fromMain) {
      sheetMd.set(slug, mainSheet)
      item.sheetDate = textDate
    } else if (hasFolderSheet) {
      sheetMd.set(slug, fs.readFileSync(folderSheet, 'utf8'))
      item.sheet = folderSheet
      item.sheetDate = fs.statSync(folderSheet).mtime.toISOString().slice(0, 10)
    }
    items.push(item)
  }

  const order = ['por-grabar', 'grabado', 'importado', 'renderizado', 'subido', 'publicado', 'borrador', 'integrado']
  items.sort(
    (a, b) =>
      order.indexOf(a.state) - order.indexOf(b.state) ||
      (a.frozen || '9').localeCompare(b.frozen || '9') ||
      a.lesson.localeCompare(b.lesson, 'en', { numeric: true }),
  )

  const template = fs.readFileSync(path.join(scriptRoot, 'scripts', 'pending-scripts.template.html'), 'utf8')
  const TOKENS = template.match(/\/\* TOKENS-START \*\/([\s\S]*?)\/\* TOKENS-END \*\//)[1]
  const sheetsDir = path.join(path.dirname(path.resolve(outFile)), 'guiones')
  fs.rmSync(sheetsDir, { recursive: true, force: true })
  fs.mkdirSync(sheetsDir, { recursive: true })
  for (const i of items) {
    if (i.state === 'integrado' || !sheetMd.has(i.slug)) continue
    const md = sheetMd.get(i.slug)
    if (i.textSource === 'main') {
      // Main's sheet has no file in any worktree: keep it next to the page so «Hoja» points at the right text.
      i.sheet = path.join(sheetsDir, `${i.slug}.md`)
      fs.writeFileSync(i.sheet, md)
    }
    i.sheetPage = `guiones/${i.slug}.html`
    fs.writeFileSync(
      path.join(sheetsDir, `${i.slug}.html`),
      sheetPageHtml({
        title: i.title,
        tokens: TOKENS,
        body: mdToHtml(md),
        textLabel: i.textLabel,
        warnings: i.warnings.length ? i.warnings : i.notes,
      }),
    )
  }

  const data = { updated: new Date().toISOString(), base, behind, items }
  const html = template.replace('/*SHEETCSS*/', () => SHEET_CSS).replace('/*DATA*/null', () => JSON.stringify(data))
  fs.writeFileSync(outFile, html)
  fs.rmSync(tmp, { recursive: true, force: true })
  const counts = items.reduce((m, i) => ((m[i.state] = (m[i.state] ?? 0) + 1), m), {})
  const fromMainCount = items.filter((i) => i.textSource === 'main').length
  console.log(
    JSON.stringify(counts),
    `(against ${base}; local main ${behind} commits behind; text from main: ${fromMainCount}/${items.length}; diverging: ${items.filter((i) => i.diverges.length).length})`,
    '->',
    outFile,
  )
}

const norm = (p) => (process.platform === 'win32' ? path.resolve(p).toLowerCase() : path.resolve(p))
const isMain = Boolean(process.argv[1]) && norm(process.argv[1]) === norm(fileURLToPath(import.meta.url))
if (isMain) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
