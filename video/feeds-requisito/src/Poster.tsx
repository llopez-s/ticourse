import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { FEED_IDS } from './scenes/parts/bits';
import { FeedName, Meter } from './scenes/parts/feeds';

ensureFonts();

/** R1 pilot figures per feed (useful of 100 reviewed, and how many of them were new), as in the lesson. */
const BARS = { faro: [60, 40], atlas: [90, 3], eco: [80, 1] } as const;

/**
 * Poster / YouTube thumbnail for «Tres feeds, dos preguntas». Title on the left; on the right the same three
 * fictitious feeds as bars — the sky part is what was useful, the green part what was new to Meridian — so the
 * biggest bar is not the one that wins. Requirement chips R1/R2 sit above.
 */
export function Poster() {
  const left = LAYOUT.marginX;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />
      <div style={{ position: 'absolute', left: 1040, top: 190, width: 780 }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 40 }}>
          <Chip accent="cyan" size={34}>R1 · antes de 24 h</Chip>
          <Chip accent="muted" size={34}>R2 · 90 días atrás</Chip>
        </div>
        {FEED_IDS.map((id) => (
          <div key={id} style={{ marginBottom: 54 }}>
            <FeedName id={id} size={46} />
            <div style={{ marginTop: 18 }}>
              <Meter value={BARS[id][1]} max={100} w={760} h={46} tone="emerald" ghost={BARS[id][0]} />
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', gap: 28, fontSize: 30, fontWeight: 650, color: C.muted }}>
          <span><span style={{ display: 'inline-block', width: 20, height: 20, borderRadius: 10, background: alpha(C.sky, 0.6), marginRight: 10 }} />útiles</span>
          <span><span style={{ display: 'inline-block', width: 20, height: 20, borderRadius: 10, background: C.emerald, marginRight: 10 }} />nuevos para Meridian</span>
        </div>
      </div>

      <div style={{ position: 'absolute', left, top: 250, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>
      <div style={{ position: 'absolute', left: left - 6, top: 298, fontWeight: 850, letterSpacing: -2.5, color: C.textStrong }}>
        <div style={{ fontSize: 112, lineHeight: 1.04, whiteSpace: 'nowrap' }}>Tres feeds,</div>
        <div style={{ fontSize: 112, lineHeight: 1.04, color: C.cyan, whiteSpace: 'nowrap' }}>dos preguntas</div>
      </div>
      <div style={{ position: 'absolute', left, top: 562, fontSize: 46, fontWeight: 650, lineHeight: 1.2, color: C.text, whiteSpace: 'nowrap' }}>comprar información que añada valor</div>
      <div style={{ position: 'absolute', left, top: 676, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="amber" icon="flag" size={30}>Práctica complementaria</Chip>
          <Chip accent="muted" icon="clock" size={30}>~9 min</Chip>
        </div>
        <Chip accent="muted" size={26} style={{ color: C.muted }}>Datos ficticios</Chip>
      </div>
      <div style={{ position: 'absolute', left, top: 986, fontSize: TYPE.micro, fontWeight: 550, color: C.faint }}>
        Material independiente, no afiliado a SANS/GIAC.
      </div>
    </AbsoluteFill>
  );
}
