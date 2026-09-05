import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// SP5M3 — Gestión de riesgos I: identificación, evaluación y análisis
// (SY0-701, objetivo 5.2)
// ---------------------------------------------------------------------------
const sp5m3: Module = {
  id: 'sp5m3',
  sectionId: 'sp5',
  title: 'Gestión de riesgos I: identificación, evaluación y análisis',
  minutes: 14,
  objectives: [
    'Ejecutar una **risk identification** completa: **assets**, **threats**, **vulnerabilities** y los controles que ya existen',
    'Elegir la cadencia de **risk assessment** que pide el escenario: **ad hoc**, **recurring**, **one-time** o **continuous**',
    'Comparar **qualitative** y **quantitative risk analysis** por entrada, salida, esfuerzo y credibilidad ante la dirección',
    'Calcular **SLE = AV × EF** y **ALE = SLE × ARO** sin confundir el **exposure factor** con el **ARO**',
    'Justificar económicamente un control comparando su coste anual con la **ALE** que elimina',
  ],
  blocks: [
    {
      t: 'p',
      md: 'La gobernanza te ha dado el marco: quién decide, qué documentos mandan y quién responde por cada dato. Ahora llega la pregunta que ese marco existe para responder, y es la que más veces aparece en el objetivo 5.2: **cuánto riesgo tiene la Autoridad Portuaria de Halden y qué se hace con él**. Gestionar riesgo es un ciclo de cuatro tiempos —**identificar**, **evaluar**, **analizar** y **responder**—, y esta lección cubre los tres primeros, incluida la única aritmética que Security+ te va a pedir de verdad. Conviene que la mires con cariño: las preguntas de cálculo son de las poquísimas del examen con una respuesta objetivamente correcta, así que valen oro si te sabes dos fórmulas y, sobre todo, si no confundes sus factores.',
    },
    { t: 'h', text: 'Identificación y evaluación: qué hay, qué lo amenaza y cada cuánto se mira' },
    {
      t: 'p',
      md: 'La **risk identification** es el inventario del problema y se hace en un orden que no es casual, porque cada paso depende del anterior. Primero los **assets**: sistemas, datos, procesos y personas, con su valor para el negocio; no puedes proteger —ni valorar— lo que no sabes que tienes, y por eso un inventario incompleto contamina todo lo que venga después. Segundo, las **threats**: quién o qué puede causar daño (ransomware, un empleado descontento, un temporal que inunda la planta baja, un fallo de suministro eléctrico); las amenazas existen aunque tú no hagas nada, porque no dependen de ti. Tercero, las **vulnerabilities**: la debilidad concreta que esa amenaza podría aprovechar —un sistema sin parche, un proceso sin doble validación, un único proveedor para una pieza crítica—; estas sí dependen de ti, y son la parte del riesgo sobre la que puedes actuar. Y cuarto, el paso que casi todo el mundo se salta: **los controles que ya están puestos**, porque el riesgo que importa no es el teórico, sino el que queda después de lo que ya tienes funcionando. De ahí salen las tres magnitudes que alimentan el análisis: la **probability** (la posibilidad estadística de que ocurra, expresada como porcentaje o frecuencia), la **likelihood** (la valoración más cualitativa de lo verosímil que resulta en tu contexto concreto) y el **impact** (lo que cuesta si ocurre: dinero, horas de parada, buques sin atracar, multas, reputación). Un riesgo bien escrito une las cuatro piezas en una frase: *el ransomware (amenaza) que cifra el servidor de planificación de grúas (activo) aprovechando una VPN sin MFA (vulnerabilidad) detendría la operativa del muelle norte durante días (impacto)*.',
    },
    {
      t: 'list',
      items: [
        '**Ad hoc** — se lanza porque ha pasado algo: un incidente en un puerto vecino, un proveedor nuevo, un aviso de la autoridad marítima. No estaba en el calendario; la dispara un evento.',
        '**Recurring** — está en el calendario y se repite igual: la revisión anual de riesgos del puerto, el repaso trimestral del registro. Su valor está en la **tendencia**, porque compara con la vez anterior.',
        '**One-time** — se hace una vez, para un fin acotado que no se va a repetir: evaluar la red de la terminal recién adquirida antes de integrarla. Cuando acaba el proyecto, la evaluación no vuelve.',
        '**Continuous** — automatizada y permanente: la puntuación de riesgo se recalcula sola en cuanto cambian los datos de vulnerabilidades, configuración o exposición. No es una foto con fecha, es una película.',
      ],
    },
    {
      t: 'check',
      q: {
        q: 'The Halden Port Authority deploys a platform that recalculates the risk score of every internet-facing asset whenever new vulnerability, configuration or exposure data arrives, instead of waiting for the annual review. Which assessment cadence is this?',
        choices: [
          'Recurring, because the scoring engine runs on a fixed schedule',
          'Ad hoc, because the platform reacts to new information as it appears',
          'Continuous, because the assessment is automated and permanently current rather than a snapshot taken on a given date',
          'One-time, because the platform was configured once and then left running',
        ],
        answer: 2,
        explain:
          'A continuous assessment keeps the risk picture aligned with an environment that changes daily, which is exactly what automating the recalculation buys you. Ad hoc is the tempting answer because both react to new information, but an ad hoc assessment is a one-off exercise that a person launches after a specific trigger, not a permanent automated process.',
      },
    },
    { t: 'h', text: 'Cualitativo o cuantitativo: dos formas de mirar el mismo riesgo' },
    {
      t: 'p',
      md: 'El **qualitative risk analysis** ordena los riesgos por categorías: probabilidad alta, media o baja; impacto crítico, alto, moderado o bajo; y el resultado se pinta en un **heat map** donde la esquina roja se lleva la atención. Es rápido, no necesita datos históricos y cualquiera lo entiende en una reunión, pero es **subjetivo**: «alto» no significa lo mismo para el jefe de operaciones que para la analista, y dos riesgos en la misma casilla roja pueden diferir en un orden de magnitud. El **quantitative risk analysis** hace lo contrario: pone euros. Necesita datos —valor del activo, frecuencia histórica, coste real de una parada— y a cambio produce cifras que se pueden **comparar con el precio de un control**, meter en un presupuesto y defender ante un consejo, un asegurador o un regulador. Cuesta mucho más tiempo y tiene su propio peligro, la **falsa precisión**: un ALE de 47.318 € calculado sobre estimaciones inventadas parece más serio que un «riesgo alto» y no lo es. En la práctica los dos se combinan, y ese es el reflejo que el examen premia: **cualitativo para cribar los cuarenta riesgos del puerto y cuantitativo para los cinco que van a costar dinero decidir**.',
    },
    {
      t: 'table',
      headers: ['Criterio', 'Qualitative', 'Quantitative'],
      rows: [
        [
          'Entrada que necesita',
          'Juicio experto y escalas ordinales (alto / medio / bajo)',
          'Datos duros: valor del activo, frecuencia histórica, coste de una parada',
        ],
        [
          'Salida que produce',
          'Una posición **relativa**: heat map, ranking, categorías',
          'Cifras en euros: **SLE**, **ALE**, coste-beneficio del control',
        ],
        [
          'Esfuerzo y velocidad',
          'Bajo: sale de un taller de una mañana con la gente adecuada',
          'Alto: hay que recopilar, validar y defender cada dato de entrada',
        ],
        [
          'Punto débil',
          'Subjetividad: «alto» no significa lo mismo para dos personas',
          '**Falsa precisión** si las estimaciones de partida son endebles',
        ],
        [
          'Cuándo usarlo',
          'Cribar muchos riesgos deprisa, o cuando no existen datos fiables',
          'Justificar una inversión ante la dirección, un seguro o un regulador',
        ],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'The port executive committee must choose between two competing security investments and wants each option expressed in euros, so that the cost of the control can be set against the loss it prevents. Five years of incident and downtime records are available. Which approach fits?',
        choices: [
          'Qualitative analysis, because a heat map communicates faster to non-technical executives',
          'Quantitative analysis, because monetary values allow the annual cost of each control to be compared directly with the expected annual loss it removes',
          'Qualitative analysis, because quantitative methods only apply to physical assets',
          'Neither, because the decision belongs to the insurer once a policy is in place',
        ],
        answer: 1,
        explain:
          'A funding decision between two options needs a common unit, and money is the only unit that lets the price of a control be weighed against the loss it avoids, which is precisely what quantitative analysis produces when historical data exists. The heat map is tempting because executives do read it faster, but a colour tells the committee which risk looks worse, never whether spending a given amount on it pays for itself.',
      },
    },
    { t: 'h', text: 'EF, SLE, ARO y ALE: la aritmética que sí cae' },
    {
      t: 'p',
      md: 'Cuatro términos y dos fórmulas encadenadas. El **asset value (AV)** es lo que vale el activo para la organización: no solo el precio de la factura, sino sustitución, datos, reconfiguración y negocio perdido. El **exposure factor (EF)** es el **porcentaje del valor del activo que se pierde en un único evento**: un EF de 0,25 significa que un evento destruye la cuarta parte del valor, no que ocurra una de cada cuatro veces. El **single loss expectancy (SLE)** es lo que cuesta **un** evento: **SLE = AV × EF**. El **annualized rate of occurrence (ARO)** es la **frecuencia anual esperada**: 2 es dos veces al año, 1 es una vez al año, 0,5 es una vez cada dos años y 0,25 una vez cada cuatro. Y el **annualized loss expectancy (ALE)** reparte ese golpe a lo largo del tiempo: **ALE = SLE × ARO**. La ALE es el número que de verdad usas, porque es **anual** y por eso se puede comparar directamente con el **coste anual de un control**: si el control cuesta menos que la ALE que elimina, está justificado en términos financieros; si cuesta más, hará falta otro argumento —una obligación legal, la seguridad de las personas, o que ese mismo control cubra además otros riesgos— para aprobarlo. Y un aviso honesto para el mundo real: la ALE es una estimación construida sobre estimaciones, así que su valor no está tanto en el decimal como en **obligar a la organización a escribir cuánto vale cada cosa y cada cuánto cree que va a pasar**.',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Análisis cuantitativo del riesgo R-014 — Autoridad Portuaria de Halden',
      text: `ANÁLISIS CUANTITATIVO DE RIESGO  ·  03-09-2026  ·  comité de riesgos del puerto
R-014: un ransomware cifra el servidor de planificación de grúas del muelle norte

  DATOS DE ENTRADA
    Asset value (AV)             400.000 EUR   servidor + licencias + datos operativos
    Exposure factor (EF)         0,25          se pierde el 25 % del valor en UN evento
    Annualized rate of occurrence (ARO)  0,50  se espera 1 vez cada 2 años

  CÁLCULO
    SLE = AV  x EF   =  400.000 x 0,25  =  100.000 EUR   coste de UN evento
    ALE = SLE x ARO  =  100.000 x 0,50  =   50.000 EUR   coste ESPERADO por año

  DECISIÓN DE CONTROL
    Backup inmutable + EDR gestionado        20.000 EUR / año
    ALE que elimina (estimación)             50.000 EUR / año
    Beneficio neto esperado          50.000 - 20.000  =  30.000 EUR / año
    >> JUSTIFICADO: el coste anual del control es MENOR que la pérdida anual
       esperada que evita.

  CONTRAEJEMPLO CON EL MISMO RIESGO
    Reconstrucción en alta disponibilidad    90.000 EUR / año
    >> NO JUSTIFICADO solo con estos números: 90.000 > 50.000. Solo se aprueba
       si aporta valor fuera del cálculo (exigencia regulatoria, seguridad de
       las maniobras, o cubre además otros riesgos del registro).

  LOS TRES ERRORES QUE EL EXAMEN CASTIGA
    1. Dar 400.000 como SLE: eso es el valor del activo, no la pérdida por evento.
    2. Invertir la fórmula (dividir por el ARO): ALE = SLE x ARO, siempre.
    3. Leer ARO 0,5 como «dos veces al año»: es una vez cada dos años.`,
    },
    {
      t: 'check',
      q: {
        q: 'A fire in the port records office would destroy an estimated 60% of a document archive valued at €150,000, and such a fire is expected about once every ten years. What is the SLE?',
        choices: [
          '€150,000, the full value of the archive',
          '€9,000, which is what the risk costs in an average year',
          '€15,000',
          '€90,000',
        ],
        answer: 3,
        explain:
          'The single loss expectancy is asset value multiplied by exposure factor, so €150,000 × 0.60 = €90,000 is what one fire costs. The €9,000 figure is the annualized loss expectancy (€90,000 × an ARO of 0.1) and answers a different question, namely what the risk costs per year on average rather than what a single event costs.',
      },
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen: EF es porcentaje, ARO es frecuencia y la ALE es la que decide',
      md: '**Uno: no intercambies los factores.** El **exposure factor** es el **porcentaje** del valor del activo que se pierde en **un** evento (0,25 = una cuarta parte del activo); el **ARO** es **cuántas veces al año** se espera el evento (0,5 = una vez cada dos años, jamás dos veces al año). Confundirlos es el error que más puntos cuesta. **Dos: las fórmulas van encadenadas y en este orden** — primero **SLE = AV × EF**, después **ALE = SLE × ARO**; y si el enunciado te da la ALE y pide el SLE, divides por el ARO. **Tres: el número que se compara con el precio de un control es la ALE**, porque los dos son anuales: un control de 20.000 € al año frente a una ALE de 50.000 € está justificado; ese mismo control frente a una ALE de 12.000 € no lo está solo con los números. **Cuatro: si te dan el valor del activo y te preguntan el SLE, la respuesta casi nunca es el valor del activo**, salvo que el EF sea del 100 % (pérdida total). **Cinco: un «riesgo alto» cualitativo no se puede comparar con el coste de nada**; para decidir inversión hace falta análisis **quantitative**.',
    },
    {
      t: 'check',
      q: {
        q: 'A quantitative analysis at the port gives an SLE of €30,000 for a berthing-system outage, with an ARO of 4. A managed service that would prevent the outage costs €95,000 per year. On the numbers alone, what should the analyst report?',
        choices: [
          'That the ALE is €7,500, so the service is far too expensive',
          'That the ALE is €120,000, so at €95,000 per year the service is financially justified',
          'That the ALE is €30,000, so the service costs more than the risk it removes',
          'That the ALE cannot be calculated without knowing the exposure factor',
        ],
        answer: 1,
        explain:
          'ALE = SLE × ARO, so €30,000 × 4 = €120,000 of expected loss per year, and a control that removes it for €95,000 leaves the port €25,000 a year better off. Reading the SLE as if it were the annual figure is the classic trap: €30,000 is the cost of one outage, and forgetting that it happens four times a year turns a profitable control into an apparent waste of money.',
      },
    },
    {
      t: 'p',
      md: 'Con esto ya sabes ponerle número a un riesgo, y eso es la mitad del objetivo 5.2. La otra mitad es que **un cálculo no es una decisión**: alguien tiene que escribir ese riesgo en algún sitio donde no se pierda, ponerle dueño, decidir cuánto está dispuesta la organización a asumir y elegir qué se hace con él. La siguiente lección cierra el objetivo por ese otro extremo —el **risk register** y sus **KRIs**, el **risk appetite** frente a la **risk tolerance**, las cuatro estrategias de respuesta (**mitigate**, **transfer**, **accept**, **avoid**), el **risk reporting** a la dirección— y termina traduciendo el riesgo a plazos concretos de recuperación con el **business impact analysis**: **RTO**, **RPO**, **MTTR** y **MTBF**.',
    },
  ],
  quiz: [
    {
      id: 'sp5m3q1',
      domain: 'Security Program Management & Oversight',
      prompt:
        'A risk analysis at the Halden Port Authority sets the SLE for a fuel-gantry control failure at €40,000, and maintenance history shows the failure occurs about three times a year. What is the ALE?',
      choices: ['€40,000', '€13,333', '€120,000', '€43,000'],
      answer: 2,
      explain:
        'The annualized loss expectancy is the single loss expectancy multiplied by the annualized rate of occurrence, so €40,000 × 3 = €120,000 is what the port should expect to lose in an average year. Answering €40,000 is the frequent mistake of reporting the cost of one event as though it were the annual figure, which understates this risk by a factor of three.',
    },
    {
      id: 'sp5m3q2',
      domain: 'Security Program Management & Oversight',
      prompt:
        'The harbour-master office equipment at the port is valued at €80,000, and a ground-floor flood is expected to destroy 30% of that value. What is the SLE for a flood?',
      choices: ['€24,000', '€80,000', '€56,000', '€2,400'],
      answer: 0,
      explain:
        'SLE = asset value × exposure factor, so €80,000 × 0.30 = €24,000 is the expected loss from one flood. Choosing €56,000 inverts the exposure factor and reports what would survive instead of what is lost, and the full €80,000 would only be correct if the exposure factor were 100%.',
    },
    {
      id: 'sp5m3q3',
      domain: 'Security Program Management & Oversight',
      prompt:
        'A risk register entry for the dredging control system records an ARO of 0.25. What does that value mean?',
      choices: [
        'A single occurrence would destroy 25% of the value of the system',
        'There is a 25% probability that the event would be detected in time',
        'The controls in place reduce the impact of the event by 25%',
        'The event is expected to occur roughly once every four years',
      ],
      answer: 3,
      explain:
        'The annualized rate of occurrence is a frequency, so 0.25 events per year works out as one event about every four years. Reading it as a percentage of the asset destroyed is the standard confusion with the exposure factor, which is the value that does express a proportion of asset value lost in one event.',
    },
    {
      id: 'sp5m3q4',
      domain: 'Security Program Management & Oversight',
      prompt:
        'The port container-scanning system is valued at €600,000, an exposure factor of 20% applies to a controller failure, and the ARO is 0.5. A vendor offers a resilience package for €75,000 per year that would remove the risk. What should the analyst report to the committee?',
      choices: [
        'That the package is justified, because the €120,000 expected loss exceeds its price',
        'That the package costs more than the €60,000 annual expected loss it removes, so on the numbers alone it is not justified and would need a non-financial argument',
        'That the package is justified, because eliminating a risk is always preferable to accepting it',
        'That the ALE is €300,000, so the package is clearly a bargain',
      ],
      answer: 1,
      explain:
        'SLE = €600,000 × 0.20 = €120,000 and ALE = €120,000 × 0.5 = €60,000, so paying €75,000 a year to remove €60,000 of expected annual loss destroys value unless something outside the calculation justifies it, such as a legal duty or personal safety. The first option is tempting because €120,000 really does come out of the analysis, but it is the cost of a single event, and the only figure comparable with an annual price is the ALE.',
    },
    {
      id: 'sp5m3q5',
      domain: 'Security Program Management & Oversight',
      prompt:
        'A new port director asks for a risk picture covering forty business processes within two weeks. There are no reliable figures for asset values or historical incident frequency, and the goal is to decide which processes deserve deeper study. Which approach fits best?',
      choices: [
        'Quantitative analysis, because monetary figures are always more defensible',
        'Quantitative analysis, substituting industry averages for the missing data',
        'Qualitative analysis, ranking the processes on ordinal scales so the few that matter can then be studied in depth',
        'No analysis at all until three years of incident data have been collected',
      ],
      answer: 2,
      explain:
        'Qualitative analysis exists for exactly this situation: it is fast, it runs on expert judgement rather than data, and it produces the ranking that tells you where the expensive quantitative effort is worth spending. Borrowing industry averages is the seductive alternative because it still yields euro figures, but it manufactures false precision and those numbers would not survive the first challenge from the committee.',
    },
    {
      id: 'sp5m3q6',
      domain: 'Security Program Management & Oversight',
      prompt:
        'Every January the port authority repeats its full risk assessment using the same method and compares the results with the previous year, so the board can see whether exposure is rising or falling. Which assessment cadence does this describe?',
      choices: [
        'Recurring, because it runs on a fixed schedule and produces results that can be compared over time',
        'Continuous, because the risk picture is kept up to date',
        'Ad hoc, because the board is the party requesting it',
        'One-time, because each annual assessment is a separate exercise',
      ],
      answer: 0,
      explain:
        'A scheduled repetition is the definition of a recurring assessment, and repeating it with the same method is what makes the year-on-year trend meaningful. Continuous is the attractive distractor because both keep management informed, but a continuous assessment updates itself automatically as data changes instead of producing a snapshot on a fixed date.',
    },
    {
      id: 'sp5m3q7',
      domain: 'Security Program Management & Oversight',
      prompt:
        'During risk identification an analyst lists the assets, threats and vulnerabilities of the terminal network but records nothing about the controls already deployed. What is the main consequence for the analysis that follows?',
      choices: [
        'No heat map can be produced, because controls are required to plot likelihood',
        'The exposure factor of every asset is automatically recorded as 100%',
        'Threats will be counted twice, which inflates the ARO',
        'The results will overstate exposure, because the reductions in likelihood and impact already provided by existing controls are ignored',
      ],
      answer: 3,
      explain:
        'Existing controls belong in identification precisely because they change the likelihood and impact values that feed the analysis, so omitting them reports raw exposure as if nothing were protecting the network and misdirects the budget. Claiming the exposure factor jumps to 100% sounds plausible, but the exposure factor is an estimate of how much asset value one event destroys and is not set mechanically by whether controls were written down.',
    },
    {
      id: 'sp5m3q8',
      domain: 'Security Program Management & Oversight',
      prompt: 'Which statement describes the exposure factor correctly?',
      choices: [
        'The number of times per year that an event is expected to occur',
        'The proportion of the asset value that is lost in a single occurrence of the event',
        'The total monetary value assigned to the asset in the inventory',
        'The annual budget available to mitigate the risk',
      ],
      answer: 1,
      explain:
        'The exposure factor expresses how much of the asset one event destroys, which is why it is multiplied by the asset value to obtain the SLE. The first option is the trap because both values appear in the same chain of calculations, but frequency per year is the ARO, and swapping the two produces an ALE that is wrong by orders of magnitude.',
    },
  ],
};

// ---------------------------------------------------------------------------
// SP5M4 — Gestión de riesgos II: registro, apetito, estrategias, reporting y BIA
// (SY0-701, objetivo 5.2)
// ---------------------------------------------------------------------------
const sp5m4: Module = {
  id: 'sp5m4',
  sectionId: 'sp5',
  title: 'Gestión de riesgos II: registro, apetito, estrategias, reporting y BIA',
  minutes: 13,
  objectives: [
    'Construir una entrada de **risk register** con **risk owner**, análisis, respuesta, **key risk indicators (KRIs)** y **risk threshold**',
    'Separar el **risk appetite** (**expansionary**, **neutral**, **conservative**) de la **risk tolerance**',
    'Aplicar las cuatro estrategias de respuesta: **mitigate**, **transfer**, **accept** (con **exemption/exception**) y **avoid**',
    'Preparar un **risk reporting** que la dirección pueda convertir en decisiones',
    'Interpretar un **business impact analysis**: **RTO**, **RPO**, **MTTR** y **MTBF**',
  ],
  blocks: [
    {
      t: 'p',
      md: 'La lección anterior terminó con un número: 50.000 € al año de pérdida esperada para el riesgo R-014 del puerto. Un número, por sí solo, no protege nada. Lo que convierte el análisis en **gestión** es lo que viene ahora: escribir el riesgo donde no se pierda, ponerle **dueño**, decidir cuánto está dispuesta la organización a asumir, elegir qué se hace con él, contárselo a quien decide y traducirlo en **plazos concretos de recuperación**. Esta lección cierra el objetivo 5.2 y, con él, la parte del examen donde más preguntas se ganan por vocabulario preciso: apetito no es tolerancia, transferir no es mitigar y RTO no es RPO.',
    },
    { t: 'h', text: 'El risk register: el riesgo con nombre, dueño y umbral' },
    {
      t: 'p',
      md: 'El **risk register** (o *risk log*) es el inventario vivo de los riesgos de la organización, y cada entrada lleva siempre lo mismo: un **identificador**, una **descripción** que une amenaza, vulnerabilidad, activo e impacto, el **análisis** (cualitativo, cuantitativo o ambos), el **riesgo inherente** —el que habría sin controles— y el **riesgo residual** —el que queda con los controles ya puestos—, la **respuesta elegida** con su plan y sus fechas, y un **risk owner**. Ese dueño es la pieza que más se confunde: es la **persona del negocio con autoridad para decidir y presupuesto para actuar** —el director de operaciones, el responsable de la terminal—, no la analista que descubrió el riesgo ni «el departamento de TI». Sin dueño nombrado, la entrada es una queja bien redactada. A eso se le añaden dos elementos que el examen nombra explícitamente. Los **key risk indicators (KRIs)** son métricas **adelantadas**: señales que se mueven **antes** de que el riesgo se materialice, como el porcentaje de cuentas privilegiadas sin MFA, los días medios que tarda un parche crítico en aplicarse o la rotación de personal del SOC. No confundas un **KRI** con un **KPI**: el KPI mide rendimiento ya conseguido y mira hacia atrás; el KRI avisa de exposición que está creciendo y mira hacia delante. Y el **risk threshold** es el valor a partir del cual ese indicador —o el propio nivel de riesgo— obliga a hacer algo: escalar al comité, parar un despliegue, liberar presupuesto. Un registro sin umbrales es una lista que nadie sabe cuándo mirar; un registro que no se revisa periódicamente es, directamente, un cementerio de riesgos.',
    },
    {
      t: 'check',
      q: {
        q: 'The port register tracks the number of internet-facing critical vulnerabilities that have been open for more than 30 days, and states that if the count rises above ten the risk must be escalated to the executive committee. What are the metric and the value of ten called?',
        choices: [
          'The metric is a risk appetite statement and ten is the tolerance',
          'The metric is a key risk indicator and ten is the risk threshold that triggers escalation',
          'The metric is an exposure factor and ten is the ARO',
          'Both are compensating controls recorded in the register',
        ],
        answer: 1,
        explain:
          'A key risk indicator is a measurable signal that moves before the risk materializes, and the threshold is the value at which the register says somebody must act. Calling the metric an appetite statement is tempting because both describe how much risk is acceptable, but appetite is the qualitative stance leadership adopts, whereas the KRI and its threshold are the concrete measurement and trigger written into a register entry.',
      },
    },
    { t: 'h', text: 'Apetito y tolerancia: la postura y el margen' },
    {
      t: 'p',
      md: 'El **risk appetite** es la **postura deliberada** que fija la dirección: cuánto riesgo está dispuesta la organización a asumir para conseguir sus objetivos. El examen usa tres etiquetas y hay que reconocerlas por su descripción: **expansionary** (acepta más riesgo del habitual a cambio de crecimiento o de ganar mercado), **neutral** (equilibrio entre oportunidad y protección) y **conservative** (prioriza la protección y la continuidad aunque cueste oportunidades). Es una decisión de negocio, la aprueba la dirección o el consejo, se escribe, y perfectamente puede ser distinta por línea de actividad: la Autoridad Portuaria puede ser **expansionary** en un programa nuevo de servicios digitales y **conservative** en todo lo que toque la seguridad de la navegación. La **risk tolerance** es otra cosa: es el **margen de variación aceptable** alrededor de esa postura, es decir, hasta dónde puede desviarse la realidad antes de que haya que reaccionar. Se expresa en números —nunca más de cuatro hallazgos críticos abiertos, ninguna parada de más de cuatro horas en temporada alta, cero incumplimientos de la normativa aduanera— y por eso conecta directamente con los **thresholds** del registro. La regla mnemotécnica que casi nunca falla: **el apetito es la dirección del viaje que decide la dirección; la tolerancia es cuánto te puedes salir del carril antes de que alguien tenga que frenar**.',
    },
    { t: 'h', text: 'Mitigar, transferir, aceptar, evitar' },
    {
      t: 'p',
      md: 'Solo hay cuatro respuestas posibles a un riesgo, y el examen te dará escenarios para clasificarlas. **Mitigate** es reducir la probabilidad o el impacto aplicando controles: parchear, segmentar, exigir MFA, hacer copias inmutables. Es la respuesta por defecto y siempre deja **riesgo residual**, que hay que volver a anotar en el registro. **Transfer** es trasladar parte de las consecuencias —normalmente **financieras**— a un tercero mediante un **seguro** o una cláusula contractual; es legítima y muy usada, pero tiene un límite que cae en el examen una y otra vez: **no traslada la obligación legal ni la reputación**. Si el puerto externaliza el tratamiento de datos de pasajeros y el proveedor sufre una brecha, la multa y la explicación pública siguen siendo del puerto. **Accept** es convivir con el riesgo a sabiendas, y solo vale si está **documentada**: **dueño nombrado** con autoridad para asumirla (una persona del negocio, nunca la analista), **justificación**, controles compensatorios si los hay y **fecha de revisión o caducidad**. Aquí conviven dos términos emparentados: una **exception** es una autorización acotada para no cumplir un requisito en un caso concreto y durante un tiempo determinado, mientras que una **exemption** deja formalmente a un sujeto o sistema fuera del alcance de la norma; ninguna de las dos es válida sin aprobación, registro y revisión. Y **avoid** es eliminar la actividad que genera el riesgo: no lanzar el servicio, retirar la API, no usar esa tecnología. Es la única respuesta que lleva el riesgo a cero y también la más cara en coste de oportunidad, porque renuncias al beneficio junto con el peligro.',
    },
    {
      t: 'table',
      headers: ['Estrategia', 'Qué hace con el riesgo', 'Ejemplo en Halden', 'Cuándo es la respuesta equivocada'],
      rows: [
        [
          '**Mitigate**',
          'Reduce probabilidad o impacto; deja **riesgo residual**',
          'MFA y copias inmutables en el sistema de asignación de atraques',
          'Cuando el coste del control supera con creces la **ALE** y no hay obligación legal ni de seguridad detrás',
        ],
        [
          '**Transfer**',
          'Traslada parte del **impacto financiero** a un tercero (seguro, contrato)',
          'Póliza de ciberriesgo por interrupción de negocio de la terminal de contenedores',
          'Cuando la pregunta es cómo se reduce la vulnerabilidad: la póliza no cambia nada técnico y no quita la responsabilidad legal',
        ],
        [
          '**Accept**',
          'Convive con él de forma consciente, documentada y con plazo',
          'La megafonía del muelle sigue en una versión sin soporte hasta su sustitución en marzo, con dueño y fecha',
          'Cuando no hay dueño, ni justificación, ni fecha de revisión: eso no es aceptar, es olvidar',
        ],
        [
          '**Avoid**',
          'Elimina la actividad y, con ella, el riesgo entero',
          'Retirar la API pública de posiciones de buques en lugar de asegurarla',
          'Cuando la actividad es esencial para operar el puerto: evitar no puede significar dejar de dar servicio',
        ],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'The port cannot patch a legacy ship-to-shore crane controller, so it moves the controller onto an isolated VLAN, restricts access to two named engineers and adds continuous monitoring. Which strategy is this, and what is left afterwards?',
        choices: [
          'Transfer, because responsibility now sits with the two named engineers',
          'Avoid, because the controller is no longer reachable from the corporate network',
          'Mitigate, because the controls cut likelihood and impact while leaving a documented residual risk',
          'Accept, because the vulnerability is still present on the controller',
        ],
        answer: 2,
        explain:
          'Segmentation, access restriction and monitoring reduce the probability and the impact of exploitation without removing the flaw, which is the definition of mitigation, and what remains is residual risk that belongs back in the register. Avoid is the tempting choice because isolation sounds like removal, but avoidance means ceasing the activity altogether and the crane keeps working exactly as before.',
      },
    },
    { t: 'h', text: 'Reporting y business impact analysis' },
    {
      t: 'p',
      md: 'El **risk reporting** es lo que convierte el registro en decisiones. A la dirección no se le entrega el registro entero —doscientas filas no son un informe—, sino lo que necesita para decidir: los riesgos que han cruzado su **threshold**, cómo han cambiado desde el informe anterior, qué aceptaciones caducan en los próximos meses, qué recursos hacen falta y **qué decisión concreta se le pide hoy**. Dos reglas prácticas que también son criterio de examen: el informe se escribe **en el idioma del negocio** —euros, horas de parada, buques sin atracar, multas potenciales— y no en CVEs; y **cada riesgo llega con una recomendación y un dueño**, porque un informe que solo describe problemas convierte a la analista en mensajera del desastre en lugar de en asesora. El reporting también tiene destinatarios internos —comités, auditoría interna— y a veces externos, cuando un regulador o un cliente contractualmente puede exigirlo.',
    },
    {
      t: 'p',
      md: 'El **business impact analysis (BIA)** ataca el problema desde el negocio, no desde la tecnología: identifica qué **procesos** son críticos, qué los sostiene y cuánto cuesta cada hora que están parados. De ahí salen cuatro métricas que hay que distinguir con precisión quirúrgica. El **RTO** (*recovery time objective*) es el **tiempo máximo tolerable** desde el fallo hasta que el proceso vuelve a estar operativo; es un objetivo de **tiempo** y determina la **capacidad de recuperación** que necesitas comprar: un sitio alternativo caliente, un clúster, un contrato de reposición urgente. El **RPO** (*recovery point objective*) es la **cantidad máxima de datos que puedes permitirte perder**, expresada también en tiempo (los últimos quince minutos, la última hora); determina la **frecuencia de copia o de replicación**, porque un RPO de quince minutos es imposible de cumplir con copias cada noche. El **MTTR** (*mean time to repair*) es cuánto se tarda **de media** en reparar y devolver el servicio: no es un objetivo, es una **medida observada**, y se compara con el RTO —si el MTTR real es mayor que el RTO comprometido, el plan de continuidad no se cumple y hay que invertir—. El **MTBF** (*mean time between failures*) es cuánto aguanta de media un sistema **entre fallos**: mide fiabilidad, ayuda a planificar mantenimiento y sustituciones y, de paso, es la mejor fuente para estimar el **ARO** de la lección anterior.',
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen: RTO es tiempo, RPO son datos, y transferir no te libera',
      md: '**Uno: RTO = tiempo, RPO = datos.** Si el enunciado pregunta **cada cuánto hay que copiar o replicar**, la respuesta la fija el **RPO**; si pregunta **qué solución de recuperación** hace falta (sitio caliente, clúster, redundancia), la fija el **RTO**. **Dos: MTTR y MTBF son medidas, no objetivos.** El **MTTR** se compara con el **RTO** para saber si el plan es realista, y el **MTBF** mide fiabilidad y alimenta la frecuencia esperada de fallo. **Tres: contratar un seguro es transfer, nunca mitigation**, y **no elimina la obligación legal** ni la responsabilidad frente al regulador, los clientes o los pasajeros. **Cuatro: aceptar un riesgo exige dueño nombrado y fecha de revisión**; una aceptación sin plazo se convierte en permanente por olvido, y ninguna aceptación la firma la analista que lo detectó. **Cinco: appetite ≠ tolerance.** El **apetito** es la postura (**expansionary**, **neutral**, **conservative**) que fija la dirección; la **tolerancia** es la variación numérica aceptable alrededor de ella, y es la que se traduce en **thresholds** del registro.',
    },
    {
      t: 'check',
      q: {
        q: 'The continuity plan for the berth-allocation system states that it must be operational again within four hours of a failure, and that no more than fifteen minutes of transactions may be lost. Which value drives how often the database is replicated?',
        choices: [
          'The four hours, because it is the RTO and the recovery must fit inside it',
          'The fifteen minutes, because it is the RPO and the replication interval cannot be longer than the data the port can afford to lose',
          'Neither: replication frequency is set by the MTBF of the storage array',
          'Both equally, because RTO and RPO are two names for the same tolerance',
        ],
        answer: 1,
        explain:
          'RPO states how much data loss is tolerable, so it caps the interval between copies or replication cycles, and a fifteen-minute RPO can never be met by nightly backups. The four-hour figure is the RTO and it does drive the recovery capability the port has to buy, but choosing it here confuses the time needed to restore service with the amount of data that may be lost.',
      },
    },
    {
      t: 'p',
      md: 'Ya tienes el ciclo de riesgo completo por dentro: identificar, evaluar, analizar, registrar, decidir, reportar y planificar la recuperación. Pero la Autoridad Portuaria de Halden no opera sola: el software de planificación lo hace un fabricante, la nube es de un proveedor, la seguridad física la lleva una contrata y los datos aduaneros viajan a una plataforma de un tercero. Cada uno de esos contratos importa riesgo que no controlas directamente y que, aun así, sigue siendo tuyo ante el regulador. La siguiente lección se ocupa precisamente de eso, el objetivo 5.3: cómo se evalúa a un proveedor **antes** de firmar, qué cláusulas hay que negociar mientras todavía tienes poder de negociación —empezando por la **right-to-audit clause**— y qué acuerdo sirve para cada cosa entre **SLA**, **MOU/MOA**, **MSA**, **SOW**, **NDA** y **BPA**.',
    },
  ],
  quiz: [
    {
      id: 'sp5m4q1',
      domain: 'Security Program Management & Oversight',
      prompt:
        'The port authority buys a cyber-insurance policy covering business interruption and breach-notification costs for the passenger terminal. How should this be recorded, and what does it not change?',
      choices: [
        'As mitigation, because the financial impact of an incident is now smaller',
        'As transfer, because part of the financial impact moves to the insurer while the legal duty to protect the data stays with the port',
        'As acceptance, because the port has decided to live with the risk as it is',
        'As avoidance, because the insurer now assumes the consequences of the event',
      ],
      answer: 1,
      explain:
        'Transfer moves part of the consequences to a third party through insurance or contract, yet regulators and passengers still hold the port accountable and the systems are exactly as exploitable the day after the policy is signed. Calling it mitigation is the common error because net financial exposure does fall, but mitigation means reducing the likelihood or the impact of the event itself, which a policy document cannot do.',
    },
    {
      id: 'sp5m4q2',
      domain: 'Security Program Management & Oversight',
      prompt:
        'After analysing the risk, the port cancels a planned public API that would have exposed live vessel positions, and shuts down the pilot version already running. Which strategy has been applied?',
      choices: [
        'Mitigation, because removing the pilot reduces the attack surface',
        'Transfer, because the data will now be published by a third party instead',
        'Acceptance, because the port has judged the residual risk tolerable',
        'Avoidance, because the activity that generated the risk has been discontinued altogether',
      ],
      answer: 3,
      explain:
        'Avoidance means not carrying out the activity at all, which is the only response that takes that specific risk to zero, and cancelling the service is exactly that. Mitigation is the plausible neighbour because both end with less exposure, but mitigation keeps the activity running behind controls, whereas here the service ceases to exist along with the value it would have delivered.',
    },
    {
      id: 'sp5m4q3',
      domain: 'Security Program Management & Oversight',
      prompt:
        'An auditor reviews a risk that the port has chosen to accept. Which set of attributes makes that acceptance defensible?',
      choices: [
        'A named business owner with authority to accept it, a documented justification, any compensating controls in place, and a review or expiry date',
        'A note from the security analyst confirming that the finding was reviewed and considered low',
        'Evidence that the CVSS score of the underlying vulnerability was below the organizational threshold on the day of the decision',
        'Confirmation that an insurance policy would cover the potential loss',
      ],
      answer: 0,
      explain:
        'Acceptance is a business decision, so it needs someone with the authority to own the consequences plus a date that forces the decision to be revisited before it silently becomes permanent. The insurance option is attractive because it looks like responsible risk handling, but a policy is a transfer of financial impact and it does not turn an unowned, undated acceptance into a defensible one.',
    },
    {
      id: 'sp5m4q4',
      domain: 'Security Program Management & Oversight',
      prompt:
        'A BIA for the customs-declaration platform records an RTO of two hours. Measurements over the past year give an average restoration time of five hours. What does this tell the analyst?',
      choices: [
        'That the RPO must be reduced so less data is lost during the outage',
        'That the MTBF is too low and the platform should be replaced',
        'That the measured MTTR exceeds the RTO, so the current recovery capability does not meet the objective and has to be improved',
        'Nothing useful, because RTO is an objective and MTTR is an observation, so the two cannot be compared',
      ],
      answer: 2,
      explain:
        'MTTR is what recovery actually costs in time and RTO is what the business can tolerate, so five hours against a two-hour objective is a documented gap that must be closed with automation, standby capacity or a different architecture. The last option sounds methodologically careful, but comparing the two is exactly how an organization discovers whether its continuity plan is achievable rather than aspirational.',
    },
    {
      id: 'sp5m4q5',
      domain: 'Security Program Management & Oversight',
      prompt:
        'The board of the port authority publishes a statement that, in order to win new logistics business, it will deliberately take more risk than usual in its new digital-services line, while remaining highly protective in vessel-safety systems. Which concept is the board expressing?',
      choices: [
        'Risk tolerance, because different limits are being applied to different systems',
        'Risk appetite, expansionary in one area and conservative in the other',
        'A risk threshold, because the statement determines when to escalate',
        'Residual risk, because it describes what is left after controls are applied',
      ],
      answer: 1,
      explain:
        'Risk appetite is the deliberate stance leadership sets about how much risk is worth taking to reach an objective, and expansionary, neutral and conservative are the three labels the exam uses for it. Tolerance is the tempting answer because it also concerns how much risk is acceptable, but tolerance is the measurable variation permitted around that stance rather than the strategic direction itself.',
    },
    {
      id: 'sp5m4q6',
      domain: 'Security Program Management & Oversight',
      prompt:
        'Which of the following is the BEST example of a key risk indicator in the port risk register?',
      choices: [
        'The number of security awareness sessions delivered during the last quarter',
        'The annualized loss expectancy calculated for the crane-scheduling risk',
        'The name of the executive recorded as the owner of the risk',
        'The percentage of privileged accounts still without multifactor authentication, tracked weekly against a defined threshold',
      ],
      answer: 3,
      explain:
        'A key risk indicator is a forward-looking metric that moves before the risk materializes and is watched against a threshold that triggers action, and the share of unprotected privileged accounts behaves exactly like that. The ALE is tempting because it is also a number attached to a risk, but it is the static output of an analysis rather than an early warning that exposure is drifting this week, and counting training sessions delivered is a performance indicator about work done.',
    },
    {
      id: 'sp5m4q7',
      domain: 'Security Program Management & Oversight',
      prompt:
        'Maintenance records for the gate-access controllers show that a controller fails on average every nine months, and that a failed unit is back in service after an average of six hours. Which metrics have been recorded?',
      choices: [
        'An RTO of nine months and an RPO of six hours',
        'An MTTR of nine months and an MTBF of six hours',
        'An MTBF of nine months and an MTTR of six hours',
        'An ARO of nine months and an SLE of six hours',
      ],
      answer: 2,
      explain:
        'Mean time between failures measures how long equipment runs before it breaks and mean time to repair measures how long it takes to bring it back, so nine months is the MTBF and six hours the MTTR. The second option simply swaps the two, which is the confusion the exam is testing, and it is worth noting that the MTBF is also the natural input for estimating the ARO of that failure.',
    },
    {
      id: 'sp5m4q8',
      domain: 'Security Program Management & Oversight',
      prompt: 'What is the primary purpose of a business impact analysis?',
      choices: [
        'To identify critical processes and how much time and data the organization can lose before the impact becomes unacceptable, so that recovery objectives can be set',
        'To enumerate the technical vulnerabilities present in the systems supporting those processes',
        'To assign a severity score to every incident recorded during the previous year',
        'To determine which insurance policy offers the organization the best coverage',
      ],
      answer: 0,
      explain:
        'A BIA starts from the business rather than the technology: it establishes which processes must survive, what an interruption costs as it lengthens, and from there the RTO and RPO that continuity planning has to satisfy. Listing vulnerabilities is the tempting technical answer, but that is the output of vulnerability management, and a perfectly valid BIA can be produced without naming a single CVE.',
    },
  ],
};

export const SP5_PART2: Module[] = [sp5m3, sp5m4];
