import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, mix, type IconName } from '../../../engine/src/ui';
import { CASE_TAG, DOOR, EXTRA, LIST_TITLE, NETWORK, OFFICE, SHARED, TERMS, UNPATCHED } from '../data/s02-lista';
import { Classroom, CLASSROOM } from './parts/Classroom';
import { InventoryList, inventoryRowY } from './parts/Inventory';
import { Pill, Struck, TermPill } from './parts/Labels';
import { NAS, Nas, Shelf } from './parts/Nas';
import { ImageTag } from './parts/Tags';
import { Stage, segment, wordFrame } from './kit';

const S = 's02-lista';

// ---- Column A: the passenger terminal office (stage-local).
const OFFICE_TOP = 70;
const SHELF = { x: 0, y: 380, w: 250 } as const;
const NAS_W = 200;
const NAS_H = (NAS_W * NAS.h) / NAS.w;
const NAS_X = 25;
const NAS_Y = SHELF.y - NAS_H;
const DESKS = [310, 400, 490];
const DESK_Y = 262;
const SHARED_TOP = 162;
const STRIKE_TOP = 434;
const STRIKE_GAP = 48;
// ---- Column B: Sistemas' list and the door «Compras».
const LIST = { x: 580, y: 128, w: 600, rows: 6 } as const;
const DOOR_BOX = { x: 590, y: 0, w: 74, h: 112 } as const;
// ---- Column C: the sweep of the office's wired network.
const NET = { x: 1220, y: 128, w: 508, h: 340 } as const;
const CELL_W = NET.w / 3;
const CELL_H = 120;
const DEVICES: { icon: IconName | 'nas' }[] = [{ icon: 'desktop' }, { icon: 'laptop' }, { icon: 'desktop' }, { icon: 'desktop' }, { icon: 'nas' }, { icon: 'laptop' }];
const NAS_DEVICE = 4;
const SWEEP_DUR = 66;
const TERMS_TOP = 586;
// ---- The classroom card.
const ROOM = { x: 434, y: 96, w: 860, h: 470 } as const;
const ROOM_ART_W = 640;

const cellCentre = (i: number) => ({
  x: NET.x + (i % 3) * CELL_W + CELL_W / 2,
  y: NET.y + 92 + Math.floor(i / 3) * CELL_H + 40,
});

/**
 * s02-lista «Lo que la lista no sabe». «Caso de ejemplo · sin fecha» from the first frame. Column A: the passenger
 * terminal office; on `bought` a payment card lands on the network disk, on `shelf` it stands on the shelf with its
 * lights on and shares «listas de embarque» with three desks; on `unpatched` three items are struck out, each on its
 * word. Column B, on `list`: Sistemas' list fills row by row through the door «Compras»; on «pasó» the disk gets a
 * rose cross: it never went through that door. Column C, on `sweep`: a line sweeps the office's wired network, each
 * device that answers lights and is matched against the list (emerald check); on `extra` the disk lights rose,
 * «responde · no está en la lista». On `classroom` the rest steps back for the small classroom card («imagen · no es
 * del puerto»): the list is ticked, nobody is missing; the teacher looks at the desks and one pupil too many lights
 * amber. On `names` the card goes and «inventory», «enumeration» and «shadow IT» land under the list, the sweep and
 * the disk, each on its word.
 */
export function S02Lista(props: SceneProps) {
  const frame = useCurrentFrame();
  const boughtAt = props.cue('bought');
  const shelfAt = props.cue('shelf');
  const unpatchedAt = props.cue('unpatched');
  const listAt = props.cue('list');
  const sweepAt = props.cue('sweep');
  const extraAt = props.cue('extra');
  const roomAt = props.cue('classroom');
  const namesAt = props.cue('names');
  const cardAt = Math.max(boughtAt + 20, wordFrame(S, 's02-01', 'tarjeta') - 10);
  const sharedAt = wordFrame(S, 's02-01', 'compartir') - 6;
  const strikeAt = UNPATCHED.map((u) => Math.max(unpatchedAt, wordFrame(S, 's02-02', u.word) - 4));
  const comprasAt = wordFrame(S, 's02-02', 'Compras') - 8;
  const pasoAt = wordFrame(S, 's02-02', 'pasó') - 4;
  const ticksFrom = wordFrame(S, 's02-04', 'Pasando') - 4;
  const ticksTo = wordFrame(S, 's02-04', 'falta');
  const lookAt = wordFrame(S, 's02-04', 'sobra') - 6;
  const termAt = {
    inventory: wordFrame(S, 's02-05', 'inventory') - 6,
    enumeration: wordFrame(S, 's02-05', 'enumeration') - 6,
    shadow: wordFrame(S, 's02-05', 'shadow') - 6,
  };
  const seg04 = segment(props, 's02-04');

  // Focus: the classroom card steps the rest back.
  const roomIn = progress(frame, roomAt - 6, 16, EASE.inOut) * (1 - progress(frame, Math.min(namesAt - 4, seg04.to + 6), 14, EASE.inOut));
  const back = 1 - 0.7 * roomIn;

  // Column A
  const stampIn = enter(frame, -6, { distance: 14, duration: 14 });
  const officeIn = progress(frame, -4, 14);
  const cardT = progress(frame, cardAt, 22, EASE.inOut);
  const cardOut = progress(frame, cardAt + 26, 10);
  const running = progress(frame, shelfAt, 10);
  const deskIn = progress(frame, sharedAt - 6, 14);
  const lineDraw = progress(frame, sharedAt, 18);
  const pasoIn = progress(frame, pasoAt, 10);
  const extraIn = progress(frame, extraAt - 4, 12);
  const nasTone = extraIn > 0.5 || pasoIn > 0.5 ? C.rose : C.cyan;

  // Column B
  const doorIn = enter(frame, listAt - 8, { distance: 14, duration: 14 });
  const rowsShown = frame < listAt ? 0 : Math.min(LIST.rows, ((frame - listAt) / Math.max(20, comprasAt + 16 - listAt)) * LIST.rows);
  const doorGlow = progress(frame, listAt, 10) * (1 - progress(frame, comprasAt + 24, 16));

  // Column C
  const netIn = enter(frame, sweepAt - 8, { distance: 16, duration: 14 });
  const sweepFrom = sweepAt + 8;
  const sweepX = progress(frame, sweepFrom, SWEEP_DUR, EASE.linear);
  const litAt = DEVICES.map((_, i) => sweepFrom + Math.round(((cellCentre(i).x - NET.x) / NET.w) * SWEEP_DUR) - 4);
  const sweepOn = frame >= sweepFrom - 2 && frame < sweepFrom + SWEEP_DUR + 8 ? 1 - progress(frame, sweepFrom + SWEEP_DUR, 8) : 0;

  return (
    <Stage>
      <div style={{ position: 'absolute', inset: 0, fontFamily: FONT.sans }}>
        <div style={{ position: 'absolute', inset: 0, opacity: back }}>
          {/* ---------- Column A: the office ---------- */}
          <div style={{ position: 'absolute', left: 0, top: 0, ...stampIn }}>
            <Pill text={CASE_TAG} icon="flag" tone={C.cyan} size={30} height={52} weight={750} on={0.5} />
          </div>
          <div style={{ position: 'absolute', left: 0, top: OFFICE_TOP, width: 560, opacity: officeIn, display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 32, fontWeight: 800, lineHeight: 1.2, color: C.textStrong }}>
            <Icon name="users" size={34} color={C.cyan} />
            <div>
              {OFFICE.map((l) => (
                <div key={l} style={{ whiteSpace: 'nowrap' }}>{l}</div>
              ))}
            </div>
          </div>
          <div style={{ position: 'absolute', left: SHELF.x, top: SHELF.y, opacity: officeIn }}>
            <Shelf width={SHELF.w} />
          </div>
          <div style={{ position: 'absolute', left: NAS_X, top: NAS_Y, opacity: officeIn }}>
            <Nas width={NAS_W} frame={frame} running={running} glow={Math.max(progress(frame, shelfAt, 14) * (1 - progress(frame, unpatchedAt, 20)), extraIn)} tone={nasTone} />
          </div>
          {pasoIn > 0.01 ? (
            <div
              style={{
                position: 'absolute',
                left: NAS_X + NAS_W - 30,
                top: NAS_Y - 24,
                width: 48,
                height: 48,
                borderRadius: 24,
                background: C.roseDeep,
                border: `3px solid ${C.rose}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pasoIn,
                transform: `scale(${0.7 + 0.3 * pasoIn})`,
              }}
            >
              <Icon name="x" size={30} color={C.rose} strokeWidth={3} />
            </div>
          ) : null}
          {/* the payment card */}
          {cardT > 0.001 && cardOut < 0.99 ? (
            <div
              style={{
                position: 'absolute',
                left: mix(-60, NAS_X + NAS_W / 2 - 50, cardT),
                top: mix(NAS_Y - 140, NAS_Y + 40, cardT),
                width: 100,
                height: 64,
                borderRadius: 10,
                background: `linear-gradient(135deg, ${C.sky} 0%, ${C.cyanDeep} 100%)`,
                border: `2px solid ${alpha('#ffffff', 0.5)}`,
                boxShadow: `0 10px 24px ${alpha('#000000', 0.45)}`,
                opacity: 1 - cardOut,
                transform: `rotate(${mix(-18, 0, cardT)}deg)`,
              }}
            >
              <div style={{ position: 'absolute', left: 12, top: 14, width: 22, height: 16, borderRadius: 3, background: C.amber }} />
              <div style={{ position: 'absolute', left: 12, bottom: 12, width: 60, height: 6, borderRadius: 3, background: alpha('#ffffff', 0.6) }} />
            </div>
          ) : null}
          {/* the desks it shares the boarding lists with */}
          {deskIn > 0.01 ? (
            <>
              <svg width={560} height={420} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
                {DESKS.map((x) => (
                  <line
                    key={x}
                    x1={NAS_X + NAS_W - 8}
                    y1={NAS_Y + NAS_H / 2}
                    x2={mix(NAS_X + NAS_W - 8, x + 28, lineDraw)}
                    y2={mix(NAS_Y + NAS_H / 2, DESK_Y + 28, lineDraw)}
                    stroke={alpha(C.cyan, 0.55)}
                    strokeWidth={3}
                    strokeDasharray="8 8"
                    opacity={deskIn}
                  />
                ))}
              </svg>
              {DESKS.map((x) => (
                <div key={x} style={{ position: 'absolute', left: x, top: DESK_Y, opacity: deskIn }}>
                  <Icon name="desktop" size={56} color={C.sky} />
                </div>
              ))}
              <div style={{ position: 'absolute', left: 196, top: SHARED_TOP, opacity: deskIn, transform: `translateY(${(1 - deskIn) * 10}px)` }}>
                <Pill text={SHARED} icon="file" tone={C.cyan} size={30} height={52} on={0.5} />
              </div>
            </>
          ) : null}
          {UNPATCHED.map((u, i) => {
            if (frame < strikeAt[i] - 4) return null;
            const e = enter(frame, strikeAt[i] - 2, { distance: 12, duration: 10 });
            return (
              <div key={u.text} style={{ position: 'absolute', left: 6, top: STRIKE_TOP + i * STRIKE_GAP, ...e }}>
                <Struck text={u.text} strike={progress(frame, strikeAt[i] + 6, 12)} size={32} />
              </div>
            );
          })}

          {/* ---------- Column B: the list and its door ---------- */}
          {frame >= listAt - 10 ? (
            <>
              <div style={{ position: 'absolute', left: DOOR_BOX.x, top: DOOR_BOX.y, ...doorIn }}>
                <svg width={DOOR_BOX.w} height={DOOR_BOX.h} style={{ display: 'block', overflow: 'visible' }}>
                  <rect x={0} y={0} width={DOOR_BOX.w} height={DOOR_BOX.h} rx={6} fill={alpha(C.cyan, 0.08 + 0.18 * doorGlow)} stroke={alpha(C.cyan, 0.5 + 0.4 * doorGlow)} strokeWidth={4} />
                  <rect x={10} y={10} width={DOOR_BOX.w - 20} height={DOOR_BOX.h - 10} rx={4} fill={C.ink800} />
                  <circle cx={DOOR_BOX.w - 20} cy={DOOR_BOX.h / 2 + 8} r={5} fill={C.cyan} />
                </svg>
              </div>
              <div style={{ position: 'absolute', left: DOOR_BOX.x + DOOR_BOX.w + 16, top: 30, ...doorIn, display: 'flex', alignItems: 'center', gap: 12, fontSize: 36, fontWeight: 850, color: C.textStrong }}>
                {DOOR}
                <span style={{ display: 'inline-flex', opacity: doorGlow }}>
                  <Icon name="arrowDown" size={36} color={C.cyan} strokeWidth={2.4} />
                </span>
              </div>
              <div style={{ position: 'absolute', left: LIST.x, top: LIST.y, ...doorIn }}>
                <InventoryList width={LIST.w} rows={LIST.rows} title={LIST_TITLE} shown={rowsShown} />
              </div>
            </>
          ) : null}

          {/* ---------- Column C: the sweep ---------- */}
          {frame >= sweepAt - 10 ? (
            <div style={{ position: 'absolute', left: NET.x, top: NET.y, width: NET.w, height: NET.h, ...netIn }}>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  boxSizing: 'border-box',
                  borderRadius: RADIUS.lg,
                  border: `3px dashed ${alpha(C.sky, 0.55)}`,
                  background: alpha(C.sky, 0.04),
                }}
              />
              <div style={{ position: 'absolute', left: 20, top: 16, display: 'flex', alignItems: 'center', gap: 10, fontSize: 30, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>
                <Icon name="network" size={32} color={C.sky} />
                {NETWORK}
              </div>
              {sweepOn > 0.01 ? (
                <div
                  style={{
                    position: 'absolute',
                    left: 10 + sweepX * (NET.w - 20) - 3,
                    top: 70,
                    width: 6,
                    height: NET.h - 84,
                    borderRadius: 3,
                    background: C.cyan,
                    boxShadow: `0 0 24px ${alpha(C.cyan, 0.8)}`,
                    opacity: sweepOn,
                  }}
                />
              ) : null}
            </div>
          ) : null}
          {frame >= sweepAt - 10
            ? DEVICES.map((d, i) => {
                const c = cellCentre(i);
                const lit = progress(frame, litAt[i], 10);
                const isNas = i === NAS_DEVICE;
                const ok = isNas ? 0 : progress(frame, litAt[i] + 14, 10);
                const red = isNas ? extraIn : 0;
                const tone = red > 0.5 ? C.rose : lit > 0.5 ? C.cyan : alpha(C.sky, 0.55);
                return (
                  <div key={i} style={{ position: 'absolute', left: c.x - 55, top: c.y - 46, width: 110, height: 92, opacity: netIn.opacity }}>
                    {lit > 0.01 ? <div style={{ position: 'absolute', left: -6, top: -8, right: -6, bottom: -8, borderRadius: 20, background: alpha(red > 0.5 ? C.rose : C.cyan, 0.12 * lit + 0.1 * red) }} /> : null}
                    <div style={{ position: 'absolute', left: 0, top: 0, width: 110, height: 92, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {d.icon === 'nas' ? <Nas width={96} frame={frame} tone={tone} running={lit} /> : <Icon name={d.icon} size={66} color={tone} />}
                    </div>
                    {ok > 0.01 ? (
                      <div style={{ position: 'absolute', right: -4, top: -10, opacity: ok }}>
                        <Icon name="check" size={34} color={C.emerald} strokeWidth={3} />
                      </div>
                    ) : null}
                    {red > 0.01 ? (
                      <div style={{ position: 'absolute', right: -6, top: -12, opacity: red }}>
                        <Icon name="alert" size={36} color={C.rose} strokeWidth={2.6} />
                      </div>
                    ) : null}
                  </div>
                );
              })
            : null}
          {/* matching each answer against the list */}
          {frame >= sweepFrom ? (
            <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
              {DEVICES.map((_, i) => {
                const a = progress(frame, litAt[i] + 2, 8) * (1 - progress(frame, litAt[i] + 22, 10));
                if (a <= 0.01) return null;
                const c = cellCentre(i);
                const isNas = i === NAS_DEVICE;
                const ty = LIST.y + inventoryRowY(isNas ? LIST.rows - 1 : (i * 2) % LIST.rows);
                return <line key={i} x1={c.x - 56} y1={c.y} x2={LIST.x + LIST.w + 4} y2={ty} stroke={alpha(isNas ? C.amber : C.cyan, 0.7 * a)} strokeWidth={3} strokeDasharray="6 8" />;
              })}
            </svg>
          ) : null}
          {extraIn > 0.01 ? (
            <div style={{ position: 'absolute', left: NET.x, top: NET.y + NET.h + 18, width: NET.w, display: 'flex', justifyContent: 'center', opacity: extraIn, transform: `translateY(${(1 - extraIn) * 10}px)` }}>
              <Pill text={EXTRA} icon="alert" tone={C.rose} size={29} height={54} on={extraIn} />
            </div>
          ) : null}

          {/* ---------- Names ---------- */}
          {(['inventory', 'enumeration', 'shadow'] as const).map((k) => {
            const at = termAt[k];
            if (frame < at - 2) return null;
            const p = progress(frame, at, 12);
            const centre = k === 'inventory' ? LIST.x + LIST.w / 2 : k === 'enumeration' ? NET.x + NET.w / 2 : NAS_X + NAS_W / 2 + 60;
            const w = 460;
            return (
              <div key={k} style={{ position: 'absolute', left: centre - w / 2, top: TERMS_TOP, width: w, display: 'flex', justifyContent: 'center', opacity: p, transform: `translateY(${(1 - p) * 12}px)` }}>
                <TermPill text={TERMS[k]} on={p} size={38} />
              </div>
            );
          })}
        </div>

        {/* ---------- The classroom card ---------- */}
        {roomIn > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: ROOM.x,
              top: ROOM.y,
              width: ROOM.w,
              height: ROOM.h,
              boxSizing: 'border-box',
              borderRadius: 30,
              background: alpha(C.ink850, 0.96),
              border: `2px solid ${C.ink600}`,
              boxShadow: `0 30px 70px ${alpha('#000000', 0.5)}`,
              opacity: roomIn,
              transform: `scale(${0.95 + 0.05 * roomIn})`,
            }}
          >
            <div style={{ position: 'absolute', left: (ROOM.w - ROOM_ART_W) / 2, top: 40 }}>
              <Classroom width={ROOM_ART_W} ticks={progress(frame, ticksFrom, Math.max(10, ticksTo - ticksFrom), EASE.linear)} look={progress(frame, lookAt, 14)} />
            </div>
            <div style={{ position: 'absolute', left: 0, top: 40 + (ROOM_ART_W * CLASSROOM.h) / CLASSROOM.w + 28, width: ROOM.w, display: 'flex', justifyContent: 'center' }}>
              <ImageTag size={28} />
            </div>
          </div>
        ) : null}
      </div>
    </Stage>
  );
}

