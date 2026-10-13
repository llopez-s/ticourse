/**
 * s05-eap: where things are, in stage-local px (1728 × 660).
 *
 *   y 0–226      the two pictures, one over each group — EMPTY until `answer`: the think prompt
 *                sits there, and no drawing may answer its question
 *   y 236–582    the two groups (title bar + what each one carries), «EAP» between their titles
 *   bottom-left  the decision stamp (parts/DecisionStamp.tsx, STAMP_AT), there from the first frame
 */
export const W = 1728;
export const ART_H = 230;

export const LANE = { y: 236, w: 790, h: 346, head: 58 } as const;
export const LANE_X = { peap: 0, tls: W - LANE.w } as const;

/** PEAP · TTLS picture (left): a fake access point OUTSIDE the terminal, then the terminal. */
export const PEAP_ART = {
  /** The terminal's edge: everything to its right is inside. */
  edge: 300,
  right: LANE.w,
  fake: { x: 82, y: 112, h: 80 },
  tablet: { x: 394, y: 132, h: 136 },
  ap: { x: 506, y: 58, h: 52 },
  tunnel: { x1: 452, x2: 636, y: 136, r: 19 },
  server: { x: 712, y: 140, w: 144, h: 104 },
} as const;

/** EAP-TLS picture (right): the tablet with its carné, the server with its certificate. */
export const TLS_ART = {
  tablet: { x: 1042, y: 132, h: 136 },
  carnet: { x: 1152, y: 62, h: 64 },
  server: { x: 1612, y: 134, w: 150, h: 108 },
  /** The two checks between them (x range and the two heights). */
  checks: { x1: 1226, x2: 1516, up: 84, down: 176 },
} as const;

/** The premise of the question («las tabletas ya tienen certificado»), left of the think prompt. */
export const PREMISE = {
  tablet: { x: 72, y: 150, h: 118 },
  carnet: { x: 176, y: 118, h: 62 },
} as const;
