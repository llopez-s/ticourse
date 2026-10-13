import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, Panel, windowWeight } from '../../../engine/src/ui';
import { FLOW, LANES, NAME, QUESTION } from '../data/s03-casilla';
import { PAYLOAD } from '../data/query';
import { NOTES, ROWS } from '../data/s02-sqli';
import { TermName } from './parts/bits';
import { LoginScreen } from './parts/Login';
import { PortForm } from './parts/PortForm';
import { QUERY_REST, QueryBlock, RowsTable } from './parts/QueryBlock';
import { Stage, cardWindow, wordFrame } from './kit';

const S = 's03-casilla';
const LOGIN_Y = 40;
const PANEL = { x: 600, y: 20, w: 1128, h: 600 } as const;

/**
 * s03-casilla «Cada dato en su casilla». `fix` asks «¿Cómo se arregla?» over the broken query, which waits dimmed
 * under RED MARROW's message (the card owns the top of the stage until the narrator answers). The advice is drawn as
 * the application sending the tricked query to a database whose DISK is encrypted (`db-encrypt`: the lock, «disco»,
 * «cifrado en reposo»), and the query still goes through, launched by the application itself (`not-this`). What fixes it
 * is separating the order from the datum: the query with marks (`marks`), the text apart, as data (`data`); the same
 * entry is typed again (`replay`), the name box takes it as it is and nobody has that name (`blocked`: «usuario o
 * contraseña incorrectos», 0 rows). The image (`form-box`): the form printed in advance with a box per datum; the
 * name PARAMETERIZED QUERIES lands with `names` and the lesson's two complements, small and grey.
 */
export function S03Casilla(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (id: string) => props.cue(id);
  const fixAt = at('fix');
  const encAt = at('db-encrypt');
  const notAt = at('not-this');
  const marksAt = at('marks');
  const dataAt = at('data');
  const replayAt = at('replay');
  const blockedAt = at('blocked');
  const formAt = at('form-box');
  const namesAt = at('names');
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const msg = cardWindow(S, 'intercept') ?? [fixAt + 100, fixAt + 360];

  // ---- the question and the broken query, until the advice is drawn
  const qIn = progress(frame, fixAt - 4, 14);
  const qOut = progress(frame, msg[0] - 16, 12, EASE.inOut);
  const ctxIn = progress(frame, 4, 16);
  const ctxOut = progress(frame, encAt - 14, 14, EASE.inOut);
  const ctxState = { ...QUERY_REST, typed: PAYLOAD.length, emptyPass: 1, quote: 1, always: 1, comment: 1 };

  // ---- phase A: the diagram of the advice
  const flowIn = progress(frame, encAt - 14, 16);
  const flowOut = progress(frame, marksAt - 14, 14, EASE.inOut);
  const lockW = progress(frame, encAt - 2, 12);
  const diskW = progress(frame, w('s03-03', 'disco') - 6, 12);
  const sendW = progress(frame, notAt - 6, 40, EASE.inOut);
  const launchedW = progress(frame, w('s03-03', 'propia') - 6, 14);
  const decryptedW = progress(frame, w('s03-03', 'descifrados') - 8, 14);

  // ---- phase B: the corrected query, the text apart, the same entry again
  const bIn = progress(frame, marksAt - 6, 16);
  const bOut = progress(frame, formAt - 14, 14, EASE.inOut);
  const marksW = progress(frame, marksAt, 12) * 0.5 + progress(frame, w('s03-04', 'marcadas') - 8, 12) * 0.5;
  const dataW = progress(frame, dataAt - 6, 16);
  const replayN = Math.max(0, Math.min(PAYLOAD.length, Math.floor((frame - (replayAt + 4)) / 3.2)));
  const compara = progress(frame, w('s03-05', 'compara') - 6, 16, EASE.inOut);
  const blocked = progress(frame, blockedAt - 2, 10);
  const loginIn = progress(frame, marksAt - 8, 16);

  // ---- phase C: the form printed in advance, the name
  const cIn = progress(frame, formAt - 4, 16);
  const boxes = progress(frame, w('s03-06', 'casilla') - 8, 14);
  const nameW = progress(frame, namesAt - 4, 16);
  const extrasW = progress(frame, namesAt + 26, 16);

  return (
    <Stage>
      {/* ---------------- the question, over the broken query ---------------- */}
      {qOut < 1 ? (
        <div style={{ position: 'absolute', left: 0, top: 6, width: 1728, textAlign: 'center', fontFamily: FONT.sans, fontSize: 84, fontWeight: 850, letterSpacing: -1.5, color: C.textStrong, opacity: qIn * (1 - qOut), transform: `translateY(${(1 - qIn) * 14 - 12 * qOut}px)` }}>
          {QUESTION}
        </div>
      ) : null}
      {ctxOut < 1 ? (
        <div style={{ position: 'absolute', left: 420, top: 290, width: 888, opacity: ctxIn * (1 - ctxOut) * 0.55, filter: 'saturate(0.6)' }}>
          <Panel title={NOTES.panel} icon="database" accent="rose" style={{ width: 888, height: 64 + 214 + 4 }}>
            <div style={{ position: 'absolute', left: 30, top: 18 }}>
              <QueryBlock state={ctxState} size={38} />
            </div>
          </Panel>
        </div>
      ) : null}

      {/* ---------------- phase A: «cifrar la base de datos» ---------------- */}
      {flowIn > 0.001 && flowOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: flowIn * (1 - flowOut) }}>
          <FlowDiagram lock={lockW} disk={diskW} send={sendW} launched={launchedW} decrypted={decryptedW} />
        </div>
      ) : null}

      {/* ---------------- phase B: marks, data apart, the same entry ---------------- */}
      {bIn > 0.001 && bOut < 1 ? (
        <>
          <div style={{ position: 'absolute', left: 0, top: LOGIN_Y, opacity: loginIn * (1 - bOut) }}>
            <LoginScreen user={PAYLOAD.slice(0, replayN)} dots={0} caret={replayN > 0 && blocked < 0.5 ? 'user' : null} error={blocked} glowUser={replayN > 0 ? 0.7 : 0} glow={0.6 * windowWeight(frame, blockedAt, blockedAt + 40, { ramp: 8 })} frame={frame} fps={fps} />
          </div>
          <div style={{ position: 'absolute', left: PANEL.x, top: PANEL.y, width: PANEL.w, height: PANEL.h, opacity: bIn * (1 - bOut), transform: `translateX(${(1 - bIn) * 30}px)` }}>
            <Panel title={NOTES.panel} icon="database" accent="emerald" style={{ width: PANEL.w, height: PANEL.h }}>
              <div style={{ position: 'absolute', left: 34, top: 22 }}>
                <QueryBlock state={{ ...QUERY_REST, params: 1, marks: marksW, boxFill: compara }} size={40} />
              </div>
              {/* the text, apart */}
              <div style={{ position: 'absolute', left: 560, top: 24, opacity: dataW * (1 - 0.0 * compara) }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, fontFamily: FONT.sans, fontWeight: 850, color: C.cyan, fontSize: 46 }}>
                  {LANES.data}
                  <span style={{ fontSize: 34, fontWeight: 700, color: C.muted }}>· {LANES.apart}</span>
                </div>
                <div
                  style={{
                    marginTop: 14,
                    display: 'inline-block',
                    padding: '10px 20px',
                    borderRadius: 14,
                    background: alpha(C.cyan, 0.12 + 0.12 * compara),
                    border: `3px solid ${alpha(C.cyan, 0.7)}`,
                    boxShadow: `0 0 ${Math.round(26 * windowWeight(frame, replayAt, w('s03-05', 'compara')))}px ${alpha(C.cyan, 0.4)}`,
                    fontFamily: FONT.mono,
                    fontSize: 36,
                    fontWeight: 700,
                    color: C.cyan,
                    whiteSpace: 'pre',
                    opacity: 1 - compara,
                    transform: `translateX(${-compara * 300}px)`,
                  }}
                >
                  {PAYLOAD}
                </div>
              </div>
              {/* the rows: nobody has that name */}
              <div style={{ position: 'absolute', left: 34, top: 262 }}>
                <RowsTable rows={ROWS} show={progress(frame, blockedAt - 24, 14)} lit={0} width={520} />
              </div>
              <div style={{ position: 'absolute', left: 34 + 520 + 40, top: 296, opacity: blocked, transform: `translateY(${(1 - blocked) * 12}px)`, fontFamily: FONT.sans, fontSize: 66, fontWeight: 850, letterSpacing: -1, color: C.roseSoft, whiteSpace: 'nowrap' }}>
                <Icon name="x" size={58} color={C.rose} strokeWidth={2.8} style={{ display: 'inline-block', verticalAlign: '-8px', marginRight: 14 }} />
                {LANES.empty}
              </div>
            </Panel>
          </div>
        </>
      ) : null}

      {/* ---------------- phase C: the form printed in advance, the name ---------------- */}
      {cIn > 0.001 ? (
        <>
          <div style={{ position: 'absolute', left: 0, top: 130, opacity: cIn, transform: `translateY(${(1 - cIn) * 20}px)` }}>
            <PortForm box={boxes} slip={1} ok={progress(frame, w('s03-06', 'dato') - 4, 14)} glow={0.7 * windowWeight(frame, w('s03-06', 'casilla') - 6, namesAt, { ramp: 10 })} />
          </div>
          <div style={{ position: 'absolute', left: 1000, top: 140 }}>
            <TermName text={NAME.title} show={nameW} size={74} />
            <div style={{ marginTop: 34, fontFamily: FONT.sans, fontSize: 32, fontWeight: 600, color: C.muted, lineHeight: 1.45, opacity: extrasW * 0.9, transform: `translateY(${(1 - extrasW) * 10}px)` }}>
              {NAME.extras.map((e) => (
                <div key={e}>{e}</div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </Stage>
  );
}

/** The advice's picture: the application sends the tricked query to a database whose disk is encrypted. */
function FlowDiagram({ lock, disk, send, launched, decrypted }: { lock: number; disk: number; send: number; launched: number; decrypted: number }) {
  const CARD = { w: 420, h: 330, y: 70 };
  const appX = 40;
  const dbX = 1728 - 40 - CARD.w;
  const node = (x: number, icon: 'app' | 'database', label: string, tone: string, extra?: ReactNode) => (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: CARD.y,
        width: CARD.w,
        height: CARD.h,
        boxSizing: 'border-box',
        borderRadius: 24,
        background: `linear-gradient(180deg, ${C.ink850}, ${C.ink900})`,
        border: `3px solid ${alpha(tone, 0.6)}`,
        boxShadow: `0 24px 50px ${alpha('#000000', 0.4)}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
      }}
    >
      <Icon name={icon} size={132} color={tone} strokeWidth={1.4} />
      <div style={{ fontFamily: FONT.sans, fontSize: 40, fontWeight: 800, color: C.textStrong }}>{label}</div>
      {extra}
    </div>
  );
  const midL = appX + CARD.w + 30;
  const midR = dbX - 30;
  const chipX = midL + (midR - midL - 380) * send;
  return (
    <>
      {node(appX, 'app', FLOW.app, C.sky)}
      {node(
        dbX,
        'database',
        FLOW.db,
        C.cyan,
        <div style={{ position: 'absolute', right: -22, top: -22, width: 84, height: 84, borderRadius: 42, display: 'grid', placeItems: 'center', background: C.ink900, border: `4px solid ${C.emerald}`, opacity: lock, transform: `scale(${0.6 + 0.4 * lock})` }}>
          <Icon name="lock" size={46} color={C.emerald} strokeWidth={2.4} />
        </div>,
      )}
      {/* the road and the tricked query on it */}
      <div style={{ position: 'absolute', left: midL, top: CARD.y + CARD.h / 2 - 2, width: midR - midL, height: 4, background: `repeating-linear-gradient(90deg, ${alpha(C.rose, 0.5)} 0 14px, transparent 14px 26px)`, opacity: send }} />
      <div
        style={{
          position: 'absolute',
          left: chipX,
          top: CARD.y + CARD.h / 2 - 40,
          height: 80,
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          borderRadius: 40,
          background: alpha(C.rose, 0.2),
          border: `3px solid ${C.rose}`,
          fontFamily: FONT.sans,
          fontSize: 36,
          fontWeight: 800,
          color: C.textStrong,
          whiteSpace: 'nowrap',
          opacity: Math.min(1, send * 4),
        }}
      >
        {FLOW.chip}
      </div>
      {/* labels */}
      <div style={{ position: 'absolute', left: dbX, top: CARD.y + CARD.h + 28, width: CARD.w, textAlign: 'center', fontFamily: FONT.sans, opacity: disk, transform: `translateY(${(1 - disk) * 10}px)` }}>
        <div style={{ fontSize: 64, fontWeight: 850, color: C.emerald, letterSpacing: -1 }}>{FLOW.disk}</div>
        <div style={{ fontSize: 36, fontWeight: 700, color: C.text }}>{FLOW.diskSub}</div>
      </div>
      <div style={{ position: 'absolute', left: appX, top: CARD.y + CARD.h + 28, width: CARD.w, textAlign: 'center', fontFamily: FONT.sans, fontSize: 40, fontWeight: 800, color: C.roseSoft, lineHeight: 1.18, opacity: launched, transform: `translateY(${(1 - launched) * 10}px)` }}>
        {FLOW.launched[0]}
        <br />
        {FLOW.launched[1]}
      </div>
      <div style={{ position: 'absolute', left: midL, top: CARD.y + CARD.h / 2 + 70, width: midR - midL, textAlign: 'center', fontFamily: FONT.sans, fontSize: 36, fontWeight: 700, color: C.muted, opacity: decrypted }}>
        {FLOW.decrypted}
      </div>
    </>
  );
}

