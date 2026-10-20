import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { QuestionStill } from './parts/QuestionStill';
import { Stage } from './kit';

const W = 1728;
const H = 660;
const PAGE = { x: 404, y: 30, w: 920, h: 600 } as const;
const TILE = 196;
const TILE_GAP = 18;
const TILES_X = PAGE.x + (PAGE.w - (4 * TILE + 3 * TILE_GAP)) / 2;
const TILES_Y = PAGE.y + 150;
/** Tile background colours: loud, like meme posts. */
const TILE_BG = ['#7c3aed', '#0891b2', '#db2777', '#ca8a04', '#16a34a', '#ea580c', '#2563eb', '#be123c'];

/** A meme tile: a loud colour, a drawn face (no text, no emoji) and two caption bars. */
function MemeTile({ x, y, k }: { x: number; y: number; k: number }) {
  const cx = x + TILE / 2;
  const cy = y + TILE / 2 + 6;
  const mouth = k % 3;
  return (
    <g>
      <rect x={x} y={y} width={TILE} height={TILE} rx={14} fill={TILE_BG[k % TILE_BG.length]} opacity={0.85} />
      <rect x={x + 30} y={y + 14} width={TILE - 60} height={14} rx={7} fill={alpha('#ffffff', 0.8)} />
      <circle cx={cx} cy={cy} r={50} fill="#fde68a" stroke="#92400e" strokeWidth={4} />
      <circle cx={cx - 18} cy={cy - 12} r={7} fill={C.ink950} />
      <circle cx={cx + 18} cy={cy - 12} r={7} fill={C.ink950} />
      {mouth === 0 ? <path d={`M ${cx - 24} ${cy + 14} Q ${cx} ${cy + 40} ${cx + 24} ${cy + 14}`} fill="none" stroke={C.ink950} strokeWidth={5} strokeLinecap="round" /> : null}
      {mouth === 1 ? <ellipse cx={cx} cy={cy + 22} rx={12} ry={14} fill={C.ink950} /> : null}
      {mouth === 2 ? <path d={`M ${cx - 22} ${cy + 22} L ${cx + 22} ${cy + 16}`} stroke={C.ink950} strokeWidth={5} strokeLinecap="round" /> : null}
      <rect x={x + 24} y={y + TILE - 30} width={TILE - 48} height={14} rx={7} fill={alpha('#ffffff', 0.8)} />
    </g>
  );
}

/**
 * s03-p1 «Una cuenta en plena polémica». The engine's ExamQuestionLayer draws question 1 (scenario, question with «MÁS
 * probable», options, the 5 s countdown, the answer on `ok-1`, the trap on `trap-1`) over this scene from s03-01 to its
 * end, so the scene is only a still, dim, textless background, complete from the first frame: a nameless social
 * profile (a small round avatar and a name bar) whose wall is covered in meme tiles — loud colours, drawn faces, no
 * words — plus «pregunta tipo examen · ejemplo» under the stage. The «MÁS probable: …» line and the graffiti's line in
 * the resolution (`spray-back`) are the voice's only.
 */
export function S03P1(_props: SceneProps) {
  return (
    <Stage>
      <QuestionStill outside>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
          <rect x={0} y={20} width={W} height={H - 40} rx={18} fill={C.ink900} />
          <rect x={PAGE.x} y={PAGE.y} width={PAGE.w} height={PAGE.h} rx={20} fill="#111b2e" stroke={C.ink600} strokeWidth={3} />
          {/* header: avatar and a name bar, nothing readable */}
          <circle cx={PAGE.x + 80} cy={PAGE.y + 72} r={42} fill="#334155" stroke="#64748b" strokeWidth={4} />
          <circle cx={PAGE.x + 80} cy={PAGE.y + 62} r={14} fill="#64748b" />
          <path d={`M ${PAGE.x + 54} ${PAGE.y + 102} Q ${PAGE.x + 80} ${PAGE.y + 74} ${PAGE.x + 106} ${PAGE.y + 102}`} fill="#64748b" />
          <rect x={PAGE.x + 146} y={PAGE.y + 52} width={260} height={20} rx={10} fill={alpha(C.text, 0.45)} />
          <rect x={PAGE.x + 146} y={PAGE.y + 84} width={170} height={14} rx={7} fill={alpha(C.text, 0.25)} />
          {/* the wall of memes */}
          {Array.from({ length: 8 }, (_, k) => (
            <MemeTile key={k} k={k} x={TILES_X + (k % 4) * (TILE + TILE_GAP)} y={TILES_Y + Math.floor(k / 4) * (TILE + TILE_GAP)} />
          ))}
        </svg>
      </QuestionStill>
    </Stage>
  );
}
