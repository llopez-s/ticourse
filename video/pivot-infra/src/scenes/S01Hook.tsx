import type { CSSProperties, ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, fadeIn, progress, pulse, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, Panel, Stamp, type IconName } from '../../../engine/src/ui';
import { Stage, segment, wordFrame } from './kit';
import { Problem, type ProblemTimes } from './parts/s01-hook/Problem';

const S = 's01-hook';
const W = 1728;

// Phase 1: the E7 infrastructure card from the previous video (V3), under a heading the voice names.
const E7_HEAD_H = 56;
const E7 = { left: 40, top: 76, width: 1648, height: 564 };

// Phase 2: the adversary's three pieces of paperwork, each leaving a trail.
const CARD_W = 500;
const CARD_H = 200;
const CARD_GAP = 64;
const CARD_Y = 104;
const CARD_X = [0, 1, 2].map((i) => (W - (3 * CARD_W + 2 * CARD_GAP)) / 2 + i * (CARD_W + CARD_GAP));
const TRAIL_Y = CARD_Y + CARD_H;
const STRIP_Y = TRAIL_Y + 56;
const STRIP_H = 122;

type Trace = { icon: IconName; title: string; value: string; trailIcon: IconName; trailLabel: string; trailLine: string };

const TRACES: Trace[] = [
  {
    icon: 'globe',
    title: 'Dominio registrado',
    value: 'update-svc-cdn.com',
    trailIcon: 'file',
    trailLabel: 'ficha de registro',
    trailLine: 'registrador · fecha de alta',
  },
  {
    icon: 'server',
    title: 'Servidor alquilado',
    value: '185.220.x.x',
    trailIcon: 'database',
    trailLabel: 'resoluciones DNS',
    trailLine: 'first seen 2026-02-11',
  },
  {
    icon: 'lock',
    title: 'Certificado',
    value: 'CN=updatesvc',
    trailIcon: 'key',
    trailLabel: 'huella en escaneos',
    trailLine: 'SHA1 d4:7e:02…',
  },
];

/**
 * s01-hook «Dos pistas en el aire»: first the problem and the promise — a
 * malicious domain whose IP bursts into 14.000 neighbours, «¿Por dónde
 * tiras?», and the title «Pivotar por la infraestructura»: choose the lead
 * that takes you to the attacker, not to the noise. Then the E7 infrastructure
 * card from Meridian's alert — the C2 domain, its IP stamped RUIDO and two
 * pending pivots (the self-signed certificate seen on 2 more IPs, the
 * historical WHOIS). Then the adversary's paperwork: it registers a domain,
 * rents a server and puts a certificate on it, and each leaves a public trail.
 * Following that trail is the title again, as the closing beat.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleAt = props.cue('title');
  const pendingAt = props.cue('e7-pending');
  const registerAt = props.cue('register');
  const rentAt = props.cue('rent');
  const serveAt = props.cue('serve');
  const e7From = segment(props, 's01-03').from;

  // s01-01 / s01-02: the problem and the promise.
  const problem: ProblemTimes = {
    domainAt: wordFrame(S, 's01-01', 'dominio'),
    ipAt: wordFrame(S, 's01-01', 'IP'),
    burstAt: wordFrame(S, 's01-01', 'catorce') - 6,
    forkAt: wordFrame(S, 's01-01', '¿Por') - 4,
    titleAt,
    elegirAt: wordFrame(S, 's01-02', 'elegir'),
    pistaAt: wordFrame(S, 's01-02', 'pista'),
    atacanteAt: wordFrame(S, 's01-02', 'atacante,'),
    ruidoAt: wordFrame(S, 's01-02', 'ruido.'),
    outAt: e7From - 14,
  };

  // s01-03 / s01-04: the E7 card and its two pending pivots.
  const certWord = wordFrame(S, 's01-03', 'certificado');
  const whoisWord = wordFrame(S, 's01-03', 'registro');
  const followE7 = wordFrame(S, 's01-04', 'seguimos.');
  const advWord = wordFrame(S, 's01-04', 'adversario');
  const paperWord = wordFrame(S, 's01-04', 'papeleo.');
  // s01-05 / s01-06: the paperwork, its trail and the closing title.
  const trailWord = wordFrame(S, 's01-05', 'rastro,');
  const publicWord = wordFrame(S, 's01-05', 'público.');
  const infraWord = wordFrame(S, 's01-06', 'infraestructura', 0);
  const followWord = wordFrame(S, 's01-06', 'Seguir');
  const closeAt = wordFrame(S, 's01-06', 'pivotar');
  const youWord = wordFrame(S, 's01-06', 'tú.');

  // The E7 card arrives with s01-03 and leaves as the adversary is named; phase 2 leaves as the title comes back.
  const e7In = progress(frame, e7From - 5, 16);
  const e7Out = Math.min(advWord - 22, registerAt - 40);
  const e7Exit = progress(frame, e7Out, 16, EASE.inOut);
  const phase2Out = progress(frame, closeAt - 14, 12, EASE.inOut);
  const slotsAt = Math.min(advWord + 6, registerAt - 12);
  const fills = [registerAt, rentAt, serveAt];

  return (
    <Stage>
      <Problem frame={frame} fps={fps} t={problem} />

      {frame >= e7From - 5 && e7Exit < 1 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: (1 - e7Exit) * e7In,
            transform: `translateY(${-24 * e7Exit + 18 * (1 - e7In)}px) scale(${1 - 0.04 * e7Exit})`,
          }}
        >
          <E7Heading />
          <div style={{ position: 'absolute', ...E7 }}>
            <E7Card frame={frame} fps={fps} pendingAt={pendingAt} certWord={certWord} whoisWord={whoisWord} followAt={followE7} />
          </div>
        </div>
      ) : null}

      {frame >= advWord - 8 && phase2Out < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - phase2Out, transform: `translateY(${18 * phase2Out}px)` }}>
          <Header frame={frame} advWord={advWord} paperWord={paperWord} infraWord={infraWord} />

          {TRACES.map((t, i) => (
            <TraceColumn
              key={t.title}
              trace={t}
              x={CARD_X[i]}
              frame={frame}
              slotAt={slotsAt + i * 4}
              fillAt={fills[i]}
              trailWord={trailWord}
              infraWord={infraWord}
            />
          ))}

          <FollowLinks frame={frame} at={followWord} />

          {frame >= publicWord - 6 ? (
            <div style={{ position: 'absolute', left: 0, top: STRIP_Y + STRIP_H + 50, width: W, display: 'flex', justifyContent: 'center', ...enter(frame, publicWord - 6, { distance: 16 }) }}>
              <Chip accent="cyan" icon="eye" size={40}>
                rastro casi siempre público
              </Chip>
            </div>
          ) : null}
        </div>
      ) : null}

      {frame >= closeAt - 4 ? <TitleCard frame={frame} fps={fps} at={closeAt - 2} youWord={youWord} /> : null}
    </Stage>
  );
}

/** «Partimos de una alerta de Meridian, el evento E7»: named big, above the card. */
function E7Heading() {
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: E7_HEAD_H, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, fontFamily: FONT.sans }}>
      <Icon name="alert" size={44} color={C.cyan} />
      <span style={{ fontSize: 44, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap', letterSpacing: -0.5 }}>
        Alerta de <span style={{ color: C.cyan }}>Meridian</span> <span style={{ color: C.faint }}>·</span> evento E7
      </span>
    </div>
  );
}

/** The E7 card: what V3 left filed under Infrastructure, plus the two pivots still pending. */
function E7Card({
  frame,
  fps,
  pendingAt,
  certWord,
  whoisWord,
  followAt,
}: {
  frame: number;
  fps: number;
  pendingAt: number;
  certWord: number;
  whoisWord: number;
  followAt: number;
}) {
  const lit = progress(frame, pendingAt - 4, 14);
  const breathe = 0.8 + 0.2 * pulse(frame, fps, 0.5);
  // «Hoy las seguimos»: both pivots light up together.
  const both = progress(frame, followAt - 4, 12);
  const certHi = Math.max(both, progress(frame, certWord - 4, 12) * (1 - 0.45 * progress(frame, whoisWord - 2, 14)));
  const whoisHi = Math.max(both, progress(frame, whoisWord - 4, 12));
  const certGlow = (0.45 * lit + 0.55 * certHi) * breathe;
  const whoisGlow = (0.35 * lit + 0.65 * whoisHi) * breathe;
  // Once the voice moves to the pending pivots, what we already know steps back.
  const knownDim = progress(frame, pendingAt - 4, 16);
  return (
    <Panel
      title="Ficha de infraestructura"
      icon="globe"
      accent="cyan"
      right={
        <Chip accent="muted" icon="clock" size={TYPE.micro}>
          05-03-2026 · 02:13 UTC
        </Chip>
      }
      style={{ height: '100%' }}
      bodyStyle={{ padding: '34px 40px', display: 'flex', gap: 48 }}
    >
      {/* Left column: what we already know. */}
      <div
        style={{
          position: 'relative',
          width: 600,
          flexShrink: 0,
          fontFamily: FONT.sans,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          opacity: 1 - 0.4 * knownDim,
        }}
      >
        <FieldLabel>Dominio del C2</FieldLabel>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 6 }}>
          <Icon name="globe" size={40} color={C.sky} />
          <span style={{ fontFamily: FONT.mono, fontSize: 48, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>update-svc-cdn.com</span>
        </div>
        <div style={{ marginTop: 14 }}>
          <Chip accent="rose" icon="radar" size={28}>
            C2 · beacon HTTPS
          </Chip>
        </div>

        <div style={{ position: 'relative', marginTop: 44 }}>
          <div style={{ opacity: 0.55 }}>
            <FieldLabel>IP</FieldLabel>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 6 }}>
              <Icon name="server" size={40} color={C.sky} />
              <span style={{ fontFamily: FONT.mono, fontSize: 48, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>185.220.x.x</span>
            </div>
            <div style={{ marginTop: 14 }}>
              <Chip accent="amber" icon="users" size={28}>
                hosting compartido
              </Chip>
            </div>
          </div>
          <div style={{ position: 'absolute', left: 400, top: 22 }}>
            <Stamp frame={frame} at={-30} accent="amber" rotate={-8} size={TYPE.h3}>
              RUIDO
            </Stamp>
          </div>
        </div>
      </div>

      {/* Divider. */}
      <div style={{ width: 2, alignSelf: 'stretch', background: C.ink700 }} />

      {/* Right column: the two pending pivots. */}
      <div style={{ flex: 1, minWidth: 0, fontFamily: FONT.sans, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span
            style={{
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: 3,
              color: lit > 0.5 ? C.emerald : C.muted,
              whiteSpace: 'nowrap',
            }}
          >
            PIVOTES PENDIENTES
          </span>
          <span
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              display: 'grid',
              placeItems: 'center',
              fontSize: 30,
              fontWeight: 850,
              color: lit > 0.5 ? C.ink950 : C.muted,
              background: lit > 0.5 ? C.emerald : alpha(C.muted, 0.15),
              transform: `scale(${1 + 0.25 * lit * (1 - progress(frame, pendingAt + 6, 14))})`,
            }}
          >
            2
          </span>
        </div>

        <PendingCard icon="key" tint={C.emerald} glow={certGlow} dim={1 - lit} style={{ marginTop: 24 }}>
          <div style={{ fontSize: 42, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap', lineHeight: 1.15 }}>
            cert autofirmado <span style={{ fontFamily: FONT.mono, fontSize: 40, color: C.emerald }}>CN=updatesvc</span>
          </div>
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 12, fontSize: 38, fontWeight: 700, color: C.text, whiteSpace: 'nowrap' }}>
            <Icon name="link" size={34} color={C.emerald} />
            visto en 2 IP más
          </div>
        </PendingCard>

        <PendingCard icon="clock" tint={C.sky} glow={whoisGlow} dim={1 - lit} dashed style={{ marginTop: 22 }}>
          <div style={{ fontSize: 42, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap', lineHeight: 1.15 }}>WHOIS histórico: pendiente</div>
          <div style={{ marginTop: 8, fontSize: 32, fontWeight: 650, color: C.muted, whiteSpace: 'nowrap' }}>registro del dominio · sin mirar</div>
        </PendingCard>
      </div>
    </Panel>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <div style={{ fontSize: 28, fontWeight: 650, color: C.muted, whiteSpace: 'nowrap' }}>{children}</div>;
}

function PendingCard({
  icon,
  tint,
  glow,
  dim,
  dashed = false,
  style,
  children,
}: {
  icon: IconName;
  tint: string;
  glow: number;
  dim: number;
  dashed?: boolean;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        padding: '20px 26px',
        borderRadius: RADIUS.lg,
        border: `2px ${dashed && glow < 0.5 ? 'dashed' : 'solid'} ${alpha(tint, 0.3 + 0.6 * glow)}`,
        background: `linear-gradient(90deg, ${alpha(tint, 0.06 + 0.12 * glow)} 0%, ${alpha(C.ink900, 0.9)} 75%)`,
        boxShadow: glow > 0.05 ? `0 0 ${Math.round(12 + 30 * glow)}px ${alpha(tint, 0.35 * glow)}` : 'none',
        opacity: 1 - 0.3 * dim,
        ...style,
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          flexShrink: 0,
          borderRadius: 18,
          display: 'grid',
          placeItems: 'center',
          background: alpha(tint, 0.14),
          border: `2px solid ${alpha(tint, 0.4)}`,
        }}
      >
        <Icon name={icon} size={40} color={tint} />
      </div>
      <div style={{ minWidth: 0 }}>{children}</div>
    </div>
  );
}

/** Top line: HOLLOW LANTERN does paperwork too; then it becomes «su infraestructura, lo que más se le ve». */
function Header({ frame, advWord, paperWord, infraWord }: { frame: number; advWord: number; paperWord: number; infraWord: number }) {
  const swap = progress(frame, infraWord - 6, 14, EASE.inOut);
  const paper = progress(frame, paperWord - 4, 8);
  return (
    <div style={{ position: 'absolute', left: 0, top: 10, width: W, height: 64, fontFamily: FONT.sans }}>
      {swap < 1 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 22,
            opacity: 1 - swap,
            transform: `translateY(${-10 * swap}px)`,
          }}
        >
          <div style={enter(frame, advWord - 6, { distance: 14 })}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                padding: '8px 22px',
                borderRadius: RADIUS.pill,
                border: `2px solid ${alpha(C.rose, 0.7)}`,
                background: alpha(C.rose, 0.1),
                fontSize: TYPE.label,
                fontWeight: 800,
                letterSpacing: 1.5,
                color: C.roseSoft,
                whiteSpace: 'nowrap',
              }}
            >
              <Icon name="user" size={32} color={C.rose} />
              HOLLOW LANTERN
            </span>
          </div>
          <span style={{ fontSize: TYPE.body, fontWeight: 700, color: C.text, whiteSpace: 'nowrap', opacity: fadeIn(frame, advWord + 2, 12) }}>
            también tiene que hacer <span style={{ color: paper > 0.5 ? C.amber : C.text }}>papeleo</span>
          </span>
        </div>
      ) : null}
      {swap > 0 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            opacity: swap,
            transform: `translateY(${10 * (1 - swap)}px)`,
          }}
        >
          <Icon name="eye" size={40} color={C.sky} />
          <span style={{ fontSize: TYPE.body, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap' }}>
            Su <span style={{ color: C.sky }}>infraestructura</span>: lo que más se le ve
          </span>
        </div>
      ) : null}
    </div>
  );
}

/** One piece of paperwork: an empty form slot that fills on its cue, then drops its trail. */
function TraceColumn({
  trace,
  x,
  frame,
  slotAt,
  fillAt,
  trailWord,
  infraWord,
}: {
  trace: Trace;
  x: number;
  frame: number;
  slotAt: number;
  fillAt: number;
  trailWord: number;
  infraWord: number;
}) {
  const { fps } = useVideoConfig();
  const slotIn = enter(frame, slotAt, { distance: 20 });
  const fill = springIn(frame, fps, fillAt - 2, { damping: 16 });
  const filled = Math.min(1, fill * 1.2);
  const trailDraw = progress(frame, fillAt + 8, 12);
  const stripIn = enter(frame, fillAt + 14, { distance: 14 });
  const trailHot = progress(frame, trailWord - 4, 12);
  const infraGlow = progress(frame, infraWord - 4, 14);
  const cx = x + CARD_W / 2;
  return (
    <>
      {/* The form slot / filled card. */}
      <div
        style={{
          position: 'absolute',
          left: x,
          top: CARD_Y,
          width: CARD_W,
          height: CARD_H,
          boxSizing: 'border-box',
          borderRadius: RADIUS.lg,
          border: `2px ${filled > 0.5 ? 'solid' : 'dashed'} ${filled > 0.5 ? alpha(C.sky, 0.55 + 0.4 * infraGlow) : C.ink600}`,
          background: filled > 0 ? `linear-gradient(180deg, ${alpha(C.sky, 0.1 * filled)} 0%, ${alpha(C.ink900, 0.95)} 100%)` : alpha(C.ink900, 0.6),
          boxShadow: infraGlow > 0 ? `0 0 ${Math.round(30 * infraGlow)}px ${alpha(C.sky, 0.3 * infraGlow)}` : 'none',
          fontFamily: FONT.sans,
          overflow: 'hidden',
          ...slotIn,
        }}
      >
        {/* Blank form lines (the paperwork still to fill). */}
        {filled < 1 ? (
          <div style={{ position: 'absolute', inset: 0, padding: '34px 30px', opacity: 1 - filled }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Icon name="file" size={40} color={C.ink500} />
              <div style={{ width: 220, height: 18, borderRadius: 9, background: C.ink700 }} />
            </div>
            <div style={{ marginTop: 34, width: 380, height: 16, borderRadius: 8, background: C.ink700 }} />
            <div style={{ marginTop: 20, width: 300, height: 16, borderRadius: 8, background: C.ink700 }} />
          </div>
        ) : null}
        {filled > 0 ? (
          <div style={{ position: 'absolute', inset: 0, padding: '28px 30px', opacity: filled, transform: `translateY(${(1 - filled) * 16}px)` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <div
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 18,
                  display: 'grid',
                  placeItems: 'center',
                  background: alpha(C.sky, 0.14),
                  border: `2px solid ${alpha(C.sky, 0.45)}`,
                  transform: `scale(${0.7 + 0.3 * fill})`,
                }}
              >
                <Icon name={trace.icon} size={40} color={C.sky} />
              </div>
              <span style={{ fontSize: TYPE.body, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>{trace.title}</span>
            </div>
            <div style={{ marginTop: 26, fontFamily: FONT.mono, fontSize: TYPE.body, fontWeight: 750, color: C.sky, whiteSpace: 'nowrap' }}>{trace.value}</div>
          </div>
        ) : null}
      </div>

      {/* The trail it leaves. */}
      <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
        {trailDraw > 0 ? (
          <line
            x1={cx}
            y1={TRAIL_Y + 4}
            x2={cx}
            y2={TRAIL_Y + 4 + (STRIP_Y - TRAIL_Y - 8) * trailDraw}
            stroke={alpha(C.sky, 0.45 + 0.5 * trailHot)}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray="4 10"
            strokeDashoffset={-frame * 0.6 * trailHot}
          />
        ) : null}
      </svg>
      {frame >= fillAt + 14 ? (
        <div
          style={{
            position: 'absolute',
            left: x,
            top: STRIP_Y,
            width: CARD_W,
            height: STRIP_H,
            boxSizing: 'border-box',
            padding: '16px 20px',
            borderRadius: RADIUS.md,
            border: `2px dashed ${alpha(C.sky, 0.35 + 0.5 * trailHot)}`,
            background: alpha(C.ink950, 0.75),
            boxShadow: trailHot > 0 ? `0 0 ${Math.round(22 * trailHot)}px ${alpha(C.sky, 0.22 * trailHot)}` : 'none',
            fontFamily: FONT.sans,
            ...stripIn,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Icon name={trace.trailIcon} size={30} color={C.cyanSoft} />
            <span style={{ fontSize: 30, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap' }}>{trace.trailLabel}</span>
            <span style={{ marginLeft: 'auto', fontSize: TYPE.micro, fontWeight: 800, letterSpacing: 2, color: trailHot > 0.5 ? C.cyanSoft : C.faint }}>RASTRO</span>
          </div>
          <div style={{ marginTop: 10, fontFamily: FONT.mono, fontSize: 28, fontWeight: 600, color: C.cyanSoft, whiteSpace: 'nowrap' }}>{trace.trailLine}</div>
        </div>
      ) : null}
    </>
  );
}

/** «Seguir ese rastro»: emerald hops from one trail to the next. */
function FollowLinks({ frame, at }: { frame: number; at: number }) {
  if (frame < at - 4) return null;
  const y = STRIP_Y + STRIP_H / 2;
  return (
    <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
      {[0, 1].map((i) => {
        const p = progress(frame, at - 4 + i * 10, 14, EASE.inOut);
        if (p <= 0) return null;
        const x1 = CARD_X[i] + CARD_W + 8;
        const x2 = CARD_X[i + 1] - 8;
        const xe = x1 + (x2 - x1) * p;
        return (
          <g key={i}>
            <line x1={x1} y1={y} x2={xe - 10} y2={y} stroke={C.emerald} strokeWidth={5} strokeLinecap="round" />
            <polygon points={`${xe - 14},${y - 10} ${xe},${y} ${xe - 14},${y + 10}`} fill={C.emerald} opacity={p} />
          </g>
        );
      })}
    </svg>
  );
}

/** The title and the three things we will follow, chained. */
function TitleCard({ frame, fps, at, youWord }: { frame: number; fps: number; at: number; youWord: number }) {
  const t = springIn(frame, fps, at, { damping: 17 });
  const rule = progress(frame, at + 8, 18);
  const PILLS: { icon: IconName; label: string }[] = [
    { icon: 'globe', label: 'dominios' },
    { icon: 'server', label: 'servidores' },
    { icon: 'lock', label: 'certificados' },
  ];
  const PILL_W = 330;
  const PILL_GAP = 110;
  const pillsLeft = (W - (3 * PILL_W + 2 * PILL_GAP)) / 2;
  const PILL_Y = 330;
  const you = enter(frame, Math.max(at + 30, youWord - 4), { distance: 14 });
  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: FONT.sans }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 120,
          width: W,
          textAlign: 'center',
          fontSize: TYPE.h1,
          fontWeight: 850,
          letterSpacing: -2,
          lineHeight: 1.05,
          color: C.textStrong,
          whiteSpace: 'nowrap',
          opacity: Math.min(1, t * 1.4),
          transform: `translateY(${(1 - t) * 30}px) scale(${0.96 + 0.04 * t})`,
        }}
      >
        Pivotar por la <span style={{ color: C.cyan }}>infraestructura</span>
      </div>
      <div style={{ position: 'absolute', left: (W - 720 * rule) / 2, top: 250, width: 720 * rule, height: 2, background: C.ink600 }} />

      <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {[0, 1].map((i) => {
          const p = progress(frame, at + 22 + i * 8, 14, EASE.inOut);
          if (p <= 0) return null;
          const x1 = pillsLeft + (i + 1) * PILL_W + i * PILL_GAP + 12;
          const x2 = x1 + PILL_GAP - 24;
          const xe = x1 + (x2 - x1) * p;
          const y = PILL_Y + 38;
          return (
            <g key={i}>
              <line x1={x1} y1={y} x2={xe - 10} y2={y} stroke={alpha(C.cyan, 0.8)} strokeWidth={4} strokeLinecap="round" />
              <polygon points={`${xe - 14},${y - 9} ${xe},${y} ${xe - 14},${y + 9}`} fill={C.cyan} opacity={p} />
            </g>
          );
        })}
      </svg>
      {PILLS.map((p, i) => {
        const inn = springIn(frame, fps, at + 12 + i * 6, { damping: 16 });
        return (
          <div
            key={p.label}
            style={{
              position: 'absolute',
              left: pillsLeft + i * (PILL_W + PILL_GAP),
              top: PILL_Y,
              width: PILL_W,
              height: 76,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 14,
              borderRadius: RADIUS.pill,
              border: `2px solid ${alpha(C.sky, 0.65)}`,
              background: alpha(C.sky, 0.08),
              fontSize: TYPE.body,
              fontWeight: 750,
              color: C.textStrong,
              whiteSpace: 'nowrap',
              opacity: Math.min(1, inn * 1.3),
              transform: `translateY(${(1 - inn) * 24}px)`,
            }}
          >
            <Icon name={p.icon} size={38} color={C.sky} />
            {p.label}
          </div>
        );
      })}

      <div style={{ position: 'absolute', left: 0, top: 480, width: W, display: 'flex', justifyContent: 'center', ...you }}>
        <Chip accent="emerald" icon="target" size={42}>
          hoy lo haces tú
        </Chip>
      </div>
    </div>
  );
}
