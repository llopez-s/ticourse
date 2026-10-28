import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Stage, wordFrame } from './kit';
import { Edificio } from './parts/Edificio';
import { EPHEMERAL_PORT, HTTPS_PORT, LAPTOP, OTHER_EPHEMERAL, PORTAL_IP } from './parts/data';
import { DeviceTile, Parcel } from './parts/Glyphs';
import { Label, LABEL_W, type BoxKey } from './parts/Label';
import { CaseStamp, ImageTag, Line } from './parts/Marks';

const S = 's06-despacho';
const PARCEL = { x: 560, y: 384, w: 860, h: 268 };
const LABEL_POS = { x: PARCEL.x + Math.round((PARCEL.w - LABEL_W) / 2), y: PARCEL.y + 16 };
const PORTS = [EPHEMERAL_PORT, ...OTHER_EPHEMERAL];

/**
 * s06-despacho «Edificio y despacho». On `building` the portal appears as a building with three numbered
 * offices (443, 22, 25) of which only 443 has light; on `port` «la dirección es el edificio» and «el puerto
 * es el despacho» come in and the address plate and the offices light in turn; on `ephemeral` the laptop's
 * origin port 51422 is shown with «efímero · lo elige tu portátil para esta conexión»; on `convo` the
 * browser shows three open connections, each with its port, and the reply enters its own; on `label` a
 * parcel with the empty five-box label fills box by box as the voice names them (origin address and port,
 * destination address and port, then TCP); on `inside` the label turns translucent and «¿qué lleva?» shows.
 */
export function S06Despacho(props: SceneProps) {
  const frame = useCurrentFrame();
  const buildingAt = props.cue('building');
  const ephemeralAt = props.cue('ephemeral');
  const convoAt = props.cue('convo');
  const labelAt = props.cue('label');
  const insideAt = props.cue('inside');

  // ---- building ----
  const bIn = progress(frame, buildingAt - 6, 22);
  const numbers = progress(frame, buildingAt + 10, 22);
  const addrWord = wordFrame(S, 's06-02', 'dirección') - 4;
  const portWord = wordFrame(S, 's06-02', 'puerto', 1) - 4;
  const n443 = wordFrame(S, 's06-02', '443') - 6;
  const signGlow = progress(frame, addrWord, 12) * (1 - progress(frame, portWord, 12));
  const officeFocus = progress(frame, portWord, 12);
  const line1 = enter(frame, addrWord, { distance: 14 });
  const line2 = enter(frame, portWord, { distance: 14 });
  const line2Hi = progress(frame, n443, 10);

  // ---- ephemeral port ----
  const eph = enter(frame, ephemeralAt - 2, { distance: 18 });
  const ephShift = progress(frame, convoAt - 6, 18, EASE.inOut);

  // ---- three connections ----
  const connIn = progress(frame, convoAt, 18);
  const replyP = progress(frame, convoAt + 40, 44, EASE.inOut);
  const replyIn = progress(frame, convoAt + 36, 8);
  const replyHit = progress(frame, convoAt + 82, 10);

  // ---- parcel with the label ----
  const parcelIn = progress(frame, labelAt - 8, 18);
  const words = (w: string, n: number) => wordFrame(S, 's06-05', w, n);
  // «Origen y destino, cada uno con su dirección y su puerto. En total, la etiqueta completa lleva cuatro datos y el protocolo.»
  const atO = words('Origen', 0) + 2;
  const atOp = atO + 12;
  const atD = words('destino', 0) + 2;
  const atDp = atD + 12;
  const atProto = words('protocolo', 0) + 2;
  const rev = (at: number) => progress(frame, at, 14, EASE.linear);
  const reveal: Partial<Record<BoxKey, number>> = { oAddr: rev(atO), oPort: rev(atOp), dAddr: rev(atD), dPort: rev(atDp), proto: rev(atProto) };
  const focus: BoxKey | null = frame >= atProto ? 'proto' : frame >= atDp ? 'dPort' : frame >= atD ? 'dAddr' : frame >= atOp ? 'oPort' : frame >= atO ? 'oAddr' : null;
  const focusGate = progress(frame, insideAt - 10, 10);
  const glassAt = wordFrame(S, 's06-06', 'dentro') - 44;
  const glass = progress(frame, glassAt, 40, EASE.inOut);
  const ask = enter(frame, glassAt + 10, { distance: 10, duration: 24 });

  return (
    <>
      <Stage>
        {/* ---- the building and its offices ---- */}
        <div style={{ position: 'absolute', left: 20, top: 30, opacity: bIn, transform: `translateY(${Math.round((1 - bIn) * 18)}px)` }}>
          <Edificio
            width={400}
            height={560}
            numbers={numbers}
            sign={PORTAL_IP}
            signGlow={signGlow}
            focusOffice={officeFocus}
            glow={0.15 + 0.25 * line2Hi}
            lit={[1, 0, 0]}
          />
        </div>
        <div style={{ position: 'absolute', left: 20, top: 30 + 562, opacity: bIn }}>
          <ImageTag />
        </div>

        {/* ---- address = building, port = office ---- */}
        <div style={{ position: 'absolute', left: 520, top: 0, display: 'grid', gap: 6 }}>
          <div style={line1}>
            <Line size={46} weight={800}>
              la <span style={{ color: C.cyan }}>dirección</span> es el edificio
            </Line>
          </div>
          <div style={line2}>
            <Line size={46} weight={800}>
              el <span style={{ color: C.amber }}>puerto</span> es el despacho
            </Line>
          </div>
        </div>

        {/* ---- the laptop's ephemeral port ---- */}
        {frame >= ephemeralAt - 4 ? (
          <div style={{ position: 'absolute', left: 520, top: 150, width: 560, ...eph, opacity: eph.opacity * (1 - 0.4 * ephShift) }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
              <DeviceTile kind="laptop" tile={92} name="tu portátil" nameSize={26} />
              <div>
                <div style={{ fontFamily: FONT.sans, fontSize: 28, fontWeight: 650, color: C.muted }}>puerto de origen</div>
                <div style={{ fontFamily: FONT.mono, fontSize: 76, fontWeight: 800, color: C.amber, lineHeight: 1.05 }}>{EPHEMERAL_PORT}</div>
              </div>
            </div>
            <div style={{ marginTop: 6, fontFamily: FONT.sans, fontSize: 34, fontWeight: 750, color: C.textStrong, lineHeight: 1.22 }}>
              efímero · lo elige tu portátil
              <br />
              para esta conexión
            </div>
          </div>
        ) : null}

        {/* ---- the browser with three open connections ---- */}
        {connIn > 0.01 ? (
          <div style={{ position: 'absolute', left: 1130, top: 104, width: 598, opacity: connIn, transform: `translateX(${Math.round((1 - connIn) * 30)}px)` }}>
            <div style={{ fontFamily: FONT.sans, fontSize: 28, fontWeight: 700, color: C.muted, marginBottom: 8 }}>tu navegador: tres conexiones abiertas</div>
            {PORTS.map((port, i) => {
              const hit = i === 0 ? replyHit : 0;
              return (
                <div
                  key={port}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: 52,
                    marginTop: 8,
                    padding: '0 22px',
                    borderRadius: RADIUS.md,
                    border: `2px solid ${hit > 0.02 ? alpha(C.emerald, 0.9) : C.ink600}`,
                    background: hit > 0.02 ? alpha(C.emerald, 0.12) : C.ink850,
                    boxShadow: hit > 0.05 ? `0 0 ${Math.round(28 * hit)}px ${alpha(C.emerald, 0.4 * hit)}` : undefined,
                    opacity: i === 0 || replyHit < 0.5 ? 1 : 0.55,
                  }}
                >
                  <span style={{ fontFamily: FONT.sans, fontSize: 30, fontWeight: 650, color: C.text }}>conexión {i + 1}</span>
                  <span style={{ fontFamily: FONT.mono, fontSize: 34, fontWeight: 800, color: C.amber }}>{port}</span>
                </div>
              );
            })}
            {replyIn > 0.01 && replyHit < 0.98 ? (
              <div style={{ position: 'absolute', left: 540 - 150 * replyP, top: 50, opacity: replyIn * (1 - replyHit) }}>
                <Parcel width={50} tone="emerald" glow={0.5} />
              </div>
            ) : null}
            <div style={{ marginTop: 10, fontFamily: FONT.sans, fontSize: 28, fontWeight: 700, color: C.emerald, opacity: replyHit }}>la respuesta entra en la suya</div>
          </div>
        ) : null}

        {/* ---- the packet and its label ---- */}
        {parcelIn > 0.01 ? (
          <div style={{ position: 'absolute', left: PARCEL.x, top: PARCEL.y, width: PARCEL.w, height: PARCEL.h, opacity: parcelIn, transform: `translateY(${Math.round((1 - parcelIn) * 24)}px)` }}>
            <Parcel width={PARCEL.w} height={PARCEL.h} glow={0.12} />
            {glass > 0.02 ? (
              <div style={{ position: 'absolute', left: 0, top: 60, width: PARCEL.w, height: PARCEL.h - 60, display: 'grid', placeItems: 'center', ...ask, opacity: glass * ask.opacity }}>
                <div style={{ fontFamily: FONT.sans, fontSize: 92, fontWeight: 850, color: C.cyanSoft, whiteSpace: 'nowrap' }}>¿qué lleva?</div>
              </div>
            ) : null}
            <div style={{ position: 'absolute', left: LABEL_POS.x - PARCEL.x, top: LABEL_POS.y - PARCEL.y }}>
              <Label
                values={{ oAddr: LAPTOP.ip, oPort: EPHEMERAL_PORT, dAddr: PORTAL_IP, dPort: HTTPS_PORT, proto: 'TCP' }}
                reveal={reveal}
                glass={glass}
                focus={focusGate < 0.5 ? focus : null}
              />
            </div>
          </div>
        ) : null}
      </Stage>
      <CaseStamp scene={S} />
    </>
  );
}
