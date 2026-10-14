import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE } from '../../../../../engine/src/theme/motion';
import { G } from '../../../data/s03-apreton';
import { STEEL } from '../Glyphs';

const { x0, x1, ys } = G.lanes;
const MID = G.title.x;
/** Where a recorded copy lands: the top of the test laptop's lid. */
const EAR_END = G.laptop.y - 52;
const R = 23;

const ease = (t: number) => EASE.inOut(Math.max(0, Math.min(1, t)));

/** A numbered message disc. */
function Disc({ x, y, n, tone, r = R }: { x: number; y: number; n?: number; tone: string; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r + 7} fill={alpha(tone, 0.16)} />
      <circle cx={x} cy={y} r={r} fill={C.ink900} stroke={tone} strokeWidth={3.5} />
      {n !== undefined ? (
        <text x={x} y={y + r * 0.42} textAnchor="middle" fontFamily={FONT.sans} fontSize={r * 1.25} fontWeight={850} fill={C.textStrong}>
          {n}
        </text>
      ) : null}
    </g>
  );
}

/** An arrowhead at (x, y) pointing left (dir −1) or right (dir 1). */
function Head({ x, y, dir, tone }: { x: number; y: number; dir: 1 | -1; tone: string }) {
  return <path d={`M ${x - dir * 16} ${y - 10} L ${x} ${y} L ${x - dir * 16} ${y + 10}`} fill="none" stroke={tone} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />;
}

/**
 * The exchange between the tablet (left) and the access point (right), drawn inside the caller's
 * stage-wide <svg>.
 * - WPA2: four numbered messages (1 and 3 from the access point, 2 and 4 from the tablet), each on its
 *   own lane. `msgs[i]` 0–1 is how far message i+1 has travelled; it then rests at its far end.
 * - SAE: the two middle lanes, each crossed both ways at once (`pass[k]` 0–1): equals, at the same time.
 * - Whoever is near records: a dashed tap line down to the test laptop (`ear`), and a copy of each
 *   message sliding down it (`drops[i]`, `dropsSae[k]` 0–1). The WPA2 copies carry their number; the
 *   SAE ones are blank.
 */
export function Exchange({
  msgs,
  drops,
  wpa2,
  sae,
  pass,
  dropsSae,
  ear,
  opacity = 1,
}: {
  msgs: readonly number[];
  drops: readonly number[];
  wpa2: number;
  sae: number;
  pass: readonly number[];
  dropsSae: readonly number[];
  ear: number;
  opacity?: number;
}) {
  const span = x1 - x0;
  return (
    <g opacity={opacity}>
      {/* the tap: whoever is near hears every message */}
      {ear > 0.001 ? (
        <g opacity={ear}>
          <line x1={MID} y1={ys[0] + (ys[1] - ys[0]) * sae - 30} x2={MID} y2={EAR_END} stroke={STEEL.light} strokeWidth={3} strokeDasharray="5 9" strokeLinecap="round" />
          <path d={`M ${MID - 9} ${EAR_END - 12} L ${MID} ${EAR_END} L ${MID + 9} ${EAR_END - 12}`} fill="none" stroke={STEEL.light} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ) : null}

      {/* WPA2: four numbered messages */}
      {wpa2 > 0.001 ? (
        <g opacity={wpa2}>
          {ys.map((y, i) => {
            const t = ease(msgs[i]);
            if (msgs[i] <= 0.001) return null;
            const fromAp = i % 2 === 0;
            const tone = fromAp ? C.sky : C.cyan;
            const a = fromAp ? x1 : x0;
            const dir = fromAp ? -1 : 1;
            // The disc stops short of the far end so the arrowhead stays visible.
            const x = a + dir * (R + 4 + (span - 2 * R - 44) * t);
            return (
              <g key={i}>
                <line x1={a} y1={y} x2={a + dir * (span - 6) * t} y2={y} stroke={alpha(tone, 0.55)} strokeWidth={4} strokeLinecap="round" />
                {t > 0.98 ? <Head x={a + dir * span} y={y} dir={dir} tone={tone} /> : null}
                <Disc x={x} y={y} n={i + 1} tone={tone} />
              </g>
            );
          })}
          {ys.map((y, i) => {
            const d = drops[i];
            if (d <= 0.001 || d >= 0.999) return null;
            return (
              <g key={i} opacity={Math.min(1, d * 5, (1 - d) * 5)}>
                <Disc x={MID} y={y + (EAR_END - 16 - y) * ease(d)} n={i + 1} tone={C.amber} r={14} />
              </g>
            );
          })}
        </g>
      ) : null}

      {/* SAE: both sides at once, on the two middle lanes */}
      {sae > 0.001 ? (
        <g opacity={sae}>
          {[ys[1], ys[2]].map((y, k) => {
            const t = ease(pass[k]);
            const reach = (span - 2 * R - 44) * t;
            return (
              <g key={k} opacity={0.35 + 0.65 * Math.min(1, pass[k] * 4)}>
                <line x1={x0} y1={y} x2={x1} y2={y} stroke={alpha(C.emerald, 0.5)} strokeWidth={4} strokeLinecap="round" />
                <Head x={x0} y={y} dir={-1} tone={C.emerald} />
                <Head x={x1} y={y} dir={1} tone={C.emerald} />
                <Disc x={x0 + R + 22 + reach} y={y} tone={C.emerald} r={15} />
                <Disc x={x1 - R - 22 - reach} y={y} tone={C.emerald} r={15} />
              </g>
            );
          })}
          {[ys[1], ys[2]].map((y, k) => {
            const d = dropsSae[k];
            if (d <= 0.001 || d >= 0.999) return null;
            return (
              <g key={k} opacity={Math.min(1, d * 5, (1 - d) * 5)}>
                <Disc x={MID} y={y + (EAR_END - 16 - y) * ease(d)} tone={STEEL.light} r={13} />
              </g>
            );
          })}
        </g>
      ) : null}
    </g>
  );
}
