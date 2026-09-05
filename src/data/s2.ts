import type { Module } from '../lib/types';

export const S2_MODULES: Module[] = [
  // -------------------------------------------------------------------------
  {
    id: 's2m1',
    sectionId: 's2',
    title: 'La Cyber Kill Chain',
    minutes: 14,
    objectives: [
      'Recorrer las 7 fases de la Kill Chain con ejemplos reales',
      'Entender por qué el defensor solo necesita romper un eslabón',
      'Reconocer qué fases son observables y cuáles no',
    ],
    blocks: [
      {
        t: 'p',
        md: 'La **Cyber Kill Chain** (Lockheed Martin) modela una intrusión como una cadena de fases que el adversario debe completar **en orden**. Su poder defensivo está en la asimetría: el atacante necesita toda la cadena; al defensor le basta romper **un eslabón** para frustrar el objetivo.',
      },
      {
        t: 'table',
        headers: ['#', 'Fase', 'Qué hace el adversario', 'Ejemplo (VELVET CICADA)'],
        rows: [
          ['1', 'Reconnaissance', 'Investiga objetivo: personas, tecnología, superficie', 'Scrapea LinkedIn de ingenieros de Meridian'],
          ['2', 'Weaponization', 'Prepara el artefacto: payload + exploit/dropper', 'Empaqueta un LNK malicioso dentro de un ZIP «CV_Ingeniero.zip»'],
          ['3', 'Delivery', 'Entrega el artefacto al objetivo', 'Spearphishing a RR.HH. con el ZIP adjunto'],
          ['4', 'Exploitation', 'Ejecuta código aprovechando una debilidad (técnica o humana)', 'La víctima abre el LNK; se lanza PowerShell'],
          ['5', 'Installation', 'Establece persistencia', 'Instala un loader como tarea programada'],
          ['6', 'Command & Control (C2)', 'Canal de mando con la infraestructura del actor', 'Beacon HTTPS a update-svc-cdn.com'],
          ['7', 'Actions on Objectives', 'Cumple su misión', 'Localiza y exfiltra diseños CAD del programa de propulsión'],
        ],
      },
      {
        t: 'callout',
        kind: 'tip',
        title: 'Fase invisible',
        md: '**Weaponization** ocurre en el entorno del adversario: no la observas directamente. La *infieres* analizando el artefacto entregado (metadatos del documento, builder usado, paths de compilación como el **PDB path**). Recon también es mayormente invisible salvo en tus logs públicos.',
      },
      {
        t: 'p',
        md: 'Dos usos prácticos: (1) **comunicar**: «lo paramos en delivery» dice mucho en cuatro palabras; (2) **medir**: si todas tus detecciones disparan en fase 7, llegas tarde — el objetivo es detectar lo más a la izquierda posible.',
      },
      {
        t: 'callout',
        kind: 'warn',
        title: 'Crítica habitual',
        md: 'La Kill Chain modela bien intrusiones con malware y fases lineales, pero encaja peor con insiders, abuso de credenciales válidas o ataques a SaaS. Por eso se complementa con **ATT&CK** (S2M5) y el **Diamond Model** (S2M3). En el examen, conoce sus fortalezas *y* limitaciones.',
      },
      {
        t: 'check',
        q: {
          q: 'An attacker registers a lookalike domain and sends a malicious resume ZIP to HR. Which Kill Chain phase is the email itself?',
          choices: ['Weaponization', 'Delivery', 'Exploitation', 'Reconnaissance'],
          answer: 1,
          explain:
            'Transmitting the weaponized artifact to the victim is Delivery. Building the ZIP was Weaponization; opening/executing is Exploitation.',
        },
      },
      { t: 'h', text: 'Una intrusión, fase a fase' },
      {
        t: 'p',
        md: 'Teoría aparte: así se ve una kill chain reconstruida desde la evidencia. Arriba, las cabeceras del spearphish que recibió RR.HH.; debajo, la cadena de procesos que el EDR registró en el host de la víctima. Lee las anotaciones `[fase]` de la derecha: cada línea del artefacto es evidencia de una fase concreta.',
      },
      {
        t: 'code',
        lang: 'text',
        title: 'Correo + cadena de procesos reconstruida (ficticio)',
        text: `=== EMAIL HEADERS (mail gateway, 2026-03-02 09:41 UTC) ===
From: "Laura Iglesias - Talent" <l.iglesias@meridian-careers.com>   [Delivery]
Return-Path: <bounce@mx1.cdn-sync-status.example>                   [Delivery]
Received: from mx1.cdn-sync-status.example (203.0.113.27)
    by mail.meridian.example; Mon, 2 Mar 2026 09:41:07 +0000        [Delivery]
Subject: Candidatura - Ingeniero de propulsion (CV adjunto)
Attachment: CV_Ingeniero.zip (contiene: CV_Ingeniero.pdf.lnk)       [Weaponization*]

=== EDR PROCESS CHAIN (host ENG-WS-041, mismo dia) ===
09:44:12  explorer.exe
            └─ abre CV_Ingeniero.pdf.lnk                            [Exploitation]
09:44:13  powershell.exe -nop -w hidden -enc SQBFAFgAKA...          [Exploitation]
09:44:19  escribe C:\\ProgramData\\winhlp.exe                         [Installation]
09:44:20  schtasks /create /tn WindowsUpdateCheck
            /tr C:\\ProgramData\\winhlp.exe /sc onlogon               [Installation]
09:45:02  winhlp.exe → TLS update-svc-cdn.com:443 (beacon 60s)      [C2]

* inferida: el LNK dentro del ZIP se construyó en el entorno del actor.`,
      },
      {
        t: 'p',
        md: 'Observa la frontera epistemológica: **Delivery, Exploitation, Installation y C2 están observadas** — cada una tiene un log con timestamp. **Weaponization está inferida**: nadie vio al actor empaquetar el LNK; lo reconstruyes desde el artefacto entregado. Y Reconnaissance ni aparece. Fíjate también en las cabeceras: el `From` muestra un dominio verosímil (`meridian-careers.com`), pero `Return-Path` y `Received` apuntan a `cdn-sync-status.example` — la infraestructura real del envío. Objetivo defensivo: cada control que dispare **a la izquierda del C2** te ahorra todas las fases que siguen.',
      },
      {
        t: 'check',
        q: {
          q: 'The Return-Path/Received headers pointing to cdn-sync-status.example are evidence of which phase?',
          choices: ['Reconnaissance', 'Weaponization', 'Delivery', 'Exploitation'],
          answer: 2,
          explain:
            'Headers document the transmission of the artifact to the victim — Delivery. Exploitation only starts when the LNK is opened; building the ZIP (Weaponization) is inferred, not observed.',
        },
      },
      {
        t: 'check',
        q: {
          q: 'In the EDR chain, the schtasks line and the winhlp.exe→443 line correspond respectively to:',
          choices: [
            'C2 and Actions on Objectives',
            'Installation and C2',
            'Exploitation and Installation',
            'Installation and Actions on Objectives',
          ],
          answer: 1,
          explain:
            'Creating persistence (scheduled task) is Installation; the periodic TLS beacon to adversary infrastructure is C2. No objective action has been observed yet.',
        },
      },
      {
        t: 'p',
        md: 'Cada intrusión analizada produce una kill chain documentada. Varias kill chains comparadas revelan **patrones del adversario** — la base de las campañas (S2M4). Antes, veamos qué hacer defensivamente con cada fase: la matriz de **Courses of Action**.',
      },
    ],
    quiz: [
      {
        id: 's2m1q1',
        domain: 'Intrusion Analysis',
        prompt: 'Place these in correct Kill Chain order: (A) Installation, (B) Delivery, (C) Exploitation, (D) C2',
        choices: ['B → C → A → D', 'C → B → A → D', 'B → A → C → D', 'D → B → C → A'],
        answer: 0,
        explain:
          'Delivery → Exploitation → Installation → C2. The artifact arrives, code executes, persistence is established, then the implant calls home.',
      },
      {
        id: 's2m1q2',
        domain: 'Intrusion Analysis',
        prompt: 'Why is Weaponization special for defenders?',
        choices: [
          'It is the easiest phase to block with a firewall',
          'It happens in adversary-controlled space and can only be inferred from delivered artifacts',
          'It always involves zero-day exploits',
          'It is the only phase that leaves indicators',
        ],
        answer: 1,
        explain:
          'Weaponization is not directly observable; analysts infer it from artifact metadata (builders, compile paths, document properties).',
      },
      {
        id: 's2m1q3',
        domain: 'Intrusion Analysis',
        prompt:
          'A scheduled task that re-launches a loader at every boot corresponds to which phase?',
        choices: ['Exploitation', 'Installation', 'C2', 'Actions on Objectives'],
        answer: 1,
        explain:
          'Establishing persistence mechanisms is Installation. Exploitation was the initial code execution; C2 is the communication channel.',
      },
      {
        id: 's2m1q4',
        domain: 'Intrusion Analysis',
        prompt: 'The core defensive insight of the Kill Chain model is:',
        choices: [
          'Attackers always use all seven phases simultaneously',
          'Defenders must block every phase to succeed',
          'Breaking any single link denies the adversary their objective',
          'Only phase 7 matters because that is where damage occurs',
        ],
        answer: 2,
        explain:
          'The chain is sequential: deny one required step and the objective fails. Defense-in-depth places controls at multiple links.',
      },
      {
        id: 's2m1q5',
        domain: 'Intrusion Analysis',
        prompt:
          'All your detections fire at Actions on Objectives. What does this indicate?',
        choices: [
          'Excellent coverage — the final phase is the most important',
          'Detection posture is too late in the chain; earlier-phase visibility is needed',
          'The adversary is unsophisticated',
          'Your Kill Chain mapping is wrong',
        ],
        answer: 1,
        explain:
          'Detecting only at the objective phase means the adversary completed everything else unseen. Mature defense shifts detection left.',
      },
      {
        id: 's2m1q6',
        domain: 'Intrusion Analysis',
        prompt:
          'Which scenario fits the Kill Chain model LEAST naturally?',
        choices: [
          'Spearphishing leading to a custom implant',
          'An insider with legitimate access copying files to USB',
          'Exploit of an internet-facing server followed by webshell installation',
          'A watering-hole compromise delivering a loader',
        ],
        answer: 1,
        explain:
          'Insider abuse with valid access skips weaponization/delivery/exploitation — a known limitation of the model, complemented by ATT&CK and Diamond.',
      },
      {
        id: 's2m1q7',
        domain: 'Intrusion Analysis',
        prompt:
          'Given the reconstructed chain (ZIP attachment → LNK → PowerShell → scheduled task → beacon), the EARLIEST phase a host-based control could break is:',
        choices: [
          'Delivery — the email gateway runs on the host',
          'Exploitation — preventing the LNK from launching PowerShell',
          'Installation — deleting the dropped binary',
          'C2 — blocking the outbound beacon',
        ],
        answer: 1,
        explain:
          'Delivery happens at the mail gateway (a network control), before the endpoint. The first host-observable step is the LNK execution — Exploitation. Later controls work but concede more ground.',
      },
      {
        id: 's2m1q8',
        domain: 'Intrusion Analysis',
        prompt: 'Which evidence lets an analyst INFER Weaponization without observing it?',
        choices: [
          'The Received header chain',
          'The LNK disguised as a PDF inside the ZIP attachment',
          'The scheduled task name',
          'The beacon interval',
        ],
        answer: 1,
        explain:
          'The crafted artifact itself (an LNK masquerading as CV_Ingeniero.pdf) is the product of Weaponization — you reconstruct that phase from what was delivered. The other items evidence Delivery, Installation and C2.',
      },
      {
        id: 's2m1q9',
        domain: 'Intrusion Analysis',
        prompt: 'All of the following would evidence Actions on Objectives EXCEPT:',
        choices: [
          'Bulk read access to CAD design folders from the compromised host',
          'Compression of engineering files into staged archives',
          'Outbound transfer of staged archives to actor infrastructure',
          'The winhlp.exe beacon to update-svc-cdn.com every 60 seconds',
        ],
        answer: 3,
        explain:
          'A periodic beacon is the C2 channel — it enables the mission but is not the mission. Accessing, staging and exfiltrating the target data are the objective actions.',
      },
      {
        id: 's2m1q10',
        domain: 'Intrusion Analysis',
        prompt:
          'The actor spoofed a plausible sender domain (meridian-careers.com) so the email would be trusted and opened. This craft belongs to which phase — and why NOT Reconnaissance?',
        choices: [
          'Reconnaissance, because it required researching the company',
          'Delivery, because it is part of successfully transmitting the artifact to the victim',
          'Exploitation, because it exploits human trust',
          'Weaponization, because headers are part of the payload',
        ],
        answer: 1,
        explain:
          'Recon gathered the knowledge earlier; applying it so the email lands and gets opened is Delivery craft. Exploitation is the execution that follows the victim opening the LNK.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 's2m2',
    sectionId: 's2',
    title: 'Courses of Action Matrix',
    minutes: 12,
    objectives: [
      'Definir las acciones defensivas: Discover, Detect, Deny, Disrupt, Degrade, Deceive, Destroy',
      'Cruzarlas con las fases de la Kill Chain en una matriz accionable',
      'Razonar el trade-off entre bloquear y observar (intelligence gain/loss)',
    ],
    blocks: [
      {
        t: 'p',
        md: 'La matriz de **Courses of Action (CoA)** cruza las fases de la Kill Chain con las acciones defensivas disponibles. Convierte el análisis de intrusiones en un **menú de decisiones**: para cada fase observada, ¿qué podemos hacer?',
      },
      {
        t: 'table',
        headers: ['Acción', 'Definición', 'Ejemplo'],
        rows: [
          ['Discover', 'Búsqueda histórica/forense del indicador o comportamiento', 'Buscar el hash del loader en 90 días de logs EDR'],
          ['Detect', 'Identificar la actividad cuando ocurra (alerting)', 'Regla Sigma para LNK que lanza PowerShell'],
          ['Deny', 'Impedir que la acción funcione', 'Bloquear el dominio C2 en el proxy; denegar macros'],
          ['Disrupt', 'Interrumpir la acción mientras ocurre', 'Matar la conexión C2 activa; aislar el host'],
          ['Degrade', 'Reducir la eficacia o velocidad del adversario', 'Throttling del canal de exfiltración'],
          ['Deceive', 'Alimentar al adversario con información falsa', 'Honeypot con documentos señuelo; credenciales canario'],
          ['Destroy', 'Destruir la capacidad o infraestructura adversaria', 'Acción ofensiva — dominio legal de estados'],
        ],
      },
      {
        t: 'callout',
        kind: 'exam',
        title: 'Nota de examen',
        md: 'Distingue **Discover** (mirar hacia atrás: histórico) de **Detect** (mirar hacia delante: alerta en tiempo real), y **Deny** (impide que empiece) de **Disrupt** (corta lo que ya está en marcha). Son los pares que más confunden.',
      },
      {
        t: 'p',
        md: 'La matriz también estructura la **resiliencia**: si tu única defensa contra el delivery es un filtro de correo (Deny), un fallo te deja ciego. Defensa madura = varias celdas pobladas por fase, combinando pasivas y activas.',
      },
      { t: 'h', text: 'Intelligence gain/loss' },
      {
        t: 'p',
        md: 'Bloquear de inmediato no siempre es óptimo. Dejar correr una intrusión **controlada** (mientras proteges los activos) puede revelar objetivos, herramientas secundarias e infraestructura adicional del actor. Es la decisión de **intelligence gain/loss**: cada acción visible le enseña al adversario lo que sabes, y puede hacerle rotar TTPs e infraestructura — perdiendo tú visibilidad futura.',
      },
      {
        t: 'callout',
        kind: 'example',
        md: 'Si bloqueas el dominio C2 a los 5 minutos, el actor registra otro y pierdes el hilo. Si lo monitorizas 48h (Degrade + Detect en lugar de Deny inmediato), mapeas sus hosts comprometidos y su horario de operación — y luego desmontas todo de golpe.',
      },
      { t: 'h', text: 'La matriz, rellena' },
      {
        t: 'p',
        md: 'Así queda la matriz CoA de Meridian para la intrusión de VELVET CICADA (S2M1). Cada celda es una acción concreta y ejecutable — no una categoría. Las marcas `[!]` señalan acciones **visibles** para el actor: cada una gasta visibilidad futura, y eso también se decide.',
      },
      {
        t: 'code',
        lang: 'text',
        title: 'Matriz Courses of Action — intrusión VELVET CICADA (extracto de trabajo, ficticia)',
        text: `Leyenda: [!] = acción visible para el actor (coste de inteligencia)

DELIVERY
  Detect : alerta en mail gateway: ZIP con LNK interno
  Deny   : bloquear cdn-sync-status.example en el gateway          [!]
  Deceive: buzón señuelo de RR.HH. que acepta y detona adjuntos

EXPLOITATION
  Detect : regla EDR: LNK que lanza powershell -enc
  Deny   : política ASR: explorer no puede crear procesos PowerShell

INSTALLATION
  Detect : alerta: schtasks /create fuera del inventario aprobado
  Disrupt: aislamiento automático del host al crearse la tarea      [!]

COMMAND & CONTROL
  Detect : anomalía: beacon TLS periódico hacia dominio joven
  Deny   : sinkhole de update-svc-cdn.com                           [!] quema el hilo
  Degrade: throttling del egress hacia la IP del C2 (compra tiempo de mapeo)

ACTIONS ON OBJECTIVES
  Detect : DLP: lecturas masivas en carpetas CAD de propulsión
  Degrade: rate-limit de transferencias salientes no catalogadas
  Deceive: planos CAD señuelo con canary tokens                     (invisible si está bien hecho)`,
      },
      {
        t: 'p',
        md: 'Lee la matriz como un **menú de decisiones con precios**. El sinkhole del C2 es la acción más contundente — y la más cara: el actor sabrá en minutos que fue descubierto y rotará infraestructura, quemando tu visibilidad. La combinación Detect + Degrade en C2 logra contención parcial *sin firma*: el actor ve una red lenta, tú ves su operación completa. Y la resiliencia se lee por filas: Exploitation con dos celdas pobladas sobrevive al fallo de una; una fase con celda única es un punto único de fallo. La decisión final (¿cuándo desmontar todo?) no es del SOC: es una decisión de riesgo del negocio, informada por tu análisis.',
      },
      {
        t: 'check',
        q: {
          q: 'Which cell of this matrix carries the HIGHEST risk of tipping off the actor, and what is the lower-signature alternative in the same phase?',
          choices: [
            'The DLP detection; alternative: canary tokens',
            'The C2 sinkhole; alternative: Detect + Degrade (throttle) while mapping the operation',
            'The HR decoy mailbox; alternative: blocking the domain',
            'The EDR rule on LNK→PowerShell; alternative: ASR policy',
          ],
          answer: 1,
          explain:
            'Sinkholing the C2 domain is immediately visible to the actor and burns future visibility. Detection plus throttling contains risk while preserving the collection channel. Detections and canaries are passive — near-zero signature.',
        },
      },
      {
        t: 'check',
        q: {
          q: 'Searching the last 6 months of DNS logs for a newly learned C2 domain is which Course of Action?',
          choices: ['Detect', 'Discover', 'Deny', 'Disrupt'],
          answer: 1,
          explain:
            'Historical/retrospective search is Discover. Creating an alert for future resolutions would be Detect.',
        },
      },
      {
        t: 'check',
        q: {
          q: 'Quarantining a host while its implant is actively beaconing is:',
          choices: ['Deny', 'Disrupt', 'Deceive', 'Degrade'],
          answer: 1,
          explain:
            'Interrupting an action in progress is Disrupt. Deny prevents the action from succeeding in the first place.',
        },
      },
    ],
    quiz: [
      {
        id: 's2m2q1',
        domain: 'Intrusion Analysis',
        prompt:
          'Blocking a known-malicious attachment hash at the email gateway BEFORE any user receives it is:',
        choices: ['Detect', 'Deny', 'Disrupt', 'Discover'],
        answer: 1,
        explain:
          'Preventing the delivery from succeeding at all is Deny. Disrupt applies to actions already underway.',
      },
      {
        id: 's2m2q2',
        domain: 'Intrusion Analysis',
        prompt:
          'Deploying decoy engineering documents on a honeypot file share to mislead an intruder is:',
        choices: ['Degrade', 'Deceive', 'Destroy', 'Detect'],
        answer: 1,
        explain:
          'Feeding the adversary false information or fake assets is Deceive.',
      },
      {
        id: 's2m2q3',
        domain: 'Intrusion Analysis',
        prompt: 'Which action is generally OUTSIDE the legal remit of private defenders?',
        choices: ['Deceive', 'Degrade', 'Destroy', 'Discover'],
        answer: 2,
        explain:
          'Destroying adversary capability/infrastructure (hack-back) is offensive action, legally reserved to states in most jurisdictions.',
      },
      {
        id: 's2m2q4',
        domain: 'Intrusion Analysis',
        prompt:
          'An IR lead proposes watching an active C2 channel for 48 hours instead of blocking it immediately. The PRIMARY justification is:',
        choices: [
          'Blocking is technically difficult',
          'Intelligence gain — observing may reveal additional infrastructure, tools, and objectives before the actor rotates',
          'Compliance requires 48-hour observation periods',
          'It reduces SOC alert volume',
        ],
        answer: 1,
        explain:
          'The intelligence gain/loss tradeoff: visible defensive action teaches the adversary and may burn future visibility. Controlled observation can map the operation first.',
      },
      {
        id: 's2m2q5',
        domain: 'Intrusion Analysis',
        prompt:
          'Rate-limiting outbound transfers to a suspicious destination, slowing exfiltration without stopping it, is:',
        choices: ['Deny', 'Degrade', 'Disrupt', 'Deceive'],
        answer: 1,
        explain:
          'Reducing the effectiveness/speed of the adversary action without fully stopping it is Degrade.',
      },
      {
        id: 's2m2q6',
        domain: 'Intrusion Analysis',
        prompt:
          'Why should defenders populate MULTIPLE Courses of Action per Kill Chain phase?',
        choices: [
          'To maximize security tool spending',
          'Resilience: a single control per phase is a single point of failure; layered passive and active options survive control failures',
          'Because auditors require seven controls per phase',
          'To ensure the adversary is always blocked at phase 1',
        ],
        answer: 1,
        explain:
          'A matrix with one populated cell per phase is brittle. Multiple complementary actions per phase give the defender options and resilience.',
      },
      {
        id: 's2m2q7',
        domain: 'Intrusion Analysis',
        prompt:
          'In the worked matrix, Exploitation has Detect + Deny populated while Actions on Objectives has three cells. A phase left with a SINGLE populated cell means:',
        choices: [
          'That phase is fully covered',
          'A single point of failure: if that one control fails or is bypassed, the phase goes unopposed',
          'The adversary cannot reach that phase',
          'The matrix is complete once every phase has at least one cell',
        ],
        answer: 1,
        explain:
          'One cell per phase is a brittle posture — controls fail, get bypassed, or produce false negatives. Resilience is measured per row: multiple complementary actions per phase.',
      },
      {
        id: 's2m2q8',
        domain: 'Intrusion Analysis',
        prompt:
          'Choosing Detect + Degrade over an immediate C2 Deny is the WRONG call when:',
        choices: [
          'The actor is still in early lateral movement',
          'Crown-jewel data is actively being exfiltrated and every hour of observation costs irreplaceable assets',
          'The SOC wants to map additional adversary infrastructure',
          'Leadership has accepted the monitoring risk in writing',
        ],
        answer: 1,
        explain:
          'Intelligence gain/loss is a trade: observation pays off only while the cost of letting activity run is acceptable. Active exfiltration of critical assets flips the balance — contain now, collect later.',
      },
      {
        id: 's2m2q9',
        domain: 'Intrusion Analysis',
        prompt:
          'After learning the actor drops winhlp.exe, the team (a) sweeps 90 days of EDR telemetry for that filename and (b) creates an alert for future executions. In CoA terms these are respectively:',
        choices: [
          'Detect and Discover',
          'Discover and Detect',
          'Deny and Detect',
          'Discover and Disrupt',
        ],
        answer: 1,
        explain:
          'Retrospective/historical search is Discover (looking backward); the forward-looking alert is Detect. Deny/Disrupt would prevent or interrupt the action itself.',
      },
      {
        id: 's2m2q10',
        domain: 'Intrusion Analysis',
        prompt:
          'Planting decoy CAD drawings seeded with canary tokens in the propulsion file share is BEST classified as:',
        choices: [
          'Degrade, because it slows the adversary down',
          'Deceive, because it feeds the adversary false assets and reveals access when tokens fire',
          'Deny, because the real files are protected',
          'Destroy, because the stolen data is useless',
        ],
        answer: 1,
        explain:
          'Feeding false information/assets is Deceive — with the bonus that a fired canary is high-fidelity detection. Nothing was slowed (Degrade) or made impossible (Deny).',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 's2m3',
    sectionId: 's2',
    title: 'El Diamond Model',
    minutes: 14,
    objectives: [
      'Descomponer eventos de intrusión en los 4 vértices del diamante',
      'Usar meta-features y los ejes socio-político y tecnológico',
      'Pivotar analíticamente entre vértices para expandir conocimiento',
    ],
    blocks: [
      {
        t: 'p',
        md: 'El **Diamond Model of Intrusion Analysis** descompone cada **evento** de intrusión en cuatro vértices conectados: **Adversary** (quién), **Capability** (con qué), **Infrastructure** (a través de qué) y **Victim** (contra quién). Su axioma fundacional: *para cada intrusión existe un adversario dando un paso hacia un objetivo usando una capability sobre una infraestructura contra una víctima*.',
      },
      {
        t: 'table',
        headers: ['Vértice', 'Qué contiene', 'Ejemplos'],
        rows: [
          ['Adversary', 'Operador y cliente/beneficiario detrás de la intrusión', 'Persona, grupo, sponsor; email de registro kazuo.tanji@'],
          ['Capability', 'Herramientas y técnicas usadas', 'Loader propio, LNK→PowerShell, webshell, exploit'],
          ['Infrastructure', 'Activos físicos/lógicos que conectan capability con víctima', 'Dominios, IPs, servidores C2, cuentas de email'],
          ['Victim', 'Objetivo y sus activos', 'Meridian Dynamics; servidores CAD; ingenieros de propulsión'],
        ],
      },
      {
        t: 'p',
        md: 'Cada evento lleva **meta-features**: timestamp, fase de la kill chain, resultado, dirección, metodología y recursos. Dos ejes atraviesan el diamante: el **eje socio-político** (Adversary↔Victim: por qué *esta* víctima — la relación de necesidad del adversario) y el **eje tecnológico** (Capability↔Infrastructure: cómo se despliega la técnica).',
      },
      {
        t: 'callout',
        kind: 'tip',
        title: 'Distinción examinable',
        md: 'Dentro de Adversary se distingue **operator** (quien teclea) de **customer** (quien se beneficia/encarga). Pueden ser entidades distintas — un contratista operando para un servicio de inteligencia — y la distinción importa para atribución (S4M5).',
      },
      { t: 'h', text: 'Pivoting analítico' },
      {
        t: 'p',
        md: 'El valor operativo del diamante es el **pivoteo**: cada vértice conocido permite descubrir los demás. Desde la víctima (tus logs) sacas la capability (muestra); de la muestra, la infraestructura (C2 hardcodeado); de la infraestructura, más capability (otras muestras que llaman al mismo C2) o un slip del adversario (email de registro). Así se construye el grafo completo de la operación — exactamente lo que harás en el **Lab 3A: Pivot Hunt**.',
      },
      {
        t: 'p',
        md: 'Así se documenta un evento real. El beacon que el SOC escaló la madrugada del 5 de marzo, descompuesto en diamante — con sus meta-features y, en cada vértice, los **pivotes pendientes**:',
      },
      {
        t: 'code',
        lang: 'text',
        title: 'Evento Diamond — E7 del informe MER-2026-019 (ficticio)',
        text: `DIAMOND EVENT E7
Timestamp   : 2026-03-05 02:13 UTC              (meta-feature)
KC phase    : Command & Control                 (meta-feature)
Result      : success                           (meta-feature)
Direction   : victim → infrastructure           (meta-feature)
Methodology : beacon HTTPS, jitter 60s          (meta-feature)
Resources   : VPS, dominio, cert TLS            (meta-feature)

ADVERSARY      : UNKNOWN
  └─ pivote pendiente: WHOIS histórico del dominio →
     registrante 2025: kazuo.tanji@protonmail.com
CAPABILITY     : implante GLASS VIPER (stage-1 loader)
  └─ SHA-256 9f3a...e1 | named pipe vc_pipe_%08x
INFRASTRUCTURE : update-svc-cdn.com → 141.98.6.10 (VPS)
  └─ cert TLS autofirmado CN=updatesvc,
     visto en 2 IPs más (pivote de alto valor)
VICTIM         : Meridian Dynamics / ENG-WS-041
  └─ workstation de ingeniería de propulsión

Eje socio-político : Adversary ↔ Victim
  ¿por qué Meridian? → IP de propulsión = la necesidad del cliente
Eje tecnológico    : Capability ↔ Infrastructure
  implante + dominio/VPS/cert = cómo se despliega la técnica`,
      },
      {
        t: 'p',
        md: 'Fíjate en dos decisiones de tradecraft. Primera: **Adversary se queda en UNKNOWN** — el diamante no te obliga a rellenar lo que no sabes; te obliga a *saber qué te falta* y qué pivote podría llenarlo. Segunda: no todos los pivotes valen igual. El cert TLS **autofirmado** reutilizado en tres servidores es oro — solo el actor lo despliega. Una IP de shared hosting con 400 dominios de terceros es ruido. Y la distinción **operator vs. customer** vive dentro del vértice Adversary: `kazuo.tanji@` (si el pivote confirma) sería el *operator* que registró el dominio; quién encarga y recibe los diseños de propulsión — el *customer* — sigue siendo otra incógnita.',
      },
      {
        t: 'callout',
        kind: 'example',
        md: 'Evento: beacon HTTPS desde un host de ingeniería a `update-svc-cdn.com`. Victim: workstation de Meridian. Capability: el implante. Infrastructure: el dominio + su IP. Adversary: ¿desconocido aún? El certificado TLS reutilizado y el WHOIS son tus pivotes hacia él.',
      },
      {
        t: 'check',
        q: {
          q: 'From event E7, which pivot has the HIGHEST discriminating power for expanding the adversary infrastructure?',
          choices: [
            'The IP address, because shared hosting connects many domains',
            'The reused self-signed TLS certificate, because only the actor deploys it',
            'The victim hostname, because it identifies the target',
            'The beacon jitter value, because it is unusual',
          ],
          answer: 1,
          explain:
            'A self-signed cert reused across servers is actor-controlled and rare — following it finds actor infrastructure. A shared-hosting IP links to hundreds of unrelated tenants (noise).',
        },
      },
      {
        t: 'check',
        q: {
          q: 'Analysts later find event E9 with the same methodology, the same capability, and a phase of Actions on Objectives, two days after E7. Combining E7 and E9 chronologically produces:',
          choices: [
            'A new Diamond vertex',
            'An activity thread — the analytic bridge to S2M4',
            'A completed attribution',
            'A Courses of Action matrix',
          ],
          answer: 1,
          explain:
            'Ordering related Diamond events along the kill chain over time builds an activity thread — the unit that S2M4 groups into campaigns. Vertices and CoA are different constructs; attribution needs far more.',
        },
      },
      {
        t: 'check',
        q: {
          q: 'In the Diamond Model, a C2 domain and the VPS hosting it belong to which vertex?',
          choices: ['Capability', 'Infrastructure', 'Adversary', 'Victim'],
          answer: 1,
          explain:
            'Domains, IPs, and servers that connect capabilities to victims are Infrastructure. The implant itself is the Capability.',
        },
      },
      {
        t: 'check',
        q: {
          q: 'The socio-political axis of the Diamond connects which two vertices?',
          choices: [
            'Capability ↔ Infrastructure',
            'Adversary ↔ Victim',
            'Victim ↔ Infrastructure',
            'Adversary ↔ Capability',
          ],
          answer: 1,
          explain:
            'The socio-political axis explains why this adversary needs/targets this victim; the technology axis runs Capability↔Infrastructure.',
        },
      },
    ],
    quiz: [
      {
        id: 's2m3q1',
        domain: 'Intrusion Analysis',
        prompt: 'The four vertices of the Diamond Model are:',
        choices: [
          'Actor, Tool, Network, Target',
          'Adversary, Capability, Infrastructure, Victim',
          'Adversary, Campaign, IOC, Victim',
          'Intent, Capability, Opportunity, Impact',
        ],
        answer: 1,
        explain:
          'Adversary, Capability, Infrastructure, Victim — every intrusion event maps to these four connected features.',
      },
      {
        id: 's2m3q2',
        domain: 'Intrusion Analysis',
        prompt:
          'A custom PowerShell loader observed in an intrusion maps to which vertex?',
        choices: ['Infrastructure', 'Adversary', 'Capability', 'Victim'],
        answer: 2,
        explain:
          'Tools, malware, exploits and techniques are Capabilities.',
      },
      {
        id: 's2m3q3',
        domain: 'Intrusion Analysis',
        prompt:
          'Within the Adversary vertex, the distinction between OPERATOR and CUSTOMER matters because:',
        choices: [
          'Operators are always more skilled',
          'The hands-on-keyboard entity and the benefiting/tasking entity can differ, which changes attribution and intent analysis',
          'Customers never use contractors',
          'It determines which IOCs to block first',
        ],
        answer: 1,
        explain:
          'Contractors or proxies may operate on behalf of a sponsor. Distinguishing them is central to attribution levels (machine/operator/sponsor).',
      },
      {
        id: 's2m3q4',
        domain: 'Intrusion Analysis',
        prompt:
          'Starting from a malware sample and extracting its hardcoded C2 domain to find more activity is an example of:',
        choices: [
          'Capability → Infrastructure pivoting',
          'Victim → Adversary pivoting',
          'Infrastructure → Victim pivoting',
          'Adversary → Capability pivoting',
        ],
        answer: 0,
        explain:
          'You moved from the Capability vertex (sample) to the Infrastructure vertex (C2). Analytic pivoting expands knowledge vertex by vertex.',
      },
      {
        id: 's2m3q5',
        domain: 'Intrusion Analysis',
        prompt:
          'Which meta-feature set belongs to a Diamond event?',
        choices: [
          'Timestamp, kill chain phase, result, direction, methodology, resources',
          'Severity, CVSS, patch level',
          'Country, language, time zone',
          'Cost, duration, headcount',
        ],
        answer: 0,
        explain:
          'Diamond events carry meta-features including timestamp, phase, result, direction, methodology, and resources, enabling threading and grouping.',
      },
      {
        id: 's2m3q6',
        domain: 'Intrusion Analysis',
        prompt:
          'Why does the Diamond Model pair naturally with the Kill Chain?',
        choices: [
          'They were created by the same authors',
          'Each Kill Chain phase of an intrusion can be expressed as a Diamond event, producing an activity thread over time',
          'The Diamond replaces the need for phases',
          'Kill Chain handles insiders; Diamond handles malware',
        ],
        answer: 1,
        explain:
          'Diamond events tagged with kill chain phases chain together into activity threads — the bridge to campaign analysis.',
      },
      {
        id: 's2m3q7',
        domain: 'Intrusion Analysis',
        prompt:
          'In event E7 the Adversary vertex is documented as UNKNOWN with a pending WHOIS pivot. The BEST reading of this practice is:',
        choices: [
          'The analysis failed — every vertex must be filled before reporting',
          'The model forces you to make what you do not know explicit, together with the pivot that could fill it',
          'Adversary is optional because attribution never matters',
          'UNKNOWN means the event should be discarded',
        ],
        answer: 1,
        explain:
          'The Diamond is an analytic scaffold, not a form to complete: an explicit UNKNOWN plus a pending pivot is rigorous. More telemetry alone rarely fills Adversary — pivots and adversary mistakes do.',
      },
      {
        id: 's2m3q8',
        domain: 'Intrusion Analysis',
        prompt:
          '"Why would this actor need propulsion IP from THIS company?" is a question about which Diamond feature?',
        choices: [
          'The technology axis (Capability ↔ Infrastructure)',
          'The socio-political axis (Adversary ↔ Victim)',
          'The Result meta-feature',
          'The Direction meta-feature',
        ],
        answer: 1,
        explain:
          'The adversary-victim relationship — why this victim satisfies the adversary\'s needs — is the socio-political axis. The technology axis covers how capability deploys over infrastructure.',
      },
      {
        id: 's2m3q9',
        domain: 'Intrusion Analysis',
        prompt:
          'Evidence later suggests the intrusion was executed by a contractor crew while the stolen designs flow to a separate beneficiary. In Diamond terms:',
        choices: [
          'The contractor is the customer; the beneficiary is the operator',
          'Both fit in the Adversary vertex: the crew as operator, the beneficiary as customer',
          'The beneficiary belongs in the Victim vertex',
          'The model cannot represent two entities behind one intrusion',
        ],
        answer: 1,
        explain:
          'Adversary distinguishes operator (hands on keyboard) from customer (who tasks and benefits). Both live in the same vertex — and the distinction drives attribution levels in S4M5.',
      },
      {
        id: 's2m3q10',
        domain: 'Intrusion Analysis',
        prompt:
          'A C2 domain hardcoded inside the implant binary is analytically special because:',
        choices: [
          'It proves the operator\'s identity',
          'It welds Capability to Infrastructure — a strong link the actor chose at build time, ideal for grouping',
          'It makes the malware easier to detect with hashes',
          'It belongs to the Victim vertex',
        ],
        answer: 1,
        explain:
          'A hardcoded C2 ties the capability and the infrastructure by the actor\'s own deliberate act — far stronger than a shared IP. Strong capability↔infrastructure links are prime grouping evidence (S2M4).',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 's2m4',
    sectionId: 's2',
    title: 'Activity threads y agrupación de intrusiones',
    minutes: 14,
    objectives: [
      'Construir activity threads a partir de eventos Diamond',
      'Agrupar intrusiones relacionadas en activity groups',
      'Recorrer un clustering real paso a paso',
      'Evitar enlaces débiles al correlacionar kill chains',
    ],
    blocks: [
      {
        t: 'p',
        md: 'Una intrusión real no es un evento: es una **secuencia**. Cuando encadenas los eventos Diamond de una misma víctima a lo largo de las fases de la kill chain obtienes un **activity thread** — la historia completa de esa intrusión.',
      },
      {
        t: 'p',
        md: 'El salto analítico llega al comparar **varios threads**: ¿comparten weaponizer? ¿el mismo C2? ¿idéntico patrón de targeting? Los threads con suficientes características comunes se agrupan en un **activity group** — el precursor analítico de lo que públicamente se llama «APT-X» o «intrusion set». Los **activity-attack graphs** superponen los threads observados con los caminos *posibles* del adversario, para anticipar variantes.',
      },
      {
        t: 'callout',
        kind: 'warn',
        title: 'El peligro: enlaces débiles',
        md: 'Agrupar dos intrusiones porque ambas usaron `PowerShell` o una herramienta pública (Mimikatz, Cobalt Strike) es un **weak link**: miles de actores comparten esas características. Los enlaces fuertes son **raros y costosos de cambiar**: un weaponizer propio, infraestructura registrada con el mismo patrón, un PDB path único, targeting muy específico. Volveremos sobre esto con rigor en S4M4 (clustering).',
      },
      {
        t: 'table',
        headers: ['Evidencia compartida', 'Fuerza del enlace', 'Por qué'],
        rows: [
          ['Mismo PDB path único en dos loaders', 'Fuerte', 'Artefacto del entorno de desarrollo del actor'],
          ['Mismo certificado TLS autofirmado en 3 C2', 'Fuerte', 'Reutilización de material criptográfico propio'],
          ['Ambas usan Cobalt Strike', 'Débil', 'Herramienta comercial usada por cientos de actores'],
          ['Ambas hacen phishing', 'Muy débil', 'Técnica universal'],
          ['Targeting: mismas 5 empresas de propulsión en 2 semanas', 'Medio-fuerte', 'Patrón de tasking específico'],
        ],
      },
      {
        t: 'check',
        q: {
          q: 'Two intrusions at different companies share: the same custom loader, C2 domains registered with the same email pattern, and aerospace targeting. This MOST supports:',
          choices: [
            'Random coincidence',
            'Grouping them into one activity group based on multiple strong shared features',
            'Attribution to a specific country',
            'Both being false positives',
          ],
          answer: 1,
          explain:
            'Multiple rare, costly-to-change shared features justify activity grouping. Note: grouping is NOT yet attribution to a sponsor.',
        },
      },
      { t: 'h', text: 'Walkthrough: dos bandejas de eventos, ¿un actor?' },
      {
        t: 'p',
        md: 'Hagamos el trabajo real. Te llegan estos eventos crudos de dos organizaciones distintas. Antes de seguir leyendo, intenta decidir: ¿cuántos threads hay, y hay base para agruparlos?',
      },
      {
        t: 'code',
        lang: 'text',
        title: 'Eventos crudos consolidados (ficticios)',
        text: `[Victim 1 — Meridian Dynamics]
2026-03-02 09:14  email "PO revision" -> j.alvarez@meridian.example
2026-03-02 09:31  attachment runs; drops C:\\Users\\..\\winhlp.exe
                  linker artifact: D:\\proj\\cicada\\loader\\ldr.pdb
2026-03-02 09:32  winhlp.exe beacons -> cdn-sync-status.example:443
2026-03-04 22:10  archive staged: C:\\Windows\\Temp\\~tmp4421.cab
2026-03-05 01:47  1.2 GB out -> transfer-cdn-eu.example

[Victim 2 — Orbital Components (Meridian supplier)]
2026-03-09 08:05  email "PO revision" -> finance@orbital.example
2026-03-09 08:22  attachment runs; drops C:\\Users\\..\\msdtcs.exe
                  linker artifact: D:\\proj\\cicada\\loader\\ldr.pdb
2026-03-09 08:23  msdtcs.exe beacons -> portal-auth-check.example:443`,
      },
      {
        t: 'p',
        md: '**Paso 1 — separa por víctima y ordena por fases.** Victim 1 es un thread completo: Delivery (phish) → Installation (`winhlp.exe`) → C2 (beacon) → Actions (staging y exfil de 1,2 GB). Victim 2 es un thread *parcial*: Delivery → Installation → C2, sin acciones finales observadas **todavía**. **Paso 2 — compara los threads con criterios de fuerza**, no con la intuición:',
      },
      {
        t: 'table',
        headers: ['Observación compartida', 'Tipo', 'Veredicto'],
        rows: [
          ['Mismo lure «PO revision» en ambas', 'Tema de targeting', '**Medio** — sugiere el mismo tasking, no lo prueba'],
          ['Mismo PDB path `cicada\\loader\\ldr.pdb`', 'Artefacto de desarrollo', '**Fuerte** — mismo entorno de build del actor'],
          ['Dominios C2 distintos', 'Infraestructura rotada', '**Neutro** — rotar dominios es barato; su ausencia no rompe el grupo'],
          ['Ambos beacons por HTTPS/443', 'Técnica universal', '**Muy débil** — descártalo como criterio'],
          ['Victim 2 es proveedor de Victim 1', 'Eje socio-político', '**Medio** — coherente con una campaña contra la cadena de suministro'],
        ],
      },
      {
        t: 'p',
        md: '**Veredicto:** un enlace fuerte (el PDB) reforzado por dos medios coherentes → ambos threads entran en el mismo **activity group candidato**. Y aquí el grafo paga el esfuerzo: si el actor sigue el patrón del thread 1, en Orbital *aún no ha llegado* el staging ni la exfiltración — el **activity-attack graph** te dice exactamente qué buscar y dónde sembrar detección esta noche.',
      },
      {
        t: 'check',
        q: {
          q: 'In the walkthrough, the two intrusions used DIFFERENT C2 domains. Why does the analyst still group them?',
          choices: [
            'Because both used HTTPS',
            'A strong development artifact (shared unique PDB path) outweighs rotated infrastructure — absence of a cheap-to-change link does not break a group',
            'Because the victims know each other',
            'Grouping was a mistake',
          ],
          answer: 1,
          explain:
            'Links are weighed by how costly they are for the actor to change. Domains rotate for free; build-environment artifacts persist.',
        },
      },
      {
        t: 'p',
        md: 'Resultado práctico: cuando tu nuevo incidente encaja en un activity group conocido, heredas hipótesis listas para usar — qué hará el actor a continuación, qué herramientas lleva, qué busca — y puedes defenderte **proactivamente**.',
      },
      {
        t: 'check',
        q: {
          q: 'Victim 2\'s thread shows Delivery → Installation → C2 but no staging or exfil yet. Per the activity-attack graph logic, the BEST immediate defensive move is:',
          choices: [
            'Wait for exfiltration to confirm the pattern',
            'Hunt and instrument the phases the group performed at Victim 1 but not yet here: archive staging in temp paths and large outbound transfers',
            'Block HTTPS for all users',
            'Declare the incident closed',
          ],
          answer: 1,
          explain:
            'Group membership predicts the actor\'s remaining moves. You defend the phases that have not happened yet — that is proactive CTI.',
        },
      },
      {
        t: 'callout',
        kind: 'story',
        title: '🎖️ Campaña',
        md: 'En el **Lab 2A** reconstruirás la kill chain completa de la intrusión de VELVET CICADA en Meridian, y en el **Lab 2B** descompondrás su evidencia en el diamante. Los threads que construyas ahora se convertirán en el activity group del caso.',
      },
    ],
    quiz: [
      {
        id: 's2m4q1',
        domain: 'Intrusion Analysis',
        prompt: 'An activity thread is:',
        choices: [
          'A list of IOCs from one feed',
          'The sequence of Diamond events across kill chain phases for a single intrusion',
          'A Twitter thread about an APT',
          'A SIEM correlation rule',
        ],
        answer: 1,
        explain:
          'Threading links the events of one intrusion through its phases, telling the full story of that victim\'s compromise.',
      },
      {
        id: 's2m4q2',
        domain: 'Intrusion Analysis',
        prompt:
          'Which shared feature provides the STRONGEST basis for linking two intrusions?',
        choices: [
          'Both used phishing emails',
          'Both used PowerShell',
          'Both delivered a custom implant containing the same unique PDB path',
          'Both occurred on a Tuesday',
        ],
        answer: 2,
        explain:
          'A unique development artifact is rare and costly to change — a strong link. Phishing and PowerShell are near-universal (weak links).',
      },
      {
        id: 's2m4q3',
        domain: 'Intrusion Analysis',
        prompt: 'The purpose of an activity-attack graph is to:',
        choices: [
          'Replace the kill chain entirely',
          'Overlay observed adversary paths with potential alternative paths to anticipate variations',
          'Visualize SOC ticket volume',
          'Map the org chart of the adversary',
        ],
        answer: 1,
        explain:
          'Activity-attack graphs combine what the adversary did with what they could do, guiding proactive defense.',
      },
      {
        id: 's2m4q4',
        domain: 'Intrusion Analysis',
        prompt:
          'Why is "both groups use Cobalt Strike" a weak grouping criterion?',
        choices: [
          'Cobalt Strike is detected by all EDRs',
          'Commodity/public tooling is shared across hundreds of unrelated actors, so it discriminates poorly',
          'Cobalt Strike is legal software',
          'It is actually a strong criterion',
        ],
        answer: 1,
        explain:
          'Discriminating power comes from rarity. Widely available tools appear in unrelated intrusions constantly.',
      },
      {
        id: 's2m4q5',
        domain: 'Intrusion Analysis',
        prompt:
          'Your new incident matches a known activity group. The MAIN practical benefit is:',
        choices: [
          'You can name the attacker publicly',
          'You inherit testable hypotheses about the actor\'s next steps, tooling, and objectives',
          'You can close the incident immediately',
          'Insurance premiums drop',
        ],
        answer: 1,
        explain:
          'Group knowledge gives predictive power: likely persistence methods, staging behavior, and objectives to check proactively.',
      },
      {
        id: 's2m4q6',
        domain: 'Intrusion Analysis',
        prompt: 'An activity group is best described as:',
        choices: [
          'Any two intrusions in the same sector',
          'A set of activity threads clustered on shared, analytically justified features',
          'A government attribution statement',
          'A malware family tree',
        ],
        answer: 1,
        explain:
          'Activity groups are analytic clusters of related intrusions — distinct from public naming or state attribution.',
      },
      {
        id: 's2m4q7',
        domain: 'Intrusion Analysis',
        prompt:
          'Two intrusions share a phishing lure theme and a unique PDB path, but use different C2 domains. The correct analytic conclusion is:',
        choices: [
          'No grouping — infrastructure does not match',
          'Group them: the rare development artifact is a strong link, and rotated infrastructure is expected actor behavior',
          'Group them only if the same IP appears',
          'Attribute them to a known APT immediately',
        ],
        answer: 1,
        explain:
          'Strong links are rare and costly to change. Infrastructure rotation is cheap, so non-matching C2 carries little negative weight.',
      },
      {
        id: 's2m4q8',
        domain: 'Intrusion Analysis',
        prompt: 'The correct ORDER of analytic construction is:',
        choices: [
          'Activity group → threads → events',
          'Diamond events → activity threads (per victim, across kill chain phases) → compared threads → activity group',
          'IOC feed → attribution → threads',
          'Kill chain → attribution → events',
        ],
        answer: 1,
        explain:
          'Events chain into per-intrusion threads; threads with strong shared features cluster into groups. Each layer rests on the one below.',
      },
      {
        id: 's2m4q9',
        domain: 'Intrusion Analysis',
        prompt:
          'A partially-observed thread (Delivery through C2, nothing after) at a new victim matches a known group. Its analytic value is that it:',
        choices: [
          'Proves data was already stolen',
          'Lets defenders anticipate and instrument the unobserved phases the group historically performs next',
          'Means the intrusion failed',
          'Downgrades the group\'s confidence',
        ],
        answer: 1,
        explain:
          'The thread\'s gaps become a hunting plan: the group\'s known playbook predicts what should appear next and where to look.',
      },
      {
        id: 's2m4q10',
        domain: 'Intrusion Analysis',
        prompt:
          'Why should "both intrusions beacon over HTTPS on port 443" be discarded as a grouping criterion?',
        choices: [
          'HTTPS beacons are impossible to detect',
          'It is a near-universal technique with no discriminating power — virtually every modern actor matches it',
          'Port 443 is reserved for legitimate traffic',
          'It is actually the strongest available link',
        ],
        answer: 1,
        explain:
          'Discrimination comes from rarity. A feature shared by everyone links no one.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 's2m5',
    sectionId: 's2',
    title: 'MITRE ATT&CK y la Pyramid of Pain',
    minutes: 12,
    objectives: [
      'Diferenciar tactics, techniques y procedures en ATT&CK',
      'Usar ATT&CK como lenguaje común y mapa de cobertura',
      'Priorizar indicadores según la Pyramid of Pain',
    ],
    blocks: [
      {
        t: 'p',
        md: '**MITRE ATT&CK** es la base de conocimiento de comportamientos adversarios observados en el mundo real. Su estructura: **Tactics** (el *porqué* — objetivos tácticos como Persistence o Lateral Movement), **Techniques/Sub-techniques** (el *cómo* general — p. ej. `T1053.005 Scheduled Task`), y **Procedures** (la implementación exacta de un actor concreto).',
      },
      {
        t: 'list',
        items: [
          '**Lenguaje común** — «T1566.001» significa lo mismo para tu SOC, tu proveedor y un informe público.',
          '**Mapa de cobertura** — heatmaps de qué técnicas detectas vs. cuáles usa tu amenaza prioritaria.',
          '**Emulación** — el red team reproduce procedures del actor que te importa.',
          '**Estructura de informes** — los TTPs de un informe de campaña se etiquetan con técnicas.',
        ],
      },
      {
        t: 'callout',
        kind: 'warn',
        md: 'ATT&CK es descriptivo, no predictivo ni exhaustivo: que una técnica no esté listada para un grupo solo significa que **no se ha reportado públicamente**. Cuidado también con el «bingo de técnicas»: marcar 200 celdas no es un programa de detección.',
      },
      { t: 'h', text: 'Pyramid of Pain' },
      {
        t: 'p',
        md: 'La **Pyramid of Pain** (David Bianco) ordena los tipos de indicador por el **dolor que causa al adversario** perderlos. Cuanto más arriba actúas, más caro le sale adaptarse:',
      },
      {
        t: 'table',
        headers: ['Nivel', 'Indicador', 'Dolor para el adversario'],
        rows: [
          ['6 (cima)', 'TTPs / comportamientos', 'Tough — reentrenar su forma de operar'],
          ['5', 'Tools', 'Challenging — re-desarrollar o cambiar herramientas'],
          ['4', 'Network/Host artifacts', 'Annoying — reconfigurar artefactos (user-agents, paths, claves de registro)'],
          ['3', 'Domain names', 'Simple — registrar otro dominio'],
          ['2', 'IP addresses', 'Easy — mover el VPS'],
          ['1 (base)', 'Hash values', 'Trivial — recompilar y el hash cambia'],
        ],
      },
      {
        t: 'callout',
        kind: 'exam',
        title: 'Nota de examen',
        md: 'Memoriza el orden de la pirámide y su lógica: hashes triviales de cambiar; TTPs los más dolorosos. La meta de un programa CTI maduro es **detectar comportamientos** (cima), usando los niveles bajos como apoyo táctico de corta vida.',
      },
      { t: 'h', text: 'Del command line al TTP' },
      {
        t: 'p',
        md: 'Los dos frameworks se encuentran en la telemetría. Este es el árbol de procesos del host comprometido de Meridian (S2M1), etiquetado con técnica ATT&CK y nivel de la pirámide. Cada indicador extraíble de este árbol vive en un peldaño distinto:',
      },
      {
        t: 'code',
        lang: 'text',
        title: 'Árbol de procesos EDR mapeado a ATT&CK (ficticio)',
        text: `explorer.exe
 └─ powershell.exe -nop -w hidden -enc SQBFAFgAKA...
      [T1059.001 Command and Scripting Interpreter: PowerShell]
      [Tactic: Execution]           [Pyramid: TTP - tough]
     └─ wcssvc.exe -decode a.txt payload.bin
          (OriginalFileName en PE header: CertUtil.exe → renombrado)
          [T1140 Deobfuscate/Decode Files or Information]
          [Tactic: Defense Evasion] [Pyramid: TTP - tough]
         └─ winhlp.exe   SHA-256 4c81...b3
              [Pyramid: Hash - trivial de rotar]
             └─ schtasks.exe /create /tn WindowsUpdateCheck /sc onlogon
                  [T1053.005 Scheduled Task/Job: Scheduled Task]
                  [Tactic: Persistence]
                  [nombre de tarea → Pyramid: Host artifact - annoying]

winhlp.exe → TLS update-svc-cdn.com:443
      [T1071.001 Application Layer Protocol: Web Protocols]
      [Tactic: Command and Control]
      [dominio → Pyramid: Domain - simple de rotar]`,
      },
      {
        t: 'p',
        md: 'Practica la **escalera de abstracción**: el comando exacto (`schtasks /create /tn WindowsUpdateCheck...`) es la **procedure** de este actor; `T1053.005 Scheduled Task` es la **technique**; Persistence es la **tactic**. Ahora cruza con la pirámide: si tu detección apunta al hash de `winhlp.exe`, el actor la anula recompilando (trivial). Si apunta al *nombre* de la tarea, la anula renombrándola (annoying). Si apunta al **comportamiento** — «PowerShell lanzado por explorer crea una tarea programada no inventariada» — el actor tendría que rediseñar su forma de operar para evadirla: eso es la cima de la pirámide (tough) y la razón de que las techniques de ATT&CK y los TTPs sean la detección más duradera. Aviso final: pintar 200 celdas de un heatmap no es un programa de detección — sin lógica que cace cada técnica, es «technique bingo».',
      },
      {
        t: 'check',
        q: {
          q: 'Given THIS process tree, where should limited detection-engineering effort go for the most durable coverage — and why is the winhlp.exe hash the weakest investment?',
          choices: [
            'The file hash — it uniquely identifies the binary and never changes',
            'The behavioral techniques (certutil decoding, explorer→PowerShell→scheduled task) — they survive recompiles and renames, while the hash dies on any rebuild',
            'The C2 IP address, because blocking it halts the whole intrusion',
            'Every node equally — ATT&CK assigns them the same weight',
          ],
          answer: 1,
          explain:
            'Behavior sits atop the pyramid: costly for the actor to change. The hash is trivial to alter (recompile → new hash), so a hash-only rule lapses on the next build.',
        },
      },
      {
        t: 'check',
        q: {
          q: 'The exact command "schtasks /create /tn WindowsUpdateCheck /sc onlogon" in this tree is, in ATT&CK terms, a:',
          choices: [
            'Tactic',
            'Technique',
            'Procedure — this actor\'s specific implementation of T1053.005',
            'Mitigation',
          ],
          answer: 2,
          explain:
            'The concrete command with its exact task name is a procedure. T1053.005 (Scheduled Task) is the technique; Persistence is the tactic it serves.',
        },
      },
      {
        t: 'check',
        q: {
          q: 'According to the Pyramid of Pain, which is MOST painful for an adversary to change?',
          choices: ['C2 IP addresses', 'File hashes', 'Their core TTPs/behaviors', 'Domain names'],
          answer: 2,
          explain:
            'Behaviors sit at the top: changing how they operate requires retraining and re-tooling. Hashes/IPs/domains are cheap to rotate.',
        },
      },
      {
        t: 'check',
        q: {
          q: 'In ATT&CK, "Persistence" is a:',
          choices: ['Technique', 'Tactic', 'Procedure', 'Sub-technique'],
          answer: 1,
          explain:
            'Tactics are the adversary\'s tactical goals (the "why"); techniques are how they achieve them; procedures are specific implementations.',
        },
      },
    ],
    quiz: [
      {
        id: 's2m5q1',
        domain: 'Intrusion Analysis',
        prompt:
          'In ATT&CK terminology, "the actor creates a scheduled task named WindowsUpdateCheck that runs a renamed PowerShell binary from C:\\ProgramData" is a:',
        choices: ['Tactic', 'Technique', 'Procedure', 'Mitigation'],
        answer: 2,
        explain:
          'A specific actor implementation with exact names/paths is a procedure. Scheduled Task (T1053.005) is the technique; Persistence is the tactic.',
      },
      {
        id: 's2m5q2',
        domain: 'Intrusion Analysis',
        prompt: 'The Pyramid of Pain, from bottom to top, orders indicators as:',
        choices: [
          'Hashes → IPs → Domains → Artifacts → Tools → TTPs',
          'TTPs → Tools → Artifacts → Domains → IPs → Hashes',
          'IPs → Hashes → Domains → Tools → Artifacts → TTPs',
          'Domains → IPs → Hashes → TTPs → Tools → Artifacts',
        ],
        answer: 0,
        explain:
          'Hash values (trivial), IP addresses (easy), domains (simple), network/host artifacts (annoying), tools (challenging), TTPs (tough).',
      },
      {
        id: 's2m5q3',
        domain: 'Intrusion Analysis',
        prompt:
          'Why do hash-based indicators provide the SHORTEST-lived detection value?',
        choices: [
          'Hashing algorithms expire',
          'Any recompilation or byte change produces a new hash at zero cost to the adversary',
          'EDRs cannot match hashes at scale',
          'Hashes are usually wrong',
        ],
        answer: 1,
        explain:
          'A single byte change invalidates the hash — the cheapest possible adaptation, hence the pyramid\'s base.',
      },
      {
        id: 's2m5q4',
        domain: 'Intrusion Analysis',
        prompt: 'A defensible use of an ATT&CK heatmap is:',
        choices: [
          'Proving the organization is unhackable',
          'Comparing techniques used by priority threats against current detection coverage to find gaps',
          'Counting techniques to report a security score',
          'Selecting which employees to phish',
        ],
        answer: 1,
        explain:
          'Overlaying threat-informed technique usage with detection coverage exposes meaningful gaps — threat-informed defense.',
      },
      {
        id: 's2m5q5',
        domain: 'Intrusion Analysis',
        prompt:
          'A group\'s ATT&CK page does not list "Exfiltration Over Web Service." You should conclude:',
        choices: [
          'The group cannot exfiltrate over web services',
          'The technique has simply not been publicly reported for that group — absence of evidence is not evidence of absence',
          'The page is malware',
          'The group has been inactive',
        ],
        answer: 1,
        explain:
          'ATT&CK reflects public reporting. Unlisted ≠ unused. Plan detection for plausible behaviors, not only documented ones.',
      },
      {
        id: 's2m5q6',
        domain: 'Intrusion Analysis',
        prompt:
          'Which detection investment aligns with the TOP of the Pyramid of Pain?',
        choices: [
          'Daily import of a 100k hash blocklist',
          'Behavioral analytics for credential-dumping and lateral-movement patterns regardless of tool',
          'Blocking one C2 IP range',
          'A weekly domain blocklist',
        ],
        answer: 1,
        explain:
          'Tool-agnostic behavioral detection targets TTPs — the hardest layer for adversaries to change.',
      },
      {
        id: 's2m5q7',
        domain: 'Intrusion Analysis',
        prompt:
          'The line "wcssvc.exe -decode a.txt payload.bin (OriginalFileName: CertUtil.exe)" maps to which tactic and technique?',
        choices: [
          'Execution / T1059.001 PowerShell',
          'Defense Evasion / T1140 Deobfuscate/Decode Files or Information',
          'Persistence / T1053.005 Scheduled Task',
          'Command and Control / T1071.001 Web Protocols',
        ],
        answer: 1,
        explain:
          'A renamed certutil decoding a staged payload is deobfuscation (T1140), serving Defense Evasion. The rename itself is why detections should key on OriginalFileName, not the on-disk name.',
      },
      {
        id: 's2m5q8',
        domain: 'Intrusion Analysis',
        prompt:
          'The actor replaces renamed-certutil with a bespoke in-house decoder. Which detection from the tree SURVIVES this change?',
        choices: [
          'The winhlp.exe SHA-256 signature',
          'A behavioral rule for "explorer→PowerShell→creates non-inventoried logon scheduled task"',
          'The block on the certutil OriginalFileName',
          'The C2 domain blocklist entry',
        ],
        answer: 1,
        explain:
          'Swapping the decoder breaks certutil-specific and hash-specific detections, but the surrounding behavioral chain (execution → persistence via scheduled task) is unchanged — the value of detecting at the top of the pyramid.',
      },
      {
        id: 's2m5q9',
        domain: 'Intrusion Analysis',
        prompt:
          'All of the following are legitimately top-of-pyramid (TTP) detections EXCEPT:',
        choices: [
          'Alerting on any process decoding a file then executing it',
          'Alerting on a logon-persistence scheduled task created by a scripting host',
          'Alerting on the specific hash 4c81...b3',
          'Alerting on encoded PowerShell spawned by explorer.exe',
        ],
        answer: 2,
        explain:
          'A specific hash is the base of the pyramid (trivial to rotate), not a TTP. The other three describe behaviors that persist across the actor\'s cosmetic changes.',
      },
      {
        id: 's2m5q10',
        domain: 'Intrusion Analysis',
        prompt:
          'This tree shows T1071.001 for C2, but the group\'s public ATT&CK page does not list it. The sound conclusion is:',
        choices: [
          'The mapping is wrong and should be removed',
          'ATT&CK pages reflect public reporting; your own observed procedure is valid evidence and unlisted ≠ unused',
          'The group did not really use web protocols',
          'The EDR telemetry must be corrupted',
        ],
        answer: 1,
        explain:
          'Absence of a technique on a group page means it has not been publicly reported for them — not that they never use it. Your first-hand observation is primary evidence.',
      },
    ],
  },
];
