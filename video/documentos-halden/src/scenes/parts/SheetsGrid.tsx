import { C, FONT } from '../../../../engine/src/theme/tokens';
import { Icon } from '../../../../engine/src/ui';
import { DOC_NAMES, DOC_ORDER, OBLIGES, type DocKind } from '../../data/canon';
import { Bars, PAPER, Sheet } from './Paper';

/** Natural size of the grid (px): the video in one image, four sheets and what each answers to «¿obliga?». */
export const GRID = { w: 640, h: 520, sw: 300, sh: 240, gap: 24 } as const;

const TILT: Record<DocKind, number> = { policy: -3, standard: 2.5, procedure: 2, guideline: -2.5 };

function Stamp({ obliga }: { obliga: boolean }) {
  const ink = obliga ? PAPER.right : PAPER.wrong;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        height: 44,
        padding: '0 16px 0 10px',
        boxSizing: 'border-box',
        borderRadius: 10,
        border: `3px solid ${ink}`,
        color: ink,
        fontFamily: FONT.sans,
        fontSize: 26,
        fontWeight: 900,
        letterSpacing: 2,
        whiteSpace: 'nowrap',
        transform: 'rotate(-4deg)',
      }}
    >
      <Icon name={obliga ? 'check' : 'x'} size={28} color={ink} strokeWidth={3.4} />
      {obliga ? 'OBLIGA' : 'NO OBLIGA'}
    </div>
  );
}

/** 2×2 sheets, each headed with its real name and stamped with whether it obliges. */
export function SheetsGrid({ scale = 1, glow = 0 }: { scale?: number; glow?: number }) {
  return (
    <div style={{ position: 'relative', width: GRID.w * scale, height: GRID.h * scale }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: GRID.w, height: GRID.h, transform: `scale(${scale})`, transformOrigin: '0 0' }}>
        {DOC_ORDER.map((kind, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          return (
            <div key={kind} style={{ position: 'absolute', left: col * (GRID.sw + GRID.gap) + 20, top: row * (GRID.sh + GRID.gap) + 16 }}>
              <Sheet width={GRID.sw} height={GRID.sh} heading={DOC_NAMES[kind]} headingSize={28} tilt={TILT[kind]} glow={glow} glowTone={C.cyan}>
                <Bars set={i} count={2} gap={14} height={12} />
                <div style={{ position: 'absolute', right: 0, bottom: 6 }}>
                  <Stamp obliga={OBLIGES[kind]} />
                </div>
              </Sheet>
            </div>
          );
        })}
      </div>
    </div>
  );
}
