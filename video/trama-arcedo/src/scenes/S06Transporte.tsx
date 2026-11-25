import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { mix } from '../../../engine/src/ui';
import { Illustration } from '../../../engine/src/ui/Illustration';
import { LAYER } from '../data/case';
import { ART_CERT, ART_POST, ART_WRAPS, TCP_LABEL, UDP_LABEL } from '../data/s06-transporte';
import { Bytes, Handshake, PANEL_W, ProtoLabel, VoiceRow } from './parts/s06-transporte/Diagrams';
import { SEGMENT_RIGHT, STACK_W, Stack } from './parts/s06-transporte/Stack';
import { ImageTag } from './parts/Tags';
import { Stage, wordFrame } from './kit';

const S = 's06-transporte';

// Stage-local layout. Phase 1: the stack (left) and s02's envelope (right). Phase 2: two halves — certified mail and
// TCP on the left, postcard and UDP on the right; the right half first holds the TCP diagrams, one after another.
const STACK_POS = { x: 40, y: 60 } as const;
const WRAPS = { x: 1100, y: 96, w: 560, h: 460 } as const;
const HALF_W = PANEL_W;
const RIGHT_X = 1728 - HALF_W;
const PLATE_H = { big: 470, small: 400 } as const;
const LABEL_Y = 414;
const VOICE_Y = 586;

/**
 * s06-transporte «Certificado o postal».
 *   inside  the wrapper stack returns, only the segment lit («segmento · capa 4»), with s02's envelope beside it
 *   cert    left: the certified-mail art (tagged); the stack leaves
 *   three   right: the two endpoints and SYN / SYN+ACK / ACK, «establecimiento en tres pasos»
 *   num     right: numbered bytes, «número de secuencia», and the ack «acuse = siguiente byte que se espera»
 *   resend  right: a gap the ack keeps asking for, resent; two crossed bytes put back in order
 *   tcp     under the left art: «TCP · RFC 9293 …» (the art shrinks a little to make room)
 *   post    right: the TCP diagrams give way to the postcard art (tagged); the TCP half steps back
 *   udp     under it: «UDP · RFC 768 · datagrama …»
 *   voice   under that: a phone with a voice wave, «voz en tiempo real» (not a Consorcio device)
 */
export function S06Transporte(props: SceneProps) {
  const frame = useCurrentFrame();
  const insideAt = props.cue('inside');
  const certAt = props.cue('cert');
  const threeAt = props.cue('three');
  const numAt = props.cue('num');
  const resendAt = props.cue('resend');
  const tcpAt = props.cue('tcp');
  const postAt = props.cue('post');
  const udpAt = props.cue('udp');
  const voiceAt = props.cue('voice');
  const sobreAt = wordFrame(S, 's06-01', 'sobre') - 6;

  // ---- phase 1
  const phase1 = 1 - progress(frame, certAt - 14, 14, EASE.inOut);
  const lit = progress(frame, insideAt + 4, 20, EASE.inOut);
  const wrapsIn = progress(frame, sobreAt, 16);
  const leader = progress(frame, sobreAt + 6, 16, EASE.inOut);

  // ---- phase 2, left half
  const certIn = enter(frame, certAt - 4, { distance: 20 });
  const plateH = mix(PLATE_H.big, PLATE_H.small, progress(frame, tcpAt - 10, 18, EASE.inOut));
  const tcpIn = enter(frame, tcpAt, { distance: 14 });
  const tcpOn = progress(frame, tcpAt, 12) * (1 - progress(frame, postAt - 6, 16));
  const leftStep = 1 - 0.4 * progress(frame, postAt - 6, 16, EASE.inOut) - 0.15 * progress(frame, voiceAt - 4, 16, EASE.inOut);

  // ---- phase 2, right half
  const hsOut = 1 - progress(frame, numAt - 12, 12, EASE.inOut);
  const bytesIn = progress(frame, numAt - 6, 8);
  const bytesOut = 1 - progress(frame, postAt - 14, 12, EASE.inOut);
  const postIn = enter(frame, postAt - 4, { distance: 20 });
  const udpIn = enter(frame, udpAt, { distance: 14 });
  const udpOn = progress(frame, udpAt, 12) * (1 - 0.6 * progress(frame, voiceAt, 16));
  const voiceIn = enter(frame, voiceAt - 2, { distance: 14 });

  return (
    <Stage>
      {/* ------------------------------------------------ phase 1: the stack and the envelope */}
      {phase1 > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1728, height: 660, opacity: phase1 }}>
          <div style={{ position: 'absolute', left: STACK_POS.x, top: STACK_POS.y, ...enter(frame, -8, { distance: 16, duration: 14 }) }}>
            <Stack lit={lit} />
          </div>
          {leader > 0.01 ? (
            <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0 }}>
              <line
                x1={STACK_POS.x + STACK_W + 10}
                y1={STACK_POS.y + SEGMENT_RIGHT.y}
                x2={mix(STACK_POS.x + STACK_W + 10, WRAPS.x - 12, leader)}
                y2={mix(STACK_POS.y + SEGMENT_RIGHT.y, WRAPS.y + WRAPS.h / 2, leader)}
                stroke={alpha(LAYER.segment.tone, 0.85)}
                strokeWidth={5}
                strokeDasharray="16 12"
                strokeLinecap="round"
              />
            </svg>
          ) : null}
          {wrapsIn > 0.01 ? (
            <div style={{ position: 'absolute', left: WRAPS.x, top: WRAPS.y, opacity: wrapsIn, transform: `translateY(${(1 - wrapsIn) * 16}px)` }}>
              <Illustration
                src={ART_WRAPS}
                width={WRAPS.w}
                height={WRAPS.h}
                focus={{ x: 0.47, y: 0.5 }}
                zoom={{ from: 2.5, to: 2.7, start: sobreAt, end: certAt }}
                zoomOrigin={{ x: 0.49, y: 0.4 }}
                overlay={
                  <div style={{ position: 'absolute', left: 14, bottom: 14 }}>
                    <ImageTag />
                  </div>
                }
              />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ------------------------------------------------ left half: certified mail, then TCP */}
      {frame >= certAt - 6 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: HALF_W, height: 660, opacity: leftStep }}>
          <div style={{ position: 'absolute', left: 0, top: 0, ...certIn }}>
            <Illustration
              src={ART_CERT}
              width={HALF_W}
              height={plateH}
              focus={{ x: 0.5, y: 0.42 }}
              zoom={{ from: 1, to: 1.04, start: certAt, end: postAt }}
              overlay={
                <div style={{ position: 'absolute', left: 14, bottom: 14 }}>
                  <ImageTag />
                </div>
              }
            />
          </div>
          {frame >= tcpAt - 2 ? (
            <div style={{ position: 'absolute', left: 0, top: LABEL_Y, ...tcpIn }}>
              <ProtoLabel title={TCP_LABEL.title} lines={TCP_LABEL.lines} tone={LAYER.segment.tone} on={tcpOn} />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ------------------------------------------------ right half: the TCP diagrams, one after another */}
      {frame >= threeAt - 8 && hsOut > 0.01 ? (
        <div style={{ position: 'absolute', left: RIGHT_X, top: 0, opacity: hsOut }}>
          <Handshake frame={frame} at={threeAt} />
        </div>
      ) : null}
      {bytesIn > 0.01 && bytesOut > 0.01 ? (
        <div style={{ position: 'absolute', left: RIGHT_X, top: 0, opacity: bytesIn * bytesOut }}>
          <Bytes
            frame={frame}
            t={{
              num: numAt,
              ack: wordFrame(S, 's06-03', 'confirma', 0) - 4,
              resend: resendAt,
              refill: wordFrame(S, 's06-03', 'reenvía') + 6,
              swapMark: wordFrame(S, 's06-03', 'descolocado') - 4,
              swap: wordFrame(S, 's06-03', 'ordena') - 4,
            }}
          />
        </div>
      ) : null}

      {/* ------------------------------------------------ right half: the postcard, then UDP and the voice */}
      {frame >= postAt - 6 ? (
        <div style={{ position: 'absolute', left: RIGHT_X, top: 0, ...postIn }}>
          <Illustration
            src={ART_POST}
            width={HALF_W}
            height={PLATE_H.small}
            focus={{ x: 0.5, y: 0.5 }}
            zoom={{ from: 1, to: 1.04, start: postAt, end: voiceAt + 180 }}
            dim={0.25 * progress(frame, voiceAt, 16)}
            overlay={
              <div style={{ position: 'absolute', left: 14, bottom: 14 }}>
                <ImageTag />
              </div>
            }
          />
        </div>
      ) : null}
      {frame >= udpAt - 2 ? (
        <div style={{ position: 'absolute', left: RIGHT_X, top: LABEL_Y, ...udpIn }}>
          <ProtoLabel title={UDP_LABEL.title} lines={UDP_LABEL.lines} tone={C.sky} on={udpOn} />
        </div>
      ) : null}
      {frame >= voiceAt - 4 ? (
        <div style={{ position: 'absolute', left: RIGHT_X, top: VOICE_Y, ...voiceIn }}>
          <VoiceRow frame={frame} at={voiceAt} />
        </div>
      ) : null}
    </Stage>
  );
}
