import type { CSSProperties } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, progress, springIn } from '../../../../engine/src/theme/motion';
import { clamp01, tone as toneOf, type Tone } from '../../../../engine/src/ui';

/**
 * Image «la mesa» (s08, s09; its icon is PromiseIcons' TableIcon): the
 * conclusion as a table SEEN IN PROFILE — tabletop «conclusión: H1» on three
 * legs, E2 at the left end, E4 in the centre, E3 at the right end (E1 is never
 * a leg). Pulling the E4 leg leaves a normal table that STAYS UP: there is no
 * prop that makes the table fall (only `Stool` tips over).
 *
 * Both components draw in design units scaled to `width`; frames are
 * Sequence-relative, `frame` defaults to useCurrentFrame(). Rule for reveal
 * props: omitted → already in the final state.
 */

export type LegId = 'E2' | 'E4' | 'E3';
/** Left to right. */
export const LEG_ORDER: readonly LegId[] = ['E2', 'E4', 'E3'];

export const TABLE_TEXT = {
  top: 'conclusión:',
  topHyp: 'H1',
  watch: 'vigilar',
  stands: 'sin E4, sigue en pie',
  stoolLeg: 'solo E4',
  lowConfidence: 'baja la confianza',
} as const;

/** Design units of the full table (the mini uses the same drawing with bigger type + a caption band). */
export const TABLE_BASE = { w: 760, h: 520, miniCaptionH: 96 } as const;
/** Default px widths. */
export const TABLE_W = 640;
export const TABLE_MINI_W = 420;

const TOP = { x: 30, y: 120, w: 700, h: 84 };
const FLOOR_Y = 470;
const LEG_W = 54;
const LEG_X: Record<LegId, number> = { E2: 92, E4: 380, E3: 668 };

/** Size in px of a ConclusionTable at `width` (pass `mini` for the s09 variant, which adds its caption band). */
export function tableSize(width?: number, mini = false): { w: number; h: number; scale: number } {
  const w = width ?? (mini ? TABLE_MINI_W : TABLE_W);
  const s = w / TABLE_BASE.w;
  return { w, h: (TABLE_BASE.h + (mini ? TABLE_BASE.miniCaptionH : 0)) * s, scale: s };
}

/** Centre (px from the table's top-left) of a leg's label, for anchoring arrows / hands. */
export function tableLegCenter(leg: LegId, width?: number, mini = false): { x: number; y: number } {
  const { scale } = tableSize(width, mini);
  return { x: LEG_X[leg] * scale, y: ((TOP.y + TOP.h + FLOOR_Y) / 2) * scale };
}

/**
 * ConclusionTable — props:
 *   width?        px (default 640; 420 when `mini`)
 *   at?           frame the tabletop lands. Omitted: on screen.
 *   legsAt?       frame the legs slide in under it (staggered E2, E4, E3), or one frame per leg. Omitted: standing.
 *   pullAt?       frame the centre leg E4 is pulled out (it slides away sideways and fades; a dashed
 *                 ghost stays; the table settles with a tiny wobble and stays up).
 *   focusLeg?     { leg, from, to? } — glow on one leg (e.g. the strong link before it is pulled).
 *   mini?         s09 miniature: bigger type for its size, E4 drawn dashed amber with a «vigilar» tag,
 *                 caption «sin E4, sigue en pie» under it.
 *   watchAt?      mini: frame the «vigilar» tag lands (omitted: shown).
 *   captionAt?    mini: frame the caption appears (omitted: shown).
 *   caption?      full table: an optional caption under the floor { text, at?, tone? } (no default text).
 *   dim?, glow? (0–1 emerald halo on the tabletop), frame?, style?
 */
export function ConclusionTable({
  width,
  at,
  legsAt,
  pullAt,
  focusLeg,
  mini = false,
  watchAt,
  captionAt,
  caption,
  dim = 0,
  glow = 0,
  frame: frameProp,
  style,
}: {
  width?: number;
  at?: number;
  legsAt?: number | Partial<Record<LegId, number>>;
  pullAt?: number;
  focusLeg?: { leg: LegId; from: number; to?: number };
  mini?: boolean;
  watchAt?: number;
  captionAt?: number;
  caption?: { text: string; at?: number; tone?: Tone };
  dim?: number;
  glow?: number;
  frame?: number;
  style?: CSSProperties;
}) {
  const current = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = frameProp ?? current;
  const size = tableSize(width, mini);
  const s = size.scale;

  const show = at === undefined ? 1 : progress(frame, at, 16);
  if (show <= 0) return null;

  const legT = (leg: LegId): number | undefined => {
    if (legsAt === undefined) return undefined;
    if (typeof legsAt === 'number') return legsAt + LEG_ORDER.indexOf(leg) * 8;
    return legsAt[leg] ?? Number.POSITIVE_INFINITY;
  };
  const legIn = (leg: LegId) => {
    const t = legT(leg);
    return t === undefined ? 1 : frame < t ? 0 : springIn(frame, fps, t, { damping: 15 });
  };
  const pulled = mini || pullAt === undefined ? 0 : progress(frame, pullAt, 26, EASE.inOut);
  // A small settle after the pull: it holds (decaying ±0.7°).
  const settle = mini || pullAt === undefined ? 0 : frame < pullAt + 10 ? 0 : Math.sin(((frame - pullAt - 10) / fps) * Math.PI * 3) * 0.7 * Math.exp(-(frame - pullAt - 10) / 14);
  const focusW = focusLeg ? progress(frame, focusLeg.from - 4, 10) * (focusLeg.to === undefined ? 1 : 1 - progress(frame, focusLeg.to - 4, 10)) : 0;
  const watch = mini ? (watchAt === undefined ? 1 : frame < watchAt ? 0 : springIn(frame, fps, watchAt, { damping: 13 })) : 0;
  const capIn = mini ? (captionAt === undefined ? 1 : progress(frame, captionAt, 14)) : 0;
  const extraCap = !mini && caption ? (caption.at === undefined ? 1 : progress(frame, caption.at, 14)) : 0;
  const d = clamp01(dim);
  const g = clamp01(glow);

  // Type sizes: the mini is drawn small, so its type is bigger in design units.
  const topSize = mini ? 72 : 48;
  const legSize = mini ? 58 : 40;
  const stroke = mini ? 5 : 3;

  const topDrop = (1 - show) * -30;

  return (
    <div style={{ position: 'relative', width: size.w, height: size.h, opacity: show * (1 - 0.6 * d), filter: d > 0.001 ? `saturate(${1 - 0.5 * d})` : undefined, ...style }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: TABLE_BASE.w, height: size.h / s, transform: `scale(${s})`, transformOrigin: '0 0', fontFamily: FONT.sans }}>
        {/* Floor + soft shadow */}
        <div style={{ position: 'absolute', left: 0, top: FLOOR_Y, width: TABLE_BASE.w, height: stroke + 1, borderRadius: 3, background: alpha(C.muted, 0.55) }} />
        <div style={{ position: 'absolute', left: TOP.x + 30, top: FLOOR_Y - 10, width: TOP.w - 60, height: 20, borderRadius: '50%', background: alpha('#000000', 0.35), filter: 'blur(8px)' }} />

        {/* Rotating body (the settle wobble pivots on the floor) */}
        <div style={{ position: 'absolute', inset: 0, transform: `rotate(${settle}deg)`, transformOrigin: `${TABLE_BASE.w / 2}px ${FLOOR_Y}px` }}>
          {LEG_ORDER.map((leg) => {
            const p = legIn(leg);
            if (p <= 0.001) return null;
            const isE4 = leg === 'E4';
            const pull = isE4 ? pulled : 0;
            const watched = isE4 && mini;
            const fl = focusLeg?.leg === leg ? focusW : 0;
            const legTop = TOP.y + TOP.h - 6;
            const legH = FLOOR_Y - legTop;
            const fg = watched ? C.amber : C.cyan;
            return (
              <div key={leg}>
                {/* Ghost of the pulled leg */}
                {isE4 && pull > 0 ? (
                  <div
                    style={{
                      position: 'absolute',
                      left: LEG_X[leg] - LEG_W / 2,
                      top: legTop,
                      width: LEG_W,
                      height: legH,
                      boxSizing: 'border-box',
                      border: `3px dashed ${alpha(C.muted, 0.55 * clamp01(pull * 1.5))}`,
                      borderRadius: 8,
                    }}
                  />
                ) : null}
                <div
                  style={{
                    position: 'absolute',
                    left: LEG_X[leg] - LEG_W / 2,
                    top: legTop,
                    width: LEG_W,
                    height: legH,
                    // Pulled out sideways along the floor (it never sinks through it), tilting as it goes.
                    transform: `translate(${pull * 170}px, ${(1 - p) * -40 - pull * 6}px) rotate(${pull * 9}deg)`,
                    transformOrigin: '50% 100%',
                    opacity: Math.min(1, p * 1.5) * (1 - clamp01((pull - 0.5) / 0.5)),
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      boxSizing: 'border-box',
                      borderRadius: 8,
                      border: `${stroke}px ${watched ? 'dashed' : 'solid'} ${alpha(fg, 0.9)}`,
                      background: watched ? alpha(C.amber, 0.1) : `linear-gradient(90deg, ${alpha(C.cyan, 0.32)} 0%, ${alpha(C.cyanDeep, 0.5)} 100%)`,
                      boxShadow: fl > 0.01 ? `0 0 ${Math.round(30 * fl)}px ${alpha(C.amber, 0.7 * fl)}` : undefined,
                    }}
                  />
                  {/* Leg label */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: legH * 0.42,
                      transform: 'translate(-50%, -50%)',
                      padding: mini ? '4px 14px' : '4px 12px',
                      borderRadius: RADIUS.sm,
                      background: C.ink950,
                      border: `${stroke}px solid ${fl > 0.3 ? C.amber : alpha(fg, 0.9)}`,
                      color: C.textStrong,
                      fontSize: legSize,
                      fontWeight: 850,
                      lineHeight: 1.1,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {leg}
                  </div>
                  {/* «vigilar» (mini) */}
                  {watched && watch > 0.001 ? (
                    <div
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: legH * 0.42 + 64,
                        transform: `translateX(-50%) scale(${0.6 + 0.4 * watch})`,
                        opacity: Math.min(1, watch * 1.4),
                        padding: '6px 18px',
                        borderRadius: RADIUS.pill,
                        background: C.amber,
                        color: C.ink950,
                        fontSize: 58,
                        fontWeight: 850,
                        whiteSpace: 'nowrap',
                        boxShadow: `0 0 26px ${alpha(C.amber, 0.45)}`,
                      }}
                    >
                      {TABLE_TEXT.watch}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}

          {/* Tabletop */}
          <div
            style={{
              position: 'absolute',
              left: TOP.x,
              top: TOP.y + topDrop,
              width: TOP.w,
              height: TOP.h,
              boxSizing: 'border-box',
              borderRadius: 12,
              border: `${stroke + 1}px solid ${alpha(C.emerald, 0.85)}`,
              background: `linear-gradient(180deg, ${C.ink700} 0%, ${C.ink800} 100%)`,
              boxShadow: `0 16px 30px ${alpha('#000000', 0.45)}${g > 0 ? `, 0 0 ${Math.round(24 + 30 * g)}px ${alpha(C.emerald, 0.4 * g)}` : ''}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: topSize, fontWeight: 800, color: C.textStrong, lineHeight: 1 }}>{TABLE_TEXT.top}</span>
            <span style={{ fontSize: topSize, fontWeight: 900, color: '#6ee7b7', lineHeight: 1 }}>{TABLE_TEXT.topHyp}</span>
          </div>
        </div>

        {/* Mini caption */}
        {mini && capIn > 0 ? (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: FLOOR_Y + 20,
              width: TABLE_BASE.w,
              height: TABLE_BASE.miniCaptionH + TABLE_BASE.h - FLOOR_Y - 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 64,
              fontWeight: 850,
              color: '#6ee7b7',
              whiteSpace: 'nowrap',
              opacity: capIn,
              transform: `translateY(${(1 - capIn) * 10}px)`,
            }}
          >
            {TABLE_TEXT.stands}
          </div>
        ) : null}
        {/* Optional caption (full table) */}
        {!mini && caption && extraCap > 0 ? (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: FLOOR_Y + 8,
              width: TABLE_BASE.w,
              height: TABLE_BASE.h - FLOOR_Y - 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 40,
              fontWeight: 800,
              color: toneOf(caption.tone ?? 'emerald').soft,
              whiteSpace: 'nowrap',
              opacity: extraCap,
            }}
          >
            {caption.text}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Design units of the stool (with the room it needs to fall into, on the side it falls). */
export const STOOL_BASE = { w: 760, h: 520 } as const;
export const STOOL_W = 420;

/** Size in px of a Stool at `width`. The drawing reserves room on the `direction` side for the fall. */
export function stoolSize(width = STOOL_W): { w: number; h: number; scale: number } {
  const s = width / STOOL_BASE.w;
  return { w: width, h: STOOL_BASE.h * s, scale: s };
}

/**
 * Stool — the contrast: a one-legged stool, its leg «solo E4», that tips over;
 * then «baja la confianza» (amber). Props:
 *   width?       px (default 420; the box includes room for the fall)
 *   at?          frame it appears. Omitted: on screen.
 *   tipAt?       frame it starts to tip (falls in ~22 frames, bounces once on the floor). Omitted: standing.
 *   labelAt?     frame «baja la confianza» appears (default tipAt + 22; omitted with no tipAt: hidden).
 *   direction?   'right' (default) or 'left' — the side it falls to.
 *   dim?, frame?, style?
 */
export function Stool({
  width = STOOL_W,
  at,
  tipAt,
  labelAt,
  direction = 'right',
  dim = 0,
  frame: frameProp,
  style,
}: {
  width?: number;
  at?: number;
  tipAt?: number;
  labelAt?: number;
  direction?: 'right' | 'left';
  dim?: number;
  frame?: number;
  style?: CSSProperties;
}) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const { scale: s } = stoolSize(width);
  const show = at === undefined ? 1 : progress(frame, at, 16);
  if (show <= 0) return null;

  // The foot sits a quarter in from the side opposite the fall, so the fall has room.
  const footX = direction === 'right' ? 220 : STOOL_BASE.w - 220;
  const seatW = 230;
  const seatH = 42;
  const seatBottom = 300; // above the floor
  const legW = 50;
  // It pivots on the foot's leading corner; the seat's leading corner meets the floor at ≈ 73°.
  const pivotX = footX + (direction === 'right' ? legW / 2 : -legW / 2);
  const rest = (Math.atan(seatBottom / (seatW / 2 - legW / 2)) * 180) / Math.PI;
  let angle = 0;
  if (tipAt !== undefined && frame >= tipAt) {
    const fall = progress(frame, tipAt, 22, EASE.in);
    const bounce = frame > tipAt + 22 ? Math.sin(((frame - tipAt - 22) / 10) * Math.PI) * 5 * Math.exp(-(frame - tipAt - 22) / 8) : 0;
    angle = fall * rest - Math.max(0, bounce);
  }
  const signed = direction === 'right' ? angle : -angle;
  const lAt = labelAt ?? (tipAt === undefined ? undefined : tipAt + 22);
  const label = lAt === undefined ? 0 : progress(frame, lAt, 14);
  const d = clamp01(dim);

  return (
    <div style={{ position: 'relative', width, height: STOOL_BASE.h * s, opacity: show * (1 - 0.6 * d), filter: d > 0.001 ? `saturate(${1 - 0.5 * d})` : undefined, ...style }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: STOOL_BASE.w, height: STOOL_BASE.h, transform: `scale(${s})`, transformOrigin: '0 0', fontFamily: FONT.sans }}>
        {/* Floor */}
        <div style={{ position: 'absolute', left: 0, top: FLOOR_Y, width: STOOL_BASE.w, height: 4, borderRadius: 3, background: alpha(C.muted, 0.55) }} />
        {/* The stool, pivoting on its foot */}
        <div style={{ position: 'absolute', inset: 0, transform: `rotate(${signed}deg)`, transformOrigin: `${pivotX}px ${FLOOR_Y}px` }}>
          {/* Leg */}
          <div
            style={{
              position: 'absolute',
              left: footX - legW / 2,
              top: FLOOR_Y - seatBottom,
              width: legW,
              height: seatBottom,
              boxSizing: 'border-box',
              borderRadius: 8,
              border: `3px solid ${alpha(C.amber, 0.9)}`,
              background: `linear-gradient(90deg, ${alpha(C.amber, 0.28)} 0%, ${alpha(C.amberDeep, 0.6)} 100%)`,
            }}
          />
          {/* Leg label «solo E4» */}
          <div
            style={{
              position: 'absolute',
              left: footX,
              top: FLOOR_Y - seatBottom * 0.5,
              transform: 'translate(-50%, -50%)',
              padding: '4px 14px',
              borderRadius: RADIUS.sm,
              background: C.ink950,
              border: `3px solid ${alpha(C.amber, 0.9)}`,
              color: C.textStrong,
              fontSize: 40,
              fontWeight: 850,
              whiteSpace: 'nowrap',
            }}
          >
            {TABLE_TEXT.stoolLeg}
          </div>
          {/* Seat */}
          <div
            style={{
              position: 'absolute',
              left: footX - seatW / 2,
              top: FLOOR_Y - seatBottom - seatH,
              width: seatW,
              height: seatH,
              boxSizing: 'border-box',
              borderRadius: 12,
              border: `4px solid ${alpha(C.text, 0.75)}`,
              background: `linear-gradient(180deg, ${C.ink700} 0%, ${C.ink800} 100%)`,
              boxShadow: `0 12px 24px ${alpha('#000000', 0.4)}`,
            }}
          />
        </div>
        {/* «baja la confianza» */}
        {label > 0 ? (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 40,
              width: STOOL_BASE.w,
              display: 'flex',
              justifyContent: 'center',
              opacity: label,
              transform: `translateY(${(1 - label) * -10}px)`,
            }}
          >
            <span
              style={{
                padding: '8px 26px',
                borderRadius: RADIUS.md,
                border: `4px solid ${C.amber}`,
                background: alpha(C.ink950, 0.85),
                color: '#fcd34d',
                fontSize: 52,
                fontWeight: 850,
                whiteSpace: 'nowrap',
              }}
            >
              {TABLE_TEXT.lowConfidence}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
