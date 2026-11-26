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
