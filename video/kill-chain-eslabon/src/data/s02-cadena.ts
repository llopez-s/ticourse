/**
 * s02-cadena «Siete pasos, en orden» — on-screen strings (canon:
 * out/scene-brief.md «Canon strings», s02). The phase names live in
 * scenes/parts/KillChain.tsx (`PHASES`).
 */

/** Small, under the chain once the names are on screen (the voice does not read it). */
export const MODEL_CAPTION = 'Cyber Kill Chain · Lockheed Martin';

/** On the cracked Exploitation link (`break`). */
export const NOBODY_OPENS = 'nadie la abre';

/** Over the box that stays at the door, once the three after it are grey. */
export const STAYS_AT_DOOR = 'esta se queda en la puerta';

/** Beside the new box that comes out of the workshop again (s02-09): «si lo intenta otra vez, empieza de nuevo». */
export const AGAIN = ['si lo intenta', 'otra vez,', 'empieza de nuevo'] as const;

/** The two markers of `asymmetry` (generic «él», never named). */
export const HIM = { who: 'él:', text: 'necesita las siete, en orden' } as const;
export const YOU = { who: 'tú:', text: 'te basta con romper una a tu alcance' } as const;
