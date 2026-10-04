import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, tone as toneOf, type Tone } from '../../../../../engine/src/ui';
import { LENS } from '../../../data/s02-lectura';

export const LENS_W = 690;
export const LENS_H = 236;

export type LensField = 'type' | 'spec' | 'pattern' | 'source' | 'confidence' | 'tlp';

export const LENS_TONE: Record<LensField, Tone> = { type: 'sky', spec: 'violet', pattern: 'rose', source: 'sky', confidence: 'sky', tlp: 'amber' };

/**
 * The magnifier beside the JSON: the field the voice is on, at a readable
 * size, with its plain reading. One card; each field's content cross-fades
 * with its focus weight (`weights`), so it never shows two at once.
 */
export function Lens({ weights }: { weights: Record<LensField, number> }) {
  const fields = Object.keys(weights) as LensField[];
  const total = fields.reduce((n, f) => n + weights[f], 0);
  if (total <= 0.001) return null;
  // Border colour of the strongest field.
  const lead = fields.reduce((a, b) => (weights[b] > weights[a] ? b : a));
  const t = toneOf(LENS_TONE[lead]);
  const show = Math.min(1, total);
  return (
    <div
      style={{
        position: 'relative',
        width: LENS_W,
        height: LENS_H,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(t.fg, 0.8)}`,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        boxShadow: `0 0 34px ${alpha(t.fg, 0.22)}, 0 26px 60px ${alpha('#000000', 0.45)}`,
        fontFamily: FONT.sans,
        opacity: show,
        transform: `scale(${0.96 + 0.04 * show})`,
        transformOrigin: '0 50%',
      }}
    >
      <Slot w={weights.type} caption={LENS.type.key}>
        <div style={{ fontFamily: FONT.mono, fontSize: 56, fontWeight: 800, color: '#bae6fd', letterSpacing: -0.5 }}>{LENS.type.value}</div>
      </Slot>
      <Slot w={weights.spec} caption={LENS.spec.key}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 22 }}>
          <span style={{ fontSize: 76, fontWeight: 900, color: '#c4b5fd', letterSpacing: 1, textShadow: `0 0 26px ${alpha(C.violet, 0.45)}` }}>{LENS.spec.term}</span>
          <span style={{ fontFamily: FONT.mono, fontSize: 52, fontWeight: 800, color: C.textStrong }}>{LENS.spec.value}</span>
        </div>
      </Slot>
      <Slot w={weights.pattern} caption={LENS.pattern.key}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Icon name="globe" size={48} color={C.rose} />
          <span style={{ fontFamily: FONT.mono, fontSize: 40, fontWeight: 800, color: C.roseSoft, letterSpacing: -0.5 }}>{LENS.pattern.value}</span>
        </div>
      </Slot>
      <Slot w={weights.source} caption={LENS.source.key}>
        <div style={{ fontFamily: FONT.mono, fontSize: 30, fontWeight: 700, color: '#bae6fd' }}>{LENS.source.value}</div>
        <div style={{ marginTop: 12, fontSize: 48, fontWeight: 850, color: C.textStrong, letterSpacing: -0.5 }}>{LENS.source.label}</div>
      </Slot>
      <Slot w={weights.confidence} caption={LENS.confidence.key}>
        <div style={{ fontSize: 58, fontWeight: 850, color: C.textStrong, letterSpacing: -0.5 }}>{LENS.confidence.label}</div>
        <Gauge value={70} />
      </Slot>
      <Slot w={weights.tlp} caption={LENS.tlp.key}>
        <div style={{ fontFamily: FONT.mono, fontSize: 28, fontWeight: 700, color: C.muted }}>
          {LENS.tlp.valueLead}
          <span style={{ color: '#fde68a', padding: '0 6px', borderRadius: 6, background: alpha(C.amber, 0.18), boxShadow: `0 0 0 2px ${alpha(C.amber, 0.8)}` }}>{LENS.tlp.valueTlp}</span>
        </div>
        <div style={{ marginTop: 14, fontSize: 46, fontWeight: 850, color: C.textStrong, letterSpacing: -0.5 }}>{LENS.tlp.label}</div>
      </Slot>
    </div>
  );
}

/** One field's content, centred in the lens, faded by its weight. */
function Slot({ w, caption, children }: { w: number; caption: string; children: ReactNode }) {
  if (w <= 0.01) return null;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        padding: '22px 30px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        whiteSpace: 'nowrap',
        opacity: w,
        transform: `translateY(${(1 - w) * 8}px)`,
      }}
    >
      <div style={{ fontFamily: FONT.mono, fontSize: 26, fontWeight: 600, color: C.faint, marginBottom: 10 }}>{caption}</div>
      {children}
    </div>
  );
}

/** Ten segments, seven lit: 70 out of 100 (never a percentage). */
function Gauge({ value }: { value: number }) {
  const n = 10;
  const lit = Math.round(value / 10);
  return (
    <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
      {Array.from({ length: n }, (_, i) => (
        <div
          key={i}
          style={{
            width: 50,
            height: 22,
            borderRadius: 6,
            background: i < lit ? C.sky : alpha(C.ink600, 0.8),
            boxShadow: i < lit ? `0 0 10px ${alpha(C.sky, 0.45)}` : undefined,
          }}
        />
      ))}
    </div>
  );
}
