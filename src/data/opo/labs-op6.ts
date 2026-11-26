import type { ClassifyData, LabMeta } from '../labs';

// ---------------------------------------------------------------------------
// Redes y ENS · Bloque 6 (ENS y normativa) — Consorcio Provincial de Arcedo
// ---------------------------------------------------------------------------

export const OP6_LABS: LabMeta[] = [
  {
    id: 'opl6a',
    sectionId: 'op6',
    title: 'La categoría de cada sistema',
    icon: '🏷️',
    minutes: 12,
    xp: 100,
    kind: 'classify',
    brief:
      'Doce sistemas del Consorcio con la valoración de sus cinco dimensiones ([C] confidencialidad, [I] integridad, [T] trazabilidad, [A] autenticidad, [D] disponibilidad) ya hecha por sus responsables. Salvo las de nóminas y la web informativa, que son las de la lección de categorización, las valoraciones son supuestas para el ejercicio. Asigna a cada uno la categoría que le corresponde por la regla del anexo I del Real Decreto 311/2022. Necesitas ≥80 %.',
    mission: {
      n: 2,
      briefing:
        'El Comité de Seguridad de la Información del Consorcio ha pedido el inventario de sistemas con su categoría antes de planificar las auditorías. Los responsables de la información y de los servicios ya han valorado cada dimensión; ahora le toca a la Unidad de Seguridad de la Información determinar la categoría, como manda el artículo 41. Una categoría por debajo de la real deja medidas sin aplicar; una por encima, auditorías y gastos que nadie necesitaba.',
    },
  },
  {
    id: 'opl6b',
    sectionId: 'op6',
    title: 'A quién hay que avisar',
    icon: '📣',
    minutes: 12,
    xp: 100,
    kind: 'classify',
    brief:
      'Doce incidentes en el Consorcio. Cada ficha dice si hay datos personales, el nivel de impacto que se le ha asignado según la instrucción técnica de seguridad (ITS) de Notificación y, si hay datos, la conclusión del delegado de protección de datos (DPD). Elige la notificación que toca y aún está pendiente: CCN-CERT, autoridad de control (la AEPD), personas afectadas o ninguna obligatoria. Necesitas ≥80 %.',
  },
  {
    id: 'opl6c',
    sectionId: 'op6',
    title: 'Cada medida en su marco',
    icon: '🗂️',
    minutes: 8,
    xp: 75,
    kind: 'classify',
    brief:
      'El anexo II del Real Decreto 311/2022 agrupa sus 73 medidas en tres bloques: marco organizativo [org], marco operacional [op] y medidas de protección [mp]. Coloca 12 medidas, por su nombre literal, en el bloque al que pertenecen; la explicación te da su código. Necesitas ≥80 %.',
  },
];

// ---------------------------------------------------------------------------
// Classify labs
// ---------------------------------------------------------------------------

const RULE =
  'Anexo I del Real Decreto 311/2022: la categoría es ALTA si alguna dimensión alcanza el nivel ALTO; MEDIA si alguna alcanza MEDIO y ninguna llega a ALTO; BÁSICA si alguna alcanza BAJO y ninguna supera ese nivel.';

const CCN =
  'Artículo 33.2 del Real Decreto 311/2022 e ITS de Notificación (apartado IV.3): las entidades del sector público notifican al CCN, cuya capacidad de respuesta es el CCN-CERT, los incidentes de nivel ALTO, MUY ALTO o CRÍTICO «en el momento en que se produzcan».';

const AEPD =
  'Artículo 33 del RGPD: la violación de seguridad de datos personales se notifica a la autoridad de control (para el Consorcio, la AEPD) «sin dilación indebida y, de ser posible, a más tardar 72 horas» después de tener constancia, salvo que sea improbable que suponga un riesgo; y la ITS de Notificación (apartado X.2) aclara que se hace «con independencia del nivel de impacto» en el ENS.';

const ART34 =
  'Artículo 34 del RGPD: cuando sea probable que la violación entrañe un «alto riesgo» para las personas, se les comunica «sin dilación indebida»; no hay cifra de horas.';

export const OP6_CLASSIFY_DATA: Record<string, ClassifyData> = {
  opl6a: {
    passPct: 80,
    categories: [
      { id: 'basica', label: 'BÁSICA' },
      { id: 'media', label: 'MEDIA' },
      { id: 'alta', label: 'ALTA' },
    ],
    items: [
      {
        text: 'Web informativa (noticias y agenda) · [C] sin nivel · [I] BAJO · [T] BAJO · [A] BAJO · [D] BAJO',
        answer: 'basica',
        why: `${RULE} La confidencialidad de lo que ya es público no se ve afectada y, como dice el anexo, esa dimensión «no se adscribirá a ningún nivel». El nivel más alto es BAJO: BÁSICA.`,
      },
      {
        text: 'Gestión de nóminas · [C] MEDIO · [I] MEDIO · [T] BAJO · [A] MEDIO · [D] BAJO',
        answer: 'media',
        why: `${RULE} Tres dimensiones en MEDIO no suman un ALTO: la regla mira el nivel más alto, no cuántas dimensiones lo alcanzan. MEDIA.`,
      },
      {
        text: 'Portafirmas electrónico de resoluciones · [C] MEDIO · [I] ALTO · [T] MEDIO · [A] MEDIO · [D] BAJO',
        answer: 'alta',
        why: `${RULE} Basta una dimensión en ALTO, aquí la integridad de las resoluciones firmadas, para que todo el sistema sea de categoría ALTA, aunque las otras se queden en MEDIO o BAJO.`,
      },
      {
        text: 'Reserva de aulas del centro de formación de Valdecierzo · [C] BAJO · [I] BAJO · [T] BAJO · [A] BAJO · [D] BAJO',
        answer: 'basica',
        why: `${RULE} Las cinco dimensiones se quedan en BAJO, el perjuicio «limitado» del anexo: BÁSICA.`,
      },
      {
        text: 'Telefonía IP de las tres oficinas comarcales · [C] BAJO · [I] BAJO · [T] sin nivel · [A] BAJO · [D] ALTO',
        answer: 'alta',
        why: `${RULE} La disponibilidad pesa igual que la confidencialidad: con [D] en ALTO el sistema es de categoría ALTA aunque el resto sea BAJO o no tenga nivel.`,
      },
      {
        text: 'Inventario de mobiliario y material de oficina · [C] sin nivel · [I] BAJO · [T] BAJO · [A] sin nivel · [D] BAJO',
        answer: 'basica',
        why: `${RULE} Las dimensiones que no se ven afectadas no se adscriben a ningún nivel y no cuentan. Del resto, el más alto es BAJO: BÁSICA.`,
      },
      {
        text: 'Contabilidad y tesorería · [C] MEDIO · [I] ALTO · [T] ALTO · [A] MEDIO · [D] MEDIO',
        answer: 'alta',
        why: `${RULE} La integridad y la trazabilidad llegan a ALTO; con una sola ya sería categoría ALTA.`,
      },
      {
        text: 'Correo electrónico corporativo · [C] MEDIO · [I] MEDIO · [T] BAJO · [A] MEDIO · [D] MEDIO',
        answer: 'media',
        why: `${RULE} Ninguna dimensión pasa de MEDIO, el perjuicio «grave» del anexo; el ALTO es el «muy grave». MEDIA.`,
      },
      {
        text: 'Gestión de personal y expedientes disciplinarios · [C] ALTO · [I] MEDIO · [T] MEDIO · [A] MEDIO · [D] BAJO',
        answer: 'alta',
        why: `${RULE} La confidencialidad en ALTO arrastra a todo el sistema a la categoría ALTA. Según el anexo, la categoría no cambia el nivel de las demás dimensiones, que siguen en MEDIO o BAJO a la hora de elegir las medidas que dependen de ellas.`,
      },
      {
        text: 'Portal de transparencia (datos ya publicados) · [C] sin nivel · [I] MEDIO · [T] BAJO · [A] BAJO · [D] BAJO',
        answer: 'media',
        why: `${RULE} Que la información sea pública solo deja sin nivel la confidencialidad; si se altera lo publicado, la integridad está en MEDIO. MEDIA.`,
      },
      {
        text: 'Servidor de ficheros de una oficina comarcal con dos carpetas: avisos al público ([C] BAJO · [I] BAJO · [T] BAJO · [A] BAJO · [D] BAJO) e informes técnicos en borrador ([C] MEDIO · [I] BAJO · [T] BAJO · [A] BAJO · [D] BAJO)',
        answer: 'media',
        why: `Cuando un sistema trata varias informaciones, el anexo I toma en cada dimensión «el mayor de los establecidos para cada información y cada servicio»: la confidencialidad queda en MEDIO por los informes. ${RULE} MEDIA.`,
      },
      {
        text: 'Plataforma de formación en línea del centro de Valdecierzo · [C] BAJO · [I] BAJO · [T] sin nivel · [A] BAJO · [D] BAJO',
        answer: 'basica',
        why: `${RULE} La trazabilidad no se ve afectada y queda sin nivel; las demás se quedan en BAJO: BÁSICA.`,
      },
    ],
  },

  opl6b: {
    passPct: 80,
    categories: [
      { id: 'ccn', label: 'CCN-CERT' },
      { id: 'aepd', label: 'Autoridad de control (AEPD)' },
      { id: 'afectados', label: 'Personas afectadas' },
      { id: 'ninguna', label: 'Sin obligación de notificar' },
    ],
    items: [
      {
        text: 'Un ataque de denegación de servicio distribuido deja sin servicio la web informativa durante varias horas. No hay datos personales afectados. Nivel de impacto: ALTO.',
        answer: 'ccn',
        why: `${CCN} Sin datos personales no entra el RGPD, así que no hay nada que notificar a la AEPD ni a nadie más.`,
      },
      {
        text: 'Un programa de secuestro de datos (ransomware) cifra el servidor de planos y proyectos de obra de la sede central. Esos ficheros no contienen datos personales. Nivel de impacto: MUY ALTO.',
        answer: 'ccn',
        why: `${CCN} Los plazos de 24/48 horas, 72 horas, 20 y 40 días del anexo del Real Decreto 43/2021 solo obligan a los operadores de servicios esenciales y a los proveedores de servicios digitales; para una entidad pública la regla es el artículo 33.2 y la ITS.`,
      },
      {
        text: 'Se detecta un servidor del centro de proceso de datos (CPD) comunicándose con un servidor de mando y control. El análisis confirma que en ese servidor no hay datos personales. Nivel de impacto: ALTO.',
        answer: 'ccn',
        why: `${CCN} ALTO es el umbral: desde ese nivel la notificación es obligatoria. Sin datos personales, ni la AEPD ni las personas entran en juego.`,
      },
      {
        text: 'Se publica por error en la web informativa, durante dos días, la lista de admitidos a un curso con nombre, apellidos y DNI. Nivel de impacto: BAJO. El DPD concluye que hay riesgo para las personas, pero no alto.',
        answer: 'aepd',
        why: `${AEPD} Con nivel BAJO no toca el CCN-CERT y, como el riesgo no es alto, tampoco hay que comunicarlo a las personas (artículo 34 del RGPD).`,
      },
      {
        text: 'La empresa que gestiona la plataforma de formación, encargada del tratamiento, avisa de que uno de sus empleados consultó sin necesidad los expedientes de 60 alumnos. Nivel de impacto: BAJO. El DPD concluye que hay riesgo, pero no alto.',
        answer: 'aepd',
        why: `Artículo 33.2 del RGPD: el encargado avisa al responsable «sin dilación indebida», y quien notifica es el responsable del tratamiento, el Consorcio. ${AEPD}`,
      },
      {
        text: 'Desde una oficina comarcal se envía un correo a 200 vecinos con todas las direcciones a la vista de los demás destinatarios. Nivel de impacto: BAJO. El DPD concluye que hay riesgo, pero no alto.',
        answer: 'aepd',
        why: `${AEPD} Un nivel BAJO no se notifica al CCN-CERT, pero la AEPD sí: la notificación a la autoridad de control no depende del nivel en el ENS.`,
      },
      {
        text: 'Un atacante entra con credenciales robadas y descarga las nóminas del personal, con IBAN y DNI. El CCN-CERT y la AEPD ya están notificados. El DPD concluye que hay alto riesgo de fraude.',
        answer: 'afectados',
        why: `${ART34} Las otras dos notificaciones ya están hechas; lo que falta es avisar al personal para que pueda protegerse.`,
      },
      {
        text: 'Se pierde un lápiz de memoria sin cifrar con los informes de valoración de discapacidad de 25 aspirantes a un proceso selectivo. La AEPD ya está notificada; nivel de impacto: BAJO. El DPD concluye que hay alto riesgo.',
        answer: 'afectados',
        why: `${ART34} El soporte no estaba cifrado, así que no cabe la excepción del artículo 34.3 por cifrado u otras medidas. Con nivel BAJO no hay notificación al CCN-CERT.`,
      },
      {
        text: 'Un error de configuración deja accesibles en internet durante una semana los justificantes de las ayudas de comedor del centro de formación, con datos bancarios y de salud. El CCN-CERT y la AEPD ya están notificados. El DPD concluye que hay alto riesgo.',
        answer: 'afectados',
        why: `${ART34} Las notificaciones al CCN-CERT y a la AEPD corren en paralelo y no sustituyen a esta: avisar a la autoridad no avisa a las personas.`,
      },
      {
        text: 'Un escaneo de puertos desde internet contra el cortafuegos de la sede central queda bloqueado. No hay datos personales afectados. Nivel de impacto: BAJO.',
        answer: 'ninguna',
        why: 'La ITS de Notificación (apartado IV.3) solo hace obligatoria la notificación al CCN-CERT desde el nivel ALTO, y sin datos personales no entra el artículo 33 del RGPD. No hay plazo que cumplir, pero el incidente se anota igualmente en el registro de la gestión de incidentes (medida op.exp.9 del anexo II).',
      },
      {
        text: 'Roban de un coche un portátil con datos de contacto de usuarios. El disco está cifrado y la clave no se ha visto comprometida. Nivel de impacto: BAJO. El DPD concluye que es improbable que haya riesgo para las personas.',
        answer: 'ninguna',
        why: 'Artículo 33.1 del RGPD: no se notifica a la autoridad de control cuando es improbable que la violación suponga un riesgo, y aquí esa es la conclusión del DPD. Con nivel BAJO tampoco toca el CCN-CERT. No hay plazo que cumplir, pero el artículo 33.5 obliga a documentar toda violación de seguridad, se notifique o no.',
      },
      {
        text: 'El antivirus del correo detiene un adjunto malicioso antes de que nadie lo abra. No hay datos personales afectados. Nivel de impacto: BAJO.',
        answer: 'ninguna',
        why: 'Por debajo de ALTO la notificación al CCN-CERT no es obligatoria (artículo 33.2 del Real Decreto 311/2022 e ITS de Notificación, apartado IV.3), y sin datos personales el RGPD no pide nada. No hay plazo que cumplir, pero se anota en el registro de la gestión de incidentes (op.exp.9).',
      },
    ],
  },

  opl6c: {
    passPct: 80,
    categories: [
      { id: 'org', label: 'Marco organizativo' },
      { id: 'op', label: 'Marco operacional' },
      { id: 'mp', label: 'Medidas de protección' },
    ],
    items: [
      {
        text: 'Política de seguridad',
        answer: 'org',
        why: 'org.1 Política de seguridad. El marco organizativo del anexo II tiene solo cuatro medidas, todas exigidas en cualquier categoría: org.1 a org.4.',
      },
      {
        text: 'Normativa de seguridad',
        answer: 'org',
        why: 'org.2 Normativa de seguridad. Recoge el uso correcto e indebido de equipos, servicios e instalaciones y la responsabilidad del personal: es organización, no técnica.',
      },
      {
        text: 'Procedimientos de seguridad',
        answer: 'org',
        why: 'org.3 Procedimientos de seguridad. Dicen cómo se hacen las tareas habituales y quién las hace; forman parte del marco organizativo.',
      },
      {
        text: 'Proceso de autorización',
        answer: 'org',
        why: 'org.4 Proceso de autorización. Cubre la autorización de instalaciones, equipos en producción, aplicaciones, enlaces, soportes y servicios de terceros. No se confunde con el control de acceso, que es op.acc.',
      },
      {
        text: 'Análisis de riesgos',
        answer: 'op',
        why: 'op.pl.1 Análisis de riesgos. Aunque suena a decisión de gobierno, el anexo II lo pone en el marco operacional, dentro de Planificación (op.pl).',
      },
      {
        text: 'Protección frente a código dañino',
        answer: 'op',
        why: 'op.exp.6 Protección frente a código dañino. Que empiece por «Protección» no la lleva a mp: está en el marco operacional, dentro de Explotación (op.exp).',
      },
      {
        text: 'Protección de servicios en la nube',
        answer: 'op',
        why: 'op.nub.1 Protección de servicios en la nube. Es la única medida del grupo Servicios en la nube (op.nub), que pertenece al marco operacional.',
      },
      {
        text: 'Plan de continuidad',
        answer: 'op',
        why: 'op.cont.2 Plan de continuidad. Pertenece a Continuidad del servicio (op.cont), en el marco operacional, y se exige solo con la disponibilidad en nivel ALTO.',
      },
      {
        text: 'Concienciación',
        answer: 'mp',
        why: 'mp.per.3 Concienciación. Parece organizativa, pero el anexo II la pone en medidas de protección, dentro de Gestión del personal (mp.per).',
      },
      {
        text: 'Copias de seguridad',
        answer: 'mp',
        why: 'mp.info.6 Copias de seguridad. No está en el marco operacional sino en medidas de protección, dentro de Protección de la información (mp.info).',
      },
      {
        text: 'Datos personales',
        answer: 'mp',
        why: 'mp.info.1 Datos personales. Medida de protección del grupo Protección de la información (mp.info): el responsable de la seguridad recoge los requisitos de protección de datos con el asesoramiento del DPD.',
      },
      {
        text: 'Protección frente a denegación de servicio',
        answer: 'mp',
        why: 'mp.s.4 Protección frente a denegación de servicio. Está en medidas de protección, dentro de Protección de los servicios (mp.s), y se exige por la dimensión de disponibilidad.',
      },
    ],
  },
};
