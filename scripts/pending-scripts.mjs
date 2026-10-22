#!/usr/bin/env node
// Scans every video worktree and writes the "Guiones pendientes" artifact page.
//   node scripts/pending-scripts.mjs <out.html>
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
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const worktrees = path.join(root, '.claude', 'worktrees')
const voices = path.join(root, 'video', 'engine', 'voices')
const outFile = process.argv[2]
if (!outFile) {
  console.error('usage: node scripts/pending-scripts.mjs <out.html>')
  process.exit(1)
}

const git = (...args) => {
  try {
    return execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
  } catch {
    return ''
  }
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
const listDir = (p) => {
  try {
    return fs.readdirSync(p)
  } catch {
    return []
  }
}
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
const readJson = (p) => {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'))
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

const items = []
for (const name of fs.readdirSync(worktrees)) {
  if (!name.startsWith('video-')) continue
  const slug = name.slice(6)
  const dir = path.join(worktrees, name, 'video', slug)
  const meta = readJson(path.join(dir, 'video.json'))
  if (!meta) continue
  const narration = readJson(path.join(dir, 'narration.json'))
  const segments = narration?.segments ?? []
  const words = segments.reduce((n, s) => n + countWords(s.text ?? ''), 0)
  const outDir = path.join(dir, 'out')
  const sheet = path.join(outDir, 'guion-grabacion.md')
  const hasSheet = fs.existsSync(sheet)
  const recorded = voiceFiles.some((f) => f === `${slug} lidia.wav` || f === `${slug} lidia (master).wav`)
  const extras = voiceFiles.filter(
    (f) => f.startsWith(`${slug} `) && !f.includes('(master)') && f !== `${slug} lidia.wav`,
  ).length
  // Every branch of this video (script, -voz, -scenes...) and the worktree each one is checked out in.
  const branches = allBranches.filter((b) => b === name || b.startsWith(`${name}-`))
  const places = [...new Set([path.join(worktrees, name), ...branches.map((b) => worktreeOf.get(b)).filter(Boolean)])]
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
      const at = fs.statSync(path.join(vdir, 'out', 'youtube-upload.json')).mtimeMs
      if (!upload || at > upload.at) upload = { id: up.videoId, at, where: wt }
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
  let state
  if (inLesson) state = 'integrado'
  else if (yt === 200) state = 'publicado'
  else if (youtubeId && yt !== 404) state = 'subido'
  else if (mp4) state = 'renderizado'
  else if (clips > 0) state = 'importado'
  else if (recorded) state = 'grabado'
  else if (meta.frozen && hasSheet) state = 'por-grabar'
  else state = 'borrador'
  const vozBranch = branches.find((b) => b.endsWith('-voz')) ?? ''
  items.push({
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
    sheet: hasSheet ? sheet : '',
    sheetDate: hasSheet ? fs.statSync(sheet).mtime.toISOString().slice(0, 10) : '',
    wav: path.join(voices, `${slug} lidia.wav`),
    extraTakes: extras,
    clips,
    mp4,
    youtubeId,
    youtubeChecked: yt != null,
    vozBranch,
    vozWorktree: (vozBranch && worktreeOf.get(vozBranch)) || '',
  })
}

const order = ['por-grabar', 'grabado', 'importado', 'renderizado', 'subido', 'publicado', 'borrador', 'integrado']
items.sort(
  (a, b) =>
    order.indexOf(a.state) - order.indexOf(b.state) ||
    (a.frozen || '9').localeCompare(b.frozen || '9') ||
    a.lesson.localeCompare(b.lesson, 'en', { numeric: true }),
)

// Recording sheets as small HTML pages next to the artifact (guiones/<slug>.html): the page
// fetches them into its reader panel and also links to them.
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const inline = (s) =>
  esc(s).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\*([^*]+)\*/g, '<i>$1</i>').replace(/`([^`]+)`/g, '<code>$1</code>')
function mdToHtml(md) {
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
`
const TOKENS = fs
  .readFileSync(path.join(root, 'scripts', 'pending-scripts.template.html'), 'utf8')
  .match(/\/\* TOKENS-START \*\/([\s\S]*?)\/\* TOKENS-END \*\//)[1]
const sheetsDir = path.join(path.dirname(path.resolve(outFile)), 'guiones')
fs.rmSync(sheetsDir, { recursive: true, force: true })
fs.mkdirSync(sheetsDir, { recursive: true })
for (const i of items) {
  if (i.state === 'integrado' || !i.sheet) continue
  const body = mdToHtml(fs.readFileSync(i.sheet, 'utf8'))
  i.sheetPage = `guiones/${i.slug}.html`
  fs.writeFileSync(
    path.join(sheetsDir, `${i.slug}.html`),
    `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">` +
      `<title>${esc(i.title)}</title>` +
      `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@500;700&family=Hanken+Grotesk:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap">` +
      `<style>${TOKENS}body{background:var(--bg);color:var(--ink);margin:0;padding:28px max(16px,env(safe-area-inset-right,0px)) 48px max(16px,env(safe-area-inset-left,0px))}.sheet{margin:0 auto}${SHEET_CSS}</style></head>` +
      `<body><article class="sheet">${body}</article></body></html>\n`,
  )
}

const template = fs.readFileSync(path.join(root, 'scripts', 'pending-scripts.template.html'), 'utf8')
const data = { updated: new Date().toISOString(), base, behind, items }
const html = template.replace('/*SHEETCSS*/', () => SHEET_CSS).replace('/*DATA*/null', () => JSON.stringify(data))
fs.writeFileSync(outFile, html)
const counts = items.reduce((m, i) => ((m[i.state] = (m[i.state] ?? 0) + 1), m), {})
console.log(JSON.stringify(counts), `(against ${base}; local main ${behind} commits behind)`, '->', outFile)
