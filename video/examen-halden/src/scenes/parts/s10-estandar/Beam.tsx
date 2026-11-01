import { C, alpha } from '../../../../../engine/src/theme/tokens';

/** Native size of the beam drawing (stage-local 1728 wide). */
export const BEAM_ART = { w: 1728, h: 220, cx: 864, cy: 118, half: 600 } as const;

/**
 * The balance beam of s10: «práctica estándar» (cyan weights, left) against «ocurrencia» (dashed amber weight, right).
 * `show` 0–1 fades the whole beam in; `extra` 0–1 puts a second block on the left pile (the third row joins the standard);
 * `angle` is the tilt in degrees, positive = the LEFT end goes down. No text: the labels live in the scene.
 */
export function Beam({ show, extra, angle }: { show: number; extra: number; angle: number }) {
  const { w, h, cx, cy, half } = BEAM_ART;
  const t = 14;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: show }}>
      {/* pivot */}
      <path d={`M ${cx - 46} ${h - 14} L ${cx} ${cy + 6} L ${cx + 46} ${h - 14} Z`} fill={alpha(C.ink600, 0.9)} stroke={alpha(C.cyan, 0.45)} strokeWidth={3} strokeLinejoin="round" />
      <rect x={cx - 120} y={h - 16} width={240} height={10} rx={5} fill={alpha(C.ink600, 0.9)} />
      <g transform={`rotate(${-angle} ${cx} ${cy})`}>
        {/* beam */}
        <rect x={cx - half} y={cy - t / 2} width={half * 2} height={t} rx={t / 2} fill={C.ink500} stroke={alpha(C.textStrong, 0.5)} strokeWidth={2} />
        {/* left pile: the standard */}
        <rect x={cx - half + 60} y={cy - t / 2 - 64} width={150} height={64} rx={12} fill={alpha(C.cyan, 0.38)} stroke={C.cyan} strokeWidth={4} />
        <rect
          x={cx - half + 80}
          y={cy - t / 2 - 64 - 54 * extra}
          width={110}
          height={54}
          rx={12}
          fill={alpha(C.sky, 0.4)}
          stroke={C.sky}
          strokeWidth={4}
          opacity={extra}
        />
        {/* right: the trick (dashed, lighter) */}
        <rect x={cx + half - 210} y={cy - t / 2 - 64} width={150} height={64} rx={12} fill={alpha(C.amber, 0.12)} stroke={C.amber} strokeWidth={4} strokeDasharray="12 9" />
      </g>
    </svg>
  );
}
