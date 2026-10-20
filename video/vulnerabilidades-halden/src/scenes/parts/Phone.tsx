import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/** The phone in its own units. */
export const PHONE = { w: 260, h: 480 } as const;
const SCREEN = { x: 16, y: 44, w: PHONE.w - 32, h: PHONE.h - 96 } as const;
const COLS = 3;
const ROWS = 4;
const TILE = 52;
const TILE_GAP_X = (SCREEN.w - COLS * TILE) / (COLS + 1);
const TILE_Y0 = SCREEN.y + 70;
const TILE_GAP_Y = 26;
/** App tile colours (no names, no logos). The last slot is empty until an app arrives from outside. */
const TILE_TONES = [C.cyan, C.sky, C.emerald, C.violet, C.cyan, C.sky, C.emerald, C.cyan, C.sky, C.violet, C.emerald];

/** Centre of tile slot `i` (0–11) in phone units; slot 11 is the free one. */
export function tileCenter(i: number): [number, number] {
  const c = i % COLS;
  const r = Math.floor(i / COLS);
  return [SCREEN.x + TILE_GAP_X + c * (TILE + TILE_GAP_X) + TILE / 2, TILE_Y0 + r * (TILE + TILE_GAP_Y) + TILE / 2];
}
export const FREE_SLOT = 11;

/**
 * A generic phone (no brand, no names): app tiles in a grid, each in its own cell — the dashed cell walls are the
 * isolation between apps. `arrived` 0–1 pops an amber app into the free slot (side loading) and `ping` 0–1 sends one
 * ring out from it. `isolation` 1→0 drops the cell walls (rooting). `alarm` 0–1 pulses one rose ring around the phone.
 * `notice` 0–1 shows a message notification at the top (bars only). `glow` lights the frame.
 */
export function Phone({
  width = PHONE.w,
  arrived = 0,
  ping = 0,
  isolation = 1,
  alarm = 0,
  notice = 0,
  glow = 0,
  tone = C.cyan,
}: {
  width?: number;
  arrived?: number;
  ping?: number;
  isolation?: number;
  alarm?: number;
  notice?: number;
  glow?: number;
  tone?: string;
}) {
  const h = (width * PHONE.h) / PHONE.w;
  const a = clamp01(arrived);
  const iso = clamp01(isolation);
  const al = clamp01(alarm);
  const pg = clamp01(ping);
  const n = clamp01(notice);
  const gl = clamp01(glow);
  const [fx, fy] = tileCenter(FREE_SLOT);
  const pop = a < 1 ? 0.4 + 0.6 * a + Math.sin(a * Math.PI) * 0.25 : 1;
  return (
    <svg width={width} height={h} viewBox={`0 0 ${PHONE.w} ${PHONE.h}`} style={{ display: 'block', overflow: 'visible' }}>
      {al > 0.01 && al < 1 ? <rect x={-14 - 30 * al} y={-14 - 30 * al} width={PHONE.w + 28 + 60 * al} height={PHONE.h + 28 + 60 * al} rx={50} fill="none" stroke={alpha(C.rose, 0.8 * (1 - al))} strokeWidth={6} /> : null}
      {gl > 0.02 ? <rect x={-10} y={-10} width={PHONE.w + 20} height={PHONE.h + 20} rx={44} fill={alpha(tone, 0.1 * gl)} /> : null}
      <rect x={0} y={0} width={PHONE.w} height={PHONE.h} rx={36} fill={C.ink850} stroke={alpha(tone, 0.5 + 0.4 * gl)} strokeWidth={5} />
      <rect x={SCREEN.x} y={SCREEN.y} width={SCREEN.w} height={SCREEN.h} rx={14} fill={C.ink950} />
      <rect x={PHONE.w / 2 - 34} y={18} width={68} height={10} rx={5} fill={alpha(C.text, 0.3)} />
      <rect x={PHONE.w / 2 - 40} y={PHONE.h - 34} width={80} height={8} rx={4} fill={alpha(C.text, 0.3)} />
      {/* status bar */}
      <rect x={SCREEN.x + 14} y={SCREEN.y + 14} width={40} height={10} rx={5} fill={alpha(C.text, 0.35)} />
      <rect x={SCREEN.x + SCREEN.w - 50} y={SCREEN.y + 14} width={36} height={10} rx={5} fill={alpha(C.text, 0.35)} />
      {/* the cells around each app: the isolation between apps */}
      {iso > 0.01
        ? Array.from({ length: COLS * ROWS }, (_, i) => {
            const [cx, cy] = tileCenter(i);
            return <rect key={i} x={cx - TILE / 2 - 9} y={cy - TILE / 2 - 9} width={TILE + 18} height={TILE + 18} rx={12} fill="none" stroke={alpha(C.emerald, 0.55 * iso)} strokeWidth={2.5} strokeDasharray="6 5" />;
          })
        : null}
      {TILE_TONES.map((t, i) => {
        const [cx, cy] = tileCenter(i);
        // Without isolation the apps drift towards each other a little.
        const dx = (1 - iso) * (cx < PHONE.w / 2 ? 5 : -5);
        return <rect key={i} x={cx - TILE / 2 + dx} y={cy - TILE / 2} width={TILE} height={TILE} rx={14} fill={alpha(t, 0.55)} stroke={alpha(t, 0.9)} strokeWidth={2} />;
      })}
      {/* the app from outside the store */}
      {a > 0.01 ? (
        <g transform={`translate(${fx} ${fy}) scale(${pop}) translate(${-fx} ${-fy})`} opacity={Math.min(1, a * 2)}>
          <rect x={fx - TILE / 2} y={fy - TILE / 2} width={TILE} height={TILE} rx={14} fill={alpha(C.amber, 0.7)} stroke={C.amber} strokeWidth={3} />
          <path d={`M ${fx} ${fy - 14} L ${fx} ${fy + 8} M ${fx - 9} ${fy} L ${fx} ${fy + 10} L ${fx + 9} ${fy}`} fill="none" stroke={C.ink950} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ) : null}
      {pg > 0.01 && pg < 1 ? <circle cx={fx} cy={fy} r={30 + 70 * pg} fill="none" stroke={alpha(C.amber, 0.85 * (1 - pg))} strokeWidth={5} /> : null}
      {/* a message notification: bars only */}
      {n > 0.01 ? (
        <g opacity={n} transform={`translate(0 ${(1 - n) * -16})`}>
          <rect x={SCREEN.x + 10} y={SCREEN.y + 34} width={SCREEN.w - 20} height={70} rx={14} fill={C.ink700} stroke={alpha(C.cyan, 0.6)} strokeWidth={2.5} />
          <rect x={SCREEN.x + 22} y={SCREEN.y + 48} width={42} height={42} rx={10} fill={alpha(C.cyan, 0.45)} />
          <rect x={SCREEN.x + 76} y={SCREEN.y + 52} width={100} height={11} rx={5} fill={alpha(C.text, 0.55)} />
          <rect x={SCREEN.x + 76} y={SCREEN.y + 72} width={120} height={9} rx={4} fill={alpha(C.text, 0.3)} />
        </g>
      ) : null}
    </svg>
  );
}
