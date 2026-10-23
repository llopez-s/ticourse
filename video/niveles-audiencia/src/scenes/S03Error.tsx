import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress, springIn } from '../../../engine/src/theme/motion';
import { cubicPoint, mix, type Point } from '../../../engine/src/ui';
import { ENVELOPES, S03, TONE, type EnvelopeId } from '../data/niveles';
import { Desk } from './parts/Desk';
import { Envelope, envelopeHeight } from './parts/Envelope';
import { FoxCard, HypotheticalTag } from './parts/Fox';
import { AskCard, EmptyRulesCell, FlyingDoc, IpSheet, QuestionStamp, SHEET, TrendSheet } from './parts/Sheets';
import { Stage, wordFrame } from './kit';

const S = 's03-error';
const W = STAGE.width;

interface Pos {
  x: number;
  y: number;
  w: number;
}

// Where each envelope lives in each phase (component box, stage-local). The closed envelope draws
// nothing above its body, so the empty top of the box may sit under the intercepted message.
const POS_A: Record<EnvelopeId, Pos> = { board: { x: 90, y: 225, w: 335 }, soc: { x: 475, y: 225, w: 335 } };
const POS_B: Record<EnvelopeId, Pos> = { board: { x: 400, y: 167, w: 421 }, soc: { x: 907, y: 167, w: 421 } };
const STATION_X: Record<EnvelopeId, number> = { board: 0, soc: 888 };
const POS_D: Record<EnvelopeId, Pos> = { board: { x: 0, y: 0, w: 200 }, soc: { x: 888, y: 0, w: 200 } };
const POS_F: Record<EnvelopeId, Pos> = { board: { x: 469, y: 225, w: 335 }, soc: { x: 924, y: 225, w: 335 } };
const TAG_TOP = 606;

const lerpPos = (a: Pos, b: Pos, t: number): Pos => ({ x: mix(a.x, b.x, t), y: mix(a.y, b.y, t), w: mix(a.w, b.w, t) });

/**
 * s03-error «Si se cruzan los sobres». The desk of s01 with the two envelopes, sealed, low on the left;
 * «Ejemplo hipotético · no ha pasado en Meridian» is on screen from the first frame to the last.
 * While EMBER FOX's intercepted message is up (engine, top centre) its card sits on the right:
 * «EMBER FOX · célula de acceso inicial · spearphishing», glowing on the name. On `reply-fox` it steps
 * aside and the envelopes rise, now labelled with the reader's question. On `swap` a document leaves
 * each one and they cross: the board's envelope keeps the SOC's. Both shrink to a station each. The
 * board's: the long list, «4.000 IP» counting on the words, rows with an «IP» chip and no value
 * (`board-gets`: its two questions beside it, still without an answer). The SOC's: the sector trends
 * assessment (`soc-gets`) and «¿qué bloqueamos hoy?» beside an empty cell where the rules would go
 * (`soc-none`). On `error` two stamps, and between the stations the label EL ERROR CLÁSICO (error sfx),
 * then «darle a cada uno lo del otro». On `mix-rule` the stations fold, the envelopes go back to their
 * place with a check each, and the rule appears: «producto correcto · audiencia correcta», with «mira
 * quién lo va a leer» under it.
 */
export function S03Error(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const replyAt = props.cue('reply-fox');
  const swapAt = props.cue('swap');
  const boardGetsAt = props.cue('board-gets');
  const socGetsAt = props.cue('soc-gets');
  const socNoneAt = props.cue('soc-none');
  const errorAt = props.cue('error');
  const mixAt = props.cue('mix-rule');

  const nameAt = wordFrame(S, 's03-01', 'EMBER');
  const asideAt = wordFrame(S, 's03-01', 'Útil') - 4;
  const liftAt = Math.max(replyAt + 20, wordFrame(S, 's03-01', 'Imagina') - 8);
  const lineAt = wordFrame(S, 's03-04', 'darle') - 6;
  const ipCountAt = wordFrame(S, 's03-02', '4.000') - 8;

  // ---- Phase progress.
  const deskIn = progress(frame, 0, 12);
  const foxIn = frame < 30 ? 0 : springIn(frame, fps, 30, { damping: 16 });
  const foxOut = progress(frame, asideAt, 18, EASE.inOut);
  const foxGlow = progress(frame, Math.max(replyAt, nameAt - 4), 12) * (1 - progress(frame, nameAt + 40, 24, EASE.inOut));
  const lift = progress(frame, liftAt, 22, EASE.inOut);
  const fly = progress(frame, swapAt, 40, EASE.inOut);
  const toStation = progress(frame, swapAt + 40, 30, EASE.inOut);
  const back = progress(frame, mixAt - 4, 28, EASE.inOut);
  const opened = progress(frame, swapAt + 56, 20, EASE.inOut) * (1 - progress(frame, mixAt - 8, 18, EASE.inOut));
  const stations = progress(frame, swapAt + 52, 16) * (1 - progress(frame, mixAt - 10, 16, EASE.inOut));

  const place = (id: EnvelopeId): Pos => lerpPos(lerpPos(lerpPos(POS_A[id], POS_B[id], lift), POS_D[id], toStation), POS_F[id], back);

  // ---- The documents cross (swap).
  const bCenter = (id: EnvelopeId): Point => ({ x: POS_B[id].x + POS_B[id].w / 2, y: POS_B[id].y + 0.58 * envelopeHeight(POS_B[id].w) });
  const arc = (from: EnvelopeId, to: EnvelopeId, bow: number, t: number): Point => {
    const a = bCenter(from);
    const b = bCenter(to);
    return cubicPoint([a, { x: a.x, y: a.y + bow }, { x: b.x, y: b.y + bow }, b], t);
  };

  // ---- Banner.
  const bannerIn = progress(frame, errorAt, 14);
  const lineIn = progress(frame, lineAt, 14);
  // ---- Rule.
  const ruleIn = progress(frame, mixAt, 16);
  const subIn = progress(frame, wordFrame(S, 's03-05', 'mira') - 6, 14);
  const checkIn = progress(frame, mixAt + 34, 14);

  return (
    <Stage>
      <Desk opacity={deskIn} />

      {/* EMBER FOX's card, while the message is up */}
      {foxIn > 0.001 && foxOut < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: 930,
            top: 340,
            opacity: Math.min(1, foxIn * 1.4) * (1 - foxOut),
            transform: `translateX(${(1 - Math.min(1, foxIn)) * 70 + foxOut * 90}px) scale(${0.95 + 0.05 * Math.min(1, foxIn)})`,
          }}
        >
          <FoxCard width={740} glow={foxGlow} />
        </div>
      ) : null}

      {/* Documents in flight */}
      {fly > 0 && fly < 1
        ? (['soc', 'board'] as const).map((from) => {
            const to: EnvelopeId = from === 'soc' ? 'board' : 'soc';
            const p = arc(from, to, from === 'soc' ? 150 : -170, fly);
            const k = fly < 0.15 ? fly / 0.15 : fly > 0.85 ? (1 - fly) / 0.15 : 1;
            return (
              <div key={from} style={{ position: 'absolute', left: p.x - 47, top: p.y - 60, opacity: Math.min(1, k * 1.5), transform: `rotate(${(from === 'soc' ? -1 : 1) * (14 - 28 * fly)}deg) scale(${0.7 + 0.3 * k})` }}>
                <FlyingDoc tone={from === 'soc' ? TONE.tactical : TONE.strategic} icon={from === 'soc' ? 'shield' : 'chart'} />
              </div>
            );
          })
        : null}

      {/* The envelopes */}
      {(['board', 'soc'] as const).map((id) => {
        const e = ENVELOPES[id];
        const p = place(id);
        const side = id === 'board' ? -1 : 1;
        return (
          <div key={id} style={{ position: 'absolute', left: p.x, top: p.y, transform: `rotate(${side * 2.4 * lift * (1 - toStation)}deg)`, transformOrigin: '50% 60%' }}>
            <Envelope
              width={p.w}
              label={e.label}
              sub={frame < swapAt + 36 || back > 0.05 ? (id === 'board' ? '¿dónde invertimos?' : '¿qué bloqueamos hoy?') : undefined}
              tone={e.tone}
              icon={id === 'board' ? 'users' : 'bell'}
              open={opened}
              sealOpacity={1 - progress(frame, swapAt + 36, 10)}
              glow={0.25 * lift * (1 - toStation)}
              check={checkIn}
              card={null}
            />
          </div>
        );
      })}

      {/* Station chips under the badges */}
      {stations > 0.01
        ? (['board', 'soc'] as const).map((id) => (
            <div
              key={id}
              style={{
                position: 'absolute',
                left: STATION_X[id],
                top: 178,
                width: 200,
                textAlign: 'center',
                fontFamily: FONT.sans,
                fontSize: 36,
                fontWeight: 850,
                color: ENVELOPES[id].tone,
                opacity: stations,
              }}
            >
              {ENVELOPES[id].label}
            </div>
          ))
        : null}

      {/* Board's station: the long list and its two questions */}
      {stations > 0.01 ? (
        <>
          <Unfold at={swapAt + 52} frame={frame} out={1 - stations} left={STATION_X.board + 224} top={0}>
            <IpSheet f={Math.max(0, frame - swapAt - 52)} countFrom={Math.max(0, ipCountAt - swapAt - 52)} />
          </Unfold>
          <div style={{ position: 'absolute', left: STATION_X.board + 608, top: 6, opacity: stations }}>
            <AskCard text={S03.boardQuestions[0]} tone={TONE.strategic} at={boardGetsAt} frame={frame} />
          </div>
          <div style={{ position: 'absolute', left: STATION_X.board + 608, top: 180, opacity: stations }}>
            <AskCard text={S03.boardQuestions[1]} tone={TONE.strategic} at={boardGetsAt + 16} frame={frame} />
          </div>
        </>
      ) : null}

      {/* SOC's station: the trends and its question beside an empty cell */}
      {stations > 0.01 ? (
        <>
          <Unfold at={socGetsAt} frame={frame} out={1 - stations} left={STATION_X.soc + 224} top={0}>
            <TrendSheet f={Math.max(0, frame - socGetsAt)} />
          </Unfold>
          <div style={{ position: 'absolute', left: STATION_X.soc + 608, top: 6, opacity: stations }}>
            <AskCard text={S03.socQuestion} tone={TONE.tactical} at={socNoneAt} frame={frame} />
          </div>
          <div style={{ position: 'absolute', left: STATION_X.soc + 608, top: 190, opacity: stations }}>
            <EmptyRulesCell at={socNoneAt + 18} frame={frame} />
          </div>
        </>
      ) : null}

      {/* The two stamps */}
      {stations > 0.01
        ? (['board', 'soc'] as const).map((id) => (
            <div key={id} style={{ position: 'absolute', left: STATION_X[id] + 14, top: 236, opacity: stations }}>
              <QuestionStamp at={errorAt + (id === 'soc' ? 6 : 0)} frame={frame} size={124} />
            </div>
          ))
        : null}

      {/* EL ERROR CLÁSICO */}
      {bannerIn > 0.01 && stations > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: 448, width: W, display: 'flex', justifyContent: 'center', opacity: bannerIn * stations, transform: `translateY(${(1 - bannerIn) * 16}px)` }}>
          <div
            style={{
              boxSizing: 'border-box',
              minWidth: 960,
              padding: '14px 44px 18px',
              borderRadius: RADIUS.lg,
              border: `3px solid ${alpha(C.rose, 0.85)}`,
              background: `linear-gradient(180deg, ${alpha(C.roseDeep, 0.9)}, ${alpha(C.ink950, 0.95)})`,
              boxShadow: `0 0 36px ${alpha(C.rose, 0.28)}`,
              textAlign: 'center',
              fontFamily: FONT.sans,
              whiteSpace: 'nowrap',
            }}
          >
            <div style={{ fontFamily: FONT.mono, fontSize: 32, fontWeight: 800, letterSpacing: 6, color: C.roseSoft }}>{S03.error}</div>
            <div style={{ marginTop: 6, fontSize: 56, fontWeight: 850, letterSpacing: -1, color: C.textStrong, opacity: lineIn, transform: `translateY(${(1 - lineIn) * 10}px)` }}>{S03.errorLine}</div>
          </div>
        </div>
      ) : null}

      {/* The rule */}
      {ruleIn > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: 18, width: W, textAlign: 'center', fontFamily: FONT.sans, opacity: ruleIn, transform: `translateY(${(1 - ruleIn) * 16}px)`, whiteSpace: 'nowrap' }}>
          <div style={{ fontSize: 68, fontWeight: 850, letterSpacing: -1.5, color: C.textStrong }}>
            <span style={{ color: TONE.tactical }}>{S03.rule[0]}</span>
            <span style={{ color: C.faint, margin: '0 22px' }}>·</span>
            <span style={{ color: TONE.strategic }}>{S03.rule[1]}</span>
          </div>
          <div style={{ marginTop: 14, fontSize: 46, fontWeight: 700, color: C.text, opacity: subIn }}>{S03.ruleSub}</div>
        </div>
      ) : null}

      {/* On screen for the whole scene */}
      <div style={{ position: 'absolute', left: 0, top: TAG_TOP, width: W, display: 'flex', justifyContent: 'center', opacity: deskIn }}>
        <HypotheticalTag />
      </div>
    </Stage>
  );
}

/** A sheet unfolding out of its badge: grows from the left edge. */
function Unfold({ at, frame, out, left, top, children }: { at: number; frame: number; out: number; left: number; top: number; children: ReactNode }) {
  const p = progress(frame, at, 16, EASE.out);
  if (p <= 0) return null;
  return (
    <div style={{ position: 'absolute', left, top, width: SHEET.w, height: SHEET.h, opacity: p * (1 - out), transform: `scaleX(${0.25 + 0.75 * p})`, transformOrigin: '0 50%' }}>{children}</div>
  );
}
