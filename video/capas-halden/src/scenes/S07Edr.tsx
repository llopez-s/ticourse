import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, TYPE } from '../../../engine/src/theme/tokens';
import { enter, fadeIn, progress } from '../../../engine/src/theme/motion';
import { Chip, NodeCard, Panel, SeverityBadge, type IconName, type Severity } from '../../../engine/src/ui';
import { C2, HOST, PROCESS_TREE } from '../data/s07-edr';
import { Stage, segment } from './kit';

const LEFT_W = 1000;
const RIGHT_LEFT = LEFT_W + 40;
const RIGHT_W = 1728 - RIGHT_LEFT;
const CARD_W = 900;
const ROW_H = 96;
const ROW_GAP = 44;
const BLOCK = ROW_H + ROW_GAP;
const STUB_X = 46; // icon centre inside NodeCard (16px padding + 30px half icon box)

type Row = { icon: IconName; label: string; sub: string };

const ROWS: Row[] = [
  { icon: 'file', label: PROCESS_TREE[0].label, sub: PROCESS_TREE[0].sub },
  { icon: 'terminal', label: PROCESS_TREE[1].label, sub: PROCESS_TREE[1].sub },
  { icon: 'terminal', label: PROCESS_TREE[2].label, sub: PROCESS_TREE[2].sub },
  { icon: 'link', label: `TCP ${C2.port}`, sub: `${C2.ip} · sin resolución DNS` },
];

/**
 * S07 «El EDR ve el proceso»: EDR console with the process tree WINWORD.EXE
 * -> cmd.exe -> powershell.exe -enc … -> a :443 connection to the C2's fixed
 * IP, then a triage-context panel (user, time, path, digital signature). The
 * point: an alert is suspicion, not proof — triage needs context.
 */
export function S07Edr(props: SceneProps) {
  const frame = useCurrentFrame();
  const tree = props.cue('tree');
  const child = props.cue('child');
  const encoded = props.cue('encoded');
  const conn = props.cue('conn');
  const context = props.cue('context');
  const noSuspectAt = segment(props, 's07-04').from;
  const noConsoleAt = segment(props, 's07-05').from;

  const rowAt = [tree, child, encoded, conn];
  const severity: Severity = frame >= conn ? 'ALTA' : frame >= child ? 'MEDIA' : 'BAJA';

  const panelIn = enter(frame, 4, { distance: 18 });

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, width: LEFT_W, height: 660, ...panelIn }}>
        <Panel
          title={`EDR · ${HOST.name}`}
          icon="terminal"
          accent="cyan"
          right={frame >= tree ? <SeverityBadge level={severity} /> : undefined}
          style={{ height: '100%' }}
          bodyStyle={{ padding: '32px 36px' }}
        >
          <div style={{ position: 'relative', width: CARD_W, height: 4 * BLOCK - ROW_GAP }}>
            {ROWS.map((row, i) => {
              if (frame < rowAt[i]) return null;
              const inn = enter(frame, rowAt[i], { distance: 16 });
              return (
                <div key={row.label}>
                  {i > 0 ? (
                    <Stub frame={frame} at={rowAt[i]} top={(i - 1) * BLOCK + ROW_H} height={ROW_GAP} alert={i === 3} />
                  ) : null}
                  <div style={{ position: 'absolute', left: 0, top: i * BLOCK, width: CARD_W, ...inn }}>
                    <NodeCard
                      icon={row.icon}
                      label={row.label}
                      sublabel={row.sub}
                      // WINWORD.EXE reads as ordinary until it grows a console child —
                      // that's the moment suspicion starts (an alert is not yet proof).
                      state={i === 0 && frame < child ? 'normal' : 'alert'}
                      width={CARD_W}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      <div style={{ position: 'absolute', left: RIGHT_LEFT, top: 0, width: RIGHT_W, height: 660, opacity: fadeIn(frame, conn - 4, 14) }}>
        <Panel
          title="Contexto de triaje"
          icon="search"
          accent="amber"
          glow={progress(frame, context, 12) * (1 - progress(frame, context + 70, 30))}
          style={{ height: 430 }}
          bodyStyle={{ padding: '8px 28px' }}
        >
          {frame < context ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                fontFamily: FONT.sans,
                fontSize: TYPE.small,
                color: C.muted,
                fontStyle: 'italic',
              }}
            >
              Recopilando contexto…
            </div>
          ) : (
            <ContextFields frame={frame} at={context} />
          )}
        </Panel>

        <div style={{ position: 'absolute', left: 4, top: 462, width: RIGHT_W - 8, ...enter(frame, noSuspectAt, { distance: 16 }) }}>
          <div style={{ fontFamily: FONT.sans, fontSize: TYPE.h3, fontWeight: 800, color: C.textStrong, lineHeight: 1.22 }}>
            Una alerta es sospecha,
            <br />
            no prueba.
          </div>
        </div>

        {frame >= noConsoleAt ? (
          <div style={{ position: 'absolute', left: 4, top: 604, ...enter(frame, noConsoleAt, { distance: 14 }) }}>
            <Chip accent="amber" icon="alert" size={TYPE.small}>
              Lucía no esperaba ninguna consola
            </Chip>
          </div>
        ) : null}
      </div>
    </Stage>
  );
}

/** Vertical elbow: a growing line from the parent row down to the child's top. */
function Stub({ frame, at, top, height, alert }: { frame: number; at: number; top: number; height: number; alert: boolean }) {
  const draw = progress(frame, at - 10, 16);
  if (draw <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: STUB_X,
        top,
        width: 3,
        height: height * draw,
        background: alert ? C.rose : C.ink500,
        opacity: 0.85,
      }}
    />
  );
}

function ContextFields({ frame, at }: { frame: number; at: number }) {
  const rows: { label: string; value: string; mono?: boolean }[] = [
    { label: 'Usuaria', value: `${HOST.user} · ${HOST.role}` },
    { label: 'Hora', value: HOST.time },
    { label: 'Ruta', value: HOST.path, mono: true },
    { label: 'Firma digital', value: HOST.signature },
  ];
  return (
    <div style={{ display: 'grid', gap: 16, paddingTop: 16 }}>
      {rows.map((row, i) => {
        const rowAt = at + i * 9;
        if (frame < rowAt) return null;
        const inn = enter(frame, rowAt, { distance: 12 });
        return (
          <div key={row.label} style={{ ...inn }}>
            <div
              style={{
                fontFamily: FONT.sans,
                fontSize: TYPE.micro,
                fontWeight: 750,
                letterSpacing: 1,
                textTransform: 'uppercase',
                color: C.muted,
              }}
            >
              {row.label}
            </div>
            <div
              style={{
                fontFamily: row.mono ? FONT.mono : FONT.sans,
                fontSize: row.mono ? TYPE.small : TYPE.label,
                fontWeight: 650,
                color: C.textStrong,
                marginTop: 2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {row.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
