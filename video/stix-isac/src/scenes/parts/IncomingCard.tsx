import type { CSSProperties } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, progress, pulse } from '../../../../engine/src/theme/motion';
import { Icon, clamp01, windowWeight } from '../../../../engine/src/ui';

/**
 * The incoming object card in Meridian's TIP: «nuevo · indicador STIX»,
 * «fuente: ISAC aeroespacial», the domain (mono, rose: the actor's) and a
 * «Bloquear» button that can beat (`pulseAt`). The block button lives HERE,
 * on the card of the incoming object — never on a domain node.
 *
 * s03 state: at `strikeAt` the button turns into «bloquear este aviso» and is
 * struck through (the error sfx plays on that frame), and at `tickAt`
 * «mirar atrás» appears under it, ticked (emerald). The card grows to make
 * room for that row; reserve `incomingCardHeight(width, true)`.
 *
 * Drawn in design units (INCOMING_BASE.w wide) and scaled to `width`. All
 * frames are Sequence-relative; `frame` defaults to useCurrentFrame().
 */

export const INCOMING_TEXT = {
  badge: 'nuevo · indicador STIX',
  sourceLead: 'fuente:',
  source: 'ISAC aeroespacial',
  domain: 'cdn-sync-status.example',
  block: 'Bloquear',
  blockThis: 'bloquear este aviso',
  lookBack: 'mirar atrás',
  expired: 'caducado',
} as const;

const W = 760;
const PAD_X = 34;
const HEAD_H = 80;
const SRC_Y = 98;
const SRC_H = 52;
const DOM_Y = 160;
const DOM_H = 72;
const ACT_Y = 252;
const ACT_H = 76;
const BASE_H = ACT_Y + ACT_H + 28;
const LOOK_Y = ACT_Y + ACT_H + 16;
const LOOK_H = 72;
const DEC_H = LOOK_Y + LOOK_H + 28;

export const INCOMING_BASE = { w: W, h: BASE_H, hDecision: DEC_H } as const;

/** Height in px of the card at `width`; `decision` = with the s03 «mirar atrás» row. */
export function incomingCardHeight(width: number = W, decision = false): number {
  return ((decision ? DEC_H : BASE_H) * width) / W;
}

/** Centre of the «Bloquear» button in px from the card's top-left, at `width`. */
export function incomingButtonCenter(width: number = W): { x: number; y: number } {
  const s = width / W;
  return { x: (PAD_X + 150) * s, y: (ACT_Y + ACT_H / 2) * s };
}

/** Box of the domain text in px from the card's top-left, at `width`. */
export function incomingDomainBox(width: number = W): { x: number; y: number; w: number; h: number } {
  const s = width / W;
  return { x: (PAD_X + 56) * s, y: DOM_Y * s, w: INCOMING_TEXT.domain.length * 0.6 * 44 * s, h: DOM_H * s };
}

export function IncomingCard({
  at,
  pulseAt,
  pulseTo,
  strikeAt,
  tickAt,
  expiredAt,
  domainGlow = 0,
  restDim = 0,
  width = W,
  dim = 0,
  glow = 0,
  frame: frameProp,
  style,
}: {
  /** Frame the card starts to slide in from the right; it lands ~10 frames later. Undefined: already on screen. */
  at?: number;
  /** Frame the «Bloquear» button starts to beat. */
  pulseAt?: number;
  /** Frame it stops beating (default: never, or `strikeAt`). */
  pulseTo?: number;
  /** s03: the button becomes «bloquear este aviso», struck through. */
  strikeAt?: number;
  /** s03: «mirar atrás» appears ticked (default strikeAt + 14). Needs strikeAt. */
  tickAt?: number;
  /** Optional amber «caducado» chip in the header. */
  expiredAt?: number;
  /** 0–1: the domain row lights up (rose). */
  domainGlow?: number;
  /** 0–1: dims everything on the card except the button (the button is the subject). */
  restDim?: number;
  width?: number;
  /** 0–1: steps the whole card back. */
  dim?: number;
  /** 0–1: sky halo (the new object). */
  glow?: number;
  frame?: number;
  style?: CSSProperties;
}) {
  const current = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = frameProp ?? current;
  const s = width / W;

  const slide = at === undefined ? 1 : progress(frame, at, 14, EASE.out);
  if (slide <= 0) return null;
  // A short sky flash as the card lands.
  const landAt = at === undefined ? Number.NEGATIVE_INFINITY : at + 10;
  const flash = at === undefined ? 0 : progress(frame, landAt - 2, 4) * (1 - progress(frame, landAt + 4, 22, EASE.inOut));

  const decision = strikeAt !== undefined;
  const tick = tickAt ?? (strikeAt === undefined ? undefined : strikeAt + 14);
  const strike = strikeAt === undefined ? 0 : progress(frame, strikeAt, 10, EASE.out);
  const relabel = strikeAt === undefined ? 0 : progress(frame, strikeAt, 6);
  const grow = tick === undefined ? 0 : progress(frame, tick - 6, 14, EASE.inOut);
  const tickP = tick === undefined ? 0 : progress(frame, tick, 12);
  const h = decision ? BASE_H + (DEC_H - BASE_H) * grow : BASE_H;

  const pulseEnd = pulseTo ?? strikeAt ?? Number.POSITIVE_INFINITY;
  const beatW = pulseAt === undefined ? 0 : windowWeight(frame, pulseAt, pulseEnd, { ramp: 8, lead: 2 });
  const beat = beatW * (0.35 + 0.65 * pulse(frame - (pulseAt ?? 0), fps, 0.9));
  const expired = expiredAt === undefined ? 0 : progress(frame, expiredAt, 12);

  const rd = clamp01(restDim);
  const restStyle: CSSProperties = { opacity: 1 - 0.62 * rd, filter: rd > 0.001 ? `saturate(${1 - 0.5 * rd})` : undefined };
  const dg = clamp01(domainGlow);
  const g = Math.max(clamp01(glow), flash);
  const d = clamp01(dim);

  // Button look: rose and solid while it beats, quiet outline otherwise, grey once struck.
  const struck = relabel > 0.5;
  const btnSolid = struck ? 0 : beatW;
  const btnBorder = struck ? alpha(C.muted, 0.6) : alpha(C.rose, 0.55 + 0.45 * beatW);

  return (
    <div style={{ position: 'relative', width, height: h * s, opacity: slide * (1 - 0.6 * d), filter: d > 0.001 ? `saturate(${1 - 0.5 * d})` : undefined, ...style }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: W,
          height: h,
          transform: `scale(${s}) translateX(${(1 - slide) * 140}px)`,
          transformOrigin: '0 0',
          boxSizing: 'border-box',
          borderRadius: RADIUS.lg,
          border: `2px solid ${alpha(C.sky, 0.35 + 0.55 * g)}`,
          background: `linear-gradient(180deg, ${C.ink800} 0%, ${C.ink850} 100%)`,
          boxShadow: `0 28px 64px ${alpha('#000000', 0.45)}${g > 0 ? `, 0 0 ${24 + 34 * g}px ${alpha(C.sky, 0.38 * g)}` : ''}`,
          overflow: 'hidden',
          fontFamily: FONT.sans,
        }}
      >
        {/* Left accent bar: the object comes from outside (sky). */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 8, background: C.sky, opacity: 0.85 }} />

        {/* Header: «nuevo · indicador STIX» (+ «caducado») */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: W,
            height: HEAD_H,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: `0 ${PAD_X - 10}px 0 ${PAD_X}px`,
            borderBottom: `2px solid ${C.ink700}`,
            background: alpha(C.ink900, 0.55),
            ...restStyle,
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              height: 50,
              padding: '0 20px 0 14px',
              borderRadius: RADIUS.pill,
              background: alpha(C.sky, 0.16),
              border: `2px solid ${alpha(C.sky, 0.7)}`,
              whiteSpace: 'nowrap',
            }}
          >
            <Icon name="mail" size={32} color={C.sky} />
            <span style={{ fontSize: 32, fontWeight: 800, color: '#bae6fd' }}>{INCOMING_TEXT.badge}</span>
          </span>
          <span style={{ flex: 1 }} />
          {expired > 0 ? (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                height: 46,
                padding: '0 16px',
                borderRadius: RADIUS.pill,
                background: alpha(C.amber, 0.16),
                border: `2px solid ${alpha(C.amber, 0.85)}`,
                fontSize: 30,
                fontWeight: 800,
                color: '#fde68a',
                whiteSpace: 'nowrap',
                opacity: expired,
                transform: `scale(${0.9 + 0.1 * expired})`,
              }}
            >
              <Icon name="clock" size={28} color={C.amber} />
              {INCOMING_TEXT.expired}
            </span>
          ) : null}
        </div>

        {/* Source */}
        <div style={{ position: 'absolute', left: PAD_X, top: SRC_Y, height: SRC_H, display: 'flex', alignItems: 'center', gap: 14, whiteSpace: 'nowrap', ...restStyle }}>
          <Icon name="users" size={36} color={C.sky} />
          <span style={{ fontSize: 36, fontWeight: 600, color: C.muted }}>{INCOMING_TEXT.sourceLead}</span>
          <span style={{ fontSize: 36, fontWeight: 800, color: '#bae6fd' }}>{INCOMING_TEXT.source}</span>
        </div>

        {/* Domain (the actor's: rose) */}
        <div
          style={{
            position: 'absolute',
            left: PAD_X - 12,
            top: DOM_Y,
            width: W - 2 * PAD_X + 24,
            height: DOM_H,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '0 12px',
            borderRadius: 14,
            background: alpha(C.rose, 0.05 + 0.12 * dg),
            border: `2px solid ${alpha(C.rose, 0.18 + 0.6 * dg)}`,
            boxShadow: dg > 0 ? `0 0 ${Math.round(24 * dg)}px ${alpha(C.rose, 0.3 * dg)}` : undefined,
            whiteSpace: 'nowrap',
            ...restStyle,
          }}
        >
          <Icon name="globe" size={42} color={C.rose} />
          <span style={{ fontFamily: FONT.mono, fontSize: 44, fontWeight: 750, color: C.roseSoft, letterSpacing: -0.5 }}>{INCOMING_TEXT.domain}</span>
        </div>

        {/* The button (s03: «bloquear este aviso», struck) */}
        <div
          style={{
            position: 'absolute',
            left: PAD_X,
            top: ACT_Y,
            height: ACT_H,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 14,
              height: ACT_H - 6,
              padding: '0 32px 0 24px',
              boxSizing: 'border-box',
              borderRadius: 16,
              border: `3px solid ${btnBorder}`,
              background: btnSolid > 0 ? alpha(C.rose, 0.18 + 0.72 * btnSolid) : struck ? alpha(C.ink900, 0.6) : alpha(C.rose, 0.1),
              boxShadow: beat > 0 && !struck ? `0 0 ${Math.round(10 + 34 * beat)}px ${alpha(C.rose, 0.65 * beat)}, 0 0 0 ${Math.round(8 * beat)}px ${alpha(C.rose, 0.18 * beat)}` : undefined,
              transform: `scale(${1 + 0.05 * beat})`,
              transformOrigin: '0 50%',
              whiteSpace: 'nowrap',
            }}
          >
            <Icon name={struck ? 'x' : 'lock'} size={36} color={struck ? C.muted : btnSolid > 0.5 ? C.ink950 : C.rose} strokeWidth={2.4} />
            {/* Both labels share the slot: «Bloquear» fades out as «bloquear este aviso» fades in. */}
            <span style={{ position: 'relative', display: 'inline-block' }}>
              <span
                style={{
                  fontSize: 42,
                  fontWeight: 850,
                  color: btnSolid > 0.5 ? C.ink950 : C.roseSoft,
                  opacity: 1 - relabel,
                  position: relabel > 0.5 ? 'absolute' : 'relative',
                  left: 0,
                  top: 0,
                }}
              >
                {INCOMING_TEXT.block}
              </span>
              {relabel > 0 ? (
                <span
                  style={{
                    fontSize: 42,
                    fontWeight: 750,
                    color: C.muted,
                    opacity: relabel,
                    position: relabel > 0.5 ? 'relative' : 'absolute',
                    left: 0,
                    top: 0,
                  }}
                >
                  {INCOMING_TEXT.blockThis}
                </span>
              ) : null}
            </span>
            {/* The strike */}
            {strike > 0 ? (
              <div
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  height: 6,
                  marginTop: -3,
                  width: `calc(${strike * 100}% - 28px)`,
                  borderRadius: 3,
                  background: C.rose,
                  boxShadow: `0 0 12px ${alpha(C.rose, 0.6)}`,
                }}
              />
            ) : null}
          </div>
        </div>

        {/* s03: «mirar atrás», ticked */}
        {decision && tickP > 0 ? (
          <div
            style={{
              position: 'absolute',
              left: PAD_X,
              top: LOOK_Y,
              height: LOOK_H,
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              whiteSpace: 'nowrap',
              opacity: tickP,
              transform: `translateY(${(1 - tickP) * 10}px)`,
            }}
          >
            <div
              style={{
                width: 54,
                height: 54,
                boxSizing: 'border-box',
                borderRadius: 12,
                border: `3px solid ${C.emerald}`,
                background: alpha(C.emerald, 0.2 * tickP),
                display: 'grid',
                placeItems: 'center',
                boxShadow: `0 0 ${Math.round(22 * tickP)}px ${alpha(C.emerald, 0.4 * tickP)}`,
              }}
            >
              <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke={C.emerald} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 12.5 4.5 4.5L19 7.5" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - progress(frame, (tick ?? 0) + 2, 10)} />
              </svg>
            </div>
            <span style={{ fontSize: 44, fontWeight: 850, color: '#6ee7b7' }}>{INCOMING_TEXT.lookBack}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
