import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { clamp01, mix } from '../../../engine/src/ui';
import { ClipPlate } from '../../../engine/src/ui/Illustration';
import { LAYER } from '../data/case';
import { ANALOGY, ART_YARD, ART_YARD_END, CARD, CLIP_MOVE_FROM, CLIP_YARD, HOP, LABELS } from '../data/s04-arp';
import { Device } from './parts/Net';
import { ImageTag } from './parts/Tags';
import { CARD_W, FRM, FRM_H, FRM_W, FrameCard, FrameShell, Lines, PKT, Packet } from './parts/s04-arp/bits';
import { Stage, wordFrame } from './kit';

const S = 's04-arp';
const W = STAGE.width;
const H = STAGE.height;
const CYAN = LAYER.frame.tone;
const AMBER = LAYER.packet.tone;

// ---- Beat 1 (code): the half-written frame on top, the subnet below.
const CARD_X = Math.round((W - CARD_W) / 2);
const SUB = { x: 0, y: 206, w: 1060, h: 398 } as const;
const HOSTP = { x: 130, y: 352, size: 84 } as const;
const PEERS = [
  { x: 420, y: 296 },
  { x: 640, y: 312 },
  { x: 860, y: 290 },
] as const;
const PEER_SIZE = 64;
const GWP = { x: SUB.x + SUB.w, y: 424, size: 96 } as const;
const CPD = { x: 1324, y: 206, w: W - 1324, h: 398 } as const;
const SRVP = { x: CPD.x + CPD.w / 2, y: 392, size: 84 } as const;
const BUBBLE = { x: 18, y: 474 } as const;
const ARP_BOX = { x: 1176, y: 206 } as const;

// ---- Beat 2 (art): the warehouse plate, the analogy read back on the right.
const PLATE = { x: 0, y: 0, w: Math.round(H * (2752 / 1536)), h: H } as const;
const COL_X = PLATE.w + 34;

// ---- Beat 3 (code): the hop at the gateway.
const BAND = { x: 330, y: 56, w: FRM_W + 80, h: 440 } as const;
const IN_X = BAND.x + 40;
const IN_Y = BAND.y + 96;

const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);

/** Broadcast rings from the host, clipped to its subnet. `starts` are scene-local frames. */
function Rings({ frame, starts }: { frame: number; starts: number[] }) {
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
      <defs>
        <clipPath id="s04-subnet">
          <rect x={SUB.x} y={SUB.y} width={SUB.w} height={SUB.h} rx={RADIUS.lg} />
        </clipPath>
      </defs>
      <g clipPath="url(#s04-subnet)">
        {starts.map((s) => {
          const p = progress(frame, s, 66, EASE.linear);
          if (p <= 0 || p >= 1) return null;
          return <circle key={s} cx={HOSTP.x} cy={HOSTP.y} r={mix(40, 1080, p)} fill="none" stroke={alpha(CYAN, 0.75 * (1 - p))} strokeWidth={5} />;
        })}
      </g>
    </svg>
  );
}

/** How lit a device at distance `d` is, as rings pass it. */
function ringHit(frame: number, starts: number[], d: number) {
  let v = 0;
  for (const s of starts) {
    const p = progress(frame, s, 66, EASE.linear);
    if (p <= 0 || p >= 1) continue;
    const r = mix(40, 1080, p);
    v = Math.max(v, 1 - Math.min(1, Math.abs(r - d) / 90));
  }
  return v;
}

function Small({ children, color = C.muted, size = 26 }: { children: string; color?: string; size?: number }) {
  return <div style={{ fontFamily: FONT.sans, fontSize: size, fontWeight: 650, color, whiteSpace: 'nowrap' }}>{children}</div>;
}

/**
 * s04-arp «Una pregunta en voz alta», in three beats.
 * 1 (code) `need` … `two`: on top, the frame being written — «MAC de destino» empty, «IP de destino 10.20.72.10» in
 *   its amber packet. Below, the host's subnet. `ask`: rings of a broadcast fill the subnet, with «petición · destino
 *   ff:ff:ff:ff:ff:ff · ¿quién tiene 10.20.10.x?»; `arp`: the ARP label on the right; `limit`: the rings stop at the
 *   subnet's edge, where a device marked only «capa 3» sits; `outside`: the CPD's subnet and the server; `gw`: the
 *   question becomes «¿quién tiene 10.20.10.1?» and the edge device is named «puerta de enlace · capa 3»; `reply`: a
 *   unicast answer back to the host's MAC, which fills the empty slot; `two`: both destinations lit on the frame.
 * 2 (art) `van`: the warehouse (tagged «imagen · no es el Consorcio»); the clip moves the box into the white van on
 *   «la caja cambia de furgoneta», and rests on the end still. Right: «furgoneta · trama», «caja · paquete».
 * 3 (code) `hop`: at the gateway the frame that arrived is dropped, the packet gets «TTL −1» and the same IPs, and a
 *   new frame wraps it: «MAC de origen: la de la puerta de enlace · MAC de destino: la del siguiente salto».
 * «red interna, sin traducción de direcciones (NAT)» stays small at the bottom from `outside` on.
 */
export function S04Arp(props: SceneProps) {
  const frame = useCurrentFrame();
  const needAt = props.cue('need');
  const askAt = props.cue('ask');
  const arpAt = props.cue('arp');
  const limitAt = props.cue('limit');
  const outsideAt = props.cue('outside');
  const gwAt = props.cue('gw');
  const replyAt = props.cue('reply');
  const twoAt = props.cue('two');
  const vanAt = props.cue('van');
  const hopAt = props.cue('hop');

  const slotAt = Math.max(needAt, wordFrame(S, 's04-01', 'MAC') - 4);
  // The rings start with the cue's whoosh.
  const ringsAt = askAt;
  const bubbleAt = wordFrame(S, 's04-02', 'quien') - 8;
  const subnetAt = wordFrame(S, 's04-02', 'subred') - 6;
  const stopAt = wordFrame(S, 's04-03', 'ningun') - 6;
  const askGwAt = wordFrame(S, 's04-04', 'pregunta', 1) - 4;
  const gwLabelAt = wordFrame(S, 's04-04', 'puerta') - 8;
  const fillAt = replyAt + 34;
  // The clip's box starts moving CLIP_MOVE_FROM frames in: start it so that the move lands on «la caja cambia».
  const clipAt = wordFrame(S, 's04-06', 'caja') - CLIP_MOVE_FROM + 4;
  const boxLabelAt = wordFrame(S, 's04-06', 'caja') - 6;
  // The end still holds through «Eso hace el encaminador», then the hop takes over just before «Tira».
  const artOutAt = Math.max(hopAt + 24, wordFrame(S, 's04-07', 'Tira') - 16);
  const dropAt = wordFrame(S, 's04-07', 'Tira') - 2;
  const meteAt = wordFrame(S, 's04-07', 'mete') - 6;
  const sameAt = wordFrame(S, 's04-07', 'sin') - 4;

  // ---- Beat 1.
  const diagramOut = 1 - progress(frame, vanAt - 16, 14, EASE.inOut);
  const two = progress(frame, twoAt, 16);
  const netDim = 1 - 0.55 * two;
  const slot = progress(frame, slotAt, 12) * (0.6 + 0.4 * Math.sin((frame - slotAt) / 6) ** 2) * (1 - progress(frame, fillAt, 8));
  const fill = progress(frame, fillAt, 26, EASE.linear);

  const ringStarts: number[] = [];
  for (let s = ringsAt; s < limitAt + 40; s += 24) ringStarts.push(s);
  for (let k = 0; k < 3; k++) ringStarts.push(askGwAt + k * 24);

  const subnetOn = progress(frame, subnetAt, 14) * (1 - 0.6 * progress(frame, arpAt, 14, EASE.inOut));
  const bubble = enter(frame, bubbleAt, { distance: 16 });
  const bubbleOut = 1 - progress(frame, replyAt + 20, 12, EASE.inOut);
  const askSwap = progress(frame, gwAt, 14, EASE.inOut);
  const arpBox = progress(frame, arpAt, 14) * (1 - progress(frame, outsideAt - 14, 12, EASE.inOut));
  const stop = progress(frame, stopAt, 14) * (1 - 0.6 * progress(frame, outsideAt, 20, EASE.inOut));
  const layer3 = progress(frame, limitAt, 12) * (1 - progress(frame, gwLabelAt - 2, 8));
  const gwLabel = progress(frame, gwLabelAt, 14);
  const cpd = progress(frame, outsideAt, 18);
  const srvDim = 1 - 0.5 * progress(frame, gwAt + 10, 20, EASE.inOut);
  const gwLit = Math.max(layer3 * 0.6, gwLabel);
  const replyDraw = progress(frame, replyAt, 30, EASE.inOut);
  const replyLabel = enter(frame, replyAt + 22, { distance: 14 });
  const replyLive = 1 - 0.5 * progress(frame, twoAt, 14, EASE.inOut);

  // ---- Beat 2.
  const plateIn = enter(frame, vanAt - 6, { distance: 30, duration: 20, axis: 'x' });
  const artOut = 1 - progress(frame, artOutAt, 14, EASE.inOut);
  const vanRow = enter(frame, vanAt + 4, { distance: 16 });
  const boxRow = enter(frame, boxLabelAt, { distance: 16 });
  const vanLive = 1 - 0.6 * progress(frame, boxLabelAt, 12, EASE.inOut);

  // ---- Beat 3.
  const hopIn = progress(frame, artOutAt + 6, 16);
  const arrive = progress(frame, artOutAt + 6, 26, EASE.out);
  const drop = progress(frame, dropAt, 30, EASE.inOut);
  const ttlOn = progress(frame, dropAt + 24, 12);
  const fresh = progress(frame, meteAt, 18);
  const freshLabel = enter(frame, meteAt + 10, { distance: 14 });
  const same = progress(frame, sameAt, 14);
  const nat = progress(frame, outsideAt + 20, 14) * (1 - progress(frame, vanAt - 16, 12)) + progress(frame, meteAt, 14);

  // The host lights when it sends the question and when the answer reaches it.
  const hostLit = Math.max(progress(frame, ringsAt, 8) * (1 - progress(frame, ringsAt + 20, 16)), progress(frame, replyAt + 26, 8) * (1 - progress(frame, replyAt + 60, 20)));

  return (
    <Stage>
      {/* ------------------------------------------------ beat 1: the frame and the subnet (code) */}
      {diagramOut > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, opacity: diagramOut }}>
          {/* the frame being written */}
          <div style={{ position: 'absolute', left: CARD_X, top: 0, ...enter(frame, -20, { distance: 16 }) }}>
            <FrameCard t={CARD} slot={slot} fill={fill} two={two} />
          </div>

          <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, opacity: netDim }}>
            {/* the host's subnet */}
            <div
              style={{
                position: 'absolute',
                left: SUB.x,
                top: SUB.y,
                width: SUB.w,
                height: SUB.h,
                boxSizing: 'border-box',
                borderRadius: RADIUS.lg,
                border: `3px dashed ${alpha(CYAN, 0.35 + 0.45 * subnetOn)}`,
                background: alpha(CYAN, 0.03 + 0.04 * subnetOn),
                ...enter(frame, -20, { distance: 12 }),
              }}
            />
            {frame >= subnetAt - 2 ? (
              <div style={{ position: 'absolute', left: SUB.x + 20, top: SUB.y + 14, opacity: progress(frame, subnetAt, 14) }}>
                <div style={{ fontFamily: FONT.sans, fontSize: 32, fontWeight: 750, color: subnetOn > 0.6 ? C.textStrong : C.cyanSoft, whiteSpace: 'nowrap' }}>{LABELS.subnet}</div>
              </div>
            ) : null}

            {/* the edge of the subnet, where the rings stop */}
            {stop > 0.01 ? (
              <div style={{ position: 'absolute', left: SUB.x + SUB.w - 4, top: SUB.y + 8, width: 8, height: SUB.h - 16, borderRadius: 4, background: alpha(C.sky, 0.9 * stop), boxShadow: `0 0 ${Math.round(26 * stop)}px ${alpha(C.sky, 0.7 * stop)}` }} />
            ) : null}

            <Rings frame={frame} starts={ringStarts} />

            {/* the other machines of the subnet: no names, no addresses */}
            {PEERS.map((p, i) => (
              <div key={i} style={{ position: 'absolute', left: p.x - PEER_SIZE / 2, top: p.y - PEER_SIZE / 2, opacity: progress(frame, -20 + i * 4, 12) }}>
                <Device icon="desktop" tone={C.sky} size={PEER_SIZE} on={0.15 + 0.85 * ringHit(frame, ringStarts, dist(p, HOSTP))} />
              </div>
            ))}

            {/* the host */}
            <div style={{ position: 'absolute', left: HOSTP.x - HOSTP.size / 2, top: HOSTP.y - HOSTP.size / 2, opacity: progress(frame, -20, 12) }}>
              <Device icon="desktop" tone={CYAN} size={HOSTP.size} on={0.45 + 0.55 * hostLit} />
            </div>
            <div style={{ position: 'absolute', left: HOSTP.x - HOSTP.size / 2 - 6, top: HOSTP.y + HOSTP.size / 2 + 10, opacity: progress(frame, -20, 12) }}>
              <div style={{ fontFamily: FONT.sans, fontSize: 32, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap' }}>{LABELS.host}</div>
            </div>

            {/* the device on the edge: only its layer, then its role — never what it is */}
            <div style={{ position: 'absolute', left: GWP.x - GWP.size / 2, top: GWP.y - GWP.size / 2, opacity: progress(frame, -20, 12) }}>
              <Device icon="layers" tone={C.sky} size={GWP.size} on={0.2 + 0.8 * Math.max(gwLit * (1 - 0.4 * two), ringHit(frame, ringStarts, dist(GWP, HOSTP)))} />
            </div>
            {layer3 > 0.01 ? (
              <div style={{ position: 'absolute', left: GWP.x - 200, top: GWP.y + GWP.size / 2 + 12, width: 400, display: 'flex', justifyContent: 'center', opacity: layer3 }}>
                <Lines lines={[LABELS.layer3]} tone={C.sky} on={1} size={34} />
              </div>
            ) : null}
            {gwLabel > 0.01 ? (
              <div style={{ position: 'absolute', left: GWP.x - 260, top: GWP.y + GWP.size / 2 + 12, width: 520, display: 'flex', justifyContent: 'center', ...enter(frame, gwLabelAt, { distance: 12 }) }}>
                <Lines head={LABELS.gw[0]} lines={[LABELS.gw[1]]} tone={C.sky} on={1 - 0.5 * progress(frame, replyAt, 14)} headSize={32} size={32} />
              </div>
            ) : null}

            {/* the question, said out loud to the whole subnet */}
            {frame >= bubbleAt - 2 && bubbleOut > 0.01 ? (
              <div style={{ position: 'absolute', left: BUBBLE.x, top: BUBBLE.y, opacity: bubble.opacity * bubbleOut, transform: bubble.transform }}>
                <Lines
                  head={LABELS.askHead}
                  lines={[
                    <span key="q" style={{ display: 'grid' }}>
                      <span style={{ gridArea: '1 / 1', opacity: 1 - askSwap }}>{LABELS.askAny}</span>
                      <span style={{ gridArea: '1 / 1', opacity: askSwap, color: C.cyanSoft }}>{LABELS.askGw}</span>
                    </span>,
                  ]}
                  tone={CYAN}
                  on={1 - 0.5 * progress(frame, arpAt, 14) + 0.5 * progress(frame, gwAt, 14) * (1 - progress(frame, gwAt + 60, 20))}
                  headSize={32}
                  size={34}
                />
              </div>
            ) : null}

            {/* ARP named, on the right while that side is still empty */}
            {arpBox > 0.01 ? (
              <div style={{ position: 'absolute', left: ARP_BOX.x, top: ARP_BOX.y, opacity: arpBox, transform: `translateY(${(1 - progress(frame, arpAt, 18)) * 16}px)` }}>
                <Lines head={LABELS.arpHead} lines={LABELS.arpLines} tone={CYAN} on={1 - 0.5 * progress(frame, limitAt, 14)} headSize={38} size={32} />
              </div>
            ) : null}

            {/* the CPD: another subnet, the server inside */}
            {cpd > 0.01 ? (
              <>
                <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0, opacity: cpd }}>
                  <line x1={GWP.x + GWP.size / 2 + 6} y1={GWP.y} x2={CPD.x - 6} y2={GWP.y} stroke={alpha(C.sky, 0.6)} strokeWidth={4} strokeDasharray="12 10" />
                </svg>
                <div
                  style={{
                    position: 'absolute',
                    left: CPD.x,
                    top: CPD.y,
                    width: CPD.w,
                    height: CPD.h,
                    boxSizing: 'border-box',
                    borderRadius: RADIUS.lg,
                    border: `3px dashed ${alpha(C.sky, 0.7)}`,
                    background: alpha(C.sky, 0.04),
                    ...enter(frame, outsideAt, { distance: 20, axis: 'x' }),
                  }}
                >
                  <div style={{ position: 'absolute', left: 0, top: 16, width: '100%', textAlign: 'center', fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
                    <div style={{ fontSize: 32, fontWeight: 800, color: C.textStrong }}>{LABELS.cpd[0]}</div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: C.sky }}>{LABELS.cpd[1]}</div>
                  </div>
                  <div style={{ position: 'absolute', left: CPD.w / 2 - SRVP.size / 2, top: SRVP.y - CPD.y - SRVP.size / 2, opacity: srvDim }}>
                    <Device icon="server" tone={C.sky} size={SRVP.size} on={0.5} />
                  </div>
                  <div style={{ position: 'absolute', left: 0, top: SRVP.y - CPD.y + SRVP.size / 2 + 12, width: '100%', textAlign: 'center', fontFamily: FONT.mono, fontSize: 34, fontWeight: 700, color: '#fcd34d', whiteSpace: 'nowrap', opacity: 0.4 + 0.6 * srvDim }}>
                    {LABELS.server}
                  </div>
                </div>
              </>
            ) : null}

            {/* the answer: unicast, only to the host */}
            {replyDraw > 0.001 ? (
              <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
                {(() => {
                  const a = { x: GWP.x - GWP.size / 2 - 8, y: GWP.y - 10 };
                  const b = { x: HOSTP.x + HOSTP.size / 2 + 10, y: HOSTP.y + 8 };
                  const e = { x: mix(a.x, b.x, replyDraw), y: mix(a.y, b.y, replyDraw) };
                  const ang = Math.atan2(b.y - a.y, b.x - a.x);
                  const head = 22;
                  const showHead = replyDraw > 0.98;
                  return (
                    <g opacity={replyLive}>
                      <line x1={a.x} y1={a.y} x2={e.x} y2={e.y} stroke={CYAN} strokeWidth={5} strokeLinecap="round" />
                      {!showHead ? <circle cx={e.x} cy={e.y} r={11} fill={C.cyanSoft} /> : null}
                      {showHead ? (
                        <polygon
                          points={`${b.x},${b.y} ${b.x - head * Math.cos(ang - 0.45)},${b.y - head * Math.sin(ang - 0.45)} ${b.x - head * Math.cos(ang + 0.45)},${b.y - head * Math.sin(ang + 0.45)}`}
                          fill={CYAN}
                        />
                      ) : null}
                    </g>
                  );
                })()}
              </svg>
            ) : null}
            {frame >= replyAt + 20 ? (
              <div style={{ position: 'absolute', left: BUBBLE.x, top: BUBBLE.y, ...replyLabel }}>
                <Lines head={LABELS.replyHead} lines={[LABELS.replyBody]} tone={CYAN} on={replyLive} headSize={32} size={32} />
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* ------------------------------------------------ beat 2: the warehouse (art) */}
      {frame >= vanAt - 8 && artOut > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, opacity: artOut }}>
          <div style={{ position: 'absolute', left: PLATE.x, top: PLATE.y, ...plateIn }}>
            <ClipPlate
              src={ART_YARD}
              width={PLATE.w}
              height={PLATE.h}
              zoom={{ to: 1.03, start: vanAt, end: clipAt }}
              // The box moves from early on in the clip: a short dissolve in; the generated last frame differs a
              // little from the end still, so the way out is long.
              clip={{ src: CLIP_YARD.src, endSrc: ART_YARD_END, at: clipAt, frames: CLIP_YARD.frames, fadeIn: 3, fadeOut: 20 }}
              overlay={
                <div style={{ position: 'absolute', left: 14, top: 14 }}>
                  <ImageTag />
                </div>
              }
            />
          </div>
          <div style={{ position: 'absolute', left: COL_X, top: 120, ...vanRow }}>
            <Lines head={ANALOGY.van[0]} lines={[ANALOGY.van[1]]} tone={CYAN} on={vanLive} headSize={40} size={32} />
          </div>
          {frame >= boxLabelAt - 2 ? (
            <div style={{ position: 'absolute', left: COL_X, top: 330, ...boxRow }}>
              <Lines head={ANALOGY.box[0]} lines={[ANALOGY.box[1]]} tone={AMBER} on={1} headSize={40} size={32} />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ------------------------------------------------ beat 3: the hop at the gateway (code) */}
      {hopIn > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, opacity: hopIn }}>
          {/* the gateway, as a band the packet passes through */}
          <div
            style={{
              position: 'absolute',
              left: BAND.x,
              top: BAND.y,
              width: BAND.w,
              height: BAND.h,
              boxSizing: 'border-box',
              borderRadius: RADIUS.lg,
              border: `3px dashed ${alpha(C.sky, 0.7)}`,
              background: alpha(C.sky, 0.04),
            }}
          />
          <div style={{ position: 'absolute', left: BAND.x, top: BAND.y + 18, width: BAND.w, textAlign: 'center', fontFamily: FONT.sans, fontSize: 34, fontWeight: 800, color: C.sky, whiteSpace: 'nowrap' }}>
            {HOP.gw}
          </div>

          {/* the old frame: arrives, then drops away to the lower left */}
          <div
            style={{
              position: 'absolute',
              left: mix(mix(-FRM_W * 0.6, IN_X, arrive), 0, drop),
              top: mix(IN_Y, BAND.y + BAND.h + 14, drop),
              transform: `scale(${mix(1, 0.4, drop)})`,
              transformOrigin: '0 0',
              opacity: 1 - 0.55 * drop,
            }}
          >
            <FrameShell on={0.5 * (1 - drop)} />
          </div>
          {drop > 0.6 ? (
            <div style={{ position: 'absolute', left: Math.round(FRM_W * 0.4) + 20, top: BAND.y + BAND.h + 34, opacity: progress(frame, dropAt + 20, 12) }}>
              <Small color={C.text} size={32}>{`${HOP.dropped[0]} · ${HOP.dropped[1]}`}</Small>
            </div>
          ) : null}

          {/* the new frame around the same packet */}
          {fresh > 0.01 ? (
            <div style={{ position: 'absolute', left: IN_X, top: IN_Y, opacity: fresh, transform: `scale(${mix(1.06, 1, fresh)})` }}>
              <FrameShell on={0.9 * (1 - 0.5 * progress(frame, meteAt + 40, 20))} />
            </div>
          ) : null}

          {/* the packet stays: same addresses, TTL one less */}
          {arrive > 0.01 ? (
            <div
              style={{
                position: 'absolute',
                left: mix(-FRM_W * 0.6, IN_X, arrive) + FRM.head + 2 * FRM.pad + 3,
                top: IN_Y + FRM.pad + 3,
              }}
            >
              <Packet t={HOP} ttl={HOP.ttl} ttlOn={ttlOn} same={same} />
            </div>
          ) : null}

          {/* what the new frame says */}
          {fresh > 0.01 ? (
            <div style={{ position: 'absolute', left: BAND.x + BAND.w + 24, top: BAND.y + 20, ...freshLabel }}>
              <Lines head={HOP.fresh} lines={HOP.freshLines} tone={CYAN} on={1} headSize={36} size={32} />
            </div>
          ) : null}
          {same > 0.01 ? (
            <div style={{ position: 'absolute', left: IN_X + FRM.head + 2 * FRM.pad, top: IN_Y + FRM_H + 18, width: PKT.w, display: 'flex', justifyContent: 'center', ...enter(frame, sameAt, { distance: 12 }) }}>
              <Lines lines={[HOP.same]} tone={AMBER} on={1} size={34} />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* small print: no address translation on this path */}
      {nat > 0.01 ? (
        <div style={{ position: 'absolute', right: 0, top: H - 40, opacity: clamp01(nat) }}>
          <Small>{LABELS.nat}</Small>
        </div>
      ) : null}
    </Stage>
  );
}
