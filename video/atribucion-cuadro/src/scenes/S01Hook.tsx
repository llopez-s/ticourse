import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { dimStyle, mix } from '../../../engine/src/ui';
import { S01_PROMISE, S01_TITLE, S01_WHERE } from '../data/s01-hook';
import { CISO_QUESTION, CisoStrip } from './parts/CisoStrip';
import { Diamond } from './parts/Diamond';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = STAGE.width;
const H = STAGE.height;

// ---- Today's picture: on the left your diamond under Meridian's labels, on the right the CISO.
const DIAMOND = { w: 700, h: 310, name: 38 } as const;
const LEFT = { x: 40, w: 740, labels: 104 } as const;
const CISO = { x: 862, w: 838, size: 47 } as const;
const GROUP_H = LEFT.labels + DIAMOND.h;
/** Centred on the stage until the title lands; then it drops under the title and the promise. */
const GROUP_Y_A = Math.round((H - GROUP_H) / 2);
const GROUP_Y_B = H - GROUP_H - 6;

// ---- Title block.
const TITLE_SIZE = 80;
const SUB_TOP = 90;
const CHIPS_TOP = 150;
const CHIP_H = 58;

/**
 * s01-hook «Un nombre para el informe». From the first frame your diamond of the attack draws itself, small,
 * on the left, under «Meridian Dynamics · aeroespacial» and «tú, su analista de inteligencia» (`diamond`):
 * three corners are dim, with nothing readable; the Adversary one is a card, and on «falta saber quién fue»
 * it gets its dashed amber UNKNOWN. On `ciso` the CISO's strip enters on the right with his question, line by
 * line — a question, not a decision. Before 12 s (`title`) «Atribución: ¿quién fue?» lands across the top
 * with its subtitle, today's picture drops under it and steps back, and the promise follows as three chips,
 * each lit on its words (`promise`). No date, no time, no group, no machine, no domain.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const diamondAt = props.cue('diamond');
  const cisoAt = props.cue('ciso');
  const promiseAt = props.cue('promise');
  // Title before 12 s, whatever the voice does.
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);
  const w1 = (word: string, nth = 0) => wordFrame(S, 's01-01', word, nth);

  // ---- The diamond: edges from frame 0, the Adversary card on the cue, UNKNOWN on «falta saber quién».
  const draw = progress(frame, -12, 40, EASE.inOut);
  const advIn = progress(frame, diamondAt - 6, 16);
  const linesLit = progress(frame, w1('diamante') - 4, 14) * (1 - 0.6 * progress(frame, cisoAt - 8, 18, EASE.inOut));
  const unknownAt = w1('falta') - 4;
  const unknown = progress(frame, unknownAt, 12);
  const pulse = Math.max(
    progress(frame, unknownAt, 10) * (1 - progress(frame, unknownAt + 16, 26, EASE.inOut)),
    progress(frame, w1('quién') - 2, 10) * (1 - progress(frame, w1('quién') + 16, 26, EASE.inOut)),
  );
  const orgIn = enter(frame, -6, { distance: 14, duration: 16 });
  // Alone and bigger in the middle of the stage until the CISO needs the right half.
  const solo = 1 - progress(frame, cisoAt - 20, 24, EASE.inOut);
  const youIn = enter(frame, w1('analista') - 6, { distance: 14, duration: 16 });

  // ---- The CISO and his question.
  const cisoIn = enter(frame, cisoAt - 6, { distance: 26, duration: 18, axis: 'x' });
  const q = [progress(frame, cisoAt + 2, 12), progress(frame, w1('quiere') - 2, 12)];
  const cisoGlow = progress(frame, cisoAt, 12) * (1 - progress(frame, titleAt + 4, 22, EASE.inOut));

  // ---- Title and promise; today's picture drops and steps back under them.
  const titleIn = enter(frame, titleAt, { distance: 22, duration: 18 });
  const subIn = enter(frame, titleAt + 10, { distance: 12, duration: 16 });
  const drop = progress(frame, titleAt - 10, 24, EASE.inOut);
  const groupY = mix(GROUP_Y_A, GROUP_Y_B, drop);
  const leftDim = 0.3 * progress(frame, cisoAt + 6, 18, EASE.inOut);
  const cisoDim = 0.2 * progress(frame, promiseAt - 6, 20, EASE.inOut);
  const chipAt = S01_PROMISE.map((p) => wordFrame(S, 's01-02', p.word) - 6);
  const allLit = progress(frame, chipAt[2] + 44, 16, EASE.inOut);

  return (
    <Stage>
      {/* Your diamond of the attack, under Meridian's labels */}
      <div
        style={{
          position: 'absolute',
          left: mix(LEFT.x, (W - LEFT.w) / 2, solo),
          top: groupY,
          width: LEFT.w,
          height: GROUP_H,
          transform: `scale(${1 + 0.24 * solo})`,
          transformOrigin: '50% 50%',
          ...dimStyle(leftDim),
        }}
      >
        <div style={{ fontFamily: FONT.sans, whiteSpace: 'nowrap', textAlign: 'center' }}>
          <div style={{ fontSize: 40, fontWeight: 850, lineHeight: 1.12, color: C.textStrong, ...orgIn }}>
            {S01_WHERE.org}
            <span style={{ color: C.faint }}> · </span>
            <span style={{ color: C.text, fontWeight: 700 }}>{S01_WHERE.sector}</span>
          </div>
          <div style={{ marginTop: 4, fontSize: 34, fontWeight: 750, lineHeight: 1.15, color: C.cyanSoft, ...youIn }}>{S01_WHERE.you}</div>
        </div>
        <div style={{ position: 'absolute', left: (LEFT.w - DIAMOND.w) / 2, top: LEFT.labels }}>
          <Diamond width={DIAMOND.w} height={DIAMOND.h} nameSize={DIAMOND.name} draw={draw} named={{ adv: advIn }} lit={{ adv: 0.35 + 0.65 * unknown }} unknown={unknown} pulse={pulse} linesLit={linesLit} />
        </div>
      </div>

      {/* The CISO: «¿Quién está detrás? ¿Ponemos un país en el informe?» */}
      {frame >= cisoAt - 8 ? (
        <div style={{ position: 'absolute', left: CISO.x, top: groupY + 44, ...cisoIn }}>
          <CisoStrip width={CISO.w} question={CISO_QUESTION} questionShow={q} questionSize={CISO.size} glow={cisoGlow} dim={cisoDim} />
        </div>
      ) : null}

      {/* Title, subtitle and the promise */}
      {frame >= titleAt - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, fontFamily: FONT.sans, textAlign: 'center' }}>
          <div style={{ fontSize: TITLE_SIZE, fontWeight: 900, letterSpacing: -1.6, lineHeight: 1, whiteSpace: 'nowrap', ...titleIn }}>
            <span style={{ color: C.cyan, textShadow: `0 0 34px ${alpha(C.cyan, 0.28)}` }}>{S01_TITLE.lead}</span>
            <span style={{ color: C.textStrong }}> {S01_TITLE.rest}</span>
          </div>
          <div style={{ position: 'absolute', left: 0, top: SUB_TOP, width: W, fontSize: 38, fontWeight: 700, lineHeight: 1.1, color: C.cyanSoft, whiteSpace: 'nowrap', ...subIn }}>{S01_TITLE.sub}</div>
          <div style={{ position: 'absolute', left: 0, top: CHIPS_TOP, width: W, display: 'flex', justifyContent: 'center', gap: 20 }}>
            {S01_PROMISE.map((p, i) => {
              const e = enter(frame, chipAt[i], { distance: 16 });
              const on = Math.max(allLit, progress(frame, chipAt[i], 10) * (1 - 0.55 * progress(frame, (chipAt[i + 1] ?? chipAt[i] + 400) - 2, 12, EASE.inOut)));
              return (
                <div
                  key={p.text}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    height: CHIP_H,
                    padding: '0 28px',
                    boxSizing: 'border-box',
                    borderRadius: RADIUS.pill,
                    border: `2px solid ${alpha(C.cyan, 0.4 + 0.5 * on)}`,
                    background: alpha(C.cyan, 0.06 + 0.12 * on),
                    boxShadow: on > 0.02 ? `0 0 ${Math.round(22 * on)}px ${alpha(C.cyan, 0.3 * on)}` : undefined,
                    fontSize: 34,
                    fontWeight: 750,
                    color: alpha(C.textStrong, 0.6 + 0.4 * on),
                    whiteSpace: 'nowrap',
                    ...e,
                  }}
                >
                  {p.text}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </Stage>
  );
}
