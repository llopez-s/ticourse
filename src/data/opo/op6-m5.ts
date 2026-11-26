import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// OP6M5 — Protección de datos en la administración (RGPD y LOPDGDD)
// Fuente única: docs/superpowers/sources/2026-11-26-op6-fuentes.md, §5, §6 y §14.
// ---------------------------------------------------------------------------
export const OP6_M5: Module = {
  id: 'op6m5',
  sectionId: 'op6',
  title: 'Protección de datos en la administración',
  minutes: 22,
  objectives: [
    'Enumerar los principios del artículo 5 del RGPD y explicar en qué bases jurídicas del artículo 6 se apoya una administración (obligación legal y misión de interés público) y por qué no en el interés legítimo',
    'Relacionar cada derecho de los artículos 15 a 22 con su artículo, y aplicar los plazos de respuesta del artículo 12 y las reglas de la LOPDGDD sobre menores y acceso repetitivo',
    'Distinguir responsable y encargado (arts. 24 y 28), y explicar el registro de actividades (art. 30) y el inventario público que la LOPDGDD exige a las administraciones',
    'Aplicar las reglas de las brechas: notificación a la autoridad en 72 horas (art. 33), comunicación a los afectados cuando hay alto riesgo (art. 34) y evaluación de impacto previa (art. 35)',
    'Explicar por qué el DPD es obligatorio en una administración (arts. 37 a 39 del RGPD y 34 a 37 de la LOPDGDD) y qué posición tiene',
    'Describir el régimen sancionador del artículo 77 de la LOPDGDD, en el que están los consorcios y que no impone multas, y la disposición adicional primera, que lleva el ENS a los tratamientos del sector público',
  ],
  blocks: [
    {
      t: 'p',
      md: 'El Consorcio Provincial de Arcedo trata datos personales todos los días: nóminas de su plantilla, expedientes de los ciudadanos, el registro de entrada, las inscripciones del centro de formación de Valdecierzo. Dos normas mandan sobre todo eso. El **Reglamento General de Protección de Datos** (**RGPD**, Reglamento (UE) 2016/679), que se aplica directamente «a partir del 25 de mayo de 2018» (art. 99.2), y la **Ley Orgánica 3/2018, de Protección de Datos Personales y garantía de los derechos digitales** (**LOPDGDD**), en vigor desde el 7-12-2018, que lo adapta y lo completa. En una administración, el **delegado de protección de datos** (**DPD**) es siempre obligatorio (art. 37.1.a del RGPD) y la LOPDGDD añade dos cosas que se preguntan mucho: las infracciones **no se castigan con multa** (art. 77) y las medidas de seguridad son las del **Esquema Nacional de Seguridad** (**ENS**) (DA 1.ª). Una advertencia de fuente: el RGPD se cita por su texto consolidado (con las rectificaciones de 2018 y 2021), no por la publicación original en el BOE, que no las recoge.',
    },
    { t: 'h', text: 'Principios y bases jurídicas: en qué se apoya una administración' },
    {
      t: 'p',
      md: 'El **artículo 5** del RGPD fija los principios de todo tratamiento: **licitud, lealtad y transparencia**; **limitación de la finalidad**; **minimización de datos**; **exactitud**; **limitación del plazo de conservación**; e **integridad y confidencialidad**. El apartado 5.2 añade la **responsabilidad proactiva**: no basta con cumplir, el responsable tiene que poder demostrarlo. El **artículo 6** dice cuándo un tratamiento es lícito y da **seis bases**, letras a) a f). Para una administración las dos que importan son la **c), «obligación legal»**, y la **e), «misión realizada en interés público o en el ejercicio de poderes públicos»**; la base de ambas tiene que estar en el Derecho de la Unión o del Estado. Y el **artículo 8 de la LOPDGDD** lo concreta en España: la obligación legal (8.1) tiene que venir impuesta por «una norma de Derecho de la Unión Europea o una norma con rango de ley», y la misión de interés público o el ejercicio de poderes públicos (8.2), por una **norma con rango de ley** (o una competencia atribuida por ley). La letra f), el **interés legítimo**, **no se aplica a las autoridades públicas** en el ejercicio de sus funciones: es el error más repetido. El consentimiento existe (art. 7: retirarlo debe ser «tan fácil» como darlo), pero no es la base habitual cuando el Consorcio ejerce sus competencias.',
    },
    {
      t: 'check',
      q: {
        q: 'El Consorcio trata los datos de quienes presentan escritos en su registro de entrada, porque una ley le atribuye esa función. ¿Qué base jurídica del artículo 6 del RGPD no puede invocar para ese tratamiento?',
        choices: [
          'La obligación legal, letra c)',
          'La misión realizada en interés público o en el ejercicio de poderes públicos, letra e)',
          'El interés legítimo, letra f)',
          'Ninguna: puede elegir cualquiera de las seis',
        ],
        answer: 2,
        explain:
          'El artículo 6 excluye expresamente el interés legítimo para las autoridades públicas en el ejercicio de sus funciones. Las letras c) y e) son precisamente las bases propias de una administración, y la LOPDGDD (art. 8) exige apoyarlas en una norma: de Derecho de la Unión o con rango de ley para la obligación legal, con rango de ley para la misión de interés público.',
      },
    },
    { t: 'h', text: 'Categorías especiales y menores' },
    {
      t: 'p',
      md: 'El **artículo 9** del RGPD regula las **categorías especiales de datos**: su tratamiento está **prohibido como regla general** y solo cabe en las excepciones que enumera el propio artículo. Tratarlas hace perder, además, la excepción del registro de actividades para las entidades pequeñas (lo verás abajo). Para los **menores**, el **artículo 8** del RGPD fija la edad del consentimiento en los servicios de la sociedad de la información en **«como mínimo 16 años»** y permite a cada Estado bajarla siempre que «no sea inferior a 13 años». España la ha fijado en **14**: el **artículo 7 de la LOPDGDD** permite consentir al «mayor de catorce años». El consentimiento de un menor de catorce años se rige por el art. 7.2 de la LOPDGDD; sus derechos los pueden ejercitar en su nombre los titulares de la patria potestad (art. 12.6 LOPDGDD: «podrán ejercitar»). Se confunde a menudo: 16 es la regla del RGPD, 13 es el mínimo que permite y 14 es la cifra española.',
    },
    { t: 'h', text: 'Derechos de los interesados (arts. 12 a 22)' },
    {
      t: 'table',
      headers: ['Derecho o regla', 'Artículo del RGPD', 'Lo que conviene recordar'],
      rows: [
        ['Transparencia y modalidades', '12', 'Respuesta «sin dilación indebida y, en cualquier caso, en el plazo de un mes»; prorrogable «otros dos meses»; si no se actúa, informar «a más tardar transcurrido un mes»; **gratuito**, salvo solicitudes manifiestamente infundadas o excesivas'],
        ['Información al interesado', '13 y 14', 'El 13 si los datos se obtienen de él; el 14 si vienen de otro, «a más tardar dentro de un mes». La LOPDGDD (art. 11) permite darla **por capas**: información básica + dirección electrónica'],
        ['Acceso', '15', 'LOPDGDD art. 13: es repetitivo si se ejerce «más de una ocasión durante el plazo de seis meses»'],
        ['Rectificación', '16', '—'],
        ['Supresión («el derecho al olvido»)', '17', '—'],
        ['Limitación del tratamiento', '18', '—'],
        ['Notificar rectificación, supresión o limitación', '19', 'Obligación del responsable, no un derecho nuevo'],
        ['Portabilidad', '20', 'Solo si la base es el **consentimiento o un contrato** y el tratamiento es automatizado; formato «estructurado, de uso común y lectura mecánica»'],
        ['Oposición', '21', 'Frente a tratamientos basados en el **6.1 e) o f)**, y frente a la mercadotecnia directa'],
        ['Decisiones automatizadas y perfiles', '22', '—'],
      ],
    },
    {
      t: 'p',
      md: 'Dos consecuencias para una administración. Como sus tratamientos se basan casi siempre en la obligación legal o en la misión de interés público, la **portabilidad** (art. 20) normalmente **no** procede, porque exige consentimiento o contrato. En cambio, el derecho de **oposición** (art. 21) **sí** puede ejercerse frente a un tratamiento basado en la letra e). Además, la LOPDGDD (art. 37) permite al interesado presentar una **reclamación previa ante el DPD**, que comunica su decisión en «dos meses»; si es la autoridad la que se la remite, responde en «un mes». Y el interesado siempre puede reclamar ante una autoridad de control (art. 77 del RGPD).',
    },
    {
      t: 'check',
      q: {
        q: 'Una persona pide al Consorcio, con base en el derecho de portabilidad, que le entregue en formato de lectura mecánica los datos de su expediente de una subvención, que el Consorcio tramita en ejercicio de una competencia atribuida por ley. ¿Qué es lo correcto?',
        choices: [
          'Entregarlos: la portabilidad procede frente a cualquier tratamiento automatizado',
          'La portabilidad no procede, porque exige que la base sea el consentimiento o un contrato',
          'La portabilidad solo procede si la persona es mayor de dieciséis años',
          'Pedir primero autorización a la Agencia Española de Protección de Datos (AEPD)',
        ],
        answer: 1,
        explain:
          'El artículo 20 limita la portabilidad a tratamientos automatizados basados en el consentimiento o en un contrato; un expediente tramitado en ejercicio de poderes públicos se apoya en el 6.1 e). La primera opción olvida esa condición de la base jurídica. La persona puede, eso sí, ejercer el derecho de acceso del artículo 15.',
      },
    },
    { t: 'h', text: 'Responsable, encargado y registro de actividades' },
    {
      t: 'p',
      md: 'El **responsable** del tratamiento decide para qué y cómo se tratan los datos; el **artículo 24** le obliga a aplicar medidas apropiadas y a **poder demostrarlo**, y el **25** le pide protección de datos **desde el diseño y por defecto**. El **encargado** trata datos **por cuenta del responsable**. El **artículo 28** exige que el responsable elija encargados que ofrezcan garantías suficientes, que la relación se rija por un **contrato u otro acto jurídico** con el contenido del 28.3 y que los **subencargados** solo entren con su **autorización previa por escrito**. En el sector público, la LOPDGDD (art. 33.5) permite que ese encargo se haga mediante una **norma reguladora** que recoja el contenido del 28.3. Si el Consorcio contrata a una empresa para gestionar las nóminas, el Consorcio es el responsable y la empresa, el encargado.',
    },
    {
      t: 'p',
      md: 'El **artículo 30** obliga a llevar el **registro de las actividades de tratamiento**: el responsable con el contenido del 30.1 a)–g) y el encargado con el del 30.2. El 30.5 exime a quien emplee **«menos de 250 personas»**, pero no si el tratamiento entraña riesgo, no es ocasional o incluye categorías especiales o datos penales, así que en la práctica la excepción rara vez alcanza a una administración. La LOPDGDD va más allá: su **artículo 31** obliga a las entidades del artículo 77.1 (entre ellas los consorcios) a **publicar un inventario** de sus actividades de tratamiento, por medios electrónicos y con su base legal.',
    },
    {
      t: 'check',
      q: {
        q: 'Alguien del centro de formación de Valdecierzo sostiene que, si el Consorcio empleara a menos de 250 personas, quedaría libre de llevar el registro de actividades de tratamiento. ¿Qué responde el DPD?',
        choices: [
          'Tiene razón: el artículo 30.5 del RGPD exime sin más a toda entidad de menos de 250 personas',
          'La excepción no aplica si el tratamiento no es ocasional, entraña riesgo o incluye categorías especiales; y además el Consorcio, como entidad del artículo 77.1 de la LOPDGDD, tiene que publicar un inventario de sus actividades',
          'El registro solo es obligatorio para los encargados del tratamiento',
          'El registro lo sustituye la Declaración de Aplicabilidad del ENS',
        ],
        answer: 1,
        explain:
          'La excepción del 30.5 tiene contraexcepciones (riesgo, tratamiento no ocasional, categorías especiales, datos penales), y el artículo 31 de la LOPDGDD obliga a los sujetos del 77.1, entre ellos los consorcios, a publicar el inventario. La primera opción lee la cifra de 250 sin sus condiciones. La Declaración de Aplicabilidad es un documento del ENS, no un registro de tratamientos.',
      },
    },
    { t: 'h', text: 'Seguridad, brechas y evaluación de impacto' },
    {
      t: 'p',
      md: 'El **artículo 32** pide medidas técnicas y organizativas apropiadas al riesgo: entre ellas la **seudonimización y el cifrado**, la capacidad de garantizar la **«confidencialidad, integridad, disponibilidad y resiliencia permanentes»**, la de restaurar rápidamente la disponibilidad tras un incidente y la **verificación regular** de su eficacia. Cuando algo falla y hay una **violación de la seguridad de los datos personales**, entran dos artículos distintos:',
    },
    {
      t: 'list',
      items: [
        '**Art. 33 · a la autoridad de control.** El responsable notifica «sin dilación indebida y, de ser posible, a más tardar **72 horas** después de que haya tenido constancia», salvo que sea «improbable» que la violación suponga un riesgo. Si llega tarde, explica los motivos. El encargado avisa al responsable «sin dilación indebida». El 33.3 fija el contenido mínimo y el 33.5 obliga a **documentar todas** las violaciones, también las que no se notifican.',
        '**Art. 34 · a los afectados.** Solo cuando sea probable un **«alto riesgo»** para sus derechos y libertades, «sin dilación indebida». No hace falta (34.3) si los datos estaban protegidos, por ejemplo con **cifrado**; si medidas posteriores han eliminado ese alto riesgo; o si exige un «esfuerzo desproporcionado», en cuyo caso se sustituye por una **comunicación pública**.',
      ],
    },
    {
      t: 'p',
      md: 'La **evaluación de impacto relativa a la protección de datos** (**EIPD**, art. 35) se hace **antes** del tratamiento cuando sea probable un «alto riesgo», con el **asesoramiento del DPD**. El 35.3 enumera tres casos en que es obligatoria, las autoridades de control publican listas de tratamientos que la requieren y el 35.7 fija su contenido mínimo. Si, hecha la EIPD, el riesgo sigue siendo alto, el responsable hace una **consulta previa** a la autoridad (art. 36), que responde en «ocho semanas», prorrogables «seis semanas». La LOPDGDD (art. 28.2) añade su propia lista de supuestos de mayor riesgo.',
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'En el Consorcio de Arcedo: un portátil perdido en una oficina comarcal',
      md: 'Un lunes desaparece de una oficina comarcal un portátil con una copia del registro de entrada. La Unidad de Seguridad de la Información gestiona el incidente como cualquier otro del ENS; el DPD valora la parte de protección de datos. Si el disco estaba **cifrado** y la clave no se ha comprometido, es improbable que haya riesgo para las personas: la violación **se documenta** (33.5) y no hay que comunicarla a los afectados (34.3). Si el disco no estaba cifrado y no es improbable el riesgo, el Consorcio notifica a la **AEPD**, que es su autoridad de control porque su comunidad autónoma no tiene autoridad propia, dentro de las **72 horas** desde que tuvo constancia, y valora si el riesgo es **alto** para avisar también a las personas afectadas. Las 72 horas se cuentan desde la constancia, no desde la pérdida.',
    },
    {
      t: 'check',
      q: {
        q: 'Según el RGPD, ¿cuándo hay que comunicar una violación de seguridad directamente a las personas afectadas?',
        choices: [
          'Siempre, en el mismo plazo de 72 horas que la notificación a la autoridad',
          'Solo cuando la autoridad de control lo ordene',
          'Cuando sea probable un alto riesgo para sus derechos y libertades, sin dilación indebida, salvo las exenciones del artículo 34.3',
          'Solo si la violación afecta a categorías especiales de datos',
        ],
        answer: 2,
        explain:
          'El artículo 34 exige comunicar a los interesados cuando sea probable un alto riesgo, sin dilación indebida, y lo exime si los datos estaban cifrados, si el riesgo se ha neutralizado o si supone un esfuerzo desproporcionado (entonces, comunicación pública). Las 72 horas son del artículo 33 y se refieren a la autoridad de control, no a los afectados.',
      },
    },
    { t: 'h', text: 'El delegado de protección de datos' },
    {
      t: 'p',
      md: 'El **artículo 37.1.a** del RGPD hace **obligatorio** el DPD cuando el tratamiento lo lleva a cabo «una autoridad u organismo público, excepto los tribunales que actúen en ejercicio de su función judicial». Varias autoridades u organismos pueden compartir **un DPD único** (37.3), que puede formar parte de la plantilla o prestar sus servicios por contrato (37.6); sus datos de contacto se **publican y se comunican** a la autoridad (37.7). El **artículo 38** le garantiza su posición: participa **en tiempo oportuno**, **no recibe instrucciones**, no puede ser destituido ni sancionado por desempeñar sus funciones y rinde cuentas **«al más alto nivel jerárquico»**. El **artículo 39** fija sus funciones: informar y asesorar, supervisar el cumplimiento, asesorar en la EIPD, cooperar con la autoridad y ser su punto de contacto. La LOPDGDD añade que las designaciones, nombramientos y ceses se comunican **«en el plazo de diez días»** a la AEPD o a la autoridad autonómica (art. 34), que el DPD que es persona física integrada en la organización no puede ser removido ni sancionado salvo **«dolo o negligencia grave»** (art. 36.2) y que **no está sujeto** al régimen sancionador (art. 70.2). En el Consorcio, el DPD es una figura designada por el Consorcio y **distinta del responsable de la seguridad** del ENS, que es la Unidad de Seguridad de la Información.',
    },
    {
      t: 'check',
      q: {
        q: 'El Consorcio nombra un nuevo DPD. ¿Qué afirmación es correcta?',
        choices: [
          'El nombramiento sería voluntario si el Consorcio empleara a menos de 250 personas',
          'El DPD rinde cuentas al responsable del sistema y recibe de él las instrucciones sobre cómo supervisar',
          'El nombramiento se comunica a la AEPD en el plazo de diez días y, si es persona física integrada en la plantilla, el DPD no puede ser removido salvo dolo o negligencia grave',
          'Si el DPD no detecta una infracción, responde personalmente con una sanción',
        ],
        answer: 2,
        explain:
          'Así lo dicen los artículos 34 y 36.2 de la LOPDGDD; la protección frente a la remoción del 36.2 es para el DPD persona física integrada en la organización. El DPD es obligatorio en un organismo público con independencia de la plantilla (la cifra de 250 es del registro de actividades), no recibe instrucciones y rinde cuentas al más alto nivel jerárquico; y el artículo 70.2 de la LOPDGDD lo excluye del régimen sancionador.',
      },
    },
    { t: 'h', text: 'Régimen sancionador: a las administraciones no se las multa' },
    {
      t: 'table',
      headers: ['Cuestión', 'Régimen general', 'Entidades del art. 77.1 LOPDGDD (consorcios incluidos)'],
      rows: [
        ['Consecuencia de la infracción', 'Multa: hasta «10 000 000 EUR» o «2 %» (art. 83.4 RGPD) o hasta «20 000 000 EUR» o «4 %» (art. 83.5)', 'Resolución «declarando la infracción y estableciendo, en su caso, las medidas que proceda adoptar», **sin** la multa del art. 58.2.i RGPD (art. 77.2)'],
        ['Base europea', 'Arts. 83.4 y 83.5 RGPD', 'Art. 83.7 RGPD: cada Estado decide si multa a autoridades y organismos públicos'],
        ['Qué más puede pasar', 'Publicación en el BOE si la sanción supera «un millón de euros» y el infractor es persona jurídica, siempre que la autoridad competente sea la AEPD (art. 76.4)', 'Propuesta de actuaciones disciplinarias; amonestación con publicación en el boletín oficial si se desatendieron informes o recomendaciones (77.3); comunicación al Defensor del Pueblo (77.5)'],
        ['Calificación de las infracciones', 'Mismos tipos de infracción (arts. 72–74): no notificar una violación a la autoridad, no designar DPD o no hacer EIPD son **graves** (art. 73 r, v y t); notificar de forma «incompleta, tardía o defectuosa», **leve** (art. 74 m)', 'Igual: el art. 77.2 remite a las infracciones de los arts. 72 a 74'],
        ['Prescripción de las infracciones', 'Muy graves «a los tres años» (72), graves «a los dos años» (73), leves «al año» (74)', 'Igual: el art. 77.2 remite a las infracciones de los arts. 72 a 74'],
      ],
    },
    {
      t: 'p',
      md: 'El **artículo 77.1** de la LOPDGDD enumera las entidades con régimen propio: la Administración General del Estado, las comunidades autónomas y las **entidades locales** (c), los organismos públicos (d), las universidades públicas (i) y, en la letra **j), «Los consorcios»**. Para ellas la autoridad dicta una resolución que **declara la infracción** y fija las medidas que procedan, pero excluye expresamente la del artículo 58.2.i del RGPD, que es el poder de «imponer una multa administrativa». Que no haya multa no significa que no haya consecuencias: la infracción queda declarada, hay que corregirla y puede acabar en responsabilidad disciplinaria de quien la causó.',
    },
    { t: 'h', text: 'ENS y protección de datos; autoridades de control' },
    {
      t: 'p',
      md: 'La **disposición adicional primera** de la LOPDGDD, «Medidas de seguridad en el ámbito del sector público», es el puente con el resto del bloque. Dice tres cosas: el ENS incluirá las medidas que deben aplicarse a los tratamientos de datos personales; los responsables del artículo 77.1 aplican **las medidas del ENS** a sus tratamientos; y cuando un **tercero** presta un servicio por concesión, encomienda o contrato, aplica **las medidas de la administración de origen**, ajustadas al ENS. Así, en el Consorcio las medidas del artículo 32 del RGPD se concretan con el anexo II del ENS, y la empresa que gestione sus nóminas tiene que aplicar esas mismas medidas. La disposición adicional novena, por su parte, permite a las autoridades, a los equipos de respuesta a emergencias informáticas (**CERT**) y a incidentes de seguridad informática (**CSIRT**) y a los proveedores tratar los datos personales que contienen las notificaciones de incidentes, solo durante el tiempo y con el alcance necesarios.',
    },
    {
      t: 'p',
      md: 'Cada Estado designa sus **autoridades de control** (art. 51 del RGPD). En España, la **AEPD** y las **autoridades autonómicas de protección de datos**. El **artículo 57** de la LOPDGDD da a estas últimas competencia sobre los tratamientos del sector público de su comunidad y de las **entidades locales** de su territorio, así que la autoridad de una entidad local depende de dónde esté y de si su comunidad tiene autoridad propia. La LOPDGDD no las nombra una a una. En el escenario, la comunidad autónoma del Consorcio no tiene autoridad de protección de datos propia, así que su autoridad de control es la **AEPD**. Ante la AEPD, el procedimiento por derechos no atendidos se resuelve en «seis meses» y el sancionador en «doce meses» desde el acuerdo de inicio (art. 64).',
    },
    {
      t: 'table',
      headers: ['Artículo', 'Qué regula'],
      rows: [
        ['RGPD 5', 'Principios; 5.2, responsabilidad proactiva'],
        ['RGPD 6', 'Seis bases de licitud; c) obligación legal y e) interés público o poderes públicos; f) no para autoridades públicas'],
        ['RGPD 8 · LOPDGDD 7', 'Edad del consentimiento: 16 en el RGPD (mínimo 13); 14 en España'],
        ['RGPD 9', 'Categorías especiales: prohibición y excepciones'],
        ['RGPD 12–22', 'Derechos: un mes, prorrogable dos más; acceso, rectificación, supresión, limitación, portabilidad, oposición, decisiones automatizadas'],
        ['RGPD 24 y 28', 'Responsable y encargado; contrato o acto jurídico del 28.3'],
        ['RGPD 30 · LOPDGDD 31', 'Registro de actividades; inventario público de las entidades del 77.1'],
        ['RGPD 32', 'Seguridad del tratamiento'],
        ['RGPD 33 y 34', 'Brecha: 72 horas a la autoridad; a los afectados si hay alto riesgo'],
        ['RGPD 35 y 36', 'EIPD previa; consulta previa (ocho semanas + seis)'],
        ['RGPD 37–39 · LOPDGDD 34–37', 'DPD obligatorio en organismos públicos; diez días para comunicar su designación; reclamación previa ante el DPD'],
        ['LOPDGDD 57', 'Autoridades autonómicas: sector público autonómico y entidades locales de su territorio'],
        ['LOPDGDD 77', 'Régimen de las administraciones y consorcios: se declara la infracción, sin multa'],
        ['LOPDGDD DA 1.ª', 'El sector público aplica las medidas del ENS a los tratamientos de datos personales'],
      ],
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Lo que más se confunde',
      md: '**Plazos:** 72 horas a la autoridad (art. 33), un mes + dos para responder a un derecho (art. 12), diez días para comunicar el DPD (art. 34 LOPDGDD), ocho semanas + seis para la consulta previa (art. 36). **Edades:** 16 RGPD, mínimo 13, España 14. **Bases:** una administración se apoya en la obligación legal o en la misión de interés público, nunca en el interés legítimo. **Portabilidad** solo con consentimiento o contrato; **oposición** sí frente al 6.1 e). **Afectados** solo si hay alto riesgo, y no si los datos estaban cifrados. **250 personas** es la excepción del registro, no del DPD. **Sanciones:** los consorcios están en el art. 77.1.j y no se les multa; la infracción se declara. **ENS:** lo impone la disposición adicional primera de la LOPDGDD, también a los contratistas.',
    },
    {
      t: 'links',
      title: 'Privacidad y cumplimiento: también en la pista de Security+',
      items: [
        {
          label: 'Cumplimiento y privacidad: interesado, responsable y encargado, derecho al olvido (lección sp5m6)',
          href: '/learn/sp5m6',
        },
        {
          label: 'Protección de datos: tipos, clasificaciones, estados y métodos (lección sp3m6)',
          href: '/learn/sp3m6',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'op6m5q1',
      domain: 'ENS y normativa',
      prompt:
        'Según el artículo 33 del RGPD, ¿en qué plazo debe el responsable notificar una violación de la seguridad de los datos personales a la autoridad de control?',
      choices: [
        'En 24 horas desde que se produjo la violación',
        'Sin dilación indebida y, de ser posible, a más tardar 72 horas después de haber tenido constancia de ella',
        'En el plazo de un mes, prorrogable otros dos',
        'Sin dilación indebida, sin plazo máximo en horas',
      ],
      answer: 1,
      explain:
        'El artículo 33 fija las 72 horas y las cuenta desde que el responsable tiene constancia, no desde que ocurrió la violación; si notifica más tarde, debe explicar los motivos. El mes prorrogable dos meses es el plazo del artículo 12 para responder a los derechos, y «sin dilación indebida» sin más es el criterio del artículo 34 para avisar a los afectados.',
    },
    {
      id: 'op6m5q2',
      domain: 'ENS y normativa',
      prompt:
        'La AEPD concluye que el Consorcio de Arcedo ha cometido una infracción grave de protección de datos. Según el artículo 77 de la LOPDGDD, ¿cómo termina el procedimiento?',
      choices: [
        'Con una multa de hasta 10 000 000 EUR, como cualquier responsable',
        'Con una multa reducida, porque es una entidad del sector público',
        'Con una resolución que declara la infracción y establece, en su caso, las medidas que proceda adoptar, sin multa',
        'Se archiva, porque las administraciones están excluidas del régimen sancionador',
      ],
      answer: 2,
      explain:
        'Los consorcios están en el artículo 77.1.j, y el 77.2 ordena dictar una resolución que declara la infracción y fija medidas, excluyendo la del artículo 58.2.i del RGPD, que es imponer una multa. La primera opción aplica el régimen general del artículo 83. Y no hay archivo: la infracción se declara, puede proponer actuaciones disciplinarias y se comunica al Defensor del Pueblo.',
    },
    {
      id: 'op6m5q3',
      domain: 'ENS y normativa',
      prompt:
        'El Consorcio trata los datos de su plantilla para calcular las retenciones que le impone la normativa tributaria. ¿En qué base jurídica del artículo 6.1 del RGPD encaja mejor ese tratamiento?',
      choices: [
        'En la letra c), obligación legal',
        'En la letra f), interés legítimo del Consorcio',
        'En la letra a), consentimiento de cada empleado',
        'En el artículo 9, como categoría especial de datos',
      ],
      answer: 0,
      explain:
        'Cuando una ley impone el tratamiento, la base es la obligación legal de la letra c), que el artículo 8.1 de la LOPDGDD exige apoyar en una norma de Derecho de la Unión Europea o en una norma con rango de ley (el rango de ley como única vía es del 8.2, para la misión de interés público). El interés legítimo tienta, pero el artículo 6 no lo admite para las autoridades públicas en el ejercicio de sus funciones. El consentimiento no es adecuado cuando la ley obliga, y el artículo 9 regula categorías especiales, no bases de licitud.',
    },
    {
      id: 'op6m5q4',
      domain: 'ENS y normativa',
      prompt:
        'Un ciudadano ejerce su derecho de acceso ante el Consorcio. La solicitud es compleja y llegan muchas a la vez. ¿Qué plazo tiene el Consorcio para responder?',
      choices: [
        'Diez días hábiles, como cualquier solicitud administrativa',
        'Quince días hábiles desde la recepción',
        'Seis meses, el plazo del procedimiento ante la AEPD',
        'Un mes, prorrogable otros dos meses si es necesario, informando al interesado',
      ],
      answer: 3,
      explain:
        'El artículo 12 del RGPD exige responder sin dilación indebida y en todo caso en un mes, prorrogable otros dos meses, y si no va a actuar debe informar a más tardar al mes. Ni los diez ni los quince días hábiles son el plazo del RGPD; los seis meses son el plazo de la AEPD para resolver una reclamación por derechos no atendidos (art. 64 LOPDGDD).',
    },
    {
      id: 'op6m5q5',
      domain: 'ENS y normativa',
      prompt:
        '¿Qué dice el artículo 37 del RGPD, completado por la LOPDGDD, sobre el delegado de protección de datos de una administración como el Consorcio?',
      choices: [
        'Es obligatorio solo si la entidad emplea 250 personas o más',
        'Es voluntario, salvo que la entidad trate categorías especiales a gran escala',
        'Es obligatorio para toda autoridad u organismo público, salvo los tribunales en su función judicial, y su designación se comunica a la autoridad en diez días',
        'Es obligatorio, y lo asume por ley el responsable de la seguridad del ENS',
      ],
      answer: 2,
      explain:
        'El artículo 37.1.a hace obligatorio el DPD en autoridades y organismos públicos, con la única excepción de los tribunales en ejercicio de su función judicial, y el artículo 34 de la LOPDGDD exige comunicar la designación en diez días. Los 250 empleados son la excepción del registro de actividades (art. 30.5). Ninguna norma atribuye la función al responsable de la seguridad; en el Consorcio son figuras distintas.',
    },
    {
      id: 'op6m5q6',
      domain: 'ENS y normativa',
      prompt:
        'Roban en una oficina comarcal un portátil con datos de ciudadanos. El disco estaba cifrado y la clave no se ha visto comprometida. ¿Qué exige el RGPD respecto a los afectados?',
      choices: [
        'Comunicarles la violación en las 72 horas siguientes',
        'No es necesario comunicárselo, porque los datos estaban protegidos con cifrado; la violación se documenta',
        'Hacer una comunicación pública en el boletín oficial',
        'Comunicárselo solo si lo pide el DPD',
      ],
      answer: 1,
      explain:
        'El artículo 34.3 exime de comunicar a los interesados cuando los datos estaban protegidos con medidas como el cifrado, y el 33.5 obliga a documentar todas las violaciones. Las 72 horas son el plazo de notificación a la autoridad (art. 33), no a los afectados. La comunicación pública solo sustituye a la individual cuando avisar uno a uno exigiría un esfuerzo desproporcionado.',
    },
    {
      id: 'op6m5q7',
      domain: 'ENS y normativa',
      prompt:
        'El centro de formación de Valdecierzo abre una plataforma en línea y quiere saber a partir de qué edad puede un menor dar por sí mismo su consentimiento al tratamiento de sus datos en España.',
      choices: [
        'A partir de los catorce años',
        'A partir de los dieciséis años',
        'A partir de los trece años',
        'A partir de los dieciocho años',
      ],
      answer: 0,
      explain:
        'El artículo 7 de la LOPDGDD fija la edad en los mayores de catorce años. Dieciséis es la regla general del artículo 8 del RGPD, que los Estados pueden bajar hasta un mínimo de trece; España la ha fijado en catorce. Por debajo de esa edad, el consentimiento se rige por el artículo 7.2 de la LOPDGDD, y los titulares de la patria potestad podrán ejercitar los derechos del menor (art. 12.6).',
    },
    {
      id: 'op6m5q8',
      domain: 'ENS y normativa',
      prompt:
        'El Consorcio contrata a una empresa privada para gestionar sus nóminas. Según la disposición adicional primera de la LOPDGDD, ¿qué medidas de seguridad debe aplicar la empresa a esos datos?',
      choices: [
        'Las que elija con su propio análisis de riesgos, porque es una entidad privada',
        'Las de la norma ISO/IEC 27001, que sustituye al ENS en el sector privado',
        'Ninguna en particular: la responsabilidad es solo del Consorcio',
        'Las medidas que correspondan a la administración de origen, ajustadas al ENS',
      ],
      answer: 3,
      explain:
        'La disposición adicional primera obliga al tercero que presta un servicio por concesión, encomienda o contrato a aplicar las medidas de la administración de origen, ajustadas al ENS. La primera opción tienta porque el artículo 32 del RGPD parte del riesgo, pero en el sector público la LOPDGDD concreta esas medidas con el ENS. Además, como encargado, la empresa tiene sus propias obligaciones del artículo 28 del RGPD.',
    },
  ],
};
