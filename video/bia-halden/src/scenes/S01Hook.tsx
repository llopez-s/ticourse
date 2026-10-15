import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Icon, dimStyle, mix, windowWeight } from '../../../engine/src/ui';
import { GLOBES, PROMISE, TITLE } from '../data/s01-hook';
import { AdversaryTag } from './parts/s01-hook/AdversaryTag';
import { GLOBE, GLOBE_ROW_W, GlobeRow, Seal } from './parts/s01-hook/Globes';
import { TRANSITION_FRAMES } from '../../../engine/src/timeline/load';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = STAGE.width;

// ---- The two globes: centred under the seal until the title lands, then they step down and back.
const ROW_GAP = 52;
const GROUP_X = Math.round((W - GLOBE_ROW_W) / 2);
const GROUP_Y_A = 200;
const GROUP_Y_B = 340;
// ---- Title block (from `title`): the title, then three chips.
const TITLE_TOP = 80;
const CHIPS_TOP = 208;
const CHIP_H = 62;
// ---- PAPER GOVERNOR's tag, under the chips.
const TAG_TOP = 400;

/** The title's violet exam terms with the plain «y» between them. */
function TitleText() {
  return (
    <>
      <span style={{ color: '#c4b5fd' }}>{TITLE[0]}</span>
      <span style={{ color: C.textStrong, fontWeight: 700 }}> {TITLE[1]} </span>
      <span style={{ color: '#c4b5fd' }}>{TITLE[2]}</span>
    </>
  );
}

/**
 * s01-hook «Enseguida». The seal («análisis de impacto en el negocio · propuesta · ejemplo · datos ficticios») and
 * two empty globe slots are there from the first frame. On `ask-time` the first question lands («¿Cuánto tarda en
 * volver?») and its vague answer on «Enseguida»; on `ask-data` the second, answered on «Poca cosa». On `fade` both
 * answers turn into hollow outlines: they are not numbers. Before 12 s (`title`) «RTO y RPO» lands at the top while the
 * globes step down and back; the promise follows as three chips, each lit on its own word. On `adversary` the chips
 * step back and PAPER GOVERNOR's tag («PAPER GOVERNOR · sección 5» / «vive en los huecos de tu gobernanza») settles
 * under them, over the ghosts of the globes; on «huecos» it glows once more.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const fadeAt = props.cue('fade');
  const advAt = props.cue('adversary');
  // Title before 12 s, whatever the voice does.
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);

  // ---- Seal and slots from the first frame.
  const settle = progress(frame, -8, 22);

  // ---- The globes.
  const askIn = GLOBES.map((g) => springIn(frame, 30, props.cue(g.cue) - 6, { damping: 16 }));
  const ansAt = GLOBES.map((g) => Math.max(props.cue(g.cue) + 8, wordFrame(S, 's01-01', g.word) - 6));
  const ansIn = ansAt.map((a) => springIn(frame, 30, a, { damping: 15 }));
  const hollow = progress(frame, fadeAt - 4, 16, EASE.inOut);
  const toGhost = progress(frame, titleAt - 2, 22, EASE.inOut);
  const toTag = progress(frame, advAt - 8, 18, EASE.inOut);
  const groupY = mix(GROUP_Y_A, GROUP_Y_B, progress(frame, titleAt - 8, 26, EASE.inOut));
  // Dimmed on `fade`, a ghost once the title takes the room.
  const groupStyle = { ...dimStyle(0.5 * hollow + 0.5 * toGhost), opacity: (1 - 0.6 * hollow) * (1 - 0.7 * toGhost) * (1 - toTag) };

  // The tag takes the room: nothing of the globes may remain behind it (not even a 1 % ghost).
  const showGlobes = toTag < 0.999;
  // Everything is gone before s02 starts to fade in, so none of its chips shows through the title or the tag.
  const leave = progress(frame, props.durationInFrames - TRANSITION_FRAMES - 12, 12, EASE.inOut);

  // ---- Title and promise.
  const titleIn = enter(frame, titleAt, { distance: 22, duration: 18 });
  const chipAt = PROMISE.map((p, i) => (i === 0 ? Math.min(wordFrame(S, 's01-02', p.word) - 6, props.cue('promise') + 14) : wordFrame(S, 's01-02', p.word) - 6));
  const blockDim = 0.45 * progress(frame, advAt - 8, 16, EASE.inOut);

  // ---- PAPER GOVERNOR.
  const tagIn = enter(frame, advAt - 2, { distance: 26, duration: 18 });
  const gapAt = wordFrame(S, 's01-03', 'huecos') - 6;
  const gapGlow = windowWeight(frame, gapAt, Number.POSITIVE_INFINITY, { ramp: 14 });

  return (
    <Stage style={{ opacity: 1 - leave }}>
      {/* The seal of the proposal */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, display: 'flex', justifyContent: 'center', opacity: settle, ...dimStyle(0.35 * toGhost) }}>
        <Seal />
      </div>

      {/* The two globes: question, arrow, vague answer */}
      {showGlobes ? (
        <div style={{ position: 'absolute', left: GROUP_X, top: groupY, ...groupStyle }}>
          {GLOBES.map((g, i) => (
            <div key={g.cue} style={{ position: 'absolute', left: 0, top: i * (GLOBE.h + ROW_GAP) }}>
              <GlobeRow ask={g.ask} answer={g.answer} askIn={askIn[i]} ansIn={ansIn[i]} hollow={hollow} />
            </div>
          ))}
          <div style={{ width: GLOBE_ROW_W, height: 2 * GLOBE.h + ROW_GAP }} />
        </div>
      ) : null}

      {/* Title */}
      {frame >= titleAt - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: TITLE_TOP, width: W, textAlign: 'center', fontFamily: FONT.sans, ...titleIn, ...dimStyle(blockDim, titleIn.opacity) }}>
          <span
            style={{
              fontSize: 100,
              fontWeight: 900,
              letterSpacing: -2,
              lineHeight: 1,
              textShadow: `0 0 34px ${alpha(C.violet, 0.3)}`,
              whiteSpace: 'pre',
            }}
          >
            <TitleText />
          </span>
        </div>
      ) : null}

      {/* The promise: three chips */}
      {frame >= chipAt[0] - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: CHIPS_TOP, width: W, display: 'flex', justifyContent: 'center', gap: 24, ...dimStyle(blockDim) }}>
          {PROMISE.map((p, i) => {
            const e = enter(frame, chipAt[i], { distance: 16 });
            const on = progress(frame, chipAt[i], 10) * (1 - 0.55 * progress(frame, (chipAt[i + 1] ?? advAt - 6) - 2, 12, EASE.inOut));
            return (
              <div
                key={p.text}
                style={{
                  ...e,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 14,
                  height: CHIP_H,
                  padding: '0 30px 0 22px',
                  boxSizing: 'border-box',
                  borderRadius: RADIUS.pill,
                  border: `2px solid ${alpha(C.cyan, 0.4 + 0.5 * on)}`,
                  background: alpha(C.cyan, 0.06 + 0.12 * on),
                  boxShadow: on > 0.02 ? `0 0 ${Math.round(22 * on)}px ${alpha(C.cyan, 0.3 * on)}` : undefined,
                  fontFamily: FONT.sans,
                  fontSize: 40,
                  fontWeight: 750,
                  color: C.textStrong,
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon name={p.icon} size={38} color={C.cyan} />
                {p.text}
              </div>
            );
          })}
        </div>
      ) : null}

      {/* PAPER GOVERNOR: a label that lives in the gaps */}
      {frame >= advAt - 4 ? (
        <div style={{ position: 'absolute', left: 0, top: TAG_TOP, width: W, display: 'flex', justifyContent: 'center', ...tagIn }}>
          <AdversaryTag glow={gapGlow} />
        </div>
      ) : null}
    </Stage>
  );
}
