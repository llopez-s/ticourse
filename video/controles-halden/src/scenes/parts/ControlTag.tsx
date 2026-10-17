import type { CSSProperties } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../engine/src/theme/motion';

/**
 * The video's one image for «a control has two labels»: a luggage-style tag with two boxes, the top one
 * «¿quién lo hace funcionar?» (the category, cyan) and the bottom one «¿qué hace aquí?» (the type, violet).
 * Every scene that labels a control draws THIS tag (s01, s02, s04, s06, s08), so the viewer learns where to look:
 * category up, type down. A box is empty (its question in faint text) until its value lands, which writes the
 * exam term in English, big, and keeps the question small above it.
 *
 * Frames are local to the scene's Sequence. `topAt` / `bottomAt` = the frame each value lands (omit = stays empty).
 * `aside` is an optional dim note to the right of the bottom value, for short values only (a long value leaves it
 * no room: s06 draws «sola sería Preventive» under the tag instead).
 */
export const TAG_QUESTIONS = { top: '¿quién lo hace funcionar?', bottom: '¿qué hace aquí?' } as const;

export function ControlTag({
  frame,
  width = 420,
  top,
  bottom,
  topAt,
  bottomAt,
  aside,
  asideAt,
  dim = 0,
  hole = true,
  style,
}: {
  frame: number;
  width?: number;
  /** Category value, e.g. «Physical». */
  top?: string;
  /** Type value, e.g. «Preventive». */
  bottom?: string;
  topAt?: number;
  bottomAt?: number;
  aside?: string;
  asideAt?: number;
  /** 0–1: step the whole tag back (opacity and saturation), e.g. when another tag takes the focus. */
  dim?: number;
  /** Draw the punched hole and string at the left (off for compact grids). */
  hole?: boolean;
  style?: CSSProperties;
}) {
  const s = width / 420; // every size scales with the tag
  const boxH = Math.round(118 * s);
  const pad = Math.round(18 * s);
  const holeW = hole ? Math.round(56 * s) : 0;
  // Room for a line of text inside a box: tag minus hole, tag padding and borders, box padding and borders.
  const textW = width - holeW - 2 * pad - 6 * s - 2 * Math.round(16 * s) - 5 * s;
  // Both values share one size (so «Technical» and «Compensating» match), shrunk until the longer one fits
  // (Inter 850 at ~0.62 em per character for these terms).
  const longest = Math.max(top?.length ?? 0, bottom?.length ?? 0, 1);
  const valueSize = Math.min(50 * s, textW / (longest * 0.62));
  return (
    <div
      style={{
        position: 'relative',
        width,
        fontFamily: FONT.sans,
        opacity: 1 - 0.6 * dim,
        filter: dim > 0.01 ? `saturate(${1 - 0.5 * dim})` : undefined,
        ...style,
      }}
    >
      <div
        style={{
          position: 'relative',
          marginLeft: holeW,
          width: width - holeW,
          borderRadius: Math.round(18 * s),
          background: C.ink900,
          border: `${Math.max(2, Math.round(3 * s))}px solid ${alpha(C.text, 0.35)}`,
          boxShadow: `0 ${Math.round(14 * s)}px ${Math.round(40 * s)}px ${alpha('#000000', 0.45)}`,
          padding: pad,
          display: 'flex',
          flexDirection: 'column',
          gap: Math.round(12 * s),
        }}
      >
        <Box frame={frame} s={s} h={boxH} textW={textW} valueSize={valueSize} question={TAG_QUESTIONS.top} value={top} at={topAt} color={C.cyan} />
        <Box frame={frame} s={s} h={boxH} textW={textW} valueSize={valueSize} question={TAG_QUESTIONS.bottom} value={bottom} at={bottomAt} color={C.violet} aside={aside} asideAt={asideAt} />
      </div>
      {hole ? (
        <svg
          width={holeW + Math.round(14 * s)}
          height={Math.round(80 * s)}
          style={{ position: 'absolute', left: 0, top: Math.round(24 * s), overflow: 'visible' }}
        >
          {/* the string to whatever the tag hangs from */}
          <path
            d={`M ${holeW + 10 * s} ${40 * s} C ${holeW * 0.5} ${36 * s}, ${holeW * 0.2} ${10 * s}, 0 ${2 * s}`}
            fill="none"
            stroke={alpha(C.text, 0.55)}
            strokeWidth={Math.max(2, 3 * s)}
            strokeLinecap="round"
          />
          <circle cx={holeW + 14 * s} cy={40 * s} r={9 * s} fill={C.ink950} stroke={alpha(C.text, 0.45)} strokeWidth={Math.max(2, 3 * s)} />
        </svg>
      ) : null}
    </div>
  );
}

function Box({
  frame,
  s,
  h,
  textW,
  valueSize,
  question,
  value,
  at,
  color,
  aside,
  asideAt,
}: {
  frame: number;
  s: number;
  h: number;
  textW: number;
  valueSize: number;
  question: string;
  value?: string;
  at?: number;
  color: string;
  aside?: string;
  asideAt?: number;
}) {
  const on = value && at !== undefined ? progress(frame, at, 14, EASE.out) : 0;
  // The empty question shrinks to fit its box (Inter at ~0.47 em per character for these strings).
  const fit = textW / (question.length * 0.47);
  const askSize = Math.min(30 * s, fit);
  const asideOn = aside && asideAt !== undefined ? progress(frame, asideAt, 16, EASE.out) : 0;
  return (
    <div
      style={{
        position: 'relative',
        height: h,
        borderRadius: Math.round(12 * s),
        border: `${Math.max(2, Math.round(2.5 * s))}px ${on > 0.5 ? 'solid' : 'dashed'} ${alpha(color, 0.35 + 0.5 * on)}`,
        background: alpha(color, 0.04 + 0.1 * on),
        padding: `${Math.round(10 * s)}px ${Math.round(16 * s)}px`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          fontSize: Math.round(mixN(askSize, Math.min(22 * s, askSize), on)),
          fontWeight: 650,
          color: on > 0.01 ? alpha(C.muted, 0.9) : C.faint,
          whiteSpace: 'nowrap',
          lineHeight: 1.1,
        }}
      >
        {question}
      </div>
      {on > 0.01 ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: Math.round(16 * s),
            marginTop: Math.round(4 * s),
            opacity: on,
            transform: `translateY(${(1 - on) * 10 * s}px)`,
          }}
        >
          <span style={{ fontSize: Math.round(valueSize), fontWeight: 850, letterSpacing: -0.5, color, whiteSpace: 'nowrap', lineHeight: 1 }}>{value}</span>
          {asideOn > 0.01 ? (
            <span style={{ fontSize: Math.round(24 * s), fontWeight: 650, color: C.faint, whiteSpace: 'nowrap', opacity: 0.85 * asideOn }}>{aside}</span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

const mixN = (a: number, b: number, t: number) => a + (b - a) * t;
