import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Checklist, Chip, Icon, Panel, Stamp } from '../../../engine/src/ui';
import { CASE } from '../data/canon';
import { Stage, wordFrame } from './kit';

/** Content starts below the think prompt, which sits at the top of the stage. */
const TOP = 190;
const LEFT_W = 960;
const RIGHT_LEFT = LEFT_W + 48;
const RIGHT_W = 1728 - RIGHT_LEFT;

/**
 * S04 «Cuando el hash no cuadra»: the other ending. The image hash differs,
 * the copy loses its value as evidence, signing the form or switching to MD5
 * fixes nothing, and the acquisition is repeated and the discrepancy documented.
 */
export function S04Mismatch(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const S = 's04-mismatch';
  const mismatch = props.cue('mismatch');
  const invalid = props.cue('invalid');
  const repeat = props.cue('repeat');
  const signNo = wordFrame(S, 's04-02', 'arregla');
  const md5No = wordFrame(S, 's04-03', 'tampoco');
  const documented = wordFrame(S, 's04-03', 'discrepancia');

  const cmp = enter(frame, 30, { distance: 24 });
  const bad = springIn(frame, fps, mismatch, { damping: 13 });
  const optionsIn = enter(frame, signNo - 40, { distance: 24, axis: 'x' });

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: TOP, width: LEFT_W, ...cmp }}>
        <Panel title="Verificación de integridad" icon="key" accent={frame >= mismatch ? 'rose' : 'cyan'} glow={progress(frame, mismatch, 10) * 0.8} bodyStyle={{ padding: '18px 28px' }}>
          <Compare label="Original · antes" hash={CASE.hash} />
          <Compare label="Datos adquiridos (E01)" hash={frame >= mismatch ? CASE.badHash : CASE.hash} bad={bad} />
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16, opacity: Math.min(1, bad * 1.4) }}>
            <Chip accent="rose" icon="x" size={TYPE.label} solid>
              MISMATCH
            </Chip>
          </div>
        </Panel>
        {/* The image file loses its value as evidence */}
        <div style={{ position: 'relative', marginTop: 22, height: 110, ...enter(frame, invalid - 30, { distance: 16 }) }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              height: 104,
              padding: '0 26px',
              borderRadius: RADIUS.lg,
              border: `2px solid ${frame >= invalid ? alpha(C.rose, 0.6) : C.ink600}`,
              background: C.ink850,
              fontFamily: FONT.sans,
              opacity: frame >= invalid ? 0.7 : 1,
            }}
          >
            <Icon name="file" size={44} color={C.muted} />
            <span style={{ fontFamily: FONT.mono, fontSize: TYPE.label, color: C.text }}>{CASE.image}</span>
            <span style={{ marginLeft: 'auto', fontSize: TYPE.small, color: C.muted, opacity: 1 - progress(frame, invalid, 8) }}>no es una copia exacta</span>
          </div>
          <div style={{ position: 'absolute', right: 22, top: 22 }}>
            <Stamp frame={frame} at={invalid + 2} accent="rose" rotate={-5} size={36}>
              Sin valor probatorio
            </Stamp>
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', left: RIGHT_LEFT, top: TOP, width: RIGHT_W, height: 660 - TOP, ...optionsIn }}>
        <Panel title="¿Cómo se arregla?" icon="gear" accent={frame >= repeat ? 'emerald' : 'amber'} style={{ height: '100%' }} bodyStyle={{ padding: 26 }}>
          <Rejected frame={frame} at={signNo} label="Firmar el formulario igualmente" />
          <Rejected frame={frame} at={md5No} label="Recalcular con MD5" note="más débil" />
          <div style={{ height: 2, background: C.ink700, margin: '22px 0' }} />
          <Checklist
            frame={frame}
            size={TYPE.label}
            items={[
              { label: 'Repetir la adquisición', at: repeat },
              { label: 'Documentar la discrepancia', at: documented },
            ]}
          />
        </Panel>
      </div>
    </Stage>
  );
}

function Compare({ label, hash, bad = 0 }: { label: string; hash: string; bad?: number }) {
  const isBad = bad > 0.01;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '12px 0', borderBottom: `2px solid ${C.ink700}`, fontFamily: FONT.sans }}>
      <span style={{ width: 380, fontSize: TYPE.small, fontWeight: 650, color: C.text }}>{label}</span>
      <span
        style={{
          fontFamily: FONT.mono,
          fontSize: TYPE.body,
          fontWeight: 700,
          color: isBad ? C.roseSoft : C.cyanSoft,
          transform: isBad ? `translateX(${Math.sin(bad * Math.PI * 3) * 6 * (1 - bad)}px)` : undefined,
        }}
      >
        {hash}
      </span>
    </div>
  );
}

/** An option the narration rules out: it appears, then gets struck through. */
function Rejected({ frame, at, label, note }: { frame: number; at: number; label: string; note?: string }) {
  const inn = enter(frame, at - 34, { distance: 12 });
  const strike = progress(frame, at, 14);
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0', fontFamily: FONT.sans, ...inn }}>
      <Icon name={strike > 0.5 ? 'x' : 'alert'} size={36} color={strike > 0.5 ? C.rose : C.amber} />
      <span style={{ position: 'relative', fontSize: TYPE.label, fontWeight: 650, color: strike > 0.5 ? C.muted : C.textStrong }}>
        {label}
        <span style={{ position: 'absolute', left: 0, top: '52%', height: 4, width: `${strike * 100}%`, background: C.rose, borderRadius: 2 }} />
      </span>
      {note ? <span style={{ marginLeft: 'auto', fontSize: TYPE.small, color: C.muted }}>{note}</span> : null}
    </div>
  );
}
