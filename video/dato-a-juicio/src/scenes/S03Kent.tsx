import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, mix, type IconName } from '../../../engine/src/ui';
import { Chart, CHART_H, CHART_W } from './parts/Chart';
import { Stage, wordFrame } from './kit';

const S = 's03-kent';
const W = STAGE.width;

const QUOTE = 'Intelligence analysis is the business of making careful judgments with incomplete information, and saying clearly how sure you are';
const BAR = { w: 920, h: 96, top: 300 } as const;
const MAX_FILL = 0.9;

/**
 * s03-kent «Esperar no es gratis». While EMBER FOX's message plays (top band clear) the bar «evidencia disponible» fills
 * under it, slower and slower, never reaching the end: the gap that is left carries «incertidumbre irreducible». On
 * `kent` the bar steps left and Kent's typographic card lands on the right: his title, the lesson's quote in English and,
 * always visible, «paráfrasis de la escuela de Kent» (no portrait, no date). On `calibrated` they step out and the
 * formula appears in three pieces — «juicio calibrado = lo que sabes + cuánto te fías». On `captain` the formula goes up
 * and a nautical chart with no land shows the captain without GPS: the heading is drawn on «rumbo», the estimate and its
 * ring of doubt on «Estima», and on «corrige» a new datum arrives and the ring tightens (no numbers). On `never-certain`
 * two chips close the chapter: «no pidas certeza» struck, «da un juicio y di cuánto te fías» lit.
 */
export function S03Kent(props: SceneProps) {
  const frame = useCurrentFrame();
  const kent = props.cue('kent');
  const calibrated = props.cue('calibrated');
  const captain = props.cue('captain');
  const never = props.cue('never-certain');

  // ---- Bar: asymptotic fill from the first frames, so it is already climbing under the message.
  const fill = MAX_FILL * (1 - Math.exp(-Math.max(0, frame - 10) / 110));
  const gapAt = wordFrame(S, 's03-01', 'siempre') - 10;
  const gapLabel = progress(frame, gapAt, 16);
  const barX = mix(404, 0, progress(frame, kent - 10, 26, EASE.inOut));
  const phaseA = 1 - progress(frame, calibrated - 6, 18, EASE.inOut);

  // ---- Kent's card.
  const cardIn = enter(frame, kent - 6, { distance: 30, duration: 20, axis: 'x' });
  const quoteAt = wordFrame(S, 's03-02', 'padre') + 4;
  const uncertainAt = wordFrame(S, 's03-02', 'incertidumbre') - 6;

  // ---- Formula: big in the middle, then small on top.
  const formulaIn = progress(frame, calibrated - 4, 18);
  const pieceAt = [calibrated, wordFrame(S, 's03-04', 'sabes') - 10, wordFrame(S, 's03-04', 'fías') - 10];
  const toTop = progress(frame, captain - 10, 24, EASE.inOut);
  const formulaDim = 0.6 * progress(frame, never - 4, 16);

  // ---- Chart.
  const chartIn = progress(frame, captain, 20);
  const rumboAt = wordFrame(S, 's03-05', 'rumbo') - 6;
  const estimaAt = wordFrame(S, 's03-05', 'Estima') - 4;
  const corrigeAt = wordFrame(S, 's03-05', 'corrige') - 4;
  const rumbo = progress(frame, rumboAt, 26, EASE.inOut);
  const point = progress(frame, estimaAt, 14);
  const ring = point > 0 ? mix(150, 70, progress(frame, corrigeAt + 18, 34, EASE.inOut)) * (0.6 + 0.4 * point) : 0;
  const star = progress(frame, corrigeAt, 24);
  const landAt = wordFrame(S, 's03-05', 'tierra') - 4;
  const chartDim = 1 * progress(frame, never - 4, 16);

  return (
    <Stage>
      {/* The bar and Kent's card (chapter's first half) */}
      {phaseA > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: phaseA, fontFamily: FONT.sans }}>
          <div style={{ position: 'absolute', left: barX, top: 0, width: BAR.w }}>
            <div style={{ position: 'absolute', left: 0, top: BAR.top + BAR.h + 14, fontSize: 40, fontWeight: 800, color: C.cyanSoft, whiteSpace: 'nowrap', opacity: progress(frame, 4, 12) }}>evidencia disponible</div>
            <div style={{ position: 'absolute', left: 0, top: BAR.top, width: BAR.w, height: BAR.h, borderRadius: 18, border: `3px solid ${C.ink500}`, background: alpha(C.ink800, 0.8), boxSizing: 'border-box', overflow: 'hidden' }}>
              <div style={{ width: `${fill * 100}%`, height: '100%', background: `linear-gradient(90deg, ${alpha(C.cyanDeep, 0.9)} 0%, ${C.cyan} 100%)`, borderRadius: '14px 0 0 14px', boxShadow: `0 0 30px ${alpha(C.cyan, 0.4)}` }} />
              {/* the gap: hatched, amber */}
              <div style={{ position: 'absolute', left: `${fill * 100}%`, top: 0, right: 0, bottom: 0, opacity: gapLabel, backgroundImage: `repeating-linear-gradient(135deg, ${alpha(C.amber, 0.28)} 0 8px, transparent 8px 20px)` }} />
            </div>
            {/* bracket over the gap + its label */}
            <div style={{ position: 'absolute', left: BAR.w * fill, top: BAR.top - 16, width: BAR.w * (1 - fill), height: 12, borderTop: `4px solid ${C.amber}`, borderLeft: `4px solid ${C.amber}`, borderRight: `4px solid ${C.amber}`, boxSizing: 'border-box', opacity: gapLabel }} />
            <div style={{ position: 'absolute', right: 0, top: BAR.top - 74, fontSize: 40, fontWeight: 850, color: '#fcd34d', whiteSpace: 'nowrap', opacity: gapLabel, transform: `translateY(${(1 - gapLabel) * 8}px)` }}>incertidumbre irreducible</div>
            <div style={{ position: 'absolute', left: 0, top: BAR.top + BAR.h + 78, width: BAR.w, display: 'flex', alignItems: 'center', gap: 14, fontSize: 32, fontWeight: 650, color: C.muted, opacity: progress(frame, uncertainAt, 14), whiteSpace: 'nowrap' }}>
              <Icon name="clock" size={32} color={C.amber} />
              esperar a tenerlo todo claro es esperar para siempre
            </div>
          </div>

          {/* Kent */}
          {frame >= kent - 8 ? (
            <div style={{ position: 'absolute', left: 1000, top: 150, width: 728, ...cardIn }}>
              <div style={{ boxSizing: 'border-box', padding: '30px 38px 30px', borderRadius: RADIUS.lg, border: `2px solid ${alpha(C.cyan, 0.45)}`, background: `linear-gradient(180deg, ${alpha(C.cyan, 0.09)} 0%, ${alpha(C.ink900, 0.96)} 60%)`, boxShadow: `0 24px 60px ${alpha('#000000', 0.4)}` }}>
                <div style={{ fontSize: 40, fontWeight: 850, color: C.textStrong, lineHeight: 1.1 }}>Sherman Kent</div>
                <div style={{ marginTop: 6, fontSize: 30, fontWeight: 600, color: C.cyanSoft, lineHeight: 1.25 }}>considerado el padre del análisis de inteligencia moderno</div>
                <div style={{ marginTop: 22, width: 90, height: 3, background: alpha(C.cyan, 0.6), borderRadius: 2 }} />
                <div style={{ marginTop: 20, fontSize: 34, fontWeight: 600, fontStyle: 'italic', lineHeight: 1.32, color: C.text, opacity: progress(frame, quoteAt, 18) }}>«{QUOTE}»</div>
                <div style={{ marginTop: 20, fontSize: 28, fontWeight: 700, color: C.muted }}>paráfrasis de la escuela de Kent</div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* The formula */}
      {formulaIn > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: mix(210, 10, toTop), width: W, transform: `scale(${mix(1, 0.72, toTop)})`, transformOrigin: '50% 0', opacity: formulaIn * (1 - formulaDim), display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, fontFamily: FONT.sans }}>
          <Piece text="juicio calibrado" icon="target" tone={C.emerald} at={pieceAt[0]} frame={frame} />
          <Sign text="=" at={pieceAt[1]} frame={frame} />
          <Piece text="lo que sabes" icon="database" tone={C.cyan} at={pieceAt[1]} frame={frame} />
          <Sign text="+" at={pieceAt[2]} frame={frame} />
          <Piece text="cuánto te fías" icon="chart" tone={C.sky} at={pieceAt[2]} frame={frame} />
        </div>
      ) : null}

      {/* The captain's chart */}
      {chartIn > 0 && chartDim < 0.999 ? (
        <div style={{ position: 'absolute', left: (W - CHART_W) / 2, top: 150, opacity: 1 - chartDim }}>
          <Chart show={chartIn} rumbo={rumbo} point={point} ring={ring} star={star} />
          <div style={{ position: 'absolute', left: 34, top: CHART_H - 66, fontSize: 32, fontWeight: 650, color: C.muted, opacity: progress(frame, landAt, 14) * chartIn, whiteSpace: 'nowrap' }}>sin tierra a la vista</div>
        </div>
      ) : null}

      {/* Chapter close */}
      {progress(frame, never - 4, 16) > 0 ? <NeverCertain frame={frame} at={never} /> : null}
    </Stage>
  );
}

function Piece({ text, icon, tone, at, frame }: { text: string; icon: IconName; tone: string; at: number; frame: number }) {
  const p = progress(frame, at - 4, 16);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 16,
        padding: '16px 34px 16px 26px',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(tone, 0.8)}`,
        background: alpha(tone, 0.12),
        boxShadow: `0 0 30px ${alpha(tone, 0.2)}`,
        fontSize: 50,
        fontWeight: 850,
        color: C.textStrong,
        whiteSpace: 'nowrap',
        opacity: p,
        transform: `translateY(${(1 - p) * 20}px)`,
      }}
    >
      <Icon name={icon} size={52} color={tone} strokeWidth={2.2} />
      {text}
    </div>
  );
}

function Sign({ text, at, frame }: { text: string; at: number; frame: number }) {
  const p = progress(frame, at - 8, 12);
  return <span style={{ fontSize: 64, fontWeight: 850, color: C.muted, opacity: p }}>{text}</span>;
}

/** «no pidas certeza» struck, «da un juicio y di cuánto te fías» lit. */
function NeverCertain({ frame, at }: { frame: number; at: number }) {
  const a = progress(frame, at - 4, 16);
  const strike = progress(frame, at + 12, 14);
  const b = progress(frame, at + 22, 16);
  return (
    <div style={{ position: 'absolute', left: 0, top: 200, width: W, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36, fontFamily: FONT.sans }}>
      <div style={{ position: 'relative', padding: '18px 54px', borderRadius: RADIUS.lg, border: `3px solid ${alpha(C.faint, 0.6)}`, background: alpha(C.ink900, 0.9), opacity: a * (1 - 0.35 * strike), transform: `translateY(${(1 - a) * 20}px)` }}>
        <span style={{ fontSize: 64, fontWeight: 800, color: C.muted, whiteSpace: 'nowrap' }}>no pidas certeza</span>
        <div style={{ position: 'absolute', left: 36, top: '50%', width: `calc(${strike * 100}% - 72px)`, height: 7, marginTop: -3, borderRadius: 4, background: C.rose }} />
      </div>
      <div style={{ padding: '22px 60px', borderRadius: RADIUS.lg, border: `4px solid ${alpha(C.emerald, 0.9)}`, background: `linear-gradient(180deg, ${alpha(C.emerald, 0.16)}, ${alpha(C.ink900, 0.96)})`, boxShadow: `0 0 50px ${alpha(C.emerald, 0.3)}`, opacity: b, transform: `translateY(${(1 - b) * 24}px) scale(${0.96 + 0.04 * b})` }}>
        <span style={{ fontSize: 68, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>
          da un <span style={{ color: C.emerald }}>juicio</span> y di <span style={{ color: C.emerald }}>cuánto te fías</span>
        </span>
      </div>
    </div>
  );
}
