/** s04-escalera «Tres niveles y su precio» — on-screen strings (canon: out/scene-brief.md). */

export const CASE = 'propuesta · sin fecha';
export const PROPOSAL = 'los expedientes de la plantilla, en el mismo servidor (host) que el tablón';

/** The ladder's ends (left arrow). */
export const MORE = 'más';
export const LESS = 'menos';
export const ISOLATION = 'aislamiento';

export const AIR = {
  term: 'AIR GAP',
  line: 'ningún camino de red',
  price: 'precio: todo entra y sale a mano',
} as const;

export const VM = {
  term: 'VIRTUAL MACHINE',
  line: 'su sistema y su kernel, con el hypervisor en medio',
  price: 'precio: cada una carga su sistema entero',
} as const;

/** The container rung; «kernel» in the first line lights on `shared-kernel`. */
export const CONTAINER = {
  term: 'CONTAINER',
  line: ['comparte el ', 'kernel', ' del host · ligero y rápido'],
  price: ['precio: un fallo del kernel o un contenedor', 'con privilegios llega a los vecinos'],
  chip: 'container escape',
} as const;

/** The decision, in two lines (replaces the proposal on `decision`). */
export const DECISION = ['los expedientes se quedan en su VM:', 'no comparten kernel con el tablón, al que entra toda la plantilla'] as const;

/** The train's labels (`train-map`) and the second, short train. */
export const TRAIN = {
  loco: 'kernel',
  cars: 'contenedores',
  vm: 'VM: lleva la suya',
  cost: 'cuesta más',
} as const;
