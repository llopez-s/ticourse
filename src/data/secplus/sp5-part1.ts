import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// SP5M1 — Gobernanza: políticas, estándares, procedimientos y guidelines
// (SY0-701, objetivo 5.1)
// ---------------------------------------------------------------------------
const sp5m1: Module = {
  id: 'sp5m1',
  sectionId: 'sp5',
  title: 'Gobernanza: políticas, estándares, procedimientos y guidelines',
  minutes: 12,
  objectives: [
    'Distinguir **policy**, **standard**, **procedure** y **guideline** por lo que obligan y por la pregunta que responde cada uno',
    'Reconocer las políticas que nombra el objetivo 5.1: **AUP**, **information security policies**, **business continuity**, **disaster recovery**, **incident response**, **SDLC** y **change management**',
    'Situar los procedimientos del examen: **change management**, **onboarding/offboarding** y **playbooks**',
    'Explicar por qué una **guideline** no es exigible y qué consecuencia tiene eso ante una auditoría',
    'Defender el **monitoring and revision** de la documentación: dueño identificado, ciclo de revisión y aprobación por la dirección',
  ],
  blocks: [
    {
      t: 'p',
      md: 'Bienvenida al dominio 5, **Security Program Management & Oversight**: el **20%** del SY0-701 y el que menos se parece a lo técnico. Aquí no se configura nada. Se decide **quién manda sobre qué**, se escribe lo que la organización se obliga a cumplir y se comprueba que se cumple. Es el dominio donde una analista deja de ser la persona que apaga fuegos y pasa a ser la persona que explica por qué el fuego era previsible. Y empieza por lo más aburrido y lo más rentable en el examen: la **jerarquía documental** del programa de seguridad. CompTIA pregunta por ella una y otra vez porque en la vida real casi todo el mundo llama «política» a cualquier documento, y eso, en una auditoría, cuesta dinero.',
    },
    { t: 'h', text: 'Los cuatro documentos y la pregunta que responde cada uno' },
    {
      t: 'p',
      md: 'Una **policy** dice **qué** hace la organización y **por qué**: es una declaración de intención aprobada por la dirección, **obligatoria** y deliberadamente **neutral respecto a la tecnología**, para que siga siendo válida cuando cambien los productos. «Los datos de los manifiestos de carga se protegen conforme a su clasificación» es una política: no menciona ni un algoritmo ni un fabricante. Un **standard** baja eso a tierra: es el **requisito concreto y obligatorio** que implementa la política —longitud mínima de contraseña, cifrados aprobados, reglas de control de acceso, medidas de seguridad física—. «Cifrado **AES-256** en reposo» y «contraseñas de al menos 14 caracteres» son estándares: siguen siendo de cumplimiento forzoso, pero ya son específicos y caducan cuando cambia la tecnología. Un **procedure** responde al **cómo**, paso a paso, para quien tiene que ejecutarlo: quién hace qué, en qué orden y con qué evidencia. Y una **guideline** es **recomendación**: buenas prácticas, consejo experto, ayuda para decidir donde el estándar deja margen. Esa última es la que más preguntas cuesta, porque la palabra clave del examen es que la guideline **no es obligatoria** y, por tanto, **no puede generar un incumplimiento**. Si algo tiene que exigirse, se escribe como estándar, no como recomendación.',
    },
    {
      t: 'check',
      q: {
        q: 'Three sentences appear in the security documentation of the Halden Port Authority. (1) "Staff must not install software that has not been approved." (2) "Approved remote access requires TLS 1.3 or above." (3) "We suggest choosing a passphrase made of four unrelated words." How should they be classified?',
        choices: [
          'Policy, standard, guideline',
          'Standard, policy, procedure',
          'Policy, procedure, standard',
          'Guideline, standard, policy',
        ],
        answer: 0,
        explain:
          'The first sentence states a mandatory organizational rule without naming any technology, which is a policy; the second fixes a specific mandatory technical requirement, which is a standard; the third is advice the reader may take or leave, which is a guideline. Calling the second one a policy is the common slip, but the moment a document names a version, a length or an algorithm it has stopped being technology-neutral and has become the standard that implements the policy.',
      },
    },
    { t: 'h', text: 'Las políticas que el objetivo nombra por su nombre' },
    {
      t: 'p',
      md: 'El objetivo 5.1 lista políticas concretas y conviene reconocerlas de un vistazo. La **acceptable use policy (AUP)** define qué uso puede darse a los sistemas, al correo, a la red y a los dispositivos de la organización, y es el documento que la plantilla **firma** al incorporarse: sin esa firma, sancionar un mal uso se vuelve resbaladizo. Las **information security policies** son el paraguas del programa: clasificación de la información, control de acceso, criptografía, gestión de proveedores. La **business continuity** describe cómo se mantiene el negocio funcionando durante una interrupción —procesos críticos, alternativas manuales, personal mínimo— y la **disaster recovery** cómo se recupera concretamente la tecnología después de un desastre; son hermanas, no sinónimas, y la continuidad es la más amplia. La **incident response policy** establece qué se considera incidente, quién declara uno y qué autoridad tiene el equipo de respuesta. La política de **SDLC** obliga a que la seguridad forme parte del ciclo de desarrollo —requisitos, revisión de código, pruebas antes de producción— en vez de aparecer al final. Y la de **change management** exige que ningún cambio en producción se haga sin solicitud, evaluación de impacto, aprobación, ventana y plan de vuelta atrás.',
    },
    {
      t: 'check',
      q: {
        q: 'Who must approve the information security policy of an organization for it to be enforceable?',
        choices: [
          'Senior leadership or the governing board, because their authority is what makes the document mandatory for everyone',
          'The security analyst who drafted it, because she knows the technical content best',
          'The internal audit function, because it will later test compliance with the document',
          'Every employee individually, because a policy that is not unanimously accepted cannot be applied',
        ],
        answer: 0,
        explain:
          'A policy binds the whole organization, so it has to be issued by the level that has authority over the whole organization: executive leadership or the board. Approval by internal audit is the tempting answer because auditors check policies, but audit has to stay independent of what it audits, and reviewing your own approvals destroys that independence.',
      },
    },
    { t: 'h', text: 'Procedimientos: change management, altas y bajas, playbooks' },
    {
      t: 'p',
      md: 'El **procedure** es donde la política se vuelve ejecutable y el examen destaca tres. El procedimiento de **change management** convierte la política de cambios en pasos reales: abrir la petición, documentar el impacto y las dependencias, obtener la aprobación del **CAB**, ejecutar en ventana, verificar y cerrar, con el **backout plan** escrito **antes** de tocar nada. Los procedimientos de **onboarding** y **offboarding** son los que más incidentes evitan: al entrar, crear la cuenta con los permisos de su rol, entregar el equipo y la credencial física, dar la formación inicial y recoger la firma de la AUP; al salir, **desactivar los accesos el mismo día**, recuperar equipo y tarjetas, transferir la propiedad de los datos y revisar qué accesos privilegiados quedaban a su nombre. Una cuenta de una persona que se fue hace seis meses es el hallazgo más repetido de cualquier auditoría, y es un fallo de procedimiento, no de tecnología. Y los **playbooks** son procedimientos especializados de respuesta: la secuencia concreta para ransomware, para una cuenta comprometida o para una fuga de datos, escrita en frío para que nadie tenga que improvisar en caliente.',
    },
    {
      t: 'table',
      headers: ['Documento', '¿Obligatorio?', 'Quién lo escribe y lo aprueba', 'Ejemplo en Halden'],
      rows: [
        [
          '**Policy**',
          'Sí, para toda la organización',
          'Redactada por seguridad o legal; **aprobada por la dirección o el consejo**',
          '«El uso de los sistemas del puerto se limita a fines profesionales autorizados» (AUP)',
        ],
        [
          '**Standard**',
          'Sí, dentro de su ámbito',
          'Redactado por el equipo técnico o de seguridad; aprobado por el responsable del área',
          '«Acceso remoto solo por VPN con MFA; cifrado AES-256 en reposo»',
        ],
        [
          '**Procedure**',
          'Sí, para quien ejecuta la tarea',
          'Redactado por quien opera el proceso; validado por su responsable',
          'Playbook de ransomware del SOC; checklist de baja de personal',
        ],
        [
          '**Guideline**',
          '**No**: es una recomendación',
          'Redactada por especialistas como consejo experto',
          '«Recomendamos passphrases de cuatro palabras y un gestor de contraseñas»',
        ],
      ],
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen: cuatro frases, cuatro etiquetas',
      md: 'Memoriza este cuarteto y resuelves cualquier pregunta de clasificación documental. **«El personal no instalará software no aprobado»** → **policy**: obligatorio, dice qué y por qué, sin tecnología. **«Las contraseñas tendrán al menos 14 caracteres»** → **standard**: obligatorio y **específico**. **«Para restablecer tu contraseña, entra en el portal, pulsa aquí y después allí»** → **procedure**: el paso a paso. **«Sugerimos una passphrase de cuatro palabras»** → **guideline**: recomendada, **no exigible**. Dos trampas frecuentes. Primera: si un enunciado dice que un equipo «no siguió la guideline», la respuesta correcta suele ser que **no hay incumplimiento** y que, si la práctica debe imponerse, hay que **convertirla en estándar**. Segunda: quien aprueba una política es la **dirección**, nunca quien la redactó ni el auditor que la revisará después. Y un apunte que cae mucho: un **playbook** —la secuencia paso a paso para responder a un ransomware o a una cuenta comprometida— es un **procedure**, aunque seguirlo sea obligatorio durante el incidente.',
    },
    { t: 'h', text: 'Monitoring and revision: la documentación también caduca' },
    {
      t: 'p',
      md: 'El objetivo cierra con dos palabras que parecen relleno y no lo son: **monitoring and revision**. Todo documento del programa necesita un **dueño identificado** —una persona, no un departamento— y un **ciclo de revisión** declarado: revisión anual como mínimo, y además siempre que cambie la ley aplicable, entre un servicio nuevo, se reorganice el área o un incidente demuestre que el documento no servía. Monitorizar significa comprobar que lo escrito **se aplica de verdad**: métricas de excepciones, hallazgos de auditoría, firmas de la AUP recogidas, cambios ejecutados fuera del proceso. Una política aprobada en 2019 que menciona departamentos que ya no existen y que nadie ha revisado desde entonces es, literalmente, un **hallazgo de auditoría**: no porque su contenido sea falso, sino porque demuestra que el programa de gobernanza no está vivo. Y hay un efecto práctico: una organización no puede exigir el cumplimiento de reglas que no ha comunicado, que nadie ha aceptado y que ni siquiera reflejan su estructura actual.',
    },
    {
      t: 'check',
      q: {
        q: 'An internal auditor at the port finds that several engineering teams ignore the "Secure Passphrase Guideline". No security policy and no password standard has been breached. What is the correct conclusion?',
        choices: [
          'The teams are in breach of the security programme and should receive a formal sanction',
          'There is no compliance violation, because a guideline is a recommendation; if the practice must be enforced it has to be rewritten as a standard',
          'The guideline must be deleted, because a document that nobody follows adds no value',
          'A finding should be raised against the guideline author for failing to enforce it',
        ],
        answer: 1,
        explain:
          'Guidelines are advisory by definition, so failing to follow one is not a compliance violation and cannot be sanctioned; the governance fix is to promote the requirement into a mandatory standard if the organization really needs it. Sanctioning the teams is the tempting answer because the advice was sensible, but punishing people for ignoring a non-mandatory document is exactly the confusion the four-document hierarchy exists to prevent.',
      },
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'En la Autoridad Portuaria de Halden',
      md: 'El consejo pide «la documentación del programa de seguridad» antes de una auditoría externa y aparece una carpeta compartida con veintiún archivos sin clasificar. Al ordenarlos salen las cuatro categorías. «Política de uso aceptable», firmada por la directora general y por cada persona al incorporarse: **policy**. «Requisitos criptográficos del puerto v3», con la lista de cifrados aprobados: **standard**. «Alta y baja de personal de terminal» y «Playbook: contenedor con manifiesto alterado»: **procedures**. «Consejos para viajar con portátil», redactado por el equipo de sistemas: **guideline**, y por eso el auditor no puede levantar un hallazgo porque nadie la siga. El verdadero problema es otro: tres documentos no tienen dueño y la política de continuidad se revisó por última vez en 2019, cuando la terminal de contenedores todavía era de un operador distinto.',
    },
    {
      t: 'p',
      md: 'Ya sabes qué documento es cada cosa y quién lo firma. La siguiente lección responde a la otra mitad del objetivo 5.1: **quién decide**. Estructuras de gobernanza —consejos, comités, entidades públicas y el eterno dilema entre gobierno centralizado y descentralizado—, los roles sobre los datos que el examen adora confundir —**owner**, **controller**, **processor**, **custodian** y **steward**— y los factores externos que obligan al puerto a cumplir varias reglas a la vez.',
    },
  ],
  quiz: [
    {
      id: 'sp5m1q1',
      domain: 'Security Program Management & Oversight',
      prompt:
        'A document approved by the executive board of a port authority states: "Employees must not install software that has not been approved by the IT department." Which type of governance document is this?',
      choices: [
        'A standard, because it defines a specific technical control',
        'A procedure, because it tells employees what to do',
        'A policy, because it states a mandatory organizational rule and its intent without naming any technology or steps',
        'A guideline, because employees are encouraged to follow it',
      ],
      answer: 2,
      explain:
        'The statement is mandatory, applies to everyone, expresses intent rather than implementation and was approved at the leadership level, which is the definition of a policy. Calling it a standard is the tempting error, but a standard would have to name the specific requirement, such as which software catalogue is authoritative or which allow-listing technology enforces it.',
    },
    {
      id: 'sp5m1q2',
      domain: 'Security Program Management & Oversight',
      prompt:
        'The information security policy of an organization says that data must be protected according to its classification. A separate one-page document states that data at rest must be encrypted with AES-256 and that passwords must be at least 14 characters. What is that second document?',
      choices: [
        'A standard, because it fixes the specific mandatory requirement that implements the policy',
        'A guideline, because it advises on encryption and password quality',
        'A procedure, because it explains how the settings are applied',
        'A second policy, because compliance with it is also mandatory',
      ],
      answer: 0,
      explain:
        'A standard is the specific, measurable and mandatory requirement derived from a policy, which is exactly what naming an algorithm and a minimum length does. Calling it a second policy is the plausible trap because it is indeed mandatory, but policies stay technology-neutral so that they survive the next product change, while standards are expected to be replaced as technology moves.',
    },
    {
      id: 'sp5m1q3',
      domain: 'Security Program Management & Oversight',
      prompt:
        'Which statement about guidelines is correct?',
      choices: [
        'Guidelines are mandatory but apply only to technical staff',
        'Guidelines replace standards in organizations that have no compliance obligations',
        'Guidelines are approved by regulators rather than by the organization itself',
        'Guidelines are recommendations, so not following one is not by itself a compliance violation',
      ],
      answer: 3,
      explain:
        'The defining characteristic of a guideline is that it advises rather than obliges, which is why an auditor cannot raise a non-compliance finding purely because a team did not follow one. Treating guidelines as mandatory for technical staff is the attractive distractor, but if an organization truly needs to enforce a practice it must promote that practice into a standard.',
    },
    {
      id: 'sp5m1q4',
      domain: 'Security Program Management & Oversight',
      prompt:
        'Which document type BEST describes a checklist that HR and IT follow when a new employee joins: create the account with role-based entitlements, issue the access badge, deliver the security briefing and collect the signed acceptable use acknowledgement?',
      choices: [
        'An acceptable use policy',
        'An onboarding procedure',
        'An access control standard',
        'A business continuity guideline',
      ],
      answer: 1,
      explain:
        'An ordered set of steps that named roles execute in sequence to complete a task is a procedure, and onboarding is one of the procedures the exam objective names explicitly. The acceptable use policy is the tempting choice because it appears inside the checklist, but the policy is the document being signed, not the step-by-step process that collects the signature.',
    },
    {
      id: 'sp5m1q5',
      domain: 'Security Program Management & Oversight',
      prompt:
        'A compliance review finds that the acceptable use policy of a port authority was approved in 2019, still names two departments that were dissolved in 2022, and has no recorded owner or review date. Which governance weakness does this represent?',
      choices: [
        'A failure of monitoring and revision: governance documents need a named owner and a defined review cycle to remain accurate and enforceable',
        'A configuration drift between the deployed baseline and the documented settings',
        'A separation of duties failure in the approval chain of the policy',
        'A missing right-to-audit clause in the acceptable use policy',
      ],
      answer: 0,
      explain:
        'Documents are controls too, and the objective calls out monitoring and revision precisely because an unowned, unreviewed policy stops describing the organization it is supposed to govern. Configuration drift is the appealing analogue and describes the same kind of decay, but it applies to system settings diverging from a technical baseline, not to a document that nobody has maintained.',
    },
    {
      id: 'sp5m1q6',
      domain: 'Security Program Management & Oversight',
      prompt:
        'A security team wants a change to production systems to be requested, impact-assessed, approved, executed inside a window and reversible. In which governance document does the requirement to do all this belong, and where do the actual steps belong?',
      choices: [
        'Both belong in the same guideline, so that teams can adapt them',
        'The requirement belongs in a standard and the steps in a policy',
        'Both belong in the incident response playbook',
        'The requirement belongs in the change management policy and the steps in the change management procedure',
      ],
      answer: 3,
      explain:
        'The policy establishes that no change reaches production without request, assessment, approval and a backout plan, while the procedure describes who submits what, in which order and with which evidence. Putting the requirement in a standard is the closest wrong answer, but a standard fixes measurable technical requirements rather than mandating that a governance process exist at all.',
    },
    {
      id: 'sp5m1q7',
      domain: 'Security Program Management & Oversight',
      prompt:
        'A newly hired analyst reads that the organization has an information security policy, a remote access standard and a VPN configuration procedure. Which document should she consult to find out WHY remote access is restricted at all?',
      choices: [
        'The VPN configuration procedure, because it documents the enforced settings',
        'The information security policy, because it states the organizational intent and the rule behind the restriction',
        'The remote access standard, because it lists the technical requirements',
        'The onboarding checklist, because it is given to every new employee',
      ],
      answer: 1,
      explain:
        'Policies exist to answer what the organization requires and why, so the rationale for restricting remote access lives there rather than in the documents that implement it. The remote access standard is the natural runner-up and does concern remote access, but it answers which specific requirements apply, not the intent that justifies having them.',
    },
  ],
};

// ---------------------------------------------------------------------------
// SP5M2 — Estructuras de gobernanza, roles sobre los datos y factores externos
// (SY0-701, objetivo 5.1)
// ---------------------------------------------------------------------------
const sp5m2: Module = {
  id: 'sp5m2',
  sectionId: 'sp5',
  title: 'Estructuras de gobernanza, roles sobre los datos y factores externos',
  minutes: 13,
  objectives: [
    'Diferenciar las **governance structures** del examen: **boards**, **committees** y **government entities**',
    'Comparar gobierno **centralizado** y **descentralizado** y nombrar el precio de cada opción',
    'Asignar correctamente los roles sobre los datos: **data owner**, **controller**, **processor**, **custodian** y **steward**',
    'Responder sin dudar a quién aprueba el acceso a un conjunto de datos y quién lo implementa',
    'Reconocer los **external considerations** —regulatory, legal, industry, local/regional, national y global— que se acumulan sobre una misma organización',
  ],
  blocks: [
    {
      t: 'p',
      md: 'La lección anterior ordenó los papeles. Esta ordena a las personas. El objetivo 5.1 cierra con tres bloques que en el examen aparecen mezclados y que conviene separar en la cabeza: **quién decide** (las estructuras de gobierno), **quién responde de cada dato** (los roles) y **qué reglas externas se le imponen a la organización aunque no las haya elegido**. La Autoridad Portuaria de Halden es un caso ideal porque acumula las tres capas: tiene un consejo con representación pública, opera terminales en cuatro países y está sujeta a la vez a normativa marítima nacional, a la ley europea de privacidad y a los requisitos de la industria de tarjetas por su sistema de venta de billetes.',
    },
    { t: 'h', text: 'Estructuras de gobernanza: consejos, comités y entidades públicas' },
    {
      t: 'p',
      md: 'Un **board** —el consejo de administración o su equivalente— es el órgano con **responsabilidad última**: aprueba la estrategia, fija el apetito de riesgo, aprueba las políticas de máximo nivel y responde ante accionistas, ciudadanía o reguladores. No gestiona: **supervisa**. Un **committee** es un grupo de trabajo permanente o temporal al que el consejo delega una materia concreta —un comité de seguridad de la información, un comité de riesgos, un comité de auditoría— y que se reúne con regularidad para revisar riesgos, aprobar excepciones y **recomendar** al consejo. La delegación es de trabajo, no de responsabilidad: el consejo sigue respondiendo. Las **government entities** son la tercera pata y la que más se olvida: en organizaciones públicas o reguladas, una autoridad externa participa realmente en el gobierno —nombra miembros, impone requisitos, inspecciona, autoriza o retira licencias—. En un puerto eso no es teórico: la autoridad marítima nacional puede exigir un plan de protección aprobado antes de dejar operar la terminal.',
    },
    {
      t: 'p',
      md: 'La otra distinción del objetivo es de forma, no de órgano: **centralized** frente a **decentralized governance**. En el modelo **centralizado**, una única función redacta y aprueba política, estándares y excepciones para toda la organización. Gana **consistencia** —el mismo control en Halden y en la terminal de Rotterdam—, facilita demostrar cumplimiento ante un auditor y evita que cada unidad reinvente la rueda; pierde **velocidad y encaje local**, porque una regla escrita en la sede puede ser inaplicable, o incluso ilegal, en otra jurisdicción. En el modelo **descentralizado**, cada unidad de negocio o cada región decide con autonomía. Gana **agilidad y adaptación** al contexto; pierde **coherencia** y visibilidad, y genera el problema clásico de que nadie sabe qué nivel de protección real tiene el grupo. La respuesta madura casi siempre es híbrida —política y estándares mínimos centralizados, implementación y procedimientos locales—, pero el examen quiere sobre todo que sepas nombrar el **trade-off**: consistencia contra velocidad.',
    },
    {
      t: 'check',
      q: {
        q: 'A port authority operating terminals in four countries decides that one central function will write and approve all security policies and standards, which every terminal must then follow. What is the MAIN trade-off of this choice?',
        choices: [
          'Consistency and easier oversight, at the cost of slower adaptation to local conditions and requirements',
          'Faster local decisions, at the cost of inconsistent controls between terminals',
          'Lower audit cost, at the cost of losing executive accountability for security',
          'Stronger cryptography, at the cost of higher latency between the sites',
        ],
        answer: 0,
        explain:
          'Centralized governance produces one uniform rule set that is far easier to oversee and to evidence, and the price it pays is responsiveness when a local jurisdiction or a local process needs something different. The second option describes the opposite model, decentralized governance, so it is the natural distractor for anyone who reads the question too quickly.',
      },
    },
    { t: 'h', text: 'Roles sobre sistemas y datos: quién decide y quién implementa' },
    {
      t: 'p',
      md: 'Este es el bloque que más puntos regala si lo tienes claro y más los quita si lo confundes. El **data owner** es un **rol de negocio**, no de tecnología: la persona responsable de un conjunto de datos que **lo clasifica**, define quién debe poder verlo, **aprueba los accesos** y asume el riesgo de mantenerlo. En Halden, la jefa de operaciones de terminal es la owner de los datos de asignación de atraques; el administrador de la base de datos, no. El **data controller** es la figura legal de privacidad: la entidad que **decide la finalidad y los medios** del tratamiento —para qué se recogen los datos personales y cómo se van a tratar—. El **data processor** trata datos personales **por cuenta y siguiendo las instrucciones del controller**: una nómina en SaaS, un proveedor de correo, una plataforma de analítica. El processor no puede decidir por su cuenta usar esos datos para otra finalidad; si lo hace, deja de ser processor y se convierte en controller, con todas las obligaciones que eso arrastra. Y el **data custodian** es quien **implementa y mantiene los controles día a día**: aplica permisos, cifra, hace copias, restaura, parchea y vigila. El custodian ejecuta las decisiones del owner; nunca las toma. El **data steward** es la variante centrada en la **calidad y el contexto** del dato: se ocupa de que esté bien definido, sea correcto, esté etiquetado y se use conforme a su significado.',
    },
    {
      t: 'table',
      headers: ['Rol', 'Qué decide o qué hace', 'Puesto típico en Halden'],
      rows: [
        [
          '**Data owner**',
          'Clasifica el dato, **aprueba quién accede** y asume el riesgo; rol de negocio, rinde cuentas',
          'Jefa de operaciones de terminal, para los datos de atraques y manifiestos',
        ],
        [
          '**Data controller**',
          'Decide la **finalidad y los medios** del tratamiento de datos personales',
          'La propia Autoridad Portuaria como entidad, frente a los datos de su plantilla y de los pasajeros',
        ],
        [
          '**Data processor**',
          'Trata los datos **siguiendo las instrucciones** del controller, sin decidir la finalidad',
          'El proveedor SaaS de nóminas y el operador cloud que aloja el portal de carga',
        ],
        [
          '**Data custodian**',
          '**Implementa y mantiene** los controles: permisos, cifrado, copias, restauraciones, registros',
          'Administrador de bases de datos y equipo de sistemas del puerto',
        ],
        [
          '**Data steward**',
          'Cuida la **calidad, la definición y el uso correcto** del dato',
          'Responsable de datos maestros de la oficina de planificación portuaria',
        ],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'A researcher asks for read access to the berth-allocation dataset. The database administrator maintains the system and holds the permissions, the SOC monitors access to it, and the head of terminal operations is accountable for the business use of the data. Who should approve the request?',
        choices: [
          'The database administrator, because she is the one who can grant the permission',
          'The head of terminal operations, as the data owner',
          'The SOC, because it is responsible for monitoring who reads the data',
          'The privacy office, because any request for access to data is a privacy decision',
        ],
        answer: 1,
        explain:
          'Approving access is an ownership decision, and the owner is the business role accountable for the dataset and its classification, so the head of terminal operations decides and the administrator then implements. Choosing the database administrator is the classic trap: being technically able to grant an entitlement is not the same as being entitled to authorize it, and that separation is exactly what the owner and custodian split protects.',
      },
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen: el owner decide, el custodian ejecuta',
      md: 'Tres reflejos que resuelven casi todas las preguntas de roles. **Primero:** si la pregunta es **quién aprueba el acceso** a un conjunto de datos o **quién lo clasifica**, la respuesta es el **data owner**, un rol de **negocio**, y nunca el administrador de sistemas, el custodian ni el equipo de seguridad, por muy capaces que sean de tocar los permisos. **Segundo:** si un proveedor externo trata tus datos **según tus instrucciones** —nóminas, cloud, marketing—, ese proveedor es un **processor**, y tú sigues siendo el **controller** porque tú decides la finalidad; externalizar el tratamiento **no externaliza la responsabilidad**. **Tercero:** cuidado con el par custodian/steward: el **custodian** implementa controles técnicos y el **steward** vela por la calidad y el significado del dato. Si el enunciado habla de cifrado, permisos o copias, es **custodian**; si habla de definiciones, exactitud o uso adecuado, es **steward**.',
    },
    {
      t: 'check',
      q: {
        q: 'The Halden Port Authority contracts a payroll SaaS provider. The port decides which employee data is collected and for what purpose; the provider stores and processes that data strictly according to the contract and the port instructions. What role does the provider play?',
        choices: [
          'Data owner, because the data now resides in its systems',
          'Data controller, because it performs the processing',
          'Data processor, because it acts on the instructions of the controller and does not decide the purpose',
          'Data subject, because it holds personal information',
        ],
        answer: 2,
        explain:
          'The party that decides the purposes and means of processing is the controller, and a supplier that merely executes those instructions under contract is a processor. Calling the provider the controller is the tempting answer because it does the actual processing, but performing the work does not transfer the decision-making authority, and the port remains responsible for the data it outsourced.',
      },
    },
    { t: 'h', text: 'Factores externos: las reglas que no elegiste' },
    {
      t: 'p',
      md: 'Ninguna organización escribe su programa de seguridad en una hoja en blanco. El objetivo enumera seis **external considerations** y espera que veas que **se acumulan**, no que se sustituyen. Las **regulatory** son las obligaciones que impone un regulador sectorial y cuyo incumplimiento tiene consecuencias administrativas: una autoridad marítima que exige un plan de protección portuaria aprobado. Las **legal** son las leyes generales que aplican a cualquiera —contratos, protección de datos, notificación de brechas, conservación de pruebas—. Las **industry** no son ley sino requisitos del sector o de tus socios comerciales, y se imponen por contrato: el estándar de la industria de tarjetas de pago vincula al puerto porque acepta tarjetas, y perderlo significa dejar de cobrar, que a efectos prácticos duele igual que una multa. Y las tres restantes son geográficas: **local/regional** (ordenanzas municipales, normativa autonómica o de un estado federado, requisitos de la autoridad portuaria local), **national** (ley del país, seguridad nacional, aduanas) y **global** (normas que cruzan fronteras: transferencias internacionales de datos, sanciones, convenios marítimos). Cuando dos exigencias se solapan, la regla operativa es cumplir la **más estricta** y documentar por qué; cuando **se contradicen** de verdad —un país exige entregar un dato que otro prohíbe transferir— eso deja de ser una decisión técnica y sube a legal y a la dirección.',
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'En la Autoridad Portuaria de Halden',
      md: 'El comité de seguridad de la información revisa un solo servicio, el portal de venta de billetes de pasaje, y le caen encima las seis capas. **Regulatory:** la autoridad marítima nacional exige que el control de acceso a la terminal de pasajeros esté auditado cada año. **Legal:** la ley de protección de datos obliga a notificar una brecha en 72 horas. **Industry:** el estándar de tarjetas de pago prohíbe almacenar el código de verificación de la tarjeta. **Local:** el ayuntamiento exige conservar 30 días las grabaciones de las cámaras del acceso público. **National:** aduanas exige conservar cinco años los datos de manifiesto. **Global:** parte del tráfico se aloja en una región fuera de la UE y hace falta una base legal para la transferencia. Ninguna de las seis cancela a las otras. La analista propone una matriz de requisitos por dato, la owner de cada conjunto la valida y el equipo de sistemas —custodian— implementa lo que salga.',
    },
    {
      t: 'check',
      q: {
        q: 'A passenger ticketing service at the port is simultaneously subject to national maritime rules, a regional privacy law and payment-card industry requirements. Which statement BEST describes the situation?',
        choices: [
          'Only the national rules apply, because national law overrides regional and industry requirements',
          'Multiple external considerations apply at once, so the programme must satisfy the strictest combination of them',
          'The industry requirements can be disregarded, because they are contractual rather than law',
          'The organization may pick whichever framework is cheapest to certify against',
        ],
        answer: 1,
        explain:
          'Regulatory, legal, industry and geographic considerations stack on top of each other, so a control set has to meet all of them and, where they overlap, the most demanding version. Dismissing the card-industry requirements is the attractive shortcut because they are not statute, but they are contractually binding and losing compliance means losing the ability to take card payments at all.',
      },
    },
    {
      t: 'p',
      md: 'Con esto queda cerrado el objetivo 5.1: documentos, órganos, roles y presiones externas. La siguiente lección entra en el corazón del dominio, el **risk management** del 5.2, y cambia el registro por completo: identificación de riesgos, cadencias de evaluación —ad hoc, recurring, one-time y continuous— y el análisis **cualitativo** frente al **cuantitativo**, con las fórmulas que el examen espera que sepas calcular a mano: **EF**, **SLE**, **ARO** y **ALE**.',
    },
  ],
  quiz: [
    {
      id: 'sp5m2q1',
      domain: 'Security Program Management & Oversight',
      prompt:
        'A department head is accountable for a customer dataset, assigns its classification level and decides which roles may read it. A systems administrator configures the permissions, encryption and backups. Which pair of roles is described?',
      choices: [
        'Data controller and data processor',
        'Data owner and data custodian',
        'Data steward and data subject',
        'Data processor and data owner',
      ],
      answer: 1,
      explain:
        'Classifying data and deciding who may access it is ownership, while applying permissions, encryption and backups is custodianship, so the pair is owner and custodian. Controller and processor is the tempting alternative because it is also a decide-versus-execute pair, but those two terms describe parties in a privacy relationship rather than internal roles over an organizational dataset.',
    },
    {
      id: 'sp5m2q2',
      domain: 'Security Program Management & Oversight',
      prompt:
        'Under privacy legislation, which party determines the purposes and the means of processing personal data?',
      choices: [
        'The data processor',
        'The data subject',
        'The data custodian',
        'The data controller',
      ],
      answer: 3,
      explain:
        'The controller is defined by decision-making authority: it decides why personal data is processed and how, and it carries the resulting accountability. The processor is the obvious distractor because it is the party actually handling the data, but a processor may only act on documented instructions and never sets the purpose on its own.',
    },
    {
      id: 'sp5m2q3',
      domain: 'Security Program Management & Oversight',
      prompt:
        'A hospital contracts a cloud analytics company to run reports on patient records using only the parameters the hospital specifies. The analytics company decides to reuse the same records to train a commercial model of its own. What is the significance of this decision?',
      choices: [
        'By determining a new purpose for the data on its own initiative, the company stops acting as a processor and takes on controller responsibilities',
        'Nothing changes, because a processor may use the data it holds for any internal purpose',
        'The hospital becomes the processor, since it no longer controls what happens to the data',
        'The company becomes the data custodian and inherits the classification decisions',
      ],
      answer: 0,
      explain:
        'What separates a controller from a processor is who decides the purpose of the processing, so a supplier that unilaterally invents a new purpose has assumed the controller role and its obligations. Saying that nothing changes is the dangerous distractor: possession of the data never grants the right to repurpose it, and doing so is one of the most common contractual and regulatory breaches in outsourcing.',
    },
    {
      id: 'sp5m2q4',
      domain: 'Security Program Management & Oversight',
      prompt:
        'Which responsibility belongs to the data custodian rather than to the data owner?',
      choices: [
        'Assigning the classification level of the dataset',
        'Approving which business roles may read the dataset',
        'Applying the encryption, backups and access permissions that implement the decisions made about the dataset',
        'Accepting the residual risk of continuing to hold the dataset',
      ],
      answer: 2,
      explain:
        'The custodian is the operational role that implements and maintains controls day to day, which is exactly what configuring encryption, backups and permissions is. Assigning classification and approving access sound technical enough to tempt, but both are decisions reserved to the owner, and residual risk acceptance is an accountability that cannot be delegated to the people running the systems.',
    },
    {
      id: 'sp5m2q5',
      domain: 'Security Program Management & Oversight',
      prompt:
        'A port authority establishes a standing group of department heads that meets monthly to review security risks, approve exceptions and recommend policy changes to the executive board. Which governance structure does this describe?',
      choices: [
        'A government entity',
        'A data processor',
        'The board of directors itself',
        'A committee',
      ],
      answer: 3,
      explain:
        'A committee is a delegated standing group that works a specific subject area and reports recommendations upward, which is precisely the arrangement described. Answering that this is the board is the near miss, but the board holds ultimate accountability and approves rather than recommends, and here the group explicitly escalates its recommendations to that board.',
    },
    {
      id: 'sp5m2q6',
      domain: 'Security Program Management & Oversight',
      prompt:
        'A multinational group lets each regional business unit write and approve its own security standards, so that every region can move at its own pace. Which drawback is MOST characteristic of this model?',
      choices: [
        'Regional units will be unable to comply with any local legal requirement',
        'Control coverage becomes inconsistent between regions and group-wide oversight and reporting get harder',
        'Security decisions can no longer be made quickly enough to support the business',
        'The group loses the ability to classify its data at all',
      ],
      answer: 1,
      explain:
        'Decentralized governance buys local speed and fit, and the price is uneven protection across the group plus the difficulty of proving a consistent posture to auditors and regulators. Slower decisions is the tempting answer because it is a real governance drawback, but that is the weakness of the centralized model, not of the decentralized one described here.',
    },
    {
      id: 'sp5m2q7',
      domain: 'Security Program Management & Oversight',
      prompt:
        'A port terminal must retain cargo manifest data for five years under national customs law, while a regional privacy regulation gives individuals the right to request deletion of their personal data. How should the security programme treat this overlap?',
      choices: [
        'Apply only the privacy regulation, because privacy rights always take precedence over retention duties',
        'Apply only the customs law, because national law is the highest authority the terminal answers to',
        'Recognize that both external considerations apply, document how each dataset satisfies the stricter obligation, and escalate genuine conflicts to legal counsel and leadership',
        'Delete all manifest data after one year, as a compromise between the two requirements',
      ],
      answer: 2,
      explain:
        'External considerations accumulate rather than cancel each other, so the programme maps each dataset against every obligation it carries and treats a real contradiction as a legal and executive decision rather than a technical one. Picking a middle retention period is the dangerous distractor because a self-invented compromise breaches the statutory retention duty and satisfies neither authority.',
    },
  ],
};

export const SP5_PART1: Module[] = [sp5m1, sp5m2];
