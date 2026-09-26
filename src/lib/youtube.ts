import type { VideoFileBlock, YouTubeVideoBlock } from './types';

/** YouTube video ids are 11 characters of [A-Za-z0-9_-]. */
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

export function isYouTubeId(id: string): boolean {
  return YOUTUBE_ID.test(id);
}

/** Privacy-enhanced embed. It autoplays because it only mounts after the learner clicks play. */
export function youtubeEmbedUrl(id: string): string {
  if (!isYouTubeId(id)) throw new Error(`invalid YouTube id ${JSON.stringify(id)}`);
  const query = new URLSearchParams({ autoplay: '1', rel: '0', cc_load_policy: '1', cc_lang_pref: 'es', hl: 'es' });
  return `https://www.youtube-nocookie.com/embed/${id}?${query}`;
}

export function youtubeWatchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}

export function isYouTubeBlock(block: VideoFileBlock | YouTubeVideoBlock): block is YouTubeVideoBlock {
  return 'youtube' in block;
}
