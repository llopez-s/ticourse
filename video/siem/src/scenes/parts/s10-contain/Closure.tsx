import { useMemo } from 'react';
import { random } from 'remotion';
import { C, FONT, TYPE, alpha } from '../../../theme/tokens';
import { EASE, fadeIn, progress } from '../../../theme/motion';
import { Icon, Panel } from '../../../ui';
import { StepRow } from './Steps';
import type { S10Timing } from './timing';

const CHART = { w: 504, h: 76, dropX: 168 } as const;

/**
 * Correction and validation: the service-account credential is rotated, the
 * fix is validated (no logon succeeds with the old credential any more) and
 * the case is documented. The alert closes on validation, not on reading.
 */
export function Closure({ frame, t, width, height }: { frame: number; t: S10Timing; width: number; height: number }) {
  const enterP = progress(frame, t.fix + 22, 18);
  const rowA = progress(frame, t.fix + 26, 14);
  const rowB = progress(frame, t.graph - 4, 14);
  const rowC = progress(frame, t.validate + 14, 14);
  const draw = progress(frame, t.graph, 26, EASE.inOut);
  const valid = progress(frame, t.validate, 10);

  return (
    <Panel
      title="Corrección y validación"
      icon="shield"
      accent="emerald"
      glow={0.5 * enterP}
      style={{ width, height, opacity: enterP, transform: `translateY(${(1 - enterP) * 24}px)` }}
    >
      <div style={{ position: 'absolute', left: 28, right: 28, top: 20, opacity: rowA }}>
        <StepRow
          state={frame >= t.rotated ? 'done' : 'hidden'}
          p={progress(frame, t.rotated, 8)}
          label="Credencial rotada"
          labelColor={C.textStrong}
          sub={
            <>
              cuenta de servicio <span style={{ fontFamily: FONT.mono, color: C.text }}>svc_tosreport</span>
            </>
          }
          right={
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                display: 'grid',
                placeItems: 'center',
                background: alpha(frame >= t.rotated ? C.emerald : C.amber, 0.12),
                border: `2px solid ${alpha(frame >= t.rotated ? C.emerald : C.amber, 0.5)}`,
              }}
            >
              <Icon
                name="key"
                size={32}
                color={frame >= t.rotated ? C.emerald : C.amber}
              />
            </div>
          }
        />
      </div>

      <div style={{ position: 'absolute', left: 28, right: 28, top: 108, opacity: rowB }}>
        <StepRow
          state={frame >= t.validate ? 'done' : 'hidden'}
          p={valid}
          label="Corrección validada"
          labelColor={C.textStrong}
          // Validates the fix itself (the rotation), not the isolation.
          sub="logons con la credencial antigua"
          right={
            <div
              style={{
                fontFamily: FONT.mono,
                fontSize: 44,
                fontWeight: 800,
                color: frame >= t.validate ? C.emerald : C.text,
                whiteSpace: 'nowrap',
                opacity: fadeIn(frame, t.graph + 18, 10),
              }}
            >
              0
            </div>
          }
        />
        <OldCredentialChart draw={draw} valid={valid} />
      </div>

      <div style={{ position: 'absolute', left: 28, right: 28, top: 314, opacity: rowC }}>
        <StepRow
          state={frame >= t.documented ? 'done' : 'hidden'}
          p={progress(frame, t.documented, 8)}
          label="Caso documentado"
          labelColor={C.textStrong}
          sub={
            <>
              <span style={{ fontFamily: FONT.mono }}>CASO 0412</span> · informe de cierre
            </>
          }
          right={<Icon name="file" size={40} color={frame >= t.documented ? C.emerald : C.muted} />}
        />
      </div>
    </Panel>
  );
}

/**
 * Successful logons with the old svc_tosreport credential: a few sparse
 * spikes before the rotation, flat zero after it.
 */
function OldCredentialChart({ draw, valid }: { draw: number; valid: number }) {
  const zeroY = CHART.h - 6;
  const spikes = useMemo(() => {
    // Irregular gaps, so it reads as occasional logons rather than a bar chart.
    const at = [0.06, 0.3, 0.41, 0.68, 0.9];
    let d = '';
    at.forEach((f, i) => {
      const x = 8 + (CHART.dropX - 22) * f;
      const top = zeroY - (18 + random(`s10-logon-h-${i}`) * 44);
      d += `M${x.toFixed(1)},${zeroY} L${x.toFixed(1)},${top.toFixed(1)}`;
    });
    return d;
  }, [zeroY]);
  return (
    <svg
      width={CHART.w}
      height={CHART.h + 30}
      viewBox={`0 -30 ${CHART.w} ${CHART.h + 30}`}
      style={{ display: 'block', marginLeft: 58, marginTop: 14 }}
      aria-hidden
    >
      <defs>
        <clipPath id="s10-out-clip">
          <rect x={0} y={-30} width={CHART.w * draw} height={CHART.h + 30} />
        </clipPath>
      </defs>
      <line x1={0} y1={zeroY} x2={CHART.w} y2={zeroY} stroke={C.ink600} strokeWidth={2} />
      <g clipPath="url(#s10-out-clip)">
        <path d={spikes} fill="none" stroke={C.rose} strokeWidth={6} strokeLinecap="round" />
        <line
          x1={CHART.dropX + 10}
          y1={zeroY}
          x2={CHART.w}
          y2={zeroY}
          stroke={C.emerald}
          strokeWidth={5}
          strokeLinecap="round"
          opacity={0.6 + 0.4 * valid}
        />
        <line x1={CHART.dropX + 5} y1={-24} x2={CHART.dropX + 5} y2={zeroY} stroke={C.ink500} strokeWidth={2} strokeDasharray="6 6" />
        <text x={CHART.dropX + 18} y={-6} fill={C.muted} fontFamily={FONT.sans} fontSize={TYPE.small} fontWeight={600}>
          rotación
        </text>
      </g>
    </svg>
  );
}
