import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { Arrow, FlowNode } from './parts/Flow';
import { QuestionStill } from './parts/QuestionStill';
import type { ToolIcon } from './parts/Tools';
import { Stage } from './kit';

const W = 1728;
const H = 660;
const BOX_W = 280;
const BOX_H = 110;
const GAP = (W - 5 * BOX_W) / 4;
const ROW_Y = 230;

/** The five tools the question's flow crosses, no products (the voice says «cinco herramientas» and never reads them). */
const TOOLS: { label: string; icon: ToolIcon }[] = [
  { label: 'directorio', icon: 'users' },
  { label: 'EDR', icon: 'shield' },
  { label: 'correo', icon: 'mail' },
  { label: 'cortafuegos', icon: 'firewall' },
  { label: 'tickets', icon: 'file' },
];

/**
 * s07-p3 «Cuando el flujo falla». The engine's exam question panel covers the stage from s07-01 to the end of the
 * scene (scenario, question with «MEJOR», options, countdown, answer on `ok-3`, trap on `trap-3`, then the exam card on
 * `neglect`), so this scene is ONLY a still background, complete from the first frame and never moving: the
 * question's five-tool diagram — «directorio · EDR · correo · cortafuegos · tickets», one flow line through all of
 * them, a well-kept flow (cyan, nothing grey or broken) — readable only while the panel lands; the panel's scenario
 * carries «cinco herramientas». Plus the label «pregunta tipo examen · ejemplo» (QuestionStill).
 */
export function S07P3(_props: SceneProps) {
  const cy = ROW_Y + BOX_H / 2;
  return (
    <Stage>
      <QuestionStill>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
          <rect x={0} y={20} width={W} height={H - 20} rx={18} fill={C.ink900} />
          <rect x={30} y={ROW_Y - 90} width={W - 60} height={BOX_H + 180} rx={30} fill="none" stroke={alpha(C.cyan, 0.3)} strokeWidth={3} strokeDasharray="12 12" />
          {TOOLS.slice(1).map((_, i) => {
            const x1 = i * (BOX_W + GAP) + BOX_W;
            return <Arrow key={i} points={[[x1 + 4, cy], [x1 + GAP - 6, cy]]} color={C.cyan} width={4} />;
          })}
        </svg>
        {TOOLS.map((t, i) => (
          <div key={t.label} style={{ position: 'absolute', left: i * (BOX_W + GAP), top: ROW_Y }}>
            <FlowNode w={BOX_W} h={BOX_H} title={t.label} icon={t.icon} tone={C.sky} on={0.7} />
          </div>
        ))}
      </QuestionStill>
    </Stage>
  );
}
