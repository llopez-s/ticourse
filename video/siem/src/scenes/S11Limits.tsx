import type { ReactNode } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import type { Accent } from '../../../engine/src/theme/tokens';
import { C, STAGE } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import type { IconName } from '../../../engine/src/ui';
import { BlindSource, ClockSkew, NoPayload, Retention, Silence } from './parts/s11-limits/Limits';
import { Tile, mixHex } from './parts/s11-limits/Tile';
import { s11Timing } from './parts/s11-limits/timing';

const GAP = 24;
const TILE_W = (STAGE.width - GAP) / 2;
const TILE_H = 212;
const WIDE_Y = 2 * TILE_H + 2 * GAP;
const WIDE_H = STAGE.height - WIDE_Y;

/**
 * S11 «Lo que el SIEM no ve» (chapter V opener): four blind spots in a 2×2
 * grid plus the retention bar. Each tile lights up on its cue while the others
 * dim; the grid is laid out (as placeholders) from frame 0 so the chapter wipe
 * reveals it.
 */
export function S11Limits(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = s11Timing(props);

  const starts = [t.intro, t.silence, t.skew, t.meta, t.archive];
  const recap = progress(frame, t.recap, 18);
  const focus = (i: number) => {
    const on = progress(frame, starts[i], 12);
    const off = i + 1 < starts.length ? progress(frame, starts[i + 1], 12) : 0;
    return Math.max(on * (1 - off), (i < 4 ? 0.8 : 1) * recap * on);
  };
  const reveal = (i: number) => progress(frame, starts[i], 14);

  // Tile 1 opens on the rule (integrated sources, cyan) and turns rose when the unplugged one appears.
  const blindTint = mixHex(C.cyan, C.rose, progress(frame, t.blind, 12));

  const tiles: { x: number; y: number; w: number; h: number; accent: Accent; tint?: string; icon: IconName; body: ReactNode }[] = [
    { x: 0, y: 0, w: TILE_W, h: TILE_H, accent: 'rose', tint: blindTint, icon: 'unplug', body: <BlindSource frame={frame} fps={fps} t={t} /> },
    { x: TILE_W + GAP, y: 0, w: TILE_W, h: TILE_H, accent: 'amber', icon: 'chart', body: <Silence frame={frame} fps={fps} t={t} /> },
    { x: 0, y: TILE_H + GAP, w: TILE_W, h: TILE_H, accent: 'amber', icon: 'clock', body: <ClockSkew frame={frame} t={t} /> },
    { x: TILE_W + GAP, y: TILE_H + GAP, w: TILE_W, h: TILE_H, accent: 'rose', icon: 'lock', body: <NoPayload frame={frame} t={t} /> },
    { x: 0, y: WIDE_Y, w: STAGE.width, h: WIDE_H, accent: 'cyan', icon: 'archive', body: <Retention frame={frame} fps={fps} t={t} /> },
  ];

  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: STAGE.left, top: STAGE.top, width: STAGE.width, height: STAGE.height, overflow: 'hidden' }}>
        {tiles.map((tile, i) => (
          <Tile key={tile.icon} {...tile} reveal={reveal(i)} focus={focus(i)}>
            {reveal(i) > 0 ? tile.body : null}
          </Tile>
        ))}
      </div>
    </AbsoluteFill>
  );
}
