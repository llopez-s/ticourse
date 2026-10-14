import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, alpha } from '../../engine/src/theme/tokens';
import { cubicPoint, type Point } from '../../engine/src/ui';
import { Channel, G, ListenerGlyph, SHOP_H, SHOP_W, Shop, WalkieGlyph, walkieTip } from './scenes/parts/Shop';

/** The crop of the shop's design space the poster shows: room on the left and above for the two far ends. */
const VIEW = { x: -190, y: -86, w: 1190, h: SHOP_H + 86 } as const;

/** The poster's image in px. */
export const POSTER_ART = { w: 1010, h: (1010 * VIEW.h) / VIEW.w } as const;
const S = POSTER_ART.w / VIEW.w;
const px = (x: number, y: number) => ({ left: (x - VIEW.x) * S, top: (y - VIEW.y) * S });

const TIP = walkieTip(G.suspect.x, G.floor, G.suspect.h);
/** Where the walkie nobody answers hangs: the far end of the left-hand channel (above the roof, on the backdrop). */
const NOBODY = { x: -100, y: -26 } as const;
/** The left-hand channel is the shared one mirrored about the suspect's antenna: its far end in that mirror. */
const NOBODY_M = { x: 2 * TIP.x - NOBODY.x, y: NOBODY.y } as const;
/** Still phases: one call on its way out on each channel. */
const PHASE = { cut: 0.8, watch: 0.62 } as const;

/**
 * The poster draws the far ends bigger than the Channel does (thumbnail legibility): the channel is
 * drawn up to DRAWN, which leaves its own far-end glyph out, and a bigger one goes where the line
 * stops. `curveOf` mirrors the Channel's own bends (parts/shop/Walkie.tsx).
 */
const DRAWN = 0.9;
const curveOf = (from: Point, to: Point): [Point, Point, Point, Point] => [from, { x: from.x + 12, y: from.y - 190 }, { x: to.x - 230, y: to.y - 104 }, { x: to.x - 20, y: to.y + 4 }];
const lineEnd = (to: Point): Point => {
  const p = cubicPoint(curveOf(TIP, to), DRAWN);
  return { x: p.x + 28, y: p.y + 4 };
};
const GHOST_M = lineEnd(NOBODY_M);
const GHOST = { x: 2 * TIP.x - GHOST_M.x, y: GHOST_M.y } as const;
const BOSS = lineEnd(G.far);
const TAP = cubicPoint(curveOf(TIP, G.far), 0.74);
const LISTENER = { x: TAP.x + 10, y: TAP.y + 66 } as const;

function Tag({ children, tone, style }: { children: ReactNode; tone: string; style: CSSProperties }) {
  return (
    <div
      style={{
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        padding: '4px 20px 6px',
        borderRadius: 14,
        border: `3px solid ${alpha(tone, 0.8)}`,
        background: alpha(C.ink950, 0.92),
        boxShadow: `0 0 24px ${alpha(tone, 0.25)}`,
        fontFamily: FONT.sans,
        fontSize: 36,
        lineHeight: 1.1,
        fontWeight: 900,
        letterSpacing: 1,
        color: tone,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/**
 * The video in one image: the neighbourhood shop, the suspect inside on his walkie (amber) and the safe
 * closed (emerald), between the two things you can do about the call. On the left, the walkie nobody
 * answers any more (DENY: the far half of the channel goes dashed grey); on the right, a noisy channel
 * with someone listening (DETECT + DEGRADE). Nothing is chosen. No shutter and nobody walked out: the
 * C2 is only ever the walkie. No domain, date or machine name.
 */
export function PosterArt() {
  return (
    <div style={{ position: 'relative', width: POSTER_ART.w, height: POSTER_ART.h }}>
      <svg width={POSTER_ART.w} height={POSTER_ART.h} viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <radialGradient id="poster-cut">
            <stop offset="0%" stopColor={C.emerald} stopOpacity={0.2} />
            <stop offset="100%" stopColor={C.emerald} stopOpacity={0} />
          </radialGradient>
          <radialGradient id="poster-watch">
            <stop offset="0%" stopColor={C.cyan} stopOpacity={0.2} />
            <stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={GHOST.x} cy={GHOST.y + 40} r={230} fill="url(#poster-cut)" />
        <circle cx={LISTENER.x + 40} cy={LISTENER.y - 20} r={300} fill="url(#poster-watch)" />

        {/* The shop, exactly as the video draws it (a nested <svg>: same design units) */}
        <Shop width={SHOP_W} suspect={1} safe={1} />

        {/* Left: nobody answers. The shared channel, mirrored about the suspect's antenna. */}
        <g transform={`translate(${2 * TIP.x} 0) scale(-1 1)`}>
          <Channel from={TIP} to={NOBODY_M} state={{ draw: DRAWN, talk: 1, nobody: 1, phase: PHASE.cut }} />
          <WalkieGlyph x={GHOST_M.x} y={GHOST_M.y} h={112} ghost={1} />
        </g>
        {/* Right: a noisy channel, and someone listening on it. */}
        <Channel from={TIP} to={G.far} state={{ draw: DRAWN, talk: 1, noisy: 1, listener: 1, phase: PHASE.watch }} />
        <WalkieGlyph x={BOSS.x} y={BOSS.y} h={104} />
        <ListenerGlyph x={LISTENER.x} y={LISTENER.y} size={84} />
      </svg>

      <Tag tone={C.emerald} style={px(GHOST.x - 26, GHOST.y + 106)}>
        DENY
      </Tag>
      <Tag tone={C.cyan} style={px(750, -46)}>
        DETECT <span style={{ color: C.muted, fontWeight: 700 }}>+</span> <span style={{ color: C.amber }}>DEGRADE</span>
      </Tag>
    </div>
  );
}
