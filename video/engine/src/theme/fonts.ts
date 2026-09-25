import { cancelRender, continueRender, delayRender } from 'remotion';
import interUrl from '../fonts/InterVariable-latin.woff2';
import monoUrl from '../fonts/JetBrainsMonoVariable-latin.woff2';

/**
 * Loads the app's own typefaces (Inter + JetBrains Mono, OFL, latin subset)
 * before the first frame is captured, so no frame is rendered with the
 * fallback font. The files ship with the engine, so every video shares them.
 */
const FACES = [
  { family: 'IF Inter', url: interUrl, weight: '100 900' },
  { family: 'IF JetBrains Mono', url: monoUrl, weight: '100 800' },
] as const;

let loaded = false;

export function ensureFonts(): void {
  if (loaded || typeof document === 'undefined') return;
  loaded = true;
  const handle = delayRender('Loading IntelForge fonts');
  Promise.all(
    FACES.map(async ({ family, url, weight }) => {
      const face = new FontFace(family, `url(${url}) format('woff2')`, { weight, style: 'normal' });
      await face.load();
      document.fonts.add(face);
    }),
  )
    .then(() => continueRender(handle))
    // A render with fallback fonts would look subtly wrong; fail loudly instead.
    .catch((error: unknown) => cancelRender(error));
}
