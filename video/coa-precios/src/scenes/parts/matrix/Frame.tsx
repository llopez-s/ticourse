import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { ACTIONS, COUNTS, MATRIX_TEXT, PHASES } from '../../../data/matrix';
import { AMBER_SOFT, MarkChip, VIOLET_SOFT } from './Cell';
import { M, MATRIX_W, pointSize, type designLayout } from './layout';
import type { MatrixProps } from './types';

type L = ReturnType<typeof designLayout>;
const c01 = (v: number | undefined) => Math.max(0, Math.min(1, v ?? 0));
const INNER = MATRIX_W - 2 * M.pad;

/** Panel, title band and the five action headers. */
export function Head({ l, title, cols = {} }: { l: L; title: boolean; cols?: MatrixProps['cols'] }) {
  const squeeze = l.big.e;
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, borderRadius: RADIUS.md, background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`, border: `2px solid ${alpha(C.cyan, 0.4)}`, boxShadow: `0 24px 60px ${alpha('#000000', 0.4)}` }} />
      {title ? (
        <div style={{ position: 'absolute', left: M.pad + 6, top: l.yTitle, height: M.titleH, display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap' }}>
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={C.cyan} strokeWidth={2.2} strokeLinecap="round">
            <rect x="3" y="3" width="18" height="18" rx="2.5" />
            <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
          </svg>
          <span style={{ fontSize: 21, fontWeight: 750, color: C.textStrong, letterSpacing: -0.1 }}>{MATRIX_TEXT.title}</span>
        </div>
      ) : null}
      <div style={{ position: 'absolute', left: M.pad, top: l.yHead, width: INNER, height: M.headH, background: alpha(C.ink700, 0.5), borderRadius: '8px 8px 0 0', borderBottom: `2px solid ${alpha(C.cyan, 0.35)}`, boxSizing: 'border-box' }} />
      {ACTIONS.map((a) => {
        const lit = c01(cols[a.id]);
        return (
          <div key={a.id} style={{ position: 'absolute', left: l.colX[a.id], top: l.yHead, width: M.colW, height: M.headH, display: 'grid', placeItems: 'center', opacity: 1 - 0.55 * squeeze * (1 - lit) }}>
            {lit > 0.01 ? <div style={{ position: 'absolute', inset: '3px 6px', borderRadius: 8, background: alpha(C.violet, 0.28 * lit), border: `2px solid ${alpha(C.violet, 0.9 * lit)}`, boxShadow: `0 0 ${Math.round(18 * lit)}px ${alpha(C.violet, 0.45 * lit)}` }} /> : null}
            <span style={{ position: 'relative', fontSize: 18 + 2 * lit, fontWeight: 850, letterSpacing: 1, color: lit > 0.5 ? C.textStrong : alpha(VIOLET_SOFT, 0.8) }}>{a.name}</span>
          </div>
        );
      })}
    </>
  );
}

/** Row backgrounds, state bands and the phase labels (with their cell count). */
export function Rows({ l, rows = {}, counts = 0, s }: { l: L; rows?: MatrixProps['rows']; counts?: number; s: number }) {
  return (
    <>
      {PHASES.map((p, i) => {
        const st = rows[p.id] ?? {};
        const y = l.rowY[p.id];
        const h = l.rowH[p.id];
        const isBig = l.big.id === p.id;
        const e = isBig ? l.big.e : 0;
        const dim = c01(st.dim);
        const lit = c01(st.lit);
        const warn = c01(st.warn);
        const alert = c01(st.alert);
        const count = Math.max(c01(counts), c01(st.count)) * (1 - l.big.e);
        const band = (tone: string, w: number, dashed: boolean) =>
          w > 0.01 ? <div style={{ position: 'absolute', left: M.pad - 3, top: y + 1, width: INNER + 6, height: h - 2, boxSizing: 'border-box', borderRadius: 10, border: `3px ${dashed ? 'dashed' : 'solid'} ${alpha(tone, 0.9 * w)}`, background: alpha(tone, 0.07 * w), boxShadow: `0 0 ${Math.round(20 * w)}px ${alpha(tone, 0.25 * w)}` }} /> : null;
        const big = pointSize(s);
        return (
          <div key={p.id} style={{ opacity: 1 - 0.6 * dim, filter: dim > 0.001 ? `saturate(${1 - 0.5 * dim})` : undefined }}>
            <div style={{ position: 'absolute', left: M.pad, top: y, width: INNER, height: h, background: i % 2 === 0 ? alpha(C.ink800, 0.6) : alpha(C.ink800, 0.25), borderTop: i ? `1px solid ${C.ink700}` : undefined, boxSizing: 'border-box' }} />
            {band(C.cyan, Math.max(lit, e), false)}
            {band(C.amber, warn, true)}
            {band(C.rose, alert, true)}
            {/* phase name: in the label column, or as the header line of an enlarged row */}
            <div style={{ position: 'absolute', left: M.pad + 10, top: y + (isBig ? 6 * e : 0), height: e > 0.5 ? 30 : h, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 5 }}>
              <div style={{ fontSize: 16 + (0.74 * big - 16) * e, lineHeight: 1.16, fontWeight: 850, letterSpacing: 0.6, color: VIOLET_SOFT, whiteSpace: 'nowrap' }}>{e > 0.5 ? p.name : p.lines.map((ln) => <div key={ln}>{ln}</div>)}</div>
              {count > 0.01 ? (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, opacity: count, transform: `scale(${0.8 + 0.2 * count})`, transformOrigin: '0 50%', whiteSpace: 'nowrap' }}>
                  <span style={{ fontSize: 34, lineHeight: 1, fontWeight: 900, color: C.textStrong }}>{COUNTS[p.id]}</span>
                  <span style={{ fontSize: 17, fontWeight: 700, color: C.muted }}>celdas</span>
                </div>
              ) : null}
            </div>
            {alert > 0.01 ? (
              <div style={{ position: 'absolute', left: MATRIX_W - M.pad - 52, top: y - 20, width: 40, height: 40, boxSizing: 'border-box', borderRadius: 20, display: 'grid', placeItems: 'center', background: C.ink950, border: `3px solid ${alpha(C.rose, 0.9)}`, opacity: alert, transform: `scale(${0.7 + 0.3 * alert})`, zIndex: 3 }}>
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={C.rose} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 19v-6a6 6 0 0 1 12 0v6M4 19h16M12 3v2M4.5 6.5l1.4 1.4M19.5 6.5l-1.4 1.4" />
                </svg>
              </div>
            ) : null}
          </div>
        );
      })}
      {/* column separators, row by row (an enlarged row has none: its cards run across) */}
      {PHASES.map((p) =>
        ACTIONS.map((a, i) => (
          <div key={`${p.id}-${a.id}`} style={{ position: 'absolute', left: l.colX[a.id] - 1, top: l.rowY[p.id], width: 2, height: l.rowH[p.id], background: i === 0 ? alpha(C.cyan, 0.3) : C.ink700, opacity: l.big.id === p.id ? 1 - l.big.e : 1 }} />
        )),
      )}
    </>
  );
}

/** The bottom band: the two strips, or the legend of the `[!]` marks. */
export function Foot({ l, strips, legend, s }: { l: L; strips: number; legend: number; s: number }) {
  const st = c01(strips) * (1 - c01(legend));
  const lg = c01(legend);
  const bandH = 2 * M.stripH + M.stripGap;
  const f = pointSize(s);
  return (
    <div style={{ position: 'absolute', left: M.pad, top: l.yFoot, width: INNER, height: bandH, fontFamily: FONT.sans }}>
      {st > 0.01 ? (
        <div style={{ opacity: st }}>
          <div style={{ height: M.stripH, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 12, padding: '0 12px', borderRadius: 8, border: `2px dashed ${alpha('#64748b', 0.8)}`, whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: 0.3, color: alpha(VIOLET_SOFT, 0.7) }}>{MATRIX_TEXT.missing.phases}</span>
            <span style={{ fontSize: 23, fontWeight: 750, color: C.text }}>{MATRIX_TEXT.missing.text}</span>
          </div>
          <div style={{ height: M.stripH, marginTop: M.stripGap, display: 'flex', alignItems: 'center', padding: '0 14px', fontSize: 22, fontWeight: 600, color: C.muted, whiteSpace: 'nowrap' }}>{MATRIX_TEXT.noCell}</div>
        </div>
      ) : null}
      {lg > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: lg, transform: `translateY(${(1 - lg) * 8}px)` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0.4 * f, padding: `${0.14 * f}px ${0.6 * f}px`, borderRadius: 0.4 * f, border: `3px solid ${alpha(C.amber, 0.9)}`, background: alpha('#1c1203', 0.95), boxShadow: `0 0 ${Math.round(26 * lg)}px ${alpha(C.amber, 0.35)}`, whiteSpace: 'nowrap' }}>
            <MarkChip size={0.9 * f} glow={1} />
            <span style={{ fontSize: f, fontWeight: 800, color: AMBER_SOFT }}>= {MATRIX_TEXT.legend}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
