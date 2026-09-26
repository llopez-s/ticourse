// Guards I1 (final review, 2026-09-26): the app's brand on a video's poster/end card comes from
// its own src/Poster.tsx and end-card scene, never from video.json's "profile" — profileFor only
// changes the transcript/description notice (trackNotice, see profiles.test.mjs). A new -yt video
// must therefore write "ALERTÓPOLIS" itself; this test guards against copying the old
// "INTELFORGE ACADEMY" wording from siem/forense-adquisicion into one.
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { VIDEOS_DIR, readManifest } from './paths.mjs';
import { profileFor } from './profiles.mjs';

/** Every folder directly under VIDEOS_DIR that has its own video.json (video/edr/ has none — an older, separate pipeline). */
function videoSlugs() {
  return readdirSync(VIDEOS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(path.join(VIDEOS_DIR, entry.name, 'video.json')))
    .map((entry) => entry.name);
}

/** Every .ts/.tsx file under `dir`, recursively. */
function tsFilesUnder(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...tsFilesUnder(full));
    else if (/\.tsx?$/.test(entry.name)) out.push(full);
  }
  return out;
}

test('brand-yt: the enumeration actually finds videos (not silently empty)', () => {
  assert.ok(videoSlugs().includes('siem'), 'expected the siem video to be enumerated');
});

test('brand-yt: no YouTube-profile video keeps "INTELFORGE ACADEMY" in its own src/', () => {
  const slugs = videoSlugs();
  assert.ok(slugs.length > 0);
  const ytSlugs = slugs.filter((slug) => profileFor(readManifest(slug).profile).host === 'youtube');
  for (const slug of ytSlugs) {
    for (const file of tsFilesUnder(path.join(VIDEOS_DIR, slug, 'src'))) {
      const text = readFileSync(file, 'utf8');
      assert.ok(!text.includes('INTELFORGE'), `${file} still says INTELFORGE — write ALERTÓPOLIS instead`);
      assert.ok(!text.includes('IntelForge'), `${file} still says IntelForge — write Alertópolis instead`);
    }
  }
});
