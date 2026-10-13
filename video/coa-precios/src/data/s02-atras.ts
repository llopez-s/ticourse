import type { CellId } from './matrix';

/** On-screen strings of s02-atras (the storyboard's, exactly). */
export const S02 = {
  discover: { name: 'DISCOVER', sub: ['mirar hacia atrás', 'lo que ya pasó'] },
  detect: { name: 'DETECT', sub: ['avisar cuando', 'vuelva a ocurrir'] },
  /** The middle of the time line. */
  today: 'hoy',
  /** The one example, on screen only: the matrix cell «alerta: schtasks /create fuera del inventario aprobado». */
  example: 'installation-detect' as CellId,
} as const;
