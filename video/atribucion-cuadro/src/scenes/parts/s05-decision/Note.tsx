import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon } from '../../../../../engine/src/ui';
import { S05_CLOSE, S05_LABEL, S05_NOTE } from '../../../data/s05-decision';
import { UnknownStamp } from '../Diamond';

const EMERALD_SOFT = '#6ee7b7';
const SIZE = 36;

/**
 * The analyst's note (cyan: what your network gives you): what you CAN write in the report, line by line.
 *   lines[i]  0–1 line i · tail 0–1 the last line's second half («el juicio se emite…»)
 *   stamp     0–1 the UNKNOWN stamp on «quién teclea: desconocido» · stampPulse 0–1 makes it swell
 *   said[i]   0–1 lights the line the voice is on
 * It names no group, no confidence grade and no country.
 */
export function NoteCard({ width, show = 1, lines, tail = 1, stamp = 1, stampPulse = 0, said = [] }: { width: number; show?: number; lines: readonly number[]; tail?: number; stamp?: number; stampPulse?: number; said?: readonly number[] }) {
  if (show <= 0.001) return null;
  return (
    <div
      style={{
        width,
        boxSizing: 'border-box',
        padding: '22px 28px 26px 22px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.cyan, 0.65)}`,
        background: `linear-gradient(180deg, ${alpha(C.cyan, 0.12)} 0%, ${alpha(C.ink900, 0.97)} 40%), ${C.ink900}`,
        boxShadow: `0 20px 50px ${alpha('#000000', 0.45)}`,
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
        opacity: show,
        transform: `translateX(${(1 - show) * 18}px)`,
      }}
    >
      {S05_NOTE.map((n, i) => {
        const on = lines[i] ?? 0;
        const lit = said[i] ?? 0;
        return (
          <div key={n.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginTop: i ? 22 : 0, opacity: on * (0.78 + 0.22 * lit), transform: `translateX(${(1 - on) * -12}px)` }}>
            <Icon name="check" size={32} color={C.cyan} strokeWidth={3} style={{ marginTop: 6 }} />
            <div style={{ fontSize: SIZE, lineHeight: 1.2, letterSpacing: -0.3 }}>
              {n.rest.map((line, k) => (
                <div key={line} style={{ display: 'flex', alignItems: 'center', gap: 16, opacity: k === 0 || i < S05_NOTE.length - 1 ? 1 : tail }}>
                  <span>
                    {k === 0 ? <span style={{ fontWeight: 850, color: C.cyanSoft }}>{n.key} </span> : null}
                    <span style={{ fontWeight: 750, color: C.textStrong }}>{line}</span>
                  </span>
                  {n.stamp && k === 0 ? <UnknownStamp size={29} pulse={stampPulse} style={{ opacity: stamp, transform: `scale(${0.9 + 0.1 * stamp})` }} /> : null}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** «lo que afirmas lleva su confianza» — what the museum label stands for (emerald: well-founded). */
export function LabelMeans({ show = 1, glow = 0 }: { show?: number; glow?: number }) {
  if (show <= 0.001) return null;
  return (
    <div style={{ fontFamily: FONT.sans, fontSize: 33, fontWeight: 850, lineHeight: 1.14, letterSpacing: -0.3, color: EMERALD_SOFT, whiteSpace: 'nowrap', opacity: show, transform: `translateY(${(1 - show) * 10}px)`, textShadow: glow > 0.02 ? `0 0 ${Math.round(20 * glow)}px ${alpha(C.emerald, 0.6 * glow)}` : undefined }}>
      {S05_LABEL.means}
    </div>
  );
}

/** The chapter's close: «perseguir el nombre solo compensa si una decisión lo pide». */
export function CloseStrip({ when = 0 }: { when?: number }) {
  return (
    <div style={{ display: 'inline-block', padding: '8px 34px 11px', borderRadius: RADIUS.md, border: `2px solid ${alpha(C.cyan, 0.65)}`, background: alpha('#083344', 0.94), fontFamily: FONT.sans, fontSize: 38, fontWeight: 850, lineHeight: 1.1, whiteSpace: 'nowrap' }}>
      <span style={{ color: C.textStrong }}>{S05_CLOSE.chase}</span>
      <span style={{ color: alpha(C.cyanSoft, 0.7 + 0.3 * when) }}> {S05_CLOSE.when}</span>
    </div>
  );
}
