import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../../engine/src/theme/motion';
import { Clock, Notebook, Technician } from '../Cafe';

/** Height of the art slot of a rule card. */
export const ART_H = 190;

/** Rule 1: the clock (time, the RTO) beside the notebook (data, the RPO), each lit on its word. */
export function ClockBookArt({ frame, at, clockAt, bookAt }: { frame: number; at: number; clockAt: number; bookAt: number }) {
  const c = progress(frame, clockAt, 14);
  const b = progress(frame, bookAt, 14);
  const pop = progress(frame, at - 4, 18);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 56, opacity: 0.4 + 0.6 * pop }}>
      <Clock size={150} glow={c} opacity={0.55 + 0.45 * c} />
      <Notebook size={150} glow={b} opacity={0.55 + 0.45 * b} />
    </div>
  );
}

/** The four faults as bars over the promise line (no figures); the technician beside them, and their mean. */
export function TechArt({ frame, at, meanAt }: { frame: number; at: number; meanAt: number }) {
  const grow = progress(frame, at, 26, EASE.inOut);
  const mean = progress(frame, meanAt, 16);
  const W = 168;
  const H = 130;
  const base = H - 6;
  const promiseY = base - 23;
  // 40, 95, 120 and 65 minutes at 0.75 px/min; the promise (30 min) sits at 23 px and the mean (80 min) at 60 px.
  const heights = [30, 71, 90, 49];
  const meanY = base - 60;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
      <Technician size={124} glow={progress(frame, at, 16) * 0.5} opacity={0.55 + 0.45 * progress(frame, at - 4, 14)} />
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible', display: 'block' }}>
        {heights.map((h, i) => {
          const over = h > 23;
          return <rect key={i} x={10 + i * 38} y={base - h * grow} width={26} height={h * grow} rx={5} fill={alpha(over ? C.rose : C.emerald, 0.85)} />;
        })}
        <line x1={0} y1={promiseY} x2={W} y2={promiseY} stroke={C.amber} strokeWidth={4} strokeLinecap="round" strokeDasharray="10 8" />
        <line x1={0} y1={base} x2={W} y2={base} stroke={C.ink500} strokeWidth={3} />
        {mean > 0.02 ? <line x1={0} y1={meanY} x2={W * mean} y2={meanY} stroke={C.cyanSoft} strokeWidth={4} strokeLinecap="round" /> : null}
      </svg>
    </div>
  );
}

/** The paper that does not add up: a sheet with the promise line, a measured bar that runs past it, and «≠». */
export function PaperArt({ frame, at, markAt }: { frame: number; at: number; markAt: number }) {
  const pop = progress(frame, at - 4, 18);
  const bar = progress(frame, markAt - 10, 20, EASE.inOut);
  const mark = progress(frame, markAt, 14);
  return (
    <svg width={260} height={170} viewBox="0 0 260 170" style={{ overflow: 'visible', display: 'block', opacity: 0.4 + 0.6 * pop }}>
      <rect x={20} y={6} width={150} height={158} rx={12} fill={C.ink800} stroke={C.ink500} strokeWidth={4} />
      {/* the promise on paper (amber) and what was measured (rose, running past it) */}
      <line x1={40} y1={44} x2={120} y2={44} stroke={C.amber} strokeWidth={8} strokeLinecap="round" />
      <line x1={40} y1={78} x2={40 + 112 * bar} y2={78} stroke={C.rose} strokeWidth={8} strokeLinecap="round" />
      <line x1={120} y1={30} x2={120} y2={92} stroke={alpha(C.amber, 0.7)} strokeWidth={3} strokeDasharray="6 6" />
      <line x1={40} y1={112} x2={110} y2={112} stroke={C.muted} strokeWidth={4} strokeLinecap="round" opacity={0.6} />
      <line x1={40} y1={134} x2={96} y2={134} stroke={C.muted} strokeWidth={4} strokeLinecap="round" opacity={0.6} />
      {/* ≠ drawn as a shape */}
      <g opacity={mark} stroke={C.roseSoft} strokeWidth={9} strokeLinecap="round">
        <line x1={196} y1={66} x2={246} y2={66} />
        <line x1={196} y1={98} x2={246} y2={98} />
        <line x1={206} y1={118} x2={238} y2={46} />
      </g>
    </svg>
  );
}

/** The end card's picture: the café's three glyphs, the whole video in one place. Halo comes up on `at`. */
export function CafeCluster({ frame, at }: { frame: number; at: number }) {
  const halo = 0.35 + 0.65 * progress(frame, at, 22);
  return (
    <div style={{ position: 'relative', width: 372, height: 430 }}>
      <div style={{ position: 'absolute', left: 20, top: 40, width: 330, height: 330, borderRadius: 999, background: `radial-gradient(circle, ${alpha(C.cyan, 0.16)} 0%, ${alpha(C.cyan, 0)} 70%)`, opacity: halo }} />
      <div style={{ position: 'absolute', left: 10, top: 24 }}>
        <Clock size={150} glow={0.3 * halo} />
      </div>
      <div style={{ position: 'absolute', left: 210, top: 40 }}>
        <Notebook size={150} glow={0.3 * halo} />
      </div>
      <div style={{ position: 'absolute', left: 92, top: 214 }}>
        <Technician size={190} glow={0.3 * halo} />
      </div>
    </div>
  );
}
