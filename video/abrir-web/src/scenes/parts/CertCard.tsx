import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../engine/src/ui';
import { CERT_ROW_LABELS } from './data';
import { DrawnTick } from './Bits';

/**
 * The certificate card with its FOUR checks (nombres alternativos, firma y cadena, fechas, no anulado). s07 draws
 * the portal's and s10 the look-alike's with this same component, same size, different data: that is s10's argument.
 *
 * Each row: a number badge, the label (always visible: it announces the check), the value lines (fade in with
 * row.show), an optional aside (a seal, a note) and a drawn tick (row.tick 0-1) at the right.
 *   - cn    the subject, shown dim in the header as «sujeto  CN = ...» (mono). The browser compares the name with
 *           the first row (subjectAltName, RFC 9525), never with the CN, so the CN is deliberately not the star.
 *   - rows  one per check (label defaults to CHECKS[i]); focus 0-1 tints a row.
 *   - warn  a strip under the rows (s10's amber «pero ¿de quién?»), faded with warnShow.
 * The card has no fixed height: it grows with its rows, so place it by its top.
 */
export interface CertRow {
  label?: string;
  lines: ReactNode[];
  show: number;
  tick: number;
  focus?: number;
  aside?: ReactNode;
}

export function CertCard({
  cn,
  rows,
  width = 660,
  tone = C.sky,
  show = 1,
  warn,
  warnShow = 0,
}: {
  cn: ReactNode;
  rows: CertRow[];
  width?: number;
  tone?: string;
  show?: number;
  warn?: ReactNode;
  warnShow?: number;
}) {
  return (
    <div
      style={{
        width,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(tone, 0.55)}`,
        background: `linear-gradient(180deg, ${alpha(tone, 0.08)} 0%, ${alpha(C.ink900, 0.97)} 40%)`,
        boxShadow: `0 24px 60px ${alpha('#000000', 0.4)}`,
        fontFamily: FONT.sans,
        opacity: clamp01(show),
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 24px', background: alpha(tone, 0.14), borderBottom: `2px solid ${alpha(tone, 0.4)}` }}>
        <Icon name="file" size={38} color={tone} />
        <span style={{ fontSize: 24, fontWeight: 700, color: C.muted, whiteSpace: 'nowrap' }}>sujeto</span>
        <span style={{ fontFamily: FONT.mono, fontSize: 25, fontWeight: 500, color: C.muted, whiteSpace: 'nowrap' }}>CN = {cn}</span>
      </div>
      {rows.map((r, i) => {
        const s = clamp01(r.show);
        const f = clamp01(r.focus ?? 0);
        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              padding: '12px 22px',
              borderTop: i === 0 ? undefined : `2px solid ${C.ink700}`,
              background: f > 0.01 ? alpha(tone, 0.1 * f) : undefined,
            }}
          >
            <span
              style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                flexShrink: 0,
                display: 'grid',
                placeItems: 'center',
                fontSize: 26,
                fontWeight: 800,
                color: s > 0.5 ? C.ink950 : C.faint,
                background: s > 0.5 ? alpha(tone, 0.9) : 'transparent',
                border: `2px ${s > 0.5 ? 'solid' : 'dashed'} ${s > 0.5 ? tone : C.ink600}`,
              }}
            >
              {i + 1}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 28, fontWeight: 750, color: s > 0.05 ? C.muted : C.faint, lineHeight: 1.1 }}>{r.label ?? CERT_ROW_LABELS[i]}</div>
              <div style={{ opacity: s, transform: `translateY(${(1 - s) * 8}px)`, minHeight: 40 }}>
                {r.lines.map((l, k) => (
                  <div key={k} style={{ fontSize: 32, fontWeight: 650, color: C.textStrong, lineHeight: 1.18, whiteSpace: 'nowrap' }}>
                    {l}
                  </div>
                ))}
              </div>
            </div>
            {r.aside ? <div style={{ flexShrink: 0, opacity: s }}>{r.aside}</div> : null}
            <div style={{ width: 52, height: 52, flexShrink: 0, display: 'grid', placeItems: 'center' }}>
              {r.tick > 0 ? <DrawnTick size={50} draw={r.tick} /> : <span style={{ width: 46, height: 46, borderRadius: '50%', border: `2px dashed ${C.ink600}` }} />}
            </div>
          </div>
        );
      })}
      {warn ? (
        <div style={{ padding: '10px 22px 14px', borderTop: `2px solid ${alpha(C.amber, 0.5)}`, background: alpha(C.amber, 0.1 * clamp01(warnShow)), opacity: clamp01(warnShow) }}>{warn}</div>
      ) : null}
    </div>
  );
}
