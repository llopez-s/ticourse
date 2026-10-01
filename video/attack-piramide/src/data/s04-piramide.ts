import type { RungId } from '../scenes/parts/Pyramid';

/** Stage-local layout of s04 (1728×660). The Person and the Pyramid share top and height so their levels line up. */
export const S04_LAYOUT = {
  top: 26,
  height: 612,
  person: { left: 0, width: 400 },
  pyramid: { left: 420, width: 730 },
  /** Gap between a rung's right edge and its chip. */
  slotGap: 20,
  /** Stage-local y where the climbing dots start (inside the stage). */
  launchY: 650,
  /** While the intercept card is up the pyramid waits small and low (below the top-centre band). */
  waitScale: 0.58,
} as const;

export type IndicatorCue = 'hash-up' | 'domain-up' | 'artifact-up' | 'tool-up' | 'ttp-up';

/**
 * The tree's indicators and the rung each climbs to (canon strings, on screen
 * only). `row`/`col` place several chips on one rung (stacked rows, 2×2 grid).
 */
export interface Indicator {
  text: string;
  rung: RungId;
  cue: IndicatorCue;
  row?: -1 | 0 | 1;
  col?: 0 | 1;
  /** Extra frames after the cue (a second chip on the same beat). */
  delay?: number;
}

export const S04_INDICATORS: Indicator[] = [
  { text: '4c81...b3', rung: 'hash', cue: 'hash-up' },
  { text: 'update-svc-cdn.com', rung: 'domain', cue: 'domain-up' },
  { text: 'WindowsUpdateCheck', rung: 'artifacts', cue: 'artifact-up', row: -1 },
  { text: 'C:\\ProgramData\\winhlp.exe', rung: 'artifacts', cue: 'artifact-up', row: 1, delay: 10 },
  { text: 'wcssvc.exe (CertUtil)', rung: 'tools', cue: 'tool-up' },
  { text: 'T1059.001', rung: 'ttps', cue: 'ttp-up', row: -1, col: 0 },
  { text: 'T1140', rung: 'ttps', cue: 'ttp-up', row: -1, col: 1 },
  { text: 'T1053.005', rung: 'ttps', cue: 'ttp-up', row: 1, col: 0 },
  { text: 'T1071.001', rung: 'ttps', cue: 'ttp-up', row: 1, col: 1 },
];

/** The reply to GLASS VIPER, beside the hash chip. */
export const S04_REPLY: [string, string] = ['lo que menos', 'le duele'];
