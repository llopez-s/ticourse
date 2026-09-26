/**
 * S07 "El EDR ve el proceso" — fictitious data only (RFC 5737 external IP).
 * Canon: Lucía, Operaciones, sala de control del muelle 3, tarde del 3-9-2026
 * (see docs/superpowers/plans/2026-09-25-lesson-videos.md). Path is shown
 * truncated (leading ellipsis) so it fits the context panel without wrapping.
 */
export const HOST = {
  // Hostname is this scene's own invention (not fixed by the brief/canon) —
  // follows the ADM-WS-02 naming pattern the narration itself gives. Surname
  // avoided: other scenes (S02Spoof, S04Dns) only ever say "Lucía".
  name: 'OPS-WS-14',
  user: 'Lucía',
  role: 'Operaciones · muelle 3',
  time: '3-9-2026 · 16:04',
  // Filename matches S02Spoof's inbox attachment (turnos_muelle3.docm).
  path: '…\\Temp\\turnos_muelle3.docm',
  signature: 'Microsoft Windows (válida)',
} as const;

/** WINWORD.EXE -> cmd.exe -> powershell.exe -enc …, in appearance order. */
export const PROCESS_TREE = [
  { key: 'winword', label: 'WINWORD.EXE', sub: HOST.path },
  { key: 'cmd', label: 'cmd.exe', sub: '/c powershell.exe -enc …' },
  { key: 'powershell', label: 'powershell.exe', sub: '-enc JAB3AGMAPQBOAGUAdwAtA…' },
] as const;

/** The malware's plan-B fixed IP (no DNS lookup — see s04-dns). */
export const C2 = {
  ip: '203.0.113.77',
  port: 443,
} as const;
