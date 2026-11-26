/**
 * Illustration — a framed plate that shows one piece of the video's AI art (public/art/, the Magnific pilot), and
 * optionally plays a muted clip between two stills («ClipPlate»). Local to this video; not part of the engine.
 *
 * HARD RULES (from the owner): the art is only an image. Every text, number, label and datum is drawn by the scene on
 * top of it; no technical diagram comes from the art; where the image is an analogy, the scene adds <ImageTag/>
 * («imagen · no es el Consorcio», parts/Tags.tsx) — the tag is NOT baked in here, because s03 reuses the floor dimmed
 * and without text.
 *
 * Geometry. All the art is 2752×1536 (ART_ASPECT). The plate (`width`×`height`, rounded, bordered, overflow hidden)
 * holds a «canvas» with exactly that aspect, sized to COVER the plate and placed with `focus` (0–1 per axis, like
 * object-position: {x: 0.5, y: 1} keeps the bottom of the image). Everything — the still, the clip, the end still and
 * the `children` — fills that same canvas, so nothing can shift between them.
 *
 * Props
 *   src        start image, relative to the public dir ('art/s02-difusion-floor.png')
 *   width, height   plate size in px (position it with a wrapper div or `style`)
 *   focus      which part of the image survives the crop (default centre)
 *   zoom       very slow push-in: { from = 1, to, start, end } in scene-local frames, about `zoomOrigin` (image
 *              fractions, default = focus). With `clip`, the zoom freezes at `clip.at` (no zoom while the clip plays).
 *   dim        0–1 night veil over the image and its children (question-scene backgrounds: ~0.55)
 *   saturate   CSS saturation of the image (1 = as is; 0.5 for a background that must not compete). Ignored with `mono`.
 *   mono       true (or a 0–1 strength) shows the art as a one-hue, night-blue plate: the image, the clip and the end
 *              still are turned grey together (one `grayscale(1)` group, so the joins of a clip cannot flash) and a
 *              MONO_TINT wash is laid on that group with mix-blend-mode: color. Use it wherever the art sits next to
 *              VLAN-coloured elements: plain `saturate` leaves traces of the art's own pink, amber and red, which
 *              would read as a second colour code. `children` are drawn above the wash and keep their colours.
 *   opacity    whole plate
 *   border     false to drop the frame (full-bleed uses)
 *   radius     corner radius (default RADIUS.lg)
 *   clip       { src, endSrc, at, frames = 150, fade = 8, fadeIn = fade, fadeOut = fade } → start still until `at`,
 *              then the MP4 (OffthreadVideo, muted) starting exactly at `at`, then `endSrc` held for the rest.
 *              `frames` is the clip's length at the composition's fps (5 s = 150 at 30 fps; never ask for more than
 *              the file has). `fadeIn` is the dissolve still → clip, `fadeOut` the dissolve clip → end still: a clip
 *              that moves from its very first frame wants a short fadeIn (a long one shows as ghosting), and an end
 *              still that differs from the clip's last frame wants a long fadeOut.
 *   frame      optional; defaults to useCurrentFrame()
 *   children   drawn INSIDE the canvas (they move with the zoom and are cropped with the image). Place them with
 *              <Pin u v> or <Region>, in image fractions (0–1 of the 2752×1536 picture), or draw an <svg> with
 *              viewBox="0 0 2752 1536" preserveAspectRatio="none" filling the canvas (ART_W, ART_H).
 *   overlay    drawn in plate pixels, above the dim, not zoomed (tags that must stay crisp and still)
 *
 * Why the clip is STRETCHED, not cover-fitted: the clips are 1928×1072 (1.7985) and the stills 2752×1536 (1.7917).
 * Measured on s02-tabiques (first/last clip frame against floor/walls, grey MSE): the still stretched to the clip's
 * frame 8.9 / 16.9, the best cover crop 37.3 / 38.5, the best contain 70.6 / 89.3. So the clip is the still squeezed
 * non-uniformly by 0.4 %, and the video is drawn with object-fit: fill in the still's box. s04-montacargas agrees
 * (stretch 25.9 / 45.9, cover 72.3 / 75.3) but its residual is higher, above all against the END still (the generated
 * pile differs a little from mail-fin): look at that join on stills and lengthen `fadeOut` there if it shows. A short dissolve at each
 * join hides the ~2/255 brightness drift of the generated video.
 */
import type { CSSProperties, ReactNode } from 'react';
import { Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { C, RADIUS, alpha } from '../theme/tokens';
import { EASE, progress } from '../theme/motion';
import { clamp01, mix } from './index';

/** Pixel size of every still in public/art (use as the viewBox of an svg drawn over the canvas). */
export const ART_W = 2752;
export const ART_H = 1536;
export const ART_ASPECT = ART_W / ART_H;

export interface ArtZoom {
  from?: number;
  to: number;
  start: number;
  end: number;
}

export interface ArtClip {
  /** The MP4, relative to the public dir. Silent; it is muted anyway. */
  src: string;
  /** The still held after the clip (the clip's last frame, as an image). */
  endSrc: string;
  /** Scene-local frame at which the clip starts. */
  at: number;
  /** Length of the clip in composition frames (default 150 = 5 s at 30 fps). */
  frames?: number;
  /** Dissolve at each join, in frames (default 8). */
  fade?: number;
  /** Dissolve start still → clip, in frames (default `fade`). */
  fadeIn?: number;
  /** Dissolve clip → end still, in frames (default `fade`). */
  fadeOut?: number;
}

/** Size and offset of the canvas (the whole image) inside a plate of `width`×`height`. */
export function artCanvas(width: number, height: number, focus: { x: number; y: number } = { x: 0.5, y: 0.5 }) {
  const w = Math.max(width, height * ART_ASPECT);
  const h = w / ART_ASPECT;
  return { w, h, left: -(w - width) * focus.x, top: -(h - height) * focus.y };
}

/** The hue of a `mono` plate: the brand's night blue, a step away from the cyan of VLAN 10 and the sky of the gear. */
export const MONO_TINT = '#3f74ad';
/** Default strength of the wash (`mono` = true). */
export const MONO_STRENGTH = 0.62;

const FILL: CSSProperties = { position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', objectFit: 'fill' };

export function Illustration({
  src,
  width,
  height,
  focus = { x: 0.5, y: 0.5 },
  zoom,
  zoomOrigin,
  dim = 0,
  saturate = 1,
  mono = false,
  opacity = 1,
  border = true,
  radius = RADIUS.lg,
  clip,
  frame: frameProp,
  children,
  overlay,
  style,
}: {
  src: string;
  width: number;
  height: number;
  focus?: { x: number; y: number };
  zoom?: ArtZoom;
  zoomOrigin?: { x: number; y: number };
  dim?: number;
  saturate?: number;
  mono?: boolean | number;
  opacity?: number;
  border?: boolean;
  radius?: number;
  clip?: ArtClip;
  frame?: number;
  children?: ReactNode;
  overlay?: ReactNode;
  style?: CSSProperties;
}) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const canvas = artCanvas(width, height, focus);

  // Push-in, frozen from the clip's first frame on.
  const zf = clip ? Math.min(frame, clip.at) : frame;
  const scale = zoom ? mix(zoom.from ?? 1, zoom.to, progress(zf, zoom.start, Math.max(1, zoom.end - zoom.start), EASE.inOut)) : 1;
  const origin = zoomOrigin ?? focus;

  const clipFrames = clip?.frames ?? 150;
  const fade = clip?.fade ?? 8;
  const fadeIn = Math.max(1, clip?.fadeIn ?? fade);
  const fadeOut = Math.max(1, clip?.fadeOut ?? fade);
  const clipEnd = clip ? clip.at + clipFrames : 0;
  const clipOn = clip ? frame >= clip.at && frame < clipEnd : false;
  const clipIn = clip ? progress(frame, clip.at, fadeIn, EASE.linear) : 0;
  const endIn = clip ? progress(frame, clipEnd - fadeOut - 1, fadeOut, EASE.linear) : 0;
  const d = clamp01(dim);
  const wash = mono === true ? MONO_STRENGTH : mono ? clamp01(mono) : 0;
  const imageFilter = wash > 0 ? 'grayscale(1) contrast(1.06)' : saturate !== 1 ? `saturate(${saturate})` : undefined;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        overflow: 'hidden',
        borderRadius: radius,
        background: C.ink900,
        boxShadow: border ? `0 18px 50px ${alpha(C.ink950, 0.6)}` : undefined,
        opacity,
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: canvas.left,
          top: canvas.top,
          width: canvas.w,
          height: canvas.h,
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: `${origin.x * 100}% ${origin.y * 100}%`,
        }}
      >
        {/* The image group. `isolation` keeps the wash's blend inside it (it must not reach the backdrop). */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', isolation: wash > 0 ? 'isolate' : undefined }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', filter: imageFilter }}>
          {/* Start still: stays under the clip, so a late video frame can never show a hole. */}
          {endIn < 1 ? <Img src={staticFile(src)} style={FILL} /> : null}
          {clip && clipOn && endIn < 1 ? (
            <Sequence from={clip.at} durationInFrames={clipFrames} layout="none">
              <OffthreadVideo src={staticFile(clip.src)} muted style={{ ...FILL, opacity: clipIn }} />
            </Sequence>
          ) : null}
          {clip && endIn > 0 ? <Img src={staticFile(clip.endSrc)} style={{ ...FILL, opacity: endIn }} /> : null}
        </div>
        {wash > 0 ? <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', background: MONO_TINT, opacity: wash, mixBlendMode: 'color' }} /> : null}
        </div>
        {children}
      </div>
      {d > 0.001 ? <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', background: alpha(C.ink950, d) }} /> : null}
      {overlay}
      {border ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            borderRadius: radius,
            border: `2px solid ${alpha(C.ink500, 0.9)}`,
            pointerEvents: 'none',
          }}
        />
      ) : null}
    </div>
  );
}

/** The plate with a clip: the same component, with `clip` required (start still → MP4 at `clip.at` → end still). */
export function ClipPlate(props: Parameters<typeof Illustration>[0] & { clip: ArtClip }) {
  return <Illustration {...props} />;
}

/**
 * A child of <Illustration> anchored at image fractions (u, v). `align` says which point of the child sits there
 * ('center' by default; e.g. 'bottom' puts the child's bottom-centre on the point, for a label above something).
 */
export function Pin({
  u,
  v,
  align = 'center',
  style,
  children,
}: {
  u: number;
  v: number;
  align?: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left';
  style?: CSSProperties;
  children: ReactNode;
}) {
  const shift: Record<string, string> = {
    center: 'translate(-50%, -50%)',
    top: 'translate(-50%, 0)',
    bottom: 'translate(-50%, -100%)',
    left: 'translate(0, -50%)',
    right: 'translate(-100%, -50%)',
    'top-left': 'none',
  };
  return <div style={{ position: 'absolute', left: `${u * 100}%`, top: `${v * 100}%`, transform: shift[align], ...style }}>{children}</div>;
}

/** A child of <Illustration> that covers the image rectangle (u0, v0)–(u1, v1): outlines, tints, hit areas. */
export function Region({ box, style, children }: { box: readonly [number, number, number, number]; style?: CSSProperties; children?: ReactNode }) {
  const [u0, v0, u1, v1] = box;
  return (
    <div style={{ position: 'absolute', left: `${u0 * 100}%`, top: `${v0 * 100}%`, width: `${(u1 - u0) * 100}%`, height: `${(v1 - v0) * 100}%`, boxSizing: 'border-box', ...style }}>
      {children}
    </div>
  );
}
