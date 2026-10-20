import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../../engine/src/ui';

export const FOLDER = { w: 440, h: 300 } as const;
/** Where the staff gather round the folder (crowd icons), in the folder's units. */
const CROWD: [number, number][] = [
  [10, 40], [92, -6], [176, -22], [262, -22], [346, -6], [410, 52], [412, 150], [6, 140],
];

/**
 * The department's shared folder (s02): a cyan folder with three documents peeking out (grey bars, nothing readable),
 * no area or server name. `open` 0–1 brings the whole staff round it (user icons, rose) and `flash` 0–1 is the error
 * flash of «abierta a toda la plantilla».
 */
export function Folder({ open = 0, flash = 0 }: { open?: number; flash?: number }) {
  const o = clamp01(open);
  const f = clamp01(flash);
  return (
    <div style={{ position: 'relative', width: FOLDER.w, height: FOLDER.h }}>
      <svg width={FOLDER.w} height={FOLDER.h} viewBox={`0 0 ${FOLDER.w} ${FOLDER.h}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {/* back of the folder and its tab */}
        <path d="M 70 70 L 170 70 L 192 94 L 370 94 L 370 270 L 70 270 Z" fill={C.cyanDeep} stroke={C.cyan} strokeWidth={4} strokeLinejoin="round" />
        {/* documents */}
        {[0, 1, 2].map((k) => (
          <g key={k} transform={`translate(${104 + k * 70} ${70 - k * 6}) rotate(${-6 + k * 6})`}>
            <rect x={0} y={0} width={150} height={150} rx={8} fill="#e2e8f0" stroke="#94a3b8" strokeWidth={3} />
            {[0, 1, 2, 3].map((r) => (
              <rect key={r} x={18} y={22 + r * 22} width={[100, 80, 112, 60][r]} height={9} rx={4} fill={alpha('#334155', 0.5)} />
            ))}
          </g>
        ))}
        {/* front of the folder */}
        <path d="M 60 130 L 380 130 L 368 278 L 72 278 Z" fill={alpha(C.cyan, 0.85)} stroke={C.cyanSoft} strokeWidth={4} strokeLinejoin="round" />
        <path d="M 60 130 L 380 130 L 368 278 L 72 278 Z" fill={alpha(C.rose, 0.55 * f)} />
        {f > 0.01 ? <path d="M 60 130 L 380 130 L 368 278 L 72 278 Z" fill="none" stroke={C.rose} strokeWidth={6} opacity={f} style={{ filter: `drop-shadow(0 0 16px ${alpha(C.rose, 0.8)})` }} /> : null}
      </svg>
      {CROWD.map(([x, y], k) => {
        const show = clamp01(o * CROWD.length - k * 0.7);
        if (show <= 0.01) return null;
        return (
          <div
            key={k}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: 58,
              height: 58,
              borderRadius: 29,
              background: alpha(C.roseDeep, 0.85),
              border: `2px solid ${alpha(C.rose, 0.8)}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: show,
              transform: `scale(${0.5 + 0.5 * show})`,
            }}
          >
            <Icon name="user" size={34} color={C.roseSoft} />
          </div>
        );
      })}
    </div>
  );
}
