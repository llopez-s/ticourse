import { useCurrentFrame } from 'remotion';
import type { ReactNode } from 'react';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { tone as toneOf, type Tone } from '../../../engine/src/ui/tone';
import { Pill, Reveal, Tag } from './parts/bits';
import { Stage, segment, wordFrame } from './kit';

const S = 's07-caso';
const BAR_X = 250;
const BAR_H = 72;

function Seg({ frame, at, w, tone, children, flag = 0 }: { frame: number; at: number; w: number; tone: Tone; children: ReactNode; flag?: number }) {
  const t = toneOf(tone);
  const p = progress(frame, at, 12);
  const f = toneOf('amber');
  return (
    <div style={{ boxSizing: 'border-box', width: w, height: BAR_H, display: 'grid', placeItems: 'center', borderRadius: RADIUS.sm, border: `2px solid ${alpha(flag > 0 ? f.fg : t.fg, 0.35 + 0.6 * Math.max(flag, 0))}`, background: alpha(flag > 0 ? f.fg : t.fg, 0.1 + 0.1 * flag), boxShadow: flag > 0 ? `0 0 ${14 + 16 * flag}px ${alpha(f.fg, 0.45 * flag)}` : 'none', opacity: p, fontFamily: FONT.mono, fontSize: 26, fontWeight: 700, color: flag > 0 ? f.soft : t.soft, whiteSpace: 'nowrap' }}>
      {children}
    </div>
  );
}

/**
 * s07-caso «El manual que copia los patrones». Nothing above y 190 (the HOLLOW LANTERN card). benign-manual as a
 * strip of its contents: a line of manual text first, then ALRTDEMO and every pattern — all there, none at
 * offset 0 (amber). A, under it, starts with ALRTDEMO at the offset-0 line. Then the two requirements as code
 * chips (header at 0, filesize < 4KB), and the warnings: invented format, not PE, MZ alone proves nothing.
 */
export function S07Manual(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const barAt = at('s07-01') + 6;
  const aAt = at('s07-02');
  const flagAt = w('s07-02', 'no') - 10;
  const flag = progress(frame, flagAt, 14);
  const reqAt = at('s07-03');
  const mzAt = w('s07-06', 'letras') - 10;
  const peAt = w('s07-06', 'comprobación') - 10;
  const lineP = progress(frame, aAt, 18);

  const bar = (children: ReactNode) => <div style={{ display: 'flex', gap: 6 }}>{children}</div>;
  return (
    <Stage>
      {/* offset-0 line */}
      <svg width={1728} height={260} style={{ position: 'absolute', left: 0, top: 176, opacity: lineP }}>
        <line x1={BAR_X - 10} y1={10} x2={BAR_X - 10} y2={200} stroke={C.cyan} strokeWidth={4} strokeDasharray="10 8" />
      </svg>
      <Reveal frame={frame} at={aAt} x={BAR_X - 90} y={364}>
        <Pill icon="arrowUp" tone="cyan" size={26}>offset 0</Pill>
      </Reveal>

      {/* benign-manual */}
      <Reveal frame={frame} at={barAt - 4} x={0} y={190}>
        <div style={{ width: 230, fontFamily: FONT.mono, fontSize: 26, fontWeight: 800, color: C.muted, lineHeight: 1.15 }}>
          benign-
          <br />
          manual
        </div>
      </Reveal>
      <div style={{ position: 'absolute', left: BAR_X, top: 190 }}>
        {bar(
          <>
            <Seg frame={frame} at={barAt} w={360} tone="muted">Manual de laboratorio</Seg>
            <Seg frame={frame} at={barAt + 10} w={160} tone="cyan" flag={flag}>ALRTDEMO</Seg>
            <Seg frame={frame} at={barAt + 20} w={250} tone="cyan">cicada-demo-v1</Seg>
            <Seg frame={frame} at={barAt + 30} w={330} tone="cyan">route=/collect-demo</Seg>
            <Seg frame={frame} at={barAt + 40} w={290} tone="cyan">41 4C 52 54 22 7F</Seg>
          </>,
        )}
      </div>

      {/* A */}
      <Reveal frame={frame} at={aAt} x={0} y={282}>
        <div style={{ width: 230, fontFamily: FONT.sans, fontSize: 38, fontWeight: 850, color: C.textStrong }}>A</div>
      </Reveal>
      <div style={{ position: 'absolute', left: BAR_X, top: 282 }}>
        {bar(
          <>
            <Seg frame={frame} at={aAt + 6} w={160} tone="cyan">ALRTDEMO</Seg>
            <Seg frame={frame} at={aAt + 16} w={250} tone="cyan">cicada-demo-v1</Seg>
            <Seg frame={frame} at={aAt + 26} w={330} tone="cyan">route=/collect-demo</Seg>
            <Seg frame={frame} at={aAt + 36} w={290} tone="cyan">41 4C 52 54 22 7F</Seg>
          </>,
        )}
      </div>
      <Reveal frame={frame} at={flagAt + 10} x={BAR_X + 366 + 170} y={366}>
        <Pill icon="alert" tone="amber" size={26}>todo copiado, pero no en el offset 0</Pill>
      </Reveal>

      {/* requirements */}
      <Reveal frame={frame} at={reqAt} x={0} y={420}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
          <Tag tone="cyan" size={36}>$header at 0</Tag>
          <Tag tone="sky" size={36}>filesize &lt; 4KB</Tag>
          <Reveal frame={frame} at={w('s07-03', 'Ninguno') - 6} x={0} y={0} style={{ position: 'relative' }}>
            <Pill icon="eyeOff" tone="muted" size={28}>ninguno demuestra malicia</Pill>
          </Reveal>
        </div>
      </Reveal>
      <Reveal frame={frame} at={at('s07-04')} x={0} y={488}>
        <Pill icon="split" tone="muted" size={28}>una restricción útil aquí puede excluir algo relevante en otro objetivo</Pill>
      </Reveal>

      <Reveal frame={frame} at={at('s07-05')} x={0} y={550}>
        <div style={{ display: 'flex', gap: 20 }}>
          <Pill icon="alert" tone="amber" size={28}>formato inventado: no es PE ni ejecutable</Pill>
          <Reveal frame={frame} at={mzAt} x={0} y={0} style={{ position: 'relative' }}>
            <Pill tone="muted" size={28}>MZ por sí solo no valida PE</Pill>
          </Reveal>
        </div>
      </Reveal>
      <Reveal frame={frame} at={peAt} x={0} y={612}>
        <Pill icon="link" tone="sky" size={26}>pe.is_pe · fuente: documentación de YARA, módulo pe</Pill>
      </Reveal>
    </Stage>
  );
}
