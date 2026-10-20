/** s01-hook «Diez respuestas buenas» — on-screen strings (canon: out/scene-brief.md). */
import type { IconName } from '../../../engine/src/ui';

/** The ten techniques of objective 2.5, in English as on the exam, with no port stamp on them. */
export const TECHNIQUES: { name: string; icon: IconName }[] = [
  { name: 'Segmentation', icon: 'network' },
  { name: 'Access control', icon: 'users' },
  { name: 'Allow list', icon: 'funnel' },
  { name: 'Isolation', icon: 'unplug' },
  { name: 'Patching', icon: 'gear' },
  { name: 'Encryption', icon: 'key' },
  { name: 'Monitoring', icon: 'eye' },
  { name: 'Least privilege', icon: 'user' },
  { name: 'Configuration enforcement', icon: 'layers' },
  { name: 'Decommissioning', icon: 'power' },
];

/** The heading over the ten cards. */
export const HEADER = 'en el examen · las diez valen';

/** Under the cards, on «mejor»: what the exam asks for. */
export const ASKS = 'pero el examen pide la MEJOR';

/** The case stamp, no date and no «datos ficticios» (the engine's own tag already says it). */
export const STAMP = { what: 'Autoridad Portuaria de Halden', kind: 'caso de ejemplo' } as const;

/** «Mitigación y hardening», in two lines. */
export const TITLE = ['Mitigación', 'y hardening'] as const;

/** The objective plate, only in this scene. */
export const PLAQUE = 'SY0-701 · 2.5';

/** The promise, one chip per chapter, each lit on the word that names it (`seg`, `word`, `nth`). */
export const PROMISE: { text: string; seg: string; word: string; nth: number; icon: IconName }[] = [
  { text: 'qué falló', seg: 's01-02', word: 'falló', nth: 0, icon: 'search' },
  { text: 'dónde está el equipo', seg: 's01-02', word: 'dónde', nth: 0, icon: 'laptop' },
  { text: 'lo que sobra', seg: 's01-02', word: 'sobra', nth: 0, icon: 'x' },
];

/** The video's thesis, on «Porque la mejor es la que ataca la causa». */
export const CAUSE = { text: 'la mejor: la que ataca la causa', seg: 's01-02', word: 'porque' } as const;
