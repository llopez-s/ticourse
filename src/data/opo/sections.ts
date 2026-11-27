import type { Domain, SectionMeta } from '../../lib/types';
import type { Rank } from '../../lib/xp';

/**
 * Pista «Redes y ENS»: temarios de técnico/a TIC de la administración pública.
 * Los seis dominios siguen los bloques del plan; solo se registran las
 * secciones que ya tienen contenido.
 */
export const OP_DOMAINS: Domain[] = [
  'Redes de comunicaciones',
  'Infraestructuras de comunicaciones',
  'Servicios de red',
  'Balanceo y alta disponibilidad',
  'Identidad corporativa',
  'ENS y normativa',
];

/**
 * Reparto del simulacro: pesos iguales, sin pesos oficiales. sampleExam salta
 * los dominios sin preguntas.
 */
export const OP_DOMAIN_WEIGHTS: Record<string, number> = Object.fromEntries(
  OP_DOMAINS.map((d) => [d, 1 / OP_DOMAINS.length]),
);

/** Mismos umbrales de nivel que xp.RANKS, con nombres de la administración. */
export const OP_RANKS: Rank[] = [
  { lvl: 1, name: 'Aspirante', icon: '📚' },
  { lvl: 3, name: 'Técnica en prácticas', icon: '🪪' },
  { lvl: 5, name: 'Técnica de redes', icon: '🔌' },
  { lvl: 8, name: 'Administradora de sistemas', icon: '🖧' },
  { lvl: 11, name: 'Responsable de comunicaciones', icon: '📡' },
  { lvl: 14, name: 'Responsable de seguridad', icon: '🛡️' },
  { lvl: 18, name: 'Jefa de servicio', icon: '🏛️' },
];

export const OP_SECTIONS: SectionMeta[] = [
  {
    id: 'op1',
    track: 'opo',
    num: 1,
    title: 'Redes de comunicaciones',
    short: 'Redes',
    subtitle:
      'Modelos OSI y TCP/IP, direccionamiento y subredes, conmutación y VLAN, encaminamiento y arquitecturas LAN, WAN y WLAN.',
    domain: 'Redes de comunicaciones',
    icon: '🔌',
    boss: {
      codename: 'PLANO EN BLANCO',
      adversary: 'LA RED HEREDADA',
      flavor:
        'Nadie documentó la red del Consorcio Provincial de Arcedo: subredes que se pisan, un troncal que deja pasar todas las VLAN y una ruta estática que apunta a un equipo retirado. Demuestra que sabes leerla antes de tocar nada.',
      dossier:
        'LA RED HEREDADA, por fin sobre el papel. Un plan de direccionamiento sin solapes, cada VLAN con su puerta de enlace y la ruta huérfana eliminada. En el último armario aparece una nota pegada a un conmutador sin etiquetar: «no apagar, nadie sabe qué cuelga de aquí».',
    },
  },
  {
    id: 'op3',
    track: 'opo',
    num: 3,
    title: 'Servicios de red',
    short: 'Servicios',
    subtitle:
      'DNS (resolución, registros, zonas, DNS interno, DNSSEC, DoT y DoH), DHCP (DORA, relay, conmutación por error, DHCPv6), NTP y la hora, y servicios de conectividad: proxies, PAC, IPAM y 802.1X.',
    domain: 'Servicios de red',
    icon: '🧭',
    boss: {
      codename: 'NOMBRE EQUIVOCADO',
      adversary: 'EL RELOJ QUE ADELANTA',
      flavor:
        'Lunes, ocho de la mañana: en el Consorcio Provincial de Arcedo nadie puede iniciar sesión, los puestos nuevos no reciben dirección y los registros de eventos cuentan una historia imposible. Algo falla en los servicios que nadie mira hasta que se caen: el DNS, el DHCP y la hora. Encuentra cuál, y por qué.',
      dossier:
        'EL RELOJ QUE ADELANTA, puesto en hora. Cada nombre resuelve donde debe, cada ámbito reparte su puerta y su DNS y todos los relojes vuelven a coincidir. En el registro del proxy queda una línea que nadie esperaba: un equipo de la red de gestión pidiendo, de madrugada, un archivo de configuración que el Consorcio ya no publica.',
    },
  },
  {
    id: 'op4',
    track: 'opo',
    num: 4,
    title: 'Balanceo y alta disponibilidad',
    short: 'Balanceo',
    subtitle:
      'Alta disponibilidad (nueves, MTBF y MTTR, serie y paralelo, quórum y split-brain), balanceo en capa 4 y en capa 7, persistencia de sesión, comprobaciones de salud, descarga de TLS y publicación de aplicaciones.',
    domain: 'Balanceo y alta disponibilidad',
    icon: '⚖️',
    boss: {
      codename: 'SESIÓN PERDIDA',
      adversary: 'EL NODO QUE MIENTE',
      flavor:
        'Último día para pedir unas ayudas y la sede electrónica del Consorcio Provincial de Arcedo hace cosas raras: hay quien rellena el formulario y vuelve a la casilla de salida, hay quien recibe un error a medias y el balanceador jura que los dos servidores están sanos. Alguien tiene que mirar dentro de la pareja de balanceadores antes de que cierre el plazo.',
      dossier:
        'EL NODO QUE MIENTE, fuera del grupo. Cada sesión vuelve a su servidor, la comprobación de salud pregunta por lo que de verdad importa y solo un balanceador responde por la dirección virtual. En el registro del ADC2 queda una línea que nadie supo explicar: durante cuatro minutos, de madrugada, los dos equipos se creyeron el activo.',
    },
  },
  {
    id: 'op6',
    track: 'opo',
    num: 6,
    title: 'ENS y normativa',
    short: 'ENS',
    subtitle:
      'Esquema Nacional de Seguridad (RD 311/2022): principios, roles, categorías, medidas del anexo II, auditoría e incidentes; protección de datos (RGPD y LOPDGDD), gobierno de la seguridad y firma e identificación electrónicas (eIDAS).',
    domain: 'ENS y normativa',
    icon: '⚖️',
    boss: {
      codename: 'PAPEL MOJADO',
      adversary: 'EL CUMPLIMIENTO DE FACHADA',
      flavor:
        'En el Consorcio Provincial de Arcedo todo parece en regla: hay una política firmada, una declaración de aplicabilidad y un informe de auditoría en una carpeta. Pero nadie sabe quién valoró los sistemas, la declaración copia medidas que no tocan y el registro de incidentes lleva meses vacío. Demuestra que conoces la norma artículo por artículo.',
      dossier:
        'EL CUMPLIMIENTO DE FACHADA, desmontado. Cada sistema tiene sus dimensiones valoradas por quien debe, su categoría determinada por la Unidad de Seguridad de la Información y su declaración de aplicabilidad firmada. Al ordenar el archivo del comité aparece un acta antigua con una sola línea subrayada: «revisar la red de las oficinas comarcales antes de la próxima auditoría».',
    },
  },
];
