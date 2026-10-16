import { useId } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../../engine/src/theme/motion';
import { clamp01, mix } from '../../../../../engine/src/ui';
import { MAP } from '../../../data/s02-sitios';
import { Theatre, theatreSize } from '../Theatre';

/** Design size of the map (stage px). */
export const MAP_SIZE = { w: 1240, h: 410 } as const;

const STREET = { top: 182, bottom: 232 } as const;
const DC = { x: 290, y: 24, w: 210, h: 140 } as const;
const THEATRE_W = 170;
const CARD = { w: 214, h: 150 } as const;
const NEAR = { x: 540, y: 248 } as const;
const FAR = { x: 990, y: 18 } as const;
const FLOOD = { cx: 520, cy: 200, rx: 360, ry: 250 } as const;

/** Deterministic 0–1 hash. */
function hash(n: number): number {
  const x = Math.sin(n * 57.3 + 9.1) * 43758.5453;
  return x - Math.floor(x);
}

/** City blocks (faint), avoiding the street. */
const BLOCKS = (() => {
  const out: { x: number; y: number; w: number; h: number }[] = [];
  const cols = 9;
  const cw = MAP_SIZE.w / cols;
  for (let c = 0; c < cols; c++) {
    for (const band of [
      { y0: 14, y1: STREET.top - 14 },
      { y0: STREET.bottom + 14, y1: MAP_SIZE.h - 14 },
    ]) {
      const split = hash(c * 3 + band.y0) > 0.55;
      const x = c * cw + 12;
      const w = cw - 24;
      if (split) {
        const mid = (band.y0 + band.y1) / 2;
        out.push({ x, y: band.y0, w, h: mid - band.y0 - 8 });
        out.push({ x, y: mid + 8, w, h: band.y1 - mid - 8 });
      } else {
        out.push({ x, y: band.y0, w, h: band.y1 - band.y0 });
      }
    }
  }
  return out;
})();

/**
 * s02's generic map (no distance, no scale bar, no names): faint city blocks, one street, the box «CPD» on one side
 * and, across the street, the reserve theatre «en la misma calle» (the voice: «si está enfrente»; «los dos
 * teatros»). Not a site the port has.
 *   - `show`   0–1 the map fades in.
 *   - `link`   0–1 the replication line between the two (dots travel along it: «más fácil replicar»).
 *   - `flood`  0–1 a rose flood spreads from the street over both.
 *   - `move`   0–1 the theatre leaves for the far end of the map, out of the water («los pones lejos»); its old
 *              place stays as a dashed, submerged outline and its label fades.
 */
export function StreetMap({ frame, show = 1, link = 0, flood = 0, move = 0 }: { frame: number; show?: number; link?: number; flood?: number; move?: number }) {
  const clipId = `map-clip-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const F = clamp01(flood);
  const M = clamp01(move);
  const Lk = clamp01(link) * (1 - F);
  const tx = mix(NEAR.x, FAR.x, M);
  const ty = mix(NEAR.y, FAR.y, M);
  const thSize = theatreSize(THEATRE_W);
  // The theatre's own water drains as it leaves the flood.
  const thFlood = F * (1 - progress(M, 0.35, 0.4, EASE.inOut));
  const labelOn = 1 - progress(M, 0, 0.3);

  // Replication line: from the CPD's bottom to the theatre card's top.
  const a = { x: DC.x + DC.w / 2, y: DC.y + DC.h };
  const b = { x: NEAR.x + CARD.w / 2, y: NEAR.y };
  const dots = [0, 1, 2].map((k) => ((frame / 40 + k / 3) % 1 + 1) % 1);

  return (
    <div style={{ position: 'relative', width: MAP_SIZE.w, height: MAP_SIZE.h, opacity: show, fontFamily: FONT.sans }}>
      <svg width={MAP_SIZE.w} height={MAP_SIZE.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <defs>
          <clipPath id={clipId}>
            <rect x={0} y={0} width={MAP_SIZE.w} height={MAP_SIZE.h} rx={RADIUS.lg} />
          </clipPath>
        </defs>
        <rect x={0} y={0} width={MAP_SIZE.w} height={MAP_SIZE.h} rx={RADIUS.lg} fill={C.ink900} stroke={C.ink700} strokeWidth={2} />
        <g clipPath={`url(#${clipId})`}>
          {BLOCKS.map((bk, i) => (
            <rect key={i} x={bk.x} y={bk.y} width={bk.w} height={bk.h} rx={10} fill={alpha(C.ink850, 0.9)} stroke={alpha(C.ink700, 0.8)} strokeWidth={2} />
          ))}
          {/* the street */}
          <rect x={-10} y={STREET.top} width={MAP_SIZE.w + 20} height={STREET.bottom - STREET.top} fill={C.ink800} />
          <line x1={0} y1={(STREET.top + STREET.bottom) / 2} x2={MAP_SIZE.w} y2={(STREET.top + STREET.bottom) / 2} stroke={alpha(C.muted, 0.5)} strokeWidth={3} strokeDasharray="22 18" />
          {/* replication */}
          {Lk > 0.01 ? (
            <g opacity={Lk}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={alpha(C.cyan, 0.75)} strokeWidth={4} strokeDasharray="10 9" />
              {dots.map((t, k) => (
                <circle key={k} cx={a.x + (b.x - a.x) * t} cy={a.y + (b.y - a.y) * t} r={7} fill={C.cyanSoft} />
              ))}
            </g>
          ) : null}
          {/* the flood */}
          {F > 0.001 ? (
            <g>
              <ellipse cx={FLOOD.cx} cy={FLOOD.cy} rx={FLOOD.rx * F} ry={FLOOD.ry * F} fill={alpha(C.rose, 0.26)} stroke={alpha(C.roseSoft, 0.8)} strokeWidth={4} />
              {[0, 1].map((k) => {
                const p = ((frame / 60 + k / 2) % 1 + 1) % 1;
                return (
                  <ellipse
                    key={k}
                    cx={FLOOD.cx}
                    cy={FLOOD.cy}
                    rx={FLOOD.rx * F * (0.35 + 0.6 * p)}
                    ry={FLOOD.ry * F * (0.35 + 0.6 * p)}
                    fill="none"
                    stroke={alpha(C.roseSoft, 0.45 * (1 - p) * F)}
                    strokeWidth={3}
                  />
                );
              })}
            </g>
          ) : null}
        </g>
      </svg>

      {/* The CPD */}
      <div
        style={{
          position: 'absolute',
          left: DC.x,
          top: DC.y,
          width: DC.w,
          height: DC.h,
          boxSizing: 'border-box',
          borderRadius: RADIUS.md,
          border: `3px solid ${F > 0.4 ? alpha(C.rose, 0.85) : alpha(C.sky, 0.8)}`,
          background: `linear-gradient(180deg, ${C.ink800} 0%, ${C.ink900} 100%)`,
          boxShadow: `0 0 26px ${alpha(F > 0.4 ? C.rose : C.sky, 0.22)}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          overflow: 'hidden',
        }}
      >
        <span style={{ fontFamily: FONT.mono, fontSize: 48, fontWeight: 800, letterSpacing: 5, color: F > 0.4 ? C.roseSoft : '#7dd3fc' }}>{MAP.dc}</span>
        {[0, 1].map((k) => (
          <div key={k} style={{ width: 140, height: 14, borderRadius: 4, border: `2px solid ${C.ink600}`, background: C.ink850 }} />
        ))}
        {F > 0.001 ? (
          <div style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: `${Math.round(100 * F * 0.7)}%`, background: alpha(C.rose, 0.35), borderTop: `3px solid ${alpha(C.roseSoft, 0.85)}` }} />
        ) : null}
      </div>

      {/* The old place of the theatre: dashed, under water */}
      {M > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: NEAR.x,
            top: NEAR.y,
            width: CARD.w,
            height: CARD.h,
            boxSizing: 'border-box',
            borderRadius: RADIUS.md,
            border: `3px dashed ${alpha(C.roseSoft, 0.7)}`,
            opacity: Math.min(1, M * 2),
          }}
        />
      ) : null}

      {/* The reserve theatre */}
      <div
        style={{
          position: 'absolute',
          left: tx,
          top: ty,
          width: CARD.w,
          height: CARD.h,
          boxSizing: 'border-box',
          borderRadius: RADIUS.md,
          border: `3px solid ${alpha(C.sky, 0.8)}`,
          background: alpha(C.ink850, 0.96),
          boxShadow: `0 0 ${Math.round(18 + 18 * M)}px ${alpha(C.sky, 0.2 + 0.15 * M)}`,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <div style={{ width: THEATRE_W, height: thSize.artH }}>
          <Theatre kind="hot" width={THEATRE_W} flood={thFlood} frame={frame} />
        </div>
      </div>
      {labelOn > 0.01 ? (
        <div style={{ position: 'absolute', left: NEAR.x + CARD.w + 24, top: NEAR.y + CARD.h / 2 - 22, fontSize: 36, fontWeight: 750, color: '#7dd3fc', whiteSpace: 'nowrap', opacity: labelOn }}>
          {MAP.near}
        </div>
      ) : null}
    </div>
  );
}
