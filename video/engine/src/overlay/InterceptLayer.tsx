import { useCurrentFrame } from 'remotion';
import { useTimeline } from '../timeline/context';
import type { InterceptCue } from '../timeline/types';
import { EASE, progress } from '../theme/motion';
import { C, FONT, LAYOUT, RADIUS, TYPE, alpha } from '../theme/tokens';
import { Icon } from '../ui/Icon';
import { twoLines, useFontsReady } from './Captions';

const ENTER = 12;
const EXIT = 10;
/** Frames per typed character: 70 characters type out in ~2.3 s, inside the shortest (2.5 s) lead. */
const TYPE_RATE = 1;
/** Same slot as the think prompt (they never overlap in time). */
const TOP = LAYOUT.stage.top + 10;
const MAX_WIDTH = 1400;
const PAD_X = 34;
const BODY = { size: 42, weight: 700, letterSpacing: -0.2 } as const;
const BODY_MAX = MAX_WIDTH - 2 * PAD_X - 4;
const CARD_BG = alpha(C.roseDeep, 0.92);

/** Where one message is in its life at `frame`: null when off screen. */
export function interceptState(entry: InterceptCue, frame: number) {
  const end = entry.from + entry.durationInFrames;
  if (frame < entry.from || frame >= end) return null;
  const pin = progress(frame, entry.from, ENTER, EASE.out);
  const pout = progress(frame, end - EXIT, EXIT, EASE.inOut);
  const typed = Math.min(entry.text.length, Math.max(0, Math.floor((frame - entry.from - ENTER / 2) / TYPE_RATE)));
  return { opacity: Math.min(pin, 1 - pout), dy: (1 - pin) * -18 + pout * -10, typed };
}

/** The card: "MENSAJE INTERCEPTADO · <adversary>" and the message typing out in «». */
export function InterceptCard({
  adversary,
  text,
  typed = text.length,
  opacity = 1,
  dy = 0,
}: {
  adversary: string;
  text: string;
  typed?: number;
  opacity?: number;
  dy?: number;
}) {
  const fontsReady = useFontsReady();
  // Lay out the whole message once, so the card keeps its size while it types.
  const body = twoLines(`«${text}»`, BODY, fontsReady, BODY_MAX);
  const typing = typed < text.length;
  let left = typed + 1; // + the opening «
  const shown = body.lines.map((line) => {
    const part = line.slice(0, Math.max(0, left));
    left -= line.length + 1; // + the space the line break replaced
    return part;
  });
  const lines = typing ? shown : body.lines;
  const active = typing ? lines.findIndex((l, k) => l.length < body.lines[k].length) : -1;
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
        padding: `20px ${PAD_X}px 24px`,
        borderRadius: RADIUS.lg,
        background: CARD_BG,
        border: `2px solid ${alpha(C.rose, 0.85)}`,
        boxShadow: `0 0 40px ${alpha(C.rose, 0.22)}, 0 26px 60px ${alpha('#000000', 0.5)}`,
        fontFamily: FONT.sans,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Icon name="terminal" size={24} color={C.rose} strokeWidth={2.5} />
        <span
          style={{
            fontFamily: FONT.mono,
            fontSize: TYPE.micro,
            fontWeight: 800,
            letterSpacing: 3,
            lineHeight: 1,
            color: C.roseSoft,
            whiteSpace: 'nowrap',
          }}
        >
          {`MENSAJE INTERCEPTADO · ${adversary}`}
        </span>
      </div>
      <div
        style={{
          marginTop: 12,
          width: body.width,
          fontSize: BODY.size,
          fontWeight: BODY.weight,
          lineHeight: 1.22,
          letterSpacing: BODY.letterSpacing,
          color: C.textStrong,
        }}
      >
        {body.lines.map((full, k) => (
          <div key={full} style={{ whiteSpace: 'nowrap', minHeight: '1.22em' }}>
            {lines[k]}
            {k === active ? (
              <span style={{ display: 'inline-block', width: '0.5em', height: '0.95em', marginLeft: 4, verticalAlign: '-0.1em', background: C.rose }} />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Pure view: the active message (if any) at `frame`. */
export function InterceptView({ entries, frame }: { entries: InterceptCue[]; frame: number }) {
  const entry = entries.find((e) => frame >= e.from && frame < e.from + e.durationInFrames);
  if (!entry) return null;
  const state = interceptState(entry, frame);
  if (!state) return null;
  return <InterceptCard adversary={entry.adversary} text={entry.text} typed={state.typed} opacity={state.opacity} dy={state.dy} />;
}

/** Timeline-driven layer mounted by LessonVideo (absolute frame). */
export function InterceptLayer() {
  const frame = useCurrentFrame();
  const timeline = useTimeline();
  return <InterceptView entries={timeline.intercept ?? []} frame={frame} />;
}
