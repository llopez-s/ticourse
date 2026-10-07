import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { clamp01, dimStyle, mix, windowWeight } from '../../../engine/src/ui';
import { S07 } from '../data/s07-modos';
import { Sites } from './parts/Sites';
import { TruckLoad, TunnelContainer, truckLoadSize, tunnelContainerSize } from './parts/Shipment';
import { Pill } from './parts/s06-ah-esp/marks';
import { TRANSPORT_W, TUNNEL_W, TransportPacket, TunnelPacket } from './parts/s07-modos/schemes';
import { Stage, segment, wordFrame } from './kit';

const S = 's07-modos';
const W = 1728;

// ---- The two sites (opening, during the intercept, and the chapter wrap)
const SITES_W = 1100;
const SITES_X = (W - SITES_W) / 2;
const SITES_Y_OPEN = 226; // below the intercept card (two lines here: stage y 10–194)
const SITES_Y_WRAP = 150;

// ---- Two columns: transport (left), tunnel (right). Transport starts centred.
const COL = [W / 4, (3 * W) / 4] as const;
const TITLE_Y = 0;
const PKT_Y = 126;
const ROUTE_Y = 276;
const IMG_Y = 352;
const TRUCK_W = 520;
const CONT_W = 580;
const RULE_Y = 594;

/**
 * s07-modos «El camión dentro del contenedor».
 *   0 / s07-01  the intercept types out at the top; the two sites sit low (Sites, the corridor with
 *               packets crossing it). On «quién habla con quién» the corridor and its two gateways
 *               light.
 *   transport   the sites leave; «modo transporte», centred: a packet [original header | load]; the
 *               load is ciphered on «cifra», «carga» on «carga», «cabecera original» on «cabecera»
 *               (drawn laptop → server, never an address); «de equipo a equipo» on «equipos».
 *   plates      the truck: the tarp is pulled over the load on «tapada»; on «matrícula» the plate
 *               and the packet's header light together (the plate is the original header).
 *   tunnel      transport slides to the left column; «modo túnel» on the right: the whole original
 *               packet («paquete entero») on «paquete», its header lit on «direcciones»; on «dentro»
 *               the new header «pasarela de la sede / pasarela de la terminal» is put in front, and
 *               on «nuevo» the cipher covers the whole original packet; «de pasarela a pasarela».
 *   container   the same truck drives into a container, the doors shut, the placard shows; on
 *               «pasarelas» the placard and the new header light together. Transport is never
 *               marked wrong: it stays, simply «de equipo a equipo».
 *   s07-06      tunnel in focus; keep: «el túnel se queda en modo túnel» (emerald) at the bottom.
 *   wrap        the schemes give way to the two sites again, the container crossing the corridor
 *               between the gateways; the rule stays. Holds.
 */
export function S07Modos(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  const transportAt = props.cue('transport');
  const platesAt = props.cue('plates');
  const tunnelAt = props.cue('tunnel');
  const containerAt = props.cue('container');
  const keepAt = props.cue('keep');
  const wrapAt = props.cue('wrap');
  const s06 = segment(props, 's07-06');

  const at = {
    quien: w('s07-01', 'quién'),
    cifra: w('s07-02', 'cifra'),
    carga: w('s07-02', 'carga'),
    cabecera: w('s07-02', 'cabecera'),
    equipos: w('s07-02', 'equipos'),
    carga2: w('s07-03', 'carga'),
    matricula: w('s07-03', 'matrícula'),
    paquete: w('s07-04', 'paquete'),
    direcciones: w('s07-04', 'direcciones'),
    dentro: w('s07-04', 'dentro'),
    nuevo: w('s07-04', 'nuevo'),
    pasarela: w('s07-04', 'pasarela'),
    camion: w('s07-05', 'camión'),
    contenedor: w('s07-05', 'contenedor'),
    pasarelas: w('s07-05', 'pasarelas'),
    pasarelas2: w('s07-06', 'pasarelas'),
    tunel: w('s07-06', 'túnel'),
  };

  // ---------------- Opening: the two sites under the intercept
  const sitesOpen = progress(frame, 0, 16) * (1 - progress(frame, transportAt - 10, 14, EASE.inOut));
  const loop = (off: number) => (((frame + off) % 96) + 96) % 96 / 96;
  const openPackets = [loop(0), loop(32), loop(64)];
  const whoGlow = windowWeight(frame, at.quien - 4, transportAt, { ramp: 12 });

  // ---------------- The schemes
  const schemesOut = 1 - progress(frame, wrapAt - 4, 14, EASE.inOut);
  const shift = progress(frame, tunnelAt - 6, 26, EASE.inOut);
  const leftX = mix(W / 2, COL[0], shift);
  // Alone and centred, the transport scheme is drawn a little larger; it settles into its column.
  const tScale = mix(1.12, 1, shift);
  const tDim = 0.35 * progress(frame, tunnelAt + 10, 16) + 0.25 * progress(frame, s06.from - 4, 16);
  const uFocus = progress(frame, s06.from - 4, 16);

  // Transport
  const tTitle = progress(frame, transportAt, 16);
  const tPkt = progress(frame, transportAt + 6, 16);
  const tCipher = progress(frame, at.cifra - 2, 18, EASE.inOut);
  const tCaptions = { payload: progress(frame, at.carga - 4, 12), header: progress(frame, at.cabecera - 4, 12) };
  const plateLink = windowWeight(frame, at.matricula - 4, tunnelAt - 4, { ramp: 10 });
  const tHeaderGlow = Math.max(windowWeight(frame, at.cabecera - 4, at.equipos, { ramp: 10 }), plateLink);
  const tPayloadGlow = windowWeight(frame, at.carga - 4, at.cabecera - 4, { ramp: 10 });
  const tRoute = progress(frame, at.equipos - 4, 14);
  const truck = progress(frame, platesAt - 2, 16);
  const tarp = progress(frame, at.carga2 - 10, 26, EASE.inOut);

  // Tunnel
  const uTitle = progress(frame, tunnelAt + 8, 16);
  const uInner = progress(frame, at.paquete - 4, 14);
  const uInnerHeader = windowWeight(frame, at.direcciones - 4, at.nuevo + 4, { ramp: 10 });
  const uOuter = progress(frame, at.dentro - 4, 16);
  const uCipher = progress(frame, at.nuevo - 2, 20, EASE.inOut);
  const uRoute = progress(frame, at.pasarela - 4, 14);
  const placardLink = windowWeight(frame, at.pasarelas - 4, s06.from + 40, { ramp: 10 }) + windowWeight(frame, at.pasarelas2 - 4, at.pasarelas2 + 50, { ramp: 10 });
  const cont = progress(frame, containerAt - 2, 16);
  const truckIn = mix(0.66, 1, progress(frame, at.camion - 6, Math.max(20, at.contenedor - at.camion + 6), EASE.inOut));
  const doors = progress(frame, at.contenedor + 2, 14, EASE.inOut);
  const placard = progress(frame, at.contenedor + 16, 14);
  const uGlow = 0.6 * windowWeight(frame, at.tunel - 6, wrapAt, { ramp: 12 });

  // Rule + wrap
  const rule = progress(frame, keepAt - 2, 16);
  const ruleGlow = windowWeight(frame, keepAt - 2, keepAt + 50, { ramp: 10 });
  const sitesWrap = progress(frame, wrapAt + 8, 18);
  const wrapLoop = frame > wrapAt ? [((frame - wrapAt) % 120) / 120] : [];

  const tl = truckLoadSize(TRUCK_W);
  const tc = tunnelContainerSize(CONT_W);

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      {/* ================= Opening: the two sites ================= */}
      {sitesOpen > 0.001 ? (
        <div style={{ position: 'absolute', left: SITES_X, top: SITES_Y_OPEN, opacity: sitesOpen }}>
          <Sites width={SITES_W} traffic={0.6} packet={openPackets} focus={{ corridor: whoGlow }} />
        </div>
      ) : null}

      {/* ================= The schemes ================= */}
      {schemesOut > 0.001 && tTitle > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: schemesOut }}>
          {/* ---- Transport (left; centred until `tunnel`) ---- */}
          <div style={{ position: 'absolute', inset: 0, ...dimStyle(tDim), transform: `scale(${tScale})`, transformOrigin: `${leftX}px 0px` }}>
            <ColumnTitle x={leftX} text={S07.transport.title} p={tTitle} />
            <div style={{ position: 'absolute', left: leftX - TRANSPORT_W / 2, top: PKT_Y }}>
              <TransportPacket
                show={tPkt}
                cipher={tCipher}
                headerGlow={tHeaderGlow}
                payloadGlow={tPayloadGlow}
                headerCaption={S07.transport.header}
                payloadCaption={S07.transport.payload}
                captions={tCaptions}
              />
            </div>
            <Centered x={leftX} y={ROUTE_Y}>
              <Pill text={S07.transport.route} tone={C.cyan} p={tRoute} size={38} />
            </Centered>
            {truck > 0.001 ? (
              <div style={{ position: 'absolute', left: leftX - tl.w / 2, top: IMG_Y + 6, opacity: truck, transform: `translateY(${(1 - truck) * 14}px)` }}>
                <TruckLoad width={TRUCK_W} cover={tarp} plateGlow={plateLink} />
              </div>
            ) : null}
          </div>

          {/* ---- Tunnel (right) ---- */}
          <div style={{ position: 'absolute', inset: 0 }}>
            <ColumnTitle x={COL[1]} text={S07.tunnel.title} p={uTitle} glow={uGlow} />
            <div style={{ position: 'absolute', left: COL[1] - TUNNEL_W / 2, top: PKT_Y }}>
              <TunnelPacket
                inner={uInner}
                outer={uOuter}
                cipher={uCipher}
                innerHeaderGlow={uInnerHeader}
                outerGlow={Math.max(clamp01(placardLink), 0.5 * uFocus * windowWeight(frame, at.pasarelas2 - 4, keepAt + 20, { ramp: 10 }))}
                innerCaption={S07.tunnel.inner}
                innerCaptionP={uInner}
                outerLines={S07.tunnel.outer}
              />
            </div>
            <Centered x={COL[1]} y={ROUTE_Y}>
              <Pill text={S07.tunnel.route} tone={C.cyan} p={uRoute} size={38} glow={0.5 * uFocus} />
            </Centered>
            {cont > 0.001 ? (
              <div style={{ position: 'absolute', left: COL[1] - tc.w / 2 + 40, top: IMG_Y + 12, opacity: cont, transform: `translateY(${(1 - cont) * 14}px)` }}>
                <TunnelContainer width={CONT_W} truckIn={truckIn} doors={doors} label={placard} labelGlow={clamp01(placardLink)} glow={0.4 * uFocus} />
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* ================= Wrap: the two sites again, the container in the corridor ================= */}
      {sitesWrap > 0.001 ? (
        <div style={{ position: 'absolute', left: SITES_X, top: SITES_Y_WRAP, opacity: sitesWrap }}>
          <Sites width={SITES_W} traffic={0.6} packet={wrapLoop} cargo={(s) => <TunnelContainer width={200 * s} />} focus={{ corridor: 0.6 * sitesWrap }} />
        </div>
      ) : null}

      {/* ================= The rule ================= */}
      <Centered x={W / 2} y={RULE_Y}>
        <Pill text={S07.keep} tone={C.emerald} icon="check" p={rule} size={42} glow={ruleGlow} />
      </Centered>
    </Stage>
  );
}

function ColumnTitle({ x, text, p, glow = 0 }: { x: number; text: string; p: number; glow?: number }) {
  const v = clamp01(p);
  if (v <= 0.001) return null;
  const g = clamp01(glow);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: TITLE_Y,
        transform: `translate(-50%, ${(1 - v) * 10}px)`,
        opacity: v,
        fontSize: 48,
        fontWeight: 860,
        color: C.cyanSoft,
        whiteSpace: 'nowrap',
        textShadow: g > 0.01 ? `0 0 ${Math.round(18 * g)}px ${alpha(C.cyan, 0.7 * g)}` : undefined,
      }}
    >
      {text}
    </div>
  );
}

function Centered({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return <div style={{ position: 'absolute', left: x, top: y, transform: 'translateX(-50%)' }}>{children}</div>;
}

