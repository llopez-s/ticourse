/** Every recording made by scripts/suricata-parity.py, oldest Suricata major version first. */
export interface ParityCase { name: string; mode: string; rules: string; alerts: string[]; errorLines: number[] }
export interface ParityRecording { suricata: string; cases: ParityCase[] }

const files = import.meta.glob<ParityRecording>('./suricata-parity-*.json', { eager: true, import: 'default' });

export const PARITY_RECORDINGS: ParityRecording[] = Object.keys(files)
  .sort((a, b) => Number(a.match(/(\d+)\.json$/)![1]) - Number(b.match(/(\d+)\.json$/)![1]))
  .map((key) => files[key]);

/** "7.0.3 y 8.0.8" */
export const PARITY_VERSIONS = PARITY_RECORDINGS
  .map((r) => r.suricata.replace(/^.*version\s+/i, '').replace(/\s+RELEASE$/, ''))
  .join(' y ');
