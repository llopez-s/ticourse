/** On-screen strings of s04-fase (the storyboard's, exactly) and where its two pieces sit. */
export const S04 = {
  note: 'cada fila es una fase',
  unopposed: 'la fase, desprotegida',
  /** «si una falla, otra avisa o atrapa», in the three parts the voice lights one by one. */
  fallback: [
    { text: 'si una falla,', tone: 'amber' },
    { text: 'otra avisa', tone: 'cyan' },
    { text: 'o atrapa', tone: 'emerald' },
  ],
  /** «varias celdas por fase · pasivas y activas». */
  many: { main: 'varias celdas por fase', passive: 'pasivas', join: ' y ', active: 'activas' },
} as const;

/**
 * The matrix's place (stage-local px) in s04 and at the start and from `row-c2` on in s05: the two
 * scenes cross-fade, so it must not move between them. 938 wide keeps an enlarged row at ≥ 32 px.
 */
export const MATRIX_POSE = { x: 790, y: 20, w: 938 } as const;

/** How s04 leaves the shop's door (s05 opens on it, at SHOP_POSE.card too, and lets it go dark). */
export const SHOP_AFTER_S04 = { lock: 1, lockFail: 1, door: 0.3, alarm: 1, camera: 1, live: 1, guard: 1, guardGlow: 1 } as const;
