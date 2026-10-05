import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';
import { TrailIcon } from './scenes/parts/TrailIcons';
import { TRAILS, TRAIL_ORDER, type TrailKind } from './scenes/parts/TrailRow';

ensureFonts();

/** The three tiles of the night, stepping down to the right (absolute 1920×1080 coordinates). */
const TILE = 230;
const TILES: Record<TrailKind, { x: number; y: number }> = {
  key: { x: 1150, y: 170 },
  folder: { x: 1330, y: 440 },
  pipe: { x: 1510, y: 710 },
};

/** One rose icon tile with the row's time under it, as in the morning queue. */
function NightTile({ kind }: { kind: TrailKind }) {
  const { x, y } = TILES[kind];
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: TILE, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <div
        style={{
          width: TILE,
          height: TILE,
          borderRadius: 40,
          display: 'grid',
          placeItems: 'center',
          background: alpha(C.rose, 0.16),
          border: `4px solid ${alpha(C.rose, 0.85)}`,
          boxShadow: `0 0 60px ${alpha(C.rose, 0.35)}`,
        }}
      >
        <TrailIcon kind={kind} size={Math.round(TILE * 0.66)} strokeWidth={5} />
      </div>
      <span style={{ fontFamily: FONT.mono, fontSize: 44, fontWeight: 800, color: C.textStrong }}>{TRAILS[kind].time}</span>
    </div>
  );
}

/**
 * Poster / YouTube thumbnail for «Ataques en los logs: spraying, traversal y
 * amplificación DNS». Big two-line title on the left for small-size
 * legibility; on the right, the video's frame: the three trails of the night
 * (key, folder, pipe), each with its time, in the order they arrived.
 */
export function Poster() {
  const left = LAYOUT.marginX;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />

      {/* soft halo behind the tiles */}
      <div
        style={{
          position: 'absolute',
          left: 1040,
          top: 120,
          width: 860,
          height: 900,
          background: `radial-gradient(closest-side, ${alpha(C.rose, 0.12)} 0%, transparent 100%)`,
        }}
      />
      {TRAIL_ORDER.map((kind) => (
        <NightTile key={kind} kind={kind} />
      ))}

      {/* brand */}
      <div style={{ position: 'absolute', left, top: 250, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>

      {/* title, two lines for thumbnail legibility */}
      <div style={{ position: 'absolute', left: left - 6, top: 298, fontWeight: 850, letterSpacing: -2.5, color: C.textStrong }}>
        <div style={{ fontSize: 112, lineHeight: 1.04, whiteSpace: 'nowrap' }}>Ataques en</div>
        <div style={{ fontSize: 112, lineHeight: 1.04, whiteSpace: 'nowrap' }}>
          los <span style={{ color: C.rose }}>logs</span>
        </div>
      </div>

      {/* subtitle */}
      <div style={{ position: 'absolute', left, top: 560, fontSize: 50, fontWeight: 650, lineHeight: 1.2, color: C.text, whiteSpace: 'nowrap' }}>
        Spraying, traversal y amplificación DNS
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 676, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="violet" icon="mortarboard" size={30}>
            Security+ · SY0-701 · 2.4
          </Chip>
          <Chip accent="muted" icon="clock" size={30}>
            ~4 min
          </Chip>
        </div>
        <Chip accent="muted" size={26} style={{ color: C.muted }}>
          {SIMULATION_LABEL}
        </Chip>
      </div>

      {/* disclaimer */}
      <div style={{ position: 'absolute', left, top: 986, fontSize: TYPE.micro, fontWeight: 550, color: C.faint }}>
        Material independiente, no afiliado a CompTIA.
      </div>
    </AbsoluteFill>
  );
}
