import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01, dimStyle, mix } from '../../../../../engine/src/ui';
import { SLOT_RPO, SLOT_RTO } from '../../../data/s03-promesas';
import { Clock, Notebook } from '../Cafe';

/**
 * One process card of s03, drawn as a wide row: the process (name + area) on the left and two slots to its right, the
 * clock slot (how long it can stand still: RTO) and the notebook slot (how much data it can lose: RPO).
 * Nothing positions itself. Every animated prop is a 0–1 weight the scene computes:
 *   show        the card arrives
 *   focus/dim   the card the voice is on / a card that steps back
 *   locked      the lock mark pops next to the area chip (the values are set)
 *   rtoShow, rpoShow, noteShow   a value or the note under the RPO slot fills in
 *   rpoPending  the RPO slot is waiting for its value: dashed box instead of a value
 *   rpoLit      the RPO value has just been answered: its slot lights up
 */
export const CARD_W = 1728;
export const CARD_H = 184;

const TITLE_W = 470;
const SLOT_W = 580;
const GAP = 24;
const PAD = 12;

function Slot({
  kind,
  caption,
  value,
  show,
  pending,
  note,
  noteShow,
  lit,
  focus,
}: {
  kind: 'rto' | 'rpo';
  caption: string;
  value: string | null;
  show: number;
  pending: boolean;
  note?: string;
  noteShow: number;
  lit: number;
  focus: number;
}) {
  const tone = kind === 'rto' ? C.cyan : C.amber;
  const soft = kind === 'rto' ? C.cyanSoft : '#fcd34d';
  const filled = value !== null && show > 0.02;
  const k = clamp01(show);
  const border = filled ? alpha(tone, mix(0.55, 0.95, Math.max(lit, focus * 0.5))) : alpha(C.ink500, 0.9);
  const GlyphIcon = kind === 'rto' ? Clock : Notebook;
  return (
    <div
      style={{
        boxSizing: 'border-box',
        width: SLOT_W,
        height: CARD_H - 2 * PAD,
        padding: '6px 20px',
        borderRadius: RADIUS.md,
        border: `3px ${filled ? 'solid' : 'dashed'} ${border}`,
        background: filled ? alpha(tone, mix(0.06, 0.14, lit)) : alpha(C.ink950, 0.5),
        boxShadow: lit > 0.05 ? `0 0 ${Math.round(34 * lit)}px ${alpha(tone, 0.4 * lit)}` : undefined,
        fontFamily: FONT.sans,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ fontSize: 32, fontWeight: 650, lineHeight: '36px', color: C.muted, whiteSpace: 'nowrap' }}>{caption}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 58 }}>
        <GlyphIcon size={56} opacity={filled ? 1 : 0.4} />
        {filled ? (
          <div
            style={{
              fontSize: 54,
              fontWeight: 850,
              letterSpacing: -0.5,
              lineHeight: '58px',
              color: soft,
              whiteSpace: 'nowrap',
              opacity: k,
              transform: `translateY(${(1 - k) * 14}px)`,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {value}
          </div>
        ) : (
          <div
            style={{
              width: 250,
              height: 40,
              borderRadius: 10,
              border: `2px dashed ${alpha(C.ink500, pending ? 1 : 0.7)}`,
              background: alpha(C.ink900, 0.7),
            }}
          />
        )}
      </div>
      <div
        style={{
          fontSize: 32,
          fontWeight: 600,
          lineHeight: '36px',
          color: C.text,
          whiteSpace: 'nowrap',
          height: 36,
          opacity: clamp01(noteShow),
          transform: `translateY(${(1 - clamp01(noteShow)) * 8}px)`,
        }}
      >
        {note ?? ''}
      </div>
    </div>
  );
}

export function ProcessCard({
  name,
  area,
  rtoValue,
  rpoValue,
  note,
  show = 1,
  focus = 0,
  dim = 0,
  locked = 0,
  rtoShow = 0,
  rpoShow = 0,
  noteShow = 0,
  rpoPending = false,
  rpoLit = 0,
  style,
  children,
}: {
  name: string;
  area: string;
  rtoValue: string | null;
  rpoValue: string | null;
  note?: string;
  show?: number;
  focus?: number;
  dim?: number;
  locked?: number;
  rtoShow?: number;
  rpoShow?: number;
  noteShow?: number;
  rpoPending?: boolean;
  rpoLit?: number;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  const s = clamp01(show);
  const f = clamp01(focus);
  const lk = clamp01(locked);
  return (
    <div
      style={{
        boxSizing: 'border-box',
        width: CARD_W,
        height: CARD_H,
        padding: PAD,
        display: 'flex',
        alignItems: 'center',
        gap: GAP,
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.cyan, mix(0.3, 0.8, f))}`,
        background: `linear-gradient(90deg, ${alpha(C.ink800, 0.95)} 0%, ${alpha(C.ink900, 0.97)} 100%)`,
        boxShadow: f > 0.05 ? `0 0 ${Math.round(30 * f)}px ${alpha(C.cyan, 0.22 * f)}` : undefined,
        transform: `translateY(${(1 - s) * 30}px) scale(${1 + 0.012 * f})`,
        ...dimStyle(dim * 0.6, s),
        ...style,
      }}
    >
      <div style={{ width: TITLE_W, fontFamily: FONT.sans, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 38, fontWeight: 800, lineHeight: '44px', color: C.textStrong }}>{name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span
            style={{
              fontSize: 32,
              fontWeight: 700,
              lineHeight: '40px',
              padding: '0 18px',
              borderRadius: RADIUS.pill,
              border: `2px solid ${alpha(C.cyan, 0.7)}`,
              background: alpha(C.cyan, 0.1),
              color: C.cyanSoft,
              whiteSpace: 'nowrap',
            }}
          >
            {area}
          </span>
          <span style={{ opacity: lk, transform: `scale(${0.6 + 0.4 * lk})`, display: 'inline-flex' }}>
            <Icon name="lock" size={40} color={C.cyanSoft} strokeWidth={2.2} />
          </span>
        </div>
      </div>
      <Slot kind="rto" caption={SLOT_RTO} value={rtoValue} show={rtoShow} pending={false} noteShow={0} lit={0} focus={f} />
      <Slot
        kind="rpo"
        caption={SLOT_RPO}
        value={rpoValue}
        show={rpoShow}
        pending={rpoPending}
        note={note}
        noteShow={noteShow}
        lit={rpoLit}
        focus={f}
      />
      {children}
    </div>
  );
}
