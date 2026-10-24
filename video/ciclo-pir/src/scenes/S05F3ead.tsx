import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, mix } from '../../../engine/src/ui';
import { S05_BORN, S05_GEARS, S05_INCIDENT, S05_INTEL, S05_LOOP, S05_OPS, S05_STEPS } from '../data/s05-f3ead';
import { EvidenceBox, Gear, GlyphRing, IncidentRing } from './parts/F3eadBits';
import { Stage, wordFrame } from './kit';

const S = 's05-f3ead';
const W = STAGE.width;
const COL = W / 6;
const cx = (i: number) => COL * (i + 0.5);

const TILE = { w: 248, h: 150, y: 130 } as const;
const OPS_X: [number, number] = [20, COL * 3 - 20];
const INTEL_X: [number, number] = [COL * 3 + 20, W - 20];

// The incident vignette: big and central while EMBER FOX's message is up, then small under Finish / Exploit.
const A = { ringX: 560, boxX: 1170, y: 300, size: 200, label: 44 } as const;
const B = { ringX: cx(2), boxX: cx(3), y: 513, size: 96, label: 30 } as const;

// The gears.
const BIG = { x: 480, y: 345, teeth: 22, out: 235, root: 205, disc: 195 } as const;
const SMALL = { x: 800, y: 345, teeth: 10, out: 115, root: 85, disc: 78 } as const;

/**
 * s05-f3ead «Cuando hay un incidente». While EMBER FOX's message is up (`reply-iii`) the stage is a generic
 * incident response: an amber alert that turns «contenido» (emerald shield) as the voice says «contiene», and, beside
 * it, a box of «evidencia capturada» filling with files — everything under y 200. On `letters` both shrink to the
 * bottom (the contained incident under Finish, the evidence under Exploit) and the F3EAD strip lands, six tiles —
 * Find · Fix · Finish · Exploit · Analyze · Disseminate — with «nació en operaciones militares». `ops` brackets the
 * first three under «operación» («localizar · fijar · neutralizar», «hasta contener el incidente»); `halves`, the
 * last three under «inteligencia» («explotar la evidencia capturada · analizarla · difundirla»). `loop` closes the
 * ring: Finish to Exploit, and an arc from Disseminate back to Find, «la evidencia alimenta el siguiente ciclo». On
 * `gear` the strip gives way to two meshed gears — the big one «ciclo de inteligencia · ritmo del equipo» with the
 * six stations inside, the small one «F3EAD · incidente activo» turning 2.2 times faster — and `wrap-iii` closes:
 * «uno marca el ritmo, el otro acelera». No Meridian incident, no E7, no date.
 */
export function S05F3ead(props: SceneProps) {
  const frame = useCurrentFrame();
  const replyAt = props.cue('reply-iii');
  const lettersAt = props.cue('letters');
  const opsAt = props.cue('ops');
  const halvesAt = props.cue('halves');
  const loopAt = props.cue('loop');
  const gearAt = props.cue('gear');
  const wrapAt = props.cue('wrap-iii');
  const at = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const p = (start: number, dur = 14) => progress(frame, start, dur);

  // ---- The incident vignette.
  const contained = p(at('s05-01', 'contiene') - 4, 16);
  const containedSet = p(at('s05-01', 'contiene') - 2, 10) * (1 - progress(frame, at('s05-01', 'contiene') + 30, 20, EASE.inOut));
  const filesAt = at('s05-01', 'evidencia') - 8;
  const files = progress(frame, filesAt, 50, EASE.linear);
  const shift = progress(frame, lettersAt - 6, 30, EASE.inOut);
  const vIn = p(4, 18);
  // The alert flares as the voice starts to answer the message (`reply-iii`).
  const hot = progress(frame, replyAt, 10) * (1 - progress(frame, replyAt + 36, 24, EASE.inOut));
  const size = mix(A.size, B.size, shift);
  const labelSize = mix(A.label, B.label, shift);
  const ringCx = mix(A.ringX, B.ringX, shift);
  const boxCx = mix(A.boxX, B.boxX, shift);
  const vy = mix(A.y, B.y, shift);
  const ringGlow = Math.max(containedSet, p(at('s05-03', 'contener') - 4, 12) * (1 - progress(frame, at('s05-03', 'contener') + 40, 20)));
  const boxGlow = p(at('s05-04', 'evidencia') - 4, 12) * (1 - progress(frame, at('s05-04', 'evidencia') + 50, 20));
  const gearOut = 1 - progress(frame, gearAt - 8, 14, EASE.inOut);
  const gearIn = p(gearAt - 4, 18);

  // ---- The strip.
  const tileAt = S05_STEPS.map((_, i) => lettersAt + 4 + i * 6);
  const bornIn = enter(frame, at('s05-02', 'nació') - 6, { distance: 12, duration: 16 });
  const split = [p(at('s05-02', 'tres', 0) - 4, 12), p(at('s05-02', 'tres', 1) - 4, 12)];
  const opsStep = [at('s05-03', 'Localizar') - 6, at('s05-03', 'fijarlo') - 6, at('s05-03', 'neutralizarlo') - 6];
  const untilAt = at('s05-03', 'hasta') - 6;
  const intelStep = [at('s05-04', 'Explotar') - 6, at('s05-04', 'analizarla') - 6, at('s05-04', 'difundirla') - 6];
  const opsFocus = windowFocus(frame, opsAt, halvesAt);
  const intelFocus = windowFocus(frame, halvesAt, loopAt);

  // ---- The loop.
  const ring = p(at('s05-05', 'explota') - 6, 14);
  const ringPulse = Math.max(p(loopAt, 8) * (1 - progress(frame, loopAt + 30, 20)), 0);
  const arc = progress(frame, at('s05-05', 'alimenta') - 6, 40, EASE.inOut);
  const arcLabel = p(at('s05-05', 'alimenta') - 2, 16);

  // ---- The gears.
  const turn = Math.max(0, frame - gearAt);
  const angleBig = 8.18 + turn * 0.3;
  const angleSmall = -2.2 * angleBig + 18;
  const smallIn = p(at('s05-06', 'pequeño') - 12, 16);
  const bigLabelIn = enter(frame, at('s05-06', 'grande') - 8, { distance: 14, duration: 16 });
  const smallLabelIn = enter(frame, at('s05-06', 'pequeño') - 6, { distance: 14, duration: 16 });
  const wrapIn = enter(frame, wrapAt + 2, { distance: 14, duration: 18 });
  const ringIn = p(gearAt + 4, 24);
  const fastLit = p(at('s05-06', 'rápido') - 6, 12);

  const tile = (i: number) => {
    const half = S05_STEPS[i].half;
    const tone = half === 'ops' ? C.sky : C.cyan;
    const e = enter(frame, tileAt[i], { distance: 20, duration: 16 });
    const grouped = half === 'ops' ? split[0] : split[1];
    const focus = half === 'ops' ? opsFocus : intelFocus;
    const other = half === 'ops' ? intelFocus : opsFocus;
    const step = half === 'ops' ? opsStep[i] : intelStep[i - 3];
    const stepLit = p(step, 10);
    const lit = Math.max(0.35 * grouped, focus * 0.55, stepLit * focus) - 0 ;
    const dim = 0.55 * other;
    return (
      <div
        key={S05_STEPS[i].en}
        style={{
          position: 'absolute',
          left: cx(i) - TILE.w / 2,
          top: TILE.y,
          width: TILE.w,
          height: TILE.h,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          borderRadius: RADIUS.lg,
          border: `${lit > 0.5 ? 3 : 2}px solid ${alpha(tone, 0.35 + 0.6 * lit)}`,
          background: `linear-gradient(180deg, ${alpha(tone, 0.06 + 0.12 * lit)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
          boxShadow: lit > 0.05 ? `0 0 ${Math.round(30 * lit)}px ${alpha(tone, 0.3 * lit)}` : undefined,
          fontFamily: FONT.sans,
          whiteSpace: 'nowrap',
          ...e,
          opacity: e.opacity * (1 - dim),
        }}
      >
        <span style={{ fontSize: 36, fontWeight: 850, letterSpacing: -0.4, color: lit > 0.3 ? C.textStrong : C.text }}>{S05_STEPS[i].en}</span>
        <span style={{ fontSize: 30, fontWeight: 700, color: lit > 0.3 ? tone : C.muted }}>{S05_STEPS[i].es}</span>
      </div>
    );
  };

  const bracket = (x: [number, number], at0: number, tone: string, label: string, top: number) => {
    const b = progress(frame, at0, 22, EASE.inOut);
    if (b <= 0.01) return null;
    const w = x[1] - x[0];
    const y = TILE.y + TILE.h + 16;
    return (
      <>
        <svg width={W} height={STAGE.height} style={{ position: 'absolute', left: 0, top: 0 }} aria-hidden>
          <path d={`M ${x[0]} ${y} V ${y + 16} H ${x[1]} V ${y}`} pathLength={1} stroke={tone} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray="1" strokeDashoffset={1 - b} />
        </svg>
        <div style={{ position: 'absolute', left: x[0], width: w, top: top, textAlign: 'center', fontFamily: FONT.sans, fontSize: 46, fontWeight: 850, color: tone, opacity: b }}>{label}</div>
      </>
    );
  };

  /** The steps of a half, one group per line (words inside a group are joined with dots), each entering on its own frame. */
  const stepText = (lines: readonly (readonly number[])[], words: readonly string[], starts: number[], size = 38) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', rowGap: 6, fontFamily: FONT.sans, fontSize: size, fontWeight: 750, color: C.text }}>
      {lines.map((group, li) => (
        <div key={li} style={{ display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap' }}>
          {group.map((wi, k) => (
            <span key={words[wi]} style={enter(frame, starts[wi], { distance: 10, duration: 14 })}>
              {k > 0 ? <span style={{ color: C.faint, margin: '0 14px' }}>·</span> : null}
              {words[wi]}
            </span>
          ))}
        </div>
      ))}
    </div>
  );

  const stripOut = gearOut;
  return (
    <Stage>
      {/* ---- The incident, then its two halves under Finish and Exploit */}
      <div style={{ position: 'absolute', inset: 0, opacity: vIn * gearOut }}>
        <IncidentRing style={{ position: 'absolute', left: ringCx - size / 2, top: vy }} size={size} contained={contained} label={[S05_INCIDENT.incident, S05_INCIDENT.contained]} labelSize={labelSize} labelSet={ringGlow} hot={hot} />
        <EvidenceBox style={{ position: 'absolute', left: boxCx - size / 2, top: vy }} size={size} files={files} glow={boxGlow} label={S05_INCIDENT.evidence} labelSize={labelSize} />
      </div>

      {/* ---- The F3EAD strip */}
      {frame >= lettersAt - 4 && stripOut > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: stripOut }}>
          {S05_STEPS.map((_, i) => tile(i))}

          {/* Born in military operations */}
          {frame >= at('s05-02', 'nació') - 8 ? (
            <div style={{ position: 'absolute', left: 0, top: 536, display: 'flex', alignItems: 'center', gap: 14, fontFamily: FONT.sans, fontSize: 34, fontWeight: 750, color: C.text, width: 470, lineHeight: 1.15, ...bornIn }}>
              <Icon name="flag" size={42} color={C.sky} strokeWidth={2.2} />
              {S05_BORN}
            </div>
          ) : null}

          {/* The two halves */}
          {bracket(OPS_X, opsAt, C.sky, S05_OPS.label, TILE.y + TILE.h + 40)}
          {bracket(INTEL_X, halvesAt, C.cyan, S05_INTEL.label, TILE.y + TILE.h + 40)}
          {frame >= opsStep[0] - 4 ? (
            <div style={{ position: 'absolute', left: OPS_X[0], top: TILE.y + TILE.h + 104, width: OPS_X[1] - OPS_X[0], opacity: 1 - 0.5 * intelFocus }}>
              {stepText([[0, 1, 2]], S05_OPS.steps, opsStep)}
              <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, fontFamily: FONT.sans, fontSize: 38, fontWeight: 800, color: C.sky, ...enter(frame, untilAt, { distance: 10, duration: 14 }) }}>
                <Icon name="arrowRight" size={40} color={C.sky} strokeWidth={2.6} />
                {S05_OPS.until}
              </div>
            </div>
          ) : null}
          {frame >= intelStep[0] - 4 ? (
            <div style={{ position: 'absolute', left: INTEL_X[0], top: TILE.y + TILE.h + 104, width: INTEL_X[1] - INTEL_X[0] }}>
              {stepText([[0], [1, 2]], S05_INTEL.steps, intelStep)}
            </div>
          ) : null}

          {/* The loop: Finish to Exploit, and Disseminate back to Find */}
          {ring > 0.01 || arc > 0.01 ? (
            <svg width={W} height={STAGE.height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
              <circle cx={COL * 3} cy={TILE.y + TILE.h / 2} r={34} fill="none" stroke={C.emerald} strokeWidth={5} opacity={ring} style={{ filter: ringPulse > 0.02 ? `drop-shadow(0 0 ${Math.round(18 * ringPulse)}px ${C.emerald})` : undefined }} />
              <path d={`M ${cx(5)} ${TILE.y - 4} C ${cx(5)} 62, ${cx(0)} 62, ${cx(0)} ${TILE.y - 14}`} pathLength={1} fill="none" stroke={C.emerald} strokeWidth={5} strokeLinecap="round" strokeDasharray="1" strokeDashoffset={1 - arc} />
              {arc > 0.98 ? <path d={`M ${cx(0) - 14} ${TILE.y - 28} L ${cx(0)} ${TILE.y - 10} L ${cx(0) + 14} ${TILE.y - 28}`} fill="none" stroke={C.emerald} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /> : null}
              {/* contained incident to evidence */}
              <path d={`M ${B.ringX + 62} ${B.y + 48} H ${B.boxX - 62}`} stroke={C.emerald} strokeWidth={4} strokeLinecap="round" strokeDasharray="1 10" opacity={ring} />
            </svg>
          ) : null}
          {arcLabel > 0.01 ? (
            <div style={{ position: 'absolute', left: 0, top: 6, width: W, textAlign: 'center', fontFamily: FONT.sans, fontSize: 40, fontWeight: 850, color: C.emerald, whiteSpace: 'nowrap', opacity: arcLabel, transform: `translateY(${(1 - arcLabel) * 10}px)` }}>{S05_LOOP}</div>
          ) : null}
        </div>
      ) : null}

      {/* ---- The two gears */}
      {gearIn > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: gearIn }}>
          <Gear cx={BIG.x} cy={BIG.y} teeth={BIG.teeth} rOut={BIG.out} rIn={BIG.root} rDisc={BIG.disc} angle={angleBig} tone={C.cyan} glow={0.4}>
            <GlyphRing radius={128} size={60} lit={ringIn} />
          </Gear>
          <Gear cx={SMALL.x} cy={SMALL.y} teeth={SMALL.teeth} rOut={SMALL.out} rIn={SMALL.root} rDisc={SMALL.disc} angle={angleSmall} tone={C.amber} glow={0.3 + 0.4 * fastLit} show={smallIn}>
            <span style={{ fontFamily: FONT.mono, fontSize: 34, fontWeight: 800, letterSpacing: 1, color: C.amber }}>{S05_GEARS.small[0]}</span>
          </Gear>
          <svg width={W} height={STAGE.height} style={{ position: 'absolute', left: 0, top: 0 }} aria-hidden>
            <path d="M 990 150 H 800 L 676 206" fill="none" stroke={alpha(C.cyan, 0.7)} strokeWidth={3} strokeDasharray="3 8" strokeLinecap="round" opacity={bigLabelIn.opacity} />
            <path d="M 972 345 H 930" fill="none" stroke={alpha(C.amber, 0.8)} strokeWidth={3} strokeDasharray="3 8" strokeLinecap="round" opacity={smallLabelIn.opacity} />
          </svg>
          <div style={{ position: 'absolute', left: 1000, top: 100, fontFamily: FONT.sans, whiteSpace: 'nowrap', ...bigLabelIn }}>
            <div style={{ fontSize: 52, fontWeight: 850, color: C.cyan, letterSpacing: -0.8 }}>{S05_GEARS.big[0]}</div>
            <div style={{ marginTop: 4, fontSize: 42, fontWeight: 750, color: C.textStrong }}>{S05_GEARS.big[1]}</div>
          </div>
          <div style={{ position: 'absolute', left: 982, top: 295, fontFamily: FONT.sans, whiteSpace: 'nowrap', ...smallLabelIn }}>
            <div style={{ fontFamily: FONT.mono, fontSize: 52, fontWeight: 800, color: C.amber, letterSpacing: 1 }}>{S05_GEARS.small[0]}</div>
            <div style={{ marginTop: 4, fontSize: 42, fontWeight: 750, color: C.textStrong }}>{S05_GEARS.small[1]}</div>
          </div>
          {frame >= wrapAt - 2 ? (
            <div style={{ position: 'absolute', left: 780, top: 520, width: W - 780, fontFamily: FONT.sans, fontSize: 52, fontWeight: 850, letterSpacing: -0.6, color: C.textStrong, whiteSpace: 'nowrap', ...wrapIn }}>
              <span style={{ color: C.cyan }}>{S05_GEARS.wrap.split(', ')[0]}</span>, <span style={{ color: C.amber }}>{S05_GEARS.wrap.split(', ')[1]}</span>
            </div>
          ) : null}
        </div>
      ) : null}
    </Stage>
  );
}

/** 0–1 weight of a frame window with soft edges. */
function windowFocus(frame: number, from: number, to: number): number {
  return progress(frame, from - 4, 12, EASE.inOut) * (1 - progress(frame, to - 4, 12, EASE.inOut));
}
