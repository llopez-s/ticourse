import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, typewriter } from '../../../engine/src/theme/motion';
import { Icon, mix } from '../../../engine/src/ui';
import { S03_ENDS, S03_LOOP, S03_NOTEBOOK, S03_QUESTIONS, S03_SCHEMES } from '../data/s03-bucle';
import { Bus, Rider, StopPost } from './parts/Figures';
import { examWindow } from './parts/timing';
import { Stage, wordFrame } from './kit';

const S = 's03-bucle';
const W = STAGE.width;

/** Left column: the four question cards. Right area: everything else. */
const CARDS = { x: 0, w: 540, h: 92, top: 110, step: 104 };
const R = { x: 600, w: W - 600 };
const ROAD_Y = 520;
const BUS_W = 360;
const BUS_LEFT = 700;
const STOP_X = 1380;
const RIDER_H = 150;
const RIDER_X = 1270;
const LOOP_W = R.w;
const NODE = { w: 300, h: 110 };
const SKY = '#7dd3fc';

/**
 * s03-bucle «Preguntar al viajero».
 *   survey   the last stop of s02: a traveller gets off and is asked something (a bubble).
 *   q1..q4   the lesson's four questions, one card per question, in time with the voice.
 *   loop     the bus drives off; a loop of three nodes: producto, feedback, requirements ajustados.
 *   record   a notebook opens with the lesson's example sentence (X and Y stay letters).
 *   win      Y resolves (check sfx).
 *   fund     «la frase que financia equipos»; two diagrams: attributable (thread) against coincidence (no thread).
 *   end      (after the exam card, no cue) «preguntas para mejorar» and «éxitos para demostrar».
 */
export function S03Bucle(props: SceneProps) {
  const frame = useCurrentFrame();
  const surveyAt = props.cue('survey');
  const qAt = ['q1', 'q2', 'q3', 'q4'].map((id) => props.cue(id));
  const loopAt = props.cue('loop');
  const recordAt = props.cue('record');
  const winAt = props.cue('win');
  const fundAt = props.cue('fund');
  const w3 = (word: string) => wordFrame(S, 's03-03', word);
  const w5 = (word: string) => wordFrame(S, 's03-05', word);

  // ---- Survey vignette (right area), gone when the loop arrives.
  const vigIn = progress(frame, 0, 18);
  const vigOut = progress(frame, loopAt - 6, 26, EASE.in);
  const step = progress(frame, surveyAt, 30, EASE.out);
  const bubble = progress(frame, surveyAt + 24, 16, EASE.out);
  const busAway = progress(frame, loopAt - 6, 30, EASE.in);
  const door = BUS_LEFT + 298 * (BUS_W / 320);
  const riderX = mix(door, RIDER_X, step);
  const seatRider = 1 - progress(frame, surveyAt - 2, 8);

  // ---- Loop (big, then a compact strip on top).
  const nodeAt = [loopAt, w3('feedback') - 6, w3('ajustas') - 6];
  const arcAt = w3('productos') - 8;
  const labelAt = w3('ciclo') - 8;
  const compact = progress(frame, recordAt - 6, 26, EASE.inOut);
  const loopScale = mix(1, 0.6, compact);
  const loopTop = mix(190, 0, compact);

  // ---- Notebook and its sentence.
  const noteIn = progress(frame, recordAt - 4, 18);
  const firstTyped = typewriter(S03_NOTEBOOK.first, frame, recordAt + 10, 30, 30);
  const secondAt = winAt - 10;
  const secondTyped = typewriter(S03_NOTEBOOK.second, frame, secondAt, 30, 30);
  const resolved = progress(frame, winAt + 10, 12);
  const fundIn = enter(frame, fundAt - 4, { distance: 20, duration: 16 });
  const fundGlow = progress(frame, fundAt, 14);

  // ---- Diagrams and closing labels.
  const linkedAt = w5('atribuible') - 8;
  const timingAt = w5('solo') - 8;
  const exam = examWindow(S);
  const endAt = Math.min(exam ? exam.to : props.durationInFrames, props.durationInFrames - 80);

  return (
    <Stage>
      {/* Left column: one card per question */}
      {S03_QUESTIONS.map((q, i) => {
        const e = enter(frame, qAt[i] - 4, { distance: 70, axis: 'x', duration: 16 });
        const lit = progress(frame, qAt[i], 10) * (1 - 0.5 * progress(frame, (qAt[i + 1] ?? loopAt) - 2, 14));
        return frame >= qAt[i] - 6 ? (
          <div
            key={q.text}
            style={{
              ...e,
              position: 'absolute',
              left: CARDS.x,
              top: CARDS.top + i * CARDS.step,
              width: CARDS.w,
              height: CARDS.h,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              padding: '0 24px',
              borderRadius: 22,
              border: `${lit > 0.4 ? 3 : 2}px solid ${alpha(C.sky, 0.35 + 0.55 * lit)}`,
              background: `linear-gradient(90deg, ${alpha(C.sky, 0.06 + 0.14 * lit)} 0%, ${alpha(C.ink900, 0.97)} 70%)`,
              boxShadow: lit > 0.05 ? `0 0 ${Math.round(30 * lit)}px ${alpha(C.sky, 0.25 * lit)}` : undefined,
              fontFamily: FONT.sans,
            }}
          >
            <Icon name={q.icon} size={44} color={C.sky} />
            <span style={{ fontSize: 38, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap', letterSpacing: -0.4 }}>{q.text}</span>
          </div>
        ) : null;
      })}

      {/* Right area, survey: the last stop of the line */}
      {vigOut < 0.999 ? (
        <div style={{ position: 'absolute', left: R.x, top: 0, width: R.w, height: STAGE.height, opacity: vigIn * (1 - vigOut), transform: `translateX(${vigOut * 220}px)` }}>
          <svg width={R.w} height={STAGE.height} viewBox={`${R.x} 0 ${R.w} ${STAGE.height}`} style={{ position: 'absolute', left: 0, top: 0 }} aria-hidden>
            <line x1={R.x + 10} y1={ROAD_Y} x2={W - 20} y2={ROAD_Y} stroke={C.ink600} strokeWidth={14} strokeLinecap="round" />
            <line x1={R.x + 10} y1={ROAD_Y} x2={W - 20} y2={ROAD_Y} stroke={C.ink500} strokeWidth={3} strokeDasharray="16 22" />
            <circle cx={STOP_X} cy={ROAD_Y} r={15} fill={C.ink950} stroke={C.emerald} strokeWidth={5} />
          </svg>
          <div style={{ position: 'absolute', left: STOP_X - 50 - R.x, top: ROAD_Y - 160 }}>
            <StopPost size={150} color={C.emerald} lit={step} />
          </div>
          <div style={{ position: 'absolute', left: BUS_LEFT - R.x - busAway * 0, top: ROAD_Y - 157 }}>
            <Bus width={BUS_W} riders={[0, 0, 0, seatRider, 0]} />
          </div>
          <div style={{ position: 'absolute', left: riderX - R.x - (RIDER_H * 40) / 70 / 2, top: ROAD_Y + 6 - RIDER_H, opacity: Math.min(1, step * 3) }}>
            <Rider size={RIDER_H} />
          </div>
          {/* the question that reaches her */}
          {bubble > 0.01 ? (
            <div style={{ position: 'absolute', left: RIDER_X - R.x - 40, top: 190, opacity: bubble, transform: `scale(${0.85 + 0.15 * bubble})`, transformOrigin: '30% 100%' }}>
              <svg width={300} height={200} viewBox="0 0 300 200" aria-hidden>
                <path d="M30 6 H270 A24 24 0 0 1 294 30 V122 A24 24 0 0 1 270 146 H112 L58 190 L74 146 H30 A24 24 0 0 1 6 122 V30 A24 24 0 0 1 30 6 Z" fill={alpha(C.sky, 0.14)} stroke={C.sky} strokeWidth={5} strokeLinejoin="round" />
                <text x="150" y="112" textAnchor="middle" fontFamily={FONT.sans} fontSize="104" fontWeight="850" fill={SKY}>
                  ¿?
                </text>
              </svg>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Right area: the loop */}
      {frame >= loopAt - 4 ? (
        <div
          style={{
            position: 'absolute',
            left: R.x,
            top: loopTop,
            width: LOOP_W,
            height: 250,
            transform: `scale(${loopScale})`,
            transformOrigin: '50% 0',
            opacity: mix(1, 0.8, compact),
            fontFamily: FONT.sans,
          }}
        >
          <svg width={LOOP_W} height={250} viewBox={`0 0 ${LOOP_W} 250`} style={{ position: 'absolute', left: 0, top: 0 }} aria-hidden>
            <defs>
              <marker id="s03-head" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M0 0 L10 5 L0 10 Z" fill={C.sky} />
              </marker>
              <marker id="s03-head-g" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M0 0 L10 5 L0 10 Z" fill={C.emerald} />
              </marker>
            </defs>
            {[0, 1].map((i) => (
              <line
                key={i}
                x1={NODE.w * (i + 1) + 114 * i + 8}
                y1={NODE.h / 2}
                x2={NODE.w * (i + 1) + 114 * i + 106}
                y2={NODE.h / 2}
                stroke={C.sky}
                strokeWidth={6}
                strokeLinecap="round"
                markerEnd="url(#s03-head)"
                opacity={progress(frame, nodeAt[i + 1] - 10, 12)}
              />
            ))}
            <path
              d={`M ${LOOP_W - NODE.w / 2} ${NODE.h + 8} C ${LOOP_W - NODE.w / 2} 240, ${NODE.w / 2} 240, ${NODE.w / 2} ${NODE.h + 12}`}
              fill="none"
              stroke={C.emerald}
              strokeWidth={6}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - progress(frame, arcAt, 34)}
              markerEnd={progress(frame, arcAt, 34) >= 0.99 ? 'url(#s03-head-g)' : undefined}
            />
          </svg>
          {S03_LOOP.nodes.map((lines, i) => {
            const p = progress(frame, nodeAt[i], 14);
            const tone = [C.cyan, C.sky, C.emerald][i];
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: i * (NODE.w + 114),
                  top: 0,
                  width: NODE.w,
                  height: NODE.h,
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 24,
                  border: `3px solid ${alpha(tone, 0.8)}`,
                  background: `linear-gradient(180deg, ${alpha(tone, 0.16)} 0%, ${alpha(C.ink900, 0.97)} 100%)`,
                  fontSize: 40,
                  fontWeight: 850,
                  lineHeight: 1.1,
                  color: C.textStrong,
                  opacity: p,
                  transform: `translateY(${(1 - p) * 20}px)`,
                }}
              >
                {lines.map((l) => (
                  <div key={l}>{l}</div>
                ))}
              </div>
            );
          })}
          <div style={{ position: 'absolute', left: 0, top: 196, width: LOOP_W, textAlign: 'center', fontSize: 38, fontWeight: 800, color: '#6ee7b7', opacity: progress(frame, labelAt, 14) }}>
            {S03_LOOP.label}
          </div>
        </div>
      ) : null}

      {/* Right area: the notebook with the lesson's example */}
      {frame >= recordAt - 6 ? (
        <div
          style={{
            position: 'absolute',
            left: R.x,
            top: 164,
            width: R.w,
            height: 196,
            boxSizing: 'border-box',
            borderRadius: 24,
            border: `3px solid ${alpha(C.amber, 0.6 + 0.3 * fundGlow)}`,
            background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
            boxShadow: fundGlow > 0.02 ? `0 0 ${Math.round(40 * fundGlow)}px ${alpha(C.amber, 0.28 * fundGlow)}` : `0 24px 54px ${alpha('#000000', 0.4)}`,
            fontFamily: FONT.sans,
            opacity: noteIn,
            transform: `translateY(${(1 - noteIn) * 30}px)`,
            overflow: 'hidden',
          }}
        >
          {/* binding */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 44, background: alpha(C.ink700, 0.7), borderRight: `2px solid ${C.ink600}` }}>
            {[0, 1, 2, 3].map((k) => (
              <div key={k} style={{ position: 'absolute', left: 14, top: 22 + k * 44, width: 16, height: 16, borderRadius: 8, background: C.ink950, border: `2px solid ${C.ink500}` }} />
            ))}
          </div>
          <div style={{ position: 'absolute', left: 64, top: 14, display: 'flex', alignItems: 'center', gap: 12, fontSize: 32, fontWeight: 800, color: C.amber, whiteSpace: 'nowrap' }}>
            <Icon name="file" size={34} color={C.amber} />
            {S03_NOTEBOOK.tag}
          </div>
          <div style={{ position: 'absolute', left: 64, top: 70, fontSize: 40, fontWeight: 750, lineHeight: 1.3, color: C.text, whiteSpace: 'nowrap' }}>
            <div style={{ height: 58 }}>
              {firstTyped}
              {firstTyped.length >= S03_NOTEBOOK.first.length ? <Letter ch={S03_NOTEBOOK.x} state="given" /> : null}
            </div>
            <div style={{ height: 58 }}>
              {secondTyped}
              {secondTyped.length >= S03_NOTEBOOK.second.length ? <Letter ch={S03_NOTEBOOK.y} state={resolved > 0.01 ? 'resolved' : 'open'} p={resolved} /> : null}
            </div>
          </div>
        </div>
      ) : null}

      {/* fund label */}
      {frame >= fundAt - 6 ? (
        <div style={{ position: 'absolute', left: R.x, top: 372, width: R.w, display: 'flex', justifyContent: 'center', opacity: fundIn.opacity, transform: fundIn.transform }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 16,
              height: 66,
              padding: '0 32px 0 22px',
              boxSizing: 'border-box',
              borderRadius: RADIUS.pill,
              border: `3px solid ${alpha(C.amber, 0.85)}`,
              background: alpha(C.amberDeep, 0.5),
              fontFamily: FONT.sans,
              fontSize: 42,
              fontWeight: 850,
              color: '#fde68a',
              whiteSpace: 'nowrap',
            }}
          >
            <Icon name="flag" size={40} color={C.amber} />
            {S03_NOTEBOOK.fund}
          </span>
        </div>
      ) : null}

      {/* two diagrams */}
      {frame >= linkedAt - 4 ? (
        <div style={{ position: 'absolute', left: R.x, top: 446, width: R.w, display: 'flex', gap: 32 }}>
          <Scheme
            label={S03_SCHEMES.linked.label}
            boxes={S03_SCHEMES.linked.boxes}
            linked
            tone={C.emerald}
            p={progress(frame, linkedAt, 16)}
            draw={progress(frame, linkedAt + 12, 28)}
          />
          {frame >= timingAt - 4 ? (
            <Scheme label={S03_SCHEMES.timing.label} boxes={S03_SCHEMES.timing.boxes} tone={C.amber} p={progress(frame, timingAt, 16)} draw={0} />
          ) : (
            <div style={{ width: 548 }} />
          )}
        </div>
      ) : null}

      {/* closing labels (after the exam card, no cue of their own) */}
      {frame >= endAt - 4 ? (
        <>
          <EndLabel x={CARDS.x} top={CARDS.top + 4 * CARDS.step + 6} text={S03_ENDS.improve} icon="search" tone={C.sky} frame={frame} at={endAt} />
          <EndLabel x={R.x} top={598} text={S03_ENDS.prove} icon="flag" tone={C.emerald} frame={frame} at={endAt + 8} />
        </>
      ) : null}
    </Stage>
  );
}

/** A letter placeholder inside the sentence: X is given, Y waits until the finding is made. */
function Letter({ ch, state, p = 0 }: { ch: string; state: 'given' | 'open' | 'resolved'; p?: number }) {
  const tone = state === 'resolved' ? C.emerald : state === 'given' ? C.cyan : C.amber;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginLeft: 14,
        minWidth: 62,
        height: 56,
        padding: '0 14px',
        boxSizing: 'border-box',
        verticalAlign: 'middle',
        borderRadius: 14,
        border: `3px ${state === 'open' ? 'dashed' : 'solid'} ${alpha(tone, 0.9)}`,
        background: alpha(tone, 0.12 + 0.12 * p),
        fontWeight: 850,
        color: C.textStrong,
      }}
    >
      {ch}
      {state === 'resolved' ? <Icon name="check" size={34} color={C.emerald} strokeWidth={2.8} style={{ opacity: p }} /> : null}
    </span>
  );
}

/** A little chain of boxes: with a continuous thread (attributable) or dashed boxes with none (just in time). */
function Scheme({ label, boxes, linked = false, tone, p, draw }: { label: string; boxes: readonly string[]; linked?: boolean; tone: string; p: number; draw: number }) {
  const bw = 150;
  const n = boxes.length;
  const gap = n === 3 ? 49 : 150;
  return (
    <div style={{ width: 548, height: 126, position: 'relative', opacity: p, transform: `translateY(${(1 - p) * 16}px)`, fontFamily: FONT.sans }}>
      <div style={{ fontSize: 36, fontWeight: 850, color: tone === C.emerald ? '#6ee7b7' : '#fcd34d', whiteSpace: 'nowrap' }}>{label}</div>
      <div style={{ position: 'absolute', left: 0, top: 58, display: 'flex', alignItems: 'center' }}>
        {boxes.map((b, i) => (
          <div key={b} style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: bw,
                height: 58,
                boxSizing: 'border-box',
                display: 'grid',
                placeItems: 'center',
                borderRadius: 14,
                border: `3px ${linked ? 'solid' : 'dashed'} ${alpha(tone, 0.85)}`,
                background: alpha(tone, linked ? 0.14 : 0.05),
                fontSize: 32,
                fontWeight: 750,
                color: C.textStrong,
                whiteSpace: 'nowrap',
              }}
            >
              {b}
            </div>
            {i < n - 1 ? (
              linked ? (
                <div style={{ width: gap, height: 6, borderRadius: 3, background: alpha(tone, 0.95), transformOrigin: '0 50%', transform: `scaleX(${draw})` }} />
              ) : (
                <div style={{ width: gap, height: 0, borderTop: `4px dashed ${alpha(tone, 0.7)}` }} />
              )
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function EndLabel({ x, top, text, icon, tone, frame, at }: { x: number; top: number; text: string; icon: 'search' | 'flag'; tone: string; frame: number; at: number }) {
  const e = enter(frame, at, { distance: 18, duration: 16 });
  return (
    <div style={{ position: 'absolute', left: x, top, ...e }}>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 14,
          height: 62,
          padding: '0 28px 0 20px',
          boxSizing: 'border-box',
          borderRadius: RADIUS.pill,
          border: `3px solid ${alpha(tone, 0.85)}`,
          background: alpha(tone, 0.12),
          fontFamily: FONT.sans,
          fontSize: 38,
          fontWeight: 850,
          color: C.textStrong,
          whiteSpace: 'nowrap',
        }}
      >
        <Icon name={icon} size={38} color={tone} />
        {text}
      </span>
    </div>
  );
}
