/**
 * Opacity of the trap row of an exam question. It is dimmed along with the other wrong options only for
 * the stretch between the answer's mark (`reveal`, 0..1) and its own (`trapMark`, 0..1): marked on the
 * same frame as the answer it never dips, and marked later it dims, then comes back up.
 */
export function trapRowDim(reveal: number, trapMark: number, dimmed: number): number {
  return 1 - (1 - dimmed) * Math.max(0, reveal - trapMark);
}
