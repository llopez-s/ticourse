import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../../engine/src/theme/motion';
import { Pill } from './Labels';
import { ImageTag } from './Tags';
import { ART } from './Vignettes';

/** One panel of an everyday image: who, the exam term it stands for, a small drawing and a two-line caption. */
export interface TriPanel {
  name: string;
  term: string;
  tone: string;
  /** The drawing; `t` 0–1 runs its animation from the panel's `at`. */
  art: (t: number) => ReactNode;
  caption: readonly [ReactNode, ReactNode];
  /** The frame the voice reaches this panel. */
  at: number;
}

export const PANEL = { w: 540, h: 532, gap: 54, top: 76 } as const;

/**
 * Three panels side by side for an everyday image (the photo album, the removal van, the neighbourhood club), under
 * «imagen · no es del puerto» and a short title. All three wait from `startAt` at ~30 % (never an empty stage); each
 * lights when the voice reaches it, its drawing runs and its term pill and caption come in.
 */
export function Triptych({ frame, startAt, title, panels, titleSize = 44 }: { frame: number; startAt: number; title: ReactNode; panels: readonly TriPanel[]; titleSize?: number }) {
  const head = enter(frame, startAt, { distance: 14, duration: 16 });
  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: FONT.sans }}>
      <div style={{ position: 'absolute', left: 0, top: 0, display: 'flex', alignItems: 'center', gap: 26, ...head }}>
        <ImageTag size={28} />
        <div style={{ fontSize: titleSize, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap', letterSpacing: -0.5 }}>{title}</div>
      </div>
      {panels.map((p, i) => {
        const on = progress(frame, p.at - 6, 14);
        const t = progress(frame, p.at, 60, EASE.inOut);
        const e = enter(frame, startAt + i * 5, { distance: 20, duration: 16 });
        return (
          <div
            key={p.name}
            style={{
              position: 'absolute',
              left: i * (PANEL.w + PANEL.gap),
              top: PANEL.top,
              width: PANEL.w,
              height: PANEL.h,
              boxSizing: 'border-box',
              padding: '14px 0 0',
              borderRadius: RADIUS.lg,
              background: alpha(C.ink900, 0.9),
              border: `3px solid ${alpha(p.tone, 0.25 + 0.6 * on)}`,
              boxShadow: on > 0.02 ? `0 0 ${Math.round(34 * on)}px ${alpha(p.tone, 0.22 * on)}` : undefined,
              opacity: (0.3 + 0.7 * on) * e.opacity,
              transform: e.transform,
            }}
          >
            <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start', height: 112 }}>
              <div style={{ fontSize: 40, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>{p.name}</div>
              <Pill text={p.term} tone={p.tone} on={on} size={32} height={52} weight={800} />
            </div>
            <div style={{ position: 'absolute', left: 0, top: 128, width: ART.w - 6, height: ART.h }}>{p.art(t)}</div>
            <div style={{ position: 'absolute', left: 24, top: 436, fontSize: 32, fontWeight: 700, lineHeight: 1.22, color: C.text, whiteSpace: 'nowrap', opacity: 0.4 + 0.6 * on }}>
              <div>{p.caption[0]}</div>
              <div>{p.caption[1]}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
