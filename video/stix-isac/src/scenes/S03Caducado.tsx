import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, dimStyle, mix } from '../../../engine/src/ui';
import { CLOSE, RETRO, RULE } from '../data/s03-caducado';
import { IncomingCard, incomingCardHeight } from './parts/IncomingCard';
import { NeighbourNote, neighbourNoteSize } from './parts/NeighbourNote';
import { TIP_HEADER_H, TipFrame } from './parts/TipFrame';
import { PDNS_W, PdnsPanel } from './parts/s03-caducado/Pdns';
import { RetentionTimeline, dayX } from './parts/s03-caducado/Retention';
import { DAYS } from '../data/s03-caducado';
import { Stage, segment, wordFrame } from './kit';

const S = 's03-caducado';
const W = 1728;

// Phase 1: the TIP with the incoming card (centre, then left) and the neighbours' note (right).
const CARD_W = 760;
// Wide enough for the full title bar, then scaled down so the note fits beside it.
const TIP = { w: 1000, h: TIP_HEADER_H + 24 + incomingCardHeight(CARD_W, true) + 24, s: 0.86 } as const;
const TIP_CENTRE = { x: (W - TIP.w * TIP.s) / 2, y: 60 } as const;
const TIP_LEFT = { x: 0, y: 60 } as const;
const NOTE_W = 840;
const NOTE_OPTS = { clinic: true, label: true } as const;
const NOTE = { x: W - NOTE_W, y: 96, h: neighbourNoteSize(NOTE_W, NOTE_OPTS).h } as const;

// Phase 2: the passive DNS history, below the intercepted message.
const PDNS_POS = { x: (W - PDNS_W) / 2, y: 252 } as const;
// Phase 3: it moves up and the rule appears under it.
const PDNS_UP = { y: 10, s: 0.8 } as const;
const RULE_Y = 392;

/**
 * s03-caducado «Caducado para bloquear». On the incoming card «bloquear este
 * aviso» is struck (error sfx on the cue) and «mirar atrás» is ticked; the
 * note's number passes to a clinic and the padlock falls on her — «a ciegas,
 * castigas a quien lo herede». HOLLOW LANTERN's message types out at the top
 * while passive DNS shows the domain's last sighting (18-04) and «nada
 * después». The rule for your own evidence, then the retention timeline:
 * a call log running back from today, the seen stretch, the EDR reaching it,
 * the proxy not. «retro-hunt», and the close. No search results anywhere.
 */
export function S03Caducado(props: SceneProps) {
  const frame = useCurrentFrame();

  const strikeAt = props.cue('strike');
  const reassignedAt = props.cue('reassigned');
  const dnsAt = props.cue('dns-last');
  const ownAt = props.cue('own-evidence');
  const retentionAt = props.cue('retention');
  const retroAt = props.cue('retro-hunt');
  const wrapAt = props.cue('wrap');
  const s1 = segment(props, 's03-01');
  const s2 = segment(props, 's03-02');
  const s5 = segment(props, 's03-05');

  // ---- Phase 1: card + note. Everything here is gone before the intercepted message, which
  // types out in the silent lead (>= 3.5 s) between s03-01 and s03-02.
  const clearFrom = Math.min(s1.to, s2.from - 105);
  const toLeft = progress(frame, reassignedAt - 14, 20, EASE.inOut);
  const tip = { x: mix(TIP_CENTRE.x, TIP_LEFT.x, toLeft), y: mix(TIP_CENTRE.y, TIP_LEFT.y, toLeft) };
  const p1Out = progress(frame, clearFrom - 18, 14, EASE.inOut);
  const expiredAt = wordFrame(S, 's03-01', 'ISAC') - 4;
  const reassignAt = wordFrame(S, 's03-01', 'manos') - 12;
  const lockAt = wordFrame(S, 's03-01', 'bloquearlo') - 2;
  const labelAt = wordFrame(S, 's03-01', 'castiga') - 6;

  // ---- Phase 2: passive DNS (never above y 230 while the message is up, until s2.to).
  // ---- Phase 3: the rule. The console stays put (a little dimmed) until the rule needs the room.
  const ruleAt = Math.max(Math.max(ownAt, s2.to) + 16, wordFrame(S, 's03-03', 'si') - 6);
  const upFrom = Math.max(ownAt, s2.to, ruleAt - 16);
  const up = progress(frame, upFrom, 22, EASE.inOut);
  const settle = progress(frame, Math.max(ownAt, s2.to), 16);
  const p23Out = progress(frame, retentionAt - 10, 14, EASE.inOut);
  const pdnsY = mix(PDNS_POS.y, PDNS_UP.y, up);
  const pdnsS = mix(1, PDNS_UP.s, up);

  // ---- Phase 4: retention, retro-hunt, close.
  const reachAt = Math.max(s5.from - 4, wordFrame(S, 's03-04', 'proxy') + 30);
  const retroIn = progress(frame, retroAt - 4, 16);
  const closeIn = progress(frame, wrapAt, 18);
  const retroDim = 0.5 * progress(frame, wrapAt, 18, EASE.inOut);
  const reachMidX = (dayX(DAYS.edrFrom) + dayX(DAYS.seenEnd)) / 2;

  return (
    <Stage>
      {/* Phase 1 */}
      {p1Out < 1 ? (
        <>
          <div style={{ position: 'absolute', left: tip.x, top: tip.y, opacity: 1 - p1Out }}>
            <TipFrame width={TIP.w} height={TIP.h} scale={TIP.s} frame={frame} chromeDim={0.5}>
              <div style={{ position: 'absolute', left: (TIP.w - CARD_W) / 2, top: 24 }}>
                <IncomingCard width={CARD_W} pulseAt={0} strikeAt={strikeAt} expiredAt={expiredAt} frame={frame} />
              </div>
            </TipFrame>
          </div>
          <div style={{ position: 'absolute', left: NOTE.x, top: NOTE.y, opacity: 1 - p1Out }}>
            <NeighbourNote
              at={reassignedAt - 6}
              width={NOTE_W}
              reassignAt={reassignAt}
              lockAt={lockAt}
              labelAt={labelAt}
              focus={[{ id: 'number', from: reassignAt, to: clearFrom }]}
              frame={frame}
            />
          </div>
        </>
      ) : null}

      {/* Phase 2–3: passive DNS */}
      {frame >= clearFrom - 8 && p23Out < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: PDNS_POS.x,
            top: pdnsY,
            transform: `scale(${pdnsS})`,
            transformOrigin: '50% 0',
            ...dimStyle(Math.max(0.6 * up, 0.25 * settle), 1 - p23Out),
          }}
        >
          <PdnsPanel
            frame={frame}
            openAt={clearFrom - 6}
            rowAt={dnsAt}
            growAt={wordFrame(S, 's03-02', 'historial') - 4}
            dateAt={wordFrame(S, 's03-02', 'dieciocho') - 4}
            nothingAt={wordFrame(S, 's03-02', 'abril') + 4}
          />
        </div>
      ) : null}

      {/* Phase 3: the rule for your own evidence */}
      {frame >= ruleAt - 2 && p23Out < 1 ? (
        <div style={{ position: 'absolute', left: 0, top: RULE_Y, width: W, display: 'flex', justifyContent: 'center', opacity: 1 - p23Out }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 22,
              height: 112,
              padding: '0 44px 0 34px',
              boxSizing: 'border-box',
              borderRadius: RADIUS.lg,
              border: `3px solid ${alpha(C.emerald, 0.85)}`,
              background: `linear-gradient(90deg, ${alpha(C.emerald, 0.18)} 0%, ${alpha(C.ink900, 0.95)} 70%)`,
              boxShadow: `0 0 34px ${alpha(C.emerald, 0.25)}, 0 24px 56px ${alpha('#000000', 0.4)}`,
              fontFamily: FONT.sans,
              fontSize: 52,
              fontWeight: 850,
              color: C.textStrong,
              whiteSpace: 'nowrap',
              letterSpacing: -0.5,
              ...enter(frame, ruleAt, { distance: 18 }),
            }}
          >
            <Icon name="eye" size={56} color={C.emerald} />
            {RULE}
          </div>
        </div>
      ) : null}

      {/* Phase 4: retention timeline */}
      <RetentionTimeline
        frame={frame}
        opacity={progress(frame, retentionAt - 6, 12)}
        t={{
          rewindAt: retentionAt,
          edrAt: wordFrame(S, 's03-04', 'EDR') - 4,
          proxyAt: wordFrame(S, 's03-04', 'proxy') - 4,
          reachAt,
          dimAt: wrapAt,
        }}
      />

      {/* retro-hunt label, over the reachable stretch */}
      {retroIn > 0 ? (
        <>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 24,
              width: W,
              display: 'flex',
              justifyContent: 'center',
              fontFamily: FONT.sans,
              fontSize: 48,
              fontWeight: 850,
              whiteSpace: 'nowrap',
              letterSpacing: -0.4,
              ...enter(frame, retroAt - 4, { distance: 14 }),
              ...dimStyle(retroDim, retroIn),
            }}
          >
            <span style={{ color: '#c4b5fd', textShadow: `0 0 22px ${alpha(C.violet, 0.4)}` }}>{RETRO.term}</span>
            <span style={{ color: C.faint, whiteSpace: 'pre' }}>{RETRO.sep}</span>
            <span style={{ color: '#6ee7b7' }}>{RETRO.rest}</span>
          </div>
          <svg width={W} height={170} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', ...dimStyle(retroDim, retroIn) }}>
            <line x1={reachMidX} y1={96} x2={reachMidX} y2={150} stroke={C.emerald} strokeWidth={4} strokeLinecap="round" />
            <polygon points={`${reachMidX - 10},146 ${reachMidX + 10},146 ${reachMidX},160`} fill={C.emerald} />
          </svg>
        </>
      ) : null}

      {/* Close */}
      {closeIn > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 556,
            width: W,
            textAlign: 'center',
            fontFamily: FONT.sans,
            fontSize: 50,
            fontWeight: 850,
            letterSpacing: -0.5,
            whiteSpace: 'nowrap',
            color: C.textStrong,
            ...enter(frame, wrapAt, { distance: 16 }),
          }}
        >
          <span style={{ color: '#fde68a' }}>{CLOSE.lead}</span> <span style={{ color: C.roseSoft }}>{CLOSE.a}</span>
          <span style={{ color: C.faint, whiteSpace: 'pre' }}>{CLOSE.sep}</span>
          <span style={{ color: '#6ee7b7' }}>{CLOSE.b}</span>
        </div>
      ) : null}
    </Stage>
  );
}
