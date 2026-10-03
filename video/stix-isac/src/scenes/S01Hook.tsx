import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, mix, windowWeight } from '../../../engine/src/ui';
import { BRIDGE, PROMISE, TITLE } from '../data/s01-hook';
import { IncomingCard } from './parts/IncomingCard';
import { CalendarGlyph, TipFrame } from './parts/TipFrame';
import { Stage, segment, wordFrame } from './kit';

const S = 's01-hook';
const W = 1728;

// The TIP window: big and centred while the warning arrives, then small on the left for the title.
const TIP = { w: 1240, h: 560 } as const;
const BIG = { x: (W - TIP.w) / 2, y: 40, s: 1 } as const;
const SMALL = { x: 0, y: 34, s: 0.66 } as const;
/** The incoming card inside the TIP body (body-local, scale 1). */
const CARD = { x: (TIP.w - 760) / 2, y: 62, w: 760 } as const;

// Title column (right of the small window).
const COL_X = 862;
const COL_W = W - COL_X;

// Bridge strips across the bottom.
const STRIP_A = 444;
const STRIP_B = 544;

/**
 * Texture: the platform's feed of earlier items (no text, nothing readable).
 * They step down a little and fade as the new card lands on top.
 */
function FeedRows({ push, dim }: { push: number; dim: number }) {
  const rows = [0, 1, 2, 3];
  return (
    <>
      {rows.map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 48,
            top: 40 + i * 108 + push * 40,
            width: TIP.w - 96,
            height: 80,
            boxSizing: 'border-box',
            borderRadius: 14,
            border: `2px solid ${alpha(C.ink600, 0.7)}`,
            background: alpha(C.ink800, 0.6),
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            padding: '0 24px',
            opacity: (0.75 - 0.35 * push) * (1 - 0.6 * dim),
          }}
        >
          <div style={{ width: 40, height: 40, borderRadius: 10, background: alpha(C.ink600, 0.9) }} />
          <div style={{ width: 260 + ((i * 97) % 180), height: 16, borderRadius: 8, background: alpha(C.muted, 0.22) }} />
          <div style={{ flex: 1 }} />
          <div style={{ width: 120, height: 16, borderRadius: 8, background: alpha(C.muted, 0.14) }} />
        </div>
      ))}
    </>
  );
}

/**
 * s01-hook «Un aviso y un botón». Meridian's TIP opens with its date
 * «02-07-2026»; a new object slides in from the ISAC (mail sfx on the cue)
 * with the actor's domain, and on its card the «Bloquear» button starts to
 * beat while everything else dims. The window steps aside for the title and
 * the promise as three chips; the bridge places us: Meridian, aerospace,
 * targeted for months — until now mostly your own data, today a warning from
 * outside, in STIX.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();

  const tipAt = props.cue('tip');
  const incomingAt = props.cue('incoming');
  const blockAt = props.cue('block');
  const titleAt = props.cue('title');
  const bridgeAt = props.cue('bridge');
  const s3 = segment(props, 's01-03');

  // ---- Window and card.
  const dateGlow = windowWeight(frame, tipAt - 4, incomingAt + 20, { ramp: 10 });
  const domainGlow = windowWeight(frame, wordFrame(S, 's01-01', 'dominio') - 4, blockAt, { ramp: 10 });
  // «lo demás, atenuado» while the button beats; eases off a little once the title arrives.
  const restDim = 0.72 * progress(frame, blockAt - 2, 14) * (1 - 0.35 * progress(frame, titleAt, 20));
  const shrinkFrom = Math.max(blockAt + 24, titleAt - 28);
  const shrink = progress(frame, shrinkFrom, 24, EASE.inOut);
  const tip = { x: mix(BIG.x, SMALL.x, shrink), y: mix(BIG.y, SMALL.y, shrink), s: mix(BIG.s, SMALL.s, shrink) };
  const tipDim = 0.3 * progress(frame, bridgeAt, 16);

  // ---- Title and promise. The title is already half in on its cue (it must be on screen before 10 s).
  const titleIn = progress(frame, titleAt - 8, 14);
  const chipAt = PROMISE.map((p) => wordFrame(S, 's01-02', p.word) - 6);
  const chipsDim = 0.45 * progress(frame, bridgeAt, 16);

  // ---- Bridge.
  const aAt = Math.max(bridgeAt, wordFrame(S, 's01-03', 'Meridian') - 8);
  const bAt = wordFrame(S, 's01-03', 'Hasta') - 4;
  const b2At = Math.min(wordFrame(S, 's01-03', 'sobre') - 4, s3.to - 40);
  const targetAt = wordFrame(S, 's01-03', 'punto') - 6;

  return (
    <Stage>
      {/* Meridian's TIP with the incoming card */}
      <div style={{ position: 'absolute', left: tip.x, top: tip.y }}>
        <TipFrame width={TIP.w} height={TIP.h} scale={tip.s} at={-8} dateGlow={dateGlow} chromeDim={Math.max(restDim, 0.4 * shrink)} dim={tipDim} frame={frame}>
          <FeedRows push={progress(frame, incomingAt - 8, 16, EASE.inOut)} dim={Math.max(restDim, 0.5 * shrink)} />
          <div style={{ position: 'absolute', left: CARD.x, top: CARD.y }}>
            <IncomingCard
              at={incomingAt - 10}
              pulseAt={blockAt}
              pulseTo={bridgeAt + 20}
              domainGlow={domainGlow}
              restDim={restDim}
              width={CARD.w}
              frame={frame}
            />
          </div>
        </TipFrame>
      </div>

      {/* Title */}
      {titleIn > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: COL_X,
            top: 58,
            width: COL_W,
            textAlign: 'center',
            fontFamily: FONT.sans,
            opacity: titleIn,
            transform: `translateY(${(1 - titleIn) * 18}px)`,
          }}
        >
          <div style={{ fontSize: 64, fontWeight: 850, color: C.textStrong, letterSpacing: -1, lineHeight: 1.08, whiteSpace: 'nowrap' }}>{TITLE.main}</div>
          <div style={{ marginTop: 12, fontSize: 44, fontWeight: 750, color: '#c4b5fd', whiteSpace: 'nowrap' }}>{TITLE.sub}</div>
        </div>
      ) : null}

      {/* Promise: three chips */}
      {frame >= chipAt[0] - 2 ? (
        <div style={{ position: 'absolute', left: COL_X, top: 240, width: COL_W, display: 'flex', justifyContent: 'center', gap: 14, opacity: 1 - chipsDim }}>
          {PROMISE.map((p, i) => {
            const e = enter(frame, chipAt[i], { distance: 16 });
            const lit = progress(frame, chipAt[i], 10) * (1 - 0.5 * progress(frame, (chipAt[i + 1] ?? bridgeAt) - 2, 12, EASE.inOut));
            return (
              <div
                key={p.text}
                style={{
                  ...e,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                  height: 62,
                  padding: '0 24px 0 18px',
                  boxSizing: 'border-box',
                  borderRadius: RADIUS.pill,
                  border: `2px solid ${alpha(C.cyan, 0.4 + 0.5 * lit)}`,
                  background: alpha(C.cyan, 0.06 + 0.12 * lit),
                  boxShadow: lit > 0 ? `0 0 ${Math.round(22 * lit)}px ${alpha(C.cyan, 0.3 * lit)}` : undefined,
                  fontFamily: FONT.sans,
                  fontSize: 34,
                  fontWeight: 750,
                  color: C.textStrong,
                  whiteSpace: 'nowrap',
                }}
              >
                {i === 0 ? <CalendarGlyph size={34} color={C.cyan} /> : <Icon name={i === 1 ? 'link' : 'mail'} size={34} color={C.cyan} />}
                {p.text}
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Bridge A: who you are */}
      {frame >= aAt - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: STRIP_A, width: W, display: 'flex', justifyContent: 'center', ...enter(frame, aAt, { distance: 16 }) }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 18,
              height: 76,
              padding: '0 32px 0 22px',
              boxSizing: 'border-box',
              borderRadius: 18,
              border: `2px solid ${alpha(C.cyan, 0.55)}`,
              background: `linear-gradient(90deg, ${alpha(C.cyan, 0.14)} 0%, ${alpha(C.ink900, 0.95)} 55%)`,
              fontFamily: FONT.sans,
              fontSize: 40,
              fontWeight: 700,
              color: C.text,
              whiteSpace: 'nowrap',
            }}
          >
            <Icon name="shield" size={40} color={C.cyan} />
            <span style={{ fontWeight: 850, color: C.cyanSoft }}>{BRIDGE.meridian}</span>
            <span style={{ color: C.faint }}>·</span>
            <span>{BRIDGE.sector}</span>
            <span style={{ color: C.faint, opacity: progress(frame, targetAt, 12) }}>·</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, color: C.roseSoft, fontWeight: 800, opacity: progress(frame, targetAt, 12) }}>
              <Icon name="target" size={38} color={C.rose} />
              {BRIDGE.target}
            </span>
          </div>
        </div>
      ) : null}

      {/* Bridge B: until now / today */}
      {frame >= bAt - 2 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: STRIP_B,
            width: W,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 18,
            fontFamily: FONT.sans,
            fontSize: 38,
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ color: C.muted, ...enter(frame, bAt, { distance: 14 }) }}>{BRIDGE.before}</span>
          <span style={{ color: C.faint, opacity: progress(frame, b2At, 12) }}>·</span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              padding: '6px 18px',
              borderRadius: 14,
              border: `2px solid ${alpha(C.sky, 0.6)}`,
              background: alpha(C.sky, 0.1),
              color: '#bae6fd',
              fontWeight: 800,
              ...enter(frame, b2At, { distance: 14, axis: 'x' }),
            }}
          >
            <Icon name="mail" size={36} color={C.sky} />
            {BRIDGE.todayLead}
            <span style={{ color: '#c4b5fd', fontWeight: 850 }}>{BRIDGE.todayStix}</span>
          </span>
        </div>
      ) : null}
    </Stage>
  );
}
