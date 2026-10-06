import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';
import { GroupedFilms } from './scenes/parts/s06-grupo/GroupedFilms';
import { TrapBox, trapBoxHeight, trapBoxLabelSlot, trapBoxPoint } from './scenes/parts/TrapBox';
import { WorkshopLabel, workshopLabelHeight } from './scenes/parts/WorkshopLabel';

ensureFonts();

// The image on the right half (absolute 1920×1080 coordinates).
const GROUP = { x: 948, y: 128, w: 904, h: 548 } as const;
const BOX_W = 220;
const BOX_H = trapBoxHeight(BOX_W);
const BOXES = [
  { x: 1000, label: 'Meridian', color: C.cyan, wrapper: 'cv' },
  { x: 1580, label: 'Orbital', color: C.cyanSoft, wrapper: 'order' },
] as const;
const BOX_Y = 716;
const BIG_LABEL = { w: 300, cx: 1400, cy: 806 } as const;

/**
 * Poster / YouTube thumbnail for «De la foto a la película: activity threads y grupos». Big two-line title on the
 * left for small-size legibility; on the right, the video's thesis in one glance, drawn with the shared parts: the two
 * films (Meridian's whole, Orbital's partial) inside one group frame — ACTIVITY GROUP, «candidato» — and under it the
 * two boxes (their victims' wrappers, as in s04) with the same workshop label inside, drawn larger between them and
 * joined to both — its field left blank, so no path is readable on the thumbnail. No group name anywhere.
 */
export function Poster() {
  const left = LAYOUT.marginX;
  const slot = trapBoxLabelSlot(BOX_W, 1);
  const bigH = workshopLabelHeight(BIG_LABEL.w);
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />

      {/* soft cyan halo behind the group */}
      <div
        style={{
          position: 'absolute',
          left: GROUP.x + GROUP.w / 2 - 520,
          top: GROUP.y + GROUP.h / 2 - 340,
          width: 1040,
          height: 680,
          background: `radial-gradient(closest-side, ${alpha(C.violet, 0.1)} 0%, transparent 100%)`,
        }}
      />

      <div style={{ position: 'absolute', left: GROUP.x, top: GROUP.y }}>
        <GroupedFilms width={GROUP.w} height={GROUP.h} arrange="stack" nameSize={42} labelSize={30} draw={1} name={1} candidate={1} films={1} marksRoom={0} />
      </div>

      {/* The two boxes, the same workshop label inside both, drawn large between them */}
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {BOXES.map((b, k) => {
          const p = trapBoxPoint(BOX_W, 'label', 1);
          const x0 = b.x + p.x;
          const y0 = BOX_Y + p.y;
          const x1 = k === 0 ? BIG_LABEL.cx - BIG_LABEL.w / 2 : BIG_LABEL.cx + BIG_LABEL.w / 2;
          const y1 = BIG_LABEL.cy;
          const dx = k === 0 ? 1 : -1;
          return (
            <path
              key={b.label}
              d={`M ${x0} ${y0} C ${x0 + dx * 70} ${y0 - 30}, ${x1 - dx * 60} ${y1}, ${x1} ${y1}`}
              fill="none"
              stroke={C.cyan}
              strokeWidth={4}
              strokeDasharray="10 9"
              strokeLinecap="round"
              opacity={0.9}
            />
          );
        })}
      </svg>
      {BOXES.map((b) => (
        <div key={b.label} style={{ position: 'absolute', left: b.x, top: BOX_Y }}>
          <TrapBox width={BOX_W} open={1} device={1} lit={1} wrapper={b.wrapper}>
            <WorkshopLabel width={slot.w * 1.2} glow={0.5} />
          </TrapBox>
          <div style={{ position: 'absolute', left: -20, top: BOX_H + 4, width: BOX_W + 40, textAlign: 'center', fontSize: 30, fontWeight: 800, color: b.color }}>
            {b.label}
          </div>
        </div>
      ))}
      <div style={{ position: 'absolute', left: BIG_LABEL.cx - BIG_LABEL.w / 2, top: BIG_LABEL.cy - bigH / 2 }}>
        {/* Field left blank on the thumbnail: the path is read in the video (s04), never singled out on the poster */}
        <WorkshopLabel width={BIG_LABEL.w} glow={0.8} />
      </div>

      {/* brand */}
      <div style={{ position: 'absolute', left, top: 262, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>

      {/* title, two lines for thumbnail legibility */}
      <div style={{ position: 'absolute', left: left - 6, top: 310, fontWeight: 850, letterSpacing: -2.5, color: C.textStrong }}>
        <div style={{ fontSize: TYPE.hero, lineHeight: 1.04, whiteSpace: 'nowrap' }}>De la foto</div>
        <div style={{ fontSize: TYPE.hero, lineHeight: 1.04, whiteSpace: 'nowrap', color: C.cyan }}>a la película</div>
      </div>

      {/* subtitle */}
      <div style={{ position: 'absolute', left, top: 560, fontSize: TYPE.h3, fontWeight: 650, lineHeight: 1.25 }}>
        <div style={{ color: C.text }}>activity threads</div>
        <div style={{ color: '#c4b5fd' }}>y grupos</div>
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 712, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="violet" icon="mortarboard" size={30}>
            GCTI · Intrusion Analysis
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
