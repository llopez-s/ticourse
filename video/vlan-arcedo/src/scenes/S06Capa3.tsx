import { useCurrentFrame } from 'remotion';
import type { ReactNode } from 'react';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { clamp01, mix } from '../../../engine/src/ui';
import { ART_WALL, DIAG, LABELS, SPOT } from '../data/s06-capa3';
import { vlan } from '../data/vlans';
import { ART_H, ART_W, Illustration, Pin, Region } from './parts/Illustration';
import { Device, FrameGlyph } from './parts/Net';
import { ImageTag, Rotulo } from './parts/Tags';
import { VlanRow } from './parts/VlanRow';
import { Stage, wordFrame } from './kit';

const S = 's06-capa3';
const W = STAGE.width;

// ---- The wall art: a wide plate across the stage, cropped through the desks, the door and the racks.
const PLATE = { w: W, h: 452 } as const;
const FOCUS = { x: 0.5, y: 0.42 } as const;
/** The door's opening on the art (image fractions), outlined while the voice says it is missing. */
const DOOR_BOX = [0.433, 0.398, 0.498, 0.678] as const;

// ---- The text band under the plate: one thing at a time (VLANs and gateways, then SVI, then the two rules).
const ROW_W = 840;
const COL_X = [0, W - ROW_W] as const;
const BAND_Y = [478, 548] as const;

const U = vlan(10);
const SV = vlan(20);

const at = (p: { u: number; v: number }) => ({ x: p.u * ART_W, y: p.v * ART_H });
const between = (a: { u: number; v: number }, b: { u: number; v: number }, t: number) => ({ u: mix(a.u, b.u, t), v: mix(a.v, b.v, t) });

/** An opaque ground under a tile: a lit <Device> is translucent, and the art (its pink rack light) must not show through. */
function Solid({ size, children }: { size: number; children: ReactNode }) {
  return <div style={{ width: size, height: size, borderRadius: 12, background: C.ink900 }}>{children}</div>;
}

/**
 * s06-capa3 «La puerta». Top: the glass partition with its single door (art, tagged «imagen · no es el Consorcio»,
 * as a one-hue plate so its amber lights do not read as the Voz VLAN). On it, drawn in code: a Usuarios workstation (cyan)
 * and a server (emerald); a frame sets off from the workstation and stops at the partition (`wall`). On `l3` a device
 * sits in the door, «capa 3 · mira direcciones IP», and the way through is drawn. Bottom band, one thing at a time:
 * the two VLANs with their subnets and, on `gw`, one gateway each («puerta de enlace · 10.20.10.1» / «…20.1»); on
 * `svi` what does it in the headquarters, with the small-network aside; on `diag` / `diag2` the two troubleshooting
 * lines, while the picture steps back for the first (the trunk is not in it) and returns for the second (the door).
 */
export function S06Capa3(props: SceneProps) {
  const frame = useCurrentFrame();
  const l3At = props.cue('l3');
  const gwAt = props.cue('gw');
  const sviAt = props.cue('svi');
  const diagAt = props.cue('diag');
  const diag2At = props.cue('diag2');
  const doorAt = wordFrame(S, 's06-01', 'Falta') - 4;
  const deskAt = wordFrame(S, 's06-01', 'puestos') - 4;
  const serverAt = wordFrame(S, 's06-01', 'servidores') - 4;
  const labelAt = wordFrame(S, 's06-02', 'equipo') - 6;
  const subnetAt = wordFrame(S, 's06-03', 'subred') - 6;
  const gatewayAt = wordFrame(S, 's06-03', 'puerta') - 6;
  const handAt = wordFrame(S, 's06-03', 'entrega') - 6;
  const virtualAt = wordFrame(S, 's06-04', 'interfaz') - 6;
  const smallAt = wordFrame(S, 's06-04', 'VLAN') + 14;
  const look1At = wordFrame(S, 's06-05', 'mira') - 6;
  const look2At = wordFrame(S, 's06-06', 'mira') - 6;

  // ---- On the art.
  // Both ends are on the picture from the first frame (the server's tile also covers the art's pink light); each
  // lights on its word.
  const deskIn = progress(frame, -4, 14);
  const serverIn = progress(frame, 0, 14);
  const doorMark = progress(frame, doorAt, 12) * (1 - progress(frame, l3At - 8, 10, EASE.inOut));
  const wayA = progress(frame, deskAt + 10, 36, EASE.inOut);
  const wayB = progress(frame, labelAt + 4, 30, EASE.inOut);
  const l3In = enter(frame, l3At - 4, { distance: 14 });
  const l3Label = enter(frame, labelAt, { distance: 12 });
  const l3Live =
    progress(frame, labelAt, 10) * (1 - 0.7 * progress(frame, gwAt - 6, 14, EASE.inOut)) +
    0.8 * progress(frame, gatewayAt, 10) * (1 - progress(frame, sviAt + 60, 30, EASE.inOut)) +
    progress(frame, look2At, 10);

  // The frame: first it reaches the partition and waits; on «le entrega» it goes all the way.
  const try1 = progress(frame, deskAt + 46, 30, EASE.inOut);
  const try1Out = progress(frame, l3At - 12, 10, EASE.inOut);
  const leg1 = progress(frame, handAt, 26, EASE.inOut);
  const leg2 = progress(frame, handAt + 30, 28, EASE.inOut);
  const arrived = progress(frame, handAt + 56, 8) * (1 - progress(frame, handAt + 80, 30, EASE.inOut));
  const trip = frame >= handAt && frame < handAt + 66;
  const tripPos = leg1 < 1 ? between(SPOT.desk, SPOT.door, leg1) : between(SPOT.door, SPOT.server, leg2);

  // The picture steps back for the first rule (the trunk is not in it) and returns for the second.
  const plateDim = 0.55 * progress(frame, diagAt - 6, 18, EASE.inOut) * (1 - progress(frame, diag2At - 8, 18, EASE.inOut));

  // ---- The band.
  const rowsOut = 1 - progress(frame, sviAt - 12, 10, EASE.inOut);
  const sviOut = 1 - progress(frame, diagAt - 12, 10, EASE.inOut);
  const rowOn = (start: number) => progress(frame, start, 10) * (1 - progress(frame, start + 50, 24, EASE.inOut));
  const gatewayLive = progress(frame, gatewayAt, 10) * (1 - 0.5 * progress(frame, handAt + 60, 20, EASE.inOut));

  const d = at(SPOT.desk);
  const o = at(SPOT.door);
  const s = at(SPOT.server);

  return (
    <Stage>
      {/* ------------------------------------------------ the partition and its door (art) */}
      <div style={{ position: 'absolute', left: 0, top: 0, ...enter(frame, -6, { distance: 16, duration: 16 }) }}>
        <Illustration
          src={ART_WALL}
          width={PLATE.w}
          height={PLATE.h}
          focus={FOCUS}
          mono
          zoom={{ to: 1.03, start: 0, end: sviAt }}
          zoomOrigin={{ x: SPOT.door.u, y: SPOT.door.v }}
          dim={plateDim}
          overlay={
            <div style={{ position: 'absolute', left: 14, bottom: 14 }}>
              <ImageTag />
            </div>
          }
        >
          {/* the way: workstation to the partition, then (once the device is in the door) on to the server */}
          <svg viewBox={`0 0 ${ART_W} ${ART_H}`} preserveAspectRatio="none" style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}>
            {wayA > 0.01 ? (
              <line x1={d.x} y1={d.y} x2={mix(d.x, o.x, wayA)} y2={mix(d.y, o.y, wayA)} stroke={alpha(U.tone, 0.9)} strokeWidth={9} strokeDasharray="30 18" strokeLinecap="round" />
            ) : null}
            {wayB > 0.01 ? (
              <line x1={o.x} y1={o.y} x2={mix(o.x, s.x, wayB)} y2={mix(o.y, s.y, wayB)} stroke={alpha(SV.tone, 0.9)} strokeWidth={9} strokeDasharray="30 18" strokeLinecap="round" />
            ) : null}
          </svg>

          {/* «falta la puerta»: the door of the picture, outlined until the device takes its place */}
          {doorMark > 0.01 ? (
            <Region box={DOOR_BOX} style={{ borderRadius: 10, border: `4px dashed ${alpha(C.sky, 0.95 * doorMark)}`, background: alpha(C.sky, 0.12 * doorMark) }} />
          ) : null}

          {/* the workstation of Usuarios */}
          {deskIn > 0.01 ? (
            <>
              <Pin u={SPOT.desk.u} v={SPOT.desk.v} style={{ opacity: deskIn }}>
                <Solid size={72}>
                  <Device icon="desktop" tone={U.tone} size={72} on={0.15 + 0.85 * rowOn(deskAt)} />
                </Solid>
              </Pin>
              <Pin u={SPOT.desk.u - 0.028} v={SPOT.desk.v} align="right" style={{ opacity: deskIn }}>
                <Rotulo tone={U.tone} size={26}>
                  {LABELS.desk}
                </Rotulo>
              </Pin>
            </>
          ) : null}

          {/* the server, on the other side */}
          {serverIn > 0.01 ? (
            <>
              <Pin u={SPOT.server.u} v={SPOT.server.v} style={{ opacity: serverIn }}>
                <Solid size={72}>
                  <Device icon="server" tone={SV.tone} size={72} on={clamp01(0.15 + 0.85 * rowOn(serverAt) + arrived)} />
                </Solid>
              </Pin>
              <Pin u={SPOT.server.u} v={SPOT.server.v + 0.046} align="top" style={{ opacity: serverIn }}>
                <Rotulo tone={SV.tone} size={26}>
                  {LABELS.server}
                </Rotulo>
              </Pin>
            </>
          ) : null}

          {/* the layer-3 device, in the door */}
          {frame >= l3At - 6 ? (
            <Pin u={SPOT.door.u} v={SPOT.door.v}>
              <div style={l3In}>
                <Solid size={88}>
                  <Device icon="layers" tone={C.sky} size={88} on={clamp01(0.3 + 0.7 * l3Live)} />
                </Solid>
              </div>
            </Pin>
          ) : null}
          {frame >= labelAt - 2 ? (
            <Pin u={SPOT.door.u} v={SPOT.door.v + 0.058} align="top">
              <div style={l3Label}>
                <Rotulo tone={C.sky} size={32} on={clamp01(l3Live)}>
                  {LABELS.l3}
                </Rotulo>
              </div>
            </Pin>
          ) : null}

          {/* the frame */}
          {try1 > 0.01 && try1Out < 0.99 ? (
            <Pin {...between(SPOT.desk, SPOT.door, 0.16 + 0.7 * try1)} style={{ opacity: Math.min(1, try1 * 4) * (1 - try1Out) }}>
              <FrameGlyph width={60} height={26} tone={C.cyanSoft} glow={0.8} />
            </Pin>
          ) : null}
          {trip ? (
            <Pin {...tripPos} style={{ opacity: Math.min(1, leg1 * 5) * (1 - progress(frame, handAt + 58, 8)) }}>
              <FrameGlyph width={60} height={26} tone={C.cyanSoft} glow={0.8} />
            </Pin>
          ) : null}
        </Illustration>
      </div>

      {/* ------------------------------------------------ band: the two VLANs, then one gateway each */}
      {rowsOut > 0.01
        ? [U, SV].map((v, k) => {
            const lit = k === 0 ? deskAt : serverAt;
            return (
              <div key={v.id} style={{ position: 'absolute', left: COL_X[k], top: BAND_Y[0], opacity: rowsOut }}>
                <div style={enter(frame, k * 5, { distance: 14 })}>
                  <VlanRow v={v} width={ROW_W} on={clamp01(rowOn(lit) + rowOn(gwAt + k * 6) + rowOn(subnetAt + k * 6))} />
                </div>
              </div>
            );
          })
        : null}
      {rowsOut > 0.01 && frame >= gatewayAt - 2
        ? [U, SV].map((v, k) => (
            <div key={v.id} style={{ position: 'absolute', left: COL_X[k], top: BAND_Y[1], opacity: rowsOut }}>
              <div style={enter(frame, gatewayAt + k * 6, { distance: 14 })}>
                <Rotulo tone={v.tone} size={34} on={gatewayLive}>
                  <span>{LABELS.gateway} ·</span>
                  <span style={{ fontFamily: FONT.mono, fontWeight: 700, color: v.tone }}>{v.gateway}</span>
                </Rotulo>
              </div>
            </div>
          ))
        : null}

      {/* ------------------------------------------------ band: who does it in the headquarters */}
      {frame >= sviAt - 2 && sviOut > 0.01 ? (
        <>
          <div style={{ position: 'absolute', left: 0, top: BAND_Y[0], width: W, display: 'flex', justifyContent: 'center', opacity: sviOut }}>
            <div style={enter(frame, sviAt, { distance: 14 })}>
              <Rotulo tone={C.sky} size={32} icon="layers" on={progress(frame, sviAt, 10)}>
                <span>{LABELS.sviWho} ·</span>
                <span style={{ color: C.text, opacity: 0.3 + 0.7 * progress(frame, virtualAt, 12) }}>{LABELS.sviWhat}</span>
              </Rotulo>
            </div>
          </div>
          {frame >= smallAt - 2 ? (
            <div style={{ position: 'absolute', left: 0, top: BAND_Y[1] + 4, width: W, display: 'flex', justifyContent: 'center', opacity: sviOut }}>
              <div style={enter(frame, smallAt, { distance: 12 })}>
                <Rotulo tone={C.muted} size={26}>
                  <span style={{ color: C.text, fontWeight: 650 }}>{LABELS.small}</span>
                </Rotulo>
              </div>
            </div>
          ) : null}
        </>
      ) : null}

      {/* ------------------------------------------------ band: the two troubleshooting lines */}
      {DIAG.map((line, k) => {
        const start = k === 0 ? diagAt : diag2At;
        const lookAt = k === 0 ? look1At : look2At;
        if (frame < start - 2) return null;
        const live = progress(frame, start, 10) * (k === 0 ? 1 - 0.6 * progress(frame, diag2At - 6, 14, EASE.inOut) : 1);
        return (
          <div key={k} style={{ position: 'absolute', left: 0, top: BAND_Y[k] + (k === 1 ? 6 : 0), width: W, display: 'flex', justifyContent: 'center' }}>
            <div style={enter(frame, start, { distance: 14 })}>
              <Rotulo tone={C.sky} size={36} icon="search" on={live}>
                <span>{line.when}</span>
                <span style={{ color: C.cyanSoft, fontWeight: 850, opacity: 0.3 + 0.7 * progress(frame, lookAt, 12) }}>{line.look}</span>
              </Rotulo>
            </div>
          </div>
        );
      })}
    </Stage>
  );
}
