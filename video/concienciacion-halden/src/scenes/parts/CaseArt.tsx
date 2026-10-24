import type { ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, type IconName } from '../../../../engine/src/ui';

/** A rounded tile with an icon and an optional label: the vocabulary of the three little pictures of s02. */
function Tile({ icon, label, tone, w = 84, h = 84, children }: { icon: IconName; label?: string; tone: string; w?: number; h?: number; children?: ReactNode }) {
  return (
    <div
      style={{
        position: 'relative',
        width: w,
        height: h,
        boxSizing: 'border-box',
        borderRadius: 18,
        background: C.ink850,
        border: `3px solid ${alpha(tone, 0.7)}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        fontFamily: FONT.sans,
      }}
    >
      <Icon name={icon} size={label ? 32 : 44} color={tone} />
      {label ? <span style={{ fontSize: 26, fontWeight: 800, color: C.textStrong, lineHeight: 1.1 }}>{label}</span> : null}
      {children}
    </div>
  );
}

/** A dashed arrow between two tiles. */
function Arrow({ w = 56, tone }: { w?: number; tone: string }) {
  return (
    <svg width={w} height={30} viewBox={`0 0 ${w} 30`} style={{ flexShrink: 0 }}>
      <line x1={2} y1={15} x2={w - 12} y2={15} stroke={tone} strokeWidth={4} strokeDasharray="8 6" strokeLinecap="round" />
      <path d={`M${w - 16} 6 L${w - 3} 15 L${w - 16} 24`} fill="none" stroke={tone} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Case 1: work documents sent on to a personal mailbox (no address, no provider). */
export function ForwardArt({ tone }: { tone: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <Tile icon="file" tone={C.cyan} />
      <Arrow tone={tone} />
      <Tile icon="mail" tone={tone}>
        <div style={{ position: 'absolute', right: -10, top: -10, width: 32, height: 32, borderRadius: 16, background: C.ink900, border: `3px solid ${tone}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="user" size={18} color={tone} />
        </div>
      </Tile>
    </div>
  );
}

/** Case 2: an account of Compras opens payroll of another section (names only; nothing says whose or whether stolen). */
export function AccountArt({ tone }: { tone: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Tile icon="user" label="Compras" tone={C.cyan} w={150} />
      <Arrow w={44} tone={tone} />
      <Tile icon="archive" label="nóminas" tone={tone} w={150} />
    </div>
  );
}

/** Case 3: a group photo with a board behind the group whose lines are unreadable bars, and the OPSEC chip. */
export function PhotoArt({ tone }: { tone: string }) {
  const W = 200;
  const H = 104;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ flexShrink: 0 }}>
        <rect x={2} y={2} width={W - 4} height={H - 4} rx={12} fill={C.ink850} stroke={alpha(tone, 0.7)} strokeWidth={3} />
        {/* the board behind: unreadable bars */}
        <rect x={104} y={14} width={80} height={46} rx={5} fill={alpha(C.text, 0.1)} stroke={alpha(C.muted, 0.6)} strokeWidth={2} />
        {[0, 1, 2].map((r) => (
          <rect key={r} x={112} y={22 + r * 11} width={r === 1 ? 44 : 60} height={5} rx={2.5} fill={alpha(C.muted, 0.6)} />
        ))}
        {/* the group in front */}
        {[46, 86, 126].map((cx, i) => (
          <g key={cx}>
            <circle cx={cx} cy={62 - (i === 1 ? 4 : 0)} r={13} fill={C.ink700} stroke={alpha(C.text, 0.55)} strokeWidth={2.5} />
            <path d={`M${cx - 20} ${H - 4} C${cx - 20} ${80 - (i === 1 ? 4 : 0)} ${cx - 8} ${78 - (i === 1 ? 4 : 0)} ${cx} ${78 - (i === 1 ? 4 : 0)} C${cx + 8} ${78 - (i === 1 ? 4 : 0)} ${cx + 20} ${80 - (i === 1 ? 4 : 0)} ${cx + 20} ${H - 4} Z`} fill={C.ink700} stroke={alpha(C.text, 0.4)} strokeWidth={2} />
          </g>
        ))}
      </svg>
    </div>
  );
}
