import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, fadeIn, progress, pulse, springIn } from '../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../engine/src/ui';
import { Stage, segment, wordFrame } from './kit';

const S = 's02-sources';
const W = 1728;

const CARD_W = 540;
const CARD_GAP = (W - 3 * CARD_W) / 2;
const CARD_Y = 16;
const CARD_H = 452;
const CARD_X = [0, 1, 2].map((i) => i * (CARD_W + CARD_GAP));
const RIBBON_Y = 540;
const RIBBON_H = 84;

type Source = { n: number; icon: IconName; name: string; question: string; sample: 'pdns' | 'whois' | 'tls' };

const SOURCES: Source[] = [
  { n: 1, icon: 'database', name: 'Passive DNS', question: '¿A qué apuntaba y quién más vive ahí?', sample: 'pdns' },
  { n: 2, icon: 'file', name: 'WHOIS', question: '¿Quién lo registró y cuándo?', sample: 'whois' },
  { n: 3, icon: 'lock', name: 'Certificados', question: '¿Dónde se repite este certificado?', sample: 'tls' },
];

/**
 * s02-sources «Tres fuentes, tres preguntas»: three empty source slots, each
 * filled on its cue with its question in plain Spanish and a tiny sample of
 * what it returns — passive DNS, WHOIS, TLS certificates. On s02-05 one ribbon
 * ties all three: they are passive, the actor never finds out.
 */
export function S02Sources(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fills = [props.cue('pdns'), props.cue('whois'), props.cue('tls')];
  const s05 = segment(props, 's02-05').from;
  const questionWord = wordFrame(S, 's02-01', 'pregunta');
  const commonWord = Math.max(s05 + 10, wordFrame(S, 's02-05', 'común.') - 6);
  const unseenWord = Math.max(commonWord + 12, wordFrame(S, 's02-05', 'entere.') - 8);

  // The card being talked about glows; on s02-05 all three glow together.
  const together = progress(frame, s05, 16);

  return (
    <Stage>
      {SOURCES.map((src, i) => {
        const next = fills[i + 1] ?? s05;
        const own = progress(frame, fills[i] - 2, 12) * (1 - progress(frame, next - 4, 16));
        const glow = Math.max(own, together * (0.55 + 0.25 * pulse(frame, fps, 0.5)));
        return (
          <SourceCard
            key={src.name}
            src={src}
            x={CARD_X[i]}
            frame={frame}
            fps={fps}
            slotAt={i * 4}
            askAt={questionWord - 6 + i * 5}
            fillAt={fills[i]}
            glow={glow}
            passive={progress(frame, unseenWord, 12)}
          />
        );
      })}

      <Ribbon frame={frame} at={commonWord} unseenAt={unseenWord} />
    </Stage>
  );
}

function SourceCard({
  src,
  x,
  frame,
  fps,
  slotAt,
  askAt,
  fillAt,
  glow,
  passive,
}: {
  src: Source;
  x: number;
  frame: number;
  fps: number;
  slotAt: number;
  askAt: number;
  fillAt: number;
  glow: number;
  passive: number;
}) {
  const slot = enter(frame, slotAt, { distance: 16, duration: 16 });
  const fill = springIn(frame, fps, fillAt - 2, { damping: 16 });
  const filled = Math.min(1, fill * 1.2);
  const ask = springIn(frame, fps, askAt, { damping: 13 });
  const border = filled > 0.5 ? alpha(C.sky, 0.45 + 0.5 * glow) : C.ink600;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: CARD_Y,
        width: CARD_W,
        height: CARD_H,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px ${filled > 0.5 ? 'solid' : 'dashed'} ${border}`,
        background: filled > 0 ? `linear-gradient(180deg, ${alpha(C.sky, 0.04 + 0.08 * filled + 0.04 * glow)} 0%, ${alpha(C.ink900, 0.95)} 55%)` : alpha(C.ink900, 0.55),
        boxShadow: glow > 0.05 && filled > 0.5 ? `0 0 ${Math.round(14 + 30 * glow)}px ${alpha(C.sky, 0.3 * glow)}` : 'none',
        fontFamily: FONT.sans,
        overflow: 'hidden',
        ...slot,
      }}
    >
      {/* Empty slot: a big number and the question mark it will answer. */}
      {filled < 1 ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, opacity: 1 - filled }}>
          <div style={{ fontSize: 120, fontWeight: 850, color: C.ink600, lineHeight: 1 }}>{src.n}</div>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 38,
              display: 'grid',
              placeItems: 'center',
              border: `2px solid ${alpha(C.sky, 0.5)}`,
              background: alpha(C.sky, 0.08),
              fontSize: TYPE.h3,
              fontWeight: 850,
              color: C.sky,
              opacity: Math.min(1, ask * 1.3),
              transform: `scale(${0.6 + 0.4 * ask})`,
            }}
          >
            ?
          </div>
        </div>
      ) : null}

      {filled > 0 ? (
        <div style={{ position: 'absolute', inset: 0, padding: '28px 30px', opacity: filled, transform: `translateY(${(1 - filled) * 18}px)` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div
              style={{
                width: 68,
                height: 68,
                flexShrink: 0,
                borderRadius: 18,
                display: 'grid',
                placeItems: 'center',
                background: alpha(C.sky, 0.14),
                border: `2px solid ${alpha(C.sky, 0.45)}`,
              }}
            >
              <Icon name={src.icon} size={40} color={C.sky} />
            </div>
            <div>
              <div style={{ fontSize: TYPE.micro, fontWeight: 800, letterSpacing: 3, color: C.faint }}>FUENTE {src.n}</div>
              <div style={{ fontSize: 42, fontWeight: 850, color: C.textStrong, lineHeight: 1.1, whiteSpace: 'nowrap' }}>{src.name}</div>
            </div>
            <div style={{ marginLeft: 'auto', opacity: passive, transform: `scale(${0.7 + 0.3 * passive})` }}>
              <Icon name="eyeOff" size={38} color={C.emerald} />
            </div>
          </div>

          <div style={{ marginTop: 26, fontSize: 38, fontWeight: 750, lineHeight: 1.25, color: C.textStrong, height: 96 }}>«{src.question}»</div>

          <div
            style={{
              position: 'absolute',
              left: 30,
              right: 30,
              bottom: 28,
              height: 168,
              boxSizing: 'border-box',
              padding: '16px 22px',
              borderRadius: RADIUS.md,
              border: `2px solid ${C.ink700}`,
              background: alpha(C.ink950, 0.7),
              ...enter(frame, fillAt + 12, { distance: 12 }),
            }}
          >
            <Sample kind={src.sample} frame={frame} at={fillAt + 16} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** A tiny, texture-sized sample of what each source returns. */
function Sample({ kind, frame, at }: { kind: Source['sample']; frame: number; at: number }) {
  const row = (i: number) => ({ opacity: fadeIn(frame, at + i * 6, 10) });
  if (kind === 'pdns') {
    return (
      <div style={{ fontFamily: FONT.mono, fontSize: TYPE.small, lineHeight: 1.5, whiteSpace: 'nowrap' }}>
        <div style={{ ...row(0), color: C.text }}>update-svc-cdn.com</div>
        <div style={{ ...row(1), display: 'flex', alignItems: 'center', gap: 10, color: C.sky }}>
          <Icon name="arrowRight" size={24} color={C.faint} />
          185.220.x.x
        </div>
        <div style={{ ...row(2), color: C.cyanSoft }}>
          first seen <span style={{ color: C.textStrong }}>2026-02-11</span>
        </div>
      </div>
    );
  }
  if (kind === 'whois') {
    return (
      <div style={{ fontFamily: FONT.sans, fontSize: TYPE.small, lineHeight: 1.5 }}>
        {['registrador', 'fecha de alta', 'contacto'].map((f, i) => (
          <div key={f} style={{ ...row(i), display: 'flex', alignItems: 'center', gap: 16, whiteSpace: 'nowrap' }}>
            <span style={{ width: 170, color: C.muted, fontWeight: 600 }}>{f}</span>
            <Blank w={[170, 130, 200][i]} />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <div style={{ ...row(0) }}>
        <Icon name="key" size={56} color={C.emerald} />
      </div>
      <div style={{ fontFamily: FONT.mono, fontSize: TYPE.small, lineHeight: 1.5, whiteSpace: 'nowrap' }}>
        <div style={{ ...row(0), color: C.textStrong, fontWeight: 700 }}>CN=updatesvc</div>
        <div style={{ ...row(1), color: C.cyanSoft }}>SHA1 d4:7e:02…</div>
        <div style={{ ...row(2), display: 'flex', gap: 10, marginTop: 4 }}>
          {[0, 1, 2].map((k) => (
            <span
              key={k}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '2px 10px',
                borderRadius: RADIUS.sm,
                border: `2px dashed ${alpha(C.sky, 0.45)}`,
                fontFamily: FONT.sans,
                fontSize: TYPE.micro,
                fontWeight: 800,
                color: C.sky,
              }}
            >
              <Icon name="server" size={22} color={C.sky} />?
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Blank({ w }: { w: number }) {
  return <span style={{ display: 'inline-block', width: w, height: 18, borderRadius: 9, background: alpha(C.muted, 0.35) }} />;
}

/** One emerald ribbon under all three cards: passive, the actor never finds out. */
function Ribbon({ frame, at, unseenAt }: { frame: number; at: number; unseenAt: number }) {
  if (frame < at - 2) return null;
  const grow = progress(frame, at, 20, EASE.inOut);
  const text = enter(frame, at + 12, { distance: 12 });
  const tail = fadeIn(frame, unseenAt, 12);
  return (
    <>
      <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
        {CARD_X.map((x, i) => {
          const p = progress(frame, at + 4 + i * 4, 12);
          if (p <= 0) return null;
          const cx = x + CARD_W / 2;
          const y1 = CARD_Y + CARD_H + 6;
          return <line key={i} x1={cx} y1={y1} x2={cx} y2={y1 + (RIBBON_Y - y1 - 4) * p} stroke={alpha(C.emerald, 0.75)} strokeWidth={4} strokeLinecap="round" strokeDasharray="6 9" />;
        })}
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: RIBBON_Y,
          width: W,
          height: RIBBON_H,
          boxSizing: 'border-box',
          borderRadius: RADIUS.pill,
          border: `2px solid ${alpha(C.emerald, 0.7)}`,
          background: `linear-gradient(90deg, ${alpha(C.emerald, 0.05)} 0%, ${alpha(C.emerald, 0.16)} 50%, ${alpha(C.emerald, 0.05)} 100%)`,
          boxShadow: `0 0 30px ${alpha(C.emerald, 0.18)}`,
          clipPath: `inset(0 ${50 - 50 * grow}% 0 ${50 - 50 * grow}% round 42px)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 18,
          fontFamily: FONT.sans,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, ...text }}>
          <Icon name="eyeOff" size={42} color={C.emerald} />
          <span style={{ fontSize: TYPE.body, fontWeight: 850, color: C.emerald, letterSpacing: 1 }}>pasivo</span>
          <Dot />
          <span style={{ fontSize: TYPE.body, fontWeight: 700, color: C.textStrong, whiteSpace: 'nowrap', opacity: 0.35 + 0.65 * tail }}>el actor no se entera</span>
        </div>
      </div>
    </>
  );
}

function Dot(): ReactNode {
  return <span style={{ fontSize: TYPE.body, color: C.faint }}>·</span>;
}
