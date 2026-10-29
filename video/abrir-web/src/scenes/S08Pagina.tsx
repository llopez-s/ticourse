import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, Redacted } from '../../../engine/src/ui';
import { Stage, wordFrame } from './kit';
import { Pill } from './parts/Bits';
import { HTTP } from './parts/data';
import { Ribbon, ribbonLit } from './parts/Ribbon';
import { ImaginaSeal } from './parts/Seal';
import { TUBE_H, TlsTube } from './parts/TlsTube';

const S = 's08-pagina';
const TUBE = { left: 260, top: 306 };
const MID_Y = TUBE.top + TUBE_H / 2;
const REQ = { left: 260, top: 98, width: 650 };
const RES = { left: 960, top: 98, width: 508 };
const MONO = FONT.mono;
const LENS_X = TUBE.left + 130;

/**
 * s08-pagina «Por fin, la página».
 *   request  the browser's request shell (HTTP lights on the ribbon on the word);  get  «GET /reservas» + Host;
 *   cookie   the cookie line;  ok  the answer «200 OK · página»;  tube  both cards sink into an OPAQUE tube
 *   labelled TLS;  https  the label becomes «HTTPS = HTTP dentro de TLS»;  observer  a magnifier on the tube sees
 *   only noise; beside it the observer reads the address and (greyed) the site name, the rest is covered.
 */
export function S08Pagina(props: SceneProps) {
  const frame = useCurrentFrame();
  const get = props.cue('get');
  const cookie = props.cue('cookie');
  const ok = props.cue('ok');
  const tube = props.cue('tube');
  const https = props.cue('https');
  const observer = props.cue('observer');

  const httpAt = wordFrame(S, 's08-01', 'HTTP');
  const wDireccion = wordFrame(S, 's08-06', 'dirección');
  const wNombre = wordFrame(S, 's08-06', 'nombre');
  const wPero = wordFrame(S, 's08-06', 'Pero');

  // ---- Request and response cards.
  const reqIn = progress(frame, 2, 12);
  const getIn = progress(frame, get - 2, 14);
  const hostIn = progress(frame, get + 10, 14);
  const cookieIn = progress(frame, cookie - 2, 14);
  const okIn = progress(frame, ok - 2, 16);
  const sink = progress(frame, tube, 26, EASE.inOut);
  const cardsGone = progress(frame, tube + 14, 14);
  const dy = sink * (MID_Y - 48 - REQ.top);
  const sc = 1 - 0.5 * sink;

  // ---- Tube.
  const cover = progress(frame, tube + 8, 20);
  const tubeLabel = progress(frame, tube + 12, 14);
  const httpsMix = progress(frame, https, 14);

  // ---- Observer.
  const lensIn = progress(frame, observer - 4, 16);
  const ipIn = progress(frame, wDireccion, 12);
  const nameIn = progress(frame, wNombre, 12);
  const coverIn = progress(frame, wPero, 14);

  const label = (
    <div style={{ position: 'relative', width: 760, height: 76 }}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 1 - httpsMix }}>
        <Pill size={44} tone={C.textStrong} border={alpha(C.sky, 0.85)} style={{ transform: 'none' }}>
          {HTTP.tubeLabel}
        </Pill>
      </div>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: httpsMix }}>
        <Pill size={40} tone={C.textStrong} border={alpha(C.cyan, 0.9)} style={{ transform: 'none' }}>
          {HTTP.httpsLabel}
        </Pill>
      </div>
    </div>
  );

  return (
    <Stage>
      <Ribbon lit={ribbonLit(frame, { HTTP: httpAt }, ['DHCP', 'DNS', 'TCP', 'TLS'])} />

      {/* the two ends */}
      <End x={20} icon="laptop" label="portátil" tone={C.cyan} />
      <End x={1558} icon="server" label="portal" tone={C.sky} />

      {/* the tube: see-through until the cards go in, then opaque with noise */}
      <div style={{ position: 'absolute', left: TUBE.left, top: TUBE.top }}>
        <TlsTube label={label} labelShow={tubeLabel} cover={cover} glow={httpsMix * 0.8} />
      </div>

      {/* request */}
      <div style={{ position: 'absolute', left: REQ.left, top: REQ.top, width: REQ.width, opacity: reqIn * (1 - cardsGone), transform: `translateY(${dy}px) scale(${sc})`, transformOrigin: 'center top' }}>
        <HttpCard title="petición" tone={C.cyan}>
          <Line show={getIn} mono>
            <span style={{ color: C.cyanSoft, fontWeight: 800 }}>GET</span>{' /reservas'}
          </Line>
          <Line show={hostIn} mono>
            {HTTP.host}
          </Line>
          <Line show={cookieIn} mono>
            <span style={{ color: C.amber }}>{HTTP.cookie}</span>
          </Line>
        </HttpCard>
      </div>

      {/* response */}
      <div style={{ position: 'absolute', left: RES.left, top: RES.top, width: RES.width, opacity: okIn * (1 - cardsGone), transform: `translateY(${dy}px) scale(${sc})`, transformOrigin: 'center top' }}>
        <HttpCard title="respuesta" tone={C.emerald}>
          <Line show={okIn} mono>
            <span style={{ color: '#6ee7b7', fontWeight: 800, fontSize: 38 }}>{HTTP.ok}</span>
          </Line>
          <Line show={okIn}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
              <Icon name="file" size={34} color={C.sky} />
              {HTTP.page}
            </span>
          </Line>
        </HttpCard>
      </div>

      {/* the observer */}
      <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
        {lensIn > 0.01 ? (
          <g opacity={lensIn}>
            <circle cx={LENS_X} cy={MID_Y} r={86} fill={alpha(C.ink950, 0.55)} stroke={C.textStrong} strokeWidth={6} />
            <path d={`M ${LENS_X + 61} ${MID_Y - 61} L ${LENS_X + 120} ${MID_Y - 120}`} stroke={C.textStrong} strokeWidth={12} strokeLinecap="round" />
            {/* the noise the lens sees inside the tube */}
            {[0, 1, 2, 3, 4].map((k) => (
              <rect
                key={k}
                x={LENS_X - 62 + ((k * 29 + frame * (1 + k * 0.3)) % 110)}
                y={MID_Y - 52 + k * 20}
                width={26 + k * 4}
                height={10}
                rx={4}
                fill={alpha(C.sky, 0.55)}
              />
            ))}
          </g>
        ) : null}
      </svg>

      {lensIn > 0.01 ? (
        <>
          <div style={{ position: 'absolute', left: LENS_X - 42, top: MID_Y + 104, opacity: lensIn }}>
            <Icon name="user" size={84} color={C.muted} strokeWidth={1.8} />
          </div>
          <div style={{ position: 'absolute', left: LENS_X + 56, top: MID_Y + 112, opacity: ipIn, transform: `translateY(${(1 - ipIn) * 10}px)` }}>
            <Pill size={36} mono tone={C.textStrong} border={alpha(C.amber, 0.8)}>
              {HTTP.observerIp}
            </Pill>
          </div>
          <div style={{ position: 'absolute', left: LENS_X + 360, top: MID_Y + 114, opacity: nameIn, transform: `translateY(${(1 - nameIn) * 10}px)` }}>
            <Pill size={30} tone={C.muted} border={C.ink600}>
              {HTTP.observerName}
            </Pill>
          </div>
          <div style={{ position: 'absolute', left: LENS_X + 56, top: MID_Y + 196, width: 700, display: 'flex', alignItems: 'center', gap: 22, opacity: coverIn }}>
            <span style={{ fontFamily: FONT.sans, fontSize: 28, fontWeight: 700, color: C.muted, whiteSpace: 'nowrap' }}>ruta y contenido</span>
            <Redacted width={190} height={24} tone="muted" strength={0.7} />
            <Redacted width={250} height={24} tone="muted" strength={0.6} />
          </div>
        </>
      ) : null}

      <ImaginaSeal />
    </Stage>
  );
}

function End({ x, icon, label, tone }: { x: number; icon: 'laptop' | 'server'; label: string; tone: string }) {
  return (
    <div style={{ position: 'absolute', left: x, top: MID_Y - 70, width: 150, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, fontFamily: FONT.sans }}>
      <div style={{ width: 130, height: 130, borderRadius: 28, display: 'grid', placeItems: 'center', border: `3px solid ${alpha(tone, 0.7)}`, background: alpha(tone, 0.1) }}>
        <Icon name={icon} size={80} color={tone} strokeWidth={1.8} />
      </div>
      <span style={{ fontSize: 32, fontWeight: 750, color: C.text }}>{label}</span>
    </div>
  );
}

function HttpCard({ title, tone, children }: { title: string; tone: string; children: ReactNode }) {
  return (
    <div style={{ boxSizing: 'border-box', borderRadius: RADIUS.lg, border: `3px solid ${alpha(tone, 0.7)}`, background: alpha(C.ink900, 0.97), boxShadow: `0 0 28px ${alpha(tone, 0.18)}`, overflow: 'hidden', fontFamily: FONT.sans }}>
      <div style={{ padding: '8px 22px', background: alpha(tone, 0.16), fontSize: 28, fontWeight: 800, letterSpacing: 1, color: tone }}>{title} HTTP</div>
      <div style={{ padding: '10px 22px 14px', minHeight: 140 }}>{children}</div>
    </div>
  );
}

function Line({ children, show, mono = false }: { children: ReactNode; show: number; mono?: boolean }) {
  return (
    <div style={{ height: 46, display: 'flex', alignItems: 'center', fontFamily: mono ? MONO : FONT.sans, fontSize: 31, fontWeight: 600, color: C.textStrong, whiteSpace: 'nowrap', opacity: show, transform: `translateX(${(1 - show) * -14}px)` }}>
      {children}
    </div>
  );
}

