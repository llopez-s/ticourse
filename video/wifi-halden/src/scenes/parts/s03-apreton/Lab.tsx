import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { cubicPath, cubicPoint, type Point } from '../../../../../engine/src/ui';
import { G } from '../../../data/s03-apreton';
import { AccessPointGlyph, STEEL, TabletGlyph } from '../Glyphs';

const L = G.locker;

/** The dock locker the access point sits on: neutral structure. The padlock is bolted to its front in the SAE half. */
function Locker({ lit }: { lit: number }) {
  const cx = L.x + L.w / 2;
  return (
    <g>
      <rect x={L.x + 14} y={L.y + L.h} width={18} height={10} fill={STEEL.line} />
      <rect x={L.x + L.w - 32} y={L.y + L.h} width={18} height={10} fill={STEEL.line} />
      <rect x={L.x} y={L.y} width={L.w} height={L.h} rx={10} fill={STEEL.fill} stroke={lit > 0.5 ? STEEL.light : STEEL.line} strokeWidth={4} />
      {[0, 1, 2].map((k) => (
        <line key={k} x1={cx - 34} y1={L.y + 18 + k * 11} x2={cx + 34} y2={L.y + 18 + k * 11} stroke={STEEL.line} strokeWidth={4} strokeLinecap="round" />
      ))}
      <line x1={L.x + 12} y1={L.y + L.h - 22} x2={L.x + L.w - 12} y2={L.y + L.h - 22} stroke={alpha(STEEL.line, 0.6)} strokeWidth={3} />
    </g>
  );
}

/** The path of an attempt that has to go to the access point: from the laptop up to the bolted padlock. */
const TRY: [Point, Point, Point, Point] = [
  { x: G.laptop.x + 80, y: G.laptop.y - 14 },
  { x: G.laptop.x + 180, y: G.laptop.y - 60 },
  { x: L.x - 90, y: G.mount.y + 86 },
  { x: L.x + 16, y: G.mount.y + 60 },
];

/**
 * The lab's fixed furniture, inside the caller's stage-wide <svg>: the test tablet (and, at the very
 * end, the others that share its key), the access point on its locker, the severed link towards
 * «a casa» and the attempts that SAE forces through the access point, one at a time.
 */
export function Lab({
  tablet,
  moreTablets,
  ap,
  apGlow,
  cut,
  attempts,
  attemptPath,
  opacity = 1,
}: {
  /** 0–1: how lit the tablet is (it is always drawn). */
  tablet: number;
  /** 0–1: two more tablets fan out behind it («para todos»). */
  moreTablets: number;
  ap: number;
  apGlow: number;
  /** 0–1: the dashed link from the access point to the «a casa» panel, cut in the middle. */
  cut: number;
  attempts: readonly number[];
  attemptPath: number;
  opacity?: number;
}) {
  const T = G.tablet;
  const cutY = G.ap.y;
  const cutA = G.ap.x + 78;
  const cutB = G.panel.x;
  const cutM = (cutA + cutB) / 2 + 12;
  return (
    <g opacity={opacity}>
      {[2, 1].map((k) =>
        moreTablets > 0.001 ? (
          <TabletGlyph key={k} x={T.x + k * 26 * moreTablets} y={T.y - k * 20 * moreTablets} h={T.h} opacity={moreTablets * (1 - 0.22 * k)} screen={0.35} />
        ) : null,
      )}
      <TabletGlyph x={T.x} y={T.y} h={T.h} opacity={0.5 + 0.5 * tablet} screen={0.25 + 0.6 * tablet} glow={0.5 * tablet} />

      <Locker lit={ap} />
      <AccessPointGlyph x={G.ap.x} y={G.ap.y} h={G.ap.h} opacity={0.5 + 0.5 * ap} glow={apGlow} waves={0} />

      {/* «sin conexión con la red»: the link that is not there */}
      {cut > 0.001 ? (
        <g opacity={cut}>
          <line x1={cutA} y1={cutY} x2={cutM - 20} y2={cutY} stroke={STEEL.line} strokeWidth={4} strokeDasharray="4 10" strokeLinecap="round" />
          <line x1={cutM + 20} y1={cutY} x2={cutB} y2={cutY} stroke={STEEL.line} strokeWidth={4} strokeDasharray="4 10" strokeLinecap="round" />
          <line x1={cutM - 14} y1={cutY + 16} x2={cutM - 2} y2={cutY - 16} stroke={STEEL.light} strokeWidth={4} strokeLinecap="round" />
          <line x1={cutM + 2} y1={cutY + 16} x2={cutM + 14} y2={cutY - 16} stroke={STEEL.light} strokeWidth={4} strokeLinecap="round" />
        </g>
      ) : null}

      {/* every attempt, against the access point */}
      {attemptPath > 0.001 ? <path d={cubicPath(TRY)} fill="none" stroke={alpha(C.amber, 0.45 * attemptPath)} strokeWidth={3} strokeDasharray="4 10" strokeLinecap="round" /> : null}
      {attempts.map((t, k) => {
        if (t <= 0.001 || t >= 0.999) return null;
        const p = cubicPoint(TRY, t);
        return (
          <g key={k} opacity={Math.min(1, t * 6, (1 - t) * 6)}>
            <circle cx={p.x} cy={p.y} r={20} fill={alpha(C.amber, 0.18)} />
            <circle cx={p.x} cy={p.y} r={10} fill={C.amber} />
          </g>
        );
      })}
    </g>
  );
}
