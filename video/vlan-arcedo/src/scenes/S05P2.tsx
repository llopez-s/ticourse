import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { ENDS, SENDER_VLAN } from '../data/s05-p2';
import { vlan } from '../data/vlans';
import { Device, Switch, switchPortX } from './parts/Net';
import { QUESTION_TAG_OTHER, QuestionTagFallback, Rotulo } from './parts/Tags';
import { TrunkPipe } from './parts/s04-etiqueta/bits';
import { Stage } from './kit';

const W = STAGE.width;
const SW_W = 420;
const SW_H = 92;
const SW_Y = 250;
const A_X = 150;
const B_X = W - 150 - SW_W;
const PIPE = { x: A_X + SW_W, y: SW_Y + 4, w: B_X - (A_X + SW_W), h: 84 } as const;
const PORTS = 5;
const SENDER_PORT = 1;
const LANE = { top: SW_Y + SW_H + 4, bottom: 470, w: 70 } as const;
const DEV = 72;

/**
 * s05-p2 «Dos nativas distintas». Question 2 is drawn by the ENGINE over this scene from s05-01 to its end (scenario,
 * question, options, countdown, answer `ok-2`, trap `trap-2`) and so is the card on `rule-b`. The scene is a still,
 * half-lit background, present from the first frame: a trunk between two switches of ANOTHER network, its ends
 * labelled «A · nativa 10» and «B · nativa 20», and one device of VLAN 10 hanging from A. Nothing moves. Under the
 * stage, «pregunta tipo test · ejemplo · otra red, no el Consorcio» (the engine's label, from the question's `tag`;
 * the fallback here draws it only while the timeline lacks that field).
 */
export function S05P2(_props: SceneProps) {
  const sender = vlan(SENDER_VLAN).tone;
  const x = A_X + switchPortX(SENDER_PORT, PORTS, SW_W);
  const ports = (lit: number | null) => Array.from({ length: PORTS }, (_, i) => (i === lit ? { tone: sender, on: 0.7 } : { tone: C.sky, on: 0.1 }));
  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: STAGE.height, opacity: 0.75 }}>
        {/* the trunk */}
        <div style={{ position: 'absolute', left: PIPE.x, top: PIPE.y }}>
          <TrunkPipe width={PIPE.w} height={PIPE.h} />
        </div>
        {/* the device of VLAN 10, on A */}
        <div style={{ position: 'absolute', left: x - LANE.w / 2, top: LANE.top, width: LANE.w, height: LANE.bottom - LANE.top, boxSizing: 'border-box', borderRadius: 10, border: `3px solid ${alpha(sender, 0.6)}`, background: alpha(sender, 0.08) }} />
        <div style={{ position: 'absolute', left: x - 2, top: LANE.top + 4, width: 4, height: LANE.bottom - LANE.top - 8, borderRadius: 2, background: alpha(sender, 0.6) }} />
        <div style={{ position: 'absolute', left: x - DEV / 2, top: LANE.bottom + 6 }}>
          <Device icon="desktop" tone={sender} size={DEV} on={0.5} />
        </div>
        {/* the two ends */}
        <div style={{ position: 'absolute', left: A_X, top: SW_Y }}>
          <Switch width={SW_W} height={SW_H} ports={ports(SENDER_PORT)} glow={0.4} />
        </div>
        <div style={{ position: 'absolute', left: B_X, top: SW_Y }}>
          <Switch width={SW_W} height={SW_H} ports={ports(null)} glow={0.4} />
        </div>
        {ENDS.map((e, i) => (
          <div key={e.label} style={{ position: 'absolute', left: i === 0 ? A_X : B_X, top: SW_Y - 96, width: SW_W, display: 'flex', justifyContent: 'center' }}>
            <Rotulo tone={vlan(e.native).tone} size={40}>
              {e.label}
            </Rotulo>
          </div>
        ))}
      </div>
      <QuestionTagFallback scene="s05-p2" text={QUESTION_TAG_OTHER} />
    </Stage>
  );
}
