import type { ReactNode } from 'react';
import { interpolateColors, useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { mix, windowWeight } from '../../../engine/src/ui';
import { S05 } from '../data/s05-jump';
import { ServiceCounter } from './parts/Counter';
import { BlueprintPanel, ZoneBox, zoneBoxContent } from './parts/ZoneRow';
import { CHOICE, ChoiceButton, DEVICE_TILE, DeviceTile, GroupFrame, JUMP_BOX, JumpBox, RuleStrip, TermTag, WS_TILE, WorkstationTile } from './parts/s05-jump/Bits';
import { ControlRoom, DoorGlyph, ROOM_BASE } from './parts/s05-jump/ControlRoom';
import { Stage, segment, wordFrame } from './kit';

const S = 's05-jump';
const W = 1728;
const H = 660;

// ---- Today: Administración's workstations (left) and the management interfaces (right).
const ADM = { x: 24, y: 112, w: 296, h: 536 } as const;
const WS_X = ADM.x + (ADM.w - WS_TILE.w) / 2;
const WS_TOPS = [190, 278, 366, 454, 542] as const;
const LINE_X0 = WS_X + WS_TILE.w + 4;

// ---- The management zone (it appears on `converge`). Everything stays below stage y 236 so the
// think prompt finds the top centre empty.
const ZONE = { x: 1160, y: 236, w: 550, h: 410 } as const;
const ZONE_IN = zoneBoxContent(ZONE.w, ZONE.h, { layout: 'header', zone: 'gestion' });
const DEV_GAP = 16;
const DEV_X0 = ZONE.x + ZONE_IN.x + (ZONE_IN.w - (4 * DEVICE_TILE + 3 * DEV_GAP)) / 2;
const DEV_Y_BEFORE = ZONE.y + ZONE_IN.y + (ZONE_IN.h - DEVICE_TILE) / 2;
const DEV_Y_AFTER = ZONE.y + ZONE.h - 14 - DEVICE_TILE - 8;
const DEV_KINDS = ['switch', 'switch', 'firewall', 'firewall'] as const;
/** Where today's lines end: along the left of the interfaces. */
const ENTRY_X = DEV_X0 - 8;

// ---- The jump server box: floating between the two (no zone), then inside the zone.
const JB = { x: 440, y: 268 } as const;
const JB_SCALE_IN = ZONE_IN.w / JUMP_BOX.w;
const JB_IN = { x: ZONE.x + ZONE_IN.x, y: ZONE.y + ZONE_IN.y + 6 } as const;
/** All the lines converge here (the box's left-middle before the answer). */
const P = { x: JB.x - 4, y: JB.y + JUMP_BOX.h / 2 } as const;

// ---- The two options, under the box; the verdict under them.
const CHOICE_Y = 474;
const CHOICE_CX = JB.x + JUMP_BOX.w / 2;
const VERDICT_Y = 572;
const VERDICT_CX = 742;

// ---- The room (s05-02).
const ROOM_W = 1100;
const ROOM = { x: (W - ROOM_W) / 2, y: 96 } as const;

/**
 * s05-jump «Una sola puerta».
 *   today       «Administración a gestión · SSH · desde cada puesto»; several unnamed workstations in
 *               Administración, the management interfaces (switches, firewalls) on the right; on
 *               «Administración» one amber line per workstation.
 *   many-paths  the lines glow: «un camino por puesto».
 *   room        «la sala de mandos de la red» with ONE door: turnstile, card + PIN reader, a camera
 *               and its log («una sola puerta · tarjeta y PIN · todo queda grabado»).
 *   jump        the plan (blueprint): the jump server box «endurecido · MFA · sesión grabada»,
 *               each property as the voice says it, floating between the workstations and the
 *               interfaces, inside no zone. Today's lines are still there, faint.
 *   converge    every line bends into the box; the management zone («gestión», «máxima») draws
 *               around the interfaces, no access label; one line from the box to them.
 *   s05-05      two equal buttons «DMZ» · «gestión» under the box, both glowing alike during the
 *               hold; the top centre stays empty for the think prompt.
 *   answer      «gestión» lights emerald; the box moves INTO the zone (the lines follow through one
 *               entry); «zona de gestión: solo responde al jump server»; «DMZ» struck on «DMZ»,
 *               «lo alcanzaría cualquiera desde Internet · el único control, convertido en el único
 *               blanco».
 *   bastion     JUMP SERVER · «jump box · bastion host».
 *   wrap        the diagram steps back: «lo público, a la ventanilla» (counter icon) · «y los mandos,
 *               tras una sola puerta» (the room's door). Holds (chapter close).
 */
export function S05Jump(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  const todayAt = props.cue('today');
  const manyAt = props.cue('many-paths');
  const roomAt = props.cue('room');
  const jumpAt = props.cue('jump');
  const convergeAt = props.cue('converge');
  const answerAt = props.cue('answer');
  const bastionAt = props.cue('bastion');
  const wrapAt = props.cue('wrap');
  const s04 = segment(props, 's05-04');
  const s5 = segment(props, 's05-05');

  const at = {
    admin: w('s05-01', 'Administración'),
    puerta2: w('s05-02', 'puerta'),
    tarjeta: w('s05-02', 'tarjeta'),
    grabado: w('s05-02', 'grabado'),
    endurecido: w('s05-03', 'endurecido'),
    segundo: w('s05-03', 'segundo'),
    grabara: w('s05-03', 'grabará'),
    gestion4: w('s05-04', 'gestión'),
    pasara: w('s05-04', 'pasará'),
    jump4: w('s05-04', 'jump'),
    gestion5: w('s05-05', 'gestión'),
    responde: w('s05-06', 'responderá'),
    dmz6: w('s05-06', 'DMZ'),
    cualquiera: w('s05-06', 'cualquiera'),
    unico: w('s05-06', 'único'),
    jump7: w('s05-07', 'jump'),
    publico: w('s05-08', 'público'),
    mandos: w('s05-08', 'mandos'),
  };

  // ---------------- today ----------------
  const aIn = progress(frame, 0, 14);
  const aOut = progress(frame, roomAt - 4, 14, EASE.inOut);
  const back = progress(frame, jumpAt, 16);
  const diagram = frame < jumpAt - 2 ? aIn * (1 - aOut) : back;
  const stripP = progress(frame, todayAt, 16) * (1 - aOut);
  const manyGlow = windowWeight(frame, manyAt - 2, roomAt, { ramp: 10 });
  const manyLabel = progress(frame, manyAt - 2, 14) * (1 - aOut);
  const ifaceLabel = 1 - progress(frame, convergeAt + 4, 12);

  // ---------------- the room ----------------
  const roomIn = progress(frame, roomAt, 16);
  const roomOut = progress(frame, jumpAt - 6, 16, EASE.inOut);
  const doorP = windowWeight(frame, at.puerta2 - 4, jumpAt, { ramp: 12 });
  const doorC = { x: ROOM.x + (550 / ROOM_BASE.w) * ROOM_W, y: ROOM.y + (365 / ROOM_BASE.w) * ROOM_W };

  // ---------------- the plan ----------------
  const panelP = progress(frame, jumpAt - 2, 18);
  const boxIn = progress(frame, jumpAt + 2, 16);
  const parts = [progress(frame, at.endurecido - 4, 12), progress(frame, at.segundo - 2, 12), progress(frame, at.grabara - 2, 12)];
  const conv = progress(frame, convergeAt, 28, EASE.inOut);
  const zoneP = progress(frame, convergeAt + 6, 26, EASE.inOut);
  const zLine = progress(frame, Math.max(convergeAt + 24, at.pasara - 6), 18);
  const choicesIn = progress(frame, s5.from + 6, 16);
  const choiceGlow = windowWeight(frame, at.gestion5 + 8, s5.to, { ramp: 12 });
  const chosen = progress(frame, answerAt, 14);
  const ans = progress(frame, answerAt + 4, 30, EASE.inOut);
  const struck = progress(frame, at.dmz6 - 4, 14);
  const zoneLabel = progress(frame, at.responde - 8, 14);
  const v1 = progress(frame, at.cualquiera - 6, 14);
  const v2 = progress(frame, at.unico - 6, 14);
  const termP = progress(frame, bastionAt + 2, 16);
  const termSub = progress(frame, at.jump7 - 4, 14);
  const verdictDim = progress(frame, bastionAt, 16);
  const boxGlow = Math.max(windowWeight(frame, at.jump4 - 4, s04.to, { ramp: 10 }), windowWeight(frame, bastionAt, wrapAt, { ramp: 12 }));
  const wrapDim = progress(frame, wrapAt - 4, 16, EASE.inOut);
  const row1 = progress(frame, at.publico - 6, 14);
  const row2 = progress(frame, at.mandos - 6, 14);

  const boxX = mix(JB.x, JB_IN.x, ans);
  const boxY = mix(JB.y, JB_IN.y, ans);
  const boxK = mix(1, JB_SCALE_IN, ans);
  const boxLeft = { x: boxX, y: boxY + (JUMP_BOX.h * boxK) / 2 };
  const devY = mix(DEV_Y_BEFORE, DEV_Y_AFTER, ans);
  const lineColor = interpolateColors(conv, [0, 1], [C.amber, C.cyan]);

  // Box → interfaces: across the gap before the answer, a short drop inside the zone after it.
  const zl0 = { x1: JB.x + JUMP_BOX.w, y1: P.y, x2: ENTRY_X, y2: DEV_Y_BEFORE + DEVICE_TILE / 2 };
  const zl1 = { x1: JB_IN.x + (JUMP_BOX.w * JB_SCALE_IN) / 2, y1: JB_IN.y + JUMP_BOX.h * JB_SCALE_IN + 2, x2: JB_IN.x + (JUMP_BOX.w * JB_SCALE_IN) / 2, y2: DEV_Y_AFTER - 4 };

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      {/* The plan's paper (from `jump`) */}
      {panelP > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, opacity: 1 - 0.8 * wrapDim }}>
          <BlueprintPanel width={W} height={H} draw={panelP} />
        </div>
      ) : null}

      {/* ================= The diagram (today, then the plan) ================= */}
      {diagram > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: diagram * (1 - 0.86 * wrapDim) }}>
          <div style={{ position: 'absolute', left: ADM.x, top: ADM.y }}>
            <GroupFrame width={ADM.w} height={ADM.h} label={S05.admin} show={1} />
          </div>
          {WS_TOPS.map((y, i) => (
            <div key={i} style={{ position: 'absolute', left: WS_X, top: y }}>
              <WorkstationTile show={1} glow={manyGlow * (1 - conv)} />
            </div>
          ))}

          {/* The management zone, around the interfaces */}
          <div style={{ position: 'absolute', left: ZONE.x, top: ZONE.y }}>
            <ZoneBox zone="gestion" width={ZONE.w} height={ZONE.h} layout="header" draw={zoneP} />
          </div>
          {DEV_KINDS.map((k, i) => (
            <div key={i} style={{ position: 'absolute', left: DEV_X0 + i * (DEVICE_TILE + DEV_GAP), top: devY }}>
              <DeviceTile kind={k} show={1} />
            </div>
          ))}
          {ifaceLabel > 0.001 ? (
            <div style={{ position: 'absolute', left: DEV_X0, width: 4 * DEVICE_TILE + 3 * DEV_GAP, top: DEV_Y_BEFORE + DEVICE_TILE + 14, textAlign: 'center', fontSize: 34, fontWeight: 760, color: '#7dd3fc', whiteSpace: 'nowrap', opacity: ifaceLabel }}>
              {S05.interfaces}
            </div>
          ) : null}

          {/* One line per workstation; on `converge` they all bend into the box */}
          <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            {WS_TOPS.map((top, i) => {
              const sy = top + WS_TILE.h / 2;
              const end = { x: mix(ENTRY_X, P.x, conv), y: mix(DEV_Y_BEFORE + 10 + i * 20, P.y, conv) };
              const c1 = { x: LINE_X0 + mix(260, 110, conv), y: sy };
              const c2 = { x: end.x - mix(300, 90, conv), y: end.y };
              const drawP = progress(frame, at.admin + i * 5, 18);
              const faint = frame >= jumpAt - 2 && conv < 1 ? mix(0.4, 1, conv) : 1;
              return (
                <path
                  key={i}
                  d={`M ${LINE_X0} ${sy} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${end.x} ${end.y}`}
                  fill="none"
                  stroke={lineColor}
                  strokeWidth={4 + 3 * manyGlow * (1 - conv)}
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray="1 1"
                  strokeDashoffset={1 - drawP}
                  opacity={faint}
                  style={{ filter: manyGlow > 0.01 && conv < 0.5 ? `drop-shadow(0 0 ${Math.round(8 * manyGlow)}px ${alpha(C.amber, 0.6)})` : undefined }}
                />
              );
            })}
            {/* After the answer: one trunk from where the lines meet to the box, through the zone's edge */}
            {ans > 0.001 ? <line x1={P.x} y1={P.y} x2={boxLeft.x} y2={boxLeft.y} stroke={C.cyan} strokeWidth={6} strokeLinecap="round" /> : null}
            {/* Box → interfaces */}
            {zLine > 0.001 && ans < 1 ? (
              <line x1={zl0.x1} y1={zl0.y1} x2={mix(zl0.x1, zl0.x2, zLine)} y2={mix(zl0.y1, zl0.y2, zLine)} stroke={C.cyan} strokeWidth={5} strokeLinecap="round" opacity={1 - ans} />
            ) : null}
            {ans > 0.5 ? <line x1={zl1.x1} y1={zl1.y1} x2={zl1.x2} y2={zl1.y2} stroke={C.cyan} strokeWidth={5} strokeLinecap="round" opacity={(ans - 0.5) / 0.5} /> : null}
          </svg>

          {/* The jump server box */}
          {boxIn > 0.001 ? (
            <div style={{ position: 'absolute', left: boxX, top: boxY, transform: `scale(${boxK})`, transformOrigin: '0 0' }}>
              <JumpBox show={boxIn} items={S05.box} parts={parts} glow={boxGlow} />
            </div>
          ) : null}

          {/* The two options (equal until the answer), then the verdict */}
          <div style={{ position: 'absolute', left: CHOICE_CX - CHOICE.w - 20, top: CHOICE_Y }}>
            <ChoiceButton label={S05.choices.dmz} show={choicesIn} struck={struck} glow={choiceGlow} />
          </div>
          <div style={{ position: 'absolute', left: CHOICE_CX + 20, top: CHOICE_Y, opacity: 1 - 0.55 * verdictDim }}>
            <ChoiceButton label={S05.choices.gestion} show={choicesIn} chosen={chosen} glow={choiceGlow} />
          </div>
          {v1 > 0.001 ? (
            <div style={{ position: 'absolute', left: VERDICT_CX, top: VERDICT_Y, transform: 'translateX(-50%)', textAlign: 'center', fontSize: 34, fontWeight: 780, lineHeight: 1.2, color: C.roseSoft, whiteSpace: 'nowrap', opacity: 1 - 0.55 * verdictDim }}>
              <div style={{ opacity: v1, transform: `translateY(${(1 - v1) * 8}px)` }}>{S05.answer.dmzNo[0]}</div>
              <div style={{ opacity: v2, transform: `translateY(${(1 - v2) * 8}px)` }}>{S05.answer.dmzNo[1]}</div>
            </div>
          ) : null}
          {zoneLabel > 0.001 ? (
            <div style={{ position: 'absolute', right: W - (ZONE.x + ZONE.w), top: 170, fontSize: 36, fontWeight: 820, color: '#6ee7b7', whiteSpace: 'nowrap', opacity: zoneLabel, transform: `translateY(${(1 - zoneLabel) * 8}px)` }}>
              {S05.answer.zone}
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Today's rule and «un camino por puesto» */}
      <div style={{ position: 'absolute', left: 0, width: W, top: 18, display: 'flex', justifyContent: 'center' }}>
        <RuleStrip show={stripP} text={S05.today} />
      </div>
      {manyLabel > 0.001 ? (
        <div style={{ position: 'absolute', left: LINE_X0, width: ENTRY_X - LINE_X0, top: 116, textAlign: 'center', fontSize: 52, fontWeight: 880, color: '#fde68a', whiteSpace: 'nowrap', opacity: manyLabel, transform: `translateY(${(1 - manyLabel) * 10}px)` }}>
          {S05.manyPaths}
        </div>
      ) : null}

      {/* ================= The room with one door ================= */}
      {roomIn > 0.001 && roomOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: roomIn * (1 - roomOut), transform: `scale(${1 - 0.12 * roomOut})`, transformOrigin: `${doorC.x}px ${doorC.y}px` }}>
          <div style={{ position: 'absolute', left: 0, width: W, top: 14, textAlign: 'center', fontSize: 48, fontWeight: 860, color: C.textStrong, whiteSpace: 'nowrap' }}>{S05.room.title}</div>
          <div style={{ position: 'absolute', left: ROOM.x, top: ROOM.y }}>
            <ControlRoom
              width={ROOM_W}
              show={roomIn}
              door={doorP}
              reader={progress(frame, at.tarjeta - 6, 34, EASE.linear)}
              log={progress(frame, at.grabado - 24, 44, EASE.linear)}
              labels={{ door: S05.room.door, reader: S05.room.turnstile, recorded: S05.room.recorded }}
              doorLabel={progress(frame, at.puerta2 - 6, 14)}
              readerLabel={progress(frame, at.tarjeta - 4, 14)}
              logLabel={progress(frame, at.grabado - 6, 14)}
              frame={frame}
            />
          </div>
        </div>
      ) : null}

      {/* JUMP SERVER */}
      {termP > 0.001 ? (
        <div style={{ position: 'absolute', left: 380, top: 14, opacity: 1 - 0.86 * wrapDim }}>
          <TermTag show={termP} term={S05.term.name} sub={S05.term.sub} subShow={termSub} />
        </div>
      ) : null}

      {/* The wrap: the public, at the counter; the controls, behind one door */}
      {row1 > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, width: W, top: 150, display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 34,
              padding: '34px 56px',
              borderRadius: RADIUS.lg,
              background: alpha(C.ink950, 0.92),
              border: `2px solid ${alpha(C.cyan, 0.35)}`,
              opacity: row1,
            }}
          >
            <WrapRow show={row1} text={S05.wrap[0]} icon={<ServiceCounter width={170} detail="icon" frame={frame} />} />
            <WrapRow show={row2} text={S05.wrap[1]} icon={<div style={{ width: 170, display: 'flex', justifyContent: 'center' }}><DoorGlyph size={124} /></div>} />
          </div>
        </div>
      ) : null}
    </Stage>
  );
}

/** One line of the wrap: its text, then its icon. */
function WrapRow({ show, text, icon }: { show: number; text: string; icon: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40, opacity: show, transform: `translateY(${(1 - show) * 10}px)` }}>
      <span style={{ fontSize: 54, fontWeight: 860, color: C.textStrong, whiteSpace: 'nowrap' }}>{text}</span>
      {icon}
    </div>
  );
}
