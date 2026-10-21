import type { CSSProperties, ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { clamp01, mix } from '../../../engine/src/ui';
import { CRANE_PLACE, Crane, craneAnchorAt, type CranePart } from './parts/Crane';
import { FireTruck, ImageTag, TenMinuteClock, fireIconWidth } from './parts/Firehouse';
import { Pill, StrikeLine, TermPill } from './parts/Labels';
import { Stage, wordFrame } from './kit';

const S = 's04-tiempo';

/** Right-hand text column (the crane is at CRANE_PLACE, boom pointing at it). */
const COL_X = CRANE_PLACE.left + CRANE_PLACE.width + 70;
const COL_W = 1728 - COL_X;
const GAP = 14;
const COMPACT = 96;
const EXP1 = 384;
const EXP2 = 238;
const EXP3 = 230;
const PAD = 28;
const TERM = 46;
const HEAD_COMPACT_TOP = 11;
const FIRE_TAG_TOP = 440;
const FIRE_ROW_TOP = 508;
const FIRE_SIZE = 96;
/** Connectors leave the part's dot, run right to this x and climb into the card. */
const ELBOW_X = [668, 690, 668];

/** A bump 0 → 1 → `rest`: lit at `at`, back to `rest` after `hold` frames. */
function bump(frame: number, at: number, hold = 40, rest = 0): number {
  return rest + (1 - rest) * progress(frame, at, 8) * (1 - progress(frame, at + hold, 18));
}

/** A term slot: a dashed outline of the pill's own size that gives way to the pill on its word (`on` 0–1). */
function Slotted({ on, tone = C.sky, children }: { on: number; tone?: string; children: ReactNode }) {
  const o = clamp01(on);
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div style={{ opacity: o, transform: `scale(${0.9 + 0.1 * o})`, transformOrigin: '0 50%' }}>{children}</div>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 999, border: `3px dashed ${alpha(tone, 0.4)}`, opacity: 1 - o, boxSizing: 'border-box' }} />
    </div>
  );
}

/** One card of the column; `hot` 0–1 brightens it while the voice is on it. */
function Card({ top, height, tone, hot, appear, children }: { top: number; height: number; tone: string; hot: number; appear: CSSProperties; children: ReactNode }) {
  return (
    <div style={{ position: 'absolute', left: 0, top, width: COL_W, height, ...appear }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxSizing: 'border-box',
          borderRadius: 22,
          border: `3px solid ${alpha(tone, 0.28 + 0.5 * hot)}`,
          background: alpha(tone, 0.03 + 0.09 * hot),
          boxShadow: hot > 0.05 ? `0 0 ${Math.round(26 * hot)}px ${alpha(tone, 0.26 * hot)}` : undefined,
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
}

const lineStyle = (size: number, extra: CSSProperties = {}): CSSProperties => ({
  position: 'absolute',
  left: PAD,
  fontFamily: FONT.sans,
  fontSize: size,
  fontWeight: 800,
  lineHeight: 1.15,
  color: C.textStrong,
  whiteSpace: 'nowrap',
  ...extra,
});

/** An elbow from a part's dot to a card, drawn left to right with `p` 0–1 (nothing but SVG). */
function elbow(sx: number, sy: number, xm: number, ty: number, ex: number): string {
  const r = 18;
  if (Math.abs(ty - sy) < 2 * r) return `M ${sx} ${sy} H ${ex}`;
  const s = ty > sy ? 1 : -1;
  return `M ${sx} ${sy} H ${xm - r} Q ${xm} ${sy} ${xm} ${sy + s * r} V ${ty - s * r} Q ${xm} ${ty} ${xm + r} ${ty} H ${ex}`;
}

/**
 * s04-tiempo «A tiempo, y lo que cabe». The crane sits at its place on the left; the right column grows three cards, one
 * per part the voice lights, each shrinking to a one-row summary when the next begins: the anticollision (RESPONSIVENESS,
 * with the RTOS and the struck «agentes · escaneos»), the wind sensor (EMBEDDED, COMPUTE) and the wireless sensor (POWER).
 * Then the IoT chip and, at the bottom, the fire station: the free truck and the ten-minute clock. Every term is a pill
 * that replaces its dashed slot on the word the voice says.
 */
export function S04Tiempo(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  const antiAt = props.cue('anticollision');
  const respAt = props.cue('responsiveness');
  const respWord = w('s04-02', 'responsiveness') - 6;
  const rtosAt = props.cue('rtos');
  const rtosWord = w('s04-03', 'RTOS') - 6;
  const nadaAt = w('s04-03', 'nada') - 4;
  const quiteAt = w('s04-03', 'quite') - 2;
  const windAt = props.cue('wind');
  const embWord = w('s04-04', 'embedded') - 6;
  const compAt = props.cue('compute');
  const compWord = w('s04-05', 'compute') - 6;
  const battAt = props.cue('battery');
  const powAt = props.cue('power');
  const powWord = w('s04-05', 'power') - 6;
  const iotAt = props.cue('iot');
  const iotWord = w('s04-06', 'IoT') - 6;
  const fhAt = props.cue('firehouse-2');
  const camionAt = w('s04-06', 'camión') - 6;
  const diezAt = w('s04-06', 'diez') - 6;

  // Collapse of each card to its summary row, as the next idea begins.
  const c1 = progress(frame, windAt - 14, 22, EASE.inOut);
  const c2 = progress(frame, battAt - 14, 22, EASE.inOut);
  const c3 = progress(frame, iotAt - 14, 22, EASE.inOut);
  const h1 = mix(EXP1, COMPACT, c1);
  const h2 = mix(EXP2, COMPACT, c2);
  const h3 = mix(EXP3, COMPACT, c3);
  const t1 = 0;
  const t2 = h1 + GAP;
  const t3 = t2 + h2 + GAP;
  const t4 = t3 + h3 + GAP;

  // Crane parts: lit when the voice reaches them, a softer glow once their card is done.
  const lit = {
    anticollision: progress(frame, antiAt, 14) * (1 - 0.5 * c1),
    wind: progress(frame, windAt, 14) * (1 - 0.5 * c2),
    wireless: progress(frame, battAt, 14) * (1 - 0.5 * c3),
  };

  // Connectors: from the dot to the card, visible while that card is the one in focus.
  const links: { part: CranePart; top: number; at: number; fade: number; xm: number }[] = [
    { part: 'anticollision', top: t1, at: antiAt + 4, fade: c1, xm: ELBOW_X[0] },
    { part: 'wind', top: t2, at: windAt + 4, fade: c2, xm: ELBOW_X[1] },
    { part: 'wireless', top: t3, at: battAt + 4, fade: c3, xm: ELBOW_X[2] },
  ];

  const respOn = progress(frame, respWord, 10);
  const rtosOn = progress(frame, rtosWord, 10);
  const embOn = progress(frame, embWord, 10);
  const compOn = progress(frame, compWord, 10);
  const powOn = progress(frame, powWord, 10);
  const iotOn = progress(frame, iotWord, 10);

  const detail = (c: number) => clamp01(1 - c * 2.2);
  const headTop = (exp: number, c: number) => mix(exp, HEAD_COMPACT_TOP, c);
  const hot1 = Math.max(0.3, bump(frame, antiAt, 300, 0.35)) * (frame >= antiAt - 4 ? 1 : 0.25);
  const hot2 = frame >= windAt - 4 ? bump(frame, windAt, 360, 0.35) : 0;
  const hot3 = frame >= battAt - 4 ? bump(frame, battAt, 250, 0.35) : 0;

  return (
    <Stage>
      {/* connectors, under the crane */}
      <svg width={1728} height={660} viewBox="0 0 1728 660" style={{ position: 'absolute', left: 0, top: 0 }}>
        {links.map((l) => {
          const a = craneAnchorAt(l.part);
          const p = progress(frame, l.at, 18);
          const o = 0.85 * (1 - l.fade) + 0.0 * l.fade;
          if (p <= 0.001 || o <= 0.01) return null;
          const ty = l.top + 46;
          return (
            <g key={l.part} opacity={o}>
              <path d={elbow(a.x, a.y, l.xm, ty, COL_X)} pathLength={1} fill="none" stroke={C.cyan} strokeWidth={4} strokeLinecap="round" strokeDasharray="1" strokeDashoffset={1 - p} />
              <circle cx={COL_X} cy={ty} r={7} fill={C.cyan} opacity={p > 0.98 ? 1 : 0} />
            </g>
          );
        })}
      </svg>

      <div style={{ position: 'absolute', left: CRANE_PLACE.left, top: CRANE_PLACE.top }}>
        <Crane width={CRANE_PLACE.width} lit={lit} dots />
      </div>

      <div style={{ position: 'absolute', left: COL_X, top: 0, width: COL_W, height: 660 }}>
        {/* 1 · the anticollision: RESPONSIVENESS, the RTOS, no agents or scans */}
        <Card top={t1} height={h1} tone={C.amber} hot={hot1} appear={{}}>
          <div style={lineStyle(42, { top: 18, ...enter(frame, antiAt, { distance: 14 }), opacity: enter(frame, antiAt, { distance: 14 }).opacity * detail(c1) })}>
            reacciona en <span style={{ color: C.amber }}>milisegundos</span>, siempre
          </div>
          <div style={{ position: 'absolute', left: PAD, top: headTop(86, c1), display: 'flex', alignItems: 'center', gap: 22 }}>
            <Slotted on={respOn} tone={C.violet}>
              <TermPill text="RESPONSIVENESS" size={TERM} on={0.4 + 0.6 * bump(frame, respWord, 70, 0.4)} />
            </Slotted>
            <div style={{ opacity: c1 }}>
              <TermPill text="RTOS" size={TERM} on={0.4} />
            </div>
          </div>
          <div style={lineStyle(34, { top: 176, fontWeight: 650, color: C.text, opacity: progress(frame, respAt + 6, 14) * detail(c1) })}>
            <span style={{ color: C.amber, fontWeight: 800 }}>llegar a tiempo</span> · no es lo mismo que estar en marcha
          </div>
          <div style={{ position: 'absolute', left: PAD, top: 232, display: 'flex', alignItems: 'center', gap: 18, opacity: progress(frame, rtosAt, 12) * detail(c1) }}>
            <div style={{ fontFamily: FONT.sans, fontSize: 34, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>por eso lleva un</div>
            <Slotted on={rtosOn} tone={C.violet}>
              <TermPill text="RTOS" size={38} on={0.4 + 0.6 * bump(frame, rtosWord, 60, 0.4)} />
            </Slotted>
            <div style={{ fontFamily: FONT.sans, fontSize: 34, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>: nada que le quite tiempo</div>
          </div>
          <div style={{ position: 'absolute', left: PAD, top: 310, display: 'flex', gap: 22, opacity: progress(frame, nadaAt, 10) * detail(c1) }}>
            {['agentes', 'escaneos'].map((t, i) => {
              const strike = progress(frame, quiteAt + i * 10, 12);
              return (
                <div key={t} style={{ position: 'relative' }}>
                  <Pill text={t} tone={C.rose} on={0.3} size={34} height={52} weight={700} color={alpha(C.textStrong, 1 - 0.4 * strike)} />
                  <StrikeLine strike={strike} />
                </div>
              );
            })}
          </div>
        </Card>

        {/* 2 · the wind sensor: EMBEDDED, COMPUTE */}
        {frame >= windAt - 6 ? (
          <Card top={t2} height={h2} tone={C.cyan} hot={hot2} appear={enter(frame, windAt - 2, { distance: 16 })}>
            <div style={lineStyle(40, { top: 18, opacity: detail(c2), fontWeight: 750 })}>
              <span style={{ color: C.cyanSoft }}>firmware</span> del fabricante · una sola función
            </div>
            <div style={{ position: 'absolute', left: PAD, top: headTop(84, c2), display: 'flex', alignItems: 'center', gap: 22 }}>
              <Slotted on={embOn} tone={C.violet}>
                <TermPill text="EMBEDDED" size={TERM} on={0.4 + 0.6 * bump(frame, embWord, 70, 0.4)} />
              </Slotted>
              <Slotted on={compOn} tone={C.violet}>
                <TermPill text="COMPUTE" size={TERM} on={0.4 + 0.6 * bump(frame, compWord, 70, 0.4)} />
              </Slotted>
            </div>
            <div style={lineStyle(34, { top: 176, fontWeight: 650, color: C.text, opacity: progress(frame, compAt, 14) * detail(c2) })}>
              procesador justo para medir · <span style={{ color: C.rose, fontWeight: 800 }}>no le cabe un agente</span>
            </div>
          </Card>
        ) : null}

        {/* 3 · the wireless sensor: POWER */}
        {frame >= battAt - 6 ? (
          <Card top={t3} height={h3} tone={C.cyan} hot={hot3} appear={enter(frame, battAt - 2, { distance: 16 })}>
            <div style={lineStyle(40, { top: 18, display: 'flex', alignItems: 'center', gap: 16, opacity: detail(c3), fontWeight: 750 })}>
              <svg width={50} height={28} viewBox="0 0 50 28">
                <rect x={2} y={2} width={40} height={24} rx={5} fill="none" stroke={C.cyan} strokeWidth={4} />
                <rect x={42} y={9} width={6} height={10} rx={2} fill={C.cyan} />
                <rect x={7} y={7} width={14} height={14} rx={2} fill={alpha(C.cyan, 0.7)} />
              </svg>
              <span>
                va con <span style={{ color: C.cyanSoft }}>batería</span>
              </span>
            </div>
            <div style={{ position: 'absolute', left: PAD, top: headTop(84, c3), display: 'flex', alignItems: 'center', gap: 22 }}>
              <Slotted on={powOn} tone={C.violet}>
                <TermPill text="POWER" size={TERM} on={0.4 + 0.6 * bump(frame, powWord, 70, 0.4)} />
              </Slotted>
            </div>
            <div style={lineStyle(36, { top: 170, fontWeight: 650, color: C.text, opacity: progress(frame, powAt, 14) * detail(c3) })}>
              cada cálculo de más, <span style={{ color: C.amber, fontWeight: 800 }}>menos batería</span>
            </div>
          </Card>
        ) : null}

        {/* IoT: many connected devices */}
        {frame >= iotAt - 6 ? (
          <div style={{ position: 'absolute', left: 0, top: t4, display: 'flex', alignItems: 'center', gap: 18, ...enter(frame, iotAt, { distance: 14 }) }}>
            <Pill text="cámaras y sensores conectados, a cientos" tone={C.sky} on={0.5} size={34} height={64} weight={700} />
            <Slotted on={0.35 + 0.65 * iotOn} tone={C.violet}>
              <TermPill text="IoT" size={42} on={0.3 + 0.7 * iotOn} />
            </Slotted>
          </div>
        ) : null}

        {/* the fire station: a free truck is not enough, it has to arrive in ten minutes */}
        {frame >= fhAt - 6 ? (
          <div style={{ position: 'absolute', left: 0, top: 0 }}>
            <div style={{ position: 'absolute', left: 0, top: FIRE_TAG_TOP, ...enter(frame, fhAt, { distance: 12 }) }}>
              <ImageTag />
            </div>
            <div style={{ position: 'absolute', left: 0, top: FIRE_ROW_TOP, display: 'flex', alignItems: 'center', gap: 16, whiteSpace: 'nowrap', ...enter(frame, fhAt + 2, { distance: 16 }) }}>
              <FireTruck size={FIRE_SIZE} glow={0.3 + 0.4 * bump(frame, fhAt, 70, 0.3)} />
              <div style={{ fontFamily: FONT.sans, fontSize: 38, fontWeight: 800, color: C.textStrong, opacity: 0.55 + 0.45 * progress(frame, camionAt, 10) }}>libre no basta</div>
            </div>
            {frame >= diezAt - 6 ? (
              <div style={{ position: 'absolute', left: fireIconWidth('truck', FIRE_SIZE) + 340, top: FIRE_ROW_TOP, display: 'flex', alignItems: 'center', gap: 16, whiteSpace: 'nowrap', ...enter(frame, diezAt, { distance: 16 }) }}>
                <TenMinuteClock size={FIRE_SIZE} glow={0.4 + 0.5 * bump(frame, diezAt, 80, 0.4)} />
                <div style={{ fontFamily: FONT.sans, fontSize: 38, fontWeight: 800, color: C.textStrong }}>
                  en <span style={{ color: C.amber }}>diez minutos</span>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </Stage>
  );
}
