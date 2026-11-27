import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// OP4M3 — Balanceo en capa 7 y persistencia de sesión
// ---------------------------------------------------------------------------
export const OP4_M3: Module = {
  id: 'op4m3',
  sectionId: 'op4',
  title: 'Balanceo en capa 7 y persistencia de sesión',
  minutes: 24,
  objectives: [
    'Explicar qué añade un balanceador de capa 7 (un proxy inverso que entiende HTTP) frente a uno de capa 4, y repartir peticiones por la cabecera Host y por la ruta',
    'Distinguir la cabecera estándar Forwarded (RFC 7239: for, by, proto, host) de X-Forwarded-For, y decir cuándo merecen confianza',
    'Describir el protocolo PROXY v1 y v2 como especificación de HAProxy, no como RFC, y reconocer cuándo lo necesita un balanceador de capa 4',
    'Comparar la persistencia por IP de origen, por cookie insertada por el balanceador, por cookie de la aplicación y por identificador de sesión TLS, con sus fallos (NAT masivo, cookie perdida, TLS 1.3)',
    'Razonar qué pasa con la persistencia cuando cae un miembro y por qué una sesión compartida entre servidores evita depender de ella',
    'Aplicar todo lo anterior a la publicación del Consorcio: grupo sede con cookie insertada por el ADC y grupo www sin persistencia',
  ],
  blocks: [
    {
      t: 'p',
      md: 'En la lección anterior el balanceador miraba direcciones y puertos y decidía **por conexión**. Aquí sube a la **capa 7**: lee la petición HTTP, decide **por petición** y puede usar cualquier cosa que viaje en ella (el nombre del sitio, la ruta, una *cookie*). En el Consorcio Provincial de Arcedo es justo lo que hace la pareja de balanceadores del CPD, el **ADC** (*Application Delivery Controller*): por la única dirección pública `203.0.113.10` entran dos nombres, `www.arcedo.example` y `sede.arcedo.example`, el encaminador reenvía el 443 a la IP virtual `10.20.72.70` y el ADC tiene que saber a qué grupo de servidores manda cada petición. Y en la sede electrónica, además, tiene que mandar a cada ciudadano **siempre al mismo servidor**, porque la aplicación guarda la sesión en la memoria de cada uno.',
    },
    {
      t: 'links',
      title: 'Antes de seguir',
      items: [
        { label: 'Proxy directo, proxy inverso (gateway) y túnel según la RFC 9110 (lección op3m5)', href: '/learn/op3m5' },
        { label: 'Balanceo en capa 4: VIP, grupos, algoritmos y modos de reenvío (lección op4m2)', href: '/learn/op4m2' },
        { label: 'Descarga de TLS, recifrado y paso directo (lección op4m5)', href: '/learn/op4m5' },
      ],
    },
    { t: 'h', text: 'Un proxy inverso que entiende HTTP' },
    {
      t: 'p',
      md: 'La RFC 9110 §3.7 ya lo decía: el **gateway**, «a.k.a. "reverse proxy"», se presenta hacia fuera como el servidor de origen y reenvía hacia dentro a uno o varios servidores, y entre sus usos está repartir la carga de un servicio HTTP entre varias máquinas. Un balanceador de capa 7 es eso: termina la conexión del cliente, **lee la petición entera** y abre otra conexión, suya, hacia el servidor elegido; en esa segunda conexión se comporta como un cliente HTTP más. Como lee cada petición, puede repartir las peticiones de una misma conexión entre servidores distintos. La propia norma cuenta con ello (§3.3): muchas implementaciones reparten peticiones dinámicamente entre servidores, y por eso un servidor **no debe suponer** que dos peticiones de la misma conexión vienen del mismo agente. Esa libertad es la que luego obliga a pensar en la persistencia.',
    },
    {
      t: 'p',
      md: 'Para leer la petición, el balanceador necesita verla en claro. Si el tráfico llega por HTTPS, tiene que **terminar TLS**: tener el certificado y la clave del sitio y descifrar. El Consorcio lo hace así en los dos grupos (en `sede`, además, vuelve a cifrar hacia los servidores); cómo se monta y qué se gana y se pierde está en la lección `op4m5`. Sin terminar TLS, un equipo de capa 4 solo puede asomarse al saludo TLS, que lleva el nombre en la extensión SNI (si el cliente la envía y no usa ECH; ver op4m5), pero nunca a la ruta, las cabeceras ni las *cookies*. Ojo con un detalle de fabricante: en HAProxy el modo por defecto es `mode tcp` (TCP puro, sin examen de capa 7); sin `mode http` no hay `Host`, ni rutas, ni *cookies* (valor del fabricante, manual de HAProxy 3.4).',
    },
    {
      t: 'table',
      headers: ['Qué usa para decidir', 'Qué mira', 'Ejemplo de uso', 'Nota de la fuente'],
      rows: [
        ['**Nombre del sitio**', 'Cabecera `Host` (en HTTP/2 y HTTP/3, a veces el pseudo-campo `:authority`)', 'Dos sitios tras una misma dirección: `www` y `sede` en el Consorcio', 'RFC 9110 §7.2: `Host` permite distinguir recursos de varios nombres en un mismo servidor; por ser un mecanismo de encaminamiento, es blanco de quien quiere envenenar una caché o desviar peticiones'],
        ['**Ruta**', 'La parte del URI tras el nombre', 'Mandar `/estaticos/` a unos servidores y el resto a otros', 'HAProxy en `mode http` permite conmutar por contenido; aparte, `balance uri` reparte por *hash* del URI, pensado para cachés (valor del fabricante)'],
        ['**Otra cabecera**', 'Cualquier cabecera de la petición', 'Repartir por un identificador de cliente', 'HAProxy `balance hdr(<name>)`; si falta la cabecera, *round robin* (valor del fabricante)'],
        ['**Parámetro de la URL**', 'Un parámetro de la consulta', 'Repartir por un número de expediente', 'HAProxy `balance url_param`; si no aparece, *round robin* (valor del fabricante)'],
        ['**Cookie**', 'Cabecera `Cookie`', 'Persistencia de sesión (abajo)', 'RFC 6265 para el mecanismo; el uso para persistir es de cada fabricante'],
      ],
    },
    {
      t: 'p',
      md: 'En el Consorcio, los dos nombres resuelven a `203.0.113.10` y el ADC los distingue **por SNI y por `Host`**: por el SNI elige qué certificado presenta y, ya descifrada la petición, por el `Host` elige el grupo. Que mande el `Host` no es capricho. Con HTTP/2 un navegador puede reutilizar una misma conexión para otro nombre que cubra el mismo certificado (RFC 9113 §9.1.1); si el reparto se hiciera solo por el SNI del primer saludo, la segunda petición podría acabar en el grupo equivocado. La norma da al servidor el código **421 Misdirected Request** para rechazarla, y el manual de HAProxy avisa de que en HTTPS el SNI debe coincidir con `Host` y de que un cliente puede usar varios nombres en una misma conexión: por eso conviene encaminar por `Host`. Otro matiz de fabricante: NGINX, por defecto, **no** pasa al servidor el `Host` del cliente, sino `Host $proxy_host`, el nombre del servidor tal como figura en `proxy_pass`; si la aplicación necesita el original, hay que configurarlo o mandarlo en `Forwarded` con el parámetro `host` (RFC 7239 §5.3).',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Una petición a la sede electrónica, antes y después del ADC',
      text: `Ciudadano 192.0.2.43  ->  203.0.113.10:443  ->  (reenvío del encaminador)  ->  VIP 10.20.72.70:443
  TLS: SNI = sede.arcedo.example     -> el ADC presenta el certificado de sede
  GET / HTTP/1.1
  Host: sede.arcedo.example          -> el ADC elige el grupo «sede»

ADC  ->  SEDE1 10.20.72.91:443   (TLS de nuevo: recifrado hacia el servidor)
  GET / HTTP/1.1
  Host: sede.arcedo.example
  Forwarded: for=192.0.2.43;proto=https;host=sede.arcedo.example

  SEDE1 ve la conexión llegar desde el ADC, no desde 192.0.2.43:
  si quiere saber quién es el ciudadano, lo lee en Forwarded.`,
    },
    {
      t: 'check',
      q: {
        q: 'El ADC del Consorcio recibe por la misma dirección y el mismo puerto peticiones para www.arcedo.example y para sede.arcedo.example, y las manda a grupos distintos. ¿Qué necesita para hacerlo por la cabecera Host?',
        choices: [
          'Nada especial: un balanceador de capa 4 lee la cabecera Host en el primer paquete TCP',
          'Terminar TLS y leer la petición HTTP, porque Host viaja cifrada dentro de la conexión',
          'Que cada nombre resuelva a una dirección pública distinta',
          'Que el encaminador reenvíe un puerto distinto para cada nombre',
        ],
        answer: 1,
        explain:
          'Host es una cabecera de la petición HTTP y, con HTTPS, va cifrada: para leerla el ADC tiene que terminar TLS (los detalles, en op4m5). Lo tentador es pensar en capa 4, pero un equipo de capa 4 solo ve direcciones, puertos y, como mucho, el SNI del saludo TLS. Las direcciones o puertos distintos serían otra forma de separar los sitios, justo la que el Consorcio no puede usar con una sola dirección pública.',
      },
    },
    { t: 'h', text: 'Quién era el cliente: Forwarded y X-Forwarded-For' },
    {
      t: 'p',
      md: 'Un proxy inverso abre su propia conexión hacia el servidor, así que el servidor ve como origen la **IP del proxy**. La RFC 7239 §1 lo plantea así: los proxies de balanceo y de descarga de cifrado (*crypto offload*) hacen que se pierda la dirección original, que hace falta para diagnóstico, control de acceso y gestión de abusos. Su respuesta es la cabecera **`Forwarded`**, la **estándar**, con cuatro parámetros: **`for`** (el cliente que inició la petición, y los proxies siguientes), **`by`** (la interfaz por la que entró al proxy), **`proto`** (típicamente `http` o `https`, útil cuando el proxy ha descifrado) y **`host`** (el `Host` original, por si el proxy lo reescribe). Cada proxy puede añadir su elemento y el primero de la lista es el del primer proxy. La norma la trata como sensible: es opcional, solo va en peticiones y «should be turned off by default»; y por defecto propone identificadores **ofuscados** (empiezan por `_`) en lugar de direcciones reales.',
    },
    {
      t: 'table',
      headers: ['', '`Forwarded`', '`X-Forwarded-For`'],
      rows: [
        ['Norma', '**RFC 7239** (Proposed Standard)', '**Ninguna**: la RFC 7239 §1 la llama «non-standard», igual que X-Forwarded-By y X-Forwarded-Proto; §8.3 reconoce que está «widely used»'],
        ['Qué lleva', '`for`, `by`, `proto`, `host` en un mismo elemento, así que se sabe qué datos van juntos', 'Una lista de direcciones; cuando además llegan X-Forwarded-By y X-Forwarded-Proto, no se sabe qué dato va con cuál'],
        ['IPv6', 'Entre corchetes y comillas: `for="[2001:db8:cafe::17]"` (§6, §7.1)', 'Tal cual: `2001:db8:cafe::17`'],
        ['Conversión', '§7.4: un proxy puede pasar de una a otra anteponiendo `for=` a cada elemento', '`X-Forwarded-For: 192.0.2.43, 2001:db8:cafe::17` equivale a `Forwarded: for=192.0.2.43, for="[2001:db8:cafe::17]"`'],
        ['En productos (valor del fabricante)', 'HAProxy `option forwarded`', 'HAProxy `option forwardfor`; NGINX `$proxy_add_x_forwarded_for` (añade `$remote_addr` al final); AWS ALB, modo `append` por defecto'],
      ],
    },
    {
      t: 'p',
      md: 'Ninguna de las dos es fiable por sí sola. La RFC 7239 §8.1 avisa de que cualquier nodo del camino, **incluido el cliente**, puede escribirla o alterarla, y que lo que haya antes del primer proxy de confianza no merece confianza. Por eso el manual de HAProxy pide que el servidor use **la última** aparición de X-Forwarded-For, la que añadió el propio balanceador, y no la primera, que puede venir inventada desde fuera (valor del fabricante). Traducido al Consorcio: SEDE1 y SEDE2 solo deben creer la dirección que les añade el ADC, y solo porque saben que la conexión viene de `10.20.72.71` o `10.20.72.72`; si alguien llegara a los servidores sin pasar por el ADC, esa cabecera no valdría nada.',
    },
    {
      t: 'check',
      q: {
        q: 'A SEDE1 le llega una petición con «X-Forwarded-For: 198.51.100.200, 192.0.2.43». El ADC del Consorcio está configurado para añadir X-Forwarded-For con la dirección del cliente al final. ¿Qué dirección debe registrar la aplicación como la del ciudadano?',
        choices: [
          '198.51.100.200, porque el primer elemento de la lista es siempre el cliente original',
          '10.20.72.70, porque es la IP virtual por la que entró la petición',
          'Ninguna: X-Forwarded-For está prohibida desde la RFC 7239',
          '192.0.2.43, la última, que es la que escribió el ADC; la primera pudo traerla el propio cliente',
        ],
        answer: 3,
        explain:
          'Con esa configuración, el ADC añade al final la dirección que ve; lo anterior ya venía en la petición y pudo inventarlo el cliente (RFC 7239 §8.1; HAProxy recomienda usar la última aparición). La primera tienta porque en una cadena de proxies todos de confianza sería el origen, pero aquí no hay ningún proxy de confianza antes del ADC. La RFC 7239 no prohíbe X-Forwarded-For: la describe como no estándar y define Forwarded como alternativa.',
      },
    },
    { t: 'h', text: 'El protocolo PROXY: la dirección del cliente cuando no hay HTTP' },
    {
      t: 'p',
      md: 'Las cabeceras anteriores solo existen si el balanceador habla HTTP. Un balanceador de **capa 4** que reenvía TCP sin tocarlo (por ejemplo, con TLS en paso directo hasta el servidor) no puede añadir cabeceras a una petición que no ve. Para ese caso existe el **protocolo PROXY**: el balanceador antepone, **al principio de cada conexión**, una pequeña cabecera con la familia, el protocolo y las direcciones y puertos de origen y destino originales, justo lo que el servidor obtendría de la conexión si hablara directamente con el cliente. Su origen importa: **no es una RFC ni un documento IETF**, sino una especificación de **HAProxy Technologies** («The PROXY protocol, Versions 1 & 2», Willy Tarreau), que han adoptado otros fabricantes, como NGINX y el NLB de AWS.',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Protocolo PROXY (especificación de HAProxy, revisión 2026/04/27)',
      text: `Versión 1 (texto US-ASCII, una línea, como máximo 107 caracteres):
  PROXY TCP4 192.168.0.1 192.168.0.11 56324 443\\r\\n
        |    |           |            |     |
        |    origen      destino      puerto origen, puerto destino
        familia: TCP4, TCP6 o UNKNOWN

Versión 2 (binaria):
  firma fija de 12 bytes: \\x0D \\x0A \\x0D \\x0A \\x00 \\x0D \\x0A \\x51 \\x55 \\x49 \\x54 \\x0A
  versión \\x2 y comando: LOCAL (\\x0, p. ej. comprobaciones de salud del propio proxy)
                         o PROXY (\\x1, conexión reenviada de un cliente)
  IPv4, IPv6 o UNIX; TCP o UDP
  extensiones TLV: PP2_TYPE_ALPN (0x01), PP2_TYPE_AUTHORITY (0x02, copia del SNI), PP2_TYPE_SSL (0x20)...`,
    },
    {
      t: 'p',
      md: 'Dos condiciones lo hacen funcionar. La primera: **los dos extremos tienen que estar de acuerdo**. Un servidor que no espera la cabecera la tomará por basura al principio de la conexión, y la especificación (§5) prohíbe que el receptor intente **adivinar** si viene o no: lo decide su configuración. La segunda: el receptor solo debe aceptarla **de fuentes conocidas**, porque si no cualquier cliente podría falsear su origen escribiéndola él mismo. En productos (valores del fabricante): HAProxy la envía con `send-proxy` (v1) o `send-proxy-v2`; NGINX, en su módulo `stream`, con `proxy_protocol on` (v1) o `v2`, esta última desde la versión **1.31.4**; y el NLB de AWS ofrece la **v2** como opción. En el Consorcio no hace falta: el ADC termina TLS en los dos grupos y puede pasar la dirección del ciudadano en `Forwarded`.',
    },
    {
      t: 'check',
      q: {
        q: 'Una organización pone un balanceador de capa 4 que reenvía el TLS sin descifrarlo hasta sus servidores, y la aplicación necesita la IP real de cada cliente. ¿Qué encaja?',
        choices: [
          'Activar el protocolo PROXY en el balanceador y configurar los servidores para esperarlo solo desde él',
          'Añadir la cabecera Forwarded en el balanceador, como manda la RFC 7239',
          'Activar el protocolo PROXY definido en la RFC 7239 y dejar que el servidor detecte si llega o no',
          'Nada: un balanceador de capa 4 siempre deja ver al servidor la IP del cliente',
        ],
        answer: 0,
        explain:
          'Sin descifrar, el balanceador no puede escribir cabeceras HTTP, así que Forwarded queda fuera. El protocolo PROXY antepone la dirección original al principio de la conexión, pero es una especificación de HAProxy (no de la RFC 7239) y el servidor debe esperarlo por configuración y solo de fuentes conocidas, nunca autodetectarlo. Si el servidor ve o no la IP del cliente depende del modo de reenvío de capa 4 (op4m2), no está garantizado.',
      },
    },
    { t: 'h', text: 'Persistencia de sesión: por qué hace falta y cómo se consigue' },
    {
      t: 'p',
      md: 'HTTP no tiene estado: cada petición es independiente. Las aplicaciones lo resuelven con una **sesión**: el servidor guarda los datos del usuario (quién es, qué trámite lleva a medias) y le da un identificador, normalmente en una *cookie*. Si esos datos viven **en la memoria de un servidor concreto**, como en la sede electrónica del Consorcio, y la siguiente petición va a otro, ese otro no sabe nada: el ciudadano aparece desconectado a mitad de un trámite. La **persistencia** (también *session affinity*, *stickiness* o *sticky sessions*, según el fabricante) consiste en que el balanceador mande todas las peticiones de un mismo cliente al mismo servidor mientras dure la sesión. La pregunta es **cómo reconoce al cliente**.',
    },
    {
      t: 'table',
      headers: ['Método', 'Cómo reconoce al cliente', 'Capa', 'Dónde falla', 'Ejemplos de fabricante'],
      rows: [
        ['**IP de origen**', 'Por la dirección desde la que llega (en una tabla o con un *hash*)', '4 (no necesita descifrar)', 'Muchos usuarios tras una misma dirección (NAPT) van todos al mismo servidor; un usuario que cambia de dirección pierde su servidor; con *hash*, cambiar el número de servidores remezcla clientes', 'HAProxy `balance source` (IP entera) o `stick on src`; NGINX `ip_hash` (**tres primeros octetos** de la IPv4, o la IPv6 entera); *sticky sessions* del NLB de AWS'],
        ['***Cookie* insertada por el balanceador**', 'El balanceador añade una *cookie* propia con el identificador del servidor y la lee en las peticiones siguientes', '7 (con HTTPS, hay que terminar TLS)', 'Clientes que no guardan *cookies*; *cookie* perdida o borrada; cachés intermedias que podrían servir la respuesta con la *cookie* de otro', 'HAProxy `cookie <name> insert`; NGINX `sticky cookie`; AWS ALB, *cookie* `AWSALB`'],
        ['***Cookie* de la aplicación**', 'El balanceador aprovecha la *cookie* de sesión que crea la aplicación', '7', 'Depende del nombre y del comportamiento de la aplicación; el balanceador tiene que aprender o modificar su valor', 'HAProxy `cookie <name> rewrite` (no recomendado para despliegues nuevos) o `prefix`; NGINX `sticky learn`; AWS ALB por aplicación (`AWSALBAPP-*`)'],
        ['**Identificador de sesión TLS**', 'Por el ID de sesión del saludo TLS, sin descifrar', '4 (lee el saludo)', 'Depende de campos de TLS 1.2: en TLS 1.3 los «session IDs» y «session tickets» de reanudación quedan obsoletos (RFC 9846 §2.2)', 'Ejemplo del manual de HAProxy en `mode tcp`, con `req.payload_lv(43,1)` y una `stick-table type binary len 32`'],
      ],
    },
    {
      t: 'p',
      md: '**Por IP de origen** es lo más sencillo y lo único que puede hacer un equipo que no descifra, pero choca con la traducción de direcciones. Con **NAPT** (RFC 3022 §2.2) muchos equipos salen a Internet con **una sola dirección**. El propio Consorcio es el ejemplo: sus **200 puestos** de la sede salen con PAT por `203.0.113.10`, así que, para cualquier servidor de fuera que persista por IP, los 200 son **un único cliente** y caen todos en el mismo miembro. A la sede electrónica le pasa lo contrario: un ayuntamiento entero detrás de su NAT, o muchos ciudadanos detrás del NAT de su operador, llegan desde una misma dirección y se amontonan en SEDE1 o en SEDE2 mientras el otro está ocioso. AWS lo advierte en su documentación del NLB: todos los clientes tras un mismo NAT tienen la misma IP de origen y van al mismo destino. Con `ip_hash` de NGINX el efecto es mayor, porque usa solo los tres primeros octetos: toda una /24 va al mismo servidor. Y hay un fallo más: el móvil que pasa de la wifi a los datos cambia de dirección a mitad del trámite y el balanceador lo manda a otro servidor.',
    },
    {
      t: 'p',
      md: '**Por *cookie* insertada** el balanceador no depende de la dirección: reconoce al **navegador**. La primera respuesta lleva un `Set-Cookie` del balanceador con el identificador del servidor elegido; el navegador la devuelve en la cabecera `Cookie` (RFC 6265 §4.1) y el balanceador la lee. Cada fabricante la gestiona a su manera, y conviene rotularlo: la de HAProxy en modo `insert` es una *cookie* de sesión, que no se guarda en disco, y el manual aconseja `nocache` o `postonly` si hay cachés por medio; NGINX la genera con `sticky cookie` (en su ejemplo, `srv_id expires=1h`) y, sin `expires`, caduca al cerrar el navegador; `sticky` era solo de NGINX Plus y **desde la 1.29.6 está en la versión libre**, salvo el parámetro `sync`. El ALB de AWS genera la *cookie* **`AWSALB`**, cifrada, con una caducidad propia de **7 días no configurable** y una duración de la afinidad configurable de 1 segundo a 7 días. Lo que sí es norma son los atributos de la RFC 6265: sin `Expires` ni `Max-Age` la *cookie* caduca al acabar la sesión del agente (§4.1.2); `Secure` la limita a canales seguros (§4.1.2.5) y `HttpOnly` la oculta a los scripts del navegador (§4.1.2.6). El atributo `SameSite` aparece en documentación de fabricantes, pero **no está en la RFC 6265**.',
    },
    {
      t: 'check',
      q: {
        q: 'El Consorcio publica la sede electrónica para ciudadanos que llegan desde todo tipo de redes, incluidos ayuntamientos que salen a Internet con una sola dirección pública. ¿Por qué es mejor la cookie insertada por el ADC que la persistencia por IP de origen?',
        choices: [
          'Porque la cookie insertada no necesita que el ADC termine TLS',
          'Porque la RFC 6265 obliga a los balanceadores a usar cookies para la persistencia',
          'Porque reconoce a cada navegador, mientras que por IP todos los usuarios tras un mismo NAT irían al mismo servidor',
          'Porque la persistencia por IP solo funciona con IPv6',
        ],
        answer: 2,
        explain:
          'Tras un NAPT muchos usuarios comparten dirección y la persistencia por IP los manda a todos al mismo miembro, que se sobrecarga; la cookie distingue navegador a navegador. La primera opción tienta, pero es al revés: para leer y escribir cookies en HTTPS el ADC tiene que terminar TLS, cosa que el Consorcio ya hace. La RFC 6265 define las cookies, no cómo se usan para balancear.',
      },
    },
    { t: 'h', text: 'Cuando cae un miembro: lo que la persistencia no puede salvar' },
    {
      t: 'p',
      md: 'La persistencia garantiza que el ciudadano vuelve **al mismo servidor**, pero no que ese servidor siga vivo. Si SEDE1 cae, la *cookie* apunta a un miembro que la comprobación de salud ya ha sacado del grupo (lección `op4m4`); lo normal es que el ADC mande la petición a SEDE2 (el comportamiento exacto depende del fabricante), y SEDE2 **no tiene la sesión**, porque estaba en la memoria de SEDE1. El ciudadano tiene que volver a identificarse y empezar el trámite. Ningún método de persistencia lo evita: la sesión se pierde con el servidor que la guardaba. Con *hash* de IP de origen hay otro efecto: HAProxy avisa de que con `balance source`, si cambia el número de servidores, **muchos** clientes pasan a otro servidor, no solo los del que cayó (valor del fabricante; lo mismo dice NGINX de `hash` sin `consistent`).',
    },
    {
      t: 'p',
      md: 'Lo que sí se puede hacer bien es el **apagado ordenado**. HAProxy tiene un estado `drain`: el servidor sale del reparto de clientes nuevos pero **sigue aceptando las conexiones persistentes**, de modo que los que ya tenían sesión en él terminan su trámite; `maint`, en cambio, corta el tráfico y las comprobaciones. Con `weight 0`, el servidor tampoco recibe reparto pero sí conexiones persistentes, y `http-check disable-on-404` permite que la propia aplicación pida salir respondiendo 404 a la comprobación (todo, valores del fabricante; el drenaje se ve en `op4m4`). Y queda la otra mitad de la pareja: cuando el ADC1 cae y toma el relevo el ADC2, es razonable esperar (es una deducción, no un comportamiento documentado) que una persistencia por *cookie* insertada siga funcionando, siempre que ADC2 tenga la misma configuración: el dato viaja en el navegador y el valor de cada servidor está en la configuración (`server ... cookie <value>` en HAProxy); una persistencia guardada en una tabla del balanceador, como la de IP de origen con `stick-table`, se perdería salvo que se sincronice entre los dos (en HAProxy, con `peers`).',
    },
    {
      t: 'p',
      md: 'La alternativa de fondo es no necesitar persistencia: **servidores sin estado** y una **sesión compartida**, una práctica habitual de diseño, sin fuente normativa. Los datos de sesión se guardan fuera de cada servidor, en un almacén común (una base de datos o una caché de sesiones a la que acceden todos los miembros), y cualquier servidor puede atender cualquier petición. Entonces el balanceador reparte con libertad, la caída de un miembro no desconecta a nadie y añadir servidores no remezcla sesiones. El precio: el almacén compartido es una pieza más, que también tiene que estar en alta disponibilidad para no convertirse en el nuevo punto único de fallo, y hay que cambiar la aplicación. Por eso muchas organizaciones, como el Consorcio hoy, siguen con la persistencia por *cookie* mientras la aplicación guarde la sesión en memoria.',
    },
    {
      t: 'check',
      q: {
        q: 'SEDE1 se apaga por una avería. Un ciudadano con la cookie de persistencia que apunta a SEDE1 envía su siguiente petición. ¿Qué ocurre, con la configuración actual del Consorcio?',
        choices: [
          'El ADC lo manda a SEDE2 y su trámite continúa, porque la cookie de persistencia guarda la sesión de la aplicación',
          'El ADC lo manda a SEDE2, pero SEDE2 no tiene su sesión, que estaba en la memoria de SEDE1: tiene que volver a identificarse',
          'El ADC espera a que SEDE1 vuelva, porque la persistencia por cookie no admite otro servidor',
          'El navegador borra la cookie y pide otra dirección IP al DNS',
        ],
        answer: 1,
        explain:
          'La cookie que inserta el ADC solo dice a qué servidor ir; los datos de la sesión estaban en la memoria de SEDE1 y se pierden con él. Lo tentador es creer que la cookie de persistencia contiene la sesión, pero no es así. Evitar esa pérdida exige una sesión compartida entre los servidores, no otro método de persistencia.',
      },
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'En el Consorcio de Arcedo: una persistencia por grupo',
      md: '**Grupo `sede`** (SEDE1 `10.20.72.91` y SEDE2 `10.20.72.92`, puerto 443): el ADC termina TLS, vuelve a cifrar hacia los servidores y **inserta una *cookie* de persistencia**, porque la aplicación guarda la sesión en la memoria de cada servidor. Por IP de origen no serviría: muchos ciudadanos y ayuntamientos llegan detrás de un NAT, y la carga caería entera en un solo servidor. La *cookie* lleva `Secure` (RFC 6265 §4.1.2.5: solo por canal seguro) y `HttpOnly` (§4.1.2.6: fuera del alcance de los scripts), porque solo viaja por HTTPS y ningún script la necesita. A SEDE1 y SEDE2 les llega la dirección del ciudadano en `Forwarded` o `X-Forwarded-For`, y solo la creen porque viene del ADC. **Grupo `www`** (WEB1 `10.20.72.81` y WEB2 `10.20.72.82`, puerto 80): la web informativa no tiene sesión de usuario, así que va **sin persistencia** y el ADC reparte por menos conexiones. Si un día la sede guardara la sesión en un almacén compartido, también podría prescindir de la *cookie*.',
    },
  ],
  quiz: [
    {
      id: 'op4m3q1',
      domain: 'Balanceo y alta disponibilidad',
      prompt:
        '¿Qué puede hacer un balanceador de capa 7 que termina TLS y que no puede hacer uno de capa 4 que reenvía el TLS sin descifrar?',
      choices: [
        'Repartir las conexiones entre los miembros de un grupo con un algoritmo de menos conexiones',
        'Ver el nombre que pide el cliente en la extensión SNI del saludo TLS',
        'Repartir por la ruta de la petición y leer o insertar cookies',
        'Usar una IP virtual compartida por varios servidores',
      ],
      answer: 2,
      explain:
        'La ruta, las cabeceras y las cookies van dentro de la petición HTTP cifrada: solo las ve quien termina TLS. El SNI tienta, pero viaja en el saludo TLS y un equipo de capa 4 puede leerlo sin descifrar (en HAProxy, req.ssl_sni en modo TCP). Los algoritmos de reparto y la IP virtual son propios de cualquier balanceador, también de capa 4.',
    },
    {
      id: 'op4m3q2',
      domain: 'Balanceo y alta disponibilidad',
      prompt:
        'Según la RFC 7239, ¿qué parámetro de la cabecera Forwarded indica el protocolo que usó el cliente, útil cuando el proxy inverso ha descifrado la conexión?',
      choices: [
        'for',
        'by',
        'host',
        'proto',
      ],
      answer: 3,
      explain:
        'proto (§5.4) lleva el protocolo, típicamente http o https, y sirve cuando el proxy hace la descarga del cifrado (*crypto offloader*, §5.4). for (§5.2) identifica al cliente; by (§5.1) es la interfaz del proxy por la que entró la petición, y host (§5.3) el valor original de la cabecera Host.',
    },
    {
      id: 'op4m3q3',
      domain: 'Balanceo y alta disponibilidad',
      prompt:
        '¿Qué afirmación sobre X-Forwarded-For es correcta?',
      choices: [
        'No es estándar: la RFC 7239 la describe como cabecera no estándar y define Forwarded en su lugar; además, solo es fiable lo que añadió un proxy de confianza',
        'La define la RFC 7239 y por eso los servidores pueden confiar en su primer elemento',
        'La define la especificación del protocolo PROXY de HAProxy',
        'Solo puede contener direcciones IPv4',
      ],
      answer: 0,
      explain:
        'La RFC 7239 §1 llama a X-Forwarded-For «non-standard» y §8.1 avisa de que cualquier nodo, incluido el cliente, puede alterar estas cabeceras. La segunda opción tienta porque mezcla la RFC correcta con un uso equivocado: el primer elemento puede venir inventado. El protocolo PROXY no es una cabecera HTTP, y X-Forwarded-For admite también IPv6, como en el ejemplo de conversión de la RFC.',
    },
    {
      id: 'op4m3q4',
      domain: 'Balanceo y alta disponibilidad',
      prompt:
        '¿Qué es el protocolo PROXY v2 y cuándo se usa?',
      choices: [
        'Una cabecera HTTP de la RFC 7239 para pasar la IP del cliente a través de un proxy inverso',
        'Una especificación de HAProxy, binaria, que antepone las direcciones originales al principio de cada conexión; la usa sobre todo un balanceador de capa 4 que quiere que el servidor conozca la IP del cliente',
        'Un estándar IETF de texto, de como máximo 107 caracteres, que el servidor detecta automáticamente',
        'La versión del protocolo HTTP que usan los balanceadores entre sí',
      ],
      answer: 1,
      explain:
        'La v2 es binaria (firma fija de 12 bytes) y la v1 es de texto, con un máximo de 107 caracteres; las dos son de la especificación de HAProxy Technologies, no del IETF. La tercera opción tienta porque mezcla datos reales de la v1 con dos errores: no es un estándar y el receptor no debe autodetectarla, sino esperarla por configuración y solo de fuentes conocidas. Forwarded sí es la cabecera de la RFC 7239, pero eso es HTTP, no el protocolo PROXY.',
    },
    {
      id: 'op4m3q5',
      domain: 'Balanceo y alta disponibilidad',
      prompt:
        'Una organización balancea su aplicación con persistencia por IP de origen. Un día descubre que casi toda la carga cae en un solo servidor. ¿Cuál es la causa más probable?',
      choices: [
        'Que los clientes usan TLS 1.3 y el identificador de sesión ya no existe',
        'Que el balanceador inserta una cookie de sesión que el navegador borra al cerrarse',
        'Que la cabecera Host de las peticiones es siempre la misma',
        'Que muchos usuarios llegan desde unas pocas direcciones por estar detrás de NAT, y la persistencia por IP los manda a todos al mismo miembro',
      ],
      answer: 3,
      explain:
        'Con NAPT (RFC 3022 §2.2) muchos equipos comparten una dirección; para la persistencia por IP son un único cliente y van al mismo servidor. AWS lo advierte en su NLB, y con ip_hash de NGINX el efecto crece porque usa solo los tres primeros octetos. Lo de TLS 1.3 afecta a la persistencia por identificador de sesión TLS, y la cookie al método por cookie, no al de IP. Que el Host sea igual es normal si es un solo sitio.',
    },
    {
      id: 'op4m3q6',
      domain: 'Balanceo y alta disponibilidad',
      prompt:
        'En HAProxy (valor del fabricante), ¿qué diferencia hay entre «cookie SRV insert» y «cookie SRV prefix»?',
      choices: [
        'Con insert, HAProxy añade su propia cookie de persistencia; con prefix, antepone el identificador del servidor a una cookie que ya crea la aplicación y lo quita en las peticiones',
        'Con insert la cookie caduca a los 7 días; con prefix, al cerrar el navegador',
        'Con insert la cookie la crea la aplicación; con prefix, la crea HAProxy',
        'Las dos son iguales; prefix es el nombre antiguo de insert',
      ],
      answer: 0,
      explain:
        'insert crea una cookie del balanceador (de sesión, no se guarda en disco); prefix aprovecha la cookie de la aplicación y le antepone el identificador del servidor. La tercera opción invierte los papeles: la cookie de la aplicación se aprovecha en prefix y en rewrite. Los 7 días no salen de HAProxy: son la caducidad de la cookie AWSALB del ALB de AWS.',
    },
    {
      id: 'op4m3q7',
      domain: 'Balanceo y alta disponibilidad',
      prompt:
        'Un balanceador persiste por cookie. El servidor que guardaba en memoria la sesión de un usuario se avería. ¿Qué cambio de diseño evita que el usuario pierda su sesión en un caso así?',
      choices: [
        'Cambiar a persistencia por IP de origen, que sobrevive a la caída del servidor',
        'Alargar la caducidad de la cookie de persistencia',
        'Guardar las sesiones en un almacén compartido por todos los servidores, para que cualquiera pueda atender cualquier petición',
        'Activar el protocolo PROXY entre el balanceador y los servidores',
      ],
      answer: 2,
      explain:
        'Mientras la sesión viva en la memoria de un servidor, se pierde con él, sea cual sea el método de persistencia; con una sesión compartida los servidores no tienen estado y la caída de uno no desconecta a nadie (aunque el almacén tiene que estar también en alta disponibilidad). Cambiar a IP de origen tienta, pero solo cambia cómo se reconoce al cliente, no dónde está la sesión. La caducidad de la cookie y el protocolo PROXY no tienen nada que ver con dónde se guardan los datos.',
    },
    {
      id: 'op4m3q8',
      domain: 'Balanceo y alta disponibilidad',
      prompt:
        'En el ADC del Consorcio, el grupo sede tiene persistencia por cookie insertada y el grupo www no tiene persistencia. ¿Por qué esa diferencia?',
      choices: [
        'Porque el grupo www usa el puerto 80 y la persistencia solo funciona en el 443',
        'Porque la aplicación de la sede guarda la sesión en la memoria de cada servidor, mientras que la web informativa no tiene sesión de usuario que conservar',
        'Porque la RFC 6265 prohíbe las cookies en sitios de categoría BÁSICA',
        'Porque el grupo www está detrás del NAT de los 200 puestos de la sede',
      ],
      answer: 1,
      explain:
        'La persistencia solo hace falta si el servidor guarda estado del usuario: la sede lo guarda en memoria, la web informativa no, y por eso esta se reparte por menos conexiones. El puerto 80 es el que usan WEB1 y WEB2 detrás del ADC, que ya ha terminado TLS, y no impide nada. La RFC 6265 no dice nada de categorías del ENS, y el PAT de los 200 puestos afecta a su salida a Internet, no a cómo se reparte el grupo www.',
    },
  ],
};
