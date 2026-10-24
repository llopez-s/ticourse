import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { OthersChip, PAPERS, type PaperDef } from './parts/Papers';
import { Stage, wordFrame } from './kit';

const S = 's06-papeles';
const TILE_W = 409;
const TILE_H = 408;
const TILE_GAP = 30;
const TILE_TOP = 46;
const CHIP_TOP = 494;

/** One paper's tile: number, icon, acronym (+ «o WO»), its English term and what it fixes, line by line. */
function Tile({ def, n, frame, at, sigAt, lineAt, focus }: { def: PaperDef; n: number; frame: number; at: number; sigAt: number; lineAt: number[]; focus: number }) {
  const inP = progress(frame, at - 4, 16);
  const sig = progress(frame, sigAt, 10);
  const lit = Math.max(sig * 0.6, focus);
  return (
    <div
      style={{
        position: 'absolute',
        left: (n - 1) * (TILE_W + TILE_GAP),
        top: TILE_TOP,
        width: TILE_W,
        height: TILE_H,
        boxSizing: 'border-box',
        borderRadius: 26,
        border: `3px solid ${alpha(C.cyan, 0.35 + 0.5 * lit)}`,
        background: `linear-gradient(180deg, ${alpha(C.ink850, 0.97)} 0%, ${alpha(C.ink900, 0.97)} 100%)`,
        boxShadow: lit > 0.1 ? `0 0 ${Math.round(34 * lit)}px ${alpha(C.cyan, 0.2 * lit)}` : undefined,
        fontFamily: FONT.sans,
        opacity: inP * (0.7 + 0.3 * focus),
        transform: `translateY(${(1 - inP) * 24}px)`,
      }}
    >
      <div style={{ position: 'absolute', left: 22, top: 18, width: 44, height: 44, borderRadius: 22, background: alpha(C.sky, 0.16), border: `2px solid ${alpha(C.sky, 0.8)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 900, color: C.sky }}>
        {n}
      </div>
      <div style={{ position: 'absolute', right: 24, top: 18 }}>
        <Icon name={def.icon} size={46} color={C.cyan} strokeWidth={2} />
      </div>
      <div style={{ position: 'absolute', left: 24, top: 74, display: 'flex', alignItems: 'baseline', gap: 16, whiteSpace: 'nowrap' }}>
        <span style={{ fontSize: 88, fontWeight: 900, letterSpacing: 1, lineHeight: 1, color: C.textStrong, textShadow: sig > 0.2 ? `0 0 ${Math.round(26 * sig)}px ${alpha(C.cyan, 0.35 * sig)}` : undefined }}>{def.sigla}</span>
        {def.alias ? <span style={{ fontSize: 36, fontWeight: 800, color: C.muted, opacity: sig }}>{def.alias}</span> : null}
      </div>
      <div style={{ position: 'absolute', left: 26, top: 172, fontSize: 26, fontWeight: 650, color: C.muted, whiteSpace: 'nowrap' }}>{def.term}</div>
      <div style={{ position: 'absolute', left: 26, top: 218, width: TILE_W - 48 }}>
        {def.lines.map((l, i) => {
          const on = progress(frame, lineAt[i], 10);
          return (
            <div key={l.text} style={{ fontSize: 30, fontWeight: 750, lineHeight: 1.26, color: i === 0 ? '#a5f3fc' : C.textStrong, whiteSpace: 'nowrap', opacity: 0.18 + 0.82 * on, transform: `translateY(${(1 - on) * 6}px)` }}>
              {l.text}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * s06-papeles «Cuatro papeles». Four dashed slots (1–4, the order they are signed in) wait from the first frame; each
 * tile comes into its slot on its cue — NDA (`nda`, «confidencialidad · antes de enseñar nada»), MSA (`msa`, the cover
 * of the relationship, written, never drawn as an umbrella: a flat sky band above it), SOW (`sow`, the band stretches
 * to cover it: each assignment hangs from the MSA; «o WO»), SLA (`sla`, what is measured) — and its lines light on the
 * voice's words. On `others` the chip «MOU: intención · MOA: compromisos repartidos · BPA: socios que reparten el
 * negocio» comes in below, MOU and MOA lit on their words and BPA on screen only.
 */
export function S06Papeles(props: SceneProps) {
  const frame = useCurrentFrame();
  const atCue = PAPERS.map((p) => props.cue(p.cue));
  const msaAt = props.cue('msa');
  const sowAt = props.cue('sow');
  const othersAt = props.cue('others');

  const sigAt = PAPERS.map((p) => wordFrame(S, p.seg, p.sigla) - 6);
  const lineAt = PAPERS.map((p, i) => p.lines.map((l) => (l.word ? Math.max(atCue[i] + 6, wordFrame(S, l.seg ?? p.seg, l.word) - 6 + (l.lag ?? 0)) : atCue[i] + 8)));
  // The tile in focus is the newest one; the chip takes the focus at `others`.
  const focus = PAPERS.map((_, i) => {
    const next = i < PAPERS.length - 1 ? atCue[i + 1] : othersAt;
    return progress(frame, atCue[i], 10) * (1 - 0.55 * progress(frame, next - 6, 14));
  });

  const slotIn = [0, 1, 2, 3].map((i) => progress(frame, 4 + i * 6, 14));
  const band = progress(frame, msaAt + 4, 18, EASE.inOut);
  const bandExtra = progress(frame, sowAt + 2, 22, EASE.inOut);

  const mouAt = wordFrame(S, 's06-05', 'MOU') - 6;
  const moaAt = wordFrame(S, 's06-05', 'MOA') - 6;
  const bpaAt = Math.max(moaAt + 40, wordFrame(S, 's06-05', 'compromisos') + 24);
  const chipIn = progress(frame, othersAt - 4, 16);
  const segOn = [0.35 + 0.65 * progress(frame, mouAt, 10), 0.35 + 0.65 * progress(frame, moaAt, 10), 0.35 + 0.65 * progress(frame, bpaAt, 10)];

  const tileX = (n: number) => (n - 1) * (TILE_W + TILE_GAP);
  const bandW = TILE_W + (TILE_W + TILE_GAP) * bandExtra;

  return (
    <Stage>
      {/* the four slots */}
      {PAPERS.map((p, i) => (
        <div
          key={p.key}
          style={{
            position: 'absolute',
            left: tileX(i + 1),
            top: TILE_TOP,
            width: TILE_W,
            height: TILE_H,
            boxSizing: 'border-box',
            borderRadius: 26,
            border: `3px dashed ${alpha(C.muted, 0.4)}`,
            opacity: slotIn[i] * (1 - progress(frame, atCue[i] - 2, 8)),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONT.sans,
            fontSize: 96,
            fontWeight: 900,
            color: alpha(C.muted, 0.35),
          }}
        >
          {i + 1}
        </div>
      ))}

      {/* the MSA's flat cover, never an umbrella: it spreads over its SOW */}
      {band > 0.01 ? (
        <div style={{ position: 'absolute', left: tileX(2), top: 8, width: bandW * band, height: 24, borderRadius: 12, background: `linear-gradient(90deg, ${alpha(C.sky, 0.55)} 0%, ${alpha(C.sky, 0.3)} 100%)`, border: `2px solid ${alpha(C.sky, 0.9)}`, boxShadow: `0 0 18px ${alpha(C.sky, 0.3)}` }} />
      ) : null}
      {band > 0.5 ? <div style={{ position: 'absolute', left: tileX(2) + 70, top: 32, width: 4, height: 18, background: alpha(C.sky, 0.9) }} /> : null}
      {bandExtra > 0.6 ? <div style={{ position: 'absolute', left: tileX(3) + 70, top: 32, width: 4, height: 18, background: alpha(C.sky, 0.9) }} /> : null}

      {PAPERS.map((p, i) => (
        <Tile key={p.key} def={p} n={i + 1} frame={frame} at={atCue[i]} sigAt={sigAt[i]} lineAt={lineAt[i]} focus={focus[i]} />
      ))}

      {chipIn > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: CHIP_TOP, opacity: chipIn, transform: `translateY(${(1 - chipIn) * 16}px)` }}>
          <OthersChip on={segOn} size={32} />
        </div>
      ) : null}
    </Stage>
  );
}
