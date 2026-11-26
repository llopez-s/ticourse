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
    brief: 'Diseña la red del edificio nuevo de una oficina comarcal: direccionamiento, VLAN, encaminamiento con respaldo, una avería real y un informe para la gerencia.',
    minutes: 60,
    integrator: undefined,
  },
];
