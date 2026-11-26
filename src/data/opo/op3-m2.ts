import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// OP3M2 — DNS en la organización: espacios interno y externo, AD, DDNS, DNSSEC, DoT y DoH
// ---------------------------------------------------------------------------
export const OP3_M2: Module = {
  id: 'op3m2',
  sectionId: 'op3',
  title: 'DNS en la organización: interno y externo, Active Directory, DNSSEC y DNS cifrado',
  minutes: 22,
  objectives: [
    'Separar el DNS interno del externo en una organización y explicar qué es el DNS de horizonte dividido (split-horizon) y qué papel cumplen los reenviadores',
    'Interpretar los registros SRV con los que los equipos de un dominio de Active Directory localizan sus controladores de dominio',
    'Explicar la actualización dinámica (DDNS, RFC 2136) y cómo TSIG la autentica, incluido por qué depende de la hora',
    'Describir qué garantiza DNSSEC y qué no, y recorrer su cadena de confianza con DS, DNSKEY, RRSIG y NSEC',
    'Comparar DNS sobre TLS (DoT) y DNS sobre HTTPS (DoH) y valorar su efecto en la red de una organización',
    'Reconocer el envenenamiento de caché, la amplificación y los túneles DNS y saber dónde se estudian a fondo',
  ],
  blocks: [
    {
      t: 'p',
      md: 'En la lección anterior viste cómo funciona el DNS por dentro: registros, zonas y transferencias. Aquí se mira desde el lado de quien lo administra en una organización, y las preguntas cambian: **qué nombres se ven desde Internet y cuáles solo desde dentro**, a quién pregunta un servidor interno lo que no sabe, cómo encuentra un puesto de trabajo a su controlador de dominio, quién apunta en la zona el nombre de un portátil que acaba de recibir dirección por DHCP y qué se puede proteger con criptografía. El caso es otra vez el Consorcio Provincial de Arcedo, que tiene dos espacios de nombres: **`arcedo.example`**, el público, y **`ad.arcedo.example`**, el de su dominio de Active Directory.',
    },
    { t: 'h', text: 'DNS interno y DNS externo' },
    {
      t: 'p',
      md: 'Una organización suele tener **dos servicios DNS con públicos distintos**. El **externo** publica lo que el mundo tiene que encontrar: la web, el correo, la sede electrónica. El **interno** resuelve los nombres de los equipos y servicios de la casa y, además, hace de **resolutor** para los puestos: recibe todas sus consultas, también las de nombres de Internet. Mezclar los dos papeles en el mismo servidor tiene dos riesgos claros: enseñar fuera nombres y direcciones internas, y abrir a cualquiera un resolutor que solo debería atender a la plantilla. La RFC 9499 llama **resolutor abierto** (*open resolver*) al que acepta consultas de casi cualquier cliente, y advierte de que la mayoría probablemente están mal configurados; la RFC 1034 (§4.3.1) ya permitía que un servidor recursivo restrinja a qué clientes atiende.',
    },
    {
      t: 'p',
      md: 'El **DNS de horizonte dividido** (*split DNS* o *split-horizon DNS*) consiste en que **la misma pregunta reciba respuestas distintas según desde dónde se haga**. El caso clásico es un mismo nombre, por ejemplo el de la web, que desde Internet devuelve la dirección pública y desde la red interna, la privada del servidor. La RFC 9499 recoge los dos nombres, pero aclara que se usan **sin una definición formal**; las «vistas» (*views*) con las que se configura en algunos productos son cosa de cada producto, no de una norma. En el Consorcio el reparto es este: la zona **`arcedo.example`** es autoritativa en el **proveedor de DNS externo**, y la zona **`ad.arcedo.example`** vive solo en **DC1 (`10.20.72.11`) y DC2 (`10.20.72.12`)**, los controladores de dominio del centro de proceso de datos (CPD). El proveedor no publica nada de `ad.arcedo.example`, así que un nombre como `dc1.ad.arcedo.example` existe para quien pregunta desde dentro y no existe para quien pregunta desde Internet: el espacio de nombres se ve distinto a cada lado.',
    },
    {
      t: 'table',
      headers: ['', 'DNS externo', 'DNS interno'],
      rows: [
        ['Zona', '`arcedo.example`', '`ad.arcedo.example`'],
        ['Dónde está', 'Proveedor de DNS externo (autoritativo)', 'DC1 `10.20.72.11` y DC2 `10.20.72.12`, en el CPD'],
        ['Quién pregunta', 'Cualquiera en Internet', 'Solo los equipos del Consorcio, que los reciben por DHCP como servidores DNS'],
        ['Qué publica', 'Web, correo y servicios públicos', 'Controladores de dominio, servidores y puestos (con sus SRV, A y PTR)'],
        ['Recursión', 'No: solo responde de su zona', 'Sí, para la red interna; lo que no es suyo lo reenvía a los resolutores del operador'],
      ],
    },
    {
      t: 'p',
      md: 'Un **reenviador** (*forwarder*) es, en palabras de la RFC 2308 que recoge la RFC 9499, un servidor de nombres al que se mandan las consultas para que las resuelva **en lugar de recorrer directamente la cadena de servidores autoritativos**. El servidor que reenvía envía la consulta **con el bit RD = 1** (recursión deseada): no quiere una remisión, quiere la respuesta. En Arcedo, DC1 y DC2 responden ellos mismos lo que es de `ad.arcedo.example` y **reenvían a los resolutores del operador** todo lo demás, incluidos los nombres de `arcedo.example`, que acaban resolviendo los servidores del proveedor. Así los controladores de dominio no necesitan hablar con medio Internet: solo con dos resolutores conocidos, lo que simplifica las reglas del cortafuegos.',
    },
    {
      t: 'check',
      q: {
        q: 'Un técnico del Consorcio, desde su casa y sin red privada virtual (VPN), intenta resolver `dc1.ad.arcedo.example` con el resolutor de su operador y no obtiene respuesta válida. Desde la oficina funciona. ¿Cuál es la explicación?',
        choices: [
          'El TTL del registro ha caducado en la caché del resolutor de su casa',
          'La zona `ad.arcedo.example` solo existe en DC1 y DC2, y desde Internet nadie la publica',
          'El proveedor externo reenvía la consulta a DC1, pero la respuesta no está firmada con DNSSEC',
          'Los nombres de Active Directory solo se pueden resolver por TCP',
        ],
        answer: 1,
        explain:
          'Es el horizonte dividido funcionando como se diseñó: el nombre existe para quien pregunta a DC1 o DC2 desde dentro, y fuera no hay ningún servidor que publique esa zona. El proveedor externo no reenvía consultas a los controladores de dominio, y un TTL caducado solo obliga a volver a preguntar.',
      },
    },
    { t: 'h', text: 'El DNS de Active Directory y los registros SRV' },
    {
      t: 'p',
      md: 'Un puesto que se une al dominio `ad.arcedo.example` no lleva escrita la dirección de ningún controlador de dominio: **la busca en el DNS**. Para eso sirven los registros **SRV** (RFC 2782), que dicen qué equipo y qué puerto ofrecen un servicio con nombres de la forma `_servicio._protocolo.dominio`. Cada SRV lleva **prioridad** (el cliente prueba primero la **más baja**), **peso** (reparto entre los de igual prioridad), **puerto** y **destino**, que **no puede ser un alias**: tiene que ser un nombre con su propio registro A o AAAA. Lo que sigue es **comportamiento de Microsoft**, no de una RFC (Microsoft Learn, «Verify SRV DNS records have been created»): Active Directory crea sus SRV bajo el subdominio **`_msdcs`**, con nombres como `_ldap._tcp.dc._msdcs.<dominio>` y, por cada sitio, `_ldap._tcp.<sitio>._sites.dc._msdcs.<dominio>` (para que cada equipo prefiera los controladores de su sitio), para los servicios **`_ldap`** (LDAP, *Lightweight Directory Access Protocol*, el protocolo de acceso al directorio) y **`_kerberos`**. Si el DNS no es de Microsoft, los registros que hay que dar de alta están en el archivo `%systemroot%\\System32\\Config\\Netlogon.dns` de cada controlador.',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Registros SRV que localizan los controladores de dominio de ad.arcedo.example (ejemplo)',
      text: `; _servicio._protocolo.nombre                 clase SRV  prioridad peso puerto destino
_ldap._tcp.dc._msdcs.ad.arcedo.example.        IN    SRV  0         100  389    dc1.ad.arcedo.example.
_ldap._tcp.dc._msdcs.ad.arcedo.example.        IN    SRV  0         100  389    dc2.ad.arcedo.example.
_kerberos._tcp.dc._msdcs.ad.arcedo.example.    IN    SRV  0         100  88     dc1.ad.arcedo.example.
_kerberos._tcp.dc._msdcs.ad.arcedo.example.    IN    SRV  0         100  88     dc2.ad.arcedo.example.

dc1.ad.arcedo.example.                         IN    A    10.20.72.11
dc2.ad.arcedo.example.                         IN    A    10.20.72.12

; Misma prioridad y mismo peso: los clientes se reparten entre DC1 y DC2.
; 389 es LDAP y 88 es Kerberos; el destino es siempre un nombre con registro A, nunca un CNAME.`,
    },
    {
      t: 'table',
      headers: ['Nombre del SRV', 'Qué localiza', 'Puerto'],
      rows: [
        ['`_ldap._tcp.dc._msdcs.<dominio>`', 'Un controlador de dominio que sirve el directorio por LDAP (valor de Microsoft)', '389 (LDAP)'],
        ['`_kerberos._tcp.dc._msdcs.<dominio>`', 'Un controlador de dominio que hace de centro de distribución de claves (KDC) de Kerberos (valor de Microsoft)', '88 (Kerberos, RFC 4120)'],
        ['`_ldap._tcp.<sitio>._sites.dc._msdcs.<dominio>`', 'Los controladores de un sitio concreto, para no cruzar la WAN sin necesidad (valor de Microsoft)', '389'],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'Para dar de alta DC2 en el DNS, un técnico crea `dc2-alias.ad.arcedo.example` como CNAME de `dc2.ad.arcedo.example` y pone ese alias como destino de los SRV de DC2. ¿Qué está mal?',
        choices: [
          'Nada, un SRV puede apuntar a cualquier nombre que acabe resolviendo en una dirección',
          'El destino de un SRV no puede ser un alias: debe ser directamente `dc2.ad.arcedo.example`',
          'Los SRV solo admiten direcciones IP como destino, no nombres',
          'Un CNAME solo puede apuntar a nombres de otra zona',
        ],
        answer: 1,
        explain:
          'La RFC 2782 lo dice sin rodeos: el destino de un SRV no puede ser un alias, así que tiene que ser el nombre que tiene el registro A. La primera opción tienta porque «al final resuelve», pero la norma no lo permite. El destino de un SRV es un nombre, no una dirección IP.',
      },
    },
    { t: 'h', text: 'Actualización dinámica (DDNS) y TSIG' },
    {
      t: 'p',
      md: 'En una red con DHCP, mantener a mano los registros de cada puesto es imposible: las direcciones cambian. La **actualización dinámica**, DDNS (RFC 2136), permite **añadir o borrar registros en una zona con un mensaje DNS**, con el código de operación **UPDATE (5)**. El mensaje tiene cuatro secciones: **Zone** (la zona que se toca), **Prerequisite** (condiciones que deben cumplirse antes, por ejemplo que el nombre no exista), **Update** (los cambios) y **Additional Data**. Si un requisito falla, el servidor responde con uno de los códigos nuevos que trae la norma, como **YXDOMAIN (6)**, que indica que existe un nombre que no debía existir, o **NOTAUTH (9)**, que indica que el servidor no es autoritativo para la zona que nombra la sección Zone. La actualización la puede hacer el propio equipo o el servidor DHCP en su nombre; para eso el cliente le comunica su nombre completo con la **opción 81** (*Client FQDN*, RFC 4702). Y para que dos clientes no se pisen el mismo nombre, la RFC 4703 hace que quien añade sus registros A, AAAA o PTR añada también un registro **DHCID** con la identidad del cliente.',
    },
    {
      t: 'p',
      md: 'Una zona que acepta cambios de cualquiera es una zona que cualquiera puede falsificar. La RFC 3007 define la **actualización dinámica segura**, que autentica cada actualización con **TSIG** o con SIG(0). **TSIG** (RFC 8945, que deja obsoleta la 2845) usa una **clave secreta compartida** entre los dos extremos y añade al mensaje un **meta-registro de tipo 250** con un código de autenticación calculado sobre el mensaje entero; ese registro **no se guarda en la zona**, solo viaja. TSIG también protege las **transferencias de zona**. Y lleva dos campos de tiempo: **Time Signed**, la hora a la que se firmó, en segundos desde el 1 de enero de 1970 UTC, y **Fudge**, la diferencia de hora que se tolera, con un valor **recomendado de 300 segundos**. Si los relojes de los dos extremos se separan más que eso, el servidor rechaza el mensaje con el error **BADTIME (18)**. La hora vuelve a aparecer en la lección de NTP: muchas averías «de DNS» son en realidad relojes desfasados.',
    },
    {
      t: 'check',
      q: {
        q: 'En otra red, un servidor DHCP registra los nombres de los portátiles en un servidor DNS que no es de Active Directory, con actualizaciones firmadas con TSIG y una clave compartida. El servidor DNS rechaza una con el error BADTIME, y la clave es correcta. ¿Qué hay que revisar primero?',
        choices: [
          'Que la zona esté firmada con DNSSEC',
          'Que la hora del servidor DHCP y la del servidor DNS no se separen más que el margen permitido (Fudge)',
          'Que el TTL de los registros del portátil sea mayor de 300 segundos',
          'Que la actualización vaya por el puerto TCP 853',
        ],
        answer: 1,
        explain:
          'BADTIME (18) significa que la hora firmada queda fuera del margen que marca el campo Fudge, cuyo valor recomendado es de 300 segundos: los relojes no están sincronizados. DNSSEC no autentica actualizaciones dinámicas, y el 853 es el puerto de DoT, que no tiene nada que ver.',
      },
    },
    { t: 'h', text: 'DNSSEC: qué firma y qué no' },
    {
      t: 'p',
      md: 'Las **extensiones de seguridad del DNS**, DNSSEC (RFC 4033, 4034 y 4035), dan exactamente tres cosas, según la RFC 4033 (§3): **autenticación del origen** de los datos, **integridad** y **negación autenticada de existencia**, es decir, poder demostrar que un nombre no existe. Y la misma RFC deja escrito lo que **no** da (§4 y §12): **no da confidencialidad**, y lo dice como una decisión de diseño deliberada; tampoco listas de control de acceso ni protección frente a la denegación de servicio, y **no protege las transferencias de zona ni las actualizaciones dinámicas**, para las que remite a **TSIG** o SIG(0). Otro detalle: los registros NS y de pegamento (*glue*) que la zona padre tiene de una delegación **no se firman**.',
    },
    {
      t: 'table',
      headers: ['Registro', 'Tipo', 'Dónde está', 'Qué hace'],
      rows: [
        ['**DNSKEY**', '48', 'En la propia zona', 'Clave pública de la zona. Por costumbre operativa hay dos papeles: la **KSK** (*Key Signing Key*, clave que firma claves) firma las claves y la **ZSK** (*Zone Signing Key*, clave que firma la zona) firma los datos; las dos son registros DNSKEY'],
        ['**RRSIG**', '46', 'En la propia zona', 'Firma de un conjunto de registros (RRset), con fecha de inicio y de caducidad'],
        ['**NSEC**', '47', 'En la propia zona', 'Negación autenticada: encadena los nombres existentes para probar que uno no existe. Permite recorrer la zona y enumerar sus nombres'],
        ['**DS**', '43', 'En la **zona padre**', 'Resumen (*digest*) de un DNSKEY de la zona hija: el eslabón entre padre e hija'],
      ],
    },
    {
      t: 'p',
      md: 'La **cadena de confianza** funciona así. El resolutor que valida parte de un **ancla de confianza** (*trust anchor*), una clave DNSKEY, o el resumen de una, que tiene configurada por un medio seguro **ajeno al propio DNS**; lo normal es la de la raíz. El ancla autentica las **DNSKEY** de la raíz; con ellas se comprueba la firma del **DS** que la raíz publica para cada zona hija; el DS contiene el resumen de un **DNSKEY** de la hija, así que ese DNSKEY queda autenticado si coincide; ese DNSKEY permite comprobar los **RRSIG** de la hija, incluida la firma del DS que esa hija publica para su propia hija; y así eslabón a eslabón hasta llegar a la firma del registro que se pidió (RFC 4033 §2). Si `arcedo.example` se firmara en el proveedor, su DS tendría que publicarse en la zona padre; sin ese DS la zona estaría firmada pero sería una **isla de seguridad** (*island of security*, RFC 4033 §2), sin cadena que la una al ancla. En la cabecera hay bits para todo esto (RFC 4035 §3): el cliente pide los registros de DNSSEC con el bit **DO** del registro OPT de EDNS, el resolutor marca con **AD** (*Authentic Data*) una respuesta que ha validado, y **CD** (*Checking Disabled*) le pide que no valide. Y como las firmas tienen fecha de inicio y de caducidad (RFC 4034 §3.1.5), **un reloj mal puesto hace fallar la validación**.',
    },
    {
      t: 'check',
      q: {
        q: 'La jefatura del Servicio de Informática y Comunicaciones propone firmar la zona `arcedo.example` con DNSSEC «para que nadie pueda ver qué páginas consultan los puestos». ¿Qué le responde la Unidad de Seguridad de la Información?',
        choices: [
          'Que es buena idea, porque DNSSEC cifra las consultas entre el puesto y el resolutor',
          'Que DNSSEC solo cifra las transferencias de zona, no las consultas',
          'Que DNSSEC firma pero no cifra: garantiza origen e integridad, y para ocultar las consultas hacen falta DoT o DoH',
          'Que DNSSEC cifra las respuestas, pero no las preguntas',
        ],
        answer: 2,
        explain:
          'La RFC 4033 lo deja escrito: DNSSEC no da confidencialidad, por decisión de diseño. Firmar `arcedo.example` protege a quien recibe sus respuestas de una falsificación, pero cualquiera en el camino sigue viendo qué se pregunta. Tampoco protege las transferencias, que se protegen con TSIG.',
      },
    },
    {
      t: 'links',
      title: 'DNSSEC como control de seguridad, ya explicado en Security+',
      items: [
        { label: 'Ataques de red: envenenamiento DNS y amplificación, con DNSSEC como mitigación (lección sp2m7)', href: '/learn/sp2m7' },
      ],
    },
    { t: 'h', text: 'DNS cifrado: DoT y DoH' },
    {
      t: 'p',
      md: 'Lo que DNSSEC no hace, ocultar las consultas, lo hacen dos protocolos que **cifran el tramo entre el cliente y su resolutor**. **DNS sobre TLS**, DoT (RFC 7858), mete las consultas en una sesión TLS sobre **TCP 853**; el servidor puede usar otro puerto solo por acuerdo previo con el cliente, y **nunca el 53**. La IANA también tiene registrado el **853/udp**, pero para DNS sobre **DTLS** (*Datagram TLS*, TLS sobre datagramas UDP) o sobre **QUIC** (un transporte cifrado que también va sobre UDP), no para DoT. **DNS sobre HTTPS**, DoH (RFC 8484), envía cada consulta DNS como una petición HTTPS: el servidor **debe** aceptar **GET** y **POST**; en GET la consulta va en la variable **`dns`** codificada en **base64url**; el tipo de medio es **`application/dns-message`**; HTTP/2 es la versión mínima recomendada, y los clientes deberían usar un identificador de mensaje DNS igual a 0 para que la caché de HTTP funcione mejor. La RFC 8484 **no asigna un puerto propio**: DoH va donde vaya HTTPS, normalmente el 443, el de HTTPS.',
    },
    {
      t: 'table',
      headers: ['', 'DoT', 'DoH'],
      rows: [
        ['Norma', 'RFC 7858', 'RFC 8484'],
        ['Transporte', 'TLS sobre TCP', 'HTTPS (HTTP/2 como mínimo recomendado)'],
        ['Puerto', '**853/tcp**, propio; nunca el 53', 'Ninguno propio: el de HTTPS'],
        ['Formato', 'Mensaje DNS normal dentro de TLS', 'Mensaje DNS como `application/dns-message`; en GET, variable `dns` en base64url'],
        ['Visibilidad en la red', 'Se reconoce por el puerto, y se puede permitir o bloquear', 'Se confunde con el resto del tráfico web'],
      ],
    },
    {
      t: 'p',
      md: 'Para una organización esa última fila importa. Si un navegador de un puesto envía sus consultas por DoH a un resolutor externo, esas consultas **no pasan por DC1 ni por DC2**: los nombres de `ad.arcedo.example` no se resuelven por esa vía, y el **filtrado DNS** que haga la organización no las ve. Por eso conviene que el resolutor de la casa sea el único autorizado, y que, si se quiere cifrar, sea él quien ofrezca DoT o DoH a sus puestos.',
    },
    {
      t: 'check',
      q: {
        q: 'El cortafuegos del Consorcio solo deja salir DNS desde DC1 y DC2. Aun así, un puesto resuelve nombres de Internet con un resolutor externo sin pasar por ellos. ¿Qué protocolo es el sospechoso más probable?',
        choices: [
          'DoH, porque viaja como tráfico HTTPS y no tiene un puerto propio que filtrar',
          'DoT, porque usa el puerto 53 cifrado',
          'DNSSEC, porque las respuestas firmadas atraviesan el cortafuegos',
          'DDNS, porque el puesto actualiza su propia zona',
        ],
        answer: 0,
        explain:
          'DoH va dentro de HTTPS y la RFC 8484 no le da un puerto propio, así que se mezcla con la navegación normal. DoT tiene un puerto propio, el 853/tcp, nunca el 53, y es fácil de filtrar. DNSSEC no es un transporte, y DDNS sirve para cambiar una zona, no para resolver.',
      },
    },
    { t: 'h', text: 'Ataques habituales: qué son' },
    {
      t: 'p',
      md: 'Tres ataques aparecen siempre que se habla de DNS, y aquí basta con saber reconocerlos; su detección y su mitigación están en las lecciones enlazadas. El **envenenamiento de caché** consiste en colar en la caché de un resolutor una respuesta falsa, de modo que un nombre legítimo resuelva a la dirección del atacante para todos los que usan ese resolutor; DNSSEC, al firmar las respuestas, permite al resolutor que valida detectar la falsificación. La **amplificación** usa resolutores ajenos como altavoz: el atacante envía consultas pequeñas con la dirección de origen falsificada, la de su víctima, y las respuestas, mucho mayores, caen todas sobre ella; por eso un resolutor interno como DC1 o DC2 **solo debe atender a la red del Consorcio** y no convertirse en un resolutor abierto. Los **túneles DNS** esconden datos dentro de consultas y respuestas aparentemente normales, por ejemplo en nombres muy largos de un dominio que controla el atacante, para sacar información o mantener un canal de mando cuando todo lo demás está bloqueado.',
    },
    {
      t: 'links',
      title: 'Los ataques al DNS, a fondo en otras lecciones',
      items: [
        { label: 'Envenenamiento DNS y DDoS reflejado y amplificado (lección sp2m7 de Security+)', href: '/learn/sp2m7' },
        { label: 'Filtrado DNS como capacidad de seguridad (lección sp4m7 de Security+)', href: '/learn/sp4m7' },
        { label: 'Un caso de búsqueda de túneles DNS en el hunting guiado por inteligencia (lección s5m5 de GCTI)', href: '/learn/s5m5' },
      ],
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Lo que más se confunde',
      md: '**Horizonte dividido:** misma pregunta, respuesta distinta según el origen; la RFC 9499 lo nombra sin definirlo formalmente, y las «vistas» son configuración de producto. **Reenviador:** reenvía la consulta **con RD = 1** y espera la respuesta, no una remisión. **SRV de Active Directory:** `_ldap._tcp.dc._msdcs.<dominio>` (389) y `_kerberos._tcp.dc._msdcs.<dominio>` (88); `_msdcs` es de Microsoft, el formato SRV es de la RFC 2782; prioridad más baja primero; el destino nunca es un alias. **DDNS:** RFC 2136, código de operación **UPDATE (5)**, no confundir con **NOTIFY (4)**, que avisa a los secundarios de un cambio. **TSIG:** RFC **8945** (la 2845 está obsoleta), tipo **250**, clave compartida, Fudge recomendado **300 s**, **BADTIME (18)** si los relojes se separan. **DNSSEC:** origen, integridad y negación autenticada; **no cifra**, no frena la denegación de servicio y no protege transferencias ni actualizaciones (eso es TSIG). DNSKEY 48, RRSIG 46, NSEC 47 y **DS 43, que está en la zona padre**. **DoT:** **853/tcp**, nunca 53; el 853/udp es para DTLS o QUIC. **DoH:** RFC 8484, `application/dns-message`, sin puerto propio: el de HTTPS.',
    },
  ],
  quiz: [
    {
      id: 'op3m2q1',
      domain: 'Servicios de red',
      prompt: 'Según la RFC 4033, ¿qué servicios proporciona DNSSEC a los datos del DNS?',
      choices: [
        'Confidencialidad de las consultas, integridad de las respuestas y protección frente a la denegación de servicio',
        'Cifrado y autenticación de las transferencias de zona entre servidores primarios y secundarios',
        'Autenticación del origen, integridad de los datos y negación autenticada de existencia',
        'Listas de control de acceso que deciden qué clientes pueden consultar cada zona',
      ],
      answer: 2,
      explain:
        'La RFC 4033 (§3) enumera autenticación del origen, integridad y negación autenticada de existencia. La primera opción tienta porque mezcla la integridad con dos cosas que la misma RFC descarta: confidencialidad y protección frente a la denegación de servicio. Las transferencias se protegen con TSIG, y DNSSEC no aporta listas de control de acceso.',
    },
    {
      id: 'op3m2q2',
      domain: 'Servicios de red',
      prompt: '¿En qué puerto y con qué transporte escucha un servidor de DNS sobre TLS (DoT) según la RFC 7858?',
      choices: [
        'TCP 853',
        'UDP 853',
        'TCP 53, negociando TLS dentro de la misma conexión',
        'TCP 443, compartido con HTTPS',
      ],
      answer: 0,
      explain:
        'La RFC 7858 fija el TCP 853 y prohíbe usar el 53 para DoT. El 853/udp tienta porque está registrado con el mismo nombre de servicio, pero es para DNS sobre DTLS o QUIC. El 443 es el de HTTPS, por donde va DoH, no DoT.',
    },
    {
      id: 'op3m2q3',
      domain: 'Servicios de red',
      prompt:
        'Un puesto de la VLAN 10 del Consorcio, configurado con DNS `10.20.72.11` y `10.20.72.12`, pregunta por `www.arcedo.example`. DC1 no es autoritativo para `arcedo.example`. ¿Qué hace DC1?',
      choices: [
        'Responde NXDOMAIN, porque el nombre no está en su zona',
        'Devuelve al puesto una remisión para que pregunte él mismo al proveedor externo',
        'Pide una transferencia de zona de `arcedo.example` al proveedor y responde desde ella',
        'Reenvía la consulta, con RD = 1, a los resolutores del operador, que obtienen la respuesta de los servidores del proveedor',
      ],
      answer: 3,
      explain:
        'DC1 y DC2 resuelven lo de `ad.arcedo.example` y reenvían lo demás a los resolutores del operador; el reenviador manda la consulta con RD = 1 porque quiere la respuesta, no una remisión. NXDOMAIN tienta porque el nombre no está en su zona, pero no ser autoritativo no significa que el nombre no exista. Ningún proveedor autoriza transferencias de zona a cualquiera.',
    },
    {
      id: 'op3m2q4',
      domain: 'Servicios de red',
      prompt:
        'Un puesto que arranca en el dominio `ad.arcedo.example` necesita encontrar un controlador de dominio que sirva LDAP. ¿Qué consulta hace? (Nombres de Active Directory, según Microsoft.)',
      choices: [
        'Un registro MX de `ad.arcedo.example`',
        'Un registro SRV de `_ldap._tcp.dc._msdcs.ad.arcedo.example`, que devuelve destino y puerto 389',
        'Un registro A de `dc.ad.arcedo.example`, que siempre apunta al controlador principal',
        'Un registro PTR de `10.20.72.11`',
      ],
      answer: 1,
      explain:
        'Active Directory publica sus controladores con registros SRV bajo `_msdcs`, y el de LDAP da el destino y el puerto 389. El registro A tienta por el nombre, pero no hay ningún nombre fijo que apunte a «el» controlador: por eso se usan SRV con prioridad y peso. MX es del correo y PTR de la resolución inversa.',
    },
    {
      id: 'op3m2q5',
      domain: 'Servicios de red',
      prompt: '¿Con qué código de operación (OPCODE) se envía un mensaje de actualización dinámica según la RFC 2136?',
      choices: [
        'NOTIFY (4)',
        'QUERY (0)',
        'UPDATE (5)',
        'IQUERY (1)',
      ],
      answer: 2,
      explain:
        'La RFC 2136 define el OPCODE UPDATE, con valor 5, y sus secciones Zone, Prerequisite, Update y Additional Data. NOTIFY (4) tienta porque también tiene que ver con cambios en una zona, pero lo envía el primario para avisar a los secundarios de que el SOA ha cambiado (RFC 1996); no modifica nada.',
    },
    {
      id: 'op3m2q6',
      domain: 'Servicios de red',
      prompt: '¿Qué afirmación sobre TSIG (RFC 8945) es correcta?',
      choices: [
        'Usa una clave secreta compartida y un meta-registro de tipo 250 que viaja con el mensaje pero no se guarda en la zona',
        'Usa la clave privada de la zona, la misma que firma los registros RRSIG de DNSSEC',
        'Cifra el contenido de la transferencia de zona para que no se pueda leer',
        'Está definido en la RFC 2845, que sigue siendo la referencia vigente',
      ],
      answer: 0,
      explain:
        'TSIG autentica la transacción con un secreto que comparten los dos extremos; su registro, de tipo 250, es un meta-registro que no se almacena en la zona. La segunda opción tienta por la palabra «firma», pero confunde TSIG con DNSSEC, que usa pares de claves. TSIG autentica, no cifra, y la 2845 está obsoleta: hoy rige la 8945.',
    },
    {
      id: 'op3m2q7',
      domain: 'Servicios de red',
      prompt: '¿Dónde se publica un registro DS de DNSSEC y qué contiene?',
      choices: [
        'En la zona hija; contiene la firma de cada conjunto de registros',
        'En la zona hija; contiene la cadena de nombres existentes para probar que uno no existe',
        'En el resolutor que valida; contiene la clave privada de la raíz',
        'En la zona padre; contiene un resumen de un registro DNSKEY de la zona hija',
      ],
      answer: 3,
      explain:
        'El DS (tipo 43) solo aparece en el lado padre de una delegación y guarda el resumen de un DNSKEY de la hija: es el eslabón que une las dos zonas en la cadena de confianza. La firma de cada conjunto de registros es el RRSIG, y la cadena de nombres para negar la existencia es NSEC. Ninguna clave privada sale nunca de quien firma: el resolutor solo maneja claves públicas o sus resúmenes.',
    },
    {
      id: 'op3m2q8',
      domain: 'Servicios de red',
      prompt:
        'Un análisis externo descubre que DC1 (`10.20.72.11`) responde consultas recursivas a cualquier dirección de Internet. ¿Qué riesgo concreto supone?',
      choices: [
        'Que cualquiera pueda pedir por AXFR la zona `arcedo.example` del proveedor',
        'Que DC1 sea un resolutor abierto, utilizable como reflector en ataques de amplificación',
        'Que las consultas de los puestos internos viajen sin cifrar hasta DC1',
        'Que las firmas DNSSEC de `arcedo.example` caduquen antes de tiempo',
      ],
      answer: 1,
      explain:
        'Un resolutor que atiende a casi cualquier cliente es un resolutor abierto (RFC 9499), y sirve para amplificar: el atacante le manda consultas pequeñas con el origen falsificado y DC1 responde con mucho más a la víctima. La tercera opción describe algo real, pero no tiene que ver con abrir la recursión a Internet. La zona `arcedo.example` ni siquiera está en DC1.',
    },
  ],
};
