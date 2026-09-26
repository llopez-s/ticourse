import { describe, expect, it } from 'vitest';
import { isYouTubeBlock, isYouTubeId, youtubeEmbedUrl, youtubeWatchUrl } from './youtube';

describe('youtube', () => {
  it('ids are 11 characters of [A-Za-z0-9_-]', () => {
    expect(isYouTubeId('jNQXAC9IVRw')).toBe(true);
    expect(isYouTubeId('jNQXAC9IVR')).toBe(false);
    expect(isYouTubeId('jNQXAC9IVRw&t=1')).toBe(false);
  });

  it('embeds through youtube-nocookie, autoplaying with Spanish captions', () => {
    const url = new URL(youtubeEmbedUrl('jNQXAC9IVRw'));
    expect(url.origin).toBe('https://www.youtube-nocookie.com');
    expect(url.pathname).toBe('/embed/jNQXAC9IVRw');
    expect(Object.fromEntries(url.searchParams)).toEqual({ autoplay: '1', rel: '0', cc_load_policy: '1', cc_lang_pref: 'es', hl: 'es' });
    expect(() => youtubeEmbedUrl('nope')).toThrow(/invalid YouTube id/);
  });

  it('links to the watch page and tells the two video blocks apart', () => {
    expect(youtubeWatchUrl('jNQXAC9IVRw')).toBe('https://www.youtube.com/watch?v=jNQXAC9IVRw');
    const file = { t: 'video' as const, title: 't', src: 's.mp4', poster: 'p.png', transcript: 't.txt', captions: 'c.vtt' };
    const yt = { t: 'video' as const, title: 't', youtube: 'jNQXAC9IVRw', poster: 'p.png', transcript: 't.txt' };
    expect(isYouTubeBlock(file)).toBe(false);
    expect(isYouTubeBlock(yt)).toBe(true);
  });
});
