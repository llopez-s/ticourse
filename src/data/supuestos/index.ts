import type { Supuesto } from '../../lib/supuesto';

// Un import() por id: cada supuesto es su propio trozo y no entra en el paquete
// principal. Los metadatos viven aparte (data/opo/supuestos/meta.ts).
const LOADERS: Record<string, () => Promise<{ default: Supuesto }>> = {
  op1s1: () => import('../opo/supuestos/op1s1'),
};

export const SUPUESTO_IDS: readonly string[] = Object.keys(LOADERS);

export async function loadSupuesto(id: string): Promise<Supuesto | undefined> {
  const load = Object.hasOwn(LOADERS, id) ? LOADERS[id] : undefined;
  return load ? (await load()).default : undefined;
}
