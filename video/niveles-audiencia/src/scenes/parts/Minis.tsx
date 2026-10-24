import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, type IconName } from '../../../../engine/src/ui';
import { ENVELOPES, TONE } from '../../data/niveles';
import { Envelope, envelopeHeight } from './Envelope';

/** Miniatures of the video's three images, for the recap's rule cards and the end card. */

/** The table of three rows, each with its football figure (player, coach, board). */
export function MiniTable({ width = 300 }: { width?: number }) {
  const rows: { icon: IconName; tone: string; bar: [number, number] }[] = [
    { icon: 'user', tone: TONE.tactical, bar: [0.62, 0.34] },
    { icon: 'search', tone: TONE.operational, bar: [0.72, 0.5] },
    { icon: 'users', tone: TONE.strategic, bar: [0.5, 0.78] },
  ];
  return (
    <div style={{ width, display: 'flex', flexDirection: 'column', gap: 10, fontFamily: FONT.sans }}>
      {rows.map((r, i) => (
        <div
          key={i}
          style={{
            height: 46,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '0 14px 0 8px',
            borderRadius: 14,
            border: `2px solid ${alpha(r.tone, 0.8)}`,
            background: `linear-gradient(90deg, ${alpha(r.tone, 0.16)} 0%, ${C.ink900} 70%)`,
          }}
        >
          <span style={{ width: 32, height: 32, borderRadius: 16, display: 'grid', placeItems: 'center', background: alpha(r.tone, 0.22), border: `2px solid ${alpha(r.tone, 0.8)}` }}>
            <Icon name={r.icon} size={20} color={r.tone} strokeWidth={2.4} />
          </span>
          <span style={{ height: 12, borderRadius: 6, width: (width - 90) * r.bar[0] * 0.5, background: alpha(r.tone, 0.7) }} />
          <span style={{ height: 12, borderRadius: 6, width: (width - 90) * r.bar[1] * 0.4, background: alpha(C.muted, 0.35) }} />
        </div>
      ))}
    </div>
  );
}

/** The two envelopes, each where it belongs. */
export function MiniEnvelopes({ width = 330, check = 1, tilt = 0 }: { width?: number; check?: number; tilt?: number }) {
  const w = (width - 24) / 2;
  const h = envelopeHeight(w);
  return (
    <div style={{ position: 'relative', width, height: h }}>
      {(['board', 'soc'] as const).map((id, i) => (
        <div key={id} style={{ position: 'absolute', left: i * (w + 24), top: 0, transform: `rotate(${(i === 0 ? -1 : 1) * tilt}deg)` }}>
          <Envelope width={w} label={ENVELOPES[id].label} tone={ENVELOPES[id].tone} icon={id === 'board' ? 'users' : 'bell'} open={0} sealOpacity={0} check={check} />
        </div>
      ))}
    </div>
  );
}

/** The house with a bar of five stops beside it; Intelligence (the roof) lit. */
export function MiniScale({ width = 300 }: { width?: number }) {
  const s = width / 300;
  return (
    <svg width={width} height={150 * s} viewBox="0 0 300 150" aria-hidden style={{ display: 'block' }}>
      {/* house */}
      <path d="M10 140 H130" stroke={C.ink500} strokeWidth={3} strokeLinecap="round" />
      <rect x={24} y={78} width={92} height={62} rx={3} fill={alpha(C.sky, 0.1)} stroke={C.sky} strokeWidth={3.5} />
      <rect x={58} y={104} width={24} height={36} rx={3} fill={alpha(C.sky, 0.2)} stroke={C.sky} strokeWidth={3} />
      <path d="M14 82 L70 28 L126 82 Z" fill={alpha(C.cyan, 0.2)} stroke={C.cyan} strokeWidth={4} strokeLinejoin="round" />
      {/* bar */}
      <path d="M156 92 H284" stroke={C.ink600} strokeWidth={4} strokeLinecap="round" />
      <path d="M274 82 L288 92 L274 102" fill="none" stroke={C.ink500} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 166 + i * 28;
        const lit = i < 4;
        const tone = i === 3 ? C.cyan : C.sky;
        return <circle key={i} cx={x} cy={92} r={i === 3 ? 11 : 9} fill={lit ? alpha(tone, i === 3 ? 0.9 : 0.35) : C.ink850} stroke={lit ? tone : C.muted} strokeWidth={3.5} />;
      })}
    </svg>
  );
}
