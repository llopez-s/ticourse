import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';
import { HostStack, TILE } from '../Software';

const W = 440;
const X = (1728 - W) / 2;
const Y = 214;
const TW = (W - 36) / 2;

/**
 * The proposal of s04 before the ladder: ONE host with two apps on its shared kernel — «tablón» and, arriving on its
 * word, «expedientes» (amber: the question mark of the proposal). Fades out when the ladder comes in.
 */
export function ProposalSketch({ show, files }: { show: number; files: number }) {
  const s = clamp01(show);
  const f = clamp01(files);
  const label = (text: string, i: number, color: string, o: number) => (
    <div style={{ position: 'absolute', left: X + 12 + i * (TW + 12) + TW / 2, top: Y - 50, transform: 'translateX(-50%)', fontFamily: FONT.sans, fontSize: 32, fontWeight: 850, color, opacity: o, whiteSpace: 'nowrap' }}>
      {text}
    </div>
  );
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: s }}>
      {label('tablón', 0, C.cyanSoft, 1)}
      {label('expedientes', 1, '#fcd34d', f)}
      <div style={{ position: 'absolute', left: X, top: Y }}>
        <HostStack width={W} tiles={2} labelSize={26} hostLabel="host · un servidor" />
      </div>
      {/* the second app arrives dashed, amber: still only a proposal */}
      <div
        style={{
          position: 'absolute',
          left: X + 12 + TW + 12 - 6,
          top: Y - 6,
          width: TW + 12,
          height: (TW * TILE.h) / TILE.w + 12,
          borderRadius: 18,
          border: `4px dashed ${alpha(C.amber, 0.9 * f)}`,
          background: alpha(C.ink900, 0.5 * (1 - f)),
        }}
      />
    </div>
  );
}
