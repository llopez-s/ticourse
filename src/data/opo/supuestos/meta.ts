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
    id: 'op2s1',
    track: 'opo',
    sectionIds: ['op2'],
    version: 1,
    title: 'Teletrabajar sin abrir la puerta',
    brief: 'El Consorcio formaliza el teletrabajo y quiere una VPN para el personal sin abrir ningún puerto nuevo en su única dirección pública: decide dónde termina el túnel, cómo se autentica cada persona, qué tráfico va por él, sus direcciones y su DNS, comprueba que el acceso de la sede lo aguanta, ajusta el tamaño de los paquetes y deja rastro de cada sesión.',
    minutes: 60,
    integrator: undefined,
  },
  {
    id: 'op3s1',
    track: 'opo',
    sectionIds: ['op3'],
    version: 1,
    title: 'El edificio anexo de la sede',
    brief: 'Da servicio de red al edificio anexo de la sede: ámbito DHCP, zonas y registros DNS, relay con giaddr, conmutación por error entre DHCP1 y DHCP2, la hora de los servidores y una nota para la jefatura.',
    minutes: 60,
    integrator: undefined,
  },
  {
    id: 'op3s2',
    track: 'opo',
    sectionIds: ['op3'],
    version: 1,
    title: 'Un lunes sin hora ni nombres',
    brief: 'Un lunes fallan los inicios de sesión y los registros no cuadran: separa una hora desfasada de una resolución interna rota, corrige en el orden correcto, comprueba cada arreglo y redacta el parte de cierre.',
    minutes: 60,
    integrator: undefined,
  },
  {
    id: 'op4s1',
    track: 'opo',
    sectionIds: ['op4'],
    version: 1,
    title: 'El registro, sin una sola caída',
    brief: 'Tras el ataque que lo dejó 9 h 20 min parado, publica el registro electrónico de entrada en alta disponibilidad detrás de la pareja de balanceadores: calcula cuánto podrá pararse, decide cómo trabajan sus dos nodos, cómo se publica, la persistencia, el TLS y la comprobación de salud, y revisa el primer parcheo.',
    minutes: 60,
    integrator: undefined,
  },
  {
    id: 'op4s2',
    track: 'opo',
    sectionIds: ['op4'],
    version: 1,
    title: 'El último día de plazo',
    brief: 'Último día para pedir unas ayudas: en la sede electrónica se pierden formularios a medias, salen errores con el balanceador en verde y una madrugada los dos ADC se creyeron activos. Separa las tres averías, mide su alcance, corrige en un orden que no empeore nada y propón cómo evitarlas.',
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
