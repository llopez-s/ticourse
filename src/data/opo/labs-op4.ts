import type { ClassifyData, LabMeta, OrderData } from '../labs';

// ---------------------------------------------------------------------------
// Redes y ENS · Bloque 4 (Balanceo y alta disponibilidad) — Consorcio Provincial de Arcedo
// Fuente única: docs/superpowers/sources/2026-11-27-op4-fuentes.md
// Canon: docs/superpowers/canon/arcedo.md §7d (ADC1/ADC2 activo-pasivo, VIP 10.20.72.70,
// grupos www y sede). Lo que sale de un fabricante va rotulado como tal.
// ---------------------------------------------------------------------------

export const OP4_LABS: LabMeta[] = [
  {
    id: 'opl4a',
    sectionId: 'op4',
    title: '¿Capa 4 o capa 7?',
    icon: '🔀',
    minutes: 10,
    xp: 100,
    kind: 'classify',
    brief:
      'Doce funciones que alguien quiere pedirle a un balanceador. Decide si basta con la capa 4 (el equipo trabaja con la conexión: direcciones, puertos y, como mucho, el saludo TLS que viaja en claro) o si hace falta la capa 7 (tiene que leer o escribir los mensajes HTTP). Clasifica la función, no el producto que la ofrece. Necesitas ≥80 %.',
  },
  {
    id: 'opl4b',
    sectionId: 'op4',
    title: 'SEDE2 se cae y vuelve',
    icon: '💓',
    minutes: 10,
    xp: 75,
    kind: 'order',
    brief:
      'Un miembro del grupo sede empieza a fallar su comprobación de salud y, tras arreglarlo, vuelve. Ordena los 8 momentos con los valores por defecto de HAProxy 3.4: una comprobación cada 2000 ms, caído tras 3 fallos seguidos y de vuelta tras 2 aciertos seguidos.',
  },
  {
    id: 'opl4c',
    sectionId: 'op4',
    title: 'Persistencia y TLS a la medida',
    icon: '🍪',
    minutes: 12,
    xp: 100,
    kind: 'classify',
    brief:
      'Doce requisitos para publicar aplicaciones detrás del balanceador. Los que empiezan por «Sesión» piden un método de persistencia; los que empiezan por «Cifrado», un modo de TLS entre el balanceador y los servidores. Elige el que pide cada uno. Necesitas ≥80 %.',
  },
];

// ---------------------------------------------------------------------------
// Order labs
// ---------------------------------------------------------------------------

export const OP4_ORDER_DATA: Record<string, OrderData> = {
  opl4b: {
    prompt:
      'Grupo sede del Consorcio: SEDE1 (10.20.72.91) y SEDE2 (10.20.72.92), puerto 443, detrás de la VIP 10.20.72.70 de la pareja de balanceadores. La comprobación de salud pide GET /salud (por TLS, como el tráfico hacia SEDE1 y SEDE2) y solo da por buena una respuesta 200; la persistencia es una cookie que inserta el balanceador, porque la aplicación guarda la sesión en la memoria de cada servidor. Supuesto: el balanceador usa los valores por defecto de HAProxy 3.4 (valor del fabricante): inter 2000 ms, fall 3, rise 2 y timeout check sin fijar. Una mañana, SEDE2 empieza a contestar 500 a GET /salud. Toca los momentos en el orden en que ocurren.',
    steps: [
      {
        text: 'Primera comprobación fallida de SEDE2: sigue en el reparto',
        detail:
          'A las 10:15:00 GET /salud recibe un 500 en lugar del 200 esperado. Un solo fallo no basta: con fall 3 hacen falta tres seguidos, así que SEDE2 sigue UP y recibiendo peticiones. La respuesta llega enseguida; si no llegara, inter (2000 ms) haría también de tiempo de espera, porque no hay timeout check propio.',
      },
      {
        text: 'Segunda comprobación fallida seguida: SEDE2 aún sigue en el reparto',
        detail:
          'A las 10:15:02, 2000 ms después (inter por defecto; fastinter, el intervalo para los servidores en transición, no está fijado y vale lo mismo que inter), otro 500. Lleva dos fallos seguidos de los tres que pide fall: todavía está UP, aunque ya «bajando».',
      },
      {
        text: 'Tercera comprobación fallida seguida: el balanceador marca SEDE2 como DOWN',
        detail:
          'A las 10:15:04, tercer 500 seguido. Se cumple fall 3 y SEDE2 pasa a DOWN unos 4 s después del primer fallo (tres comprobaciones separadas por 2000 ms). Durante esos segundos le han seguido llegando peticiones: detectar una caída nunca es instantáneo.',
      },
      {
        text: 'Las peticiones dejan de ir a SEDE2 y sus usuarios pierden la sesión',
        detail:
          'Un miembro DOWN no recibe tráfico: las conexiones nuevas van todas a SEDE1. Las peticiones de quien traía la cookie de SEDE2 tampoco pueden ir a ese servidor y acaban en SEDE1 (comportamiento de HAProxy sin `option persist`; valor del fabricante); como la sesión vivía en la memoria de SEDE2, esas personas tienen que volver a identificarse. Es el precio de la persistencia sin sesión compartida.',
      },
      {
        text: 'El administrador ve el aviso, investiga y corrige la aplicación de SEDE2',
        detail:
          'El estado DOWN de SEDE2 aparece en la consola y en los registros del balanceador. Mientras se busca la causa, las comprobaciones siguen cada 2000 ms (downinter, el intervalo para servidores caídos, tampoco está fijado y vale lo mismo que inter) y siguen fallando. Hacia las 10:31 la aplicación queda arreglada y GET /salud vuelve a contestar 200.',
      },
      {
        text: 'Primera comprobación correcta tras el arreglo: SEDE2 sigue DOWN',
        detail:
          'A las 10:31:20 GET /salud recibe un 200. Un acierto no basta: con rise 2 hacen falta dos seguidos, así que SEDE2 sigue fuera del reparto, ya «subiendo». Así se evita que un servidor que falla a ratos entre y salga sin parar.',
      },
      {
        text: 'Segunda comprobación correcta seguida: el balanceador marca SEDE2 como UP',
        detail:
          'A las 10:31:22, 2000 ms después, otro 200. Se cumple rise 2 y SEDE2 pasa a UP unos 2 s después del primer acierto. Con los valores por defecto, caer cuesta tres comprobaciones y volver solo dos.',
      },
      {
        text: 'SEDE2 vuelve a recibir conexiones nuevas en el reparto',
        detail:
          'El balanceador vuelve a repartir entre SEDE1 y SEDE2, así que las conexiones nuevas pueden ir otra vez a SEDE2. Quien rehízo su sesión en SEDE1 lleva ahora la cookie de SEDE1 y se queda allí. Si se hubiera configurado slowstart, el peso de SEDE2 subiría poco a poco en lugar de golpe (valor del fabricante: HAProxy).',
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Classify labs
// ---------------------------------------------------------------------------

export const OP4_CLASSIFY_DATA: Record<string, ClassifyData> = {
  opl4a: {
    passPct: 80,
    categories: [
      { id: 'l4', label: 'Capa 4 basta' },
      { id: 'l7', label: 'Hace falta capa 7' },
    ],
    items: [
      {
        text: 'Repartir entre dos servidores un servicio TCP que no es HTTP, por ejemplo LDAP',
        answer: 'l4',
        why: 'Basta con la conexión: no hay mensajes HTTP que leer. HAProxy reparte así en mode tcp, su modo por defecto, pensado para SSL, SSH, SMTP y otros protocolos, y recomienda leastconn para sesiones largas como LDAP o SQL (valor del fabricante: HAProxy 3.4).',
      },
      {
        text: 'Mandar siempre al mismo servidor a los clientes que llegan con la misma IP de origen',
        answer: 'l4',
        why: 'La IP de origen está en la cabecera IP: no hace falta abrir nada más. Es el algoritmo source de HAProxy, pensado para el modo TCP sin cookies. Ojo: si cambia el número de servidores, muchos clientes cambian de servidor (valor del fabricante: HAProxy 3.4).',
      },
      {
        text: 'Contarle al servidor la IP y el puerto del cliente original con el protocolo PROXY',
        answer: 'l4',
        why: 'El protocolo PROXY antepone una cabecera al principio de cada conexión TCP, sin tocar lo que viaja dentro, así que funciona también con tráfico que no es HTTP. No es una RFC: es una especificación de HAProxy Technologies, adoptada por NGINX y AWS NLB. El servidor tiene que estar configurado para esperarla.',
      },
      {
        text: 'Dejar que el TLS llegue sin abrir hasta los servidores, que tienen la clave privada',
        answer: 'l4',
        why: 'Es el paso directo: el balanceador reenvía bytes cifrados sin descifrarlos, así que nunca ve HTTP. A cambio, no puede leer Host, insertar cookies ni añadir cabeceras. HAProxy lo hace en mode tcp (valor del fabricante).',
      },
      {
        text: 'Elegir el grupo de servidores según el nombre que el cliente pone en el SNI, sin descifrar la conexión',
        answer: 'l4',
        why: 'El SNI viaja en claro en el ClientHello (RFC 6066), antes de cualquier mensaje HTTP. HAProxy lo lee en mode tcp con req.ssl_sni y NGINX con ssl_preread, sin terminar TLS (valor del fabricante). Con ECH (RFC 9849), el SNI exterior lleva el public_name, no el nombre real.',
      },
      {
        text: 'Dar por sano a un miembro si acepta la conexión TCP en su puerto',
        answer: 'l4',
        why: 'Es la comprobación por defecto de HAProxy con check: «disponible» significa que se puede establecer la conexión (valor del fabricante). Basta con el saludo TCP. Por eso miente cuando el puerto está abierto y la aplicación está rota.',
      },
      {
        text: 'Mandar al grupo sede las peticiones a sede.arcedo.example y al grupo www las de www.arcedo.example según la cabecera Host, una vez descifrado el TLS',
        answer: 'l7',
        why: 'Host es un campo de la petición HTTP (RFC 9110 §7.2; en HTTP/2, a veces :authority): hay que leer el mensaje. HAProxy recuerda que el cliente puede usar varios nombres en la misma conexión, por eso conviene enrutar por Host y no solo por SNI (RFC 9113 §9.1.1).',
      },
      {
        text: 'Insertar una cookie de persistencia con el identificador del servidor que atendió',
        answer: 'l7',
        why: 'La cookie viaja en Set-Cookie y vuelve en Cookie, dos campos HTTP (RFC 6265 §4.1). Hay que escribir en la respuesta y leer la petición. En HAProxy, cookie insert necesita mode http: sin él no hay Host, rutas ni cookies (valor del fabricante).',
      },
      {
        text: 'Añadir la cabecera Forwarded (o X-Forwarded-For) con la IP del cliente',
        answer: 'l7',
        why: 'Hay que escribir un campo nuevo en la petición HTTP. Forwarded es la normalizada (RFC 7239) y X-Forwarded-For no está normalizada. HAProxy tiene option forwarded y option forwardfor. Ninguna es fiable si la trae el cliente (RFC 7239 §8.1).',
      },
      {
        text: 'Mandar a otro grupo de servidores las peticiones cuya ruta empieza por /api/',
        answer: 'l7',
        why: 'La ruta es parte del URI de la petición HTTP, que solo se ve leyendo el mensaje. Es conmutar por contenido: HAProxy lo hace en mode http y el ALB de AWS, que trabaja en capa 7, enruta por contenido con sus reglas (valor del fabricante).',
      },
      {
        text: 'Que la comprobación de salud pida GET /salud y solo dé por sano a SEDE1 si recibe un 200',
        answer: 'l7',
        why: 'La comprobación tiene que enviar una petición HTTP y leer el código: es una comprobación de capa 7 (HAProxy: option httpchk con http-check expect status). Comprobar y repartir son funciones distintas: el NLB de AWS reparte en capa 4 y aun así ofrece comprobaciones HTTP (valor del fabricante).',
      },
      {
        text: 'Contestar al cliente un 503 con Retry-After cuando no queda ningún miembro disponible',
        answer: 'l7',
        why: 'Hay que generar una respuesta HTTP: 503 Service Unavailable, con Retry-After para decir cuánto esperar (RFC 9110 §15.6.4 y §10.2.3). HAProxy devuelve 503 cuando ningún servidor puede atender (valor del fabricante). En capa 4 solo se puede cortar o rechazar la conexión.',
      },
    ],
  },
  opl4c: {
    passPct: 80,
    categories: [
      { id: 'cookie', label: 'Persistencia por cookie' },
      { id: 'ip', label: 'Persistencia por IP de origen' },
      { id: 'none', label: 'Sin persistencia' },
      { id: 'term', label: 'TLS terminado en el balanceador (en claro hacia dentro)' },
      { id: 'recrypt', label: 'TLS terminado y recifrado hacia los servidores' },
      { id: 'pass', label: 'TLS en paso directo (el balanceador no descifra)' },
    ],
    items: [
      {
        text: 'Sesión: la sede electrónica guarda la sesión en la memoria de cada servidor y muchos ciudadanos llegan desde la misma IP pública del NAT de su operador',
        answer: 'cookie',
        why: 'Con IP de origen, todos los que comparten esa IP irían al mismo servidor: AWS lo avisa para sus sticky sessions de capa 4, y el ip_hash de NGINX agrupa además por los tres primeros octetos. La cookie distingue cada navegador. Es la elección del Consorcio para el grupo sede (cookie que inserta el balanceador).',
      },
      {
        text: 'Sesión: la aplicación guarda la sesión en la memoria del servidor y el ciudadano puede pasar del wifi a los datos móviles a mitad del trámite',
        answer: 'cookie',
        why: 'Al cambiar de red cambia la IP de origen, y la persistencia por IP lo mandaría a otro servidor sin su sesión. La cookie viaja con el navegador en cada petición (RFC 6265 §4.1) y no depende de la IP. La cookie insertada por HAProxy es de sesión: se pierde al cerrar el navegador (valor del fabricante).',
      },
      {
        text: 'Sesión: un servicio TCP que no es HTTP guarda estado por cliente y el balanceador trabaja en modo TCP',
        answer: 'ip',
        why: 'Sin HTTP no hay cookies que insertar ni leer. Queda la IP de origen: HAProxy presenta su algoritmo source como solución para el modo TCP sin cookies, o una stick-table con stick on src (valor del fabricante). Mientras no cambie el número de servidores, misma IP, mismo servidor.',
      },
      {
        text: 'Sesión: los clientes son programas de otras administraciones que no guardan cookies, cada uno con su propia IP fija, y la aplicación guarda estado en la memoria del servidor',
        answer: 'ip',
        why: 'Una cookie que el cliente no devuelve no sirve para nada. Como cada cliente tiene una IP propia y estable, la persistencia por IP de origen los mantiene en su servidor: es la persistencia «best-effort» del algoritmo source de HAProxy (valor del fabricante).',
      },
      {
        text: 'Sesión: la web informativa sirve las mismas páginas a todo el mundo, sin identificarse ni carrito',
        answer: 'none',
        why: 'No hay estado que conservar: cualquier miembro puede contestar cualquier petición, y el balanceador elige siempre según su algoritmo. Es el grupo www del Consorcio: sin persistencia y por menos conexiones.',
      },
      {
        text: 'Sesión: la aplicación guarda las sesiones en una base de datos que leen todos los miembros del grupo',
        answer: 'none',
        why: 'Con la sesión compartida, cualquier servidor puede atender la siguiente petición, así que no hace falta persistencia. Además, si cae un miembro nadie pierde la sesión, cosa que sí pasa con cookie o IP cuando la sesión vive en la memoria del servidor caído.',
      },
      {
        text: 'Cifrado: la web informativa es de categoría BÁSICA y el balanceador debe quitarles a WEB1 y WEB2 todo el trabajo del cifrado',
        answer: 'term',
        why: 'Es la descarga de TLS («crypto offload», RFC 7239 §1): el balanceador termina TLS y habla HTTP en claro con los servidores. Es el grupo www del Consorcio: TLS terminado en el balanceador y miembros en el puerto 80.',
      },
      {
        text: 'Cifrado: WEB1 y WEB2 solo escuchan HTTP en el puerto 80 y el balanceador tiene que añadir Forwarded con proto=https',
        answer: 'term',
        why: 'Si los servidores solo hablan HTTP, el tramo interno va en claro: el TLS termina en el balanceador. proto sirve precisamente para eso: el proxy inverso hace de «crypto offloader» y le dice al servidor que el cliente llegó por https (RFC 7239 §5.4).',
      },
      {
        text: 'Cifrado: la sede electrónica es un sistema MEDIA, el tramo entre el balanceador y SEDE1/SEDE2 también tiene que ir cifrado y el balanceador debe insertar una cookie en las respuestas',
        answer: 'recrypt',
        why: 'Insertar la cookie exige ver HTTP, así que el balanceador termina TLS; el tramo interno cifrado exige abrir otra conexión TLS hacia los servidores. Es el recifrado, la elección del Consorcio para el grupo sede (puerto 443).',
      },
      {
        text: 'Cifrado: el balanceador debe repartir por la ruta del URL y los servidores solo aceptan conexiones TLS en el puerto 443',
        answer: 'recrypt',
        why: 'La ruta solo se ve descifrando la petición, así que el paso directo no sirve. Como los servidores solo aceptan TLS, tampoco vale mandarles HTTP en claro: el balanceador termina TLS, decide y vuelve a cifrar hacia el 443.',
      },
      {
        text: 'Cifrado: la clave privada del certificado solo puede estar en los servidores y el balanceador no debe ver nunca el contenido',
        answer: 'pass',
        why: 'Sin la clave, el balanceador no puede terminar TLS: reenvía la conexión cifrada (paso directo). Solo puede decidir por direcciones, puertos o el SNI en claro (HAProxy req.ssl_sni, NGINX ssl_preread; valor del fabricante), y persistir por IP, porque no ve cookies.',
      },
      {
        text: 'Cifrado: los servidores autentican al ciudadano con certificado de cliente (TLS mutuo) y quieren comprobarlo ellos mismos en su propio saludo TLS',
        answer: 'pass',
        why: 'Si el balanceador termina TLS, el certificado del cliente se presenta al balanceador y no al servidor: como mucho se lo pasa en la cabecera Client-Cert (RFC 9440, informativa). Para que el servidor lo reciba en su propio saludo (CertificateRequest, RFC 9846 §4.4.2), el TLS tiene que llegarle sin abrir.',
      },
    ],
  },
};
