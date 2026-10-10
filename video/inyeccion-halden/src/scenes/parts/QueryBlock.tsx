import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { Icon } from '../../../../engine/src/ui';
import { clamp01 } from '../../../../engine/src/ui';
import { PAYLOAD, QUERY } from '../../data/query';

/** Indices of the payload's three parts (see data/query.ts: «'», « OR 1=1», « --»). */
const QUOTE = [0, 1] as const;
const ALWAYS = [1, 8] as const;
const COMMENT = [8, 11] as const;

/** Two overlaid copies of a text: `base` colour, and `lit` fading in (no colour maths). */
function Mix({ text, base, lit, w, bg, bold, strike }: { text: string; base: string; lit: string; w: number; bg?: string; bold?: boolean; strike?: number }) {
  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        whiteSpace: 'pre',
        background: bg,
        borderRadius: bg ? 6 : undefined,
        fontWeight: bold ? 800 : undefined,
        textDecoration: strike && strike > 0.5 ? 'line-through' : undefined,
        textDecorationColor: C.faint,
        textDecorationThickness: 3,
      }}
    >
      <span style={{ color: base }}>{text}</span>
      <span style={{ position: 'absolute', left: 0, top: 0, color: lit, opacity: w }}>{text}</span>
    </span>
  );
}

export interface QueryState {
  /** Characters of the payload typed into the name slot (0 = the `<input>` placeholder shows). */
  typed: number;
  /** 0–1: the password slot is left empty (the placeholder goes, `''` stays). */
  emptyPass: number;
  /** 0–1 each: the payload's quote / « OR 1=1» / « --» are read as part of the order (cyan to white, marked). */
  quote: number;
  always: number;
  comment: number;
  /** 0–1: the name slot is the only thing lit, the rest of the query steps back. */
  hole: number;
  /** 0–1: the whole query is shown as the corrected one (`?` instead of the slots). */
  params: number;
  /** 0–1: the `?` marks glow. */
  marks: number;
  /** 0–1: the name mark holds the person's text, inside its box (it stays a datum). */
  boxFill?: number;
}

export const QUERY_REST: QueryState = { typed: 0, emptyPass: 0, quote: 0, always: 0, comment: 0, hole: 0, params: 0, marks: 0 };

/** Pixel height of the three query lines. */
export function queryHeight(size: number): number {
  return Math.round(size * 1.5 * 3);
}

/**
 * The lesson's query as three mono lines: the program in white, the person's text in cyan. In the vulnerable form
 * the two slots are `<input>` placeholders; the payload types into the name slot and, as the voice names its parts,
 * the quote, the always-true condition and the comment turn white (they are part of the order now) and the rest of
 * the line, the password included, is struck in grey. In the corrected form (`params`) the slots are `?` marks.
 * Strings live in data/query.ts; this part only paints them.
 */
export function QueryBlock({ state, size = 40, style }: { state: QueryState; size?: number; style?: CSSProperties }) {
  const s = state;
  const line: CSSProperties = { height: Math.round(size * 1.5), display: 'flex', alignItems: 'center', whiteSpace: 'pre' };
  const dimOthers = 1 - 0.62 * clamp01(s.hole);
  const pay = PAYLOAD.slice(0, s.typed);
  const typing = s.typed > 0;
  const struck = clamp01(s.comment);

  const part = (from: number, to: number, w: number, extra?: { bg?: string; strike?: number; lit?: string }) => {
    const text = pay.slice(from, to);
    if (!text) return null;
    return <Mix text={text} base={C.cyan} lit={extra?.lit ?? C.textStrong} w={w} bg={extra?.bg} bold={w > 0.5} />;
  };
  const rest = (n: string) => <Mix text={n} base={C.textStrong} lit={C.faint} w={struck} strike={struck} />;

  const mark = (filled: boolean) => (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: Math.round(size * 0.95),
        height: Math.round(size * 1.05),
        padding: filled ? '0 12px' : 0,
        boxSizing: 'border-box',
        borderRadius: 10,
        background: alpha(C.amber, 0.14 + 0.2 * s.marks),
        border: `3px solid ${alpha(C.amber, 0.55 + 0.45 * s.marks)}`,
        boxShadow: s.marks > 0.02 ? `0 0 ${Math.round(24 * s.marks)}px ${alpha(C.amber, 0.45 * s.marks)}` : undefined,
        color: filled ? C.cyan : C.amber,
        fontWeight: filled ? 700 : 850,
        fontSize: filled ? Math.round(size * 0.8) : size,
        whiteSpace: 'pre',
      }}
    >
      {filled ? PAYLOAD : '?'}
    </span>
  );

  const slotPlaceholder = (
    <span
      style={{
        color: C.cyan,
        background: alpha(C.cyan, 0.1 + 0.14 * s.hole),
        borderBottom: `3px dashed ${alpha(C.cyan, 0.7)}`,
        boxShadow: s.hole > 0.02 ? `0 0 ${Math.round(26 * s.hole)}px ${alpha(C.cyan, 0.5 * s.hole)}` : undefined,
        borderRadius: 6,
        padding: '0 4px',
      }}
    >
      {QUERY.slot}
    </span>
  );

  const nameSlot: ReactNode =
    s.params > 0.5 ? mark((s.boxFill ?? 0) > 0.5) : typing ? (
      <>
        {part(QUOTE[0], QUOTE[1], s.quote, { bg: s.quote > 0.05 ? alpha(C.amber, 0.28 * s.quote) : undefined })}
        {part(ALWAYS[0], ALWAYS[1], s.always, { bg: s.always > 0.05 ? alpha(C.amber, 0.22 * s.always) : undefined })}
        {part(COMMENT[0], COMMENT[1], s.comment, { bg: s.comment > 0.05 ? alpha(C.rose, 0.25 * s.comment) : undefined, lit: C.roseSoft })}
      </>
    ) : (
      slotPlaceholder
    );

  const passSlot: ReactNode = s.params > 0.5 ? mark(false) : s.emptyPass > 0.5 ? null : slotPlaceholder;

  return (
    <div style={{ fontFamily: FONT.mono, fontSize: size, fontWeight: 560, color: C.textStrong, ...style }}>
      <div style={{ ...line, opacity: dimOthers }}>{QUERY.l1}</div>
      <div style={line}>
        <span style={{ opacity: dimOthers }}>{s.params > 0.5 ? QUERY.l2ParamHead : QUERY.l2Head}</span>
        {nameSlot}
        {s.params > 0.5 ? null : <span style={{ opacity: dimOthers }}>{rest(QUERY.quote)}</span>}
      </div>
      <div style={{ ...line, opacity: dimOthers }}>
        {rest(s.params > 0.5 ? QUERY.l3ParamHead : QUERY.l3Head)}
        {passSlot}
        {s.params > 0.5 ? null : rest(QUERY.quote)}
      </div>
    </div>
  );
}

/** A callout under a part of the query: a short vertical tick and a 32 px label. */
export function QueryNote({ x, text, tone, show, width = 420 }: { x: number; text: string; tone: string; show: number; width?: number }) {
  return (
    <div style={{ position: 'absolute', left: x, top: 0, width, opacity: show, transform: `translateY(${(1 - show) * 8}px)` }}>
      <div style={{ width: 3, height: 22, marginLeft: 20, background: alpha(tone, 0.8) }} />
      <div style={{ fontFamily: FONT.sans, fontSize: 32, fontWeight: 750, color: tone, whiteSpace: 'nowrap' }}>{text}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------------------------

/** The `users` table the trucada query returns whole: every row lights. */
export function RowsTable({ rows, show, lit, width = 560 }: { rows: readonly { id: number; name: string }[]; show: number; lit: number; width?: number }) {
  return (
    <div
      style={{
        width,
        borderRadius: 18,
        overflow: 'hidden',
        background: C.ink900,
        border: `2px solid ${alpha(C.rose, 0.3 + 0.5 * lit)}`,
        boxShadow: lit > 0.02 ? `0 0 ${Math.round(34 * lit)}px ${alpha(C.rose, 0.25 * lit)}` : undefined,
        opacity: show,
        transform: `translateY(${(1 - show) * 14}px)`,
        fontFamily: FONT.mono,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 54, padding: '0 20px', background: alpha(C.ink800, 0.95), borderBottom: `2px solid ${C.ink700}` }}>
        <Icon name="database" size={30} color={C.cyan} />
        <span style={{ fontSize: 30, fontWeight: 700, color: C.text }}>users</span>
      </div>
      {rows.map((r, i) => {
        const k = clamp01(lit * 1.6 - i * 0.18);
        return (
          <div
            key={r.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              height: 46,
              padding: '0 20px',
              background: alpha(C.rose, 0.16 * k),
              borderBottom: i < rows.length - 1 ? `1px solid ${C.ink700}` : undefined,
              fontSize: 32,
              color: k > 0.4 ? C.textStrong : C.muted,
            }}
          >
            <span style={{ color: C.faint, width: 28 }}>{r.id}</span>
            <span>{r.name}</span>
          </div>
        );
      })}
    </div>
  );
}
