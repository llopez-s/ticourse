import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon } from '../../../../../engine/src/ui';
import { S03_HOLDERS, S03_REPORT, S03_SET, S03_SOURCES } from '../../../data/s03-techo';

const SKY_SOFT = '#7dd3fc';
const VIOLET_SOFT = '#c4b5fd';

/**
 * What it would take to see the third band: sources beyond your network (sky). `items[i]` 0–1 files each
 * line, `said[i]` 0–1 lights it as the voice names it, `holders` 0–1 shows who usually has them.
 */
export function SourcesCard({ width, show = 1, items, said, holders = 1 }: { width: number; show?: number; items: readonly number[]; said: readonly number[]; holders?: number }) {
  if (show <= 0.001) return null;
  return (
    <div
      style={{
        width,
        boxSizing: 'border-box',
        padding: '16px 22px 18px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.sky, 0.65)}`,
        background: `linear-gradient(180deg, ${alpha(C.sky, 0.12)} 0%, ${alpha(C.ink900, 0.97)} 50%), ${C.ink900}`,
        boxShadow: `0 20px 50px ${alpha('#000000', 0.45)}`,
        fontFamily: FONT.sans,
        opacity: show,
        transform: `translateX(${(1 - show) * 18}px)`,
      }}
    >
      {S03_SOURCES.map((s, i) => (
        <div key={s.text} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginTop: i ? 6 : 0, opacity: (items[i] ?? 1) * (0.72 + 0.28 * (said[i] ?? 0)) }}>
          <span style={{ flexShrink: 0, width: 12, height: 12, marginTop: 14, borderRadius: 6, background: C.sky }} />
          <span style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.18, letterSpacing: -0.2, color: C.textStrong }}>
            {s.text}
            {s.term ? <span style={{ color: VIOLET_SOFT, textShadow: (said[i] ?? 0) > 0.02 ? `0 0 ${Math.round(16 * said[i])}px ${alpha(C.violet, 0.7 * said[i])}` : undefined }}> ({s.term})</span> : null}
          </span>
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 12, paddingTop: 12, borderTop: `2px solid ${alpha(C.faint, 0.45)}`, opacity: holders }}>
        <Icon name="users" size={28} color={SKY_SOFT} strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} />
        <span style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.2, color: SKY_SOFT }}>{S03_HOLDERS}</span>
      </div>
    </div>
  );
}

/**
 * How a serious report talks: a bracketed name (no real report exists), the overlap it found at operator
 * level, its confidence — and a dash where a country would be. `body` 0–1 writes the three lines in order;
 * `country` 0–1 shows the dash row.
 */
export function ReportCard({ width, show = 1, body = 1, country = 1 }: { width: number; show?: number; body?: number; country?: number }) {
  if (show <= 0.001) return null;
  const row = (k: number) => Math.max(0, Math.min(1, body * 3 - k));
  const conf = S03_REPORT.confidence;
  return (
    <div style={{ width, fontFamily: FONT.sans, opacity: show, transform: `translateX(${(1 - show) * 18}px)` }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 25, fontWeight: 700, lineHeight: 1.18, color: C.text }}>
        <Icon name="file" size={34} color={C.muted} strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ whiteSpace: 'nowrap' }}>
          {S03_REPORT.header.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
      </div>
      <div
        style={{
          marginTop: 10,
          boxSizing: 'border-box',
          padding: '14px 22px 16px',
          borderRadius: RADIUS.md,
          border: `2px solid ${alpha('#cbd5e1', 0.55)}`,
          background: `linear-gradient(180deg, ${alpha('#cbd5e1', 0.1)} 0%, ${alpha(C.ink900, 0.97)} 60%), ${C.ink900}`,
          boxShadow: `0 20px 50px ${alpha('#000000', 0.45)}`,
        }}
      >
        <div style={{ fontFamily: FONT.mono, fontSize: 32, fontWeight: 800, lineHeight: 1.2, color: C.textStrong, whiteSpace: 'nowrap', opacity: row(0) }}>{S03_REPORT.name}</div>
        <div style={{ marginTop: 4, fontSize: 29, fontWeight: 700, lineHeight: 1.2, color: C.text, opacity: row(1) }}>{S03_REPORT.overlap}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, fontSize: 30, lineHeight: 1.2, whiteSpace: 'nowrap', opacity: row(2) }}>
          <span style={{ fontWeight: 650, color: C.muted }}>{conf.word}</span>
          <span style={{ display: 'inline-flex', gap: 5 }}>
            {[0, 1, 2].map((k) => (
              <span key={k} style={{ width: 14, height: 14, borderRadius: 7, boxSizing: 'border-box', background: k < conf.pips ? C.emerald : 'transparent', border: `2px solid ${k < conf.pips ? C.emerald : C.faint}` }} />
            ))}
          </span>
          <span style={{ fontWeight: 850, color: C.textStrong }}>{conf.value}</span>
        </div>
        {/* where a country would go: a dash, not a hidden name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 10, paddingTop: 10, borderTop: `2px dashed ${alpha(C.faint, 0.7)}`, fontSize: 32, lineHeight: 1.2, whiteSpace: 'nowrap', opacity: country }}>
          <span style={{ fontWeight: 750, color: C.muted }}>{S03_REPORT.country.label}</span>
          <span style={{ fontWeight: 850, color: C.muted }}>{S03_REPORT.country.value}</span>
        </div>
      </div>
    </div>
  );
}

/** INTRUSION SET, «el grupo, tal como se le ve trabajar» (violet: an exam name). */
export function IntrusionSet({ show = 1, glow = 0 }: { show?: number; glow?: number }) {
  if (show <= 0.001) return null;
  return (
    <div style={{ fontFamily: FONT.sans, whiteSpace: 'nowrap', opacity: show, transform: `translateY(${(1 - show) * 10}px)` }}>
      <div style={{ display: 'inline-block', padding: '2px 18px 5px', borderRadius: RADIUS.md, border: `2px solid ${alpha(C.violet, 0.6)}`, background: alpha('#1a1033', 0.92), fontSize: 38, fontWeight: 900, letterSpacing: 1, lineHeight: 1.14, color: VIOLET_SOFT, boxShadow: glow > 0.02 ? `0 0 ${Math.round(26 * glow)}px ${alpha(C.violet, 0.5 * glow)}` : undefined }}>
        {S03_SET.name}
      </div>
      <div style={{ marginTop: 6, fontSize: 29, fontWeight: 750, lineHeight: 1.2, color: C.textStrong }}>{S03_SET.sub}</div>
    </div>
  );
}
