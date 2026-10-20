/** The twelve cases of the practice package and the rules that match them (from reference.yar + fixtures.py, checked against a real verify.py run). */
export type RuleKey = 'Sample' | 'Family' | 'Hunt';
export type Split = 'training' | 'held-out' | 'challenge';

export interface PackCase {
  file: string;
  short: string;
  split: Split;
  hits: RuleKey[];
}

export const CASES: PackCase[] = [
  { file: 'a.dat', short: 'A', split: 'training', hits: ['Sample', 'Family', 'Hunt'] },
  { file: 'b-wide.dat', short: 'B', split: 'training', hits: ['Family', 'Hunt'] },
  { file: 'c-heldout.dat', short: 'C', split: 'held-out', hits: ['Family', 'Hunt'] },
  { file: 'benign-route.dat', short: 'ruta sola', split: 'training', hits: ['Hunt'] },
  { file: 'benign-marker.dat', short: 'marcador solo', split: 'training', hits: ['Hunt'] },
  { file: 'benign-hex.dat', short: 'hex solo', split: 'held-out', hits: ['Hunt'] },
  { file: 'benign-manual.dat', short: 'manual', split: 'training', hits: [] },
  { file: 'benign-common.dat', short: 'comunes', split: 'training', hits: [] },
  { file: 'empty.dat', short: 'vacío', split: 'held-out', hits: [] },
  { file: 'large.dat', short: 'grande', split: 'held-out', hits: [] },
  { file: 'future-uncovered.dat', short: 'v2', split: 'challenge', hits: [] },
  { file: 'boundary-4096.dat', short: '4096', split: 'held-out', hits: [] },
];
