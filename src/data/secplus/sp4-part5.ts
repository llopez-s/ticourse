import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// SP4M9 — Automatización y orquestación (SY0-701, objetivo 4.7)
// ---------------------------------------------------------------------------
const sp4m9: Module = {
  id: 'sp4m9',
  sectionId: 'sp4',
  title: 'Automatización y orquestación',
  minutes: 12,
  objectives: [
    'Reconocer los use cases de automation y orchestration que entran en el examen: user provisioning, resource provisioning, guard rails, security groups, ticket creation, escalation, enabling/disabling services and access, continuous integration and testing e integraciones vía API',
    'Explicar por qué el valor de seguridad de la automatización es la consistencia (enforcing baselines y standard infrastructure configurations) y no la simple velocidad',
    'Justificar los beneficios de reaction time, scaling securely, workforce multiplier y employee retention con ejemplos operativos del puerto',
    'Identificar las contrapartidas: complexity, cost, single point of failure, technical debt y ongoing supportability',
    'Diseñar la puesta en producción de un playbook de SOAR y proteger la cuenta privilegiada que lo ejecuta',
  ],
  blocks: [
    {
      t: 'p',
      md: 'En la lección anterior montaste el ciclo de vida de una identidad: alta, cambios de puesto, recertificación y baja el mismo día. Si has pensado «esto son decenas de pasos manuales repetidos cientos de veces al año», ya has entendido el objetivo 4.7. La **automation** es hacer que una tarea concreta se ejecute sola —crear la cuenta, aplicar la plantilla, abrir el ticket—; la **orchestration** es encadenar varias de esas tareas, a menudo entre herramientas distintas, en un flujo con condiciones y decisiones. En un SOC eso se llama **SOAR** (*security orchestration, automation and response*) y su unidad de trabajo es el **playbook**. Como analista de la Autoridad Portuaria de Halden vas a usar las dos cosas todos los días, y el examen te va a preguntar tres cosas: qué se automatiza, qué se gana de verdad con ello y qué problema nuevo te acabas de comprar.',
    },
    { t: 'h', text: 'Qué se automatiza: los use cases del 4.7' },
    {
      t: 'p',
      md: 'CompTIA nombra una lista concreta de casos de uso y conviene reconocerlos por su nombre inglés. El **user provisioning** crea la cuenta, la mete en sus grupos y le asigna licencias y buzón a partir del alta en recursos humanos —y, sobre todo, ejecuta la baja en el momento exacto en que RR. HH. marca la salida—. El **resource provisioning** hace lo mismo con la infraestructura: una máquina virtual, un bucket de almacenamiento o una red se crean a partir de una plantilla de **infrastructure as code**, ya endurecida y con logging activado. Los **guard rails** son la pieza más interesante para seguridad: políticas automáticas que **impiden** una configuración insegura antes de que exista —el despliegue que intenta abrir el almacenamiento a internet o crear una regla de firewall 0.0.0.0/0 simplemente falla— o que la revierten en segundos si aparece. Las **security groups** son las agrupaciones lógicas a las que se conceden permisos y filtrados de red; automatizar su asignación evita el permiso concedido «temporalmente» que nadie retira. El **ticket creation** convierte una alerta en un caso trazable con su marca de tiempo, y la **escalation** aplica sola la regla del plan cuando nadie coge el caso o cuando la severidad sube. El **enabling/disabling services and access** cubre los interruptores: deshabilitar una cuenta comprometida, cortar un servicio vulnerable, retirar temporalmente el acceso VPN de un equipo en cuarentena. La **continuous integration and testing** mete la seguridad en la cadena de construcción del software: análisis estático, revisión de dependencias y pruebas que rompen la compilación cuando algo no cumple. Y todo lo anterior se sostiene sobre **integrations and APIs**: sin interfaz programable, el SIEM, el EDR, el directorio y el sistema de tickets no se hablan y no hay orquestación posible.',
    },
    {
      t: 'check',
      q: {
        q: 'A cloud engineer at the Halden Port Authority repeatedly creates storage buckets that allow public read access, and the security team keeps finding them days later during reviews. The team wants a control that stops the insecure configuration from ever taking effect, rather than reporting it afterwards. Which automation use case fits?',
        choices: [
          'Guard rails in the deployment pipeline that reject public storage configurations',
          'A weekly automated report of publicly accessible buckets',
          'Automated ticket creation whenever a bucket is created',
          'Automated resource provisioning of additional private buckets',
        ],
        answer: 0,
        explain:
          'Guard rails are automated policy that blocks or reverts an unsafe configuration at the moment of deployment, which is exactly the preventive behaviour the team is asking for. The weekly report is the tempting distractor because it also uses automation and does find the problem, but it is detective: the bucket is still public for days before anyone reads the report.',
      },
    },
    { t: 'h', text: 'Los beneficios: primero la consistencia, después la velocidad' },
    {
      t: 'p',
      md: 'La lista de beneficios de CompTIA empieza con **efficiency/time saving**, y por eso mucha gente se queda ahí. Pero el valor de seguridad de la automatización no es que vaya rápido: es que hace **exactamente lo mismo todas las veces**. Ese es el sentido de **enforcing baselines** y de **standard infrastructure configurations**: cuando cada servidor se crea desde la misma plantilla endurecida, la deriva de configuración deja de acumularse y el inventario coincide con la realidad. Un procedimiento manual de treinta pasos ejecutado por seis personas distintas a las tres de la mañana produce seis resultados distintos; el mismo procedimiento en un playbook produce uno solo, y además auditable. De ahí se derivan los demás beneficios. **Scaling securely** significa que duplicar el número de sistemas no duplica el número de errores de configuración. La **reaction time** es la diferencia entre deshabilitar una cuenta comprometida en quince segundos o en cuarenta minutos, que es justo el tiempo que el atacante necesita. El **workforce multiplier** es que un equipo pequeño cubre un alcance grande porque la máquina se ocupa del volumen repetitivo y las personas se ocupan del juicio. Y el **employee retention**, que parece un beneficio de recursos humanos colado en un examen técnico, es real: la analista que se pasa la jornada copiando indicadores entre consolas se quema y se va, y con ella se va el conocimiento del entorno.',
    },
    {
      t: 'table',
      headers: ['Caso de uso', 'Qué elimina', 'Qué introduce (la contrapartida)'],
      rows: [
        [
          'User provisioning / deprovisioning',
          'La cuenta huérfana de la persona que se fue y el permiso heredado de un puesto anterior',
          'Una integración con RR. HH. con permisos altos: si el origen se equivoca o lo manipulan, el error se propaga a todo el directorio',
        ],
        [
          'Resource provisioning con IaC',
          'La deriva de configuración y el servidor «especial» que nadie sabe reconstruir',
          'Plantillas que hay que mantener y revisar; una plantilla mal hecha replica el fallo en cientos de sistemas',
        ],
        [
          'Guard rails',
          'La configuración insegura que vive días hasta que alguien la ve en un informe',
          'Falsos bloqueos que frenan al negocio y presión para conceder excepciones permanentes',
        ],
        [
          'Ticket creation y escalation',
          'La alerta que se pierde en un buzón y el caso que nadie escala de madrugada',
          'Ruido: si no hay alert tuning, el sistema genera cientos de tickets inútiles y el equipo deja de mirarlos',
        ],
        [
          'Enabling/disabling services and access',
          'Los minutos entre detectar el compromiso y cortar el acceso',
          'Una cuenta de automatización muy privilegiada capaz de desconectar producción, y el riesgo de una acción destructiva automática',
        ],
        [
          'Continuous integration and testing',
          'El fallo conocido que llega a producción porque nadie revisó las dependencias',
          'Pipelines que se convierten en objetivo de ataque y compilaciones rotas por reglas mal calibradas',
        ],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'The port authority SOC builds a SOAR playbook for reported phishing: it pulls the message, detonates attachments in a sandbox, checks the URL reputation, searches the mail gateway for other copies, and opens a ticket. Analysts still make the decision to purge mailboxes and reset credentials. Which benefit does this design capture while limiting risk?',
        choices: [
          'It removes the need for an incident response plan, because the playbook is the plan',
          'It eliminates false positives, because sandbox verdicts are always accurate',
          'It acts as a workforce multiplier by automating the repetitive triage while a human authorises the destructive actions',
          'It guarantees that phishing messages never reach users',
        ],
        answer: 2,
        explain:
          'Automating the collection and enrichment steps lets a small team triage far more reports, while keeping the irreversible actions behind human approval limits the blast radius of a wrong verdict. Eliminating false positives is the tempting distractor because sandboxing and reputation lookups do improve accuracy, but they still produce wrong verdicts, which is precisely why the destructive step is left to a person.',
      },
    },
    { t: 'h', text: 'La otra cara: complejidad, coste, punto único de fallo y deuda técnica' },
    {
      t: 'p',
      md: 'CompTIA agrupa las contrapartidas bajo **other considerations** y las pregunta con la misma insistencia que los beneficios. La **complexity** es la primera: un flujo que atraviesa el directorio, el SIEM, el EDR, el sistema de tickets y la nube tiene muchas más piezas que puedan fallar, y depurarlo exige entender todas. El **cost** no es solo la licencia de la plataforma: es el tiempo de ingeniería para construir, probar y mantener cada playbook, y ese coste solo se amortiza si la tarea es **frecuente y repetible**; automatizar algo que se hace dos veces al año y siempre distinto es tirar dinero. El **single point of failure** es el riesgo estructural: cuando todas las altas, bajas, despliegues y respuestas pasan por una única plataforma de orquestación, esa plataforma se convierte a la vez en el cuello de botella —si cae, no puedes ni dar de alta ni contener— y en el **objetivo privilegiado** más atractivo del entorno, porque su cuenta de servicio suele tener permisos sobre todo. Un atacante que la controla no necesita moverse lateralmente: ya tiene las llaves. La **technical debt** aparece cuando los scripts se acumulan sin documentación, sin control de versiones y sin dueño; el clásico es la automatización crítica que escribió un ingeniero que ya no trabaja aquí, que nadie se atreve a tocar y que se rompe el día que cambia una API. Y la **ongoing supportability** es la pregunta que hay que hacerse antes de escribir la primera línea: quién mantiene esto, quién lo prueba cuando cambie el entorno y quién sabe ejecutarlo a mano si la plataforma no está.',
    },
    {
      t: 'list',
      ordered: true,
      items: [
        'Elegir un candidato honesto: tarea **frecuente, repetible y bien definida**; si el procedimiento manual no está escrito y estabilizado, automatizarlo solo acelera el desorden.',
        'Documentar el procedimiento manual y sus criterios de decisión **antes** de convertirlo en código, para que exista un plan B ejecutable a mano.',
        'Dar al playbook una cuenta de servicio con **least privilege**, credenciales gestionadas por el **PAM** (rotación, vaulting) y su propia trazabilidad, nunca la cuenta personal de una administradora.',
        'Guardar el código en control de versiones con revisión por pares: la automatización es software y se rompe como el software.',
        'Probar en un entorno de preproducción y, en producción, arrancar en **modo de solo recomendación** —el playbook propone y la analista aprueba— antes de dejarlo actuar solo.',
        'Mantener la **aprobación humana** para las acciones destructivas o de alto impacto: aislar el sistema industrial de la terminal, borrar buzones, desactivar cuentas de dirección.',
        'Instrumentar el propio flujo: registrar cada ejecución, alertar cuando **falle o deje de ejecutarse** y vigilar el uso de su cuenta privilegiada.',
        'Asignar un **dueño** y una fecha de revisión; si nadie lo mantiene, retirarlo antes de que se convierta en deuda técnica.',
      ],
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen: los cuatro reflejos del 4.7',
      md: 'Uno: cuando la pregunta pide el **beneficio de seguridad** de automatizar, la respuesta es la **consistencia** —enforcing baselines, standard configurations, menos deriva y menos error humano—, no «es más rápido» ni «ahorra personal»; la velocidad es un efecto colateral que se pregunta como **reaction time** solo cuando el escenario habla de contener a tiempo. Dos: el riesgo estrella es que la plataforma de orquestación se convierta en **single point of failure** y en **objetivo privilegiado**; si el enunciado describe una cuenta de servicio con permisos sobre todo el entorno, la respuesta correcta habla de **least privilege**, PAM y monitorización de esa cuenta, no de más automatización. Tres: los scripts sin dueño, sin documentación y sin control de versiones son **technical debt** y su pariente **ongoing supportability**; ojo con el distractor «complexity», que describe el flujo enrevesado, no el abandono. Cuatro: automatizar un proceso **roto o poco frecuente** no es la respuesta; primero se estabiliza y se documenta el procedimiento manual, y las acciones destructivas conservan aprobación humana.',
    },
    {
      t: 'check',
      q: {
        q: 'An auditor reviews the port authority orchestration platform and finds that all playbooks run under one service account that is a domain administrator and also holds full rights in the cloud tenant, with a static password stored in the platform. What is the MOST significant risk?',
        choices: [
          'The playbooks will run more slowly because of the extra permission checks',
          'Compromise of the orchestration platform yields immediate privileged access across the entire environment',
          'The service account will exceed its licence allocation',
          'Playbook code cannot be placed under version control while it uses a service account',
        ],
        answer: 1,
        explain:
          'An over-privileged, statically credentialed account concentrated in one platform turns that platform into a high-value target whose compromise hands the attacker the whole estate without any lateral movement, which is why least privilege, vaulting and rotation matter here. Slower execution is the tempting distractor because it sounds like a plausible operational cost, but permission checks are negligible and performance is not a security consequence at all.',
      },
    },
    {
      t: 'p',
      md: 'La automatización bien hecha te compra algo muy concreto: tiempo y consistencia para el momento en que la prevención falle. Y va a fallar. La siguiente lección es la que da sentido a todas las demás del dominio —el proceso de **respuesta a incidentes**—, y verás que sus dos primeras palabras, *preparation* y *detection*, son exactamente lo que has estado construyendo: baselines aplicados sin deriva, logs centralizados, alertas afinadas, accesos que se cortan en segundos y playbooks probados. Cuando suene la alarma de verdad en la terminal de contenedores, no vas a improvisar: vas a ejecutar.',
    },
  ],
  quiz: [
    {
      id: 'sp4m9q1',
      domain: 'Security Operations',
      prompt:
        'A security team replaces its manual server build checklist with an automated deployment template that applies the hardened baseline to every new server. Which security benefit does this MOST directly provide?',
      choices: [
        'It reduces the licensing cost of the operating system',
        'It removes the need to monitor the servers after deployment',
        'It enforces a consistent baseline so configuration drift and human error are largely removed at build time',
        'It guarantees that no vulnerabilities will be found in future scans',
      ],
      answer: 2,
      explain:
        'The core security value of automation is consistency: every system is built identically from the approved baseline, so the variation that manual builds introduce disappears. Removing the need to monitor is the tempting distractor because automation does reduce workload, but a consistent build says nothing about what happens after deployment, and monitoring for drift and new threats is still required.',
    },
    {
      id: 'sp4m9q2',
      domain: 'Security Operations',
      prompt:
        'Which statement BEST describes guard rails in the context of automation and orchestration?',
      choices: [
        'Automated policy enforcement that prevents or reverts configurations violating the organization\'s security standards',
        'A physical barrier installed around data centre equipment racks',
        'A scheduled report that lists configuration violations for later review',
        'A backup copy of orchestration scripts kept in a separate repository',
      ],
      answer: 0,
      explain:
        'Guard rails are preventive automated controls: they block a non-compliant configuration from taking effect, or roll it back automatically when it appears. The scheduled violation report is the tempting distractor because it addresses the same standards, but it is a detective control that only tells you about the problem after the insecure configuration has been live.',
    },
    {
      id: 'sp4m9q3',
      domain: 'Security Operations',
      prompt:
        'A SOC has automated user provisioning, deprovisioning, ticket creation, escalation, and containment actions in a single orchestration platform. Which risk should the security architect raise FIRST?',
      choices: [
        'Analysts will lose the technical skills required to write scripts',
        'The platform will produce more alerts than the SIEM can index',
        'Automation always costs more than the manual process it replaces',
        'The platform becomes a single point of failure and a high-value privileged target',
      ],
      answer: 3,
      explain:
        'Concentrating provisioning, escalation and containment in one platform means that its outage halts those functions and its compromise grants an attacker broad privileged control, so it needs the protection of a critical, highly privileged system. Cost is the tempting distractor because orchestration does carry real build and maintenance expense, but that is a budgeting concern, and it is not always higher than the manual process for frequent repeatable tasks.',
    },
    {
      id: 'sp4m9q4',
      domain: 'Security Operations',
      prompt:
        'A collection of automation scripts written years ago by an engineer who has left the company still runs nightly. They have no documentation, no version control, and no current owner, and they break whenever a vendor changes an API. Which consideration does this BEST illustrate?',
      choices: [
        'Complexity',
        'Technical debt and ongoing supportability',
        'Single point of failure',
        'Scaling securely',
      ],
      answer: 1,
      explain:
        'Undocumented, unowned and unmaintained automation is technical debt, and the question of who will keep it working as the environment changes is exactly what ongoing supportability means. Complexity is the tempting distractor because the scripts are certainly hard to work with, but complexity describes an intricate workflow, whereas the defining problem here is abandonment: no owner, no documentation, no maintenance.',
    },
    {
      id: 'sp4m9q5',
      domain: 'Security Operations',
      prompt:
        'When an account is confirmed as compromised, the port authority SOC wants the account disabled and its active sessions revoked within seconds instead of the current average of 35 minutes. Which automation use case and benefit pair BEST describes this goal?',
      choices: [
        'Continuous integration and testing, improving code quality',
        'Resource provisioning, enforcing standard infrastructure configurations',
        'Enabling and disabling services and access, improving reaction time',
        'Ticket creation, improving employee retention',
      ],
      answer: 2,
      explain:
        'Cutting access automatically is the enabling and disabling services and access use case, and shortening the gap between detection and containment is exactly the reaction time benefit. Ticket creation is the tempting distractor because a ticket is certainly generated as part of the response, but opening a case does not revoke anything, and employee retention is unrelated to the containment speed being measured here.',
    },
    {
      id: 'sp4m9q6',
      domain: 'Security Operations',
      prompt:
        'A development team is told to integrate security into its build pipeline so that vulnerable dependencies and insecure code patterns stop a release before it is deployed. Which automation use case does this represent?',
      choices: [
        'Continuous integration and testing',
        'User provisioning',
        'Escalation',
        'Security groups',
      ],
      answer: 0,
      explain:
        'Running static analysis and dependency checks automatically as part of the build, with the power to fail the release, is the continuous integration and testing use case. Escalation is the tempting distractor because both involve automated decisions inside a workflow, but escalation routes an unattended or worsening incident to the right people, whereas this scenario is about gating software before deployment.',
    },
    {
      id: 'sp4m9q7',
      domain: 'Security Operations',
      prompt:
        'A manager proposes automating a legacy quarterly reconciliation that is performed differently by each analyst, has no written procedure, and changes with every regulatory update. What should the security team recommend?',
      choices: [
        'Automate it immediately, since automation always enforces consistency',
        'Automate it and let each analyst maintain a personal copy of the script',
        'Reject any automation of regulatory processes as a matter of policy',
        'Document and stabilise the manual procedure first, then evaluate whether the task is frequent and repeatable enough to justify automating it',
      ],
      answer: 3,
      explain:
        'Automation pays off on frequent, repeatable, well-defined tasks, so the correct sequence is to stabilise and document the procedure before deciding whether the build and maintenance cost is justified. Automating immediately is the tempting distractor because consistency is indeed the main benefit of automation, but encoding an undefined and constantly changing process just produces brittle scripts that become technical debt.',
    },
  ],
};

// ---------------------------------------------------------------------------
// SP4M10 — Respuesta a incidentes: proceso, pruebas, RCA y threat hunting
// (SY0-701, objetivo 4.8)
// ---------------------------------------------------------------------------
const sp4m10: Module = {
  id: 'sp4m10',
  sectionId: 'sp4',
  title: 'Respuesta a incidentes: proceso, pruebas, RCA y threat hunting',
  minutes: 13,
  objectives: [
    'Ordenar las siete fases del incident response process (preparation, detection, analysis, containment, eradication, recovery, lessons learned) y describir qué significa dar por terminada cada una',
    'Justificar por qué la containment precede a la eradication y qué evidencia volátil se destruye si se invierte el orden',
    'Distinguir el training del testing y elegir entre tabletop exercise y simulation según lo que haya que validar',
    'Aplicar el root cause analysis para corregir la causa y no el síntoma, y convertir sus conclusiones en mejoras con dueño y plazo',
    'Diferenciar el threat hunting proactivo, guiado por hipótesis, de la respuesta reactiva guiada por alertas',
  ],
  blocks: [
    {
      t: 'p',
      md: 'Todo lo que has visto en el Dominio 4 —baselines, gestión de activos, vulnerabilidades, monitorización, capacidades de defensa, identidades y automatización— existe para reducir la probabilidad de que ocurra un incidente y para que, cuando ocurra, no te pille sin herramientas. El objetivo 4.8 es lo que pasa a partir de ese momento. Un **incident** no es cualquier evento raro: es un suceso que **compromete o amenaza** la confidencialidad, la integridad o la disponibilidad, y declararlo como tal es una decisión formal que arranca un reloj, activa un plan y moviliza a personas concretas. El proceso que CompTIA examina tiene **siete fases** y el examen las pregunta de tres formas: en qué orden van, qué se hace exactamente en cada una y —la trampa favorita— cuál es el error clásico de cada fase. En Halden lo vas a recorrer con el caso de la terminal de contenedores.',
    },
    { t: 'h', text: 'Las siete fases y qué significa terminar cada una' },
    {
      t: 'p',
      md: 'La primera fase es la única que ocurre **antes** del incidente, y es la que decide cómo van a salir las otras seis. La **preparation** no es papeleo: es el plan aprobado, los roles nombrados con sus suplentes, la lista de contactos accesible **fuera de banda** (si el correo corporativo está cifrado por el ransomware, tu lista de contactos en el correo no existe), las herramientas desplegadas y con retención suficiente, el kit forense preparado y la gente entrenada. Un equipo que en mitad del incidente descubre que no tiene logs del mes pasado o que nadie sabe quién puede autorizar apagar un sistema no está en la fase de análisis: está pagando su falta de preparación. A partir de ahí, cada fase tiene un criterio de cierre que conviene tener escrito, porque el error más común es pasar a la siguiente demasiado pronto.',
    },
    {
      t: 'list',
      ordered: true,
      items: [
        '**Preparation** — Terminada cuando existe un plan aprobado y probado, con roles y suplentes, comunicación fuera de banda, playbooks, telemetría desplegada, retención de logs suficiente para investigar y personal entrenado. La prueba de fuego: ¿podrías ejecutar las seis fases siguientes esta misma noche sin improvisar nada?',
        '**Detection** — Terminada cuando el evento ha sido reconocido como posible incidente, registrado con marca de tiempo y número de caso, clasificado por severidad según los **criterios de declaración** del plan y notificado a quien corresponde. Ver la alerta no es detectar: detectar es **declarar** y arrancar el reloj.',
        '**Analysis** — Terminada cuando sabes lo suficiente para decidir: si es un incidente real o un falso positivo, el **alcance** (qué cuentas, qué sistemas, qué datos), la línea temporal, los indicadores asociados y la severidad confirmada. Sin alcance no hay contención posible, porque contendrás la mitad.',
        '**Containment** — Terminada cuando el atacante no puede seguir extendiendo el daño y la **evidencia volátil está preservada**: aislamiento aplicado (cuarentena de VLAN, aislamiento desde el EDR, cuentas deshabilitadas, tokens y sesiones revocados, C2 bloqueado) y la monitorización confirma que no hay nueva propagación. Se distingue la contención **a corto plazo** —parar la hemorragia ya— de la **a largo plazo**, las medidas provisionales que permiten seguir operando mientras se reconstruye.',
        '**Eradication** — Terminada cuando se ha eliminado la causa y todo rastro del atacante: malware, mecanismos de **persistencia**, puertas traseras, cuentas creadas por el adversario, y la vulnerabilidad o el error de configuración explotados ya corregidos. Y verificada buscando los mismos indicadores en **todo** el parque, no solo en el equipo donde saltó la alerta.',
        '**Recovery** — Terminada cuando los sistemas se han restaurado desde una copia **verificada y anterior al compromiso** o reconstruido desde cero, se han validado con el área de negocio, están de vuelta en producción bajo **monitorización reforzada** durante un periodo definido y no reaparecen indicadores.',
        '**Lessons learned** — Terminada cuando se ha hecho la revisión posterior dentro del plazo fijado, con un **root cause analysis** documentado y una lista de mejoras concretas **con dueño y fecha**, y cuando esas mejoras han actualizado el plan, las reglas de detección y los baselines. Esta fase alimenta de nuevo a la preparation: si no cambia nada, no ha terminado.',
      ],
    },
    {
      t: 'check',
      q: {
        q: 'During a malware incident on a Halden Port Authority workstation, an analyst wants to remove the malware and reimage the machine as quickly as possible. Her lead stops her. Why must containment be completed before eradication?',
        choices: [
          'Because eradication cannot begin until the vendor confirms the malware family',
          'Because containment stops the spread and preserves volatile evidence that eradication would destroy',
          'Because reimaging a system is only allowed during the recovery phase',
          'Because containment restores the system to its pre-incident state',
        ],
        answer: 1,
        explain:
          'Containment first limits the attacker to the systems already affected and lets the team capture memory, sessions and logs, all of which vanish the moment a host is powered off or reimaged. The claim that reimaging belongs to recovery is the tempting distractor because recovery is indeed where systems return to service, but the reason for the order is evidence preservation and stopping the spread, not a naming rule about which phase owns the reimage.',
      },
    },
    { t: 'h', text: 'Contener antes de erradicar: el reflejo que el examen premia' },
    {
      t: 'p',
      md: 'La secuencia **containment → eradication → recovery** es la más preguntada del objetivo, y la razón es práctica. Cuando aparece un equipo comprometido, el instinto es desenchufarlo. Desenchufar contiene, sí, pero destruye a la vez la **memoria RAM** —procesos en ejecución, conexiones abiertas, claves de cifrado, malware que solo vive en memoria—, las sesiones activas y a veces los artefactos temporales; y si el incidente acaba en un procedimiento judicial o en una reclamación al seguro, esa evidencia ya no existe. La contención correcta **aísla sin apagar**: aislamiento de red desde el EDR (el equipo sigue encendido pero solo habla con la consola de gestión), cuarentena en una VLAN sin salida, deshabilitar la cuenta comprometida y **revocar sus sesiones y tokens**, bloquear el dominio de mando y control en el filtro DNS. Y contener no es solo tocar el equipo: si las credenciales del administrador están comprometidas, aislar un portátil mientras esas credenciales siguen siendo válidas en el resto del dominio no contiene nada. Solo después, con la evidencia asegurada y el alcance claro, se erradica; y la recovery espera a que la erradicación esté **verificada**, porque restaurar sobre un sistema donde queda la persistencia solo devuelve el incidente a producción.',
    },
    {
      t: 'table',
      headers: ['Fase', 'Objetivo', 'Error clásico'],
      rows: [
        [
          'Preparation',
          'Tener plan, roles, herramientas, telemetría y gente entrenada antes de que pase nada',
          'Un plan escrito que nunca se ha probado, y la lista de contactos guardada en el sistema que se cae',
        ],
        [
          'Detection',
          'Reconocer y declarar el incidente, con caso, hora y severidad',
          'Cerrar la alerta como ruido por fatiga, o no tener criterios de declaración y que nadie arranque el reloj',
        ],
        [
          'Analysis',
          'Determinar alcance, línea temporal, indicadores y severidad real',
          'Saltar directamente a remediar: se contiene un equipo y se dejan fuera las otras cuentas comprometidas',
        ],
        [
          'Containment',
          'Impedir que el daño se extienda preservando la evidencia',
          'Apagar o reinstalar la imagen de inmediato y perder la memoria volátil; o aislar el equipo dejando vivas las credenciales robadas',
        ],
        [
          'Eradication',
          'Eliminar causa, malware, persistencia y accesos del atacante',
          'Borrar el malware y dejar la puerta trasera o la vulnerabilidad explotada, con reinfección garantizada',
        ],
        [
          'Recovery',
          'Devolver el servicio validado y vigilado a producción',
          'Restaurar desde una copia posterior al compromiso, o reabrir sin monitorización reforzada',
        ],
        [
          'Lessons learned',
          'Entender la causa raíz y convertirla en mejoras que cambien el sistema',
          'Buscar culpables en vez de causas, o cerrar la reunión sin dueño ni fecha para ninguna acción',
        ],
      ],
    },
    { t: 'h', text: 'Entrenamiento y pruebas: tabletop frente a simulation' },
    {
      t: 'p',
      md: 'El plan solo vale si la gente sabe ejecutarlo, y eso se consigue con **training** y **testing**. El **training** es formación: que cada persona conozca su papel, sepa a quién avisar, cómo se declara un incidente y qué no debe tocar. El **testing** comprueba si el plan funciona, y CompTIA contrapone dos formatos. El **tabletop exercise** es una prueba **de discusión**: las personas implicadas —seguridad, TI, operaciones portuarias, comunicación, dirección, asesoría jurídica— se reúnen y recorren un escenario hablando, «¿qué harías ahora?, ¿a quién llamas?, ¿quién autoriza parar la grúa?». No se toca ningún sistema, es barato, no interrumpe nada y es imbatible para encontrar huecos en **roles, criterios de decisión, escalado y comunicación**. La **simulation** sí ejercita de verdad a los sistemas y a las personas con acciones reales pero controladas: una campaña de phishing simulada contra la plantilla, un ejercicio donde el equipo utiliza realmente sus herramientas para responder a eventos inyectados, un simulacro de aislamiento de un segmento. Cuesta más, puede impactar en la operación y hay que coordinarla, pero es la única de las dos que demuestra que las herramientas, los permisos y los tiempos **existen fuera del papel**. La regla de examen es simple: si lo que se valida es la **conversación** (decisiones, roles, contactos), tabletop; si lo que se valida es la **ejecución** (¿funciona el aislamiento?, ¿pican las personas?, ¿cuánto tardamos de verdad?), simulation.',
    },
    {
      t: 'check',
      q: {
        q: 'The Halden Port Authority has just approved a new incident response plan. Before investing in a full exercise, the CISO wants to confirm that roles, escalation paths, and the authority to declare an incident are clear, without touching any production system. Which activity fits BEST?',
        choices: [
          'A tabletop exercise walking the stakeholders through a scenario in discussion form',
          'A simulation that injects real events into the SOC tooling',
          'A penetration test of the container terminal network',
          'A full failover of the terminal systems to the recovery site',
        ],
        answer: 0,
        explain:
          'A tabletop exercise is discussion based, costs almost nothing, touches no systems, and is designed precisely to expose gaps in roles, decision authority and escalation. The simulation is the tempting distractor because it also tests incident response, but it exercises systems and people with real actions, which is more expensive and carries operational impact the CISO explicitly wants to avoid at this stage.',
      },
    },
    { t: 'h', text: 'Root cause analysis y threat hunting' },
    {
      t: 'p',
      md: 'El **root cause analysis (RCA)** es la disciplina de preguntar «¿por qué?» hasta llegar a algo que se pueda arreglar de verdad. Un análisis honesto no se detiene en «la analista abrió un adjunto malicioso»: sigue hasta «el gateway de correo no analizaba ese tipo de fichero», «la macro se ejecutó porque la política de Office no estaba aplicada a ese grupo» y «ese grupo quedó fuera de la política porque la excepción de hace dos años nunca caducó». La diferencia entre síntoma y causa es la diferencia entre reimaginar el portátil —y volver a hacerlo el mes que viene— y cerrar la excepción, corregir el baseline y añadir una detección. Por eso el RCA vive en la fase de **lessons learned** y su producto no es un informe bonito, sino una lista de cambios con dueño y fecha que reentran en la **preparation**. El **threat hunting**, en cambio, no espera a ningún incidente: es la búsqueda **proactiva** de actividad adversaria que **no ha generado ninguna alerta**. Parte de una **hipótesis** —normalmente alimentada por inteligencia de amenazas: «si el grupo que ataca puertos del Báltico usa esta técnica de persistencia, ¿aparece en nuestros endpoints?»— y la contrasta contra la telemetría que ya tienes. Asume que el adversario puede estar dentro y que tus detecciones tienen huecos. Su resultado más valioso no es solo encontrar al intruso: es que cada caza, encuentre o no algo, produce **nuevas reglas de detección** y revela dónde falta visibilidad. Reactivo es responder a la alerta; proactivo es salir a buscar sin ella.',
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen: los cinco reflejos del 4.8',
      md: 'Uno: memoriza el orden —**preparation, detection, analysis, containment, eradication, recovery, lessons learned**— y recuerda que la fase que más determina el resultado es la primera. Dos: **contén antes de erradicar**. Si el escenario ofrece «apagar el equipo» o «reinstalar su imagen inmediatamente», casi siempre es incorrecto: destruye la evidencia volátil; la respuesta suele ser **aislar** el sistema de la red manteniéndolo encendido y deshabilitar la cuenta revocando sus sesiones. Tres: «restaurar desde backup» pertenece a **recovery**, y la copia debe ser **anterior al compromiso** y estar verificada; restaurar antes de erradicar reintroduce el problema. Cuatro: **tabletop = discusión**, **simulation = ejecución real** de sistemas y personas; si la pregunta dice «sin impacto en producción y bajo coste», tabletop. Cinco: **threat hunting** es proactivo y parte de una hipótesis **sin alerta previa**; si en el enunciado hay una alerta, un ticket o un aviso del SIEM, eso es detección y respuesta, no hunting. Y en lessons learned se buscan **causas**, no culpables: sin dueño y sin fecha, la acción no existe.',
    },
    {
      t: 'check',
      q: {
        q: 'A SOC analyst reviews recent threat intelligence about an actor targeting Baltic port operators and, with no alert having fired, queries endpoint telemetry across the estate for the persistence technique described. What is she performing?',
        choices: [
          'Alert tuning',
          'Threat hunting',
          'Root cause analysis',
          'A tabletop exercise',
        ],
        answer: 1,
        explain:
          'Searching telemetry proactively against an intelligence-driven hypothesis, with no alert to react to, is the definition of threat hunting. Root cause analysis is the tempting distractor because both are investigative, but RCA explains why a known incident happened so the underlying cause can be fixed, whereas hunting looks for adversary activity that has not been detected at all.',
      },
    },
    {
      t: 'p',
      md: 'Ya sabes conducir el incidente de principio a fin y cerrar el ciclo para que la organización salga mejor de lo que entró. Falta la parte que convierte tu investigación en algo que aguante fuera del SOC: cómo se **adquiere y se preserva** la evidencia sin contaminarla, qué es una cadena de custodia y por qué un **legal hold** manda por encima del calendario de retención, y qué fuente de datos —logs de firewall, de endpoint, del sistema operativo, capturas de red— responde de verdad a cada pregunta de la investigación. Eso es la última lección del Dominio 4.',
    },
  ],
  quiz: [
    {
      id: 'sp4m10q1',
      domain: 'Security Operations',
      prompt:
        'Which sequence correctly represents the incident response process as defined by CompTIA?',
      choices: [
        'Preparation, detection, containment, analysis, recovery, eradication, lessons learned',
        'Preparation, detection, analysis, containment, eradication, recovery, lessons learned',
        'Detection, preparation, analysis, eradication, containment, recovery, lessons learned',
        'Preparation, analysis, detection, containment, recovery, eradication, lessons learned',
      ],
      answer: 1,
      explain:
        'The order runs preparation, detection, analysis, containment, eradication, recovery and lessons learned, so the team understands the scope before it isolates, isolates before it removes, and only then restores. The first option is the tempting distractor because containment does feel urgent, but containing before analysis means acting without knowing which accounts and systems are involved, so the response covers only part of the compromise.',
    },
    {
      id: 'sp4m10q2',
      domain: 'Security Operations',
      prompt:
        'An analyst confirms that a workstation is beaconing to a command and control server. Which action BEST reflects proper containment?',
      choices: [
        'Immediately power off the workstation and send it to storage',
        'Reimage the workstation from the standard build',
        'Delete the malicious files and reboot the workstation',
        'Isolate the workstation from the network while leaving it powered on, and disable the associated account and its sessions',
      ],
      answer: 3,
      explain:
        'Network isolation stops the beaconing and any lateral movement while keeping memory, running processes and open connections available for analysis, and disabling the account with its sessions prevents the stolen credentials from being used elsewhere. Powering the machine off is the tempting distractor because it certainly cuts the communication, but it destroys the volatile evidence that the investigation and any later legal action depend on.',
    },
    {
      id: 'sp4m10q3',
      domain: 'Security Operations',
      prompt:
        'Two weeks after an incident was declared closed, the same ransomware variant reappears on the rebuilt servers. Which phase was MOST likely performed inadequately?',
      choices: [
        'Detection',
        'Recovery',
        'Eradication',
        'Preparation',
      ],
      answer: 2,
      explain:
        'Reinfection with the same variant points to eradication: a persistence mechanism, a backdoor account or the exploited vulnerability was left in place and never verified across the whole estate. Recovery is the tempting distractor because the failure surfaced on restored servers, but recovery can only be as clean as the eradication that preceded it, and the defect is the residual attacker foothold rather than the restoration itself.',
    },
    {
      id: 'sp4m10q4',
      domain: 'Security Operations',
      prompt:
        'The Halden Port Authority is ready to restore its cargo manifest servers after an intrusion. Which check is MOST important before restoring from backup?',
      choices: [
        'That the backup is the most recent copy available',
        'That the backup was taken before the earliest confirmed date of compromise and its integrity is verified',
        'That the backup is stored on the same array as production for speed',
        'That the restoration is completed before the lessons learned meeting',
      ],
      answer: 1,
      explain:
        'A backup taken after the intrusion began will faithfully restore the implants left by the attacker, so the copy must predate the earliest confirmed compromise and be integrity checked before it goes back into production. Choosing the most recent copy is the tempting distractor because it minimises data loss, which is normally the goal, but here the newest copy is the one most likely to be contaminated.',
    },
    {
      id: 'sp4m10q5',
      domain: 'Security Operations',
      prompt:
        'Which statement BEST distinguishes a tabletop exercise from a simulation?',
      choices: [
        'A tabletop exercise is discussion based and touches no systems, while a simulation exercises real systems and people with controlled actions',
        'A tabletop exercise is performed by an external auditor, while a simulation is performed internally',
        'A tabletop exercise tests backups, while a simulation tests firewall rules',
        'A tabletop exercise is mandatory under most regulations, while a simulation is optional',
      ],
      answer: 0,
      explain:
        'The defining difference is the medium: a tabletop walks participants through a scenario in conversation to validate roles and decisions, whereas a simulation carries out real, controlled activity that exercises the tooling and the people. Who runs the exercise is the tempting distractor because external facilitators are common in tabletops, but either type can be run internally or externally, and that says nothing about what each one validates.',
    },
    {
      id: 'sp4m10q6',
      domain: 'Security Operations',
      prompt:
        'After a compromised account incident, the team resets the password and closes the case. A month later the same account is compromised again through the same phishing kit. What was missing from the response?',
      choices: [
        'A longer log retention period',
        'A second containment action',
        'Additional antivirus licences',
        'A root cause analysis that addressed why the account could be phished and used, rather than only the symptom',
      ],
      answer: 3,
      explain:
        'Resetting the password treats the symptom; root cause analysis asks why the phishing succeeded and why the stolen credential was sufficient to log in, producing fixes such as phishing-resistant MFA, mail filtering changes and a new detection. Adding containment is the tempting distractor because containment is genuinely important, but repeating the same containment action would not prevent the next successful phish either.',
    },
    {
      id: 'sp4m10q7',
      domain: 'Security Operations',
      prompt:
        'Which outcome BEST indicates that the lessons learned phase has been completed properly?',
      choices: [
        'Documented improvements with named owners and deadlines that update the plan, detections, and baselines',
        'A signed statement identifying the employee whose mistake enabled the intrusion',
        'A confirmation that all affected systems are back in production',
        'An executive summary distributed to the board within 24 hours',
      ],
      answer: 0,
      explain:
        'Lessons learned exists to change the organization, so it is finished when the root cause is documented and turned into concrete actions with owners and dates that feed back into preparation. Identifying the employee at fault is the tempting distractor because incidents do involve human actions, but a blame-focused review suppresses the reporting the process depends on and fixes nothing systemic.',
    },
    {
      id: 'sp4m10q8',
      domain: 'Security Operations',
      prompt:
        'A security team wants to reduce the time an undetected intruder can remain in the port authority network. Which activity is proactive rather than alert driven?',
      choices: [
        'Tuning SIEM correlation rules to reduce false positives',
        'Reviewing the queue of endpoint protection alerts each morning',
        'Threat hunting: forming a hypothesis from threat intelligence and searching telemetry for activity that raised no alert',
        'Escalating unassigned tickets automatically after two hours',
      ],
      answer: 2,
      explain:
        'Threat hunting starts from a hypothesis rather than from an alert and deliberately searches for adversary behaviour the existing detections missed, which is what shortens dwell time for an undetected intruder. Rule tuning is the tempting distractor because it does improve detection quality over time, but it refines the alerts the team already receives instead of looking for what never triggered one.',
    },
  ],
};

export const SP4_PART5: Module[] = [sp4m9, sp4m10];
