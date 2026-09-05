import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// SP5M5 — Riesgo de terceros: evaluación, contratos y monitorización
// (SY0-701, objetivo 5.3)
// ---------------------------------------------------------------------------
const sp5m5: Module = {
  id: 'sp5m5',
  sectionId: 'sp5',
  title: 'Riesgo de terceros: evaluación, contratos y monitorización',
  minutes: 13,
  objectives: [
    'Elegir la técnica de **vendor assessment** adecuada: **penetration testing**, **right-to-audit clause**, **evidence of internal audits**, **independent assessments** y **supply chain analysis**',
    'Situar la **due diligence** antes de la firma y el **vendor monitoring** después, y detectar un **conflict of interest** en la selección',
    'Distinguir **SLA**, **MOU**, **MOA**, **MSA**, **SOW/WO**, **NDA** y **BPA** por lo que cada uno fija de verdad',
    'Reconocer la trampa clásica del examen: sin cláusula de auditoría firmada, no hay auditoría posible',
    'Diseñar una monitorización continua del proveedor con **questionnaires**, informes independientes y **rules of engagement**',
  ],
  blocks: [
    {
      t: 'p',
      md: 'Hasta ahora has trabajado el riesgo como si viviera dentro de casa: identificarlo, medirlo, decidir qué hacer con él y anotarlo en el registro. El objetivo 5.3 mueve el foco a la parte del riesgo que ya no está bajo tu control directo, y que en una organización moderna es la mayoría. En la **Autoridad Portuaria de Halden** el sistema que asigna atraques lo aloja un proveedor holandés, el mantenimiento de las grúas lo hace un contratista alemán con acceso remoto a los **PLC**, la declaración aduanera viaja por una plataforma comunitaria compartida con otros veinte puertos, y la nómina la calcula un **SaaS** que guarda los datos personales de mil doscientas personas. Ninguno de esos sistemas es tuyo. Todos son tu problema. La idea que el examen quiere que interiorices es sencilla y desagradable: **puedes externalizar la operación, pero no la responsabilidad**. Si el proveedor pierde los datos, quien responde ante la reguladora, ante la prensa y ante la plantilla es el puerto.',
    },
    { t: 'h', text: 'Vendor assessment: cómo se comprueba a un proveedor' },
    {
      t: 'p',
      md: 'Evaluar a un tercero es responder a una pregunta concreta —¿este proveedor protege lo mío al nivel que yo prometí protegerlo?— con evidencia y no con confianza. El examen enumera varias formas de conseguir esa evidencia, y espera que sepas cuánto pesa cada una. El **penetration testing** del proveedor es la más intrusiva: alguien ataca de verdad el servicio contratado y demuestra si se puede romper. Solo es posible con autorización escrita, y en un servicio multi-cliente el proveedor casi siempre te ofrecerá en su lugar su propio informe. La **right-to-audit clause** es la llave que abre todo lo demás: una cláusula contractual que te da derecho a inspeccionar los controles del proveedor, a pedir evidencia o a enviar auditoras. La **evidence of internal audits** son las auditorías que el proveedor se hace a sí mismo: informan, pero las escribe la parte interesada. Las **independent assessments** son informes de un tercero sin vínculo con el proveedor —del estilo de un informe **SOC 2 Type II** o una certificación **ISO 27001**— y su valor viene precisamente de esa independencia; aun así se leen con lupa, porque lo que importa es el **alcance** (qué sistemas cubre) y el **periodo** (qué meses cubre). Y la **supply chain analysis** mira más allá del proveedor: quiénes son sus proveedores, qué subcontrata, de dónde viene el hardware y el software que te entrega y quién más toca tus datos por el camino. Los **questionnaires** —cuestionarios de seguridad que el proveedor rellena— cierran la lista: son baratos y rápidos, sirven para cribar, pero son **autodeclarados**.',
    },
    {
      t: 'check',
      q: {
        q: 'The vendor that supplies the terminal operating system at the Halden Port Authority quietly subcontracts its database support to a firm in another jurisdiction, which now holds administrative access to production data. Which vendor assessment activity is designed to surface this situation?',
        choices: [
          'Supply chain analysis, because it examines the vendor own suppliers, subcontractors and the origin of what they deliver',
          'A non-disclosure agreement, because it binds anyone who touches the data to confidentiality',
          'A service level agreement review, because subcontracting affects availability targets',
          'An acceptable use policy, because it defines who may access production systems',
        ],
        answer: 0,
        explain:
          'Supply chain analysis is the activity that looks past the company whose name is on the contract and maps the fourth parties who actually handle your data, which is exactly the exposure described. An NDA is the tempting answer because confidentiality is clearly involved, but signing a confidentiality obligation does not discover the subcontractor and does not tell you it exists.',
      },
    },
    { t: 'h', text: 'Vendor selection: due diligence y conflict of interest' },
    {
      t: 'p',
      md: 'La **due diligence** es la investigación que se hace **antes de firmar**: solidez financiera del proveedor (un proveedor que quiebra es un incidente de disponibilidad), estructura de propiedad y jurisdicción, historial de brechas y cómo las gestionó, certificaciones vigentes, referencias de clientes parecidos, y capacidad real de cumplir lo que promete el comercial. Es el momento en que aún tienes poder de negociación, y por eso es también el momento de meter en el contrato la **right-to-audit clause**, las obligaciones de notificación de incidentes y las condiciones de devolución y borrado de datos al terminar. Un mes después de la firma ya no puedes pedir nada de eso: solo puedes rogar. El segundo concepto de la selección es el **conflict of interest**: quien evalúa o adjudica no puede tener un interés personal, familiar o económico en alguno de los candidatos. No es un problema de honradez individual, es un problema de proceso: el conflicto se **declara** y la persona afectada **se aparta** de la evaluación. Un conflicto no declarado convierte cualquier adjudicación posterior en un hallazgo de auditoría, aunque la decisión hubiera sido técnicamente correcta.',
    },
    {
      t: 'check',
      q: {
        q: 'Six months after signing, the port asks a cloud vendor to let its internal auditors review access-control evidence. The vendor refuses and points out that the contract says nothing about audits. What should have been done differently?',
        choices: [
          'The port should have signed a non-disclosure agreement covering the audit findings',
          'The port should have negotiated a right-to-audit clause into the contract before signing it',
          'The port should have raised the availability target in the service level agreement',
          'The port should have required the vendor to sign an acceptable use policy',
        ],
        answer: 1,
        explain:
          'A right-to-audit clause is a contractual permission, so it only exists if it was agreed while the contract was being negotiated, which is why due diligence is the moment to insist on it. An NDA is the classic distractor because it also involves audit material, but it governs the confidentiality of information already shared and grants no inspection rights whatsoever.',
      },
    },
    { t: 'h', text: 'Los acuerdos: qué firma exactamente cada documento' },
    {
      t: 'p',
      md: 'El examen dedica varias preguntas a distinguir siglas de contratos, y casi siempre te da un escenario para que elijas el documento correcto. El **SLA** (service level agreement) es donde viven los **niveles de servicio medibles** y sus **penalizaciones**: disponibilidad del 99,9%, respuesta a incidencias críticas en dos horas, créditos de servicio si no se cumple. Si en el enunciado aparece un número que se puede medir y una consecuencia si no se alcanza, es un SLA. El **MOU** (memorandum of understanding) expresa **intención**: dos organizaciones escriben en qué quieren colaborar, sin crear obligaciones exigibles; el **MOA** (memorandum of agreement) es su hermano más serio, porque además reparte responsabilidades y recursos concretos y se acerca mucho más a un compromiso vinculante. El **MSA** (master service agreement) es el **paraguas**: se negocia una vez y fija responsabilidad civil, confidencialidad, propiedad intelectual, facturación y ley aplicable para toda la relación. Bajo ese paraguas cuelgan el **SOW** (statement of work) y el **WO** (work order), que son los que describen **el trabajo concreto**: alcance, entregables, hitos, fechas y criterios de aceptación de un proyecto en particular. El **NDA** (non-disclosure agreement) cubre solo una cosa, la **confidencialidad** de la información que se intercambia, y suele firmarse antes de enseñar arquitectura, datos o hallazgos. Y el **BPA** (business partner agreement) regula cómo **dos socios comparten** responsabilidades, recursos, beneficios y riesgos en una actividad conjunta: no es un cliente comprando a un proveedor, son dos partes operando juntas.',
    },
    {
      t: 'table',
      headers: ['Acuerdo', '¿Vinculante?', 'Qué fija', 'Cuándo lo firmas'],
      rows: [
        [
          '**SLA**',
          'Sí, es contractual',
          'Niveles de servicio **medibles** y penalizaciones por incumplirlos',
          'Siempre que necesites exigir y medir rendimiento o disponibilidad',
        ],
        [
          '**MOU**',
          'Normalmente no',
          'Intención y expectativas comunes, sin obligaciones exigibles',
          'Colaboración, intercambio de información, marco previo a un contrato',
        ],
        [
          '**MOA**',
          'Más cerca del sí',
          'Reparto concreto de responsabilidades, tareas y recursos',
          'Cuando la colaboración implica compromisos que alguien debe cumplir',
        ],
        [
          '**MSA**',
          'Sí',
          'Términos paraguas: responsabilidad, confidencialidad, pagos, ley aplicable',
          'Al abrir una relación larga con un proveedor recurrente',
        ],
        [
          '**SOW / WO**',
          'Sí, bajo el MSA',
          'Alcance, **entregables**, hitos, fechas y criterios de aceptación',
          'En cada proyecto o encargo concreto dentro de esa relación',
        ],
        [
          '**NDA**',
          'Sí',
          'Confidencialidad de la información compartida entre las partes',
          'Antes de enseñar arquitectura, datos, hallazgos o precios',
        ],
        [
          '**BPA**',
          'Sí',
          'Cómo dos socios comparten responsabilidades, recursos, beneficios y riesgos',
          'En una operación conjunta entre partners, no en una compra normal',
        ],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'The port signed an umbrella contract with a systems integrator two years ago covering liability, confidentiality, payment terms and applicable law. It now needs that integrator to migrate the CCTV recording platform, with fixed milestones, deliverables and acceptance criteria. What should be issued?',
        choices: [
          'A new master service agreement that replaces the existing one',
          'A memorandum of understanding describing the shared goal of the migration',
          'A statement of work issued under the existing master service agreement',
          'A business partner agreement between the port and the integrator',
        ],
        answer: 2,
        explain:
          'The master service agreement already fixes the general terms, so the specific project with its deliverables, milestones and acceptance criteria belongs in a statement of work underneath it. Replacing the master agreement is the tempting answer because the work is new, but renegotiating the umbrella for every project is exactly what the MSA and SOW split exists to avoid.',
      },
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen: los tres reflejos del 5.3',
      md: '**Uno.** Si el enunciado menciona **disponibilidad, tiempos de respuesta, métricas o penalizaciones**, el documento es el **SLA**; si menciona **entregables y fechas de un proyecto**, es el **SOW** bajo un **MSA**; si menciona **intención de colaborar sin obligaciones**, es un **MOU** (y un **MOA** si ya hay responsabilidades repartidas); si menciona **confidencialidad**, es el **NDA**; si son **dos socios compartiendo la operación**, es el **BPA**. **Dos.** No puedes auditar a un proveedor si la **right-to-audit clause** no estaba firmada: cuando la pregunta describe a un proveedor que se niega a ser auditado, la respuesta correcta nunca es «enviar igualmente a las auditoras», es que la cláusula debió negociarse **antes de firmar**. **Tres.** La **due diligence** ocurre **antes** del contrato y el **vendor monitoring** **después**; si el escenario ya está en producción, la respuesta esperada es monitorización o reevaluación, no due diligence. Y ojo con el reflejo perezoso: un **cuestionario** relleno por el propio proveedor nunca vale lo mismo que una **evaluación independiente**.',
    },
    { t: 'h', text: 'Vendor monitoring: la parte que nadie hace' },
    {
      t: 'p',
      md: 'Firmar no es terminar. El **vendor monitoring** es la vigilancia continua de la relación mientras dura, y en el examen aparece como la respuesta correcta siempre que el escenario ya está en explotación. En la práctica son cinco rutinas: **cuestionarios recurrentes** con una cadencia que depende de la criticidad del proveedor (los proveedores se clasifican en niveles, y el que aloja datos personales no se revisa igual que el que suministra papel); **revisión de los informes independientes** cada vez que se renueva el periodo cubierto; **seguimiento de las métricas del SLA** con reuniones de servicio y evidencia, no con sensaciones; **vigilancia externa** de noticias, brechas publicadas y cambios de propiedad o de subcontratistas; y una **reevaluación completa** en cada renovación. A eso se suma un momento que casi siempre se olvida: el **offboarding** del proveedor, cuando hay que revocar accesos, recuperar los datos en formato utilizable y exigir prueba de su borrado. Un caso especial son las **rules of engagement**: cuando lo que vas a hacer es una prueba activa —un **penetration test** contra un servicio del proveedor— hace falta un documento previo que fije **alcance**, técnicas permitidas y prohibidas, ventanas horarias, sistemas excluidos, contactos de emergencia y qué se hace con los datos que aparezcan. Sin reglas de enfrentamiento firmadas, una prueba autorizada se parece demasiado a un ataque.',
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'En la Autoridad Portuaria de Halden',
      md: 'La revisión anual de proveedores deja cuatro decisiones distintas. El proveedor del **sistema de atraques** ha incumplido dos veces el tiempo de restauración: eso se discute con el **SLA** en la mano y con créditos de servicio, no con una llamada de queja. El **SaaS de nóminas** presenta un informe independiente que cubre solo su plataforma europea y termina en marzo: se acepta como evidencia, pero se anota que el periodo posterior está sin cubrir. El contratista de **mantenimiento de grúas** ha subcontratado el soporte remoto sin avisar: aquí entra la **supply chain analysis** y una revisión de la cláusula de subcontratación. Y para el nuevo proveedor de **analítica de tráfico marítimo** aún no se ha firmado nada: es el único de los cuatro donde toca **due diligence**, y donde todavía se puede exigir la **right-to-audit clause**, la notificación de incidentes en 24 horas y el borrado certificado al terminar.',
    },
    {
      t: 'p',
      md: 'Con esto cierras el riesgo de terceros: evaluar antes, contratar bien y vigilar después. La siguiente lección se ocupa del marco legal que envuelve todo lo anterior —el objetivo 5.4, **cumplimiento y privacidad**—: a quién hay que reportar, qué pasa cuando no se cumple, la diferencia entre **due diligence** y **due care**, y qué derechos tiene la persona cuyos datos estás guardando.',
    },
  ],
  quiz: [
    {
      id: 'sp5m5q1',
      domain: 'Security Program Management & Oversight',
      prompt:
        'A contract requires a vendor to restore the terminal operating system within four hours of an outage and to grant service credits if it fails to do so. Which agreement type contains this kind of commitment?',
      choices: [
        'A service level agreement (SLA)',
        'A memorandum of understanding (MOU)',
        'A non-disclosure agreement (NDA)',
        'A business partner agreement (BPA)',
      ],
      answer: 0,
      explain:
        'An SLA is the document that expresses service in measurable terms and attaches a penalty when the measurement is missed, which is precisely a four-hour restoration target backed by service credits. A memorandum of understanding is the tempting alternative because it is also signed by both parties, but it records intent rather than enforceable, measurable obligations.',
    },
    {
      id: 'sp5m5q2',
      domain: 'Security Program Management & Oversight',
      prompt:
        'The port already has a long-standing umbrella contract with an engineering firm that sets liability, confidentiality and payment terms. A new project to replace the lock-gate control network needs defined deliverables, milestones and acceptance criteria. Which document should be produced?',
      choices: [
        'A memorandum of agreement (MOA)',
        'A replacement master service agreement (MSA)',
        'A business partner agreement (BPA)',
        'A statement of work (SOW) under the existing MSA',
      ],
      answer: 3,
      explain:
        'The master service agreement is the umbrella that stays in place, and each individual piece of work is defined in a statement of work with its own scope, deliverables and acceptance criteria. Rewriting the master agreement is attractive because the project is new and large, but it would renegotiate settled commercial terms to describe work the SOW is designed to capture.',
    },
    {
      id: 'sp5m5q3',
      domain: 'Security Program Management & Oversight',
      prompt:
        'Before signing with a new maritime analytics provider, the port reviews the provider financial stability, ownership structure, breach history and current certifications. What is this activity, and where does it belong in the vendor lifecycle?',
      choices: [
        'Vendor monitoring, which belongs after the contract is in force',
        'Due diligence, which belongs before the contract is signed',
        'A right-to-audit exercise, which belongs at the first contract renewal',
        'Rules of engagement, which belong immediately before a penetration test',
      ],
      answer: 1,
      explain:
        'Due diligence is the pre-contract investigation of who the vendor is and whether it can be trusted, and it is done while the organization still has leverage to demand contract terms. Vendor monitoring is the plausible distractor because it examines very similar evidence, but by definition it happens once the relationship is already running.',
    },
    {
      id: 'sp5m5q4',
      domain: 'Security Program Management & Oversight',
      prompt:
        'A vendor declines to complete the port 200-question security questionnaire and instead provides a report produced by an independent auditing firm covering its controls over the previous twelve months. How should the port treat that report?',
      choices: [
        'Reject it, because only the port own questionnaire counts as valid evidence',
        'Treat it as equivalent to a penetration test performed against the vendor',
        'Accept it as stronger evidence than self-reported answers, while checking the scope and the period it actually covers',
        'Accept it as proof that ongoing vendor monitoring is no longer necessary',
      ],
      answer: 2,
      explain:
        'An independent assessment carries more weight than a self-reported questionnaire precisely because the assessor has no interest in the outcome, but its value depends entirely on which systems and which months it covers. Treating it as a substitute for continued monitoring is the tempting shortcut, since a report describes a period that has already ended and says nothing about the vendor posture today.',
    },
    {
      id: 'sp5m5q5',
      domain: 'Security Program Management & Oversight',
      prompt:
        'During a competitive selection, the manager scoring the bids holds a financial stake in one of the bidding companies. Which concern does this raise, and what is the correct handling?',
      choices: [
        'Conflict of interest; the relationship must be disclosed and the manager removed from the evaluation',
        'Supply chain analysis; the familiar bidder should be scored higher for reduced onboarding risk',
        'Due care; the manager only needs to document the reasoning behind the final decision',
        'Rules of engagement; the process may continue once every bidder has signed an NDA',
      ],
      answer: 0,
      explain:
        'A financial interest in a bidder is the textbook conflict of interest, and the accepted remedy is disclosure plus removal from the decision so the outcome cannot be challenged later. Documenting the reasoning afterwards sounds responsible, but it does not cure the conflict: the process is compromised regardless of whether the chosen bid was objectively the best.',
    },
    {
      id: 'sp5m5q6',
      domain: 'Security Program Management & Oversight',
      prompt:
        'The port commissions a penetration test against a vendor-hosted cargo portal. Before testing starts, both organizations sign a document setting the scope, the techniques that are allowed and forbidden, the permitted testing windows and emergency contacts. What is this document?',
      choices: [
        'A statement of work',
        'A non-disclosure agreement',
        'A memorandum of understanding',
        'The rules of engagement',
      ],
      answer: 3,
      explain:
        'Rules of engagement are the testing-specific boundaries that turn an authorized assessment into something safe and defensible: what may be attacked, how, when and who to call if something breaks. A statement of work is the closest distractor because it also describes the engagement, but it defines the commercial deliverables rather than the technical limits under which the testers may operate.',
    },
    {
      id: 'sp5m5q7',
      domain: 'Security Program Management & Oversight',
      prompt:
        'Two neighbouring port authorities want to record their intention to share threat intelligence and run joint incident exercises. Neither wants to create enforceable commercial obligations at this stage. Which document fits BEST?',
      choices: [
        'A business partner agreement (BPA)',
        'A memorandum of understanding (MOU)',
        'A statement of work (SOW)',
        'A service level agreement (SLA)',
      ],
      answer: 1,
      explain:
        'A memorandum of understanding is designed exactly for this: it records shared intent and mutual expectations without creating obligations that a court would enforce. A business partner agreement is the tempting neighbour because it also governs a relationship between two organizations, but it is used when partners share responsibilities, resources and returns in a joint operation.',
    },
  ],
};

// ---------------------------------------------------------------------------
// SP5M6 — Cumplimiento y privacidad
// (SY0-701, objetivo 5.4)
// ---------------------------------------------------------------------------
const sp5m6: Module = {
  id: 'sp5m6',
  sectionId: 'sp5',
  title: 'Cumplimiento y privacidad',
  minutes: 12,
  objectives: [
    'Separar el **compliance reporting** interno del externo y saber a quién va cada informe',
    'Nombrar las **consecuencias del incumplimiento**: **fines**, **sanctions**, **reputational damage**, **loss of license** e **impactos contractuales**',
    'Distinguir **due diligence** de **due care**, y **attestation** de **acknowledgement**, en la monitorización del cumplimiento',
    'Situar a la **data subject** y a los roles de **controller** y **processor** en su sentido legal',
    'Explicar por qué el **right to be forgotten** no es absoluto y qué papel juegan el **data inventory** y la **retention**',
  ],
  blocks: [
    {
      t: 'p',
      md: 'La lección anterior terminaba con un contrato firmado. Esta empieza con la ley encima de la mesa. El objetivo 5.4 cubre el **compliance** —cumplir con lo que te obliga alguien de fuera: una reguladora, una norma sectorial, un cliente, un tribunal— y la **privacy**, que es el subconjunto del cumplimiento que trata de las personas y sus datos. La diferencia con el resto del dominio 5 es de tono: aquí las decisiones ya no las toma el consejo de la **Autoridad Portuaria de Halden** según su apetito de riesgo, se las imponen. Y el examen lo mide con preguntas muy reconocibles: quién recibe qué informe, qué pasa cuando no se cumple, y qué puede exigir la persona cuyos datos guardas.',
    },
    { t: 'h', text: 'Compliance reporting y lo que cuesta fallar' },
    {
      t: 'p',
      md: 'El **compliance reporting** es contar el estado del cumplimiento, y el examen lo parte en dos según el destinatario. El **reporting interno** va hacia dentro —dirección, consejo, comité de auditoría, dueños de sistema— y sirve para gobernar: cuadros de mando de controles, excepciones abiertas con su dueño y su fecha, indicadores de riesgo, resultados de autoevaluaciones. Nadie te multa por un informe interno, pero sin él la dirección no puede decidir ni aprobar nada. El **reporting externo** va hacia fuera —reguladoras, autoridades de protección de datos, clientes que lo exigen por contrato, organismos de certificación, aseguradoras— y ahí cambian tres cosas: el **formato** suele estar prescrito, hay **plazos** legales que se cuentan en horas (la notificación de una brecha de datos personales es el ejemplo canónico) y lo que envías es **declarativo**: si es falso, el problema deja de ser técnico.',
    },
    {
      t: 'p',
      md: 'Cuando el cumplimiento falla, las consecuencias del examen son cinco y conviene no mezclarlas. Las **fines** son sanciones económicas impuestas por una autoridad. Las **sanctions** son restricciones o prohibiciones: que te ordenen dejar de tratar cierto tipo de datos, que te excluyan de contratos públicos, que te impongan supervisión externa. El **reputational damage** no lo impone nadie —lo imponen la prensa, los clientes y el mercado— y es el más difícil de revertir. La **loss of license** es la pérdida de la autorización necesaria para operar: en un puerto, perder una certificación de seguridad marítima puede significar que ciertos buques dejen de poder atracar, lo que convierte un problema de cumplimiento en un problema existencial. Y los **contractual impacts** son la vía privada: penalizaciones, créditos de servicio, resolución del contrato o pérdida directa de un cliente que tenía derecho a exigirte un nivel de seguridad y comprobó que no lo cumplías.',
    },
    {
      t: 'table',
      headers: ['Consecuencia', 'Quién la impone', 'Ejemplo en Halden'],
      rows: [
        [
          '**Fines**',
          'Una autoridad reguladora o supervisora',
          'Multa de la autoridad de protección de datos por tratar datos de pasajeras sin base legal',
        ],
        [
          '**Sanctions**',
          'Un regulador, un gobierno o un organismo sectorial',
          'Orden de suspender el tratamiento biométrico de tripulaciones hasta corregir los hallazgos',
        ],
        [
          '**Reputational damage**',
          'Nadie de forma formal: prensa, clientes, mercado y plantilla',
          'Portada local tras la filtración de manifiestos de carga; dos navieras piden auditoría',
        ],
        [
          '**Loss of license**',
          'La autoridad que concedió la habilitación para operar',
          'Revisión de la certificación de protección portuaria tras un incumplimiento reiterado',
        ],
        [
          '**Contractual impacts**',
          'La otra parte del contrato, no un regulador',
          'Una naviera invoca la cláusula de seguridad, retiene el pago y resuelve el contrato',
        ],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'A shipping line discovers that the port failed to meet a security requirement written into their service contract. It withholds payment, invokes the penalty clause and gives notice to terminate. No regulator is involved. Which category of non-compliance consequence is this?',
        choices: [
          'A fine, because money is being withheld as a penalty',
          'A sanction, because the port is being restricted from an activity',
          'Contractual impacts, because the consequence comes from the other party to an agreement rather than from an authority',
          'Loss of license, because the port loses the right to serve that customer',
        ],
        answer: 2,
        explain:
          'Contractual impacts are the consequences that a counterparty can impose using the agreement itself, such as penalties, withheld payment or termination, and no regulator is required. Calling it a fine is the natural mistake because money changes hands, but fines are monetary penalties imposed by an authority under a law or regulation, not by a customer under a contract.',
      },
    },
    { t: 'h', text: 'Compliance monitoring: due diligence, due care y attestation' },
    {
      t: 'p',
      md: 'La **compliance monitoring** es comprobar de forma continua que se sigue cumpliendo, y el examen la construye sobre cuatro piezas. La primera es la pareja que más preguntas genera de todo el objetivo: **due diligence** es **investigar antes de actuar** —comprobar al proveedor antes de firmar, revisar la legalidad antes de lanzar un tratamiento de datos, evaluar antes de comprar—, mientras que **due care** es **actuar de forma razonable y sostenida en el tiempo**: parchear cuando toca, revisar los accesos cada trimestre, formar a la plantilla, arreglar lo que la auditoría encontró. Mirar antes de saltar frente a comportarse bien mientras caes. La segunda pieza es **attestation and acknowledgement**: la **attestation** es una declaración formal de que algo es cierto, firmada por quien responde de ello —la dirección atestigua ante una reguladora, o un auditor externo atestigua el resultado de su revisión—, y el **acknowledgement** es la firma con la que una persona reconoce que ha leído y entendido una política; parece burocracia, pero es la evidencia de que la obligación se comunicó. La tercera es la distinción entre monitorización **interna** (el propio equipo comprueba sus controles y hace autoevaluaciones) y **externa** (lo comprueba alguien de fuera, y por eso pesa más). Y la cuarta es la **automation**: verificar el cumplimiento con herramientas que evalúan la configuración contra el estándar de forma continua y avisan de la desviación, en lugar de descubrirla en la auditoría anual. La automatización no sustituye al criterio, pero cambia la frecuencia de once meses tarde a once minutos tarde.',
    },
    {
      t: 'check',
      q: {
        q: 'Before contracting a new crew-management platform, the port privacy officer spends three weeks verifying the provider certifications, its subprocessors, where the data would be stored and what the applicable law would be. Which concept does this activity illustrate?',
        choices: [
          'Due care, because the officer is acting responsibly',
          'Due diligence, because the investigation happens before the organization commits',
          'Attestation, because the findings will be written into a formal statement',
          'Acknowledgement, because the provider will have to sign the port policies',
        ],
        answer: 1,
        explain:
          'Due diligence is the investigation carried out before a decision or a commitment is made, which is exactly a pre-contract review of certifications, subprocessors, storage location and applicable law. Due care is the tempting answer because the behaviour is clearly responsible, but due care describes the ongoing reasonable conduct that follows the decision rather than the homework that precedes it.',
      },
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen: las tres trampas del 5.4',
      md: '**Uno.** **Due diligence = mirar antes de saltar; due care = seguir comportándote bien mientras caes.** Si el escenario ocurre **antes** de firmar, comprar o lanzar, es due diligence; si describe una rutina que se mantiene en el tiempo —parcheo, revisiones de acceso, formación, corrección de hallazgos—, es due care. **Dos.** El **right to be forgotten no es absoluto**: una obligación legal de conservación (fiscal, laboral, marítima) o un **legal hold** por un litigio en curso **prevalecen** sobre la petición de borrado. La respuesta correcta casi nunca es «borrarlo todo» ni «denegar la petición entera», sino **borrar lo que no está protegido por una obligación de conservación y explicar a la persona por qué el resto se mantiene**. **Tres.** No puedes proteger, clasificar, borrar ni reportar datos que **no has inventariado**: cuando la pregunta describe a alguien que no sabe qué datos personales tiene ni dónde están, lo que falta es el **data inventory** con sus periodos de **retention**, no una herramienta nueva.',
    },
    { t: 'h', text: 'Privacidad: sujetos, roles y datos' },
    {
      t: 'p',
      md: 'La privacidad tiene **implicaciones legales en tres niveles** que pueden aplicarse a la vez: **local o regional**, **nacional** y **global**. El puerto de Halden trata datos bajo la normativa de su municipio y su región, bajo la ley nacional de protección de datos y de seguridad marítima, y bajo un marco supranacional cuando la naviera es europea o los datos viajan a un proveedor en otro continente. Cumplir con el nivel más cercano no exime del más lejano. Sobre ese mapa se colocan los actores. La **data subject** es **la persona física a la que se refieren los datos**: la tripulante cuyo pasaporte se escanea, la pasajera del ferry, la trabajadora en nómina. No es quien guarda los datos ni quien los procesa; es de quien son. El **data controller** es quien decide **el propósito y los medios** del tratamiento —qué se recoge, para qué y durante cuánto tiempo—, y es quien responde ante la reguladora. El **data processor** trata los datos **siguiendo las instrucciones documentadas del controller** y no puede decidir por su cuenta darles otro uso: un **SaaS** de nóminas es el ejemplo perfecto. Y el **ownership** de los datos, en el sentido de gobierno interno, es la responsabilidad asignada a un rol de negocio concreto que responde de esa información: sin dueño nombrado, ninguna decisión de retención o de borrado tiene quien la firme.',
    },
    {
      t: 'p',
      md: 'Todo lo anterior se apoya en dos prácticas muy poco glamurosas. El **data inventory** es el mapa de qué datos personales existen, dónde viven, quién accede, con qué base legal se trataron y a qué terceros se envían; es la respuesta a la primera pregunta de cualquier reguladora y la condición previa para todo lo demás. La **retention** es cuánto tiempo se conservan: ni menos de lo que la ley obliga, ni más de lo que el propósito justifica, con un borrado que ocurre de verdad y también en las copias de seguridad. Sobre ese armazón se ejercen los derechos de la persona, y el que más cae en el examen es el **right to be forgotten** o derecho de supresión: la data subject pide que borres sus datos y, por defecto, hay que hacerlo. Pero **no es absoluto**. Si una ley te obliga a conservar las facturas diez años, si hay un **legal hold** abierto por un litigio o una investigación, o si los datos son necesarios para cumplir una obligación legal, la conservación gana sobre el borrado. La respuesta profesional —y la del examen— es siempre parcial: se borra lo que se puede, se retiene lo que la ley exige, y se **documenta y se explica** a la persona qué se ha conservado y por qué.',
    },
    {
      t: 'check',
      q: {
        q: 'A former contractor asks the Halden Port Authority to erase every piece of personal data it holds about him. Part of that data is invoicing records that national tax law requires the port to keep for ten years, and another part is frozen under a legal hold for ongoing litigation. What is the correct response?',
        choices: [
          'Erase everything without exception, because the right to be forgotten overrides other duties',
          'Refuse the entire request, because one category of data is under a legal hold',
          'Forward the request to the data processor and consider the matter closed',
          'Erase the data that is not covered by a statutory retention duty or a legal hold, and explain to the data subject what is being kept and why',
        ],
        answer: 3,
        explain:
          'The right to be forgotten is a strong default rather than an absolute right, so a statutory retention duty and an active legal hold both survive the request while everything else must go. Refusing the whole request is the tempting overcorrection, but one protected category does not shield unrelated data, and the organization still owes the data subject an explanation of what was retained.',
      },
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'En la Autoridad Portuaria de Halden',
      md: 'La reguladora nacional abre una revisión tras una filtración de listas de tripulación y pide cuatro cosas en diez días hábiles. Primero, el **data inventory**: qué datos personales trata el puerto, dónde y con qué base legal —y aquí aparece el problema, porque la respuesta tarda tres días en construirse—. Segundo, las **políticas de retención** y la prueba de que el borrado se ejecuta también en las copias. Tercero, el registro de **acknowledgements** de la plantilla sobre la política de tratamiento de datos, que existe y está completo. Y cuarto, una **attestation** firmada por la dirección sobre las medidas correctoras comprometidas. El expediente termina en **fine** moderada, sin **sanctions** ni riesgo para la habilitación de operar, pero con dos meses de **reputational damage** y una naviera revisando la cláusula de seguridad de su contrato.',
    },
    {
      t: 'p',
      md: 'Ya tienes el marco: a quién reportas, qué te cuesta no cumplir, cómo se vigila el cumplimiento y qué derechos tiene la persona detrás del dato. La siguiente lección cubre cómo se **comprueba** todo esto desde fuera y desde dentro —el objetivo 5.5—: **audits and assessments**, comités de auditoría y autoevaluaciones, y el **penetration testing** con sus tipos, sus grados de conocimiento del entorno y la diferencia entre reconocimiento pasivo y activo.',
    },
  ],
  quiz: [
    {
      id: 'sp5m6q1',
      domain: 'Security Program Management & Oversight',
      prompt:
        'The port security team performs quarterly access reviews, patches on a published schedule, retrains staff annually and closes audit findings within agreed deadlines, keeping records of all of it. Which concept does this sustained behaviour BEST illustrate?',
      choices: [
        'Due diligence',
        'Attestation',
        'Due care',
        'Acknowledgement',
      ],
      answer: 2,
      explain:
        'Due care is the ongoing exercise of reasonable, documented responsibility once an obligation exists, which is exactly what recurring reviews, scheduled patching and closed findings demonstrate. Due diligence is the tempting choice because both terms describe responsible behaviour, but due diligence is the investigation carried out before a decision or a commitment rather than the routine that follows it.',
    },
    {
      id: 'sp5m6q2',
      domain: 'Security Program Management & Oversight',
      prompt:
        'The Halden Port Authority decides which crew data is collected, for what purpose and for how long, and contracts a SaaS provider that stores and processes that data strictly according to the port documented instructions. Under privacy law, what are the two roles?',
      choices: [
        'The port is the processor and the provider is the controller',
        'The port is the controller and the provider is the processor',
        'Both are joint controllers, because both organizations hold the data',
        'The provider is the data subject and the port is the custodian',
      ],
      answer: 1,
      explain:
        'The controller is whoever determines the purpose and the means of the processing, and the processor acts only on the controller documented instructions, so the port controls and the SaaS provider processes. Joint controllership is the tempting answer because both parties physically hold the data, but holding data is not the test: deciding why and how it is used is.',
    },
    {
      id: 'sp5m6q3',
      domain: 'Security Program Management & Oversight',
      prompt:
        'The port scans and stores identity documents belonging to ship crews in a cloud crew-management platform operated by a vendor. In privacy terms, who is the data subject?',
      choices: [
        'The cloud platform vendor that stores the documents',
        'The Halden Port Authority, because it collected the documents',
        'The national data protection authority that supervises the processing',
        'The individual crew member whose identity document it is',
      ],
      answer: 3,
      explain:
        'The data subject is always the identified or identifiable natural person the data is about, which here is the crew member whose passport was scanned. Naming the port is the intuitive error because it collected and holds the data, but that role makes it the controller, and controllers have obligations towards data subjects rather than being them.',
    },
    {
      id: 'sp5m6q4',
      domain: 'Security Program Management & Oversight',
      prompt:
        'A regulator concludes that the port processed passenger data without a lawful basis. It imposes a monetary penalty and moves to revoke the port operating authorization. Which two consequence categories are illustrated?',
      choices: [
        'Fines and loss of license',
        'Sanctions and contractual impacts',
        'Reputational damage and fines',
        'Contractual impacts and loss of license',
      ],
      answer: 0,
      explain:
        'A monetary penalty imposed by an authority is a fine, and putting the authorization to operate at risk falls under loss of license, so those are the two categories present. Contractual impacts is the distractor to discard, because nothing in the scenario involves a counterparty enforcing an agreement: everything described is imposed by the regulator.',
    },
    {
      id: 'sp5m6q5',
      domain: 'Security Program Management & Oversight',
      prompt:
        'Which of the following is an example of EXTERNAL compliance reporting?',
      choices: [
        'A quarterly control-failure dashboard presented to the port executive committee',
        'A monthly patch-compliance summary emailed to internal system owners',
        'A personal data breach notification filed with the national data protection authority',
        'An internal audit workpaper archived in the audit team repository',
      ],
      answer: 2,
      explain:
        'External compliance reporting goes to parties outside the organization, typically regulators, customers or certification bodies, and a mandatory breach notification to a supervisory authority is the classic case. The executive committee dashboard is the tempting distractor because it reaches the highest level of the organization, but the board is still internal, so reporting to it is internal reporting.',
    },
    {
      id: 'sp5m6q6',
      domain: 'Security Program Management & Oversight',
      prompt:
        'New employees at the port read the acceptable use policy and sign a record stating that they have read and understood it. What is this record, and why does it matter for compliance?',
      choices: [
        'Due diligence, because it verifies the employee background before hiring',
        'Acknowledgement, because it is documented evidence that the obligation was communicated and accepted',
        'Attestation by an external auditor, because an independent party validates the control',
        'A right-to-audit clause, because it allows the port to inspect employee activity',
      ],
      answer: 1,
      explain:
        'An acknowledgement is the signed confirmation that a person received and understood a policy, and it is what lets the organization prove the requirement was actually communicated. External attestation is the tempting term because both are formal signed statements, but an attestation is a declaration that something is true made by someone answerable for it, typically management or an independent auditor, not an employee confirming that a policy was read.',
    },
    {
      id: 'sp5m6q7',
      domain: 'Security Program Management & Oversight',
      prompt:
        'During a regulatory review the port privacy officer cannot say which systems hold crew biometric data, which third parties receive it, or how long it is kept. Which foundational element is missing?',
      choices: [
        'A data inventory that records what personal data exists, where it lives, who receives it and how long it is retained',
        'A penetration test of the crew-management platform',
        'A business partner agreement with the platform vendor',
        'An acceptable use policy covering the handling of crew data',
      ],
      answer: 0,
      explain:
        'You cannot classify, protect, retain or delete data that has never been inventoried, so the missing element is the data inventory with its associated retention periods. A penetration test is the appealing security answer, but it measures whether a known system can be broken into and would not tell the officer which systems hold the data in the first place.',
    },
  ],
};

export const SP5_PART3: Module[] = [sp5m5, sp5m6];
