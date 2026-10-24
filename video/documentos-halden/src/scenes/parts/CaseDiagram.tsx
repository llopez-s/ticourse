import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, type IconName } from '../../../../engine/src/ui';
import { progress } from '../../../../engine/src/theme/motion';
import { SheetGlyph } from './Paper';

/** Natural size of the case diagram (stage-local px). */
export const CASE = { w: 1200, h: 440 } as const;

function Tile({ x, y, w, h, icon, label, tone, size = 44 }: { x: number; y: number; w: number; h: number; icon: IconName; label: string; tone: string; size?: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(tone, 0.75)}`,
        background: `linear-gradient(180deg, ${alpha(tone, 0.12)} 0%, ${C.ink900} 80%)`,
        boxShadow: `0 0 30px ${alpha(tone, 0.16)}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 850,
        color: C.textStrong,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name={icon} size={Math.round(size * 1.1)} color={tone} strokeWidth={2} />
      {label}
    </div>
  );
}

/**
 * s02's case: the port sends documents out, to shipping lines and to customs. Sheets travel the two dashed paths; when
 * the voice says «cuatro hojas» (`fourAt`) four sheet pictograms stack under the port. No names, no places, no dates.
 */
export function CaseDiagram({ frame, travelFrom, fourAt }: { frame: number; travelFrom: number; fourAt: number }) {
  const t0 = Math.max(0, frame - travelFrom);
  const paths = [
    { d: 'M 310 190 C 520 190, 600 90, 860 90', from: [310, 190], to: [860, 90] },
    { d: 'M 310 250 C 520 250, 600 350, 860 350', from: [310, 250], to: [860, 350] },
  ] as const;
  return (
    <div style={{ position: 'relative', width: CASE.w, height: CASE.h }}>
      <svg width={CASE.w} height={CASE.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {paths.map((p) => (
          <path key={p.d} d={p.d} fill="none" stroke={alpha(C.cyan, 0.55)} strokeWidth={4} strokeDasharray="4 14" strokeLinecap="round" />
        ))}
      </svg>
      <Tile x={0} y={130} w={310} h={180} icon="archive" label="el puerto" tone={C.cyan} />
      <Tile x={860} y={20} w={340} h={140} icon="globe" label="navieras" tone={C.sky} />
      <Tile x={860} y={280} w={340} h={140} icon="shield" label="aduanas" tone={C.sky} />
      {paths.map((p, pi) =>
        [0, 1, 2].map((k) => {
          const u = ((t0 / 90 + k / 3 + pi * 0.17) % 1 + 1) % 1;
          // a gentle ease-in-out along a cubic between the endpoints (same control points as the dashed path)
          const [x0, y0] = p.from;
          const [x3, y3] = p.to;
          const x1 = 520;
          const x2 = 600;
          const y1 = y0;
          const y2 = y3;
          const mt = 1 - u;
          const x = mt * mt * mt * x0 + 3 * mt * mt * u * x1 + 3 * mt * u * u * x2 + u * u * u * x3;
          const y = mt * mt * mt * y0 + 3 * mt * mt * u * y1 + 3 * mt * u * u * y2 + u * u * u * y3;
          const fade = Math.min(1, u * 6, (1 - u) * 6) * progress(frame, travelFrom, 12);
          return (
            <div key={`${pi}-${k}`} style={{ position: 'absolute', left: x - 22, top: y - 28, opacity: fade }}>
              <SheetGlyph width={44} />
            </div>
          );
        }),
      )}
      {/* four sheets, under the port */}
      <div style={{ position: 'absolute', left: 0, top: 330, width: 310, display: 'flex', justifyContent: 'center', gap: 14 }}>
        {[0, 1, 2, 3].map((i) => {
          const p = progress(frame, fourAt + i * 5, 12);
          return (
            <div key={i} style={{ opacity: p, transform: `translateY(${(1 - p) * 14}px)` }}>
              <SheetGlyph width={56} />
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', left: 0, top: 410, width: 310, textAlign: 'center', fontFamily: FONT.sans, fontSize: 30, fontWeight: 750, color: C.cyanSoft, opacity: progress(frame, fourAt + 12, 12) }}>
        cuatro hojas
      </div>
    </div>
  );
}
