import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, Redacted, clamp01, mix } from '../../../../../engine/src/ui';
import { MASKED_ID, TOKENS } from '../../../data/canon';

/** s04's pieces: the masked DNI on screen, the report with tokens, the vault table and the scrambled export. */

/** The DNI as the shift manager's screen shows it (the invented masked fragment), big and mono. */
export function MaskedScreen({ on, width = 420 }: { on: number; width?: number }) {
  return (
    <div
      style={{
        width,
        height: 92,
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `3px solid ${alpha(C.cyan, 0.4 + 0.5 * on)}`,
        background: C.ink950,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
        fontFamily: FONT.mono,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ fontFamily: FONT.sans, fontSize: 30, fontWeight: 750, color: C.muted }}>DNI</span>
      <span style={{ fontSize: 58, fontWeight: 700, letterSpacing: 4, color: on > 0.5 ? C.cyanSoft : C.text }}>{MASKED_ID}</span>
    </div>
  );
}

/** The report for Dirección: one row per person, the DNI replaced by a meaningless token; hours as bars. */
export function ReportTable({ tokens, width = 500 }: { tokens: number; width?: number }) {
  const k = clamp01(tokens);
  return (
    <div style={{ width, display: 'flex', flexDirection: 'column', gap: 6, fontFamily: FONT.mono }}>
      {TOKENS.map((t, i) => {
        const show = clamp01(k * TOKENS.length - i);
        return (
          <div
            key={t}
            style={{
              height: 36,
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              padding: '0 14px',
              borderRadius: RADIUS.sm,
              background: alpha(C.ink700, 0.6),
            }}
          >
            <span style={{ width: 190, position: 'relative', height: 32 }}>
              <span style={{ position: 'absolute', left: 0, top: 0, opacity: 1 - show }}>
                <Redacted width={170} height={26} tone="cyan" strength={0.55} style={{ marginTop: 4 }} />
              </span>
              <span style={{ position: 'absolute', left: 0, top: -2, fontSize: 30, fontWeight: 700, color: C.cyanSoft, opacity: show }}>{t}</span>
            </span>
            <Redacted width={mix(150, 200, i / 2)} height={22} tone="muted" strength={0.45} />
          </div>
        );
      })}
    </div>
  );
}

/** The vault: RR. HH.'s table that turns each token back into its DNI. */
export function VaultTable({ on, width = 500 }: { on: number; width?: number }) {
  return (
    <div
      style={{
        width,
        boxSizing: 'border-box',
        padding: '10px 16px 12px',
        borderRadius: RADIUS.md,
        border: `3px solid ${alpha(C.violet, 0.45 + 0.5 * on)}`,
        background: alpha(C.violet, 0.06 + 0.06 * on),
        boxShadow: on > 0.05 ? `0 0 ${Math.round(24 * on)}px ${alpha(C.violet, 0.25 * on)}` : undefined,
        fontFamily: FONT.sans,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, whiteSpace: 'nowrap' }}>
        <Icon name="database" size={30} color={C.violet} />
        <span style={{ fontSize: 34, fontWeight: 900, letterSpacing: 3, color: '#c4b5fd' }}>VAULT</span>
        <span style={{ fontSize: 28, fontWeight: 700, color: C.muted }}>la guarda RR. HH.</span>
      </div>
      <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {TOKENS.slice(0, 1).map((t) => (
          <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 14, height: 34 }}>
            <span style={{ fontFamily: FONT.mono, fontSize: 28, fontWeight: 700, color: C.cyanSoft, width: 150 }}>{t}</span>
            <svg width={44} height={14}>
              <line x1={2} y1={7} x2={34} y2={7} stroke={C.violet} strokeWidth={3} />
              <path d="M 30 1 L 40 7 L 30 13" fill="none" stroke={C.violet} strokeWidth={3} />
            </svg>
            <span style={{ fontSize: 28, fontWeight: 750, color: C.text }}>DNI</span>
            <Redacted width={150} height={22} tone="violet" strength={0.5} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Nonsense column names of the proposal (texture: they mean nothing on purpose). */
const COLS = ['zq7', 'b_x', 'kk2', 'p0w'] as const;
/** Where each column ends after the shuffle. */
const SHUFFLED = [2, 0, 3, 1] as const;

/** The monthly export: a sheet whose columns get renamed and shuffled «para que no se entienda». */
export function ExportSheet({ shuffle, width = 500 }: { shuffle: number; width?: number }) {
  const s = clamp01(shuffle);
  const colW = (width - 32) / COLS.length;
  return (
    <div
      style={{
        position: 'relative',
        width,
        height: 140,
        boxSizing: 'border-box',
        padding: 16,
        borderRadius: RADIUS.md,
        border: `2px solid ${C.ink600}`,
        background: C.ink900,
        fontFamily: FONT.mono,
      }}
    >
      <div style={{ position: 'absolute', left: 16, top: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Icon name="file" size={26} color={C.muted} />
      </div>
      {COLS.map((c, i) => {
        const x = 16 + mix(i, SHUFFLED[i], s) * colW;
        return (
          <div key={c} style={{ position: 'absolute', left: x, top: 44, width: colW - 10 }}>
            <div style={{ height: 34, borderRadius: 6, background: alpha(C.amber, 0.14), border: `2px solid ${alpha(C.amber, 0.5)}`, display: 'grid', placeItems: 'center', fontSize: 26, fontWeight: 700, color: C.amber }}>{c}</div>
            {[0, 1, 2].map((r) => (
              <div key={r} style={{ marginTop: 7, height: 12, width: `${60 + ((i * 7 + r * 13) % 35)}%`, borderRadius: 7, background: alpha(C.text, 0.25) }} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
