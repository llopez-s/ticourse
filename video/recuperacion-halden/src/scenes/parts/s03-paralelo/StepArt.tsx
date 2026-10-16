import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01, tone as toneOf, type Tone } from '../../../../../engine/src/ui';
import { Theatre } from '../Theatre';
import { stepsLayout } from '../Steps';

/**
 * Small drawings on the front face of each step (shared by s03 and s04), placed with
 * `stepsLayout` so they sit right of the step's number and above its «toca producción» tag:
 *   1 a table with four people around it (talking the plan through)
 *   2 a bolt (a real scenario injected, production untouched)
 *   3 two tiny theatres giving the same show
 *   4 two tiny theatres and an arrow: the show moves to the other one
 * Each art mirrors its step's own weights so it fades and dims exactly like the step
 * (Steps: opacity = show × (1 − 0.58 × (1 − focus)), hidden under the «?» plate).
 * Render it inside a box of the same `width` × `height` as the Steps, at the same place.
 */

export interface StepArtView {
  show: number;
  focus: number;
  hidden?: number;
  tone?: Tone;
}

const FACE_PAD_X = 96; // right of the 60 px number
const TAG_BAND = 14 + 46 + 10; // the tag at the bottom of the face, plus air

function Table({ w, h, color, head }: { w: number; h: number; color: string; head: string }) {
  // a round table seen at an angle, with two heads behind and two in front
  const cx = w / 2;
  const cy = h * 0.58;
  const rx = w * 0.32;
  const ry = h * 0.2;
  const hr = Math.min(h * 0.14, 9);
  const heads = [
    { x: cx - rx * 0.55, y: cy - ry - hr * 0.7 },
    { x: cx + rx * 0.55, y: cy - ry - hr * 0.7 },
    { x: cx - rx - hr * 1.1, y: cy + 2 },
    { x: cx + rx + hr * 1.1, y: cy + 2 },
  ];
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', overflow: 'visible' }}>
      {heads.slice(0, 2).map((p, i) => (
        <g key={i}>
          <ellipse cx={p.x} cy={p.y + hr * 1.5} rx={hr * 1.3} ry={hr * 0.9} fill={C.ink950} stroke={head} strokeWidth={2} />
          <circle cx={p.x} cy={p.y} r={hr} fill={C.ink950} stroke={head} strokeWidth={2} />
        </g>
      ))}
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={alpha(color, 0.25)} stroke={color} strokeWidth={2.5} />
      {/* a sheet on the table: the plan */}
      <rect x={cx - 11} y={cy - 6} width={22} height={12} rx={2} fill={alpha('#f8fafc', 0.85)} transform={`rotate(-8 ${cx} ${cy})`} />
      {heads.slice(2).map((p, i) => (
        <g key={i}>
          <ellipse cx={p.x} cy={p.y + hr * 1.5} rx={hr * 1.3} ry={hr * 0.9} fill={C.ink950} stroke={head} strokeWidth={2} />
          <circle cx={p.x} cy={p.y} r={hr} fill={C.ink950} stroke={head} strokeWidth={2} />
        </g>
      ))}
    </svg>
  );
}

export function StepArt({ width, height, views }: { width: number; height: number; views: readonly (StepArtView | undefined)[] }) {
  const { columns } = stepsLayout(width, height);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width, height, pointerEvents: 'none' }}>
      {columns.map((col, i) => {
        const v = views[i];
        if (!v) return null;
        const show = clamp01(v.show);
        const focus = clamp01(v.focus);
        const hidden = clamp01(v.hidden ?? 0);
        const op = show * (1 - 0.58 * (1 - focus)) * (1 - hidden);
        if (op <= 0.001) return null;
        const t = toneOf(v.tone ?? 'cyan');
        const color = focus > 0.5 ? t.soft : C.muted;
        const faceW = col.w - 16;
        const x0 = FACE_PAD_X;
        const y0 = col.blockTop + 12;
        const boxW = faceW - x0 - 14;
        const boxH = col.bottom - TAG_BAND - y0;
        let art = null;
        if (i === 0) {
          const w = Math.min(150, boxW);
          art = (
            <div style={{ position: 'absolute', left: x0 + boxW - w, top: y0, width: w, height: boxH }}>
              <Table w={w} h={boxH} color={color} head={alpha(t.soft, 0.7)} />
            </div>
          );
        } else if (i === 1) {
          const s = Math.min(boxH, 76);
          art = (
            <div style={{ position: 'absolute', left: x0 + boxW - s - 20, top: y0 + (boxH - s) / 2 }}>
              <Icon name="bolt" size={s} color={color} strokeWidth={2.2} />
            </div>
          );
        } else {
          const tw = i === 2 ? 108 : 96;
          const gap = i === 2 ? 14 : 46;
          const left = x0 + boxW - (tw * 2 + gap);
          const top = y0 + Math.max(0, (boxH - tw * 0.68) / 2);
          art = (
            <div style={{ position: 'absolute', left, top }}>
              <div style={{ position: 'absolute', left: 0, top: 0 }}>
                <Theatre kind="hot" width={tw} tone={v.tone ?? 'cyan'} lit={i === 3 ? 0.35 : 1} />
              </div>
              <div style={{ position: 'absolute', left: tw + gap, top: 0 }}>
                <Theatre kind="hot" width={tw} tone={v.tone ?? 'cyan'} />
              </div>
              {i === 3 ? (
                <svg width={gap} height={tw * 0.68} style={{ position: 'absolute', left: tw, top: 0, overflow: 'visible' }}>
                  <path d={`M4,${tw * 0.4} L${gap - 10},${tw * 0.4}`} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
                  <path d={`M${gap - 18},${tw * 0.4 - 8} L${gap - 8},${tw * 0.4} L${gap - 18},${tw * 0.4 + 8}`} fill="none" stroke={color} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : null}
            </div>
          );
        }
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: col.x,
              top: 0,
              width: col.w,
              height,
              opacity: op,
              transform: `translateY(${(1 - show) * 24}px)`,
              filter: focus < 0.99 ? `saturate(${0.5 + 0.5 * focus})` : undefined,
            }}
          >
            {art}
          </div>
        );
      })}
    </div>
  );
}
