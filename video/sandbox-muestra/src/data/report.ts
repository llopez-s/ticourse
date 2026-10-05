/**
 * The sandbox report of the lesson, as an EXTRACT (src/data/s3.ts:326-344; fictional data, VELVET CICADA canon).
 *
 * - Header: replaces the lesson's title (:326) and says «extracto».
 * - ESTÁTICO: lines :328-333 verbatim, WITHOUT `Signing cert` (:334) — V3 shows `signed=false` for the same hash.
 *   `NtMapViewOfSection` is the lesson as corrected in this branch (:333); never `MapViewOfSection`.
 * - DINÁMICO: :337-344 WITHOUT anything to the right of the hosts (no `→ C2`, no `NTP`, no `CRL/CTL`…) and without
 *   the pipe's parenthesis. `Persistencia` is exactly :338.
 * - The plain labels of s04 (they replace the lesson's host annotations; only shown from s04 `two`/`three` on).
 *
 * In these sources Windows paths are escaped; on screen there is one backslash (two at the start of a pipe).
 * Owner: builder A. Builder B reads it (s04, s05); nobody edits the strings.
 */

export const REPORT_HEADER = 'Informe de sandbox · extracto · GLASS VIPER stage-1 · MER-2026-023';

/** Band titles, as the lesson's `=== ESTÁTICO ===` / `=== DINÁMICO ===`. */
export const BAND_TITLE = { static: 'ESTÁTICO', dynamic: 'DINÁMICO' } as const;

export type StaticLineId = 'sha256' | 'imphash' | 'ssdeep' | 'compile' | 'pdb' | 'imports';
export type DynamicLineId = 'pipe' | 'persist';

/** One `Field : value   (note)` line. `reportLine()` rebuilds the lesson's text exactly. */
export interface ReportField<Id extends string = string> {
  id: Id;
  key: string;
  value: string;
  /** The lesson's parenthesis, when the line has one. */
  note?: string;
  /** Spaces between the value and the note in the lesson's line. */
  gap?: number;
}

/** The lesson pads every field name to 13 characters before « : ». */
export const KEY_PAD = 13;

export const STATIC_LINES: readonly ReportField<StaticLineId>[] = [
  { id: 'sha256', key: 'SHA-256', value: '9f3a2c...e1' },
  { id: 'imphash', key: 'Imphash', value: '1b8d4f2a...', note: '(comparte tabla de imports con 3 muestras previas)', gap: 6 },
  { id: 'ssdeep', key: 'ssdeep', value: '3072:Ab9..:Xk2', note: '(94% similar a variante de 2026-01)', gap: 3 },
  { id: 'compile', key: 'Compile time', value: '2026-02-19', note: '(plausible; los actores lo falsean a veces)', gap: 1 },
  { id: 'pdb', key: 'PDB path', value: 'D:\\proj\\cicada\\loader\\Release\\ldr.pdb' },
  { id: 'imports', key: 'Imports', value: 'NtMapViewOfSection, CreateNamedPipeA, CreateProcessA' },
];

export const DYNAMIC_LINES: readonly ReportField<DynamicLineId>[] = [
  { id: 'pipe', key: 'Named pipe', value: '\\\\.\\pipe\\vc_pipe_4f8a1c9e' },
  { id: 'persist', key: 'Persistencia', value: 'schtasks /create /tn WindowsUpdateCheck' },
];

export const HOSTS_HEAD = 'Hosts contactados:';

export type HostId = 'usual' | 'spare' | 'time' | 'certs' | 'connect';

/** The five contacted hosts, in the order of :340-344, with the plain labels of s04. */
export interface ContactedHost {
  id: HostId;
  host: string;
  port: number;
  /** Who makes the call (s04 `two` / `three`). Data only: never drawn before s04 `two`. */
  side: 'actor' | 'windows';
  /** s04's plain label (replaces the lesson's annotation). */
  label: string;
}

export const HOSTS: readonly ContactedHost[] = [
  { id: 'usual', host: 'update-svc-cdn.com', port: 443, side: 'actor', label: 'su servidor de siempre · el de E7' },
  { id: 'spare', host: 'ocsp-verify-node.example', port: 443, side: 'actor', label: 'de repuesto' },
  { id: 'time', host: 'time.windows.com', port: 123, side: 'windows', label: 'poner la hora' },
  { id: 'certs', host: 'ctldl.windowsupdate.com', port: 80, side: 'windows', label: 'certificados de confianza de Windows' },
  { id: 'connect', host: 'www.msftconnecttest.com', port: 80, side: 'windows', label: '¿hay internet?' },
];

/** s04 `three`: the line above the three Windows rows. */
export const WINDOWS_NOTE = 'las hace Windows solo, con muestra o sin ella';

/** `host:port`, as the report prints it. */
export function hostText(h: Pick<ContactedHost, 'host' | 'port'>): string {
  return `${h.host}:${h.port}`;
}

/** The lesson's line for a field, character for character (`SHA-256      : 9f3a2c...e1`). */
export function reportLine(f: ReportField): string {
  return `${f.key.padEnd(KEY_PAD)}: ${f.value}${f.note ? ' '.repeat(f.gap ?? 1) + f.note : ''}`;
}

/** The sample as the lesson spells its hash (V3/V7 spell it `9f3a...e1`: same sample, never unify). */
export const SAMPLE = { label: 'muestra', algo: 'SHA-256', hash: '9f3a2c...e1' } as const;

/**
 * A pipe path split for the s03 pair: the `\\.\pipe\` root, the `vc_pipe_` prefix that stays the same (cyan) and the
 * eight characters that change on every run (amber).
 */
export function pipeParts(path: string): { root: string; prefix: string; run: string } {
  const m = /^(.*\\)(vc_pipe_)([0-9a-f]{8})$/.exec(path);
  if (!m) throw new Error(`not a vc_pipe_ path: ${path}`);
  return { root: m[1], prefix: m[2], run: m[3] };
}
