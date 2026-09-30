import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, RADIUS, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { Icon } from '../../engine/src/ui/Icon';
import { Panel } from '../../engine/src/ui/Panel';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';

ensureFonts();

/** Canon strings of s03 (the drill), on screen only. «11 min», never a clock time. */
const TEXT = {
  console: 'Consola del EDR · VLAN de pruebas',
  host: 'ptl-pruebas-02',
  button: 'Aislar equipo',
  denied: 'Acción no permitida',
  deniedWhy: 'tu rol no incluye aislar equipos',
  minutes: '11 min',
} as const;

/** The EDR console, top right (absolute 1920×1080 coordinates). */
const CONSOLE = { x: 1112, y: 92, w: 728, h: 486 } as const;
/** The stopwatch under it, stopped at 11 minutes. */
const WATCH = { cx: 1470, cy: 834, r: 166 } as const;

/**
 * Poster / YouTube thumbnail for «Antes del próximo incidente: tabletop,
 * simulation y threat hunting». Big two-line title on the left for small-size
 * legibility; on the right, the drill's finding in one glance: the EDR console
 * refusing «Aislar equipo» on the test laptop (rose: the one refusal of the
 * video — the account's role, not the person) over the stopwatch that still
 * stopped at «11 min».
 */
export function Poster() {
  const left = LAYOUT.marginX;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />

      <EdrConsole />
      <Stopwatch />

      {/* brand */}
      <div style={{ position: 'absolute', left, top: 250, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>

      {/* title, two lines for thumbnail legibility */}
      <div style={{ position: 'absolute', left: left - 6, top: 298, fontWeight: 850, letterSpacing: -2.5, color: C.textStrong }}>
        <div style={{ fontSize: 108, lineHeight: 1.08, whiteSpace: 'nowrap' }}>Antes del</div>
        <div style={{ fontSize: 108, lineHeight: 1.08, color: C.cyan, whiteSpace: 'nowrap' }}>próximo incidente</div>
      </div>

      {/* subtitle: the three exam terms */}
      <div style={{ position: 'absolute', left, top: 564, fontSize: 48, fontWeight: 650, lineHeight: 1.2, color: C.text, whiteSpace: 'nowrap' }}>tabletop · simulation · threat hunting</div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 676, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="violet" icon="mortarboard" size={30}>
            Security+ · 4.8
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

// ---------------------------------------------------------------------------

function EdrConsole() {
  const btn = { x: 32, y: 124, w: 400, h: 84 };
  return (
    <div style={{ position: 'absolute', left: CONSOLE.x, top: CONSOLE.y, width: CONSOLE.w, height: CONSOLE.h }}>
      <Panel title={TEXT.console} icon="shield" accent="cyan" style={{ width: CONSOLE.w, height: CONSOLE.h, boxShadow: `0 30px 70px ${alpha('#000000', 0.5)}` }}>
        {/* the test laptop */}
        <div style={{ position: 'absolute', left: 32, top: 26, height: 72, display: 'flex', alignItems: 'center', gap: 18, whiteSpace: 'nowrap' }}>
          <Icon name="laptop" size={62} color={C.cyan} strokeWidth={1.8} />
          <span style={{ fontFamily: FONT.mono, fontSize: 46, fontWeight: 800, color: C.textStrong }}>{TEXT.host}</span>
        </div>

        {/* «Aislar equipo», just pressed */}
        <div
          style={{
            position: 'absolute',
            left: btn.x,
            top: btn.y,
            width: btn.w,
            height: btn.h,
            boxSizing: 'border-box',
            borderRadius: RADIUS.md,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            border: `3px solid ${alpha(C.cyan, 0.85)}`,
            background: alpha(C.cyan, 0.2),
            fontSize: 40,
            fontWeight: 800,
            color: C.textStrong,
            whiteSpace: 'nowrap',
          }}
        >
          <Icon name="lock" size={40} color={C.cyan} strokeWidth={2.2} />
          {TEXT.button}
        </div>
        <div style={{ position: 'absolute', left: btn.x + btn.w - 16, top: btn.y + btn.h - 22 }}>
          <div style={{ position: 'absolute', left: -22, top: -22, width: 44, height: 44, borderRadius: 22, border: `3px solid ${alpha(C.cyanSoft, 0.55)}` }} />
          <Icon name="cursor" size={54} color={C.textStrong} strokeWidth={1.2} style={{ filter: `drop-shadow(0 4px 8px ${alpha('#000000', 0.6)})` }} />
        </div>

        {/* the refusal */}
        <div
          style={{
            position: 'absolute',
            left: 32,
            right: 32,
            top: 244,
            height: 160,
            boxSizing: 'border-box',
            borderRadius: RADIUS.md,
            border: `3px solid ${alpha(C.rose, 0.9)}`,
            background: alpha(C.rose, 0.14),
            boxShadow: `0 0 40px ${alpha(C.rose, 0.3)}`,
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            padding: '0 22px',
          }}
        >
          <div style={{ width: 66, height: 66, borderRadius: 33, flexShrink: 0, display: 'grid', placeItems: 'center', background: C.rose }}>
            <Icon name="x" size={42} color={C.ink950} strokeWidth={3.2} />
          </div>
          <div style={{ whiteSpace: 'nowrap' }}>
            <div style={{ fontSize: 50, fontWeight: 850, letterSpacing: -0.8, lineHeight: 1.05, color: C.roseSoft }}>{TEXT.denied}</div>
            <div style={{ marginTop: 8, fontSize: 32, fontWeight: 650, color: C.text }}>{TEXT.deniedWhy}</div>
          </div>
        </div>
      </Panel>
    </div>
  );
}

/** The drill's minutes stopwatch, stopped (emerald) at «11 min». */
function Stopwatch() {
  const { cx, cy, r } = WATCH;
  const rad = (d: number) => (d * Math.PI) / 180;
  const hand = 11 * 6; // 11 minutes on a 60-minute dial
  const size = 2 * r + 80;
  return (
    <div style={{ position: 'absolute', left: cx - size / 2, top: cy - size / 2 - 30, width: size, height: size + 30 }}>
      <svg width={size} height={size + 30} viewBox={`${-size / 2} ${-size / 2 - 30} ${size} ${size + 30}`} style={{ display: 'block', overflow: 'visible' }}>
        {/* crown and side button */}
        <rect x={-24} y={-r - 52} width={48} height={28} rx={6} fill={C.ink500} />
        <rect x={-11} y={-r - 26} width={22} height={22} fill={C.ink600} />
        <line x1={r * 0.72} y1={-r * 0.72} x2={r * 0.87} y2={-r * 0.87} stroke={C.ink500} strokeWidth={16} strokeLinecap="round" />
        {/* dial */}
        <circle r={r} fill={C.ink850} stroke={alpha(C.emerald, 0.95)} strokeWidth={10} style={{ filter: `drop-shadow(0 0 22px ${alpha(C.emerald, 0.5)})` }} />
        {Array.from({ length: 60 }, (_, i) => {
          const a = rad(i * 6);
          const major = i % 5 === 0;
          const r0 = major ? r - 26 : r - 16;
          return <line key={i} x1={Math.sin(a) * r0} y1={-Math.cos(a) * r0} x2={Math.sin(a) * (r - 8)} y2={-Math.cos(a) * (r - 8)} stroke={major ? C.text : C.ink500} strokeWidth={major ? 4 : 2} strokeLinecap="round" />;
        })}
        {/* elapsed: 11 of 60 minutes */}
        <circle r={r - 40} fill="none" stroke={alpha(C.emerald, 0.45)} strokeWidth={12} pathLength={60} strokeDasharray="11 60" transform="rotate(-90)" />
        <line x1={0} y1={12} x2={Math.sin(rad(hand)) * (r - 34)} y2={-Math.cos(rad(hand)) * (r - 34)} stroke={C.emerald} strokeWidth={8} strokeLinecap="round" />
        <circle r={13} fill={C.emerald} />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: size / 2 + 30 + 34,
          width: size,
          textAlign: 'center',
          fontFamily: FONT.mono,
          fontSize: 54,
          fontWeight: 800,
          lineHeight: 1,
          color: '#6ee7b7',
          textShadow: `0 0 20px ${alpha(C.emerald, 0.6)}`,
          whiteSpace: 'nowrap',
        }}
      >
        {TEXT.minutes}
      </div>
    </div>
  );
}
