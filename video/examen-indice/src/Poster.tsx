import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';
import { Binder } from './scenes/parts/Binder';
import { Dial } from './scenes/parts/Dial';
import { MiniNote } from './scenes/parts/paper';

ensureFonts();

/** Loose micro-notes around the binder, in absolute 1920×1080 coordinates: [x, y, tilt, stripe colour]. */
const NOTES: [number, number, number, string][] = [
  [1030, 250, -10, C.amber],
  [1030, 590, 8, C.emerald],
  [1640, 220, 9, C.cyan],
  [1700, 560, -7, C.roseSoft],
  [1560, 760, 5, C.amber],
];

/**
 * Poster / YouTube thumbnail for «Tu índice vale 60 segundos». Big title on the left («Tu índice»
 * huge in white, «vale 60 segundos» in cyan on two lines) for legibility at small size; on the right,
 * the video's central image: the printed index with its coloured tabs among loose micro-notes, and a
 * stopwatch with «60 s» in front of it.
 */
export function Poster() {
  const left = LAYOUT.marginX;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />

      {/* soft warm halo behind the index */}
      <div style={{ position: 'absolute', left: 1000, top: 120, width: 900, height: 840, background: `radial-gradient(closest-side, ${alpha('#f59e0b', 0.16)} 0%, transparent 100%)` }} />
      {NOTES.map(([x, y, rot, c]) => (
        <div key={`${x}${y}`} style={{ position: 'absolute', left: x, top: y }}>
          <MiniNote w={190} h={126} rotate={rot} stripe={c} lines={3} />
        </div>
      ))}
      <div style={{ position: 'absolute', left: 1280, top: 190 }}>
        <Binder w={400} glow={0.7} tabs={1} rotate={-3} />
      </div>
      <div style={{ position: 'absolute', left: 1040, top: 650 }}>
        <Dial size={290} sweep={1 / 12} hand={1 / 12} color={C.emerald} stopwatch glow={0.9}>
          <span style={{ fontSize: 104, fontWeight: 850, color: C.textStrong, letterSpacing: -3, marginTop: 24 }}>60 s</span>
        </Dial>
      </div>

      {/* brand */}
      <div style={{ position: 'absolute', left, top: 214, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>

      {/* title */}
      <div style={{ position: 'absolute', left: left - 8, top: 262, fontWeight: 850, letterSpacing: -2.5, color: C.textStrong }}>
        <div style={{ fontSize: 168, lineHeight: 1, whiteSpace: 'nowrap', textShadow: `0 0 40px ${alpha(C.cyan, 0.25)}` }}>Tu índice</div>
        <div style={{ marginTop: 18, fontSize: 118, lineHeight: 1.02, whiteSpace: 'nowrap', color: C.cyan }}>vale 60</div>
        <div style={{ fontSize: 118, lineHeight: 1.02, whiteSpace: 'nowrap', color: C.cyan }}>segundos</div>
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 760, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="cyan" icon="mortarboard" size={30}>
            GCTI · estrategia de examen
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
      <div style={{ position: 'absolute', left, top: 986, fontSize: TYPE.micro, fontWeight: 550, color: C.faint }}>Material independiente, no afiliado a SANS/GIAC.</div>
    </AbsoluteFill>
  );
}
