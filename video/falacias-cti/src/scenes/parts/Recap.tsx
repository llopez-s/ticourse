import type { ReactNode } from 'react';
import { BrandMark } from '../../../../engine/src/overlay/ChapterRail';
import { ACCENT, C, FONT, RADIUS, STAGE, TYPE, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../../engine/src/theme/motion';
import { isElevenLabsVoice } from '../../../../engine/src/timeline/voice';
import { Chip, DIM, Icon, dimStyle } from '../../../../engine/src/ui';
import { END, NEXT } from '../../data/s06-recap';
import { TIMELINE } from '../../timeline/load';
import { Glasses } from './Glasses';
import { Magnifier } from './Marks';
import { DRAFT_BOX, DRAFT_RING, DraftSheet, PAPER, Sheet } from './Paper';
import { Arrow, Stroke, curvePoints, ellipsePoints } from './strokes';

const W = STAGE.width;

/**
 * One rule card, as a full-width row: a numbered dashed slot waits from the start; on `at` the card springs in and glows
 * until the next one lights (`lit`, `glow`), earlier cards step back (`dim`). Children are laid out inside the box (left
 * padding 96 px for the number).
 */
export function RuleRow({ index, top, height, frame, fps, slotAt, waitAt, at, dim, glow, children }: { index: number; top: number; height: number; frame: number; fps: number; slotAt: number; waitAt: number; at: number; dim: number; glow: number; children: ReactNode }) {
  const slot = progress(frame, slotAt + index * 4, 12);
  const p = springIn(frame, fps, at - 4, { damping: 16 });
  const lit = Math.min(1, p * 1.3);
  const on = glow > 0.3;
  const box = { position: 'absolute' as const, inset: 0, boxSizing: 'border-box' as const, borderRadius: RADIUS.lg };
  return (
    <div style={{ position: 'absolute', left: 0, top, width: W, height, ...dimStyle(dim), transform: `translateY(${(1 - slot) * 14}px) scale(${1 - (1 - DIM.scale) * dim * 0.5})` }}>
      {lit < 1 ? <div style={{ ...box, border: `2px dashed ${C.ink600}`, opacity: slot * (1 - lit) }} /> : null}
      {lit > 0 ? (
        <div
          style={{
            ...box,
            border: `${on ? 3 : 2}px solid ${alpha(C.cyan, 0.35 + 0.55 * glow)}`,
            background: `linear-gradient(90deg, ${alpha(C.cyan, 0.06 + 0.08 * glow)} 0%, ${alpha(C.ink900, 0.95)} 38%)`,
            boxShadow: glow > 0.02 ? `0 0 ${Math.round(40 * glow)}px ${alpha(C.cyan, 0.28 * glow)}` : `0 16px 40px ${alpha('#000000', 0.3)}`,
            opacity: lit,
          }}
        />
      ) : null}
      <div style={{ position: 'absolute', left: 20, top: (height - 54) / 2, width: 54, height: 54, boxSizing: 'border-box', borderRadius: 27, display: 'grid', placeItems: 'center', background: on ? C.cyan : alpha(C.cyan, 0.18 * lit), border: `2px solid ${lit > 0.5 ? alpha(C.cyan, 0.7) : C.ink600}`, fontFamily: FONT.sans, fontSize: 32, fontWeight: 850, color: on ? C.ink950 : lit > 0.5 ? C.cyanSoft : C.ink500, opacity: slot }}>
        {index + 1}
      </div>
      <div style={{ position: 'absolute', left: 96, right: 20, top: 0, height, opacity: Math.max(0.4 * progress(frame, waitAt + index * 5, 14), lit), transform: `translateX(${(1 - Math.min(1, p)) * 18}px)` }}>{children}</div>
    </div>
  );
}

const RING = ellipsePoints(DRAFT_RING.cx, DRAFT_RING.cy, DRAFT_RING.rx, DRAFT_RING.ry, { start: -0.55, turns: 1.08 });

/** The draft with its red ring, small: rule 1's second half and the end card's picture. */
export function RingedDraft({ scale, lit = 1 }: { scale: number; lit?: number }) {
  return (
    <div style={{ position: 'relative', width: DRAFT_BOX.w * scale, height: DRAFT_BOX.h * scale, opacity: 0.45 + 0.55 * lit }}>
      <DraftSheet scale={scale} checks={[1, 1, 1]} pill={1} q={0} crooked={1} notice={false} title={scale > 0.3} />
      <svg width={DRAFT_BOX.w * scale} height={DRAFT_BOX.h * scale} viewBox={`0 0 ${DRAFT_BOX.w} ${DRAFT_BOX.h}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
        <Stroke points={RING} p={1} width={Math.max(8, 5 / scale)} />
      </svg>
    </div>
  );
}

/** Rule 1's thumbnail: the glasses beside the sheet with the red ring. 300 x 130. */
export function GlassesAndRing({ lit = 1 }: { lit?: number }) {
  return (
    <div style={{ position: 'relative', width: 310, height: 140, opacity: 0.45 + 0.55 * lit }}>
      <div style={{ position: 'absolute', left: 0, top: 24 }}>
        <Glasses width={150} scene={false} tint={1} />
      </div>
      <div style={{ position: 'absolute', left: 178, top: 0 }}>
        <RingedDraft scale={0.27} />
      </div>
    </div>
  );
}

/** Rule 2's thumbnail: the two sentence cards, a lens on A and the ring on B. 300 x 130. */
export function TwoPhrases({ lit = 1 }: { lit?: number }) {
  const card = (letter: string, tone: string, ring: boolean) => (
    <div style={{ position: 'relative', width: 130, height: 92 }}>
      <Sheet width={130} height={92} tone={tone} style={{ borderRadius: 12 }}>
        <div style={{ position: 'absolute', left: 10, top: 10, width: 34, height: 34, borderRadius: 17, background: alpha(C.sky, 0.25), border: `2px solid ${alpha(C.sky, 0.85)}`, display: 'grid', placeItems: 'center', fontSize: 22, fontWeight: 900, color: PAPER.ink, fontFamily: FONT.sans }}>{letter}</div>
        {[0, 1].map((i) => (
          <div key={i} style={{ position: 'absolute', left: 54, top: 18 + i * 20, width: 62 - i * 14, height: 9, borderRadius: 5, background: PAPER.bar }} />
        ))}
        {[0, 1].map((i) => (
          <div key={i} style={{ position: 'absolute', left: 12, top: 56 + i * 16, width: 106 - i * 36, height: 8, borderRadius: 4, background: alpha(C.faint, 0.35) }} />
        ))}
      </Sheet>
      {ring ? (
        <svg width={150} height={112} viewBox="0 0 150 112" style={{ position: 'absolute', left: -10, top: -10, overflow: 'visible' }} aria-hidden>
          <rect x={4} y={4} width={142} height={104} rx={18} fill="none" stroke={C.rose} strokeWidth={6} />
        </svg>
      ) : null}
    </div>
  );
  return (
    <div style={{ position: 'relative', width: 310, height: 140, opacity: 0.45 + 0.55 * lit }}>
      <div style={{ position: 'absolute', left: 6, top: 26 }}>{card('A', C.sky, false)}</div>
      <div style={{ position: 'absolute', left: 172, top: 26 }}>{card('B', C.sky, true)}</div>
      <div style={{ position: 'absolute', left: 82, top: -8 }}>
        <Magnifier size={64} />
      </div>
    </div>
  );
}

/** Rule 3's thumbnail: the ring of three sources that cite each other. 300 x 130. */
export function MiniRing({ lit = 1 }: { lit?: number }) {
  const n = { a: { x: 150, y: 24 }, b: { x: 56, y: 104 }, c: { x: 244, y: 104 } };
  const node = (p: { x: number; y: number }, l: string) => (
    <g transform={`translate(${p.x} ${p.y})`}>
      <circle r={22} fill={alpha(C.sky, 0.22)} stroke={C.sky} strokeWidth={4} />
      <text y={9} textAnchor="middle" fontSize={26} fontWeight={900} fill={C.textStrong} fontFamily={FONT.sans}>
        {l}
      </text>
    </g>
  );
  return (
    <div style={{ width: 310, height: 140, opacity: 0.45 + 0.55 * lit }}>
      <svg width={310} height={140} viewBox="0 0 310 140" style={{ overflow: 'visible' }} aria-hidden>
        <Arrow points={curvePoints({ x: 72, y: 84 }, { x: 96, y: 52 }, { x: 134, y: 44 })} p={1} color={C.cyan} width={5} head={14} />
        <Arrow points={curvePoints({ x: 224, y: 104 }, { x: 150, y: 120 }, { x: 80, y: 106 })} p={1} color={C.cyan} width={5} head={14} />
        <Arrow points={curvePoints({ x: 238, y: 82 }, { x: 214, y: 52 }, { x: 172, y: 44 })} p={1} color={ACCENT.amber.fg} width={5} head={14} dashed />
        {node(n.a, 'A')}
        {node(n.b, 'B')}
        {node(n.c, 'C')}
      </svg>
    </div>
  );
}

/** The closing action: a pill centred on the stage, from `at`. */
export function NextAction({ frame, fps, at, top }: { frame: number; fps: number; at: number; top: number }) {
  if (frame < at - 6) return null;
  const p = springIn(frame, fps, at - 4, { damping: 16 });
  return (
    <div style={{ position: 'absolute', left: 0, top, width: W, display: 'flex', justifyContent: 'center', opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - Math.min(1, p)) * 18}px)` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '13px 30px 13px 28px', borderRadius: 32, background: alpha(C.cyan, 0.08), border: `3px solid ${alpha(C.cyan, 0.7)}`, boxShadow: `0 0 34px ${alpha(C.cyan, 0.22)}`, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
        <Icon name="play" size={42} color={C.cyan} strokeWidth={2} />
        <span style={{ fontSize: 46, fontWeight: 850, color: C.textStrong }}>{NEXT.text}</span>
        <Chip accent="cyan" icon="check" size={TYPE.label} solid>
          {NEXT.chip}
        </Chip>
      </div>
    </div>
  );
}

/**
 * Where the video ends: the draft with its red ring, ALERTÓPOLIS, the video's title, the next step (the lesson's questions —
 * no lab), the objective and the disclaimer. Everything is in by `at` + ~35 and nothing moves afterwards.
 */
export function EndCard({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 8) return null;
  const cardIn = springIn(frame, fps, at - 6, { damping: 18 });
  const art = enter(frame, at - 4, { distance: 20 });
  const brand = enter(frame, at - 4, { distance: 16 });
  const title = enter(frame, at - 2, { distance: 24 });
  const sub = enter(frame, at + 2, { distance: 18 });
  const cta = enter(frame, at + 6, { distance: 18 });
  const chips = enter(frame, at + 10, { distance: 18 });
  const ruleDraw = progress(frame, at + 10, 18, EASE.out);
  const disclaimer = enter(frame, at + 14, { distance: 12 });
  const sentences = END.disclaimer.split('. ');
  return (
    <div style={{ position: 'absolute', left: (W - 1600) / 2, top: 24, width: 1600, height: STAGE.height - 48, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 70, padding: '0 56px 0 70px', borderRadius: 36, background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`, border: `2px solid ${C.ink700}`, boxShadow: `0 40px 90px ${alpha('#000000', 0.45)}, inset 0 1px 0 ${alpha('#ffffff', 0.05)}`, fontFamily: FONT.sans, opacity: Math.min(1, cardIn * 1.4), transform: `scale(${0.94 + 0.06 * cardIn})`, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: 4, background: `linear-gradient(90deg, transparent 0%, ${C.cyan} 50%, transparent 100%)`, opacity: 0.8 }} />
      <div style={{ ...art, flexShrink: 0, width: 330, height: 260, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 6 }}>
          <RingedDraft scale={0.5} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...brand }}>
          <BrandMark size={34} />
          <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
        </div>
        <div style={{ marginTop: 12, fontSize: 80, fontWeight: 850, letterSpacing: -2.2, lineHeight: 1.04, whiteSpace: 'nowrap', ...title }}>
          <div style={{ color: C.textStrong }}>{END.lead}</div>
          <div style={{ color: C.cyan }}>{END.rest}</div>
        </div>
        <div style={{ marginTop: 8, fontSize: 44, fontWeight: 750, letterSpacing: -0.6, lineHeight: 1.12, color: C.text, whiteSpace: 'nowrap', ...sub }}>{END.sub}</div>
        <div style={{ marginTop: 22, display: 'inline-flex', alignItems: 'center', gap: 14, fontSize: 38, fontWeight: 800, color: C.cyanSoft, whiteSpace: 'nowrap', ...cta }}>
          <Icon name="play" size={36} color={C.cyan} strokeWidth={2} />
          {NEXT.text}
        </div>
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 16, ...chips }}>
          <Chip accent="cyan" icon="check" size={TYPE.small} solid>
            {NEXT.chip}
          </Chip>
          <Chip accent="muted" icon="mortarboard" size={TYPE.small}>
            {END.objective}
          </Chip>
        </div>
        <div style={{ marginTop: 18, width: 640 * ruleDraw, height: 2, background: C.ink700 }} />
        <div style={{ marginTop: 10, fontSize: TYPE.small, fontWeight: 550, color: C.muted, lineHeight: 1.35, whiteSpace: 'nowrap', ...disclaimer }}>
          {sentences.map((s, k) => (
            <div key={k}>{k < sentences.length - 1 ? `${s}.` : s}</div>
          ))}
          {isElevenLabsVoice(TIMELINE.voice) ? <div>Voz: ElevenLabs.</div> : null}
        </div>
      </div>
    </div>
  );
}
