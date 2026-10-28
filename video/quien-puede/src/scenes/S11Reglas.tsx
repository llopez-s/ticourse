import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, RuleCards, type IconName, type RuleCardDef } from '../../../engine/src/ui';
import { Stage, wordFrame } from './kit';
import { SceneStamp } from './parts/Bits';
import { EndCard } from './parts/EndCard';

const S = 's11-reglas';
const W = STAGE.width;
const CARDS_H = 540;
const CARDS_TOP = 70;

/** A disc with an icon (the art slot of a rule card). */
function Disc({ icon, tone, size = 104 }: { icon: IconName; tone: string; size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: size / 2, display: 'grid', placeItems: 'center', background: alpha(tone, 0.12), border: `3px solid ${alpha(tone, 0.75)}` }}>
      <Icon name={icon} size={Math.round(size * 0.55)} color={tone} strokeWidth={2.2} />
    </div>
  );
}

/** One sub line, lit on its own word. */
function Line({ children, show, strong }: { children: ReactNode; show: number; strong?: boolean }) {
  return <div style={{ color: strong ? C.textStrong : C.text, fontWeight: strong ? 800 : 700, opacity: 0.2 + 0.8 * show, transform: `translateY(${(1 - show) * 8}px)` }}>{children}</div>;
}

/**
 * s11-reglas «Tres reglas». Three numbered slots wait from the first frames; each rule card lights on its cue:
 *  1. autenticación (quién eres, el pasaporte) / autorización (qué puedes, la tarjeta de embarque),
 *  2. permisos a grupos, y a cada grupo y cuenta de servicio, lo justo,
 *  3. un proceso puede, como mucho, lo que puede su cuenta; and on `system` its last lines: look at the system before reading a permission.
 * On `practice` the cards give way to the ALERTÓPOLIS end card with the practice «Permisos de una carpeta».
 */
export function S11Reglas(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rule1 = props.cue('rule1');
  const rule2 = props.cue('rule2');
  const rule3 = props.cue('rule3');
  const systemAt = props.cue('system');
  const practiceAt = props.cue('practice');
  const boardOut = progress(frame, practiceAt - 14, 14, EASE.inOut);

  // the sub lines of each card light on their own words, never before their card
  const twoAt = Math.max(rule1 + 6, wordFrame(S, 's11-01', 'autorización') - 8);
  const sys = [systemAt, Math.max(systemAt + 18, wordFrame(S, 's11-03', 'Windows') - 8), Math.max(systemAt + 36, wordFrame(S, 's11-03', 'Linux') - 8)] as const;

  const rules: RuleCardDef[] = [
    {
      title: ['autenticación', 'autorización'],
      tone: 'cyan',
      at: rule1,
      art: (
        <div style={{ display: 'flex', gap: 22 }}>
          <Disc icon="user" tone={C.cyan} />
          <Disc icon="key" tone={C.emerald} />
        </div>
      ),
      sub: (
        <div style={{ lineHeight: 1.25 }}>
          <Line show={progress(frame, rule1 + 4, 12)}>quién eres · pasaporte</Line>
          <Line show={progress(frame, twoAt, 12)}>qué puedes · embarque</Line>
        </div>
      ),
    },
    {
      title: ['permisos', 'a grupos'],
      tone: 'emerald',
      at: rule2,
      art: <Disc icon="users" tone={C.emerald} />,
      sub: (
        <div style={{ lineHeight: 1.25 }}>
          <Line show={progress(frame, rule2 + 4, 12)}>a cada grupo y a cada</Line>
          <Line show={progress(frame, rule2 + 10, 12)}>cuenta de servicio:</Line>
          <Line show={progress(frame, rule2 + 16, 12)} strong>
            lo justo para su tarea
          </Line>
        </div>
      ),
    },
    {
      title: ['un proceso puede,', 'como mucho,'],
      tone: 'sky',
      at: rule3,
      art: <Disc icon="gear" tone={C.sky} />,
      sub: (
        <div style={{ lineHeight: 1.25 }}>
          <Line show={progress(frame, rule3 + 4, 12)} strong>
            lo que puede su cuenta
          </Line>
          <div style={{ height: 14 }} />
          <Line show={progress(frame, sys[0], 12)}>antes de leer un permiso,</Line>
          <Line show={progress(frame, sys[0] + 6, 12)} strong>
            mira el sistema:
          </Line>
          <Line show={progress(frame, sys[1], 12)}>Windows suma,</Line>
          <Line show={progress(frame, sys[2], 12)}>Linux, con casillas básicas,</Line>
          <Line show={progress(frame, sys[2] + 8, 12)}>elige una sola clase</Line>
        </div>
      ),
    },
  ];

  return (
    <Stage>
      <SceneStamp frame={frame} hide={progress(frame, practiceAt - 12, 10)} />
      {boardOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - boardOut, fontFamily: FONT.sans }}>
          <RuleCards rules={rules} width={W} height={CARDS_H} gap={24} slotAt={10} dimFrom={practiceAt} subSize={32} artHeight={112} frame={frame} fps={fps} style={{ position: 'absolute', left: 0, top: CARDS_TOP }} />
        </div>
      ) : null}
      <EndCard frame={frame} fps={fps} at={practiceAt} />
    </Stage>
  );
}
