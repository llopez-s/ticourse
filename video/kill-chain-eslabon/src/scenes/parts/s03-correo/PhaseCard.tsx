import { C, FONT } from '../../../../../engine/src/theme/tokens';
import { clamp01, dimStyle } from '../../../../../engine/src/ui';
import { PhaseTitle, Vignette, vignetteHeight, type PhaseId, type VignetteLook } from '../KillChain';

/**
 * The right-hand column of s03/s04: a phase's vignette (the shared drawing of
 * ../KillChain) lighting up, its violet upper-case entrance (`PhaseTitle`) and
 * the voice's gloss under it. The gloss may land before the name (s03 says
 * «el artefacto» before «Delivery»), so it is drawn apart from the title, in a
 * reserved place.
 */
export function PhaseCard({
  phase,
  width,
  vignetteW = width - 40,
  look = {},
  titleIn = 0,
  titleSize = 42,
  gloss = [],
  glossIn = 0,
  glossSize = 34,
  dim = 0,
}: {
  phase: PhaseId;
  width: number;
  vignetteW?: number;
  look?: VignetteLook;
  titleIn?: number;
  titleSize?: number;
  gloss?: readonly string[];
  glossIn?: number;
  glossSize?: number;
  dim?: number;
}) {
  const g = clamp01(glossIn);
  const titleH = Math.round(titleSize * 1.32);
  return (
    <div style={{ position: 'relative', width, ...dimStyle(dim) }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Vignette phase={phase} width={vignetteW} look={look} />
      </div>
      <div style={{ marginTop: 16, height: titleH, display: 'flex', justifyContent: 'center' }}>
        <PhaseTitle phase={phase} show={titleIn} size={titleSize} align="center" />
      </div>
      <div style={{ marginTop: 10, textAlign: 'center', opacity: g, transform: `translateY(${(1 - g) * 10}px)` }}>
        {gloss.map((line) => (
          <div key={line} style={{ fontFamily: FONT.sans, fontSize: glossSize, fontWeight: 650, lineHeight: 1.2, color: C.text, whiteSpace: 'nowrap' }}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Height (px) of the vignette + title part of a PhaseCard (the gloss goes under it). */
export function phaseCardTop(vignetteW: number, titleSize = 42): number {
  return vignetteHeight(vignetteW) + 16 + Math.round(titleSize * 1.32);
}
