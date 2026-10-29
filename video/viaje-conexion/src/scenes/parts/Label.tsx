import type { CSSProperties } from 'react';
import { EASE, progress } from '../../../../engine/src/theme/motion';
import { ACCENT, C, FONT, RADIUS, alpha, type Accent } from '../../../../engine/src/theme/tokens';

/**
 * THE LABEL (la etiqueta): the IP/TCP header drawn as a card stuck to the packet. Five boxes, always drawn
 * the same so s08 can show one of them changing:
 *
 *   origen   [ address ] [ port ]    [ proto ]
 *   destino  [ address ] [ port ]    [ TCP/UDP ]
 *
 * It is NOT V1's shipping tag and NOT V17's envelope. Native size is LABEL_W x LABEL_H (+ one extra row
 * while a rewrite is shown); use `scale` to shrink it onto a travelling packet or `labelSize()` to lay it out.
 */
export type BoxKey = 'oAddr' | 'oPort' | 'dAddr' | 'dPort' | 'proto';
export const BOX_KEYS: readonly BoxKey[] = ['oAddr', 'oPort', 'dAddr', 'dPort', 'proto'];
export type LabelValues = Partial<Record<BoxKey, string>>;

const ROW_H = 68;
const ROW_GAP = 10;
const PAD_X = 18;
const PAD_Y = 16;
const CAP_W = 150;
const ADDR_W = 290;
const PORT_W = 134;
const PROTO_W = 120;
const MID_GAP = 14;
const FONT_PX = 32;

export const LABEL_W = PAD_X * 2 + CAP_W + ADDR_W + 10 + PORT_W + MID_GAP + PROTO_W;
export const LABEL_H = PAD_Y * 2 + ROW_H * 2 + ROW_GAP;

/** Native size of the label for a given rewrite progress (0-1: the extra «nuevo origen» row opens). */
export function labelSize(rewrite = 0, scale = 1): { w: number; h: number } {
  const extra = (ROW_H + ROW_GAP) * progress(rewrite, 0, 1, EASE.inOut);
  return { w: LABEL_W * scale, h: (LABEL_H + extra) * scale };
}

/** Centre of one box in label-native coordinates (for pointers, glows and connectors). */
export function boxCenter(key: BoxKey, rewrite = 0): { x: number; y: number } {
  const extra = (ROW_H + ROW_GAP) * progress(rewrite, 0, 1, EASE.inOut);
  const xAddr = PAD_X + CAP_W + ADDR_W / 2;
  const xPort = PAD_X + CAP_W + ADDR_W + 10 + PORT_W / 2;
  const xProto = LABEL_W - PAD_X - PROTO_W / 2;
  const yO = PAD_Y + ROW_H / 2;
  const yD = PAD_Y + ROW_H + ROW_GAP + extra + ROW_H / 2;
  switch (key) {
    case 'oAddr':
      return { x: xAddr, y: yO };
    case 'oPort':
      return { x: xPort, y: yO };
    case 'dAddr':
      return { x: xAddr, y: yD };
    case 'dPort':
      return { x: xPort, y: yD };
    default:
      return { x: xProto, y: PAD_Y + (ROW_H * 2 + ROW_GAP + extra) / 2 };
  }
}

function Box({
  value,
  reveal,
  w,
  h,
  tone,
  glow,
  glass,
  struck,
  size = FONT_PX,
  rotate,
}: {
  value?: string;
  reveal: number;
  w: number;
  h: number;
  tone: Accent;
  glow: number;
  glass: number;
  struck?: number;
  size?: number;
  rotate?: number;
}) {
  const a = ACCENT[tone];
  const filled = reveal > 0 && !!value;
  return (
    <div
      style={{
        position: 'relative',
        width: w,
        height: h,
        boxSizing: 'border-box',
        borderRadius: RADIUS.sm,
        border: filled ? `2px solid ${alpha(a.fg, (0.55 + 0.4 * glow) * (1 - 0.5 * glass))}` : `2px dashed ${alpha(C.ink500, 0.8)}`,
        background: filled ? alpha(a.fg, (0.09 + 0.12 * glow) * (1 - glass)) : alpha(C.ink900, 0.6 * (1 - glass)),
        boxShadow: glow > 0.01 ? `0 0 ${Math.round(30 * glow)}px ${alpha(a.fg, 0.4 * glow)}` : undefined,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        flexShrink: 0,
      }}
    >
      {filled ? (
        <span
          style={{
            fontFamily: FONT.mono,
            fontSize: size,
            fontWeight: 700,
            color: C.textStrong,
            opacity: (1 - 0.45 * glass) * (1 - 0.55 * (struck ?? 0)),
            whiteSpace: 'nowrap',
            clipPath: `inset(-4px ${Math.round((1 - progress(reveal, 0, 1, EASE.linear)) * 100)}% -4px 0)`,
          }}
        >
          {value}
        </span>
      ) : null}
    </div>
  );
}

/** Hand-drawn strike line across the origin boxes. */
function Strike({ p, from, to, y }: { p: number; from: number; to: number; y: number }) {
  if (p <= 0) return null;
  const n = 14;
  let d = `M${from},${y + 3}`;
  for (let i = 1; i <= n; i++) {
    const x = from + ((to - from) * i) / n;
    d += ` L${x},${y + (i % 2 === 0 ? -5 : 5) - i * 0.4}`;
  }
  const len = (to - from) * 1.15;
  return (
    <svg width={LABEL_W} height={ROW_H * 3} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
      <path d={d} fill="none" stroke={C.amber} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${len} ${len}`} strokeDashoffset={len * (1 - p)} />
    </svg>
  );
}

export function Label({
  values,
  reveal = 1,
  scale = 1,
  strike = 0,
  rewrite,
  glass = 0,
  focus,
  tones,
  opacity = 1,
  style,
}: {
  /** Text of each box; a missing or empty one draws the empty dashed box (s02 shows the label empty). */
  values?: LabelValues;
  /** 0-1 per box (typed in), or one number for all. */
  reveal?: number | Partial<Record<BoxKey, number>>;
  scale?: number;
  /** 0-1: hand-drawn strike over the origin boxes (s08). */
  strike?: number;
  /** s08: the corrected origin, written by hand under the struck one; `p` 0-1 opens the row and types it. */
  rewrite?: { addr: string; port: string; p: number };
  /** 0-1: the label turns translucent so the packet's inside shows through (s06 «inside»). */
  glass?: number;
  /** Box to glow (the voice is on it). */
  focus?: BoxKey | readonly BoxKey[] | null;
  /** Accent per box (default cyan; color always travels with a caption elsewhere). */
  tones?: Partial<Record<BoxKey, Accent>>;
  opacity?: number;
  style?: CSSProperties;
}) {
  const rw = rewrite?.p ?? 0;
  const size = labelSize(rw);
  const extra = size.h - LABEL_H;
  const rev = (k: BoxKey) => (typeof reveal === 'number' ? reveal : (reveal[k] ?? 0));
  const foc = (k: BoxKey) => (focus === k || (Array.isArray(focus) && (focus as readonly BoxKey[]).includes(k)) ? 1 : 0);
  const tone = (k: BoxKey): Accent => tones?.[k] ?? 'cyan';
  const val = (k: BoxKey) => values?.[k];
  const cap: CSSProperties = {
    width: CAP_W,
    flexShrink: 0,
    fontFamily: FONT.sans,
    fontSize: 28,
    fontWeight: 650,
    letterSpacing: 0.3,
    color: C.muted,
  };
  const oy = PAD_Y + ROW_H / 2;
  const writeP = progress(rw, 0.35, 0.65, EASE.linear);
  return (
    <div style={{ width: size.w * scale, height: size.h * scale, opacity, ...style }}>
      <div
        style={{
          position: 'relative',
          width: LABEL_W,
          height: size.h,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          boxSizing: 'border-box',
          padding: `${PAD_Y}px ${PAD_X}px`,
          borderRadius: RADIUS.md,
          background: alpha('#1b2742', 0.96 * (1 - 0.82 * glass)),
          border: `2px solid ${alpha(C.ink500, 1 - 0.55 * glass)}`,
          boxShadow: glass > 0.5 ? 'none' : `0 14px 34px ${alpha('#000000', 0.4)}`,
        }}
      >
        {/* origin row */}
        <div style={{ display: 'flex', alignItems: 'center', height: ROW_H }}>
          <div style={cap}>origen</div>
          <Box value={val('oAddr')} reveal={rev('oAddr')} w={ADDR_W} h={ROW_H} tone={tone('oAddr')} glow={foc('oAddr')} glass={glass} struck={strike} />
          <div style={{ width: 10 }} />
          <Box value={val('oPort')} reveal={rev('oPort')} w={PORT_W} h={ROW_H} tone={tone('oPort')} glow={foc('oPort')} glass={glass} struck={strike} />
        </div>
        {/* corrected origin, handwritten (only while a rewrite is shown) */}
        {extra > 0.5 && rewrite ? (
          <div style={{ display: 'flex', alignItems: 'center', height: extra - ROW_GAP, marginTop: ROW_GAP, overflow: 'hidden', opacity: progress(rw, 0.1, 0.25) }}>
            <div style={{ width: CAP_W }} />
            <Box value={rewrite.addr} reveal={writeP} w={ADDR_W} h={ROW_H} tone="amber" glow={0.6} glass={0} rotate={-1.2} />
            <div style={{ width: 10 }} />
            <Box value={rewrite.port} reveal={writeP} w={PORT_W} h={ROW_H} tone="amber" glow={0.6} glass={0} rotate={0.8} />
          </div>
        ) : null}
        {/* destination row */}
        <div style={{ display: 'flex', alignItems: 'center', height: ROW_H, marginTop: ROW_GAP }}>
          <div style={cap}>destino</div>
          <Box value={val('dAddr')} reveal={rev('dAddr')} w={ADDR_W} h={ROW_H} tone={tone('dAddr')} glow={foc('dAddr')} glass={glass} />
          <div style={{ width: 10 }} />
          <Box value={val('dPort')} reveal={rev('dPort')} w={PORT_W} h={ROW_H} tone={tone('dPort')} glow={foc('dPort')} glass={glass} />
        </div>
        {/* the small fifth box: TCP / UDP, spanning both rows */}
        <div style={{ position: 'absolute', right: PAD_X, top: PAD_Y, height: ROW_H * 2 + ROW_GAP + extra }}>
          <Box value={val('proto')} reveal={rev('proto')} w={PROTO_W} h={ROW_H * 2 + ROW_GAP + extra} tone={tone('proto')} glow={foc('proto')} glass={glass} size={34} />
        </div>
        <Strike p={strike} from={PAD_X + CAP_W + 8} to={PAD_X + CAP_W + ADDR_W + 10 + PORT_W - 8} y={oy} />
      </div>
    </div>
  );
}
