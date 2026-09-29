import type { CSSProperties, ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, RADIUS, alpha, type Accent } from '../theme/tokens';
import { enter, progress } from '../theme/motion';
import { Chip } from './Chip';
import { FOCUS_TEXT, clamp01, dimStyle, focusWeight, type FocusInput } from './Focus';
import { Icon, type IconName } from './Icon';
import { Redacted } from './Redacted';
import { tone as toneOf, type Tone } from './tone';

/** One notice pinned on the board. Frames are relative to the Sequence. */
export interface Notice {
  /** The headline (mono, e.g. a domain); null draws it fully redacted. */
  title: string | null;
  /** A small sans line (e.g. «emisor: CA pública»). */
  meta?: string;
  /** A mono footer (e.g. a fingerprint). */
  code?: string;
  /** Frame the notice gets pinned. */
  at: number;
  /** Grid slot, row-major (defaults to the notice's index). */
  slot?: number;
  /** Pin and border colour (default cyan). */
  tone?: Tone;
  /** A small solid pill in the top-right corner (e.g. «hoy»). */
  badge?: string;
  /** Redaction width when `title` is null (default: 70 % of the notice). */
  redactWidth?: number;
  /** 0–1: strikes the meta line and greys the notice (e.g. «the issuer says nothing»). */
  grey?: number;
  /** Enlarges this notice and dims the others. */
  focus?: FocusInput;
  /** Pills shown next to the notice while it is in focus (big: they are what the voice says). */
  tags?: { text: string; tone?: Tone; solid?: boolean; at?: number }[];
}

const HEADER_H = 72;

/**
 * A public notice board (V4 S06Ct's Certificate Transparency board): a header
 * (icon + title + optional chip) over a cork-dot surface, and notice cards
 * that drop onto a grid at their `at` frames with a small deterministic tilt.
 * A focused notice grows (from its nearest board edge, so it stays inside)
 * and shows its tags; the others step back.
 */
export function NoticeBoard({
  title,
  icon = 'eye',
  chip,
  right,
  notices,
  cols = 4,
  rows = 3,
  width = 1218,
  height = 660,
  tone = 'cyan',
  glow = 0,
  focusScale = 1.45,
  titleSize = 38,
  noticeSize = 28,
  tagSize = 38,
  at,
  frame: frameProp,
  style,
}: {
  title: ReactNode;
  icon?: IconName;
  chip?: { text: string; accent?: Accent; icon?: IconName };
  right?: ReactNode;
  notices: Notice[];
  cols?: number;
  rows?: number;
  width?: number;
  height?: number;
  tone?: Tone;
  glow?: number;
  focusScale?: number;
  titleSize?: number;
  /** Font size of a notice's headline (shrunk to fit its card). */
  noticeSize?: number;
  tagSize?: number;
  /** Frame the board slides in (omitted: always visible). */
  at?: number;
  frame?: number;
  style?: CSSProperties;
}) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const t = toneOf(tone);
  const bodyH = height - HEADER_H;
  const gapX = 28;
  const gapY = 30;
  const nw = (width - gapX * (cols + 1)) / cols;
  const nh = Math.min(170, (bodyH - gapY * (rows + 1)) / rows);
  const gy = (bodyH - rows * nh) / (rows + 1);
  const slotPos = (slot: number) => ({
    x: gapX + (slot % cols) * (nw + gapX),
    y: HEADER_H + gy + Math.floor(slot / cols) * (nh + gy),
  });
  const weights = notices.map((n) => focusWeight(n.focus, frame));
  const dimOf = (i: number) => weights.reduce((m, w, j) => (j === i ? m : Math.max(m, w)), 0) * (1 - weights[i]);
  const boardIn = at !== undefined ? enter(frame, at, { distance: 24, duration: 16 }) : undefined;
  if (at !== undefined && frame < at - 1) return null;

  const chipNode = chip ? (
    <Chip accent={chip.accent ?? 'cyan'} icon={chip.icon} size={30}>
      {chip.text}
    </Chip>
  ) : null;

  return (
    <div style={{ position: 'relative', width, height, ...boardIn, ...style }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: RADIUS.lg,
          border: `3px solid ${alpha(t.fg, 0.3 + 0.5 * glow)}`,
          background: `radial-gradient(${alpha(C.ink600, 0.35)} 1.5px, transparent 1.6px) 0 0 / 22px 22px, linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
          boxShadow: `0 30px 70px ${alpha('#000000', 0.4)}${glow > 0 ? `, 0 0 ${Math.round(40 * glow)}px ${alpha(t.fg, 0.3 * glow)}` : ''}`,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            height: HEADER_H,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '0 24px',
            borderBottom: `2px solid ${C.ink700}`,
            background: alpha(C.ink800, 0.92),
          }}
        >
          <Icon name={icon} size={38} color={t.fg} />
          <div style={{ fontFamily: FONT.sans, fontSize: titleSize, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap', flex: 1, overflow: 'hidden' }}>
            {title}
          </div>
          {right ?? chipNode}
        </div>
      </div>

      {/* Notices: a sibling layer (no clipping), so a focused one may grow past its slot. */}
      {notices.map((n, i) => {
        if (frame < n.at) return null;
        const slot = n.slot ?? i;
        const pos = slotPos(slot);
        const p = progress(frame, n.at, 10);
        const f = weights[i];
        const col = slot % cols;
        const row = Math.floor(slot / cols);
        const ox = col === 0 ? 'left' : col === cols - 1 ? 'right' : 'center';
        const oy = row === 0 ? 'top' : row === rows - 1 ? 'bottom' : 'center';
        const k = 1 + (focusScale - 1) * f;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: pos.x,
              top: pos.y,
              zIndex: f > 0.01 ? 2 : 1,
              ...dimStyle(dimOf(i), p),
              transform: `translateY(${(1 - p) * -26}px) scale(${(1.06 - 0.06 * p) * k}) rotate(${tilt(slot) * (1 - f)}deg)`,
              transformOrigin: `${ox} ${oy}`,
            }}
          >
            <NoticeCard notice={n} width={nw} height={nh} size={noticeSize} focus={f} />
          </div>
        );
      })}

      {/* Tags of the focused notice(s), beside the grown card. */}
      {notices.map((n, i) => {
        const f = weights[i];
        if (!n.tags?.length || f <= 0.01 || frame < n.at) return null;
        const slot = n.slot ?? i;
        const pos = slotPos(slot);
        const row = Math.floor(slot / cols);
        const col = slot % cols;
        const grownW = nw * focusScale;
        const grownH = nh * focusScale;
        // Grown box, matching the transform-origin logic above.
        const gx = col === 0 ? pos.x : col === cols - 1 ? pos.x + nw - grownW : pos.x + (nw - grownW) / 2;
        const gyTop = row === 0 ? pos.y : row === rows - 1 ? pos.y + nh - grownH : pos.y + (nh - grownH) / 2;
        const below = row < rows - 1 || rows === 1;
        return (
          <div
            key={`tags-${i}`}
            style={{
              position: 'absolute',
              left: gx,
              width: grownW,
              top: below ? gyTop + grownH + 16 : undefined,
              bottom: below ? undefined : height - gyTop + 16,
              zIndex: 3,
              display: 'flex',
              justifyContent: 'center',
              gap: 12,
              opacity: f,
            }}
          >
            {n.tags.map((tag) => (
              <span key={tag.text} style={{ opacity: tag.at === undefined ? 1 : progress(frame, tag.at, 10) }}>
                <Pill text={tag.text} tone={tag.tone ?? n.tone ?? 'rose'} solid={tag.solid} size={tagSize} />
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
}

/** Small deterministic tilt so the board does not look like a spreadsheet. */
function tilt(i: number): number {
  return (((i * 37) % 7) - 3) * 0.45;
}

/** A pill in any tone, with its own dark backing so it reads over the board. */
function Pill({ text, tone, solid, size }: { text: string; tone: Tone; solid?: boolean; size: number }) {
  const t = toneOf(tone);
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: `${Math.round(size * 0.22)}px ${Math.round(size * 0.5)}px`,
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(t.fg, solid ? 0.95 : 0.7)}`,
        background: solid ? t.fg : `linear-gradient(${alpha(t.fg, 0.16)}, ${alpha(t.fg, 0.16)}), ${C.ink900}`,
        color: solid ? C.ink950 : C.textStrong,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 750,
        lineHeight: 1.1,
        whiteSpace: 'nowrap',
        boxShadow: `0 10px 24px ${alpha('#000000', 0.45)}`,
      }}
    >
      {text}
    </span>
  );
}

function Pin({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: -size / 2,
        width: size,
        height: size,
        marginLeft: -size / 2,
        borderRadius: size,
        background: `radial-gradient(circle at 35% 35%, ${alpha('#ffffff', 0.7)} 0%, ${color} 45%, ${alpha(color, 0.7)} 100%)`,
        boxShadow: `0 3px 6px ${alpha('#000000', 0.5)}`,
      }}
    />
  );
}

/** One pinned card. The headline shrinks to fit the card's width (mono ≈ 0.6 em per character). */
function NoticeCard({ notice, width, height, size, focus }: { notice: Notice; width: number; height: number; size: number; focus: number }) {
  const t = toneOf(notice.tone ?? 'cyan');
  const grey = clamp01(notice.grey ?? 0);
  const padX = 16;
  const fit = notice.title ? Math.min(size, Math.floor((width - 2 * padX) / (0.61 * notice.title.length))) : size;
  const metaSize = Math.max(20, Math.round(size * 0.8));
  const codeSize = Math.max(18, Math.round(size * 0.72));
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        boxSizing: 'border-box',
        padding: `22px ${padX}px 12px`,
        borderRadius: RADIUS.sm,
        background: `linear-gradient(180deg, ${C.ink700} 0%, ${C.ink800} 100%)`,
        border: `${focus > 0.3 ? 3 : 2}px solid ${alpha(grey > 0.5 ? C.ink500 : t.fg, 0.45 + 0.45 * focus)}`,
        boxShadow: `0 12px 26px ${alpha('#000000', 0.45)}${focus > 0 ? `, 0 0 ${Math.round(12 + 30 * focus)}px ${alpha(t.fg, 0.3 * focus)}` : ''}`,
        fontFamily: FONT.sans,
        overflow: 'hidden',
      }}
    >
      <Pin color={grey > 0.5 ? C.ink500 : t.fg} />
      {notice.title ? (
        <div style={{ fontFamily: FONT.mono, fontSize: fit, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap', lineHeight: 1.3 }}>{notice.title}</div>
      ) : (
        <div style={{ height: Math.round(size * 1.3), display: 'flex', alignItems: 'center' }}>
          <Redacted width={notice.redactWidth ?? Math.round((width - 2 * padX) * 0.7)} height={Math.round(size * 0.95)} tone={notice.tone ?? 'rose'} />
        </div>
      )}
      {notice.meta ? (
        <div
          style={{
            marginTop: 6,
            fontSize: metaSize,
            fontWeight: 650,
            color: grey > 0.5 ? C.faint : C.muted,
            whiteSpace: 'nowrap',
            textDecoration: grey > 0.5 ? 'line-through' : undefined,
          }}
        >
          {notice.meta}
        </div>
      ) : null}
      {notice.code ? <div style={{ marginTop: 4, fontFamily: FONT.mono, fontSize: codeSize, color: C.faint, whiteSpace: 'nowrap' }}>{notice.code}</div> : null}
      {notice.badge ? (
        <div style={{ position: 'absolute', right: 10, top: 10 }}>
          <span
            style={{
              display: 'inline-block',
              padding: '3px 10px',
              borderRadius: RADIUS.pill,
              background: t.fg,
              color: C.ink950,
              fontSize: FOCUS_TEXT.sub * 0.7,
              fontWeight: 800,
              lineHeight: 1.1,
            }}
          >
            {notice.badge}
          </span>
        </div>
      ) : null}
    </div>
  );
}
