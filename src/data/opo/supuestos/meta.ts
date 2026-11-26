import type { SupuestoMeta } from '../../../lib/supuesto';

/**
 * Metadatos de los supuestos de la pista, escritos a mano para no importar los
 * datos (que se cargan bajo demanda). supuestos.test.ts comprueba que coinciden
 * con metaOf() de cada supuesto.
 */
export const OP_SUPUESTOS: SupuestoMeta[] = [
  {
    id: 'op1s1',
    track: 'opo',
    sectionIds: ['op1'],
    version: 1,
    title: 'La oficina comarcal nueva',
    brief: 'Diseña y documenta la red de una oficina comarcal nueva: direccionamiento, VLAN, enrutado y una memoria final.',
    minutes: 60,
    integrator: undefined,
  },
];
