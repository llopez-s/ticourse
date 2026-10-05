import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, clamp01, mix, windowWeight } from '../../../engine/src/ui';
import { ALARM_SOURCES, AOO_SLOT, CUT_SLOT, DONE, LANGUAGE, LATE, SAVED, SEE_FIRST } from '../data/s07-izquierda';
import { Alarm, alarmBox } from './parts/Alarm';
import { PHASE_IDS, PhaseRow, killChainLayout, type VignetteLook } from './parts/KillChain';
import { Stage, wordFrame } from './kit';

const S = 's07-izquierda';
const W = 1728;

// ---- Places (stage-local) ----------------------------------------------------------------
const ROW_Y = 320;
const ROW = killChainLayout(W);
const BELL = 80;
const BOX = alarmBox(BELL, true);
/** Top of every alarm box once it sits on its source. */
const ALARM_TOP = ROW_Y - 10 - BOX.h;
/** The pile over Actions on Objectives (bottom row of three, two above), offsets from the AoO slot centre. */
const PILE: readonly { dx: number; dy: number }[] = [
  { dx: -52, dy: 0 },
  { dx: 0, dy: 0 },
  { dx: 52, dy: 0 },
  { dx: -26, dy: -64 },
  { dx: 26, dy: -64 },
];
/** Where each alarm ends after `shift`: the four sources, and one stays on Actions on Objectives. */
const TARGETS = [...ALARM_SOURCES, { slot: AOO_SLOT, icon: 'desktop' as const, label: 'equipo', mail: false }];
const UNDER_Y = ROW_Y + ROW.height + 12;

/**
 * s07-izquierda «Enterarte tarde». (GLASS VIPER's message is up from the start
 * until `late`: everything stays low, the bells pile at the far right.) The
 * phase row with alarms: first every bell sits on Actions on Objectives
 * (`alarms-right`); the slot is an open safe, the thief's hand on the plans
 * still inside: «te enteras cuando ya está con los planos» (`late`, they all
 * ring); the six earlier slots wash rose, «ya hechas, sin que lo vieras»
 * (`done`). Before anything moves, «para saltar antes, hay que ver antes»
 * with «registros del correo · del equipo» (`see-first`). Then the bells fly
 * left to the earlier steps, each landing on a source that watches that
 * phase — «correo» under Delivery, «equipo» under the host's phases
 * (`shift`); Delivery's bell rings and nobody acts: nothing changes. An
 * emerald padlock drops onto that same bell (`act`) and only then the slots to
 * its right switch off: «cada paso que paras de verdad te ahorra los
 * siguientes» (`saved`). A bubble, «lo paramos en Delivery», «cuatro palabras
 * que dicen mucho» (`language`).
 */
export function S07Izquierda(props: SceneProps) {
  const frame = useCurrentFrame();

  const alarmsAt = props.cue('alarms-right');
  const lateAt = props.cue('late');
  const doneAt = props.cue('done');
  const seeFirstAt = props.cue('see-first');
  const shiftAt = props.cue('shift');
  const actAt = props.cue('act');
  const savedAt = props.cue('saved');
  const languageAt = props.cue('language');

  const wSuena = wordFrame(S, 's07-04', 'suena');
  const wCuatro = wordFrame(S, 's07-06', 'cuatro');
  const wRegistros = wordFrame(S, 's07-03', 'registros');

  // ---- The row -----------------------------------------------------------------------------
  const rowIn = progress(frame, -6, 16);
  const wash = progress(frame, doneAt, 18, EASE.inOut);
  const cut = progress(frame, actAt + 10, 16);
  const spared = (slot: number) => progress(frame, savedAt + 4 + (slot - CUT_SLOT - 1) * 5, 14);
  const safeHand = progress(frame, lateAt - 4, 40, EASE.inOut);

  const looks: Record<string, VignetteLook> = {};
  PHASE_IDS.forEach((id, slot) => {
    const look: VignetteLook = { show: rowIn };
    if (slot === AOO_SLOT) {
      look.variant = 'safe';
      look.act = safeHand;
      if (frame >= lateAt - 4) look.tone = 'rose';
      look.lit = windowWeight(frame, lateAt - 4, doneAt + 30, { ramp: 12 }) * (1 - spared(slot));
    } else if (wash > 0.01) {
      look.wash = wash;
      look.tone = 'rose';
    }
    if (slot === CUT_SLOT && cut > 0) {
      look.wash = wash * (1 - cut);
      look.tone = cut > 0.5 ? 'emerald' : 'rose';
      look.lit = cut;
    }
    if (slot > CUT_SLOT) {
      const sp = spared(slot);
      if (sp > 0) {
        look.grey = sp;
        if (slot !== AOO_SLOT) look.wash = wash * (1 - sp);
      }
    }
    looks[id] = look;
  });

  // ---- Alarms -------------------------------------------------------------------------------------
  const aoo = ROW.slots[AOO_SLOT];
  const alarms = TARGETS.map((t, i) => {
    const appear = progress(frame, alarmsAt + i * 4, 14);
    // The last one stays on Actions on Objectives: it only settles from the pile onto its own source.
    const move = progress(frame, shiftAt + 4 + i * 6, 26, EASE.inOut);
    const target = ROW.slots[t.slot];
    const x0 = aoo.cx + PILE[i].dx;
    const y0 = ALARM_TOP + PILE[i].dy;
    const cx = mix(x0, target.cx, move);
    const top = mix(y0, ALARM_TOP, move) - Math.sin(Math.PI * move) * (t.slot === AOO_SLOT ? 0 : 46);
    const landed = progress(frame, shiftAt + 4 + i * 6 + 20, 12);
    const ringLate = windowWeight(frame, lateAt - 2, lateAt + 84, { ramp: 8 });
    const ringNobody = t.slot === CUT_SLOT ? windowWeight(frame, wSuena - 2, actAt - 4, { ramp: 8 }) : 0;
    const act = t.slot === CUT_SLOT ? progress(frame, actAt + 4, 16, EASE.inOut) : 0;
    const off = t.slot > CUT_SLOT ? spared(t.slot) : 0;
    return { ...t, i, appear, cx, top, landed, ring: Math.max(ringLate, ringNobody), act, off };
  });

  // ---- Texts ----------------------------------------------------------------------------------------
  const lateIn = progress(frame, lateAt + 4, 14) * (1 - progress(frame, seeFirstAt - 8, 12));
  const doneIn = progress(frame, doneAt + 10, 14) * (1 - progress(frame, actAt, 12));
  const doneLine = progress(frame, doneAt + 4, 18, EASE.inOut);
  const seeIn = progress(frame, seeFirstAt, 14) * (1 - progress(frame, languageAt - 10, 12));
  const seeSub = progress(frame, wRegistros - 4, 14);
  const savedIn = progress(frame, savedAt + 8, 14);
  const savedLine = progress(frame, savedAt + 2, 18, EASE.inOut);
  const bubbleIn = progress(frame, languageAt, 14);
  const bubbleSub = progress(frame, wCuatro - 4, 14);

  const doneX1 = ROW.slots[AOO_SLOT - 1].x + ROW.slotW;
  const savedX0 = ROW.slots[CUT_SLOT + 1].x;
  const cutCx = ROW.slots[CUT_SLOT].cx;

  return (
    <Stage>
      {/* The phase row */}
      <div style={{ position: 'absolute', left: 0, top: ROW_Y }}>
        <PhaseRow width={W} looks={looks} names={rowIn} />
      </div>

      {/* Alarms */}
      {alarms.map((a) => (
        <div key={a.i} style={{ position: 'absolute', left: a.cx - BOX.w / 2, top: a.top }}>
          <Alarm
            size={BELL}
            appear={a.appear}
            ring={a.ring}
            act={a.act}
            off={a.off}
            source={{ icon: a.icon, label: a.label, tone: a.mail ? C.sky : C.cyan, appear: a.landed }}
          />
        </div>
      ))}

      {/* «te enteras cuando ya está con los planos» — over the pile, top right */}
      {lateIn > 0 ? (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 44,
            transform: `translateY(-50%) translateY(${(1 - lateIn) * 10}px)`,
            opacity: lateIn,
            fontFamily: FONT.sans,
            fontSize: 44,
            fontWeight: 800,
            color: C.roseSoft,
            whiteSpace: 'nowrap',
          }}
        >
          {LATE}
        </div>
      ) : null}

      {/* «ya hechas, sin que lo vieras» under the six rose slots */}
      {doneIn > 0 || doneLine > 0 ? (
        <Bracket x0={0} x1={doneX1} y={UNDER_Y} draw={doneLine} tone={C.rose} fade={1 - progress(frame, actAt, 12)}>
          <span style={{ color: C.roseSoft, opacity: doneIn }}>{DONE}</span>
        </Bracket>
      ) : null}

      {/* «para saltar antes, hay que ver antes» + «registros del correo · del equipo» */}
      {seeIn > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: 14, opacity: seeIn, transform: `translateY(${(1 - seeIn) * 10}px)` }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 16,
              padding: '10px 28px',
              borderRadius: 999,
              border: `3px solid ${alpha(C.cyan, 0.75)}`,
              background: alpha(C.cyan, 0.1),
              fontFamily: FONT.sans,
              fontSize: 44,
              fontWeight: 800,
              color: C.cyanSoft,
              whiteSpace: 'nowrap',
            }}
          >
            <Icon name="eye" size={44} color={C.cyan} />
            {SEE_FIRST.main}
          </div>
          <div style={{ marginTop: 10, marginLeft: 30, fontFamily: FONT.sans, fontSize: 32, fontWeight: 650, color: C.muted, whiteSpace: 'nowrap', opacity: seeSub }}>
            {SEE_FIRST.sub}
          </div>
        </div>
      ) : null}

      {/* «cada paso que paras de verdad te ahorra los siguientes» under the spared slots */}
      {savedLine > 0 ? (
        <Bracket x0={savedX0} x1={W} y={UNDER_Y} draw={savedLine} tone={C.emerald} align="right">
          <span style={{ color: '#6ee7b7', opacity: savedIn }}>{SAVED}</span>
        </Bracket>
      ) : null}

      {/* «lo paramos en Delivery» */}
      {bubbleIn > 0 ? (
        <>
          <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: bubbleIn }}>
            <path d={`M${cutCx - 70} 86 L${cutCx - 6} ${ALARM_TOP + 6} L${cutCx + 10} 86 Z`} fill={C.ink900} stroke={alpha(C.emerald, 0.85)} strokeWidth={3} strokeLinejoin="round" />
          </svg>
          <div
            style={{
              position: 'absolute',
              left: cutCx - 330,
              top: 14,
              transform: `scale(${mix(0.9, 1, bubbleIn)})`,
              transformOrigin: '50% 100%',
              opacity: bubbleIn,
              padding: '12px 34px',
              borderRadius: 28,
              border: `3px solid ${alpha(C.emerald, 0.85)}`,
              background: C.ink900,
              boxShadow: `0 0 26px ${alpha(C.emerald, 0.25)}`,
              fontFamily: FONT.sans,
              fontSize: 50,
              fontWeight: 850,
              color: C.textStrong,
              whiteSpace: 'nowrap',
            }}
          >
            {LANGUAGE.bubble}
          </div>
          <div
            style={{
              position: 'absolute',
              left: cutCx + 360,
              top: 54,
              transform: `translateY(-50%) translateX(${(1 - bubbleSub) * 12}px)`,
              opacity: bubbleSub,
              fontFamily: FONT.sans,
              fontSize: 36,
              fontWeight: 650,
              color: C.muted,
              whiteSpace: 'nowrap',
            }}
          >
            {LANGUAGE.sub}
          </div>
        </>
      ) : null}
    </Stage>
  );
}

/** A bracket under a run of slots with its line of text under it. */
function Bracket({
  x0,
  x1,
  y,
  draw,
  tone,
  fade = 1,
  align = 'center',
  children,
}: {
  x0: number;
  x1: number;
  y: number;
  draw: number;
  tone: string;
  fade?: number;
  align?: 'center' | 'right';
  children: ReactNode;
}) {
  const d = clamp01(draw);
  const len = x1 - x0 + 24;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: 660, opacity: clamp01(fade) }}>
      <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <path
          d={`M${x0 + 6} ${y - 12} L${x0 + 6} ${y} L${x1 - 6} ${y} L${x1 - 6} ${y - 12}`}
          fill="none"
          stroke={tone}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={`${len} ${len}`}
          strokeDashoffset={len * (1 - d)}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          top: y + 6,
          ...(align === 'right' ? { right: W - x1, textAlign: 'right' as const } : { left: x0, width: x1 - x0, textAlign: 'center' as const }),
          fontFamily: FONT.sans,
          fontSize: 38,
          fontWeight: 750,
          whiteSpace: 'nowrap',
          lineHeight: 1.1,
        }}
      >
        {children}
      </div>
    </div>
  );
}
