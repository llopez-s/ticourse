import { cancelRender, continueRender, delayRender, staticFile } from 'remotion';

/**
 * Loads the app's own typefaces (Inter + JetBrains Mono, OFL, latin subset)
 * from the video's public dir before the first frame is captured, so no frame
 * is rendered with the fallback font.
 */
const FACES = [
  { family: 'IF Inter', file: 'fonts/InterVariable-latin.woff2', weight: '100 900' },
  { family: 'IF JetBrains Mono', file: 'fonts/JetBrainsMonoVariable-latin.woff2', weight: '100 800' },
] as const;

let loaded = false;

export function ensureFonts(): void {
  if (loaded || typeof document === 'undefined') return;
  loaded = true;
  const handle = delayRender('Loading IntelForge fonts');
  Promise.all(
    FACES.map(async ({ family, file, weight }) => {
      const face = new FontFace(family, `url(${staticFile(file)}) format('woff2')`, { weight, style: 'normal' });
      await face.load();
      document.fonts.add(face);
    }),
  )
    .then(() => continueRender(handle))
    // A render with fallback fonts would look subtly wrong; fail loudly instead.
    .catch((error: unknown) => cancelRender(error));
}
