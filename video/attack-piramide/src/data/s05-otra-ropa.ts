/** s05 «Tres días después»: two EDR «photos» of ENG-WS-041 and the behaviour rule (canon strings). */

export type LogHighlight = 'hash' | 'image' | 'domain';

/**
 * The 05-03 photo: V3's EDR lines (video/diamond-e7/src/data/s03-victim.ts:25-45)
 * minus the named pipe and minus `signed=false`.
 */
export const S05_RIGHT_LINES: { text: string; kind: 'head' | 'detail'; mark?: LogHighlight }[] = [
  { text: '2026-03-05T02:11:47Z ENG-WS-041 PROC_START', kind: 'head' },
  { text: 'image=C:\\ProgramData\\UpdSvc\\updsvc.exe', kind: 'detail', mark: 'image' },
  { text: '2026-03-05T02:11:47Z ENG-WS-041 FILE_HASH', kind: 'head' },
  { text: 'sha256=9f3a...e1', kind: 'detail', mark: 'hash' },
  { text: '2026-03-05T02:13:02Z ENG-WS-041 NET_CONN', kind: 'head' },
  { text: 'dst=update-svc-cdn.com:443  HTTPS', kind: 'detail', mark: 'domain' },
];

/** The 02-03 photo: the process tree plus the image path of winhlp.exe. */
export const S05_LEFT_PATH = 'image=C:\\ProgramData\\winhlp.exe';

export const S05_DATES = { left: '02-03-2026 · 09:44', right: '05-03-2026 · 02:11 UTC' } as const;
export const S05_PHOTO_TITLE = 'foto del EDR';

export const S05_HASH_RULE = { label: 'regla: hash', hash: '4c81...b3', result: '0 coincidencias' } as const;

export const S05_LABELS = {
  ropa: 'la ropa',
  accent: ['nombre y carpeta del ejecutable:', 'también cambiaron, con más trabajo'] as const,
  domain: 'de momento',
} as const;

/** The lesson's behaviour rule, in two lines. */
export const S05_RULE = {
  kicker: 'regla de conducta',
  lines: ['PowerShell lanzado por explorer', 'crea una tarea programada no inventariada'] as const,
  badge: 'sin hash',
} as const;

export const S05_HIT = { time: '09:44:20', caption: 'salta en la tarea' } as const;

/** Stage-local layout (1728×660). */
export const S05_LAYOUT = {
  photoH: 516,
  left: { w: 860 },
  right: { w: 828 },
  pad: 12,
  captionH: 50,
  /** Phase A (comparison): both photos at the top, labels below. */
  a: { left: { x: 0, y: 0 }, right: { x: 900, y: 0 } },
  /** Think prompt: both photos small and low, under the top-centre band. */
  think: { scale: 0.78, y: 262, gap: 40 },
  /** Behaviour rule: the rule card on top, the 02-03 photo under it. */
  c: { ruleH: 132, left: { x: 0, y: 144 }, right: { x: 960, y: 144, scale: 0.86 } },
  bandY: 530,
} as const;
