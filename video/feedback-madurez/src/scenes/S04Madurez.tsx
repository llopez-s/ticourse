import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, mix } from '../../../engine/src/ui';
import { S04_CMF, S04_MEASURE, S04_NO_BUY, S04_STAGE_TEXT } from '../data/s04-madurez';
import { STAGES_LABEL } from '../data/stages';
import { Coin } from './parts/Figures';
import { ART_H, IntegratedArt, ReactiveArt, ScheduledArt } from './parts/StageArt';
import { STAGE_BAR_H, STAGE_BAR_REST, STAGE_W, STAGE_X, StageBar } from './parts/StageBar';
import { Stage, wordFrame } from './kit';

const S = 's04-madurez';
const W = STAGE.width;

/** The bar sits under the intercepted message (which owns y 0–200 until the end of s04-01). */
const S04_BAR_TOP = STAGE_BAR_REST;
const ART_TOP = S04_BAR_TOP + STAGE_BAR_H + 22;
const TEXT_TOP = ART_TOP + ART_H + 8;

/**
 * s04-madurez «Cómo crece un servicio».
 *   start    a coin and a person, big, in the middle: what the message talks about.
 *   reply2   they go to the corner and are struck out for the whole scene: «no se compra».
 *   stages   the three-stage bar «Madurez típica» (ding sfx).
 *   s1       reactivo: a loose bus, breakdown notices that go out.
 *   s2       en desarrollo: three lines with a timetable; then, on «mapa», a map of districts with one gap.
 *   s3       maduro: the network wired into the city and linked to someone else's.
 *   measure  the three columns stay still; «no cuenta: analistas ni gasto» (struck) and «cuenta: decisiones...».
 */
export function S04Madurez(props: SceneProps) {
  const frame = useCurrentFrame();
  const reply2At = props.cue('reply2');
  const stagesAt = props.cue('stages');
  const stageAt = [props.cue('s1'), props.cue('s2'), props.cue('s3')] as const;
  const measureAt = props.cue('measure');
  const mapAt = wordFrame(S, 's04-03', 'mapa') - 6;
  const outAt = wordFrame(S, 's04-02', 'apagas');
  const otherAt = wordFrame(S, 's04-04', 'otros') - 4;
  const yesAt = wordFrame(S, 's04-05', 'va', 1) - 6;

  // ---- Coin and person.
  const pop = progress(frame, 0, 18);
  const move = progress(frame, reply2At, 28, EASE.inOut);
  const cross = progress(frame, reply2At + 24, 16);
  const iconSize = mix(150, 84, move);
  const coinPos = { x: mix(640, 6, move), y: mix(340, 24, move) };
  const personPos = { x: mix(940, 116, move), y: mix(340, 24, move) };
  const noLabel = progress(frame, reply2At + 30, 14);

  // ---- The bar and its three columns.
  const show = [0, 1, 2].map((i) => progress(frame, stagesAt + i * 8, 16)) as [number, number, number];
  const measure = progress(frame, measureAt, 20);
  const lit = [0, 1, 2].map((i) => {
    const next = stageAt[i + 1];
    const on = progress(frame, stageAt[i], 12) * (next === undefined ? 1 : 1 - 0.45 * progress(frame, next - 2, 14));
    return on * (1 - 0.25 * measure);
  }) as [number, number, number];
  const textFade = 1 - progress(frame, measureAt - 4, 16);
  const artDim = (i: number) => {
    const next = stageAt[i + 1];
    const behind = next === undefined ? 0 : 0.5 * progress(frame, next - 2, 14);
    return Math.min(1, behind + 0.55 * measure);
  };

  return (
    <Stage>
      {/* Spending and headcount: struck out for the whole scene */}
      {[
        { kind: 'coin' as const, pos: coinPos },
        { kind: 'people' as const, pos: personPos },
      ].map(({ kind, pos }) => (
        <div key={kind} style={{ position: 'absolute', left: pos.x, top: pos.y, width: iconSize, height: iconSize, opacity: pop }}>
          {kind === 'coin' ? <Coin size={iconSize} /> : <Icon name="users" size={iconSize} color={C.amber} strokeWidth={1.6} />}
          <svg width={iconSize} height={iconSize} viewBox="0 0 100 100" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
            <line x1="6" y1="94" x2={6 + 88 * cross} y2={94 - 88 * cross} stroke={C.rose} strokeWidth="9" strokeLinecap="round" />
          </svg>
        </div>
      ))}
      {noLabel > 0.01 ? (
        <div style={{ position: 'absolute', left: 6, top: 124, fontFamily: FONT.sans, fontSize: 40, fontWeight: 850, color: '#fda4af', whiteSpace: 'nowrap', opacity: noLabel, transform: `translateY(${(1 - noLabel) * 10}px)` }}>
          {S04_NO_BUY}
        </div>
      ) : null}

      {/* The bar */}
      {frame >= stagesAt - 4 ? (
        <div style={{ position: 'absolute', left: 0, top: S04_BAR_TOP }}>
          <StageBar show={show} lit={lit} label={STAGES_LABEL} labelOpacity={progress(frame, stagesAt, 14)} />
        </div>
      ) : null}

      {/* Column 1: reactivo */}
      {frame >= stageAt[0] - 4 ? (
        <>
          <div style={{ position: 'absolute', left: STAGE_X[0] + 22, top: ART_TOP }}>
            <ReactiveArt frame={frame} at={stageAt[0]} outAt={outAt} dim={artDim(0)} />
          </div>
          <StageText x={STAGE_X[0]} w={STAGE_W[0]} text={S04_STAGE_TEXT[0]} frame={frame} at={stageAt[0]} fade={textFade} />
        </>
      ) : null}

      {/* Column 2: en desarrollo, then the map of districts */}
      {frame >= stageAt[1] - 4 ? (
        <>
          <div style={{ position: 'absolute', left: STAGE_X[1] + 22, top: ART_TOP }}>
            <ScheduledArt frame={frame} at={stageAt[1]} mapAt={mapAt} dim={artDim(1)} />
          </div>
          <StageText x={STAGE_X[1]} w={STAGE_W[1]} text={S04_STAGE_TEXT[1]} frame={frame} at={stageAt[1]} fade={textFade} />
          {frame >= mapAt ? (
            <div style={{ position: 'absolute', left: STAGE_X[1] + 22, top: TEXT_TOP + 84, width: STAGE_W[1] - 44, ...enter(frame, mapAt + 10, { distance: 12, duration: 14 }), opacity: progress(frame, mapAt + 10, 14) * textFade }}>
              <span style={{ fontFamily: FONT.sans, fontSize: 32, fontWeight: 800, lineHeight: 1.18, color: '#a5f3fc' }}>
                {S04_CMF.label}
              </span>
            </div>
          ) : null}
        </>
      ) : null}

      {/* Column 3: maduro */}
      {frame >= stageAt[2] - 4 ? (
        <>
          <div style={{ position: 'absolute', left: STAGE_X[2] + 22, top: ART_TOP }}>
            <IntegratedArt frame={frame} at={stageAt[2]} otherAt={otherAt} dim={artDim(2)} />
          </div>
          <StageText x={STAGE_X[2]} w={STAGE_W[2]} text={S04_STAGE_TEXT[2]} frame={frame} at={stageAt[2]} fade={textFade} />
        </>
      ) : null}

      {/* What counts and what does not */}
      {frame >= measureAt - 4 ? (
        <div style={{ position: 'absolute', left: 0, top: TEXT_TOP + 6, width: W, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <MeasureLabel text={S04_MEASURE.no} icon="x" tone={C.rose} soft="#fda4af" frame={frame} at={measureAt} strike={progress(frame, measureAt + 22, 16)} />
          <MeasureLabel text={S04_MEASURE.yes} icon="check" tone={C.emerald} soft="#6ee7b7" frame={frame} at={yesAt} strike={0} />
        </div>
      ) : null}
    </Stage>
  );
}

function StageText({ x, w, text, frame, at, fade }: { x: number; w: number; text: string; frame: number; at: number; fade: number }) {
  const e = enter(frame, at + 6, { distance: 14, duration: 16 });
  return (
    <div
      style={{
        position: 'absolute',
        left: x + 22,
        top: TEXT_TOP,
        width: w - 44,
        fontFamily: FONT.sans,
        fontSize: 32,
        fontWeight: 650,
        lineHeight: 1.2,
        color: C.text,
        opacity: e.opacity * fade,
        transform: e.transform,
      }}
    >
      {text}
    </div>
  );
}

function MeasureLabel({ text, icon, tone, soft, frame, at, strike }: { text: string; icon: 'x' | 'check'; tone: string; soft: string; frame: number; at: number; strike: number }) {
  const e = enter(frame, at, { distance: 18, duration: 16 });
  return (
    <div style={{ ...e }}>
      <span
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 18,
          height: 78,
          padding: '0 36px 0 24px',
          boxSizing: 'border-box',
          borderRadius: RADIUS.pill,
          border: `3px solid ${alpha(tone, 0.85)}`,
          background: alpha(tone, 0.12),
          fontFamily: FONT.sans,
          fontSize: 44,
          fontWeight: 850,
          color: strike > 0.5 ? alpha(soft, 0.75) : C.textStrong,
          whiteSpace: 'nowrap',
        }}
      >
        <Icon name={icon} size={42} color={tone} strokeWidth={2.6} />
        <span style={{ position: 'relative' }}>
          {text}
          <span style={{ position: 'absolute', left: -6, top: '56%', height: 5, width: `${strike * 104}%`, background: alpha(C.rose, 0.95), borderRadius: 3 }} />
        </span>
      </span>
    </div>
  );
}
