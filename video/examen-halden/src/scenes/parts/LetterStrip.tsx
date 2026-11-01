import { BAND } from './QuestionBand';
import { OptionCard, type OptionItem } from './OptionStack';

/**
 * The four options A–D as letters only, in the question band (left side), mirroring the engine's panel above it.
 * Used after the reveal to show what falls: the struck ones (strike 0–1, a white stroke), the answer (state 'ok',
 * emerald check) and the trap (state 'trap', amber alert) echoing the panel's «Correcta» and «Trampa».
 * Reuse in s06/s08/s09/s11: <div style={{ position: 'absolute', left: 0, top: 0, opacity }}><LetterStrip items={[...]} /></div>
 * `items` has exactly four entries, A to D; the letters are filled in here.
 */
const LETTERS = ['A', 'B', 'C', 'D'] as const;

export function LetterStrip({ items, w = 120, gap = 16 }: { items: OptionItem[]; w?: number; gap?: number }) {
  return (
    <div style={{ display: 'flex', gap, height: BAND.height }}>
      {LETTERS.map((letter, i) => (
        <OptionCard key={letter} item={{ ...items[i], letter }} w={w} h={BAND.height} fontSize={34} />
      ))}
    </div>
  );
}
