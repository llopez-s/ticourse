import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { AIR, CASE, CONTAINER, DECISION, ISOLATION, LESS, MORE, PROPOSAL, VM } from '../data/s04-escalera';
import { CaseTag, ExamChip } from './parts/Labels';
import { HostStack } from './parts/Software';
import { VmStack } from './parts/VmStack';
import { AirGap } from './parts/s04-escalera/AirGap';
import { ProposalSketch } from './parts/s04-escalera/ProposalSketch';
import { Rung } from './parts/s04-escalera/Rung';
import { TrainStrip } from './parts/s04-escalera/TrainStrip';
import { Stage, wordFrame } from './kit';

const S = 's04-escalera';
const ROW_Y = [110, 214, 380];
const ROW_H = [94, 156, 146];

/** A short flicker for the glitch on `spill` (≤ 1 s), then a steady rose. */
function flicker(frame: number, at: number): number {
  if (frame < at) return 0;
  const t = frame - at;
  if (t < 28) return Math.floor(t / 3) % 2 === 0 ? 1 : 0.35;
  return 0.75;
}

/**
 * s04-escalera «Tres niveles y su precio». The proposal (the HR files on the notice board's host) types in under
 * «propuesta · sin fecha»; on `ladder` three dashed rungs wait beside a bar «de más a menos aislamiento». AIR GAP fills
 * on `air-gap`: the cable between two blank machines snaps (the lock sound) and a document crosses the gap by hand on
 * «entra». VIRTUAL MACHINE on `vm`: each VM with its own kernel over the hypervisor. CONTAINER on `container`: tiles on
 * ONE kernel; «kernel» lights amber on `shared-kernel`; on `spill` the kernel flickers rose (the glitch) and the rose
 * climbs into the neighbours, with «container escape». On `decision` the proposal gives way to the decision and the VM
 * rung is ringed emerald. On `train` the train runs along the bottom; on `train-map` its labels, then the VM's own train.
 */
export function S04Escalera(props: SceneProps) {
  const frame = useCurrentFrame();
  const proposalAt = props.cue('proposal');
  const ladderAt = props.cue('ladder');
  const airAt = props.cue('air-gap');
  const caminoAt = wordFrame(S, 's04-02', 'camino') - 6;
  const entraAt = wordFrame(S, 's04-02', 'entra') - 6;
  const vmAt = props.cue('vm');
  const vmKernelAt = wordFrame(S, 's04-03', 'kernel') - 6;
  const contAt = props.cue('container');
  const kernelAt = wordFrame(S, 's04-04', 'kernel') - 4;
  const spillAt = props.cue('spill');
  const llegarAt = wordFrame(S, 's04-04', 'llegar') - 6;
  const decisionAt = props.cue('decision');
  const line2At = wordFrame(S, 's04-05', 'compartir') - 6;
  const trainAt = props.cue('train');
  const locoAt = wordFrame(S, 's04-06', 'kernel') - 6;
  const carsAt = wordFrame(S, 's04-06', 'contenedores') - 6;
  const vmTrainAt = wordFrame(S, 's04-06', 'Una') - 4;
  const costAt = wordFrame(S, 's04-06', 'cuesta') - 6;

  const caseIn = enter(frame, -6, { distance: 12, duration: 14 });
  const propIn = progress(frame, proposalAt, 16);
  const propOut = progress(frame, decisionAt - 10, 12, EASE.inOut);
  const slot = progress(frame, ladderAt - 4, 16);
  const barIn = progress(frame, ladderAt, 20);
  const decided = progress(frame, decisionAt, 16);
  const focusOf = (from: number, to: number) => progress(frame, from - 4, 10) * (1 - progress(frame, to - 4, 12));

  const fault = flicker(frame, spillAt - 2);
  const hot = progress(frame, kernelAt, 10);

  return (
    <Stage>
      {/* The proposal, then the decision in its place */}
      {propOut < 1 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, opacity: 1 - propOut }}>
          <div style={caseIn}>
            <CaseTag text={CASE} />
          </div>
          <div style={{ marginTop: 8, fontFamily: FONT.sans, fontSize: 34, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap', opacity: propIn, transform: `translateY(${(1 - propIn) * 10}px)` }}>
            {PROPOSAL}
          </div>
        </div>
      ) : null}
      {frame >= decisionAt - 6 ? (
        <div style={{ position: 'absolute', left: 0, top: 4, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 36, fontWeight: 850, color: '#6ee7b7', opacity: decided }}>
            <Icon name="check" size={36} color={C.emerald} />
            {DECISION[0]}
          </div>
          <div style={{ marginTop: 4, marginLeft: 50, fontSize: 32, fontWeight: 750, color: C.textStrong, opacity: progress(frame, line2At, 12) }}>{DECISION[1]}</div>
        </div>
      ) : null}

      {frame < ladderAt + 10 ? (
        <ProposalSketch show={progress(frame, proposalAt - 4, 16) * (1 - progress(frame, ladderAt - 12, 14, EASE.inOut))} files={progress(frame, wordFrame(S, 's04-01', 'expedientes') - 6, 14)} />
      ) : null}

      {/* «de más a menos aislamiento» */}
      <div style={{ position: 'absolute', left: 0, top: ROW_Y[0], width: 46, height: ROW_Y[2] + ROW_H[2] - ROW_Y[0], opacity: barIn }}>
        <div style={{ position: 'absolute', left: 4, top: 0, width: 12, height: '100%', borderRadius: 6, background: `linear-gradient(180deg, ${C.violet} 0%, ${alpha(C.violet, 0.15)} 100%)` }} />
        <div
          style={{
            position: 'absolute',
            left: 52,
            top: 0,
            width: ROW_Y[2] + ROW_H[2] - ROW_Y[0],
            transform: 'rotate(90deg)',
            transformOrigin: '0 0',
            fontFamily: FONT.sans,
            fontSize: 28,
            fontWeight: 800,
            color: '#c4b5fd',
            display: 'flex',
            justifyContent: 'space-between',
            whiteSpace: 'nowrap',
          }}
        >
          <span>{MORE}</span>
          <span style={{ color: C.muted }}>{ISOLATION}</span>
          <span style={{ color: C.muted }}>{LESS}</span>
        </div>
      </div>

      <Rung
        y={ROW_Y[0]}
        h={ROW_H[0]}
        slot={slot}
        show={progress(frame, airAt - 6, 12)}
        term={AIR.term}
        focus={focusOf(airAt, vmAt)}
        diagram={<AirGap cut={progress(frame, airAt, 8, EASE.out)} hand={progress(frame, entraAt, 44, EASE.inOut)} />}
        lines={[
          { spans: [{ t: AIR.line }], show: progress(frame, caminoAt, 12) },
          { spans: [{ t: AIR.price }], show: progress(frame, entraAt, 12), price: true },
        ]}
      />
      <Rung
        y={ROW_Y[1]}
        h={ROW_H[1]}
        slot={slot}
        show={progress(frame, vmAt - 6, 12)}
        term={VM.term}
        focus={focusOf(vmAt, contAt)}
        choice={decided}
        diagram={<VmStack width={340} vms={2} tileW={44} labelSize={17} glow={focusOf(vmAt, contAt) + decided} />}
        lines={[
          { spans: [{ t: VM.line }], show: progress(frame, vmAt + 6, 12) },
          { spans: [{ t: VM.price }], show: progress(frame, vmKernelAt + 10, 12), price: true },
        ]}
      />
      <Rung
        y={ROW_Y[2]}
        h={ROW_H[2]}
        slot={slot}
        show={progress(frame, contAt - 6, 12)}
        term={CONTAINER.term}
        focus={focusOf(contAt, decisionAt)}
        dim={decided}
        diagram={<HostStack width={340} tiles={3} labelSize={22} kernelHot={hot} fault={fault} spill={progress(frame, spillAt + 4, 30)} />}
        lines={[
          { spans: [{ t: CONTAINER.line[0] }, { t: CONTAINER.line[1], hot }, { t: CONTAINER.line[2] }], show: progress(frame, contAt + 4, 12) },
          { spans: [{ t: CONTAINER.price[0] }], show: progress(frame, spillAt, 12), price: true },
          {
            spans: [{ t: CONTAINER.price[1] }],
            show: progress(frame, llegarAt, 12),
            price: true,
            tail: <ExamChip text={CONTAINER.chip} size={26} on={progress(frame, llegarAt + 6, 12)} />,
          },
        ]}
      />

      {frame >= trainAt - 6 ? (
        <TrainStrip
          show={progress(frame, trainAt - 4, 14)}
          loco={progress(frame, locoAt, 12)}
          cars={progress(frame, carsAt, 12)}
          vm={progress(frame, vmTrainAt, 14)}
          cost={progress(frame, costAt, 12)}
        />
      ) : null}
    </Stage>
  );
}
