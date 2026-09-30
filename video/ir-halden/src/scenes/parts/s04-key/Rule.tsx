import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../../../engine/src/theme/motion';
import { Chip, Icon, clamp01, dimStyle, focusWeights } from '../../../../../engine/src/ui';
import { EXAM_TERM, LESSON, RULE_HEAD, RULE_SCOPE, RULE_STEPS } from '../../../data/s04-key';
import { Padlock } from '../s03-scope/Hosts';

/**
 * s04-key's closing beats: the containment rule (a heading, what it covers,
 * three steps lit on their verbs), the lesson («un equipo aislado no es un
 * incidente contenido») and the exam term. Stage-local coordinates under the
 * compact board (y ≥ 168); frames come from the scene.
 */

const W = 1728;
export const RULE_TOP = { head: 170, scope: 268, steps: 440 } as const;
const STEP_GAP = 24;
const STEP_W = (W - 2 * STEP_GAP) / 3;
const STEP_H = 206;

export function RuleHead({ frame, at, opacity }: { frame: number; at: number; opacity: number }) {
  const e = enter(frame, at, { distance: 14 });
  const [a, b] = splitHead(RULE_HEAD);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: RULE_TOP.head,
        width: W,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
        opacity: e.opacity * opacity,
        transform: e.transform,
      }}
    >
      <Padlock size={52} />
      <span style={{ fontSize: 50, fontWeight: 850, color: C.textStrong, letterSpacing: -0.5 }}>
        {a} <span style={{ color: C.cyanSoft }}>{b}</span>
      </span>
    </div>
  );
}

/** «Contener es echar» + «el candado a todo» (the part in colour). */
function splitHead(text: string): [string, string] {
  const i = text.indexOf('el candado');
  return i > 0 ? [text.slice(0, i).trim(), text.slice(i)] : [text, ''];
}

/** What the padlock covers: hosts of the scope and the accounts that pass through them (right of the shrunken naves). */
export function RuleScope({ frame, at, left, opacity }: { frame: number; at: readonly number[]; left: number; opacity: number }) {
  return (
    <div style={{ position: 'absolute', left, top: RULE_TOP.scope, display: 'grid', gap: 18, opacity }}>
      {RULE_SCOPE.map((s, i) => (
        <div key={s.text} style={{ ...enter(frame, at[i], { distance: 16, axis: 'x' }) }}>
          <Chip accent="cyan" icon={s.icon} size={38}>
            {s.text}
          </Chip>
        </div>
      ))}
    </div>
  );
}

export function RuleSteps({ frame, at, dim, opacity }: { frame: number; at: readonly number[]; dim: number; opacity: number }) {
  const { weights, dims } = focusWeights(frame, at, { ramp: 10 });
  return (
    <div style={{ position: 'absolute', left: 0, top: RULE_TOP.steps, width: W, height: STEP_H, opacity, ...dimStyle(dim) }}>
      {RULE_STEPS.map((s, i) => {
        if (frame < at[i] - 6) return null;
        const inn = progress(frame, at[i] - 6, 14);
        const f = weights[i];
        return (
          <div
            key={s.title}
            style={{
              position: 'absolute',
              left: i * (STEP_W + STEP_GAP),
              top: 0,
              width: STEP_W,
              height: STEP_H,
              boxSizing: 'border-box',
              padding: '20px 26px',
              borderRadius: RADIUS.lg,
              border: `2px solid ${alpha(C.cyan, 0.3 + 0.55 * f)}`,
              background: `linear-gradient(180deg, ${alpha(C.cyan, 0.08 + 0.1 * f)} 0%, ${alpha(C.ink900, 0.95)} 70%)`,
              boxShadow: f > 0.02 ? `0 0 ${Math.round(30 * f)}px ${alpha(C.cyan, 0.3 * f)}` : undefined,
              fontFamily: FONT.sans,
              opacity: inn,
              transform: `translateY(${(1 - inn) * 18}px)`,
              ...dimStyle(0.6 * dims[i]),
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 18,
                  display: 'grid',
                  placeItems: 'center',
                  background: alpha(C.cyan, 0.14),
                  border: `2px solid ${alpha(C.cyan, 0.45)}`,
                  boxSizing: 'border-box',
                }}
              >
                <Icon name={s.icon} size={38} color={C.cyan} />
              </div>
              <span style={{ fontSize: 30, fontWeight: 850, color: C.faint, letterSpacing: 1 }}>{i + 1}</span>
            </div>
            <div style={{ marginTop: 16, fontSize: 44, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap', letterSpacing: -0.4, lineHeight: 1.1 }}>{s.title}</div>
            <div style={{ marginTop: 8, fontFamily: s.mono ? FONT.mono : FONT.sans, fontSize: 30, fontWeight: s.mono ? 700 : 600, color: s.mono ? C.roseSoft : C.muted, whiteSpace: 'nowrap' }}>{s.sub}</div>
          </div>
        );
      })}
    </div>
  );
}

/** «un equipo aislado · no es · un incidente contenido», in the heading slot. */
export function Lesson({ frame, at, notAt, bAt, opacity }: { frame: number; at: number; notAt: number; bAt: number; opacity: number }) {
  const a = enter(frame, at, { distance: 12 });
  const n = progress(frame, notAt - 4, 10);
  const b = enter(frame, bAt - 4, { distance: 12, axis: 'x' });
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: RULE_TOP.head,
        width: W,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
        opacity,
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14, ...a }}>
        <Padlock size={46} />
        <span style={{ fontSize: 50, fontWeight: 850, color: C.cyanSoft }}>{LESSON.a}</span>
      </span>
      <span style={{ fontSize: 50, fontWeight: 800, color: C.roseSoft, opacity: n }}>{LESSON.not}</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14, ...b }}>
        <Icon name="shield" size={48} color={C.emerald} />
        <span style={{ fontSize: 50, fontWeight: 850, color: '#6ee7b7' }}>{LESSON.b}</span>
      </span>
    </div>
  );
}

/** The exam term: «EN EL EXAMEN», the Spanish phase, then «containment» big on its word. */
export function ExamTerm({ frame, at, termAt }: { frame: number; at: number; termAt: number }) {
  const tag = enter(frame, at, { distance: 12 });
  const es = enter(frame, at + 6, { distance: 12 });
  const t = progress(frame, termAt - 6, 16, EASE.out);
  return (
    <div style={{ position: 'absolute', left: 0, top: 262, width: W, height: 390, fontFamily: FONT.sans, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ ...tag }}>
        <Chip accent="violet" icon="mortarboard" size={34}>
          {EXAM_TERM.tag}
        </Chip>
      </div>
      <div style={{ marginTop: 22, fontSize: 52, fontWeight: 800, color: C.text, whiteSpace: 'nowrap', ...es }}>{EXAM_TERM.es}</div>
      <div
        style={{
          marginTop: 14,
          fontSize: 132,
          fontWeight: 850,
          letterSpacing: -2,
          lineHeight: 1,
          color: '#c4b5fd',
          whiteSpace: 'nowrap',
          opacity: clamp01(t * 1.3),
          transform: `translateY(${(1 - t) * 24}px) scale(${0.94 + 0.06 * t})`,
          textShadow: `0 0 40px ${alpha(C.violet, 0.35 * t)}`,
        }}
      >
        {EXAM_TERM.term}
      </div>
    </div>
  );
}
