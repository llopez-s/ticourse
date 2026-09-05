import type { ReactNode } from 'react';

/**
 * Markdown-lite inline renderer: **bold**, `code`, *italic*.
 * Lesson prose is short paragraphs; no block-level parsing needed here.
 */
export function md(text: string): ReactNode[] {
  return parseCode(text, 0);
}

function parseCode(text: string, keyBase: number): ReactNode[] {
  const out: ReactNode[] = [];
  const parts = text.split(/`([^`]+)`/g);
  parts.forEach((part, i) => {
    if (i % 2 === 1) {
      out.push(
        <code
          key={`c${keyBase}-${i}`}
          className="rounded bg-ink-800 px-1.5 py-0.5 font-mono text-[0.85em] text-cyan-300"
        >
          {part}
        </code>,
      );
    } else {
      out.push(...parseBold(part, keyBase * 100 + i));
    }
  });
  return out;
}

function parseBold(text: string, keyBase: number): ReactNode[] {
  const out: ReactNode[] = [];
  const parts = text.split(/\*\*([^*]+)\*\*/g);
  parts.forEach((part, i) => {
    if (i % 2 === 1) {
      out.push(
        <strong key={`b${keyBase}-${i}`} className="font-semibold text-slate-50">
          {part}
        </strong>,
      );
    } else {
      out.push(...parseItalic(part, keyBase * 100 + i));
    }
  });
  return out;
}

function parseItalic(text: string, keyBase: number): ReactNode[] {
  const out: ReactNode[] = [];
  const parts = text.split(/\*([^*]+)\*/g);
  parts.forEach((part, i) => {
    if (i % 2 === 1) {
      out.push(
        <em key={`i${keyBase}-${i}`} className="text-slate-300">
          {part}
        </em>,
      );
    } else if (part !== '') {
      out.push(part);
    }
  });
  return out;
}
