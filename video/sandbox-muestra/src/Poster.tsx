import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';

ensureFonts();

/** Placeholder until the scenes are built: the real poster replaces it. */
export function Poster() {
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />
      <div style={{ position: 'absolute', left: 120, top: 420, fontSize: 96, fontWeight: 800 }}>
        Lo que cuenta una muestra · ALERTÓPOLIS
      </div>
    </AbsoluteFill>
  );
}
