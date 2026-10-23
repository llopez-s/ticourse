import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { BrandMark } from '../../../engine/src/overlay/ChapterRail';
import { isElevenLabsVoice } from '../../../engine/src/timeline/voice';
import { C, FONT, RADIUS, STAGE, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, RuleCards, type RuleCardDef } from '../../../engine/src/ui';
import { S10_END, S10_NEXT, S10_RULES, S10_STRIP } from '../data/s10-cierre';
import { TIMELINE } from '../timeline/load';
import { Gear, } from './parts/F3eadBits';
import { StationGlyph, type StationKind, STATION_KINDS } from './parts/Glyphs';
import { Stage } from './kit';

const W = STAGE.width;
const STRIP_H = 84;
const CARDS_TOP = 116;
const CARDS_H = 400;
const NEXT_TOP = 548;
const STRIP_KINDS: readonly StationKind[] = ['ticket', 'board', 'notebook'];

/**
 * s10-cierre «Tres reglas». On `recap` a strip crosses the top with the three rules in one word each — pregunta ·
 * decisión · feedback — then the three rule cards light one by one under it (`rule-1`, `rule-2`, `rule-3`), each with
 * its picture: the comanda, a target with a tick, a pair of gears turning. On `next` the cards step back for the one
 * step, «Tu turno: Lab 1B · PIR Workshop», and under it «y las doce preguntas de las dos lecciones». On `endcard` the
 * ALERTÓPOLIS end card: the six stations in miniature, the title, the call to action again, the GCTI objective and the
 * disclaimer. It holds to the last frame. It does not solve the lab.
 */
export function S10Cierre(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recapAt = props.cue('recap');
  const ruleAt = [props.cue('rule-1'), props.cue('rule-2'), props.cue('rule-3')];
  const nextAt = props.cue('next');
  const endAt = props.cue('endcard');

  const boardOut = progress(frame, endAt - 14, 14, EASE.inOut);
  const stripAt = S10_STRIP.map((_, i) => recapAt + i * 8);
  const stripLit = S10_STRIP.map((_, i) => progress(frame, ruleAt[i] - 4, 10) * (1 - progress(frame, (ruleAt[i + 1] ?? nextAt) - 4, 12, EASE.inOut)));

  const arts = [
    <div key="a" style={{ transform: `scale(${1})` }}>
      <StationGlyph kind="ticket" size={140} color={C.cyan} strokeWidth={2.8} />
    </div>,
    <div key="b" style={{ width: 140, height: 140, display: 'grid', placeItems: 'center' }}>
      <Icon name="target" size={140} color={C.cyan} strokeWidth={1.6} />
    </div>,
    <MiniGears key="c" frame={frame} start={ruleAt[2]} />,
  ];
  const rules: RuleCardDef[] = S10_RULES.map((r, i) => ({
    title: r.title,
    sub: [r.sub[0], r.sub[1]],
    tone: i === 2 ? 'emerald' : 'cyan',
    at: ruleAt[i],
    art: arts[i],
  }));

  return (
    <Stage>
      {boardOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - boardOut, fontFamily: FONT.sans }}>
          {/* The recap strip */}
          <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: STRIP_H, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
            {S10_STRIP.map((w, i) => {
              const e = enter(frame, stripAt[i], { distance: 16, duration: 16 });
              const l = stripLit[i];
              return (
                <div key={w} style={{ display: 'flex', alignItems: 'center', gap: 24, ...e }}>
                  {i > 0 ? <Icon name="arrowRight" size={40} color={C.ink500} strokeWidth={2.6} /> : null}
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16, height: 70, padding: '0 34px 0 22px', boxSizing: 'border-box', borderRadius: RADIUS.pill, border: `3px solid ${alpha(C.cyan, 0.35 + 0.55 * l)}`, background: alpha(C.cyan, 0.06 + 0.12 * l), boxShadow: l > 0.05 ? `0 0 ${Math.round(24 * l)}px ${alpha(C.cyan, 0.3 * l)}` : undefined }}>
                    <StationGlyph kind={STRIP_KINDS[i]} size={44} color={l > 0.3 ? C.cyan : C.muted} />
                    <span style={{ fontSize: 42, fontWeight: 850, letterSpacing: -0.4, color: l > 0.3 ? C.textStrong : C.text }}>{w}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <RuleCards rules={rules} width={W} height={CARDS_H} gap={24} slotAt={recapAt + 20} dimFrom={nextAt} subSize={32} artHeight={150} frame={frame} fps={fps} style={{ position: 'absolute', left: 0, top: CARDS_TOP }} />
          <NextAction frame={frame} fps={fps} at={nextAt} />
        </div>
      ) : null}
      <EndCard frame={frame} fps={fps} at={endAt} />
    </Stage>
  );
}

/** Two small gears turning, the picture of «F3EAD gira más rápido». */
function MiniGears({ frame, start }: { frame: number; start: number }) {
  const a = 8.18 + Math.max(0, frame - start) * 0.9;
  return (
    <div style={{ position: 'relative', width: 190, height: 140 }}>
      <Gear cx={62} cy={74} teeth={22} rOut={58} rIn={51} rDisc={44} angle={a} tone={C.cyan} />
      <Gear cx={144} cy={74} teeth={10} rOut={29} rIn={21} rDisc={16} angle={-2.2 * a + 18} tone={C.amber} />
    </div>
  );
}

/** The one next step: the Lab 1B, and the twelve questions after it. */
function NextAction({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 6) return null;
  const p = springIn(frame, fps, at - 4, { damping: 16 });
  const twelve = enter(frame, at + 12, { distance: 10, duration: 16 });
  return (
    <div style={{ position: 'absolute', left: 0, top: NEXT_TOP - 30, width: W, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - Math.min(1, p)) * 18}px)` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '14px 40px 16px 30px', borderRadius: 32, background: alpha(C.cyan, 0.08), border: `3px solid ${alpha(C.cyan, 0.7)}`, boxShadow: `0 0 34px ${alpha(C.cyan, 0.22)}` }}>
        <Icon name="play" size={46} color={C.cyan} strokeWidth={2} />
        <span style={{ fontSize: 52, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>{S10_NEXT.lab}</span>
      </div>
      <div style={{ fontFamily: FONT.sans, fontSize: 38, fontWeight: 750, color: C.cyanSoft, whiteSpace: 'nowrap', ...twelve }}>{S10_NEXT.twelve}</div>
    </div>
  );
}

const CARD_W = 1480;
const ART_W = 480;

/** Closing card: the restaurant in miniature, ALERTÓPOLIS, title, call to action, objective, disclaimer. */
function EndCard({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 8) return null;
  const cardIn = springIn(frame, fps, at - 6, { damping: 18 });
  const art = enter(frame, at, { distance: 20 });
  const brand = enter(frame, at - 2, { distance: 16 });
  const title = enter(frame, at + 2, { distance: 24 });
  const sub = enter(frame, at + 6, { distance: 18 });
  const twelve = enter(frame, at + 10, { distance: 14 });
  const chips = enter(frame, at + 14, { distance: 18 });
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
        gap: 56,
        padding: '0 60px',
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
      {/* The six stations, in miniature */}
      <div style={{ flexShrink: 0, width: ART_W, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, ...art }}>
        {STATION_KINDS.map((k, i) => {
          const amber = i === 0 || i === 5;
          const tone = amber ? C.amber : C.cyan;
          return (
            <div key={k} style={{ aspectRatio: '1 / 1', display: 'grid', placeItems: 'center', borderRadius: 30, border: `3px solid ${alpha(tone, 0.7)}`, background: `linear-gradient(180deg, ${alpha(tone, 0.12)} 0%, ${alpha(C.ink900, 0.96)} 100%)` }}>
              <StationGlyph kind={k} size={82} color={tone} />
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...brand }}>
          <BrandMark size={34} />
          <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
        </div>
        <div style={{ marginTop: 18, fontSize: 60, fontWeight: 850, letterSpacing: -1.5, lineHeight: 1.06, color: C.textStrong, whiteSpace: 'nowrap', ...title }}>
          <div>
            <span style={{ color: C.cyan }}>{S10_END.title[0]}</span>
          </div>
          <div>{S10_END.title[1]}</div>
        </div>
        <div style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 14, fontSize: 42, fontWeight: 800, color: C.cyanSoft, whiteSpace: 'nowrap', ...sub }}>
          <Icon name="play" size={38} color={C.cyan} strokeWidth={2} />
          {S10_NEXT.lab}
        </div>
        <div style={{ marginTop: 6, fontSize: 32, fontWeight: 700, color: C.text, whiteSpace: 'nowrap', ...twelve }}>{S10_NEXT.twelve}</div>
        <div style={{ marginTop: 20, ...chips }}>
          <Chip accent="cyan" icon="mortarboard" size={TYPE.label}>
            {S10_END.objective}
          </Chip>
        </div>
        <div style={{ marginTop: 20, width: 640 * ruleDraw, height: 2, background: C.ink700 }} />
        <div style={{ marginTop: 16, width: 820, fontSize: TYPE.small, fontWeight: 550, color: C.muted, lineHeight: 1.35, ...disclaimer }}>
          {S10_END.disclaimer}
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
