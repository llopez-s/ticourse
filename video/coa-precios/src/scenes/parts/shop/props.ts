import type { CSSProperties } from 'react';
import { walkieTip } from './Figure';
import { G, SHOP_H, SHOP_W } from './geom';
import type { ChannelState } from './Walkie';

/** A crop of the shop's 1000 × 540 design space. */
export interface ShopView {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Ready-made crops: the whole shop, and close-ups for vignettes and thumbnails. */
export const SHOP_VIEW = {
  all: { x: 0, y: 0, w: SHOP_W, h: SHOP_H },
  /** The recorder with yesterday's tape. */
  tape: { x: 70, y: 196, w: 250, h: 190 },
  /** The alarm and the live camera, with the door they watch. */
  watch: { x: 500, y: 10, w: 500, h: 500 },
  /** The door and its surroundings: lock, alarm, camera, guard (s04). */
  door: { x: 470, y: 10, w: 530, h: 520 },
  /** Inside the window: recorder, suspect, safe. */
  inside: { x: 60, y: 170, w: 430, h: 290 },
  /** The suspect, the safe and the whole channel up to its far end. */
  walkie: { x: 250, y: 0, w: 750, h: 500 },
} as const satisfies Record<string, ShopView>;

export interface ShopProps {
  /** Width in px. The height follows the view (whole shop: 0.54 × width). */
  width: number;
  /** Crop, in design units (default SHOP_VIEW.all). Interpolate between two crops to move the camera. */
  view?: ShopView;
  /** 0–1: the whole drawing steps back (40 % opacity, half saturation). */
  dim?: number;
  /** Seconds (frame / fps): runs the alarm's ring, the camera's light and the walkie's channel. */
  phase?: number;

  // ---- DISCOVER: yesterday's tape
  /** 0–1 presence of the recorder (default 1). */
  recorder?: number;
  /** 0–1: the recorder lights cyan. */
  tape?: number;
  /** 0–1: the rewind chevrons show. */
  rewind?: number;
  /** Degrees the reels have turned (negative = backwards). */
  tapeSpin?: number;
  /** 0–1: how much tape is back on the left reel. */
  tapeWound?: number;

  // ---- DETECT: the alarm and its live camera
  /** 0–1 presence of the alarm box (default 1) and 0–1 lit. */
  alarmShow?: number;
  alarm?: number;
  /** 0–1: it rings (arcs + halo). It never stops anybody. */
  ring?: number;
  /** 0–1 presence of the camera (default 1) and 0–1 lit. */
  cameraShow?: number;
  camera?: number;
  /** 0–1: what the camera sees (a dashed cone over the door). */
  cone?: number;
  /** 0–1: its «en directo» light. */
  live?: number;

  // ---- DENY: the shutter
  /** 0 = up, 1 = down to the ground. */
  shutter?: number;
  /** 0–1: emerald (it stopped the attempt). */
  shutterLit?: number;
  /** Somebody arriving from the street: `show` 0–1, `at` 0 = far right, 1 = stopped at the shop front. */
  visitor?: { show?: number; at?: number };

  // ---- DISRUPT: somebody walked out in the middle of the job (never in s05 / s06)
  /** `show` 0–1; `at` 0 = inside, at work, 1 = on the street; `escort` 0–1 = whoever walks him out. */
  ousted?: { show?: number; at?: number; escort?: number };

  // ---- Several cells per phase: the door
  /** 0 = closed, 1 = standing open. (It also opens by itself while `ousted` goes through it.) */
  door?: number;
  /** 0–1 presence of the padlock; `lockFail` 0–1 breaks it (amber). */
  lock?: number;
  lockFail?: number;
  /** 0–1: the open doorway outlined in amber (nothing else was there). */
  doorWarn?: number;
  /** 0–1 presence of the guard («vigilante», emerald cap) and 0–1 glow. */
  guard?: number;
  guardGlow?: number;

  // ---- The C2: the suspect, his walkie and the safe
  /** 0–1 presence of the safe (default 1); `safe` 0–1 = lit emerald, closed; `safeOpen` 0–1; `safeWarn` 0–1 amber. */
  safeShow?: number;
  safe?: number;
  safeOpen?: number;
  safeWarn?: number;
  /** 0–1 presence of the suspect inside, walkie at his ear (amber, never rose). */
  suspect?: number;
  /** The walkie's channel (see ChannelState): draw, talk, nobody, noisy, listener. Absent = no channel. */
  channel?: ChannelState;

  /** The only two texts the shop may carry: the tape's tag «ayer» and the camera's «en directo» (0–1 each, default 0). */
  labels?: { ayer?: number; live?: number };
  style?: CSSProperties;
}

export interface ShopPoint {
  x: number;
  y: number;
}
export interface ShopRect extends ShopPoint {
  w: number;
  h: number;
}

/**
 * Anchors in px from the top-left of a <Shop width view /> (same `width` and `view`), to hang labels and
 * leaders: `h` is the drawing's height, `scale` px per design unit.
 */
export function shopLayout(width: number, view: ShopView = SHOP_VIEW.all) {
  const s = width / view.w;
  const pt = (x: number, y: number): ShopPoint => ({ x: (x - view.x) * s, y: (y - view.y) * s });
  const rc = (x: number, y: number, w: number, h: number): ShopRect => ({ ...pt(x, y), w: w * s, h: h * s });
  const tip = walkieTip(G.suspect.x, G.floor, G.suspect.h);
  const r = G.recorder;
  return {
    w: width,
    h: view.h * s,
    scale: s,
    at: {
      tape: pt(r.x + r.w / 2, r.y + r.h / 2),
      tapeTag: pt(r.x + 62, r.y - 44),
      alarm: pt(G.alarm.cx, G.alarm.cy),
      camera: pt(G.camera.lens.x + 40, G.camera.lens.y - 22),
      live: pt(G.live.x, G.live.y),
      lock: pt(G.door.x + 42, G.door.y + 200),
      guardHead: pt(G.guard.x, G.ground + 4 - G.guard.h),
      suspectHead: pt(G.suspect.x, G.floor - G.suspect.h),
      walkie: pt(tip.x, tip.y),
      far: pt(G.far.x, G.far.y),
      safe: pt(G.safe.x + G.safe.w / 2, G.safe.y + G.safe.h / 2),
      street: pt(G.street.x, G.ground),
      visitorStop: pt(G.stop.x, G.ground),
    },
    rect: {
      building: rc(G.bld.x, G.bld.y, G.bld.w, G.bld.h),
      window: rc(G.win.x, G.win.y, G.win.w, G.win.h),
      door: rc(G.door.x, G.door.y, G.door.w, G.door.h),
      shutter: rc(G.shutter.x, G.shutter.y, G.shutter.w, G.shutter.h),
      recorder: rc(r.x, r.y, r.w, r.h),
      safe: rc(G.safe.x, G.safe.y, G.safe.w, G.safe.h),
    },
    groundY: (G.ground - view.y) * s,
  };
}
