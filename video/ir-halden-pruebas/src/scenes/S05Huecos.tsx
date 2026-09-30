import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress, pulse } from '../../../engine/src/theme/motion';
import { mix, windowWeight } from '../../../engine/src/ui';
import { DARK_WORDS, FIXES, FIXES_WORD, NEVER_EMPTY, RESULT, UNKNOWN } from '../data/s05-huecos';
import { Meter } from './parts/Meter';
import { frameOf } from './parts/s04-caza/text';
import { CoverageHeader, DarkCallouts, FixRows, GRID, Histogram, NeverEmpty, ResultChip, ServerGrid } from './parts/s05-huecos/Result';
import { Stage, segment } from './kit';

const S = 's05-huecos';

/** The water meter with its bypass: beside the map, then small at the top-right while the fixes come. */
const METER = { map: { x: 1060, y: 84, w: 668 }, fixes: { x: 1328, y: 0, w: 400 } } as const;
const GRID_SMALL = 0.68;

/**
 * s05-huecos «Lo que deja la caza».
 *   result       the hunt's histogram, 30 nights by the hour from 00:00 to 06:00, all grey: a
 *                scan crosses it and «sin explicar: 0» lands on the cue; «tareas conocidas, a
 *                su hora».
 *   dark         the coverage map of the central: 24 servers, 22 with logs, and two dashed amber
 *                tiles, srv-bascula01 and srv-accesos01, «0 registros · nunca conectados»; the
 *                water meter comes back and its two bypass pipes draw in — «grifos que no pasan
 *                por el contador».
 *   unknown      the lit tiles step back: «ni bueno ni malo: no se ven».
 *   rule         the map and the meter make room; the two fixes with owner and date.
 *   never-empty  «una caza nunca vuelve de vacío»; «sin explicar: 0» and the two gaps light once more.
 */
export function S05Huecos(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const result = props.cue('result');
  const dark = props.cue('dark');
  const unknown = props.cue('unknown');
  const rule = props.cue('rule');
  const never = props.cue('never-empty');
  const s04 = segment(props, 's05-04');

  const w = {
    legend: frameOf(S, RESULT.legendAt),
    two: frameOf(S, DARK_WORDS.two),
    nunca: frameOf(S, DARK_WORDS.never),
    taps: frameOf(S, DARK_WORDS.taps),
    meter: frameOf(S, DARK_WORDS.meter),
    bueno: frameOf(S, UNKNOWN.at),
    arreglos: frameOf(S, FIXES_WORD),
    fixes: FIXES.map((f) => frameOf(S, f.at)),
    donde: frameOf(S, NEVER_EMPTY.gapsAt),
    nadie: frameOf(S, { seg: 's05-05', word: 'nadie' }),
  };

  // --- s05-01: the histogram, then it gives way to the map.
  const histOut = progress(frame, dark - 10, 12, EASE.inOut);

  // --- s05-02 / s05-03: map, callouts, the meter's bypass.
  const mapIn = progress(frame, dark - 4, 14);
  const compactAt = Math.max(s04.from - 6, Math.min(w.arreglos - 12, rule - 30));
  const compact = progress(frame, compactAt, 22, EASE.inOut);
  const gaps = windowWeight(frame, w.donde - 4, Number.POSITIVE_INFINITY, { ramp: 12 }) * (0.75 + 0.25 * pulse(frame, fps, 0.5));
  const darkGlow = Math.max(windowWeight(frame, w.two - 4, compactAt + 10, { ramp: 12 }) * 0.9, gaps);
  const litDim = windowWeight(frame, unknown - 4, compactAt + 6, { ramp: 12 }) * 0.8;
  const callouts = 1 - progress(frame, compactAt - 4, 12, EASE.inOut);

  const meterIn = progress(frame, dark + 6, 18);
  const bypass = progress(frame, w.taps - 6, Math.max(24, w.meter + 10 - (w.taps - 6)), EASE.inOut);
  const bypassGlow = Math.max(windowWeight(frame, w.taps - 6, unknown + 60, { ramp: 12 }) * 0.9, gaps);
  const meterDim = 0.45 * (1 - progress(frame, w.taps - 10, 12)) * (1 - compact);
  const meterScale = mix(1, METER.fixes.w / METER.map.w, compact);
  const meterLeft = mix(METER.map.x, METER.fixes.x, compact);
  const meterTop = mix(METER.map.y, METER.fixes.y, compact);
  const unknownLabel = progress(frame, w.bueno - 6, 14) * (1 - progress(frame, compactAt - 4, 12, EASE.inOut));

  // --- s05-04 / s05-05: the fixes and the closing line.
  const fixAt = [Math.max(w.fixes[0] - 2, compactAt + 16), 0];
  fixAt[1] = Math.max(w.fixes[1] - 4, fixAt[0] + 20);
  const fixesDim = 0.35 * progress(frame, never - 4, 14);

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      <Histogram frame={frame} fps={fps} resultAt={result} legendAt={w.legend} opacity={1 - histOut} />

      {mapIn > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: mapIn }}>
          <CoverageHeader frame={frame} at={dark - 4} darkAt={dark} />
          <div style={{ position: 'absolute', left: GRID.left, top: GRID.top, transform: `scale(${mix(1, GRID_SMALL, compact)})`, transformOrigin: '0 0' }}>
            <ServerGrid frame={frame} fps={fps} at={dark + 2} darkAt={dark} darkGlow={darkGlow} litDim={litDim} />
          </div>
          <DarkCallouts frame={frame} at={w.two - 4} tagAt={w.nunca - 2} opacity={callouts} />

          {meterIn > 0.001 ? (
            <div style={{ position: 'absolute', left: meterLeft, top: meterTop, transform: `scale(${meterScale})`, transformOrigin: '0 0', opacity: meterIn }}>
              <Meter width={METER.map.w} bypass={bypass} bypassGlow={bypassGlow} glow={0.35} dim={meterDim} frame={frame} />
            </div>
          ) : null}
          {unknownLabel > 0.001 ? (
            <div
              style={{
                position: 'absolute',
                left: METER.map.x,
                top: 590,
                width: METER.map.w,
                textAlign: 'center',
                fontSize: 42,
                fontWeight: 800,
                letterSpacing: -0.5,
                color: '#fcd34d',
                textShadow: `0 0 22px ${alpha(C.amber, 0.35)}`,
                whiteSpace: 'nowrap',
                opacity: unknownLabel,
                transform: `translateY(${(1 - unknownLabel) * 10}px)`,
              }}
            >
              {UNKNOWN.text}
            </div>
          ) : null}
        </div>
      ) : null}

      <ResultChip frame={frame} fps={fps} at={compactAt + 12} pulseAt={w.nadie} left={760} top={150} />
      <FixRows frame={frame} fps={fps} at={fixAt} headAt={compactAt + 10} dim={fixesDim} />
      <NeverEmpty frame={frame} fps={fps} at={never - 2} text={NEVER_EMPTY.text} />
    </Stage>
  );
}
