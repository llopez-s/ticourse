import { C, alpha } from '../../../../../engine/src/theme/tokens';

const STEEL = '#cbd5e1';
/** The sender chip's dashes: light, so the empty chip still reads on the row. */
const GHOST = '#cbd5e1';

/**
 * A hypothetical e-mail: an envelope and, clipped to its corner, its sender chip, dashed and EMPTY (a
 * domain that is not on the list: no name, no text, nothing that reads as a redaction). `w` px wide,
 * 0.8 × w tall. `warn` 0–1 turns the envelope amber (it got in); the chip stays grey. No text at all.
 */
export function Envelope({ w = 96, warn = 0, opacity = 1 }: { w?: number; warn?: number; opacity?: number }) {
  if (opacity <= 0.004) return null;
  const tone = warn > 0.5 ? C.amber : STEEL;
  return (
    <svg width={w} height={w * 0.8} viewBox="0 0 100 80" style={{ display: 'block', overflow: 'visible', opacity }}>
      {warn > 0.02 ? <rect x={-2} y={12} width={104} height={70} rx={12} fill={alpha(C.amber, 0.16 * warn)} /> : null}
      {/* envelope */}
      <rect x={3} y={17} width={94} height={60} rx={7} fill="#1a2740" stroke={tone} strokeWidth={4} />
      <path d="M5 21 L50 54 L95 21" fill="none" stroke={tone} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 73 L36 47 M93 73 L64 47" fill="none" stroke={alpha(tone, 0.55)} strokeWidth={3} strokeLinecap="round" />
      {/* sender chip: a dashed, empty pill with an empty avatar */}
      <rect x={-8} y={0} width={74} height={25} rx={12.5} fill={C.ink950} stroke={GHOST} strokeWidth={3} strokeDasharray="7 5" />
      <circle cx={6} cy={12.5} r={6} fill="none" stroke={GHOST} strokeWidth={2.5} strokeDasharray="3 3" />
    </svg>
  );
}
