import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// OP1M4 — Encaminamiento: estático, OSPF y BGP (bloque 1, Redes de comunicaciones)
// ---------------------------------------------------------------------------
export const OP1_M4: Module = {
  id: 'op1m4',
  sectionId: 'op1',
  title: 'Encaminamiento: estático, OSPF y BGP',
  minutes: 18,
  objectives: [
    'Leer una tabla de rutas y decidir por dónde sale un paquete aplicando la coincidencia del prefijo más largo',
    'Distinguir métrica de distancia administrativa y predecir qué ruta se instala cuando dos fuentes anuncian el mismo prefijo',
    'Comparar el vector distancia de RIP con el estado de enlace de OSPF: áreas, área 0, coste, DR/BDR, LSA y cálculo SPF',
    'Explicar para qué sirve BGP, la diferencia entre eBGP e iBGP y el papel de AS_PATH y LOCAL_PREF',
    'Describir cómo VRRP y HSRP dan redundancia a la puerta de enlace sin tocar la configuración de los equipos',
  ],
  blocks: [
    {
      t: 'p',
      md: 'Un **encaminador (router)** hace una sola cosa con cada paquete: mira la **dirección IP de destino**, la busca en su **tabla de rutas** y lo reenvía por la interfaz que le indica la mejor entrada. Todo lo demás —rutas estáticas, **OSPF**, **BGP**— son maneras distintas de *rellenar* esa tabla. Por eso esta lección separa dos preguntas que en los exámenes se mezclan a propósito: **cómo se elige una ruta para reenviar** (prefijo más largo) y **cómo llega una ruta a la tabla** (distancia administrativa y métrica). Si las tienes separadas, la mayoría de las preguntas de encaminamiento se resuelven casi solas.',
    },
    { t: 'h', text: 'La tabla de rutas: prefijo más largo, distancia administrativa y métrica' },
    {
      t: 'p',
      md: 'Cada entrada de la tabla dice: «para llegar a este **prefijo**, entrega el paquete a este **siguiente salto** por esta **interfaz**». Un destino puede encajar en varias entradas a la vez, y entonces manda la **coincidencia del prefijo más largo** (*longest prefix match*): gana la entrada con **más bits de red**, porque es la más específica. Da igual quién la haya aprendido o con qué métrica. La **ruta por defecto** (`0.0.0.0/0` en IPv4, `::/0` en IPv6) tiene cero bits de red: encaja con todo y por eso solo se usa cuando no hay nada mejor. Si no existe y ninguna entrada encaja, el paquete se descarta. Este es un extracto de la tabla del encaminador central del Consorcio Provincial de Arcedo.',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Extracto de la tabla de rutas del encaminador central (sintético)',
      text: `destino            siguiente salto   interfaz   origen       [dist./métrica]
0.0.0.0/0          203.0.113.1       wan0       estática     [1/0]
10.20.0.0/16       10.20.255.2       core0      ospf         [110/20]
10.20.12.0/24      10.20.255.6       core1      ospf         [110/30]
10.20.12.128/25    10.20.255.10      core2      ospf         [110/40]
10.20.12.192/26    (directa)         lan3       conectada    [0/0]
10.20.40.0/22      10.20.255.14      core3      ospf         [110/25]

¿por dónde sale cada paquete?

destino 10.20.12.77
  encaja en /0, /16 y /24 (10.20.12.0 - 10.20.12.255)
  no encaja en /25 (10.20.12.128 - 10.20.12.255) ni en /26
  gana el /24                                   -> core1

destino 10.20.12.150
  encaja en /0, /16, /24 y /25 (10.20.12.128 - 10.20.12.255)
  no encaja en /26 (10.20.12.192 - 10.20.12.255)
  gana el /25                                   -> core2

destino 10.20.43.9
  encaja en /0, /16 y /22 (10.20.40.0 - 10.20.43.255)
  gana el /22                                   -> core3

destino 10.20.44.1
  queda fuera del /22 (termina en 10.20.43.255); encaja en /0 y /16
  gana el /16                                   -> core0

destino 10.21.0.5
  no pertenece a 10.20.0.0/16; solo encaja la ruta por defecto
  gana el /0                                    -> wan0`,
    },
    {
      t: 'check',
      q: {
        q: 'Con la tabla anterior, ¿por qué interfaz sale un paquete con destino 10.20.12.200?',
        choices: [
          'Por core0, porque 10.20.0.0/16 es la ruta que cubre toda la red del Consorcio',
          'Por core1, porque 10.20.12.0/24 es la ruta con menor métrica de OSPF',
          'Por core2, porque 10.20.12.128/25 contiene la dirección',
          'Por lan3, porque 10.20.12.192/26 es el prefijo más largo que contiene la dirección',
        ],
        answer: 3,
        explain:
          'La dirección 10.20.12.200 encaja en /0, /16, /24, /25 (10.20.12.128–255) y /26 (10.20.12.192–255). Gana la entrada con más bits de red, el /26, y el paquete sale por lan3. La métrica no interviene: solo compara rutas hacia el mismo prefijo.',
      },
    },
    {
      t: 'p',
      md: 'Antes de reenviar hay que decidir **qué rutas entran en la tabla**. Si dos fuentes distintas ofrecen **exactamente el mismo prefijo** (misma red y misma máscara), el encaminador se queda con la de menor **distancia administrativa**: un número de 0 a 255 que mide cuánto se fía de cada fuente. Ojo, porque esto se pregunta: la distancia administrativa **no está en ningún estándar**, es un valor local de cada fabricante y no viaja en los protocolos. Los números que se suelen pedir son los **valores por defecto de Cisco** (otros fabricantes usan el mismo concepto con otro nombre y otros valores). Si las dos rutas vienen del **mismo protocolo**, decide la **métrica**: saltos en RIP, coste en OSPF. Las métricas de protocolos distintos no se pueden comparar entre sí —dos saltos de RIP no son «mejores» que un coste 20 de OSPF—, y para eso existe precisamente la distancia administrativa. Con métricas iguales, el encaminador puede instalar las dos rutas y repartir el tráfico entre ellas.',
    },
    {
      t: 'table',
      headers: ['Origen de la ruta', 'Distancia administrativa (por defecto en Cisco)', 'Comentario'],
      rows: [
        ['Red directamente conectada', '0', 'Lo que el encaminador tiene en sus propias interfaces'],
        ['Ruta estática', '1', 'La escribe la administradora; se puede subir para hacerla «flotante»'],
        ['**eBGP** (BGP externo)', '20', 'Rutas aprendidas de otro sistema autónomo'],
        ['**OSPF**', '110', 'Estado de enlace'],
        ['**RIP**', '120', 'Vector distancia'],
        ['**iBGP** (BGP interno)', '200', 'Rutas de BGP aprendidas dentro del propio sistema autónomo'],
        ['Inalcanzable', '255', 'Una ruta con este valor no se instala nunca'],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'Un encaminador con las distancias por defecto de Cisco tiene instaladas estas dos rutas: 10.20.40.0/22 aprendida por OSPF y 10.20.40.0/24 aprendida por RIP. ¿Qué ruta usa para un paquete con destino 10.20.40.9?',
        choices: [
          'La de OSPF, porque su distancia administrativa (110) es menor que la de RIP (120)',
          'La de OSPF, porque el coste de OSPF es más preciso que el número de saltos',
          'La de RIP, porque el /24 es el prefijo más largo que contiene la dirección',
          'Ninguna: al solaparse los dos prefijos, el paquete se descarta',
        ],
        answer: 2,
        explain:
          'Son prefijos distintos (/22 y /24), así que las dos rutas conviven en la tabla y no compiten por distancia administrativa. Al reenviar manda el prefijo más largo, y 10.20.40.9 está dentro de 10.20.40.0/24. La distancia administrativa solo desempata entre fuentes que anuncian el mismo prefijo con la misma máscara.',
      },
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'Consorcio de Arcedo: una ruta estática flotante como respaldo',
      md: 'El centro de formación de Valdecierzo depende de la sede central y no es una de las tres oficinas comarcales: no tiene acceso propio a la red del operador, sino una fibra del Consorcio hasta la sede. Su red es `10.20.40.0/22`. La sede central la aprende por **OSPF** a través de ese enlace de fibra (distancia 110 en equipos Cisco). Para no quedarse sin servicio si cae la fibra, se añade una **ruta estática** hacia el mismo `10.20.40.0/22` por el enlace de respaldo, pero con distancia administrativa **130** en lugar de 1. Mientras OSPF anuncia el prefijo, gana su ruta (110 < 130) y la estática ni siquiera aparece en la tabla. Si la fibra cae, la ruta de OSPF desaparece y la estática «sale a flote» sola; cuando la fibra vuelve, OSPF recupera el sitio. Eso es una **ruta estática flotante**: una estática con la distancia subida por encima de la del protocolo dinámico al que respalda. Con la distancia por defecto (1) pasaría justo lo contrario: la estática ganaría siempre y el tráfico iría de forma permanente por el enlace de respaldo.',
    },
    { t: 'h', text: 'Protocolos interiores: del vector distancia de RIP al estado de enlace de OSPF' },
    {
      t: 'p',
      md: 'Una ruta estática no se entera de nada: si el camino se rompe más allá del enlace propio, sigue ahí. Los **protocolos dinámicos** descubren las redes y se adaptan a los cambios. Se dividen en dos familias según dónde trabajan. Un **IGP** (*Interior Gateway Protocol*) encamina **dentro** de un **sistema autónomo (AS)**, es decir, dentro de un conjunto de redes bajo una misma administración y una política de encaminamiento común: RIP y OSPF son IGP. Un **EGP** (*Exterior Gateway Protocol*) encamina **entre** sistemas autónomos, y hoy el único en uso es BGP. Dentro de los IGP hay dos maneras de pensar. En **vector distancia**, cada encaminador solo sabe lo que le cuentan sus vecinos: «yo llego a esa red en tantos saltos». **RIP** es el ejemplo clásico: su métrica es el **número de saltos**, el máximo útil son **15** y **16 significa inalcanzable**, lo que limita el tamaño de la red; envía su tabla a los vecinos cada 30 segundos y converge despacio. **RIPv2** (RFC 2453) viaja sobre **UDP, puerto 520**, incluye la máscara en cada ruta —admite subredes de longitud variable, cosa que la versión 1 no hacía— y usa la dirección de multidifusión `224.0.0.9`.',
    },
    {
      t: 'p',
      md: 'En **estado de enlace**, cada encaminador describe sus propios enlaces en mensajes llamados **LSA** (*Link State Advertisement*) que se inundan por toda el área. Con ellos, todos construyen la **misma base de datos** con el mapa completo, y cada uno ejecuta el algoritmo **SPF** (*Shortest Path First*, el de **Dijkstra**) para calcular el árbol de caminos más cortos con él mismo como raíz. **OSPF** versión 2 (RFC 2328, para IPv4; la versión 3 es la de IPv6) funciona así. No usa TCP ni UDP: va directamente sobre IP con el **número de protocolo 89**, y habla con sus vecinos por multidifusión (`224.0.0.5` para todos los encaminadores OSPF, `224.0.0.6` para el DR y el BDR). Su métrica es el **coste**: cada interfaz de salida tiene un coste y el de una ruta es la suma de los costes del camino. El estándar no fija la fórmula; en equipos Cisco, por defecto, es 100 Mb/s dividido entre el ancho de banda de la interfaz.',
    },
    {
      t: 'p',
      md: 'Para que la base de datos y el cálculo SPF no crezcan sin control, OSPF divide la red en **áreas**. El **área 0** es la troncal (*backbone*) y **todas las demás áreas deben conectarse a ella**: el tráfico entre dos áreas pasa siempre por el área 0. El encaminador que tiene interfaces en más de un área es un **ABR** (*Area Border Router*) y resume hacia cada área lo que hay en las otras; el que introduce en OSPF rutas de fuera (estáticas, de BGP) es un **ASBR** (*AS Boundary Router*). En un segmento de difusión como una red Ethernet con varios encaminadores, formar adyacencia de todos con todos sería un derroche, así que se eligen un **DR** (*Designated Router*) y un **BDR** (*Backup Designated Router*) y los demás solo sincronizan su base de datos con ellos. Gana la elección la **prioridad más alta** (de 0 a 255; con **0 no se participa**) y, en caso de empate, el **identificador de encaminador (Router ID) más alto**. La elección **no es expropiativa**: si después arranca un encaminador con más prioridad, el DR sigue siendo el que estaba.',
    },
    {
      t: 'table',
      headers: ['Tipo de LSA', 'Quién lo genera', 'Qué describe', 'Hasta dónde llega'],
      rows: [
        ['Tipo 1 · de encaminador', 'Todos los encaminadores', 'Sus enlaces y el coste de cada uno', 'Su propia área'],
        ['Tipo 2 · de red', 'El **DR** del segmento', 'Los encaminadores conectados a esa red de difusión', 'Su propia área'],
        ['Tipo 3 · resumen de red', 'El **ABR**', 'Redes de otras áreas', 'El área en la que se inyecta'],
        ['Tipo 4 · resumen de ASBR', 'El **ABR**', 'Cómo llegar a un ASBR situado en otra área', 'El área en la que se inyecta'],
        ['Tipo 5 · externo', 'El **ASBR**', 'Redes de fuera de OSPF (redistribuidas)', 'Todo el dominio OSPF, salvo las áreas configuradas como *stub*'],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'El Consorcio quiere dividir su red OSPF en tres áreas: la sede central, el CPD y el centro de formación de Valdecierzo. ¿Qué condición debe cumplir el diseño?',
        choices: [
          'Las tres áreas deben formar un anillo para que haya siempre dos caminos entre ellas',
          'Una de ellas debe ser el área 0 y las otras dos deben conectarse a ella mediante un ABR',
          'Cada área necesita su propio número de sistema autónomo',
          'Los encaminadores de áreas distintas deben compartir la misma base de datos de estado de enlace',
        ],
        answer: 1,
        explain:
          'En OSPF todas las áreas se conectan al área 0, la troncal, y el tráfico entre áreas pasa por ella; el encaminador que une un área con la troncal es el ABR. La base de datos de estado de enlace es idéntica solo dentro de cada área: precisamente para eso se divide. Las áreas son una división interna de OSPF y no tienen nada que ver con los sistemas autónomos de BGP.',
      },
    },
    { t: 'h', text: 'BGP: encaminar entre sistemas autónomos' },
    {
      t: 'p',
      md: '**BGP** versión 4 (RFC 4271) es el protocolo que une los sistemas autónomos de Internet. Cada uno se identifica con un **número de AS**, que en origen tenía 16 bits y hoy puede tener 32. Dos encaminadores BGP no se descubren solos: se configuran como vecinos de forma explícita y abren entre ellos una sesión **TCP en el puerto 179**; al usar TCP, BGP no necesita su propio mecanismo de entrega fiable. La sesión es **eBGP** cuando los vecinos están en **sistemas autónomos distintos** (una organización con sistema autónomo propio y su operador) e **iBGP** cuando están en **el mismo** (dos encaminadores de borde de esa organización entre sí). BGP es un protocolo de **vector de rutas** (*path vector*): cada anuncio lleva, junto al prefijo, una serie de **atributos**. El más importante es **AS_PATH**, la lista de sistemas autónomos que el anuncio ha atravesado; cada AS añade su número al anunciar el prefijo a un vecino eBGP. Sirve para dos cosas: **evitar bucles** (si un encaminador ve su propio número de AS en la lista, descarta el anuncio) y **comparar caminos** (se prefiere el AS_PATH más corto). El otro atributo que conviene conocer es **LOCAL_PREF**: un valor que solo circula **dentro del propio AS**, por iBGP, y que indica por qué salida se prefiere enviar el tráfico; **gana el más alto** y se evalúa **antes** que la longitud del AS_PATH. BGP, por tanto, no busca el camino más rápido sino el que dicta la **política** de cada organización.',
    },
    {
      t: 'check',
      q: {
        q: 'Supuesto: el Consorcio, que hoy sale a Internet por un solo operador con una ruta por defecto estática, pasa a tener su propio sistema autónomo y dos operadores, A y B. Quiere que el tráfico de salida hacia Internet vaya siempre por A mientras esté disponible, aunque B ofrezca caminos con menos sistemas autónomos. ¿Qué hace?',
        choices: [
          'Asignar un LOCAL_PREF más alto a las rutas aprendidas del operador A',
          'Asignar un LOCAL_PREF más bajo a las rutas aprendidas del operador A',
          'Bajar a 20 la distancia administrativa de OSPF en los encaminadores de borde',
          'Cambiar la sesión con el operador B de eBGP a iBGP',
        ],
        answer: 0,
        explain:
          'LOCAL_PREF expresa la preferencia de salida dentro del propio sistema autónomo: gana el valor más alto y se compara antes que la longitud de AS_PATH, así que las rutas de A se imponen aunque su camino sea más largo. Si A cae, sus rutas desaparecen y se usan las de B. Una sesión con otro sistema autónomo es eBGP por definición; no se puede «convertir» en iBGP.',
      },
    },
    { t: 'h', text: 'Redundancia de la puerta de enlace: VRRP y HSRP' },
    {
      t: 'p',
      md: 'Los protocolos de encaminamiento dan caminos alternativos *entre encaminadores*, pero un ordenador no participa en ellos: solo conoce **una** dirección de **puerta de enlace** predeterminada. Si ese encaminador cae, la subred entera se queda aislada aunque haya otro al lado. Los protocolos de redundancia de primer salto lo resuelven haciendo que **dos o más encaminadores compartan una dirección IP virtual y una dirección MAC virtual**: los equipos apuntan a la IP virtual y no se enteran de quién la atiende. **VRRP** (*Virtual Router Redundancy Protocol*) es el **estándar abierto**; su versión 3 (RFC 9568, que sustituye a la RFC 5798) sirve para IPv4 e IPv6. Los encaminadores se agrupan en un **encaminador virtual** identificado por un número, el **VRID**. Uno actúa como **maestro** (la RFC 9568 lo llama ya encaminador **activo**; «maestro» es el nombre de las versiones anteriores y el que sigue apareciendo en los temarios): responde a las peticiones ARP de la IP virtual, reenvía el tráfico y envía anuncios periódicos a la dirección de multidifusión `224.0.0.18`, directamente sobre IP con el **número de protocolo 112**. Los demás quedan **de respaldo** y, si dejan de oír los anuncios, el de mayor prioridad toma el relevo. La **prioridad** configurable va de **1 a 254**, con **100 por defecto**; el valor **255** se reserva para el encaminador que tiene la IP virtual como dirección real de su interfaz. La **expropiación** (*preemption*) está **activada por defecto**: un encaminador con más prioridad que el maestro actual le quita el papel al volver. La MAC virtual en IPv4 empieza por `00-00-5E-00-01` y su último byte es el VRID. **HSRP** (*Hot Standby Router Protocol*) resuelve el mismo problema con la misma idea, pero es **propietario de Cisco**; llama a los papeles **activo** y **en espera**.',
    },
    {
      t: 'table',
      headers: ['', 'VRRP', 'HSRP'],
      rows: [
        ['Origen', 'Estándar abierto (versión 3: RFC 9568)', 'Propietario de Cisco'],
        ['Papeles', 'Maestro y respaldo (activo y respaldo desde la RFC 9568)', 'Activo y en espera'],
        ['Qué ve el equipo final', 'Una IP y una MAC virtuales como puerta de enlace', 'Una IP y una MAC virtuales como puerta de enlace'],
        ['Cuándo elegirlo', 'Redes con equipos de varios fabricantes', 'Redes con equipos de Cisco'],
      ],
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Cómo cae en un examen',
      md: '**Orden de decisión**: primero el **prefijo más largo**; la **distancia administrativa** solo desempata entre fuentes distintas del **mismo prefijo**; la **métrica**, entre rutas del **mismo protocolo**. La trampa clásica pone una ruta estática /16 frente a una de OSPF /24 y espera que elijas la estática «porque tiene distancia 1». **Números que se piden**: conectada 0, estática 1, eBGP 20, OSPF 110, RIP 120, iBGP 200 —y son **valores de Cisco**, no de un estándar—. **RIP**: saltos, máximo 15, 16 es inalcanzable, UDP 520. **OSPF**: estado de enlace, Dijkstra, coste, área 0 obligatoria, **protocolo IP 89** (no usa TCP ni UDP), DR/BDR en redes multiacceso como Ethernet (no en enlaces punto a punto), prioridad 0 no participa. **BGP**: **TCP 179**, vector de rutas, eBGP entre sistemas autónomos distintos e iBGP dentro del mismo; AS_PATH evita bucles y se prefiere el más corto; LOCAL_PREF, el más alto, y va antes. **VRRP** es estándar (RFC 9568, antes RFC 5798; protocolo IP 112) y **HSRP** es de Cisco. Si el enunciado dice «varios fabricantes» o «estándar abierto», la respuesta es OSPF frente a un protocolo propietario y VRRP frente a HSRP. Si dice «dos operadores», «sistema autónomo propio» o «política de salida», es BGP.',
    },
  ],
  quiz: [
    {
      id: 'op1m4q1',
      domain: 'Redes de comunicaciones',
      prompt:
        'Un encaminador tiene estas rutas: 0.0.0.0/0 por wan0; 10.20.0.0/16 por core0; 10.20.12.0/24 por core1; 10.20.12.128/25 por core2; 10.20.12.192/26 por lan3. ¿Por qué interfaz sale un paquete con destino 10.20.12.150?',
      choices: ['Por core0', 'Por core1', 'Por core2', 'Por lan3'],
      answer: 2,
      explain:
        'La dirección 10.20.12.150 está dentro de 10.20.12.128/25 (de .128 a .255), que es el prefijo más largo que la contiene, así que sale por core2. La opción lan3 tienta porque el /26 es todavía más específico, pero 10.20.12.192/26 empieza en .192 y la dirección .150 queda fuera. El /24 y el /16 también la contienen, pero tienen menos bits de red.',
    },
    {
      id: 'op1m4q2',
      domain: 'Redes de comunicaciones',
      prompt:
        'Un encaminador tiene tres rutas: 0.0.0.0/0 estática por wan0; 10.20.0.0/16 aprendida por OSPF por core0; 10.20.40.0/22 estática por core3. ¿Por dónde sale un paquete con destino 10.20.44.1?',
      choices: [
        'Por core0, porque la dirección queda fuera del /22 y el /16 es el prefijo más largo que la contiene',
        'Por core3, porque 10.20.44.1 pertenece a 10.20.40.0/22',
        'Por core3, porque una ruta estática tiene menor distancia administrativa que una de OSPF',
        'Por wan0, porque ninguna ruta específica contiene la dirección',
      ],
      answer: 0,
      explain:
        'El prefijo 10.20.40.0/22 abarca de 10.20.40.0 a 10.20.43.255, de modo que 10.20.44.1 queda fuera por una sola subred. Las entradas que la contienen son el /16 y la ruta por defecto, y gana el /16 por ser más largo. La distancia administrativa no pinta nada aquí: solo se compara entre rutas hacia el mismo prefijo, y estas tres son prefijos distintos.',
    },
    {
      id: 'op1m4q3',
      domain: 'Redes de comunicaciones',
      prompt:
        'Un encaminador con las distancias administrativas por defecto de Cisco aprende el prefijo 10.20.40.0/22 por dos fuentes: por RIP, con métrica de 2 saltos, y por OSPF, con coste 20. ¿Qué ruta instala en su tabla?',
      choices: [
        'La de RIP, porque 2 es una métrica menor que 20',
        'La de OSPF, porque su distancia administrativa (110) es menor que la de RIP (120)',
        'Las dos, y reparte el tráfico entre ambas',
        'Ninguna, hasta que la administradora elimine uno de los dos protocolos',
      ],
      answer: 1,
      explain:
        'Cuando dos protocolos distintos anuncian el mismo prefijo, decide la distancia administrativa, y en Cisco la de OSPF (110) es menor que la de RIP (120). Comparar 2 con 20 es la trampa: los saltos de RIP y el coste de OSPF son unidades distintas y no se pueden comparar. El reparto de tráfico entre varias rutas se da con métricas iguales dentro de un mismo protocolo.',
    },
    {
      id: 'op1m4q4',
      domain: 'Redes de comunicaciones',
      prompt:
        'La sede del Consorcio aprende la red de su centro de formación de Valdecierzo por OSPF a través de la fibra (equipos Cisco, distancias por defecto). Se quiere añadir una ruta estática por un enlace de respaldo que solo se use si cae la fibra. ¿Cómo debe configurarse?',
      choices: [
        'Con la distancia administrativa por defecto de las rutas estáticas, 1',
        'Con distancia administrativa 110, igual que OSPF',
        'Con un prefijo más largo que el anunciado por OSPF',
        'Con una distancia administrativa mayor que 110, por ejemplo 130',
      ],
      answer: 3,
      explain:
        'Una ruta estática flotante lleva una distancia administrativa superior a la del protocolo al que respalda: con 130 pierde frente a OSPF (110) mientras la fibra funciona y entra en la tabla sola cuando la ruta de OSPF desaparece. Con la distancia por defecto (1) ganaría siempre la estática y el tráfico iría de forma permanente por el respaldo. Un prefijo más largo tendría el mismo efecto indeseado, porque el prefijo más largo se impone a cualquier otra consideración.',
    },
    {
      id: 'op1m4q5',
      domain: 'Redes de comunicaciones',
      prompt:
        'Cuatro encaminadores OSPF comparten un segmento Ethernet y arrancan a la vez. R1: prioridad 1, Router ID 10.20.255.1. R2: prioridad 1, Router ID 10.20.255.9. R3: prioridad 0, Router ID 10.20.255.200. R4: prioridad 5, Router ID 10.20.255.3. ¿Quiénes quedan como DR y BDR?',
      choices: [
        'DR R4 y BDR R2',
        'DR R3 y BDR R2',
        'DR R4 y BDR R3',
        'DR R2 y BDR R1',
      ],
      answer: 0,
      explain:
        'Primero cuenta la prioridad: R4 tiene la más alta (5) y es el DR. Para el BDR empatan R1 y R2 con prioridad 1, y desempata el Router ID más alto, el de R2. R3 tienta porque tiene el Router ID mayor de todos, pero con prioridad 0 no participa en la elección.',
    },
    {
      id: 'op1m4q6',
      domain: 'Redes de comunicaciones',
      prompt:
        'Supuesto: el Consorcio deja de depender de un solo operador. Obtiene un número de sistema autónomo y un bloque de direcciones públicas propio, y contrata el acceso a Internet con dos operadores. Quiere anunciar su bloque a ambos y decidir por cuál sale el tráfico. ¿Qué protocolo necesita con los operadores?',
      choices: [
        'OSPF, con cada operador en un área distinta',
        'RIPv2, porque incluye la máscara en sus anuncios',
        'BGP, con una sesión eBGP hacia cada operador',
        'VRRP, con una IP virtual compartida entre los dos operadores',
      ],
      answer: 2,
      explain:
        'Intercambiar rutas entre sistemas autónomos distintos y aplicar una política de salida es exactamente el trabajo de BGP, mediante sesiones eBGP con cada operador. OSPF tienta porque es el protocolo que ya se usa dentro, pero es un protocolo interior: sus áreas son una división interna, no una frontera entre organizaciones. VRRP da redundancia a la puerta de enlace de una subred y no anuncia prefijos a nadie.',
    },
    {
      id: 'op1m4q7',
      domain: 'Redes de comunicaciones',
      prompt: '¿Cuál de estas correspondencias entre protocolo de encaminamiento y transporte es correcta?',
      choices: [
        'OSPF usa TCP en el puerto 89',
        'BGP usa UDP en el puerto 179',
        'RIPv2 va directamente sobre IP, con el número de protocolo 520',
        'OSPF va directamente sobre IP, con el número de protocolo 89',
      ],
      answer: 3,
      explain:
        'OSPF no usa TCP ni UDP: se encapsula directamente en IP con el número de protocolo 89. La primera opción es el distractor habitual, porque convierte ese 89 en un puerto de TCP. BGP sí usa el puerto 179, pero de TCP, y RIPv2 usa el puerto 520 de UDP.',
    },
    {
      id: 'op1m4q8',
      domain: 'Redes de comunicaciones',
      prompt:
        'Dos encaminadores forman un encaminador virtual VRRP con los valores por defecto del protocolo, salvo la prioridad: A tiene 120 y B tiene 100. A es el maestro. A se apaga y, unos minutos después, vuelve a arrancar. ¿Qué ocurre?',
      choices: [
        'B sigue como maestro hasta que falle, porque en VRRP la expropiación está desactivada por defecto',
        'B asume el papel de maestro mientras A está caído y A lo recupera al volver, porque en VRRP la expropiación está activada por defecto',
        'Los equipos de la subred pierden la conexión hasta que se les cambia la puerta de enlace por la dirección de B',
        'A y B quedan los dos como maestros y se reparten el tráfico',
      ],
      answer: 1,
      explain:
        'Al dejar de recibir los anuncios de A, B pasa a maestro y atiende la IP y la MAC virtuales, así que los equipos no notan el cambio ni hay que tocar su configuración. Cuando A vuelve con prioridad 120, mayor que la de B, recupera el papel porque VRRP tiene la expropiación activada por defecto. La primera opción tienta porque sí existen protocolos de este tipo en los que hay que activarla a mano.',
    },
  ],
};
