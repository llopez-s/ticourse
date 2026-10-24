import { C, alpha } from '../../../../engine/src/theme/tokens';
import { Bars, Sheet, SignatureGap } from './Docs';
import { BridgeArt } from './Images';

/** The video's image, in its own units: the document with its empty signature gap, the magnifier and the loaded bridge. */
export const POSTER_ART = { w: 760, h: 560 } as const;

/**
 * The video in one image: the document that declares (an empty signature gap), the lens that checks it and, under
 * both, the bridge with its loaded trucks — the three things the title sets against each other. No dates, no names,
 * no lines to anything outside.
 */
export function PosterArt({ scale = 1 }: { scale?: number }) {
  return (
    <div style={{ position: 'relative', width: POSTER_ART.w * scale, height: POSTER_ART.h * scale }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: POSTER_ART.w, height: POSTER_ART.h, transform: `scale(${scale})`, transformOrigin: '0 0' }}>
        <div style={{ position: 'absolute', left: 20, top: 330 }}>
          <BridgeArt width={720} load={1} />
        </div>
        <div style={{ position: 'absolute', left: 70, top: 10 }}>
          <Sheet width={330} height={390} tone={C.sky} glow={0.5} rotate={-4}>
            <div style={{ padding: '34px 32px 0' }}>
              <Bars widths={[58, 100, 100, 100, 74]} gap={20} h={13} />
            </div>
            <div style={{ position: 'absolute', left: 32, bottom: 34 }}>
              <SignatureGap width={266} height={74} color={C.cyan} pulse={0.6} />
            </div>
          </Sheet>
        </div>
        <svg width={POSTER_ART.w} height={POSTER_ART.h} viewBox={`0 0 ${POSTER_ART.w} ${POSTER_ART.h}`} fill="none" style={{ position: 'absolute', left: 0, top: 0 }} aria-hidden>
          <circle cx={470} cy={190} r={120} fill={alpha(C.cyan, 0.1)} stroke={C.cyanSoft} strokeWidth={18} />
          <line x1={556} y1={276} x2={650} y2={372} stroke={C.cyanSoft} strokeWidth={32} strokeLinecap="round" />
          <path d="M 420 190 l 36 38 l 70 -76" stroke={C.emerald} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
