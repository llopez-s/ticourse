import type { Module } from '../../lib/types';

/**
 * Optional SY0-801 lesson (outside the SY0-701 scope). Written from the
 * pre-launch objectives draft v2.0; original wording, no check enters any
 * question bank, boss, mock or placement pool.
 */
export const SP7M7: Module = {
  id: 'sp7m7',
  sectionId: 'sp7',
  title: 'Operaciones y gobierno',
  minutes: 22,
  objectives: [
    'Explicar qué es un **fail forward**, cuándo puede ser aceptable frente a un backout plan y por qué el **CAB** sigue decidiendo',
    'Distinguir **IPAM**, **CSPM**, source code review y escaneo como formas de identificar vulnerabilidades, y usar el pentest report para priorizar',
    'Diferenciar un **bounty program** de una política de **responsible disclosure** y separar el reporte interno del externo',
    'Situar la fase de **negotiation** en la respuesta a incidentes y enumerar los factores que pesan en una decisión de extorsión',
    'Planificar la notificación a stakeholders, customers, law enforcement y organismos con reporte mandatory',
    'Usar **MITRE ATT&CK**, la Cyber Kill Chain y el **Diamond Model** como fuentes de referencia en una auditoría o evaluación',
    'Elegir el tipo de formación de concienciación, su canal de entrega y las métricas, incluido el personnel **behavior** risk scoring',
  ],
  blocks: [
    {
      t: 'callout',
      kind: 'warn',
      title: 'Fuera del SY0-701 · novedad del SY0-801',
      md: 'Esta lección es **material complementario y opcional**: no forma parte del SY0-701. Leerla cuenta como cualquier lección (XP y progreso normales), pero sus comprobaciones son opcionales, no dan XP y nada de lo que contiene entra en los bancos de preguntas, los jefes, el simulacro ni el examen de nivel. Está escrita a partir del **borrador previo al lanzamiento** del listado de objetivos del SY0-801 (documento v2.0), que puede cambiar antes de publicarse. El lanzamiento del examen está previsto «on or around 17 November 2026». Lo que el borrador no nombra de nuevo sigue siendo materia del SY0-701. Proyecto independiente, sin afiliación con CompTIA.',
    },
    {
      t: 'p',
      md: 'Los objetivos de operaciones y gobierno del borrador del 801 se parecen mucho a los del 701, y ahí está la trampa: conviene leerlos buscando **lo que se añade o cambia de sitio**, no lo que ya sabes. Esta lección recorre cinco cosas: el **fail forward** dentro de la gestión de cambios, tres formas de identificar vulnerabilidades que el borrador pone junto al escaneo (IPAM y CSPM son nuevas; la source code review amplía el SAST que viste en sp4m4) y dónde coloca ahora el bounty y el responsible disclosure, la fase de **negotiation** en la respuesta a incidentes, los marcos **MITRE ATT&CK**, Cyber Kill Chain y Diamond Model como fuentes de referencia en las auditorías, y cómo medir la concienciación mirando el comportamiento de las personas. Las bases (CAB, backout plan, severidad, fases del incidente, formación inicial y recurrente) están en las lecciones del 701 enlazadas al final; aquí solo se construye encima.',
    },
    { t: 'h', text: 'Gestión de cambios: el fail forward' },
    {
      t: 'p',
      md: 'En el 701 aprendiste que un cambio serio pasa por un **change advisory board (CAB)**: un comité con operaciones, seguridad y negocio que revisa el análisis de impacto, los resultados de las pruebas y el **backout plan**, y aprueba, rechaza o pospone. Eso no cambia. Entre los elementos del proceso, el borrador del 801 nombra el **fail forward**, la alternativa al retroceso: cuando el cambio sale mal, en vez de **deshacerlo** (backout), se **sigue hacia delante** aplicando una corrección encima del estado ya cambiado.',
    },
    {
      t: 'p',
      md: 'Piensa en una migración de base de datos que ya ha transformado la mitad de las tablas. Volver atrás exigiría restaurar una copia y perder las transacciones de las últimas horas, y eso puede ser más caro y arriesgado que arreglar el defecto concreto que ha aparecido. Ahí un fail forward tiene sentido. Las condiciones que suelen justificarlo son estas:',
    },
    {
      t: 'list',
      items: [
        '**Revertir es peor que corregir**: el backout implica pérdida de datos, un riesgo de integridad o un tiempo de recuperación mayor que el de la corrección.',
        '**El fallo está acotado y entendido**: se conoce la causa y la corrección es pequeña y probada en un entorno de pruebas. «No sabemos qué ha pasado, pero sigamos» nunca es fail forward, es improvisación.',
        '**Hay autoridad y margen**: la decisión la toma quien el proceso designó (a menudo el change owner con el CAB, o un procedimiento de cambio de emergencia ya aprobado) y cabe dentro de la maintenance window.',
        '**Queda rastro**: se documenta lo que se hizo, se actualizan diagramas y procedimientos, y el cambio corregido entra en el control de versiones como cualquier otro.',
      ],
    },
    {
      t: 'p',
      md: 'Ojo con la lectura contraria: el fail forward **no sustituye** al backout plan. El plan de reversión sigue siendo la opción por defecto y lo que el comité exige ver antes de aprobar; el avance con corrección es una decisión **tomada y justificada en el momento**, normalmente prevista como contingencia en la propia solicitud de cambio. Si tu respuesta a un fallo sistémico en un servidor crítico, con causa desconocida, es seguir adelante sin plan, estás al revés de lo que el proceso protege.',
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Cómo podría plantearse',
      md: 'Un enunciado del tipo «el cambio falla a mitad y revertir pondría en riesgo los datos ya migrados» apunta al **fail forward**; uno donde la causa es desconocida y hay una copia reciente apunta al **backout**. Fíjate siempre en si el enunciado dice que el fallo está entendido y acotado.',
    },
    { t: 'h', text: 'Vulnerabilidades: cómo se identifican, se priorizan y se reportan' },
    {
      t: 'p',
      md: 'El escaneo sigue siendo la base, pero tiene un límite evidente: **solo escanea lo que le dices que escanee**. El borrador del 801 coloca junto a él tres formas de identificar problemas que cubren puntos ciegos distintos.',
    },
    {
      t: 'table',
      headers: ['Método', 'Qué descubre', 'Qué no ve', 'Ejemplo (ficticio)'],
      rows: [
        [
          '**Scanning**',
          'Fallos conocidos y versiones desactualizadas en activos del alcance',
          'Activos que no conoces; errores de lógica; configuración cloud',
          'Un escaneo mensual que solo cubre las subredes de su lista',
        ],
        [
          '**IPAM** (IP address management)',
          'Qué direcciones, subredes y asignaciones DHCP/DNS existen realmente, y cuáles no están inventariadas',
          'Vulnerabilidades en sí; solo dice «esto existe y aquí»',
          'Una subred olvidada con equipos que nadie escanea',
        ],
        [
          '**CSPM** (cloud security posture management)',
          'Desviaciones de configuración en la nube frente a una línea base: almacenamiento público, reglas abiertas, permisos excesivos',
          'Vulnerabilidades dentro de una aplicación; cargas de trabajo no cloud',
          'Un contenedor de almacenamiento que pasa a ser público tras un cambio',
        ],
        [
          '**Source code review**',
          'Fallos de lógica y de programación antes de desplegar, a mano o con herramientas de análisis estático',
          'Problemas de entorno o de configuración en producción',
          'La revisión de una herramienta propia de gestión de atraques',
        ],
      ],
    },
    {
      t: 'p',
      md: 'La idea que une las tres filas que acompañan al escaneo es que **un escáner solo audita una lista**. IPAM te ayuda a que la lista esté completa (un activo desconocido no se parchea), CSPM vigila de forma continua una superficie que cambia con cada clic en una consola cloud, y la revisión de código llega a la causa antes de que haya algo desplegado que escanear. Para **priorizar**, la severity assessment (una puntuación tipo CVSS combinada con el contexto del activo) se complementa con la **revisión del informe de una prueba de intrusión**: un fallo de severidad media que el equipo de pentest logró **encadenar** con otros hasta alcanzar un sistema crítico merece más prioridad que su puntuación aislada, porque demuestra explotabilidad real en tu entorno.',
    },
    {
      t: 'p',
      md: 'En el reporte, el borrador distingue lo **interno** (hallazgos que viajan por el proceso normal de remediación, verificación e informe a la dirección) de lo **externo**, donde entran dos conceptos que se confunden a menudo. Un **bounty program** es una oferta **de pago**: la organización recompensa a investigadores independientes por hallazgos válidos, con alcance y reglas publicados. Una política de **responsible disclosure** es el marco que dice **cómo** se informa de una vulnerabilidad, a qué canal, qué compromiso hay de no emprender acciones legales contra quien actúa de buena fe, en qué plazo se responde y cuándo se hace público el detalle. Puede existir una política de divulgación **sin** recompensa; un programa de recompensas serio **necesita** una política de divulgación. El bug bounty y el responsible disclosure program ya están en el 701 (sp4m4, «Gestión de vulnerabilidades I: identificación», donde también se comparan con el pentest); el borrador los coloca en el reporte externo.',
    },
    { t: 'h', text: 'Respuesta a incidentes: negotiation y notificación' },
    {
      t: 'p',
      md: 'El borrador del 801 incluye en la lista de actividades de respuesta dos elementos que el 701 no nombra como tales: **negotiation**, entre la contención y la erradicación/recuperación, y **notification/external reporting** como actividad separada. El caso típico de la fase de negotiation es la extorsión: ransomware o robo de datos con amenaza de publicación, y un atacante que pide un pago. Lo primero que hay que fijar es **quién decide**: no es el analista del SOC ni, por sí sola, la persona responsable de TI. La decisión recae en la dirección, con asesoría **legal**, y suele involucrar a la aseguradora, a especialistas externos en negociación y a las **fuerzas del orden**. El analista aporta hechos, no cierra tratos.',
    },
    {
      t: 'p',
      md: 'Tampoco hay una respuesta única, y la recomendación habitual de las autoridades es **no pagar**: pagar no garantiza recuperar los datos, no garantiza que no se publiquen o revendan, financia al atacante y te marca como cliente dispuesto. Aun así, la decisión de una organización concreta se apoya en factores que tienes que saber enumerar:',
    },
    {
      t: 'list',
      items: [
        '**Capacidad de recuperación**: si las copias de seguridad se restauran dentro del RTO, el argumento económico para pagar se debilita mucho.',
        '**Exfiltración previa**: si los datos ya salieron (doble extorsión), pagar no los devuelve; la notificación a afectados puede seguir siendo obligatoria según la normativa.',
        '**Marco legal y sanciones**: algunos pagos pueden estar restringidos o ser ilegales según quién sea el beneficiario, y por eso se consulta antes a asesoría jurídica y a las autoridades.',
        '**Cobertura del seguro**: la póliza puede imponer condiciones, avisos previos o contratar a sus propios especialistas.',
        '**Impacto en servicios esenciales o en seguridad de las personas**: cambia el peso de cada riesgo, pero no elimina los anteriores.',
        '**Fiabilidad del adversario y evidencia**: una conversación con el atacante también sirve para verificar qué tiene realmente, siempre desde un canal controlado y conservando cada mensaje como evidencia.',
      ],
    },
    {
      t: 'p',
      md: 'La **notificación y el reporte externo** se divide en cuatro destinatarios. Los **stakeholders** internos y socios (dirección, legal, comunicación, recursos humanos, proveedores afectados); los **customers** o personas cuyos datos se vieron afectados, que reciben un mensaje claro sobre qué ocurrió, qué datos y qué pueden hacer; las **fuerzas del orden**, cuya implicación temprana ayuda con la atribución y a veces con la recuperación; y los **organismos con reporte mandatory** (reguladores sectoriales, autoridades de protección de datos, obligaciones contractuales), cuyos plazos y umbrales dependen de la jurisdicción y del sector, y que por eso los fija el equipo legal, no el analista. Todo esto se prepara en la fase de preparation: plantillas de mensaje, lista de contactos, una única voz portavoz y quién autoriza cada comunicación.',
    },
    {
      t: 'callout',
      kind: 'story',
      title: 'Autoridad Portuaria de Halden · caso de ejemplo',
      md: '*Caso inventado para practicar, no un hecho del puerto.* Imagina que una organización portuaria recibe de madrugada una nota de extorsión después de que varios sistemas queden cifrados. El equipo de respuesta ya ha contenido el incidente, y TI confirma que las copias se restauran dentro del RTO, aunque hay indicios de que parte de los datos salieron antes del cifrado. El analista de guardia **no responde** al atacante: pasa la nota, con la evidencia, a la dirección. La dirección, asesorada por legal y por la aseguradora, avisa a las fuerzas del orden, decide no pagar porque puede restaurar, y pone en marcha la notificación a las personas afectadas y a los organismos que exigen reporte, mientras continúa la erradicación. La **negotiation**, aquí, fue sobre todo tiempo bien usado y decisiones tomadas por quien le correspondía.',
    },
    { t: 'h', text: 'Auditorías: ATT&CK, Kill Chain y Diamond Model como referencias' },
    {
      t: 'p',
      md: 'En la sección de auditoría y evaluación, el borrador del 801 lista, dentro de la recogida de datos (muestreo, cuestionarios, entrevistas, afirmaciones de la dirección), unas **fuentes de referencia**: **MITRE ATT&CK**, la **Cyber Kill Chain** y el **Diamond Model of Intrusion Analysis**. No son normas contra las que se certifique una organización; son **vocabularios compartidos** que permiten comparar lo que dices que haces con lo que hace un adversario. En la ruta de inteligencia de amenazas de esta aplicación tienes cada uno por separado; aquí interesa el uso en una evaluación.',
    },
    {
      t: 'list',
      items: [
        '**MITRE ATT&CK** — catálogo de tácticas y técnicas observadas. En un gap analysis sirve para mapear qué técnicas cubren tus detecciones y controles y cuáles quedan sin cobertura, o para clasificar los hallazgos de un pentest con un lenguaje común.',
        '**Cyber Kill Chain** — modelo de fases de una intrusión, de la preparación al objetivo. Permite preguntar en qué fase detecta, bloquea o interrumpe cada control, y dónde hay una fase sin ninguno.',
        '**Diamond Model** — relaciona cuatro elementos de cada evento: adversary, capability, infrastructure y victim. Ayuda al auditor o analista a decidir qué evidencia pedir y desde dónde pivotar de un evento a otros relacionados.',
      ],
    },
    {
      t: 'p',
      md: 'La clave de lectura es que **referencia no es requisito**. Si una auditoría usa ATT&CK, no dice que cada técnica deba estar bloqueada; dice que el equipo conoce qué cubre y qué acepta, y que puede justificarlo. Esa comparación entre estado actual y estado deseado es, además, la definición de **gap analysis**, uno de los tipos de engagement que el borrador lista junto a las auditorías internas y las evaluaciones externas.',
    },
    { t: 'h', text: 'Concienciación: tipos, canales y comportamiento' },
    {
      t: 'p',
      md: 'En el 701 la concienciación se trata como un programa que se mide por el **report rate** y que no castiga. El borrador del 801 lo ordena en cuatro tipos de formación, varios canales de entrega y un sistema de métricas que termina en el **personnel behavior risk scoring**.',
    },
    {
      t: 'table',
      headers: ['Tipo', 'Cuándo', 'A quién', 'Ejemplo'],
      rows: [
        ['**Initial / onboarding**', 'Al incorporarse, antes de dar accesos', 'Toda persona nueva', 'Política de uso, ruta de reporte y firma de acknowledgement'],
        ['**Ongoing**', 'De forma recurrente durante el año', 'Toda la plantilla', 'Microformaciones periódicas sobre amenazas actuales'],
        ['**Targeted**', 'Según el rol o el riesgo', 'Finanzas, administración de sistemas, directivos', 'Fraude de factura para cuentas por pagar; privilegios para administradores'],
        ['**Corrective**', 'Tras un incidente o un fallo repetido', 'Personas o equipos concretos', 'Sesión de refuerzo tras un clic en una simulación, sin sanción'],
      ],
    },
    {
      t: 'p',
      md: 'Los **canales de entrega** se eligen por alcance y coste: una plataforma **LMS** (learning management system) para cursos con seguimiento y certificación; **self-service portals** para consulta cuando la persona lo necesita; sesiones **one-to-one** para casos delicados, como la formación correctiva o directivos, y sesiones **one-to-many** para talleres y charlas. Casi nunca uno solo basta: el LMS da trazabilidad, el portal da disponibilidad, y la conversación personal es la que cambia hábitos concretos.',
    },
    {
      t: 'p',
      md: 'Para medir, se empieza con **metrics** simples (participación, finalización, tasa de reporte en simulaciones, tiempo hasta reportar) y se llevan a **informes para la dirección** que expliquen tendencias y riesgos, no listas de nombres. El paso nuevo es el **personnel behavior risk scoring**: puntuar el riesgo de personas o grupos combinando señales de comportamiento (resultados de simulaciones, reportes, incumplimientos de política, alertas de prevención de pérdida de datos, nivel de privilegio) para decidir **dónde enfocar la formación targeted o corrective**. Funciona mejor como herramienta de priorización que como veredicto: debe ser transparente, proporcionado, respetar la normativa laboral y de privacidad, y agregarse por equipos antes de llegar a la dirección. Un score usado para avergonzar o sancionar destruye la cultura de reporte que el 701 identifica como la mejor señal temprana.',
    },
    {
      t: 'callout',
      kind: 'tip',
      title: 'Qué llevarte',
      md: 'Si el 801 te sale al paso: un cambio fallido puede resolverse con **fail forward** solo si el fallo está acotado y la decisión está autorizada; **IPAM** completa la lista de activos y **CSPM** vigila la configuración cloud; la **negotiation** la decide la dirección con legal, no el SOC; y **ATT&CK**, Kill Chain y Diamond Model son referencias, no requisitos. El **behavior** de las personas se mide para enseñar mejor, no para castigar.',
    },
    {
      t: 'check',
      q: {
        optional: true,
        q: 'During a scheduled change, a database migration has already converted most tables when a small, well-understood defect appears. Rolling back would mean losing hours of transactions. Which action BEST fits the process?',
        choices: [
          'Skip the change advisory board and keep going without documenting anything',
          'Restore the last backup immediately, whatever the data loss',
          'Fail forward with a tested, authorized fix inside the window, and document it',
          'Abandon the change and tell users the service will remain degraded indefinitely',
        ],
        answer: 2,
        explain: 'A fail forward fits when the cause is understood, the fix is small and tested, reverting is more costly, and the decision is authorized and recorded. Skipping approval and documentation removes the controls the process exists for, and a blind restore ignores the cost the scenario describes.',
      },
    },
    {
      t: 'check',
      q: {
        optional: true,
        q: 'A team wants continuous detection of cloud storage that becomes publicly readable after a configuration change. Which capability is the BEST fit?',
        choices: [
          'Cloud security posture management (CSPM)',
          'A monthly credentialed scan of the office network',
          'IP address management (IPAM) of the on-premises subnets',
          'A one-off manual review of the application source code',
        ],
        answer: 0,
        explain: 'CSPM compares cloud configuration against a baseline continuously and flags drifts such as public storage. IPAM inventories addresses, a network scan covers a fixed scope, and a code review inspects application logic, none of which watches cloud settings.',
      },
    },
    {
      t: 'check',
      q: {
        optional: true,
        q: 'Which statement about a responsible disclosure policy and a bounty program is MOST accurate?',
        choices: [
          'A bounty program replaces the need for any separate disclosure policy or reporting rules',
          'A disclosure policy always pays researchers for every report, whether or not it is valid',
          'Both are limited to internal reporting by employees of the organization itself',
          'A disclosure policy sets how to report; a bounty adds payment for valid findings',
        ],
        answer: 3,
        explain: 'The policy sets channel, scope, good-faith protections and timelines, and it can exist without any payment. A bounty is the paid layer built on top of it. Neither is limited to employees, because both exist to receive external reports.',
      },
    },
    {
      t: 'check',
      q: {
        optional: true,
        q: 'An organization hit by ransomware is considering paying. Who should make the decision, and with what input?',
        choices: [
          'The on-call SOC analyst, as soon as the attacker sends the ransom terms and a deadline',
          'Senior leadership, advised by legal counsel and informed by the technical facts',
          'The attacker, who sets the deadline and the amount and decides what happens to the data',
          'The help desk, because it receives the first reports from affected users',
        ],
        answer: 1,
        explain: 'It is a business and legal decision taken by leadership with counsel, insurer and authorities, informed by technical facts such as restoration capability and data theft. An analyst supplies evidence but does not commit the organization.',
      },
    },
    {
      t: 'check',
      q: {
        optional: true,
        q: 'An assessor maps an organization’s detections to a catalogue of adversary tactics and techniques to show which ones have no coverage. Which reference source is being used, and for what?',
        choices: [
          'The Diamond Model, to prove compliance with a regulation',
          'The Cyber Kill Chain, to certify the organization against a standard',
          'MITRE ATT&CK, as a shared vocabulary for a gap analysis',
          'A bounty program, to measure employee behavior',
        ],
        answer: 2,
        explain: 'ATT&CK is the tactics-and-techniques catalogue that supports coverage mapping and gap analysis. These frameworks are references and not certifiable requirements, and the Diamond Model models events as adversary, capability, infrastructure and victim.',
      },
    },
    {
      t: 'check',
      q: {
        optional: true,
        q: 'A company combines simulation results, policy violations and privilege level into a score per team. What is the MOST appropriate use of that behavior risk score?',
        choices: [
          'Publish individual rankings of every employee to motivate people through peer pressure',
          'Use it as the only basis for disciplinary action against the highest-scoring people',
          'Replace all awareness training with a single annual course for the whole workforce',
          'Prioritize targeted training where risk is highest, with privacy safeguards',
        ],
        answer: 3,
        explain: 'Risk scoring is a prioritization tool for targeted and corrective training, ideally transparent, proportionate and aggregated. Public rankings and discipline-only use damage the reporting culture that early detection depends on.',
      },
    },
    {
      t: 'links',
      title: 'Complementa',
      items: [
        { label: 'Change management: proceso, implicaciones técnicas y documentación', href: '/learn/sp1m5' },
        { label: 'Respuesta a incidentes: proceso, pruebas, RCA y threat hunting', href: '/learn/sp4m10' },
        { label: 'Auditorías, evaluaciones y penetration testing', href: '/learn/sp5m7' },
        { label: 'Gestión de vulnerabilidades I: identificación', href: '/learn/sp4m4' },
        { label: 'Concienciación: programa, phishing y comportamiento anómalo', href: '/learn/sp5m8' },
      ],
    },
  ],
  quiz: [],
};
