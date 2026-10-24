import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { BrandMark } from '../../../engine/src/overlay/ChapterRail';
import { isElevenLabsVoice } from '../../../engine/src/timeline/voice';
import { C, FONT, RADIUS, STAGE, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, RuleCards, type RuleCardDef } from '../../../engine/src/ui';
import { Binder } from './parts/Binder';
import { Bar, MiniNote, Paper } from './parts/paper';
import { TIMELINE } from '../timeline/load';
import { Stage } from './kit';

const W = STAGE.width;
const CARDS_TOP = 22;
const CARDS_H = 420;
const NEXT_TOP = 462;
const SEAL_TOP = 596;
const ART_H = 150;

/** The art slot of each rule card: two eyes, a short note that answers, the index and a brain. */
function RuleArt({ kind }: { kind: 0 | 1 | 2 }) {
  if (kind === 0) {
    return (
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <Icon name="eye" size={84} color={C.cyan} strokeWidth={2} />
        <Icon name="eye" size={84} color={C.cyan} strokeWidth={2} />
      </div>
    );
  }
  if (kind === 1) {
    return (
      <div style={{ position: 'relative', width: 190, height: ART_H - 20 }}>
        <Paper w={170} h={96} style={{ position: 'absolute', left: 10, top: 20, padding: '16px 16px' }}>
          <div style={{ display: 'grid', gap: 12 }}>
            <Bar w={120} h={9} color="#5b6577" />
            <Bar w={80} h={9} color="#5b657799" />
          </div>
        </Paper>
        <div style={{ position: 'absolute', right: 0, top: 0, width: 56, height: 56, borderRadius: 28, display: 'grid', placeItems: 'center', background: C.emerald }}>
          <Icon name="check" size={36} color={C.ink950} strokeWidth={3.4} />
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
      <Binder w={92} tabs={1} glow={0.2} />
      <Icon name="brain" size={84} color={C.emerald} strokeWidth={2} />
    </div>
  );
}

/**
 * s11-reglas «Tres reglas para mañana». Three numbered slots wait on `recap`; each rule card lights as
 * the voice says it (`rule-1` «lee dos veces», caza el calificador, descarta dos; `rule-2` «notas
 * cortas que respondan solas»; `rule-3` «índice para hechos, juicios con entrenamiento»). `indep-2`:
 * the disclaimer seal, «material independiente · no afiliado a SANS/GIAC · lo vigente, en giac.org».
 * `next`: the cards step back and «Tu turno: un examen de práctica de la app, con tu índice»;
 * `endcard`: the ALERTÓPOLIS end card (the binder, the title, the call to action, «y luego, a dormir»)
 * which holds to the last frame. No lab.
 */
export function S11Reglas(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recap = props.cue('recap');
  const ruleAt = [props.cue('rule-1'), props.cue('rule-2'), props.cue('rule-3')];
  const indep = props.cue('indep-2');
  const next = props.cue('next');
  const endcard = props.cue('endcard');

  const rules: RuleCardDef[] = [
    { title: 'lee dos veces', sub: ['caza el calificador', 'descarta dos'], tone: 'cyan', at: ruleAt[0], art: <RuleArt kind={0} /> },
    { title: ['notas cortas', 'que respondan solas'], sub: ['no solo apuntan', 'a otra página'], tone: 'cyan', at: ruleAt[1], art: <RuleArt kind={1} /> },
    { title: 'índice para hechos', sub: ['juicios con', 'entrenamiento'], tone: 'emerald', at: ruleAt[2], art: <RuleArt kind={2} /> },
  ];
  const boardOut = progress(frame, endcard - 14, 14, EASE.inOut);
  const sealIn = progress(frame, indep - 6, 16);
  const sealDrop = progress(frame, next - 8, 22, EASE.inOut);

  return (
    <Stage>
      {boardOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - boardOut, fontFamily: FONT.sans }}>
          <RuleCards rules={rules} width={W} height={CARDS_H} gap={24} slotAt={recap - 2} dimFrom={next} titleSize={52} subSize={32} artHeight={ART_H} frame={frame} fps={fps} style={{ position: 'absolute', left: 0, top: CARDS_TOP }} />
          <NextAction frame={frame} fps={fps} at={next} />
          <Seal frame={frame} sealIn={sealIn} top={CARDS_TOP + CARDS_H + 40 + (SEAL_TOP - (CARDS_TOP + CARDS_H + 40)) * sealDrop} />
        </div>
      ) : null}
      <EndCard frame={frame} fps={fps} at={endcard} />
    </Stage>
  );
}

/** The disclaimer seal: independent material, not affiliated, what is current is on giac.org. */
function Seal({ frame, sealIn, top }: { frame: number; sealIn: number; top: number }) {
  if (sealIn <= 0) return null;
  void frame;
  return (
    <div style={{ position: 'absolute', left: 0, top, width: W, display: 'flex', justifyContent: 'center', opacity: sealIn, transform: `translateY(${(1 - sealIn) * 18}px)` }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16, padding: '10px 32px 12px 20px', borderRadius: RADIUS.pill, border: `2px solid ${alpha(C.muted, 0.7)}`, background: alpha(C.ink950, 0.92), fontSize: 32, fontWeight: 650, color: C.text, whiteSpace: 'nowrap' }}>
        <Icon name="shield" size={40} color={C.muted} />
        material independiente · no afiliado a SANS/GIAC · lo vigente, en <span style={{ fontFamily: FONT.mono, fontWeight: 800, color: '#7dd3fc' }}>giac.org</span>
      </div>
    </div>
  );
}

/** The one next step: a practice exam of the app, with your index. */
function NextAction({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 6) return null;
  const p = springIn(frame, fps, at - 4, { damping: 16 });
  return (
    <div style={{ position: 'absolute', left: 0, top: NEXT_TOP, width: W, display: 'flex', justifyContent: 'center', opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - Math.min(1, p)) * 18}px)` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '16px 40px 18px 30px', borderRadius: 32, background: alpha(C.cyan, 0.08), border: `3px solid ${alpha(C.cyan, 0.7)}`, boxShadow: `0 0 34px ${alpha(C.cyan, 0.22)}` }}>
        <Icon name="play" size={46} color={C.cyan} strokeWidth={2} />
        <span style={{ fontSize: 50, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>Tu turno: un examen de práctica de la app, con tu índice</span>
      </div>
    </div>
  );
}

const CARD_W = 1480;

/** Closing card: the binder, ALERTÓPOLIS, title, call to action, objective, «a dormir», disclaimer. */
function EndCard({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 8) return null;
  const cardIn = springIn(frame, fps, at - 6, { damping: 18 });
  const art = enter(frame, at, { distance: 20 });
  const brand = enter(frame, at - 2, { distance: 16 });
  const title = enter(frame, at + 2, { distance: 24 });
  const sub = enter(frame, at + 6, { distance: 18 });
  const chips = enter(frame, at + 10, { distance: 18 });
  const moon = enter(frame, at + 14, { distance: 14, axis: 'x' });
  const ruleDraw = progress(frame, at + 12, 18);
  const disclaimer = enter(frame, at + 18, { distance: 12 });
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
      <div style={{ flexShrink: 0, width: 350, ...art }}>
        <div style={{ position: 'relative', width: 340, height: 440 }}>
          <Binder w={300} glow={0.5} tabs={progress(frame, at + 6, 24)} style={{ position: 'absolute', left: 10, top: 20 }} />
          <MiniNote w={150} h={100} rotate={9} stripe={C.amber} lines={3} style={{ position: 'absolute', left: 200, top: 340 }} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...brand }}>
          <BrandMark size={34} />
          <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
        </div>
        <div style={{ marginTop: 16, fontSize: 64, fontWeight: 850, letterSpacing: -1.5, lineHeight: 1.06, color: C.textStrong, whiteSpace: 'nowrap', ...title }}>
          <div>Tu índice vale</div>
          <div style={{ color: C.cyan }}>60 segundos</div>
        </div>
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'flex-start', gap: 14, fontSize: 40, fontWeight: 800, color: C.cyanSoft, lineHeight: 1.16, whiteSpace: 'nowrap', ...sub }}>
          <Icon name="play" size={40} color={C.cyan} strokeWidth={2} style={{ marginTop: 4 }} />
          <span>
            Tu turno: un examen de práctica
            <br />
            de la app, con tu índice
          </span>
        </div>
        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 16, ...chips }}>
          <Chip accent="cyan" icon="mortarboard" size={TYPE.label}>
            GCTI · estrategia de examen
          </Chip>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, ...moon }}>
            <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke={C.cyanSoft} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z" />
            </svg>
            <span style={{ fontSize: TYPE.label, fontWeight: 700, color: C.cyanSoft }}>y luego, a dormir</span>
          </span>
        </div>
        <div style={{ marginTop: 20, width: 640 * ruleDraw, height: 2, background: C.ink700 }} />
        <div style={{ marginTop: 16, width: 840, fontSize: TYPE.small, fontWeight: 550, color: C.muted, lineHeight: 1.35, ...disclaimer }}>
          Alertópolis · material independiente, no afiliado a SANS/GIAC. Lo vigente del examen, en giac.org.
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
