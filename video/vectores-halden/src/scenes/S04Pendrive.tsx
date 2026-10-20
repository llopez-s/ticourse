import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { cubicPath, mix } from '../../../engine/src/ui';
import { ENTRIES, USB } from '../data/map';
import { BAIT, KEYBOARD, NAME, NOBODY, NOT_PLUGGED, NO_FILE, OLD_PC_LABEL, PACK_BAIT, PACK_PATH, PATH } from '../data/s04-pendrive';
import { BACKPACK, Backpack, POCKET_CENTRE } from './parts/Backpack';
import { EntryBox } from './parts/EntryMap';
import { CaseTag, ImageTag, Pill, TermPill } from './parts/Labels';
import { PENDRIVE, Pendrive } from './parts/Pendrive';
import { RECEPTION, RECEPTION_ANCHORS, Reception } from './parts/Reception';
import { TimeBubble, Watch } from './parts/Watch';
import { OLD_PC, OLD_PC_PORT, OldPc } from './parts/s04-pendrive/OldPc';
import { Stage, wordFrame } from './kit';

const S = 's04-pendrive';

// ---- The case, in its own group (1728×606 at stage y 54); from `time` it steps left and small.
const G_Y = 54;
const G_S1 = 0.6;
const G_Y1 = 66;
const REC = { x: 260, y: 170, w: 560 } as const;
const RS = REC.w / RECEPTION.w;
const recPt = (p: { x: number; y: number }) => ({ x: REC.x + p.x * RS, y: REC.y + p.y * RS });
const PORT1 = recPt(RECEPTION_ANCHORS.usb);
const COUNTER = recPt(RECEPTION_ANCHORS.counterTop);
/** The USB line from its box (top-left) down and round to the counter's port. */
const USB_LINE: [{ x: number; y: number }, { x: number; y: number }, { x: number; y: number }, { x: number; y: number }] = [
  { x: 40, y: 168 },
  { x: 40, y: 330 },
  { x: PORT1.x - 160, y: PORT1.y },
  { x: PORT1.x - 12, y: PORT1.y },
];
const SMALL_W = 130;
const SMALL_H = (SMALL_W * PENDRIVE.h) / PENDRIVE.w;
/** The small pendrive's top-left on the counter. */
const ON_COUNTER = { x: COUNTER.x - 50, y: COUNTER.y - SMALL_H + 4 };
const CALLOUT = { x: 780, y: 20, w: 420 } as const;
const PC = { x: 1110, y: 0, w: 600 } as const;
const PK = PC.w / OLD_PC.w;
const PC_PORT = { x: PC.x + OLD_PC_PORT.x * PK, y: PC.y + OLD_PC_PORT.y * PK };
const PC_H = OLD_PC.h * PK;
const BIG = { x: 250, y: 196, w: 460 } as const;
// ---- The backpack (stage coordinates, from `time`).
const PACK_W = 280;
const PACK = { x: 1330, y: 70 } as const;
const PACK_H = (PACK_W * BACKPACK.h) / BACKPACK.w;
const PKK = PACK_W / BACKPACK.w;

/** The typing window's rows: widths of the grey bars that stand for orders nobody needs to read. */
const ROWS = [62, 84, 48, 90, 70, 56, 88, 40, 76, 66];

/**
 * s04-pendrive «Un pendrive en el mostrador». «Caso de ejemplo · sin fecha». The USB line of the map comes back: its
 * box (Removable device) and the line to the counter's ports. On `counter` a pendrive lands on the counter; on
 * `sticker` a callout shows it big with its sticker «Nóminas 2027» and «nadie sabe quién lo dejó». On `handed`
 * «Recepción no lo enchufa» and the pendrive travels to Systems' old computer («ordenador viejo · sin red»), where it
 * plugs into the tower; on `keyboard` the screen says «teclado conectado»; on `typing` a window opens and fills itself
 * with orders faster than anyone types; on `no-file`, «ningún fichero abierto». On `bait` the reception steps back and
 * the pendrive comes back big, its sticker amber: «el cebo · la pegatina»; on `path` the tower's port glows cyan: «el
 * camino · el puerto USB». On `time` the case steps left and the backpack comes in («imagen · no es del puerto»):
 * «¿qué hora es?» and the watch (amber, «el cebo») while the hand opens the outer pocket (cyan, «el camino»). On
 * `name`, «Removable device · por el camino, no por el cebo». Nothing reaches a computer of the port.
 */
export function S04Pendrive(props: SceneProps) {
  const frame = useCurrentFrame();
  const counterAt = props.cue('counter');
  const stickerAt = props.cue('sticker');
  const handedAt = props.cue('handed');
  const keyboardAt = props.cue('keyboard');
  const typingAt = props.cue('typing');
  const noFileAt = props.cue('no-file');
  const baitAt = props.cue('bait');
  const pathAt = props.cue('path');
  const timeAt = props.cue('time');
  const nameAt = props.cue('name');
  const nobodyAt = wordFrame(S, 's04-01', 'nadie') - 6;
  const testAt = wordFrame(S, 's04-02', 'prueba') - 8;
  const watchAt = wordFrame(S, 's04-05', 'reloj') - 8;
  const pocketAt = wordFrame(S, 's04-05', 'bolsillo') - 10;

  // ---- phase A: the reception and the pendrive
  const recOut = progress(frame, baitAt - 10, 16, EASE.inOut);
  const boxIn = progress(frame, -4, 16);
  const lineDraw = progress(frame, 4, 24);
  const drop = progress(frame, counterAt - 4, 14, EASE.out);
  const calloutIn = progress(frame, stickerAt - 2, 14) * (1 - progress(frame, handedAt - 4, 12));
  const nobodyIn = progress(frame, nobodyAt, 12) * (1 - progress(frame, handedAt - 4, 12));
  const notPlugged = progress(frame, handedAt, 12);

  // ---- the trip to the old computer
  const pcIn = progress(frame, handedAt + 4, 16);
  const trip = progress(frame, Math.max(handedAt + 12, testAt), 34, EASE.inOut);
  const sx = mix(ON_COUNTER.x + SMALL_W / 2, PC_PORT.x, trip);
  const sy = mix(ON_COUNTER.y + SMALL_H / 2, PC_PORT.y + SMALL_W / 2 - 6, trip) - Math.sin(Math.PI * trip) * 140;
  const rot = mix(0, -90, progress(frame, Math.max(handedAt + 12, testAt) + 16, 18, EASE.inOut));
  const keyIn = progress(frame, keyboardAt, 10);
  const winIn = progress(frame, typingAt - 2, 10);
  const rows = Math.max(0, Math.min(ROWS.length, Math.floor((frame - typingAt) / 2.2)));
  const noFile = progress(frame, noFileAt - 2, 12) * (1 - progress(frame, pathAt - 8, 12));
  const pcLabel = pcIn * (1 - progress(frame, pathAt - 8, 10));

  // ---- phase C: the bait and the path
  const bigIn = progress(frame, baitAt - 4, 16);
  const baitOn = progress(frame, baitAt + 4, 12);
  const pathOn = progress(frame, pathAt, 12);

  // ---- phase D: the backpack, and the name
  const glide = progress(frame, timeAt - 12, 26, EASE.inOut);
  const gs = mix(1, G_S1, glide);
  const gy = mix(G_Y, G_Y1, glide);
  const packIn = progress(frame, timeAt, 18);
  const bubbleIn = progress(frame, timeAt + 6, 14);
  const watchOn = progress(frame, watchAt, 12);
  const handIn = progress(frame, pocketAt, 22, EASE.inOut);
  const packBait = progress(frame, watchAt + 8, 12);
  const packPath = progress(frame, pocketAt + 14, 12);
  const nameIn = progress(frame, nameAt - 4, 14);
  const frontPocket = { x: PACK.x + POCKET_CENTRE.front.x * PKK, y: PACK.y + POCKET_CENTRE.front.y * PKK };

  const screen = (
    <div style={{ position: 'absolute', inset: 0, fontFamily: FONT.sans }}>
      {keyIn > 0.01 ? (
        <div style={{ position: 'absolute', left: 10, right: 10, top: 10, height: 58, borderRadius: 10, background: alpha(C.sky, 0.2), border: `2px solid ${alpha(C.sky, 0.8)}`, display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px', boxSizing: 'border-box', opacity: keyIn, transform: `translateY(${(1 - keyIn) * -12}px)` }}>
          <svg width={40} height={26} viewBox="0 0 40 26" style={{ flexShrink: 0 }}>
            <rect x={1.5} y={1.5} width={37} height={23} rx={4} fill="none" stroke={C.sky} strokeWidth={3} />
            {[0, 1, 2, 3, 4].map((k) => (
              <rect key={k} x={6 + k * 6} y={7} width={4} height={4} fill={C.sky} />
            ))}
            <rect x={10} y={16} width={20} height={4} fill={C.sky} />
          </svg>
          <span style={{ fontSize: 33, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>{KEYBOARD}</span>
        </div>
      ) : null}
      {winIn > 0.01 ? (
        <div style={{ position: 'absolute', left: 18, right: 18, top: 80, bottom: 14, borderRadius: 8, background: C.ink900, border: `2px solid ${alpha(C.text, 0.4)}`, overflow: 'hidden', opacity: winIn, transform: `scale(${0.92 + 0.08 * winIn})` }}>
          <div style={{ height: 22, background: alpha(C.text, 0.15), display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px' }}>
            {[0, 1, 2].map((k) => (
              <div key={k} style={{ width: 8, height: 8, borderRadius: 4, background: alpha(C.text, 0.4) }} />
            ))}
          </div>
          <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {ROWS.slice(0, rows).map((w, k) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: alpha(C.amber, 0.7) }} />
                <div style={{ height: 9, width: `${w}%`, borderRadius: 4, background: alpha(C.text, 0.45) }} />
              </div>
            ))}
            {rows < ROWS.length || frame % 30 < 15 ? <div style={{ width: 14, height: 14, background: C.text, marginLeft: 18 }} /> : null}
          </div>
        </div>
      ) : null}
    </div>
  );

  return (
    <Stage>
      <div style={{ position: 'absolute', inset: 0, fontFamily: FONT.sans }}>
        <div style={{ position: 'absolute', left: 0, top: 0, ...enter(frame, -6, { distance: 12, duration: 14 }) }}>
          <CaseTag />
        </div>

        {/* ---------- the case ---------- */}
        <div style={{ position: 'absolute', left: 0, top: gy, width: 1728, height: 606, transform: `scale(${gs})`, transformOrigin: '0 0' }}>
          {/* the USB line of the map: its box, the line, the reception */}
          <div style={{ position: 'absolute', left: 0, top: 0, opacity: boxIn * (1 - 0.6 * recOut) }}>
            <EntryBox entry={ENTRIES[USB]} lit={0.6 + 0.4 * pathOn} chip={1} />
          </div>
          <svg width={1728} height={606} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: 1 - recOut }}>
            <path d={cubicPath(USB_LINE)} fill="none" stroke={C.cyan} strokeWidth={5} strokeLinecap="round" strokeDasharray="1200 1200" strokeDashoffset={1200 * (1 - lineDraw)} />
            {lineDraw > 0.97 ? <circle cx={USB_LINE[3].x} cy={USB_LINE[3].y} r={7} fill={C.cyan} /> : null}
          </svg>
          <div style={{ position: 'absolute', left: REC.x, top: REC.y, opacity: 1 - recOut }}>
            <Reception width={REC.w} lit={{ usb: 0.7 }} screens={0.4} />
          </div>
          {notPlugged > 0.01 ? (
            <div style={{ position: 'absolute', left: REC.x, top: REC.y + RECEPTION.h * RS + 18, width: REC.w, display: 'flex', justifyContent: 'center', opacity: notPlugged * (1 - recOut) }}>
              <Pill text={NOT_PLUGGED} icon="check" tone={C.emerald} size={34} on={notPlugged} />
            </div>
          ) : null}

          {/* the callout: the pendrive big, and nobody knows who left it */}
          {calloutIn > 0.01 ? (
            <div style={{ position: 'absolute', left: CALLOUT.x, top: CALLOUT.y, opacity: calloutIn, transform: `scale(${0.9 + 0.1 * calloutIn})`, transformOrigin: '0 100%' }}>
              <div style={{ padding: 22, borderRadius: RADIUS.lg, border: `2px solid ${alpha(C.text, 0.3)}`, background: alpha(C.ink850, 0.95) }}>
                <Pendrive width={CALLOUT.w} />
              </div>
              {nobodyIn > 0.01 ? (
                <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', opacity: nobodyIn }}>
                  <Pill text={NOBODY} icon="alert" tone={C.amber} size={34} on={nobodyIn} />
                </div>
              ) : null}
            </div>
          ) : null}

          {/* the old computer */}
          {pcIn > 0.01 ? (
            <div style={{ position: 'absolute', left: PC.x, top: PC.y, opacity: pcIn, transform: `translateX(${(1 - pcIn) * 30}px)` }}>
              <OldPc width={PC.w} port={pathOn} screen={0.3 + 0.7 * keyIn}>
                {screen}
              </OldPc>
            </div>
          ) : null}
          {pcLabel > 0.01 ? (
            <div style={{ position: 'absolute', left: PC.x, top: PC_H + 16, width: PC.w, display: 'flex', justifyContent: 'center', opacity: pcLabel }}>
              <Pill text={OLD_PC_LABEL} icon="desktop" tone={C.sky} size={32} height={52} on={0.4} />
            </div>
          ) : null}
          {noFile > 0.01 ? (
            <div style={{ position: 'absolute', left: PC.x - 40, top: PC_H + 72, width: PC.w + 80, display: 'flex', justifyContent: 'center', ...enter(frame, noFileAt - 2, { distance: 10, duration: 12 }), opacity: noFile }}>
              <Pill text={NO_FILE} icon="file" tone={C.emerald} size={32} height={54} on={noFile} />
            </div>
          ) : null}
          {pathOn > 0.01 ? (
            <div style={{ position: 'absolute', left: PC.x - 60, top: PC_H + 30, width: PC.w + 120, display: 'flex', justifyContent: 'center', opacity: pathOn }}>
              <Pill text={PATH} icon="plug" tone={C.cyan} size={36} height={62} weight={850} on={pathOn} />
            </div>
          ) : null}

          {/* the pendrive itself: on the counter, then on its way, then in the tower */}
          {drop > 0.01 ? (
            <div
              style={{
                position: 'absolute',
                left: sx - SMALL_W / 2,
                top: sy - SMALL_H / 2 - (1 - drop) * 60,
                opacity: drop,
                transform: `rotate(${rot}deg)`,
              }}
            >
              <Pendrive width={SMALL_W} glow={pathOn} />
            </div>
          ) : null}

          {/* the bait, big */}
          {bigIn > 0.01 ? (
            <div style={{ position: 'absolute', left: BIG.x, top: BIG.y, opacity: bigIn, transform: `translateY(${(1 - bigIn) * 16}px)` }}>
              <Pendrive width={BIG.w} bait={baitOn} />
              <div style={{ marginTop: 26, display: 'flex', justifyContent: 'center', opacity: baitOn }}>
                <Pill text={BAIT} icon="target" tone={C.amber} size={36} height={62} weight={850} on={baitOn} />
              </div>
            </div>
          ) : null}
        </div>

        {/* ---------- the backpack: the time, and the outer pocket ---------- */}
        {packIn > 0.01 ? (
          <>
            <div style={{ position: 'absolute', left: PACK.x, top: PACK.y, opacity: packIn, transform: `translateX(${(1 - packIn) * 30}px)` }}>
              <Backpack width={PACK_W} frame={frame} lit={{ front: packPath }} open={{ front: handIn * 0.9 }} hand={{ pocket: 'front', at: handIn }} />
            </div>
            <div style={{ position: 'absolute', left: PACK.x - 80, top: PACK.y + PACK_H + 12, width: PACK_W + 160, display: 'flex', justifyContent: 'center', opacity: packIn }}>
              <ImageTag />
            </div>
            <div style={{ position: 'absolute', left: 1060, top: 14 }}>
              <TimeBubble show={bubbleIn} size={34} />
            </div>
            {bubbleIn > 0.01 ? (
              <div style={{ position: 'absolute', left: 1130, top: 112, opacity: bubbleIn }}>
                <Watch size={66} glow={watchOn} frame={frame} />
              </div>
            ) : null}
            {packBait > 0.01 ? (
              <div style={{ position: 'absolute', left: 1080, top: 232, ...enter(frame, watchAt + 8, { distance: 10, duration: 12 }) }}>
                <Pill text={PACK_BAIT} icon="target" tone={C.amber} size={34} on={packBait} />
              </div>
            ) : null}
            {packPath > 0.01 ? (
              <>
                <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: packPath }}>
                  <line x1={1318} y1={frontPocket.y + 40} x2={frontPocket.x - 50} y2={frontPocket.y + 10} stroke={C.cyan} strokeWidth={4} strokeLinecap="round" />
                  <circle cx={frontPocket.x - 50} cy={frontPocket.y + 10} r={6} fill={C.cyan} />
                </svg>
                <div style={{ position: 'absolute', left: 1080, top: frontPocket.y + 12, ...enter(frame, pocketAt + 14, { distance: 10, duration: 12 }) }}>
                  <Pill text={PACK_PATH} icon="plug" tone={C.cyan} size={34} on={packPath} />
                </div>
              </>
            ) : null}
          </>
        ) : null}

        {/* ---------- the name ---------- */}
        {nameIn > 0.01 ? (
          <div style={{ position: 'absolute', left: 0, top: 540, width: 1728, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, opacity: nameIn, transform: `translateY(${(1 - nameIn) * 14}px)` }}>
            <TermPill text={NAME.term} size={44} on={nameIn} />
            <span style={{ fontSize: 40, fontWeight: 800, color: C.cyanSoft, whiteSpace: 'nowrap' }}>{NAME.plain}</span>
          </div>
        ) : null}
      </div>
    </Stage>
  );
}
