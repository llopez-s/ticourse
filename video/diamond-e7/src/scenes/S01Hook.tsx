import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, fadeIn, fadeOut, lerp, progress } from '../../../engine/src/theme/motion';
import { Chip, Icon, NodeCard, Panel, SeverityBadge } from '../../../engine/src/ui';
import { Diamond, VERTEX, vertexPoint, type VertexId } from './parts/Diamond';
import { Stage, segment, wordFrame } from './kit';

const SCENE = 's01-hook';

/** Beacon offsets in seconds from 02:13:00 — roughly every minute, never exactly (jitter). */
const BEACONS = [4, 61, 118, 183, 239, 302];
const AXIS_SPAN = 330; // seconds shown on the beacon strip (02:13:00 – 02:18:30)

const QUESTIONS: { v: VertexId; text: string }[] = [
  { v: 'adv', text: '¿quién?' },
  { v: 'cap', text: '¿con qué?' },
  { v: 'infra', text: '¿a través de qué?' },
  { v: 'vic', text: '¿contra quién?' },
];

// Row of question cards (phase 2) and the diamond they snap into (phase 3).
const Q_W = 400;
const Q_H = 150;
const Q_GAP = 28;
const Q_LEFT = (1728 - (4 * Q_W + 3 * Q_GAP)) / 2;
const Q_CY = 330;
const GEO = { cx: 864, cy: 330, hw: 430, hh: 240 };
const CARD_W = 330;

/**
 * Frame the narrator says a word. Throws when the word is missing, like kit.tsx's wordFrame, so a
 * re-voiced script that drops it fails loudly; `_fallback` documents the old estimate-mode offset.
 */
function safeWord(segmentId: string, word: string, nth: number, _fallback: number): number {
  return wordFrame(SCENE, segmentId, word, nth);
}

/**
 * S01 «02:13 UTC, un beacon»: the Meridian Dynamics SOC at night. An EDR alert
 * fires; ENG-WS-041 beacons over HTTPS to an unknown domain about once a minute
 * (jitter). One data point explains nothing: four questions do — and they snap
 * into the four corners of the Diamond Model.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const alertAt = props.cue('alert');
  const beaconAt = props.cue('beacon');
  const fourQ = props.cue('four-q');
  const titleAt = props.cue('title');
  const s03 = segment(props, 's01-03').from;

  const qAt = [
    safeWord('s01-03', 'quién', 0, fourQ + 40),
    safeWord('s01-03', 'con', 0, fourQ + 55),
    safeWord('s01-03', 'través', 0, fourQ + 70),
    safeWord('s01-03', 'quién', 1, fourQ + 90),
  ].map((f, i) => Math.max(fourQ + 8 + i * 10, f - 4));

  // Phase 1 (alert + beacon) leaves just before the first question card lands, so the stage is never empty.
  const phase1Out = fadeOut(frame, qAt[0] - 14, 16);
  // «Un beacon suelto es solo un dato»: dim the evidence a little while that is said.
  const loneDim = progress(frame, s03, 20) * 0.35;

  // Phase 3: question cards fly to the vertices, then hand over to <Diamond>.
  const fly = progress(frame, titleAt, 30, EASE.inOut);
  const handOver = progress(frame, titleAt + 24, 12);
  const edges = [0, 1, 2, 3].map((i) => progress(frame, titleAt + 26 + i * 6, 18));

  return (
    <Stage>
      {phase1Out > 0 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: phase1Out * (1 - loneDim), transform: `scale(${1 - 0.04 * (1 - phase1Out)})` }}>
          <SocPanel frame={frame} alertAt={alertAt} x={(1728 - 700) / 2 * (1 - progress(frame, beaconAt - 10, 24, EASE.inOut))} />
          <BeaconPanel frame={frame} beaconAt={beaconAt} />
        </div>
      ) : null}

      {frame >= fourQ - 4 && handOver < 1
        ? QUESTIONS.map((q, i) => {
            const rowX = Q_LEFT + i * (Q_W + Q_GAP) + Q_W / 2;
            const target = vertexPoint(q.v, GEO);
            const x = rowX + (target.x - rowX) * fly;
            const y = Q_CY + (target.y - Q_CY) * fly;
            const w = Q_W + (CARD_W - Q_W) * fly;
            const h = Q_H + (108 - Q_H) * fly;
            const inn = progress(frame, qAt[i], 16);
            if (inn <= 0) return null;
            const tint = VERTEX[q.v].tint;
            return (
              <div
                key={q.v}
                style={{
                  position: 'absolute',
                  left: x - w / 2,
                  top: y - h / 2 + (1 - inn) * 30,
                  width: w,
                  height: h,
                  boxSizing: 'border-box',
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: 20,
                  border: `3px solid ${alpha(tint, 0.7)}`,
                  background: `linear-gradient(180deg, ${alpha(tint, 0.18)} 0%, ${alpha(C.ink900, 0.95)} 100%)`,
                  boxShadow: `0 0 30px ${alpha(tint, 0.25)}`,
                  opacity: inn * (1 - handOver),
                  fontFamily: FONT.sans,
                  fontSize: TYPE.body,
                  fontWeight: 850,
                  color: tint,
                  whiteSpace: 'nowrap',
                }}
              >
                {q.text}
              </div>
            );
          })
        : null}

      {frame >= fourQ ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 540,
            width: 1728,
            textAlign: 'center',
            fontFamily: FONT.sans,
            fontSize: TYPE.body,
            fontWeight: 650,
            color: C.text,
            ...enter(frame, qAt[3] + 16, { distance: 14 }),
            opacity: progress(frame, qAt[3] + 16, 16) * (1 - progress(frame, titleAt - 10, 12)),
          }}
        >
          Un dato suelto no explica nada. Cuatro preguntas, sí.
        </div>
      ) : null}

      {handOver > 0 ? (
        <>
          <Diamond
            {...GEO}
            cardW={CARD_W}
            edges={edges}
            vertices={{
              adv: { show: handOver },
              cap: { show: handOver },
              infra: { show: handOver },
              vic: { show: handOver },
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: GEO.cx - 260,
              top: GEO.cy - 80,
              width: 520,
              textAlign: 'center',
              fontFamily: FONT.sans,
              ...enter(frame, titleAt + 34, { distance: 18 }),
            }}
          >
            <div style={{ fontSize: TYPE.h2, fontWeight: 850, color: C.textStrong, lineHeight: 1.1 }}>Diamond Model</div>
            <div style={{ fontSize: TYPE.h3, fontWeight: 800, color: C.cyanSoft, marginTop: 8, lineHeight: 1.1 }}>
              evento <span style={{ color: C.rose }}>E7</span>
            </div>
          </div>
        </>
      ) : null}
    </Stage>
  );
}

/** The SOC console: quiet night shift, then the alert card lands at `alertAt`. */
function SocPanel({ frame, alertAt, x }: { frame: number; alertAt: number; x: number }) {
  const fired = frame >= alertAt;
  const card = enter(frame, alertAt, { distance: 30 });
  const flash = fired ? 1 - progress(frame, alertAt, 40) : 0;
  return (
    <div style={{ position: 'absolute', left: x, top: 30, width: 700, height: 600, ...enter(frame, 0, { distance: 12, duration: 14 }) }}>
      <Panel
        title="SOC · Meridian Dynamics"
        icon="radar"
        accent={fired ? 'rose' : 'cyan'}
        glow={flash}
        right={
          <Chip accent="muted" icon="clock" size={TYPE.micro}>
            turno de noche
          </Chip>
        }
        style={{ height: '100%' }}
        bodyStyle={{ padding: '28px 32px' }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, fontFamily: FONT.mono }}>
          <span style={{ fontSize: TYPE.h1, fontWeight: 700, color: C.textStrong }}>{fired ? '02:13' : '02:12'}</span>
          <span style={{ fontSize: TYPE.label, color: C.muted }}>UTC · 05-03-2026</span>
        </div>

        {!fired ? (
          <div style={{ marginTop: 40, fontFamily: FONT.sans, fontSize: TYPE.label, color: C.muted, fontStyle: 'italic' }}>
            Sin alertas activas…
          </div>
        ) : (
          <div
            style={{
              marginTop: 30,
              padding: '22px 26px',
              borderRadius: RADIUS.md,
              border: `2px solid ${alpha(C.rose, 0.75)}`,
              background: alpha(C.rose, 0.08),
              boxShadow: `0 0 ${20 + 30 * flash}px ${alpha(C.rose, 0.2 + 0.3 * flash)}`,
              ...card,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Icon name="bell" size={40} color={C.rose} />
              <SeverityBadge level="ALTA" />
              <span style={{ fontFamily: FONT.mono, fontSize: TYPE.small, color: C.muted, marginLeft: 'auto' }}>EDR</span>
            </div>
            <div style={{ marginTop: 16, fontFamily: FONT.sans, fontSize: TYPE.h3, fontWeight: 800, color: C.textStrong, lineHeight: 1.15 }}>
              Beacon HTTPS saliente
            </div>
            <div style={{ marginTop: 18, display: 'grid', gap: 10, fontFamily: FONT.sans, fontSize: TYPE.label, color: C.text }}>
              <Field label="Hora" value="02:13 UTC" />
              <Field label="Fecha" value="05-03-2026" />
              <Field label="Host" value="ENG-WS-041" mono />
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}

/** 32 px caption under a host/domain card (the narration names these). */
function subStyle(color: string) {
  return { marginTop: 10, paddingLeft: 6, fontFamily: FONT.sans, fontSize: TYPE.label, fontWeight: 650, color, whiteSpace: 'nowrap' as const };
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <span style={{ width: 110, color: C.muted, fontWeight: 600 }}>{label}</span>
      <span style={{ fontFamily: mono ? FONT.mono : FONT.sans, fontWeight: 700, color: C.textStrong }}>{value}</span>
    </div>
  );
}

/** Host → unknown domain, and a strip of beacon ticks at irregular ~60 s intervals. */
function BeaconPanel({ frame, beaconAt }: { frame: number; beaconAt: number }) {
  if (frame < beaconAt - 6) return null;
  const LEFT = 740;
  const W = 1728 - LEFT;
  const inn = enter(frame, beaconAt - 6, { distance: 26, axis: 'x' });
  // Tick i lands at tickAt[i]; a packet rides the host→domain link just before.
  const tickAt = BEACONS.map((_, i) => beaconAt + 40 + i * 22);
  const lastTick = tickAt.filter((t) => frame >= t).length;

  const LINK_Y = 110;
  const linkX1 = 400;
  const linkX2 = W - 458;
  const packetT = tickAt
    .map((t) => (frame >= t - 16 && frame < t ? (frame - (t - 16)) / 16 : -1))
    .find((t) => t >= 0);

  const STRIP_L = 50;
  const STRIP_W = W - 100;
  const STRIP_Y = 420;
  const xOf = (sec: number) => STRIP_L + (sec / AXIS_SPAN) * STRIP_W;

  return (
    <div style={{ position: 'absolute', left: LEFT, top: 30, width: W, height: 600, ...inn }}>
      {/* host → domain */}
      <div style={{ position: 'absolute', left: 0, top: LINK_Y - 50 }}>
        <NodeCard icon="desktop" label="ENG-WS-041" accent="cyan" state="active" width={400} />
        <div style={subStyle(C.cyanSoft)}>ingeniería de propulsión</div>
      </div>
      <svg width={W} height={600} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <line x1={linkX1} y1={LINK_Y} x2={linkX2 - 12} y2={LINK_Y} stroke={alpha(C.rose, 0.7)} strokeWidth={4} strokeDasharray="10 8" />
        <polygon points={`${linkX2 - 14},${LINK_Y - 10} ${linkX2},${LINK_Y} ${linkX2 - 14},${LINK_Y + 10}`} fill={C.rose} />
        {packetT !== undefined ? <circle cx={linkX1 + (linkX2 - linkX1) * packetT} cy={LINK_Y} r={9} fill={C.roseSoft} /> : null}
      </svg>
      <div style={{ position: 'absolute', left: linkX2 + 8, top: LINK_Y - 50 }}>
        <NodeCard icon="globe" label="update-svc-cdn.com" accent="rose" state="alert" width={450} />
        <div style={subStyle(C.roseSoft)}>dominio desconocido</div>
      </div>
      <div style={{ position: 'absolute', left: (linkX1 + linkX2) / 2 - 80, top: LINK_Y - 48, width: 160, textAlign: 'center' }}>
        <span style={{ fontFamily: FONT.mono, fontSize: TYPE.small, fontWeight: 700, color: C.roseSoft }}>HTTPS</span>
      </div>

      {/* beacon strip */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 250,
          width: W,
          height: 330,
          borderRadius: RADIUS.lg,
          border: `2px solid ${C.ink700}`,
          background: alpha(C.ink900, 0.9),
        }}
      >
        <div style={{ position: 'absolute', left: 30, top: 22, display: 'flex', alignItems: 'center', gap: 14 }}>
          <Icon name="radar" size={30} color={C.rose} />
          <span style={{ fontFamily: FONT.sans, fontSize: TYPE.label, fontWeight: 750, color: C.textStrong }}>Beacon · cada ~60 s</span>
          <Chip accent="amber" size={TYPE.micro} style={{ marginLeft: 8, opacity: fadeIn(frame, tickAt[3], 14) }}>
            jitter
          </Chip>
        </div>
        <svg width={W} height={330} style={{ position: 'absolute', left: 0, top: 0 }}>
          <line x1={STRIP_L} y1={STRIP_Y - 250} x2={STRIP_L + STRIP_W} y2={STRIP_Y - 250} stroke={C.ink600} strokeWidth={3} />
          {[0, 60, 120, 180, 240, 300].map((s) => (
            <line key={s} x1={xOf(s)} y1={STRIP_Y - 262} x2={xOf(s)} y2={STRIP_Y - 238} stroke={C.ink500} strokeWidth={2} />
          ))}
          {BEACONS.map((s, i) => {
            const p = progress(frame, tickAt[i], 10);
            if (p <= 0) return null;
            const h = 78 * p;
            const hot = i === lastTick - 1 ? 1 - progress(frame, tickAt[i], 24) : 0;
            return (
              <g key={s}>
                <line x1={xOf(s)} y1={STRIP_Y - 250} x2={xOf(s)} y2={STRIP_Y - 250 - h} stroke={C.rose} strokeWidth={6} strokeLinecap="round" />
                <circle cx={xOf(s)} cy={STRIP_Y - 250 - h} r={9 + 8 * hot} fill={alpha(C.roseSoft, 0.6 + 0.4 * (1 - hot))} />
              </g>
            );
          })}
        </svg>
        {/* time labels */}
        {[
          { s: 0, t: '02:13' },
          { s: 120, t: '02:15' },
          { s: 240, t: '02:17' },
        ].map((l) => (
          <div
            key={l.s}
            style={{
              position: 'absolute',
              left: xOf(l.s) - 50,
              top: STRIP_Y - 230,
              width: 100,
              textAlign: 'center',
              fontFamily: FONT.mono,
              fontSize: TYPE.micro,
              color: C.muted,
            }}
          >
            {l.t}
          </div>
        ))}
        {/* interval readouts under the gaps */}
        <div
          style={{
            position: 'absolute',
            left: 30,
            bottom: 24,
            display: 'flex',
            gap: 12,
            fontFamily: FONT.mono,
            fontSize: TYPE.small,
            fontWeight: 700,
          }}
        >
          {BEACONS.slice(1).map((s, i) => (
            <span
              key={s}
              style={{
                padding: '4px 10px',
                borderRadius: RADIUS.sm,
                background: alpha(C.amber, 0.1),
                border: `2px solid ${alpha(C.amber, 0.4)}`,
                color: C.amber,
                opacity: lerp(frame, [tickAt[i + 1], tickAt[i + 1] + 10], [0, 1]),
              }}
            >
              {s - BEACONS[i]} s
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
