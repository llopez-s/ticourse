import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon } from '../../../../../engine/src/ui';
import { S04_CLUES, S04_SAMPLE } from '../../../data/s04-binario';

const AMBER_SOFT = '#fcd34d';

/** Geometry of the sample card's body (px from the body's top-left). */
export const SAMPLE = { headH: 74, pad: 26, dumpW: 430, rowH: 29, rows: 10, slotX: 540, slotH: 118 } as const;
/** Which dump rows each clue lives in: [first, last]. */
const ZONE = [
  [2, 4],
  [7, 7],
] as const;
const SLOT_Y = [40, 176] as const;

/** Deterministic pseudo-random 0–1 (no Math.random: every render must match). */
const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** One row of the dump: an offset column and a run of blocks. Nothing here is a character. */
function bars(row: number, kind: 'bytes' | 'text' | 'field'): { x: number; w: number }[] {
  const out: { x: number; w: number }[] = [];
  let x = 78;
  if (kind === 'bytes') {
    for (let i = 0; i < 14; i++) {
      out.push({ x, w: 16 });
      x += i % 4 === 3 ? 30 : 22;
    }
  } else if (kind === 'text') {
    for (let i = 0; i < 12; i++) {
      const w = 26 + Math.round(rnd(row * 17 + i) * 58);
      if (x + w > SAMPLE.dumpW - 16) break;
      out.push({ x, w });
      x += w + 12;
    }
  } else {
    for (const w of [58, 40, 74, 46]) {
      out.push({ x, w });
      x += w + 14;
    }
  }
  return out;
}

/**
 * The sample binary on the table: a card whose header is the label «Ejemplo de la lección · no es el caso de
 * Meridian» and whose body is an abstract dump (blocks, never characters) with two clue slots beside it.
 * A clue is OFF — grey blocks, an empty dashed slot — until `clue[i]` (0–1) lights it amber and writes its
 * Spanish phrase. `underline` 0–1 draws the line under «no es el caso de Meridian»; `labelGlow`, `glow` and
 * `pulse[i]` are 0–1 accents; `show` fades the whole card.
 */
export function Sample({ width, height, clue, pulse = [0, 0], underline = 0, labelGlow = 0, glow = 0, show = 1 }: { width: number; height: number; clue: readonly [number, number]; pulse?: readonly [number, number]; underline?: number; labelGlow?: number; glow?: number; show?: number }) {
  if (show <= 0.001) return null;
  const bodyH = height - SAMPLE.headH;
  const top = (bodyH - SAMPLE.rows * SAMPLE.rowH) / 2;
  const slotW = width - SAMPLE.slotX - SAMPLE.pad;
  const zoneOf = (r: number) => ZONE.findIndex(([a, b]) => r >= a && r <= b);
  const zoneBox = (i: number) => ({ y: top + ZONE[i][0] * SAMPLE.rowH - 5, h: (ZONE[i][1] - ZONE[i][0] + 1) * SAMPLE.rowH + 10 });
  return (
    <div style={{ width, height, boxSizing: 'border-box', borderRadius: RADIUS.lg, border: `2px solid ${alpha('#cbd5e1', 0.5 + 0.4 * glow)}`, background: C.ink900, boxShadow: `0 0 ${Math.round(30 * glow)}px ${alpha('#cbd5e1', 0.25 * glow)}, 0 22px 54px ${alpha('#000000', 0.5)}`, fontFamily: FONT.sans, overflow: 'hidden', opacity: show }}>
      {/* The label: the lesson's example, not Meridian's case */}
      <div style={{ height: SAMPLE.headH, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 16, padding: `0 ${SAMPLE.pad}px`, background: alpha('#cbd5e1', 0.1 + 0.06 * labelGlow), borderBottom: `2px solid ${alpha('#cbd5e1', 0.35)}`, fontSize: 38, fontWeight: 800, lineHeight: 1.1, whiteSpace: 'nowrap' }}>
        <Icon name="file" size={40} color={C.text} strokeWidth={2} />
        <span style={{ color: C.text }}>{S04_SAMPLE.lead}</span>
        <span style={{ color: C.faint }}>·</span>
        <span style={{ position: 'relative', fontWeight: 900, color: C.textStrong, textShadow: labelGlow > 0.02 ? `0 0 ${Math.round(18 * labelGlow)}px ${alpha('#ffffff', 0.5 * labelGlow)}` : undefined }}>
          {S04_SAMPLE.not}
          <span style={{ position: 'absolute', left: 0, bottom: -7, height: 4, borderRadius: 2, width: `${underline * 100}%`, background: C.textStrong }} />
        </span>
      </div>
      <div style={{ position: 'relative', height: bodyH }}>
        <svg width={width} height={bodyH} style={{ position: 'absolute', left: 0, top: 0 }}>
          {Array.from({ length: SAMPLE.rows }, (_, r) => {
            const z = zoneOf(r);
            const lit = z >= 0 ? clue[z] : 0;
            const y = top + r * SAMPLE.rowH + SAMPLE.rowH / 2;
            const fill = lit > 0.5 ? alpha(C.amber, 0.9) : alpha(C.faint, 0.6);
            return (
              <g key={r}>
                <rect x={SAMPLE.pad} y={y - 5} width={38} height={10} rx={3} fill={alpha(C.faint, 0.35)} />
                {bars(r, z === 0 ? 'text' : z === 1 ? 'field' : 'bytes').map((b) => (
                  <rect key={b.x} x={SAMPLE.pad + b.x} y={y - 7} width={b.w} height={14} rx={4} fill={fill} />
                ))}
              </g>
            );
          })}
          {/* each clue: its zone in the dump, tied to its slot */}
          {[0, 1].map((i) => {
            if (clue[i] <= 0.001) return null;
            const zb = zoneBox(i);
            const x0 = SAMPLE.pad + 66;
            const x1 = SAMPLE.pad + SAMPLE.dumpW;
            const sy = SLOT_Y[i] + SAMPLE.slotH / 2;
            return (
              <g key={i} opacity={clue[i]}>
                <rect x={x0} y={zb.y} width={x1 - x0} height={zb.h} rx={8} fill={alpha(C.amber, 0.08 + 0.1 * pulse[i])} stroke={alpha(C.amber, 0.9)} strokeWidth={3} />
                <path d={`M ${x1 + 4} ${zb.y + zb.h / 2} C ${x1 + 50} ${zb.y + zb.h / 2}, ${SAMPLE.slotX - 50} ${sy}, ${SAMPLE.slotX - 4} ${sy}`} fill="none" stroke={alpha(C.amber, 0.9)} strokeWidth={4} strokeLinecap="round" strokeDasharray="1 11" />
              </g>
            );
          })}
        </svg>
        {S04_CLUES.map((lines, i) => (
          <div key={i} style={{ position: 'absolute', left: SAMPLE.slotX, top: SLOT_Y[i], width: slotW, height: SAMPLE.slotH, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 28px', borderRadius: RADIUS.md, border: clue[i] > 0.5 ? `3px solid ${alpha(C.amber, 0.9)}` : `2px dashed ${alpha(C.faint, 0.7)}`, background: alpha(C.amber, (0.08 + 0.1 * pulse[i]) * clue[i]), boxShadow: pulse[i] > 0.02 ? `0 0 ${Math.round(26 * pulse[i])}px ${alpha(C.amber, 0.4 * pulse[i])}` : undefined }}>
            {/* off: two grey bars, nothing to read */}
            <div style={{ position: 'absolute', left: 28, top: '50%', marginTop: -19, opacity: 1 - clue[i] }}>
              <div style={{ width: slotW * 0.5, height: 12, borderRadius: 6, background: alpha(C.faint, 0.5) }} />
              <div style={{ marginTop: 14, width: slotW * 0.32, height: 12, borderRadius: 6, background: alpha(C.faint, 0.38) }} />
            </div>
            {lines.map((line) => (
              <div key={line} style={{ fontSize: lines.length > 1 ? 37 : 42, fontWeight: 850, lineHeight: 1.14, letterSpacing: -0.3, color: AMBER_SOFT, whiteSpace: 'nowrap', opacity: clue[i], transform: `translateX(${(1 - clue[i]) * 14}px)` }}>
                {line}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
