import type { Domain, SectionMeta } from '../../lib/types';
import type { Rank } from '../../lib/xp';

/**
 * Pista «Redes y ENS»: temarios de técnico/a TIC de la administración pública.
 * Los cinco dominios siguen los bloques del plan; solo se registran las
 * secciones que ya tienen contenido (hoy, op1).
 */
export const OP_DOMAINS: Domain[] = [
  'Redes de comunicaciones',
  'ENS y normativa',
  'Servicios de red y balanceo',
  'Infraestructuras de comunicaciones',
  'Identidad corporativa',
];

/**
 * Reparto del simulacro por número de lecciones previstas (5/5/4/2/2): no
 * existen pesos oficiales. sampleExam salta los dominios sin preguntas.
 */
export const OP_DOMAIN_WEIGHTS: Record<string, number> = {
  'Redes de comunicaciones': 5 / 18,
  'ENS y normativa': 5 / 18,
  'Servicios de red y balanceo': 4 / 18,
  'Infraestructuras de comunicaciones': 2 / 18,
  'Identidad corporativa': 2 / 18,
};

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
];
