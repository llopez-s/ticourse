import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, mix, windowWeight } from '../../../engine/src/ui';
import { Dials } from './parts/Dials';
import { Stage, wordFrame } from './kit';

const S = 's09-diales';
const W = STAGE.width;

// The folded dials sit low under the phrase and its notes; unfolded they start under the message's band.
const TOP_FULL = 204;
const TOP_FOLDED = 408;
const TOP_WRAP = 214;
const PHRASE = { top: 204, h: 92 } as const;

/**
 * s09-diales «Cómo se lee un juicio». VELVET CICADA's message and the think prompt own the top of
 * the stage, so everything is drawn under y ≈ 200.
 *   dials    two dials, one over the other: «probabilidad · del evento» and «confianza · de tu
 *            base» (ghosts from the first frame, lit on «dos diales»).
 *   prob     the pointer on the seven-band bar and «70 % de lluvia».
 *   conf     baja · moderada · alta light in turn, the three levers (fuentes, evidencia,
 *            razonamiento) come in, then a satellite (high) and a person at the window (low) move
 *            the pointer and the knobs.
 *   (think)  the dials fold low; the lesson's phrase, «We assess it is LIKELY the actor will
 *            target suppliers (LOW confidence).», takes the top, nothing lit.
 *   answer   the probability dial stays on 55–80 %, the confidence dial on «baja»; «la evidencia
 *            escasa apunta hacia aquí · puede cambiar con pruebas nuevas», and the small second
 *            example «unlikely · high confidence».
 *   real     the ICD 203 note: separate sentences in a real product, together in the app's exam.
 *   wrap     the dials rise and a padlock lands between them: the confidence pointer climbs and the
 *            probability does not move; «subir la confianza no sube la probabilidad».
 */
export function S09Diales(props: SceneProps) {
  const frame = useCurrentFrame();
  const dials = props.cue('dials');
  const prob = props.cue('prob');
  const conf = props.cue('conf');
  const answer = props.cue('answer');
  const real = props.cue('real');
  const wrap = props.cue('wrap');
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  // ---- Labels, probability.
  const labels = progress(frame, dials - 4, 16);
  const win = (from: number, to: number, ramp = 10) => windowWeight(frame, from, to, { ramp, lead: 0 });

  // ---- Folding.
  const foldAt = w('s09-05', 'Fíjate') - 22;
  const fold = progress(frame, foldAt, 30, EASE.inOut);
  const wrapP = progress(frame, wrap - 14, 28, EASE.inOut);
  const c = fold;
  const top = mix(mix(TOP_FULL, TOP_FOLDED, fold), TOP_WRAP, wrapP);
  const gap = mix(mix(14, 8, fold), 74, wrapP);

  // ---- Pointers.
  const probOn = Math.max(progress(frame, w('s09-02', '70') - 10, 14), progress(frame, prob, 14));
  const probPtr = Math.max(probOn * (1 - fold), progress(frame, wrap - 6, 14) * fold);
  const probBand = progress(frame, answer - 2, 16);

  // ---- Confidence: segments in turn, levers, the two sources.
  const segAt = [w('s09-03', 'baja'), w('s09-03', 'moderada'), w('s09-03', 'alta')];
  const seg: [number, number, number] = [
    Math.max(win(segAt[0] - 4, segAt[1] - 4), probBand * (1 - wrapP)),
    win(segAt[1] - 4, segAt[2] - 4),
    Math.max(win(segAt[2] - 4, segAt[2] + 40), progress(frame, w('s09-08', 'subir') + 30, 14) * wrapP),
  ];
  const sat = progress(frame, w('s09-04', 'satélite') - 6, 16);
  const win2 = progress(frame, w('s09-04', 'ventana') - 6, 16);
  // pointer: moderada → alta (satellite) → baja (window); then hidden while the dials are folded; back on `wrap`.
  const toAlta = progress(frame, w('s09-04', 'satélite') - 4, 22, EASE.inOut);
  const toBaja = progress(frame, w('s09-04', 'ventana') - 4, 22, EASE.inOut);
  let confPos = mix(0.5, 5 / 6, toAlta);
  confPos = mix(confPos, 1 / 6, toBaja);
  const subir = progress(frame, w('s09-08', 'subir') + 4, 36, EASE.inOut);
  confPos = mix(confPos, 5 / 6, subir * wrapP);
  const confPtr = Math.max(progress(frame, conf + 40, 14) * (1 - fold), progress(frame, wrap - 6, 14) * fold);
  const levers: [number, number, number] = [
    progress(frame, w('s09-03', 'calidad') - 8, 14),
    progress(frame, w('s09-03', 'evidencia') - 8, 14),
    progress(frame, w('s09-03', 'razonamiento') - 8, 14),
  ];
  const leverPos = mix(mix(0.55, 0.82, toAlta), 0.2, toBaja);

  // ---- Phrase and its notes.
  const phraseAt = w('s09-05', 'frase') - 8;
  const phraseIn = progress(frame, phraseAt, 18) * (1 - progress(frame, wrap - 14, 14, EASE.inOut));
  const hl = progress(frame, answer, 16);
  const poco = w('s09-06', 'poco') - 10;
  const prueba = w('s09-06', 'prueba') - 10;
  const second = w('s09-06', 'facilidad') + 4;
  const answerOut = progress(frame, real - 8, 12, EASE.inOut);
  const note = progress(frame, real - 2, 16) * (1 - progress(frame, wrap - 14, 12, EASE.inOut));

  // ---- Wrap: the padlock and the warning.
  const lock = progress(frame, wrap + 4, 16);
  const warnAt = w('s09-08', 'subir') - 6;
  const warn = progress(frame, warnAt, 16);

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      <Dials
        top={top}
        c={c}
        gap={gap}
        labels={labels}
        probPtr={probPtr}
        probBand={probBand}
        seg={seg}
        confPtr={confPtr}
        confPos={confPos}
        levers={levers}
        leverPos={leverPos}
        imgs={[win2, sat]}
        lock={lock}
        frame={frame}
      />

      {/* The lesson's phrase */}
      {phraseIn > 0.01 ? (
        <div style={{ position: 'absolute', left: (W - 1680) / 2, top: PHRASE.top, width: 1680, height: PHRASE.h, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px', borderRadius: RADIUS.lg, border: `3px solid ${alpha(C.textStrong, 0.35)}`, background: `linear-gradient(180deg, ${alpha(C.ink800, 0.95)} 0%, ${alpha(C.ink900, 0.98)} 100%)`, boxShadow: `0 22px 50px ${alpha('#000000', 0.4)}`, fontSize: 40, fontWeight: 650, color: C.textStrong, whiteSpace: 'nowrap', opacity: phraseIn, transform: `translateY(${(1 - phraseIn) * 16}px)` }}>
          <span>
            We assess it is{' '}
            <Lit tone={C.cyan} on={hl}>LIKELY</Lit>
            {' '}the actor will target suppliers{' '}
            <Lit tone={C.emerald} on={hl}>(LOW confidence)</Lit>.
          </span>
        </div>
      ) : null}

      {/* The answer: what the phrase says, and the opposite example */}
      {hl > 0.01 && answerOut < 1 ? (
        <div style={{ position: 'absolute', left: 0, top: 308, width: W, height: 90, opacity: 1 - answerOut }}>
          <div style={{ position: 'absolute', left: 30, top: 0, width: 1120, fontSize: 36, fontWeight: 700, lineHeight: 1.22, color: C.textStrong }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, ...enter(frame, poco, { distance: 10, duration: 14 }) }}>
              <Icon name="arrowRight" size={34} color={C.emerald} />
              la evidencia escasa apunta hacia aquí
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, ...enter(frame, prueba, { distance: 10, duration: 14 }) }}>
              <Icon name="arrowRight" size={34} color={C.amber} />
              puede cambiar con pruebas nuevas
            </div>
          </div>
          <div style={{ position: 'absolute', left: 1190, top: 0, width: W - 1190, ...enter(frame, second, { distance: 14, duration: 16 }) }}>
            <div style={{ padding: '6px 22px 8px', borderRadius: RADIUS.md, border: `2px solid ${alpha(C.muted, 0.7)}`, background: alpha(C.ink900, 0.96) }}>
              <div style={{ fontSize: 34, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>unlikely · high confidence</div>
              <div style={{ fontSize: 27, fontWeight: 600, color: C.muted, whiteSpace: 'nowrap' }}>evidencia sólida que dice que no</div>
            </div>
          </div>
        </div>
      ) : null}

      {/* ICD 203 note */}
      {note > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: 304, width: W, display: 'flex', justifyContent: 'center', opacity: note, transform: `translateY(${(1 - note) * 12}px)` }}>
          <div style={{ width: 1600, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 20, padding: '8px 30px 10px', borderRadius: RADIUS.lg, border: `2px solid ${alpha(C.sky, 0.8)}`, background: alpha(C.sky, 0.1), fontSize: 30, fontWeight: 700, lineHeight: 1.22, color: C.textStrong }}>
            <Icon name="file" size={50} color={C.sky} />
            <span>
              <span style={{ color: C.sky, fontWeight: 850 }}>ICD 203:</span> en un producto real, probabilidad y confianza van en frases separadas
              <span style={{ color: C.faint }}> · </span>
              en el examen de la app las verás juntas
            </span>
          </div>
        </div>
      ) : null}

      {/* The warning */}
      {warn > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: 560, width: W, textAlign: 'center', opacity: warn, transform: `translateY(${(1 - warn) * 16}px)` }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 18, padding: '8px 34px 12px 26px', borderRadius: RADIUS.pill, border: `3px solid ${C.amber}`, background: alpha(C.amber, 0.12), fontSize: 52, fontWeight: 850, color: C.amber, whiteSpace: 'nowrap', boxShadow: `0 0 34px ${alpha(C.amber, 0.25)}` }}>
            <Icon name="alert" size={54} color={C.amber} />
            subir la confianza no sube la probabilidad
          </span>
        </div>
      ) : null}
    </Stage>
  );
}

/** A word of the phrase that lights in the colour of its dial. */
function Lit({ tone, on, children }: { tone: string; on: number; children: string }) {
  return (
    <span style={{ fontWeight: on > 0.5 ? 850 : 650, color: on > 0.5 ? C.textStrong : undefined, background: alpha(tone, 0.3 * on), boxShadow: on > 0.02 ? `0 0 0 5px ${alpha(tone, 0.3 * on)}` : undefined, borderRadius: 6 }}>{children}</span>
  );
}
