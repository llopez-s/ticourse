import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, mix } from '../../../engine/src/ui';
import type { BlockId } from '../data/flash';
import { FlashSheet, camOn, mixCam } from './parts/FlashSheet';
import { ArrowInline, PageIcon } from './parts/Icons';
import { CAM_UNK, CLIP_TOP_MSG } from './S04Flash';
import { Stage, wordFrame } from './kit';

const S = 's05-plazo';
const W = STAGE.width;

// Camera: where s04 left the page → the ACTIONS block (big) → the NEXT UPDATE line (top strip).
const CAM_ACTIONS = camOn([16, 19], 1.22, 396);
const CAM_NEXT = camOn(21, 1.2, 196);
// The ruler.
const RULER = { x0: 150, x1: W - 150, y: 508 } as const;
const T_ISSUED = 11 * 60 + 40;
const T_NEXT = 17 * 60;
const T_DEADLINE = 18 * 60;
const rulerX = (t: number) => RULER.x0 + ((t - T_ISSUED) / (T_DEADLINE - T_ISSUED)) * (RULER.x1 - RULER.x0);

/**
 * s05-plazo «Acciones con hora». The camera continues from s04 (the amber block) down the page.
 *   actions   it settles on ACTIONS REQUESTED (by 18:00 UTC) and a deadline bar, «hasta 18:00 UTC»,
 *             crosses the width.
 *   block / reset / clicks   the three lines light one by one (sounds: block, lock), the earlier ones
 *             stepping back. Nothing is added: no action, no recipient.
 *   next      the camera drops to the NEXT UPDATE line (kept lit) and, under it, the ruler with
 *             three fixed marks: 11:40 UTC · emitido, 17:00 UTC · próximo parte, 18:00 UTC · plazo.
 *   silence   the page and the ruler leave; two boxes: «hay parte previsto: sin noticias = sin
 *             cambios» (green) against «no hay parte previsto: ¿alguien está mirando?» (amber,
 *             struck through).
 *   (last)    a small note, «atribución fina · narrativa · ACH → informe de campaña», slides toward
 *             the report icon. No result of any action and nothing of what the 17:00 update said.
 */
export function S05Plazo(props: SceneProps) {
  const frame = useCurrentFrame();
  const actions = props.cue('actions');
  const block = props.cue('block');
  const reset = props.cue('reset');
  const clicks = props.cue('clicks');
  const next = props.cue('next');
  const silence = props.cue('silence');
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  // ---- Camera.
  const toActions = progress(frame, actions - 8, 34, EASE.inOut);
  const toNext = progress(frame, next - 16, 30, EASE.inOut);
  let cam = mixCam(CAM_UNK, CAM_ACTIONS, toActions);
  cam = mixCam(cam, CAM_NEXT, toNext);
  const clipTop = mix(mix(CLIP_TOP_MSG, 150, toActions), 100, toNext);
  const clipBottom = mix(660, 300, toNext);
  const sheetOut = progress(frame, silence - 18, 16, EASE.inOut);

  // ---- What is lit.
  const lit: Partial<Record<BlockId, number>> = {
    unknown: 1 - toActions,
    actions: progress(frame, actions - 4, 14) * (1 - 0.5 * toNext),
    next: progress(frame, next - 6, 14),
    contact: 0,
    head: 0,
    bluf: 0,
    know: 0,
  };
  const bands: Partial<Record<BlockId, number>> = {
    unknown: 1 - toActions,
    actions: progress(frame, actions - 2, 16) * (1 - toNext),
    next: progress(frame, next - 4, 16),
  };
  const step = (at: number, nextAt: number) => progress(frame, at - 4, 10) * (1 - 0.6 * progress(frame, nextAt - 4, 12));
  const lineHl: Record<number, number> = {
    14: 1 - toActions,
    17: step(block, reset),
    18: step(reset, clicks),
    19: progress(frame, clicks - 4, 10) * (1 - 0.6 * toNext),
    21: progress(frame, next - 4, 12),
  };

  // ---- Deadline bar.
  const barAt = actions + 6;
  const bar = progress(frame, barAt, 24, EASE.inOut);
  const barOut = progress(frame, next - 10, 14, EASE.inOut);
  const seis = progress(frame, w('s05-01', 'seis') - 8, 12);

  // ---- Ruler.
  const rulerIn = progress(frame, next - 6, 18) * (1 - sheetOut);
  const cinco = w('s05-05', 'cinco') - 10;
  const markIssued = progress(frame, next, 14);
  const markDeadline = progress(frame, next + 8, 14);
  const markNext = progress(frame, cinco, 14);
  const drawAxis = progress(frame, next - 4, 26, EASE.inOut);

  // ---- Silence: two boxes.
  const boxIn = progress(frame, silence - 10, 18);
  const boxesOut = progress(frame, w('s05-07', 'atribución') - 26, 16, EASE.inOut);
  const strikeAt = w('s05-06', 'deja') - 4;
  const greenAt = w('s05-06', 'noticias') - 8;
  const strike = progress(frame, strikeAt, 22, EASE.inOut);
  const green = progress(frame, greenAt, 14);

  // ---- The note that goes to the report.
  const noteAt = w('s05-07', 'atribución') - 8;
  const noteIn = progress(frame, noteAt, 16);
  const slide = progress(frame, w('s05-07', 'informe') - 10, 40, EASE.inOut);

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      <FlashSheet cam={cam} lit={lit} bands={bands} lineHl={lineHl} clipTop={clipTop} clipBottom={clipBottom} fade={24} opacity={1 - sheetOut} />

      {/* The deadline bar across the width */}
      {bar > 0 && barOut < 1 ? (
        <div style={{ position: 'absolute', left: 0, top: 14, width: W, height: 64, opacity: 1 - barOut }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: W * bar, height: 64, overflow: 'hidden', borderRadius: RADIUS.md, border: `3px solid ${alpha(C.amber, 0.85)}`, background: `linear-gradient(90deg, ${alpha(C.amber, 0.08)} 0%, ${alpha(C.amber, 0.3)} 100%)`, boxSizing: 'border-box' }}>
            <div style={{ position: 'absolute', right: 28, top: 0, height: 58, display: 'flex', alignItems: 'center', gap: 14, fontSize: 40, fontWeight: 850, color: C.amber, whiteSpace: 'nowrap', opacity: seis }}>
              <Icon name="clock" size={40} color={C.amber} />
              hasta 18:00 UTC
            </div>
          </div>
        </div>
      ) : null}

      {/* The ruler: three fixed marks */}
      {rulerIn > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: rulerIn }}>
          <svg width={W} height={660} viewBox={`0 0 ${W} 660`} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
            <line x1={RULER.x0} y1={RULER.y} x2={RULER.x0 + (RULER.x1 - RULER.x0) * drawAxis} y2={RULER.y} stroke={C.ink600} strokeWidth={8} strokeLinecap="round" />
            {[
              { x: rulerX(T_ISSUED), a: markIssued, c: C.cyan },
              { x: rulerX(T_NEXT), a: markNext, c: C.emerald },
              { x: rulerX(T_DEADLINE), a: markDeadline, c: C.amber },
            ].map((m, i) => (
              <circle key={i} cx={m.x} cy={RULER.y} r={16} fill={C.ink950} stroke={m.c} strokeWidth={6} opacity={m.a} />
            ))}
          </svg>
          <Mark x={rulerX(T_ISSUED)} y={RULER.y} up align="left" a={markIssued} tone={C.cyan} time="11:40 UTC" label="emitido" />
          <Mark x={rulerX(T_NEXT)} y={RULER.y} up={false} align="right" a={markNext} tone={C.emerald} time="17:00 UTC" label="próximo parte" />
          <Mark x={rulerX(T_DEADLINE)} y={RULER.y} up align="right" a={markDeadline} tone={C.amber} time="18:00 UTC" label="plazo" />
        </div>
      ) : null}

      {/* Silence: with a stated update, or without */}
      {boxIn > 0 && boxesOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: boxIn * (1 - boxesOut) }}>
          <Box x={868} y={150} tone={C.amber} icon="eye" lines={['no hay parte previsto:', '¿alguien está mirando?']} strike={strike} at={w('s05-06', 'silencio') - 8} frame={frame} />
          <Box x={40} y={150} tone={C.emerald} icon="check" lines={['hay parte previsto:', 'sin noticias = sin cambios']} strike={0} at={greenAt} lit={green} frame={frame} />
        </div>
      ) : null}

      {/* The note that slides to the report */}
      {noteIn > 0 ? (
        <>
          <div style={{ position: 'absolute', left: 1346, top: 340, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, opacity: noteIn }}>
            <div style={{ position: 'relative', filter: `drop-shadow(0 0 ${Math.round(26 * slide)}px ${alpha(C.sky, 0.6 * slide)})` }}>
              <PageIcon w={150} lines={8} tone={C.sky} stack={3} />
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, color: C.sky, whiteSpace: 'nowrap' }}>informe de campaña</div>
          </div>
          <div style={{ position: 'absolute', left: mix(110, 760, slide), top: 396, opacity: noteIn * (1 - 0.35 * slide), transform: `scale(${1 - 0.12 * slide})`, transformOrigin: '0 50%' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16, padding: '10px 28px 12px', borderRadius: RADIUS.pill, border: `2px solid ${alpha(C.cyan, 0.8)}`, background: alpha(C.ink900, 0.96), fontSize: 38, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap', boxShadow: `0 0 28px ${alpha(C.cyan, 0.2)}` }}>
              atribución fina · narrativa · ACH
              <ArrowInline size={40} color={C.sky} />
            </div>
          </div>
        </>
      ) : null}
    </Stage>
  );
}

/** A ruler mark: time over a short description, above or below the axis. */
function Mark({ x, y, up, align, a, tone, time, label }: { x: number; y: number; up: boolean; align: 'left' | 'right'; a: number; tone: string; time: string; label: string }) {
  return (
    <div style={{ position: 'absolute', left: align === 'left' ? x - 16 : undefined, right: align === 'right' ? W - x - 16 : undefined, top: up ? y - 112 : y + 34, textAlign: align, opacity: a, transform: `translateY(${(1 - a) * (up ? 10 : -10)}px)`, whiteSpace: 'nowrap' }}>
      <div style={{ fontSize: 46, fontWeight: 850, color: tone, lineHeight: 1.05 }}>{time}</div>
      <div style={{ fontSize: 36, fontWeight: 700, color: C.text, lineHeight: 1.15 }}>{label}</div>
    </div>
  );
}

/** A silence box: an icon and two lines; the amber one is struck through, the green one lights. */
function Box({ x, y, tone, icon, lines, strike, at, lit = 0, frame }: { x: number; y: number; tone: string; icon: 'eye' | 'check'; lines: [string, string]; strike: number; at: number; lit?: number; frame: number }) {
  const e = enter(frame, at, { distance: 24, duration: 18 });
  const k = tone === C.emerald ? 0.35 + 0.65 * lit : 1 - 0.45 * strike;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: 820, height: 290, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 30, padding: '0 40px', borderRadius: RADIUS.lg, border: `3px solid ${alpha(tone, 0.4 + 0.5 * k)}`, background: `linear-gradient(180deg, ${alpha(tone, 0.06 + 0.1 * k)} 0%, ${alpha(C.ink900, 0.97)} 80%)`, boxShadow: tone === C.emerald && lit > 0.05 ? `0 0 ${Math.round(36 * lit)}px ${alpha(tone, 0.25 * lit)}` : undefined, ...e, opacity: e.opacity * (0.55 + 0.45 * k) }}>
      <div style={{ width: 100, height: 100, borderRadius: 50, display: 'grid', placeItems: 'center', flexShrink: 0, background: alpha(tone, 0.14), border: `4px solid ${alpha(tone, 0.8)}` }}>
        <Icon name={icon} size={58} color={tone} strokeWidth={2.2} />
      </div>
      <div style={{ position: 'relative', fontSize: 40, fontWeight: 800, color: C.textStrong, lineHeight: 1.2 }}>
        {lines.map((l, i) => (
          <div key={l} style={{ position: 'relative', display: 'table', fontSize: i === 0 ? 36 : 46, fontWeight: i === 0 ? 700 : 850, color: i === 0 ? (tone === C.emerald ? '#6ee7b7' : '#fcd34d') : undefined }}>
            {l}
            {strike > 0 ? <div style={{ position: 'absolute', left: -8, top: '54%', width: `calc(${strike * 100}% + 16px)`, height: 5, borderRadius: 3, background: C.amber, boxShadow: `0 0 12px ${alpha(C.amber, 0.6)}` }} /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
