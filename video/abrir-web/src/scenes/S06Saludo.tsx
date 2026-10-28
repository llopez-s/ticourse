import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress, pulse } from '../../../engine/src/theme/motion';
import { Icon, mix, type IconName } from '../../../engine/src/ui';
import { Stage, wordFrame } from './kit';
import { DniCard } from './parts/Dni';
import { LaneArrow, Lanes, laneX, type LaneDef } from './parts/Lanes';
import { PORTAL } from './parts/data';
import { Ribbon, ribbonLit } from './parts/Ribbon';
import { ImaginaSeal } from './parts/Seal';
import { TlsLine, tlsLineHeight, tlsLineWidth } from './parts/TlsLine';

const S = 's06-saludo';
const LW = 1500;
const LH = 520;
const LTOP = 84;
const X0 = laneX(0, LW, 2);
const X1 = laneX(1, LW, 2);
const LANES: LaneDef[] = [
  { title: 'portátil', sub: 'navegador', tone: 'cyan', icon: 'laptop' },
  { title: 'portal', sub: `${PORTAL.ip} · ${PORTAL.port}`, tone: 'sky', icon: 'server' },
];

// Rows (lane-local y).
const TCP_Y = [140, 162, 184];
const HELLO = { chips: 200, arrow: 256 };
const KEYS_Y = 310;
const CERT = { chips: 346, arrow: 412 };
const PROOF = { chips: 446, arrow: 506 };

const SIZE = 32;

function Pill({ children, tone = C.text, border = C.ink600, icon, show = 1 }: { children: ReactNode; tone?: string; border?: string; icon?: IconName; show?: number }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        height: 44,
        padding: '0 20px',
        borderRadius: RADIUS.pill,
        border: `2px solid ${border}`,
        background: alpha(C.ink950, 0.94),
        fontFamily: FONT.sans,
        fontSize: SIZE,
        fontWeight: 750,
        color: tone,
        whiteSpace: 'nowrap',
        opacity: show,
        transform: `translateY(${(1 - show) * 10}px)`,
      }}
    >
      {icon ? <Icon name={icon} size={30} color={tone} /> : null}
      {children}
    </span>
  );
}

/** A row of pills centred on the lanes' middle at lane-local y. */
function PillRow({ y, items, shows }: { y: number; items: { text: ReactNode; tone?: string; border?: string; icon?: IconName }[]; shows: number[] }) {
  return (
    <div style={{ position: 'absolute', left: 0, top: y, width: LW, display: 'flex', justifyContent: 'center', gap: 14 }}>
      {items.map((it, i) => (
        <Pill key={i} tone={it.tone} border={it.border} icon={it.icon} show={shows[i] ?? 0}>
          {it.text}
        </Pill>
      ))}
    </div>
  );
}

/**
 * s06-saludo «Hola, soy el portal».
 *   tcp      three small arrows (the greeting of the previous video) and the TCP box of the ribbon lights;
 *   channel  «un canal protegido» is announced;  hello  the browser's hello: who it wants to talk to and which ciphers it knows;
 *   keys     a little key «claves de sesión» appears on BOTH sides at once;  cert  the portal's hello with its
 *            certificate (the DNI travels with it);  proof  the signature made with the private key;
 *   copy     a grey «copia del certificado» tries to sign and cannot;
 *   line     the connection line in V11's style (no date) and the TLS box lights; the exam card 1.4 follows.
 */
export function S06Saludo(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  const tcp = props.cue('tcp');
  const channel = props.cue('channel');
  const hello = props.cue('hello');
  const keys = props.cue('keys');
  const cert = props.cue('cert');
  const proof = props.cue('proof');
  const copy = props.cue('copy');
  const line = props.cue('line');

  // ---- TCP.
  const tcpAt = [w('s06-01', 'conexión'), w('s06-01', 'TCP'), w('s06-01', '443')];
  const tcpDraw = tcpAt.map((a) => progress(frame, a, 16, EASE.inOut));
  const tcpChip = progress(frame, tcpAt[1], 12);
  const tcpDim = 0.55 * progress(frame, channel, 20);

  // ---- Hello.
  const helloShows = [w('s06-03', 'saluda'), w('s06-03', 'quiere'), w('s06-03', 'cifrar')].map((a) => progress(frame, a - 6, 12));
  const helloDraw = progress(frame, hello + 2, 22, EASE.inOut);
  const helloDim = 0.5 * progress(frame, cert, 20);

  // ---- Keys on both sides, then the encrypted tube between them.
  const keysIn = progress(frame, keys, 14);
  const tubeFrom = w('s06-06', 'viaja') - 6;
  const tubeIn = progress(frame, tubeFrom, 18) * (1 - progress(frame, line - 10, 14));
  const keysGlow = 0.5 + 0.5 * pulse(frame, 30, 0.8);

  // ---- Certificate and proof.
  const certShows = [0, 10, 22].map((d) => progress(frame, cert + d, 12));
  const certDraw = progress(frame, cert + 2, 22, EASE.inOut);
  const dniTravel = progress(frame, cert + 14, 36, EASE.inOut);
  const certDim = 0.5 * progress(frame, proof, 20);
  const proofShow = progress(frame, proof, 14);
  const proofDraw = progress(frame, proof + 8, 22, EASE.inOut);

  // ---- The copy that cannot sign.
  const copyIn = progress(frame, copy, 16);
  const scribble = progress(frame, copy + 14, 26, EASE.linear);
  const fail = progress(frame, copy + 46, 10);
  const failText = progress(frame, copy + 58, 14);

  // ---- The line.
  const lanesOut = progress(frame, line - 12, 18, EASE.inOut);
  const lineIn = progress(frame, line + 4, 20);
  const meaning = [progress(frame, line + 40, 14), progress(frame, line + 56, 14)];

  const lineW = tlsLineWidth(44);
  const lineH = tlsLineHeight(44);

  return (
    <Stage>
      <Ribbon lit={ribbonLit(frame, { TCP: tcpAt[2] + 8, TLS: line }, ['DHCP', 'DNS'])} />

      {lanesOut < 1 ? (
        <div style={{ position: 'absolute', left: 0, top: LTOP, opacity: 1 - lanesOut }}>
          <Lanes lanes={LANES} width={LW} height={LH} at={tcp - 4} glow={[0, 0]}>
            {/* TCP: three little arrows */}
            {TCP_Y.map((y, i) => (
              <LaneArrow key={i} x1={i === 1 ? X1 - 14 : X0 + 14} x2={i === 1 ? X0 + 14 : X1 - 14} y={y} draw={tcpDraw[i]} color={C.sky} width={3} dim={tcpDim} />
            ))}
            {tcpChip > 0 ? (
              <div style={{ position: 'absolute', left: LW / 2, top: TCP_Y[1] - 22, transform: 'translateX(-50%)', opacity: tcpChip * (1 - tcpDim * 0.6) }}>
                <Pill tone={C.cyanSoft} border={alpha(C.cyan, 0.7)}>
                  TCP
                </Pill>
              </div>
            ) : null}

            {/* hello */}
            <PillRow
              y={HELLO.chips}
              shows={helloShows.map((s) => s * (1 - 0.5 * helloDim))}
              items={[{ text: 'hola' }, { text: 'quiero hablar con el portal de reservas' }, { text: 'sé estos cifrados' }]}
            />
            <LaneArrow x1={X0 + 14} x2={X1 - 14} y={HELLO.arrow} draw={helloDraw} color={C.cyan} dim={helloDim} />

            {/* keys on both sides */}
            {keysIn > 0 ? (
              <>
                {[X0, X1].map((x, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: x,
                      top: KEYS_Y - 28,
                      transform: `translateX(-50%) scale(${0.8 + 0.2 * keysIn})`,
                      opacity: keysIn,
                      filter: `drop-shadow(0 0 ${Math.round(14 * keysGlow)}px ${alpha('#cbd5e1', 0.35)})`,
                    }}
                  >
                    <Pill tone="#e2e8f0" border={alpha('#cbd5e1', 0.8)} icon="key">
                      claves de sesión
                    </Pill>
                  </div>
                ))}
                {/* the encrypted tube */}
                {tubeIn > 0 ? (
                  <div style={{ position: 'absolute', left: X0 + 190, top: KEYS_Y - 20, width: X1 - X0 - 380, height: 40, opacity: tubeIn }}>
                    <div style={{ position: 'absolute', inset: 0, borderRadius: 20, border: `3px solid ${alpha('#cbd5e1', 0.7)}`, background: alpha('#cbd5e1', 0.08), overflow: 'hidden' }}>
                      {[0, 1, 2, 3, 4, 5].map((k) => {
                        const t = ((frame * 0.012 + k / 6) % 1 + 1) % 1;
                        return (
                          <span
                            key={k}
                            style={{
                              position: 'absolute',
                              left: `${t * 100}%`,
                              top: 9,
                              width: 14 + ((k * 7) % 4) * 6,
                              height: 16,
                              borderRadius: 4,
                              background: alpha('#cbd5e1', 0.65),
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </>
            ) : null}

            {/* certificate */}
            <PillRow
              y={CERT.chips}
              shows={certShows.map((s) => s * (1 - 0.5 * certDim))}
              items={[{ text: 'hola', tone: '#bae6fd' }, { text: 'usamos este', tone: '#bae6fd' }, { text: 'aquí va mi certificado', tone: '#bae6fd' }]}
            />
            <LaneArrow x1={X1 - 14} x2={X0 + 14} y={CERT.arrow} draw={certDraw} color={C.sky} dim={certDim} />
            {dniTravel > 0 ? (
              <div style={{ position: 'absolute', left: mix(X1 - 70, X0 + 40, dniTravel), top: CERT.arrow - 23, opacity: 1 - 0.5 * certDim }}>
                <DniCard width={72} />
              </div>
            ) : null}

            {/* private-key proof */}
            {proofShow > 0 ? (
              <div style={{ position: 'absolute', left: 0, top: PROOF.chips, width: LW, display: 'flex', justifyContent: 'center' }}>
                <Pill tone="#bae6fd" icon="key" show={proofShow}>
                  y esta firma, hecha con mi clave privada
                </Pill>
              </div>
            ) : null}
            <LaneArrow x1={X1 - 14} x2={X0 + 14} y={PROOF.arrow} draw={proofDraw} color={C.sky} />
          </Lanes>

          {/* the copy that cannot sign */}
          {copyIn > 0 ? (
            <div style={{ position: 'absolute', left: 1500, top: 250, width: 224, opacity: copyIn, transform: `translateY(${(1 - copyIn) * 16}px)`, fontFamily: FONT.sans, textAlign: 'center' }}>
              <div style={{ fontSize: 30, fontWeight: 750, color: C.muted, lineHeight: 1.15 }}>copia del certificado</div>
              <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center', filter: 'grayscale(1)', opacity: 0.85 }}>
                <DniCard width={120} />
              </div>
              <svg width={200} height={70} viewBox="0 0 200 70" style={{ display: 'block', margin: '12px auto 0', overflow: 'visible' }}>
                <path
                  d="M 8 46 C 22 10, 36 10, 44 40 S 62 62, 76 30 S 98 8, 112 38 S 134 60, 150 28 S 170 14, 190 40"
                  fill="none"
                  stroke={C.muted}
                  strokeWidth={5}
                  strokeLinecap="round"
                  strokeDasharray="6 9"
                  pathLength={1}
                  style={{ strokeDasharray: `${scribble} 1` }}
                />
                {fail > 0 ? (
                  <g stroke={C.rose} strokeWidth={8} strokeLinecap="round" opacity={fail}>
                    <path d="M 84 8 L 124 62 M 124 8 L 84 62" />
                  </g>
                ) : null}
              </svg>
              <div style={{ marginTop: 4, fontSize: 28, fontWeight: 750, color: C.roseSoft, opacity: failText, lineHeight: 1.15 }}>sin la clave privada</div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* the connection line */}
      {lineIn > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1728, height: 660, fontFamily: FONT.sans }}>
          <div style={{ position: 'absolute', left: (1728 - lineW) / 2, top: 230 + (1 - lineIn) * 16, opacity: lineIn }}>
            <TlsLine size={44} show={1} />
          </div>
          <div style={{ position: 'absolute', left: 0, top: 230 + lineH + 52, width: 1728, display: 'flex', justifyContent: 'center', gap: 36 }}>
            <MeaningChip icon="eyeOff" tone={C.sky} show={meaning[0]}>
              canal cifrado
            </MeaningChip>
            <MeaningChip icon="user" tone={C.emerald} show={meaning[1]}>
              prueba de con quién hablas
            </MeaningChip>
          </div>
        </div>
      ) : null}

      <ImaginaSeal />
    </Stage>
  );
}

function MeaningChip({ children, icon, tone, show }: { children: ReactNode; icon: IconName; tone: string; show: number }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 16,
        padding: '10px 32px',
        borderRadius: RADIUS.pill,
        border: `3px solid ${alpha(tone, 0.7)}`,
        background: alpha(tone, 0.1),
        fontFamily: FONT.sans,
        fontSize: 42,
        fontWeight: 800,
        color: C.textStrong,
        whiteSpace: 'nowrap',
        opacity: show,
        transform: `translateY(${(1 - show) * 14}px)`,
      }}
    >
      <Icon name={icon} size={46} color={tone} strokeWidth={2} />
      {children}
    </span>
  );
}
