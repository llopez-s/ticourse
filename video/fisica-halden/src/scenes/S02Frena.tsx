import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { mix } from '../../../engine/src/ui';
import { FloorPlan, PLAN, PLAN_STOP } from './parts/FloorPlan';
import { Pill, TermPill } from './parts/Labels';
import { PlanLabel } from './parts/PlanLabel';
import { S01_CAR } from './S01Hook';
import { Stage, wordFrame } from './kit';

const S = 's02-frena';

/** The three stops: the question on top, then the exam term and what it stops. */
const STOPS = [
  { q: '¿Puede entrar un vehículo?', term: 'bollards', gloss: 'postes fijos · paran un vehículo, no a quien va a pie', ring: PLAN_STOP.street },
  { q: '¿Cuántos pasan a la vez?', term: 'access control vestibule', gloss: 'dos puertas, una sola abierta · pasa una persona', ring: PLAN_STOP.door },
  { q: '¿Quién es y adónde puede ir?', term: 'access badge', gloss: 'cada persona, sus zonas · cada acceso queda apuntado', ring: PLAN_STOP.reader },
] as const;
const REST = ['security guard · video surveillance', 'fencing · lighting'];
const LINE = 'cada control tapa un hueco';

const PLAN_W = 1060;
const PLAN_TOP = 180;
const PLAN_H = (PLAN_W * PLAN.h) / PLAN.w;
const COL_X = 1100;
const ANSWER_TOP = 76;

/**
 * s02-frena «Qué frena cada control». The floor plan below, the question of each stop on top (never around the
 * drawing). Street: the car drives up to the facade, «¿Puede entrar un vehículo?», the bollards rise on «bollards» and a
 * person on foot walks between two posts on «pie». Door: «¿Cuántos pasan a la vez?», the vestibule's second door is
 * drawn on «dos» and the doors open one at a time with one person inside; the term on `vestibule`. Reader: a card
 * reader on the jamb with a person in front, its light on «tarjeta» and the access log on «apuntado». The right column
 * keeps the plan's label and collects the three terms; on `rest` the other measures come in a half-lit chip, and on
 * `line` «cada control tapa un hueco» under the plan. No camera is drawn.
 */
export function S02Frena(props: SceneProps) {
  const frame = useCurrentFrame();
  const carAt = props.cue('car');
  const doorAt = props.cue('door');
  const vestAt = props.cue('vestibule');
  const badgeAt = props.cue('badge');
  const restAt = props.cue('rest');
  const lineAt = props.cue('line');
  const bollardsAt = wordFrame(S, 's02-02', 'bollards') - 4;
  const pieAt = wordFrame(S, 's02-02', 'pie') - 24;
  const dosAt = wordFrame(S, 's02-03', 'dos') - 4;
  const cycleAt = wordFrame(S, 's02-03', 'abre') - 8;
  const badgeWord = wordFrame(S, 's02-04', 'badge') - 4;
  const beepAt = wordFrame(S, 's02-04', 'tarjeta') - 4;
  const logAt = wordFrame(S, 's02-04', 'apuntado') - 12;

  const stopAt = [carAt, doorAt, badgeAt];
  const termAt = [bollardsAt, vestAt, badgeWord];
  const endAt = [doorAt, badgeAt, restAt];

  // Plan state
  const car = mix(S01_CAR, 1, progress(frame, carAt, 34, EASE.inOut));
  const bollards = progress(frame, bollardsAt, 24);
  const c = frame - cycleAt;
  const outer = progress(c, 0, 12) * (1 - progress(c, 36, 12));
  const inner = progress(c, 48, 12) * (1 - progress(c, 84, 12));
  let walker: number | undefined;
  if (frame >= pieAt - 2) walker = progress(frame, pieAt, 40, EASE.inOut) + progress(c, 10, 24, EASE.inOut) + progress(c, 58, 24, EASE.inOut);
  const ringOf = (i: number) => progress(frame, stopAt[i] - 2, 12) * (1 - progress(frame, endAt[i] - 8, 10));
  const ringI = frame < doorAt - 8 ? 0 : frame < badgeAt - 8 ? 1 : 2;
  const ring = { ...STOPS[ringI].ring, on: ringOf(ringI) };

  const restIn = progress(frame, restAt, 16);
  const lineIn = enter(frame, lineAt - 2, { distance: 16 });

  return (
    <Stage>
      {/* Top band: one stop at a time */}
      {STOPS.map((s, i) => {
        const vis = progress(frame, stopAt[i] - 2, 12) * (1 - progress(frame, endAt[i] - 10, 10));
        if (vis <= 0.01) return null;
        const ans = enter(frame, termAt[i], { distance: 14 });
        return (
          <div key={s.term} style={{ position: 'absolute', left: 0, top: 0, width: 1728, opacity: vis, fontFamily: FONT.sans }}>
            <div style={{ fontSize: 52, fontWeight: 850, color: C.textStrong, letterSpacing: -1, whiteSpace: 'nowrap', transform: `translateY(${(1 - vis) * 10}px)` }}>{s.q}</div>
            {frame >= termAt[i] - 2 ? (
              <div style={{ position: 'absolute', left: 0, top: ANSWER_TOP, display: 'flex', alignItems: 'center', gap: 24, whiteSpace: 'nowrap', ...ans }}>
                <TermPill text={s.term} size={40} />
                <span style={{ fontSize: 36, fontWeight: 700, color: C.text }}>{s.gloss}</span>
              </div>
            ) : null}
          </div>
        );
      })}

      {/* The plan */}
      <div style={{ position: 'absolute', left: 0, top: PLAN_TOP }}>
        <FloorPlan
          width={PLAN_W}
          car={car}
          bollards={bollards}
          walker={walker}
          vestibule={progress(frame, dosAt, 18)}
          outer={outer}
          inner={inner}
          reader={progress(frame, badgeAt, 14)}
          person={progress(frame, badgeAt + 6, 14)}
          beep={progress(frame, beepAt, 14)}
          log={progress(frame, logAt, 30)}
          ring={ring}
          idSuffix="-s2"
        />
      </div>

      {/* Right column: the plan's label and the terms collected so far */}
      <div style={{ position: 'absolute', left: COL_X, top: PLAN_TOP }}>
        <PlanLabel size={26} />
      </div>
      {STOPS.map((s, i) => {
        if (frame < termAt[i] - 2) return null;
        const on = i === ringI && frame < restAt ? 1 : 0.35;
        return (
          <div key={s.term} style={{ position: 'absolute', left: COL_X, top: PLAN_TOP + 110 + i * 70, ...enter(frame, termAt[i] + 4, { distance: 12 }) }}>
            <TermPill text={s.term} size={32} on={frame >= lineAt ? 1 : on} />
          </div>
        );
      })}
      {restIn > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: COL_X,
            top: PLAN_TOP + 330,
            opacity: 0.6 * restIn,
            transform: `translateY(${(1 - restIn) * 12}px)`,
            padding: '10px 22px',
            borderRadius: RADIUS.md,
            border: `2px solid ${alpha(C.muted, 0.6)}`,
            background: alpha(C.muted, 0.06),
            fontFamily: FONT.sans,
            fontSize: 28,
            fontWeight: 700,
            lineHeight: 1.25,
            color: C.text,
            whiteSpace: 'nowrap',
          }}
        >
          {REST.map((r) => (
            <div key={r}>{r}</div>
          ))}
          <div style={{ color: C.muted, fontWeight: 600 }}>las demás, en la lección</div>
        </div>
      ) : null}

      {/* Foot: the line under the plan */}
      {frame >= lineAt - 4 ? (
        <div style={{ position: 'absolute', left: 0, top: PLAN_TOP + PLAN_H + 20, width: PLAN_W, display: 'flex', justifyContent: 'center', ...lineIn }}>
          <Pill text={LINE} tone={C.cyan} size={42} height={64} />
        </div>
      ) : null}
    </Stage>
  );
}
