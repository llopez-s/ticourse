import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Icon, curveBetween, cubicPath, type IconName } from '../../../engine/src/ui';
import { ENVELOPES, S05 } from '../data/niveles';
import { Desk } from './parts/Desk';
import { Envelope } from './parts/Envelope';
import { EnvelopeProduct } from './parts/EnvelopeCards';
import { FoxCard } from './parts/Fox';
import { SlidingHouse } from './parts/House';
import { ScaleBar } from './parts/ScaleBar';
import { Stage, wordFrame } from './kit';

const S = 's05-tejado';
const W = STAGE.width;
const HOUSE_POS = { x: 4, y: 100 } as const;
const COL_X = 650;
const COL_W = W - COL_X;
const BAR_Y = 190;
const STEP = COL_W / 5;
const NEVER = -100000;
const ALL_BUILT = { arch: NEVER, passive: NEVER, active: NEVER, intel: NEVER, offense: NEVER } as const;

// Destination cards of the roof's arrows.
const DEST_X = COL_X + 70;
const DEST_W = COL_W - 70;
const DEST_H = 96;
const DEST_TOP = 36;
const DEST_GAP = 14;
const DEST_ICON: IconName[] = ['radar', 'bolt', 'search', 'target', 'users'];

/**
 * s05-tejado «El orden de la obra». It starts where s04 ended: the whole house on the left and the bar
 * on the right, both under EMBER FOX's intercepted message (the top stays clear) with his card low
 * right. On `reply-fox2` the card steps aside. On `multiplies` the house steps back, the bar is
 * headed by «Intelligence multiplica el valor de las demás, no las sustituye», three arcs with a «×» go
 * from Intelligence to the stops under it, and its two halves are marked: «base, mejor retorno» and
 * «solo rinde si la base existe». On `roof` the house walls sink and only the roof stays up, a report
 * lying on it, a dashed empty silhouette beside it («Llega y no hay quién lo use») and the label «sin
 * base defendible, nadie lo aplica». On `enable` the house comes back whole and five arrows go from
 * its roof to the lesson's five destinations — SOC, IR, vulnerabilidades, red team, dirección — one
 * by one. On `back` (check sfx) it all steps aside and the two envelopes of s01 are back on the desk,
 * each with what the analyst prepares for it: the SOC's, «indicadores y reglas de detección»; the
 * board's, «evaluación de tendencias del sector». Prepared, not delivered: unsealed, nobody decides
 * anything.
 */
export function S05Tejado(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const replyAt = props.cue('reply-fox2');
  const multAt = props.cue('multiplies');
  const roofAt = props.cue('roof');
  const enableAt = props.cue('enable');
  const backAt = props.cue('back');

  const w = (seg: string, word: string) => wordFrame(S, seg, word);
  const multiplicaAt = w('s05-02', 'multiplica') - 6;
  const firstAt = w('s05-02', 'primero') - 6;
  const afterAt = w('s05-02', 'después') - 6;
  const reportAt = w('s05-03', 'informe') - 6;
  const nobodyAt = w('s05-03', 'Llega') - 6;

  // ---- Fox card.
  const foxIn = frame < 30 ? 0 : springIn(frame, fps, 30, { damping: 16 });
  const foxOut = progress(frame, replyAt + 6, 18, EASE.inOut);

  // ---- Phase progress.
  const stepBack = progress(frame, multAt - 4, 20, EASE.inOut);
  const roofP = progress(frame, roofAt - 2, 30, EASE.inOut);
  const barOut = progress(frame, roofAt - 6, 16, EASE.inOut);
  const enableP = progress(frame, enableAt - 2, 28, EASE.inOut);
  const clearP = progress(frame, backAt - 8, 20, EASE.inOut);

  const bodyOut = roofP * (1 - enableP);
  const roofLift = 22 * roofP * (1 - enableP);
  const houseDim = 0.7 * stepBack * (1 - roofP);
  const houseOpacity = 1 - clearP;

  // ---- The multiplication.
  const head = enter(frame, multAt - 2, { distance: 14, duration: 16 });
  const arcs = progress(frame, multiplicaAt, 24, EASE.inOut);
  const halves = progress(frame, firstAt, 16);
  const halfRight = progress(frame, afterAt, 16);
  const intelFocus = progress(frame, multiplicaAt, 12) * (1 - progress(frame, firstAt, 12));

  // ---- The roof alone.
  const report = progress(frame, reportAt, 16);
  const nobody = progress(frame, nobodyAt, 16);
  const label = enter(frame, roofAt + 10, { distance: 18, duration: 16 });

  // ---- Destinations.
  const destAt = [w('s05-04', 'SOC') - 10, w('s05-04', 'respuesta') - 10, 0, 0, w('s05-04', 'dirección') - 10];
  destAt[2] = Math.round(destAt[1] + (destAt[4] - destAt[1]) / 3);
  destAt[3] = Math.round(destAt[1] + (2 * (destAt[4] - destAt[1])) / 3);

  // ---- The desk and the envelopes.
  const deskIn = progress(frame, backAt - 10, 20);
  const envIn = progress(frame, backAt - 4, 26, EASE.out);
  const checkIn = progress(frame, backAt + 6, 14);

  return (
    <Stage>
      <Desk opacity={deskIn} />

      {/* House */}
      {houseOpacity > 0.01 ? (
        <div style={{ position: 'absolute', left: HOUSE_POS.x, top: HOUSE_POS.y, opacity: houseOpacity }}>
          <SlidingHouse frame={frame} at={ALL_BUILT} dim={houseDim} bodyOut={bodyOut} roofLift={roofLift} glow={{ intel: intelFocus }} />
          {/* The report lying on the roof */}
          {report > 0.01 && enableP < 0.6 ? (
            <div style={{ position: 'absolute', left: 260 - 100, top: 176 - 70 - roofLift - (1 - report) * 40, opacity: report * (1 - enableP * 1.6) }}>
              <Report />
            </div>
          ) : null}
          {/* Nobody to open it */}
          {nobody > 0.01 && enableP < 0.4 ? (
            <div style={{ position: 'absolute', left: 440, top: 250, opacity: nobody * (1 - enableP * 2.5) }}>
              <Nobody />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* The bar and what multiplies */}
      {barOut < 1 && clearP < 1 ? (
        <div style={{ position: 'absolute', left: COL_X, top: 0, width: COL_W, height: STAGE.height, opacity: (1 - barOut) * (1 - clearP) }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: COL_W, opacity: head.opacity, transform: head.transform, fontFamily: FONT.sans, fontSize: 50, fontWeight: 850, letterSpacing: -1, lineHeight: 1.08, color: C.textStrong, whiteSpace: 'nowrap' }}>
            <div>{S05.multiplies[0]}</div>
            <div>{S05.multiplies[1]}</div>
          </div>
          {arcs > 0.01 ? <Arcs progress={arcs} /> : null}
          <div style={{ position: 'absolute', left: 0, top: BAR_Y }}>
            <ScaleBar
              width={COL_W}
              frame={frame}
              at={[NEVER, NEVER, NEVER, NEVER, NEVER]}
              focus={[0, 0, 0, intelFocus, 0]}
              halves={[halves, halfRight]}
            />
          </div>
        </div>
      ) : null}

      {/* sin base defendible */}
      {label.opacity > 0.01 && enableP < 0.5 ? (
        <div style={{ position: 'absolute', left: COL_X, top: 190, width: COL_W, opacity: label.opacity * (1 - enableP * 2), transform: label.transform, fontFamily: FONT.sans, textAlign: 'center', whiteSpace: 'nowrap' }}>
          <div style={{ fontSize: 66, fontWeight: 850, letterSpacing: -1.5, lineHeight: 1.12, color: C.textStrong }}>
            <div style={{ color: '#fcd34d' }}>sin base defendible,</div>
            <div>nadie lo aplica</div>
          </div>
        </div>
      ) : null}

      {/* Destinations */}
      {enableP > 0.01 && clearP < 1 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: STAGE.height, opacity: 1 - clearP }}>
          <Destinations frame={frame} at={destAt} />
        </div>
      ) : null}

      {/* Fox's card while the message is up */}
      {foxIn > 0.001 && foxOut < 1 ? (
        <div style={{ position: 'absolute', left: COL_X + (COL_W - 740) / 2, top: 430, opacity: Math.min(1, foxIn * 1.4) * (1 - foxOut), transform: `translateX(${(1 - Math.min(1, foxIn)) * 70 + foxOut * 90}px)` }}>
          <FoxCard width={740} glow={0} />
        </div>
      ) : null}

      {/* Back to the desk */}
      {envIn > 0.01 ? (
        <>
          {(['board', 'soc'] as const).map((id) => {
            const e = ENVELOPES[id];
            const side = id === 'board' ? -1 : 1;
            const x = id === 'board' ? 384 : 924;
            return (
              <div key={id} style={{ position: 'absolute', left: x, top: 150, opacity: envIn, transform: `translateX(${side * 120 * (1 - envIn)}px)` }}>
                <Envelope width={420} label={e.label} tone={e.tone} icon={id === 'board' ? 'users' : 'bell'} open={1} sealOpacity={0} card={<EnvelopeProduct id={id} />} check={checkIn} />
              </div>
            );
          })}
          <div style={{ position: 'absolute', left: 0, top: 556, width: W, textAlign: 'center', fontFamily: FONT.sans, fontSize: 36, fontWeight: 700, color: C.muted, opacity: progress(frame, backAt + 14, 16) }}>
            lo que preparas para cada lector
          </div>
        </>
      ) : null}
    </Stage>
  );
}

/** Three arcs with a «×» from Intelligence (stop 4) to the stops it multiplies. */
function Arcs({ progress: p }: { progress: number }) {
  const cx = (i: number) => STEP * (i + 0.5);
  const y0 = BAR_Y + 2;
  const targets = [2, 1, 0];
  return (
    <svg width={COL_W} height={BAR_Y + 10} viewBox={`0 0 ${COL_W} ${BAR_Y + 10}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
      {targets.map((j, k) => {
        const lift = 62 + k * 4;
        const a = { x: cx(3), y: y0 };
        const b = { x: cx(j), y: y0 };
        const d = `M${a.x} ${a.y} C${a.x} ${a.y - lift} ${b.x} ${b.y - lift} ${b.x} ${b.y}`;
        const t = Math.max(0, Math.min(1, p * 1.3 - k * 0.15));
        const mid = { x: (a.x + b.x) / 2, y: y0 - lift * 0.75 };
        return (
          <g key={j}>
            <path d={d} fill="none" stroke={alpha(C.cyan, 0.9)} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />
            {t > 0.97 ? <path d={`M${b.x - 11} ${b.y - 16} L${b.x} ${b.y} L${b.x + 11} ${b.y - 16}`} fill="none" stroke={C.cyan} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /> : null}
            <g opacity={t > 0.6 ? 1 : 0}>
              <circle cx={mid.x} cy={mid.y} r={20} fill={C.ink900} stroke={C.cyan} strokeWidth={3} />
              <text x={mid.x} y={mid.y + 10} textAnchor="middle" fontFamily={FONT.sans} fontSize={30} fontWeight={850} fill={C.cyanSoft}>
                ×
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}

/** The intelligence report that lies on the roof. */
function Report() {
  return (
    <div
      style={{
        width: 200,
        height: 140,
        boxSizing: 'border-box',
        padding: '12px 16px',
        borderRadius: 14,
        border: `3px solid ${alpha(C.cyan, 0.9)}`,
        background: `linear-gradient(180deg, ${alpha(C.cyan, 0.22)}, ${C.ink900})`,
        boxShadow: `0 14px 30px ${alpha('#000000', 0.5)}`,
        fontFamily: FONT.sans,
        transform: 'rotate(-4deg)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 28, fontWeight: 850, lineHeight: 1.1, color: C.textStrong }}>
        <Icon name="file" size={30} color={C.cyan} strokeWidth={2.2} />
        <span>informe</span>
      </div>
      <div style={{ marginTop: 6, fontSize: 28, fontWeight: 700, lineHeight: 1.1, color: C.cyanSoft }}>de inteligencia</div>
      <div style={{ marginTop: 10, height: 8, borderRadius: 4, background: alpha(C.cyan, 0.4), width: '86%' }} />
      <div style={{ marginTop: 8, height: 8, borderRadius: 4, background: alpha(C.cyan, 0.3), width: '64%' }} />
    </div>
  );
}

/** A dashed, empty silhouette: nobody there to open the report. */
function Nobody() {
  return (
    <svg width={110} height={150} viewBox="0 0 110 150" aria-hidden>
      <circle cx={55} cy={40} r={26} fill="none" stroke={alpha(C.muted, 0.8)} strokeWidth={5} strokeDasharray="9 8" />
      <path d="M10 140 C10 96 32 80 55 80 C78 80 100 96 100 140" fill="none" stroke={alpha(C.muted, 0.8)} strokeWidth={5} strokeDasharray="9 8" strokeLinecap="round" />
    </svg>
  );
}

/** The roof's five arrows and the five destinations of the lesson's list. */
function Destinations({ frame, at }: { frame: number; at: readonly number[] }) {
  const start = { x: HOUSE_POS.x + 410, y: HOUSE_POS.y + 214 };
  return (
    <>
      <svg width={W} height={STAGE.height} viewBox={`0 0 ${W} ${STAGE.height}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
        {S05.enables.map((d, i) => {
          const end = { x: DEST_X - 6, y: DEST_TOP + i * (DEST_H + DEST_GAP) + DEST_H / 2 };
          const path = cubicPath(curveBetween(start, end, 0.55));
          const p = progress(frame, at[i], 20, EASE.inOut);
          return (
            <g key={d.name}>
              <path d={path} fill="none" stroke={alpha(C.cyan, 0.25 * p)} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
              <path d={path} fill="none" stroke={alpha(C.cyan, 0.95)} strokeWidth={4.5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
              {p > 0.96 ? <path d={`M${end.x - 14} ${end.y - 11} L${end.x} ${end.y} L${end.x - 14} ${end.y + 11}`} fill="none" stroke={C.cyan} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" /> : null}
            </g>
          );
        })}
      </svg>
      {S05.enables.map((d, i) => {
        const p = progress(frame, at[i] + 10, 14);
        return (
          <div
            key={d.name}
            style={{
              position: 'absolute',
              left: DEST_X,
              top: DEST_TOP + i * (DEST_H + DEST_GAP),
              width: DEST_W,
              height: DEST_H,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              padding: '0 28px 0 20px',
              borderRadius: RADIUS.lg,
              border: `${p > 0.5 ? 3 : 2}px solid ${alpha(C.cyan, 0.25 + 0.6 * p)}`,
              background: `linear-gradient(90deg, ${alpha(C.cyan, 0.04 + 0.1 * p)} 0%, ${alpha(C.ink900, 0.95)} 55%)`,
              boxShadow: p > 0.02 ? `0 0 ${Math.round(26 * p)}px ${alpha(C.cyan, 0.2 * p)}` : undefined,
              opacity: 0.25 + 0.75 * p,
              fontFamily: FONT.sans,
            }}
          >
            <Icon name={DEST_ICON[i]} size={44} color={C.cyan} strokeWidth={2} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 40, fontWeight: 850, letterSpacing: -0.5, color: C.textStrong, lineHeight: 1.05, whiteSpace: 'nowrap' }}>{d.name}</div>
              <div style={{ marginTop: 4, fontSize: 28, fontWeight: 600, color: C.text, lineHeight: 1.1, whiteSpace: 'nowrap' }}>{d.sub}</div>
            </div>
          </div>
        );
      })}
    </>
  );
}
