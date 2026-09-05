import type { Module } from '../lib/types';

export const S5_MODULES: Module[] = [
  // -------------------------------------------------------------------------
  {
    id: 's5m1',
    sectionId: 's5',
    title: 'Productos de inteligencia por audiencia',
    minutes: 14,
    objectives: [
      'Elegir el tipo de producto correcto para cada consumidor',
      'Gestionar el trade-off entre puntualidad y completitud',
      'Reconocer las secciones obligatorias de un flash alert',
      'Estructurar un catálogo de productos con SLAs',
    ],
    blocks: [
      {
        t: 'p',
        md: 'La diseminación falla más por **desajuste de audiencia** que por mal análisis. Antes de escribir una línea, responde: ¿quién lo lee? ¿qué decisión tiene delante? ¿cuánto tiempo tiene? ¿qué formato consume (ticket, informe, briefing oral)?',
      },
      {
        t: 'table',
        headers: ['Producto', 'Audiencia', 'Disparador', 'Longitud'],
        rows: [
          ['Flash alert / advisory', 'SOC, IR, IT', 'Amenaza activa que exige acción YA', '1 página, BLUF + acciones'],
          ['Informe de campaña', 'Hunters, detección, CTI peers', 'Cluster de actividad consolidado', '3–10 págs, TTPs + IOCs anexos'],
          ['Assessment estratégico', 'CISO, dirección, board', 'Ciclo periódico o decisión concreta', '2–5 págs, juicios + implicaciones'],
          ['Respuesta a RFI', 'Quien preguntó', 'Request for Information', 'Lo que pida la pregunta'],
          ['Feed técnico curado', 'Herramientas (SIEM/EDR/TIP)', 'Continuo', 'Indicadores con contexto'],
        ],
      },
      {
        t: 'callout',
        kind: 'tip',
        title: 'Puntualidad vs. completitud',
        md: 'La inteligencia **perfecta y tardía no existe**: llega tarde, luego no es inteligencia. Resuelve con productos escalonados: flash alert a las 2 horas («esto pasa, haz X, confianza media, seguirá informe»), informe completo a los 5 días. Comunica lo que sabes, lo que no, y cuándo habrá más.',
      },
      { t: 'h', text: 'Un producto sobre el papel: el flash alert' },
      {
        t: 'p',
        md: 'La teoría se vuelve concreta cuando ves el producto entero. Este es el esqueleto que usa el equipo de Meridian — una página, sin scroll, cada sección con un trabajo:',
      },
      {
        t: 'code',
        lang: 'text',
        title: 'Flash alert — esqueleto completo (ficticio)',
        text: `MERIDIAN CTI — FLASH ALERT MER-FA-2026-014        TLP:AMBER
Issued: 2026-04-18 11:40 UTC | Next review: 2026-04-25

BLUF: We assess with moderate confidence that GLASS VIPER
is running an active credential-phishing wave against
Meridian supplier portals. Block the indicators in annex A
and force MFA re-enrollment for supplier accounts TODAY.

WHAT WE KNOW
- 41 phishing emails to supply-chain staff since 06:00 UTC
- Lure: "urgent PO revision", spoofed supplier domain
- Live credential harvesting on cdn-sync-status.example

WHAT WE DO NOT KNOW YET
- Whether any credentials were submitted (under review)

ACTIONS REQUESTED (by 18:00 UTC)
1. Block domain + URL set (annex A) at proxy and gateway
2. Force password reset + MFA re-enroll: portal users
3. Report clicks to IR via #ir-hotline

NEXT UPDATE: 2026-04-18 17:00 UTC or on material change
Contact: cti@meridian.example | Ref: MER-2026-011`,
      },
      {
        t: 'p',
        md: 'Desglose: el **BLUF** lleva juicio + confianza + acción con plazo (no «se ha observado actividad»); **what we do not know** evita que el lector sobre-interprete y compra tiempo honestamente; las **acciones llevan deadline** y dueño implícito; y **next update** convierte el silencio posterior en señal («sin noticias = sin cambios»), no en duda. Todo lo que no ayuda a decidir en los próximos minutos — atribución fina, narrativa, ACH — se va al informe de campaña.',
      },
      {
        t: 'table',
        headers: ['Producto', 'SLA típico', 'Decisión que habilita'],
        rows: [
          ['Flash alert', '≤ 2–4 h desde confirmación', 'Bloqueo y contención inmediatos'],
          ['Informe de campaña', '3–5 días tras consolidar el cluster', 'Hunting, ingeniería de detección, priorización'],
          ['Assessment estratégico', 'Trimestral o ligado a una decisión', 'Presupuesto, postura, apetito de riesgo'],
          ['Respuesta a RFI', '24–72 h según complejidad', 'La decisión concreta del solicitante'],
          ['Feed curado', 'Continuo (latencia de minutos)', 'Bloqueo y correlación automatizados'],
        ],
      },
      {
        t: 'callout',
        kind: 'example',
        title: 'El mismo hallazgo, dos audiencias',
        md: 'Hallazgo: GLASS VIPER registró 3 dominios nuevos esta noche. **Para el SOC:** «Dominios añadidos al blocklist (anexo); reglas Sigma 14–16 actualizadas; hunt sugerido sobre autenticaciones de proveedores entre 00:00 y 06:00 UTC.» **Para el CISO:** «La campaña contra nuestros proveedores continúa y se acelera. Riesgo principal: acceso a diseño de propulsión vía cuentas de terceros. Recomendamos adelantar la revisión de accesos de proveedores prevista para Q4.» Mismo análisis, distinto verbo: el SOC recibe acciones; el CISO recibe riesgo y una decisión. Ninguno recibe el volcado de datos.',
      },
      {
        t: 'check',
        q: {
          q: 'Why does a disciplined flash alert template include a "WHAT WE DO NOT KNOW YET" section?',
          choices: [
            'To make the report longer',
            'To prevent over-reading, set honest expectations, and signal what the follow-up will address',
            'To avoid legal liability only',
            'Because TLP requires it',
          ],
          answer: 1,
          explain:
            'Explicit unknowns are analytic honesty in product form: consumers act on what is known without assuming more, and they know an update is coming.',
        },
      },
      {
        t: 'p',
        md: 'Un equipo maduro publica un **catálogo de productos**: nombres, plantillas, audiencias, SLAs y clasificación TLP por defecto. Los consumidores saben qué pedir y qué esperar; el equipo deja de reinventar formatos bajo presión.',
      },
      {
        t: 'check',
        q: {
          q: 'An active phishing wave is hitting your company right now. The FIRST product to ship is:',
          choices: [
            'A 10-page campaign report with full ACH analysis',
            'A one-page flash alert: what is happening, what to do now, confidence, and when more will follow',
            'A quarterly strategic assessment',
            'A tweet',
          ],
          answer: 1,
          explain:
            'Timeliness beats completeness when action is needed. The deep report follows once the dust settles.',
        },
      },
      {
        t: 'check',
        q: {
          q: 'The board asks how espionage trends should shape next year\'s security budget. The right product is:',
          choices: [
            'An IOC feed',
            'A strategic assessment with judgments, confidence, and business implications',
            'A Sigma rule pack',
            'A sandbox report',
          ],
          answer: 1,
          explain:
            'Strategic consumers need analytic judgments tied to decisions — never raw technical indicators.',
        },
      },
    ],
    quiz: [
      {
        id: 's5m1q1',
        domain: 'Dissemination',
        prompt: 'The first question to answer before producing ANY intelligence product is:',
        choices: [
          'Which template looks best?',
          'Who is the consumer and what decision do they face?',
          'How many IOCs do we have?',
          'Which TLP color is prettiest?',
        ],
        answer: 1,
        explain:
          'Audience and decision drive format, depth, language and timing. Everything else follows.',
      },
      {
        id: 's5m1q2',
        domain: 'Dissemination',
        prompt:
          'Why are staged products (flash alert → full report) better than waiting for complete analysis?',
        choices: [
          'They generate more documents',
          'Late intelligence fails its purpose; staged delivery gives consumers actionable knowledge at each moment with honest caveats',
          'Flash alerts replace analysis',
          'Consumers prefer suspense',
        ],
        answer: 1,
        explain:
          'Decisions cannot wait for perfection. Deliver what is known, mark confidence, promise the follow-up.',
      },
      {
        id: 's5m1q3',
        domain: 'Dissemination',
        prompt: 'An RFI (Request for Information) process exists so that:',
        choices: [
          'Consumers can task the intel team with specific questions through a defined channel, feeding the requirements process',
          'The team can avoid answering questions',
          'Vendors can sell more feeds',
          'Reports get longer',
        ],
        answer: 0,
        explain:
          'RFIs formalize ad hoc consumer questions — and reveal recurring needs that should become standing requirements.',
      },
      {
        id: 's5m1q4',
        domain: 'Dissemination',
        prompt:
          'A 40-page deeply technical report sent to executives generates no action. The MOST likely failure is:',
        choices: [
          'The analysis was wrong',
          'Audience mismatch: wrong product, length and language for strategic consumers',
          'The TLP marking was too strict',
          'Executives never act',
        ],
        answer: 1,
        explain:
          'Right analysis in the wrong vehicle fails. Strategic consumers need short, judgment-led products with implications.',
      },
      {
        id: 's5m1q5',
        domain: 'Dissemination',
        prompt: 'A product catalog with templates and SLAs primarily provides:',
        choices: [
          'Marketing material',
          'Predictability: consumers know what to request and expect; the team maintains consistent quality under pressure',
          'Compliance evidence',
          'Longer reports',
        ],
        answer: 1,
        explain:
          'Standardized products professionalize dissemination and set expectations on both sides.',
      },
      {
        id: 's5m1q6',
        domain: 'Dissemination',
        prompt:
          'Which pairing is CORRECT?',
        choices: [
          'SOC → quarterly geopolitical trends',
          'Board → raw IOC feed',
          'Threat hunters → campaign report with TTPs and detection opportunities',
          'TIP/SIEM → strategic assessment PDF',
        ],
        answer: 2,
        explain:
          'Hunters consume operational intelligence: how the actor behaves and where to look. The other pairings are classic mismatches.',
      },
      {
        id: 's5m1q7',
        domain: 'Dissemination',
        prompt:
          'An active intrusion is confirmed at 09:00. Per a mature product catalog, the intel team\'s FIRST deliverable and timing should be:',
        choices: [
          'A full campaign report within 5 days, nothing before',
          'A one-page flash alert within ~2–4 hours: BLUF, known/unknown, actions with a deadline, next-update time',
          'A strategic assessment at quarter end',
          'A raw log export immediately',
        ],
        answer: 1,
        explain:
          'Staged delivery starts with the fast, action-oriented product under its SLA; depth follows in the campaign report.',
      },
      {
        id: 's5m1q8',
        domain: 'Dissemination',
        prompt: 'A flash alert that omits a "next update" commitment causes which failure mode?',
        choices: [
          'It becomes TLP:RED automatically',
          'Consumer silence-anxiety: recipients cannot distinguish "no change" from "no one is watching", so they chase analysts or act on stale data',
          'The BLUF stops working',
          'Nothing — updates are optional',
        ],
        answer: 1,
        explain:
          'A stated update cadence turns later silence into information ("no news = no change") instead of uncertainty.',
      },
      {
        id: 's5m1q9',
        domain: 'Dissemination',
        prompt:
          'Which BLUF is correctly built for a flash alert?',
        choices: [
          '"Suspicious activity has been observed in the environment."',
          '"We assess with moderate confidence that an active phishing wave targets supplier portals; block annex A indicators and force MFA re-enrollment today."',
          '"A full analysis will follow next week."',
          '"See annex A for 4,000 indicators."',
        ],
        answer: 1,
        explain:
          'A flash BLUF carries judgment + confidence + immediate action with a deadline. Passive observations, promises, or data dumps do not drive decisions.',
      },
      {
        id: 's5m1q10',
        domain: 'Dissemination',
        prompt:
          'The CISO version of a finding says "supplier-account risk to propulsion data; advance the Q4 access review" while the SOC version lists blocked domains and updated rules. This split exists because:',
        choices: [
          'Executives must not see technical data by policy',
          'Each audience receives the verb it can act on — decisions and risk for strategic consumers, technical actions for operators',
          'It doubles the team\'s output metrics',
          'TLP requires separate documents',
        ],
        answer: 1,
        explain:
          'Same analysis, different actionable language per consumer. Sending either version to the other audience produces shelfware.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 's5m2',
    sectionId: 's5',
    title: 'Escribir inteligencia: BLUF y lenguaje estimativo',
    minutes: 14,
    objectives: [
      'Escribir con BLUF y línea analítica clara',
      'Usar el vocabulario estimativo de ICD 203',
      'Separar probabilidad del evento y confianza en el juicio',
    ],
    blocks: [
      {
        t: 'p',
        md: '**BLUF — Bottom Line Up Front**: la conclusión va primero. El lector decide en 30 segundos si necesita seguir. Estructura canónica: juicio principal (con confianza) → hallazgos clave → evidencia/análisis → implicaciones → recomendaciones → anexos técnicos.',
      },
      {
        t: 'callout',
        kind: 'example',
        title: 'BLUF de manual',
        md: '«**We assess with high confidence that VELVET CICADA, an espionage-motivated intrusion set, exfiltrated propulsion design data from Meridian between March and May.** We assess with moderate confidence that supplier portals were the initial access vector. Further targeting of Meridian suppliers is likely in the next 90 days.»',
      },
      { t: 'h', text: 'Lenguaje estimativo (ICD 203)' },
      {
        t: 'p',
        md: 'Las palabras de probabilidad significan cosas distintas para cada lector… salvo que las **estandarices**. La comunidad de inteligencia de EE. UU. (ICD 203) fija bandas:',
      },
      {
        t: 'table',
        headers: ['Expresión', 'Probabilidad aproximada'],
        rows: [
          ['almost no chance / remote', '01–05%'],
          ['very unlikely / highly improbable', '05–20%'],
          ['unlikely / improbable', '20–45%'],
          ['roughly even chance', '45–55%'],
          ['likely / probable', '55–80%'],
          ['very likely / highly probable', '80–95%'],
          ['almost certain / nearly certain', '95–99%'],
        ],
      },
      {
        t: 'callout',
        kind: 'warn',
        title: 'Probabilidad ≠ confianza',
        md: 'Dos diales independientes: la **probabilidad** habla del evento («likely» ≈ 55–80%); la **confianza** habla de tu base analítica (calidad de fuentes, cantidad de evidencia, solidez del razonamiento: low/moderate/high). Puedes emitir «likely, low confidence» (evidencia escasa apunta en una dirección) o «unlikely, high confidence» (evidencia sólida dice que no). **No digas «high confidence» para subir el “likely” a “very likely”** — son ejes distintos.',
      },
      {
        t: 'list',
        items: [
          'Prohibido el **weasel wording**: «podría posiblemente quizás» no informa nada — toda frase con «could/might/may» es técnicamente cierta y analíticamente vacía.',
          'Un juicio por frase; la evidencia separada del juicio («We assess X **based on** Y and Z»).',
          'Los hechos se citan; los juicios se *poseen*: «we assess», no «it is believed».',
        ],
      },
      {
        t: 'check',
        q: {
          q: 'Per ICD 203 bands, "very likely" corresponds to approximately:',
          choices: ['20–45%', '45–55%', '55–80%', '80–95%'],
          answer: 3,
          explain:
            '"Very likely" sits at 80–95%. "Likely" is 55–80%; "almost certain" is 95–99%.',
        },
      },
      {
        t: 'check',
        q: {
          q: '"We assess it is LIKELY the actor will target suppliers (LOW confidence)." This statement means:',
          choices: [
            'A contradiction — likely requires high confidence',
            'The available (thin) evidence points to 55–80% probability, but the analytic basis is weak and could shift with new evidence',
            'The probability is low',
            'The analyst is unsure what likely means',
          ],
          answer: 1,
          explain:
            'Probability describes the event; confidence describes the strength of the evidence base. They vary independently.',
        },
      },
      {
        t: 'callout',
        kind: 'exam',
        title: 'Nota de examen',
        md: 'Memoriza las bandas ICD 203 (las practicarás en el **Lab 5A: Calibration Range**) y la separación probabilidad/confianza. Es de lo más preguntado del dominio de diseminación.',
      },
    ],
    quiz: [
      {
        id: 's5m2q1',
        domain: 'Dissemination',
        prompt: 'BLUF means:',
        choices: [
          'Putting all technical detail first',
          'Leading with the bottom-line judgment so consumers get the conclusion immediately',
          'Burying the lede for suspense',
          'Bold Letters Used Frequently',
        ],
        answer: 1,
        explain:
          'Bottom Line Up Front: conclusion first, support after. Respect the consumer\'s time.',
      },
      {
        id: 's5m2q2',
        domain: 'Dissemination',
        prompt: 'Per ICD 203, "unlikely" maps approximately to:',
        choices: ['01–05%', '20–45%', '55–80%', '80–95%'],
        answer: 1,
        explain:
          'Unlikely/improbable ≈ 20–45%. Very unlikely is 5–20%.',
      },
      {
        id: 's5m2q3',
        domain: 'Dissemination',
        prompt: 'Analytic CONFIDENCE (low/moderate/high) expresses:',
        choices: [
          'The probability of the event occurring',
          'The strength of the analytic basis: source quality, evidence quantity, reasoning soundness',
          'How strongly the analyst feels emotionally',
          'The TLP marking',
        ],
        answer: 1,
        explain:
          'Confidence qualifies the judgment\'s foundation — independent from the event\'s probability.',
      },
      {
        id: 's5m2q4',
        domain: 'Dissemination',
        prompt:
          'Which sentence is the BEST-written analytic judgment?',
        choices: [
          '"The actor could possibly maybe target backups at some point."',
          '"It is believed the actor might do something."',
          '"We assess it is likely (moderate confidence) the actor will target backup infrastructure within 30 days, based on staged credentials and observed reconnaissance of backup servers."',
          '"Backups: at risk!!"',
        ],
        answer: 2,
        explain:
          'Owned judgment ("we assess"), calibrated term (likely), explicit confidence, time bound, and stated evidence basis. The others are weasel-worded or unowned.',
      },
      {
        id: 's5m2q5',
        domain: 'Dissemination',
        prompt: 'Why is "the actor COULD compromise the OT network" analytically weak?',
        choices: [
          '"Could" statements are true of nearly anything possible, conveying no probability — unfalsifiable and decision-useless',
          'OT networks cannot be compromised',
          'It is too precise',
          'It should say "would"',
        ],
        answer: 0,
        explain:
          'Mere possibility is not assessment. Estimative language exists to communicate HOW likely.',
      },
      {
        id: 's5m2q6',
        domain: 'Dissemination',
        prompt:
          'New, solid evidence arrives that contradicts a published "likely" judgment. The team should:',
        choices: [
          'Stay silent to protect credibility',
          'Publish an update revising the judgment and explaining what changed — analytic integrity over ego',
          'Reclassify the old report TLP:RED',
          'Blame the consumer',
        ],
        answer: 1,
        explain:
          'Updating judgments on new evidence is the discipline working as intended. Hiding reversals destroys long-term credibility.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 's5m3',
    sectionId: 's5',
    title: 'Diseminación técnica: IOCs, reglas y TLP aplicado',
    minutes: 15,
    objectives: [
      'Diseminar indicadores con contexto y caducidad',
      'Leer la anatomía de una regla YARA y una regla Sigma',
      'Reconocer cómo STIX/TAXII empaquetan y transportan indicadores',
      'Aplicar TLP a productos reales',
    ],
    blocks: [
      {
        t: 'p',
        md: 'La diseminación táctica tiene su propio oficio. Un dump de 5.000 IOCs sin contexto es trabajo para tu SOC, no inteligencia. Reglas mínimas: **contexto** (actor/campaña/fase/confianza), **fechas** (first/last seen, caducidad sugerida), **formato consumible** (STIX, CSV bien tipado, reglas listas) y **canal pactado** (TIP, TAXII, ticket — no un PDF con tablas).',
      },
      {
        t: 'list',
        items: [
          '**Indicadores** → para bloqueo/búsqueda inmediata; vida corta; con TTL.',
          '**Reglas de comportamiento** (YARA/Sigma) → detección duradera; arriba en la Pyramid of Pain.',
          '**Informes** → transfieren *comprensión*; alimentan hunting e ingeniería de detección.',
        ],
      },
      { t: 'h', text: 'El oficio de la regla: YARA' },
      {
        t: 'p',
        md: 'Una regla YARA describe **contenido de ficheros o memoria**: strings, bytes, metadatos. Tres secciones: `meta` (contexto para el humano), `strings` (qué buscar) y `condition` (la lógica que decide). Lee esta regla ficticia para el loader de GLASS VIPER:',
      },
      {
        t: 'code',
        lang: 'yara',
        title: 'Regla YARA — loader de GLASS VIPER (ficticia)',
        text: `rule GLASSVIPER_Loader_MemMap
{
    meta:
        author      = "Meridian CTI"
        description = "GLASS VIPER stage-1 loader: section map + named pipe"
        date        = "2026-04-18"
        reference   = "Internal report MER-2026-011"
        tlp         = "AMBER"

    strings:
        $api  = "MapViewOfSection" ascii
        $pipe = "vc_pipe_%08x" ascii wide
        $op   = { 6A 40 68 00 30 00 00 }
        $pdb  = "D:\\\\proj\\\\cicada\\\\loader\\\\Release\\\\ldr.pdb"

    condition:
        uint16(0) == 0x5A4D
        and filesize < 250KB
        and ( $pdb or 2 of ($api, $pipe, $op) )
}`,
      },
      {
        t: 'p',
        md: 'La `condition` es **el arte**. `$api` aparece en miles de binarios legítimos: solo, generaría una tormenta de falsos positivos. Por eso exige **co-ocurrencia** (`2 of`) o un artefacto de alta especificidad por sí solo (el **PDB path** del desarrollador). `uint16(0) == 0x5A4D` ancla el `MZ` de un ejecutable PE y `filesize` acota el coste de escaneo. Regla de oro: cada string genérico debe ganarse su disparo acompañado; los artefactos únicos (PDB, pipe con formato propio, mutex) pueden disparar solos.',
      },
      { t: 'h', text: 'Sigma: el comportamiento en los logs' },
      {
        t: 'p',
        md: 'YARA mira *contenido*; **Sigma** mira *eventos*. Es un formato YAML genérico que se **convierte** al lenguaje de tu SIEM (Splunk, Sentinel, Elastic…) — no se ejecuta directamente. Esta regla ficticia caza el staging de GLASS VIPER con un `certutil` renombrado:',
      },
      {
        t: 'code',
        lang: 'sigma',
        title: 'Regla Sigma — certutil renombrado decodificando payload (ficticia)',
        text: `title: GLASS VIPER Staging via Renamed Certutil
id: 4b8d2f6a-9c31-4e02-b7aa-meridian0042
status: experimental
description: Renamed certutil.exe decoding a staged payload
references:
    - Internal report MER-2026-011
logsource:
    product: windows
    category: process_creation
detection:
    selection:
        OriginalFileName: 'CertUtil.exe'
        CommandLine|contains:
            - '-decode'
            - '-urlcache'
    filter_expected:
        Image|endswith: '\\certutil.exe'
    condition: selection and not filter_expected
falsepositives:
    - Admin tooling that copies certutil under another name (rare)
level: high`,
      },
      {
        t: 'p',
        md: 'Detalle elegante: el actor renombra `certutil.exe` a `winhlp.exe`, pero **`OriginalFileName` viene del PE header**, no del nombre en disco — renombrar no lo cambia. La regla selecciona por identidad real del binario y excluye el uso con su nombre legítimo. Esto es detección **de comportamiento**: sobrevive a que el actor cambie dominios, hashes y nombres de fichero.',
      },
      {
        t: 'table',
        headers: ['', 'YARA', 'Sigma'],
        rows: [
          ['Examina', 'Ficheros y memoria (contenido binario)', 'Eventos de log (telemetría)'],
          ['Corre en', 'Scanner, sandbox, EDR, repo de muestras', 'SIEM, tras convertirla al backend'],
          ['Detecta', 'Familias de malware, tooling, documentos armados', 'Comportamiento: procesos, command lines, accesos'],
          ['Sobrevive a', 'Rotación de infraestructura (C2, dominios)', 'Re-compilación y renombrado de herramientas'],
          ['Nivel Pyramid of Pain', 'Tools (artefactos del binario)', 'TTPs (comportamiento observable)'],
        ],
      },
      {
        t: 'check',
        q: {
          q: 'A YARA rule with condition `any of ($s*)` over generic API strings floods the SOC with false positives. The BEST fix is:',
          choices: [
            'Delete the strings section',
            'Require co-occurrence (e.g., 2 of) and anchor on high-specificity artifacts like a PDB path or named pipe format',
            'Raise filesize to 10MB',
            'Convert the rule to Sigma',
          ],
          answer: 1,
          explain:
            'Generic strings must earn their trigger together; unique developer artifacts can fire alone. That balance is the craft of the condition.',
        },
      },
      { t: 'h', text: 'STIX/TAXII: el indicador empaquetado' },
      {
        t: 'p',
        md: '**STIX** es el formato (objetos JSON tipados y relaciones); **TAXII** es el protocolo de transporte (collections de las que los consumidores hacen *pull*, o canales *push*). Un indicador STIX serio lleva el patrón, su **caducidad como dato** y su contexto como relación:',
      },
      {
        t: 'code',
        lang: 'json',
        title: 'STIX 2.1 — indicator + relationship (ficticio)',
        text: `{
  "type": "bundle",
  "id": "bundle--c4e6f0aa-2b1d-4c77-9e01-meridian0007",
  "objects": [
    {
      "type": "indicator",
      "spec_version": "2.1",
      "id": "indicator--7d1f43b2-55aa-4f0e-8c11-meridian0031",
      "created": "2026-04-18T09:30:00Z",
      "name": "GLASS VIPER credential-harvest domain",
      "pattern": "[domain-name:value = 'cdn-sync-status.example']",
      "pattern_type": "stix",
      "valid_from": "2026-04-18T00:00:00Z",
      "valid_until": "2026-07-18T00:00:00Z",
      "confidence": 80,
      "labels": ["malicious-activity"]
    },
    {
      "type": "relationship",
      "spec_version": "2.1",
      "id": "relationship--a90b77c3-1e42-4d18-a2f4-meridian0090",
      "relationship_type": "indicates",
      "source_ref": "indicator--7d1f43b2-55aa-4f0e-8c11-meridian0031",
      "target_ref": "intrusion-set--44af81d9-0f3c-4e55-9b27-meridian0002"
    }
  ]
}`,
      },
      {
        t: 'p',
        md: 'Fíjate en lo que el JSON *obliga* a hacer bien: `valid_until` materializa el **TTL** (el retiro del indicador deja de depender de la memoria del consumidor), `confidence` viaja con el dato, y la `relationship` hacia el `intrusion-set` responde el «¿y esto de quién es?» sin abrir un PDF. El TIP del consumidor ingiere la collection TAXII, deduplica y enruta cada tipo a su destino (dominios → proxy, hashes → EDR, reglas → SIEM).',
      },
      {
        t: 'callout',
        kind: 'example',
        title: 'TLP aplicado',
        md: 'Informe completo de VELVET CICADA con detalles de víctima → **TLP:AMBER+STRICT** (solo interno). Anexo de IOCs reescrito sin datos de víctima para el ISAC del sector → **TLP:AMBER** o **GREEN** según acuerdo. Advisory genérico «se está explotando X, parchea» → **TLP:CLEAR**. Un mismo análisis, tres productos, tres marcas.',
      },
      {
        t: 'callout',
        kind: 'exam',
        title: 'Nota de examen',
        md: 'Trampas recurrentes: **STIX = formato, TAXII = transporte** (no los intercambies); el TLP de un feed lo hereda **cada objeto** que contiene (en STIX viaja como marking-definition); un indicador **sin caducidad** no es más completo — es deuda para el consumidor; y Sigma **no se ejecuta** en el SIEM: se convierte a su lenguaje nativo.',
      },
      {
        t: 'p',
        md: 'Cierra siempre el bucle: ¿los IOCs produjeron hits? ¿las reglas dispararon? ¿alguien usó el informe? La telemetría de uso es tu **feedback** (S1M4) y tu argumento de presupuesto (S5M5).',
      },
      {
        t: 'check',
        q: {
          q: 'You share a victim-detail-rich report internally and a sanitized IOC annex with your sector ISAC. The appropriate markings are:',
          choices: [
            'Both TLP:CLEAR',
            'Internal report TLP:AMBER+STRICT; sanitized ISAC annex TLP:AMBER/GREEN per community agreement',
            'Both TLP:RED',
            'Internal CLEAR; ISAC RED',
          ],
          answer: 1,
          explain:
            'Derivative products get their own markings: strictest for victim detail, community-appropriate for sanitized technical data.',
        },
      },
      {
        t: 'check',
        q: {
          q: 'Which dissemination form provides the LONGEST-lived detection value?',
          choices: [
            'A list of C2 IPs',
            'Behavioral Sigma/YARA rules capturing the actor\'s tradecraft',
            'A hash blocklist',
            'Yesterday\'s phishing domains',
          ],
          answer: 1,
          explain:
            'Behavioral rules sit high on the Pyramid of Pain and survive infrastructure rotation.',
        },
      },
    ],
    quiz: [
      {
        id: 's5m3q1',
        domain: 'Dissemination',
        prompt: 'The MINIMUM context that should accompany a disseminated indicator includes:',
        choices: [
          'Nothing — indicators speak for themselves',
          'Associated actor/campaign, kill chain phase, first/last seen, and confidence',
          'The analyst\'s personal opinion',
          'The vendor\'s price list',
        ],
        answer: 1,
        explain:
          'Context turns a string into a decision aid: what does a hit mean, how fresh is it, how sure are we.',
      },
      {
        id: 's5m3q2',
        domain: 'Dissemination',
        prompt: 'Why should disseminated IOCs carry an expiration/TTL guidance?',
        choices: [
          'To reduce file size',
          'Because infrastructure is recycled; stale indicators degrade into false-positive generators',
          'Because TAXII requires it',
          'They should live forever',
        ],
        answer: 1,
        explain:
          'Indicator aging is real (S3M5). Shipping TTLs builds retirement into the consumer\'s process.',
      },
      {
        id: 's5m3q3',
        domain: 'Dissemination',
        prompt:
          'A partner asks for your campaign report to share with their clients. The report is TLP:AMBER+STRICT. You should:',
        choices: [
          'Let them share it — AMBER allows clients',
          'Decline or produce a re-marked sanitized version: AMBER+STRICT limits distribution to the recipient organization only',
          'Change the marking retroactively to CLEAR',
          'Send it to their clients yourself',
        ],
        answer: 1,
        explain:
          'AMBER+STRICT excludes clients. The producer may issue a differently marked derivative if appropriate.',
      },
      {
        id: 's5m3q4',
        domain: 'Dissemination',
        prompt: 'Measuring whether shared rules fired and reports were used serves to:',
        choices: [
          'Punish consumers',
          'Close the feedback loop and demonstrate the intel function\'s value with usage evidence',
          'Inflate metrics',
          'Satisfy TAXII servers',
        ],
        answer: 1,
        explain:
          'Usage telemetry is both the lifecycle\'s feedback phase and the team\'s best value argument.',
      },
      {
        id: 's5m3q5',
        domain: 'Dissemination',
        prompt:
          'Your SOC receives 5,000 uncontextualized IOCs weekly from a partner and ignores them. The root problem is:',
        choices: [
          'The SOC is lazy',
          'Data dumped without context or prioritization is unconsumable — dissemination without audience design',
          'The IOCs are in CSV',
          'TLP violations',
        ],
        answer: 1,
        explain:
          'Volume without context shifts analysis burden onto consumers who lack time — so it gets ignored. Curate and contextualize.',
      },
      {
        id: 's5m3q6',
        domain: 'Dissemination',
        prompt: 'STIX/TAXII-based machine-to-machine sharing is MOST appropriate for:',
        choices: [
          'Strategic board assessments',
          'High-volume, structured indicator and relationship data flowing into TIPs and SIEMs',
          'Sensitive HR investigations',
          'Replacing all human-readable reports',
        ],
        answer: 1,
        explain:
          'Automated structured exchange suits technical/tactical content; analytic narrative still needs human-readable products.',
      },
      {
        id: 's5m3q7',
        domain: 'Dissemination',
        prompt:
          'The actor rotates C2 domains weekly and recompiles payloads so hashes never repeat, but always stages tools with a renamed certutil. The LONGEST-lived detection investment is:',
        choices: [
          'A domain blocklist updated weekly',
          'A hash feed with daily updates',
          'A Sigma rule on process_creation matching OriginalFileName CertUtil.exe with decode flags under a different image name',
          'Blocking certutil.exe for all users',
        ],
        answer: 2,
        explain:
          'Behavioral logic keyed to PE metadata survives infrastructure and hash rotation. Blocklists chase artifacts the actor changes for free; banning certutil outright breaks legitimate admin use.',
      },
      {
        id: 's5m3q8',
        domain: 'Dissemination',
        prompt: 'In a STIX 2.1 indicator, the field that operationalizes indicator aging/TTL is:',
        choices: ['confidence', 'valid_until', 'pattern_type', 'spec_version'],
        answer: 1,
        explain:
          'valid_until ships the expiration date with the data itself, so retirement happens in the consumer\'s pipeline instead of depending on memory.',
      },
      {
        id: 's5m3q9',
        domain: 'Dissemination',
        prompt:
          'A Sigma rule selects on OriginalFileName: CertUtil.exe. The adversary renames the binary to winhlp.exe before use. The rule:',
        choices: [
          'Stops matching — the filename changed',
          'Still matches — OriginalFileName comes from the PE header, which renaming on disk does not alter',
          'Matches only in sandboxes',
          'Needs YARA to work',
        ],
        answer: 1,
        explain:
          'PE-header metadata identifies the real binary regardless of its on-disk name — exactly why the rule keys on it instead of the image path.',
      },
      {
        id: 's5m3q10',
        domain: 'Dissemination',
        prompt: 'The correct division of labor between STIX and TAXII is:',
        choices: [
          'STIX transports, TAXII formats',
          'STIX is the structured content format (typed objects and relationships); TAXII is the transport protocol (collections, push/pull)',
          'They are competing formats',
          'TAXII replaces the need for TLP',
        ],
        answer: 1,
        explain:
          'Format vs. transport. A TAXII server serves collections of STIX objects; neither replaces the other.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 's5m4',
    sectionId: 's5',
    title: 'Casos históricos: de MOONLIGHT MAZE a APT10',
    minutes: 16,
    objectives: [
      'Extraer lecciones CTI de cinco casos canónicos',
      'Trazar la evolución de la atribución pública',
      'Aplicar el Diamond Model a un caso real',
      'Conectar los casos con los conceptos del curso',
    ],
    blocks: [
      {
        t: 'p',
        md: 'Cinco campañas que definieron la disciplina. No memorices fechas exactas: memoriza **qué enseñó cada caso** y qué concepto del curso ilustra.',
      },
      { t: 'h', text: 'MOONLIGHT MAZE (años 90)' },
      {
        t: 'p',
        md: 'Campaña de espionaje sostenida contra redes gubernamentales y de investigación de EE. UU., exfiltrando volúmenes masivos de documentación. Una de las primeras intrusiones estatales investigadas a gran escala. **Lecciones**: el ciberespionaje estatal es *antiguo*; las investigaciones requieren años y cooperación multiagencia; análisis posteriores conectaron su tooling con actividad de décadas después (Turla) — la **persistencia de los actores** supera la memoria de los defensores.',
      },
      { t: 'h', text: 'APT1 (informe Mandiant, 2013)' },
      {
        t: 'p',
        md: 'Mandiant publicó un informe que documentaba años de espionaje económico y atribuía la actividad, con evidencia técnica masiva (infraestructura, personas, horarios, victimología), a una unidad militar china concreta (Unidad 61398 del PLA). **Lecciones**: primera gran **atribución pública privada** con evidencia publicada; demostró el modelo de *naming and shaming*; fijó el estándar de informe de actor (TTPs + infraestructura + victimología + apéndices de indicadores); alimentó la acusación formal de EE. UU. a oficiales del PLA en 2014.',
      },
      {
        t: 'table',
        headers: ['Vértice del Diamond', 'En el caso APT1'],
        rows: [
          ['**Adversary**', 'Unidad 61398 del PLA; operadores individuales identificados con personas y alias'],
          ['**Capability**', 'Familias de malware propias y TTPs documentadas a lo largo de años de actividad'],
          ['**Infrastructure**', 'Bloques de red en Shanghai, dominios y C2 reutilizados de forma persistente'],
          ['**Victim**', '~141 organizaciones; sectores alineados con prioridades industriales estatales'],
        ],
      },
      {
        t: 'p',
        md: '¿Por qué APT1 pudo llegar a **sponsor-level** cuando casi nadie llega? Convergencia de los cuatro vértices **sostenida durante años**, más meta-features que apuntaban al mismo sitio: horarios laborales coherentes con Shanghai, configuraciones de teclado/idioma, y una victimología que solo tenía sentido leída desde el **eje socio-político** (¿a quién beneficia?). Ninguna evidencia aislada lo probaba; la *acumulación convergente* sí. Ese es el patrón general de la atribución seria: no hay una pistola humeante, hay un peso de evidencia.',
      },
      { t: 'h', text: 'Sony Pictures / Lazarus (2014)' },
      {
        t: 'p',
        md: 'Ataque **destructivo** (wiper) más filtraciones masivas contra Sony Pictures, atribuido públicamente por el gobierno de EE. UU. a Corea del Norte. **Lecciones**: los estados también ejecutan ataques destructivos y de coerción (no solo espionaje); la atribución gubernamental puede basarse en fuentes que el público no ve (SIGINT) — confianza sin evidencia completa publicada; el sector privado y el gobierno juegan **roles complementarios** en atribución; la motivación puede ser política (represalia por una película), no económica.',
      },
      { t: 'h', text: 'DNC / APT28 y APT29 (2016)' },
      {
        t: 'p',
        md: 'Durante la investigación de la intrusión en el Democratic National Committee se encontraron **dos intrusion sets rusos distintos en la misma red**, con tooling, infraestructura y tradecraft diferentes, operando sin coordinación aparente — reporting público posterior los asoció a servicios distintos (GRU y SVR). Parte de lo robado se **publicó armado** (hack-and-leak vía personas ficticias y sitios de filtraciones) como operación de influencia. En 2018, una acusación formal de EE. UU. nombró a oficiales del GRU, confirmando buena parte del clustering técnico privado. **Lecciones**: dos actores del mismo estado pueden pisarse la misma víctima → se rastrean como **clusters separados** aunque la victimología coincida (S4M4); la exfiltración no siempre es sigilosa — los datos robados pueden ser munición pública; y el ciclo *vendor report → atribución gubernamental → indictment* valida (o corrige) el análisis privado.',
      },
      { t: 'h', text: 'APT10 / Cloud Hopper (2016–2018)' },
      {
        t: 'p',
        md: 'Campaña de espionaje que comprometió **Managed Service Providers (MSPs)** para saltar desde ellos a docenas de clientes finales en múltiples países. Destapada por investigación conjunta público-privada; siguió acusación formal de EE. UU. (2018) contra operadores vinculados al MSS chino. **Lecciones**: la **cadena de suministro/proveedores como vector** escala el espionaje (un MSP = cientos de víctimas); tu perímetro incluye los accesos de tus proveedores; la cooperación internacional público-privada madura la respuesta.',
      },
      { t: 'h', text: 'Los cinco casos, lado a lado' },
      {
        t: 'table',
        headers: ['Caso', 'Época', 'Atribución alcanzada', 'Evidencia clave', 'Lección central'],
        rows: [
          ['MOONLIGHT MAZE', 'años 90', 'Estatal (años después)', 'Forense multiagencia; lineage de tooling reconectado décadas más tarde', 'La persistencia del actor supera la memoria del defensor'],
          ['APT1', '2013', 'Sponsor-level pública (unidad militar)', 'Infraestructura + horarios + victimología + personas, todo publicado', 'Atribución privada creíble = evidencia publicable acumulada'],
          ['Sony / Lazarus', '2014', 'Sponsor por gobierno', 'SIGINT no publicada + evidencia técnica parcial', 'Atribución gubernamental: peso único, base opaca'],
          ['DNC / APT28+29', '2016', 'Operator → sponsor (indictment 2018)', 'Dos clusters técnicos separados; luego confirmación judicial', 'Clusters separados aunque la víctima coincida; hack-and-leak'],
          ['APT10 / Cloud Hopper', '2016–18', 'Sponsor + indictment', 'Investigación conjunta público-privada', 'El acceso vía MSP escala el espionaje a toda su cartera'],
        ],
      },
      {
        t: 'check',
        q: {
          q: 'During the 2016 DNC investigation, two separate Russia-linked intrusion sets were found in the same network with different tooling and infrastructure. The correct analytic handling was to:',
          choices: [
            'Merge them into one group — same victim, same country',
            'Track them as separate activity groups based on their distinct technical evidence, regardless of shared victimology',
            'Discard one as a false positive',
            'Attribute both to the louder one',
          ],
          answer: 1,
          explain:
            'Clustering follows technical evidence (strong links), not victim overlap or presumed sponsor. The two sets showed no operational coordination.',
        },
      },
      {
        t: 'callout',
        kind: 'exam',
        title: 'Nota de examen',
        md: 'Asocia caso ↔ lección: MOONLIGHT MAZE = espionaje estatal temprano y persistencia de actores; APT1 = atribución pública privada con evidencia (y el Diamond completo); Sony/Lazarus = ataque destructivo estatal + atribución gubernamental; DNC = clusters separados en la misma víctima + hack-and-leak; APT10/Cloud Hopper = supply chain vía MSPs + acusaciones formales.',
      },
      {
        t: 'check',
        q: {
          q: 'Which case demonstrated that compromising service providers scales espionage to their entire customer base?',
          choices: ['MOONLIGHT MAZE', 'APT1', 'Sony/Lazarus', 'APT10 / Cloud Hopper'],
          answer: 3,
          explain:
            'Cloud Hopper targeted MSPs as a hop into dozens of downstream victims — the canonical supplier-access espionage case.',
        },
      },
      {
        t: 'check',
        q: {
          q: 'The APT1 report\'s historical significance lies in:',
          choices: [
            'Being the first ransomware analysis',
            'A private company publicly attributing state espionage to a specific military unit with extensive published evidence',
            'Proving attribution is impossible',
            'Introducing the kill chain',
          ],
          answer: 1,
          explain:
            'APT1 set the template for public, evidence-backed private-sector attribution reporting.',
        },
      },
      {
        t: 'callout',
        kind: 'story',
        title: '🎖️ Campaña',
        md: 'VELVET CICADA reproduce estos patrones: espionaje persistente (MOONLIGHT MAZE), evidencia técnica acumulada (APT1) y acceso vía proveedores (Cloud Hopper). En el **Lab 5B: Report Forge** escribirás el informe final del caso.',
      },
    ],
    quiz: [
      {
        id: 's5m4q1',
        domain: 'Dissemination',
        prompt: 'MOONLIGHT MAZE is historically significant because it:',
        choices: [
          'Was the first publicized ransomware campaign',
          'Demonstrated large-scale, sustained state cyber espionage decades ago, with actor tooling links persisting for years',
          'Introduced STIX',
          'Was attributed to hacktivists',
        ],
        answer: 1,
        explain:
          'An early, massive espionage investigation whose tooling lineage analysts later connected to long-running activity — actor persistence outlives defender memory.',
      },
      {
        id: 's5m4q2',
        domain: 'Dissemination',
        prompt:
          'What evidence style characterized the APT1 report?',
        choices: [
          'Anonymous claims without data',
          'Massive published technical evidence: infrastructure, victimology, operator details, and indicators tied to a specific unit',
          'Only classified annexes',
          'A single screenshot',
        ],
        answer: 1,
        explain:
          'Its publishable evidence base is what made private attribution credible and reusable by defenders worldwide.',
      },
      {
        id: 's5m4q3',
        domain: 'Dissemination',
        prompt: 'The Sony Pictures attack expanded the threat model by showing that state actors:',
        choices: [
          'Only conduct espionage',
          'Conduct destructive and coercive operations driven by political motives, not only quiet collection',
          'Never target private companies',
          'Avoid the entertainment sector',
        ],
        answer: 1,
        explain:
          'A wiper plus mass leaks as retaliation — political coercion against a private company, attributed by a government.',
      },
      {
        id: 's5m4q4',
        domain: 'Dissemination',
        prompt:
          'Government attribution statements (as in the Sony case) may rest on sources the public cannot review. For CTI consumers this means:',
        choices: [
          'They are always false',
          'They can carry unique (e.g., SIGINT-derived) weight but must be incorporated as evaluated sources with their own purposes',
          'They override all technical evidence',
          'They are TLP:RED by law',
        ],
        answer: 1,
        explain:
          'Governments see what defenders cannot — and have policy goals. Weigh, don\'t worship or dismiss.',
      },
      {
        id: 's5m4q5',
        domain: 'Dissemination',
        prompt: 'The defensive lesson of Cloud Hopper for organizations like Meridian is:',
        choices: [
          'MSPs are inherently malicious',
          'Provider and supplier access is part of your attack surface: monitor, constrain and contractually govern it',
          'Outsourcing eliminates risk',
          'Only domestic providers are safe',
        ],
        answer: 1,
        explain:
          'Trusted third-party access is a first-class intrusion vector. Requirements and collection should explicitly cover it.',
      },
      {
        id: 's5m4q6',
        domain: 'Dissemination',
        prompt:
          'Across these cases, public attribution evolved from internal investigation toward:',
        choices: [
          'Total secrecy',
          'A public-private ecosystem: vendor evidence reports, government statements, and legal indictments reinforcing each other',
          'Attribution being abandoned',
          'Social media polls',
        ],
        answer: 1,
        explain:
          'APT1 (private report) → Sony (government statement) → APT10 (joint investigation + indictments): complementary roles matured.',
      },
      {
        id: 's5m4q7',
        domain: 'Dissemination',
        prompt:
          'The DNC hack-and-leak operation differed from classic espionage in that:',
        choices: [
          'No data was actually stolen',
          'Stolen material was weaponized publicly through leak personas and sites to influence events, not quietly exploited',
          'It used no malware',
          'It targeted only governments',
        ],
        answer: 1,
        explain:
          'Collection turned into an influence operation: publication of the take was the point. Quiet exploitation is the espionage norm this case broke.',
      },
      {
        id: 's5m4q8',
        domain: 'Dissemination',
        prompt:
          'What made sponsor-level attribution achievable in the APT1 case when most assessments stop at operator level?',
        choices: [
          'A single decisive log line',
          'Years of convergent evidence across all four Diamond vertices plus meta-features (working hours, language settings) and state-aligned victimology',
          'An anonymous tip',
          'The actor confessed publicly',
        ],
        answer: 1,
        explain:
          'No smoking gun — accumulated, convergent weight of evidence over years. That is the general pattern of serious attribution.',
      },
      {
        id: 's5m4q9',
        domain: 'Dissemination',
        prompt:
          'Criminal indictments of state-linked operators (APT10, GRU officers) provide value to CTI even without arrests because they:',
        choices: [
          'Guarantee the activity stops',
          'Publish judicially-vetted evidence that validates or corrects private clustering, name operators, and impose costs',
          'Replace the need for technical analysis',
          'Declassify all related intelligence',
        ],
        answer: 1,
        explain:
          'Indictments put evidence on the public record under legal standards — a rare external check on vendor attribution — and serve cost-imposition strategies.',
      },
      {
        id: 's5m4q10',
        domain: 'Dissemination',
        prompt:
          'Your team finds a second, technically distinct intrusion set in a victim you already track. Following the DNC lesson, you should:',
        choices: [
          'Merge both into the existing group to keep reporting simple',
          'Open a separate cluster and only link them later if strong technical evidence (shared capability or infrastructure) emerges',
          'Assume coordination between the two sets',
          'Stop tracking the first set',
        ],
        answer: 1,
        explain:
          'Same victim is a weak link. Separate clusters preserve analytic integrity; merging requires strong links, not convenience.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 's5m5',
    sectionId: 's5',
    title: 'Feedback, métricas y madurez del equipo',
    minutes: 11,
    objectives: [
      'Medir el valor del equipo CTI sin métricas vanidosas',
      'Operar el bucle de feedback con consumidores',
      'Reconocer estadios de madurez del programa',
    ],
    blocks: [
      {
        t: 'p',
        md: 'Lo que no se mide, se recorta. Pero medir mal es peor: optimizar «IOCs procesados» produce equipos que procesan IOCs — no inteligencia. Las métricas sanas miden **resultados sobre decisiones y detección**, no volumen.',
      },
      {
        t: 'table',
        headers: ['❌ Métrica vanidosa', '✅ Métrica de valor'],
        rows: [
          ['Nº de IOCs ingeridos', 'Detecciones/hunts originados por intel que encontraron actividad real'],
          ['Nº de informes publicados', 'Requirements respondidos y decisiones informadas (con feedback del consumidor)'],
          ['Feeds contratados', 'Cobertura del CMF sobre los PIRs (gaps cerrados)'],
          ['Páginas por informe', 'Tiempo requisito→respuesta; satisfacción del consumidor'],
        ],
      },
      {
        t: 'p',
        md: 'El **feedback** es fase del ciclo, no cortesía: tras cada producto relevante, pregunta — ¿respondió tu pregunta? ¿llegó a tiempo? ¿qué decisión apoyó? ¿qué falta? Y registra los **éxitos atribuibles**: «el hunt del martes nació del informe X y encontró Y» es la frase que financia equipos.',
      },
      {
        t: 'list',
        items: [
          '**Madurez típica**: (1) reactivo — consume feeds, apaga fuegos; (2) en desarrollo — requirements escritos, productos regulares, CMF; (3) maduro — intel integrada en decisiones, métricas de resultado, producción propia que la comunidad consume.',
          'La trampa del estadio 1→2: comprar plataforma antes que proceso. El TIP no sustituye a los requirements.',
        ],
      },
      {
        t: 'check',
        q: {
          q: 'Which metric BEST demonstrates a CTI team\'s value to leadership?',
          choices: [
            '"We ingested 2.4M indicators this quarter"',
            '"Intel-driven hunts and detections found 7 real intrusions before damage; 9 of 11 PIRs answered with consumer sign-off"',
            '"We subscribed to 3 new feeds"',
            '"Average report length grew 40%"',
          ],
          answer: 1,
          explain:
            'Outcome metrics tied to detection and answered requirements demonstrate value. Volume metrics demonstrate activity.',
        },
      },
      {
        t: 'check',
        q: {
          q: 'A team buys an expensive TIP before defining any requirements or products. The likely outcome is:',
          choices: [
            'Instant maturity',
            'An indicator warehouse with no consumers — tooling cannot substitute for process',
            'Automatic PIR generation',
            'Perfect attribution',
          ],
          answer: 1,
          explain:
            'Platforms amplify a process; they cannot create one. Requirements → products → then tooling to scale.',
        },
      },
    ],
    quiz: [
      {
        id: 's5m5q1',
        domain: 'Dissemination',
        prompt: 'Why is "number of indicators processed" a poor primary KPI?',
        choices: [
          'Indicators are illegal to count',
          'It measures activity, not outcomes, and incentivizes volume over analysis and relevance',
          'It is too hard to compute',
          'Auditors dislike it',
        ],
        answer: 1,
        explain:
          'Teams optimize what is measured. Volume KPIs produce busywork; outcome KPIs produce defended organizations.',
      },
      {
        id: 's5m5q2',
        domain: 'Dissemination',
        prompt: 'Structured consumer feedback after each major product primarily enables:',
        choices: [
          'Bigger archives',
          'Refining requirements and products each cycle — the lifecycle\'s feedback phase operating as designed',
          'Salary negotiations',
          'Longer reports',
        ],
        answer: 1,
        explain:
          'Did it answer the question, on time, for a decision? That loop is how the program improves.',
      },
      {
        id: 's5m5q3',
        domain: 'Dissemination',
        prompt: 'A mature CTI program is BEST characterized by:',
        choices: [
          'The largest feed budget',
          'Intelligence integrated into organizational decisions, outcome metrics, and original production others consume',
          'The most analysts',
          'Zero incidents forever',
        ],
        answer: 1,
        explain:
          'Maturity = integration and demonstrated outcomes, not headcount or spend.',
      },
      {
        id: 's5m5q4',
        domain: 'Dissemination',
        prompt:
          'Documenting "this hunt originated from report X and found intrusion Y" matters because it:',
        choices: [
          'Fills the archive',
          'Creates attributable evidence of intelligence value for feedback, metrics and budget defense',
          'Is required by TLP',
          'Replaces incident response',
        ],
        answer: 1,
        explain:
          'Attributable wins are the strongest currency an intel team has.',
      },
      {
        id: 's5m5q5',
        domain: 'Dissemination',
        prompt: 'The healthiest sequencing when building a CTI capability is:',
        choices: [
          'Buy a TIP → hire analysts → find consumers',
          'Define consumers and requirements → establish products and process → add tooling to scale',
          'Subscribe to feeds → forward them raw → measure volume',
          'Hire a vendor to do everything',
        ],
        answer: 1,
        explain:
          'Process first, platforms second. Tools amplify whatever exists — including dysfunction.',
      },
      {
        id: 's5m5q6',
        domain: 'Dissemination',
        prompt:
          'Time from requirement to answered requirement is a useful metric because it measures:',
        choices: [
          'Analyst typing speed',
          'The team\'s responsiveness to consumer needs across the whole lifecycle',
          'Feed latency',
          'Report formatting quality',
        ],
        answer: 1,
        explain:
          'End-to-end cycle time reflects planning, collection, analysis and dissemination working together.',
      },
    ],
  },
];
