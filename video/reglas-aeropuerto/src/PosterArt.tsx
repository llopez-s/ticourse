import { C, FONT, RADIUS, alpha } from '../../engine/src/theme/tokens';
import { GATE_ASPECT, Gate, SCANNER_ASPECT, Scanner } from './scenes/parts/Airport';

/** Sizes of the two pieces and of the whole image (px). */
const SCAN_W = 640;
const GATE_W = 600;
const GATE_X = 250;
const GATE_Y = Math.round(SCAN_W * SCANNER_ASPECT) + 4;

export const POSTER_ART = { w: GATE_X + GATE_W, h: GATE_Y + Math.round(GATE_W * GATE_ASPECT) } as const;

/**
 * The video in one image, drawn with the scenes' own airport: the baggage scanner (YARA) looking inside a
 * suitcase, its lamp lit on the rare engraved part (a correct hit, emerald), and below it the boarding gate
 * whose logbook is READ by the analyst's magnifying glass (Sigma). No hash, no date, no host.
 */
export function PosterArt() {
  return (
    <div style={{ position: 'relative', width: POSTER_ART.w, height: POSTER_ART.h }}>
      <div style={{ position: 'absolute', left: -120, top: -60, width: POSTER_ART.w + 240, height: POSTER_ART.h + 120, background: `radial-gradient(closest-side, ${alpha(C.cyan, 0.1)} 0%, transparent 100%)` }} />
      <div style={{ position: 'absolute', left: 0, top: 0 }}>
        <Scanner width={SCAN_W} items={['bottle', 'rare', 'umbrella']} flag={1} flagTone={C.emerald} beep={1} beepTone={C.emerald} />
      </div>
      <div style={{ position: 'absolute', left: GATE_X, top: GATE_Y }}>
        <Gate width={GATE_W} pass={0.72} write={1} lines={3} lens={1} />
      </div>
      <Tag text="YARA" left={SCAN_W * 0.74 + 22} top={SCAN_W * SCANNER_ASPECT * 0.24} />
      {/* over the logbook the glass reads, not over the gate that writes it */}
      <Tag text="Sigma" left={GATE_X + GATE_W * (400 / 680)} top={GATE_Y + 12} />
    </div>
  );
}

function Tag({ text, left, top }: { text: string; left: number; top: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        padding: '6px 22px',
        borderRadius: RADIUS.pill,
        border: `2.5px solid ${alpha(C.cyan, 0.85)}`,
        background: alpha(C.ink900, 0.85),
        color: C.cyanSoft,
        fontFamily: FONT.sans,
        fontSize: 44,
        fontWeight: 800,
        lineHeight: 1.15,
        whiteSpace: 'nowrap',
        boxShadow: `0 0 24px ${alpha(C.cyan, 0.25)}`,
      }}
    >
      {text}
    </div>
  );
}
