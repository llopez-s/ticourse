import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { DECODE, NOT_SQLI, NO_FILTER, S04_NAME } from '../../../data/s04-traversal';

const ROSE_TXT = '#fecdd3';
const AMBER_TXT = '#fde68a';
const VIOLET_TXT = '#c4b5fd';

export const DECODE_W = 860;
export const DECODE_H = 196;
const CELL_W = 150;
const CELL_GAP = 26;
const ENC_Y = 6;
const DEC_Y = 120;

/**
 * `%2e%2e%2f` decoded character by character: three cells (`%2e`, `%2e`, `%2f`), each with a short
 * drawn arrow down to what it means (`.`, `.`, `/`), and «la misma nota, codificada» beside them.
 * `show` brings the encoded cells in, `pairs[k]` (0–1) decodes cell k, `label` writes the caption.
 */
export function DecodeStrip({ show, pairs, label }: { show: number; pairs: readonly number[]; label: number }) {
  const cellsW = 3 * CELL_W + 2 * CELL_GAP;
  const decoded = pairs.reduce((s, p) => s + p, 0) / pairs.length;
  return (
    <div style={{ position: 'relative', width: DECODE_W, height: DECODE_H, fontFamily: FONT.mono, opacity: show, transform: `translateY(${(1 - show) * 14}px)` }}>
      {DECODE.pairs.map((pair, k) => {
        const p = pairs[k] ?? 0;
        const x = k * (CELL_W + CELL_GAP);
        return (
          <div key={k}>
            <div
              style={{
                position: 'absolute',
                left: x,
                top: ENC_Y,
                width: CELL_W,
                height: 70,
                display: 'grid',
                placeItems: 'center',
                borderRadius: 12,
                background: alpha(C.rose, 0.1 + 0.08 * p),
                border: `2px solid ${alpha(C.rose, 0.45 + 0.4 * p)}`,
                fontSize: 50,
                fontWeight: 800,
                color: ROSE_TXT,
              }}
            >
              {pair.enc}
            </div>
            <svg width={CELL_W} height={44} style={{ position: 'absolute', left: x, top: ENC_Y + 72, overflow: 'visible', opacity: p }}>
              <line x1={CELL_W / 2} y1={4} x2={CELL_W / 2} y2={4 + 26 * p} stroke={C.roseSoft} strokeWidth={4} strokeLinecap="round" />
              <polygon points={`${CELL_W / 2 - 9},${28 + 4 * p} ${CELL_W / 2 + 9},${28 + 4 * p} ${CELL_W / 2},${40}`} fill={C.roseSoft} opacity={p > 0.6 ? 1 : 0} />
            </svg>
            <div
              style={{
                position: 'absolute',
                left: x,
                top: DEC_Y,
                width: CELL_W,
                height: 70,
                display: 'grid',
                placeItems: 'center',
                borderRadius: 12,
                background: alpha(C.rose, 0.22 * p),
                border: `2px solid ${alpha(C.rose, 0.9 * p)}`,
                fontSize: 76,
                lineHeight: 1,
                fontWeight: 800,
                color: ROSE_TXT,
                opacity: p,
                transform: `translateY(${(1 - p) * -14}px)`,
              }}
            >
              {pair.dec === '.' ? <span style={{ width: 18, height: 18, borderRadius: 9, background: ROSE_TXT }} /> : pair.dec}
            </div>
          </div>
        );
      })}
      {/* Joined: the three characters read as `../` */}
      <div
        style={{
          position: 'absolute',
          left: cellsW + 34,
          top: DEC_Y - 2,
          height: 74,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          whiteSpace: 'nowrap',
          opacity: decoded > 0.99 ? 1 : 0,
        }}
      >
        <span style={{ fontSize: 30, color: C.faint, fontFamily: FONT.sans, fontWeight: 700 }}>=</span>
        <span style={{ fontSize: 56, fontWeight: 800, color: ROSE_TXT }}>../</span>
      </div>
      {label > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: cellsW + 34,
            top: ENC_Y + 6,
            fontFamily: FONT.sans,
            fontSize: 40,
            fontWeight: 800,
            color: C.textStrong,
            whiteSpace: 'nowrap',
            opacity: label,
            transform: `translateX(${(1 - label) * 14}px)`,
          }}
        >
          {DECODE.label}
        </div>
      ) : null}
    </div>
  );
}

export const NOTE403_W = 820;

/**
 * «403: el servidor no puede leer `shadow` · no es un filtro», in two lines, with `shadow` in
 * monospace. `file` (0–1) lights `shadow`, `filter` (0–1) lights «no es un filtro».
 */
export function NoFilterNote({ show, file, filter }: { show: number; file: number; filter: number }) {
  return (
    <div
      style={{
        width: NOTE403_W,
        boxSizing: 'border-box',
        padding: '18px 26px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.amber, 0.7)}`,
        background: `linear-gradient(180deg, ${alpha(C.amberDeep, 0.45)} 0%, ${alpha(C.ink900, 0.95)} 100%)`,
        boxShadow: `0 20px 44px ${alpha('#000000', 0.4)}`,
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
        opacity: show,
        transform: `translateY(${(1 - show) * 14}px)`,
      }}
    >
      <div style={{ fontSize: 38, fontWeight: 800, color: AMBER_TXT, lineHeight: 1.3 }}>
        {NO_FILTER.lead}
        <span
          style={{
            fontFamily: FONT.mono,
            fontWeight: 800,
            color: file > 0.5 ? ROSE_TXT : AMBER_TXT,
            padding: '0 6px',
            borderRadius: 8,
            background: alpha(C.rose, 0.18 * file),
            boxShadow: file > 0 ? `0 0 0 2px ${alpha(C.rose, 0.8 * file)}` : undefined,
          }}
        >
          {NO_FILTER.file}
        </span>
      </div>
      <div style={{ fontSize: 38, fontWeight: 800, lineHeight: 1.3, color: filter > 0.5 ? C.textStrong : C.text }}>
        <span style={{ color: C.faint }}>{NO_FILTER.sep.trim()} </span>
        <span
          style={{
            padding: '0 8px',
            borderRadius: 8,
            background: alpha(C.amber, 0.18 * filter),
            boxShadow: filter > 0 ? `0 0 0 2px ${alpha(C.amber, 0.8 * filter)}` : undefined,
          }}
        >
          {NO_FILTER.rest}
        </span>
      </div>
    </div>
  );
}

/**
 * The exam name (violet) and the struck trap under it: only «inyección» is struck through; the reason
 * («no cuela código, solo cambia la ruta») stays readable. `name`, `note`, `strike` are 0–1.
 */
export function TraversalName({ name, note, strike, width }: { name: number; note: number; strike: number; width: number }) {
  return (
    <div style={{ position: 'relative', width, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
      {name > 0 ? (
        <div style={{ opacity: name, transform: `translateY(${(1 - name) * 12}px)` }}>
          <div style={{ display: 'inline-block', fontSize: 56, fontWeight: 850, letterSpacing: 1.5, color: VIOLET_TXT, textShadow: `0 0 24px ${alpha(C.violet, 0.45 * name)}` }}>
            {S04_NAME}
          </div>
          <div style={{ marginTop: 4, width: 640 * name, height: 3, borderRadius: 2, background: alpha(C.violet, 0.7) }} />
        </div>
      ) : null}
      {note > 0 ? (
        <div style={{ marginTop: 16, fontSize: 34, fontWeight: 700, color: C.text, opacity: note, transform: `translateY(${(1 - note) * 10}px)` }}>
          <span style={{ position: 'relative', color: strike > 0.5 ? C.faint : C.roseSoft }}>
            {NOT_SQLI.term}
            <span
              style={{
                position: 'absolute',
                left: -4,
                top: '54%',
                height: 5,
                width: `calc((100% + 8px) * ${strike})`,
                borderRadius: 3,
                background: C.rose,
              }}
            />
          </span>
          <span style={{ color: C.faint }}>{NOT_SQLI.sep}</span>
          <span>{NOT_SQLI.rest}</span>
        </div>
      ) : null}
    </div>
  );
}
