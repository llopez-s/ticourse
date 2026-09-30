// Cross-references a video's names, numbers and times with the rest of its campaign (canon-check.mjs).
// Pure: every function takes text or parsed JSON and returns data or Markdown.
//
// Why: published videos fix facts that only appear on screen (hosts, accounts, IPs, times) in their
// src/data and scenes. V5 contradicted the SIEM video's 01:52 logon (from ADM-WS-07) and V1's 16:11
// isolation, and it was only found after the narrator had recorded. This lists, for every such token
// of a new script, where else the campaign already uses it, so the accuracy reviewer checks the
// context instead of guessing.

/** What counts as a canon token: the spoken-style identifiers (narration.mjs) plus times, cases and accounts. */
export const CANON_PATTERNS = Object.freeze([
  /^[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/i, // domain: haldenport.example, update-svc-cdn.com
  /^\d{1,3}(\.(\d{1,3}|x)){3}$/i, // IPv4, also a redacted 185.220.x.x
  /^[A-Z]{2,}(-[A-Z0-9]+)+-\d{2,}$/, // host, case or evidence id: ADM-WS-02, IR-2026-0147, HPA-EV-003
  /^[a-z]{2,}-[a-z0-9-]*\d{2,}$/, // lowercase server name: srv-tc-app03
  /^[0-9a-f]{4,}(\.{3}|…)[0-9a-f]+$/i, // shortened hash: 9f3a...e1
  /^[0-9a-f]{16,}$/i, // hash
  /^[^@\s]+@[^@\s]+$/, // e-mail address
  /^svc_[a-z0-9_]+$/i, // service account: svc_tosreport
  /^\w+_[\w%]+$/, // file or pipe name: vc_pipe_%08x
  /^([01]\d|2[0-3]):[0-5]\d$/, // time: 16:09 (two-digit hour, as the videos write them)
]);

const SPLIT = /[\s·–—,;()[\]{}|<>«»"“”¿¡!?]+/u;
const trim = (t) => t.replace(/^['`.:]+/, '').replace(/[.'`:…]+$/, (m) => (m.includes('…') && m.length === 1 ? m : ''));

/** Canon tokens in a text (a Set, in order of appearance). An IP's port is dropped (203.0.113.47:443). */
export function canonTokens(text) {
  const out = new Set();
  for (const raw of String(text).split(SPLIT)) {
    let t = trim(raw);
    const ipPort = /^(\d{1,3}(?:\.\d{1,3}){3}):\d+$/.exec(t);
    if (ipPort) t = ipPort[1];
    if (t && CANON_PATTERNS.some((re) => re.test(t))) out.add(t);
  }
  return out;
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** What a hit is counted against: a video (video/<slug>), a lessons folder (src/data/secplus), or the file itself. */
export function refSource(file) {
  const video = /^video\/[^/]+/.exec(file);
  if (video) return video[0];
  const lessons = /^src\/data\/[^/]+(?=\/)/.exec(file);
  return lessons ? lessons[0] : file;
}

/**
 * Where each token appears in the corpus ([{file, lines}]): whole tokens only (ADM-WS-070 is not ADM-WS-07,
 * 101:520 is not 01:52), at most `maxPerSource` hits per source (refSource) so one busy video does not hide
 * the others, and `maxHits` in all, as [{file, line (1-based), text (trimmed)}].
 */
export function findRefs(tokens, corpus, { maxHits = 10, maxPerSource = 2 } = {}) {
  const refs = new Map();
  for (const token of tokens) {
    const re = new RegExp(`(?<![\\w.:-])${escapeRe(token)}(?![\\w:]|-\\w|\\.\\w)`);
    const hits = [];
    const perSource = new Map();
    for (const { file, lines } of corpus) {
      const source = refSource(file);
      for (let k = 0; k < lines.length && hits.length < maxHits; k += 1) {
        if ((perSource.get(source) ?? 0) >= maxPerSource) break;
        if (re.test(lines[k])) {
          hits.push({ file, line: k + 1, text: lines[k].trim().slice(0, 160) });
          perSource.set(source, (perSource.get(source) ?? 0) + 1);
        }
      }
      if (hits.length >= maxHits) break;
    }
    refs.set(token, hits);
  }
  return refs;
}

/** The contents of the string literals of a TS/TSX source ('…', "…", `…`): what a scene can put on screen. */
export function stringLiterals(src) {
  const out = [];
  const re = /'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g;
  let m;
  while ((m = re.exec(src))) out.push(m[1] ?? m[2] ?? m[3]);
  return out;
}

/** The shown side of a narration.json: segment texts without {cues}, <directions> or the [..|spoken] side, plus intercepts, exam cards and think prompts. */
export function narrationTexts(narration) {
  const shown = (t) =>
    t
      .replace(/\{[^}]*\}/g, '')
      .replace(/<[^>]*>/g, '')
      .replace(/\[([^|\]]*)\|[^\]]*\]/g, '$1')
      .replace(/\s+/g, ' ')
      .trim();
  const out = [];
  for (const seg of narration.segments ?? []) {
    out.push(shown(seg.text ?? ''));
    if (seg.intercept?.text) out.push(seg.intercept.text);
    if (seg.exam?.text) out.push(seg.exam.text);
    if (seg.think?.q) out.push(seg.think.q);
  }
  return out;
}

/** The Markdown report (out/canon-refs.md): tokens already used elsewhere, with where; then those that are new. */
export function canonReport({ video, campaign, tokens, refs }) {
  const known = [...tokens].filter((t) => (refs.get(t) ?? []).length);
  const fresh = [...tokens].filter((t) => !(refs.get(t) ?? []).length);
  const out = [
    `# Canon · ${video}`,
    '',
    `Cada nombre, número u hora que este vídeo enseña o dice, y dónde más lo usa ya la campaña (otros vídeos de la misma pista, sus`,
    `lecciones y el registro \`docs/superpowers/canon/${campaign}.md\`). Quien revisa la exactitud mira el contexto de cada línea: que`,
    `el mismo dato no diga otra cosa en otro sitio (otra hora, otro equipo de origen, otra cuenta).`,
    '',
    `## Ya tienen historia (${known.length})`,
    '',
  ];
  for (const t of known) {
    out.push(`- \`${t}\``);
    for (const r of refs.get(t)) out.push(`  - ${r.file}:${r.line} — ${r.text.replace(/`/g, "'")}`);
  }
  out.push('', `## Sin rastro fuera de este vídeo (${fresh.length}) — canon nuevo: apúntalo en el registro al cerrar el vídeo`, '');
  for (const t of fresh) out.push(`- \`${t}\``);
  out.push('');
  return out.join('\n');
}
