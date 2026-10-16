import type { CSSProperties } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, windowWeight } from '../../../engine/src/ui';
import { DOES_NOT, DONE, GRID_NOTE, GRID_TITLE, NOT_COPIES, PROOF, RESTORE_TITLE, SAYS, UNUSABLE } from '../data/s05-copia';
import { Umbrella } from './parts/Umbrella';
import { Stage, segment, wordFrame } from './kit';

const S = 's05-copia';
const W = STAGE.width;

/** Plain job-status green for the nightly squares: NOT the emerald «proven» accent. */
const JOB = { fg: '#22c55e', fill: '#123d24', text: '#bbf7d0' } as const;

// ---- The grid of nightly squares (an example: no dates, no times, never a strip of three).
const COLS = 5;
const ROWS = 4;
const SQ_W = 150;
const SQ_H = 70;
const GAP = 12;
const GRID_W = COLS * SQ_W + (COLS - 1) * GAP; // 798
const GRID_H = ROWS * SQ_H + (ROWS - 1) * GAP; // 316
const HEAD_H = 44;
const HEAD_GAP = 12;
const NOTE_GAP = 12;
const NOTE_H = 40;
const BLOCK_H = HEAD_H + HEAD_GAP + GRID_H + NOTE_GAP + NOTE_H; // 424
/** Grid block: centred and larger on `green`, then lower-left from `umbrella` on (clear of the intercept band). */
const POS_A = { scale: 1.25, left: (W - GRID_W * 1.25) / 2, top: (STAGE.height - BLOCK_H * 1.25) / 2 };
const POS_B = { scale: 1, left: 0, top: 232 };
/** The square whose restore fails. */
const FAIL = { r: 1, c: 3 };
const FAIL_IDX = FAIL.r * COLS + FAIL.c;

// ---- Right side: the umbrella at its entrance.
const UMB_W = 420;
const UMB_LEFT = 1300;
const UMB_TOP = 216;

// ---- s05-03 caption, between grid and umbrella (below the intercept band).
const MID_LEFT = 842;
const MID_TOP = 330;

// ---- Restore panel (top-centre, only after the intercept card has gone).
const PANEL_LEFT = 450;
const GHOST = { left: PANEL_LEFT, top: 64, scale: 1.25 };
const FILES = { left: 830, top: 54, w: 290, h: 112 };

// ---- Proof steps and the two «not copies» chips (left), after `check`.
const STEP_W = 1270;
const STEP_H = 108;
const STEP_TOP = 22;
const STEP_PITCH = 126;
const CHIP_TOP = 432;
const CHIP_PITCH = 108;
const CHIP_H = 90;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * s05-copia «La copia en verde». A grid of nightly backup squares fills in plain job-status green, every one
 * «completada», under the fixed label «ejemplo · sin fecha · no es el registro del puerto» (`green`). On `umbrella` the
 * grid moves lower-left and the folded umbrella with its «revisado» sticker stands at the entrance on the right. While
 * BLIND ARCHITECT's card owns the top-centre band (s05-02's end to s05-03's end) nothing sits there; s05-03 puts «el
 * trabajo terminó» against «¿la copia vuelve?» between the two. `restore`: one square lifts out of the grid into a
 * restore panel; `unusable`: the files turn rose, «los archivos no sirven», and it starts to pour on the folded umbrella.
 * `check`: the rain stops, the grid leaves, the umbrella opens and the three proof steps arrive on their words; the
 * umbrella turns emerald once the last step is in. `copies`: two dashed slots, filled on «snapshot» and «réplica».
 * s05-07 brings the steps and the open umbrella back to full light for a clean closing frame.
 */
export function S05Copia(props: SceneProps) {
  const frame = useCurrentFrame();
  const greenAt = props.cue('green');
  const umbrellaAt = props.cue('umbrella');
  const restoreAt = props.cue('restore');
  const unusableAt = props.cue('unusable');
  const checkAt = props.cue('check');
  const copiesAt = props.cue('copies');
  const s02 = segment(props, 's05-02');
  const s03 = segment(props, 's05-03');
  const s07 = segment(props, 's05-07');
  // The intercepted card types out after s05-02 and stays until s05-03 ends.
  const interceptFrom = s02.to;
  const interceptTo = s03.to;

  // ---- Beats tied to words.
  const saysAt = wordFrame(S, 's05-03', 'verde') - 4;
  const notAt = wordFrame(S, 's05-03', 'vuelva') - 10;
  const pourAt = wordFrame(S, 's05-04', 'enteras') - 6;
  const stepAt = [
    wordFrame(S, 's05-05', 'Restauras') - 8,
    wordFrame(S, 's05-05', 'compruebas') - 8,
    wordFrame(S, 's05-05', 'cronometras') - 8,
  ];
  const chipAt = [wordFrame(S, 's05-06', 'snapshot') - 8, wordFrame(S, 's05-06', 'réplica') - 8];
  const damageAt = wordFrame(S, 's05-06', 'daño') - 6;

  // ---- Grid block: position, glow and exit.
  const moveStart = Math.min(umbrellaAt - 4, interceptFrom - 30);
  const move = progress(frame, moveStart, 24, EASE.inOut);
  const pos = {
    left: lerp(POS_A.left, POS_B.left, move),
    top: lerp(POS_A.top, POS_B.top, move),
    scale: lerp(POS_A.scale, POS_B.scale, move),
  };
  const gridOut = progress(frame, checkAt, 18, EASE.inOut);
  const gridGlow = windowWeight(frame, saysAt, restoreAt - 4, { ramp: 12, lead: 0 });

  // ---- Umbrella.
  const umbIn = progress(frame, umbrellaAt + 2, 20);
  const open = progress(frame, checkAt + 4, 34, EASE.inOut);
  const rain = progress(frame, pourAt, 16) * (1 - progress(frame, checkAt - 2, 16, EASE.inOut));
  const proven = progress(frame, stepAt[2] + 30, 20, EASE.inOut);
  const umbGlow = 0.25 * windowWeight(frame, umbrellaAt + 10, s02.to - 10, { ramp: 14, lead: 0 }) + 0.7 * proven;

  // ---- s05-03 caption.
  const midOut = progress(frame, restoreAt - 8, 12, EASE.inOut);
  const saysIn = progress(frame, saysAt, 14) * (1 - midOut);
  const notIn = progress(frame, notAt, 14) * (1 - midOut);

  // ---- Restore panel.
  const panelIn = progress(frame, Math.max(restoreAt - 2, interceptTo), 14) * (1 - progress(frame, checkAt, 16, EASE.inOut));
  const fly = progress(frame, restoreAt + 2, 24, EASE.inOut);
  const arrowP = progress(frame, restoreAt + 16, 14);
  const filesIn = progress(frame, restoreAt + 22, 12);
  const fillDur = Math.max(10, unusableAt - (restoreAt + 24));
  const fill = 0.82 * progress(frame, restoreAt + 24, fillDur, EASE.linear);
  const fail = progress(frame, unusableAt, 10);
  const failText = progress(frame, unusableAt + 4, 14);

  // ---- Proof steps and chips.
  const stepsIn = stepAt.map((at) => progress(frame, at, 16));
  const stepCheck = stepAt.map((at) => progress(frame, at + 18, 12, EASE.out));
  const stepsDim = windowWeight(frame, copiesAt, s07.from, { ramp: 14, lead: 0 });
  const slotsIn = progress(frame, copiesAt, 14);
  const chipsIn = chipAt.map((at) => progress(frame, at, 14));
  const damage = progress(frame, damageAt, 12);
  const chipsDim = progress(frame, s07.from, 16, EASE.inOut);

  // Ghost square: from its slot in the grid (at POS_B) to the restore panel.
  const slotX = POS_B.left + FAIL.c * (SQ_W + GAP);
  const slotY = POS_B.top + HEAD_H + HEAD_GAP + FAIL.r * (SQ_H + GAP);
  const ghost = {
    left: lerp(slotX, GHOST.left, fly),
    top: lerp(slotY, GHOST.top, fly),
    scale: lerp(1, GHOST.scale, fly),
  };

  return (
    <Stage>
      {/* ===== The grid of nightly squares ===== */}
      {gridOut < 0.999 ? (
        <div
          style={{
            position: 'absolute',
            left: pos.left,
            top: pos.top,
            width: GRID_W,
            height: BLOCK_H,
            transform: `scale(${pos.scale})`,
            transformOrigin: 'top left',
            opacity: 1 - gridOut,
          }}
        >
          <div style={{ position: 'absolute', left: 0, top: 0, height: HEAD_H, display: 'flex', alignItems: 'center', gap: 18, whiteSpace: 'nowrap' }}>
            <span style={{ fontFamily: FONT.sans, fontSize: 34, fontWeight: 750, color: C.text }}>{GRID_TITLE}</span>
          </div>
          <div style={{ position: 'absolute', left: 0, top: HEAD_H + HEAD_GAP, width: GRID_W, height: GRID_H }}>
            {Array.from({ length: ROWS * COLS }, (_, i) => {
              const r = Math.floor(i / COLS);
              const c = i % COLS;
              const p = progress(frame, greenAt + i * 3, 10);
              const lifted = i === FAIL_IDX && frame >= restoreAt + 2;
              return (
                <div key={i} style={{ position: 'absolute', left: c * (SQ_W + GAP), top: r * (SQ_H + GAP), width: SQ_W, height: SQ_H }}>
                  {/* the empty slot */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: RADIUS.sm,
                      border: `2px dashed ${lifted ? alpha(C.cyan, 0.7) : alpha(C.ink500, 0.8)}`,
                      background: alpha(C.ink900, 0.6),
                    }}
                  />
                  {!lifted && p > 0.01 ? <NightSquare p={p} glow={gridGlow} /> : null}
                </div>
              );
            })}
          </div>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: HEAD_H + HEAD_GAP + GRID_H + NOTE_GAP,
              height: NOTE_H,
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0 14px',
              boxSizing: 'border-box',
              borderRadius: RADIUS.sm,
              border: `2px solid ${alpha(C.ink500, 0.9)}`,
              background: alpha(C.ink900, 0.7),
              fontFamily: FONT.sans,
              fontSize: 26,
              fontWeight: 650,
              color: C.muted,
              whiteSpace: 'nowrap',
            }}
          >
            {GRID_NOTE}
          </div>
        </div>
      ) : null}

      {/* ===== s05-03: what the green says ===== */}
      {saysIn > 0.01 ? (
        <MidLine top={MID_TOP} p={saysIn} tone={JOB.fg} textColor={JOB.text} icon="check" text={SAYS} />
      ) : null}
      {notIn > 0.01 ? <MidLine top={MID_TOP + 108} p={notIn} tone={C.amber} textColor="#fde68a" glyph="?" text={DOES_NOT} /> : null}

      {/* ===== The restore panel ===== */}
      {panelIn > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: panelIn }}>
          <div style={{ position: 'absolute', left: PANEL_LEFT, top: 0, fontFamily: FONT.sans, fontSize: 34, fontWeight: 750, color: C.cyanSoft, whiteSpace: 'nowrap' }}>
            {RESTORE_TITLE}
          </div>
          {/* arrow, drawn as SVG */}
          <svg width={160} height={40} style={{ position: 'absolute', left: 660, top: 90, overflow: 'visible', opacity: arrowP > 0.05 ? 1 : 0 }}>
            <line x1={4} y1={20} x2={4 + 130 * arrowP} y2={20} stroke={fail > 0.5 ? C.rose : C.cyan} strokeWidth={6} strokeLinecap="round" />
            {arrowP > 0.9 ? (
              <path d="M120,6 L142,20 L120,34" fill="none" stroke={fail > 0.5 ? C.rose : C.cyan} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
            ) : null}
          </svg>
          {/* the restored files */}
          <div
            style={{
              position: 'absolute',
              left: FILES.left,
              top: FILES.top,
              width: FILES.w,
              height: FILES.h,
              boxSizing: 'border-box',
              borderRadius: RADIUS.md,
              border: `3px ${fail > 0.5 ? 'solid' : 'dashed'} ${fail > 0.5 ? C.rose : alpha(C.cyan, 0.8)}`,
              background: fail > 0.5 ? alpha(C.roseDeep, 0.55 * fail) : alpha(C.ink850, 0.85),
              opacity: filesIn,
            }}
          >
            {[0, 1, 2].map((k) => (
              <div key={k} style={{ position: 'absolute', left: 30 + k * 82, top: 14, width: 64, height: 64 }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 1 - fail }}>
                  <Icon name="file" size={64} color={C.cyanSoft} strokeWidth={2.2} />
                </div>
                <div style={{ position: 'absolute', inset: 0, opacity: fail }}>
                  <Icon name="file" size={64} color={C.roseSoft} strokeWidth={2.2} />
                </div>
                {fail > 0.01 ? (
                  <svg width={64} height={64} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
                    <g opacity={fail} transform={`translate(32 34) scale(${0.6 + 0.4 * fail})`}>
                      <line x1={-20} y1={-20} x2={20} y2={20} stroke={C.rose} strokeWidth={7} strokeLinecap="round" />
                      <line x1={20} y1={-20} x2={-20} y2={20} stroke={C.rose} strokeWidth={7} strokeLinecap="round" />
                    </g>
                  </svg>
                ) : null}
              </div>
            ))}
            {/* restore progress */}
            <div style={{ position: 'absolute', left: 24, right: 24, bottom: 12, height: 10, borderRadius: 5, background: alpha(C.ink600, 0.8) }}>
              <div style={{ width: `${fill * 100}%`, height: '100%', borderRadius: 5, background: fail > 0.5 ? C.rose : C.cyan }} />
            </div>
          </div>
          {/* the result */}
          {failText > 0.01 ? (
            <div
              style={{
                position: 'absolute',
                left: PANEL_LEFT,
                top: 180,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                opacity: failText,
                transform: `translateY(${(1 - failText) * 12}px)`,
                whiteSpace: 'nowrap',
              }}
            >
              <Icon name="x" size={46} color={C.rose} strokeWidth={3} />
              <span style={{ fontFamily: FONT.sans, fontSize: 48, fontWeight: 850, color: C.roseSoft }}>{UNUSABLE}</span>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ===== The square being restored (lifts out of the grid) ===== */}
      {frame >= restoreAt + 2 && panelIn > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: ghost.left,
            top: ghost.top,
            width: SQ_W,
            height: SQ_H,
            transform: `scale(${ghost.scale})`,
            transformOrigin: 'top left',
            opacity: Math.min(1, panelIn + (1 - fly)),
          }}
        >
          <NightSquare p={1} glow={0} ring={fail > 0.01 ? { color: C.rose, a: fail } : { color: C.cyan, a: 1 - fly * 0.3 }} lift={fly} />
        </div>
      ) : null}

      {/* ===== The umbrella at the entrance (cyan, then emerald once proven) ===== */}
      {umbIn > 0.01 ? (
        <div style={{ position: 'absolute', left: UMB_LEFT, top: UMB_TOP, opacity: umbIn, transform: `translateX(${(1 - umbIn) * 60}px)` }}>
          <div style={{ position: 'absolute', left: 0, top: 0, opacity: 1 - proven }}>
            <Umbrella width={UMB_W} open={open} tone="cyan" rain={rain} glow={umbGlow} />
          </div>
          {proven > 0.01 ? (
            <div style={{ position: 'absolute', left: 0, top: 0, opacity: proven }}>
              <Umbrella width={UMB_W} open={open} tone="emerald" rain={0} glow={umbGlow} />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ===== The proof, in three steps ===== */}
      {PROOF.map((step, i) =>
        stepsIn[i] > 0.01 ? (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 0,
              top: STEP_TOP + i * STEP_PITCH,
              width: STEP_W,
              height: STEP_H,
              boxSizing: 'border-box',
              borderRadius: RADIUS.md,
              border: `2px solid ${alpha(C.cyan, 0.45)}`,
              borderLeft: `8px solid ${C.cyan}`,
              background: alpha(C.ink850, 0.92),
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              padding: '0 24px',
              opacity: stepsIn[i] * (1 - 0.5 * stepsDim),
              transform: `translateX(${(1 - stepsIn[i]) * -36}px)`,
            }}
          >
            <span
              style={{
                flex: 'none',
                width: 62,
                height: 62,
                borderRadius: 31,
                display: 'grid',
                placeItems: 'center',
                border: `4px solid ${C.cyan}`,
                fontFamily: FONT.sans,
                fontSize: 36,
                fontWeight: 850,
                color: C.cyanSoft,
                lineHeight: 1,
              }}
            >
              {i + 1}
            </span>
            <span style={{ flex: 1, fontFamily: FONT.sans, fontSize: 38, fontWeight: 750, lineHeight: 1.15, color: C.textStrong }}>
              {step.lead}
              {step.tail ? <span style={{ color: C.muted, fontWeight: 600 }}>{step.tail}</span> : null}
            </span>
            <span
              style={{
                flex: 'none',
                width: 58,
                height: 58,
                borderRadius: 29,
                display: 'grid',
                placeItems: 'center',
                background: alpha(C.emeraldDeep, 0.85),
                border: `3px solid ${C.emerald}`,
                opacity: stepCheck[i],
                transform: `scale(${0.6 + 0.4 * stepCheck[i]})`,
              }}
            >
              <Icon name="check" size={34} color={C.emerald} strokeWidth={3} />
            </span>
          </div>
        ) : null,
      )}

      {/* ===== Two that do not count as copies ===== */}
      {slotsIn > 0.01
        ? NOT_COPIES.map((chip, i) => {
            const p = chipsIn[i];
            return (
              <div key={i} style={{ position: 'absolute', left: 0, top: CHIP_TOP + i * CHIP_PITCH, height: CHIP_H, opacity: 1 - 0.45 * chipsDim }}>
                {/* the dashed slot announced by «dos» */}
                {p < 0.99 ? (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: 520,
                      height: CHIP_H,
                      boxSizing: 'border-box',
                      borderRadius: RADIUS.pill,
                      border: `3px dashed ${alpha(C.amber, 0.55)}`,
                      opacity: slotsIn * (1 - p),
                    }}
                  />
                ) : null}
                {p > 0.01 ? (
                  <div
                    style={{
                      position: 'relative',
                      height: CHIP_H,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 18,
                      padding: '0 30px 0 16px',
                      boxSizing: 'border-box',
                      borderRadius: RADIUS.pill,
                      border: `3px solid ${C.amber}`,
                      background: alpha(C.amberDeep, 0.45),
                      whiteSpace: 'nowrap',
                      opacity: p,
                      transform: `translateY(${(1 - p) * 14}px)`,
                    }}
                  >
                    <span style={{ flex: 'none', width: 56, height: 56, borderRadius: 28, display: 'grid', placeItems: 'center', background: alpha(C.ink950, 0.7), border: `3px solid ${C.amber}` }}>
                      <Icon name="x" size={32} color={C.amber} strokeWidth={3} />
                    </span>
                    <span style={{ fontFamily: FONT.sans, fontSize: 34, fontWeight: 650, color: C.text, whiteSpace: 'pre' }}>
                      <span style={{ fontSize: 38, fontWeight: 850, color: i === 0 ? C.violet : '#fde68a' }}>{chip.term}</span>
                      {chip.rest}
                      {chip.damage ? (
                        <span
                          style={{
                            color: damage > 0.5 ? C.roseSoft : C.text,
                            fontWeight: 800,
                            borderRadius: 8,
                            padding: '2px 6px',
                            background: alpha(C.roseDeep, 0.8 * damage),
                            boxShadow: `inset 0 -3px 0 ${alpha(C.rose, damage)}`,
                          }}
                        >
                          {chip.damage}
                        </span>
                      ) : null}
                    </span>
                  </div>
                ) : null}
              </div>
            );
          })
        : null}
    </Stage>
  );
}

/** One night's backup: a plain green «completada» square (job status, not proof). */
function NightSquare({ p, glow, ring, lift = 0 }: { p: number; glow: number; ring?: { color: string; a: number }; lift?: number }) {
  const style: CSSProperties = {
    position: 'absolute',
    inset: 0,
    boxSizing: 'border-box',
    borderRadius: 10,
    border: `2px solid ${alpha(JOB.fg, 0.85)}`,
    background: JOB.fill,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    opacity: p,
    transform: `scale(${0.85 + 0.15 * p})`,
    boxShadow: [
      glow > 0.01 ? `0 0 ${18 * glow}px ${alpha(JOB.fg, 0.5 * glow)}` : '',
      ring && ring.a > 0.01 ? `0 0 0 ${4}px ${alpha(ring.color, ring.a)}` : '',
      lift > 0.01 ? `0 ${14 * lift}px ${26 * lift}px ${alpha('#000000', 0.5 * lift)}` : '',
    ]
      .filter(Boolean)
      .join(', ') || 'none',
  };
  return (
    <div style={style}>
      <Icon name="check" size={24} color={JOB.fg} strokeWidth={3} />
      <span style={{ fontFamily: FONT.sans, fontSize: 24, fontWeight: 700, color: JOB.text, lineHeight: 1 }}>{DONE}</span>
    </div>
  );
}

/** A line of the s05-03 caption: round badge + text. */
function MidLine({ top, p, tone, textColor, icon, glyph, text }: { top: number; p: number; tone: string; textColor: string; icon?: 'check'; glyph?: string; text: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: MID_LEFT,
        top,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        opacity: p,
        transform: `translateY(${(1 - p) * 14}px)`,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ flex: 'none', width: 60, height: 60, borderRadius: 30, display: 'grid', placeItems: 'center', border: `4px solid ${tone}`, background: alpha(C.ink950, 0.7) }}>
        {icon ? <Icon name={icon} size={34} color={tone} strokeWidth={3} /> : <span style={{ fontFamily: FONT.sans, fontSize: 38, fontWeight: 850, color: tone, lineHeight: 1 }}>{glyph}</span>}
      </span>
      <span style={{ fontFamily: FONT.sans, fontSize: 38, fontWeight: 800, color: textColor }}>{text}</span>
    </div>
  );
}
