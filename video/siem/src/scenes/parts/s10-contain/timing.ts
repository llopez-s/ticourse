import type { SceneProps } from '../../../../../engine/src/timeline/types';

/**
 * Every beat of S10 in local frames, derived from the cues and segment starts
 * so a re-timed voice moves the whole choreography with it.
 */
export interface S10Timing {
  /** "Primera decisión de contención" (segment s10-01). */
  ask: number;
  /** Think-prompt window (overlay card) — keep the top of the stage quiet. */
  thinkFrom: number;
  thinkTo: number;
  /** "Aislarlo:" — the answer to the fork. */
  answer: number;
  quarantine: number;
  powerOn: number;
  pcap: number;
  soar: number;
  /** "propuso esa cuarentena". */
  proposed: number;
  /** Row "esperando aprobación" appears. */
  waiting: number;
  approve: number;
  /** "ejecutar cuarentena" ticks — always after the approval. */
  execute: number;
  /** Segment s10-04 starts: correction + validation. */
  fix: number;
  /** "rotando la credencial ... de servicio". */
  rotated: number;
  /** "La alerta se cierra" — old-credential logon graph is drawn. */
  graph: number;
  validate: number;
  /** "documentarla". */
  documented: number;
  end: number;
}

const segFrom = (props: SceneProps, id: string): number => {
  const seg = props.segments.find((s) => s.id === id);
  if (!seg) throw new Error(`S10: segment ${id} missing`);
  return seg.from;
};

export function s10Timing(props: SceneProps): S10Timing {
  const quarantine = props.cue('quarantine');
  const powerOn = props.cue('power-on');
  const pcap = props.cue('pcap');
  const soar = props.cue('soar');
  const approve = props.cue('approve');
  const validate = props.cue('validate');
  const s1 = segFrom(props, 's10-01');
  const s2 = segFrom(props, 's10-02');
  const s4 = segFrom(props, 's10-04');
  const between = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);
  return {
    ask: s1 + 6,
    // The overlay's think card sits at the end of s10-01 (before s10-02 starts).
    thinkFrom: s2 - 66,
    thinkTo: s2 - 4,
    answer: s2 + 1,
    quarantine,
    powerOn,
    pcap,
    soar,
    proposed: between(soar, approve, 0.38),
    waiting: between(soar, approve, 0.49),
    approve,
    execute: approve + 12,
    fix: s4,
    rotated: between(s4, validate, 0.47),
    graph: between(s4, validate, 0.76),
    validate,
    documented: validate + 32,
    end: props.durationInFrames,
  };
}
