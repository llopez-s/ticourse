import { C, FONT, RADIUS, TYPE, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, fadeIn, fadeOut, lerp, progress, pulse, springIn } from '../../../../../engine/src/theme/motion';
import { Icon } from '../../../../../engine/src/ui';
import type { S10Timing } from './timing';

/** Size of the network diagram (local px). */
export const DIAG = { width: 1020, height: 552 } as const;

const PROD = { x: 0, y: 0, w: 432, h: 214 };
const QUAR = { x: 0, y: 272, w: 1020, h: 280 };
const CARD = { x: 28, w: 360, h: 100, yProd: 88, yQuar: 400 };
const NET = { x: 670, y: 88, w: 350, h: 100 };
const LINK_Y = CARD.yProd + CARD.h / 2;
const LINK_X0 = CARD.x + CARD.w;
const LINK_X1 = NET.x;
const LINK_MID = (PROD.w + NET.x) / 2;

/**
 * The container-terminal network: "VLAN producción" with srv-tc-app03's
 * session to 203.0.113.47 still open (the bulk transfer ended at 04:30, see the
 * case strip), the shut-down-or-isolate fork, then the move into
 * the restricted quarantine VLAN with the evidence it preserves (power on,
 * packet capture).
 */
export function Topology({
  frame,
  fps,
  t,
  executeGlow,
  headerDim = 0,
}: {
  frame: number;
  fps: number;
  t: S10Timing;
  /** 0–1 halo on the quarantine zone when the playbook executes it. */
  executeGlow: number;
  /** 0–1: quieten the production header while the think card sits over it. */
  headerDim?: number;
}) {
  const cut = progress(frame, t.quarantine, 10);
  const move = progress(frame, t.quarantine + 2, 28, EASE.inOut);
  const lift = Math.sin(Math.PI * move);
  const cardY = lerp(move, [0, 1], [CARD.yProd, CARD.yQuar]);
  const zoneIn = progress(frame, t.quarantine - 4, 16);
  const forkOut = fadeOut(frame, t.quarantine - 2, 10);
  const powerIn = progress(frame, t.powerOn, 16);
  const pcapIn = springIn(frame, fps, t.pcap);
  const recSeconds = Math.max(0, Math.floor((frame - t.pcap) / fps));
  // Once validated, the stamp lands over the old destination: clear the ground under it.
  const settled = progress(frame, t.validate, 10);

  return (
    <div style={{ position: 'relative', width: DIAG.width, height: DIAG.height, fontFamily: FONT.sans }}>
      {/* VLAN producción */}
      <div
        style={{
          position: 'absolute',
          left: PROD.x,
          top: PROD.y,
          width: PROD.w,
          height: PROD.h,
          borderRadius: RADIUS.lg,
          border: `2px solid ${C.ink600}`,
          background: alpha(C.ink850, 0.7),
          opacity: fadeIn(frame, 2, 14),
        }}
      >
        <div style={{ position: 'absolute', left: 24, top: 20, display: 'flex', alignItems: 'center', gap: 12, opacity: 1 - 0.8 * headerDim }}>
          <Icon name="network" size={30} color={C.muted} />
          <span style={{ fontSize: 30, fontWeight: 700, color: C.text }}>VLAN producción</span>
        </div>
        {/* Where the server used to be once it has left. */}
        <div
          style={{
            position: 'absolute',
            left: CARD.x,
            top: CARD.yProd,
            width: CARD.w,
            height: CARD.h,
            borderRadius: RADIUS.md,
            border: `2px dashed ${C.ink600}`,
            opacity: progress(frame, t.quarantine + 20, 12) * 0.9,
          }}
        />
      </div>

      {/* Outbound session: still open (quiet rose trickle) until the quarantine cuts it. */}
      <OutboundLink frame={frame} fps={fps} cut={cut} cutPop={springIn(frame, fps, t.quarantine + 2)} />

      {/* External destination */}
      <div
        style={{
          position: 'absolute',
          left: NET.x,
          top: NET.y,
          width: NET.w,
          height: NET.h,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '0 16px 0 18px',
          boxSizing: 'border-box',
          borderRadius: RADIUS.md,
          border: `2px solid ${alpha(C.rose, 0.8 - 0.5 * cut)}`,
          background: alpha(C.rose, 0.1 - 0.06 * cut),
          boxShadow: `0 0 28px ${alpha(C.rose, 0.25 * (1 - cut))}`,
          opacity: fadeIn(frame, 6, 14) * (1 - 0.45 * cut) * (1 - 0.7 * settled),
        }}
      >
        <IconTile name="globe" color={C.rose} size={56} />
        <div>
          <div style={{ fontFamily: FONT.mono, fontSize: TYPE.label, fontWeight: 700, color: C.textStrong, whiteSpace: 'nowrap' }}>
            203.0.113.47
          </div>
          <div style={{ fontSize: TYPE.small, color: C.muted, marginTop: 2, whiteSpace: 'nowrap' }}>destino externo</div>
        </div>
      </div>

      {/* The fork, below the question: shut down or isolate? */}
      {forkOut > 0 ? <Fork frame={frame} t={t} opacity={forkOut} /> : null}

      {/* VLAN cuarentena (restringida) */}
      {zoneIn > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: QUAR.x,
            top: QUAR.y,
            width: QUAR.w,
            height: QUAR.h,
            borderRadius: RADIUS.lg,
            opacity: zoneIn,
            background: alpha(C.roseDeep, 0.28),
            boxShadow: executeGlow > 0 ? `0 0 ${20 + 30 * executeGlow}px ${alpha(C.rose, 0.35 * executeGlow)}` : 'none',
          }}
        >
          <svg width={QUAR.w} height={QUAR.h} style={{ position: 'absolute', inset: 0 }} aria-hidden>
            <rect
              x={2}
              y={2}
              width={QUAR.w - 4}
              height={QUAR.h - 4}
              rx={RADIUS.lg - 2}
              fill="none"
              stroke={alpha(C.rose, 0.75 + 0.25 * executeGlow)}
              strokeWidth={3}
              strokeDasharray="16 12"
            />
          </svg>
          <div style={{ position: 'absolute', left: 24, top: 22, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Icon name="lock" size={34} color={C.rose} />
            <span style={{ fontSize: TYPE.label, fontWeight: 750, color: C.roseSoft, whiteSpace: 'nowrap' }}>
              VLAN cuarentena (restringida)
            </span>
          </div>
          {/* Packet capture badge — records the rest of the session. */}
          {frame >= t.pcap ? (
            <div
              style={{
                position: 'absolute',
                right: 28,
                top: -27,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                height: 54,
                padding: '0 22px 0 18px',
                borderRadius: RADIUS.pill,
                border: `2px solid ${alpha(C.cyan, 0.85)}`,
                background: C.ink900,
                boxShadow: `0 0 ${16 + 20 * (1 - progress(frame, t.pcap, 40))}px ${alpha(C.cyan, 0.3)}`,
                opacity: Math.min(1, pcapIn),
                transform: `scale(${0.85 + 0.15 * pcapIn})`,
                transformOrigin: 'right center',
              }}
            >
              <Icon name="record" size={26} color={C.rose} style={{ opacity: 0.45 + 0.55 * pulse(frame - t.pcap, fps, 0.8) }} />
              <span style={{ fontSize: TYPE.label, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap' }}>PCAP · grabando</span>
              <span style={{ fontFamily: FONT.mono, fontSize: 28, fontWeight: 600, color: C.cyanSoft, fontVariantNumeric: 'tabular-nums' }}>
                {`00:${String(Math.min(59, recSeconds)).padStart(2, '0')}`}
              </span>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Evidence note: power stays on because RAM is evidence. */}
      {powerIn > 0 ? (
        <>
          <svg
            width={36}
            height={8}
            style={{ position: 'absolute', left: CARD.x + CARD.w, top: CARD.yQuar + CARD.h / 2 - 4, opacity: powerIn }}
            aria-hidden
          >
            <line x1={0} y1={4} x2={36 * powerIn} y2={4} stroke={C.emerald} strokeWidth={3} strokeDasharray="6 6" />
          </svg>
          <div
            style={{
              position: 'absolute',
              left: CARD.x + CARD.w + 36,
              top: CARD.yQuar - 4,
              height: CARD.h + 8,
              display: 'flex',
              alignItems: 'center',
              padding: '0 24px',
              borderRadius: RADIUS.md,
              border: `2px solid ${alpha(C.emerald, 0.7)}`,
              background: alpha(C.emerald, 0.08),
              opacity: powerIn,
              transform: `translateX(${(1 - powerIn) * 24}px)`,
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon name="power" size={32} color={C.emerald} strokeWidth={2.4} />
                <span style={{ fontSize: TYPE.label, fontWeight: 800, color: C.emerald, lineHeight: 1.2 }}>Encendido</span>
              </div>
              <div style={{ fontSize: TYPE.label, fontWeight: 600, color: C.textStrong, lineHeight: 1.2, whiteSpace: 'nowrap', marginTop: 4 }}>
                la memoria también es evidencia
              </div>
            </div>
          </div>
        </>
      ) : null}

      {/* srv-tc-app03 — lifted out of production, dropped into quarantine. */}
      <ServerCard
        frame={frame}
        fps={fps}
        y={cardY}
        lift={lift}
        alert={1 - progress(frame, t.quarantine + 10, 24)}
        ledGlow={frame >= t.powerOn ? 0.5 + 0.5 * pulse(frame - t.powerOn, fps, 0.7) : 0}
        opacity={fadeIn(frame, 4, 14)}
      />
    </div>
  );
}

function IconTile({ name, color, size = 60 }: { name: 'globe' | 'power' | 'server' | 'lock'; color: string; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 14,
        display: 'grid',
        placeItems: 'center',
        background: alpha(color, 0.12),
        border: `2px solid ${alpha(color, 0.4)}`,
        flexShrink: 0,
      }}
    >
      <Icon name={name} size={Math.round(size * 0.57)} color={color} />
    </div>
  );
}

function ServerCard({
  frame,
  fps,
  y,
  lift,
  alert,
  ledGlow,
  opacity,
}: {
  frame: number;
  fps: number;
  y: number;
  lift: number;
  alert: number;
  ledGlow: number;
  opacity: number;
}) {
  const border = alert > 0.01 ? alpha(C.rose, 0.35 + 0.5 * alert) : C.ink600;
  return (
    <div
      style={{
        position: 'absolute',
        left: CARD.x,
        top: y,
        width: CARD.w,
        height: CARD.h,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        padding: '0 22px 0 18px',
        borderRadius: RADIUS.md,
        background: C.ink850,
        border: `2px solid ${border}`,
        boxShadow: `0 ${10 + 26 * lift}px ${30 + 40 * lift}px ${alpha('#000000', 0.35 + 0.25 * lift)}${
          alert > 0.01 ? `, 0 0 28px ${alpha(C.rose, 0.3 * alert * (0.7 + 0.3 * pulse(frame, fps, 0.6)))}` : ''
        }`,
        transform: `scale(${1 + 0.05 * lift})`,
        opacity,
      }}
    >
      <IconTile name="server" color={alert > 0.5 ? C.rose : C.cyan} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: TYPE.label, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap', lineHeight: 1.15 }}>srv-tc-app03</div>
        <div style={{ fontFamily: FONT.mono, fontSize: TYPE.small, color: C.muted, marginTop: 4 }}>10.20.8.31</div>
      </div>
      {/* Power LED: always emerald — the machine is never switched off. */}
      <div style={{ position: 'absolute', right: 20, bottom: 20, width: 20, height: 20 }}>
        <div style={{ position: 'absolute', inset: -9, borderRadius: '50%', background: alpha(C.emerald, 0.3 * ledGlow) }} />
        <div
          style={{
            position: 'absolute',
            inset: 2,
            borderRadius: '50%',
            background: C.emerald,
            boxShadow: `0 0 ${6 + 14 * ledGlow}px ${alpha(C.emerald, 0.8)}`,
          }}
        />
      </div>
    </div>
  );
}

function OutboundLink({ frame, fps, cut, cutPop }: { frame: number; fps: number; cut: number; cutPop: number }) {
  const live = 1 - cut;
  const len = LINK_X1 - LINK_X0;
  const d = `M${LINK_X0},${LINK_Y} L${LINK_X1},${LINK_Y}`;
  // An open session, not a bulk transfer (that ended at 04:30): one slow packet.
  const packet = ((frame / fps) * 0.28) % 1;
  return (
    <>
      <svg
        width={DIAG.width}
        height={DIAG.height}
        style={{ position: 'absolute', inset: 0, overflow: 'visible', opacity: fadeIn(frame, 8, 14) }}
        aria-hidden
      >
        {/* Cut state underneath: faint dashed path. */}
        <path d={d} stroke={C.ink500} strokeWidth={3} strokeDasharray="10 12" opacity={cut} fill="none" />
        {live > 0 ? (
          <g opacity={live}>
            <path d={d} stroke={alpha(C.rose, 0.22)} strokeWidth={3} fill="none" strokeLinecap="round" />
            <path
              d={d}
              stroke={alpha(C.rose, 0.6)}
              strokeWidth={3}
              fill="none"
              strokeLinecap="round"
              strokeDasharray="8 30"
              strokeDashoffset={-(frame / fps) * 24}
            />
            <circle
              cx={LINK_X0 + len * packet}
              cy={LINK_Y}
              r={6}
              fill={C.roseSoft}
              opacity={0.85 * Math.min(1, packet * 8, (1 - packet) * 8)}
            />
          </g>
        ) : null}
        {cut > 0 ? (
          <g transform={`translate(${LINK_MID} ${LINK_Y}) scale(${Math.max(0.01, cutPop)})`}>
            <circle r={24} fill={C.ink900} stroke={C.rose} strokeWidth={3} />
            <path d="M-9,-9 L9,9 M9,-9 L-9,9" stroke={C.rose} strokeWidth={4} strokeLinecap="round" />
          </g>
        ) : null}
      </svg>
      {/* Link caption swaps from "session still open" to "cut". */}
      <div
        style={{
          position: 'absolute',
          left: LINK_MID - 140,
          width: 280,
          top: LINK_Y - 76,
          textAlign: 'center',
          fontSize: TYPE.small,
          fontWeight: 700,
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ position: 'absolute', left: 0, right: 0, color: C.roseSoft, opacity: live * fadeIn(frame, 10, 12) }}>
          sesión aún abierta
        </span>
        <span style={{ position: 'absolute', left: 0, right: 0, color: C.muted, opacity: cut }}>conexión cortada</span>
      </div>
    </>
  );
}

function Fork({ frame, t, opacity }: { frame: number; t: S10Timing; opacity: number }) {
  const chosen = progress(frame, t.answer, 12);
  const options = [
    { key: 'off', icon: 'power' as const, title: 'Apagar', sub: 'cortar la corriente', at: t.ask + 56 },
    { key: 'iso', icon: 'lock' as const, title: 'Aislar', sub: 'sacarlo de la red', at: t.ask + 96 },
  ];
  return (
    <div style={{ position: 'absolute', left: 0, top: QUAR.y, width: QUAR.w, height: QUAR.h, opacity }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 14,
          textAlign: 'center',
          fontSize: TYPE.label,
          fontWeight: 750,
          letterSpacing: 2,
          color: C.muted,
          opacity: fadeIn(frame, t.ask, 14),
        }}
      >
        PRIMERA DECISIÓN DE CONTENCIÓN
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 84, display: 'flex', justifyContent: 'center', gap: 40 }}>
        {options.map((o) => {
          const p = progress(frame, o.at, 16);
          const picked = o.key === 'iso';
          const dim = picked ? 1 : 1 - 0.55 * chosen;
          return (
            <div
              key={o.key}
              style={{
                position: 'relative',
                width: 440,
                height: 140,
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                gap: 22,
                padding: '0 28px',
                borderRadius: RADIUS.lg,
                background: picked ? alpha(C.emerald, 0.1 * chosen) : C.ink850,
                border: `2px solid ${picked && chosen > 0 ? alpha(C.emerald, 0.4 + 0.5 * chosen) : C.ink600}`,
                boxShadow: picked ? `0 0 ${30 * chosen}px ${alpha(C.emerald, 0.3 * chosen)}` : 'none',
                opacity: p * dim,
                transform: `translateY(${(1 - p) * 20}px)`,
              }}
            >
              <div
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: 18,
                  display: 'grid',
                  placeItems: 'center',
                  background: alpha(picked ? C.emerald : C.muted, 0.08 + (picked ? 0.08 * chosen : 0)),
                  border: `2px solid ${alpha(picked && chosen > 0 ? C.emerald : C.muted, 0.35)}`,
                }}
              >
                <Icon name={o.icon} size={42} color={picked && chosen > 0 ? C.emerald : C.text} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: TYPE.h3, fontWeight: 800, color: C.textStrong, lineHeight: 1.05 }}>{o.title}</div>
                <div style={{ fontSize: TYPE.small, color: C.muted, marginTop: 6, whiteSpace: 'nowrap' }}>{o.sub}</div>
              </div>
              {chosen > 0 ? (
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    background: picked ? C.emerald : C.ink700,
                    opacity: chosen,
                    transform: `scale(${0.6 + 0.4 * chosen})`,
                  }}
                >
                  <Icon name={picked ? 'check' : 'x'} size={30} color={picked ? C.ink950 : C.muted} strokeWidth={3} />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
