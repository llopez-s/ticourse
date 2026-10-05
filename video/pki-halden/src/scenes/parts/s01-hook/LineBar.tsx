import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../../engine/src/ui';
import { TLS_LINE } from '../../../data/s01-hook';

/**
 * V11's line, half-lit: curl's SSL row as ONE mono row, verbatim (curl's
 * order). Not V11's TlsLine chips. Only `id-ecPublicKey` may brighten, cyan
 * (`keyLit`). Not positioned.
 */

export const LINE_BAR = { height: 84, size: 32 } as const;

export function LineBar({ keyLit = 0, lit = 0.62 }: { keyLit?: number; lit?: number }) {
  const k = clamp01(keyLit);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 18,
        height: LINE_BAR.height,
        padding: '0 34px 0 26px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${C.ink700}`,
        background: `linear-gradient(180deg, ${alpha(C.ink850, 0.96)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
        boxShadow: `0 24px 60px ${alpha('#000000', 0.38)}, inset 0 1px 0 ${alpha('#ffffff', 0.04)}`,
        fontFamily: FONT.mono,
        whiteSpace: 'pre',
      }}
    >
      <span style={{ opacity: 0.55 * lit + 0.2 }}>
        <Icon name="terminal" size={30} color={C.faint} />
      </span>
      {/* Two sibling spans (not nested), so the key can be brighter than the half-lit rest. */}
      <span style={{ fontSize: LINE_BAR.size, fontWeight: 600 }}>
        <span style={{ color: C.muted, opacity: lit }}>{TLS_LINE.lead}</span>
        <span style={{ position: 'relative', display: 'inline-block', opacity: lit + (1 - lit) * k }}>
          {/* The glow box sits behind the word, so the row's text never shifts. */}
          <span
            style={{
              position: 'absolute',
              left: -8,
              right: -8,
              top: -6,
              bottom: -6,
              borderRadius: 10,
              border: `2px solid ${alpha(C.cyan, 0.85 * k)}`,
              background: alpha(C.cyan, 0.12 * k),
              boxShadow: k > 0.02 ? `0 0 ${Math.round(24 * k)}px ${alpha(C.cyan, 0.32 * k)}` : undefined,
            }}
          />
          <span style={{ position: 'relative', color: C.muted }}>{TLS_LINE.key}</span>
          {/* The cyan copy fades in on top: a smooth colour change. */}
          <span style={{ position: 'absolute', left: 0, top: 0, color: C.cyanSoft, opacity: k }}>{TLS_LINE.key}</span>
        </span>
      </span>
    </div>
  );
}
