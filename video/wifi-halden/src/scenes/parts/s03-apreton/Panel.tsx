import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { G, S03 } from '../../../data/s03-apreton';
import { STEEL } from '../Glyphs';
import { ExamTag, Txt } from './bits';

const P = G.panel;
/** Left edge of the header text, clear of the glyph that sits in the panel's corner. */
const HEAD_X = P.x + 146;

function Frame({ border, bg, opacity }: { border: string; bg: string; opacity: number }) {
  if (opacity <= 0.001) return null;
  return <div style={{ position: 'absolute', left: P.x, top: P.y, width: P.w, height: P.h, boxSizing: 'border-box', borderRadius: 22, border, background: bg, opacity }} />;
}

/**
 * The right-hand panel and its header, in its three lives:
 * - `screen` — what the test laptop is recording (its window: `ptl-pruebas-02` · «captura»);
 * - `home` — «a casa · sin conexión con la red»: somewhere else, hypothetical (dashed grey), OFFLINE;
 * - `tape` — «tráfico grabado ayer».
 * Each weight is 0–1; the bodies are drawn by the scene on top.
 */
export function Panel({
  screen,
  home,
  tape,
  homeDim,
  offlineTag,
  offlineLit,
}: {
  screen: number;
  home: number;
  tape: number;
  /** 0–1: the «a casa» header steps back (nothing left to try there). */
  homeDim: number;
  offlineTag: number;
  offlineLit: number;
}) {
  const homeText = home * (1 - 0.5 * homeDim);
  return (
    <>
      <Frame opacity={screen} border={`2px solid ${alpha(C.cyan, 0.45)}`} bg={alpha(C.ink850, 0.85)} />
      <Frame opacity={home} border={`3px dashed ${STEEL.line}`} bg={alpha(C.ink900, 0.7)} />
      <Frame opacity={tape} border={`2px solid ${STEEL.line}`} bg={alpha(C.ink850, 0.85)} />

      {/* the laptop's window */}
      <Txt x={P.x + 28} y={P.y + 20} size={26} mono weight={600} color={C.cyanSoft} opacity={screen}>
        {S03.laptopHost}
      </Txt>
      <Txt x={P.x + 28} y={P.y + 56} size={40} weight={800} color={C.textStrong} opacity={screen}>
        {S03.capture}
      </Txt>
      {screen > 0.001 ? <div style={{ position: 'absolute', left: P.x + 2, top: P.y + 116, width: P.w - 4, height: 2, background: alpha(C.cyan, 0.25), opacity: screen }} /> : null}

      {/* somewhere else */}
      <Txt x={HEAD_X} y={P.y + 14} size={42} weight={850} color={C.textStrong} opacity={homeText}>
        {S03.home}
      </Txt>
      <Txt x={HEAD_X} y={P.y + 66} size={32} weight={700} color={C.text} opacity={homeText}>
        {S03.offline}
      </Txt>
      {offlineTag > 0.001 ? (
        <div style={{ position: 'absolute', left: P.x + P.w - 22, top: P.y + 14, transform: `translateX(-100%) scale(${0.9 + 0.1 * offlineTag})`, transformOrigin: '100% 50%', opacity: offlineTag * home * (1 - 0.5 * homeDim) }}>
          <ExamTag size={32} lit={offlineLit}>
            {S03.offlineExam}
          </ExamTag>
        </div>
      ) : null}

      {/* yesterday's traffic */}
      <Txt x={HEAD_X} y={P.y + 34} size={40} weight={850} color={C.textStrong} opacity={tape}>
        {S03.tape}
      </Txt>
    </>
  );
}
