// The «scene-builder brief»: the Markdown handed to the agents that write a video's scenes.
//
// Generic rules live in video/engine/docs/scene-brief-template.md; everything that can be read off the
// video's own files is computed here (scenes, goals, cues in narration order, where the think prompts,
// intercepted messages and exam cards fall). The canon — which strings are real, redacted or spoilers —
// cannot be computed, so the brief leaves a TODO block for the author.
//
// sceneBrief() is pure (no I/O) except that it reads the template file when no `template` is passed.
// Deliberately imports nothing that reads a manifest at load time (paths.mjs, narration.mjs).
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { EXAM_BADGE } from './profiles.mjs';
import { parseSegmentText } from './text.mjs';

export const TEMPLATE_PATH = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'docs', 'scene-brief-template.md');
export const CATALOG_REL = 'video/engine/src/ui/CATALOG.md';
export const TEMPLATE_REL = 'video/engine/docs/scene-brief-template.md';
/** The template must keep these, so an edit cannot silently drop a section of every brief. */
export const REQUIRED_PLACEHOLDERS = Object.freeze(['canon', 'scenes', 'keepClear', 'catalog']);
/** Marker of the block the author has to fill by hand. */
export const TODO_MARK = 'TODO(scene-brief)';
/** Display words quoted after each cue, so a scene builder sees what is being said at that beat. */
export const CUE_SNIPPET_WORDS = 7;

const TRACKS = {
  gcti: { label: 'GCTI track', campaign: 'VELVET CICADA' },
  secplus: { label: 'Security+ SY0-701 track', campaign: 'GLASS HARBOR, Autoridad Portuaria de Halden' },
};

// Copied from narration.mjs IDENTIFIER_PATTERNS (importing it would load paths.mjs and a manifest).
const IDENTIFIER_PATTERNS = [
  /^[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/i, // domain
  /^\d{1,3}(\.(\d{1,3}|x)){3}$/i, // IPv4, also a redacted 185.220.x.x
  /^[A-Z]{2,}(-[A-Z0-9]+)+-\d{2,}$/, // host: ENG-WS-041
  /^[0-9a-f]{4,}(\.{3}|…)[0-9a-f]+$/i, // shortened hash
  /^[0-9a-f]{16,}$/i, // hash
  /@/, // e-mail address
  /^\w+_[\w%]+$/, // file or pipe name
];
const bareToken = (t) => t.replace(/^[¿¡«"'(\[]+/, '').replace(/[.,;:!?…»"')\]]+$/, '');

/** Reads the generic template (the CLI's default). */
export function readTemplate(file = TEMPLATE_PATH) {
  return readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
}

/**
 * Fills {{name}} placeholders in one pass (values are never re-scanned). Throws on a placeholder with no
 * value and on a required placeholder the template lacks. A leading HTML comment (the template's own
 * notes) is dropped.
 */
export function fillTemplate(template, vars, required = REQUIRED_PLACEHOLDERS) {
  const body = template.replace(/^\s*<!--[\s\S]*?-->\s*/, '');
  const used = new Set([...body.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]));
  const missing = required.filter((k) => !used.has(k));
  if (missing.length) throw new Error(`scene-brief template lacks ${missing.map((k) => `{{${k}}}`).join(', ')}`);
  const unknown = [...used].filter((k) => !Object.hasOwn(vars, k) || vars[k] === undefined || vars[k] === null);
  if (unknown.length) throw new Error(`scene-brief template uses unknown placeholder(s) ${unknown.map((k) => `{{${k}}}`).join(', ')}`);
  return body.replace(/\{\{(\w+)\}\}/g, (_, k) => String(vars[k]));
}

/** Whether the CLI may write the brief: a hand-edited brief is never overwritten without --force. */
export function writeDecision({ exists, force = false }) {
  if (!exists) return { write: true, action: 'create' };
  if (force) return { write: true, action: 'overwrite' };
  return { write: false, action: 'refuse' };
}

/** Stub component name by the engine's convention: "s08-lifecycle" -> "S08Lifecycle". */
export function componentName(sceneId) {
  const [num, ...rest] = sceneId.split('-');
  return `S${num.slice(1)}${rest.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('')}`;
}

/** "D:\LLM projects\X" -> "/d/LLM projects/X" (Git Bash form); other paths unchanged. */
export function gitBashPath(p) {
  const m = /^([A-Za-z]):[\\/](.*)$/.exec(p);
  return m ? `/${m[1].toLowerCase()}/${m[2].replace(/\\/g, '/')}` : p.replace(/\\/g, '/');
}

/** Demotes Markdown headings by `by` levels (max h6), leaving fenced code alone. */
export function demoteHeadings(md, by = 2) {
  let fenced = false;
  return md
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
      if (fenced) return line;
      return line.replace(/^(#{1,6})(?=\s)/, (h) => '#'.repeat(Math.min(6, h.length + by)));
    })
    .join('\n')
    .trim();
}

const secs = (x) => (Number.isInteger(x) ? `${x} s` : `${x.toFixed(1)} s`);
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
const cell = (s) => String(s).replace(/\|/g, '\\|');
const code = (s) => `\`${s}\``;
const joinAnd = (xs) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs.at(-1)}`);

function voiceDescription(narration) {
  const v = narration.voice ?? '';
  if (v.startsWith('recording/')) {
    const tempo = narration.recording?.tempo;
    return `the narrator's own recording${tempo && tempo !== 1 ? `, sped up ×${tempo}` : ''}`;
  }
  if (v.startsWith('elevenlabs/')) return 'ElevenLabs';
  if (v.startsWith('chatterbox/')) return 'Chatterbox, local';
  return v ? `edge-tts ${v}` : 'the final voice';
}

function timelineLine(slug, mode, narration) {
  const voice = voiceDescription(narration);
  if (mode === 'estimate') return `estimate-mode timing. The real voice (${voice}) comes later and will move every beat.`;
  if (mode === 'audio') return `audio-mode timing from the real voice (${voice}); a re-recording or re-voice can still move it.`;
  return `not built yet (run \`node video/engine/scripts/build-timeline.mjs --video ${slug}\`); the voice will be ${voice}.`;
}

function workspaceLine(ws) {
  if (!ws?.root) return 'the repository checkout (TODO: path and branch)';
  const kind = ws.worktree ? 'the git worktree' : 'the main checkout';
  const branch = ws.branch ? `, branch \`${ws.branch}\`` : '';
  const git = ws.worktree ? '; git there needs `git -c safe.directory=* …` (read-only use only)' : '';
  return `${kind} \`${ws.root}\` (Git Bash: \`${gitBashPath(ws.root)}\`)${branch}${git}`;
}

function trackLine(manifest) {
  const t = TRACKS[manifest.track] ?? { label: `${manifest.track} track`, campaign: null };
  const bits = [];
  if (t.campaign) bits.push(`fictional campaign ${t.campaign}`);
  if (manifest.adversary) bits.push(`this section's adversary is **${manifest.adversary}**, who sends the intercepted messages`);
  return `${t.label}, profile \`${manifest.profile}\`${bits.length ? ` (${bits.join('; ')})` : ''}.`;
}

function lessonLine(manifest, lessonSource) {
  if (lessonSource?.file) {
    const lines = lessonSource.from ? ` (~lines ${lessonSource.from}${lessonSource.to ? `–${lessonSource.to}` : ''})` : '';
    return `\`${lessonSource.file}\`, module ${manifest.lesson}${lines}. Add any related module or lab the scenes draw from.`;
  }
  if (manifest.lesson) return `module \`${manifest.lesson}\` (not found under \`src/data/\` — TODO: locate it).`;
  return 'TODO — video.json has no "lesson"; name the module the video teaches.';
}

/** Parses every segment of the narration once, keyed by scene. */
function parseSegments(narration, lexicon) {
  const byScene = new Map();
  for (const seg of narration.segments ?? []) {
    let parsed;
    try {
      parsed = parseSegmentText(seg.text, lexicon);
    } catch (err) {
      throw new Error(`${seg.id}: ${err.message}`);
    }
    if (!byScene.has(seg.scene)) byScene.set(seg.scene, []);
    byScene.get(seg.scene).push({ ...seg, parsed });
  }
  return byScene;
}

function cueSnippet(parsed, displayIndex) {
  const words = parsed.displayTokens.slice(displayIndex, displayIndex + CUE_SNIPPET_WORDS).map((t) => t.text);
  if (!words.length) return '(end of the segment)';
  const more = displayIndex + CUE_SNIPPET_WORDS < parsed.displayTokens.length;
  let text = words.join(' ');
  // Cut mid-sentence: end on "…" (replacing a trailing comma or an ellipsis already there); a cut right
  // after a full stop, question or exclamation stays as it is.
  if (more && !/[.!?]$/.test(text)) text = `${text.replace(/[,;:…]+$/, '')}…`;
  return `«${text}»`;
}

function keepClearLines(segments) {
  const intercepts = segments.filter((s) => s.intercept).map((s) => code(s.id));
  const thinks = segments.filter((s) => s.think).map((s) => code(s.id));
  const lines = [];
  if (intercepts.length) {
    lines.push(
      `  - intercept before ${intercepts.join(', ')} (the card types out during the silent lead before that segment's ` +
        'audio and stays up until the segment ends: from before `segment(props, id).from` to `segment(props, id).to`);',
    );
  }
  if (thinks.length) {
    lines.push(`  - think prompt after ${joinAnd(thinks)} (the silent hold at the end of that segment, up to \`segment(props, id).to\`).`);
  }
  if (!lines.length) lines.push('  - nothing in this video: it has no think prompts or intercepted messages.');
  return lines.join('\n');
}

function examNote(seg, { badge, examTiming }) {
  const e = seg.exam;
  const when = !e.at
    ? `at the start of ${code(seg.id)}`
    : examTiming === 'sentence-end'
      ? `on cue ${code(e.at)}, once the sentence holding it has been heard (examTiming «sentence-end»)`
      : `on cue ${code(e.at)}`;
  return `Exam card (${badge} · ${e.objective}, ${secs(e.holdSec ?? 5)}) ${when}: «${e.text}». It draws in the top band, outside the stage.`;
}

function thinkNote(seg) {
  return (
    `Think prompt after ${code(seg.id)}: «${seg.think.q}» — a ${secs(seg.think.holdMs / 1000)} silent hold; keep the top-centre ` +
    `band clear from the end of that segment's speech to \`segment(props, '${seg.id}').to\`.`
  );
}

function interceptNote(seg, adversary, voiced) {
  return (
    `Intercepted message (${adversary}) before ${code(seg.id)}: «${seg.intercept.text}» — typed out${voiced ? ' and voiced' : ''} during a ` +
    `≥ ${secs(seg.intercept.holdMs / 1000)} silent lead before \`segment(props, '${seg.id}').from\` and on screen until ` +
    `\`segment(props, '${seg.id}').to\`; keep the top-centre band clear for all of it.`
  );
}

function sceneSection(ctx, scene, segs) {
  const { slug, chapters, sfx, badge, examTiming, adversary, voiced } = ctx;
  const out = [];
  const comp = componentName(scene.id);
  const chapter = chapters.get(scene.chapter);
  const segRange = segs.length ? `segments ${code(segs[0].id)}${segs.length > 1 ? `–${code(segs.at(-1).id)}` : ''} (${segs.length})` : 'NO segments in narration.json';
  out.push(`### ${code(scene.id)} · ${scene.title ?? '(untitled)'}`);
  out.push(
    `- Component: ${code(comp)} (\`video/${slug}/src/scenes/${comp}.tsx\`) · chapter ${scene.chapter}${chapter ? ` «${chapter}»` : ''}` +
      `${scene.targetSec ? ` · target ${secs(scene.targetSec)}` : ''} · ${segRange}`,
  );
  out.push(`- Goal (visual spec): ${scene.goal ? scene.goal : 'none in storyboard.json — TODO: describe what the screen shows.'}`);

  const fired = [];
  for (const seg of segs) for (const cue of seg.parsed.cues) fired.push({ id: cue.id, seg, displayIndex: cue.displayIndex });
  if (fired.length) {
    out.push('- Cues, in narration order:');
    fired.forEach((c, k) => {
      const sound = sfx[c.id] ? `, sfx «${sfx[c.id]}»` : '';
      out.push(`  ${k + 1}. ${code(c.id)} (${c.seg.id}${sound}) — ${cueSnippet(c.seg.parsed, c.displayIndex)}`);
    });
  } else {
    out.push('- Cues: none in the narration.');
  }
  const required = scene.requiredCues ?? [];
  const firedIds = [...new Set(fired.map((c) => c.id))];
  const missing = required.filter((id) => !firedIds.includes(id));
  const extra = firedIds.filter((id) => !required.includes(id));
  if (missing.length) out.push(`- Required cue(s) missing from the narration: ${missing.map(code).join(', ')} — ask the script author.`);
  if (extra.length) out.push(`- Cue(s) in the narration but not in requiredCues: ${extra.map(code).join(', ')}.`);
  const inOrder = firedIds.filter((id) => required.includes(id)).join(' ');
  if (!missing.length && inOrder !== required.join(' ')) out.push(`- Note: the cues fire in a different order than requiredCues lists them (${required.join(', ')}).`);

  const notes = [];
  for (const seg of segs) {
    if (seg.intercept) notes.push(interceptNote(seg, adversary, voiced));
    if (seg.exam) notes.push(examNote(seg, { badge, examTiming }));
    if (seg.think) notes.push(thinkNote(seg));
  }
  if (notes.length) {
    out.push('- Timing notes:');
    for (const n of notes) out.push(`  - ${n}`);
  } else {
    out.push('- Timing notes: none (no exam card, think prompt or intercepted message in this scene).');
  }
  return out.join('\n');
}

function scenesBlock(ctx, storyboard, byScene) {
  const out = ['## Scenes', ''];
  const total = storyboard.targetTotalSec ?? storyboard.scenes.reduce((a, s) => a + (s.targetSec ?? 0), 0);
  const chapterList = [...ctx.chapters].map(([n, t]) => `${n} «${t}»`).join(' · ');
  out.push(`${storyboard.scenes.length} scenes${total ? `, target ${mmss(total)} (${total} s)` : ''}. Chapters: ${chapterList || '(none)'}.`);
  out.push('');
  out.push('| Scene | Component | Ch. | Title | Target | Cues | Overlays |');
  out.push('|---|---|---|---|---|---|---|');
  for (const scene of storyboard.scenes) {
    const segs = byScene.get(scene.id) ?? [];
    const cues = segs.reduce((a, s) => a + s.parsed.cues.length, 0);
    const flags = [
      ...segs.filter((s) => s.exam).map(() => 'exam'),
      ...segs.filter((s) => s.think).map((s) => `think after ${s.id}`),
      ...segs.filter((s) => s.intercept).map((s) => `intercept before ${s.id}`),
    ];
    out.push(
      `| ${code(scene.id)} | ${code(componentName(scene.id))} | ${scene.chapter} | ${cell(scene.title ?? '')} | ${scene.targetSec ? secs(scene.targetSec) : '-'} | ${cues} | ${flags.join(', ') || '-'} |`,
    );
  }
  for (const scene of storyboard.scenes) {
    out.push('');
    out.push(sceneSection(ctx, scene, byScene.get(scene.id) ?? []));
  }
  return out.join('\n');
}

/** Identifier-like strings (domains, IPs, hosts, hashes, e-mails) in the goals and on-screen texts, with the scenes they appear in. */
export function identifierCandidates(storyboard, byScene) {
  const found = new Map(); // string -> Set(scene id)
  const scan = (text, sceneId) => {
    for (const raw of String(text ?? '').split(/\s+/)) {
      const t = bareToken(raw);
      if (t && IDENTIFIER_PATTERNS.some((re) => re.test(t))) {
        if (!found.has(t)) found.set(t, new Set());
        found.get(t).add(sceneId);
      }
    }
  };
  for (const scene of storyboard.scenes) {
    scan(scene.goal, scene.id);
    for (const seg of byScene.get(scene.id) ?? []) {
      scan(seg.parsed.display, scene.id);
      scan(seg.exam?.text, scene.id);
      scan(seg.think?.q, scene.id);
      scan(seg.intercept?.text, scene.id);
    }
  }
  return [...found].map(([text, scenes]) => ({ text, scenes: [...scenes] }));
}

function canonBlock(candidates) {
  const out = [
    '## Canon (fictional data — keep exactly)',
    '',
    `<!-- ${TODO_MARK}: the author fills this section before dispatching; it cannot be computed. -->`,
    '> **TODO (author):** this section is not generated. Replace every TODO bullet with the video\'s canon before',
    '> dispatching the scene builders, then delete this note.',
    '',
    '- TODO visual metaphors: the one image per concept that the narration sustains, identical in every scene that',
    '  shows it (what it looks like, which scenes refer back to it).',
    '- TODO canon strings: names, dates, domains, IPs, hashes, e-mail addresses — exactly as they must appear on screen.',
    '- TODO redactions: what is drawn redacted («████») and where.',
    '- TODO anti-spoilers (never show): strings reserved for a lab or a later video, and a rule against inventing',
    '  readable new ones.',
    '- TODO video-specific colour meanings, and the exam terms kept in English on screen.',
  ];
  out.push('');
  if (candidates.length) {
    out.push('Identifier-like strings found in this video\'s storyboard goals and narration — a starting point: decide which are');
    out.push('canon, which are redacted and which are spoilers:');
    for (const c of candidates) out.push(`- ${code(c.text)} — ${c.scenes.join(', ')}`);
  } else {
    out.push('No identifier-like strings (domains, IPs, hashes, e-mails) were found in the storyboard goals or the narration.');
  }
  return out.join('\n');
}

function catalogBlock(catalog) {
  const head = ['## Componentes del motor', ''];
  if (typeof catalog === 'string' && catalog.trim()) {
    return [
      ...head,
      `Copied from \`${CATALOG_REL}\` when this brief was generated (read the file itself if it has changed since):`,
      '',
      demoteHeadings(catalog, 2),
    ].join('\n');
  }
  return [
    ...head,
    `\`${CATALOG_REL}\` does not exist yet — read it once it lands. Until then the exported components are in`,
    '`video/engine/src/ui/index.ts` (Panel, NodeCard, Chip, MonoLine, Connector, Counter, Icon…).',
  ].join('\n');
}

/**
 * Builds the brief.
 * @param {object} o
 * @param {string} o.slug
 * @param {object} o.manifest       parsed video.json
 * @param {object} o.storyboard     parsed storyboard.json
 * @param {object} o.narration      parsed narration.json
 * @param {object} [o.lexicon]      parsed lexicon (only affects the spoken side; kept for parse parity)
 * @param {string|null} [o.catalog] contents of video/engine/src/ui/CATALOG.md, or null when missing
 * @param {string} [o.template]     the template text (default: the engine's template file)
 * @param {{root: string, branch?: string, worktree?: boolean}|null} [o.workspace]
 * @param {{file: string, from?: number, to?: number}|null} [o.lessonSource]
 * @param {string[]} [o.references] slugs of other engine videos with scenes to learn from
 * @param {'estimate'|'audio'|null} [o.timelineMode]
 * @returns {string} Markdown
 */
export function sceneBrief({
  slug,
  manifest,
  storyboard,
  narration,
  lexicon = {},
  catalog = null,
  template = readTemplate(),
  workspace = null,
  lessonSource = null,
  references = [],
  timelineMode = null,
}) {
  if (!Array.isArray(storyboard?.scenes) || !storyboard.scenes.length) throw new Error('storyboard.json has no scenes');
  const byScene = parseSegments(narration, lexicon);
  const segments = [...byScene.values()].flat();
  const chapters = new Map((storyboard.chapters ?? []).map((c) => [c.n, c.title]));
  const ctx = {
    slug,
    chapters,
    sfx: narration.sfx ?? {},
    badge: EXAM_BADGE[manifest.track] ?? manifest.track,
    examTiming: narration.examTiming ?? 'cue',
    adversary: manifest.adversary ?? 'the adversary',
    voiced: narration.adversaryVoice !== undefined,
  };
  const refs = references.filter((r) => r !== slug);
  const vars = {
    slug,
    workspace: workspaceLine(workspace),
    width: storyboard.width ?? 1920,
    height: storyboard.height ?? 1080,
    fps: storyboard.fps ?? 30,
    trackLine: trackLine(manifest),
    timelineLine: timelineLine(slug, timelineMode, narration),
    lessonLine: lessonLine(manifest, lessonSource),
    references: refs.length ? refs.map((r) => `\`video/${r}/src/scenes/*.tsx\``).join(', ') : '(none yet — this is the first video on the engine)',
    exampleComponent: componentName(storyboard.scenes[0].id),
    keepClear: keepClearLines(segments),
    canon: canonBlock(identifierCandidates(storyboard, byScene)),
    scenes: scenesBlock(ctx, storyboard, byScene),
    catalog: catalogBlock(catalog),
  };
  const header = [
    `# Scene-builder brief — video \`${slug}\` («${storyboard.title ?? slug}»)`,
    '',
    `> Generated by \`node video/engine/scripts/scene-brief.mjs --video ${slug}\` from video.json, storyboard.json and`,
    `> narration.json, with the generic rules of \`${TEMPLATE_REL}\`. Fill the «Canon» TODO block before dispatching.`,
    '> Hand edits are safe: re-running refuses to overwrite this file without `--force`.',
    '',
  ].join('\n');
  return `${header}\n${fillTemplate(template, vars).trimEnd()}\n`;
}
