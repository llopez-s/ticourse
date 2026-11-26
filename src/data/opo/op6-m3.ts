import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// OP6M3 — Las medidas del anexo II
// Fuente única: docs/superpowers/sources/2026-11-26-op6-fuentes.md (§1.1, §1.5, §14)
// RD 311/2022, texto consolidado del BOE (versión de 7-11-2024).
// ---------------------------------------------------------------------------
export const OP6_M3: Module = {
  id: 'op6m3',
  sectionId: 'op6',
  title: 'Las medidas del anexo II',
  minutes: 22,
  objectives: [
    'Nombrar los tres bloques del anexo II (marco organizativo, marco operacional y medidas de protección), sus grupos y el recuento de 73 medidas',
    'Seguir los pasos del apartado 2.1 del anexo II para seleccionar medidas por categoría o por dimensión y leer las celdas de la tabla («aplica», «n.a.», refuerzos y alternativas)',
    'Distinguir medidas compensatorias (artículo 28.3), adicionales (artículo 28.2 y refuerzos opcionales) y complementarias (solo información clasificada, artículo 2.2)',
    'Relacionar cada categoría con su nivel mínimo de madurez (BÁSICA L2, MEDIA L3, ALTA L4)',
    'Reconocer por su código y su nombre literal las medidas que más se citan: op.exp.8, op.cont.1–4, op.acc.6, mp.info.4, mp.info.6 y otras',
  ],
  blocks: [
    {
      t: 'p',
      md: 'El **anexo II** del Real Decreto 311/2022, que regula el Esquema Nacional de Seguridad (**ENS**), es la parte que convierte los quince requisitos mínimos del artículo 12.6 en algo que se puede implantar y auditar: una tabla de **73 medidas de seguridad**, cada una con su código, su nombre y la columna que dice cuándo se exige. El artículo 28.1 manda aplicarlas según los activos del sistema, su **categoría** (artículo 40 y anexo I) y los riesgos; el artículo 28.2 obliga a dejar por escrito qué medidas se aplican en la **Declaración de Aplicabilidad**, «firmado por el responsable de la seguridad». En el Consorcio Provincial de Arcedo ese papel lo tiene la **Unidad de Seguridad de la Información**, que depende de la Gerencia y no del Servicio de Informática. Esta lección recorre la tabla, enseña a leer sus celdas y repasa los códigos que se citan una y otra vez.',
    },
    { t: 'h', text: 'Tres bloques y sus grupos' },
    {
      t: 'p',
      md: 'El anexo II reparte las medidas en tres grandes bloques, con nombre y abreviatura literales: **Marco organizativo [org]**, **Marco operacional [op]** y **Medidas de protección [mp]**. El marco organizativo es el más corto, cuatro medidas que fijan las reglas del juego (política, normativa, procedimientos y proceso de autorización). El marco operacional protege la **operación** del sistema: cómo se planifica, quién entra, cómo se explota, qué se contrata fuera, cómo se sigue funcionando ante un desastre y cómo se vigila. Las medidas de protección se centran en **activos concretos**: instalaciones, personas, equipos, comunicaciones, soportes, aplicaciones, información y servicios. El recuento oficial es **org 4 + op 33 + mp 36 = 73**.',
    },
    {
      t: 'table',
      headers: ['Marco', 'Grupo (código y nombre)', 'Medidas'],
      rows: [
        ['Marco organizativo [org]', '`org` — sin subgrupos: org.1 a org.4', '4'],
        ['Marco operacional [op]', '`op.pl` Planificación', '5'],
        ['Marco operacional [op]', '`op.acc` Control de acceso', '6'],
        ['Marco operacional [op]', '`op.exp` Explotación', '10'],
        ['Marco operacional [op]', '`op.ext` Recursos externos', '4'],
        ['Marco operacional [op]', '`op.nub` Servicios en la nube', '1'],
        ['Marco operacional [op]', '`op.cont` Continuidad del servicio', '4'],
        ['Marco operacional [op]', '`op.mon` Monitorización del sistema', '3'],
        ['Medidas de protección [mp]', '`mp.if` Protección de las instalaciones e infraestructuras', '7'],
        ['Medidas de protección [mp]', '`mp.per` Gestión del personal', '4'],
        ['Medidas de protección [mp]', '`mp.eq` Protección de los equipos', '4'],
        ['Medidas de protección [mp]', '`mp.com` Protección de las comunicaciones', '4'],
        ['Medidas de protección [mp]', '`mp.si` Protección de los soportes de información', '5'],
        ['Medidas de protección [mp]', '`mp.sw` Protección de las aplicaciones informáticas', '2'],
        ['Medidas de protección [mp]', '`mp.info` Protección de la información', '6'],
        ['Medidas de protección [mp]', '`mp.s` Protección de los servicios', '4'],
      ],
    },
    {
      t: 'p',
      md: 'Las cuatro medidas organizativas son `org.1` **Política de seguridad**, `org.2` **Normativa de seguridad**, `org.3` **Procedimientos de seguridad** y `org.4` **Proceso de autorización**, y las cuatro se exigen en todas las categorías. La ficha de `org.1` enumera lo que debe contener la política: objetivos o misión, marco legal y regulatorio, roles o funciones, la estructura del comité o los comités (en el Consorcio, el Comité de Seguridad de la Información, presidido por la Gerencia) y las directrices de la documentación. `org.2` regula el uso correcto e indebido de equipos, servicios e instalaciones y la responsabilidad del personal; `org.3` dice cómo se hacen las tareas habituales, quién las hace y cómo se informa de un comportamiento anómalo; y `org.4` exige autorización para poner en marcha instalaciones, equipos en producción, aplicaciones, enlaces, soportes, equipos móviles o servicios de terceros.',
    },
    {
      t: 'check',
      q: {
        q: 'Las medidas `mp.per` del anexo II tratan de la gestión del personal: caracterización del puesto, deberes y obligaciones, concienciación y formación. ¿En qué marco están?',
        choices: [
          'En el marco organizativo [org], junto a la normativa de seguridad',
          'En el marco operacional [op], porque el personal opera el sistema',
          'En las medidas de protección [mp], como uno de sus ocho grupos',
          'En ningún marco: son requisitos mínimos del artículo 12.6, no medidas',
        ],
        answer: 2,
        explain:
          'El prefijo lo dice: `mp.per` **Gestión del personal** es uno de los ocho grupos de las medidas de protección, junto a `mp.if`, `mp.eq`, `mp.com`, `mp.si`, `mp.sw`, `mp.info` y `mp.s`. El marco operacional tienta por la palabra «operar», pero sus grupos son `op.pl`, `op.acc`, `op.exp`, `op.ext`, `op.nub`, `op.cont` y `op.mon`. La gestión de personal sí es también un requisito mínimo (artículo 12.6.c), y el anexo II lo desarrolla con estas medidas.',
      },
    },
    { t: 'h', text: 'Cómo se seleccionan: por categoría o por dimensión' },
    {
      t: 'p',
      md: 'El apartado 2.1 del anexo II marca cinco pasos, de la letra a) a la e): identificar los **tipos de activos**; decidir qué **dimensiones** son relevantes (Confidencialidad [C], Integridad [I], Trazabilidad [T], Autenticidad [A] y Disponibilidad [D]); fijar el **nivel** de cada dimensión (BAJO, MEDIO o ALTO); deducir la **categoría** del sistema (BÁSICA, MEDIA o ALTA); y, por último, seleccionar medidas y refuerzos «de acuerdo con las dimensiones y sus niveles de seguridad y para determinadas medidas de seguridad, de acuerdo con la categoría». Esa última frase es la clave de toda la tabla: **cada medida se rige por una sola de las dos vías**, y la tercera columna dice cuál. Si pone «Categoría», se miran las columnas BÁSICA, MEDIA y ALTA; si pone una o varias iniciales (por ejemplo «D», «T» o «C I T A»), se mira el nivel de esa o esas dimensiones, **aunque la categoría del sistema sea otra**. Si una medida depende de varias dimensiones y estas tienen niveles distintos, la tabla no dice cuál manda.',
    },
    {
      t: 'p',
      md: 'Las celdas usan las convenciones del apartado 2.5. «**aplica**» significa que la medida se exige tal cual. «**n.a.**» significa «no aplica» a efectos de cumplimiento en ese nivel o categoría. **R1, R2…** son **refuerzos** que se suman a la medida (por eso aparecen con «+»), y la norma advierte que «no siempre son incrementales entre sí»: R3 no contiene a R2. Una expresión entre corchetes como `[R1 o R2]` obliga a **elegir uno** de los refuerzos de la lista. La tabla además va coloreada: verde para lo que se exige desde BÁSICA, amarillo desde MEDIA y rojo solo en ALTA. Dos válvulas completan el sistema: un subsistema con un nivel distinto puede **segregarse** del resto (apartado 2.2), y las guías CCN-STIC pueden fijar **perfiles de cumplimiento específicos** (apartado 2.3 y artículo 30), que valida y publica el Centro Criptológico Nacional (**CCN**).',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Leer dos filas de la tabla con un sistema hipotético',
      text: `Hipótesis: un sistema que trate datos de salud laboral del personal
  Niveles:  C = ALTO   I = MEDIO   T = MEDIO   A = MEDIO   D = MEDIO
  Categoría: ALTA (basta con que una dimensión, C, llegue a ALTO)

op.exp.6  Protección frente a código dañino   -> se exige por Categoría
          columna ALTA:  + R1 + R2 + R3 + R4   (R4 = herramientas EDR, Endpoint Detection and Response)

op.cont.2 Plan de continuidad                 -> se exige por D
          D = MEDIO:     n.a.
          (solo con D en ALTO: aplica)

La categoría ALTA no arrastra a op.cont.2: esa fila solo mira la disponibilidad.`,
    },
    {
      t: 'check',
      q: {
        q: 'Supón un sistema que trate datos de salud laboral del personal y que sea de categoría ALTA porque su confidencialidad es ALTO, pero su disponibilidad es MEDIO. ¿Exige el anexo II la medida `op.cont.2` Plan de continuidad?',
        choices: [
          'Sí, porque en un sistema de categoría ALTA se aplican todas las medidas de la columna roja',
          'No, porque `op.cont.2` se exige por la dimensión D y solo aplica con disponibilidad ALTO',
          'Sí, pero sin refuerzos, porque la disponibilidad es MEDIO',
          'No, porque el plan de continuidad es una medida organizativa que decide el comité',
        ],
        answer: 1,
        explain:
          'La tercera columna de `op.cont.2` dice «D»: se mira el nivel de disponibilidad, no la categoría. Con D MEDIO la celda dice «n.a.»; solo con D ALTO aplica. La primera opción tienta porque mezcla las dos vías, pero la categoría solo gobierna las medidas marcadas «Categoría». Con D MEDIO sí se exige `op.cont.1` Análisis de impacto.',
      },
    },
    { t: 'h', text: 'Compensatorias, adicionales y complementarias' },
    {
      t: 'p',
      md: 'Tres adjetivos parecidos y tres cosas distintas. Las **medidas compensatorias** son las del **artículo 28.3**: sustituyen a una medida del anexo II que no se puede aplicar, siempre que se justifique documentalmente que protegen **«igual o mejor»** el riesgo, y las **aprueba formalmente el responsable de la seguridad**. Las **medidas adicionales** amplían lo mínimo: el artículo 28.2 permite al responsable de la seguridad añadir medidas a las exigidas, y el apartado 2.6.e del anexo II prevé refuerzos opcionales que se aplican «como medidas adicionales» si el análisis de riesgos lo recomienda. El artículo 3 apunta en la misma dirección para los datos personales: si el análisis de riesgos del artículo 24 del Reglamento General de Protección de Datos (**RGPD**) o la evaluación de impacto relativa a la protección de datos (**EIPD**) del artículo 35 piden medidas más exigentes, **prevalecen** sobre las del anexo II. Y **«medidas complementarias de seguridad»** solo aparece en el **artículo 2.2**, para los sistemas que tratan **información clasificada**; no es una categoría general de medidas del ENS.',
    },
    {
      t: 'callout',
      kind: 'warn',
      title: 'Las compensatorias también salen en el artículo 13.3',
      md: 'El artículo 13.3 exige que el responsable de la seguridad sea distinto del responsable del sistema y admite una excepción con «medidas compensatorias». Ese uso es otro: compensa la falta de separación entre esos dos roles. Cuando se habla de **sustituir una medida del anexo II**, el artículo es el **28.3**. Qué desarrolla la guía CCN-STIC 819 «Medidas Compensatorias» no se trata aquí: solo consta su título.',
    },
    {
      t: 'check',
      q: {
        q: 'En el registro de entrada del Consorcio hay una aplicación antigua que no admite la medida exigida. El Servicio de Informática propone otra medida que, según su análisis, protege igual el mismo riesgo. ¿Qué hace falta para que valga como medida compensatoria?',
        choices: [
          'Que la apruebe la jefatura del Servicio de Informática, como responsable del sistema',
          'Que la autorice el CCN mediante un perfil de cumplimiento específico',
          'Nada más: basta con anotarla en el inventario de activos',
          'Justificar documentalmente que protege igual o mejor y que la apruebe formalmente el responsable de la seguridad',
        ],
        answer: 3,
        explain:
          'El artículo 28.3 pide dos cosas: justificación de que la medida protege «igual o mejor» y aprobación formal del responsable de la seguridad, que en el Consorcio es la Unidad de Seguridad de la Información. Tienta el responsable del sistema porque es quien la propone e implanta, pero no quien la aprueba. Los perfiles de cumplimiento específicos (artículo 30) son otra figura.',
      },
    },
    { t: 'h', text: 'Niveles mínimos de madurez' },
    {
      t: 'p',
      md: 'Cumplir una medida no es solo tenerla: el apartado 6 del anexo II mide **cómo de asentada** está con un modelo de madurez de capacidad (*Capability Maturity Model*, **CMM**), con niveles de L0 a L5, y fija un **mínimo por categoría**. Un sistema de categoría BÁSICA debe llegar al menos a **L2**; uno de categoría MEDIA, a **L3**; y uno de categoría ALTA, a **L4**. Nadie exige L5.',
    },
    {
      t: 'table',
      headers: ['Nivel', 'Nombre en el anexo II', 'Mínimo exigido a'],
      rows: [
        ['L0', 'Inexistente', '—'],
        ['L1', 'Inicial/Ad hoc', '—'],
        ['L2', 'Reproducible pero intuitivo', 'Categoría **BÁSICA**'],
        ['L3', 'Proceso definido', 'Categoría **MEDIA**'],
        ['L4', 'Gestionado y medible', 'Categoría **ALTA**'],
        ['L5', 'Optimizado', '—'],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'Supón dos sistemas: la web informativa del Consorcio, de categoría BÁSICA, y un sistema hipotético con alguna dimensión en ALTO, y por tanto de categoría ALTA. ¿Qué niveles mínimos de madurez exige el anexo II a cada uno?',
        choices: [
          'L1 a la web y L3 al sistema de categoría ALTA',
          'L2 a la web y L4 al sistema de categoría ALTA',
          'L2 a la web y L5 al sistema de categoría ALTA',
          'L3 a los dos, porque la madurez no depende de la categoría',
        ],
        answer: 1,
        explain:
          'El apartado 6 del anexo II fija BÁSICA → L2, MEDIA → L3 y ALTA → L4. La tercera opción tienta porque L5 es el nivel más alto del modelo, pero ninguna categoría lo exige. El mínimo sí depende de la categoría: es lo que ese apartado regula.',
      },
    },
    { t: 'h', text: 'Los códigos que más se citan' },
    {
      t: 'table',
      headers: ['Código', 'Nombre literal', 'Se exige por', 'Lo que hay que recordar'],
      rows: [
        ['`op.pl.1`', 'Análisis de riesgos', 'Categoría', 'Aplica en BÁSICA; + R1 en MEDIA; + R2 en ALTA'],
        ['`op.pl.5`', 'Componentes certificados', 'Categoría', '«n.a.» en BÁSICA; aplica desde MEDIA'],
        ['`op.acc.1`', 'Identificación', 'T A', 'Aplica desde BAJO; + R1 en MEDIO y ALTO'],
        ['`op.acc.3`', 'Segregación de funciones y tareas', 'C I T A', '«n.a.» en BAJO; aplica desde MEDIO'],
        ['`op.acc.6`', 'Mecanismo de autenticación (usuarios de la organización)', 'C I T A', 'Ya en BAJO: + [R1 o R2 o R3 o R4] + R8 + R9 (R8 doble factor desde zonas no controladas; R9 acceso remoto)'],
        ['`op.exp.1`', 'Inventario de activos', 'Categoría', 'Aplica en las tres categorías'],
        ['`op.exp.5`', 'Gestión de cambios', 'Categoría', '«n.a.» en BÁSICA; aplica en MEDIA; + R1 en ALTA'],
        ['`op.exp.6`', 'Protección frente a código dañino', 'Categoría', 'En ALTA + R1 + R2 + R3 + R4; R4 son herramientas EDR (Endpoint Detection and Response)'],
        ['`op.exp.7`', 'Gestión de incidentes', 'Categoría', 'R1 Notificación: «ventanilla única» para notificar al CCN-CERT'],
        ['`op.exp.8`', 'Registro de la actividad', 'T', 'Va por trazabilidad, no por categoría; el RD no fija tiempo de retención'],
        ['`op.exp.9`', 'Registro de la gestión de incidentes', 'Categoría', 'Aplica en las tres categorías'],
        ['`op.ext.3`', 'Protección de la cadena de suministro', 'Categoría', 'Solo en ALTA'],
        ['`op.cont.1`', 'Análisis de impacto', 'D', 'Desde D MEDIO'],
        ['`op.cont.2`–`4`', 'Plan de continuidad · Pruebas periódicas · Medios alternativos', 'D', 'Solo con D ALTO'],
        ['`op.mon.2`', 'Sistema de métricas', 'Categoría', 'Su ficha lo destina al «informe anual requerido por el artículo 32» (el artículo 32 no fija periodicidad)'],
        ['`mp.if.6`', 'Protección frente a inundaciones', 'D', '«n.a.» en BAJO; aplica desde MEDIO (incendios, `mp.if.5`, aplica siempre)'],
        ['`mp.eq.2`', 'Bloqueo de puesto de trabajo', 'A', '«n.a.» en BAJO; aplica desde MEDIO'],
        ['`mp.info.2`', 'Calificación de la información', 'C', 'Desde MEDIO; la información no clasificada con restricciones se marca «USO OFICIAL»'],
        ['`mp.info.3`', 'Firma electrónica', 'I A', 'Admite cualquier firma del ordenamiento, «entre ellos, los sistemas de código seguro de verificación»'],
        ['`mp.info.4`', 'Sellos de tiempo', 'T', 'Solo con T ALTO'],
        ['`mp.info.6`', 'Copias de seguridad', 'D', 'R1 pruebas de recuperación; R2 al menos una copia «en lugar diferente» (en D ALTO)'],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'Supón que el sistema de gestión de cursos del centro de formación de Valdecierzo tiene confidencialidad, integridad, trazabilidad y autenticidad en nivel BAJO. Parte del personal se conecta a él desde casa. ¿Qué dice la fila de `op.acc.6` para ese nivel?',
        choices: [
          'Nada: los refuerzos de autenticación solo aparecen desde el nivel MEDIO',
          'Que basta con una contraseña, porque R1 Contraseñas está entre las opciones',
          'Uno de R1 a R4 a elegir, y además R8, doble factor desde zonas no controladas, y R9, acceso remoto',
          'Solo R5 Registro, porque el acceso remoto se trata en `op.ext.4`',
        ],
        answer: 2,
        explain:
          'La celda de nivel BAJO de `op.acc.6` es «+ [R1 o R2 o R3 o R4] + R8 + R9»: se elige un mecanismo y, además, R8 (doble factor para acceso desde o a través de zonas no controladas) y R9 (acceso remoto). La segunda opción tienta porque R1 es una de las opciones del corchete, pero R8 y R9 se suman siempre. R5 Registro aparece desde MEDIO.',
      },
    },
    {
      t: 'links',
      title: 'Controles compensatorios y análisis de riesgos: ya están en la pista de Security+',
      items: [
        { label: 'Categorías y tipos de controles, incluidos los compensatorios (lección sp1m1)', href: '/learn/sp1m1' },
        { label: 'Gestión de riesgos: identificación, evaluación y análisis (lección sp5m3)', href: '/learn/sp5m3' },
      ],
    },
    { t: 'h', text: 'Resumen de artículos y apartados' },
    {
      t: 'table',
      headers: ['Artículo', 'Qué regula'],
      rows: [
        ['Artículo 2.2', 'Sistemas con información clasificada: único lugar donde aparecen las «medidas complementarias de seguridad»'],
        ['Artículo 3', 'Datos personales: prevalecen las medidas del análisis de riesgos del RGPD o de la EIPD si son más exigentes'],
        ['Artículo 13.3', 'Separación entre responsable de la seguridad y del sistema; excepción con medidas compensatorias'],
        ['Artículo 28.1', 'Las medidas del anexo II se aplican según activos, categoría y riesgos'],
        ['Artículo 28.2', 'Declaración de Aplicabilidad, firmada por el responsable de la seguridad; medidas adicionales'],
        ['Artículo 28.3', 'Medidas compensatorias: justificadas, protegen «igual o mejor», aprobadas formalmente por el responsable de la seguridad'],
        ['Artículo 30', 'Perfiles de cumplimiento específicos, que valida y publica el CCN'],
        ['Anexo II, apartado 2.1', 'Cinco pasos de selección: activos, dimensiones, niveles, categoría, medidas y refuerzos'],
        ['Anexo II, apartado 2.2', 'Segregación de subsistemas con otro nivel'],
        ['Anexo II, apartado 2.5', 'Convenciones de la tabla: «aplica», «n.a.», refuerzos «+», alternativas «[Rn o Rn+1]», colores'],
        ['Anexo II, apartado 2.6.e', 'Refuerzos opcionales aplicados «como medidas adicionales» si el análisis de riesgos lo recomienda'],
        ['Anexo II, apartado 6', 'Madurez L0–L5; mínimo L2 (BÁSICA), L3 (MEDIA), L4 (ALTA)'],
      ],
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Lo que se confunde a menudo',
      md: '**Recuento:** 73 medidas en tres bloques, org 4, op 33 y mp 36. **Vía de exigencia:** si la tercera columna dice «Categoría», mira BÁSICA/MEDIA/ALTA; si dice una o varias dimensiones, mira su nivel aunque la categoría sea otra (si esas dimensiones tienen niveles distintos, la tabla no dice cuál manda) (`op.cont.2` con D MEDIO no aplica en un sistema ALTA). **Corchetes:** `[R2 o R3 o R4]` es elegir uno; lo que va fuera del corchete con «+» se suma siempre. **Refuerzos:** no siempre son incrementales entre sí. **Compensatorias:** artículo 28.3, «igual o mejor», las aprueba el responsable de la seguridad (no el del sistema). **Complementarias:** solo información clasificada (artículo 2.2). **Adicionales:** artículo 28.2 y apartado 2.6.e. **Madurez:** BÁSICA L2, MEDIA L3, ALTA L4. **Códigos con trampa:** `op.exp.8` Registro de la actividad (T) frente a `op.exp.9` Registro de la gestión de incidentes (categoría); `mp.info.3` Firma electrónica frente a `mp.info.4` Sellos de tiempo (solo T ALTO). La guía CCN-STIC 804 se titula «Medidas de implantación del ENS»; aquí solo consta su título.',
    },
  ],
  quiz: [
    {
      id: 'op6m3q1',
      domain: 'ENS y normativa',
      prompt: '¿Cuántas medidas recoge la tabla del anexo II del RD 311/2022 y en qué tres bloques se agrupan?',
      choices: [
        '114 medidas, en marco organizativo, marco operacional y medidas de protección',
        '73 medidas, en marco organizativo [org], marco operacional [op] y medidas de protección [mp]',
        '73 medidas, en medidas organizativas, compensatorias y complementarias',
        '75 medidas, en marco organizativo, marco operacional y marco físico',
      ],
      answer: 1,
      explain:
        'La tabla del anexo II tiene 73 medidas: 4 del marco organizativo, 33 del operacional y 36 de protección. La tercera opción tienta porque acierta la cifra, pero compensatorias y complementarias no son bloques de la tabla: las compensatorias sustituyen medidas (artículo 28.3) y las complementarias solo existen para información clasificada (artículo 2.2). La cifra de 114 no sale del ENS.',
    },
    {
      id: 'op6m3q2',
      domain: 'ENS y normativa',
      prompt:
        '¿Qué artículo del RD 311/2022 permite sustituir una medida del anexo II por otras medidas, y con qué condición?',
      choices: [
        'El artículo 2.2, siempre que sean medidas complementarias aprobadas por el CCN',
        'El artículo 13.3, si el responsable del sistema autoriza la sustitución',
        'El artículo 28.2, que permite al responsable del sistema elegir las medidas de la Declaración de Aplicabilidad',
        'El artículo 28.3, si se justifica que protegen igual o mejor el riesgo y las aprueba formalmente el responsable de la seguridad',
      ],
      answer: 3,
      explain:
        'Las medidas compensatorias que sustituyen a una del anexo II están en el artículo 28.3: justificación de que protegen «igual o mejor» y aprobación formal del responsable de la seguridad. El artículo 13.3 tienta porque también menciona medidas compensatorias, pero para la excepción a la separación entre responsable de la seguridad y del sistema, no para sustituir medidas. El 28.2 regula la Declaración de Aplicabilidad, que firma el responsable de la seguridad, y el 2.2 trata la información clasificada.',
    },
    {
      id: 'op6m3q3',
      domain: 'ENS y normativa',
      prompt:
        'Según el apartado 6 del anexo II, ¿qué nivel mínimo de madurez se exige a un sistema de categoría MEDIA?',
      choices: ['L3, Proceso definido', 'L2, Reproducible pero intuitivo', 'L4, Gestionado y medible', 'L5, Optimizado'],
      answer: 0,
      explain:
        'El apartado 6 del anexo II fija BÁSICA → L2, MEDIA → L3 y ALTA → L4. L2 tienta porque es el mínimo de la categoría inferior, y L4 porque es el de la superior; L5 no lo exige ninguna categoría.',
    },
    {
      id: 'op6m3q4',
      domain: 'ENS y normativa',
      prompt:
        'Supón un sistema que trate datos de salud laboral del personal con la disponibilidad en nivel MEDIO. De las medidas de continuidad del servicio (op.cont), ¿cuál le exige el anexo II?',
      choices: [
        'Las cuatro, op.cont.1 a op.cont.4, porque la continuidad se exige desde MEDIO',
        'Solo op.cont.2 Plan de continuidad',
        'Solo op.cont.1 Análisis de impacto',
        'Ninguna, porque las medidas de continuidad se exigen por categoría y no por dimensión',
      ],
      answer: 2,
      explain:
        'Las cuatro medidas op.cont se exigen por la dimensión D. Con D MEDIO solo aplica op.cont.1 Análisis de impacto; Plan de continuidad, Pruebas periódicas y Medios alternativos son «n.a.» salvo con D ALTO. La primera opción tienta porque el análisis de impacto sí empieza en MEDIO, pero el resto exige ALTO. La última opción falla porque la tercera columna de esas filas dice «D», no «Categoría».',
    },
    {
      id: 'op6m3q5',
      domain: 'ENS y normativa',
      prompt: 'En la tabla del anexo II, ¿qué medida es mp.info.4 y cuándo se exige?',
      choices: [
        'Firma electrónica, exigida por integridad y autenticidad desde el nivel BAJO',
        'Sellos de tiempo, exigida solo cuando la trazabilidad es de nivel ALTO',
        'Sellos de tiempo, exigida desde la categoría MEDIA',
        'Copias de seguridad, exigida por disponibilidad desde el nivel BAJO',
      ],
      answer: 1,
      explain:
        'mp.info.4 es Sellos de tiempo y se rige por la trazabilidad: «n.a.» en BAJO y MEDIO, aplica solo en ALTO. La tercera opción tienta porque acierta el nombre, pero esta medida no va por categoría. La primera describe bien mp.info.3 Firma electrónica, y la cuarta, mp.info.6 Copias de seguridad: son las medidas vecinas, no mp.info.4.',
    },
    {
      id: 'op6m3q6',
      domain: 'ENS y normativa',
      prompt:
        'En el Consorcio, el Servicio de Informática no puede aplicar una medida del anexo II en un sistema antiguo y propone una alternativa. ¿Quién debe aprobar formalmente esa medida compensatoria?',
      choices: [
        'La jefatura del Servicio de Informática y Comunicaciones, como responsable del sistema',
        'La Gerencia, como responsable de la información',
        'El delegado de protección de datos',
        'La Unidad de Seguridad de la Información, como responsable de la seguridad',
      ],
      answer: 3,
      explain:
        'El artículo 28.3 atribuye la aprobación formal de las medidas compensatorias al responsable de la seguridad, que en el Consorcio es la Unidad de Seguridad de la Información. La jefatura del Servicio de Informática tienta porque es quien propone e implanta la alternativa, pero el ENS separa precisamente seguridad y sistema. La Gerencia valora la información y el DPD asesora en protección de datos; ninguno aprueba compensatorias.',
    },
    {
      id: 'op6m3q7',
      domain: 'ENS y normativa',
      prompt:
        'En la tabla del anexo II, la celda de op.acc.5 Mecanismo de autenticación (usuarios externos) para el nivel MEDIO dice «+ [R2 o R3 o R4] + R5». Según las convenciones del apartado 2.5, ¿qué significa?',
      choices: [
        'Hay que aplicar R2, R3, R4 y R5, porque cada refuerzo contiene al anterior',
        'Basta con aplicar uno cualquiera de R2, R3, R4 o R5',
        'Hay que elegir uno de R2, R3 o R4 y aplicar además R5',
        'R2, R3 y R4 son opcionales y solo R5 es obligatorio',
      ],
      answer: 2,
      explain:
        'Los corchetes con «o» obligan a elegir uno de los refuerzos de la lista, y lo que va fuera con «+» se suma siempre: uno de R2, R3 o R4, más R5 Registro. La primera opción falla dos veces: el corchete no pide los tres y el apartado 2.5 advierte que los refuerzos «no siempre son incrementales entre sí». La cuarta tienta porque R5 sí es obligatorio, pero elegir uno del corchete también lo es.',
    },
    {
      id: 'op6m3q8',
      domain: 'ENS y normativa',
      prompt:
        'Supón que el sistema de registro de entrada del Consorcio es de categoría MEDIA y su trazabilidad es de nivel BAJO. ¿Qué exige el anexo II para op.exp.8 Registro de la actividad?',
      choices: [
        'La medida tal cual, sin refuerzos, porque se exige por la trazabilidad y esta es BAJO',
        'La medida con R1, R2, R3 y R4, que es lo que corresponde a la categoría MEDIA',
        'Nada, porque op.exp.8 solo se exige desde la categoría MEDIA con trazabilidad ALTO',
        'La medida con un tiempo de retención de los registros fijado por el propio anexo',
      ],
      answer: 0,
      explain:
        'op.exp.8 se rige por la dimensión T: con trazabilidad BAJO la celda dice «aplica», sin refuerzos. La segunda opción tienta porque «+ R1 + R2 + R3 + R4» es lo que figura en la columna central, pero esa columna se lee aquí como nivel MEDIO de T, no como categoría MEDIA. El anexo pide documentar el tiempo de retención (R3), pero no fija ninguno.',
    },
  ],
};
