#!/usr/bin/env node
// Resolves the narration markup + lexicon into the exact text the voice will
// speak, so Python (tts.py) never re-implements the parser.
//
//   node video/engine/scripts/prepare-tts.mjs [--narration P] [--lexicon P] [--storyboard P] [--out P]
//     -> writes out/tts-input.json: [{ id, scene, voice, rate, pitch, spoken, key }]
//   node video/engine/scripts/prepare-tts.mjs --audition [--lexicon P]
//     -> prints { display, spoken, terms } for the voice audition paragraph
import path from 'node:path';
import { parseArgs } from 'node:util';
import { analyzeNarration, loadSources, parseJsonText, readSource, reportOrThrow, ttsKey } from './lib/narration.mjs';
import { MANIFEST, PATHS, isMainModule } from './lib/paths.mjs';
import { profileFor } from './lib/profiles.mjs';
import { writeFileAtomic } from './lib/remotion.mjs';
import { parseSegmentText } from './lib/text.mjs';

/** Test paragraph for --audition: numbers, times and every lexicon term. */
export const AUDITION_TEXT =
  'Prueba de voz para los vídeos de la Autoridad Portuaria de Halden. ' +
  'Llegan [6.000|seis mil] avisos al día y el [90 %|noventa por ciento] se cierra sin abrir. ' +
  'Entre las [02:00|dos] y las [04:30|cuatro y media] salieron [38 GB|treinta y ocho gigabytes]; ' +
  'la cuenta de servicio entró [a las 01:52|a la una y cincuenta y dos].';

export function auditionText(lexicon) {
  const present = new Set(parseSegmentText(AUDITION_TEXT, {}).plainTokens.map((t) => t.replace(/[^\p{L}\p{N}]+$/u, '')));
  const terms = Object.keys(lexicon).filter((k) => !present.has(k));
  const text = terms.length ? `${AUDITION_TEXT} Términos del glosario: ${terms.join(', ')}.` : AUDITION_TEXT;
  const parsed = parseSegmentText(text, lexicon);
  return { display: parsed.display, spoken: parsed.spoken, terms: Object.keys(lexicon).map((k) => [k, lexicon[k]]) };
}

export function prepareTts({ storyboard = PATHS.storyboard, narration = PATHS.narration, lexicon = PATHS.lexicon, log = console } = {}) {
  const sources = loadSources({ storyboard, narration, lexicon });
  const analysis = analyzeNarration(sources, profileFor(MANIFEST.profile));
  if (sources.lexiconMissing) analysis.warnings.push(`no lexicon at ${lexicon}`);
  reportOrThrow(analysis, log);
  const { voice, rate, pitch } = analysis.voice;
  return analysis.segments.map((seg) => ({
    id: seg.id,
    scene: seg.scene,
    voice,
    rate,
    pitch,
    spoken: seg.parsed.spoken,
    key: ttsKey(voice, rate, pitch, seg.parsed.spoken),
  }));
}

function main() {
  const { values } = parseArgs({
    options: {
      narration: { type: 'string' },
      lexicon: { type: 'string' },
      storyboard: { type: 'string' },
      out: { type: 'string' },
      audition: { type: 'boolean', default: false },
      video: { type: 'string' },
    },
  });
  const abs = (p, fallback) => (p ? path.resolve(p) : fallback);
  const lexiconPath = abs(values.lexicon, PATHS.lexicon);
  if (values.audition) {
    const raw = readSource(lexiconPath, 'lexicon.json', { optional: true });
    const lexicon = raw === null ? {} : parseJsonText(raw, lexiconPath);
    process.stdout.write(`${JSON.stringify(auditionText(lexicon))}\n`);
    return;
  }
  const out = abs(values.out, PATHS.ttsInput);
  const entries = prepareTts({
    storyboard: abs(values.storyboard, PATHS.storyboard),
    narration: abs(values.narration, PATHS.narration),
    lexicon: lexiconPath,
    log: { warn: (m) => console.error(m) },
  });
  writeFileAtomic(out, `${JSON.stringify(entries, null, 1)}\n`);
  console.error(`prepare-tts: ${entries.length} segments -> ${out}`);
}

if (isMainModule(import.meta.url)) {
  try {
    main();
  } catch (err) {
    console.error(`prepare-tts: ${err.message}`);
    process.exit(1);
  }
}
