import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';
import { CardGlyph, CARD_BASE } from '../glyphs';
import { SwitchPort } from '../RoleLanes';

/**
 * The end card's remate («la próxima toma libre que veas, mira a ver si te pregunta quién eres»): the
 * video's port (RoleLanes' `SwitchPort`, shut, amber) and, on `ask`, a speech bubble from it holding the
 * accreditation card (the same `CardGlyph` the driver and the laptop show) with a question mark: the
 * socket asks who you are. Wraps the shared drawings; nothing redrawn.
 */
export function AskingPort({ width = 460, ask = 1, glow = 0 }: { width?: number; ask?: number; glow?: number }) {
  const a = clamp01(ask);
  const port = Math.round(width * 0.4);
  const bw = width - port - 28;
  const bh = Math.round(bw * 0.62);
  const cardScale = (bw * 0.5) / CARD_BASE.w;
  return (
    <div style={{ position: 'relative', width, height: Math.max(port, bh) + 20, display: 'flex', alignItems: 'flex-end', gap: 28 }}>
      <SwitchPort size={port} color={C.amber} glow={0.35 + 0.4 * clamp01(glow)} />
      <div
        style={{
          position: 'relative',
          width: bw,
          height: bh,
          marginBottom: port * 0.45,
          opacity: Math.min(1, a * 1.4),
          transform: `scale(${0.7 + 0.3 * a})`,
          transformOrigin: '0% 100%',
        }}
      >
        <svg width={bw} height={bh} viewBox={`0 0 ${bw} ${bh}`} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          {/* Bubble with its tail towards the port */}
          <path
            d={`M 18 0 H ${bw - 18} Q ${bw} 0 ${bw} 18 V ${bh - 18} Q ${bw} ${bh} ${bw - 18} ${bh} H 46 L 6 ${bh + 26} L 22 ${bh - 4} Q 0 ${bh - 8} 0 ${bh - 26} V 18 Q 0 0 18 0 Z`}
            fill={alpha(C.cyan, 0.1)}
            stroke={C.cyan}
            strokeWidth={3}
            strokeLinejoin="round"
          />
          <CardGlyph x={bw * 0.36} y={bh / 2} scale={cardScale} color={C.cyan} halo={false} />
        </svg>
        <div
          style={{
            position: 'absolute',
            left: bw * 0.68,
            top: bh / 2,
            transform: 'translate(-50%, -50%)',
            fontFamily: FONT.sans,
            fontSize: Math.round(bh * 0.62),
            fontWeight: 850,
            color: C.cyanSoft,
            lineHeight: 1,
          }}
        >
          ?
        </div>
      </div>
    </div>
  );
}
