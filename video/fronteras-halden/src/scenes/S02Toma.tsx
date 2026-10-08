import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { dimStyle, mix, windowWeight } from '../../../engine/src/ui';
import { CONSOLE, FLOOR_LEGEND, HOST, INSIDE, NOBODY, NOTE, OFFICES, PLAN_CAPTION, STAMP } from '../data/s02-toma';
import { ArrowHead, INK, mixHex } from './parts/glyphs';
import { BlueprintPanel, ZoneBox, zoneBoxContent } from './parts/ZoneRow';
import { PromiseChip } from './parts/s01-hook/Bits';
import { FLOOR_BASE, Floor } from './parts/s02-toma/Floor';
import { DEVICE_TILE, DeviceTile, OfficeNet } from './parts/s02-toma/Offices';
import { ConsoleBar, ConsoleLine, DateStrip, LAPTOP_BASE_H, LAPTOP_BEZEL, Laptop, StickyNote, Wall } from './parts/s02-toma/Room';
import { WallSocket } from './parts/s02-toma/Socket';
import { Stage, segment, wordFrame } from './kit';

const S = 's02-toma';
const W = STAGE.width;
const H = STAGE.height;

// ---- The training room (full size) ----------------------------------------------------------
const WALL = { x: 0, y: 96, w: 600, h: 520 } as const;
const FLOOR_Y = WALL.y + WALL.h;
/** The free socket, wall-local top-left. */
const SOCKET = { x: 230, y: 330, size: 140 } as const;
const SOCKET_C = { x: WALL.x + SOCKET.x + SOCKET.size / 2, y: WALL.y + SOCKET.y + SOCKET.size / 2 };
/** Bottom of the plug once it is in (WallSocket design: plug bottom at 72 of 100 units). */
const PLUG_BOTTOM = WALL.y + SOCKET.y + (SOCKET.size * 72) / 100;
const SCREEN = { x: 700, y: 96, w: 760, h: 360 } as const;
const TABLE_Y = SCREEN.y + SCREEN.h + LAPTOP_BASE_H - 4;
/** Console rows inside the screen (screen-inner px): under the 64-px title bar. */
const ROW1 = 92;
const ROW2 = 174;
const SCREEN_IN = { x: SCREEN.x + LAPTOP_BEZEL + 2, y: SCREEN.y + LAPTOP_BEZEL + 2 };
const NOTE_AT = { x: 1512, y: 300 } as const;
/** The cable: plug → floor → table → the laptop's side. */
const CABLE = [
  { x: SOCKET_C.x, y: PLUG_BOTTOM - 4 },
  { x: SOCKET_C.x, y: FLOOR_Y - 18 },
  { x: 640, y: FLOOR_Y - 18 },
  { x: 640, y: TABLE_Y + 22 },
  { x: SCREEN.x - 34, y: SCREEN.y + SCREEN.h + 22 },
];
const CABLE_D = CABLE.map((p, i) => `${i ? 'L' : 'M'} ${p.x} ${p.y}`).join(' ');

// ---- The floor (s02-04 / s02-05) ------------------------------------------------------------
const FLOOR_W = 1400;
const FLOOR_AT = { x: (W - FLOOR_W) / 2 - 30, y: 236 } as const;
const LEGEND_Y = FLOOR_AT.y + (FLOOR_BASE.h * FLOOR_W) / FLOOR_BASE.w + 22;

// ---- s02-06: today's Oficinas and the plan's internal zone ----------------------------------
const NET = { x: 40, y: 110, w: 620, h: 440 } as const;
const NET_DESKTOPS = [58, 262, 466] as const;
const NET_LAPTOP = { x: 262, y: 262 } as const;
/** Oficinas starts centred and moves left when the plan comes in. */
const NET_X0 = Math.round((W - 620) / 2);
const PANEL = { x: 900, y: 70, w: 800, h: 480 } as const;
const ZONE = { x: 70, y: 84, w: 660, h: 360 } as const;
const ZONE_IN = zoneBoxContent(ZONE.w, ZONE.h, { layout: 'header', zone: 'interna' });
const GHOST = { x: PANEL.x + ZONE.x + ZONE_IN.x + (ZONE_IN.w - DEVICE_TILE) / 2, y: PANEL.y + ZONE.y + ZONE_IN.y + (ZONE_IN.h - DEVICE_TILE) / 2 - 10 };

/**
 * s02-toma «Una toma en la sala de formación».
 *   room       «23-11 · lunes · 09:40 · sala de formación, planta de oficinas» at the top; the training
 *              room's wall with a free socket (it glows on «toma libre»).
 *   plug       the test laptop comes in on its table, screen dark; on «Conectas» the plug goes into the
 *              socket and the cable runs along the floor to the laptop; the screen wakes: the console
 *              `ptl-pruebas-02` prints «enlace: arriba».
 *   lease      «DHCP: 10.20.6.140 · 3 s» (the ding), highlighted; on «oficinas» the analyst's own note,
 *              «VLAN Oficinas», drops onto the table beside the laptop, a chalk arrow to the address line.
 *   nobody     the socket turns amber; «nadie ha preguntado / quién es» on the wall above it.
 *   (intercept) the room shrinks to the bottom, clear of BLIND ARCHITECT's card; on «Date una vuelta» the
 *              office floor replaces it, from above: meeting rooms on «Salas», visitors walking in and out
 *              on «visitas», the free sockets lighting one by one on «tomas»; a legend chip on each word.
 *   inside     «estar dentro del edificio no dice quién eres» over the floor.
 *   s02-06     today's «Oficinas» network with its desktops; the laptop drops into it on «caído»; on
 *              «plan» the blueprint with the internal zone draws on the right (a plan: not running), a
 *              dashed arrow from Oficinas to it, and «la que el plan convertirá en zona interna»; on
 *              «presentarse» the laptop turns amber and its dashed ghost appears inside the zone.
 */
export function S02Toma(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  const roomAt = props.cue('room');
  const plugAt = props.cue('plug');
  const leaseAt = props.cue('lease');
  const nobodyAt = props.cue('nobody');
  const insideAt = props.cue('inside');
  const s03 = segment(props, 's02-03');
  const s04 = segment(props, 's02-04');
  const s06 = segment(props, 's02-06');
  // BLIND ARCHITECT's card types in a silent lead (≥ 3.8 s) before s02-04's audio and stays until its end.
  const icFrom = Math.min(s03.to, s04.from - 114);

  const at = {
    toma: w('s02-01', 'toma'),
    conectas: w('s02-02', 'Conectas'),
    oficinas: w('s02-02', 'oficinas'),
    date: w('s02-04', 'Date'),
    caido: w('s02-06', 'caído'),
    plan: w('s02-06', 'plan'),
    zona: w('s02-06', 'zona'),
    presentarse: w('s02-06', 'presentarse'),
  };
  const legendAt = FLOOR_LEGEND.map((l) => w('s02-04', l.word) - 6);

  // ================= The room =================
  const settle = progress(frame, -12, 20);
  const stripOut = progress(frame, icFrom - 34, 14, EASE.inOut);
  const toLow = progress(frame, icFrom - 26, 24, EASE.inOut);
  const roomOut = progress(frame, at.date - 6, 18, EASE.inOut);
  const roomK = mix(1, 0.62, toLow);
  const socketFree = windowWeight(frame, at.toma - 6, at.conectas, { ramp: 12 });
  const laptopIn = enter(frame, plugAt, { distance: 40, duration: 20, axis: 'x' });
  const plugged = progress(frame, at.conectas - 4, 14);
  const cable = progress(frame, at.conectas + 4, 22, EASE.inOut);
  const screenOn = progress(frame, at.conectas + 22, 10);
  const linkAt = at.conectas + 30;
  const line1 = progress(frame, linkAt, 10);
  const line2 = progress(frame, leaseAt, 10);
  const hot2 = windowWeight(frame, leaseAt, nobodyAt, { ramp: 10 });
  const noteIn = progress(frame, at.oficinas - 4, 16);
  const noteArrow = progress(frame, at.oficinas + 10, 14);
  const nobody = progress(frame, nobodyAt + 2, 16);
  const amberSocket = progress(frame, nobodyAt - 2, 14);
  const socketColor = mixHex(INK.steel, C.amber, amberSocket);
  const socketGlow = Math.max(0.9 * socketFree, 0.8 * amberSocket);

  // ================= The floor =================
  const s06Out = progress(frame, s06.from - 6, 18, EASE.inOut);
  const floorIn = progress(frame, at.date - 2, 20);
  const floorShow = floorIn * (1 - s06Out);
  const rooms = progress(frame, legendAt[0] + 2, 14);
  const visitors = progress(frame, legendAt[1] + 2, 14);
  const sockets = progress(frame, legendAt[2] + 2, 40, EASE.linear);
  const legendLit = (i: number) => progress(frame, legendAt[i], 10) * (1 - 0.5 * progress(frame, (legendAt[i + 1] ?? insideAt) - 2, 12, EASE.inOut));
  const insideIn = enter(frame, insideAt + 2, { distance: 18, duration: 18 });
  const insideShow = (frame >= insideAt ? 1 : 0) * (1 - s06Out);

  // ================= s02-06 =================
  const netIn = progress(frame, s06.from + 2, 18);
  const drop = progress(frame, at.caido - 8, 16);
  const panelIn = progress(frame, at.plan - 8, 18);
  const zoneDraw = progress(frame, at.plan - 2, 26, EASE.inOut);
  const arrow = progress(frame, at.plan + 6, 20, EASE.inOut);
  const caption = progress(frame, at.zona - 4, 16);
  const unasked = progress(frame, at.presentarse - 6, 16);
  const netX = mix(NET_X0, NET.x, progress(frame, at.plan - 14, 22, EASE.inOut));

  const arrowY = NET.y + NET.h / 2 + 40;
  const arrowX0 = NET.x + NET.w + 18;
  const arrowX1 = PANEL.x + ZONE.x - 18;

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      {/* ================= The training room ================= */}
      {roomOut < 1 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, transform: `scale(${roomK})`, transformOrigin: `${W / 2}px ${H}px`, ...dimStyle(0.35 * toLow, settle * (1 - roomOut)) }}>
          <div style={{ position: 'absolute', left: WALL.x, top: WALL.y }}>
            <Wall width={WALL.w} height={WALL.h}>
              <div style={{ position: 'absolute', left: SOCKET.x, top: SOCKET.y }}>
                <WallSocket size={SOCKET.size} color={socketColor} plugged={plugged} cable={2} cableColor={C.cyan} glow={socketGlow} strokeMin={2.6} />
              </div>
              {/* «nadie ha preguntado quién es», on the wall above the socket */}
              {nobody > 0.001 ? (
                <div style={{ position: 'absolute', left: 0, width: WALL.w, top: 70, textAlign: 'center', fontSize: 52, fontWeight: 860, lineHeight: 1.12, color: INK.amberSoft, whiteSpace: 'nowrap', opacity: nobody, transform: `translateY(${(1 - nobody) * 10}px)` }}>
                  {NOBODY.map((l) => (
                    <div key={l}>{l}</div>
                  ))}
                </div>
              ) : null}
            </Wall>
          </div>

          {/* The table */}
          <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <rect x={640} y={TABLE_Y} width={920} height={18} rx={5} fill={C.ink800} stroke={alpha(INK.struct, 0.9)} strokeWidth={2.5} />
            <line x1={690} y1={TABLE_Y + 18} x2={690} y2={FLOOR_Y} stroke={alpha(INK.struct, 0.8)} strokeWidth={6} />
            <line x1={1510} y1={TABLE_Y + 18} x2={1510} y2={FLOOR_Y} stroke={alpha(INK.struct, 0.8)} strokeWidth={6} />
          </svg>

          {/* The cable */}
          {cable > 0.001 ? (
            <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              <path d={CABLE_D} fill="none" stroke={C.cyan} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - cable} />
            </svg>
          ) : null}

          {/* The laptop and its console */}
          <div style={{ position: 'absolute', left: SCREEN.x, top: SCREEN.y, ...laptopIn }}>
            <Laptop width={SCREEN.w} height={SCREEN.h} on={screenOn} glow={0.6 * hot2}>
              <ConsoleBar host={HOST} />
              <div style={{ position: 'absolute', left: 18, top: ROW1 }}>
                <ConsoleLine text={CONSOLE.link} show={line1} />
              </div>
              <div style={{ position: 'absolute', left: 18, top: ROW2 }}>
                <ConsoleLine text={CONSOLE.dhcp} show={line2} hot={hot2} color={C.textStrong} />
              </div>
            </Laptop>
          </div>

          {/* The analyst's note, with a chalk arrow to the address line */}
          {noteArrow > 0.001 ? (
            <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              <path
                d={`M ${NOTE_AT.x - 8} ${NOTE_AT.y + 40} Q ${NOTE_AT.x - 70} ${NOTE_AT.y + 64} ${SCREEN_IN.x + 640} ${SCREEN_IN.y + ROW2 + 40}`}
                fill="none"
                stroke="#f1e7cf"
                strokeWidth={5}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1 - noteArrow}
              />
              {noteArrow > 0.9 ? <ArrowHead x={SCREEN_IN.x + 636} y={SCREEN_IN.y + ROW2 + 38} angle={Math.PI + 0.35} size={20} color="#f1e7cf" /> : null}
            </svg>
          ) : null}
          <div style={{ position: 'absolute', left: NOTE_AT.x, top: NOTE_AT.y }}>
            <StickyNote lines={NOTE} show={noteIn} size={38} rotate={4} />
          </div>
        </div>
      ) : null}

      {/* Date and place (gone before the intercepted message types in) */}
      {stripOut < 1 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, display: 'flex', justifyContent: 'center', ...enter(frame, Math.min(roomAt - 20, 0), { distance: 12, duration: 16 }) }}>
          <DateStrip
            opacity={1 - stripOut}
            parts={[
              <span key="d" style={{ fontFamily: FONT.mono, fontWeight: 800, color: C.cyanSoft }}>{STAMP.day}</span>,
              <span key="w" style={{ fontWeight: 750, color: C.textStrong }}>{STAMP.weekday}</span>,
              <span key="t" style={{ fontFamily: FONT.mono, fontWeight: 800, color: C.cyanSoft }}>{STAMP.time}</span>,
              <span key="p" style={{ fontWeight: 750, color: C.textStrong }}>{STAMP.where}</span>,
            ]}
          />
        </div>
      ) : null}

      {/* ================= The office floor ================= */}
      {floorShow > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, opacity: floorShow }}>
          <div style={{ position: 'absolute', left: FLOOR_AT.x, top: FLOOR_AT.y, transform: `scale(${1.04 - 0.04 * floorIn})`, transformOrigin: 'center' }}>
            <Floor width={FLOOR_W} frame={frame} rooms={rooms} visitors={visitors} sockets={sockets} ours={1} />
          </div>
          <div style={{ position: 'absolute', left: 0, width: W, top: LEGEND_Y, display: 'flex', justifyContent: 'center', gap: 26 }}>
            {FLOOR_LEGEND.map((l, i) =>
              frame >= legendAt[i] - 2 ? (
                <div key={l.text} style={{ ...enter(frame, legendAt[i], { distance: 14 }) }}>
                  <PromiseChip text={l.text} icon={l.icon} lit={legendLit(i)} />
                </div>
              ) : null,
            )}
          </div>
        </div>
      ) : null}

      {/* «estar dentro del edificio no dice quién eres» (after the card has gone) */}
      {insideShow > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, width: W, top: 50, textAlign: 'center', fontSize: 56, fontWeight: 870, letterSpacing: -0.8, color: C.textStrong, whiteSpace: 'nowrap', opacity: insideShow }}>
          <div style={{ ...insideIn }}>
            {INSIDE.lead}
            <span style={{ color: INK.amberSoft }}>{INSIDE.rest}</span>
          </div>
        </div>
      ) : null}

      {/* ================= s02-06: Oficinas today, the internal zone in the plan ================= */}
      {netIn > 0.001 ? (
        <div style={{ position: 'absolute', left: netX, top: NET.y }}>
          <OfficeNet width={NET.w} height={NET.h} name={OFFICES} show={netIn}>
            {NET_DESKTOPS.map((x) => (
              <div key={x} style={{ position: 'absolute', left: x, top: 118 }}>
                <DeviceTile icon="desktop" tone="muted" show={1} />
              </div>
            ))}
            <div style={{ position: 'absolute', left: NET_LAPTOP.x, top: NET_LAPTOP.y }}>
              <DeviceTile icon="laptop" tone={unasked > 0.5 ? 'amber' : 'cyan'} show={drop} glow={Math.max(windowWeight(frame, at.caido - 8, at.plan, { ramp: 12 }), unasked)} />
            </div>
            {drop > 0.001 ? (
              <div style={{ position: 'absolute', left: NET_LAPTOP.x + DEVICE_TILE / 2, top: NET_LAPTOP.y + DEVICE_TILE + 12, transform: 'translateX(-50%)', fontFamily: FONT.mono, fontSize: 32, fontWeight: 750, color: unasked > 0.5 ? INK.amberSoft : C.cyanSoft, whiteSpace: 'nowrap', opacity: drop }}>
                {HOST}
              </div>
            ) : null}
          </OfficeNet>
        </div>
      ) : null}

      {/* The arrow: Oficinas becomes the internal zone (in the plan) */}
      {arrow > 0.001 ? (
        <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <line x1={arrowX0} y1={arrowY} x2={mix(arrowX0, arrowX1, arrow)} y2={arrowY} stroke={INK.skySoft} strokeWidth={6} strokeLinecap="round" strokeDasharray="14 14" />
          {arrow > 0.9 ? <ArrowHead x={arrowX1 + 4} y={arrowY} angle={0} size={24} color={INK.skySoft} /> : null}
        </svg>
      ) : null}

      {panelIn > 0.001 ? (
        <div style={{ position: 'absolute', left: PANEL.x, top: PANEL.y }}>
          <BlueprintPanel width={PANEL.w} height={PANEL.h} draw={panelIn}>
            <div style={{ position: 'absolute', left: ZONE.x, top: ZONE.y }}>
              <ZoneBox zone="interna" width={ZONE.w} height={ZONE.h} layout="header" draw={zoneDraw} />
            </div>
          </BlueprintPanel>
        </div>
      ) : null}

      {/* The laptop, as it would land in the internal zone: unasked */}
      {unasked > 0.001 ? (
        <div style={{ position: 'absolute', left: GHOST.x, top: GHOST.y }}>
          <DeviceTile icon="laptop" tone="amber" dashed show={unasked} glow={0.5 * unasked} />
        </div>
      ) : null}

      {caption > 0.001 ? (
        <div style={{ position: 'absolute', left: PANEL.x, width: PANEL.w, top: PANEL.y + PANEL.h + 18, textAlign: 'center', fontSize: 36, fontWeight: 780, color: INK.skySoft, whiteSpace: 'nowrap', opacity: caption, transform: `translateY(${(1 - caption) * 8}px)` }}>
          {PLAN_CAPTION}
        </div>
      ) : null}
    </Stage>
  );
}
