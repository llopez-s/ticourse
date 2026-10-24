import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { enter, progress } from '../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../engine/src/ui';
import { NO_ACCESS } from '../data/canon';
import { CANDIDATES, CARD_GAP, CARD_W, CandidateCard, NurseryNote, ScopeQuestions, SealTags } from './parts/s02-pruebas/Cards';
import { Stage, wordFrame } from './kit';

const S = 's02-pruebas';
const ROW_B = 128;
const ROW_C = 556;

/** A two-line chip of the bottom row: the question above, the exam term below (lit on its word). */
function AskChip({ icon, ask, term, tone, on, at, frame }: { icon: IconName; ask: string; term: string; tone: string; on: number; at: number; frame: number }) {
  const e = enter(frame, at, { distance: 18 });
  return (
    <div
      style={{
        width: 843,
        height: 92,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: '0 26px',
        borderRadius: 22,
        border: `2px solid ${alpha(tone, 0.4 + 0.5 * on)}`,
        background: alpha(tone, 0.06 + 0.1 * on),
        boxShadow: on > 0.05 ? `0 0 ${Math.round(24 * on)}px ${alpha(tone, 0.28 * on)}` : undefined,
        fontFamily: FONT.sans,
        ...e,
      }}
    >
      <Icon name={icon} size={46} color={tone} strokeWidth={2} />
      <div style={{ whiteSpace: 'nowrap' }}>
        <div style={{ fontSize: 30, fontWeight: 650, color: C.muted, lineHeight: 1.15 }}>{ask}</div>
        <div style={{ fontSize: 38, fontWeight: 850, color: C.textStrong, lineHeight: 1.15 }}>{term}</div>
      </div>
    </div>
  );
}

/**
 * s02-pruebas «Tres candidatas, tres pruebas». On `case` the agency the port is looking for comes in («Agencia de
 * traducción», its documents); on `no-access` the fixed label «no entra en ningún sistema del puerto». On `three` three
 * empty slots wait; each fills on its cue — the questionnaire (`questionnaire`, with «lo dice ella»; on `nursery` the
 * nursery's leaflet beside it, tagged as an image), the internal audits (`internal`, «lo escribe la interesada») and
 * the independent assessment (`independent`, «de fuera, sin vínculo con ella», its «SOC 2 Type II» / «ISO 27001» only
 * on screen, and on `scope-period` the two questions «¿qué cubre?» «¿qué meses?», lit on the voice's words). On `chips`
 * the bottom row brings the two questions that follow: supply chain analysis and right-to-audit clause.
 */
export function S02Pruebas(props: SceneProps) {
  const frame = useCurrentFrame();
  const caseAt = props.cue('case');
  const noAccessAt = props.cue('no-access');
  const threeAt = props.cue('three');
  const qAt = props.cue('questionnaire');
  const nurseryAt = props.cue('nursery');
  const internalAt = props.cue('internal');
  const indepAt = props.cue('independent');
  const scopeAt = props.cue('scope-period');
  const chipsAt = props.cue('chips');

  const termAt = [wordFrame(S, 's02-02', 'questionnaire') - 6, wordFrame(S, 's02-03', 'evidence') - 6, wordFrame(S, 's02-04', 'independent') - 6];
  const sayAt = [wordFrame(S, 's02-02', 'dice') - 6, wordFrame(S, 's02-03', 'escribe') - 6, wordFrame(S, 's02-04', 'vínculo') - 6];
  const artAt = [qAt - 4, internalAt - 4, indepAt - 4];
  const tagsAt = wordFrame(S, 's02-04', 'pesa') - 6;
  const cubreAt = wordFrame(S, 's02-04', 'cubre') - 6;
  const mesesAt = wordFrame(S, 's02-04', 'meses') - 6;
  const askAt = [chipsAt - 4, Math.max(chipsAt + 24, wordFrame(S, 's02-05', 'quieres') - 8)];
  const supplyAt = wordFrame(S, 's02-05', 'supply') - 6;
  const rightAt = wordFrame(S, 's02-05', 'right-to-audit') - 6;

  const caseIn = enter(frame, caseAt - 2, { distance: 18 });
  const noIn = progress(frame, noAccessAt - 4, 16);

  const slot = [0, 1, 2].map((i) => progress(frame, threeAt + i * 6, 16));
  const a = artAt.map((t) => progress(frame, t, 16));
  const term = termAt.map((t) => progress(frame, t, 12));
  const say = sayAt.map((t) => progress(frame, t, 12));
  const focus = [
    a[0] * (1 - 0.65 * progress(frame, artAt[1], 12)),
    a[1] * (1 - 0.65 * progress(frame, artAt[2], 12)),
    a[2] * (1 - 0.45 * progress(frame, chipsAt - 6, 14)),
  ];

  return (
    <Stage>
      {/* row A: the case */}
      <div style={{ position: 'absolute', left: 0, top: 0, display: 'flex', alignItems: 'center', gap: 22, height: 104, fontFamily: FONT.sans, ...caseIn }}>
        <div style={{ width: 82, height: 82, borderRadius: 41, background: alpha(C.sky, 0.14), border: `3px solid ${alpha(C.sky, 0.8)}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="globe" size={48} color={C.sky} strokeWidth={2} />
        </div>
        <div style={{ whiteSpace: 'nowrap' }}>
          <div style={{ fontSize: 50, fontWeight: 900, letterSpacing: -1, color: C.textStrong, lineHeight: 1.05 }}>Agencia de traducción</div>
          <div style={{ fontSize: 31, fontWeight: 650, color: C.muted, marginTop: 6 }}>documentos de las navieras · avisos a pasajeros</div>
        </div>
      </div>
      {noIn > 0.01 ? (
        <div style={{ position: 'absolute', right: 0, top: 10, height: 84, display: 'flex', alignItems: 'center', gap: 16, padding: '0 28px 0 22px', boxSizing: 'border-box', borderRadius: RADIUS.lg, border: `3px dashed ${alpha(C.sky, 0.75)}`, background: alpha(C.sky, 0.08), fontFamily: FONT.sans, opacity: noIn, transform: `translateX(${(1 - noIn) * 24}px)` }}>
          <Icon name="unplug" size={44} color={C.sky} strokeWidth={2} />
          <span style={{ fontSize: 32, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>{NO_ACCESS}</span>
        </div>
      ) : null}

      {/* row B: the three candidates */}
      {CANDIDATES.map((def, i) => (
        <div key={def.n} style={{ position: 'absolute', left: i * (CARD_W + CARD_GAP), top: ROW_B }}>
          <CandidateCard
            def={def}
            slot={slot[i]}
            art={a[i]}
            term={term[i]}
            say={say[i]}
            focus={focus[i]}
            extra={
              i === 0 ? (
                <NurseryNote on={progress(frame, nurseryAt - 2, 14)} />
              ) : i === 2 ? (
                <ScopeQuestions show={progress(frame, scopeAt - 2, 14)} cubre={progress(frame, cubreAt, 10)} meses={progress(frame, mesesAt, 10)} />
              ) : undefined
            }
          >
            {i === 2 ? <SealTags on={progress(frame, tagsAt, 14)} /> : null}
          </CandidateCard>
        </div>
      ))}

      {/* row C: what else to ask */}
      {frame >= chipsAt - 8 ? (
        <>
          <div style={{ position: 'absolute', left: 0, top: ROW_C }}>
            <AskChip icon="network" ask="¿subcontrata traductores?" term="supply chain analysis" tone={C.sky} on={progress(frame, supplyAt, 12)} at={askAt[0]} frame={frame} />
          </div>
          <div style={{ position: 'absolute', left: 885, top: ROW_C }}>
            <AskChip icon="search" ask="¿quieres poder entrar a mirar?" term="right-to-audit clause, firmada antes" tone={C.sky} on={progress(frame, rightAt, 12)} at={askAt[1]} frame={frame} />
          </div>
        </>
      ) : null}
    </Stage>
  );
}
