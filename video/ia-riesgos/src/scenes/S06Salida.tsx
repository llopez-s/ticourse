import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, Stamp, dimStyle } from '../../../engine/src/ui';
import { FLOW, RULE, SANDBOX, SELF_REVIEW, WARNING } from '../data/s06-salida';
import { ApproveHand, GrayLines, fitSize } from './parts/Bits';
import { Stage, overlayWindow, wordFrame } from './kit';

const S = 's06-salida';
const W = STAGE.width;

/** The pipeline sits under the intercepted message's band (stage y 10–205) from the start. */
const MODEL = { cx: 220, cy: 330, r: 92 };
const SCRIPT = { x: 520, y: 210, w: 250, h: 250 };
const INTERP = { x: 1060, y: 236, w: 300, h: 190 };
const BOX = { x: 476, y: 180, w: 932, h: 312 };
const HAND = { x: 1430, y: 236, w: 298 };
const BANNER = { top: 14, h: 140 };

/**
 * s06-salida «Lo que sale del modelo». `runs`: the model's output — a script
 * of gray bars, nothing executable — goes straight into an interpreter (what
 * it may be: a script, a query, a command). `malicious` (block sound, on the
 * cue): the script turns rose and a warning «se ejecuta sin más» lights under
 * the interpreter. BORROWED VOICE's message is the engine's intercept card;
 * the answer, `self-review`, shows «el modelo revisa su script» struck out
 * with «no es una barrera». `untrusted`: the rule takes the top band. `sandbox`
 * (check sound, on the cue): a sandbox box closes round script and
 * interpreter — no credentials, no free network — and a hand approves.
 */
export function S06Salida(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const runs = props.cue('runs');
  const malicious = props.cue('malicious');
  const selfReview = props.cue('self-review');
  const untrusted = props.cue('untrusted');
  const sandbox = props.cue('sandbox');
  const produce = wordFrame(S, 's06-01', 'produce,');
  const persona = wordFrame(S, 's06-05', 'persona.');
  const ic = overlayWindow(S);

  const pipeIn = springIn(frame, fps, Math.max(0, runs - 8), { damping: 16 });
  const out1 = progress(frame, runs + 6, 18, EASE.inOut);
  const scriptIn = springIn(frame, fps, runs + 14, { damping: 15 });
  const out2 = progress(frame, runs + 26, 18, EASE.inOut);
  const interpIn = springIn(frame, fps, runs + 34, { damping: 15 });
  const kinds = enter(frame, produce, { distance: 14 });
  const kindsOut = progress(frame, (ic ? ic.from : selfReview) - 8, 12);

  const safe = progress(frame, sandbox, 16, EASE.inOut);
  const alarm = progress(frame, malicious, 6) * (1 - safe);
  const warnIn = springIn(frame, fps, malicious, { damping: 14 });

  const reviewIn = springIn(frame, fps, selfReview - 2, { damping: 16 });
  const strike = progress(frame, selfReview + 16, 14, EASE.inOut);
  const reviewOut = progress(frame, untrusted - 8, 12, EASE.inOut);

  const bannerIn = springIn(frame, fps, Math.max(untrusted - 2, ic ? ic.to : 0), { damping: 16 });
  const boxDraw = progress(frame, sandbox, 22, EASE.inOut);
  const limitsAt = sandbox + 14;
  const handIn = springIn(frame, fps, persona - 12, { damping: 15 });

  const interpCol = safe > 0.5 ? C.emerald : alarm > 0.3 ? C.rose : C.cyan;

  return (
    <Stage>
      {/* the rule, in the top band once the intercepted message has gone */}
      {bannerIn > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: BANNER.top, width: W, height: BANNER.h, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 30, fontFamily: FONT.sans, fontSize: 64, fontWeight: 850, letterSpacing: -1.2, whiteSpace: 'nowrap', opacity: Math.min(1, bannerIn * 1.3) * (1 - 0.35 * safe), transform: `translateY(${(1 - Math.min(1, bannerIn)) * 18}px)` }}>
          <span style={{ color: C.cyanSoft }}>{RULE.left}</span>
          <span style={{ color: C.faint }}>=</span>
          <span style={{ color: C.amber }}>{RULE.right}</span>
        </div>
      ) : null}

      <div style={{ position: 'absolute', inset: 0, opacity: Math.min(1, pipeIn * 1.3) }}>
        {/* sandbox box */}
        {boxDraw > 0.001 ? (
          <>
            <svg width={W} height={STAGE.height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              <rect x={BOX.x} y={BOX.y} width={BOX.w} height={BOX.h} rx={28} fill={alpha(C.emerald, 0.05 * boxDraw)} stroke={C.emerald} strokeWidth={5} strokeDasharray="1 1" pathLength={1} strokeDashoffset={1 - boxDraw} style={{ filter: `drop-shadow(0 0 12px ${alpha(C.emerald, 0.45 * boxDraw)})` }} />
            </svg>
            <div style={{ position: 'absolute', left: BOX.x + 30, top: BOX.y - 24, opacity: boxDraw }}>
              <Chip accent="emerald" icon="shield" solid size={32}>
                {SANDBOX.title}
              </Chip>
            </div>
            <div style={{ position: 'absolute', left: BOX.x, top: BOX.y + BOX.h + 22, width: BOX.w, display: 'flex', justifyContent: 'center', gap: 22 }}>
              {SANDBOX.limits.map((l, k) => {
                const e = enter(frame, limitsAt + k * 10, { distance: 14 });
                return (
                  <span key={l} style={e}>
                    <Chip accent="emerald" icon={k === 0 ? 'key' : 'unplug'} size={36}>
                      {l}
                    </Chip>
                  </span>
                );
              })}
            </div>
          </>
        ) : null}

        {/* model → script → interpreter */}
        <svg width={W} height={STAGE.height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <line x1={MODEL.cx + MODEL.r + 14} y1={MODEL.cy} x2={MODEL.cx + MODEL.r + 14 + (SCRIPT.x - 20 - MODEL.cx - MODEL.r - 14) * out1} y2={MODEL.cy} stroke={alpha(C.cyan, 0.8)} strokeWidth={7} strokeLinecap="round" />
          <line x1={SCRIPT.x + SCRIPT.w + 20} y1={MODEL.cy} x2={SCRIPT.x + SCRIPT.w + 20 + (INTERP.x - 24 - SCRIPT.x - SCRIPT.w - 20) * out2} y2={MODEL.cy} stroke={alarm > 0.3 ? C.rose : alpha(C.cyan, 0.8)} strokeWidth={7} strokeLinecap="round" />
          {out2 > 0.95 ? <path d={`M ${INTERP.x - 40} ${MODEL.cy - 16} L ${INTERP.x - 22} ${MODEL.cy} L ${INTERP.x - 40} ${MODEL.cy + 16}`} fill="none" stroke={alarm > 0.3 ? C.rose : C.cyan} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" /> : null}
        </svg>

        <div style={{ position: 'absolute', left: MODEL.cx - MODEL.r, top: MODEL.cy - MODEL.r, width: MODEL.r * 2, height: MODEL.r * 2, borderRadius: MODEL.r, display: 'grid', placeItems: 'center', background: alpha(C.cyan, 0.12), border: `3px solid ${alpha(C.cyan, 0.8)}` }}>
          <Icon name="brain" size={96} color={C.cyan} strokeWidth={1.6} />
        </div>
        <div style={{ position: 'absolute', left: MODEL.cx - 150, top: MODEL.cy + MODEL.r + 14, width: 300, textAlign: 'center', fontFamily: FONT.sans, fontSize: 38, fontWeight: 800, color: C.textStrong }}>{FLOW.model}</div>

        {/* the script: gray bars, never code */}
        {scriptIn > 0.001 ? (
          <div
            style={{
              position: 'absolute',
              left: SCRIPT.x,
              top: SCRIPT.y,
              width: SCRIPT.w,
              height: SCRIPT.h,
              boxSizing: 'border-box',
              borderRadius: RADIUS.md,
              padding: '22px 24px',
              background: C.ink850,
              border: `3px solid ${alarm > 0.01 ? alpha(C.rose, 0.4 + 0.5 * alarm) : alpha(C.cyan, 0.5)}`,
              boxShadow: alarm > 0.01 ? `0 0 ${Math.round(34 * alarm)}px ${alpha(C.rose, 0.4 * alarm)}` : undefined,
              opacity: Math.min(1, scriptIn * 1.3),
              transform: `scale(${0.85 + 0.15 * Math.min(1, scriptIn)})`,
              fontFamily: FONT.sans,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 34, fontWeight: 800, color: alarm > 0.3 ? C.roseSoft : C.textStrong }}>
              <Icon name="file" size={34} color={alarm > 0.3 ? C.rose : C.cyan} />
              {FLOW.output}
            </div>
            <div style={{ marginTop: 22 }}>
              <GrayLines widths={[180, 140, 196, 120, 160]} height={14} gap={14} tone={alarm > 0.3 ? 'rose' : 'muted'} />
            </div>
          </div>
        ) : null}

        {/* the interpreter */}
        {interpIn > 0.001 ? (
          <div
            style={{
              position: 'absolute',
              left: INTERP.x,
              top: INTERP.y,
              width: INTERP.w,
              height: INTERP.h,
              boxSizing: 'border-box',
              borderRadius: RADIUS.lg,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              background: alpha(interpCol, 0.1),
              border: `3px solid ${alpha(interpCol, 0.8)}`,
              boxShadow: alarm > 0.01 ? `0 0 ${Math.round(30 * alarm * (0.7 + 0.3 * pulse(frame, fps, 0.7)))}px ${alpha(C.rose, 0.45)}` : undefined,
              opacity: Math.min(1, interpIn * 1.3),
              transform: `scale(${0.85 + 0.15 * Math.min(1, interpIn)})`,
              fontFamily: FONT.sans,
            }}
          >
            <Icon name="terminal" size={70} color={interpCol} strokeWidth={1.8} />
            <span style={{ fontSize: 38, fontWeight: 800, color: C.textStrong }}>{FLOW.interpreter}</span>
          </div>
        ) : null}

        {/* what the output may be */}
        {frame >= produce - 2 && kindsOut < 1 ? (
          <div style={{ position: 'absolute', left: 0, top: 540, width: 1000, textAlign: 'center', fontFamily: FONT.sans, fontSize: 38, fontWeight: 750, color: C.text, whiteSpace: 'nowrap', opacity: kinds.opacity * (1 - kindsOut), transform: kinds.transform }}>
            {FLOW.kinds}
          </div>
        ) : null}

        {/* the rose warning */}
        {warnIn > 0.001 && safe < 1 ? (
          <div style={{ position: 'absolute', left: INTERP.x - 40, top: INTERP.y + INTERP.h + 30, width: INTERP.w + 80, display: 'flex', justifyContent: 'center', opacity: Math.min(1, warnIn * 1.3) * (1 - safe), transform: `scale(${0.8 + 0.2 * Math.min(1, warnIn)})` }}>
            <Chip accent="rose" icon="alert" solid size={36}>
              {WARNING}
            </Chip>
          </div>
        ) : null}
      </div>

      {/* the answer to BORROWED VOICE: self-review, struck out */}
      {reviewIn > 0.001 && reviewOut < 1 ? (
        <div style={{ position: 'absolute', left: 40, top: 520, display: 'flex', alignItems: 'center', gap: 30, opacity: Math.min(1, reviewIn * 1.3) * (1 - reviewOut), transform: `translateY(${(1 - Math.min(1, reviewIn)) * 18}px)` }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 16, height: 96, padding: '0 28px', borderRadius: RADIUS.lg, border: `2px solid ${C.ink600}`, background: alpha(C.ink850, 0.96), fontFamily: FONT.sans, fontSize: 44, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap', ...dimStyle(0.4 * strike) }}>
            <Icon name="brain" size={44} color={C.muted} />
            {SELF_REVIEW.text}
            <div style={{ position: 'absolute', left: 14, top: '50%', height: 7, width: `calc((100% - 28px) * ${strike})`, borderRadius: 4, background: C.rose }} />
          </div>
          <Stamp frame={frame} at={selfReview + 26} accent="rose" rotate={-6} size={40}>
            {SELF_REVIEW.verdict}
          </Stamp>
        </div>
      ) : null}

      {/* a person approves what has effects */}
      {handIn > 0.001 ? (
        <div style={{ position: 'absolute', left: HAND.x, top: HAND.y, width: HAND.w, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, opacity: Math.min(1, handIn * 1.3), transform: `translateY(${(1 - Math.min(1, handIn)) * 20}px)` }}>
          <div style={{ width: 150, height: 150, borderRadius: 75, display: 'grid', placeItems: 'center', background: alpha(C.emerald, 0.12), border: `3px solid ${alpha(C.emerald, 0.75)}` }}>
            <ApproveHand size={92} />
          </div>
          <span style={{ fontFamily: FONT.sans, fontSize: fitSize(SANDBOX.approve, 36, HAND.w), fontWeight: 800, color: '#6ee7b7', whiteSpace: 'nowrap' }}>{SANDBOX.approve}</span>
        </div>
      ) : null}
    </Stage>
  );
}
