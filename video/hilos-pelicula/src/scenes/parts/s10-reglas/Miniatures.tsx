import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../../engine/src/theme/motion';
import { clamp01 } from '../../../../../engine/src/ui';
import { WorkshopLabel, workshopLabelHeight } from '../WorkshopLabel';
import { ProjectionBeam } from '../s08-grafo/Projection';
import { MiniStrip, miniStripLayout, type MiniFrame } from './MiniFilm';

/**
 * s10's small drawings — the video's own images, small:
 * - `FilmArt` (rule 1): Meridian's film — five photos light one by one, then the rose thread runs through them
 *   («…son su película»).
 * - `LabelArt` (rule 2): «la etiqueta del taller» with the PDB path in its field (the shared WorkshopLabel); it
 *   glows cyan on «única», like the match of s04. The path is a detail at this size, never singled out.
 * - `ProjectedArt` (rule 3): s08 in miniature — Meridian's whole film above, Orbital's partial film below, and the
 *   last frame projected (light, dashed) into Orbital's gap: what it did in one victim, a hypothesis for the next.
 * - `EndArt` (end card): «ninguna foto viene sola»: one photo in front, the film it belongs to behind it.
 */
export const ART_W = 380;

const FULL: readonly MiniFrame[] = ['observed', 'observed', 'observed', 'observed', 'observed'];
const PARTIAL: readonly MiniFrame[] = ['observed', 'observed', 'observed', 'observed', 'empty'];
const PROJECTED: readonly MiniFrame[] = ['observed', 'observed', 'observed', 'observed', 'projected'];

export function FilmArt({ draw, beat }: { draw: number; beat: number }) {
  const show = FULL.map((_, i) => progress(draw, 0.1 + i * 0.14, 0.2));
  return <MiniStrip width={ART_W} height={108} frames={FULL} show={show} thread={EASE.inOut(clamp01(beat))} />;
}

export function LabelArt({ draw, beat }: { draw: number; beat: number }) {
  const w = 380;
  return (
    <div style={{ width: w, height: workshopLabelHeight(w) }}>
      <WorkshopLabel width={w} path={'D:\\proj\\cicada\\loader\\Release\\ldr.pdb'} show={progress(draw, 0.1, 0.6)} glow={clamp01(beat)} tone={C.cyan} />
    </div>
  );
}

const STRIP_H = 56;
const GAP_Y = 44;

export function ProjectedArt({ draw, beat }: { draw: number; beat: number }) {
  const b = clamp01(beat);
  const top = miniStripLayout(ART_W, 5, STRIP_H);
  const src = top.frames[4];
  const dst = top.frames[4];
  const lower = STRIP_H + GAP_Y;
  const showTop = FULL.map((_, i) => progress(draw, 0.05 + i * 0.08, 0.2));
  const showLow = PARTIAL.map((_, i) => progress(draw, 0.3 + i * 0.08, 0.2));
  const h = lower + STRIP_H;
  return (
    <div style={{ position: 'relative', width: ART_W, height: h }}>
      <div style={{ position: 'absolute', left: 0, top: 0 }}>
        <MiniStrip width={ART_W} height={STRIP_H} frames={FULL} show={showTop} thread={progress(draw, 0.45, 0.4)} />
      </div>
      <div style={{ position: 'absolute', left: 0, top: lower }}>
        <MiniStrip width={ART_W} height={STRIP_H} frames={b > 0.5 ? PROJECTED : PARTIAL} show={b > 0.5 ? [...showLow.slice(0, 4), progress(b, 0.5, 0.4)] : showLow} glow={b} />
      </div>
      <ProjectionBeam
        from={{ x: src.x, y: src.y, w: src.w, h: src.h }}
        to={{ x: dst.x, y: lower + dst.y, w: dst.w, h: dst.h }}
        reach={progress(b, 0, 0.6, EASE.inOut)}
        glow={0.8 * b}
        width={ART_W}
        height={h}
      />
    </div>
  );
}

export function EndArt({ frame, at, width }: { frame: number; at: number; width: number }) {
  const strip = progress(frame, at + 2, 22, EASE.inOut);
  const photo = progress(frame, at + 12, 18);
  const w = Math.min(width, 440);
  const L = miniStripLayout(w, 5, 120);
  const f = L.frames[2];
  const scale = 1.9;
  const pw = f.w * scale;
  const ph = f.h * scale;
  return (
    <div style={{ position: 'relative', width: w, height: 300 }}>
      {/* The film behind */}
      <div style={{ position: 'absolute', left: 0, top: 90, transform: 'rotate(-6deg)', transformOrigin: 'center', opacity: 0.35 + 0.4 * strip }}>
        <MiniStrip width={w} height={120} frames={FULL} show={FULL.map((_, i) => progress(strip, i * 0.12, 0.3))} thread={progress(strip, 0.5, 0.5)} />
      </div>
      {/* The photo in front: one frame, lifted out of the strip */}
      <div
        style={{
          position: 'absolute',
          left: w / 2 - pw / 2 - 10,
          top: 150 - ph / 2 - 28 * photo,
          width: pw,
          height: ph,
          boxSizing: 'border-box',
          borderRadius: 8,
          border: `6px solid ${alpha(C.textStrong, 0.92)}`,
          background: `linear-gradient(180deg, ${alpha(C.rose, 0.32)} 0%, ${alpha(C.ink850, 0.95)} 100%)`,
          boxShadow: `0 18px 40px ${alpha('#000000', 0.5)}`,
          transform: `rotate(${4 - 8 * photo}deg) scale(${0.8 + 0.2 * photo})`,
          opacity: photo,
        }}
      >
        <svg width={pw - 12} height={ph - 12} style={{ display: 'block' }}>
          <circle cx={(pw - 12) / 2} cy={(ph - 12) * 0.4} r={(ph - 12) * 0.14} fill={alpha(C.rose, 0.9)} />
          <rect x={(pw - 12) * 0.2} y={(ph - 12) * 0.68} width={(pw - 12) * 0.6} height={6} rx={3} fill={alpha(C.text, 0.5)} />
        </svg>
      </div>
    </div>
  );
}
