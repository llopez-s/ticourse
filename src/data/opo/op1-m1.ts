import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// OP1M1 — Modelos OSI y TCP/IP: de la trama al segmento
// ---------------------------------------------------------------------------
export const OP1_M1: Module = {
  id: 'op1m1',
  sectionId: 'op1',
  title: 'Modelos OSI y TCP/IP: de la trama al segmento',
  minutes: 16,
  objectives: [
    'Relacionar las siete capas del modelo OSI con las cuatro de TCP/IP y nombrar la PDU de cada una',
    'Describir los campos de una trama Ethernet II y explicar cómo ARP resuelve una dirección IP en una MAC',
    'Interpretar los campos de la cabecera IPv4 que más se preguntan: TTL, protocolo y fragmentación',
    'Explicar con mensajes ICMP concretos cómo funcionan ping y traceroute',
    'Comparar TCP y UDP: establecimiento en tres pasos, números de secuencia, ventana, cierre y rangos de puertos',
  ],
  blocks: [
    {
      t: 'p',
      md: 'Casi todas las preguntas de redes de un temario de técnico superior acaban en lo mismo: **en qué capa ocurre algo y qué cabecera lo lleva**. Esta lección recorre el camino completo de un dato, desde que una aplicación lo entrega hasta que sale por el cable, y se detiene en los campos que se preguntan con número: los 48 bits de una dirección **MAC**, los 1500 bytes de la **MTU** de Ethernet, el **TTL** que mata los paquetes perdidos, las unidades de 8 bytes de la fragmentación y los tres segmentos con los que **TCP** abre una conexión. El escenario de todo el bloque es el Consorcio Provincial de Arcedo: una sede central, tres oficinas comarcales y un CPD propio sobre la red 10.20.0.0/16.',
    },
    { t: 'h', text: 'Dos modelos y una misma idea: encapsular' },
    {
      t: 'table',
      headers: ['Capa OSI', 'Capa TCP/IP', 'PDU', 'Qué resuelve', 'Ejemplos'],
      rows: [
        ['7 · Aplicación', 'Aplicación', 'Datos', 'El servicio que usa el programa', 'HTTPS, DNS'],
        ['6 · Presentación', 'Aplicación', 'Datos', 'Formato, codificación, compresión y cifrado de los datos', '—'],
        ['5 · Sesión', 'Aplicación', 'Datos', 'Abrir, mantener y cerrar el diálogo entre aplicaciones', '—'],
        ['4 · Transporte', 'Transporte', '**Segmento** (TCP) o **datagrama** (UDP)', 'Comunicación entre procesos, identificados por puertos', 'TCP, UDP'],
        ['3 · Red', 'Internet', '**Paquete** (datagrama IP)', 'Direccionamiento lógico y encaminamiento entre redes', 'IPv4, IPv6, ICMP'],
        ['2 · Enlace de datos', 'Enlace (acceso a la red)', '**Trama**', 'Entrega dentro de un mismo enlace, con direcciones MAC', 'Ethernet, ARP'],
        ['1 · Física', 'Enlace (acceso a la red)', '**Bits**', 'Señales, conectores y medio de transmisión', 'Par trenzado, fibra óptica'],
      ],
    },
    {
      t: 'p',
      md: 'El modelo **OSI**, publicado por ISO, es un modelo **de referencia** de siete capas: sirve para hablar con precisión («eso es un problema de capa 2»), no para describir protocolos reales. El modelo **TCP/IP** es el que se usa de verdad y tiene **cuatro capas** (RFC 1122): enlace, internet, transporte y aplicación. La correspondencia es sencilla: las capas 5, 6 y 7 de OSI se funden en la de aplicación, y las capas 1 y 2 en la de enlace. Lo que une ambos modelos es la **encapsulación**: al emitir, cada capa toma lo que le entrega la superior, le antepone su **cabecera** y lo pasa hacia abajo; al recibir, cada capa quita la suya y sube el resto. Cada capa llama a su unidad de datos, su **PDU**, de una manera: **segmento** en TCP, **paquete** en IP y **trama** en Ethernet. Solo la capa de enlace añade además una **cola**, la secuencia de comprobación de la trama. Y cada tipo de equipo trabaja hasta una capa: un **conmutador (switch)** decide con la dirección MAC, que es de capa 2, y un **encaminador (router)** decide con la dirección IP, que es de capa 3.',
    },
    {
      t: 'check',
      q: {
        q: 'Un navegador envía una petición HTTPS. ¿En qué orden se van creando las PDU mientras el dato baja por la pila del equipo emisor?',
        choices: [
          'Trama, paquete, segmento y bits',
          'Segmento, paquete, trama y bits',
          'Paquete, segmento, trama y bits',
          'Segmento, trama, paquete y bits',
        ],
        answer: 1,
        explain:
          'Al emitir se baja de la capa 4 a la 1: TCP forma el segmento, IP lo mete en un paquete, Ethernet mete el paquete en una trama y la capa física la transmite como bits. El orden inverso (trama, paquete, segmento) es el del equipo que recibe.',
      },
    },
    { t: 'h', text: 'Capa de enlace: la trama Ethernet II y ARP' },
    {
      t: 'table',
      headers: ['Campo de Ethernet II', 'Tamaño', 'Contenido'],
      rows: [
        ['MAC de destino', '6 bytes', 'Dirección de 48 bits del receptor en el enlace; `ff:ff:ff:ff:ff:ff` es la de difusión'],
        ['MAC de origen', '6 bytes', 'Dirección de 48 bits del emisor; siempre es una dirección individual'],
        ['**EtherType**', '2 bytes', 'Protocolo que viaja dentro: `0x0800` IPv4, `0x0806` ARP, `0x86DD` IPv6'],
        ['Datos', '46–1500 bytes', 'La PDU de la capa superior; si ocupa menos de 46 bytes se añade relleno'],
        ['**FCS**', '4 bytes', 'CRC de 32 bits para detectar errores; la trama dañada se descarta, no se corrige'],
      ],
    },
    {
      t: 'p',
      md: 'Sumando los campos, una trama Ethernet mide entre **64 y 1518 bytes** (14 de cabecera, de 46 a 1500 de datos y 4 de FCS), sin contar el preámbulo ni el delimitador de inicio que la preceden; con una etiqueta 802.1Q, que añade 4 bytes, el máximo sube a 1522. La **MTU** es el tamaño máximo del campo de datos, es decir, del paquete IP que cabe en una trama: **1500 bytes** en Ethernet. En el campo de dos bytes que sigue a las direcciones, un valor igual o superior a `0x0600` (1536) se interpreta como EtherType, y un valor de hasta 1500, como longitud, que es el uso original de IEEE 802.3. Una dirección **MAC** tiene **48 bits** y se escribe como seis octetos en hexadecimal: los tres primeros forman el **OUI**, que identifica al fabricante, y los tres últimos los asigna este. El bit menos significativo del primer octeto distingue una dirección individual (0) de una de grupo (1). Para saber qué MAC corresponde a una IP de su misma red, un equipo usa **ARP** (RFC 826): envía una **petición por difusión** («¿quién tiene esta IP?») y el dueño responde con una **respuesta unidifusión**; el resultado se guarda un tiempo en la caché ARP. ARP viaja directamente sobre Ethernet, con EtherType `0x0806` y **sin cabecera IP**, de modo que no atraviesa encaminadores.',
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'En el Consorcio de Arcedo: del puesto de trabajo al CPD',
      md: 'Un puesto de la sede central, `10.20.10.25/24`, abre la aplicación de expedientes que está en el CPD, en `10.20.72.10`. El destino **no es de su subred**, así que el puesto no pregunta por él: lanza una petición ARP por difusión preguntando por su **puerta de enlace**, `10.20.10.1`, y el encaminador responde con su MAC, `00:00:5e:00:53:01` (en la sede ese papel lo hace un conmutador de capa 3, que encamina entre las VLAN; lo verás en la lección de conmutación). La trama que sale del puesto lleva como **MAC de destino la del encaminador** y como **IP de destino la del servidor**. El encaminador quita esa trama, resta 1 al TTL, consulta su tabla de rutas y construye una **trama nueva** hacia el siguiente salto, con otras MAC de origen y de destino. Las direcciones IP no cambian en todo el trayecto; las MAC cambian en cada salto.',
    },
    {
      t: 'check',
      q: {
        q: 'Un equipo necesita la MAC de otro equipo de su misma subred y no la tiene en la caché ARP. ¿Qué direcciones MAC de destino llevan la petición ARP y su respuesta?',
        choices: [
          'Las dos van a la dirección de difusión',
          'La petición va a la MAC de la puerta de enlace y la respuesta a la de difusión',
          'La petición va a la dirección de difusión y la respuesta a la MAC de quien preguntó',
          'Las dos van a direcciones individuales',
        ],
        answer: 2,
        explain:
          'Quien pregunta no conoce la MAC que busca, así que envía la petición a la dirección de difusión, ff:ff:ff:ff:ff:ff; quien responde ya conoce la MAC del que preguntó, porque venía en la petición, y contesta solo a él. La puerta de enlace no interviene cuando el destino está en la misma subred.',
      },
    },
    { t: 'h', text: 'Capa de red: la cabecera IPv4 e ICMP' },
    {
      t: 'p',
      md: 'La cabecera **IPv4** (RFC 791) mide **entre 20 y 60 bytes**: 20 fijos más las opciones. El campo **IHL** indica su longitud en palabras de 32 bits, con un mínimo de 5 (20 bytes) y un máximo de 15 (60 bytes). El campo de **longitud total** tiene 16 bits, así que un datagrama no pasa de 65 535 bytes. El **TTL**, de 8 bits, limita la vida del paquete: **cada encaminador le resta 1** y, si llega a 0, lo descarta y avisa al origen con un mensaje ICMP; así un bucle de encaminamiento no dura para siempre. Como el TTL cambia en cada salto, la **suma de comprobación de la cabecera**, que solo cubre la cabecera, se recalcula en cada encaminador. El campo **protocolo**, también de 8 bits, dice qué hay dentro: **1** ICMP, **6** TCP, **17** UDP. Para la **fragmentación** trabajan tres campos: la **identificación** (16 bits, igual en todos los fragmentos de un datagrama), los indicadores **DF** (*Don\'t Fragment*, prohíbe fragmentar) y **MF** (*More Fragments*, quedan más fragmentos) y el **desplazamiento del fragmento**, de 13 bits, que se mide en **unidades de 8 bytes**. En IPv4 puede fragmentar cualquier encaminador del camino, pero **solo reensambla el destino final**.',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Fragmentar un datagrama de 4000 bytes para una MTU de 1500',
      text: `Datagrama original: longitud total 4000 = 20 de cabecera + 3980 de datos
MTU del enlace de salida: 1500  ->  caben 1500 - 20 = 1480 bytes de datos por fragmento
(1480 es múltiplo de 8, como exige el campo de desplazamiento)

Fragmento   Datos (bytes)   Longitud total   MF   Desplazamiento
    1        0 - 1479            1500         1     0
    2     1480 - 2959            1500         1     1480 / 8 = 185
    3     2960 - 3979            1040         0     2960 / 8 = 370

Comprobación: 1480 + 1480 + 1020 = 3980 bytes de datos
Los tres fragmentos llevan la misma identificación y cada uno su cabecera de 20 bytes.
El último fragmento es el único con MF = 0 y desplazamiento distinto de 0.`,
    },
    {
      t: 'p',
      md: '**ICMP** (RFC 792) es el protocolo de control y de aviso de errores de IP. Sus mensajes viajan dentro de datagramas IP con el campo protocolo a 1 y **no usan puertos**: se identifican por **tipo** y **código**. Tres familias bastan para casi cualquier pregunta. La de **eco**: petición (tipo 8) y respuesta (tipo 0). La de **tiempo excedido** (tipo 11), cuyo código 0 significa que el TTL se agotó en tránsito. Y la de **destino inalcanzable** (tipo 3), con códigos como 0 (red), 1 (equipo), 3 (puerto) y 4 (hacía falta fragmentar y DF estaba activado). **ping** envía peticiones de eco y mide cuánto tardan en volver las respuestas. **traceroute** aprovecha el TTL: manda sondas con TTL 1, 2, 3…; el encaminador en el que se agota cada una devuelve un tiempo excedido, y su dirección de origen revela ese salto. La versión clásica usa sondas UDP dirigidas a un puerto alto, y sabe que ha llegado cuando el destino contesta con un puerto inalcanzable (tipo 3, código 3); la variante que usa peticiones de eco termina al recibir la respuesta de eco.',
    },
    {
      t: 'check',
      q: {
        q: 'Un encaminador recibe un paquete IPv4 con TTL = 1 cuyo destino está en otra red. ¿Qué hace?',
        choices: [
          'Resta 1, descarta el paquete y envía al origen un ICMP de tiempo excedido (tipo 11)',
          'Lo reenvía con TTL = 0 para que lo descarte el siguiente salto',
          'Lo descarta y envía al origen un ICMP de destino inalcanzable (tipo 3)',
          'Lo fragmenta y reinicia el TTL en cada fragmento',
        ],
        answer: 0,
        explain:
          'Al restar 1 el TTL llega a 0, así que el encaminador no reenvía el paquete: lo descarta y lo comunica con un tiempo excedido, tipo 11 y código 0. El destino inalcanzable (tipo 3) indica otra cosa: que no hay ruta, equipo o puerto, o que hacía falta fragmentar con DF activado.',
      },
    },
    { t: 'h', text: 'Capa de transporte: TCP, UDP y los puertos' },
    {
      t: 'p',
      md: '**TCP** (RFC 9293, que sustituye a la RFC 793) ofrece un flujo de bytes **fiable, ordenado y orientado a conexión**. Su cabecera mide **entre 20 y 60 bytes** y numera **bytes**, no segmentos: el **número de secuencia** (32 bits) es el del primer byte que lleva el segmento, y el **número de acuse** (32 bits) es el del **siguiente byte que se espera** recibir. La conexión se abre con el **establecimiento en tres pasos**: **SYN**, **SYN+ACK** y **ACK**. Cada extremo elige su número de secuencia inicial, y tanto SYN como FIN **consumen un número de secuencia** aunque no lleven datos. Los seis indicadores clásicos son SYN, ACK, FIN, **RST** (aborta la conexión), **PSH** (entregar los datos a la aplicación sin esperar) y **URG** (hay datos urgentes). La **ventana**, de 16 bits, es el **control de flujo**: cada receptor anuncia cuántos bytes más puede aceptar, hasta 65 535 salvo que se negocie la opción de escalado de ventana (RFC 7323). En el SYN cada extremo anuncia también su **MSS**, el mayor bloque de datos que acepta en un segmento: con una MTU de 1500 y cabeceras sin opciones, 1500 − 20 − 20 = **1460 bytes**. El cierre ordenado necesita normalmente **cuatro segmentos**, un FIN y su ACK en cada sentido; un RST corta sin más.',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Una conexión TCP completa, con sus números de secuencia',
      text: `   Cliente 10.20.10.25:51514                     Servidor 10.20.72.10:443

   --- Establecimiento en tres pasos -----------------------------------
   SYN        seq=1000                     ---->
                                           <----  SYN+ACK  seq=5000  ack=1001
   ACK        seq=1001  ack=5001           ---->

   --- Datos ------------------------------------------------------------
   PSH+ACK    seq=1001  ack=5001  200 B    ---->
                                           <----  ACK      seq=5001  ack=1201

   --- Cierre ordenado ---------------------------------------------------
   FIN+ACK    seq=1201  ack=5001           ---->
                                           <----  ACK      seq=5001  ack=1202
                                           <----  FIN+ACK  seq=5001  ack=1202
   ACK        seq=1202  ack=5002           ---->

   El SYN y el FIN no llevan datos, pero cada uno gasta un número de secuencia:
   por eso el acuse del SYN es 1001 y el del FIN es 1202.
   Los 200 bytes ocupan los números 1001 a 1200; el acuse 1201 pide el siguiente.`,
    },
    {
      t: 'table',
      headers: ['Característica', 'TCP', 'UDP'],
      rows: [
        ['Norma', 'RFC 9293', 'RFC 768'],
        ['Número de protocolo en IP', '6', '17'],
        ['Conexión', 'Sí: establecimiento en tres pasos y cierre', 'No: cada datagrama es independiente'],
        ['Fiabilidad y orden', 'Acuses, retransmisión y reordenación', 'Ninguna: si hace falta, la pone la aplicación'],
        ['Control de flujo', 'Ventana anunciada por el receptor', 'No tiene'],
        ['Cabecera', '20–60 bytes', '8 bytes: puerto de origen, puerto de destino, longitud y suma de comprobación'],
        ['PDU', 'Segmento', 'Datagrama'],
        ['Encaja con', 'Web, correo, transferencia de ficheros', 'Consultas DNS, voz y vídeo en tiempo real'],
      ],
    },
    {
      t: 'p',
      md: 'Un **puerto** es un número de **16 bits** (de 0 a 65535) que identifica a un proceso dentro de un equipo; cada conexión TCP queda definida por cuatro valores: IP y puerto de origen, IP y puerto de destino. La IANA reparte los puertos en tres rangos (RFC 6335): los **bien conocidos** o de sistema, **0–1023** (por ejemplo, 53 para DNS y 443 para HTTPS); los **registrados** o de usuario, **1024–49151**; y los **dinámicos o privados**, **49152–65535**, que son los que la IANA reserva para los puertos **efímeros** que el cliente elige como origen. Un sistema operativo puede estar configurado con otro rango efímero, pero el de la norma es ese.',
    },
    {
      t: 'check',
      q: {
        q: 'Dos equipos conectados por Ethernet con MTU de 1500 bytes abren una conexión TCP sobre IPv4, con cabeceras IP y TCP sin opciones. ¿Qué MSS anuncia cada uno?',
        choices: ['1500 bytes', '1480 bytes', '1472 bytes', '1460 bytes'],
        answer: 3,
        explain:
          'El MSS cuenta solo los datos del segmento: a los 1500 bytes de la MTU hay que restar 20 de la cabecera IPv4 y 20 de la cabecera TCP, lo que da 1460. El valor 1480 tienta porque es lo que queda al restar solo la cabecera IP, que es el dato que se usa al fragmentar.',
      },
    },
    {
      t: 'video',
      title: 'De la trama al segmento: ARP, la puerta de enlace y TCP frente a UDP',
      youtube: '2nfwf0chOAk',
      poster: 'videos/trama-arcedo-poster.png',
      transcript: 'videos/trama-arcedo-transcript.txt',
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Cómo cae en un examen',
      md: '**Capas y PDU:** siete capas en OSI y cuatro en TCP/IP; segmento (4), paquete (3), trama (2), bits (1). Si la pregunta habla de direcciones MAC o de un conmutador, es capa 2; si habla de direcciones IP o de un encaminador, capa 3; si habla de puertos, capa 4. **Ethernet II:** 6 + 6 + 2 de cabecera, 46–1500 de datos y 4 de FCS; trama de 64 a 1518 bytes; MTU 1500; EtherType `0x0800` IPv4, `0x0806` ARP, `0x86DD` IPv6. **ARP:** petición por difusión, respuesta unidifusión, no sale de la red local; hacia otra subred se resuelve la MAC de la **puerta de enlace**, nunca la del destino final. **IPv4:** cabecera de 20 a 60 bytes; protocolo 1, 6 y 17; desplazamiento del fragmento en **unidades de 8 bytes**; reensambla solo el destino. **ICMP:** eco 8 y 0, destino inalcanzable 3, tiempo excedido 11; sin puertos. **TCP:** SYN, SYN+ACK, ACK; el acuse es el siguiente byte esperado; SYN y FIN consumen un número de secuencia; ventana de 16 bits; cierre con cuatro segmentos. **UDP:** cabecera de 8 bytes. **Puertos:** 0–1023, 1024–49151 y 49152–65535. La trampa más repetida es confundir el **MSS** (1460, datos de TCP) con la **MTU** (1500, paquete IP completo).',
    },
  ],
  quiz: [
    {
      id: 'op1m1q1',
      domain: 'Redes de comunicaciones',
      prompt:
        '¿Qué afirmación relaciona correctamente el modelo OSI con el modelo TCP/IP de cuatro capas?',
      choices: [
        'La capa de internet de TCP/IP agrupa las capas de red y de transporte de OSI',
        'La capa de transporte de TCP/IP agrupa las capas de sesión y de transporte de OSI',
        'La capa de aplicación de TCP/IP agrupa las capas de sesión, presentación y aplicación de OSI',
        'La capa de enlace de TCP/IP equivale solo a la capa física de OSI',
      ],
      answer: 2,
      explain:
        'En TCP/IP no existen capas de sesión ni de presentación separadas: sus funciones quedan dentro de la capa de aplicación, que cubre las capas 5, 6 y 7 de OSI. La opción de la capa de enlace tienta porque esa capa sí agrupa dos de OSI, pero son la física y la de enlace de datos, no solo la física. Las capas de transporte e internet se corresponden una a una con las capas 4 y 3.',
    },
    {
      id: 'op1m1q2',
      domain: 'Redes de comunicaciones',
      prompt:
        'En el Consorcio de Arcedo, el puesto 10.20.10.25/24 envía un paquete al servidor 10.20.72.10. Su puerta de enlace es 10.20.10.1. ¿Qué direcciones de destino lleva la trama que sale del puesto?',
      choices: [
        'MAC de la puerta de enlace e IP del servidor',
        'MAC del servidor e IP del servidor',
        'MAC de la puerta de enlace e IP de la puerta de enlace',
        'MAC de difusión e IP del servidor',
      ],
      answer: 0,
      explain:
        'Con máscara /24, 10.20.72.10 no pertenece a la subred 10.20.10.0, así que el puesto entrega la trama a su puerta de enlace: MAC de destino la del encaminador e IP de destino la del servidor, que no cambia en todo el trayecto. La opción con la MAC del servidor tienta porque sería la correcta si ambos equipos estuvieran en la misma subred. La MAC de difusión solo se usa en la petición ARP previa, no en el paquete de datos.',
    },
    {
      id: 'op1m1q3',
      domain: 'Redes de comunicaciones',
      prompt:
        'Un encaminador debe reenviar un datagrama IPv4 de 3000 bytes de longitud total (cabecera de 20 bytes, DF = 0) por un enlace con MTU de 1500 bytes. ¿Cuántos fragmentos genera y qué desplazamiento lleva el último?',
      choices: [
        'Dos fragmentos; el último con desplazamiento 185',
        'Dos fragmentos; el último con desplazamiento 1500',
        'Tres fragmentos; el último con desplazamiento 2960',
        'Tres fragmentos; el último con desplazamiento 370',
      ],
      answer: 3,
      explain:
        'El datagrama lleva 2980 bytes de datos y en cada fragmento caben 1480 (1500 menos 20 de cabecera), así que salen tres fragmentos con 1480, 1480 y 20 bytes de datos. El desplazamiento se expresa en unidades de 8 bytes: el tercero empieza en el byte 2960, y 2960 / 8 = 370. Dos fragmentos es el error típico de dividir 3000 entre 1500 sin descontar la cabecera que repite cada fragmento, y 2960 olvida la unidad de 8 bytes.',
    },
    {
      id: 'op1m1q4',
      domain: 'Redes de comunicaciones',
      prompt:
        'Desde una oficina comarcal se lanza un traceroute hacia un servidor del CPD. Los saltos 1 y 2 responden, el salto 3 aparece solo con asteriscos y los saltos 4 y 5 (el destino) responden con normalidad. ¿Cuál es la interpretación más razonable?',
      choices: [
        'El encaminador del salto 3 descarta todo el tráfico que lo atraviesa',
        'El encaminador del salto 3 reenvía los paquetes, pero no envía, o limita, los ICMP de tiempo excedido',
        'El paquete se fragmenta en el salto 3 y por eso no hay respuesta',
        'El destino tiene cerrado el puerto UDP al que se dirigen las sondas',
      ],
      answer: 1,
      explain:
        'Las sondas con TTL 4 y 5 tienen que atravesar el salto 3 para llegar a donde se agotan, así que ese encaminador reenvía tráfico; lo único que falta es su propio mensaje de tiempo excedido, que puede estar filtrado o limitado. La primera opción es la que tienta, pero si el salto 3 lo descartara todo tampoco responderían los saltos posteriores. Un puerto UDP cerrado en el destino es justo lo que espera el traceroute clásico para saber que ha llegado.',
    },
    {
      id: 'op1m1q5',
      domain: 'Redes de comunicaciones',
      prompt:
        'Un cliente envía un SYN con seq = 1000 y el servidor contesta con un SYN+ACK con seq = 5000. ¿Qué valores lleva el tercer segmento del establecimiento, el ACK del cliente?',
      choices: [
        'seq = 1000 y ack = 5000',
        'seq = 1001 y ack = 5000',
        'seq = 1001 y ack = 5001',
        'seq = 5001 y ack = 1001',
      ],
      answer: 2,
      explain:
        'El SYN consume un número de secuencia en cada sentido: el cliente sigue en 1001 y acusa el SYN del servidor pidiendo el byte 5001. La opción con ack = 5000 tienta a quien piensa que un segmento sin datos no gasta numeración, pero el acuse siempre indica el siguiente byte esperado. La última opción invierte los papeles: esos serían los números vistos desde el servidor.',
    },
    {
      id: 'op1m1q6',
      domain: 'Redes de comunicaciones',
      prompt: '¿Qué afirmación sobre la cabecera de UDP es correcta?',
      choices: [
        'Mide 8 bytes y contiene puerto de origen, puerto de destino, longitud y suma de comprobación',
        'Mide 20 bytes y contiene puertos, número de secuencia y ventana',
        'Mide 8 bytes y contiene puertos, número de secuencia y suma de comprobación',
        'Mide 12 bytes y contiene puertos, longitud, suma de comprobación y TTL',
      ],
      answer: 0,
      explain:
        'La cabecera de UDP (RFC 768) tiene cuatro campos de 16 bits: los dos puertos, la longitud y la suma de comprobación, 8 bytes en total. La tercera opción tienta porque acierta el tamaño, pero UDP no numera nada: los números de secuencia y la ventana son de TCP, cuya cabecera mínima es de 20 bytes. El TTL pertenece a la cabecera IP, no a la de transporte.',
    },
    {
      id: 'op1m1q7',
      domain: 'Redes de comunicaciones',
      prompt:
        'En una captura, un cliente usa el puerto de origen 51514 para conectarse al puerto 443 de un servidor. Según los rangos de la IANA (RFC 6335), ¿a qué rango pertenece el puerto 51514?',
      choices: [
        'Bien conocidos o de sistema (0–1023)',
        'Registrados o de usuario (1024–49151)',
        'Reservados, que no pueden usarse',
        'Dinámicos o privados (49152–65535)',
      ],
      answer: 3,
      explain:
        'El 51514 es mayor que 49152, de modo que cae en el rango dinámico o privado, el que la IANA reserva para los puertos efímeros que elige el cliente. El rango registrado tienta porque también son «puertos altos», pero termina en 49151. El 443 del servidor sí es un puerto bien conocido.',
    },
    {
      id: 'op1m1q8',
      domain: 'Redes de comunicaciones',
      prompt:
        'Un paquete IPv4 de 1500 bytes con el indicador DF activado llega a un encaminador cuyo enlace de salida tiene una MTU de 1400 bytes. ¿Qué ocurre?',
      choices: [
        'El encaminador lo fragmenta en dos y lo reenvía',
        'El encaminador lo descarta y envía al origen un ICMP de destino inalcanzable (tipo 3, código 4)',
        'El encaminador lo descarta y envía al origen un ICMP de tiempo excedido (tipo 11)',
        'El encaminador desactiva DF, lo fragmenta y lo reenvía',
      ],
      answer: 1,
      explain:
        'Con DF activado el encaminador no puede fragmentar: descarta el paquete y avisa al origen con un destino inalcanzable de código 4, «hacía falta fragmentar y DF estaba activado». Fragmentar en dos es lo que haría con DF = 0, y por eso tienta. El tiempo excedido (tipo 11) se reserva para el TTL agotado, y el encaminador no borra el indicador DF para poder fragmentar.',
    },
  ],
};
