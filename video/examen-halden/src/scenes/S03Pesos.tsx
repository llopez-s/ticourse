import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { mix } from '../../../engine/src/ui';
import { BLOCKS, HALF_LABEL, HALF_PAIR, VOCAB_LABEL } from '../data/s03-pesos';
import { Stage } from './kit';

const W = STAGE.width;
const BASE = 556;
const BW = 316;
const GAP = (W - 5 * BW) / 4;
const PX_PER_PCT = 440 / 28;
/** Blocks first appear all the same height; on `weights` they grow or shrink to their weight. */
const EQ_H = 260;
const BRACE_Y = 78;

const x0 = (i: number) => i * (BW + GAP);
const hOf = (pct: number) => pct * PX_PER_PCT;

/**
 * s03-pesos «Dónde están los puntos». The course's five sections as five blocks (`blocks`), first all the same height
 * and then, on `weights`, proportional to their weight (12 / 22 / 18 / 28 / 20 %). On `half` Amenazas and Operaciones
 * light up and a brace joins them: «la mitad del examen». On `vocab` the 12 % block takes the focus with «el vocabulario
 * de todas las demás». No mission, boss or adversary names: only the sections' plain names.
 */
export function S03Pesos(props: SceneProps) {
  const frame = useCurrentFrame();
  const blocksAt = props.cue('blocks') - 4;
  const weightsAt = props.cue('weights') - 4;
  const halfAt = props.cue('half') - 4;
  const vocabAt = props.cue('vocab') - 4;

  const grow = progress(frame, weightsAt, 30, EASE.inOut);
  const half = progress(frame, halfAt, 16) * (1 - progress(frame, vocabAt - 8, 14, EASE.inOut));
  const vocab = progress(frame, vocabAt, 16);
  const anyFocus = Math.max(half, vocab);
  const brace = progress(frame, halfAt + 4, 26, EASE.inOut);

  const leftX = x0(HALF_PAIR[0] - 1) + BW / 2;
  const rightX = x0(HALF_PAIR[1] - 1) + BW / 2;
  const topLeft = BASE - hOf(BLOCKS[HALF_PAIR[0] - 1].pct);
  const topRight = BASE - hOf(BLOCKS[HALF_PAIR[1] - 1].pct);
  const midX = (leftX + rightX) / 2;
  const path = `M ${leftX} ${topLeft - 10} V ${BRACE_Y + 14} Q ${leftX} ${BRACE_Y} ${leftX + 14} ${BRACE_Y} H ${rightX - 14} Q ${rightX} ${BRACE_Y} ${rightX} ${BRACE_Y + 14} V ${topRight - 10}`;
  const pathLen = 1700;

  return (
    <Stage>
      {BLOCKS.map((b, i) => {
        const inP = progress(frame, blocksAt + i * 7, 18);
        const isHalf = (HALF_PAIR as readonly number[]).includes(b.n);
        const focus = Math.max(isHalf ? half : 0, b.n === 1 ? vocab : 0);
        const dim = 1 - 0.5 * anyFocus * (1 - focus);
        const h = mix(EQ_H, hOf(b.pct), grow);
        const tone = C.cyan;
        const wave = vocab > 0 && b.n > 1 ? progress(frame, vocabAt + 6 + (b.n - 2) * 8, 14) : 0;
        return (
          <div key={b.n}>
            <div
              style={{
                position: 'absolute',
                left: x0(i),
                top: BASE - h,
                width: BW,
                height: h,
                boxSizing: 'border-box',
                padding: '16px 14px 0',
                borderRadius: RADIUS.md,
                border: `3px solid ${alpha(tone, (0.4 + 0.55 * focus) * dim)}`,
                background: alpha(tone, (0.1 + 0.2 * focus + 0.06 * wave) * dim),
                boxShadow: focus > 0.02 ? `0 0 ${Math.round(36 * focus)}px ${alpha(tone, 0.35 * focus)}` : undefined,
                fontFamily: FONT.sans,
                color: C.textStrong,
                opacity: inP * (0.55 + 0.45 * dim),
                transform: `translateY(${(1 - inP) * 24}px)`,
                overflow: 'hidden',
              }}
            >
              <div style={{ height: 68, fontSize: 64, fontWeight: 850, letterSpacing: -1, lineHeight: '68px', opacity: progress(frame, weightsAt + 14 + i * 4, 12), color: C.textStrong }}>
                {b.pct} %
              </div>
              <div style={{ fontSize: 32, fontWeight: 650, lineHeight: '38px', letterSpacing: -0.3, color: C.text }}>{b.name}</div>
            </div>
            <div
              style={{
                position: 'absolute',
                left: x0(i),
                top: BASE + 14,
                width: BW,
                textAlign: 'center',
                fontFamily: FONT.sans,
                fontSize: 32,
                fontWeight: 800,
                letterSpacing: 1,
                color: C.muted,
                opacity: inP * (0.6 + 0.4 * dim),
              }}
            >
              Sección {b.n}
            </div>
          </div>
        );
      })}

      {/* The brace that joins Amenazas and Operaciones */}
      {half > 0.01 || brace > 0 ? (
        <>
          <svg width={W} height={BASE} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: 1 - progress(frame, vocabAt - 8, 14, EASE.inOut) }}>
            <path d={path} fill="none" stroke={C.cyanSoft} strokeWidth={5} strokeLinecap="round" strokeDasharray={pathLen} strokeDashoffset={pathLen * (1 - brace)} />
            <line x1={midX} y1={BRACE_Y} x2={midX} y2={BRACE_Y - 18} stroke={C.cyanSoft} strokeWidth={5} strokeLinecap="round" opacity={brace} />
          </svg>
          <div
            style={{
              position: 'absolute',
              left: midX,
              top: 0,
              transform: `translate(-50%, ${(1 - brace) * 10}px)`,
              opacity: brace * (1 - progress(frame, vocabAt - 8, 14, EASE.inOut)),
              height: 58,
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0 28px',
              boxSizing: 'border-box',
              borderRadius: RADIUS.pill,
              border: `3px solid ${C.cyan}`,
              background: alpha(C.cyan, 0.2),
              fontFamily: FONT.sans,
              fontSize: 40,
              fontWeight: 850,
              color: C.textStrong,
              whiteSpace: 'nowrap',
              boxShadow: `0 0 30px ${alpha(C.cyan, 0.3)}`,
            }}
          >
            {HALF_LABEL}
          </div>
        </>
      ) : null}

      {/* The 12 % block's note */}
      {vocab > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: STAGE.height - (BASE - hOf(BLOCKS[0].pct)) + 18,
            width: BW,
            fontFamily: FONT.sans,
            fontSize: 38,
            fontWeight: 800,
            lineHeight: '46px',
            color: C.cyanSoft,
            opacity: vocab,
            transform: `translateY(${(1 - vocab) * 14}px)`,
          }}
        >
          {VOCAB_LABEL}
        </div>
      ) : null}
    </Stage>
  );
}
