import type { CSSProperties } from 'react';
import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE } from '../../../../../engine/src/theme/motion';
import { clamp01 } from '../../../../../engine/src/ui';
import { FilmLabel, FilmRail, MERIDIAN_FRAMES, ORBITAL_FRAMES, filmLabelHeight, filmRailLayout, type FilmFrame } from '../FilmRail';
import { GroupFrame, groupFrameLayout, type GroupFrameLook } from '../GroupFrame';

// Scene-local composite of s06-grupo (builder B3), reused by s07-nombre and the poster: the GroupFrame holding the
// two films — Meridian's whole film and Orbital's partial one (B1's FilmRail, strip only: no rail, no names) — with
// their victim labels, and the link that joins them with its two marks («fuerte: la ruta del PDB» · «medio:
// proveedor»). Two arrangements: 'row' (side by side, as s03 left them; the stage) and 'stack' (one over the other,
// slot under slot; the poster's narrow frame).

/** Where the group sits on the stage at the end of s06 and the start of s07 (stage-local px): clear of the top band. */
export const GROUP_RECT = { x: 0, y: 232, w: 1728, h: 428 } as const;

export const MARK_STRONG = 'fuerte: la ruta del PDB';
export const MARK_MEDIUM = 'medio: proveedor';

/** Width / height of a film strip (FilmRail's band, Delivery to Actions on Objectives). */
const STRIP = filmRailLayout(1000);
const STRIP_ASPECT = STRIP.strip.w / STRIP.stripBottom;

export type GroupArrange = 'row' | 'stack';

export interface GroupedFilmsOpts {
  compact?: boolean;
  nameSize?: number;
  arrange?: GroupArrange;
  /** 0–1 room kept under the films for the link and its marks (row only). */
  marksRoom?: number;
  /** Victim label size (default 32, compact 24). */
  labelSize?: number;
}

export interface FilmBox {
  /** The strip's box (inner-local px). */
  x: number;
  y: number;
  w: number;
  h: number;
  /** The label's top-left. */
  labelX: number;
  labelY: number;
}

/** Pure layout of the composite: the frame's geometry plus both films, inner-local px. */
export function groupedFilmsLayout(width: number, height: number, opts: GroupedFilmsOpts = {}) {
  const compact = opts.compact ?? false;
  const geo = groupFrameLayout(width, height, { compact, nameSize: opts.nameSize });
  const { w, h } = geo.inner;
  const arrange = opts.arrange ?? 'row';
  const labelSize = opts.labelSize ?? (compact ? 24 : 32);
  const labelH = filmLabelHeight(labelSize);
  const labelGap = Math.round(labelSize * 0.25);
  const room = clamp01(opts.marksRoom ?? 1);
  const markSize = compact ? 24 : 34;
  const marksH = arrange === 'row' ? Math.round((markSize * 1.5 + 34) * room) : 0;

  let films: [FilmBox, FilmBox];
  if (arrange === 'row') {
    const gap = Math.round(Math.max(36, w * 0.04));
    const sw = Math.min((w - gap) / 2, (h - labelH - labelGap - marksH) * STRIP_ASPECT);
    const sh = sw / STRIP_ASPECT;
    const x0 = (w - (2 * sw + gap)) / 2;
    const y = labelH + labelGap;
    films = [
      { x: x0, y, w: sw, h: sh, labelX: x0, labelY: 0 },
      { x: x0 + sw + gap, y, w: sw, h: sh, labelX: x0 + sw + gap, labelY: 0 },
    ];
  } else {
    const gap = Math.round(labelSize * 0.5);
    const sh = Math.min((h - 2 * (labelH + labelGap) - gap) / 2, w / STRIP_ASPECT);
    const sw = sh * STRIP_ASPECT;
    const x0 = (w - sw) / 2;
    const y0 = labelH + labelGap;
    const y1 = y0 + sh + gap + labelH + labelGap;
    films = [
      { x: x0, y: y0, w: sw, h: sh, labelX: x0, labelY: 0 },
      { x: x0, y: y1, w: sw, h: sh, labelX: x0, labelY: y1 - labelH - labelGap },
    ];
  }
  const bottom = Math.max(films[0].y + films[0].h, films[1].y + films[1].h);
  return { geo, films, labelSize, markSize, marksY: bottom + 34, bottom, arrange };
}

export function GroupedFilms({
  width,
  height,
  films = 1,
  link = 0,
  marks = 0,
  compact = false,
  nameSize,
  arrange = 'row',
  marksRoom = 1,
  labelSize,
  glowTone,
  meridianFrames = MERIDIAN_FRAMES,
  orbitalFrames = ORBITAL_FRAMES,
  style,
  ...look
}: GroupFrameLook &
  GroupedFilmsOpts & {
    width: number;
    height: number;
    /** 0–1 the two films and their labels slide in (Meridian from the left, Orbital from the right). */
    films?: number;
    /** 0–1 the link that joins the two films (row only). */
    link?: number;
    /** 0–1 the two marks on the link (row only). */
    marks?: number;
    /** Halo colour of the frame (see GroupFrame `glow`). */
    glowTone?: string;
    meridianFrames?: readonly FilmFrame[];
    orbitalFrames?: readonly FilmFrame[];
    style?: CSSProperties;
  }) {
  const L = groupedFilmsLayout(width, height, { compact, nameSize, arrange, marksRoom, labelSize });
  const f = EASE.out(clamp01(films));
  const lk = EASE.inOut(clamp01(link));
  const mk = clamp01(marks);
  const [m, o] = L.films;
  const slide = (1 - f) * (arrange === 'row' ? 70 : 40);
  const showMarks = arrange === 'row' && marksRoom > 0.05;
  // The link: from the bottom centre of each strip down to one bar under both.
  const ly = L.bottom + 16;
  const lx0 = m.x + m.w * 0.5;
  const lx1 = o.x + o.w * 0.5;

  const film = (box: FilmBox, frames: readonly FilmFrame[], tone: string, name: string, dx: number) => {
    const rail = filmRailLayout(box.w / (STRIP.strip.w / STRIP.width));
    return (
      <>
        <div style={{ position: 'absolute', left: box.labelX + dx, top: box.labelY, opacity: f }}>
          <FilmLabel name={name} tone={tone} size={L.labelSize} />
        </div>
        <div
          style={{
            position: 'absolute',
            left: box.x + dx,
            top: box.y,
            width: box.w,
            height: box.h,
            overflow: 'hidden',
            opacity: f,
          }}
        >
          <div style={{ position: 'absolute', left: -rail.strip.x, top: 0 }}>
            <FilmRail width={rail.width} frames={frames} rail={0} names={0} slots={0} kicker={0} stems={0} thread={1} film={1} tone={tone} />
          </div>
        </div>
      </>
    );
  };

  return (
    <GroupFrame width={width} height={height} compact={compact} nameSize={nameSize} glowTone={glowTone} style={style} {...look}>
      {film(m, meridianFrames, C.cyan, 'Meridian', -slide)}
      {film(o, orbitalFrames, C.cyanSoft, 'Orbital', slide)}

      {showMarks && lk > 0.01 ? (
        <svg width={L.geo.inner.w} height={L.geo.inner.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <path
            d={`M ${lx0} ${L.bottom + 4} L ${lx0} ${ly - 8} Q ${lx0} ${ly} ${lx0 + 8} ${ly} L ${lx1 - 8} ${ly} Q ${lx1} ${ly} ${lx1} ${ly - 8} L ${lx1} ${L.bottom + 4}`}
            fill="none"
            stroke={alpha(C.textStrong, 0.85)}
            strokeWidth={compact ? 3 : 4}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={`${lk} 1`}
          />
        </svg>
      ) : null}
      {showMarks && mk > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: L.marksY - L.markSize * 0.75,
            width: L.geo.inner.w,
            display: 'flex',
            justifyContent: 'center',
            gap: Math.round(L.markSize * 1.4),
            fontFamily: FONT.sans,
            opacity: mk,
            transform: `translateY(${(1 - mk) * 10}px)`,
          }}
        >
          <MarkPill text={MARK_STRONG} color={C.emerald} size={L.markSize} />
          <MarkPill text={MARK_MEDIUM} color={'#fcd34d'} size={L.markSize} />
        </div>
      ) : null}
    </GroupFrame>
  );
}

/** One mark on the link: «fuerte: …» / «medio: …», keyword in the strength colour, a dark pill behind. */
export function MarkPill({ text, color, size = 34, glow = 0, style }: { text: string; color: string; size?: number; glow?: number; style?: CSSProperties }) {
  const i = text.indexOf(':');
  const key = text.slice(0, i + 1);
  const rest = text.slice(i + 1);
  const g = clamp01(glow);
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: Math.round(size * 0.25),
        padding: `${Math.round(size * 0.18)}px ${Math.round(size * 0.55)}px`,
        borderRadius: 999,
        background: alpha(C.ink900, 0.92),
        border: `2px solid ${alpha(color, 0.6 + 0.4 * g)}`,
        boxShadow: g > 0.01 ? `0 0 ${Math.round(22 * g)}px ${alpha(color, 0.45 * g)}` : undefined,
        fontSize: size,
        lineHeight: 1.1,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <span style={{ fontWeight: 850, color }}>{key}</span>
      <span style={{ fontWeight: 700, color: C.textStrong }}>{rest}</span>
    </span>
  );
}
