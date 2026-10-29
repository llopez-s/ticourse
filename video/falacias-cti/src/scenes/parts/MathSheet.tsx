import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { MATH } from '../../data/s02-papel';
import { PAPER, Sheet } from './Paper';

/** The maths sheet (squared paper): its box and where each row sits (own coordinates). */
export const MATH_BOX = { w: 640, h: 470 } as const;
export const MATH_ROWS = { first: 28, step: 84, h: 70, result: 364, resultH: 80 } as const;

/**
 * A maths problem solved on squared paper: four steps and a result. The result is right; step 3 has its sum twisted (it sits
 * tilted and a little off its line). The workings are blurred on purpose: nobody is meant to read figures here — nothing is
 * marked yet. A normal-flow box 640 x 470.
 */
export function MathSheet({ glow = 0, dim = 0 }: { glow?: number; dim?: number }) {
  const R = MATH_ROWS;
  const row = (i: number) => {
    const crooked = i === MATH.crooked;
    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: 20,
          top: R.first + i * R.step,
          width: MATH_BOX.w - 40,
          height: R.h,
          boxSizing: 'border-box',
          borderRadius: 10,
          background: alpha(C.textStrong, 0.55),
          transform: crooked ? 'rotate(-3.2deg) translateX(16px)' : undefined,
          transformOrigin: '0 50%',
        }}
      >
        <div style={{ position: 'absolute', left: 16, top: 18, fontSize: 30, fontWeight: 700, color: PAPER.inkSoft, whiteSpace: 'nowrap' }}>{MATH.steps[i]}</div>
        <div style={{ position: 'absolute', left: 160, top: 10, fontFamily: FONT.mono, fontSize: 46, fontWeight: 700, color: PAPER.ink, whiteSpace: 'nowrap', filter: 'blur(5px)', letterSpacing: 2 }}>{MATH.lines[i]}</div>
      </div>
    );
  };
  return (
    <Sheet width={MATH_BOX.w} height={MATH_BOX.h} glow={glow} dim={dim} grid>
      {[0, 1, 2, 3].map(row)}
      <div style={{ position: 'absolute', left: 20, top: R.result, width: MATH_BOX.w - 40, height: R.resultH, boxSizing: 'border-box', borderRadius: 12, border: `3px solid ${alpha(PAPER.inkSoft, 0.7)}`, background: alpha(C.textStrong, 0.7) }}>
        <div style={{ position: 'absolute', left: 16, top: 20, fontSize: 32, fontWeight: 800, color: PAPER.ink, whiteSpace: 'nowrap' }}>{MATH.result}</div>
        <div style={{ position: 'absolute', left: 250, top: 12, fontFamily: FONT.mono, fontSize: 52, fontWeight: 800, color: PAPER.ink, whiteSpace: 'nowrap', filter: 'blur(5.5px)', letterSpacing: 2 }}>{MATH.lines[3]}</div>
      </div>
    </Sheet>
  );
}
