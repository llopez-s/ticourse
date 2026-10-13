import { C } from '../../../../../engine/src/theme/tokens';
import { mix } from '../../../../../engine/src/ui';
import { G } from '../../../data/s03-apreton';
import { PadlockGlyph, STEEL } from '../Glyphs';

/** Dial columns and tick rows of the padlock, in its design units (see PadlockGlyph). */
const DIALS = [-27, -9, 9, 27];
const ROWS = [17, 26, 35];

/**
 * The combination padlock of the scene, inside the caller's stage-wide <svg>. ONE padlock:
 * - loose and amber in the «a casa» panel (`travel` = 0): the captured handshake, carried home;
 * - on its way to the dock locker (`travel` 0–1), where it is bolted (`bolted` 0–1) and emerald: SAE.
 * It never opens. `trying` ≥ 0 is a step counter that moves a bright tick down each dial (somebody
 * tries combinations); −1 leaves the dials still.
 */
export function ScenePadlock({ show, travel, bolted, trying, glow }: { show: number; travel: number; bolted: number; trying: number; glow: number }) {
  if (show <= 0.001) return null;
  const x = mix(G.home.x, G.mount.x, travel);
  const y = mix(G.home.y, G.mount.y, travel) - 60 * Math.sin(Math.PI * travel);
  const h = mix(G.home.h, G.mount.h, travel) * (0.8 + 0.2 * Math.min(1, show));
  const green = Math.max(0, Math.min(1, travel * 2 - 1));
  const ticks =
    trying >= 0 ? (
      <g>
        {DIALS.map((cx, k) => {
          const row = ROWS[(trying + k * 2 + Math.floor(trying / (k + 2))) % 3];
          return <rect key={cx} x={cx - 6} y={row - 2.5} width={12} height={5} rx={2} fill={C.textStrong} />;
        })}
      </g>
    ) : null;
  return (
    <g opacity={Math.min(1, show * 1.5)}>
      {green < 0.999 ? (
        <PadlockGlyph x={x} y={y} h={h} tone={C.amber} glow={glow * (1 - green)} bolted={bolted}>
          {ticks}
        </PadlockGlyph>
      ) : null}
      {green > 0.001 ? <PadlockGlyph x={x} y={y} h={h} tone={C.emerald} opacity={green} glow={glow * green} bolted={bolted} /> : null}
    </g>
  );
}

/** Where the padlock was, in the «a casa» panel: dashed grey (it is not there: nothing to try at home). */
export function PadlockGhost({ show }: { show: number }) {
  if (show <= 0.001) return null;
  const s = G.home.h / 140;
  return (
    <g transform={`translate(${G.home.x} ${G.home.y}) scale(${s})`} opacity={show}>
      <path d="M -24 -8 V -40 a 24 24 0 0 1 48 0 V -8" fill="none" stroke={STEEL.line} strokeWidth={5} strokeDasharray="7 9" strokeLinecap="round" />
      <rect x={-42} y={-12} width={84} height={76} rx={12} fill="none" stroke={STEEL.line} strokeWidth={4} strokeDasharray="8 9" strokeLinecap="round" />
    </g>
  );
}
