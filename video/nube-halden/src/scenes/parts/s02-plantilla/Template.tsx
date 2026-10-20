import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../../engine/src/ui';

export const TPL = { w: 540, h: 440 } as const;
/** Top of each typed line inside the sheet, and the key line under them. */
export const LINE_Y = [96, 158, 220] as const;
export const KEY_Y = 288;
const LINE_H = 50;
const FOOT_Y = 362;

export interface TemplateState {
  /** The three lines «red» · «máquinas» · «permisos»: 0–1 typed. */
  typed: readonly number[];
  /** Caret visible (blinks while typing). */
  caret: boolean;
  /** 0–1: an amber mark on the second line (the error that the template copies). */
  error: number;
  /** 0–1: the footer «historial» lights amber. */
  history: number;
  /** 0–1: the line «clave: en el gestor» (the decision). */
  key: number;
  /** 0–1: overall glow while the voice is on the sheet. */
  glow: number;
}

/**
 * s02's template: a sheet headed «plantilla» where Sistemas types the new application's network, machines and
 * permissions (one line each, typed on the voice's words, with a caret: the typing sound). Its footer is the
 * «historial» (a row of version dots). On the decision a fourth line says where the key is, not the key.
 */
export function TemplateSheet({ lines, keyLine, s }: { lines: readonly string[]; keyLine: string; s: TemplateState }) {
  const g = clamp01(s.glow);
  const lastTyping = s.typed.findIndex((t) => t < 1);
  const caretRow = lastTyping === -1 ? lines.length - 1 : lastTyping;
  return (
    <div
      style={{
        position: 'relative',
        width: TPL.w,
        height: TPL.h,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        background: C.ink850,
        border: `3px solid ${alpha(C.cyan, 0.45 + 0.45 * g)}`,
        boxShadow: g > 0.02 ? `0 0 ${Math.round(30 * g)}px ${alpha(C.cyan, 0.25 * g)}` : undefined,
        fontFamily: FONT.sans,
      }}
    >
      <div style={{ position: 'absolute', left: 26, top: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
        <Icon name="file" size={36} color={C.cyan} />
        <span style={{ fontSize: 36, fontWeight: 850, color: C.textStrong }}>plantilla</span>
      </div>
      <div style={{ position: 'absolute', left: 20, right: 20, top: 74, height: 2, background: alpha(C.cyan, 0.25) }} />
      {lines.map((text, i) => {
        const t = clamp01(s.typed[i] ?? 0);
        const shown = text.slice(0, Math.round(text.length * t));
        const err = i === 1 ? clamp01(s.error) : 0;
        return (
          <div key={text} style={{ position: 'absolute', left: 26, top: LINE_Y[i], height: LINE_H, display: 'flex', alignItems: 'center', gap: 16, opacity: t > 0 ? 1 : 0.25 }}>
            <div style={{ width: 14, height: 14, borderRadius: 4, background: err > 0.5 ? C.amber : C.cyan, boxShadow: err > 0.02 ? `0 0 ${14 * err}px ${alpha(C.amber, 0.8)}` : undefined }} />
            <span style={{ fontSize: 38, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>
              {shown}
              {s.caret && i === caretRow ? <span style={{ display: 'inline-block', width: 4, height: 38, marginLeft: 4, verticalAlign: -6, background: C.cyanSoft }} /> : null}
            </span>
            {t >= 1 ? <div style={{ width: 150 - i * 24, height: 14, borderRadius: 7, background: err > 0.02 ? alpha(C.amber, 0.25 + 0.5 * err) : alpha(C.muted, 0.25) }} /> : null}
          </div>
        );
      })}
      {s.key > 0.01 ? (
        <div style={{ position: 'absolute', left: 26, top: KEY_Y, height: LINE_H, display: 'flex', alignItems: 'center', gap: 16, opacity: clamp01(s.key), transform: `translateX(${(1 - clamp01(s.key)) * -14}px)` }}>
          <Icon name="key" size={30} color={C.emerald} />
          <span style={{ fontSize: 36, fontWeight: 800, color: '#6ee7b7', whiteSpace: 'nowrap' }}>{keyLine}</span>
        </div>
      ) : null}
      <HistoryFoot on={s.history} />
    </div>
  );
}

/** The template's footer: «historial» and its version dots (everything ever written stays there). */
function HistoryFoot({ on }: { on: number }) {
  const o = clamp01(on);
  const tone = o > 0.02 ? C.amber : C.muted;
  return (
    <div style={{ position: 'absolute', left: 20, right: 20, top: FOOT_Y, height: 56, borderTop: `2px dashed ${alpha(tone, 0.35 + 0.5 * o)}`, display: 'flex', alignItems: 'center', gap: 20 }}>
      <span style={{ fontSize: 30, fontWeight: 750, color: o > 0.02 ? '#fcd34d' : C.muted, whiteSpace: 'nowrap' }}>historial</span>
      <svg width={300} height={30} viewBox="0 0 300 30">
        <line x1={10} y1={15} x2={290} y2={15} stroke={alpha(tone, 0.4 + 0.4 * o)} strokeWidth={3} />
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <circle key={k} cx={10 + k * 56} cy={15} r={9} fill={k === 5 ? alpha(tone, 0.4 + 0.6 * o) : C.ink850} stroke={alpha(tone, 0.5 + 0.5 * o)} strokeWidth={3} />
        ))}
      </svg>
    </div>
  );
}

export const ENV = { w: 270, h: 150 } as const;

/**
 * One environment built from the template («pruebas», «producción»): the same three bars as the template's lines;
 * `error` 0–1 puts the same amber mark on the second bar (the template copies the bad too).
 */
export function EnvBox({ label, show, error }: { label: string; show: number; error: number }) {
  const e = clamp01(error);
  return (
    <div
      style={{
        width: ENV.w,
        height: ENV.h,
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        background: C.ink850,
        border: `3px solid ${alpha(e > 0.02 ? C.amber : C.cyan, 0.5 + 0.3 * e)}`,
        padding: '12px 20px',
        fontFamily: FONT.sans,
        opacity: clamp01(show),
      }}
    >
      <div style={{ fontSize: 34, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>{label}</div>
      {[0, 1, 2].map((k) => (
        <div key={k} style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 10, height: 10, borderRadius: 3, background: k === 1 && e > 0.5 ? C.amber : C.cyan }} />
          <div style={{ width: 170 - k * 24, height: 10, borderRadius: 5, background: k === 1 && e > 0.02 ? alpha(C.amber, 0.25 + 0.5 * e) : alpha(C.muted, 0.25) }} />
        </div>
      ))}
    </div>
  );
}
