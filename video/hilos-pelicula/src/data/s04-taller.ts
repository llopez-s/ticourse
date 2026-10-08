/**
 * s04-taller «La etiqueta del taller» — on-screen strings outside the table (canon:
 * out/scene-brief.md «Canon strings», s04, and «The workshop label in s04»). The table's own
 * strings live in scenes/parts/CompareTable.tsx (COMPARE_TEXT), shared with s05 and s06.
 */

/** Caption by the two labels inside the boxes (`label`, the voice's words). */
export const LABEL_CAPTION = 'la etiqueta del taller';

/**
 * The rule, two lines, the same in V14 and V15 (decided after the freeze; it replaces the
 * storyboard's one-line «si otra trae la misma: …»). Enters with «Pero si otro programa trae la misma».
 */
export const RULE_LINES = ['si otro programa trae la misma', 'mismo taller · enlace fuerte'] as const;

/** The two doors (one box at each), in the table's column colours. */
export const DOOR_NAMES = { meridian: 'Meridian', orbital: 'Orbital' } as const;
