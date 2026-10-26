// Pure helpers for scripts/pending-scripts.mjs (no git, no disk): what text a recording sheet follows,
// whether another branch/folder has a different text, and the video's state. Tested in
// scripts/pending-scripts.test.mjs (node --test).

/** Text as it is read aloud: no {cue} marks, no <emotion> tags, spaces collapsed. */
export function normalizeText(text) {
  return String(text ?? '')
    .replace(/\{[^}]*\}/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** id -> normalized text, for the segments of a narration.json (already parsed). */
export function segmentTexts(narration) {
  const map = new Map()
  for (const seg of narration?.segments ?? []) {
    if (seg && typeof seg.id === 'string') map.set(seg.id, normalizeText(seg.text))
  }
  return map
}

/**
 * Compares `other` against the reference narration (main's). null when the spoken text is the same;
 * else counts (and ids) of segments whose text changed, that `other` adds and that `other` lacks.
 */
export function compareSegments(reference, other) {
  const ref = segmentTexts(reference)
  const oth = segmentTexts(other)
  const changed = []
  const added = []
  const removed = []
  for (const [id, text] of oth) {
    if (!ref.has(id)) added.push(id)
    else if (ref.get(id) !== text) changed.push(id)
  }
  for (const id of ref.keys()) if (!oth.has(id)) removed.push(id)
  if (!changed.length && !added.length && !removed.length) return null
  return {
    changedSegments: changed.length,
    addedSegments: added.length,
    removedSegments: removed.length,
    ids: { changed: changed.slice(0, 8), added: added.slice(0, 8), removed: removed.slice(0, 8) },
  }
}

/** Number of different segments in a `diverges` entry. */
export const differentSegments = (d) => d.changedSegments + d.addedSegments + d.removedSegments

/** Branches that belong to video `name` ("video-<slug>"), not to a longer slug it is a prefix of (ir-halden / ir-halden-pruebas). */
export function branchesOfVideo(name, allBranches, allNames = []) {
  const own = (b, n) => b === n || b.startsWith(`${n}-`)
  const longer = allNames.filter((n) => n !== name && n.startsWith(`${name}-`))
  return allBranches.filter((b) => own(b, name) && !longer.some((n) => own(b, n)))
}

/**
 * Output of `git cat-file --batch` for `count` requests -> array of strings (null where the object is
 * missing). Sizes are bytes, so this works on the raw Buffer.
 */
export function parseCatBatch(buf, count) {
  const out = []
  let pos = 0
  for (let k = 0; k < count; k += 1) {
    const nl = buf.indexOf(0x0a, pos)
    if (nl < 0) {
      out.push(null)
      continue
    }
    const header = buf.toString('utf8', pos, nl)
    pos = nl + 1
    if (/ missing$/.test(header) || / ambiguous$/.test(header)) {
      out.push(null)
      continue
    }
    const size = Number(header.split(' ')[2])
    if (!Number.isFinite(size)) {
      out.push(null)
      continue
    }
    out.push(buf.toString('utf8', pos, pos + size))
    pos += size + 1
  }
  return out
}

/** `git log --name-only --format=@@%cs` (newest first) -> Map path -> date of the newest commit touching it. */
export function parseLogDates(text) {
  const dates = new Map()
  let date = ''
  for (const raw of String(text).split('\n')) {
    const line = raw.trim()
    if (!line) continue
    if (line.startsWith('@@')) date = line.slice(2)
    else if (date && !dates.has(line)) dates.set(line, date)
  }
  return dates
}

/** State of a video (first match wins); same rules as the header of pending-scripts.mjs. */
export function stateOf({ inLesson, yt, youtubeId, mp4, clips, recorded, frozen, hasSheet }) {
  if (inLesson) return 'integrado'
  if (yt === 200) return 'publicado'
  if (youtubeId && yt !== 404) return 'subido'
  if (mp4) return 'renderizado'
  if (clips > 0) return 'importado'
  if (recorded) return 'grabado'
  if (frozen && hasSheet) return 'por-grabar'
  return 'borrador'
}

/** States whose card carries the loud text-source label and the warning (the ones still to record). */
export const RECORDING_STATES = ['por-grabar', 'borrador']

/** Label for the card / sheet: which text the recording sheet follows. */
export function textLabel({ textSource, textDate, textWhere }) {
  if (textSource === 'main') return `Texto de main${textDate ? ` · ${textDate}` : ''}`
  return `Guion sin mergear · está en ${textWhere}`
}

const phrases = (n) => (n === 1 ? '1 frase distinta' : `${n} frases distintas`)

/** Loud warning for one divergence (cards still to record, and the sheet pages). */
export function divergeWarning(d) {
  return (
    `Ojo: la ${d.where} tiene otro texto (${phrases(differentSegments(d))}). ` +
    'Esta hoja sigue main; si ya grabaste otra versión, avísame antes de importar.'
  )
}

/** Discreet line for the rest of the states. */
export function divergeNote(d) {
  return `Hay otro texto en ${d.where} (${phrases(differentSegments(d))}).`
}
