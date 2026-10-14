import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { S04_ALONE, S04_FALSE_FLAG, S04_NOT_IMPOSSIBLE, S04_QUESTION } from '../../../data/s04-binario';

const VIOLET_SOFT = '#c4b5fd';
const AMBER_SOFT = '#fcd34d';
const EMERALD_SOFT = '#6ee7b7';

/**
 * What the trick is, then its name: «pistas dejadas a propósito para culpar a otro» (`is` 0–1) and
 * FALSE FLAG (`name` 0–1; violet, an exam name). `glow` 0–1 as the voice names it.
 */
export function FalseFlag({ is = 1, name = 1, glow = 0, dim = 0 }: { is?: number; name?: number; glow?: number; dim?: number }) {
  if (is <= 0.001 && name <= 0.001) return null;
  return (
    <div style={{ fontFamily: FONT.sans, whiteSpace: 'nowrap', opacity: 1 - 0.5 * dim }}>
      <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.16, letterSpacing: -0.3, color: C.textStrong, opacity: is, transform: `translateY(${(1 - is) * 10}px)` }}>
        {S04_FALSE_FLAG.is.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>
      <div style={{ display: 'inline-block', marginTop: 14, padding: '3px 22px 6px', borderRadius: RADIUS.md, border: `2px solid ${alpha(C.violet, 0.7)}`, background: alpha('#1a1033', 0.92), fontSize: 46, fontWeight: 900, letterSpacing: 1.5, lineHeight: 1.12, color: VIOLET_SOFT, boxShadow: glow > 0.02 ? `0 0 ${Math.round(30 * glow)}px ${alpha(C.violet, 0.55 * glow)}` : undefined, opacity: name, transform: `translateY(${(1 - name) * 10}px)` }}>
        {S04_FALSE_FLAG.name}
      </div>
    </div>
  );
}

/** A bracket on the left edge and text beside the rows it speaks about (a positioned box `height` px tall). */
function Side({ tone, height, show, children }: { tone: string; height: number; show: number; children: ReactNode }) {
  if (show <= 0.001) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', gap: 16, height, fontFamily: FONT.sans, opacity: show, transform: `translateX(${(1 - show) * 14}px)` }}>
      <svg width={18} height={height} style={{ flexShrink: 0 }}>
        <path d={`M 2 4 H 12 V ${height - 4} H 2`} fill="none" stroke={alpha(tone, 0.9)} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', whiteSpace: 'nowrap' }}>{children}</div>
    </div>
  );
}

/** Beside the first two rows: alone they weigh very little; inside a large, coherent set they add up. */
export function AloneChip({ height, alone = 1, together = 1, glow = 0, dim = 0 }: { height: number; alone?: number; together?: number; glow?: number; dim?: number }) {
  return (
    <div style={{ opacity: 1 - 0.5 * dim }}>
      <Side tone={C.amber} height={height} show={alone}>
        <div style={{ fontSize: 32, fontWeight: 850, lineHeight: 1.14, letterSpacing: -0.4, color: AMBER_SOFT, textShadow: glow > 0.02 ? `0 0 ${Math.round(18 * glow)}px ${alpha(C.amber, 0.7 * glow)}` : undefined }}>{S04_ALONE.alone}</div>
        <div style={{ marginTop: 3, fontSize: 30, fontWeight: 700, lineHeight: 1.14, letterSpacing: -0.4, color: C.text, opacity: together }}>
          {S04_ALONE.together.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
      </Side>
    </div>
  );
}

/** Beside the two costly rows: «caro no es imposible». */
export function NotImpossible({ height, show = 1, glow = 0 }: { height: number; show?: number; glow?: number }) {
  return (
    <Side tone={C.emerald} height={height} show={show}>
      <div style={{ fontSize: 32, fontWeight: 850, lineHeight: 1.14, letterSpacing: -0.3, color: EMERALD_SOFT, textShadow: glow > 0.02 ? `0 0 ${Math.round(18 * glow)}px ${alpha(C.emerald, 0.7 * glow)}` : undefined }}>{S04_NOT_IMPOSSIBLE}</div>
    </Side>
  );
}

/** V9's question, across the bottom: «si esta pista fuera un señuelo, ¿cambia tu conclusión?». */
export function FinalQuestion({ show = 1, lure = 0, ask = 0 }: { show?: number; lure?: number; ask?: number }) {
  if (show <= 0.001) return null;
  return (
    <div style={{ display: 'inline-block', padding: '8px 34px 11px', borderRadius: RADIUS.md, border: `2px solid ${alpha(C.cyan, 0.65)}`, background: alpha('#083344', 0.94), boxShadow: `0 0 ${Math.round(26 * Math.max(lure, ask))}px ${alpha(C.cyan, 0.25)}`, fontFamily: FONT.sans, fontSize: 38, fontWeight: 850, lineHeight: 1.1, whiteSpace: 'nowrap' }}>
      <span style={{ color: alpha(AMBER_SOFT, 0.75 + 0.25 * lure) }}>{S04_QUESTION.lure}</span>
      <span style={{ color: alpha(C.textStrong, 0.75 + 0.25 * ask) }}> {S04_QUESTION.ask}</span>
    </div>
  );
}
