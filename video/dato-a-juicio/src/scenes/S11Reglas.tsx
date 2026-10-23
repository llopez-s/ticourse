import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { BrandMark } from '../../../engine/src/overlay/ChapterRail';
import { isElevenLabsVoice } from '../../../engine/src/timeline/voice';
import { C, FONT, STAGE, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, RuleCards, type RuleCardDef } from '../../../engine/src/ui';
import { IP } from '../data/canon';
import { TIMELINE } from '../timeline/load';
import { StairsArt } from './parts/Stairs';
import { Stage } from './kit';

const S11_RULES = [
  { title: ['Dato + juicio', 'para decidir'] as const, sub: ['y dices cuánto', 'te fías'] as const },
  { title: ['Tres piezas', 'a la vez'] as const, sub: ['el malware es una parte', 'de la capacidad'] as const },
  { title: ['Alimentas la', 'amenaza'] as const, sub: ['y juegas en tu terreno:', 'ventaja'] as const },
] as const;
const S11_NEXT = { title: 'Tu turno: las preguntas de las lecciones', sub: 's1m1 y s1m2 · 12 preguntas' } as const;
const S11_END = { disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a SANS/GIAC.', objective: 'GIAC GCTI · Requirements' } as const;

const W = STAGE.width;
const CARDS_TOP = 18;
const CARDS_H = 430;
const NEXT_TOP = 488;
const ART_H = 170;
const TONES = ['emerald', 'rose', 'cyan'] as const;

/**
 * s11-reglas «Tres ideas». Three numbered slots wait (`recap`); each rule card lights as the voice says it, with its own icon:
 * `rule-1` the three rungs from a loose datum to intelligence (the IP's dot climbing them), `rule-2` the threat triangle with
 * the capability piece tagged «malware» (one part of it), `rule-3` the chain with a broken link under the eye of «rastro» —
 * your ground. On `next` the cards step back for the one next step, «Tu turno: las preguntas de las lecciones» (s1m1 y s1m2 · 12
 * preguntas); on `endcard` the ALERTÓPOLIS end card, with the IP of the start as a loose datum faint in the background, the GCTI
 * domain and the disclaimer. It holds to the last frame. No lab.
 */
export function S11Reglas(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ruleAt = [props.cue('rule-1'), props.cue('rule-2'), props.cue('rule-3')];
  const next = props.cue('next');
  const endcard = props.cue('endcard');
  const boardOut = progress(frame, endcard - 14, 14, EASE.inOut);

  const rules: RuleCardDef[] = S11_RULES.map((r, i) => ({
    title: r.title,
    sub: [r.sub[0], r.sub[1]],
    tone: TONES[i],
    at: ruleAt[i],
    art: i === 0 ? <StairsArt width={250} labels={false} lit={progress(frame, ruleAt[0], 40) * 3} /> : i === 1 ? <TriangleIcon /> : <ChainIcon broken={progress(frame, ruleAt[2] + 8, 18)} />,
  }));

  return (
    <Stage>
      {boardOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - boardOut, fontFamily: FONT.sans }}>
          <RuleCards rules={rules} width={W} height={CARDS_H} gap={28} slotAt={-14} dimFrom={next} subSize={32} artHeight={ART_H} frame={frame} fps={fps} style={{ position: 'absolute', left: 0, top: CARDS_TOP }} />
          <NextAction frame={frame} fps={fps} at={next} />
        </div>
      ) : null}
      <EndCard frame={frame} fps={fps} at={endcard} />
    </Stage>
  );
}

/** Rule 2: the threat triangle, the capability disc tagged «malware». */
function TriangleIcon() {
  const disc = (x: number, y: number, hot: boolean) => <circle cx={x} cy={y} r={17} fill={alpha(hot ? C.amber : C.rose, 0.25)} stroke={hot ? C.amber : C.rose} strokeWidth={4} />;
  return (
    <svg width={260} height={160} viewBox="0 0 260 160" style={{ overflow: 'visible' }}>
      <polygon points="130,20 52,134 208,134" fill={alpha(C.rose, 0.12)} stroke={C.rose} strokeWidth={5} strokeLinejoin="round" />
      {disc(130, 20, false)}
      {disc(52, 134, true)}
      {disc(208, 134, false)}
      <g transform="translate(-6 84)">
        <rect x={-92} y={0} width={116} height={36} rx={18} fill={alpha(C.ink900, 0.95)} stroke={C.amber} strokeWidth={3} />
        <text x={-34} y={26} textAnchor="middle" fontFamily={FONT.sans} fontSize={26} fontWeight={800} fill="#fde68a">
          malware
        </text>
      </g>
    </svg>
  );
}

/** Rule 3: a chain of links, one broken, under an eye. */
function ChainIcon({ broken }: { broken: number }) {
  const xs = [14, 66, 118, 170, 222];
  return (
    <svg width={260} height={160} viewBox="0 0 260 160" style={{ overflow: 'visible' }}>
      {xs.map((x, i) => {
        const gone = i === 2 ? broken : 0;
        return <rect key={x} x={x - 4 + (i > 2 ? 10 * broken : -6 * broken * (i === 2 ? 0 : 1))} y={92 + (i > 2 ? 8 * broken : 0)} width={44} height={36} rx={14} fill={alpha(C.sky, 0.12)} stroke={gone > 0.2 ? C.rose : C.sky} strokeWidth={5} strokeDasharray={gone > 0.2 ? '10 8' : undefined} />;
      })}
      <circle cx={130} cy={40} r={30} fill={alpha(C.cyan, 0.12)} stroke={C.cyan} strokeWidth={4} />
      <circle cx={130} cy={40} r={10} fill={C.cyan} />
    </svg>
  );
}

/** The one next step: the lessons' questions. */
function NextAction({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 6) return null;
  const p = springIn(frame, fps, at - 4, { damping: 16 });
  return (
    <div style={{ position: 'absolute', left: 0, top: NEXT_TOP, width: W, display: 'flex', justifyContent: 'center', opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - Math.min(1, p)) * 18}px)` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '14px 40px 14px 30px', borderRadius: 32, background: alpha(C.cyan, 0.08), border: `3px solid ${alpha(C.cyan, 0.7)}`, boxShadow: `0 0 34px ${alpha(C.cyan, 0.22)}` }}>
        <Icon name="play" size={46} color={C.cyan} strokeWidth={2} />
        <div>
          <div style={{ fontSize: 50, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap', lineHeight: 1.1 }}>{S11_NEXT.title}</div>
          <div style={{ marginTop: 4, fontSize: 34, fontWeight: 700, color: C.cyanSoft, whiteSpace: 'nowrap' }}>{S11_NEXT.sub}</div>
        </div>
      </div>
    </div>
  );
}

const CARD_W = 1500;

/** Closing card: ALERTÓPOLIS, the call to action, the lesson's stairs, the GCTI domain, the IP faint at the back, the disclaimer. */
function EndCard({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 8) return null;
  const cardIn = springIn(frame, fps, at - 6, { damping: 18 });
  const art = enter(frame, at, { distance: 20 });
  const brand = enter(frame, at - 2, { distance: 16 });
  const title = enter(frame, at + 2, { distance: 24 });
  const sub = enter(frame, at + 8, { distance: 18 });
  const chips = enter(frame, at + 12, { distance: 18 });
  const ruleDraw = progress(frame, at + 12, 18);
  const disclaimer = enter(frame, at + 18, { distance: 12 });
  const ip = progress(frame, at + 6, 24);
  return (
    <div
      style={{
        position: 'absolute',
        left: (W - CARD_W) / 2,
        top: 30,
        width: CARD_W,
        height: STAGE.height - 60,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 70,
        padding: '0 70px',
        borderRadius: 36,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        border: `2px solid ${C.ink700}`,
        boxShadow: `0 40px 90px ${alpha('#000000', 0.45)}, inset 0 1px 0 ${alpha('#ffffff', 0.05)}`,
        fontFamily: FONT.sans,
        opacity: Math.min(1, cardIn * 1.4),
        transform: `scale(${0.94 + 0.06 * cardIn})`,
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: 4, background: `linear-gradient(90deg, transparent 0%, ${C.cyan} 50%, transparent 100%)`, opacity: 0.8 }} />
      {/* the IP of the start, a loose datum far back */}
      <div style={{ position: 'absolute', right: 40, bottom: 30, fontFamily: FONT.mono, fontSize: 40, fontWeight: 700, color: alpha(C.cyan, 0.2 * ip) }}>{IP}</div>
      <div style={{ flexShrink: 0, width: 360, ...art }}>
        <StairsArt width={360} labels labelSize={34} lit={3} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...brand }}>
          <BrandMark size={34} />
          <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
        </div>
        <div style={{ marginTop: 18, fontSize: 62, fontWeight: 850, letterSpacing: -1.5, lineHeight: 1.06, color: C.textStrong, whiteSpace: 'nowrap', ...title }}>
          <div>
            <span style={{ color: C.cyan }}>Tu turno:</span> las preguntas
          </div>
          <div>de las lecciones</div>
        </div>
        <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 14, fontSize: 40, fontWeight: 800, color: C.cyanSoft, whiteSpace: 'nowrap', ...sub }}>
          <Icon name="play" size={38} color={C.cyan} strokeWidth={2} />
          {S11_NEXT.sub}
        </div>
        <div style={{ marginTop: 22, ...chips }}>
          <Chip accent="violet" icon="mortarboard" size={TYPE.label}>
            {S11_END.objective}
          </Chip>
        </div>
        <div style={{ marginTop: 22, width: 640 * ruleDraw, height: 2, background: C.ink700 }} />
        <div style={{ marginTop: 18, width: 820, fontSize: TYPE.small, fontWeight: 550, color: C.muted, lineHeight: 1.35, ...disclaimer }}>
          {S11_END.disclaimer}
          {isElevenLabsVoice(TIMELINE.voice) ? (
            <>
              <br />
              Voz: ElevenLabs.
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
