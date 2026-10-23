import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Icon, dimStyle, focusWeights, mix, type IconName } from '../../../engine/src/ui';
import { S02 } from '../data/s02-lectores';
import { PageIcon, Silhouette, StormIcon } from './parts/Icons';
import { Stage, wordFrame } from './kit';

const S = 's02-lectores';
const W = STAGE.width;

// The dump: one long table, the pile starts at its left end and slides to the director at the right.
const DESK = { x: 110, w: 1508, y: 566 } as const;
const PILE = { w: 200, from: 270, to: 930 } as const;
const EXEC_X = 1290;

// The reader table: rows, their collapsed height, the gap, and how much each one grows when it is explained.
const ROW_GAP = 14;
const ROW_H = 134;
const ROW_H_STORM = 146;
const BODY_H = { soc: 122, ciso: 240, board: 222 } as const;
const COLS = { who: 0.17, product: 0.37, gets: 0.46 } as const;

/**
 * s02-lectores «Quién lo lee». The intercepted message owns the top of the stage, so the scene
 * opens low: a long table with a faceless director at its right end.
 *   dump       the pile «40 páginas técnicas» slides along the table to the director and stays;
 *              on «nadie» the stamp «sin acción» lands on it.
 *   questions  the pile steps out and the four question cards come in, one per question
 *              (¿quién lo lee?, ¿qué decisión tiene delante?, ¿cuánto tiempo tiene?, ¿en qué
 *              formato lo consume?); the formats (incidencia del SOC, informe, charla) hang under
 *              the last one as they are named.
 *   soc / ciso / board   the reader table: one row per reader, each one grows while it is
 *              explained (product, what it receives, where it comes from) and steps back after.
 *              CISO's row quotes the lesson's example, labelled as a CTI recommendation, not as
 *              Meridian's decision.
 *   storm      the rows fold up, the storm cloud lands on the left and feeds all three; under them,
 *              small, «el volcado de datos no lo recibe nadie».
 */
export function S02Lectores(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const dump = props.cue('dump');
  const questions = props.cue('questions');
  const soc = props.cue('soc');
  const ciso = props.cue('ciso');
  const board = props.cue('board');
  const storm = props.cue('storm');
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  // ---- The dump.
  const slide = progress(frame, dump - 2, 44, EASE.inOut);
  const pileX = mix(PILE.from, PILE.to, slide);
  const stampAt = w('s02-01', 'nadie') - 6;
  const stamp = frame < stampAt ? 0 : springIn(frame, fps, stampAt, { damping: 11 });
  // The pile stays (dimmed) until the first question card is in, so the stage is never empty.
  const dumpOut = progress(frame, w('s02-03', 'Quién') - 12, 16, EASE.inOut);
  const dumpDim = 0.7 * progress(frame, questions - 10, 22, EASE.inOut);

  // ---- The four questions.
  const qAt = S02.questions.map((q) => w(q.seg, q.word) - 8);
  const fmtAt = S02.formats.map((f) => w('s02-04', f.word) - 6);
  const qOut = progress(frame, soc - 26, 18, EASE.inOut);

  // ---- The reader table.
  const tableIn = progress(frame, soc - 16, 18);
  const { weights: ex, dims } = focusWeights(frame, [soc - 4, ciso - 4, board - 4], { end: storm - 6, ramp: 14, lead: 0 });
  const stormP = progress(frame, storm - 8, 28, EASE.inOut);
  const rowH = mix(ROW_H, ROW_H_STORM, stormP);
  const heights = [rowH + BODY_H.soc * ex[0], rowH + BODY_H.ciso * ex[1], rowH + BODY_H.board * ex[2]];
  const total = heights[0] + heights[1] + heights[2] + 2 * ROW_GAP;
  const top0 = mix(Math.max(8, Math.round((660 - total) / 2) - 10), 36, stormP);
  const tops = [top0, top0 + heights[0] + ROW_GAP, top0 + heights[0] + heights[1] + 2 * ROW_GAP];
  const rowX = mix(0, 300, stormP);
  const rowW = W - rowX;

  // What each row says, each on its own words.
  const socGets = w('s02-05', 'acciones') - 6;
  const socBody = w('s02-05', 'página') - 8;
  const socProduct = w('s02-05', 'flash') - 6;
  const cisoGets = w('s02-06', 'riesgo') - 6;
  const cisoProduct = w('s02-07', 'ejemplo') - 8;
  const cisoQuote2 = w('s02-07', 'adelantar') - 8;
  const boardGets = w('s02-08', 'juicios') - 6;
  const boardPages = w('s02-08', 'pocas') - 6;
  const boardProduct = w('s02-09', 'assessment') - 10;
  const boardAlso = w('s02-09', 'también') - 6;
  const boardOwn = w('s02-09', 'cuenta') - 8;

  // ---- The storm.
  const cloudIn = progress(frame, storm + 10, 20);
  const nobodyIn = progress(frame, w('s02-10', 'usar') - 14, 16);
  const midY = top0 + total / 2;

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      {/* The dump: a pile nobody moves */}
      {dumpOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: (1 - dumpOut) * (1 - dumpDim), transform: `translateY(${dumpOut * 30}px)` }}>
          {/* the long table */}
          <div style={{ position: 'absolute', left: DESK.x, top: DESK.y, width: DESK.w, height: 14, borderRadius: 7, background: `linear-gradient(180deg, ${C.ink600} 0%, ${C.ink700} 100%)`, boxShadow: `0 20px 40px ${alpha('#000000', 0.4)}` }} />
          {[DESK.x + 40, DESK.x + DESK.w - 60].map((x) => (
            <div key={x} style={{ position: 'absolute', left: x, top: DESK.y + 14, width: 12, height: 80, background: C.ink700, borderRadius: 4 }} />
          ))}
          {/* the director, no face */}
          <div style={{ position: 'absolute', left: EXEC_X - 125, top: DESK.y - 252 }}>
            <Silhouette kind="exec" size={210} tone={C.cyan} glow={0.25} />
          </div>
          {/* the pile and its label */}
          <Pile x={pileX} />
          {stamp > 0 ? (
            <div style={{ position: 'absolute', left: PILE.to - 195, top: DESK.y - 250, transform: `rotate(-9deg) scale(${0.6 + 0.4 * Math.min(1, stamp)})`, opacity: Math.min(1, stamp * 1.5) }}>
              <div style={{ padding: '6px 30px 10px', border: `6px solid ${C.rose}`, borderRadius: 14, background: alpha(C.ink950, 0.82), color: C.rose, fontSize: 64, fontWeight: 900, letterSpacing: 2, whiteSpace: 'nowrap', textTransform: 'uppercase', boxShadow: `0 0 30px ${alpha(C.rose, 0.35)}` }}>{S02.dump.stamp}</div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* The four questions */}
      {frame >= qAt[0] - 4 && qOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - qOut, transform: `translateY(${-qOut * 24}px)` }}>
          {S02.questions.map((q, i) => {
            const e = enter(frame, qAt[i], { distance: 26, duration: 18 });
            const on = progress(frame, qAt[i], 10) * (1 - 0.45 * progress(frame, (qAt[i + 1] ?? Number.MAX_SAFE_INTEGER) - 2, 14, EASE.inOut));
            const col = i % 2;
            const row = Math.floor(i / 2);
            return (
              <div key={q.text} style={{ position: 'absolute', left: col * (836 + 56), top: 110 + row * (170 + 26), width: 836, height: 170, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 24, padding: '0 34px', borderRadius: RADIUS.lg, border: `3px solid ${alpha(C.cyan, 0.35 + 0.5 * on)}`, background: `linear-gradient(180deg, ${alpha(C.cyan, 0.05 + 0.1 * on)} 0%, ${alpha(C.ink900, 0.96)} 80%)`, boxShadow: on > 0.05 ? `0 0 ${Math.round(34 * on)}px ${alpha(C.cyan, 0.25 * on)}` : undefined, ...e, opacity: e.opacity * (0.7 + 0.3 * on) }}>
                <div style={{ width: 88, height: 88, borderRadius: 44, display: 'grid', placeItems: 'center', flexShrink: 0, background: alpha(C.cyan, 0.12), border: `3px solid ${alpha(C.cyan, 0.7)}` }}>
                  <Icon name={q.icon as IconName} size={50} color={C.cyan} strokeWidth={2} />
                </div>
                <div style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.15, color: C.textStrong }}>{q.text}</div>
              </div>
            );
          })}
          <div style={{ position: 'absolute', left: 892, top: 110 + 196 + 170 + 30, width: 836, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            {S02.formats.map((f, i) => {
              const e = enter(frame, fmtAt[i], { distance: 14 });
              return (
                <div key={f.text} style={{ display: 'inline-flex', alignItems: 'center', gap: 12, height: 62, boxSizing: 'border-box', padding: '0 24px 0 18px', borderRadius: RADIUS.pill, border: `2px solid ${alpha(C.cyan, 0.7)}`, background: alpha(C.cyan, 0.12), fontSize: 32, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap', ...e }}>
                  <Icon name={f.icon as IconName} size={34} color={C.cyan} />
                  {f.text}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* The reader table */}
      {tableIn > 0 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: tableIn }}>
          <Row top={tops[0]} h={heights[0]} headH={rowH} x={rowX} w={rowW} dim={dims[0]} focus={ex[0]} kind="soc" name={S02.soc.name}
            product={S02.soc.product} productAt={socProduct} frame={frame}
            gets={<GetsChip text={S02.soc.gets} at={socGets} frame={frame} />}
            bodyNode={
              <>
                <Line frame={frame} at={socBody} size={38} color={C.text}>{S02.soc.detail}</Line>
                <Line frame={frame} at={socBody + 14} size={34} color={C.cyanSoft} label="sale de">{S02.soc.from}</Line>
              </>
            } />
          <Row top={tops[1]} h={heights[1]} headH={rowH} x={rowX} w={rowW} dim={dims[1]} focus={ex[1]} kind="ciso" name={S02.ciso.name}
            product={S02.ciso.product} productAt={cisoProduct} frame={frame}
            gets={<GetsChip text={S02.ciso.gets} at={cisoGets} frame={frame} />}
            bodyNode={
              <>
                <Line frame={frame} at={cisoProduct + 10} size={31} color={C.amber} icon="flag">{S02.ciso.tag}</Line>
                <div style={{ marginTop: 6, fontSize: 38, fontWeight: 650, lineHeight: 1.24, color: C.textStrong, fontStyle: 'italic' }}>
                  <span style={{ opacity: progress(frame, cisoProduct + 24, 14) }}>«{S02.ciso.quote[0]}</span>{' '}
                  <span style={{ opacity: progress(frame, cisoQuote2, 14) }}>{S02.ciso.quote[1]}»</span>
                </div>
              </>
            } />
          <Row top={tops[2]} h={heights[2]} headH={rowH} x={rowX} w={rowW} dim={dims[2]} focus={ex[2]} kind="board" name={S02.board.name}
            product={S02.board.product} productAt={boardProduct} frame={frame}
            gets={<GetsChip text={S02.board.gets} sub={S02.board.getsSub} subAt={boardOwn} subHide={stormP} at={boardGets} frame={frame} />}
            bodyNode={
              <>
                <Line frame={frame} at={boardPages} size={38} color={C.text}>2–5 págs, juicios + implicaciones</Line>
                <Line frame={frame} at={boardAlso} size={34} color={C.cyanSoft} label="lo lee">CISO, dirección, board</Line>
                <Line frame={frame} at={boardOwn - 20} size={34} color={C.cyanSoft} label="habilita">{S02.board.enables}</Line>
                <Line frame={frame} at={boardOwn} size={34} color={C.cyanSoft} label="sale de">{S02.board.from}</Line>
              </>
            } />
        </div>
      ) : null}

      {/* The storm that feeds the three rows */}
      {cloudIn > 0 ? (
        <>
          <svg width={W} height={660} viewBox={`0 0 ${W} 660`} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
            {tops.map((t, i) => {
              const my = t + heights[i] / 2;
              const x0 = 232;
              const x1 = rowX - 6;
              return <path key={i} d={`M${x0} ${midY} C${x0 + 36} ${midY} ${x1 - 36} ${my} ${x1} ${my}`} fill="none" stroke={alpha(C.amber, 0.7)} strokeWidth={4} strokeLinecap="round" strokeDasharray="500" strokeDashoffset={500 * (1 - progress(frame, storm + 8 + i * 6, 22, EASE.inOut))} />;
            })}
          </svg>
          <div style={{ position: 'absolute', left: 20, top: midY - 80, opacity: cloudIn, transform: `translateX(${(1 - cloudIn) * -30}px)` }}>
            <StormIcon size={210} glow={0.6} rain={frame - storm} />
          </div>
          <div style={{ position: 'absolute', left: rowX, top: 598, width: rowW, textAlign: 'center', fontSize: 32, fontWeight: 650, color: C.muted, whiteSpace: 'nowrap', opacity: nobodyIn }}>{S02.nobody}</div>
        </>
      ) : null}
    </Stage>
  );
}

/** The pile of pages on the table (label above, tracks the pile). */
function Pile({ x }: { x: number }) {
  const h = Math.round(PILE.w * 1.3);
  return (
    <div style={{ position: 'absolute', left: x - PILE.w / 2 - 14, top: DESK.y - h - 6, width: PILE.w + 40 }}>
      <PageIcon w={PILE.w} lines={7} tone={C.amber} stack={5} style={{ marginLeft: 0, marginTop: 14 }} />
      <div style={{ position: 'absolute', left: -170, top: -62, width: PILE.w + 380, textAlign: 'center', fontSize: 40, fontWeight: 800, color: C.amber, whiteSpace: 'nowrap', textShadow: `0 0 14px ${alpha(C.ink950, 1)}` }}>{S02.dump.label}</div>
    </div>
  );
}

/** One line of a row's body: fades in at `at`, optional small label before the text. */
function Line({ frame, at, size, color, label, icon, children }: { frame: number; at: number; size: number; color: string; label?: string; icon?: IconName; children: ReactNode }) {
  const e = enter(frame, at, { distance: 10, duration: 14 });
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, fontSize: size, fontWeight: 650, lineHeight: 1.22, color, marginTop: 4, ...e }}>
      {icon ? <Icon name={icon} size={size} color={color} style={{ alignSelf: 'center' }} /> : null}
      {label ? <span style={{ fontSize: 26, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', color: C.faint, minWidth: 120 }}>{label}</span> : null}
      <span>{children}</span>
    </div>
  );
}

/** «Lo que recibe»: the chip on the right of a row, and an optional small line under it. */
function GetsChip({ text, sub, subAt, subHide = 0, at, frame }: { text: string; sub?: string; subAt?: number; subHide?: number; at: number; frame: number }) {
  const e = enter(frame, at, { distance: 14, duration: 14 });
  const s = subAt === undefined ? 0 : progress(frame, subAt, 14);
  return (
    <div style={{ ...e }}>
      <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 2, color: C.faint, textTransform: 'uppercase', marginBottom: 4 }}>recibe</div>
      <div style={{ display: 'inline-block', padding: '4px 20px 6px', borderRadius: RADIUS.md, border: `2px solid ${alpha(C.cyan, 0.75)}`, background: alpha(C.cyan, 0.14), fontSize: 34, fontWeight: 800, lineHeight: 1.15, color: C.cyanSoft }}>{text}</div>
      {sub ? <div style={{ marginTop: 6, fontSize: 28, fontWeight: 600, color: C.muted, opacity: s * (1 - subHide), height: subHide > 0.95 ? 0 : undefined }}>{sub}</div> : null}
    </div>
  );
}

/** One reader row: who (faceless), the product, what it receives; the body unfolds while the voice explains it. */
function Row({
  top,
  h,
  headH,
  x,
  w,
  dim,
  focus,
  kind,
  name,
  product,
  productAt,
  frame,
  gets,
  bodyNode,
}: {
  top: number;
  h: number;
  headH: number;
  x: number;
  w: number;
  dim: number;
  focus: number;
  kind: 'soc' | 'ciso' | 'board';
  name: string;
  product: string;
  productAt: number;
  frame: number;
  gets: ReactNode;
  bodyNode: ReactNode;
}) {
  const prod = enter(frame, productAt, { distance: 12, duration: 14 });
  return (
    <div style={{ position: 'absolute', left: x, top, width: w, height: h, boxSizing: 'border-box', borderRadius: RADIUS.lg, border: `3px solid ${alpha(C.cyan, 0.3 + 0.55 * focus)}`, background: `linear-gradient(180deg, ${alpha(C.cyan, 0.04 + 0.1 * focus)} 0%, ${alpha(C.ink900, 0.97)} 75%)`, boxShadow: focus > 0.05 ? `0 0 ${Math.round(34 * focus)}px ${alpha(C.cyan, 0.22 * focus)}` : undefined, overflow: 'hidden', ...dimStyle(dim) }}>
      <div style={{ display: 'flex', alignItems: 'center', height: headH, boxSizing: 'border-box', padding: '0 30px' }}>
        <div style={{ width: `${COLS.who * 100}%`, display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          <Silhouette kind={kind} size={64} glow={0.5 * focus} />
          <span style={{ fontSize: 46, fontWeight: 850, color: C.textStrong, lineHeight: 1.05 }}>{name}</span>
        </div>
        <div style={{ width: `${COLS.product * 100}%`, fontSize: 44, fontWeight: 800, color: C.cyanSoft, lineHeight: 1.12, paddingRight: 24, ...prod }}>{product}</div>
        <div style={{ width: `${COLS.gets * 100}%` }}>{gets}</div>
      </div>
      <div style={{ padding: '0 30px 0 30px', opacity: Math.max(0, focus * 1.4 - 0.4) }}>{bodyNode}</div>
    </div>
  );
}
