import { AlarmBox, Camera } from './shop/Devices';
import { Awning, Building, Frames, Room } from './shop/Facade';
import { Figure, walkieTip } from './shop/Figure';
import { G, SHOP_H, SHOP_W, clamp01, lerp } from './shop/geom';
import { Door, Shutter } from './shop/Openings';
import { SHOP_VIEW, type ShopProps } from './shop/props';
import { SafeGlyph } from './shop/Safe';
import { Recorder } from './shop/Tape';
import { Channel } from './shop/Walkie';

/**
 * V22's ONE image: the neighbourhood shop («la tienda del barrio»), in elevation, drawn the same way in
 * every scene. Rule of the image: one gesture, one verb; each object has a single job.
 *   DISCOVER = yesterday's tape, rewound        → tape, rewind, tapeSpin, tapeWound      (cyan)
 *   DETECT   = the alarm and its live camera    → alarm, ring, camera, cone, live        (cyan)
 *   DENY     = the shutter down before anybody  → shutter, shutterLit, visitor           (emerald)
 *   DISRUPT  = somebody walked out mid-job      → ousted { show, at, escort }  (never in s05 / s06)
 *   several cells per phase = the door          → door, lock, lockFail, doorWarn, guard, + alarm, camera
 *   the C2   = the suspect's walkie             → suspect, channel { draw, talk, nobody, noisy, listener },
 *                                                 safe (closed, emerald), safeOpen, safeWarn
 * Never use the shutter or `ousted` for the C2. No shop name, no faces; the suspect is amber, never rose.
 *
 * Pure SVG, prop-driven: nothing reads the timeline and nothing positions itself (wrap it in an
 * absolutely positioned div). It is `width` px wide and, for the whole shop, 0.54 × width tall; text
 * inside is only «ayer» (the tape's tag) and «en directo» (the camera), both off by default.
 *
 * PROPS (0–1 unless said; full list with comments: shop/props.ts → ShopProps)
 *   width, view?, dim?, phase? (seconds: runs the ring, the live light, the channel), style?
 *   recorder=1, tape, rewind, tapeSpin (deg), tapeWound
 *   alarmShow=1, alarm, ring · cameraShow=1, camera, cone, live
 *   shutter (0 up, 1 down), shutterLit, visitor { show, at }
 *   ousted { show, at (0 inside, 1 street), escort }
 *   door (open), lock, lockFail, doorWarn, guard, guardGlow
 *   safeShow=1, safe, safeOpen, safeWarn, suspect, channel? (ChannelState)
 *   labels { ayer, live }
 *
 * SIZES: full stage (s02: width ≈ 860–1100), compact beside the matrix (≈ 700–800), thumbnails: pass a
 * `view` (SHOP_VIEW.tape / watch / door / inside / walkie, or your own crop) with a small `width`, or use
 * the standalone glyphs. `shopLayout(width, view?)` gives every anchor in px (at.tape, at.alarm,
 * at.camera, at.lock, at.walkie, at.far, at.safe, rect.shutter, rect.door, rect.window, groundY…).
 *
 * ALSO EXPORTED (each draws inside your own <svg>): Cassette, Recorder, AlarmBox, CameraGlyph, LockGlyph,
 * SafeGlyph, WalkieGlyph, ListenerGlyph, Figure, Channel, Shutter, Door; SHOP_VIEW, SHOP_W, SHOP_H, G.
 */
export function Shop({
  width,
  view = SHOP_VIEW.all,
  dim = 0,
  phase = 0,
  recorder = 1,
  tape = 0,
  rewind = 0,
  tapeSpin = 0,
  tapeWound = 0.3,
  alarmShow = 1,
  alarm = 0,
  ring = 0,
  cameraShow = 1,
  camera = 0,
  cone = 0,
  live = 0,
  shutter = 0,
  shutterLit = 0,
  visitor,
  ousted,
  door = 0,
  lock = 0,
  lockFail = 0,
  doorWarn = 0,
  guard = 0,
  guardGlow = 0,
  safeShow = 1,
  safe = 0,
  safeOpen = 0,
  safeWarn = 0,
  suspect = 0,
  channel,
  labels = {},
  style,
}: ShopProps) {
  const d = clamp01(dim);
  const height = (width * view.h) / view.w;
  // Somebody walked out: inside → through the door → the street.
  const oAt = clamp01(ousted?.at ?? 0);
  const oShow = clamp01(ousted?.show ?? 0);
  const oX = lerp(G.suspect.x, G.street.x, oAt);
  const oY = lerp(G.floor, G.ground + 4, clamp01((oX - G.door.x) / G.door.w));
  const eX = Math.min(oX - 66, G.door.x + G.door.w / 2);
  const eY = lerp(G.floor, G.ground + 4, clamp01((eX - G.door.x) / G.door.w));
  const through = oShow * clamp01((oX - 420) / 60) * clamp01((G.street.x + 30 - oX) / 60);
  const doorOpen = Math.max(clamp01(door), through);
  // Somebody arriving from the street.
  const vAt = clamp01(visitor?.at ?? 0);
  const vX = lerp(SHOP_W - 46, G.stop.x, vAt);
  const tip = walkieTip(G.suspect.x, G.floor, G.suspect.h);
  return (
    <svg
      width={width}
      height={height}
      viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
      style={{ display: 'block', overflow: 'hidden', opacity: 1 - 0.6 * d, filter: d > 0.001 ? `saturate(${1 - 0.5 * d})` : undefined, ...style }}
    >
      <defs>
        {/* Whoever is inside shows through the glass and the doorway; past the door they are on the street. */}
        <clipPath id="shop-inside">
          <rect x={G.win.x} y={G.win.y} width={G.win.w} height={G.win.h} />
          <rect x={G.door.x} y={0} width={SHOP_W - G.door.x + 80} height={SHOP_H} />
        </clipPath>
      </defs>
      <Building />
      <Room />
      <Recorder on={tape} rewind={rewind} spin={tapeSpin} wound={tapeWound} label={labels.ayer ?? 0} opacity={clamp01(recorder)} />
      <SafeGlyph x={G.safe.x} y={G.safe.y} w={G.safe.w} open={safeOpen} lit={safe} warn={safeWarn} opacity={clamp01(safeShow)} />
      <Frames />
      <Door open={doorOpen} lock={lock} lockFail={lockFail} warn={doorWarn} />
      <g clipPath="url(#shop-inside)">
        <Figure x={G.suspect.x} y={G.floor} h={G.suspect.h} kind="suspect" pose="walkie" opacity={clamp01(suspect)} />
        <Figure x={eX} y={eY} h={G.suspect.h} kind="neutral" pose="escort" armTone="#34d399" opacity={oShow * clamp01(ousted?.escort ?? 0)} />
        <Figure x={oX} y={oY} h={G.suspect.h - 6} kind="neutral" pose={oAt < 0.04 ? 'reach' : 'stand'} opacity={oShow} />
      </g>
      <Shutter down={shutter} lit={shutterLit} />
      <Awning />
      <AlarmBox cx={G.alarm.cx} cy={G.alarm.cy} size={G.alarm.size} on={alarm} ring={ring} phase={phase} opacity={clamp01(alarmShow)} />
      <Camera on={camera} cone={cone} live={live} label={labels.live ?? 0} phase={phase} opacity={clamp01(cameraShow)} />
      <Figure x={G.guard.x} y={G.ground + 4} h={G.guard.h} kind="guard" facing="left" opacity={clamp01(guard)} glow={guardGlow} glowTone="#34d399" />
      <Figure x={vX} y={G.ground + 4} h={G.guard.h - 8} kind="neutral" facing="left" opacity={clamp01(visitor?.show ?? 0)} />
      {channel ? <Channel from={tip} to={G.far} state={{ phase, ...channel }} /> : null}
    </svg>
  );
}

export { SHOP_VIEW, shopLayout, type ShopProps, type ShopView } from './shop/props';
export { G, SHOP_H, SHOP_W } from './shop/geom';
export { Figure, walkieTip, type FigureKind, type FigurePose } from './shop/Figure';
export { AlarmBox, Camera, CameraGlyph } from './shop/Devices';
export { Cassette, Recorder } from './shop/Tape';
export { Door, LockGlyph, Shutter } from './shop/Openings';
export { SafeGlyph } from './shop/Safe';
export { Channel, ListenerGlyph, WalkieGlyph, type ChannelState } from './shop/Walkie';
