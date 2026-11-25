import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Illustration } from '../../../engine/src/ui/Illustration';
import { clamp01, mix } from '../../../engine/src/ui';
import { LAYER } from '../data/case';
import { ART, DEVICES } from '../data/s02-envoltorios';
import { Device } from './parts/Net';
import { ImageTag } from './parts/Tags';
import { COMPACT, CompactStack, STACK, WrapperStack } from './parts/s02-envoltorios/Stack';
import { Stage, wordFrame } from './kit';

const S = 's02-envoltorios';
const W = STAGE.width;

// ---- The full stack (beats 1 and 3), centred horizontally.
const STACK_X = Math.round((W - STACK.w) / 2);
/** Beat 1: the stack sits mid-stage. Beat 3: it rises to make room for the devices. */
const STACK_Y_BUILD = 130;
const STACK_Y_TOP = 6;

/** While it is being built, the stack keeps its visible outermost wrapper centred (offsets in px). */
const centreOf = (x: number, w: number) => STACK.w / 2 - (x + w / 2);
const SHIFT = {
  data: { x: centreOf(STACK.data.x, STACK.data.w), y: STACK.h / 2 - (STACK.data.y + STACK.data.h / 2) },
  segment: { x: centreOf(STACK.segment.x, STACK.segment.w), y: STACK.h / 2 - (STACK.segment.y + STACK.segment.h / 2) },
  packet: { x: centreOf(STACK.packet.x, STACK.packet.w), y: STACK.h / 2 - (STACK.packet.y + STACK.packet.h / 2) },
};

// ---- Beat 2: the compact stack on the left, the analogy on the right.
const ART_BOX = { x: 640, y: 26, w: 1088, h: 608 } as const;
const COMPACT_Y = Math.round((STAGE.height - COMPACT.h) / 2);

// ---- Beat 3: the three devices under the stack.
const DEV = 92;
const DEV_Y = 432;
const DEV_CX = [230, 760, 1300] as const;
const DEV_LABEL_W = 500;
/** Where each device's pointer lands: bottom-centre of the header it reads (stack coordinates). */
const TARGET = {
  // The switch's field («MAC de destino») is the TOP cell of its column: its pointer comes in from the left side.
  frame: { x: STACK.frameHdr.x, y: STACK.frameHdr.y + (STACK.frameHdr.h - 20) / 6 },
  packet: { x: STACK.packetHdr.x + STACK.packetHdr.w / 2, y: STACK.packetHdr.y + STACK.packetHdr.h },
  segment: { x: STACK.segmentHdr.x + STACK.segmentHdr.w / 2, y: STACK.segmentHdr.y + STACK.segmentHdr.h },
} as const;

/**
 * s02-envoltorios «De dentro afuera», in three beats.
 * 1 `data`→`frame` (code): the stack builds inside-out and stays centred on its outermost wrapper: «datos» alone;
 *   the ports header and the emerald wrap (`seg`), named «segmento · TCP · capa 4» (`segname`); the IPs header and the
 *   amber wrap, named on «paquete» (`pkt`); the cyan frame with MAC/MAC/EtherType in front and the FCS tail
 *   (`frame`), the destination MAC lit on «MAC».
 * 2 `box` (art): the stack gives way to a compact one (names only) on the left and the analogy on the right, tagged
 *   «imagen · no es el Consorcio»; each name lights on «carta», «sobre», «caja», «furgoneta».
 * 3 `who`→`host` (code): the full stack returns at the top and three devices appear below; on `sw`, `rt`, `host` each
 *   lights in its wrapper's colour and points at the field it decides with, its wrapper lit and the others dimmed. The
 *   scene ends with every name lit.
 */
export function S02Envoltorios(props: SceneProps) {
  const frame = useCurrentFrame();
  const dataAt = props.cue('data');
  const segAt = props.cue('seg');
  const segNameAt = props.cue('segname');
  const pktAt = props.cue('pkt');
  const frameAt = props.cue('frame');
  const boxAt = props.cue('box');
  const whoAt = props.cue('who');
  // Each device lights on its own name (the voice can pause between «El» and «encaminador»).
  const swAt = Math.max(props.cue('sw'), wordFrame(S, 's02-06', 'conmutador') - 6);
  const rtAt = Math.max(props.cue('rt'), wordFrame(S, 's02-07', 'encaminador') - 6);
  const hostAt = props.cue('host');
  const portAt = wordFrame(S, 's02-02', 'puerto') - 4;
  const serverAt = wordFrame(S, 's02-03', 'servidor') - 4;
  const pktNameAt = wordFrame(S, 's02-03', 'paquete') - 6;
  const frameHdrAt = wordFrame(S, 's02-04', 'Lleva') - 4;
  const macAt = wordFrame(S, 's02-04', 'MAC') - 4;
  const analogAt = [
    wordFrame(S, 's02-05', 'carta') - 4,
    wordFrame(S, 's02-05', 'sobre') - 4,
    wordFrame(S, 's02-05', 'caja') - 4,
    wordFrame(S, 's02-05', 'furgoneta') - 4,
  ];
  // Every name lights once «Y el puerto lo lee el servidor» has been said.
  const allAt = Math.max(hostAt + 44, wordFrame(S, 's02-07', 'servidor') + 26);

  // ---- Beat 1: the build.
  const dataOn = progress(frame, dataAt, 16);
  const segHdr = progress(frame, segAt, 16);
  const seg = progress(frame, segAt + 10, 18, EASE.inOut);
  const segName = progress(frame, segNameAt - 4, 14);
  const pktHdr = progress(frame, pktAt, 16);
  const pkt = progress(frame, pktAt + 10, 18, EASE.inOut);
  const pktName = progress(frame, pktNameAt, 14);
  const frm = progress(frame, frameAt, 18, EASE.inOut);
  const frameName = progress(frame, frameAt + 6, 14);
  const frameHdr = progress(frame, frameHdrAt, 30, EASE.linear);
  const fcs = progress(frame, frameHdrAt + 34, 14);
  const fieldPort = progress(frame, portAt, 10) * (1 - progress(frame, segNameAt + 20, 16, EASE.inOut));
  const fieldIp = progress(frame, serverAt, 10) * (1 - progress(frame, frameAt, 16, EASE.inOut));
  const fieldMac = progress(frame, macAt, 8);
  // The newest wrapper glows while it is being named.
  const litBuild = {
    segment: segName * (1 - progress(frame, pktAt, 16, EASE.inOut)),
    packet: pktName * (1 - progress(frame, frameAt, 16, EASE.inOut)),
    frame: frameName,
    data: dataOn * (1 - progress(frame, segAt, 16, EASE.inOut)),
  };
  const shiftX = mix(mix(mix(SHIFT.data.x, SHIFT.segment.x, seg), SHIFT.packet.x, pkt), 0, frm);
  const shiftY = mix(mix(mix(SHIFT.data.y, SHIFT.segment.y, seg), SHIFT.packet.y, pkt), 0, frm);

  // ---- Beat changes.
  // «la MAC» ends right before `box`: the build holds it lit until the cue, then gives way.
  const buildOut = progress(frame, boxAt - 4, 14, EASE.inOut);
  const artIn = enter(frame, boxAt + 2, { distance: 30, duration: 20, axis: 'x' });
  const compactIn = enter(frame, boxAt + 6, { distance: 20, duration: 18 });
  const analogyOut = progress(frame, whoAt - 18, 14, EASE.inOut);

  // ---- Beat 2: names light on their words.
  const analogLit = analogAt.map((at, i) => progress(frame, at, 10) * (1 - 0.6 * progress(frame, (analogAt[i + 1] ?? whoAt - 30) - 2, 12, EASE.inOut)));

  // ---- Beat 3: devices.
  const devAt = [swAt, rtAt, hostAt];
  const all = progress(frame, allAt, 20, EASE.inOut);
  const w = devAt.map((at, i) => progress(frame, at, 14) * (1 - progress(frame, (devAt[i + 1] ?? allAt) - 4, 14, EASE.inOut)));
  const anyFocus = clamp01(w[0] + w[1] + w[2]);
  const lit = {
    frame: w[0] + 0.8 * all,
    packet: w[1] + 0.8 * all,
    segment: w[2] + 0.8 * all,
    data: 0.8 * all,
  };
  const dim = {
    frame: anyFocus - w[0],
    packet: anyFocus - w[1],
    segment: anyFocus - w[2],
    data: anyFocus,
  };

  const showBuild = frame < boxAt + 12;
  const showAnalogy = frame >= boxAt && analogyOut < 0.99;
  const showStackTop = frame >= whoAt - 8;

  return (
    <Stage>
      {/* ------------------------------------------------ beat 1: the build */}
      {showBuild && buildOut < 0.99 ? (
        <div style={{ position: 'absolute', left: STACK_X + shiftX, top: STACK_Y_BUILD + shiftY, opacity: 1 - buildOut, transform: `scale(${1 - 0.06 * buildOut})` }}>
          <WrapperStack
            data={dataOn}
            seg={seg}
            segHdr={segHdr}
            segName={segName}
            pkt={pkt}
            pktHdr={pktHdr}
            pktName={pktName}
            frame={frm}
            frameHdr={frameHdr}
            frameName={frameName}
            fcs={fcs}
            lit={litBuild}
            field={{ port: fieldPort, ip: fieldIp, mac: fieldMac }}
          />
        </div>
      ) : null}

      {/* ------------------------------------------------ beat 2: the analogy */}
      {showAnalogy ? (
        <>
          <div style={{ position: 'absolute', left: 0, top: COMPACT_Y, ...compactIn, opacity: compactIn.opacity * (1 - analogyOut) }}>
            <CompactStack lit={{ data: analogLit[0], segment: analogLit[1], packet: analogLit[2], frame: analogLit[3] }} />
          </div>
          <div style={{ position: 'absolute', left: ART_BOX.x, top: ART_BOX.y, ...artIn, opacity: artIn.opacity * (1 - analogyOut) }}>
            <Illustration
              src={ART}
              width={ART_BOX.w}
              height={ART_BOX.h}
              zoom={{ to: 1.04, start: boxAt, end: whoAt }}
              zoomOrigin={{ x: 0.47, y: 0.5 }}
              overlay={
                <div style={{ position: 'absolute', left: 14, top: 14 }}>
                  <ImageTag />
                </div>
              }
            />
          </div>
        </>
      ) : null}

      {/* ------------------------------------------------ beat 3: who reads which wrapper */}
      {showStackTop ? (
        <>
          <div style={{ position: 'absolute', left: STACK_X, top: STACK_Y_TOP, ...enter(frame, whoAt - 6, { distance: 24 }) }}>
            <WrapperStack lit={lit} dim={dim} field={{ mac: w[0], ip: w[1], port: w[2] }} />
          </div>

          {/* pointers from each device to the field it reads */}
          <svg width={W} height={STAGE.height} style={{ position: 'absolute', left: 0, top: 0 }}>
            {DEVICES.map((d, i) => {
              const on = progress(frame, devAt[i] + 4, 16, EASE.inOut);
              if (on < 0.01) return null;
              const t = TARGET[d.key];
              const x1 = DEV_CX[i];
              const y1 = DEV_Y - 8;
              const x2 = STACK_X + t.x;
              const y2 = STACK_Y_TOP + t.y + 6;
              const tone = LAYER[d.key].tone;
              const strength = 0.35 + 0.65 * Math.max(w[i], all);
              return (
                <g key={d.key} opacity={strength}>
                  <path
                    d={
                      d.key === 'frame'
                        ? `M ${x1} ${y1} C ${x1} ${y1 - 40}, ${STACK_X - 14} ${y1 - 40}, ${STACK_X - 14} ${(y1 + y2) / 2} S ${STACK_X - 14} ${y2}, ${x2} ${y2}`
                        : `M ${x1} ${y1} C ${x1} ${y1 - 30}, ${x2} ${y2 + 30}, ${x2} ${y2}`
                    }
                    fill="none"
                    stroke={tone}
                    strokeWidth={4}
                    pathLength={1}
                    strokeDasharray="1 1"
                    strokeDashoffset={1 - on}
                    strokeLinecap="round"
                  />
                  <circle cx={x2} cy={y2} r={8 * on} fill={tone} />
                </g>
              );
            })}
          </svg>

          {DEVICES.map((d, i) => {
            const shown = progress(frame, whoAt + i * 5, 14);
            const mine = progress(frame, devAt[i], 12);
            const tone = LAYER[d.key].tone;
            const strong = Math.max(w[i], 0.7 * all);
            return (
              <div
                key={d.key}
                style={{
                  position: 'absolute',
                  left: DEV_CX[i] - DEV_LABEL_W / 2,
                  top: DEV_Y,
                  width: DEV_LABEL_W,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  opacity: shown * (0.45 + 0.55 * mine) * (1 - 0.35 * mine * (anyFocus - w[i])),
                }}
              >
                <Device icon={d.icon} tone={mine > 0.5 ? tone : C.sky} size={DEV} on={0.2 + 0.8 * strong} />
                <div style={{ height: 12, flexShrink: 0 }} />
                <div style={{ opacity: mine, transform: `translateY(${(1 - mine) * 10}px)`, textAlign: 'center', fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
                  <div style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.2, color: tone, textShadow: strong > 0.05 ? `0 0 ${Math.round(16 * strong)}px ${alpha(tone, 0.6 * strong)}` : undefined }}>{d.title}</div>
                  <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.25, color: C.textStrong }}>{d.sub}</div>
                </div>
              </div>
            );
          })}
        </>
      ) : null}
    </Stage>
  );
}
