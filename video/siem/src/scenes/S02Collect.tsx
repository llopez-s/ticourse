import { AbsoluteFill, useCurrentFrame } from 'remotion';
import type { SceneProps } from '../timeline/types';
import { STAGE } from '../theme/tokens';
import { enter, progress } from '../theme/motion';
import { PipelineSpine } from '../ui';
import { GROUPS } from '../data/s02-collect';
import { L } from './parts/s02-collect/layout';
import { buildTiming } from './parts/s02-collect/timing';
import { SourceCard } from './parts/s02-collect/SourceCard';
import { Collector } from './parts/s02-collect/Collector';
import { Store } from './parts/s02-collect/Store';
import { Links, Ports } from './parts/s02-collect/Links';
import { LocalLog, Survives } from './parts/s02-collect/WipeBeat';
import { NtpBadge } from './parts/s02-collect/ClockPill';

/**
 * S02 "Recoger" — log aggregation. Sources on the left (sistemas,
 * aplicaciones, infraestructura) light up with what each one tells; their
 * links to the collector light up as the voice names each method (agente,
 * syslog, API, NetFlow); NTP aligns the clocks and orders the central copy;
 * finally an intruder erases a local log while the central copy survives.
 */
export function S02Collect(props: SceneProps) {
  const frame = useCurrentFrame();
  const T = buildTiming(props);
  const spine = enter(frame, 0, { distance: -16, duration: 12 });
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: STAGE.left, top: STAGE.top, width: STAGE.width, height: STAGE.height }}>
        <div style={{ position: 'absolute', left: 0, top: L.spineY, ...spine }}>
          <PipelineSpine active={0} intensity={progress(frame, T.intro + 10, 16)} />
        </div>
        <Links frame={frame} T={T} />
        {GROUPS.map((group, index) => (
          <SourceCard key={group.id} frame={frame} T={T} group={group} index={index} />
        ))}
        <Collector frame={frame} T={T} />
        <Store frame={frame} T={T} />
        <Ports frame={frame} T={T} />
        <NtpBadge frame={frame} T={T} x={(L.srcW + L.colX) / 2} y={138} />
        <LocalLog frame={frame} T={T} />
        <Survives frame={frame} T={T} />
      </div>
    </AbsoluteFill>
  );
}
