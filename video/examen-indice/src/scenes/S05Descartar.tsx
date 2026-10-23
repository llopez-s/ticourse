import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { FirstChips } from './parts/FirstChips';
import { Bar, Tag, withOpacity } from './parts/paper';
import { Stage, segment, wordFrame } from './kit';

const S = 's05-descartar';
const W = STAGE.width;
const ROW0 = 214;
const STEP = 100;
const ROW_H = 76;
const BAR_W = 540;
const RIGHT = 1090;

// Question tiles for the «marca y sigue» strip.
const TILES = 9;
const TILE_W = 150;
const TILE_GAP = 24;
const TILE_Y = 330;
const FLAGGED = 3;

/**
 * s05-descartar «Quitar y decidir». Four generic options A–D (bars with no text). `discard`: A and D
 * are struck out with a rose cross as the voice says «descarta… las dos opciones rotas», two remain.
 * `decide`: «¿cuál responde justo lo que piden?» beside the two (the exam card draws outside
 * the stage). `bait`: the lower option shines with a small hook, «suena más sofisticada». `reply-b`
 * (under the intercepted message, top band kept clear): the top option is outlined and struck,
 * «error típico de BEST» (choosing the first defensible one). `mark`: a strip of question tiles,
 * one gets a flag («marca»), its best option for now is ticked, the others are answered in
 * a row («sigue»), and an arrow comes back to the flag («vuelves al final»). Last, the think
 * prompt: two cold chips, «recoger datos» and «planificar», no clue and nothing highlighted.
 */
export function S05Descartar(props: SceneProps) {
  const frame = useCurrentFrame();
  const discard = props.cue('discard');
  const decide = props.cue('decide');
  const bait = props.cue('bait');
  const replyB = props.cue('reply-b');
  const mark = props.cue('mark');
  const quiz = segment(props, 's05-06').from;

  const xA = wordFrame(S, 's05-01', 'Descarta') - 4;
  const xD = wordFrame(S, 's05-01', 'rotas') - 6;
  const twoLeft = wordFrame(S, 's05-01', 'quedan') - 4;

  const optionsOut = progress(frame, mark - 12, 16, EASE.inOut);

  // ---- mark and go on
  const atascaAt = wordFrame(S, 's05-05', 'atasca') - 6;
  const marcaAt = wordFrame(S, 's05-05', 'Marca') - 6;
  const mejorAt = wordFrame(S, 's05-05', 'mejor') - 6;
  const sigueAt = wordFrame(S, 's05-05', 'sigue') - 6;
  const vuelvesAt = wordFrame(S, 's05-05', 'Vuelves') - 6;
  const stripOut = progress(frame, quiz - 10, 14, EASE.inOut);

  // ---- the think prompt chips
  const recogerAt = wordFrame(S, 's05-06', 'Recoger') - 6;
  const planificarAt = wordFrame(S, 's05-06', 'planificar') - 6;

  const optionRow = (i: number) => {
    const letter = 'ABCD'[i];
    const top = ROW0 + i * STEP;
    const isOut = i === 0 || i === 3;
    const outP = progress(frame, i === 0 ? xA : xD, 12, EASE.out);
    const keep = progress(frame, twoLeft, 14);
    const isTop = i === 1;
    const isBait = i === 2;
    const baitP = isBait ? progress(frame, bait, 14) : 0;
    const strikeP = isTop ? progress(frame, replyB, 16, EASE.inOut) : 0;
    const accent = isTop && strikeP > 0.02 ? C.rose : isBait && baitP > 0.02 ? C.amber : keep > 0.02 && !isOut ? C.cyan : C.ink600;
    return (
      <div
        key={letter}
        style={{
          position: 'absolute',
          left: 0,
          top,
          width: RIGHT - 30,
          height: ROW_H,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          padding: '0 24px',
          borderRadius: RADIUS.lg,
          background: alpha(C.ink850, 0.8),
          border: `3px solid ${alpha(accent, isOut ? 0.4 : 0.45 + 0.4 * Math.max(keep, baitP, strikeP))}`,
          boxShadow: baitP > 0.05 ? `0 0 ${Math.round(38 * baitP)}px ${alpha(C.amber, 0.35 * baitP)}` : undefined,
          filter: isOut && outP > 0.05 ? `saturate(${1 - 0.6 * outP})` : undefined,
          ...withOpacity(enter(frame, discard - 4 + i * 5, { distance: 16 }), 1 - 0.68 * (isOut ? outP : 0)),
        }}
      >
        <div style={{ width: 52, height: 52, borderRadius: 26, display: 'grid', placeItems: 'center', background: C.ink700, border: `2px solid ${C.ink500}`, fontSize: 30, fontWeight: 850, color: C.text }}>{letter}</div>
        <Bar w={BAR_W} h={28} color={accent === C.ink600 ? C.ink600 : alpha(accent, 0.8)} />
        {/* discard cross */}
        {isOut && outP > 0.02 ? (
          <svg width={BAR_W + 120} height={ROW_H} style={{ position: 'absolute', left: 76, top: 0, overflow: 'visible' }} aria-hidden>
            <path d={`M20 12 L${20 + (BAR_W + 60) * outP} ${12 + (ROW_H - 24) * outP}`} stroke={C.rose} strokeWidth={7} strokeLinecap="round" />
            <path d={`M${BAR_W + 80} 12 L${BAR_W + 80 - (BAR_W + 60) * outP} ${12 + (ROW_H - 24) * outP}`} stroke={C.rose} strokeWidth={7} strokeLinecap="round" />
          </svg>
        ) : null}
        {/* the first-defensible mark: struck through */}
        {isTop && strikeP > 0.02 ? (
          <div style={{ position: 'absolute', left: 70, top: ROW_H / 2 - 3, width: (BAR_W + 40) * strikeP, height: 6, borderRadius: 3, background: C.rose, boxShadow: `0 0 16px ${alpha(C.rose, 0.7)}` }} />
        ) : null}
        {isTop && strikeP > 0.4 ? (
          <div style={{ position: 'absolute', left: BAR_W + 120, top: 14, opacity: strikeP }}>
            <Tag color={C.rose} size={30} icon="x">
              error típico de BEST
            </Tag>
          </div>
        ) : null}
        {isBait && baitP > 0.05 ? (
          <div style={{ position: 'absolute', left: BAR_W + 100, top: 10, display: 'flex', alignItems: 'center', gap: 14, opacity: baitP, transform: `translateX(${(1 - baitP) * -16}px)` }}>
            <svg width={44} height={56} viewBox="0 0 24 30" fill="none" stroke={C.amber} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 1v16a5.5 5.5 0 1 1-5.5-5.5" />
              <path d="M6.5 11.5l-2.8 3" />
              <circle cx={12} cy={3} r={1.6} fill={C.amber} />
            </svg>
            <Tag color={C.amber} size={30}>
              suena más sofisticada
            </Tag>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <Stage>
      {optionsOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - optionsOut, transform: `translateY(${-optionsOut * 30}px)` }}>
          {[0, 1, 2, 3].map(optionRow)}
          {frame >= decide - 4 ? (
            <div style={{ position: 'absolute', left: RIGHT, top: ROW0 + 6, width: W - RIGHT, fontFamily: FONT.sans, ...enter(frame, decide, { distance: 26, axis: 'x' }) }}>
              <Icon name="target" size={78} color={C.cyan} strokeWidth={2} />
              <div style={{ marginTop: 18, fontSize: 58, fontWeight: 850, lineHeight: 1.1, letterSpacing: -1, color: C.textStrong }}>
                ¿cuál responde
                <br />
                <span style={{ color: C.cyan }}>justo lo que piden</span>?
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* mark and go on */}
      {frame >= mark - 6 && stripOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: (1 - stripOut) * progress(frame, mark - 4, 14), fontFamily: FONT.sans }}>
          {Array.from({ length: TILES }).map((_, i) => {
            const left = 40 + i * (TILE_W + TILE_GAP);
            const flagged = i === FLAGGED;
            const stuck = flagged ? progress(frame, atascaAt, 10) : 0;
            const flag = flagged ? progress(frame, marcaAt, 12, EASE.out) : 0;
            const answered = flagged ? progress(frame, mejorAt, 12) : i > FLAGGED ? progress(frame, sigueAt + (i - FLAGGED) * 9, 10) : 1;
            const back = flagged ? progress(frame, vuelvesAt + 40, 14) * (0.5 + 0.5 * pulse(frame, 30, 0.8)) : 0;
            const color = flag > 0.05 ? C.amber : i < FLAGGED || answered > 0.5 ? C.emerald : C.ink600;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left,
                  top: TILE_Y,
                  width: TILE_W,
                  height: 110,
                  boxSizing: 'border-box',
                  borderRadius: RADIUS.md,
                  background: alpha(color, flag > 0.05 || answered > 0.5 || i < FLAGGED ? 0.13 : 0.05),
                  border: `3px solid ${alpha(color, flag > 0.05 ? 0.95 : 0.55)}`,
                  boxShadow: flag > 0.05 ? `0 0 ${Math.round(24 + 18 * back)}px ${alpha(C.amber, 0.35 + 0.3 * back)}` : undefined,
                  ...(() => {
                    const e = enter(frame, mark - 2 + i * 3, { distance: 12 });
                    const shake = stuck > 0 && flag < 0.05 ? ` translateX(${Math.sin(frame * 1.6) * 4 * stuck}px)` : '';
                    return { opacity: e.opacity, transform: e.transform + shake };
                  })(),
                }}
              >
                <div style={{ position: 'absolute', left: 18, top: 20, display: 'grid', gap: 10 }}>
                  <Bar w={TILE_W - 80} h={12} color={alpha(C.muted, 0.5)} />
                  <Bar w={TILE_W - 56} h={12} color={alpha(C.muted, 0.35)} />
                </div>
                {answered > 0.5 && (flagged ? true : i > FLAGGED) ? (
                  <div style={{ position: 'absolute', right: 12, bottom: 10, opacity: answered }}>
                    <Icon name="check" size={36} color={flagged ? C.amber : C.emerald} strokeWidth={3.4} />
                  </div>
                ) : null}
                {i < FLAGGED ? (
                  <div style={{ position: 'absolute', right: 12, bottom: 10 }}>
                    <Icon name="check" size={36} color={C.emerald} strokeWidth={3.4} />
                  </div>
                ) : null}
                {flagged && flag > 0.02 ? (
                  <div style={{ position: 'absolute', left: 8, top: -64 + (1 - flag) * -20, opacity: flag }}>
                    <Icon name="flag" size={64} color={C.amber} strokeWidth={2.4} />
                  </div>
                ) : null}
              </div>
            );
          })}
          {/* captions */}
          {frame >= marcaAt - 4 ? (
            <div style={{ position: 'absolute', left: 40 + FLAGGED * (TILE_W + TILE_GAP) - 6, top: TILE_Y + 128, ...enter(frame, marcaAt, { distance: 14 }) }}>
              <Tag color={C.amber} size={34} solid>
                marca
              </Tag>
            </div>
          ) : null}
          {frame >= mejorAt - 4 ? (
            <div style={{ position: 'absolute', left: 40 + FLAGGED * (TILE_W + TILE_GAP) - 6, top: TILE_Y + 196, ...enter(frame, mejorAt, { distance: 14 }) }}>
              <Tag color={C.amber} size={32} icon="check">
                mejor opción por ahora
              </Tag>
            </div>
          ) : null}
          {frame >= sigueAt - 4 ? (
            <div style={{ position: 'absolute', left: 40 + (FLAGGED + 2) * (TILE_W + TILE_GAP) + 270, top: TILE_Y + 128, display: 'flex', alignItems: 'center', gap: 14, ...enter(frame, sigueAt, { distance: 14 }) }}>
              <Tag color={C.emerald} size={34} solid>
                sigue
              </Tag>
              <Icon name="arrowRight" size={52} color={C.emerald} strokeWidth={2.6} />
            </div>
          ) : null}
          {/* the way back to the flag */}
          {frame >= vuelvesAt - 4 ? (
            <svg width={W} height={200} style={{ position: 'absolute', left: 0, top: TILE_Y - 150, overflow: 'visible' }} aria-hidden>
              <path
                d={`M${40 + (TILES - 1) * (TILE_W + TILE_GAP) + TILE_W / 2} 145 C ${40 + (TILES - 1) * (TILE_W + TILE_GAP) + TILE_W / 2} 20, ${40 + FLAGGED * (TILE_W + TILE_GAP) + TILE_W / 2 + 60} 20, ${40 + FLAGGED * (TILE_W + TILE_GAP) + TILE_W / 2 + 6} 142`}
                stroke={C.cyan}
                strokeWidth={6}
                fill="none"
                strokeLinecap="round"
                strokeDasharray="1 1"
                pathLength={1}
                strokeDashoffset={1 - progress(frame, vuelvesAt, 40, EASE.inOut)}
              />
              <path
                d={`M${40 + FLAGGED * (TILE_W + TILE_GAP) + TILE_W / 2 + 6} 142 l-14 -22 M${40 + FLAGGED * (TILE_W + TILE_GAP) + TILE_W / 2 + 6} 142 l22 -12`}
                stroke={C.cyan}
                strokeWidth={6}
                strokeLinecap="round"
                opacity={progress(frame, vuelvesAt + 36, 8)}
              />
            </svg>
          ) : null}
          {frame >= vuelvesAt + 10 ? (
            <div style={{ position: 'absolute', left: 40 + 6 * (TILE_W + TILE_GAP) - 60, top: TILE_Y - 128, ...enter(frame, vuelvesAt + 10, { distance: 14 }) }}>
              <Tag color={C.cyan} size={34}>
                vuelves al final
              </Tag>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* the think prompt: two cold chips */}
      {frame >= recogerAt - 4 ? <FirstChips frame={frame} appearAt={[recogerAt, planificarAt]} /> : null}
    </Stage>
  );
}
