/**
 * E7 as the earlier videos showed it (VELVET CICADA canon, fictional data). Strings are exact; in these sources
 * Windows paths are escaped, on screen they carry one backslash (two at the start of a pipe: `\\.\pipe\`).
 *
 * - The strip of s01 = V3's EDR lines in V7's cut (video/attack-piramide/src/data/s05-otra-ropa.ts:10-15, from
 *   video/diamond-e7/src/data/s03-victim.ts:25-45): six lines, without `signed=false` and without the pipe line.
 * - V3's pipe line (s03-victim.ts:36-38), for the pipe pair of s03.
 * - V3's two NET_CONN lines (s03-victim.ts:42-45), for s04 `spare`.
 *
 * Owner: builder A. Builder B reads it (s04); nobody edits the strings.
 */

export type E7LineKind = 'head' | 'detail';
/** Which value a detail line carries (what a scene may highlight or peel off). */
export type E7Mark = 'image' | 'hash' | 'domain';

export interface E7Line {
  text: string;
  kind: E7LineKind;
  mark?: E7Mark;
}

/** s01 strip: V7's six lines, verbatim and in ISO. */
export const E7_STRIP: readonly E7Line[] = [
  { text: '2026-03-05T02:11:47Z ENG-WS-041 PROC_START', kind: 'head' },
  { text: 'image=C:\\ProgramData\\UpdSvc\\updsvc.exe', kind: 'detail', mark: 'image' },
  { text: '2026-03-05T02:11:47Z ENG-WS-041 FILE_HASH', kind: 'head' },
  { text: 'sha256=9f3a...e1', kind: 'detail', mark: 'hash' },
  { text: '2026-03-05T02:13:02Z ENG-WS-041 NET_CONN', kind: 'head' },
  { text: 'dst=update-svc-cdn.com:443  HTTPS', kind: 'detail', mark: 'domain' },
];

/** The strip's label (V7's, s05-otra-ropa.ts:21) and the victim beside it. */
export const E7_LABEL = {
  date: '05-03-2026 · 02:11 UTC',
  org: 'Meridian Dynamics · aeroespacial',
} as const;

/** The sample's hash as V3/V7 spell it (the lesson's report spells it `9f3a2c...e1`: same sample, never unify). */
export const E7_HASH = '9f3a...e1';

/** V3's pipe line (s03-victim.ts:36-38). */
export const E7_PIPE_LINE = {
  head: '2026-03-05T02:11:49Z ENG-WS-041 PIPE_CREATE',
  pipe: '\\\\.\\pipe\\vc_pipe_3a7f09c1',
} as const;

/** V3's two connection lines (s03-victim.ts:42-45), both to the usual server. */
export const E7_NET_CONN: readonly { head: string; detail: string }[] = [
  { head: '2026-03-05T02:13:02Z ENG-WS-041 NET_CONN', detail: 'dst=update-svc-cdn.com:443  HTTPS' },
  { head: '2026-03-05T02:14:01Z ENG-WS-041 NET_CONN', detail: 'dst=update-svc-cdn.com:443  HTTPS' },
];

/** How the scenes name E7 (labels only; no alert card, no MER-2026-019). */
export const E7_NAMES = {
  /** s03: caption of V3's pipe in the pipe pair. */
  pipeCaption: 'alerta de E7',
  /** s04 `two`: the usual server. */
  usual: 'el de E7',
} as const;
