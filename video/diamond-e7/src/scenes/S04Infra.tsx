import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, fadeIn, progress } from '../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../engine/src/ui';
import { E7_VALUES, WIDE_CARD } from '../data/s04-infra';
import { Stage, segment, wordFrame } from './kit';
import { Diamond, vertexPoint } from './parts/Diamond';

const SCENE = 's04-infra';

// Diamond shifted left so the right column (x ≥ 1180) holds the cert and trap cards.
const GEO = { cx: 560, cy: 330, hw: 360, hh: 225 };
const CAP = vertexPoint('cap', GEO);
const INFRA = vertexPoint('infra', GEO);
const INFRA_RIGHT = INFRA.x + WIDE_CARD / 2;

const COL_X = 1180;
const COL_W = 1728 - COL_X;
const CERT_TOP = 30;
const CERT_H = 200;
const TRAP_TOP = 262;

/** Implant token size (the amber card that tries to move into Infrastructure). */
const TOKEN_W = 290;
const TOKEN_H = 70;
/** Where the implant stops when it tries to enter Infrastructure (token centre x). */
const TRY_X = INFRA.x - WIDE_CARD / 2 - TOKEN_W / 2 + 6;

/**
 * s04-infra «Infraestructura»: the domain, then its IP (shared hosting) and the
 * server's self-signed certificate are filed under Infrastructure. Then the
 * exam trap: the implant card tries to slide into Infrastructure because "it
 * connects", is rejected and snaps back to Capability.
 */
export function S04Infra(props: SceneProps) {
  const frame = useCurrentFrame();
  const domain = props.cue('domain');
  const ip = props.cue('ip');
  const cert = props.cue('cert');
  const notCap = props.cue('not-cap');
  const seg3 = segment(props, 's04-03');
  const seg4 = segment(props, 's04-04');

  // Domain and IP tokens fly into the Infrastructure card; each lands before the next cue.
  const domainLand = Math.min(domain + 40, ip - 6);
  const ipLand = Math.min(ip + 40, cert - 6);
  const infraItems = frame >= ipLand ? 1 : frame >= domainLand ? 0.5 : 0;

  // The trap: the implant leaves Capability, stops at Infrastructure, is rejected and returns.
  const leave = wordFrame(SCENE, 's04-04', 'implante', 0);
  const arrive = Math.max(leave + 16, Math.min(leave + 40, notCap - 8));
  const back = notCap + 16;
  const home = back + 24;
  const tokenOn = frame >= leave && frame < home + 8;
  const goOut = progress(frame, leave, arrive - leave, EASE.inOut);
  const goBack = progress(frame, back, home - back, EASE.inOut);
  const shakeT = frame - notCap;
  const shake = shakeT >= 0 && shakeT < 14 ? 12 * Math.sin(shakeT * 1.7) * (1 - shakeT / 14) : 0;
  const tokenX = CAP.x + (TRY_X - CAP.x) * goOut * (1 - goBack) + shake;
  const tokenY = CAP.y + 22;
  const rejected = progress(frame, notCap, 8) * (1 - progress(frame, back + 6, 12));
  const tokenAlpha = tokenOn ? fadeIn(frame, leave, 6) * (1 - progress(frame, home, 8)) : 0;

  // Emphasis.
  const capWord = wordFrame(SCENE, 's04-04', 'Capability');
  const infraWord = wordFrame(SCENE, 's04-04', 'Infrastructure');
  const road = progress(frame, seg3.from, 14) * (1 - 0.5 * progress(frame, seg4.from, 20));
  const infraGlow = Math.max(
    0.35 + 0.65 * road,
    progress(frame, infraWord, 10) * 0.9,
    frame >= domainLand - 4 && frame < domainLand + 16 ? 0.9 : 0,
    frame >= ipLand - 4 && frame < ipLand + 16 ? 0.9 : 0,
  );
  const capGlow = Math.max(progress(frame, home - 6, 10) * (1 - progress(frame, home + 30, 20)), progress(frame, capWord, 10) * 0.9 * (1 - progress(frame, infraWord, 16) * 0.5));

  const certIn = enter(frame, cert, { distance: 24, axis: 'x' });
  const certLink = progress(frame, cert + 6, 16);
  const hostingIn = enter(frame, ipLand, { distance: 14 });
  const trapIn = enter(frame, seg4.from + 4, { distance: 24, axis: 'x' });
  const answerOn = fadeIn(frame, capWord - 4, 12);

  return (
    <Stage>
      <Diamond
        {...GEO}
        cardW={WIDE_CARD}
        vertices={{
          adv: { dim: 0.55 },
          cap: { items: [E7_VALUES.cap], itemsShow: tokenOn ? 0 : 1, glow: capGlow },
          infra: { items: [E7_VALUES.domain, E7_VALUES.ip], itemsShow: infraItems, glow: infraGlow },
          vic: { items: [E7_VALUES.vic], dim: 0.25 },
        }}
      />

      {/* Links from Infrastructure to the evidence cards filed under it. */}
      <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {certLink > 0 ? (
          <Link x1={INFRA_RIGHT} y1={INFRA.y - 40} x2={COL_X} y2={CERT_TOP + CERT_H / 2} p={certLink} glow={road} />
        ) : null}
      </svg>

      <FlyingToken label={E7_VALUES.domain} icon="globe" frame={frame} cue={domain} land={domainLand} from={{ x: 1360, y: 110 }} to={{ x: INFRA.x, y: INFRA.y + 30 }} />
      <FlyingToken label={E7_VALUES.ip} icon="server" frame={frame} cue={ip} land={ipLand} from={{ x: 1360, y: 470 }} to={{ x: INFRA.x, y: INFRA.y + 70 }} />

      {/* Shared hosting chip under the Infrastructure card. */}
      {frame >= ipLand ? (
        <div style={{ position: 'absolute', left: INFRA.x - 150, top: INFRA.y + 110, ...hostingIn }}>
          <SkyPill icon="cloud" glow={road}>
            hosting compartido
          </SkyPill>
        </div>
      ) : null}

      {/* Certificate card. */}
      {frame >= cert ? (
        <div
          style={{
            position: 'absolute',
            left: COL_X,
            top: CERT_TOP,
            width: COL_W,
            height: CERT_H,
            boxSizing: 'border-box',
            padding: '20px 28px',
            borderRadius: RADIUS.lg,
            border: `3px solid ${alpha(C.sky, 0.5 + 0.4 * road)}`,
            background: `linear-gradient(180deg, ${alpha(C.sky, 0.12)} 0%, ${alpha(C.ink900, 0.95)} 100%)`,
            boxShadow: road > 0 ? `0 0 ${Math.round(30 * road)}px ${alpha(C.sky, 0.35 * road)}` : undefined,
            fontFamily: FONT.sans,
            ...certIn,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Icon name="lock" size={34} color={C.sky} />
            <div style={{ fontSize: TYPE.small, fontWeight: 700, color: C.muted, letterSpacing: 1 }}>CERTIFICADO DEL SERVIDOR</div>
          </div>
          <div style={{ marginTop: 14, fontSize: TYPE.label + 4, fontWeight: 800, color: C.textStrong }}>TLS autofirmado</div>
          <div style={{ marginTop: 6, fontFamily: FONT.mono, fontSize: TYPE.label + 2, fontWeight: 700, color: C.sky }}>CN=updatesvc</div>
        </div>
      ) : null}

      {/* Exam trap card. */}
      {frame >= seg4.from + 4 ? (
        <div
          style={{
            position: 'absolute',
            left: COL_X,
            top: TRAP_TOP,
            width: COL_W,
            boxSizing: 'border-box',
            padding: '20px 28px 24px',
            borderRadius: RADIUS.lg,
            border: `3px solid ${alpha(C.violet, 0.75)}`,
            background: `linear-gradient(180deg, ${alpha(C.violetStrong, 0.2)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
            fontFamily: FONT.sans,
            ...trapIn,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Icon name="mortarboard" size={36} color={C.violet} />
            <div style={{ fontSize: TYPE.label, fontWeight: 850, color: C.violet, letterSpacing: 1.5 }}>TRAMPA DE EXAMEN</div>
          </div>
          <div style={{ position: 'relative', marginTop: 14, fontSize: TYPE.label, fontWeight: 650, lineHeight: 1.3, color: C.text, opacity: 1 - 0.45 * rejected }}>
            ¿El implante es Infrastructure porque se conecta?
            {frame >= notCap ? (
              <span style={{ marginLeft: 12, color: C.rose, fontWeight: 850, opacity: fadeIn(frame, notCap, 8) }}>No.</span>
            ) : null}
          </div>
          <div style={{ marginTop: 16, fontSize: TYPE.label, fontWeight: 700, lineHeight: 1.3, color: C.textStrong, opacity: answerOn }}>
            El implante es <span style={{ color: C.amber }}>Capability</span>
            <span style={{ color: C.muted }}> · </span>
            el dominio al que llama es <span style={{ color: C.sky }}>Infrastructure</span>
          </div>
        </div>
      ) : null}

      {/* The implant token. */}
      {tokenAlpha > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: tokenX - TOKEN_W / 2,
            top: tokenY - TOKEN_H / 2,
            width: TOKEN_W,
            height: TOKEN_H,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            borderRadius: RADIUS.md,
            border: `3px solid ${rejected > 0.05 ? alpha(C.rose, 0.6 + 0.4 * rejected) : C.amber}`,
            background: `linear-gradient(180deg, ${alpha(C.amber, 0.22)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
            boxShadow: `0 16px 40px ${alpha('#000000', 0.45)}`,
            opacity: tokenAlpha,
            fontFamily: FONT.mono,
            fontSize: TYPE.label,
            fontWeight: 800,
            color: C.amber,
          }}
        >
          <Icon name="bolt" size={32} color={C.amber} />
          {E7_VALUES.cap}
          {rejected > 0 ? (
            <div
              style={{
                position: 'absolute',
                left: TOKEN_W / 2 - 30,
                top: -66,
                width: 60,
                height: 60,
                borderRadius: 30,
                background: C.rose,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `scale(${0.6 + 0.4 * rejected})`,
                opacity: rejected,
                boxShadow: `0 0 24px ${alpha(C.rose, 0.7)}`,
              }}
            >
              <Icon name="x" size={40} color={C.ink950} strokeWidth={3.2} />
            </div>
          ) : null}
        </div>
      ) : null}
    </Stage>
  );
}

/** A value chip that appears on its cue, then flies into the Infrastructure card and vanishes there. */
function FlyingToken({
  label,
  icon,
  frame,
  cue,
  land,
  from,
  to,
}: {
  label: string;
  icon: IconName;
  frame: number;
  cue: number;
  land: number;
  from: { x: number; y: number };
  to: { x: number; y: number };
}) {
  if (frame < cue || frame >= land) return null;
  const flyStart = Math.max(cue + 8, land - 22);
  const t = progress(frame, flyStart, land - flyStart, EASE.inOut);
  const x = from.x + (to.x - from.x) * t;
  const y = from.y + (to.y - from.y) * t;
  const opacity = fadeIn(frame, cue, 8) * (1 - progress(frame, land - 6, 6));
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${1 - 0.2 * t})`, opacity }}>
      <SkyPill icon={icon} mono glow={1 - t}>
        {label}
      </SkyPill>
    </div>
  );
}

/** Infrastructure-coloured pill (the engine Chip has no sky accent). */
function SkyPill({ children, icon, mono = false, glow = 0 }: { children: ReactNode; icon: IconName; mono?: boolean; glow?: number }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 22px',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(C.sky, 0.6 + 0.4 * glow)}`,
        background: alpha(C.ink900, 0.94),
        boxShadow: glow > 0 ? `0 0 ${Math.round(24 * glow)}px ${alpha(C.sky, 0.4 * glow)}` : undefined,
        color: C.textStrong,
        fontFamily: mono ? FONT.mono : FONT.sans,
        fontSize: TYPE.label,
        fontWeight: 700,
        lineHeight: 1.1,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name={icon} size={32} color={C.sky} />
      {children}
    </span>
  );
}

function Link({ x1, y1, x2, y2, p, glow }: { x1: number; y1: number; x2: number; y2: number; p: number; glow: number }) {
  const mx = (x1 + x2) / 2;
  const d = `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
  return (
    <path
      d={d}
      pathLength={1}
      fill="none"
      stroke={alpha(C.sky, 0.55 + 0.35 * glow)}
      strokeWidth={4}
      strokeLinecap="round"
      strokeDasharray="1 1"
      strokeDashoffset={1 - p}
    />
  );
}
