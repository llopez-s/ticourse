import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';
import { CheckBox } from '../Marks';
import { TermPill } from '../Labels';

export const ALLOW = { w: 560, h: 440 } as const;
const NEW_LINE = 'el servidor nuevo';

/**
 * s04: the request's step «dar de alta el servidor nuevo en la lista de permitidos» (a proposal; it does not say which
 * filter holds the list), the term «allow list», and the list itself — entries already there as grey bars, and on
 * `one-line` a single new line «el servidor nuevo», typed, with its tick.
 */
export function AllowCard({ show, term, typed }: { show: number; term: number; typed: number }) {
  const s = clamp01(show);
  const t = clamp01(typed);
  const chars = Math.round(NEW_LINE.length * t);
  return (
    <div
      style={{
        width: ALLOW.w,
        height: ALLOW.h,
        boxSizing: 'border-box',
        padding: '22px 26px',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(C.cyan, 0.55)}`,
        background: `linear-gradient(180deg, ${C.ink800} 0%, ${C.ink850} 100%)`,
        fontFamily: FONT.sans,
        opacity: s,
        transform: `translateY(${(1 - s) * 18}px)`,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div style={{ fontSize: 26, fontWeight: 700, color: C.muted }}>la petición pide</div>
      <div style={{ fontSize: 33, fontWeight: 850, color: C.textStrong, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
        dar de alta el servidor nuevo
        <br />
        en la lista de permitidos
      </div>
      <div style={{ opacity: clamp01(term), height: 52 }}>
        <TermPill text="allow list" size={32} />
      </div>
      <div
        style={{
          marginTop: 6,
          padding: '16px 20px',
          borderRadius: RADIUS.md,
          border: `2px solid ${alpha(C.muted, 0.45)}`,
          background: alpha(C.ink950, 0.5),
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        {[260, 210].map((w) => (
          <div key={w} style={{ display: 'flex', alignItems: 'center', gap: 14, height: 30 }}>
            <CheckBox size={30} tick={1} tone={C.muted} />
            <span style={{ display: 'block', width: w, height: 14, borderRadius: 7, background: alpha(C.muted, 0.4) }} />
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 40, opacity: t > 0 ? 1 : 0.35 }}>
          <CheckBox size={36} tick={progress01(t)} glow={t > 0 && t < 1 ? 1 : 0} />
          <span style={{ fontSize: 34, fontWeight: 850, color: C.emerald, whiteSpace: 'nowrap' }}>
            {NEW_LINE.slice(0, chars)}
            {t > 0 && t < 1 ? <span style={{ color: C.cyan }}>|</span> : null}
          </span>
        </div>
      </div>
    </div>
  );
}

/** The tick waits for the typing to finish. */
function progress01(t: number) {
  return clamp01((t - 0.85) / 0.15);
}
