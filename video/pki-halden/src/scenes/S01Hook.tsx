import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Icon, dimStyle, windowWeight } from '../../../engine/src/ui';
import { BRIDGE, PROMISE, RENEWAL, TITLE } from '../data/s01-hook';
import { LINE_BAR, LineBar } from './parts/s01-hook/LineBar';
import { MESSAGE_CARD, MessageCard } from './parts/s01-hook/Message';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = STAGE.width;

// ---- The bridge: the question over V11's line, centred as a pair on the stage.
const Q_SIZE = 60;
const Q_TOP = 222;
const LINE_TOP = 350;
/** The pair drops this far when the title arrives (and stays there, dimmed, until the message). */
const PAIR_DROP = 92;

// ---- Title block (from `title`).
const TITLE_TOP = 0;
const CHIPS_TOP = 100;

// ---- Monday's strip and Tuesday's message (from `renewal` / `message`).
const STRIP_TOP = 196;
const MSG_TOP = 290;
const MSG_X = Math.round((W - (MESSAGE_CARD.badge + MESSAGE_CARD.gap + MESSAGE_CARD.width)) / 2);

/**
 * s01-hook «No encuentro al emisor». V11's line, half-lit, settles in from
 * the first frame: curl's SSL row as one mono row, verbatim. On «duda» the
 * question V11 ended with lands over it, «¿Cómo sabes que esa clave pública
 * es del puerto?»; on «clave» the row's `id-ecPublicKey` brightens cyan (and
 * «clave pública» in the question with it), on «puerto» «del puerto» lights.
 * Before 12 s (`title`) «PKI: la cadena y la revocación» lands at the top
 * while the pair drops a little and steps back; the promise follows as three
 * chips, each on its words («abrimos», «falla», «sigue»). On `renewal`
 * Monday's strip arrives between the chips and the pair, «lunes 9-11 · por la
 * tarde · certificado nuevo en el portal · el anterior caducaba el 11-11»; on
 * `message` the pair goes and the shipping company's message (ship badge,
 * «martes 10-11 · 08:15», no address) pops in under the strip, its `unable to
 * get local issuer certificate` lit amber on «no conecta». The last frame:
 * dimmed title and chips, the strip, the message.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const renewalAt = props.cue('renewal');
  const messageAt = props.cue('message');

  // ---- The pair: the line from frame 0, the question on «duda» (always before «Cuando»).
  const settle = progress(frame, -10, 22);
  const qAt = Math.min(wordFrame(S, 's01-01', 'duda') - 8, wordFrame(S, 's01-01', 'Cuando') - 6);
  const qIn = enter(frame, qAt, { distance: 20, duration: 18 });
  const keyLit = progress(frame, wordFrame(S, 's01-01', 'clave') - 6, 14);
  const portLit = progress(frame, wordFrame(S, 's01-01', 'puerto') - 6, 12);

  // ---- Title before 12 s, whatever the voice does; the pair steps back under it.
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);
  const titleIn = enter(frame, titleAt, { distance: 22, duration: 18 });
  const pairDim = 0.55 * progress(frame, titleAt - 4, 18, EASE.inOut) + 0.3 * progress(frame, renewalAt - 6, 16, EASE.inOut);
  const pairDrop = PAIR_DROP * progress(frame, titleAt - 8, 24, EASE.inOut);
  // It stays as dimmed context under Monday's strip and goes as Tuesday's message takes its place.
  const pairOut = progress(frame, messageAt - 16, 12, EASE.inOut);

  // ---- Promise chips, one per idea the voice names.
  const chipAt = PROMISE.map((p) => wordFrame(S, 's01-02', p.word) - 6);

  // ---- Monday's strip, then Tuesday's message; the title block steps back.
  const restDim = 0.6 * progress(frame, renewalAt - 6, 16, EASE.inOut);
  const stripIn = enter(frame, renewalAt - 2, { distance: 18, duration: 16 });
  const stripDim = 0.3 * progress(frame, messageAt + 6, 16, EASE.inOut);
  const msgP = springIn(frame, fps, messageAt - 4, { damping: 16 });
  const badgeGlow = windowWeight(frame, wordFrame(S, 's01-03', 'naviera'), Number.POSITIVE_INFINITY, { ramp: 12 }) * 0.6;
  const errorLit = progress(frame, wordFrame(S, 's01-03', 'conecta') - 10, 12);

  return (
    <Stage>
      {/* The question V11 ended with */}
      {pairOut < 1 && frame >= qAt - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: Q_TOP + pairDrop + 14 * pairOut, width: W, textAlign: 'center', opacity: qIn.opacity * (1 - pairOut), transform: qIn.transform }}>
          <div
            style={{
              ...dimStyle(pairDim),
              fontFamily: FONT.sans,
              fontSize: Q_SIZE,
              fontWeight: 850,
              letterSpacing: -1,
              lineHeight: 1.1,
              color: C.textStrong,
              whiteSpace: 'nowrap',
            }}
          >
            {BRIDGE.before}
            <Lit text={BRIDGE.key} lit={keyLit} underline />
            {BRIDGE.middle}
            <Lit text={BRIDGE.port} lit={portLit} />
            {BRIDGE.after}
          </div>
        </div>
      ) : null}

      {/* V11's line, half-lit */}
      {pairOut < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: LINE_TOP + pairDrop + 14 * pairOut,
            width: W,
            height: LINE_BAR.height,
            display: 'flex',
            justifyContent: 'center',
            opacity: settle * (1 - pairOut),
            transform: `scale(${0.985 + 0.015 * settle})`,
          }}
        >
          <div style={{ ...dimStyle(pairDim) }}>
            <LineBar keyLit={keyLit} />
          </div>
        </div>
      ) : null}

      {/* Title */}
      {frame >= titleAt - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: TITLE_TOP, width: W, textAlign: 'center', fontFamily: FONT.sans, ...titleIn }}>
          <div style={{ ...dimStyle(restDim), fontSize: 66, fontWeight: 850, letterSpacing: -1.3, lineHeight: 1.08, color: C.textStrong, whiteSpace: 'nowrap' }}>
            <span style={{ color: C.cyan }}>{TITLE.lead}</span>
            {TITLE.rest}
          </div>
        </div>
      ) : null}

      {/* Promise: three chips */}
      {frame >= chipAt[0] - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: CHIPS_TOP, width: W, display: 'flex', justifyContent: 'center', gap: 22, ...dimStyle(restDim) }}>
          {PROMISE.map((p, i) => {
            const e = enter(frame, chipAt[i], { distance: 16 });
            const lit = progress(frame, chipAt[i], 10) * (1 - 0.55 * progress(frame, (chipAt[i + 1] ?? renewalAt) - 2, 12, EASE.inOut));
            return (
              <div
                key={p.text}
                style={{
                  ...e,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                  height: 62,
                  padding: '0 26px 0 18px',
                  boxSizing: 'border-box',
                  borderRadius: RADIUS.pill,
                  border: `2px solid ${alpha(C.cyan, 0.4 + 0.5 * lit)}`,
                  background: alpha(C.cyan, 0.06 + 0.12 * lit),
                  boxShadow: lit > 0.02 ? `0 0 ${Math.round(22 * lit)}px ${alpha(C.cyan, 0.3 * lit)}` : undefined,
                  fontFamily: FONT.sans,
                  fontSize: 36,
                  fontWeight: 750,
                  color: C.textStrong,
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon name={p.icon} size={34} color={C.cyan} />
                {p.text}
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Monday 9-11: the new certificate */}
      {frame >= renewalAt - 4 ? (
        <div style={{ position: 'absolute', left: 0, top: STRIP_TOP, width: W, display: 'flex', justifyContent: 'center', ...stripIn }}>
          <div
            style={{
              ...dimStyle(stripDim),
              display: 'inline-flex',
              alignItems: 'center',
              gap: 14,
              height: 60,
              padding: '0 28px 0 18px',
              boxSizing: 'border-box',
              borderRadius: RADIUS.md,
              border: `2px solid ${alpha(C.cyan, 0.7)}`,
              background: alpha(C.cyan, 0.1),
              fontFamily: FONT.sans,
              fontSize: 32,
              whiteSpace: 'nowrap',
            }}
          >
            <Icon name="clock" size={34} color={C.cyan} />
            <span style={{ fontFamily: FONT.mono, fontWeight: 800, color: C.cyanSoft }}>{RENEWAL.day}</span>
            <Dot />
            <span style={{ fontWeight: 700, color: C.text }}>{RENEWAL.when}</span>
            <Dot />
            <span style={{ fontWeight: 800, color: C.textStrong }}>{RENEWAL.what}</span>
            <Dot />
            <span style={{ fontWeight: 650, color: C.muted }}>{RENEWAL.before}</span>
          </div>
        </div>
      ) : null}

      {/* Tuesday 10-11, 08:15: the shipping company's message */}
      {msgP > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: MSG_X,
            top: MSG_TOP,
            opacity: Math.min(1, msgP * 1.4),
            transform: `translateY(${(1 - Math.min(1, msgP)) * 24}px) scale(${0.96 + 0.04 * Math.min(1, msgP)})`,
            transformOrigin: '50% 0%',
          }}
        >
          <MessageCard badgeGlow={badgeGlow} errorLit={errorLit} />
        </div>
      ) : null}
    </Stage>
  );
}

function Dot() {
  return <span style={{ fontWeight: 700, color: C.faint }}>·</span>;
}

/** A word of the question that lights cyan as the voice says it (optionally underlined). */
function Lit({ text, lit, underline = false }: { text: string; lit: number; underline?: boolean }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', whiteSpace: 'pre' }}>
      <span style={{ color: C.textStrong }}>{text}</span>
      <span style={{ position: 'absolute', left: 0, top: 0, color: C.cyan, opacity: lit }}>{text}</span>
      {underline ? (
        <span
          style={{
            position: 'absolute',
            left: 0,
            bottom: -4,
            height: 5,
            width: `${100 * lit}%`,
            borderRadius: 3,
            background: C.cyan,
            boxShadow: `0 0 14px ${alpha(C.cyan, 0.5)}`,
          }}
        />
      ) : null}
    </span>
  );
}
