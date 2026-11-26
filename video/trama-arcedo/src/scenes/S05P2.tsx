import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { LAYER } from '../data/case';
import { Device } from './parts/Net';
import { QuestionTagFallback } from './parts/Tags';
import { Stage } from './kit';

const W = STAGE.width;
const H = STAGE.height;
/** The CPD server, right of centre. */
const SRV = { x: 1120, y: 200, size: 170 } as const;
const CABLE_Y = SRV.y + SRV.size / 2;
/** Its rack neighbours, dimmer and smaller. */
const RACK = 130;
const RACK_X = [SRV.x + SRV.size + 34, SRV.x + SRV.size + 34 + RACK + 30];
/** The frame that has just arrived, resting against the server. */
const FR = { w: 300, h: 150 } as const;
const FR_X = SRV.x - 44 - FR.w;
const FR_Y = CABLE_Y - FR.h / 2;

/** One wrapper of the nested-frame glyph: a box in its layer colour, drawn inside its parent. */
function Wrap({ tone, inset, fill }: { tone: string; inset: number; fill: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset,
        boxSizing: 'border-box',
        borderRadius: RADIUS.sm,
        border: `4px solid ${tone}`,
        background: alpha(tone, fill),
      }}
    />
  );
}

/**
 * s05-p2 «Lo que ve el servidor». Question 2 is drawn by the ENGINE over this scene from s05-01 to its end (scenario,
 * question, options, countdown, answer `ok-2`, trap `trap-2`, its label) and so is the card on `rule-b`. The scene is
 * a still, half-lit background present from the first frame: the CPD server with the cable that comes from the rest of
 * the network (two dim hops on it) and, against its port, the frame that has just arrived — the four wrappers in their
 * colours (trama cyan outside with its header and FCS tail, then paquete amber, segmento emerald, datos white), with no
 * text. Nothing moves.
 */
export function S05P2(_props: SceneProps) {
  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, opacity: 0.55 }}>
        {/* the cable from the network, entering from the left */}
        <div style={{ position: 'absolute', left: 100, top: CABLE_Y - 3, width: SRV.x - 100, height: 6, borderRadius: 3, background: alpha(C.sky, 0.5) }} />
        {/* the hops left behind, as dim nodes on the cable */}
        {[240, 500].map((x) => (
          <div key={x} style={{ position: 'absolute', left: x - 36, top: CABLE_Y - 36 }}>
            <Device icon="router" tone={C.sky} size={72} on={0.1} />
          </div>
        ))}
        {/* the frame that has just arrived: header in front, FCS tail behind */}
        <div style={{ position: 'absolute', left: FR_X, top: FR_Y, width: FR.w, height: FR.h, borderRadius: RADIUS.sm, boxShadow: `0 0 36px ${alpha(LAYER.frame.tone, 0.35)}`, background: C.ink950 }}>
          <Wrap tone={LAYER.frame.tone} inset={0} fill={0.08} />
          <Wrap tone={LAYER.packet.tone} inset={18} fill={0.06} />
          <Wrap tone={LAYER.segment.tone} inset={36} fill={0.06} />
          <Wrap tone={LAYER.data.tone} inset={54} fill={0.12} />
          <div style={{ position: 'absolute', right: -26, top: 22, width: 22, height: FR.h - 44, borderRadius: 4, background: alpha(LAYER.frame.tone, 0.7) }} />
          <div style={{ position: 'absolute', left: -18, top: 40, width: 14, height: FR.h - 80, borderRadius: 4, background: alpha(LAYER.frame.tone, 0.5) }} />
        </div>
        {/* the server of the CPD */}
        <div style={{ position: 'absolute', left: SRV.x, top: SRV.y }}>
          <Device icon="server" tone={C.cyan} size={SRV.size} on={0.6} />
        </div>
        {RACK_X.map((x) => (
          <div key={x} style={{ position: 'absolute', left: x, top: SRV.y + (SRV.size - RACK) / 2 }}>
            <Device icon="server" tone={C.sky} size={RACK} on={0} />
          </div>
        ))}
        {/* the floor line of the CPD */}
        <div style={{ position: 'absolute', left: SRV.x - 60, top: SRV.y + SRV.size + 40, width: RACK_X[1] + RACK + 40 - (SRV.x - 60), height: 3, background: alpha(C.sky, 0.3) }} />
      </div>
      <QuestionTagFallback scene="s05-p2" />
    </Stage>
  );
}
