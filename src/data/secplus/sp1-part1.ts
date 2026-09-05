import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// SP1M1 — Categorías y tipos de controles de seguridad (SY0-701, objetivo 1.1)
// ---------------------------------------------------------------------------
const sp1m1: Module = {
  id: 'sp1m1',
  sectionId: 'sp1',
  title: 'Categorías y tipos de controles de seguridad',
  minutes: 13,
  objectives: [
    'Distinguir las cuatro categorías de controles: technical, managerial, operational y physical',
    'Reconocer los seis tipos de control según su función: preventive, deterrent, detective, corrective, compensating y directive',
    'Clasificar un control real por categoría y por tipo a partir de un escenario',
    'Explicar cuándo un compensating control es la respuesta correcta',
    'Aplicar la regla de examen «lo que el control hace en ese escenario»',
  ],
  blocks: [
    {
      t: 'p',
      md: 'Un **security control** es cualquier medida —técnica, humana, administrativa o física— que reduce el riesgo sobre un activo. CompTIA organiza los controles en dos ejes independientes: la **categoría** (quién o qué lo implementa) y el **tipo** (qué efecto tiene sobre el evento). Como analista, tu primer reflejo ante cualquier control debe ser preguntarte por ambos ejes a la vez, porque el examen los mezcla en la misma pregunta.',
    },
    { t: 'h', text: 'Las cuatro categorías: quién implementa el control' },
    {
      t: 'table',
      headers: ['Categoría', 'Quién lo implementa', 'Ejemplos'],
      rows: [
        [
          'Technical',
          'Sistemas y software; funciona sin intervención humana continua',
          'Firewall, encryption, ACLs, IDS/IPS, MFA, EDR',
        ],
        [
          'Managerial',
          'La dirección, mediante decisiones administrativas y de gobierno',
          'Políticas de seguridad, risk assessments, diseño del programa de awareness, clasificación de datos',
        ],
        [
          'Operational',
          'Personas ejecutando procedimientos en el día a día',
          'Guardias de seguridad, impartir la formación, ejecutar backups, revisar logs, escoltar visitantes',
        ],
        [
          'Physical',
          'Barreras y dispositivos del mundo tangible',
          'Cerraduras, vallas, bollards, badges, CCTV, iluminación',
        ],
      ],
    },
    {
      t: 'callout',
      kind: 'tip',
      title: 'Managerial vs. operational: la trampa favorita',
      md: 'La frontera confunde porque ambas involucran personas. La regla práctica: si el control es **decidir, planificar o gobernar** (aprobar una política, planificar el programa de formación, evaluar riesgos) es **managerial**; si es **hacerlo** (dar la clase, revisar el log, ejecutar el backup, comprobar el badge) es **operational**. Un mismo tema —la formación— puede ser managerial en su diseño y operational en su ejecución.',
    },
    {
      t: 'check',
      q: {
        q: 'A security guard checks employee badges at the lobby every morning. Which control category does this BEST represent?',
        choices: ['Technical', 'Managerial', 'Operational', 'Physical'],
        answer: 2,
        explain:
          'A person performing a day-to-day security procedure is an operational control. The badge itself is physical and the badge policy is managerial, but the act of a human checking it is operational.',
      },
    },
    { t: 'h', text: 'Los seis tipos: qué hace el control con el evento' },
    {
      t: 'list',
      items: [
        '**Preventive** — impide que el evento ocurra: una regla de firewall, una cerradura, un bollard.',
        '**Deterrent** — desanima al atacante sin impedirlo físicamente: cartel de «zona vigilada», cámara visible, luz de seguridad.',
        '**Detective** — identifica el evento mientras ocurre o después: IDS, revisión de logs, visionado de CCTV tras un robo.',
        '**Corrective** — restaura la situación tras el incidente: restaurar desde backup, parchear después de un ataque, ejecutar el plan de respuesta.',
        '**Compensating** — alternativa que cubre el riesgo cuando el control principal no es viable: monitorización extra sobre un sistema que no se puede parchear.',
        '**Directive** — indica a las personas cómo deben comportarse: acceptable use policy, señal de «solo personal autorizado», procedimientos escritos.',
      ],
    },
    {
      t: 'table',
      headers: ['', 'Technical', 'Managerial', 'Operational', 'Physical'],
      rows: [
        [
          'Preventive',
          'Regla de firewall que bloquea Telnet',
          'Política de contratación con verificación de antecedentes',
          'Escolta obligatoria de visitantes',
          'Bollards, cerraduras, vestíbulo de acceso',
        ],
        [
          'Deterrent',
          'Banner de aviso legal en el login',
          'Política que anuncia sanciones disciplinarias',
          'Rondas visibles de guardias',
          'Cartel «área bajo vigilancia», cámara a la vista',
        ],
        [
          'Detective',
          'IDS, alertas del SIEM',
          'Auditorías periódicas planificadas',
          'Revisión del registro de accesos por un guardia',
          'Sensor de movimiento, revisión de CCTV',
        ],
        [
          'Corrective',
          'Parche aplicado tras el incidente, antivirus que pone en cuarentena',
          'Actualización de la política tras las lecciones aprendidas',
          'Restaurar los datos desde backup',
          'Extintor, generador de respaldo',
        ],
        [
          'Directive',
          'Pop-up que obliga a aceptar la AUP',
          'Acceptable use policy, política de clasificación',
          'Procedimiento documentado de apertura del CPD',
          'Señal «solo personal autorizado»',
        ],
      ],
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen',
      md: 'Un mismo control puede ser de **más de un tipo**: una cámara visible es *deterrent* (desanima) y *detective* (graba). El examen no te pregunta qué «es» el control en abstracto, sino **qué hace en ese escenario**. Lee el verbo de la pregunta: «discourage» → deterrent; «identify/discover» → detective; «stop/block» → preventive; «restore/recover» → corrective; «instruct/require behavior» → directive; «alternative because the primary is not feasible» → compensating.',
    },
    {
      t: 'check',
      q: {
        q: 'Concrete bollards are installed in front of a data center entrance to stop vehicles from ramming the doors. How should this control be classified?',
        choices: [
          'Physical / Deterrent',
          'Physical / Preventive',
          'Operational / Preventive',
          'Technical / Detective',
        ],
        answer: 1,
        explain:
          'A bollard is a tangible barrier (physical) whose function is to make the attack impossible, not merely discouraged (preventive). A deterrent only signals risk to the attacker; a bollard physically blocks the vehicle.',
      },
    },
    { t: 'h', text: 'Compensating controls: cuando lo ideal no es posible' },
    {
      t: 'p',
      md: 'El **compensating control** es el tipo que más cae en preguntas de escenario porque exige entender el *porqué*. Aparece cuando el control primario recomendado **no puede aplicarse** por razones técnicas, legales o de negocio, y la organización despliega una medida alternativa que reduce el mismo riesgo a un nivel aceptable. Dos condiciones definen el patrón: primero, existe una restricción real («el fabricante ya no publica parches», «el sistema no soporta MFA»); segundo, la alternativa cubre el **mismo riesgo** que cubriría el control ausente.',
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'Ejemplos de compensación',
      md: 'Un **PLC industrial** con firmware sin soporte no admite parches: se aísla en una VLAN dedicada con monitorización de red intensiva. Una aplicación heredada no permite contraseñas largas: se exige **MFA** y se limita el acceso por IP. Un pequeño despacho no puede pagar un guardia 24/7: instala cámaras con grabación y alarma conectada a una central. En todos los casos el control primario no es viable y la alternativa compensa el hueco.',
    },
    {
      t: 'check',
      q: {
        q: 'A hospital runs an imaging system whose vendor no longer provides security updates. The system cannot be replaced for two years. The security team places it on an isolated network segment with continuous traffic monitoring. Which control type BEST describes the segmentation and monitoring?',
        choices: ['Corrective', 'Directive', 'Compensating', 'Deterrent'],
        answer: 2,
        explain:
          'The primary control (patching) is not feasible, so an alternative measure reduces the same risk: that is the definition of a compensating control. It is not corrective because nothing is being restored after an incident.',
      },
    },
    {
      t: 'check',
      q: {
        q: 'Before users log in, a banner states: "This system is for authorized use only. Activity is monitored and violations will be prosecuted." Which TWO control types does the banner MOST directly represent?',
        choices: [
          'Preventive and corrective',
          'Deterrent and directive',
          'Detective and compensating',
          'Physical and technical',
        ],
        answer: 1,
        explain:
          'The banner instructs expected behavior (directive) and discourages misuse by warning about monitoring and prosecution (deterrent). It does not block the login (so not preventive) and it does not detect anything on its own.',
      },
    },
    {
      t: 'callout',
      kind: 'warn',
      title: 'Deterrent no es preventive',
      md: 'Un control **deterrent** depende de que el atacante decida no seguir; si ignora el aviso, nada le impide continuar. Un control **preventive** funciona aunque el atacante lo intente. Cuando el escenario dice que la medida «reduce la probabilidad de que alguien lo intente», es deterrent; si dice que «impide» o «bloquea», es preventive.',
    },
    {
      t: 'p',
      md: 'Con las categorías y los tipos claros ya puedes describir *qué* hace un control y *quién* lo opera. La siguiente lección responde a la pregunta previa: **qué propiedad de la información** estamos protegiendo con cada control — confidentiality, integrity, availability y non-repudiation — y cómo la triple **AAA** y el **gap analysis** te ayudan a decidir dónde faltan controles.',
    },
  ],
  quiz: [
    {
      id: 'sp1m1q1',
      domain: 'General Security Concepts',
      prompt:
        'A utility company operates a legacy SCADA controller that cannot be patched or replaced this year. The security team deploys network-based monitoring and strict segmentation around it. Which control type BEST describes these measures?',
      choices: ['Corrective', 'Directive', 'Compensating', 'Preventive'],
      answer: 2,
      explain:
        'Patching is the ideal control but is not feasible, so monitoring and segmentation are alternative measures that reduce the same risk: a compensating control. Preventive is tempting, but the defining feature of the scenario is that the primary control cannot be applied.',
    },
    {
      id: 'sp1m1q2',
      domain: 'General Security Concepts',
      prompt:
        'The CISO publishes a policy requiring every employee to complete security awareness training annually. Which control category does the policy itself belong to?',
      choices: ['Managerial', 'Operational', 'Technical', 'Physical'],
      answer: 0,
      explain:
        'A policy is an administrative decision by management, which makes it a managerial control. Operational is the tempting distractor because training involves people, but the delivery of the training would be operational; the requirement written as policy is managerial.',
    },
    {
      id: 'sp1m1q3',
      domain: 'General Security Concepts',
      prompt:
        'After a laptop disappears from an office, the facilities team reviews CCTV recordings and identifies the person who took it. In this scenario, the CCTV system functioned as which control type?',
      choices: ['Preventive', 'Deterrent', 'Corrective', 'Detective'],
      answer: 3,
      explain:
        'The footage was used to identify what happened after the event, which is the detective function. Deterrent is a common wrong answer because visible cameras also discourage theft, but the question describes what the control did in this scenario: discovering the culprit.',
    },
    {
      id: 'sp1m1q4',
      domain: 'General Security Concepts',
      prompt:
        'A warehouse manager places large signs reading "Area under 24-hour video surveillance" along the perimeter fence. Which control type is the manager MOST likely relying on?',
      choices: ['Detective', 'Deterrent', 'Compensating', 'Corrective'],
      answer: 1,
      explain:
        'The sign is meant to discourage intruders from attempting entry, which is a deterrent. Detective is the tempting distractor because the sign mentions surveillance, but a sign cannot detect anything by itself; it only influences the attacker\'s decision.',
    },
    {
      id: 'sp1m1q5',
      domain: 'General Security Concepts',
      prompt:
        'Ransomware encrypts a file server. The administrators wipe the server and restore the data from last night\'s backup. Which control type does the restore operation represent?',
      choices: ['Preventive', 'Detective', 'Corrective', 'Directive'],
      answer: 2,
      explain:
        'Restoring from backup returns the system to a working state after the incident, which is the corrective function. Preventive is wrong because the attack already succeeded; nothing was stopped, it was remediated.',
    },
    {
      id: 'sp1m1q6',
      domain: 'General Security Concepts',
      prompt:
        'A firewall access control list blocks all inbound Telnet traffic to the corporate network. Which control category does the ACL belong to?',
      choices: ['Technical', 'Managerial', 'Operational', 'Physical'],
      answer: 0,
      explain:
        'A rule enforced by a system without ongoing human action is a technical control. Operational is tempting because an administrator configured it, but the category is defined by what enforces the control day to day, and that is the firewall itself.',
    },
    {
      id: 'sp1m1q7',
      domain: 'General Security Concepts',
      prompt:
        'Which of the following is the BEST example of an operational control?',
      choices: [
        'A written data-retention policy approved by the board',
        'Full-disk encryption enabled on all laptops',
        'A fence with barbed wire around the fuel depot',
        'A night guard walking scheduled patrols and logging each round',
      ],
      answer: 3,
      explain:
        'A person executing a security procedure on a routine basis is the essence of an operational control. The policy is managerial, disk encryption is technical, and the fence is physical, so none of those fit the category asked for.',
    },
  ],
};

// ---------------------------------------------------------------------------
// SP1M2 — CIA, non-repudiation, AAA y gap analysis (SY0-701, objetivo 1.2)
// ---------------------------------------------------------------------------
const sp1m2: Module = {
  id: 'sp1m2',
  sectionId: 'sp1',
  title: 'CIA, non-repudiation, AAA y gap analysis',
  minutes: 13,
  objectives: [
    'Definir confidentiality, integrity y availability y asociar a cada una sus amenazas y controles típicos',
    'Explicar qué aporta non-repudiation y qué mecanismos la garantizan',
    'Diferenciar authentication, authorization y accounting, tanto para personas como para sistemas',
    'Resumir los modelos de autorización básicos: least privilege, role-based y attribute-based',
    'Describir qué es un gap analysis, cuándo se realiza y qué produce',
  ],
  blocks: [
    {
      t: 'p',
      md: 'Toda medida de seguridad existe para proteger alguna propiedad de la información. La **CIA triad** —**confidentiality**, **integrity** y **availability**— es el vocabulario mínimo que comparten auditores, analistas y examinadores. Cuando el examen describe un ataque, casi siempre te está preguntando de forma encubierta *qué propiedad* se ha roto; cuando describe un control, *qué propiedad* protege.',
    },
    {
      t: 'table',
      headers: ['Propiedad', 'Qué garantiza', 'Amenaza típica', 'Controles habituales'],
      rows: [
        [
          'Confidentiality',
          'Solo quien está autorizado puede leer la información',
          'Fuga de datos, sniffing, shoulder surfing, acceso indebido',
          'Encryption, access controls, clasificación de datos, DLP',
        ],
        [
          'Integrity',
          'La información no ha sido alterada sin autorización',
          'Modificación de ficheros o registros, man-in-the-middle, corrupción',
          'Hashing, digital signatures, version control, checksums',
        ],
        [
          'Availability',
          'Los usuarios autorizados pueden acceder cuando lo necesitan',
          'DDoS, ransomware, fallo de hardware, desastre',
          'Redundancia, backups, clustering, protección anti-DDoS',
        ],
      ],
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen: «¿qué propiedad se ve afectada?»',
      md: 'Traduce el escenario a su verbo clave: **modificación o corrupción** → integrity; **divulgación o lectura no autorizada** → confidentiality; **caída, lentitud o pérdida de acceso** → availability; **«no puede negar haberlo hecho»** → non-repudiation. Si el ataque cifra tus datos (ransomware), la propiedad principal atacada es *availability*, aunque el atacante también amenace con publicarlos (confidentiality).',
    },
    {
      t: 'check',
      q: {
        q: 'A software vendor publishes the SHA-256 hash of an installer next to the download link. Which property does this control PRIMARILY protect?',
        choices: ['Confidentiality', 'Availability', 'Integrity', 'Non-repudiation'],
        answer: 2,
        explain:
          'Comparing the hash lets the user verify the file was not altered in transit, which is integrity. A hash does not hide the content (confidentiality) and does not prove who published it (non-repudiation requires a signature).',
      },
    },
    { t: 'h', text: 'Non-repudiation: no poder negar la autoría' },
    {
      t: 'p',
      md: '**Non-repudiation** garantiza que quien realizó una acción **no puede negar** haberla realizado, y que el receptor tampoco puede negar haberla recibido. Se apoya en dos familias de mecanismos: las **digital signatures** —el emisor firma con su clave privada, cualquiera verifica con la pública, y solo el poseedor de esa clave privada pudo generar la firma— y los **audit logs** protegidos contra manipulación, que registran quién hizo qué y cuándo. A diferencia de un simple hash, la firma vincula el contenido a una identidad concreta, por eso aporta a la vez *integrity* y *non-repudiation*.',
    },
    {
      t: 'check',
      q: {
        q: 'A CFO digitally signs an email approving a wire transfer. Which TWO properties does the signature provide to the recipient?',
        choices: [
          'Integrity and non-repudiation',
          'Confidentiality and availability',
          'Availability and integrity',
          'Confidentiality and non-repudiation',
        ],
        answer: 0,
        explain:
          'The signature proves the message was not altered (integrity) and that only the holder of the CFO\'s private key could have produced it (non-repudiation). A signature does not encrypt the content, so it provides no confidentiality on its own.',
      },
    },
    { t: 'h', text: 'AAA: authentication, authorization y accounting' },
    {
      t: 'table',
      headers: ['Componente', 'Pregunta que responde', 'Para personas', 'Para sistemas'],
      rows: [
        [
          'Authentication',
          '¿Eres quien dices ser?',
          'Contraseña (something you know), token o móvil (something you have), huella (something you are)',
          'Certificados digitales, 802.1X para dispositivos de red, API keys, identidades de servicio',
        ],
        [
          'Authorization',
          '¿Qué tienes permitido hacer?',
          'Permisos sobre ficheros, roles en una aplicación',
          'Alcance de una API key, políticas de acceso entre servicios',
        ],
        [
          'Accounting',
          '¿Qué hiciste, cuándo y durante cuánto tiempo?',
          'Logs de acceso, registros de sesión, auditoría de cambios',
          'Logs de llamadas a API, telemetría de conexiones',
        ],
      ],
    },
    {
      t: 'p',
      md: 'Dos matices que el examen explota. Primero, autenticar **sistemas** es tan importante como autenticar personas: un switch que exige **802.1X** antes de dar acceso a la red, o un servicio que presenta un **certificate** a otro servicio, están haciendo *authentication* sin que haya ningún humano tecleando. Segundo, la *authorization* se organiza con **modelos**: el principio de **least privilege** (cada identidad recibe solo los permisos imprescindibles), el **role-based** access control (los permisos se asignan a roles como «cajera» o «administradora» y las personas heredan el rol) y el **attribute-based** access control (la decisión combina atributos del sujeto, del recurso y del contexto: departamento, hora, ubicación, sensibilidad). El detalle completo de IAM vive en el Dominio 4; aquí basta con saber qué pregunta responde cada pieza.',
    },
    {
      t: 'callout',
      kind: 'tip',
      title: 'Cómo distinguir las tres A en un escenario',
      md: 'Si la frase habla de **demostrar identidad** (contraseña, MFA, certificado) es authentication. Si habla de **qué puede o no puede hacer** alguien ya identificado (permisos, roles, acceso denegado a una carpeta) es authorization. Si habla de **registrar, auditar o medir** la actividad (logs, tiempo de sesión, quién cambió qué) es accounting. La secuencia siempre es la misma: primero te identificas, luego se decide qué puedes hacer, y todo queda registrado.',
    },
    {
      t: 'check',
      q: {
        q: 'An organization needs to prove, months later, which administrator changed a firewall rule and at what time. Which component of AAA satisfies this requirement?',
        choices: ['Authentication', 'Authorization', 'Accounting', 'Attribute-based access control'],
        answer: 2,
        explain:
          'Recording who did what and when is the accounting function, typically implemented through audit logs. Authentication only establishes identity at login and authorization only decides what is allowed; neither preserves a history of actions.',
      },
    },
    { t: 'h', text: 'Gap analysis: medir la distancia hasta donde quieres estar' },
    {
      t: 'p',
      md: 'Un **gap analysis** compara el **estado actual** de la seguridad de la organización con un **estado deseado**, normalmente definido por un marco de referencia como **NIST CSF**, **ISO 27001**, PCI DSS o una política interna. Para cada requisito se documenta qué existe, qué falta y cuánto importa la diferencia. El resultado no es una lista de quejas: es un **remediation roadmap** priorizado, con responsables y plazos, que sirve de base para pedir presupuesto y para medir el progreso. Se realiza sobre todo cuando aparece una **nueva regulación**, tras una **fusión o adquisición** (hay que integrar dos posturas de seguridad distintas), antes de una **auditoría** o certificación, y periódicamente como control managerial de seguimiento.',
    },
    {
      t: 'table',
      headers: ['Requisito del marco', 'Estado actual', 'Gap', 'Prioridad y acción'],
      rows: [
        [
          'MFA para todo acceso remoto',
          'MFA solo en VPN; el correo web sigue con contraseña',
          'Parcial',
          'Alta — extender MFA al correo en 30 días',
        ],
        [
          'Backups probados trimestralmente',
          'Backups diarios; nunca se ha hecho una restauración de prueba',
          'Total',
          'Alta — ejecutar y documentar un restore este trimestre',
        ],
        [
          'Formación anual de awareness',
          'Formación en la incorporación y refresco anual registrado',
          'Ninguno',
          'Mantener',
        ],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'A company that recently acquired a smaller firm performs a gap analysis against ISO 27001. What is the PRIMARY output the leadership team should expect?',
        choices: [
          'A list of all vulnerabilities found by a network scanner',
          'A prioritized roadmap of missing or partial controls with remediation actions',
          'A penetration test report with exploited hosts',
          'A new organizational chart for the merged security team',
        ],
        answer: 1,
        explain:
          'A gap analysis compares the current state with a target framework and produces a prioritized plan to close the differences. Vulnerability scans and penetration tests are technical assessments of specific systems, not comparisons of the overall program against a standard.',
      },
    },
    {
      t: 'p',
      md: 'Ya sabes nombrar la propiedad que protege cada control, distinguir las tres A y medir la distancia entre lo que tienes y lo que el marco exige. La siguiente lección lleva estas ideas al modelo de arquitectura que domina el SY0-701: **Zero Trust**, donde authentication, authorization y accounting se aplican a cada petición, no solo en el perímetro.',
    },
  ],
  quiz: [
    {
      id: 'sp1m2q1',
      domain: 'General Security Concepts',
      prompt:
        'An attacker intercepts traffic between a branch office and headquarters and silently changes the account numbers inside invoices before forwarding them. Which security property is MOST directly violated?',
      choices: ['Confidentiality', 'Integrity', 'Availability', 'Non-repudiation'],
      answer: 1,
      explain:
        'The data was modified without authorization, which is an integrity violation. Confidentiality is a tempting choice because the attacker also read the traffic, but the question asks about the most direct impact, and the described harm is the alteration of the invoices.',
    },
    {
      id: 'sp1m2q2',
      domain: 'General Security Concepts',
      prompt:
        'A retailer\'s online store is unreachable for six hours after a volumetric attack floods its internet link. Which control would have BEST protected the property that was affected?',
      choices: [
        'Full-disk encryption on the web servers',
        'Digital signatures on all customer receipts',
        'Stricter password complexity for administrators',
        'A DDoS mitigation service with redundant upstream capacity',
      ],
      answer: 3,
      explain:
        'The attack caused an outage, so the affected property is availability, and DDoS mitigation with redundancy directly addresses it. Encryption and signatures protect confidentiality and integrity, and password rules address authentication; none of them keep the site online under a flood.',
    },
    {
      id: 'sp1m2q3',
      domain: 'General Security Concepts',
      prompt:
        'A contractor claims they never submitted a change request that later caused an outage. Which mechanism would BEST allow the organization to prove the contractor did submit it?',
      choices: [
        'A digital signature applied by the contractor when the request was submitted',
        'Full-disk encryption on the ticketing server',
        'A hash of the request stored in the database',
        'A firewall rule restricting access to the ticketing system',
      ],
      answer: 0,
      explain:
        'A digital signature ties the request to the contractor\'s private key, giving non-repudiation. A hash only shows the content was unchanged and cannot indicate who created it, so it is the tempting but insufficient distractor.',
    },
    {
      id: 'sp1m2q4',
      domain: 'General Security Concepts',
      prompt:
        'A network switch is configured so that a device must present a valid certificate before it is allowed onto the corporate VLAN. Which AAA component is being enforced?',
      choices: ['Accounting', 'Authorization', 'Authentication of a system', 'Non-repudiation'],
      answer: 2,
      explain:
        'The device is proving its identity with a certificate before it gets access, which is authentication applied to a system rather than a person. Authorization is the tempting distractor, but deciding which VLAN or resources it may use happens after identity is established.',
    },
    {
      id: 'sp1m2q5',
      domain: 'General Security Concepts',
      prompt:
        'Which of the following BEST describes the principle of least privilege?',
      choices: [
        'Users are assigned permissions through the roles they hold',
        'Access decisions combine attributes such as department, time of day, and location',
        'Every action is recorded so it can be attributed to a specific user',
        'Each identity receives only the permissions required to perform its tasks',
      ],
      answer: 3,
      explain:
        'Least privilege limits every account to the minimum access needed for its job. The first two options describe role-based and attribute-based models, which are ways to implement authorization, and the third describes accounting.',
    },
    {
      id: 'sp1m2q6',
      domain: 'General Security Concepts',
      prompt:
        'A new privacy regulation will apply to a company in nine months. Which activity should the security manager perform FIRST to plan the compliance effort?',
      choices: [
        'Purchase a data loss prevention platform',
        'Conduct a gap analysis against the regulation\'s requirements',
        'Hire an external penetration testing team',
        'Rewrite the acceptable use policy',
      ],
      answer: 1,
      explain:
        'A gap analysis identifies which requirements are already met and which are missing, producing the prioritized plan that every later purchase or policy change should follow. Buying tools or ordering tests before knowing the gaps risks spending on the wrong controls.',
    },
    {
      id: 'sp1m2q7',
      domain: 'General Security Concepts',
      prompt:
        'A former employee\'s account is still able to open the finance share three weeks after leaving the company. Which AAA component has failed?',
      choices: ['Authorization', 'Accounting', 'Authentication', 'Availability'],
      answer: 0,
      explain:
        'The account authenticates correctly but should no longer be permitted to reach the share; the failure is in what the identity is allowed to do, which is authorization. Authentication is the tempting distractor, but the credentials themselves were valid; the problem is that permissions were not revoked.',
    },
  ],
};

export const SP1_PART1: Module[] = [sp1m1, sp1m2];
