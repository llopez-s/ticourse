import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, clamp01 } from '../../../engine/src/ui';
import { CAVEAT, ROWS, SCALE_NOTE, SHEET_TITLE } from '../data/s02-formato';
import { Pill } from './parts/Labels';
import { Stage, wordFrame } from './kit';

const S = 's02-formato';
const SHEET = { x: 144, y: 0, w: 1440, pad: 20 } as const;
const HEAD_H = 56;
const ROW_H = 72;
const SCALE_ROW_H = 140;
const ROW_GAP = 8;
const CAVEAT_TOP = 592;

/** Progress bar glyph for the «90 minutos» row (the same bar s12 spends): a track with a cyan fill. */
function BarGlyph({ p }: { p: number }) {
  return (
    <div style={{ width: 44, height: 16, borderRadius: 8, background: alpha(C.cyan, 0.2), border: `2px solid ${alpha(C.cyan, 0.7)}`, overflow: 'hidden' }}>
      <div style={{ width: `${Math.round(100 * p)}%`, height: '100%', background: C.cyan }} />
    </div>
  );
}

/** The 100–900 scale with the pass mark at 750: a track, a filled part up to 750 and a notch. */
function ScaleGauge({ draw, pulse }: { draw: number; pulse: number }) {
  const w = 520;
  const notch = ((750 - 100) / 800) * w;
  return (
    <div style={{ position: 'relative', width: w, height: 40 }}>
      <div style={{ position: 'absolute', left: 0, top: 12, width: w, height: 16, borderRadius: 8, background: alpha(C.violet, 0.2), border: `2px solid ${alpha(C.violet, 0.6)}` }} />
      <div style={{ position: 'absolute', left: 0, top: 12, width: notch * draw, height: 16, borderRadius: 8, background: alpha(C.violet, 0.75) }} />
      <div
        style={{
          position: 'absolute',
          left: notch - 3,
          top: 0,
          width: 6,
          height: 40,
          borderRadius: 3,
          background: C.textStrong,
          opacity: draw > 0.95 ? 1 : 0,
          boxShadow: `0 0 ${Math.round(8 + 16 * pulse)}px ${alpha(C.violet, 0.4 + 0.5 * pulse)}`,
        }}
      />
    </div>
  );
}

/**
 * s02-formato «Lo que te espera». The exam's data sheet, row by row on the voice: questions (`questions`), test or
 * simulations (word «test»), minutes (`minutes`), closed-book (`closed-book`), the 100–900 scale with the pass mark
 * (`scale`; «una escala, no un porcentaje» on that word). The caveat chip «datos de la lección · compruébalos en
 * comptia.org» is on screen as soon as the sheet is (muted) and lights up on `caveat`. No simulation detail, no counts.
 */
export function S02Formato(props: SceneProps) {
  const frame = useCurrentFrame();
  const sheetAt = props.cue('sheet') - 10;
  const starts = [
    props.cue('questions') - 4,
    wordFrame(S, 's02-01', 'test') - 8,
    props.cue('minutes') - 4,
    props.cue('closed-book') - 4,
    props.cue('scale') - 4,
  ];
  const noteAt = wordFrame(S, 's02-03', 'porcentaje') - 6;
  const passAt = wordFrame(S, 's02-03', 'setecientos');
  const caveatAt = props.cue('caveat') - 4;

  const sheetIn = enter(frame, sheetAt, { distance: 20, duration: 20 });
  const caveatLit = progress(frame, caveatAt, 14);
  const caveatPulse = Math.max(0, 1 - Math.abs(progress(frame, caveatAt + 8, 16, EASE.linear) * 2 - 1)) * caveatLit;
  const rowTop = (i: number) => HEAD_H + SHEET.pad + ROWS.slice(0, i).reduce((sum, _r, k) => sum + (k === 4 ? SCALE_ROW_H : ROW_H) + ROW_GAP, 0);
  const sheetH = rowTop(ROWS.length) + SHEET.pad - ROW_GAP;

  return (
    <Stage>
      <div
        style={{
          position: 'absolute',
          left: SHEET.x,
          top: SHEET.y,
          width: SHEET.w,
          height: sheetH,
          boxSizing: 'border-box',
          borderRadius: RADIUS.lg,
          border: `2px solid ${alpha(C.violet, 0.55)}`,
          background: alpha(C.ink900, 0.92),
          boxShadow: `0 0 50px ${alpha(C.violetStrong, 0.16)}`,
          fontFamily: FONT.sans,
          ...sheetIn,
        }}
      >
        <div style={{ position: 'absolute', left: SHEET.pad + 8, top: 12, display: 'flex', alignItems: 'center', gap: 14, fontSize: 32, fontWeight: 800, letterSpacing: 3, color: '#c4b5fd', textTransform: 'uppercase' }}>
          <Icon name="mortarboard" size={34} color={C.violet} />
          {SHEET_TITLE}
        </div>
        {ROWS.map((row, i) => {
          const isScale = i === 4;
          const h = isScale ? SCALE_ROW_H : ROW_H;
          const inP = progress(frame, starts[i], 16);
          const next = starts[i + 1];
          const emph = inP * (next === undefined ? 1 : 1 - progress(frame, next - 2, 12, EASE.inOut));
          return (
            <div
              key={row.id}
              style={{
                position: 'absolute',
                left: SHEET.pad,
                right: SHEET.pad,
                top: rowTop(i),
                height: h,
                boxSizing: 'border-box',
                borderRadius: RADIUS.md,
                border: `2px solid ${alpha(C.cyan, 0.1 + 0.1 * (1 - inP) + 0.6 * emph)}`,
                background: alpha(C.cyan, 0.02 + 0.12 * inP * (0.4 + emph)),
                boxShadow: emph > 0.02 ? `0 0 ${Math.round(26 * emph)}px ${alpha(C.cyan, 0.22 * emph)}` : undefined,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: isScale ? 'flex-start' : 'center',
                  gap: 24,
                  width: '100%',
                  height: '100%',
                  boxSizing: 'border-box',
                  padding: isScale ? '14px 28px' : '0 28px',
                  opacity: inP * (0.78 + 0.22 * emph),
                  transform: `translateY(${(1 - inP) * 18}px)`,
                }}
              >
              <div style={{ width: 52, height: isScale ? 56 : 52, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {row.icon === 'bar' ? <BarGlyph p={clamp01((frame - starts[i]) / 40)} /> : <Icon name={row.icon} size={46} color={C.cyan} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 46, fontWeight: 800, lineHeight: '56px', color: C.textStrong, whiteSpace: 'nowrap' }}>{row.text}</div>
                {isScale ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 36, marginTop: 8 }}>
                    <ScaleGauge draw={progress(frame, starts[i] + 10, 28, EASE.inOut)} pulse={Math.max(0, 1 - Math.abs(progress(frame, passAt, 24, EASE.linear) * 2 - 1))} />
                    <span
                      style={{
                        fontSize: 38,
                        fontWeight: 750,
                        color: '#c4b5fd',
                        whiteSpace: 'nowrap',
                        opacity: progress(frame, noteAt, 12),
                        transform: `translateX(${(1 - progress(frame, noteAt, 12)) * -12}px)`,
                      }}
                    >
                      {SCALE_NOTE}
                    </span>
                  </div>
                ) : null}
              </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ position: 'absolute', left: 0, top: CAVEAT_TOP, width: '100%', display: 'flex', justifyContent: 'center', opacity: sheetIn.opacity * (0.55 + 0.45 * caveatLit) }}>
        <Pill text={CAVEAT} icon="alert" tone={C.amber} on={0.15 + 0.85 * caveatLit + 0.2 * caveatPulse} size={36} />
      </div>
    </Stage>
  );
}
