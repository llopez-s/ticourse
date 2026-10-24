import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { Icon } from '../../../../engine/src/ui';
import { STATION_KINDS, StationGlyph, gearPath } from './Glyphs';

/** The incident, then contained: an amber alert ring that crossfades into an emerald shield ring. `contained` 0–1. */
export function IncidentRing({ size, contained, label, labelSize, labelSet, hot = 0, style }: { size: number; contained: number; label: [string, string]; labelSize: number; labelSet?: number; hot?: number; style?: CSSProperties }) {
  const ringStyle = (color: string, o: number): CSSProperties => ({
    position: 'absolute',
    inset: 0,
    borderRadius: size / 2,
    display: 'grid',
    placeItems: 'center',
    background: alpha(color, 0.1),
    border: `${Math.max(3, size * 0.03)}px solid ${alpha(color, 0.85)}`,
    boxShadow: `0 0 ${Math.round(size * (0.2 + 0.25 * hot))}px ${alpha(color, 0.3 + 0.3 * hot)}`,
    opacity: o,
  });
  return (
    <div style={{ width: size, display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: FONT.sans, ...style }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <div style={ringStyle(C.amber, 1 - contained)}>
          <Icon name="alert" size={size * 0.52} color={C.amber} strokeWidth={2} />
        </div>
        <div style={ringStyle(C.emerald, contained)}>
          <Icon name="shield" size={size * 0.52} color={C.emerald} strokeWidth={2} />
        </div>
      </div>
      <div style={{ position: 'relative', marginTop: 12, height: labelSize * 1.2, width: 400, textAlign: 'center', fontSize: labelSize, fontWeight: 850 }}>
        <span style={{ position: 'absolute', left: 0, width: '100%', color: C.amber, opacity: 1 - contained, whiteSpace: 'nowrap' }}>{label[0]}</span>
        <span style={{ position: 'absolute', left: 0, width: '100%', color: C.emerald, opacity: contained, whiteSpace: 'nowrap', textShadow: labelSet ? `0 0 ${Math.round(18 * labelSet)}px ${alpha(C.emerald, 0.7 * labelSet)}` : undefined }}>{label[1]}</span>
      </div>
    </div>
  );
}

/** The evidence box: an archive box with files dropping into it. `files` 0–1 fills it; `glow` lights it. */
export function EvidenceBox({ size, files = 1, glow = 0, label, labelSize, style }: { size: number; files?: number; glow?: number; label: string; labelSize: number; style?: CSSProperties }) {
  const n = 3;
  return (
    <div style={{ width: size, display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: FONT.sans, ...style }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: size * 0.22, display: 'grid', placeItems: 'center', border: `${Math.max(3, size * 0.03)}px solid ${alpha(C.sky, 0.6 + 0.35 * glow)}`, background: alpha(C.sky, 0.08 + 0.1 * glow), boxShadow: `0 0 ${Math.round(size * (0.12 + 0.3 * glow))}px ${alpha(C.sky, 0.25 + 0.25 * glow)}` }}>
          <Icon name="archive" size={size * 0.56} color={C.sky} strokeWidth={2} />
        </div>
        {Array.from({ length: n }, (_, i) => {
          const f = Math.max(0, Math.min(1, files * (n + 1) - i));
          return (
            <div key={i} style={{ position: 'absolute', left: size * (0.2 + i * 0.22), top: size * (-0.34 + 0.3 * f), opacity: f * (1 - 0.7 * (f > 0.98 ? 1 : 0)) }}>
              <Icon name="file" size={size * 0.2} color={C.sky} strokeWidth={2.2} />
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 12, width: 520, textAlign: 'center', fontSize: labelSize, fontWeight: 850, color: C.sky, whiteSpace: 'nowrap' }}>{label}</div>
    </div>
  );
}

/**
 * One gear (rotating ring of teeth) with a static inner disc. `angle` in degrees; the first tooth points up at 0.
 * Children go inside the disc (centred).
 */
export function Gear({ cx, cy, teeth, rOut, rIn, rDisc, angle, tone, children, glow = 0, show = 1 }: { cx: number; cy: number; teeth: number; rOut: number; rIn: number; rDisc: number; angle: number; tone: string; children?: ReactNode; glow?: number; show?: number }) {
  const R = rOut + 6;
  return (
    <div style={{ position: 'absolute', left: cx - R, top: cy - R, width: 2 * R, height: 2 * R, opacity: show }}>
      <svg width={2 * R} height={2 * R} viewBox={`${-R} ${-R} ${2 * R} ${2 * R}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', filter: glow > 0.02 ? `drop-shadow(0 0 ${Math.round(24 * glow)}px ${alpha(tone, 0.4 * glow)})` : undefined }} aria-hidden>
        <g transform={`rotate(${angle})`}>
          <path d={gearPath(teeth, rOut, rIn)} fill={alpha(tone, 0.14)} stroke={tone} strokeWidth={4} strokeLinejoin="round" />
        </g>
        <circle r={rDisc} fill={C.ink900} stroke={alpha(tone, 0.7)} strokeWidth={3} />
      </svg>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 2 * R, height: 2 * R, display: 'grid', placeItems: 'center' }}>{children}</div>
    </div>
  );
}

/** The six station glyphs on a ring inside the big gear (static: the cycle in miniature). */
export function GlyphRing({ radius, size, lit = 1, tone = C.cyan }: { radius: number; size: number; lit?: number; tone?: string }) {
  return (
    <div style={{ position: 'relative', width: 0, height: 0 }}>
      {STATION_KINDS.map((k, i) => {
        const a = (-90 + i * 60) * (Math.PI / 180);
        const on = Math.max(0, Math.min(1, lit * 6 - i));
        return (
          <div key={k} style={{ position: 'absolute', left: radius * Math.cos(a) - size / 2, top: radius * Math.sin(a) - size / 2, width: size, height: size, opacity: on, transform: `scale(${0.6 + 0.4 * on})` }}>
            <StationGlyph kind={k} size={size} color={i === 0 || i === 5 ? C.amber : tone} strokeWidth={3.4} />
          </div>
        );
      })}
    </div>
  );
}
