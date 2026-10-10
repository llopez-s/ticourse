import { useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { enter, progress, typewriter } from '../../../../engine/src/theme/motion';
import { Icon, clamp01 } from '../../../../engine/src/ui';

/**
 * «Excepción · registro»: the exception record that fills in field by field (s04). Each row is a dashed empty field
 * until its `at` frame, then its value types in (the layout is reserved up front, so nothing jumps). A row may carry a
 * small note under its value (the owner: «quien manda en el negocio, no quien lo encontró») that fades in on `noteAt`.
 * `glow` (row key → 0–1) lights a row (the expiry date as the voice says it).
 */
export interface RecordFieldDef {
  key: string;
  label: string;
  value: string;
  /** Frame the value starts to type. */
  at: number;
  note?: string;
  noteAt?: number;
  /** Row accent (default cyan). */
  tone?: string;
}

export function ExceptionRecord({
  width,
  title,
  fields,
  at,
  glow = {},
  frame: frameProp,
}: {
  width: number;
  title: string;
  fields: RecordFieldDef[];
  /** Frame the card lands. */
  at: number;
  glow?: Record<string, number>;
  frame?: number;
}) {
  const current = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = frameProp ?? current;
  const e = enter(frame, at, { distance: 24, duration: 14 });
  if (frame < at - 2) return null;
  const labelW = 176;
  return (
    <div
      style={{
        ...e,
        width,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.violet, 0.7)}`,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        boxShadow: `0 30px 70px ${alpha('#000000', 0.4)}, 0 0 34px ${alpha(C.violet, 0.12)}`,
        overflow: 'hidden',
        fontFamily: FONT.sans,
      }}
    >
      <div style={{ height: 62, display: 'flex', alignItems: 'center', gap: 14, padding: '0 26px', borderBottom: `2px solid ${C.ink700}`, background: alpha(C.ink800, 0.9) }}>
        <Icon name="file" size={32} color={C.violet} />
        <span style={{ fontSize: 34, fontWeight: 800, color: C.textStrong }}>{title}</span>
      </div>
      <div style={{ padding: '10px 26px 14px' }}>
        {fields.map((f, i) => {
          const g = clamp01(glow[f.key] ?? 0);
          const shown = typewriter(f.value, frame, f.at, fps, 64);
          const started = frame >= f.at - 2;
          const noteP = f.note ? progress(frame, f.noteAt ?? f.at, 14) : 0;
          return (
            <div
              key={f.key}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 18,
                padding: '8px 14px',
                borderBottom: i < fields.length - 1 ? `1px solid ${alpha(C.ink600, 0.5)}` : undefined,
                borderRadius: g > 0.05 ? RADIUS.md : 0,
                background: g > 0.05 ? alpha(C.amber, 0.1 * g) : undefined,
                boxShadow: g > 0.05 ? `0 0 ${Math.round(24 * g)}px ${alpha(C.amber, 0.28 * g)}` : undefined,
              }}
            >
              <span style={{ width: labelW, flexShrink: 0, fontSize: 32, fontWeight: 750, lineHeight: 1.3, color: started ? (f.tone ?? C.cyanSoft) : C.faint }}>{f.label}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                {started ? (
                  <div style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.25, color: g > 0.5 ? '#fde68a' : C.textStrong }}>
                    {shown}
                    <span style={{ opacity: 0 }}>{f.value.slice(shown.length)}</span>
                  </div>
                ) : (
                  <div style={{ height: 34, marginTop: 4, borderRadius: 8, border: `2px dashed ${alpha(C.ink600, 0.8)}` }} />
                )}
                {f.note ? <div style={{ marginTop: 2, fontSize: 28, fontWeight: 600, lineHeight: 1.25, color: C.muted, opacity: noteP }}>{f.note}</div> : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
