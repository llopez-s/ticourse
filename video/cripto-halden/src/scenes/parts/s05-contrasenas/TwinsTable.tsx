import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01, mix } from '../../../../../engine/src/ui';
import { S05 } from '../../../data/s05-contrasenas';
import { HashLine, SaltGrain } from '../Fingerprint';
import { PasswordDots } from './Login';

/**
 * s05's example table («ejemplo · así no»): two different accounts, the same password, the same
 * fingerprint. With the answer, a «sal» column opens between password and fingerprint (a random
 * value per account, stored next to its fingerprint) and the two fingerprints flip to different
 * values. Not positioned; width = twinsTableWidth(salt). All states 0–1.
 */

/** Column widths; exported so the scene can place labels beside the cells. */
export const TWINS_COL = { account: 230, pass: 380, salt: 230, print: 420 } as const;
const COL = TWINS_COL;
/** Width of the masked-password chip in the pass column. */
export const TWINS_DOTS_W = 6 * 14 + 5 * 10 + 2 * 17 + 6;
export const TWINS_HEADER_H = 58;
export const TWINS_ROW_H = 96;
export const TWINS_H = TWINS_HEADER_H + 2 * TWINS_ROW_H + 6;

export function twinsTableWidth(salt: number): number {
  return COL.account + COL.pass + COL.salt * clamp01(salt) + COL.print + 6;
}

export function TwinsTable({
  show,
  salt,
  passMark,
  printMark,
  answer,
  answerMark,
}: {
  show: number;
  /** 0–1: the «sal» column opens and its values type in. */
  salt: number;
  /** 0–1: both passwords ringed amber («la misma»). */
  passMark: number;
  /** 0–1: both fingerprints ringed amber (twins). */
  printMark: number;
  /** 0–1: the fingerprints flip to the salted values. */
  answer: number;
  /** 0–1: the salted fingerprints ringed emerald (different). */
  answerMark: number;
}) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  const sl = clamp01(salt);
  const ans = clamp01(answer);
  const w = twinsTableWidth(sl);
  const saltW = COL.salt * sl;
  const headStyle = { fontSize: 28, fontWeight: 750, color: C.muted, whiteSpace: 'nowrap' as const };
  return (
    <div
      style={{
        position: 'relative',
        width: w,
        height: TWINS_H,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(ans > 0.5 ? C.emerald : C.amber, 0.55)}`,
        background: alpha(C.ink900, 0.96),
        boxShadow: `0 20px 50px ${alpha('#000000', 0.4)}`,
        fontFamily: FONT.sans,
        overflow: 'hidden',
        opacity: s,
        transform: `translateY(${(1 - s) * 18}px)`,
      }}
    >
      {/* Header */}
      <div style={{ height: TWINS_HEADER_H, display: 'flex', alignItems: 'center', background: alpha(C.ink800, 0.9), borderBottom: `2px solid ${C.ink700}` }}>
        <div style={{ width: COL.account, paddingLeft: 26, ...headStyle }}>{S05.table.cols.account}</div>
        <div style={{ width: COL.pass, paddingLeft: 10, ...headStyle }}>{S05.table.cols.pass}</div>
        <div style={{ width: saltW, overflow: 'hidden', ...headStyle, color: '#6ee7b7', opacity: sl }}>
          <span style={{ paddingLeft: 10 }}>{S05.table.cols.salt}</span>
        </div>
        <div style={{ width: COL.print, paddingLeft: 10, ...headStyle }}>{S05.table.cols.print}</div>
      </div>
      {S05.table.rows.map((row, i) => (
        <div key={row} style={{ height: TWINS_ROW_H, display: 'flex', alignItems: 'center', borderTop: i > 0 ? `2px solid ${C.ink700}` : undefined }}>
          <div style={{ width: COL.account, paddingLeft: 26, fontSize: 34, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap' }}>{row}</div>
          <div style={{ width: COL.pass, paddingLeft: 10 }}>
            <PasswordDots n={6} size={14} mark={passMark} />
          </div>
          <div style={{ width: saltW, overflow: 'hidden', opacity: sl }}>
            <div style={{ paddingLeft: 10, display: 'inline-flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap' }}>
              <SaltGrain size={40} />
              <span style={{ fontFamily: FONT.mono, fontSize: 36, fontWeight: 800, color: '#6ee7b7' }}>{S05.table.salts[i].slice(0, Math.round(mix(0, 4, (sl - 0.4) / 0.6)))}</span>
            </div>
          </div>
          <div style={{ width: COL.print, paddingLeft: 10 }}>
            <HashLine
              value={ans > 0.001 ? S05.table.salted[i] : S05.table.twin}
              from={ans > 0.001 ? S05.table.twin : undefined}
              morph={ans}
              size={40}
              tone={ans > 0.5 ? C.emerald : C.cyan}
              mark={Math.max(clamp01(printMark) * (1 - ans), clamp01(answerMark))}
              markTone={ans > 0.5 ? C.emerald : C.amber}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
