import type { Module } from '../lib/types';

export const S3_MODULES: Module[] = [
  // -------------------------------------------------------------------------
  {
    id: 's3m1',
    sectionId: 's3',
    title: 'Collection management y el CMF',
    minutes: 11,
    objectives: [
      'Distinguir threat data, information e intelligence en la práctica de colección',
      'Construir un Collection Management Framework (CMF)',
      'Evaluar fuentes y detectar collection gaps',
    ],
    blocks: [
      {
        t: 'p',
        md: 'Más datos no es mejor inteligencia. El **threat data overload** es el modo de fallo estándar: docenas de feeds, cero preguntas respondidas. La disciplina que lo evita es el **collection management**: saber qué fuentes tienes, qué responde cada una y a qué requirement sirve.',
      },
      {
        t: 'p',
        md: 'La herramienta central es el **Collection Management Framework (CMF)**: una matriz que cruza tus **fuentes** (internas y externas) con los **tipos de dato** que proporcionan y las **preguntas** que pueden responder. Suele incluir: qué cubre la fuente, cuánto tarda (timeliness), cuánto dura el dato (retention) y qué requirement alimenta.',
      },
      {
        t: 'table',
        headers: ['Fuente', 'Qué responde', 'Ejemplo de pregunta'],
        rows: [
          ['EDR interno', 'Ejecución y comportamiento en hosts propios', '¿Se ejecutó este loader en algún equipo?'],
          ['Passive DNS', 'Historial dominio↔IP global', '¿Qué dominios resolvieron a esta IP el mes pasado?'],
          ['Sandbox', 'Comportamiento dinámico de muestras', '¿Qué C2 contacta este fichero?'],
          ['WHOIS/registro', 'Datos de registro de dominios', '¿Quién registró este dominio y cuándo?'],
          ['Netflow/proxy logs', 'Comunicaciones desde tu red', '¿Algún host habló con esta infraestructura?'],
          ['Informes de vendor', 'TTPs y campañas de actores', '¿Cómo opera este intrusion set?'],
        ],
      },
      {
        t: 'callout',
        kind: 'tip',
        title: 'Empieza dentro',
        md: 'La colección **interna** (incidentes propios, EDR, DNS logs, email gateway) es la más relevante que existe: describe a los adversarios que *de verdad* te tocan. Las fuentes externas dan contexto y anticipación.',
      },
      {
        t: 'p',
        md: 'El CMF revela **collection gaps**: requirements sin fuente que los responda. Un gap se cierra comprando/instrumentando una fuente nueva — o se documenta como limitación del análisis. También revela lo contrario: fuentes que no alimentan ningún requirement (candidatas a cancelarse).',
      },
      {
        t: 'callout',
        kind: 'exam',
        title: 'Nota de examen',
        md: 'CMF = mapear fuentes ↔ datos ↔ requirements. Evalúa fuentes por **cobertura, puntualidad, precisión y completitud** — no por volumen ni precio.',
      },
      { t: 'h', text: 'Un CMF sobre la mesa' },
      {
        t: 'p',
        md: 'Este es el CMF de Meridian mapeado contra tres PIRs reales. Léelo por columnas — pero fíjate sobre todo en las dos filas marcadas: una fuente que no sirve a ningún PIR (**WASTE**) y un PIR que ninguna fuente responde (**GAP**). Son exactamente lo que el CMF existe para hacer visible.',
      },
      {
        t: 'code',
        lang: 'text',
        title: 'Collection Management Framework — Meridian Dynamics (extracto, ficticio)',
        text: `PIRs activos:
  PIR-1  ¿Se ha ejecutado el loader GLASS VIPER en algún host propio?
  PIR-2  ¿Qué infraestructura nueva registra el actor antes de atacar?
  PIR-3  ¿Algún proveedor de Meridian ha sido comprometido y usado como entrada?

FUENTE               | TIPO DE DATO         | TIMELINESS | RETENTION | SIRVE A
---------------------+----------------------+------------+-----------+---------
EDR interno          | ejecución en host    | segundos   | 90 días   | PIR-1
Proxy / netflow      | comunicaciones red   | minutos    | 30 días   | PIR-1
Passive DNS          | historial dom↔IP     | horas      | años      | PIR-2
WHOIS histórico      | registro de dominios | días       | años      | PIR-2
Sandbox interno      | comportamiento muestra| minutos   | 1 año     | PIR-1
ISAC aeroespacial    | TTPs + avisos sector | días       | -         | PIR-2
Feed comercial "X"   | IOCs genéricos masivos| horas     | -         | (ninguno)   [WASTE]
---------------------+----------------------+------------+-----------+---------
PIR-3 (proveedores)  | -- SIN FUENTE --     |    --      |    --     |  --         [GAP]`,
      },
      {
        t: 'p',
        md: 'Dos hallazgos clásicos, uno en cada extremo. El **GAP** (PIR-3): ninguna fuente ve la seguridad de tus proveedores. No se cierra comprando más IOCs — se cierra **instrumentando** la fuente adecuada (un programa de third-party monitoring, telemetría compartida por contrato con proveedores clave, o un ISAC de la cadena de suministro) o, si no es viable, **documentando la limitación** en cada informe que toque proveedores. El **WASTE** (Feed comercial X): entra un volumen enorme de IOCs genéricos que no responde a ningún PIR. Es candidato a cancelación — libera presupuesto para cerrar el gap. Y observa el patrón general: lo interno (EDR, proxy, sandbox) alimenta el PIR más accionable; lo externo da anticipación. Evalúa cada fuente por **cobertura, puntualidad, precisión y completitud** — nunca por volumen ni precio.',
      },
      {
        t: 'check',
        q: {
          q: 'PIR-3 (supplier compromise) has no source in the matrix. The two VALID responses are:',
          choices: [
            'Buy more IOC feeds, or ignore the PIR',
            'Instrument/acquire a fitting source (e.g., third-party monitoring), OR document it as an explicit analytic limitation',
            'Delete PIR-3, or merge it into PIR-1',
            'Wait for the actor to attack a supplier first',
          ],
          answer: 1,
          explain:
            'A collection gap is closed by adding a source that actually answers the PIR — or, if infeasible, by stating the limitation so consumers know the blind spot. Generic feeds do not answer a supplier-security question.',
        },
      },
      {
        t: 'check',
        q: {
          q: 'The commercial feed "X" ingests huge volumes of generic IOCs but serves no PIR. In CMF terms it is:',
          choices: [
            'The most valuable source, because volume equals coverage',
            'A cancellation candidate — spend serving no requirement, and the budget could close the PIR-3 gap',
            'A collection gap',
            'A processing failure',
          ],
          answer: 1,
          explain:
            'A source feeding no requirement is waste. The CMF surfaces it precisely so it can be cut and the resources redirected to real gaps.',
        },
      },
      {
        t: 'check',
        q: {
          q: 'A requirement asks about pre-attack domain registration patterns, but no current source provides registration data. In CMF terms this is:',
          choices: [
            'A processing failure',
            'A collection gap',
            'A dissemination problem',
            'Threat data overload',
          ],
          answer: 1,
          explain:
            'A requirement with no source able to answer it is a collection gap — close it with a new source or document the limitation.',
        },
      },
    ],
    quiz: [
      {
        id: 's3m1q1',
        domain: 'Collection',
        prompt: 'The PRIMARY purpose of a Collection Management Framework is to:',
        choices: [
          'Store IOCs in a database',
          'Map sources to the data they provide and the requirements they answer',
          'Rank vendors by price',
          'Automate alert triage',
        ],
        answer: 1,
        explain:
          'A CMF is the matrix connecting sources ↔ data types ↔ requirements, exposing gaps and waste.',
      },
      {
        id: 's3m1q2',
        domain: 'Collection',
        prompt:
          'Which source would BEST answer "Has any internal host communicated with this C2 infrastructure?"',
        choices: [
          'WHOIS records',
          'Internal proxy/netflow logs',
          'A vendor campaign report',
          'Certificate transparency logs',
        ],
        answer: 1,
        explain:
          'Internal network telemetry records your hosts\' communications. External sources cannot see your traffic.',
      },
      {
        id: 's3m1q3',
        domain: 'Collection',
        prompt:
          'A team pays for six overlapping IOC feeds while its PIR about supplier compromise has no supporting source. The CMF would reveal:',
        choices: [
          'Perfect collection posture',
          'Redundant sources serving no requirement, plus a collection gap on the PIR',
          'A need for more feeds',
          'A dissemination failure',
        ],
        answer: 1,
        explain:
          'Classic CMF findings: waste (sources without requirements) and gaps (requirements without sources).',
      },
      {
        id: 's3m1q4',
        domain: 'Collection',
        prompt: 'Why is internal telemetry usually the highest-value collection source?',
        choices: [
          'It is free',
          'It describes adversaries that demonstrably target your organization',
          'It is easier to parse than external data',
          'Regulators require it',
        ],
        answer: 1,
        explain:
          'Your own incidents and logs are ground truth about your real threat population — maximum relevance by definition.',
      },
      {
        id: 's3m1q5',
        domain: 'Collection',
        prompt: 'Good criteria for evaluating a collection source include:',
        choices: [
          'Coverage, timeliness, accuracy, completeness',
          'Marketing reach and brand recognition',
          'Number of indicators per day, regardless of context',
          'Whether competitors also buy it',
        ],
        answer: 0,
        explain:
          'Sources are judged by what they cover, how fast, how accurately and how completely — volume alone is not value.',
      },
      {
        id: 's3m1q6',
        domain: 'Collection',
        prompt:
          'Threat DATA becomes threat INTELLIGENCE when:',
        choices: [
          'It is stored in a TIP',
          'It is analyzed in the context of your requirements and supports a decision',
          'It comes from a government source',
          'It is older than 30 days',
        ],
        answer: 1,
        explain:
          'The data→information→intelligence transformation requires analysis against requirements — collection alone never produces intelligence.',
      },
      {
        id: 's3m1q7',
        domain: 'Collection',
        prompt:
          'To close the PIR-3 (supplier-compromise) gap in Meridian\'s CMF, the BEST first move is:',
        choices: [
          'Add a seventh generic IOC feed',
          'Instrument a source that actually sees supplier security — e.g., contractual telemetry sharing or a supply-chain ISAC',
          'Increase EDR retention from 90 days to 1 year',
          'Re-run the sandbox on old samples',
        ],
        answer: 1,
        explain:
          'A gap is closed by a source that answers the specific PIR. Supplier posture is invisible to internal EDR and generic feeds; it needs a source aimed at third parties.',
      },
      {
        id: 's3m1q8',
        domain: 'Collection',
        prompt:
          'For "Is this C2 domain being contacted RIGHT NOW?", which source property matters most — and which barely matters?',
        choices: [
          'Retention matters most; timeliness barely matters',
          'Timeliness matters most (seconds/minutes); long retention barely matters for a live question',
          'Price matters most; coverage barely matters',
          'Brand matters most; accuracy barely matters',
        ],
        answer: 1,
        explain:
          'A live-detection question is answered by fast sources (EDR/proxy in seconds-minutes). Years of retention help retro-hunting, not the real-time question.',
      },
      {
        id: 's3m1q9',
        domain: 'Collection',
        prompt: 'When rating a collection source, which is NOT a sound evaluation criterion?',
        choices: [
          'Coverage of the requirement',
          'Timeliness and accuracy',
          'Indicators delivered per day and subscription price',
          'Completeness of the data it provides',
        ],
        answer: 2,
        explain:
          'Volume-per-day and price are vanity/cost metrics, not value. Sources are judged by coverage, timeliness, accuracy and completeness against the requirements they serve.',
      },
      {
        id: 's3m1q10',
        domain: 'Collection',
        prompt:
          'Three purchased feeds and internal netflow all answer PIR-1. The CMF-driven decision is to:',
        choices: [
          'Keep all four — redundancy is always good',
          'Assess overlap and keep the sources that add unique coverage/timeliness, cutting purely redundant paid feeds',
          'Cancel the internal source since it is not a vendor product',
          'Add a fourth paid feed for safety',
        ],
        answer: 1,
        explain:
          'Redundancy has diminishing returns. Keep sources that contribute distinct value; trim paid feeds that merely duplicate what internal telemetry already provides.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 's3m2',
    sectionId: 's3',
    title: 'Malware como fuente de colección',
    minutes: 13,
    objectives: [
      'Extraer valor de muestras: estático, dinámico y metadatos',
      'Usar hashes, imphash y fuzzy hashing para pivotar',
      'Entender los riesgos de OPSEC al subir muestras a servicios públicos',
    ],
    blocks: [
      {
        t: 'p',
        md: 'Una muestra de malware es una **mina de colección**: el adversario tuvo que poner ahí todo lo necesario para operar. El análisis se divide en **estático** (sin ejecutar: strings, imports, recursos, firma) y **dinámico** (detonación en sandbox: comportamiento, red, ficheros creados).',
      },
      {
        t: 'list',
        items: [
          '**Hashes criptográficos** (`MD5`, `SHA-256`) — identidad exacta del fichero; cambian con un solo byte.',
          '**Imphash** — hash de la tabla de imports de un PE; agrupa binarios compilados con el mismo toolchain/funcionalidad.',
          '**Fuzzy hashing** (`ssdeep`) — similitud aproximada entre ficheros; encuentra variantes recompiladas.',
          '**Strings y configs** — C2 hardcodeados, user-agents, mutexes, rutas, claves.',
          '**PDB paths** — ruta del símbolo de depuración: filtra el entorno de desarrollo del autor (`C:\\Users\\dev\\proj\\loader\\...`).',
          '**Certificados de firma** — robados o propios: pivote excelente.',
          '**Sandbox reports** — dominios/IPs contactados, persistencia creada, ficheros soltados.',
        ],
      },
      {
        t: 'callout',
        kind: 'example',
        title: 'Pivote desde la muestra',
        md: 'Del loader de VELVET CICADA extraes: C2 `update-svc-cdn.com` (→ pivote de infraestructura), PDB `...\\ldr\\bin\\ldr.pdb` (→ link fuerte entre variantes) y un mutex único (→ regla de detección host). Una muestra alimenta tres vértices del diamante.',
      },
      {
        t: 'callout',
        kind: 'warn',
        title: 'OPSEC: subir muestras tiene precio',
        md: 'Subir una muestra **dirigida** a un servicio público (p. ej. VirusTotal) puede avisar al adversario de que fue descubierto: los actores monitorizan sus hashes. Igual de grave: documentos internos con datos sensibles quedan accesibles a terceros con licencias del servicio. Política sana: **buscar el hash primero** (no sube el fichero) y subir solo cuando el beneficio supere el riesgo.',
      },
      { t: 'h', text: 'Leer un informe de sandbox' },
      {
        t: 'p',
        md: 'Aquí tienes el informe de la muestra de GLASS VIPER que detonó el analista. No es un veredicto: es **input de processing**. Léelo con ojo de triaje — separa lo que es del actor de lo que es ruido del sistema:',
      },
      {
        t: 'code',
        lang: 'text',
        title: 'Informe de sandbox — GLASS VIPER stage-1 (ficticio, MER-2026-023)',
        text: `=== ESTÁTICO ===
SHA-256      : 9f3a2c...e1
Imphash      : 1b8d4f2a...      (comparte tabla de imports con 3 muestras previas)
ssdeep       : 3072:Ab9..:Xk2   (94% similar a variante de 2026-01)
Compile time : 2026-02-19 (plausible; los actores lo falsean a veces)
PDB path     : D:\\proj\\cicada\\loader\\Release\\ldr.pdb
Imports      : MapViewOfSection, CreateNamedPipeA, CreateProcessA
Signing cert : "Bright Meridian Software Kft." (firmante desconocido)

=== DINÁMICO ===
Named pipe   : \\\\.\\pipe\\vc_pipe_4f8a1c9e     (formato propio del actor)
Persistencia : schtasks /create /tn WindowsUpdateCheck
Hosts contactados:
  update-svc-cdn.com:443        → C2 (beacon HTTPS, jitter 60s)
  cdn-sync-status.example:443   → segundo C2 (fallback)
  time.windows.com:123          → NTP legítimo del SO
  ctldl.windowsupdate.com:80    → CRL/CTL legítimo de Windows
  www.msftconnecttest.com:80    → prueba de conectividad de Windows`,
      },
      {
        t: 'p',
        md: 'El triaje empieza separando **infraestructura del actor** de **ruido del sistema**. De los cinco hosts, solo dos son del actor (`update-svc-cdn.com`, `cdn-sync-status.example`); los otros tres son telemetría normal de Windows que cualquier proceso genera. Bloquear los cinco a ciegas rompería la resolución de hora y las comprobaciones de conectividad de toda la flota — un autogol clásico. Después vienen los pivotes: el **imphash** te lleva a la familia por toolchain (mismo compilador/estructura, aunque el SHA-256 difiera); el **ssdeep** al 94% confirma que es una variante recompilada; el **PDB path** es el link fuerte hacia el entorno del desarrollador; y cada C2 alimenta el vértice Infrastructure del diamante. Nota también el certificado: estar *firmado* no lo hace benigno — un firmante desconocido con nombre plausible es una bandera, no un salvoconducto.',
      },
      {
        t: 'check',
        q: {
          q: 'Of the five contacted hosts, which should be actioned as C2 — and what is the risk of blocking all five?',
          choices: [
            'All five; there is no risk in blocking more',
            'Only update-svc-cdn.com and cdn-sync-status.example; blocking the three Windows hosts breaks time sync and connectivity checks fleet-wide',
            'Only time.windows.com, because NTP is abused',
            'None; sandbox output is never actionable',
          ],
          answer: 1,
          explain:
            'Two hosts are actor infrastructure; three are normal OS telemetry. Blindly blocking benign endpoints causes self-inflicted outages — triage before you action.',
        },
      },
      {
        t: 'check',
        q: {
          q: 'A second sample shows the SAME imphash but a DIFFERENT SHA-256; a third shows a 92% ssdeep match. These respectively indicate:',
          choices: [
            'Both are unrelated files',
            'Shared toolchain/import structure (imphash) and a recompiled near-variant (ssdeep) — both link the samples',
            'The samples are identical',
            'A false positive in the sandbox',
          ],
          answer: 1,
          explain:
            'Imphash groups by import table (same toolchain/functionality despite a new file hash); a high ssdeep score flags a recompiled variant. Together they build the family cluster.',
        },
      },
      {
        t: 'check',
        q: {
          q: 'Which artifact lets you find RECOMPILED variants of the same malware family despite different cryptographic hashes?',
          choices: ['SHA-256', 'Fuzzy hashing (ssdeep)', 'The file name', 'The PE timestamp'],
          answer: 1,
          explain:
            'Fuzzy hashes measure similarity between files, surviving small changes that completely alter SHA-256.',
        },
      },
      {
        t: 'p',
        md: 'El reporte de sandbox no es el final: es **input de processing**. Sus indicadores deben normalizarse, contextualizarse (¿es ese dominio realmente C2 o telemetría legítima del software?) y convertirse en detecciones o pivotes. Sandbox ≠ veredicto automático.',
      },
      {
        t: 'check',
        q: {
          q: 'A PDB path like C:\\Users\\kaz\\dev\\stage2\\bin\\release\\st2.pdb found in two different samples is valuable because:',
          choices: [
            'It reveals the victim\'s username',
            'It is a development-environment artifact that strongly links samples to the same author/toolchain',
            'It contains the C2 address',
            'It proves nation-state involvement',
          ],
          answer: 1,
          explain:
            'PDB paths leak the author\'s build environment — rare, often unique, and costly to vary. A classic strong link (and pivot).',
        },
      },
    ],
    quiz: [
      {
        id: 's3m2q1',
        domain: 'Collection',
        prompt: 'Static analysis differs from dynamic analysis in that static analysis:',
        choices: [
          'Requires detonating the sample in an isolated VM',
          'Examines the file without executing it (strings, imports, structure)',
          'Only works on packed samples',
          'Produces network indicators exclusively',
        ],
        answer: 1,
        explain:
          'Static = examine without execution; dynamic = detonate and observe behavior. They complement each other.',
      },
      {
        id: 's3m2q2',
        domain: 'Collection',
        prompt: 'Imphash groups PE files by:',
        choices: [
          'Their compile timestamp',
          'A hash of their import table, reflecting shared functionality/toolchain',
          'Their file size',
          'Their icon resources',
        ],
        answer: 1,
        explain:
          'Import-table hashing clusters binaries built from similar codebases even when file hashes differ.',
      },
      {
        id: 's3m2q3',
        domain: 'Collection',
        prompt:
          'Why can uploading a targeted implant to a public multi-AV service harm your investigation?',
        choices: [
          'The service might patch the malware',
          'Adversaries monitor for their samples appearing publicly, learning they were discovered and rotating infrastructure',
          'It violates the Kill Chain model',
          'Public services cannot analyze implants',
        ],
        answer: 1,
        explain:
          'Sample publication is a signal to the actor (and exposes any embedded sensitive data). Search by hash first; upload deliberately.',
      },
      {
        id: 's3m2q4',
        domain: 'Collection',
        prompt:
          'A sandbox report lists 14 contacted domains. Before adding them to blocklists you should:',
        choices: [
          'Block all 14 immediately',
          'Determine which are actor infrastructure versus legitimate services the malware abuses or background noise',
          'Upload the report to social media',
          'Convert them all to YARA rules',
        ],
        answer: 1,
        explain:
          'Sandboxes record ALL traffic — including benign update checks and abused legitimate services. Context before action.',
      },
      {
        id: 's3m2q5',
        domain: 'Collection',
        prompt:
          'Which extracted artifact most directly feeds the INFRASTRUCTURE vertex of the Diamond Model?',
        choices: [
          'The hardcoded C2 domain in the config',
          'The mutex name',
          'The compiler version',
          'The ransom note text',
        ],
        answer: 0,
        explain:
          'C2 domains/IPs are infrastructure. Mutexes and compiler details are capability artifacts.',
      },
      {
        id: 's3m2q6',
        domain: 'Collection',
        prompt:
          'Two samples share an identical, unusual code-signing certificate. The BEST interpretation is:',
        choices: [
          'Coincidence — certificates are commonly shared',
          'A strong pivot/link: same stolen or actor-owned signing material',
          'The samples are benign because they are signed',
          'The certificate authority is the adversary',
        ],
        answer: 1,
        explain:
          'Signing material is rare and controlled; reuse strongly links samples and enables certificate-based pivoting/hunting.',
      },
      {
        id: 's3m2q7',
        domain: 'Collection',
        prompt:
          'For linking two samples to the SAME author/build environment, which artifact is the strongest?',
        choices: [
          'The compile timestamp',
          'The PDB path revealing the developer\'s project directory',
          'The file size',
          'The number of imported functions',
        ],
        answer: 1,
        explain:
          'A PDB path leaks the author\'s build tree — rare, often unique, costly to vary. Compile timestamps are trivially forged and weak as links.',
      },
      {
        id: 's3m2q8',
        domain: 'Collection',
        prompt:
          'In the report, the named pipe format vc_pipe_%08x versus the contacted host update-svc-cdn.com feed which Diamond vertices respectively?',
        choices: [
          'Both feed Infrastructure',
          'The pipe format feeds Capability (an implant artifact); the C2 domain feeds Infrastructure',
          'Both feed Capability',
          'The pipe feeds Victim; the domain feeds Adversary',
        ],
        answer: 1,
        explain:
          'A proprietary named-pipe format is an artifact of the malware itself (Capability); the C2 domain is Infrastructure. One sample populates multiple vertices.',
      },
      {
        id: 's3m2q9',
        domain: 'Collection',
        prompt:
          'The sample is digitally signed by "Bright Meridian Software Kft.", an unknown signer. The correct reading is:',
        choices: [
          'It is benign — signed binaries are trusted',
          'A signature does not imply benign; an unknown signer with a plausible name is a flag and a pivot, not a pass',
          'The certificate authority created the malware',
          'Signing is irrelevant to analysis',
        ],
        answer: 1,
        explain:
          'Actors sign with stolen or purpose-registered certificates. "Signed" ≠ "safe"; treat the signer as another artifact to verify and pivot on (appeal-to-authority trap).',
      },
      {
        id: 's3m2q10',
        domain: 'Collection',
        prompt:
          'Before any public upload of this targeted implant, the safer FIRST step is:',
        choices: [
          'Upload immediately to get more detections',
          'Search the hash first (which does not expose the file); upload only if the intelligence gain outweighs tipping off the actor and leaking any embedded data',
          'Email the sample to the vendor',
          'Post the SHA-256 on social media',
        ],
        answer: 1,
        explain:
          'Hash lookups reveal nothing new to the actor; uploading the binary can signal discovery and expose sensitive embedded content. Search first, upload deliberately.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 's3m3',
    sectionId: 's3',
    title: 'Infraestructura: DNS, WHOIS y certificados',
    minutes: 14,
    objectives: [
      'Pivotar con passive DNS, WHOIS y certificados TLS',
      'Reconocer pivotes ruidosos (shared hosting, CDNs, sinkholes)',
      'Leer el ciclo de vida de un dominio malicioso',
    ],
    blocks: [
      {
        t: 'p',
        md: 'La infraestructura es el vértice del diamante más **expuesto**: para operar, el adversario debe registrar dominios, alquilar servidores y servir certificados — todo deja registro público o semipúblico. Tres fuentes dominan el pivoteo:',
      },
      {
        t: 'list',
        items: [
          '**Passive DNS (pDNS)** — historial de resoluciones dominio↔IP recolectado por sensores globales. Responde: «¿a qué apuntó este dominio el año pasado?» y «¿qué más resolvió a esta IP?».',
          '**WHOIS / registro** — registrante, email, registrar, fechas de creación/expiración, nameservers. La privacidad lo oculta a menudo… pero el WHOIS **histórico** y los patrones de registro (mismo registrar+NS+fecha) siguen pivotando.',
          '**Certificados TLS** — fingerprint (SHA-1), subject, SANs, emisor, fechas. Los **Certificate Transparency logs** publican cada certificado emitido: descubren subdominios e infraestructura nueva en tiempo casi real. La reutilización de un certificado autofirmado entre servidores es un enlace fuerte.',
        ],
      },
      {
        t: 'callout',
        kind: 'example',
        title: 'Cadena de pivotes',
        md: 'Dominio de phishing → su IP de hosting (pDNS) → ¿qué otros dominios viven en esa IP? → uno comparte el **certificado TLS** del C2 conocido → WHOIS histórico del nuevo dominio → mismo email de registro `kazuo.tanji@...` → tres dominios más registrados con ese email. Seis activos nuevos partiendo de uno.',
      },
      { t: 'h', text: 'Pivotes ruidosos: cuándo NO seguir' },
      {
        t: 'table',
        headers: ['Pivote', 'Problema'],
        rows: [
          ['IP de shared hosting', 'Miles de dominios sin relación comparten la IP'],
          ['IP de CDN (Cloudflare, etc.)', 'La IP es del proveedor, no del actor'],
          ['Nameservers genéricos del registrar', 'Compartidos por millones de dominios'],
          ['IP de sinkhole', 'Dominios incautados de actores distintos apuntan ahí'],
          ['Certificados de CA gratuitas masivas', 'Emitidos a millones; solo el fingerprint exacto pivota'],
        ],
      },
      {
        t: 'callout',
        kind: 'warn',
        md: 'Regla del pivoteo: pregunta siempre **«¿cuántos inquilinos tiene este recurso?»**. Un recurso dedicado (VPS propio, cert autofirmado, email de registro) discrimina; un recurso compartido contamina tu grafo con miles de falsos vecinos.',
      },
      {
        t: 'p',
        md: 'Ciclo de vida típico de un dominio malicioso: **registro** (a menudo en lote, con patrones) → **aparcado/dormido** (días o meses para envejecer y evadir reputación por "edad") → **activación** (DNS apunta a infraestructura operativa) → **uso** → **quemado** (detectado/bloqueado) → abandono o reventa. Detectar el patrón de *registro en lote* permite bloquear dominios **antes** de su primer uso.',
      },
      {
        t: 'check',
        q: {
          q: 'A suspect domain resolves to an IP. Passive DNS shows 14,000 other domains on that IP. Your next step:',
          choices: [
            'Add all 14,000 domains to the blocklist',
            'Treat the IP as shared hosting — a noisy pivot — and pivot on something dedicated instead (cert, WHOIS, registration pattern)',
            'Report all domains to law enforcement',
            'Conclude the suspect domain is benign',
          ],
          answer: 1,
          explain:
            'Mass co-hosting means the IP discriminates nothing. Pivot on dedicated, actor-controlled features instead.',
        },
      },
      {
        t: 'callout',
        kind: 'story',
        title: '🎖️ Campaña',
        md: 'En el **Lab 3A: Pivot Hunt** recorrerás el grafo real de VELVET CICADA con un presupuesto limitado de consultas: cada pivote cuesta, igual que en producción. Encuentra los 4 activos del actor sin ahogarte en ruido.',
      },
    ],
    quiz: [
      {
        id: 's3m3q1',
        domain: 'Collection',
        prompt: 'Passive DNS answers which question?',
        choices: [
          'Who registered this domain?',
          'What did this domain historically resolve to, and what else resolved to this IP?',
          'What certificate does this server present?',
          'What email provider does the actor use?',
        ],
        answer: 1,
        explain:
          'pDNS is the historical record of domain↔IP resolutions seen by sensors — the backbone of infrastructure pivoting.',
      },
      {
        id: 's3m3q2',
        domain: 'Collection',
        prompt:
          'WHOIS privacy protection hides registrant details. Which technique can still link domains to a common operator?',
        choices: [
          'Nothing — privacy protection ends the investigation',
          'Historical WHOIS plus registration patterns (registrar, nameservers, creation timing, naming convention)',
          'Pinging the domains',
          'Checking their Alexa rank',
        ],
        answer: 1,
        explain:
          'Pre-privacy historical records and behavioral registration patterns survive WHOIS privacy.',
      },
      {
        id: 's3m3q3',
        domain: 'Collection',
        prompt: 'Certificate Transparency logs are valuable to CTI because they:',
        choices: [
          'Hide certificates from adversaries',
          'Publish every issued certificate, exposing new domains/subdomains as infrastructure is stood up',
          'Block invalid certificates automatically',
          'Contain malware samples',
        ],
        answer: 1,
        explain:
          'CT logs are an append-only public record of certificate issuance — near-real-time discovery of adversary (and your own) infrastructure.',
      },
      {
        id: 's3m3q4',
        domain: 'Collection',
        prompt: 'Which is the STRONGEST infrastructure pivot?',
        choices: [
          'Two domains behind the same CDN IP',
          'Two servers presenting the same self-signed TLS certificate fingerprint',
          'Two domains using the registrar\'s default nameservers',
          'Two domains with .com TLD',
        ],
        answer: 1,
        explain:
          'A reused self-signed certificate is actor-controlled, rare material. CDN IPs and default nameservers are shared by unrelated tenants.',
      },
      {
        id: 's3m3q5',
        domain: 'Collection',
        prompt:
          'Domains registered in a batch, parked for weeks, then activated shortly before a phishing wave illustrate:',
        choices: [
          'The malicious domain lifecycle — and an opportunity to detect/block before first use',
          'Normal CDN behavior',
          'Certificate transparency',
          'DNS load balancing',
        ],
        answer: 0,
        explain:
          'Register → age/park → activate → use → burn. Registration-pattern monitoring enables pre-emptive blocking.',
      },
      {
        id: 's3m3q6',
        domain: 'Collection',
        prompt:
          'An IP previously hosted a C2 four years ago. Today it belongs to a cloud provider\'s recycled pool. Treating current tenants as malicious is an error of:',
        choices: [
          'Timeliness/context — infrastructure changes hands; old resolutions need temporal context',
          'Fuzzy hashing',
          'Certificate validation',
          'Kill chain mapping',
        ],
        answer: 0,
        explain:
          'pDNS history requires time-awareness: IPs and domains are recycled. Indicator aging matters (see S3M5).',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 's3m4',
    sectionId: 's3',
    title: 'OSINT, TLP y comunidades de compartición',
    minutes: 14,
    objectives: [
      'Aprovechar OSINT y reporting de vendors sin heredar sus sesgos',
      'Leer registros públicos (WHOIS, pDNS) separando señal de ruido',
      'Distinguir colección pasiva de activa y proteger tu OPSEC',
      'Aplicar el Traffic Light Protocol (TLP 2.0) correctamente',
      'Conocer ISACs, CERTs y comunidades de confianza',
    ],
    blocks: [
      {
        t: 'p',
        md: 'El ecosistema público de CTI es enorme: informes de vendors, blogs de investigadores, repositorios de reglas, registros públicos, redes sociales. Es colección legítima y barata — con dos salvedades: **sesgo de visibilidad** (cada vendor ve solo lo que sus clientes sufren) y **OPSEC** (tu actividad de colección también es observable).',
      },
      { t: 'h', text: 'Leer registros públicos sin quemarse' },
      {
        t: 'p',
        md: 'En S3M3 aprendiste *a dónde* pivotar. Aquí, a **leer la fuente pública tal cual llega** — porque casi nunca llega limpia. Este es el registro del dominio de phishing de la campaña, más su historia en passive DNS:',
      },
      {
        t: 'code',
        lang: 'text',
        title: 'WHOIS + passive DNS del dominio de phishing (ficticio)',
        text: `$ whois cdn-sync-status.example

Domain Name: CDN-SYNC-STATUS.EXAMPLE
Creation Date: 2026-02-27T14:03:11Z
Updated Date: 2026-02-27T14:03:11Z
Registry Expiry Date: 2027-02-27T14:03:11Z
Registrar: NameFlow LLC (IANA ID 9999)
Registrant Organization: Privacy Guard Services
Registrant Email: proxy-7f3a21@privacyguard.example
Name Server: NS1.FASTPARK-DNS.EXAMPLE
Name Server: NS2.FASTPARK-DNS.EXAMPLE

$ pdns lookup cdn-sync-status.example

first_seen           last_seen            type  rdata
2026-02-27 14:22:08  2026-03-01 09:40:51  A     203.0.113.27
2026-03-01 10:02:13  2026-04-18 11:31:55  A     198.51.100.84`,
      },
      {
        t: 'p',
        md: 'Lectura de analista: el **privacy proxy** mata el email como pivote — ruido, no lo persigas. Pero queda señal: la **Creation Date** (dominio de 3 días cuando llegó el primer phishing → registrado *para* esta operación, no comprometido), el par **registrar + nameservers de parking** (si el actor registra en lote, ese patrón se repite en sus otros dominios), y el pDNS muestra el **re-hosting** del 1 de marzo — la primera IP se quemó y migraron. Todo esto lo obtuviste **sin tocar el dominio**: datos ya recolectados por terceros.',
      },
      {
        t: 'p',
        md: 'Esa es la distinción que protege tu investigación: colección **pasiva** (pDNS, Certificate Transparency, caches históricos de WHOIS — lees observaciones de terceros; el actor no puede verte) frente a **activa** (resolver el dominio, visitar el panel, escanear el host — generas tráfico que aterriza en *sus* logs). Regla operativa: **agota lo pasivo primero**; lo activo, solo desde infraestructura de **managed attribution** (entornos desechables sin huella corporativa) y solo cuando el valor esperado justifique arriesgarte a avisar al actor.',
      },
      {
        t: 'check',
        q: {
          q: 'Querying passive DNS history for an adversary domain differs from browsing the domain yourself in that:',
          choices: [
            'Passive DNS is less accurate, so it should be avoided',
            'Passive sources replay data already collected by third parties — invisible to the actor — while active contact generates traffic the actor can observe in their own logs',
            'Browsing is always safe over HTTPS',
            'There is no practical difference',
          ],
          answer: 1,
          explain:
            'Exhaust passive sources first. Active collection is observable and belongs in managed-attribution environments, only when justified.',
        },
      },
      {
        t: 'callout',
        kind: 'warn',
        title: 'OPSEC de colección',
        md: 'No navegues infraestructura adversaria desde la red corporativa: usa entornos aislados y no atribuibles. No consultes en servicios públicos datos que delaten tu investigación (subidas de muestras dirigidas, búsquedas con nombres internos). El adversario también lee los logs de *sus* servidores.',
      },
      { t: 'h', text: 'Traffic Light Protocol (TLP 2.0)' },
      {
        t: 'table',
        headers: ['Marca', 'Quién puede recibirlo'],
        rows: [
          ['TLP:RED', 'Solo los participantes nombrados — ojos concretos, no organizaciones'],
          ['TLP:AMBER', 'Tu organización y sus clientes con necesidad de saber'],
          ['TLP:AMBER+STRICT', 'Solo tu organización — sin clientes'],
          ['TLP:GREEN', 'La comunidad — peers y organizaciones del sector, no público'],
          ['TLP:CLEAR', 'Sin restricción — publicable'],
        ],
      },
      {
        t: 'callout',
        kind: 'exam',
        title: 'Nota de examen',
        md: 'TLP marca **a quién puedes redistribuir**, no la sensibilidad técnica. AMBER+STRICT (introducido en TLP 2.0) corta la cadena en tu organización. RED limita a *personas*, no a empresas. Violar TLP destruye la confianza que sostiene la compartición.',
      },
      {
        t: 'callout',
        kind: 'example',
        title: 'Anatomía de un fumble TLP',
        md: 'Un analista recibe de su ISAC un informe **TLP:AMBER** con C2 activos de una campaña en curso y reenvía «solo los IOCs» a una lista de correo abierta, «para proteger a todos». El actor — suscrito a esa lista con un alias, porque él también hace OSINT — rota toda su infraestructura en horas. Resultado: las víctimas aún no notificadas pierden su ventana de detección, el ISAC abre investigación por la fuga, y la organización del analista queda fuera de los intercambios sensibles durante meses. **Compartir más rápido no siempre protege más**: el marking es el juicio del productor sobre quién puede saberlo *sin coste operacional* — y los IOCs extraídos heredan la marca del informe.',
      },
      {
        t: 'p',
        md: 'Las **comunidades de compartición** multiplican tu colección: **ISACs/ISAOs** sectoriales (aviación, finanzas, energía…), **CERTs/CSIRTs** nacionales, grupos de confianza informales y programas de intercambio con peers. La regla de oro es la reciprocidad: quien solo consume acaba fuera.',
      },
      {
        t: 'p',
        md: 'Al consumir informes de vendors: extrae los **TTPs y la lógica analítica**, no solo los IOCs del apéndice. Pregunta siempre: ¿qué visibilidad tiene este vendor? ¿qué no puede ver? ¿sus conclusiones siguen su evidencia? Un informe es una *fuente* que se evalúa, no una verdad que se copia.',
      },
      {
        t: 'check',
        q: {
          q: 'A partner shares a report marked TLP:AMBER. You may share it with:',
          choices: [
            'Anyone, it is public',
            'Your organization and your clients who need to know',
            'A public blog post',
            'Nobody at all, ever',
          ],
          answer: 1,
          explain:
            'AMBER permits sharing within your organization and with clients on a need-to-know basis. AMBER+STRICT would exclude clients.',
        },
      },
      {
        t: 'check',
        q: {
          q: 'Why should vendor reporting be weighed against the vendor\'s visibility?',
          choices: [
            'Vendors always exaggerate',
            'Each vendor only observes activity affecting its own customer base — a structural sampling bias',
            'Vendor reports are TLP:RED by default',
            'Vendors cannot analyze malware',
          ],
          answer: 1,
          explain:
            'Visibility bias: conclusions like "this actor only targets sector X" may just reflect who the vendor\'s customers are.',
        },
      },
    ],
    quiz: [
      {
        id: 's3m4q1',
        domain: 'Collection',
        prompt: 'TLP:RED information may be shared with:',
        choices: [
          'Your whole organization',
          'Only the specific named participants who received it',
          'Sector peers',
          'Clients under NDA',
        ],
        answer: 1,
        explain:
          'RED restricts to the exact individuals in the exchange — not their organizations.',
      },
      {
        id: 's3m4q2',
        domain: 'Collection',
        prompt: 'What did TLP 2.0 add over the previous version?',
        choices: [
          'TLP:BLACK for governments',
          'TLP:AMBER+STRICT, limiting sharing to the recipient organization only (no clients), and renamed WHITE to CLEAR',
          'Automatic encryption',
          'A 24-hour embargo rule',
        ],
        answer: 1,
        explain:
          'TLP 2.0 (FIRST) introduced AMBER+STRICT and renamed WHITE→CLEAR.',
      },
      {
        id: 's3m4q3',
        domain: 'Collection',
        prompt:
          'Browsing an active adversary C2 panel from your corporate IP range is dangerous because:',
        choices: [
          'It is illegal in all countries',
          'The adversary can observe the visit in server logs, revealing your investigation and organization',
          'It consumes too much bandwidth',
          'Browsers cannot render C2 panels',
        ],
        answer: 1,
        explain:
          'Collection OPSEC: adversaries watch their own infrastructure logs. Use isolated, non-attributable environments.',
      },
      {
        id: 's3m4q4',
        domain: 'Collection',
        prompt: 'Sector ISACs primarily provide:',
        choices: [
          'Free EDR licenses',
          'Trusted intra-sector sharing of threat activity, indicators and best practices',
          'Government attribution statements',
          'Penetration testing services',
        ],
        answer: 1,
        explain:
          'Information Sharing and Analysis Centers organize trusted exchange among organizations facing similar threats.',
      },
      {
        id: 's3m4q5',
        domain: 'Collection',
        prompt:
          'The MOST durable value to extract from a vendor campaign report is:',
        choices: [
          'The IOC appendix',
          'The documented TTPs and analytic reasoning, mapped to your own environment',
          'The report\'s marketing summary',
          'The actor\'s codename',
        ],
        answer: 1,
        explain:
          'IOCs age in days; TTP knowledge and analytic logic persist (Pyramid of Pain). Codenames are labels, not analysis.',
      },
      {
        id: 's3m4q6',
        domain: 'Collection',
        prompt:
          'A peer consistently consumes shared intel but never contributes. The likely long-term outcome in trust groups is:',
        choices: [
          'They are promoted to moderator',
          'Reduced access — reciprocity sustains sharing communities',
          'Nothing; sharing is unconditional',
          'They receive more data to encourage them',
        ],
        answer: 1,
        explain:
          'Trust communities run on reciprocity and demonstrated handling discipline; pure consumers lose access.',
      },
      {
        id: 's3m4q7',
        domain: 'Collection',
        prompt:
          'A phishing domain\'s WHOIS shows a privacy-proxy registrant. Which pivots REMAIN useful?',
        choices: [
          'None — privacy protection ends the analysis',
          'Creation date, registrar, and nameserver pattern: batch-registered domains tend to repeat them',
          'Only the proxy service\'s email address',
          'The registry expiry date alone',
        ],
        answer: 1,
        explain:
          'The proxy kills the registrant-email pivot, but registration timing and the registrar/NS combination still profile the actor\'s procurement pattern.',
      },
      {
        id: 's3m4q8',
        domain: 'Collection',
        prompt:
          'A domain was registered three days before it delivered phishing against your organization. The strongest inference is:',
        choices: [
          'The domain was compromised from a legitimate owner',
          'It was purpose-registered for this operation — typical single-use attack infrastructure',
          'The registrar is complicit',
          'The campaign has been running for years',
        ],
        answer: 1,
        explain:
          'Short registration-to-use intervals indicate purpose-built, disposable infrastructure rather than a compromised legitimate site.',
      },
      {
        id: 's3m4q9',
        domain: 'Collection',
        prompt:
          'An analyst extracts "just the IOCs" from a TLP:AMBER ISAC report and posts them to an open mailing list. Beyond the trust breach, the operational risk is:',
        choices: [
          'None — IOCs are not covered by the report\'s marking',
          'The adversary, also monitoring open sources, learns they are detected and rotates infrastructure before all victims are notified',
          'The mailing list gets too much traffic',
          'The IOCs expire faster',
        ],
        answer: 1,
        explain:
          'Derived content inherits the marking. Premature publication tips off the actor and burns the detection window for everyone else.',
      },
      {
        id: 's3m4q10',
        domain: 'Collection',
        prompt: 'The correct OPSEC sequence when investigating live adversary infrastructure is:',
        choices: [
          'Browse it immediately from the corporate network to confirm it is live',
          'Exhaust passive sources (pDNS, CT logs, cached WHOIS) first; touch the infrastructure only from managed-attribution environments when the value justifies possible exposure',
          'Scan it aggressively to gather data before it disappears',
          'Upload all related samples to public sandboxes first',
        ],
        answer: 1,
        explain:
          'Passive first, active last and unattributable. Active contact and targeted public uploads can reveal your investigation to the actor.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 's3m5',
    sectionId: 's3',
    title: 'IOCs, STIX/TAXII y YARA',
    minutes: 13,
    objectives: [
      'Gestionar el ciclo de vida de los indicadores con contexto',
      'Diferenciar STIX (lenguaje) de TAXII (transporte)',
      'Leer y razonar la anatomía de una regla YARA',
    ],
    blocks: [
      {
        t: 'p',
        md: 'Un **IOC (Indicator of Compromise)** es un dato observable asociado a actividad maliciosa: hash, dominio, IP, ruta, mutex, patrón. Un IOC **sin contexto** (¿de qué actor? ¿qué fase? ¿desde cuándo? ¿qué confianza?) es casi ruido: no sabes qué hacer cuando dispara.',
      },
      {
        t: 'p',
        md: 'Los indicadores tienen **ciclo de vida**: se crean (de un incidente o informe), se despliegan (bloqueo/detección), **envejecen** (la infraestructura se recicla, los hashes mueren) y se **retiran**. Desplegar sin retirar produce blocklists de 500k entradas que bloquean clínicas y colegios que heredaron IPs viejas.',
      },
      { t: 'h', text: 'STIX y TAXII' },
      {
        t: 'p',
        md: '**STIX (Structured Threat Information eXpression)** es el **lenguaje**: objetos JSON estandarizados — `indicator`, `malware`, `threat-actor`, `campaign`, `attack-pattern`, `relationship`… — que expresan inteligencia **con contexto y relaciones**. **TAXII** es el **protocolo de transporte** para intercambiar contenido STIX (collections, channels). Memoriza: *STIX describe, TAXII transporta*.',
      },
      {
        t: 'callout',
        kind: 'example',
        md: 'En STIX: un objeto `indicator` (patrón del dominio C2) se conecta vía `relationship` («indicates») con un objeto `malware` (el loader), que se conecta («used-by») con un `intrusion-set` (VELVET CICADA). El contexto viaja con el dato.',
      },
      { t: 'h', text: 'Un indicador que llega: ¿ingerir?' },
      {
        t: 'p',
        md: 'Cambia de sombrero: aquí no publicas inteligencia, la **recibes**. Un ISAC aeroespacial empuja este objeto STIX 2.1 a tu TIP. Antes de meterlo en producción (bloqueo, hunting), decides si es apto — y ese juicio se lee en sus metadatos:',
      },
      {
        t: 'code',
        lang: 'json',
        title: 'Indicador STIX 2.1 entrante desde un ISAC (ficticio)',
        text: `{
  "type": "indicator",
  "spec_version": "2.1",
  "id": "indicator--7c1e0a44-2b9f-4d18-a6e3-meridian0052",
  "created": "2026-03-11T08:00:00Z",
  "created_by_ref": "identity--aero-isac-share-0001",
  "name": "GLASS VIPER phishing domain",
  "pattern_type": "stix",
  "pattern": "[domain-name:value = 'cdn-sync-status.example']",
  "valid_from": "2026-03-11T00:00:00Z",
  "valid_until": "2026-06-25T00:00:00Z",
  "confidence": 70,
  "object_marking_refs": ["marking-definition--tlp-amber-strict"]
}`,
      },
      {
        t: 'p',
        md: 'La decisión de ingesta se apoya en tres campos que un IOC pelado no trae. **`valid_until`** (2026-06-25) ya pasó respecto a hoy (2026-07-02): el emisor considera el indicador **caducado**, así que un bloqueo en vivo probablemente golpee a quien herede ese dominio, no al actor — pero sí sirve para un **retro-hunt** en tus logs. **`confidence`** (70) y **`created_by_ref`** (quién lo afirma) modulan cuánto peso le das y a qué cola lo enrutas. **`object_marking_refs`** (TLP:AMBER+STRICT) dicta con quién puedes compartirlo. Y antes de nada: **dedup** contra tu tracking — este dominio ya lo tienes de tu propio incidente. Un indicador sin estos metadatos de ciclo de vida no es un regalo: es **deuda** que tu SOC paga en falsos positivos. Recuerda el reparto: **STIX describe** (este objeto), **TAXII transporta** (el TIP hizo *pull* de una *collection* del ISAC).',
      },
      {
        t: 'check',
        q: {
          q: 'The incoming indicator\'s valid_until (2026-06-25) is already in the past. The BEST action is:',
          choices: [
            'Push it to live blocklists anyway — an indicator is an indicator',
            'Use it for a retrospective hunt over historical logs, not a live block, unless you re-validate the domain is still actor-controlled',
            'Delete it and ignore the source',
            'Extend valid_until yourself to next year',
          ],
          answer: 1,
          explain:
            'An expired indicator is best for retro-hunting; live-blocking a recycled domain harms whoever inherited it. Re-validate before reactivating — never silently extend someone else\'s expiry.',
        },
      },
      {
        t: 'check',
        q: {
          q: 'Your TIP polled a collection on the ISAC server to obtain this object. The polling/transport is provided by ___ and the object\'s structure by ___.',
          choices: [
            'STIX ; TAXII',
            'TAXII ; STIX',
            'TLP ; STIX',
            'YARA ; TAXII',
          ],
          answer: 1,
          explain:
            'TAXII is the transport (collections/channels the TIP pulls from); STIX is the language describing the indicator and its context. STIX describes, TAXII transports.',
        },
      },
      { t: 'h', text: 'YARA en 60 segundos' },
      {
        t: 'p',
        md: '**YARA** describe ficheros (y memoria) mediante patrones. Anatomía: bloque `meta` (documentación), bloque `strings` (texto, hex, regex) y bloque `condition` (lógica booleana: `2 of them`, `all of them`, tamaños, offsets).',
      },
      {
        t: 'callout',
        kind: 'tip',
        title: 'El arte de la condición',
        md: 'Una regla con un solo string es frágil (el actor lo cambia) o peligrosa (matchea software legítimo). Las buenas reglas exigen **combinaciones**: `2 of ($a,$b,$c)` con strings raros e independientes entre sí. Diseñarás esto en el **Lab 3B: YARA Forge** contra muestras con trampas de falso positivo.',
      },
      {
        t: 'check',
        q: {
          q: 'Which statement is correct?',
          choices: [
            'TAXII is the language; STIX is the transport',
            'STIX is the language for expressing threat information; TAXII is the protocol for exchanging it',
            'STIX only carries file hashes',
            'TAXII replaces the need for TLP',
          ],
          answer: 1,
          explain:
            'STIX describes (objects + relationships); TAXII transports (collections/channels).',
        },
      },
      {
        t: 'check',
        q: {
          q: 'A YARA rule with condition "any of them" over three strings, one of which is "Mozilla/5.0", risks:',
          choices: [
            'Missing all malware variants',
            'False positives on benign files containing the common string',
            'Breaking the TAXII server',
            'Nothing — more matches is better',
          ],
          answer: 1,
          explain:
            'Common strings + permissive conditions = false positives. Require combinations of rare, independent strings.',
        },
      },
    ],
    quiz: [
      {
        id: 's3m5q1',
        domain: 'Collection',
        prompt: 'What turns a bare indicator into a USEFUL indicator?',
        choices: [
          'Uploading it to more feeds',
          'Context: associated actor/campaign, kill chain phase, first/last seen, confidence',
          'Converting it to uppercase',
          'Hashing it',
        ],
        answer: 1,
        explain:
          'Context tells responders what a hit means and what to do. Contextless IOCs generate unactionable alerts.',
      },
      {
        id: 's3m5q2',
        domain: 'Collection',
        prompt: 'In STIX, relationships between objects (e.g., indicator "indicates" malware) exist so that:',
        choices: [
          'Files compress better',
          'Context and analytic links travel with the data instead of being lost in flat lists',
          'TAXII servers can bill per relationship',
          'Indicators expire automatically',
        ],
        answer: 1,
        explain:
          'STIX\'s graph of objects+relationships preserves the analytic context flat IOC lists destroy.',
      },
      {
        id: 's3m5q3',
        domain: 'Collection',
        prompt: 'Why must indicator lifecycles include RETIREMENT?',
        choices: [
          'Storage is expensive',
          'Infrastructure is recycled and hashes die; stale indicators cause false positives against innocent current owners',
          'Regulations require deletion after 7 days',
          'Retired indicators become YARA rules',
        ],
        answer: 1,
        explain:
          'IPs/domains change hands. Aging without retirement turns blocklists into collateral-damage generators.',
      },
      {
        id: 's3m5q4',
        domain: 'Collection',
        prompt: 'The three sections of a typical YARA rule are:',
        choices: [
          'header, body, footer',
          'meta, strings, condition',
          'import, export, main',
          'tactic, technique, procedure',
        ],
        answer: 1,
        explain:
          'meta documents, strings define patterns, condition sets the boolean logic for a match.',
      },
      {
        id: 's3m5q5',
        domain: 'Collection',
        prompt:
          'Which YARA condition is MOST robust for detecting a malware family while avoiding false positives?',
        choices: [
          'any of them — with three strings including common library names',
          '2 of ($rare1,$rare2,$rare3) — requiring two of three rare, independent artifacts',
          'filesize > 0',
          'all of them — with ten strings including the C2 domain only',
        ],
        answer: 1,
        explain:
          'Requiring combinations of rare independent strings balances variant coverage against false positives. "All of" ten strings breaks on any variant change.',
      },
      {
        id: 's3m5q6',
        domain: 'Collection',
        prompt: 'A TAXII "collection" is:',
        choices: [
          'A YARA ruleset',
          'A logical repository of STIX content that clients can poll/query from a server',
          'A list of TLP markings',
          'A sandbox feature',
        ],
        answer: 1,
        explain:
          'TAXII organizes STIX content into collections (request/response) and channels (publish/subscribe) for exchange.',
      },
      {
        id: 's3m5q7',
        domain: 'Collection',
        prompt:
          'Which incoming item is READY for ingestion, and what is the hidden cost of the other?',
        choices: [
          'A bare SHA-256 with no context is ready; the STIX indicator is too heavy',
          'A STIX indicator with pattern, valid_until, confidence and a source is ready; the bare hash costs SOC time to contextualize and expire manually',
          'Both are equally ready',
          'Neither can be ingested without YARA',
        ],
        answer: 1,
        explain:
          'Lifecycle metadata (context, TTL, source) is what makes an indicator ingestion-ready. A context-free hash becomes technical debt — someone must chase down what it means and when to retire it.',
      },
      {
        id: 's3m5q8',
        domain: 'Collection',
        prompt:
          'A partner indicator\'s valid_until expired, but your incident shows the domain is STILL beaconing today. You should:',
        choices: [
          'Trust the expiry and drop the indicator',
          'Re-validate against your own evidence and, since it is confirmed active, keep/extend it in YOUR tracking with fresh dates',
          'Do nothing — the partner owns the indicator',
          'Block every domain the partner ever shared',
        ],
        answer: 1,
        explain:
          'Expiry is the issuer\'s judgment, not ground truth. Your live evidence overrides it: re-validate and maintain the indicator in your own lifecycle rather than blindly dropping an active threat.',
      },
      {
        id: 's3m5q9',
        domain: 'Collection',
        prompt:
          'The partner feed and your internal telemetry both carry update-svc-cdn.com. Correct handling on ingestion is:',
        choices: [
          'Store both as separate indicators',
          'Deduplicate/merge into one tracked indicator, preserving the highest-confidence context and both source references',
          'Discard the internal one because the partner is authoritative',
          'Discard the partner one because internal is authoritative',
        ],
        answer: 1,
        explain:
          'Dedup against existing tracking prevents double-counting and conflicting expiries. Merge into a single record, keep both provenances, and carry the strongest context.',
      },
      {
        id: 's3m5q10',
        domain: 'Collection',
        prompt:
          'At ingestion, which STIX construct answers "whose activity is this indicator part of?"',
        choices: [
          'The pattern field',
          'A relationship object linking the indicator to a malware/intrusion-set',
          'The valid_from timestamp',
          'The TLP marking',
        ],
        answer: 1,
        explain:
          'Relationships carry the context: indicator → indicates → malware → used-by → intrusion-set. That is how attribution/ownership travels with the ingested data, beyond the raw pattern.',
      },
    ],
  },
];
