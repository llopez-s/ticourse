import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon } from '../../../../engine/src/ui';
import { CISO_WHO } from '../../data/canon';

/**
 * The CISO's strip (V23's card, redrawn for this video): avatar + «CISO · responsable de seguridad» and the task
 * he sends, «Propónme nuestros primeros PIRs». He asks; he does not decide: cyan, the defender's side, no name,
 * no face. `text` is what is typed so far (the card keeps its full size); `layout` 'card' stacks, 'strip' is one row.
 */
export function Ciso({
  width,
  text,
  full,
  size = 50,
  layout = 'card',
  caret = false,
  show = 1,
  glow = 0,
  dim = 0,
  style,
}: {
  width: number;
  /** The text typed so far. */
  text: string;
  /** The whole text (to reserve the lines). */
  full?: string;
  size?: number;
  layout?: 'card' | 'strip';
  caret?: boolean;
  show?: number;
  glow?: number;
  dim?: number;
  style?: CSSProperties;
}) {
  if (show <= 0.001) return null;
  const strip = layout === 'strip';
  const avatar = strip ? 68 : 88;
  const whoSize = strip ? 32 : 34;
  const body = (
    <div style={{ position: 'relative', fontSize: size, fontWeight: 850, letterSpacing: -0.6, lineHeight: 1.14, color: C.textStrong, ...(strip ? { whiteSpace: 'nowrap' } : {}) }}>
      {/* The full text, invisible, holds the lines the typing will fill */}
      {full ? <span style={{ visibility: 'hidden' }}>«{full}»</span> : null}
      <span style={{ position: full ? 'absolute' : 'static', left: 0, top: 0 }}>
        {text ? `«${text}` : ''}
        {text && text.length === (full ?? text).length ? '»' : ''}
        {caret ? <span style={{ display: 'inline-block', width: '0.45em', height: '0.9em', marginLeft: 4, verticalAlign: '-0.08em', background: C.cyan }} /> : null}
      </span>
    </div>
  );
  return (
    <div
      style={{
        width,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: strip ? 'row' : 'column',
        alignItems: strip ? 'center' : 'flex-start',
        gap: strip ? 26 : 22,
        padding: strip ? '14px 30px 14px 18px' : '30px 38px 34px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.cyan, 0.5 + 0.4 * glow)}`,
        background: `linear-gradient(180deg, ${alpha(C.cyan, 0.12)} 0%, ${alpha(C.ink900, 0.96)} 60%), ${C.ink900}`,
        boxShadow: `0 0 ${Math.round(36 * glow)}px ${alpha(C.cyan, 0.32 * glow)}, 0 20px 50px ${alpha('#000000', 0.45)}`,
        fontFamily: FONT.sans,
        opacity: show * (1 - 0.6 * dim),
        filter: dim > 0.01 ? `saturate(${1 - 0.5 * dim})` : undefined,
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: strip ? 16 : 20, flexShrink: 0 }}>
        <div style={{ width: avatar, height: avatar, borderRadius: avatar / 2, flexShrink: 0, display: 'grid', placeItems: 'center', background: alpha(C.cyan, 0.12), border: `3px solid ${alpha(C.cyan, 0.7)}` }}>
          <Icon name="user" size={Math.round(avatar * 0.58)} color={C.cyan} strokeWidth={2} />
        </div>
        <span style={{ fontSize: whoSize, fontWeight: 800, lineHeight: 1.1, whiteSpace: 'nowrap' }}>
          <span style={{ color: '#c4b5fd', letterSpacing: 3 }}>{CISO_WHO.term}</span>
          <span style={{ color: C.faint }}> · </span>
          <span style={{ color: C.cyanSoft }}>{CISO_WHO.role}</span>
        </span>
      </div>
      {strip ? <div style={{ width: 3, alignSelf: 'stretch', borderRadius: 2, background: alpha(C.cyan, 0.35), flexShrink: 0 }} /> : null}
      {body}
    </div>
  );
}
