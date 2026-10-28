import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { enter, progress } from '../../../engine/src/theme/motion';
import { Icon, focusWeights, type IconName } from '../../../engine/src/ui';
import { Stage } from './kit';
import { Rotulo, SceneStamp } from './parts/Bits';
import { PARTES, REST_LABEL, REST_PORT, type AclId } from './parts/data';
import { FolderAcl, type RowFx } from './parts/FolderAcl';
import { Pencil } from './parts/People';
import { win } from './parts/timing';

const RX = 880;

/** The three basic permissions, with the cue that lights each one. */
const BASICS = [
  { id: 'read', word: 'leer', icon: 'eye' },
  { id: 'write', word: 'escribir', icon: 'pencil' },
  { id: 'exec', word: 'ejecutar', icon: 'play' },
] as const;

function BasicTile({ word, icon, on, show }: { word: string; icon: IconName | 'pencil'; on: number; show: number }) {
  const col = C.cyan;
  return (
    <div style={{ width: 270, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, opacity: show * (0.55 + 0.45 * on), transform: `translateY(${(1 - show) * 22}px) scale(${1 + 0.06 * on})` }}>
      <div
        style={{
          width: 150,
          height: 150,
          borderRadius: 75,
          display: 'grid',
          placeItems: 'center',
          background: alpha(col, 0.1 + 0.12 * on),
          border: `4px solid ${alpha(col, 0.45 + 0.5 * on)}`,
          boxShadow: on > 0.02 ? `0 0 ${Math.round(40 * on)}px ${alpha(col, 0.35 * on)}` : undefined,
        }}
      >
        {icon === 'pencil' ? <Pencil size={86} color={col} strokeWidth={1.9} /> : <Icon name={icon} size={86} color={col} strokeWidth={1.9} />}
      </div>
      <div style={{ fontFamily: FONT.sans, fontSize: 58, fontWeight: 850, letterSpacing: -1, color: C.textStrong }}>{word}</div>
    </div>
  );
}

/**
 * s04-permisos «Leer, escribir, ejecutar». The thread, now with the gate open and the account in Mantenimiento. First the
 * three basic permissions as big icons (`read`, `write`, `exec`; under «ejecutar», small: «en una carpeta: entrar o
 * atravesar», `folder-x`). Then each row lights beside its reason (`staff`, `maint`, `ops`, `summary`: «por eso la
 * abriste», «redacta los partes», «planifica los turnos», «lo verás enseguida»). `rest`: the grey row, «el resto del
 * puerto · no aparece = no entra»; `implicit`: «lo no concedido, se deniega».
 */
export function S04Permisos(props: SceneProps) {
  const frame = useCurrentFrame();
  const listAt = props.cue('list');
  const readAt = props.cue('read');
  const writeAt = props.cue('write');
  const execAt = props.cue('exec');
  const folderXAt = props.cue('folder-x');
  const staffAt = props.cue('staff');
  const maintAt = props.cue('maint');
  const opsAt = props.cue('ops');
  const summaryAt = props.cue('summary');
  const restAt = props.cue('rest');
  const implicitAt = props.cue('implicit');

  const rowAts = [staffAt, maintAt, opsAt, summaryAt];
  const { weights, dims } = focusWeights(frame, rowAts, { end: restAt });
  const restOn = win(frame, restAt, Number.POSITIVE_INFINITY, 12);
  const reasonsOut = 1 - progress(frame, restAt - 4, 14);
  const basicsOut = 1 - progress(frame, staffAt - 12, 14);
  const basicAts = [readAt, writeAt, execAt];
  const basicsOn = BASICS.map((_, i) => win(frame, basicAts[i], i === 2 ? staffAt - 12 : basicAts[i + 1] + 20, 10));

  const ids = ['staff', 'maint', 'ops', 'svc'] as const;
  const fx: Partial<Record<AclId, RowFx>> = {};
  ids.forEach((id, i) => {
    fx[id] = { focus: weights[i], dim: Math.max(dims[i], restOn), mine: id === 'maint' ? 1 : 0, why: progress(frame, rowAts[i] + 2, 14) * reasonsOut };
  });

  return (
    <Stage>
      <SceneStamp frame={frame} />

      <div style={{ position: 'absolute', left: 0, top: 84 }}>
        <FolderAcl
          entries={PARTES}
          fx={fx}
          gate={{ open: 1 }}
          glow={win(frame, listAt, listAt + 40, 10)}
          rest={{
            focus: restOn,
            label: frame >= restAt ? REST_PORT : REST_LABEL,
            note: progress(frame, restAt + 14, 14),
          }}
        />
      </div>

      {/* the three basic permissions */}
      {basicsOut > 0.01 ? (
        <div style={{ position: 'absolute', left: RX, top: 96, opacity: basicsOut }}>
          <div style={{ display: 'flex', gap: 24 }}>
            {BASICS.map((b, i) => (
              <BasicTile key={b.id} word={b.word} icon={b.icon} on={basicsOn[i]} show={progress(frame, basicAts[i] - 4, 14)} />
            ))}
          </div>
          <div
            style={{
              marginTop: 30,
              marginLeft: 310,
              width: 538,
              textAlign: 'right',
              fontFamily: FONT.sans,
              fontSize: 34,
              fontWeight: 700,
              lineHeight: 1.2,
              color: C.text,
              ...enter(frame, folderXAt, { distance: 16, duration: 14 }),
            }}
          >
            en una carpeta: entrar o atravesar <span style={{ color: C.muted }}>(según el sistema)</span>
          </div>
        </div>
      ) : null}

      {/* «para qué» header */}
      <div style={{ position: 'absolute', left: RX - 24, top: 132, fontFamily: FONT.sans, fontSize: 32, fontWeight: 750, color: C.muted, opacity: progress(frame, staffAt, 14) * reasonsOut }}>para qué</div>

      {/* implicit deny */}
      <Rotulo weight={progress(frame, implicitAt - 2, 16)} size={58} sub="denegación implícita" style={{ position: 'absolute', left: RX, top: 320 }}>
        lo no concedido, <span style={{ color: C.rose }}>se deniega</span>
      </Rotulo>
    </Stage>
  );
}
