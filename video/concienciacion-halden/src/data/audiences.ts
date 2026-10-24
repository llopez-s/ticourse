import type { IconName } from '../../../engine/src/ui';

/**
 * The five audiences of the port's training programme (s06), each with its risk (amber) and its training (emerald) as
 * the storyboard gives them. Voice: only Finanzas and Sistemas are read; the other three arrive on `topics`.
 */
export interface AudienceDef {
  key: 'finanzas' | 'sistemas' | 'direccion' | 'fuera' | 'llega';
  name: string;
  icon: IconName;
  risk: readonly string[];
  train: readonly string[];
}

export const AUDIENCES: readonly AudienceDef[] = [
  { key: 'finanzas', name: 'Finanzas', icon: 'file', risk: ['facturas falsas'], train: ['verificar por otro canal'] },
  { key: 'sistemas', name: 'Sistemas', icon: 'server', risk: ['credenciales'], train: ['no aprobar peticiones de acceso que no has pedido tú'] },
  { key: 'direccion', name: 'Dirección', icon: 'flag', risk: [], train: ['lo que no se publica'] },
  { key: 'fuera', name: 'Quien trabaja fuera', icon: 'laptop', risk: ['redes de casa', 'pantallas en el tren'], train: [] },
  { key: 'llega', name: 'Quien acaba de llegar', icon: 'user', risk: [], train: ['la política y a quién avisar'] },
];

/** The eight topics of the objective, English only, on screen with no voice (s06 `topics`). */
export const TOPICS = [
  'policy/handbooks',
  'situational awareness',
  'insider threat',
  'password management',
  'removable media and cables',
  'social engineering',
  'OPSEC',
  'hybrid/remote work',
] as const;
