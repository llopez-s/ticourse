import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// SP4M5 — Gestión de vulnerabilidades II: análisis, respuesta y validación
// (SY0-701, objetivo 4.3)
// ---------------------------------------------------------------------------
const sp4m5: Module = {
  id: 'sp4m5',
  sectionId: 'sp4',
  title: 'Gestión de vulnerabilidades II: análisis, respuesta y validación',
  minutes: 13,
  objectives: [
    'Distinguir un **false positive** de un **false negative** y explicar por qué el segundo es el peligroso',
    'Priorizar hallazgos combinando **CVE**, **CVSS**, **exposure factor** y **environmental variables** en lugar de ordenar por puntuación',
    'Elegir entre **patching**, **segmentation**, **compensating controls**, **insurance** y **exceptions/exemptions** según el escenario',
    'Documentar una **exception** con dueño, justificación, caducidad y revisión, y saber cuándo caduca sola',
    'Cerrar el ciclo con **rescanning**, **audit** y **verification**, y reportar el resultado a quien decide',
  ],
  blocks: [
    {
      t: 'p',
      md: 'La lección anterior te dejó con una lista: escaneos, análisis de código, feeds de inteligencia, un pentest y quizá un informe de bug bounty. Ahora empieza la parte que de verdad separa a un equipo maduro de uno que solo compra herramientas, porque **encontrar vulnerabilidades es fácil y barato; decidir cuáles tocas primero, con qué, y demostrar después que quedaron cerradas, es lo caro**. El objetivo 4.3 llama a esta segunda mitad *analysis, response and remediation, and validation*, y el examen la evalúa siempre igual: te da un escenario con varios hallazgos y espera que apliques criterio, no que ordenes por número.',
    },
    { t: 'h', text: 'Confirmar antes de actuar: false positive y false negative' },
    {
      t: 'p',
      md: 'Ningún escáner acierta siempre, así que el primer paso del análisis es la **confirmation**: comprobar a mano —o con una segunda fuente— que el hallazgo es real. Un **false positive** es algo que la herramienta reporta y **no existe**: la versión ya estaba parcheada, el módulo vulnerable no está cargado, o el escaneo sin credenciales dedujo la versión del banner y se equivocó. Cuesta dinero (horas de ingeniería gastadas en humo), pero cuesta sobre todo **credibilidad**: cuando el equipo de sistemas aprende que la mitad de los tickets del escáner son falsos, deja de tratarlos con urgencia y esa desconfianza se paga el día que llega uno verdadero. Un **false negative** es lo contrario: la vulnerabilidad **está ahí y el informe no la ve**, normalmente porque el escaneo fue no autenticado, porque el activo no estaba en el inventario o porque la firma todavía no existía. Y aquí está la asimetría que el examen quiere que interiorices: **el falso positivo te hace perder tiempo; el falso negativo te hace creer que estás segura cuando no lo estás**. Por eso los escaneos **credentialed** y agentes en el endpoint son tan valorados —reducen ambos errores, pero sobre todo el segundo— y por eso un informe limpio nunca se lee como «no hay vulnerabilidades», sino como «no hemos encontrado ninguna con este método y en este momento».',
    },
    {
      t: 'check',
      q: {
        q: 'A monthly scan of the Halden Port Authority network reports no findings on a group of legacy servers. A later penetration test compromises two of them through a well-known unpatched service. How is the scan result BEST described, and why does it matter more than the opposite error?',
        choices: [
          'A false positive, because the scanner reported something that could not be reproduced',
          'A false negative, because a real vulnerability existed and the scan missed it, leaving the organization confident but exposed',
          'A true negative, because the scanner behaved exactly as configured',
          'An exception, because the servers were legacy and therefore out of scope',
        ],
        answer: 1,
        explain:
          'The flaw was real and the report did not show it, which is the definition of a false negative, and its danger is that nobody investigates a finding that was never raised. A false positive is the tempting choice because it is the error people complain about, but it only wastes effort, whereas a missed vulnerability turns into unearned confidence.',
      },
    },
    { t: 'h', text: 'Priorizar: CVE, CVSS y el contexto que de verdad decide' },
    {
      t: 'p',
      md: 'Confirmado el hallazgo, hay que ordenarlo. Dos siglas que el examen no perdona confundir: **CVE** (*Common Vulnerabilities and Exposures*) es el **identificador** —un nombre único y público, tipo CVE-2026-31887, que permite que tu escáner, el aviso del fabricante y el feed de inteligencia hablen del mismo fallo—, mientras que **CVSS** (*Common Vulnerability Scoring System*) es la **puntuación de severidad**, de 0 a 10, que describe lo grave que sería explotar ese fallo en abstracto. Y ahí está la trampa: **CVSS mide severidad, no riesgo**. La puntuación base no sabe si el activo está en internet o en un laboratorio sin salida, si hay un **compensating control** delante, si existe exploit público, ni cuánto factura ese sistema. Todo eso lo aportas tú con el resto de entradas del objetivo: la **vulnerability classification** (RCE, escalada de privilegios, divulgación de información…), el **exposure factor** (qué porción del valor del activo se pierde si el fallo se explota), las **environmental variables** (¿accesible desde internet?, ¿segmentado?, ¿autenticación previa?, ¿datos de producción?), el **industry/organizational impact** —un fallo que detiene la operativa de un puerto no pesa lo mismo que uno que degrada un portal informativo— y, por encima de todo, la **risk tolerance** de la organización, que es quien fija dónde está la línea de «esto se para y se arregla hoy».',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Extracto de escaneo y decisión de triaje — Autoridad Portuaria de Halden',
      text: `INFORME DE ESCANEO MENSUAL  ·  01-09-2026  ·  credentialed  ·  412 activos

FINDING #0147 ------------------------------------------------------------
  Asset            : hpa-portal-web-01  (portal público de reservas de atraque)
  Exposure         : internet-facing, sin WAF delante, autenticación no requerida
  Finding          : ejecución remota de código en el framework web
  CVE              : CVE-2026-31887
  CVSS v3.1 base   : 9.1  CRITICAL   (AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N)
  Exploit          : público y funcional desde hace 6 días
  Confirmation     : verificado a mano en preproducción -> NO es false positive
  Impacto negocio  : alto; el portal opera 24/7 y sostiene la facturación
  >> TRIAGE        : P1 - parche en ventana de emergencia (24 h)
                     mitigación interina: regla de virtual patching en el WAF

FINDING #0203 ------------------------------------------------------------
  Asset            : lab-sandbox-07  (laboratorio de pruebas de integración)
  Exposure         : VLAN aislada, sin ruta hacia o desde internet
  Finding          : deserialización insegura en un servicio interno
  CVE              : CVE-2026-30114
  CVSS v3.1 base   : 9.8  CRITICAL
  Exploit          : prueba de concepto teórica, sin exploit público
  Confirmation     : verificado -> hallazgo real
  Impacto negocio  : bajo; sin datos de producción ni usuarios externos
  >> TRIAGE        : P3 - parche en el ciclo mensual ordinario

LECTURA: el 9.8 espera y el 9.1 no. CVSS mide SEVERIDAD; la PRIORIDAD la fijan
la exposición, la existencia de exploit, los controles compensatorios y el
impacto de negocio. Ordenar la cola por puntuación es el error clásico.`,
    },
    {
      t: 'check',
      q: {
        q: 'The port authority can patch only one system before the weekend. Finding A is CVSS 9.8 on an isolated test VM with no route to the internet and no production data; finding B is CVSS 7.5 on the internet-facing booking portal, with a working public exploit. Which should be patched first, and why?',
        choices: [
          'Finding A, because CVSS is the standard measure of risk and 9.8 outranks 7.5',
          'Finding A, because critical severity always takes precedence over high severity',
          'Finding B, because exposure, exploit availability and business impact outweigh the raw severity score',
          'Neither, because both should wait until the next scheduled maintenance window',
        ],
        answer: 2,
        explain:
          'CVSS describes how severe a flaw would be in the abstract, so the environmental context of the asset, whether it is reachable, whether an exploit exists and what it would cost the business, is what turns severity into priority. Choosing the 9.8 is the natural trap because the number is bigger, but a critical flaw on a system nobody can reach is not the one an attacker will use on Saturday.',
      },
    },
    { t: 'h', text: 'Responder: parchear, segmentar, compensar, transferir o exceptuar' },
    {
      t: 'p',
      md: 'La respuesta por defecto —y la que el examen espera cuando nada lo impide— es el **patching**: aplicar la corrección del fabricante y eliminar la vulnerabilidad. Cuando no se puede parchear (equipos **OT** que solo el fabricante puede tocar, software sin soporte, un sistema que no admite parada hasta el cierre de temporada), se pasa a reducir la **exposición** con **segmentation** —meter el activo en su propia VLAN o zona, permitiendo solo lo imprescindible— y con **compensating controls**: un WAF con reglas específicas, listas de control de acceso, MFA delante del servicio, monitorización reforzada o restricción horaria. El fallo sigue existiendo, pero explotarlo deja de ser realista. La **insurance** es la palanca de **transferencia**: un seguro cibernético cubre parte del **impacto financiero** de un incidente, y por eso nunca es la respuesta correcta a «¿cómo mitigas esta vulnerabilidad?» —el fallo continúa exactamente igual de explotable después de firmar la póliza. Y cuando el negocio decide convivir con el riesgo, se documenta como **exception** o **exemption**: nunca es una decisión informal ni indefinida. Una excepción válida lleva **dueño nombrado** (quien acepta el riesgo, y es alguien del negocio con autoridad para hacerlo, no la analista), **justificación**, **controles compensatorios aplicados mientras dure**, **fecha de caducidad** y **revisión periódica**. Una excepción sin fecha de expiración no es una excepción: es una vulnerabilidad aceptada en silencio para siempre.',
    },
    {
      t: 'table',
      headers: ['Situación', 'Respuesta esperada', 'Por qué'],
      rows: [
        [
          'Existe parche del fabricante y hay ventana de mantenimiento',
          '**Patching** dentro del SLA que fije la política',
          'Es la única respuesta que **elimina** la vulnerabilidad; todo lo demás la rodea',
        ],
        [
          'Sistema legacy u OT que no admite parche',
          '**Segmentation** + **compensating controls** + monitorización',
          'No puedes quitar la causa, así que reduces la exposición y la probabilidad de explotación',
        ],
        [
          'El negocio necesita seguir operando con el fallo abierto',
          '**Exception/exemption** documentada, aprobada y **con caducidad**',
          'Aceptar riesgo es legítimo; aceptarlo sin dueño, sin plazo y sin revisión no lo es',
        ],
        [
          'Queda un riesgo residual cuantificable que no se puede reducir más',
          '**Insurance** (transferencia del impacto financiero)',
          'Traslada parte del coste de un incidente, pero **no cambia** la vulnerabilidad técnica',
        ],
        [
          'La corrección ya se ha aplicado y el ticket está cerrado',
          '**Rescanning** y **verification** antes de darlo por bueno',
          'Hasta que se revalida, el hallazgo sigue abierto: un ticket cerrado no es evidencia',
        ],
        [
          'El hallazgo no se reproduce al comprobarlo a mano',
          'Marcarlo como **false positive**, documentarlo y afinar el escáner',
          'Evita gastar la ventana de remediación en algo inexistente y mantiene la credibilidad del informe',
        ],
      ],
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen: el contexto gana a la puntuación, y nada está hecho hasta revalidarlo',
      md: 'Tres reglas resuelven casi todas las preguntas de 4.3. **Primera: el contexto manda sobre el número.** Si el enunciado te obliga a elegir entre un **CVSS 9.8** en un equipo aislado y un **CVSS 7.5** en el portal público con exploit disponible, la respuesta es el portal; CVSS es **severidad**, y el riesgo lo componen exposición, explotabilidad, controles existentes e impacto de negocio. **Segunda: «no se puede parchear» nunca significa «no se hace nada».** La respuesta esperada es **segmentar y aplicar compensating controls**, y si además el negocio acepta el resto, una **exception con dueño y fecha de caducidad**. **Tercera: la remediación no termina cuando alguien aplica el parche, sino cuando se ha revalidado** con un **rescan**, una **verification** o una **auditoría**; «el equipo confirmó por correo que lo instaló» no es evidencia. Y dos matices que caen: el **false negative** es el error grave, no el positivo; y contratar un **seguro** transfiere impacto, no reduce vulnerabilidad.',
    },
    {
      t: 'check',
      q: {
        q: 'A crane control system at the port runs software the vendor no longer supports, and no patch will ever be released. The system is required for daily operations. What is the MOST appropriate response?',
        choices: [
          'Accept the risk informally and move the finding to the bottom of the queue',
          'Purchase cyber insurance so the residual risk is covered',
          'Segment the system, apply compensating controls and monitoring, and record a time-bounded exception with a named owner',
          'Disconnect the system immediately until the vendor issues a patch',
        ],
        answer: 2,
        explain:
          'When the cause cannot be removed, the expected answer is to shrink the exposure with segmentation and compensating controls and to document the remaining risk as a formal, time-bounded exception owned by the business. Insurance is attractive because it feels like a decision, but it transfers financial impact without making the system any harder to exploit, and shutting down an operational crane trades a security problem for a safety and availability one.',
      },
    },
    {
      t: 'p',
      md: 'Queda el paso que casi nadie termina: la **validation**. Un hallazgo no se cierra porque alguien diga que lo arregló, sino porque se comprueba. Las tres formas que nombra el objetivo son el **rescanning** (repetir el escaneo sobre ese activo y ver que el hallazgo desaparece), la **verification** puntual (comprobar la versión, el parámetro o la configuración concreta, útil cuando el escáner tarda o el activo es delicado) y el **audit**, una revisión independiente que confirma que el proceso completo —no solo un ticket— funciona como dice la política. Un detalle práctico: si tras el rescan el hallazgo **sigue apareciendo**, antes de discutir hay que descartar dos cosas muy comunes, que el sistema no se haya reiniciado tras el parche y que el escáner esté leyendo una versión antigua en caché o un banner que no se actualizó. Y por último, el **reporting**: el informe se dirige a dos públicos distintos. Al **owner** técnico le sirve el detalle —activo, CVE, cómo se corrige, plazo—; a la **dirección** hay que darle tendencia y exposición: cuántos hallazgos críticos siguen abiertos, cuánto tiempo llevan abiertos (el *mean time to remediate*), cuántas excepciones vivas hay y cuándo caducan. Sin ese informe, la gestión de vulnerabilidades se convierte en una cola infinita que nadie financia.',
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'En la Autoridad Portuaria de Halden',
      md: 'El escaneo de septiembre devuelve 640 hallazgos y el comité pide «arreglar todos los críticos». La analista los cruza con el inventario y el resultado cambia la conversación: 180 son **false positives** de un escaneo sin credenciales sobre servidores que ya estaban parcheados; 22 críticos viven en el **laboratorio aislado** y pueden esperar al ciclo mensual; 6 están en sistemas **internet-facing** y dos de ellos tienen exploit público, así que se llevan la ventana de emergencia; y 3 están en los **PLC de las esclusas**, que no admiten parche y salen del comité con VLAN dedicada, ACL, monitorización reforzada y una **exception** firmada por el director de operaciones que **caduca en seis meses**. Dos semanas después, el **rescan** confirma que 5 de los 6 críticos expuestos han desaparecido; el sexto sigue ahí porque el servidor no se reinició tras el parche. Sin esa revalidación, el informe habría dicho «100 % remediado» y habría sido falso.',
    },
    {
      t: 'p',
      md: 'Con esto cierras el ciclo de vulnerabilidades: identificar, confirmar, priorizar, responder, revalidar y reportar. Pero un escaneo es una **foto mensual**, y los ataques no esperan al primer día del mes. La siguiente lección pasa a la vigilancia continua del objetivo 4.4: qué se monitoriza, qué actividades componen la operación diaria de un SOC —**log aggregation**, **alerting**, **quarantine**, **alert tuning**— y con qué herramientas, desde el **SIEM** hasta **NetFlow**, se responde a cada pregunta.',
    },
  ],
  quiz: [
    {
      id: 'sp4m5q1',
      domain: 'Security Operations',
      prompt:
        'A vulnerability scanner flags a critical flaw on a web server. The engineering team checks the host and confirms the patch was applied two months ago and the vulnerable module is not installed. How should the analyst classify and handle this result?',
      choices: [
        'As a false negative, and rerun the scan with credentials',
        'As a confirmed vulnerability, and open an emergency change',
        'As a false positive, documenting it and tuning the scan so the same finding does not consume future remediation windows',
        'As an exception, so the finding can be accepted by the business owner',
      ],
      answer: 2,
      explain:
        'A finding that is reported but does not exist on the asset is a false positive, and the correct handling is to verify it, record the evidence and adjust the scan configuration so it stops reappearing. Calling it an exception is the tempting distractor because both remove the item from the queue, but an exception is a business decision to accept a real risk, whereas here there is no risk to accept.',
    },
    {
      id: 'sp4m5q2',
      domain: 'Security Operations',
      prompt:
        'Which statement BEST explains why security teams treat false negatives as more dangerous than false positives in vulnerability management?',
      choices: [
        'False negatives consume more engineering hours than false positives',
        'A false negative leaves a real weakness unknown and unaddressed, producing confidence that is not justified',
        'False negatives always indicate that the scanner licence has expired',
        'False positives cannot be reduced, whereas false negatives can be eliminated entirely',
      ],
      answer: 1,
      explain:
        'A missed vulnerability generates no ticket, no owner and no deadline, so the organization believes it is covered while the exposure stays open. False positives are the ones that burn engineering hours, which is why they feel worse day to day, but wasted effort is recoverable and an undetected flaw is the one an attacker finds first.',
    },
    {
      id: 'sp4m5q3',
      domain: 'Security Operations',
      prompt:
        'A remediation team argues that the vulnerability backlog should simply be worked in descending CVSS order. Which objection is technically correct?',
      choices: [
        'CVSS scores change too often to be used for ordering work',
        'CVSS only applies to operating system flaws, not to application flaws',
        'CVSS measures severity in the abstract, so exposure, exploit availability, compensating controls and business impact must adjust the order',
        'CVSS is proprietary, so its scores cannot be compared between different vendors',
      ],
      answer: 2,
      explain:
        'The base score describes how bad exploitation would be without knowing anything about your environment, so an isolated asset with a 9.8 can legitimately rank below an internet-facing asset with a 7.5 and a public exploit. Claiming the scores are incomparable between vendors misses the point, because CVSS is an open standard whose whole purpose is comparability; the limitation is that it is severity, not risk.',
    },
    {
      id: 'sp4m5q4',
      domain: 'Security Operations',
      prompt:
        'During triage an analyst records CVE-2026-31887 alongside a score of 9.1. What does the CVE identifier itself contribute that the score does not?',
      choices: [
        'It quantifies how much of the asset value would be lost if the flaw were exploited',
        'It provides a unique public identifier so scanners, vendor advisories and threat feeds all refer to the same flaw',
        'It states the remediation deadline agreed in the organizational policy',
        'It confirms that a working exploit for the flaw is publicly available',
      ],
      answer: 1,
      explain:
        'CVE is a naming scheme: it guarantees that the scanner finding, the vendor bulletin and the intelligence report are talking about one and the same vulnerability. Quantifying the loss is the exposure factor and severity is CVSS, so choosing those confuses the identifier with the metrics attached to it.',
    },
    {
      id: 'sp4m5q5',
      domain: 'Security Operations',
      prompt:
        'A medical imaging appliance in a port clinic cannot be patched because the manufacturer certifies the whole configuration and no update exists. The device must remain in service. Which response does CompTIA expect?',
      choices: [
        'Remove the device from the asset inventory so it stops generating findings',
        'Rely on cyber insurance to cover any breach involving the device',
        'Apply compensating controls such as segmentation, restricted access and enhanced monitoring, and document a time-bounded exception',
        'Replace the vulnerability scanner with one that does not report unsupported devices',
      ],
      answer: 2,
      explain:
        'When the vulnerability cannot be removed, the expected answer is to make it impractical to reach and to keep the residual risk visible through a formal, expiring exception. Insurance is the plausible-sounding alternative because it addresses consequences, but it transfers financial impact rather than reducing the likelihood that the device is compromised.',
    },
    {
      id: 'sp4m5q6',
      domain: 'Security Operations',
      prompt:
        'Which set of attributes makes a vulnerability exception acceptable during an audit?',
      choices: [
        'A named business owner who accepts the risk, a documented justification, compensating controls, an expiry date and a scheduled review',
        'Approval by the security analyst who discovered the finding, recorded in the ticketing system',
        'A note in the scan report marking the finding as accepted until the vendor releases a fix',
        'Written confirmation that the affected system is not internet-facing',
      ],
      answer: 0,
      explain:
        'An exception is a deliberate business decision, so it needs someone with the authority to accept the risk, interim controls, and an end date that forces the decision to be revisited. Letting the discovering analyst approve it fails on two counts: the analyst does not own the business risk, and an open-ended acceptance with no expiry quietly becomes permanent.',
    },
    {
      id: 'sp4m5q7',
      domain: 'Security Operations',
      prompt:
        'Operations reports by email that all critical patches from last month have been installed and asks the security team to close the findings. What should the analyst do BEFORE closing them?',
      choices: [
        'Close the findings, since the system owners are accountable for their own systems',
        'Rescan the affected assets, or otherwise verify the corrected versions and configurations, and keep the evidence',
        'Raise the risk tolerance threshold so the findings fall below the reporting line',
        'Recalculate the CVSS scores using environmental metrics and close anything under 7.0',
      ],
      answer: 1,
      explain:
        'Remediation is not complete until it is validated, so a rescan or targeted verification is what turns a claim into evidence, and it routinely exposes patches that were installed but never activated by a reboot. Trusting the email is the everyday temptation, yet an unverified closure is exactly how an organization reports full remediation while the exposure is still live.',
    },
    {
      id: 'sp4m5q8',
      domain: 'Security Operations',
      prompt:
        'After segmenting a legacy system and adding monitoring, the port authority buys a cyber insurance policy covering business interruption. In vulnerability response terms, what has the policy achieved?',
      choices: [
        'It has remediated the vulnerability, because the financial exposure is now zero',
        'It has validated the remediation, because the insurer audited the controls before issuing the policy',
        'It has created a compensating control, because the insurer requires the system to be monitored',
        'It has transferred part of the financial impact, while the technical vulnerability remains exactly as exploitable',
      ],
      answer: 3,
      explain:
        'Insurance is a risk transfer mechanism: it changes who absorbs part of the loss, not whether an attacker can still exploit the flaw. Treating it as a compensating control is the seductive error, because compensating controls must actually reduce the likelihood or the impact of exploitation on the system itself, which a policy document does not do.',
    },
  ],
};

// ---------------------------------------------------------------------------
// SP4M6 — Alerting y monitorización: actividades y herramientas
// (SY0-701, objetivo 4.4)
// ---------------------------------------------------------------------------
const sp4m6: Module = {
  id: 'sp4m6',
  sectionId: 'sp4',
  title: 'Alerting y monitorización: actividades y herramientas',
  minutes: 12,
  objectives: [
    'Identificar qué se monitoriza —**systems**, **applications** e **infrastructure**— y qué señal aporta cada capa',
    'Describir las actividades del objetivo 4.4: **log aggregation**, **alerting**, **scanning**, **reporting**, **archiving**, **quarantine** y **alert response and remediation/validation**',
    'Explicar por qué el **alert tuning** es la cura de la **alert fatigue** y qué se pierde cuando se afina mal',
    'Comparar **SIEM**, **NetFlow**, **packet capture**, **DLP**, **antivirus**, **SNMP traps** y **vulnerability scanners** por la pregunta que responde cada uno',
    'Justificar el despliegue **agent-based** o **agentless** y el papel de **SCAP** y los **benchmarks** en la comprobación automatizada',
  ],
  blocks: [
    {
      t: 'p',
      md: 'Un escaneo de vulnerabilidades te dice cómo estaba el puerto el primer día del mes. La monitorización te dice qué está pasando **ahora**, y es la diferencia entre enterarte de una intrusión por tus propios registros o por una llamada de la policía. El objetivo 4.4 se divide en dos listas que conviene memorizar por separado: las **actividades** —lo que un SOC hace todos los días— y las **herramientas** que las sostienen. La trampa del examen no está en definir «SIEM», sino en elegir, dentro de un escenario, cuál de esas herramientas responde la pregunta concreta que se hace la analista.',
    },
    { t: 'h', text: 'Qué se monitoriza y qué actividades componen el trabajo diario' },
    {
      t: 'p',
      md: 'Se monitorizan tres tipos de **computing resources** y cada uno aporta una señal que los otros no tienen. Los **systems** —servidores y estaciones— dan inicios de sesión, procesos que arrancan, servicios que caen, uso de CPU y memoria: es donde se ve *quién entró y qué ejecutó*. Las **applications** dan errores, transacciones, accesos a datos y trazas de negocio: ahí se ve *qué hizo alguien con permisos legítimos*, que es justo lo que un antivirus jamás detectará. Y la **infrastructure** —firewalls, switches, routers, balanceadores, controladores wifi, hipervisores, plano de control cloud— da conexiones, denegaciones, cambios de configuración y estados de enlace: es donde se ve *por dónde entró y hacia dónde se movió*. Un incidente real casi nunca se reconstruye con una sola de las tres; se reconstruye correlacionándolas.',
    },
    {
      t: 'list',
      items: [
        '**Log aggregation** — recoger los registros de todas esas fuentes en un punto central, normalizados y con hora sincronizada. Es el cimiento: sin centralizar no hay correlación posible, y además protege la evidencia, porque un atacante que borre los logs locales ya no borra la copia remota.',
        '**Alerting** — convertir un patrón en un aviso accionable. Una alerta útil dice qué ha pasado, en qué activo, con qué gravedad y qué se espera que haga quien la reciba.',
        '**Scanning** — la comprobación activa y periódica: vulnerabilidades, configuración frente a la **baseline**, activos nuevos que aparecen en la red.',
        '**Reporting** — resumir para quien decide: tendencias, tiempos de respuesta, cobertura de fuentes, cumplimiento. Distinto público, distinto detalle.',
        '**Archiving** — conservar los registros antiguos en almacenamiento barato durante el plazo que exija la política o la ley. Existe para **investigaciones y cumplimiento**, no para el trabajo diario; y una intrusión que se descubre a los ocho meses solo se puede reconstruir si el archivo llega hasta allí.',
        '**Alert response and remediation/validation** — el ciclo completo de cada aviso: triaje, contención, corrección y **comprobación** de que la corrección funcionó. La alerta no se cierra porque se haya leído.',
        '**Quarantine** — aislar lo sospechoso mientras se investiga: sacar un equipo de la red a una VLAN restringida, retener un correo en el gateway, mover un fichero a una zona controlada. Contiene sin destruir la evidencia.',
        '**Alert tuning** — ajustar reglas y umbrales para que lo que suena merezca sonar: eliminar duplicados, excluir el comportamiento legítimo conocido, agrupar eventos relacionados y subir o bajar la severidad según el activo.',
      ],
    },
    {
      t: 'check',
      q: {
        q: 'The port SOC keeps six months of logs online for daily searching and moves anything older to low-cost storage for the seven years required by policy. Which monitoring activity does the second part describe, and what is it for?',
        choices: [
          'Log aggregation, because the logs are moved to a single central location',
          'Archiving, which preserves older records for investigations, legal requests and compliance rather than for daily operations',
          'Alert tuning, because reducing the online data set reduces alert volume',
          'Quarantine, because the older records are isolated from the production system',
        ],
        answer: 1,
        explain:
          'Retaining older logs in cheaper storage for a defined period is archiving, and its value appears when an intrusion is discovered months later or a regulator asks for records. Aggregation is the tempting answer because both involve moving logs, but aggregation is about collecting live sources into one place so they can be correlated, not about long-term retention.',
      },
    },
    { t: 'h', text: 'Alert tuning: la cura de la fatiga de alertas' },
    {
      t: 'p',
      md: 'La **alert fatigue** es el fallo operativo más común y más silencioso de un SOC: cuando una consola escupe miles de avisos al día y casi todos son ruido, el equipo deja de mirarlos, cierra en lote y acaba desactivando la regla más molesta. El día que la alerta buena aparece, se pierde entre las otras cuatro mil. La cura no es contratar más gente ni comprar otra plataforma, sino **alert tuning**: revisar sistemáticamente qué reglas generan volumen, comprobar qué proporción resulta ser benigna y ajustar. Afinar es un catálogo de acciones concretas: **excluir** el comportamiento legítimo ya identificado (el escáner de vulnerabilidades corporativo no es un ataque de reconocimiento, el servidor de backup sí se conecta a todo por diseño), **subir umbrales** que estaban puestos al azar, **deduplicar** y **agrupar** eventos relacionados en un solo incidente, **enriquecer** la alerta con contexto —criticidad del activo, dueño, si es internet-facing— y **priorizar** según ese contexto. El riesgo del ajuste es evidente y también cae en el examen: afinar de más produce **false negatives**, porque una exclusión demasiado amplia («ignorar todo lo que venga de este rango») ciega precisamente el sitio por donde entrará el atacante. Por eso el ajuste se **documenta**, se aprueba y se revisa: cada exclusión debe decir qué se excluye, por qué y quién lo pidió.',
    },
    {
      t: 'check',
      q: {
        q: 'A backup agent generates about 4,000 identical, verified-benign alerts every night, and the analysts have started closing the entire queue without reading it. What is the correct response?',
        choices: [
          'Tune the alert so the known benign pattern stops firing, documenting the exclusion and keeping detection for anything that deviates from it',
          'Disable the whole detection rule, since it has proven to be unreliable',
          'Add analysts to the night shift so the queue can be cleared each morning',
          'Move the alerts into archive storage so they no longer appear in the console',
        ],
        answer: 0,
        explain:
          'Tuning removes the known benign pattern while keeping the detection alive for anything that behaves differently, which is exactly what restores the value of the queue. Disabling the rule is the tempting shortcut because it also silences the noise, but it blinds the team to the genuine attack that the rule was written to catch.',
      },
    },
    { t: 'h', text: 'Las herramientas y la pregunta que responde cada una' },
    {
      t: 'p',
      md: 'El **SIEM** es el centro: **agrega** los registros, los **normaliza**, los **correlaciona** —une el intento fallido en el firewall con el inicio de sesión correcto en el servidor y la creación de una cuenta diez minutos después— y **alerta**. Su punto ciego es que solo ve lo que se le envía: si la fuente no está integrada, para el SIEM ese evento no ocurrió. **NetFlow** aporta **metadatos de flujo** —qué IP habló con qué IP, por qué puerto, cuándo y **cuánto volumen**—, barato de guardar durante meses y perfecto para detectar que un servidor mandó 40 GB a un destino desconocido de madrugada; pero **no contiene el contenido**, así que no te dirá *qué* se llevaron. Para eso está el **packet capture**, que guarda los paquetes completos: da el detalle exacto, pero ocupa muchísimo, se conserva poco tiempo y sirve de poco si la sesión iba cifrada. **SCAP** (*Security Content Automation Protocol*) es el formato estándar que permite que escáneres, herramientas de configuración y **benchmarks** —los del **CIS**, típicamente— hablen el mismo idioma, de modo que «cumple la baseline» se pueda comprobar de forma automática y comparable entre productos. Los **agents** instalados en el equipo dan visibilidad profunda y continua (procesos, ficheros, memoria) incluso cuando el equipo está fuera de la red, a cambio de instalar, mantener y actualizar software en todas partes; el enfoque **agentless** consulta desde la red y no toca el dispositivo, lo que lo hace obligatorio en **OT/ICS** y en equipos donde nadie autoriza instalar nada, a costa de ver menos y solo cuando pregunta. Completan el cuadro el **antivirus/EDR**, el **DLP**, los **SNMP traps** y los **vulnerability scanners**.',
    },
    {
      t: 'table',
      headers: ['Herramienta', 'Pregunta que responde', 'Punto ciego'],
      rows: [
        [
          '**SIEM**',
          '¿Qué ocurrió, en qué orden y en cuántos sistemas a la vez?',
          'Solo ve las fuentes integradas; sin ingesta ni horas sincronizadas no hay correlación',
        ],
        [
          '**NetFlow**',
          '¿Quién habló con quién, cuándo y con cuánto volumen?',
          'Es **metadato**: no dice qué contenía la conversación',
        ],
        [
          '**Packet capture**',
          '¿Qué viajaba exactamente dentro de esa sesión?',
          'Volumen enorme, retención corta y poco útil si el tráfico va cifrado',
        ],
        [
          '**Vulnerability scanner**',
          '¿Qué debilidades conocidas tengo y en qué activos?',
          'Solo lo conocido y solo en el instante del escaneo; no detecta al intruso',
        ],
        [
          '**Antivirus / EDR**',
          '¿Hay código malicioso conocido ejecutándose en este equipo?',
          'Depende de firmas y detecciones previas; el abuso de credenciales legítimas no le parece nada raro',
        ],
        [
          '**DLP**',
          '¿Está saliendo información sensible y por qué canal?',
          'Necesita que los datos estén bien clasificados; sufre con canales cifrados o no cubiertos',
        ],
        [
          '**SNMP traps**',
          '¿Qué dispositivo de red acaba de cambiar de estado o superar un umbral?',
          'Señal de disponibilidad más que de seguridad; las versiones antiguas van sin cifrar',
        ],
        [
          '**SCAP + benchmarks (CIS)**',
          '¿Esta máquina cumple la baseline aprobada, comprobado de forma automática?',
          'Mide **configuración**, no si alguien ya está dentro del sistema',
        ],
      ],
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen: metadato frente a contenido, y afinar frente a ignorar',
      md: 'Cuatro reflejos para 4.4. **Uno: NetFlow = metadatos, packet capture = contenido.** Si el enunciado pregunta *con quién* habló un equipo, *cuándo* y *cuánto* salió, la respuesta es **NetFlow** o los registros de flujo; si pregunta *qué* datos concretos viajaban dentro, es **packet capture**. **Dos: un aluvión de alertas idénticas y benignas se resuelve con alert tuning**, nunca desactivando la regla, nunca ignorando la cola y nunca comprando otra herramienta; y si el enunciado dice que el equipo cierra alertas sin leerlas, está describiendo **alert fatigue**. **Tres: el archiving existe para investigaciones y cumplimiento**, no para el trabajo diario; si el escenario pide reconstruir algo de hace ocho meses, la pregunta real es cuánto retienes. **Cuatro: en OT/ICS y en dispositivos que no admiten software adicional, la respuesta es agentless**, aunque veas menos; en portátiles que viven fuera de la oficina, la respuesta es **agent**.',
    },
    {
      t: 'check',
      q: {
        q: 'A server at the port is suspected of exfiltrating data overnight. There is no full packet capture, but flow records are kept for twelve months. What can the analyst establish from NetFlow, and what will still be missing?',
        choices: [
          'The exact files transferred, but not the destination address',
          'Nothing useful, because flow records only cover internal traffic',
          'Which external addresses the server contacted, at what times and how many bytes left, but not the content of what was sent',
          'The full content of the sessions, provided the traffic was unencrypted',
        ],
        answer: 2,
        explain:
          'Flow data is metadata about conversations, so it establishes peers, ports, timing and volume, which is usually enough to confirm that exfiltration happened and to scope it. Expecting the transferred files is the classic confusion: only a packet capture holds payload, and even then only if the session was not encrypted.',
      },
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'En la Autoridad Portuaria de Halden',
      md: 'El SOC del puerto recibe 6.000 alertas al día y el turno de noche cierra el 90 % sin abrirlas: **alert fatigue** de manual. La revisión encuentra que tres reglas generan el 78 % del volumen —el agente de copias de seguridad, el escáner de vulnerabilidades corporativo y un balanceador que reinicia sesiones cada hora— y que ninguna ha producido nunca un incidente real. Se **afinan** con exclusiones documentadas y aprobadas, y la cola baja a 400 avisos diarios. Dos semanas después salta una alerta de volumen saliente inusual en un servidor de la terminal de contenedores: **NetFlow** confirma 38 GB hacia una IP desconocida entre las 02:00 y las 04:30; el **SIEM** correlaciona ese flujo con un inicio de sesión de una cuenta de servicio a las 01:52 desde una estación de administración; el equipo pasa la máquina a **quarantine** en una VLAN restringida sin apagarla y activa una captura para el resto de la sesión. Sin el ajuste previo, esa alerta habría estado en la misma cola de 6.000 que nadie leía.',
    },
    {
      t: 'p',
      md: 'Ya sabes qué vigilar, con qué actividades y con qué herramientas. La siguiente lección da el paso natural: si la monitorización te dice **qué está pasando**, el objetivo 4.5 se ocupa de **impedir que pase** —firewalls y sus listas de acceso, **IDS/IPS**, filtrado web y de **DNS**, protocolos seguros, seguridad del correo con **SPF**, **DKIM** y **DMARC**, **FIM**, **DLP**, **NAC** y **EDR/XDR**—, es decir, todas las capacidades técnicas que se endurecen para que la consola tenga menos que contarte.',
    },
  ],
  quiz: [
    {
      id: 'sp4m6q1',
      domain: 'Security Operations',
      prompt:
        'An analyst must determine which external hosts a compromised workstation communicated with over the past three months and how much data was transferred. Full packet capture is not retained. Which data source is MOST appropriate?',
      choices: [
        'Antivirus quarantine records from the endpoint',
        'NetFlow records, which retain source, destination, ports, timing and byte counts for long periods',
        'The CIS benchmark compliance report for the workstation',
        'SNMP trap history from the access switch',
      ],
      answer: 1,
      explain:
        'Flow data is compact enough to keep for months and records exactly the peers, ports, times and volumes needed to reconstruct who talked to whom. SNMP traps are the plausible network-flavoured distractor, but they report device state and threshold events rather than the conversations a host had.',
    },
    {
      id: 'sp4m6q2',
      domain: 'Security Operations',
      prompt:
        'Flow records confirm that 40 GB left a database server towards an unknown address. Management asks which specific records were stolen. Which capability would have answered that question, and why do the flow records fall short?',
      choices: [
        'A vulnerability scan, because it lists the data stored on the server',
        'SNMP monitoring, because it records the payload of each transfer',
        'A packet capture, because it stores the actual payload, whereas NetFlow records only conversation metadata',
        'Log aggregation, because a SIEM reconstructs file contents from the correlated events',
      ],
      answer: 2,
      explain:
        'Only full packet capture preserves the content of the traffic, so it is the source that could show which records travelled, assuming the session was not encrypted. A SIEM correlates events from many systems and is invaluable for scoping the incident, but it works with log entries and never reconstructs the payload that crossed the wire.',
    },
    {
      id: 'sp4m6q3',
      domain: 'Security Operations',
      prompt:
        'A SOC manager notices that analysts routinely acknowledge hundreds of alerts in bulk without investigating them, and that two genuine incidents were missed last quarter. Which underlying problem does this describe, and which activity addresses it?',
      choices: [
        'Alert fatigue caused by excessive low-value alerts, addressed by alert tuning',
        'Insufficient log retention, addressed by extending the archiving period',
        'Inadequate scanning coverage, addressed by adding more vulnerability scans',
        'Poor reporting, addressed by producing weekly dashboards for management',
      ],
      answer: 0,
      explain:
        'Bulk-closing alerts is the textbook symptom of alert fatigue, and the remedy is tuning the rules that generate noise so the remaining alerts are worth reading. Extending retention or adding scans would increase the amount of data the same overloaded team has to process, which makes the underlying problem worse rather than better.',
    },
    {
      id: 'sp4m6q4',
      domain: 'Security Operations',
      prompt:
        'Which capability BEST distinguishes a SIEM from simply forwarding every device log to a central file server?',
      choices: [
        'It stores logs for longer than any other platform can',
        'It removes the need to install agents on monitored systems',
        'It encrypts log files so that attackers cannot alter them',
        'It normalizes and correlates events from different sources so that related activity across systems raises a single alert',
      ],
      answer: 3,
      explain:
        'Central storage alone gives you a bigger pile of text, whereas a SIEM parses events into a common format and correlates them across sources so that a firewall denial, a successful logon and a new account creation become one detection. Long retention is the tempting answer because SIEMs do store data, but retention is the job of archiving and is not what makes the platform useful operationally.',
    },
    {
      id: 'sp4m6q5',
      domain: 'Security Operations',
      prompt:
        'An organization wants automated, repeatable verification that its servers still match an approved CIS hardening benchmark, using tools from more than one vendor. Which standard makes this possible?',
      choices: [
        'NetFlow, which exports configuration state to a central collector',
        'SCAP, which provides a common format for expressing and checking security configuration content',
        'SNMP, which polls devices for their compliance status',
        'DLP, which inspects configuration files before they are changed',
      ],
      answer: 1,
      explain:
        'SCAP standardizes how configuration checks and results are expressed, so a benchmark written once can be evaluated by different scanners and the outcomes compared. SNMP is the distractor that also involves polling devices, but it reports operational state and thresholds rather than whether a host complies with a hardening baseline.',
    },
    {
      id: 'sp4m6q6',
      domain: 'Security Operations',
      prompt:
        'The port authority must monitor an ICS segment where the vendor forbids installing third-party software on the controllers and warns that additional load can disrupt the process. Which monitoring approach is appropriate, and what is the trade-off?',
      choices: [
        'Agent-based monitoring, accepting a short outage during installation',
        'No monitoring at all, because the segment is isolated from the corporate network',
        'Agentless monitoring, which avoids touching the devices but gives shallower and less continuous visibility',
        'Agent-based monitoring on a mirrored copy of the controllers',
      ],
      answer: 2,
      explain:
        'Agentless collection observes from the network or through existing management interfaces without installing anything, which is why it is the standard answer for OT and for devices that cannot host extra software. The price is less depth and only the visibility you actively query, but installing agents against vendor guidance risks both support and process stability, and leaving the segment unmonitored is never acceptable.',
    },
    {
      id: 'sp4m6q7',
      domain: 'Security Operations',
      prompt:
        'An EDR alert confirms ransomware behaviour on a laptop connected to the terminal network. Which immediate monitoring activity limits the damage while preserving the ability to investigate?',
      choices: [
        'Quarantine the host by isolating it on a restricted network segment while keeping it powered on',
        'Archive the endpoint logs so they are available for the investigation',
        'Tune the EDR rule so similar alerts are grouped into a single incident',
        'Run a full vulnerability scan of the laptop to identify how the malware entered',
      ],
      answer: 0,
      explain:
        'Quarantine cuts the host off from the rest of the network so the malware cannot spread, while leaving it running preserves memory and other volatile evidence for the investigation. Scanning it for vulnerabilities is the tempting analytical step, but it answers a question that can wait and does nothing to stop encryption spreading to file shares in the meantime.',
    },
  ],
};

export const SP4_PART3: Module[] = [sp4m5, sp4m6];
