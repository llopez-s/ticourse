/**
 * s06-frontera «Visto, deducido y sin ver» — on-screen strings (canon:
 * out/scene-brief.md «Canon strings», s06). The times and log lines of the
 * observed phases come from scenes/parts/LessonLog.tsx (`OBSERVED`).
 */

/** Under the four observed slots (`observed`). */
export const OBSERVED_HEAD = 'observadas: hay un registro con hora';

/** On Weaponization, with the magnifier (`dashed`). */
export const INFERRED = 'inferida';

/** Under Reconnaissance (`absent`). No VPN: that is a Lab 2A item. */
export const ABSENT = { head: 'casi nunca la ves', lines: ['a veces asoma en los registros', 'de lo que tienes de cara', 'a internet, como tu web'] } as const;

/** Over Actions on Objectives (`empty`): «sin pruebas todavía», in two lines over the slot. */
export const EMPTY = ['sin pruebas', 'todavía'] as const;
