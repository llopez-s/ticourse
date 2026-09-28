import { Html5Audio, Sequence, staticFile } from 'remotion';
import { useTimeline } from '../timeline/context';

/** The adversary's voiced messages and the sound effects of timeline.json (audio only, nothing on screen). */
export function SfxLayer() {
  const timeline = useTimeline();
  return (
    <>
      {(timeline.intercept ?? []).map((i) =>
        i.audio && i.audioFrom !== undefined && i.audioFrames !== undefined ? (
          <Sequence key={`adversario-${i.from}`} name={`adversario ${i.scene}`} from={i.audioFrom} durationInFrames={i.audioFrames + 2} layout="none">
            <Html5Audio src={staticFile(i.audio)} />
          </Sequence>
        ) : null,
      )}
      {(timeline.sfx ?? []).map((s, k) => (
        <Sequence key={`sfx-${k}`} name={`sfx ${s.sound}`} from={s.from} durationInFrames={s.durationInFrames} layout="none">
          <Html5Audio src={staticFile(s.src)} volume={s.volume} />
        </Sequence>
      ))}
    </>
  );
}
