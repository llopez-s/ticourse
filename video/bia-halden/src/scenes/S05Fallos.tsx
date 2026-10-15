import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { dimStyle, mix } from '../../../engine/src/ui';
import { AXIS, GAP_LABEL, HEADLINE, MARK_MONTHS, MTBF_LABEL, SIDE, SWAP } from '../data/s05-fallos';
import { TECHNICIAN } from '../data/s04-medida';
import { Technician, Till } from './parts/Cafe';
import { LogConsole, SEAL_H, Seal } from './parts/s04-medida/ConsoleBits';
import { Stage, wordFrame } from './kit';

const S = 's05-fallos';
const W = STAGE.width;

// ---- Console geometry (body coordinates: the panel body is 1724 wide under a 64 px title bar).
const PANEL_H = 456;
const BODY_H = PANEL_H - 68;
const LINE_X0 = 60;
const LINE_X1 = 1664;
const LINE_Y = 206;
const PX_PER_MONTH = (LINE_X1 - LINE_X0) / 12;
const monthX = (m: number) => LINE_X0 + m * PX_PER_MONTH;
const TILL = 92;
const TILL_TOP = 78;
const CLUSTER_X = (i: number) => 120 + i * 84;
const VIOLET = '#c4b5fd';
const TAG_W = 200;
const TAG_RIGHT = 1716;

// ---- The two measures, side by side below the console.
const CARD_TOP = 478;
const CARD_H = 124;
const CARD_W = (W - 36) / 2;

/**
 * s05-fallos «Cada cuánto se cuelga». The same console, read the other way: on `four` «4 averías en 12 meses» with
 * the four dead tills; on `line` the 12-month line is drawn and the tills spread over it, three months apart; on
 * `mtbf` the gaps between marks light up and «MTBF · unos 3 meses» names them; on `side` the two measures stand
 * next to each other («cuánto tarda en volver · MTTR 80 min» / «cada cuánto falla · MTBF 3 meses»); on `swap`
 * the small «no se confunden». MTBF is a reliability measure, never a target: nothing here is a promise line.
 */
export function S05Fallos(props: SceneProps) {
  const frame = useCurrentFrame();
  const fourAt = props.cue('four');
  const lineAt = props.cue('line');
  const mtbfAt = props.cue('mtbf');
  const sideAt = props.cue('side');
  const swapAt = props.cue('swap');
  const repartidasAt = Math.max(lineAt, wordFrame(S, 's05-01', 'Repartidas') - 4);

  const panelIn = progress(frame, 0, 14);
  const headIn = enter(frame, fourAt, { distance: 16, duration: 16 });
  const lineP = progress(frame, repartidasAt, 26, EASE.inOut);
  const axisIn = progress(frame, repartidasAt + 6, 14);
  const tagIn = progress(frame, fourAt + 14, 14);
  const mtbfIn = springIn(frame, 30, mtbfAt + 2, { damping: 15 });
  const sideDim = progress(frame, sideAt - 4, 18, EASE.inOut);
  // The café tag rides beside the last till, wherever it is (cluster → its month).
  const lastTill = MARK_MONTHS.length - 1;
  const lastSlide = progress(frame, repartidasAt + 4 + lastTill * 9, 24, EASE.inOut);
  const tagX = Math.min(TAG_RIGHT - TAG_W, mix(CLUSTER_X(lastTill), monthX(MARK_MONTHS[lastTill]), lastSlide) + TILL / 2 + 12);
  const swapIn = enter(frame, swapAt, { distance: 10, duration: 14 });
  const cardIn = [springIn(frame, 30, sideAt, { damping: 15 }), springIn(frame, 30, sideAt + 14, { damping: 15 })];

  return (
    <Stage>
      {/* The same console, now with its 12-month line */}
      <div style={{ position: 'absolute', left: 0, top: 8, width: W, ...dimStyle(0.45 * sideDim, panelIn) }}>
        <LogConsole width={W} height={PANEL_H}>
          {/* headline */}
          <div style={{ position: 'absolute', left: 36, top: 8, height: 64, display: 'flex', alignItems: 'center', fontFamily: FONT.sans, fontSize: 60, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap', ...headIn }}>
            <span style={{ color: '#fda4af', marginRight: 16 }}>{HEADLINE.split(' ')[0]}</span>
            {HEADLINE.split(' ').slice(1).join(' ')}
          </div>

          {/* MTBF label */}
          {mtbfIn > 0.01 ? (
            <div
              style={{
                position: 'absolute',
                right: 36,
                top: 10,
                height: 60,
                padding: '0 22px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: RADIUS.pill,
                border: `3px solid ${alpha(C.violet, 0.9)}`,
                background: alpha(C.violetDeep, 0.7),
                fontFamily: FONT.mono,
                fontSize: 40,
                fontWeight: 850,
                color: '#ddd6fe',
                whiteSpace: 'nowrap',
                opacity: Math.min(1, mtbfIn * 1.4),
                transform: `scale(${0.9 + 0.1 * Math.min(1, mtbfIn)})`,
                transformOrigin: 'right center',
                boxShadow: `0 0 26px ${alpha(C.violet, 0.3)}`,
              }}
            >
              {MTBF_LABEL}
            </div>
          ) : null}

          {/* the 12-month line: faint ticks from the start, the line itself on `line` */}
          {Array.from({ length: 13 }).map((_, m) => (
            <div key={m} style={{ position: 'absolute', left: monthX(m) - 1.5, top: LINE_Y, width: 3, height: m % 3 === 0 ? 20 : 12, background: alpha(C.muted, 0.35 + 0.35 * lineP), opacity: progress(frame, 2 + m, 10) }} />
          ))}
          <div style={{ position: 'absolute', left: LINE_X0, top: LINE_Y - 2, width: (LINE_X1 - LINE_X0) * lineP, height: 4, borderRadius: 2, background: C.cyanSoft, boxShadow: `0 0 12px ${alpha(C.cyan, 0.45)}` }} />
          <div style={{ position: 'absolute', left: LINE_X0 - 8, top: LINE_Y + 24, fontFamily: FONT.sans, fontSize: 26, fontWeight: 600, color: C.muted, whiteSpace: 'nowrap', opacity: axisIn }}>{AXIS.start}</div>
          <div style={{ position: 'absolute', right: 1724 - LINE_X1 - 8, top: LINE_Y + 24, fontFamily: FONT.sans, fontSize: 26, fontWeight: 600, color: C.muted, whiteSpace: 'nowrap', opacity: axisIn }}>{AXIS.end}</div>
          {/* «imagen · no es del puerto»: it labels the little tills only (the café's), so it rides next to the last one */}
          <div
            style={{
              position: 'absolute',
              left: tagX,
              top: TILL_TOP + 16,
              width: TAG_W,
              boxSizing: 'border-box',
              padding: '5px 10px',
              borderRadius: RADIUS.md,
              border: `2px dashed ${alpha(C.muted, 0.7)}`,
              fontFamily: FONT.sans,
              fontSize: 22,
              fontWeight: 650,
              lineHeight: 1.2,
              color: C.muted,
              textAlign: 'center',
              opacity: tagIn,
            }}
          >
            {TECHNICIAN.tag.split(' · ').map((part, i, all) => (
              <div key={part} style={{ whiteSpace: 'nowrap' }}>
                {part}
                {i < all.length - 1 ? ' ·' : ''}
              </div>
            ))}
          </div>

          {/* the four faults: a cluster at `four`, spread over the line on `line` */}
          {MARK_MONTHS.map((m, i) => {
            const drop = springIn(frame, 30, fourAt + 4 + i * 6, { damping: 13 });
            const slide = progress(frame, repartidasAt + 4 + i * 9, 24, EASE.inOut);
            const cx = mix(CLUSTER_X(i), monthX(m), slide);
            const pin = progress(frame, repartidasAt + 4 + i * 9 + 18, 12);
            const glow = progress(frame, mtbfAt + i * 8, 12) * (1 - progress(frame, mtbfAt + 60, 20));
            return (
              <div key={m}>
                <div style={{ position: 'absolute', left: cx - TILL / 2, top: TILL_TOP + (1 - Math.min(1, drop)) * -26, opacity: Math.min(1, drop * 1.6) }}>
                  <Till size={TILL} broken={1} glow={0.7 * glow} />
                </div>
                <div style={{ position: 'absolute', left: monthX(m) - 1.5, top: TILL_TOP + TILL - 6, width: 3, height: (LINE_Y - (TILL_TOP + TILL - 6)) * pin, background: alpha(C.rose, 0.8) }} />
                <div style={{ position: 'absolute', left: monthX(m) - 12, top: LINE_Y - 12, width: 24, height: 24, borderRadius: 12, background: C.rose, border: `3px solid ${C.ink950}`, boxShadow: `0 0 14px ${alpha(C.rose, 0.6)}`, transform: `scale(${pin})` }} />
              </div>
            );
          })}

          {/* the gaps between marks: about three months each */}
          {MARK_MONTHS.slice(0, -1).map((m, i) => {
            const p = progress(frame, mtbfAt + i * 14, 16, EASE.out);
            const x0 = monthX(m) + 8;
            const x1 = monthX(MARK_MONTHS[i + 1]) - 8;
            return (
              <div key={`gap-${m}`} style={{ opacity: p > 0.001 ? 1 : 0 }}>
                <div style={{ position: 'absolute', left: x0, top: LINE_Y + 64, width: (x1 - x0) * p, height: 5, borderRadius: 3, background: C.violet, boxShadow: `0 0 12px ${alpha(C.violet, 0.5)}` }} />
                <div style={{ position: 'absolute', left: x0 - 2.5, top: LINE_Y + 52, width: 5, height: 24, borderRadius: 3, background: C.violet, opacity: Math.min(1, p * 3) }} />
                <div style={{ position: 'absolute', left: x1 - 2.5, top: LINE_Y + 52, width: 5, height: 24, borderRadius: 3, background: C.violet, opacity: p > 0.98 ? 1 : 0 }} />
                <div style={{ position: 'absolute', left: x0, width: x1 - x0, top: LINE_Y + 78, textAlign: 'center', fontFamily: FONT.sans, fontSize: 32, fontWeight: 750, color: VIOLET, whiteSpace: 'nowrap', opacity: progress(frame, mtbfAt + i * 14 + 8, 12) }}>{GAP_LABEL}</div>
              </div>
            );
          })}

          {/* the seal */}
          <div style={{ position: 'absolute', left: 28, top: BODY_H - SEAL_H - 2 }}>
            <Seal />
          </div>
        </LogConsole>
      </div>

      {/* The two measures, side by side */}
      {SIDE.map((s, i) => {
        const p = cardIn[i];
        if (p <= 0.01) return null;
        const mttr = s.key === 'mttr';
        const color = mttr ? C.cyan : C.violet;
        const soft = mttr ? C.cyanSoft : '#ddd6fe';
        return (
          <div
            key={s.key}
            style={{
              position: 'absolute',
              left: i * (CARD_W + 36),
              top: CARD_TOP,
              width: CARD_W,
              height: CARD_H,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              gap: 26,
              padding: '0 32px',
              borderRadius: RADIUS.lg,
              border: `3px solid ${alpha(color, 0.85)}`,
              background: `linear-gradient(90deg, ${alpha(mttr ? C.cyanDeep : C.violetDeep, 0.55)} 0%, ${alpha(C.ink900, 0.97)} 80%)`,
              boxShadow: `0 0 ${Math.round(30 * Math.min(1, p))}px ${alpha(color, 0.28)}`,
              opacity: Math.min(1, p * 1.4),
              transform: `translateY(${(1 - Math.min(1, p)) * 30}px)`,
              fontFamily: FONT.sans,
            }}
          >
            <div style={{ flexShrink: 0 }}>{mttr ? <Technician size={84} /> : <Till size={84} broken={1} />}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: 34, fontWeight: 700, color: C.text }}>{s.ask}</span>
              <span style={{ fontFamily: FONT.mono, fontSize: 56, fontWeight: 850, color: soft, lineHeight: 1.1 }}>{s.term}</span>
            </div>
          </div>
        );
      })}

      {/* «no se confunden», small */}
      {frame >= swapAt - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: CARD_TOP + CARD_H + 14, width: W, textAlign: 'center', fontFamily: FONT.sans, fontSize: 32, fontWeight: 650, color: C.muted, ...swapIn }}>{SWAP}</div>
      ) : null}
    </Stage>
  );
}
