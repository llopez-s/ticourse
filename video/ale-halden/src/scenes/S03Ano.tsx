import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { dimStyle, mix } from '../../../engine/src/ui';
import { ARO_LINE, MARKED_YEARS, SLE_CHIP } from '../data/s03-ano';
import { Stage, wordFrame } from './kit';
import { Phone } from './parts/Phone';
import { Calendar, ROW_W } from './parts/s03-ano/Calendar';
import { CARD_GAP, CARD_H, CARD_W, Cards } from './parts/s03-ano/Cards';
import { Formula } from './parts/s03-ano/Formula';
import { PANEL_H, PANEL_W, ThinkPanel } from './parts/s03-ano/ThinkPanel';

const S = 's03-ano';
const W = STAGE.width;

// ---- Vertical layout (stage-local, 1728 × 660).
const SLE_TOP = 2; // the SLE chip, once it has settled at the top
const SLE_H = 92;
const SLE_START_TOP = 214; // where it first stands, centred and big
const SLE_START_SCALE = 1.5;
const CAL_TOP = 108;
const ARO_TOP = 288;
const ALE_TOP = 442;
const CARDS_TOP = 516;
const PANEL_TOP = 236; // under the think prompt's band (stage-local y 0–230)

/**
 * s03-ano «Cuántas veces al año». The SLE (100.000 €) stands alone until `years`, when it climbs to the top and a
 * row of ten year squares draws under it. `aro`: «ARO · 0,5» with «una vez cada dos años»; five years are marked at
 * uneven places («esperados, no fijos»); `ale`: «ALE = SLE × ARO = 100.000 × 0,5 = 50.000 € al año». `factors`:
 * EF and ARO side by side, never crossing. `think`: the R-014 calculation fades out under a low, opaque panel (the engine
 * draws the prompt in the top band); `back` lights 12.000 and marks in rose 108.000.
 */
export function S03Ano(props: SceneProps) {
  const frame = useCurrentFrame();
  const sleAt = props.cue('sle-in');
  const yearsAt = props.cue('years');
  const aroAt = props.cue('aro');
  const aleAt = props.cue('ale');
  const factorsAt = props.cue('factors');
  const thinkAt = props.cue('think');
  const backAt = props.cue('back');

  // ---- Word-level syncs inside the segments.
  const aroWord = wordFrame(S, 's03-02', 'ARO');
  const halfWord = wordFrame(S, 's03-02', '0,5');
  const onceWord = wordFrame(S, 's03-02', 'una');
  const cincoWord = wordFrame(S, 's03-03', 'Cinco');
  const esperadosWord = wordFrame(S, 's03-03', 'esperados');
  const porWord = wordFrame(S, 's03-03', 'por');
  const esperasWord = wordFrame(S, 's03-03', 'Esperas');
  const efWord = wordFrame(S, 's03-04', 'EF');
  const aroCardWord = wordFrame(S, 's03-04', 'ARO');
  const anoCardWord = wordFrame(S, 's03-04', 'año');
  const otroWord = wordFrame(S, 's03-05', 'otro');
  const aleWord = wordFrame(S, 's03-05', '36.000');
  const tresWord = wordFrame(S, 's03-05', 'tres');
  const cuantoWord = wordFrame(S, 's03-05', 'Cuánto');
  const hacia = wordFrame(S, 's03-06', 'Hacia');
  const trampaWord = wordFrame(S, 's03-06', '108.000');

  // ---- SLE chip: big and alone, then up to the top as the calendar draws.
  const sleIn = progress(frame, sleAt - 2, 18);
  const sleUp = progress(frame, yearsAt - 6, 26, EASE.inOut);
  const sleTop = mix(SLE_START_TOP, SLE_TOP, sleUp);
  const sleScale = mix(SLE_START_SCALE, 1, sleUp);
  const sleCrack = progress(frame, sleAt + 6, 16);

  // ---- Calendar marks: five uneven years, one after another from «Cinco golpes esperados».
  const marksAt = MARKED_YEARS.map((_, i) => cincoWord + 4 + i * 11);

  // ---- ARO line.
  const askIn = progress(frame, aroAt + 4, 14) * (1 - progress(frame, aroWord - 6, 10));
  const aroIn = progress(frame, aroWord - 4, 14);
  const halfIn = progress(frame, halfWord - 4, 14);
  const onceIn = progress(frame, onceWord - 4, 14);
  const aroGlow = progress(frame, halfWord, 12) * (1 - progress(frame, cincoWord - 6, 16));

  // ---- Factors: the calendar steps back, the cards enter side by side.
  const factorsDim = progress(frame, factorsAt, 18, EASE.inOut);
  const glowEf = progress(frame, efWord - 4, 10) * (1 - progress(frame, aroCardWord - 6, 10));
  const glowAro = progress(frame, aroCardWord - 4, 10) * (1 - progress(frame, anoCardWord + 10, 16));

  // ---- Think: the whole R-014 calculation steps back; the top band stays free of it.
  const tk = progress(frame, thinkAt, 20, EASE.inOut);
  const calcStyle = {
    position: 'absolute' as const,
    left: 0,
    top: 0,
    width: W,
    height: STAGE.height,
    // Fully gone once the panel is up: nothing of the earlier calculation may show in or around it.
    opacity: 1 - tk,
  };

  return (
    <Stage>
      <div style={calcStyle}>
        {/* The SLE: one knock */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: sleTop,
            width: W,
            display: 'flex',
            justifyContent: 'center',
            opacity: sleIn,
            transform: `scale(${sleScale * (0.94 + 0.06 * sleIn)})`,
            transformOrigin: 'top center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 22,
              height: SLE_H,
              padding: '0 34px 0 20px',
              borderRadius: RADIUS.lg,
              border: `3px solid ${alpha(C.cyan, 0.8)}`,
              background: alpha(C.cyanDeep, 0.28),
              boxShadow: `0 0 30px ${alpha(C.cyan, 0.22)}`,
              fontFamily: FONT.sans,
              whiteSpace: 'nowrap',
            }}
          >
            <div style={{ height: SLE_H - 10, display: 'grid', placeItems: 'center' }}>
              <div style={{ transform: 'scale(0.9)' }}>
                <Phone width={34} crack={sleCrack} />
              </div>
            </div>
            <span style={{ fontSize: 56, fontWeight: 850, color: C.textStrong }}>
              <span style={{ color: C.violet }}>{SLE_CHIP.term}</span> · {SLE_CHIP.value}
            </span>
            <span style={{ fontSize: 36, fontWeight: 650, color: '#fda4af' }}>{SLE_CHIP.sub}</span>
          </div>
        </div>

        {/* The ten-year calendar */}
        <div style={{ position: 'absolute', left: (W - ROW_W) / 2, top: CAL_TOP, ...dimStyle(factorsDim * 0.75) }}>
          <Calendar frame={frame} yearsAt={yearsAt} marksAt={marksAt} labelAt={esperadosWord - 4} />
        </div>

        {/* ARO · 0,5 / una vez cada dos años */}
        <div style={{ position: 'absolute', left: 0, top: ARO_TOP, width: W, height: 130, ...dimStyle(factorsDim * 0.75) }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 20,
              textAlign: 'center',
              fontFamily: FONT.sans,
              fontSize: 42,
              fontWeight: 700,
              color: C.muted,
              opacity: askIn,
            }}
          >
            {ARO_LINE.ask}
          </div>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              display: 'flex',
              justifyContent: 'center',
              gap: 22,
              fontFamily: FONT.sans,
              fontSize: 68,
              fontWeight: 850,
              lineHeight: 1.1,
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ color: C.violet, opacity: aroIn, transform: `translateY(${(1 - aroIn) * 10}px)` }}>{ARO_LINE.term}</span>
            <span style={{ color: C.muted, opacity: halfIn }}>·</span>
            <span
              style={{
                color: C.textStrong,
                opacity: halfIn,
                transform: `translateY(${(1 - halfIn) * 10}px)`,
                textShadow: aroGlow > 0.02 ? `0 0 ${Math.round(26 * aroGlow)}px ${alpha(C.cyan, 0.6 * aroGlow)}` : undefined,
              }}
            >
              {ARO_LINE.value}
            </span>
          </div>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 78,
              textAlign: 'center',
              fontFamily: FONT.sans,
              fontSize: 46,
              fontWeight: 700,
              color: C.cyanSoft,
              opacity: onceIn,
              transform: `translateY(${(1 - onceIn) * 10}px)`,
            }}
          >
            {ARO_LINE.sub}
          </div>
        </div>

        {/* ALE = SLE × ARO = 100.000 × 0,5 = 50.000 € al año */}
        <div style={{ position: 'absolute', left: 0, top: ALE_TOP, width: W }}>
          <Formula frame={frame} headAt={aleAt} numsAt={porWord - 2} resAt={esperasWord + 4} />
        </div>

        {/* EF and ARO: side by side */}
        <div style={{ position: 'absolute', left: (W - (CARD_W * 2 + CARD_GAP)) / 2, top: CARDS_TOP, height: CARD_H }}>
          <Cards frame={frame} at={factorsAt} glow={[glowEf, glowAro]} />
        </div>
      </div>

      {/* The think panel: low, equal buttons until `back` */}
      {frame >= thinkAt - 2 ? (
        <div style={{ position: 'absolute', left: (W - PANEL_W) / 2, top: PANEL_TOP, width: PANEL_W, height: PANEL_H }}>
          <ThinkPanel
            frame={frame}
            t={{
              panel: thinkAt,
              tag: otroWord - 6,
              ale: aleWord - 6,
              aro: tresWord - 6,
              buttons: cuantoWord - 4,
              back: backAt,
              rule: hacia - 4,
              trap: trampaWord - 4,
            }}
          />
        </div>
      ) : null}
    </Stage>
  );
}
