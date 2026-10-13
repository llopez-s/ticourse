import type { CSSProperties } from 'react';
import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { CanvasArt, FrameBorder, Signature, signaturePoint } from './Art';
import { Absent, ArchiveBox, BrushHand, Fingerprint, Materials } from './Details';
import { MuseumLabel } from './Extras';
import { Easel, Spotlight } from './Furniture';
import { BAND_H, CANVAS, CEILING_Y, CORNER, LAMP, PD, archiveRect, bandTop, paintingLayout, type BandIndex } from './geometry';

/** One accent per band: cyan = what your network gives you; neutral = the hand; sky = sources beyond your network. */
export const BAND_TONE = [C.cyan, '#e2e8f0', C.sky] as const;

type Triple = readonly [number, number, number];
const c01 = (v: number) => Math.max(0, Math.min(1, v));
const SHADE = '#070b14';

export type PaintingProps = {
  width: number;
  easel?: number;
  legs?: number;
  art?: number;
  signature?: number;
  signatureLit?: number;
  hand?: number;
  cornerMark?: number;
  split?: number;
  ambient?: number | Triple;
  focus?: Triple;
  detail?: Triple;
  bandHand?: number;
  archive?: number;
  archiveSide?: 'left' | 'right';
  contract?: number;
  archiveLit?: number;
  archiveDark?: number;
  link?: number;
  spot?: number;
  beam?: number;
  beamEdge?: number;
  spotGap?: number;
  spotLabel?: string;
  spotLabelShow?: number;
  spotLabelAt?: 'above' | 'beam';
  labelSize?: number;
  label?: number;
  labelText?: string;
  labelLit?: number;
  labelWidth?: number;
  lineWeight?: number;
  dim?: number;
  style?: CSSProperties;
};

/** See ../Painting.tsx for the props, one by one. */
export function Painting(props: PaintingProps) {
  const { width, easel = 1, legs = 1, art = 1, signature = 1, signatureLit = 0, hand = 0, cornerMark = 0, split = 0 } = props;
  const { ambient = 1, focus = [0, 0, 0], detail = [0, 0, 0], archive = 0, archiveSide = 'left', contract = 1, link = 0 } = props;
  const { spot = 0, beam = 0, beamEdge = 0, spotGap = LAMP.gap, spotLabel, spotLabelShow = 1, labelSize = 32, label = 0, labelText = '', lineWeight = 1, dim = 0 } = props;
  const L = paintingLayout(width, { spotGap, archiveSide });
  const inBeam = props.spotLabelAt === 'beam';
  const amb: Triple = typeof ambient === 'number' ? [ambient, ambient, ambient] : ambient;
  // The beam only lights the canvas once its cone has reached it.
  const onCanvas = c01((beam - 0.6) / 0.4);
  const dark = (light: number) => (1 - c01(light)) * 0.84;
  const right = CANVAS.x + CANVAS.w;
  const box = archiveRect(archiveSide);
  const tip = signaturePoint(signature);
  const ghost = { x: CANVAS.x + CANVAS.w / 2 + (archiveSide === 'left' ? -36 : 36), y: bandTop(2) + BAND_H / 2 };
  const boxEdge = { x: archiveSide === 'left' ? box.x + box.w + 6 : box.x - 6, y: box.y + box.h * 0.4 };
  return (
    <div style={{ position: 'relative', width: L.w, height: L.totalH, opacity: 1 - 0.6 * dim, filter: dim > 0.01 ? `saturate(${1 - 0.5 * dim})` : undefined, ...props.style }}>
      <svg width={L.w} height={L.totalH} viewBox={`0 0 ${PD.w} ${PD.legsBottom}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <defs>
          <clipPath id="painting-canvas">
            <rect x={CANVAS.x} y={CANVAS.y} width={CANVAS.w} height={CANVAS.h} />
          </clipPath>
        </defs>
        <Easel show={easel} legs={legs} />
        <Spotlight gap={spotGap} show={spot} beam={beam} edge={beamEdge} />
        <ArchiveBox r={box} show={archive} contract={contract} lit={props.archiveLit ?? 0} dark={props.archiveDark ?? 0} />

        <g clipPath="url(#painting-canvas)">
          <CanvasArt art={art} />
          <Materials show={detail[0]} />
          <Fingerprint show={detail[1]} lit={focus[1]} />
          <Absent show={detail[2]} />
          {/* light: each band has its own; under the beam's edge the lamp adds to it */}
          <rect x={CANVAS.x} y={bandTop(2)} width={CANVAS.w} height={BAND_H} fill={SHADE} opacity={dark(amb[2])} />
          <rect x={CANVAS.x} y={bandTop(1)} width={CANVAS.w} height={CEILING_Y - bandTop(1)} fill={SHADE} opacity={dark(amb[1])} />
          <rect x={CANVAS.x} y={CEILING_Y} width={CANVAS.w} height={bandTop(0) - CEILING_Y} fill={SHADE} opacity={dark(amb[1] + 0.5 * onCanvas)} />
          <rect x={CANVAS.x} y={bandTop(0)} width={CANVAS.w} height={BAND_H} fill={SHADE} opacity={dark(amb[0] + onCanvas)} />
          {onCanvas > 0.001 ? <rect x={CANVAS.x} y={CEILING_Y} width={CANVAS.w} height={CANVAS.y + CANVAS.h - CEILING_Y} fill={alpha(C.cyan, 0.1 * onCanvas)} /> : null}
          <Signature draw={signature} lit={signatureLit} />
          <BrushHand x={64} y={bandTop(1) + BAND_H * 0.9} size={1.02} show={props.bandHand ?? detail[1]} />
        </g>
        <FrameBorder />

        {/* the three bands of the same canvas */}
        {split > 0.001
          ? [bandTop(1), bandTop(0)].map((y) => <path key={y} d={`M 0 ${y} H ${PD.w * split}`} stroke={alpha('#f8fafc', 0.9)} strokeWidth={2.6 * lineWeight} />)
          : null}
        {([0, 1, 2] as BandIndex[]).map((i) =>
          focus[i] > 0.01 ? (
            <rect
              key={i}
              x={CANVAS.x + 2}
              y={bandTop(i) + 2}
              width={CANVAS.w - 4}
              height={BAND_H - 4}
              fill="none"
              stroke={alpha(BAND_TONE[i], focus[i])}
              strokeWidth={4.5 * lineWeight}
              style={{ filter: `drop-shadow(0 0 ${Math.round(10 * focus[i])}px ${alpha(BAND_TONE[i], 0.7 * focus[i])})` }}
            />
          ) : null,
        )}
        {onCanvas > 0.001 ? <path d={`M ${CANVAS.x} ${CEILING_Y} H ${right}`} stroke={alpha(C.cyanSoft, onCanvas)} strokeWidth={(2.6 + 2.4 * beamEdge) * lineWeight} /> : null}

        {/* not in the painting: the dashed outline points at the box */}
        {link > 0.001 && archive > 0.001 ? (
          <path d={`M ${ghost.x} ${ghost.y} L ${boxEdge.x} ${boxEdge.y}`} stroke={alpha('#f8fafc', 0.85 * link)} strokeWidth={3 * lineWeight} strokeLinecap="round" strokeDasharray="2 9" />
        ) : null}
        {cornerMark > 0.001 ? (
          <rect x={CORNER.x} y={CORNER.y} width={CORNER.w - 4} height={CORNER.h - 4} rx={8} fill="none" stroke={alpha(signatureLit > 0.5 ? C.amber : '#f8fafc', cornerMark)} strokeWidth={3.4 * lineWeight} />
        ) : null}
        <BrushHand x={tip.x} y={tip.y} size={0.62} angle={-6} show={hand} />
      </svg>

      {spot > 0.001 && spotLabel ? (
        <div
          style={{
            position: 'absolute',
            left: inBeam ? L.lamp.x + 14 * L.s : L.lamp.x - 46 * L.s,
            top: inBeam ? L.lamp.y : L.lamp.y - 44 * L.s,
            transform: inBeam ? 'translateY(-50%)' : 'translate(-50%, -100%)',
            fontFamily: FONT.sans,
            fontSize: labelSize,
            fontWeight: 800,
            lineHeight: 1.1,
            color: inBeam ? C.textStrong : C.cyanSoft,
            textShadow: inBeam ? `0 0 14px ${alpha('#083344', 0.9)}` : undefined,
            whiteSpace: 'nowrap',
            opacity: spot * spotLabelShow,
          }}
        >
          {spotLabel}
        </div>
      ) : null}
      {label > 0.001 ? <MuseumLabel width={props.labelWidth ?? Math.max(220, L.cartela.w)} text={labelText} show={label} lit={props.labelLit ?? 0} style={{ position: 'absolute', left: L.cartela.x, top: L.cartela.y }} /> : null}
    </div>
  );
}
