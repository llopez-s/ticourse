import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { mix, windowWeight } from '../../../engine/src/ui';
import { ANSWER, CHOICES, ROLES, TERM } from '../data/s03-8021x';
import { EntranceGate, entranceGatePoint, entranceGateSize } from './parts/EntranceGate';
import { RoleLanes, roleLanesLayout } from './parts/RoleLanes';
import { ChoiceButton, RoleTag, TermTag } from './parts/s03-8021x/Bits';
import { Stage, segment, wordFrame } from './kit';

const S = 's03-8021x';
const W = STAGE.width;
const H = STAGE.height;

// ---- The lanes: full width while they are built, then squeezed left and low for the think prompt (its card
// spans stage y 10–166) — they stay squeezed through `roles`, the right column holding the two options, then
// the three exam names.
const FULL = { width: 1728, laneHeight: 196, gap: 14, top: 20 } as const;
const SQ = { width: 1300, laneHeight: 146, gap: 10, top: 196 } as const;
const SQ_L = roleLanesLayout(SQ);
const COL = { x: SQ.width + 40, w: W - SQ.width - 40 } as const;
const COL_CX = COL.x + COL.w / 2;
const BTN = { w: 340, h: 92 } as const;
const laneY = (id: 'device' | 'switch' | 'radius') => SQ.top + SQ_L.lanes[id].cy;

// ---- The entrance gate: big while the voice tells it, smaller and low under the name 802.1X.
const GATE_W = 1300;
const GATE_Y = 14;
const GATE_END_W = 1000;
const GATE_END_Y = H - Math.round(entranceGateSize(GATE_END_W).h) - 8;

/**
 * s03-8021x «Tres papeles en la puerta».
 *   lanes     three horizontal lanes (the lesson's diagram on its side): «equipo · supplicant», «switch de
 *             acceso · authenticator», «RADIUS · authentication server».
 *   closed    the port on the switch lane, shut: «cerrado · solo pasa la autenticación (EAPOL)».
 *   ask       the device asks to come in, carrying its accreditation (the device lane in focus, the rest
 *             steps back) — `relay` the switch passes it down to RADIUS — `check` RADIUS looks it up in
 *             «el directorio»; on «abre» the switch lane says «abre o cierra la toma». No answer arrow yet.
 *   s03-05    the lanes squeeze to the left and low; two identical buttons, «el switch» and «RADIUS», on
 *             their lanes' rows in the right column, glowing alike through the hold; the top strip is empty.
 *   decides   «RADIUS» lights emerald with a tick, «el switch» steps back; RADIUS's answer arrow rises into the
 *             port with «accept · reject»; on «transmite» «el switch transmite y obedece» over the lanes.
 *   roles     the buttons go; each lane's exam name comes up as a violet tag in the column, on its word
 *             (supplicant, authenticator, authentication server), its lane in focus.
 *   gate      the lanes leave; the compound's entrance: the driver raises the accreditation («supplicant»
 *             under the cab), the guard phones the accreditation office («authenticator»), the office checks
 *             its list («authentication server») and answers yes; only then the gate rolls open.
 *   dot1x     the gate settles low; «802.1X» with «port-based network access control». Holds.
 */
export function S03Dot1x(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  const lanesAt = props.cue('lanes');
  const closedAt = props.cue('closed');
  const askAt = props.cue('ask');
  const relayAt = props.cue('relay');
  const checkAt = props.cue('check');
  const decidesAt = props.cue('decides');
  const rolesAt = props.cue('roles');
  const gateAt = props.cue('gate');
  const dot1xAt = props.cue('dot1x');
  const s05 = segment(props, 's03-05');

  const at = {
    abre: w('s03-04', 'abre'),
    decide: w('s03-05', 'decide'),
    transmite: w('s03-06', 'transmite'),
    roles: ROLES.map((r) => w('s03-07', r.word) - 6),
    conductor: w('s03-08', 'conductor'),
    acreditacion: w('s03-08', 'acreditación'),
    vigilante: w('s03-08', 'vigilante'),
    llama: w('s03-08', 'llama'),
    oficina: w('s03-08', 'oficina'),
    // «abre si le dicen que sí»: the first «si» is the conditional; the yes is the second.
    yes: w('s03-08', 'sí', 1),
    control: w('s03-09', 'control'),
  };

  // ================= The lanes =================
  const draw = progress(frame, Math.max(0, lanesAt - 24), 50);
  const squeeze = progress(frame, s05.from - 4, 24, EASE.inOut);
  const lanesOut = progress(frame, gateAt - 10, 18, EASE.inOut);
  const lw = mix(FULL.width, SQ.width, squeeze);
  const lh = mix(FULL.laneHeight, SQ.laneHeight, squeeze);
  const lg = mix(FULL.gap, SQ.gap, squeeze);
  const lt = mix(FULL.top, SQ.top, squeeze);

  const roleLit = (i: number) => windowWeight(frame, at.roles[i], at.roles[i + 1] ?? gateAt, { ramp: 10 });
  const focus = {
    device: Math.max(windowWeight(frame, askAt, relayAt), roleLit(0)),
    switch: Math.max(windowWeight(frame, closedAt, askAt), windowWeight(frame, at.abre - 4, s05.from), roleLit(1)),
    radius: Math.max(windowWeight(frame, relayAt, at.abre - 4), windowWeight(frame, decidesAt, at.roles[0]), roleLit(2)),
  };

  // ================= The think prompt's options, then the answer =================
  const btnIn = progress(frame, s05.from + 6, 16);
  const btnOut = progress(frame, rolesAt - 6, 14, EASE.inOut);
  const btnGlow = windowWeight(frame, at.decide, s05.to, { ramp: 12 });
  const chosen = progress(frame, decidesAt, 14);
  const switchBack = progress(frame, decidesAt + 4, 14);
  const answerLine = progress(frame, at.transmite - 8, 16);
  const answerDim = progress(frame, rolesAt, 16);

  // ================= The entrance gate =================
  const gateIn = progress(frame, gateAt - 4, 20);
  const toEnd = progress(frame, dot1xAt - 6, 26, EASE.inOut);
  const gw = mix(GATE_W, GATE_END_W, toEnd);
  const gx = (W - gw) / 2;
  const gy = mix(GATE_Y, GATE_END_Y, toEnd);
  const ground = entranceGatePoint(gw, 'ground').y;
  const gateTags = [
    { at: at.conductor - 4, point: entranceGatePoint(gw, 'driver').x },
    { at: at.vigilante - 4, point: entranceGatePoint(gw, 'guard').x },
    { at: at.oficina - 4, point: entranceGatePoint(gw, 'office').x },
  ];
  const tagsOut = progress(frame, dot1xAt - 10, 14, EASE.inOut);

  // ================= 802.1X =================
  const termIn = progress(frame, dot1xAt + 2, 16);
  const subIn = progress(frame, at.control - 6, 14);

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      {/* ================= The three lanes ================= */}
      {lanesOut < 1 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, opacity: 1 - lanesOut, transform: `translateY(${-14 * lanesOut}px)` }}>
          <div style={{ position: 'absolute', left: 0, top: lt }}>
            <RoleLanes
              width={lw}
              laneHeight={lh}
              gap={lg}
              draw={draw}
              closed={progress(frame, closedAt, 16)}
              ask={progress(frame, askAt, 22)}
              relay={progress(frame, relayAt, 22)}
              check={progress(frame, checkAt, 26)}
              switchNote={progress(frame, at.abre - 4, 14)}
              // RADIUS's answer: nothing before `decides`.
              answer={frame < decidesAt ? 0 : progress(frame, decidesAt, 18)}
              focus={focus}
            />
          </div>

          {/* The two options (identical until `decides`), on their lanes' rows */}
          {btnIn > 0.001 && btnOut < 1 ? (
            <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, opacity: 1 - btnOut }}>
              <div style={{ position: 'absolute', left: COL_CX - BTN.w / 2, top: laneY('switch') - BTN.h / 2 }}>
                <ChoiceButton label={CHOICES.switch} width={BTN.w} height={BTN.h} show={btnIn} glow={btnGlow} dim={switchBack} />
              </div>
              <div style={{ position: 'absolute', left: COL_CX - BTN.w / 2, top: laneY('radius') - BTN.h / 2 }}>
                <ChoiceButton label={CHOICES.radius} width={BTN.w} height={BTN.h} show={btnIn} glow={btnGlow} chosen={chosen} />
              </div>
            </div>
          ) : null}

          {/* `roles`: each lane's exam name, in the column, on its word */}
          {ROLES.map((r, i) => {
            const show = progress(frame, at.roles[i], 14);
            if (show <= 0.001) return null;
            return (
              <div key={r.lane} style={{ position: 'absolute', left: COL.x, width: COL.w, top: laneY(r.lane), transform: 'translateY(-50%)', display: 'flex', justifyContent: 'center' }}>
                <RoleTag text={r.term} show={show} lit={roleLit(i)} size={40} maxWidth={COL.w - 10} icon={false} />
              </div>
            );
          })}

          {/* The answer, in the strip the think card has left */}
          {answerLine > 0.001 ? (
            <div style={{ position: 'absolute', left: 0, width: W, top: 56, textAlign: 'center', fontSize: 56, fontWeight: 870, letterSpacing: -0.8, color: C.textStrong, whiteSpace: 'nowrap', opacity: answerLine * (1 - 0.5 * answerDim) }}>
              <div style={{ ...enter(frame, at.transmite - 8, { distance: 14, duration: 16 }) }}>
                {ANSWER.lead}
                <span style={{ color: C.cyan }}>{ANSWER.rest}</span>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ================= The compound's entrance ================= */}
      {gateIn > 0.001 ? (
        <div style={{ position: 'absolute', left: gx, top: gy, opacity: gateIn }}>
          <EntranceGate
            width={gw}
            card={progress(frame, at.acreditacion - 8, 16)}
            call={progress(frame, at.llama - 2, 20)}
            check={progress(frame, at.llama + 14, 30)}
            answer={progress(frame, at.yes - 14, 18)}
            open={progress(frame, at.yes + 4, 22)}
            result={progress(frame, at.yes + 4, 14)}
            focus={{
              driver: windowWeight(frame, at.conductor - 4, at.vigilante - 4),
              guard: windowWeight(frame, at.vigilante - 4, at.oficina - 4),
              office: windowWeight(frame, at.oficina - 4, at.yes - 8),
              gate: windowWeight(frame, at.yes, dot1xAt - 6),
            }}
          />
          {/* Each role's exam name under its figure */}
          {tagsOut < 1
            ? gateTags.map((t, i) => {
                const show = progress(frame, t.at, 14) * (1 - tagsOut);
                if (show <= 0.001) return null;
                return (
                  <div key={i} style={{ position: 'absolute', left: t.point, top: ground + 12, transform: 'translateX(-50%)' }}>
                    <RoleTag text={ROLES[i].term} show={show} lit={windowWeight(frame, t.at, (gateTags[i + 1]?.at ?? at.yes - 8) + 0, { ramp: 10 })} size={32} icon={false} />
                  </div>
                );
              })
            : null}
        </div>
      ) : null}

      {/* ================= 802.1X ================= */}
      {termIn > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, width: W, top: 4, display: 'flex', justifyContent: 'center' }}>
          <TermTag show={termIn} term={TERM.name} sub={TERM.sub} subShow={subIn} />
        </div>
      ) : null}
    </Stage>
  );
}
