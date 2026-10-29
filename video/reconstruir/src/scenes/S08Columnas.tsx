import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, clamp01 } from '../../../engine/src/ui';
import { Stage } from './kit';
import { CHRONO } from './parts/data';
import { HYPOTHESES, NOT_YET } from './parts/data-b';
import { CaseStamp } from './parts/CaseStamp';
import { ChronoTable } from './parts/Chronology';
import { COLS, ColumnFrame, ObservedRow, obsRowTop } from './parts/Columns';

/** The bracket that holds «the same observed rows» (rows 1 to 4: the block, the program, its connection, the ALLOW). */
const BRACKET = { x: 760, from: 1, to: 4 } as const;
const HYP_CARDS = [
  { top: 96, h: 150 },
  { top: 292, h: 196 },
] as const;

/**
 * s08-columnas «Tres columnas». The chronology of s06/s07 is on stage at first and gives way to three columns
 * (`three`): observado (cyan), hipótesis (amber), conclusión (emerald, empty). `observed`: the five rows drop into the
 * first column. `hypo` / `concl` light the other two names; the conclusion keeps «todavía no». `h1`, `h2`: one card
 * each in the hypothesis column, neither ever struck. `both`: a bracket holds the same observed rows and both cards
 * thread to it — they fit what is there, so for now they stay hypotheses.
 */
export function S08Columnas(props: SceneProps) {
  const frame = useCurrentFrame();
  const threeAt = props.cue('three');
  const observedAt = props.cue('observed');
  const hypoAt = props.cue('hypo');
  const conclAt = props.cue('concl');
  const h1At = props.cue('h1');
  const h2At = props.cue('h2');
  const bothAt = props.cue('both');

  const tableOut = progress(frame, threeAt - 4, 20, EASE.inOut);
  const colOn = [progress(frame, threeAt, 18), progress(frame, threeAt + 6, 18), progress(frame, threeAt + 12, 18)];
  const obsLit = progress(frame, observedAt - 4, 14);
  const hypLit = progress(frame, hypoAt - 4, 14);
  const conLit = progress(frame, conclAt - 4, 14);
  const rowOn = CHRONO.map((_, i) => progress(frame, observedAt + i * 7, 16));
  const cardOn = [progress(frame, h1At - 2, 16), progress(frame, h2At - 2, 16)];
  const bothP = progress(frame, bothAt, 26, EASE.inOut);
  const notYet = progress(frame, conclAt, 16);

  const rowsMid = (obsRowTop(BRACKET.from) + obsRowTop(BRACKET.to) + COLS.rowH) / 2;
  const bracketTop = obsRowTop(BRACKET.from) + 4;
  const bracketBottom = obsRowTop(BRACKET.to) + COLS.rowH - 4;

  return (
    <Stage>
      {/* the chronology, as the previous scenes left it */}
      {tableOut < 0.99 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - tableOut, transform: `translateX(${-30 * tableOut}px)` }}>
          <ChronoTable />
        </div>
      ) : null}

      <ColumnFrame col="obs" on={colOn[0]} lit={obsLit} />
      <ColumnFrame col="hyp" on={colOn[1]} lit={hypLit} />
      <ColumnFrame col="con" on={colOn[2]} lit={conLit}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 56,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            opacity: notYet,
            transform: `translateY(${(1 - notYet) * 10}px)`,
          }}
        >
          <Icon name="lock" size={64} color={C.muted} strokeWidth={2} />
          <div style={{ fontFamily: FONT.sans, fontSize: 56, fontWeight: 850, color: C.muted, letterSpacing: -0.5 }}>{NOT_YET}</div>
        </div>
      </ColumnFrame>

      {/* the five rows fall into «observado» */}
      {CHRONO.map((row, i) => {
        const inBracket = i >= BRACKET.from && i <= BRACKET.to;
        return <ObservedRow key={row.id} row={row} on={rowOn[i]} glow={inBracket ? bothP : 0} style={{ top: obsRowTop(i) }} />;
      })}

      {/* the two hypotheses */}
      {HYPOTHESES.map((h, k) => {
        const g = HYP_CARDS[k];
        return (
          <div
            key={h.id}
            style={{
              position: 'absolute',
              left: COLS.hyp.x + 16,
              top: g.top,
              width: COLS.hyp.w - 32,
              height: g.h,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              padding: '0 20px',
              borderRadius: RADIUS.md,
              border: `3px solid ${alpha(C.amber, 0.55 + 0.4 * bothP)}`,
              background: alpha(C.amber, 0.09),
              boxShadow: bothP > 0.02 ? `0 0 ${22 * bothP}px ${alpha(C.amber, 0.25 * bothP)}` : undefined,
              fontFamily: FONT.sans,
              opacity: cardOn[k],
              transform: `translateY(${(1 - cardOn[k]) * 16}px)`,
            }}
          >
            <div
              style={{
                flexShrink: 0,
                width: 62,
                height: 62,
                borderRadius: 31,
                background: alpha(C.amber, 0.2),
                border: `3px solid ${C.amber}`,
                display: 'grid',
                placeItems: 'center',
                fontSize: 30,
                fontWeight: 850,
                color: C.amber,
              }}
            >
              {h.id}
            </div>
            <div style={{ fontSize: 33, fontWeight: 650, lineHeight: 1.22, color: C.textStrong }}>{h.text}</div>
          </div>
        );
      })}

      {/* the bracket: both hypotheses fit the same observed rows */}
      {bothP > 0.01 ? (
        <svg width={1728} height={600} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
          {/* the bracket along the rows */}
          <path
            d={`M ${BRACKET.x - 14} ${bracketTop} H ${BRACKET.x} V ${bracketTop + (bracketBottom - bracketTop) * bothP} H ${BRACKET.x - 14}`}
            fill="none"
            stroke={C.amber}
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* a thread from each card to the middle of the bracket */}
          {HYP_CARDS.map((g, k) => {
            const y0 = g.top + g.h / 2;
            const x0 = COLS.hyp.x + 16;
            const d = `M ${x0} ${y0} C ${x0 - 40} ${y0}, ${BRACKET.x + 36} ${rowsMid}, ${BRACKET.x} ${rowsMid}`;
            return (
              <g key={k} opacity={clamp01(bothP * 1.4)}>
                <path d={d} fill="none" stroke={alpha(C.amber, 0.3)} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - bothP} />
                <path d={d} fill="none" stroke={C.amber} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - bothP} />
              </g>
            );
          })}
        </svg>
      ) : null}

      <CaseStamp frame={frame} />
    </Stage>
  );
}
