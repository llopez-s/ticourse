import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { enter, progress } from '../../../engine/src/theme/motion';
import { BEHAVIOUR_TONE, IMAGINE_STAMP } from '../data/canon';
import { AccountArt, ForwardArt, PhotoArt } from './parts/CaseArt';
import { Face, type Mood } from './parts/Face';
import { CaseStamp, Pill } from './parts/Labels';
import { Stage, wordFrame } from './kit';

const S = 's02-intencion';
const W = 1728;
const CARD_W = 556;
const CARD_H = 418;
const CARD_GAP = 30;
const CARD_TOP = 70;
const BRACKET_Y = CARD_TOP + CARD_H;
const RULE_TOP = 520;
const ACTOR_TOP = 600;

interface CaseDef {
  cue: 'risky' | 'unexpected' | 'unintentional';
  seg: string;
  tone: string;
  mood: Mood;
  caption: string;
  term: string;
  response: ReactNode;
  /** The word of the voice that names the behaviour, and the one that gives its answer. */
  termWord: string;
  answerWord: string;
}

const CASES: CaseDef[] = [
  {
    cue: 'risky',
    seg: 's02-02',
    tone: BEHAVIOUR_TONE.risky,
    mood: 'knowing',
    caption: 'reenvía documentos a su correo personal',
    term: 'RISKY BEHAVIOR',
    response: 'lo sabe y lo hace: política y controles que impidan el atajo',
    termWord: 'risky',
    answerWord: 'política',
  },
  {
    cue: 'unexpected',
    seg: 's02-03',
    tone: BEHAVIOUR_TONE.unexpected,
    mood: 'puzzled',
    caption: 'una cuenta de Compras abre, de pronto, las nóminas de otra sección',
    term: 'UNEXPECTED BEHAVIOR',
    response: 'no encaja: se investiga antes de acusar',
    termWord: 'unexpected',
    answerWord: 'acusa',
  },
  {
    cue: 'unintentional',
    seg: 's02-04',
    tone: BEHAVIOUR_TONE.unintentional,
    mood: 'oops',
    caption: 'sube una foto de grupo; detrás, una pizarra con nombres de sistemas',
    term: 'UNINTENTIONAL BEHAVIOR',
    response: 'error honesto: diseño y formación',
    termWord: 'unintentional',
    answerWord: 'previene',
  },
];

const ARTS = [ForwardArt, AccountArt, PhotoArt];

/**
 * s02-intencion «Tres caras». A dashed «imagina» stamp, then three nameless faces — a face, a tiny picture and nothing
 * else — arrive on `faces`. On each case's cue its caption lights, on the voice's «risky» / «unexpected» /
 * «unintentional» its term pill, and on the answer («política y controles», «se investiga», «diseño y formación») its
 * response; the other two step back. The third picture carries the OPSEC chip. On `intent` a bracket joins the three
 * under «por la intención» and on `not-actor` the line «son comportamientos, no tipos de insider» (what the voice says).
 * Nobody is sanctioned or investigated for real; nothing says whether the account is stolen.
 */
export function S02Intencion(props: SceneProps) {
  const frame = useCurrentFrame();
  const facesAt = props.cue('faces');
  const cueAt = CASES.map((c) => props.cue(c.cue));
  const termAt = CASES.map((c) => Math.max(props.cue(c.cue) + 4, wordFrame(S, c.seg, c.termWord) - 6));
  const answerAt = CASES.map((c) => Math.max(props.cue(c.cue) + 8, wordFrame(S, c.seg, c.answerWord) - 6));
  const intentAt = props.cue('intent');
  const actorAt = props.cue('not-actor');

  const stampIn = enter(frame, -6, { distance: 16, duration: 16 });
  const all = progress(frame, intentAt - 4, 14);
  // The case in focus: 0 → 1 (its own cue until the next one's), everything lit once `intent` is said.
  const focusOf = (i: number) => {
    const start = progress(frame, cueAt[i] - 2, 12);
    const next = i < CASES.length - 1 ? progress(frame, cueAt[i + 1] - 2, 12) : 0;
    return Math.max(start * (1 - next), all);
  };

  const bracket = progress(frame, intentAt, 22);
  const ruleIn = enter(frame, intentAt + 6, { distance: 16 });
  const actorIn = enter(frame, actorAt - 2, { distance: 14 });
  const centres = [0, 1, 2].map((i) => i * (CARD_W + CARD_GAP) + CARD_W / 2);

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, ...stampIn }}>
        <CaseStamp parts={[...IMAGINE_STAMP]} size={30} tone={C.sky} dashed />
      </div>

      {CASES.map((c, i) => {
        const Art = ARTS[i];
        const appear = enter(frame, facesAt + i * 9, { distance: 24, duration: 18 });
        const f = focusOf(i);
        const capIn = progress(frame, cueAt[i], 14);
        const termIn = progress(frame, termAt[i], 12);
        const ansIn = progress(frame, answerAt[i], 12);
        return (
          <div
            key={c.cue}
            style={{
              position: 'absolute',
              left: i * (CARD_W + CARD_GAP),
              top: CARD_TOP,
              width: CARD_W,
              height: CARD_H,
              boxSizing: 'border-box',
              padding: '20px 20px 16px',
              borderRadius: RADIUS.lg,
              background: `linear-gradient(180deg, ${alpha(c.tone, 0.08 + 0.06 * f)} 0%, ${C.ink900} 62%)`,
              border: `3px solid ${alpha(c.tone, 0.3 + 0.55 * f)}`,
              boxShadow: f > 0.02 ? `0 0 ${Math.round(30 * f)}px ${alpha(c.tone, 0.22 * f)}` : undefined,
              fontFamily: FONT.sans,
              ...appear,
              opacity: appear.opacity * (0.62 + 0.38 * f),
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 108 }}>
              <Face size={108} tone={c.tone} mood={c.mood} glow={f} idSuffix={`-c${i}`} />
              <Art tone={c.tone} />
            </div>
            <div style={{ marginTop: 10, height: 116, fontSize: 31, fontWeight: 800, lineHeight: 1.2, color: C.textStrong, opacity: capIn, transform: `translateY(${(1 - capIn) * 10}px)` }}>{c.caption}</div>
            <div style={{ marginTop: 6, opacity: termIn, transform: `translateY(${(1 - termIn) * 10}px)` }}>
              <Pill text={c.term} tone={c.tone} on={termIn} size={30} height={56} weight={850} />
            </div>
            <div style={{ marginTop: 8, fontSize: 29, fontWeight: 700, lineHeight: 1.22, color: C.text, opacity: ansIn, transform: `translateY(${(1 - ansIn) * 10}px)` }}>{c.response}</div>
            {i === 2 ? (
              <div style={{ position: 'absolute', right: 20, top: 34, opacity: capIn }}>
                <Pill text="OPSEC" tone={C.cyan} icon="eyeOff" size={28} height={48} weight={850} on={capIn} />
              </div>
            ) : null}
          </div>
        );
      })}

      {/* The bracket: the three cases under one rule */}
      <svg width={W} height={RULE_TOP - BRACKET_Y + 6} viewBox={`0 0 ${W} ${RULE_TOP - BRACKET_Y + 6}`} style={{ position: 'absolute', left: 0, top: BRACKET_Y }}>
        {centres.map((x) => (
          <line key={x} x1={x} y1={0} x2={x} y2={16 * bracket} stroke={alpha(C.cyan, 0.7)} strokeWidth={4} strokeLinecap="round" />
        ))}
        <line x1={centres[0]} y1={16} x2={centres[0] + (centres[2] - centres[0]) * bracket} y2={16} stroke={alpha(C.cyan, 0.7)} strokeWidth={4} strokeLinecap="round" />
        <line x1={W / 2} y1={16} x2={W / 2} y2={16 + (RULE_TOP - BRACKET_Y - 12) * bracket} stroke={alpha(C.cyan, 0.7)} strokeWidth={4} strokeLinecap="round" />
      </svg>
      {frame >= intentAt ? (
        <div style={{ position: 'absolute', left: 0, top: RULE_TOP, width: W, display: 'flex', justifyContent: 'center', ...ruleIn }}>
          <Pill text="por la intención" tone={C.cyan} icon="brain" size={50} height={68} weight={850} on={1} />
        </div>
      ) : null}
      {frame >= actorAt - 4 ? (
        <div style={{ position: 'absolute', left: 0, top: ACTOR_TOP, width: W, display: 'flex', justifyContent: 'center', ...actorIn }}>
          <Pill text="son comportamientos, no tipos de insider" tone={C.sky} icon="users" size={34} height={54} weight={750} on={0.8} />
        </div>
      ) : null}
    </Stage>
  );
}
