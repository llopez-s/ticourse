import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { clamp01, mix, windowWeight } from '../../../engine/src/ui';
import { S06 } from '../data/s06-barrera';
import { Checkpoint } from './parts/Checkpoint';
import { CauseChip, TermCard } from './parts/s06-barrera/marks';
import { crossings, freeFlow } from './parts/s06-barrera/traffic';
import { Stage, segment, wordFrame } from './kit';

const S = 's06-barrera';
const W = 1728;

// ---- Checkpoints (the shared «garita», road crop: as tall as it is wide)
/** Phase A: one staffed, powered checkpoint at the right, traffic stopping at it. */
const CP_A = { x: 1120, y: 100, w: 540 } as const;
/** On `barrier` it comes to the middle for the power cut. */
const CP_C = { x: (W - 540) / 2, y: 100, w: 540 } as const;
/** Phase B: the two endings, at the sides (nothing of them in the top-centre band). */
const CP_SIDE_W = 430;
const CP_L = { x: 0, y: 150 } as const;
const CP_R = { x: W - CP_SIDE_W, y: 150 } as const;

// ---- The two exam-term cards, in the centre column under the band
const CARD_W = 406;
const CARD_GAP = 24;
const CARD_Y = 252;
const CARD_L_X = W / 2 - CARD_GAP / 2 - CARD_W;
const CARD_R_X = W / 2 + CARD_GAP / 2;
const SUB = 32;

/**
 * s06-barrera «Cuando se va la luz».
 *   0           one staffed checkpoint with its lamp lit (not s02's empty hut): trucks pull up, the
 *               guard looks, the arm lifts for each one. The traffic goes THROUGH the control.
 *   inline      «Lo que va en el camino del tráfico / acabará fallando» at the left (second line on
 *               «caerá»); the checkpoint glows.
 *   causes      three chips on their words: «memoria» · «firmas corruptas» (on «actualización») ·
 *               «corriente» (on «luz»).
 *   barrier     the text leaves and the checkpoint comes to the middle; on «apagón» the power goes
 *               (lamp and window dark, the guard only a shadow, the amber badge); on «dos» it
 *               splits to the two sides.
 *   s06-04      left: on «Arriba» the arm goes up and trucks drive through, nobody looking; card:
 *               «pasa sin inspeccionar» (on «nadie»), «gana la disponibilidad» (`open`), FAIL-OPEN on
 *               «fail-open». The right one steps back meanwhile.
 *   s06-05      right: the arm stays down and a queue of three builds up (from «Abajo»); card:
 *               «no pasa ni un camión», «gana la seguridad» (`closed`), FAIL-CLOSED on «fail-closed»,
 *               «también: fail-secure» on «fail-secure».
 *   intercept   (s06-05's end → s06-06's end) nothing in the top-centre band: the checkpoints sit at
 *               the sides from y 150 and the cards start at y 252. On «Dejar» the fail-open side
 *               glows amber (it has its price).
 *   depends     «¿siempre?» + «Depende de qué sale más caro» at the top once the card has gone;
 *               «parar» lights the closed side, «mirar» the open one. Holds to the end.
 */
export function S06Barrera(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  const inlineAt = props.cue('inline');
  const causesAt = props.cue('causes');
  const barrierAt = props.cue('barrier');
  const openAt = props.cue('open');
  const closedAt = props.cue('closed');
  const dependsAt = props.cue('depends');
  const s04 = segment(props, 's06-04');
  const s05 = segment(props, 's06-05');
  const s06 = segment(props, 's06-06');
  // The intercept types out in a silent lead before s06-06's audio (≥ 3.8 s) and stays to its end.
  const leadStart = Math.min(s05.to, s06.from - 114);

  const at = {
    caera: w('s06-01', 'caerá'),
    memoria: w('s06-02', 'memoria'),
    actualizacion: w('s06-02', 'actualización'),
    luz: w('s06-02', 'luz'),
    apagon: w('s06-03', 'apagón'),
    dos: w('s06-03', 'dos'),
    arriba: w('s06-04', 'Arriba'),
    camiones: w('s06-04', 'camiones'),
    nadie: w('s06-04', 'nadie'),
    failOpen: w('s06-04', 'fail-open'),
    abajo: w('s06-05', 'Abajo'),
    pasa: w('s06-05', 'pasa'),
    failClosed: w('s06-05', 'fail-closed'),
    failSecure: w('s06-05', 'fail-secure'),
    dejar: w('s06-06', 'Dejar'),
    parar: w('s06-07', 'parar'),
    mirar: w('s06-07', 'mirar'),
  };

  // ---------------- Phase A: the staffed checkpoint with traffic through it
  const sceneIn = progress(frame, 0, 12);
  const traffic = crossings(frame, -24, at.apagon - 4);

  const headIn = progress(frame, inlineAt - 6, 16);
  const head2In = progress(frame, Math.max(inlineAt + 6, at.caera - 6), 14);
  const textOut = progress(frame, barrierAt - 4, 16, EASE.inOut);
  const inlineGlow = windowWeight(frame, inlineAt, causesAt, { ramp: 12 });
  const barrierGlow = windowWeight(frame, barrierAt + 10, at.dos, { ramp: 10 });

  // ---------------- To the middle, the cut, the split
  const toCentre = progress(frame, barrierAt - 2, 24, EASE.inOut);
  const cut = progress(frame, at.apagon, 8);
  const power = 1 - cut;
  const split = progress(frame, at.dos - 4, 26, EASE.inOut);
  const cpW = mix(CP_A.w, CP_SIDE_W, split);
  const midX = mix(CP_A.x, CP_C.x, toCentre);
  const posL = { x: mix(midX, CP_L.x, split), y: mix(CP_A.y, CP_L.y, split) };
  const posR = { x: mix(midX, CP_R.x, split), y: mix(CP_A.y, CP_R.y, split) };

  // Left ending: arm up, trucks drive through, nobody looks.
  const barrierL = Math.max(traffic.barrier, progress(frame, at.arriba - 2, 16, EASE.inOut));
  const passingL = [...traffic.passing, ...freeFlow(frame, at.camiones - 12)];
  // Right ending: arm down, a queue builds up.
  const queueR = 3 * progress(frame, at.abajo + 2, 70, EASE.linear);

  // Focus: the right one steps back while the voice is on the left, and the other way round.
  const dimL = 0.6 * windowWeight(frame, s05.from, leadStart, { ramp: 12 });
  const dimR = 0.6 * windowWeight(frame, s04.from, s05.from, { ramp: 12 });
  const warnL = windowWeight(frame, at.dejar, s06.to, { ramp: 12 });
  const markL = windowWeight(frame, at.mirar - 2, at.mirar + 44, { ramp: 8 });
  const markR = windowWeight(frame, at.parar - 2, at.parar + 44, { ramp: 8 });

  // ---------------- Cards
  const cardL = progress(frame, at.nadie - 6, 14);
  const cardR = progress(frame, at.pasa - 6, 14);

  // ---------------- depends (after the intercept card has gone)
  const dep = progress(frame, dependsAt + 8, 16);
  const depA = progress(frame, dependsAt + 16, 16);

  const place = (pos: { x: number; y: number }, opacity: number, filter: string | undefined, node: ReactNode) => (
    <div style={{ position: 'absolute', left: pos.x, top: pos.y, opacity, filter }}>{node}</div>
  );
  const halo = (k: number, tone: string) => (k > 0.01 ? `drop-shadow(0 0 ${Math.round(6 + 12 * k)}px ${alpha(tone, 0.45 * k)})` : undefined);

  return (
    <Stage style={{ fontFamily: FONT.sans, opacity: sceneIn }}>
      {/* ================= Phase A: the headline and the three causes, at the left ================= */}
      {textOut < 1 ? (
        <div style={{ position: 'absolute', left: 30, top: 96, opacity: 1 - textOut }}>
          {headIn > 0.001 ? (
            <div style={{ opacity: headIn }}>
              <div style={{ fontSize: 46, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap', transform: `translateY(${(1 - headIn) * 10}px)` }}>{S06.headline[0]}</div>
              <div style={{ fontSize: 66, fontWeight: 880, color: '#fcd34d', whiteSpace: 'nowrap', marginTop: 4, opacity: head2In, transform: `translateY(${(1 - head2In) * 10}px)` }}>
                {S06.headline[1]}
              </div>
            </div>
          ) : null}
          <div style={{ position: 'absolute', left: 0, top: 210, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 20 }}>
            <CauseChip icon="database" text={S06.causes[0]} tone={C.amber} p={progress(frame, Math.max(causesAt, at.memoria - 6), 14)} />
            <CauseChip icon="file" text={S06.causes[1]} tone={C.amber} p={progress(frame, at.actualizacion - 6, 14)} />
            <CauseChip icon="bolt" text={S06.causes[2]} tone={C.amber} p={progress(frame, at.luz - 6, 14)} glow={windowWeight(frame, at.luz, barrierAt, { ramp: 10 })} />
          </div>
        </div>
      ) : null}

      {/* ================= The checkpoint(s) ================= */}
      {/* Right copy: appears on the split */}
      {split > 0.001
        ? place(
            posR,
            clamp01(split * 4),
            halo(markR, C.cyan),
            <Checkpoint width={cpW} crop="road" state="powered" power={power} barrier={0} queue={queueR} dim={dimR} />,
          )
        : null}
      {/* Left copy: the original one */}
      {place(
        posL,
        1,
        halo(Math.max(warnL, markL), warnL > markL ? C.amber : C.cyan),
        <Checkpoint width={cpW} crop="road" state="powered" power={power} barrier={barrierL} passing={passingL} glow={Math.max(inlineGlow, barrierGlow)} dim={dimL} />,
      )}

      {/* ================= The two cards: described first, then named ================= */}
      <div style={{ position: 'absolute', left: CARD_L_X, top: CARD_Y }}>
        <TermCard
          width={CARD_W}
          term={S06.open.term}
          size={44}
          collapse
          p={cardL}
          termP={progress(frame, at.failOpen - 4, 14)}
          before={[
            { text: S06.open.lines[0], p: cardL, color: '#fcd34d', size: SUB },
            { text: S06.open.lines[1], p: progress(frame, openAt - 4, 12), color: C.textStrong, weight: 820, size: SUB },
          ]}
          dim={dimL}
          glow={Math.max(warnL, markL)}
          glowTone={warnL > markL ? C.amber : C.cyan}
        />
      </div>
      <div style={{ position: 'absolute', left: CARD_R_X, top: CARD_Y }}>
        <TermCard
          width={CARD_W}
          term={S06.closed.term}
          size={44}
          collapse
          p={cardR}
          termP={progress(frame, at.failClosed - 4, 14)}
          before={[
            { text: S06.closed.lines[0], p: cardR, color: '#fcd34d', size: SUB },
            { text: S06.closed.lines[1], p: progress(frame, closedAt - 4, 12), color: C.textStrong, weight: 820, size: SUB },
          ]}
          lines={[{ text: S06.closed.also, p: progress(frame, at.failSecure - 6, 12), color: C.muted, size: SUB, weight: 680 }]}
          dim={dimR}
          glow={markR}
          glowTone={C.cyan}
        />
      </div>

      {/* ================= depends ================= */}
      {dep > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, width: W, top: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ fontSize: 42, fontWeight: 820, color: '#fcd34d', whiteSpace: 'nowrap', opacity: dep, transform: `translateY(${(1 - dep) * 10}px)` }}>{S06.depends.q}</div>
          <div style={{ fontSize: 56, fontWeight: 880, color: C.textStrong, whiteSpace: 'nowrap', opacity: depA, transform: `translateY(${(1 - depA) * 10}px)` }}>{S06.depends.a}</div>
        </div>
      ) : null}
    </Stage>
  );
}
