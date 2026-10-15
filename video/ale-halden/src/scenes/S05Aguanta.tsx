import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress, springIn } from '../../../engine/src/theme/motion';
import { Icon, windowWeight } from '../../../engine/src/ui';
import { AGAIN, ALE, ALE_NAME, ARO, AV, BELOW, CONTROL_LABEL, EF, ESTIMATE, STAMP, TIE } from '../data/s05-aguanta';
import {
  EqOp,
  EqSlot,
  LeverPanel,
  PANEL_H,
  PANEL_W,
  Readout,
  Swap,
  TONE_ARO,
  TONE_EF,
  ValueTank,
  YearStrip,
  type SwapItem,
} from './parts/s05-aguanta/bits';
import { Stage, wordFrame } from './kit';

const S = 's05-aguanta';
const W = STAGE.width;

// ---- Vertical bands (stage-local): equation, the two levers, the result strip.
const EQ_TOP = 0;
const PANELS_TOP = 98;
const STRIP_TOP = 424;
const PX = 12; // px per 1.000 € (a little larger than s04's 10: the bar is the only chart here)
const BAR_TOP = STRIP_TOP + 50;
const BAR_H = 60;
const TIE_X = 20 * PX;
const RIGHT_X = 700;
const RIGHT_W = W - RIGHT_X;

/** Years (0–9) that carry a hit at ARO 0,5; the first two to go are 1, 4 and 7, then 9, and 3 is the last one left. */
const YEARS = [1, 3, 4, 7, 9];
const GO_AT_LOW = [1, 4, 7];

/**
 * s05-aguanta «¿Y si nos equivocamos?». The same calculation, AV × EF × ARO = ALE, with its two levers drawn as two
 * different things: ARO is how many hits fall in ten years (ten squares), EF is how much of the asset is lost (a column
 * that fills from the top). Below, the ALE bar against the control's cost line (20.000 € / año, same scale as s04).
 * `aro`: ARO 0,5 goes to 0,2 (two marks), the bar falls onto the line and `empate` says «aquí empata»; `below`: it falls
 * under the line and the control costs more than it avoids (a hatched gap, no verdict word); `ef`: ARO is back at 0,5
 * and EF goes 0,25 to 0,10: the bar lands on the line again. `estimate`: levers back to base, an amber band on the
 * part of the bar that depends on them; `stamp`: «R-014 · 50.000 € al año · una estimación para comparar».
 */
export function S05Aguanta(props: SceneProps) {
  const frame = useCurrentFrame();
  const leverAt = props.cue('lever');
  const aroAt = props.cue('aro');
  const empateAt = props.cue('empate');
  const belowAt = props.cue('below');
  const estimateAt = props.cue('estimate');
  const stampAt = props.cue('stamp');

  // ---- Beats tied to words.
  const aroNumAt = wordFrame(S, 's05-02', '0,2') - 6;
  const fallAt = wordFrame(S, 's05-02', 'cae') - 6;
  const aleTieAt = wordFrame(S, 's05-02', '20.000') - 6;
  const belowNumAt = wordFrame(S, 's05-03', 'debajo') - 8;
  const aroBackAt = wordFrame(S, 's05-04', '0,5') - 8;
  const bajaAt = wordFrame(S, 's05-04', 'baja') - 6;
  const efNumAt = wordFrame(S, 's05-04', 'EF') + 2;
  const veinteAt = wordFrame(S, 's05-04', 'veinte') - 16;
  const efWordAt = wordFrame(S, 's05-05', 'EF') - 4;
  const aroWordAt = wordFrame(S, 's05-05', 'ARO') - 4;

  // ---- Entrances.
  const eqIn = progress(frame, 2, 18);
  const panelIn = [progress(frame, leverAt - 4, 18), progress(frame, leverAt + 4, 18)];
  const stripIn = progress(frame, 22, 18);

  // ---- Which lever the voice is on.
  const aroF = Math.min(1, windowWeight(frame, Math.min(aroAt + 20, aroNumAt - 10), bajaAt) + windowWeight(frame, aroWordAt, estimateAt - 6));
  const efF = windowWeight(frame, bajaAt, aroWordAt);
  const efGlowA = windowWeight(frame, efWordAt, aroWordAt);
  const aroDim = efF;
  const efDim = Math.min(1, aroF);

  // ---- Values.
  const aroNums: SwapItem[] = [
    { at: 0, text: ARO.base.n },
    { at: aroNumAt, text: ARO.low.n },
    { at: belowNumAt, text: ARO.lower.n },
    { at: aroBackAt, text: ARO.base.n },
  ];
  const aroReads: SwapItem[] = [
    { at: 0, text: ARO.base.reading },
    { at: aroNumAt + 4, text: ARO.low.reading },
    { at: belowNumAt, text: ARO.lower.reading },
    { at: aroBackAt, text: ARO.base.reading },
  ];
  const efNums: SwapItem[] = [
    { at: 0, text: EF.base.n },
    { at: efNumAt, text: EF.low.n },
    { at: estimateAt, text: EF.base.n },
  ];
  const efReads: SwapItem[] = [
    { at: 0, text: EF.base.reading },
    { at: efNumAt, text: EF.low.reading },
    { at: estimateAt, text: EF.base.reading },
  ];
  const aleTitle: SwapItem[] = [
    { at: 0, text: ALE.base },
    { at: aleTieAt, text: ALE.tie },
    { at: belowNumAt, text: ALE.below },
    { at: aroBackAt + 10, text: ALE.base },
    { at: veinteAt, text: ALE.tie },
    { at: estimateAt, text: ALE.base },
  ];
  const aleEq: SwapItem[] = [
    { at: 0, text: ALE.baseEq },
    { at: aleTieAt, text: ALE.tieEq },
    { at: belowNumAt, text: ALE.belowEq },
    { at: aroBackAt + 10, text: ALE.baseEq },
    { at: veinteAt, text: ALE.tieEq },
    { at: estimateAt, text: ALE.baseEq },
  ];

  // The marks on the ten squares and the share of the column that is lost.
  const marks = Array.from({ length: 10 }, (_, y) => {
    if (!YEARS.includes(y)) return 0;
    if (y === 3) return progress(frame, 14 + 3 * 4, 14);
    const base = progress(frame, 14 + y * 4, 14);
    const goIdx = GO_AT_LOW.indexOf(y);
    const goes = goIdx >= 0 ? progress(frame, aroNumAt + goIdx * 6, 10) : progress(frame, belowNumAt + 2, 10);
    const comes = progress(frame, aroBackAt + YEARS.indexOf(y) * 4, 12);
    return Math.max(0, Math.min(1, base * (1 - goes + comes)));
  });
  const share = 0.25 - 0.15 * progress(frame, efNumAt, 30, EASE.inOut) + 0.15 * progress(frame, estimateAt, 24, EASE.inOut);

  // The bar, in thousands of euros.
  const bk =
    50 -
    30 * progress(frame, fallAt, 26, EASE.inOut) -
    10 * progress(frame, belowNumAt, 26, EASE.inOut) +
    40 * progress(frame, aroBackAt, 26, EASE.inOut) -
    30 * progress(frame, efNumAt, 34, EASE.inOut) +
    30 * progress(frame, estimateAt, 26, EASE.inOut);
  const barW = bk * PX * stripIn;

  // ---- Verdict words on the right.
  const tieW = windowWeight(frame, empateAt, belowAt - 4, { ramp: 12, lead: 4 });
  const belowW = windowWeight(frame, wordFrame(S, 's05-03', 'control') - 6, aroBackAt - 6, { ramp: 12, lead: 2 });
  const againW = windowWeight(frame, veinteAt + 12, estimateAt - 8, { ramp: 12, lead: 0 });
  const estW = progress(frame, estimateAt - 2, 16);
  const stampP = Math.min(1, springIn(frame, 30, stampAt - 2, { damping: 14 }));
  const bandIn = progress(frame, estimateAt + 20, 22);
  // The gap between the bar's end and the control's line when the ALE is under it.
  const gapW = Math.max(0, TIE_X - barW);
  const tieRing = Math.max(tieW, againW);

  return (
    <Stage>
      {/* ===== The calculation: AV × EF × ARO = ALE ===== */}
      <div style={{ position: 'absolute', left: 0, top: EQ_TOP, width: W, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 20, opacity: eqIn }}>
        <EqSlot label="AV" width={290} tone={C.textStrong}>
          {AV}
        </EqSlot>
        <EqOp>×</EqOp>
        <EqSlot label="EF" width={170} tone={TONE_EF} dim={efDim}>
          <Swap items={efNums} frame={frame} />
        </EqSlot>
        <EqOp>×</EqOp>
        <EqSlot label="ARO" width={170} tone={TONE_ARO} dim={aroDim}>
          <Swap items={aroNums} frame={frame} />
        </EqSlot>
        <EqOp>=</EqOp>
        <EqSlot label="ALE" width={560} tone={C.cyanSoft} align="left">
          <Swap items={aleEq} frame={frame} />
        </EqSlot>
      </div>

      {/* ===== The two levers ===== */}
      <div style={{ position: 'absolute', left: 0, top: PANELS_TOP }}>
        <LeverPanel
          tone={TONE_ARO}
          term={ARO.term}
          def={ARO.def}
          focus={aroF}
          dim={aroDim}
          show={panelIn[0]}
          chip={ARO.chipLow}
          chipShow={progress(frame, aroNumAt + 8, 12) * (1 - progress(frame, aroBackAt - 4, 10))}
        >
          <Readout tone={TONE_ARO} nums={aroNums} reads={aroReads} frame={frame} />
          <YearStrip marks={marks} label={ARO.years} />
        </LeverPanel>
      </div>
      <div style={{ position: 'absolute', left: W - PANEL_W, top: PANELS_TOP }}>
        <LeverPanel
          tone={TONE_EF}
          term={EF.term}
          def={EF.def}
          focus={Math.max(efF, 0.6 * efGlowA)}
          dim={efDim}
          show={panelIn[1]}
          chip={EF.chipLow}
          chipShow={progress(frame, efNumAt + 4, 12) * (1 - progress(frame, estimateAt - 6, 10))}
        >
          <Readout tone={TONE_EF} nums={efNums} reads={efReads} frame={frame} />
          <div style={{ position: 'absolute', left: 26, top: 190, width: 590, fontFamily: FONT.sans, fontSize: 32, fontWeight: 600, lineHeight: 1.2, color: C.muted }}>{EF.caption}</div>
          <ValueTank share={share} label="AV" />
        </LeverPanel>
      </div>

      {/* ===== The result: the ALE bar against the control's yearly cost ===== */}
      <div style={{ position: 'absolute', left: 0, top: PANELS_TOP + PANEL_H + 12, width: W, height: 2, background: alpha(C.ink600, 0.55), opacity: stripIn }} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: STRIP_TOP,
          height: 44,
          lineHeight: '44px',
          fontFamily: FONT.sans,
          fontSize: 36,
          fontWeight: 700,
          color: C.text,
          whiteSpace: 'nowrap',
          opacity: stripIn,
        }}
      >
        {ALE_NAME}
        <span style={{ color: C.faint }}>{' · '}</span>
        <Swap items={aleTitle} frame={frame} style={{ color: C.cyanSoft, fontWeight: 850 }} />
      </div>
      {/* the bar */}
      {barW > 3 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: BAR_TOP,
            width: barW,
            height: BAR_H,
            boxSizing: 'border-box',
            borderRadius: 12,
            background: `linear-gradient(90deg, ${alpha(C.cyan, 0.88)}, ${alpha(C.cyan, 0.6)})`,
            border: `2px solid ${C.cyan}`,
            boxShadow: `0 0 24px ${alpha(C.cyan, 0.2)}`,
          }}
        />
      ) : null}
      {/* below the line: what the control costs on top of what it avoids */}
      {gapW > 2 && belowW > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: barW,
            top: BAR_TOP,
            width: gapW,
            height: BAR_H,
            boxSizing: 'border-box',
            borderRadius: '0 12px 12px 0',
            border: `3px dashed ${alpha(C.amber, 0.9)}`,
            borderLeft: 'none',
            background: `repeating-linear-gradient(135deg, ${alpha(C.amber, 0.38)} 0 10px, ${alpha(C.amber, 0.12)} 10px 20px)`,
            opacity: belowW,
          }}
        />
      ) : null}
      {/* the estimate: the part of the bar that rests on the two levers */}
      {bandIn > 0.01 && barW > TIE_X + 3 ? (
        <div
          style={{
            position: 'absolute',
            left: TIE_X,
            top: BAR_TOP - 8,
            width: (barW - TIE_X) * bandIn,
            height: BAR_H + 16,
            boxSizing: 'border-box',
            borderRadius: 14,
            border: `3px dashed ${C.amber}`,
            background: `repeating-linear-gradient(135deg, ${alpha(C.amber, 0.4)} 0 10px, ${alpha(C.amber, 0.12)} 10px 20px)`,
          }}
        />
      ) : null}
      {/* the control's line (20.000 € / año) */}
      <svg width={TIE_X + 40} height={170} style={{ position: 'absolute', left: 0, top: BAR_TOP - 12, overflow: 'visible', opacity: stripIn }}>
        <line x1={TIE_X} x2={TIE_X} y1={0} y2={BAR_H + 24} stroke={C.emerald} strokeWidth={5} strokeDasharray="12 8" strokeLinecap="round" />
        {tieRing > 0.01 ? <circle cx={TIE_X} cy={12 + BAR_H / 2} r={16 + 8 * tieRing} fill="none" stroke={alpha(C.emerald, 0.9 * tieRing)} strokeWidth={5} /> : null}
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: BAR_TOP + BAR_H + 22,
          fontFamily: FONT.sans,
          fontSize: 32,
          fontWeight: 750,
          color: '#a7f3d0',
          whiteSpace: 'nowrap',
          opacity: stripIn,
        }}
      >
        {CONTROL_LABEL}
      </div>

      {/* ===== Verdict words ===== */}
      <div style={{ position: 'absolute', left: RIGHT_X, top: STRIP_TOP + 6, width: RIGHT_W, height: 150 }}>
        {tieW > 0.01 ? (
          <div style={{ position: 'absolute', left: 0, top: 18, display: 'flex', alignItems: 'center', gap: 22, opacity: tieW, transform: `scale(${0.94 + 0.06 * tieW})`, transformOrigin: 'left center' }}>
            <span style={{ width: 84, height: 84, borderRadius: 42, display: 'grid', placeItems: 'center', border: `5px solid ${C.emerald}`, background: alpha(C.emeraldDeep, 0.7), fontFamily: FONT.mono, fontSize: 60, fontWeight: 850, color: C.emerald, lineHeight: 1 }}>=</span>
            <span style={{ fontFamily: FONT.sans, fontSize: 76, fontWeight: 850, color: '#a7f3d0', whiteSpace: 'nowrap' }}>{TIE}</span>
          </div>
        ) : null}
        {belowW > 0.01 ? (
          <div style={{ position: 'absolute', left: 0, top: 30, display: 'flex', alignItems: 'center', gap: 18, opacity: belowW, transform: `translateY(${(1 - belowW) * 12}px)` }}>
            <Icon name="alert" size={58} color={C.amber} strokeWidth={2.4} />
            <span style={{ fontFamily: FONT.sans, fontSize: 46, fontWeight: 800, color: '#fde68a', whiteSpace: 'nowrap' }}>{BELOW}</span>
          </div>
        ) : null}
        {againW > 0.01 ? (
          <div style={{ position: 'absolute', left: 0, top: 24, display: 'flex', alignItems: 'center', gap: 20, opacity: againW, transform: `translateY(${(1 - againW) * 12}px)` }}>
            <span style={{ width: 72, height: 72, borderRadius: 36, display: 'grid', placeItems: 'center', border: `5px solid ${C.emerald}`, background: alpha(C.emeraldDeep, 0.7), fontFamily: FONT.mono, fontSize: 50, fontWeight: 850, color: C.emerald, lineHeight: 1 }}>=</span>
            <span style={{ fontFamily: FONT.sans, fontSize: 54, fontWeight: 850, color: '#a7f3d0', whiteSpace: 'nowrap' }}>{AGAIN}</span>
          </div>
        ) : null}
        {estW > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: RIGHT_W - 20,
              fontFamily: FONT.sans,
              fontSize: 54,
              fontWeight: 850,
              lineHeight: 1.12,
              color: '#fde68a',
              opacity: estW,
              transform: `translateY(${(1 - estW) * 14}px)`,
            }}
          >
            {ESTIMATE}
          </div>
        ) : null}
      </div>

      {/* ===== The seal ===== */}
      {stampP > 0.01 ? (
        <div style={{ position: 'absolute', left: RIGHT_X, top: STRIP_TOP + 150 }}>
          <div
            style={{
              display: 'inline-block',
              border: `5px solid ${C.amber}`,
              borderRadius: RADIUS.md,
              background: alpha(C.ink950, 0.8),
              padding: '10px 24px',
              fontFamily: FONT.sans,
              fontSize: 33,
              fontWeight: 850,
              letterSpacing: 0.4,
              color: C.amber,
              whiteSpace: 'nowrap',
              opacity: stampP,
              transform: `rotate(-1.5deg) scale(${1.4 - 0.4 * stampP})`,
              transformOrigin: 'left center',
            }}
          >
            {STAMP}
          </div>
        </div>
      ) : null}
    </Stage>
  );
}
