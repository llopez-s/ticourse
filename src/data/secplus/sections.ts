import type { Domain, SectionMeta } from '../../lib/types';
import type { Rank } from '../../lib/xp';

export const SP_DOMAINS: Domain[] = [
  'General Security Concepts',
  'Threats, Vulnerabilities & Mitigations',
  'Security Architecture',
  'Security Operations',
  'Security Program Management & Oversight',
];

/** Official SY0-701 exam weights */
export const SP_DOMAIN_WEIGHTS: Record<string, number> = {
  'General Security Concepts': 0.12,
  'Threats, Vulnerabilities & Mitigations': 0.22,
  'Security Architecture': 0.18,
  'Security Operations': 0.28,
  'Security Program Management & Oversight': 0.2,
};

/** Same level thresholds as xp.RANKS, Security+ flavored names */
export const SP_RANKS: Rank[] = [
  { lvl: 1, name: 'Trainee', icon: '🎓' },
  { lvl: 3, name: 'Help Desk', icon: '🎧' },
  { lvl: 5, name: 'SOC Analyst I', icon: '🛡️' },
  { lvl: 8, name: 'SOC Analyst II', icon: '🔎' },
  { lvl: 11, name: 'Security Engineer', icon: '⚙️' },
  { lvl: 14, name: 'Security Architect', icon: '🏛️' },
  { lvl: 18, name: 'CISO', icon: '👑' },
];

export const SP_SECTIONS: SectionMeta[] = [
  {
    id: 'sp1',
    track: 'secplus',
    num: 1,
    title: 'Conceptos generales de seguridad',
    short: 'Conceptos',
    subtitle:
      'Controles de seguridad, CIA y AAA, Zero Trust, seguridad física, change management y criptografía: la base de todo el examen (12%).',
    domain: 'General Security Concepts',
    icon: '🧱',
    boss: {
      codename: 'FIRST KEY',
      adversary: 'NULL CIPHER',
      flavor:
        'Una célula de acceso inicial prueba cada puerta de la Autoridad Portuaria de Halden: badges clonados, cambios sin aprobar, certificados caducados. Demuestra que dominas los fundamentos antes de que encuentren la que no cierra.',
      dossier:
        'NULL CIPHER neutralizada. En su equipo: un lector de badges clonado y un certificado autofirmado que alguien instaló como raíz «temporalmente» hace tres años. La nota adjunta dice: «el puerto sigue sin inventario». Firmado: GH.',
    },
  },
  {
    id: 'sp2',
    track: 'secplus',
    num: 2,
    title: 'Amenazas, vulnerabilidades y mitigaciones',
    short: 'Amenazas',
    subtitle:
      'Actores y motivaciones, vectores, ingeniería social, malware, vulnerabilidades por tipo, indicadores y mitigaciones (22%).',
    domain: 'Threats, Vulnerabilities & Mitigations',
    icon: '🦠',
    boss: {
      codename: 'OPEN WOUND',
      adversary: 'RED MARROW',
      flavor:
        'Phishing, USB en el aparcamiento y un proveedor comprometido: RED MARROW ataca por todos los vectores a la vez. Reconoce cada técnica y su mitigación.',
      dossier:
        'RED MARROW cae. Sus kits de phishing apuntaban a los operadores de grúas del puerto y su malware llegaba por un proveedor de mantenimiento. GH compra acceso a través de terceros.',
    },
  },
  {
    id: 'sp3',
    track: 'secplus',
    num: 3,
    title: 'Arquitectura de seguridad',
    short: 'Arquitectura',
    subtitle:
      'Modelos de arquitectura, cloud, IoT/OT, segmentación, protección de datos y resiliencia (18%).',
    domain: 'Security Architecture',
    icon: '🏗️',
    boss: {
      codename: 'LOAD BEARING',
      adversary: 'BLIND ARCHITECT',
      flavor:
        'Una red plana, sistemas OT en la misma VLAN que las oficinas y backups sin probar. BLIND ARCHITECT solo necesita que un pilar falle.',
      dossier:
        'BLIND ARCHITECT derrotada. Su plan dependía de que los PLC de las esclusas fueran alcanzables desde la wifi de invitados. Segmentación y backups probados le cerraron el paso. GH busca un punto único de fallo.',
    },
  },
  {
    id: 'sp4',
    track: 'secplus',
    num: 4,
    title: 'Operaciones de seguridad',
    short: 'Operaciones',
    subtitle:
      'Hardening, gestión de activos y vulnerabilidades, monitorización, IAM, automatización, respuesta a incidentes y forense (28%).',
    domain: 'Security Operations',
    icon: '🖥️',
    boss: {
      codename: 'NIGHT WATCH',
      adversary: 'SILENT PAGER',
      flavor:
        'Las alertas llegan a las 3 a. m. y nadie las lee. SILENT PAGER cuenta con que tu SOC duerma. Detecta, responde y documenta más rápido que ella.',
      dossier:
        'SILENT PAGER expuesta. Movimiento lateral con cuentas de servicio sin rotar y logs que nadie centralizaba. La cadena de custodia de tus evidencias señala una IP del mismo ASN que NULL CIPHER. GH es una sola operación.',
    },
  },
  {
    id: 'sp5',
    track: 'secplus',
    num: 5,
    title: 'Gestión y supervisión del programa de seguridad',
    short: 'Gobernanza',
    subtitle:
      'Gobernanza, gestión de riesgos, terceros, cumplimiento, auditorías y concienciación (20%).',
    domain: 'Security Program Management & Oversight',
    icon: '📜',
    boss: {
      codename: 'FINAL AUDIT',
      adversary: 'PAPER GOVERNOR',
      flavor:
        'Políticas sin dueño, riesgos sin registro y un proveedor sin contrato. PAPER GOVERNOR vive en los huecos de tu gobernanza. Última auditoría, analista.',
      dossier:
        'PAPER GOVERNOR desenmascarada: GLASS HARBOR era un contratista con acceso perpetuo y sin due diligence. Registro de riesgos, contratos con SLA de seguridad y auditorías cierran el caso. El puerto vuelve a operar.',
    },
  },
  {
    id: 'sp6',
    track: 'secplus',
    num: 6,
    title: 'Preparación del examen Security+',
    short: 'Exam Prep',
    subtitle:
      'Formato del examen SY0-701, PBQs, gestión del tiempo y examen de práctica cronometrado.',
    domain: null,
    icon: '📋',
    boss: null,
  },
];
