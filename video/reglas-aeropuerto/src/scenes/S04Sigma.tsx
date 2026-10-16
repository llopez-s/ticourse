import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { clamp01, dimStyle, mix, windowWeight } from '../../../engine/src/ui';
import { SIGMA_LINE, SIGMA_RULE } from '../data/rules';
import { EVENTS, RULE_A, RULE_A_LABEL, RULE_A_TOKEN, S04_TEXT } from '../data/s04-sigma';
import { Stage, segment, wordFrame } from './kit';
import { BoardingCard, CARD_ASPECT, GATE_ASPECT, Gate, PASSPORT_ASPECT, Passport } from './parts/Airport';
import { RuleCode, ruleCodeGeometry, type RuleHighlight } from './parts/RuleCode';
import { Callout, EVENT_CARD, EventCard, MatchLink, eventCardGeometry, type RowMark } from './parts/s04-sigma/EventCard';

const SCENE = 's04-sigma';
const W = 1728;
const H = 660;
const L = SIGMA_LINE;

// --- The lesson's rule (B): full while it is read, then a compact window onto the detection block.
const G = ruleCodeGeometry(SIGMA_RULE, { title: 'Sigma' });
const COMPACT_FROM = L.originalFileName;
const COMPACT_TO = L.condition;
const COMPACT_VIEW = G.tops[COMPACT_TO] + G.heights[COMPACT_TO] - G.tops[COMPACT_FROM];
const COMPACT_H = G.codeTop + COMPACT_VIEW + 16;
const COL_W = 820;

// --- Rule A («ejemplo»): one line.
const GA = ruleCodeGeometry(RULE_A, { title: 'Sigma', label: RULE_A_LABEL });

// --- Events
const EG = eventCardGeometry();
const EV_X = W - EVENT_CARD.width;
const PAIR_GAP = 12;
const PAIR_Y = Math.round((H - (2 * EG.height + PAIR_GAP)) / 2);

// --- Layout boxes (stage-local). The top-centre band (y < 230, x 400–1330) belongs to the intercept card
// until s04-01 ends and to the think prompt during its hold: everything stays at y ≥ 236 then.
type Box = { x: number; y: number; s: number };
const mixBox = (a: Box, b: Box, t: number): Box => ({ x: mix(a.x, b.x, t), y: mix(a.y, b.y, t), s: mix(a.s, b.s, t) });
const INTRO_S = 0.6;
const BOX = {
  intro: { x: 40, y: H - G.height * INTRO_S - 4, s: INTRO_S },
  read: { x: 60, y: Math.round((H - G.height) / 2), s: 1 },
  mid: { x: 0, y: Math.round((H - COMPACT_H) / 2), s: 1 },
  low: { x: 0, y: H - Math.ceil(COMPACT_H) - 2, s: 1 },
};
const A_Y = 236;
const E3_Y = Math.round(A_Y + (H - 2 - A_Y - EG.height) / 2);

// The airport gate (s02) with the lens: what Sigma reads.
const GATE_W = 560;
const GATE = {
  big: { x: (W - GATE_W) / 2, y: 290, s: 1 },
  corner: { x: W - 360, y: H - 360 * GATE_ASPECT - 6, s: 360 / GATE_W },
};

/** Stepped focus with a short dip at each switch, so the lit set never snaps. */
function steppedFocus(frame: number, steps: { at: number; lines: number[] | null }[], ramp = 10) {
  let idx = -1;
  let dip = 0;
  steps.forEach((s, k) => {
    const sw = s.at - ramp / 2;
    if (frame >= sw) idx = k;
    if (k > 0) dip = Math.max(dip, 1 - Math.abs(frame - sw) / (ramp / 2));
  });
  const lines = idx >= 0 ? steps[idx].lines : null;
  return { lines, amount: lines ? 1 - clamp01(dip) : 0 };
}

/**
 * s04-sigma «Sigma, línea a línea».
 *   (intercept)  the gate with its logbook and the lens, low in the stage
 *   sigma        the lesson's Sigma rule enters small and low (band still busy); at the end of s04-01 it
 *                grows into reading position
 *   logsource … cond  one part at a time: focus + highlight + a callout (passport / boarding card icons);
 *                `falsepositives` stays on screen, never lit
 *   ev-legit     the rule shrinks to its detection block (left); two sample events (right); event 1
 *                «no avisa», the filter covers it
 *   ev-renamed   event 2's card turns rose; the passport matches; «avisa»
 *   rule-a       rule A («ejemplo», only the card) above the lesson's rule; «ese nombre» lit on both
 *   rule-b       the lesson's rule lit
 *   ev-new       events 1–2 leave; event 3 (a new card) enters, no verdict; both rules equal through the
 *                think hold
 *   answer       the lesson's rule rings emerald; miss: A does not see it; hit: the passport matches,
 *                «avisa»; «filtro» (s04-10): the filter does not match; «esta»: B lit, A dimmed
 */
export function S04Sigma(props: SceneProps) {
  const frame = useCurrentFrame();
  const s0401 = segment(props, 's04-01');
  const sigmaAt = props.cue('sigma');
  const logsourceAt = props.cue('logsource');
  const selectionAt = props.cue('selection');
  const flagsAt = props.cue('flags');
  const filterAt = props.cue('filter');
  const condAt = props.cue('cond');
  const evLegit = props.cue('ev-legit');
  const evRenamed = props.cue('ev-renamed');
  const ruleA = props.cue('rule-a');
  const ruleB = props.cue('rule-b');
  const evNew = props.cue('ev-new');
  const answerAt = props.cue('answer');
  const missAt = props.cue('miss');
  const hitAt = props.cue('hit');
  const replyAt = props.cue('reply-m2');
  const tarjeta05 = wordFrame(SCENE, 's04-05', 'tarjeta');
  const avisaria = wordFrame(SCENE, 's04-05', 'avisaría');
  const ese = wordFrame(SCENE, 's04-06', 'ese');
  const tarjeta07 = wordFrame(SCENE, 's04-07', 'tarjeta');
  const tarjeta08 = wordFrame(SCENE, 's04-08', 'tarjeta');
  const filtro10 = wordFrame(SCENE, 's04-10', 'filtro');
  const esta10 = wordFrame(SCENE, 's04-10', 'esta');
  const readEnd = evLegit - 12;

  // ---- Lesson rule (B): placement
  const grow = progress(frame, s0401.to - 2, 22, EASE.inOut);
  const compact = progress(frame, readEnd, 24, EASE.inOut);
  const lower = progress(frame, ruleA - 8, 22, EASE.inOut);
  const bBox = mixBox(mixBox(mixBox(BOX.intro, BOX.read, grow), BOX.mid, compact), BOX.low, lower);
  const bIn = progress(frame, sigmaAt - 4, 16);
  const scrollTo = mix(0, COMPACT_FROM, compact);
  const viewHeight = mix(G.codeHeight, COMPACT_VIEW, compact);
  const bWidth = mix(G.width, COL_W, compact);
  const scrollY = scrollTo * G.pitch; // SIGMA_RULE has no blank lines
  const bDim = 0.6 * windowWeight(frame, ruleA, ruleB, { ramp: 12 });

  const focus = steppedFocus(frame, [
    { at: sigmaAt, lines: null },
    { at: logsourceAt, lines: [L.logsource, L.product, L.category] },
    { at: selectionAt, lines: [L.selection, L.originalFileName] },
    { at: flagsAt, lines: [L.commandLine, L.decode, L.urlcache] },
    { at: filterAt, lines: [L.filter, L.filterImage] },
    { at: condAt, lines: [L.condition] },
    { at: readEnd, lines: null },
    { at: evLegit + 10, lines: [L.filter, L.filterImage] },
    { at: evRenamed, lines: [L.originalFileName] },
    { at: ruleA, lines: null },
    { at: hitAt, lines: [L.originalFileName] },
    { at: filtro10, lines: [L.originalFileName, L.filterImage] },
  ]);

  const w = (from: number, to = Number.POSITIVE_INFINITY) => windowWeight(frame, from, to, { ramp: 12 });
  const highlights: RuleHighlight[] = [
    { line: L.product, token: 'windows', amount: w(logsourceAt, selectionAt) },
    { line: L.category, token: 'process_creation', amount: w(logsourceAt, selectionAt) },
    { line: L.originalFileName, amount: w(selectionAt, flagsAt) },
    { line: L.decode, token: "'-decode'", amount: w(flagsAt, filterAt) },
    { line: L.urlcache, token: "'-urlcache'", amount: w(flagsAt, filterAt) },
    { line: L.filterImage, amount: w(filterAt, condAt) },
    { line: L.condition, token: 'selection and not filter_expected', amount: w(condAt, readEnd) },
    { line: L.filterImage, tone: C.emerald, amount: w(evLegit + 16, evRenamed) },
    { line: L.originalFileName, tone: C.emerald, amount: w(avisaria - 4, ruleA) },
    { line: L.originalFileName, tone: C.emerald, amount: w(hitAt) },
    { line: L.filterImage, tone: C.cyan, amount: w(filtro10 - 2) },
  ];

  // Stage coordinates of a line of B (reading position) for the callouts.
  const readY = (n: number) => BOX.read.y + G.lineY(n);
  const readEndX = (n: number) => BOX.read.x + G.lineEnd(n);
  const callouts = [
    { a: w(logsourceAt, selectionAt), y: (readY(L.product) + readY(L.category)) / 2, lineX: readEndX(L.category), text: S04_TEXT.logsource },
    { a: w(selectionAt, flagsAt), y: readY(L.originalFileName), lineX: readEndX(L.originalFileName), text: S04_TEXT.selection, sub: S04_TEXT.selectionSub, icon: 'passport' as const },
    { a: w(flagsAt, filterAt), y: (readY(L.decode) + readY(L.urlcache)) / 2, lineX: readEndX(L.urlcache), text: S04_TEXT.flags },
    { a: w(filterAt, condAt), y: readY(L.filterImage), lineX: readEndX(L.filterImage), text: S04_TEXT.filter, sub: S04_TEXT.filterSub, icon: 'card' as const },
    { a: w(condAt, readEnd), y: readY(L.condition), lineX: readEndX(L.condition), text: S04_TEXT.cond },
  ];
  const calloutsVisible = 1 - compact;

  // Icons that stay next to B's lines once it is compact.
  const bIcons = progress(frame, readEnd + 14, 16);
  const compactLineY = (n: number) => bBox.y + G.codeTop + (G.tops[n] - scrollY) + G.pitch / 2;
  const B_CARD_W = 70;
  const B_PASS_W = 34;

  // B rings emerald on the answer, strongest on «Esta, sí».
  const ring = 0.55 * progress(frame, answerAt - 2, 16) + 0.45 * progress(frame, esta10 - 4, 14);

  // ---- Rule A
  const aIn = progress(frame, ruleA - 4, 16);
  const aDim = Math.max(0.6 * windowWeight(frame, ruleB, evNew, { ramp: 12 }), progress(frame, missAt + 26, 20, EASE.inOut));
  const aHighlights: RuleHighlight[] = [
    { line: 0, token: RULE_A_TOKEN, tone: C.rose, amount: w(ese - 4, ruleB) },
    { line: 0, token: RULE_A_TOKEN, tone: C.amber, amount: w(missAt - 2) },
  ];
  const aLineY = A_Y + GA.lineY(0);
  const aIconX = GA.lineEnd(0) + 26;
  const missTag = progress(frame, missAt + 2, 14);

  // ---- Events 1 and 2, then 3
  const pairOut = progress(frame, evNew - 6, 16, EASE.inOut);
  const e1In = progress(frame, evLegit + 2, 18);
  const e2In = progress(frame, evLegit + 14, 18);
  const e1Dim = 0.6 * w(evRenamed, evNew);
  const e2Dim = Math.max(0.6 * w(evLegit + 14, evRenamed), 0.4 * w(ruleB, evNew));
  const e2Changed = progress(frame, tarjeta05 - 4, 14);
  const e3In = progress(frame, evNew + 2, 18);
  const e3Y = E3_Y;

  const e1Marks: Partial<Record<'image' | 'ofn' | 'cmd', RowMark>> = { image: { tone: C.emerald, a: w(evLegit + 16, evRenamed) } };
  const e2Marks: Partial<Record<'image' | 'ofn' | 'cmd', RowMark>> = {
    image: { tone: C.rose, a: Math.max(w(tarjeta05 - 2, evRenamed + 40), w(ese - 4, ruleB)) },
    ofn: { tone: C.emerald, a: w(avisaria - 4, ruleA) },
  };
  const e3Marks: Partial<Record<'image' | 'ofn' | 'cmd', RowMark>> = {
    image: { tone: C.rose, a: Math.max(w(tarjeta07 - 2, answerAt), w(tarjeta08 - 2, hitAt)) },
    ofn: { tone: C.emerald, a: w(hitAt) },
  };

  // Connectors on the answer (event 3 rows to the rules' lines).
  const missLink = progress(frame, missAt - 2, 14);
  const hitLink = progress(frame, hitAt, 14);

  // ---- The gate (intercept), then a small reminder in the corner while the rule is read
  const toCorner = progress(frame, sigmaAt - 4, 24, EASE.inOut);
  const gateBox = mixBox(GATE.big, GATE.corner, toCorner);
  const gateOut = progress(frame, readEnd - 6, 16, EASE.inOut);
  const gateLens = progress(frame, replyAt - 6, 20);
  const gateIn = progress(frame, 0, 12);

  return (
    <Stage>
      {/* The gate and its logbook, read by the lens */}
      {gateOut < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: gateBox.x,
            top: gateBox.y,
            transform: `scale(${gateBox.s})`,
            transformOrigin: '0 0',
            opacity: gateIn * (1 - gateOut) * (1 - 0.45 * toCorner),
          }}
        >
          <Gate width={GATE_W} pass={0.25 + 0.75 * progress(frame, 0, 60, EASE.inOut)} write={progress(frame, 30, 30)} lens={gateLens} />
        </div>
      ) : null}

      {/* Rule A («ejemplo»): only the card */}
      {aIn > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: A_Y, transform: `translateY(${(1 - aIn) * 20}px)`, ...dimStyle(aDim, aIn) }}>
          <RuleCode lines={RULE_A} title="Sigma" label={RULE_A_LABEL} width={COL_W} highlights={aHighlights} frame={frame} />
          <div style={{ position: 'absolute', left: aIconX, top: GA.lineY(0) - (B_CARD_W * CARD_ASPECT) / 2 }}>
            <BoardingCard width={B_CARD_W} style={{ height: B_CARD_W * CARD_ASPECT }} />
          </div>
          {missTag > 0.001 ? (
            <div
              style={{
                position: 'absolute',
                left: aIconX + B_CARD_W + 22,
                top: GA.lineY(0),
                transform: `translateY(-50%) scale(${1.15 - 0.15 * missTag})`,
                opacity: missTag,
                padding: '4px 18px',
                borderRadius: RADIUS.pill,
                border: `2px solid ${alpha(C.amber, 0.85)}`,
                background: `linear-gradient(${alpha(C.amber, 0.16)}, ${alpha(C.amber, 0.16)}), ${C.ink900}`,
                color: C.amber,
                fontFamily: FONT.sans,
                fontSize: 32,
                fontWeight: 800,
                lineHeight: 1.15,
                whiteSpace: 'nowrap',
              }}
            >
              {S04_TEXT.missTag}
            </div>
          ) : null}
        </div>
      ) : null}

      {/* The lesson's Sigma rule (B) */}
      {bIn > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: bBox.x,
            top: bBox.y,
            transform: `scale(${bBox.s}) translateY(${(1 - bIn) * 24}px)`,
            transformOrigin: '0 0',
            ...dimStyle(bDim, bIn),
          }}
        >
          {ring > 0.001 ? (
            <div
              style={{
                position: 'absolute',
                inset: -5,
                borderRadius: RADIUS.md + 4,
                border: `3px solid ${alpha(C.emerald, 0.9 * ring)}`,
                boxShadow: `0 0 ${Math.round(34 * ring)}px ${alpha(C.emerald, 0.4 * ring)}`,
              }}
            />
          ) : null}
          <RuleCode
            lines={SIGMA_RULE}
            title="Sigma"
            frame={frame}
            width={bWidth}
            viewHeight={viewHeight}
            scrollTo={scrollTo}
            focus={focus.lines}
            focusAmount={focus.amount}
            highlights={highlights}
          />
        </div>
      ) : null}

      {/* Passport and boarding card beside B's lines once it is compact */}
      {bIcons > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, ...dimStyle(bDim, bIcons) }}>
          <div style={{ position: 'absolute', left: COL_W - 28 - B_PASS_W, top: compactLineY(L.originalFileName) - (B_PASS_W * PASSPORT_ASPECT) / 2 + 6 }}>
            <Passport width={B_PASS_W} style={{ height: B_PASS_W * PASSPORT_ASPECT }} />
          </div>
          <div style={{ position: 'absolute', left: COL_W - 28 - B_CARD_W, top: compactLineY(L.filterImage) - (B_CARD_W * CARD_ASPECT) / 2 }}>
            <BoardingCard width={B_CARD_W} style={{ height: B_CARD_W * CARD_ASPECT }} />
          </div>
        </div>
      ) : null}

      {/* Reading callouts, one at a time */}
      {calloutsVisible > 0.001
        ? callouts.map((c, i) => (
            <Callout
              key={i}
              x={c.lineX + 56}
              y={c.y}
              lineX={c.lineX + 8}
              a={c.a * calloutsVisible}
              tone={C.cyan}
              text={c.text}
              sub={c.sub}
              icon={
                c.icon === 'passport' ? (
                  <Passport width={44} style={{ height: 44 * PASSPORT_ASPECT }} />
                ) : c.icon === 'card' ? (
                  <BoardingCard width={96} style={{ height: 96 * CARD_ASPECT }} />
                ) : undefined
              }
            />
          ))
        : null}

      {/* Events 1 and 2 */}
      {pairOut < 1 && e1In > 0.001 ? (
        <div style={{ position: 'absolute', left: EV_X, top: PAIR_Y, opacity: 1 - pairOut, transform: `translateX(${pairOut * 60}px)` }}>
          <EventCard
            event={EVENTS[0]}
            appear={e1In}
            dim={e1Dim}
            marks={e1Marks}
            verdict={{ text: S04_TEXT.quiet, tone: C.emerald, p: progress(frame, evLegit + 22, 14) }}
            note={{ text: S04_TEXT.filterCovers, tone: C.text, p: progress(frame, evLegit + 30, 14) }}
          />
          <div style={{ position: 'absolute', left: 0, top: EG.height + PAIR_GAP }}>
            <EventCard
              event={EVENTS[1]}
              appear={e2In}
              changed={e2Changed}
              dim={e2Dim}
              marks={e2Marks}
              verdict={{ text: S04_TEXT.fires, tone: C.emerald, p: progress(frame, avisaria - 4, 14) }}
            />
          </div>
        </div>
      ) : null}

      {/* Event 3: a new card; no verdict until the answer */}
      {e3In > 0.001 ? (
        <div style={{ position: 'absolute', left: EV_X, top: e3Y }}>
          <EventCard
            event={EVENTS[2]}
            appear={e3In}
            changed={1}
            marks={e3Marks}
            verdict={{ text: S04_TEXT.fires, tone: C.emerald, p: progress(frame, hitAt + 6, 14) }}
            note={{ text: S04_TEXT.filterMisses, tone: C.cyanSoft, p: progress(frame, filtro10 - 2, 14) }}
          />
        </div>
      ) : null}

      {/* The answer: A does not see event 3's card; B's passport line matches */}
      <MatchLink
        x0={COL_W + 4}
        y0={aLineY}
        x1={EV_X - 4}
        y1={e3Y + EG.valueY('image')}
        p={missLink * (1 - 0.5 * progress(frame, missAt + 26, 20, EASE.inOut))}
        tone={C.amber}
        mark="x"
        dashed
      />
      <MatchLink x0={COL_W + 4} y0={compactLineY(L.originalFileName)} x1={EV_X - 4} y1={e3Y + EG.valueY('ofn')} p={hitLink} tone={C.emerald} mark="check" />
    </Stage>
  );
}
