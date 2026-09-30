import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, fadeIn, fadeOut, progress, pulse, springIn } from '../../../engine/src/theme/motion';
import { Chip, Connector, Icon, NodeCard, Packet, Panel, type IconName, type Point } from '../../../engine/src/ui';
import { Stage, segment, wordFrame } from './kit';

const S = 's10-opsec';

// --- layout (stage-local) -------------------------------------------------------
const ANALYST = { x: 20, y: 340, w: 310, h: 110 };
const SRC = { x: 440, w: 480, h: 96, ys: [244, 356, 468] };
const SERVER = { x: 1260, y: 244, w: 448, h: 100 };
const LOGS = { x: 1260, y: 366, w: 448 };
const STATUS_TOP = 482;

const SOURCES: { title: string; term: string; icon: IconName }[] = [
  { title: 'listín', term: 'passive DNS', icon: 'terminal' },
  { title: 'tablón', term: 'Certificate Transparency', icon: 'layers' },
  { title: 'fichas', term: 'WHOIS histórico', icon: 'archive' },
];

/** Routine lines already in the actor's log (texture; visitor IPs from documentation ranges, masked). */
const LOG_LINES = ['GET /upd/ping · 192.0.2.x', 'GET /upd/ping · 192.0.2.x', 'POST /upd/cfg · 198.51.100.x', 'GET /upd/ping · 192.0.2.x'];
const YOUR_LINE = 'GET / · 203.0.113.x';

type Curve = [Point, Point, Point, Point];

/** Direct visit: under the sources, from the analyst into the actor's log. */
const ACTIVE_PATH: Curve = [
  { x: ANALYST.x + ANALYST.w, y: 424 },
  { x: 440, y: 652 },
  { x: 1040, y: 664 },
  { x: LOGS.x, y: 606 },
];

/** The env card, top centre (only after the intercept has gone). */
const ENV = { w: 800, top: 14 };
const ENV_X = (1728 - ENV.w) / 2;
/** The paths meet the card at its first row, which is there from the start (the card grows below it). */
const ENV_ROW_Y = ENV.top + 50;
const MANAGED_IN: Curve = [
  { x: ANALYST.x + 150, y: ANALYST.y - 4 },
  { x: ANALYST.x + 150, y: 150 },
  { x: ENV_X - 160, y: ENV_ROW_Y },
  { x: ENV_X, y: ENV_ROW_Y },
];
const MANAGED_OUT: Curve = [
  { x: ENV_X + ENV.w, y: ENV_ROW_Y },
  { x: ENV_X + ENV.w + 170, y: ENV_ROW_Y },
  { x: SERVER.x + 224, y: 150 },
  { x: SERVER.x + 224, y: SERVER.y - 4 },
];

/**
 * s10-opsec «Sin que te vea».
 *   passive      everything today came from the listín (pDNS), the tablón (CT) and the fichas
 *                (WHOIS): third-party observations — the actor does not see you
 *   (intercept)  HOLLOW LANTERN: «come and see me» — top-centre band stays clear
 *   active-risk  visiting or scanning his server leaves YOUR line in HIS logs: he sees you coming
 *   managed      passive first; if you must touch, from a disposable environment (managed attribution)
 */
export function S10Opsec(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const passiveAt = props.cue('passive');
  const activeAt = props.cue('active-risk');
  const managedAt = props.cue('managed');
  const interceptFrom = segment(props, 's10-01').to;

  const listinW = wordFrame(S, 's10-01', 'listín');
  const tablonW = wordFrame(S, 's10-01', 'tablón');
  const fichasW = wordFrame(S, 's10-01', 'fichas');
  const actorW = wordFrame(S, 's10-01', 'actor');
  const scanW = wordFrame(S, 's10-02', 'escaneas');
  const visitW = wordFrame(S, 's10-02', 'visita');
  const noticeW = wordFrame(S, 's10-02', 'cuenta');
  const firstW = wordFrame(S, 's10-03', 'pasivo');
  const companyW = wordFrame(S, 's10-03', 'empresa');
  const nextW = wordFrame(S, 's10-03', 'próxima');

  const namedAt = [listinW, tablonW, fichasW];
  // Passive links run while you read the sources, dim when you go active, come back for «pasivo primero».
  const passiveLinks = progress(frame, passiveAt + 10, 20) * (1 - 0.65 * progress(frame, activeAt, 16) + 0.65 * progress(frame, firstW, 16));
  const activeDraw = progress(frame, activeAt + 2, 26, EASE.inOut);
  const activeFade = 1 - 0.75 * progress(frame, managedAt, 20);
  const packetT = (frame - scanW) / 46;
  const seen = progress(frame, noticeW - 4, 12);
  const managedA = progress(frame, managedAt + 10, 22, EASE.inOut);
  const managedB = progress(frame, managedAt + 28, 22, EASE.inOut);
  const managedPacket = (frame - (managedAt + 52)) / 50;

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {/* Third parties observed the actor's footprint (faint, static). */}
        {SRC.ys.map((y, i) => (
          <Connector
            key={`obs${i}`}
            curve={[
              { x: SERVER.x, y: SERVER.y + 50 },
              { x: SERVER.x - 150, y: SERVER.y + 50 },
              { x: SRC.x + SRC.w + 150, y: y + SRC.h / 2 },
              { x: SRC.x + SRC.w, y: y + SRC.h / 2 },
            ]}
            color={C.sky}
            width={3}
            dashed
            opacity={0.8 * progress(frame, passiveAt + 20 + i * 8, 16)}
          />
        ))}
        {/* What you read: sources to analyst. */}
        {SRC.ys.map((y, i) => (
          <Connector
            key={`src${i}`}
            curve={[
              { x: SRC.x, y: y + SRC.h / 2 },
              { x: SRC.x - 60, y: y + SRC.h / 2 },
              { x: ANALYST.x + ANALYST.w + 60, y: ANALYST.y + ANALYST.h / 2 },
              { x: ANALYST.x + ANALYST.w, y: ANALYST.y + ANALYST.h / 2 },
            ]}
            color={C.cyan}
            width={4}
            draw={progress(frame, passiveAt + 8 + i * 8, 18, EASE.inOut)}
            flow={frame / fps}
            opacity={0.35 + 0.65 * passiveLinks}
          />
        ))}
        {/* Active collection: straight to his server. */}
        {activeDraw > 0 ? (
          <>
            <Connector curve={ACTIVE_PATH} color={C.rose} width={4} draw={activeDraw} flow={activeFade > 0.5 ? frame / fps : undefined} opacity={activeFade} />
            <Packet curve={ACTIVE_PATH} t={packetT} color={C.rose} radius={10} />
          </>
        ) : null}
        {/* Managed attribution: through a disposable environment. */}
        {managedA > 0 ? (
          <>
            <Connector curve={MANAGED_IN} color={C.cyan} width={4} draw={managedA} flow={managedB >= 1 ? frame / fps : undefined} />
            <Connector curve={MANAGED_OUT} color={C.cyan} width={4} draw={managedB} flow={managedB >= 1 ? frame / fps : undefined} />
            <Packet curve={MANAGED_OUT} t={managedPacket} color={C.cyanSoft} radius={9} />
          </>
        ) : null}
      </svg>

      {/* You. */}
      <div style={{ position: 'absolute', left: ANALYST.x, top: ANALYST.y, ...enter(frame, 2, { distance: 16 }) }}>
        <NodeCard icon="user" label="tú" sublabel="analista CTI" accent="cyan" state="active" width={ANALYST.w} />
      </div>
      <Status frame={frame} activeAt={activeAt} seenAt={visitW} firstAt={firstW} />

      {/* The three passive sources. */}
      {SOURCES.map((s, i) => (
        <SourceCard key={s.title} frame={frame} fps={fps} i={i} def={s} at={passiveAt + i * 8} namedAt={namedAt[i]} />
      ))}
      <div
        style={{
          position: 'absolute',
          left: SRC.x + SRC.w + 24,
          width: SERVER.x - SRC.x - SRC.w - 48,
          top: 548,
          textAlign: 'center',
          fontSize: TYPE.small,
          fontWeight: 600,
          color: C.sky,
          whiteSpace: 'nowrap',
          opacity: fadeIn(frame, passiveAt + 36, 14) * (1 - 0.6 * progress(frame, activeAt, 16)),
        }}
      >
        lo observan terceros
      </div>

      {/* The actor's side. */}
      <div style={{ position: 'absolute', left: SERVER.x, top: SERVER.y, width: SERVER.w, height: SERVER.h, ...enter(frame, 6, { distance: 16 }) }}>
        <ServerCard frame={frame} fps={fps} blinkAt={actorW} seen={seen} />
      </div>
      <div style={{ position: 'absolute', left: LOGS.x, top: LOGS.y, width: LOGS.w, height: 660 - LOGS.y, ...enter(frame, 10, { distance: 16 }) }}>
        <Panel
          title="sus logs"
          icon="terminal"
          accent="rose"
          right={
            frame >= visitW - 4 ? (
              <div style={enter(frame, visitW - 4, { distance: 8, axis: 'x' })}>
                <Chip accent="rose" solid size={TYPE.small}>
                  tu visita
                </Chip>
              </div>
            ) : null
          }
          glow={progress(frame, visitW - 4, 12) * (1 - 0.6 * progress(frame, managedAt, 20))} style={{ height: '100%' }} bodyStyle={{ padding: '12px 20px' }}>
          {LOG_LINES.map((l, k) => (
            <div key={k} style={{ fontFamily: FONT.mono, fontSize: TYPE.micro, lineHeight: 1.45, color: C.faint, whiteSpace: 'nowrap' }}>
              {l}
            </div>
          ))}
          <YourLine frame={frame} at={visitW - 4} />
        </Panel>
      </div>

      {/* Top band: before the intercept, the passive motto; after it, the disposable environment. */}
      <PassiveMotto frame={frame} at={passiveAt} outAt={interceptFrom - 16} />
      <EnvCard frame={frame} fps={fps} at={managedAt} corpAt={companyW} nextAt={nextW} />
    </Stage>
  );
}

function SourceCard({ frame, fps, i, def, at, namedAt }: { frame: number; fps: number; i: number; def: (typeof SOURCES)[number]; at: number; namedAt: number }) {
  if (frame < at - 4) return null;
  const inn = enter(frame, at, { distance: 20, axis: 'x' });
  const named = progress(frame, namedAt - 3, 8) * (1 - progress(frame, namedAt + 34, 16));
  const glow = named * (0.7 + 0.3 * pulse(frame, fps, 0.8));
  return (
    <div
      style={{
        position: 'absolute',
        left: SRC.x,
        top: SRC.ys[i],
        width: SRC.w,
        height: SRC.h,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        padding: '0 22px 0 18px',
        borderRadius: RADIUS.md,
        background: `linear-gradient(${alpha(C.cyan, 0.05 + 0.08 * named)}, ${alpha(C.cyan, 0.05 + 0.08 * named)}), ${C.ink850}`,
        border: `2px solid ${alpha(C.cyan, 0.35 + 0.55 * named)}`,
        boxShadow: glow > 0.01 ? `0 0 ${Math.round(30 * glow)}px ${alpha(C.cyan, 0.35 * glow)}` : `0 16px 40px ${alpha('#000000', 0.35)}`,
        ...inn,
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: 14,
          display: 'grid',
          placeItems: 'center',
          background: alpha(C.cyan, 0.12),
          border: `2px solid ${alpha(C.cyan, 0.35)}`,
          flexShrink: 0,
        }}
      >
        <Icon name={def.icon} size={34} color={C.cyan} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: TYPE.label, fontWeight: 800, color: C.textStrong, lineHeight: 1.1, whiteSpace: 'nowrap' }}>{def.title}</div>
        <div style={{ fontSize: TYPE.small, fontWeight: 600, color: C.cyanSoft, marginTop: 4, whiteSpace: 'nowrap' }}>{def.term}</div>
      </div>
    </div>
  );
}

/** The actor's server with its eye: closed while you stay passive, open once you visit. */
function ServerCard({ frame, fps, blinkAt, seen }: { frame: number; fps: number; blinkAt: number; seen: number }) {
  const blink = progress(frame, blinkAt - 2, 8) * (1 - progress(frame, blinkAt + 14, 12));
  const eyeGlow = seen * (0.65 + 0.35 * pulse(frame, fps, 0.7));
  return (
    <div
      style={{
        position: 'relative',
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        padding: '0 22px 0 18px',
        borderRadius: RADIUS.md,
        background: `linear-gradient(${alpha(C.rose, 0.08)}, ${alpha(C.rose, 0.08)}), ${C.ink850}`,
        border: `2px solid ${alpha(C.rose, 0.6)}`,
        boxShadow: `0 16px 40px ${alpha('#000000', 0.35)}`,
      }}
    >
      <div style={{ width: 60, height: 60, borderRadius: 14, display: 'grid', placeItems: 'center', background: alpha(C.rose, 0.14), border: `2px solid ${alpha(C.rose, 0.4)}`, flexShrink: 0 }}>
        <Icon name="server" size={34} color={C.rose} />
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: TYPE.label, fontWeight: 800, color: C.textStrong, lineHeight: 1.1, whiteSpace: 'nowrap' }}>su servidor</div>
        <div style={{ fontFamily: FONT.mono, fontSize: TYPE.micro, fontWeight: 700, color: C.roseSoft, marginTop: 6, letterSpacing: 1.5, whiteSpace: 'nowrap' }}>
          HOLLOW LANTERN
        </div>
      </div>
      <div
        style={{
          position: 'relative',
          width: 64,
          height: 64,
          borderRadius: 32,
          display: 'grid',
          placeItems: 'center',
          background: seen > 0.01 ? alpha(C.rose, 0.2 * seen) : alpha(C.ink700, 0.6),
          border: `2px solid ${seen > 0.01 ? alpha(C.rose, 0.5 + 0.5 * seen) : C.ink600}`,
          boxShadow: eyeGlow > 0.01 ? `0 0 ${Math.round(30 * eyeGlow)}px ${alpha(C.rose, 0.6 * eyeGlow)}` : undefined,
          transform: `scale(${1 + 0.12 * blink})`,
          flexShrink: 0,
        }}
      >
        <div style={{ position: 'absolute', opacity: 1 - seen }}>
          <Icon name="eyeOff" size={36} color={C.muted} />
        </div>
        <div style={{ position: 'absolute', opacity: seen }}>
          <Icon name="eye" size={36} color={C.rose} strokeWidth={2.2} />
        </div>
      </div>
    </div>
  );
}

/** Your visit, written in HIS log. */
function YourLine({ frame, at }: { frame: number; at: number }) {
  if (frame < at) return null;
  const p = progress(frame, at, 12);
  return (
    <div
      style={{
        marginTop: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '6px 12px',
        marginLeft: -12,
        marginRight: -12,
        borderRadius: 10,
        background: alpha(C.rose, 0.16),
        boxShadow: `inset 4px 0 0 ${C.rose}`,
        opacity: p,
        transform: `translateY(${(1 - p) * 10}px)`,
      }}
    >
      <span style={{ fontFamily: FONT.mono, fontSize: TYPE.label, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap' }}>{YOUR_LINE}</span>
    </div>
  );
}

/** Under «tú»: what kind of collection you are doing right now. */
function Status({ frame, activeAt, seenAt, firstAt }: { frame: number; activeAt: number; seenAt: number; firstAt: number }) {
  const active = progress(frame, activeAt, 14) * (1 - progress(frame, firstAt - 4, 14));
  const seen = fadeIn(frame, seenAt - 4, 12);
  const first = progress(frame, firstAt - 4, 14);
  const line = (icon: IconName, color: string, a: string, b: ReactNode, opacity: number) => (
    <div style={{ gridArea: '1 / 1', opacity }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Icon name={icon} size={34} color={color} strokeWidth={2.2} />
        <span style={{ fontSize: TYPE.label, fontWeight: 800, color, whiteSpace: 'nowrap' }}>{a}</span>
      </div>
      <div style={{ marginTop: 8, paddingLeft: 46 }}>{b}</div>
    </div>
  );
  if (active <= 0.001 && first <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left: ANALYST.x + 8, top: STATUS_TOP, width: ANALYST.w, display: 'grid' }}>
      {line(
        'eye',
        C.rose,
        'colección activa',
        <span style={{ fontSize: TYPE.label, fontWeight: 650, color: C.roseSoft, whiteSpace: 'nowrap', opacity: seen }}>te ven llegar</span>,
        active,
      )}
      {line('check', C.emerald, 'pasivo primero', null, first)}
    </div>
  );
}

/** «pasivo · el actor no te ve», top centre — gone before the intercept card arrives. */
function PassiveMotto({ frame, at, outAt }: { frame: number; at: number; outAt: number }) {
  const out = fadeOut(frame, outAt, 14);
  if (frame < at - 4 || out <= 0) return null;
  const inn = enter(frame, at, { distance: 16 });
  return (
    <div style={{ position: 'absolute', left: 0, width: 1728, top: 64, display: 'flex', justifyContent: 'center', ...inn, opacity: inn.opacity * out }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, whiteSpace: 'nowrap' }}>
        <div style={{ width: 76, height: 76, borderRadius: 38, display: 'grid', placeItems: 'center', background: alpha(C.emerald, 0.12), border: `2px solid ${alpha(C.emerald, 0.6)}` }}>
          <Icon name="eyeOff" size={42} color={C.emerald} strokeWidth={2.2} />
        </div>
        <span style={{ fontSize: TYPE.h3, fontWeight: 850, color: C.emerald, letterSpacing: -0.5 }}>pasivo</span>
        <span style={{ fontSize: TYPE.h3, fontWeight: 850, color: C.faint }}>·</span>
        <span style={{ fontSize: TYPE.h3, fontWeight: 800, color: C.textStrong, letterSpacing: -0.5 }}>el actor no te ve</span>
      </div>
    </div>
  );
}

/** The disposable environment (managed attribution, next lesson). */
function EnvCard({ frame, fps, at, corpAt, nextAt }: { frame: number; fps: number; at: number; corpAt: number; nextAt: number }) {
  if (frame < at - 6) return null;
  const p = springIn(frame, fps, at - 4, { damping: 16 });
  const corp = enter(frame, corpAt - 4, { distance: 10 });
  const next = enter(frame, nextAt - 4, { distance: 10 });
  // The card grows as each line is said, so it never shows an empty slot.
  const corpOpen = progress(frame, corpAt - 12, 12, EASE.inOut);
  const nextOpen = progress(frame, nextAt - 10, 12, EASE.inOut);
  return (
    <div
      style={{
        position: 'absolute',
        left: ENV_X,
        top: ENV.top,
        width: ENV.w,
        boxSizing: 'border-box',
        padding: '18px 30px 20px',
        borderRadius: RADIUS.lg,
        border: `3px dashed ${alpha(C.cyan, 0.75)}`,
        background: alpha(C.ink900, 0.95),
        boxShadow: `0 0 36px ${alpha(C.cyan, 0.16)}, 0 24px 60px ${alpha('#000000', 0.45)}`,
        opacity: Math.min(1, p * 1.3),
        transform: `translateY(${(1 - Math.min(1, p)) * -24}px)`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ width: 60, height: 60, borderRadius: 14, display: 'grid', placeItems: 'center', background: alpha(C.cyan, 0.12), border: `2px solid ${alpha(C.cyan, 0.4)}`, flexShrink: 0 }}>
          <Icon name="cloud" size={36} color={C.cyan} />
        </div>
        <div>
          <div style={{ fontSize: TYPE.h3, fontWeight: 850, color: C.textStrong, letterSpacing: -0.5, lineHeight: 1.05, whiteSpace: 'nowrap' }}>entorno desechable</div>
          <div style={{ height: 44 * corpOpen, overflow: 'hidden' }}>
            <div style={{ paddingTop: 6, fontSize: TYPE.label, fontWeight: 650, color: C.cyanSoft, whiteSpace: 'nowrap', ...corp }}>sin huella corporativa</div>
          </div>
        </div>
      </div>
      <div style={{ height: 70 * nextOpen, overflow: 'hidden' }}>
        <div style={{ paddingTop: 14, ...next }}>
          <Chip accent="cyan" icon="play" size={TYPE.label}>
            managed attribution · próxima lección
          </Chip>
        </div>
      </div>
    </div>
  );
}
