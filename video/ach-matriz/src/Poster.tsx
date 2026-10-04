import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';
import { Matrix, matrixSize } from './scenes/parts/Matrix';

ensureFonts();

/** The still frame the matrix is drawn at: everything in its final state (winner framed long ago). */
const F = 0;

/** The finished ACH matrix on the right half (absolute 1920×1080 coordinates). */
const MAT_OPTS = { title: true, legend: 'band', counts: 'I' } as const;
const MAT_W = 860;
const MAT = matrixSize(MAT_OPTS, MAT_W);
const MAT_X = 1000;
const MAT_Y = Math.round((1080 - MAT.h - MAT.overhang.bottom) / 2) + 10;

/**
 * Poster / YouTube thumbnail for «ACH: gana la hipótesis que no puedes tumbar». Big
 * title on the left («ACH:» huge in cyan, the rest in two lines) for small-size
 * legibility; on the right, the video's central image: the lesson's ACH extract filled
 * in, the «Inconsistencias» row 0 · 3 · 2 and H1 framed «la menos inconsistente».
 */
export function Poster() {
  const left = LAYOUT.marginX;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />

      {/* soft halo behind the matrix */}
      <div
        style={{
          position: 'absolute',
          left: MAT_X - 160,
          top: MAT_Y - 140,
          width: MAT_W + 320,
          height: MAT.h + 280,
          background: `radial-gradient(closest-side, ${alpha(C.cyan, 0.14)} 0%, transparent 100%)`,
        }}
      />
      <div style={{ position: 'absolute', left: MAT_X, top: MAT_Y, transform: 'rotate(-1.5deg)', transformOrigin: '50% 50%' }}>
        <Matrix {...MAT_OPTS} width={MAT_W} winnerAt={-100} glow={0.6} frame={F} />
      </div>

      {/* brand */}
      <div style={{ position: 'absolute', left, top: 214, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>

      {/* title: «ACH:» big, the rest in two lines for thumbnail legibility */}
      <div style={{ position: 'absolute', left: left - 8, top: 252, fontWeight: 850, letterSpacing: -2.5, color: C.textStrong }}>
        <div style={{ fontSize: 172, lineHeight: 1, color: C.cyan, whiteSpace: 'nowrap', textShadow: `0 0 40px ${alpha(C.cyan, 0.3)}` }}>ACH:</div>
        <div style={{ marginTop: 14, fontSize: 80, lineHeight: 1.06, whiteSpace: 'nowrap' }}>gana la hipótesis</div>
        <div style={{ fontSize: 80, lineHeight: 1.06, whiteSpace: 'nowrap' }}>que no puedes tumbar</div>
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 700, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="violet" icon="mortarboard" size={30}>
            GCTI · Analysis
          </Chip>
          <Chip accent="muted" icon="clock" size={30}>
            ~8 min
          </Chip>
        </div>
        <Chip accent="muted" size={26} style={{ color: C.muted }}>
          {SIMULATION_LABEL}
        </Chip>
      </div>

      {/* disclaimer */}
      <div style={{ position: 'absolute', left, top: 986, fontSize: TYPE.micro, fontWeight: 550, color: C.faint }}>
        Material independiente, no afiliado a SANS/GIAC.
      </div>
    </AbsoluteFill>
  );
}
