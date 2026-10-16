import { useCurrentFrame } from 'remotion';
import { enterFramesFor, sceneTiming } from '../../../engine/src/timeline/load';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { YARA_LINE, YARA_RULE } from '../data/rules';
import { COND_PLAIN, PARTS, REPLY, SOC, TAGS, WRAP } from '../data/s03-condicion';
import { TIMELINE } from '../timeline/load';
import { SCANNER_ASPECT, Scanner } from './parts/Airport';
import { RuleCode, ruleCodeGeometry, type RuleHighlight, type RuleTag } from './parts/RuleCode';
import { Stage, segment, wordFrame } from './kit';

const S = 's03-condicion';
const W = STAGE.width;

// ---- The rule panel: wide enough that the tag column sits inside it (stage-local px).
const PANEL_X = 20;
const PANEL_Y = 25;
const PANEL_W = 1688;
const RULE_OPTS = { title: 'YARA' } as const;
const GEO = ruleCodeGeometry(YARA_RULE, RULE_OPTS);
/** Stage y of a rule line's centre. */
const lineY = (n: number) => PANEL_Y + GEO.lineY(n);
/** Stage x of the end of a rule line's text. */
const lineEnd = (n: number) => PANEL_X + GEO.lineEnd(n);

// ---- The scanner: big and low under the intercepted message, then a miniature top-right beside the rule.
const SCAN_BIG = { x: (W - 600) / 2, y: 292, w: 600 };
// below the panel's header strip (its label must stay readable) and above the tag column
const SCAN_SMALL = { x: W - 320 - 34, y: 64, w: 320 };

// ---- The SOC strip and its flood (right, below the tag column).
const SOC_X = 1252;
const SOC_Y = 588;
const SOC_W = 440;
const ALERT_W = 136;
const ALERT_H = 40;
const ALERT_TILT = [-4, 3, -2, 5, -3, 2, 4, -5, 1];

// ---- The condition in plain words, to the right of the condition lines.
const PLAIN_X = 800;
const PLAIN_TOP = [452, 505, 558];

/** Gloss chips for the three parts sit after the section header, clear of the neighbouring lines. */
const GLOSS_X = PANEL_X + 690;

/** The intercepted message's window in this scene's local frames (from the timeline). */
function interceptWindow(): { from: number; to: number } {
  const e = TIMELINE.intercept?.find((i) => i.scene === S);
  if (!e) return { from: Number.POSITIVE_INFINITY, to: Number.NEGATIVE_INFINITY };
  const origin = sceneTiming(TIMELINE, S).from - enterFramesFor(TIMELINE, S);
  return { from: e.from - origin, to: e.from + e.durationInFrames - origin };
}

/**
 * s03-condicion «La condición decide». Under VELVET CICADA's message the scanner sits low and centred: the suitcase
 * rides in, the bottle lights amber on «corriente» (salta con todos) and the rare piece emerald on «solo» (puede ir
 * sola). On `rule` the scanner shrinks to the top-right and the YARA rule (lesson extract) comes in; `meta`, `strings`
 * and «condition» light their section one by one with the exam term boxed in violet and a gloss. On `generic` the
 * `$api` line turns amber with «está en miles de programas legítimos» and the scanner flags the bottle; on `flood` a
 * pile of «aviso» cards falls on the SOC strip. On `tags-company` the note becomes «de compañía», `$pipe` and `$op`
 * get theirs, the pile shrinks on «menos»; on «PDB» `$pdb` is tagged «único» and the scanner flags the rare piece.
 * The condition is then read in three plain lines (`cond-mz`, `cond-size`, `cond-or`), and `wrap-i` dims everything
 * under the chapter's closing pair.
 */
export function S03Condicion(props: SceneProps) {
  const frame = useCurrentFrame();
  const ic = interceptWindow();
  const s01 = segment(props, 's03-01');

  const ruleAt = props.cue('rule');
  const metaAt = props.cue('meta');
  const stringsAt = props.cue('strings');
  const conditionAt = wordFrame(S, 's03-02', 'condition');
  const genericAt = props.cue('generic');
  const floodAt = props.cue('flood');
  const tagsAt = props.cue('tags-company');
  const pipeAt = wordFrame(S, 's03-04', 'dos');
  const opAt = wordFrame(S, 's03-04', 'siguientes');
  const quietAt = wordFrame(S, 's03-04', 'menos');
  const pdbLineAt = segment(props, 's03-05').from;
  const pdbAt = wordFrame(S, 's03-05', 'PDB');
  const condMzAt = props.cue('cond-mz');
  const condSizeAt = props.cue('cond-size');
  const condOrAt = props.cue('cond-or');
  const wrapAt = props.cue('wrap-i');

  // ---- Before the rule: the reply, low (the message owns the top-centre until s03-01 ends).
  const commonAt = wordFrame(S, 's03-01', 'corriente');
  const ownAt = wordFrame(S, 's03-01', 'solo');
  const replyOut = 1 - progress(frame, Math.max(s01.to, ruleAt) - 12, 10);
  const commonIn = progress(frame, commonAt - 4, 14) * replyOut;
  const ownIn = progress(frame, ownAt - 4, 14) * replyOut;

  // ---- The scanner: travel in, then shrink to its miniature on `rule`.
  const scanIn = progress(frame, 2, 16);
  const travel = 0.5 * progress(frame, Math.min(14, ic.from + 2), 54, EASE.inOut);
  const shrink = progress(frame, ruleAt - 2, 28, EASE.inOut);
  const sx = SCAN_BIG.x + (SCAN_SMALL.x - SCAN_BIG.x) * shrink;
  const sy = SCAN_BIG.y + (SCAN_SMALL.y - SCAN_BIG.y) * shrink;
  const sScale = 1 + (SCAN_SMALL.w / SCAN_BIG.w - 1) * shrink;
  const bottleBeep = Math.max(
    progress(frame, commonAt - 2, 10) * (1 - progress(frame, ownAt - 6, 8)),
    progress(frame, genericAt + 10, 12) * (1 - progress(frame, tagsAt, 14)),
  );
  const rareBeep = Math.max(
    progress(frame, ownAt - 2, 10) * (1 - progress(frame, ruleAt - 8, 12)),
    progress(frame, pdbAt - 4, 12) * (1 - progress(frame, condMzAt - 8, 14)),
  );
  const scanFlag = rareBeep > 0.01 ? 2 : bottleBeep > 0.01 ? 0 : undefined;
  const scanDim =
    0.45 * progress(frame, ruleAt + 20, 14) * (1 - progress(frame, genericAt - 4, 12)) +
    0.5 * progress(frame, condMzAt - 4, 14) +
    0.3 * progress(frame, wrapAt - 2, 14);

  // ---- The rule: which lines the voice is on.
  let focus: number[] | null = null;
  const L = YARA_LINE;
  if (frame >= wrapAt) focus = [];
  else if (frame >= condOrAt) focus = [L.condition, L.condMz, L.condSize, L.condOr];
  else if (frame >= condSizeAt) focus = [L.condition, L.condMz, L.condSize];
  else if (frame >= condMzAt) focus = [L.condition, L.condMz];
  else if (frame >= pdbLineAt) focus = [L.strings, L.pdb];
  else if (frame >= tagsAt) focus = [L.strings, L.api, L.pipe, L.op];
  else if (frame >= genericAt) focus = [L.strings, L.api];
  else if (frame >= conditionAt) focus = [L.condition, L.condMz, L.condSize, L.condOr];
  else if (frame >= stringsAt) focus = [L.strings, L.api, L.pipe, L.op, L.pdb];
  else if (frame >= metaAt) focus = [L.meta, L.author, L.description, L.tlp];
  const focusAmount = frame >= wrapAt ? 0.6 + 0.4 * progress(frame, wrapAt, 14) : 1;

  const termOut = 1 - 0.75 * progress(frame, genericAt - 4, 14);
  const tagsOut = 1 - progress(frame, condMzAt - 14, 12);
  const condOut = 1 - 0.55 * progress(frame, wrapAt, 14);
  const highlights: RuleHighlight[] = [
    { line: L.meta, token: 'meta', tone: C.violet, amount: progress(frame, metaAt - 2, 12) * termOut },
    { line: L.strings, token: 'strings', tone: C.violet, amount: progress(frame, stringsAt - 2, 12) * termOut },
    { line: L.condition, token: 'condition', tone: C.violet, amount: progress(frame, conditionAt - 2, 12) * termOut },
    // $api alone: amber (it is everywhere); then one voice among three: cyan
    { line: L.api, tone: C.amber, amount: progress(frame, genericAt, 14) * (1 - progress(frame, tagsAt - 4, 10)) },
    { line: L.api, token: '$api', tone: C.cyan, amount: progress(frame, tagsAt, 12) * tagsOut },
    { line: L.pipe, token: '$pipe', tone: C.cyan, amount: progress(frame, pipeAt - 2, 12) * tagsOut },
    { line: L.op, token: '$op', tone: C.cyan, amount: progress(frame, opAt, 12) * tagsOut },
    { line: L.pdb, token: '$pdb', tone: C.emerald, amount: progress(frame, pdbAt - 4, 12) * tagsOut },
    { line: L.condMz, tone: C.cyan, amount: progress(frame, condMzAt, 14) * condOut },
    { line: L.condSize, tone: C.cyan, amount: progress(frame, condSizeAt, 14) * condOut },
    { line: L.condOr, tone: C.cyan, amount: progress(frame, condOrAt, 14) * condOut },
  ];
  const tags: RuleTag[] = [
    frame < tagsAt
      ? { line: L.api, text: TAGS.apiNote, tone: C.amber, amount: progress(frame, genericAt + 6, 14) * (1 - progress(frame, tagsAt - 8, 8)) }
      : { line: L.api, text: TAGS.company, tone: C.cyan, amount: progress(frame, tagsAt + 2, 12) * tagsOut },
    { line: L.pipe, text: TAGS.pipe, sub: TAGS.pipeSub, tone: C.cyan, amount: progress(frame, pipeAt, 14) * tagsOut },
    { line: L.op, text: TAGS.company, tone: C.cyan, amount: progress(frame, opAt + 2, 14) * tagsOut },
    { line: L.pdb, text: TAGS.pdb, tone: C.emerald, amount: progress(frame, pdbAt - 2, 14) * tagsOut },
  ];

  // ---- Glosses for the three parts.
  const glossOut = 1 - progress(frame, genericAt - 10, 10);
  const glosses = [
    { part: PARTS.meta, line: L.meta, at: metaAt, next: stringsAt },
    { part: PARTS.strings, line: L.strings, at: stringsAt, next: conditionAt },
    { part: PARTS.condition, line: L.condition, at: conditionAt, next: genericAt },
  ];

  // ---- The flood.
  const socIn = progress(frame, floodAt - 14, 14) * (1 - progress(frame, condMzAt - 14, 12));
  const alerts = ALERT_TILT.map((tilt, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const fall = progress(frame, floodAt + 2 + i * 4, 16, EASE.out);
    const keep = i === 0 ? 1 : 1 - progress(frame, quietAt - 4 + (i % 4) * 2, 12);
    return {
      x: SOC_X + 8 + col * (ALERT_W + 12),
      y: SOC_Y - 10 - ALERT_H - row * (ALERT_H + 8) - (1 - fall) * 150,
      tilt: tilt * (0.4 + 0.6 * fall),
      a: Math.min(1, fall * 1.6) * keep * socIn,
    };
  });

  // ---- The condition in plain words.
  const plainAt = [condMzAt, condSizeAt, condOrAt];
  const plainLines = [L.condMz, L.condSize, L.condOr];
  const wrapIn = progress(frame, wrapAt, 16);

  return (
    <Stage>
      {/* ===== The YARA rule ===== */}
      <div style={{ position: 'absolute', left: PANEL_X, top: PANEL_Y }}>
        <RuleCode
          lines={YARA_RULE}
          frame={frame}
          {...RULE_OPTS}
          width={PANEL_W}
          at={ruleAt + 4}
          focus={focus}
          focusAmount={focusAmount}
          highlights={highlights}
          tags={tags}
        />
      </div>

      {/* Glosses of the three parts (after each section header) */}
      {glosses.map((g) => {
        const a = progress(frame, g.at, 14) * glossOut;
        if (a <= 0.01) return null;
        const current = frame < g.next ? 1 : 0.55;
        return (
          <div
            key={g.part.term}
            style={{
              position: 'absolute',
              left: GLOSS_X,
              top: lineY(g.line) - 23,
              height: 46,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              whiteSpace: 'nowrap',
              opacity: a * current,
              transform: `translateX(${(1 - a) * 14}px)`,
            }}
          >
            <span
              style={{
                padding: '2px 14px',
                borderRadius: RADIUS.pill,
                border: `2px solid ${alpha(C.violet, 0.8)}`,
                background: alpha(C.violetDeep, 0.9),
                fontFamily: FONT.mono,
                fontSize: 30,
                fontWeight: 700,
                color: '#ddd6fe',
                lineHeight: 1.2,
              }}
            >
              {g.part.term}
            </span>
            <span style={{ fontFamily: FONT.sans, fontSize: 34, fontWeight: 700, color: C.textStrong, lineHeight: 1.2 }}>{g.part.gloss}</span>
          </div>
        );
      })}

      {/* ===== The condition in three plain lines ===== */}
      {plainAt.map((at, i) => {
        const a = progress(frame, at + 2, 14);
        if (a <= 0.01) return null;
        const top = PLAIN_TOP[i];
        const fromX = lineEnd(plainLines[i]) + 12;
        const fromY = lineY(plainLines[i]);
        const toY = top + 24;
        const current = i === 2 || frame < plainAt[i + 1] ? 1 : 0.7;
        return (
          <div key={i} style={{ opacity: a * condOut * current }}>
            <svg width={W} height={STAGE.height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              <path
                d={`M ${fromX} ${fromY} C ${fromX + 120} ${fromY} ${PLAIN_X - 140} ${toY} ${PLAIN_X - 14} ${toY}`}
                fill="none"
                stroke={alpha(C.cyan, 0.75)}
                strokeWidth={2.5}
                strokeDasharray="6 6"
              />
              <circle cx={fromX} cy={fromY} r={5} fill={C.cyan} />
            </svg>
            <div
              style={{
                position: 'absolute',
                left: PLAIN_X,
                top,
                width: W - PLAIN_X - 20,
                padding: '4px 16px',
                boxSizing: 'border-box',
                borderLeft: `4px solid ${C.cyan}`,
                background: alpha(C.ink900, 0.92),
                borderRadius: '0 10px 10px 0',
                fontFamily: FONT.sans,
                fontSize: 36,
                fontWeight: 700,
                lineHeight: 1.2,
                color: i === 2 ? C.textStrong : C.text,
                transform: `translateX(${(1 - a) * 16}px)`,
              }}
            >
              {COND_PLAIN[i]}
            </div>
          </div>
        );
      })}

      {/* ===== The SOC strip and its flood of false alerts ===== */}
      {socIn > 0.01 ? (
        <>
          {alerts.map((al, i) =>
            al.a > 0.01 ? (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: al.x,
                  top: al.y,
                  width: ALERT_W,
                  height: ALERT_H,
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  borderRadius: 10,
                  border: `2px solid ${alpha(C.amber, 0.9)}`,
                  background: `linear-gradient(${alpha(C.amber, 0.18)}, ${alpha(C.amber, 0.18)}), ${C.ink900}`,
                  fontFamily: FONT.sans,
                  fontSize: 27,
                  fontWeight: 750,
                  color: '#fde68a',
                  opacity: al.a,
                  transform: `rotate(${al.tilt}deg)`,
                }}
              >
                <Icon name="alert" size={24} color={C.amber} strokeWidth={2.4} />
                {SOC.alert}
              </div>
            ) : null,
          )}
          <div
            style={{
              position: 'absolute',
              left: SOC_X,
              top: SOC_Y,
              width: SOC_W,
              height: 52,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '0 18px',
              borderRadius: 12,
              border: `2px solid ${alpha(C.cyan, 0.7)}`,
              background: `linear-gradient(${alpha(C.cyan, 0.12)}, ${alpha(C.cyan, 0.12)}), ${C.ink850}`,
              opacity: socIn,
            }}
          >
            <Icon name="users" size={30} color={C.cyanSoft} strokeWidth={2.2} />
            <span style={{ fontFamily: FONT.sans, fontSize: 32, fontWeight: 750, color: C.cyanSoft }}>{SOC.label}</span>
          </div>
        </>
      ) : null}

      {/* ===== The reply, low under the intercepted message ===== */}
      {commonIn > 0.01 ? (
        <ReplyBlock left={40} top={372} width={SCAN_BIG.x - 80} align="right" a={commonIn} line={REPLY.common} verdict={REPLY.commonVerdict} tone={C.amber} soft="#fde68a" />
      ) : null}
      {ownIn > 0.01 ? (
        <ReplyBlock left={SCAN_BIG.x + SCAN_BIG.w + 40} top={372} width={W - (SCAN_BIG.x + SCAN_BIG.w) - 60} align="left" a={ownIn} line={REPLY.own} verdict={REPLY.ownVerdict} tone={C.emerald} soft="#a7f3d0" />
      ) : null}

      {/* ===== The scanner (YARA): big and low, then a miniature beside the rule ===== */}
      <div
        style={{
          position: 'absolute',
          left: sx,
          top: sy,
          width: SCAN_BIG.w,
          height: SCAN_BIG.w * SCANNER_ASPECT,
          transform: `scale(${sScale})`,
          transformOrigin: '0 0',
          opacity: scanIn,
        }}
      >
        <Scanner
          width={SCAN_BIG.w}
          items={['bottle', 'umbrella', 'rare']}
          flag={scanFlag}
          flagTone={scanFlag === 2 ? C.emerald : C.amber}
          travel={travel}
          beep={Math.max(bottleBeep, rareBeep)}
          beepTone={scanFlag === 2 ? C.emerald : C.amber}
          dim={scanDim}
        />
      </div>

      {/* ===== Chapter close ===== */}
      {wrapIn > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: (W - 1060) / 2,
            top: 196,
            width: 1060,
            boxSizing: 'border-box',
            padding: '26px 40px',
            borderRadius: RADIUS.lg,
            border: `2px solid ${alpha(C.cyan, 0.55)}`,
            background: alpha(C.ink900, 0.95),
            boxShadow: `0 24px 60px ${alpha('#000000', 0.5)}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            opacity: wrapIn,
            transform: `scale(${0.96 + 0.04 * wrapIn})`,
          }}
        >
          <span style={{ fontFamily: FONT.sans, fontSize: 58, fontWeight: 850, color: C.cyanSoft, lineHeight: 1.15 }}>{WRAP[0]}</span>
          <span
            style={{
              fontFamily: FONT.sans,
              fontSize: 58,
              fontWeight: 850,
              color: '#a7f3d0',
              lineHeight: 1.15,
              opacity: progress(frame, wordFrame(S, 's03-07', 'único') - 8, 14),
            }}
          >
            {WRAP[1]}
          </span>
        </div>
      ) : null}
    </Stage>
  );
}

function ReplyBlock({
  left,
  top,
  width,
  align,
  a,
  line,
  verdict,
  tone,
  soft,
}: {
  left: number;
  top: number;
  width: number;
  align: 'left' | 'right';
  a: number;
  line: string;
  verdict: string;
  tone: string;
  soft: string;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width,
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'right' ? 'flex-end' : 'flex-start',
        textAlign: align,
        gap: 10,
        opacity: a,
        transform: `translateY(${(1 - a) * 14}px)`,
      }}
    >
      <span style={{ fontFamily: FONT.sans, fontSize: 36, fontWeight: 700, color: C.text, lineHeight: 1.2 }}>{line}</span>
      <span
        style={{
          padding: '6px 22px',
          borderRadius: RADIUS.pill,
          border: `2px solid ${alpha(tone, 0.8)}`,
          background: `linear-gradient(${alpha(tone, 0.16)}, ${alpha(tone, 0.16)}), ${C.ink900}`,
          fontFamily: FONT.sans,
          fontSize: 44,
          fontWeight: 850,
          color: soft,
          whiteSpace: 'nowrap',
          lineHeight: 1.2,
        }}
      >
        {verdict}
      </span>
    </div>
  );
}
