import type { Module } from '../../lib/types';

export const SP7M1: Module = {
  id: 'sp7m1',
  sectionId: 'sp7',
  title: 'De 701 a 801: el mapa',
  minutes: 12,
  objectives: [
    'Situar el SY0-801 respecto al SY0-701: fechas previstas, formato y retirada del examen actual',
    'Comparar los pesos de los cinco dominios entre ambas versiones (16%, 24%, 19%, 27% y 14%)',
    'Reconocer qué temas del 701 cambian de dominio en el borrador del 801',
    'Identificar las áreas realmente nuevas: IA, vectores e indicadores, código e identidad, arquitectura y datos, operaciones y gobierno',
    'Entender por qué un tema que el 801 no nombra sigue contando en el SY0-701',
    'Decidir cómo estudiar si te presentas al 701 y qué hacer con esta sección',
  ],
  blocks: [
    {
      t: 'callout',
      kind: 'warn',
      title: 'Fuera del SY0-701 · novedad del SY0-801',
      md: 'Esta lección es **material complementario y opcional**. El SY0-801 (Security+ V8) tiene prevista su salida **«on or around November 17, 2026»**, es decir, el 17 de noviembre de 2026 o alrededor, y lo que sigue se apoya en un **borrador previo al lanzamiento**: el documento de objetivos v2.0, que CompTIA puede cambiar antes o después de esa fecha. Nada de esto forma parte del SY0-701. Leerla cuenta como cualquier lección (XP y progreso normales), pero sus comprobaciones son opcionales, no dan XP y nada de lo que contiene entra en los bancos de preguntas, los jefes, el simulacro ni el examen de nivel. Contrasta siempre con `comptia.org`. Material no oficial, sin afiliación con CompTIA.',
    },
    {
      t: 'p',
      md: 'Cada pocos años CompTIA renueva Security+. La versión que estudias en esta app es la **SY0-701**; la siguiente, la **SY0-801**, conserva el esqueleto de **cinco dominios** y casi todo el vocabulario, pero reparte el peso de otra forma, mueve piezas de un dominio a otro e incorpora temas nuevos, sobre todo **inteligencia artificial**. Esta lección es un mapa: te dice qué cambia y dónde mirar, sin entrar todavía en el detalle (eso lo hacen las seis lecciones siguientes de la sección).',
    },
    { t: 'h', text: 'Calendario y formato' },
    {
      t: 'list',
      items: [
        '**Lanzamiento del 801**: previsto «on or around November 17, 2026», es decir, el **17 de noviembre de 2026** o alrededor. Cuando se escribió esta lección, la página oficial todavía decía «coming soon».',
        '**Formato anunciado**: hasta 90 preguntas (test y performance-based), 90 minutos y 750 puntos sobre una escala de 100 a 900. Es el mismo formato que el 701.',
        '**Público objetivo**: administradores de seguridad con unos dos años de experiencia práctica.',
        '**Retirada del SY0-701**: el **11 de junio de 2027** en inglés y el **13 de agosto de 2027** en japonés, portugués, español y tailandés. Hasta entonces el 701 sigue siendo un examen válido y vigente.',
        '**Idioma**: al revisarla, la página del 801 solo listaba el inglés. Comprueba si habrá versión en español antes de planificar la fecha.',
      ],
    },
    { t: 'h', text: 'Los pesos, de 701 a 801' },
    {
      t: 'table',
      headers: ['Dominio', 'SY0-701', 'SY0-801 (borrador)', 'Cambio'],
      rows: [
        ['1 · General Security Concepts', '12%', '16%', '+4'],
        ['2 · Threats, Vulnerabilities, and Mitigations (701) / and Attacks (801)', '22%', '24%', '+2'],
        ['3 · Security Architecture', '18%', '19%', '+1'],
        ['4 · Security Operations', '28%', '27%', '-1'],
        ['5 · Security Program Management and Oversight', '20%', '14%', '-6'],
      ],
    },
    {
      t: 'p',
      md: 'Dos lecturas útiles. La primera: **gobierno, riesgo y cumplimiento (dominio 5) pierde seis puntos** y el dominio 1 gana cuatro, así que el examen se inclina hacia los conceptos y las amenazas. La segunda: **Operaciones sigue siendo el dominio más pesado** (27%), por lo que lo que ya has trabajado en la sección 4 conserva casi todo su valor. Y fíjate en el nombre del dominio 2: pasa de «Mitigations» a «Attacks», y en el borrador las técnicas de mitigación cuelgan del objetivo 4.1.',
    },
    { t: 'h', text: 'Lo que cambia de sitio' },
    {
      t: 'p',
      md: 'Muchos contenidos del 701 siguen existiendo en el borrador del 801, pero **colgando de otro objetivo**. Si solo miras el índice, parecerá que han desaparecido; no es así.',
    },
    {
      t: 'table',
      headers: ['Tema', 'Dónde lo estudias aquí (701)', 'Dónde aparece en el borrador del 801'],
      rows: [
        ['Gap analysis', '`sp1m2`', '5.5, entre los tipos de engagement de auditoría y evaluación'],
        ['CVSS, CVE y priorización', '`sp4m5`', '2.1, características de amenazas y vulnerabilidades'],
        ['RTO, RPO, MTTR y MTBF', '`sp5m4` y `sp3m7`', '3.4, resiliencia y recuperación'],
        ['Seguridad física: access vestibule y access badges (el borrador habla de lock and key, access vestibule y access passes)', '`sp1m4`', '2.3, como vector de amenaza (physical-based)'],
        ['Honeypot, honeynet, honeyfile y honeytoken (el borrador añade canary account)', '`sp1m4`', '4.1, controles de mitigación'],
        ['Técnicas de mitigación y hardening', '`sp2m8`', '4.1, que pasa a ser el objetivo central de mitigación'],
        ['Roles de datos: owner, custodian, steward y controller (el borrador añade data operator y data subprocessor)', '`sp5m2`', '3.3, protección de datos (controller vs. processor sigue también en el 5.4)'],
      ],
    },
    {
      t: 'callout',
      kind: 'tip',
      title: 'Lo que sigue igual',
      md: 'Los cimientos del dominio 1 se mantienen en el 1.1 del borrador: **defense in depth**, CIA, AAA, non-repudiation, **Zero Trust**, least privilege, y las categorías y tipos de control. Zero Trust, de hecho, aparece dos veces: como principio en el 1.1 y como arquitectura en el 3.2 (autenticación de usuario, gestión de dispositivos y control de acceso a aplicaciones). Todo lo que estudiaste en `sp1m1` y `sp1m3` es base común a ambos exámenes.',
    },
    { t: 'h', text: 'Lo que añade o refuerza el borrador' },
    {
      t: 'p',
      md: 'Estas son las áreas que el borrador añade o refuerza. Cada una tiene su lección en esta sección; aquí solo ves el mapa. Ojo: no todo lo que aparece es nuevo para ti. Algunos términos ya los enseña el curso del 701 y el borrador solo los vuelve a nombrar, a veces en otro objetivo; van marcados con «ya en el 701».',
    },
    {
      t: 'table',
      headers: ['Área', 'Lo que nombra el borrador', 'Objetivos'],
      rows: [
        [
          'Inteligencia artificial',
          'Un objetivo entero sobre riesgos de la IA (**model manipulation**, **poisoning**, **prompt injection**, **jailbreaking**, **hallucinations**, **bias**, **explainability**, **evasion**, **session hijacking**, **code execution**, **data loss**), los **LLMs** como superficie de ataque y la IA como herramienta de automatización (agentic, chatbot, predictive analysis, baselines asistidos por IA)',
          '2.4, 2.6, 4.6',
        ],
        [
          'Vectores e indicadores',
          '**Quishing**, **deepfake**, **RCS**, herramientas de colaboración, **living-off-the-land**, **log manipulation**, **session tokens**; también nombra impossible travel y concurrent sessions (ya en el 701, `sp2m6`)',
          '2.3, 2.5',
        ],
        [
          'Código, repositorios e identidad',
          '**Hardcoded secrets**, unsafe exception handling, repositorios y almacenamiento de objetos públicos, **secrets scanning**, **passkeys** como punto propio, cuentas de **emergency access**, **gMSA**, **privilege creep** (el permission creep de `sp4m8` con otro nombre), monitorización de credenciales comprometidas; también nombra malicious update y TOC/TOU (ya en el 701, `sp2m4`) y passwordless (ya en el 701, `sp4m8`)',
          '2.4, 4.1, 4.5, 3.2',
        ],
        [
          'Arquitectura y datos',
          '**Security Service Edge (SSE)**, mensajería con cifrado de extremo a extremo, **out-of-band management**, ciclo de vida del dato, **deidentification**, **data transpose**',
          '3.2, 3.3',
        ],
        [
          'Resiliencia',
          '**Autoscaling**, **immutability** de los backups y **restoration testing** como puntos propios (la idea de probar la restauración ya está en `sp3m7`); también nombra capacity planning (ya en el 701, `sp3m7`)',
          '3.4',
        ],
        [
          'Operaciones y gobierno',
          '**CSPM**, **IPAM**, **negotiation** y notificación externa en la respuesta a incidentes, **fail forward** en el change management, **MITRE ATT&CK**, Cyber Kill Chain y **Diamond Model** como fuentes de referencia de una auditoría y puntuación de riesgo por comportamiento del personal; también nombra el CAB (ya en `sp1m5`), los programas de bounty y responsible disclosure (ya en `sp4m4`) y el BEC, ahora como tema de formación (como ataque, ya en `sp2m3`)',
          '1.2, 4.3, 4.7, 5.5, 5.6',
        ],
      ],
    },
    {
      t: 'check',
      q: {
        optional: true,
        q: 'Comparing the SY0-701 weights with the SY0-801 draft, which domain loses the most weight?',
        choices: [
          'Security Operations, from 28% to 27%',
          'General Security Concepts, from 16% to 12%',
          'Security Program Management and Oversight, from 20% to 14%',
          'Security Architecture, from 19% to 18%',
        ],
        answer: 2,
        explain:
          'Program Management and Oversight drops six points (20% to 14%). Operations loses only one point, and General Security Concepts actually rises from 12% to 16%.',
      },
    },
    { t: 'h', text: 'Lo que el 801 no nombra sigue cayendo en el 701' },
    {
      t: 'p',
      md: 'Al comparar los dos listados verás temas del 701 que el borrador del 801 **no menciona**: por ejemplo la **containerización**, **ICS/SCADA**, los **RTOS**, los **embedded systems**, las redes definidas por software (**SDN**) o el control de acceso basado en atributos (**ABAC**). Cuidado con la conclusión apresurada. Hay dos razones para no descartarlos:',
    },
    {
      t: 'list',
      items: [
        'El propio documento aclara que **sus listas no son exhaustivas**: pueden aparecer otros ejemplos aunque no estén escritos.',
        'Y, sobre todo, **si te presentas al 701, tu examen no es el 801**. Mientras prepares el **SY0-701**, tus objetivos son los del 701, y ahí esos temas siguen contando con todo su peso. Que otro examen no los nombre no cambia el tuyo.',
      ],
    },
    {
      t: 'callout',
      kind: 'warn',
      title: 'No recortes tu 701 por lo que lees del 801',
      md: 'Tampoco hay que sacar la conclusión contraria: que un tema esté **ausente** de un listado no prueba que haya dejado de importar en la práctica. Fíjate además en que otros conceptos próximos sí se nombran en el borrador, como los vectores IoT y OT (operational technology) del 2.3 o la virtualización (2.4 y 3.4). El borrador cambia el énfasis, no vacía el temario del 701.',
    },
    {
      t: 'check',
      q: {
        optional: true,
        q: 'Your SY0-701 exam is next month. You notice that ICS/SCADA is not named in the SY0-801 draft objectives. What should you do?',
        choices: [
          'Keep studying it: it is part of the SY0-701 objectives and the 801 draft does not change your exam',
          'Drop it, because the new version no longer tests it',
          'Study only the topics that are new in the 801',
          'Wait for the 801 launch before deciding what to review',
        ],
        answer: 0,
        explain:
          'You are sitting the 701, so its objectives are what count. Topics missing from another exam\'s draft list are not removed from yours, and the draft itself says its lists are not exhaustive.',
      },
    },
    { t: 'h', text: 'Cómo estudiar si te presentas al 701' },
    {
      t: 'list',
      ordered: true,
      items: [
        '**Termina primero el 701.** Es el examen vigente y el que puedes hacer hasta junio o agosto de 2027, según el idioma. Las secciones S1 a S5, los simulacros y los bosses de esta app siguen siendo tu ruta principal.',
        '**No mezcles los dos temarios en el repaso.** Los temas nuevos del 801 pueden no aparecer en tu examen, y el tiempo que les dediques se lo quitas a los que sí aparecen.',
        '**Usa esta sección como lectura de actualización**, después de aprobar o en los huecos del plan. Sirve para conocer el rumbo del sector (IA, credenciales, nube) y para que un cambio de versión no te pille por sorpresa.',
        '**Si tu fecha cae cerca de la retirada**, revisa en `comptia.org` los plazos, el idioma disponible y las políticas de la certificación. Si decides pasar al 801, estudia con el documento de objetivos oficial, no solo con esta lección.',
        '**Aprovecha la superposición.** Una parte grande del 801 es el mismo vocabulario del 701 con otro orden. Todo lo que ya dominas ahorra tiempo cuando decidas migrar.',
      ],
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'Un caso para decidir',
      md: 'Una analista del puerto reserva el SY0-701 para dentro de tres meses. Lee que el 801 sale en noviembre y se plantea cambiar de plan. Su mejor decisión es **seguir con el 701**: la fecha está dentro del periodo de vigencia, sus simulacros ya miden lo que va a caer, y los temas nuevos los leerá después, sin presión. Si su fecha cayera después de la retirada, la respuesta sería otra.',
    },
    {
      t: 'check',
      q: {
        optional: true,
        q: 'This course teaches gap analysis among the general security concepts of the SY0-701. In the SY0-801 draft, under which kind of activity is it named?',
        choices: [
          'Vulnerability scanning',
          'Incident response preparation',
          'Risk register reviews',
          'Audit and assessment engagement types',
        ],
        answer: 3,
        explain:
          'The draft places gap analysis in objective 5.5, among the engagement types of audit and assessment activities. Moving between objectives is common between versions.',
      },
    },
    {
      t: 'p',
      md: 'Antes de la tarea breve, el mapa entero contado en cuatro minutos.',
    },
    {
      t: 'video',
      title: 'Del 701 al 801: lo que cambia de estante',
      youtube: 'uOraRdyoDWA',
      poster: 'videos/mapa-801-poster.png',
      transcript: 'videos/mapa-801-transcript.txt',
    },
    {
      t: 'callout',
      kind: 'tip',
      title: 'Tarea breve',
      md: 'Marca en tu plan del 701 los tres temas que más te cuestan; ninguno sale del plan aunque el borrador del 801 no lo nombre.',
    },
    {
      t: 'links',
      title: 'Complementa',
      items: [
        { label: 'El examen Security+: formato y estrategia', href: '/learn/sp6m1' },
        { label: 'CIA, non-repudiation, AAA y gap analysis', href: '/learn/sp1m2' },
        { label: 'Zero Trust: control plane y data plane', href: '/learn/sp1m3' },
        { label: 'Seguridad física y tecnologías de engaño', href: '/learn/sp1m4' },
        { label: 'Gestión de vulnerabilidades II: análisis, respuesta y validación', href: '/learn/sp4m5' },
        { label: 'Protección de datos: tipos, clasificaciones, estados y métodos', href: '/learn/sp3m6' },
        { label: 'Resiliencia y recuperación: HA, sitios, backups, pruebas y energía', href: '/learn/sp3m7' },
        { label: 'Estructuras de gobernanza, roles sobre los datos y factores externos', href: '/learn/sp5m2' },
        { label: 'Vulnerabilidades I: aplicaciones, web, sistema operativo, hardware y zero-day', href: '/learn/sp2m4' },
        { label: 'Malware e indicadores de actividad maliciosa', href: '/learn/sp2m6' },
        { label: 'IAM: identidades, federación, control de acceso, MFA y PAM', href: '/learn/sp4m8' },
      ],
    },
  ],
  quiz: [],
};
