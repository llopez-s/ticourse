import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { STAMP } from '../data/s01-hook';
import { CONTROLLER, LEGAL, MOVING_TITLE, OWN, PERSONAL, PROCESSOR, SENTENCE } from '../data/s04-ley';
import { Arrow } from './parts/Arrow';
import { CaseStamp, Pill } from './parts/Labels';
import { RoleCard } from './parts/RoleCard';
import { ListStrip } from './parts/Sheet';
import { Triptych } from './parts/Triptych';
import { MoveController, MoveOwnPurpose, MoveProcessor } from './parts/Vignettes';
import { Stage, wordFrame } from './kit';

const S = 's04-ley';
const STRIP = { w: 660, h: 76, y: 74 } as const;
const ROW = { y: 170, h: 280, w: 760, xs: [0, 968] } as const;
const ARROW_Y = ROW.y + 150;

/**
 * s04-ley «Quién decide para qué». The list strip is there from the start; on `personal` it lights and two chips say
 * why the law comes in (datos personales · ley de privacidad). On `controller` the port's card comes in under it
 * (qué se recoge · para qué · cómo se trata); on `processor` the company's card comes in on the right, its term on the
 * spoken «processor», and an arrow with «instrucciones» runs from the port to it. On `own-purpose` a dashed amber arrow
 * leaves the company towards «pasa a ser controller»; on `responsibility` the sentence comes in at the bottom left and
 * a shield stays on the port's card (the work leaves, the responsibility does not); `legal-roles` adds the chip. On
 * `moving` the diagram folds away for the removal van («imagen · no es del puerto»): you decide, the firm loads, and the
 * sofa it keeps to sell. The exam card lands just before the image.
 */
export function S04Ley(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const personalAt = props.cue('personal');
  const controllerAt = props.cue('controller');
  const processorAt = props.cue('processor');
  const ownAt = props.cue('own-purpose');
  const respAt = props.cue('responsibility');
  const legalAt = props.cue('legal-roles');
  const movingAt = props.cue('moving');
  const out = progress(frame, movingAt - 16, 14, EASE.inOut);
  const stripGlow = 0.2 + 0.8 * progress(frame, personalAt, 14);
  const instrAt = w('s04-03', 'instrucciones') - 8;
  const becomesAt = w('s04-04', 'controller') - 8;
  const shield = progress(frame, respAt, 14);
  const sentenceIn = enter(frame, respAt - 2, { distance: 16 });
  const legalIn = enter(frame, legalAt - 4, { distance: 14 });

  return (
    <Stage>
      {out < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - out, fontFamily: FONT.sans }}>
          <div style={{ position: 'absolute', left: 0, top: 0, ...enter(frame, -6, { distance: 16, duration: 16 }) }}>
            <CaseStamp what={STAMP.what} kind={STAMP.kind} />
          </div>

          {/* The list, and why the law comes in */}
          <div style={{ position: 'absolute', left: 0, top: STRIP.y, opacity: 0.3 + 0.7 * enter(frame, -4, { duration: 14 }).opacity }}>
            <ListStrip width={STRIP.w} height={STRIP.h} glow={stripGlow} />
          </div>
          {PERSONAL.map((p, i) => {
            const at = p.word ? w('s04-01', p.word) - 6 : personalAt;
            if (frame < at - 2) return null;
            return (
              <div key={p.text} style={{ position: 'absolute', left: 700 + i * 330, top: STRIP.y + 8, ...enter(frame, at, { distance: 12 }) }}>
                <Pill text={p.text} tone={C.cyan} icon={i === 0 ? 'users' : 'shield'} size={32} height={60} on={progress(frame, at, 10)} />
              </div>
            );
          })}

          <RoleCard
            frame={frame}
            x={ROW.xs[0]}
            y={ROW.y}
            width={ROW.w}
            height={ROW.h}
            at={controllerAt}
            termAt={w('s04-01', 'controller') - 6}
            tone={C.cyan}
            icon="flag"
            who={CONTROLLER.who}
            term={CONTROLLER.term}
            chips={CONTROLLER.chips.map((c) => ({ text: c.text, at: w('s04-01', c.word) - 6 }))}
            glow={progress(frame, controllerAt + 6, 12)}
            chipSize={28}
          />
          <RoleCard
            frame={frame}
            x={ROW.xs[1]}
            y={ROW.y}
            width={ROW.w}
            height={ROW.h}
            at={processorAt}
            termAt={w('s04-03', 'processor') - 6}
            tone={C.sky}
            icon="mail"
            who={PROCESSOR.who}
            term={PROCESSOR.term}
            chips={[{ text: PROCESSOR.chip, at: w('s04-03', 'encargo') - 6, wrap: true }]}
            glow={progress(frame, processorAt + 6, 12) * (1 - 0.5 * progress(frame, ownAt, 12))}
            chipSize={28}
          />
          {/* the shield stays with the port */}
          {shield > 0.01 ? (
            <div
              style={{
                position: 'absolute',
                left: ROW.xs[0] + ROW.w - 90,
                top: ROW.y + 18,
                width: 64,
                height: 64,
                borderRadius: 32,
                display: 'grid',
                placeItems: 'center',
                background: C.ink900,
                border: `4px solid ${alpha(C.emerald, 0.9)}`,
                boxShadow: `0 0 ${Math.round(26 * shield)}px ${alpha(C.emerald, 0.4)}`,
                opacity: shield,
                transform: `scale(${0.7 + 0.3 * shield})`,
              }}
            >
              <Icon name="shield" size={36} color={C.emerald} strokeWidth={2.4} />
            </div>
          ) : null}

          <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <Arrow
              points={[
                [330, STRIP.y + STRIP.h + 4],
                [330, ROW.y - 4],
              ]}
              draw={progress(frame, controllerAt - 6, 14)}
              color={alpha(C.cyan, 0.6)}
              width={4}
            />
            <Arrow
              points={[
                [ROW.xs[0] + ROW.w + 8, ARROW_Y],
                [ROW.xs[1] - 8, ARROW_Y],
              ]}
              draw={progress(frame, instrAt, 18)}
              color={C.cyan}
              width={5}
            />
            <Arrow
              points={[
                [ROW.xs[1] + ROW.w / 2, ROW.y + ROW.h + 6],
                [ROW.xs[1] + ROW.w / 2, 500],
              ]}
              draw={progress(frame, ownAt, 20)}
              color={C.amber}
              width={5}
              dashed
            />
          </svg>
          {frame >= instrAt - 4 ? (
            <div style={{ position: 'absolute', left: ROW.xs[0] + ROW.w + 8, top: ARROW_Y - 62, width: ROW.xs[1] - ROW.xs[0] - ROW.w - 16, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, fontSize: 28, fontWeight: 700, color: C.cyanSoft, whiteSpace: 'nowrap', ...enter(frame, instrAt, { distance: 10 }) }}>
              <Icon name="file" size={32} color={C.cyan} />
              instrucciones
            </div>
          ) : null}

          {/* It decides for itself: the processor becomes a controller */}
          {frame >= ownAt - 4 ? (
            <div style={{ position: 'absolute', left: ROW.xs[1], top: ROW.y + ROW.h + 8, width: ROW.w, ...enter(frame, ownAt, { distance: 10 }) }}>
              <div style={{ position: 'absolute', left: 0, width: ROW.w / 2 - 30, top: 6, textAlign: 'right', fontSize: 30, fontWeight: 700, color: C.amber, whiteSpace: 'nowrap' }}>{OWN.offers}</div>
            </div>
          ) : null}
          {frame >= becomesAt - 4 ? (
            <div style={{ position: 'absolute', left: ROW.xs[1], top: 506, width: ROW.w, display: 'flex', justifyContent: 'center', ...enter(frame, becomesAt, { distance: 14 }) }}>
              <Pill text={OWN.becomes} tone={C.amber} icon="alert" size={38} height={72} on={progress(frame, becomesAt, 10)} style={{ borderStyle: 'dashed' }} />
            </div>
          ) : null}

          {/* The work leaves, the responsibility stays */}
          {frame >= respAt - 4 ? (
            <div style={{ position: 'absolute', left: 0, top: 474, width: 1000, fontSize: 44, fontWeight: 850, lineHeight: 1.18, color: C.textStrong, whiteSpace: 'nowrap', ...sentenceIn }}>
              <div>{SENTENCE[0]}</div>
              <div style={{ color: C.emerald }}>{SENTENCE[1]}</div>
            </div>
          ) : null}
          {frame >= legalAt - 6 ? (
            <div style={{ position: 'absolute', left: 0, top: 590, ...legalIn }}>
              <Pill text={LEGAL} tone={C.sky} icon="file" size={30} height={60} on={progress(frame, legalAt, 10)} />
            </div>
          ) : null}
        </div>
      ) : null}

      {frame >= movingAt - 8 ? (
        <Triptych
          frame={frame}
          startAt={movingAt}
          title={MOVING_TITLE}
          panels={[
            { name: 'tú', term: 'controller', tone: C.cyan, art: (t) => <MoveController t={t} />, caption: ['tú decides', 'qué se lleva'], at: w('s04-06', 'decides') - 8 },
            { name: 'la empresa de mudanzas', term: 'processor', tone: C.sky, art: (t) => <MoveProcessor t={t} />, caption: ['lo carga', 'como le dices'], at: w('s04-06', 'carga') - 10 },
            { name: 'la misma empresa', term: 'pasa a ser controller', tone: C.amber, art: (t) => <MoveOwnPurpose t={t} />, caption: ['si se queda tu sofá', 'para venderlo, decide ella'], at: w('s04-06', 'sofá') - 8 },
          ]}
        />
      ) : null}
    </Stage>
  );
}
