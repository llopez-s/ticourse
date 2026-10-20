import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { enter, progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { DECISION, PORT, TERMS } from '../data/s06-piezas';
import { CaseStamp, TermPill } from './parts/Labels';
import { BranchBeat } from './parts/s06-piezas/BranchBeat';
import { PiecesBeat } from './parts/s06-piezas/PiecesBeat';
import { Stage, wordFrame } from './kit';

const S = 's06-piezas';
const CARD = { x: 104, y: 486, w: 1520, h: 160 } as const;

/**
 * s06-piezas «Una puerta por pieza». The image («imagen · no es del puerto»): four bank branches on a street map; on
 * `robbed` (the alarm) one shutter is forced and its beacon flashes; the other three are intact. On `port` the map
 * shrinks to a corner and the proposal comes in: three pieces with their own deployment, «microservices»; on `blast`
 * one amber and two emerald, «blast radius»; the monolith turns amber whole on `monolith` (the error). On `calls` the
 * network lines with their «API» tags, «más puertas · más registros». On `decision` the decision, told on the
 * schematic with no image; on `verify` (the lock sound) the credential check stamps at each piece's door.
 */
export function S06Piezas(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const portAt = props.cue('port');
  const callsAt = props.cue('calls');
  const decisionAt = props.cue('decision');
  const verifyAt = props.cue('verify');
  const s2sAt = w('s06-05', 'service-to-service') - 6;

  return (
    <Stage>
      <BranchBeat
        frame={frame}
        fps={fps}
        t={{
          branches: props.cue('branches'),
          robbed: props.cue('robbed'),
          safe: w('s06-01', 'demás') - 4,
          shrink: portAt,
          back: w('s06-03', 'sucursales.') - 4,
          out: callsAt,
        }}
      />

      {frame >= portAt - 6 ? (
        <>
          <div style={{ position: 'absolute', left: 0, top: 0, ...enter(frame, portAt - 4, { distance: 14 }) }}>
            <CaseStamp what={PORT.what} kind={PORT.kind} />
          </div>
          <PiecesBeat
            frame={frame}
            t={{
              port: portAt,
              pieces: props.cue('pieces'),
              micro: w('s06-02', 'microservices.') - 6,
              blast: props.cue('blast'),
              blastTerm: w('s06-03', 'blast') - 6,
              monolith: props.cue('monolith'),
              calls: callsAt,
              doors: w('s06-04', 'puerta') - 4,
              verify: verifyAt,
            }}
          />
        </>
      ) : null}

      {frame >= decisionAt - 6 ? (
        <div
          style={{
            position: 'absolute',
            left: CARD.x,
            top: CARD.y,
            width: CARD.w,
            height: CARD.h,
            boxSizing: 'border-box',
            padding: '18px 32px',
            borderRadius: RADIUS.lg,
            background: alpha(C.ink900, 0.96),
            border: `3px solid ${alpha(C.emerald, 0.4 + 0.5 * progress(frame, verifyAt, 10))}`,
            boxShadow: `0 0 ${Math.round(30 * progress(frame, verifyAt, 10))}px ${alpha(C.emerald, 0.18)}`,
            fontFamily: FONT.sans,
            ...enter(frame, decisionAt - 2, { distance: 16 }),
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, whiteSpace: 'nowrap' }}>
            <Icon name="shield" size={44} color={C.emerald} />
            <span style={{ fontSize: 42, fontWeight: 850, color: C.textStrong }}>{DECISION.text}</span>
          </div>
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 26 }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: C.muted, whiteSpace: 'nowrap', opacity: progress(frame, verifyAt + 16, 12) }}>{DECISION.small}</span>
            {frame >= s2sAt - 4 ? (
              <div style={{ ...enter(frame, s2sAt, { distance: 10 }) }}>
                <TermPill text={TERMS.s2s} size={36} on={progress(frame, s2sAt, 10)} />
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </Stage>
  );
}
