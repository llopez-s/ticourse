import { useMemo } from 'react';
import { C, FONT, TYPE, alpha } from '../../../theme/tokens';
import { EASE, fadeIn, progress, pulse, springIn } from '../../../theme/motion';
import { Chip, Panel } from '../../../ui';
import { BASELINE_FROM, BASELINE_TO, OUTLIER, TODAY_NOW_H, UBA_ACTIVITY, UBA_DAYS, UBA_HOURS } from '../../../data/s09-pivot';

/** Body-local geometry (the panel header is 64 px + borders). Days run left→right, hours top→bottom. */
const GRID_X = 112;
const GRID_TOP = 34;
const COL_P = 32;
const ROW_P = 15.5;
const CELL_W = COL_P - 4;
const CELL_H = ROW_P - 3.5;
const GRID_W = UBA_DAYS * COL_P;
const GRID_H = UBA_HOURS * ROW_P;
const GRID_R = GRID_X + GRID_W;
/** Left edge of the annotation column. */
const NOTE_X = GRID_R + 72;
const LEVELS = [
  { min: 0.01, max: 0.55, a: 0.32 },
  { min: 0.55, max: 0.8, a: 0.58 },
  { min: 0.8, max: 1.01, a: 0.9 },
];

function rectPath(x: number, y: number, w: number, h: number): string {
  return `M${x.toFixed(1)},${y.toFixed(1)}h${w.toFixed(1)}v${h.toFixed(1)}h${(-w).toFixed(1)}Z`;
}

const cellX = (d: number) => GRID_X + d * COL_P;
const cellY = (h: number) => GRID_TOP + h * ROW_P;

/**
 * UBA view of svc_tosreport across the whole stage: 30 days (left→right, today
 * last) × 24 hours (top→bottom). Normal activity lives only in the weekday
 * report hours (dashed baseline band); today's 01:xx cell is the rose outlier
 * "fuera de su línea base". The right column annotates both, and at `ubaAt`
 * names what watches for this: el análisis de comportamiento de usuarios (UBA).
 */
export function UbaHeatmap({
  frame,
  fps,
  at,
  outlierAt,
  baselineAt,
  ubaAt,
  acronymAt,
  width,
  height,
}: {
  frame: number;
  fps: number;
  at: number;
  outlierAt: number;
  baselineAt: number;
  ubaAt: number;
  acronymAt: number;
  width: number;
  height: number;
}) {
  const innerW = width - 4;
  const bodyH = height - 70;

  // Static geometry: one path for the empty grid, one for today's hours still to come, one per activity level.
  const paths = useMemo(() => {
    let empty = '';
    let future = '';
    const levels = LEVELS.map(() => '');
    for (let d = 0; d < UBA_DAYS; d++) {
      for (let h = 0; h < UBA_HOURS; h++) {
        if (d === OUTLIER.day && h === OUTLIER.hour) continue;
        const p = rectPath(cellX(d), cellY(h), CELL_W, CELL_H);
        if (d === OUTLIER.day && h >= TODAY_NOW_H) {
          future += p;
          continue;
        }
        const v = UBA_ACTIVITY[d][h];
        const li = LEVELS.findIndex((l) => v >= l.min && v < l.max);
        if (li < 0) empty += p;
        else levels[li] += p;
      }
    }
    return { empty, future, levels };
  }, []);

  const sweep = progress(frame, at, 20, EASE.inOut);
  const axes = fadeIn(frame, at + 4, 12);
  const out = springIn(frame, fps, outlierAt);
  const outFade = progress(frame, outlierAt, 8);
  const ring = pulse(frame - outlierAt, fps, 0.8);
  const outNote = progress(frame, outlierAt + 6, 14);
  const box = fadeIn(frame, baselineAt, 12);
  const boxNote = progress(frame, baselineAt + 4, 14);
  const term = progress(frame, ubaAt, 16);
  const acronym = springIn(frame, fps, acronymAt);
  // Steady (not pulsing) halo: the panel spans the whole stage, so animating it every frame would be heavy.
  const glow = progress(frame, ubaAt, 12) * 0.6;

  const ox = cellX(OUTLIER.day);
  const oy = cellY(OUTLIER.hour);
  const outMidY = oy + CELL_H / 2;
  const bandTop = cellY(BASELINE_FROM);
  const bandBottom = cellY(BASELINE_TO) - 3.5;
  // The baseline note sits level with the top of the band; its leader meets the band there.
  const bandNoteY = bandTop + 21;
  const clipId = 's09-uba-sweep';

  return (
    <Panel
      title="svc_tosreport · actividad por hora · últimos 30 días"
      icon="user"
      accent="cyan"
      glow={glow}
      right={
        <Chip accent="muted" icon="gear" size={TYPE.small}>
          cuenta de servicio
        </Chip>
      }
      style={{ width, height, boxSizing: 'border-box' }}
    >
      <svg width={innerW} height={bodyH} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <clipPath id={clipId}>
            <rect x={0} y={0} width={GRID_X + (GRID_W + 4) * sweep} height={bodyH} />
          </clipPath>
        </defs>

        {/* Hour axis (left) */}
        <g opacity={axes}>
          {[0, 6, 12, 18, 24].map((h) => (
            <text
              key={h}
              x={GRID_X - 16}
              y={cellY(h) + (h === 0 ? 14 : h === 24 ? -4 : 7)}
              textAnchor="end"
              fontFamily={FONT.mono}
              fontSize={TYPE.micro}
              fill={C.faint}
            >
              {`${String(h).padStart(2, '0')}h`}
            </text>
          ))}
        </g>

        {/* Cells, revealed day by day up to today */}
        <g clipPath={`url(#${clipId})`}>
          <path d={paths.empty} fill={alpha(C.ink700, 0.55)} />
          <path d={paths.future} fill={alpha(C.ink700, 0.22)} />
          {paths.levels.map((d, i) => (
            <path key={i} d={d} fill={alpha(C.cyan, LEVELS[i].a)} />
          ))}
        </g>

        {/* Baseline band: weekday report hours, 08-18 h */}
        <g opacity={box}>
          <rect
            x={GRID_X - 7}
            y={bandTop - 6}
            width={GRID_W + 10}
            height={bandBottom - bandTop + 12}
            rx={10}
            fill="none"
            stroke={alpha(C.cyanSoft, 0.8)}
            strokeWidth={3}
            strokeDasharray="10 8"
          />
          <line
            x1={GRID_R + 10}
            x2={GRID_R + 10 + (NOTE_X - GRID_R - 22) * boxNote}
            y1={bandNoteY}
            y2={bandNoteY}
            stroke={alpha(C.cyanSoft, 0.8)}
            strokeWidth={3}
            strokeDasharray="8 6"
          />
        </g>

        {/* Outlier: today, 01:xx */}
        {outFade > 0 ? (
          <g opacity={outFade}>
            <rect
              x={ox - 8 - 5 * ring}
              y={oy - 8 - 5 * ring}
              width={CELL_W + 16 + 10 * ring}
              height={CELL_H + 16 + 10 * ring}
              rx={9}
              fill="none"
              stroke={alpha(C.rose, 0.3 + 0.4 * (1 - ring))}
              strokeWidth={3}
            />
            <rect
              x={ox + CELL_W / 2 - (CELL_W / 2) * (0.5 + 0.5 * out)}
              y={oy + CELL_H / 2 - (CELL_H / 2) * (0.5 + 0.5 * out)}
              width={CELL_W * (0.5 + 0.5 * out)}
              height={CELL_H * (0.5 + 0.5 * out)}
              rx={3}
              fill={C.rose}
            />
            <line
              x1={GRID_R + 14}
              x2={GRID_R + 14 + (NOTE_X - GRID_R - 26) * outNote}
              y1={outMidY}
              y2={outMidY}
              stroke={C.rose}
              strokeWidth={3}
            />
          </g>
        ) : null}
      </svg>

      {/* Day axis (bottom) */}
      <div
        style={{
          position: 'absolute',
          left: GRID_X,
          top: GRID_TOP + GRID_H + 14,
          width: GRID_W,
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: FONT.sans,
          fontSize: TYPE.small,
          fontWeight: 600,
          color: C.faint,
          opacity: axes,
          whiteSpace: 'nowrap',
        }}
      >
        <span>hace 30 días</span>
        <span style={{ color: outFade > 0.5 ? C.roseSoft : C.faint, fontWeight: 750, marginRight: -4 }}>hoy</span>
      </div>

      {/* Note 1: the outlier, level with its row. */}
      <div
        style={{
          position: 'absolute',
          left: NOTE_X,
          top: outMidY - 24,
          opacity: outNote,
          transform: `translateX(${(1 - outNote) * 14}px)`,
          fontFamily: FONT.sans,
          whiteSpace: 'nowrap',
        }}
      >
        <div style={{ fontFamily: FONT.mono, fontSize: TYPE.label, fontWeight: 800, color: C.roseSoft, lineHeight: 1.5 }}>{OUTLIER.label}</div>
        <div style={{ fontSize: TYPE.h3 - 6, fontWeight: 850, color: C.textStrong, lineHeight: 1.1, letterSpacing: -0.4 }}>
          fuera de su <span style={{ color: C.roseSoft }}>línea base</span>
        </div>
      </div>

      {/* Note 2: the baseline band, level with its top. */}
      <div
        style={{
          position: 'absolute',
          left: NOTE_X,
          top: bandNoteY - 22,
          display: 'flex',
          gap: 16,
          alignItems: 'flex-start',
          opacity: boxNote,
          transform: `translateX(${(1 - boxNote) * 14}px)`,
          fontFamily: FONT.sans,
          whiteSpace: 'nowrap',
        }}
      >
        <span
          style={{
            width: 28,
            height: 28,
            marginTop: 8,
            borderRadius: 6,
            border: `2px dashed ${C.cyanSoft}`,
            background: alpha(C.cyan, 0.45),
            flexShrink: 0,
          }}
        />
        <div>
          <div style={{ fontSize: TYPE.label, fontWeight: 800, color: C.textStrong, lineHeight: 1.35 }}>línea base</div>
          <div style={{ fontSize: TYPE.small, fontWeight: 600, color: C.muted, lineHeight: 1.35 }}>informes, lunes a viernes 08-18 h</div>
        </div>
      </div>

      {/* Note 3: what watches for this. */}
      <div
        style={{
          position: 'absolute',
          left: NOTE_X - 24,
          right: 28,
          top: bandNoteY + 104,
          padding: '16px 24px 18px',
          borderRadius: 18,
          border: `2px solid ${alpha(C.cyan, 0.25 + 0.45 * term)}`,
          background: alpha(C.cyan, 0.08 * term),
          opacity: term,
          transform: `translateY(${(1 - term) * 14}px)`,
          fontFamily: FONT.sans,
        }}
      >
        <div style={{ fontSize: TYPE.label, fontWeight: 750, color: C.text, lineHeight: 1.3 }}>
          análisis de comportamiento
          <br />
          de usuarios
        </div>
        <div
          style={{
            marginTop: 12,
            transform: `scale(${0.6 + 0.4 * acronym})`,
            transformOrigin: 'left center',
            opacity: Math.min(1, acronym * 1.4),
          }}
        >
          <Chip accent="cyan" icon="brain" solid size={TYPE.label}>
            UBA
          </Chip>
        </div>
      </div>
    </Panel>
  );
}
