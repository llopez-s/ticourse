/**
 * s04-enterprise: where things are, in stage-local px (1728 × 660).
 *
 *   left column    whoever lets the tablets in: first the sign with the shared key, then the
 *                  stairwell keypad, then the RADIUS server and its log
 *   right column   the crane tablets, always in the same place
 *   top band       free while SILENT PAGER's card is up; later the names
 *   bottom-left    the decision stamp (parts/DecisionStamp.tsx, STAMP_AT)
 */
export const W = 1728;
export const H = 660;

/** The right column starts here. */
export const COL_X = 990;

/** The crane tablets. The last one is the tablet of the example (the one that «se pierde»). */
export const TABLET = { y: 470, h: 130, xs: [1050, 1196, 1342, 1488, 1640] } as const;
export const LOST = TABLET.xs.length - 1;

/** The shared key reaches every tablet along ONE amber rail. */
export const RAIL_Y = 378;

/** Each tablet's carné, shown above it, and the line to the server above the carnés. */
export const CARNET = { y: 346, h: 60 } as const;
export const TRUNK_Y = 284;

/** The sign: big while it is the subject, then pinned small over the keypad. */
export const SIGN = { w: 700, h: 284 } as const;
export const SIGN_BIG = { x: 44, y: 262, scale: 1 } as const;
export const SIGN_SMALL = { x: 44, y: 4, scale: 0.6 } as const;

/** The landing with the keypad (its own 620 × 420 drawing), and its thumbnail. */
export const KEYPAD = { w: 620, h: 420 } as const;
export const KEYPAD_BIG = { x: 44, y: 204, scale: 1.08 } as const;
export const KEYPAD_SMALL = { x: 0, y: 4, scale: 0.42 } as const;
/** Where the rail leaves the keypad / the sign (stage-local x). */
export const RAIL_FROM = { sign: SIGN_BIG.x + SIGN.w, keypad: KEYPAD_BIG.x + 470 * KEYPAD_BIG.scale } as const;

/** The RADIUS server's card (header + four log lines). */
export const RADIUS_CARD = { x: 4, y: 236, w: 964 } as const;
