import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Chip } from '../../../engine/src/ui/Chip';
import { Icon } from '../../../engine/src/ui/Icon';
import { Stage, wordFrame } from './kit';
import { EPHEMERAL_PORT, HTTPS_PORT, LAPTOP, PORTAL_IP } from './parts/data';
import { DeviceTile, Parcel } from './parts/Glyphs';
import { ContestadorImg, IMG_H, LlamadaImg } from './parts/Imagenes';
import { Label, LABEL_W, type BoxKey } from './parts/Label';
import { CaseStamp, ImageTag, Line } from './parts/Marks';

const S = 's07-llamada';
const COL_W = 840;
const RIGHT_X = 888;
const LANE_X0 = 100;
const LANE_X1 = 740;
const LABEL_X = Math.round((1728 - LABEL_W) / 2);
const LABEL_Y = 478;
const DNS_Y = 272;

/** A short arrow of the TCP greeting (`dir` 1 = to the portal, -1 = back), drawn from its tail. */
function GreetArrow({ x0, x1, y, dir, p, text }: { x0: number; x1: number; y: number; dir: 1 | -1; p: number; text: string }) {
  const len = x1 - x0;
  const a = dir === 1 ? x0 : x1;
  const b = dir === 1 ? x0 + len * p : x1 - len * p;
  const head = dir === 1 ? [b, b - 16, b - 16] : [b, b + 16, b + 16];
  return (
    <g opacity={Math.min(1, p * 4)}>
      <line x1={a} y1={y} x2={b} y2={y} stroke={C.cyan} strokeWidth={5} strokeLinecap="round" />
      {p > 0.15 ? <polygon points={`${head[0]},${y} ${head[1]},${y - 12} ${head[2]},${y + 12}`} fill={C.cyan} /> : null}
      <text x={(x0 + x1) / 2} y={y - 20} textAnchor="middle" fontFamily={FONT.sans} fontSize={29} fontWeight={700} fill={C.cyanSoft} opacity={p}>
        {text}
      </text>
    </g>
  );
}

/**
 * s07-llamada «Llamada o contestador». Two columns lit in turn, both dim at the start («dos maneras»): the left
 * one is a phone call (`call` the greeting in three short arrows, `resend` three numbered segments with a
 * «recibido» each, the second one lost and sent again, `tcp` the label's small box says TCP), the right one an
 * answering machine (`message` the note goes in and nobody confirms, `udp` the small box turns to UDP, `dns` a
 * «DNS · UDP» query that gets no answer and is asked again). `wrap`: the two guarantees line. No word about
 * security: TCP is not «más seguro».
 */
export function S07Llamada(props: SceneProps) {
  const frame = useCurrentFrame();
  const callAt = props.cue('call');
  const resendAt = props.cue('resend');
  const tcpAt = props.cue('tcp');
  const messageAt = props.cue('message');
  const udpAt = props.cue('udp');
  const dnsAt = props.cue('dns');
  const wrapAt = props.cue('wrap');
  const wf = (seg: string, w: string, n = 0) => wordFrame(S, seg, w, n);

  // ---- column focus: both dim at first, the left one on `call`, the right one on `message` ----
  const leftOn = progress(frame, callAt - 6, 14);
  const rightOn = progress(frame, messageAt - 6, 14);
  const leftDim = 1 - 0.55 * progress(frame, messageAt - 6, 14);
  const wrapDim = 1 - 0.65 * progress(frame, wrapAt - 6, 14);
  const leftOpacity = (0.4 + 0.6 * leftOn) * leftDim * wrapDim;
  const rightOpacity = (0.4 + 0.6 * rightOn) * wrapDim;
  const introIn = progress(frame, 0, 20);
  const headline = progress(frame, 8, 18) * (1 - progress(frame, callAt - 6, 12));

  // ---- the call and its bubbles ----
  const b0 = progress(frame, wf('s07-02', 'descuelga') - 4, 12);
  const b1 = progress(frame, wf('s07-03', 'oye') - 6, 12);
  const b2 = progress(frame, wf('s07-03', 'repites') - 6, 12);
  const hsCall = progress(frame, callAt, 12);

  // ---- the greeting ----
  const g0 = progress(frame, wf('s07-02', 'descuelga'), 16);
  const g1 = progress(frame, wf('s07-02', 'y'), 16);
  const g2 = progress(frame, wf('s07-02', 'saludáis') - 2, 16);

  // ---- segments 1 2 3 ----
  const segSpan = LANE_X1 - LANE_X0 - 56;
  const s1At = wf('s07-03', 'comprobando');
  const s2At = Math.max(s1At + 36, wf('s07-03', 'frase') - 6);
  const lostAt = Math.max(s2At + 22, wf('s07-03', 'pierde') + 4);
  const s2bAt = wf('s07-03', 'repites') - 12;
  const s3At = s2bAt + 14;
  const t1 = progress(frame, s1At, 30, EASE.inOut);
  const t2 = frame < lostAt ? progress(frame, s2At, lostAt - s2At, EASE.out) * 0.45 : 0.45;
  const lostFade = progress(frame, lostAt, 12);
  const t2b = progress(frame, s2bAt, 28, EASE.inOut);
  const t3 = progress(frame, s3At, 28, EASE.inOut);
  const ok1 = progress(frame, s1At + 30, 10);
  const lost = progress(frame, lostAt + 4, 10) * (1 - progress(frame, s2bAt + 28, 8));
  const ok2 = progress(frame, s2bAt + 28, 10);
  const ok3 = progress(frame, s3At + 28, 10);
  const px = (t: number) => LANE_X0 + 6 + segSpan * t;

  // ---- the answering machine ----
  const msg = progress(frame, messageAt, 44, EASE.inOut);
  const silent = progress(frame, wf('s07-05', 'confirmación') - 6, 14);
  const imgGlow = progress(frame, messageAt, 14) * (1 - progress(frame, udpAt, 14));

  // ---- the label and the guarantee panels ----
  const labelIn = progress(frame, tcpAt - 10, 16);
  const isUdp = frame >= udpAt;
  const protoAt = isUdp ? udpAt : tcpAt;
  const reveal: Partial<Record<BoxKey, number>> = { oAddr: 1, oPort: 1, dAddr: 1, dPort: 1, proto: progress(frame, protoAt, 12, EASE.linear) };
  const protoFocus = frame >= tcpAt && frame < tcpAt + 150 ? 'proto' : frame >= udpAt && frame < udpAt + 150 ? 'proto' : null;
  const labelOut = 1 - progress(frame, wrapAt - 8, 12);
  const tcpPanel = enter(frame, tcpAt, { distance: 16 });
  const udpPanel = enter(frame, udpAt, { distance: 16 });
  const chipsT = [0, 1, 2].map((i) => progress(frame, tcpAt + 8 + i * 8, 10));
  const chipsU = [0, 1, 2].map((i) => progress(frame, udpAt + 8 + i * 8, 10));

  // ---- DNS ----
  const dnsIn = progress(frame, dnsAt - 4, 14);
  const q1 = progress(frame, dnsAt + 6, 36, EASE.inOut);
  const noAns = progress(frame, wf('s07-06', 'respuesta') - 4, 12);
  const q2At = Math.max(wf('s07-06', 'preguntar') - 34, dnsAt + 70);
  const q2 = progress(frame, q2At, 36, EASE.inOut);
  const again = progress(frame, q2At, 12);
  const dnsX = (t: number) => RIGHT_X + 96 + (COL_W - 96 - 150) * t;

  // ---- wrap ----
  const w1 = enter(frame, wrapAt - 2, { distance: 16 });
  const w2 = enter(frame, wrapAt + 12, { distance: 16 });

  return (
    <>
      <Stage>
        {/* «dos maneras de entregar» while the voice sets the scene (s07-01) */}
        {headline > 0.01 ? (
          <div style={{ position: 'absolute', left: 0, top: 320, width: 1728, display: 'flex', justifyContent: 'center', opacity: headline, transform: `translateY(${Math.round((1 - headline) * 14)}px)` }}>
            <Line size={72} weight={850}>
              dos maneras de <span style={{ color: C.cyan }}>entregar</span>
            </Line>
          </div>
        ) : null}
        {/* ================= left column: the call ================= */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: COL_W, opacity: leftOpacity * introIn }}>
          <LlamadaImg bubbles={[b0, b1, b2]} glow={leftOn * (1 - progress(frame, messageAt - 6, 14))} />
          <div style={{ position: 'absolute', left: 0, top: IMG_H + 4 }}>
            <ImageTag />
          </div>
          {/* greeting */}
          <svg width={COL_W} height={100} style={{ position: 'absolute', left: 0, top: 252, overflow: 'visible', opacity: hsCall }}>
            <GreetArrow x0={LANE_X0 + 14} x1={LANE_X0 + 214} y={50} dir={1} p={g0} text="¿hablamos?" />
            <GreetArrow x0={LANE_X0 + 232} x1={LANE_X0 + 432} y={50} dir={-1} p={g1} text="sí, te oigo" />
            <GreetArrow x0={LANE_X0 + 450} x1={LANE_X0 + 650} y={50} dir={1} p={g2} text="vale" />
          </svg>
          <div style={{ position: 'absolute', left: 0, top: 268, opacity: hsCall }}>
            <DeviceTile kind="laptop" tile={64} />
          </div>
          <div style={{ position: 'absolute', left: LANE_X1 + 28, top: 268, opacity: hsCall }}>
            <DeviceTile kind="server" tile={64} />
          </div>
          {/* the three numbered segments */}
          {frame >= resendAt - 4 ? (
            <>
              <div style={{ position: 'absolute', left: LANE_X0 - 6, top: 385, width: LANE_X1 - LANE_X0 + 12, height: 0, borderTop: `3px dashed ${alpha(C.cyan, 0.3)}` }} />
              {t1 < 0.995 ? (
                <div style={{ position: 'absolute', left: px(t1), top: 364, opacity: progress(frame, s1At - 6, 8) }}>
                  <Parcel width={56} mark="1" markSize={28} glow={0.4} />
                </div>
              ) : null}
              {frame >= s2At && lostFade < 0.98 ? (
                <div style={{ position: 'absolute', left: px(t2), top: 364, opacity: 1 - lostFade, filter: `saturate(${1 - 0.5 * lostFade})` }}>
                  <Parcel width={56} mark="2" markSize={28} tone="amber" glow={0.4} />
                </div>
              ) : null}
              {frame >= s2bAt && t2b < 0.995 ? (
                <div style={{ position: 'absolute', left: px(t2b), top: 364 }}>
                  <Parcel width={56} mark="2" markSize={28} glow={0.4} />
                </div>
              ) : null}
              {frame >= s3At && t3 < 0.995 ? (
                <div style={{ position: 'absolute', left: px(t3), top: 364 }}>
                  <Parcel width={56} mark="3" markSize={28} glow={0.4} />
                </div>
              ) : null}
              {/* the loss marker */}
              <div style={{ position: 'absolute', left: px(0.45) + 70, top: 366, opacity: lost * (1 - progress(frame, s2bAt, 8)) }}>
                <Icon name="x" size={44} color={C.amber} strokeWidth={3.4} />
              </div>
              {/* «recibido» under each slot */}
              {[ok1, ok2, ok3].map((p, i) => (
                <div key={i} style={{ position: 'absolute', left: 130 + i * 210, top: 414, display: 'flex', alignItems: 'center', gap: 8, opacity: p, fontFamily: FONT.sans, fontSize: 28, fontWeight: 750, color: C.emerald, whiteSpace: 'nowrap' }}>
                  <Icon name="check" size={28} color={C.emerald} strokeWidth={3.2} />
                  {i + 1} recibido
                </div>
              ))}
              <div style={{ position: 'absolute', left: 130 + 210, top: 414, display: 'flex', alignItems: 'center', gap: 8, opacity: lost, fontFamily: FONT.sans, fontSize: 28, fontWeight: 750, color: C.amber, whiteSpace: 'nowrap' }}>
                <Icon name="x" size={28} color={C.amber} strokeWidth={3.2} />2 se pierde
              </div>
            </>
          ) : null}
        </div>

        {/* ================= right column: the answering machine ================= */}
        <div style={{ position: 'absolute', left: RIGHT_X, top: 0, width: COL_W, opacity: rightOpacity * introIn }}>
          <ContestadorImg msg={msg} silent={silent} glow={imgGlow} />
          <div style={{ position: 'absolute', left: 0, top: IMG_H + 4 }}>
            <ImageTag />
          </div>
          {/* DNS query: it gets no answer and is asked again */}
          {dnsIn > 0.01 ? (
            <div style={{ position: 'absolute', left: 0, top: DNS_Y, width: COL_W, opacity: dnsIn }}>
              <div style={{ position: 'absolute', left: 8, top: 48 }}>
                <DeviceTile kind="laptop" tile={64} />
              </div>
              <div style={{ position: 'absolute', left: COL_W - 80, top: 48 }}>
                <DeviceTile kind="server" tile={64} />
              </div>
              <div style={{ position: 'absolute', left: 96, top: 80, width: COL_W - 96 - 110, height: 0, borderTop: `3px dashed ${alpha(C.amber, 0.35)}` }} />
              <div style={{ position: 'absolute', left: 150, top: 0 }}>
                <Chip accent="amber" size={30}>
                  DNS · UDP
                </Chip>
              </div>
            </div>
          ) : null}
        </div>
        {dnsIn > 0.01 ? (
          <div style={{ opacity: wrapDim }}>
            {q1 < 0.99 ? (
              <div style={{ position: 'absolute', left: dnsX(q1), top: DNS_Y + 80 - 22 }}>
                <Parcel width={56} tone="amber" glow={0.4} />
              </div>
            ) : null}
            {frame >= q2At && q2 < 0.99 ? (
              <div style={{ position: 'absolute', left: dnsX(q2), top: DNS_Y + 80 - 22 }}>
                <Parcel width={56} tone="amber" glow={0.4} />
              </div>
            ) : null}
            <div style={{ position: 'absolute', left: RIGHT_X + 150, top: DNS_Y + 120, display: 'flex', alignItems: 'center', gap: 14, opacity: noAns }}>
              <Icon name="x" size={40} color={C.amber} strokeWidth={3.2} />
              <span style={{ fontFamily: FONT.sans, fontSize: 36, fontWeight: 800, color: C.amber, whiteSpace: 'nowrap' }}>sin respuesta</span>
            </div>
            <div style={{ position: 'absolute', left: RIGHT_X + 150, top: DNS_Y + 166, opacity: again, fontFamily: FONT.sans, fontSize: 32, fontWeight: 700, color: C.text, whiteSpace: 'nowrap' }}>
              el programa pregunta otra vez
            </div>
          </div>
        ) : null}

        {/* ================= the label (small box: TCP / UDP) and the two guarantee panels ================= */}
        {labelIn > 0.01 ? (
          <div style={{ position: 'absolute', left: LABEL_X, top: LABEL_Y + Math.round((1 - labelIn) * 20), opacity: labelIn * labelOut }}>
            <Label
              values={{ oAddr: LAPTOP.ip, oPort: EPHEMERAL_PORT, dAddr: PORTAL_IP, dPort: HTTPS_PORT, proto: isUdp ? 'UDP' : 'TCP' }}
              reveal={reveal}
              focus={protoFocus}
              tones={{ proto: isUdp ? 'amber' : 'cyan' }}
            />
          </div>
        ) : null}
        {frame >= tcpAt - 4 ? (
          <div style={{ position: 'absolute', left: 0, top: LABEL_Y + 2, width: 470, ...tcpPanel, opacity: tcpPanel.opacity * labelOut }}>
            <Line size={72} weight={850} color={C.cyan}>
              TCP
            </Line>
            <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
              {['conexión', 'orden', 'reenvío'].map((t, i) => (
                <div key={t} style={{ opacity: chipsT[i] }}>
                  <Chip accent="cyan" size={30}>
                    {t}
                  </Chip>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        {frame >= udpAt - 4 ? (
          <div style={{ position: 'absolute', left: 1728 - 460, top: LABEL_Y + 2, width: 460, ...udpPanel, opacity: udpPanel.opacity * labelOut }}>
            <Line size={72} weight={850} color={C.amber}>
              UDP
            </Line>
            <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {['sin conexión', 'sin orden', 'sin reenvío'].map((t, i) => (
                <div key={t} style={{ opacity: chipsU[i] }}>
                  <Chip accent="amber" size={30}>
                    {t}
                  </Chip>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* ================= wrap ================= */}
        {frame >= wrapAt - 4 ? (
          <>
            <div style={{ position: 'absolute', left: 0, top: 468, width: COL_W, ...w1 }}>
              <Line size={72} weight={850} color={C.cyan}>
                TCP
              </Line>
              <Line size={50} weight={800} style={{ marginTop: 6 }}>
                las garantías vienen de serie
              </Line>
            </div>
            <div style={{ position: 'absolute', left: RIGHT_X, top: 468, width: COL_W, ...w2 }}>
              <Line size={72} weight={850} color={C.amber}>
                UDP
              </Line>
              <Line size={50} weight={800} style={{ marginTop: 6 }}>
                si hacen falta,
              </Line>
              <Line size={50} weight={800}>
                las pone el programa
              </Line>
            </div>
          </>
        ) : null}
      </Stage>
      <CaseStamp scene={S} />
    </>
  );
}
