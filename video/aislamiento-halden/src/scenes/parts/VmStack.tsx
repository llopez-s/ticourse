import { C, alpha } from '../../../../engine/src/theme/tokens';
import { AppTile, Slab, TILE } from './Software';

interface Layout {
  vw: number;
  tw: number;
  th: number;
  bH: number;
  boxH: number;
  hvY: number;
  hwY: number;
  hwH: number;
  height: number;
}

function layout(width: number, vms: number, tileW: number, labelSize: number): Layout {
  const vw = (width - 14 * (vms - 1)) / vms;
  const tw = Math.min(tileW, vw - 24);
  const th = (tw * TILE.h) / TILE.w;
  const bH = Math.round(labelSize * 1.4);
  const boxH = 10 + th + 6 + bH + 10;
  const hvY = boxH + 6;
  const hwY = hvY + bH + 5;
  const hwH = Math.round(bH * 0.85);
  return { vw, tw, th, bH, boxH, hvY, hwY, hwH, height: hwY + hwH };
}

/** Height VmStack takes. */
export function vmStackHeight(width: number, vms = 2, tileW = 80, labelSize = 22): number {
  return layout(width, vms, tileW, labelSize).height;
}

/**
 * A host running virtual machines: each VM (cyan frame) holds its app and its OWN «kernel» band; all of them sit on the
 * «hypervisor» bar (violet: an exam term) over the «host» hardware. `glow` 0–1 lights the VMs.
 */
export function VmStack({ width, vms = 2, tileW = 80, labelSize = 22, glow = 0 }: { width: number; vms?: number; tileW?: number; labelSize?: number; glow?: number }) {
  const L = layout(width, vms, tileW, labelSize);
  return (
    <div style={{ position: 'relative', width, height: L.height }}>
      <svg width={width} height={L.height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {Array.from({ length: vms }, (_, i) => {
          const x = i * (L.vw + 14);
          return (
            <g key={i}>
              <rect x={x} y={0} width={L.vw} height={L.boxH} rx={14} fill={alpha(C.cyan, 0.05 + 0.08 * glow)} stroke={alpha(C.cyan, 0.55 + 0.4 * glow)} strokeWidth={3} />
              <Slab x={x + 10} y={10 + L.th + 6} w={L.vw - 20} h={L.bH} tone={C.sky} label="kernel" size={labelSize} fill={0.2} stroke={0.8} />
            </g>
          );
        })}
        <Slab x={0} y={L.hvY} w={width} h={L.bH} tone={C.violet} label="hypervisor" size={labelSize} fill={0.16} stroke={0.7} />
        <Slab x={0} y={L.hwY} w={width} h={L.hwH} tone={C.sky} label="host" size={labelSize - 4} fill={0.08} stroke={0.45} />
      </svg>
      {Array.from({ length: vms }, (_, i) => (
        <div key={i} style={{ position: 'absolute', left: i * (L.vw + 14) + (L.vw - L.tw) / 2, top: 10 }}>
          <AppTile width={L.tw} />
        </div>
      ))}
    </div>
  );
}
