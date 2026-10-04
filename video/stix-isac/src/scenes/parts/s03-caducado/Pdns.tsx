import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../../engine/src/theme/motion';
import { Icon, mix } from '../../../../../engine/src/ui';
import { PDNS } from '../../../data/s03-caducado';

export const PDNS_W = 1400;
const HEAD_H = 74;
const PAD_X = 36;
const SUBJ_Y = HEAD_H + 26;
const SUBJ_H = 54;
const ROW_Y = SUBJ_Y + SUBJ_H + 26;
const ROW_H = 84;
const NOTHING_Y = ROW_Y + ROW_H + 18;
const NOTHING_H = 56;
export const PDNS_H = NOTHING_Y + NOTHING_H + 26;

const ROW_SIZE = { rest: 38, big: 46 } as const;

/**
 * The passive DNS history of the domain (s3m4): the subject line, then the
 * one row the voice uses — «198.51.100.84 · last seen 2026-04-18 11:31:55» —
 * enlarged, with its date lit, and «nada después» under it. No other rows,
 * no command syntax. Frames are Sequence-relative.
 */
export function PdnsPanel({
  frame,
  openAt,
  rowAt,
  growAt,
  dateAt,
  nothingAt,
}: {
  frame: number;
  openAt: number;
  rowAt: number;
  growAt: number;
  dateAt: number;
  nothingAt: number;
}) {
  const open = progress(frame, openAt, 16);
  if (open <= 0) return null;
  const row = progress(frame, rowAt, 14);
  const grow = progress(frame, growAt, 18, EASE.inOut);
  const date = progress(frame, dateAt, 12);
  const nothing = progress(frame, nothingAt, 16);
  const size = mix(ROW_SIZE.rest, ROW_SIZE.big, grow);
  const rowGlow = Math.max(0.35 * row, grow);

  return (
    <div
      style={{
        position: 'relative',
        width: PDNS_W,
        height: PDNS_H,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.sky, 0.4)}`,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        boxShadow: `0 30px 70px ${alpha('#000000', 0.4)}`,
        overflow: 'hidden',
        fontFamily: FONT.sans,
        opacity: open,
        transform: `translateY(${(1 - open) * 18}px)`,
      }}
    >
      {/* Title bar */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          right: 0,
          height: HEAD_H,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: `0 ${PAD_X}px`,
          background: alpha(C.ink800, 0.95),
          borderBottom: `2px solid ${C.ink700}`,
        }}
      >
        <Icon name="clock" size={38} color={C.sky} />
        <span style={{ fontSize: 36, fontWeight: 800, color: C.text, whiteSpace: 'nowrap' }}>{PDNS.title}</span>
      </div>

      {/* Subject: the domain */}
      <div style={{ position: 'absolute', left: PAD_X, top: SUBJ_Y, height: SUBJ_H, display: 'flex', alignItems: 'center', gap: 14, whiteSpace: 'nowrap', opacity: 1 - 0.35 * grow }}>
        <Icon name="search" size={36} color={C.muted} />
        <span style={{ fontFamily: FONT.mono, fontSize: 34, fontWeight: 700, color: C.roseSoft }}>{PDNS.domain}</span>
      </div>

      {/* The row */}
      {row > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: PAD_X - 14,
            top: ROW_Y,
            width: PDNS_W - 2 * PAD_X + 28,
            height: ROW_H,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            padding: '0 14px',
            borderRadius: 14,
            background: alpha(C.sky, 0.04 + 0.08 * rowGlow),
            border: `2px solid ${alpha(C.sky, 0.2 + 0.5 * rowGlow)}`,
            fontFamily: FONT.mono,
            fontSize: size,
            fontWeight: 700,
            whiteSpace: 'pre',
            opacity: row,
            transform: `translateX(${(1 - row) * 16}px)`,
          }}
        >
          <span style={{ color: '#7dd3fc' }}>{PDNS.ip}</span>
          <span style={{ color: C.faint }}>{PDNS.sep}</span>
          <span style={{ color: C.muted, fontWeight: 500 }}>{PDNS.lastSeenLead}</span>
          <span
            style={{
              color: date > 0.5 ? '#fde68a' : C.textStrong,
              padding: '0 8px',
              borderRadius: 8,
              background: alpha(C.amber, 0.18 * date),
              boxShadow: date > 0 ? `0 0 0 3px ${alpha(C.amber, 0.85 * date)}` : undefined,
            }}
          >
            {PDNS.lastSeen}
          </span>
        </div>
      ) : null}

      {/* «nada después»: the history stops there */}
      {nothing > 0 ? (
        <div style={{ position: 'absolute', left: PAD_X, right: PAD_X, top: NOTHING_Y, height: NOTHING_H, display: 'flex', alignItems: 'center', gap: 22, opacity: nothing }}>
          <svg width={PDNS_W - 2 * PAD_X - 300} height={8} style={{ flexShrink: 0, overflow: 'visible' }}>
            <line x1={0} y1={4} x2={(PDNS_W - 2 * PAD_X - 300) * nothing} y2={4} stroke={alpha(C.muted, 0.7)} strokeWidth={4} strokeDasharray="12 14" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 40, fontWeight: 800, color: '#fde68a', whiteSpace: 'nowrap' }}>{PDNS.nothing}</span>
        </div>
      ) : null}
    </div>
  );
}
