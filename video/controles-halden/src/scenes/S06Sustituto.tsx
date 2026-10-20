import { useCurrentFrame } from 'remotion';
import { ControlTag } from './parts/ControlTag';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { MEASURE, PC_LABELS, RECIPE_CAPTION, STOLEN, TAG } from '../data/s06-sustituto';
import { Recipe } from './parts/Recipe';
import { LOGIN_PORT_Y, LOGIN_W, LoginWindow, PC_W, Pc } from './parts/s06-sustituto/bits';
import { Stage, wordFrame } from './kit';

const S = 's06-sustituto';

// ---- The case group (stage-local px while it is full size).
const LOGIN_TOP = 10;
const MEASURE_X = 700;
const MEASURE_Y = 22;
const HR_CENTERS = [830, 1040, 1250] as const;
const HR_TOP = 112;
const STAND_BOTTOM = HR_TOP + 144;
const BUS_Y = LOGIN_TOP + LOGIN_PORT_Y.measure;
const OTHER_CX = 1510;
const OTHER_TOP = 440;
const OTHER_Y = LOGIN_TOP + LOGIN_PORT_Y.other;
const BARRIER_X = 770;
const KEY_FROM = OTHER_CX - PC_W / 2 - 24;
const KEY_TO = BARRIER_X + 34;

// ---- After `same-risk` the group shrinks into the left of the stage and the tag takes the right.
const SHRINK = 0.62;
const SHRINK_Y = 70;
const TAG_X = 1110;
const TAG_Y = 24;
const TAG_W = 600;
/** The tag's own box height at TAG_W (2 boxes + gap + padding + border, see ControlTag). */
const TAG_H = Math.round(TAG_W / 420 * (2 * 118 + 12 + 2 * 18 + 6));
/** Left edge of the tag's boxes (past the punched hole, its padding and border). */
const TAG_BOX_X = TAG_X + Math.round(TAG_W / 420 * (56 + 18 + 3));
const ASIDE_Y = TAG_Y + TAG_H + 14;
const RECIPE_X = TAG_BOX_X;
const RECIPE_Y = 500;
const RECIPE_W = 180;
/** Before `instead` the window stands alone in the middle of the stage. */
const LOGIN_ALONE_X = Math.round((1728 - LOGIN_W) / 2);

/**
 * s06-sustituto «Una aplicación sin segundo factor». The old HR app's sign-in window stands bare from the first frame;
 * on `mfa` its texts come in and the «segundo factor» row is ringed; on `cannot` that row is crossed out in amber with
 * «la aplicación no lo admite · se cambiará por otra». On `instead` the measure lands: «solo se entra desde tres
 * ordenadores de RR. HH.» over three lit PCs wired to the window, and a fourth, dashed PC behind a barrier with «desde
 * cualquier otro, no». On `stolen` that fourth PC turns rose, a «contraseña robada» key travels toward the window and
 * is cut at the barrier («no entra»). On `same-risk` the case steps back into the left of the stage and the control's
 * tag fills: Technical up, Compensating down (on the word), and in s06-04 the dim aside «sola sería Preventive». On
 * `recipe` the miniature recipe without egg comes in under the tag. No exam card in this scene.
 */
export function S06Sustituto(props: SceneProps) {
  const frame = useCurrentFrame();
  const mfaAt = props.cue('mfa');
  const cannotAt = props.cue('cannot');
  const insteadAt = props.cue('instead');
  const stolenAt = props.cue('stolen');
  const riskAt = props.cue('same-risk');
  const recipeAt = props.cue('recipe');

  // ---- The window.
  const lit = progress(frame, mfaAt - 4, 16);
  const slide = progress(frame, insteadAt - 12, 22, EASE.inOut);
  const mfaFocus = progress(frame, wordFrame(S, 's06-01', 'segundo') - 6, 14);
  const cannot = progress(frame, cannotAt - 2, 14, EASE.out);

  // ---- The measure (all of it on `instead`; the «any other» half right after the first clause).
  const measureIn = progress(frame, insteadAt - 2, 14);
  const pcIn = HR_CENTERS.map((_, i) => progress(frame, insteadAt + 6 + i * 6, 14));
  const busIn = progress(frame, insteadAt + 22, 18, EASE.inOut);
  const otherIn = progress(frame, wordFrame(S, 's06-02', 'departamento') - 6, 16);

  // ---- The stolen password.
  const stolenIn = progress(frame, stolenAt - 2, 14);
  const cutAt = wordFrame(S, 's06-02', 'no');
  const travel = progress(frame, stolenAt + 12, Math.max(12, cutAt - stolenAt - 12), EASE.inOut);
  const cut = progress(frame, cutAt - 4, 12);

  // ---- The tag and the recipe.
  const shrink = progress(frame, riskAt - 8, 24, EASE.inOut);
  // The tag comes in once the case has made room; its top value lands with it, because ControlTag's
  // empty-state question is wider than its box.
  const tagIn = progress(frame, riskAt + 14, 16);
  const topAt = riskAt + 14;
  const bottomAt = wordFrame(S, 's06-03', 'compensating') - 4;
  const asideAt = wordFrame(S, 's06-04', 'preventive') - 8;
  const asideIn = progress(frame, asideAt, 16);
  const recipeIn = progress(frame, recipeAt - 2, 14);

  const scale = 1 - (1 - SHRINK) * shrink;
  const groupDim = shrink;

  const text = { fontFamily: FONT.sans, whiteSpace: 'nowrap' } as const;
  const keyX = KEY_FROM + (KEY_TO - KEY_FROM) * travel;

  return (
    <Stage>
      {/* ===== The case: window, measure, PCs ===== */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 1728,
          height: 660,
          transform: `translateY(${SHRINK_Y * shrink}px) scale(${scale})`,
          transformOrigin: 'left top',
          opacity: 1 - 0.4 * groupDim,
          filter: groupDim > 0.01 ? `saturate(${1 - 0.4 * groupDim})` : undefined,
        }}
      >
        <LoginWindow lit={lit} mfaFocus={mfaFocus * (1 - cannot)} cannot={cannot} style={{ left: LOGIN_ALONE_X * (1 - slide), top: LOGIN_TOP, opacity: 0.45 + 0.55 * lit }} />

        {/* the wiring: three drops into a bus that enters the window, and the other PC's line with its barrier */}
        <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          {busIn > 0.01 ? (
            <g stroke={C.cyan} strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.9}>
              {HR_CENTERS.map((cx) => (
                <line key={cx} x1={cx} y1={STAND_BOTTOM + 4} x2={cx} y2={STAND_BOTTOM + 4 + (BUS_Y - STAND_BOTTOM - 4) * busIn} />
              ))}
              <line x1={HR_CENTERS[2]} y1={BUS_Y} x2={HR_CENTERS[2] - (HR_CENTERS[2] - LOGIN_W) * busIn} y2={BUS_Y} />
            </g>
          ) : null}
          {otherIn > 0.01 ? (
            <g opacity={otherIn}>
              {/* beyond the barrier: never reached */}
              <line x1={LOGIN_W} y1={OTHER_Y} x2={BARRIER_X - 14} y2={OTHER_Y} stroke={alpha(C.muted, 0.35)} strokeWidth={4} strokeDasharray="10 10" />
              {/* from the other PC to the barrier */}
              <line
                x1={BARRIER_X + 14}
                y1={OTHER_Y}
                x2={OTHER_CX - PC_W / 2 - 6}
                y2={OTHER_Y}
                stroke={stolenIn > 0.01 ? alpha(C.rose, 0.4 + 0.5 * stolenIn) : alpha(C.muted, 0.6)}
                strokeWidth={4}
                strokeDasharray="10 10"
              />
              {/* the barrier */}
              <rect
                x={BARRIER_X - 9}
                y={OTHER_Y - 44}
                width={18}
                height={88}
                rx={9}
                fill={cut > 0.01 ? alpha(C.rose, 0.3 + 0.7 * cut) : alpha(C.muted, 0.55)}
                stroke={cut > 0.01 ? C.roseSoft : alpha(C.text, 0.4)}
                strokeWidth={3}
              />
            </g>
          ) : null}
        </svg>

        {/* the check where the three PCs enter */}
        {busIn > 0.95 ? (
          <div
            style={{
              position: 'absolute',
              left: LOGIN_W + 14,
              top: BUS_Y - 46,
              width: 40,
              height: 40,
              borderRadius: 20,
              display: 'grid',
              placeItems: 'center',
              background: alpha(C.emeraldDeep, 0.9),
              border: `3px solid ${C.emerald}`,
              opacity: progress(frame, insteadAt + 40, 10),
            }}
          >
            <Icon name="check" size={24} color={C.emerald} strokeWidth={3.4} />
          </div>
        ) : null}

        {/* the measure */}
        <div style={{ position: 'absolute', left: MEASURE_X, top: MEASURE_Y, width: 1028, opacity: measureIn, transform: `translateY(${(1 - measureIn) * 10}px)` }}>
          <span style={{ ...text, fontSize: 36, fontWeight: 800, color: C.textStrong }}>{MEASURE.only}</span>
        </div>

        {/* three HR PCs */}
        {HR_CENTERS.map((cx, i) => (
          <Pc key={cx} tone={C.cyan} lit={pcIn[i]} style={{ left: cx - PC_W / 2, top: HR_TOP, opacity: pcIn[i] }} />
        ))}
        <div
          style={{
            position: 'absolute',
            left: 1362,
            top: HR_TOP + 34,
            padding: '6px 18px',
            borderRadius: RADIUS.pill,
            border: `2px solid ${alpha(C.cyan, 0.6)}`,
            background: alpha(C.cyan, 0.12),
            ...text,
            fontSize: 32,
            fontWeight: 750,
            color: C.cyanSoft,
            opacity: pcIn[2],
          }}
        >
          {PC_LABELS.hr}
        </div>

        {/* «desde cualquier otro, no» and the other PC */}
        <div style={{ position: 'absolute', left: BARRIER_X + 50, top: OTHER_Y - 72, ...text, fontSize: 36, fontWeight: 750, color: C.text, opacity: otherIn }}>{MEASURE.other}</div>
        <Pc
          tone={stolenIn > 0.01 ? C.rose : C.muted}
          lit={stolenIn}
          dashed={stolenIn < 0.5}
          style={{ left: OTHER_CX - PC_W / 2, top: OTHER_TOP, opacity: otherIn * (0.6 + 0.4 * stolenIn) }}
        />
        <div
          style={{
            position: 'absolute',
            left: OTHER_CX - 160,
            width: 320,
            top: OTHER_TOP + 156,
            textAlign: 'center',
            ...text,
            fontSize: 32,
            fontWeight: 650,
            color: stolenIn > 0.01 ? C.roseSoft : C.muted,
            opacity: otherIn,
          }}
        >
          {PC_LABELS.other}
        </div>

        {/* the stolen password: a chip over the other PC, then a key that travels and is cut at the barrier */}
        {stolenIn > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: OTHER_CX - 190,
              top: OTHER_TOP - 92,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '6px 18px 6px 12px',
              borderRadius: RADIUS.pill,
              border: `2px solid ${alpha(C.rose, 0.8)}`,
              background: alpha(C.roseDeep, 0.85),
              opacity: stolenIn,
              transform: `translateY(${(1 - stolenIn) * 10}px)`,
            }}
          >
            <Icon name="key" size={34} color={C.roseSoft} strokeWidth={2.4} />
            <span style={{ ...text, fontSize: 32, fontWeight: 750, color: '#fecdd3' }}>{STOLEN.key}</span>
          </div>
        ) : null}
        {travel > 0.01 && cut < 0.99 ? (
          <div
            style={{
              position: 'absolute',
              left: keyX - 26,
              top: OTHER_Y - 26,
              width: 52,
              height: 52,
              borderRadius: 26,
              display: 'grid',
              placeItems: 'center',
              background: alpha(C.roseDeep, 0.95),
              border: `3px solid ${C.rose}`,
              opacity: 1 - cut,
            }}
          >
            <Icon name="key" size={30} color={C.roseSoft} strokeWidth={2.4} />
          </div>
        ) : null}
        {cut > 0.01 ? (
          <>
            <div
              style={{
                position: 'absolute',
                left: BARRIER_X + 22,
                top: OTHER_Y - 26,
                width: 52,
                height: 52,
                borderRadius: 26,
                display: 'grid',
                placeItems: 'center',
                background: alpha(C.roseDeep, 0.95),
                border: `3px solid ${C.rose}`,
                opacity: cut,
                transform: `scale(${0.7 + 0.3 * cut})`,
              }}
            >
              <Icon name="x" size={30} color={C.rose} strokeWidth={3.6} />
            </div>
            <div style={{ position: 'absolute', left: BARRIER_X - 60, top: OTHER_Y + 54, ...text, fontSize: 36, fontWeight: 800, color: C.roseSoft, opacity: cut }}>{STOLEN.cut}</div>
          </>
        ) : null}
      </div>

      {/* ===== The control's tag ===== */}
      {tagIn > 0.01 ? (
        <div style={{ position: 'absolute', left: TAG_X, top: TAG_Y, opacity: tagIn, transform: `translateX(${(1 - tagIn) * 30}px)` }}>
          <ControlTag frame={frame} width={TAG_W} hole={false} top={TAG.top} topAt={topAt} bottom={TAG.bottom} bottomAt={bottomAt} />
        </div>
      ) : null}
      {/* the dim aside, under the type box (ControlTag's inline aside has no room beside «Compensating») */}
      {asideIn > 0.01 ? (
        <div style={{ position: 'absolute', left: TAG_BOX_X + 4, top: ASIDE_Y, ...text, fontSize: 32, fontWeight: 650, color: C.faint, opacity: 0.95 * asideIn, transform: `translateY(${(1 - asideIn) * -8}px)` }}>
          {TAG.aside}
        </div>
      ) : null}

      {/* ===== The recipe without egg, in miniature ===== */}
      {recipeIn > 0.01 ? (
        <>
          <div style={{ position: 'absolute', left: RECIPE_X, top: RECIPE_Y, opacity: recipeIn }}>
            <Recipe width={RECIPE_W} egg="missing" substitute frame={frame} at={recipeAt} />
          </div>
          <div style={{ position: 'absolute', left: RECIPE_X + RECIPE_W + 30, top: RECIPE_Y + 34, width: 200, fontFamily: FONT.sans, fontSize: 34, fontWeight: 700, lineHeight: '42px', color: C.text, opacity: recipeIn }}>
            {RECIPE_CAPTION}
          </div>
        </>
      ) : null}
    </Stage>
  );
}
