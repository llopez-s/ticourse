import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { Bus, Rider } from './Figures';

/** Rule 1 in miniature: the bus with travellers, and two more arriving. */
export function BusArt() {
  return (
    <div style={{ position: 'relative', width: 420, height: 132 }}>
      <div style={{ position: 'absolute', left: 0, top: 14 }}>
        <Bus width={236} riders={[1, 0, 1, 1, 0]} />
      </div>
      <div style={{ position: 'absolute', left: 262, top: 40 }}>
        <Rider size={86} />
      </div>
      <div style={{ position: 'absolute', left: 318, top: 40 }}>
        <Rider size={86} />
      </div>
      <div style={{ position: 'absolute', left: 372, top: 18, width: 40, height: 40, borderRadius: 20, display: 'grid', placeItems: 'center', background: alpha(C.emerald, 0.2), border: `3px solid ${C.emerald}`, fontFamily: FONT.sans, fontSize: 28, fontWeight: 900, color: C.emerald }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.emerald} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </div>
    </div>
  );
}

/** Rule 2 in miniature: the traveller and the four questions as four little cards. */
export function AskArt() {
  return (
    <div style={{ position: 'relative', width: 420, height: 132 }}>
      <div style={{ position: 'absolute', left: 8, top: 14 }}>
        <Rider size={112} />
      </div>
      <svg width="420" height="132" viewBox="0 0 420 132" style={{ position: 'absolute', left: 0, top: 0 }} aria-hidden>
        <path d="M96 52 C 120 52, 126 40, 150 40" fill="none" stroke={C.sky} strokeWidth="4" strokeLinecap="round" strokeDasharray="2 9" />
        {[0, 1, 2, 3].map((k) => (
          <g key={k} transform={`translate(${160 + (k % 2) * 124} ${14 + Math.floor(k / 2) * 60})`}>
            <rect width="112" height="50" rx="12" fill={alpha(C.sky, 0.14)} stroke={C.sky} strokeWidth="3.5" />
            <rect x="14" y="14" width="56" height="8" rx="4" fill={alpha(C.sky, 0.7)} />
            <rect x="14" y="30" width="36" height="8" rx="4" fill={alpha(C.sky, 0.4)} />
            <text x="90" y="36" textAnchor="middle" fontFamily={FONT.sans} fontSize="30" fontWeight="850" fill={C.sky}>?</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/** Rule 3 in miniature: three rising stage bars, and the depot behind them (parked buses, no lines). */
export function StagesArt() {
  const tones = [C.amber, C.cyan, C.emerald];
  return (
    <div style={{ position: 'relative', width: 420, height: 132 }}>
      <svg width="420" height="132" viewBox="0 0 420 132" style={{ position: 'absolute', left: 0, top: 0 }} aria-hidden>
        {tones.map((t, i) => (
          <rect key={i} x={10 + i * 70} y={110 - (36 + i * 34)} width="58" height={36 + i * 34} rx="10" fill={alpha(t, 0.2)} stroke={t} strokeWidth="4" />
        ))}
        <rect x="236" y="46" width="176" height="76" rx="14" fill="none" stroke={C.ink500} strokeWidth="3" strokeDasharray="9 8" />
      </svg>
      {[0, 1].map((k) => (
        <div key={k} style={{ position: 'absolute', left: 246 + k * 82, top: 62 }}>
          <Bus width={76} tone={C.muted} />
        </div>
      ))}
      <div style={{ position: 'absolute', left: 246, top: 88 }}>
        <Bus width={76} tone={C.muted} />
      </div>
      <div style={{ position: 'absolute', left: 328, top: 88 }}>
        <Bus width={76} tone={C.muted} />
      </div>
    </div>
  );
}
