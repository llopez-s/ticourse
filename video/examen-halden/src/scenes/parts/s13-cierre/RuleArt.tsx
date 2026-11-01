import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon } from '../../../../../engine/src/ui';
import { CrosswordGrid } from '../s12-tiempo/Crossword';
import { OptionCard, type OptionItem } from '../OptionStack';

/*
 * The three rule icons of s13, each the image its concept had earlier in the video:
 *   OptionsIcon    the four options with two struck (s07 / the band of the question scenes)
 *   ColumnsIcon    the two columns of s10: the standard, the trick
 *   CrosswordIcon  the crossword of s12 (easy ones in, hard ones ringed)
 * All are 150 px high at most so they fit the rule card's art slot.
 */

export function OptionsIcon({ strike }: { strike: number }) {
  const items: OptionItem[] = [
    { letter: 'A', state: 'lit', on: 1 },
    { letter: 'B', strike },
    { letter: 'C', state: 'lit', on: 1 },
    { letter: 'D', strike },
  ];
  return (
    <div style={{ display: 'flex', gap: 14 }}>
      {items.map((it, i) => (
        <OptionCard key={i} item={it} w={102} h={118} fontSize={30} />
      ))}
    </div>
  );
}

export function ColumnsIcon({ tilt }: { tilt: number }) {
  const col = (tone: string, dashed: boolean, check: boolean) => (
    <div
      style={{
        width: 188,
        height: 128,
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `3px ${dashed ? 'dashed' : 'solid'} ${alpha(tone, 0.85)}`,
        background: alpha(tone, dashed ? 0.05 : 0.2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        opacity: dashed ? 0.75 : 1,
      }}
    >
      <Icon name={dashed ? 'bolt' : 'shield'} size={44} color={tone} strokeWidth={2.2} />
      <div style={{ width: 100, height: 14, borderRadius: 7, background: alpha(tone, 0.7) }} />
      {check ? <div style={{ width: 66, height: 14, borderRadius: 7, background: alpha(tone, 0.45) }} /> : null}
    </div>
  );
  return (
    <div style={{ display: 'flex', gap: 22, alignItems: 'center', fontFamily: FONT.sans }}>
      <div style={{ transform: `translateY(${tilt * 8}px)` }}>{col(C.cyan, false, true)}</div>
      <div style={{ transform: `translateY(${-tilt * 8}px)` }}>{col(C.amber, true, false)}</div>
    </div>
  );
}

export function CrosswordIcon({ easy, hard, ring }: { easy: number; hard: number; ring: number }) {
  return <CrosswordGrid cell={21} easy={easy} hard={hard} ring={ring} letters={false} />;
}
