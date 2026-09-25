import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { ACCENT, C, FONT, RADIUS, TYPE, alpha, type Accent } from '../../../engine/src/theme/tokens';
import { EASE, enter, fadeIn, progress, springIn } from '../../../engine/src/theme/motion';
import { Chip, Cursor, Icon, Panel, type IconName } from '../../../engine/src/ui';
import { Stage, segment, wordFrame } from './kit';

const STACK_W = 1120;
const ROW_H = 86;
const ROW_GAP = 12;
const STACK_TOP = 34;
const SIDE_LEFT = STACK_W + 40;
const SIDE_W = 1728 - SIDE_LEFT;

type Layer = { label: string; icon: IconName; at: number; lost: 'all' | 'part' | null };

/**
 * S02 «Orden de volatilidad»: the six layers from most to least volatile,
 * what a shutdown destroys, and why memory is dumped before powering off.
 */
export function S02Volatility(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const S = 's02-volatility';
  const stack = props.cue('stack');
  const ramFirst = props.cue('ram-first');
  const powerOff = props.cue('power-off');
  const lost = props.cue('lost');
  const dump = wordFrame(S, 's02-04', 'vuelca');
  const listStart = segment(props, 's02-03').from;

  const layers: Layer[] = [
    { label: 'Memoria RAM y cache', icon: 'bolt', at: ramFirst, lost: 'all' },
    { label: 'Estado de red y conexiones', icon: 'network', at: wordFrame(S, 's02-03', 'red'), lost: 'all' },
    { label: 'Procesos y archivos temporales', icon: 'gear', at: wordFrame(S, 's02-03', 'procesos'), lost: 'part' },
    { label: 'Disco', icon: 'database', at: wordFrame(S, 's02-03', 'disco'), lost: null },
    { label: 'Logs remotos y backups', icon: 'archive', at: wordFrame(S, 's02-03', 'logs'), lost: null },
    { label: 'Papel y archivo histórico', icon: 'file', at: wordFrame(S, 's02-03', 'papel'), lost: null },
  ];
  const ramDetails = [
    { t: 'procesos', at: wordFrame(S, 's02-02', 'procesos') },
    { t: 'conexiones', at: wordFrame(S, 's02-02', 'conexiones') },
    { t: 'claves de cifrado', at: wordFrame(S, 's02-02', 'claves') },
  ];

  const frameIn = enter(frame, stack - 8, { distance: 20 });
  // Shutdown: the top layers die at `lost`; the dump beat brings them back.
  const dead = progress(frame, lost, 16) * (1 - progress(frame, dump - 6, 18));
  const sideIn = enter(frame, powerOff - 40, { distance: 30, axis: 'x' });

  return (
    <Stage>
      {/* Volatility axis */}
      <div style={{ position: 'absolute', left: 0, top: STACK_TOP, width: 34, height: 6 * (ROW_H + ROW_GAP) - ROW_GAP, ...frameIn }}>
        <div
          style={{
            position: 'absolute',
            left: 8,
            top: 0,
            bottom: 0,
            width: 12,
            borderRadius: 6,
            background: `linear-gradient(180deg, ${C.rose} 0%, ${C.amber} 35%, ${C.cyan} 70%, ${C.ink600} 100%)`,
          }}
        />
      </div>
      <div style={{ position: 'absolute', left: 50, top: -4, fontFamily: FONT.sans, fontSize: TYPE.micro, fontWeight: 700, letterSpacing: 2, color: C.roseSoft, ...frameIn }}>
        MÁS VOLÁTIL
      </div>

      {layers.map((layer, k) => {
        const top = STACK_TOP + k * (ROW_H + ROW_GAP);
        const slot = fadeIn(frame, stack + k * 3, 10);
        const fill = springIn(frame, fps, layer.at - 4, { damping: 16 });
        const isFirst = k === 0;
        const focus = isFirst ? progress(frame, ramFirst, 12) * (1 - progress(frame, listStart, 20)) : 0;
        const kill = layer.lost === 'all' ? dead : layer.lost === 'part' ? dead * 0.6 : 0;
        const accent: Accent = isFirst ? 'cyan' : 'muted';
        return (
          <div key={layer.label} style={{ position: 'absolute', left: 50, top, width: STACK_W - 50, height: ROW_H, opacity: slot }}>
            {/* empty slot */}
            <div style={{ position: 'absolute', inset: 0, borderRadius: RADIUS.md, border: `2px dashed ${C.ink700}` }} />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                padding: '0 24px',
                borderRadius: RADIUS.md,
                border: `2px solid ${kill > 0.3 ? alpha(C.rose, 0.7) : focus > 0 ? alpha(C.cyan, 0.4 + 0.5 * focus) : C.ink600}`,
                background: kill > 0.3 ? alpha(C.rose, 0.08) : `linear-gradient(90deg, ${C.ink800} 0%, ${C.ink850} 100%)`,
                boxShadow: focus > 0 ? `0 0 ${30 * focus}px ${alpha(C.cyan, 0.35 * focus)}` : 'none',
                opacity: Math.min(1, fill * 1.3),
                transform: `translateX(${(1 - fill) * -40}px)`,
                fontFamily: FONT.sans,
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  display: 'grid',
                  placeItems: 'center',
                  background: alpha(ACCENT[accent].fg, 0.14),
                  fontSize: TYPE.small,
                  fontWeight: 800,
                  color: ACCENT[accent].soft,
                  flexShrink: 0,
                }}
              >
                {k + 1}
              </div>
              <Icon name={layer.icon} size={36} color={kill > 0.3 ? C.roseSoft : isFirst ? C.cyan : C.muted} />
              <span
                style={{
                  fontSize: TYPE.label,
                  fontWeight: 650,
                  color: kill > 0.3 ? alpha(C.text, 0.45) : C.textStrong,
                  textDecoration: kill > 0.5 && layer.lost === 'all' ? 'line-through' : 'none',
                  textDecorationColor: C.rose,
                  textDecorationThickness: 3,
                  whiteSpace: 'nowrap',
                }}
              >
                {layer.label}
              </span>
              {isFirst && kill < 0.05 ? (
                <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
                  {ramDetails.map((d) => (
                    <span key={d.t} style={{ ...enter(frame, d.at - 3, { distance: 10 }) }}>
                      <Chip accent="cyan" size={TYPE.micro}>
                        {d.t}
                      </Chip>
                    </span>
                  ))}
                </div>
              ) : null}
              {layer.lost && kill > 0.05 ? (
                <span style={{ marginLeft: 'auto', opacity: Math.min(1, kill * 1.5) }}>
                  <Chip accent="rose" icon="x" size={TYPE.small} solid>
                    {layer.lost === 'all' ? 'Se pierde' : 'En parte'}
                  </Chip>
                </span>
              ) : null}
            </div>
          </div>
        );
      })}

      {/* The shortcut that destroys evidence, and the right order */}
      <div style={{ position: 'absolute', left: SIDE_LEFT, top: STACK_TOP, width: SIDE_W, height: 6 * (ROW_H + ROW_GAP) - ROW_GAP, ...sideIn }}>
        <Panel title="¿Qué se hace primero?" icon="power" accent={dead > 0.3 ? 'rose' : 'emerald'} style={{ height: '100%' }} bodyStyle={{ padding: 26 }}>
          <ActionPanel frame={frame} powerOff={powerOff} lost={lost} dump={dump} />
        </Panel>
      </div>
    </Stage>
  );
}

const BTN_H = 84;

function ActionPanel({ frame, powerOff, lost, dump }: { frame: number; powerOff: number; lost: number; dump: number }) {
  const clicked = frame >= powerOff + 20;
  const undo = progress(frame, dump - 6, 18);
  const order = [
    { label: 'Volcar la memoria', at: dump + 4 },
    { label: 'Apagar', at: dump + 16 },
    { label: 'Retirar el disco', at: dump + 28 },
  ];
  return (
    <div style={{ position: 'relative', height: '100%', fontFamily: FONT.sans }}>
      {/* Wrong shortcut */}
      <div style={{ opacity: 1 - undo }}>
        <div
          style={{
            height: BTN_H,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '0 24px',
            borderRadius: 18,
            border: `3px solid ${clicked ? C.rose : alpha(C.rose, 0.6)}`,
            background: clicked ? alpha(C.rose, 0.22) : alpha(C.rose, 0.08),
            fontSize: TYPE.body,
            fontWeight: 750,
            color: C.textStrong,
          }}
        >
          <Icon name="power" size={40} color={C.rose} />
          Apagar para ir rápido
        </div>
        <div style={{ marginTop: 22, fontSize: TYPE.label, lineHeight: 1.35, color: C.roseSoft, ...enter(frame, lost + 4, { distance: 12 }) }}>
          Las capas de arriba se pierden para siempre.
        </div>
      </div>
      {/* The pointer goes for the shortcut */}
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - progress(frame, lost + 20, 12) }}>
        <Cursor
          frame={frame}
          path={[
            { x: 420, y: 220, at: powerOff - 26 },
            { x: 300, y: BTN_H / 2, at: powerOff + 12 },
            { x: 300, y: BTN_H / 2, at: powerOff + 20, click: true },
          ]}
        />
      </div>
      {/* The right order */}
      <div style={{ position: 'absolute', left: 0, top: 0, right: 0, opacity: undo }}>
        <div style={{ fontSize: TYPE.small, fontWeight: 700, letterSpacing: 2, color: C.emerald }}>ORDEN CORRECTO</div>
        <div style={{ marginTop: 18, display: 'grid', gap: 18 }}>
          {order.map((step, k) => {
            const p = progress(frame, step.at, 12, EASE.out);
            return (
              <div key={step.label} style={{ display: 'flex', alignItems: 'center', gap: 18, opacity: p, transform: `translateY(${(1 - p) * 12}px)` }}>
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 27,
                    display: 'grid',
                    placeItems: 'center',
                    background: k === 0 ? C.emerald : alpha(C.emerald, 0.14),
                    color: k === 0 ? C.ink950 : C.emerald,
                    fontSize: TYPE.label,
                    fontWeight: 850,
                  }}
                >
                  {k + 1}
                </div>
                <span style={{ fontSize: TYPE.body, fontWeight: 700, color: k === 0 ? C.textStrong : C.text }}>{step.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
