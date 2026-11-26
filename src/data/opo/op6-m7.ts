import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// OP6M7 — Firma e identificación electrónicas
// Fuentes: Reglamento (UE) 910/2014 consolidado (18-10-2024, con el 2024/1183),
// Reglamento de Ejecución (UE) 2026/248, Ley 6/2020, Leyes 39/2015 y 40/2015,
// RD 203/2021 y Orden PRE/1838/2014 (Cl@ve). Dossier op6, §7–§12 y §14.
// ---------------------------------------------------------------------------
export const OP6_M7: Module = {
  id: 'op6m7',
  sectionId: 'op6',
  title: 'Firma e identificación electrónicas',
  minutes: 22,
  objectives: [
    'Distinguir firma electrónica, avanzada y cualificada, y el sello electrónico y el sello de tiempo, con el efecto jurídico que el Reglamento eIDAS da a cada uno',
    'Explicar qué son los prestadores y servicios cualificados, cómo se supervisan y para qué sirven las listas de confianza y la cartera europea de identidad digital',
    'Situar los formatos de firma (CAdES, XAdES, PAdES, ASiC y JAdES) y la política de firma en el calendario del Reglamento de Ejecución (UE) 2026/248',
    'Aplicar la Ley 6/2020 y la Ley 39/2015 a la identificación y la firma de los interesados, incluida la diferencia entre identificarse y firmar',
    'Relacionar la sede electrónica, el sello electrónico de órgano y el código seguro de verificación con los artículos 38 a 42 de la Ley 40/2015 y el RD 203/2021',
  ],
  blocks: [
    {
      t: 'p',
      md: 'Cada vez que alguien presenta un escrito en el registro electrónico del Consorcio Provincial de Arcedo, o que la sede electrónica emite un justificante sin que lo toque nadie, entran en juego dos preguntas distintas: **quién es** el que actúa (identificación) y **si queda vinculado** a lo que envía o emite (firma). Las responde una cadena de normas que conviene ordenar desde arriba: el **Reglamento (UE) 910/2014**, conocido como **eIDAS** (identificación electrónica y servicios de confianza), fija los tipos de firma y sello y sus efectos en toda la Unión; la **Ley 6/2020** lo completa en España; la **Ley 39/2015** regula cómo se identifican y firman los interesados ante la administración; la **Ley 40/2015**, cómo se identifica y firma la propia administración; y el **RD 203/2021** desarrolla ambas leyes. En el Consorcio, la sede electrónica y el registro electrónico son servicios cuyo responsable es la **Secretaría General**.',
    },
    { t: 'h', text: 'El Reglamento eIDAS tras la reforma de 2024' },
    {
      t: 'p',
      md: 'El texto que hay que manejar es el **consolidado de 18-10-2024**. Lo han modificado dos normas: la **Directiva (UE) 2022/2555**, conocida como **NIS2** (seguridad de las redes y sistemas de información), que suprimió el artículo 19 (requisitos de seguridad de los prestadores), y el **Reglamento (UE) 2024/1183**, de 11 de abril de 2024, que añadió la **cartera europea de identidad digital** y nuevos servicios de confianza (declaración electrónica de atributos, archivo electrónico, libros mayores electrónicos). Estudiar el eIDAS de 2014 sin esta reforma es estudiar un texto que ya no está vigente así. El nuevo **artículo 5 bis** obliga a cada Estado miembro a proporcionar **«al menos una»** cartera, con nivel de seguridad **«alto»**; para las personas físicas, su expedición, uso y revocación son **«gratuitos»** y la cartera permite por defecto la **firma cualificada gratuita** (el Estado puede limitarla a fines no profesionales). El plazo se cuenta en «veinticuatro meses» desde ciertos actos de ejecución, así que no hay que memorizar una fecha concreta. Los sistemas de identificación electrónica se clasifican en tres niveles de seguridad (artículo 8): **bajo, sustancial y alto**.',
    },
    {
      t: 'table',
      headers: ['Figura (art. 3)', 'Quién la usa', 'Qué exige', 'Efecto jurídico'],
      rows: [
        ['**Firma electrónica** (3.10)', 'Persona física', 'Es la definición base del Reglamento (art. 3.10)', 'No se le niegan efectos ni valor de prueba por ser electrónica o no cualificada (art. 25)'],
        ['**Firma electrónica avanzada** (3.11)', 'Persona física', 'Los cuatro requisitos del art. 26', 'Tampoco se le niegan efectos por no ser cualificada (art. 25)'],
        ['**Firma electrónica cualificada** (3.12)', 'Persona física', 'Avanzada + **dispositivo cualificado de creación** + **certificado cualificado**', '**Efecto jurídico equivalente al de una firma manuscrita** (art. 25.2)'],
        ['**Sello electrónico** (3.25–3.27): simple, avanzado o cualificado', '**Persona jurídica**', 'Garantiza el **origen y la integridad** de los datos; el avanzado cumple el art. 36', 'El cualificado: **presunción de integridad** de los datos y de **corrección del origen** (art. 35)'],
        ['**Sello de tiempo electrónico** (3.33–3.34)', 'Lo emite un prestador', 'El cualificado vincula fecha y hora a los datos con una fuente ligada al **Tiempo Universal Coordinado** (art. 42)', 'El cualificado: **presunción de exactitud de la fecha y hora** y de integridad (art. 41.2)'],
      ],
    },
    {
      t: 'p',
      md: 'Los cuatro requisitos de la **firma avanzada** (artículo 26) se recuerdan bien en orden: a) está **vinculada al firmante de manera única**; b) **permite identificarlo**; c) se crea con datos que el firmante puede usar **«con un alto nivel de confianza, bajo su control exclusivo»**; y d) permite **detectar cualquier modificación ulterior** de los datos firmados. La **cualificada** no añade requisitos a la firma en sí, sino a sus medios: un **certificado cualificado** de firma (artículo 28 y anexo I) y un **dispositivo cualificado de creación de firma** (artículos 29 a 31 y anexo II). Ojo con el lenguaje: el Reglamento no conoce la expresión «firma simple»; la definición base es «firma electrónica» y llamarla simple es un uso doctrinal, no un término legal.',
    },
    {
      t: 'check',
      q: {
        q: 'Una firma electrónica cumple los cuatro requisitos del artículo 26 del Reglamento eIDAS. ¿Qué le falta para ser cualificada?',
        choices: [
          'Un sello cualificado de tiempo que fije la hora de la firma',
          'Haberse creado con un dispositivo cualificado de creación de firma y basarse en un certificado cualificado',
          'Que el firmante sea una persona jurídica',
          'Nada: toda firma avanzada es cualificada',
        ],
        answer: 1,
        explain:
          'La cualificada es una avanzada creada con un dispositivo cualificado de creación y basada en un certificado cualificado (art. 3.12). El sello de tiempo es un servicio aparte que no convierte la firma en cualificada, y la persona jurídica no firma: sella.',
      },
    },
    { t: 'h', text: 'Prestadores cualificados, supervisión y listas de confianza' },
    {
      t: 'p',
      md: 'Un **prestador de servicios de confianza** (artículo 3.19) presta uno o varios de los servicios que enumera el artículo 3.16 (letras a) a n)), como los certificados, los sellos de tiempo o la entrega electrónica certificada. Si el organismo de supervisión le concede la cualificación, pasa a ser **prestador cualificado** y sus servicios, **servicios cualificados**. Esa cualificación no es para siempre: el **artículo 20** obliga a auditar al prestador cualificado **«al menos cada veinticuatro meses»** por un **organismo de evaluación de la conformidad**, y el prestador debe avisar al **organismo de supervisión** **«al menos un mes antes»** de cualquier auditoría prevista. Quien quiera saber si un prestador es cualificado lo consulta en las **listas de confianza** (artículo 22): cada Estado miembro las establece, las mantiene y las publica, **firmadas o selladas** y en un formato apto para el **tratamiento automático**. En España la mantiene el Ministerio con competencias en la materia (artículo 16 de la Ley 6/2020), que es también el órgano de supervisión (artículo 14). Los servicios cualificados pueden usar la **etiqueta de confianza «UE»** (artículo 23). Y los navegadores deben reconocer los **certificados cualificados de autenticación de sitios web** (artículo 45).',
    },
    {
      t: 'check',
      q: {
        q: 'La Unidad de Seguridad de la Información del Consorcio quiere comprobar, antes de aceptar certificados de un prestador, si ese prestador está cualificado. ¿Dónde debe mirar según el Reglamento eIDAS?',
        choices: [
          'En la sede electrónica del propio prestador, que publica su declaración de cualificación',
          'En la relación de sellos electrónicos que publica cada administración',
          'En la lista de confianza que cada Estado miembro establece, mantiene y publica',
          'En el registro de funcionarios habilitados del artículo 12 de la Ley 39/2015',
        ],
        answer: 2,
        explain:
          'El artículo 22 del eIDAS encarga a cada Estado miembro establecer, mantener y publicar las listas de confianza, firmadas o selladas y aptas para tratamiento automático. La relación de sellos (art. 40 de la Ley 40/2015) identifica a las administraciones, no a los prestadores, y el registro de funcionarios habilitados sirve para que un funcionario identifique o firme por un interesado.',
      },
    },
    { t: 'h', text: 'Formatos de firma y política de firma' },
    {
      t: 'p',
      md: 'Una firma avanzada puede empaquetarse de varias maneras, y una administración no puede comprobar firmas en cualquier formato. Por eso los artículos 27 y 37 del eIDAS remiten a unos **formatos de referencia** que los organismos del sector público **deben reconocer**. Hasta hace poco los fijaba la Decisión de Ejecución (UE) 2015/1506; hoy está **derogada** por el **Reglamento de Ejecución (UE) 2026/248**, publicado el 3-2-2026 y **en vigor desde el 23-2-2026**. Su calendario tiene dos fechas que no hay que confundir. El **anexo I**, con los perfiles de base en normas EN del ETSI (Instituto Europeo de Normas de Telecomunicaciones) y el nuevo **JAdES**, solo **se aplica a partir del 23-2-2027**. Y los formatos anteriores del **anexo II** se siguen reconociendo **para las firmas creadas antes del 23-2-2028**: no dejan de valer el día que empieza a aplicarse el anexo I. Lo que la norma dice de cada formato es solo su nombre y su especificación técnica. La correspondencia con el tipo de documento que se suele dar (XAdES para documentos XML, el lenguaje de marcado extensible; CAdES para la sintaxis de mensajes criptográficos, CMS; PAdES para PDF, el formato de documento portátil) viene del orden en que la derogada Decisión 2015/1506 enumeraba la «firma electrónica avanzada XML, CMS o PDF» y sus perfiles; sirve para orientarse, pero no es texto del Reglamento de Ejecución vigente.',
    },
    {
      t: 'table',
      headers: ['Formato', 'Qué es según el Reglamento de Ejecución (UE) 2026/248', 'Cuándo se reconoce'],
      rows: [
        ['**XAdES**', 'Perfil de base ETSI EN 319 132-1 (anexo I); antes, ETSI TS 103 171 (anexo II)', 'Anexo I desde el 23-2-2027; la versión del anexo II, para firmas creadas antes del 23-2-2028'],
        ['**CAdES**', 'Perfil de base ETSI EN 319 122-1 (anexo I); antes, ETSI TS 103 173 (anexo II)', 'Ídem'],
        ['**PAdES**', 'Perfil de base ETSI EN 319 142-1 (anexo I); antes, ETSI TS 103 172 (anexo II)', 'Ídem'],
        ['**JAdES**', 'Perfil ETSI TS 119 182-1; **solo está en el anexo I**, es la novedad respecto de la Decisión 2015/1506', 'Desde el 23-2-2027'],
        ['**ASiC**', 'Contenedor de firmas o sellos asociados (ETSI EN 319 162-1 y -2, con la mención «ASiC-E» en el anexo I); antes, contenedor ETSI TS 103 174', 'Igual que los perfiles de su anexo'],
      ],
    },
    {
      t: 'p',
      md: 'Los formatos del anexo II se reconocen en los **niveles de conformidad B, T o LT**. La **política de firma** es otra cosa: no es un formato, sino el conjunto de «directrices y normas técnicas aplicables a la utilización de certificados y firma electrónica» (artículo 17.1 del RD 203/2021). El **artículo 17 del RD 203/2021** regula, para el **ámbito estatal**, la **política de firma electrónica y de certificados**, con un contenido mínimo y aprobada por resolución de la Secretaría de Estado de Digitalización e Inteligencia Artificial. Un consorcio provincial no está en ese ámbito estatal; lo que sí debe hacer su sede, como cualquier sede, es informar de los sistemas de identificación y firma que admite (artículo 11 del RD 203/2021).',
    },
    {
      t: 'check',
      q: {
        q: 'El Servicio de Informática y Comunicaciones del Consorcio revisa en 2027 una firma XAdES con perfil del anexo II, creada en marzo de 2026. ¿Qué dice el Reglamento de Ejecución (UE) 2026/248?',
        choices: [
          'Ya no se reconoce, porque el anexo I se aplica desde el 23-2-2027',
          'Se sigue reconociendo, porque los formatos del anexo II valen para firmas creadas antes del 23-2-2028',
          'Solo se reconoce si se convierte a JAdES',
          'Se rige por la Decisión 2015/1506, que sigue vigente para las firmas anteriores a 2027',
        ],
        answer: 1,
        explain:
          'El anexo II no caduca el día que empieza a aplicarse el anexo I: sus formatos se reconocen para firmas creadas antes del 23-2-2028. La Decisión 2015/1506 está derogada desde la entrada en vigor del 2026/248, y JAdES es un formato más del anexo I, no un requisito de conversión.',
      },
    },
    { t: 'h', text: 'Ley 6/2020: los servicios de confianza en España' },
    {
      t: 'p',
      md: 'La **Ley 6/2020**, de servicios electrónicos de confianza, entró en vigor el 13-11-2020 y **derogó la Ley 59/2003, de firma electrónica**. No repite el eIDAS: lo **completa** (artículo 1). Lo que más se pregunta es su **artículo 4**: la vigencia de los certificados cualificados **«no será superior a cinco años»**. El artículo 5 regula su revocación y suspensión; el artículo 6, la identidad del titular (documento nacional de identidad, DNI; número de identidad de extranjero, NIE; o número de identificación fiscal, NIF; para personas jurídicas, denominación y NIF); y el artículo 7, la comprobación de esa identidad, que exige **personación** (o firma legitimada notarialmente), salvo identificación a distancia regulada por orden ministerial o relación previa con identificación hace **«menor de cinco años»**. Dos disposiciones adicionales enlazan con la administración: la **2.ª** da **«plenos efectos jurídicos»** a los sistemas de identificación, firma y sello de las Leyes 39/2015 y 40/2015, y la **3.ª** dice que el **DNI electrónico** acredita la identidad y permite firmar, y que su expedidor cumple las obligaciones de un prestador cualificado.',
    },
    { t: 'h', text: 'Los interesados: identificarse no es firmar (Ley 39/2015)' },
    {
      t: 'p',
      md: 'La Ley 39/2015, del Procedimiento Administrativo Común de las Administraciones Públicas, separa dos cosas. El **artículo 9** enumera los sistemas de **identificación** admitidos: a) certificados cualificados de **firma** y b) certificados cualificados de **sello**, ambos de prestadores incluidos en la lista de confianza, y c) **otros sistemas** con registro previo como usuario, como las claves concertadas. El **artículo 10** hace lo mismo para la **firma**: firma cualificada y avanzada basadas en certificados cualificados, sello cualificado y avanzado basados en certificados cualificados, y otros sistemas con el mismo régimen. Siempre debe poder usarse un sistema de las letras a) o b). Y el **artículo 11** pone la regla de uso: **basta con identificarse**, y la firma solo es obligatoria para **formular solicitudes, presentar declaraciones responsables o comunicaciones, interponer recursos, desistir de acciones y renunciar a derechos**. Si el interesado no tiene medios, un **funcionario habilitado** puede identificarlo o firmar por él con su consentimiento expreso (artículo 12).',
    },
    {
      t: 'callout',
      kind: 'warn',
      title: 'Una discrepancia entre la ley y el reglamento: «previa comunicación» o «previa autorización»',
      md: 'Para los sistemas de la letra c), la **Ley 39/2015** (artículos 9.2.c y 10.2.c, en la redacción de la Ley 11/2022) exige **«previa comunicación»** a la Secretaría General de Administración Digital (SGAD) y una declaración responsable; el sistema es eficaz cuando pasan **«dos meses»** desde la comunicación. Durante esos dos meses, el órgano estatal puede acudir a la vía judicial, «previo informe vinculante» de la Secretaría de Estado de Seguridad, «que deberá emitir en el plazo de diez días desde su solicitud». Los recursos técnicos de esos sistemas deben estar en la Unión Europea (y en España si se tratan categorías especiales de datos). El **RD 203/2021** (artículos 26.2.c y 28.2), en cambio, habla de **«previa autorización»** de la SGAD. La diferencia se explica por las fechas: el real decreto es de 2021 y la ley se reformó en 2022. **Manda la ley**, que tiene rango superior y es posterior: estudia el régimen de comunicación previa con eficacia a los dos meses.',
    },
    {
      t: 'p',
      md: 'Un ejemplo de sistema de la letra c) es **Cl@ve**, el «sistema de identificación, autenticación y firma electrónica común para todo el Sector Público Administrativo Estatal», aprobado en 2014 y basado en **claves concertadas** con registro previo como usuario. Se cita como ejemplo de clave concertada de la Administración General del Estado (AGE), no por su base legal de 2014, que remite a normas ya derogadas.',
    },
    {
      t: 'check',
      q: {
        q: 'Un ciudadano consulta en la sede electrónica del Consorcio el estado de su expediente y, después, quiere desistir de su solicitud. Según el artículo 11 de la Ley 39/2015, ¿qué necesita en cada caso?',
        choices: [
          'Firma en los dos casos, porque toda actuación en la sede exige firma',
          'Identificarse para consultar y firmar para desistir',
          'Identificarse en los dos casos, porque desistir no está entre los actos que exigen firma',
          'Un certificado cualificado de sello para desistir',
        ],
        answer: 1,
        explain:
          'La regla general del artículo 11 es que basta con identificarse; la firma solo se exige para solicitudes, declaraciones responsables o comunicaciones, recursos, desistimientos y renuncias. Desistir sí está en esa lista. El certificado de sello es para personas jurídicas, no para un ciudadano.',
      },
    },
    { t: 'h', text: 'La administración: sede, sello de órgano y CSV (Ley 40/2015 y RD 203/2021)' },
    {
      t: 'p',
      md: 'La Ley 40/2015, de Régimen Jurídico del Sector Público, regula el otro lado. La **sede electrónica** (artículo 38) es una dirección electrónica cuya titularidad corresponde a una administración u organismo, que responde de la integridad, veracidad y actualización de lo que publica; según el **artículo 38.6**, se identifica con **«certificados reconocidos o cualificados de autenticación de sitio web o medio equivalente»**. La administración se identifica con un **sello electrónico** basado en certificado reconocido o cualificado, con su NIF y denominación, y publica la relación de sus sellos (artículo 40). En la **actuación administrativa automatizada** (artículo 41), la que se produce sin intervención directa de un empleado público, el **artículo 42** permite firmar con a) un **sello electrónico** de administración, órgano u organismo, lo que se suele llamar **sello de órgano** aunque la ley no use esa expresión, o b) un **código seguro de verificación (CSV)**, que permite comprobar la integridad del documento en la sede. Cuando firma una persona, el titular del órgano o un empleado público, se aplica el artículo 43.',
    },
    {
      t: 'p',
      md: 'El **RD 203/2021** desarrolla todo esto. Su **artículo 11** fija el contenido y los servicios mínimos de la sede, entre ellos los sistemas de identificación y firma admitidos, la fecha y hora oficial, la verificación de los certificados de la sede y de los sellos electrónicos y la **comprobación de documentos con CSV**. Su **artículo 21** regula el CSV: vincula el documento al órgano y, en su caso, al firmante; la verificación en la sede es **directa y gratuita**; garantiza origen e integridad con un código único por documento; y, en el ámbito estatal, el documento debe poder verificarse en la sede durante **«al menos cinco años»** (21.4.e). El artículo 22 añade que los certificados de empleado público serán cualificados. El CSV también explica cómo una copia en papel de un documento electrónico sigue siendo comprobable: la Ley 39/2015 (artículo 27.3.c) prevé que lleve un código generado electrónicamente u otro sistema de verificación.',
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'En el Consorcio de Arcedo: el justificante que nadie firma a mano',
      md: 'La sede electrónica del Consorcio emite de madrugada, sin intervención de nadie, los justificantes de presentación del registro electrónico. Es actuación automatizada (artículo 41 de la Ley 40/2015), así que el Consorcio puede firmarlos con uno de los sistemas del artículo 42: el **sello electrónico** del Consorcio o un **CSV** comprobable en la sede. Si opta por el CSV, la sede debe ofrecer la comprobación de documentos con ese código entre sus servicios. La propia sede, por su parte, se identifica ante los ciudadanos con un certificado de autenticación de sitio web (artículo 38.6), no con el sello.',
    },
    {
      t: 'check',
      q: {
        q: 'El ayuntamiento de una comarca recibe en papel una resolución del Consorcio emitida con CSV. ¿Cómo comprueba que no se ha alterado?',
        choices: [
          'Introduciendo el código en la sede electrónica del Consorcio, que permite comprobar la integridad del documento',
          'Pidiendo al Consorcio una copia firmada a mano por la Secretaría General',
          'Consultando la lista de confianza de prestadores cualificados',
          'Comprobando el sello cualificado de tiempo impreso al pie',
        ],
        answer: 0,
        explain:
          'El CSV del artículo 42.b de la Ley 40/2015 se comprueba en la sede del órgano que lo emitió, de forma directa y gratuita según el RD 203/2021. La lista de confianza sirve para saber si un prestador es cualificado, no para verificar un documento con CSV.',
      },
    },
    {
      t: 'table',
      headers: ['Artículo', 'Qué regula'],
      rows: [
        ['Art. 3 eIDAS', 'Definiciones: firma electrónica (10), avanzada (11), cualificada (12), sello (25–27), sello de tiempo (33–34), cartera europea de identidad digital (42)'],
        ['Art. 5 bis eIDAS', 'Cartera europea de identidad digital: al menos una por Estado, nivel alto, gratuita para personas físicas'],
        ['Art. 20 eIDAS', 'Supervisión de prestadores cualificados: auditoría al menos cada veinticuatro meses'],
        ['Art. 22 eIDAS', 'Listas de confianza: cada Estado las establece, mantiene y publica'],
        ['Art. 25 eIDAS', 'Efectos de la firma: la cualificada equivale a la manuscrita (25.2)'],
        ['Art. 26 eIDAS', 'Los cuatro requisitos de la firma avanzada'],
        ['Art. 35 y 41 eIDAS', 'Sello cualificado: integridad y origen; sello cualificado de tiempo: exactitud de fecha y hora (41.2)'],
        ['Anexos I y II del Reglamento de Ejecución (UE) 2026/248', 'Formatos que reconoce el sector público: anexo I desde el 23-2-2027; anexo II para firmas creadas antes del 23-2-2028'],
        ['Art. 4 Ley 6/2020', 'Vigencia de los certificados cualificados: no superior a cinco años'],
        ['Arts. 9, 10 y 11 Ley 39/2015', 'Identificación y firma de los interesados; cuándo es obligatorio firmar'],
        ['Art. 38.6 Ley 40/2015', 'La sede se identifica con certificados de autenticación de sitio web o medio equivalente'],
        ['Art. 42 Ley 40/2015', 'Firma en la actuación automatizada: sello electrónico de órgano o CSV'],
        ['Arts. 11, 17 y 21 RD 203/2021', 'Servicios mínimos de la sede, política de firma (estatal) y CSV (verificación al menos cinco años en el ámbito estatal)'],
      ],
    },
    {
      t: 'links',
      title: 'La criptografía y la PKI que hay debajo: ya están explicadas en la pista de Security+',
      items: [
        { label: 'Criptografía: simétrica, asimétrica, hashing y firmas (lección sp1m6)', href: '/learn/sp1m6' },
        { label: 'PKI, certificados y raíces de confianza (lección sp1m7)', href: '/learn/sp1m7' },
      ],
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Lo que se confunde a menudo',
      md: '**Firma o sello**: la firma es de una persona física; el sello, de una persona jurídica (o de un órgano, en la Ley 40/2015). **Efectos**: equivalencia con la manuscrita solo para la **firma cualificada** (art. 25.2); el **sello cualificado** presume integridad y origen (art. 35); el **sello cualificado de tiempo** presume la exactitud de la fecha y hora (art. 41.2). **Cifras parecidas**: auditoría de prestadores cualificados **cada veinticuatro meses** como mínimo (eIDAS art. 20); certificados cualificados **cinco años** como máximo (Ley 6/2020 art. 4); verificación del CSV **al menos cinco años** en el ámbito estatal (RD 203/2021 art. 21); otros sistemas de identificación eficaces a los **dos meses** de la comunicación (Ley 39/2015 art. 9). **Identificarse no es firmar**: basta identificarse salvo solicitudes, declaraciones responsables o comunicaciones, recursos, desistimientos y renuncias. **Formatos**: la Decisión 2015/1506 está derogada; JAdES solo aparece en el anexo I. Y «firma simple» no es un término del eIDAS.',
    },
  ],
  quiz: [
    {
      id: 'op6m7q1',
      domain: 'ENS y normativa',
      prompt:
        'Según el artículo 4 de la Ley 6/2020, ¿cuál es la vigencia máxima de un certificado cualificado?',
      choices: ['Dos años', 'Tres años', 'Cinco años', 'Diez años'],
      answer: 2,
      explain:
        'El artículo 4 dice que la vigencia de los certificados cualificados «no será superior a cinco años». Tienta confundirlo con los veinticuatro meses de la auditoría de los prestadores (eIDAS art. 20), que es un plazo de supervisión, no de vigencia de certificados.',
    },
    {
      id: 'op6m7q2',
      domain: 'ENS y normativa',
      prompt:
        'Según el artículo 25 del Reglamento eIDAS, ¿qué tiene un efecto jurídico equivalente al de una firma manuscrita?',
      choices: [
        'Cualquier firma electrónica avanzada',
        'La firma electrónica cualificada',
        'El sello electrónico cualificado',
        'Cualquier firma electrónica basada en un certificado cualificado',
      ],
      answer: 1,
      explain:
        'El artículo 25.2 reserva esa equivalencia a la firma cualificada, que además de ser avanzada exige certificado cualificado y dispositivo cualificado de creación; una firma basada solo en certificado cualificado no basta. El sello cualificado tiene otro efecto: presunción de integridad y de corrección del origen (art. 35).',
    },
    {
      id: 'op6m7q3',
      domain: 'ENS y normativa',
      prompt:
        'Según el artículo 20 del Reglamento eIDAS, ¿con qué frecuencia mínima debe auditarse a un prestador cualificado de servicios de confianza?',
      choices: [
        'Cada doce meses',
        'Cada treinta y seis meses',
        'Solo al iniciar el servicio cualificado',
        'Cada veinticuatro meses',
      ],
      answer: 3,
      explain:
        'El artículo 20 exige la auditoría «al menos cada veinticuatro meses» por un organismo de evaluación de la conformidad. Que deba avisarse al organismo de supervisión «al menos un mes antes» de la auditoría no convierte el plazo en anual, y la cualificación inicial (art. 21) no exime de las auditorías periódicas.',
    },
    {
      id: 'op6m7q4',
      domain: 'ENS y normativa',
      prompt:
        'La sede electrónica del Consorcio emite automáticamente, sin intervención de ningún empleado, los justificantes del registro electrónico. ¿Con qué puede firmarlos según la Ley 40/2015?',
      choices: [
        'Con un sello electrónico de órgano o con un código seguro de verificación',
        'Con la firma cualificada de la persona que ocupa la Secretaría General',
        'Con un sello cualificado de tiempo',
        'Con el certificado de autenticación de sitio web de la sede',
      ],
      answer: 0,
      explain:
        'En la actuación automatizada, el artículo 42 prevé el sello electrónico de administración, órgano u organismo o el CSV. La firma de una persona es del artículo 43 y no encaja en una emisión sin intervención humana; el certificado de sitio web identifica la sede (art. 38.6), no firma documentos.',
    },
    {
      id: 'op6m7q5',
      domain: 'ENS y normativa',
      prompt:
        'Según el artículo 38.6 de la Ley 40/2015, ¿cómo se identifica la sede electrónica del Consorcio ante quien la visita?',
      choices: [
        'Con el sello electrónico de órgano del Consorcio',
        'Con un código seguro de verificación publicado en su portada',
        'Con certificados reconocidos o cualificados de autenticación de sitio web o medio equivalente',
        'Con la firma cualificada de su responsable',
      ],
      answer: 2,
      explain:
        'El artículo 38.6 pide certificados reconocidos o cualificados de autenticación de sitio web o medio equivalente. El sello electrónico sirve para identificar a la administración y firmar en la actuación automatizada (arts. 40 y 42), no para identificar la dirección de la sede.',
    },
    {
      id: 'op6m7q6',
      domain: 'ENS y normativa',
      prompt:
        'Un vecino quiere interponer un recurso contra una resolución del Consorcio a través del registro electrónico. ¿Qué le exige la Ley 39/2015?',
      choices: [
        'Basta con que se identifique, porque esa es la regla general',
        'Que firme, porque interponer recursos es uno de los actos que exigen firma',
        'Que use un certificado cualificado de sello',
        'Que acuda en persona, porque los recursos no pueden presentarse por medios electrónicos',
      ],
      answer: 1,
      explain:
        'El artículo 11 fija que basta identificarse, salvo para formular solicitudes, presentar declaraciones responsables o comunicaciones, interponer recursos, desistir y renunciar: el recurso está en la lista, así que hace falta firma. El certificado de sello es para personas jurídicas.',
    },
    {
      id: 'op6m7q7',
      domain: 'ENS y normativa',
      prompt:
        'El Consorcio añade un sello cualificado de tiempo a las actas que publica. ¿Qué presunción le da el Reglamento eIDAS?',
      choices: [
        'Equivalencia con la firma manuscrita de quien levanta el acta',
        'Corrección del origen de los datos',
        'Exactitud de la fecha y la hora que indica y de la integridad de los datos a los que se vincula',
        'Identidad de la persona física que redactó el acta',
      ],
      answer: 2,
      explain:
        'El artículo 41.2 da al sello cualificado de tiempo la presunción de exactitud de la fecha y la hora y de integridad de los datos. La corrección del origen es la presunción del sello electrónico cualificado (art. 35), y la equivalencia con la manuscrita es solo de la firma cualificada (art. 25.2).',
    },
    {
      id: 'op6m7q8',
      domain: 'ENS y normativa',
      prompt:
        'Una entidad comunica a la Secretaría General de Administración Digital un sistema de clave concertada para identificar a los interesados. Según el artículo 9 de la Ley 39/2015, ¿cuándo tiene eficacia?',
      choices: [
        'Cuando pasan dos meses desde la comunicación',
        'Cuando pasan diez días desde la comunicación',
        'Cuando pasan seis meses desde la comunicación',
        'Desde el día siguiente a la comunicación',
      ],
      answer: 0,
      explain:
        'El artículo 9.2.c da eficacia al sistema a los «dos meses» desde la comunicación. Los diez días son el plazo del informe de la Secretaría de Estado de Seguridad, no el de eficacia, y los seis meses son los de la verificación previa de la Ley 6/2020 (art. 16), otra norma.',
    },
  ],
};
