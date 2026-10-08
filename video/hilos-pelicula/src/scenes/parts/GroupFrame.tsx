import { useId, type CSSProperties, type ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { EASE } from '../../../../engine/src/theme/motion';
import { clamp01, mix } from '../../../../engine/src/ui';

// Owner: builder B3 (out/scene-brief.md «Ownership»). Read-only for everyone else (B4 imports it in s08–s10).

/**
 * «El marco del grupo» — the frame that holds two films (two activity threads) once they are joined: V14's image of
 * an activity group. ONE drawing in every state; s06 builds it, s07 hangs its blank name tag, s08/s10 reuse it.
 *
 *   empty frame drawing on ...... <GroupFrame width={w} height={h} draw={p}>{films}</GroupFrame>
 *   named (s06 `group`) ......... <GroupFrame … draw={1} name={1} candidate={1} />
 *   blank tag (s07 `blank`) ..... <GroupFrame … draw={1} name={1} candidate={1} tag={1} tagFocus={k} />
 *   miniature (s08 / s10) ....... <GroupFrame … compact draw={1} name={1} />
 *
 * Layout (all px from the frame's top-left; `groupFrameLayout(width, height, opts)` returns the same numbers, pure):
 * - a HEADER band inside the top edge: «ACTIVITY GROUP» (upper case, violet: the exam entrance) on the left, the
 *   «candidato» pill right after it, and the blank name tag hanging from an eyelet on the top edge at the RIGHT end.
 *   The header band is reserved even before the name drops, so the films never move when it does.
 * - the INNER rect under it: children are rendered in an absolutely positioned div covering `inner`; place the films
 *   with stage-free, inner-local coordinates (0,0 = inner top-left). Nothing is clipped.
 *
 * Look (0–1 weights; nothing reads the timeline, nothing is positioned — wrap it in an absolute div):
 * - `draw`      — the frame draws itself: viewfinder corners first (0–0.45), then the edges trace round (0.3–1) and
 *                 the fill comes up. Children are shown regardless (fade them yourself).
 * - `name`      — «ACTIVITY GROUP» rises in, with its violet underline.
 * - `candidate` — the dashed «candidato» pill (the group is a candidate: two threads); `candidateFocus` glows it.
 * - `tag`       — the blank name tag swings in on its string: a paper tag that reads «sin nombre» in grey (its name
 *                 field is empty). `tagFocus` glows it (the voice is on it).
 * - `glow`      — a soft neutral halo round the whole frame; `dim` — step back (another element is in focus).
 * - `compact`   — miniature sizes (name 28 px, thinner padding, smaller tag); `nameSize` overrides the name size.
 *
 * Colours: the frame itself is NEUTRAL (light ink): it is the analyst's grouping, neither victim (cyan) nor attacker
 * (rose); violet only on the ACTIVITY GROUP name. No group name of any kind is ever drawn (never VELVET CICADA, never
 * GLASS VIPER): the tag is blank on purpose.
 */

export interface GroupFrameLook {
  draw?: number;
  name?: number;
  candidate?: number;
  candidateFocus?: number;
  tag?: number;
  tagFocus?: number;
  glow?: number;
  dim?: number;
}

export interface GroupFrameOpts {
  /** Miniature sizes for s08/s10. */
  compact?: boolean;
  /** Px size of «ACTIVITY GROUP» (default 46, compact 28). */
  nameSize?: number;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface GroupFrameGeometry {
  /** Padding between the frame's edge and its content. */
  pad: number;
  /** Header band (name, pill, tag), inside the top edge. */
  header: Rect;
  /** Where children go. */
  inner: Rect;
  /** The blank tag's box before its small tilt (it hangs from `eyelet`). */
  tag: Rect;
  /** Where the tag's string is tied, on the top edge. */
  eyelet: { x: number; y: number };
  /** Name size actually used. */
  nameSize: number;
}

/** The text on the blank tag (its name field is empty). */
export const GROUP_TAG_TEXT = 'sin nombre';
export const GROUP_NAME = 'ACTIVITY GROUP';
export const GROUP_CANDIDATE = 'candidato';

/** Pure geometry of a GroupFrame `width` × `height` px (same numbers the drawing uses). */
export function groupFrameLayout(width: number, height: number, opts: GroupFrameOpts = {}): GroupFrameGeometry {
  const compact = opts.compact ?? false;
  const nameSize = opts.nameSize ?? (compact ? 28 : 46);
  const pad = Math.round(compact ? Math.max(10, nameSize * 0.45) : Math.max(16, nameSize * 0.48));
  const headerH = Math.round(nameSize * 1.62);
  const header = { x: pad, y: Math.round(pad * 0.7), w: width - 2 * pad, h: headerH };
  const innerY = header.y + headerH + Math.round(pad * 0.55);
  const inner = { x: pad, y: innerY, w: width - 2 * pad, h: Math.max(0, height - innerY - pad) };
  const tagH = Math.round(nameSize * 1.36);
  const tagW = Math.round(tagH * 4.1);
  const tag = { x: width - pad - tagW, y: header.y + Math.round((headerH - tagH) / 2) + Math.round(nameSize * 0.12), w: tagW, h: tagH };
  const eyelet = { x: tag.x + Math.round(tagH * 0.32), y: 0 };
  return { pad, header, inner, tag, eyelet, nameSize };
}

const EDGE = alpha(C.textStrong, 0.42);
const CORNER = alpha(C.textStrong, 0.92);
const NAME = '#c4b5fd';
const PAPER = '#e7ecf3';
const PAPER_EDGE = '#b8c2d1';
const INK_GREY = '#5f6b7e';

function sub(t: number, a: number, b: number): number {
  return clamp01((t - a) / (b - a));
}

/** The frame's outline as one path (rounded rect), for the draw-on stroke. */
function outline(w: number, h: number, r: number): string {
  return [
    `M ${r} 0`,
    `L ${w - r} 0`,
    `Q ${w} 0 ${w} ${r}`,
    `L ${w} ${h - r}`,
    `Q ${w} ${h} ${w - r} ${h}`,
    `L ${r} ${h}`,
    `Q 0 ${h} 0 ${h - r}`,
    `L 0 ${r}`,
    `Q 0 0 ${r} 0`,
    'Z',
  ].join(' ');
}

export function GroupFrame({
  width,
  height,
  compact = false,
  nameSize,
  glowTone = C.text,
  children,
  style,
  ...look
}: GroupFrameLook &
  GroupFrameOpts & {
    width: number;
    height: number;
    glowTone?: string;
    /** The films (inner-local coordinates). */
    children?: ReactNode;
    style?: CSSProperties;
  }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const geo = groupFrameLayout(width, height, { compact, nameSize });
  const draw = clamp01(look.draw ?? 1);
  const name = clamp01(look.name ?? 0);
  const cand = clamp01(look.candidate ?? 0);
  const candFocus = clamp01(look.candidateFocus ?? 0);
  const tag = clamp01(look.tag ?? 0);
  const tagFocus = clamp01(look.tagFocus ?? 0);
  const glow = clamp01(look.glow ?? 0);
  const dim = clamp01(look.dim ?? 0);

  const r = compact ? RADIUS.md : RADIUS.lg;
  const sw = compact ? 2.4 : 3;
  const csw = compact ? 4 : 5.5;
  const cornerLen = Math.min(width, height) * (compact ? 0.16 : 0.12);
  const corners = EASE.out(sub(draw, 0, 0.45));
  const edges = EASE.inOut(sub(draw, 0.3, 1));
  const fill = sub(draw, 0.35, 1);

  const ns = geo.nameSize;
  const filters = [
    glow > 0.01 ? `drop-shadow(0 0 ${Math.round(10 + 22 * glow)}px ${alpha(glowTone, 0.35 * glow)})` : '',
    dim > 0.01 ? `saturate(${1 - 0.5 * dim})` : '',
  ]
    .filter(Boolean)
    .join(' ');

  // Corner brackets: an L at each corner, growing out of the corner.
  const L = cornerLen * corners;
  const cornerPaths =
    corners > 0.01
      ? [
          `M 0 ${r + L} L 0 ${r} Q 0 0 ${r} 0 L ${r + L} 0`,
          `M ${width - r - L} 0 L ${width - r} 0 Q ${width} 0 ${width} ${r} L ${width} ${r + L}`,
          `M ${width} ${height - r - L} L ${width} ${height - r} Q ${width} ${height} ${width - r} ${height} L ${width - r - L} ${height}`,
          `M ${r + L} ${height} L ${r} ${height} Q 0 ${height} 0 ${height - r} L 0 ${height - r - L}`,
        ]
      : [];

  // The tag swings in on its string and settles at a small tilt.
  const swing = EASE.out(tag);
  const tilt = mix(-16, -3, swing);
  const tagDrop = (1 - swing) * -18;
  const hole = { x: geo.tag.x + geo.tag.h * 0.32, y: geo.tag.y + geo.tag.h / 2 };

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        opacity: 1 - 0.6 * dim,
        filter: filters || undefined,
        fontFamily: FONT.sans,
        ...style,
      }}
    >
      <svg width={width} height={height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <defs>
          <linearGradient id={`gf-${uid}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={alpha(C.ink800, 0.55)} />
            <stop offset="100%" stopColor={alpha(C.ink900, 0.4)} />
          </linearGradient>
        </defs>
        {fill > 0.01 ? <path d={outline(width, height, r)} fill={`url(#gf-${uid}-fill)`} opacity={fill} /> : null}
        {edges > 0.001 ? (
          <path d={outline(width, height, r)} fill="none" stroke={EDGE} strokeWidth={sw} pathLength={1} strokeDasharray={`${edges} 1`} strokeLinejoin="round" />
        ) : null}
        {cornerPaths.map((d, k) => (
          <path key={k} d={d} fill="none" stroke={CORNER} strokeWidth={csw} strokeLinecap="round" strokeLinejoin="round" />
        ))}
        {/* Eyelet and string of the blank tag */}
        {tag > 0.01 ? (
          <g opacity={Math.min(1, tag * 2)}>
            <circle cx={geo.eyelet.x} cy={geo.eyelet.y} r={compact ? 5 : 7} fill={C.ink900} stroke={CORNER} strokeWidth={compact ? 2 : 2.6} />
            <path
              d={`M ${geo.eyelet.x} ${geo.eyelet.y} C ${geo.eyelet.x - 6} ${geo.eyelet.y + 14}, ${hole.x - 4} ${hole.y + tagDrop - 16}, ${hole.x} ${hole.y + tagDrop}`}
              fill="none"
              stroke={alpha(PAPER_EDGE, 0.9)}
              strokeWidth={compact ? 1.6 : 2.2}
              strokeLinecap="round"
            />
          </g>
        ) : null}
      </svg>

      {/* Header: the name and the candidate pill */}
      {name > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: geo.header.x,
            top: geo.header.y,
            height: geo.header.h,
            display: 'flex',
            alignItems: 'center',
            gap: Math.round(ns * 0.42),
            opacity: name,
            transform: `translateY(${(1 - name) * 12}px)`,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: ns,
                fontWeight: 900,
                letterSpacing: Math.round(ns * 0.05),
                color: NAME,
                lineHeight: 1,
                whiteSpace: 'nowrap',
                textShadow: `0 0 ${Math.round(ns * 0.4)}px ${alpha(C.violet, 0.45)}`,
              }}
            >
              {GROUP_NAME}
            </span>
            <div
              style={{
                height: compact ? 3 : 4,
                width: Math.round(ns * 2.2 * EASE.out(sub(name, 0.3, 1))),
                background: C.violet,
                borderRadius: 2,
                marginTop: Math.round(ns * 0.16),
              }}
            />
          </div>
          {cand > 0.01 ? (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: `${Math.round(ns * 0.12)}px ${Math.round(ns * 0.42)}px`,
                borderRadius: RADIUS.pill,
                border: `${compact ? 2 : 2.5}px dashed ${alpha(NAME, 0.65 + 0.35 * candFocus)}`,
                background: alpha(C.violet, 0.08 + 0.14 * candFocus),
                boxShadow: candFocus > 0.02 ? `0 0 ${Math.round(24 * candFocus)}px ${alpha(C.violet, 0.5 * candFocus)}` : undefined,
                fontSize: Math.round(ns * 0.78),
                fontWeight: 700,
                color: candFocus > 0.4 ? C.textStrong : '#ddd6fe',
                lineHeight: 1.1,
                whiteSpace: 'nowrap',
                opacity: cand,
                transform: `translateX(${(1 - cand) * -10}px) scale(${1 + 0.05 * candFocus})`,
                transformOrigin: 'left center',
                marginBottom: Math.round(ns * 0.2),
              }}
            >
              {GROUP_CANDIDATE}
            </span>
          ) : null}
        </div>
      ) : null}

      {/* The blank name tag */}
      {tag > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: geo.tag.x,
            top: geo.tag.y + tagDrop,
            width: geo.tag.w,
            height: geo.tag.h,
            opacity: Math.min(1, tag * 1.6),
            transform: `rotate(${tilt}deg)`,
            transformOrigin: `${geo.tag.h * 0.32}px 50%`,
            filter: tagFocus > 0.01 ? `drop-shadow(0 0 ${Math.round(6 + 16 * tagFocus)}px ${alpha('#e2e8f0', 0.55 * tagFocus)})` : undefined,
          }}
        >
          <svg width={geo.tag.w} height={geo.tag.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            {/* Luggage-tag shape: clipped corners at the string end, a reinforced hole */}
            <path
              d={`M ${geo.tag.h * 0.42} 1 L ${geo.tag.w - 6} 1 Q ${geo.tag.w - 1} 1 ${geo.tag.w - 1} 6 L ${geo.tag.w - 1} ${geo.tag.h - 6} Q ${geo.tag.w - 1} ${geo.tag.h - 1} ${geo.tag.w - 6} ${geo.tag.h - 1} L ${geo.tag.h * 0.42} ${geo.tag.h - 1} L 1 ${geo.tag.h * 0.68} L 1 ${geo.tag.h * 0.32} Z`}
              fill={PAPER}
              stroke={PAPER_EDGE}
              strokeWidth={compact ? 1.5 : 2}
              strokeLinejoin="round"
            />
            <circle cx={geo.tag.h * 0.32} cy={geo.tag.h / 2} r={geo.tag.h * 0.14} fill="none" stroke={PAPER_EDGE} strokeWidth={compact ? 2 : 3} />
            <circle cx={geo.tag.h * 0.32} cy={geo.tag.h / 2} r={geo.tag.h * 0.07} fill={C.ink900} />
            {/* The empty name field: a faint rule where a name would go */}
            <line
              x1={geo.tag.h * 0.72}
              y1={geo.tag.h * 0.8}
              x2={geo.tag.w - geo.tag.h * 0.3}
              y2={geo.tag.h * 0.8}
              stroke={alpha(INK_GREY, 0.45)}
              strokeWidth={compact ? 1.2 : 1.6}
              strokeDasharray="5 5"
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              left: geo.tag.h * 0.68,
              top: 0,
              width: geo.tag.w - geo.tag.h * 0.68 - geo.tag.h * 0.2,
              height: geo.tag.h * 0.78,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: Math.round(geo.tag.h * 0.54),
              fontWeight: 650,
              color: INK_GREY,
              whiteSpace: 'nowrap',
              lineHeight: 1,
            }}
          >
            {GROUP_TAG_TEXT}
          </div>
        </div>
      ) : null}

      {/* The films */}
      {children ? (
        <div style={{ position: 'absolute', left: geo.inner.x, top: geo.inner.y, width: geo.inner.w, height: geo.inner.h }}>{children}</div>
      ) : null}
    </div>
  );
}
