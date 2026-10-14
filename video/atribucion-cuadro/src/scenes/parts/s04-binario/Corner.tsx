import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { S04_MINUTE, S04_PROVENANCE } from '../../../data/s04-binario';
import { Painting, Provenance, SignatureCorner, paintingLayout, provenanceHeight, signatureCornerHeight } from '../Painting';

const AMBER_SOFT = '#fcd34d';
const EMERALD_SOFT = '#6ee7b7';

/** The painting, small, and its signed corner enlarged beside it (px from the group's top-left). */
export const CORNER = { paintW: 176, gap: 64, zoomW: 350, zoomTop: 54 } as const;
export const CORNER_W = CORNER.paintW + CORNER.gap + CORNER.zoomW;
export const CORNER_H = CORNER.zoomTop + Math.round(signatureCornerHeight(CORNER.zoomW));

/**
 * s02's painting comes back, compact, and its bottom-right corner is enlarged: the signature and the date.
 *   show      the painting                · zoom  the enlarged corner and the two lines that tie it to the canvas
 *   paint     0–1 signature + date, stroke by stroke (both drawings follow it)
 *   hand      0–1 the hand that paints them (only in the enlarged corner)
 *   lit       0–1 amber: cheap to forge
 *   minute    0–1 «un minuto», above the enlarged corner (where the hand was)
 *   dim       0–1 the whole group steps back
 */
export function CornerZoom({ show = 1, zoom = 1, paint = 1, hand = 0, lit = 0, minute = 0, dim = 0 }: { show?: number; zoom?: number; paint?: number; hand?: number; lit?: number; minute?: number; dim?: number }) {
  if (show <= 0.001) return null;
  const L = paintingLayout(CORNER.paintW);
  const zx = CORNER.paintW + CORNER.gap;
  const zh = signatureCornerHeight(CORNER.zoomW);
  const py = CORNER_H - L.h - 8;
  // the ring Painting draws round its corner (cornerMark), in px
  const ring = { x: L.corner.x, y: py + L.corner.y, w: L.corner.w - 4 * L.s, h: L.corner.h - 4 * L.s };
  const tie = alpha(lit > 0.5 ? C.amber : '#f8fafc', 0.75 * zoom);
  return (
    <div style={{ position: 'relative', width: CORNER_W, height: CORNER_H, opacity: show * (1 - 0.55 * dim), filter: dim > 0.01 ? `saturate(${1 - 0.4 * dim})` : undefined }}>
      <div style={{ position: 'absolute', left: 0, top: py }}>
        <Painting width={CORNER.paintW} legs={0} signature={paint} signatureLit={lit} cornerMark={zoom} lineWeight={1.6} />
      </div>
      {zoom > 0.001 ? (
        <svg width={CORNER_W} height={CORNER_H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <path d={`M ${ring.x + ring.w} ${ring.y} L ${zx} ${CORNER.zoomTop} M ${ring.x + ring.w} ${ring.y + ring.h} L ${zx} ${CORNER.zoomTop + zh}`} stroke={tie} strokeWidth={2.5} strokeDasharray="3 8" strokeLinecap="round" />
        </svg>
      ) : null}
      <div style={{ position: 'absolute', left: zx, top: CORNER.zoomTop, opacity: zoom, transform: `scale(${0.9 + 0.1 * zoom})`, transformOrigin: '0% 100%' }}>
        <SignatureCorner width={CORNER.zoomW} paint={paint} hand={hand} lit={lit} />
      </div>
      {minute > 0.001 ? (
        <div style={{ position: 'absolute', right: 0, top: 0, height: CORNER.zoomTop - 8, display: 'flex', alignItems: 'center', padding: '0 20px 2px', borderRadius: RADIUS.md, border: `2px solid ${alpha(C.amber, 0.8)}`, background: alpha(C.amberDeep, 0.6), fontFamily: FONT.sans, fontSize: 34, fontWeight: 850, lineHeight: 1, color: AMBER_SOFT, whiteSpace: 'nowrap', opacity: minute, transform: `translateY(${(1 - minute) * 10}px)` }}>
          {S04_MINUTE}
        </div>
      ) : null}
    </div>
  );
}

/** Height of the provenance block for a given width. */
export const provenanceBlockHeight = (width: number) => 48 + Math.round(provenanceHeight(width, 5));

/**
 * The costly evidence: the painting's documented history («procedencia») — archive cards filed year after
 * year, with dashes where a year would be. `label` 0–1 the word, `cards` 0–1 files them left to right.
 */
export function ProvenanceBlock({ width, label = 1, cards = 1, glow = 0, dim = 0 }: { width: number; label?: number; cards?: number; glow?: number; dim?: number }) {
  if (label <= 0.001 && cards <= 0.001) return null;
  return (
    <div style={{ width, fontFamily: FONT.sans, opacity: 1 - 0.55 * dim }}>
      <div style={{ height: 48, fontSize: 36, fontWeight: 850, lineHeight: 1.1, letterSpacing: 0.4, color: EMERALD_SOFT, whiteSpace: 'nowrap', opacity: label, textShadow: glow > 0.02 ? `0 0 ${Math.round(20 * glow)}px ${alpha(C.emerald, 0.6 * glow)}` : undefined }}>{S04_PROVENANCE}</div>
      <Provenance width={width} count={5} show={cards} lit={1} />
    </div>
  );
}
