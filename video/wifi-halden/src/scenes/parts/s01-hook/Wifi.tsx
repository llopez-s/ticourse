import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';
import { AccessPointGlyph, TabletGlyph } from '../Glyphs';

/**
 * «El wifi de las tabletas» (s01, from the first frame): one access point and three crane
 * tablets joined to it. `waves` 0–1 draws the access point's signal; `shared` 0–1 per tablet
 * turns its screen amber, the same on all three (one key that the whole terminal knows: a
 * finding). No key is drawn: the padlock and the stairwell code belong to later scenes.
 */
export const WIFI = { w: 400, h: 260 } as const;

const AP = { x: 200, y: 84, h: 78 } as const;
const TABLETS = [70, 200, 330] as const;
const TABLET = { y: 196, h: 116 } as const;

export function WifiHero({ waves = 1, shared = [0, 0, 0] }: { waves?: number; shared?: number[] }) {
  return (
    <svg width={WIFI.w} height={WIFI.h} viewBox={`0 0 ${WIFI.w} ${WIFI.h}`} style={{ display: 'block', overflow: 'visible' }}>
      {/* the links: every tablet on the same network */}
      {TABLETS.map((x) => (
        <line key={x} x1={AP.x + (x - AP.x) * 0.18} y1={AP.y + 20} x2={x} y2={TABLET.y - TABLET.h / 2 - 6} stroke={alpha(C.sky, 0.55)} strokeWidth={3} strokeLinecap="round" strokeDasharray="3 9" />
      ))}
      <AccessPointGlyph x={AP.x} y={AP.y} h={AP.h} waves={waves} />
      {TABLETS.map((x, i) => {
        const s = clamp01(shared[i] ?? 0);
        return (
          <TabletGlyph key={x} x={x} y={TABLET.y} h={TABLET.h} screen={0.45 + 0.25 * s}>
            {s > 0.01 ? <rect x={-41} y={-58} width={82} height={108} rx={5} fill={alpha(C.amber, 0.3)} stroke={C.amber} strokeWidth={4} opacity={s} /> : null}
          </TabletGlyph>
        );
      })}
    </svg>
  );
}
