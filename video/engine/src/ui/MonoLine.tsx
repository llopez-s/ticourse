import type { CSSProperties } from 'react';
import { C, FONT, TYPE } from '../theme/tokens';

/** A coloured run inside a monospace line. `c` defaults to the normal text colour. */
export interface MonoToken {
  t: string;
  c?: string;
  /** Optional background highlight (e.g. a field being extracted). */
  bg?: string;
  bold?: boolean;
}

/**
 * Monospace line built from coloured tokens — used for raw logs, queries and
 * rules. `visibleChars` truncates the line for a typewriter effect (counting
 * across tokens), and `caret` draws a block cursor at the end.
 */
export function MonoLine({
  tokens,
  size = TYPE.small,
  visibleChars,
  caret = false,
  style,
}: {
  tokens: MonoToken[];
  size?: number;
  visibleChars?: number;
  caret?: boolean;
  style?: CSSProperties;
}) {
  let remaining = visibleChars ?? Number.POSITIVE_INFINITY;
  return (
    <div
      style={{
        fontFamily: FONT.mono,
        fontSize: size,
        lineHeight: 1.45,
        color: C.text,
        whiteSpace: 'pre',
        ...style,
      }}
    >
      {tokens.map((token, index) => {
        if (remaining <= 0) return null;
        const text = token.t.slice(0, remaining);
        remaining -= token.t.length;
        return (
          <span
            key={index}
            style={{
              color: token.c ?? C.text,
              background: token.bg,
              borderRadius: token.bg ? 6 : undefined,
              padding: token.bg ? '0 4px' : undefined,
              fontWeight: token.bold ? 700 : 450,
            }}
          >
            {text}
          </span>
        );
      })}
      {caret ? (
        <span
          style={{
            display: 'inline-block',
            width: Math.round(size * 0.55),
            height: Math.round(size * 1.05),
            marginLeft: 2,
            verticalAlign: 'text-bottom',
            background: C.cyan,
          }}
        />
      ) : null}
    </div>
  );
}

/** Total characters in a token list (for typewriter timing). */
export function monoLength(tokens: MonoToken[]): number {
  return tokens.reduce((sum, token) => sum + token.t.length, 0);
}
