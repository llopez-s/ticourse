import { C, alpha } from '../../engine/src/theme/tokens';
import { Icon } from '../../engine/src/ui';
import { InventoryList } from './scenes/parts/Inventory';
import { Nas } from './scenes/parts/Nas';

/** The poster's image, in its own units. */
export const POSTER_ART = { w: 760, h: 560 } as const;

const NAS_W = 380;

/**
 * The video in one image: Sistemas' list (rows of grey bars, nothing legible) and, in front, the network disk with its
 * lights on and a rose cross: it is not in the list. No dates, no names, no port.
 */
export function PosterArt() {
  return (
    <div style={{ position: 'relative', width: POSTER_ART.w, height: POSTER_ART.h }}>
      <svg width={POSTER_ART.w} height={POSTER_ART.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <defs>
          <radialGradient id="poster-cyan">
            <stop offset="0%" stopColor={C.cyan} stopOpacity={0.16} />
            <stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={POSTER_ART.w / 2 + 40} cy={POSTER_ART.h / 2} r={380} fill="url(#poster-cyan)" />
      </svg>
      <div style={{ position: 'absolute', left: POSTER_ART.w - 470, top: 0, opacity: 0.9 }}>
        <InventoryList width={470} rows={6} title="lista de equipos" columns={false} />
      </div>
      <div style={{ position: 'absolute', left: 0, top: POSTER_ART.h - (NAS_W * 170) / 220 - 10, filter: `drop-shadow(0 0 26px ${alpha(C.rose, 0.35)})` }}>
        <Nas width={NAS_W} frame={7} tone={C.rose} glow={0.5} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: NAS_W - 50,
          top: POSTER_ART.h - (NAS_W * 170) / 220 - 50,
          width: 84,
          height: 84,
          borderRadius: 42,
          background: C.roseDeep,
          border: `4px solid ${C.rose}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name="x" size={52} color={C.rose} strokeWidth={3} />
      </div>
    </div>
  );
}
