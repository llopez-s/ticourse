import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { enter, progress } from '../../../../../engine/src/theme/motion';
import { clamp01 } from '../../../../../engine/src/ui';
import { CLOUD_TITLE, CUSTOMER, GAP, MIDDLE, MODEL, PROVIDER, type Lit } from '../../../data/s04-nube';
import { CloudShape } from '../Cloud';
import { Pill, TermPill } from '../Labels';

export const LAYERS_W = 1288;
/** Vertical layout of the panel (panel-local). */
export const BAND = {
  head: { y: 0, h: 58 },
  customer: { y: 70, h: 176 },
  gap: { y: 254, h: 58 },
  middle: { y: 320, h: 58 },
  provider: { y: 386, h: 140 },
} as const;

export interface LayerTimes {
  cloud: number;
  below: number;
  middle: number;
  above: number;
  always: number;
  reflex: number;
  model: number;
  strip: number;
  /** From here the middle and provider strips fold away (the key list takes their place). */
  sprawl: number;
  wordAt: (seg: string, word: string) => number;
}

function Band({ y, h, tone, show, dim = 1, children }: { y: number; h: number; tone: string; show: number; dim?: number; children?: ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: y,
        width: LAYERS_W,
        height: h,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(tone, 0.6)}`,
        background: alpha(tone, 0.08),
        opacity: clamp01(show) * dim,
        transform: `translateY(${(1 - clamp01(show)) * 14}px)`,
      }}
    >
      {children}
    </div>
  );
}

/** A row of items, each lit on its word. */
function LitRow({ items, frame, wordAt, color, size = 36 }: { items: Lit[]; frame: number; wordAt: LayerTimes['wordAt']; color: string; size?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: size, fontWeight: 800, whiteSpace: 'nowrap' }}>
      {items.map((it, i) => (
        <span key={it.text} style={{ color, opacity: 0.25 + 0.75 * progress(frame, wordAt(it.seg, it.word) - 4, 10) }}>
          {it.text}
          {i < items.length - 1 ? <span style={{ color: C.faint, marginLeft: 18 }}>·</span> : null}
        </span>
      ))}
    </div>
  );
}

/**
 * The cloud in three strips (panel-local, LAYERS_W wide): «cliente» on top (cyan: configuración · datos · identidades,
 * the stamp «siempre», then the three reflexes in amber), «según el servicio» in the middle (half-lit, no detail) and
 * «proveedor» below (sky: hardware · red del centro de datos · hipervisor). Between «cliente» and the middle strip, a
 * slot that lights amber on `strip` with «lo que cada uno cree que hace el otro · no lo hace nadie». On `sprawl` the
 * middle and provider strips fold away.
 */
export function CloudLayers({ frame, t }: { frame: number; t: LayerTimes }) {
  const headIn = enter(frame, t.cloud - 4, { distance: 14 });
  const fold = progress(frame, t.sprawl - 10, 14);
  const custOn = progress(frame, t.above, 12);
  const alwaysIn = progress(frame, t.always - 2, 10);
  const gapOn = progress(frame, t.strip, 14);
  const lowDim = 1 - 0.55 * gapOn;
  return (
    <div style={{ position: 'relative', width: LAYERS_W, height: 530, fontFamily: FONT.sans }}>
      <div style={{ position: 'absolute', left: 0, top: BAND.head.y, display: 'flex', alignItems: 'center', gap: 16, ...headIn }}>
        <CloudShape width={92} strips={false} />
        <span style={{ fontSize: 38, fontWeight: 850, color: C.textStrong }}>{CLOUD_TITLE}</span>
      </div>
      {frame >= t.model - 4 ? (
        <div style={{ position: 'absolute', right: 0, top: BAND.head.y - 2, ...enter(frame, t.model, { distance: 14 }) }}>
          <TermPill text={MODEL} size={34} on={progress(frame, t.model, 10)} />
        </div>
      ) : null}

      {/* the customer's strip */}
      <Band y={BAND.customer.y} h={BAND.customer.h} tone={C.cyan} show={progress(frame, t.cloud + 6, 16)} dim={0.55 + 0.45 * Math.max(custOn, 1 - progress(frame, t.below, 10))}>
        <div style={{ position: 'absolute', left: 26, top: 22, display: 'flex', alignItems: 'center', gap: 26 }}>
          <span style={{ fontSize: 38, fontWeight: 900, color: C.cyanSoft }}>{CUSTOMER.label}</span>
          <LitRow items={CUSTOMER.items} frame={frame} wordAt={t.wordAt} color={C.textStrong} />
        </div>
        {alwaysIn > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              right: 30,
              top: 16,
              padding: '4px 22px',
              borderRadius: RADIUS.md,
              border: `4px solid ${C.cyanSoft}`,
              fontSize: 38,
              fontWeight: 900,
              color: C.cyanSoft,
              letterSpacing: 2,
              opacity: alwaysIn,
              transform: `rotate(-6deg) scale(${1.25 - 0.25 * alwaysIn})`,
            }}
          >
            {CUSTOMER.always}
          </div>
        ) : null}
        <div style={{ position: 'absolute', left: 26, top: 100, display: 'flex', gap: 18 }}>
          {CUSTOMER.reflexes.map((r) => {
            const at = t.wordAt(r.seg, r.word) - 4;
            if (frame < at - 2) return null;
            return (
              <div key={r.text} style={enter(frame, at, { distance: 12 })}>
                <Pill text={r.text} tone={C.amber} size={32} height={54} on={progress(frame, at, 10) * (1 - 0.5 * progress(frame, at + 40, 12))} />
              </div>
            );
          })}
        </div>
      </Band>

      {/* the gap */}
      <div
        style={{
          position: 'absolute',
          left: 40,
          top: BAND.gap.y,
          width: LAYERS_W - 80,
          height: BAND.gap.h,
          borderRadius: RADIUS.pill,
          border: `2px dashed ${alpha(C.amber, 0.25 + 0.65 * gapOn)}`,
          background: alpha(C.amber, 0.04 + 0.16 * gapOn),
          boxShadow: gapOn > 0.02 ? `0 0 ${Math.round(30 * gapOn)}px ${alpha(C.amber, 0.3 * gapOn)}` : undefined,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
          fontWeight: 800,
          color: '#fde68a',
          whiteSpace: 'nowrap',
          opacity: progress(frame, t.cloud + 10, 16),
        }}
      >
        <span style={{ opacity: gapOn }}>{GAP}</span>
      </div>

      {fold < 1 ? (
        <div style={{ opacity: 1 - fold }}>
          <Band y={BAND.middle.y} h={BAND.middle.h} tone={C.muted} show={progress(frame, t.middle - 4, 14)} dim={0.6 * lowDim}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 700, color: C.muted }}>{MIDDLE}</div>
          </Band>
          <Band y={BAND.provider.y} h={BAND.provider.h} tone={C.sky} show={progress(frame, t.below - 4, 14)} dim={(0.55 + 0.45 * (1 - progress(frame, t.middle, 12))) * (0.6 + 0.4 * lowDim)}>
            <div style={{ position: 'absolute', left: 26, top: 16, fontSize: 38, fontWeight: 900, color: '#bae6fd' }}>{PROVIDER.label}</div>
            <div style={{ position: 'absolute', left: 26, top: 74 }}>
              <LitRow items={PROVIDER.items} frame={frame} wordAt={t.wordAt} color={C.textStrong} />
            </div>
          </Band>
        </div>
      ) : null}
    </div>
  );
}

/** Panel-local left edge of the provider strip (where the connector from the building's wall lands). */
export const PROVIDER_ANCHOR: [number, number] = [0, BAND.provider.y + BAND.provider.h / 2];
/** Panel-local left edge of the gap slot (where the connector from the open door lands). */
export const GAP_ANCHOR: [number, number] = [40, BAND.gap.y + BAND.gap.h / 2];
