import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { dimStyle, focusWeights, mix } from '../../../engine/src/ui';
import { COLUMNS, HULL, NAMES, ROWS } from '../data/s02-contexto';
import { DataSeal, SEV_TONE, ScoreBadge } from './parts/Finding';
import { Hull } from './parts/Hull';
import { Stage, wordFrame } from './kit';

const S = 's02-contexto';
const W = STAGE.width;

// ---- Phase A–C: two expanded rows (cards 1680 × 232), columns laid out inside them.
const CARD_X = 24;
const CARD_W = 1680;
const CARD_H = 232;
const CARD_TOP = [18, 18 + CARD_H + 20] as const;
const COL = {
  host: { x: 28, w: 270 },
  cve: { x: 320, w: 520 },
  score: { x: 870, w: 400 },
  listens: { x: 1290, w: 360 },
} as const;
const ROWS_BOTTOM = CARD_TOP[1] + CARD_H;
const CAP_TOP = ROWS_BOTTOM + 18;

// ---- Phase D–F: two ships side by side, the words on top, the sea under them.
const SHIP_W = 800;
const SHIP_X = [30, W - 30 - SHIP_W] as const;
const SHIP_TOP = 104;

/**
 * s02-contexto «El mismo fallo, dos servidores». On `rows` the two expanded rows arrive (`srv-msg01`, `srv-msg02`:
 * the same CVE, the same 9.8 CRITICAL, the vector). The voice then points column by column and the rest steps back:
 * `cve` («el nombre del fallo»), `score` («nota base · de 0 a 10 · gravedad en abstracto»; its parts light on their
 * words) and `listens` — what the score does not know and each machine's file does: the cells fill on «primero» and
 * «segundo» («la red interna», «solo este equipo»). On `hull` the rows leave and the same hull, twice, arrives, the
 * same hole on both labelled «9.8» («la nota · el tamaño del agujero»); on «mar» a calm sea, then on «dique seco»
 * the second ship's water drains (the dock), and on «alta mar con temporal» the first one's storm rises. On `names`
 * the three terms of the exam: CVE, CVSS, riesgo («lo pone el contexto»). The last frame: both ships, quiet.
 */
export function S02Contexto(props: SceneProps) {
  const frame = useCurrentFrame();
  const rowsAt = props.cue('rows');
  const cveAt = props.cue('cve');
  const scoreAt = props.cue('score');
  const listensAt = props.cue('listens');
  const hullAt = props.cue('hull');
  const namesAt = props.cue('names');

  // ---- Rows (A): the two expanded rows, staggered; they leave on `hull`.
  const rowIn = [0, 1].map((i) => springIn(frame, 30, rowsAt + i * 10, { damping: 17 }));
  const rowsOut = progress(frame, hullAt - 14, 18, EASE.inOut);

  // ---- Column focus: cve → score → listens (the rest steps back); nothing in focus after the listens step.
  const { weights: fw, dims: fd } = focusWeights(frame, [cveAt, scoreAt, listensAt], { end: hullAt - 18, ramp: 12, lead: 6 });
  const colFocus = { cve: fw[0], score: fw[1], listens: fw[2] };
  const colDim = { host: Math.max(...fw) * 0.7, cve: fd[0], score: fd[1], listens: fd[2] };

  // ---- Score caption pieces, each lit on its word (canon order: gravedad · de 0 a 10 · nota base).
  const pieceAt = {
    base: wordFrame(S, 's02-02', 'base') - 6,
    ten: wordFrame(S, 's02-02', 'cero') - 6,
    abstract: wordFrame(S, 's02-02', 'abstracto') - 6,
  };
  const listensFill = [
    progress(frame, wordFrame(S, 's02-03', 'primero') - 4, 14),
    progress(frame, wordFrame(S, 's02-03', 'segundo') - 4, 14),
  ];

  // ---- Ships (D–F).
  const shipsIn = springIn(frame, 30, hullAt, { damping: 16 });
  const sizeAt = wordFrame(S, 's02-04', 'tamaño') - 8;
  const seaAt = wordFrame(S, 's02-04', 'mar') - 8;
  const dockAt = wordFrame(S, 's02-05', 'dique') - 8;
  const stormAt = wordFrame(S, 's02-05', 'alta') - 6;
  const seaAll = progress(frame, seaAt, 22);
  const dockR = progress(frame, dockAt, 26, EASE.inOut);
  const seaR = seaAll * (1 - progress(frame, dockAt - 4, 22, EASE.inOut));
  const stormL = progress(frame, stormAt, 34, EASE.inOut);
  const dockCapAt = wordFrame(S, 's02-05', 'seco') - 6;
  const openCapAt = wordFrame(S, 's02-05', 'temporal') - 6;

  // ---- The names (F): captions at the top give way to the three exam terms.
  const topOut = progress(frame, namesAt - 8, 16, EASE.inOut);
  const nameAt = {
    cve: namesAt - 2,
    cvss: Math.min(wordFrame(S, 's02-06', 'CVSS') - 6, namesAt + 40),
    risk: Math.min(wordFrame(S, 's02-06', 'riesgo') - 6, namesAt + 120),
  };

  return (
    <Stage>
      {/* ================= A–C: the two expanded rows ================= */}
      {rowsOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - rowsOut, transform: `translateY(${-24 * rowsOut}px)` }}>
          {/* column highlight bands */}
          {(['cve', 'score', 'listens'] as const).map((k) => (
            <div
              key={k}
              style={{
                position: 'absolute',
                left: CARD_X + COL[k].x - 18,
                top: CARD_TOP[0] - 8,
                width: COL[k].w + 36,
                height: ROWS_BOTTOM - CARD_TOP[0] + 16,
                borderRadius: RADIUS.lg,
                border: `3px solid ${alpha(C.cyan, 0.75 * colFocus[k])}`,
                background: alpha(C.cyan, 0.07 * colFocus[k]),
                boxShadow: colFocus[k] > 0.05 ? `0 0 ${Math.round(30 * colFocus[k])}px ${alpha(C.cyan, 0.25 * colFocus[k])}` : undefined,
              }}
            />
          ))}

          {ROWS.map((r, i) => {
            const t = SEV_TONE[r.sev];
            return (
              <div
                key={r.host}
                style={{
                  position: 'absolute',
                  left: CARD_X,
                  top: CARD_TOP[i],
                  width: CARD_W,
                  height: CARD_H,
                  boxSizing: 'border-box',
                  borderRadius: RADIUS.lg,
                  border: `2px solid ${alpha(t.fg, 0.8)}`,
                  background: `linear-gradient(90deg, ${alpha(t.deep, 0.7)} 0%, ${alpha(C.ink900, 0.97)} 62%)`,
                  boxShadow: `0 0 28px ${alpha(t.fg, 0.16)}`,
                  opacity: Math.min(1, rowIn[i] * 1.4),
                  transform: `translateY(${(1 - Math.min(1, rowIn[i])) * 30}px)`,
                  fontFamily: FONT.sans,
                }}
              >
                <div style={{ position: 'absolute', left: 0, top: 14, bottom: 14, width: 9, borderRadius: 5, background: t.fg }} />
                {/* host */}
                <div style={{ position: 'absolute', left: COL.host.x, top: 0, bottom: 0, width: COL.host.w, display: 'flex', alignItems: 'center', ...dimStyle(colDim.host) }}>
                  <span style={{ fontFamily: FONT.mono, fontSize: 44, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>{r.host}</span>
                </div>
                {/* CVE */}
                <div style={{ position: 'absolute', left: COL.cve.x, top: 0, bottom: 0, width: COL.cve.w, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6, ...dimStyle(colDim.cve) }}>
                  <span style={{ fontFamily: FONT.mono, fontSize: 40, fontWeight: 800, color: C.cyanSoft, whiteSpace: 'nowrap' }}>{r.cve}</span>
                  <span style={{ fontSize: 30, fontWeight: 600, lineHeight: 1.22, color: C.text }}>{r.what}</span>
                  <div style={{ marginTop: 4 }}>
                    <DataSeal size={24} />
                  </div>
                </div>
                {/* score */}
                <div style={{ position: 'absolute', left: COL.score.x, top: 0, bottom: 0, width: COL.score.w, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8, ...dimStyle(colDim.score) }}>
                  <span style={{ fontSize: 30, fontWeight: 650, color: C.muted }}>{r.version}</span>
                  <ScoreBadge score={r.score} sev={r.sev} size={72} lit={0.6 + 0.4 * colFocus.score} style={{ alignSelf: 'flex-start' }} />
                  <span style={{ fontFamily: FONT.mono, fontSize: 24, fontWeight: 600, lineHeight: 1.25, color: C.faint }}>
                    {r.vector.slice(0, 20)}
                    <br />
                    {r.vector.slice(20)}
                  </span>
                </div>
                {/* listens: the machine's own file — empty until the voice gets there */}
                <div style={{ position: 'absolute', left: COL.listens.x, top: 0, bottom: 0, width: COL.listens.w, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6, ...dimStyle(colDim.listens) }}>
                  {listensFill[i] < 0.02 ? (
                    <div style={{ height: 118, boxSizing: 'border-box', borderRadius: RADIUS.md, border: `2px dashed ${alpha(C.ink600, 0.9)}`, display: 'grid', placeItems: 'center', fontSize: 52, fontWeight: 800, color: C.ink500 }}>?</div>
                  ) : (
                    <div style={{ opacity: listensFill[i], transform: `translateY(${(1 - listensFill[i]) * 10}px)` }}>
                      <div style={{ fontSize: 32, fontWeight: 650, color: C.muted }}>{r.listens}</div>
                      <div style={{ fontSize: 40, fontWeight: 850, lineHeight: 1.1, color: i === 0 ? '#fda4af' : '#7dd3fc', whiteSpace: 'nowrap' }}>{r.where}</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* the same-ness: an equals sign between the rows, on the CVE and on the score */}
          {(['cve', 'score'] as const).map((k) => {
            const on = k === 'cve' ? Math.max(colFocus.cve, 0) : Math.max(colFocus.score, 0);
            return on > 0.05 ? (
              <div
                key={k}
                style={{
                  position: 'absolute',
                  left: CARD_X + COL[k].x + (k === 'cve' ? 450 : 330),
                  top: CARD_TOP[0] + CARD_H + 10 - 25,
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  display: 'grid',
                  placeItems: 'center',
                  background: C.ink900,
                  border: `3px solid ${C.cyan}`,
                  fontFamily: FONT.mono,
                  fontSize: 38,
                  fontWeight: 850,
                  color: C.cyanSoft,
                  opacity: on,
                  transform: `scale(${0.7 + 0.3 * on})`,
                }}
              >
                =
              </div>
            ) : null;
          })}

          {/* column captions: what the voice calls each column */}
          <Caption x={CARD_X + COL.cve.x} w={COL.cve.w} show={colFocus.cve} top={CAP_TOP}>
            <div>
              <span style={{ color: C.cyanSoft, fontWeight: 850 }}>{COLUMNS.cve.head}</span>
              <span style={{ color: C.faint }}> · </span>
              {COLUMNS.cve.note}
            </div>
          </Caption>
          <Caption x={CARD_X + COL.score.x} w={COL.score.w} show={colFocus.score} top={CAP_TOP} wide={700}>
            <div>
              <span style={{ color: C.cyanSoft, fontWeight: 850 }}>{COLUMNS.score.head}</span>
              <span style={{ color: C.faint }}> · </span>
              <Piece at={pieceAt.ten} frame={frame}>
                de 0 a 10
              </Piece>
              <span style={{ color: C.faint }}> · </span>
              <Piece at={pieceAt.base} frame={frame}>
                nota base
              </Piece>
            </div>
            <div>
              <Piece at={pieceAt.abstract} frame={frame}>
                gravedad en abstracto
              </Piece>
            </div>
          </Caption>
          <Caption x={CARD_X + COL.listens.x} w={COL.listens.w} show={colFocus.listens} top={CAP_TOP} wide={520}>
            <div style={{ color: '#fcd34d', fontWeight: 850 }}>{COLUMNS.listens.head}</div>
            <div>{COLUMNS.listens.note}</div>
          </Caption>
        </div>
      ) : null}

      {/* ================= D–F: the same hull, twice ================= */}
      {shipsIn > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0 }}>
          {/* top words: the score is the hole, the sea is the context */}
          <div style={{ position: 'absolute', left: 0, top: 0, width: W, textAlign: 'center', fontFamily: FONT.sans, opacity: 1 - topOut, transform: `translateY(${-14 * topOut}px)` }}>
            <div style={{ opacity: progress(frame, sizeAt, 14), fontSize: 46, fontWeight: 850, color: '#fda4af', lineHeight: 1.2 }}>
              {HULL.holeNote}
            </div>
            <div style={{ opacity: progress(frame, seaAt, 14), fontSize: 46, fontWeight: 850, color: '#7dd3fc', lineHeight: 1.2, marginTop: 4 }}>{HULL.seaNote}</div>
          </div>

          {[0, 1].map((i) => {
            const stormW = i === 0 ? stormL : 0;
            const seaW = i === 0 ? seaAll : seaR;
            const dockW = i === 0 ? 0 : dockR;
            const capAt = i === 0 ? openCapAt : dockCapAt;
            const capIn = progress(frame, capAt, 14);
            const row = ROWS[i];
            const nameIn = Math.min(1, shipsIn * 1.2);
            return (
              <div key={row.host} style={{ position: 'absolute', left: SHIP_X[i], top: SHIP_TOP, width: SHIP_W, opacity: nameIn, transform: `translateY(${(1 - Math.min(1, shipsIn)) * 30}px)` }}>
                <Hull width={SHIP_W} sea={seaW} storm={stormW} dock={dockW} holeLabel={HULL.holeLabel} hole={progress(frame, hullAt + 6 + i * 6, 18)} labelSize={44} />
                <div style={{ position: 'absolute', left: 0, top: 0, padding: '6px 18px', borderRadius: RADIUS.md, background: alpha(C.ink900, 0.94), border: `2px solid ${alpha(C.rose, 0.6)}`, fontFamily: FONT.mono, fontSize: 40, fontWeight: 800, color: C.textStrong }}>{row.host}</div>
                <div style={{ position: 'absolute', left: 0, top: SHIP_W * 0.52 + 14, width: SHIP_W, textAlign: 'center', fontFamily: FONT.sans, opacity: capIn, transform: `translateY(${(1 - capIn) * 12}px)` }}>
                  <div style={{ fontSize: 48, fontWeight: 850, color: i === 0 ? '#fda4af' : '#7dd3fc', lineHeight: 1.15 }}>{i === 0 ? HULL.open : HULL.dock}</div>
                  <div style={{ fontSize: 32, fontWeight: 650, color: C.muted, marginTop: 2 }}>
                    {row.listens} <span style={{ color: C.text, fontWeight: 750 }}>{row.where}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* F: the three terms of the exam */}
          {frame >= nameAt.cve - 2 ? (
            <div style={{ position: 'absolute', left: 0, top: 0, width: W, display: 'flex', justifyContent: 'center', gap: 22, fontFamily: FONT.sans }}>
              <Term term={NAMES.cve.term} says={NAMES.cve.says} at={nameAt.cve} frame={frame} tone={C.cyan} />
              <Term term={NAMES.cvss.term} says={NAMES.cvss.says} at={nameAt.cvss} frame={frame} tone={C.violet} />
              <Term term={NAMES.risk.term} says={NAMES.risk.says} at={nameAt.risk} frame={frame} tone={C.amber} />
            </div>
          ) : null}
        </div>
      ) : null}
    </Stage>
  );
}

/** A caption under a column, with a bracket over it; centred on the column and kept inside the stage. */
function Caption({ x, w, show, top, wide, children }: { x: number; w: number; show: number; top: number; wide?: number; children: ReactNode }) {
  if (show < 0.02) return null;
  const width = wide ?? w + 20;
  const left = Math.max(0, Math.min(W - width, x + w / 2 - width / 2));
  return (
    <div style={{ position: 'absolute', left, top, width, opacity: show, transform: `translateY(${(1 - show) * 10}px)`, fontFamily: FONT.sans }}>
      <div style={{ position: 'absolute', left: x - left - 18, top: 0, width: w + 36, height: 12, borderLeft: `4px solid ${alpha(C.cyan, 0.8)}`, borderRight: `4px solid ${alpha(C.cyan, 0.8)}`, borderBottom: `4px solid ${alpha(C.cyan, 0.8)}`, borderRadius: '0 0 10px 10px' }} />
      <div style={{ paddingTop: 22, textAlign: 'center', fontSize: 38, fontWeight: 700, lineHeight: 1.2, color: C.textStrong }}>{children}</div>
    </div>
  );
}

/** A piece of a caption that lights on its word. */
function Piece({ at, frame, children }: { at: number; frame: number; children: ReactNode }) {
  const p = progress(frame, at, 10);
  return <span style={{ opacity: 0.45 + 0.55 * p }}>{children}</span>;
}

/** One exam term: the word in its colour, what it says under it. */
function Term({ term, says, at, frame, tone }: { term: string; says: string; at: number; frame: number; tone: string }) {
  const e = enter(frame, at, { distance: 14, duration: 14 });
  const on = progress(frame, at, 10);
  return (
    <div
      style={{
        ...e,
        display: 'flex',
        alignItems: 'baseline',
        gap: 14,
        padding: '8px 24px 10px',
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(tone, mix(0.3, 0.9, on))}`,
        background: alpha(tone, 0.08),
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ fontSize: 46, fontWeight: 850, color: tone, letterSpacing: 1 }}>{term}</span>
      <span style={{ fontSize: 32, fontWeight: 650, color: C.text }}>{says}</span>
    </div>
  );
}
