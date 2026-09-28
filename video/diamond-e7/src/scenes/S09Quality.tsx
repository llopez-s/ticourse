import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, countUp, enter, fadeIn, progress, pulse } from '../../../engine/src/theme/motion';
import { Chip, Counter, Panel, Stamp } from '../../../engine/src/ui';
import { Stage, segment, wordFrame } from './kit';

const SCENE = 's09-quality';
const PANEL_TOP = 250; // below the top-centre band the intercept card and think prompt use
const PANEL_H = 400;
const PANEL_W = 800;
const IP_X = 20;
const CERT_X = 908;

const DOT_COLS = 24;
const DOT_ROWS = 4;

/**
 * s09-quality «No todos los pivotes valen igual»: two ways out of E7. The IP
 * 185.220.x.x is shared hosting — a counter climbs to ~14.000 third-party
 * domains and the card is stamped RUIDO. The self-signed certificate
 * CN=updatesvc only the actor deploys, and it shows up on two more IPs
 * (redacted: the infrastructure lesson reveals them) — ORO. WHOIS stays
 * pending, and the rule closes the scene.
 */
export function S09Quality(props: SceneProps) {
  const frame = useCurrentFrame();
  const tenants = props.cue('tenants');
  const noise = props.cue('noise');
  const certReuse = props.cue('cert-reuse');
  const whois = props.cue('whois-pending');
  const twoPaths = segment(props, 's09-02').from;
  const twoIpAt = wordFrame(SCENE, 's09-04', 'dos');
  const goldAt = wordFrame(SCENE, 's09-04', 'oro');

  const tenantsN = countUp(frame, tenants, 80, 0, 14000);
  const tenantsP = progress(frame, tenants, 80, EASE.inOut);
  const noiseP = progress(frame, noise, 14);
  const certGlow = progress(frame, certReuse, 16) * (0.75 + 0.25 * pulse(frame, 30, 0.5)) * (1 - 0.4 * progress(frame, whois, 30));
  const goldFlash = progress(frame, goldAt, 10) * (1 - progress(frame, goldAt + 24, 30));

  return (
    <Stage>
      {/* Path 1: the IP. */}
      <div style={{ position: 'absolute', left: IP_X, top: PANEL_TOP, width: PANEL_W, height: PANEL_H, ...enter(frame, 0, { distance: 20 }) }}>
        <Panel title="Pivote 1 · la IP" icon="globe" accent="amber" glow={noiseP * 0.8} style={{ height: '100%', opacity: 1 - 0.35 * noiseP }} bodyStyle={{ padding: '18px 30px' }}>
          <div style={{ fontFamily: FONT.sans, fontSize: TYPE.small, color: C.muted, fontWeight: 550 }}>update-svc-cdn.com resuelve a</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 6 }}>
            <div style={{ fontFamily: FONT.mono, fontSize: TYPE.h3, fontWeight: 800, color: C.sky, whiteSpace: 'nowrap' }}>185.220.x.x</div>
            <div style={{ opacity: fadeIn(frame, tenants, 14) }}>
              <Chip accent="amber" size={TYPE.label}>
                hosting compartido
              </Chip>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, marginTop: 18, opacity: fadeIn(frame, tenants, 10) }}>
            <Counter value={tenantsN} size={TYPE.h2} color={C.textStrong} />
            <div style={{ fontFamily: FONT.sans, fontSize: TYPE.label, fontWeight: 650, color: C.text, whiteSpace: 'nowrap' }}>dominios de terceros</div>
          </div>
          {/* The crowd: one grey dot per ~150 neighbours. */}
          <svg width={PANEL_W - 60} height={120} style={{ position: 'absolute', left: 30, bottom: 16 }}>
            {Array.from({ length: DOT_COLS * DOT_ROWS }, (_, i) => {
              const col = i % DOT_COLS;
              const row = Math.floor(i / DOT_COLS);
              // Fill in a scattered order so the crowd seems to arrive from everywhere.
              const order = ((i * 37) % (DOT_COLS * DOT_ROWS)) / (DOT_COLS * DOT_ROWS);
              const on = Math.max(0, Math.min(1, (tenantsP * 1.15 - order) * 8));
              if (on <= 0) return null;
              return <circle key={i} cx={15 + col * 30} cy={16 + row * 29} r={7 * on} fill={alpha(C.muted, 0.55 + 0.3 * noiseP)} />;
            })}
          </svg>
        </Panel>
        {frame >= noise ? (
          <div style={{ position: 'absolute', left: '50%', top: '80%', transform: 'translate(-50%, -50%)' }}>
            <Stamp frame={frame} at={noise} accent="amber" rotate={-8} size={TYPE.h1}>
              RUIDO
            </Stamp>
          </div>
        ) : null}
      </div>

      {/* «Two paths»: the or between them. */}
      <div
        style={{
          position: 'absolute',
          left: 864 - 30,
          top: PANEL_TOP + PANEL_H / 2 - 30,
          width: 60,
          height: 60,
          borderRadius: 30,
          display: 'grid',
          placeItems: 'center',
          background: C.ink850,
          border: `2px solid ${C.ink600}`,
          fontFamily: FONT.sans,
          fontSize: TYPE.label,
          fontWeight: 800,
          color: C.text,
          opacity: fadeIn(frame, twoPaths, 12),
        }}
      >
        o
      </div>

      {/* Path 2: the self-signed certificate. */}
      <div style={{ position: 'absolute', left: CERT_X, top: PANEL_TOP, width: PANEL_W, height: PANEL_H, ...enter(frame, twoPaths + 6, { distance: 24, axis: 'x' }) }}>
        <Panel title="Pivote 2 · el certificado TLS" icon="lock" accent="emerald" glow={certGlow} style={{ height: '100%' }} bodyStyle={{ padding: '18px 30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <div style={{ fontFamily: FONT.mono, fontSize: TYPE.h3, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>CN=updatesvc</div>
            <Chip accent="emerald" size={TYPE.label}>
              autofirmado
            </Chip>
          </div>
          <CertLinks frame={frame} at={twoIpAt} />
          <div style={{ position: 'absolute', left: 30, bottom: 22, ...enter(frame, certReuse + 8, { distance: 14 }) }}>
            <Chip
              accent="emerald"
              solid
              size={TYPE.label}
              style={{ boxShadow: goldFlash > 0 ? `0 0 ${Math.round(40 * goldFlash)}px ${alpha(C.emerald, 0.7 * goldFlash)}` : undefined }}
            >
              ORO · solo lo despliega el actor
            </Chip>
          </div>
        </Panel>
      </div>

      {/* Top strip, only after the intercept and the think prompt are gone. */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          width: 1728,
          top: 36,
          textAlign: 'center',
          fontFamily: FONT.sans,
          fontSize: TYPE.h3,
          fontWeight: 800,
          whiteSpace: 'nowrap',
          ...enter(frame, whois + 40, { distance: 16 }),
        }}
      >
        <span style={{ color: C.emerald }}>dedicado discrimina</span>
        <span style={{ color: C.faint, margin: '0 22px' }}>·</span>
        <span style={{ color: C.amber }}>compartido contamina</span>
      </div>
      <div style={{ position: 'absolute', left: 0, width: 1728, top: 140, display: 'flex', justifyContent: 'center', ...enter(frame, whois, { distance: 14 }) }}>
        <Chip accent="muted" icon="clock" size={TYPE.label} style={{ borderStyle: 'dashed' }}>
          WHOIS histórico: pendiente
        </Chip>
      </div>
    </Stage>
  );
}

/** The certificate fans out to the two other IPs it was seen on — redacted on purpose. */
function CertLinks({ frame, at }: { frame: number; at: number }) {
  const hub = { x: 120, y: 0 };
  const chipsY = 110;
  const targets = [
    { x: 150, label: 0 },
    { x: 450, label: 1 },
  ];
  return (
    <div style={{ position: 'relative', height: 170, marginTop: 10 }}>
      <svg width={740} height={170} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {targets.map((t, i) => {
          const p = progress(frame, at + i * 8, 18, EASE.inOut);
          if (p <= 0) return null;
          const tx = t.x + 100;
          const d = `M${hub.x},${hub.y} C${hub.x},${hub.y + 60} ${tx},${chipsY - 70} ${tx},${chipsY - 22}`;
          return <path key={i} d={d} fill="none" stroke={C.emerald} strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />;
        })}
      </svg>
      {targets.map((t, i) => {
        const p = progress(frame, at + 10 + i * 8, 14);
        if (p <= 0) return null;
        return (
          <div key={i} style={{ position: 'absolute', left: t.x, top: chipsY - 22, opacity: p, transform: `scale(${0.9 + 0.1 * p})` }}>
            <RedactedIp />
          </div>
        );
      })}
    </div>
  );
}

function RedactedIp() {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        padding: '8px 20px',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(C.sky, 0.6)}`,
        background: alpha(C.sky, 0.1),
        fontFamily: FONT.mono,
        fontSize: TYPE.label,
        fontWeight: 700,
        color: C.sky,
        whiteSpace: 'nowrap',
      }}
    >
      IP ·
      <span style={{ display: 'inline-block', width: 110, height: 26, borderRadius: 4, background: alpha(C.muted, 0.75) }} />
    </div>
  );
}
