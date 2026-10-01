import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, alpha } from '../../engine/src/theme/tokens';
import { Chip } from '../../engine/src/ui/Chip';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import {
  BACK_ROW,
  BANNER,
  BEACON,
  BEACON_TOWER,
  FRONT_ROW,
  GROUND_Y,
  STARS,
  TEXT_BOX,
  type Building,
  type WindowTone,
} from './skyline';

ensureFonts();

const WINDOW_FILL: Record<WindowTone, string | null> = {
  off: null,
  dim: alpha(C.faint, 0.32),
  data: alpha(C.cyan, 0.78),
  warn: alpha(C.amber, 0.9),
};

/** Night sky: the app's ink, its faint 64 px grid, a cyan glow over the city and a violet one low on the left. */
function Sky() {
  return (
    <AbsoluteFill style={{ background: C.ink950 }}>
      <AbsoluteFill
        style={{
          background: [
            `radial-gradient(900px 520px at ${BEACON.x}px ${BEACON.y}px, ${alpha(C.rose, 0.1)} 0%, transparent 70%)`,
            `radial-gradient(1500px 800px at 76% 30%, ${alpha(C.cyanDeep, 0.3)} 0%, transparent 62%)`,
            `radial-gradient(1300px 700px at 4% 78%, ${alpha(C.violetDeep, 0.42)} 0%, transparent 62%)`,
          ].join(', '),
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.32,
          backgroundImage: `linear-gradient(${alpha(C.ink700, 0.55)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(C.ink700, 0.55)} 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
          backgroundPosition: '-1px -1px',
        }}
      />
    </AbsoluteFill>
  );
}

function BuildingShape({ b }: { b: Building }) {
  const front = b.layer === 1;
  return (
    <g>
      <rect
        x={b.x}
        y={b.top}
        width={b.width}
        height={GROUND_Y - b.top + 1}
        fill={front ? C.ink900 : C.ink850}
        opacity={front ? 1 : 0.9}
      />
      <line x1={b.x} y1={b.top + 1} x2={b.x + b.width} y2={b.top + 1} stroke={front ? C.ink600 : C.ink700} strokeWidth={2} />
      {b.windows.map((w, i) => {
        const fill = WINDOW_FILL[w.tone];
        if (!fill) return null;
        return <rect key={i} x={w.x} y={w.y} width={10} height={13} rx={1.5} fill={fill} opacity={front ? 1 : 0.45} />;
      })}
    </g>
  );
}

/** Ground below the street line: seen only on TVs, a faint perspective grid of "data streets". */
function Ground() {
  const vanishX = BANNER.width * 0.62;
  const rays = Array.from({ length: 23 }, (_, i) => -2.6 + (i * 5.2) / 22);
  const rows = [0.02, 0.06, 0.12, 0.2, 0.31, 0.46, 0.66, 0.92];
  return (
    <g>
      <rect x={0} y={GROUND_Y} width={BANNER.width} height={BANNER.height - GROUND_Y} fill={C.ink950} />
      {rays.map((k) => (
        <line
          key={k}
          x1={vanishX + k * 90}
          y1={GROUND_Y}
          x2={vanishX + k * 1500}
          y2={BANNER.height}
          stroke={alpha(C.cyan, 0.07)}
          strokeWidth={1.5}
        />
      ))}
      {rows.map((t) => (
        <line
          key={t}
          x1={0}
          y1={GROUND_Y + t * (BANNER.height - GROUND_Y)}
          x2={BANNER.width}
          y2={GROUND_Y + t * (BANNER.height - GROUND_Y)}
          stroke={alpha(C.cyan, 0.06)}
          strokeWidth={1.5}
        />
      ))}
      {/* street line */}
      <rect x={0} y={GROUND_Y - 1} width={BANNER.width} height={3} fill={alpha(C.cyan, 0.55)} />
      <rect x={0} y={GROUND_Y + 2} width={BANNER.width} height={26} fill={`url(#street-glow)`} />
    </g>
  );
}

/** The alert: a rose beacon on the antenna of the tallest tower in the safe area. */
function Beacon() {
  const top = BEACON_TOWER.top;
  return (
    <g>
      <rect x={BEACON.x - 3} y={BEACON.y + 12} width={6} height={top - BEACON.y - 12} fill={C.ink600} />
      <rect x={BEACON.x - 16} y={top - 10} width={32} height={10} fill={C.ink700} />
      <circle cx={BEACON.x} cy={BEACON.y} r={132} fill="url(#beacon-glow)" />
      <circle cx={BEACON.x} cy={BEACON.y} r={66} fill="none" stroke={alpha(C.rose, 0.14)} strokeWidth={3} />
      <circle cx={BEACON.x} cy={BEACON.y} r={44} fill="none" stroke={alpha(C.rose, 0.3)} strokeWidth={3} />
      <circle cx={BEACON.x} cy={BEACON.y} r={26} fill={alpha(C.rose, 0.12)} stroke={alpha(C.rose, 0.65)} strokeWidth={3} />
      <circle cx={BEACON.x} cy={BEACON.y} r={12} fill={C.rose} />
      <circle cx={BEACON.x - 3.5} cy={BEACON.y - 3.5} r={4} fill={C.roseSoft} />
    </g>
  );
}

function City() {
  return (
    <svg
      width={BANNER.width}
      height={BANNER.height}
      viewBox={`0 0 ${BANNER.width} ${BANNER.height}`}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden
    >
      <defs>
        <radialGradient id="beacon-glow">
          <stop offset="0%" stopColor={C.rose} stopOpacity={0.3} />
          <stop offset="100%" stopColor={C.rose} stopOpacity={0} />
        </radialGradient>
        <linearGradient id="street-glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.cyan} stopOpacity={0.14} />
          <stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
        </linearGradient>
      </defs>
      {STARS.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={C.text} opacity={s.o} />
      ))}
      {BACK_ROW.map((b, i) => (
        <BuildingShape key={`b${i}`} b={b} />
      ))}
      <Ground />
      {FRONT_ROW.map((b, i) => (
        <BuildingShape key={`f${i}`} b={b} />
      ))}
      <Beacon />
    </svg>
  );
}

/**
 * Channel banner. Brand, tagline and beacon sit in the 1546×423 centre that
 * every device shows; the rest of the skyline is for desktops and TVs.
 */
export function Banner() {
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Sky />
      <City />
      <div style={{ position: 'absolute', left: TEXT_BOX.left, top: TEXT_BOX.top }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
          <BrandMark size={104} />
          <div
            style={{
              fontSize: 124,
              fontWeight: 850,
              letterSpacing: -2.5,
              lineHeight: 1,
              color: C.textStrong,
              whiteSpace: 'nowrap',
            }}
          >
            ALERT<span style={{ color: C.cyan }}>ÓPOLIS</span>
          </div>
        </div>
        <div style={{ marginTop: 22, fontSize: 44, fontWeight: 600, color: C.text, whiteSpace: 'nowrap' }}>
          Ciberseguridad en español, <span style={{ color: C.cyanSoft }}>con chispa</span>
        </div>
        <div style={{ marginTop: 22, display: 'flex', gap: 14 }}>
          <Chip accent="violet" icon="mortarboard" size={30}>
            Security+ SY0-701
          </Chip>
          <Chip accent="violet" icon="mortarboard" size={30}>
            GCTI
          </Chip>
          <Chip accent="cyan" icon="shield" size={30}>
            Blue team
          </Chip>
        </div>
      </div>
    </AbsoluteFill>
  );
}
