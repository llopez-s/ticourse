import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { enter, progress } from '../../../engine/src/theme/motion';
import { clamp01 } from '../../../engine/src/ui';
import { Pill, SoftTag, TermPill } from './parts/Labels';
import { QUESTIONS, QuestionBadge, Sheet } from './parts/Sheet';
import { Stage, wordFrame } from './kit';

const S = 's02-propiedades';
const W = 1728;

const SHEET_W = 340;
const SHEET_X = (W - SHEET_W) / 2;
const SHEET_Y = 40;
const CARD_W = 650;
const CARD_H = 258;
const CARD_POS = [
  { left: 0, top: 20 },
  { left: W - CARD_W, top: 20 },
  { left: 0, top: 292 },
  { left: W - CARD_W, top: 292 },
] as const;
const VERBS_TOP = 576;

/** The four verbs of the exam, each with its question's icon; lit on the voice's words in s02-06. */
const VERBS = [
  { text: 'leer', word: 'lee' },
  { text: 'cambiar', word: 'cambia' },
  { text: 'no poder usar', word: 'usar' },
  { text: 'negar', word: 'niega' },
] as const;

/** One question card around the sheet: badge + question, the exam term, then its gloss. */
function Card({ i, show, on, term, children }: { i: number; show: number; on: number; term: number; children: ReactNode }) {
  const q = QUESTIONS[i];
  const o = clamp01(on);
  return (
    <div
      style={{
        position: 'absolute',
        ...CARD_POS[i],
        width: CARD_W,
        height: CARD_H,
        boxSizing: 'border-box',
        padding: '18px 24px',
        borderRadius: 24,
        border: `3px solid ${alpha(C.cyan, 0.25 + 0.6 * o)}`,
        background: alpha(C.cyan, 0.03 + 0.08 * o),
        boxShadow: o > 0.05 ? `0 0 ${Math.round(28 * o)}px ${alpha(C.cyan, 0.22 * o)}` : undefined,
        fontFamily: FONT.sans,
        opacity: clamp01(show) * (0.55 + 0.45 * o),
        transform: `translateY(${(1 - clamp01(show)) * 18}px)`,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <QuestionBadge icon={q.icon} size={56} on={o} />
        <div style={{ fontSize: 38, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>{q.q}</div>
      </div>
      <div style={{ display: 'flex', opacity: clamp01(term), transform: `translateX(${(1 - clamp01(term)) * -12}px)` }}>
        <TermPill text={q.term} size={34} on={o} />
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, color: C.text, lineHeight: 1.22 }}>{children}</div>
    </div>
  );
}

/**
 * s02-propiedades «Cuatro cosas que no pueden fallar». The sheet in the centre from the first frame (`sheet` lights
 * it); four question cards come in around it, one per sentence, each with its exam term on the voice's English word:
 * ¿quién la lee? CONFIDENTIALITY · ¿la ha tocado alguien? INTEGRITY, while «1.000 kg» in «cuánto» turns into «100 kg»
 * and a rose mark jumps · ¿está cuando hace falta? AVAILABILITY, the night fire tagged «supuesto» · ¿puede negar que la
 * mandó? NON-REPUDIATION and the «firma digital» chip, nothing more. On `verbs` the four verbs line up under the cards
 * (each with its question's icon) and light on s02-06's words. The voice never says «CIA».
 */
export function S02Propiedades(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const sheetAt = props.cue('sheet');
  const cardAt = [props.cue('read'), props.cue('change'), props.cue('fire'), props.cue('deny')];
  const termAt = [w('s02-01', 'confidentiality'), w('s02-02', 'integrity'), w('s02-03', 'availability'), w('s02-04', 'non-repudiation')];
  const verbsAt = props.cue('verbs');
  const verbAt = VERBS.map((v) => w('s02-06', v.word) - 6);
  const milAt = w('s02-02', 'mil') - 6;
  const cienAt = w('s02-02', 'cien') - 4;
  const fuegoAt = w('s02-03', 'fuego') - 6;
  const firmaAt = w('s02-04', 'firma') - 6;

  const sheetIn = enter(frame, -4, { distance: 14 });
  const sheetGlow = Math.max(0.25, progress(frame, sheetAt, 14) * (1 - 0.6 * progress(frame, cardAt[0], 14)));
  // A card is «on» from its cue until the next card's cue; all come back up a little on `verbs`.
  const on = cardAt.map((at, i) => {
    const next = cardAt[i + 1] ?? verbsAt;
    return Math.max(progress(frame, at, 12) * (1 - progress(frame, next - 4, 12)), 0.55 * progress(frame, verbsAt, 14));
  });
  const kg = { show: progress(frame, milAt, 10), flip: progress(frame, cienAt, 10), mark: progress(frame, cienAt + 6, 12) };
  const lineOn = [1, 0.5 + 0.5 * Math.max(on[1], 1 - progress(frame, cardAt[1] - 6, 6)), 1];

  return (
    <Stage>
      <div style={{ position: 'absolute', left: SHEET_X, top: SHEET_Y, ...sheetIn }}>
        <Sheet width={SHEET_W} glow={Math.max(sheetGlow, on[1] * 0.6)} kg={kg} lineOn={lineOn} />
      </div>

      <Card i={0} show={progress(frame, cardAt[0] - 4, 14)} on={on[0]} term={progress(frame, termAt[0] - 6, 12)}>
        solo quien está autorizado
      </Card>
      <Card i={1} show={progress(frame, cardAt[1] - 4, 14)} on={on[1]} term={progress(frame, termAt[1] - 6, 12)}>
        que nadie lo cambie sin permiso
      </Card>
      <Card i={2} show={progress(frame, cardAt[2] - 4, 14)} on={on[2]} term={progress(frame, termAt[2] - 6, 12)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: 0.3 + 0.7 * progress(frame, fuegoAt, 12), whiteSpace: 'nowrap' }}>
          <SoftTag text="supuesto" size={26} />
          <span>un fuego de noche</span>
        </div>
        <div style={{ opacity: 0.3 + 0.7 * progress(frame, fuegoAt + 10, 12), whiteSpace: 'nowrap', marginTop: 4 }}>quien va a apagarlo tiene que abrirla</div>
      </Card>
      <Card i={3} show={progress(frame, cardAt[3] - 4, 14)} on={on[3]} term={progress(frame, termAt[3] - 6, 12)}>
        <div style={{ display: 'flex', opacity: progress(frame, firmaAt, 12), transform: `translateY(${(1 - progress(frame, firmaAt, 12)) * 10}px)` }}>
          <Pill text="firma digital" tone={C.cyan} on={0.5 + 0.5 * on[3]} size={32} height={52} />
        </div>
      </Card>

      {/* The four verbs, each with its question's icon */}
      {frame >= verbsAt - 6 ? (
        <div style={{ position: 'absolute', left: 0, top: VERBS_TOP, width: W, display: 'flex', justifyContent: 'center', gap: 18, ...enter(frame, verbsAt - 2, { distance: 16 }) }}>
          {VERBS.map((v, i) => {
            const lit = Math.max(0.15, progress(frame, verbAt[i], 10));
            return (
              <div key={v.text} style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                <QuestionBadge icon={QUESTIONS[i].icon} size={52} on={lit} />
                <Pill text={v.text} tone={C.violet} on={lit} size={36} height={60} weight={850} />
              </div>
            );
          })}
        </div>
      ) : null}
    </Stage>
  );
}
