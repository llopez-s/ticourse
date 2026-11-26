import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// OP6M4 — Conformidad, auditoría e incidentes
// Fuente única: docs/superpowers/sources/2026-11-26-op6-fuentes.md (consultado el 2026-11-26).
// ---------------------------------------------------------------------------
export const OP6_M4: Module = {
  id: 'op6m4',
  sectionId: 'op6',
  title: 'Conformidad, auditoría e incidentes',
  minutes: 22,
  objectives: [
    'Distinguir la declaración de conformidad (autoevaluación, categoría BÁSICA) de la certificación (auditoría, categorías MEDIA y ALTA) según el artículo 38 y el anexo III del RD 311/2022',
    'Aplicar las reglas del artículo 31 sobre auditoría ordinaria y extraordinaria (dos años, modificaciones sustanciales, prórroga de tres meses) y los plazos de la ITS de Auditoría',
    'Explicar de dónde sale el carácter anual del informe del estado de la seguridad (artículo 32, medida op.mon.2 e ITS) y quién lo comunica',
    'Decidir a quién y cuándo se notifica un incidente según el artículo 33 y la ITS de Notificación, y cuándo entra el INCIBE-CERT, equipo de respuesta a incidentes de seguridad del Instituto Nacional de Ciberseguridad de España (INCIBE)',
    'Situar el ENS frente al Real Decreto-ley (RDL) 12/2018, el RD 43/2021 y la Directiva NIS2, sin aplicar plazos de una norma a quien no obliga',
  ],
  blocks: [
    {
      t: 'p',
      md: 'Categorizar un sistema y elegir sus medidas no sirve de nada si nadie comprueba que se aplican ni se sabe qué hacer cuando algo falla. De eso se ocupan dos capítulos del **RD 311/2022**, el que regula el **Esquema Nacional de Seguridad (ENS)**: el **capítulo IV** (artículos 31 a 34, «Seguridad de los sistemas: auditoría, informe e incidentes de seguridad») y el **capítulo V** (artículos 35 a 38, «Normas de conformidad»), junto con el **anexo III** (auditoría de la seguridad). Los desarrollan las **instrucciones técnicas de seguridad (ITS)**, de obligado cumplimiento según la disposición adicional segunda. En esta lección seguimos los sistemas del Consorcio Provincial de Arcedo: quién declara, quién audita, quién informa y a quién se avisa cuando hay un incidente. Al final se encaja todo con la normativa NIS, que en España sigue siendo la que traspuso la primera directiva.',
    },
    { t: 'h', text: 'Declarar o certificar: el artículo 38' },
    {
      t: 'p',
      md: 'El **artículo 38** fija cómo se determina la conformidad con el ENS, y la clave es la **categoría** del sistema. Los de categoría **MEDIA o ALTA** pasan una **«auditoría para la certificación»**. Los de categoría **BÁSICA** solo necesitan una **«autoevaluación para su declaración de la conformidad»**, aunque pueden certificarse igualmente si la entidad quiere. Las declaraciones y las certificaciones se publican en los portales o sedes electrónicas. La **ITS de Conformidad con el ENS** (Resolución de 13 de octubre de 2016) concreta el resultado: la autoevaluación de un sistema BÁSICO se hace **«al menos cada dos años»** y da lugar a una **Declaración de Conformidad** que expide la propia entidad; la auditoría formal de un sistema MEDIO o ALTO, también **«al menos cada dos años»**, da lugar a una **Certificación**. La misma ITS añade que la certificación de un sistema BÁSICO es «siempre la deseable». Cada resultado tiene su distintivo, definido en el glosario del anexo IV: el **Distintivo de Declaración de Conformidad** y el **Distintivo de Certificación de Conformidad**, ambos «en formato PDF-A».',
    },
    {
      t: 'table',
      headers: ['Categoría', 'Cómo se comprueba', 'Quién la hace y quién la analiza (anexo III)', 'Resultado', 'Distintivo (anexo IV)'],
      rows: [
        [
          'BÁSICA',
          'Autoevaluación documentada, al menos cada dos años (ITS de Conformidad)',
          'La hace el personal que administra el sistema (o en quien se delegue); la analiza el responsable de la seguridad, que eleva sus conclusiones al responsable del sistema',
          'Declaración de Conformidad, expedida por la propia entidad (puede certificarse si se quiere)',
          'De Declaración de Conformidad, firmado o sellado por la entidad responsable del sistema',
        ],
        [
          'MEDIA o ALTA',
          'Auditoría formal para la certificación, al menos cada dos años (art. 31 e ITS de Conformidad)',
          'Informe de auditoría con hallazgos «de conformidad y no conformidad»; lo analiza el responsable de la seguridad, que presenta sus conclusiones al responsable del sistema',
          'Certificación de conformidad',
          'De Certificación de Conformidad, firmado por la entidad de certificación',
        ],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'El sistema de gestión de nóminas del Consorcio se ha categorizado como MEDIA. ¿Cómo debe acreditar su conformidad con el ENS?',
        choices: [
          'Con una autoevaluación del Servicio de Informática y Comunicaciones y una Declaración de Conformidad',
          'Con una auditoría para la certificación, que termina en una Certificación de Conformidad',
          'Con una autoevaluación anual revisada por el Centro Criptológico Nacional (CCN)',
          'No necesita acreditarla mientras no tenga incidentes',
        ],
        answer: 1,
        explain:
          'El artículo 38 exige a los sistemas de categoría MEDIA o ALTA una auditoría para la certificación. La autoevaluación con Declaración de Conformidad es el camino de la categoría BÁSICA, y por eso tienta: el error típico es pensar que basta con autoevaluarse en cualquier categoría.',
      },
    },
    { t: 'h', text: 'Auditoría ordinaria y extraordinaria: el artículo 31 y el anexo III' },
    {
      t: 'p',
      md: 'El **artículo 31** regula la auditoría de la seguridad. La **ordinaria** se hace **«al menos cada dos años»**. La **extraordinaria** es obligatoria cuando hay **«modificaciones sustanciales»** en el sistema «que puedan repercutir en las medidas de seguridad requeridas», y **reinicia el cómputo** de los dos años. Si concurre fuerza mayor, el plazo de dos años puede **prorrogarse «tres meses»**. Los informes de auditoría se entregan al **responsable del sistema** y al **responsable de la seguridad**; en los sistemas de categoría **ALTA**, el responsable del sistema puede **suspender el tratamiento o el servicio**. El **CCN** puede requerir esos informes. En el Consorcio, por tanto, el informe llega a la jefatura del Servicio de Informática y Comunicaciones y a la Unidad de Seguridad de la Información, que lo analiza y presenta sus conclusiones a esa jefatura.',
    },
    {
      t: 'p',
      md: 'El **anexo III** dice qué se audita y cómo. Su objeto (1.1) es comprobar, entre otras cosas, que la política de seguridad define roles y funciones y la forma de resolver conflictos; que los responsables se han designado respetando la diferenciación de responsabilidades; que hay un análisis de riesgos **«con revisión y aprobación anual»**; que se cumplen las medidas del anexo II; y que existe un **sistema de gestión de la seguridad de la información documentado**, aprobado por la dirección y apoyado en la Declaración de Aplicabilidad. Como evidencias (1.2) se revisan procedimientos, el registro de incidentes, el personal y los productos certificados, y la auditoría se apoya en un **«programa o plan de auditorías documentado»** (1.3). El apartado 2 separa los dos caminos que ya conoces: la **BÁSICA no necesita auditoría** (2.1) y la **MEDIA o ALTA** produce un informe con hallazgos, criterios, alcance, objetivo y datos (2.2). Lo que el anexo III **no fija** es ningún plazo para corregir los hallazgos: eso está en la ITS de Auditoría.',
    },
    {
      t: 'table',
      headers: ['Dictamen (ITS de Auditoría)', 'Qué pasa después'],
      rows: [
        ['«FAVORABLE»', '—'],
        [
          '«FAVORABLE CON NO CONFORMIDADES»',
          'La entidad presenta a la entidad certificadora, **«en el plazo máximo de un mes, un Plan de Acciones Correctivas»**',
        ],
        [
          '«DESFAVORABLE»',
          'Hace falta una **auditoría extraordinaria** «en un plazo no superior a seis meses»',
        ],
        [
          'No conformidades mayores en un sistema ya certificado',
          'El certificado queda **en suspenso**; si no se cierran en **«seis meses»**, se revoca y se retira el distintivo',
        ],
      ],
    },
    {
      t: 'p',
      md: 'Los hallazgos de la auditoría se clasifican en **«No Conformidad Mayor»**, **«No Conformidad Menor»** y **Observación**. Las cuatro ITS que siguen en vigor (Notificación de Incidentes, Auditoría, Conformidad e Informe del Estado de la Seguridad) se aprobaron bajo el antiguo RD 3/2010, que el RD 311/2022 derogó, pero el BOE las da como **vigentes**. Por eso, cuando remiten a un artículo concreto, ese número es del RD 3/2010: cítalas por su nombre y su contenido, nunca por esos números internos.',
    },
    {
      t: 'check',
      q: {
        q: 'Tras la auditoría de un sistema del Consorcio de categoría ALTA, ¿quién puede, según el artículo 31, suspender el tratamiento o el servicio?',
        choices: [
          'La Unidad de Seguridad de la Información, como responsable de la seguridad',
          'El CCN, que es quien puede requerir los informes de auditoría',
          'La jefatura del Servicio de Informática y Comunicaciones, como responsable del sistema',
          'La entidad de certificación que ha hecho la auditoría',
        ],
        answer: 2,
        explain:
          'El artículo 31 da esa facultad, en los sistemas de categoría ALTA, al responsable del sistema, que en el Consorcio es la jefatura del Servicio de Informática y Comunicaciones. Tienta el responsable de la seguridad porque también recibe el informe y analiza sus conclusiones, pero la suspensión no le corresponde. El CCN puede requerir los informes, no suspender el servicio.',
      },
    },
    {
      t: 'check',
      q: {
        q: 'La auditoría de certificación de un sistema del Consorcio termina con el dictamen «DESFAVORABLE». Según la ITS de Auditoría, ¿qué sigue?',
        choices: [
          'Presentar un Plan de Acciones Correctivas en el plazo máximo de un mes y nada más',
          'Una auditoría extraordinaria en un plazo no superior a seis meses',
          'Esperar a la siguiente auditoría ordinaria, dentro de dos años',
          'Pedir la prórroga de tres meses del artículo 31',
        ],
        answer: 1,
        explain:
          'Tras un dictamen desfavorable, la ITS de Auditoría exige una auditoría extraordinaria en un plazo no superior a seis meses. El plan en un mes tienta porque es el plazo de la misma ITS, pero corresponde al dictamen favorable con no conformidades. La prórroga de tres meses del artículo 31 solo cabe por fuerza mayor y se refiere a la auditoría ordinaria.',
      },
    },
    {
      t: 'links',
      title: 'Auditorías y evaluaciones en general: ya están en la pista de Security+',
      items: [
        {
          label: 'Auditorías, evaluaciones y pruebas de intrusión (lección sp5m7)',
          href: '/learn/sp5m7',
        },
      ],
    },
    { t: 'h', text: 'El informe del estado de la seguridad: el artículo 32' },
    {
      t: 'p',
      md: 'El **artículo 32** dice que el estado de la seguridad de los sistemas lo recoge la **Comisión Sectorial de Administración Electrónica**, con procedimientos que articula el CCN. Lo que el artículo **no dice** es cada cuánto. La periodicidad sale de otros dos sitios: la medida **op.mon.2** (métricas) del anexo II, que pide datos «para proveer el **informe anual** requerido por el artículo 32», y la **ITS de Informe del Estado de la Seguridad** (Resolución de 7 de octubre de 2016), que obliga a comunicar **«al menos con carácter anual»** el estado de las principales variables. Según esa ITS, lo comunica el **responsable de la seguridad** mediante la herramienta **INES (Informe Nacional del Estado de la Seguridad)**, con los datos que señala la guía **CCN-STIC 824** (Información del Estado de Seguridad); el manual de INES es la **CCN-STIC 844**. En el Consorcio, por tanto, es la Unidad de Seguridad de la Información quien carga cada año los datos en INES.',
    },
    {
      t: 'check',
      q: {
        q: 'Un compañero afirma que «el artículo 32 del RD 311/2022 obliga a hacer el informe del estado de la seguridad cada año». ¿Qué matiz hay que hacerle?',
        choices: [
          'Ninguno: el artículo 32 fija una periodicidad anual',
          'El artículo 32 fija una periodicidad de dos años, como la auditoría',
          'El artículo 32 no fija periodicidad: lo anual sale de la medida op.mon.2 y de la ITS de Informe del Estado de la Seguridad',
          'El informe solo se hace cuando lo requiere el CCN',
        ],
        answer: 2,
        explain:
          'El artículo 32 encarga la recogida a la Comisión Sectorial de Administración Electrónica, pero no dice cada cuánto. El carácter anual viene de op.mon.2 («informe anual requerido por el artículo 32») y de la ITS («al menos con carácter anual»). Los dos años son la periodicidad de la auditoría ordinaria del artículo 31, y por eso se confunden.',
      },
    },
    { t: 'h', text: 'Incidentes: el artículo 33 y la ITS de Notificación' },
    {
      t: 'p',
      md: 'El **artículo 25** obliga a tener procedimientos de gestión de incidentes conforme al artículo 33, a la ITS correspondiente y, si la entidad es operador de servicios esenciales o proveedor de servicios digitales, al anexo del RD 43/2021. El **artículo 33** organiza la respuesta en torno al **CCN-CERT**, la capacidad de respuesta a incidentes del CCN. Su apartado **33.2** obliga a las entidades del sector público a **notificar al CCN** los incidentes que tengan un **«impacto significativo»**, según la ITS. El apartado **33.7** se ocupa de las empresas privadas que prestan servicios al sector público: ellas notifican al **INCIBE-CERT**, el equipo de respuesta a incidentes de seguridad del Instituto Nacional de Ciberseguridad de España (INCIBE), que lo pone en conocimiento del CCN-CERT. Tras un incidente, es el CCN-CERT quien determina el riesgo de reconectar el sistema afectado. El **artículo 34** enumera los servicios que el CCN-CERT presta al sector público: soporte, guías CCN-STIC, formación y alertas.',
    },
    {
      t: 'p',
      md: 'La **ITS de Notificación de Incidentes de Seguridad** (Resolución de 13 de abril de 2018) pone las reglas concretas. El nivel de **impacto potencial** se clasifica con la guía **CCN-STIC 817** (Gestión de Ciberincidentes) en seis niveles: **«Irrelevante, Bajo, Medio, Alto, Muy Alto y Crítico»**. Es obligatorio notificar al CCN **«en el momento en que se produzcan»** los incidentes de nivel **«CRÍTICO, MUY ALTO o ALTO»**. La ITS pide además conservar evidencias con su cadena de custodia y hacer la notificación con la herramienta **LUCIA (Listado Unificado de Coordinación de Incidentes y Amenazas)**. Y añade una regla que se olvida a menudo: si el incidente afecta a datos personales, la notificación a la autoridad de control se hace **«con independencia del nivel de impacto»** que tenga en el ENS, según el artículo 33 del **RGPD (Reglamento General de Protección de Datos)**, que pide hacerlo «sin dilación indebida y, de ser posible, a más tardar 72 horas» después de tener constancia. Para el Consorcio, esa autoridad es la **AEPD (Agencia Española de Protección de Datos)**; el detalle de las brechas de datos está en la lección de protección de datos.',
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'En el Consorcio de Arcedo: dos avisos que corren a la vez',
      md: 'Un ataque deja fuera de servicio la web informativa del Consorcio y, al investigarlo, se ve que el atacante también ha accedido a un servidor con datos de personal. Si el incidente se clasifica en nivel **ALTO** o superior, el Consorcio lo notifica al **CCN** en el momento en que se produce (art. 33.2 e ITS de Notificación). Como hay datos personales, notifica además a la **AEPD**, sea cual sea el nivel en el ENS, sin dilación indebida y, de ser posible, en 72 horas (art. 33 RGPD). Las dos notificaciones son independientes y van en paralelo: ninguna sustituye a la otra. Si el servidor lo administrara una empresa contratada, esa empresa avisaría al **INCIBE-CERT** (art. 33.7), que lo trasladaría al CCN-CERT.',
    },
    {
      t: 'check',
      q: {
        q: 'Según la ITS de Notificación, ¿qué incidentes es obligatorio notificar al CCN en el momento en que se produzcan?',
        choices: [
          'Solo los de nivel CRÍTICO',
          'Los de nivel CRÍTICO y MUY ALTO',
          'Los de nivel CRÍTICO, MUY ALTO y ALTO',
          'Todos, incluidos los de nivel Irrelevante',
        ],
        answer: 2,
        explain:
          'La ITS hace obligatoria la notificación inmediata de los niveles CRÍTICO, MUY ALTO y ALTO. La opción de solo CRÍTICO y MUY ALTO tienta porque son los únicos niveles que en la tabla de plazos del RD 43/2021 tienen notificación intermedia y final, pero esa tabla, que verás más abajo, es otra norma y el nivel ALTO también se notifica.',
      },
    },
    {
      t: 'links',
      title: 'El proceso de respuesta a incidentes: ya está en la pista de Security+',
      items: [
        {
          label: 'Respuesta a incidentes: proceso, pruebas, análisis de causa raíz y búsqueda de amenazas (lección sp4m10)',
          href: '/learn/sp4m10',
        },
      ],
    },
    { t: 'h', text: 'El encaje con NIS: RDL 12/2018, RD 43/2021 y Directiva NIS2' },
    {
      t: 'p',
      md: 'En paralelo al ENS existe la normativa de seguridad de las redes y sistemas de información, conocida como **NIS**. En España sigue vigente el **Real Decreto-ley 12/2018**, que traspuso la primera directiva NIS (Directiva (UE) 2016/1148), y su desarrollo, el **Real Decreto 43/2021**. Obligan a los **operadores de servicios esenciales (OSE)** y a los **proveedores de servicios digitales (PSD)**. El RDL fija los equipos de respuesta de referencia (artículo 11): el **CCN-CERT** para las entidades del ámbito de la Ley 40/2015, el **INCIBE-CERT** para las demás y para ciudadanos y entidades privadas, y el **ESPDEF-CERT**, del Mando Conjunto del Ciberespacio (MCCE) del Ministerio de Defensa, para el ámbito de Defensa. Los OSE y PSD notifican los incidentes con «efectos perturbadores significativos» a su autoridad competente **a través de ese equipo de referencia** (artículo 19). Si la infractora es una administración pública, el RDL no la multa: dicta una resolución con medidas para corregir la situación (artículo 40).',
    },
    {
      t: 'p',
      md: 'El **RD 43/2021** obliga a los OSE a notificar los incidentes con nivel de **impacto** o de **peligrosidad** «crítico, muy alto o alto» (artículo 9), independientemente de la notificación a la AEPD por el artículo 33 del RGPD (9.3). Se notifican en la **Plataforma Nacional de Notificación y Seguimiento de Ciberincidentes**, disponible «todas las horas del día y todos los días del año» (artículo 11). Su anexo, la «Instrucción nacional de notificación y gestión de ciberincidentes», fija la ventana temporal de cada aviso. La notificación inicial cuenta desde que se tiene conocimiento del incidente; la intermedia y la final, desde que se remite la inicial.',
    },
    {
      t: 'table',
      headers: ['Nivel de peligrosidad o impacto (anexo RD 43/2021)', 'Inicial', 'Intermedia', 'Final'],
      rows: [
        ['CRÍTICO', 'Inmediata', '24/48 horas', '20 días'],
        ['MUY ALTO', 'Inmediata', '72 horas', '40 días'],
        ['ALTO', 'Inmediata', '—', '—'],
        ['MEDIO y BAJO', '—', '—', '—'],
      ],
    },
    {
      t: 'callout',
      kind: 'warn',
      title: 'Esa tabla no es la del Consorcio',
      md: 'Los plazos de **24/48 horas, 72 horas, 20 y 40 días** obligan a los sujetos del RD 43/2021, es decir, a OSE y PSD; el RD 311/2022 solo los enlaza para ellos (art. 25). Para una entidad pública cualquiera, como el Consorcio, la regla es la del **artículo 33.2 del RD 311/2022 y la ITS de Notificación**: notificar al CCN los incidentes de nivel alto, muy alto o crítico **en el momento en que se produzcan**. Las 72 horas de la tabla (intermedia de MUY ALTO) tampoco son las 72 horas del RGPD, que cuentan para avisar a la autoridad de control de una brecha de datos personales.',
    },
    {
      t: 'p',
      md: 'La **Directiva (UE) 2022/2555**, conocida como **NIS2**, está **en vigor** (DO L 333 de 27-12-2022) y derogó la primera directiva NIS con efectos desde el **18 de octubre de 2024**. Los Estados tenían que trasponerla **«a más tardar el 17 de octubre de 2024»** (artículo 41). Su artículo 23 fija tres avisos para los incidentes significativos: **alerta temprana en 24 horas**, **notificación del incidente en 72 horas** e **informe final a más tardar un mes** después de la notificación. En su ámbito (artículo 2) entra la **administración pública central** y, tras una evaluación de riesgos, la **regional**; la **local** solo si el Estado decide incluirla (2.5.a). Pero **a 26 de noviembre de 2026, fecha en que se consultaron el BOE y EUR-Lex para esta lección, España no la ha traspuesto**: EUR-Lex no registra ninguna medida nacional de transposición española, el BOE no tiene ninguna ley que la trasponga y el RDL 12/2018 y el RD 43/2021 siguen sin derogar. La Comisión Europea interpuso el **1 de octubre de 2026** un recurso por incumplimiento contra España ante el **Tribunal de Justicia de la Unión Europea (TJUE)**, el **asunto C-1080/26**. Mientras no haya transposición, en España se aplica el régimen de 2018.',
    },
    {
      t: 'check',
      q: {
        q: 'Un informe de incidentes del Consorcio dice que un suceso tuvo impacto «SIN IMPACTO» según la ITS de Notificación. ¿Qué hay de incorrecto?',
        choices: [
          'Nada: es el nivel inferior de la ITS de Notificación',
          'La ITS de Notificación solo tiene cinco niveles y el inferior es «Bajo»',
          '«SIN IMPACTO» es el nivel superior de la escala de peligrosidad',
          'El nivel inferior de la ITS de Notificación se llama «Irrelevante»; «SIN IMPACTO» es el de la escala de impacto del RD 43/2021',
        ],
        answer: 3,
        explain:
          'Hay dos escalas de seis niveles que no se deben mezclar: la de la ITS de Notificación (Irrelevante, Bajo, Medio, Alto, Muy Alto y Crítico) y la de impacto del anexo del RD 43/2021 (CRÍTICO, MUY ALTO, ALTO, MEDIO, BAJO y SIN IMPACTO). La de cinco niveles existe, pero es la de peligrosidad del RD 43/2021, que no tiene nivel «SIN IMPACTO».',
      },
    },
    { t: 'h', text: 'Resumen de artículos y anexos clave' },
    {
      t: 'table',
      headers: ['Artículo', 'Qué regula', 'Lo que hay que retener'],
      rows: [
        ['Art. 25 RD 311/2022', 'Incidentes de seguridad (requisito mínimo)', 'Procedimientos según el art. 33, la ITS y, si es OSE o PSD, el anexo del RD 43/2021'],
        ['Art. 31 RD 311/2022', 'Auditoría de la seguridad', 'Ordinaria al menos cada dos años; extraordinaria por modificaciones sustanciales «que puedan repercutir en las medidas de seguridad requeridas» (reinicia el cómputo); prórroga de tres meses por fuerza mayor'],
        ['Art. 32 RD 311/2022', 'Informe del estado de la seguridad', 'Lo recoge la Comisión Sectorial de Administración Electrónica; lo anual sale de op.mon.2 y de la ITS'],
        ['Art. 33 RD 311/2022', 'Capacidad de respuesta a incidentes', 'CCN-CERT; 33.2 el sector público notifica al CCN; 33.7 los privados notifican al INCIBE-CERT'],
        ['Art. 34 RD 311/2022', 'Servicios del CCN-CERT', 'Soporte, guías CCN-STIC, formación y alertas'],
        ['Art. 38 RD 311/2022', 'Determinación de la conformidad', 'BÁSICA: autoevaluación y declaración; MEDIA o ALTA: auditoría y certificación'],
        ['Anexo III RD 311/2022', 'Auditoría de la seguridad', 'Objeto, evidencias y plan de auditorías; BÁSICA sin auditoría; no fija plazo de plan de acción'],
        ['Art. 11 y 19 RDL 12/2018', 'Equipos de referencia y obligación de notificar', 'CCN-CERT, INCIBE-CERT y ESPDEF-CERT; OSE y PSD notifican a través de su equipo de referencia'],
        ['Art. 9 y anexo RD 43/2021', 'Qué notifican los OSE y en qué plazos', 'Crítico, muy alto o alto; plazos de 24/48 h, 72 h, 20 y 40 días solo para OSE y PSD'],
        ['Art. 23 Directiva (UE) 2022/2555', 'Notificación de incidentes en NIS2', '24 h, 72 h y un mes; pendiente de transposición en España a 26-11-2026'],
      ],
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Lo que más se confunde',
      md: '**Declaración o certificación:** BÁSICA se autoevalúa y declara; MEDIA o ALTA se audita y certifica (art. 38). Una BÁSICA puede certificarse, pero no está obligada. **Dos años** es la periodicidad de la auditoría ordinaria (art. 31) y de la autoevaluación (ITS de Conformidad); **anual** es el informe del estado de la seguridad (op.mon.2 e ITS, no el art. 32) y la revisión del análisis de riesgos que comprueba el anexo III. **Tres meses** es la prórroga por fuerza mayor; **un mes**, el Plan de Acciones Correctivas; **seis meses**, la auditoría extraordinaria tras un desfavorable y el cierre de no conformidades mayores antes de revocar. Estos plazos de corrección son de la **ITS de Auditoría**, no del anexo III. **Herramientas:** INES para el informe del estado, LUCIA para notificar incidentes. **A quién se notifica:** sector público al CCN (art. 33.2); empresa privada que presta servicios al sector público, al INCIBE-CERT (art. 33.7). **Escalas:** la ITS de Notificación empieza en «Irrelevante»; la de impacto del RD 43/2021 en «SIN IMPACTO»; la de peligrosidad tiene cinco niveles. **NIS:** los plazos de 24/48 h, 72 h, 20 y 40 días son solo para OSE y PSD; NIS2 está pendiente de transposición a 26 de noviembre de 2026.',
    },
  ],
  quiz: [
    {
      id: 'op6m4q1',
      domain: 'ENS y normativa',
      prompt:
        'Según el artículo 38 del RD 311/2022, ¿cómo se determina la conformidad con el ENS de un sistema de categoría BÁSICA?',
      choices: [
        'Con una auditoría para la certificación cada dos años, igual que los de categoría MEDIA',
        'Con una autoevaluación para su declaración de la conformidad, aunque también puede certificarse',
        'No necesita ningún procedimiento de conformidad por ser la categoría inferior',
        'Con una auditoría realizada directamente por el CCN',
      ],
      answer: 1,
      explain:
        'El artículo 38 reserva la auditoría para la certificación a las categorías MEDIA y ALTA; a la BÁSICA le basta una autoevaluación que termina en una declaración de la conformidad, y puede certificarse si la entidad quiere. La tercera opción tienta porque el anexo III dice que la BÁSICA «no necesita auditoría», pero sí necesita la autoevaluación documentada.',
    },
    {
      id: 'op6m4q2',
      domain: 'ENS y normativa',
      prompt:
        '¿Con qué periodicidad exige el artículo 31 del RD 311/2022 la auditoría ordinaria, y cuánto puede prorrogarse por fuerza mayor?',
      choices: [
        'Al menos cada año, con una prórroga de seis meses',
        'Al menos cada dos años, con una prórroga de un mes',
        'Al menos cada tres años, con una prórroga de tres meses',
        'Al menos cada dos años, con una prórroga de tres meses',
      ],
      answer: 3,
      explain:
        'El artículo 31 pide la auditoría ordinaria «al menos cada dos años» y admite una prórroga de «tres meses» por fuerza mayor. El año tienta porque es la periodicidad del informe del estado de la seguridad y de la revisión del análisis de riesgos; el mes y los seis meses son plazos de la ITS de Auditoría (Plan de Acciones Correctivas y auditoría extraordinaria tras un desfavorable).',
    },
    {
      id: 'op6m4q3',
      domain: 'ENS y normativa',
      prompt:
        'El registro de entrada del Consorcio superó su auditoría ordinaria hace ocho meses. Ahora se integra con una plataforma nueva, lo que supone una modificación sustancial del sistema. ¿Qué corresponde según el artículo 31?',
      choices: [
        'Una auditoría extraordinaria, tras la cual el plazo de dos años vuelve a contarse desde cero',
        'Esperar a la siguiente auditoría ordinaria, que toca dentro de dieciséis meses',
        'Solicitar la prórroga de tres meses y auditar después',
        'Notificarlo al CCN-CERT como incidente de seguridad',
      ],
      answer: 0,
      explain:
        'Una modificación sustancial obliga a una auditoría extraordinaria, y el artículo 31 dice que esta reinicia el cómputo de los dos años. Esperar a la ordinaria tienta porque el sistema está dentro de plazo, pero el plazo de dos años no cubre los cambios sustanciales. La prórroga solo cabe por fuerza mayor, y un cambio planificado no es un incidente.',
    },
    {
      id: 'op6m4q4',
      domain: 'ENS y normativa',
      prompt:
        'La auditoría de certificación de un sistema del Consorcio concluye con un dictamen «FAVORABLE CON NO CONFORMIDADES». Según la ITS de Auditoría, ¿qué debe hacer la entidad?',
      choices: [
        'Someterse a una auditoría extraordinaria en un plazo no superior a seis meses',
        'Corregir las no conformidades antes de la siguiente auditoría ordinaria, sin plazo intermedio',
        'Presentar a la entidad certificadora un Plan de Acciones Correctivas en el plazo máximo de un mes',
        'Comunicar el resultado al CCN mediante la herramienta INES en 72 horas',
      ],
      answer: 2,
      explain:
        'La ITS de Auditoría da un mes como máximo para presentar el Plan de Acciones Correctivas cuando el dictamen es favorable con no conformidades. La auditoría extraordinaria en seis meses es la consecuencia del dictamen desfavorable, que es lo que se confunde. INES es la herramienta del informe del estado de la seguridad, no de las auditorías.',
    },
    {
      id: 'op6m4q5',
      domain: 'ENS y normativa',
      prompt:
        'Sobre el informe del estado de la seguridad que recoge el artículo 32 del RD 311/2022, ¿qué afirmación es correcta?',
      choices: [
        'El artículo 32 obliga al responsable del sistema a enviarlo cada dos años con la herramienta LUCIA',
        'El responsable de la seguridad comunica los datos al menos con carácter anual mediante la herramienta INES, según la ITS de Informe del Estado de la Seguridad',
        'Lo elabora el CCN-CERT a partir de las notificaciones de incidentes, sin intervención de la entidad',
        'Solo se presenta cuando la auditoría ordinaria tiene un dictamen desfavorable',
      ],
      answer: 1,
      explain:
        'La ITS de Informe del Estado de la Seguridad encarga al responsable de la seguridad comunicar, al menos con carácter anual, el estado de las principales variables mediante INES. La primera opción tienta porque mezcla piezas reales de otros procedimientos: los dos años son de la auditoría, LUCIA es la herramienta de notificación de incidentes, y el artículo 32 no fija ninguna periodicidad.',
    },
    {
      id: 'op6m4q6',
      domain: 'ENS y normativa',
      prompt:
        'Un incidente en el sistema de gestión de expedientes del Consorcio se clasifica con nivel de impacto ALTO según la ITS de Notificación. El Consorcio no es operador de servicios esenciales. ¿Cuándo debe notificarlo al CCN?',
      choices: [
        'En el plazo de 72 horas desde que tenga constancia',
        'No es obligatorio: solo se notifican los incidentes CRÍTICOS y MUY ALTOS',
        'Con notificación inicial inmediata, intermedia a las 24/48 horas y final a los 20 días',
        'En el momento en que se produzca',
      ],
      answer: 3,
      explain:
        'Para una entidad del sector público, el artículo 33.2 y la ITS de Notificación obligan a notificar al CCN «en el momento en que se produzcan» los incidentes de nivel CRÍTICO, MUY ALTO o ALTO. Las 72 horas son el plazo del RGPD para la autoridad de control (y el de NIS2 para la notificación del incidente). Los plazos de 24/48 horas y 20 días son del anexo del RD 43/2021 para el nivel CRÍTICO y obligan a OSE y PSD, no al Consorcio.',
    },
    {
      id: 'op6m4q7',
      domain: 'ENS y normativa',
      prompt:
        'La empresa privada que mantiene, por contrato, la infraestructura de las oficinas comarcales del Consorcio sufre un incidente que afecta a ese servicio. Según el artículo 33.7 del RD 311/2022, ¿a quién lo notifica la empresa?',
      choices: [
        'Al INCIBE-CERT, que lo pone en conocimiento del CCN-CERT',
        'Directamente al CCN-CERT, igual que las entidades del sector público',
        'A la AEPD, porque es una entidad privada',
        'Al ESPDEF-CERT',
      ],
      answer: 0,
      explain:
        'El artículo 33.7 dirige a las entidades privadas que prestan servicios al sector público hacia el INCIBE-CERT, que lo traslada al CCN-CERT. Notificar directamente al CCN-CERT tienta porque el servicio es del Consorcio, pero esa vía es la de las propias entidades públicas (art. 33.2). La AEPD solo entra si hay datos personales, y el ESPDEF-CERT es el equipo de referencia de Defensa.',
    },
    {
      id: 'op6m4q8',
      domain: 'ENS y normativa',
      prompt:
        'A fecha de 26 de noviembre de 2026, ¿cuál es la situación en España de la Directiva (UE) 2022/2555 (NIS2)?',
      choices: [
        'El RDL 12/2018 la traspuso y sigue siendo la norma de transposición vigente',
        'Se traspuso en 2025 mediante una ley de ciberseguridad que derogó el RDL 12/2018 y el RD 43/2021',
        'Está en vigor y el plazo de transposición venció el 17 de octubre de 2024, pero España no la ha traspuesto; siguen aplicándose el RDL 12/2018 y el RD 43/2021',
        'No está en vigor porque la Comisión Europea la recurrió ante el TJUE en el asunto C-1080/26',
      ],
      answer: 2,
      explain:
        'NIS2 está en vigor, su plazo de transposición venció el 17 de octubre de 2024 y, a la fecha de consulta, España no ha notificado ninguna medida de transposición; por eso siguen vigentes el RDL 12/2018 y el RD 43/2021. El RDL 12/2018 traspuso la primera directiva NIS (2016/1148), no NIS2. El asunto C-1080/26 es un recurso de la Comisión contra España por no trasponerla, no contra la directiva.',
    },
  ],
};
