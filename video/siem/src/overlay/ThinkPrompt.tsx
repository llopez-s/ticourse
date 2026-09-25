import { useCurrentFrame, useVideoConfig } from 'remotion';
import { TIMELINE } from '../timeline/load';
import type { ThinkPrompt as ThinkEntry } from '../timeline/types';
import { EASE, progress } from '../theme/motion';
import { C, FONT, LAYOUT, RADIUS, TYPE, alpha } from '../theme/tokens';
import { Icon } from '../ui/Icon';
import { twoLines, useFontsReady } from './Captions';

const ENTER = 12;
const EXIT = 10;
const TOP = LAYOUT.stage.top + 10;
const MAX_WIDTH = 1400;
const RING = 104;
const STROKE = 7;
const PAD_L = 26;
const PAD_R = 44;
const GAP = 32;
const QUESTION = { size: 44, weight: 750, letterSpacing: -0.3 } as const;
/** Widest the question may be inside a max-width card. */
const QUESTION_MAX = MAX_WIDTH - PAD_L - PAD_R - RING - GAP - 4;

/** Where one prompt is in its life at `frame`, or null when it is off screen. */
function promptState(entry: ThinkEntry, frame: number) {
  const end = entry.from + entry.durationInFrames;
  if (frame < entry.from || frame >= end) return null;
  const pin = progress(frame, entry.from, ENTER, EASE.out);
  const pout = progress(frame, end - EXIT, EXIT, EASE.inOut);
  // The ring is full once the card has landed and empty when it starts to leave.
  const holdFrom = entry.from + ENTER;
  const holdTo = Math.max(holdFrom + 1, end - EXIT);
  const remaining = 1 - progress(frame, holdFrom, holdTo - holdFrom, EASE.linear);
  return {
    opacity: Math.min(pin, 1 - pout),
    dy: (1 - pin) * -18 + pout * -10,
    remaining,
    framesLeft: Math.max(0, holdTo - Math.max(frame, holdFrom)),
  };
}

/** SVG countdown ring: a full cyan circle that empties clockwise as `remaining` goes 1 → 0. */
function CountdownRing({ remaining, seconds }: { remaining: number; seconds: number }) {
  const r = (RING - STROKE) / 2;
  const circumference = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: RING, height: RING, flexShrink: 0 }}>
      <svg width={RING} height={RING} viewBox={`0 0 ${RING} ${RING}`} style={{ display: 'block' }} aria-hidden>
        <circle cx={RING / 2} cy={RING / 2} r={r} fill={alpha(C.cyan, 0.06)} stroke={C.ink700} strokeWidth={STROKE} />
        <circle
          cx={RING / 2}
          cy={RING / 2}
          r={r}
          fill="none"
          stroke={C.cyan}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference * (1 - remaining)}
          transform={`rotate(-90 ${RING / 2} ${RING / 2}) scale(1 -1) translate(0 ${-RING})`}
          opacity={remaining > 0.002 ? 1 : 0}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONT.mono,
          fontSize: 38,
          fontWeight: 700,
          color: C.textStrong,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {seconds}
      </div>
    </div>
  );
}

/** The card itself: "PAUSA · PIENSA" + question, centred at the top of the stage. */
export function ThinkCard({
  q,
  remaining,
  seconds,
  opacity = 1,
  dy = 0,
}: {
  q: string;
  remaining: number;
  seconds: number;
  opacity?: number;
  dy?: number;
}) {
  const fontsReady = useFontsReady();
  const question = twoLines(q, QUESTION, fontsReady, QUESTION_MAX);
  return (
    <div
      style={{
        position: 'absolute',
        top: TOP,
        left: LAYOUT.width / 2,
        maxWidth: MAX_WIDTH,
        width: 'max-content',
        boxSizing: 'border-box',
        transform: `translate(-50%, ${dy}px)`,
        opacity,
        display: 'flex',
        alignItems: 'center',
        gap: GAP,
        padding: `24px ${PAD_R}px 26px ${PAD_L}px`,
        borderRadius: RADIUS.lg,
        background: C.ink900,
        border: `2px solid ${alpha(C.cyan, 0.6)}`,
        boxShadow: `0 0 40px ${alpha(C.cyan, 0.16)}, 0 26px 60px ${alpha('#000000', 0.5)}`,
        fontFamily: FONT.sans,
      }}
    >
      <CountdownRing remaining={remaining} seconds={seconds} />
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon name="pause" size={24} color={C.cyan} strokeWidth={3} />
          <span
            style={{
              fontSize: TYPE.micro,
              fontWeight: 800,
              letterSpacing: 3,
              lineHeight: 1,
              color: C.cyan,
              whiteSpace: 'nowrap',
            }}
          >
            PAUSA · PIENSA
          </span>
        </div>
        <div
          style={{
            marginTop: 10,
            width: question.width,
            fontSize: QUESTION.size,
            fontWeight: QUESTION.weight,
            lineHeight: 1.2,
            letterSpacing: QUESTION.letterSpacing,
            color: C.textStrong,
          }}
        >
          {question.lines.map((line) => (
            <div key={line} style={{ whiteSpace: 'nowrap' }}>
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Pure view: the active think prompt (if any) at `frame`. */
export function ThinkPromptView({ prompts, frame, fps }: { prompts: ThinkEntry[]; frame: number; fps: number }) {
  const entry = prompts.find((p) => frame >= p.from && frame < p.from + p.durationInFrames);
  if (!entry) return null;
  const state = promptState(entry, frame);
  if (!state) return null;
  return (
    <ThinkCard
      q={entry.q}
      remaining={state.remaining}
      seconds={Math.ceil(state.framesLeft / fps)}
      opacity={state.opacity}
      dy={state.dy}
    />
  );
}

/** Timeline-driven prompt mounted by SIEMVideo (absolute frame). */
export function ThinkPrompt() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return <ThinkPromptView prompts={TIMELINE.think} frame={frame} fps={fps} />;
}
