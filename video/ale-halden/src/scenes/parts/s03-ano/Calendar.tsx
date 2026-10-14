import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, progress, springIn } from '../../../../../engine/src/theme/motion';
import { MARKED_YEARS, MARKS_LABEL, YEARS, YEARS_LABEL } from '../../../data/s03-ano';
import { Phone } from '../Phone';

export const SQ = 112;
export const SQ_GAP = 30;
export const ROW_W = YEARS * SQ + (YEARS - 1) * SQ_GAP;

/**
 * The ten-year calendar: ten squares, one per year, drawn left to right from `yearsAt`; five are then marked at
 * uneven positions (each on its own frame in `marksAt`) with a cracked phone, and the label under the row passes
 * from «10 años» to «esperados, no fijos» (amber: an estimate, not a schedule).
 */
export function Calendar({
  frame,
  yearsAt,
  marksAt,
  labelAt,
  fps = 30,
}: {
  frame: number;
  yearsAt: number;
  marksAt: number[];
  labelAt: number;
  fps?: number;
}) {
  const swap = progress(frame, labelAt, 14, EASE.inOut);
  return (
    <div style={{ position: 'relative', width: ROW_W, height: SQ + 62 }}>
      {Array.from({ length: YEARS }, (_, i) => {
        const inAt = yearsAt + i * 3;
        const p = progress(frame, inAt, 14);
        const k = (MARKED_YEARS as readonly number[]).indexOf(i);
        const marked = k >= 0;
        const m = marked ? springIn(frame, fps, marksAt[k], { damping: 14 }) : 0;
        const mm = Math.min(1, m);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: i * (SQ + SQ_GAP),
              top: 0,
              width: SQ,
              height: SQ,
              boxSizing: 'border-box',
              borderRadius: 18,
              border: `3px solid ${marked && mm > 0.02 ? alpha(C.rose, 0.35 + 0.65 * mm) : C.ink500}`,
              background: marked && mm > 0.02 ? alpha(C.roseDeep, 0.15 + 0.55 * mm) : C.ink850,
              boxShadow: marked && mm > 0.05 ? `0 0 ${Math.round(26 * mm)}px ${alpha(C.rose, 0.3 * mm)}` : undefined,
              opacity: p,
              transform: `translateY(${(1 - p) * 18}px)`,
            }}
          >
            <span
              style={{
                position: 'absolute',
                left: 12,
                top: 8,
                fontFamily: FONT.mono,
                fontSize: 26,
                fontWeight: 700,
                color: marked && mm > 0.5 ? '#fda4af' : C.muted,
              }}
            >
              {i + 1}
            </span>
            {marked && mm > 0.02 ? (
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 22,
                  transform: `translateX(-50%) scale(${0.5 + 0.5 * Math.min(1.1, m)})`,
                  transformOrigin: 'center',
                  opacity: Math.min(1, mm * 1.5),
                }}
              >
                <Phone width={36} crack={progress(frame, marksAt[k] + 4, 14)} />
              </div>
            ) : null}
          </div>
        );
      })}
      {/* The label under the row */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: SQ + 16,
          width: ROW_W,
          height: 40,
          textAlign: 'center',
          fontFamily: FONT.sans,
          fontSize: 32,
          fontWeight: 700,
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ position: 'absolute', left: 0, right: 0, color: C.muted, opacity: progress(frame, yearsAt + 18, 14) * (1 - swap) }}>
          {YEARS_LABEL}
        </span>
        <span
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            color: C.amber,
            opacity: swap,
            transform: `translateY(${(1 - swap) * 8}px)`,
          }}
        >
          {MARKS_LABEL}
        </span>
      </div>
    </div>
  );
}
