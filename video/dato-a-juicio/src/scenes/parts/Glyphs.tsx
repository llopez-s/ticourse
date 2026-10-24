import { useId, type CSSProperties } from 'react';
import { C, alpha } from '../../../../engine/src/theme/tokens';

/** EMBER FOX's mark: an angular fox head with a spark. Abstract on purpose (no real group logo). */
export function FoxGlyph({ size = 96, color = C.rose, style }: { size?: number; color?: string; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={style}>
      <polygon points="6,8 25,22 39,22 58,8 54,36 32,60 10,36" fill={alpha(color, 0.14)} stroke={color} strokeWidth={2.6} strokeLinejoin="round" />
      <polygon points="11,15 21,23 13,29" fill={alpha(color, 0.35)} />
      <polygon points="53,15 43,23 51,29" fill={alpha(color, 0.35)} />
      <path d="M19 35l9 3.5M45 35l-9 3.5" stroke={color} strokeWidth={2.6} strokeLinecap="round" />
      <path d="M32 61V50" stroke={color} strokeWidth={2.6} strokeLinecap="round" />
      <circle cx="32" cy="50" r="3.2" fill={color} />
    </svg>
  );
}

/** A faceless person: head and shoulders, nothing else (the adversary is a human with an intention). */
export function Silhouette({ width = 200, color = C.rose, style }: { width?: number; color?: string; style?: CSSProperties }) {
  const h = Math.round(width * 1.18);
  const gid = `sil-${useId().replace(/:/g, '')}`;
  return (
    <svg width={width} height={h} viewBox="0 0 120 142" style={style}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={alpha(color, 0.35)} />
          <stop offset="1" stopColor={alpha(color, 0.08)} />
        </linearGradient>
      </defs>
      <circle cx="60" cy="38" r="27" fill={`url(#${gid})`} stroke={color} strokeWidth={3} />
      <path d="M8 140C8 100 32 80 60 80s52 20 52 60Z" fill={`url(#${gid})`} stroke={color} strokeWidth={3} strokeLinejoin="round" />
    </svg>
  );
}

/** A plain file with a folded corner and a few text lines. The label goes on top in HTML. */
export function FileArt({ width = 150, color = C.amber, style }: { width?: number; color?: string; style?: CSSProperties }) {
  const h = Math.round(width * 1.2);
  return (
    <svg width={width} height={h} viewBox="0 0 100 120" style={style}>
      <path d="M12 6H64L90 32V114H12Z" fill={alpha(color, 0.1)} stroke={color} strokeWidth={3} strokeLinejoin="round" />
      <path d="M64 6V32H90" fill={alpha(color, 0.2)} stroke={color} strokeWidth={3} strokeLinejoin="round" />
      <path d="M26 56H76M26 72H76M26 88H58" stroke={alpha(color, 0.55)} strokeWidth={4} strokeLinecap="round" />
    </svg>
  );
}

/** A small flame (the fire triangle's centre). `out` 0..1 blows it out. */
export function Flame({ size = 120, out = 0, color = C.amber }: { size?: number; out?: number; color?: string }) {
  const k = 1 - out;
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 100 120" style={{ opacity: 0.15 + 0.85 * k, transform: `scale(${0.55 + 0.45 * k})`, transformOrigin: '50% 100%' }}>
      <path d="M50 6C58 28 84 40 84 74C84 98 68 114 50 114C32 114 16 98 16 74C16 56 28 48 34 34C40 44 44 40 50 6Z" fill={alpha(color, 0.25)} stroke={color} strokeWidth={4} strokeLinejoin="round" />
      <path d="M50 52C56 64 68 70 68 86C68 98 60 106 50 106C40 106 32 98 32 86C32 74 44 68 50 52Z" fill={alpha(C.rose, 0.45)} stroke={C.roseSoft} strokeWidth={3} strokeLinejoin="round" />
    </svg>
  );
}

/**
 * A fishing rod leaning on its holder at the end of a little pier, with line, hook and bait over the water.
 * `fisher` (0..1) sits a fisherman behind the rod, holding it. `dim` greys the scene back.
 */
export function RodScene({ width = 640, fisher = 0, draw = 1, color = C.amber, fisherColor = C.rose }: { width?: number; fisher?: number; draw?: number; color?: string; fisherColor?: string }) {
  const h = Math.round(width * 0.66);
  const lineLen = 420;
  return (
    <svg width={width} height={h} viewBox="0 0 600 396" style={{ overflow: 'visible' }}>
      {/* water */}
      <path d="M0 300Q50 288 100 300T200 300T300 300T400 300T500 300T600 300V396H0Z" fill={alpha(C.cyan, 0.07)} stroke={alpha(C.cyan, 0.35)} strokeWidth={2.5} />
      <path d="M330 330q20-8 40 0t40 0M300 352q20-8 40 0t40 0" stroke={alpha(C.cyan, 0.3)} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      {/* pier */}
      <rect x="0" y="332" width="190" height="20" rx="4" fill={C.ink700} stroke={C.ink600} strokeWidth={2} />
      <path d="M30 352V396M150 352V396" stroke={C.ink600} strokeWidth={8} />
      {/* rod: leaning, handle at the pier */}
      <path d="M64 332Q200 150 372 62" fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" strokeDasharray={lineLen} strokeDashoffset={lineLen * (1 - draw)} />
      <circle cx="104" cy="288" r="13" fill="none" stroke={color} strokeWidth={4} opacity={draw} />
      {/* line, hook and bait */}
      <path d="M372 62Q392 180 384 296" fill="none" stroke={alpha(C.text, 0.8)} strokeWidth={2.5} opacity={draw} />
      <path d="M384 296v14a9 9 0 1 1-9-9" fill="none" stroke={C.text} strokeWidth={3.5} strokeLinecap="round" opacity={draw} />
      <circle cx="396" cy="316" r="6" fill={C.roseSoft} opacity={draw} />
      {/* the fisherman, behind the rod */}
      <g opacity={fisher} transform={`translate(${(1 - fisher) * -40} 0)`}>
        <circle cx="66" cy="252" r="23" fill={alpha(fisherColor, 0.2)} stroke={fisherColor} strokeWidth={3.5} />
        <path d="M22 332L34 280Q60 262 90 276L104 332Z" fill={alpha(fisherColor, 0.2)} stroke={fisherColor} strokeWidth={3.5} strokeLinejoin="round" />
        <path d="M86 284L108 292" stroke={fisherColor} strokeWidth={9} strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** One small rod for the «cañas que se sustituyen» row: curved rod, line and hook. */
export function RodMini({ size = 150, color = C.amber, struck = 0 }: { size?: number; color?: string; struck?: number }) {
  return (
    <svg width={size * 0.75} height={size} viewBox="0 0 90 120">
      <path d="M16 112Q30 40 74 12" fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" />
      <path d="M74 12Q80 56 76 90" fill="none" stroke={alpha(C.text, 0.8)} strokeWidth={2} />
      <path d="M76 90v8a6 6 0 1 1-6-6" fill="none" stroke={C.text} strokeWidth={2.6} strokeLinecap="round" />
      {struck > 0 ? <path d="M8 8L82 112" stroke={C.rose} strokeWidth={7} strokeLinecap="round" strokeDasharray={140} strokeDashoffset={140 * (1 - struck)} /> : null}
    </svg>
  );
}

/** A clock face whose arc is filled up to `fill` (0..1) from 12 o'clock: a short span or a long one. */
export function ClockArt({ size = 120, fill = 0.15, color = C.amber }: { size?: number; fill?: number; color?: string }) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const a = fill * 2 * Math.PI - Math.PI / 2;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill={alpha(color, 0.08)} stroke={C.ink600} strokeWidth={5} />
      <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" strokeDasharray={`${circ * fill} ${circ}`} transform="rotate(-90 50 50)" />
      <path d={`M50 50L${50 + 26 * Math.cos(a)} ${50 + 26 * Math.sin(a)}`} stroke={C.textStrong} strokeWidth={5} strokeLinecap="round" />
      <circle cx="50" cy="50" r={4.5} fill={C.textStrong} />
    </svg>
  );
}

/** A little ghost (the threat nobody has evidence for). */
export function Ghost({ size = 120, color = C.muted }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size * 1.16} viewBox="0 0 120 140">
      <path d="M12 130V60C12 26 34 8 60 8s48 18 48 52v70l-14-12-17 12-17-12-17 12-17-12Z" fill={alpha(color, 0.12)} stroke={color} strokeWidth={4} strokeLinejoin="round" />
      <circle cx="44" cy="58" r="8" fill={color} />
      <circle cx="76" cy="58" r="8" fill={color} />
      <path d="M48 84Q60 94 72 84" fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" />
    </svg>
  );
}

/** A person under a spotlight: the one who really is coming for you. */
export function Spotlit({ width = 150, color = C.rose, beam = 1 }: { width?: number; color?: string; beam?: number }) {
  const h = Math.round(width * 1.2);
  return (
    <svg width={width} height={h} viewBox="0 0 150 180" style={{ overflow: 'visible' }}>
      <polygon points="75,0 8,172 142,172" fill={alpha(C.cyan, 0.12 * beam)} stroke={alpha(C.cyan, 0.4 * beam)} strokeWidth={2} />
      <circle cx="75" cy="78" r="19" fill={alpha(color, 0.3)} stroke={color} strokeWidth={4} />
      <path d="M38 168C38 134 54 114 75 114s37 20 37 54Z" fill={alpha(color, 0.3)} stroke={color} strokeWidth={4} strokeLinejoin="round" />
      <circle cx="75" cy="6" r="8" fill={C.cyanSoft} opacity={beam} />
    </svg>
  );
}
