import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/** The thread's own units: a cloud outline with the application window in front of it. */
export const APP = { w: 760, h: 520 } as const;

/** Cloud lobes (union drawn as one outline: stroked circles first, then the same circles filled on top). */
const LOBES: [number, number, number][] = [
  [205, 250, 118],
  [335, 168, 150],
  [505, 186, 128],
  [612, 268, 100],
];
export const WIN = { x: 130, y: 172, w: 500, h: 330 } as const;
const BAR_H = 46;
export const ROW_Y = [262, 344, 426];
const BOX = 40;

/** The cloud behind the window (sky outline): the application will live «en la nube». */
function CloudBack({ show }: { show: number }) {
  if (show <= 0.001) return null;
  const fill = C.ink900;
  return (
    <g opacity={show}>
      {LOBES.map(([x, y, r]) => (
        <circle key={`s${x}`} cx={x} cy={y} r={r} fill="none" stroke={alpha(C.sky, 0.75)} strokeWidth={6} />
      ))}
      <rect x={150} y={250} width={520} height={130} rx={60} fill="none" stroke={alpha(C.sky, 0.75)} strokeWidth={6} />
      {LOBES.map(([x, y, r]) => (
        <circle key={`f${x}`} cx={x} cy={y} r={r - 3} fill={fill} />
      ))}
      <rect x={153} y={253} width={514} height={124} rx={58} fill={fill} />
      {LOBES.map(([x, y, r]) => (
        <circle key={`g${x}`} cx={x} cy={y} r={r - 3} fill={alpha(C.sky, 0.07)} />
      ))}
    </g>
  );
}

/** An emerald tick inside a checkbox whose top-left is (x, y); `t` 0–1 draws it. */
function Tick({ x, y, t }: { x: number; y: number; t: number }) {
  const p = clamp01(t);
  if (p <= 0.001) return null;
  const len = 64;
  return (
    <path
      d={`M ${x + 8} ${y + 21} L ${x + 17} ${y + 31} L ${x + 34} ${y + 9}`}
      fill="none"
      stroke={C.emerald}
      strokeWidth={6}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={len}
      strokeDashoffset={len * (1 - p)}
    />
  );
}

/**
 * The port's new application (the video's thread): ONE empty window with no name (three dots and a blank name bar),
 * in front of a sky cloud, with three empty checkboxes. `labels` fill the rows with the three decisions (each shown
 * by its `labelOn` 0–1, a grey placeholder bar before); `ticks` 0–1 tick them (end card, poster). Never an eye, never
 * a product. Drawn in its own 760×520 units, scaled to `width`.
 */
export function AppWindow({
  width = APP.w,
  cloud = 1,
  labels,
  labelOn = [0, 0, 0],
  ticks = [0, 0, 0],
  glow = 0,
  lit = [0, 0, 0],
}: {
  width?: number;
  cloud?: number;
  labels?: readonly [string, string, string];
  labelOn?: readonly number[];
  ticks?: readonly number[];
  glow?: number;
  /** 0–1 per row: the row the voice is on. */
  lit?: readonly number[];
}) {
  const h = (width * APP.h) / APP.w;
  const g = clamp01(glow);
  return (
    <svg width={width} height={h} viewBox={`0 0 ${APP.w} ${APP.h}`} style={{ display: 'block', overflow: 'visible' }}>
      <CloudBack show={clamp01(cloud)} />
      <rect
        x={WIN.x}
        y={WIN.y}
        width={WIN.w}
        height={WIN.h}
        rx={22}
        fill={C.ink850}
        stroke={alpha(C.cyan, 0.55 + 0.4 * g)}
        strokeWidth={4}
        style={{ filter: g > 0.02 ? `drop-shadow(0 0 ${Math.round(18 * g)}px ${alpha(C.cyan, 0.45)})` : undefined }}
      />
      <path d={`M ${WIN.x + 2} ${WIN.y + BAR_H} L ${WIN.x + WIN.w - 2} ${WIN.y + BAR_H}`} stroke={alpha(C.cyan, 0.3)} strokeWidth={2} />
      {[0, 1, 2].map((k) => (
        <circle key={k} cx={WIN.x + 28 + k * 24} cy={WIN.y + BAR_H / 2} r={7} fill={alpha(C.muted, 0.55)} />
      ))}
      {/* Blank name bar: the application has no name. */}
      <rect x={WIN.x + 150} y={WIN.y + BAR_H / 2 - 8} width={200} height={16} rx={8} fill={alpha(C.muted, 0.22)} />
      {ROW_Y.map((y, i) => {
        const on = clamp01(labelOn[i] ?? 0);
        const l = clamp01(lit[i] ?? 0);
        const bx = WIN.x + 40;
        return (
          <g key={i}>
            {l > 0.01 ? <rect x={WIN.x + 22} y={y - BOX / 2 - 12} width={WIN.w - 44} height={BOX + 24} rx={14} fill={alpha(C.cyan, 0.1 * l)} stroke={alpha(C.cyan, 0.5 * l)} strokeWidth={2} /> : null}
            <rect x={bx} y={y - BOX / 2} width={BOX} height={BOX} rx={8} fill={C.ink900} stroke={alpha(C.cyan, 0.5 + 0.4 * l)} strokeWidth={4} />
            <Tick x={bx} y={y - BOX / 2} t={ticks[i] ?? 0} />
            <rect x={bx + 66} y={y - 9} width={i === 1 ? 230 : 280} height={18} rx={9} fill={alpha(C.muted, 0.2)} opacity={1 - on} />
            {labels ? (
              <text x={bx + 66} y={y + 13} fontFamily={FONT.sans} fontSize={38} fontWeight={800} fill={C.textStrong} opacity={on}>
                {labels[i]}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
