import type { ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';
import { SIM, type SimTone } from '../Sim';

/**
 * The simulator's «voice line»: the strip over the nave (SIM.zone) where the live step is written, big,
 * one at a time — so the eye always knows which step is running. s04 adds a five-segment bar on top of
 * it (the lesson's five steps); s05 reuses the lines for the revocation. Pure; 0–1 props.
 */
const INK: Record<SimTone, string> = { plain: C.textStrong, cyan: C.cyanSoft, amber: '#fcd34d', rose: '#fda4af', emerald: '#6ee7b7' };
const EDGE: Record<SimTone, string> = { plain: '#cbd5e1', cyan: C.cyan, amber: C.amber, rose: C.rose, emerald: C.emerald };

export const ZONE_LINE = { main: 46, sub: 34, top: 20 } as const;

/** The zone's box; children are ZoneLines (they overlap and cross-fade) and, optionally, a StepBar. */
export function Zone({ children }: { children: ReactNode }) {
  return <div style={{ position: 'absolute', left: SIM.pane.x, top: SIM.zone.y, width: SIM.pane.w, height: SIM.zone.h, fontFamily: FONT.sans }}>{children}</div>;
}

/** Five segments: done ones stay cyan, the live one glows, the rest wait. `live` is 1-based (0 = none). */
export function StepBar({ count = 5, live, done, show = 1 }: { count?: number; live: number; done: number; show?: number }) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  const gap = 10;
  const w = (SIM.pane.w - gap * (count - 1)) / count;
  return (
    <div style={{ position: 'absolute', left: 0, top: 2, width: SIM.pane.w, height: 8, opacity: s }}>
      {Array.from({ length: count }, (_, i) => {
        const isLive = live === i + 1;
        const isDone = done > i;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: i * (w + gap),
              top: 0,
              width: w,
              height: 8,
              borderRadius: 4,
              background: isLive ? C.cyan : isDone ? alpha(C.cyan, 0.5) : alpha(C.ink500, 0.6),
              boxShadow: isLive ? `0 0 14px ${alpha(C.cyan, 0.7)}` : undefined,
            }}
          />
        );
      })}
    </div>
  );
}

/**
 * One line of the zone: an optional step number, the main text and an optional second line under it.
 * `show` 0–1 cross-fades it with its neighbours; `subShow` brings the second line in on its own.
 */
export function ZoneLine({
  show,
  n,
  main,
  mainShow = 1,
  sub,
  subShow = 1,
  tone = 'plain',
  mainSize = ZONE_LINE.main,
  subSize = ZONE_LINE.sub,
  dim = 0,
  top = ZONE_LINE.top,
}: {
  show: number;
  n?: number;
  main: ReactNode;
  /** 0–1 the main text on its own (a name that arrives after its line). */
  mainShow?: number;
  sub?: ReactNode;
  subShow?: number;
  tone?: SimTone;
  mainSize?: number;
  subSize?: number;
  dim?: number;
  top?: number;
}) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  const badge = Math.round(mainSize * 1.12);
  const ss = clamp01(subShow);
  const ms = clamp01(mainShow);
  return (
    <div style={{ position: 'absolute', left: 0, top, width: SIM.pane.w, opacity: s * (1 - 0.5 * clamp01(dim)), transform: `translateY(${(1 - s) * 8}px)`, whiteSpace: 'nowrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: Math.round(mainSize * 1.24), opacity: ms, transform: `translateY(${(1 - ms) * 6}px)` }}>
        {n ? (
          <span
            style={{
              width: badge,
              height: badge,
              flexShrink: 0,
              borderRadius: '50%',
              boxSizing: 'border-box',
              border: `3px solid ${C.cyan}`,
              background: alpha(C.cyan, 0.16),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONT.mono,
              fontSize: Math.round(mainSize * 0.72),
              fontWeight: 800,
              color: C.cyanSoft,
            }}
          >
            {n}
          </span>
        ) : null}
        <span style={{ fontSize: mainSize, fontWeight: 850, letterSpacing: -0.4, lineHeight: 1, color: INK[tone], textShadow: tone === 'plain' ? undefined : `0 0 22px ${alpha(EDGE[tone], 0.35)}` }}>{main}</span>
      </div>
      {sub ? (
        <div style={{ marginTop: 6, marginLeft: n ? badge + 16 : 0, height: Math.round(subSize * 1.25), display: 'flex', alignItems: 'center', fontSize: subSize, fontWeight: 750, lineHeight: 1, color: C.text, opacity: ss, transform: `translateY(${(1 - ss) * 6}px)` }}>
          {sub}
        </div>
      ) : null}
    </div>
  );
}
