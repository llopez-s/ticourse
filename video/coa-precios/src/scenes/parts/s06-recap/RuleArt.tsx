import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../../engine/src/theme/motion';
import { mix, windowWeight } from '../../../../../engine/src/ui';
import { SINGLE, TODAY } from '../../../data/s06-recap';
import type { CellId, PhaseId } from '../../../data/matrix';
import { MatrixThumb } from '../Matrix';
import { AlarmBox, CameraGlyph, Cassette } from '../Shop';

/**
 * The drawings of rules 1 and 2: the video's own images, small (rule 3's is WalkieArt.tsx). Every frame
 * is local to the scene's Sequence; nothing here reads the timeline.
 */

/** The art slot the cards give these drawings (px). */
export const ART_W = 514;
export const ART_H = 236;

export const shown = (frame: number, at: number) => Math.min(1, 0.35 + progress(frame, at - 4, 18, EASE.inOut));

// ---------------------------------------------------------------------------
// Rule 1: yesterday's tape (DISCOVER looks back) and the alarm with its live camera (DETECT looks
// forward), on each side of s02's «hoy».

const AXIS = { y: 208, left: 34, right: 480, cx: 257, pill: { w: 84, h: 40 } } as const;

export function LookArt({ frame, fps, at, rewindAt, ringAt }: { frame: number; fps: number; at: number; /** «atrás» */ rewindAt: number; /** «Detect» */ ringAt: number }) {
  const rw = progress(frame, rewindAt, 46, EASE.inOut);
  const rewinding = windowWeight(frame, rewindAt, rewindAt + 44, { ramp: 8 });
  const back = progress(frame, rewindAt, 18, EASE.inOut);
  const fwd = progress(frame, ringAt + 4, 18, EASE.inOut);
  const ring = windowWeight(frame, ringAt, ringAt + 40, { ramp: 8 });
  const half = AXIS.pill.w / 2 + 8;
  const { y } = AXIS;
  return (
    <div style={{ position: 'relative', width: ART_W, height: ART_H, opacity: shown(frame, at) }}>
      <svg width={ART_W} height={ART_H} viewBox={`0 0 ${ART_W} ${ART_H}`} style={{ display: 'block', overflow: 'visible' }}>
        <Cassette x={150} y={106} w={188} on={1} spin={-1100 * rw} wound={mix(0.22, 0.9, rw)} rewind={rewinding} label={1} />
        <AlarmBox cx={322} cy={100} size={90} on={1} ring={ring} phase={frame / fps} />
        <CameraGlyph x={410} y={136} size={98} on={1} live={1} phase={frame / fps} />
        {/* the time line: solid behind us, dashed ahead; arrowheads are drawn, never text */}
        <path d={`M${AXIS.left + 16} ${y} H${AXIS.cx - half}`} stroke={alpha(C.faint, 0.5)} strokeWidth={3} />
        <path d={`M${AXIS.cx + half} ${y} H${AXIS.right - 16}`} stroke={alpha(C.faint, 0.5)} strokeWidth={3} strokeDasharray="9 10" />
        <path d={`M${AXIS.cx - half} ${y} H${mix(AXIS.cx - half, AXIS.left + 18, back)}`} stroke={C.cyan} strokeWidth={5} strokeLinecap="round" opacity={back > 0.02 ? 1 : 0} />
        <path d={`M${AXIS.cx + half} ${y} H${mix(AXIS.cx + half, AXIS.right - 18, fwd)}`} stroke={C.cyan} strokeWidth={5} strokeLinecap="round" strokeDasharray="13 10" opacity={fwd > 0.02 ? 1 : 0} />
        <path d={`M${AXIS.left} ${y} l22 -12 v24 Z`} fill={back > 0.9 ? C.cyan : alpha(C.faint, 0.7)} />
        <path d={`M${AXIS.right} ${y} l-22 -12 v24 Z`} fill={fwd > 0.9 ? C.cyan : alpha(C.faint, 0.7)} />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: AXIS.cx - AXIS.pill.w / 2,
          top: y - AXIS.pill.h / 2,
          width: AXIS.pill.w,
          height: AXIS.pill.h,
          boxSizing: 'border-box',
          display: 'grid',
          placeItems: 'center',
          borderRadius: 12,
          border: `2px solid ${C.textStrong}`,
          background: C.ink900,
          fontFamily: FONT.sans,
          fontSize: 26,
          lineHeight: 1,
          fontWeight: 900,
          color: C.textStrong,
        }}
      >
        {TODAY}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Rule 2: the matrix, close on a row left with a single cell (amber: a single point of failure). On
// «Pon varias» its other cells come back.

const THUMB = { left: 64, top: 6, w: 450, h: 224 } as const;
const FADE = 'linear-gradient(180deg, #000 0%, #000 74%, transparent 100%)';

export function SingleRowArt({ frame, at, severalAt }: { frame: number; at: number; /** «Pon varias» */ severalAt: number }) {
  const several = progress(frame, severalAt, 20, EASE.inOut);
  const single = 1 - several;
  const rows: Partial<Record<PhaseId, { dim?: number; warn?: number }>> = { exploitation: { dim: 0.6 * single }, installation: { dim: 0.6 * single }, c2: { dim: 0.6 * single }, aoo: { dim: 0.6 * single } };
  rows[SINGLE.phase] = { warn: single };
  const cells: Partial<Record<CellId, { show?: number; lit?: number; tone?: 'cyan' | 'emerald' | 'amber' }>> = {};
  cells[SINGLE.keep] = { lit: single, tone: 'amber' };
  for (const id of SINGLE.back) cells[id] = { show: several };
  return (
    <div style={{ position: 'relative', width: ART_W, height: ART_H, opacity: shown(frame, at) }}>
      <div style={{ position: 'absolute', left: THUMB.left, top: THUMB.top, width: THUMB.w, height: THUMB.h, overflow: 'hidden', maskImage: FADE, WebkitMaskImage: FADE }}>
        <MatrixThumb width={THUMB.w} rows={rows} cells={cells} />
      </div>
    </div>
  );
}
