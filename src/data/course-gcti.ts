import type { SectionMeta } from '../lib/types';

/** GCTI track sections (Operación VELVET CICADA). */
export const GCTI_SECTIONS: SectionMeta[] = [
  {
    id: 's1',
    track: 'gcti',
    num: 1,
    title: 'Fundamentos de CTI y Requirements',
    short: 'Fundamentos',
    subtitle:
      'Qué es inteligencia, niveles de CTI, el ciclo de inteligencia y cómo definir Priority Intelligence Requirements.',
    domain: 'Requirements',
    icon: '🧭',
    boss: {
      codename: 'FIRST LIGHT',
      adversary: 'EMBER FOX',
      flavor:
        'Una célula de acceso inicial bombardea a Meridian Dynamics con spearphishing. Demuestra que dominas los fundamentos antes de que consigan su primer foothold.',
      dossier:
        'EMBER FOX neutralizada. Entre sus restos: plantillas de spearphishing dirigidas a Meridian Dynamics y una lista de objetivos del sector aeroespacial. Alguien está comprando acceso inicial… y firma como «VC».',
    },
  },
  {
    id: 's2',
    track: 'gcti',
    num: 2,
    title: 'Análisis de Intrusiones',
    short: 'Intrusiones',
    subtitle:
      'Kill Chain, Courses of Action, Diamond Model, activity threads y MITRE ATT&CK: el kit de análisis del analista CTI.',
    domain: 'Intrusion Analysis',
    icon: '⛓️',
    boss: {
      codename: 'BROKEN CHAIN',
      adversary: 'GLASS VIPER',
      flavor:
        'Los operadores de intrusión ya están dentro. Reconstruye sus kill chains más rápido de lo que avanzan, o Meridian pierde su programa de propulsión.',
      dossier:
        'GLASS VIPER cae. Sus playbooks revelan TTPs consistentes: LNK → PowerShell → loader propio. El mismo PDB path aparece en tres muestras distintas. VELVET CICADA ya tiene cara técnica.',
    },
  },
  {
    id: 's3',
    track: 'gcti',
    num: 3,
    title: 'Fuentes de Colección',
    short: 'Colección',
    subtitle:
      'Collection management, malware, infraestructura (pDNS, WHOIS, certificados), OSINT, TLP y estándares como STIX y YARA.',
    domain: 'Collection',
    icon: '📡',
    boss: {
      codename: 'DEEP WELL',
      adversary: 'HOLLOW LANTERN',
      flavor:
        'El equipo de infraestructura del adversario registra dominios más rápido de lo que tú los encuentras. Domina las fuentes de colección y seca su pozo.',
      dossier:
        'HOLLOW LANTERN desmantelada. Su infraestructura comparte certificados TLS y un email de registro: kazuo.tanji@. El grafo de pivotes apunta a una sola organización detrás de todas las campañas.',
    },
  },
  {
    id: 's4',
    track: 'gcti',
    num: 4,
    title: 'Análisis y Producción',
    short: 'Análisis',
    subtitle:
      'Sesgos cognitivos, falacias lógicas, Analysis of Competing Hypotheses, clustering de intrusiones y niveles de atribución.',
    domain: 'Analysis',
    icon: '🧠',
    boss: {
      codename: 'HALL OF MIRRORS',
      adversary: 'PAPER CRANE',
      flavor:
        'Una célula de engaño siembra false flags para romper tu análisis. Solo un razonamiento estructurado y libre de sesgos la atraviesa.',
      dossier:
        'PAPER CRANE expuesta. Plantaban strings en cirílico y horarios falsos para desviar la atribución. Con ACH, las hipótesis alternativas se desmoronan: el patrón apunta a espionaje industrial sistemático.',
    },
  },
  {
    id: 's5',
    track: 'gcti',
    num: 5,
    title: 'Diseminación y Atribución',
    short: 'Diseminación',
    subtitle:
      'Productos por audiencia, BLUF, lenguaje estimativo ICD 203, TLP, casos históricos de atribución y métricas del equipo.',
    domain: 'Dissemination',
    icon: '📨',
    boss: {
      codename: 'LAST WORD',
      adversary: 'VELVET CICADA',
      flavor:
        'El núcleo del grupo. Todo lo aprendido converge aquí: tu informe final decide si el consejo de Meridian actúa a tiempo. Última palabra, analista.',
      dossier:
        'VELVET CICADA al descubierto. Tu informe llega al consejo: espionaje dirigido al programa de propulsión, con requisitos cumplidos y stakeholders informados. Caso cerrado — trabajo de una verdadera CTI Director.',
    },
  },
  {
    id: 's6',
    track: 'gcti',
    num: 6,
    title: 'Preparación del examen GCTI',
    short: 'Exam Prep',
    subtitle:
      'Formato del examen, estrategia open-book, construcción de tu índice y examen de práctica cronometrado.',
    domain: null,
    icon: '📋',
    boss: null,
  },
];
