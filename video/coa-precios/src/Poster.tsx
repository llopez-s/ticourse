import type { ReactNode } from 'react';
import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';
import { POSTER_ART, PosterArt } from './PosterArt';

ensureFonts();

/** The image on the right (absolute 1920×1080 coordinates). */
const ART = { x: 1920 - LAYOUT.marginX - POSTER_ART.w + 40, y: 296 } as const;

/** This video's colour meanings: emerald stops, cyan looks, amber is the price, violet is an exam name. */
const TONE = { cut: '#34d399', look: C.cyan, price: '#fcd34d', exam: '#c4b5fd' } as const;

/**
 * Poster / YouTube thumbnail for «Courses of Action: ¿cortas o miras?». The series' layout: the brand,
 * the question huge on two lines for small-size legibility (each verb in its colour), the rest of the
 * title under it, the objective and length chips. On the right, ONE image from the video: the shop,
 * the suspect on his walkie and the two options (PosterArt). No domain, date or machine name, and
 * nothing decided.
 */
export function Poster() {
  const left = LAYOUT.marginX;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />

      <div style={{ position: 'absolute', left: ART.x, top: ART.y }}>
        <PosterArt />
      </div>

      {/* brand */}
      <div style={{ position: 'absolute', left, top: 226, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>

      {/* title: the question, two lines for thumbnail legibility */}
      <div style={{ position: 'absolute', left: left - 8, top: 266, fontSize: 168, fontWeight: 850, letterSpacing: -6, lineHeight: 1, color: C.textStrong, whiteSpace: 'nowrap' }}>
        <div>
          ¿<Word color={TONE.cut}>Cortas</Word>
        </div>
        <div>
          o <Word color={TONE.look}>miras</Word>?
        </div>
      </div>

      {/* the rest of the title: the exam name and what the video adds to it */}
      <div style={{ position: 'absolute', left, top: 626, fontSize: 54, fontWeight: 700, letterSpacing: -1, lineHeight: 1.18, color: C.text, whiteSpace: 'nowrap' }}>
        <div>
          <Word color={TONE.exam}>Courses of Action</Word>:
        </div>
        <div>
          <Word color={TONE.price}>cuánto cuesta</Word> cada acción
        </div>
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 790, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="violet" icon="mortarboard" size={30}>
            GCTI · Intrusion Analysis
          </Chip>
          <Chip accent="muted" icon="clock" size={30}>
            ~4 min
          </Chip>
        </div>
        <Chip accent="muted" size={26} style={{ color: C.muted }}>
          {SIMULATION_LABEL}
        </Chip>
      </div>

      {/* disclaimer */}
      <div style={{ position: 'absolute', left, top: 986, fontSize: TYPE.micro, fontWeight: 550, color: C.faint }}>
        Material independiente, no afiliado a SANS/GIAC.
      </div>
    </AbsoluteFill>
  );
}

function Word({ children, color }: { children: ReactNode; color: string }) {
  return <span style={{ color, fontWeight: 850 }}>{children}</span>;
}
