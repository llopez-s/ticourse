import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { Icon } from '../../../../engine/src/ui';
import { hash01 } from './timing';

/**
 * An abstract map of districts: rounded blocks with a few tiny buildings, no
 * names, no real city. A `line` crosses a district from edge to edge; the
 * district marked `gap` has none and is drawn as a hole (dashed amber).
 */
export function Neighbourhoods({
  width,
  height,
  cols,
  rows = 1,
  gutter = 18,
  line = [],
  gap = -1,
  gapLabel,
  opacity = 1,
  seed = 1,
}: {
  width: number;
  height: number;
  cols: number;
  rows?: number;
  gutter?: number;
  /** Per district: 0–1 progress of its line (0 = none yet). Missing entries mean no line. */
  line?: readonly number[];
  /** Index of the district drawn as a gap (-1 for none). */
  gap?: number;
  gapLabel?: string;
  opacity?: number;
  seed?: number;
}) {
  const w = (width - gutter * (cols - 1)) / cols;
  const h = (height - gutter * (rows - 1)) / rows;
  return (
    <div style={{ position: 'relative', width, height, opacity, fontFamily: FONT.sans }}>
      {Array.from({ length: cols * rows }, (_, i) => {
        const cx = i % cols;
        const cy = Math.floor(i / cols);
        const x = cx * (w + gutter);
        const y = cy * (h + gutter);
        const isGap = i === gap;
        const draw = line[i] ?? 0;
        const cells = Array.from({ length: 6 }, (_, k) => ({
          x: 8 + hash01(seed * 100 + i * 10 + k) * (w - 30),
          y: 8 + hash01(seed * 100 + i * 10 + k + 50) * (h - 30),
          s: 8 + Math.round(hash01(seed * 100 + i * 10 + k + 90) * 10),
        }));
        return (
          <div key={i} style={{ position: 'absolute', left: x, top: y, width: w, height: h }}>
            <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', overflow: 'visible' }} aria-hidden>
              <rect
                x="1.5"
                y="1.5"
                width={w - 3}
                height={h - 3}
                rx="16"
                fill={alpha(isGap ? C.amber : C.ink700, isGap ? 0.07 : 0.55)}
                stroke={isGap ? C.amber : C.ink600}
                strokeWidth="3"
                strokeDasharray={isGap ? '10 9' : undefined}
              />
              {cells.map((c, k) => (
                <rect key={k} x={c.x} y={c.y} width={c.s} height={c.s} rx="2" fill={alpha(isGap ? C.amber : C.ink500, 0.55)} />
              ))}
              {draw > 0 ? (
                <>
                  <path
                    d={`M10 ${h * 0.55} C ${w * 0.3} ${h * 0.2}, ${w * 0.65} ${h * 0.9}, ${w - 10} ${h * 0.45}`}
                    fill="none"
                    stroke={C.cyan}
                    strokeWidth="6"
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray="1 1"
                    strokeDashoffset={1 - draw}
                  />
                  <circle cx="10" cy={h * 0.55} r="7" fill={C.ink950} stroke={C.cyan} strokeWidth="4" opacity={Math.min(1, draw * 3)} />
                  <circle cx={w - 10} cy={h * 0.45} r="7" fill={C.ink950} stroke={C.cyan} strokeWidth="4" opacity={draw >= 1 ? 1 : 0} />
                </>
              ) : null}
            </svg>
            {isGap ? (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  fontSize: 32,
                  fontWeight: 800,
                  color: C.amber,
                }}
              >
                <Icon name="alert" size={34} color={C.amber} />
                {gapLabel}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
