/**
 * Strings shared by several scenes of «Cumplir o aguantar: auditorías y pentest» (V39). The case is a PLAN
 * («propuesta · sin fecha»): no date, no hostname, no person, nothing is signed, run or passed on screen.
 */

/** The case stamp of s01. */
export const STAMP = { what: 'Autoridad Portuaria de Halden', kind: 'propuesta · sin fecha' } as const;
/** The same idea for the pentest plan (s07, s11). */
export const PLAN_STAMP = { what: 'Plan de pruebas del puerto', kind: 'propuesta · sin fecha' } as const;
/** The objective plate (violet = exam). */
export const PLAQUE = 'SY0-701 · 5.5';

/** PAPER GOVERNOR's tag (a label, never a portrait): same form as V25/V26. */
export const ADVERSARY = { name: 'PAPER GOVERNOR', section: 'sección 5', line: 'vive en los huecos de tu gobernanza' } as const;

/** Weight of each way of checking, for the four rows of s03 and the figures of the recap. */
export const TONES = {
  declare: '#38bdf8', // sky: a signature declares
  check: '#22d3ee', // cyan: an audit checks (data)
  test: '#f43f5e', // rose: a pentest plays the adversary
  ok: '#34d399', // emerald: independent, validated
  warn: '#fbbf24', // amber: warning / sanction
} as const;
