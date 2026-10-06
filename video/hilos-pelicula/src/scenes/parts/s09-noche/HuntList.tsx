import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';

/** Layout of the list, px from its top-left. */
export const HUNT_LIST = { headH: 62, rowH: 64, box: 44, phaseW: 380, gap: 26 } as const;

/** The empty box of row `i`, px from the list's top-left (the morph lands each film frame here). */
export function huntListBox(i: number): { x: number; y: number; w: number; h: number; cx: number; cy: number } {
  const y = HUNT_LIST.headH + i * HUNT_LIST.rowH + (HUNT_LIST.rowH - HUNT_LIST.box) / 2;
  return { x: 0, y, w: HUNT_LIST.box, h: HUNT_LIST.box, cx: HUNT_LIST.box / 2, cy: y + HUNT_LIST.box / 2 };
}

/**
 * wrap-iv: «la película de Meridian acaba siendo una lista de cosas que buscar». One row per phase of Meridian's film,
 * each with an EMPTY box drawn in SVG — never ticked, never filled: there is no result in this video. The phase name
 * keeps the rail's rose (the attacker's activity); the line is s02's frame text.
 *
 * - `head`  0–1 the heading appears.
 * - `rows`  0–1 per row: its text arrives (the box is drawn by the morph landing, or by `boxes`).
 * - `boxes` 0–1 per row: the empty box's outline.
 */
export function HuntList({
  head,
  title,
  rows,
  rowIn,
  boxIn,
  width,
}: {
  head: number;
  title: string;
  rows: readonly { phase: string; what: string }[];
  rowIn: readonly number[];
  boxIn: readonly number[];
  width: number;
}) {
  const h = clamp01(head);
  return (
    <div style={{ position: 'relative', width, height: HUNT_LIST.headH + rows.length * HUNT_LIST.rowH, fontFamily: FONT.sans }}>
      <div style={{ position: 'absolute', left: 0, top: 0, fontSize: 40, fontWeight: 850, color: C.textStrong, letterSpacing: -0.5, opacity: h, transform: `translateY(${(1 - h) * 10}px)`, whiteSpace: 'nowrap' }}>
        {title}
      </div>
      {rows.map((r, i) => {
        const p = clamp01(rowIn[i] ?? 0);
        const b = clamp01(boxIn[i] ?? 0);
        const box = huntListBox(i);
        const top = HUNT_LIST.headH + i * HUNT_LIST.rowH;
        return (
          <div key={i}>
            {/* Row rule */}
            <div style={{ position: 'absolute', left: 0, top: top + HUNT_LIST.rowH - 1, width: width * p, height: 1, background: alpha(C.ink600, 0.7) }} />
            <svg width={box.w + 8} height={box.h + 8} style={{ position: 'absolute', left: box.x - 4, top: box.y - 4, overflow: 'visible', opacity: b }}>
              <rect x={4} y={4} width={box.w} height={box.h} rx={8} fill={alpha(C.ink850, 0.9)} stroke={alpha(C.cyanSoft, 0.85)} strokeWidth={3.5} />
            </svg>
            <div
              style={{
                position: 'absolute',
                left: box.w + HUNT_LIST.gap,
                top,
                height: HUNT_LIST.rowH,
                display: 'flex',
                alignItems: 'center',
                gap: 22,
                opacity: p,
                transform: `translateX(${(1 - p) * 16}px)`,
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ width: HUNT_LIST.phaseW, fontSize: 34, fontWeight: 800, color: C.roseSoft }}>{r.phase}</span>
              <span style={{ fontSize: 34, fontWeight: 650, color: C.text }}>{r.what}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
