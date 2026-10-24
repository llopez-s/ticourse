import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01, mix } from '../../../../../engine/src/ui';
import { RecordMini } from '../Record';
import { TimeClock } from '../TimeClock';

/** s02's three small illustrations (each about 520×140) and the top-down corridor. */

/** At rest: the new system's database with the record inside; `lock` 0–1 adds the emerald encryption badge. */
export function RestArt({ on, lock }: { on: number; lock: number }) {
  const l = clamp01(lock);
  return (
    <div style={{ position: 'relative', width: 240, height: 140 }}>
      <div style={{ position: 'absolute', left: 50, top: 6 }}>
        <Icon name="database" size={128} color={mix(0, 1, on) > 0.5 ? C.cyan : C.muted} strokeWidth={1.6} />
      </div>
      <div style={{ position: 'absolute', left: 150, top: 70, opacity: on }}>
        <RecordMini width={72} />
      </div>
      {l > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: 6,
            top: 76,
            width: 58,
            height: 58,
            borderRadius: 29,
            display: 'grid',
            placeItems: 'center',
            background: C.ink900,
            border: `3px solid ${C.emerald}`,
            boxShadow: `0 0 18px ${alpha(C.emerald, 0.5 * l)}`,
            opacity: l,
            transform: `scale(${0.7 + 0.3 * l})`,
          }}
        >
          <Icon name="lock" size={32} color={C.emerald} />
        </div>
      ) : null}
    </div>
  );
}

/** In transit: the clock, the network and the server; the record travels the line (`t` 0–1); `tls` 0–1 the tag. */
export function TransitArt({ on, t, tls }: { on: number; t: number; tls: number }) {
  const s = clamp01(tls);
  const x = mix(96, 330, clamp01(t));
  return (
    <div style={{ position: 'relative', width: 480, height: 140 }}>
      <div style={{ position: 'absolute', left: 0, top: 18 }}>
        <TimeClock width={78} idSuffix="-s2t" />
      </div>
      <svg width={480} height={140} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <line x1={92} y1={72} x2={384} y2={72} stroke={s > 0.5 ? C.emerald : C.sky} strokeWidth={5} strokeDasharray="12 10" strokeLinecap="round" opacity={0.5 + 0.5 * on} />
        {s > 0.01 ? <rect x={86} y={52} width={304} height={40} rx={20} fill="none" stroke={alpha(C.emerald, 0.7 * s)} strokeWidth={3} /> : null}
      </svg>
      <div style={{ position: 'absolute', left: x, top: 50, opacity: on }}>
        <RecordMini width={56} />
      </div>
      <div style={{ position: 'absolute', left: 386, top: 12 }}>
        <Icon name="server" size={112} color={on > 0.5 ? C.sky : C.muted} strokeWidth={1.6} />
      </div>
      {s > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: 196,
            top: 96,
            padding: '2px 14px',
            borderRadius: 999,
            background: C.ink900,
            border: `2px solid ${C.emerald}`,
            fontSize: 30,
            fontWeight: 850,
            color: C.emerald,
            opacity: s,
            fontFamily: 'inherit',
          }}
        >
          TLS
        </div>
      ) : null}
    </div>
  );
}

/** A monitor (front view) showing the record, open: in use. */
export function UseArt({ on, warn }: { on: number; warn: number }) {
  const tone = warn > 0.5 ? C.amber : on > 0.5 ? C.cyan : C.muted;
  return (
    <div style={{ position: 'relative', width: 260, height: 140 }}>
      <svg width={220} height={140} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <rect x={4} y={4} width={212} height={110} rx={10} fill={C.ink900} stroke={tone} strokeWidth={4} />
        <rect x={98} y={114} width={24} height={14} fill={C.ink700} />
        <rect x={70} y={128} width={80} height={8} rx={4} fill={C.ink600} />
      </svg>
      <div style={{ position: 'absolute', left: 56, top: 20, opacity: 0.4 + 0.6 * on }}>
        <RecordMini width={108} tone={tone} />
      </div>
      <div style={{ position: 'absolute', left: 214, top: 64, opacity: 0.4 + 0.6 * on }}>
        <Icon name="user" size={54} color={on > 0.5 ? C.cyanSoft : C.muted} />
      </div>
    </div>
  );
}

/** Top-down: the desk with the screen and the empty corridor beside it, in the SVG's own units. */
export const CORRIDOR = { w: 520, h: 200 } as const;

/**
 * `expose` 0–1 draws the amber view cone from the screen into the corridor; `turn` 0–1 turns the screen towards the
 * wall (the cone swings away and fades); `lock` 0–1 dims the screen with a small emerald lock. The corridor is empty:
 * nobody reads anything.
 */
export function Corridor({ expose, turn, lock }: { expose: number; turn: number; lock: number }) {
  const e = clamp01(expose);
  const tr = clamp01(turn);
  const lk = clamp01(lock);
  const angle = -90 * tr;
  const cone = e * (1 - 0.85 * tr);
  return (
    <svg width={CORRIDOR.w} height={CORRIDOR.h} viewBox={`0 0 ${CORRIDOR.w} ${CORRIDOR.h}`} style={{ overflow: 'visible' }}>
      {/* the office wall and the corridor */}
      <rect x={300} y={0} width={180} height={200} fill={alpha(C.amber, 0.05 + 0.06 * e * (1 - tr))} />
      <line x1={300} y1={0} x2={300} y2={60} stroke={C.ink500} strokeWidth={5} />
      <line x1={300} y1={140} x2={300} y2={200} stroke={C.ink500} strokeWidth={5} />
      <line x1={480} y1={0} x2={480} y2={200} stroke={C.ink500} strokeWidth={5} />
      {[30, 80, 130, 180].map((y) => (
        <line key={y} x1={390} y1={y - 14} x2={390} y2={y + 4} stroke={C.ink600} strokeWidth={3} strokeLinecap="round" />
      ))}
      {/* the desk */}
      <rect x={40} y={60} width={150} height={80} rx={8} fill={C.ink800} stroke={C.ink600} strokeWidth={3} />
      <g transform={`rotate(${angle} 150 100)`}>
        {cone > 0.01 ? <path d="M 160 100 L 470 10 L 470 190 Z" fill={alpha(C.amber, 0.22 * cone)} stroke={alpha(C.amber, 0.6 * cone)} strokeWidth={2} /> : null}
        <rect x={146} y={66} width={16} height={68} rx={4} fill={lk > 0.5 ? C.ink700 : alpha(C.cyan, 0.9)} stroke={C.text} strokeWidth={2} />
      </g>
      {lk > 0.01 ? (
        <g opacity={lk} transform="translate(92 100)">
          <circle r={24} fill={C.ink900} stroke={C.emerald} strokeWidth={3} />
          <rect x={-10} y={-2} width={20} height={14} rx={3} fill={C.emerald} />
          <path d="M -6 -2 L -6 -8 A 6 6 0 0 1 6 -8 L 6 -2" fill="none" stroke={C.emerald} strokeWidth={3} />
        </g>
      ) : null}
    </svg>
  );
}
