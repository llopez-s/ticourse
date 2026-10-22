import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, mix } from '../../../engine/src/ui';
import { AUTOMATION, AUTO_SLOT, CASE_FIELDS, CASE_TITLE, FLOW, ORCHESTRATION, PLAYBOOK, SAME, SLOTS, SOAR } from '../data/s02-cadena';
import { AVENUE, Avenue, ambulanceX, avenueLight } from './parts/Avenue';
import { Arrow, Diamond, FlowNode } from './parts/Flow';
import { ImageTag, Pill, TermPill } from './parts/Labels';
import { TimerRing, TrafficLight } from './parts/TrafficLight';
import { ToolGlyph } from './parts/Tools';
import { Stage, segment, wordFrame } from './kit';

const S = 's02-cadena';

// ---- Phase A: five slots in a row and the cases the one lit step opens.
const SLOT_W = 210;
const SLOT_H = 150;
const SLOT_GAP = 12;
const SLOT_TOP = 20;
const CASE_W = 330;
const CASE_H = 196;
const CASE_TOP = 214;
const CASE_X = [30, 385, 740];
const SAME_TOP = 448;

// ---- Phase B: the flow (stage-local, left region x 0–1100).
const N1 = { x: 0, y: 10, w: 300, h: 124 };
const N2 = { x: 380, y: 10, w: 720, h: 124 };
const N3 = { x: 600, y: 204, w: 500, h: 124 };
const D = { x: 150, y: 190, w: 330, h: 152 };
const N5 = { x: 0, y: 404, w: 700, h: 128 };
/** Between «abre el caso» and «avisa a la guardia», clear of the right column. */
const HUMAN = { x: 560, y: 344 };
const PILLS_TOP = 578;

// ---- Right column: the traffic light, then the avenue.
const COL_X = 1160;
const COL_W = 568;
const LIGHT_W = 104;
const LIGHT_X = COL_X + 150;
const LIGHT_Y = 20;
const TIMER = { x: COL_X + 300, y: 70, size: 120 };
const AV_Y = 18;
const AV_H = (COL_W * AVENUE.h) / AVENUE.w;
const TERM_TOP = 404;
const TAG_TOP = 494;

/** The route a packet follows through the flow (stage-local points). */
const ROUTE: [number, number][] = [
  [N1.x + N1.w / 2, N1.y + N1.h / 2],
  [N2.x + 120, N2.y + N2.h / 2],
  [N3.x + 250, N2.y + N2.h / 2],
  [N3.x + 250, N3.y + N3.h / 2],
  [D.x + D.w / 2, D.y + D.h / 2],
  [D.x + D.w / 2, N5.y + N5.h / 2],
];

function along(points: [number, number][], t: number): [number, number] {
  const lens = points.slice(1).map((p, i) => Math.hypot(p[0] - points[i][0], p[1] - points[i][1]));
  const total = lens.reduce((a, b) => a + b, 0);
  let d = Math.max(0, Math.min(1, t)) * total;
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i]) {
      const k = lens[i] === 0 ? 0 : d / lens[i];
      return [mix(points[i][0], points[i + 1][0], k), mix(points[i][1], points[i + 1][1], k)];
    }
    d -= lens[i];
  }
  return points[points.length - 1];
}

/**
 * s02-cadena «Del semáforo a la avenida». Phase A: the five windows of s01 wait as five steps in a row; on `one-task`
 * only the SOC queue's step lights and opens the case by itself, three times, each card with the same fields filled the
 * same way; on `timer` a traffic light with its countdown ring comes in on the right («imagen · no es del puerto»),
 * named «Automation» on its word; on `same`, «sale siempre igual» and the three cards outlined in emerald. Phase B, on
 * `chain`: the steps join into the flow — «el EDR avisa», «¿desde dónde entró esa cuenta?» (proveedor de identidad),
 * «abre el caso con todo dentro», the diamond «¿riesgo alto?» on `condition`, and «avisa a la guardia · propone cortar
 * sus sesiones» with the chip «propone · decide la analista». On `avenue` the traffic light gives way to the avenue
 * from above with its central and the green wave; the ambulance gets its way; a packet runs the whole flow while the
 * voice defines orchestration, named on its word. Then «en el SOC: SOAR» on `soar` and «playbook» on `playbook`.
 */
export function S02Cadena(props: SceneProps) {
  const frame = useCurrentFrame();
  const oneAt = props.cue('one-task');
  const timerAt = props.cue('timer');
  const sameAt = props.cue('same');
  const chainAt = props.cue('chain');
  const condAt = props.cue('condition');
  const avenueAt = props.cue('avenue');
  const soarAt = props.cue('soar');
  const playAt = props.cue('playbook');
  const autoWord = wordFrame(S, 's02-01', 'automation') - 6;
  const n1At = Math.min(chainAt + 2, wordFrame(S, 's02-03', 'EDR') - 6);
  const n2At = wordFrame(S, 's02-03', 'proveedor') - 6;
  const n3At = segment(props, 's02-03').to - 12;
  const n5At = wordFrame(S, 's02-04', 'avisa') - 6;
  const ambAt = wordFrame(S, 's02-05', 'ambulancia') - 8;
  const orchWord = wordFrame(S, 's02-06', 'orchestration') - 6;
  const seg06 = segment(props, 's02-06');

  // ---- Phase A
  const phaseAOut = progress(frame, chainAt - 8, 16, EASE.inOut);
  const slotsIn = progress(frame, -4, 16);
  const autoOn = progress(frame, oneAt, 14);
  const caseAt = [oneAt + 16, oneAt + 46, oneAt + 76];
  const sameIn = progress(frame, sameAt - 2, 14);

  // ---- Right column
  const lightIn = progress(frame, timerAt - 4, 16) * (1 - progress(frame, avenueAt - 6, 14, EASE.inOut));
  const CYCLE = 60;
  const phase = ((Math.max(0, frame - timerAt) % CYCLE) + CYCLE) % CYCLE;
  const isGreen = Math.floor(Math.max(0, frame - timerAt) / CYCLE) % 2 === 0;
  const autoIn = progress(frame, autoWord, 12) * (1 - progress(frame, avenueAt - 6, 14, EASE.inOut));
  const avIn = progress(frame, avenueAt - 4, 18);
  const ambT = frame >= ambAt ? progress(frame, ambAt, 120, EASE.linear) : null;
  const orchIn = progress(frame, orchWord, 12);
  const tagIn = Math.max(progress(frame, timerAt + 4, 14) * (1 - progress(frame, avenueAt - 6, 10)), progress(frame, avenueAt + 6, 14));

  const greenOf = (i: number) => {
    if (frame < avenueAt + 10) return 0;
    if (ambT !== null) {
      const ambX = ambulanceX(ambT) + 40;
      if (avenueLight(i, 5).x > ambX - 10) return 1;
    }
    const k = (frame - avenueAt - 10) / 14 - i;
    return k >= 0 && ((Math.floor(k) % 6) + 6) % 6 < 3 ? 1 : 0;
  };

  // ---- Phase B
  const n1In = progress(frame, n1At, 14);
  const n2In = progress(frame, n2At, 14);
  const n3In = progress(frame, n3At, 14);
  const dIn = progress(frame, condAt - 2, 14);
  const n5In = progress(frame, n5At, 14);
  const humanIn = progress(frame, n5At + 22, 14);
  const packetT = progress(frame, seg06.from + 6, Math.max(30, seg06.to - seg06.from - 20), EASE.inOut);
  const packetOn = frame >= seg06.from && frame < seg06.to + 20 ? 1 - progress(frame, seg06.to, 18) : 0;
  const lightUp = (at: number) => 0.4 + 0.6 * progress(frame, at, 12) * (1 - 0.45 * progress(frame, at + 60, 20));
  const soarIn = progress(frame, soarAt - 4, 14);
  const playIn = progress(frame, playAt - 4, 14);
  const pkt = along(ROUTE, packetT);

  return (
    <Stage>
      <div style={{ position: 'absolute', inset: 0, fontFamily: FONT.sans }}>
        {/* ---------- Phase A ---------- */}
        {phaseAOut < 0.99 ? (
          <div style={{ position: 'absolute', inset: 0, opacity: 1 - phaseAOut }}>
            {SLOTS.map((s, i) => {
              const isAuto = i === AUTO_SLOT;
              const on = isAuto ? 0.35 + 0.65 * autoOn : 0.35 - 0.15 * autoOn;
              const tone = isAuto ? C.cyan : C.sky;
              return (
                <div
                  key={s.label}
                  style={{
                    position: 'absolute',
                    left: i * (SLOT_W + SLOT_GAP),
                    top: SLOT_TOP,
                    width: SLOT_W,
                    height: SLOT_H,
                    boxSizing: 'border-box',
                    borderRadius: RADIUS.lg,
                    border: `${isAuto ? 3 : 2}px ${isAuto && autoOn > 0.5 ? 'solid' : 'dashed'} ${alpha(tone, 0.3 + 0.6 * on)}`,
                    background: alpha(tone, 0.04 + 0.1 * (isAuto ? autoOn : 0)),
                    boxShadow: isAuto && autoOn > 0.02 ? `0 0 ${Math.round(28 * autoOn)}px ${alpha(C.cyan, 0.3 * autoOn)}` : undefined,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    opacity: slotsIn * (isAuto ? 1 : 1 - 0.45 * autoOn),
                    textAlign: 'center',
                  }}
                >
                  <ToolGlyph icon={s.icon} size={40} color={alpha(tone, 0.5 + 0.5 * on)} />
                  <div style={{ fontSize: 30, fontWeight: 750, lineHeight: 1.1, color: C.textStrong, padding: '0 10px' }}>{s.label}</div>
                </div>
              );
            })}

            {/* the case it opens, three times, identical */}
            {CASE_X.map((x, k) => {
              if (frame < caseAt[k] - 2) return null;
              const e = enter(frame, caseAt[k], { distance: -20, duration: 14 });
              const ok = sameIn;
              return (
                <div
                  key={k}
                  style={{
                    position: 'absolute',
                    left: x,
                    top: CASE_TOP,
                    width: CASE_W,
                    height: CASE_H,
                    boxSizing: 'border-box',
                    borderRadius: RADIUS.md,
                    border: `3px solid ${ok > 0.5 ? alpha(C.emerald, 0.85) : alpha(C.cyan, 0.7)}`,
                    background: C.ink850,
                    boxShadow: ok > 0.02 ? `0 0 ${Math.round(24 * ok)}px ${alpha(C.emerald, 0.25 * ok)}` : undefined,
                    padding: '14px 20px',
                    ...e,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 32, fontWeight: 800, color: C.textStrong }}>
                    <Icon name="archive" size={32} color={C.cyan} />
                    {CASE_TITLE}
                    {ok > 0.01 ? (
                      <span style={{ marginLeft: 'auto', opacity: ok }}>
                        <Icon name="check" size={34} color={C.emerald} strokeWidth={3} />
                      </span>
                    ) : null}
                  </div>
                  {CASE_FIELDS.map((f, j) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 10 }}>
                      <div style={{ width: 110, fontSize: 28, fontWeight: 650, color: C.muted }}>{f}</div>
                      <div style={{ height: 14, width: [150, 110, 80][j], borderRadius: 7, background: alpha(C.cyan, 0.75) }} />
                    </div>
                  ))}
                </div>
              );
            })}
            {sameIn > 0.01 ? (
              <div style={{ position: 'absolute', left: 0, top: SAME_TOP, width: 1100, display: 'flex', justifyContent: 'center', opacity: sameIn, transform: `translateY(${(1 - sameIn) * 12}px)` }}>
                <Pill text={SAME} icon="check" tone={C.emerald} size={44} height={70} weight={850} on={sameIn} />
              </div>
            ) : null}
          </div>
        ) : null}

        {/* ---------- Phase B: the flow ---------- */}
        {frame >= chainAt - 4 ? (
          <>
            <svg width={1100} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              <Arrow points={[[N1.x + N1.w, N1.y + N1.h / 2], [N2.x - 4, N2.y + N2.h / 2]]} draw={progress(frame, n2At - 6, 12)} />
              <Arrow points={[[N3.x + 250, N2.y + N2.h], [N3.x + 250, N3.y - 4]]} draw={progress(frame, n3At - 6, 12)} />
              <Arrow points={[[N3.x, N3.y + N3.h / 2], [D.x + D.w + 2, D.y + D.h / 2]]} draw={progress(frame, condAt - 8, 12)} />
              <Arrow points={[[D.x + D.w / 2, D.y + D.h], [D.x + D.w / 2, N5.y - 4]]} draw={progress(frame, n5At - 6, 12)} />
              {packetOn > 0.01 ? (
                <g opacity={packetOn}>
                  <circle cx={pkt[0]} cy={pkt[1]} r={22} fill={alpha(C.cyan, 0.25)} />
                  <circle cx={pkt[0]} cy={pkt[1]} r={11} fill={C.cyan} />
                </g>
              ) : null}
            </svg>
            {progress(frame, n5At - 6, 12) > 0.5 ? (
              <div style={{ position: 'absolute', left: D.x + D.w / 2 + 16, top: D.y + D.h + 4, fontSize: 32, fontWeight: 800, color: C.emerald, opacity: progress(frame, n5At, 10) }}>{FLOW.yes}</div>
            ) : null}
            <div style={{ position: 'absolute', left: N1.x, top: N1.y, opacity: n1In, transform: `translateY(${(1 - n1In) * 14}px)` }}>
              <FlowNode w={N1.w} h={N1.h} title={FLOW.edr} icon="shield" tone={C.sky} on={lightUp(n1At)} />
            </div>
            <div style={{ position: 'absolute', left: N2.x, top: N2.y, opacity: n2In, transform: `translateY(${(1 - n2In) * 14}px)` }}>
              <FlowNode w={N2.w} h={N2.h} title={FLOW.ask} sub={FLOW.askSub} icon="user" tone={C.sky} on={lightUp(n2At)} />
            </div>
            <div style={{ position: 'absolute', left: N3.x, top: N3.y, opacity: n3In, transform: `translateY(${(1 - n3In) * 14}px)` }}>
              <FlowNode w={N3.w} h={N3.h} title={FLOW.open} icon="archive" tone={C.cyan} on={lightUp(n3At)} />
            </div>
            <div style={{ position: 'absolute', left: D.x, top: D.y, opacity: dIn, transform: `scale(${0.9 + 0.1 * dIn})` }}>
              <Diamond w={D.w} h={D.h} text={FLOW.risk} on={lightUp(condAt)} />
            </div>
            <div style={{ position: 'absolute', left: N5.x, top: N5.y, opacity: n5In, transform: `translateY(${(1 - n5In) * 14}px)` }}>
              <FlowNode w={N5.w} h={N5.h} title={FLOW.warn} sub={FLOW.warnSub} icon="bell" tone={C.cyan} on={lightUp(n5At)} />
            </div>
            {humanIn > 0.01 ? (
              <div style={{ position: 'absolute', left: HUMAN.x, top: HUMAN.y, opacity: humanIn, transform: `translateX(${(1 - humanIn) * -12}px)` }}>
                <Pill text={FLOW.human} icon="user" tone={C.emerald} size={32} height={56} on={0.6} />
              </div>
            ) : null}
            {soarIn > 0.01 ? (
              <div style={{ position: 'absolute', left: 0, top: PILLS_TOP, opacity: soarIn, transform: `translateY(${(1 - soarIn) * 12}px)` }}>
                <Pill text={SOAR} icon="layers" tone={C.violet} size={38} height={64} weight={850} on={soarIn * (1 - 0.4 * playIn)} />
              </div>
            ) : null}
            {playIn > 0.01 ? (
              <div style={{ position: 'absolute', left: 420, top: PILLS_TOP, opacity: playIn, transform: `translateY(${(1 - playIn) * 12}px)` }}>
                <Pill text={PLAYBOOK} icon="file" tone={C.violet} size={38} height={64} weight={850} on={playIn} />
              </div>
            ) : null}
          </>
        ) : null}

        {/* ---------- Right column ---------- */}
        {lightIn > 0.01 ? (
          <div style={{ position: 'absolute', left: 0, top: 0, opacity: lightIn }}>
            <div style={{ position: 'absolute', left: LIGHT_X, top: LIGHT_Y }}>
              <TrafficLight width={LIGHT_W} red={isGreen ? 0 : 1} green={isGreen ? 1 : 0} />
            </div>
            <div style={{ position: 'absolute', left: TIMER.x, top: TIMER.y }}>
              <TimerRing size={TIMER.size} remaining={1 - phase / CYCLE} tone={isGreen ? C.emerald : C.rose} />
            </div>
          </div>
        ) : null}
        {autoIn > 0.01 ? (
          <div style={{ position: 'absolute', left: COL_X + 40, top: TERM_TOP, opacity: autoIn, transform: `translateY(${(1 - autoIn) * 12}px)` }}>
            <TermPill text={AUTOMATION} on={autoIn} />
          </div>
        ) : null}
        {avIn > 0.01 ? (
          <div style={{ position: 'absolute', left: COL_X, top: AV_Y, opacity: avIn, transform: `scale(${0.96 + 0.04 * avIn})`, transformOrigin: '50% 0' }}>
            <Avenue width={COL_W} green={greenOf} frame={frame} ambulance={ambT} />
          </div>
        ) : null}
        {orchIn > 0.01 ? (
          <div style={{ position: 'absolute', left: COL_X + 20, top: TERM_TOP, opacity: orchIn, transform: `translateY(${(1 - orchIn) * 12}px)` }}>
            <TermPill text={ORCHESTRATION} on={orchIn} />
          </div>
        ) : null}
        {tagIn > 0.01 ? (
          <div style={{ position: 'absolute', left: COL_X + 40, top: avIn > 0.5 ? AV_Y + AV_H + 170 : TAG_TOP, opacity: tagIn }}>
            <ImageTag />
          </div>
        ) : null}
      </div>
    </Stage>
  );
}
