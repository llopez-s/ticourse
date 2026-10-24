import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { POSTER } from './data/poster';
import { DocSheet, QuotedVoice } from './scenes/parts/Bits';

ensureFonts();

/** The third party's document, right side (absolute 1920×1080 coordinates). */
const DOC = { x: 1210, y: 150, w: 560 };

/**
 * Poster / YouTube thumbnail for «Una orden escondida en un documento». Big
 * two-line title on the left; on the right the video's one image: a third
 * party's document whose hidden paragraph is a rose, padlocked bar (never
 * legible), with BORROWED VOICE's quoted-voice glyph next to it (no figure).
 * The exam plaque says only «SY0-801 · borrador».
 */
export function Poster() {
  const left = LAYOUT.marginX;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />

      <div style={{ position: 'absolute', left: DOC.x, top: DOC.y, transform: 'rotate(3deg)', filter: `drop-shadow(0 30px 60px ${alpha('#000000', 0.5)})` }}>
        <DocSheet width={DOC.w} title={POSTER.doc} hidden={1} alarm={1} />
      </div>

      {/* BORROWED VOICE: the quoted voice, never a portrait */}
      <div style={{ position: 'absolute', left: DOC.x - 150, top: 610, display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ width: 150, height: 150, borderRadius: 75, display: 'grid', placeItems: 'center', border: `4px solid ${alpha(C.rose, 0.85)}`, background: alpha(C.roseDeep, 0.92), boxShadow: `0 0 50px ${alpha(C.rose, 0.4)}` }}>
          <QuotedVoice size={104} glow={1} />
        </div>
      </div>
      <div style={{ position: 'absolute', left: DOC.x - 150, top: 780, fontFamily: FONT.mono, fontSize: 40, fontWeight: 800, letterSpacing: 1, color: C.roseSoft, whiteSpace: 'nowrap' }}>{POSTER.adversary}</div>

      {/* brand */}
      <div style={{ position: 'absolute', left, top: 220, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>{POSTER.brand}</span>
      </div>

      {/* title, two lines for thumbnail legibility */}
      <div style={{ position: 'absolute', left: left - 6, top: 268, fontWeight: 850, letterSpacing: -2.5, color: C.textStrong }}>
        <div style={{ fontSize: 100, lineHeight: 1.08, whiteSpace: 'nowrap' }}>{POSTER.title[0]}</div>
        <div style={{ fontSize: 100, lineHeight: 1.08, color: C.cyan, whiteSpace: 'nowrap' }}>{POSTER.title[1]}</div>
      </div>

      {/* subtitle */}
      <div style={{ position: 'absolute', left, top: 520, fontSize: 42, fontWeight: 650, lineHeight: 1.2, color: C.text, whiteSpace: 'nowrap' }}>{POSTER.sub}</div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 620, display: 'flex', gap: 14 }}>
        <Chip accent="violet" icon="mortarboard" size={30}>
          {POSTER.plaque}
        </Chip>
        <Chip accent="muted" icon="clock" size={30}>
          {POSTER.length}
        </Chip>
      </div>

      {/* disclaimer */}
      <div style={{ position: 'absolute', left, top: 986, fontSize: TYPE.micro, fontWeight: 550, color: C.faint }}>{POSTER.disclaimer}</div>
    </AbsoluteFill>
  );
}
