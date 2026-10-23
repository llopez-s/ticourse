import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../../engine/src/ui';
import { CHECKS, REQUEST } from '../../../data/canon';
import { CheckBox, ReqStamp } from '../Marks';
import { Pill, TermPill } from '../Labels';

/** s02's request at full stage width (the same sheet as s01, opened up). Local units = stage units. */
export const FORM = { w: 1728, h: 476 } as const;
const CELL = { x: 28, y: 262, w: 420, h: 196, gap: 20 } as const;
const SIGN = { x: 1344, y: 262, w: 360, h: 196 } as const;

/** A person in a circle: the owner (cyan) or whoever applies the change (sky). */
function Silhouette({ tone }: { tone: string }) {
  return (
    <div style={{ width: 70, height: 70, borderRadius: 35, border: `3px solid ${alpha(tone, 0.8)}`, background: alpha(tone, 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon name="user" size={42} color={tone} />
    </div>
  );
}

function Who({ x, show, tone, line1, line2 }: { x: number; show: number; tone: string; line1: ReactNode; line2: ReactNode }) {
  return (
    <div style={{ position: 'absolute', left: x, top: 92, display: 'flex', alignItems: 'center', gap: 18, opacity: show, transform: `translateY(${(1 - show) * 14}px)`, whiteSpace: 'nowrap' }}>
      <Silhouette tone={tone} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 36, fontWeight: 850, color: C.textStrong, height: 50 }}>{line1}</div>
        <div style={{ fontSize: 30, fontWeight: 700, color: C.muted }}>{line2}</div>
      </div>
    </div>
  );
}

export interface FormState {
  /** The form itself (fades in on the scene's first frames). */
  form: number;
  owner: number;
  who: number;
  answers: number;
  stakeholders: number;
  /** The three empty cells and the committee's signature box. */
  cells: number;
  /** Per box: 0–1 the tick. */
  ticks: readonly [number, number, number];
  /** Per box: 0–1 the voice is on it. */
  focus: readonly [number, number, number];
  /** The backout cell turns amber when the check fails in the window. */
  fail: number;
  stamp: number;
  notSigner: number;
}

/**
 * The change request opened to the whole stage (s02): who owns it and who applies it, the silent STAKEHOLDERS chip,
 * the three cells that must be ticked — IMPACT ANALYSIS, PRUEBAS, BACKOUT PLAN — and, on the right, the committee's
 * box where the «CAB · firmado» stamp lands once the three have their tick («quien lo pide no firma»).
 */
export function Form({ s }: { s: FormState }) {
  const sign = clamp01(s.cells);
  return (
    <div
      style={{
        position: 'relative',
        width: FORM.w,
        height: FORM.h,
        boxSizing: 'border-box',
        borderRadius: 28,
        background: `linear-gradient(180deg, ${C.ink800} 0%, ${C.ink850} 100%)`,
        border: `3px solid ${alpha(C.cyan, 0.5)}`,
        boxShadow: `0 24px 60px ${alpha('#000000', 0.4)}`,
        fontFamily: FONT.sans,
        opacity: clamp01(s.form),
      }}
    >
      {/* header: the same kicker and title as the sheet of s01 */}
      <div style={{ position: 'absolute', left: 28, top: 22, display: 'flex', alignItems: 'center', gap: 16, whiteSpace: 'nowrap' }}>
        <Icon name="file" size={34} color={C.cyan} />
        <span style={{ fontSize: 24, fontWeight: 850, letterSpacing: 4, color: C.cyanSoft }}>{REQUEST.kicker}</span>
        <span style={{ fontSize: 34, fontWeight: 850, color: C.textStrong, marginLeft: 10 }}>{REQUEST.title.join(' ')}</span>
      </div>
      <div style={{ position: 'absolute', left: 28, right: 28, top: 76, height: 2, background: alpha(C.cyan, 0.22) }} />

      <Who
        x={28}
        show={clamp01(s.owner)}
        tone={C.cyan}
        line1={
          <>
            <span>dueño del cambio</span>
            <TermPill text="change owner" size={30} />
          </>
        }
        line2={<span style={{ color: C.cyanSoft }}>Sistemas</span>}
      />
      <Who x={900} show={clamp01(s.who)} tone={C.sky} line1={<span>quien lo aplica</span>} line2="puede ser otra persona" />

      <div style={{ position: 'absolute', left: 28, top: 190, display: 'flex', gap: 20 }}>
        <div style={{ opacity: clamp01(s.answers), transform: `translateY(${(1 - clamp01(s.answers)) * 10}px)` }}>
          <Pill text="responde de que se justifique, se pruebe y se cierre" tone={C.cyan} size={30} height={52} on={0.5} />
        </div>
        <div style={{ opacity: clamp01(s.stakeholders), transform: `translateY(${(1 - clamp01(s.stakeholders)) * 10}px)` }}>
          <Pill
            text={
              <span>
                <span style={{ color: '#c4b5fd', fontWeight: 900, letterSpacing: 1 }}>STAKEHOLDERS</span> · se les avisa antes
              </span>
            }
            tone={C.violet}
            icon="users"
            size={28}
            height={52}
            on={0.3}
          />
        </div>
      </div>

      {CHECKS.map((c, i) => {
        const f = clamp01(s.focus[i]);
        const failing = i === 2 ? clamp01(s.fail) : 0;
        const tone = failing > 0.5 ? C.amber : f > 0.5 ? C.cyan : C.ink600;
        return (
          <div
            key={c.term}
            style={{
              position: 'absolute',
              left: CELL.x + i * (CELL.w + CELL.gap),
              top: CELL.y,
              width: CELL.w,
              height: CELL.h,
              boxSizing: 'border-box',
              padding: '20px 22px',
              borderRadius: RADIUS.lg,
              border: `3px solid ${alpha(tone, 0.6 + 0.4 * Math.max(f, failing))}`,
              background: alpha(failing > 0.5 ? C.amber : C.cyan, 0.04 + 0.08 * Math.max(f, failing)),
              boxShadow: Math.max(f, failing) > 0.02 ? `0 0 ${Math.round(30 * Math.max(f, failing))}px ${alpha(tone, 0.3)}` : undefined,
              opacity: clamp01(s.cells),
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 56 }}>
              <CheckBox size={52} tick={s.ticks[i]} glow={f} />
              <span style={{ fontSize: 31, fontWeight: 900, letterSpacing: 0.5, color: '#c4b5fd', whiteSpace: 'nowrap' }}>{c.term}</span>
            </div>
            <div style={{ marginTop: 14, fontSize: 30, fontWeight: 700, lineHeight: 1.2, color: C.text, whiteSpace: 'nowrap', opacity: 0.35 + 0.65 * Math.max(f, clamp01(s.ticks[i])) }}>
              {c.gloss.map((g) => (
                <div key={g}>{g}</div>
              ))}
            </div>
          </div>
        );
      })}

      {/* the committee's box */}
      <div
        style={{
          position: 'absolute',
          left: SIGN.x,
          top: SIGN.y,
          width: SIGN.w,
          height: SIGN.h,
          boxSizing: 'border-box',
          borderRadius: RADIUS.lg,
          border: `3px dashed ${alpha(C.muted, 0.55)}`,
          opacity: sign,
        }}
      >
        <div style={{ position: 'absolute', left: 0, top: 14, width: SIGN.w, textAlign: 'center', fontSize: 28, fontWeight: 750, color: C.muted }}>comité de cambios</div>
        <div style={{ position: 'absolute', left: 0, top: 66, width: SIGN.w, display: 'flex', justifyContent: 'center' }}>
          {s.stamp > 0.01 ? <ReqStamp kind="cab" drop={s.stamp} size={30} /> : <ReqStamp kind="unsigned" size={30} />}
        </div>
        <div style={{ position: 'absolute', left: 0, top: 140, width: SIGN.w, textAlign: 'center', fontSize: 30, fontWeight: 800, color: C.text, opacity: clamp01(s.notSigner), whiteSpace: 'nowrap' }}>
          quien lo pide no firma
        </div>
      </div>
    </div>
  );
}
