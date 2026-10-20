import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../../engine/src/ui';
import { blend } from '../Software';

/** The room (group-local px). */
export const ROOM = { w: 640, h: 520 } as const;
const HOST = { x: 28, w: 584, h: 176 } as const;
const HOST_Y = [96, 316];
const VM = { w: 122, h: 112, gap: 18 } as const;
const VM_X0 = HOST.x + (HOST.w - (4 * VM.w + 3 * VM.gap)) / 2;

/** Centre of the right edge of a VM tile (row, col) in room coordinates, for leader lines. */
export function vmAnchor(row: number, col: number): { x: number; y: number } {
  return { x: VM_X0 + col * (VM.w + VM.gap) + VM.w, y: HOST_Y[row] + 22 + VM.h / 2 };
}

/**
 * The port's data centre in schematic: a dashed room «centro de datos del puerto» with two hosts, four virtual machines
 * each, all on (no count is ever written). `lit[k]` 0–1 lights the VM `apps[k]` (the two office apps of s01).
 */
export function DataCenter({
  label,
  show = 1,
  on = 0,
  apps,
  lit,
}: {
  label: string;
  show?: number;
  /** The VMs switching on, 0–1. */
  on?: number;
  apps: readonly { row: number; col: number }[];
  lit: number[];
}) {
  const litAt = (r: number, c: number) => {
    const k = apps.findIndex((a) => a.row === r && a.col === c);
    return k < 0 ? 0 : clamp01(lit[k] ?? 0);
  };
  return (
    <div style={{ position: 'relative', width: ROOM.w, height: ROOM.h, opacity: show }}>
      <svg width={ROOM.w} height={ROOM.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <rect x={2} y={2} width={ROOM.w - 4} height={ROOM.h - 4} rx={24} fill={alpha(C.sky, 0.04)} stroke={alpha(C.sky, 0.5)} strokeWidth={3} strokeDasharray="16 10" />
        {HOST_Y.map((hy, r) => (
          <g key={r}>
            <rect x={HOST.x} y={hy} width={HOST.w} height={HOST.h} rx={16} fill={alpha(C.sky, 0.06)} stroke={alpha(C.sky, 0.45)} strokeWidth={3} />
            <rect x={HOST.x + 16} y={hy + HOST.h - 30} width={HOST.w - 32} height={16} rx={8} fill={alpha(C.sky, 0.25)} />
            {[0, 1, 2, 3].map((c) => {
              const l = litAt(r, c);
              const tone = blend(C.cyanDeep, C.cyan, 0.35 * clamp01(on) + 0.65 * l);
              const x = VM_X0 + c * (VM.w + VM.gap);
              const y = hy + 22;
              return (
                <g key={c}>
                  {l > 0.01 ? <rect x={x - 8} y={y - 8} width={VM.w + 16} height={VM.h + 16} rx={20} fill={alpha(C.cyan, 0.2 * l)} /> : null}
                  <rect x={x} y={y} width={VM.w} height={VM.h} rx={14} fill={blend(C.ink850, C.cyan, 0.06 + 0.12 * l)} stroke={tone} strokeWidth={3 + 2 * l} />
                  <rect x={x + 16} y={y + 18} width={VM.w - 32} height={44} rx={6} fill={alpha(tone, 0.25 + 0.3 * l)} />
                  <circle cx={x + VM.w - 22} cy={y + VM.h - 22} r={7} fill={alpha(C.emerald, 0.5 + 0.5 * clamp01(on))} />
                  <text x={x + 16} y={y + VM.h - 14} fontFamily={FONT.sans} fontSize={24} fontWeight={800} fill={alpha(C.text, 0.75 + 0.25 * l)}>
                    VM
                  </text>
                </g>
              );
            })}
          </g>
        ))}
      </svg>
      <div style={{ position: 'absolute', left: 28, top: 24, display: 'flex', alignItems: 'center', gap: 12, fontFamily: FONT.sans, fontSize: 32, fontWeight: 750, color: '#7dd3fc', whiteSpace: 'nowrap' }}>
        <Icon name="server" size={32} color={C.sky} />
        {label}
      </div>
    </div>
  );
}
