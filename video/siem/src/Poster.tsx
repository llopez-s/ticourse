import type { ReactNode } from 'react';
import { AbsoluteFill, interpolateColors, random } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { Icon } from '../../engine/src/ui/Icon';
import { cubicPath, curveBetween, type Point } from '../../engine/src/ui/geometry';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';

ensureFonts();

/* Motif geometry (1920×1080 space). Noise enters on the left of the motif,
   the SIEM node condenses it, one alert leaves on the right. The centre of the
   frame (where the browser draws its play button) stays clear. */
const MOUTH_X = 1085;
const MOUTH_HALF = 300;
const NODE: Point = { x: 1540, y: 540 };
const NODE_R = 64;
const ALERT: Point = { x: 1756, y: 540 };
const ALERT_R = 38;
const FIELD_END = NODE.x - NODE_R - 38;
const DOTS = 190;

interface Dot {
  x: number;
  y: number;
  r: number;
  color: string;
  opacity: number;
}

/** Deterministic dot field shaped like a funnel: wide and grey at the mouth, tight and cyan near the node. */
function buildField(): Dot[] {
  const dots: Dot[] = [];
  for (let i = 0; i < DOTS; i++) {
    const t = Math.pow(random(`poster-dot-t-${i}`), 0.9);
    const x = MOUTH_X + (FIELD_END - MOUTH_X) * t;
    const spread = MOUTH_HALF * Math.pow(1 - t, 1.15) + 16;
    const u = random(`poster-dot-y-${i}`) * 2 - 1;
    const y = NODE.y + Math.sign(u) * Math.pow(Math.abs(u), 0.85) * spread;
    const r = (4 + random(`poster-dot-r-${i}`) * 4.6) * (1 - 0.3 * t);
    const color = interpolateColors(t, [0, 0.55, 1], [C.faint, C.faint, C.cyan]);
    const opacity = 0.38 + 0.47 * random(`poster-dot-o-${i}`) + 0.15 * t;
    dots.push({ x, y, r, color, opacity: Math.min(1, opacity) });
  }
  return dots;
}

const FIELD = buildField();
/** The one event that matters. */
const NEEDLE: Point = { x: 1236, y: 398 };

function Motif() {
  const lanes = [-1, -0.62, -0.28, 0, 0.28, 0.62, 1];
  const needlePath = cubicPath([NEEDLE, { x: NEEDLE.x + 150, y: NEEDLE.y }, { x: NODE.x - 170, y: NODE.y }, { x: NODE.x - NODE_R, y: NODE.y }]);
  return (
    <svg
      width={LAYOUT.width}
      height={LAYOUT.height}
      viewBox={`0 0 ${LAYOUT.width} ${LAYOUT.height}`}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden
    >
      {/* flow lanes converging on the node */}
      {lanes.map((k) => (
        <path
          key={k}
          d={cubicPath(curveBetween({ x: MOUTH_X - 20, y: NODE.y + k * (MOUTH_HALF + 20) }, { x: NODE.x - NODE_R, y: NODE.y }, 0.55))}
          fill="none"
          stroke={alpha(Math.abs(k) === 1 ? C.cyan : C.ink600, Math.abs(k) === 1 ? 0.28 : 0.55)}
          strokeWidth={Math.abs(k) === 1 ? 2 : 1.5}
          strokeDasharray={Math.abs(k) === 1 ? '6 10' : undefined}
        />
      ))}

      {/* noise */}
      {FIELD.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.color} opacity={d.opacity} />
      ))}

      {/* the needle's route through the SIEM and out as an alert */}
      <path d={needlePath} fill="none" stroke={alpha(C.rose, 0.85)} strokeWidth={3} strokeLinecap="round" />
      <path
        d={`M${NODE.x + NODE_R},${NODE.y} L${ALERT.x - ALERT_R},${ALERT.y}`}
        stroke={C.rose}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <circle cx={NEEDLE.x} cy={NEEDLE.y} r={40} fill={alpha(C.rose, 0.07)} stroke={alpha(C.rose, 0.25)} strokeWidth={2} />
      <circle cx={NEEDLE.x} cy={NEEDLE.y} r={23} fill="none" stroke={alpha(C.rose, 0.6)} strokeWidth={2.5} />
      <circle cx={NEEDLE.x} cy={NEEDLE.y} r={11} fill={C.rose} />

      {/* SIEM node */}
      <circle cx={NODE.x} cy={NODE.y} r={NODE_R + 58} fill={alpha(C.cyan, 0.05)} />
      <circle cx={NODE.x} cy={NODE.y} r={NODE_R + 28} fill={alpha(C.cyan, 0.08)} stroke={alpha(C.cyan, 0.3)} strokeWidth={2} />
      <circle cx={NODE.x} cy={NODE.y} r={NODE_R} fill={C.ink900} stroke={C.cyan} strokeWidth={4} />

      {/* alert */}
      <circle cx={ALERT.x} cy={ALERT.y} r={ALERT_R + 14} fill={alpha(C.rose, 0.1)} />
      <circle cx={ALERT.x} cy={ALERT.y} r={ALERT_R} fill={C.roseDeep} stroke={C.rose} strokeWidth={3} />
    </svg>
  );
}

function Centered({ at, children }: { at: Point; children: ReactNode }) {
  return (
    <div style={{ position: 'absolute', left: at.x, top: at.y, transform: 'translate(-50%, -50%)' }}>{children}</div>
  );
}

/**
 * Poster frame for the lesson's <video> element. It is shown ~896 px wide, so
 * everything that must be read is ≥ 26 px here (≈ 12 px on screen).
 */
export function Poster() {
  const left = LAYOUT.marginX;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />
      <Motif />

      {/* motif labels and icons */}
      <Centered at={NODE}>
        <Icon name="radar" size={62} color={C.cyan} strokeWidth={1.8} />
      </Centered>
      <Centered at={{ x: NODE.x, y: NODE.y + NODE_R + 64 }}>
        <div style={{ fontSize: 36, fontWeight: 850, letterSpacing: 5, color: C.textStrong }}>SIEM</div>
      </Centered>
      <Centered at={ALERT}>
        <Icon name="bell" size={38} color={C.roseSoft} strokeWidth={2.2} />
      </Centered>
      <Centered at={{ x: ALERT.x, y: ALERT.y + ALERT_R + 44 }}>
        <div style={{ fontSize: TYPE.micro + 2, fontWeight: 800, letterSpacing: 2.5, color: C.roseSoft }}>ALERTA</div>
      </Centered>
      <div
        style={{
          position: 'absolute',
          left: NEEDLE.x - 26,
          top: NEEDLE.y - 104,
          padding: '8px 18px',
          borderRadius: 999,
          background: alpha(C.roseDeep, 0.92),
          border: `2px solid ${alpha(C.rose, 0.8)}`,
          fontSize: 30,
          fontWeight: 800,
          color: C.textStrong,
          whiteSpace: 'nowrap',
        }}
      >
        1 de 6.000
      </div>

      {/* brand */}
      <div style={{ position: 'absolute', left, top: 262, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>INTELFORGE ACADEMY</span>
      </div>

      {/* title */}
      <div
        style={{
          position: 'absolute',
          left: left - 6,
          top: 318,
          fontSize: TYPE.hero,
          fontWeight: 850,
          letterSpacing: -2.5,
          lineHeight: 1,
          color: C.textStrong,
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ color: C.cyan }}>SIEM</span> en acción
      </div>
      <div
        style={{
          position: 'absolute',
          left,
          top: 452,
          fontSize: TYPE.h3,
          fontWeight: 600,
          lineHeight: 1.25,
          color: C.text,
        }}
      >
        <div>Del ruido a la evidencia:</div>
        <div style={{ color: C.muted }}>cómo lo usa el Blue Team</div>
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 612, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="violet" icon="mortarboard" size={30}>
            Security+ SY0-701 · 4.4
          </Chip>
          <Chip accent="muted" icon="clock" size={30}>
            ~5 min
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
