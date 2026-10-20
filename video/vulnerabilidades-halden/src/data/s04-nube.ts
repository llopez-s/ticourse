/** s04-nube «Lo de abajo, lo de encima y lo de nadie» — on-screen strings (canon: out/scene-brief.md). */

/** Each item lights on the word of its segment (`seg`, `word`). */
export interface Lit {
  text: string;
  seg: string;
  word: string;
}

export const LANDLORD = {
  who: 'casero',
  items: [
    { text: 'estructura', seg: 's04-01', word: 'estructura' },
    { text: 'instalación', seg: 's04-01', word: 'estructura' },
    { text: 'paredes', seg: 's04-01', word: 'paredes' },
  ] as Lit[],
};

/** The tenant's three icons: who comes in, how the flat is shut, what is kept inside. */
export const TENANT = {
  who: 'inquilino',
  items: [
    { text: 'quién entra', seg: 's04-02', word: 'quién', icon: 'user' },
    { text: 'cómo cierra', seg: 's04-02', word: 'cierra', icon: 'window' },
    { text: 'lo que guarda', seg: 's04-02', word: 'guarda', icon: 'archive' },
  ] as (Lit & { icon: 'user' | 'window' | 'archive' })[],
};

export const CLOUD_TITLE = 'la nube';
export const CUSTOMER = {
  label: 'cliente',
  items: [
    { text: 'configuración', seg: 's04-04', word: 'configuración' },
    { text: 'datos', seg: 's04-04', word: 'datos' },
    { text: 'identidades', seg: 's04-04', word: 'identidades' },
  ] as Lit[],
  always: 'siempre',
  reflexes: [
    { text: 'bucket público', seg: 's04-05', word: 'bucket' },
    { text: 'clave filtrada', seg: 's04-05', word: 'clave' },
    { text: 'rol con permisos de más', seg: 's04-05', word: 'rol' },
  ] as Lit[],
};
export const MIDDLE = 'según el servicio';
export const PROVIDER = {
  label: 'proveedor',
  items: [
    { text: 'hardware', seg: 's04-03', word: 'hardware' },
    { text: 'red del centro de datos', seg: 's04-03', word: 'red' },
    { text: 'hipervisor', seg: 's04-03', word: 'hipervisor' },
  ] as Lit[],
};
export const MODEL = 'shared responsibility model';
export const GAP = 'lo que cada uno cree que hace el otro · no lo hace nadie';

/** The street door's two bubbles and its caption. */
export const BUBBLES = {
  landlord: { who: 'el casero', text: 'la cierra cada vecino al entrar: lo dice el contrato' },
  neighbour: { who: 'un vecino', text: 'eso es cosa del casero' },
  open: 'abierta toda la noche',
} as const;

/** The key list (s04-08): an example, not the port's register. No names, no number, no dates. */
export const KEYS = {
  tag: 'ejemplo · lado del cliente · no es el registro del puerto',
  term: 'IAM sprawl',
  /** One row per key: 'gone' = its owner is no longer there, 'admin' = «administrador», 'ok' = plain. */
  rows: ['gone', 'admin', 'ok', 'gone', 'gone', 'admin', 'gone', 'ok', 'admin', 'gone'] as ('gone' | 'admin' | 'ok')[],
  gone: 'ya no está',
  admin: 'administrador',
} as const;

/** The rule of the gap, in three lines and a drawn arrow (never an arrow character). */
export const RULE = { lead: 'en la duda:', what: ['configuración, datos', 'o identidades'], who: 'del cliente' } as const;
