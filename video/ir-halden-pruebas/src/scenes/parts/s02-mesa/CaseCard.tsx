import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../../../engine/src/theme/motion';
import { Icon, clamp01 } from '../../../../../engine/src/ui';
import { CASE, MAILBOX } from '../../../data/s02-mesa';
import { PaperList } from '../Bits';
import { WayChip } from '../TwoWays';

/**
 * s02's case card: what the person leading the tabletop throws at the room.
 * Drawn as a rehearsal card (dashed sky edge, «ensayo» tag): it is
 * hypothetical, nothing is touched. Inside it, the mailbox holding the plan's
 * contact list; when the voice says the list lives in the mail, the mailbox
 * goes dark with the list still inside (the gap, amber). Card-local layout;
 * `CARD` gives its size and `MAIL_LIST` the centre of the list inside the
 * mailbox (for the copy that flies out in the fix).
 */

export const CARD = { w: 848, h: 560, pad: 32 } as const;
const MAIL = { x: CARD.pad, y: 250, w: CARD.w - 2 * CARD.pad, h: 280, head: 54 } as const;
const LIST = { x: 34, y: 78, w: 108 } as const;
export const MAIL_LIST = { x: MAIL.x + LIST.x + LIST.w / 2, y: MAIL.y + LIST.y + (LIST.w * 190) / 150 / 2, w: LIST.w } as const;

export interface CaseTimes {
  /** Card header «Caso». */
  tagAt: number;
  /** «03:00». */
  timeAt: number;
  /** «se cae el correo corporativo». */
  whatAt: number;
  /** «¿a quién llamas?». */
  askAt: number;
  /** The mailbox with the list. */
  mailAt: number;
  /** The deputy's row in the list lights. */
  rowAt: number;
  /** The mailbox goes dark with the list inside. */
  darkAt: number;
}

export function CaseCard({ frame, t, glow = 0, rowOut = Number.POSITIVE_INFINITY }: { frame: number; t: CaseTimes; glow?: number; rowOut?: number }) {
  const g = clamp01(glow);
  const time = progress(frame, t.timeAt, 12);
  const what = enter(frame, t.whatAt, { distance: 12 });
  const ask = enter(frame, t.askAt, { distance: 12 });
  const mail = enter(frame, t.mailAt, { distance: 16 });
  const row = progress(frame, t.rowAt, 12) * (1 - progress(frame, rowOut, 14));
  const dark = progress(frame, t.darkAt, 16, EASE.inOut);
  const gap = progress(frame, t.darkAt + 10, 14);
  return (
    <div
      style={{
        position: 'relative',
        width: CARD.w,
        height: CARD.h,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `3px dashed ${alpha(C.sky, 0.55 + 0.35 * g)}`,
        background: `linear-gradient(180deg, ${alpha(C.sky, 0.08 + 0.05 * g)} 0%, ${alpha(C.ink900, 0.97)} 40%)`,
        boxShadow: `0 30px 70px ${alpha('#000000', 0.4)}${g > 0.01 ? `, 0 0 ${Math.round(40 * g)}px ${alpha(C.sky, 0.25 * g)}` : ''}`,
        fontFamily: FONT.sans,
      }}
    >
      {/* Header: Caso · 03:00, and the rehearsal tag */}
      <div style={{ position: 'absolute', left: CARD.pad, top: 24, height: 56, display: 'flex', alignItems: 'center', gap: 16, whiteSpace: 'nowrap' }}>
        <Icon name="file" size={44} color={C.sky} />
        <span style={{ fontSize: 44, fontWeight: 850, color: '#7dd3fc' }}>{CASE.tag}</span>
        <span style={{ fontSize: 44, fontWeight: 700, color: C.faint, opacity: time }}>·</span>
        <span style={{ fontFamily: FONT.mono, fontSize: 44, fontWeight: 800, color: C.textStrong, opacity: time, transform: `translateY(${(1 - time) * 8}px)` }}>{CASE.time}</span>
      </div>
      <div style={{ position: 'absolute', right: CARD.pad, top: 30 }}>
        <WayChip tone="sky" size={28} style={{ borderStyle: 'dashed' }}>
          {CASE.rehearsal}
        </WayChip>
      </div>
      <div style={{ position: 'absolute', left: CARD.pad, top: 104, fontSize: 48, fontWeight: 850, letterSpacing: -0.6, color: C.textStrong, whiteSpace: 'nowrap', ...what }}>{CASE.what}</div>
      <div style={{ position: 'absolute', left: CARD.pad, top: 172, fontSize: 46, fontWeight: 800, color: '#fcd34d', whiteSpace: 'nowrap', ...ask }}>{CASE.ask}</div>

      {/* The mailbox with the contact list */}
      <div
        style={{
          position: 'absolute',
          left: MAIL.x,
          top: MAIL.y,
          width: MAIL.w,
          height: MAIL.h,
          boxSizing: 'border-box',
          borderRadius: RADIUS.md,
          border: gap > 0.01 ? `3px dashed ${alpha(C.amber, 0.35 + 0.55 * gap)}` : `2px solid ${alpha(C.cyan, 0.45)}`,
          background: alpha(C.ink850, 0.95),
          boxShadow: gap > 0.01 ? `0 0 ${Math.round(34 * gap)}px ${alpha(C.amber, 0.25 * gap)}` : undefined,
          overflow: 'hidden',
          ...mail,
        }}
      >
        <div style={{ height: MAIL.head, display: 'flex', alignItems: 'center', gap: 14, padding: '0 22px', borderBottom: `2px solid ${C.ink700}`, background: alpha(C.ink800, 0.9) }}>
          <Icon name="mail" size={34} color={dark > 0.5 ? C.faint : C.cyan} />
          <span style={{ fontSize: 32, fontWeight: 750, color: dark > 0.5 ? C.faint : C.text }}>{MAILBOX.title}</span>
        </div>
        <div style={{ position: 'absolute', left: LIST.x, top: LIST.y }}>
          <PaperList width={LIST.w} tone="sky" />
          {/* The deputy's row */}
          <div style={{ position: 'absolute', left: -6, top: Math.round((58 * LIST.w) / 150) - 12, width: LIST.w + 12, height: 24, borderRadius: 6, border: `3px solid ${alpha(C.sky, row)}`, boxShadow: `0 0 16px ${alpha(C.sky, 0.6 * row)}` }} />
        </div>
        <div style={{ position: 'absolute', left: LIST.x + LIST.w + 36, top: LIST.y + 12, whiteSpace: 'nowrap' }}>
          <div style={{ fontSize: 38, fontWeight: 800, color: C.textStrong }}>{MAILBOX.list}</div>
        </div>
        {/* Dark: the mail is down, the list stays inside */}
        <div style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, background: alpha(C.ink950, 0.72 * dark) }} />
        {gap > 0.001 ? (
          <div style={{ position: 'absolute', right: 26, bottom: 24, opacity: gap, transform: `scale(${0.8 + 0.2 * gap})` }}>
            <div style={{ width: 84, height: 84, borderRadius: 42, display: 'grid', placeItems: 'center', background: alpha(C.amber, 0.14), border: `3px solid ${alpha(C.amber, 0.85)}` }}>
              <Icon name="power" size={46} color={C.amber} strokeWidth={2.4} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
