/**
 * The two rules of lesson s5m3, as the video shows them (one string per line, for `RuleCode`).
 * Copied from `src/data/s5.ts` (the lesson's code blocks) with exactly the Canon's omissions:
 *   - YARA (s5.ts:499-519): `meta` keeps `author`, `description` and `tlp` — no `date`, no `reference`.
 *     `strings` and `condition` are the lesson's, character for character.
 *   - Sigma (s5.ts:531-551): no `id`, no `references`. It has no author: do not add one.
 * The label on screen is `RULE_LABEL`. Backslashes are the displayed text: the YARA PDB path shows
 * doubled backslashes (YARA string escaping), the Sigma filter a single one.
 */

export const RULE_LABEL = 'extracto de la lección · ficticia';

export const YARA_RULE: readonly string[] = [
  'rule GLASSVIPER_Loader_MemMap',
  '{',
  '    meta:',
  '        author      = "Meridian CTI"',
  '        description = "GLASS VIPER stage-1 loader: section map + named pipe"',
  '        tlp         = "AMBER"',
  '',
  '    strings:',
  '        $api  = "MapViewOfSection" ascii',
  '        $pipe = "vc_pipe_%08x" ascii wide',
  '        $op   = { 6A 40 68 00 30 00 00 }',
  '        $pdb  = "D:\\\\proj\\\\cicada\\\\loader\\\\Release\\\\ldr.pdb"',
  '',
  '    condition:',
  '        uint16(0) == 0x5A4D',
  '        and filesize < 250KB',
  '        and ( $pdb or 2 of ($api, $pipe, $op) )',
  '}',
];

export const SIGMA_RULE: readonly string[] = [
  'title: GLASS VIPER Staging via Renamed Certutil',
  'status: experimental',
  'description: Renamed certutil.exe decoding a staged payload',
  'logsource:',
  '    product: windows',
  '    category: process_creation',
  'detection:',
  '    selection:',
  "        OriginalFileName: 'CertUtil.exe'",
  '        CommandLine|contains:',
  "            - '-decode'",
  "            - '-urlcache'",
  '    filter_expected:',
  "        Image|endswith: '\\certutil.exe'",
  '    condition: selection and not filter_expected',
  'falsepositives:',
  '    - Admin tooling that copies certutil under another name (rare)',
  'level: high',
];

/** Index of the first line whose trimmed text starts with `prefix` (throws if a rule edit drops it). */
function lineOf(lines: readonly string[], prefix: string): number {
  const i = lines.findIndex((l) => l.trim().startsWith(prefix));
  if (i < 0) throw new Error(`no line starting with "${prefix}"`);
  return i;
}

/** Line indexes of the YARA rule, for `RuleCode`'s `focus`, `highlights` and `tags`. */
export const YARA_LINE = {
  name: lineOf(YARA_RULE, 'rule '),
  meta: lineOf(YARA_RULE, 'meta:'),
  author: lineOf(YARA_RULE, 'author'),
  description: lineOf(YARA_RULE, 'description'),
  tlp: lineOf(YARA_RULE, 'tlp'),
  strings: lineOf(YARA_RULE, 'strings:'),
  api: lineOf(YARA_RULE, '$api'),
  pipe: lineOf(YARA_RULE, '$pipe'),
  op: lineOf(YARA_RULE, '$op'),
  pdb: lineOf(YARA_RULE, '$pdb'),
  condition: lineOf(YARA_RULE, 'condition:'),
  condMz: lineOf(YARA_RULE, 'uint16(0)'),
  condSize: lineOf(YARA_RULE, 'and filesize'),
  condOr: lineOf(YARA_RULE, 'and ( $pdb'),
} as const;

/** Line indexes of the Sigma rule. */
export const SIGMA_LINE = {
  title: lineOf(SIGMA_RULE, 'title:'),
  status: lineOf(SIGMA_RULE, 'status:'),
  description: lineOf(SIGMA_RULE, 'description:'),
  logsource: lineOf(SIGMA_RULE, 'logsource:'),
  product: lineOf(SIGMA_RULE, 'product:'),
  category: lineOf(SIGMA_RULE, 'category:'),
  detection: lineOf(SIGMA_RULE, 'detection:'),
  selection: lineOf(SIGMA_RULE, 'selection:'),
  originalFileName: lineOf(SIGMA_RULE, 'OriginalFileName:'),
  commandLine: lineOf(SIGMA_RULE, 'CommandLine|contains:'),
  decode: lineOf(SIGMA_RULE, "- '-decode'"),
  urlcache: lineOf(SIGMA_RULE, "- '-urlcache'"),
  filter: lineOf(SIGMA_RULE, 'filter_expected:'),
  filterImage: lineOf(SIGMA_RULE, 'Image|endswith:'),
  condition: lineOf(SIGMA_RULE, 'condition:'),
  falsepositives: lineOf(SIGMA_RULE, 'falsepositives:'),
  falsepositivesItem: lineOf(SIGMA_RULE, '- Admin tooling'),
  level: lineOf(SIGMA_RULE, 'level:'),
} as const;
