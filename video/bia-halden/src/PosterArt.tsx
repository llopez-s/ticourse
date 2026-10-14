import { C, FONT, alpha } from '../../engine/src/theme/tokens';
import { Clock, Notebook, Till } from './scenes/parts/Cafe';

/** The poster's image, in its own units. */
export const POSTER_ART = { w: 850, h: 600 } as const;

/** The bars' scale: 80 minutes fill the whole width. */
const BAR_W = 800;
const PROMISE = 30; // minutes
const MEASURED = 80; // minutes
const BAR_H = 46;

/**
 * The video in one image. Top: the café's three glyphs (the wall clock = the RTO, the dead till, the
 * notebook = the RPO). Bottom: the promise against the measurement, two bars on one scale, with the
 * 30-minute promise line crossing both. Amber = what is promised, rose = what exceeds it.
 */
export function PosterArt() {
  const promiseX = (PROMISE / MEASURED) * BAR_W;
  return (
    <div style={{ position: 'relative', width: POSTER_ART.w, height: POSTER_ART.h, fontFamily: FONT.sans }}>
      {/* soft halos behind the café */}
      <svg width={POSTER_ART.w} height={POSTER_ART.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <defs>
          <radialGradient id="poster-rose">
            <stop offset="0%" stopColor={C.rose} stopOpacity={0.2} />
            <stop offset="100%" stopColor={C.rose} stopOpacity={0} />
          </radialGradient>
          <radialGradient id="poster-amber">
            <stop offset="0%" stopColor={C.amber} stopOpacity={0.14} />
            <stop offset="100%" stopColor={C.amber} stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={425} cy={140} r={250} fill="url(#poster-rose)" />
        <circle cx={712} cy={130} r={170} fill="url(#poster-amber)" />
      </svg>

      {/* the café: clock, till, notebook */}
      <div style={{ position: 'absolute', left: 30, top: 18 }}>
        <Clock size={230} glow={0.6} />
      </div>
      <div style={{ position: 'absolute', left: 305, top: 0 }}>
        <Till size={240} broken={1} glow={0.7} />
      </div>
      <div style={{ position: 'absolute', left: 592, top: 18 }}>
        <Notebook size={230} glow={0.6} />
      </div>
      <Tag x={147} color={C.cyanSoft}>
        RTO
      </Tag>
      <Tag x={425} color={C.roseSoft}>
        caja caída
      </Tag>
      <Tag x={720} color={C.amber}>
        RPO
      </Tag>

      {/* the promise against the measurement */}
      <div style={{ position: 'absolute', left: 25, top: 374, width: BAR_W }}>
        <BarRow label="RTO 30 min" tone={C.amber} width={promiseX} />
        <div style={{ height: 30 }} />
        <BarRow label="MTTR 80 min" tone={C.rose} width={BAR_W} split={promiseX} />
        {/* the promise line, across both bars */}
        <div
          style={{
            position: 'absolute',
            left: promiseX - 2,
            top: -8,
            width: 4,
            height: 2 * (BAR_H + 50) + 30 - 20,
            borderRadius: 2,
            background: C.textStrong,
            opacity: 0.85,
          }}
        />
      </div>

      {/* the café is a picture, not the port */}
      <div style={{ position: 'absolute', left: 25, top: 324, fontSize: 24, fontWeight: 550, color: C.faint, letterSpacing: 0.5 }}>
        imagen · no es del puerto
      </div>
    </div>
  );
}

function Tag({ x, color, children }: { x: number; color: string; children: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 150,
        width: 300,
        top: 262,
        textAlign: 'center',
        fontSize: 46,
        fontWeight: 850,
        letterSpacing: 1,
        color,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </div>
  );
}

function BarRow({ label, tone, width, split }: { label: string; tone: string; width: number; split?: number }) {
  return (
    <div>
      <div style={{ fontSize: 44, fontWeight: 850, letterSpacing: -0.5, color: tone, lineHeight: 1.1, height: 50, whiteSpace: 'nowrap' }}>{label}</div>
      <div style={{ position: 'relative', width, height: BAR_H, borderRadius: 10, background: tone, boxShadow: `0 0 28px ${alpha(tone, 0.35)}`, overflow: 'hidden' }}>
        {split !== undefined ? <div style={{ position: 'absolute', left: 0, top: 0, width: split, height: '100%', background: alpha(C.textStrong, 0.18) }} /> : null}
      </div>
    </div>
  );
}
