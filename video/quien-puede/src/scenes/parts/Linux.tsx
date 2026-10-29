import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01, type IconName } from '../../../../engine/src/ui';
import { AccountCard } from './AccountCard';
import type { LsParts } from './data';
import { Pencil } from './People';

/** Linux pieces (s09 only): the `ls -l` line, the three class cards and the three-question decision. */

const GOOD = '#6ee7b7';

/** Colour of one permission character: letters are granted (emerald), dashes are nothing (faint). */
function charColor(ch: string, type = false): string {
  if (type) return ch === 'd' ? C.sky : C.faint;
  return ch === '-' ? C.faint : GOOD;
}

const BLOCK_PAD = 9; // px each side of a block (padding 6 + border 3)

/** x-extent of block `i` (0 owner, 1 group, 2 rest) inside an LsLine of `size` px with the given `spread`. */
export function lsBlockSpan(size: number, spread: number, i: number): { left: number; width: number } {
  const cw = size * 0.6;
  const g = clamp01(spread) * size * 0.45;
  const width = 3 * cw + 2 * BLOCK_PAD;
  return { left: cw + g + i * (width + g), width };
}

export const lsLineWidth = (size: number, spread: number, tail: string) => lsBlockSpan(size, spread, 2).left + lsBlockSpan(size, spread, 2).width + tail.length * size * 0.6;

/**
 * The `ls -l` line, cut in its type character, the three blocks of three letters and the tail. `lit` (0–1 each) outlines a
 * block in cyan (the rest, which grants nothing, in rose); `spread` 0–1 opens a gap between the blocks so the three can be
 * labelled one by one; `x` (0–1) lights the `x` characters (s09 `x-bit`); `tailOn` dims the tail when it is not the point.
 */
export function LsLine({
  parts,
  size = 56,
  lit = {},
  spread = 0,
  x = 0,
  tailOn = 1,
  style,
}: {
  parts: LsParts;
  size?: number;
  lit?: { owner?: number; group?: number; rest?: number };
  spread?: number;
  x?: number;
  tailOn?: number;
  style?: CSSProperties;
}) {
  const g = clamp01(spread) * size * 0.45;
  const block = (key: 'owner' | 'group' | 'rest', text: string) => {
    const l = clamp01(lit[key] ?? 0);
    const tone = key === 'rest' ? C.rose : C.cyan;
    return (
      <span
        key={key}
        style={{
          display: 'inline-block',
          marginLeft: g,
          padding: `0 ${BLOCK_PAD - 3}px`,
          borderRadius: 12,
          border: `3px solid ${alpha(tone, 0.85 * l)}`,
          background: alpha(tone, 0.14 * l),
          boxShadow: l > 0.02 ? `0 0 ${Math.round(26 * l)}px ${alpha(tone, 0.32 * l)}` : undefined,
          lineHeight: 1.18,
        }}
      >
        {text.split('').map((ch, i) => {
          const isX = ch === 'x' && x > 0.01;
          return (
            <span key={i} style={{ color: isX ? C.amber : charColor(ch), fontWeight: ch === '-' ? 500 : 800, textShadow: isX ? `0 0 ${Math.round(18 * x)}px ${alpha(C.amber, 0.8 * x)}` : undefined }}>
              {ch}
            </span>
          );
        })}
      </span>
    );
  };
  return (
    <div style={{ fontFamily: FONT.mono, fontSize: size, whiteSpace: 'pre', display: 'flex', alignItems: 'center', letterSpacing: 0, ...style }}>
      <span style={{ color: charColor(parts.type, true), fontWeight: 800, lineHeight: 1.18 }}>{parts.type}</span>
      {block('owner', parts.owner)}
      {block('group', parts.group)}
      {block('rest', parts.rest)}
      <span style={{ color: C.text, opacity: 0.35 + 0.65 * clamp01(tailOn), lineHeight: 1.18 }}>{parts.tail}</span>
    </div>
  );
}

/** The three boxes a class has: read, write, execute (icon first, then the letter, then granted / not granted). */
const BOXES: { word: string; letter: string; icon: IconName | 'pencil' }[] = [
  { word: 'leer', letter: 'r', icon: 'eye' },
  { word: 'escribir', letter: 'w', icon: 'pencil' },
  { word: 'ejecutar', letter: 'x', icon: 'play' },
];

export type ClassKind = 'owner' | 'group' | 'rest';
const CLASS_ICON: Record<ClassKind, IconName> = { owner: 'user', group: 'users', rest: 'globe' };

/**
 * A class of Linux as a card: «dueño» / «grupo» / «resto», a mono caption and its three boxes. `boxes` 0–1 draws the boxes
 * (empty, with their icon), `letters` 0–1 turns the icons into r / w / x, and `stateOn` 0–1 applies `state`
 * ([r, w, x] granted or not: granted ones go emerald, the others become a dash).
 */
export function ClassCard({
  kind,
  word,
  sub,
  width = 520,
  show = 1,
  boxes = 0,
  letters = 0,
  state,
  stateOn = 0,
  on = 0,
  dim = 0,
  tone,
}: {
  kind: ClassKind;
  word: string;
  sub: string;
  width?: number;
  show?: number;
  boxes?: number;
  letters?: number;
  state?: readonly [boolean, boolean, boolean];
  stateOn?: number;
  on?: number;
  dim?: number;
  tone?: string;
}) {
  const s = clamp01(show);
  const b = clamp01(boxes);
  const lt = clamp01(letters);
  const so = clamp01(stateOn);
  const g = clamp01(on);
  const d = clamp01(dim);
  const col = tone ?? C.cyan;
  return (
    <div
      style={{
        width,
        boxSizing: 'border-box',
        padding: '22px 28px 20px',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(col, 0.4 + 0.5 * g)}`,
        background: `linear-gradient(180deg, ${alpha(col, 0.08 + 0.06 * g)}, ${alpha(C.ink900, 0.96)} 70%)`,
        boxShadow: g > 0.02 ? `0 0 ${Math.round(34 * g)}px ${alpha(col, 0.3 * g)}` : undefined,
        fontFamily: FONT.sans,
        opacity: s * (1 - 0.55 * d),
        filter: d > 0.01 ? `saturate(${1 - 0.5 * d})` : undefined,
        transform: `translateY(${(1 - s) * 20}px)`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Icon name={CLASS_ICON[kind]} size={50} color={col} strokeWidth={2} />
        <span style={{ fontSize: 52, fontWeight: 850, letterSpacing: -1, color: C.textStrong }}>{word}</span>
      </div>
      <div style={{ fontFamily: FONT.mono, fontSize: 30, color: C.muted, marginTop: 4, whiteSpace: 'nowrap' }}>{sub}</div>
      <div style={{ display: 'flex', gap: 22, marginTop: 18, opacity: b, transform: `translateY(${(1 - b) * 12}px)` }}>
        {BOXES.map((bx, i) => {
          const allowed = state ? state[i] : true;
          const applied = so > 0.5;
          const ok = applied && allowed;
          const no = applied && !allowed;
          const c = ok ? C.emerald : no ? C.faint : col;
          const showLetter = lt > 0.5;
          return (
            <div key={bx.word} style={{ width: 128, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 108,
                  height: 108,
                  boxSizing: 'border-box',
                  borderRadius: 18,
                  display: 'grid',
                  placeItems: 'center',
                  border: `3px ${no ? 'dashed' : 'solid'} ${alpha(c, no ? 0.5 : 0.85)}`,
                  background: alpha(c, ok ? 0.22 : no ? 0.03 : 0.1),
                  boxShadow: ok ? `0 0 22px ${alpha(C.emerald, 0.3)}` : undefined,
                }}
              >
                {showLetter ? (
                  <span style={{ fontFamily: FONT.mono, fontSize: 68, fontWeight: 800, color: no ? C.faint : ok ? GOOD : C.textStrong, opacity: 0.35 + 0.65 * lt }}>{no ? '-' : bx.letter}</span>
                ) : bx.icon === 'pencil' ? (
                  <Pencil size={54} color={c} strokeWidth={2} />
                ) : (
                  <Icon name={bx.icon} size={54} color={c} strokeWidth={2} />
                )}
              </div>
              <span style={{ fontSize: 28, fontWeight: 700, color: no ? C.faint : C.muted, whiteSpace: 'nowrap' }}>{bx.word}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Geometry of DecisionSteps (px, relative to its own top-left). */
export const STEPS = { nodeW: 470, nodeH: 190, gap: 144, nodeTop: 118, width: 3 * 470 + 2 * 144, height: 118 + 190 + 130 } as const;
const STEP_TEXT = ['¿eres el dueño?', '¿estás en el grupo?', 'eres el resto'] as const;

/**
 * The decision of Linux: three questions asked in order, and it stops at the first yes. A token walks along them
 * (`token` is a float 0–2, `tokenOn` its weight). `no[i]` (0–1) draws the «no» exit of step i; `hit` (0–1) lights the step the
 * token ends in (rose here: the rest has `---`); `result` (0–1) shows what that step gives. The permission block of each
 * step is written under its question, so the steps tie back to the line.
 */
export function DecisionSteps({
  parts,
  show,
  no,
  hit,
  result,
  token,
  tokenOn,
  tokenLabel,
  resultText = 'sin leer',
}: {
  parts: LsParts;
  show: readonly [number, number, number];
  no: readonly [number, number];
  hit: number;
  result: number;
  token: number;
  tokenOn: number;
  tokenLabel: string;
  resultText?: string;
}) {
  const { nodeW, nodeH, gap, nodeTop } = STEPS;
  const blocks = [parts.owner, parts.group, parts.rest];
  const midY = nodeTop + nodeH / 2;
  const h = clamp01(hit);
  const r = clamp01(result);
  return (
    <div style={{ position: 'relative', width: STEPS.width, height: STEPS.height, fontFamily: FONT.sans }}>
      <svg width={STEPS.width} height={STEPS.height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
        {[0, 1].map((i) => {
          const x1 = i * (nodeW + gap) + nodeW;
          const x2 = x1 + gap;
          const w = clamp01(no[i]);
          return (
            <g key={i} opacity={w}>
              <path d={`M${x1 + 6} ${midY} H${x1 + 6 + (gap - 22) * w}`} stroke={alpha(C.rose, 0.85)} strokeWidth={6} strokeLinecap="round" fill="none" />
              <path d={`M${x2 - 24} ${midY - 14} L${x2 - 8} ${midY} L${x2 - 24} ${midY + 14}`} stroke={alpha(C.rose, 0.85)} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>
          );
        })}
      </svg>
      {[0, 1].map((i) => (
        <div key={i} style={{ position: 'absolute', left: i * (nodeW + gap) + nodeW, top: midY - 62, width: gap, textAlign: 'center', fontSize: 40, fontWeight: 850, color: C.roseSoft, opacity: clamp01(no[i]) }}>
          no
        </div>
      ))}
      {STEP_TEXT.map((text, i) => {
        const s = clamp01(show[i]);
        const last = i === 2;
        const lit = last ? h : 0;
        const tone = last ? C.rose : C.cyan;
        return (
          <div
            key={text}
            style={{
              position: 'absolute',
              left: i * (nodeW + gap),
              top: nodeTop,
              width: nodeW,
              height: nodeH,
              boxSizing: 'border-box',
              padding: '18px 26px',
              borderRadius: RADIUS.lg,
              border: `${lit > 0.3 ? 4 : 3}px solid ${alpha(tone, 0.45 + 0.5 * lit)}`,
              background: `linear-gradient(180deg, ${alpha(tone, 0.08 + 0.1 * lit)}, ${alpha(C.ink900, 0.96)} 75%)`,
              boxShadow: lit > 0.02 ? `0 0 ${Math.round(38 * lit)}px ${alpha(tone, 0.34 * lit)}` : undefined,
              opacity: s,
              transform: `translateY(${(1 - s) * 18}px)`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ width: 52, height: 52, borderRadius: 26, flexShrink: 0, display: 'grid', placeItems: 'center', fontSize: 32, fontWeight: 850, color: C.ink950, background: tone }}>{i + 1}</span>
              <span style={{ fontSize: last ? 50 : 42, fontWeight: 850, letterSpacing: -0.5, color: C.textStrong, whiteSpace: 'nowrap' }}>{text}</span>
            </div>
            <div style={{ marginTop: 22, fontFamily: FONT.mono, fontSize: 56, fontWeight: 800, letterSpacing: 2, textAlign: 'center' }}>
              {blocks[i].split('').map((ch, k) => (
                <span key={k} style={{ color: charColor(ch) }}>
                  {ch}
                </span>
              ))}
            </div>
          </div>
        );
      })}
      {/* what the step it stops at gives */}
      <div
        style={{
          position: 'absolute',
          left: 2 * (nodeW + gap),
          top: nodeTop + nodeH + 22,
          width: nodeW,
          display: 'flex',
          justifyContent: 'center',
          opacity: r,
          transform: `translateY(${(1 - r) * 14}px)`,
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14, height: 70, padding: '0 28px', boxSizing: 'border-box', borderRadius: RADIUS.pill, border: `3px solid ${alpha(C.rose, 0.85)}`, background: alpha(C.rose, 0.14), fontSize: 44, fontWeight: 850, color: C.roseSoft, whiteSpace: 'nowrap' }}>
          <Icon name="x" size={40} color={C.rose} strokeWidth={2.8} />
          {resultText}
        </span>
      </div>
      {/* the token walking along the steps */}
      <div style={{ position: 'absolute', left: token * (nodeW + gap) + nodeW / 2 - 200, top: 0, opacity: clamp01(tokenOn) }}>
        <AccountCard compact label={tokenLabel} width={400} />
      </div>
    </div>
  );
}
