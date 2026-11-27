import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// OP4M5 — Descarga de TLS y publicación de aplicaciones: terminación, recifrado,
// paso directo, SNI, ALPN, TLS mutuo y publicación tras una sola dirección
// ---------------------------------------------------------------------------
export const OP4_M5: Module = {
  id: 'op4m5',
  sectionId: 'op4',
  title: 'Descarga de TLS y publicación de aplicaciones',
  minutes: 24,
  objectives: [
    'Distinguir terminación (descarga), recifrado y paso directo de TLS en un balanceador y valorar qué gana y qué pierde cada modo: coste criptográfico, inspección, reparto en capa 7, cookies, confidencialidad hasta el servidor y dónde están las claves',
    'Explicar cómo SNI (RFC 6066) y ALPN (RFC 7301) permiten servir varios nombres y protocolos tras una sola dirección y un solo puerto, y qué cambia cuando el cliente usa ECH (RFC 9849)',
    'Describir la autenticación mutua de TLS 1.3 según la RFC 9846 y cómo llega el certificado del cliente al servidor de aplicación cuando el TLS termina en un proxy (cabecera Client-Cert, RFC 9440)',
    'Justificar el diseño de publicación del Consorcio: un único punto expuesto, recifrado para la sede y descarga para la web informativa, y las cabeceras que necesitan los servidores de detrás',
    'Situar el DNS round robin (RFC 1794), el balanceo global (GSLB) y el anycast (RFC 4786) como reparto entre sitios, algo que el Consorcio, con un solo operador y un solo CPD, no tiene',
  ],
  blocks: [
    {
      t: 'p',
      md: 'Hasta ahora el bloque ha tratado al balanceador como el equipo que reparte peticiones y vigila a sus servidores. Falta una pregunta que en la práctica decide casi todo lo demás: **qué hace con el cifrado**. Casi todo lo que se publica hoy va por HTTPS, y un balanceador que no puede leer la petición no puede repartir por `Host`, ni insertar una *cookie*, ni inspeccionar nada. En el Consorcio Provincial de Arcedo el encaminador reenvía el puerto **443** de la única dirección pública, `203.0.113.10`, a la dirección virtual (VIP, *virtual IP*) `10.20.72.70:443`, que comparten los dos balanceadores del CPD, ADC1 `10.20.72.71` y ADC2 `10.20.72.72` (ADC, *Application Delivery Controller*, en activo-pasivo). Detrás de ese único puerto hay dos nombres, `www.arcedo.example` y `sede.arcedo.example`, y cada uno recibe un trato distinto. Esta lección explica por qué.',
    },
    { t: 'h', text: 'Tres formas de tratar el TLS en el balanceador' },
    {
      t: 'table',
      headers: ['Modo', 'Dónde termina el TLS del cliente', 'Qué hay entre el balanceador y el servidor', 'En el Consorcio'],
      rows: [
        ['**Terminación** o **descarga** (*TLS offload*; la RFC 7239 §1 habla de «crypto offload»)', 'En el balanceador', 'HTTP en claro', 'Grupo `www`: WEB1 `10.20.72.81` y WEB2 `10.20.72.82`, puerto **80**'],
        ['**Recifrado** (en algunos productos, *TLS bridging*)', 'En el balanceador', 'Una **segunda** sesión TLS, que abre el propio balanceador', 'Grupo `sede`: SEDE1 `10.20.72.91` y SEDE2 `10.20.72.92`, puerto **443**'],
        ['**Paso directo** (*TLS passthrough*)', 'En el **servidor**: el balanceador no descifra', 'La misma sesión TLS del cliente, de extremo a extremo', 'No se usa; sirve de comparación'],
      ],
    },
    {
      t: 'p',
      md: 'Los nombres «recifrado», *bridging* y *passthrough* son de uso habitual en los productos, no de una norma; lo que sí recogen las RFC es la figura: la RFC 9440 §1 llama **TLS terminating reverse proxy** (TTRP) al proxy inverso que termina el TLS del cliente, y la RFC 9110 §3.7 dice que un *gateway* (proxy inverso) puede hablar hacia dentro con el protocolo que quiera y que, si habla HTTP con los servidores, en esa conexión **se comporta como cliente**. Eso describe bien el recifrado: hacia fuera, el ADC es el servidor de `sede.arcedo.example`; hacia dentro, es un cliente TLS de SEDE1 o SEDE2. En la **terminación**, el ADC descifra y entrega HTTP sin cifrar; en el **paso directo**, solo ve una conexión TCP con bytes cifrados y reparte como un balanceador de capa 4 (lección `op4m2`).',
    },
    {
      t: 'table',
      headers: ['Qué se mira', 'Terminación (descarga)', 'Recifrado', 'Paso directo'],
      rows: [
        ['**Trabajo criptográfico**', 'Todo en el balanceador: los servidores solo hablan HTTP', 'Doble: el balanceador descifra y vuelve a cifrar, y el servidor también cifra', 'Todo en los servidores; el balanceador no descifra'],
        ['**Ver la petición HTTP** (reparto por `Host` y por ruta, inspección)', 'Sí', 'Sí', 'No: solo la conexión TCP y lo que va en claro en el saludo TLS (SNI, ALPN)'],
        ['**Cookies de persistencia** insertadas por el balanceador (lección `op4m3`)', 'Sí', 'Sí', 'No: queda la persistencia por IP de origen'],
        ['**Confidencialidad hasta el servidor**', 'No: el último tramo, dentro del CPD, va en claro', 'Sí, pero el tráfico está en claro **dentro** del balanceador', 'Sí, de extremo a extremo'],
        ['**Dónde están las claves privadas** del certificado público', 'En el balanceador', 'En el balanceador; los servidores tienen además las suyas para la sesión interna', 'En **cada** servidor del grupo'],
        ['**Certificado del cliente** (TLS mutuo)', 'Lo valida el balanceador y lo pasa en una cabecera', 'Igual: la sesión interna es del balanceador, no del cliente', 'Lo pide y lo valida el propio servidor'],
      ],
    },
    {
      t: 'p',
      md: 'Ninguna fila es gratis. La **descarga** concentra el trabajo criptográfico y las claves en un solo sitio, lo que simplifica renovar certificados y libera a los servidores, y le da al balanceador toda la información de la capa 7. A cambio, el tramo entre el balanceador y el servidor va **sin cifrar**. El **recifrado** conserva las ventajas de leer HTTP y cifra también ese tramo, a costa de hacer el trabajo dos veces y de que el balanceador siga viendo todo en claro. El **paso directo** es el único que mantiene la confidencialidad de extremo a extremo y deja las claves solo en los servidores, pero convierte al balanceador en un repartidor de conexiones: ni `Host`, ni *cookies*, ni inspección. Y la persistencia que queda tampoco puede apoyarse en el identificador de sesión TLS: ese método lee campos de TLS 1.2, y la RFC 9846 §2.2 dice que los *session IDs* y los *session tickets* de TLS 1.2 quedan obsoletos en TLS 1.3, que reanuda con una clave precompartida (PSK, *pre-shared key*).',
    },
    {
      t: 'check',
      q: {
        q: 'Alguien propone pasar el grupo `sede` a paso directo «para que las claves privadas de la sede no estén en el balanceador». ¿Qué implica ese cambio para las claves?',
        choices: [
          'Ninguno: el ADC seguiría guardando la clave, porque es quien presenta el certificado al cliente',
          'La clave privada del certificado de `sede.arcedo.example` tendría que estar en SEDE1 y en SEDE2, que pasarían a terminar el TLS del cliente',
          'Las claves pasarían a la pareja de ADC y a los servidores a la vez, como en el recifrado',
          'Con paso directo no hace falta certificado, porque el ADC ya autentica al servidor',
        ],
        answer: 1,
        explain:
          'En el paso directo el balanceador no descifra: el TLS del cliente llega hasta el servidor, así que cada servidor del grupo presenta el certificado y guarda su clave. La primera opción describe la terminación o el recifrado, donde el ADC sí presenta el certificado. Tener claves en los dos sitios es lo propio del recifrado, no del paso directo.',
      },
    },
    { t: 'h', text: 'SNI y ALPN: varios nombres y protocolos detrás de una dirección' },
    {
      t: 'p',
      md: 'Si `www` y `sede` llegan a la misma dirección y al mismo puerto, ¿cómo sabe el ADC qué certificado presentar **antes** de haber descifrado nada? Con **SNI** (*Server Name Indication*). La RFC 6066 §3 lo explica así: TLS no tenía forma de decir a qué nombre se conectaba el cliente, y eso hace falta para servir varios servidores «virtuales» en una sola dirección de red. El cliente **puede** (MAY) incluir la extensión `server_name` en el ClientHello, con un solo nombre por tipo y **solo nombres DNS** (`host_name(0)`), en ASCII y sin punto final; **no** admite direcciones IPv4 ni IPv6 literales. Si el nombre no le suena, el servidor puede abortar con la alerta `unrecognized_name(112)` o seguir adelante. En TLS 1.3, cuya referencia es ahora la **RFC 9846** (julio de 2026, que deja obsoleta a la 8446), la extensión `server_name` guía la elección del certificado del servidor y el cliente **debería** (SHOULD) enviarla si el servidor se identifica por nombre (§4.5.1.2; era la §4.4.2.2 en la 8446). Además, toda implementación **debe** (MUST) soportarla, y el servidor puede exigirla y cerrar con `missing_extension` si falta (§9.2).',
    },
    {
      t: 'p',
      md: '**ALPN** (*Application-Layer Protocol Negotiation*, RFC 7301) resuelve el problema hermano: varios protocolos de aplicación en el mismo puerto. Cliente y servidor eligen el protocolo **dentro del saludo TLS**, sin viajes adicionales, y eso permite incluso escoger certificado según el protocolo (§1). La extensión es `application_layer_protocol_negotiation(16)`: el cliente lista sus protocolos por orden de preferencia y el servidor devuelve **exactamente uno** (§3.1); si no hay ninguno en común, alerta `no_application_protocol(120)` (§3.2). Los identificadores son cadenas como `http/1.1` o `h2`, el de HTTP/2 sobre TLS (RFC 9113 §3.1). Y un detalle que importa para el paso directo: la negociación ALPN va **en claro** (§4), igual que el SNI sin ECH.',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Una conexión a la sede, paso a paso (esquema ilustrativo, sin sintaxis de fabricante)',
      text: `Navegador  ->  203.0.113.10:443
              (el encaminador reenvía el 443 a la VIP 10.20.72.70:443)

ClientHello (en claro):
  server_name = sede.arcedo.example        <- SNI, RFC 6066 §3
  ALPN        = h2, http/1.1               <- lista del navegador, por preferencia

ADC activo (pareja ADC1 10.20.72.71 / ADC2 10.20.72.72):
  1. Por el SNI presenta el certificado de sede.arcedo.example
     (instalado en el ADC, emisor ca.example)
  2. Por ALPN elige uno de los protocolos que tenga configurados
  3. Termina el TLS y lee la petición:  Host: sede.arcedo.example
  4. Grupo sede -> SEDE1 10.20.72.91:443 o SEDE2 10.20.72.92:443
     con una sesión TLS nueva, abierta por el ADC (recifrado)

Si el SNI y el Host son www.arcedo.example:
  certificado de www -> grupo www -> WEB1 10.20.72.81:80 o WEB2 10.20.72.82:80
  (HTTP sin cifrar: descarga)`,
    },
    {
      t: 'p',
      md: 'Fíjate en que el ADC del Consorcio mira **las dos cosas**, el SNI para el certificado y el `Host` para el grupo. No es redundancia. La RFC 9113 §9.1.1 permite que un navegador **reutilice** una conexión HTTP/2 para otro origen si el certificado también lo cubre, y avisa de que un intermediario que termina TLS y **elige el servidor por el SNI** puede acabar mandando peticiones al servidor equivocado; quien no quiera esa reutilización responde **421 Misdirected Request**. Por eso, cuando el TLS termina en el balanceador, se reparte por `Host` (HAProxy, en la documentación de su parámetro `sni`, recuerda lo mismo: valor del fabricante). Los dos certificados públicos están instalados en la pareja de ADC y los emite `ca.example`, la autoridad que el registro **CAA** (*Certification Authority Authorization*) de la zona `arcedo.example` autoriza a emitir certificados (lección `op3m1`). Y un caso que conviene tener presente: quien escribe `https://203.0.113.10` en el navegador no puede enviar SNI, porque la extensión no admite direcciones IP. Qué certificado le presenta entonces el balanceador depende del producto.',
    },
    {
      t: 'p',
      md: 'En **paso directo** el balanceador también puede repartir por nombre, porque el SNI y la lista ALPN viajan en claro en el ClientHello. Lo documentan los fabricantes (valor del fabricante): en NGINX, el módulo `ssl_preread` lee el ClientHello **sin terminar TLS** y deja el SNI en `$ssl_preread_server_name` y los protocolos en `$ssl_preread_alpn_protocols`, para elegir el grupo de servidores por nombre o por protocolo; no viene compilado por defecto (`--with-stream_ssl_preread_module`). En HAProxy, en modo `tcp`, `req.ssl_sni` hace lo mismo sin descifrar.',
    },
    {
      t: 'callout',
      kind: 'warn',
      title: 'ECH: el SNI deja de ir en claro',
      md: '**ECH** (*Encrypted Client Hello*) ya es la **RFC 9849** (marzo de 2026), no un borrador. Parte de una constatación: en TLS 1.3 el SNI en claro es «perhaps the most sensitive information left unencrypted» (§1). ECH cifra el ClientHello con la clave pública del servidor y protege el SNI y la lista ALPN. El cliente envía un ClientHello **exterior** en el que **debería** (SHOULD) poner como `server_name` el `public_name`, que es el nombre DNS del servidor que da la cara (*client-facing server*), y el nombre real va cifrado dentro (§4 y §6.1). La RFC describe dos topologías (§3.1): **Shared Mode**, en la que el proveedor termina el TLS de todos los dominios, y **Split Mode**, en la que el *client-facing server* reenvía la conexión a un *backend server* que es quien termina el TLS. La consecuencia para el balanceo es una deducción, no una frase de la RFC: un equipo que reparte por SNI **sin descifrar** ya no ve el nombre real, sino el `public_name`, salvo que sea él mismo el *client-facing server*. Y ECH por sí solo no oculta el destino: la consulta DNS o la dirección IP pueden delatarlo.',
    },
    {
      t: 'check',
      q: {
        q: 'Un técnico prueba la publicación escribiendo `https://203.0.113.10` en el navegador. ¿Por qué en esa conexión el ADC no puede elegir el certificado por nombre, como hace con `sede.arcedo.example`?',
        choices: [
          'Porque TLS 1.3 eliminó la extensión server_name y el ADC elige siempre el primer certificado',
          'Porque ALPN solo negocia el certificado cuando el cliente usa HTTP/2',
          'Porque el puerto 443 reenviado por NAT impide que el SNI llegue a la VIP',
          'Porque el SNI solo transporta nombres DNS: con una dirección IP en la URL el navegador no envía nombre que el ADC pueda usar',
        ],
        answer: 3,
        explain:
          'La RFC 6066 §3 limita server_name a nombres DNS y prohíbe las direcciones IP literales, así que el ADC no recibe nombre y qué certificado presenta depende del producto. TLS 1.3 no eliminó el SNI: la RFC 9846 §9.2 obliga a soportarlo. ALPN negocia el protocolo, no el nombre, y el reenvío de puertos no toca el contenido del ClientHello.',
      },
    },
    { t: 'h', text: 'TLS mutuo: cuando el servidor también pide certificado' },
    {
      t: 'p',
      md: 'En el TLS habitual solo se autentica el servidor. En el **TLS mutuo** (*mutual TLS*) el servidor también exige al cliente un certificado. En TLS 1.3 lo hace con el mensaje **CertificateRequest**: un servidor que se autentica con certificado **puede** (MAY) pedir otro al cliente; el mensaje va después de `EncryptedExtensions` y lleva la extensión `signature_algorithms` (RFC 9846 §4.4.2, que era la §4.3.2 en la 8446). El problema aparece cuando el TLS termina en un proxy: la RFC 9440 §1 describe el patrón habitual, con el servidor de aplicación detrás de un proxy inverso que termina TLS, de modo que la conexión TLS del cliente **solo llega hasta el proxy**. Si la aplicación necesita saber quién se ha autenticado, el proxy tiene que pasarle los datos del certificado, y la RFC 9440 define para eso dos cabeceras: **`Client-Cert`**, con el certificado de entidad final, y **`Client-Cert-Chain`**, opcional, con la cadena. Ojo con su estado: la RFC 9440 es **INFORMATIONAL**, no una norma de obligado cumplimiento.',
    },
    {
      t: 'table',
      headers: ['Modo', 'Quién envía el CertificateRequest al cliente', 'Cómo conoce la aplicación el certificado del cliente'],
      rows: [
        ['Terminación', 'El balanceador', 'Por una cabecera que añade el balanceador, como `Client-Cert` (RFC 9440)'],
        ['Recifrado', 'El balanceador', 'También por cabecera: la sesión TLS interna la abre el balanceador, así que en ella no viaja el certificado del cliente'],
        ['Paso directo', 'El propio servidor', 'Lo ve en su propia sesión TLS; no hace falta cabecera'],
      ],
    },
    {
      t: 'p',
      md: 'Una cabecera así solo vale lo que valga quien la escribe. La RFC 7239 §8.1 lo dice de `Forwarded`: cualquier nodo del camino, incluido el cliente, puede alterarla. La misma prudencia sirve aquí: el servidor de aplicación solo debería aceptar `Client-Cert` cuando la petición viene de su proxy, y (por la misma lógica que la RFC 7239 §8.1) el proxy debería quitar la que traiga el cliente. En el escenario del Consorcio **no consta** que la sede pida certificado de cliente; si algún día lo hiciera, con el recifrado actual sería el ADC quien enviase el CertificateRequest y pasase el resultado a SEDE1 y SEDE2 en una cabecera (es un supuesto, no el diseño vigente).',
    },
    {
      t: 'check',
      q: {
        q: 'Supón que la sede empezara a pedir certificado de cliente y que el grupo `sede` siguiera con recifrado. ¿Cómo sabría SEDE1 qué certificado presentó la persona?',
        choices: [
          'Por una cabecera que añade el ADC, como Client-Cert (RFC 9440), porque la sesión TLS que llega a SEDE1 la abre el ADC',
          'Por su propia sesión TLS: en el recifrado el certificado del cliente pasa intacto hasta el servidor',
          'Por la lista ALPN, que incluye el certificado del cliente',
          'Por la cabecera X-Forwarded-For, que lleva la dirección y el certificado del cliente',
        ],
        answer: 0,
        explain:
          'En el recifrado hay dos sesiones TLS: la del cliente termina en el ADC y la interna la abre el ADC como cliente de SEDE1, así que el certificado de la persona no viaja en ella y hay que pasarlo en una cabecera como Client-Cert. La segunda opción tienta porque hay TLS hasta el servidor, pero no es el mismo TLS. ALPN negocia el protocolo y X-Forwarded-For solo lleva direcciones.',
      },
    },
    { t: 'h', text: 'Publicar aplicaciones: un solo punto expuesto' },
    {
      t: 'p',
      md: 'La RFC 9110 §3.7 define el *gateway*, «a.k.a. "reverse proxy"», como el intermediario que actúa hacia fuera como servidor de origen y reenvía hacia dentro, entre otras cosas para repartir la carga entre varias máquinas. Ese es el papel del ADC en la publicación: **es lo único que se ve desde Internet**. El encaminador solo reenvía el puerto 443 de `203.0.113.10` a la VIP `10.20.72.70`; WEB1, WEB2, SEDE1 y SEDE2 no tienen reenvío propio, y quien llega desde fuera nunca habla directamente con ellos (el correo sigue con su propio reenvío de puertos, como en el bloque de servicios). Es la forma de publicar varias aplicaciones con una sola dirección pública: en lugar de un puerto por servidor, un único punto que distingue por nombre. La práctica habitual es colocar el proxy inverso en una **DMZ** (zona desmilitarizada), una red perimetral separada de la interna (Security+, lección `sp3m4`); en el Consorcio, el canon no fija ninguna DMZ: la pareja de ADC está en el CPD, con su VIP en `10.20.72.0/21`.',
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'En el Consorcio de Arcedo: por qué la sede se recifra y la web no',
      md: 'La **web informativa** (`www`) es un sistema de categoría **BÁSICA**: su información es pública y no tiene nivel en confidencialidad; integridad, autenticidad y disponibilidad, en BAJO. La **sede electrónica** (`sede`) es **MEDIA**, con C, I, A y D en MEDIO y T en BAJO (lecciones `op6m2` y `op6m3`). En la tabla de medidas del ENS, `mp.com.2` Protección de la confidencialidad se exige **por la dimensión C**: con C MEDIO, «aplica» más el refuerzo R1; la web no tiene nivel en C. `mp.com.3` Protección de la integridad y de la autenticidad se exige por I y A y toca a los dos sistemas (BAJO: aplica; MEDIO: + R1 + R2). La tabla, sin embargo, **no dice** «recifra entre el balanceador y el servidor»: eso es una **decisión del Consorcio**, que cifra también el tramo interno para el sistema que maneja información con confidencialidad MEDIO y descarga el TLS de la web, cuyo contenido es público. Lo mismo con la protección de las aplicaciones web: `mp.s.2` Protección de servicios y aplicaciones web se exige por categoría (BÁSICA y MEDIA: + [R1 o R2]); cualquier control que tenga que leer la petición HTTP, como un cortafuegos de aplicaciones web (WAF, *Web Application Firewall*, en Security+), solo puede funcionar donde el TLS ya está descifrado, es decir, con terminación o recifrado.',
    },
    {
      t: 'p',
      md: 'Descargar el TLS tiene un efecto que los servidores notan: WEB1 y WEB2 reciben **HTTP en el puerto 80** desde el balanceador, sin saber que el cliente usó HTTPS ni cuál era su dirección. La RFC 7239 §1 lo describe así: los proxies de la infraestructura del servidor, como el balanceo o el «crypto offload», hacen que las peticiones parezcan venir **de la dirección del proxy**. La cabecera estándar para devolver esa información es `Forwarded`, con el parámetro **`for`** (el cliente, §5.2) y el parámetro **`proto`**, pensado precisamente para cuando el proxy inverso hace de «crypto offloader» (§5.4). `X-Forwarded-For` y `X-Forwarded-Proto` hacen lo mismo, pero la propia RFC 7239 las llama «non-standard». Si la aplicación no sabe que el cliente vino por HTTPS, puede generar enlaces `http://` o redirigir en bucle. Las cabeceras, el protocolo PROXY y la persistencia se tratan en la lección `op4m3`.',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Lo que recibe WEB1 tras la descarga (ejemplo; 192.0.2.43 es una dirección de documentación)',
      text: `ADC activo  ->  WEB1 10.20.72.81:80   (HTTP sin cifrar dentro del CPD)

  GET /noticias HTTP/1.1
  Host: www.arcedo.example
  Forwarded: for=192.0.2.43;proto=https

Sin Forwarded, WEB1 solo vería la dirección del balanceador
y una petición HTTP en el puerto 80.`,
    },
    {
      t: 'check',
      q: {
        q: 'Tras la descarga del TLS, la aplicación de WEB1 genera enlaces que empiezan por http:// aunque la persona entró por https. ¿Qué le falta?',
        choices: [
          'El certificado de www instalado en WEB1, porque sin él no sabe que la conexión fue cifrada',
          'Que el ADC le indique el protocolo original, por ejemplo con Forwarded y su parámetro proto=https (RFC 7239 §5.4)',
          'Que el ADC le pase la lista ALPN del cliente en una cabecera Client-Cert',
          'Cambiar WEB1 al puerto 443 sin cifrado, para que la aplicación lo interprete como HTTPS',
        ],
        answer: 1,
        explain:
          'Con la descarga, WEB1 solo ve HTTP desde el balanceador; la RFC 7239 prevé el parámetro proto justo para cuando el proxy inverso hace de crypto offloader. Instalar el certificado en WEB1 no sirve si el TLS termina en el ADC. Client-Cert lleva el certificado del cliente, no el protocolo, y el número de puerto no cambia lo que la aplicación sabe del cliente.',
      },
    },
    {
      t: 'check',
      q: {
        q: 'Una auditora pregunta por qué el tráfico entre el ADC y WEB1 va sin cifrar y el que va a SEDE1 no. ¿Qué respuesta se ajusta a lo que dice el ENS?',
        choices: [
          'El ENS prohíbe cifrar el tráfico interno de los sistemas de categoría BÁSICA',
          'El ENS obliga a recifrar en todos los sistemas MEDIA y lo prohíbe en los BÁSICA',
          'Es una decisión del Consorcio: mp.com.2 se exige por la confidencialidad, la sede tiene C MEDIO y la web no tiene nivel en C, pero la tabla no prescribe cómo cifrar ese tramo',
          'Es una limitación técnica: con SNI solo se puede recifrar uno de los nombres que comparten dirección',
        ],
        answer: 2,
        explain:
          'La tabla de medidas asigna mp.com.2 por la dimensión C, y ahí la sede (C MEDIO) y la web (sin nivel en C) son distintas; el recifrado es la forma que ha elegido el Consorcio de responder a esa diferencia. Ni prohíbe cifrar en BÁSICA ni nombra el recifrado. SNI no limita nada: el ADC distingue los dos nombres y trata cada grupo como se configure.',
      },
    },
    {
      t: 'links',
      title: 'Lo que ya está explicado en otras lecciones',
      items: [
        { label: 'PKI, certificados y cadena de confianza (Security+, lección sp1m7)', href: '/learn/sp1m7' },
        { label: 'Proxy inverso, DMZ y colocación de equipos (Security+, lección sp3m4)', href: '/learn/sp3m4' },
        { label: 'WAF y comunicación segura con TLS (Security+, lección sp3m5)', href: '/learn/sp3m5' },
        { label: 'Proxy directo e inverso, Via y Forwarded (lección op3m5)', href: '/learn/op3m5' },
        { label: 'El registro CAA de arcedo.example (lección op3m1)', href: '/learn/op3m1' },
        { label: 'Balanceo en capa 7, cabeceras y persistencia (lección op4m3)', href: '/learn/op4m3' },
        { label: 'Categorías y dimensiones del ENS (lección op6m2)', href: '/learn/op6m2' },
        { label: 'Medidas de seguridad del ENS (lección op6m3)', href: '/learn/op6m3' },
      ],
    },
    { t: 'h', text: 'Otra red: repartir entre sitios' },
    {
      t: 'callout',
      kind: 'story',
      title: 'Otra red, no el Consorcio',
      md: 'Todo lo anterior reparte **dentro de un sitio**: una dirección pública, una pareja de balanceadores, un CPD. El Consorcio tiene un solo operador, una sola dirección pública y ningún CPD de respaldo, así que lo que sigue **no existe en Arcedo**: es lo que se encuentra en organizaciones con varios sitios. El **DNS *round robin*** reparte devolviendo varias direcciones para un mismo nombre; la RFC 1794 (INFORMATIONAL, 1995) cuenta que el «Round Robin» de BIND las ordenaba por turnos **sin mirar la carga**, que para datos que cambian hacen falta TTL muy bajos, que su implementación de ejemplo rotaba las direcciones cada **300 s** y que BIND trataba entonces un TTL por debajo de 300 s como «irrational». El **GSLB** (*Global Server Load Balancing*) es un nombre de producto, **sin RFC** que lo defina: la idea, en términos generales y sin definición normativa, es que el DNS responda con la dirección de un sitio u otro según su estado. El ***anycast*** (RFC 4786, mejor práctica vigente BCP 126, *Best Current Practice*) publica **la misma dirección de servicio en varios sitios** y deja que el encaminamiento lleve cada datagrama a uno de ellos.',
    },
    {
      t: 'table',
      headers: ['Mecanismo (otra red)', 'Fuente', 'Cómo reparte', 'Lo que hay que saber'],
      rows: [
        ['**DNS *round robin***', 'RFC 1794 (INFORMATIONAL)', 'Varias direcciones para un nombre, en orden rotatorio', 'El de BIND no miraba la carga; para datos que cambian, TTL muy bajos (§4–§5)'],
        ['**GSLB**', 'Sin RFC: término de producto', 'El DNS elige qué sitio devolver', 'Sin RFC; no se ha consultado documentación de fabricante, así que no hay criterios ni valores que citar'],
        ['***Anycast***', 'RFC 4786 (BCP 126)', 'La misma dirección anunciada en varios sitios; el encaminamiento elige', 'Bien para transacciones cortas, como DNS sobre UDP (§4.1); con TCP, un cambio de ruta o el reparto por caminos de igual coste (ECMP, *Equal-Cost Multi-Path*) puede llevar paquetes de una misma conexión a nodos distintos (§4.4.3). Cada nodo absorbe la denegación de servicio de su zona (§6.1)'],
      ],
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Lo que se confunde a menudo',
      md: '**Terminación = descarga** (*offload*): HTTP en claro hacia el servidor. **Recifrado**: dos sesiones TLS, el balanceador ve todo en claro en medio. **Paso directo**: un solo TLS de extremo a extremo; sin `Host`, sin *cookies*, sin inspección. Estos tres nombres son de producto; en las RFC, «crypto offload» (7239) y «TLS terminating reverse proxy» (9440). **TLS 1.3 es la RFC 9846** (julio de 2026), que deja obsoleta a la 8446 y renumera: CertificateRequest en §4.4.2. **SNI** (RFC 6066 §3): solo nombres DNS, nunca IP; alerta `unrecognized_name(112)`. **ALPN** (RFC 7301): el servidor devuelve exactamente uno; alerta `no_application_protocol(120)`; extensión 16; `h2` es HTTP/2. SNI y ALPN van en claro **salvo con ECH** (RFC 9849). **Con TLS terminado, reparte por `Host`**, no solo por SNI (RFC 9113 §9.1.1, código 421). **Client-Cert** y **Client-Cert-Chain**: RFC 9440, informativa. **`proto`** de `Forwarded` (RFC 7239) le dice al servidor que el cliente vino por HTTPS. **ENS:** `mp.com.2` va por C, `mp.com.3` por I y A, `mp.s.2` por categoría; ninguna fila dice «recifra». **GSLB** no tiene RFC; **DNS round robin**, RFC 1794; ***anycast***, RFC 4786 (BCP 126).',
    },
  ],
  quiz: [
    {
      id: 'op4m5q1',
      domain: 'Balanceo y alta disponibilidad',
      prompt:
        'Un organismo quiere que el TLS vaya del navegador al servidor de aplicación sin que ningún equipo intermedio vea la petición en claro, aunque haya un balanceador delante. ¿Qué modo debe configurar en el balanceador?',
      choices: [
        'Paso directo (passthrough): el balanceador reparte conexiones sin descifrar y el servidor termina el TLS',
        'Recifrado, porque hay TLS en los dos tramos',
        'Terminación con cabecera Forwarded, para que el servidor sepa que el cliente usó HTTPS',
        'Terminación con persistencia por cookie insertada, para que cada sesión vaya siempre al mismo servidor',
      ],
      answer: 0,
      explain:
        'Solo el paso directo mantiene un único TLS de extremo a extremo: el balanceador ve una conexión TCP y lo que va en claro en el saludo (SNI, ALPN). El recifrado tienta porque cifra los dos tramos, pero el balanceador descifra en medio y ve la petición. La terminación entrega HTTP en claro al servidor, con o sin Forwarded y cookies.',
    },
    {
      id: 'op4m5q2',
      domain: 'Balanceo y alta disponibilidad',
      prompt:
        'Al redactar el pliego de los balanceadores hay que citar la especificación vigente de TLS 1.3. ¿Cuál es?',
      choices: [
        'La RFC 5246, que sigue vigente para TLS 1.3',
        'La RFC 8446, la de agosto de 2018',
        'La RFC 9846, de julio de 2026, que deja obsoleta a la 8446',
        'La RFC 6066, porque define la extensión server_name',
      ],
      answer: 2,
      explain:
        'La RFC 9846 es la referencia actual de TLS 1.3 y deja obsoletas, entre otras, a la 8446 y a la 5246. La 8446 tienta porque fue TLS 1.3 durante años, pero ya figura como obsoleta. La 5246 era TLS 1.2, y la 6066 define extensiones como SNI, no el protocolo.',
    },
    {
      id: 'op4m5q3',
      domain: 'Balanceo y alta disponibilidad',
      prompt:
        'Según la RFC 6066 §3, ¿qué puede llevar la extensión server_name (SNI) que el cliente incluye en el ClientHello?',
      choices: [
        'Un nombre DNS o, si no lo hay, la dirección IPv4 o IPv6 del servidor',
        'Solo nombres DNS (host_name), en ASCII y sin punto final; no se permiten direcciones IP literales',
        'La lista de protocolos de aplicación que el cliente acepta, por orden de preferencia',
        'El certificado que el cliente espera recibir, para que el servidor lo elija',
      ],
      answer: 1,
      explain:
        'La RFC 6066 limita SNI a nombres DNS del tipo host_name(0), en ASCII y sin punto final, y prohíbe las direcciones IPv4 e IPv6 literales. La primera opción tienta porque parece una alternativa razonable, pero la norma la excluye expresamente. La lista de protocolos es ALPN, y el cliente no envía el certificado que espera.',
    },
    {
      id: 'op4m5q4',
      domain: 'Balanceo y alta disponibilidad',
      prompt:
        'Un cliente ofrece por ALPN solo «http/1.1» y el servidor solo tiene configurado «h2». ¿Qué ocurre según la RFC 7301?',
      choices: [
        'El servidor devuelve los dos protocolos y el cliente elige',
        'El servidor responde con la alerta unrecognized_name(112)',
        'La conexión sigue con HTTP/2, porque el servidor impone su protocolo',
        'No hay protocolo en común y el servidor responde con la alerta no_application_protocol(120)',
      ],
      answer: 3,
      explain:
        'En ALPN el servidor devuelve exactamente un protocolo de la lista del cliente (§3.1) y, si no hay coincidencia, envía no_application_protocol(120) (§3.2). unrecognized_name(112) tienta por la numeración, pero es la alerta de SNI cuando el nombre no se reconoce. El servidor no impone un protocolo que el cliente no ofreció.',
    },
    {
      id: 'op4m5q5',
      domain: 'Balanceo y alta disponibilidad',
      prompt:
        'En TLS 1.3, ¿cómo pide el servidor un certificado al cliente para la autenticación mutua, según la RFC 9846?',
      choices: [
        'Con el mensaje CertificateRequest (§4.4.2), que puede enviar un servidor que se autentica con certificado y que va después de EncryptedExtensions',
        'Con la extensión server_name, en la que el servidor indica qué certificado de cliente acepta',
        'Con la cabecera HTTP Client-Cert, que el servidor envía al cliente en la primera respuesta',
        'Con un NewSessionTicket, que obliga al cliente a presentar su certificado en el siguiente saludo',
      ],
      answer: 0,
      explain:
        'La RFC 9846 §4.4.2 (la §4.3.2 de la 8446) dice que un servidor que se autentica con certificado puede pedir uno al cliente con CertificateRequest, tras EncryptedExtensions. Client-Cert tienta porque también trata del certificado del cliente, pero es una cabecera que el proxy envía al servidor de aplicación (RFC 9440), no un mensaje de TLS. server_name es el SNI, y NewSessionTicket sirve para la reanudación con PSK.',
    },
    {
      id: 'op4m5q6',
      domain: 'Balanceo y alta disponibilidad',
      prompt:
        'La sede del Consorcio guarda la sesión en la memoria de cada servidor y depende de la cookie de persistencia que inserta el ADC. ¿Qué pasaría si el grupo sede pasara a paso directo?',
      choices: [
        'Nada: el ADC seguiría insertando la cookie dentro del flujo cifrado',
        'El ADC podría leer la cookie gracias a ssl_preread, que descifra el ClientHello',
        'El ADC ya no podría leer ni insertar cookies; solo le quedaría persistir por IP de origen, y si una persona cambia de servidor pierde la sesión',
        'La persistencia seguiría por identificador de sesión TLS, que es el método recomendado en TLS 1.3',
      ],
      answer: 2,
      explain:
        'Sin descifrar, el balanceador no ve las cabeceras HTTP, así que no puede insertar ni leer cookies; queda la persistencia por IP de origen, con sus fallos. ssl_preread tienta, pero solo lee lo que va en claro en el ClientHello (SNI y ALPN) y no descifra nada. La persistencia por identificador de sesión depende de campos de TLS 1.2 que la RFC 9846 §2.2 da por obsoletos.',
    },
    {
      id: 'op4m5q7',
      domain: 'Balanceo y alta disponibilidad',
      prompt:
        'En otra organización, con dos sitios, se reparte un nombre devolviendo dos direcciones por DNS round robin. Según la RFC 1794, ¿qué limitación tiene el «Round Robin» que describe?',
      choices: [
        'Solo funciona con TTL de más de 300 s, porque por debajo los resolutores descartan la respuesta',
        'Ordena las direcciones por turnos sin mirar la carga de los servidores',
        'Envía cada consulta al servidor menos cargado, pero no detecta servidores caídos',
        'Exige anycast en los dos sitios para que el DNS pueda rotar las direcciones',
      ],
      answer: 1,
      explain:
        'La RFC 1794 §2 cuenta que el Round Robin de BIND ordenaba los registros por turnos sin tener en cuenta la carga. La primera opción tienta por la cifra de 300 s, pero la RFC dice otra cosa: pide TTL muy bajos para datos volátiles y recuerda que BIND trataba entonces los TTL por debajo de 300 s como «irrational». El DNS round robin no mide carga ni necesita anycast.',
    },
    {
      id: 'op4m5q8',
      domain: 'Balanceo y alta disponibilidad',
      prompt:
        'Según la RFC 4786 (BCP 126), ¿para qué tipo de servicio encaja mejor el anycast y por qué?',
      choices: [
        'Para descargas largas por TCP, porque el encaminamiento garantiza que todos los paquetes lleguen al mismo nodo',
        'Para cualquier servicio, porque cada sitio tiene una dirección distinta y el cliente elige la más cercana',
        'Solo para redes locales, porque el anycast global no está permitido',
        'Para transacciones cortas como las consultas DNS sobre UDP, porque un cambio de ruta o un reparto ECMP puede partir una conexión TCP larga entre nodos distintos',
      ],
      answer: 3,
      explain:
        'La RFC 4786 explica que las transacciones cortas, como DNS sobre UDP, van bien, y que las largas son delicadas: con caminos de igual coste o cambios de ruta, los paquetes de una misma conexión pueden acabar en nodos distintos (§4.1 y §4.4.3). En anycast todos los sitios comparten la misma dirección, no una distinta, y la RFC contempla ámbito local y global.',
    },
  ],
};
