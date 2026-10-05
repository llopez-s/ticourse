/**
 * Where the hotel stands in chapter II: s04 builds it, s05 starts from the same places (stage-local px),
 * so the cut between the two scenes keeps the police on the left and reception on the right.
 */
export const HOTEL_POS = {
  police: { x: 40, y: 178, w: 260 },
  reception: { x: 1320, y: 178, w: 380 },
} as const;
