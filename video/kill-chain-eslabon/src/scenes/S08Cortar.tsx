import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse } from '../../../engine/src/theme/motion';
import { mix, windowWeight } from '../../../engine/src/ui';
import { LATER, NETWORK, TODAY, ZONES } from '../data/s08-cortar';
import { AlertCard, alertCardSize } from './parts/AlertCard';
import { PhaseRow, killChainLayout, type PhaseId, type VignetteLook } from './parts/KillChain';
import { TrapBox } from './parts/TrapBox';
import { Zone } from './parts/s08-cortar/Zone';
import { Stage, segment, wordFrame } from './kit';

const S = 's08-cortar';
const W = STAGE.width;

// ---- The phase row along the bottom, all scene long.
const ROW = killChainLayout(W);
const ROW_Y = STAGE.height - ROW.height;
const slot = (id: PhaseId) => ROW.slot(id)!;

// ---- The two zones. Part 1: far left / far right, under the think prompt's band, no position labels.
// Part 2 (`first-cut`): the house side grows over Exploitation…Actions to hold the box and the later cuts.
const ZONE_H1 = 100;
const ZONE_Y1 = 200;
/** The gateway's body opens with the answer, for «en la red · antes del equipo». */
const GATE_H2 = 156;
const GATE = { x: 0, y: ZONE_Y1, w: 560, h: ZONE_H1 };
const HOST_A = { x: W - 560, y: ZONE_Y1, w: 560, h: ZONE_H1 };
const HOST_B = { x: 734, y: 50, w: W - 734, h: 316 };

// ---- Part 2 contents (stage px).
const BOX_W = 220;
const LATER_X = 1060;

// ---- Part 3 (`today`): the compact 5-3 card, the marker on C2, the empty seventh.
const CARD = alertCardSize('compact', 1040, true);
const CARD_Y = 14;
const TODAY_X = 1110;

/**
 * s08-cortar «Lo primero que cortas». The phase row sits along the bottom. Two zones arrive on their cues with no
 * position label: the mail gateway («pasarela de correo», sky) on the left and the engineering workstation
 * («estación de ingeniería», cyan) on the right. With the question (s08-02) Delivery and Exploitation light in the
 * row, equally, and nothing ties either to a zone; the top band stays clear for the think prompt. The answer
 * (s08-03): Exploitation turns emerald and, on «pasarela», «en la red · antes del equipo» lands in the gateway, which
 * is tied to Delivery. On `first-cut` the house side grows over Exploitation…Actions: the box opens and nothing lights
 * (emerald lock), right above Exploitation. On `later`, «borrar el programa» / «cortar el beacon» in grey with «también
 * sirven, pero ya ha avanzado más», and Installation and C2 go grey. On `today` the zones leave and the 5-3 card comes
 * back over the row: the marker on Command & Control, Actions on Objectives empty, «por lo que ves, la séptima no
 * aparece». On `wrap-iv`, «¿qué le queda por hacer?» under the card. Nothing reads as stopped or contained.
 */
export function S08Cortar(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const gatewayAt = props.cue('gateway');
  const hostAt = props.cue('host');
  const firstCutAt = props.cue('first-cut');
  const laterAt = props.cue('later');
  const todayAt = props.cue('today');
  const wrapAt = props.cue('wrap-iv');
  const s02 = segment(props, 's08-02');
  const s03 = segment(props, 's08-03');

  // ---- Question: Delivery and Exploitation light, together, on their names.
  const askD = Math.max(s02.from, wordFrame(S, 's08-02', 'Delivery') - 6);
  const askE = Math.max(askD + 4, wordFrame(S, 's08-02', 'Exploitation') - 6);
  // ---- Answer: «Exploitation.» opens s08-03; the gateway's label on «pasarela».
  const answerAt = s03.from;
  const networkAt = Math.max(answerAt + 10, wordFrame(S, 's08-03', 'pasarela') - 4);
  const answer = progress(frame, answerAt - 2, 14, EASE.inOut);
  const network = progress(frame, networkAt, 14);

  // ---- Part 2: the house grows; the box opens on «abrir», the lock on «nada».
  const grow = progress(frame, firstCutAt - 8, 22, EASE.inOut);
  const boxIn = progress(frame, firstCutAt, 14);
  const openAt = Math.max(firstCutAt + 10, wordFrame(S, 's08-04', 'abrir') - 4);
  const lockAt = Math.max(openAt + 16, wordFrame(S, 's08-04', 'nada') - 4);
  const open = progress(frame, openAt, 16, EASE.inOut);
  const rise = progress(frame, openAt + 8, 18, EASE.inOut);
  const lock = progress(frame, lockAt, 12);
  // `later`: each grey cut on its verb, the note on «también».
  const laterIn = [
    Math.max(laterAt - 2, wordFrame(S, 's08-05', 'Borrar') - 6),
    Math.max(laterAt + 6, wordFrame(S, 's08-05', 'cortar') - 6),
  ];
  const noteAt = Math.max(laterIn[1] + 8, wordFrame(S, 's08-05', 'también') - 4);
  const greyLater = progress(frame, noteAt, 16, EASE.inOut);

  // ---- Part 3: zones leave, the card comes back.
  const out = progress(frame, todayAt - 10, 16, EASE.inOut);
  const cardIn = progress(frame, todayAt, 18);
  const markerAt = Math.max(todayAt + 14, wordFrame(S, 's08-06', 'aviso') - 4);
  const seventhAt = Math.max(markerAt + 10, wordFrame(S, 's08-06', 'séptima') - 4);
  const marker = progress(frame, markerAt, 14);
  const seventh = progress(frame, seventhAt, 14);
  const qAt = Math.max(wrapAt, wordFrame(S, 's08-07', 'falta') - 8);
  const question = progress(frame, qAt, 16);
  const qGlow = windowWeight(frame, qAt, segment(props, 's08-07').to, { ramp: 12 });

  // ---- Row looks per beat.
  const ask = progress(frame, askD, 12) * (1 - answer);
  const looks: Partial<Record<PhaseId, VignetteLook>> = {};
  for (const s of ROW.slots) {
    const id = s.id;
    const lookPart1: VignetteLook = { dim: 0 };
    // The question: the two candidates lit (violet: an exam choice), the rest stepped back.
    // A tone only while the slot is lit (the frame and the name take it).
    if (id === 'delivery') {
      lookPart1.lit = Math.max(progress(frame, askD, 12) * (1 - answer), 0.6 * network * (1 - out));
      if (lookPart1.lit > 0.02) lookPart1.tone = answer > 0.5 ? 'sky' : 'violet';
    } else if (id === 'exploitation') {
      lookPart1.lit = Math.max(progress(frame, askE, 12) * (1 - answer), answer * (1 - out));
      if (lookPart1.lit > 0.02) lookPart1.tone = answer > 0.5 ? 'emerald' : 'violet';
      if (frame >= openAt && out < 0.98) lookPart1.variant = 'dark';
    } else {
      lookPart1.dim = Math.max(ask, 0.85 * answer) * (1 - out);
    }
    if (id === 'installation' || id === 'c2') lookPart1.grey = greyLater * (1 - out);
    // Today: the map as you know it on the 5th — the seventh empty.
    if (id === 'actions') lookPart1.empty = out;
    looks[id] = lookPart1;
  }

  // ---- Zone geometry.
  const host = {
    x: mix(HOST_A.x, HOST_B.x, grow),
    y: mix(HOST_A.y, HOST_B.y, grow),
    w: mix(HOST_A.w, HOST_B.w, grow),
    h: mix(HOST_A.h, HOST_B.h, grow),
  };
  const gateShow = progress(frame, gatewayAt - 4, 16) * (1 - out);
  const hostShow = progress(frame, hostAt - 4, 16) * (1 - out);
  const pathShow = Math.min(gateShow, hostShow);
  const d = slot('delivery');
  const e = slot('exploitation');
  const c2 = slot('c2');
  const aoo = slot('actions');
  const boxH = (BOX_W * 170) / 200;
  const boxX = e.cx - BOX_W / 2;
  const boxY = HOST_B.y + 98;
  const gateH = GATE.h + (GATE_H2 - GATE.h) * network;
  const elbowY = GATE.y + GATE_H2 - 34;

  return (
    <Stage>
      {/* The phase row */}
      <div style={{ position: 'absolute', left: 0, top: ROW_Y }}>
        <PhaseRow width={W} frame={frame} looks={looks} names={1} />
      </div>

      {/* The mail's way in: from the gateway to the house (no labels) */}
      {pathShow > 0 ? (
        <svg width={W} height={STAGE.height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: pathShow }}>
          <line
            x1={GATE.x + GATE.w + 10}
            y1={GATE.y + 48}
            x2={host.x - 22}
            y2={GATE.y + 48}
            stroke={alpha(C.sky, 0.6)}
            strokeWidth={4}
            strokeDasharray="12 10"
            strokeLinecap="round"
          />
          <polygon points={`${host.x - 22},${GATE.y + 38} ${host.x - 8},${GATE.y + 48} ${host.x - 22},${GATE.y + 58}`} fill={C.sky} />
          {/* After the answer: Delivery belongs to the gateway */}
          {network > 0 ? (
            <g opacity={network}>
              <path
                d={`M ${d.cx} ${ROW_Y - 6} L ${d.cx} ${elbowY + 14} Q ${d.cx} ${elbowY} ${d.cx - 14} ${elbowY} L ${GATE.x + GATE.w + 16} ${elbowY}`}
                fill="none"
                stroke={C.sky}
                strokeWidth={3.5}
                strokeDasharray="8 7"
              />
              <polygon points={`${GATE.x + GATE.w + 16},${elbowY - 9} ${GATE.x + GATE.w + 2},${elbowY} ${GATE.x + GATE.w + 16},${elbowY + 9}`} fill={C.sky} />
            </g>
          ) : null}
          {/* The box sits right over Exploitation */}
          {boxIn > 0 ? <line x1={e.cx} y1={boxY + boxH + 4} x2={e.cx} y2={ROW_Y - 4} stroke={alpha(C.emerald, 0.8)} strokeWidth={3.5} strokeDasharray="8 7" opacity={boxIn * grow} /> : null}
        </svg>
      ) : null}

      {/* Gateway zone */}
      {gateShow > 0 ? (
        <div style={{ position: 'absolute', left: GATE.x, top: GATE.y }}>
          <Zone icon="mail" title={ZONES.gateway} tone={C.sky} width={GATE.w} height={gateH} show={gateShow} glow={network * (1 - grow * 0.6)} dim={0.4 * grow}>
            {network > 0 ? (
              <div
                style={{
                  position: 'absolute',
                  left: 24,
                  top: 16,
                  fontFamily: FONT.sans,
                  fontSize: 32,
                  fontWeight: 800,
                  color: '#7dd3fc',
                  whiteSpace: 'nowrap',
                  ...enter(frame, networkAt, { distance: 12 }),
                }}
              >
                {NETWORK}
              </div>
            ) : null}
          </Zone>
        </div>
      ) : null}

      {/* House zone */}
      {hostShow > 0 ? (
        <div style={{ position: 'absolute', left: host.x, top: host.y }}>
          <Zone icon="desktop" title={ZONES.host} tone={C.cyan} width={host.w} height={host.h} show={hostShow} glow={0.5 * boxIn} />
        </div>
      ) : null}

      {/* first-cut: the box opens and nothing lights — right over Exploitation */}
      {boxIn > 0 && out < 1 ? (
        <div style={{ position: 'absolute', left: boxX, top: boxY, opacity: 1 - out }}>
          <TrapBox width={BOX_W} show={boxIn} open={open} device={rise} lock={lock} glow={0.7 * lock} glowTone={C.emerald} />
        </div>
      ) : null}

      {/* later: the cuts that also work, further on — grey */}
      {frame >= laterIn[0] - 2 && out < 1 ? (
        <div style={{ position: 'absolute', left: LATER_X, top: HOST_B.y + 104, width: W - LATER_X - 20, opacity: 1 - out, fontFamily: FONT.sans }}>
          {LATER.items.map((t, i) => (
            <div key={t} style={{ height: 60, marginBottom: 12, display: 'flex', alignItems: 'center', ...enter(frame, laterIn[i], { distance: 16, axis: 'x' }) }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  height: 56,
                  padding: '0 26px',
                  boxSizing: 'border-box',
                  borderRadius: RADIUS.pill,
                  border: `2px solid ${alpha(C.muted, 0.5)}`,
                  background: alpha(C.ink700, 0.6),
                  fontSize: 34,
                  fontWeight: 750,
                  color: C.muted,
                  whiteSpace: 'nowrap',
                }}
              >
                {t}
              </span>
            </div>
          ))}
          <div style={{ marginTop: 2, fontSize: 32, fontWeight: 650, color: C.text, whiteSpace: 'nowrap', ...enter(frame, noteAt, { distance: 12 }) }}>{LATER.note}</div>
        </div>
      ) : null}

      {/* today: the 5-3 card again, compact, over the row */}
      {cardIn > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: CARD_Y, opacity: cardIn, transform: `translateY(${(1 - cardIn) * 18}px)` }}>
          <AlertCard variant="compact" width={CARD.width} at={todayAt - 60} question={question} questionGlow={qGlow} />
        </div>
      ) : null}

      {/* the marker on Command & Control, and the line from the card's domain to it */}
      {marker > 0 ? (
        <svg width={W} height={STAGE.height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <path
            d={`M ${CARD.width - 240} ${CARD_Y + 208} C ${CARD.width - 120} ${CARD_Y + 300}, ${c2.cx} ${ROW_Y - 140}, ${c2.cx} ${ROW_Y - 60}`}
            fill="none"
            stroke={alpha(C.rose, 0.7)}
            strokeWidth={3}
            strokeDasharray="8 8"
            opacity={marker}
          />
          <Marker x={c2.cx} y={ROW_Y - 8} show={marker} pulseK={pulse(frame, fps, 0.5)} />
        </svg>
      ) : null}

      {/* «por lo que ves, la séptima no aparece», over the empty seventh */}
      {seventh > 0 ? (
        <>
          <div
            style={{
              position: 'absolute',
              left: TODAY_X,
              top: 150,
              fontFamily: FONT.sans,
              fontSize: 40,
              fontWeight: 800,
              lineHeight: 1.15,
              color: C.textStrong,
              whiteSpace: 'nowrap',
              ...enter(frame, seventhAt, { distance: 14 }),
            }}
          >
            <div style={{ color: C.muted, fontWeight: 700 }}>{TODAY.split(', ')[0]},</div>
            <div>{TODAY.split(', ')[1]}</div>
          </div>
          <svg width={W} height={STAGE.height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: seventh }}>
            <line x1={aoo.cx} y1={256} x2={aoo.cx} y2={ROW_Y - 8} stroke={alpha(C.muted, 0.7)} strokeWidth={3} strokeDasharray="6 8" />
            <rect
              x={aoo.x - 6}
              y={ROW_Y + aoo.y - 6}
              width={aoo.w + 12}
              height={aoo.h + 12}
              rx={22}
              fill="none"
              stroke={alpha(C.amber, (0.35 + 0.35 * question) * (0.75 + 0.25 * pulse(frame, fps, 0.5)))}
              strokeWidth={3}
              strokeDasharray="10 8"
            />
          </svg>
        </>
      ) : null}
    </Stage>
  );
}

/** «Va por aquí»: a rose map-pin over a slot, its tip at (x, y). */
function Marker({ x, y, show, pulseK }: { x: number; y: number; show: number; pulseK: number }) {
  const r = 20;
  const top = y - 58 - (1 - show) * 20;
  return (
    <g opacity={show}>
      <circle cx={x} cy={top + r} r={r + 8 + 6 * pulseK} fill={alpha(C.rose, 0.12 + 0.08 * pulseK)} />
      <path d={`M ${x - r} ${top + r} A ${r} ${r} 0 1 1 ${x + r} ${top + r} L ${x} ${y} Z`} fill={C.rose} stroke={C.roseDeep} strokeWidth={2} />
      <circle cx={x} cy={top + r} r={7} fill={C.ink900} />
    </g>
  );
}
