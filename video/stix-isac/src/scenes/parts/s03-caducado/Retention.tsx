import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../../engine/src/theme/motion';
import { clamp01, dimStyle } from '../../../../../engine/src/ui';
import { DAYS, RETENTION } from '../../../data/s03-caducado';

/** Stage-local geometry of the timeline (the whole piece is drawn in stage coordinates). */
export const RT = {
  x0: 70,
  x1: 1658,
  railY: 236,
  seenTop: 168,
  edrY: 352,
  proxyY: 440,
  barH: 64,
} as const;

export function dayX(day: number): number {
  return RT.x0 + ((RT.x1 - RT.x0) * day) / DAYS.total;
}

export interface RetentionTiming {
  /** The playhead starts at today and runs back; the rail draws behind it. */
  rewindAt: number;
  /** The EDR bar reaches back to 03-04. */
  edrAt: number;
  /** The proxy bar reaches back only to 02-06 (grey). */
  proxyAt: number;
  /** The reachable stretch (EDR over the seen days) lights up. */
  reachAt: number;
  /** Everything steps back for the closing line. */
  dimAt: number;
}

/** A call-log glyph on the playhead: a handset and three list lines (the «registro» that runs backwards). */
function LogGlyph({ color }: { color: string }) {
  return (
    <svg width={56} height={56} viewBox="0 0 28 28" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
      <rect x="2.5" y="2.5" width="23" height="23" rx="5" fill={alpha(C.ink900, 0.95)} />
      <path d="M7.4 7h1.8l.9 2.6-1.3.9c.6 1.4 1.5 2.4 2.9 2.9l.9-1.3 2.6.9v1.8c0 .6-.5 1.2-1.2 1.2C10 16 6.2 12.2 6.2 8.2c0-.7.5-1.2 1.2-1.2z" />
      <path d="M17 8h5M17 12h5M8 20h14" />
    </svg>
  );
}

/**
 * Retention vs. the days the domain was seen: rail 27-02 (registration) to
 * 02-07 (today), the seen stretch 27-02 to 18-04 shaded rose, and Meridian's
 * two log windows counted back from today — «EDR · 90 días · desde el 03-04»
 * (emerald, it reaches the end of the stretch) and «proxy · 30 días · desde
 * el 02-06 · ya no llega» (grey). A playhead with a call-log glyph runs from
 * today back to the registration, drawing the rail as it goes. No results.
 */
export function RetentionTimeline({ frame, t, opacity = 1 }: { frame: number; t: RetentionTiming; opacity?: number }) {
  if (opacity <= 0 || frame < t.rewindAt - 4) return null;
  const rewind = progress(frame, t.rewindAt, 54, EASE.inOut);
  const headX = dayX(DAYS.total * (1 - rewind));
  const headOn = progress(frame, t.rewindAt - 4, 8) * (1 - progress(frame, t.rewindAt + 58, 14));
  // The seen stretch fills behind the playhead, from 18-04 back to 27-02.
  const seenLeft = Math.max(dayX(0), Math.min(headX, dayX(DAYS.seenEnd)));
  const edr = progress(frame, t.edrAt, 26, EASE.inOut);
  const proxy = progress(frame, t.proxyAt, 22, EASE.inOut);
  const reach = progress(frame, t.reachAt, 18);
  const dim = progress(frame, t.dimAt, 18, EASE.inOut);

  const xSeen = dayX(DAYS.seenEnd);
  const xEdr = dayX(DAYS.edrFrom);
  const xProxy = dayX(DAYS.proxyFrom);
  const xEnd = dayX(DAYS.total);
  const edrLeft = xEnd - (xEnd - xEdr) * edr;
  const proxyLeft = xEnd - (xEnd - xProxy) * proxy;
  const labelIn = (p: number) => clamp01((p - 0.6) / 0.4);

  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1728, height: 660, opacity, fontFamily: FONT.sans, ...dimStyle(0.75 * dim) }}>
      <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {/* Seen stretch (the domain alive in passive DNS) */}
        {xSeen - seenLeft > 1 ? (
          <rect x={seenLeft} y={RT.seenTop} width={xSeen - seenLeft} height={RT.railY - RT.seenTop} rx={8} fill={alpha(C.rose, 0.22)} stroke={alpha(C.rose, 0.7)} strokeWidth={2} />
        ) : null}
        {/* Reachable: the seen days the EDR still covers (on the stretch and on the bar) */}
        {reach > 0 ? (
          <rect x={xEdr} y={RT.seenTop - 6} width={xSeen - xEdr} height={RT.railY - RT.seenTop + 6} rx={8} fill={alpha(C.emerald, 0.32 * reach)} stroke={alpha(C.emerald, 0.95 * reach)} strokeWidth={4} />
        ) : null}
        {/* Rail: drawn behind the playhead, from today back */}
        <line x1={headX} y1={RT.railY} x2={xEnd} y2={RT.railY} stroke={C.muted} strokeWidth={5} strokeLinecap="round" />
        {[0, DAYS.seenEnd, DAYS.total].map((d) =>
          dayX(d) >= headX - 1 ? <line key={d} x1={dayX(d)} y1={RT.railY - 14} x2={dayX(d)} y2={RT.railY + 14} stroke={C.text} strokeWidth={4} strokeLinecap="round" /> : null,
        )}
        {/* Guide at the end of the stretch: which window still reaches it */}
        {edr > 0 ? (
          <line x1={xSeen} y1={RT.railY + 62} x2={xSeen} y2={RT.edrY + RT.barH + 10} stroke={alpha(C.roseSoft, 0.75 * edr)} strokeWidth={3} strokeDasharray="10 10" />
        ) : null}
        {/* EDR bar */}
        {edr > 0 ? <rect x={edrLeft} y={RT.edrY} width={xEnd - edrLeft} height={RT.barH} rx={12} fill={alpha(C.emerald, 0.24)} stroke={C.emerald} strokeWidth={3} /> : null}
        {reach > 0 ? <rect x={xEdr} y={RT.edrY} width={xSeen - xEdr} height={RT.barH} rx={12} fill={alpha(C.emerald, 0.4 * reach)} stroke={alpha(C.emerald, reach)} strokeWidth={4} /> : null}
        {/* Proxy bar (grey: does not reach) */}
        {proxy > 0 ? <rect x={proxyLeft} y={RT.proxyY} width={xEnd - proxyLeft} height={RT.barH} rx={12} fill={alpha(C.muted, 0.18)} stroke={alpha(C.muted, 0.85)} strokeWidth={3} /> : null}
        {/* Playhead */}
        {headOn > 0 ? (
          <g opacity={headOn}>
            <line x1={headX} y1={RT.seenTop - 30} x2={headX} y2={RT.proxyY + RT.barH} stroke={C.cyan} strokeWidth={4} />
            <polygon points={`${headX - 4},${RT.railY} ${headX + 14},${RT.railY - 11} ${headX + 14},${RT.railY + 11}`} fill={C.cyan} />
          </g>
        ) : null}
      </svg>
      {headOn > 0 ? (
        <div style={{ position: 'absolute', left: headX - 28, top: RT.seenTop - 92, opacity: headOn }}>
          <LogGlyph color={C.cyan} />
        </div>
      ) : null}

      {/* Dates under the rail */}
      <DateLabel x={dayX(0)} align="left" text={RETENTION.start} show={progress(frame, t.rewindAt + 48, 12)} />
      <div style={{ position: 'absolute', left: dayX(0), top: RT.railY + 62, fontSize: 30, fontWeight: 650, color: C.muted, whiteSpace: 'nowrap', opacity: progress(frame, t.rewindAt + 52, 12) }}>{RETENTION.startNote}</div>
      <DateLabel x={xSeen} align="center" text={RETENTION.seenEnd} show={progress(frame, t.rewindAt + 36, 12)} color={C.roseSoft} />
      <DateLabel x={xEnd} align="right" text={RETENTION.end} show={progress(frame, t.rewindAt, 12)} color={C.cyanSoft} />

      {/* Bar labels */}
      {edr > 0 ? (
        <div style={{ position: 'absolute', left: xSeen + 24, top: RT.edrY, height: RT.barH, display: 'flex', alignItems: 'center', fontSize: 34, fontWeight: 800, color: '#a7f3d0', whiteSpace: 'nowrap', opacity: labelIn(edr) }}>
          {RETENTION.edr}
        </div>
      ) : null}
      {proxy > 0 ? (
        <div style={{ position: 'absolute', right: 1728 - xProxy + 22, top: RT.proxyY, height: RT.barH, display: 'flex', alignItems: 'center', fontSize: 34, fontWeight: 750, color: C.muted, whiteSpace: 'nowrap', opacity: labelIn(proxy) }}>
          {RETENTION.proxy}
        </div>
      ) : null}
    </div>
  );
}

function DateLabel({ x, align, text, show, color = C.text }: { x: number; align: 'left' | 'center' | 'right'; text: string; show: number; color?: string }) {
  if (show <= 0) return null;
  const w = 200;
  const left = align === 'left' ? x : align === 'right' ? x - w : x - w / 2;
  return (
    <div style={{ position: 'absolute', left, top: RT.railY + 20, width: w, textAlign: align, fontFamily: FONT.mono, fontSize: 34, fontWeight: 800, color, opacity: show }}>
      {text}
    </div>
  );
}
