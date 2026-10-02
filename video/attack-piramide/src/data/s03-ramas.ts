/**
 * s03-ramas «El resto del árbol» — on-screen strings. ATT&CK tags of the
 * other branches of lesson s2m5's tree (`src/data/s2.ts:1153-1176`).
 */
import type { TreeNodeId } from '../scenes/parts/ProcessTree';

export interface BranchTag {
  node: TreeNodeId;
  /** Technique id as shown on the expanded tag. */
  id: string;
  name: string;
  /** Sub-technique line (none for T1140). */
  sub?: string;
  /** Short form once the voice moves on. */
  short: string;
  tactic: string;
}

export const BRANCH_TAGS: BranchTag[] = [
  {
    node: 'powershell',
    id: 'T1059',
    name: 'Command and Scripting Interpreter',
    sub: 'sub-technique .001 PowerShell',
    short: 'T1059.001',
    tactic: 'Execution',
  },
  {
    node: 'wcssvc',
    id: 'T1140',
    name: 'Deobfuscate/Decode Files or Information',
    short: 'T1140',
    tactic: 'Defense Evasion',
  },
  {
    node: 'c2',
    id: 'T1071',
    name: 'Application Layer Protocol',
    sub: 'sub-technique .001 Web Protocols',
    short: 'T1071.001',
    tactic: 'Command and Control',
  },
];

/** The PE header of the renamed binary. */
export const PE_CARD = {
  title: 'cabecera PE',
  onDiskLabel: 'en disco',
  onDisk: 'wcssvc.exe',
  original: 'OriginalFileName: CertUtil.exe',
  label: 'certutil, con otro nombre',
} as const;

/** «Un idioma común»: three generic readers of the same technique number. */
export const COMMON = {
  technique: 'T1053.005',
  chip: 'idioma común',
  readers: [
    { label: 'tu SOC', icon: 'shield' },
    { label: 'tu proveedor', icon: 'cloud' },
    { label: 'un informe público', icon: 'file' },
  ],
} as const;

/** The four tactics in tree order, with the voice's verb for each. */
export const TACTICS: { tactic: string; verb: string; node: TreeNodeId }[] = [
  { tactic: 'Execution', verb: 'ejecutar', node: 'powershell' },
  { tactic: 'Defense Evasion', verb: 'despistar', node: 'wcssvc' },
  { tactic: 'Persistence', verb: 'quedarse', node: 'schtasks' },
  { tactic: 'Command and Control', verb: 'llamar a casa', node: 'c2' },
];

export const WRAP = {
  title: 'tres peldaños por rama',
  rungs: [
    { content: 'Persistence', gloss: 'el porqué' },
    { content: 'T1053.005', gloss: 'el cómo' },
    { content: 'el comando exacto', gloss: 'cómo lo hace este' },
  ],
} as const;
