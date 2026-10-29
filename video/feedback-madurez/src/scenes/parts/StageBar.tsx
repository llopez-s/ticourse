import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { dimStyle } from '../../../../engine/src/ui';
import { STAGES } from '../../data/stages';

/** Three stage columns grow from left to right: the bar itself is a little «maturity» chart. */
export const STAGE_W = [460, 560, 660] as const;
export const STAGE_GAP = 24;
export const STAGE_X = [0, STAGE_W[0] + STAGE_GAP, STAGE_W[0] + STAGE_W[1] + 2 * STAGE_GAP] as const;
export const STAGE_BAR_H = 78;
/** Where the bar rests in s04 (under the intercepted message) and where s05 picks it up. */
export const STAGE_BAR_REST = 252;
export const STAGE_TONES = [C.amber, C.cyan, C.emerald] as const;

/** Rising bars: `n` of three are filled. */
function Rise({ n, color, size = 36 }: { n: number; color: string; size?: number }) {
  return (
    <svg width={size} height={size * 0.9} viewBox="0 0 40 36" style={{ display: 'block', flexShrink: 0 }} aria-hidden>
      {[0, 1, 2].map((i) => (
        <rect key={i} x={i * 14} y={34 - (12 + i * 10)} width="11" height={12 + i * 10} rx="3" fill={i < n ? color : alpha(color, 0.22)} />
      ))}
    </svg>
  );
}

/**
 * The lesson's «Madurez típica» bar: reactivo, en desarrollo, maduro. Each
 * stage has its own presence (`show`, 0–1) and light (`lit`, 0–1); `dim` pushes
 * the whole bar back. The caller positions it (its label sits 46 px above).
 */
export function StageBar({
  show,
  lit,
  dim = 0,
  labelOpacity = 1,
  label,
}: {
  show: readonly [number, number, number];
  lit: readonly [number, number, number];
  dim?: number;
  labelOpacity?: number;
  label?: string;
}) {
  return (
    <div style={{ position: 'relative', width: STAGE_X[2] + STAGE_W[2], height: STAGE_BAR_H, fontFamily: FONT.sans, ...dimStyle(dim) }}>
      {label ? (
        <div style={{ position: 'absolute', left: 4, top: -46, fontSize: 32, fontWeight: 800, letterSpacing: 1, color: C.muted, opacity: labelOpacity, whiteSpace: 'nowrap' }}>
          {label}
        </div>
      ) : null}
      {STAGES.map((st, i) => {
        const tone = STAGE_TONES[i];
        const l = lit[i];
        const s = show[i];
        return (
          <div
            key={st.n}
            style={{
              position: 'absolute',
              left: STAGE_X[i],
              top: 0,
              width: STAGE_W[i],
              height: STAGE_BAR_H,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              padding: '0 22px',
              borderRadius: 22,
              border: `${l > 0.4 ? 3 : 2}px solid ${alpha(tone, 0.28 + 0.62 * l)}`,
              background: `linear-gradient(180deg, ${alpha(tone, 0.07 + 0.16 * l)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
              boxShadow: l > 0.05 ? `0 0 ${Math.round(34 * l)}px ${alpha(tone, 0.3 * l)}` : undefined,
              opacity: s,
              transform: `translateY(${(1 - s) * 18}px)`,
              overflow: 'hidden',
            }}
          >
            <Rise n={st.n} color={tone} />
            <span style={{ fontSize: 38, fontWeight: 850, color: l > 0.3 ? C.textStrong : C.text, whiteSpace: 'nowrap', letterSpacing: -0.4, }}>
              <span style={{ color: tone }}>{st.n}</span> · {st.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
