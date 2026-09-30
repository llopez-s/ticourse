import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, TYPE } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';

ensureFonts();

/** Stub poster until it is designed (see out/scene-brief.md). */
export function Poster() {
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />
      <div style={{ position: 'absolute', left: 120, top: 420, fontSize: TYPE.hero, fontWeight: 850 }}>Respuesta a incidentes</div>
    </AbsoluteFill>
  );
}
