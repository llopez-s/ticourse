import type { ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { dimStyle } from '../../../../../engine/src/ui';
import { AlarmBox, CameraGlyph, Cassette } from '../Shop';

export const BLOCK_W = 400;
export const ART_H = 200;

/**
 * One of s02's two columns: a close-up of the object (`art`, ART_H tall), the verb's name (cyan: it is
 * a verb that looks) and what it means on two lines; `extra` goes under them. Each piece has its own
 * 0–1 weight; `glow` lights the name, `dim` steps the column back.
 */
export function VerbBlock({ art, artIn, name, nameIn, sub, subIn, extra, glow = 0, dim = 0 }: { art: ReactNode; artIn: number; name: string; nameIn: number; sub: readonly string[]; subIn: number; extra?: ReactNode; glow?: number; dim?: number }) {
  return (
    <div style={{ width: BLOCK_W, fontFamily: FONT.sans, textAlign: 'center', ...dimStyle(dim) }}>
      <div style={{ height: ART_H, opacity: artIn, transform: `scale(${0.92 + 0.08 * artIn})` }}>{art}</div>
      <div
        style={{
          marginTop: 10,
          fontSize: 62,
          lineHeight: 1.05,
          fontWeight: 900,
          letterSpacing: 1.5,
          color: C.cyan,
          textShadow: `0 0 ${Math.round(14 + 26 * glow)}px ${alpha(C.cyan, 0.25 + 0.4 * glow)}`,
          opacity: nameIn,
          transform: `translateY(${(1 - nameIn) * 12}px)`,
        }}
      >
        {name}
      </div>
      <div style={{ marginTop: 8, fontSize: 37, lineHeight: 1.18, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap', opacity: subIn, transform: `translateY(${(1 - subIn) * 10}px)` }}>
        {sub.map((ln) => (
          <div key={ln}>{ln}</div>
        ))}
      </div>
      {extra}
    </div>
  );
}

/** Yesterday's tape, up close: it rewinds. */
export function TapeArt({ spin, wound, rewind, lit }: { spin: number; wound: number; rewind: number; lit: number }) {
  return (
    <svg width={BLOCK_W} height={ART_H} viewBox={`0 0 ${BLOCK_W} ${ART_H}`} style={{ display: 'block', overflow: 'visible' }}>
      <ellipse cx={BLOCK_W / 2} cy={ART_H / 2} rx={190} ry={104} fill={alpha(C.cyan, 0.07 * lit)} />
      <Cassette x={BLOCK_W / 2} y={ART_H / 2} w={300} on={1} spin={spin} wound={wound} rewind={rewind} label={1} />
    </svg>
  );
}

/** The alarm and its live camera, up close. Each appears with its own weight. */
export function WatchArt({ alarm, ring, camera, live, phase }: { alarm: number; ring: number; camera: number; live: number; phase: number }) {
  return (
    <svg width={BLOCK_W} height={ART_H} viewBox={`0 0 ${BLOCK_W} ${ART_H}`} style={{ display: 'block', overflow: 'visible' }}>
      <AlarmBox cx={118} cy={104} size={112} on={1} ring={ring} phase={phase} opacity={alarm} />
      <CameraGlyph x={254} y={136} size={124} on={1} live={live} phase={phase} opacity={camera} />
    </svg>
  );
}
