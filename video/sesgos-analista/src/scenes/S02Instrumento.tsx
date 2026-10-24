import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, mix, type IconName } from '../../../engine/src/ui';
import { Finger } from './parts/Finger';
import { Head } from './parts/Head';
import { HeadSteps } from './parts/HeadSteps';
import { ReadingCard } from './parts/ReadingCard';
import { Certificate, Scale, WeightSvg, scaleGeometry } from './parts/Scale';
import { Stage, wordFrame } from './kit';

const S = 's02-instrumento';
const W = STAGE.width;

/** Phase 1: the big scale, centred. */
const BIG = { w: 720, x: 504, y: 96 } as const;
/** Phases 2–4: the head on the left, the steps and the cards on the right. */
const HEAD = { w: 420, x: 90, y: 60 } as const;
const RIGHT_X = 650;
/** Phase 5: the scale back on the left, the weight and its certificate outside it. */
const BACK = { w: 600, x: 70, y: 214 } as const;
const FLOOR = 574;

const STEPS: readonly { icon: IconName; text: string; word: string }[] = [
  { icon: 'eye', text: 'percibe', word: 'Percibe' },
  { icon: 'archive', text: 'recuerda', word: 'recuerda' },
  { icon: 'link', text: 'conecta', word: 'saca' },
];

/**
 * s02-instrumento «La báscula eres tú».
 *   scale      a kitchen scale, empty, reads «0,0»; on the cue it flips to «2,0 kg» — two kilos too many with
 *              nothing on it (amber, a halo); on «mires» an eye
 *              looks at it and a finger presses the platform twice: the reading does not move — «mirarla
 *              más no la arregla»
 *   brain      the scale melts into the head of s01 (the same silhouette): inside, three nodes and three
 *              arrows going round — percibe · recuerda · conecta, each lit on its word; under them the
 *              bracket «atajos (heurísticas)». On «maravilla» the card «útiles en la vida» (emerald)
 *   fail       «traicioneros en el análisis» (amber), and the head's arrows go crooked
 *   heuer      the reading card «Richards Heuer · Psychology of Intelligence Analysis»; «saberlo no basta»
 *              on «Saber» and, a beat after «quita», the lesson's own line «actúan antes de que te des cuenta»
 *   structure  the stage is cleared: «estructura:». On «contrastar» the scale comes back on the left; on
 *              «pesa» a metal weight with its certificate stands OUTSIDE it, on the right, linked to the
 *              display by a dashed line; «algo de fuera que no depende de tu cabeza». The exam card comes
 *              after that sentence. No people, no dates, no case data.
 */
export function S02Instrumento(props: SceneProps) {
  const frame = useCurrentFrame();
  const scaleAt = props.cue('scale');
  const brainAt = props.cue('brain');
  const failAt = props.cue('fail');
  const heuerAt = props.cue('heuer');
  const structureAt = props.cue('structure');
  const at = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const p = (start: number, dur = 14) => progress(frame, start, dur);
  const swell = (start: number, hold = 20) => progress(frame, start, 10) * (1 - progress(frame, start + hold, 26, EASE.inOut));

  // ---- Phase 1: the scale, the eye and the finger.
  const bigG = scaleGeometry(BIG.w);
  const bigE = progress(frame, -15, 22);
  const miresAt = at('s02-01', 'mires');
  const kilosAt = at('s02-01', 'kilos');
  const tap = (t0: number) => progress(frame, t0, 7, EASE.in) * (1 - progress(frame, t0 + 9, 10, EASE.out));
  const press = Math.max(tap(miresAt + 4), tap(miresAt + 38));
  const fingerIn = progress(frame, miresAt - 6, 14) * (1 - progress(frame, miresAt + 62, 14, EASE.inOut));
  const eyeIn = p(miresAt - 8, 16) * (1 - progress(frame, brainAt - 10, 14, EASE.inOut));
  const melt = progress(frame, brainAt - 10, 28, EASE.inOut);
  const caption1 = p(kilosAt - 4, 16) * (1 - p(miresAt - 6, 12));
  const caption2 = p(miresAt + 4, 16) * (1 - progress(frame, brainAt - 12, 12, EASE.inOut));

  // ---- Phase 2: the head and its three steps.
  const headIn = p(brainAt - 6, 26);
  const headK = HEAD.w / 300;
  const lit = STEPS.map((s) => p(at('s02-02', s.word) - 4, 12)) as [number, number, number];
  const flow = progress(frame, at('s02-02', 'recuerda'), 70, EASE.linear);
  const crooked = progress(frame, failAt, 24, EASE.inOut);
  const shortcuts = p(at('s02-02', 'atajos') - 6, 16);
  const useful = p(at('s02-02', 'maravilla') - 18, 16);
  const betray = p(failAt - 2, 16);
  const phase4 = progress(frame, heuerAt - 8, 16, EASE.inOut);
  const phase5 = progress(frame, structureAt - 8, 16, EASE.inOut);
  const rightOut = 1 - phase4;
  const headDim = 0.55 * phase4;

  // ---- Phase 4: the reading card.
  const cardIn = enter(frame, heuerAt - 2, { distance: 28, duration: 18 });
  const one = p(at('s02-03', 'Saber') - 4, 14);
  const two = p(at('s02-03', 'quita') + 10, 14);

  // ---- Phase 5: structure.
  const titleIn = enter(frame, structureAt - 2, { distance: 18, duration: 16 });
  const subIn = enter(frame, at('s02-04', 'algo') - 6, { distance: 12, duration: 16 });
  const scaleBackIn = p(at('s02-04', 'contrastar') - 10, 22);
  const weightIn = progress(frame, at('s02-04', 'pesa') - 6, 20, EASE.out);
  const certIn = enter(frame, at('s02-04', 'pesa') + 8, { distance: 18, duration: 16 });
  const link = progress(frame, at('s02-04', 'contrastar') + 6, 24, EASE.inOut);
  const linkLabel = p(at('s02-04', 'contrastar') + 10, 14);
  const dispX = BACK.x + 0.75 * BACK.w + 12;
  const dispY = BACK.y + 0.4625 * BACK.w;
  const WEIGHT = { cx: 1130, size: 210 } as const;
  const weightTop = FLOOR - WEIGHT.size * 1.2;

  return (
    <Stage>
      {/* ---- Phase 1: the scale that marks two kilos too many */}
      {melt < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: mix(BIG.x, HEAD.x + (HEAD.w - BIG.w) / 2 + 0, melt),
            top: BIG.y,
            opacity: (1 - melt) * bigE,
            transform: `translateY(${(1 - bigE) * 22}px) scale(${1 - 0.3 * melt})`,
            transformOrigin: '50% 60%',
          }}
        >
          <Scale width={BIG.w} reading={frame >= scaleAt ? '2,0' : '0,0'} readingTone={frame >= scaleAt ? 'amber' : 'muted'} press={press} glow={0.6 * swell(scaleAt, 24)} />
        </div>
      ) : null}
      {melt < 1 && fingerIn > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: BIG.x + bigG.plat.cx - 72 + 70,
            top: BIG.y + bigG.plat.top + press * 0.028 * BIG.w - 190 - 90 * (1 - fingerIn) - 8,
            opacity: fingerIn * (1 - melt),
          }}
        >
          <Finger length={190} />
        </div>
      ) : null}
      {eyeIn > 0.01 ? (
        <div style={{ position: 'absolute', left: 150, top: 150, opacity: eyeIn, display: 'flex', alignItems: 'center', gap: 22 }}>
          <div style={{ filter: `drop-shadow(0 0 ${Math.round(18 * swell(miresAt, 50))}px ${alpha(C.cyan, 0.7)})` }}>
            <Icon name="eye" size={112} color={C.cyanSoft} strokeWidth={1.8} />
          </div>
          <svg width={150} height={30} viewBox="0 0 150 30" style={{ overflow: 'visible' }}>
            <path d="M 4 15 H 140" stroke={alpha(C.cyanSoft, 0.7)} strokeWidth={4} strokeDasharray="4 14" strokeLinecap="round" />
          </svg>
        </div>
      ) : null}
      <div style={{ position: 'absolute', left: 0, top: 548, width: W, textAlign: 'center', fontFamily: FONT.sans, fontSize: 46, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, opacity: caption1, transform: `translateY(${(1 - caption1) * 12}px)` }}>
          marca <span style={{ color: '#fcd34d' }}>dos kilos de más</span>
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, opacity: caption2, transform: `translateY(${(1 - caption2) * 12}px)`, color: C.text }}>
          mirarla más <span style={{ color: '#fcd34d' }}>no la arregla</span>
        </div>
      </div>

      {/* ---- Phases 2–4: the head, its three steps and the shortcuts */}
      {headIn > 0.01 && phase5 < 1 ? (
        <div style={{ position: 'absolute', left: HEAD.x, top: HEAD.y, opacity: headIn * (1 - phase5) }}>
          <Head width={HEAD.w} dim={headDim}>
            <HeadSteps lit={lit} flow={flow} bent={crooked} />
          </Head>
          <div style={{ position: 'absolute', left: 0, top: 360 * headK + 6, width: HEAD.w, textAlign: 'center', fontFamily: FONT.sans, fontSize: 30, fontWeight: 650, color: C.muted, opacity: 1 - phase4 }}>
            tu cabeza
          </div>
        </div>
      ) : null}
      {headIn > 0.01 && rightOut > 0.01 ? (
        <div style={{ position: 'absolute', left: RIGHT_X, top: 0, width: W - RIGHT_X, height: 660, opacity: rightOut }}>
          <div style={{ position: 'absolute', left: 0, top: 70, display: 'flex', gap: 26 }}>
            {STEPS.map((s, i) => (
              <div
                key={s.text}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 16,
                  height: 84,
                  padding: '0 30px 0 22px',
                  boxSizing: 'border-box',
                  borderRadius: RADIUS.pill,
                  border: `2px solid ${alpha(C.cyan, 0.3 + 0.6 * lit[i])}`,
                  background: alpha(C.cyan, 0.05 + 0.13 * lit[i]),
                  boxShadow: lit[i] > 0.05 ? `0 0 ${Math.round(26 * lit[i])}px ${alpha(C.cyan, 0.25 * lit[i])}` : undefined,
                  fontFamily: FONT.sans,
                  fontSize: 48,
                  fontWeight: 800,
                  color: alpha(C.textStrong, 0.45 + 0.55 * lit[i]),
                  whiteSpace: 'nowrap',
                  opacity: 0.4 + 0.6 * lit[i],
                }}
              >
                <Icon name={s.icon} size={44} color={lit[i] > 0.3 ? C.cyanSoft : C.muted} strokeWidth={2} />
                {s.text}
              </div>
            ))}
          </div>
          {/* the bracket and its name */}
          <div style={{ position: 'absolute', left: 40, top: 168, width: 790, height: 24, boxSizing: 'border-box', borderLeft: `3px solid ${alpha(C.cyan, 0.5)}`, borderRight: `3px solid ${alpha(C.cyan, 0.5)}`, borderBottom: `3px solid ${alpha(C.cyan, 0.5)}`, borderRadius: '0 0 16px 16px', opacity: shortcuts }} />
          <div style={{ position: 'absolute', left: 0, top: 204, width: 870, display: 'flex', justifyContent: 'center', opacity: shortcuts, transform: `translateY(${(1 - shortcuts) * 10}px)` }}>
            <span style={{ fontFamily: FONT.sans, fontSize: 52, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>
              atajos <span style={{ color: C.cyanSoft, fontWeight: 700 }}>(heurísticas)</span>
            </span>
          </div>
          {/* useful in life · treacherous in analysis */}
          <div style={{ position: 'absolute', left: 0, top: 318, display: 'flex', gap: 30 }}>
            <VerdictCard icon="check" tone="emerald" text="útiles en la vida" show={useful} />
            <VerdictCard icon="alert" tone="amber" text="traicioneros en el análisis" show={betray} glow={swell(failAt, 50)} />
          </div>
        </div>
      ) : null}

      {/* ---- Phase 4: the reading card */}
      {phase4 > 0.01 && phase5 < 1 ? (
        <div style={{ position: 'absolute', left: 710, top: 112, opacity: (1 - phase5) * cardIn.opacity, transform: cardIn.transform }}>
          <ReadingCard width={940} one={one} two={two} glow={swell(heuerAt, 40)} />
        </div>
      ) : null}

      {/* ---- Phase 5: structure — the scale back, a weight and its certificate outside it */}
      {phase5 > 0.01 ? (
        <>
          <div style={{ position: 'absolute', left: 0, top: 16, width: W, textAlign: 'center', fontFamily: FONT.sans, ...titleIn }}>
            <div style={{ fontSize: 68, fontWeight: 900, letterSpacing: -1.4, color: C.cyan, textShadow: `0 0 30px ${alpha(C.cyan, 0.25)}`, whiteSpace: 'nowrap' }}>estructura:</div>
            <div style={{ marginTop: 6, fontSize: 46, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap', opacity: subIn.opacity, transform: subIn.transform }}>
              algo de fuera que no depende de tu cabeza
            </div>
          </div>
          <div style={{ position: 'absolute', left: BACK.x, top: BACK.y, opacity: scaleBackIn, transform: `translateY(${(1 - scaleBackIn) * 20}px)` }}>
            <Scale width={BACK.w} reading="2,0" />
          </div>
          {/* the weight, standing on the same floor, outside the scale */}
          <svg width={W} height={660} viewBox={`0 0 ${W} 660`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <ellipse cx={WEIGHT.cx} cy={FLOOR + 6} rx={WEIGHT.size * 0.62} ry={10} fill={alpha('#000000', 0.4)} opacity={weightIn} />
            <g transform={`translate(${WEIGHT.cx} ${FLOOR - (1 - weightIn) * 90})`} opacity={weightIn}>
              <WeightSvg size={WEIGHT.size} label="1" glow={link} />
            </g>
            {link > 0.01 ? (
              <g opacity={linkLabel}>
                <path
                  d={`M ${dispX} ${dispY} C ${dispX + 180} ${dispY - 70}, ${WEIGHT.cx - WEIGHT.size - 160} ${weightTop + 20}, ${mix(dispX, WEIGHT.cx - WEIGHT.size * 0.55 - 14, link)} ${mix(dispY, weightTop + 120, link)}`}
                  fill="none"
                  stroke={alpha(C.cyanSoft, 0.9)}
                  strokeWidth={4}
                  strokeDasharray="14 12"
                  strokeLinecap="round"
                />
              </g>
            ) : null}
          </svg>
          {link > 0.2 ? (
            <div style={{ position: 'absolute', left: 735, top: 336, fontFamily: FONT.sans, fontSize: 40, fontWeight: 800, color: C.cyanSoft, opacity: linkLabel, whiteSpace: 'nowrap' }}>contrastar</div>
          ) : null}
          <div style={{ position: 'absolute', left: 1300, top: FLOOR - 236, ...certIn }}>
            <Certificate width={320} lit={certIn.opacity} />
          </div>
        </>
      ) : null}
    </Stage>
  );
}

function VerdictCard({ icon, tone, text, show, glow = 0 }: { icon: IconName; tone: 'emerald' | 'amber'; text: string; show: number; glow?: number }) {
  const col = tone === 'emerald' ? C.emerald : C.amber;
  const soft = tone === 'emerald' ? '#6ee7b7' : '#fcd34d';
  return (
    <div
      style={{
        width: 500,
        minHeight: 190,
        boxSizing: 'border-box',
        padding: '26px 30px',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(col, 0.5 + 0.4 * glow)}`,
        background: `linear-gradient(180deg, ${alpha(col, 0.14)} 0%, ${alpha(C.ink900, 0.96)} 70%)`,
        boxShadow: `0 0 ${Math.round(34 * glow)}px ${alpha(col, 0.3 * glow)}`,
        fontFamily: FONT.sans,
        opacity: show,
        transform: `translateY(${(1 - show) * 16}px)`,
      }}
    >
      <Icon name={icon} size={54} color={col} strokeWidth={2.4} />
      <div style={{ marginTop: 12, fontSize: 44, fontWeight: 850, letterSpacing: -0.6, lineHeight: 1.1, color: soft }}>{text}</div>
    </div>
  );
}
