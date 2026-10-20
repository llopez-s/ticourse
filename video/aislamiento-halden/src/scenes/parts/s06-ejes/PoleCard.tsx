import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01, type IconName } from '../../../../../engine/src/ui';

/** One line of a pole card; `con` lines are amber (the price of that pole). */
export interface PoleLine {
  text: string;
  show: number;
  con?: boolean;
  /** Rose flash 0–1 (the `down` line). */
  alarm?: number;
}

/**
 * One end of an axis in s06's grid: the exam term (violet, or plain for «NUBE»), its icon and four short lines, lit on
 * their words; an optional diagram on the right. `dim` 0–1 steps it back when the voice moves to the other axis.
 */
export function PoleCard({
  x,
  y,
  w,
  h,
  title,
  icon,
  tone,
  lines,
  show,
  dim = 0,
  diagram,
  diagramW = 0,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  icon: IconName;
  tone: string;
  lines: PoleLine[];
  show: number;
  dim?: number;
  diagram?: ReactNode;
  diagramW?: number;
}) {
  const s = clamp01(show);
  const d = clamp01(dim);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        boxSizing: 'border-box',
        padding: '9px 22px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(tone, 0.35 + 0.4 * (1 - d))}`,
        background: alpha(C.ink850, 0.92),
        boxShadow: d < 0.5 ? `0 0 26px ${alpha(tone, 0.14 * (1 - d))}` : undefined,
        fontFamily: FONT.sans,
        opacity: s * (1 - 0.5 * d),
        transform: `translateY(${(1 - s) * 14}px)`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 34, fontWeight: 900, color: '#c4b5fd', whiteSpace: 'nowrap', letterSpacing: 0.5 }}>
        <Icon name={icon} size={34} color={tone} />
        {title}
      </div>
      <div style={{ marginTop: 3, display: 'flex', flexDirection: 'column', gap: 0 }}>
        {lines.map((l, k) => {
          const a = clamp01(l.alarm ?? 0);
          return (
            <div
              key={k}
              style={{
                fontSize: 32,
                lineHeight: 1.08,
                fontWeight: 720,
                whiteSpace: 'nowrap',
                color: a > 0.5 ? C.roseSoft : l.con ? '#fcd34d' : C.textStrong,
                opacity: 0.18 + 0.82 * clamp01(l.show),
                textShadow: a > 0.01 ? `0 0 ${Math.round(16 * a)}px ${alpha(C.rose, 0.7 * a)}` : undefined,
              }}
            >
              {l.text}
            </div>
          );
        })}
      </div>
      {diagram ? <div style={{ position: 'absolute', right: 18, top: 12, bottom: 12, width: diagramW, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{diagram}</div> : null}
    </div>
  );
}
