import {
  SP_CLASSIFY_DATA,
  SP_LABS,
  SP_ORDER_DATA,
  SP_SELECT_DATA,
} from './secplus/labs';

// ---------------------------------------------------------------------------
// Lab registry + all lab data (Operation VELVET CICADA scenario)
// ---------------------------------------------------------------------------

export interface LabMeta {
  id: string;
  sectionId: string;
  title: string;
  icon: string;
  minutes: number;
  xp: number;
  kind:
    | 'classify'
    | 'select'
    | 'order'
    | 'pivot'
    | 'yara'
    | 'ach'
    | 'calibration'
    | 'report';
  brief: string;
  mission?: { n: number; briefing: string };
}

export const GCTI_LABS: LabMeta[] = [
  {
    id: 'lab1a',
    sectionId: 's1',
    title: 'Lifecycle Assembly',
    icon: '🔄',
    minutes: 8,
    xp: 75,
    kind: 'order',
    brief:
      'Reconstruye el intelligence lifecycle en orden. Toca las fases en secuencia; al validar verás qué hace cada una.',
  },
  {
    id: 'lab1b',
    sectionId: 's1',
    title: 'PIR Workshop',
    icon: '🎯',
    minutes: 12,
    xp: 100,
    kind: 'select',
    brief:
      'De ocho requirements candidatos, selecciona los 4 que merecen ser PIRs de Meridian. Cada elección viene con feedback.',
    mission: {
      n: 1,
      briefing:
        'Meridian Dynamics (aeroespacial, 8.000 empleados) te ficha como su primera analista CTI. El sector lleva meses con rumores de robo de diseños y el board está nervioso. El CISO te recibe con una frase: «Dime qué preguntas deberíamos estar respondiendo». Elige bien: tus PIRs dirigirán toda la colección del caso.',
    },
  },
  {
    id: 'lab2a',
    sectionId: 's2',
    title: 'Kill Chain Mapping',
    icon: '⛓️',
    minutes: 14,
    xp: 100,
    kind: 'classify',
    brief:
      'Clasifica 12 eventos observados de la intrusión en su fase de la Kill Chain. Necesitas ≥80% para completar.',
    mission: {
      n: 2,
      briefing:
        'Primera alerta real: el SOC de Meridian escala una intrusión en curso. Tienes los eventos en bruto del EDR, el proxy y el email gateway. Reconstruye la kill chain del adversario — saber en qué fase está determina qué puede hacer aún el equipo de respuesta.',
    },
  },
  {
    id: 'lab2b',
    sectionId: 's2',
    title: 'Diamond Decomposition',
    icon: '💎',
    minutes: 10,
    xp: 75,
    kind: 'classify',
    brief:
      'Asigna cada pieza de evidencia de la intrusión a su vértice del Diamond Model: Adversary, Capability, Infrastructure o Victim.',
  },
  {
    id: 'lab2c',
    sectionId: 's2',
    title: 'Courses of Action',
    icon: '🛡️',
    minutes: 10,
    xp: 75,
    kind: 'classify',
    brief:
      'El IR lead propone 8 medidas defensivas. Clasifica cada una en su Course of Action correcto (Discover…Destroy).',
  },
  {
    id: 'lab3a',
    sectionId: 's3',
    title: 'Pivot Hunt',
    icon: '🕸️',
    minutes: 15,
    xp: 150,
    kind: 'pivot',
    brief:
      'Expande el grafo de infraestructura desde el dominio de phishing. Cada pivote cuesta 1 query (presupuesto: 12). Encuentra los 4 activos del actor sin ahogarte en pivotes ruidosos.',
    mission: {
      n: 3,
      briefing:
        'Con la kill chain reconstruida, toca mapear la infraestructura del actor antes de que la rote. Tu plataforma de threat intel cobra por consulta — como en la vida real. Gasta tus queries con cabeza: los recursos compartidos (shared hosting, CDNs) son agujeros negros de tiempo.',
    },
  },
  {
    id: 'lab3b',
    sectionId: 's3',
    title: 'YARA Forge',
    icon: '📜',
    minutes: 12,
    xp: 125,
    kind: 'yara',
    brief:
      'Construye una regla YARA seleccionando strings y condición. Debe detectar las 2 variantes del loader sin un solo falso positivo en software legítimo.',
  },
  {
    id: 'lab3c',
    sectionId: 's3',
    title: 'CMF Builder',
    icon: '🗂️',
    minutes: 8,
    xp: 75,
    kind: 'classify',
    brief:
      'Asigna cada pregunta de colección a la fuente que mejor la responde. Así se construye un Collection Management Framework.',
  },
  {
    id: 'lab4a',
    sectionId: 's4',
    title: 'Bias Hunt',
    icon: '🪞',
    minutes: 10,
    xp: 100,
    kind: 'classify',
    brief:
      'Ocho frases reales de la sala de análisis. Identifica el sesgo o falacia que arruina cada una.',
    mission: {
      n: 4,
      briefing:
        'La presión sube y el equipo empieza a atajar. En la reunión de análisis se oyen frases peligrosas — y PAPER CRANE, la célula de engaño del adversario, cuenta exactamente con eso. Detecta el sesgo en cada afirmación antes de que contamine el informe final.',
    },
  },
  {
    id: 'lab4b',
    sectionId: 's4',
    title: 'ACH Matrix',
    icon: '⚖️',
    minutes: 18,
    xp: 150,
    kind: 'ach',
    brief:
      'Tres hipótesis sobre VELVET CICADA, ocho piezas de evidencia. Puntúa cada celda (C/N/I), compara con la solución experta y elige la hipótesis menos inconsistente.',
  },
  {
    id: 'lab5a',
    sectionId: 's5',
    title: 'Calibration Range',
    icon: '🔮',
    minutes: 12,
    xp: 100,
    kind: 'calibration',
    brief:
      'Parte 1: asigna cada expresión ICD 203 a su banda de probabilidad. Parte 2: estima probabilidades con un slider y compárate con la solución de escuela.',
  },
  {
    id: 'lab5b',
    sectionId: 's5',
    title: 'Report Forge',
    icon: '📨',
    minutes: 15,
    xp: 150,
    kind: 'report',
    brief:
      'Ensambla el informe final del caso: elige el BLUF, ordena las secciones, asigna confianza a cada hallazgo y marca el TLP de cada producto.',
    mission: {
      n: 5,
      briefing:
        'Final de la operación. El consejo de Meridian se reúne el lunes y tu informe decide si actúan. Todo lo que has aprendido — BLUF, lenguaje estimativo, confianza, TLP — converge en este documento. Escríbelo como una CTI Director.',
    },
  },
];

export const LABS: LabMeta[] = [...GCTI_LABS, ...SP_LABS];

// ---------------------------------------------------------------------------
// Generic: classify labs
// ---------------------------------------------------------------------------

export interface ClassifyData {
  categories: { id: string; label: string }[];
  items: { text: string; answer: string; why: string }[];
  passPct: number;
}

const GCTI_CLASSIFY: Record<string, ClassifyData> = {
  lab2a: {
    passPct: 80,
    categories: [
      { id: 'recon', label: 'Reconnaissance' },
      { id: 'weap', label: 'Weaponization' },
      { id: 'del', label: 'Delivery' },
      { id: 'exp', label: 'Exploitation' },
      { id: 'inst', label: 'Installation' },
      { id: 'c2', label: 'Command & Control' },
      { id: 'aoo', label: 'Actions on Objectives' },
    ],
    items: [
      {
        text: 'Actor profiles Meridian propulsion engineers on a professional network',
        answer: 'recon',
        why: 'Investigar personas y tecnología del objetivo es Reconnaissance.',
      },
      {
        text: "Actor scans Meridian's external VPN gateway collecting version banners",
        answer: 'recon',
        why: 'El escaneo de superficie externa también es Recon (y a veces es visible en tus logs).',
      },
      {
        text: 'CV_Ingeniero.zip containing a malicious LNK is built with a builder kit',
        answer: 'weap',
        why: 'Preparar el artefacto (payload + dropper) es Weaponization — ocurre en espacio del adversario.',
      },
      {
        text: 'Actor tests the phishing page and the LNK against common antivirus engines',
        answer: 'weap',
        why: 'El QA del artefacto antes de enviarlo sigue siendo preparación: Weaponization.',
      },
      {
        text: 'Spearphishing email with the ZIP reaches four HR inboxes',
        answer: 'del',
        why: 'La transmisión del artefacto a la víctima es Delivery.',
      },
      {
        text: 'An HR analyst opens the LNK; PowerShell executes a download cradle',
        answer: 'exp',
        why: 'La ejecución inicial de código (aprovechando al humano) es Exploitation.',
      },
      {
        text: "Loader registers a scheduled task named 'WindowsUpdateCheck' to survive reboots",
        answer: 'inst',
        why: 'Establecer persistencia es Installation.',
      },
      {
        text: 'Implant starts HTTPS beaconing to update-svc-cdn.com every 90 seconds',
        answer: 'c2',
        why: 'El canal de mando con la infraestructura del actor es C2.',
      },
      {
        text: 'Operator opens a secondary channel through a cloud storage API as backup',
        answer: 'c2',
        why: 'Canales de mando redundantes siguen siendo C2.',
      },
      {
        text: 'Actor enumerates file shares searching for CAD directories',
        answer: 'aoo',
        why: 'Con el control establecido, la búsqueda del objetivo es Actions on Objectives.',
      },
      {
        text: 'CAD files are compressed into staged RAR archives under C:\\ProgramData\\tmp',
        answer: 'aoo',
        why: 'El staging de datos para exfiltración es parte de Actions on Objectives.',
      },
      {
        text: '650 MB of archives leave the network over HTTPS to a file-sharing service',
        answer: 'aoo',
        why: 'La exfiltración es la culminación de Actions on Objectives.',
      },
    ],
  },
  lab2b: {
    passPct: 80,
    categories: [
      { id: 'adv', label: 'Adversary' },
      { id: 'cap', label: 'Capability' },
      { id: 'inf', label: 'Infrastructure' },
      { id: 'vic', label: 'Victim' },
    ],
    items: [
      {
        text: 'Registration email kazuo.tanji@protonmail.com in historical WHOIS',
        answer: 'adv',
        why: 'Identificadores del operador/registrante apuntan al vértice Adversary.',
      },
      {
        text: 'Custom loader with PDB path C:\\Users\\kaz\\dev\\ldr\\ldr.pdb',
        answer: 'cap',
        why: 'El malware y sus artefactos de desarrollo son Capability.',
      },
      {
        text: 'update-svc-cdn.com and its dedicated VPS at 141.98.6.10',
        answer: 'inf',
        why: 'Dominios y servidores que conectan capability con víctima: Infrastructure.',
      },
      {
        text: "Meridian's propulsion R&D file server",
        answer: 'vic',
        why: 'Los activos del objetivo pertenecen al vértice Victim.',
      },
      {
        text: 'LNK→PowerShell download-cradle technique',
        answer: 'cap',
        why: 'Las técnicas, igual que las herramientas, son Capability.',
      },
      {
        text: 'Self-signed TLS certificate reused across three C2 servers',
        answer: 'inf',
        why: 'Material criptográfico desplegado en servidores del actor: Infrastructure (y un pivote excelente).',
      },
      {
        text: 'The HR analysts who received the spearphish',
        answer: 'vic',
        why: 'Las personas objetivo también son parte del vértice Victim.',
      },
      {
        text: 'Operator keyboard activity clustering in UTC+8 working hours',
        answer: 'adv',
        why: 'Patrones de comportamiento del operador alimentan Adversary (con baja diagnosticidad aislada, como viste en S4).',
      },
      {
        text: 'Compromised supplier VPN account used as the entry path',
        answer: 'inf',
        why: 'Los recursos a través de los que el actor opera — incluidas cuentas comprometidas — funcionan como Infrastructure.',
      },
      {
        text: "Webshell deployed on the supplier's portal server",
        answer: 'cap',
        why: 'El webshell es una herramienta del actor: Capability (desplegada sobre infraestructura comprometida).',
      },
    ],
  },
  lab2c: {
    passPct: 80,
    categories: [
      { id: 'discover', label: 'Discover' },
      { id: 'detect', label: 'Detect' },
      { id: 'deny', label: 'Deny' },
      { id: 'disrupt', label: 'Disrupt' },
      { id: 'degrade', label: 'Degrade' },
      { id: 'deceive', label: 'Deceive' },
      { id: 'destroy', label: 'Destroy' },
    ],
    items: [
      {
        text: "Search 90 days of EDR telemetry for the loader's hash",
        answer: 'discover',
        why: 'Búsqueda histórica/retrospectiva = Discover.',
      },
      {
        text: 'Hunt historical DNS logs for past resolutions of the lookalike domain',
        answer: 'discover',
        why: 'Mirar hacia atrás en los logs es Discover, no Detect.',
      },
      {
        text: 'Create a Sigma rule alerting whenever an LNK spawns PowerShell',
        answer: 'detect',
        why: 'Alerta en tiempo real para actividad futura = Detect.',
      },
      {
        text: 'Block update-svc-cdn.com at the proxy for all hosts',
        answer: 'deny',
        why: 'Impedir que la comunicación funcione = Deny.',
      },
      {
        text: 'Isolate the beaconing workstation while the session is active',
        answer: 'disrupt',
        why: 'Interrumpir una acción en curso = Disrupt.',
      },
      {
        text: 'Rate-limit outbound traffic to the file-sharing service used for exfil',
        answer: 'degrade',
        why: 'Reducir velocidad/eficacia sin cortar del todo = Degrade.',
      },
      {
        text: 'Plant decoy CAD files with canary tokens in the staging folder',
        answer: 'deceive',
        why: 'Alimentar al adversario con activos falsos = Deceive.',
      },
      {
        text: "Lawful seizure of the actor's C2 server by authorities",
        answer: 'destroy',
        why: 'Eliminar capacidad/infraestructura adversaria = Destroy (dominio estatal/legal).',
      },
    ],
  },
  lab3c: {
    passPct: 80,
    categories: [
      { id: 'pdns', label: 'Passive DNS' },
      { id: 'whois', label: 'WHOIS histórico' },
      { id: 'sandbox', label: 'Sandbox' },
      { id: 'edr', label: 'EDR interno' },
      { id: 'ct', label: 'Certificate Transparency' },
      { id: 'isac', label: 'ISAC / peers' },
    ],
    items: [
      {
        text: 'What other domains resolved to 141.98.6.10 last month?',
        answer: 'pdns',
        why: 'Historial dominio↔IP = passive DNS.',
      },
      {
        text: 'Who registered meridian-sso-portal.com before privacy was enabled?',
        answer: 'whois',
        why: 'Datos de registro históricos = WHOIS.',
      },
      {
        text: 'Which C2 does this sample contact when executed?',
        answer: 'sandbox',
        why: 'Comportamiento dinámico de la muestra = sandbox.',
      },
      {
        text: 'What persistence mechanism does the sample create on execution?',
        answer: 'sandbox',
        why: 'También comportamiento observado en detonación.',
      },
      {
        text: 'Did this loader execute on any of our 8,000 endpoints?',
        answer: 'edr',
        why: 'Solo la telemetría interna ve TUS hosts.',
      },
      {
        text: 'What certificates were just issued for new Meridian-lookalike domains?',
        answer: 'ct',
        why: 'Los CT logs publican cada emisión de certificado casi en tiempo real.',
      },
      {
        text: 'Which subdomains has the actor stood up this week?',
        answer: 'ct',
        why: 'La emisión de certs delata subdominios nuevos.',
      },
      {
        text: "Have sector peers observed this actor's TTPs in their networks?",
        answer: 'isac',
        why: 'La experiencia de otros del sector llega por las comunidades de compartición.',
      },
    ],
  },
  lab4a: {
    passPct: 80,
    categories: [
      { id: 'conf', label: 'Confirmation bias' },
      { id: 'anchor', label: 'Anchoring' },
      { id: 'avail', label: 'Availability' },
      { id: 'mirror', label: 'Mirror imaging' },
      { id: 'base', label: 'Base-rate neglect' },
      { id: 'auth', label: 'Appeal to authority' },
      { id: 'posthoc', label: 'Post hoc' },
      { id: 'hasty', label: 'Hasty generalization' },
    ],
    items: [
      {
        text: '«El primer informe del vendor decía Rusia, así que esta nueva infraestructura también la leo como rusa.»',
        answer: 'anchor',
        why: 'La primera etiqueta encuadra todo lo posterior: anchoring.',
      },
      {
        text: '«Ya dijimos que era GLASS VIPER — y mira, este log también encaja con GLASS VIPER si lo miras bien.»',
        answer: 'conf',
        why: 'Forzar la evidencia nueva para confirmar la hipótesis previa: confirmation bias.',
      },
      {
        text: '«El ransomware está en todas las noticias este mes; esta anomalía será ransomware.»',
        answer: 'avail',
        why: 'Lo reciente y memorable infla la probabilidad percibida: availability.',
      },
      {
        text: '«Ningún actor profesional quemaría un implante propio en una empresa tan pequeña; esto será crimeware genérico.»',
        answer: 'mirror',
        why: 'Proyectar tu lógica de costes sobre el adversario: mirror imaging.',
      },
      {
        text: '«Las horas de compilación caen en jornada UTC+8: los operadores están en China, seguro.»',
        answer: 'base',
        why: 'Ignora cuántos actores (y millones de personas) comparten ese huso: base-rate neglect.',
      },
      {
        text: '«Lo ha atribuido BigVendorCo; no hace falta revisar su evidencia.»',
        answer: 'auth',
        why: 'La identidad de la fuente sustituye a la evaluación: appeal to authority.',
      },
      {
        text: '«Publicamos el informe y al día siguiente paró el beaconing: nuestro informe los expulsó.»',
        answer: 'posthoc',
        why: 'Secuencia ≠ causa: post hoc ergo propter hoc.',
      },
      {
        text: '«Esta muestra usa DGA, así que toda la familia usa DGA.»',
        answer: 'hasty',
        why: 'Generalizar la familia desde un solo ejemplar: hasty generalization.',
      },
    ],
  },
};

export const CLASSIFY_DATA: Record<string, ClassifyData> = {
  ...GCTI_CLASSIFY,
  ...SP_CLASSIFY_DATA,
};

// ---------------------------------------------------------------------------
// Generic: select labs
// ---------------------------------------------------------------------------

export interface SelectData {
  pickN: number;
  prompt: string;
  options: { text: string; good: boolean; why: string }[];
}

const GCTI_SELECT: Record<string, SelectData> = {
  lab1b: {
    pickN: 4,
    prompt:
      'El CISO de Meridian espera tus 4 PIRs. Recuerda los criterios: pregunta única, específica, ligada a una decisión, factible.',
    options: [
      {
        text: 'Which intrusion sets with a history of stealing aerospace/propulsion IP are active against European manufacturers, and which initial-access TTPs do they use?',
        good: true,
        why: '✅ Específico (sector, geografía, tipo de actor), una sola pregunta, alimenta directamente las prioridades de detección.',
      },
      {
        text: 'Have any of our three engineering suppliers with VPN access been compromised in the last 12 months, and how would we detect that access being abused?',
        good: true,
        why: '✅ Ligado a una decisión concreta (gestión de acceso de proveedores) y factible con colección dirigida. Cloud Hopper enseñó por qué importa.',
      },
      {
        text: 'Which actors use lookalike SSO/credential portals against our sector, and what would that phishing look like in our email and proxy logs?',
        good: true,
        why: '✅ Conecta amenaza externa con detección interna observable: accionable para el SOC.',
      },
      {
        text: 'Which Meridian programs and data would a state-directed espionage actor most plausibly target, and where do those assets live?',
        good: true,
        why: '✅ Define las crown jewels y enfoca toda la colección y la defensa. Pregunta única y respondible.',
      },
      {
        text: 'What is China doing in cyberspace?',
        good: false,
        why: '❌ Amplísimo, sin decisión asociada, imposible de "responder". Es un tema, no un requirement.',
      },
      {
        text: 'Collect all ransomware indicators published this year.',
        good: false,
        why: '❌ No es una pregunta: es tasking de colección sin requirement detrás — y el ransomware no es la amenaza prioritaria del caso.',
      },
      {
        text: 'Are APTs dangerous for companies like ours, and also what about insider threats and hacktivism?',
        good: false,
        why: '❌ Triple pregunta vaga en una. Los requirements se formulan de uno en uno y con especificidad.',
      },
      {
        text: 'Which firewall vendor should we purchase next quarter?',
        good: false,
        why: '❌ Decisión de procurement, no pregunta de inteligencia sobre amenazas. CTI puede informar el riesgo, no elegir al vendor.',
      },
    ],
  },
};

export const SELECT_DATA: Record<string, SelectData> = {
  ...GCTI_SELECT,
  ...SP_SELECT_DATA,
};

// ---------------------------------------------------------------------------
// Generic: order labs
// ---------------------------------------------------------------------------

export interface OrderData {
  prompt: string;
  steps: { text: string; detail: string }[];
}

const GCTI_ORDER: Record<string, OrderData> = {
  lab1a: {
    prompt:
      'Toca las fases en el orden correcto del intelligence lifecycle (de la primera a la última).',
    steps: [
      {
        text: 'Planning & Direction',
        detail: 'Definir requirements con los decisores y planificar la colección.',
      },
      {
        text: 'Collection',
        detail: 'Obtener datos crudos de las fuentes planificadas (internas y externas).',
      },
      {
        text: 'Processing & Exploitation',
        detail: 'Parsear, decodificar, normalizar, detonar: convertir lo crudo en analizable.',
      },
      {
        text: 'Analysis & Production',
        detail: 'Aplicar técnicas estructuradas y producir juicios calibrados.',
      },
      {
        text: 'Dissemination',
        detail: 'Entregar el producto correcto a la audiencia correcta, a tiempo.',
      },
      {
        text: 'Feedback',
        detail: '¿Respondió la necesidad? Refinar requirements y reiniciar el ciclo.',
      },
    ],
  },
};

export const ORDER_DATA: Record<string, OrderData> = {
  ...GCTI_ORDER,
  ...SP_ORDER_DATA,
};

// ---------------------------------------------------------------------------
// Pivot Hunt
// ---------------------------------------------------------------------------

export interface PivotNode {
  id: string;
  label: string;
  type: 'domain' | 'ip' | 'email' | 'cert' | 'ns' | 'host';
  verdict: 'start' | 'lead' | 'asset' | 'benign' | 'noise';
  note: string;
  children: string[];
}

export const PIVOT: {
  startId: string;
  budget: number;
  assetsNeeded: number;
  parBudget: number;
  nodes: Record<string, PivotNode>;
} = {
  startId: 'start',
  budget: 12,
  assetsNeeded: 4,
  parBudget: 9,
  nodes: {
    start: {
      id: 'start',
      label: 'meridian-sso-portal.com',
      type: 'domain',
      verdict: 'start',
      note: 'El dominio del phishing inicial contra Meridian. Punto de partida del grafo.',
      children: ['whois1', 'ip1', 'cert1', 'ns1'],
    },
    whois1: {
      id: 'whois1',
      label: 'WHOIS histórico → kazuo.tanji@protonmail.com',
      type: 'email',
      verdict: 'lead',
      note: 'Slip de OPSEC: el email de registro aparece en el WHOIS previo a activar la privacidad. Los emails de registro son pivotes dedicados — oro puro.',
      children: ['d2', 'd3'],
    },
    ip1: {
      id: 'ip1',
      label: '141.98.6.10 — VPS dedicado',
      type: 'ip',
      verdict: 'lead',
      note: 'Hosting dedicado con muy pocos inquilinos: pivote de alto valor. Passive DNS muestra otros dominios aquí.',
      children: ['d4', 'd7'],
    },
    cert1: {
      id: 'cert1',
      label: 'Cert TLS autofirmado SHA1 9f:3a:c1…',
      type: 'cert',
      verdict: 'lead',
      note: 'Certificado autofirmado: material del actor. Buscar este fingerprint en escaneos de Internet revela dónde más se usa.',
      children: ['d5'],
    },
    ns1: {
      id: 'ns1',
      label: 'ns1.cheap-registrar-dns.com',
      type: 'ns',
      verdict: 'noise',
      note: '🕳️ Nameserver genérico del registrar, compartido por millones de dominios. Pivote ruidoso: query gastada en nada.',
      children: [],
    },
    d2: {
      id: 'd2',
      label: 'velvet-house-trading.com',
      type: 'domain',
      verdict: 'asset',
      note: '🎯 ACTIVO DEL ACTOR. Web de una «empresa comercial» fachada, registrada con el mismo email. La persona corporativa del grupo… y origen del nombre VELVET CICADA.',
      children: [],
    },
    d3: {
      id: 'd3',
      label: 'stellardyn-vpn.net',
      type: 'domain',
      verdict: 'asset',
      note: '🎯 ACTIVO DEL ACTOR. Lookalike del portal VPN de Stellar Dynamics — ¡otra empresa aeroespacial! El actor opera contra todo el sector: esto merece compartirse vía ISAC (TLP mediante).',
      children: [],
    },
    d4: {
      id: 'd4',
      label: 'meridian-hr-portal.com',
      type: 'domain',
      verdict: 'asset',
      note: '🎯 ACTIVO DEL ACTOR. Segundo dominio de phishing contra Meridian (temática RR. HH.), aún sin usar: bloquearlo AHORA es defensa proactiva — Deny antes del delivery.',
      children: ['whois2'],
    },
    d5: {
      id: 'd5',
      label: 'update-svc-cdn.com',
      type: 'domain',
      verdict: 'asset',
      note: '🎯 ACTIVO DEL ACTOR. El C2 del implante (el mismo cert autofirmado lo delata). Coincide con el beaconing observado en el EDR de Meridian.',
      children: ['ip2'],
    },
    d7: {
      id: 'd7',
      label: 'cdn-cache-7.statichost.net',
      type: 'domain',
      verdict: 'benign',
      note: 'Infraestructura legítima de un proveedor CDN que compartió IP brevemente (histórico). Sin relación con el actor.',
      children: [],
    },
    whois2: {
      id: 'whois2',
      label: 'WHOIS de meridian-hr-portal.com',
      type: 'email',
      verdict: 'noise',
      note: '🕳️ WHOIS con privacidad activada desde el registro. Callejón sin salida — este dominio se pivota por IP o certificado.',
      children: [],
    },
    ip2: {
      id: 'ip2',
      label: '185.220.x.x — shared hosting',
      type: 'ip',
      verdict: 'noise',
      note: '🕳️ Shared hosting con ~14.000 dominios. Pivote ruidoso: miles de falsos vecinos. Pregunta siempre cuántos inquilinos tiene el recurso.',
      children: [],
    },
  },
};

// ---------------------------------------------------------------------------
// YARA Forge
// ---------------------------------------------------------------------------

export interface YaraString {
  id: string;
  text: string;
  kind: 'ascii' | 'hex';
  rarity: 'rare' | 'common';
  note: string;
}

export interface YaraSample {
  id: string;
  name: string;
  malicious: boolean;
  contains: string[];
  desc: string;
}

export const YARA: {
  strings: YaraString[];
  samples: YaraSample[];
} = {
  strings: [
    {
      id: 's1',
      text: 'C:\\Users\\kaz\\dev\\ldr\\bin\\ldr.pdb',
      kind: 'ascii',
      rarity: 'rare',
      note: 'PDB path del entorno del autor — raro y muy específico (solo variante 1).',
    },
    {
      id: 's2',
      text: 'vc_stage2.bin',
      kind: 'ascii',
      rarity: 'rare',
      note: 'Nombre del payload de segunda etapa — presente en ambas variantes.',
    },
    {
      id: 's3',
      text: '{ 8B 45 FC 33 45 F8 8B 4D F4 }',
      kind: 'hex',
      rarity: 'rare',
      note: 'Bytes de la rutina XOR de descifrado de la config (solo variante 2).',
    },
    {
      id: 's4',
      text: 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1)',
      kind: 'ascii',
      rarity: 'common',
      note: 'User-agent antiguo… que también usan miles de aplicaciones legítimas. Trampa de falso positivo.',
    },
    {
      id: 's5',
      text: 'kernel32.dll',
      kind: 'ascii',
      rarity: 'common',
      note: 'Presente en prácticamente cualquier ejecutable de Windows. Cero poder discriminante.',
    },
    {
      id: 's6',
      text: 'POST /api/v2/telemetry',
      kind: 'ascii',
      rarity: 'common',
      note: 'Ruta de telemetría genérica — el software legítimo también "llama a casa".',
    },
  ],
  samples: [
    {
      id: 'mA',
      name: 'VC_Loader_v1.dll',
      malicious: true,
      contains: ['s1', 's2', 's4', 's5', 's6'],
      desc: 'Variante 1 del loader (la del incidente de Meridian).',
    },
    {
      id: 'mB',
      name: 'VC_Loader_v2.dll',
      malicious: true,
      contains: ['s2', 's3', 's5'],
      desc: 'Variante 2 recompilada: sin PDB y con user-agent nuevo.',
    },
    {
      id: 'bA',
      name: 'VendorUpdater.exe',
      malicious: false,
      contains: ['s4', 's5', 's6'],
      desc: 'Actualizador legítimo de un proveedor de Meridian.',
    },
    {
      id: 'bB',
      name: 'ChatHelper.exe',
      malicious: false,
      contains: ['s5', 's6'],
      desc: 'Utilidad corporativa de chat, firmada y benigna.',
    },
  ],
};

// ---------------------------------------------------------------------------
// ACH Matrix
// ---------------------------------------------------------------------------

export type AchRating = 'C' | 'N' | 'I';

export interface AchData {
  hypotheses: { id: string; label: string; desc: string }[];
  evidence: {
    id: string;
    text: string;
    expert: Record<string, AchRating>;
    note: string;
  }[];
  answer: string;
}

export const ACH: AchData = {
  hypotheses: [
    {
      id: 'h1',
      label: 'H1 · Espionaje dirigido',
      desc: 'Intrusion set con tasking de espionaje industrial (posible dirección estatal) tras la IP de propulsión.',
    },
    {
      id: 'h2',
      label: 'H2 · Ransomware/extorsión',
      desc: 'Afiliado con motivación financiera preparando cifrado o extorsión por filtración.',
    },
    {
      id: 'h3',
      label: 'H3 · Hacktivismo/insider',
      desc: 'Operación de filtración pública por motivación ideológica o empleado descontento.',
    },
  ],
  evidence: [
    {
      id: 'e1',
      text: 'Seis meses de acceso silencioso; datos staged y exfiltrados despacio, en bloques pequeños',
      expert: { h1: 'C', h2: 'I', h3: 'I' },
      note: 'La economía del ransomware monetiza rápido; los leaks publican. La paciencia encaja con colección de espionaje.',
    },
    {
      id: 'e2',
      text: 'Targeting exclusivo de shares de R&D de propulsión; finanzas y RR. HH. ignorados',
      expert: { h1: 'C', h2: 'I', h3: 'N' },
      note: 'Un extorsionador toma lo más valioso para presionar (todo); el foco quirúrgico apunta a requirements de colección.',
    },
    {
      id: 'e3',
      text: 'Sin cifrado, sin nota de rescate, sin contacto extorsivo tras 6 meses',
      expert: { h1: 'C', h2: 'I', h3: 'N' },
      note: 'Inconsistencia letal para H2: la ausencia de monetización tras tanto acceso es altamente diagnóstica.',
    },
    {
      id: 'e4',
      text: 'Loader propio con técnicas de sigilo por encima de los kits comerciales',
      expert: { h1: 'C', h2: 'N', h3: 'I' },
      note: 'Tooling propio es coherente con espionaje; algunos afiliados también compran calidad (N); raro en hacktivismo.',
    },
    {
      id: 'e5',
      text: 'Actividad del operador concentrada en horario laboral UTC+8',
      expert: { h1: 'N', h2: 'N', h3: 'N' },
      note: '⭐ Baja diagnosticidad: consistente con todo (y trivial de falsificar). No mueve ninguna hipótesis.',
    },
    {
      id: 'e6',
      text: 'Phishing con temática de facturas de proveedor y CVs de ingeniería',
      expert: { h1: 'C', h2: 'C', h3: 'N' },
      note: 'Consistente con espionaje Y crimen — poco diagnóstica. Cuidado con apoyar conclusiones en evidencia universal.',
    },
    {
      id: 'e7',
      text: 'Cero menciones públicas, leaks o posts sobre Meridian en 6 meses',
      expert: { h1: 'C', h2: 'N', h3: 'I' },
      note: 'El hacktivismo vive de la publicidad: el silencio prolongado es inconsistente con H3.',
    },
    {
      id: 'e8',
      text: 'La infraestructura comparte certificado TLS con una campaña de espionaje reportada por el ISAC del sector',
      expert: { h1: 'C', h2: 'I', h3: 'I' },
      note: 'Solapamiento de material criptográfico con campaña de espionaje conocida: enlace fuerte hacia H1.',
    },
  ],
  answer: 'h1',
};

// ---------------------------------------------------------------------------
// Calibration Range
// ---------------------------------------------------------------------------

export const CALIB: {
  bands: string[];
  phrases: { phrase: string; band: string }[];
  scenarios: { text: string; lo: number; hi: number; note: string }[];
} = {
  bands: ['01–05%', '05–20%', '20–45%', '45–55%', '55–80%', '80–95%', '95–99%'],
  phrases: [
    { phrase: 'almost no chance / remote', band: '01–05%' },
    { phrase: 'very unlikely / highly improbable', band: '05–20%' },
    { phrase: 'unlikely / improbable', band: '20–45%' },
    { phrase: 'roughly even chance', band: '45–55%' },
    { phrase: 'likely / probable', band: '55–80%' },
    { phrase: 'very likely / highly probable', band: '80–95%' },
    { phrase: 'almost certain / nearly certain', band: '95–99%' },
  ],
  scenarios: [
    {
      text: 'Un dominio registrado hace 3 días que imita tu portal SSO y sirve un formulario de login es malicioso.',
      lo: 85,
      hi: 99,
      note: 'Registro fresquísimo + imitación + formulario de credenciales: casi certeza. Aun así, nunca 100% — podría ser un pentest autorizado que nadie te contó.',
    },
    {
      text: 'Una IP que alojó un C2 hace 4 años sigue siendo maliciosa hoy.',
      lo: 5,
      hi: 25,
      note: 'La infraestructura se recicla constantemente: sin contexto temporal, el indicador viejo apunta a inquilinos inocentes.',
    },
    {
      text: 'En una campaña de phishing de credenciales a 100 empleados, al menos uno hará clic.',
      lo: 55,
      hi: 90,
      note: 'Las tasas de clic reales en campañas dirigidas hacen esto likely/very likely. Por eso la defensa no puede depender de "que nadie pique".',
    },
    {
      text: 'El horario UTC+8 de la actividad, por sí solo, identifica a un actor estatal chino.',
      lo: 1,
      hi: 15,
      note: 'Evidencia débil, falsificable y con base-rate enorme. Aislada, casi no mueve la aguja.',
    },
    {
      text: 'Un actor que ha comprimido datos en archivos staged pretende exfiltrarlos.',
      lo: 70,
      hi: 95,
      note: 'El staging es preparación de exfil con pocas explicaciones alternativas — likely/very likely, no certeza (podría abortar).',
    },
    {
      text: 'Dos muestras que comparten el mismo PDB path raro salen del mismo entorno de desarrollo.',
      lo: 80,
      hi: 97,
      note: 'Artefacto raro del build: enlace fuerte. Resta un margen por la posibilidad (cara) de un false flag deliberado.',
    },
  ],
};

// ---------------------------------------------------------------------------
// Report Forge
// ---------------------------------------------------------------------------

export const REPORT: {
  blufOptions: { text: string; good: boolean; why: string }[];
  sections: { text: string; detail: string }[];
  findings: {
    finding: string;
    options: { label: string; good: boolean; why: string }[];
  }[];
  tlp: {
    product: string;
    options: { label: string; good: boolean; why: string }[];
  }[];
  epilogue: string;
} = {
  blufOptions: [
    {
      text: '«On 14 March our EDR observed PowerShell execution on WKS-0211, which led to the discovery of a scheduled task, after which the proxy logs were reviewed in detail…»',
      good: false,
      why: '❌ Cronología técnica primero = lede enterrado. El consejo no sabrá qué decidir hasta el párrafo seis.',
    },
    {
      text: '«We assess with high confidence that VELVET CICADA, an espionage-motivated intrusion set, exfiltrated propulsion design data from Meridian between March and May. Supplier-portal access was the likely initial vector (moderate confidence). Further targeting of our suppliers is likely within 90 days.»',
      good: true,
      why: '✅ BLUF de manual: juicio principal con confianza, vector con su propia confianza, y proyección accionable con lenguaje estimativo.',
    },
    {
      text: '«It is believed that some data could possibly have been accessed by unknown actors at some point, and various risks might exist going forward.»',
      good: false,
      why: '❌ Weasel words sin probabilidad ni dueño del juicio («it is believed»). Técnicamente cierto, analíticamente vacío.',
    },
  ],
  sections: [
    { text: 'BLUF / Key judgments', detail: 'Los juicios principales con confianza, primero.' },
    { text: 'Key findings', detail: 'Los hallazgos que sostienen los juicios.' },
    { text: 'Evidence & analysis', detail: 'La evidencia y el razonamiento (incl. hipótesis descartadas vía ACH).' },
    { text: 'Outlook & implications', detail: 'Qué esperamos que ocurra y qué significa para Meridian.' },
    { text: 'Recommendations', detail: 'Acciones concretas por equipo (SOC, IR, proveedores, dirección).' },
    { text: 'Technical annex (IOCs & rules)', detail: 'Indicadores con contexto, YARA/Sigma, TTL sugerido.' },
  ],
  findings: [
    {
      finding:
        'Finding 1: «Propulsion design data was exfiltrated» — 650 MB de archivos staged, corroborado por EDR, proxy y logs del servicio externo.',
      options: [
        {
          label: 'High confidence',
          good: true,
          why: '✅ Múltiples fuentes independientes corroboran; evidencia directa y consistente.',
        },
        {
          label: 'Moderate confidence',
          good: false,
          why: '❌ Infravalora una base de evidencia multi-fuente sólida: ser tibia también descalibra.',
        },
        {
          label: 'Low confidence',
          good: false,
          why: '❌ Con tres fuentes independientes y evidencia directa, low confidence es indefendible.',
        },
      ],
    },
    {
      finding:
        'Finding 2: «VELVET CICADA operates on behalf of a specific foreign state» — basado solo en victimología, horario y overlap de infraestructura.',
      options: [
        {
          label: 'High confidence',
          good: false,
          why: '❌ La atribución a sponsor con solo evidencia técnica defensiva excede lo que la base soporta (S4M5).',
        },
        {
          label: 'Low confidence',
          good: true,
          why: '✅ La evidencia apunta en esa dirección pero es delgada y parcialmente falsificable: low confidence es la llamada honesta.',
        },
        {
          label: 'No incluir el juicio',
          good: false,
          why: '❌ Omitirlo esconde información útil: se puede emitir con confianza baja y explicar qué evidencia falta.',
        },
      ],
    },
    {
      finding:
        'Finding 3: «The actor will target Meridian suppliers within 90 days» — proyección basada en el patrón sectorial (stellardyn-vpn.net) y el modus operandi.',
      options: [
        {
          label: 'Moderate confidence',
          good: true,
          why: '✅ Proyección de patrón sólido pero sobre comportamiento futuro: moderate es el punto calibrado.',
        },
        {
          label: 'High confidence',
          good: false,
          why: '❌ El futuro no se predice con high confidence desde un solo patrón: sobreconfianza.',
        },
        {
          label: 'Almost certain',
          good: false,
          why: '❌ «Almost certain» es lenguaje de probabilidad (95–99%), y además insostenible aquí. No confundas los dos ejes.',
        },
      ],
    },
  ],
  tlp: [
    {
      product:
        'Informe completo del incidente, con detalle de víctimas internas y datos del caso',
      options: [
        {
          label: 'TLP:AMBER+STRICT',
          good: true,
          why: '✅ Detalle sensible de víctima: solo dentro de Meridian, sin clientes ni terceros.',
        },
        {
          label: 'TLP:CLEAR',
          good: false,
          why: '❌ Publicaría detalles internos del incidente al mundo (incluido el actor).',
        },
        {
          label: 'TLP:GREEN',
          good: false,
          why: '❌ La comunidad no necesita el detalle de víctima: eso viaja en el anexo saneado.',
        },
      ],
    },
    {
      product:
        'Anexo técnico saneado (IOCs, YARA, TTPs sin datos de víctima) para el ISAC del sector',
      options: [
        {
          label: 'TLP:AMBER',
          good: true,
          why: '✅ Comunidad de confianza con need-to-know — y stellardyn-vpn.net demuestra que el sector lo necesita. (GREEN sería defendible según el acuerdo del ISAC.)',
        },
        {
          label: 'TLP:RED',
          good: false,
          why: '❌ RED limita a individuos nombrados: mataría la utilidad del anexo para los equipos del sector.',
        },
        {
          label: 'TLP:CLEAR',
          good: false,
          why: '❌ Publicarlo avisa al actor de exactamente qué sabes antes de que el sector despliegue detecciones.',
        },
      ],
    },
  ],
  epilogue:
    'El lunes, el consejo lee tu BLUF y aprueba en una sesión: rotación de credenciales de proveedores, segmentación del enclave de R&D y presupuesto para el programa CTI. El ISAC despliega tus reglas; dos semanas después, otra empresa detecta a VELVET CICADA en delivery — y lo para. Requirements respondidos, stakeholders informados, sector defendido. Operación cerrada, CTI Director. 🎖️',
};
