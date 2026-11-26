import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// OP6M1 — El ENS: marco, principios y roles
// Fuente: Real Decreto 311/2022 (BOE-A-2022-7191), versión consolidada de 7-11-2024.
// Dossier: docs/superpowers/sources/2026-11-26-op6-fuentes.md, §1.
// ---------------------------------------------------------------------------
export const OP6_M1: Module = {
  id: 'op6m1',
  sectionId: 'op6',
  title: 'El ENS: marco, principios y roles',
  minutes: 20,
  objectives: [
    'Situar el Real Decreto 311/2022 en su base legal (artículo 156.2 de la Ley 40/2015) y delimitar su ámbito, incluido el sector privado que presta servicios al sector público',
    'Recorrer la estructura del real decreto: siete capítulos, cuarenta y un artículos y cuatro anexos',
    'Enumerar los siete principios básicos del artículo 5 y los quince requisitos mínimos del artículo 12.6, y saber dónde se desarrolla cada grupo',
    'Explicar qué debe contener la política de seguridad y dónde encaja el comité de seguridad',
    'Distinguir los cuatro responsables (información, servicio, seguridad y sistema) y aplicar la separación del artículo 13.3 a una organización concreta',
  ],
  blocks: [
    {
      t: 'p',
      md: 'Este bloque cubre la normativa de seguridad que obliga a una administración española: el **Esquema Nacional de Seguridad (ENS)**, la protección de datos, el gobierno de la seguridad y la firma e identificación electrónicas. Empieza por el ENS porque es el marco que ordena todo lo demás: dice quién decide, qué se protege y con qué medidas. El escenario es el **Consorcio Provincial de Arcedo**, una entidad del sector público con una sede central que alberga su CPD (centro de proceso de datos), tres oficinas comarcales y el centro de formación de Valdecierzo. El Consorcio presta servicios a la ciudadanía a través de su sede electrónica y su registro electrónico, y a lo largo del bloque irá aplicando la norma a sus propios sistemas. Esta primera lección responde a tres preguntas que se preguntan mucho con número de artículo: **a quién se aplica el ENS, cómo está construido el real decreto y quién es responsable de qué**.',
    },
    { t: 'h', text: 'Objeto y ámbito: de la Ley 40/2015 al sector privado' },
    {
      t: 'p',
      md: 'El ENS no nace en el real decreto: lo **establece el artículo 156.2 de la Ley 40/2015**, que le encarga fijar los «principios básicos y requisitos mínimos» de la seguridad (el 156.1 regula el Esquema Nacional de Interoperabilidad). El **Real Decreto 311/2022, de 3 de mayo**, lo regula hoy. Se publicó en el BOE el 4 de mayo de 2022, está **en vigor desde el 5 de mayo de 2022** y **derogó el Real Decreto 3/2010**, el ENS anterior. Su única modificación posterior, de 2024, toca solo la disposición adicional segunda. Según el **artículo 1**, el objeto es proteger la información y los servicios mediante principios básicos y requisitos mínimos que garanticen siete propiedades: «el acceso, la confidencialidad, la integridad, la trazabilidad, la autenticidad, la disponibilidad y la conservación».\n\nEl **artículo 2** fija el ámbito. Se aplica a **todo el sector público** tal como lo define el artículo 2 de la Ley 40/2015, a los sistemas que tratan **información clasificada** y también al **sector privado** que presta servicios o provee soluciones al sector público por una relación contractual (art. 2.3). Esa empresa privada aplica el ENS con **su propia política de seguridad**, aprobada por su órgano con «las máximas competencias ejecutivas», y los **pliegos** de contratación deben exigirle la conformidad con el ENS, exigencia que «se extenderá» a su **cadena de suministro** «en la medida que sea necesario y de acuerdo con los resultados del correspondiente análisis de riesgos». El artículo 2.4 precisa que, cuando una entidad pública despliega redes 5G o presta servicios 5G, se le aplica además el Real Decreto-ley 7/2022. El **artículo 3** resuelve el cruce con la protección de datos: cuando un sistema trata datos personales se aplican además el **RGPD** (Reglamento General de Protección de Datos) y la **LOPDGDD** (Ley Orgánica 3/2018), con los criterios de la **AEPD** (Agencia Española de Protección de Datos) y de las autoridades autonómicas, y si el análisis de riesgos del artículo 24 del RGPD o la **EIPD** (evaluación de impacto) del artículo 35 piden medidas más exigentes que el ENS, **prevalecen esas**.',
    },
    {
      t: 'check',
      q: {
        q: '¿Qué precepto con rango de ley establece el Esquema Nacional de Seguridad que regula el Real Decreto 311/2022?',
        choices: [
          'El artículo 156.1 de la Ley 40/2015',
          'El artículo 156.2 de la Ley 40/2015',
          'El artículo 2 de la Ley 39/2015',
          'El Real Decreto-ley 12/2018',
        ],
        answer: 1,
        explain:
          'El artículo 1 del Real Decreto 311/2022 dice que regula el ENS «establecido en el artículo 156.2 de la Ley 40/2015». El 156.1 tienta porque es el apartado vecino, pero establece el Esquema Nacional de Interoperabilidad. El Real Decreto-ley 12/2018 regula la seguridad de las redes y sistemas de información de otros sujetos, no crea el ENS.',
      },
    },
    { t: 'h', text: 'Cómo está construido el real decreto' },
    {
      t: 'p',
      md: 'El preámbulo describe el texto como «cuarenta y un artículos distribuidos en siete capítulos, tres disposiciones adicionales, una disposición transitoria, una disposición derogatoria, tres disposiciones finales y cuatro anexos». Conviene saberse la tabla de capítulos, porque muchas preguntas de artículo se resuelven sabiendo en qué capítulo cae cada tema.',
    },
    {
      t: 'table',
      headers: ['Capítulo o anexo', 'Artículos', 'Título'],
      rows: [
        ['I', '1–4', 'Disposiciones generales'],
        ['II', '5–11', 'Principios básicos'],
        ['III', '12–30', 'Política de seguridad y requisitos mínimos de seguridad'],
        ['IV', '31–34', 'Seguridad de los sistemas: auditoría, informe e incidentes de seguridad'],
        ['V', '35–38', 'Normas de conformidad'],
        ['VI', '39', 'Actualización del Esquema Nacional de Seguridad'],
        ['VII', '40–41', 'Categorización de los sistemas de información'],
        ['Anexo I', '—', 'Categorías de seguridad de los sistemas de información'],
        ['Anexo II', '—', 'Medidas de seguridad (73 medidas en tres grupos: org, op y mp)'],
        ['Anexo III', '—', 'Auditoría de la seguridad'],
        ['Anexo IV', '—', 'Glosario (el artículo 4 remite a él para las definiciones)'],
      ],
    },
    {
      t: 'p',
      md: 'Dos disposiciones completan el mapa. La **disposición adicional segunda** prevé el desarrollo del ENS mediante **instrucciones técnicas de seguridad (ITS)**, de obligado cumplimiento, y guías de seguridad de las tecnologías de la información y la comunicación (**guías CCN-STIC**), «particularmente de la serie 800», que elabora el **CCN** (Centro Criptológico Nacional). La **disposición transitoria única** dio a los sistemas que ya existían «veinticuatro meses» para adecuarse.',
    },
    { t: 'h', text: 'Los principios básicos: siete principios en seis artículos' },
    {
      t: 'table',
      headers: ['Letra del art. 5', 'Principio básico', 'Artículo que lo desarrolla', 'Idea clave'],
      rows: [
        ['a)', 'Seguridad como proceso integral', '6', 'Excluye la «actuación puntual o tratamiento coyuntural»; incluye la concienciación'],
        ['b)', 'Gestión de la seguridad basada en los riesgos', '7', 'Una «actividad continua y permanentemente actualizada»'],
        ['c)', 'Prevención, detección, respuesta y conservación', '8', '—'],
        ['d)', 'Existencia de líneas de defensa', '9', 'Varias capas, con medidas «de naturaleza organizativa, física y lógica»'],
        ['e)', 'Vigilancia continua', '10', 'Comparte artículo con la reevaluación periódica'],
        ['f)', 'Reevaluación periódica', '10', 'Comparte artículo con la vigilancia continua'],
        ['g)', 'Diferenciación de responsabilidades', '11', 'Cuatro responsables; la seguridad, separada de la explotación'],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'El artículo 5 enumera siete principios básicos, pero el capítulo II solo dedica seis artículos (del 6 al 11) a desarrollarlos. ¿Por qué?',
        choices: [
          'Porque la diferenciación de responsabilidades se desarrolla en el anexo II',
          'Porque la gestión basada en los riesgos se desarrolla junto con los requisitos mínimos, en el artículo 14',
          'Porque el artículo 10 desarrolla a la vez la vigilancia continua y la reevaluación periódica',
          'Porque la prevención, detección, respuesta y conservación se reparten entre los artículos 8 y 9',
        ],
        answer: 2,
        explain:
          'El artículo 10 junta dos principios, el e) y el f): vigilancia continua y reevaluación periódica. La diferenciación de responsabilidades tiene su propio artículo, el 11, y el artículo 14 es el requisito mínimo de análisis y gestión de los riesgos, que no sustituye al principio del artículo 7.',
      },
    },
    { t: 'h', text: 'Política de seguridad y requisitos mínimos' },
    {
      t: 'p',
      md: 'El **artículo 12** abre el capítulo III con dos piezas. La primera es la **política de seguridad**, el documento que cada organización aprueba para fijar cómo gestiona su seguridad. El artículo 12.1 fija su contenido mínimo en seis letras: a) los **objetivos o la misión** de la organización; b) el **marco regulatorio** en el que se desarrollan sus actividades; c) los **roles o funciones** de seguridad; d) «la estructura y composición del comité o los comités para la gestión y coordinación de la seguridad»; e) las **directrices** para estructurar la documentación de seguridad; y f) «Los riesgos que se derivan del tratamiento de los datos personales», que enlaza con el artículo 3. La medida **org.1** del anexo II repite las cinco primeras (org.1.1 a org.1.5; en org.1.2 se habla de «marco legal y regulatorio»). El artículo 12.2 exige además que la política esté «formalmente aprobada por el órgano competente». El artículo 12.5 prevé que los municipios puedan apoyarse en una política común elaborada por la entidad «comarcal o provincial», y el 12.7 introduce la proporcionalidad.\n\nLa segunda pieza es la lista de **quince requisitos mínimos** del artículo 12.6, letras a) a ñ). Cada letra se desarrolla en un artículo propio, del **13 al 27**, en el mismo orden: a) organización e implantación del proceso de seguridad · b) análisis y gestión de los riesgos · c) gestión de personal · d) profesionalidad · e) autorización y control de los accesos · f) protección de las instalaciones · g) adquisición de productos de seguridad y contratación de servicios de seguridad · h) mínimo privilegio · i) integridad y actualización del sistema · j) protección de la información almacenada y en tránsito · k) prevención ante otros sistemas de información interconectados · l) registro de la actividad y detección de código dañino · m) incidentes de seguridad · n) continuidad de la actividad · ñ) mejora continua del proceso de seguridad. El **artículo 28** cierra el círculo: los requisitos se cumplen aplicando las medidas del anexo II según la categoría del sistema, y la relación de medidas elegidas se formaliza en la **Declaración de Aplicabilidad**, «firmado por el responsable de la seguridad».',
    },
    {
      t: 'links',
      title: 'Políticas y estructuras de gobierno, ya explicadas en Security+',
      items: [
        { label: 'Políticas, estándares, procedimientos y guías (lección sp5m1)', href: '/learn/sp5m1' },
        { label: 'Estructuras de gobernanza y roles sobre los datos (lección sp5m2)', href: '/learn/sp5m2' },
      ],
    },
    {
      t: 'check',
      q: {
        q: 'Al revisar el borrador de política de seguridad del Consorcio, se ve que describe la misión, el marco legal y los roles, pero no dice quién forma el Comité de Seguridad de la Información ni cómo se organiza. ¿Qué dice la norma?',
        choices: [
          'Nada: el comité es opcional y su composición se decide en un acta aparte',
          'Que la composición del comité se recoge en la Declaración de Aplicabilidad',
          'Que basta con nombrar al presidente del comité en la política',
          'Que la política debe recoger la estructura y composición del comité o los comités de seguridad',
        ],
        answer: 3,
        explain:
          'El artículo 12.1.d y la medida org.1.4 incluyen la estructura y composición del comité en el contenido mínimo de la política. La Declaración de Aplicabilidad (art. 28.2) es otra cosa: la relación de medidas del anexo II que se aplican al sistema.',
      },
    },
    { t: 'h', text: 'Los cuatro responsables y su separación' },
    {
      t: 'p',
      md: 'El principio de **diferenciación de responsabilidades** (art. 11) pide distinguir cuatro figuras y separar la seguridad de la explotación. El **artículo 13** reparte sus funciones. El **responsable de la información** «determinará los requisitos de la información tratada», y el **responsable del servicio** «determinará los requisitos de los servicios prestados». El **responsable de la seguridad** decide cómo satisfacer esos requisitos, supervisa su implantación e informa; además firma la Declaración de Aplicabilidad (art. 28.2). El **responsable del sistema** implanta la seguridad en el sistema y supervisa su operación diaria, y puede delegar en administradores u operadores. Al categorizar un sistema, el **artículo 41** reparte el trabajo: **valoran** los responsables de la información y del servicio, y **determina la categoría** el responsable de la seguridad. Cuando un servicio está externalizado, el artículo 13.5 exige, «salvo por causa justificada y documentada», que la organización que presta el servicio designe un **POC** («Punto o Persona de Contacto») para la seguridad.\n\nLa regla que más se pregunta es el **artículo 13.3**: el responsable de la seguridad «será distinto del responsable del sistema, no debiendo existir dependencia jerárquica entre ambos». Solo cabe una excepción, por «ausencia justificada de recursos», y exige **medidas compensatorias**. La razón es evidente: quien opera el sistema no debería ser quien se audita a sí mismo, ni quien manda sobre el que lo vigila.',
    },
    {
      t: 'table',
      headers: ['Rol del ENS', 'Qué hace', 'Quién lo ocupa en el Consorcio de Arcedo'],
      rows: [
        ['Responsable de la información', 'Determina los requisitos de la información tratada (art. 13.2); valora al categorizar (art. 41)', 'La Gerencia del Consorcio'],
        ['Responsable del servicio', 'Determina los requisitos de los servicios prestados (art. 13.2); valora al categorizar (art. 41)', 'La Secretaría General, para la sede electrónica y el registro electrónico'],
        ['Responsable de la seguridad', 'Decide cómo cumplir los requisitos, supervisa e informa; firma la Declaración de Aplicabilidad (art. 28.2); determina la categoría (art. 41)', 'La Unidad de Seguridad de la Información, que depende de la Gerencia y no del Servicio de Informática'],
        ['Responsable del sistema', 'Implanta la seguridad en el sistema y supervisa la operación diaria; puede delegar en administradores u operadores', 'La jefatura del Servicio de Informática y Comunicaciones'],
        ['Comité de seguridad', 'Gestión y coordinación de la seguridad; su estructura y composición van en la política (art. 12.1.d)', 'El Comité de Seguridad de la Información, presidido por la Gerencia'],
      ],
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'En el Consorcio de Arcedo: por qué la Unidad de Seguridad no cuelga de Informática',
      md: 'Cuando el Consorcio organizó su seguridad, lo cómodo habría sido crear la Unidad de Seguridad de la Información dentro del Servicio de Informática y Comunicaciones, que es donde están los técnicos. El artículo 13.3 lo impide: la jefatura de ese servicio es el **responsable del sistema**, y entre él y el **responsable de la seguridad** no puede haber dependencia jerárquica. Por eso la Unidad depende de la **Gerencia**. Así, cuando la Unidad firma la Declaración de Aplicabilidad del registro electrónico o analiza un informe de auditoría que señala fallos de configuración en el CPD, no está juzgando el trabajo de su propio jefe. El **delegado de protección de datos (DPD)** que ha designado el Consorcio es una persona distinta del responsable de la seguridad: sus funciones vienen del RGPD y se ven en la lección de protección de datos.',
    },
    {
      t: 'check',
      q: {
        q: '¿Quién determina los requisitos de la información tratada en un sistema sujeto al ENS?',
        choices: [
          'El responsable de la información',
          'El responsable de la seguridad',
          'El responsable del sistema',
          'El comité de seguridad',
        ],
        answer: 0,
        explain:
          'El artículo 13.2 atribuye al responsable de la información determinar los requisitos de la información tratada, igual que el responsable del servicio determina los de los servicios. El responsable de la seguridad no fija los requisitos: decide cómo satisfacerlos y, al categorizar, determina la categoría a partir de la valoración de los otros dos.',
      },
    },
    {
      t: 'check',
      q: {
        q: 'La Unidad de Seguridad de la Información del Consorcio ha seleccionado las medidas del anexo II para el sistema de gestión de nóminas. ¿Quién firma la Declaración de Aplicabilidad?',
        choices: [
          'La jefatura del Servicio de Informática y Comunicaciones, como responsable del sistema',
          'La Gerencia, como responsable de la información',
          'La Unidad de Seguridad de la Información, como responsable de la seguridad',
          'El delegado de protección de datos, porque el sistema trata datos personales',
        ],
        answer: 2,
        explain:
          'El artículo 28.2 dice que la relación de medidas se formaliza en la Declaración de Aplicabilidad, «firmado por el responsable de la seguridad», que en el Consorcio es la Unidad de Seguridad de la Información. El responsable del sistema implanta las medidas, pero no las declara, y el DPD no es ninguno de los cuatro responsables del ENS.',
      },
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Lo que se confunde a menudo',
      md: '**Base legal:** el ENS lo establece el **artículo 156.2** de la Ley 40/2015; el 156.1 es el de interoperabilidad. **Vigencia:** Real Decreto (RD) 311/2022, en vigor desde el **5-5-2022**; derogó el **RD 3/2010**. **Estructura:** **41 artículos, 7 capítulos, 4 anexos** (I categorías, II medidas, III auditoría, IV glosario). **Recuentos:** **siete principios** (art. 5) en **seis artículos** (6–11, porque el 10 junta vigilancia continua y reevaluación periódica); **quince requisitos mínimos** (art. 12.6, letras a–ñ) en los artículos **13–27**; **73 medidas** en el anexo II. **Ámbito:** el sector privado entra cuando presta servicios o provee soluciones al sector público (art. 2.3), con **su propia** política de seguridad; si sufre un incidente, notifica al **INCIBE-CERT**, el equipo de respuesta del Instituto Nacional de Ciberseguridad de España (INCIBE) para ciudadanos y entidades de derecho privado, que lo traslada al **CCN-CERT**, el «Computer Emergency Response Team» del CCN (arts. 33.1 y 33.7), mientras que las entidades públicas notifican al CCN los incidentes con «impacto significativo» (art. 33.2). **Roles:** **valoran** los responsables de la información y del servicio; **determina la categoría** y **firma la Declaración de Aplicabilidad** el responsable de la seguridad (arts. 41 y 28.2). **Artículo 13.3:** seguridad y sistema, **personas distintas y sin dependencia jerárquica**; la excepción solo cabe por «ausencia justificada de recursos» y con medidas compensatorias.',
    },
    { t: 'h', text: 'Resumen: los artículos clave de la lección' },
    {
      t: 'table',
      headers: ['Artículo', 'Qué regula'],
      rows: [
        ['Art. 1', 'Objeto: el ENS del art. 156.2 de la Ley 40/2015; siete propiedades que proteger'],
        ['Art. 2', 'Ámbito: sector público, información clasificada, sector privado que presta servicios al sector público (2.3) y, para las entidades públicas que despliegan redes o prestan servicios 5G, aplicación adicional del Real Decreto-ley 7/2022 (2.4)'],
        ['Art. 3', 'Sistemas con datos personales: RGPD y LOPDGDD; prevalecen las medidas más exigentes del análisis de riesgos o de la EIPD'],
        ['Art. 4', 'Definiciones: remite al glosario del anexo IV'],
        ['Art. 5', 'Enumera los siete principios básicos, desarrollados en los arts. 6–11'],
        ['Art. 10', 'Vigilancia continua y reevaluación periódica, en un mismo artículo'],
        ['Art. 11', 'Diferenciación de responsabilidades: los cuatro responsables'],
        ['Art. 12', 'Política de seguridad (12.1) y lista de quince requisitos mínimos (12.6)'],
        ['Art. 13', 'Organización del proceso de seguridad: funciones de los responsables; 13.3 seguridad distinta del sistema y sin dependencia jerárquica; 13.5 POC'],
        ['Arts. 13–27', 'Desarrollo de los quince requisitos mínimos, uno por artículo'],
        ['Art. 28', 'Cumplimiento de los requisitos con el anexo II; Declaración de Aplicabilidad firmada por el responsable de la seguridad'],
        ['Art. 41', 'Valoran los responsables de la información y del servicio; determina la categoría el responsable de la seguridad'],
        ['Disposición adicional segunda (DA 2.ª)', 'Desarrollo mediante instrucciones técnicas de seguridad y guías CCN-STIC de la serie 800'],
        ['Disposición derogatoria única (DD única)', 'Deroga el RD 3/2010'],
      ],
    },
  ],
  quiz: [
    {
      id: 'op6m1q1',
      domain: 'ENS y normativa',
      prompt:
        '¿Cuántos principios básicos enumera el artículo 5 del Real Decreto 311/2022 y en qué artículos se desarrollan?',
      choices: [
        'Siete principios, uno por artículo, en los artículos 6 a 12',
        'Siete principios, en los artículos 6 a 11',
        'Seis principios, en los artículos 6 a 11',
        'Quince principios, en los artículos 13 a 27',
      ],
      answer: 1,
      explain:
        'El artículo 5 enumera siete principios, letras a) a g), y se desarrollan en seis artículos, del 6 al 11, porque el 10 junta la vigilancia continua y la reevaluación periódica. Contar seis principios es el error de quien cuenta artículos en lugar de letras; el artículo 12 ya es la política de seguridad. Quince y los artículos 13 a 27 corresponden a los requisitos mínimos, no a los principios.',
    },
    {
      id: 'op6m1q2',
      domain: 'ENS y normativa',
      prompt:
        'Según el artículo 13.3 del Real Decreto 311/2022, ¿qué relación debe haber entre el responsable de la seguridad y el responsable del sistema?',
      choices: [
        'Deben ser distintos y sin dependencia jerárquica entre ambos; la excepción exige medidas compensatorias',
        'Deben ser distintos, pero el responsable de la seguridad debe depender del responsable del sistema para conocer la operación diaria',
        'Pueden ser la misma persona siempre que lo apruebe el comité de seguridad, sin más requisitos',
        'Deben ser distintos y el responsable del sistema debe depender jerárquicamente del de la seguridad',
      ],
      answer: 0,
      explain:
        'El artículo 13.3 dice que el responsable de la seguridad «será distinto del responsable del sistema, no debiendo existir dependencia jerárquica entre ambos», y la única excepción, por «ausencia justificada de recursos», exige medidas compensatorias. Las opciones con dependencia, en un sentido o en otro, tientan porque respetan que sean personas distintas, pero la norma prohíbe la dependencia jerárquica en los dos sentidos. Que lo apruebe el comité no basta para saltarse la regla.',
    },
    {
      id: 'op6m1q3',
      domain: 'ENS y normativa',
      prompt:
        '¿Qué artículo del Real Decreto 311/2022 incluye en su ámbito al sector privado que presta servicios o provee soluciones al sector público?',
      choices: [
        'El artículo 3, sobre los sistemas que tratan datos personales',
        'El artículo 33, sobre la capacidad de respuesta a incidentes',
        'El artículo 2, sobre el ámbito de aplicación',
        'El artículo 38, sobre los procedimientos de determinación de la conformidad',
      ],
      answer: 2,
      explain:
        'El artículo 2 fija el ámbito, y su apartado 3 incluye a las empresas privadas que prestan servicios o proveen soluciones al sector público por una relación contractual. El artículo 33 tienta porque también nombra a los privados, pero solo para decir a quién notifican sus incidentes (al INCIBE-CERT). El 3 regula el cruce con la protección de datos y el 38, la declaración y certificación de conformidad.',
    },
    {
      id: 'op6m1q4',
      domain: 'ENS y normativa',
      prompt:
        'El Consorcio de Arcedo contrata a una empresa privada el mantenimiento de la plataforma de su registro electrónico. ¿Cómo le afecta el ENS a esa empresa?',
      choices: [
        'No le afecta: el ENS solo obliga al sector público, y a la empresa le basta una certificación ISO/IEC 27001',
        'Le afecta, pero aplica directamente la política de seguridad del Consorcio, sin tener una propia',
        'Solo le afecta si el sistema trata información clasificada',
        'Le afecta: aplica el ENS con su propia política de seguridad, aprobada por su órgano de máximas competencias ejecutivas, y los pliegos deben exigirle la conformidad',
      ],
      answer: 3,
      explain:
        'El artículo 2.3 incluye a los privados que prestan servicios al sector público por contrato: aplican el ENS con su propia política, aprobada por el órgano con «las máximas competencias ejecutivas», y los pliegos deben exigir la conformidad, que se extenderá a la cadena de suministro en la medida necesaria según el análisis de riesgos. Usar la política del Consorcio tienta, pero la norma pide una política propia de la empresa. La información clasificada es otro supuesto distinto del mismo artículo.',
    },
    {
      id: 'op6m1q5',
      domain: 'ENS y normativa',
      prompt:
        'Hay que categorizar el registro electrónico del Consorcio. La Gerencia y la Secretaría General ya han valorado la información y el servicio. ¿Quién determina ahora la categoría del sistema?',
      choices: [
        'La jefatura del Servicio de Informática y Comunicaciones, como responsable del sistema',
        'La Unidad de Seguridad de la Información, como responsable de la seguridad',
        'La Secretaría General, como responsable del servicio',
        'El Comité de Seguridad de la Información, por votación',
      ],
      answer: 1,
      explain:
        'El artículo 41 separa las dos tareas: valoran los responsables de la información y del servicio, y determina la categoría el responsable de la seguridad, que en el Consorcio es la Unidad de Seguridad de la Información. La opción del responsable del servicio tienta porque ha participado, pero solo valorando. El responsable del sistema implanta las medidas, no categoriza.',
    },
    {
      id: 'op6m1q6',
      domain: 'ENS y normativa',
      prompt: '¿Cuántos requisitos mínimos enumera el Real Decreto 311/2022 y dónde se desarrollan?',
      choices: [
        'Siete, en los artículos 5 a 11',
        'Quince, enumerados en el artículo 5 y desarrollados en los artículos 6 a 20',
        'Quince, en las letras a) a ñ) del artículo 12.6, desarrollados uno por artículo en los artículos 13 a 27',
        'Setenta y tres, uno por cada medida del anexo II',
      ],
      answer: 2,
      explain:
        'El artículo 12.6 enumera quince requisitos mínimos, de la a) a la ñ), y cada uno tiene su artículo, del 13 al 27. El artículo 5 tienta porque también es una enumeración, pero la de los principios básicos. El anexo II contiene 73 medidas, que sirven para cumplir los requisitos (art. 28) pero no son los requisitos. Siete y los artículos 5 a 11 son los principios básicos.',
    },
    {
      id: 'op6m1q7',
      domain: 'ENS y normativa',
      prompt:
        'Para ganar agilidad, la jefatura del Servicio de Informática y Comunicaciones propone que la Unidad de Seguridad de la Información pase a depender de ella. ¿Qué responde la norma?',
      choices: [
        'Se puede, porque el ENS solo exige que sean personas distintas',
        'Se puede si lo aprueba el Comité de Seguridad de la Información',
        'No se puede, porque el responsable de la seguridad debe depender de la Secretaría General',
        'No se puede: responsable de la seguridad y responsable del sistema no pueden tener dependencia jerárquica entre ellos',
      ],
      answer: 3,
      explain:
        'La jefatura de Informática es el responsable del sistema y la Unidad, el de la seguridad; el artículo 13.3 exige que sean distintos y sin dependencia jerárquica, y el artículo 11 pide separar la seguridad de la explotación. Que basten personas distintas es la lectura incompleta que tienta. Lo que prohíbe el artículo 13.3 es la dependencia entre esos dos responsables, y su única excepción exige una «ausencia justificada de recursos» y medidas compensatorias, que no es el caso; en el Consorcio, la Unidad depende de la Gerencia.',
    },
    {
      id: 'op6m1q8',
      domain: 'ENS y normativa',
      prompt: '¿Qué regula cada anexo del Real Decreto 311/2022?',
      choices: [
        'Anexo I, medidas de seguridad; anexo II, categorías; anexo III, auditoría; anexo IV, glosario',
        'Anexo I, categorías; anexo II, medidas de seguridad; anexo III, glosario; anexo IV, auditoría',
        'Anexo I, categorías; anexo II, medidas de seguridad; anexo III, modelo de política de seguridad; anexo IV, glosario',
        'Anexo I, categorías; anexo II, medidas de seguridad; anexo III, auditoría de la seguridad; anexo IV, glosario',
      ],
      answer: 3,
      explain:
        'El real decreto tiene cuatro anexos: I, categorías de seguridad de los sistemas; II, medidas de seguridad; III, auditoría de la seguridad; IV, glosario. Intercambiar I y II es el error más habitual, porque se categoriza antes de elegir medidas. No hay ningún anexo con un modelo de política: su contenido mínimo está en el artículo 12.1 y en la medida org.1.',
    },
  ],
};
