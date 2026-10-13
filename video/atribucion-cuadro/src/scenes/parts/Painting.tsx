/**
 * V23's ONE image: a painting being attributed («el cuadro»), drawn the same way in every scene
 * (canon: out/scene-brief.md «Visual metaphors»). Implementation in ./painting/*; import everything from here.
 *
 * THE DRAWING. An abstract canvas (muted blocks, no figure) in a dark frame on a steel easel, with an
 * illegible signature and date (a flourish and four dashes — never letters or a year) in its bottom-right
 * corner. The three attribution levels are three BANDS of that same canvas, bottom-up (never steps):
 *   band index 0 = band 1, bottom  «¿con qué se hizo?»            the weave and three heaps of pigment   (cyan)
 *   band index 1 = band 2, middle  «¿quién lo pintó?»             the hand and a fingerprint in varnish  (neutral)
 *   band index 2 = band 3, top     «¿quién lo encargó y lo pagó?» an EMPTY dashed outline in the canvas; the
 *                                   contract is OUTSIDE, in an archive box beside the frame            (sky)
 *
 * <Painting width={px} …/> — `width` is the FRAME's width; the frame is width × 1.3·width and the easel's feet
 * reach 1.515·width. The part's origin (its div's top-left) is the frame's top-left corner; the mast, the lamp
 * and the archive box overflow that box (negative x / y). Wrap it in an absolutely positioned div. Pure and
 * prop-driven: nothing reads the timeline. Every number below is 0–1 unless said otherwise.
 *   easel = 1            the easel (0 = the framed canvas alone: thumbnails)
 *   legs = 1             length of the easel's feet (0 = ledge only)
 *   art = 1              the blocks of colour over the bare ground
 *   signature = 1        signature + date painted stroke by stroke (0 = a corner with nothing in it yet)
 *   signatureLit = 0     they turn amber (cheap, forgeable)
 *   hand = 0             the hand with a brush that paints them; it follows `signature`
 *   cornerMark = 0       a ring round that corner (where SignatureCorner looks)
 *   split = 0            the two lines that split the canvas in three bands (they draw left → right)
 *   ambient = 1          room light per band: a number or [band1, band2, band3] (0 = in the dark)
 *   focus = [0,0,0]      a glowing outline per band, in BAND_TONE
 *   detail = [0,0,0]     each band's own detail (see the list above)
 *   bandHand             the painter's hand inside band 2 (defaults to detail[1])
 *   archive = 0          the archive box outside the painting, level with band 3
 *   archiveSide = 'left' which side of the frame it stands on
 *   contract = 1         the paper stands up out of the box
 *   archiveLit = 0       sky edge and seal (a source beyond your network) · archiveDark = 0 leaves it in the dark
 *   link = 0             a dotted line from the empty outline in band 3 to the box
 *   spot = 0             the spotlight, a lamp on a stand left of the frame, level with band 1
 *   beam = 0             its beam: the cone grows to the canvas (0–0.6), then lights it (0.6–1): band 1 fully,
 *                        only the lower sliver of band 2, nothing of band 3. The beam's upper edge is the ceiling.
 *   beamEdge = 0         stresses that edge
 *   spotGap = 250        distance from the frame to the lamp's mouth, in design units (frame = 400 wide)
 *   spotLabel?, spotLabelShow = 1, labelSize = 32, spotLabelAt = 'above'
 *                        the lamp's text («tu telemetría»), px size; 'above' the lamp or inside the 'beam'
 *   label = 0, labelText, labelLit = 0, labelWidth?
 *                        the museum label («la cartela») right of the frame, low (top-left at layout.cartela);
 *                        emerald edge when lit; labelWidth in px (default ≥ 220, so its text stays readable)
 *   lineWeight = 1       multiplies band lines / outlines (thumbnails: 2–3)
 *   dim = 0              the whole part steps back · style? extra CSS on the wrapper
 *
 * paintingLayout(width, { spotGap?, archiveSide? }) → px anchors from the frame's top-left:
 *   s (px per design unit), w, h (frame), totalH (feet), top (mast top, negative), canvas, bands[0..2] (rects;
 *   0 = bottom), corner (signature), archive (rect), lamp (the mouth), lampBox, ceilingY, cartela (rect)
 *
 * STANDALONE PIECES (same drawing, for other layouts)
 *   <SignatureCorner width paint={0–1} hand={0–1} lit={0–1} />   the corner enlarged (≈ 1.93 : 1;
 *        signatureCornerHeight(width)); the hand follows the stroke and sticks out above the box
 *   <Provenance width count={5} show={0–1} lit={0–1} />          «procedencia»: archive cards on a rail, no
 *        readable years; provenanceHeight(width, count)
 *   <MuseumLabel width text sub? textSize? show lit />           the cartela on its own (an HTML card)
 *   Inside your own <svg> in design units: CanvasArt, FrameBorder, Signature, BrushHand, Materials, Fingerprint,
 *   Absent, ArchiveBox, Easel, Spotlight; constants PD, CANVAS, BAND_H, CORNER, CEILING_Y, PAINT, FURN, BAND_TONE.
 *
 * USAGE
 *   full stage:  <Painting width={376} split={1} ambient={[1, 0.5, 0.5]} focus={[lit, 0, 0]} detail={[d, 0, 0]} />
 *   compact:     <Painting width={240} legs={0.5} cornerMark={mark} signatureLit={lit} />
 *   thumbnail:   <Painting width={120} easel={0} split={1} ambient={[1, 0.45, 0.12]} lineWeight={2.5} />
 */
export { BAND_TONE, Painting, type PaintingProps } from './painting/Composite';
export { CanvasArt, FURN, FrameBorder, PAINT, Signature, signaturePoint } from './painting/Art';
export { Absent, ArchiveBox, BrushHand, Fingerprint, Materials } from './painting/Details';
export { MuseumLabel, Provenance, SignatureCorner, provenanceHeight, signatureCornerHeight } from './painting/Extras';
export { Easel, Spotlight } from './painting/Furniture';
export {
  BAND_H,
  CANVAS,
  CEILING_Y,
  CORNER,
  PD,
  archiveRect,
  bandTop,
  paintingLayout,
  type BandIndex,
  type PaintingLayout,
  type PaintingLayoutOptions,
  type Point,
  type Rect,
} from './painting/geometry';
