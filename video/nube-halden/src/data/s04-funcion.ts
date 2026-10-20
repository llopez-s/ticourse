/** s04-funcion «Sin máquina» — on-screen strings (canon: out/scene-brief.md). */

/** The plain sentence before the bike, on «código» (s04-01). */
export const DEFINITION = 'función: código que corre sin que gestiones servidores';

/** The bike's labels, each on its word. */
export const BIKE = {
  fixed: 'la arregla el servicio',
  tracker: 'tu localizador',
  route: 'el recorrido, en la aplicación del servicio',
  pass: 'solo en esta ciudad',
} as const;

/** Who patches the system in each model (s04-03), one chip each on its word; never named as a series. */
export const LADDER_HEAD = 'quién parchea el sistema';
export const LADDER = [
  { text: 'IaaS · el sistema invitado, tuyo', word: 'IaaS', mine: true },
  { text: 'PaaS · SaaS · lo parchea el proveedor', word: 'PaaS', mine: false },
  { text: 'serverless · también el proveedor', word: 'serverless', mine: false },
] as const;

/** The port's proposal. */
export const PORT = { what: 'En el puerto', kind: 'propuesta · sin fecha' } as const;
export const TASK = 'tarea nocturna · aplicación nueva';
export const PROVIDER = 'lo arranca y lo escala el proveedor';
export const FUNCTION = 'función serverless';

/** The strips on the right. */
export const STRIPS = {
  yours: 'tuyo: el código, los permisos y los datos',
  blind: 'sin agente · sin captura de tráfico',
  logs: 'los registros del proveedor',
} as const;

export const DECISION = 'sus registros, a la consola de Seguridad desde el primer día';
export const LOCKIN = { text: 'atada a ese proveedor', term: 'vendor lock-in' } as const;
