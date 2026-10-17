import { C, alpha } from '../../engine/src/theme/tokens';
import { BaselineSheet, sheetHeight } from './scenes/parts/BaselineSheet';
import { BridgeArt, CloudArt, LaptopArt, PhoneArt, ServerArt, SwitchArt } from './scenes/parts/Devices';

const SHEET_W = 440;
const SHEET_H = sheetHeight(SHEET_W);

/** The poster's image, in its own units. */
export const POSTER_ART = { w: 760, h: 560 } as const;

const SHEET = { x: (POSTER_ART.w - SHEET_W) / 2, y: (POSTER_ART.h - SHEET_H) / 2 + 10 } as const;

/** The six silhouettes of s01 around the sheet (no names). */
const FLEET = [
  { x: 0, y: 40, el: <LaptopArt width={150} /> },
  { x: 30, y: 230, el: <ServerArt width={104} /> },
  { x: 24, y: 420, el: <PhoneArt width={66} /> },
  { x: 610, y: 36, el: <CloudArt width={150} /> },
  { x: 604, y: 260, el: <SwitchArt width={156} /> },
  { x: 580, y: 420, el: <BridgeArt width={180} /> },
];

/**
 * The video in one image: s01's secure baseline sheet («baseline», its three lines) in front, glowing, and behind it
 * the six things of the port it has to reach, in dim silhouette — laptop, server, phone, cloud, switch and the
 * drawbridge. No dates, no names, no lines between them.
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
        <circle cx={POSTER_ART.w / 2} cy={POSTER_ART.h / 2} r={360} fill="url(#poster-cyan)" />
      </svg>
      {FLEET.map((f, i) => (
        <div key={i} style={{ position: 'absolute', left: f.x, top: f.y, opacity: 0.55, filter: `drop-shadow(0 0 12px ${alpha(C.cyan, 0.25)})` }}>
          {f.el}
        </div>
      ))}
      <div style={{ position: 'absolute', left: SHEET.x, top: SHEET.y, transform: 'rotate(-2deg)' }}>
        <BaselineSheet width={SHEET_W} glow={0.9} />
      </div>
    </div>
  );
}
