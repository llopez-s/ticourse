import type { CSSProperties } from 'react';
import { ACCENT, C, FONT, RADIUS, TYPE, alpha, type Accent } from '../theme/tokens';
import { Icon } from './Icon';

export interface CaseMarker {
  /** Display time, e.g. "01:52". */
  time: string;
  label: string;
  accent?: Accent;
  /** 0 = hidden placeholder, 1 = fully revealed. */
  reveal: number;
}

/**
 * Continuity device for chapter IV (S08–S10): a slim case header that sits at
 * the top of the stage (height 84 px) with the case id, a status chip and the
 * key times of the incident filling in as the investigation reveals them.
 */
export function CaseStrip({
  markers,
  status,
  statusAccent = 'amber',
  width = 1728,
  style,
}: {
  markers: CaseMarker[];
  status: string;
  statusAccent?: Accent;
  width?: number;
  style?: CSSProperties;
}) {
  const s = ACCENT[statusAccent];
  return (
    <div
      style={{
        width,
        height: 84,
        display: 'flex',
        alignItems: 'center',
        gap: 28,
        padding: '0 28px',
        borderRadius: RADIUS.lg,
        background: alpha(C.ink850, 0.92),
        border: `2px solid ${C.ink700}`,
        fontFamily: FONT.sans,
        ...style,
      }}
    >
      <Icon name="flag" size={32} color={C.cyan} />
      <div style={{ whiteSpace: 'nowrap' }}>
        <div style={{ fontSize: TYPE.micro, color: C.muted, fontWeight: 650, letterSpacing: 1.5 }}>AUTORIDAD PORTUARIA DE HALDEN</div>
        <div style={{ fontSize: TYPE.label, color: C.textStrong, fontWeight: 800, fontFamily: FONT.mono }}>CASO 0412</div>
      </div>
      <div
        style={{
          padding: '8px 18px',
          borderRadius: RADIUS.pill,
          border: `2px solid ${alpha(s.fg, 0.7)}`,
          background: alpha(s.fg, 0.12),
          color: s.soft,
          fontSize: TYPE.micro,
          fontWeight: 750,
          letterSpacing: 1,
          whiteSpace: 'nowrap',
        }}
      >
        {status}
      </div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
        {markers.map((marker) => {
          const a = ACCENT[marker.accent ?? 'cyan'];
          const r = Math.max(0, Math.min(1, marker.reveal));
          return (
            <div
              key={marker.time}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '8px 16px',
                borderRadius: RADIUS.md,
                border: `2px ${r > 0 ? 'solid' : 'dashed'} ${r > 0 ? alpha(a.fg, 0.4 + 0.5 * r) : C.ink600}`,
                background: alpha(a.fg, 0.1 * r),
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontFamily: FONT.mono, fontSize: TYPE.label, fontWeight: 750, color: r > 0 ? a.soft : C.faint }}>
                {r > 0 ? marker.time : '--:--'}
              </span>
              <span style={{ fontSize: TYPE.micro, color: C.text, fontWeight: 600, opacity: r }}>{marker.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
