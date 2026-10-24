import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { Crate, OfficeBuilding, PortBuilding, Rope } from './Art';

/**
 * The video's lead image, drawn still for the poster and the end card: the port's building, the crate of documents that
 * left for a nameless office and the rope that still ties them, with «responsabilidad» on it. 800×560 in its own
 * coordinates; `scale` shrinks it. No names, no dates.
 */
export const ROPE_SCENE = { w: 800, h: 560 } as const;

export function RopeScene({ scale = 1 }: { scale?: number }) {
  const ground = 500;
  const portW = 190;
  const officeW = 196;
  const crateW = 124;
  const crateX = 452;
  const crateY = ground - 104 * (crateW / 130);
  const anchor = { x: 20 + portW - 6, y: ground - 42 };
  const grip = { x: crateX + 6, y: crateY + 70 };
  return (
    <div style={{ position: 'relative', width: ROPE_SCENE.w * scale, height: ROPE_SCENE.h * scale }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: ROPE_SCENE.w, height: ROPE_SCENE.h, transform: `scale(${scale})`, transformOrigin: '0 0' }}>
        <div style={{ position: 'absolute', left: 0, top: ground, width: ROPE_SCENE.w, height: 4, borderRadius: 2, background: alpha(C.ink500, 0.8) }} />
        <div style={{ position: 'absolute', left: 20, top: ground - (portW * 330) / 220 }}>
          <PortBuilding width={portW} lit={1} />
        </div>
        <div style={{ position: 'absolute', left: 596, top: ground - (officeW * 230) / 220 }}>
          <OfficeBuilding width={officeW} lit={1} />
        </div>
        <Rope x1={anchor.x} y1={anchor.y} x2={grip.x} y2={grip.y} sag={14} draw={1} w={ROPE_SCENE.w} h={ROPE_SCENE.h} />
        <div style={{ position: 'absolute', left: crateX, top: crateY }}>
          <Crate width={crateW} />
        </div>
        <div style={{ position: 'absolute', left: (anchor.x + grip.x) / 2, top: Math.min(anchor.y, grip.y) - 56, transform: 'translateX(-50%)', fontFamily: FONT.sans, fontSize: 40, fontWeight: 800, color: C.amber, whiteSpace: 'nowrap' }}>responsabilidad</div>
      </div>
    </div>
  );
}
