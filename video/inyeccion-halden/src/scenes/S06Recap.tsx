import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { BrandMark } from '../../../engine/src/overlay/ChapterRail';
import { C, FONT, STAGE, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, RuleCards, type RuleCardDef } from '../../../engine/src/ui';
import { END, NEXT, RULES, type RecapLine, type RuleArt } from '../data/s06-recap';
import { EXAM_TEXT } from './parts/bits';
import { Vitrina } from './parts/Page';
import { PortForm } from './parts/PortForm';
import { Tablon } from './parts/Signs';
import { Stage, wordFrame } from './kit';

const S = 's06-recap';
const W = STAGE.width;
const CARDS_TOP = 12;
const CARDS_H = 520;
const NEXT_TOP = 546;
const ART_H = 132;

/** One sub line: words in capitals are exam terms (violet), trailing punctuation aside. */
function Line({ line, show }: { line: RecapLine; show: number }) {
  return (
    <div style={{ color: line.strong ? C.textStrong : C.text, fontWeight: line.strong ? 800 : 650, opacity: show, whiteSpace: line.wrap ? 'normal' : 'nowrap', width: line.wrap ? 500 : undefined, textAlign: 'center', lineHeight: 1.2 }}>
      {line.text.split(' ').map((w, k) => {
        const m = /^([A-ZÁÉÍÓÚÑ]{2,})(\W*)$/.exec(w);
        return (
          <span key={k}>
            {k ? ' ' : ''}
            {m ? (
              <>
                <span style={{ color: EXAM_TEXT, fontWeight: 850 }}>{m[1]}</span>
                {m[2]}
              </>
            ) : (
              w
            )}
          </span>
        );
      })}
    </div>
  );
}

/** The drawing on each card: the same pictures as the video (the box, the board and sign, the glass case). */
function RuleImage({ art, show }: { art: RuleArt; show: number }): ReactNode {
  const o = Math.min(1, 0.35 + show);
  switch (art) {
    case 'form':
      return (
        <div style={{ opacity: o }}>
          <PortForm box={1} slip={1} scale={0.36} />
        </div>
      );
    case 'board':
      return (
        <div style={{ opacity: o, display: 'flex', alignItems: 'center', gap: 22 }}>
          <span style={{ width: 92, height: 92, borderRadius: 46, display: 'grid', placeItems: 'center', background: alpha(C.cyan, 0.12), border: `3px solid ${alpha(C.cyan, 0.7)}` }}>
            <Icon name="link" size={54} color={C.cyan} strokeWidth={2.2} />
          </span>
          <Tablon width={196} hot={1} />
        </div>
      );
    case 'case':
      return (
        <div style={{ opacity: o }}>
          <Vitrina w={1} lock={1} pad={16}>
            <span style={{ fontFamily: FONT.mono, fontSize: 36, fontWeight: 700, color: C.cyan }}>{'<script>'}</span>
          </Vitrina>
        </div>
      );
  }
}

/**
 * s06-recap «Tres reglas». Three numbered slots wait from the first frame; each rule card lights as the voice says it,
 * with the drawing the video gave it (the pre-printed form with its boxes, the sign and the notice board, the glass
 * case) and its lines on their own words. On `next` the cards step back for «Tu turno: termina la lección y sus
 * preguntas»; on `endcard` the ALERTÓPOLIS end card, with the box and the case, the title, «Cada dato, en su sitio»,
 * the objective and the CompTIA disclaimer, holds to the last frame.
 */
export function S06Recap(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ruleAt = [props.cue('rule-1'), props.cue('rule-2'), props.cue('rule-3')];
  const nextAt = props.cue('next');
  const endcardAt = props.cue('endcard');
  const recapAt = props.cue('recap');
  const boardOut = progress(frame, endcardAt - 14, 14, EASE.inOut);

  const lineAt = (seg: string, l: RecapLine, at: number) => Math.max(at + 4, wordFrame(S, seg, l.word, l.nth ?? 0) - 6);

  const rules: RuleCardDef[] = RULES.map((r, i) => ({
    title: r.title,
    sub: (
      <div style={{ lineHeight: 1.22, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: r.sub.some((l) => l.wrap) ? 10 : 0 }}>
        {r.sub.map((l, k) => (
          <Line key={k} line={l} show={0.25 + 0.75 * progress(frame, lineAt(r.seg, l, ruleAt[i]), 12)} />
        ))}
      </div>
    ),
    tone: 'cyan',
    at: ruleAt[i],
    art: <RuleImage art={r.art} show={progress(frame, ruleAt[i] - 4, 20, EASE.inOut)} />,
  }));

  return (
    <Stage>
      {boardOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - boardOut, fontFamily: FONT.sans }}>
          <RuleCards rules={rules} width={W} height={CARDS_H} gap={24} slotAt={Math.min(-14, recapAt - 40)} dimFrom={nextAt} subSize={32} artHeight={ART_H} frame={frame} fps={fps} style={{ position: 'absolute', left: 0, top: CARDS_TOP }} />
          <NextAction frame={frame} fps={fps} at={nextAt} />
        </div>
      ) : null}
      <EndCard frame={frame} fps={fps} at={endcardAt} />
    </Stage>
  );
}

/** The one next step: the lesson and its questions. */
function NextAction({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 6) return null;
  const p = springIn(frame, fps, at - 4, { damping: 16 });
  return (
    <div style={{ position: 'absolute', left: 0, top: NEXT_TOP, width: W, display: 'flex', justifyContent: 'center', opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - Math.min(1, p)) * 18}px)` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '16px 34px 16px 26px', borderRadius: 32, background: alpha(C.cyan, 0.08), border: `3px solid ${alpha(C.cyan, 0.7)}`, boxShadow: `0 0 34px ${alpha(C.cyan, 0.22)}`, whiteSpace: 'nowrap' }}>
        <Icon name="play" size={42} color={C.cyan} strokeWidth={2} />
        <span style={{ fontSize: 44, fontWeight: 850, color: C.textStrong }}>{NEXT}</span>
      </div>
    </div>
  );
}

const CARD_W = 1620;
const ART_W = 440;

/** Closing card: the box and the case; ALERTÓPOLIS, title, the remate, the next step, objective, disclaimer. */
function EndCard({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 8) return null;
  const cardIn = springIn(frame, fps, at - 6, { damping: 18 });
  const art = enter(frame, at, { distance: 20 });
  const brand = enter(frame, at - 2, { distance: 16 });
  const title = enter(frame, at + 2, { distance: 24 });
  const sub = enter(frame, at + 6, { distance: 18 });
  const cta = enter(frame, at + 10, { distance: 18 });
  const chips = enter(frame, at + 14, { distance: 18 });
  const ruleDraw = progress(frame, at + 14, 18);
  const disclaimer = enter(frame, at + 20, { distance: 12 });
  return (
    <div
      style={{
        position: 'absolute',
        left: (W - CARD_W) / 2,
        top: 24,
        width: CARD_W,
        height: STAGE.height - 48,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 54,
        padding: '0 56px',
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
      <div style={{ flexShrink: 0, width: ART_W, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 34, ...art }}>
        <PortForm box={1} slip={1} scale={0.46} />
        <div style={{ marginLeft: 70 }}>
          <Vitrina w={1} lock={1} pad={18}>
            <span style={{ fontFamily: FONT.mono, fontSize: 38, fontWeight: 700, color: C.cyan }}>{'<script>'}</span>
          </Vitrina>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...brand }}>
          <BrandMark size={34} />
          <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
        </div>
        <div style={{ marginTop: 14, fontSize: 60, fontWeight: 850, letterSpacing: -1.6, lineHeight: 1.06, color: C.textStrong, whiteSpace: 'nowrap', ...title }}>
          <div style={{ color: C.cyan }}>{END.title[0]}</div>
          <div>{END.title[1]}</div>
        </div>
        <div style={{ marginTop: 14, fontSize: 40, fontWeight: 800, color: '#6ee7b7', whiteSpace: 'nowrap', ...sub }}>{END.remate}</div>
        <div style={{ marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 14, fontSize: 36, fontWeight: 800, color: C.cyanSoft, whiteSpace: 'nowrap', ...cta }}>
          <Icon name="play" size={34} color={C.cyan} strokeWidth={2} />
          {NEXT}
        </div>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10, ...chips }}>
          <Chip accent="violet" icon="mortarboard" size={TYPE.label}>
            {END.objective}
          </Chip>
        </div>
        <div style={{ marginTop: 20, width: 640 * ruleDraw, height: 2, background: C.ink700 }} />
        <div style={{ marginTop: 14, width: 900, fontSize: TYPE.small, fontWeight: 550, color: C.muted, lineHeight: 1.35, ...disclaimer }}>{END.disclaimer}</div>
      </div>
    </div>
  );
}
