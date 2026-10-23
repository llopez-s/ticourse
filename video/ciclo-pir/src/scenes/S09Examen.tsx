import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { S09_CARD, S09_ROWS, S09_SAYS, S09_STAMP } from '../data/s09-examen';
import { StationGlyph } from './parts/Glyphs';
import { Stage, wordFrame } from './kit';

const S = 's09-examen';
const W = STAGE.width;
const ROW = { y: 168, h: 108, gap: 14, nameW: 640 } as const;

/**
 * s09-examen «Fíjate en el verbo». On `verbs` the card of a generic classification question: «Actividad:
 * normalizar los registros recogidos» and, in a column, the three phases it could be. The verb is underlined as the
 * voice says «verbo». On `words` the three rows light one by one with the lesson's keywords — convert · decode ·
 * translate · normalize · detonate with Processing & Exploitation; judgment · assessment · hypothesis with Analysis &
 * Production; requirements · tasking with Planning & Direction — and the verb of the activity answers when the voice
 * reaches «normalizar». «manda lo que se hace con el dato» follows the voice; on `direct` the stamp «los
 * requirements dirigen la colección, no al revés», with the comanda station pointing at the market one. No question
 * of the bank.
 */
export function S09Examen(props: SceneProps) {
  const frame = useCurrentFrame();
  const verbsAt = props.cue('verbs');
  const wordsAt = props.cue('words');
  const directAt = props.cue('direct');
  const at = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const p = (start: number, dur = 14) => progress(frame, start, dur);

  const cardIn = p(verbsAt - 4, 18);
  const verbUnder = p(at('s09-01', 'verbo') - 4, 14);
  const rowsIn = S09_ROWS.map((_, i) => p(verbsAt + 10 + i * 8, 16));
  // The first row lights with the cue (`words`); the others on their own words.
  const rowAt = S09_ROWS.map((r, i) => (i === 0 ? Math.min(wordsAt + 4, at('s09-02', r.word) - 8) : at('s09-02', r.word) - 8));
  const lit = S09_ROWS.map((_, i) => progress(frame, rowAt[i], 10) * (1 - progress(frame, (rowAt[i + 1] ?? directAt) - 4, 12, EASE.inOut)));
  const rowDone = S09_ROWS.map((_, i) => progress(frame, rowAt[i], 10));
  const verbPulse = progress(frame, at('s09-02', 'normalizar') - 6, 10) * (1 - progress(frame, at('s09-02', 'normalizar') + 40, 20));
  const saysIn = enter(frame, at('s09-03', 'manda') - 6, { distance: 12, duration: 16 });
  const direct = p(directAt - 2, 16);
  const fadeRows = 0.6 * direct;

  return (
    <Stage>
      {/* The card of a classification question */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, opacity: cardIn, transform: `translateY(${(1 - cardIn) * 16}px)` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 26, padding: '0 6px', fontFamily: FONT.sans }}>
          <span style={{ display: 'inline-block', padding: '5px 24px 7px', borderRadius: RADIUS.pill, border: `2px solid ${alpha(C.sky, 0.8)}`, background: alpha(C.sky, 0.1), fontSize: 30, fontWeight: 800, color: '#bae6fd', whiteSpace: 'nowrap' }}>{S09_CARD.tag}</span>
        </div>
        <div style={{ marginTop: 26, display: 'flex', alignItems: 'baseline', gap: 20, fontFamily: FONT.sans, fontSize: 56, fontWeight: 850, letterSpacing: -1, color: C.textStrong, whiteSpace: 'nowrap', padding: '0 6px' }}>
          <span style={{ color: C.muted, fontWeight: 700 }}>{S09_CARD.activity[0]}</span>
          <span style={{ position: 'relative', color: verbPulse > 0.3 ? C.amber : C.textStrong, textShadow: verbPulse > 0.02 ? `0 0 ${Math.round(26 * verbPulse)}px ${alpha(C.amber, 0.7 * verbPulse)}` : undefined }}>
            {S09_CARD.activity[1]}
            <span style={{ position: 'absolute', left: 0, bottom: -8, height: 6, width: `${verbUnder * 100}%`, borderRadius: 3, background: C.amber }} />
          </span>
          <span>{S09_CARD.activity[2]}</span>
          <span style={{ color: C.amber, marginLeft: 12 }}>{S09_CARD.ask}</span>
        </div>
      </div>

      {/* The three phases it could be, and the keywords that give them away */}
      {S09_ROWS.map((r, i) => {
        const l = lit[i];
        const done = rowDone[i];
        const top = ROW.y + i * (ROW.h + ROW.gap);
        return (
          <div
            key={r.phase}
            style={{
              position: 'absolute',
              left: 0,
              top,
              width: W,
              height: ROW.h,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              padding: '0 28px',
              borderRadius: RADIUS.lg,
              border: `${l > 0.4 ? 3 : 2}px solid ${alpha(C.cyan, 0.3 + 0.6 * l)}`,
              background: `linear-gradient(90deg, ${alpha(C.cyan, 0.05 + 0.1 * l)} 0%, ${alpha(C.ink900, 0.96)} 70%)`,
              boxShadow: l > 0.05 ? `0 0 ${Math.round(34 * l)}px ${alpha(C.cyan, 0.25 * l)}` : undefined,
              fontFamily: FONT.sans,
              opacity: rowsIn[i] * (1 - fadeRows) * (0.7 + 0.3 * Math.max(l, 1 - done)),
              transform: `translateY(${(1 - rowsIn[i]) * 18}px)`,
            }}
          >
            <div style={{ width: ROW.nameW, display: 'flex', alignItems: 'center', gap: 22 }}>
              <StationGlyph kind={r.kind} size={64} color={l > 0.3 || done > 0.5 ? C.cyan : C.muted} />
              <span style={{ fontSize: 44, fontWeight: 850, letterSpacing: -0.6, color: C.textStrong, whiteSpace: 'nowrap' }}>{r.phase}</span>
            </div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'nowrap' }}>
              {r.words.map((w, k) => {
                const e = enter(frame, rowAt[i] + 4 + k * 5, { distance: 10, duration: 12 });
                return (
                  <span key={w} style={{ padding: '4px 20px 6px', borderRadius: RADIUS.pill, border: `2px solid ${alpha(C.cyan, 0.7)}`, background: alpha(C.cyan, 0.12), fontFamily: FONT.mono, fontSize: 30, fontWeight: 700, color: C.cyanSoft, whiteSpace: 'nowrap', ...e }}>
                    {w}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* The word alone does not decide */}
      {saysIn.opacity > 0.01 && direct < 0.99 ? (
        <div style={{ position: 'absolute', left: 0, top: ROW.y + 3 * (ROW.h + ROW.gap) + 4, width: W, textAlign: 'center', fontFamily: FONT.sans, fontSize: 46, fontWeight: 850, color: C.textStrong, opacity: saysIn.opacity * (1 - direct), transform: saysIn.transform }}>
          {S09_SAYS}
        </div>
      ) : null}

      {/* The stamp: requirements direct collection, not the other way round */}
      {direct > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: ROW.y + 3 * (ROW.h + ROW.gap) - 6, width: W, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 34, opacity: direct, transform: `scale(${1 + (1 - direct) * 0.08})` }}>
          <StationGlyph kind="ticket" size={84} color={C.cyan} />
          <Icon name="arrowRight" size={64} color={C.cyan} strokeWidth={3} />
          <StationGlyph kind="basket" size={84} color={C.cyan} />
          <span style={{ marginLeft: 14, display: 'inline-block', padding: '10px 38px 14px', borderRadius: RADIUS.md, border: `5px solid ${alpha(C.cyan, 0.9)}`, background: alpha(C.cyan, 0.1), fontFamily: FONT.sans, fontSize: 50, fontWeight: 900, letterSpacing: -0.8, color: C.textStrong, whiteSpace: 'nowrap', transform: 'rotate(-1.2deg)' }}>{S09_STAMP}</span>
        </div>
      ) : null}
    </Stage>
  );
}
