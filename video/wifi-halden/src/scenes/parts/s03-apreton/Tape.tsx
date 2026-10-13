import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { G, S03 } from '../../../data/s03-apreton';
import { STEEL } from '../Glyphs';
import { ExamTag } from './bits';

const P = G.panel;
/** Exam names the voice points at: never under 32 px. */
const TAG = 32;
const CASSETTE = 0.86;
const ROW = { x: P.x + 18, w: P.w - 36, h: 154, tops: [P.y + 118, P.y + 290] } as const;

/**
 * A tape of recorded traffic (design 150 × 96, top-left at 0,0). `strap` is the band around it:
 * 'if' = dashed amber (it would open, on a condition), 'shut' = solid emerald (it stays closed).
 */
export function Cassette({ strap, lit = 1, scale = 1 }: { strap?: 'if' | 'shut'; lit?: number; scale?: number }) {
  const tone = strap === 'shut' ? C.emerald : strap === 'if' ? C.amber : STEEL.light;
  return (
    <svg width={150 * scale} height={96 * scale} viewBox="0 0 150 96" style={{ display: 'block', overflow: 'visible' }}>
      <rect x={2} y={2} width={146} height={92} rx={10} fill={STEEL.fill} stroke={STEEL.light} strokeWidth={4} />
      <rect x={22} y={18} width={106} height={44} rx={8} fill={STEEL.dark} stroke={STEEL.line} strokeWidth={3} />
      {[50, 100].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={40} r={15} fill={C.ink900} stroke={STEEL.light} strokeWidth={3} />
          <circle cx={cx} cy={40} r={4} fill={STEEL.light} />
        </g>
      ))}
      <line x1={65} y1={40} x2={85} y2={40} stroke={STEEL.line} strokeWidth={4} />
      <path d="M 34 94 L 44 74 H 106 L 116 94" fill="none" stroke={STEEL.line} strokeWidth={3} strokeLinejoin="round" />
      {strap && lit > 0.001 ? (
        <g opacity={lit}>
          <rect
            x={-9}
            y={-9}
            width={168}
            height={114}
            rx={16}
            fill={alpha(tone, strap === 'shut' ? 0.1 : 0.04)}
            stroke={tone}
            strokeWidth={strap === 'shut' ? 5 : 4}
            strokeDasharray={strap === 'if' ? '10 10' : undefined}
            strokeLinecap="round"
          />
          {strap === 'shut' ? <rect x={66} y={-9} width={18} height={114} fill={alpha(C.emerald, 0.85)} /> : null}
        </g>
      ) : null}
    </svg>
  );
}

/**
 * Yesterday's recorded traffic, twice. With WPA2 — conditional, dashed, on screen only — «si averiguas
 * la clave, la abre»; with SAE it «sigue cerrada», and that is FORWARD SECRECY (`forward` 0–1).
 * `wpa2` / `sae` 0–1 bring each row in; `saeLit` glows the SAE row.
 */
export function TapeRows({ wpa2, sae, saeLit, forward, forwardLit }: { wpa2: number; sae: number; saeLit: number; forward: number; forwardLit: number }) {
  const row = (top: number, show: number, border: string, bg: string, glow?: string) => ({
    position: 'absolute' as const,
    left: ROW.x,
    top,
    width: ROW.w,
    height: ROW.h,
    boxSizing: 'border-box' as const,
    display: 'flex',
    alignItems: 'center',
    gap: 24,
    padding: '0 12px 0 22px',
    borderRadius: 18,
    border,
    background: bg,
    boxShadow: glow,
    opacity: show,
    transform: `translateY(${(1 - show) * 12}px)`,
    fontFamily: FONT.sans,
    whiteSpace: 'nowrap' as const,
  });
  return (
    <>
      {wpa2 > 0.001 ? (
        <div style={row(ROW.tops[0], wpa2, `3px dashed ${STEEL.line}`, alpha(C.ink900, 0.6))}>
          <Cassette strap="if" scale={CASSETTE} />
          <div>
            <ExamTag size={TAG} lit={0}>
              {S03.wpa2}
            </ExamTag>
            <div style={{ marginTop: 6, fontSize: 32, fontWeight: 750, lineHeight: 1.12, color: '#fcd34d' }}>
              <div>{S03.tapeWpa2[0]}</div>
              <div>{S03.tapeWpa2[1]}</div>
            </div>
          </div>
        </div>
      ) : null}
      {sae > 0.001 ? (
        <div style={row(ROW.tops[1], sae, `3px solid ${alpha(C.emerald, 0.55 + 0.4 * saeLit)}`, alpha('#06241b', 0.8), saeLit > 0.02 ? `0 0 ${Math.round(34 * saeLit)}px ${alpha(C.emerald, 0.25 * saeLit)}` : undefined)}>
          <Cassette strap="shut" scale={CASSETTE} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <ExamTag size={TAG} lit={0}>
                {S03.sae}
              </ExamTag>
              <span style={{ fontSize: 40, fontWeight: 850, lineHeight: 1.1, letterSpacing: -0.6, color: '#6ee7b7' }}>{S03.tapeSae}</span>
            </div>
            {/* the name of what the SAE row shows: it keeps its room, so nothing moves when it lands */}
            <div style={{ marginTop: 10, opacity: forward, transform: `scale(${0.9 + 0.1 * forward})`, transformOrigin: '0 50%' }}>
              <ExamTag size={TAG} lit={forwardLit}>
                {S03.forward}
              </ExamTag>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
