import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, dimStyle, tone as toneOf } from '../../../engine/src/ui';
import { DOC, READS, ROWS, RULE_Q, type RowDef } from '../data/s02-entra';
import { DocSheet, fitSize } from './parts/Bits';
import { Stage, segment } from './kit';

const W = STAGE.width;

/** Phase A geometry (stage-local). */
const DOC_BOX = { x: 120, y: 40, w: 500 };
const ASK = { x: 760, y: 70 };
const EAR = { x: 1180, y: 330 };
const MODEL = { cx: 1420, cy: 330, r: 110 };

/** Phase B: the table. */
const ROW = { top: 30, pitch: 150, h: 128 };
const Q_TOP = 492;
const Q_H = 120;

/**
 * s02-entra «Por dónde entra la orden». Phase A: `doc` — the third party's
 * document and the person's request (a chip, her words are not shown);
 * `hidden` — the tiny padlocked bar appears and flashes rose with the error
 * sound (never legible); `reads` — both the request and the hidden bar flow
 * into the model's single «ear»: for the model, everything is text. Phase B:
 * the table fills row by row — `indirect`, `jailbreak`, then the question
 * «¿quién ataca y por dónde entra?» (`rule`); `card1` settles it on the
 * indirect row (the exam card shows in the chrome); `poison` fills the third
 * row.
 */
export function S02Entra(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const doc = props.cue('doc');
  const hidden = props.cue('hidden');
  const reads = props.cue('reads');
  const indirect = props.cue('indirect');
  const jailbreak = props.cue('jailbreak');
  const rule = props.cue('rule');
  const card1 = props.cue('card1');
  const poison = props.cue('poison');
  const readsEnd = segment(props, 's02-03').to;

  // ---- Phase A
  const docIn = springIn(frame, fps, doc - 4, { damping: 16 });
  const askIn = enter(frame, doc + 20, { distance: 18, axis: 'x' });
  const hid = progress(frame, hidden - 2, 10);
  // the sfx («error») fires on the cue: the alarm lands on it
  const alarm = progress(frame, hidden, 6) * (0.7 + 0.3 * pulse(frame, fps, 0.7));
  const modelIn = springIn(frame, fps, reads - 4, { damping: 15 });
  const flow = progress(frame, reads + 4, 26, EASE.inOut);
  const caption = enter(frame, reads + 30, { distance: 14 });
  const aOut = progress(frame, Math.min(indirect, readsEnd) - 10, 14, EASE.inOut);

  // ---- Phase B
  const rowAt = [indirect, jailbreak, poison];
  const settle = progress(frame, card1 - 2, 14);
  const unsettle = progress(frame, poison - 6, 14);
  const focusIndirect = settle * (1 - unsettle);

  return (
    <Stage>
      {aOut < 1 && docIn > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - aOut, transform: `translateY(${-aOut * 20}px)` }}>
          {/* the document */}
          <div style={{ position: 'absolute', left: DOC_BOX.x, top: DOC_BOX.y, opacity: Math.min(1, docIn * 1.3), transform: `translateY(${(1 - Math.min(1, docIn)) * 26}px) rotate(${-2 + 2 * Math.min(1, docIn)}deg)` }}>
            <DocSheet width={DOC_BOX.w} title={DOC.title} hidden={hid} alarm={alarm} label={DOC.hiddenLabel} />
          </div>

          {/* the person's request: a chip, not her words */}
          <div style={{ position: 'absolute', left: ASK.x, top: ASK.y, ...askIn }}>
            <Chip accent="cyan" icon="user" size={40}>
              {READS.request}: {DOC.ask}
            </Chip>
          </div>

          {/* both streams into the same «ear» */}
          <svg width={W} height={STAGE.height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            {flow > 0.001 ? (
              <>
                <path d={`M ${ASK.x + 150} ${ASK.y + 70} C ${ASK.x + 200} ${EAR.y - 120}, ${EAR.x - 150} ${EAR.y}, ${EAR.x} ${EAR.y}`} fill="none" stroke={alpha(C.cyan, 0.85)} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - flow} />
                <path d={`M ${DOC_BOX.x + DOC_BOX.w} ${DOC_BOX.y + 300} C ${DOC_BOX.x + DOC_BOX.w + 250} ${DOC_BOX.y + 320}, ${EAR.x - 200} ${EAR.y}, ${EAR.x} ${EAR.y}`} fill="none" stroke={alpha(C.rose, 0.85)} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - flow} />
                <line x1={EAR.x} y1={EAR.y} x2={EAR.x + (MODEL.cx - MODEL.r - EAR.x) * progress(flow, 0.8, 0.2)} y2={EAR.y} stroke={C.textStrong} strokeWidth={8} strokeLinecap="round" />
              </>
            ) : null}
          </svg>

          {/* the model: one ear */}
          {modelIn > 0.001 ? (
            <div style={{ position: 'absolute', left: MODEL.cx - MODEL.r, top: MODEL.cy - MODEL.r, width: MODEL.r * 2, height: MODEL.r * 2, opacity: Math.min(1, modelIn * 1.3), transform: `scale(${0.7 + 0.3 * Math.min(1, modelIn)})` }}>
              <div style={{ width: '100%', height: '100%', borderRadius: MODEL.r, display: 'grid', placeItems: 'center', background: alpha(C.cyan, 0.12), border: `3px solid ${alpha(C.cyan, 0.8)}`, boxShadow: `0 0 ${Math.round(30 * flow)}px ${alpha(C.cyan, 0.35 * flow)}` }}>
                <Icon name="brain" size={110} color={C.cyan} strokeWidth={1.6} />
              </div>
              <div style={{ position: 'absolute', left: -100, top: MODEL.r * 2 + 14, width: MODEL.r * 2 + 200, textAlign: 'center', fontFamily: FONT.sans, fontSize: 40, fontWeight: 800, color: C.textStrong }}>{READS.model}</div>
            </div>
          ) : null}
          {frame >= reads + 26 ? (
            <div style={{ position: 'absolute', left: 760, top: 560, width: 940, textAlign: 'center', fontFamily: FONT.sans, fontSize: 46, fontWeight: 800, color: C.cyanSoft, whiteSpace: 'nowrap', ...caption }}>
              {READS.caption}
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Phase B: who attacks and where it comes in */}
      {frame >= indirect - 12
        ? ROWS.map((r, i) => (
            <TableRow
              key={r.term}
              frame={frame}
              fps={fps}
              row={r}
              top={ROW.top + i * ROW.pitch}
              slotAt={indirect - 6 + i * 4}
              at={rowAt[i]}
              hot={i === 0 ? focusIndirect : 0}
              dim={i === 0 ? 0 : 0.5 * focusIndirect}
            />
          ))
        : null}

      {frame >= rule - 6 ? <Question frame={frame} fps={fps} at={rule} settle={focusIndirect} /> : null}
    </Stage>
  );
}

function TableRow({ frame, fps, row, top, slotAt, at, hot, dim }: { frame: number; fps: number; row: RowDef; top: number; slotAt: number; at: number; hot: number; dim: number }) {
  const t = toneOf(row.tone);
  const slot = progress(frame, slotAt, 12);
  const p = springIn(frame, fps, at - 4, { damping: 16 });
  const lit = Math.min(1, p * 1.3);
  const glow = Math.max(progress(frame, at, 10) * (1 - progress(frame, at + 40, 20)), hot);
  return (
    <>
      {lit < 1 ? (
        <div style={{ position: 'absolute', left: 0, top, width: W, height: ROW.h, boxSizing: 'border-box', borderRadius: RADIUS.lg, border: `2px dashed ${C.ink600}`, opacity: slot * (1 - lit) }} />
      ) : null}
      {lit > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top,
            width: W,
            height: ROW.h,
            boxSizing: 'border-box',
            borderRadius: RADIUS.lg,
            border: `${glow > 0.3 ? 3 : 2}px solid ${alpha(t.fg, 0.35 + 0.55 * glow)}`,
            background: `linear-gradient(90deg, ${alpha(t.fg, 0.08 + 0.08 * glow)} 0%, ${alpha(C.ink900, 0.95)} 45%)`,
            boxShadow: glow > 0.02 ? `0 0 ${Math.round(36 * glow)}px ${alpha(t.fg, 0.28 * glow)}` : undefined,
            fontFamily: FONT.sans,
            whiteSpace: 'nowrap',
            ...dimStyle(dim, lit),
            transform: `translateY(${(1 - p) * 20}px) scale(${1 + 0.015 * hot})`,
          }}
        >
          <div style={{ position: 'absolute', left: 28, top: ROW.h / 2 - 40, width: 80, height: 80, borderRadius: 40, display: 'grid', placeItems: 'center', background: alpha(t.fg, 0.16), border: `3px solid ${alpha(t.fg, 0.8)}` }}>
            <Icon name={row.icon} size={44} color={t.fg} strokeWidth={2.2} />
          </div>
          <div style={{ position: 'absolute', left: 140, top: 0, height: ROW.h, display: 'flex', alignItems: 'center', fontSize: 56, fontWeight: 850, letterSpacing: -0.8, color: t.soft }}>{row.term}</div>
          <div style={{ position: 'absolute', left: 560, top: 0, height: ROW.h, display: 'flex', alignItems: 'center', gap: 22, fontSize: fitSize(row.where, 48, W - 560 - 110), fontWeight: 750, color: C.textStrong }}>
            <span style={{ color: C.faint }}>·</span>
            {row.where}
          </div>
        </div>
      ) : null}
    </>
  );
}

function Question({ frame, fps, at, settle }: { frame: number; fps: number; at: number; settle: number }) {
  const p = springIn(frame, fps, at - 4, { damping: 15 });
  return (
    <div
      style={{
        position: 'absolute',
        left: (W - 1100) / 2,
        top: Q_TOP,
        width: 1100,
        height: Q_H,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(C.cyan, 0.5 + 0.4 * settle)}`,
        background: alpha(C.ink850, 0.96),
        boxShadow: `0 0 ${Math.round(20 + 24 * settle)}px ${alpha(C.cyan, 0.2 + 0.2 * settle)}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 22,
        fontFamily: FONT.sans,
        fontSize: 56,
        fontWeight: 850,
        letterSpacing: -0.8,
        color: C.textStrong,
        whiteSpace: 'nowrap',
        opacity: Math.min(1, p * 1.3),
        transform: `translateY(${(1 - Math.min(1, p)) * 22}px)`,
      }}
    >
      <Icon name="search" size={56} color={C.cyan} strokeWidth={2.2} />
      {RULE_Q}
    </div>
  );
}
