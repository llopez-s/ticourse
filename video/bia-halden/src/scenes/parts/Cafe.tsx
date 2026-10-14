import { C, alpha } from '../../../../engine/src/theme/tokens';

/**
 * The video's one everyday image: a café and its till, NOT the port (the scene labels it «imagen · no es del
 * puerto»). Four small glyphs, shared by s03 (the whole café), s04 (the technician callback), s05 (the till that
 * hangs) and s06 (rule icons). Each is drawn at `size` px tall and positioned by a wrapper `div`
 * (position: absolute; left; top). Colours: cyan = the question being asked, rose = the failure, amber = the
 * promise line, muted = texture.
 *
 *   <Clock size glow />      the wall clock = how long the till can stay without serving (the RTO).
 *   <Notebook size glow />   the notebook = the sales jotted down since the last copy (the RPO).
 *   <Till size broken glow/> the till; `broken` 0 → 1 draws the dead screen and the error light.
 *   <Technician size glow /> the technician with the toolbox: «tarda lo que tarda» (the MTTR, measured).
 */
export type GlyphProps = { size?: number; glow?: number; opacity?: number };

function Halo({ r, glow, color = C.cyan }: { r: number; glow: number; color?: string }) {
  return glow > 0.01 ? <circle cx={50} cy={50} r={r} fill="none" stroke={alpha(color, 0.5 * glow)} strokeWidth={5} /> : null;
}

export function Clock({ size = 140, glow = 0, opacity = 1 }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ opacity, overflow: 'visible' }}>
      <Halo r={50} glow={glow} />
      <circle cx={50} cy={50} r={42} fill={C.ink800} stroke={C.cyan} strokeWidth={5} />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const r0 = i % 3 === 0 ? 32 : 36;
        return <line key={i} x1={50 + Math.sin(a) * r0} y1={50 - Math.cos(a) * r0} x2={50 + Math.sin(a) * 39} y2={50 - Math.cos(a) * 39} stroke={C.muted} strokeWidth={i % 3 === 0 ? 4 : 2} strokeLinecap="round" />;
      })}
      <line x1={50} y1={50} x2={50} y2={24} stroke={C.textStrong} strokeWidth={5} strokeLinecap="round" />
      <line x1={50} y1={50} x2={68} y2={58} stroke={C.cyanSoft} strokeWidth={5} strokeLinecap="round" />
      <circle cx={50} cy={50} r={4} fill={C.textStrong} />
    </svg>
  );
}

export function Notebook({ size = 140, glow = 0, opacity = 1 }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ opacity, overflow: 'visible' }}>
      <Halo r={52} glow={glow} color={C.amber} />
      <rect x={20} y={10} width={62} height={80} rx={7} fill={C.ink800} stroke={C.amber} strokeWidth={5} />
      <rect x={20} y={10} width={12} height={80} rx={5} fill={alpha(C.amber, 0.35)} />
      {[28, 42, 56, 70].map((y) => (
        <line key={y} x1={40} y1={y} x2={74} y2={y} stroke={C.muted} strokeWidth={3} strokeLinecap="round" />
      ))}
      <line x1={40} y1={28} x2={62} y2={28} stroke={C.amber} strokeWidth={4} strokeLinecap="round" />
    </svg>
  );
}

export function Till({ size = 160, broken = 0, glow = 0, opacity = 1 }: GlyphProps & { broken?: number }) {
  const dead = Math.max(0, Math.min(1, broken));
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ opacity, overflow: 'visible' }}>
      <Halo r={52} glow={glow} color={dead > 0.5 ? C.rose : C.cyan} />
      <rect x={10} y={52} width={80} height={36} rx={6} fill={C.ink800} stroke={C.ink500} strokeWidth={4} />
      <rect x={18} y={60} width={64} height={8} rx={3} fill={C.ink950} />
      <rect x={22} y={14} width={56} height={34} rx={5} fill={C.ink950} stroke={dead > 0.5 ? C.rose : C.cyan} strokeWidth={4} />
      {dead > 0.5 ? (
        <>
          <line x1={34} y1={22} x2={66} y2={40} stroke={C.rose} strokeWidth={4} strokeLinecap="round" />
          <line x1={66} y1={22} x2={34} y2={40} stroke={C.rose} strokeWidth={4} strokeLinecap="round" />
        </>
      ) : (
        <>
          <line x1={32} y1={24} x2={68} y2={24} stroke={C.cyanSoft} strokeWidth={3} strokeLinecap="round" />
          <line x1={32} y1={34} x2={58} y2={34} stroke={C.muted} strokeWidth={3} strokeLinecap="round" />
        </>
      )}
      <circle cx={80} cy={76} r={5} fill={dead > 0.5 ? C.rose : C.emerald} />
    </svg>
  );
}

export function Technician({ size = 160, glow = 0, opacity = 1 }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ opacity, overflow: 'visible' }}>
      <Halo r={52} glow={glow} />
      <circle cx={42} cy={26} r={11} fill={C.ink700} stroke={C.cyanSoft} strokeWidth={4} />
      <path d="M22 78 C22 52 62 52 62 78 Z" fill={C.ink800} stroke={C.cyan} strokeWidth={4} strokeLinejoin="round" />
      <rect x={60} y={58} width={30} height={22} rx={4} fill={C.ink800} stroke={C.amber} strokeWidth={4} />
      <line x1={68} y1={58} x2={68} y2={52} stroke={C.amber} strokeWidth={4} strokeLinecap="round" />
      <line x1={82} y1={58} x2={82} y2={52} stroke={C.amber} strokeWidth={4} strokeLinecap="round" />
      <line x1={68} y1={52} x2={82} y2={52} stroke={C.amber} strokeWidth={4} strokeLinecap="round" />
    </svg>
  );
}
