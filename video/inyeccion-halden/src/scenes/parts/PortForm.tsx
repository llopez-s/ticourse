import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';
import { PAYLOAD } from '../../data/query';
import { PAPER, PAPER_INK, PAPER_SOFT } from './bits';

/** Design size of the form (the part scales with `scale`). */
export const FORM = { w: 920, h: 330 } as const;

const PAPER_EDGE = '#b7c1d1';
const SLOT = { x: 560, w: 320, h: 64, rowA: 96, rowB: 200 } as const;

function SlotShape({ y, box, name, hideName = false }: { y: number; box: number; name: string; hideName?: boolean }) {
  return (
    <div style={{ position: 'absolute', left: SLOT.x, top: y, width: SLOT.w, height: SLOT.h }}>
      {/* the hole: the table shows through the paper */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 12,
          background: C.ink950,
          border: `3px dashed ${C.cyanDeep}`,
          boxShadow: `inset 0 6px 14px ${alpha('#000000', 0.7)}`,
          opacity: 1 - box,
        }}
      />
      {/* the box printed in advance: one per datum */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 8,
          background: '#f4f6fa',
          border: `4px solid #475569`,
          boxShadow: `inset 0 0 0 2px #cbd5e1`,
          opacity: box,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: 14,
          fontFamily: FONT.sans,
          fontSize: 26,
          fontWeight: 650,
          color: PAPER_SOFT,
          letterSpacing: 1,
        }}
      >
        {hideName ? null : name}
      </div>
    </div>
  );
}

/**
 * V19's through-line image, the port's form. `box` 0 is the form with a HOLE where the person's text is pasted
 * into the sentence (s02); `box` 1 is the form printed in advance, with a BOX for each datum (s03, s05, s06): same
 * paper, same sentence, same place. `slip` (0–1) pastes the cyan slip with the payload on the first slot; in the
 * hole form `tape` (0–1) lets it overrun the printed sentence (the second line is covered: the person is writing the
 * question now); in the boxed form the slip stays inside its box and the sentence is untouched (`ok`, 0–1, adds the
 * emerald tick). `glow` lights the slot.
 */
export function PortForm({
  box,
  slip,
  tape = 0,
  ok = 0,
  glow = 0,
  scale = 1,
  title = 'Formulario de consulta · puerto',
}: {
  box: number;
  slip: number;
  tape?: number;
  ok?: number;
  glow?: number;
  scale?: number;
  title?: string;
}) {
  const b = clamp01(box);
  const sl = clamp01(slip);
  const tp = clamp01(tape) * (1 - b);
  return (
    <div style={{ width: FORM.w * scale, height: FORM.h * scale }}>
      <div
        style={{
          position: 'relative',
          width: FORM.w,
          height: FORM.h,
          transform: scale === 1 ? undefined : `scale(${scale})`,
          transformOrigin: '0 0',
          borderRadius: 14,
          background: PAPER,
          border: `2px solid ${PAPER_EDGE}`,
          boxShadow: `0 30px 60px ${alpha('#000000', 0.5)}${glow > 0 ? `, 0 0 ${Math.round(40 * glow)}px ${alpha(C.cyan, 0.4 * glow)}` : ''}`,
          overflow: 'hidden',
          fontFamily: FONT.sans,
          color: PAPER_INK,
        }}
      >
        <div style={{ height: 56, background: '#c8d1de', borderBottom: `2px solid ${PAPER_EDGE}`, display: 'flex', alignItems: 'center', padding: '0 28px', fontSize: 26, fontWeight: 750, letterSpacing: 3, color: '#475569', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          {title}
        </div>

        <div style={{ position: 'absolute', left: 36, top: SLOT.rowA + 12, fontSize: 34, fontWeight: 650, whiteSpace: 'nowrap', opacity: 1 - 0.1 * tp }}>Busca a la persona llamada</div>
        <div style={{ position: 'absolute', left: 36, top: SLOT.rowB + 12, fontSize: 34, fontWeight: 650, whiteSpace: 'nowrap', opacity: 1 - 0.8 * tp, textDecoration: tp > 0.5 ? 'line-through' : undefined, textDecorationThickness: 3 }}>y que tenga la clave</div>

        <SlotShape y={SLOT.rowA} box={b} name="nombre" hideName={sl > 0.3} />
        <SlotShape y={SLOT.rowB} box={b} name="clave" />

        {/* the tape: the pasted text runs over the rest of the sentence */}
        {tp > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: 24,
              top: SLOT.rowB - 8,
              width: (FORM.w - 48) * tp,
              height: SLOT.h + 16,
              borderRadius: 10,
              overflow: 'hidden',
              background: `repeating-linear-gradient(135deg, ${alpha(C.rose, 0.3)} 0 14px, ${alpha(C.rose, 0.16)} 14px 28px)`,
              border: `3px solid ${alpha(C.rose, 0.8)}`,
            }}
          />
        ) : null}

        {/* the slip with the person's text */}
        {sl > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: SLOT.x + (b > 0.5 ? 6 : -6),
              top: SLOT.rowA + (b > 0.5 ? 5 : -4) - (1 - sl) * 54,
              width: b > 0.5 ? SLOT.w - 12 : SLOT.w + 4,
              height: b > 0.5 ? SLOT.h - 10 : SLOT.h + 6,
              opacity: sl,
              transform: `rotate(${b > 0.5 ? 0 : -2.2 * sl}deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              background: b > 0.5 ? 'transparent' : alpha(C.cyan, 0.92),
              border: b > 0.5 ? 'none' : `2px solid ${C.cyanDeep}`,
              boxShadow: b > 0.5 ? undefined : `0 10px 20px ${alpha('#000000', 0.4)}`,
              fontFamily: FONT.mono,
              fontSize: 32,
              fontWeight: 800,
              color: b > 0.5 ? C.cyanDeep : C.ink950,
              whiteSpace: 'pre',
            }}
          >
            {PAYLOAD}
          </div>
        ) : null}

        {/* the boxed form keeps the sentence: a tick says so */}
        {ok > 0.01 ? (
          <div style={{ position: 'absolute', right: 30, bottom: 22, display: 'flex', alignItems: 'center', gap: 12, opacity: ok, fontSize: 32, fontWeight: 800, color: '#047857' }}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="m5 12.5 4.5 4.5L19 7.5" />
            </svg>
            la frase sigue igual
          </div>
        ) : null}
      </div>
    </div>
  );
}
