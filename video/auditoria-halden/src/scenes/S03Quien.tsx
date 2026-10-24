import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, dimStyle, mix, type IconName } from '../../../engine/src/ui';
import { LiftCabin } from './parts/Images';
import { ImageTag } from './parts/Labels';
import { Stage, wordFrame } from './kit';

const S = 's03-quien';
const W = STAGE.width;
// ---- Four rows (1100 wide) glide from the centre to the left when the lift comes in on the right.
const ROW_W = 1100;
const ROW_H = 132;
const ROW_STEP = 140;
const ROW_TOP = 60;
const X0 = Math.round((W - ROW_W) / 2);
const LIFT_X = 1150;
const SHAFT_X = LIFT_X + 10;
const CARD_X = LIFT_X + 126;

interface RowDef {
  term: string;
  icon: IconName;
  tone: string;
}

const ROWS: readonly RowDef[] = [
  { term: 'Self-assessment', icon: 'file', tone: C.sky },
  { term: 'Internal audit', icon: 'search', tone: C.cyan },
  { term: 'Independent third-party audit', icon: 'shield', tone: C.emerald },
  { term: 'Regulatory examination', icon: 'flag', tone: C.amber },
];

/** The lift's four reviews, one beside each row: [lead line, second line]. */
const LIFT_CARDS: readonly { icon: IconName; a: string; b?: string; tone: string }[] = [
  { icon: 'file', a: 'la hoja de los vecinos', b: 'la rellena la comunidad', tone: C.sky },
  { icon: 'user', a: 'el administrador', b: 'da cuenta a la junta', tone: C.cyan },
  { icon: 'shield', a: 'el organismo de control', b: 'lo contrata la comunidad', tone: C.emerald },
  { icon: 'flag', a: 'Industria', b: 'no la llama nadie · multa', tone: C.amber },
];

const rowTop = (i: number) => ROW_TOP + i * ROW_STEP;

/** The weight meter: four notches, `n` of them lit in the row's colour. */
function Meter({ n, tone, show }: { n: number; tone: string; show: number }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
      {[0, 1, 2, 3].map((k) => {
        const lit = k < n ? show : 0;
        return <div key={k} style={{ width: 30, height: 30 + k * 12, borderRadius: 7, border: `3px solid ${alpha(lit > 0.5 ? tone : C.muted, lit > 0.5 ? 0.95 : 0.4)}`, background: lit > 0.5 ? alpha(tone, 0.55) : alpha(C.ink800, 0.8), boxShadow: lit > 0.5 ? `0 0 14px ${alpha(tone, 0.4)}` : undefined }} />;
      })}
    </div>
  );
}

function Row({ def, i, children, term, meter, tileIn, gist }: { def: RowDef; i: number; children?: ReactNode; term: ReactNode; meter: ReactNode; tileIn: number; gist: ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: rowTop(i),
        width: ROW_W,
        height: ROW_H,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        padding: '0 28px 0 22px',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(def.tone, 0.35 + 0.5 * tileIn)}`,
        background: alpha(def.tone, 0.05 + 0.07 * tileIn),
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
      }}
    >
      <div style={{ flexShrink: 0, width: 84, height: 84, borderRadius: 20, display: 'grid', placeItems: 'center', border: `3px solid ${alpha(def.tone, 0.8)}`, background: alpha(def.tone, 0.12) }}>
        <Icon name={def.icon} size={50} color={def.tone} strokeWidth={2} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ height: 50, display: 'flex', alignItems: 'center', gap: 14, fontSize: 40, fontWeight: 850, color: C.textStrong }}>{term}</div>
        <div style={{ marginTop: 6, fontSize: 28, fontWeight: 650, color: C.text, lineHeight: 1.22 }}>{gist}</div>
      </div>
      {meter}
      {children}
    </div>
  );
}

/**
 * s03-quien «Quién lo comprueba». Four rows, from least to most weight outside, each with a four-notch meter: on
 * `checklist` the first row appears («checklist de Sistemas») and on `self` it gets its term, «Self-assessment», and
 * «barato · sin independencia»; on `internal` «Internal audit», «separada de Sistemas», and on `committee` an arrow to
 * «Audit committee» (not back to Sistemas) with «el comité no audita: protege a quien audita»; on `third-party`
 * «Independent third-party audit», on `regulator` «Regulatory examination» («no la contratas · el alcance lo fija la
 * ley · puede sancionar»). The row on the voice is bright, the earlier ones step back. On `lift` the rows glide left
 * and the community's lift comes in on the right, tagged «imagen · no es del puerto»: a cabin that rises past four
 * reviews, one beside each row — la hoja, el administrador (con su junta), el organismo de control y Industria. On
 * `rule` the rows come up together under the banner «lo que pesa es quién mira, no cuánto mira».
 */
export function S03Quien(props: SceneProps) {
  const frame = useCurrentFrame();
  const checklistAt = props.cue('checklist');
  const selfAt = props.cue('self');
  const internalAt = props.cue('internal');
  const committeeAt = props.cue('committee');
  const thirdAt = props.cue('third-party');
  const regAt = props.cue('regulator');
  const liftAt = props.cue('lift');
  const ruleAt = props.cue('rule');
  const rowAt = [checklistAt - 2, internalAt - 2, thirdAt - 2, regAt - 2];
  const termAt = [selfAt - 2, internalAt - 2, thirdAt - 2, regAt - 2];
  const showRow = rowAt.map((a) => progress(frame, a, 16));
  const showTerm = termAt.map((a) => progress(frame, a, 12));

  // Which row the voice is on: the last one started (all up again from the lift on).
  const active = frame >= regAt - 2 ? 3 : frame >= thirdAt - 2 ? 2 : frame >= internalAt - 2 ? 1 : 0;
  const allUp = progress(frame, liftAt - 6, 14);
  const dimOf = (i: number) => (i === active ? 0 : 0.5 * (1 - allUp));

  const glide = progress(frame, liftAt - 14, 30, EASE.inOut);
  const rowsX = mix(X0, 0, glide);
  const ruleIn = progress(frame, ruleAt - 4, 14);
  const header = 1 - ruleIn;

  // ---- The lift: cabin rises with the cards.
  const liftIn = progress(frame, liftAt - 6, 18);
  const orgAt = Math.max(liftAt + 40, wordFrame(S, 's03-06', 'organismo') - 8);
  const indAt = Math.max(orgAt + 20, wordFrame(S, 's03-06', 'Industria') - 8);
  const adminAt = Math.max(liftAt + 24, wordFrame(S, 's03-06', 'poco') + 4);
  const cardAt = [liftAt + 4, Math.min(adminAt, orgAt - 12), orgAt, indAt];
  const cardIn = cardAt.map((a) => progress(frame, a, 14));
  const cabinRow = frame >= cardAt[3] ? 3 : frame >= cardAt[2] ? 2 : frame >= cardAt[1] ? 1 : 0;
  // eased vertical position of the cabin: follows the row index with a short glide at each step.
  const cabinY = (() => {
    let y = rowTop(0) + ROW_H / 2;
    [1, 2, 3].forEach((r) => {
      y += (rowTop(r) - rowTop(r - 1)) * progress(frame, cardAt[r] - 6, 22, EASE.inOut);
    });
    return y;
  })();
  const doors = Math.max(0, Math.min(1, progress(frame, cardAt[cabinRow] + 6, 10)));

  return (
    <Stage>
      {/* Rows and their banner */}
      <div style={{ position: 'absolute', left: rowsX, top: 0, width: ROW_W, height: STAGE.height }}>
        {/* header: «peso fuera» over the meters, then the rule */}
        <div style={{ position: 'absolute', right: 28, top: 8, fontFamily: FONT.sans, fontSize: 28, fontWeight: 700, color: C.muted, opacity: Math.min(1, showRow[0]) * header, whiteSpace: 'nowrap' }}>peso fuera</div>
        {ruleIn > 0.01 ? (
          <div style={{ position: 'absolute', left: 0, top: 0, width: ROW_W, height: 52, display: 'flex', alignItems: 'center', gap: 18, fontFamily: FONT.sans, fontSize: 38, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap', opacity: ruleIn, transform: `translateY(${(1 - ruleIn) * 10}px)` }}>
            <Icon name="eye" size={42} color={C.emerald} strokeWidth={2.2} />
            <span>
              lo que pesa es <span style={{ color: C.emerald }}>quién mira</span>, no cuánto mira
            </span>
          </div>
        ) : null}

        {/* Row 1: self-assessment */}
        <div style={{ opacity: showRow[0], transform: `translateY(${(1 - showRow[0]) * 18}px)`, ...dimStyle(dimOf(0)) }}>
          <Row
            def={ROWS[0]}
            i={0}
            tileIn={showRow[0]}
            term={<span style={{ opacity: showTerm[0] }}>{ROWS[0].term}</span>}
            meter={<Meter n={1} tone={ROWS[0].tone} show={showTerm[0]} />}
            gist={
              <>
                <span>checklist de Sistemas</span>
                <span style={{ opacity: showTerm[0] }}> · barato · </span>
                <span style={{ opacity: showTerm[0], color: C.roseSoft }}>sin independencia</span>
              </>
            }
          />
        </div>

        {/* Row 2: internal audit and its committee */}
        <div style={{ opacity: showRow[1], transform: `translateY(${(1 - showRow[1]) * 18}px)`, ...dimStyle(dimOf(1)) }}>
          <Row
            def={ROWS[1]}
            i={1}
            tileIn={showRow[1]}
            term={
              <>
                <span>{ROWS[1].term}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14, opacity: progress(frame, committeeAt - 4, 12) }}>
                  <svg width={56} height={26} viewBox="0 0 70 26" fill="none" aria-hidden>
                    <path d="M3 13 H62 M50 4 L63 13 L50 22" stroke={C.cyan} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{ color: C.cyanSoft }}>Audit committee</span>
                </span>
              </>
            }
            meter={<Meter n={2} tone={ROWS[1].tone} show={showRow[1]} />}
            gist={
              <>
                <div>separada de Sistemas</div>
                <div style={{ opacity: progress(frame, committeeAt + 6, 14), color: C.cyanSoft }}>el comité no audita: protege a quien audita</div>
              </>
            }
          />
        </div>

        {/* Row 3: independent third-party audit */}
        <div style={{ opacity: showRow[2], transform: `translateY(${(1 - showRow[2]) * 18}px)`, ...dimStyle(dimOf(2)) }}>
          <Row def={ROWS[2]} i={2} tileIn={showRow[2]} term={ROWS[2].term} meter={<Meter n={3} tone={ROWS[2].tone} show={showRow[2]} />} gist="una firma de fuera · sin interés en el resultado" />
        </div>

        {/* Row 4: regulatory examination */}
        <div style={{ opacity: showRow[3], transform: `translateY(${(1 - showRow[3]) * 18}px)`, ...dimStyle(dimOf(3)) }}>
          <Row
            def={ROWS[3]}
            i={3}
            tileIn={showRow[3]}
            term={ROWS[3].term}
            meter={<Meter n={4} tone={ROWS[3].tone} show={showRow[3]} />}
            gist={
              <>
                <div>no la contratas · el alcance lo fija la ley</div>
                <div style={{ color: C.amber }}>puede sancionar</div>
              </>
            }
          />
        </div>
      </div>

      {/* The community's lift */}
      {liftIn > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: STAGE.height, opacity: liftIn }}>
          <div style={{ position: 'absolute', left: LIFT_X, top: 4 }}>
            <ImageTag />
          </div>
          {/* shaft: two rails and a floor tick at each review */}
          <svg width={120} height={STAGE.height} style={{ position: 'absolute', left: SHAFT_X, top: 0 }} fill="none" aria-hidden>
            <line x1={26} y1={ROW_TOP - 6} x2={26} y2={rowTop(3) + ROW_H + 4} stroke={alpha(C.text, 0.25)} strokeWidth={3} />
            <line x1={94} y1={ROW_TOP - 6} x2={94} y2={rowTop(3) + ROW_H + 4} stroke={alpha(C.text, 0.25)} strokeWidth={3} />
            {ROWS.map((r, i) => (
              <g key={r.term}>
                <line x1={18} y1={rowTop(i) + ROW_H / 2} x2={102} y2={rowTop(i) + ROW_H / 2} stroke={alpha(r.tone, 0.18 + 0.5 * cardIn[i])} strokeWidth={3} strokeDasharray="6 7" />
              </g>
            ))}
          </svg>
          <div style={{ position: 'absolute', left: SHAFT_X + 60 - 36, top: cabinY - 47 }}>
            <LiftCabin width={72} tone={C.sky} open={doors} glow={0.7} />
          </div>
          {LIFT_CARDS.map((c, i) => (
            <div
              key={c.a}
              style={{
                position: 'absolute',
                left: CARD_X,
                top: rowTop(i) + 12,
                width: W - CARD_X,
                height: ROW_H - 24,
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '0 12px',
                borderRadius: RADIUS.md,
                border: `2px solid ${alpha(c.tone, 0.3 + 0.55 * cardIn[i])}`,
                background: alpha(c.tone, 0.05 + 0.06 * cardIn[i]),
                fontFamily: FONT.sans,
                opacity: cardIn[i],
                transform: `translateX(${(1 - cardIn[i]) * 20}px)`,
                whiteSpace: 'nowrap',
              }}
            >
              <Icon name={c.icon} size={30} color={c.tone} strokeWidth={2} />
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: C.textStrong, lineHeight: 1.2 }}>{c.a}</div>
                {c.b ? <div style={{ fontSize: 26, fontWeight: 600, color: C.muted, lineHeight: 1.2 }}>{c.b}</div> : null}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </Stage>
  );
}
