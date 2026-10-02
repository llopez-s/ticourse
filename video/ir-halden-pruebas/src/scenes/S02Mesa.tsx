import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse, springIn } from '../../../engine/src/theme/motion';
import { Icon, clamp01, mix } from '../../../engine/src/ui';
import { ANSWER, AREAS, CAPTION, FIX, HEAD, NAME, ROOM, TABLE_CHIPS } from '../data/s02-mesa';
import { ImprovementRow, PaperList, Phone, SpeechBubble } from './parts/Bits';
import { CARD, CaseCard, MAIL_LIST, type CaseTimes } from './parts/s02-mesa/CaseCard';
import { DrillArt, MesaArt, WAY_TONE, WayChip, twoWaysAnchors, twoWaysSize } from './parts/TwoWays';
import { Stage, wordFrame } from './kit';

const S = 's02-mesa';
const W = 1728;

/** Where the two arts sit: side by side (P1), the answer (P2), the port's room (P3). */
const SIDE = { w: 560, top: 172, left: [194, 974] } as const;
const ANSWER_POS = { mesa: { left: 40, top: 60, w: 640 }, drill: { left: 1420, top: 360, w: 290 } } as const;
/** The room is an 840 px column: centred on the stage first, then on the left once the case card arrives. */
const ROOM_COL = { w: 840, centred: (1728 - 840) / 2 } as const;
const ROOM_POS = { mesa: { left: (840 - 470) / 2, top: 78, w: 470 } } as const;
const CHIPS_X = 720;
const CARD_POS = { left: W - CARD.w, top: 0 } as const;
const FIX_ROW = { top: 588, h: 62 } as const;
const PAPER = { x: 130, y: 120, w: 170 } as const;
const PHONE = { x: 500, y: 110, w: 132 } as const;

/**
 * s02-mesa «Ensayo en la sala». The two ways to test a plan, side by side
 * with their image: the table (a script in hand) and the fire drill (bell,
 * people leaving). Both pulse the same while the think prompt asks which one
 * fits «without touching production, cheaply». The answer: the table lights
 * with «se habla · no se toca ningún sistema · barato» and its exam name
 * TABLETOP EXERCISE; the drill dims (it comes back in s03). Then the port's
 * table on 2026-10-02, six areas around it; a case card comes out of the
 * script («Caso · 03:00 · se cae el correo corporativo · ¿a quién llamas?»).
 * The room answers «a la suplente de Seguridad»; her number is in the plan's
 * contact list, inside the mailbox, and inside the case card that mailbox
 * goes dark with the list in it. The fix: copies of the list fly out to a
 * paper sheet and the on-call phone (the mail copy stays), with the row
 * «lista de contactos fuera de banda · Seguridad · 05-10».
 */
export function S02Mesa(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const twoWays = props.cue('two-ways');
  const fire = props.cue('fire');
  const table = props.cue('table');
  const tabletop = props.cue('tabletop');
  const room = props.cue('room');
  const gap = props.cue('gap');
  const fix = props.cue('fix');

  const hablando = wordFrame(S, 's02-01', 'hablando,');
  const lanza = wordFrame(S, 's02-04', 'lanza');
  const guion = wordFrame(S, 's02-01', 'guion');
  const simulacro = wordFrame(S, 's02-02', 'simulacro');
  const sin = wordFrame(S, 's02-02', 'sin');
  const eliges = wordFrame(S, 's02-02', 'eliges?');
  const habla = wordFrame(S, 's02-03', 'habla.');
  const tabletopWord = wordFrame(S, 's02-03', 'tabletop');
  const tres = wordFrame(S, 's02-04', 'tres');
  const cae = wordFrame(S, 's02-04', 'cae');
  const quien = wordFrame(S, 's02-04', 'quién');
  const numero = wordFrame(S, 's02-05', 'número');
  const vive = wordFrame(S, 's02-05', 'vive');
  const papel = wordFrame(S, 's02-06', 'papel');
  const movil = wordFrame(S, 's02-06', 'móvil');

  // --- Layout morphs ----------------------------------------------------------
  // Starts once the think prompt has left the top band (its hold ends where s02-03 begins).
  const toAnswer = progress(frame, table, 22, EASE.inOut);
  const toRoom = progress(frame, room - 6, 22, EASE.inOut);
  const roomOut = progress(frame, fix - 4, 14, EASE.inOut);
  const roomX = mix(ROOM_COL.centred, 0, progress(frame, lanza - 16, 20, EASE.inOut));

  // Mesa: side → answer → room; it leaves when the fix takes the left side.
  const mesaLeft = mix(mix(SIDE.left[0], ANSWER_POS.mesa.left, toAnswer), roomX + ROOM_POS.mesa.left, toRoom);
  const mesaTop = mix(mix(SIDE.top, ANSWER_POS.mesa.top, toAnswer), ROOM_POS.mesa.top, toRoom);
  const mesaW = mix(mix(SIDE.w, ANSWER_POS.mesa.w, toAnswer), ROOM_POS.mesa.w, toRoom);
  const mesaIn = springIn(frame, fps, twoWays - 6, { damping: 16 });
  const mesaAct = progress(frame, hablando - 6, Math.max(14, guion - hablando + 6), EASE.inOut);

  // Drill: side → small and dim; gone for the room.
  const drillLeft = mix(SIDE.left[1], ANSWER_POS.drill.left, toAnswer);
  const drillTop = mix(SIDE.top, ANSWER_POS.drill.top, toAnswer);
  const drillW = mix(SIDE.w, ANSWER_POS.drill.w, toAnswer);
  const drillIn = springIn(frame, fps, fire - 4, { damping: 16 });
  const drillAct = progress(frame, simulacro - 6, 18) * (1 - 0.7 * toAnswer);
  const drillOut = progress(frame, room - 8, 14, EASE.inOut);

  // «¿Cuál eliges?»: both pulse the same until the answer.
  const even = progress(frame, sin - 6, 16) * (1 - toAnswer);
  const evenGlow = even * (0.3 + 0.35 * pulse(frame, fps, 0.6));
  const mesaGlow = Math.max(evenGlow, toAnswer * (1 - 0.6 * toRoom));
  const drillDim = toAnswer * 0.85;

  // The heading leaves before the think prompt takes the top of the stage.
  const headP = enter(frame, twoWays + 2, { distance: 12 });
  const headOut = progress(frame, eliges - 8, 12, EASE.inOut);

  // The answer column (chips + exam name) lives from the answer to the room.
  const answerOut = progress(frame, room - 10, 12, EASE.inOut);

  // The port's room.
  const script = twoWaysAnchors(ROOM_POS.mesa.w).mesa.script;
  const caseT: CaseTimes = {
    tagAt: lanza - 2,
    timeAt: tres - 4,
    whatAt: cae - 8,
    askAt: quien - 8,
    mailAt: numero - 10,
    rowAt: numero + 2,
    darkAt: vive - 4,
  };
  const cardIn = springIn(frame, fps, lanza - 4, { damping: 17 });

  return (
    <Stage>
      {/* Heading (P1) */}
      {headOut < 1 ? (
        <div style={{ position: 'absolute', left: 0, top: 36, width: W, textAlign: 'center', fontFamily: FONT.sans, fontSize: 52, fontWeight: 850, letterSpacing: -0.6, color: C.textStrong, whiteSpace: 'nowrap', ...headP, opacity: headP.opacity * (1 - headOut) }}>
          {HEAD}
        </div>
      ) : null}

      {/* The drill */}
      {drillOut < 1 && drillIn > 0.001 ? (
        <div style={{ position: 'absolute', left: drillLeft, top: drillTop, width: drillW, opacity: Math.min(1, drillIn * 1.3) * (1 - drillOut), transform: `translateY(${(1 - Math.min(1, drillIn)) * 20}px)` }}>
          <DrillArt width={drillW} act={drillAct} glow={evenGlow} dim={drillDim} frame={frame} />
          <Caption text={CAPTION.drill} tone={C.amber} size={mix(44, 32, toAnswer)} dim={drillDim} />
        </div>
      ) : null}

      {/* The table */}
      {roomOut < 1 && mesaIn > 0.001 ? (
        <div style={{ position: 'absolute', left: mesaLeft, top: mesaTop, width: mesaW, opacity: Math.min(1, mesaIn * 1.3) * (1 - roomOut), transform: `translateY(${(1 - Math.min(1, mesaIn)) * 20}px)` }}>
          <MesaArt width={mesaW} act={mesaAct} glow={mesaGlow} frame={frame} />
          <Caption text={CAPTION.mesa} tone={C.sky} size={44} opacity={1 - toRoom} />
        </div>
      ) : null}

      {/* P2: why the table, and its exam name */}
      {frame >= table - 8 && answerOut < 1 ? (
        <AnswerColumn frame={frame} fps={fps} chipAt={[habla - 6, habla + 6, habla + 18]} labelAt={tabletop - 4} nameAt={tabletopWord - 8} out={answerOut} />
      ) : null}

      {/* P3: the port's room */}
      {frame >= room - 8 && roomOut < 1 ? (
        <Room frame={frame} fps={fps} at={room} answerAt={gap + 4} out={roomOut} x={roomX} mesaH={twoWaysSize(ROOM_POS.mesa.w).height} />
      ) : null}

      {/* The case card comes out of the raised script */}
      {cardIn > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: CARD_POS.left,
            top: CARD_POS.top,
            opacity: Math.min(1, cardIn * 1.6),
            transform: `translate(${(1 - Math.min(1, cardIn)) * (mesaLeft + script.x - CARD_POS.left)}px, ${(1 - Math.min(1, cardIn)) * (mesaTop + script.y - CARD_POS.top)}px) scale(${0.12 + 0.88 * Math.min(1, cardIn)}) rotate(${-1.2 * Math.min(1, cardIn)}deg)`,
            transformOrigin: '0 0',
          }}
        >
          <CaseCard frame={frame} t={caseT} glow={progress(frame, lanza, 14) * (1 - progress(frame, fix, 16))} rowOut={vive + 20} />
        </div>
      ) : null}

      {/* P4: the fix */}
      {frame >= fix - 4 ? <Fix frame={frame} fps={fps} at={fix} paperAt={papel} phoneAt={movil} /> : null}
    </Stage>
  );
}

// ---------------------------------------------------------------------------
// Pieces
// ---------------------------------------------------------------------------

function Caption({ text, tone, size, dim = 0, opacity = 1 }: { text: string; tone: string; size: number; dim?: number; opacity?: number }) {
  return (
    <div
      style={{
        marginTop: 12,
        textAlign: 'center',
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 800,
        color: tone,
        whiteSpace: 'nowrap',
        opacity: opacity * (1 - 0.6 * clamp01(dim)),
      }}
    >
      {text}
    </div>
  );
}

function AnswerColumn({ frame, fps, chipAt, labelAt, nameAt, out }: { frame: number; fps: number; chipAt: readonly number[]; labelAt: number; nameAt: number; out: number }) {
  const label = springIn(frame, fps, labelAt, { damping: 16 });
  const name = progress(frame, nameAt, 14);
  return (
    <div style={{ position: 'absolute', left: CHIPS_X, top: 0, width: 690, height: 660, opacity: 1 - out, transform: `translateY(${-out * 14}px)`, fontFamily: FONT.sans }}>
      {TABLE_CHIPS.map((c, i) => {
        const p = springIn(frame, fps, chipAt[i], { damping: 15 });
        if (p <= 0.001) return null;
        return (
          <div key={c} style={{ position: 'absolute', left: 0, top: 84 + i * 92, opacity: Math.min(1, p * 1.3), transform: `translateX(${(1 - Math.min(1, p)) * 24}px)` }}>
            <WayChip tone={WAY_TONE.mesa} icon="check" size={40}>
              {c}
            </WayChip>
          </div>
        );
      })}
      {label > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: 380, opacity: Math.min(1, label * 1.3), transform: `translateY(${(1 - Math.min(1, label)) * 16}px)` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 32, fontWeight: 700, color: C.text, whiteSpace: 'nowrap' }}>
            <Icon name="mortarboard" size={38} color={C.violet} />
            {NAME.label}
          </div>
          <div style={{ marginTop: 8, fontSize: 56, fontWeight: 850, letterSpacing: 0.5, color: '#7dd3fc', whiteSpace: 'nowrap', textShadow: `0 0 24px ${alpha(C.sky, 0.35 * name)}`, opacity: name, transform: `translateY(${(1 - name) * 10}px)` }}>{NAME.en}</div>
        </div>
      ) : null}
    </div>
  );
}

function Room({ frame, fps, at, answerAt, out, x, mesaH }: { frame: number; fps: number; at: number; answerAt: number; out: number; x: number; mesaH: number }) {
  const mesaTop = ROOM_POS.mesa.top;
  const head = enter(frame, at - 2, { distance: 12 });
  const rows = [AREAS.slice(0, 3), AREAS.slice(3)];
  const answer = springIn(frame, fps, answerAt, { damping: 15 });
  return (
    <div style={{ position: 'absolute', left: x, top: 0, width: ROOM_COL.w, height: 660, opacity: 1 - out, fontFamily: FONT.sans }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: ROOM_COL.w, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, whiteSpace: 'nowrap', ...head }}>
        <Icon name="clock" size={38} color={C.sky} />
        <span style={{ fontFamily: FONT.mono, fontSize: 38, fontWeight: 800, color: C.textStrong }}>
          {ROOM.date} <span style={{ color: C.faint }}>·</span> <span style={{ color: '#7dd3fc' }}>{ROOM.time}</span>
        </span>
        <span style={{ fontSize: 38, fontWeight: 700, color: C.faint }}>·</span>
        <span style={{ fontSize: 38, fontWeight: 800, color: C.text }}>{ROOM.room}</span>
      </div>
      {rows.map((row, r) => (
        <div key={r} style={{ position: 'absolute', left: 0, width: ROOM_COL.w, top: mesaTop + mesaH + 24 + r * 72, display: 'flex', justifyContent: 'center', gap: 14 }}>
          {row.map((a, i) => {
            const p = springIn(frame, fps, at + 6 + (r * 3 + i) * 3, { damping: 16 });
            return (
              <span key={a} style={{ opacity: Math.min(1, p * 1.3), transform: `translateY(${(1 - Math.min(1, p)) * 12}px)`, display: 'inline-block' }}>
                <WayChip tone="sky" size={32}>
                  {a}
                </WayChip>
              </span>
            );
          })}
        </div>
      ))}
      {answer > 0.001 ? (
        <div style={{ position: 'absolute', left: 70, top: mesaTop - 6, opacity: Math.min(1, answer * 1.3), transform: `translateY(${(1 - Math.min(1, answer)) * 16}px) scale(${0.9 + 0.1 * Math.min(1, answer)})`, transformOrigin: '20% 100%' }}>
          <SpeechBubble tone="sky" size={44} tail="bottom-left" tailAt={290} glow={0.6}>
            {ANSWER}
          </SpeechBubble>
        </div>
      ) : null}
    </div>
  );
}

function Fix({ frame, fps, at, paperAt, phoneAt }: { frame: number; fps: number; at: number; paperAt: number; phoneAt: number }) {
  const row = springIn(frame, fps, at + 2, { damping: 16 });
  const lit = progress(frame, at + 2, 12) * (1 - 0.5 * progress(frame, phoneAt + 30, 20));
  const src = { x: CARD_POS.left + MAIL_LIST.x, y: CARD_POS.top + MAIL_LIST.y };
  const paperH = (PAPER.w * 190) / 150;
  const phoneH = (PHONE.w * 200) / 120;
  const targets = [
    { at: paperAt, x: PAPER.x + PAPER.w / 2, y: PAPER.y + paperH / 2, w: PAPER.w },
    { at: phoneAt, x: PHONE.x + PHONE.w / 2, y: PHONE.y + phoneH / 2, w: PHONE.w * 0.6 },
  ];
  const FLY = 22;
  const paperIn = progress(frame, paperAt - 2, 10);
  const phoneIn = springIn(frame, fps, at + 8, { damping: 16 });
  const phoneList = progress(frame, phoneAt - 2, 10);
  return (
    <>
      {/* The paper copy */}
      <div style={{ position: 'absolute', left: PAPER.x, top: PAPER.y, opacity: paperIn, transform: `scale(${0.9 + 0.1 * paperIn}) rotate(-3deg)` }}>
        <PaperList width={PAPER.w} tone="emerald" />
      </div>
      {paperIn < 1 ? (
        <div style={{ position: 'absolute', left: PAPER.x, top: PAPER.y, width: PAPER.w, height: paperH, boxSizing: 'border-box', borderRadius: 10, border: `3px dashed ${alpha(C.emerald, 0.45)}`, opacity: progress(frame, at + 6, 12) * (1 - paperIn), transform: 'rotate(-3deg)' }} />
      ) : null}
      <Label x={PAPER.x + PAPER.w / 2} y={PAPER.y + paperH + 18} text={FIX.paper} p={progress(frame, at + 8, 12)} />

      {/* The on-call phone */}
      <div style={{ position: 'absolute', left: PHONE.x, top: PHONE.y, opacity: Math.min(1, phoneIn * 1.3), transform: `translateY(${(1 - Math.min(1, phoneIn)) * 14}px)` }}>
        <Phone width={PHONE.w} list={phoneList} ring={0} frame={frame} />
      </div>
      <Label x={PHONE.x + PHONE.w / 2} y={PHONE.y + phoneH + 18} text={FIX.phone} p={progress(frame, at + 12, 12)} />

      {/* Copies leave the mailbox (its own copy stays inside) */}
      {targets.map((t, i) => {
        const p = progress(frame, t.at - FLY, FLY, EASE.inOut);
        if (p <= 0 || p >= 1) return null;
        const cx = (src.x + t.x) / 2;
        const cy = Math.min(src.y, t.y) - 180;
        const x = (1 - p) * (1 - p) * src.x + 2 * (1 - p) * p * cx + p * p * t.x;
        const y = (1 - p) * (1 - p) * src.y + 2 * (1 - p) * p * cy + p * p * t.y;
        const w = mix(MAIL_LIST.w, t.w, p);
        return (
          <div key={i} style={{ position: 'absolute', left: x - w / 2, top: y - (w * 190) / 150 / 2, opacity: Math.min(1, p * 5), filter: `drop-shadow(0 0 16px ${alpha(C.emerald, 0.6)})` }}>
            <PaperList width={w} tone="emerald" />
          </div>
        );
      })}

      {/* The improvement row */}
      {row > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: FIX_ROW.top, opacity: Math.min(1, row * 1.3), transform: `translateY(${(1 - Math.min(1, row)) * 18}px)` }}>
          <ImprovementRow imp={FIX.row} width={W} height={FIX_ROW.h} textSize={36} ownerX={1236} dateX={1560} lit={lit} />
        </div>
      ) : null}
    </>
  );
}

function Label({ x, y, text, p }: { x: number; y: number; text: string; p: number }) {
  return (
    <div style={{ position: 'absolute', left: x - 200, top: y, width: 400, textAlign: 'center', fontFamily: FONT.sans, fontSize: 40, fontWeight: 800, color: '#6ee7b7', whiteSpace: 'nowrap', opacity: p, transform: `translateY(${(1 - p) * 10}px)` }}>
      {text}
    </div>
  );
}
