import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Chip, focusWeights, mix } from '../../../engine/src/ui';
import { HypothesisStone, Notebook, PROOF_BOX, Peers } from './parts/Proofs';
import { Scale, WeightSvg, scaleGeometry } from './parts/Scale';
import { Stage, wordFrame } from './kit';

const S = 's05-pesas';
const W = STAGE.width;

/** The scale, tilted, low enough to leave the top ~170 px to the intercepted message. */
const SC = { w: 640, x: 40, y: 206 } as const;
const TILT0 = -9;
const OFFSETS = [-160, 0, 160] as const;
const WEIGHT_SIZE = 112;

/** The three cards on the right. */
const CARD = { x: 760, y: 190, w: W - 760, h: 140, gap: 16 } as const;

const PROOFS = [
  { title: 'tumbar tu hipótesis favorita', sub: 'en vez de apoyarla', tag: 'ACH' },
  { title: 'la contraria, en serio', sub: 'revisión por pares hostil', tag: null },
  { title: 'tu juicio por escrito', sub: 'antes de saber cómo acaba', tag: null },
] as const;

/**
 * s05-pesas «Una pesa de fuera». From the first frame the scale of s02 is back, tilted (nothing on it).
 *   (intercept) PAPER CRANE's card is over the top ~170 px; the scale waits, a little dim
 *   reply-b    the card gives way and the scale stays, lit: «tu instinto: una báscula descalibrada»
 *   refute     the first outside weight lands on the platform (a ray of the tilt goes) and its card enters:
 *              a hypothesis on a post and a stone thrown at it — the post wobbles and stands (ACH, named
 *              on «ACH»; no matrix). Then the exam card
 *   peers      the second weight and its card: you and a reviewer who really disagrees
 *   written    the third weight and its card: a notebook whose date is left blank, a judgment written in it
 *              before the end of the story. The scale ends level
 */
export function S05Pesas(props: SceneProps) {
  const frame = useCurrentFrame();
  const replyAt = props.cue('reply-b');
  const refuteAt = props.cue('refute');
  const peersAt = props.cue('peers');
  const writtenAt = props.cue('written');
  const at = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const p = (start: number, dur = 14) => progress(frame, start, dur);
  const swell = (start: number, hold = 20) => progress(frame, start, 10) * (1 - progress(frame, start + hold, 26, EASE.inOut));

  // ---- The scale: dim under the message, lit on the answer, levelling as the weights land.
  const scaleIn = enter(frame, -15, { distance: 20, duration: 22 });
  const msgDim = 0.45 * (1 - p(replyAt - 4, 16));
  const lands = [refuteAt - 2, peersAt - 2, writtenAt - 2].map((t) => progress(frame, t, 26, EASE.in));
  const tilt = TILT0 * (1 - (lands[0] + lands[1] + lands[2]) / 3);
  const instinct = enter(frame, at('s05-01', 'instinto') - 6, { distance: 12, duration: 16 });
  const instinctOut = 1 - p(refuteAt - 4, 12);
  const sg = scaleGeometry(SC.w);
  const dropFrom = -150;

  // ---- The three cards: the one the voice is on is lit, the others step back.
  const { weights, dims } = focusWeights(frame, [refuteAt, peersAt, writtenAt]);
  const cardIn = [refuteAt, peersAt, writtenAt].map((t) => enter(frame, t - 4, { distance: 28, duration: 18, axis: 'x' }));

  // ---- Card 1: the stone and the wobble.
  const throwAt = at('s05-02', 'tumbar') - 4;
  const thrown = progress(frame, throwAt, 22, EASE.linear);
  const hitAt = throwAt + 22;
  const dt = frame - hitAt;
  const wobble = dt > 0 ? 16 * Math.sin(dt * 0.55) * Math.exp(-dt / 12) : 0;
  const achAt = at('s05-02', 'ACH') - 4;
  const ach = enter(frame, achAt, { distance: 10, duration: 14 });

  // ---- Card 2: the reviewer's bubble.
  const hostile = p(at('s05-03', 'contraria') - 4, 14);

  // ---- Card 3: the pen.
  const write = progress(frame, at('s05-04', 'escrito') - 4, 70, EASE.linear);

  const illus = [
    <HypothesisStone key="h" thrown={thrown} wobble={wobble} />,
    <Peers key="p" show={hostile} />,
    <Notebook key="n" write={write} />,
  ];

  return (
    <Stage>
      {/* The scale, tilted, with the three weights on its platform */}
      <div style={{ position: 'absolute', left: SC.x, top: SC.y, opacity: scaleIn.opacity, transform: scaleIn.transform }}>
        <Scale
          width={SC.w}
          reading="2,0"
          tilt={tilt}
          glow={swell(replyAt, 50)}
          dim={msgDim}
          platform={[0, 1, 2].map((i) => {
            const t = progress(frame, [refuteAt, peersAt, writtenAt][i] - 6, 24, EASE.in);
            if (t <= 0.001) return null;
            const y = mix(dropFrom, 0, t);
            return (
              <g key={i} transform={`translate(${OFFSETS[i]} ${y})`} opacity={Math.min(1, t * 3)}>
                <WeightSvg size={WEIGHT_SIZE} label={String(i + 1)} glow={weights[i] * 0.6} />
              </g>
            );
          })}
        />
      </div>
      {/* The words under it */}
      <div
        style={{
          position: 'absolute',
          left: SC.x,
          top: SC.y + sg.h + 14,
          width: SC.w,
          textAlign: 'center',
          fontFamily: FONT.sans,
          fontSize: 44,
          fontWeight: 800,
          color: C.textStrong,
          whiteSpace: 'nowrap',
          opacity: instinct.opacity * instinctOut,
          transform: instinct.transform,
        }}
      >
        tu instinto: <span style={{ color: '#fcd34d' }}>báscula descalibrada</span>
      </div>

      {/* The three outside weights, one card each */}
      {PROOFS.map((pr, i) => {
        const e = cardIn[i];
        if (e.opacity < 0.01) return null;
        const lit = weights[i];
        return (
          <div
            key={pr.title}
            style={{
              position: 'absolute',
              left: CARD.x,
              top: CARD.y + i * (CARD.h + CARD.gap),
              width: CARD.w,
              height: CARD.h,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              gap: 22,
              padding: '0 28px 0 22px',
              borderRadius: RADIUS.lg,
              border: `${lit > 0.3 ? 3 : 2}px solid ${alpha(C.cyan, 0.3 + 0.55 * lit)}`,
              background: `linear-gradient(90deg, ${alpha(C.cyan, 0.05 + 0.09 * lit)} 0%, ${alpha(C.ink900, 0.95)} 40%)`,
              boxShadow: lit > 0.02 ? `0 0 ${Math.round(34 * lit)}px ${alpha(C.cyan, 0.22 * lit)}` : `0 14px 34px ${alpha('#000000', 0.3)}`,
              fontFamily: FONT.sans,
              opacity: e.opacity * (1 - 0.55 * dims[i]),
              transform: e.transform,
              filter: dims[i] > 0.01 ? `saturate(${1 - 0.5 * dims[i]})` : undefined,
            }}
          >
            <div style={{ width: PROOF_BOX.w, height: PROOF_BOX.h, flexShrink: 0 }}>{illus[i]}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 44, fontWeight: 850, letterSpacing: -0.6, lineHeight: 1.1, color: C.textStrong, whiteSpace: 'nowrap' }}>{pr.title}</div>
              <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 36, fontWeight: 650, color: C.cyanSoft, whiteSpace: 'nowrap' }}>{pr.sub}</span>
                {pr.tag ? (
                  <span style={{ opacity: ach.opacity, transform: ach.transform }}>
                    <Chip accent="cyan" size={30} solid>
                      {pr.tag}
                    </Chip>
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </Stage>
  );
}
