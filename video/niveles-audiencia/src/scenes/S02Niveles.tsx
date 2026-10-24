import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { CLUB_LABEL, TABLE, TONE, VIGNETTES } from '../data/niveles';
import { VIGNETTE, Vignette, VignetteSlot } from './parts/Football';
import { COLS, LevelTable, TBL, rowCenterY } from './parts/LevelTable';
import { Stage, wordFrame } from './kit';

const S = 's02-niveles';
const W = STAGE.width;

const VIG_TOP = 50;
const VIG_GAP = (W - 3 * VIGNETTE.w) / 2;
const vigX = (i: number) => i * (VIGNETTE.w + VIG_GAP);
const LANE_X = 26;
const BUS_Y = VIG_TOP + VIGNETTE.h + 12;
const LENS_TOP = 604;

/**
 * s02-niveles «Tres lectores, tres plazos». On `club` the small label «la inteligencia es para alguien»
 * (three dashed slots and the empty table wait under it). Then the football club, left to right, each
 * vignette landing on its own words: `pitch` the player (a field seen from above, a move under way
 * and a clock), `rival` the coach (the board with the rival's same move, drawn again and again),
 * `years` the board of directors (academy and squad on a plan, a calendar of seasons). On `tactical`,
 * `operational` and `strategic` the matching row of the lesson's table lights, a thread of the same
 * colour runs from its vignette to the row, and the five cells are written as the voice reaches them
 * (level, audience, question, products, horizon). On `lens` the three rows hold still, the vignettes
 * step back, and the sentence «el nivel lo marca quién lee, qué decide y para cuándo» is written
 * while the columns it names (audience, question, horizon) light in turn.
 */
export function S02Niveles(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const clubAt = props.cue('club');
  const vigAt = [props.cue('pitch'), props.cue('rival'), props.cue('years')];
  const rowAt = [props.cue('tactical'), props.cue('operational'), props.cue('strategic')];
  const lensAt = props.cue('lens');
  const w = (seg: string, word: string) => wordFrame(S, seg, word);

  // ---- Cells: each row is written as the voice says it, never before the row has lit.
  const cell = (row: number, seg: string, words: readonly string[]) => words.map((word) => Math.max(rowAt[row] + 6, w(seg, word) - 6));
  const cellAt = [
    // level, audience, question, products, horizon — the question comes first: «Lo de ahora»
    [Math.max(rowAt[0] + 6, w('s02-03', 'nivel') - 4), ...cell(0, 's02-03', ['SOC', 'ahora', 'indicadores', 'horas'])],
    [...cell(1, 's02-04', ['operational', 'caza', 'opera', 'Informes', 'semanas'])],
    [...cell(2, 's02-05', ['strategic', 'CISO', 'invertir', 'Tendencias', 'meses'])],
  ] as const;

  // ---- Which row the voice is on.
  const next = [rowAt[1], rowAt[2], lensAt];
  const rowGlow = rowAt.map((a, i) => progress(frame, a - 4, 12) * (1 - progress(frame, next[i] - 4, 12)));
  const rowDim = rowAt.map((_, i) => 0.4 * progress(frame, next[i] - 4, 14) * (1 - progress(frame, lensAt - 4, 14)) * (i === 2 ? 0 : 1));
  const vigGlow = rowGlow;
  const lensIn = progress(frame, lensAt - 4, 14);
  const vigDim = vigAt.map((_, i) => 0.45 * progress(frame, next[i] - 4, 14) + 0.2 * lensIn);

  // ---- The lens: the sentence and the three columns it names.
  const lensWords = [
    { text: 'el nivel lo marca ', at: lensAt, col: -1 },
    { text: 'quién lee', at: w('s02-06', 'quién') - 4, col: 1 },
    { text: ', ', at: lensAt, col: -1 },
    { text: 'qué decide', at: w('s02-06', 'qué') - 4, col: 2 },
    { text: ' y ', at: lensAt, col: -1 },
    { text: 'para cuándo', at: w('s02-06', 'para') - 4, col: 4 },
  ] as const;
  const colLit = COLS.map((_, c) => {
    const word = lensWords.find((l) => l.col === c);
    if (!word) return 0;
    const i = lensWords.indexOf(word);
    const nextAt = lensWords.slice(i + 1).find((l) => l.col >= 0)?.at ?? Number.POSITIVE_INFINITY;
    const on = progress(frame, word.at, 10);
    const off = Number.isFinite(nextAt) ? progress(frame, nextAt - 2, 12, EASE.inOut) : progress(frame, lensAt + 150, 40, EASE.inOut);
    return on * (1 - 0.7 * off);
  });

  const clubIn = enter(frame, clubAt - 2, { distance: 12, duration: 14 });

  return (
    <Stage>
      {/* Club label */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, display: 'flex', justifyContent: 'center', ...clubIn }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 14,
            height: 42,
            padding: '0 26px 0 18px',
            borderRadius: RADIUS.pill,
            border: `2px solid ${alpha(C.sky, 0.6)}`,
            background: alpha(C.sky, 0.1),
            fontFamily: FONT.sans,
            fontSize: 28,
            fontWeight: 750,
            color: '#bae6fd',
            whiteSpace: 'nowrap',
          }}
        >
          <Icon name="users" size={28} color={C.sky} />
          {CLUB_LABEL}
        </div>
      </div>

      {/* Vignettes */}
      {VIGNETTES.map((v, i) => {
        const landed = progress(frame, vigAt[i] - 6, 10);
        return (
          <div key={v.level} style={{ position: 'absolute', left: vigX(i), top: VIG_TOP }}>
            {landed < 1 ? <VignetteSlot opacity={1 - landed} /> : null}
            {landed > 0 ? (
              <div style={{ position: 'absolute', left: 0, top: 0 }}>
                <Vignette index={i as 0 | 1 | 2} at={vigAt[i]} frame={frame} fps={fps} dim={vigDim[i]} glow={vigGlow[i]} />
              </div>
            ) : null}
          </div>
        );
      })}

      {/* Threads: vignette to row, same colour */}
      <svg width={W} height={STAGE.height} viewBox={`0 0 ${W} ${STAGE.height}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
        {TABLE.map((row, i) => {
          const startX = Math.max(vigX(i) + 30, LANE_X);
          const startY = VIG_TOP + VIGNETTE.h;
          const endY = rowCenterY(i);
          const d =
            i === 0
              ? `M${LANE_X} ${startY} V${endY} H${TBL.x - 2}`
              : `M${startX} ${startY} V${BUS_Y} H${LANE_X} V${endY} H${TBL.x - 2}`;
          const p = progress(frame, rowAt[i] - 4, 26, EASE.inOut);
          const gone = progress(frame, next[i] - 4, 12);
          if (p <= 0 || gone >= 1) return null;
          return (
            <g key={row.level} opacity={1 - gone}>
              <path d={d} fill="none" stroke={alpha(row.tone, 0.28)} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
              <path d={d} fill="none" stroke={row.tone} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
              {p > 0.98 ? <circle cx={TBL.x - 2} cy={endY} r={8} fill={row.tone} /> : null}
            </g>
          );
        })}
      </svg>

      {/* The table */}
      <LevelTable frame={frame} slotAt={rowAt.map((a) => a - 4)} cellAt={cellAt} glow={rowGlow} dim={rowDim} colLit={colLit} />

      {/* The lens */}
      {lensIn > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: LENS_TOP,
            width: W,
            display: 'flex',
            justifyContent: 'center',
            fontFamily: FONT.sans,
            fontSize: 42,
            fontWeight: 800,
            whiteSpace: 'pre',
            opacity: lensIn,
            transform: `translateY(${(1 - lensIn) * 14}px)`,
          }}
        >
          {lensWords.map((l, i) => {
            const on = progress(frame, l.at, 10);
            const hot = l.col >= 0;
            return (
              <span
                key={i}
                style={{
                  color: hot ? C.textStrong : C.text,
                  opacity: hot ? 0.45 + 0.55 * on : 1,
                  textDecoration: hot && on > 0.5 ? 'underline' : undefined,
                  textDecorationColor: alpha(TONE.tactical, 0.9),
                  textDecorationThickness: 4,
                  textUnderlineOffset: 8,
                }}
              >
                {l.text}
              </span>
            );
          })}
        </div>
      ) : null}
    </Stage>
  );
}
