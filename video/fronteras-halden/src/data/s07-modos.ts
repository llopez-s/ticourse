import { SHIPMENT_TEXT } from '../scenes/parts/Shipment';

/**
 * s07-modos «El camión dentro del contenedor» — on-screen strings (canon: out/scene-brief.md).
 * Transport mode is never drawn as forbidden between sites: it is simply «de equipo a equipo».
 * The original header is DRAWN (device → device), never written: no hostnames, no IPs. The tunnel's
 * outer header says only «pasarela de la sede · pasarela de la terminal» (two lines, like the
 * container's placard).
 * Not canon (derived from the narration): the two scheme titles, the block captions
 * («cabecera original», «carga», «paquete entero»).
 */

export const S07 = {
  transport: {
    title: 'modo transporte',
    route: SHIPMENT_TEXT.transport, // «de equipo a equipo»
    header: 'cabecera original',
    payload: 'carga',
  },
  tunnel: {
    title: 'modo túnel',
    route: SHIPMENT_TEXT.tunnel, // «de pasarela a pasarela»
    /** The outer header: canon «pasarela de la sede · pasarela de la terminal», on two lines. */
    outer: SHIPMENT_TEXT.containerLines,
    inner: 'paquete entero',
  },
  keep: 'el túnel se queda en modo túnel',
} as const;
