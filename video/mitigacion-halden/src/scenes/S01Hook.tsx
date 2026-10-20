import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Icon, mix, type IconName } from '../../../engine/src/ui';
import { ASKS, CAUSE, HEADER, PLAQUE, PROMISE, STAMP, TECHNIQUES, TITLE } from '../data/s01-hook';
import { CHIP_H, CaseStamp, PlaqueChip, Pill } from './parts/Labels';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = STAGE.width;
// ---- The ten cards: 5 × 2.
const COLS = 5;
const CARD_W = 318;
const CARD_H = 146;
const GAP_X = (W - COLS * CARD_W) / (COLS - 1);
const GRID_TOP = 96;
const GAP_Y = 30;
// ---- After the title: left column (stamp, plate, title), right column (promise, thesis).
const STAMP_Y_MID = 250;
const PLAQUE_TOP = 96;
const TITLE_TOP = 170;
const TITLE_SIZE = 124;
const RIGHT_X = 1010;
const CHIPS_TOP = 150;
const CHIP_GAP = 26;
const CAUSE_TOP = 430;

/** One technique card: icon, name (up to two lines) and the emerald tick of «funcionan todas». */
function Card({ name, icon, tick, show }: { name: string; icon: IconName; tick: number; show: number }) {
  return (
    <div
      style={{
        position: 'relative',
        width: CARD_W,
        height: CARD_H,
        boxSizing: 'border-box',
        padding: '18px 16px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.violet, 0.35 + 0.35 * show)}`,
        background: alpha(C.ink850, 0.6 + 0.35 * show),
        opacity: 0.25 + 0.75 * show,
        fontFamily: FONT.sans,
      }}
    >
      <Icon name={icon} size={40} color={alpha(C.violet, 0.5 + 0.5 * show)} />
      <div style={{ marginTop: 8, fontSize: 32, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1.08, color: C.textStrong, opacity: show }}>{name}</div>
      {tick > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            right: 16,
            top: 14,
            width: 46,
            height: 46,
            borderRadius: 23,
            background: alpha(C.emerald, 0.18),
            border: `3px solid ${C.emerald}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${0.4 + 0.6 * Math.min(1, tick)})`,
            opacity: Math.min(1, tick * 1.5),
          }}
        >
          <Icon name="check" size={30} color={C.emerald} strokeWidth={3} />
        </div>
      ) : null}
    </div>
  );
}

/**
 * s01-hook «Diez respuestas buenas». The heading «en el examen · las diez valen» and ten empty slots from the first
 * frame; on `ten` the ten techniques of 2.5 fill in (English names, no port stamp), on `all-good` each gets an emerald
 * tick, and on «mejor» a violet line says the exam asks for the BEST. On `port` the cards leave and the stamp «Autoridad
 * Portuaria de Halden · caso de ejemplo» comes in alone (nothing says the port has the ten). Before 12 s the stamp moves
 * up, the plate and «Mitigación / y hardening» land on the left, the promise lights chip by chip on its words, and the
 * thesis «la mejor: la que ataca la causa» closes the scene.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tenAt = props.cue('ten');
  const goodAt = props.cue('all-good');
  const portAt = props.cue('port');
  const titleAt = Math.min(props.cue('title') - 4, 12 * 30 - 22);
  const asksAt = wordFrame(S, 's01-01', 'mejor') - 6;
  const chipAt = PROMISE.map((p) => wordFrame(S, p.seg, p.word, p.nth) - 6);
  const causeAt = wordFrame(S, CAUSE.seg, CAUSE.word) - 4;

  const gridOut = progress(frame, portAt - 14, 14, EASE.inOut);
  const headIn = enter(frame, -4, { distance: 14, duration: 14 });
  const asksIn = progress(frame, asksAt, 12);

  const stampIn = springIn(frame, fps, portAt - 2, { damping: 16 });
  const stampUp = progress(frame, titleAt - 12, 22, EASE.inOut);
  const stampW = 760;
  const stampX = mix((W - stampW * 1.25) / 2, 0, stampUp);
  const stampY = mix(STAMP_Y_MID, 0, stampUp);
  const plaqueIn = enter(frame, titleAt, { distance: 14, duration: 16 });
  const titleIn = enter(frame, titleAt + 2, { distance: 22, duration: 18 });
  const chipOn = PROMISE.map((_, i) => progress(frame, chipAt[i], 10) * (1 - 0.5 * progress(frame, (chipAt[i + 1] ?? causeAt) - 2, 12, EASE.inOut)));
  const causeIn = enter(frame, causeAt, { distance: 16, duration: 16 });

  return (
    <Stage>
      {/* Phase 1: the ten cards */}
      {gridOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - gridOut, transform: `translateY(${-24 * gridOut}px) scale(${1 - 0.04 * gridOut})` }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: W, display: 'flex', justifyContent: 'center', ...headIn }}>
            <Pill text={HEADER} tone={C.violet} icon="mortarboard" size={34} on={0.6 + 0.4 * progress(frame, goodAt, 12)} />
          </div>
          {TECHNIQUES.map((t, i) => {
            const col = i % COLS;
            const row = Math.floor(i / COLS);
            const show = progress(frame, tenAt + i * 4, 12);
            const tick = springIn(frame, fps, goodAt + i * 3, { damping: 12 });
            return (
              <div key={t.name} style={{ position: 'absolute', left: col * (CARD_W + GAP_X), top: GRID_TOP + row * (CARD_H + GAP_Y) + (1 - show) * 12 }}>
                <Card name={t.name} icon={t.icon} tick={frame >= goodAt + i * 3 ? tick : 0} show={show} />
              </div>
            );
          })}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: GRID_TOP + 2 * CARD_H + GAP_Y + 40,
              width: W,
              textAlign: 'center',
              fontFamily: FONT.sans,
              fontSize: 44,
              fontWeight: 800,
              color: C.violet,
              opacity: asksIn,
              transform: `translateY(${(1 - asksIn) * 12}px)`,
            }}
          >
            {ASKS}
          </div>
        </div>
      ) : null}

      {/* Phase 2: the stamp alone, then up to the corner */}
      {frame >= portAt - 4 ? (
        <div style={{ position: 'absolute', left: stampX, top: stampY, opacity: Math.min(1, stampIn * 1.3), transform: `scale(${(0.92 + 0.08 * Math.min(1, stampIn)) * mix(1.25, 1, stampUp)})`, transformOrigin: '0 0' }}>
          <CaseStamp what={STAMP.what} kind={STAMP.kind} />
        </div>
      ) : null}

      {/* Phase 3: plate, title, promise, thesis */}
      {frame >= titleAt - 2 ? (
        <>
          <div style={{ position: 'absolute', left: 0, top: PLAQUE_TOP, ...plaqueIn }}>
            <PlaqueChip text={PLAQUE} />
          </div>
          <div style={{ position: 'absolute', left: -6, top: TITLE_TOP, fontFamily: FONT.sans, ...titleIn }}>
            {TITLE.map((l, k) => (
              <div key={k} style={{ fontSize: TITLE_SIZE, fontWeight: 900, letterSpacing: -3, lineHeight: 1.04, color: k === 0 ? C.textStrong : C.cyan, whiteSpace: 'nowrap', textShadow: `0 0 30px ${alpha(C.cyan, 0.2)}` }}>
                {l}
              </div>
            ))}
          </div>
        </>
      ) : null}
      {PROMISE.map((p, i) => {
        if (frame < chipAt[i] - 2) return null;
        const e = enter(frame, chipAt[i], { distance: 16 });
        return (
          <div key={p.text} style={{ position: 'absolute', left: RIGHT_X, top: CHIPS_TOP + i * (CHIP_H + CHIP_GAP), ...e }}>
            <Pill icon={p.icon} text={p.text} on={chipOn[i]} tone={C.cyan} size={38} height={66} />
          </div>
        );
      })}
      {frame >= causeAt - 2 ? (
        <div style={{ position: 'absolute', left: RIGHT_X, top: CAUSE_TOP, display: 'flex', alignItems: 'center', gap: 16, fontFamily: FONT.sans, ...causeIn }}>
          <Icon name="target" size={46} color={C.emerald} strokeWidth={2.2} />
          <span style={{ fontSize: 42, fontWeight: 850, color: C.emerald, whiteSpace: 'nowrap' }}>{CAUSE.text}</span>
        </div>
      ) : null}
    </Stage>
  );
}
