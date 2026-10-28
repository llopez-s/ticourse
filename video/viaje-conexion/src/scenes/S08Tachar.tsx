import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui/Icon';
import { Stage, wordFrame } from './kit';
import { EPHEMERAL_PORT, HTTPS_PORT, LAPTOP, NAT_PORT, PORTAL_IP, PUBLIC_IP } from './parts/data';
import { DeviceTile, Parcel } from './parts/Glyphs';
import { Label, LABEL_W, type BoxKey } from './parts/Label';
import { CaseStamp, Line } from './parts/Marks';
import { NAT_W, NatTable } from './parts/NatTable';

const S = 's08-tachar';
const FRAME = { x: 250, y: 0, w: 1228, h: 334 };
const PARCEL = { x: 414, y: 58, w: 900, h: 270 };
const LABEL_IN_PARCEL = { x: Math.round((PARCEL.w - LABEL_W) / 2), y: 10 };
const TABLE_Y = 340;
const SLIDE = 150;

/**
 * s08-tachar «Tachar y apuntar». The packet with its label is in front of us from the start («tu dirección es
 * privada»); on `router` the router frame draws around it; on `rewrite` the origin is struck out and the public
 * address and port are written under it by hand (a corrected return address, no wall, no shield); on `table`
 * the NAT table gains a row; on `lookup` the portal's answer comes back (label turned around) and the row
 * blinks while the destination goes back to 192.168.20.10:51422; on `nat` the frame's caption names it; on
 * `shared` three more rows from other laptops, same public address, different ports.
 */
export function S08Tachar(props: SceneProps) {
  const frame = useCurrentFrame();
  const routerAt = props.cue('router');
  const rewriteAt = props.cue('rewrite');
  const tableAt = props.cue('table');
  const lookupAt = props.cue('lookup');
  const natAt = props.cue('nat');
  const sharedAt = props.cue('shared');
  const wf = (seg: string, w: string, n = 0) => wordFrame(S, seg, w, n);

  // ---- the packet comes into the router ----
  const slide = progress(frame, routerAt, 28, EASE.inOut);
  const frameIn = progress(frame, routerAt - 4, 18);
  const cloudIn = progress(frame, routerAt + 6, 16);
  const parcelX = PARCEL.x - SLIDE * (1 - slide);
  const privIn = enter(frame, 6, { distance: 12 });
  const privOut = 1 - progress(frame, rewriteAt - 10, 10);

  // ---- rewrite ----
  const strike = progress(frame, rewriteAt + 4, 22, EASE.inOut);
  const rewriteP = progress(frame, rewriteAt + 20, 44, EASE.linear);
  const portAt = wf('s08-03', 'puerto') - 4;
  const portNote = enter(frame, portAt, { distance: 12 });
  const portNoteOut = 1 - progress(frame, tableAt - 22, 10);

  // ---- the answer (label turned around) ----
  const back = progress(frame, lookupAt - 2, 14);
  const lookTable = wf('s08-05', 'tabla');
  const typeBack = progress(frame, lookupAt + 2, 22, EASE.linear);
  const typePriv = progress(frame, lookTable, 22, EASE.linear);
  const isPriv = frame >= lookTable;
  const backReveal: Partial<Record<BoxKey, number>> = { oAddr: typeBack, oPort: typeBack, dAddr: isPriv ? typePriv : typeBack, dPort: isPriv ? typePriv : typeBack, proto: 1 };
  const blink = progress(frame, lookupAt, 8) * (1 - progress(frame, lookTable + 40, 14)) * (0.55 + 0.45 * pulse(frame, 30, 0.8));
  const laptopGlow = progress(frame, lookTable + 16, 14);

  // ---- table ----
  const row0 = progress(frame, tableAt + 4, 26, EASE.linear);
  const tableTitle = enter(frame, tableAt, { distance: 14 });
  const extra = [0, 1, 2].map((i) => progress(frame, sharedAt + 10 + i * 12, 22, EASE.linear));
  const markAddr = progress(frame, wf('s08-06', 'pública') - 2, 12);
  const markPorts = progress(frame, wf('s08-06', 'puerto') - 2, 12);
  const sharedNote = enter(frame, wf('s08-06', 'Así'), { distance: 12 });

  // ---- caption of the frame ----
  const natHead = progress(frame, natAt, 12);
  const looks = progress(frame, lookupAt, 10) * (1 - natHead);
  const routerHead = 1 - Math.max(natHead, looks);

  const labelAStyle = { opacity: 1 - back };
  return (
    <>
      <Stage>
        {/* the laptop the packet comes from */}
        <div style={{ position: 'absolute', left: 20, top: 120, opacity: 1 }}>
          <DeviceTile kind="laptop" tile={96} name="tu portátil" glow={laptopGlow * 0.8} />
        </div>
        {/* Internet on the right */}
        <div style={{ position: 'absolute', left: 1560, top: 120, opacity: cloudIn }}>
          <DeviceTile kind="cloud" tile={96} name="Internet" tone="muted" />
        </div>

        {/* the router frame and its caption */}
        <div
          style={{
            position: 'absolute',
            left: FRAME.x,
            top: FRAME.y,
            width: FRAME.w,
            height: FRAME.h,
            boxSizing: 'border-box',
            borderRadius: RADIUS.lg,
            border: `2px dashed ${alpha(C.cyan, 0.4)}`,
            background: alpha(C.cyan, 0.03),
            opacity: frameIn,
          }}
        />
        <div style={{ position: 'absolute', left: FRAME.x + 26, top: 4, height: 46, display: 'flex', alignItems: 'center', gap: 14, opacity: frameIn, whiteSpace: 'nowrap' }}>
          <Icon name="router" size={34} color={C.cyan} />
          <span style={{ position: 'relative', fontFamily: FONT.sans, fontSize: 36, fontWeight: 750, color: C.muted, opacity: routerHead }}>router</span>
          <span style={{ position: 'absolute', left: 48, fontFamily: FONT.sans, fontSize: 38, fontWeight: 800, color: C.emerald, opacity: looks }}>respuesta del portal</span>
          <span style={{ position: 'absolute', left: 48, fontFamily: FONT.sans, fontSize: 44, fontWeight: 850, color: C.textStrong, opacity: natHead }}>
            <span style={{ color: C.cyan }}>NAT</span> · traducción de direcciones
          </span>
        </div>

        {/* the packet, with its label */}
        <div style={{ position: 'absolute', left: parcelX, top: PARCEL.y, width: PARCEL.w, height: PARCEL.h, opacity: progress(frame, 0, 16) }}>
          <Parcel width={PARCEL.w} height={PARCEL.h} tone={back > 0.5 ? 'emerald' : 'cyan'} glow={0.12} />
          <div style={{ position: 'absolute', left: LABEL_IN_PARCEL.x, top: LABEL_IN_PARCEL.y, ...labelAStyle }}>
            <Label
              values={{ oAddr: LAPTOP.ip, oPort: EPHEMERAL_PORT, dAddr: PORTAL_IP, dPort: HTTPS_PORT, proto: 'TCP' }}
              strike={strike}
              rewrite={{ addr: PUBLIC_IP, port: NAT_PORT, p: rewriteP }}
              tones={{ oAddr: 'cyan', oPort: 'cyan' }}
            />
            {/* «pública» in the empty caption slot of the corrected row */}
            <div style={{ position: 'absolute', left: 20, top: 94 + 17, fontFamily: FONT.sans, fontSize: 28, fontWeight: 750, color: C.amber, opacity: progress(rewriteP, 0.2, 0.3) }}>pública</div>
          </div>
          {back > 0.01 ? (
            <div style={{ position: 'absolute', left: LABEL_IN_PARCEL.x, top: LABEL_IN_PARCEL.y, opacity: back }}>
              <Label
                values={{ oAddr: PORTAL_IP, oPort: HTTPS_PORT, dAddr: isPriv ? LAPTOP.ip : PUBLIC_IP, dPort: isPriv ? EPHEMERAL_PORT : NAT_PORT, proto: 'TCP' }}
                reveal={backReveal}
                tones={{ dAddr: 'amber', dPort: 'amber' }}
                focus={isPriv ? ['dAddr', 'dPort'] : null}
              />
            </div>
          ) : null}
        </div>

        {/* notes under the packet, before the table arrives */}
        {frame >= 6 && privOut > 0.01 ? (
          <div style={{ position: 'absolute', left: 0, top: 350, width: 1728, display: 'flex', justifyContent: 'center', ...privIn, opacity: privIn.opacity * privOut }}>
            <Line size={50} weight={800}>
              tu dirección es <span style={{ color: C.amber }}>privada</span>: Internet no la lleva
            </Line>
          </div>
        ) : null}
        {frame >= portAt && portNoteOut > 0.01 ? (
          <div style={{ position: 'absolute', left: 0, top: 350, width: 1728, display: 'flex', justifyContent: 'center', ...portNote, opacity: portNote.opacity * portNoteOut }}>
            <Line size={50} weight={800}>
              la dirección <span style={{ color: C.amber }}>pública</span>, y muchas veces <span style={{ color: C.amber }}>también el puerto</span>
            </Line>
          </div>
        ) : null}

        {/* the NAT table */}
        <div style={{ position: 'absolute', left: 0, top: TABLE_Y, opacity: progress(frame, tableAt - 14, 10) * 0.4 + 0.6 * progress(frame, tableAt - 2, 12) }}>
          <NatTable rows={[row0, extra[0], extra[1], extra[2]]} lit={[blink, 0, 0, 0]} markAddr={markAddr} markPorts={markPorts} skeleton />
        </div>
        {frame >= tableAt - 2 ? (
          <div style={{ position: 'absolute', left: NAT_W + 28, top: TABLE_Y, ...tableTitle }}>
            <Line size={46} weight={850} color={C.cyan}>
              tabla de NAT
            </Line>
          </div>
        ) : null}
        {frame >= sharedAt - 2 ? (
          <div style={{ position: 'absolute', left: NAT_W + 28, top: TABLE_Y + 70, ...sharedNote }}>
            <Line size={34} weight={750} style={{ lineHeight: 1.28 }}>
              una sola dirección
            </Line>
            <Line size={34} weight={750} style={{ lineHeight: 1.28 }}>
              pública; cada
            </Line>
            <Line size={34} weight={750} style={{ lineHeight: 1.28 }}>
              conversación,
            </Line>
            <Line size={34} weight={750} color={C.amber} style={{ lineHeight: 1.28 }}>
              su propio puerto
            </Line>
          </div>
        ) : null}
      </Stage>
      <CaseStamp scene={S} />
    </>
  );
}
