import type { Supuesto } from '../../../lib/supuesto';

// ---------------------------------------------------------------------------
// op6s2 — «El cifrado del registro de entrada» (bloque 6, ENS y normativa)
//
// Fuente única: docs/superpowers/sources/2026-11-26-op6-fuentes.md.
// Decisiones del caso:
// - Roles del Consorcio: los fijados por el controlador para op6 (Gerencia,
//   Secretaría General, Unidad de Seguridad de la Información, jefatura del
//   Servicio de Informática y Comunicaciones, DPD; autoridad de control: AEPD).
// - La ITS de Notificación manda clasificar con la guía CCN-STIC 817, cuyas
//   tablas no se pudieron leer. El procedimiento PROPIO del Consorcio (d-politica)
//   usa como referencia las tablas del anexo del RD 43/2021 (BOE) y lo dice; los
//   plazos de su tabla 3 solo obligan a OSE y PSD.
// - Notificación al CCN: RD 311/2022 art. 33.2 + ITS de Notificación §IV.3
//   («en el momento en que se produzcan», niveles CRÍTICO, MUY ALTO y ALTO).
// - Brecha: RGPD art. 33 (AEPD, 72 horas desde la constancia) y art. 34
//   (afectados, sin dilación indebida, si es probable un alto riesgo).
// - Ninguna respuesta depende de que la peligrosidad global sea ALTO o MUY ALTO:
//   solo se preguntan los tipos que el anexo fija literalmente.
// - El registro electrónico funciona a todas horas: la interrupción se cuenta
//   desde que dejó de responder (05:10), no desde el aviso del personal (07:55).
// - Categoría del sistema de registro: MEDIA, disponibilidad MEDIO (hecho nuevo
//   para el canon; la categoría de la sede la decide op6s1).
// - Quién firma la notificación a la AEPD y la comunicación a los afectados es
//   un hecho del procedimiento del Consorcio, no una regla de la norma.
// ---------------------------------------------------------------------------

const L1 = { label: 'Lección: el ENS, marco, principios y roles', href: '/learn/op6m1' };
const L3 = { label: 'Lección: las medidas del anexo II', href: '/learn/op6m3' };
const L4 = { label: 'Lección: conformidad, auditoría e incidentes', href: '/learn/op6m4' };
const L5 = { label: 'Lección: protección de datos en la administración', href: '/learn/op6m5' };
const RD311 = { label: 'Real Decreto 311/2022, Esquema Nacional de Seguridad', href: 'https://www.boe.es/buscar/act.php?id=BOE-A-2022-7191' };
const RD311_13 = { label: 'RD 311/2022, art. 13: organización e implantación del proceso de seguridad', href: 'https://www.boe.es/buscar/act.php?id=BOE-A-2022-7191' };
const RD311_33 = { label: 'RD 311/2022, art. 33: capacidad de respuesta a incidentes', href: 'https://www.boe.es/buscar/act.php?id=BOE-A-2022-7191' };
const RD311_A2 = { label: 'RD 311/2022, anexo II: medidas de seguridad', href: 'https://www.boe.es/buscar/act.php?id=BOE-A-2022-7191' };
const ITS_NOT = { label: 'ITS de Notificación de Incidentes de Seguridad', href: 'https://www.boe.es/buscar/act.php?id=BOE-A-2018-5370' };
const RD43 = { label: 'Real Decreto 43/2021, anexo: niveles de peligrosidad e impacto', href: 'https://www.boe.es/buscar/act.php?id=BOE-A-2021-1192' };
const RGPD = { label: 'Reglamento (UE) 2016/679 (RGPD)', href: 'http://data.europa.eu/eli/reg/2016/679/oj' };
const RGPD_33 = { label: 'RGPD, art. 33: notificación a la autoridad de control', href: 'http://data.europa.eu/eli/reg/2016/679/oj' };
const RGPD_34 = { label: 'RGPD, art. 34: comunicación al interesado', href: 'http://data.europa.eu/eli/reg/2016/679/oj' };
const RGPD_39 = { label: 'RGPD, arts. 38 y 39: posición y funciones del DPD', href: 'http://data.europa.eu/eli/reg/2016/679/oj' };
const LOPDGDD = { label: 'Ley Orgánica 3/2018 (LOPDGDD), art. 77', href: 'https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673' };

const op6s2: Supuesto = {
  id: 'op6s2',
  track: 'opo',
  sectionIds: ['op6'],
  version: 1,
  title: 'El cifrado del registro de entrada',
  brief: 'Un programa de secuestro cifra el registro electrónico de entrada del Consorcio y se lleva datos personales: valora el incidente, decide qué se notifica, a quién y cuándo, reparte las decisiones entre los roles, contén, restaura y escribe a las personas afectadas.',
  minutes: 60,
  prerequisites: ['op6m1', 'op6m3', 'op6m4', 'op6m5'],
  dossier: [
    {
      id: 'd-alerta',
      title: 'Parte de incidencia del Servicio de Informática',
      kind: 'memo',
      body: [
        { t: 'p', md: '**De:** jefatura del Servicio de Informática y Comunicaciones · **Para:** Unidad de Seguridad de la Información · **Asunto:** registro electrónico de entrada caído · **Lunes, 08:20**' },
        {
          t: 'list',
          items: [
            '**05:10** · La monitorización marca que la aplicación del registro electrónico de entrada (servidor REG-APP) deja de responder. El aviso queda en la consola; a esa hora no hay nadie de guardia.',
            '**07:55** · La oficina de registro llama: la aplicación no abre, ni para el personal ni para quien presenta escritos desde la sede electrónica.',
            '**08:10** · Un técnico confirma que en REG-APP y en REG-DOC (base de datos y documentos anexos del registro) los archivos tienen una extensión nueva y no se pueden abrir. En cada carpeta hay un archivo de texto con el mismo mensaje.',
            '**08:15** · Revisados por encima los demás servidores del CPD: por ahora, sin rastro. El CPD tiene **46** servidores; los afectados son **2**.',
          ],
        },
        { t: 'quote', md: '«Hemos cifrado sus archivos y antes nos hemos llevado una copia de sus datos. Si no paga, los publicaremos.»', by: 'Mensaje encontrado en REG-APP y REG-DOC' },
      ],
    },
    {
      id: 'd-cortafuegos',
      title: 'Registro del cortafuegos perimetral (extracto)',
      kind: 'log',
      body: [
        {
          t: 'code',
          lang: 'text',
          title: 'Cortafuegos de la sede · lunes (salida ilustrativa, sin sintaxis de fabricante)',
          text: `01:58:41  VPN de administración: sesión abierta  usuario adm-reg  origen 198.51.100.77
02:03:10  adm-reg -> 10.20.20.31 (REG-DOC)  administración remota  permitido
02:12:05  10.20.20.31 (REG-DOC) -> 198.51.100.77:443  sesión abierta
04:41:37  10.20.20.31 (REG-DOC) -> 198.51.100.77:443  sesión cerrada  enviados 14,2 GB
04:52:19  adm-reg -> 10.20.20.30 (REG-APP)  administración remota  permitido
05:06:02  VPN de administración: sesión cerrada  usuario adm-reg`,
        },
      ],
    },
    {
      id: 'd-sistema',
      title: 'Ficha del sistema de registro electrónico de entrada',
      kind: 'table',
      body: [
        {
          t: 'table',
          headers: ['Campo', 'Valor'],
          rows: [
            ['Responsable del servicio', 'Secretaría General'],
            ['Categoría de seguridad', 'MEDIA; disponibilidad valorada en nivel MEDIO'],
            ['Servidores', 'REG-APP `10.20.20.30` (aplicación) y REG-DOC `10.20.20.31` (base de datos y documentos anexos), en el CPD de la sede'],
            ['Datos de cada asiento', 'Nombre y apellidos, DNI, domicilio, correo electrónico y teléfono de quien presenta el escrito, asunto y documentos anexos'],
            ['Volumen', 'Unos 18.400 asientos de los últimos 24 meses; el resto está en el archivo'],
            ['Anexos destacados', 'Unas 900 solicitudes de la convocatoria de ayudas para adaptar viviendas, con el informe del grado de discapacidad de la persona solicitante'],
            ['Cómo se guardan los anexos', 'En REG-DOC, **sin cifrar**'],
          ],
        },
      ],
    },
    {
      id: 'd-politica',
      title: 'Política de seguridad y procedimiento de incidentes del Consorcio (extracto)',
      kind: 'norma',
      body: [
        { t: 'h', text: 'Roles (política de seguridad)' },
        {
          t: 'table',
          headers: ['Rol', 'Quién lo ejerce'],
          rows: [
            ['Responsable de la información', 'La Gerencia del Consorcio'],
            ['Responsable del servicio (sede electrónica y registro electrónico)', 'La Secretaría General'],
            ['Responsable de la seguridad', 'La Unidad de Seguridad de la Información, que depende de la Gerencia y no del Servicio de Informática'],
            ['Responsable del sistema', 'La jefatura del Servicio de Informática y Comunicaciones'],
            ['Delegado de protección de datos (DPD)', 'Designado por el Consorcio; no es el responsable de la seguridad'],
            ['Comité de Seguridad de la Información', 'Presidido por la Gerencia'],
          ],
        },
        { t: 'h', text: 'Procedimiento de gestión de incidentes (procedimiento propio del Consorcio, no es una norma)' },
        {
          t: 'list',
          ordered: true,
          items: [
            'Quien detecte un incidente avisa a la jefatura del Servicio de Informática y a la Unidad de Seguridad.',
            'La Unidad de Seguridad estima el nivel del incidente. La ITS de Notificación pide clasificarlo con la guía CCN-STIC 817; mientras no se disponga de esa clasificación, la Unidad usa como referencia las tablas de peligrosidad e impacto del anexo del RD 43/2021, publicadas en el BOE, y trata como «nivel ALTO o superior» el incidente que alcance ALTO en peligrosidad o en algún criterio de impacto.',
            'La Unidad de Seguridad es el punto de contacto del Consorcio con los equipos de respuesta a incidentes y lleva el registro del incidente.',
            'Si hay datos personales, la Unidad avisa al DPD en cuanto lo sepa.',
            'Las comunicaciones del Consorcio por datos personales, a la AEPD y a las personas afectadas, las firma la Gerencia en nombre del Consorcio, con el asesoramiento del DPD.',
          ],
        },
      ],
    },
    {
      id: 'd-anexo',
      title: 'Extracto del anexo del RD 43/2021: peligrosidad e impacto',
      kind: 'norma',
      body: [
        { t: 'p', md: 'Instrucción nacional de notificación y gestión de ciberincidentes, anexo del Real Decreto 43/2021 (BOE-A-2021-1192). Extracto con parte de las tablas.' },
        { t: 'h', text: 'Peligrosidad (cinco niveles: CRÍTICO, MUY ALTO, ALTO, MEDIO, BAJO)' },
        {
          t: 'table',
          headers: ['Nivel', 'Tipos (extracto)'],
          rows: [
            ['CRÍTICO', 'APT'],
            ['MUY ALTO', 'Distribución de malware, configuración de malware, robo, sabotaje, interrupciones'],
            ['ALTO', 'Sistema infectado, servidor C&C, compromiso de aplicaciones, compromiso de cuentas con privilegios, ataque desconocido, DoS, DDoS, acceso no autorizado a información, modificación no autorizada de información, pérdida de datos, phishing'],
            ['MEDIO', 'Ingeniería social, explotación de vulnerabilidades conocidas, intento de acceso con vulneración de credenciales, compromiso de cuentas sin privilegios, revelación de información, sistema vulnerable'],
            ['BAJO', 'Spam, escaneo de redes, análisis de paquetes, otros'],
          ],
        },
        { t: 'p', md: 'En la taxonomía, el tipo «Modificación no autorizada de información» incluye como ejemplo el «encriptado de datos mediante ransomware». Si un suceso encaja en varios tipos, se toma el de mayor peligrosidad.' },
        { t: 'h', text: 'Impacto (seis niveles: CRÍTICO, MUY ALTO, ALTO, MEDIO, BAJO, SIN IMPACTO) · dos de los criterios' },
        {
          t: 'table',
          headers: ['Nivel', '% de sistemas afectados', 'Interrupción en la prestación del servicio'],
          rows: [
            ['CRÍTICO', 'Más del 90 %', 'Superior a 24 horas y superior al 50 % de los usuarios'],
            ['MUY ALTO', 'Más del 75 %', 'Superior a 8 horas y superior al 35 %'],
            ['ALTO', 'Más del 50 %', 'Superior a 1 hora y superior al 10 %'],
            ['MEDIO', 'Más del 20 %', 'Superior al 5 % de usuarios'],
            ['BAJO', 'Afecta a los sistemas', 'Interrupción de la prestación de un servicio'],
          ],
        },
      ],
    },
    {
      id: 'd-copias',
      title: 'Informe del Servicio de Informática sobre las copias de seguridad del registro',
      kind: 'memo',
      unlockedBy: 'f3',
      body: [
        { t: 'p', md: '**De:** jefatura del Servicio de Informática y Comunicaciones · **Para:** Unidad de Seguridad de la Información · **Lunes, 10:05**' },
        {
          t: 'list',
          items: [
            '**Copia diaria** de REG-APP y REG-DOC, todos los días a las 22:00, en la cabina de copias del CPD, conectada a la red y administrada con las mismas cuentas que los servidores: sus ficheros aparecen cifrados desde las 05:03.',
            '**Copia semanal**, los domingos a las 22:00, en el centro de formación de Valdecierzo, en un soporte que se desconecta de la red al terminar: intacta. La última prueba de recuperación se hizo hace tres meses y salió bien.',
            'La cuenta de administración **adm-reg** sigue activa y con la misma contraseña.',
            'Hay dos servidores nuevos preparados en el CPD, sin conectar todavía a la red.',
          ],
        },
      ],
    },
    {
      id: 'd-cierre',
      title: 'Informe de cierre del día',
      kind: 'memo',
      unlockedBy: 'f4',
      body: [
        { t: 'p', md: '**De:** Unidad de Seguridad de la Información · **Para:** Comité de Seguridad de la Información · **Lunes, 18:00**' },
        {
          t: 'list',
          items: [
            'El registro electrónico vuelve a dar servicio a las **14:30**, en los dos servidores nuevos, con la copia del domingo de Valdecierzo. Se han perdido los asientos presentados entre las 22:00 del domingo y la caída; se localizarán por los acuses de recibo.',
            'La cuenta adm-reg está desactivada y se han cambiado todas las contraseñas de administración. Según el análisis preliminar, la contraseña de adm-reg se obtuvo con un correo de suplantación el jueves anterior.',
            'REG-APP y REG-DOC siguen aislados, con los registros del cortafuegos y de los servidores guardados como evidencias.',
            'Datos copiados, según la estimación: los asientos de los últimos 24 meses, de unas **18.400 personas**, y sus anexos, entre ellos las unas **900** solicitudes de ayudas con informe del grado de discapacidad. Por ahora no consta que se hayan publicado.',
          ],
        },
      ],
    },
  ],
  phases: [
    // -----------------------------------------------------------------------
    {
      id: 'f1',
      title: 'Valorar el incidente',
      context:
        'Son las 09:30 del lunes. La Unidad de Seguridad tiene que estimar el nivel del incidente antes de decidir nada más. Sigue el procedimiento del Consorcio que tienes en el expediente: como referencia, las tablas del anexo del RD 43/2021. Ten presente que el registro electrónico atiende a todas horas.',
      carry:
        'Valoración con las tablas del anexo del RD 43/2021: el cifrado por programa de secuestro es «modificación no autorizada de información» y la copia de datos es «acceso no autorizado a información», los dos de peligrosidad ALTO. En impacto, 2 de 46 servidores es nivel BAJO por porcentaje de sistemas, y la interrupción, que dura desde las 05:10 y afecta a todos los usuarios, ya es ALTO. Según el procedimiento del Consorcio, el incidente es de nivel ALTO o superior. Los registros del cortafuegos y la ficha del sistema prueban que salieron 14,2 GB desde el servidor de los documentos.',
      tasks: [
        {
          id: 'f1t1',
          kind: 'table',
          topic: 'op6m4',
          prompt: 'Con el extracto del anexo del RD 43/2021, da el nivel de cada criterio tal como está a las 09:30.',
          fields: [
            { id: 'nivel', label: 'Nivel', options: ['CRÍTICO', 'MUY ALTO', 'ALTO', 'MEDIO', 'BAJO', 'SIN IMPACTO'] },
          ],
          rows: [
            { id: 'pcifrado', label: 'Peligrosidad del tipo en el que el anexo sitúa el cifrado de datos con un programa de secuestro', answer: { nivel: 'ALTO' } },
            { id: 'pcopia', label: 'Peligrosidad del acceso no autorizado a información (la copia que salió del registro)', answer: { nivel: 'ALTO' } },
            { id: 'isistemas', label: 'Impacto por porcentaje de sistemas afectados', answer: { nivel: 'BAJO' } },
            { id: 'iinterrupcion', label: 'Impacto por interrupción del servicio, a las 09:30', answer: { nivel: 'ALTO' } },
          ],
          points: 8,
          hint: { text: 'Para la interrupción, cuenta desde la primera hora en que el registro dejó de responder, no desde que llamó el personal.', cost: 1 },
          explain:
            'El anexo pone como ejemplo de «modificación no autorizada de información» el «encriptado de datos mediante ransomware», y ese tipo es de peligrosidad ALTO; el «acceso no autorizado a información», que es lo que supone la copia, también es ALTO. Tienta subir el cifrado a MUY ALTO por «distribución de malware», pero el anexo lo encaja expresamente en otro tipo. En impacto, 2 de 46 servidores es menos del 5 %: no llega al «más del 20 %» del nivel MEDIO, así que queda en BAJO («afecta a los sistemas»). La interrupción afecta a todos los usuarios desde las 05:10: a las 09:30 lleva más de 4 horas, que es «superior a 1 hora y superior al 10 %» (ALTO) sin pasar de 8 horas. Contar desde las 07:55 daría el mismo nivel ahora, pero es un error que se paga más tarde.',
          refs: [L4, RD43],
        },
        {
          id: 'f1t2',
          kind: 'choice',
          topic: 'op6m4',
          prompt: 'Alguien del comité pregunta por qué se valora con las tablas del RD 43/2021 si el Consorcio no es un operador de servicios esenciales. ¿Qué afirmación sobre las escalas es correcta?',
          options: [
            { id: 'a', text: 'Son la misma escala: el anexo del RD 43/2021 sustituyó a la ITS de Notificación, y por eso el Consorcio debe cumplir sus plazos de 24/48 horas, 72 horas, 20 y 40 días' },
            { id: 'b', text: 'La ITS de Notificación, que es la que obliga al Consorcio, manda clasificar con la guía CCN-STIC 817 y usa seis niveles de impacto potencial, de Irrelevante a Crítico; el anexo del RD 43/2021 tiene su propia escala de impacto, con «sin impacto» como nivel más bajo, otra de peligrosidad con cinco niveles, y sus plazos obligan a los operadores de servicios esenciales y a los proveedores de servicios digitales' },
            { id: 'c', text: 'El nivel del incidente es la categoría del sistema: como el registro es de categoría MEDIA, el incidente es de nivel MEDIO' },
            { id: 'd', text: 'La peligrosidad y el impacto usan los mismos seis niveles, de «sin impacto» a «crítico»' },
          ],
          answer: 'b',
          points: 4,
          explain:
            'Para una entidad pública, el art. 33.2 del RD 311/2022 y la ITS de Notificación son la regla: la ITS remite a la guía CCN-STIC 817 y enumera seis niveles de impacto potencial (Irrelevante, Bajo, Medio, Alto, Muy Alto y Crítico). El anexo del RD 43/2021 es otra norma, con su escala de impacto (de CRÍTICO a SIN IMPACTO) y una de peligrosidad de cinco niveles; el RD 311/2022 solo lo enlaza para OSE y PSD (art. 25), y su tabla de plazos obliga a esos sujetos. Que el Consorcio use sus tablas como referencia es una decisión de su procedimiento, y así lo dice. Tienta pensar que una norma sustituyó a la otra y que el Consorcio hereda los plazos de 24/48 horas, 72 horas, 20 y 40 días. La categoría del sistema (BÁSICA, MEDIA, ALTA) mide lo que se protege, no la gravedad de un incidente concreto.',
          refs: [L4, ITS_NOT, RD43, RD311_33],
        },
        {
          id: 'f1t3',
          kind: 'cite',
          topic: 'op6m4',
          prompt: 'El mensaje de los atacantes dice que se han llevado una copia, pero podría ser un farol. Señala los documentos que, juntos, prueban que salieron datos del registro sin fiarte de lo que dicen los atacantes.',
          answerSets: [['d-cortafuegos', 'd-sistema']],
          points: 5,
          explain:
            'El registro del cortafuegos muestra que la dirección `10.20.20.31` envió 14,2 GB a una dirección externa entre las 02:12 y las 04:41; la ficha del sistema dice que esa dirección es REG-DOC, el servidor de la base de datos y los anexos del registro. Con los dos se sabe qué servidor sacó cuántos datos y de qué tipo son. El parte de incidencia tienta porque recoge el mensaje, pero solo prueba lo que afirman los atacantes; por eso marcarlo deja la respuesta incompleta. El extracto del anexo sirve para valorar, no para probar hechos.',
          refs: [L4, L5],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'f2',
      title: 'Qué se notifica, a quién y cuándo',
      context:
        'Con el incidente valorado, la Unidad de Seguridad prepara las comunicaciones. Hay dos normas en juego a la vez: el ENS, por la seguridad del sistema, y el RGPD, porque el registro guarda datos personales. Cada una tiene su destinatario y su plazo, y corren en paralelo.',
      carry:
        'Al CCN (CCN-CERT): en el momento en que se produce, por ser de nivel ALTO o superior (RD 311/2022, art. 33.2, e ITS de Notificación). A la AEPD: sin dilación indebida y, si es posible, en 72 horas desde que el Consorcio tuvo constancia (RGPD, art. 33), aunque ya se haya avisado al CCN-CERT. Al INCIBE-CERT no le toca: es el equipo de referencia de las entidades privadas. Lo que se haga con las personas afectadas se decide al cerrar el día.',
      tasks: [
        {
          id: 'f2t1',
          kind: 'table',
          topic: 'op6m4',
          prompt: 'Completa, para cada destinatario, el plazo y la norma que lo fija. Si a uno no le corresponde recibir nada del Consorcio, dilo.',
          fields: [
            {
              id: 'plazo',
              label: 'Plazo',
              options: [
                'En el momento en que se produce, por ser de nivel ALTO o superior',
                'Sin dilación indebida y, si es posible, en 72 horas desde que se tiene constancia',
                'Sin dilación indebida, por ser probable un alto riesgo para ellas',
                'Inicial inmediata, intermedia a las 24/48 horas y final a los 20 días',
                'Alerta temprana en 24 horas y notificación en 72 horas',
                'No le corresponde',
              ],
            },
            {
              id: 'norma',
              label: 'Norma',
              options: [
                'RD 311/2022, art. 33.2, e ITS de Notificación',
                'RGPD, art. 33',
                'RGPD, art. 34',
                'Anexo del RD 43/2021 (tabla de plazos)',
                'Directiva (UE) 2022/2555, art. 23',
                'RD 311/2022, art. 33.7 (entidades privadas)',
              ],
            },
          ],
          rows: [
            { id: 'ccn', label: 'Centro Criptológico Nacional (CCN-CERT)', answer: { plazo: 'En el momento en que se produce, por ser de nivel ALTO o superior', norma: 'RD 311/2022, art. 33.2, e ITS de Notificación' } },
            { id: 'aepd', label: 'Agencia Española de Protección de Datos (AEPD)', answer: { plazo: 'Sin dilación indebida y, si es posible, en 72 horas desde que se tiene constancia', norma: 'RGPD, art. 33' } },
            { id: 'afectados', label: 'Personas cuyos datos estaban en el registro', answer: { plazo: 'Sin dilación indebida, por ser probable un alto riesgo para ellas', norma: 'RGPD, art. 34' } },
            { id: 'incibe', label: 'INCIBE-CERT', answer: { plazo: 'No le corresponde', norma: 'RD 311/2022, art. 33.7 (entidades privadas)' } },
          ],
          points: 12,
          hint: { text: 'El Consorcio es una entidad pública, no un operador de servicios esenciales, y la Directiva NIS2 sigue sin trasponerse en España.', cost: 2 },
          explain:
            'Las entidades del sector público notifican al CCN los incidentes con impacto significativo según la ITS (art. 33.2 del RD 311/2022), y la ITS obliga a hacerlo «en el momento en que se produzcan» con los de nivel CRÍTICO, MUY ALTO o ALTO. La AEPD, autoridad de control del Consorcio, recibe la violación de datos «sin dilación indebida y, de ser posible, a más tardar 72 horas» después de tener constancia (art. 33 del RGPD). A las personas se les comunica sin dilación indebida cuando es probable un alto riesgo (art. 34): aquí hay DNI, domicilios y datos de salud copiados y una amenaza de publicarlos. El INCIBE-CERT recibe las notificaciones de las entidades privadas que prestan servicios al sector público (art. 33.7), no las de una entidad pública. Tientan los plazos de 24/48 horas y 20 días, que son de la tabla del RD 43/2021 para OSE y PSD, y la alerta temprana de 24 horas de la Directiva NIS2, en vigor pero sin trasponer en España.',
          refs: [L4, L5, RD311_33, ITS_NOT, RGPD_33, RGPD_34, RD43],
        },
        {
          id: 'f2t2',
          kind: 'choice',
          topic: 'op6m4',
          prompt: 'Supón que la Unidad de Seguridad hubiera estimado el incidente en un nivel bajo para el ENS. ¿Qué pasaría con la notificación a la AEPD?',
          options: [
            { id: 'a', text: 'Tampoco habría que hacerla: si el ENS no obliga a notificar, el RGPD tampoco' },
            { id: 'b', text: 'Seguiría haciendo falta: la ITS de Notificación dice que la notificación a la autoridad de control por datos personales se hace con independencia del nivel de impacto en el ENS, según el art. 33 del RGPD' },
            { id: 'c', text: 'Solo habría que hacerla si el CCN-CERT lo pidiera al revisar el incidente' },
            { id: 'd', text: 'Se haría al INCIBE-CERT, que es el equipo de referencia de la ciudadanía' },
          ],
          answer: 'b',
          points: 4,
          explain:
            'La ITS de Notificación (apartado X.2) separa los dos caminos: si un incidente afecta a datos personales, la notificación a la autoridad de control se hace «con independencia del nivel de impacto» en el ENS, con el criterio del art. 33 del RGPD, que solo la excusa cuando sea improbable que la violación suponga un riesgo para las personas. Tienta pensar que el nivel del ENS decide las dos cosas, pero cada norma tiene su umbral. El CCN-CERT no da permiso para notificar a la AEPD, y el INCIBE-CERT no es el destinatario de una violación de datos de una entidad pública.',
          refs: [L4, L5, ITS_NOT, RGPD_33],
        },
        {
          id: 'f2t3',
          kind: 'multi',
          topic: 'op6m5',
          prompt: 'Sobre la notificación a la AEPD y sus consecuencias, marca **todas** las afirmaciones ciertas.',
          options: [
            { id: 'a', text: 'Las 72 horas se cuentan desde que el Consorcio tuvo constancia de la violación, no desde que termine la investigación' },
            { id: 'b', text: 'Si se notifica pasadas las 72 horas, hay que explicar los motivos del retraso' },
            { id: 'c', text: 'El Consorcio tiene que documentar todas sus violaciones de seguridad de datos personales, las notifique o no' },
            { id: 'd', text: 'Como ya se ha avisado al CCN-CERT, la AEPD queda informada y no hace falta notificarle aparte' },
            { id: 'e', text: 'Si la AEPD declara una infracción, impondrá al Consorcio una multa de hasta 10 millones de euros o el 2 %' },
          ],
          answer: ['a', 'b', 'c'],
          points: 5,
          explain:
            'El art. 33 del RGPD cuenta las 72 horas desde que se tiene constancia, pide los motivos si se notifica fuera de plazo y obliga a documentar cualquier violación (33.5), también las que no se notifican. Avisar al CCN-CERT no sustituye a la AEPD: son destinatarios distintos con normas distintas. La multa tienta porque el art. 83.4 del RGPD fija esas cifras, pero el art. 77 de la LOPDGDD incluye a los consorcios (77.1.j) entre las entidades a las que la autoridad no multa: dicta una resolución que declara la infracción y fija, en su caso, las medidas que hay que adoptar, con excepción de la multa del art. 58.2.i del RGPD.',
          refs: [L5, RGPD_33, LOPDGDD],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'f3',
      title: 'Quién decide cada paso',
      context:
        'A las 10:00 se reúne el Comité de Seguridad de la Información. Hay que repartir el trabajo de las próximas horas sin que nadie decida lo que no le toca. Usa los roles de la política del Consorcio y lo que dice la norma de cada uno.',
      carry:
        'Reparto: la jefatura del Servicio de Informática, responsable del sistema, aísla y restaura; la Secretaría General, responsable del servicio, decide cómo se atiende el registro mientras tanto y con qué requisitos vuelve; la Unidad de Seguridad decide qué medidas se refuerzan y actualiza la Declaración de Aplicabilidad; el DPD asesora y es el punto de contacto con la AEPD; la Gerencia firma las comunicaciones por datos personales. Decidir cómo se cumplen los requisitos de seguridad es de la Unidad de Seguridad, no de quien explota el sistema.',
      tasks: [
        {
          id: 'f3t1',
          kind: 'match',
          topic: 'op6m1',
          prompt: 'Empareja cada decisión con quien la toma en el Consorcio.',
          left: [
            { id: 'm1', text: 'Aislar REG-APP y REG-DOC y dirigir la restauración del sistema' },
            { id: 'm2', text: 'Decidir cómo se atiende el registro de entrada mientras está caído y qué requisitos tiene que cumplir el servicio cuando vuelva' },
            { id: 'm3', text: 'Decidir qué medidas de seguridad se refuerzan y firmar la Declaración de Aplicabilidad actualizada' },
            { id: 'm4', text: 'Asesorar sobre el riesgo para las personas y hacer de punto de contacto con la AEPD' },
            { id: 'm5', text: 'Firmar, en nombre del Consorcio, la notificación a la AEPD' },
          ],
          right: [
            { id: 'gerencia', text: 'La Gerencia' },
            { id: 'secretaria', text: 'La Secretaría General' },
            { id: 'unidad', text: 'La Unidad de Seguridad de la Información' },
            { id: 'informatica', text: 'La jefatura del Servicio de Informática y Comunicaciones' },
            { id: 'dpd', text: 'El delegado de protección de datos' },
          ],
          answer: { m1: 'informatica', m2: 'secretaria', m3: 'unidad', m4: 'dpd', m5: 'gerencia' },
          points: 10,
          explain:
            'El art. 13.2 del RD 311/2022 reparte las funciones: el responsable del servicio (la Secretaría General) determina los requisitos de los servicios; el responsable de la seguridad (la Unidad) decide cómo se satisfacen y firma la Declaración de Aplicabilidad (art. 28.2); el responsable del sistema (la jefatura de Informática) implanta la seguridad en el sistema y supervisa su operación diaria, así que aísla y restaura. El DPD informa, asesora y coopera con la autoridad de control como punto de contacto (art. 39 del RGPD). Quién firma por el Consorcio ante la AEPD no lo dice ninguna norma: lo fija el procedimiento propio del Consorcio, que se lo da a la Gerencia. Tienta dar al DPD la firma, pero su papel es asesorar y hacer de enlace, no decidir por el Consorcio.',
          refs: [L1, L5, RD311_13, RGPD_39],
        },
        {
          id: 'f3t2',
          kind: 'choice',
          topic: 'op6m1',
          prompt: 'La jefatura del Servicio de Informática propone que, como sus técnicos son los que están restaurando, sea ella quien decida si el registro vuelve con las mismas medidas de seguridad, y que la Unidad de Seguridad firme después. ¿Qué le responde la Unidad?',
          options: [
            { id: 'a', text: 'Que tiene razón: el responsable del sistema determina la categoría del sistema y sus medidas (art. 41)' },
            { id: 'b', text: 'Que decidir cómo se cumplen los requisitos de seguridad le toca al responsable de la seguridad, que debe ser distinto del responsable del sistema y no depender jerárquicamente de él (art. 13.3): la seguridad va separada de la explotación' },
            { id: 'c', text: 'Que lo decide el DPD, porque hay datos personales' },
            { id: 'd', text: 'Que lo decide la Secretaría General, porque el responsable del servicio fija también las medidas técnicas' },
          ],
          answer: 'b',
          points: 5,
          explain:
            'El art. 11 del RD 311/2022 separa la seguridad de la explotación, y el art. 13.3 exige que el responsable de la seguridad sea distinto del responsable del sistema, sin dependencia jerárquica entre ambos: por eso la Unidad depende de la Gerencia y no de Informática. El art. 41 tienta, pero dice lo contrario: valoran los responsables de la información y del servicio, y determina la categoría el responsable de la seguridad. El DPD asesora y supervisa sin recibir instrucciones, pero no decide las medidas; la Secretaría General fija los requisitos del servicio, no cómo se cumplen.',
          refs: [L1, RD311_13, RD311],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'f4',
      title: 'Contención y continuidad',
      context:
        'Son las 10:15. El Servicio de Informática ha dejado en el expediente un informe sobre las copias de seguridad. Hay que frenar el ataque, guardar las pruebas y devolver el registro a la ciudadanía cuanto antes, sin abrir otra vez la puerta a los atacantes.',
      carry:
        'Se aíslan REG-APP y REG-DOC sin borrar nada, se guardan los registros como evidencias y se informa a la Gerencia y a la Secretaría General. Antes de restaurar se desactiva la cuenta adm-reg y se cambian las contraseñas de administración, porque los atacantes entraron con ella y sigue activa. Se restaura la copia del domingo de Valdecierzo en los dos servidores nuevos, después de comprobarla. Con disponibilidad MEDIO, el anexo II exige al registro el análisis de impacto (op.cont.1) y las copias con pruebas de recuperación (mp.info.6 con R1); la copia en otro lugar es un refuerzo que el Consorcio ya tenía sin estar obligado.',
      tasks: [
        {
          id: 'f4t1',
          kind: 'multi',
          topic: 'op6m4',
          prompt: 'Marca **todas** las medidas correctas para las primeras horas.',
          options: [
            { id: 'a', text: 'Aislar de la red REG-APP y REG-DOC sin borrar nada, para frenar el ataque y conservar las pruebas' },
            { id: 'b', text: 'Guardar los registros del cortafuegos y de los servidores como evidencias, con su cadena de custodia' },
            { id: 'c', text: 'Informar a la Gerencia y a la Secretaría General, responsables de la información y del servicio' },
            { id: 'd', text: 'Formatear REG-APP y REG-DOC y reinstalarlos ya, para volver antes al servicio' },
            { id: 'e', text: 'Esperar al informe forense completo antes de comunicar nada fuera del Consorcio' },
          ],
          answer: ['a', 'b', 'c'],
          points: 6,
          explain:
            'La medida op.exp.7 del anexo II, en su refuerzo R2 (detección y respuesta), pide aislar, conservar evidencias e informar a los responsables de la información y de los servicios; la ITS de Notificación dedica su apartado V a las evidencias y la cadena de custodia, y op.exp.9 pide guardar evidencias con valor jurisdiccional. Formatear tienta porque acorta la caída, pero destruye las pruebas y no explica por dónde entraron. Esperar al informe forense choca con los plazos ya decididos: el CCN-CERT, en el momento; la AEPD, sin dilación indebida y, si es posible, en 72 horas desde la constancia.',
          refs: [L4, L3, RD311_A2, ITS_NOT],
        },
        {
          id: 'f4t2',
          kind: 'cite',
          topic: 'op6m4',
          prompt: 'Señala los documentos que, juntos, prueban que antes de restaurar hay que cerrar el acceso que usaron los atacantes.',
          answerSets: [['d-cortafuegos', 'd-copias']],
          points: 5,
          explain:
            'El registro del cortafuegos muestra que todo empezó con una sesión de administración de la cuenta adm-reg desde una dirección externa, y el informe de copias dice que esa cuenta sigue activa y con la misma contraseña. Con uno solo no basta: el cortafuegos dice por dónde entraron, pero no que la puerta siga abierta. La ficha del sistema tienta, pero no habla de cuentas.',
          refs: [L4],
        },
        {
          id: 'f4t3',
          kind: 'choice',
          topic: 'op6m4',
          prompt: '¿Qué copia restauras y cómo?',
          options: [
            { id: 'a', text: 'La copia diaria del CPD, porque es la más reciente' },
            { id: 'b', text: 'La copia del domingo de Valdecierzo, en los dos servidores nuevos, después de cerrar el acceso de los atacantes y comprobar la copia antes de abrir el servicio' },
            { id: 'c', text: 'La copia del domingo de Valdecierzo, sobre REG-APP y REG-DOC tal como están, para ganar tiempo' },
            { id: 'd', text: 'Ninguna: se pide a las personas que vuelvan a presentar sus escritos' },
          ],
          answer: 'b',
          points: 5,
          explain:
            'La copia del CPD está cifrada desde las 05:03: estaba en línea y se administraba con las mismas cuentas. La de Valdecierzo se salvó porque está en otro lugar y desconectada, que es justo el refuerzo R2 de mp.info.6 («en lugar diferente»), y el R1 (pruebas de recuperación) da confianza en que se puede restaurar. Restaurar sobre los servidores atacados tienta porque es más rápido, pero borra las evidencias y deja el sistema en manos de quien lo atacó; con la cuenta adm-reg activa, volverían a entrar. Pedir que se vuelva a presentar todo cuando hay una copia buena castiga a la ciudadanía sin motivo.',
          refs: [L3, L4, RD311_A2],
        },
        {
          id: 'f4t4',
          kind: 'multi',
          topic: 'op6m3',
          prompt: 'El comité pregunta por qué el registro no tenía un plan de continuidad con medios alternativos. Con la ficha del sistema (categoría MEDIA, disponibilidad MEDIO), marca **todo** lo que el anexo II le exige.',
          options: [
            { id: 'a', text: 'op.cont.1, Análisis de impacto' },
            { id: 'b', text: 'op.cont.2, Plan de continuidad' },
            { id: 'c', text: 'op.cont.4, Medios alternativos' },
            { id: 'd', text: 'mp.info.6, Copias de seguridad, con el refuerzo R1 (pruebas de recuperación)' },
            { id: 'e', text: 'mp.info.6 con el refuerzo R2: al menos una copia en un lugar diferente' },
            { id: 'f', text: 'op.exp.7, Gestión de incidentes, con los refuerzos R1 (notificación) y R2 (detección y respuesta)' },
          ],
          answer: ['a', 'd', 'f'],
          points: 6,
          explain:
            'Las medidas op.cont se exigen por la dimensión de disponibilidad: el análisis de impacto (op.cont.1) desde el nivel MEDIO; el plan de continuidad, las pruebas periódicas y los medios alternativos (op.cont.2 a 4), solo con disponibilidad ALTO. mp.info.6 también va por disponibilidad: en MEDIO se aplica con R1, y el R2 de la copia en otro lugar es del nivel ALTO; el Consorcio lo tenía como medida adicional y esa copia es la que ha salvado el registro. op.exp.7 se exige por categoría, y en MEDIA lleva R1 y R2. Tienta pensar que todo sistema público necesita plan de continuidad, pero el anexo II lo liga a la disponibilidad ALTO.',
          refs: [L3, RD311_A2],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'f5',
      title: 'Cierre y comunicación a los afectados',
      context:
        'Son las 18:00. En el expediente tienes el informe de cierre del día. Queda revisar la valoración con lo que ya se sabe y escribir a las personas cuyos datos se llevaron.',
      tasks: [
        {
          id: 'f5t1',
          kind: 'choice',
          topic: 'op6m4',
          prompt: 'Con el informe de cierre, ¿cómo queda el criterio de interrupción del servicio en las tablas del anexo del RD 43/2021?',
          options: [
            { id: 'a', text: 'Sigue en ALTO: el registro ha estado parado 6 horas y 35 minutos, desde el aviso de las 07:55' },
            { id: 'b', text: 'Sube a MUY ALTO: no atendió a nadie desde las 05:10 hasta las 14:30, más de 8 horas y con todos los usuarios afectados; la obligación de avisar al CCN-CERT ya existía desde el nivel ALTO' },
            { id: 'c', text: 'Sube a MUY ALTO, y por eso el Consorcio tiene que enviar una notificación intermedia a las 72 horas y una final a los 40 días' },
            { id: 'd', text: 'Sube a CRÍTICO, porque ha afectado a más del 50 % de los usuarios' },
          ],
          answer: 'b',
          points: 4,
          explain:
            'El registro electrónico atiende a todas horas, así que la interrupción empieza cuando deja de responder: de 05:10 a 14:30 van 9 horas y 20 minutos, con el 100 % de los usuarios sin servicio. Eso es «superior a 8 horas y superior al 35 %», nivel MUY ALTO. Contar desde la llamada del personal da 6 horas y 35 minutos y lo deja en ALTO: es la trampa. Los plazos de 72 horas y 40 días son de la tabla del RD 43/2021 para OSE y PSD, no del Consorcio. CRÍTICO exige además más de 24 horas.',
          refs: [L4, RD43, ITS_NOT],
        },
        {
          id: 'f5t2',
          kind: 'choice',
          topic: 'op6m5',
          prompt: 'En el comité, alguien propone no escribir a las personas afectadas. ¿Qué respuesta es correcta?',
          options: [
            { id: 'a', text: 'No hace falta: los datos están cifrados, y el RGPD exime de comunicar cuando los datos están cifrados' },
            { id: 'b', text: 'No hace falta: ya se ha notificado a la AEPD y esa notificación sustituye a la comunicación' },
            { id: 'c', text: 'Hay que comunicarlo sin dilación indebida: es probable un alto riesgo, y la exención por cifrado no sirve, porque los anexos se guardaban sin cifrar y los atacantes se los llevaron así' },
            { id: 'd', text: 'Hay que comunicarlo, pero cuando termine la investigación forense y se sepa con certeza si se han publicado' },
          ],
          answer: 'c',
          points: 4,
          explain:
            'El art. 34 del RGPD obliga a comunicar la violación a las personas sin dilación indebida cuando es probable un alto riesgo para ellas: aquí hay DNI, domicilios, teléfonos y, para unas 900, informes de discapacidad, con la amenaza de publicarlos. La exención del art. 34.3 por cifrado se refiere a datos protegidos frente a quien accede sin permiso; el cifrado de los atacantes no protege nada, y la copia salió de REG-DOC, donde los anexos estaban sin cifrar. Notificar a la AEPD no sustituye a la comunicación: son dos obligaciones. Esperar a la certeza tienta por prudencia, pero choca con el «sin dilación indebida».',
          refs: [L5, RGPD_34],
        },
        {
          id: 'f5t3',
          kind: 'written',
          topic: 'op6m5',
          prompt: 'Redacta la comunicación a las personas afectadas en **150 a 200 palabras**, para enviarla por correo electrónico con la firma de la Gerencia. Después, compárala con el modelo y marca los criterios de la guía de comunicación del Consorcio que cumple.',
          words: 200,
          model:
            'Le escribimos porque sus datos figuran en el registro electrónico de entrada del Consorcio Provincial de Arcedo. En la madrugada del lunes, unos atacantes entraron en los servidores del registro, bloquearon sus archivos y se llevaron una copia de los datos de los últimos dos años: nombre, DNI, domicilio, correo electrónico, teléfono y los documentos que adjuntó a sus escritos. Si pidió una ayuda para adaptar su vivienda, la copia incluye el informe de grado de discapacidad que aportó.\n\n' +
            'Hemos cerrado el acceso que usaron, el registro vuelve a funcionar desde una copia de seguridad y lo hemos comunicado al CCN-CERT y a la Agencia Española de Protección de Datos. Por ahora no nos consta que los datos se hayan publicado.\n\n' +
            'Le recomendamos desconfiar de correos, mensajes o llamadas que mencionen sus trámites con el Consorcio o le pidan datos o pagos: nunca le pediremos contraseñas ni datos bancarios por esas vías. Si detecta que alguien usa su DNI, denúncielo.\n\n' +
            'Para cualquier duda, escriba a nuestro delegado de protección de datos: [dirección de contacto del DPD].',
          rubric: [
            { id: 'r1', text: 'Cuenta qué ha pasado y cuándo, en lenguaje claro y sin tecnicismos: que entraron, bloquearon los archivos y se llevaron una copia', points: 4 },
            { id: 'r2', text: 'Dice qué datos de la persona se han visto afectados, y menciona expresamente los informes de discapacidad para quien los aportó', points: 4 },
            { id: 'r3', text: 'Explica qué ha hecho el Consorcio (cerrar el acceso, restablecer el servicio, avisar al CCN-CERT y a la AEPD) sin minimizar lo ocurrido ni prometer lo que no sabe', points: 4 },
            { id: 'r4', text: 'Da consejos concretos para protegerse: desconfiar de mensajes que citen sus trámites, recordar que el Consorcio no pide contraseñas ni datos bancarios y qué hacer si alguien usa su DNI', points: 4 },
            { id: 'r5', text: 'Ofrece el contacto del delegado de protección de datos, tiene entre 150 y 200 palabras y usa un tono directo y respetuoso', points: 4 },
          ],
          points: 20,
          explain:
            'La comunicación del art. 34 del RGPD es para la persona, no para la autoridad: tiene que entender qué le ha pasado a ella, qué riesgo corre y qué puede hacer. Tienta copiar la notificación a la AEPD, con horas, servidores y gigas, o irse al otro extremo y hablar de una «incidencia técnica» sin importancia. Los criterios de la rúbrica son los de la guía de comunicación del Consorcio, no una lista literal de la norma.',
          refs: [L5, RGPD_34, RGPD_39],
        },
      ],
    },
  ],
  sources: [L1, L3, L4, L5, RD311, ITS_NOT, RD43, RGPD, LOPDGDD],
};

export default op6s2;
