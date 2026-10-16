import { useCurrentFrame, useVideoConfig } from 'remotion';
import { useTimeline } from '../timeline/context';
import type { QuestionCue } from '../timeline/types';
import { EASE, progress } from '../theme/motion';
import { ACCENT, C, FONT, LAYOUT, RADIUS, STAGE, alpha } from '../theme/tokens';
import { Icon } from '../ui/Icon';
import { twoLines, useFontsReady } from './Captions';
import { trapRowDim } from './question-dim';
import { CountdownRing } from './ThinkPrompt';

/**
 * Exam question card (caso profiles): the scene dims behind a centred panel
 * with the objective badge, scenario, question and four options A–D; a
 * countdown ring while the viewer may pause; then the correct option is
 * marked (emerald, check, «Correcta», `why` under it) and, at the trap frame,
 * the trap (amber, alert, «Trampa», `trapWhy` under it). Every element is laid
 * out from the first frame (only opacity / the explanation rows change), and
 * the explanations live under their own options, so no gap gives the answer
 * away before the reveal. No text below 30 px. Sounds come from the script's
 * `sfx` cues, never from here.
 */

const ENTER = 12;
const EXIT = 10;
/** Options appear one after another once the panel has started to land. */
const OPTION_DELAY = 6;
const OPTION_STEP = 4;
const OPTION_IN = 10;
const MARK_IN = 10;
const RING_FADE = 6;
/** Opacity of the two options that are neither the answer nor the trap, after the reveal. */
const DIMMED = 0.4;

/** Below the top band: the exam card (top-right, y 24–~170) can land while the panel is up. */
const ZONE_TOP = LAYOUT.topBarHeight + 16;
const BORDER = 2;
const PAD_X = 34;
const PAD_TOP = 16;
const PAD_BOTTOM = 18;
const INNER = STAGE.width - 2 * PAD_X - 2 * BORDER;

/** Header: badge + scenario + question on the left, countdown column on the right. */
const BADGE_H = 46;
const BADGE_GAP = 14;
const SCENARIO_GAP = 10;
const SIDE_W = 290;
const SIDE_GAP = 28;
const LABEL_SIZE = 30;
const SIDE_H = 104 + 10 + LABEL_SIZE * 1.2;
const HEADER_MAX = INNER - SIDE_W - SIDE_GAP;
const HEADER_GAP = 14;

/** Option rows. */
const ROW_GAP = 8;
const ROW_PAD_X = 18;
const ROW_PAD_Y = 8;
const CHIP = 46;
const CHIP_GAP = 18;
const PILL_W = 220;
const PILL_GAP = 16;
const OPTION_MAX = INNER - 2 * BORDER - 2 * ROW_PAD_X - CHIP - CHIP_GAP - PILL_GAP - PILL_W;
/** The explanation runs under the option text and the pill slot. */
const WHY_MAX = INNER - 2 * BORDER - 2 * ROW_PAD_X - CHIP - CHIP_GAP;
const WHY_TOP = 4;

const SCENARIO = { size: 32, weight: 500, lineHeight: 1.2 } as const;
const QUESTION = { size: 40, weight: 750, letterSpacing: -0.3, lineHeight: 1.18 } as const;
const OPTION = { size: 32, weight: 600, lineHeight: 1.2 } as const;
const WHY = { size: 30, weight: 550, lineHeight: 1.25 } as const;
/** Floor for every text on the card: readable on a phone at 1080p. */
const MIN_SIZE = 30;

const LETTERS = ['A', 'B', 'C', 'D'] as const;

interface Fitted {
  lines: string[];
  width: number;
  size: number;
}

/** One or two lines at the base size; if two lines still do not fit `max`, shrink (never below 30 px). */
function fit(
  text: string,
  base: { size: number; weight: number; letterSpacing?: number },
  fontsReady: boolean,
  max: number,
): Fitted {
  let size = base.size;
  for (;;) {
    const r = twoLines(text, { ...base, size }, fontsReady, max);
    if (r.width <= max || size - 2 < MIN_SIZE) return { ...r, size };
    size -= 2;
  }
}

function lineBox(f: Fitted, lineHeight: number): number {
  return f.lines.length * Math.round(f.size * lineHeight);
}

/** Every measured piece of one card plus its final (fully revealed) height. */
function cardLayout(cue: QuestionCue, fontsReady: boolean) {
  const scenario = fit(cue.scenario, SCENARIO, fontsReady, HEADER_MAX);
  const question = fit(cue.q, QUESTION, fontsReady, HEADER_MAX);
  const options = cue.options.map((o) => fit(o, OPTION, fontsReady, OPTION_MAX));
  const why = fit(cue.why, WHY, fontsReady, WHY_MAX);
  const trapWhy = fit(cue.trapWhy, WHY, fontsReady, WHY_MAX);
  const left = BADGE_H + BADGE_GAP + lineBox(scenario, SCENARIO.lineHeight) + SCENARIO_GAP + lineBox(question, QUESTION.lineHeight);
  const header = Math.max(left, SIDE_H);
  const optionBox = options.map((o) => Math.max(CHIP, lineBox(o, OPTION.lineHeight)));
  const whyH = WHY_TOP + lineBox(why, WHY.lineHeight);
  const trapH = WHY_TOP + lineBox(trapWhy, WHY.lineHeight);
  const rows = optionBox.reduce((sum, h) => sum + h + 2 * ROW_PAD_Y + 2 * BORDER, 0) + 3 * ROW_GAP + whyH + trapH;
  const height = 2 * BORDER + PAD_TOP + header + HEADER_GAP + rows + PAD_BOTTOM;
  return { scenario, question, options, optionBox, why, trapWhy, whyH, trapH, header, height };
}

function Lines({ f, lineHeight, color, weight, letterSpacing = 0 }: { f: Fitted; lineHeight: number; color: string; weight: number; letterSpacing?: number }) {
  const lh = Math.round(f.size * lineHeight);
  return (
    <div style={{ width: f.width, fontSize: f.size, fontWeight: weight, lineHeight: `${lh}px`, letterSpacing, color }}>
      {f.lines.map((line, k) => (
        <div key={k} style={{ whiteSpace: 'nowrap' }}>
          {line}
        </div>
      ))}
    </div>
  );
}

/** «Correcta» / «Trampa» tag: icon + word, so the mark never depends on colour alone. */
function MarkPill({ kind, opacity }: { kind: 'answer' | 'trap'; opacity: number }) {
  const tone = kind === 'answer' ? C.emerald : C.amber;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        height: CHIP,
        padding: '0 18px 0 14px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.pill,
        border: `2px solid ${tone}`,
        background: alpha(tone, 0.14),
        opacity,
        transform: `scale(${0.92 + 0.08 * opacity})`,
        transformOrigin: 'right center',
      }}
    >
      <Icon name={kind === 'answer' ? 'check' : 'alert'} size={30} color={tone} strokeWidth={2.6} />
      <span style={{ fontSize: 30, fontWeight: 800, lineHeight: 1, color: tone, whiteSpace: 'nowrap' }}>
        {kind === 'answer' ? 'Correcta' : 'Trampa'}
      </span>
    </div>
  );
}

function OptionRow({
  index,
  f,
  box,
  enter,
  dim,
  mark,
  markKind,
  explain,
  explainH,
  explainIn,
}: {
  index: number;
  f: Fitted;
  box: number;
  enter: number;
  dim: number;
  /** 0–1: how marked this row is (answer at the reveal, trap at the trap frame). */
  mark: number;
  markKind: 'answer' | 'trap' | null;
  explain: Fitted | null;
  explainH: number;
  explainIn: number;
}) {
  const tone = markKind === 'answer' ? C.emerald : C.amber;
  const soft = markKind === 'answer' ? ACCENT.emerald.soft : ACCENT.amber.soft;
  return (
    <div
      style={{
        position: 'relative',
        padding: `${ROW_PAD_Y}px ${ROW_PAD_X}px`,
        borderRadius: RADIUS.md,
        border: `${BORDER}px solid ${C.ink700}`,
        background: C.ink850,
        opacity: enter * dim,
        transform: `translateY(${(1 - enter) * 14}px)`,
      }}
    >
      {markKind ? (
        <div
          style={{
            position: 'absolute',
            inset: -BORDER,
            borderRadius: RADIUS.md,
            border: `${BORDER}px solid ${tone}`,
            background: alpha(tone, 0.12),
            boxShadow: `0 0 28px ${alpha(tone, 0.22)}`,
            opacity: mark,
          }}
        />
      ) : null}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: CHIP_GAP }}>
        <div style={{ position: 'relative', width: CHIP, height: CHIP, flexShrink: 0 }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: RADIUS.sm,
              border: `2px solid ${C.ink600}`,
              background: C.ink800,
            }}
          />
          {markKind ? (
            <div style={{ position: 'absolute', inset: 0, borderRadius: RADIUS.sm, background: tone, opacity: mark }} />
          ) : null}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONT.mono,
              fontSize: 30,
              fontWeight: 700,
              color: markKind && mark > 0.5 ? C.ink950 : C.textStrong,
            }}
          >
            {LETTERS[index]}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0, height: box, display: 'flex', alignItems: 'center' }}>
          <Lines f={f} lineHeight={OPTION.lineHeight} color={C.textStrong} weight={OPTION.weight} />
        </div>
        <div style={{ width: PILL_W, flexShrink: 0, display: 'flex', justifyContent: 'flex-end', marginLeft: PILL_GAP - CHIP_GAP }}>
          {markKind && mark > 0 ? <MarkPill kind={markKind} opacity={mark} /> : null}
        </div>
      </div>
      {explain ? (
        <div style={{ position: 'relative', height: explainH * mark, overflow: 'hidden', marginLeft: CHIP + CHIP_GAP }}>
          <div style={{ paddingTop: WHY_TOP, opacity: explainIn, transform: `translateY(${(1 - explainIn) * -8}px)` }}>
            <Lines f={explain} lineHeight={WHY.lineHeight} color={soft} weight={WHY.weight} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** The panel at `frame` (absolute). Mounted only while its cue is on screen, so hooks stay unconditional. */
function QuestionPanel({ cue, frame, fps }: { cue: QuestionCue; frame: number; fps: number }) {
  const fontsReady = useFontsReady();
  const layout = cardLayout(cue, fontsReady);
  const end = cue.from + cue.durationInFrames;
  const pin = progress(frame, cue.from, ENTER, EASE.out);
  const pout = progress(frame, end - EXIT, EXIT, EASE.inOut);
  const opacity = Math.min(pin, 1 - pout);
  const dy = (1 - pin) * 24 + pout * -10;

  // Countdown: only while the viewer may pause, fading in and out so it never pops.
  const countdownEnd = cue.countdownFrom + cue.countdownFrames;
  const ringOpacity = Math.min(progress(frame, cue.countdownFrom, RING_FADE, EASE.out), 1 - progress(frame, countdownEnd, RING_FADE, EASE.inOut));
  const remaining = 1 - progress(frame, cue.countdownFrom, cue.countdownFrames, EASE.linear);
  const seconds = Math.max(0, Math.ceil((countdownEnd - frame) / fps));

  // Reveal, then trap (trapFrame >= revealFrame; equal is allowed). The trap row dims only for the stretch
  // between the two marks (see trapRowDim), so with equal frames it never dips.
  const reveal = progress(frame, cue.revealFrame, MARK_IN, EASE.out);
  const trapMark = progress(frame, cue.trapFrame, MARK_IN, EASE.out);
  const base = 1 - (1 - DIMMED) * reveal;

  const top = Math.max(ZONE_TOP, Math.round(STAGE.top + (STAGE.height - layout.height) / 2));
  const badge = `EXAMEN · ${cue.badge ?? 'SY0-701'} · ${cue.objective}`;

  return (
    <>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(to bottom, ${alpha(C.ink950, 0.4)} 0px, ${alpha(C.ink950, 0.86)} ${STAGE.top}px, ${alpha(C.ink950, 0.86)} 100%)`,
          opacity,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top,
          left: STAGE.left,
          width: STAGE.width,
          boxSizing: 'border-box',
          padding: `${PAD_TOP}px ${PAD_X}px ${PAD_BOTTOM}px`,
          borderRadius: RADIUS.lg,
          background: C.ink900,
          border: `${BORDER}px solid ${alpha(C.violet, 0.7)}`,
          boxShadow: `0 0 44px ${alpha(C.violetStrong, 0.22)}, 0 26px 60px ${alpha('#000000', 0.5)}`,
          fontFamily: FONT.sans,
          opacity,
          transform: `translateY(${dy}px)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: SIDE_GAP, height: layout.header }}>
          <div style={{ width: HEADER_MAX, flexShrink: 0 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                height: BADGE_H,
                padding: '0 20px 0 14px',
                boxSizing: 'border-box',
                borderRadius: RADIUS.pill,
                border: `2px solid ${alpha(C.violet, 0.8)}`,
                background: alpha(C.violetDeep, 0.6),
              }}
            >
              <Icon name="mortarboard" size={32} color={C.violet} strokeWidth={2} />
              <span style={{ fontSize: 30, fontWeight: 800, letterSpacing: 2, lineHeight: 1, color: C.violet, whiteSpace: 'nowrap' }}>{badge}</span>
            </div>
            <div style={{ marginTop: BADGE_GAP }}>
              <Lines f={layout.scenario} lineHeight={SCENARIO.lineHeight} color={C.muted} weight={SCENARIO.weight} />
            </div>
            <div style={{ marginTop: SCENARIO_GAP }}>
              <Lines f={layout.question} lineHeight={QUESTION.lineHeight} color={C.textStrong} weight={QUESTION.weight} letterSpacing={QUESTION.letterSpacing} />
            </div>
          </div>
          <div
            style={{
              width: SIDE_W,
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              opacity: ringOpacity,
            }}
          >
            {ringOpacity > 0 ? (
              <>
                <CountdownRing remaining={remaining} seconds={seconds} />
                <span style={{ fontSize: LABEL_SIZE, fontWeight: 700, lineHeight: 1.2, color: C.cyan, whiteSpace: 'nowrap' }}>Pausa si quieres</span>
              </>
            ) : null}
          </div>
        </div>
        <div style={{ marginTop: HEADER_GAP, display: 'flex', flexDirection: 'column', gap: ROW_GAP }}>
          {layout.options.map((f, i) => {
            const isAnswer = i === cue.answer;
            const isTrap = i === cue.trap;
            const enter = progress(frame, cue.from + OPTION_DELAY + i * OPTION_STEP, OPTION_IN, EASE.out);
            const dim = isAnswer ? 1 : isTrap ? trapRowDim(reveal, trapMark, DIMMED) : base;
            const markKind = isAnswer ? 'answer' : isTrap ? 'trap' : null;
            const mark = isAnswer ? reveal : isTrap ? trapMark : 0;
            const markFrom = isAnswer ? cue.revealFrame : cue.trapFrame;
            return (
              <OptionRow
                key={i}
                index={i}
                f={f}
                box={layout.optionBox[i]}
                enter={enter}
                dim={dim}
                mark={mark}
                markKind={markKind}
                explain={isAnswer ? layout.why : isTrap ? layout.trapWhy : null}
                explainH={isAnswer ? layout.whyH : isTrap ? layout.trapH : 0}
                explainIn={markKind ? progress(frame, markFrom + 3, MARK_IN, EASE.out) : 0}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

/** Pure view: the exam question (if any) on screen at `frame`. */
export function ExamQuestionView({ questions, frame, fps }: { questions: QuestionCue[]; frame: number; fps: number }) {
  const cue = questions.find((q) => frame >= q.from && frame < q.from + q.durationInFrames);
  if (!cue) return null;
  return <QuestionPanel cue={cue} frame={frame} fps={fps} />;
}

/** Timeline-driven layer mounted by LessonVideo (absolute frame). */
export function ExamQuestionLayer() {
  const frame = useCurrentFrame();
  const timeline = useTimeline();
  const { fps } = useVideoConfig();
  return <ExamQuestionView questions={timeline.questions ?? []} frame={frame} fps={fps} />;
}
