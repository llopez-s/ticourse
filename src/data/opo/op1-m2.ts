import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// OP1M2 — Direccionamiento IPv4 e IPv6 y cálculo de subredes
// ---------------------------------------------------------------------------
export const OP1_M2: Module = {
  id: 'op1m2',
  sectionId: 'op1',
  title: 'Direccionamiento IPv4 e IPv6 y cálculo de subredes',
  minutes: 18,
  objectives: [
    'Calcular red, difusión, rango de hosts y número de direcciones utilizables de cualquier prefijo CIDR',
    'Diseñar un plan VLSM sin solapamientos y resumir varias redes contiguas en una superred',
    'Reconocer los rangos IPv4 de uso especial (RFC 1918, APIPA, loopback, CGNAT) y distinguir NAT estático, dinámico y PAT',
    'Abreviar direcciones IPv6 y clasificarlas por su prefijo: global unicast, link-local, ULA y multidifusión',
    'Explicar cómo se autoconfigura un equipo IPv6 con NDP, SLAAC y EUI-64, y qué significa la doble pila',
  ],
  blocks: [
    {
      t: 'p',
      md: 'En la lección anterior viste la cabecera IPv4; aquí toca el contenido de sus dos campos más famosos. Una dirección **IPv4** tiene **32 bits** y se escribe como cuatro octetos en decimal; una dirección **IPv6** tiene **128 bits** y se escribe en hexadecimal. En los dos casos la dirección se parte en dos: los bits de la izquierda identifican la **red** y los de la derecha, el **equipo** dentro de ella. Todo el cálculo de subredes consiste en saber dónde cae esa frontera. Es, además, la parte del temario que más puntos regala en un examen: no hay nada que interpretar, solo aritmética que se hace bien o mal. Los ejemplos salen del **Consorcio Provincial de Arcedo**, que direcciona toda su red interna dentro de `10.20.0.0/16`.',
    },
    { t: 'h', text: 'CIDR: máscara, red, difusión y rango de hosts' },
    {
      t: 'p',
      md: 'La notación **CIDR** (*Classless Inter-Domain Routing*, RFC 4632) escribe la frontera como un **prefijo**: `/20` significa que los 20 primeros bits son de red y los 12 restantes, de host. La **máscara** dice lo mismo en decimal: tantos unos como indique el prefijo y el resto ceros, de modo que `/20` es `255.255.240.0`. Con eso salen los cuatro datos que se preguntan siempre. La **dirección de red** tiene todos los bits de host a 0 y se obtiene con un **AND** bit a bit entre la dirección y la máscara. La **dirección de difusión** tiene todos los bits de host a 1. El **rango de hosts** es todo lo que queda entre las dos. Y el número de **direcciones utilizables** es `2^h − 2`, donde `h` son los bits de host, porque la de red y la de difusión no se asignan a ningún equipo. Para no pasar a binario los 32 bits, fíjate solo en el octeto donde la máscara no es ni 255 ni 0: el **tamaño de bloque** es 256 menos el valor de la máscara en ese octeto, y las redes empiezan en los múltiplos de ese tamaño.',
    },
    {
      t: 'table',
      headers: ['Prefijo', 'Máscara', 'Tamaño de bloque', 'Hosts utilizables'],
      rows: [
        ['/16', '255.255.0.0', '65 536 direcciones', '65 534'],
        ['/20', '255.255.240.0', '16 en el tercer octeto (4096 direcciones)', '4094'],
        ['/22', '255.255.252.0', '4 en el tercer octeto (1024 direcciones)', '1022'],
        ['/23', '255.255.254.0', '2 en el tercer octeto (512 direcciones)', '510'],
        ['/24', '255.255.255.0', '256 direcciones', '254'],
        ['/25', '255.255.255.128', '128', '126'],
        ['/26', '255.255.255.192', '64', '62'],
        ['/27', '255.255.255.224', '32', '30'],
        ['/28', '255.255.255.240', '16', '14'],
        ['/29', '255.255.255.248', '8', '6'],
        ['/30', '255.255.255.252', '4', '2'],
        ['/31', '255.255.255.254', '2', '2: solo en enlaces punto a punto, sin red ni difusión (RFC 3021)'],
        ['/32', '255.255.255.255', '1', 'Un único equipo: ruta de host'],
      ],
    },
    {
      t: 'check',
      q: {
        q: '¿Cuántas direcciones de host utilizables tiene una subred /26?',
        choices: ['30', '64', '62', '126'],
        answer: 2,
        explain:
          'Un /26 deja 32 − 26 = 6 bits de host: 2^6 = 64 direcciones, menos la de red y la de difusión, 62 utilizables. El 64 es el tamaño del bloque, no el número de equipos que caben; 30 corresponde a un /27 y 126 a un /25.',
      },
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Dos cálculos paso a paso',
      text: `Ejemplo 1 · 10.20.37.150/20
  Máscara /20         255.255.240.0    -> el octeto que decide es el tercero
  Tamaño de bloque    256 - 240 = 16   -> las redes empiezan en 0, 16, 32, 48...
  Tercer octeto        37 = 0010 0101
  Máscara             240 = 1111 0000
  AND                  32 = 0010 0000
  Red                 10.20.32.0
  Siguiente red       10.20.48.0
  Difusión            10.20.47.255     (una menos que la siguiente red)
  Rango de hosts      10.20.32.1 - 10.20.47.254
  Utilizables         32 - 20 = 12 bits de host -> 2^12 - 2 = 4094

Ejemplo 2 · 10.20.8.141/26
  Máscara /26         255.255.255.192  -> el octeto que decide es el cuarto
  Tamaño de bloque    256 - 192 = 64   -> las redes empiezan en 0, 64, 128, 192
  Cuarto octeto       141 = 1000 1101
  Máscara             192 = 1100 0000
  AND                 128 = 1000 0000
  Red                 10.20.8.128
  Siguiente red       10.20.8.192
  Difusión            10.20.8.191
  Rango de hosts      10.20.8.129 - 10.20.8.190
  Utilizables         32 - 26 = 6 bits de host -> 2^6 - 2 = 62`,
    },
    { t: 'h', text: 'VLSM, superredes y resumen de rutas' },
    {
      t: 'p',
      md: 'Repartir un bloque en subredes del mismo tamaño desperdicia direcciones: un enlace entre dos encaminadores (routers) no necesita las mismas que una planta con cien puestos. **VLSM** (*Variable Length Subnet Mask*) permite usar prefijos de longitud distinta dentro del mismo bloque. El método no tiene misterio, pero hay que seguirlo en orden: se ordenan las necesidades **de mayor a menor**, a cada una se le da el prefijo más largo que la aloja (contando con que se pierden dos direcciones) y se asigna el **primer bloque libre** que empiece en un múltiplo de su tamaño. Así no hay solapamientos ni huecos imposibles de aprovechar. Para los enlaces punto a punto, la RFC 3021 admite prefijos **/31**: como en un enlace con solo dos extremos no hace falta dirección de red ni de difusión, las dos direcciones se asignan a los dos encaminadores y se gasta la mitad que con un /30. El camino inverso es la **superred** o **resumen de rutas**: varias redes contiguas se anuncian con un único prefijo más corto. Las cuatro redes `10.20.8.0/24` a `10.20.11.0/24` comparten sus 22 primeros bits (en el tercer octeto, 8 es `0000 1000` y 11 es `0000 1011`: solo cambian los dos últimos bits), así que se resumen como `10.20.8.0/22`. El resumen solo es exacto si el número de redes es potencia de dos y la primera cae en un múltiplo del tamaño del bloque; si no, el prefijo resumido incluye redes que no son tuyas.',
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'Consorcio de Arcedo: la oficina comarcal en un solo /24',
      md: 'A la primera oficina comarcal se le reserva `10.20.8.0/24` y hay que alojar cuatro necesidades: **100 puestos de trabajo**, **50 teléfonos IP**, **20 impresoras y equipos de gestión**, y el **enlace punto a punto** con la sede central. De mayor a menor: los 100 puestos necesitan un **/25** (126 utilizables; un /26 se queda en 62) y reciben `10.20.8.0/25`, con hosts de `.1` a `.126` y difusión `.127`. Los 50 teléfonos caben en un **/26** (62) y el primer bloque libre es `10.20.8.128/26`: hosts de `.129` a `.190`, difusión `.191`. Los 20 equipos de gestión piden un **/27** (30; un /28 solo da 14): `10.20.8.192/27`, hosts de `.193` a `.222`, difusión `.223`. El enlace usa un **/30**: `10.20.8.224/30`, con `.225` y `.226` para los dos encaminadores y difusión `.227`. Quedan libres de `10.20.8.228` a `10.20.8.255` para crecer. Y como para las oficinas comarcales se han reservado las cuatro redes consecutivas de `10.20.8.0/24` a `10.20.11.0/24` (una por oficina y una de reserva), la sede central puede anunciarlas todas hacia el núcleo de la red con una sola ruta resumida, `10.20.8.0/22`.',
    },
    {
      t: 'check',
      q: {
        q: 'Una oficina del Consorcio necesita una subred para 40 equipos. ¿Cuál es la subred más pequeña que los aloja?',
        choices: ['/27', '/26', '/25', '/24'],
        answer: 1,
        explain:
          'Un /27 solo ofrece 30 direcciones utilizables, así que se queda corto; el siguiente tamaño, /26, ofrece 62 y es el más ajustado que sirve. Un /25 o un /24 también alojarían los 40 equipos, pero desperdician direcciones, que es justo lo que VLSM quiere evitar.',
      },
    },
    { t: 'h', text: 'Rangos de uso especial y NAT' },
    {
      t: 'table',
      headers: ['Bloque', 'Nombre', 'Qué hay que saber'],
      rows: [
        [
          '`10.0.0.0/8`',
          'Privado (RFC 1918)',
          'De 10.0.0.0 a 10.255.255.255. No se encamina en Internet',
        ],
        [
          '`172.16.0.0/12`',
          'Privado (RFC 1918)',
          'De 172.16.0.0 a **172.31.255.255**: el /12 abarca dieciséis redes, no solo la 172.16',
        ],
        [
          '`192.168.0.0/16`',
          'Privado (RFC 1918)',
          'De 192.168.0.0 a 192.168.255.255',
        ],
        [
          '`169.254.0.0/16`',
          'Enlace local (RFC 3927), que Microsoft llama **APIPA**',
          'El equipo se la asigna a sí mismo cuando no obtiene dirección por DHCP. Solo vale dentro del enlace: los encaminadores no la reenvían',
        ],
        [
          '`127.0.0.0/8`',
          '**Loopback**',
          'El propio equipo; lo habitual es 127.0.0.1. Ese tráfico nunca sale a la red',
        ],
        [
          '`100.64.0.0/10`',
          'Espacio compartido para **CGNAT** (RFC 6598)',
          'De 100.64.0.0 a 100.127.255.255. Lo usan los operadores entre el equipo del cliente y su NAT a gran escala. No es RFC 1918 ni es público',
        ],
        [
          '`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24`',
          'Documentación (RFC 5737)',
          'Reservados para ejemplos y manuales; no deben aparecer en una red real',
        ],
        [
          '`224.0.0.0/4`',
          'Multidifusión',
          'De 224.0.0.0 a 239.255.255.255. Identifica grupos de receptores, no equipos',
        ],
        [
          '`255.255.255.255`',
          'Difusión limitada',
          'Todos los equipos del enlace local; un encaminador nunca la reenvía',
        ],
      ],
    },
    {
      t: 'p',
      md: 'Las direcciones privadas no se encaminan en Internet, así que para salir hay que traducirlas. Eso hace **NAT** (*Network Address Translation*): el encaminador de frontera reescribe la dirección de origen de cada paquete que sale y guarda la correspondencia en una **tabla de traducciones** para deshacer el cambio en la respuesta. Hay tres variantes que se preguntan por su nombre comercial. El **NAT estático** fija una correspondencia **uno a uno** y permanente entre una dirección privada y una pública: es lo que se usa para publicar un servidor, por ejemplo `10.20.20.10` como `203.0.113.20`, porque también admite conexiones iniciadas desde fuera. El **NAT dinámico** asigna a cada equipo, mientras dura su comunicación, una dirección pública libre de un **conjunto**: sigue siendo uno a uno, y si el conjunto se agota el siguiente equipo no sale. **PAT** (*Port Address Translation*) traduce **muchas direcciones privadas a una sola pública** y distingue las conversaciones por el **puerto de origen** TCP o UDP, que también reescribe: es lo que hace cualquier salida a Internet de una oficina. «Estático», «dinámico» y «PAT» (o «sobrecarga») son nombres de uso común en los fabricantes; la RFC 3022 habla de **NAT básico**, que solo traduce direcciones, y de **NAPT** (*Network Address Port Translation*), que traduce dirección y puerto. Cuando quien hace PAT es el operador, con muchos clientes detrás de pocas direcciones públicas, se habla de **CGNAT**, y el tramo entre el cliente y el operador se numera con `100.64.0.0/10`.',
    },
    {
      t: 'check',
      q: {
        q: 'Un puesto configurado para obtener su dirección por DHCP muestra 169.254.23.7 con máscara 255.255.0.0. ¿Qué ha ocurrido?',
        choices: [
          'El servidor DHCP le ha entregado una dirección privada de la RFC 1918',
          'El operador le ha asignado una dirección del espacio compartido de CGNAT',
          'Alguien le ha puesto a mano la dirección de loopback',
          'No ha recibido respuesta de ningún servidor DHCP y se ha asignado una dirección de enlace local (APIPA)',
        ],
        answer: 3,
        explain:
          '169.254.0.0/16 es el bloque de enlace local de la RFC 3927: el equipo se lo asigna a sí mismo cuando DHCP no responde, y con él solo alcanza a los vecinos de su mismo enlace. No es un rango de la RFC 1918 (10/8, 172.16/12 y 192.168/16), el espacio de CGNAT es 100.64.0.0/10 y el loopback es 127.0.0.0/8.',
      },
    },
    { t: 'h', text: 'IPv6: 128 bits y sin difusión' },
    {
      t: 'p',
      md: 'Una dirección **IPv6** tiene **128 bits** y se escribe como **ocho grupos de 16 bits en hexadecimal** separados por dos puntos. Para abreviarla hay dos reglas. La primera: en cada grupo se quitan los **ceros a la izquierda** (`0db8` pasa a `db8`, `0000` a `0`), nunca los de la derecha. La segunda: **una** secuencia de grupos consecutivos a cero se sustituye por `::`, y solo una vez por dirección, porque con dos no se sabría cuántos grupos representa cada una. La RFC 5952 fija además una forma **canónica**: letras en minúscula, `::` para la secuencia de ceros **más larga**, la **primera** si hay empate, y nunca para un único grupo a cero. Así, `2001:0db8:0000:0000:0000:0000:0000:0001` se escribe `2001:db8::1`. El prefijo se anota igual que en CIDR, y lo normal es que una subred sea un **/64**: 64 bits de red y 64 de **identificador de interfaz**. En IPv6 **no existe la difusión**: lo que en IPv4 se hacía con ella se resuelve con **multidifusión** hacia grupos concretos. Las direcciones son de tres clases —unicast, multidifusión y **anycast**, que sale del mismo espacio que las unicast— y una interfaz suele tener varias a la vez.',
    },
    {
      t: 'table',
      headers: ['Tipo', 'Prefijo', 'Para qué sirve'],
      rows: [
        [
          '**Global unicast**',
          '`2000::/3`',
          'Direcciones públicas, encaminables en Internet. Empiezan por 2 o por 3',
        ],
        [
          '**Link-local**',
          '`fe80::/10`',
          'Obligatoria en toda interfaz con IPv6. Solo vale en el enlace y ningún encaminador la reenvía; la usan NDP y los protocolos de encaminamiento como siguiente salto',
        ],
        [
          '**ULA** (*Unique Local Address*)',
          '`fc00::/7`',
          'Uso interno, no se encamina en Internet (RFC 4193). En la práctica empiezan por `fd`: prefijo /48 con 40 bits generados de forma pseudoaleatoria',
        ],
        [
          '**Multidifusión**',
          '`ff00::/8`',
          'Grupos de receptores. `ff02::1` son todos los nodos del enlace y `ff02::2`, todos los encaminadores del enlace',
        ],
        ['Loopback', '`::1/128`', 'El propio equipo, como 127.0.0.1 en IPv4'],
        ['No especificada', '`::/128`', 'Ausencia de dirección: origen de un equipo que todavía no tiene ninguna'],
        ['Documentación', '`2001:db8::/32`', 'Reservado para ejemplos (RFC 3849)'],
      ],
    },
    {
      t: 'p',
      md: 'En IPv6 no hay ARP. Su trabajo lo hace **NDP** (*Neighbor Discovery Protocol*, RFC 4861), que viaja en mensajes **ICMPv6**: con **Neighbor Solicitation** (tipo 135) y **Neighbor Advertisement** (tipo 136) un equipo averigua la MAC de un vecino, y con **Router Solicitation** (tipo 133) y **Router Advertisement** (tipo 134) descubre a los encaminadores del enlace. La pregunta no se lanza a todos, sino a la dirección de multidifusión de **nodo solicitado** del destino, `ff02::1:ff` seguido de los 24 últimos bits de su dirección. Sobre NDP se apoya **SLAAC** (*Stateless Address Autoconfiguration*, RFC 4862), la autoconfiguración sin servidor: el equipo genera su dirección link-local, comprueba que nadie más la usa (**detección de direcciones duplicadas**), pide un Router Advertisement y, con el prefijo /64 que este anuncia más su propio identificador de interfaz, forma su dirección global; la puerta de enlace es la link-local del encaminador que respondió. El identificador puede derivarse de la MAC con **EUI-64 modificado**: se parte la MAC por la mitad, se insertan los bytes `ff:fe` y se invierte el séptimo bit del primer byte. Con la MAC `00:00:5e:00:53:2a` sale `0200:5eff:fe00:532a`, y la link-local es `fe80::200:5eff:fe00:532a`. Como eso deja la MAC a la vista en todas las redes que visita el equipo, los sistemas actuales suelen generar identificadores aleatorios. Cuando hace falta un control centralizado se usa **DHCPv6**, pero la puerta de enlace sigue aprendiéndose por Router Advertisement. La convivencia con IPv4 se resuelve casi siempre con **doble pila**: cada equipo y cada encaminador tienen direcciones de los dos protocolos y usan uno u otro según el destino, sin traducir nada.',
    },
    {
      t: 'check',
      q: {
        q: '¿Qué mecanismo usa un equipo IPv6 para averiguar la dirección MAC de un vecino de su mismo enlace?',
        choices: [
          'NDP: un Neighbor Solicitation de ICMPv6 enviado a la dirección de multidifusión de nodo solicitado',
          'Una petición ARP enviada a la dirección de difusión de la subred',
          'SLAAC: el encaminador reparte las MAC en sus Router Advertisement',
          'Una consulta DHCPv6 al servidor de direcciones',
        ],
        answer: 0,
        explain:
          'En IPv6 la resolución de direcciones la hace NDP con el par Neighbor Solicitation / Neighbor Advertisement, transportado en ICMPv6 y dirigido a una dirección de multidifusión. ARP es exclusivo de IPv4 y, además, IPv6 no tiene direcciones de difusión; SLAAC sirve para que el equipo forme su propia dirección, no para localizar a los vecinos.',
      },
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Cómo cae en un examen',
      md: 'Casi siempre con un **cálculo** y cuatro respuestas muy parecidas. Trabaja siempre igual: máscara, tamaño de bloque, red, **siguiente red menos uno** para la difusión. Trampas habituales: **(1)** ofrecer `2^h` en lugar de `2^h − 2` cuando preguntan por hosts **utilizables**; **(2)** dar como difusión el `.255` del octeto de la propia dirección cuando el prefijo no es /24; **(3)** el rango `172.16.0.0/12`, que llega hasta **172.31.255.255**: la red 172.32.0.0 ya es pública; **(4)** confundir `100.64.0.0/10` (CGNAT, RFC 6598) con un rango privado de la RFC 1918, o `169.254.0.0/16` con una dirección entregada por DHCP; **(5)** el **/31**, que según la RFC 3021 tiene **dos** direcciones utilizables y no cero; **(6)** en IPv6, una abreviatura con **dos** `::` o que quita ceros de la derecha es inválida, y si piden la forma de la RFC 5952 el `::` va en la secuencia de ceros más larga, o en la primera si empatan; **(7)** `fe80::/10` es link-local y `fc00::/7` es ULA: se parecen y no son lo mismo; **(8)** «IPv6 usa difusión» es siempre falso, y «PAT» y «NAPT» son la misma técnica.',
    },
    {
      t: 'p',
      md: 'Ya sabes numerar una red y repartirla en subredes. Falta ver cómo se separan esas subredes dentro de un edificio sin tirar un cable distinto para cada una: en la siguiente lección cada subred del plan de la oficina comarcal se convierte en una **VLAN**, y verás cómo los conmutadores (switches) mantienen separado su tráfico y cómo se encamina entre ellas.',
    },
  ],
  quiz: [
    {
      id: 'op1m2q1',
      domain: 'Redes de comunicaciones',
      prompt:
        'Un servidor del CPD del Consorcio tiene la dirección 10.20.77.200/21. ¿Cuál es la dirección de difusión de su subred?',
      choices: ['10.20.77.255', '10.20.79.255', '10.20.80.255', '10.20.72.255'],
      answer: 1,
      explain:
        'Un /21 es la máscara 255.255.248.0: el tamaño de bloque en el tercer octeto es 256 − 248 = 8 y las redes empiezan en 64, 72, 80… El 77 cae en el bloque que empieza en 72, así que la red es 10.20.72.0, la siguiente es 10.20.80.0 y la difusión, una dirección antes, 10.20.79.255. La opción 10.20.77.255 tienta porque sería la difusión con un /24, pero con /21 es una dirección de host como cualquier otra.',
    },
    {
      id: 'op1m2q2',
      domain: 'Redes de comunicaciones',
      prompt: '¿Cuántas direcciones de host utilizables ofrece una subred con máscara 255.255.252.0?',
      choices: ['1022', '1024', '510', '2046'],
      answer: 0,
      explain:
        'La máscara 255.255.252.0 es un /22, que deja 32 − 22 = 10 bits de host: 2^10 = 1024 direcciones, menos la de red y la de difusión, 1022 utilizables. El 1024 es el distractor clásico, porque es el total de direcciones del bloque y no las que se pueden asignar; 510 corresponde a un /23 y 2046 a un /21.',
    },
    {
      id: 'op1m2q3',
      domain: 'Redes de comunicaciones',
      prompt:
        'La red 10.20.16.0/24 se divide en subredes /27. ¿A qué subred pertenece el equipo 10.20.16.100?',
      choices: ['10.20.16.64/27', '10.20.16.100/27', '10.20.16.128/27', '10.20.16.96/27'],
      answer: 3,
      explain:
        'Un /27 tiene la máscara 255.255.255.224 y un tamaño de bloque de 256 − 224 = 32, así que las subredes empiezan en 0, 32, 64, 96, 128… El 100 queda entre 96 y 127, luego la subred es 10.20.16.96/27, con hosts de .97 a .126 y difusión .127. La opción 10.20.16.64/27 acaba en .95 y no llega; 10.20.16.100 no es una dirección de red porque 100 no es múltiplo de 32.',
    },
    {
      id: 'op1m2q4',
      domain: 'Redes de comunicaciones',
      prompt:
        '¿Cuál es la forma canónica, según la RFC 5952, de la dirección 2001:0db8:0000:0000:00a0:0000:0000:0001?',
      choices: [
        '2001:db8::a0::1',
        '2001:db8::a0:0:0:1',
        '2001:db8:0:0:a0::1',
        '2001:db8::a:0:0:1',
      ],
      answer: 1,
      explain:
        'Se quitan los ceros a la izquierda de cada grupo (0db8 → db8, 00a0 → a0) y se sustituye por «::» una sola secuencia de grupos a cero. Aquí hay dos secuencias de la misma longitud, y la RFC 5952 manda abreviar la primera: 2001:db8::a0:0:0:1. La opción 2001:db8:0:0:a0::1 representa la misma dirección, pero abrevia la segunda secuencia y por eso no es la forma canónica; la que lleva dos «::» es inválida y la que escribe «a» en lugar de «a0» ha quitado un cero de la derecha y es otra dirección.',
    },
    {
      id: 'op1m2q5',
      domain: 'Redes de comunicaciones',
      prompt:
        'El Consorcio quiere anunciar con una sola ruta las ocho redes consecutivas que van de 10.20.16.0/24 a 10.20.23.0/24, sin incluir ninguna otra. ¿Qué prefijo resumido debe usar?',
      choices: ['10.20.16.0/22', '10.20.16.0/20', '10.20.16.0/21', '10.20.16.0/23'],
      answer: 2,
      explain:
        'Ocho redes /24 son 2^3, así que el resumen quita tres bits al prefijo: /21. En el tercer octeto, 16 es 0001 0000 y 23 es 0001 0111: comparten los cinco primeros bits, que sumados a los 16 bits de los dos primeros octetos dan /21. Un /21 tiene un tamaño de bloque de 8 y 16 es múltiplo de 8, luego 10.20.16.0/21 cubre exactamente de 10.20.16.0 a 10.20.23.255. El /20 tienta porque también las contiene, pero llega hasta 10.20.31.255 y anunciaría ocho redes de más; el /22 solo cubre de la 16 a la 19.',
    },
    {
      id: 'op1m2q6',
      domain: 'Redes de comunicaciones',
      prompt:
        'Los 200 puestos de la sede central, numerados en 10.20.10.0/24, deben navegar por Internet a la vez y el operador solo ha asignado una dirección pública, 203.0.113.10. ¿Qué tipo de traducción hay que configurar en el encaminador de salida?',
      choices: [
        'PAT (NAPT): todas las direcciones internas se traducen a la única pública y las conversaciones se distinguen por el puerto de origen',
        'NAT estático: una correspondencia fija entre cada dirección interna y la dirección pública',
        'NAT dinámico con un conjunto formado por esa única dirección pública',
        'Doble pila, para que los puestos salgan con su dirección IPv6',
      ],
      answer: 0,
      explain:
        'Solo PAT permite que muchos equipos compartan una única dirección pública a la vez, porque además de la dirección traduce el puerto de origen y con él identifica cada conversación. El NAT dinámico es el distractor más cercano: también asigna direcciones públicas sobre la marcha, pero una por equipo, así que con un conjunto de una sola dirección saldría un único puesto cada vez. El NAT estático es uno a uno y sirve para publicar servidores.',
    },
    {
      id: 'op1m2q7',
      domain: 'Redes de comunicaciones',
      prompt:
        'Tras conectarlo a la red, la única dirección IPv6 que muestra un equipo es fe80::200:5eff:fe00:532a. ¿Qué se puede afirmar?',
      choices: [
        'Tiene una dirección global unicast y ya puede comunicarse con Internet por IPv6',
        'Tiene una dirección ULA, válida en toda la red interna del Consorcio pero no en Internet',
        'Solo tiene una dirección link-local: puede hablar con los vecinos de su mismo enlace, pero no con otras redes',
        'Tiene una dirección de multidifusión, de modo que recibe el tráfico dirigido a todos los nodos',
      ],
      answer: 2,
      explain:
        'El prefijo fe80::/10 identifica las direcciones link-local, que toda interfaz genera por sí misma y que ningún encaminador reenvía: sirven para el enlace, no para llegar a otras redes. Que no tenga ninguna más indica que no ha recibido un prefijo por Router Advertisement ni una dirección por DHCPv6. La ULA es el distractor que más tienta por parecido, pero su prefijo es fc00::/7 (en la práctica, direcciones que empiezan por fd); las globales empiezan por 2 o por 3 y las de multidifusión por ff.',
    },
    {
      id: 'op1m2q8',
      domain: 'Redes de comunicaciones',
      prompt:
        'El enlace punto a punto entre dos encaminadores del Consorcio se numera con 10.20.255.0/31, como permite la RFC 3021. ¿Cuántas direcciones pueden asignarse a los extremos del enlace?',
      choices: [
        'Ninguna: 2^1 − 2 = 0, por lo que un /31 no puede usarse en una interfaz',
        'Una: la otra se reserva como dirección de difusión',
        'Cuatro: las mismas que en un /30',
        'Dos: 10.20.255.0 y 10.20.255.1, porque en un /31 punto a punto no se reservan dirección de red ni de difusión',
      ],
      answer: 3,
      explain:
        'La RFC 3021 trata el /31 como un caso especial para enlaces punto a punto: como solo hay dos extremos, no hacen falta dirección de red ni de difusión y las dos direcciones del bloque se asignan a los dos encaminadores. La primera opción tienta porque aplica la fórmula general 2^h − 2, que da cero, pero precisamente esa es la excepción que introduce la RFC. Frente a un /30, que gasta cuatro direcciones para dos equipos, el /31 gasta la mitad.',
    },
  ],
};
