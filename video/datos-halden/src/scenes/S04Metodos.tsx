import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Redacted } from '../../../engine/src/ui';
import { Caption, Pill, StrikeLine, TermPill } from './parts/Labels';
import { RecordMini } from './parts/Record';
import { ExportSheet, MaskedScreen, ReportTable, VaultTable } from './parts/s04-metodos/Bits';
import { Stage, wordFrame } from './kit';

const S = 's04-metodos';
const COL_W = 556;
const GAP = 30;
const colX = (i: number) => i * (COL_W + GAP);
const PANEL_TOP = 74;
const PANEL_H = 510;
const INNER_W = COL_W - 44;
const FOOT_TOP = 600;

const HEADINGS = ['En la pantalla de la jefa de turno', 'En el informe de horas para Dirección', 'La exportación mensual'] as const;

function Panel({ i, vis, on, tone, children }: { i: number; vis: number; on: number; tone: string; children: ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: colX(i),
        top: PANEL_TOP,
        width: COL_W,
        height: PANEL_H,
        boxSizing: 'border-box',
        padding: '16px 22px',
        borderRadius: RADIUS.lg,
        border: `${on > 0.5 ? 3 : 2}px solid ${alpha(tone, 0.22 + 0.6 * on)}`,
        background: `linear-gradient(180deg, ${alpha(tone, 0.03 + 0.07 * on)} 0%, ${alpha(C.ink900, 0.92)} 55%)`,
        boxShadow: on > 0.05 ? `0 0 ${Math.round(30 * on)}px ${alpha(tone, 0.2 * on)}` : undefined,
        opacity: vis * (0.42 + 0.58 * on),
        transform: `translateY(${(1 - vis) * 18}px)`,
        fontFamily: FONT.sans,
      }}
    >
      <div style={{ fontSize: 30, fontWeight: 800, color: on > 0.5 ? C.textStrong : C.text, lineHeight: 1.15, height: 70 }}>{HEADINGS[i]}</div>
      <div style={{ position: 'relative', marginTop: 14 }}>{children}</div>
    </div>
  );
}

/** Absolute row inside a panel's body (y relative to the body). */
function At({ y, show = 1, dy = 12, children }: { y: number; show?: number; dy?: number; children: ReactNode }) {
  if (show <= 0.01) return null;
  return <div style={{ position: 'absolute', left: 0, top: y, width: INNER_W, opacity: show, transform: `translateY(${(1 - show) * dy}px)` }}>{children}</div>;
}

/**
 * s04-metodos «Lo que se ve y lo que se guarda». On `same-id` the record's DNI row and «el mismo DNI, de tres maneras»
 * on top, and three dim panels that light in turn. Screen: the DNI as «*****678Z» (invented, screen only) and, half lit,
 * the system's whole DNI as a bar, «intacto» → MASKING on «masking», «se ve una parte · el original sigue intacto» on
 * «intacto». Report: each DNI becomes a meaningless token → TOKENIZATION on `token`; on `vault` RR. HH.'s VAULT table and
 * «solo quien tiene la vault vuelve al DNI». Export: the sheet with nonsense column names, shuffled on `shuffle`,
 * «para que no se entienda»; on `crossed` struck → OBFUSCATION, «estorba, no es una barrera», and the non-human-readable
 * line. On `chip`, the foot: «la exportación se cifra igual · propuesta» and «encryption: vuelve con la clave · hashing:
 * no vuelve nunca».
 */
export function S04Metodos(props: SceneProps) {
  const frame = useCurrentFrame();
  const sameAt = props.cue('same-id');
  const maskAt = props.cue('mask');
  const reportAt = props.cue('report');
  const tokenAt = props.cue('token');
  const vaultAt = props.cue('vault');
  const exportAt = props.cue('export');
  // {shuffle} is a sound-only cue (not in the timeline's cues): sync on its word.
  const shuffleAt = Math.max(exportAt + 10, wordFrame(S, 's04-05', 'desordenar') - 4);
  const crossedAt = props.cue('crossed');
  const chipAt = props.cue('chip');
  const finalAt = Math.max(maskAt + 6, wordFrame(S, 's04-02', 'final') - 6);
  const maskWord = Math.max(finalAt + 6, wordFrame(S, 's04-02', 'masking') - 4);
  const intactoAt = Math.max(maskWord + 6, wordFrame(S, 's04-02', 'intacto') - 6);
  const vuelveAt = Math.max(vaultAt + 10, wordFrame(S, 's04-04', 'vuelve') - 6);
  const barreraAt = Math.max(crossedAt + 10, wordFrame(S, 's04-06', 'estorbo') - 4);

  const headIn = enter(frame, sameAt - 4, { distance: 14 });
  const vis = [0, 1, 2].map((i) => progress(frame, sameAt + 4 + i * 6, 16));
  const lit = (from: number, to: number) => progress(frame, from - 4, 12) * (1 - 0.6 * progress(frame, to - 6, 12));
  const on = [lit(maskAt, reportAt), lit(reportAt, exportAt), progress(frame, exportAt - 4, 12) * (1 - 0.3 * progress(frame, chipAt + 20, 14))];

  const sys = progress(frame, finalAt + 14, 14);
  const masked = progress(frame, finalAt, 12);
  const tokens = progress(frame, reportAt + 6, 30, EASE.linear);
  const strike = progress(frame, crossedAt, 14);
  const footIn = enter(frame, chipAt - 4, { distance: 14 });

  return (
    <Stage>
      {/* Head: the record's DNI, three ways */}
      <div style={{ position: 'absolute', left: 0, top: 0, display: 'flex', alignItems: 'center', gap: 20, ...headIn }}>
        <RecordMini width={70} />
        <Caption size={40} weight={800} color={C.textStrong}>
          el mismo <span style={{ color: C.cyan }}>DNI</span> de la ficha, de tres maneras
        </Caption>
      </div>

      <Panel i={0} vis={vis[0]} on={on[0]} tone={C.cyan}>
        <At y={0} show={Math.max(0.35, masked)}>
          <MaskedScreen on={masked} width={INNER_W} />
        </At>
        <At y={108} show={sys}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: 0.6, whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: C.muted }}>en el sistema: DNI</span>
            <Redacted width={150} height={24} tone="muted" strength={0.6} />
            <span style={{ fontSize: 28, fontWeight: 800, color: C.emerald }}>intacto</span>
          </div>
        </At>
        <At y={170} show={progress(frame, maskWord, 12)}>
          <TermPill text="MASKING" size={38} on={on[0]} />
        </At>
        <At y={250} show={progress(frame, intactoAt, 14)}>
          <div style={{ fontSize: 34, fontWeight: 750, lineHeight: 1.2, color: C.text }}>
            se ve una parte · <span style={{ color: C.emerald }}>el original sigue intacto</span>
          </div>
        </At>
      </Panel>

      <Panel i={1} vis={vis[1]} on={on[1]} tone={C.cyan}>
        <At y={0}>
          <ReportTable tokens={tokens} width={INNER_W} />
        </At>
        <At y={134} show={progress(frame, tokenAt - 2, 12)}>
          <TermPill text="TOKENIZATION" size={36} on={on[1]} />
        </At>
        <At y={200} show={progress(frame, vaultAt - 2, 14)}>
          <VaultTable on={progress(frame, vaultAt, 12) * (1 - 0.5 * progress(frame, exportAt - 6, 12))} width={INNER_W} />
        </At>
        <At y={316} show={progress(frame, vuelveAt, 12)}>
          <div style={{ fontSize: 32, fontWeight: 750, lineHeight: 1.15, color: '#c4b5fd' }}>solo quien tiene la vault vuelve al DNI</div>
        </At>
      </Panel>

      <Panel i={2} vis={vis[2]} on={on[2]} tone={strike > 0.5 ? C.rose : C.amber}>
        <At y={0} show={Math.max(0.35, progress(frame, exportAt, 12))}>
          <div style={{ position: 'relative' }}>
            <ExportSheet shuffle={progress(frame, shuffleAt, 22, EASE.inOut)} width={INNER_W} />
            <div style={{ marginTop: 10, fontSize: 32, fontWeight: 750, color: C.amber, opacity: progress(frame, shuffleAt + 6, 12) }}>«para que no se entienda»</div>
            <StrikeLine strike={strike} />
          </div>
        </At>
        <At y={200} show={progress(frame, crossedAt + 4, 12)}>
          <TermPill text="OBFUSCATION" size={36} on={on[2]} />
        </At>
        <At y={270} show={progress(frame, barreraAt, 12)}>
          <div style={{ fontSize: 34, fontWeight: 800, color: C.roseSoft, whiteSpace: 'nowrap' }}>estorba, no es una barrera</div>
          <div style={{ marginTop: 10, fontSize: 28, fontWeight: 650, lineHeight: 1.22, color: C.text }}>
            y un formato que no se lee a simple vista, lo mismo: <span style={{ color: C.roseSoft, fontWeight: 800 }}>no es un control</span>
          </div>
        </At>
      </Panel>

      {/* Foot: what is decided for the export, and the chip */}
      {frame >= chipAt - 6 ? (
        <div style={{ position: 'absolute', left: 0, top: FOOT_TOP, width: 1728, display: 'flex', justifyContent: 'center', gap: 22, ...footIn }}>
          <Pill text="la exportación se cifra igual · propuesta" tone={C.emerald} icon="lock" size={32} height={54} />
          <Pill
            text={
              <span>
                <span style={{ color: '#c4b5fd' }}>encryption</span>: vuelve con la clave · <span style={{ color: '#c4b5fd' }}>hashing</span>: no vuelve nunca
              </span>
            }
            tone={C.violet}
            icon="key"
            size={30}
            height={54}
            weight={700}
            on={0.4}
          />
        </div>
      ) : null}
    </Stage>
  );
}
