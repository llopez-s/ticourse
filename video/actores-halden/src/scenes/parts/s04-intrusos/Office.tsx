import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../../engine/src/theme/motion';
import { mix } from '../../../../../engine/src/ui';
import { OFFICE } from '../../../data/s04-intrusos';
import { ExamChip } from '../Labels';
import { ToolsStrip, VignetteFrame } from './Vignette';

const TILE = { w: 60, h: 70, gap: 16, x: 30, y: 60 } as const;
const tileX = (k: number) => TILE.x + (k % 3) * (TILE.w + TILE.gap);
const tileY = (k: number) => TILE.y + Math.floor(k / 3) * (TILE.h + TILE.gap);
const NOTE = { x: 452, y: 56, w: 366 } as const;

/** One document tile; `enc` 0–1 turns it into a scrambled rose block (cifrado). */
function Doc({ x, y, enc, k }: { x: number; y: number; enc: number; k: number }) {
  const e = enc > 0.5;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: TILE.w,
        height: TILE.h,
        borderRadius: 8,
        boxSizing: 'border-box',
        border: `2px solid ${e ? C.rose : alpha(C.cyan, 0.6)}`,
        background: e
          ? `repeating-linear-gradient(${45 + k * 30}deg, ${alpha(C.rose, 0.55)} 0px, ${alpha(C.rose, 0.55)} 4px, ${C.roseDeep} 4px, ${C.roseDeep} 9px)`
          : alpha(C.cyan, 0.08),
        transform: `scaleX(${Math.max(0.05, Math.abs(Math.cos(Math.PI * enc)))})`,
        padding: '12px 10px',
      }}
    >
      {!e
        ? [0.9, 0.7, 0.85, 0.5].map((w, i) => <div key={i} style={{ width: `${w * 100}%`, height: 6, borderRadius: 3, background: alpha(C.cyan, 0.5), marginBottom: 7 }} />)
        : null}
    </div>
  );
}

/**
 * The first intruder (s04): an office with no name — six documents. On `ransomAt` a rose dot comes in («en horas»);
 * on `encryptAt` (the lock sound) the documents flip one by one into scrambled rose blocks and the stamp «cifrado»
 * lands on them (never a padlock); on `noteAt` the note «o pagáis, / o no recuperáis nada» and the one chip
 * «ransomware». The toolkit strip («zero-day») comes in on `toolsAt`.
 */
export function Office({ frame, ransomAt, encryptAt, noteAt, toolsAt }: { frame: number; ransomAt: number; encryptAt: number; noteAt: number; toolsAt: number }) {
  const inP = progress(frame, ransomAt - 4, 26, EASE.inOut);
  const dotX = mix(800, 268, inP);
  const dotY = mix(150, 128, inP);
  const stamp = progress(frame, encryptAt + 4, 8);
  const note = progress(frame, noteAt, 14);
  return (
    <VignetteFrame label={OFFICE.label}>
      {Array.from({ length: 6 }, (_, k) => (
        <Doc key={k} k={k} x={tileX(k)} y={tileY(k)} enc={progress(frame, encryptAt - 6 + k * 2, 8)} />
      ))}
      {/* the intruder */}
      {frame >= ransomAt - 4 ? (
        <div style={{ position: 'absolute', left: dotX - 16, top: dotY - 16, width: 32, height: 32, borderRadius: 16, background: C.rose, boxShadow: `0 0 18px ${alpha(C.rose, 0.7)}` }} />
      ) : null}
      {frame >= ransomAt + 6 ? (
        <div style={{ position: 'absolute', left: 300, top: 60, fontSize: 28, fontWeight: 800, color: C.roseSoft, whiteSpace: 'nowrap', opacity: progress(frame, ransomAt + 6, 12) * (1 - note) }}>{OFFICE.hours}</div>
      ) : null}
      {/* the stamp «cifrado» */}
      {stamp > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 54,
            top: 104,
            padding: '4px 20px',
            borderRadius: RADIUS.sm,
            border: `4px solid ${C.rose}`,
            background: alpha(C.ink950, 0.85),
            fontFamily: FONT.sans,
            fontSize: 36,
            fontWeight: 900,
            letterSpacing: 2,
            color: C.roseSoft,
            opacity: stamp,
            transform: `rotate(-8deg) scale(${1.5 - 0.5 * stamp})`,
            whiteSpace: 'nowrap',
          }}
        >
          {OFFICE.stamp}
        </div>
      ) : null}
      {/* the note and its one chip */}
      {note > 0 ? (
        <div style={{ position: 'absolute', left: NOTE.x, top: NOTE.y, width: NOTE.w, opacity: note, transform: `rotate(${2 - 2 * note}deg) translateY(${(1 - note) * 14}px)` }}>
          <div style={{ padding: '12px 20px', borderRadius: 6, background: '#f1ece0', boxShadow: `0 10px 22px ${alpha('#000000', 0.4)}`, fontSize: 31, fontWeight: 800, lineHeight: 1.2, color: '#3b0a14', whiteSpace: 'nowrap' }}>
            {OFFICE.note.map((l) => (
              <div key={l}>{l}</div>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <ExamChip text={OFFICE.chip} size={28} on={progress(frame, noteAt + 14, 12)} />
          </div>
        </div>
      ) : null}
      <ToolsStrip show={progress(frame, toolsAt, 14)} />
    </VignetteFrame>
  );
}
