import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// OP4M4 — Comprobaciones de salud: activas y pasivas, niveles, umbrales,
// drenaje, todos caídos, comprobaciones que mienten y BFD
// Fuente única: docs/superpowers/sources/2026-11-27-op4-fuentes.md
// (§1 RFC 9110, §7 BFD, §9.1–§9.2 HAProxy 3.4, §11 NGINX, §12 AWS ELB, §17, §18)
// Escenario: docs/superpowers/canon/arcedo.md §7d
// ---------------------------------------------------------------------------
export const OP4_M4: Module = {
  id: 'op4m4',
  sectionId: 'op4',
  title: 'Comprobaciones de salud',
  minutes: 25,
  objectives: [
    'Distinguir las comprobaciones de salud activas de las pasivas y las de nivel L3, L4 y L7, y decir qué fallo ve y qué fallo no ve cada una',
    'Calcular, con los valores por defecto de un fabricante concreto (HAProxy 3.4, AWS ALB), cuánto tarda un miembro caído en salir del grupo y cuánto en volver, y explicar el papel de los umbrales frente al flapping',
    'Retirar un miembro sin cortar a sus usuarios con el drenaje de conexiones, y separar los estados de HAProxy drain y maint y el retraso de baja de AWS',
    'Contrastar qué hace un balanceador cuando caen todos los miembros: el 503 de HAProxy frente al fail open del ALB de AWS',
    'Reconocer las comprobaciones que mienten y diseñar un punto de salud con sentido, aplicado a los grupos www y sede del Consorcio',
  ],
  blocks: [
    {
      t: 'p',
      md: 'Un balanceador reparte peticiones entre los miembros de un grupo (*pool*), como se vio en la lección de capa 4. Pero repartir solo tiene sentido si sabe **qué miembros pueden atender**: mandar un tercio de los usuarios a un servidor apagado es peor que no tener balanceador. Para saberlo hace **comprobaciones de salud** (*health checks*): pregunta a cada miembro, cada cierto tiempo, si está bien, y lo saca del reparto cuando deja de estarlo. Parece sencillo, y casi todo lo interesante está en los detalles: **qué** se pregunta, **cada cuánto**, **cuántos fallos** hacen falta para dar a alguien por muerto y qué pasa cuando la respuesta engaña. Un aviso antes de empezar: las comprobaciones de salud **no están normalizadas**. No hay RFC que fije intervalos ni umbrales; cada cifra de esta lección es un **valor del fabricante**, con el fabricante y la versión al lado.',
    },
    { t: 'h', text: 'Activas y pasivas' },
    {
      t: 'p',
      md: 'Una comprobación **activa** la genera el propio balanceador: abre una conexión o envía una petición de prueba a cada miembro, haya clientes o no. Una comprobación **pasiva** no envía nada: **observa el tráfico real** de los clientes y, si un miembro empieza a fallar (no acepta conexiones, devuelve errores, no contesta a tiempo), lo aparta. La activa detecta un miembro roto **antes** de que le llegue un usuario; la pasiva lo detecta **porque** le ha llegado, y algún usuario se lleva el error. A cambio, la pasiva ve exactamente lo que ven los clientes y no carga los servidores con peticiones de prueba. Los fabricantes las combinan de forma distinta, y es fácil equivocarse: la versión libre de NGINX **solo** tiene comprobaciones pasivas; la activa, la directiva `health_check`, es de NGINX Plus. Y AWS, en sus balanceadores **ALB** (*Application Load Balancer*, que trabaja en capa 7) y **NLB** (*Network Load Balancer*, en capa 4), hace comprobaciones activas.',
    },
    {
      t: 'table',
      headers: ['Fabricante', 'Activa', 'Pasiva', 'Valores por defecto (valor del fabricante)'],
      rows: [
        ['**HAProxy 3.4**', '`check` en cada servidor; sin `check`, el servidor se da **siempre por disponible**', '`observe layer4` o `observe layer7`: desactivada por defecto y exige `check`', '`inter` 2000 ms, `fall` 3, `rise` 2; `error-limit` 10 errores seguidos y `on-error fail-check`'],
        ['**NGINX** (libre)', 'No la tiene', 'Integrada: `max_fails` y `fail_timeout` en cada servidor del `upstream`', '`max_fails` **1**, `fail_timeout` **10 s**: un fallo en 10 s y el servidor queda 10 s como no disponible; luego se le prueba con peticiones reales'],
        ['**NGINX Plus**', '`health_check` (módulo `ngx_http_upstream_hc_module`)', 'La misma de la versión libre', '`interval` 5 s, `fails` 1, `passes` 1, `uri` /; falla todo lo que no sea 2xx o 3xx'],
        ['**AWS** (ALB y NLB)', 'Comprobaciones del grupo de destinos (*target group*)', 'La documentación del NLB las menciona (no se usan con persistencia); no se detallan aquí', 'Ver la tabla de umbrales más abajo'],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'Una organización publica una aplicación detrás de NGINX en su versión libre, sin directivas especiales. Uno de los servidores se cuelga. ¿Cómo se entera NGINX?',
        choices: [
          'Por una comprobación activa que envía cada 5 segundos una petición a /',
          'Por una comprobación ICMP que viene activada por defecto',
          'No se entera nunca: sin health_check no hay ninguna comprobación',
          'Cuando una petición real de un cliente falla contra ese servidor: la comprobación pasiva lo aparta durante fail_timeout',
        ],
        answer: 3,
        explain:
          'La versión libre de NGINX solo tiene la comprobación pasiva integrada: con los valores por defecto, max_fails 1 y fail_timeout 10 s, el primer fallo de una petición real deja el servidor fuera 10 s, y después se le vuelve a probar con tráfico de clientes. La primera opción describe health_check, que tiene esos valores (5 s y /) pero es de NGINX Plus. Que no haya comprobación activa no significa que no haya ninguna.',
      },
    },
    { t: 'h', text: 'Niveles: L3, L4 y L7' },
    {
      t: 'p',
      md: 'La segunda pregunta es **qué** se comprueba, y cada nivel ve un poco más que el anterior. Una comprobación de **capa 3** con ICMP (*Internet Control Message Protocol*), es decir, un *ping*, solo dice que el equipo responde en la red: el sistema operativo contesta aunque la aplicación esté parada. Ninguno de los fabricantes de esta lección la documenta como método de comprobación (HAProxy y AWS comprueban por TCP o HTTP; NGINX, por HTTP), así que aquí queda como concepto. Una comprobación de **capa 4** abre una **conexión TCP** al puerto del servicio: si el saludo se completa, hay un proceso escuchando. Es lo que hace HAProxy con un `check` a secas: «disponible» significa que la conexión se puede **establecer** (TCP, o TLS si se añade `check-ssl`). Es también la comprobación por defecto del NLB de AWS. Una comprobación de **capa 7** va más allá: envía una **petición HTTP** y mira el **código de estado** y, si se pide, el **contenido** de la respuesta. En HAProxy se activa con `option httpchk`, que por defecto envía **OPTIONS /** en **HTTP/1.0** y sin cabecera `Host`, y da por buenas las respuestas **2xx y 3xx**; con `http-check expect` se puede exigir un código concreto (`status`, `rstatus`), una cabecera (`hdr`, `fhdr`) o un texto en el cuerpo (`string`, `rstring`), y cualquiera de esas condiciones se puede negar con `!`. El ALB de AWS comprueba por defecto con **GET /** y solo acepta **200**.',
    },
    {
      t: 'table',
      headers: ['Nivel', 'Qué hace', 'Qué demuestra', 'Qué no ve'],
      rows: [
        ['**L3** (ICMP)', 'Envía un eco y espera la respuesta', 'Que el equipo está encendido y alcanzable', 'Que el servicio escuche; que la aplicación funcione'],
        ['**L4** (TCP)', 'Abre una conexión al puerto del servicio', 'Que hay un proceso aceptando conexiones en ese puerto', 'Que la aplicación responda bien: un servidor web que devuelve **500** a todo sigue aceptando conexiones'],
        ['**L7** (HTTP)', 'Envía una petición y comprueba código y, opcionalmente, contenido', 'Que la aplicación contesta lo esperado a esa petición', 'Lo que esa petición concreta no toque: si la URL no usa la base de datos, una base de datos caída pasa inadvertida'],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'En un balanceador, un grupo se comprueba solo con ping. El servicio web de uno de los miembros se detiene, pero el sistema operativo sigue en marcha. ¿Qué pasa?',
        choices: [
          'El balanceador saca al miembro enseguida, porque el ping falla',
          'El miembro sigue en el reparto: el ping solo demuestra que el equipo responde, no que el servicio funcione',
          'El balanceador lo saca tras tres ping fallidos, porque fall vale 3',
          'El miembro sale del reparto porque ICMP comprueba también el puerto 80',
        ],
        answer: 1,
        explain:
          'Una comprobación de capa 3 solo ve que el equipo contesta en la red, y el sistema operativo sigue contestando al eco aunque el servicio esté parado: el miembro recibe peticiones que fallarán. La tercera opción mezcla un valor de HAProxy, fall 3, que cuenta comprobaciones fallidas, con una comprobación que aquí no falla. ICMP no tiene puertos.',
      },
    },
    { t: 'h', text: 'Intervalo, umbrales y la cuenta del tiempo' },
    {
      t: 'p',
      md: 'Toda comprobación activa tiene cuatro mandos. El **intervalo** dice cada cuánto se comprueba. El ***timeout*** dice cuánto se espera una respuesta antes de dar la comprobación por fallida. El **umbral de bajada** dice cuántos fallos **seguidos** hacen falta para sacar a un miembro, y el **umbral de subida**, cuántos aciertos seguidos para volver a meterlo. En HAProxy son `inter`, `timeout check` (si no se fija, el propio `inter` hace de *timeout*), `fall` y `rise`; en AWS, *interval*, *timeout*, *unhealthy threshold* y *healthy threshold*. Que haga falta **más de un** fallo evita sacar a un miembro por una petición perdida; que la subida pida varios aciertos evita meter a uno que todavía no está estable. Lo que cambia de un fabricante a otro son los números, y cambian mucho.',
    },
    {
      t: 'table',
      headers: ['Fabricante (valor del fabricante)', 'Intervalo', 'Timeout', 'Para salir', 'Para volver', 'Qué vale como bueno'],
      rows: [
        ['**HAProxy 3.4** (`check`)', '2 s (`inter`)', 'El propio `inter`, si no hay `timeout check`', '3 fallos (`fall`)', '2 aciertos (`rise`)', 'TCP: conectar; con `httpchk`: 2xx y 3xx'],
        ['**NGINX Plus** (`health_check`)', '5 s', '—', '1 (`fails`)', '1 (`passes`)', '2xx y 3xx'],
        ['**NGINX** libre (pasiva)', '—', '—', '1 fallo en 10 s (`max_fails`, `fail_timeout`)', 'Tras 10 s se le prueba con tráfico real', 'Lo que decida `proxy_next_upstream`'],
        ['**AWS ALB**', '30 s (de 5 a 300)', '5 s (de 2 a 120)', '2 (*unhealthy*)', '5 (*healthy*)', '200 (configurable de 200 a 499)'],
        ['**AWS NLB**', '30 s (de 5 a 300)', '10 s en TCP y HTTPS; 6 s en HTTP', '2', '5', 'TCP: conectar; HTTP: 200–399'],
      ],
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Cuánto tarda un miembro caído en salir y en volver (aritmética con valores por defecto)',
      text: `HAProxy 3.4 (valores del fabricante): inter = 2 s, fall = 3, rise = 2
(fastinter y downinter no fijados: valen lo mismo que inter)

Salida. El servidor cae justo después de una comprobación buena:
  t = 0 s   última comprobación buena; el servidor cae
  t = 2 s   1.er fallo
  t = 4 s   2.º fallo
  t = 6 s   3.er fallo  -> DOWN, sale del reparto
  Peor caso, contando solo intervalos: fall x inter = 3 x 2 s = 6 s
  Si cae justo antes de una comprobación: (fall - 1) x inter = 2 x 2 s = 4 s
  Si el servidor no contesta (en vez de rechazar la conexión), cada comprobación
  tiene que agotar su timeout antes de fallar, y la cuenta puede alargarse.

Vuelta. El servidor se recupera:
  rise x inter = 2 x 2 s = 4 s como máximo, contando solo intervalos

AWS ALB (valores del fabricante): intervalo 30 s, 2 fallos, 5 aciertos
  Salida:  2 x 30 s =  60 s
  Vuelta:  5 x 30 s = 150 s (2 min 30 s)

Mientras tanto, las peticiones que el reparto envía al miembro caído fallan.`,
    },
    {
      t: 'p',
      md: 'La cuenta enseña el compromiso. Bajar el intervalo o el umbral de bajada saca antes al miembro roto, pero multiplica las comprobaciones y hace más fácil que un fallo pasajero lo deje fuera. Lo peor es el ***flapping***: un miembro sobrecargado que contesta a veces a tiempo y a veces no **entra y sale** del grupo una y otra vez, y cada vez que vuelve recibe de golpe su parte de la carga, se vuelve a saturar y vuelve a caer. Los umbrales son la defensa: con `fall` 3 un fallo suelto no saca a nadie, y un `rise` más alto exige más tiempo bueno antes de volver. HAProxy añade dos ayudas: `fastinter`, un intervalo distinto mientras el servidor está **en transición** (bajando o subiendo), y `slowstart`, que al volver de un fallo sube el peso y el `maxconn` del servidor de forma **lineal, de 0 a 100 %**, durante el tiempo que se indique, en lugar de darle toda su parte en el primer segundo.',
    },
    {
      t: 'check',
      q: {
        q: 'Un servidor de un grupo de HAProxy 3.4 con los valores por defecto de inter, fall y rise se recupera tras una avería. Contando solo los intervalos, ¿cuánto tarda como máximo en volver al reparto?',
        choices: [
          'Unos 4 segundos: 2 comprobaciones correctas seguidas cada 2 segundos',
          'Unos 6 segundos: 3 comprobaciones correctas seguidas cada 2 segundos',
          'Unos 150 segundos: 5 comprobaciones correctas cada 30 segundos',
          'Vuelve en cuanto pasa la primera comprobación correcta',
        ],
        answer: 0,
        explain:
          'Para volver cuenta rise, que en HAProxy 3.4 vale 2 por defecto, con inter de 2000 ms: 2 × 2 s = 4 s. La segunda opción usa fall, que es el umbral para salir, no para volver. Los 150 s son la vuelta con los valores por defecto del ALB de AWS, otro fabricante. Y volver con un solo acierto es justo lo que el umbral de subida evita.',
      },
    },
    { t: 'h', text: 'Drenaje de conexiones y estados administrativos' },
    {
      t: 'p',
      md: 'Hasta aquí, el balanceador saca a un miembro porque **falla**. Pero a menudo es el administrador quien quiere sacarlo, para actualizarlo o reiniciarlo, y entonces no conviene cortar de golpe a los usuarios que están trabajando con él. Para eso está el **drenaje de conexiones** (*connection draining*): el miembro deja de recibir clientes nuevos, pero se le deja terminar lo que tiene en curso. HAProxy lo ofrece como estado administrativo, que se cambia desde su interfaz de gestión con `set server <backend>/<server> state ready | drain | maint`. En **drain**, el servidor sale del reparto, **se sigue comprobando** y **sigue aceptando conexiones persistentes nuevas**, es decir, las de clientes que la persistencia ya ata a él. En **maint**, no recibe tráfico **ni comprobaciones**: es el estado para trabajar en la máquina. Hay otras dos formas de llegar a lo mismo en HAProxy: poner el peso a **0** (no recibe reparto, sí conexiones persistentes) y `http-check disable-on-404`, con la que el propio servidor pide salir respondiendo **404** a la comprobación y queda en el estado «NOLB», atendiendo solo a sus conexiones persistentes. En AWS, dar de baja un destino lo pasa al estado `draining` durante el **retraso de baja** (*deregistration delay*), que por defecto es de **300 s** (si no le quedan peticiones en curso, la baja termina antes).',
    },
    {
      t: 'table',
      headers: ['Estado o mecanismo (valor del fabricante)', '¿Recibe reparto nuevo?', '¿Atiende a sus clientes persistentes?', '¿Se comprueba?'],
      rows: [
        ['HAProxy **ready**', 'Sí', 'Sí', 'Sí'],
        ['HAProxy **drain**', 'No', 'Sí, incluidas conexiones persistentes nuevas', 'Sí'],
        ['HAProxy **maint**', 'No', 'No', 'No'],
        ['HAProxy peso **0**', 'No', 'Sí', 'Sí (si tiene `check`)'],
        ['HAProxy **NOLB** (respuesta 404 con `disable-on-404`)', 'No', 'Sí', 'Sí: es la propia comprobación la que lo pone ahí'],
        ['AWS **draining** (retraso de baja, *deregistration delay*)', 'No: AWS deja de enviarle peticiones', 'No: deja terminar las peticiones en curso (300 s por defecto), pero una petición nueva con *cookie* de ese destino va a otro destino sano (al revés que el drain de HAProxy)', '—'],
      ],
    },
    {
      t: 'p',
      md: 'La relación con la **persistencia** de la lección anterior es directa. Si la aplicación guarda la sesión **en la memoria de cada servidor**, sacar a un miembro con **maint** tira la sesión de todos sus usuarios; con **drain**, los que ya tenían *cookie* de ese servidor siguen llegando a él hasta que terminan, y los nuevos van a los demás. El precio es que el drenaje dura lo que duren esas sesiones: si la *cookie* insertada es de sesión (en HAProxy, `cookie <name> insert` crea una *cookie* que no se guarda en disco), hay que esperar a que los usuarios cierren el navegador o a que la aplicación caduque su sesión, y en algún momento decidir pasar a **maint**. Cuando el servidor vuelve, pasa a **ready** y, si hay `slowstart`, recupera su parte poco a poco. Si un servidor **cae** en vez de retirarse, no hay drenaje posible: las sesiones que vivían en su memoria se pierden igual.',
    },
    {
      t: 'check',
      q: {
        q: 'En un grupo de HAProxy con persistencia por cookie y sesiones guardadas en la memoria de cada servidor, hay que reiniciar uno de los dos servidores a media mañana sin que nadie pierda lo que está haciendo. ¿Qué secuencia es la correcta?',
        choices: [
          'Ponerlo en maint, reiniciarlo y ponerlo en ready',
          'Apagarlo y dejar que la comprobación de salud lo saque tras tres fallos',
          'Ponerlo en drain, esperar a que sus sesiones terminen, pasarlo a maint, reiniciarlo y devolverlo a ready',
          'Ponerlo en drain y reiniciarlo enseguida, porque drain ya protege las sesiones',
        ],
        answer: 2,
        explain:
          'En drain el servidor deja de recibir usuarios nuevos pero sigue atendiendo a los que la persistencia ata a él; cuando terminan, maint lo deja sin tráfico ni comprobaciones para trabajar, y ready lo devuelve. Pasar directamente a maint, o apagarlo, corta a los usuarios cuya sesión vive en su memoria. Y drenar no sirve de nada si se reinicia antes de que las sesiones acaben.',
      },
    },
    { t: 'h', text: 'Cuando caen todos' },
    {
      t: 'p',
      md: 'Queda el caso extremo: **todos** los miembros fallan la comprobación. Los fabricantes no se ponen de acuerdo, y la diferencia importa. HAProxy, si tiene servidores de reserva (`backup`), recurre primero a ellos: solo se usan cuando no queda ningún servidor normal, y por defecto solo el **primero** que esté operativo. Si tampoco hay reserva, HAProxy responde **503** cuando no hay ningún servidor disponible para atender la petición. El ALB de AWS hace lo contrario: si todos los destinos fallan, **«falla abierto»** (*fail open*) y reparte entre **todos**, como si estuvieran sanos. La documentación solo describe el comportamiento, pero cada uno tiene su lectura: con el 503, el usuario recibe un error claro en vez de ir a un servidor que se cree roto; con el *fail open*, si todos fallan a la vez y lo que falla es la comprobación y no los servidores, el servicio sigue funcionando. Ninguna de las dos es «la de los balanceadores»: hay que saber cuál tiene el equipo propio.',
    },
    {
      t: 'p',
      md: 'El código 503 sí está normalizado. La RFC 9110 (§15.6.4) define **503 Service Unavailable** como la respuesta de un servidor que no puede atender **ahora** por sobrecarga temporal o mantenimiento programado, y dice que **puede** (*MAY*) acompañarla de **`Retry-After`** (§10.2.3), con una fecha o un número de segundos: `Retry-After: 120` pide esperar 2 minutos. Que el balanceador añada esa cabecera depende de su configuración. No hay que confundir el 503 con sus vecinos, que también salen del balanceador: **502 Bad Gateway** es que el servidor de dentro dio una respuesta **no válida** (en HAProxy, vacía, no válida o incompleta) y **504 Gateway Timeout**, que **no respondió a tiempo**.',
    },
    { t: 'h', text: 'Comprobaciones que mienten' },
    {
      t: 'p',
      md: 'Una comprobación de salud solo vale lo que vale la pregunta que hace. Hay varias formas clásicas de que diga «todo bien» cuando no lo está. La primera, la **comprobación TCP con la aplicación rota**: el servidor web acepta la conexión, porque el proceso sigue vivo, pero devuelve **500** a todas las peticiones; un `check` a secas de HAProxy, que solo mira si la conexión se establece, lo mantiene en el reparto. La segunda, la **petición que no toca nada**: el `OPTIONS /` por defecto de `option httpchk` lo puede contestar el servidor web sin llegar a la aplicación. La tercera, los **códigos que se aceptan sin mirar**: como `httpchk` da por buenos los 3xx, un servidor que redirige todas las peticiones a una página de error o de acceso sigue «sano». La cuarta es la más traicionera, porque la escribe el propio equipo: un **punto de salud que siempre dice 200**, por ejemplo un `/salud` que devuelve un texto fijo sin comprobar nada, de modo que la base de datos puede estar caída y el balanceador seguirá mandando usuarios a un servidor que no puede atenderlos.',
    },
    {
      t: 'p',
      md: 'Un punto de salud con sentido responde con **200 solo si el servidor puede atender de verdad** una petición normal, y con otro código si no. En la práctica eso significa comprobar lo que el servidor necesita y es **suyo**: que la aplicación está cargada, que tiene conexión con su base de datos, que le queda espacio para sesiones. Conviene que sea **barato**, porque se va a llamar cada pocos segundos desde el balanceador, y que no exija iniciar sesión. Y hay que pensar en una trampa del otro lado: si el punto de salud comprueba algo **común a todos** los miembros, como una base de datos compartida, cuando ese algo cae **todos** los miembros suspenden a la vez, y se entra en el caso anterior: 503 para todo el mundo en HAProxy, o reparto a ciegas en un ALB. A veces eso es lo correcto, porque sin base de datos no hay servicio; otras veces se prefiere que el punto de salud mire solo lo que distingue a un miembro de otro y vigilar lo común por otra vía. En el lado del balanceador, una comprobación L7 se afina pidiendo el **código exacto** (`http-check expect status 200` en HAProxy) o un **texto** del cuerpo que solo aparezca cuando todo va bien. Y las comprobaciones pasivas ayudan a cazar lo que la activa no ve: en HAProxy, `observe layer7` da por buenos los códigos 100–499, 501 y 505, así que una racha de 500 reales cuenta como errores.',
    },
    {
      t: 'check',
      q: {
        q: 'Un equipo de desarrollo publica un /salud que devuelve siempre «OK» con código 200, sin comprobar nada más. Una noche la aplicación de un servidor pierde la conexión con la base de datos y empieza a dar errores a los usuarios. ¿Qué hace el balanceador, que comprueba GET /salud esperando un 200?',
        choices: [
          'Lo saca del reparto, porque la comprobación es de capa 7',
          'Lo deja en el reparto: la comprobación pregunta a una URL que no depende de la base de datos y sigue recibiendo 200',
          'Lo saca, porque las comprobaciones HTTP detectan cualquier error 500 del servidor',
          'Lo pasa a drain automáticamente hasta que la base de datos vuelve',
        ],
        answer: 1,
        explain:
          'Una comprobación de capa 7 solo ve lo que toca la petición que hace: si /salud contesta 200 sin mirar la base de datos, el balanceador no tiene forma de saber que el servidor no puede atender. Ser L7 no basta; lo que cuenta es qué comprueba esa URL. Los 500 de las peticiones de los usuarios solo los vería una comprobación pasiva, y el estado drain lo pone el administrador, no la comprobación.',
      },
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'En el Consorcio de Arcedo: las comprobaciones de www y sede',
      md: 'La pareja de balanceadores del CPD, el **ADC** (*Application Delivery Controller*, controlador de entrega de aplicaciones) ADC1 `10.20.72.71` y ADC2 `10.20.72.72`, funciona en activo-pasivo con la IP virtual (VIP) `10.20.72.70`, y detrás del puerto 443 hay dos grupos. El grupo **`www`**, WEB1 `10.20.72.81` y WEB2 `10.20.72.82` en el puerto 80, se comprueba con una **petición HTTP a `/` que espera un `200`**. El grupo **`sede`**, SEDE1 `10.20.72.91` y SEDE2 `10.20.72.92` en el puerto 443, con TLS recifrado hacia los servidores, se comprueba con **`GET /salud` esperando un `200`**, así que la comprobación también tiene que ir por TLS. Las dos son de capa 7 y piden un código exacto, no «cualquier 2xx o 3xx». Los intervalos y los umbrales los pone el Consorcio en su ADC: en el grupo `sede`, 2 s, 3 fallos para salir y 2 aciertos para volver, copiados de los valores por defecto de HAProxy 3.4 (valor del fabricante); los de `www` no se fijan. Tres consecuencias de diseño. Primera: si un día la portada de `www` pasa a **redirigir** (un 301 o un 302), una comprobación que espera 200 suspenderá a WEB1 y WEB2 a la vez y el grupo se quedará vacío; hay que comprobar una URL que conteste 200 directamente. Segunda: `/salud` en SEDE1 y SEDE2 solo es útil si comprueba de verdad que la sede puede atender (aplicación y base de datos), y si la base de datos es común, su caída vaciará el grupo entero. Tercera: la sede guarda la sesión en la memoria de cada servidor y usa persistencia por *cookie* que inserta el ADC, así que para actualizar SEDE1 se **drena** primero y solo se pasa a mantenimiento cuando sus usuarios han terminado.',
    },
    {
      t: 'check',
      q: {
        q: 'En el Consorcio, el grupo www se comprueba con una petición HTTP a / que espera exactamente un 200. Se publica en WEB1 y WEB2 una versión nueva de la web en la que / responde con una redirección 301 a /inicio. ¿Qué pasa con el grupo?',
        choices: [
          'Nada: una redirección es una respuesta correcta y la comprobación la acepta',
          'Solo cae el servidor en el que se publicó primero la versión nueva',
          'El ADC pasa a comprobar /inicio automáticamente',
          'WEB1 y WEB2 suspenden la comprobación y el grupo se queda sin miembros sanos aunque los dos servidores funcionen; lo que ve el usuario depende de cómo trate el ADC un grupo vacío',
        ],
        answer: 3,
        explain:
          'La comprobación del Consorcio pide un 200 exacto; un 301 no lo es, así que en cuanto la versión nueva esté en los dos servidores ambos suspenden, y el grupo se vacía por una comprobación mal elegida, no por una avería. La primera opción sería cierta con el criterio por defecto de option httpchk de HAProxy, que acepta 2xx y 3xx, pero aquí se espera un código concreto. Ningún balanceador sigue la redirección por su cuenta para cambiar la URL de la comprobación.',
      },
    },
    { t: 'h', text: 'BFD: otra cosa que también vigila' },
    {
      t: 'p',
      md: 'En redes aparece a veces **BFD** (*Bidirectional Forwarding Detection*, detección bidireccional de reenvío), y conviene saber qué es para no confundirlo con una comprobación de salud. La RFC 5880 lo define como un mecanismo para detectar **en poco tiempo y con poca carga** los fallos del **camino de reenvío** entre dos equipos **adyacentes**, en cualquier medio y capa; su motivo es que los mensajes de saludo de los protocolos de encaminamiento no bajan de un segundo. En su modo **asíncrono**, cada extremo envía paquetes periódicos y, si faltan varios seguidos, da la sesión por caída; el **tiempo de detección** es el multiplicador que anuncia el otro extremo (`Detect Mult`) por el intervalo de transmisión acordado. La RFC 5881 lo lleva sobre IPv4 e IPv6 a un salto, con el puerto UDP **3784** para los paquetes de control. Lo que BFD responde es «¿puedo seguir reenviando hacia ese vecino?», no «¿la web contesta?»: un servidor con la aplicación rota tiene el camino de red en perfecto estado.',
    },
    {
      t: 'links',
      title: 'Lo que se explica en otras lecciones',
      items: [
        { label: 'Alta disponibilidad: activo-pasivo, latido, conmutación y vuelta (lección op4m1)', href: '/learn/op4m1' },
        { label: 'Balanceo en capa 4: VIP, grupos, miembros y algoritmos (lección op4m2)', href: '/learn/op4m2' },
        { label: 'Balanceo en capa 7 y persistencia de sesión por cookie (lección op4m3)', href: '/learn/op4m3' },
        { label: 'VRRP y sus temporizadores: cómo detecta un encaminador de respaldo que el activo ha caído (lección op1m4)', href: '/learn/op1m4' },
      ],
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Lo que más se confunde',
      md: '**Nada de esto está normalizado:** cada intervalo y cada umbral es de un fabricante concreto, en una versión concreta; una cifra sin su fabricante no significa nada. **HAProxy 3.4:** `inter` 2000 ms, `fall` 3, `rise` 2; `check` solo = **conexión establecida**; `option httpchk` = **OPTIONS /** en HTTP/1.0, valen **2xx y 3xx**. **NGINX libre:** solo **pasiva**, `max_fails` 1, `fail_timeout` 10 s; `health_check` es de **NGINX Plus**. **AWS ALB:** 30 s, *timeout* 5 s, **2** para caer, **5** para volver, código 200; **NLB:** TCP por defecto. **Aritmética:** salir ≈ `fall` × `inter` (6 s en HAProxy, 60 s en ALB); volver ≈ `rise` × intervalo (4 s en HAProxy, 150 s en ALB). **Drain ≠ maint:** drain saca del reparto pero se sigue comprobando y **acepta conexiones persistentes nuevas**; maint, ni tráfico ni comprobaciones. **AWS:** retraso de baja de **300 s**. **Todos caídos:** HAProxy, **503** (antes, los `backup`); ALB, **fail open**. **503** (RFC 9110) puede llevar `Retry-After`; **502** respuesta no válida, **504** sin respuesta a tiempo. **Comprobaciones que mienten:** TCP abierto con la aplicación dando 500; `/salud` que siempre dice 200. **ICMP** como método de comprobación: ni HAProxy, ni NGINX, ni AWS lo documentan. **BFD** vigila el camino de reenvío entre vecinos, no la aplicación.',
    },
  ],
  quiz: [
    {
      id: 'op4m4q1',
      domain: 'Balanceo y alta disponibilidad',
      prompt: 'En HAProxy 3.4, un servidor de un backend lleva la palabra check y no hay ninguna otra opción de comprobación (ni option httpchk ni check-ssl). ¿Qué considera HAProxy que es estar disponible?',
      choices: [
        'Que el servidor responda a un ping',
        'Que el servidor conteste 200 a una petición GET /',
        'Que se pueda establecer una conexión TCP con el puerto del servidor',
        'Que el servidor no haya devuelto ningún error 500 en el tráfico real',
      ],
      answer: 2,
      explain:
        'Según el manual de HAProxy 3.4, sin otro método «disponible» significa que la conexión se puede establecer: es una comprobación de capa 4. Una petición HTTP solo se envía con `option httpchk`, y aun así por defecto es OPTIONS / y vale cualquier 2xx o 3xx, no solo 200. Mirar los errores del tráfico real es la comprobación pasiva (`observe`), desactivada por defecto. HAProxy no documenta el *ping* como método.',
    },
    {
      id: 'op4m4q2',
      domain: 'Balanceo y alta disponibilidad',
      prompt:
        'Un servidor de un grupo de HAProxy 3.4, con inter, fall y rise en sus valores por defecto, se apaga justo después de pasar una comprobación y rechaza las conexiones desde ese momento. Contando solo los intervalos, ¿cuántas comprobaciones fallidas hacen falta y cuánto tarda como máximo en salir del reparto?',
      choices: [
        '3 comprobaciones fallidas; unos 6 segundos (3 × 2 s)',
        '2 comprobaciones fallidas; unos 4 segundos (2 × 2 s)',
        '1 comprobación fallida; unos 2 segundos',
        '3 comprobaciones fallidas; unos 90 segundos (3 × 30 s)',
      ],
      answer: 0,
      explain:
        'Para salir cuenta `fall`, 3 fallos seguidos, con `inter` de 2000 ms: si la caída llega justo después de una comprobación buena, los fallos caen a los 2, 4 y 6 s. La segunda opción usa `rise`, que es el umbral de subida. Un solo fallo es el criterio de NGINX (`max_fails` 1 o `fails` 1), y los 30 s son el intervalo por defecto de AWS, no de HAProxy.',
    },
    {
      id: 'op4m4q3',
      domain: 'Balanceo y alta disponibilidad',
      prompt:
        'Un destino de un Application Load Balancer de AWS, con la comprobación de salud en sus valores por defecto, se recupera tras una avería. Contando solo los intervalos, ¿cuántas comprobaciones correctas seguidas necesita y cuánto tarda en volver?',
      choices: [
        '2 comprobaciones; unos 60 segundos',
        '2 comprobaciones; unos 4 segundos',
        '3 comprobaciones; unos 90 segundos',
        '5 comprobaciones; unos 150 segundos',
      ],
      answer: 3,
      explain:
        'En el ALB, el umbral de sano por defecto es 5 comprobaciones seguidas y el intervalo, 30 s: 5 × 30 s = 150 s, dos minutos y medio. Los 2 son el umbral de no sano, el que cuenta para salir (2 × 30 s = 60 s). Los 4 segundos salen de los valores de HAProxy (`rise` 2, `inter` 2 s), que es otro fabricante.',
    },
    {
      id: 'op4m4q4',
      domain: 'Balanceo y alta disponibilidad',
      prompt: 'Todos los miembros de un grupo suspenden a la vez la comprobación de salud y no hay servidores de reserva. ¿Qué hacen HAProxy y el Application Load Balancer de AWS, según su documentación?',
      choices: [
        'Los dos devuelven 503 Service Unavailable a los clientes',
        'HAProxy devuelve 503; el ALB «falla abierto» y reparte entre todos los destinos como si estuvieran sanos',
        'HAProxy reparte entre todos; el ALB devuelve 503',
        'Los dos devuelven 504 Gateway Timeout hasta que algún miembro vuelve',
      ],
      answer: 1,
      explain:
        'El manual de HAProxy dice que devuelve 503 cuando no hay ningún servidor disponible; AWS documenta que, si todos los destinos fallan, el ALB hace *fail open* y envía a todos según el algoritmo. La primera opción generaliza el comportamiento de HAProxy a todos los balanceadores, que es justo la trampa. El 504 es otra cosa: el servidor no respondió a tiempo.',
    },
    {
      id: 'op4m4q5',
      domain: 'Balanceo y alta disponibilidad',
      prompt:
        'Un grupo de dos servidores web se comprueba solo con una conexión TCP al puerto 80. En uno de ellos, el proceso web sigue escuchando pero la aplicación devuelve 500 a todas las peticiones. ¿Qué ocurre y cómo se corrige?',
      choices: [
        'El balanceador lo saca enseguida, porque una conexión TCP detecta los errores 500',
        'El balanceador lo saca tras tres comprobaciones, porque el servidor tarda más en contestar',
        'Sigue en el reparto, porque la conexión se establece; se corrige con una comprobación HTTP que exija el código esperado (y, si hace falta, un texto del cuerpo)',
        'Sigue en el reparto; se corrige bajando el intervalo de comprobación a 1 segundo',
      ],
      answer: 2,
      explain:
        'Una comprobación de capa 4 solo demuestra que hay un proceso aceptando conexiones, y aquí lo hay: el 500 está en la respuesta HTTP, que esa comprobación nunca pide. Hay que subir a capa 7 y exigir el código esperado, por ejemplo con `http-check expect status 200` en HAProxy. Comprobar más a menudo no arregla nada: se seguiría preguntando lo mismo.',
    },
    {
      id: 'op4m4q6',
      domain: 'Balanceo y alta disponibilidad',
      prompt:
        'Según la guía de gestión de HAProxy 3.4, ¿en qué se diferencia el estado administrativo drain del estado maint?',
      choices: [
        'En drain el servidor sale del reparto, se sigue comprobando y acepta conexiones persistentes nuevas; en maint no recibe tráfico ni comprobaciones',
        'En drain el servidor no recibe tráfico ni comprobaciones; en maint sigue atendiendo a sus clientes persistentes',
        'Son el mismo estado con dos nombres; maint es el nombre antiguo',
        'Drain corta todas las conexiones en curso; maint deja que terminen',
      ],
      answer: 0,
      explain:
        'Drain es el estado para retirar un servidor sin cortar a sus usuarios: no recibe reparto nuevo, pero la persistencia sigue llevándole a sus clientes y la comprobación de salud sigue activa. Maint es el estado para trabajar en la máquina: ni tráfico ni comprobaciones. La segunda opción los intercambia, y la cuarta invierte el sentido del drenaje.',
    },
    {
      id: 'op4m4q7',
      domain: 'Balanceo y alta disponibilidad',
      prompt:
        'En AWS Elastic Load Balancing, un administrador da de baja un destino de un grupo para sustituirlo. Con los valores por defecto, ¿qué ocurre?',
      choices: [
        'El destino desaparece del grupo al instante y se cortan las peticiones en curso',
        'El destino sigue recibiendo peticiones nuevas durante 300 s y luego sale',
        'El destino queda en mantenimiento indefinido hasta que se borre a mano',
        'El destino pasa al estado draining durante el retraso de baja, que por defecto es de 300 s',
      ],
      answer: 3,
      explain:
        'AWS documenta que deja de enviar peticiones a un destino que se da de baja, lo pasa al estado draining y espera por defecto 300 s (*deregistration delay*) para que terminen las peticiones en curso; si no le queda ninguna, la baja termina antes. La segunda opción confunde drenar con seguir en el reparto: drenar es justo dejar de recibir peticiones nuevas. La primera olvida ese retraso, que existe para no cortar lo que está en curso, y la baja tampoco es indefinida.',
    },
    {
      id: 'op4m4q8',
      domain: 'Balanceo y alta disponibilidad',
      prompt: '¿Qué detecta BFD (RFC 5880)?',
      choices: [
        'Si una aplicación web responde con el código HTTP esperado',
        'Si un servidor tiene espacio libre para nuevas sesiones',
        'Si un balanceador debe aplicar fail open cuando caen todos los miembros',
        'Los fallos del camino de reenvío entre dos equipos adyacentes, en poco tiempo y con poca carga',
      ],
      answer: 3,
      explain:
        'La RFC 5880 define BFD para detectar los fallos del camino de reenvío entre equipos adyacentes más deprisa que los saludos de los protocolos de encaminamiento, que no bajan de un segundo. No mira aplicaciones: un servidor con la web rota tiene el camino de red intacto, y para eso están las comprobaciones de salud de capa 7. El *fail open* es un comportamiento del ALB de AWS, sin relación con BFD.',
    },
  ],
};
