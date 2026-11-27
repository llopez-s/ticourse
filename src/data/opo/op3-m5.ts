import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// OP3M5 — Servicios de conectividad: proxies, PAC y WPAD, relés, IPAM y 802.1X
// ---------------------------------------------------------------------------
export const OP3_M5: Module = {
  id: 'op3m5',
  sectionId: 'op3',
  title: 'Servicios de conectividad: proxies, PAC y WPAD, IPAM y 802.1X',
  minutes: 22,
  objectives: [
    'Distinguir proxy directo, proxy inverso (gateway) y proxy de interceptación según la RFC 9110, y explicar cuándo el cliente sabe que hay un intermediario',
    'Explicar cómo habla un cliente con un proxy: absolute-form, método CONNECT, código 407 y cabeceras Via y Forwarded',
    'Leer un archivo PAC con FindProxyForURL y describir cómo descubre WPAD la configuración, por qué no es una norma y qué riesgos tiene',
    'Situar los relés y el reenvío como idea común a varios servicios y explicar qué gestiona una herramienta IPAM',
    'Describir el control de acceso a la red con 802.1X: suplicante, autenticador y servidor de autenticación, RADIUS en 1812/1813 y asignación de VLAN',
  ],
  blocks: [
    {
      t: 'p',
      md: 'Las lecciones anteriores del bloque han tratado los servicios que todo equipo necesita para arrancar: un nombre (DNS), una dirección (DHCP) y una hora (NTP). Esta reúne los que se colocan **en medio** del camino para controlarlo: el **proxy** por el que sale la navegación, el archivo que le dice al navegador qué proxy usar (**PAC**) y el mecanismo que intenta encontrarlo solo (**WPAD**), los **relés** que reenvían lo que no cruzaría un encaminador, la herramienta que lleva la cuenta de direcciones y zonas (**IPAM**) y el control que decide si un equipo puede usar la toma de red a la que se enchufa (**802.1X**). En el Consorcio Provincial de Arcedo toda la navegación web sale por el proxy corporativo `10.20.72.50`, en el puerto **8080**, y los navegadores reciben su configuración en un archivo PAC.',
    },
    { t: 'h', text: 'Tres intermediarios: proxy, gateway y túnel' },
    {
      t: 'table',
      headers: ['Intermediario (RFC 9110 §3.7)', 'Quién lo elige', 'Para qué sirve', 'Ejemplo en el Consorcio'],
      rows: [
        ['**Proxy** (directo, *forward proxy*)', 'El **cliente**, normalmente por configuración local', 'Agrupar las peticiones de una organización: seguridad, registro, caché compartida', 'El proxy web `10.20.72.50:8080` por el que navegan los puestos'],
        ['**Gateway**, también llamado **proxy inverso** (*reverse proxy*)', 'El **dueño del servicio**: el cliente cree hablar con el servidor de origen', 'Publicar servicios internos, acelerar con caché, repartir carga', 'Ejemplo: un proxy inverso delante de una aplicación del CPD publicada en Internet'],
        ['**Túnel** (*tunnel*)', '—', 'Retransmisor ciego entre dos conexiones, sin tocar los mensajes', 'Una sesión TLS que atraviesa el proxy tras un CONNECT'],
        ['**Proxy de interceptación** (*interception proxy*, el «transparente»)', '**Nadie en el cliente**: la red desvía el tráfico', 'Filtrar o redirigir el tráfico TCP al puerto 80 (a veces a otros)', 'Accesos públicos o cortafuegos que capturan la navegación sin configurar el navegador'],
      ],
    },
    {
      t: 'p',
      md: 'La **RFC 9110** (*HTTP Semantics*, que deja obsoleta a la 7230) distingue tres intermediarios. El **proxy** lo elige el cliente, «usually via local configuration rules»: el navegador sabe que existe y le envía las peticiones a él. El **gateway**, que la propia norma apoda «reverse proxy», hace lo contrario: hacia fuera se comporta como si fuera el servidor de origen y por dentro reenvía a los servidores reales; quien navega no sabe que está ahí. El **túnel** es un «blind relay»: une dos conexiones y pasa los bytes sin interpretarlos. Y luego está el **proxy de interceptación**, término de la RFC 3040, que la 9110 recoge como «also commonly known as a "transparent proxy"»: **no lo elige el cliente**, sino que la red desvía su tráfico hacia él. La RFC 3040 recomienda no decir «transparente» a secas, porque la palabra se usa con más de un sentido, y llama al proxy inverso **surrogate**. Lo que conviene retener es la pregunta de fondo: **¿quién sabe que hay un intermediario?** En el directo, el cliente; en el inverso, solo el servidor; en el de interceptación, ninguno de los dos extremos lo ha pedido.',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Un puesto de la VLAN 10 navegando a través del proxy 10.20.72.50:8080',
      text: `--- Web sin cifrar: la petición lleva la URL completa (absolute-form) ---
Puesto 10.20.10.157  ->  proxy 10.20.72.50:8080
  GET http://proveedor.example/catalogo HTTP/1.1
  Host: proveedor.example

  (Sin proxy, la línea sería «GET /catalogo HTTP/1.1» y el TCP iría al servidor.)

--- Web cifrada: el puesto pide un túnel con CONNECT ---
Puesto 10.20.10.157  ->  proxy 10.20.72.50:8080
  CONNECT proveedor.example:443 HTTP/1.1
  Host: proveedor.example:443

Proxy  ->  puesto
  HTTP/1.1 200 OK        (una respuesta 2xx abre el túnel, RFC 9110 §6.4.1)

  A partir de aquí el proxy solo pasa bytes: el TLS va de extremo a extremo.

--- Si el proxy exige identificarse ---
Proxy  ->  puesto
  HTTP/1.1 407 Proxy Authentication Required
  Proxy-Authenticate: ...
Puesto  ->  proxy  (repite la petición)
  Proxy-Authorization: ...`,
    },
    {
      t: 'p',
      md: 'Al hablar con un proxy, el cliente **debe** escribir la petición en **absolute-form** (RFC 9112 §3.2.2): la URL completa en la línea de petición, porque el proxy necesita saber a qué servidor reenviarla. Para HTTPS no puede hacer eso sin romper el cifrado, así que usa el método **CONNECT** (RFC 9110 §9.3.6): pide al proxy que abra una conexión TCP con `host:puerto` y, cuando recibe una respuesta 2xx, el proxy se convierte en túnel. CONNECT no supone ningún puerto: la norma dice «There is no default port», así que el puerto va siempre escrito. Si el proxy exige credenciales responde **407 Proxy Authentication Required**, con la cabecera **Proxy-Authenticate**, y el cliente repite con **Proxy-Authorization**; es el equivalente del 401 de un servidor, pero dirigido al proxy. En cuanto al puerto del propio proxy, no hay uno «oficial»: la IANA registra el **8080** como `http-alt` («HTTP Alternate»), que es el que ha elegido el Consorcio; el **3128** es costumbre de algunos productos, pero en la IANA ese número está asignado a otro servicio (`ndl-aas`).',
    },
    {
      t: 'check',
      q: {
        q: 'Un puesto del Consorcio configurado para usar el proxy 10.20.72.50:8080 abre una página HTTPS de un proveedor. ¿Qué envía primero al proxy?',
        choices: [
          'Un GET con la URL https completa, para que el proxy descifre y reenvíe la petición',
          'Un CONNECT con el nombre del servidor y el puerto 443, para que el proxy abra un túnel',
          'El saludo TLS directamente al puerto 443 del proveedor, porque el proxy solo atiende HTTP',
          'Un CONNECT sin puerto, porque el puerto 443 es el que se supone por defecto',
        ],
        answer: 1,
        explain:
          'Con HTTPS a través de un proxy el cliente pide un túnel con CONNECT host:puerto y, tras la respuesta 2xx, el TLS va de extremo a extremo por dentro. El GET con la URL completa (absolute-form) es lo que hace con HTTP sin cifrar. CONNECT no tiene puerto por defecto: la RFC 9110 lo dice expresamente, por eso el 443 se escribe.',
      },
    },
    { t: 'h', text: 'Lo que deja el proxy en los mensajes: Via, Forwarded y los códigos de error' },
    {
      t: 'table',
      headers: ['Elemento', 'Norma', 'Qué indica'],
      rows: [
        ['**Via**', 'RFC 9110 §7.6.3 · estándar', 'Los intermediarios por los que ha pasado el mensaje; cada proxy añade el suyo y «MUST send» esta cabecera en lo que reenvía. Sirve para trazar el camino y detectar bucles'],
        ['**Forwarded**', 'RFC 7239 · estándar', 'Datos del cliente original con los parámetros **for** (quién hizo la petición al proxy), **by** (interfaz del proxy que la recibió), **host** y **proto**'],
        ['**X-Forwarded-For**', 'Sin norma: la RFC 7239 la llama «non-standard»', 'Lo mismo que el `for` de Forwarded; muy extendida, pero es costumbre de hecho, igual que X-Forwarded-By y X-Forwarded-Proto'],
        ['**407**', 'RFC 9110 §15.5.8', 'El **proxy** pide autenticación (con Proxy-Authenticate)'],
        ['**502 Bad Gateway**', 'RFC 9110 §15.6.3', 'El gateway o proxy recibió una respuesta **no válida** del servidor al que reenvió'],
        ['**504 Gateway Timeout**', 'RFC 9110 §15.6.5', 'El gateway o proxy **no recibió respuesta a tiempo**'],
      ],
    },
    {
      t: 'p',
      md: 'Visto desde el servidor, todas las peticiones que pasan por un proxy llegan desde la dirección del proxy. Si una aplicación necesita saber qué puesto hizo la petición (para un registro de auditoría, por ejemplo), la información tiene que viajar en una cabecera. La **estándar** es **Forwarded** (RFC 7239), por ejemplo `Forwarded: for=10.20.10.157;by=10.20.72.50;proto=http`; la que más se ve en la práctica es **X-Forwarded-For**, que no es norma. En ambos casos el dato lo escribe un intermediario, así que solo es fiable si el servidor sabe que viene de un proxy suyo: cualquier cliente puede inventarse esa cabecera. Los códigos **502** y **504** se reconocen por la palabra *gateway*: los devuelve el intermediario cuando el problema está **detrás** de él, en el servidor al que reenvía.',
    },
    {
      t: 'check',
      q: {
        q: 'El equipo de la aplicación de expedientes quiere registrar qué puesto hace cada petición, que les llega a través de un proxy. ¿Qué cabecera es la estándar para eso?',
        choices: [
          'X-Forwarded-For, definida en la RFC 7239',
          'Via, porque contiene la dirección IP del cliente original',
          'Forwarded, con el parámetro for (RFC 7239)',
          'Proxy-Authorization, que identifica al usuario ante el proxy',
        ],
        answer: 2,
        explain:
          'La RFC 7239 define Forwarded y su parámetro for indica quién hizo la petición al proxy. X-Forwarded-For tienta porque es la más usada, pero la propia RFC 7239 la describe como cabecera no estándar. Via registra los intermediarios, no el cliente, y Proxy-Authorization lleva credenciales para el proxy.',
      },
    },
    { t: 'h', text: 'Cómo sabe el navegador qué proxy usar: PAC y WPAD' },
    {
      t: 'p',
      md: 'Configurar a mano el proxy en cada navegador no escala. Un **archivo PAC** (*Proxy Auto-Config*) es un pequeño programa en **JavaScript** que el navegador descarga y consulta antes de cada petición. Debe definir la función **`FindProxyForURL(url, host)`**, que devuelve una cadena con una o varias opciones separadas por punto y coma: **`DIRECT`** (sin proxy), **`PROXY host:puerto`** o **`SOCKS host:puerto`**. El navegador usa la primera y, si falla, la siguiente. Para decidir, el PAC dispone de funciones auxiliares como `isPlainHostName()`, `dnsDomainIs()`, `isInNet()` o `shExpMatch()`. El archivo lleva la extensión **.pac** y se sirve con el tipo MIME **`application/x-ns-proxy-autoconfig`**. Ojo con su origen: el formato **no tiene norma IETF**; lo creó Netscape y hoy lo documentan los fabricantes de navegadores (la referencia habitual es la documentación de Mozilla).',
    },
    {
      t: 'code',
      lang: 'javascript',
      title: 'proxy.pac del Consorcio (simplificado)',
      text: `function FindProxyForURL(url, host) {
  // Nombres sin dominio (intranet) y el dominio de Active Directory: sin proxy
  if (isPlainHostName(host) || dnsDomainIs(host, ".ad.arcedo.example")) {
    return "DIRECT";
  }
  // Direcciones internas escritas como IP (10.20.0.0/16): sin proxy
  if (shExpMatch(host, "10.20.*")) {
    return "DIRECT";
  }
  // Todo lo demás sale por el proxy corporativo
  return "PROXY 10.20.72.50:8080";
}

// Si se escribiera "PROXY 10.20.72.50:8080; DIRECT", el navegador saldría
// directo cuando el proxy no responda: más disponibilidad, menos control.`,
    },
    {
      t: 'p',
      md: '**WPAD** (*Web Proxy Auto-Discovery*) intenta que el navegador encuentre él solo la URL del PAC. Conviene saber de dónde sale: es el borrador **draft-ietf-wrec-wpad-01**, de julio de 1999, que **caducó en enero de 2000 sin llegar a RFC**. Según ese borrador, el cliente prueba primero **DHCP**, luego **SLP** (*Service Location Protocol*) y luego **DNS**. Por DHCP usa la opción **252**, que se eligió «by agreement of the DHC working group chair»: en la IANA el 252 cae dentro del rango **224–254, reservado para uso privado**, así que no es una opción asignada. Por DNS busca un equipo llamado `wpad` en su dominio y, si no lo encuentra, va quitando etiquetas: en el ejemplo del borrador, `wpad.development.foo.com` y después `wpad.foo.com`. La URL por defecto es `http://<equipo>:<puerto><ruta>`, con el puerto **80** y la ruta **`/wpad.dat`** si no se dicen otros. El borrador avisa de sus riesgos (§9): un servidor DHCP o una respuesta DNS falsos pueden apuntar a un archivo malicioso, y quien controla el PAC decide por dónde sale **toda** la navegación del equipo.',
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'En el Consorcio de Arcedo: PAC sí, descubrimiento automático no',
      md: 'Un puesto de la VLAN 10 pertenece al dominio `ad.arcedo.example`. Si tuviera activado WPAD por DNS, preguntaría por `wpad.ad.arcedo.example` y, al no encontrarlo, por `wpad.arcedo.example`, un nombre que cae dentro de la **zona pública**, alojada en el proveedor de DNS externo. Para no depender de esa búsqueda ni de una opción DHCP sin asignar, el Consorcio reparte a los navegadores la **URL concreta del archivo PAC** y ese archivo envía la navegación a `10.20.72.50:8080`. Así, quien quiera desviar el tráfico tendría que alterar la configuración del puesto o el propio PAC, que se publica en un servidor interno controlado por el Servicio de Informática y Comunicaciones.',
    },
    {
      t: 'check',
      q: {
        q: 'Durante una revisión se propone activar WPAD por DHCP en el Consorcio «porque es una opción DHCP estándar, la 252». ¿Qué es lo correcto?',
        choices: [
          'Es correcto: la opción 252 está asignada por la IANA a WPAD desde la RFC que lo define',
          'La opción de WPAD es la 252, pero solo funciona con DHCPv6',
          'WPAD es una RFC, pero su opción DHCP es la 42, la misma que la de los servidores de hora',
          'WPAD nunca llegó a RFC y la 252 está en el rango 224–254 de uso privado de la IANA, no es una opción asignada',
        ],
        answer: 3,
        explain:
          'WPAD es un borrador IETF de 1999 que caducó sin convertirse en RFC, y el número 252 se acordó de manera informal; en la IANA queda dentro del rango reservado para uso privado. La primera opción tienta porque la 252 es, de hecho, la que usan los clientes, pero eso no la convierte en estándar. La 42 es la opción de servidores NTP.',
      },
    },
    { t: 'h', text: 'Relés y reenvío: la misma idea en varias capas' },
    {
      t: 'p',
      md: 'Varios servicios de este bloque se apoyan en una misma idea: un equipo que **recibe algo que no es para él y lo reenvía** a quien sí puede atenderlo. El **agente relay de DHCP** recoge la difusión del cliente, que no cruzaría un encaminador, rellena `giaddr` y la envía en unidifusión al servidor; en el Consorcio ese papel lo hacen las **SVI** (interfaces virtuales de conmutación) de los conmutadores de distribución y los encaminadores de las oficinas, hacia DHCP1 y DHCP2 (está explicado en la lección de DHCP, no lo repetimos aquí). El **reenviador DNS** pasa a otro resolutor las consultas que no sabe contestar, como hacen DC1 y DC2 con los resolutores del operador. El **proxy** reenvía peticiones HTTP, añade su cabecera Via y puede filtrar, registrar o servir desde caché; el **túnel** reenvía bytes sin mirarlos. Lo que cambia de un caso a otro es **en qué capa** trabaja el reenvío y **cuánto mira** el intermediario. Y siempre trae la misma consecuencia: el servidor ve al intermediario, no al cliente, salvo que un campo (`giaddr`, la opción 82, Forwarded) le cuente de dónde venía la petición.',
    },
    {
      t: 'links',
      title: 'Relay DHCP y reenviadores DNS, en sus lecciones',
      items: [
        { label: 'DHCP: agente relay, giaddr y opción 82 (lección op3m3)', href: '/learn/op3m3' },
        { label: 'DNS en la organización: reenviadores (lección op3m2)', href: '/learn/op3m2' },
      ],
    },
    { t: 'h', text: 'IPAM: llevar la cuenta de direcciones, ámbitos y zonas' },
    {
      t: 'p',
      md: 'Con varios ámbitos DHCP en conmutación por error, zonas DNS internas y externas, reservas para servidores y cada vez más subredes, la hoja de cálculo deja de servir. Una herramienta **IPAM** (*IP Address Management*) reúne en un solo sitio la información de las tres piezas que la generan: el **espacio de direcciones** (qué subredes hay, cuáles están libres, qué dirección fija tiene cada servidor), los **ámbitos DHCP** (rangos, reservas, ocupación) y las **zonas DNS**. Su valor práctico es doble: **planificar** sin solapes (por ejemplo, elegir la subred de una oficina nueva sin pisar `10.20.8.0/22`) y **auditar** quién tuvo qué dirección y cuándo, que es justo lo que se pregunta cuando un registro del proxy o del cortafuegos señala una IP de la VLAN 10. No hay ninguna norma IETF ni IEEE de IPAM: es una categoría de producto. Microsoft, por ejemplo, describe su IPAM de Windows Server como «an integrated suite of tools to enable end-to-end planning, deploying, managing and monitoring of your IP address infrastructure», que descubre los servidores DHCP y DNS y los gestiona desde una consola central.',
    },
    {
      t: 'check',
      q: {
        q: 'Un registro del proxy muestra que 10.20.10.143 descargó un archivo sospechoso hace tres días. El ámbito de la VLAN 10 concede direcciones durante 8 horas. ¿Qué aporta una herramienta IPAM en esta investigación?',
        choices: [
          'Si guarda el historial de concesiones, relacionar la dirección con el equipo que la tenía concedida en ese momento',
          'Bloquear la dirección en el proxy, porque IPAM sustituye a las reglas del cortafuegos',
          'Nada: con concesiones de 8 horas la dirección no se puede atribuir a ningún equipo',
          'Descifrar el tráfico HTTPS del puesto para ver qué archivo se descargó',
        ],
        answer: 0,
        explain:
          'Con concesiones de 8 horas la misma IP puede haber pasado por varios equipos en tres días; si la herramienta guarda el historial de concesiones, permite saber cuál la tenía a esa hora. Que la concesión sea corta no impide atribuirla, solo obliga a mirar el momento exacto. IPAM gestiona direcciones, ámbitos y zonas: ni filtra tráfico ni lo descifra.',
      },
    },
    { t: 'h', text: 'Control de acceso a la red: 802.1X y RADIUS' },
    {
      t: 'p',
      md: '**IEEE 802.1X** (vigente la edición 802.1X-2020) es el control de acceso a la red **basado en puerto**: restringe el uso de cada puerto de la LAN a dispositivos autenticados y autorizados. Hasta que el equipo se identifica, el puerto solo deja pasar el tráfico de autenticación, **EAPOL** (EAP sobre LAN): aunque el equipo envíe su DHCPDISCOVER, el conmutador no lo deja pasar hasta que se autentica. Es el comportamiento básico de 802.1X; algunos productos ofrecen excepciones, como una VLAN de invitados o la autenticación por dirección MAC para equipos sin cliente 802.1X. Intervienen tres roles, con los nombres que recogen la **RFC 3580** y la **RFC 3748** a partir de 802.1X. El **suplicante** es quien se autentica: el equipo, con su cliente 802.1X (en EAP se le llama **peer**). El **autenticador** es quien exige la autenticación: el conmutador de acceso o el punto de acceso inalámbrico. Y el **servidor de autenticación** comprueba las credenciales; en la práctica, un servidor **RADIUS** (*Remote Authentication Dial-In User Service*). El autenticador no decide: hace de intermediario entre el suplicante (EAPOL) y el servidor (RADIUS) y abre o deja cerrado el puerto según la respuesta. **NAC** (*Network Access Control*) es el nombre general de este tipo de control; 802.1X es el estándar que lo implementa en el puerto, y muchos productos NAC añaden la comprobación del estado del equipo.',
    },
    {
      t: 'table',
      headers: ['Pieza', 'Quién es en el Consorcio', 'Con quién habla', 'Datos que conviene saber'],
      rows: [
        ['**Suplicante** (*supplicant*; *peer* en EAP)', 'Un puesto de la VLAN 10 Usuarios', 'Con el autenticador, por **EAPOL**', 'Mientras no se autentica no tiene acceso a la red'],
        ['**Autenticador** (*authenticator*)', 'El conmutador de acceso de la planta', 'Con el suplicante (EAPOL) y con el servidor (RADIUS)', 'Abre o mantiene cerrado el puerto; aplica la VLAN que le indiquen'],
        ['**Servidor de autenticación** (*authentication server*)', 'El servidor RADIUS del CPD, `10.20.72.60`', 'Con el autenticador, por **RADIUS**', 'RADIUS va sobre **UDP**: **1812** autenticación (RFC 2865) y **1813** contabilidad (IANA; RFC 2866)'],
      ],
    },
    {
      t: 'p',
      md: 'Los puertos de **RADIUS** son el **1812** para autenticación, sobre UDP (RFC 2865), y el **1813** para contabilidad (*accounting*), según el registro de la IANA; la contabilidad la define la RFC 2866. Los antiguos **1645** y **1646** son costumbre heredada de fabricantes: la propia RFC 2865 explica que el 1645 «conflicts» con otro servicio, y en la IANA esos números pertenecen a otros protocolos. Cuando la autenticación termina bien, el servidor contesta con un **Access-Accept** y puede decirle al conmutador **en qué VLAN** colocar el puerto. La RFC 3580 §3.31 fija los tres atributos que lo hacen, y con ellos el puerto queda en **una sola VLAN**. Cuando un teléfono IP y un PC comparten la misma toma (el PC conectado detrás del teléfono), la VLAN de voz se resuelve con funciones propias de cada fabricante: la RFC 3580 no cubre ese caso.\n\nEl ejemplo es un puesto con toma propia:',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Access-Accept del RADIUS 10.20.72.60 al conmutador de acceso (RFC 3580 §3.31)',
      text: `Tunnel-Type             = VLAN (13)
Tunnel-Medium-Type      = 802
Tunnel-Private-Group-ID = 10        <- identificador de VLAN, de 1 a 4094

Resultado: el puerto pasa a autorizado y queda en la VLAN 10 Usuarios.
Su DHCPDISCOVER ya pasa por el puerto, y el relay de la SVI
reenvía a DHCP1 (10.20.72.21) y DHCP2 (10.20.72.22).
Con un Access-Reject el puerto sigue sin dar acceso.`,
    },
    {
      t: 'links',
      title: '802.1X y NAC como controles de seguridad, ya explicados en Security+',
      items: [
        { label: 'Port security: 802.1X, EAP y sus tres papeles (lección sp3m5)', href: '/learn/sp3m5' },
        { label: 'NAC entre las capacidades de seguridad de la empresa (lección sp4m7)', href: '/learn/sp4m7' },
        { label: 'Proxy directo e inverso en la arquitectura de red (lección sp3m4)', href: '/learn/sp3m4' },
      ],
    },
    {
      t: 'check',
      q: {
        q: 'En el despliegue de 802.1X del Consorcio, un puesto se conecta a una toma de la planta, el conmutador le pide su identidad y consulta al servidor RADIUS 10.20.72.60. ¿Qué papel tiene el conmutador?',
        choices: [
          'Suplicante, porque es el primero que envía una petición de identidad',
          'Servidor de autenticación, porque decide si el puerto se abre',
          'Autenticador: exige la autenticación y abre o cierra el puerto según lo que conteste el servidor',
          'Peer, que es el nombre que da EAP al equipo de red',
        ],
        answer: 2,
        explain:
          'El conmutador es el autenticador: hace de intermediario entre el suplicante, por EAPOL, y el servidor RADIUS, y aplica su decisión. Quien decide es el servidor de autenticación, no el conmutador. El suplicante es el puesto, y peer es el nombre que da EAP al suplicante, no al conmutador.',
      },
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Lo que se confunde a menudo',
      md: '**Proxy directo frente a inverso:** el directo lo elige el **cliente**; el inverso es un **gateway** (RFC 9110) que se presenta como servidor de origen. **«Transparente»** suele significar **de interceptación**: no lo configura el cliente (RFC 3040 prefiere «interception proxy»). **Con proxy**, HTTP va en **absolute-form** y HTTPS con **CONNECT host:puerto**, sin puerto por defecto. **407** es del proxy (Proxy-Authenticate / Proxy-Authorization); **401**, del servidor. **502**: respuesta no válida de detrás; **504**: no llegó a tiempo. **Via** es estándar (9110), **Forwarded** también (7239); **X-Forwarded-For no** es norma. **Puertos de proxy:** 8080 es `http-alt` en la IANA; el 3128 es costumbre de producto. **PAC:** JavaScript con `FindProxyForURL(url, host)`, respuestas `DIRECT`, `PROXY` y `SOCKS`, tipo MIME `application/x-ns-proxy-autoconfig`; sin norma IETF. **WPAD:** borrador caducado de 1999, nunca RFC; opción DHCP **252** en el rango de uso privado; por defecto `/wpad.dat` en el puerto 80. **IPAM:** categoría de producto, sin norma. **802.1X:** suplicante, autenticador y servidor de autenticación; EAPOL entre los dos primeros y RADIUS entre los dos últimos; RADIUS **1812/1813**, no 1645/1646; VLAN con **Tunnel-Type = VLAN (13)**.',
    },
  ],
  quiz: [
    {
      id: 'op3m5q1',
      domain: 'Servicios de red',
      prompt:
        'Según la RFC 9110, ¿qué diferencia a un proxy directo de un proxy inverso?',
      choices: [
        'El directo lo elige el cliente; el inverso, que la norma llama gateway, se presenta ante el cliente como si fuera el servidor de origen',
        'El directo trabaja con HTTP y el inverso solo con HTTPS',
        'El directo no lo configura el cliente porque la red desvía el tráfico hacia él; el inverso sí',
        'Son el mismo intermediario; «inverso» solo indica que está en la DMZ',
      ],
      answer: 0,
      explain:
        'La RFC 9110 §3.7 dice que el proxy lo elige el cliente, normalmente por configuración local, y que el gateway, «a.k.a. reverse proxy», actúa como servidor de origen hacia fuera. La tercera opción tienta porque describe un proxy real, pero ese es el de interceptación o «transparente», no el directo. La versión de HTTP o la zona de red no definen ningún tipo.',
    },
    {
      id: 'op3m5q2',
      domain: 'Servicios de red',
      prompt:
        'Un puesto envía al proxy del Consorcio la línea «GET http://proveedor.example/catalogo HTTP/1.1». ¿Cómo se llama esta forma de escribir el destino y por qué la usa?',
      choices: [
        'Origin-form, porque así lo exige el servidor de origen',
        'Authority-form, la que se usa con CONNECT',
        'Absolute-form, porque al hablar con un proxy el cliente debe enviar la URL completa (RFC 9112 §3.2.2)',
        'Asterisk-form, la que se usa cuando hay un proxy de interceptación',
      ],
      answer: 2,
      explain:
        'La RFC 9112 obliga al cliente a escribir la URL completa, en absolute-form, cuando habla con un proxy, porque el proxy necesita saber a qué servidor reenviar. Origin-form es la ruta sola («/catalogo») que se envía directamente al servidor, y por eso tienta. CONNECT lleva host:puerto, no una URL con esquema.',
    },
    {
      id: 'op3m5q3',
      domain: 'Servicios de red',
      prompt:
        'Al abrir una web, un puesto recibe del proxy la respuesta «407 Proxy Authentication Required». ¿Qué debe hacer el navegador?',
      choices: [
        'Repetir la petición con la cabecera Authorization dirigida al servidor web',
        'Repetir la petición con la cabecera Proxy-Authorization, con credenciales para el proxy',
        'Saltarse el proxy y conectarse directamente, porque 407 indica que el proxy no responde',
        'Esperar: 407 significa que el servidor de detrás tardó demasiado',
      ],
      answer: 1,
      explain:
        'El 407 lo envía el proxy, con Proxy-Authenticate, y el cliente responde con Proxy-Authorization (RFC 9110 §15.5.8 y §11.7). Authorization es la pareja del 401, que pide credenciales el servidor de origen, y por eso tienta. Que el servidor de detrás tarde es un 504 Gateway Timeout.',
    },
    {
      id: 'op3m5q4',
      domain: 'Servicios de red',
      prompt:
        'Tras cambiar el proxy del Consorcio de puerto, varias personas preguntan qué número es «el puerto oficial de los proxies». ¿Qué es lo correcto?',
      choices: [
        'El 3128, asignado por la IANA a los proxies web',
        'El 80, porque los proxies solo pueden escuchar en el puerto de HTTP',
        'El 1812, el mismo que usa RADIUS para la autenticación',
        'No hay puerto oficial de proxy: la IANA registra el 8080 como http-alt, y el 3128 es costumbre de algunos productos',
      ],
      answer: 3,
      explain:
        'La IANA registra el 8080 como «HTTP Alternate», que es el que usa el Consorcio por decisión propia; el 3128 lo usan algunos productos, pero en la IANA está asignado a otro servicio (ndl-aas). Por eso tienta la primera opción, que convierte una costumbre en asignación. El 1812 es de RADIUS.',
    },
    {
      id: 'op3m5q5',
      domain: 'Servicios de red',
      prompt:
        'El archivo PAC del Consorcio devuelve «PROXY 10.20.72.50:8080; DIRECT» para los destinos de Internet. ¿Qué ocurre si el proxy deja de responder?',
      choices: [
        'El navegador muestra un error, porque solo se usa la primera opción de la lista',
        'El navegador consulta la opción DHCP 252 para buscar otro proxy',
        'El navegador prueba la siguiente opción y sale directo a Internet, si la red se lo permite',
        'El navegador repite la petición con CONNECT al puerto 8080',
      ],
      answer: 2,
      explain:
        'FindProxyForURL puede devolver varias opciones separadas por punto y coma: se usa la primera y, si falla, la siguiente, aquí DIRECT. Que el navegador consiga salir depende de que el cortafuegos deje pasar la navegación directa. La opción DHCP 252 es de WPAD, que sirve para encontrar el PAC, no para elegir entre las opciones que devuelve.',
    },
    {
      id: 'op3m5q6',
      domain: 'Servicios de red',
      prompt:
        '¿Qué afirmación sobre WPAD es correcta?',
      choices: [
        'Viene de un borrador IETF de 1999 que caducó sin llegar a RFC; por defecto busca el archivo /wpad.dat en el puerto 80',
        'Es la RFC que define el formato de los archivos PAC y la función FindProxyForURL',
        'Usa la opción DHCP 252, asignada por la IANA, y nunca recurre al DNS',
        'Solo funciona con proxies de interceptación, porque el cliente no sabe que hay un proxy',
      ],
      answer: 0,
      explain:
        'WPAD es el borrador draft-ietf-wrec-wpad-01, caducado en enero de 2000, y su URL por defecto usa el puerto 80 y la ruta /wpad.dat. El formato PAC tampoco es RFC: lo creó Netscape. La opción 252 está en el rango de uso privado de la IANA, y el DNS es uno de los métodos de descubrimiento. WPAD sirve precisamente para que el cliente encuentre y use un proxy configurado, lo contrario de la interceptación.',
    },
    {
      id: 'op3m5q7',
      domain: 'Servicios de red',
      prompt:
        'En el despliegue de 802.1X del Consorcio hay que abrir en el cortafuegos del CPD el tráfico entre los conmutadores de acceso y el servidor RADIUS 10.20.72.60. ¿Qué puertos se usan según la RFC 2865 y la IANA?',
      choices: [
        'TCP 1645 y 1646',
        'UDP 1645 para autenticación y 1813 para contabilidad',
        'TCP 389, el puerto de LDAP, porque RADIUS consulta el directorio',
        'UDP 1812 para autenticación y 1813 para contabilidad',
      ],
      answer: 3,
      explain:
        'La RFC 2865 encapsula RADIUS en UDP con destino 1812, y la IANA asigna el 1813 a la contabilidad. El 1645 tienta porque muchos equipos antiguos lo usan, pero la propia RFC dice que entra en conflicto con otro servicio y en la IANA pertenece a otro protocolo. El 389 es LDAP, que puede usar el servidor por detrás, pero no es lo que habla el conmutador.',
    },
    {
      id: 'op3m5q8',
      domain: 'Servicios de red',
      prompt:
        'El Consorcio quiere que un puesto con toma propia quede en la VLAN 10 Usuarios tras autenticarse por 802.1X. ¿Qué debe incluir el servidor RADIUS en su respuesta, según la RFC 3580?',
      choices: [
        'Un Access-Reject con la VLAN 10 en el mensaje de respuesta',
        'Un Access-Accept con Tunnel-Type = VLAN (13), Tunnel-Medium-Type = 802 y Tunnel-Private-Group-ID = 10',
        'Una opción DHCP 82 con la VLAN 10 en la subopción Agent Circuit ID',
        'Un Access-Accept con Tunnel-Type = 802 y Tunnel-Private-Group-ID = 13',
      ],
      answer: 1,
      explain:
        'La RFC 3580 §3.31 asigna la VLAN en el Access-Accept con Tunnel-Type = VLAN (13), Tunnel-Medium-Type = 802 y el identificador de VLAN en Tunnel-Private-Group-ID. La última opción tienta porque usa los mismos números, pero cambiados de atributo. Un Access-Reject deja el puerto sin acceso, y la opción 82 la inserta el relay de DHCP, no el RADIUS. Ojo: así el puerto queda en una sola VLAN; la VLAN de voz en una toma compartida con un teléfono depende del fabricante.',
    },
  ],
};
