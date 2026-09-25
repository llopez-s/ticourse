import { AbsoluteFill, useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { STAGE } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { PipelineSpine } from '../../../engine/src/ui';
import { buildTiming } from './parts/s03-normalize/layout';
import { RawPanel } from './parts/s03-normalize/RawPanel';
import { Flights, SchemaTable } from './parts/s03-normalize/SchemaTable';
import { UtcCallout } from './parts/s03-normalize/UtcCallout';

/**
 * S03 "Normalizar" — three sources, three dialects. The SIEM parses each raw
 * line (fields highlighted), lifts the fields into one common schema where
 * user, source IP and action share a name, and stores the time in UTC.
 */
export function S03Normalize(props: SceneProps) {
  const frame = useCurrentFrame();
  const T = buildTiming(props);
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: STAGE.left, top: STAGE.top, width: STAGE.width, height: STAGE.height }}>
        <div style={{ position: 'absolute', left: 0, top: 0 }}>
          <PipelineSpine active={1} intensity={progress(frame, T.intro + 16, 14)} />
        </div>
        <SchemaTable frame={frame} T={T} />
        <RawPanel frame={frame} T={T} />
        <Flights frame={frame} T={T} />
        <UtcCallout frame={frame} T={T} />
      </div>
    </AbsoluteFill>
  );
}
