import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { progress } from '../../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../../engine/src/ui/Icon';
import { tone as toneOf, type Tone } from '../../../../engine/src/ui/tone';

/** A token of a line that lights up from `at` (matched by its exact text, e.g. «wide»). */
export interface Mark {
  tone: Tone;
  at: number;
}

export interface CodeLine {
  text: string;
  /** Frame the line appears (default: always there). */
  at?: number;
  /** 0–1 glow of the whole line in `tone`. */
  lit?: number;
  tone?: Tone;
  /** 0–1 step back. */
  dim?: number;
  marks?: Record<string, Mark>;
}

type Kind = 'kw' | 'str' | 'var' | 'num' | 'hex' | 'com' | 'txt';
interface Tok {
  t: string;
  k: Kind;
}

const KEYWORDS = new Set(['rule', 'meta', 'strings', 'condition', 'and', 'or', 'not', 'of', 'them', 'at', 'filesize', 'ascii', 'wide', 'nocase']);
const COLOR: Record<Kind, string> = {
  kw: '#7dd3fc',
  str: C.cyanSoft,
  var: C.textStrong,
  num: '#fdba74',
  hex: C.cyanSoft,
  com: C.muted,
  txt: C.text,
};

/** Tiny YARA tokenizer, enough for the lines shown in the video (hex strings after «= {» are coloured as bytes). */
export function tokenize(line: string): Tok[] {
  const out: Tok[] = [];
  const re = /(\/\/.*$)|("[^"]*")|(\$\w+)|(\b\d+KB\b|\b\d+\b)|(\b[A-Za-z_]\w*\b)|(\s+)|(.)/g;
  let inHex = false;
  let prev = '';
  for (const m of line.matchAll(re)) {
    const t = m[0];
    if (m[6]) {
      out.push({ t, k: 'txt' });
      continue;
    }
    if (inHex) {
      if (t === '}') inHex = false;
      out.push({ t, k: t === '}' ? 'txt' : 'hex' });
    } else if (m[1]) out.push({ t, k: 'com' });
    else if (m[2]) out.push({ t, k: 'str' });
    else if (m[3]) out.push({ t, k: 'var' });
    else if (m[4]) out.push({ t, k: 'num' });
    else if (m[5]) out.push({ t, k: KEYWORDS.has(t) ? 'kw' : 'txt' });
    else {
      if (t === '{' && prev === '=') inHex = true;
      out.push({ t, k: 'txt' });
    }
    prev = t;
  }
  // `??` arrives as two single characters: glue them so the wildcard reads as one token
  const glued: Tok[] = [];
  for (const tok of out) {
    const last = glued[glued.length - 1];
    if (tok.t === '?' && last?.t === '?' && last.k === 'hex') last.t = '??';
    else glued.push(tok);
  }
  return glued;
}

function Line({ frame, line, size, lineH }: { frame: number; line: CodeLine; size: number; lineH: number }) {
  const p = line.at === undefined ? 1 : progress(frame, line.at, 12);
  if (p <= 0.001) return <div style={{ height: lineH }} />;
  const lit = line.lit ?? 0;
  const lt = toneOf(line.tone ?? 'cyan');
  return (
    <div
      style={{
        height: lineH,
        display: 'flex',
        alignItems: 'center',
        padding: '0 22px',
        whiteSpace: 'pre',
        opacity: p * (1 - 0.6 * (line.dim ?? 0)),
        background: lit > 0 ? alpha(lt.fg, 0.14 * lit) : 'transparent',
        borderLeft: `5px solid ${lit > 0 ? alpha(lt.fg, 0.9 * lit) : 'transparent'}`,
        fontFamily: FONT.mono,
        fontSize: size,
        fontWeight: 600,
        lineHeight: 1,
      }}
    >
      {tokenize(line.text).map((tok, i) => {
        const mark = line.marks?.[tok.t];
        const on = mark ? progress(frame, mark.at, 10) : 0;
        if (mark && on > 0) {
          const mt = toneOf(mark.tone);
          return (
            <span key={i} style={{ padding: '2px 7px', margin: '0 -7px', borderRadius: 8, color: mt.soft, background: alpha(mt.fg, 0.2 * on), boxShadow: `0 0 0 2px ${alpha(mt.fg, 0.75 * on)}` }}>
              {tok.t}
            </span>
          );
        }
        return (
          <span key={i} style={{ color: COLOR[tok.k], fontWeight: tok.k === 'var' ? 800 : 600 }}>
            {tok.t}
          </span>
        );
      })}
    </div>
  );
}

/** Editor-style panel with a title bar and the code lines below it. Frames are relative to the Sequence. */
export function CodeBlock({
  frame,
  lines,
  title,
  icon = 'file',
  chip,
  width,
  size = 30,
  tone = 'cyan',
  lit = 0,
}: {
  frame: number;
  lines: CodeLine[];
  title: string;
  icon?: IconName;
  chip?: ReactNode;
  width: number;
  size?: number;
  tone?: Tone;
  /** 0–1 glow of the panel border. */
  lit?: number;
}) {
  const t = toneOf(tone);
  const lineH = Math.round(size * 1.38);
  return (
    <div
      style={{
        boxSizing: 'border-box',
        width,
        borderRadius: RADIUS.md,
        background: C.ink900,
        border: `2px solid ${alpha(t.fg, 0.4 + 0.5 * lit)}`,
        boxShadow: lit > 0 ? `0 0 ${20 + 24 * lit}px ${alpha(t.fg, 0.3 * lit)}` : 'none',
        overflow: 'hidden',
        fontFamily: FONT.sans,
      }}
    >
      <div style={{ height: 52, display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px', background: alpha(C.ink700, 0.7), borderBottom: `2px solid ${C.ink700}` }}>
        <Icon name={icon} size={30} color={t.fg} />
        <span style={{ fontSize: 28, fontWeight: 800, color: C.textStrong }}>{title}</span>
        {chip ? <span style={{ marginLeft: 'auto' }}>{chip}</span> : null}
      </div>
      <div style={{ padding: '10px 0' }}>
        {lines.map((l, i) => (
          <Line key={i} frame={frame} line={l} size={size} lineH={lineH} />
        ))}
      </div>
    </div>
  );
}

/** Height a CodeBlock takes for `n` lines (title bar + padding), to place things beneath it. */
export function codeHeight(n: number, size = 30): number {
  return 52 + 20 + n * Math.round(size * 1.38) + 4;
}
