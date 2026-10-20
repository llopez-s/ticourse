import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { enter, progress } from '../../../../../engine/src/theme/motion';
import { Icon } from '../../../../../engine/src/ui';
import { KEYS, RULE } from '../../../data/s04-nube';
import { Arrow } from '../Arrow';
import { TermPill } from '../Labels';

export const LIST_W = 1288;
export const LIST_H = 330;
const COLS = 2;
const ROW_H = 50;
const ROW_Y0 = 74;
const COL_W = (LIST_W - 60) / COLS;
/** Grey bar widths (no names). */
const BARS = [210, 170, 240, 190, 150, 230, 180, 200, 160, 220];

/**
 * The example key list of s04-08 (`sprawl`): a dashed tag «ejemplo · lado del cliente · no es el registro del puerto»,
 * then cloud access keys in two columns — a key icon and a grey bar each (no names, no dates, no count) — many greyed
 * with «ya no está», several with «administrador» (amber); rows come in quickly and the last ones fade (there are more).
 * «IAM sprawl» lands top-right on its word.
 */
export function KeyList({ frame, at, keysAt, termAt }: { frame: number; at: number; keysAt: number; termAt: number }) {
  const inS = enter(frame, at, { distance: 18 });
  return (
    <div style={{ position: 'relative', width: LIST_W, height: LIST_H, fontFamily: FONT.sans, ...inS }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: RADIUS.lg,
          border: `2px solid ${alpha(C.cyan, 0.4)}`,
          background: alpha(C.ink850, 0.92),
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 22,
          top: 16,
          display: 'inline-flex',
          alignItems: 'center',
          height: 42,
          padding: '0 18px',
          borderRadius: RADIUS.pill,
          border: `2px dashed ${alpha(C.muted, 0.6)}`,
          fontSize: 26,
          fontWeight: 650,
          color: C.muted,
          whiteSpace: 'nowrap',
        }}
      >
        {KEYS.tag}
      </div>
      {frame >= termAt - 4 ? (
        <div style={{ position: 'absolute', right: 20, top: 8, ...enter(frame, termAt, { distance: 12 }) }}>
          <TermPill text={KEYS.term} size={34} on={progress(frame, termAt, 10)} />
        </div>
      ) : null}
      {KEYS.rows.map((kind, i) => {
        const c = i % COLS;
        const r = Math.floor(i / COLS);
        const show = progress(frame, keysAt - 10 + i * 3, 10);
        const fade = r >= 4 ? 0.35 : r === 3 ? 0.7 : 1;
        const gone = kind === 'gone';
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 30 + c * COL_W,
              top: ROW_Y0 + r * ROW_H,
              width: COL_W - 30,
              height: ROW_H - 8,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              opacity: show * fade,
            }}
          >
            <Icon name="key" size={32} color={gone ? C.faint : C.cyan} />
            <div style={{ width: BARS[i], height: 14, borderRadius: 7, background: alpha(gone ? C.muted : C.text, gone ? 0.22 : 0.4) }} />
            {kind === 'admin' ? (
              <span style={{ fontSize: 28, fontWeight: 800, color: '#fcd34d', padding: '2px 14px', borderRadius: RADIUS.pill, border: `2px solid ${alpha(C.amber, 0.7)}`, background: alpha(C.amber, 0.1) }}>{KEYS.admin}</span>
            ) : null}
            {gone ? <span style={{ fontSize: 28, fontWeight: 700, color: C.faint, fontStyle: 'italic' }}>{KEYS.gone}</span> : null}
          </div>
        );
      })}
      <div style={{ position: 'absolute', left: 2, right: 2, bottom: 2, height: 70, borderRadius: `0 0 ${RADIUS.lg}px ${RADIUS.lg}px`, background: `linear-gradient(180deg, ${alpha(C.ink850, 0)} 0%, ${alpha(C.ink850, 0.95)} 100%)` }} />
    </div>
  );
}

export const RULE_W = 400;

/** The rule of the gap: «en la duda:» / configuración, datos / o identidades / a drawn arrow / «del cliente». */
export function GapRule({ frame, at }: { frame: number; at: number }) {
  if (frame < at - 4) return null;
  const e = enter(frame, at, { distance: 16 });
  const arrow = progress(frame, at + 10, 12);
  const who = progress(frame, at + 18, 10);
  return (
    <div
      style={{
        position: 'relative',
        width: RULE_W,
        boxSizing: 'border-box',
        padding: '20px 26px 22px',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(C.cyan, 0.6)}`,
        background: alpha(C.cyan, 0.07),
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
        ...e,
      }}
    >
      <div style={{ fontSize: 32, fontWeight: 700, color: C.muted }}>{RULE.lead}</div>
      {RULE.what.map((l) => (
        <div key={l} style={{ fontSize: 34, fontWeight: 800, color: C.textStrong, lineHeight: 1.25 }}>
          {l}
        </div>
      ))}
      <svg width={60} height={50} style={{ display: 'block', margin: '6px 0 4px 10px', overflow: 'visible' }}>
        <Arrow points={[[20, 4], [20, 44]]} draw={arrow} color={C.cyan} width={5} />
      </svg>
      <div style={{ fontSize: 40, fontWeight: 900, color: C.cyanSoft, opacity: who }}>{RULE.who}</div>
    </div>
  );
}
