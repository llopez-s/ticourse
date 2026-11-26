import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// OP6M2 — Categorizar un sistema (RD 311/2022, arts. 28, 30, 40 y 41; anexo I)
// ---------------------------------------------------------------------------
export const OP6_M2: Module = {
  id: 'op6m2',
  sectionId: 'op6',
  title: 'Categorizar un sistema',
  minutes: 22,
  objectives: [
    'Nombrar las cinco dimensiones de seguridad del anexo I (C, I, T, A, D) y distinguirlas de las siete propiedades del artículo 1',
    'Asignar un nivel BAJO, MEDIO o ALTO a cada dimensión con los criterios de perjuicio limitado, grave y muy grave del anexo I',
    'Aplicar la regla del anexo I para obtener la categoría BÁSICA, MEDIA o ALTA de un sistema que trata varias informaciones y presta varios servicios',
    'Identificar quién valora las dimensiones y quién determina la categoría (artículo 41) y cuándo hay que reevaluarla',
    'Explicar qué es la Declaración de Aplicabilidad del artículo 28, quién la firma y qué papel tienen las medidas adicionales y compensatorias',
    'Explicar qué es un perfil de cumplimiento específico según el artículo 30 y quién lo valida y publica',
  ],
  blocks: [
    {
      t: 'p',
      md: 'El Esquema Nacional de Seguridad (**ENS**, Real Decreto 311/2022) no exige lo mismo a todos los sistemas. Una web de noticias y un sistema que paga la nómina de la plantilla no corren los mismos riesgos, y el ENS lo traduce en una **categoría de seguridad**: **BÁSICA**, **MEDIA** o **ALTA**. Según el **artículo 40**, la categoría «modulará el equilibrio» entre la importancia de la información y de los servicios y el esfuerzo de seguridad requerido, «bajo el principio de proporcionalidad». Se determina valorando el impacto que tendría un incidente con perjuicio para la disponibilidad, la autenticidad, la integridad, la confidencialidad o la trazabilidad, por el procedimiento del **anexo I**. De la categoría dependen muchas cosas: qué medidas del anexo II se exigen (artículo 28), cómo se demuestra la conformidad (artículo 38) y qué nivel de madurez se pide. Esta lección recorre el procedimiento completo con sistemas del Consorcio Provincial de Arcedo.',
    },
    { t: 'h', text: 'Las cinco dimensiones' },
    {
      t: 'p',
      md: 'El anexo I fundamenta la categoría en el impacto que tendría un incidente sobre la capacidad de la organización para **a) alcanzar sus objetivos**, **b) proteger los activos a su cargo** y **c) garantizar la conformidad con el ordenamiento jurídico**. Ese impacto se mide por separado en cinco **dimensiones de seguridad**, que la norma identifica por su inicial en mayúsculas: **Confidencialidad [C]**, **Integridad [I]**, **Trazabilidad [T]**, **Autenticidad [A]** y **Disponibilidad [D]**. Cada dimensión es una pregunta distinta sobre el mismo sistema, y la respuesta pesa después: muchas medidas del anexo II no se exigen por la categoría, sino por el nivel de una dimensión concreta.',
    },
    {
      t: 'table',
      headers: ['Dimensión', 'Pregunta que se hace quien valora', 'Medidas del anexo II que se exigen por esa dimensión (ejemplos)'],
      rows: [
        ['**C** · Confidencialidad', '¿Qué perjuicio causaría que la información llegara a quien no debe conocerla?', '`mp.com.2` Protección de la confidencialidad · `mp.si.1` Marcado de soportes · `mp.info.2` Calificación de la información'],
        ['**I** · Integridad', '¿Qué perjuicio causaría que la información se alterase sin autorización?', '`mp.com.3` Protección de la integridad y de la autenticidad (I A) · `mp.si.2` Criptografía (C I)'],
        ['**T** · Trazabilidad', '¿Qué perjuicio causaría no poder saber quién hizo qué y cuándo?', '`op.exp.8` Registro de la actividad · `mp.info.4` Sellos de tiempo'],
        ['**A** · Autenticidad', '¿Qué perjuicio causaría no poder fiarse de quién es el origen o el usuario?', '`op.acc.1` Identificación (T A) · `mp.eq.2` Bloqueo de puesto de trabajo · `mp.info.3` Firma electrónica (I A)'],
        ['**D** · Disponibilidad', '¿Qué perjuicio causaría que la información o el servicio no estuvieran cuando se necesitan?', '`op.cont.1` a `op.cont.4` Continuidad del servicio · `mp.info.6` Copias de seguridad · `mp.s.4` Protección frente a denegación de servicio'],
      ],
    },
    {
      t: 'p',
      md: 'Una información o un servicio pueden verse afectados en una o en varias dimensiones. Cada dimensión afectada se adscribe a uno de tres **niveles de seguridad**: **BAJO**, **MEDIO** o **ALTO**. Si una dimensión no se ve afectada, **no se adscribe a ningún nivel**: una información que ya es pública, por ejemplo, no tiene nivel de confidencialidad. Cada nivel se define por la gravedad del perjuicio sobre las funciones de la organización, sobre sus activos o sobre las personas afectadas, y el anexo I lo concreta con cuatro rasgos (más un quinto, «otros de naturaleza análoga»).',
    },
    {
      t: 'table',
      headers: ['Nivel', 'Perjuicio', 'Capacidad de la organización', 'Activos', 'Leyes o regulaciones', 'Personas'],
      rows: [
        ['**BAJO**', '«perjuicio limitado»', 'Reducción «de forma apreciable», aunque las funciones sigan desempeñándose', '«daño menor»', 'Incumplimiento formal «subsanable»', 'Perjuicio menor, molesto pero «fácilmente reparable»'],
        ['**MEDIO**', '«perjuicio grave»', 'Reducción «significativa», aunque las funciones sigan desempeñándose', '«daño significativo»', 'Incumplimiento material, o formal no subsanable', 'Perjuicio significativo, «de difícil reparación»'],
        ['**ALTO**', '«perjuicio muy grave»', '«anulación efectiva» de la capacidad', 'Daño «muy grave, e incluso irreparable»', '«incumplimiento grave»', 'Perjuicio grave, «de difícil o imposible reparación»'],
      ],
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Lo que más se confunde: propiedades, dimensiones, niveles y categorías',
      md: 'El **artículo 1** enumera **siete propiedades** que protege el ENS: «el acceso, la confidencialidad, la integridad, la trazabilidad, la autenticidad, la disponibilidad y la conservación». El **anexo I** solo usa **cinco dimensiones** para categorizar: C, I, T, A y D. El acceso y la conservación **no son dimensiones**, y el no repudio no aparece como tal. Segunda trampa, la del vocabulario: los **niveles** (BAJO, MEDIO, ALTO) son de cada **dimensión**; las **categorías** (BÁSICA, MEDIA, ALTA) son del **sistema**. Un sistema «de nivel medio» o una dimensión «de categoría básica» son expresiones mal formadas.',
    },
    {
      t: 'check',
      q: {
        q: 'Si se filtrara el listado de cursos que ya publica el centro de formación de Valdecierzo en la web del Consorcio, no habría perjuicio alguno. ¿Qué nivel de confidencialidad tiene esa información?',
        choices: [
          'BAJO, porque es el nivel mínimo de cualquier dimensión',
          'Ninguno: la dimensión no se ve afectada y no se adscribe a ningún nivel',
          'BÁSICO, porque la información es pública',
          'MEDIO, porque toda información de una administración tiene ese nivel por defecto',
        ],
        answer: 1,
        explain:
          'El anexo I dice que, si una dimensión no se ve afectada, «no se adscribirá a ningún nivel». BAJO tienta porque parece el suelo, pero exige un perjuicio limitado, y aquí no hay ninguno. «Básico» mezcla vocabularios: BÁSICA es una categoría del sistema, no un nivel de una dimensión.',
      },
    },
    { t: 'h', text: 'De los niveles a la categoría: la regla del anexo I' },
    {
      t: 'p',
      md: 'La categoría se obtiene en **dos pasos** (anexo I, apartado 5). **Primero**, se fija el nivel de **cada información y cada servicio** en cada dimensión. Si el sistema trata varias informaciones y presta varios servicios, el nivel del sistema en cada dimensión es **el mayor de los establecidos para cada información y cada servicio**: no se hace media ni se cuenta cuántos hay de cada nivel. **Segundo**, se aplica la regla de la categoría: el sistema es de categoría **ALTA** si **alguna** de sus dimensiones alcanza el nivel ALTO; **MEDIA** si alguna alcanza MEDIO y ninguna supera ese nivel; y **BÁSICA** si alguna alcanza BAJO y ninguna supera ese nivel. Una sola dimensión basta para subir la categoría.',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'El procedimiento del anexo I en forma de algoritmo',
      text: `Paso 1 · para cada dimensión X en {C, I, T, A, D}:
            nivel_sistema[X] = el mayor de los niveles de X
                               de todas las informaciones y servicios
            (si ninguna información ni servicio se ve afectado en X: sin nivel)

Paso 2 · si   algún nivel_sistema[X] = ALTO               -> categoría ALTA
         si no, si algún nivel_sistema[X] = MEDIO          -> categoría MEDIA
         si no, si algún nivel_sistema[X] = BAJO           -> categoría BÁSICA

Después · la categoría NO cambia el nivel de las dimensiones
          que no influyeron en ella (anexo I, 4.2)`,
    },
    {
      t: 'table',
      headers: ['Categoría', 'Cuándo (anexo I, 4.1)', 'Conformidad (artículo 38)', 'Madurez mínima de las medidas (anexo II, apartado 6)'],
      rows: [
        ['**BÁSICA**', 'Alguna dimensión en BAJO y ninguna por encima', '«autoevaluación para su declaración de la conformidad» (puede certificarse igualmente)', 'L2 · Reproducible pero intuitivo'],
        ['**MEDIA**', 'Alguna dimensión en MEDIO y ninguna por encima', '«auditoría para la certificación»', 'L3 · Proceso definido'],
        ['**ALTA**', 'Alguna dimensión en ALTO', '«auditoría para la certificación»', 'L4 · Gestionado y medible'],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'Un sistema del Consorcio tiene estos niveles: C BAJO, I BAJO, T BAJO, A MEDIO y D BAJO. ¿Qué categoría le corresponde?',
        choices: [
          'BÁSICA, porque cuatro de las cinco dimensiones están en BAJO',
          'MEDIA, solo si la dimensión en MEDIO es la confidencialidad',
          'MEDIA, porque una dimensión alcanza MEDIO y ninguna llega a ALTO',
          'Hay que hacer la media de los cinco niveles para decidirlo',
        ],
        answer: 2,
        explain:
          'La regla del anexo I no cuenta mayorías ni promedia: basta con que alguna dimensión alcance MEDIO, y ninguna lo supere, para que el sistema sea de categoría MEDIA. Da igual qué dimensión sea; la autenticidad pesa lo mismo que la confidencialidad. La opción de la mayoría es el error más frecuente.',
      },
    },
    { t: 'h', text: 'Ejemplo resuelto: el sistema de gestión de nóminas' },
    {
      t: 'callout',
      kind: 'example',
      title: 'En el Consorcio de Arcedo: categorizar la gestión de nóminas, paso a paso',
      md: 'El sistema de **gestión de nóminas** del Consorcio funciona en el centro de proceso de datos (CPD) de la sede central. Trata **dos informaciones**: los **datos de nómina de la plantilla** (importes, retenciones y cuentas bancarias de cada persona) y las **tablas salariales y el calendario de pagos**, que ya son públicos. Presta **dos servicios**: el **cálculo y pago mensual** de la nómina y la **consulta de recibos** por la plantilla desde la intranet. La valoración que sigue es la que hacen los responsables del Consorcio con los criterios del anexo I; otra organización podría razonar distinto en algún nivel. Lo que es norma es el método: cada nivel se justifica con el tipo de perjuicio y el resultado sale de aplicar la regla.\n\n**Paso 1 · valorar cada información y cada servicio.** Una filtración de los datos de nómina causaría a cada persona un perjuicio significativo y de difícil reparación (C **MEDIO**). Si alguien alterase un importe o una cuenta bancaria, el pago iría a un sitio equivocado: daño significativo en los activos (I **MEDIO**). No poder reconstruir quién cambió un dato dificultaría el trabajo, pero se repara con la documentación de apoyo (T **BAJO**). Las tablas salariales son públicas, así que su confidencialidad **no se ve afectada**; una tabla alterada se corrige sin más (I **BAJO**). Que alguien ordenase pagos haciéndose pasar por el personal de nóminas causaría un daño significativo (A **MEDIO** en el servicio de pago). Un retraso de un día en el pago resulta molesto, pero es fácilmente reparable (D **BAJO**). El resto de valores de la tabla siguen la misma lógica: el origen de los datos de nómina se comprueba con la documentación de apoyo (A **BAJO**); no saber quién lanzó un cálculo o una consulta se reconstruye sin más que molestias (T **BAJO** en los dos servicios); y una suplantación o una caída de la consulta de recibos solo retrasa que la plantilla vea un documento que también puede pedir por otra vía (A y D **BAJO**).\n\n**Paso 2 · quedarse con el mayor nivel de cada dimensión** (tabla de abajo) y **aplicar la regla**: hay dimensiones en MEDIO y ninguna en ALTO, así que el sistema es de categoría **MEDIA**.\n\n**Paso 3 · consecuencias.** Por ser MEDIA, la conformidad se demuestra con una auditoría para la certificación (artículo 38). Pero la disponibilidad **sigue en BAJO** (anexo I, 4.2): las medidas que se exigen por la dimensión D se eligen con ese nivel, y por eso no se exige el análisis de impacto `op.cont.1`, que la tabla del anexo II pide desde D MEDIO. Además, como el sistema trata datos personales, el **artículo 3** recuerda que se aplican el Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica 3/2018, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD), y que prevalecen las medidas del análisis de riesgos del tratamiento si son más exigentes.',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Gestión de nóminas: de las valoraciones a la categoría',
      text: `                                       C       I       T       A       D
Información · datos de nómina        MEDIO   MEDIO   BAJO    BAJO     —
Información · tablas salariales        —     BAJO     —       —       —
Servicio · cálculo y pago mensual      —       —     BAJO    MEDIO   BAJO
Servicio · consulta de recibos         —       —     BAJO    BAJO    BAJO
--------------------------------------------------------------------------
Nivel del sistema (el mayor)         MEDIO   MEDIO   BAJO    MEDIO   BAJO

Regla: alguna dimensión en MEDIO y ninguna en ALTO  ->  categoría MEDIA
(—  = la dimensión no se ve afectada: sin nivel)`,
    },
    {
      t: 'check',
      q: {
        q: 'En el ejemplo de la gestión de nóminas, las tablas salariales tienen la integridad en BAJO y los datos de nómina la tienen en MEDIO. ¿Qué nivel de integridad tiene el sistema?',
        choices: [
          'BAJO, porque se toma el menor para no sobredimensionar las medidas',
          'MEDIO, porque se toma el mayor de los establecidos para cada información y cada servicio',
          'Un nivel intermedio entre BAJO y MEDIO',
          'Depende de cuál de las dos informaciones tenga más registros',
        ],
        answer: 1,
        explain:
          'Cuando un sistema trata varias informaciones y presta varios servicios, el anexo I manda tomar en cada dimensión «el mayor de los establecidos para cada información y cada servicio». Quedarse con el menor dejaría sin proteger los datos de nómina. El volumen de cada información no entra en la regla, y entre BAJO y MEDIO no hay niveles intermedios.',
      },
    },
    {
      t: 'p',
      md: 'Un segundo caso, más corto: la **web informativa** del Consorcio publica noticias, horarios de las oficinas comarcales y la oferta de cursos de Valdecierzo. Todo es público, así que la confidencialidad no se ve afectada. Una noticia alterada o una suplantación de la web se corrigen sin un perjuicio más que molesto (I y A en **BAJO**), y una caída de unas horas reduce de forma apreciable la atención al público sin impedirla (D **BAJO**). Ninguna dimensión pasa de BAJO: categoría **BÁSICA**, con conformidad por **autoevaluación**. Si una parte de un sistema necesita otro nivel, el anexo II (apartado 2.2) permite **segregar** ese subsistema y tratarlo aparte, en lugar de subir todo el sistema.',
    },
    { t: 'h', text: 'Quién valora, quién determina y cuándo se revisa' },
    {
      t: 'table',
      headers: ['Paso', 'Quién (RD 311/2022)', 'En el Consorcio de Arcedo'],
      rows: [
        ['Valorar el nivel de cada dimensión, y modificar después esa valoración', 'El responsable o responsables de la **información** o de los **servicios** afectados (artículo 41.1)', 'La Gerencia, como responsable de la información; cada servicio, su responsable del servicio (la Secretaría General para la sede electrónica y el registro electrónico)'],
        ['**Determinar** la categoría a partir de esas valoraciones', 'El responsable o responsables de la **seguridad** (artículo 41.2)', 'La Unidad de Seguridad de la Información, que depende de la Gerencia'],
        ['Firmar la Declaración de Aplicabilidad y aprobar las medidas compensatorias', 'El responsable de la **seguridad** (artículo 28.2 y 28.3)', 'La Unidad de Seguridad de la Información'],
        ['Implantar las medidas en el sistema y supervisar la operación diaria', 'El responsable del **sistema** (artículo 13.2)', 'La jefatura del Servicio de Informática y Comunicaciones; no valora ni determina la categoría'],
      ],
    },
    {
      t: 'p',
      md: 'El reparto tiene lógica: quien conoce el valor de la información y del servicio es quien sabe cuánto daño haría un incidente, así que **valora**; el responsable de la seguridad traduce esas valoraciones en una categoría y **determina**. El responsable del sistema queda fuera de la decisión, y el **artículo 13.3** exige además que el responsable de la seguridad sea distinto del responsable del sistema, sin dependencia jerárquica entre ambos: por eso en el Consorcio la Unidad de Seguridad de la Información depende de la Gerencia y no del Servicio de Informática. La categoría **no es para siempre**: el anexo I obliga a reevaluarla **«anualmente, o siempre que se produzcan modificaciones significativas»** en los criterios que la determinaron. Si mañana el sistema de nóminas empezara a gestionar también los expedientes disciplinarios de la plantilla, habría que valorar esa nueva información y revisar la categoría sin esperar al año.',
    },
    {
      t: 'check',
      q: {
        q: 'La jefatura del Servicio de Informática y Comunicaciones propone dejar el sistema de nóminas en BÁSICA para ahorrar costes. Según el artículo 41, ¿a quién corresponde determinar la categoría?',
        choices: [
          'Al responsable del sistema, porque es quien conoce la infraestructura',
          'Al Comité de Seguridad de la Información, por mayoría',
          'A los responsables de la información y del servicio, que son quienes valoran',
          'Al responsable de la seguridad, con base en las valoraciones de los responsables de la información y del servicio',
        ],
        answer: 3,
        explain:
          'El artículo 41 separa dos facultades: valorar corresponde a los responsables de la información o de los servicios (41.1) y determinar la categoría, al responsable de la seguridad (41.2). La tercera opción tienta porque esos responsables sí intervienen, pero solo valoran. El responsable del sistema implanta y opera; no le corresponde ninguna de las dos cosas.',
      },
    },
    { t: 'h', text: 'Declaración de Aplicabilidad y perfiles de cumplimiento específicos' },
    {
      t: 'p',
      md: 'Con la categoría y los niveles en la mano se eligen las medidas. El **artículo 28.1** manda adoptar las medidas y refuerzos del anexo II teniendo en cuenta los activos del sistema, su categoría y las decisiones de gestión de los riesgos; el anexo II (apartado 2.1) lo ordena así: tipos de activos, dimensiones relevantes, nivel de cada dimensión, categoría y, por último, selección de las medidas y refuerzos según las dimensiones y sus niveles y, para algunas medidas, según la categoría. Esas medidas son **mínimos exigibles**: el responsable de la seguridad puede ampliarlas con **medidas adicionales** (28.2). La relación de medidas seleccionadas se formaliza en un documento llamado **Declaración de Aplicabilidad**, «firmado por el responsable de la seguridad» (28.2). Una medida del anexo II puede sustituirse por otra **compensatoria** si se justifica documentalmente que protege «igual o mejor» del riesgo y que se satisfacen los principios básicos y los requisitos mínimos de los capítulos II y III; la Declaración de Aplicabilidad debe indicar qué medida compensa a cuál, y el conjunto lo **aprueba formalmente el responsable de la seguridad** (28.3). La auditoría del anexo III comprueba después que se cumple el anexo II (apartado 1.1.e) y que existe un sistema de gestión de la seguridad de la información documentado, «tomando como base la Declaración de Aplicabilidad» (apartado 1.1.f).',
    },
    {
      t: 'p',
      md: 'El **artículo 30** añade los **perfiles de cumplimiento específicos**. En virtud del principio de proporcionalidad, para determinadas entidades o sectores de actividad concretos, un perfil reúne el conjunto de medidas de seguridad que, partiendo del análisis de riesgos preceptivo, resultan idóneas para **una categoría de seguridad concreta**. Los perfiles los **valida y publica el CCN** (Centro Criptológico Nacional), conforme a las instrucciones técnicas de seguridad y guías aprobadas según la disposición adicional segunda, y el anexo II (apartado 2.3) prevé que los establezcan las guías CCN-STIC, que son las guías de seguridad del CCN; la disposición adicional segunda del real decreto cita en particular las de la serie 800. Un ejemplo es la guía CCN-STIC 890, cuyo título habla de la adecuación al ENS conforme al perfil de cumplimiento específico de requisitos fundamentales de seguridad. Para los criterios de valoración, el anexo I remite a las guías CCN-STIC; la que corresponde por título es la CCN-STIC 803, «Valoración de los sistemas».',
    },
    {
      t: 'check',
      q: {
        q: 'Para el sistema de nóminas, la Unidad de Seguridad de la Información sustituye una medida del anexo II por otra que protege igual frente al mismo riesgo. ¿Qué exige el artículo 28?',
        choices: [
          'Justificar que protege igual o mejor y respeta los capítulos II y III, anotarlo en la Declaración de Aplicabilidad y que lo apruebe el responsable de la seguridad',
          'Justificar que protege igual o mejor y pedir al CCN su autorización previa, que se adjunta a la Declaración de Aplicabilidad de la medida sustituida',
          'Documentar la medida nueva y que el responsable del sistema, que es quien la implanta, la apruebe y firme la Declaración de Aplicabilidad actualizada',
          'Ninguna formalidad: las medidas del anexo II son orientativas y cada organización puede sustituirlas si mantiene su categoría de seguridad',
        ],
        answer: 0,
        explain:
          'El artículo 28.3 admite medidas compensatorias si se justifica documentalmente que protegen «igual o mejor» y que se satisfacen los principios básicos y los requisitos mínimos (capítulos II y III), exige detallar en la Declaración de Aplicabilidad la correspondencia con la medida del anexo II y deja la aprobación formal al responsable de la seguridad, que es también quien firma la declaración (28.2). El CCN valida perfiles de cumplimiento (artículo 30), no cada medida compensatoria, y el responsable del sistema implanta las medidas pero no firma la declaración ni aprueba las compensatorias. Y las medidas del anexo II son mínimos exigibles, no orientaciones.',
      },
    },
    {
      t: 'links',
      title: 'Ya explicado en la pista de Security+',
      items: [
        { label: 'Confidencialidad, integridad y disponibilidad, no repudio y control de acceso (lección sp1m2)', href: '/learn/sp1m2' },
        { label: 'Gestión de riesgos: identificación, evaluación y análisis (lección sp5m3)', href: '/learn/sp5m3' },
      ],
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Lo que se pregunta mucho',
      md: '**Dimensiones:** cinco, C, I, T, A y D (anexo I); no confundir con las siete propiedades del artículo 1. **Niveles:** BAJO (perjuicio limitado), MEDIO (grave), ALTO (muy grave); una dimensión no afectada no tiene nivel. **Varias informaciones y servicios:** en cada dimensión, **el mayor**. **Categoría:** ALTA si alguna dimensión es ALTO; MEDIA si alguna es MEDIO y ninguna ALTO; BÁSICA si alguna es BAJO y ninguna supera. La categoría **no altera** el nivel de las dimensiones que no influyeron (4.2). **Artículo 41:** valoran los responsables de la información o del servicio; **determina** el responsable de la seguridad. **Reevaluación:** anual o ante modificaciones significativas, que no es lo mismo que la auditoría del artículo 31, «al menos cada dos años». **Artículo 28:** Declaración de Aplicabilidad firmada por el responsable de la seguridad, que también aprueba las compensatorias. **Artículo 30:** perfiles de cumplimiento específicos, validados y publicados por el CCN.',
    },
    { t: 'h', text: 'Artículos clave de la lección' },
    {
      t: 'table',
      headers: ['Artículo', 'Qué regula'],
      rows: [
        ['Art. 1', 'Objeto del ENS; siete propiedades protegidas (acceso, confidencialidad, integridad, trazabilidad, autenticidad, disponibilidad y conservación)'],
        ['Art. 3', 'Sistemas con datos personales: RGPD y LOPDGDD; prevalecen las medidas del análisis de riesgos o de la evaluación de impacto si son más exigentes'],
        ['Art. 13.3', 'El responsable de la seguridad, distinto del responsable del sistema y sin dependencia jerárquica entre ambos'],
        ['Art. 28', 'Medidas del anexo II según activos, categoría y gestión de riesgos; medidas adicionales; Declaración de Aplicabilidad firmada por el responsable de la seguridad; medidas compensatorias'],
        ['Art. 30', 'Perfiles de cumplimiento específicos para entidades o sectores concretos, validados y publicados por el CCN'],
        ['Art. 38', 'Conformidad: BÁSICA por autoevaluación y declaración; MEDIA o ALTA por auditoría y certificación'],
        ['Art. 40', 'Categorías de seguridad: impacto de un incidente sobre D, A, I, C o T, según el anexo I'],
        ['Art. 41', 'Valoran los responsables de la información o de los servicios; determina la categoría el responsable de la seguridad'],
        ['Anexo I', 'Fundamentos, cinco dimensiones, niveles BAJO/MEDIO/ALTO, regla del mayor nivel, categorías BÁSICA/MEDIA/ALTA, secuencia y reevaluación anual o ante modificaciones significativas'],
        ['Anexo II, 2.1–2.3 y 6', 'Pasos para seleccionar medidas, segregación de subsistemas, perfiles de cumplimiento y madurez mínima L2/L3/L4'],
      ],
    },
  ],
  quiz: [
    {
      id: 'op6m2q1',
      domain: 'ENS y normativa',
      prompt:
        'Según el artículo 41 del Real Decreto 311/2022, ¿a quién corresponde la determinación de la categoría de seguridad de un sistema?',
      choices: [
        'Al responsable del sistema',
        'Al responsable de la información',
        'Al responsable de la seguridad',
        'Al comité de seguridad de la organización',
      ],
      answer: 2,
      explain:
        'El artículo 41.2 atribuye la determinación de la categoría al responsable o responsables de la seguridad, con base en las valoraciones del apartado 1. El responsable de la información tienta porque interviene, pero su facultad es valorar (41.1), igual que la del responsable del servicio. El responsable del sistema implanta y opera, y el comité no aparece en el artículo 41.',
    },
    {
      id: 'op6m2q2',
      domain: 'ENS y normativa',
      prompt: '¿Cuáles son las dimensiones de seguridad que se valoran para categorizar un sistema según el anexo I?',
      choices: [
        'Confidencialidad, integridad, trazabilidad, autenticidad y disponibilidad',
        'Confidencialidad, integridad, disponibilidad, acceso y conservación',
        'Confidencialidad, integridad, disponibilidad, autenticidad y no repudio',
        'Acceso, confidencialidad, integridad, trazabilidad, autenticidad, disponibilidad y conservación',
      ],
      answer: 0,
      explain:
        'El anexo I fija cinco dimensiones: Confidencialidad [C], Integridad [I], Trazabilidad [T], Autenticidad [A] y Disponibilidad [D]. La última opción tienta porque reproduce las siete propiedades del artículo 1, que incluyen el acceso y la conservación; pero esas dos no son dimensiones de categorización. El no repudio no figura entre las dimensiones del ENS.',
    },
    {
      id: 'op6m2q3',
      domain: 'ENS y normativa',
      prompt:
        'Un sistema del Consorcio queda valorado así: C BAJO, I MEDIO, T BAJO, A BAJO y D ALTO. Aplicando el anexo I, ¿qué categoría tiene?',
      choices: [
        'BÁSICA, porque tres de las cinco dimensiones están en BAJO',
        'MEDIA, porque es el nivel más repetido después de BAJO',
        'MEDIA, porque la disponibilidad no influye en la categoría',
        'ALTA, porque una de sus dimensiones alcanza el nivel ALTO',
      ],
      answer: 3,
      explain:
        'El sistema es de categoría ALTA si alguna de sus dimensiones alcanza el nivel ALTO, sea cual sea; aquí lo alcanza la disponibilidad. Las opciones de la mayoría o del nivel «más repetido» aplican una media que la regla no contempla. La disponibilidad cuenta igual que las demás dimensiones: el artículo 40 la cita la primera.',
    },
    {
      id: 'op6m2q4',
      domain: 'ENS y normativa',
      prompt:
        'Según el artículo 28 del Real Decreto 311/2022, ¿quién firma la Declaración de Aplicabilidad en la que se formaliza la relación de medidas de seguridad seleccionadas?',
      choices: [
        'El responsable del sistema',
        'El responsable de la seguridad',
        'El responsable de la información',
        'El órgano que aprueba la política de seguridad',
      ],
      answer: 1,
      explain:
        'El artículo 28.2 dice que la Declaración de Aplicabilidad va «firmado por el responsable de la seguridad», que es también quien puede añadir medidas adicionales y aprobar las compensatorias (28.3). El responsable del sistema tienta porque es quien implanta las medidas, pero no las selecciona ni firma la declaración. El responsable de la información valora; no elige medidas.',
    },
    {
      id: 'op6m2q5',
      domain: 'ENS y normativa',
      prompt: 'Según el anexo I, ¿cuándo debe reevaluarse la categoría de seguridad de un sistema?',
      choices: [
        'Anualmente, o siempre que se produzcan modificaciones significativas en los criterios que la determinaron',
        'Al menos cada dos años, o cuando haya modificaciones sustanciales en el sistema',
        'Solo cuando se produzca un incidente de seguridad con impacto significativo',
        'Cada tres años, coincidiendo con la renovación de la certificación',
      ],
      answer: 0,
      explain:
        'El anexo I manda reevaluar la categoría «anualmente, o siempre que se produzcan modificaciones significativas» en los criterios de determinación. La segunda opción tienta porque es la regla de la auditoría ordinaria del artículo 31 («al menos cada dos años», con extraordinaria ante «modificaciones sustanciales»), no la de la categoría. Un incidente no es el único disparador.',
    },
    {
      id: 'op6m2q6',
      domain: 'ENS y normativa',
      prompt:
        'El sistema de expedientes del Consorcio trata los expedientes de contratación (C MEDIO, I MEDIO) y el tablón interno de avisos (C sin nivel, I BAJO), y presta el servicio de tramitación (D BAJO). ¿Qué categoría tiene y qué nivel de confidencialidad tiene el sistema?',
      choices: [
        'Categoría MEDIA; confidencialidad MEDIO',
        'Categoría BÁSICA; confidencialidad BAJO, porque una de las dos informaciones no tiene nivel',
        'Categoría MEDIA; y por ser MEDIA, todas las dimensiones pasan a MEDIO',
        'Categoría ALTA, porque trata varias informaciones y presta un servicio',
      ],
      answer: 0,
      explain:
        'En cada dimensión se toma el mayor nivel de las informaciones y servicios, así que la confidencialidad del sistema es MEDIO; con alguna dimensión en MEDIO y ninguna en ALTO, la categoría es MEDIA. La tercera opción tienta, pero el anexo I (4.2) dice que la categoría no altera el nivel de las dimensiones que no influyeron: la disponibilidad sigue en BAJO. El número de informaciones o servicios no sube la categoría.',
    },
    {
      id: 'op6m2q7',
      domain: 'ENS y normativa',
      prompt:
        'El sistema de nóminas del Consorcio es de categoría MEDIA y tiene la disponibilidad valorada en BAJO. La tabla del anexo II exige el análisis de impacto op.cont.1 por la dimensión D, desde el nivel MEDIO. ¿Se exige esta medida?',
      choices: [
        'Sí, porque al ser MEDIA el sistema todas sus dimensiones se tratan como MEDIO',
        'Sí, porque en un sistema MEDIA se aplican todas las medidas del anexo II',
        'Solo si lo autoriza el responsable del sistema',
        'No, porque las medidas por dimensión se eligen con el nivel de esa dimensión, que sigue en BAJO',
      ],
      answer: 3,
      explain:
        'Según el anexo I (4.2), determinar la categoría no altera el nivel de las dimensiones que no influyeron en ella, y el anexo II elige las medidas por dimensión con el nivel de esa dimensión: con D en BAJO, op.cont.1 figura como «n.a.». La primera opción tienta por la palabra MEDIA, pero confunde la categoría del sistema con el nivel de una dimensión. El responsable de la seguridad podría añadirla como medida adicional, pero no es exigible.',
    },
    {
      id: 'op6m2q8',
      domain: 'ENS y normativa',
      prompt:
        'Según el artículo 30 del Real Decreto 311/2022, ¿quién valida y publica los perfiles de cumplimiento específicos?',
      choices: [
        'La Comisión Sectorial de Administración Electrónica',
        'El CCN',
        'Cada entidad, mediante su responsable de la seguridad',
        'El INCIBE-CERT, equipo de respuesta a incidentes del Instituto Nacional de Ciberseguridad de España',
      ],
      answer: 1,
      explain:
        'El artículo 30.3 dice que el CCN, en el ejercicio de sus competencias, validará y publicará los perfiles de cumplimiento específicos, que reúnen las medidas idóneas para una categoría concreta en determinadas entidades o sectores. La Comisión Sectorial de Administración Electrónica tienta porque aparece en el artículo 32, pero allí recoge el informe del estado de la seguridad. El INCIBE-CERT, el equipo de respuesta a incidentes de seguridad del Instituto Nacional de Ciberseguridad de España (INCIBE), recibe las notificaciones de incidentes de los proveedores privados que prestan servicios al sector público (artículo 33.7); no valida perfiles.',
    },
  ],
};
