import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { progress, springIn, EASE } from '../../../../engine/src/theme/motion';
import { cubicPath, cubicPoint, dimStyle, type Point } from '../../../../engine/src/ui';
import { VIGNETTES } from '../../data/niveles';

/**
 * The football club (s02): one abstract vignette per reader. No crests, no teams, no real players,
 * no brands. Each card is 548×172: an illustration on the left (232×150) and, on the right, who it is
 * and what that person needs. The drawings animate on their own local frame (`f` = frame − at).
 */
export const VIGNETTE = { w: 548, h: 172 } as const;

type Cubic = [Point, Point, Point, Point];

function draw(p: number): { pathLength: number; strokeDasharray: number; strokeDashoffset: number } {
  return { pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p };
}

/** The pitch seen from above: a move in progress and a clock that runs. */
function Pitch({ f, tone }: { f: number; tone: string }) {
  const pass: Cubic = [
    { x: 52, y: 102 },
    { x: 74, y: 30 },
    { x: 132, y: 30 },
    { x: 172, y: 90 },
  ];
  const reveal = progress(f, 6, 40, EASE.inOut);
  const t = progress(f % 70, 4, 56, EASE.inOut);
  const ball = cubicPoint(pass, f < 50 ? reveal : t);
  const hand = (f * 9) % 360;
  return (
    <svg width={232} height={150} viewBox="0 0 232 150" aria-hidden style={{ display: 'block' }}>
      <rect x={4} y={4} width={224} height={142} rx={10} fill={alpha(tone, 0.07)} stroke={alpha(tone, 0.6)} strokeWidth={3} />
      <path d="M116 4 V146" stroke={alpha(tone, 0.4)} strokeWidth={2.5} />
      <circle cx={116} cy={75} r={20} fill="none" stroke={alpha(tone, 0.4)} strokeWidth={2.5} />
      <rect x={4} y={42} width={32} height={66} fill="none" stroke={alpha(tone, 0.4)} strokeWidth={2.5} />
      <rect x={196} y={42} width={32} height={66} fill="none" stroke={alpha(tone, 0.4)} strokeWidth={2.5} />
      {/* rivals */}
      {[
        [96, 96],
        [140, 58],
        [152, 112],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={7} fill="none" stroke={C.muted} strokeWidth={3} />
      ))}
      {/* our players */}
      {[
        [52, 102],
        [112, 50],
        [172, 90],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={8} fill={tone} />
      ))}
      <path d={cubicPath(pass)} fill="none" stroke={tone} strokeWidth={3.5} strokeLinecap="round" {...draw(reveal)} />
      <circle cx={ball.x} cy={ball.y} r={5.5} fill={C.textStrong} stroke={C.ink950} strokeWidth={1.5} />
      {/* the clock */}
      <circle cx={196} cy={122} r={21} fill={C.ink900} stroke={tone} strokeWidth={3.5} />
      <path d="M196 122 V108" stroke={tone} strokeWidth={3.5} strokeLinecap="round" />
      <path d="M196 122 V111" stroke={C.textStrong} strokeWidth={3.5} strokeLinecap="round" transform={`rotate(${hand} 196 122)`} />
    </svg>
  );
}

/** The coach's board: the rival's moves, the same one again and again. */
function RivalBoard({ f, tone }: { f: number; tone: string }) {
  const zig = 'M26 34 L78 54 L116 30 L176 56 L204 40';
  const scan = Math.sin((f / 90) * Math.PI * 2);
  return (
    <svg width={232} height={150} viewBox="0 0 232 150" aria-hidden style={{ display: 'block', overflow: 'visible' }}>
      <rect x={4} y={4} width={224} height={142} rx={10} fill={C.ink900} stroke={alpha(tone, 0.75)} strokeWidth={3} />
      {[0, 1, 2].map((i) => {
        const p = progress(f, 8 + i * 18, 22, EASE.inOut);
        return (
          <g key={i} transform={`translate(0 ${i * 36 + 8})`} opacity={0.55 + 0.45 * p}>
            <circle cx={26} cy={34} r={6} fill={C.rose} opacity={p > 0 ? 1 : 0} />
            <path d={zig} fill="none" stroke={C.rose} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" {...draw(p)} />
            <path d="M204 40 L192 34 M204 40 L195 51" fill="none" stroke={C.rose} strokeWidth={3.5} strokeLinecap="round" opacity={p > 0.95 ? 1 : 0} />
          </g>
        );
      })}
      <g transform={`translate(${150 + 20 * scan} 96)`}>
        <circle cx={26} cy={26} r={20} fill={alpha(C.ink950, 0.6)} stroke={tone} strokeWidth={4} />
        <path d="M41 41 L58 58" stroke={tone} strokeWidth={6} strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** The directors' plan: academy and squad on a floor plan, and a calendar of seasons. */
function YearsPlan({ f, tone }: { f: number; tone: string }) {
  const squad = [0, 1, 2, 3, 4];
  return (
    <svg width={232} height={150} viewBox="0 0 232 150" aria-hidden style={{ display: 'block' }}>
      <rect x={4} y={4} width={224} height={88} rx={10} fill={alpha(tone, 0.06)} stroke={alpha(tone, 0.6)} strokeWidth={3} />
      {/* academy */}
      <rect x={14} y={14} width={62} height={68} rx={6} fill="none" stroke={alpha(tone, 0.55)} strokeWidth={2.5} strokeDasharray="6 5" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={24 + (i % 2) * 24} y={26 + Math.floor(i / 2) * 26} width={16} height={16} rx={3} fill={alpha(tone, 0.35 + 0.65 * progress(f, 6 + i * 5, 12))} />
      ))}
      {/* squad */}
      <rect x={86} y={14} width={132} height={68} rx={6} fill="none" stroke={alpha(tone, 0.55)} strokeWidth={2.5} />
      {squad.map((i) => (
        <circle key={i} cx={106 + (i % 3) * 38} cy={34 + Math.floor(i / 3) * 30} r={10} fill={tone} opacity={progress(f, 16 + i * 5, 12)} />
      ))}
      {/* the seasons */}
      <path d="M8 106 H224" stroke={C.ink600} strokeWidth={3} />
      {[0, 1, 2, 3].map((i) => {
        const p = progress(f, 30 + i * 14, 14);
        return (
          <g key={i}>
            <rect x={8 + i * 56} y={112} width={50} height={30} rx={6} fill={alpha(tone, 0.12 + 0.5 * p)} stroke={alpha(tone, 0.7)} strokeWidth={2.5} />
            <path d={`M${20 + i * 56} 127 H${46 + i * 56}`} stroke={alpha(C.textStrong, 0.45 * p)} strokeWidth={3} strokeLinecap="round" />
          </g>
        );
      })}
    </svg>
  );
}

/**
 * One vignette. `at` = frame it lands; `dim` (0–1) steps it back; `glow` (0–1) lights it while its
 * row is the one being filled.
 */
export function Vignette({ index, at, frame, fps, dim = 0, glow = 0 }: { index: 0 | 1 | 2; at: number; frame: number; fps: number; dim?: number; glow?: number }) {
  const v = VIGNETTES[index];
  const p = frame < at - 6 ? 0 : springIn(frame, fps, at - 4, { damping: 16 });
  const f = Math.max(0, frame - at);
  const Art = index === 0 ? Pitch : index === 1 ? RivalBoard : YearsPlan;
  return (
    <div
      style={{
        position: 'relative',
        width: VIGNETTE.w,
        height: VIGNETTE.h,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: '0 22px 0 12px',
        borderRadius: 24,
        border: `${glow > 0.3 ? 3 : 2}px solid ${alpha(v.tone, 0.3 + 0.6 * glow)}`,
        background: `linear-gradient(180deg, ${alpha(v.tone, 0.05 + 0.07 * glow)} 0%, ${alpha(C.ink900, 0.96)} 60%)`,
        boxShadow: glow > 0.02 ? `0 0 ${Math.round(34 * glow)}px ${alpha(v.tone, 0.28 * glow)}` : `0 16px 40px ${alpha('#000000', 0.3)}`,
        fontFamily: FONT.sans,
        ...dimStyle(dim, Math.min(1, p * 1.5)),
        transform: `translateY(${(1 - Math.min(1, p)) * 26}px)`,
      }}
    >
      <div style={{ flexShrink: 0, width: 232, height: 150 }}>
        <Art f={f} tone={v.tone} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 34, fontWeight: 850, color: v.tone, whiteSpace: 'nowrap', lineHeight: 1.05 }}>
          {v.who}
        </div>
        <div style={{ fontSize: 28, fontWeight: 650, lineHeight: 1.18, color: C.text, width: 264 }}>{v.line}</div>
      </div>
    </div>
  );
}

/** An empty dashed slot, so the row is never empty before the vignettes land. */
export function VignetteSlot({ opacity = 1 }: { opacity?: number }) {
  return <div style={{ width: VIGNETTE.w, height: VIGNETTE.h, boxSizing: 'border-box', borderRadius: 24, border: `2px dashed ${C.ink600}`, opacity }} />;
}
