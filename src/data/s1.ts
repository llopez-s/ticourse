import type { Module } from '../lib/types';

export const S1_MODULES: Module[] = [
  // -------------------------------------------------------------------------
  {
    id: 's1m1',
    sectionId: 's1',
    title: '¿Qué es inteligencia?',
    minutes: 12,
    objectives: [
      'Distinguir entre data, information e intelligence',
      'Entender la inteligencia como proceso, producto y profesión',
      'Conocer las disciplinas de colección (INTs) y su papel en CTI',
    ],
    blocks: [
      {
        t: 'p',
        md: 'La palabra *inteligencia* está sobrecargada, así que en CTI usamos la definición clásica de la comunidad de inteligencia: **intelligence** es información que ha sido recopilada, procesada y analizada para responder al **requirement** de un decisor, reduciendo su incertidumbre antes de tomar una decisión.',
      },
      {
        t: 'table',
        headers: ['Concepto', 'Qué es', 'Ejemplo en CTI'],
        rows: [
          [
            'Data',
            'Hechos crudos, sin contexto ni correlación',
            'Una IP en un log: 141.98.6.10',
          ],
          [
            'Information',
            'Datos correlacionados que responden a una pregunta factual',
            'Esa IP sirvió un panel de phishing el martes',
          ],
          [
            'Intelligence',
            'Información analizada que sostiene un juicio orientado a una decisión',
            '«We assess the actor will likely reuse this hosting provider; recommend monitoring new registrations on that ASN»',
          ],
        ],
      },
      {
        t: 'callout',
        kind: 'exam',
        title: 'Nota de examen',
        md: 'La distinción **data → information → intelligence** es examinable. Truco: si la frase contiene un *juicio analítico* orientado a decisión («we assess», «likely», recomendación), es intelligence. Si es un hecho verificable aislado, es data o information.',
      },
      { t: 'h', text: 'Proceso, producto y profesión' },
      {
        t: 'p',
        md: 'Inteligencia es a la vez el **proceso** que la genera (el *intelligence lifecycle*, lección S1M4), el **producto** final (un informe, un assessment, un feed enriquecido) y la **profesión** de quienes la practican. Cuando alguien dice «compramos inteligencia», casi siempre compra *information* que su equipo aún debe analizar contra sus propios requirements.',
      },
      {
        t: 'p',
        md: 'Sherman Kent, considerado el padre del análisis de inteligencia moderno, dejó la idea central de la disciplina: el análisis trabaja con **incertidumbre irreducible**. Nunca tendrás evidencia completa; tu trabajo no es dar certezas, sino emitir **juicios calibrados** con un nivel de confianza explícito.',
      },
      {
        t: 'quote',
        md: 'Intelligence analysis is the business of making careful judgments with incomplete information — and saying clearly how sure you are.',
        by: 'Paráfrasis de la escuela de Sherman Kent',
      },
      { t: 'h', text: 'Las disciplinas de colección (INTs)' },
      {
        t: 'list',
        items: [
          '**OSINT** — Open Source Intelligence: fuentes públicas (web, registros, redes, prensa).',
          '**HUMINT** — Human Intelligence: fuentes humanas (en CTI: foros underground, brokers, personas).',
          '**SIGINT** — Signals Intelligence: interceptación de señales y comunicaciones.',
          '**GEOINT** — Geospatial Intelligence: imágenes y datos geoespaciales.',
          '**MASINT** — Measurement and Signature Intelligence: firmas técnicas y medidas físicas.',
        ],
      },
      {
        t: 'callout',
        kind: 'tip',
        title: 'CTI y los INTs',
        md: 'CTI no es un INT separado: combina **telemetría técnica propia** (malware, DNS, logs, netflow) con OSINT y, en ocasiones, HUMINT. La fuente más valiosa de un equipo CTI suele ser su propia red: los incidentes que ya ha sufrido la organización.',
      },
      {
        t: 'check',
        q: {
          q: 'Which of the following is BEST described as intelligence rather than information?',
          choices: [
            'IP 141.98.6.10 appears in the proxy logs',
            'The IP hosted a phishing panel on Tuesday',
            'We assess the actor will likely re-register lookalike domains within 30 days; monitor new registrations',
            'The domain meridian-sso-portal.com resolves to 141.98.6.10',
          ],
          answer: 2,
          explain:
            'Intelligence contains an analytic judgment tied to a decision (monitoring), with estimative language ("likely"). The rest are facts: data or information.',
        },
      },
      {
        t: 'p',
        md: 'Con la definición clara, el siguiente paso es precisar qué es exactamente una **threat** — porque sin amenaza definida, no hay *threat intelligence* posible.',
      },
    ],
    quiz: [
      {
        id: 's1m1q1',
        domain: 'Requirements',
        prompt:
          'What is the key element that turns analyzed information into intelligence?',
        choices: [
          'It is stored in a threat intelligence platform',
          'It supports a decision maker by reducing uncertainty about a requirement',
          'It comes from classified or paid sources',
          'It contains technical indicators that can be blocked',
        ],
        answer: 1,
        explain:
          'Intelligence is defined by its purpose: analyzed information that reduces a decision maker\'s uncertainty. Source type, storage, or indicators do not define it.',
      },
      {
        id: 's1m1q2',
        domain: 'Requirements',
        prompt:
          'A SIEM dashboard shows: "4,212 failed logons from 18 source IPs in the last hour." This is best classified as:',
        choices: ['Intelligence', 'Information', 'An assessment', 'A PIR'],
        answer: 1,
        explain:
          'Correlated facts answering a factual question ("how many, from where") are information. There is no analytic judgment or decision support yet.',
      },
      {
        id: 's1m1q3',
        domain: 'Requirements',
        prompt:
          'According to the Sherman Kent school of analysis, what should an analyst do when evidence is incomplete?',
        choices: [
          'Wait until enough evidence exists to be certain',
          'Escalate to a senior analyst who can decide',
          'Deliver a calibrated judgment and state the confidence level explicitly',
          'Report only the verified facts and avoid any judgment',
        ],
        answer: 2,
        explain:
          'Analysis exists precisely because evidence is never complete. The analyst\'s job is calibrated judgment with explicit confidence, not certainty or silence.',
      },
      {
        id: 's1m1q4',
        domain: 'Collection',
        prompt:
          'Monitoring underground forums where access brokers advertise stolen credentials is closest to which collection discipline?',
        choices: ['GEOINT', 'MASINT', 'SIGINT', 'HUMINT/OSINT'],
        answer: 3,
        explain:
          'Forum monitoring blends OSINT (openly accessible content) and HUMINT tradecraft (engaging human sources/personas). GEOINT, MASINT and SIGINT involve imagery, signatures and signals.',
      },
      {
        id: 's1m1q5',
        domain: 'Requirements',
        prompt: '"Intelligence" can correctly refer to all of the following EXCEPT:',
        choices: [
          'The process used to produce assessments',
          'The final analytic product delivered to a consumer',
          'The profession and its practitioners',
          'Any feed of technical indicators, regardless of analysis',
        ],
        answer: 3,
        explain:
          'A raw indicator feed without analysis against your requirements is data/information. Intelligence is process, product, and profession.',
      },
      {
        id: 's1m1q6',
        domain: 'Collection',
        prompt:
          'Which source is typically the MOST valuable starting point for a new CTI team?',
        choices: [
          'Commercial premium feeds',
          'The organization\'s own incident and network telemetry',
          'Government classified briefings',
          'Social media trend monitoring',
        ],
        answer: 1,
        explain:
          'Internal incident data describes adversaries that demonstrably target you — the most relevant threat population. External feeds add context afterward.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 's1m2',
    sectionId: 's1',
    title: 'Amenaza y riesgo',
    minutes: 11,
    objectives: [
      'Definir threat con sus tres componentes: intent, capability, opportunity',
      'Situar la contribución de CTI dentro de la ecuación de riesgo',
      'Explicar la ventaja del defensor (defender\'s advantage)',
    ],
    blocks: [
      {
        t: 'p',
        md: 'En lenguaje coloquial, «amenaza» es cualquier cosa mala. En CTI el término es preciso: una **threat** existe solo cuando coinciden tres componentes en un adversario: **intent** (intención hostil), **capability** (capacidad real de causar daño) y **opportunity** (la ocasión de ejercerla contra ti).',
      },
      {
        t: 'list',
        items: [
          '**Intent** — el adversario quiere algo de ti: dinero, propiedad intelectual, disrupción, posicionamiento estratégico.',
          '**Capability** — herramientas, exploits, infraestructura y habilidad operativa para lograrlo.',
          '**Opportunity** — superficie expuesta y momento: acceso posible a tus sistemas o personas.',
        ],
      },
      {
        t: 'callout',
        kind: 'example',
        title: 'Componentes en acción',
        md: 'Un exploit público para un software que **no usas**: capability sin opportunity → no es una threat para ti. Un grupo que detesta tu sector pero sin malware funcional: intent sin capability. Solo la combinación completa convierte a un actor en amenaza.',
      },
      {
        t: 'p',
        md: 'Corolario importante: **el malware no es la amenaza**. El malware es una *capability*, una herramienta. La amenaza es el **adversario humano** que la opera con una intención. Por eso CTI estudia actores y comportamientos (TTPs), no solo ficheros: el atacante puede cambiar de herramienta en horas, pero cambiar de *comportamiento* le cuesta mucho más.',
      },
      { t: 'h', text: 'Riesgo: dónde encaja CTI' },
      {
        t: 'p',
        md: 'Una formulación habitual: **risk = f(threat × vulnerability × consequence)**. CTI alimenta el factor *threat* con evidencia real — qué actores existen, a quién apuntan, cómo operan — y evita que la organización gaste defendiéndose de fantasmas mientras ignora a quien sí la tiene en su lista.',
      },
      {
        t: 'table',
        headers: ['Pregunta', 'Quién la responde'],
        rows: [
          ['¿Quién querría atacarnos y cómo opera?', 'CTI (threat)'],
          ['¿Dónde somos débiles?', 'Vulnerability management (vulnerability)'],
          ['¿Qué perderíamos si ocurre?', 'Negocio / BIA (consequence)'],
        ],
      },
      {
        t: 'callout',
        kind: 'exam',
        title: 'Nota de examen',
        md: '**Threat = intent + capability + opportunity** cae directamente en preguntas. Practica identificar *cuál componente falta* en un escenario dado.',
      },
      {
        t: 'check',
        q: {
          q: 'An actor has working ransomware and publicly states it targets your sector, but your only systems are in an isolated, air-gapped facility with no remote access. Which threat component is missing?',
          choices: ['Intent', 'Capability', 'Opportunity', 'None — it is a threat'],
          answer: 2,
          explain:
            'Intent and capability exist, but without a path to reach you there is no opportunity — and thus no complete threat (today).',
        },
      },
      { t: 'h', text: 'La ventaja del defensor' },
      {
        t: 'p',
        md: 'Contra la narrativa de que «el atacante solo necesita acertar una vez», la realidad operativa favorece al defensor preparado: el adversario debe encadenar **muchos pasos en tu terreno** (delivery, ejecución, persistencia, C2, movimiento lateral…), y cada paso es una oportunidad de detección. CTI existe para explotar esa asimetría: conocer los pasos probables del adversario y sembrar detecciones en su camino.',
      },
      {
        t: 'callout',
        kind: 'tip',
        md: 'Esta idea se materializa en la sección 2 con la **Kill Chain** y la matriz de **Courses of Action**: un defensor solo necesita romper *un eslabón* para frustrar la intrusión.',
      },
    ],
    quiz: [
      {
        id: 's1m2q1',
        domain: 'Requirements',
        prompt: 'Which three components must coincide for a threat to exist?',
        choices: [
          'Malware, infrastructure, and a victim',
          'Intent, capability, and opportunity',
          'Vulnerability, exploit, and impact',
          'Actor, campaign, and indicator',
        ],
        answer: 1,
        explain:
          'The classic threat triad: hostile intent, real capability, and the opportunity to act against the target.',
      },
      {
        id: 's1m2q2',
        domain: 'Requirements',
        prompt: 'Why is malware on its own NOT a threat?',
        choices: [
          'Because modern EDR blocks most malware automatically',
          'Because malware is a capability; the threat is the human adversary operating it with intent',
          'Because malware only becomes a threat once it is signed by an antivirus vendor',
          'Because threats can only be nation-state actors',
        ],
        answer: 1,
        explain:
          'Tools are capabilities. Threats require a human adversary with intent and opportunity — which is why CTI tracks actors and behaviors, not just files.',
      },
      {
        id: 's1m2q3',
        domain: 'Requirements',
        prompt:
          'A hacktivist collective loudly announces a campaign against your industry but has only ever performed website defacements using public tools, and your web presence is hosted by a hardened third party. CTI\'s most accurate characterization is:',
        choices: [
          'High threat: intent is explicit',
          'No threat: hacktivists never matter',
          'Limited threat today: strong intent, weak capability, little opportunity — monitor for changes',
          'Critical risk: all three components are present',
        ],
        answer: 2,
        explain:
          'Good CTI weighs each component honestly and keeps watching: intent without matching capability/opportunity is a limited (but not zero) threat.',
      },
      {
        id: 's1m2q4',
        domain: 'Requirements',
        prompt: 'In the risk equation, what does CTI primarily inform?',
        choices: [
          'The vulnerability factor',
          'The consequence factor',
          'The threat factor',
          'The insurance premium',
        ],
        answer: 2,
        explain:
          'CTI provides evidence about real adversaries — who, why, and how — which is the threat side. Vulnerabilities and consequences are owned by other functions.',
      },
      {
        id: 's1m2q5',
        domain: 'Requirements',
        prompt: 'The "defender\'s advantage" rests on which observation?',
        choices: [
          'Defenders have bigger budgets than attackers',
          'An intrusion requires the adversary to complete many steps inside terrain the defender controls and can instrument',
          'Law enforcement deters most attackers',
          'Attackers cannot change tools quickly',
        ],
        answer: 1,
        explain:
          'Every required step (delivery, execution, C2, lateral movement…) happens on defender-controlled terrain and is a detection opportunity. Breaking one link can defeat the chain.',
      },
      {
        id: 's1m2q6',
        domain: 'Requirements',
        prompt:
          'An espionage group has both custom implants and remote access to your supplier portal, but analysis shows your data has no value to its sponsor\'s collection goals. Which component is weakest?',
        choices: ['Opportunity', 'Capability', 'Intent', 'Attribution'],
        answer: 2,
        explain:
          'Capability and opportunity exist; what is missing is intent — your assets do not serve the actor\'s goals. Requirements analysis avoids overestimating such actors.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 's1m3',
    sectionId: 's1',
    title: 'Niveles de CTI y la Sliding Scale',
    minutes: 13,
    objectives: [
      'Diferenciar inteligencia tactical, operational y strategic',
      'Asignar productos y audiencias a cada nivel',
      'Ubicar actividades en la Sliding Scale of Cyber Security',
    ],
    blocks: [
      {
        t: 'p',
        md: 'No existe «la» inteligencia: existe inteligencia **para alguien**. La audiencia define el nivel, el producto y el horizonte temporal. La taxonomía clásica distingue tres niveles.',
      },
      {
        t: 'table',
        headers: ['Nivel', 'Audiencia', 'Pregunta típica', 'Productos', 'Horizonte'],
        rows: [
          [
            'Tactical',
            'SOC, detección, IR',
            '¿Qué bloqueo/detecto hoy?',
            'IOCs, reglas (YARA/Sigma/Snort), feeds',
            'Horas–días',
          ],
          [
            'Operational',
            'Threat hunters, IR leads, CTI peers',
            '¿Cómo opera este grupo? ¿Qué campañas hay activas?',
            'Informes de campaña, análisis de TTPs, mapeos ATT&CK',
            'Semanas–meses',
          ],
          [
            'Strategic',
            'CISO, dirección, board',
            '¿Dónde invertimos? ¿Qué riesgo aceptamos?',
            'Assessments, tendencias, panorama de amenazas',
            'Meses–años',
          ],
        ],
      },
      {
        t: 'callout',
        kind: 'warn',
        title: 'El error clásico',
        md: 'Alimentar al board con listas de IOCs, o al SOC con geopolítica. Cada nivel responde preguntas distintas: **producto correcto para audiencia correcta** es la regla nº 1 de la diseminación (sección 5).',
      },
      { t: 'h', text: 'Sliding Scale of Cyber Security' },
      {
        t: 'p',
        md: 'La **Sliding Scale of Cyber Security** ordena las inversiones de seguridad en cinco categorías: **Architecture → Passive Defense → Active Defense → Intelligence → Offense**. Las categorías de la izquierda aportan la base con mejor retorno; las de la derecha solo rinden cuando las anteriores existen. Intelligence *multiplica* el valor de las demás, no las sustituye.',
      },
      {
        t: 'list',
        items: [
          '**Architecture** — diseñar y mantener sistemas defendibles: segmentación, hardening, parcheo.',
          '**Passive Defense** — protección sin operador en el bucle: firewalls, EDR/AV, filtrado.',
          '**Active Defense** — analistas en el bucle: monitorización, threat hunting, respuesta a incidentes.',
          '**Intelligence** — consumir y producir conocimiento del adversario para informar al resto.',
          '**Offense** — acciones legales de respuesta contra el adversario; terreno casi exclusivo de estados.',
        ],
      },
      {
        t: 'callout',
        kind: 'exam',
        title: 'Nota de examen',
        md: 'Clasifica actividades en la escala: *parchear* = Architecture; *firewall/EDR* = Passive Defense; *hunting y monitorización* = Active Defense; *informes de actor* = Intelligence. La escala también argumenta por qué no empezar la casa por el tejado: intelligence sin arquitectura defendible aporta poco.',
      },
      {
        t: 'check',
        q: {
          q: 'Threat hunting belongs to which category of the Sliding Scale of Cyber Security?',
          choices: ['Architecture', 'Passive Defense', 'Active Defense', 'Offense'],
          answer: 2,
          explain:
            'Hunting requires analysts in the loop actively searching for adversaries — the definition of Active Defense.',
        },
      },
      { t: 'h', text: 'La inteligencia habilita a otros equipos' },
      {
        t: 'list',
        items: [
          '**SOC** — priorización de alertas con contexto de actor y campaña.',
          '**IR** — saber *quién* probablemente es y qué hará a continuación cambia la contención.',
          '**Vulnerability management** — priorizar los CVEs que las amenazas reales explotan.',
          '**Red team** — emulación de adversarios basada en TTPs observados.',
          '**Dirección** — decisiones de inversión y riesgo basadas en el panorama real.',
        ],
      },
      {
        t: 'check',
        q: {
          q: 'Which product best serves a STRATEGIC consumer?',
          choices: [
            'A YARA rule pack for the latest loader',
            'A quarterly assessment of espionage trends affecting the aerospace sector',
            'A list of 4,000 malicious IPs',
            'A Sigma rule for suspicious PowerShell',
          ],
          answer: 1,
          explain:
            'Strategic consumers decide investment and risk posture; they need trends and assessments, not technical indicators.',
        },
      },
    ],
    quiz: [
      {
        id: 's1m3q1',
        domain: 'Requirements',
        prompt:
          'A campaign report describing how an intrusion set conducts phishing, its tooling, and its targeting pattern across your sector is which level of intelligence?',
        choices: ['Tactical', 'Operational', 'Strategic', 'Technical'],
        answer: 1,
        explain:
          'Campaign/TTP analysis aimed at hunters and defenders is operational intelligence — between daily IOCs (tactical) and board-level trends (strategic).',
      },
      {
        id: 's1m3q2',
        domain: 'Requirements',
        prompt: 'The PRIMARY consumers of tactical intelligence are:',
        choices: [
          'The board of directors',
          'SOC analysts and detection engineering',
          'Regulators and auditors',
          'Procurement teams',
        ],
        answer: 1,
        explain:
          'Tactical intelligence (IOCs, detection rules) feeds day-to-day blocking and alerting — SOC and detection teams.',
      },
      {
        id: 's1m3q3',
        domain: 'Requirements',
        prompt:
          'Order the Sliding Scale of Cyber Security from foundation to apex:',
        choices: [
          'Passive Defense → Architecture → Intelligence → Active Defense → Offense',
          'Architecture → Passive Defense → Active Defense → Intelligence → Offense',
          'Intelligence → Architecture → Passive Defense → Active Defense → Offense',
          'Architecture → Active Defense → Passive Defense → Offense → Intelligence',
        ],
        answer: 1,
        explain:
          'Architecture, Passive Defense, Active Defense, Intelligence, Offense — left categories give the highest defensive return and enable the right.',
      },
      {
        id: 's1m3q4',
        domain: 'Requirements',
        prompt:
          'Deploying and tuning an EDR product that blocks known malware without analyst interaction is which Sliding Scale category?',
        choices: ['Architecture', 'Passive Defense', 'Active Defense', 'Intelligence'],
        answer: 1,
        explain:
          'Systems added to the architecture that provide protection without humans in the loop are Passive Defense.',
      },
      {
        id: 's1m3q5',
        domain: 'Requirements',
        prompt:
          'Why does a mature intelligence function provide limited value to an organization with no defensible architecture or monitoring?',
        choices: [
          'Because intelligence is only useful to governments',
          'Because intelligence multiplies existing defensive functions; with nothing to enable, its output cannot be acted on',
          'Because feeds are too expensive for small organizations',
          'Because attackers avoid organizations with intelligence teams',
        ],
        answer: 1,
        explain:
          'Intelligence informs and amplifies other functions. Without architecture, passive and active defense, there is nobody to act on the intelligence.',
      },
      {
        id: 's1m3q6',
        domain: 'Requirements',
        prompt:
          'Your CISO asks: "Should we expand into a new market given the espionage activity there?" Which intelligence level should answer?',
        choices: ['Tactical', 'Operational', 'Strategic', 'None — this is not CTI'],
        answer: 2,
        explain:
          'Business-direction and risk-acceptance questions are strategic intelligence: trends, actor landscapes, and long-horizon assessments.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 's1m4',
    sectionId: 's1',
    title: 'El ciclo de inteligencia',
    minutes: 12,
    objectives: [
      'Recorrer las seis fases del intelligence lifecycle',
      'Identificar actividades típicas (y fallos típicos) de cada fase',
      'Conocer F3EAD como ciclo operacional complementario',
    ],
    blocks: [
      {
        t: 'p',
        md: 'El **intelligence lifecycle** es el proceso que convierte preguntas en respuestas accionables. Sin él, la «colección» degenera en acaparar feeds que nadie analiza. Las seis fases clásicas:',
      },
      {
        t: 'list',
        ordered: true,
        items: [
          '**Planning & Direction** — definir requirements con los decisores; planificar la colección.',
          '**Collection** — obtener los datos crudos de las fuentes planificadas.',
          '**Processing & Exploitation** — convertir lo crudo en analizable: parsear, decodificar, traducir, normalizar, detonar muestras.',
          '**Analysis & Production** — aplicar técnicas analíticas y producir juicios calibrados.',
          '**Dissemination** — entregar el producto correcto a la audiencia correcta, a tiempo.',
          '**Feedback** — comprobar si la necesidad quedó cubierta y refinar los requirements.',
        ],
      },
      {
        t: 'p',
        md: 'La fase más ignorada es la primera: **todo empieza con requirements**. Si nadie definió la pregunta, ningún análisis posterior puede responderla. La segunda más ignorada es la última: sin **feedback**, el equipo produce informes que nadie usa y no se entera.',
      },
      {
        t: 'callout',
        kind: 'warn',
        title: 'Fallos típicos por fase',
        md: 'Saltarse *Planning* → colección sin dirección (data hoarding). Morir en *Processing* → terabytes crudos imposibles de analizar. *Dissemination* sin conocer a la audiencia → informes técnicos al board. Cero *Feedback* → el ciclo nunca mejora.',
      },
      {
        t: 'callout',
        kind: 'exam',
        title: 'Nota de examen',
        md: 'Clasifica actividades por fase. Palabras clave: *convert, decode, translate, normalize, detonate* → **Processing & Exploitation**; *judgment, assessment, hypothesis* → **Analysis**; *requirements, tasking* → **Planning & Direction**.',
      },
      {
        t: 'check',
        q: {
          q: 'Which lifecycle phase turns raw collected data into a form analysts can work with?',
          choices: [
            'Collection',
            'Processing & Exploitation',
            'Analysis & Production',
            'Dissemination',
          ],
          answer: 1,
          explain:
            'Processing & Exploitation covers parsing, decoding, normalizing, translating — preparing raw data for analysis.',
        },
      },
      { t: 'h', text: 'F3EAD: el ciclo de operaciones' },
      {
        t: 'p',
        md: '**F3EAD** — *Find, Fix, Finish, Exploit, Analyze, Disseminate* — nació en operaciones militares de targeting y encaja muy bien cuando CTI trabaja pegada a IR: las tres primeras letras son la operación (localizar, fijar, neutralizar) y las tres últimas son inteligencia (explotar la evidencia capturada, analizarla, diseminarla). Tras contener un incidente (*finish*), la evidencia forense se **explota** para alimentar el siguiente ciclo.',
      },
      {
        t: 'p',
        md: 'La relación entre ambos ciclos es de engranaje: el lifecycle marca el ritmo estratégico del equipo de inteligencia; F3EAD acelera el bucle táctico entre operaciones e inteligencia durante incidentes activos.',
      },
      {
        t: 'check',
        q: {
          q: 'In F3EAD, which phases belong to the intelligence half of the cycle?',
          choices: [
            'Find, Fix, Finish',
            'Exploit, Analyze, Disseminate',
            'Fix, Exploit, Disseminate',
            'Find, Analyze, Finish',
          ],
          answer: 1,
          explain:
            'F3 (Find, Fix, Finish) is the operations half; EAD (Exploit, Analyze, Disseminate) is the intelligence half.',
        },
      },
    ],
    quiz: [
      {
        id: 's1m4q1',
        domain: 'Requirements',
        prompt: 'Which phase begins the intelligence lifecycle?',
        choices: [
          'Collection',
          'Planning & Direction',
          'Analysis & Production',
          'Feedback',
        ],
        answer: 1,
        explain:
          'Everything starts with requirements and direction from decision makers; collection without direction is hoarding.',
      },
      {
        id: 's1m4q2',
        domain: 'Requirements',
        prompt:
          'Detonating a malware sample in a sandbox and parsing its network indicators into a normalized format belongs to:',
        choices: [
          'Collection',
          'Processing & Exploitation',
          'Dissemination',
          'Planning & Direction',
        ],
        answer: 1,
        explain:
          'Converting raw collected material (a binary) into analyzable, normalized output is Processing & Exploitation.',
      },
      {
        id: 's1m4q3',
        domain: 'Requirements',
        prompt: 'What is the purpose of the Feedback phase?',
        choices: [
          'To archive old reports',
          'To verify whether the consumer\'s need was met and refine requirements for the next cycle',
          'To rate analysts\' individual performance',
          'To convert reports into IOC feeds',
        ],
        answer: 1,
        explain:
          'Feedback closes the loop: did the product answer the requirement? What should change next cycle? Without it the team cannot improve.',
      },
      {
        id: 's1m4q4',
        domain: 'Requirements',
        prompt:
          'A team subscribes to twelve feeds "to have everything," with no requirements defined. Which failure does this illustrate?',
        choices: [
          'Processing failure',
          'Collection without direction — skipping Planning & Direction',
          'Excessive feedback',
          'Over-dissemination',
        ],
        answer: 1,
        explain:
          'Collecting because data exists, not because a requirement demands it, is the classic symptom of a skipped planning phase.',
      },
      {
        id: 's1m4q5',
        domain: 'Requirements',
        prompt: 'In F3EAD, what happens immediately after "Finish"?',
        choices: [
          'Find — the cycle restarts',
          'Exploit — captured material/evidence is exploited for intelligence value',
          'Disseminate — results are published',
          'Fix — the target is located precisely',
        ],
        answer: 1,
        explain:
          'After the operational action (Finish), Exploit extracts intelligence from captured evidence, feeding Analyze and Disseminate.',
      },
      {
        id: 's1m4q6',
        domain: 'Requirements',
        prompt:
          'Writing the assessment "We assess with moderate confidence that the actor staged data for exfiltration" happens in which lifecycle phase?',
        choices: [
          'Processing & Exploitation',
          'Collection',
          'Analysis & Production',
          'Feedback',
        ],
        answer: 2,
        explain:
          'Producing calibrated analytic judgments is the core of Analysis & Production.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 's1m5',
    sectionId: 's1',
    title: 'Requirements y PIRs',
    minutes: 12,
    objectives: [
      'Formular intelligence requirements útiles',
      'Aplicar los criterios de un buen PIR',
      'Conectar PIRs con stakeholders y con el plan de colección',
    ],
    blocks: [
      {
        t: 'p',
        md: 'Un **intelligence requirement** es una pregunta que el equipo de inteligencia se compromete a responder. Los **PIRs (Priority Intelligence Requirements)** son el subconjunto que más importa: las pocas preguntas cuya respuesta cambia decisiones concretas de un stakeholder.',
      },
      {
        t: 'list',
        items: [
          '**Una sola pregunta** por requirement — nada de «y también…».',
          '**Específico** — actores, sectores, tecnologías o geografías concretas.',
          '**Ligado a una decisión** — alguien hará algo distinto según la respuesta.',
          '**Factible** — respondible con tu colección actual o alcanzable.',
          '**Acotado en el tiempo** cuando aplique — las prioridades caducan.',
        ],
      },
      {
        t: 'table',
        headers: ['❌ Mal PIR', '✅ Buen PIR'],
        rows: [
          [
            '"What is China doing in cyber?"',
            '"Which intrusion sets with a history of targeting European aerospace use supplier (supply-chain) access, and how would we detect that access at Meridian?"',
          ],
          [
            '"Tell me about ransomware."',
            '"Which ransomware affiliates exploit internet-facing VPN appliances like ours, and which initial-access behaviors should our SOC alert on?"',
          ],
        ],
      },
      {
        t: 'p',
        md: 'Los requirements **dirigen la colección**: cada PIR se descompone en preguntas de colección más pequeñas y se mapea a fuentes concretas mediante un **Collection Management Framework** (lo construirás en S3M1). Si una fuente no sirve a ningún requirement, sobra; si un requirement no tiene fuentes, hay que conseguirlas.',
      },
      {
        t: 'callout',
        kind: 'story',
        title: '🎖️ Operación VELVET CICADA — tu primer encargo',
        md: 'Meridian Dynamics (aeroespacial, 8.000 empleados) te ficha como su primera analista CTI. Rumores de robo de diseños en el sector y un board nervioso. El CISO te pide: «Proponme nuestros primeros PIRs». Eso harás en el **Lab 1B: PIR Workshop**.',
      },
      {
        t: 'check',
        q: {
          q: 'Above all else, a PIR must be tied to:',
          choices: [
            'A technology the SOC owns',
            'A pending decision of a stakeholder',
            'A nation-state actor',
            'A quarterly reporting calendar',
          ],
          answer: 1,
          explain:
            'Priority comes from decisions: if no decision changes with the answer, it is not a priority requirement.',
        },
      },
      {
        t: 'p',
        md: 'Distinción útil: los **standing requirements** son preguntas permanentes («¿qué actores apuntan a nuestro sector?») que se revisan periódicamente; los **ad hoc requirements** nacen de eventos (una fusión, un incidente, una nueva tecnología) y expiran al responderse.',
      },
      {
        t: 'callout',
        kind: 'exam',
        title: 'Nota de examen',
        md: 'PIR = pregunta única, específica, ligada a decisión y priorizada por el consumidor. Reconoce el *mejor formado* entre varios candidatos — los distractores suelen ser amplios, dobles o sin decisión asociada.',
      },
    ],
    quiz: [
      {
        id: 's1m5q1',
        domain: 'Requirements',
        prompt: 'What distinguishes a PIR from a generic intelligence requirement?',
        choices: [
          'PIRs only concern nation-state actors',
          'PIRs are the highest-priority questions, tied to specific stakeholder decisions',
          'PIRs are classified',
          'PIRs never expire',
        ],
        answer: 1,
        explain:
          'The P is priority: the few requirements whose answers drive concrete decisions get PIR status.',
      },
      {
        id: 's1m5q2',
        domain: 'Requirements',
        prompt: 'Which is the BEST-formed PIR for a European aerospace manufacturer?',
        choices: [
          '"What are APT groups doing this year?"',
          '"Which intrusion sets targeting aerospace IP use supplier access for initial entry, and what would that access look like in our environment?"',
          '"Is ransomware dangerous, and also what about insider threats?"',
          '"Collect all indicators related to phishing."',
        ],
        answer: 1,
        explain:
          'Single question, specific actors/vector/sector, clearly feeds detection and supplier-risk decisions. The others are broad, double-barreled, or tasking rather than questions.',
      },
      {
        id: 's1m5q3',
        domain: 'Requirements',
        prompt: 'Requirements primarily drive which next activity?',
        choices: [
          'The collection plan — mapping questions to sources',
          'The incident response retainer',
          'The SOC shift schedule',
          'Report formatting standards',
        ],
        answer: 0,
        explain:
          'Each requirement decomposes into collection questions mapped to sources (a Collection Management Framework). Sources serving no requirement are waste.',
      },
      {
        id: 's1m5q4',
        domain: 'Requirements',
        prompt:
          '"Which threat groups target our sector and with what TTPs?" reviewed quarterly is an example of a(n):',
        choices: [
          'Ad hoc requirement',
          'Standing requirement',
          'Collection gap',
          'Course of action',
        ],
        answer: 1,
        explain:
          'Permanent, periodically reviewed questions are standing requirements; event-driven ones are ad hoc.',
      },
      {
        id: 's1m5q5',
        domain: 'Requirements',
        prompt:
          'A stakeholder asks for "everything about APT28, APT29, Lazarus, and also cybercrime trends, weekly." The main problem with this requirement is:',
        choices: [
          'It mentions named groups',
          'It is multiple broad questions bundled together with no decision attached',
          'Weekly cadence is too slow',
          'It should go to the SOC instead',
        ],
        answer: 1,
        explain:
          'Good requirements are single, specific, decision-linked questions. This is several vague topics and no decision — it needs decomposition with the stakeholder.',
      },
      {
        id: 's1m5q6',
        domain: 'Requirements',
        prompt:
          'Who should ultimately validate that a PIR is truly a priority?',
        choices: [
          'The CTI analyst who wrote it',
          'The stakeholder/decision maker it serves',
          'The feed vendor',
          'The red team',
        ],
        answer: 1,
        explain:
          'Priority is defined by the consumer\'s decisions. Analysts draft and refine, but the decision maker validates priority.',
      },
    ],
  },
];
