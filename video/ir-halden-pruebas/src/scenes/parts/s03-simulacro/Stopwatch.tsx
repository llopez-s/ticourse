import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../../engine/src/theme/motion';
import { clamp01 } from '../../../../../engine/src/ui';
import { STOP_MINUTES, minutesLabel } from '../../../data/s03-simulacro';

/**
 * s03's minutes stopwatch: starts at `startAt` (22:00), its hand sweeps
 * steadily, the readout counts whole minutes, and at `stopAt` it freezes on
 * «11 min» and turns emerald. Frames are Sequence-relative. Never shows a
 * clock time: only «N min».
 */
export function Stopwatch({ frame, fps, size = 360, startAt, stopAt }: { frame: number; fps: number; size?: number; startAt: number; stopAt: number }) {
  const R = 150;
  const run = Math.max(1, stopAt - startAt);
  const t = Math.min(frame, stopAt) - startAt;
  const minutes = frame < startAt ? 0 : Math.min(STOP_MINUTES, Math.floor((STOP_MINUTES * t) / run));
  const shown = frame >= stopAt ? STOP_MINUTES : minutes;
  // One sweep every 2 s while it runs (it suggests time passing, it is not a real second hand).
  const angle = t > 0 ? (360 * t) / (2 * fps) : 0;
  const stop = progress(frame, stopAt, 14, EASE.out);
  const edge = stop > 0.01 ? C.emerald : C.amber;
  const click = clamp01(1 - Math.abs(frame - stopAt) / 6);
  const rad = (d: number) => (d * Math.PI) / 180;
  return (
    <div style={{ position: 'relative', width: size, height: size * 1.12 + 6 + size * 0.28, fontFamily: FONT.sans }}>
      <svg width={size} height={size * 1.12} viewBox={`${-R - 30} ${-R - 70} ${2 * R + 60} ${(2 * R + 60) * 1.12}`} style={{ display: 'block', overflow: 'visible' }}>
        {/* Crown and side button (pressed on stop) */}
        <rect x={-22} y={-R - 50 + 8 * click} width={44} height={28} rx={6} fill={C.ink500} />
        <rect x={-10} y={-R - 24} width={20} height={20} fill={C.ink600} />
        <line x1={R * 0.72} y1={-R * 0.72} x2={R * 0.86} y2={-R * 0.86} stroke={C.ink500} strokeWidth={16} strokeLinecap="round" />
        {/* Dial */}
        <circle r={R} fill={C.ink850} stroke={alpha(edge, 0.9)} strokeWidth={10} style={{ filter: `drop-shadow(0 0 ${Math.round(8 + 18 * stop)}px ${alpha(edge, 0.3 + 0.3 * stop)})` }} />
        {Array.from({ length: 60 }, (_, i) => {
          const a = rad(i * 6);
          const major = i % 5 === 0;
          const r0 = major ? R - 26 : R - 16;
          return <line key={i} x1={Math.sin(a) * r0} y1={-Math.cos(a) * r0} x2={Math.sin(a) * (R - 8)} y2={-Math.cos(a) * (R - 8)} stroke={major ? C.text : C.ink500} strokeWidth={major ? 4 : 2} strokeLinecap="round" />;
        })}
        {/* Elapsed arc */}
        {t > 0 ? (
          <circle r={R - 40} fill="none" stroke={alpha(edge, 0.25)} strokeWidth={10} pathLength={1} strokeDasharray={`${clamp01(t / run)} 1`} transform="rotate(-90)" />
        ) : null}
        <line x1={0} y1={14} x2={Math.sin(rad(angle)) * (R - 34)} y2={-Math.cos(rad(angle)) * (R - 34)} stroke={edge} strokeWidth={7} strokeLinecap="round" />
        <circle r={12} fill={edge} />
      </svg>
      {/* Readout, under the dial */}
      <div style={{ position: 'absolute', left: 0, top: size * 1.12 + 6, width: size, display: 'flex', justifyContent: 'center', opacity: frame >= startAt - 4 ? 1 : 0.35 }}>
        <div
          style={{
            padding: '6px 30px',
            borderRadius: 999,
            border: `3px solid ${alpha(edge, 0.8)}`,
            background: alpha(edge, 0.1 + 0.08 * stop),
            boxShadow: stop > 0.01 ? `0 0 ${Math.round(30 * stop)}px ${alpha(C.emerald, 0.45 * stop)}` : undefined,
            fontFamily: FONT.mono,
            fontSize: Math.round(size * 0.18),
            fontWeight: 800,
            color: stop > 0.01 ? '#6ee7b7' : C.textStrong,
            whiteSpace: 'nowrap',
          }}
        >
          {minutesLabel(shown)}
        </div>
      </div>
    </div>
  );
}
