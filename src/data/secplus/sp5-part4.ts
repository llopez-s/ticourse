import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// SP5M7 — Auditorías, evaluaciones y penetration testing (SY0-701, objetivo 5.5)
// ---------------------------------------------------------------------------
const sp5m7: Module = {
  id: 'sp5m7',
  sectionId: 'sp5',
  title: 'Auditorías, evaluaciones y penetration testing',
  minutes: 13,
  objectives: [
    'Definir la attestation como declaración formal y firmada, y distinguirla del acknowledgement que firma cada empleada',
    'Diferenciar las auditorías internas (compliance, audit committee, self-assessments) de las externas (regulatory, independent third-party) y explicar por qué la independencia es lo que da peso al resultado',
    'Separar lo que demuestra una auditoría —cumplimiento con un estándar— de lo que demuestra un penetration test —que las defensas se pueden romper de verdad',
    'Elegir el tipo de prueba adecuado entre physical, offensive (red team), defensive (blue team) e integrated (purple team)',
    'Escoger el nivel de conocimiento del entorno (known, partially known, unknown) según el objetivo, el presupuesto y el realismo que se busca',
    'Distinguir la passive reconnaissance de la active reconnaissance por la huella que dejan en los registros del objetivo',
  ],
  blocks: [
    {
      t: 'p',
      md: 'En la lección anterior viste qué obliga a la Autoridad Portuaria de Halden: normas nacionales, privacidad, retención, due care y due diligence. El problema es que **decir que cumples no es demostrarlo**. El objetivo 5.5 trata precisamente de la prueba: cómo se comprueba que el programa de seguridad existe fuera de los documentos, quién puede comprobarlo con credibilidad y qué tipo de comprobación responde a cada pregunta. Hay dos familias de respuesta y el examen las contrapone constantemente. La **auditoría** pregunta *¿cumplimos el estándar?* y se responde con evidencia documental y muestreo. El **penetration test** pregunta *¿pueden romperlo?* y se responde intentándolo. Una organización puede pasar una auditoría impecable y caer en dos horas ante un red team competente, y eso no es una contradicción: es que cada prueba mide una cosa distinta.',
    },
    { t: 'h', text: 'Attestation: la firma que convierte una afirmación en un compromiso' },
    {
      t: 'p',
      md: 'La **attestation** es una **declaración formal y firmada** de que algo es cierto, emitida por alguien que asume la responsabilidad de esa afirmación. No es un correo diciendo «todo está bien»: es un documento con fecha, alcance, criterio y firma, y su valor está justamente en que quien firma queda comprometido. Aparece en dos sitios del examen. Por un lado, la **management attestation**: la dirección declara formalmente ante el consejo o ante el regulador que los controles descritos están implantados y operativos durante un periodo concreto. Por otro, el **informe de atestación de un tercero**, el entregable que una firma independiente emite tras evaluar los controles de un proveedor —el tipo de informe que la naviera pedirá a Halden antes de conectar sus sistemas de manifiestos—. Conviene no confundirla con el **acknowledgement**, que es lo que firma cada empleada cuando reconoce haber leído y entendido la política de uso aceptable: el acknowledgement compromete a una persona con una norma, la attestation compromete a la organización con un hecho. La trampa de examen es una tercera confusión: la attestation es una **declaración**, no una prueba técnica; si el escenario pide comprobar si el control funciona bajo ataque, la respuesta no es una firma.',
    },
    {
      t: 'check',
      q: {
        q: 'A shipping line will only connect to the Halden Port Authority manifest system if the port provides a formal, signed statement from an independent firm confirming that the described security controls were in place and operating over the last twelve months. What is the shipping line asking for?',
        choices: [
          'An acknowledgement signed by each port employee',
          'A vulnerability scan report from the port security team',
          'An attestation issued by an independent third party',
          'A copy of the port information security policy',
        ],
        answer: 2,
        explain:
          'An attestation is exactly this: a formal signed statement that something is true, and when it comes from an independent firm it carries weight with an outside party. The acknowledgement is the tempting distractor because it is also a signature about security, but it only records that an individual has read a policy, and it says nothing about whether the controls actually operated.',
      },
    },
    { t: 'h', text: 'Auditorías internas y externas: quién mira y con qué peso' },
    {
      t: 'p',
      md: 'Una **internal audit** la realiza la propia organización sobre sí misma: revisa el cumplimiento de las políticas y estándares internos y de los requisitos externos aplicables, y su gran ventaja es que puede mirar de forma continua y sin coste de contratación. Para que sirva de algo necesita una independencia mínima, y de ahí viene el **audit committee**: un comité del consejo de administración —no de la dirección ejecutiva— que supervisa la función de auditoría, recibe directamente sus informes y protege a la auditora de las presiones del área que está auditando. El comité no audita: vigila que la auditoría pueda hacer su trabajo y exige planes de acción sobre los hallazgos. Un escalón por debajo están los **self-assessments**: el propio equipo evalúa su área con un cuestionario o una checklist. Son baratísimos, útiles para prepararse y detectan los huecos evidentes, pero carecen por completo de independencia —nadie se pone mala nota a sí mismo con entusiasmo— y por eso ningún cliente ni regulador los acepta como prueba. Las auditorías **externas** existen precisamente por eso. La **regulatory examination** la ejecuta un organismo con potestad legal: no la contratas, te la hacen, su alcance lo fija la norma y su resultado puede acabar en sanción, condiciones impuestas o pérdida de licencia. El **independent third-party audit** lo contratas tú, pero la clave está en la palabra **independent**: la firma que audita no puede tener interés en el resultado ni haber diseñado los controles que revisa. Esa independencia es lo único que convierte el informe en algo que un cliente, una aseguradora o un socio aceptan sin haberlo visto por sí mismos; sin ella, el informe vale lo mismo que un self-assessment con un logo más caro. El examen insiste en este punto: cuando el escenario habla de convencer a un **tercero** —un cliente, un regulador, un consejo escéptico—, la respuesta correcta casi siempre incluye la palabra independiente. Y recuerda la conexión con el riesgo de proveedores: para auditar a un proveedor necesitas la **right-to-audit clause** firmada de antemano; si no la tienes, lo que puedes pedir es su informe de atestación independiente.',
    },
    {
      t: 'table',
      headers: ['Tipo de evaluación', 'Quién la hace', 'Qué peso tiene y ante quién', 'Ejemplo en Halden'],
      rows: [
        [
          'Self-assessment',
          'El propio equipo sobre su propia área',
          'Barato, rápido y honesto solo hasta cierto punto; sin independencia, valor interno únicamente',
          'El equipo de TI rellena la checklist de controles antes de la revisión anual',
        ],
        [
          'Internal audit (compliance)',
          'La función de auditoría interna, separada del área auditada',
          'Independiente de la gestión operativa, pero no de la organización; sirve para dirigir y corregir',
          'Auditoría interna comprueba si las bajas de personal se ejecutan el mismo día',
        ],
        [
          'Audit committee',
          'Un comité del consejo de administración',
          'No audita: supervisa, recibe los informes y protege la independencia de la auditoría interna',
          'El comité recibe el hallazgo sobre cuentas huérfanas y exige plan de acción con fecha',
        ],
        [
          'Independent third-party audit',
          'Una firma externa sin interés en el resultado',
          'El único que aceptan clientes, aseguradoras y socios sin comprobarlo ellos mismos',
          'Una firma emite el informe de atestación que la naviera exige antes de integrarse',
        ],
        [
          'Regulatory examination',
          'El organismo con potestad legal sobre la actividad',
          'Obligatoria; su resultado puede traducirse en multa, condiciones o pérdida de licencia',
          'Inspección de la autoridad marítima nacional sobre el plan de protección portuaria',
        ],
        [
          'Penetration test',
          'Un equipo ofensivo autorizado, interno o contratado',
          'No certifica cumplimiento: demuestra explotabilidad real y camino de ataque',
          'Un equipo contratado intenta llegar desde la wifi de visitantes a la red de la terminal',
        ],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'An external firm reviews the Halden Port Authority evidence, samples change records, interviews staff, and issues a report stating that the port meets the required control standard. Weeks later a red team reaches the terminal management network in a day. Which statement BEST explains this?',
        choices: [
          'The audit was fraudulent, because a compliant organization cannot be breached',
          'The audit was invalid because it was performed by an external firm rather than internal staff',
          'An audit measures compliance with a standard, while a penetration test measures whether the defences can actually be broken',
          'The penetration test was invalid because the audit report is more recent',
        ],
        answer: 2,
        explain:
          'The two activities answer different questions: the audit confirms that documented controls exist and are followed, whereas the penetration test attempts real exploitation and can expose gaps that no standard enumerates. Calling the audit fraudulent is the tempting distractor because the outcomes look contradictory, but compliance has never guaranteed resistance to a determined attacker, and both results can be accurate at the same time.',
      },
    },
    { t: 'h', text: 'Penetration testing: lo que una auditoría no puede demostrar' },
    {
      t: 'p',
      md: 'Un **penetration test** es un intento **autorizado** de vulnerar los controles para demostrar qué es realmente explotable, y su documento fundacional son las **rules of engagement**: alcance, sistemas incluidos y excluidos, ventana horaria, técnicas permitidas, contactos de emergencia y autorización escrita de quien puede darla. Sin ese papel no es una prueba, es un delito. CompTIA nombra cuatro modalidades. El **physical** penetration test ataca las barreras del mundo real: tailgating detrás de un estibador, clonado de una tarjeta de proximidad, apertura de una cerradura, un chaleco reflectante y una carpeta para entrar en la sala de control de la terminal. El **offensive** es el clásico **red team**: un equipo que simula a un adversario real persiguiendo un objetivo concreto —llegar al sistema de manifiestos— con la libertad de encadenar los caminos que encuentre. El **defensive** pone a prueba al **blue team**: la telemetría, las reglas de detección, los tiempos de respuesta y el proceso; lo que se evalúa no es si el atacante entra, sino si el equipo lo ve y reacciona. Y el **integrated** es el **purple team**, que no es un tercer equipo sino una forma de trabajar: ofensiva y defensa en la misma sala y en el mismo canal, lanzando cada técnica, comprobando al momento si generó telemetría y creando o afinando la regla antes de pasar a la siguiente. El purple team es el que más aprendizaje produce por hora invertida; el red team puro es el que mejor mide tu realidad, porque nadie te avisa.',
    },
    {
      t: 'table',
      headers: ['Modalidad', 'Qué simula', 'Qué demuestra'],
      rows: [
        [
          'Physical',
          'Un intruso que entra por la puerta: tailgating, tarjeta clonada, cerradura forzada',
          'Si las barreras, el control de accesos y el personal de recepción resisten a una persona decidida',
        ],
        [
          'Offensive (red team)',
          'Un adversario real que persigue un objetivo sin avisar a nadie',
          'Si las defensas se pueden romper de verdad y por qué camino concreto',
        ],
        [
          'Defensive (blue team)',
          'La capacidad de detectar, analizar y contener mientras ocurre',
          'Si la telemetría, las reglas y el proceso de respuesta funcionan bajo presión',
        ],
        [
          'Integrated (purple team)',
          'Ataque y defensa colaborando en el mismo canal, técnica a técnica',
          'Dónde falta visibilidad y qué regla nueva hace falta, con mejora inmediata',
        ],
        [
          'Known environment (white box)',
          'A alguien con conocimiento interno completo, o una revisión en profundidad',
          'Cobertura máxima por hora invertida; encuentra fallos profundos en el tiempo disponible',
        ],
        [
          'Partially known (grey box)',
          'A un usuario con acceso limitado, un socio o un contratista',
          'Un equilibrio realista entre coste, cobertura y verosimilitud del escenario',
        ],
        [
          'Unknown environment (black box)',
          'A un atacante externo que no sabe nada de ti al empezar',
          'Cuánto se puede descubrir y explotar desde fuera; lo más realista y lo más caro en tiempo',
        ],
      ],
    },
    { t: 'h', text: 'Conocimiento del entorno y reconnaissance' },
    {
      t: 'p',
      md: 'Antes de contratar la prueba hay que decidir **cuánta información se entrega**. En el **known environment** —el clásico *white box*— el equipo recibe diagramas de red, código fuente, credenciales de prueba y documentación: no pierde tiempo descubriendo y dedica cada hora a buscar fallos, así que da la **cobertura máxima** por euro invertido, aunque no reproduce la experiencia de un atacante externo. En el **partially known environment** —*grey box*— se entrega información parcial, típicamente credenciales de usuario estándar o un esquema de alto nivel: es el escenario del empleado descontento, del contratista o del socio conectado, y suele ser el mejor equilibrio. En el **unknown environment** —*black box*— el equipo empieza sin nada, exactamente como un adversario externo; es el más realista y el que mejor pone a prueba también a la detección, pero **cuesta mucho más tiempo** porque una parte grande del presupuesto se consume simplemente en descubrir el terreno, y por eso puede dejar zonas sin examinar. Ese trabajo de descubrimiento es la **reconnaissance**, y se divide en dos según la huella que deja. La **passive reconnaissance** solo usa fuentes públicas y terceros: registros WHOIS y DNS, logs de transparencia de certificados, ofertas de empleo que revelan qué tecnología se usa, perfiles profesionales, documentos publicados con metadatos, buscadores de dispositivos expuestos. Nunca se toca el sistema del objetivo, así que **no aparece nada en sus registros** y no hay forma de detectarla. La **active reconnaissance** sí interactúa: barridos de puertos, banner grabbing, consultas de versión, intentos de transferencia de zona, escaneo de vulnerabilidades. Da información mucho más precisa y actual, pero es **visible en los logs** del objetivo, puede disparar el IDS/IPS y hasta tumbar un sistema frágil, y por eso solo se ejecuta dentro de la ventana y el alcance autorizados.',
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen: los cinco reflejos del 5.5',
      md: 'Uno: **attestation = declaración formal y firmada** de que algo es cierto; el **acknowledgement** es la firma individual de haber leído una política. Dos: si el escenario necesita convencer a un cliente, a una aseguradora o a un regulador, la palabra clave es **independent**; un self-assessment no convence a nadie de fuera, y sin **right-to-audit clause** firmada no puedes auditar a un proveedor. Tres: la **auditoría comprueba el cumplimiento de un estándar**, el **penetration test comprueba si se puede romper**; aprobar una no predice el resultado de la otra. Cuatro: **known = white box** (máxima cobertura, poco realismo), **partially known = grey box** (el insider o el socio), **unknown = black box** (simula al externo, el más realista, el que **más tiempo y dinero consume**); si el enunciado prioriza cobertura o presupuesto ajustado, no es black box. Cinco: **passive recon no deja rastro** en los registros del objetivo porque solo consulta fuentes públicas; **active recon escanea y se ve**. Y ojo con los colores: ofensivo = **red**, defensivo = **blue**, integrado = **purple**.',
    },
    {
      t: 'check',
      q: {
        q: 'Before any scanning begins, a tester gathers information about the Halden Port Authority from WHOIS records, certificate transparency logs, published job adverts, and staff profiles on professional networks. Which activity is this, and what is its defining property?',
        choices: [
          'Active reconnaissance, because the tester is collecting technical details about the target',
          'Passive reconnaissance, because it uses public sources and leaves no trace in the target logs',
          'A vulnerability scan, because it enumerates the technologies in use',
          'Physical penetration testing, because it profiles the staff of the organization',
        ],
        answer: 1,
        explain:
          'Consulting third-party and public sources never touches the target systems, so nothing is recorded in its logs and the activity cannot be detected, which is the defining property of passive reconnaissance. Active reconnaissance is the tempting distractor because both phases gather technical detail about the same target, but active work means scanning and probing the target directly, and that always appears in its logs.',
      },
    },
    {
      t: 'p',
      md: 'Ya tienes las dos formas de comprobar que el programa es real: la auditoría, que verifica el cumplimiento con independencia, y la prueba ofensiva, que verifica la resistencia con hechos. Fíjate en un patrón que se repite en casi todos los informes de red team del mundo: el primer punto de apoyo del atacante rara vez es un servidor sin parchear, y casi siempre es una persona que hizo clic, que sostuvo una puerta abierta o que enchufó un USB encontrado en el aparcamiento. Esa es la última pieza del dominio y de todo el temario: el objetivo 5.6, el **security awareness**, donde el control no se instala en un servidor sino que se construye en la plantilla.',
    },
  ],
  quiz: [
    {
      id: 'sp5m7q1',
      domain: 'Security Program Management & Oversight',
      prompt:
        'Which option BEST defines an attestation in the context of security program oversight?',
      choices: [
        'An automated report generated by the vulnerability management platform',
        'A contractual clause allowing a customer to inspect a supplier facility',
        'A formal, signed statement asserting that something is true, made by a party who takes responsibility for the assertion',
        'A record of the training courses completed by each employee',
      ],
      answer: 2,
      explain:
        'An attestation is a formal declaration, signed and dated, in which the issuer takes responsibility for asserting that a condition or set of controls is as described. The right-to-audit clause is the tempting distractor because both appear in supplier assurance, but a clause grants a permission to inspect, whereas the attestation is the statement produced about the result.',
    },
    {
      id: 'sp5m7q2',
      domain: 'Security Program Management & Oversight',
      prompt:
        'The board of the Halden Port Authority wants an assurance report that its insurers and largest customers will accept without performing their own review. Which characteristic of the audit matters MOST?',
      choices: [
        'The independence of the auditing party from the organization and its controls',
        'The number of controls listed in the scope of the report',
        'The speed with which the report can be produced',
        'The seniority of the internal manager who signs the report',
      ],
      answer: 0,
      explain:
        'External parties accept a report because the auditor has no stake in the outcome, so independence is what gives the result its weight and makes second-hand trust possible. A large control scope is the tempting distractor because breadth does add value, but an exhaustive review performed by the same people who built and run the controls still convinces nobody outside the organization.',
    },
    {
      id: 'sp5m7q3',
      domain: 'Security Program Management & Oversight',
      prompt:
        'The port authority wants a penetration test that reproduces, as closely as possible, what an external attacker with no prior information could achieve against its internet-facing systems. Which engagement type fits, and what is the main trade-off?',
      choices: [
        'Known environment, and the trade-off is that it cannot detect configuration errors',
        'Partially known environment, and the trade-off is that no reconnaissance is possible',
        'Known environment, and the trade-off is that the testers may miss the newest systems',
        'Unknown environment, and the trade-off is that more time and budget are consumed on discovery',
      ],
      answer: 3,
      explain:
        'An unknown environment test, also called black box, starts with no inside information and therefore mirrors an outsider, but a large share of the effort goes into discovery before any exploitation begins. The known environment option is the tempting distractor because full information genuinely produces the deepest coverage per hour, yet handing over diagrams and credentials is precisely what an external attacker does not have.',
    },
    {
      id: 'sp5m7q4',
      domain: 'Security Program Management & Oversight',
      prompt:
        'During an authorized engagement, a tester runs a port scan and banner grabbing against the port authority public address range. How should the SOC expect this activity to appear?',
      choices: [
        'It will be invisible, because reconnaissance never touches the target',
        'It is active reconnaissance and will be visible in firewall, IDS, and server logs',
        'It is passive reconnaissance and only the intermediary services will record it',
        'It will only be visible if the systems being scanned are unpatched',
      ],
      answer: 1,
      explain:
        'Scanning and probing interact directly with the target, so the connection attempts and banner requests are recorded by the perimeter and host logging and can trigger detection rules. Calling it passive is the tempting distractor because both types belong to the same reconnaissance phase, but passive work is limited to public and third-party sources and leaves nothing at all in the target logs.',
    },
    {
      id: 'sp5m7q5',
      domain: 'Security Program Management & Oversight',
      prompt:
        'Which activity is designed to prove whether an attacker could actually reach the terminal management network, rather than to confirm that documented controls follow the required standard?',
      choices: [
        'A regulatory examination by the national maritime authority',
        'An internal compliance audit reported to the audit committee',
        'A penetration test conducted under agreed rules of engagement',
        'A management attestation submitted to the board',
      ],
      answer: 2,
      explain:
        'A penetration test attempts real exploitation within an authorized scope, so it demonstrates whether the defences can be broken and by which path. The internal compliance audit is the tempting distractor because it also examines the same controls in depth, but it verifies conformity with a standard through evidence and sampling rather than testing exploitability.',
    },
    {
      id: 'sp5m7q6',
      domain: 'Security Program Management & Oversight',
      prompt:
        'An offensive team and the SOC work side by side for a week: each technique is executed, the defenders check immediately whether it produced telemetry, and a detection rule is written or tuned before moving on. What is this called?',
      choices: [
        'Integrated, or purple team, testing',
        'Offensive, or red team, testing',
        'Defensive, or blue team, testing',
        'A physical penetration test',
      ],
      answer: 0,
      explain:
        'Integrated testing, commonly called purple teaming, deliberately joins the offensive and defensive sides in the same channel so that every executed technique immediately improves detection. Pure red teaming is the tempting distractor because the same offensive techniques are used, but a red team engagement is deliberately unannounced and adversarial, and the learning arrives only in the final report.',
    },
    {
      id: 'sp5m7q7',
      domain: 'Security Program Management & Oversight',
      prompt:
        'A security manager has a limited budget and wants the deepest possible review of a new cargo booking application, accepting that the exercise will not mimic an outsider. Which engagement should she request?',
      choices: [
        'An unknown environment test, so the team discovers the application as an attacker would',
        'A physical penetration test of the data centre hosting the application',
        'A passive reconnaissance exercise against the application domain',
        'A known environment test, providing architecture documents, source code, and test credentials',
      ],
      answer: 3,
      explain:
        'Known environment testing removes the discovery phase, so every available hour goes into finding flaws, which delivers the greatest depth of coverage for a constrained budget. The unknown environment option is the tempting distractor because it is the more realistic simulation, but realism is exactly what the manager has chosen to trade away, and discovery would consume much of the limited time.',
    },
    {
      id: 'sp5m7q8',
      domain: 'Security Program Management & Oversight',
      prompt:
        'Each quarter, the port IT team completes a control checklist about its own area and files the result. A customer rejects this document as assurance evidence. Why is the customer correct?',
      choices: [
        'Because checklists are never accepted as an assessment technique',
        'Because a self-assessment lacks independence, so it cannot provide assurance to an external party',
        'Because the assessment was performed quarterly rather than annually',
        'Because only penetration tests can be shared with customers',
      ],
      answer: 1,
      explain:
        'A self-assessment is performed by the same people responsible for the controls, so however honest it is, it provides no independent verification and outside parties cannot rely on it. Rejecting checklists altogether is the tempting distractor because the format looks informal, but independent audits also use structured checklists, and the decisive defect here is who completed it, not the instrument.',
    },
  ],
};

// ---------------------------------------------------------------------------
// SP5M8 — Concienciación: programa, phishing y comportamiento anómalo
// (SY0-701, objetivo 5.6)
// ---------------------------------------------------------------------------
const sp5m8: Module = {
  id: 'sp5m8',
  sectionId: 'sp5',
  title: 'Concienciación: programa, phishing y comportamiento anómalo',
  minutes: 12,
  objectives: [
    'Diseñar campañas de phishing simulado que enseñen en lugar de castigar, y montar el circuito de reporte, triaje y respuesta a quien reporta',
    'Clasificar el comportamiento anómalo en risky, unexpected y unintentional, y elegir la respuesta adecuada a cada categoría',
    'Cubrir los temas de user guidance and training del objetivo: policy/handbooks, situational awareness, insider threat, password management, removable media and cables, social engineering, OPSEC y hybrid/remote work',
    'Construir el programa de concienciación de principio a fin: development, execution, reporting and monitoring, y revisión',
    'Medir el programa con la métrica correcta —el report rate— y sostenerlo como control recurrente, no como un trámite de onboarding',
  ],
  blocks: [
    {
      t: 'p',
      md: 'Llegas al último objetivo del temario y no es casualidad que sea este. Todos los informes de red team que leerás en tu carrera terminan describiendo el mismo primer paso: no una vulnerabilidad exótica, sino una persona que hizo clic en un enlace, que sostuvo la puerta a alguien con chaleco reflectante o que enchufó un USB encontrado en el aparcamiento de la terminal. El **security awareness** es el control que se instala en las personas, y CompTIA lo examina como un **programa** con ciclo de vida —se desarrolla, se ejecuta, se mide y se revisa—, no como un vídeo anual. La idea que tienes que llevarte por encima de todas: la plantilla de la Autoridad Portuaria de Halden no es tu eslabón más débil, es tu red de sensores más grande. Trescientas personas mirando el correo son trescientos detectores que ninguna herramienta puede sustituir, siempre que se les enseñe a reconocer y, sobre todo, que se les haga fácil y seguro avisar.',
    },
    { t: 'h', text: 'Phishing: campañas, reconocimiento y respuesta a lo reportado' },
    {
      t: 'p',
      md: 'Las **phishing campaigns** son simulaciones controladas: se envía a la plantilla un correo señuelo realista para medir cuánta gente pica, cuánta reporta y cuánto tarda en hacerlo, y para enseñar en el momento exacto en que la lección se entiende mejor. Una campaña bien hecha se autoriza por escrito, sube la dificultad de forma progresiva y evita los señuelos crueles —falsas nóminas, avisos de despido, resultados médicos—, porque el objetivo es entrenar, no humillar ni generar una crisis de confianza. **Recognizing a phishing attempt** es el temario práctico: remitente que no coincide con el dominio real, urgencia artificial y amenaza de consecuencia inmediata, saludo genérico, enlaces cuyo destino real no coincide con el texto, adjuntos inesperados, peticiones de credenciales o de MFA, y sobre todo el patrón que importa en un puerto: cualquier petición **fuera de proceso** de cambiar una cuenta bancaria, liberar un contenedor o dar acceso urgente. La regla que hay que grabar es de verificación, no de vista: ante una petición sensible, se confirma por un **canal distinto** y conocido de antemano. Y la parte que casi todo el mundo descuida es **responding to reported suspicious messages**. El circuito completo es reportar, **triar**, actuar sobre el resto de buzones si el mensaje era real y —esto es lo decisivo— **volver a la persona** con un veredicto en horas, aunque sea un falso positivo, con un simple «gracias, lo hemos revisado, era legítimo, sigue avisando». Sin ese retorno el reporte se seca en semanas: la gente deja de avisar porque cree que su aviso cae en el vacío.',
    },
    {
      t: 'check',
      q: {
        q: 'After a simulated phishing campaign, a manager proposes publishing the names of everyone who clicked and issuing formal warnings to repeat clickers. Why should the security team object?',
        choices: [
          'Because simulated phishing results are legally privileged and cannot be shared internally',
          'Because punishing clickers suppresses reporting, and the report rate is the metric the programme needs to raise',
          'Because click rate is not affected by any form of training',
          'Because only the IT department should receive awareness training results',
        ],
        answer: 1,
        explain:
          'Naming and punishing people who click teaches them to hide mistakes, so genuine incidents stop being reported and the organization loses its earliest warning; the programme goal is to raise the report rate, which depends entirely on people feeling safe to speak. Claiming that training cannot influence click rate is the tempting distractor because click rate is indeed a noisy metric, but well-designed campaigns with immediate coaching do reduce it over time.',
      },
    },
    { t: 'h', text: 'Comportamiento anómalo: risky, unexpected y unintentional' },
    {
      t: 'p',
      md: 'El objetivo pide **anomalous behavior recognition** en tres categorías, y la clave para distinguirlas es la **intención** de la persona. El **risky behavior** es la conducta que la persona sabe que es un atajo y hace igual porque le resulta más cómoda: compartir la contraseña con una compañera para cubrir un turno, desactivar el agente de seguridad porque «ralentiza el equipo», reenviar documentos de trabajo al correo personal, conectar un USB propio a la consola de la terminal, apuntar credenciales en un pósit bajo el teclado. Hay conocimiento y hay decisión. El **unexpected behavior** es el que no encaja con el patrón normal de esa persona o de ese rol, y es el territorio del UEBA: la cuenta de una administrativa que se autentica a las tres de la mañana desde otro país, la descarga masiva del repositorio de manifiestos por alguien que suele abrir tres ficheros al día, un usuario que de pronto consulta sistemas de un departamento que no es el suyo. No implica culpa —puede ser una cuenta robada, que es justo lo que hay que descubrir—, implica que hay que investigar. Y el **unintentional behavior** es el error honesto de quien creía estar haciendo lo correcto: enviar el manifiesto de carga a un destinatario equivocado por el autocompletado, publicar un documento en una carpeta compartida con permisos abiertos, caer en un pretexto muy bien construido. La respuesta a cada categoría es distinta y el examen lo premia: la conducta arriesgada se corrige con política, controles técnicos que impidan el atajo y consecuencias proporcionadas; la inesperada se **investiga** antes de acusar; la no intencionada se previene con diseño —controles que hagan difícil equivocarse— y con formación, nunca con castigo.',
    },
    {
      t: 'check',
      q: {
        q: 'A port administrator has worked office hours from Halden for six years. Overnight, her account authenticates from another country and downloads the entire cargo manifest archive. How should this be classified and handled?',
        choices: [
          'Unintentional behaviour: schedule refresher training for the administrator',
          'Risky behaviour: issue a formal warning for working outside approved hours',
          'Unexpected behaviour: investigate, because the activity does not match the established baseline for that account',
          'Normal behaviour: remote access is permitted by policy, so no action is required',
        ],
        answer: 2,
        explain:
          'Activity that departs sharply from the established pattern for a user is unexpected behaviour, and the correct first response is investigation, since a stolen credential is at least as likely as a genuine change in habits. Treating it as risky behaviour is the tempting distractor because a disciplinary reflex feels decisive, but punishing the account owner before establishing whether she was even at the keyboard would both miss a probable compromise and damage trust.',
      },
    },
    { t: 'h', text: 'User guidance and training: los temas que nombra el objetivo' },
    {
      t: 'p',
      md: 'CompTIA lista los contenidos y conviene reconocerlos uno a uno. **Policy y handbooks** es la base formal: la analista sabe qué se espera de ella y firma el **acknowledgement** correspondiente. La **situational awareness** es la capacidad de notar que algo no encaja —una persona sin acreditación en la sala de servidores, una petición que rompe el proceso habitual— y actuar en consecuencia. El **insider threat** se enseña en dos direcciones: reconocer indicadores en el entorno y saber que existe un canal de denuncia seguro. El **password management** cubre gestor de contraseñas, contraseñas largas y únicas, no reutilizar, MFA y, muy importante hoy, no aprobar nunca una notificación que no has iniciado tú. **Removable media and cables** es un tema con un peso especial en un entorno industrial: el USB encontrado en el aparcamiento, el cable de carga «prestado» que puede ser un implante, el disco personal que se conecta a una consola de grúa. La **social engineering** repasa phishing, vishing, smishing, pretexting, tailgating y baiting, siempre con la misma defensa central: verificar por un canal independiente. La **operational security (OPSEC)** enseña a no regalar información útil —qué se publica en redes, qué revela una oferta de empleo, qué se comenta en un bar del puerto, qué metadatos lleva un documento antes de subirlo—. Y el **hybrid/remote work** aterriza todo lo anterior fuera de la oficina: VPN, red doméstica, pantallas visibles en un tren, dispositivos compartidos con la familia, documentos impresos en casa. El formato importa tanto como el contenido: piezas breves, en el idioma de la persona, con ejemplos de su trabajo real y no de un catálogo genérico.',
    },
    {
      t: 'table',
      headers: ['Audiencia en el puerto', 'Riesgo dominante', 'Foco de la formación'],
      rows: [
        [
          'Personal de operaciones de terminal y puerta de acceso',
          'Tailgating, USB encontrados, pretextos por radio o en persona',
          'Removable media and cables, seguridad física, verificar identidad antes de dar paso',
        ],
        [
          'Administración y finanzas',
          'Business email compromise: facturas falsas y cambios de cuenta bancaria urgentes',
          'Reconocer el pretexto, verificación fuera de banda obligatoria antes de tocar datos de pago',
        ],
        [
          'TI y administradores de sistemas',
          'Phishing dirigido a credenciales privilegiadas y fatiga de notificaciones MFA',
          'Password management, credenciales privilegiadas, nunca aprobar un MFA que no has iniciado',
        ],
        [
          'Dirección y consejo',
          'Whaling, exposición pública, información filtrada en viajes y eventos',
          'Situational awareness y OPSEC: qué no se publica sobre proyectos, rutas y calendarios',
        ],
        [
          'Personal remoto e híbrido',
          'Redes domésticas y públicas, shoulder surfing, equipos compartidos en casa',
          'Hybrid/remote work: VPN, bloqueo de pantalla, separación del equipo personal',
        ],
        [
          'Personal con acceso a datos sensibles o en proceso de salida',
          'Insider threat y exfiltración en las semanas previas a la baja',
          'Insider threat, canales de denuncia, qué se monitoriza y con qué base legal',
        ],
        [
          'Personal de nueva incorporación',
          'Desconoce la política, los procesos y a quién avisar',
          'Policy y handbooks en el onboarding, con acknowledgement firmado y ruta de reporte',
        ],
      ],
    },
    { t: 'h', text: 'El programa completo: development, execution, reporting and monitoring' },
    {
      t: 'list',
      ordered: true,
      items: [
        '**Partir del riesgo real, no de un catálogo**: los incidentes propios del puerto, los hallazgos de auditoría, lo que encontró el último penetration test y la inteligencia sobre quién ataca a operadores portuarios.',
        '**Conseguir mandato y presupuesto** (development): una política de concienciación aprobada por dirección que fije obligatoriedad, frecuencia, audiencias y consecuencias proporcionadas.',
        '**Segmentar la audiencia por riesgo** y fijar objetivos medibles por grupo; la misma formación para la grúa, para finanzas y para el consejo no sirve a ninguno de los tres.',
        '**Desarrollar el contenido**: piezas cortas, en el idioma de la persona, ancladas a su trabajo, que incluyan los policy handbooks y dejen clarísima la ruta de reporte.',
        '**Ejecutar la formación inicial en el onboarding**, antes de conceder los accesos, y registrar el **acknowledgement** firmado como evidencia para la próxima auditoría.',
        '**Lanzar campañas de phishing simulado** autorizadas por escrito, con dificultad creciente y sin señuelos crueles, midiendo clic, reporte y tiempo hasta el primer aviso.',
        '**Hacer trivial el reporte**: un botón en el cliente de correo, un buzón único, un teléfono para lo urgente y una única instrucción memorizable —ante la duda, reporta.',
        '**Cerrar el bucle con quien reporta**: triaje, veredicto y respuesta personal en horas, aunque sea un falso positivo; sin retorno, el canal de reporte se apaga solo.',
        '**Convertir el clic en enseñanza inmediata y sin castigo**: microformación en el momento, jamás una lista pública de nombres.',
        '**Medir lo que importa** (reporting and monitoring): **report rate** subiendo, click rate bajando, tiempo hasta el primer reporte y cobertura de la formación, con informe periódico a dirección y al comité.',
        '**Repetir de forma recurrente** y variar el temario a lo largo del año: la formación **initial** del alta se completa con la **recurring**, porque un control que se ejecuta una vez no es un control.',
        '**Revisar el programa** con cada incidente, hallazgo o cambio del entorno, retirando el contenido que ya no corresponde al riesgo y añadiendo el que sí.',
      ],
    },
    {
      t: 'p',
      md: 'Sobre las métricas conviene ser explícita, porque es donde más programas se estropean. El **click rate** es la métrica intuitiva y la que la dirección pide, pero es ruidosa —depende muchísimo de lo bueno que sea el señuelo— y sobre todo es la que empuja al castigo. La métrica que de verdad predice si vas a enterarte de un ataque real es el **report rate**: qué porcentaje de la plantilla avisa, y en cuánto tiempo. Un puerto donde el 45 % reporta el señuelo en los primeros diez minutos detecta una campaña real antes que cualquier sandbox. Añade la **cobertura** de la formación y la **repetición**: CompTIA distingue el **reporting and monitoring inicial** —la línea base y el registro de quién ha hecho qué al incorporarse— del **recurrente**, que es el que mantiene vivo el programa y alimenta las revisiones. Y guarda esta frase para el examen: la concienciación es un **control recurrente**, con dueño, calendario y evidencia, no un trámite que se firma el primer día y se olvida.',
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen: los cuatro reflejos del 5.6',
      md: 'Uno: la métrica que hay que **subir** es el **report rate**; si una opción propone publicar nombres, sancionar o avergonzar a quien pica, es incorrecta, porque destruye la cultura de reporte y con ella tu detección temprana. Dos: la formación de concienciación es **recurrente**, no un acto único del onboarding; el **initial** establece la base y el **recurring** la sostiene. Tres: clasifica por intención —**risky** es el atajo consciente (compartir contraseña, desactivar el agente, USB propio), **unexpected** es lo que no encaja con la línea base y se **investiga** antes de acusar, **unintentional** es el error honesto que se previene con diseño y formación—. Cuatro: ante una petición sensible que llega por correo, teléfono o radio, la respuesta correcta siempre es **verificar por un canal independiente** conocido de antemano, nunca responder al mismo hilo; y responder a quien reporta, aunque sea un falso positivo, forma parte del control.',
    },
    {
      t: 'check',
      q: {
        q: 'The Halden Port Authority delivers a single security awareness session during onboarding and never repeats it. An auditor raises a finding. What is the BEST justification for the finding?',
        choices: [
          'Awareness training must always be delivered by an external provider to be valid',
          'Onboarding is the wrong moment to deliver any security content',
          'A single session cannot be evidenced, because acknowledgements are not auditable records',
          'Awareness is a recurring control: threats, staff, and systems change, so training must repeat and be measured over time',
        ],
        answer: 3,
        explain:
          'The objective treats awareness as a programme with initial and recurring elements, because techniques evolve, people change roles and a one-off message decays within months, so the control only exists if it repeats and is measured. Claiming that onboarding is the wrong moment is the tempting distractor because the finding does concern timing, but initial training before access is granted is good practice; the defect is that nothing follows it.',
      },
    },
    {
      t: 'p',
      md: 'Y con esto cierras los **cinco dominios** del SY0-701, analista. Has recorrido los conceptos generales, las amenazas y sus mitigaciones, la arquitectura, las operaciones de seguridad y, ahora, la gestión y supervisión del programa: el mismo recorrido que hace una profesional real desde que entiende un control hasta que responde de él ante un consejo. Enhorabuena, la Autoridad Portuaria de Halden ya tiene un programa completo y tú tienes el temario entero en la cabeza. Lo que viene ahora no es contenido nuevo, es puntería: la sección de **preparación del examen** (`sp6`) te explica el formato real —hasta 90 preguntas en 90 minutos, escala de 100 a 900 con corte en 750—, cómo gestionar las **PBQs** marcándolas y volviendo a ellas al final, y cómo leer los enunciados para detectar el «MOST», el «FIRST» y el «BEST» que deciden la respuesta. A partir de aquí tu plan es sencillo y no negociable: mantén las **flashcards** al día todos los días, aunque sean diez minutos, porque el repaso espaciado es lo que impide que el Dominio 1 se te caiga mientras pules el 5; y encadena **simulacros completos de 90 preguntas cronometrados**, revisando después cada fallo hasta entender por qué el distractor era tentador. Cuando tres simulacros seguidos te salgan por encima del **83 %** y ninguno de los cinco dominios se quede rezagado, no estás lista para aprobar: estás lista para aprobar con margen. Nos vemos en el simulacro.',
    },
  ],
  quiz: [
    {
      id: 'sp5m8q1',
      domain: 'Security Program Management & Oversight',
      prompt:
        'Which metric BEST indicates that a security awareness programme is improving the organization ability to detect real attacks?',
      choices: [
        'The number of awareness videos published during the year',
        'The percentage of employees who report a suspicious message, and how quickly they do it',
        'The number of employees disciplined for clicking a simulated phishing link',
        'The average score achieved on the end-of-course quiz',
      ],
      answer: 1,
      explain:
        'The report rate, together with time to first report, measures the outcome that actually matters: whether people raise the alarm early enough for the security team to act on a live campaign. Disciplinary counts are the tempting distractor because they look like accountability, but punishment teaches people to conceal mistakes and drives the report rate down.',
    },
    {
      id: 'sp5m8q2',
      domain: 'Security Program Management & Oversight',
      prompt:
        'A company delivers security awareness training only once, as part of employee onboarding. Which weakness does this design have?',
      choices: [
        'It cannot generate an acknowledgement record for compliance purposes',
        'It prevents the organization from running simulated phishing campaigns',
        'It exposes the organization to legal liability for the content of the training',
        'It treats awareness as a one-time event, so knowledge decays and new techniques and role changes are never covered',
      ],
      answer: 3,
      explain:
        'Awareness is a recurring control: attacker techniques evolve, staff change roles and retention drops sharply after a few months, so the programme must repeat and be measured throughout the year. The acknowledgement point is the tempting distractor because signed acknowledgements are indeed part of the programme, but a single session can produce one perfectly well, and the real defect is the absence of recurring training.',
    },
    {
      id: 'sp5m8q3',
      domain: 'Security Program Management & Oversight',
      prompt:
        'A clerk types the first letters of a recipient name, the mail client autocompletes a different address, and the cargo manifest is sent to an external company by mistake. How is this behaviour BEST classified?',
      choices: [
        'Unintentional behaviour',
        'Risky behaviour',
        'Unexpected behaviour',
        'Insider threat activity',
      ],
      answer: 0,
      explain:
        'The clerk believed she was following the correct process and gained nothing from the error, which is the definition of unintentional behaviour and points to design and training fixes such as external recipient warnings. Risky behaviour is the tempting distractor because the consequence is serious, but risky behaviour requires a conscious shortcut, and here there was no decision to bypass anything.',
    },
    {
      id: 'sp5m8q4',
      domain: 'Security Program Management & Oversight',
      prompt:
        'What is the primary purpose of running simulated phishing campaigns against employees?',
      choices: [
        'To identify employees who should be denied email access',
        'To satisfy a regulator that no phishing message can reach the organization',
        'To measure susceptibility and reporting behaviour and to deliver targeted teaching at the moment of the mistake',
        'To replace the technical email filtering controls with a human control',
      ],
      answer: 2,
      explain:
        'A campaign provides both measurement, in click and report rates, and the most effective teaching moment there is, immediately after someone takes the bait in a safe environment. Replacing technical filtering is the tempting distractor because awareness genuinely is a layer of defence, but human vigilance complements gateway filtering and sandboxing rather than substituting for them.',
    },
    {
      id: 'sp5m8q5',
      domain: 'Security Program Management & Oversight',
      prompt:
        'Employees at the Halden Port Authority report suspicious messages to a shared mailbox, but reporting volume has fallen by half in six months. Investigation shows reporters never hear anything back. What should the SOC change FIRST?',
      choices: [
        'Make reporting mandatory and audit who has failed to report',
        'Close the loop by triaging reports and sending each reporter a verdict quickly, even when the message was legitimate',
        'Stop the simulated phishing campaigns until reporting volume recovers',
        'Move the reporting mailbox to a different mail platform',
      ],
      answer: 1,
      explain:
        'Reporting is voluntary behaviour sustained by feedback, so acknowledging every report with a fast verdict, including the false positives, is what keeps people using the channel. Making reporting mandatory is the tempting distractor because it appears to address the volume directly, but compulsion without feedback produces careless reports and resentment rather than genuine vigilance.',
    },
    {
      id: 'sp5m8q6',
      domain: 'Security Program Management & Oversight',
      prompt:
        'A crane operator finds a USB drive in the terminal car park and plugs it into an operations console to see who owns it. Which behaviour category and training topic does this MOST directly illustrate?',
      choices: [
        'Unexpected behaviour, addressed through user and entity behaviour analytics',
        'Unintentional behaviour, addressed through password management training',
        'Insider threat, addressed through a confidential reporting channel',
        'Risky behaviour, addressed through removable media and cables guidance',
      ],
      answer: 3,
      explain:
        'Connecting unknown removable media to an operational console is a conscious shortcut with a known hazard, which makes it risky behaviour, and the objective covers it under removable media and cables. Unintentional behaviour is the tempting distractor because the operator meant well and intended no harm, but good intentions do not change the fact that a deliberate, avoidable action was taken.',
    },
    {
      id: 'sp5m8q7',
      domain: 'Security Program Management & Oversight',
      prompt:
        'The port authority wants to reduce how much useful information an attacker can gather about its operations from job adverts, social media posts, conference talks, and document metadata. Which awareness topic addresses this?',
      choices: [
        'Operational security, teaching staff which details should not be disclosed publicly',
        'Password management, teaching staff to use a password manager',
        'Hybrid and remote work, teaching staff to connect through the VPN',
        'Policy and handbooks, teaching staff to sign the acceptable use policy',
      ],
      answer: 0,
      explain:
        'Operational security is precisely the discipline of controlling what an adversary can learn from openly available information, which covers adverts, posts, talks and metadata. Policy and handbooks is the tempting distractor because the rules would indeed be written there, but signing a document does not build the day-to-day judgement about what is safe to publish, which is what OPSEC training develops.',
    },
  ],
};

export const SP5_PART4: Module[] = [sp5m7, sp5m8];
