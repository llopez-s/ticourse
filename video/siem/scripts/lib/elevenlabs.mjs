// Thin ElevenLabs REST client (Node fetch, no SDK). The API key comes from
// ELEVENLABS_API_KEY (see env.mjs) and is only ever sent in the xi-api-key header.
import { requireEnv } from './env.mjs';

const API = 'https://api.elevenlabs.io';

export class ElevenLabsError extends Error {
  constructor(message, status, body) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

async function call(pathname, { method = 'GET', body, query } = {}) {
  const url = new URL(pathname, API);
  for (const [k, v] of Object.entries(query ?? {})) if (v !== undefined) url.searchParams.set(k, String(v));
  const res = await fetch(url, {
    method,
    headers: {
      'xi-api-key': requireEnv('ELEVENLABS_API_KEY'),
      ...(body ? { 'content-type': 'application/json' } : {}),
      accept: 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  if (!res.ok) {
    const detail = json?.detail?.message ?? json?.detail?.status ?? json?.detail ?? text.slice(0, 300);
    throw new ElevenLabsError(`ElevenLabs ${method} ${url.pathname} -> HTTP ${res.status}: ${typeof detail === 'string' ? detail : JSON.stringify(detail)}`, res.status, json ?? text);
  }
  return { json, requestId: res.headers.get('request-id') ?? res.headers.get('x-request-id') ?? null };
}

/** Subscription summary (needs the user_read permission; returns null when the key lacks it). */
export async function getSubscription() {
  try {
    const { json } = await call('/v1/user/subscription');
    return json;
  } catch (error) {
    if (error instanceof ElevenLabsError && (error.status === 401 || error.status === 403)) return null;
    throw error;
  }
}

/** Voices in the account's library. */
export async function listVoices() {
  const { json } = await call('/v2/voices', { query: { page_size: 100 } });
  return json.voices ?? [];
}

/** Public Voice Library search (e.g. { language: 'es', accent: 'peninsular', use_cases: 'narrative_story' }). */
export async function searchSharedVoices(query) {
  const { json } = await call('/v1/shared-voices', { query: { page_size: 50, ...query } });
  return json.voices ?? [];
}

/** Adds a Voice Library voice to the account so it can be used for TTS. */
export async function addSharedVoice(publicOwnerId, voiceId, name) {
  const { json } = await call(`/v1/voices/add/${publicOwnerId}/${voiceId}`, { method: 'POST', body: { new_name: name } });
  return json;
}

/**
 * Text to speech with character-level timestamps.
 * Returns { audio: Buffer, alignment, normalizedAlignment, requestId }.
 */
export async function ttsWithTimestamps({ voiceId, text, modelId, voiceSettings, outputFormat = 'mp3_44100_128', languageCode, seed, previousText, nextText }) {
  const { json, requestId } = await call(`/v1/text-to-speech/${voiceId}/with-timestamps`, {
    method: 'POST',
    query: { output_format: outputFormat },
    body: {
      text,
      model_id: modelId,
      voice_settings: voiceSettings,
      language_code: languageCode,
      seed,
      previous_text: previousText,
      next_text: nextText,
    },
  });
  if (!json?.audio_base64) throw new ElevenLabsError('ElevenLabs returned no audio', 200, json);
  return {
    audio: Buffer.from(json.audio_base64, 'base64'),
    alignment: json.alignment ?? null,
    normalizedAlignment: json.normalized_alignment ?? null,
    requestId,
  };
}
