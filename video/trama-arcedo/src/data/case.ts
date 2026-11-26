/**
 * Shared canon of «De la trama al segmento» (trama-arcedo, op1m1). Every scene reads names, addresses and colours
 * from here: never retype them. Source: storyboard.json goals, src/data/opo/op1-m1.ts and
 * docs/superpowers/canon/arcedo.md.
 */
import { C } from '../../../engine/src/theme/tokens';

/** The case stamp (s01), no date; «datos ficticios» is the engine's own corner tag. */
export const CASE = { who: 'Consorcio Provincial de Arcedo', kind: 'caso de ejemplo' } as const;

/** The track plate, as the engine's exam cards name it. */
export const PLAQUE = 'REDES Y ENS · Redes';

/** The two ends of the request. Addresses only on screen: the voice never reads them. */
export const HOST = {
  label: 'puesto',
  vlan: 'VLAN 10 Usuarios',
  ip: '10.20.10.25',
  cidr: '10.20.10.25/24',
  subnet: '10.20.10.0/24',
  mac: '00:00:5e:00:53:19',
  port: 51514,
} as const;

export const SERVER = {
  label: 'aplicación de expedientes',
  where: 'CPD',
  ip: '10.20.72.10',
  subnet: '10.20.72.0/21',
  port: 443,
} as const;

export const GATEWAY = { ip: '10.20.10.1', mac: '00:00:5e:00:53:01' } as const;

export const BROADCAST_MAC = 'ff:ff:ff:ff:ff:ff';

/**
 * One colour per wrapper, the same in the stack, the analogy and the closing recap
 * (datos · segmento · paquete · trama  ↔  carta · sobre · caja · furgoneta).
 */
export const LAYER = {
  data: { name: 'datos', tone: C.text, analog: 'carta' },
  segment: { name: 'segmento', proto: 'TCP', layer: 4, tone: C.emerald, analog: 'sobre' },
  packet: { name: 'paquete', proto: 'IP', layer: 3, tone: C.amber, analog: 'caja' },
  frame: { name: 'trama', proto: 'Ethernet II', layer: 2, tone: C.cyan, analog: 'furgoneta' },
} as const;

/** The analogy tag. */
export const IMAGE_TAG = 'imagen · no es el Consorcio';
