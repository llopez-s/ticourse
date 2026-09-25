import type { SceneProps } from '../../../../../engine/src/timeline/types';

/** Every beat of S11 in local frames, derived from cues and segment starts. */
export interface S11Timing {
  /** "El SIEM solo ve las fuentes integradas" — the first tile wakes up. */
  intro: number;
  blind: number;
  silence: number;
  skew: number;
  /** NTP snaps the two events back into order (after "se desordena"). */
  snap: number;
  /** "El SIEM ve eventos y metadatos" — the payload tile takes focus. */
  meta: number;
  noPayload: number;
  archive: number;
  /** "investigaciones y cumplimiento". */
  purpose: number;
  /** "una intrusión antigua". */
  pin: number;
  /** Narration over: every tile comes back for a last look. */
  recap: number;
  end: number;
}

export function s11Timing(props: SceneProps): S11Timing {
  const first = props.segments.find((s) => s.id === 's11-01');
  if (!first) throw new Error('S11: segment s11-01 missing');
  const blind = props.cue('blind-source');
  const silence = props.cue('silence');
  const skew = props.cue('ntp-skew');
  const noPayload = props.cue('no-payload');
  const archive = props.cue('archive');
  const between = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);
  return {
    intro: first.from + 4,
    blind,
    silence,
    skew,
    snap: between(skew, noPayload, 0.57),
    meta: between(skew, noPayload, 0.69),
    noPayload,
    archive,
    purpose: archive + 54,
    pin: archive + 130,
    recap: archive + 206,
    end: props.durationInFrames,
  };
}
