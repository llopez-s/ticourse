import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { S05 } from '../../../data/s05-caminos';
import { GEOM } from './geom';

const AMBER_SOFT = '#fcd34d';
const EMERALD_SOFT = '#6ee7b7';
const SHADOW = `0 14px 30px ${alpha('#000000', 0.55)}`;
/** Where the DENY tag sits: on the top edge of the sinkhole card, clear of its `[!]` chip. */
export const DENY_TAG = { x: GEOM.deny.x + 26, y: GEOM.deny.y - 46, h: 46 } as const;

/** «los pasos de antes ya no los puedes impedir»: small, with a bracket on the three rows above C2. */
export function BridgeLine({ show }: { show: number }) {
  if (show <= 0.004) return null;
  const x = GEOM.matrix.x - 22;
  const { top, bottom } = GEOM.before;
  const y = top + 28;
  return (
    <div style={{ opacity: show }}>
      <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <path d={`M${x + 12} ${top + 6} H${x} V${bottom - 6} H${x + 12} M${x} ${y} H${x - 14}`} fill="none" stroke={alpha(C.muted, 0.9)} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div style={{ position: 'absolute', right: 1728 - (x - 24), top: y - 22, fontFamily: FONT.sans, fontSize: 31, lineHeight: '44px', fontWeight: 700, fontStyle: 'italic', color: C.text, whiteSpace: 'nowrap', transform: `translateX(${(1 - show) * 12}px)` }}>{S05.bridge}</div>
    </div>
  );
}

/** «el actor lo sabrá en minutos»: an amber tag over C2's `[!]` mark, pointing at it. */
export function MarkGloss({ show }: { show: number }) {
  if (show <= 0.004) return null;
  const chipX = GEOM.deny.x + GEOM.deny.w - 34;
  const bottom = GEOM.deny.y + 2;
  return (
    <div style={{ opacity: show, transform: `translateY(${(1 - show) * -8}px)` }}>
      <div style={{ position: 'absolute', right: 1728 - GEOM.matrix.right, top: bottom - 44, padding: '0 16px 1px', borderRadius: 11, border: `3px solid ${alpha(C.amber, 0.9)}`, background: alpha('#1c1203', 0.97), boxShadow: SHADOW, fontFamily: FONT.sans, fontSize: 28, lineHeight: '32px', fontWeight: 800, color: AMBER_SOFT, whiteSpace: 'nowrap' }}>{S05.markGloss}</div>
      <svg width={20} height={10} style={{ position: 'absolute', left: chipX - 10, top: bottom - 6, overflow: 'visible' }}>
        <path d="M0 0 L10 9 L20 0 Z" fill={C.amber} />
      </svg>
    </div>
  );
}

/**
 * «no corta la llamada en curso · las siguientes no llegan a ninguna parte» over the sinkhole card;
 * its third part, DENY, is the tag under it (DenyTag). `lines[i]` 0–1 brings each line in.
 */
export function SinkholeGloss({ show, lines }: { show: number; lines: [number, number] }) {
  if (show <= 0.004) return null;
  return (
    <div style={{ position: 'absolute', left: GEOM.deny.cx - 348, width: 760, bottom: 660 - (DENY_TAG.y - 10), display: 'flex', justifyContent: 'center', opacity: show }}>
      <div style={{ padding: '8px 24px 12px', borderRadius: 14, border: `3px solid ${alpha(C.emerald, 0.85)}`, background: alpha(C.ink950, 0.97), boxShadow: SHADOW, fontFamily: FONT.sans, fontSize: 33, lineHeight: '41px', fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap' }}>
        {S05.sinkhole.lines.map((ln, i) => (
          <div key={ln} style={{ opacity: lines[i], height: 41 * (i ? lines[i] : 1), overflow: 'hidden' }}>
            {ln}
          </div>
        ))}
      </div>
    </div>
  );
}

/** The sinkhole cell's own label: DENY (emerald). `lit` 0–1 glows, `dim` 0–1 steps it back. */
export function DenyTag({ show, lit = 0, dim = 0 }: { show: number; lit?: number; dim?: number }) {
  if (show <= 0.004) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: DENY_TAG.x,
        top: DENY_TAG.y,
        height: DENY_TAG.h,
        boxSizing: 'border-box',
        padding: '0 18px',
        borderRadius: 12,
        border: `3px solid ${alpha(C.emerald, 0.6 + 0.4 * lit)}`,
        background: alpha('#04241b', 0.97),
        boxShadow: lit > 0.02 ? `0 0 ${Math.round(26 * lit)}px ${alpha(C.emerald, 0.45 * lit)}` : undefined,
        fontFamily: FONT.sans,
        fontSize: 36,
        lineHeight: '38px',
        fontWeight: 900,
        letterSpacing: 1,
        color: lit > 0.5 ? EMERALD_SOFT : C.emerald,
        opacity: show * (1 - 0.5 * dim),
        transform: `translateY(${(1 - show) * 8}px)`,
      }}
    >
      {S05.sinkhole.verb}
    </div>
  );
}
