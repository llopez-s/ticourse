import type { CSSProperties } from 'react';
import { C, alpha } from '../../../../engine/src/theme/tokens';
import { PAPER } from './paper';

/**
 * A thick open book seen from the front: two page blocks with the page edges stacked
 * underneath, a dark cover below and the spine shadow between them. Scribble bars stand
 * for text (no readable words). `w` is the full width; the height is 0.62 w.
 */
export function OpenBook({ w = 560, glow = 0, style }: { w?: number; glow?: number; style?: CSSProperties }) {
  const h = Math.round(w * 0.62);
  const half = w / 2;
  const pageH = Math.round(h * 0.84);
  const edge = Math.round(h * 0.11);
  const bars = (side: 'l' | 'r') =>
    Array.from({ length: 10 }).map((_, i) => (
      <div
        key={`${side}${i}`}
        style={{
          position: 'absolute',
          left: side === 'l' ? half * 0.14 : half * 0.1,
          top: pageH * 0.1 + i * pageH * 0.082,
          width: half * (i % 4 === 3 ? 0.42 : 0.72 - (i % 3) * 0.05),
          height: Math.max(4, Math.round(w * 0.012)),
          borderRadius: 4,
          background: alpha(PAPER.soft, 0.45),
        }}
      />
    ));
  const block = (side: 'l' | 'r') => (
    <div
      style={{
        position: 'absolute',
        left: side === 'l' ? 0 : half + 2,
        top: 0,
        width: half - 2,
        height: pageH,
        borderRadius: side === 'l' ? '22px 6px 0 0' : '6px 22px 0 0',
        background: `linear-gradient(${side === 'l' ? 100 : 80}deg, ${PAPER.bg} 0%, ${PAPER.bgDeep} 100%)`,
        border: `2px solid ${PAPER.edge}`,
        borderBottom: 'none',
        boxShadow: glow > 0.02 ? `0 0 ${Math.round(40 * glow)}px ${alpha(C.cyan, 0.45 * glow)}` : undefined,
      }}
    >
      {bars(side)}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          [side === 'l' ? 'right' : 'left']: 0,
          width: half * 0.22,
          background: `linear-gradient(${side === 'l' ? 90 : 270}deg, transparent 0%, ${alpha('#000000', 0.28)} 100%)`,
        }}
      />
    </div>
  );
  const edgeBlock = (side: 'l' | 'r') => (
    <div
      style={{
        position: 'absolute',
        left: side === 'l' ? 0 : half + 2,
        top: pageH,
        width: half - 2,
        height: edge,
        background: `repeating-linear-gradient(180deg, #efe8d6 0px, #efe8d6 3px, #b9ae93 3px, #b9ae93 4px)`,
        border: `2px solid ${PAPER.edge}`,
        borderTop: 'none',
        borderRadius: side === 'l' ? '0 0 0 10px' : '0 0 10px 0',
      }}
    />
  );
  return (
    <div style={{ position: 'relative', width: w, height: h, ...style }}>
      <div style={{ position: 'absolute', left: -10, top: pageH * 0.55, width: w + 20, height: pageH * 0.45 + edge + 14, borderRadius: 16, background: `linear-gradient(180deg, ${C.ink600} 0%, ${C.ink800} 100%)`, boxShadow: `0 26px 50px ${alpha('#000000', 0.5)}` }} />
      {block('l')}
      {block('r')}
      {edgeBlock('l')}
      {edgeBlock('r')}
      <div style={{ position: 'absolute', left: half - 4, top: 0, width: 8, height: pageH + edge, background: alpha('#000000', 0.55), borderRadius: 4 }} />
    </div>
  );
}

/** A pile of loose sheets: `n` sheets, each a little off the one below; the top one carries scribble bars. */
export function PagePile({ w = 360, n = 14, style }: { w?: number; n?: number; style?: CSSProperties }) {
  const h = Math.round(w * 1.18);
  return (
    <div style={{ position: 'relative', width: w + 30, height: h + n * 7, ...style }}>
      {Array.from({ length: n }).map((_, i) => {
        const rot = ((i * 37) % 11) / 2 - 2.5;
        const dx = ((i * 53) % 17) - 8;
        const top = (n - 1 - i) * 7;
        const isTop = i === n - 1;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 15 + dx,
              top,
              width: w,
              height: h,
              borderRadius: 6,
              background: isTop ? PAPER.bg : i % 2 ? '#e7dfc8' : '#ddd4ba',
              border: `2px solid ${PAPER.edge}`,
              boxShadow: `0 4px 10px ${alpha('#000000', 0.3)}`,
              transform: `rotate(${rot}deg)`,
            }}
          >
            {isTop
              ? Array.from({ length: 9 }).map((__, k) => (
                  <div key={k} style={{ position: 'absolute', left: w * 0.1, top: h * 0.1 + k * h * 0.09, width: w * (k % 4 === 3 ? 0.4 : 0.76 - (k % 3) * 0.06), height: 7, borderRadius: 4, background: alpha(PAPER.soft, 0.45) }} />
                ))
              : null}
          </div>
        );
      })}
    </div>
  );
}
