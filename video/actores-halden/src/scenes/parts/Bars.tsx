import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01, mix } from '../../../../engine/src/ui';

/** The three attributes, plain Spanish first and the exam's English under it. */
export const ATTRIBUTES = [
  { plain: 'fuera o dentro', en: 'internal/external' },
  { plain: 'dinero detrás', en: 'resources/funding' },
  { plain: 'saber hacer', en: 'level of sophistication' },
] as const;

/** A fill: solid up to `lo`, hatched from `lo` to `hi` (a range, e.g. the hacktivist's «bajo o medio»). */
export interface Level {
  lo: number;
  hi?: number;
  /** Small note at the end of the track («bajo o medio»). */
  note?: string;
}

export interface BarsProps {
  width: number;
  /** Label column width. */
  labelW: number;
  /** Row height and font sizes: big in s02's template, compact in the case fichas. */
  rowH: number;
  plainSize: number;
  enSize?: number;
  /** 0–1: the English names appear under the plain ones. */
  en?: number;
  /** 0 = fuera, 1 = dentro (may be animated); `sideOn` 0–1 lights the chosen cell. */
  side?: number;
  sideOn?: number;
  money?: Level;
  skill?: Level;
  /** 0–1: how far the fills have run. */
  fill?: number;
  /** 0–1: steps the money and skill rows back (s06: «su ventaja es el acceso»). */
  dimRest?: number;
  /** 0–1 per row: the voice names it. */
  rowOn?: readonly number[];
  tone?: string;
}

const GAP = 10;

/** «fuera | dentro»: a two-cell switch; the lit cell slides with `side`. */
function SideSwitch({ w, h, side, on, size }: { w: number; h: number; side: number; on: number; size: number }) {
  const cell = w / 2;
  const o = clamp01(on);
  return (
    <div style={{ position: 'relative', width: w, height: h, borderRadius: RADIUS.pill, background: C.ink800, border: `2px solid ${C.ink600}`, boxSizing: 'border-box', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          left: mix(0, cell, clamp01(side)),
          top: 0,
          width: cell,
          height: '100%',
          borderRadius: RADIUS.pill,
          background: alpha(C.sky, 0.12 + 0.3 * o),
          border: `2px solid ${alpha(C.sky, 0.3 + 0.6 * o)}`,
          boxSizing: 'border-box',
          boxShadow: o > 0.02 ? `0 0 ${Math.round(18 * o)}px ${alpha(C.sky, 0.35 * o)}` : undefined,
        }}
      />
      {['fuera', 'dentro'].map((t, i) => {
        const lit = i === 0 ? 1 - clamp01(side) : clamp01(side);
        return (
          <div
            key={t}
            style={{
              position: 'absolute',
              left: i * cell,
              top: 0,
              width: cell,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: size,
              fontWeight: 800,
              color: lit * o > 0.5 ? C.textStrong : C.muted,
            }}
          >
            {t}
          </div>
        );
      })}
    </div>
  );
}

/** A track with a solid fill to `lo` and a hatched stretch to `hi`, both run by `fill`. */
function Track({ w, h, level, fill, tone, noteSize }: { w: number; h: number; level?: Level; fill: number; tone: string; noteSize: number }) {
  const lo = level ? level.lo * clamp01(fill) : 0;
  const hi = level?.hi !== undefined ? level.hi * clamp01(fill) : lo;
  const noteW = level?.note ? noteSize * 6.4 : 0;
  const tw = w - noteW;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ position: 'relative', width: tw - (noteW ? 14 : 0), height: h, borderRadius: RADIUS.pill, background: C.ink800, border: `2px solid ${C.ink600}`, boxSizing: 'border-box', overflow: 'hidden' }}>
        {hi > lo ? (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: `${hi * 100}%`,
              background: `repeating-linear-gradient(135deg, ${alpha(tone, 0.55)} 0px, ${alpha(tone, 0.55)} 6px, transparent 6px, transparent 13px)`,
            }}
          />
        ) : null}
        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${lo * 100}%`, borderRadius: RADIUS.pill, background: tone }} />
      </div>
      {level?.note ? (
        <span style={{ fontSize: noteSize, fontWeight: 700, color: C.text, whiteSpace: 'nowrap', opacity: clamp01(fill * 2 - 1) }}>{level.note}</span>
      ) : null}
    </div>
  );
}

/**
 * The actor ficha: three rows — «fuera o dentro» (a switch, never a fill), «dinero detrás» and «saber hacer» (fills) —
 * with the plain label on the left and, once `en` runs, the English under it. Stage-local placement is the caller's.
 */
export function Bars({
  width,
  labelW,
  rowH,
  plainSize,
  enSize = Math.round(plainSize * 0.78),
  en = 0,
  side = 0,
  sideOn = 0,
  money,
  skill,
  fill = 0,
  dimRest = 0,
  rowOn = [0, 0, 0],
  tone = C.sky,
}: BarsProps) {
  const trackW = width - labelW - 20;
  const trackH = Math.round(rowH * 0.5);
  const noteSize = Math.max(24, Math.round(plainSize * 0.85));
  return (
    <div style={{ width, display: 'flex', flexDirection: 'column', gap: GAP, fontFamily: FONT.sans }}>
      {ATTRIBUTES.map((a, i) => {
        const on = clamp01(rowOn[i] ?? 0);
        const dim = i === 0 ? 0 : clamp01(dimRest);
        return (
          <div key={a.plain} style={{ height: rowH, display: 'flex', alignItems: 'center', gap: 20, opacity: 1 - 0.6 * dim }}>
            <div style={{ width: labelW, flexShrink: 0, lineHeight: 1.1, whiteSpace: 'nowrap' }}>
              <div style={{ fontSize: plainSize, fontWeight: 800, color: on > 0.5 ? C.textStrong : C.text, textShadow: on > 0.02 ? `0 0 ${Math.round(16 * on)}px ${alpha(C.sky, 0.5 * on)}` : undefined }}>{a.plain}</div>
              {en > 0.01 ? <div style={{ fontSize: enSize, fontWeight: 750, color: '#c4b5fd', opacity: clamp01(en), marginTop: 2 }}>{a.en}</div> : null}
            </div>
            {i === 0 ? (
              <SideSwitch w={Math.min(trackW, 420)} h={Math.round(rowH * 0.62)} side={side} on={sideOn} size={Math.max(24, Math.round(plainSize * 0.8))} />
            ) : (
              <Track w={trackW} h={trackH} level={i === 1 ? money : skill} fill={fill} tone={tone} noteSize={noteSize} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/** The fourth row, «lo que quiere» (amber: the motive decides), with its exam motive in a small violet line. */
export function WantsRow({ labelW, text, en, show, size = 32 }: { labelW: number; text: string; en: string; show: number; size?: number }) {
  const s = clamp01(show);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, fontFamily: FONT.sans, opacity: 0.25 + 0.75 * s, whiteSpace: 'nowrap' }}>
      <div style={{ width: labelW, flexShrink: 0, fontSize: size - 2, fontWeight: 800, color: C.amber, lineHeight: `${Math.round(size * 1.6)}px` }}>lo que quiere</div>
      <div
        style={{
          padding: '6px 20px',
          borderRadius: RADIUS.md,
          border: `2px solid ${alpha(C.amber, 0.35 + 0.55 * s)}`,
          background: alpha(C.amber, 0.05 + 0.1 * s),
          boxShadow: s > 0.02 ? `0 0 ${Math.round(22 * s)}px ${alpha(C.amber, 0.25 * s)}` : undefined,
        }}
      >
        <div style={{ fontSize: size, fontWeight: 850, color: C.textStrong, opacity: s }}>{text}</div>
        <div style={{ fontSize: Math.round(size * 0.8), fontWeight: 750, color: '#c4b5fd', opacity: s }}>{en}</div>
      </div>
    </div>
  );
}
