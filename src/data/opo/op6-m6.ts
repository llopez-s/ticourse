import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// OP6M6 — Gobierno de la seguridad
// Fuente: Real Decreto 311/2022 (BOE-A-2022-7191), versión consolidada de 7-11-2024
// (arts. 12, 13, 14, 16, 27, 28, 31, 32, DA 2.ª; anexo II org.1–org.4, op.pl.1, op.pl.2,
// op.mon.2; anexo III 1.1); ITS de Informe del Estado de la Seguridad (BOE-A-2016-10108);
// índice oficial de la serie CCN-STIC 800; páginas públicas de ISO/IEC 27001:2022 y 27002:2022.
// Dossier: docs/superpowers/sources/2026-11-26-op6-fuentes.md, §1, §2, §3 y §13.
// Decisión del controlador: no se dan la estructura de cláusulas de ISO/IEC 27001 ni el número
// o los temas de los controles de ISO/IEC 27002 (⚠ sin fuente en el dossier).
// ---------------------------------------------------------------------------
export const OP6_M6: Module = {
  id: 'op6m6',
  sectionId: 'op6',
  title: 'Gobierno de la seguridad',
  minutes: 22,
  objectives: [
    'Identificar qué piezas del Real Decreto 311/2022 forman el gobierno de la seguridad: política (art. 12), organización y roles (art. 13), riesgos (art. 14), profesionalidad (art. 16) y mejora continua (art. 27)',
    'Encadenar los cuatro documentos del marco organizativo del anexo II: política (org.1), normativa (org.2), procedimientos (org.3) y proceso de autorización (org.4)',
    'Explicar cómo se mide la seguridad: el sistema de métricas (op.mon.2), el informe del estado del artículo 32 y su comunicación «al menos con carácter anual»',
    'Saber quién aprueba, firma o valida cada pieza: la política, la Declaración de Aplicabilidad, la categoría y los procedimientos',
    'Distinguir el ENS, obligatorio para el sector público, de ISO/IEC 27001 (requisitos de un SGSI, certificable) e ISO/IEC 27002 (guía de controles), que son voluntarias',
    'Usar la serie CCN-STIC 800 como mapa: saber a qué guía acudir para cada tarea de gobierno',
  ],
  blocks: [
    {
      t: 'p',
      md: 'Las lecciones anteriores han dicho **qué** protege el ENS y **con qué medidas**. Esta responde a otra pregunta: **quién decide, con qué documentos, cómo se mide y cómo se mejora**. Eso es el gobierno de la seguridad, y el Real Decreto 311/2022 lo reparte entre varios artículos de los capítulos III y IV, las cuatro medidas del **marco organizativo** del anexo II y algunos requisitos del anexo III sobre auditoría. El Consorcio Provincial de Arcedo ya tiene sus piezas colocadas: el **Comité de Seguridad de la Información**, presidido por la Gerencia; la Gerencia como responsable de la información; la Secretaría General como responsable del servicio de la sede electrónica y el registro electrónico; la **Unidad de Seguridad de la Información**, que depende de la Gerencia, como responsable de la seguridad; y la jefatura del Servicio de Informática y Comunicaciones como responsable del sistema. Aquí se ve cómo trabajan juntas. La gestión de riesgos y la auditoría en general ya están explicadas en Security+: esta lección solo cuenta lo que el ENS añade.',
    },
    { t: 'h', text: 'Los requisitos mínimos que son de gobierno' },
    {
      t: 'p',
      md: 'El **artículo 12.6** enumera **quince requisitos mínimos**, letras a) a ñ), que se desarrollan uno por artículo entre el 13 y el 27. La mayoría son técnicos u operativos (accesos, instalaciones, registro de actividad, continuidad…), pero cinco son claramente de gobierno: dicen cómo se organiza, se dota de personal y se mejora el proceso de seguridad, no qué se configura en un equipo. Y el artículo 12.7 añade la regla que los une a todos: los requisitos se exigen **en proporción a los riesgos** identificados en cada sistema.',
    },
    {
      t: 'table',
      headers: ['Requisito mínimo (art. 12.6)', 'Se desarrolla en', 'Qué pide'],
      rows: [
        ['a) Organización e implantación del proceso de seguridad', 'Art. 13', 'Funciones de los responsables de la información, del servicio, de la seguridad y del sistema; el de la seguridad, distinto del del sistema y sin dependencia jerárquica entre ambos (13.3); un **POC** (punto o persona de contacto) en los servicios externalizados (13.5)'],
        ['b) Análisis y gestión de los riesgos', 'Art. 14', 'Cada organización analiza y gestiona sus propios riesgos con una «metodología reconocida internacionalmente»'],
        ['d) Profesionalidad', 'Art. 16', 'Personal cualificado, dedicado e instruido en **todas las fases** del ciclo de vida; exigir profesionales cualificados a quien preste servicios de seguridad; fijar requisitos de formación y experiencia por puesto'],
        ['g) Adquisición de productos de seguridad y contratación de servicios de seguridad', 'Art. 19', 'Productos con funcionalidad de seguridad certificada; papel del Organismo de Certificación del CCN (Centro Criptológico Nacional)'],
        ['ñ) Mejora continua del proceso de seguridad', 'Art. 27', 'El proceso integral de seguridad se actualiza y mejora de forma continua, con criterios y métodos reconocidos en la práctica nacional e internacional'],
      ],
    },
    {
      t: 'p',
      md: 'Dos detalles se preguntan a menudo. El **artículo 16** enumera las fases del ciclo de vida en las que hace falta personal cualificado: planificación, diseño, adquisición, construcción, despliegue, explotación, mantenimiento, gestión de incidencias y desmantelamiento. Es decir, la profesionalidad no se limita a quien administra los servidores. Y el **artículo 27** no impone ninguna norma concreta para mejorar: remite a «los criterios y métodos reconocidos en la práctica nacional e internacional» de gestión de la seguridad. Es la puerta por la que encajan sistemas de gestión como el de ISO/IEC 27001, que se ve al final de la lección.',
    },
    {
      t: 'check',
      q: {
        q: 'El Comité de Seguridad de la Información del Consorcio quiere que el pliego del nuevo contrato de vigilancia de la red exija que la empresa adjudicataria aporte personal cualificado. ¿En qué requisito mínimo del ENS se apoya?',
        choices: [
          'En la mejora continua del proceso de seguridad (art. 27)',
          'En la profesionalidad (art. 16), que obliga a exigir profesionales cualificados a quien presta servicios de seguridad',
          'En la gestión de personal (art. 15)',
          'En el mínimo privilegio (art. 20)',
        ],
        answer: 1,
        explain:
          'El artículo 16.2 obliga a exigir, de forma objetiva y no discriminatoria, que las organizaciones que prestan servicios de seguridad cuenten con profesionales cualificados. La gestión de personal (art. 15) tienta porque también habla de personas, pero el requisito que menciona expresamente a quien presta servicios de seguridad es el de profesionalidad. La mejora continua (art. 27) trata de actualizar el proceso de seguridad, y el mínimo privilegio regula permisos.',
      },
    },
    { t: 'h', text: 'La política de seguridad: qué es y quién la aprueba' },
    {
      t: 'p',
      md: 'Lo que debe contener la política ya se vio en la primera lección del bloque: los seis extremos del **artículo 12.1**, letras a) a f). Aquí importa un detalle: la medida **org.1** del anexo II recoge solo los cinco primeros (org.1.1 a org.1.5) y concreta que el comité debe describirse con «las personas integrantes»; la letra f), «los riesgos que se derivan del tratamiento de los datos personales», solo está en el artículo.\n\nEl **artículo 12.2** dice quién la aprueba: cada administración pública, y cada órgano o entidad **con personalidad jurídica propia** del ámbito del artículo 2, cuenta con una política de seguridad **formalmente aprobada por el órgano competente**. El Consorcio, como entidad con personalidad jurídica propia, cuenta con su propia política, aprobada por su órgano competente. No la firma el responsable de la seguridad, que firma otra cosa, la Declaración de Aplicabilidad (art. 28.2), y no la valida el CCN.',
    },
    {
      t: 'check',
      q: {
        q: 'Al cotejar el borrador de política del Consorcio con la medida org.1 del anexo II, la Unidad de Seguridad de la Información ve que cumple las cinco letras de org.1. ¿Qué extremo del artículo 12.1 podría faltarle todavía?',
        choices: [
          'El nombre del producto de cortafuegos que se usará en el CPD (centro de proceso de datos)',
          'La categoría de cada sistema del Consorcio',
          'Los riesgos que se derivan del tratamiento de los datos personales (art. 12.1.f)',
          'La relación de medidas del anexo II que se aplican, firmada por el responsable de la seguridad',
        ],
        answer: 2,
        explain:
          'El artículo 12.1 tiene seis letras y org.1 recoge las cinco primeras; la letra f), los riesgos del tratamiento de datos personales, solo está en el artículo. La relación de medidas firmada por el responsable de la seguridad es la Declaración de Aplicabilidad (art. 28.2), un documento distinto; y la categoría de cada sistema se determina con el anexo I, no en la política.',
      },
    },
    { t: 'h', text: 'De la política al procedimiento: el marco organizativo del anexo II' },
    {
      t: 'p',
      md: 'La política no baja sola hasta el puesto de trabajo. El anexo II la desarrolla con cuatro medidas del **marco organizativo [org]**, y las cuatro se aplican en **todas las categorías**, BÁSICA, MEDIA y ALTA, sin refuerzos que dependan de la categoría. Funcionan como una cadena: cada documento se apoya en el anterior y es más concreto que él. La **política** dice qué se quiere conseguir y quién responde; la **normativa** dice qué está permitido y qué no, y qué pasa si se incumple; los **procedimientos** dicen cómo se hace cada tarea y quién la hace; y el **proceso de autorización** controla qué entra en el sistema y con permiso de quién.',
    },
    {
      t: 'table',
      headers: ['Medida', 'Documento', 'Qué debe recoger (anexo II)', 'Ejemplo en el Consorcio'],
      rows: [
        ['`org.1`', 'Política de seguridad', 'Objetivos o misión, marco legal y regulatorio, roles con sus deberes y su designación, estructura del comité con sus integrantes, directrices de la documentación', 'La política aprobada por el órgano competente, que nombra al Comité de Seguridad de la Información y a los cuatro responsables'],
        ['`org.2`', 'Normativa de seguridad', 'Uso correcto de equipos, servicios e instalaciones y lo que se considera uso indebido; responsabilidad del personal: derechos, deberes y medidas disciplinarias. Refuerzo R1: documentación según las guías CCN-STIC aplicables', 'La normativa de uso del correo, de los equipos portátiles y de la red de la sede central y las oficinas comarcales'],
        ['`org.3`', 'Procedimientos de seguridad', 'Cómo hacer las tareas habituales, quién hace cada una, cómo identificar y reportar comportamientos anómalos y cómo tratar la información según su nivel (acceso, almacenamiento, copias, etiquetado de soportes, transmisión). Refuerzo R1: validación por la autoridad correspondiente', 'El procedimiento de alta y baja de usuarios en la gestión de expedientes, o el de copias de seguridad del CPD'],
        ['`org.4`', 'Proceso de autorización', 'Proceso formal para usar instalaciones, poner en producción equipos y aplicaciones, establecer enlaces con otros sistemas, usar medios de comunicación, soportes y equipos móviles, y usar servicios de terceros', 'La autorización previa para poner en producción una nueva aplicación de nóminas o para conectar los portátiles del centro de formación de Valdecierzo'],
      ],
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Se confunde a menudo: normativa y procedimiento',
      md: 'Si el documento dice **qué se puede y qué no se puede hacer** y qué consecuencias tiene incumplirlo («las credenciales no se comparten; hacerlo puede dar lugar a medidas disciplinarias»), es **normativa (org.2)**. Si dice **cómo se hace una tarea, paso a paso, y quién la hace** («para dar de alta a un usuario, la jefatura del servicio lo solicita y el Servicio de Informática lo crea con estos permisos»), es un **procedimiento (org.3)**. Y si se trata de **pedir permiso para que algo entre en el sistema** (un equipo, una aplicación, un enlace, un servicio de un tercero), es el **proceso de autorización (org.4)**. El artículo 21 apunta en la misma dirección: dar de alta o cambiar un elemento del catálogo de activos requiere «autorización formal previa».',
    },
    {
      t: 'check',
      q: {
        q: 'El Servicio de Informática y Comunicaciones quiere establecer un enlace de comunicaciones permanente entre el registro electrónico del Consorcio y el sistema de otra administración. Según el anexo II, ¿qué medida exige que ese enlace pase antes por un trámite formal?',
        choices: [
          'org.3, porque todo enlace necesita un procedimiento escrito',
          'org.2, porque la normativa de seguridad regula el uso de los servicios',
          'org.1, porque la política debe enumerar todos los sistemas conectados',
          'org.4, el proceso de autorización, que cubre el establecimiento de enlaces de comunicaciones con otros sistemas',
        ],
        answer: 3,
        explain:
          'org.4.4 incluye expresamente en el proceso formal de autorizaciones el «establecimiento de enlaces de comunicaciones con otros sistemas». org.3 describe cómo operar lo que ya está en marcha y org.2 fija el uso correcto e indebido, pero ninguna de las dos es el permiso previo para conectar.',
      },
    },
    { t: 'h', text: 'Quién decide qué' },
    {
      t: 'p',
      md: 'El gobierno de la seguridad funciona si cada decisión tiene un dueño. El ENS reparte las firmas y aprobaciones de forma que nadie se controle a sí mismo: valoran la información y los servicios quienes responden de ellos, decide la categoría y las medidas quien responde de la seguridad, y opera el sistema quien no se supervisa a sí mismo. La política debe recoger, además, la **estructura y composición del comité o los comités** de seguridad, con su ámbito de responsabilidad y su relación con el resto de la organización (art. 12.1.d). La auditoría lo comprueba: según el **anexo III, apartado 1.1**, hay que constatar que la política define los roles, que existen **procedimientos para resolver conflictos** entre los responsables y que se han designado personas a la luz de la **diferenciación de responsabilidades**.',
    },
    {
      t: 'table',
      headers: ['Decisión', 'Quién (RD 311/2022)', 'En el Consorcio'],
      rows: [
        ['Aprobar la política de seguridad', 'El órgano competente (art. 12.2)', 'El órgano competente del Consorcio'],
        ['Aprobar las normas de seguridad (normativa, org.2)', 'La dirección o el órgano superior correspondiente (art. 15.2)', 'La dirección del Consorcio'],
        ['Valorar la información y los servicios', 'Responsables de la información y del servicio (art. 41)', 'La Gerencia y la Secretaría General'],
        ['Determinar la categoría del sistema', 'Responsable de la seguridad (art. 41)', 'La Unidad de Seguridad de la Información'],
        ['Firmar la Declaración de Aplicabilidad y aprobar medidas compensatorias', 'Responsable de la seguridad (art. 28.2 y 28.3)', 'La Unidad de Seguridad de la Información'],
        ['Implantar la seguridad y supervisar la operación diaria', 'Responsable del sistema (art. 13.2)', 'La jefatura del Servicio de Informática y Comunicaciones'],
        ['Validar los procedimientos de seguridad (si se aplica el refuerzo)', 'La autoridad correspondiente (org.3 R1)', 'Según lo que fije la política'],
      ],
    },
    {
      t: 'p',
      md: 'Gestionar los riesgos es la otra decisión de gobierno. El ENS no explica cómo se hace un análisis de riesgos (para eso está la lección de Security+), pero sí fija tres cosas: cada organización hace el suyo con una metodología reconocida internacionalmente (art. 14); la medida **op.pl.1** lo pide en todas las categorías y le añade el refuerzo R1 en MEDIA y el R2 en ALTA, que lo hacen semiformal y formal; y la auditoría comprueba que el análisis tiene «revisión y aprobación anual» (anexo III, 1.1.d).',
    },
    {
      t: 'links',
      title: 'Riesgos, gobernanza y auditoría en general: ya están en la pista de Security+',
      items: [
        { label: 'Gobernanza: políticas, estándares, procedimientos y guías (lección sp5m1)', href: '/learn/sp5m1' },
        { label: 'Estructuras de gobernanza y roles sobre los datos (lección sp5m2)', href: '/learn/sp5m2' },
        { label: 'Gestión de riesgos I: identificación, evaluación y análisis (lección sp5m3)', href: '/learn/sp5m3' },
        { label: 'Gestión de riesgos II: registro, apetito y estrategias (lección sp5m4)', href: '/learn/sp5m4' },
        { label: 'Auditorías y evaluaciones (lección sp5m7)', href: '/learn/sp5m7' },
      ],
    },
    { t: 'h', text: 'Medir para mejorar: métricas e informe del estado de la seguridad' },
    {
      t: 'p',
      md: 'Sin datos, la mejora continua del artículo 27 es una declaración de intenciones. El ENS la alimenta con tres piezas encadenadas. La primera es la medida **op.mon.2, sistema de métricas**, que se aplica en todas las categorías: recopila los datos necesarios para conocer el **grado de implantación** de las medidas y para proveer «el informe anual requerido por el artículo 32». En MEDIA y ALTA lleva dos refuerzos: R1 mide la efectividad del sistema de gestión de incidentes y R2 la eficiencia del sistema de seguridad «en términos de horas y presupuesto».\n\nLa segunda es el **artículo 32, informe del estado de la seguridad**. La **Comisión Sectorial de Administración Electrónica** recoge la información sobre las principales variables de seguridad de los sistemas para trazar un perfil general del estado de la seguridad; el **CCN** articula los procedimientos de recogida y la metodología; y las autoridades competentes usan los resultados para impulsar la mejora, con cuadros de mando e indicadores. El artículo **no fija periodicidad**.\n\nLa tercera es la **Instrucción Técnica de Seguridad (ITS) de Informe del Estado de la Seguridad** (Resolución de 7 de octubre de 2016, vigente): obliga a comunicar el estado de las principales variables «al menos con carácter anual»; lo hace el **responsable de la seguridad** mediante la herramienta **INES** (Informe Nacional del Estado de la Seguridad), con los datos que señala la guía **CCN-STIC 824**, y el manual de INES es la **CCN-STIC 844**. En el Consorcio, por tanto, quien lo envía es la Unidad de Seguridad de la Información. Y es natural que esos mismos indicadores sean los que la Unidad presente al Comité de Seguridad de la Información para que decida dónde invertir: es la forma práctica de cerrar el ciclo de mejora, aunque la norma no lo exige. Lo que sí dice el artículo 13.2.c es que el responsable de la seguridad «reportará» sobre el cumplimiento de los requisitos.',
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'De dónde sale cada plazo',
      md: '«**Anual**» para el informe del estado no está en el artículo 32: sale de la medida **op.mon.2** («informe anual requerido por el artículo 32») y de la **ITS de Informe del Estado** («al menos con carácter anual»). La **auditoría** ordinaria es «al menos cada dos años» (**art. 31**). El **análisis de riesgos** se revisa y aprueba **anualmente** (anexo III, 1.1.d). Y la **categoría** se reevalúa «anualmente, o siempre que se produzcan modificaciones significativas en los citados criterios de determinación» (anexo I). Cuatro plazos, cuatro fuentes distintas.',
    },
    {
      t: 'check',
      q: {
        q: 'La medida op.mon.2 del anexo II pide recopilar datos sobre el grado de implantación de las medidas. ¿Para qué informe dice expresamente que sirven?',
        choices: [
          'Para el informe anual del estado de la seguridad que requiere el artículo 32',
          'Para el informe de auditoría ordinaria del artículo 31',
          'Para la Declaración de Aplicabilidad del artículo 28',
          'Para la notificación de incidentes al CCN-CERT del artículo 33',
        ],
        answer: 0,
        explain:
          'op.mon.2 dice que los datos sirven, en su caso, «para proveer el informe anual requerido por el artículo 32». La auditoría del artículo 31 usa evidencias propias y tiene otra periodicidad, al menos cada dos años; la Declaración de Aplicabilidad no es un informe, sino la relación de medidas aplicables al sistema.',
      },
    },
    {
      t: 'p',
      md: 'El anexo II añade una escala para medir la **madurez** de la implantación, inspirada en el modelo CMM (modelo de madurez de capacidades): de L0 (inexistente) a L5 (optimizado), pasando por L1 inicial, L2 reproducible pero intuitivo, L3 proceso definido y L4 gestionado y medible. El mínimo exigido depende de la categoría: **L2 en BÁSICA, L3 en MEDIA y L4 en ALTA**. Es otra métrica que un comité puede seguir de un año a otro.',
    },
    { t: 'h', text: 'El sistema de gestión: el ENS y las normas ISO/IEC 27001 y 27002' },
    {
      t: 'p',
      md: 'El ENS pide algo muy parecido a un sistema de gestión, aunque sin citar ninguna norma ISO. El **anexo III, apartado 1.1.f**, manda comprobar en la auditoría que existe un «sistema de gestión de la seguridad de la información, documentado y con un proceso regular de aprobación por la dirección», tomando como base la **Declaración de Aplicabilidad** del artículo 28. Y la medida **op.pl.2, arquitectura de seguridad**, incorpora el sistema de gestión como refuerzo: en MEDIA se añade el R1, un sistema de gestión para planificar, organizar y controlar los recursos de seguridad, y en ALTA también el R2, un **SGSI** (sistema de gestión de la seguridad de la información) con actualización y aprobación periódica, más el R3, validación de datos.\n\nFuera del ENS hay dos normas internacionales que se citan siempre a su lado. **ISO/IEC 27001:2022** establece los **requisitos de un SGSI**; es la norma contra la que una organización puede **certificarse**, su edición vigente es la tercera, de octubre de 2022, y tiene una enmienda de 2024 sobre acción climática. **ISO/IEC 27002:2022** es una **guía de buenas prácticas y controles** de seguridad: la 27002 orienta sobre los controles; lo que se certifica es el SGSI según la 27001. La diferencia de fondo con el ENS es de obligatoriedad: el ENS es un real decreto que se aplica a **todo el sector público** y a los proveedores privados que le prestan servicios (art. 2), mientras que **las normas ISO son voluntarias**: una organización decide adoptarlas o certificarse.',
    },
    {
      t: 'table',
      headers: ['Marco', 'Qué es', 'Obligatoriedad', 'Cómo se demuestra'],
      rows: [
        ['ENS (RD 311/2022)', 'Principios básicos, requisitos mínimos y medidas de seguridad para la información y los servicios del sector público', 'Obligatorio para todo el sector público y para los privados que le prestan servicios (art. 2)', 'BÁSICA: autoevaluación y declaración de la conformidad; MEDIA o ALTA: auditoría para la certificación (art. 38)'],
        ['ISO/IEC 27001:2022', 'Requisitos de un sistema de gestión de la seguridad de la información (SGSI)', 'Voluntaria', 'Certificación del SGSI'],
        ['ISO/IEC 27002:2022', 'Guía de buenas prácticas y controles de seguridad de la información', 'Voluntaria', 'No es una norma de certificación: orienta la elección e implantación de controles'],
      ],
    },
    {
      t: 'p',
      md: 'Para quien ya tiene un SGSI según ISO/IEC 27001 y debe cumplir el ENS existe una guía específica, la **CCN-STIC 825** («ENS. Certificaciones 27001»), con un anexo independiente de correspondencia entre ISO 27001:2022 y el RD 311/2022, dado de alta en el índice oficial en julio de 2023. Su existencia indica que las dos cosas se relacionan pero no son lo mismo: el ENS se exige por su ámbito de aplicación, con sus categorías, sus 73 medidas y su propio procedimiento de conformidad.',
    },
    {
      t: 'check',
      q: {
        q: 'Una empresa que gestiona el CPD de otra entidad pública alega que, como tiene certificado su SGSI según ISO/IEC 27001, ya no le hace falta el ENS para prestar ese servicio. ¿Qué es correcto?',
        choices: [
          'Tiene razón: la certificación ISO/IEC 27001 equivale por ley a la certificación de conformidad con el ENS',
          'No: el ENS se aplica al sector privado que presta servicios al sector público (art. 2.3), y su conformidad se acredita con el procedimiento del artículo 38; la ISO es voluntaria',
          'Tiene razón si además aplica todos los controles de ISO/IEC 27002',
          'No, porque las normas ISO están prohibidas en el sector público',
        ],
        answer: 1,
        explain:
          'El artículo 2.3 extiende el ENS a los privados que prestan servicios al sector público, y los pliegos deben exigirles la conformidad con el ENS, que se acredita por el artículo 38 (declaración o certificación según la categoría). El real decreto no menciona ninguna norma ISO, así que no hay equivalencia legal. Las normas ISO no están prohibidas: son voluntarias y compatibles, y para relacionarlas existe la guía CCN-STIC 825.',
      },
    },
    { t: 'h', text: 'La serie CCN-STIC 800 como mapa' },
    {
      t: 'p',
      md: 'La **disposición adicional segunda** del real decreto prevé que el ENS se desarrolle con **instrucciones técnicas de seguridad**, de obligado cumplimiento, y con **guías CCN-STIC, particularmente de la serie 800**. Las guías no tienen la fuerza obligatoria de las instrucciones técnicas: son el material de apoyo del CCN para aplicar el ENS. Esta tabla no resume su contenido, solo indica a cuál acudir para cada tarea, según su título en el índice oficial del CCN-CERT y lo que dicen de ellas las normas que las citan.',
    },
    {
      t: 'table',
      headers: ['Guía', 'Título en el índice oficial', 'Para qué se consulta'],
      rows: [
        ['CCN-STIC 801', 'ENS. Responsabilidades y Funciones', 'Organizar los roles y la diferenciación de responsabilidades'],
        ['CCN-STIC 802', 'ENS. Guía de auditorías de cumplimiento', 'Preparar o realizar la auditoría del artículo 31'],
        ['CCN-STIC 803', 'ENS. Valoración de los sistemas', 'Valorar dimensiones y categorizar (el anexo I remite a guías CCN-STIC para los criterios)'],
        ['CCN-STIC 804', 'Medidas de implantación del ENS', 'Implantar las medidas del anexo II'],
        ['CCN-STIC 805', 'ENS. Política de Seguridad de la Información', 'Redactar la política de seguridad (org.1)'],
        ['CCN-STIC 808', 'ENS. Verificación del cumplimiento', 'Verificar el cumplimiento de las medidas'],
        ['CCN-STIC 809', 'Declaración, certificación y aprobación provisional de conformidad con el ENS y distintivos de cumplimiento', 'Declarar o certificar la conformidad y usar los distintivos'],
        ['CCN-STIC 817', 'Gestión de Ciberincidentes', 'Clasificar los incidentes por nivel de impacto potencial (la ITS de Notificación manda usarla)'],
        ['CCN-STIC 819', 'Medidas Compensatorias', 'Justificar una medida compensatoria (art. 28.3)'],
        ['CCN-STIC 821 y 822', 'Normas de Seguridad en el ENS · Procedimientos de Seguridad', 'Redactar la normativa (org.2) y los procedimientos (org.3)'],
        ['CCN-STIC 824', 'Información del Estado de Seguridad', 'Saber qué datos pide INES para el informe del estado (art. 32)'],
        ['CCN-STIC 825', 'ENS. Certificaciones 27001', 'Relacionar un SGSI según ISO/IEC 27001 con el ENS'],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'La Unidad de Seguridad de la Información del Consorcio prepara por primera vez el envío del estado de la seguridad a través de INES. ¿Qué guía CCN-STIC señala la ITS de Informe del Estado como referencia de los datos que hay que aportar?',
        choices: [
          'La CCN-STIC 817, de gestión de ciberincidentes',
          'La CCN-STIC 803, de valoración de los sistemas',
          'La CCN-STIC 824, de información del estado de seguridad',
          'La CCN-STIC 825, de certificaciones 27001',
        ],
        answer: 2,
        explain:
          'La ITS de Informe del Estado dice que los datos que se comunican mediante INES son los que señala la guía CCN-STIC 824 (y el manual de la herramienta es la CCN-STIC 844). La 817 la cita otra instrucción, la de Notificación de Incidentes, para clasificar el impacto; la 803 sirve para categorizar.',
      },
    },
    { t: 'h', text: 'Resumen: artículos y anexos clave' },
    {
      t: 'table',
      headers: ['Artículo', 'Qué regula'],
      rows: [
        ['Art. 12', 'Política de seguridad: definición y seis extremos mínimos (12.1 a–f); aprobación formal por el órgano competente (12.2); quince requisitos mínimos (12.6); proporcionalidad (12.7)'],
        ['Art. 13', 'Organización e implantación del proceso de seguridad: funciones de los cuatro responsables; seguridad y sistema separados y sin dependencia jerárquica (13.3)'],
        ['Art. 14', 'Análisis y gestión de los riesgos, con metodología reconocida internacionalmente'],
        ['Art. 16', 'Profesionalidad: personal cualificado en todo el ciclo de vida; exigirlo a los proveedores de servicios de seguridad'],
        ['Art. 27', 'Mejora continua del proceso de seguridad'],
        ['Art. 28', 'Declaración de Aplicabilidad firmada por el responsable de la seguridad (28.2); medidas compensatorias (28.3)'],
        ['Art. 31', 'Auditoría ordinaria al menos cada dos años y extraordinaria ante modificaciones sustanciales'],
        ['Art. 32', 'Informe del estado de la seguridad: lo recoge la Comisión Sectorial de Administración Electrónica; el CCN articula los procedimientos; sin periodicidad en el artículo'],
        ['DA 2.ª', 'Desarrollo del ENS: instrucciones técnicas de seguridad y guías CCN-STIC, particularmente de la serie 800'],
        ['Anexo II · org.1–org.4', 'Marco organizativo: política, normativa, procedimientos y proceso de autorización, en todas las categorías'],
        ['Anexo II · op.mon.2', 'Sistema de métricas: grado de implantación y datos para el informe anual del artículo 32'],
        ['Anexo II · op.pl.2', 'Arquitectura de seguridad; refuerzos de sistema de gestión (R1, MEDIA) y SGSI con actualización y aprobación periódica (R2, ALTA), más validación de datos (R3, ALTA)'],
        ['Anexo III · 1.1', 'Qué constata la auditoría: roles en la política, resolución de conflictos, diferenciación de responsabilidades, análisis de riesgos con revisión y aprobación anual, cumplimiento del anexo II y SGSI documentado'],
      ],
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Lo que más se confunde en esta lección',
      md: '**La política la aprueba el órgano competente** (art. 12.2); la **Declaración de Aplicabilidad la firma el responsable de la seguridad** (art. 28.2). **org.1 tiene cinco apartados**; el **artículo 12.1, seis**: el sexto son los riesgos del tratamiento de datos personales. **Normativa (org.2)** es lo permitido y lo prohibido; **procedimiento (org.3)**, cómo y quién; **autorización (org.4)**, el permiso previo para que algo entre en el sistema. El **artículo 27** es la mejora continua; el **10**, la vigilancia continua y la reevaluación periódica. En el **informe del estado**, la entidad comunica sus datos por **INES** (lo hace el **responsable de la seguridad**), «al menos con carácter anual» según la ITS, y la **Comisión Sectorial de Administración Electrónica** elabora el perfil general. **ISO/IEC 27001** fija los requisitos de un SGSI y es certificable; **ISO/IEC 27002** es una guía de controles; ambas son **voluntarias**, y el ENS, **obligatorio** para el sector público.',
    },
  ],
  quiz: [
    {
      id: 'op6m6q1',
      domain: 'ENS y normativa',
      prompt: '¿Qué artículo del Real Decreto 311/2022 regula la mejora continua del proceso de seguridad?',
      choices: [
        'El artículo 10',
        'El artículo 14',
        'El artículo 27',
        'El artículo 32',
      ],
      answer: 2,
      explain:
        'El artículo 27 desarrolla el requisito mínimo ñ), «Mejora continua del proceso de seguridad», último de la lista del artículo 12.6. El artículo 10 tienta porque habla de vigilancia continua y reevaluación periódica, pero son principios básicos, no el requisito de mejora. El 14 es el análisis y gestión de riesgos y el 32, el informe del estado de la seguridad.',
    },
    {
      id: 'op6m6q2',
      domain: 'ENS y normativa',
      prompt:
        '¿Qué medida del anexo II exige documentos que describan el uso correcto de equipos, servicios e instalaciones, lo que se considera uso indebido y las medidas disciplinarias por incumplirlo?',
      choices: [
        'org.1, Política de seguridad',
        'org.2, Normativa de seguridad',
        'org.3, Procedimientos de seguridad',
        'org.4, Proceso de autorización',
      ],
      answer: 1,
      explain:
        'org.2.1 y org.2.2 piden documentar el uso correcto e indebido y la responsabilidad del personal, con derechos, deberes y medidas disciplinarias. org.3 tienta porque también son documentos, pero describen cómo hacer las tareas y quién las hace, no lo permitido y lo prohibido. La política fija objetivos, marco y roles.',
    },
    {
      id: 'op6m6q3',
      domain: 'ENS y normativa',
      prompt:
        'Según la Instrucción Técnica de Seguridad de Informe del Estado de la Seguridad, ¿con qué periodicidad mínima se comunica el estado de las principales variables de seguridad?',
      choices: [
        'Al menos con carácter anual',
        'Al menos cada dos años, coincidiendo con la auditoría ordinaria',
        'Cada seis meses',
        'Con la periodicidad que fija el artículo 32 del real decreto, que es trimestral',
      ],
      answer: 0,
      explain:
        'La ITS (apartado III.2) obliga a comunicarlo «al menos con carácter anual», y la medida op.mon.2 habla del «informe anual requerido por el artículo 32». Los dos años son el plazo de la auditoría ordinaria (art. 31), no del informe. Y el artículo 32 no fija ninguna periodicidad, ni trimestral ni otra.',
    },
    {
      id: 'op6m6q4',
      domain: 'ENS y normativa',
      prompt:
        'El centro de formación de Valdecierzo quiere empezar a usar una plataforma de formación en línea contratada a una empresa externa. ¿Qué medida del marco organizativo exige que ese uso pase antes por un proceso formal de autorización?',
      choices: [
        'org.1, porque la política debe enumerar los servicios contratados',
        'org.3, porque hace falta un procedimiento para usar la plataforma',
        'org.2, porque la normativa regula el uso de los servicios',
        'org.4, que incluye la utilización de servicios de terceros bajo contrato o convenio',
      ],
      answer: 3,
      explain:
        'org.4.8 incluye en el proceso formal de autorizaciones la «utilización de servicios de terceros, bajo contrato o convenio, concesión, encargo, etc.». La normativa (org.2) y los procedimientos (org.3) regularán después cómo se usa la plataforma, pero el permiso previo para que entre en el sistema es el proceso de autorización.',
    },
    {
      id: 'op6m6q5',
      domain: 'ENS y normativa',
      prompt:
        'En el Consorcio de Arcedo, ¿quién debe comunicar el estado de la seguridad mediante la herramienta INES?',
      choices: [
        'La jefatura del Servicio de Informática y Comunicaciones, como responsable del sistema',
        'La Unidad de Seguridad de la Información, como responsable de la seguridad',
        'La Gerencia, como responsable de la información',
        'El delegado de protección de datos',
      ],
      answer: 1,
      explain:
        'La ITS de Informe del Estado (apartado III.3) atribuye la comunicación al responsable de la seguridad, mediante INES, y en el Consorcio ese papel lo tiene la Unidad de Seguridad de la Información. El responsable del sistema tienta porque gestiona la operación y tiene muchos de los datos, pero no es quien informa. El DPD asesora en protección de datos, no en el estado del ENS.',
    },
    {
      id: 'op6m6q6',
      domain: 'ENS y normativa',
      prompt: '¿Qué afirmación sobre ISO/IEC 27001:2022 e ISO/IEC 27002:2022 es correcta?',
      choices: [
        'La 27001 establece los requisitos de un sistema de gestión de la seguridad de la información y es certificable; la 27002 es una guía de controles',
        'La 27002 establece los requisitos del SGSI y la 27001 es la guía de controles',
        'Las dos son obligatorias para el sector público español porque el ENS las incorpora',
        'La 27002:2022 sustituyó a la 27001, que dejó de estar vigente en 2022',
      ],
      answer: 0,
      explain:
        'La 27001 da los requisitos del SGSI, que es lo que se certifica, y la 27002 orienta sobre los controles. Intercambiarlas es el error típico. El RD 311/2022 no menciona ninguna norma ISO, así que no las hace obligatorias: son voluntarias. Y cada una sustituyó a su propia edición de 2013, no la una a la otra.',
    },
    {
      id: 'op6m6q7',
      domain: 'ENS y normativa',
      prompt:
        'Según el artículo 12 del Real Decreto 311/2022, ¿cómo debe aprobarse la política de seguridad de una entidad con personalidad jurídica propia, como el Consorcio?',
      choices: [
        'Mediante la firma del responsable de la seguridad, igual que la Declaración de Aplicabilidad',
        'Con la validación previa del CCN, que la publica',
        'Formalmente, por el órgano competente',
        'Por la Comisión Sectorial de Administración Electrónica',
      ],
      answer: 2,
      explain:
        'El artículo 12.2 exige que cada órgano o entidad con personalidad jurídica propia cuente con una política de seguridad «formalmente aprobada por el órgano competente». La firma del responsable de la seguridad corresponde a la Declaración de Aplicabilidad (art. 28.2). El CCN valida y publica perfiles de cumplimiento específicos (art. 30), no políticas, y la Comisión Sectorial recoge el informe del estado (art. 32).',
    },
    {
      id: 'op6m6q8',
      domain: 'ENS y normativa',
      prompt:
        'Según el anexo III del Real Decreto 311/2022, la auditoría debe constatar que se ha realizado un análisis de riesgos. ¿Con qué condición?',
      choices: [
        'Revisado cada dos años, al ritmo de la auditoría ordinaria',
        'Revisado solo cuando se produzcan modificaciones sustanciales del sistema',
        'Aprobado una sola vez, al categorizar el sistema',
        'Con revisión y aprobación anual',
      ],
      answer: 3,
      explain:
        'El anexo III, apartado 1.1.d, pide constatar «que se ha realizado un análisis de riesgos, con revisión y aprobación anual». Los dos años y las modificaciones sustanciales tientan porque son la periodicidad de la auditoría ordinaria y el motivo de la extraordinaria (art. 31), no la del análisis de riesgos. Y la gestión de riesgos es una actividad continua (art. 7), no un trámite único.',
    },
  ],
};
