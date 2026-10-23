import { C, FONT, RADIUS, STAGE, alpha } from '../../../../engine/src/theme/tokens';
import { mix } from '../../../../engine/src/ui';
import { LockIcon, SatelliteIcon, StormIcon, WindowWatcherIcon } from './Icons';

/**
 * The two dials of s09, stacked: «probabilidad · del evento» (cyan: the seven ICD 203 bands on a
 * 0–100 bar, with the forecast's «70 % de lluvia») and «confianza · de tu base» (green: baja ·
 * moderada · alta, with three levers and, at the ends, the satellite and the person at the window).
 * `c` folds both rows into their compact form (the question phase); everything else is a 0–1 weight
 * the scene drives from its cues. Nothing here reads the timeline.
 */

const W = STAGE.width;
const PCT = [
  { a: 1, b: 5 },
  { a: 5, b: 20 },
  { a: 20, b: 45 },
  { a: 45, b: 55 },
  { a: 55, b: 80 },
  { a: 80, b: 95 },
  { a: 95, b: 99 },
] as const;
const LIKELY = 4;
const LEVERS = ['fuentes', 'evidencia', 'razonamiento'] as const;
const SEGS = ['baja', 'moderada', 'alta'] as const;

export interface DialsState {
  /** Where the container sits (stage y) and how folded it is (0 full, 1 compact). */
  top: number;
  c: number;
  gap: number;
  /** Labels and tracks lit (the rows are ghosts before). */
  labels: number;
  /** The 70 % pointer and its «de lluvia» callout. */
  probPtr: number;
  /** The 55–80 % band highlighted. */
  probBand: number;
  /** The confidence track's segments, one lit weight each (baja, moderada, alta). */
  seg: [number, number, number];
  /** The confidence pointer: visibility and position along the track (0–1). */
  confPtr: number;
  confPos: number;
  /** One weight per lever (fuentes, evidencia, razonamiento) and the knobs' position (0 low, 1 high). */
  levers: [number, number, number];
  leverPos: number;
  /** The window watcher and the satellite. */
  imgs: [number, number];
  /** The padlock between the rows. */
  lock: number;
  /** Frame for the little animations (rain). */
  frame: number;
}

const sizes = (c: number) => ({
  h1: mix(190, 118, c),
  h2: mix(238, 128, c),
  labelW: mix(430, 330, c),
  main: mix(54, 34, c),
  sub: mix(40, 26, c),
});

export function dialsHeight(s: Pick<DialsState, 'c' | 'gap'>): number {
  const z = sizes(s.c);
  return z.h1 + s.gap + z.h2;
}

export function Dials(s: DialsState) {
  const z = sizes(s.c);
  const trackX = z.labelW + 20;
  const trackW = W - trackX - 24;
  const ghost = 0.3 + 0.7 * s.labels;
  const row2Top = z.h1 + s.gap;

  // ---- Probability bar.
  const barTop = mix(76, 28, s.c);
  const barH = mix(74, 46, s.c);
  const xOfPct = (v: number) => trackX + (v / 100) * trackW;
  const ptrX = xOfPct(70);
  const calloutIn = s.probPtr * (1 - s.c);

  // ---- Confidence track.
  const segTop = mix(46, 26, s.c);
  const segH = mix(64, 50, s.c);
  const segW = mix(660, 900, s.c);
  const segX = trackX;
  const posX = segX + s.confPos * segW;

  return (
    <div style={{ position: 'absolute', left: 0, top: s.top, width: W, height: z.h1 + s.gap + z.h2, fontFamily: FONT.sans }}>
      {/* ---- Row 1: probability */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: z.h1, boxSizing: 'border-box', borderRadius: RADIUS.lg, border: `3px solid ${alpha(C.cyan, 0.25 + 0.4 * s.labels)}`, background: `linear-gradient(90deg, ${alpha(C.cyan, 0.06 + 0.06 * s.labels)} 0%, ${alpha(C.ink900, 0.94)} 45%)`, opacity: ghost }}>
        <div style={{ position: 'absolute', left: 30, top: 0, bottom: 0, width: z.labelW - 30, display: 'flex', flexDirection: 'column', justifyContent: 'center', opacity: s.labels }}>
          <div style={{ fontSize: z.main, fontWeight: 850, color: C.textStrong, lineHeight: 1.05, whiteSpace: 'nowrap' }}>probabilidad</div>
          <div style={{ fontSize: z.sub, fontWeight: 700, color: C.cyanSoft, lineHeight: 1.15, whiteSpace: 'nowrap' }}>del evento</div>
        </div>
        {/* the bar: the seven bands, proportional */}
        <svg width={W} height={z.h1} viewBox={`0 0 ${W} ${z.h1}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          {PCT.map((p, i) => {
            const on = i === LIKELY ? s.probBand : 0;
            const base = 0.14 + i * 0.045;
            return (
              <rect key={i} x={xOfPct(p.a) + 1} y={barTop} width={Math.max(3, xOfPct(p.b) - xOfPct(p.a) - 2)} height={barH} rx={6} fill={alpha(C.cyan, base + 0.7 * on)} stroke={alpha(C.cyan, 0.35 + 0.65 * on)} strokeWidth={2 + 2 * on} />
            );
          })}
          {s.c < 0.5 ? (
            <>
              <text x={xOfPct(1)} y={barTop + barH + 30} fontFamily={FONT.sans} fontSize={28} fontWeight={800} fill={C.faint} opacity={(1 - s.c * 2) * s.labels}>0</text>
              <text x={xOfPct(99)} y={barTop + barH + 30} textAnchor="end" fontFamily={FONT.sans} fontSize={28} fontWeight={800} fill={C.faint} opacity={(1 - s.c * 2) * s.labels}>100</text>
            </>
          ) : null}
          {s.probPtr > 0.01 ? (
            <g opacity={s.probPtr}>
              <line x1={ptrX} y1={barTop - 6} x2={ptrX} y2={barTop + barH + 6} stroke={C.textStrong} strokeWidth={5} strokeLinecap="round" />
              <path d={`M${ptrX - 13} ${barTop - 22} L${ptrX + 13} ${barTop - 22} L${ptrX} ${barTop - 4} Z`} fill={C.textStrong} />
            </g>
          ) : null}
        </svg>
        {/* the band's own label, once lit */}
        {s.probBand > 0.05 ? (
          <div style={{ position: 'absolute', left: xOfPct(55), top: barTop, width: xOfPct(80) - xOfPct(55), height: barH, display: 'grid', placeItems: 'center', fontSize: mix(40, 30, s.c), fontWeight: 900, color: C.ink950, opacity: s.probBand, whiteSpace: 'nowrap' }}>55–80 %</div>
        ) : null}
        {/* «70 % de lluvia» */}
        {calloutIn > 0.01 ? (
          <div style={{ position: 'absolute', left: ptrX - 150, top: barTop - 70, width: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: calloutIn, transform: `translateY(${(1 - calloutIn) * 10}px)` }}>
            <StormIcon size={64} variant="warning" tone={C.sky} rain={s.frame} />
            <span style={{ fontSize: 40, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>70 % <span style={{ color: C.sky }}>de lluvia</span></span>
          </div>
        ) : null}
      </div>

      {/* ---- Lock between the rows */}
      {s.lock > 0.01 ? (
        <div style={{ position: 'absolute', left: W / 2 - 40, top: z.h1 + s.gap / 2 - 40, opacity: s.lock, transform: `scale(${0.8 + 0.2 * s.lock})` }}>
          <LockIcon size={80} tone={C.amber} />
        </div>
      ) : null}

      {/* ---- Row 2: confidence */}
      <div style={{ position: 'absolute', left: 0, top: row2Top, width: W, height: z.h2, boxSizing: 'border-box', borderRadius: RADIUS.lg, border: `3px solid ${alpha(C.emerald, 0.25 + 0.4 * s.labels)}`, background: `linear-gradient(90deg, ${alpha(C.emerald, 0.06 + 0.06 * s.labels)} 0%, ${alpha(C.ink900, 0.94)} 45%)`, opacity: ghost }}>
        <div style={{ position: 'absolute', left: 30, top: 0, bottom: 0, width: z.labelW - 30, display: 'flex', flexDirection: 'column', justifyContent: 'center', opacity: s.labels }}>
          <div style={{ fontSize: z.main, fontWeight: 850, color: C.textStrong, lineHeight: 1.05, whiteSpace: 'nowrap' }}>confianza</div>
          <div style={{ fontSize: z.sub, fontWeight: 700, color: '#6ee7b7', lineHeight: 1.15, whiteSpace: 'nowrap' }}>de tu base</div>
        </div>
        {/* baja · moderada · alta */}
        {SEGS.map((name, i) => {
          const on = s.seg[i];
          return (
            <div key={name} style={{ position: 'absolute', left: segX + (i * segW) / 3 + 2, top: segTop, width: segW / 3 - 4, height: segH, boxSizing: 'border-box', display: 'grid', placeItems: 'center', borderRadius: RADIUS.md, border: `3px solid ${alpha(C.emerald, 0.35 + 0.6 * on)}`, background: alpha(C.emerald, 0.08 + 0.12 * i / 2 + 0.55 * on), fontSize: mix(40, 32, s.c), fontWeight: 850, color: on > 0.55 ? C.ink950 : C.textStrong, boxShadow: on > 0.05 ? `0 0 ${Math.round(26 * on)}px ${alpha(C.emerald, 0.35 * on)}` : undefined }}>
              {name}
            </div>
          );
        })}
        {s.confPtr > 0.01 ? (
          <svg width={W} height={z.h2} viewBox={`0 0 ${W} ${z.h2}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: s.confPtr }}>
            <path d={`M${posX - 13} ${segTop - 20} L${posX + 13} ${segTop - 20} L${posX} ${segTop - 3} Z`} fill={C.textStrong} />
            <line x1={posX} y1={segTop - 2} x2={posX} y2={segTop + segH + 4} stroke={C.textStrong} strokeWidth={5} strokeLinecap="round" />
          </svg>
        ) : null}
        {/* the satellite and the person at the window */}
        {s.c < 0.6 ? (
          <>
            <div style={{ position: 'absolute', left: segX, top: segTop + segH + 14, display: 'flex', alignItems: 'center', gap: 12, opacity: s.imgs[0] * (1 - s.c * 1.6) }}>
              <WindowWatcherIcon size={86} tone={C.amber} />
              <span style={{ fontSize: 28, fontWeight: 700, color: C.text, lineHeight: 1.15, width: 220 }}>alguien mira por la ventana</span>
            </div>
            <div style={{ position: 'absolute', left: segX + segW - 300, top: segTop + segH + 14, width: 300, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, opacity: s.imgs[1] * (1 - s.c * 1.6) }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: C.text, lineHeight: 1.15 }}>un satélite</span>
              <SatelliteIcon size={86} tone={C.emerald} />
            </div>
          </>
        ) : null}
        {/* the three levers */}
        {s.c < 0.6 ? (
          <div style={{ position: 'absolute', left: segX + segW + 56, top: 22, width: W - (segX + segW + 56) - 36, opacity: 1 - s.c * 1.6 }}>
            {LEVERS.map((name, i) => {
              const on = s.levers[i];
              const knob = 0.12 + 0.76 * s.leverPos;
              return (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 20, height: 62, opacity: on, transform: `translateX(${(1 - on) * 18}px)` }}>
                  <div style={{ width: 210, fontSize: 36, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap' }}>{name}</div>
                  <div style={{ position: 'relative', flex: 1, height: 14, borderRadius: 7, background: C.ink600 }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, height: 14, width: `${knob * 100}%`, borderRadius: 7, background: alpha(C.emerald, 0.55) }} />
                    <div style={{ position: 'absolute', left: `calc(${knob * 100}% - 18px)`, top: -11, width: 36, height: 36, borderRadius: 18, background: C.ink950, border: `4px solid ${C.emerald}`, boxShadow: `0 0 14px ${alpha(C.emerald, 0.4)}` }} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
