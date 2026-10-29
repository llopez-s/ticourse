import { C, alpha } from '../../engine/src/theme/tokens';
import { AccountCard } from './scenes/parts/AccountCard';
import { PARTES } from './scenes/parts/data';
import { FolderAcl } from './scenes/parts/FolderAcl';

/** The poster's image, in its own units. */
export const POSTER_ART = { w: 760, h: 560 } as const;

/**
 * The video in one image: the folder «Partes de avería» with its list of entries and the small barrier of «escribir»
 * shut, and in front of it the account («tu cuenta»: a tag, no name, no face). No dates, no names, no spoiler of the
 * answer (the barrier stays shut).
 */
export function PosterArt() {
  return (
    <div style={{ position: 'relative', width: POSTER_ART.w, height: POSTER_ART.h }}>
      <svg width={POSTER_ART.w} height={POSTER_ART.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
        <defs>
          <radialGradient id="poster-glow">
            <stop offset="0%" stopColor={C.cyan} stopOpacity={0.16} />
            <stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={POSTER_ART.w / 2} cy={POSTER_ART.h / 2 - 20} r={400} fill="url(#poster-glow)" />
      </svg>
      <div style={{ position: 'absolute', left: 0, top: 10, width: POSTER_ART.w, filter: `drop-shadow(0 20px 40px ${alpha('#000000', 0.5)})` }}>
        <FolderAcl entries={PARTES} width={POSTER_ART.w} server={null} gate={{ open: 0 }} fx={{ maint: { focus: 1 } }} rest={{}} />
      </div>
      <div style={{ position: 'absolute', left: 400, top: 440 }}>
        <AccountCard compact on={1} />
      </div>
    </div>
  );
}
