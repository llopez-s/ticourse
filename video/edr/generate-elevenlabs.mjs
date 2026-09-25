import { createHash, randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, rename, unlink, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const currentDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(currentDir, '../..');
const outputDir = join(currentDir, 'elevenlabs-clips');
const masterDir = join(currentDir, 'elevenlabs-master');
const sampleDir = join(currentDir, 'elevenlabs-samples');
const selectedVoicePath = join(currentDir, 'elevenlabs-voice.json');
const script = JSON.parse(await readFile(join(currentDir, 'script.json'), 'utf8'));
const segments = script.segments;
const model = 'eleven_v3';

// A few restrained directions add intent without making an incident sound theatrical.
// These instructions are not part of the spoken script or transcript.
const directions = {
  '01-intro': '[warmly]',
  '05-detection': '[concerned]',
  '06-uncertainty': '[thoughtful]',
  '12-isolate': '[firmly]',
  '16-limit': '[thoughtful]',
};

if (!process.env.ELEVENLABS_API_KEY && existsSync(join(repoRoot, '.env.local'))) {
  process.loadEnvFile(join(repoRoot, '.env.local'));
}

const args = process.argv.slice(2);
const valueOf = (prefix) => args.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
const help = args.includes('--help');
const listVoices = args.includes('--voices');
const listAllVoices = args.includes('--voices-all');
const showUsage = args.includes('--usage');
const listLibrary = args.includes('--library');
const addSharedVoice = valueOf('--add=');
const designVoice = args.includes('--design');
const createDesignedVoice = valueOf('--create=');
const designModel = valueOf('--design-model=') || 'eleven_ttv_v3';
const overwrite = args.includes('--overwrite');
const sample = args.includes('--sample');
const segmentFilter = valueOf('--segment=');
const separateClips = args.includes('--segments');
const savedVoice = existsSync(selectedVoicePath) ? JSON.parse(await readFile(selectedVoicePath, 'utf8')) : null;
const voiceId = valueOf('--voice=') || process.env.ELEVENLABS_VOICE_ID || savedVoice?.voiceId;
const apiKey = process.env.ELEVENLABS_API_KEY;

if (help) {
  console.log(`ElevenLabs EDR narration (${model})

  node video/edr/generate-elevenlabs.mjs --voices
  node video/edr/generate-elevenlabs.mjs --voices-all
  node video/edr/generate-elevenlabs.mjs --usage
  node video/edr/generate-elevenlabs.mjs --library
  node video/edr/generate-elevenlabs.mjs --add=PUBLIC_OWNER_ID:VOICE_ID
  node video/edr/generate-elevenlabs.mjs --design
  node video/edr/generate-elevenlabs.mjs --create=1
  node video/edr/generate-elevenlabs.mjs --sample --voice=VOICE_ID
  node video/edr/generate-elevenlabs.mjs --voice=VOICE_ID
  node video/edr/generate-elevenlabs.mjs --segments --voice=VOICE_ID
  node video/edr/generate-elevenlabs.mjs --segment=06-uncertainty --voice=VOICE_ID

Set ELEVENLABS_API_KEY in the environment or the ignored .env.local file.
--sample creates one representative 03-06 passage so you can review delivery.
The default generates one continuous, expressive narration and splits it at
word-aligned scene boundaries. --segments is a fallback for individual clips.
Existing audio with matching voice, model, script and direction is reused.
Use --overwrite to regenerate them (this consumes credits again).`);
  process.exit(0);
}

if (!apiKey) {
  throw new Error('Set ELEVENLABS_API_KEY in the environment or in the ignored .env.local file. Do not commit the key.');
}

async function request(path, options = {}) {
  const response = await fetch(`https://api.elevenlabs.io${path}`, {
    ...options,
    headers: {
      'xi-api-key': apiKey,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
    signal: AbortSignal.timeout(300_000),
  });
  if (!response.ok) {
    let detail = `HTTP ${response.status}`;
    try {
      const body = await response.json();
      const message = typeof body.detail === 'string' ? body.detail : body.detail?.message;
      if (message) detail += `: ${message}`;
    } catch {
      // Keep errors brief and never log the request headers or API key.
    }
    throw new Error(`ElevenLabs ${detail}`);
  }
  return response.json();
}

if (listVoices || listAllVoices) {
  const params = new URLSearchParams({ page_size: '100' });
  if (!listAllVoices) {
    params.set('language', 'es');
    params.set('gender', 'female');
  }
  const result = await request(`/v2/voices?${params}`);
  if (!result.voices?.length) {
    console.log('No Spanish female voices found in this account. Choose one in ElevenLabs and copy its voice ID.');
  } else {
    for (const voice of result.voices) {
      const locales = (voice.verified_languages || [])
        .filter((item) => item.language === 'es')
        .map((item) => item.locale || item.accent || 'es');
      const accent = voice.labels?.accent || locales.join(', ') || 'accent unspecified';
      console.log(`${voice.voice_id}\t${voice.name}\t${voice.category}\t${voice.labels?.gender || ''}\t${accent}\t${voice.description || ''}`);
    }
  }
  process.exit(0);
}

if (showUsage) {
  const result = await request('/v1/user/subscription');
  console.log(`Tier: ${result.tier}; credits used: ${result.character_count}; limit: ${result.character_limit}; remaining: ${Math.max(0, result.character_limit - result.character_count)}`);
  process.exit(0);
}

if (listLibrary) {
  const params = new URLSearchParams({ language: 'es', locale: 'es-ES', gender: 'Female', page_size: '30', sort: 'usage_character_count_1y' });
  const result = await request(`/v1/shared-voices?${params}`);
  for (const voice of result.voices || []) {
    console.log(`${voice.public_owner_id}:${voice.voice_id}\t${voice.name}\t${voice.accent || ''}\t${voice.description || ''}`);
  }
  if (!result.voices?.length) console.log('No matching Castilian female voices found in the shared library.');
  process.exit(0);
}

if (addSharedVoice) {
  const [owner, sharedId] = addSharedVoice.split(':');
  if (!/^[A-Za-z0-9_-]+$/.test(owner || '') || !/^[A-Za-z0-9_-]+$/.test(sharedId || '')) {
    throw new Error('Use --add=PUBLIC_OWNER_ID:VOICE_ID from the --library listing.');
  }
  const result = await request(`/v1/voices/add/${owner}/${sharedId}`, {
    method: 'POST',
    body: JSON.stringify({ new_name: 'EDR Blue Team narrator' }),
  });
  console.log(`Voice added to the account: ${result.voice_id}. Use --voice=${result.voice_id}`);
  process.exit(0);
}

const voiceDescription = 'Native Castilian Spanish woman in her thirties, warm and professional educational narrator. Soft, clear timbre and natural peninsular Spanish pronunciation. Medium pitch, conversational rhythm and subtle expressive shifts: curious during investigation, careful with uncertainty, calm and firm during response. Clean studio sound, close and reassuring, without dramatic announcer emphasis.';
const designPrompt = segments.slice(2, 6).map(({ text }) => text).join(' ');
const designManifestPath = join(sampleDir, 'voice-design.json');

if (designVoice) {
  if (!['eleven_ttv_v3', 'eleven_multilingual_ttv_v2'].includes(designModel)) {
    throw new Error('Use --design-model=eleven_ttv_v3 or --design-model=eleven_multilingual_ttv_v2');
  }
  await mkdir(sampleDir, { recursive: true });
  const signature = createHash('sha256').update(JSON.stringify({ voiceDescription, designPrompt, designModel })).digest('hex');
  if (!overwrite && existsSync(designManifestPath)) {
    const previous = JSON.parse(await readFile(designManifestPath, 'utf8'));
    if (previous.signature === signature && previous.previews?.every((preview, index) => existsSync(join(sampleDir, `voice-design-${index + 1}.mp3`)))) {
      console.log(`Reusing ${previous.previews.length} voice previews in ${sampleDir}`);
      process.exit(0);
    }
  }
  console.log('Designing three Castilian Spanish voice previews...');
  const result = await request('/v1/text-to-voice/design', {
    method: 'POST',
    body: JSON.stringify({ model_id: designModel, voice_description: voiceDescription, text: designPrompt }),
  });
  if (!Array.isArray(result.previews) || result.previews.length === 0) {
    throw new Error('ElevenLabs returned no voice previews');
  }
  const previews = [];
  for (let index = 0; index < result.previews.length; index++) {
    const preview = result.previews[index];
    if (!preview.generated_voice_id || !preview.audio_base_64) throw new Error(`Voice preview ${index + 1} is incomplete`);
    await writeFile(join(sampleDir, `voice-design-${index + 1}.mp3`), Buffer.from(preview.audio_base_64, 'base64'));
    previews.push({ generatedVoiceId: preview.generated_voice_id, durationSeconds: preview.duration_secs });
  }
  await writeFile(designManifestPath, `${JSON.stringify({ signature, designModel, voiceDescription, designPrompt, previews }, null, 2)}\n`);
  console.log(`${previews.length} voice previews ready in ${sampleDir}. Choose one with --create=1, 2 or 3.`);
  process.exit(0);
}

if (createDesignedVoice) {
  const index = Number(createDesignedVoice) - 1;
  const manifest = JSON.parse(await readFile(designManifestPath, 'utf8'));
  const preview = manifest.previews?.[index];
  if (!Number.isInteger(index) || !preview) throw new Error('Choose an available preview number from voice-design.json');
  if (savedVoice?.generatedVoiceId === preview.generatedVoiceId) {
    console.log(`Designed voice already selected: ${savedVoice.voiceId}`);
    process.exit(0);
  }
  const result = await request('/v1/text-to-voice', {
    method: 'POST',
    body: JSON.stringify({
      voice_name: 'IntelForge · Narradora EDR',
      voice_description: manifest.voiceDescription,
      generated_voice_id: preview.generatedVoiceId,
    }),
  });
  if (!result.voice_id) throw new Error('ElevenLabs returned no voice ID after creation');
  await writeFile(selectedVoicePath, `${JSON.stringify({ voiceId: result.voice_id, generatedVoiceId: preview.generatedVoiceId, designModel: manifest.designModel }, null, 2)}\n`);
  console.log(`Designed voice saved: ${result.voice_id}`);
  process.exit(0);
}

if (!voiceId || !/^[A-Za-z0-9_-]+$/.test(voiceId)) {
  throw new Error('Pass --voice=VOICE_ID or set ELEVENLABS_VOICE_ID. Use --voices to inspect available Spanish female voices.');
}

if (sample) {
  await mkdir(sampleDir, { recursive: true });
  const passage = segments.slice(2, 6);
  const prompt = passage.map((segment) => `${directions[segment.id] ? `${directions[segment.id]} ` : ''}${segment.text}`).join('\n\n');
  const signature = createHash('sha256').update(JSON.stringify({ voiceId, model, prompt, stability: 0.5 })).digest('hex');
  const samplePath = join(sampleDir, `telemetry-alert-${voiceId}.mp3`);
  const metadataPath = join(sampleDir, `telemetry-alert-${voiceId}.metadata.json`);
  let reusable = false;
  if (!overwrite && existsSync(samplePath) && existsSync(metadataPath)) {
    const metadata = JSON.parse(await readFile(metadataPath, 'utf8'));
    reusable = metadata.signature === signature;
  }
  if (!reusable) {
    console.log('Generating a short voice sample...');
    const response = await request(`/v1/text-to-speech/${voiceId}/with-timestamps?output_format=mp3_44100_128`, {
      method: 'POST',
      body: JSON.stringify({ text: prompt, model_id: model, language_code: 'es', voice_settings: { stability: 0.5 } }),
    });
    if (typeof response.audio_base64 !== 'string' || !response.audio_base64.length) {
      throw new Error('ElevenLabs returned no audio for the sample');
    }
    await writeFile(samplePath, Buffer.from(response.audio_base64, 'base64'));
    await writeFile(metadataPath, `${JSON.stringify({ signature, voiceId, model, prompt }, null, 2)}\n`);
  }
  console.log(`Voice sample ready: ${samplePath}`);
  process.exit(0);
}

let selected = segments;
if (segmentFilter) {
  selected = segments.filter(({ id }) => id === segmentFilter);
  if (selected.length !== 1) throw new Error(`Unknown segment: ${segmentFilter}`);
}

function alignmentForScript(raw, spokenText) {
  if (!raw || !Array.isArray(raw.characters) || !Array.isArray(raw.character_start_times_seconds)
    || !Array.isArray(raw.character_end_times_seconds)) return null;
  const joined = raw.characters.join('');
  const offset = joined.indexOf(spokenText);
  if (offset < 0) return null;
  const end = offset + spokenText.length;
  if (raw.characters.length < end || raw.character_start_times_seconds.length < end
    || raw.character_end_times_seconds.length < end) return null;
  return {
    characters: raw.characters.slice(offset, end),
    character_start_times_seconds: raw.character_start_times_seconds.slice(offset, end),
    character_end_times_seconds: raw.character_end_times_seconds.slice(offset, end),
  };
}

async function mediaTools() {
  const packages = await readdir(join(repoRoot, 'node_modules/@remotion'));
  for (const name of packages.filter((item) => item.startsWith('compositor-'))) {
    const directory = join(repoRoot, 'node_modules/@remotion', name);
    const suffix = process.platform === 'win32' ? '.exe' : '';
    const ffmpeg = join(directory, `ffmpeg${suffix}`);
    const ffprobe = join(directory, `ffprobe${suffix}`);
    if (existsSync(ffmpeg) && existsSync(ffprobe)) return { ffmpeg, ffprobe };
  }
  throw new Error('Remotion ffmpeg/ffprobe were not found. Run npm install first.');
}

function run(command, parameters) {
  const result = spawnSync(command, parameters, { encoding: 'utf8', maxBuffer: 1024 * 1024 * 4 });
  if (result.status !== 0) throw new Error(`${command} failed: ${result.stderr || result.stdout}`);
  return result.stdout;
}

async function generateContinuous() {
  await mkdir(outputDir, { recursive: true });
  await mkdir(masterDir, { recursive: true });
  const prompt = segments.map((segment) => `${directions[segment.id] ? `${directions[segment.id]} ` : ''}${segment.text}`).join('\n\n');
  const signature = createHash('sha256').update(JSON.stringify({ voiceId, model, prompt, stability: 0.5 })).digest('hex');
  const masterPath = join(masterDir, 'full-narration.mp3');
  const masterAlignmentPath = join(masterDir, 'full-narration.alignment.json');
  const metadataPath = join(masterDir, 'full-narration.metadata.json');
  let reusable = false;
  if (!overwrite && existsSync(masterPath) && existsSync(masterAlignmentPath) && existsSync(metadataPath)) {
    const metadata = JSON.parse(await readFile(metadataPath, 'utf8'));
    reusable = metadata.signature === signature;
  }

  if (!reusable) {
    console.log('Generating one continuous Eleven v3 narration...');
    const response = await request(`/v1/text-to-speech/${voiceId}/with-timestamps?output_format=mp3_44100_128`, {
      method: 'POST',
      body: JSON.stringify({
        text: prompt,
        model_id: model,
        language_code: 'es',
        voice_settings: { stability: 0.5 },
      }),
    });
    if (typeof response.audio_base64 !== 'string' || !response.audio_base64.length) {
      throw new Error('ElevenLabs returned no audio for the narration');
    }
    const audio = Buffer.from(response.audio_base64, 'base64');
    if (audio.length < 10_000) throw new Error('The narration audio is unexpectedly short');
    if (!response.alignment?.characters?.length) {
      const unalignedPath = join(masterDir, `full-narration-${signature.slice(0, 12)}.unaligned.mp3`);
      await writeFile(unalignedPath, audio);
      throw new Error(`ElevenLabs returned no character timing. The full MP3 was saved at ${unalignedPath}; use --segments to generate separate clips.`);
    }
    const stagingId = randomUUID();
    const stagedMaster = join(masterDir, `full-narration.${stagingId}.mp3`);
    const stagedAlignment = join(masterDir, `full-narration.${stagingId}.alignment.json`);
    const stagedMetadata = join(masterDir, `full-narration.${stagingId}.metadata.json`);
    try {
      await Promise.all([
        writeFile(stagedMaster, audio),
        writeFile(stagedAlignment, `${JSON.stringify(response.alignment)}\n`),
        writeFile(stagedMetadata, `${JSON.stringify({ signature, voiceId, model, prompt }, null, 2)}\n`),
      ]);
      // Metadata is the cache's commit marker. Invalidate it before replacing
      // either payload so an interrupted write cannot mix old and new data.
      if (existsSync(metadataPath)) await unlink(metadataPath);
      await rename(stagedMaster, masterPath);
      await rename(stagedAlignment, masterAlignmentPath);
      await rename(stagedMetadata, metadataPath);
    } finally {
      await Promise.all([stagedMaster, stagedAlignment, stagedMetadata].map(async (path) => {
        if (existsSync(path)) await unlink(path);
      }));
    }
  } else {
    console.log('Reusing the continuous narration and its character timing.');
  }

  const raw = JSON.parse(await readFile(masterAlignmentPath, 'utf8'));
  const source = raw.characters?.join('');
  if (!source || raw.character_start_times_seconds?.length !== raw.characters.length
    || raw.character_end_times_seconds?.length !== raw.characters.length) {
    throw new Error('The ElevenLabs character timing is incomplete');
  }
  const ranges = [];
  let cursor = 0;
  for (const segment of segments) {
    const start = source.indexOf(segment.text, cursor);
    if (start < 0) throw new Error(`Cannot locate ${segment.id} in ElevenLabs character timing`);
    const end = start + segment.text.length;
    ranges.push({ start, end });
    cursor = end;
  }

  const { ffmpeg, ffprobe } = await mediaTools();
  const info = JSON.parse(run(ffprobe, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'json', masterPath]));
  const duration = Number(info.format?.duration);
  if (!Number.isFinite(duration) || duration <= 0) throw new Error('Cannot measure the narration duration');
  const boundaries = [0];
  for (let index = 1; index < ranges.length; index++) {
    const previousEnd = raw.character_end_times_seconds[ranges[index - 1].end - 1];
    const nextStart = raw.character_start_times_seconds[ranges[index].start];
    const boundary = (previousEnd + nextStart) / 2;
    if (!Number.isFinite(boundary) || boundary <= boundaries[index - 1] || boundary >= duration) {
      throw new Error(`Invalid scene boundary before ${segments[index].id}`);
    }
    boundaries.push(boundary);
  }
  boundaries.push(duration);

  for (let index = 0; index < segments.length; index++) {
    const segment = segments[index];
    const start = boundaries[index];
    const length = boundaries[index + 1] - start;
    if (length < 0.5) throw new Error(`Clip ${segment.id} would be too short`);
    const wavPath = join(outputDir, `${segment.id}.wav`);
    run(ffmpeg, [
      '-hide_banner', '-loglevel', 'error', '-y', '-i', masterPath,
      '-ss', start.toFixed(6), '-t', length.toFixed(6),
      '-ac', '1', '-ar', '44100', '-c:a', 'pcm_s16le', wavPath,
    ]);
    const range = ranges[index];
    const alignment = {
      characters: raw.characters.slice(range.start, range.end),
      character_start_times_seconds: raw.character_start_times_seconds.slice(range.start, range.end).map((time) => Math.max(0, time - start)),
      character_end_times_seconds: raw.character_end_times_seconds.slice(range.start, range.end).map((time) => Math.max(0, time - start)),
    };
    await writeFile(join(outputDir, `${segment.id}.alignment.json`), `${JSON.stringify({ alignment })}\n`);
  }
  console.log(`One natural narration: ${duration.toFixed(2)} seconds, split into ${segments.length} timed clips.`);
  console.log('Next: npm run video:audio:import -- --pause=0 && npm run video:render');
}

if (!segmentFilter && !separateClips) {
  await generateContinuous();
  process.exit(0);
}

const targetDir = join(currentDir, 'elevenlabs-segmented');
await mkdir(targetDir, { recursive: true });
let generated = 0;
for (const segment of selected) {
  const index = segments.findIndex(({ id }) => id === segment.id);
  const prompt = `${directions[segment.id] ? `${directions[segment.id]} ` : ''}${segment.text}`;
  const body = {
    text: prompt,
    model_id: model,
    language_code: 'es',
    voice_settings: { stability: 0.5 },
    ...(index > 0 ? { previous_text: segments[index - 1].text } : {}),
    ...(index < segments.length - 1 ? { next_text: segments[index + 1].text } : {}),
  };
  const signature = createHash('sha256').update(JSON.stringify({ voiceId, body })).digest('hex');
  const mp3Path = join(targetDir, `${segment.id}.mp3`);
  const alignmentPath = join(targetDir, `${segment.id}.alignment.json`);
  const metadataPath = join(targetDir, `${segment.id}.metadata.json`);

  if (!overwrite && existsSync(mp3Path) && existsSync(metadataPath)) {
    const metadata = JSON.parse(await readFile(metadataPath, 'utf8'));
    if (metadata.signature === signature) {
      console.log(`${segment.id}: reused existing clip`);
      continue;
    }
  }

  console.log(`${segment.id}: generating...`);
  const response = await request(`/v1/text-to-speech/${voiceId}/with-timestamps?output_format=mp3_44100_128`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  if (typeof response.audio_base64 !== 'string' || !response.audio_base64.length) {
    throw new Error(`${segment.id}: ElevenLabs returned no audio`);
  }
  const audio = Buffer.from(response.audio_base64, 'base64');
  if (audio.length < 1024) throw new Error(`${segment.id}: audio is unexpectedly short`);
  const alignment = alignmentForScript(response.alignment, segment.text);
  // Write metadata last: an interrupted request will never be treated as complete.
  await writeFile(mp3Path, audio);
  if (alignment) await writeFile(alignmentPath, `${JSON.stringify({ alignment }, null, 2)}\n`);
  else if (existsSync(alignmentPath)) {
    // A changed prompt cannot inherit timing from a previous generation.
    await unlink(alignmentPath);
    console.warn(`${segment.id}: no exact alignment; import will use proportional captions`);
  } else console.warn(`${segment.id}: no exact alignment; import will use proportional captions`);
  await writeFile(metadataPath, `${JSON.stringify({ signature, voiceId, model, prompt }, null, 2)}\n`);
  generated++;
}

console.log(`${selected.length} clips ready in ${targetDir}; ${generated} generated with ElevenLabs.`);
if (selected.length === segments.length) {
  console.log('Next: npm run video:audio:import -- --input=video/edr/elevenlabs-segmented && npm run video:render');
}
