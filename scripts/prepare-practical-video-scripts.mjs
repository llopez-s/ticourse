// Authoring only: generates scripts, briefs and engine source files. Never creates audio or video.
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { EPISODES_01_03 } from '../docs/superpowers/plans/2026-10-19-videos-ampliaciones/episodios-01-03.mjs';
import { EPISODES_04_05 } from '../docs/superpowers/plans/2026-10-19-videos-ampliaciones/episodios-04-05.mjs';
import { EPISODES_06_07 } from '../docs/superpowers/plans/2026-10-19-videos-ampliaciones/episodios-06-07.mjs';
import { analyzeNarration } from '../video/engine/scripts/lib/narration.mjs';
import { parseSegmentText } from '../video/engine/scripts/lib/text.mjs';
import { recordingSheet, voiceStudioSheet, studioText, STUDIO_PAUSE_MS } from '../video/engine/scripts/lib/script-sheets.mjs';
import { trackNotice } from '../video/engine/scripts/lib/profiles.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOC = path.join(ROOT, 'docs/superpowers/plans/2026-10-19-videos-ampliaciones');
const EPISODES = [...EPISODES_01_03, ...EPISODES_04_05, ...EPISODES_06_07];
const checking = process.argv.includes('--check');
const frozen = process.argv.find((arg) => arg.startsWith('--freeze='))?.slice(9);
const moods = ['curious', 'warm', 'focused', 'calm', 'confident', 'thoughtful', 'engaging', 'firm', 'reassuring'];
const lexiconPool = { YARA: 'yara', PDB: 'pe de be', ID: 'ai di', OpenID: 'óupen ai di', OAuth: 'ó-auth', VirusTotal: 'virus total' };
const words = (s) => s.trim().split(/\s+/u).filter(Boolean).length;
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const mmss = (sec) => `${Math.floor(sec / 60)}:${String(Math.round(sec % 60)).padStart(2, '0')}`;
const rel = (from, file) => path.relative(from, file).split(path.sep).join('/');
let changed = 0;
const errors = [];
const summaries = [];
function put(file, text) {
  if (existsSync(file) && readFileSync(file, 'utf8') === text) return;
  if (checking) { errors.push(`stale: ${rel(ROOT, file)}`); return; }
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, text, 'utf8');
  changed++;
}

// Preserve complete sentences; short segments are joined where the 30-word style ceiling permits.
function chunks(paragraph) {
  const sentences = paragraph.match(/[^.!?…]+[.!?…]+(?:[»”"']+)?|[^.!?…]+$/gu)?.map((s) => s.trim()).filter(Boolean) ?? [];
  const out = [];
  for (const sentence of sentences) {
    if (out.length && words(out.at(-1)) + words(sentence) <= 26) out[out.length - 1] += ` ${sentence}`;
    else out.push(sentence);
  }
  if (out.length > 1 && words(out.at(-1)) < 8 && words(out.at(-2)) + words(out.at(-1)) <= 30) {
    out[out.length - 2] += ` ${out.pop()}`;
  }
  return out;
}

if (frozen && !/^\d{4}-\d{2}-\d{2}$/.test(frozen)) throw new Error('Invalid --freeze=YYYY-MM-DD');
for (const episode of EPISODES) {
  const dir = path.join(ROOT, 'video', episode.slug);
  const docDir = path.join(DOC, `${episode.id}-${episode.slug}`);
  const priorManifest = path.join(dir, 'video.json');
  const priorFrozen = existsSync(priorManifest) ? JSON.parse(readFileSync(priorManifest, 'utf8')).frozen : undefined;
  const manifest = {
    slug: episode.slug, output: episode.slug,
    composition: `Practica${episode.id}`, poster: `Practica${episode.id}Poster`,
    profile: 'principal-yt', track: episode.track, adversary: episode.adversary,
    lesson: episode.lessons[0],
    tags: ['práctica complementaria', ...episode.concepts.map((s) => s.replaceAll(',', '').slice(0, 60))],
    ...(frozen || priorFrozen ? { frozen: frozen || priorFrozen } : {}),
  };
  const narration = {
    voice: 'recording/lidia', rate: '+0%', pitch: '+0Hz',
    recording: { tempo: 1.08, maxPauseMs: 250 },
    adversaryVoice: { voice: 'sapi/Microsoft Pablo', rate: 0, fx: 'machine' },
    segments: [],
  };
  const storyboard = {
    title: episode.title, fps: 30, width: 1920, height: 1080,
    editorialScope: 'complementary',
    notice: `${trackNotice(episode.track, 'principal-yt')} · Práctica complementaria`,
    chapters: episode.chapters.map((title, i) => ({ n: i + 1, title })), scenes: [],
  };
  let moodIndex = 0;
  let totalWords = 0;
  for (const [i, scene] of episode.scenes.entries()) {
    const prefix = `s${String(i + 1).padStart(2, '0')}`;
    const id = `${prefix}-${i === 0 ? 'hook' : i === 9 ? 'cierre' : 'caso'}`;
    const requiredCues = scene.text.map((_, j) => i === 0 && j === 0 ? 'title' : `${prefix}-${'abc'[j]}`);
    let segmentIndex = 1;
    const sceneSegments = [];
    for (const [p, paragraph] of scene.text.entries()) {
      const pieces = chunks(paragraph);
      for (const [k, piece] of pieces.entries()) {
        const text = `<${moods[moodIndex++ % moods.length]}> ${k === 0 ? `{${requiredCues[p]}}` : ''}${piece}`;
        const last = p === scene.text.length - 1 && k === pieces.length - 1;
        const segment = {
          id: `${prefix}-${String(segmentIndex++).padStart(2, '0')}`, scene: id, text,
          pauseAfterMs: last ? 600 : 300,
        };
        if (p === 0 && k === 0 && scene.intercept) segment.intercept = { text: scene.intercept, holdMs: 3500 };
        if (p === 0 && k === pieces.length - 1 && scene.think) segment.think = { q: scene.think.q, holdMs: 4500 };
        sceneSegments.push(segment);
      }
    }
    const n = scene.text.reduce((sum, part) => sum + words(part), 0);
    const duration = Math.ceil(n / 2.5 + sceneSegments.reduce((sum, s) => sum + s.pauseAfterMs / 1000, 0)
      + (scene.intercept ? 3.5 : 0) + (scene.think ? 4.5 : 0) + (scene.card ? 5 : 0) + 1.1);
    totalWords += n;
    storyboard.scenes.push({
      id, chapter: Math.floor(i / 2) + 1, title: scene.title, goal: scene.visual,
      targetSec: duration, wordBudget: Math.ceil(duration * 2.7), requiredCues,
      ...(scene.card ? { learningCard: { label: 'PRÁCTICA COMPLEMENTARIA', text: scene.card, afterSegment: sceneSegments.at(-1).id, holdSec: 5 } } : {}),
      ...(scene.think ? { decision: { ...scene.think, revealAt: `${prefix}-b`, holdMs: 4500 } } : {}),
    });
    narration.segments.push(...sceneSegments);
  }
  storyboard.targetTotalSec = storyboard.scenes.reduce((sum, s) => sum + s.targetSec, 0);
  const plainTokens = narration.segments.flatMap((s) => parseSegmentText(s.text, {}).plainTokens).join(' ');
  const lexicon = Object.fromEntries(Object.entries(lexiconPool).filter(([key]) => new RegExp(`\\b${key}\\b`).test(plainTokens)));
  const analysis = analyzeNarration({ storyboard, narration, lexicon }, {
    chispa: true, track: episode.track, examCards: [0, 0], thinkPrompts: 2, intercepts: [2, 4], examQuestions: [0, 0],
  });
  errors.push(...analysis.errors.map((e) => `${episode.id}: ${e}`));
  if (episode.scenes.length !== 10 || episode.chapters.length !== 5 || episode.concepts.length < 4 || episode.concepts.length > 6) errors.push(`${episode.id}: invalid editorial structure`);
  if (storyboard.scenes.filter((s) => s.learningCard).length !== 5) errors.push(`${episode.id}: must have 5 complementary cards`);
  if (narration.segments.some((s) => s.exam || s.question)) errors.push(`${episode.id}: complementary material must not receive exam badges`);
  if (narration.segments.some((s) => /entrevista|candidatura|sentinelone/iu.test(s.text))) errors.push(`${episode.id}: unrelated personal context`);
  put(path.join(dir, 'video.json'), json(manifest));
  put(path.join(dir, 'narration.json'), json(narration));
  put(path.join(dir, 'storyboard.json'), json(storyboard));
  put(path.join(dir, 'lexicon.json'), json(lexicon));
  const recording = recordingSheet({ storyboard, narration, manifest })
    .replaceAll('Deja un segundo de silencio.', 'Deja cuatro segundos y medio de silencio; no leas las opciones.');
  put(path.join(docDir, 'guion-grabacion.md'), recording);
  let studio = voiceStudioSheet({ storyboard, narration, manifest });
  for (const segment of narration.segments.filter((s) => s.think)) {
    const anchor = `${studioText(segment.text)} [pause ${STUDIO_PAUSE_MS}ms]`;
    if (studio.split(anchor).length !== 2) errors.push(`${episode.id}: ambiguous Voice Studio pause after ${segment.id}`);
    else studio = studio.replace(anchor, `${studioText(segment.text)} [pause ${segment.think.holdMs}ms]`);
  }
  put(path.join(docDir, 'guion-voice-studio.md'), studio);
  const estimated = storyboard.targetTotalSec;
  const table = storyboard.scenes.map((s, i) => `| ${s.id} | ${s.chapter} | ${s.targetSec} s | ${s.title} | ${s.learningCard?.text ?? '—'} |`).join('\n');
  const scenes = storyboard.scenes.map((s, i) => `### ${s.id} · ${s.title}\n\n${s.goal}\n\n${s.decision ? `**Decisión:** ${s.decision.q} Opciones: ${s.decision.choices.join(' / ')}. Tras 4,5 s: ${s.decision.choices[s.decision.answer]}. La voz resuelve y explica las alternativas después de la pausa.\n\n` : ''}${s.learningCard ? `**Tarjeta complementaria:** «${s.learningCard.text}». Entra al terminar la explicación del último párrafo, sin solaparse con lectura de evidencia. Sin insignia de examen.\n` : ''}`).join('\n');
  const brief = `# ${episode.id} · ${episode.title}\n\n` +
    `**Lecciones:** ${episode.lessons.join(', ')} · **Track:** ${episode.track} · **Formato:** principal narrativo con práctica complementaria.\n\n` +
    `**Promesa:** ${episode.promise}\n\n` +
    `**Estado:** ${manifest.frozen ? `guion revisado y congelado el ${manifest.frozen}` : 'guion completo en revisión editorial'}. Escenas audiovisuales y grabación pendientes de producción.\n\n` +
    `**Público:** estudiante que empieza esta ampliación. Cada episodio presenta su escenario y se entiende por separado.\n\n` +
    `**Duración orientativa de montaje:** ${mmss(estimated)} (${totalWords} palabras de narradora). Se estima a 2,5 palabras/s con pausas, intercepciones y cinco segundos de lectura por tarjeta. La estimación estándar del motor incluye la voz y las pausas; los 25 segundos de tarjetas complementarias se reservan aquí y se implementan al montar las escenas. La toma real fija la duración. Presupuesto de escena a 2,7 palabras/s, como la serie.\n\n` +
    `**Conceptos:**\n\n${episode.concepts.map((s) => `- ${s}`).join('\n')}\n\n` +
    `**Imagen conductora:** ${episode.analogy}\n\n` +
    `**Interpretación:** recording/lidia, conversación directa en segunda persona. Pausas normales 300 ms y de cierre 600 ms. Dos decisiones de 4,5 s. Los mensajes de ${episode.adversary} no se leen con la voz de la narradora. No hace falta una voz nueva.\n\n` +
    `**Continuidad:** ejercicio didáctico sin fecha de incidente. Mantener los nombres de las campañas, sin insertar víctimas, equipos, cuentas, indicadores o resultados nuevos en sus casos publicados. Los mensajes del adversario proponen errores de método; no confiesan incidentes.\n\n` +
    `**Tratamiento del contenido:** rótulo permanente «Práctica complementaria · datos ficticios». Los fundamentos se explican desde cero; los detalles profesionales no se presentan como objetivos oficiales. Cinco tarjetas de aprendizaje propias y cero tarjetas/preguntas de examen. No usar el panel EXAMEN del motor para estas tarjetas.\n\n` +
    `## Escaleta\n\n| Escena | Cap. | Objetivo temporal | Título | Tarjeta |\n|---|---|---|---|---|\n${table}\n\n` +
    `## Indicaciones visuales\n\n${scenes}\n` +
    `## Alcance y fuentes\n\n**Se queda en el texto del curso:** ${episode.omitted}\n\n` +
    `${episode.sources.map((s) => `- ${s}`).join('\n')}\n\n` +
    `Las URLs y la matriz de cobertura están en el índice de la tanda. Mantener la fecha y las limitaciones al convertir capturas en material audiovisual.\n\n` +
    `**Fuentes de producción:** [storyboard](${rel(docDir, path.join(dir, 'storyboard.json'))}), [narración segmentada](${rel(docDir, path.join(dir, 'narration.json'))}) y [léxico](${rel(docDir, path.join(dir, 'lexicon.json'))}).\n`;
  put(path.join(docDir, 'ficha-produccion.md'), brief);
  summaries.push({ id: episode.id, slug: episode.slug, title: episode.title, lessons: episode.lessons, words: totalWords,
    targetSec: estimated, segments: narration.segments.length, warnings: analysis.warnings, errors: analysis.errors });
}
const report = { episodes: summaries.length, words: summaries.reduce((s, e) => s + e.words, 0),
  errors: errors.filter((e) => !e.startsWith('stale:')), warnings: summaries.flatMap((s) => s.warnings.map((w) => `${s.id}: ${w}`)), summaries };
put(path.join(DOC, 'validacion-estructural.json'), json(report));
for (const summary of summaries) console.log(`${summary.id}: ${summary.words} palabras · ${summary.segments} segmentos · ${mmss(summary.targetSec)} · ${summary.warnings.length} avisos`);
for (const warning of report.warnings) console.warn(warning);
if (errors.length) { for (const error of errors) console.error(error); process.exitCode = 1; }
else console.log(`OK: ${EPISODES.length} guiones, ${report.words} palabras; ${checking ? 'archivos al día' : `${changed} archivos escritos`}`);
