import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// OP4M2 — Balanceo en capa 4
// ---------------------------------------------------------------------------
export const OP4_M2: Module = {
  id: 'op4m2',
  sectionId: 'op4',
  title: 'Balanceo en capa 4: VIP, grupos, algoritmos y modos de reenvío',
  minutes: 24,
  objectives: [
    'Explicar qué hace un balanceador de carga y qué son la IP virtual (VIP), el grupo (*pool*) y sus miembros, el peso y los servidores de reserva',
    'Comparar los algoritmos de reparto (*round robin*, ponderado, menos conexiones, *hash* de origen, aleatorio) y citar el valor por defecto de cada fabricante con su versión',
    'Distinguir los modos de reenvío (NAT de destino, NAT de origen o proxy completo y retorno directo) por lo que reescriben, por la dirección de origen que ve el servidor y por el camino de vuelta, con LSNAT y LS-NAPT de la RFC 2391',
    'Calcular el reparto que sale de unos pesos y prever qué clientes se mueven cuando cambia el número de miembros de un reparto por *hash*',
    'Delimitar lo que un balanceador de capa 4 puede ver (direcciones, puertos, conexión) y lo que no (`Host`, *cookie*, URL), y por qué el Consorcio necesita capa 7 para publicar `www` y `sede`',
  ],
  blocks: [
    {
      t: 'p',
      md: 'Un **balanceador de carga** (*load balancer*) recibe las conexiones dirigidas a un servicio y las reparte entre varios servidores que hacen lo mismo. Al cliente le parece que habla con una sola máquina; detrás hay varias, y si una se cae, las demás siguen atendiendo. La RFC 9110 (§3.7), al describir el *gateway* o proxy inverso, ya cita entre sus usos «partitioning or load balancing» de servicios HTTP entre varias máquinas. Pero el reparto puede hacerse a dos alturas. En **capa 4** el balanceador solo mira lo que viaja en las cabeceras IP y TCP o UDP: direcciones, puertos y el estado de la conexión. En **capa 7** entiende el protocolo de aplicación (en la práctica, HTTP) y decide por su contenido. Esta lección va de la primera, que es la base de la segunda. Casi nada de esto está normalizado: los algoritmos, los pesos y sus valores por defecto son de cada fabricante, y aquí se citan con el nombre del producto y la versión. Las RFC que describen el reparto por NAT en esta lección son la **2391** (LSNAT) y, como base, la **3022** (NAT tradicional), las dos **informativas**: describen, no obligan.',
    },
    { t: 'h', text: 'IP virtual, grupo y miembros' },
    {
      t: 'p',
      md: 'Los clientes no conocen las direcciones de los servidores: se conectan a una **IP virtual** (**VIP**, *virtual IP*), una dirección que pertenece al servicio y no a ninguna máquina concreta. La RFC 2391 la llama «virtual server address»: una IP única que identifica a un servidor o a un grupo de servidores equivalentes. Detrás de la VIP está el **grupo** (*pool*, también *server pool* en la RFC 2391, o *backend* en HAProxy, o *upstream* en NGINX) y sus **miembros**, los servidores reales, cada uno con su dirección y su puerto, que no tiene por qué ser el mismo que el de la VIP.\n\nCada miembro lleva un **peso** (*weight*) que dice qué parte del reparto le toca respecto a los demás. Los valores son del fabricante. En **HAProxy 3.4** el peso vale **1** por defecto y como máximo **256**; un peso **0** saca al servidor del reparto, aunque sigue aceptando las conexiones que ya le corresponden por persistencia. En **NGINX** el peso por defecto también es **1**, y su propia documentación pone un ejemplo: con pesos 5, 1 y 1, de cada **7** peticiones, **5** van al primero. Dos parámetros más que conviene reconocer: el límite de conexiones por miembro (`maxconn` en HAProxy, **0** = ilimitado por defecto, por encima del cual las peticiones esperan en cola; `max_conns` en NGINX, también **0** = sin límite), y los servidores de **reserva** (`backup`), que solo reciben tráfico cuando no queda ningún miembro normal disponible. En HAProxy, por defecto solo se usa el **primer** servidor de reserva operativo; en NGINX, `backup` no se puede combinar con los métodos `hash`, `ip_hash` ni `random`. Decidir cuándo un miembro está «disponible» es trabajo de las comprobaciones de salud, que tienen su propia lección.',
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'En el Consorcio de Arcedo: la pareja de balanceadores del CPD',
      md: 'El Consorcio tiene en el CPD una pareja de balanceadores, lo que los fabricantes venden como **ADC** (*Application Delivery Controller*): **ADC1** `10.20.72.71` y **ADC2** `10.20.72.72`, en **activo-pasivo**, con el protocolo de alta disponibilidad de su fabricante y un enlace de latido directo entre los dos. Comparten la **VIP** interna **`10.20.72.70`**: la tiene el que está activo en cada momento. Como el operador solo da una dirección pública, el encaminador reenvía el puerto **443** de `203.0.113.10` a `10.20.72.70:443`; el correo sigue con su propio reenvío de puertos. Detrás de la VIP, el grupo **`www`** tiene dos miembros, **WEB1** `10.20.72.81` y **WEB2** `10.20.72.82`, que escuchan en el puerto **80**, con el algoritmo de **menos conexiones** y **sin persistencia**. Ojo con un detalle: para `www` y para la sede electrónica el ADC **no** trabaja en capa 4, sino en capa 7, porque termina TLS y separa los dos nombres por `Host`. Por qué no le basta la capa 4 es justo lo que cierra esta lección, y cómo trabaja en capa 7, la siguiente.',
    },
    {
      t: 'check',
      q: {
        q: 'Un grupo de NGINX tiene tres miembros con pesos 5, 1 y 1 y el método por defecto. Si llegan 14 peticiones y los tres están disponibles, ¿cuántas recibe el primero?',
        choices: ['5', '7', '10', '14'],
        answer: 2,
        explain:
          'El método por defecto de NGINX es *round robin* ponderado: el reparto es proporcional al peso. El peso total es 5 + 1 + 1 = 7, así que al primero le tocan 5 de cada 7 peticiones; en 14 peticiones, 10. Quedarse en 5 es leer el peso como un número absoluto de peticiones, cuando solo vale respecto a los demás. Y 14 sería el caso de un servidor sin competencia, no el de un reparto ponderado.',
      },
    },
    { t: 'h', text: 'Algoritmos: cómo se elige el miembro' },
    {
      t: 'p',
      md: 'El algoritmo decide a qué miembro va cada conexión nueva. La RFC 2391 (§5.1) ya enumeraba algoritmos «no intrusivos»: **Round-Robin**, sin mirar la carga; **Least Load first**, el que tenga menos sesiones; **Least traffic first**, el que mueva menos paquetes o bytes, y **Least Weighted Load first**, con pesos por tipo de sesión y por servidor. Los productos actuales usan casi los mismos, con sus propios nombres. La tabla recoge los de HAProxy 3.4 y NGINX que conviene distinguir.',
    },
    {
      t: 'table',
      headers: ['Algoritmo', 'Qué mira', 'Dónde (valor del fabricante)', 'Cuidado con'],
      rows: [
        ['***Round robin*** (por turno)', 'Nada: cada miembro, por turno, según su peso', 'HAProxy `roundrobin` (dinámico: el peso cambia en caliente; límite de diseño de **4095** servidores activos por *backend*) y `static-rr` (estático, sin límite). NGINX: es el método por defecto, ponderado', 'Reparte conexiones, no carga: una conexión larga y una corta cuentan igual'],
        ['**Menos conexiones** (*least connections*)', 'Cuántas conexiones activas tiene cada miembro', 'HAProxy `leastconn` (empate: *round robin*; cuenta también la cola). NGINX `least_conn` (tiene en cuenta los pesos; empate: *round robin* ponderado)', 'HAProxy lo recomienda para sesiones largas (LDAP, SQL) y lo considera poco adecuado para HTTP de sesiones cortas'],
        ['***Hash* de origen**', 'La dirección IP del cliente', 'HAProxy `source`: *hash* de la IP de origen **entera**, dividido por el peso total. NGINX `ip_hash`: los **tres primeros octetos** de la IPv4, o la IPv6 entera', 'Misma IP, mismo servidor solo mientras no cambie el número de miembros. Con `ip_hash`, toda una /24 cae en el mismo servidor; con NAT masivo, miles de usuarios en uno'],
        ['***Hash* de una clave**', 'Lo que se configure (variables, texto)', 'NGINX `hash clave [consistent]`; HAProxy `hash`', 'Sin `consistent`, añadir o quitar un servidor puede reasignar **la mayoría** de las claves; con `consistent` (ketama), solo unas pocas'],
        ['**Aleatorio**', 'Un sorteo según los pesos', 'HAProxy `random`, por defecto con **2** sorteos («Power of Two Random Choices»): elige el menos cargado de los dos. NGINX `random [two [método]]`, con `least_conn` por defecto al elegir entre dos', 'Sin el segundo sorteo es azar puro'],
        ['**El primero con hueco**', 'El primer servidor (por identificador) que no ha llegado a su `maxconn`', 'HAProxy `first`', 'Sirve para usar el mínimo de servidores; sin `maxconn` no tiene sentido e ignora los pesos'],
      ],
    },
    {
      t: 'p',
      md: '**¿Y cuál viene por defecto?** Depende del producto y de la versión, y por eso nunca se puede hablar del «algoritmo por defecto de un balanceador» sin decir de cuál. En **HAProxy 3.4** (versión de soporte largo) el manual dice que se usa **`random`** cuando no se ha fijado otro algoritmo, modo ni opción; en **HAProxy 3.2 y 3.0** (también de soporte largo) la misma frase dice **`roundrobin`**. En **NGINX**, tanto en HTTP como en el módulo `stream` de capa 4, el método por defecto es el ***round robin* ponderado**. Y en la nube cambia otra vez: el NLB (*Network Load Balancer*) de AWS, que trabaja en capa 4, reparte con un ***hash* de flujo** sobre el protocolo, la IP y el puerto de origen, la IP y el puerto de destino y el número de secuencia TCP, de modo que cada conexión TCP va a un mismo destino durante toda su vida.\n\nEl *hash* de origen tiene una trampa que se entiende con aritmética. Si el miembro sale de dividir el *hash* entre el número de servidores, al cambiar ese número cambia el resultado para casi todos. La RFC 2991 (§4), que estudia el mismo problema al repartir flujos entre caminos de igual coste, lo cuantifica: con el método **módulo N**, al añadir o quitar un salto cambia de camino una fracción **(N−1)/N** de los flujos; con el ***hash* de peso aleatorio más alto** (HRW, *Highest Random Weight*), solo **1/N**. Los fabricantes avisan de lo mismo: HAProxy, de que con `source` «muchos clientes» pasarán a otro servidor si cambia el número de miembros; NGINX, de que `hash` sin `consistent` puede reasignar la mayoría de las claves. Para retirar un miembro de `ip_hash` un rato sin redistribuir a todos, NGINX aconseja marcarlo `down` en lugar de borrarlo.',
    },
    {
      t: 'check',
      q: {
        q: 'Con los dos miembros del grupo www disponibles y el mismo peso, WEB1 tiene 40 conexiones activas y WEB2, 25. Llega una conexión nueva. ¿Adónde la manda el ADC con el algoritmo que el Consorcio tiene configurado?',
        choices: [
          'A WEB1, porque le toca por turno',
          'A WEB2, porque tiene menos conexiones activas',
          'Al que diga el *hash* de la IP del cliente',
          'A cualquiera de los dos al azar, porque los pesos son iguales',
        ],
        answer: 1,
        explain:
          'El grupo www usa menos conexiones: con pesos iguales, la conexión va al miembro con menos conexiones activas, que es WEB2. El turno es el criterio del *round robin*, que ignora la carga. El *hash* de la IP sería un *hash* de origen, que el Consorcio no usa porque para www no quiere persistencia. Y el sorteo es el método aleatorio.',
      },
    },
    {
      t: 'check',
      q: {
        q: 'En un *backend* de HAProxy con `balance static-rr`, un técnico baja en caliente, sin recargar la configuración, el peso de un servidor que va sobrecargado. El reparto no cambia. ¿Por qué?',
        choices: [
          'Porque el peso solo admite valores entre 1 y 10',
          'Porque con un peso distinto de 1 HAProxy pasa automáticamente a `leastconn`',
          'Porque cambiar pesos exige `mode http`',
          'Porque `static-rr` es estático: cambiar el peso en caliente no surte efecto; con `roundrobin`, que es dinámico, sí lo haría',
        ],
        answer: 3,
        explain:
          'HAProxy tiene dos turnos: `roundrobin`, dinámico, en el que el peso puede cambiarse en caliente (a cambio de un límite de diseño de 4095 servidores activos por *backend*), y `static-rr`, estático y sin ese límite, en el que cambiar el peso en caliente no tiene efecto. El modo no tiene nada que ver: el modo no tiene nada que ver con que el peso cambie en caliente. El peso de HAProxy llega hasta 256, y ningún peso cambia el algoritmo por su cuenta.',
      },
    },
    { t: 'h', text: 'Modos de reenvío: qué se reescribe y por dónde vuelve la respuesta' },
    {
      t: 'p',
      md: 'Elegido el miembro, el balanceador tiene que hacerle llegar los paquetes. Hay tres formas de hacerlo, y lo que las distingue es **qué dirección de origen ve el servidor** y **por dónde vuelve la respuesta**. La RFC 2391 describe las dos primeras con NAT; los nombres que usan los productos (NAT de destino, SNAT, proxy completo, retorno directo o DSR) **no aparecen en las RFC consultadas**.\n\n**NAT de destino.** El balanceador cambia **solo la dirección de destino**: la VIP pasa a ser la del miembro elegido. Es lo que la RFC 2391 (§3.3) llama **LSNAT** (*Load Sharing using NAT*). El servidor ve la **IP real del cliente**, lo cual es cómodo para registros y control de acceso, pero tiene una condición dura (§1): **todas** las peticiones y respuestas de la sesión deben pasar por el mismo equipo LSNAT, porque es el único que sabe deshacer la traducción. Si el servidor tiene como puerta de enlace otro encaminador, su respuesta sale con origen en su dirección real, el cliente no la reconoce (él habló con la VIP) y la conexión no se establece.\n\n**NAT de origen o proxy completo.** El balanceador cambia **destino y origen**: el origen pasa a ser una dirección del propio balanceador. La RFC 2391 lo llama **LS-NAPT**. El servidor ve al balanceador como cliente, y por eso la respuesta vuelve a él sin exigir nada a la topología. El precio es que el servidor **pierde la IP del cliente**. En el uso de los fabricantes, un *proxy completo* (*full proxy*) va más allá de una traducción: termina la conexión TCP del cliente y abre otra suya hacia el servidor, pero visto desde el servidor el resultado es el mismo, el origen es el balanceador. Para devolverle la dirección real hay remedios de capa 7 (`X-Forwarded-For`, `Forwarded`) y el protocolo PROXY, que se ven en la lección siguiente.\n\n**Retorno directo del servidor** (*Direct Server Return*, DSR). Es un **concepto de producto sin norma ni definición en las fuentes primarias**. A la ida, el balanceador entrega el paquete al servidor **sin cambiar la dirección de destino**, que sigue siendo la VIP; a la vuelta, el servidor contesta **directamente al cliente** desde esa VIP, sin pasar por el balanceador, lo que alivia mucho al balanceador cuando las respuestas pesan más que las peticiones. Para que funcione, cada servidor debe aceptar paquetes dirigidos a la VIP. La documentación de Microsoft sobre la *floating IP* de Azure Load Balancer, un mecanismo parecido, lo concreta así: el tráfico llega con la IP del *frontend* del balanceador como destino, y el sistema invitado tiene que tener esa IP en una interfaz *loopback* y aceptar paquetes en interfaces que no tienen esa dirección (modelo «weak host» en Windows). El balanceador, como no ve las respuestas, tampoco puede usar nada de ellas.',
    },
    {
      t: 'table',
      headers: ['Modo', 'Qué reescribe a la ida', 'Origen que ve el servidor', 'Camino de vuelta', 'Requisito o pega'],
      rows: [
        ['**NAT de destino** (LSNAT, RFC 2391)', 'Solo el destino: VIP → miembro', 'La IP real del cliente', 'Por el balanceador, obligatoriamente', 'El servidor debe encaminar la respuesta a través del balanceador'],
        ['**NAT de origen / proxy completo** (LS-NAPT, RFC 2391)', 'Destino y origen: el origen pasa a ser el balanceador', 'Una dirección del balanceador', 'Por el balanceador, de forma natural', 'Se pierde la IP del cliente; se recupera con cabeceras HTTP o con el protocolo PROXY'],
        ['**Retorno directo** (DSR, concepto sin norma)', 'Nada en IP: el destino sigue siendo la VIP', 'La IP real del cliente', 'Directo del servidor al cliente', 'La VIP configurada en el servidor (p. ej. en una *loopback*); el balanceador no ve las respuestas'],
      ],
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Una conexión, tres modos (C = cliente, VIP = dirección del servicio, B = dirección del balanceador, S1 = miembro elegido)',
      text: `                    IDA: lo que recibe S1          VUELTA: lo que envía S1      ¿Por el balanceador?
NAT de destino      origen C   -> destino S1         origen S1  -> destino C      Sí: B lo reescribe a VIP -> C
NAT de origen       origen B   -> destino S1         origen S1  -> destino B      Sí: B lo devuelve como VIP -> C
Retorno directo     origen C   -> destino VIP        origen VIP -> destino C      No: sale directo hacia C

Error típico del NAT de destino: S1 tiene como puerta de enlace otro encaminador.
Su respuesta (origen S1 -> destino C) no pasa por el balanceador, nadie la
reescribe a VIP, y C la descarta porque él abrió la conexión contra la VIP.`,
    },
    {
      t: 'check',
      q: {
        q: 'En una red de pruebas, un balanceador hace NAT de destino hacia dos servidores, cuya puerta de enlace por defecto es el encaminador central y no el balanceador. Las conexiones de los clientes externos no llegan a establecerse, aunque los servidores reciben el primer segmento. ¿Qué pasa y cómo se arregla sin tocar a los clientes?',
        choices: [
          'Las respuestas salen con la dirección real del servidor por un camino que no pasa por el balanceador; o la vuelta pasa por él (puerta de enlace o encaminamiento por origen), o se cambia a NAT de origen',
          'El algoritmo no admite NAT de destino; hay que pasar de menos conexiones a *round robin*',
          'Los servidores no pueden ver la IP del cliente con NAT de destino; hay que activar `X-Forwarded-For`',
          'La VIP debe estar configurada en una *loopback* de cada servidor, como en el retorno directo',
        ],
        answer: 0,
        explain:
          'Con NAT de destino (LSNAT), la RFC 2391 exige que peticiones y respuestas pasen por el mismo equipo, el único que puede devolver el origen a la VIP. Si la respuesta sale por el encaminador central, llega al cliente con la dirección real del servidor y este la descarta. Se arregla encaminando la vuelta por el balanceador o pasando a NAT de origen, donde el servidor responde al propio balanceador. Lo de la *loopback* tienta, pero es el requisito del retorno directo, otro modo. Y con NAT de destino el servidor sí ve la IP del cliente: ese no es el problema.',
      },
    },
    { t: 'h', text: 'Lo que la capa 4 ve, y lo que no' },
    {
      t: 'p',
      md: 'Un balanceador de capa 4 decide con la **tupla** de la conexión: protocolo, direcciones y puertos de origen y destino. Ve cuándo se abre y se cierra una conexión TCP y cuántas tiene cada miembro, y con eso le basta para repartir, contar y mantener cada conexión en el mismo miembro hasta que termine. Lo que **no** ve es nada de lo que va dentro: ni el campo **`Host`** de HTTP, que la RFC 9110 (§7.2) usa para distinguir varios nombres servidos en la misma dirección, ni las ***cookies***, ni la **URL**, ni el método. Además decide **una vez por conexión**: si el navegador reutiliza la misma conexión para cien peticiones, las cien van al mismo miembro.\n\nCon TLS todo eso viaja cifrado. Hay una sola rendija: el primer mensaje del saludo TLS, el ClientHello, lleva en claro el nombre al que se quiere llegar (**SNI**), y algunos productos lo leen **sin descifrar** aunque trabajen en modo TCP (en HAProxy, `req.ssl_sni`; en NGINX, el módulo `ssl_preread`). Es un caso intermedio que se explica en la lección de descarga de TLS: permite elegir grupo por nombre, pero sigue sin dar acceso a `Host`, *cookies* ni rutas.\n\nEn los productos, la capa 4 es un modo de trabajo. En **HAProxy**, `mode tcp` es TCP puro, sin analizar nada de capa 7, y es **el modo por defecto** (el manual lo propone para SSL, SSH o SMTP); `mode http` analiza cada petición antes de conectar. En **NGINX**, la capa 4 es el módulo **`stream`** (`ngx_stream_upstream_module`), separado del módulo `http`, también con *round robin* ponderado por defecto. El ejemplo de abajo es un **supuesto genérico, no del Consorcio**: otra organización reparte HTTPS sin descifrarlo entre dos servidores que tienen cada uno su certificado, con direcciones de documentación.',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Supuesto genérico (otra red): la misma capa 4 en HAProxy y en NGINX',
      text: `# HAProxy: modo TCP, menos conexiones. El balanceador no ve nada del HTTP cifrado.
frontend https_l4
    mode tcp
    bind 192.0.2.10:443
    default_backend web_l4

backend web_l4
    mode tcp
    balance leastconn
    server web-a 192.0.2.21:443 weight 1
    server web-b 192.0.2.22:443 weight 1

# NGINX: módulo stream, round robin ponderado (el método por defecto).
stream {
    upstream web_l4 {
        server 192.0.2.21:443 weight=2;
        server 192.0.2.22:443;              # peso 1 por defecto: 2 de cada 3 al primero
    }
    server {
        listen 192.0.2.10:443;
        proxy_pass web_l4;
    }
}`,
    },
    {
      t: 'table',
      headers: ['Quiero repartir según…', '¿Basta la capa 4?', 'Por qué'],
      rows: [
        ['La carga de cada miembro (turno, menos conexiones)', 'Sí', 'Solo necesita contar conexiones'],
        ['La IP del cliente (*hash* de origen)', 'Sí', 'La dirección de origen va en la cabecera IP'],
        ['El nombre al que se conecta por HTTPS', 'A medias', 'Solo leyendo el SNI del ClientHello sin descifrar; `Host` va cifrado'],
        ['El campo `Host` en HTTP, la ruta de la URL o una *cookie*', 'No', 'Van dentro del HTTP: hace falta capa 7'],
        ['Cada petición de una conexión reutilizada, por separado', 'No', 'La capa 4 decide una vez por conexión'],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'En el supuesto genérico de HAProxy en `mode tcp`, un mismo navegador abre una conexión y hace por ella 50 peticiones HTTPS seguidas. ¿Cómo se reparten esas 50 peticiones?',
        choices: [
          'Una a cada servidor por turno, porque `leastconn` reparte petición a petición',
          'Al azar entre los dos, porque en modo TCP no hay algoritmo',
          'Todas al mismo servidor: en capa 4 se decide una vez, al abrir la conexión',
          'Según la *cookie* que inserta HAProxy en la primera respuesta',
        ],
        answer: 2,
        explain:
          'En capa 4 el balanceador elige miembro al abrir la conexión TCP y no vuelve a decidir hasta la siguiente; ni siquiera sabe dónde empieza y acaba cada petición, porque van cifradas. Pensar en un reparto petición a petición es lo que tienta, pero eso exige `mode http`. Y una *cookie* insertada por el balanceador es persistencia de capa 7: en modo TCP HAProxy no puede leer ni escribir el HTTP.',
      },
    },
    {
      t: 'p',
      md: '**Por qué el Consorcio no se queda en capa 4.** Por el puerto 443 de `203.0.113.10` entran dos nombres, `www.arcedo.example` y `sede.arcedo.example`, que resuelven a la misma dirección. Un balanceador de capa 4 puro solo ve «alguien conecta a `10.20.72.70:443`», idéntico para los dos. Leer el SNI permitiría separarlos, pero no bastaría: la sede necesita que cada usuario vuelva al mismo servidor mediante una *cookie* que inserta el ADC, porque la aplicación guarda la sesión en la memoria de cada servidor, y WEB1 y WEB2 escuchan en HTTP en el puerto 80, de modo que alguien tiene que terminar TLS antes. Las dos cosas exigen ver el HTTP: por eso el ADC trabaja en capa 7, que es la lección siguiente.',
    },
    {
      t: 'links',
      title: 'Lo que ya está explicado en otras lecciones',
      items: [
        { label: 'NAT estático, dinámico y PAT; NAT básico y NAPT de la RFC 3022 (op1m2)', href: '/learn/op1m2' },
        { label: 'Proxy, gateway y proxy inverso como intermediarios de HTTP (op3m5)', href: '/learn/op3m5' },
        { label: 'Security+: dónde se coloca un load balancer y para qué sirve (sp3m4)', href: '/learn/sp3m4' },
        { label: 'Siguiente: balanceo en capa 7 y persistencia de sesión (op4m3)', href: '/learn/op4m3' },
      ],
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Lo que más se confunde',
      md: '**Normas:** el balanceo casi no está normalizado. La RFC **2391** (LSNAT) y la **3022** (NAT tradicional) son **informativas**; algoritmos, pesos y valores por defecto son de cada fabricante. **LSNAT** cambia **solo el destino** (el servidor ve al cliente, pero la vuelta **debe** pasar por el mismo equipo); **LS-NAPT** cambia **destino y origen** (el servidor ve al balanceador). «NAT de destino», «SNAT», «proxy completo» y «DSR» son nombres de producto; el **DSR** no tiene norma. **Algoritmo por defecto:** HAProxy **3.4**, `random` con **2** sorteos; HAProxy **3.2 y 3.0**, `roundrobin`; NGINX, *round robin* **ponderado**; AWS NLB, *hash* de flujo. **Pesos:** HAProxy, **1** por defecto, máximo **256**, **0** = fuera del reparto; NGINX, **1** por defecto (5, 1, 1 → 5 de cada 7). **Hash de origen:** HAProxy `source` usa la IP **entera**; NGINX `ip_hash`, los **tres primeros octetos** de la IPv4 (toda una /24 al mismo servidor). Al cambiar el número de miembros se mueve casi todo, salvo con *hash* consistente; módulo N mueve **(N−1)/N** y HRW **1/N** (RFC 2991). **`leastconn`:** HAProxy lo recomienda para sesiones largas, no para HTTP de sesiones cortas. **Capa 4:** decide **una vez por conexión**; no ve `Host`, *cookies* ni URL; el SNI se puede leer sin descifrar, pero no el resto. **HAProxy** trabaja en `mode tcp` **por defecto**.',
    },
  ],
  quiz: [
    {
      id: 'op4m2q1',
      domain: 'Balanceo y alta disponibilidad',
      prompt:
        'Un *backend* de HAProxy 3.4 no tiene ninguna línea `balance`, ni modo ni opción que fijen otra cosa. ¿Qué algoritmo usa según el manual de esa versión?',
      choices: [
        '`roundrobin`, el mismo que en todas las versiones de HAProxy',
        '`leastconn`, porque es el más equilibrado',
        '`random`, con dos sorteos por defecto',
        '`source`, para mantener a cada cliente en el mismo servidor',
      ],
      answer: 2,
      explain:
        'El manual de HAProxy 3.4 dice que el algoritmo queda en `random` cuando no se ha fijado otro algoritmo, modo ni opción, y `random` hace por defecto 2 sorteos y se queda con el menos cargado. La opción de `roundrobin` tienta porque es lo que dicen los manuales de 3.2 y 3.0 y casi todo el material antiguo, pero no vale para «todas las versiones». `leastconn` y `source` hay que pedirlos expresamente.',
    },
    {
      id: 'op4m2q2',
      domain: 'Balanceo y alta disponibilidad',
      prompt:
        'Un NGINX reparte con `ip_hash` entre tres servidores. Llegan dos clientes, 192.0.2.15 y 192.0.2.200. ¿Qué se puede afirmar según la documentación de NGINX?',
      choices: [
        'Irán al mismo servidor, porque `ip_hash` usa como clave los tres primeros octetos de la IPv4',
        'Irán a servidores distintos, porque `ip_hash` usa la dirección IPv4 entera',
        'Irán al servidor con menos conexiones activas, porque `ip_hash` lo combina con `least_conn`',
        'Irán al servidor de reserva (`backup`) si los principales están ocupados',
      ],
      answer: 0,
      explain:
        'En NGINX la clave de `ip_hash` son los tres primeros octetos de la IPv4 (o la IPv6 entera): 192.0.2 es común a los dos, así que caen en el mismo servidor. La dirección entera es lo que usa `source` en HAProxy, y por eso tienta. `ip_hash` no consulta la carga, y NGINX no permite combinar `backup` con `ip_hash`.',
    },
    {
      id: 'op4m2q3',
      domain: 'Balanceo y alta disponibilidad',
      prompt:
        'Según la RFC 2391, ¿qué diferencia hay entre LSNAT y LS-NAPT al repartir sesiones entrantes entre un grupo de servidores?',
      choices: [
        'LSNAT reparte por *round robin* y LS-NAPT por menos carga',
        'LSNAT es un estándar de Internet y LS-NAPT una extensión informativa',
        'LSNAT traduce también el puerto y LS-NAPT solo la dirección',
        'LSNAT cambia solo el destino y el servidor ve al cliente; LS-NAPT cambia también el origen y el servidor ve al router',
      ],
      answer: 3,
      explain:
        'La RFC 2391 (§3.3) describe LSNAT como la traducción del destino, que deja ver al servidor la IP real del cliente pero obliga a que toda la sesión pase por el mismo router (§1), y LS-NAPT como la traducción de destino y origen, que no exige topología a cambio de esconder al cliente. La confusión con el puerto viene de NAPT, que en la RFC 3022 sí añade el puerto a la traducción, pero no es eso lo que separa estos dos modos. Los algoritmos son independientes del modo, y la RFC 2391 entera es informativa.',
    },
    {
      id: 'op4m2q4',
      domain: 'Balanceo y alta disponibilidad',
      prompt:
        'Tras poner un balanceador en modo proxy completo delante de dos servidores web, el equipo de seguridad ve que en los registros de los servidores todas las peticiones vienen de la misma dirección interna. ¿Cuál es la explicación?',
      choices: [
        'Los clientes salen a Internet con CGNAT y comparten dirección pública',
        'El balanceador reescribe el origen con una dirección propia, así que el servidor lo ve a él como cliente',
        'El algoritmo de *hash* de origen agrupa a todos los clientes en la misma dirección',
        'Los servidores responden directamente al cliente y anotan la VIP',
      ],
      answer: 1,
      explain:
        'En un proxy completo (y en el NAT de origen, LS-NAPT en la RFC 2391) el balanceador sustituye el origen por una dirección suya; la respuesta vuelve a él sin exigir nada a la red, pero el servidor pierde la IP del cliente. Se recupera con `X-Forwarded-For`, `Forwarded` o el protocolo PROXY, que son materia de la lección de capa 7. El CGNAT tienta, pero daría direcciones públicas variadas, no una interna. El *hash* elige servidor, no reescribe direcciones. Y anotar la VIP como origen no tiene sentido en ningún modo.',
    },
    {
      id: 'op4m2q5',
      domain: 'Balanceo y alta disponibilidad',
      prompt:
        'Por el puerto 443 de 203.0.113.10 el Consorcio publica www.arcedo.example y sede.arcedo.example, que resuelven a esa misma dirección. ¿Por qué un balanceador de capa 4 puro, sin leer nada del contenido, no puede mandar cada nombre a su grupo?',
      choices: [
        'Porque la capa 4 no admite dos grupos detrás de la misma VIP',
        'Porque el encaminador reenvía el puerto 443 con NAT de origen y borra el nombre',
        'Porque solo ve direcciones y puertos, idénticos para los dos nombres; el nombre va en el SNI del ClientHello y en `Host`, que viaja dentro del HTTP cifrado',
        'Porque la capa 4 necesita que cada nombre tenga su propio certificado instalado en el balanceador',
      ],
      answer: 2,
      explain:
        'Las dos conexiones llegan a 10.20.72.70:443: para la capa 4 son indistinguibles. El nombre viaja en el SNI del ClientHello (que algunos productos leen sin descifrar, un caso intermedio) y en `Host`, que va cifrado dentro de TLS. Por eso el ADC del Consorcio termina TLS y trabaja en capa 7. El certificado tienta, pero un balanceador de capa 4 no lo necesita, precisamente porque no descifra. Nada impide varios grupos tras una VIP si hay algo con qué distinguirlos. Y el encaminador no toca el nombre: reenvía el puerto 443 a la VIP, y el nombre viaja dentro de la conexión, no en las cabeceras IP.',
    },
    {
      id: 'op4m2q6',
      domain: 'Balanceo y alta disponibilidad',
      prompt:
        'En HAProxy 3.4, un técnico pone `weight 0` a uno de los servidores de un *backend*. ¿Qué ocurre según el manual?',
      choices: [
        'Da un error de configuración, porque el peso mínimo es 1',
        'El servidor pasa a ser de reserva y solo recibe tráfico si caen los demás',
        'El servidor recibe el mismo reparto que los demás, porque 0 significa «peso por defecto»',
        'El servidor deja de recibir reparto, pero sigue aceptando las conexiones persistentes que ya le correspondan',
      ],
      answer: 3,
      explain:
        'En HAProxy el peso va de 0 a 256, con 1 por defecto, y 0 saca al servidor del reparto sin cortarle las conexiones persistentes: es una forma de vaciarlo poco a poco. La reserva tienta, pero es otro parámetro, `backup`, y solo entra cuando no queda ningún servidor normal. El 0 no es un valor inválido ni equivale al peso por defecto.',
    },
    {
      id: 'op4m2q7',
      domain: 'Balanceo y alta disponibilidad',
      prompt:
        'Una organización reparte un servicio de directorio, con conexiones que duran horas, entre dos servidores con HAProxy en `mode tcp`. Con `roundrobin` uno va saturado y el otro casi vacío. ¿Qué cambio propone la documentación de HAProxy para este tipo de servicio?',
      choices: [
        'Cambiar a `balance leastconn`, recomendado para sesiones largas como LDAP o SQL',
        'Cambiar a `mode http`, porque `roundrobin` solo equilibra bien en capa 7',
        'Cambiar a `balance static-rr`, para que los pesos no se recalculen',
        'Cambiar a `balance first`, para llenar primero un servidor y luego el otro',
      ],
      answer: 0,
      explain:
        'HAProxy recomienda `leastconn` para sesiones largas (cita LDAP y SQL, entre otras): las conexiones nuevas van al servidor con menos conexiones abiertas, que compensa las duraciones desiguales. `mode http` no sirve para un directorio, que no habla HTTP. `static-rr` es el mismo turno con pesos fijos, y `first` concentra la carga a propósito, justo lo contrario de lo que se busca.',
    },
    {
      id: 'op4m2q8',
      domain: 'Balanceo y alta disponibilidad',
      prompt:
        'Un NGINX reparte con `hash $remote_addr` (sin `consistent`) entre cuatro servidores, y se añade un quinto. ¿Qué advierte la documentación sobre los clientes que ya estaban repartidos?',
      choices: [
        'Ninguno cambia de servidor: el *hash* solo se aplica a los clientes nuevos',
        'Puede reasignarse la mayoría de las claves; con `consistent` solo cambiarían unas pocas',
        'Solo cambian los clientes del servidor que tenga más carga',
        'Todos pasan al servidor nuevo hasta que se iguale la carga',
      ],
      answer: 1,
      explain:
        'Sin `consistent`, NGINX avisa de que añadir o quitar un servidor puede reasignar la mayoría de las claves, porque, si el servidor se elige repartiendo el *hash* entre el número de miembros (como en el método módulo N de la RFC 2991), ese número ha cambiado. Con `consistent` (ketama) solo se mueven unas pocas. La RFC 2991 cuantifica el mismo efecto en el reparto entre caminos: módulo N mueve (N−1)/N y HRW solo 1/N. Creer que nadie se mueve es lo que tienta, porque cada cliente conserva su dirección, pero lo que cambia es el divisor.',
    },
  ],
};
