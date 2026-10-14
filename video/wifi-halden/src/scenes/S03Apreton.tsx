import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { mix } from '../../../engine/src/ui';
import { G, S03 } from '../data/s03-apreton';
import { LaptopGlyph } from './parts/Glyphs';
import { Band, ReceivedCounter, SaeTitle } from './parts/s03-apreton/Captions';
import { Exchange } from './parts/s03-apreton/Exchange';
import { Lab } from './parts/s03-apreton/Lab';
import { LabStrip } from './parts/s03-apreton/LabStrip';
import { PadlockGhost, ScenePadlock } from './parts/s03-apreton/Padlocks';
import { Panel } from './parts/s03-apreton/Panel';
import { CaptureFile, CaptureSlots, TriedCounter } from './parts/s03-apreton/PanelBodies';
import { Cassette, TapeRows } from './parts/s03-apreton/Tape';
import { beats } from './parts/s03-apreton/beats';
import { Layer, Txt } from './parts/s03-apreton/bits';
import { Stage } from './kit';

const P = G.panel;
const WIRE_Y = G.laptop.y + 38;

/**
 * s03-apreton «El apretón de manos». An authorised lab test, never an attack: one layout for the whole scene.
 *   start        the lab label read big across the top («prueba autorizada · punto de acceso de pruebas ·
 *                misma configuración que HALDEN-OPS · clave de prueba, corriente a propósito» + WPA2-PSK); under it
 *                the test tablet, the access point on its dock locker and the test laptop, wired to its window
 *                (`ptl-pruebas-02` · «captura», four empty slots).
 *   handshake    the label steps back to a strip. Four numbered messages cross between tablet and access point;
 *                a copy of each slides down the tap into the laptop and fills its slot. Along the bottom,
 *                «apretón de manos», then FOUR-WAY HANDSHAKE.
 *   captured     «captura · 1 handshake» (the «glitch» sound).
 *   offline      the laptop leaves the lab: the window becomes «a casa · sin conexión con la red» (dashed: somewhere
 *                else), the link to the access point is cut.
 *   padlock      the capture becomes a loose combination padlock. «claves probadas» arrives in three uneven jumps to
 *                38.000.000 (no rate can be read from it), OFFLINE, and on the access point «intentos recibidos · 0».
 *   (s03-04)     nothing new: the voice says what WOULD happen; the padlock never opens.
 *   s03-05       «WPA3 personal»: the laptop is back, the exchange is two lanes crossed both ways at once, the copies
 *                it records are blank. On `sealed` (the «lock» sound) the SAME padlock is bolted to the locker; at home
 *                only its dashed outline is left. «· SAE», SIMULTANEOUS AUTHENTICATION OF EQUALS.
 *   one-by-one   three attempts go to the access point, one at a time, and each one shows on its counter.
 *   s03-07       the window becomes «tráfico grabado ayer»: with WPA2, conditional, «si averiguas la clave, la abre»;
 *                with SAE «sigue cerrada»; on `tape`, FORWARD SECRECY (the exam card follows).
 *   still-shared «Sigue siendo una clave para todos», and two more tablets behind the first. Holds.
 */
export function S03Apreton(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = beats(props, frame, fps);

  const screen = 1 - b.home;
  const homeW = b.home * (1 - b.tape);
  const lap = { x: mix(G.laptop.x, G.laptopHome.x, b.away), y: mix(G.laptop.y, G.laptopHome.y, b.away), h: mix(G.laptop.h, G.laptopHome.h, b.away) };
  const recording = Math.max(...b.drops.map((d) => (d > 0 && d < 1 ? 1 : 0)), b.fileGlow);

  return (
    <Stage>
      <Panel screen={screen} home={homeW} tape={b.tape} homeDim={b.ghost} offlineTag={b.offlineTag} offlineLit={b.offlineLit} />
      <CaptureSlots slots={b.slots} opacity={screen} />
      <CaptureFile show={b.fileShow * (1 - b.tape)} tag={b.fileTag} glow={b.fileGlow} dim={b.ghost} />
      <TriedCounter show={b.tried.show * (1 - b.tape)} value={b.tried.value} bump={b.tried.bump} />
      {b.tape > 0.001 ? (
        <div style={{ position: 'absolute', left: P.x + 26, top: P.y + 22, opacity: b.tape }}>
          <Cassette scale={0.7} />
        </div>
      ) : null}
      <TapeRows wpa2={b.tapeWpa2} sae={b.tapeSae} saeLit={b.forwardLit} forward={b.forward} forwardLit={b.forwardLit} />

      <Layer>
        <Lab tablet={b.tablet} moreTablets={b.more} ap={b.ap} apGlow={0.6 * Math.max(b.recvLit, b.sealGlow * 0.5)} cut={homeW} attempts={b.attempts} attemptPath={b.attemptPath} />
        <Exchange msgs={b.msgs} drops={b.drops} wpa2={1 - b.morph} sae={b.morph} pass={b.pass} dropsSae={b.dropsSae} ear={b.ear * (1 - 0.7 * b.away)} />
        {/* the laptop and the wire to its own window */}
        {screen > 0.001 ? (
          <g opacity={screen}>
            <line x1={G.laptop.x + 80} y1={WIRE_Y} x2={P.x} y2={WIRE_Y} stroke={alpha(C.cyan, 0.45)} strokeWidth={3} strokeLinecap="round" />
            <circle cx={P.x} cy={WIRE_Y} r={6} fill={C.cyan} />
          </g>
        ) : null}
        {b.away > 0.001 ? <LaptopGlyph x={G.laptop.x} y={G.laptop.y} h={G.laptop.h} opacity={0.16 * b.away} screen={0} /> : null}
        <LaptopGlyph x={lap.x} y={lap.y} h={lap.h} screen={0.45 + 0.4 * recording} glow={0.5 * recording} />
        <PadlockGhost show={b.ghost} />
        <ScenePadlock show={b.padIn} travel={b.travel} bolted={b.bolted} trying={b.trying} glow={Math.max(0.25 * (1 - b.travel), 0.8 * b.sealGlow, 0.7 * b.hit)} />
      </Layer>

      <LabStrip lit={b.stripLit} big={b.stripBig} wpa3={b.wpa3} sae={b.saeName} protoLit={b.protoLit} />
      <SaeTitle show={b.saeName} lit={b.sealGlow} />
      <Txt x={0} y={G.tablet.y + G.tablet.h / 2 + 12} size={32} color={C.text} opacity={0.6 + 0.4 * b.tablet}>
        {S03.tablet}
      </Txt>
      <Txt x={G.ap.x} y={G.locker.y + G.locker.h + 12} size={32} anchor="center" color={C.text} opacity={0.6 + 0.4 * b.ap}>
        {S03.ap}
      </Txt>
      <Txt x={G.laptop.x - 88} y={G.laptop.y - 31} size={32} anchor="right" color={C.text} opacity={1 - 0.7 * b.away}>
        {S03.laptop}
      </Txt>
      <Txt x={G.laptop.x - 88} y={G.laptop.y + 10} size={24} mono weight={600} anchor="right" color={C.cyanSoft} opacity={1 - 0.7 * b.away}>
        {S03.laptopHost}
      </Txt>
      <ReceivedCounter show={b.recv} value={b.received} lit={b.recvLit} />
      <Band name={b.title * (1 - 0.35 * b.home)} exam={b.exam} examLit={b.examLit} one={b.one} oneLit={b.oneLit} shared={b.shared} />
    </Stage>
  );
}
