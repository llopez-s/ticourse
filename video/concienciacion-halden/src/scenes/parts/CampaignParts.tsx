import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01, type IconName } from '../../../../engine/src/ui';

export const LURE_W = 800;
export const LURE_H = 188;

/**
 * The lure of the simulated campaign: a mail with no sender and no address — only the invented subject «la nueva
 * aplicación del comedor: entra con tu usuario» — and an amber «señuelo» tag. Nothing here is a real app, a link or a
 * form; `on` 0–1 brings it up.
 */
export function LureCard({ on = 1 }: { on?: number }) {
  const o = clamp01(on);
  return (
    <div
      style={{
        width: LURE_W,
        height: LURE_H,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        background: C.ink850,
        border: `3px solid ${alpha(C.amber, 0.45 + 0.4 * o)}`,
        boxShadow: `0 0 ${Math.round(26 * o)}px ${alpha(C.amber, 0.18 * o)}`,
        overflow: 'hidden',
        fontFamily: FONT.sans,
      }}
    >
      <div style={{ height: 46, display: 'flex', alignItems: 'center', gap: 10, padding: '0 20px', background: alpha(C.amber, 0.08), borderBottom: `2px solid ${alpha(C.amber, 0.25)}` }}>
        {[C.rose, C.amber, C.emerald].map((c) => (
          <div key={c} style={{ width: 13, height: 13, borderRadius: 7, background: alpha(c, 0.55) }} />
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 26, fontWeight: 800, color: C.amber, letterSpacing: 1 }}>
          <Icon name="bell" size={24} color={C.amber} />
          señuelo
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 26, padding: '22px 30px' }}>
        <Icon name="mail" size={78} color={C.amber} />
        <div style={{ fontSize: 40, fontWeight: 850, lineHeight: 1.18, color: C.textStrong, whiteSpace: 'nowrap' }}>
          <div>la nueva aplicación del comedor:</div>
          <div style={{ color: C.cyanSoft }}>entra con tu usuario</div>
        </div>
      </div>
    </div>
  );
}

export const COUNTER_W = 420;
export const COUNTER_H = 256;

/**
 * One of the two counters (invented figures, screen only): `pican` / click rate in amber, `avisan` / report rate in
 * cyan. Ten person-dots show the figure (`lit` of them filled, counted up by the scene); `hl` 0–1 raises the card for
 * the metric to push up. The second card also carries «el primero a los 4 minutos».
 */
export function CounterCard({
  kind,
  lit,
  show = 1,
  hl = 0,
  dimmed = 0,
  up = 0,
}: {
  kind: 'click' | 'report';
  lit: number;
  show?: number;
  hl?: number;
  dimmed?: number;
  /** 0–1: the green «subir» arrow next to the figure. */
  up?: number;
}) {
  const tone = kind === 'click' ? C.amber : C.cyan;
  const o = clamp01(show);
  const h = clamp01(hl);
  const d = clamp01(dimmed);
  return (
    <div
      style={{
        width: COUNTER_W,
        height: COUNTER_H,
        boxSizing: 'border-box',
        padding: '16px 22px 14px',
        borderRadius: RADIUS.lg,
        background: `linear-gradient(180deg, ${alpha(tone, 0.07 + 0.08 * h)} 0%, ${C.ink900} 72%)`,
        border: `3px solid ${alpha(tone, 0.35 + 0.55 * h)}`,
        boxShadow: h > 0.02 ? `0 0 ${Math.round(36 * h)}px ${alpha(tone, 0.32 * h)}` : undefined,
        fontFamily: FONT.sans,
        opacity: o * (1 - 0.35 * d),
        transform: `translateY(${(1 - o) * 16}px) scale(${1 + 0.03 * h})`,
        transformOrigin: '50% 50%',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 46, fontWeight: 850, color: C.textStrong }}>{kind === 'click' ? 'pican' : 'avisan'}</div>
        <div style={{ fontFamily: FONT.mono, fontSize: 26, fontWeight: 700, color: tone, padding: '4px 14px', borderRadius: RADIUS.pill, border: `2px solid ${alpha(tone, 0.55)}`, background: alpha(tone, 0.1) }}>
          {kind === 'click' ? 'click rate' : 'report rate'}
        </div>
      </div>
      <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ fontSize: 54, fontWeight: 900, color: tone, letterSpacing: -1, lineHeight: 1.1, whiteSpace: 'nowrap' }}>{kind === 'click' ? '2 de cada 10' : '1 de cada 10'}</div>
        {kind === 'report' ? (
          <div style={{ opacity: up, transform: `translateY(${(1 - up) * 10}px)` }}>
            <Icon name="arrowUp" size={44} color={C.emerald} strokeWidth={2.6} />
          </div>
        ) : null}
      </div>
      <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
        {Array.from({ length: 10 }).map((_, i) => {
          const on = clamp01(lit - i);
          return <div key={i} style={{ width: 28, height: 28, borderRadius: 14, boxSizing: 'border-box', border: `3px solid ${alpha(tone, 0.4 + 0.5 * on)}`, background: alpha(tone, 0.85 * on), boxShadow: on > 0.5 ? `0 0 12px ${alpha(tone, 0.5)}` : undefined }} />;
        })}
      </div>
      {kind === 'report' ? (
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10, fontSize: 27, fontWeight: 750, color: C.text, whiteSpace: 'nowrap' }}>
          <Icon name="clock" size={28} color={C.cyan} />
          el primero a los 4 minutos
        </div>
      ) : null}
    </div>
  );
}

export const STEP_H = 140;

/** One of the four steps of the reporting loop; `on` 0–1 lights it. The text is the full wording of the sheet. */
export function LoopStep({ n, icon, text, on, width, size = 30 }: { n: number; icon: IconName; text: string; on: number; width: number; size?: number }) {
  const o = clamp01(on);
  const tone = C.cyan;
  return (
    <div
      style={{
        width,
        height: STEP_H,
        boxSizing: 'border-box',
        padding: '12px 20px',
        borderRadius: RADIUS.lg,
        background: `linear-gradient(180deg, ${alpha(tone, 0.04 + 0.1 * o)} 0%, ${C.ink900} 80%)`,
        border: `3px solid ${alpha(tone, 0.25 + 0.6 * o)}`,
        boxShadow: o > 0.02 ? `0 0 ${Math.round(28 * o)}px ${alpha(tone, 0.22 * o)}` : undefined,
        fontFamily: FONT.sans,
        opacity: 0.4 + 0.6 * o,
        transform: `translateY(${(1 - o) * 8}px)`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 20, boxSizing: 'border-box', border: `3px solid ${alpha(tone, 0.5 + 0.5 * o)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 850, color: C.textStrong }}>{n}</div>
        <Icon name={icon} size={38} color={tone} />
      </div>
      <div style={{ marginTop: 8, fontSize: size, fontWeight: 750, lineHeight: 1.18, color: C.textStrong }}>{text}</div>
    </div>
  );
}
