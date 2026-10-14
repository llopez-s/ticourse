import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { S05_DEFENSE, S05_QUESTION, S05_WHO } from '../../../data/s05-decision';

const SKY_SOFT = '#7dd3fc';
const VIOLET_SOFT = '#c4b5fd';

/** A column card: a title in the column's tone and its content. */
function Column({ width, height, tone, soft, title, show, glow = 0, children }: { width: number; height: number; tone: string; soft: string; title: string; show: number; glow?: number; children: ReactNode }) {
  if (show <= 0.001) return null;
  return (
    <div
      style={{
        width,
        height,
        boxSizing: 'border-box',
        padding: '18px 24px 20px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(tone, 0.6 + 0.3 * glow)}`,
        background: `linear-gradient(180deg, ${alpha(tone, 0.12)} 0%, ${alpha(C.ink900, 0.97)} 46%), ${C.ink900}`,
        boxShadow: `0 0 ${Math.round(30 * glow)}px ${alpha(tone, 0.3 * glow)}, 0 20px 50px ${alpha('#000000', 0.45)}`,
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
        opacity: show,
        transform: `translateY(${(1 - show) * 16}px)`,
      }}
    >
      <div style={{ paddingBottom: 10, marginBottom: 14, borderBottom: `2px solid ${alpha(tone, 0.4)}`, fontSize: 34, fontWeight: 850, lineHeight: 1.12, color: soft }}>{title}</div>
      {children}
    </div>
  );
}

/**
 * Column 1, «a quién le sirve el país» (sky: decisions made beyond your network). `items[i]` 0–1 files each
 * line; `said` 0–1 lights the first one (the voice only names governments).
 */
export function WhoColumn({ width, height, show = 1, items, said = 0 }: { width: number; height: number; show?: number; items: readonly number[]; said?: number }) {
  return (
    <Column width={width} height={height} tone={C.sky} soft={SKY_SOFT} title={S05_WHO.title} show={show} glow={said}>
      {S05_WHO.items.map((it, i) => {
        const on = items[i] ?? 0;
        return (
          <div key={it.lines[0]} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginTop: i ? 12 : 0, opacity: on, transform: `translateX(${(1 - on) * -12}px)` }}>
            <span style={{ flexShrink: 0, width: 12, height: 12, marginTop: 16, borderRadius: 6, background: C.sky }} />
            <div>
              {it.lines.map((line) => (
                <div key={line} style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.16, letterSpacing: -0.3, color: C.textStrong }}>
                  {line}
                </div>
              ))}
              {'aside' in it ? <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.18, letterSpacing: -0.2, color: SKY_SOFT }}>{it.aside}</div> : null}
            </div>
          </div>
        );
      })}
    </Column>
  );
}

/**
 * Column 2, «qué cambia en tu defensa» (cyan: your network): what you do, and that it rarely changes with
 * the country. `what` / `rarely` 0–1 write the two halves; `said` 0–1 stresses «rara vez cambian».
 */
export function DefenseColumn({ width, height, show = 1, what = 1, rarely = 1, said = 0 }: { width: number; height: number; show?: number; what?: number; rarely?: number; said?: number }) {
  return (
    <Column width={width} height={height} tone={C.cyan} soft={C.cyanSoft} title={S05_DEFENSE.title} show={show} glow={said}>
      <div style={{ fontSize: 37, fontWeight: 850, lineHeight: 1.16, letterSpacing: -0.4, color: C.textStrong, opacity: what, transform: `translateX(${(1 - what) * -12}px)` }}>{S05_DEFENSE.what}</div>
      <div style={{ marginTop: 22, opacity: rarely, transform: `translateX(${(1 - rarely) * -12}px)` }}>
        <div style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.1, letterSpacing: -0.8, color: C.cyanSoft, textShadow: said > 0.02 ? `0 0 ${Math.round(22 * said)}px ${alpha(C.cyan, 0.6 * said)}` : undefined }}>{S05_DEFENSE.rarely}</div>
        <div style={{ fontSize: 44, fontWeight: 800, lineHeight: 1.14, letterSpacing: -0.4, color: C.textStrong }}>{S05_DEFENSE.with}</div>
      </div>
    </Column>
  );
}

/**
 * «¿qué decisión cambia con el nombre?», hung between the two columns: `width` is the span of both, `gap`
 * the space above the strip, where a dotted tie comes down from each column.
 */
export function DecisionQuestion({ width, gap, show = 1, glow = 0 }: { width: number; gap: number; show?: number; glow?: number }) {
  if (show <= 0.001) return null;
  const mid = width / 2;
  return (
    <div style={{ position: 'relative', width, paddingTop: gap, opacity: show, fontFamily: FONT.sans }}>
      <svg width={width} height={gap} style={{ position: 'absolute', left: 0, top: 0 }}>
        {[width * 0.25, width * 0.75].map((x) => (
          <path key={x} d={`M ${x} 2 V ${gap / 2} H ${mid} V ${gap - 2}`} fill="none" stroke={alpha(VIOLET_SOFT, 0.85)} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 10" />
        ))}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', transform: `translateY(${(1 - show) * 12}px)` }}>
        <div style={{ padding: '10px 36px 13px', borderRadius: RADIUS.md, border: `2px solid ${alpha(C.violet, 0.7)}`, background: alpha('#1a1033', 0.94), boxShadow: glow > 0.02 ? `0 0 ${Math.round(32 * glow)}px ${alpha(C.violet, 0.5 * glow)}` : undefined, fontSize: 46, fontWeight: 900, letterSpacing: -0.6, lineHeight: 1.1, color: C.textStrong, whiteSpace: 'nowrap' }}>
          {S05_QUESTION}
        </div>
      </div>
    </div>
  );
}
