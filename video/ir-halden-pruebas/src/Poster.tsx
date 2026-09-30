import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';

ensureFonts();

/** Poster / YouTube thumbnail for «Antes del próximo incidente» (placeholder until the scenes are built). */
export function Poster() {
  const left = LAYOUT.marginX;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />
      <div style={{ position: 'absolute', left, top: 250, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>
      <div style={{ position: 'absolute', left: left - 6, top: 298, fontWeight: 850, letterSpacing: -2.5, color: C.textStrong }}>
        <div style={{ fontSize: 116, lineHeight: 1.04, whiteSpace: 'nowrap' }}>Antes del próximo</div>
        <div style={{ fontSize: 116, lineHeight: 1.04, color: C.cyan, whiteSpace: 'nowrap' }}>incidente</div>
      </div>
    </AbsoluteFill>
  );
}
