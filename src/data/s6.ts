import type { Module } from '../lib/types';

export const S6_MODULES: Module[] = [
  {
    id: 's6m1',
    sectionId: 's6',
    title: 'El examen GCTI: formato y estrategia',
    minutes: 13,
    objectives: [
      'Conocer el formato del examen GCTI',
      'Desmontar la anatomía de una pregunta GIAC',
      'Detectar los qualifiers que cambian la respuesta correcta',
      'Planificar la estrategia open-book',
      'Gestionar el tiempo y las preguntas difíciles',
    ],
    blocks: [
      {
        t: 'p',
        md: 'El **GIAC Cyber Threat Intelligence (GCTI)** es el certificado asociado a FOR578. Datos clave del formato (verifica siempre los vigentes en `giac.org`, pueden cambiar): examen **proctored** de unas **75 preguntas** tipo test en **2 horas**, con nota de corte histórica en torno al **71%**.',
      },
      {
        t: 'callout',
        kind: 'tip',
        title: 'La regla de oro GIAC',
        md: 'Los exámenes GIAC son **open-book**: puedes llevar material impreso (libros, notas, tu **índice**). No se permiten dispositivos electrónicos. El examen está diseñado para que *no dé tiempo* a buscar cada pregunta: el índice rescata las dudas, no sustituye al estudio.',
      },
      {
        t: 'list',
        items: [
          '**Practice tests**: GIAC incluye intentos de práctica oficiales con el voucher — son la mejor radiografía del examen real. Hazlos *con tu índice*, simulando condiciones.',
          '**Ritmo**: ~96 segundos por pregunta. Marca y salta lo que te atasque; vuelve al final.',
          '**Lectura quirúrgica**: las preguntas GIAC premian distinguir el matiz («BEST», «FIRST», «MOST likely», «PRIMARY»). Dos respuestas serán defendibles; una es *mejor*.',
          '**Eliminación**: descarta 2 distractores rápido; decide entre las 2 restantes con la lógica del curso (¿qué diría el framework?).',
        ],
      },
      { t: 'h', text: 'Anatomía de una pregunta' },
      {
        t: 'p',
        md: 'Las preguntas de certificación tipo GIAC tienen una estructura estable: un **escenario** (contexto, a veces con detalles irrelevantes a propósito), la **pregunta real** (una sola frase, normalmente con un qualifier), y 4 opciones donde **dos suelen ser defendibles**. Desmonta una — original de esta app, anotada:',
      },
      {
        t: 'code',
        lang: 'text',
        title: 'Pregunta de práctica anotada (original de la app)',
        text: `SCENARIO (read once, fast — flag the facts):
  Your SOC blocked a phishing domain this morning. A peer
  organization reported the same custom loader — identical
  unique PDB path — last month, using a DIFFERENT domain.

QUESTION (read twice — find the qualifier):
  Which conclusion does the evidence BEST support?

OPTIONS:
  A. The two intrusions are unrelated
       -> contradicts the strong link (shared rare artifact)
  B. The same activity group is likely behind both
       -> fits: rare, costly-to-change development artifact
  C. A nation-state sponsored both intrusions
       -> overreach: grouping is NOT sponsor attribution
  D. The peer's report must be wrong
       -> no basis in the scenario

THE TRAP: C feels bigger and smarter than B. But the
evidence supports grouping, not attribution. GIAC-style
questions live exactly on that edge: the correct answer
is the one the evidence ACTUALLY supports — no more.`,
      },
      {
        t: 'p',
        md: 'El método, en orden: (1) lee el escenario una vez y quédate con los **hechos**; (2) lee la pregunta **dos veces** y subraya mentalmente el qualifier; (3) elimina las 2 opciones rotas; (4) entre las 2 defendibles, pregunta «¿cuál responde *exactamente* lo que piden, sin ir más allá de la evidencia?». La opción que *suena* más sofisticada suele ser el distractor de los que saben a medias.',
      },
      {
        t: 'table',
        headers: ['Qualifier', 'Qué exige', 'Error típico'],
        rows: [
          ['**MOST likely**', 'La opción más probable, no la única posible', 'Elegir algo posible pero raro'],
          ['**BEST**', 'Hay 2+ defendibles; gana la más completa y directa al framework', 'Quedarte con la primera defendible que ves'],
          ['**FIRST / NEXT**', 'Orden del proceso (ciclo, kill chain, IR)', 'Elegir una acción correcta… fuera de orden'],
          ['**EXCEPT / NOT**', 'Lógica invertida: tres verdaderas, una falsa', 'Responder como si fuera pregunta normal'],
          ['**PRIMARY / MAIN**', 'El propósito central, no un beneficio colateral', 'Elegir un efecto secundario real pero no central'],
        ],
      },
      {
        t: 'check',
        q: {
          q: 'A question asks for the FIRST step after receiving a brand-new intelligence requirement. Two options describe valid activities: "begin collecting from relevant sources" and "define what specific questions must be answered and plan the effort". You should choose:',
          choices: [
            'Collecting — intelligence needs data',
            'Planning/direction — FIRST asks for process order, and the lifecycle starts there, even though both activities are valid',
            'Either one — both are correct',
            'Neither — escalate to management',
          ],
          answer: 1,
          explain:
            'FIRST/NEXT questions test sequence, not validity. A correct-but-out-of-order action is the designed trap.',
        },
      },
      {
        t: 'check',
        q: {
          q: 'All of the following are strong grouping links EXCEPT:',
          choices: [
            'A unique PDB path shared by two loaders',
            'The same self-signed TLS certificate across C2 servers',
            'Both intrusions used a popular commercial post-exploitation framework',
            'C2 domains registered with an identical, unusual registrant pattern',
          ],
          answer: 2,
          explain:
            'EXCEPT inverts the logic: three are rare, costly-to-change links; commodity tooling is shared by hundreds of unrelated actors.',
        },
      },
      {
        t: 'table',
        headers: ['Dominio del curso', 'Sección aquí', 'Peso típico de estudio'],
        rows: [
          ['Requirements y fundamentos', 'S1', 'Alto — vocabulario base'],
          ['Intrusion analysis (Kill Chain, Diamond, ATT&CK)', 'S2', 'Muy alto — corazón del examen'],
          ['Collection sources', 'S3', 'Alto'],
          ['Analysis (sesgos, ACH, clustering, atribución)', 'S4', 'Muy alto'],
          ['Dissemination (estimativo, TLP, casos)', 'S5', 'Alto'],
        ],
      },
      {
        t: 'p',
        md: 'Tu plan en esta app: completa las 5 secciones (lecciones + labs), derrota a los 5 bosses (≥80% simula el listón con margen), mantén las flashcards al día y cierra con **exámenes de práctica** completos hasta superar el 85% de forma estable.',
      },
      {
        t: 'check',
        q: {
          q: 'You have spent 3 minutes on question 12 of 75 and remain stuck between two defensible options. The best move is:',
          choices: [
            'Stay until you resolve it — early questions matter more',
            'Mark it, pick your current best guess, move on, and return with fresh eyes and remaining time at the end',
            'Skip it without answering and never return',
            'Spend up to 10 minutes — accuracy beats pace',
          ],
          answer: 1,
          explain:
            'At ~96 seconds per question, a 3-minute stall already borrowed from other questions. Mark-and-return protects the pace; a provisional answer protects against running out of time.',
        },
      },
      {
        t: 'callout',
        kind: 'warn',
        md: 'Esta app es material **no oficial** e independiente: refuerza los mismos temas públicos del temario, pero no reproduce contenido de SANS/GIAC. Úsala junto a tus materiales oficiales del curso si los tienes.',
      },
    ],
    quiz: [],
  },
  {
    id: 's6m2',
    sectionId: 's6',
    title: 'Construye tu índice open-book',
    minutes: 14,
    objectives: [
      'Construir un índice eficaz para el examen',
      'Saber qué entra en el índice (hechos) y qué no (juicios)',
      'Cubrir los imprescindibles del temario GCTI',
      'Usar el glosario de la app como semilla del índice',
      'Ensayar con el índice en condiciones reales',
    ],
    blocks: [
      {
        t: 'p',
        md: 'El **índice** es la herramienta open-book por excelencia: una tabla alfabética de términos → ubicación (libro/página) → micronota. Su objetivo no es enseñarte, es **ahorrarte 60 segundos** cuando dudas entre dos respuestas.',
      },
      {
        t: 'list',
        ordered: true,
        items: [
          '**Pasada 1 — términos**: mientras estudias, anota cada término examinable (kill chain phase, TLP marking, ICD 203 band, bias…) con dónde vive.',
          '**Pasada 2 — consolida**: ordena alfabéticamente; añade una micronota de 1 línea que a menudo evita abrir el libro («very likely = 80–95%»).',
          '**Pasada 3 — colorea**: un color por sección/libro acelera la localización física.',
          '**Imprime y encuaderna**: hojas sueltas = desastre en mesa de examen.',
        ],
      },
      {
        t: 'callout',
        kind: 'tip',
        title: 'Tu semilla está aquí',
        md: 'El **Glosario** de esta app (todos los términos del curso con definición breve, agrupados por sección) está pensado como semilla de índice: imprímelo desde la propia página (botón *Imprimir índice*) y complétalo con referencias a tus materiales oficiales.',
      },
      { t: 'h', text: 'Una página de índice real' },
      {
        t: 'p',
        md: 'Así se ve una página terminada. Fíjate en los detalles que la hacen rápida: orden alfabético estricto, micronota que **responde sin abrir nada**, y columna de ubicación con referencia doble (lección de la app + tu libro oficial si lo tienes):',
      },
      {
        t: 'code',
        lang: 'text',
        title: 'Página de índice — sección Analysis (ejemplo)',
        text: `INDEX — page 7 of 12              [TAB: ANALYSIS = yellow]

TERM                    NOTE (answers w/o opening)   WHERE
---------------------------------------------------------
ACH                     winner = LEAST inconsistent  S4M3 / B4*
ACH: diagnosticity      evidence that discriminates  S4M3
                        between hypotheses
Anchoring bias          first number sticks;         S4M1
                        counter = fresh-eyes review
attributed-to (STIX)    campaign -> intrusion-set,   S4M5
                        carries confidence
Attribution levels      machine / operator /         S4M5
                        sponsor — new evidence TYPE
                        per step up
Mirror imaging          assuming adversary thinks    S4M1
                        like you
---------------------------------------------------------
* B4 = your official course book + page, if you have one`,
      },
      {
        t: 'p',
        md: 'La prueba de calidad de una micronota: ¿responde la pregunta del examen **sin abrir el libro**? «ACH → gana la menos inconsistente» decide una pregunta entera en 5 segundos. «ACH → ver página 12» no decide nada — solo añade un viaje. Si la micronota necesita más de una línea, probablemente estás indexando un *juicio*, no un *hecho* (y los juicios no van en el índice).',
      },
      {
        t: 'check',
        q: {
          q: 'Which index entry is BUILT CORRECTLY for exam use?',
          choices: [
            '"ICD 203 — see book 5"',
            '"very likely (ICD 203) = 80–95% — S5M2 / B5"',
            '"Estimative language — important topic, review carefully"',
            '"ICD 203 — probability stuff"',
          ],
          answer: 1,
          explain:
            'A good entry answers the question in place: term, the fact itself, and a dual location as backup. Pointers without content cost you the trip they were meant to save.',
        },
      },
      {
        t: 'table',
        headers: ['Término', 'Micronota', 'Dónde'],
        rows: [
          ['Diamond Model', '4 vértices: Adversary, Capability, Infrastructure, Victim', 'S2M3'],
          ['TLP:AMBER+STRICT', 'Solo tu organización, sin clientes', 'S3M4'],
          ['"likely" (ICD 203)', '55–80%', 'S5M2'],
          ['ACH', 'Gana la hipótesis MENOS inconsistente', 'S4M3'],
          ['Pyramid of Pain (cima)', 'TTPs > tools > artifacts > domains > IPs > hashes', 'S2M5'],
        ],
      },
      { t: 'h', text: 'Los imprescindibles del índice GCTI' },
      {
        t: 'p',
        md: 'Construye el índice **mientras estudias** (las pasadas 1 y 2 *son* estudio: obligan a decidir qué importa), no la víspera. Y asegúrate de que estas entradas existen — son los hechos localizables que más se consultan bajo presión:',
      },
      {
        t: 'list',
        items: [
          'Las **7 bandas ICD 203** con sus porcentajes exactos (S5M2)',
          'Las **7 fases de la Kill Chain** en orden, con qué se observa en cada una (S2M1)',
          'Los **4 vértices del Diamond** + meta-features y los dos ejes (S2M3)',
          'La matriz **Courses of Action** completa: las 7 acciones por fase (S2M2)',
          'Las **5 marcas TLP 2.0** y a quién permite redistribuir cada una (S3M4)',
          'Los **niveles de atribución** y qué tipo de evidencia desbloquea cada uno (S4M5)',
          'Los **tipos de hash** (MD5/SHA-256, imphash, fuzzy/ssdeep) y qué pivote permite cada uno (S3M2)',
          '**F3EAD** y las 6 fases del ciclo de inteligencia, con su mapeo (S1M4)',
          'La lista de **sesgos cognitivos** con su contramedida de una línea (S4M1)',
          'La **Pyramid of Pain** completa, de hashes a TTPs (S2M5)',
        ],
      },
      {
        t: 'check',
        q: {
          q: 'Why should the index be built DURING study (passes 1–2) rather than the week before the exam?',
          choices: [
            'Printing takes a week',
            'Deciding what deserves an entry and compressing it into a one-line note IS active study — and rushed last-minute indexes are unfamiliar exactly when speed matters',
            'GIAC requires proof of early indexing',
            'Index pages expire',
          ],
          answer: 1,
          explain:
            'The act of indexing forces prioritization and synthesis. An index you built is a map of your own memory; one you rushed is a stranger\'s.',
        },
      },
      {
        t: 'p',
        md: 'Ensaya **con** el índice: en tus exámenes de práctica (aquí y en los oficiales de GIAC), practica el gesto completo — duda → índice → localizar → decidir — hasta que cueste segundos. El día del examen, el índice debe sentirse como una extensión de tu memoria, no como un mapa nuevo.',
      },
      {
        t: 'check',
        q: {
          q: 'Which question type will your index NOT answer, no matter how good it is?',
          choices: [
            '"Which ICD 203 band corresponds to very unlikely?"',
            '"In which kill chain phase does weaponization occur?"',
            '"Which response BEST balances timeliness and completeness in this scenario?" — judgment questions are won by training, not lookup',
            '"What does TLP:GREEN permit?"',
          ],
          answer: 2,
          explain:
            'Indexes retrieve facts: bands, orders, definitions. BEST/MOST-likely judgment calls come from the hundreds of practice questions you have already fought through.',
        },
      },
      {
        t: 'callout',
        kind: 'exam',
        title: 'Último consejo',
        md: 'El índice rescata **hechos** (bandas, definiciones, órdenes de fases). Los **juicios** (BEST/MOST likely) salen del entrenamiento — de los cientos de preguntas que ya habrás batallado aquí con apuestas de confianza. Confía en tu calibración.',
      },
    ],
    quiz: [],
  },
];
