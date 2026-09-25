import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const fps = 30;
export const currentDir = dirname(fileURLToPath(import.meta.url));
export const repoRoot = resolve(currentDir, '../..');
export const scriptPath = join(currentDir, 'script.json');
const timelinePath = join(currentDir, 'timeline.json');
const transcriptPath = join(repoRoot, 'public/videos/edr-blue-team-transcript.txt');
const captionsPath = join(repoRoot, 'public/videos/edr-blue-team-captions.vtt');

export async function loadScript() {
  const { segments } = JSON.parse(await readFile(scriptPath, 'utf8'));
  if (!Array.isArray(segments) || segments.length === 0) throw new Error('script.json has no segments');
  const allowedScenes = new Set(['intro', 'telemetry', 'alert', 'triage', 'scope', 'contain', 'close']);
  const seenIds = new Set();
  for (const segment of segments) {
    if (!/^[a-z0-9-]+$/.test(segment.id) || seenIds.has(segment.id)) {
      throw new Error(`Invalid or repeated segment ID: ${segment.id}`);
    }
    if (!allowedScenes.has(segment.scene) || !segment.text?.trim()) {
      throw new Error(`Invalid scene or empty text for ${segment.id}`);
    }
    seenIds.add(segment.id);
  }
  return segments;
}

export function waveDurationSeconds(buffer) {
  if (buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WAVE') {
    throw new Error('Audio is not a RIFF/WAVE file');
  }

  let byteRate = 0;
  let dataBytes = 0;
  for (let offset = 12; offset + 8 <= buffer.length;) {
    const chunk = buffer.toString('ascii', offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    if (chunk === 'fmt ') byteRate = buffer.readUInt32LE(offset + 8 + 8);
    if (chunk === 'data') dataBytes += size;
    offset += 8 + size + (size % 2);
  }

  if (!byteRate || !dataBytes) throw new Error('WAV is missing format or audio samples');
  return dataBytes / byteRate;
}

function vttTime(frame) {
  const totalMs = Math.round((frame / fps) * 1000);
  const hours = Math.floor(totalMs / 3600000);
  const minutes = Math.floor((totalMs % 3600000) / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);
  const milliseconds = totalMs % 1000;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
}

const captionSplitOverrides = {
  '01-intro': 'alerta',
  '06-uncertainty': 'sospechoso;',
  '09-evidence': 'ejecución.',
  '11-scope': 'estaciones.',
  '12-isolate': 'procedimiento,',
  '16-limit': 'operativos.',
};

function splitCaption(segment) {
  const { text } = segment;
  const splitAfter = captionSplitOverrides[segment.id];
  if (splitAfter) {
    const boundary = text.indexOf(splitAfter);
    if (boundary < 0) throw new Error(`Caption split for ${segment.id} no longer matches the script`);
    const end = boundary + splitAfter.length;
    return [text.slice(0, end), text.slice(end).trimStart()];
  }
  const words = text.trim().split(/\s+/);
  if (text.length <= 70) return [text];
  const avoidEnd = new Set(['a', 'con', 'de', 'del', 'el', 'en', 'la', 'las', 'los', 'no', 'para', 'por', 'que', 'un', 'una', 'y']);
  const avoidStart = new Set(['a', 'con', 'de', 'del', 'el', 'en', 'la', 'las', 'los', 'para', 'por', 'que', 'un', 'una']);
  let bestIndex = 1;
  let bestScore = Number.POSITIVE_INFINITY;
  for (let index = 1; index < words.length; index++) {
    const left = words.slice(0, index).join(' ');
    const right = words.slice(index).join(' ');
    const finalWord = words[index - 1].toLocaleLowerCase('es').replace(/[^\p{L}]/gu, '');
    const initialWord = words[index].toLocaleLowerCase('es').replace(/[^\p{L}]/gu, '');
    const punctuationBonus = /[.!?]$/.test(words[index - 1]) ? 20 : /[,;:]$/.test(words[index - 1]) ? 12 : 0;
    const score = Math.abs(left.length - right.length)
      + Math.max(0, left.length - 70) * 3
      + Math.max(0, right.length - 70) * 3
      + (avoidEnd.has(finalWord) ? 35 : 0)
      + (avoidStart.has(initialWord) ? 35 : 0)
      - punctuationBonus;
    if (score < bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  }
  return [words.slice(0, bestIndex).join(' '), words.slice(bestIndex).join(' ')];
}

function noWhitespace(value) {
  return value.normalize('NFC').replace(/\s+/gu, '');
}

function alignmentTimes(segment, chunks, alignment) {
  if (!alignment) return null;
  const data = alignment.alignment ?? alignment;
  const characters = data.characters;
  const starts = data.character_start_times_seconds;
  const ends = data.character_end_times_seconds;
  if (!Array.isArray(characters) || !Array.isArray(starts) || !Array.isArray(ends)
      || characters.length !== starts.length || starts.length !== ends.length) {
    throw new Error(`Invalid character alignment for ${segment.id}`);
  }
  if (noWhitespace(characters.join('')) !== noWhitespace(segment.text)) {
    throw new Error(`Alignment text differs from script.json for ${segment.id}`);
  }
  for (let index = 0; index < starts.length; index++) {
    if (!Number.isFinite(starts[index]) || !Number.isFinite(ends[index])
        || starts[index] < 0 || ends[index] < starts[index]
        || (index > 0 && starts[index] < starts[index - 1])) {
      throw new Error(`Invalid alignment times for ${segment.id}`);
    }
  }

  // Character positions are mapped by non-space count, since TTS may normalize whitespace.
  const spokenIndices = characters.flatMap((character, index) => /\s/u.test(character) ? [] : [index]);
  const chunkLengths = chunks.map((chunk) => noWhitespace(chunk).length);
  const cues = [];
  let offset = 0;
  for (let index = 0; index < chunks.length; index++) {
    const first = spokenIndices[offset];
    const last = spokenIndices[offset + chunkLengths[index] - 1];
    const next = spokenIndices[offset + chunkLengths[index]];
    if (first === undefined || last === undefined) throw new Error(`Incomplete alignment for ${segment.id}`);
    const start = segment.startFrame + Math.round(starts[first] * fps);
    const end = segment.startFrame + Math.round((next === undefined ? ends[last] : starts[next]) * fps);
    const audioEnd = segment.startFrame + segment.audioFrames;
    if (start < segment.startFrame || end > audioEnd + 1 || end <= start) {
      throw new Error(`Alignment exceeds audio duration for ${segment.id}`);
    }
    cues.push({ start, end: Math.min(end, audioEnd) });
    offset += chunkLengths[index];
  }
  return cues;
}

export function makeCaptions(segments, alignments) {
  const cues = ['WEBVTT', ''];
  for (const segment of segments) {
    const chunks = splitCaption(segment);
    const aligned = alignmentTimes(segment, chunks, alignments?.get(segment.id));
    const wordCounts = chunks.map((chunk) => chunk.split(/\s+/).length);
    const totalWords = wordCounts.reduce((sum, count) => sum + count, 0);
    let wordsSoFar = 0;
    let cueStart = segment.startFrame;
    for (let index = 0; index < chunks.length; index++) {
      wordsSoFar += wordCounts[index];
      const proportionalEnd = index === chunks.length - 1
        ? segment.startFrame + segment.audioFrames
        : segment.startFrame + Math.round((segment.audioFrames * wordsSoFar) / totalWords);
      const start = aligned?.[index].start ?? cueStart;
      const end = aligned?.[index].end ?? proportionalEnd;
      cues.push(`${segment.id}-${index + 1}`);
      cues.push(`${vttTime(start)} --> ${vttTime(end)}`);
      cues.push(chunks[index]);
      cues.push('');
      cueStart = end;
    }
  }
  return `${cues.join('\n')}\n`;
}

export async function writeDerivedAssets({ audioDir, publicAudioPrefix, alignments, sourceLabel, pauseSeconds = 0.4 }) {
  if (!Number.isFinite(pauseSeconds) || pauseSeconds < 0 || pauseSeconds > 2) {
    throw new Error(`Invalid pause duration: ${pauseSeconds}`);
  }
  const segmentPauseFrames = Math.round(pauseSeconds * fps);
  const segments = await loadScript();
  const timedSegments = [];
  let startFrame = 0;
  for (const segment of segments) {
    const seconds = waveDurationSeconds(await readFile(join(audioDir, `${segment.id}.wav`)));
    if (!Number.isFinite(seconds) || seconds < 0.25 || seconds > 30) {
      throw new Error(`Unexpected audio duration for ${segment.id}: ${seconds} seconds`);
    }
    const audioFrames = Math.ceil(seconds * fps);
    const durationFrames = audioFrames + segmentPauseFrames;
    timedSegments.push({ ...segment, audio: `${publicAudioPrefix}/${segment.id}.wav`, startFrame, durationFrames, audioFrames });
    startFrame += durationFrames;
  }

  const timeline = `${JSON.stringify({ fps, segments: timedSegments, durationFrames: startFrame }, null, 2)}\n`;
  const transcript = `${segments.map(({ text }) => text).join('\n\n')}\n`;
  const captions = makeCaptions(timedSegments, alignments);
  await Promise.all([
    writeFile(timelinePath, timeline, 'utf8'),
    writeFile(transcriptPath, transcript, 'utf8'),
    writeFile(captionsPath, captions, 'utf8'),
  ]);
  console.log(`${sourceLabel}: ${segments.length} segments, ${(startFrame / fps).toFixed(2)} seconds, ${startFrame} frames.`);
  if (startFrame / fps < 95 || startFrame / fps > 125) {
    console.warn('Narration differs substantially from the planned ~110 seconds; review pacing before rendering.');
  }
}
