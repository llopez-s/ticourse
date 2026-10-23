import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, Redacted, clamp01 } from '../../../../engine/src/ui';
import { RECORD_CHIP } from '../../data/canon';

/** Base size of the full record (it scales with `scale`). */
export const RECORD = { w: 470, h: 300, chipH: 60 } as const;

const ROWS = [
  { label: 'nombre', bar: 230 },
  { label: 'DNI', bar: 200 },
  { label: 'horas', bar: 150 },
] as const;

/**
 * The record of one clock-in («fichaje»): a cyan card with «nombre · DNI · horas», every value a redacted bar (no
 * person, number or time is ever readable), and under it the chip «datos de la plantilla · private» (nobody says who
 * classified it). `rows` 0–1 sweeps the bars in one by one; `chip` 0–1 brings the chip; `dni` 0–1 highlights the DNI
 * row (s04). `scale` shrinks it from its top-left corner.
 */
export function Record({
  rows = 1,
  chip = 1,
  dni = 0,
  scale = 1,
  style,
}: {
  rows?: number;
  chip?: number;
  dni?: number;
  scale?: number;
  style?: CSSProperties;
}) {
  const c = clamp01(chip);
  const d = clamp01(dni);
  return (
    <div style={{ width: RECORD.w * scale, height: (RECORD.h + (c > 0 ? RECORD.chipH + 18 : 0)) * scale, ...style }}>
      <div style={{ width: RECORD.w, transform: `scale(${scale})`, transformOrigin: '0 0', fontFamily: FONT.sans }}>
        <div
          style={{
            boxSizing: 'border-box',
            width: RECORD.w,
            height: RECORD.h,
            padding: '20px 28px',
            borderRadius: RADIUS.lg,
            border: `3px solid ${alpha(C.cyan, 0.75)}`,
            background: `linear-gradient(180deg, ${alpha(C.cyan, 0.12)} 0%, ${C.ink900} 70%)`,
            boxShadow: `0 0 30px ${alpha(C.cyan, 0.18)}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 34, fontWeight: 850, color: C.textStrong }}>
            <Icon name="clock" size={34} color={C.cyan} />
            fichaje
          </div>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 18 }}>
            {ROWS.map((r, i) => {
              const sweep = clamp01(rows * ROWS.length - i);
              const hot = r.label === 'DNI' ? d : 0;
              return (
                <div
                  key={r.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 22,
                    height: 50,
                    padding: '0 12px',
                    marginLeft: -12,
                    borderRadius: RADIUS.sm,
                    background: alpha(C.cyan, 0.16 * hot),
                    boxShadow: hot > 0.02 ? `0 0 0 ${2}px ${alpha(C.cyan, 0.8 * hot)}` : undefined,
                  }}
                >
                  <span style={{ width: 120, fontSize: 34, fontWeight: 750, color: hot > 0.5 ? C.cyanSoft : C.text }}>{r.label}</span>
                  <Redacted width={r.bar} height={28} tone="cyan" strength={0.6} sweep={sweep} />
                </div>
              );
            })}
          </div>
        </div>
        {c > 0.001 ? (
          <div style={{ marginTop: 18, opacity: c, transform: `translateY(${(1 - c) * 10}px)` }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                height: RECORD.chipH,
                padding: '0 26px 0 18px',
                boxSizing: 'border-box',
                borderRadius: RADIUS.pill,
                border: `2px solid ${alpha(C.cyan, 0.7)}`,
                background: alpha(C.cyan, 0.1),
                fontSize: 32,
                fontWeight: 750,
                color: C.textStrong,
                whiteSpace: 'nowrap',
              }}
            >
              <Icon name="users" size={30} color={C.cyan} />
              {RECORD_CHIP}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** The record as a small textless token (it travels through s02's three states). */
export function RecordMini({ width = 90, tone = C.cyan, style }: { width?: number; tone?: string; style?: CSSProperties }) {
  const h = width * 0.7;
  return (
    <svg width={width} height={h} viewBox="0 0 100 70" style={{ overflow: 'visible', ...style }}>
      <rect x={2} y={2} width={96} height={66} rx={10} fill={C.ink850} stroke={tone} strokeWidth={4} />
      <rect x={14} y={16} width={56} height={8} rx={4} fill={alpha(tone, 0.8)} />
      <rect x={14} y={31} width={72} height={8} rx={4} fill={alpha(tone, 0.45)} />
      <rect x={14} y={46} width={44} height={8} rx={4} fill={alpha(tone, 0.45)} />
    </svg>
  );
}
