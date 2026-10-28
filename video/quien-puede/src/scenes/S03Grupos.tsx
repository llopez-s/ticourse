import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Chip, mix } from '../../../engine/src/ui';
import { Stage } from './kit';
import { AccountCard } from './parts/AccountCard';
import { ChoiceButtons, Rotulo, SceneStamp } from './parts/Bits';
import { PARTES } from './parts/data';
import { FolderAcl, FolderGlyph } from './parts/FolderAcl';
import { SoftTag } from './parts/Labels';
import { Crowd, GroupCard } from './parts/People';
import { thinkWindow, win } from './parts/timing';

const S = 's03-grupos';
const RX = 880; // the right-hand zone
const CHOICES = ['Escritura para todos', 'Que te metan en Mantenimiento'] as const;

/** 100 little folders, lit by the churn. */
function FolderGrid({ lit, show }: { lit: number; show: number }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 76px)', gridAutoRows: 46, opacity: show }}>
      {Array.from({ length: 100 }, (_, i) => {
        const on = lit > i;
        return (
          <div key={i} style={{ opacity: on ? 1 : 0.35 }}>
            <FolderGlyph width={50} tone={on ? C.amber : C.muted} />
          </div>
        );
      })}
    </div>
  );
}

/**
 * s03-grupos «La carpeta que no se deja». The thread (the folder and its list) on the left, with the `escribir` gate shut.
 * `groups` + `row`: permissions go to groups; «Mantenimiento · leer y escribir» lights and its group appears with the
 * members as silhouettes and an empty slot «tu cuenta · aún no» (`outside`). `churn` + `hundred`: every join, leave and
 * change would mean touching a hundred folders. `proposal` + `choice`: the quick fix and the two buttons (kept LOW: the
 * think card owns the top). `joins` (sound «lock»): the account drops into the slot and the gate opens. `amber` +
 * `pencil`: the same fix means the whole port, in silhouettes, with a pencil. `wrap`: the fault of an account is mended
 * in the account. Title does not give the answer away.
 */
export function S03Grupos(props: SceneProps) {
  const frame = useCurrentFrame();
  const groupsAt = props.cue('groups');
  const rowAt = props.cue('row');
  const outsideAt = props.cue('outside');
  const churnAt = props.cue('churn');
  const hundredAt = props.cue('hundred');
  const proposalAt = props.cue('proposal');
  const choiceAt = props.cue('choice');
  const joinsAt = props.cue('joins');
  const amberAt = props.cue('amber');
  const pencilAt = props.cue('pencil');
  const wrapAt = props.cue('wrap');
  const think = thinkWindow(S);

  // --- the left thread
  const maintFocus = Math.max(win(frame, rowAt, churnAt, 12), win(frame, joinsAt, amberAt, 12), win(frame, wrapAt, Number.POSITIVE_INFINITY, 12));
  const gateOpen = progress(frame, joinsAt + 6, 22, EASE.out);
  const mine = progress(frame, joinsAt + 18, 14);
  const stampHide = think ? win(frame, think.from - 6, think.to + 6, 8) : 0;

  // --- the right-hand layers
  const wGroup = Math.max(win(frame, rowAt, churnAt - 6), win(frame, joinsAt + 28, amberAt - 6), win(frame, wrapAt - 4));
  const wChurn = win(frame, churnAt - 4, proposalAt - 4);
  const wPropose = win(frame, proposalAt - 2, joinsAt + 40);
  const wCrowd = win(frame, amberAt - 2, wrapAt - 6);
  const slotShow = progress(frame, outsideAt - 2, 14);
  const slotFill = progress(frame, joinsAt, 24, EASE.out);
  const afterJoin = frame >= joinsAt;

  // the account: lonely at first, then it flies into the slot on `joins`
  const lonely = win(frame, 8, churnAt - 8, 10);
  const fichaY = mix(250, 500, progress(frame, rowAt - 12, 22, EASE.inOut));
  const fly = progress(frame, joinsAt - 8, 26, EASE.inOut);
  const flyOpacity = win(frame, joinsAt - 14, joinsAt + 22, 8);

  // --- churn: three events, each touching a third of the folders
  const lit = 100 * progress(frame, churnAt, Math.max(30, hundredAt - churnAt), EASE.inOut);
  const events = ['entra', 'sale', 'cambia de puesto'];
  const evAt = events.map((_, i) => churnAt + i * Math.max(12, (hundredAt - churnAt) / 3));

  return (
    <Stage>
      <SceneStamp frame={frame} hide={stampHide} />

      {/* the thread */}
      <div style={{ position: 'absolute', left: 0, top: 84 }}>
        <FolderAcl
          entries={PARTES}
          fx={{
            staff: { dim: maintFocus },
            maint: { focus: maintFocus, mine },
            ops: { dim: maintFocus },
            svc: { dim: maintFocus },
          }}
          rest={{ dim: maintFocus }}
          gate={{ open: gateOpen }}
        />
      </div>

      {/* «los permisos se dan a grupos» */}
      <Rotulo weight={win(frame, groupsAt, churnAt - 6)} size={54} style={{ position: 'absolute', left: RX, top: 74 }}>
        los permisos se dan a <span style={{ color: C.cyan }}>grupos</span>
      </Rotulo>

      {/* the account on its own, outside the group */}
      {lonely > 0.01 ? (
        <div style={{ position: 'absolute', left: RX, top: fichaY, opacity: lonely, display: 'flex', alignItems: 'center', gap: 24 }}>
          <AccountCard compact />
          {frame < groupsAt + 40 ? <SoftTag text="sin permiso para escribir" tone={C.rose} size={32} /> : null}
        </div>
      ) : null}

      {/* the group, its members and the empty slot */}
      {wGroup > 0.01 ? (
        <div style={{ position: 'absolute', left: RX, top: 170, opacity: wGroup }}>
          <GroupCard
            title="grupo Mantenimiento"
            members={5}
            show={progress(frame, rowAt + 4, 24)}
            glow={Math.max(win(frame, rowAt, outsideAt + 30, 12), afterJoin ? slotFill * 0.6 : 0)}
            slot={{ label: afterJoin ? 'tu cuenta · ya dentro' : 'tu cuenta · aún no', fill: slotFill, show: slotShow }}
          />
        </div>
      ) : null}

      {/* the account flies into the slot */}
      {flyOpacity > 0.01 && fly < 1 ? (
        <div style={{ position: 'absolute', left: mix(RX, 1616 - 165, fly), top: mix(500, 318, fly), opacity: flyOpacity * (1 - 0.4 * fly) }}>
          <AccountCard compact on={fly} />
        </div>
      ) : null}

      {/* churn: a hundred folders */}
      {wChurn > 0.01 ? (
        <div style={{ position: 'absolute', left: RX, top: 0, opacity: wChurn }}>
          <div style={{ position: 'absolute', left: 0, top: 74, display: 'flex', gap: 16, opacity: 1 - progress(frame, hundredAt - 4, 10) }}>
            {events.map((e, i) => (
              <div key={e} style={{ opacity: progress(frame, evAt[i], 10), transform: `translateY(${(1 - progress(frame, evAt[i], 10)) * 14}px)` }}>
                <Chip accent="amber" size={36}>
                  {e}
                </Chip>
              </div>
            ))}
            <div style={{ fontFamily: FONT.sans, fontSize: 40, fontWeight: 850, color: C.amber, paddingLeft: 8, alignSelf: 'center', fontVariantNumeric: 'tabular-nums' }}>
              {Math.round(lit)} carpetas
            </div>
          </div>
          <Rotulo weight={progress(frame, hundredAt - 2, 14)} size={48} style={{ position: 'absolute', left: 0, top: 58 }}>
            cien carpetas que habría que
            <br />
            tocar <span style={{ color: C.amber }}>una a una</span>
          </Rotulo>
          <div style={{ position: 'absolute', left: 0, top: 196 }}>
            <FolderGrid lit={lit} show={1} />
          </div>
        </div>
      ) : null}

      {/* the quick fix and the two buttons, low in the stage */}
      {wPropose > 0.01 ? (
        <div style={{ position: 'absolute', left: RX, top: 0, opacity: wPropose }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 214,
              width: 840,
              boxSizing: 'border-box',
              padding: '18px 30px 22px',
              borderRadius: RADIUS.lg,
              border: `3px dashed ${alpha(C.amber, 0.7)}`,
              background: alpha(C.amber, 0.07),
              fontFamily: FONT.sans,
              opacity: progress(frame, proposalAt, 14),
            }}
          >
            <SoftTag text="propuesta rápida" size={28} />
            <div style={{ marginTop: 12, fontSize: 46, fontWeight: 850, lineHeight: 1.12, color: C.textStrong }}>escritura para todo el personal del puerto</div>
          </div>
          <div style={{ position: 'absolute', left: 0, top: 440 }}>
            <ChoiceButtons items={CHOICES} answer={1} show={progress(frame, choiceAt, 14)} reveal={progress(frame, joinsAt, 14)} width={840} size={40} />
          </div>
        </div>
      ) : null}

      {/* the whole port, in silhouettes, with a pencil */}
      {wCrowd > 0.01 ? (
        <div style={{ position: 'absolute', left: RX, top: 0, opacity: wCrowd }}>
          <div style={{ position: 'absolute', left: 0, top: 78 }}>
            <SoftTag text="si se abre a todos: todo el puerto" size={32} />
          </div>
          <div style={{ position: 'absolute', left: 0, top: 170 }}>
            <Crowd cols={9} rows={3} size={78} reveal={progress(frame, amberAt, 26)} pencil={progress(frame, pencilAt, 14)} />
          </div>
          <Rotulo weight={progress(frame, pencilAt + 4, 14)} size={42} style={{ position: 'absolute', left: 0, top: 500 }}>
            cualquiera podría cambiar
            <br />o machacar los partes
          </Rotulo>
        </div>
      ) : null}

      {/* the close */}
      <Rotulo weight={progress(frame, wrapAt, 16)} size={54} style={{ position: 'absolute', left: RX, top: 468 }}>
        el fallo de una cuenta
        <br />
        se arregla <span style={{ color: C.emerald }}>en la cuenta</span>
      </Rotulo>
    </Stage>
  );
}

