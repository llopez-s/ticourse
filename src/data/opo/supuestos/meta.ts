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
  {
    id: 'op6s1',
    track: 'opo',
    sectionIds: ['op6'],
    version: 1,
    title: 'La sede electrónica del Consorcio',
    brief: 'Categoriza la sede electrónica del Consorcio, corrige su declaración de aplicabilidad, elige sus certificados y su sello, responde a una auditoría y explícaselo todo al comité de seguridad.',
    minutes: 60,
    integrator: undefined,
  },
  {
    id: 'op6s2',
    track: 'opo',
    sectionIds: ['op6'],
    version: 1,
    title: 'El cifrado del registro de entrada',
    brief: 'Un programa de secuestro cifra el registro electrónico de entrada del Consorcio y se lleva datos personales: valora el incidente, decide qué se notifica, a quién y cuándo, reparte las decisiones entre los roles, contén, restaura y escribe a las personas afectadas.',
    minutes: 60,
    integrator: undefined,
  },
];
