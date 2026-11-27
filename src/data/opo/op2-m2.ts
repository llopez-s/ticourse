import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// OP2M2 — VPN IPsec: arquitectura, IKEv2 y túneles
// Fuente única: docs/superpowers/sources/2026-11-27-op2-fuentes.md (§1–§8, §16–§18).
// Escenario: docs/superpowers/canon/arcedo.md §3, §6, §7e.
// ---------------------------------------------------------------------------
export const OP2_M2: Module = {
  id: 'op2m2',
  sectionId: 'op2',
  title: 'VPN IPsec: arquitectura, IKEv2 y túneles',
  minutes: 30,
  objectives: [
    'Explicar la arquitectura de IPsec de la RFC 4301: asociación de seguridad (SA), SPI y las tres bases de datos SPD, SAD y PAD',
    'Distinguir AH de ESP y el modo transporte del modo túnel por lo que protege cada uno y por cómo se comportan ante un NAT',
    'Describir los intercambios de IKEv2 (IKE_SA_INIT, IKE_AUTH, CREATE_CHILD_SA e INFORMATIONAL), qué negocia cada uno y cómo detecta y atraviesa un NAT por UDP 4500',
    'Elegir algoritmos según las RFC 8221 y 8247 (actualizadas por la 9395) y explicar la reclave y el secreto perfecto hacia delante (PFS)',
    'Comparar la VPN por política con la VPN por ruta (VTI, término de fabricante) y explicar qué añade GRE sobre IPsec',
    'Calcular la MTU y el MSS que caben por el túnel de respaldo de una oficina del Consorcio, con y sin NAT-T, dejando claras las suposiciones',
  ],
  blocks: [
    {
      t: 'p',
      md: 'Cuando el acceso MPLS de una oficina comarcal del Consorcio de Arcedo se cae, su tráfico hacia la sede no se queda parado: sale por un acceso a Internet de otro proveedor, metido en un **túnel IPsec** hasta el encaminador central. Por Internet pasa cualquiera, así que ese túnel tiene que dar tres cosas: que nadie lea los datos, que nadie los cambie sin que se note y que cada extremo sepa con quién habla. Esta lección explica cómo lo consigue IPsec, pieza a pieza. El repaso general de qué es una VPN, de TLS frente a IPsec y de dónde encaja cada una está en Security+ (sp3m5), y la criptografía de base (cifrado simétrico, Diffie-Hellman, firmas, certificados), en sp1m6 y sp1m7: aquí se da por sabida.\n\nLas normas son estas. La arquitectura es la **RFC 4301**; los dos protocolos de tráfico, la **4302** (AH) y la **4303** (ESP); el intercambio de claves, **IKEv2**, es la **RFC 7296**, que es **norma de Internet** (STD 79) y está actualizada, entre otras, por la **9370** y la **9827**. IKEv1 ya no cuenta: la **RFC 9395** (2023) lo pasó a **histórico**.',
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'En el Consorcio de Arcedo: el túnel de respaldo',
      md: 'La WAN principal es una VPN de capa 3 sobre MPLS del operador (op1m5). El respaldo es otra cosa: cada oficina comarcal tiene su propio encaminador con dos salidas, el acceso MPLS (principal) y un acceso a Internet de **otro proveedor**, que solo se usa para el túnel. Las direcciones públicas de esos accesos de respaldo son **`198.51.100.31`**, **`198.51.100.32`** y **`198.51.100.33`**, una por oficina. Al otro lado, el **encaminador central de la sede termina los túneles en `203.0.113.10`**, con IKEv2 por **UDP 500 y 4500**. En los ejemplos se usan las dos oficinas con red fija en el canon: **`10.20.8.0/24`** y **`10.20.9.0/24`**; los servicios corporativos viven en el CPD, **`10.20.72.0/21`**. El canon no fija fabricante, vidas de las SA ni si el túnel es por política o por ruta: donde haga falta un valor así, la lección lo dirá como supuesto.',
    },
    { t: 'h', text: 'La arquitectura: SA, SPI y tres bases de datos' },
    {
      t: 'p',
      md: 'La pieza básica de IPsec es la **asociación de seguridad** (*Security Association*, **SA**): el acuerdo entre dos extremos sobre cómo proteger un tráfico, con qué protocolo, qué algoritmos y qué claves. Según la RFC 4301 (§4.1), una SA es **simplex**: sirve en **un solo sentido**, y usa AH **o** ESP, nunca los dos. Para tráfico de ida y vuelta hace falta **un par de SA**, e IKE las crea siempre por pares. Las dos SA de un par van en el mismo modo.\n\nCada paquete protegido lleva un **índice de parámetros de seguridad** (*Security Parameter Index*, **SPI**), un número de **32 bits** que elige el **receptor** para reconocer a qué SA pertenece lo que le llega (RFC 4303 §2.1). En unidifusión, el SPI basta por sí solo para encontrar la SA. Los valores **1 a 255** están reservados por la IANA y el **0** es de uso local y nunca se transmite.\n\nLa RFC 4301 (§4.4) describe tres bases de datos «nominales» (dicen qué debe hacerse, no cómo se programa):\n\n- La **SPD** (*Security Policy Database*) decide qué se hace con **todo** el tráfico que cruza la frontera IPsec, entrante o saliente, protegido o no, incluido el propio IKE. Cada entrada acaba en una de tres decisiones: **DISCARD** (tirar), **BYPASS** (dejar pasar sin proteger) o **PROTECT** (proteger con IPsec).\n- La **SAD** (*Security Association Database*) guarda los parámetros de cada SA establecida: claves, algoritmos, número de secuencia, vida. A la entrada, la SA se busca por el SPI.\n- La **PAD** (*Peer Authorization Database*) es el enlace entre IKE y la SPD: qué pares pueden hablar con este equipo, cómo se autentica cada uno y qué identidades y redes puede reclamar al crear SA.\n\nCada SA tiene una **vida** (§4.4.2.1), medida en **tiempo**, en **bytes** o en las dos cosas a la vez (manda la que venza antes). Al acabar, se sustituye por otra con un SPI nuevo o se termina. Qué valores de vida trae cada equipo por defecto no lo dice ninguna RFC: es política local y, en los productos, cosa de cada fabricante.',
    },
    {
      t: 'table',
      headers: ['Base de datos', 'Qué contiene', 'Pregunta que contesta', 'Ejemplo en el túnel de respaldo'],
      rows: [
        ['**SPD**', 'Reglas con selectores (direcciones, protocolo, puertos) y una decisión', '¿Este paquete se descarta, pasa en claro o se protege?', 'De `10.20.8.0/24` a `10.20.72.0/21`: PROTECT; IKE hacia `203.0.113.10`: BYPASS'],
        ['**SAD**', 'Una entrada por SA establecida: SPI, claves, algoritmos, contador, vida', '¿Con qué claves y algoritmos trato este paquete?', 'La SA de ida y la de vuelta del túnel de la oficina, cada una con su SPI'],
        ['**PAD**', 'Pares autorizados, método y datos de autenticación, identidades que pueden reclamar', '¿Quién es este par y qué puede pedir?', 'Solo el encaminador de la sede, autenticado, y solo para las redes de la oficina'],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'Entre la oficina 10.20.8.0/24 y el CPD hay tráfico en los dos sentidos por el túnel de respaldo. Sin contar la SA de IKE, ¿cuántas SA de ESP hacen falta como mínimo y por qué?',
        choices: [
          'Una, porque una SA protege los dos sentidos con la misma clave',
          'Una por cada conexión TCP que cruce el túnel',
          'Dos, porque cada SA es simplex (un solo sentido) e IKE las crea por pares',
          'Cuatro, una de AH y otra de ESP en cada sentido',
        ],
        answer: 2,
        explain:
          'La RFC 4301 define la SA como simplex: un sentido, un protocolo. Para ida y vuelta hace falta un par, y IKE las crea siempre de dos en dos. Una SA por conexión TCP es posible si la SPD lo pide, pero no es el mínimo. Y una SA usa AH o ESP, no los dos; para este túnel basta ESP.',
      },
    },
    { t: 'h', text: 'AH y ESP, transporte y túnel' },
    {
      t: 'p',
      md: 'IPsec tiene dos protocolos de tráfico, cada uno con su número de protocolo IP:\n\n- **AH** (*Authentication Header*, RFC 4302), **protocolo IP 51**, da integridad y autenticación del origen, y protección opcional contra repetición. **No cifra.** Su comprobación cubre toda la cabecera IP que no cambie por el camino: pone a cero los campos **mutables** (TTL, DSCP, ECN, *flags*, desplazamiento de fragmento, suma de comprobación) y mete en la cuenta los **inmutables**, entre ellos las **direcciones de origen y destino**.\n- **ESP** (*Encapsulating Security Payload*, RFC 4303), **protocolo IP 50**, cifra **y** da integridad (o solo integridad, si se quiere). Su formato: **SPI** (4 bytes), **número de secuencia** (4 bytes), los datos (que pueden empezar por un **vector de inicialización**, *IV*), un **relleno** de 0 a 255 bytes, la longitud del relleno, el campo **Next Header** y, al final, el **valor de comprobación de integridad** (*Integrity Check Value*, **ICV**). La integridad cubre desde el SPI hasta el remolque; el cifrado, solo los datos y el remolque.\n\nLa RFC 4301 (§3.2) es tajante: los equipos **deben** soportar ESP y **pueden** soportar AH, porque casi todo se resuelve con ESP sola. Y hay un motivo práctico de peso: **AH no atraviesa NAT**. Como sus cuentas incluyen las direcciones IP, un NAT que las cambie invalida la comprobación (RFC 3715 §2.1); la RFC 3948 lo llama «inherently incompatible with NAT». Por eso la RFC 8221 mantiene `ENCR_NULL` como obligatorio: si solo se quiere autenticar, se hace con **ESP sin cifrado**, que sí cruza un NAT, en vez de con AH.\n\nCada protocolo funciona en dos **modos** (RFC 4301 §4.1):\n\n- **Transporte**: protege sobre todo lo que va encima de IP (TCP, UDP); la cabecera IP original se queda fuera. Es el modo típico **entre dos hosts**. Entre pasarelas solo se usa si el tráfico va a la propia pasarela (por ejemplo, su gestión) o para llevar túneles **GRE** o IP-en-IP ya formados.\n- **Túnel**: el paquete IP entero se mete dentro de otro, con una cabecera IP **nueva** entre los dos extremos del túnel. Si alguno de los extremos es una **pasarela de seguridad**, la SA **debe** ser de túnel (salvo esas dos excepciones). El túnel de respaldo del Consorcio, de encaminador a encaminador, es de este tipo: por fuera se ve `198.51.100.31` → `203.0.113.10`; las direcciones `10.20.x.x` van dentro, cifradas.',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Qué lleva cada paquete (un puesto de la oficina, 10.20.8.77, habla con WEB1, 10.20.72.81)',
      text: `Paquete original:
  [ IP 10.20.8.77 -> 10.20.72.81 ][ TCP ][ datos ]

ESP en modo transporte (entre dos hosts):
  [ IP original ][ SPI | N.º sec ][ IV ][ TCP | datos ][ relleno | long. relleno | Next Header ][ ICV ]
                                        |<------------------- cifrado -------------------->|
                |<------------------------- cubierto por el ICV ------------------------>|

ESP en modo túnel (encaminador de la oficina -> encaminador central):
  [ IP 198.51.100.31 -> 203.0.113.10 ][ SPI | N.º sec ][ IV ][ IP 10.20.8.77 -> 10.20.72.81 | TCP | datos ][ remolque ][ ICV ]
                                                             |<----------------- cifrado ------------------------>|

ESP en modo túnel con NAT-T (hay un NAT en medio):
  [ IP exterior ][ UDP, puertos de IKE (4500) ][ SPI | N.º sec ][ IV ][ IP original | TCP | datos ][ remolque ][ ICV ]

AH en modo túnel (no cifra nada):
  [ IP exterior ][ Next Header | Payload Len | RESERVED | SPI | N.º sec | ICV ][ IP original | TCP | datos ]
  |<--- todo autenticado, salvo los campos mutables de la IP exterior (TTL, DSCP...) --->|
  Un NAT que cambie la IP exterior rompe el ICV: AH no cruza NAT.`,
    },
    {
      t: 'p',
      md: 'Dos campos de ESP merecen atención. El **número de secuencia** es un contador de 32 bits que sube de uno en uno; el primer paquete de una SA lleva el **1** (RFC 4303 §2.2). Con la **protección contra repetición** (*anti-replay*), que viene activada, el contador no puede dar la vuelta: hay que crear una SA nueva antes del paquete **2^32**. En enlaces rápidos eso llega pronto, y por eso existen los **números de secuencia extendidos** (*Extended Sequence Numbers*, **ESN**) de **64 bits**, de los que solo viajan los 32 bajos; los altos entran en el cálculo del ICV. El receptor lleva una **ventana** de repetición de al menos **32** paquetes (se prefiere **64**) para aceptar los que llegan algo desordenados y tirar los repetidos.',
    },
    {
      t: 'check',
      q: {
        q: 'El proveedor del acceso de respaldo de una oficina pone un NAT delante del encaminador. Alguien propone usar AH en lugar de ESP porque solo quiere autenticar. ¿Qué pasa?',
        choices: [
          'AH falla: su comprobación incluye las direcciones IP, el NAT las cambia y el receptor descarta los paquetes; si solo se quiere autenticar, ESP sin cifrado sí cruza el NAT',
          'Funciona igual que ESP, porque AH también se encapsula en UDP 4500',
          'Funciona, pero sin protección contra repetición',
          'Falla porque AH usa el protocolo IP 50, que los NAT bloquean siempre',
        ],
        answer: 0,
        explain:
          'AH autentica los campos inmutables de la cabecera IP, entre ellos las direcciones, así que cualquier NAT que las traduzca invalida el ICV (RFC 3715). La encapsulación UDP de la RFC 3948 deja fuera a AH a propósito. Por eso la RFC 8221 mantiene ENCR_NULL: ESP solo con autenticación. Y el protocolo 50 es ESP; AH es el 51.',
      },
    },
    { t: 'h', text: 'IKEv2: cómo se ponen de acuerdo los dos extremos' },
    {
      t: 'p',
      md: 'Las SA no se configuran a mano: las negocia **IKEv2** (*Internet Key Exchange* versión 2, RFC 7296), que va por **UDP 500**. Todo en IKEv2 son pares **petición/respuesta**. Antes de proteger un solo paquete, los extremos crean una **SA de IKE**, el canal seguro por el que hablan entre ellos, y con ella la primera **SA hija** (*Child SA*), la que protege el tráfico de verdad. En el lenguaje de IKEv1 eso eran la «fase 1» y la «fase 2»; la RFC 7296 solo usa esos nombres para comparar.\n\nEl arranque normal son **cuatro mensajes**, dos intercambios:\n\n1. **IKE_SA_INIT** (mensajes 1 y 2, **en claro**). El iniciador ofrece sus algoritmos (`SAi1`), su parte de **Diffie-Hellman** (`KEi`) y un *nonce* (`Ni`); el respondedor elige una de las suites ofrecidas y contesta con lo suyo (`SAr1`, `KEr`, `Nr`). Con eso, cada lado calcula **SKEYSEED** y de ella salen las claves de la SA de IKE: `SK_e` para cifrar, `SK_a` para la integridad (una por sentido) y `SK_d` para derivar las claves de las SA hijas. Si el iniciador eligió un grupo DH que el otro no acepta, recibe `INVALID_KE_PAYLOAD` con el grupo bueno y repite.\n2. **IKE_AUTH** (mensajes 3 y 4, **ya cifrados**). Cada lado envía su identidad, sus certificados si los usa y un campo **AUTH** que demuestra que es quien dice y que firma los mensajes anteriores. Las identidades van ocultas a quien escuche. En el mismo intercambio se crea la **primera SA hija**, con sus selectores de tráfico (`TSi`, `TSr`: qué redes van por el túnel). Si falla la SA hija, la SA de IKE se queda creada igualmente; si falla la autenticación (`AUTHENTICATION_FAILED`), no se crea nada.\n\nDespués, cuando hace falta, entran los otros dos intercambios: **CREATE_CHILD_SA**, un solo par de mensajes que crea SA hijas nuevas o **reclava** las existentes (y la propia SA de IKE), y **INFORMATIONAL**, siempre protegido, para avisos, borrado de SA y configuración; quien lo recibe **debe** responder, aunque sea con un mensaje vacío.\n\nUn detalle de defensa: si el respondedor ve demasiadas SA a medio abrir (síntoma de una inundación), **debería** contestar a IKE_SA_INIT con una **COOKIE** (de 1 a 64 octetos) y obligar al iniciador a repetir con ella; así se comprueba que la dirección de origen es real antes de gastar cálculo en un DH. El arranque pasa entonces a **seis mensajes**. La cabecera de IKE lleva dos **SPI de IKE de 8 octetos**, uno de cada extremo; en el primer mensaje el del respondedor va a cero, porque aún no existe.',
    },
    {
      t: 'table',
      headers: ['Intercambio (código)', 'Mensajes', '¿Cifrado?', 'Qué negocia o lleva'],
      rows: [
        ['**IKE_SA_INIT** (34)', '1 y 2 (3 y 4 más si hay COOKIE)', 'No', 'Algoritmos de la SA de IKE, Diffie-Hellman, *nonces*, detección de NAT; de aquí salen las claves de la SA de IKE'],
        ['**IKE_AUTH** (35)', '3 y 4', 'Sí (salvo la cabecera)', 'Identidades, certificados, AUTH, selectores de tráfico y **la primera SA hija**; sin KE ni *nonces* propios'],
        ['**CREATE_CHILD_SA** (36)', 'Un par', 'Sí', 'SA hijas nuevas y reclave de SA hijas o de la SA de IKE; un KE **opcional** para un DH nuevo (PFS)'],
        ['**INFORMATIONAL** (37)', 'Un par', 'Sí', 'Avisos (Notify), borrado de SA (Delete), configuración (CP); vacío, sirve para comprobar que el otro sigue vivo'],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'Un técnico captura el arranque del túnel de la oficina 10.20.9.0/24 y ve solo cuatro mensajes IKE, sin ningún CREATE_CHILD_SA. Aun así, el tráfico de la oficina ya va cifrado por ESP. ¿Por qué?',
        choices: [
          'Porque el túnel está usando IKEv1, que no necesita CREATE_CHILD_SA',
          'Porque falta la captura del CREATE_CHILD_SA, que siempre es el mensaje 5',
          'Porque el tráfico va cifrado por la SA de IKE, no por una SA hija',
          'Porque la primera SA hija se crea dentro de IKE_AUTH (mensajes 3 y 4); CREATE_CHILD_SA solo hace falta para SA hijas adicionales o para reclavar',
        ],
        answer: 3,
        explain:
          'En IKEv2 la primera SA hija sale del propio IKE_AUTH: cuatro mensajes bastan para tener tráfico protegido. CREATE_CHILD_SA llega después, para más SA hijas o para la reclave. La SA de IKE protege solo los mensajes de IKE, no el tráfico de usuario. Y la idea de una «fase 2» obligatoria es de IKEv1, que la RFC 9395 pasó a histórico.',
      },
    },
    { t: 'h', text: 'Cuando hay un NAT por medio: detección, UDP 4500 y TCP' },
    {
      t: 'p',
      md: 'ESP es un protocolo IP propio (el 50), sin puertos, y muchos NAT no saben qué hacer con él. La RFC 7296 (§2.23) lo resuelve con la **traversía de NAT** (*NAT traversal*, **NAT-T**): meter IKE y ESP en **UDP**, que cualquier NAT sabe traducir. El mecanismo tiene tres pasos.\n\n**Detectar.** En IKE_SA_INIT, cada lado añade dos avisos, `NAT_DETECTION_SOURCE_IP` y `NAT_DETECTION_DESTINATION_IP`, con un **SHA-1** de los SPI de IKE, la dirección IP y el puerto de origen o de destino tal como él los ve. El otro repite la cuenta con lo que le ha llegado: si no coincide el de destino, **él** está detrás de un NAT; si no coincide el de origen, lo está el **emisor**.\n\n**Cambiar de puerto.** Quien detecta un NAT **debe** pasar todo lo siguiente al **UDP 4500**, y si hay NAT los dos **deben** encapsular ESP en UDP. La encapsulación UDP **no debe** hacerse nunca en el 500 (también puede usarse el 4500 desde el principio). Por el mismo puerto viajan entonces IKE y ESP, y se distinguen así: los mensajes de IKE llevan delante **cuatro octetos a cero** (el «Non-ESP Marker» de la RFC 3948), y los de ESP empiezan directamente por su SPI, que nunca vale cero. Compartir puerto tiene una ventaja: una sola entrada en el NAT y un solo puerto que abrir en el cortafuegos.\n\n**Mantener viva la entrada del NAT.** Si no sale nada, el NAT acaba olvidando la traducción. La RFC 3948 (§2.3, §4) define el **NAT-keepalive**: un único octeto **0xFF**, que se **debería** enviar si no ha salido otro paquete en **20 segundos** (valor por defecto de la RFC). Ese paquete solo sirve para el NAT y **no debe** usarse para saber si el otro extremo vive. Para eso está la comprobación de vida de la RFC 7296 (§2.4): un **INFORMATIONAL vacío**, que obliga a responder; la RFC dice que a veces se le llama ***dead peer detection*** (**DPD**). Cuántos reintentos y cada cuánto, la RFC no lo fija.\n\nHay redes que bloquean **todo** UDP. Para ellas está la **RFC 9329** (que obsoleta la 8229): IKE y ESP **sobre TCP**, que los equipos **deben** soportar en el **TCP 4500**. No se negocia: se configura en los dos extremos. NIST (SP 800-77r1) lo presenta como **último recurso**.',
    },
    {
      t: 'check',
      q: {
        q: 'En el túnel de respaldo con NAT-T, el encaminador de la oficina envía cada 20 segundos un paquete UDP de un solo octeto, 0xFF, cuando no hay tráfico. Un técnico propone usar esos paquetes para saber si la sede sigue viva. ¿Qué dice la norma?',
        choices: [
          'Que vale: si el 0xFF no recibe respuesta, el par está caído',
          'Que no: el NAT-keepalive solo mantiene la entrada del NAT y no debe usarse para eso; la comprobación de vida es un INFORMATIONAL vacío, que exige respuesta',
          'Que no, porque el 0xFF solo se envía por el puerto 500',
          'Que vale, pero solo si se envía cada 5 segundos',
        ],
        answer: 1,
        explain:
          'La RFC 3948 dice que el NAT-keepalive no debe usarse para comprobar si la conexión vive, y además nadie lo contesta. Para eso la RFC 7296 usa un INFORMATIONAL vacío protegido, que el otro debe responder (lo que a veces se llama DPD). Y la encapsulación UDP nunca va por el 500: va por el 4500.',
      },
    },
    { t: 'h', text: 'Reclave y secreto perfecto hacia delante' },
    {
      t: 'p',
      md: 'Ninguna clave debe usarse sin límite de tiempo ni de volumen: al caducar una SA, ya **no debe** usarse (RFC 7296 §2.8). **Reclavar** es crear una SA nueva equivalente y, cuando ya funciona, **borrar la vieja**; conviene hacerlo **antes** de que caduque, para no cortar el tráfico. Se hace con **CREATE_CHILD_SA**, tanto para las SA hijas como para la SA de IKE, y cuando se reclava la SA de IKE la nueva **hereda** todas las SA hijas. Una SA hija reclavada no debería cambiar ni de selectores ni de algoritmos.\n\nUna diferencia con IKEv1 que causa confusiones: en IKEv2 la **vida de las SA no se negocia**. Cada extremo aplica la suya y, si no coinciden, reclava siempre **el que la tenga más corta**. Así que dos vidas distintas no rompen un túnel IKEv2.\n\nEl **secreto perfecto hacia delante** (*Perfect Forward Secrecy*, **PFS**) es la garantía de que, aunque mañana alguien robe las claves de larga duración de los dos extremos, no podrá descifrar el tráfico grabado hoy. Lo da el Diffie-Hellman **efímero** (§2.12). Ojo con el matiz (§1.3, §2.17): la primera SA hija deriva sus claves de `SK_d` y de los *nonces* de IKE_SA_INIT, sin un DH propio. Las siguientes solo tienen PFS adicional si la petición de CREATE_CHILD_SA lleva un **KE**, es decir, un DH nuevo. Si un extremo exige grupo DH en la reclave y el otro no lo ofrece, la reclave fallará (`NO_PROPOSAL_CHOSEN` o `INVALID_KE_PAYLOAD`).',
    },
    { t: 'h', text: 'Qué algoritmos elegir' },
    {
      t: 'p',
      md: 'Los algoritmos no se eligen por gusto: los fijan la **RFC 8221** para ESP y AH y la **RFC 8247** para IKEv2, las dos actualizadas por la **9395**, que además retiró IKEv1 y los algoritmos viejos. La 8221 (§4) prohíbe cifrar sin autenticar. La forma más limpia de hacer las dos cosas es un algoritmo **AEAD** (*Authenticated Encryption with Associated Data*), que cifra y autentica a la vez, como **AES-GCM** (*Galois/Counter Mode*) con etiqueta de 16 octetos (`ENCR_AES_GCM_16`). Las RFC usan niveles: **MUST** (obligatorio), **SHOULD** (recomendado), **MAY**, **SHOULD NOT**, **MUST NOT**; y dos matices de la 8247: **MUST-** (obligatorio que probablemente bajará) y **SHOULD+** (recomendado que probablemente subirá).',
    },
    {
      t: 'table',
      headers: ['Para qué', 'Obligatorio (MUST)', 'Recomendado o aceptable', 'Evitar'],
      rows: [
        ['Cifrado en ESP (8221 §5)', '`ENCR_AES_GCM_16` (AEAD) y `ENCR_AES_CBC`, con claves de 128 y 256 bits; `ENCR_NULL` para ESP solo autenticado', '`ENCR_CHACHA20_POLY1305` (SHOULD, AEAD)', '`ENCR_3DES` (SHOULD NOT); DES y Blowfish (MUST NOT)'],
        ['Integridad en ESP y AH (8221 §6)', '`AUTH_HMAC_SHA2_256_128`; `AUTH_NONE` solo con AEAD', '`AUTH_HMAC_SHA2_512_256` (SHOULD); `AUTH_HMAC_SHA1_96` (MUST-)', '`AUTH_HMAC_MD5_96` (MUST NOT); `AUTH_NONE` sin AEAD'],
        ['Cifrado en IKEv2 (8247 §2.1)', '`ENCR_AES_CBC`', '`ENCR_AES_GCM_16` y `ENCR_CHACHA20_POLY1305` (SHOULD); `ENCR_3DES` (MAY)', '`ENCR_NULL` (MUST NOT en IKE)'],
        ['Función pseudoaleatoria, PRF (8247 §2.2)', '`PRF_HMAC_SHA2_256`', '`PRF_HMAC_SHA2_512` (SHOULD+); `PRF_HMAC_SHA1` (MUST-)', '`PRF_HMAC_MD5` (MUST NOT)'],
        ['Grupo Diffie-Hellman (8247 §2.4)', '**14** (MODP de 2048 bits)', '**19** (curva elíptica de 256 bits, SHOULD)', '2 y 5 (SHOULD NOT); **1** (MUST NOT)'],
        ['Autenticación en IKEv2 (8247 §3.1)', 'Firma RSA y clave compartida (*Shared Key Message Integrity Code*)', 'ECDSA y la firma digital de la RFC 7427 (SHOULD)', 'DSS (SHOULD NOT)'],
      ],
    },
    {
      t: 'p',
      md: 'Tres cosas más. `ENCR_NULL` es **MUST en ESP** (para autenticar sin cifrar) y **MUST NOT en IKE**: no se contradicen, porque un IKE sin cifrar no tiene sentido. **AES-CBC** sigue siendo obligatorio por compatibilidad, aunque la tendencia es AEAD. Y NIST (SP 800-77r1 §3.9), al migrar de IKEv1, pide no usar 3DES, MD5, SHA-1 ni los grupos 2 y 5, y usar **el mismo grupo DH** para la SA de IKE y para las SA hijas.\n\nSi en la documentación de un equipo aparecen nombres raros, puede ser por los cambios recientes: la **RFC 9370** rebautizó la transformada de tipo 4, antes «Diffie-Hellman Group», como «**Key Exchange Method**» (y permite varios intercambios de clave seguidos, la base de los esquemas híbridos poscuánticos), y la **RFC 9827** (2025) rebautizó la de tipo 5, antes «Extended Sequence Numbers», como «**Sequence Numbers**».',
    },
    { t: 'h', text: 'VPN por política, VPN por ruta y GRE sobre IPsec' },
    {
      t: 'p',
      md: 'Queda decidir **qué tráfico entra en el túnel**, y hay dos maneras (NIST SP 800-77r1 §2.2).\n\nEn la **VPN por política** (*policy-based*), lo deciden las reglas de la SPD: los selectores dicen qué redes van por el túnel, por ejemplo `10.20.8.0/24` hacia `10.20.72.0/21`, y lo demás no entra. En la **VPN por ruta** (*route-based*), la capa de política acepta todo y lo que va al túnel lo decide la **tabla de rutas**, que apunta a una interfaz IPsec. Los fabricantes llaman a esa interfaz **VTI** (*Virtual Tunnel Interface*), un término que **no está en ninguna RFC**: en la documentación de Cisco, por ejemplo, una VTI es «a routable interface type for terminating IPsec tunnels», la **estática** (SVTI) sirve para unir sedes y su selector de tráfico es siempre «IP any any», y la **dinámica** (DVTI) clona una interfaz por sesión para *hub-and-spoke* y acceso remoto. Sobre una VTI, siempre según Cisco, pueden ir protocolos de enrutamiento, multidifusión cifrada, QoS y reglas de cortafuegos.\n\nLo que se suele oír en la práctica es «por ruta, que es más flexible». **NIST dice lo contrario** (SP 800-77r1 §6.5): **recomienda la VPN por política con subredes concretas**, aunque exija más gestión, porque no depende de que alguien cambie una ruta, por error o a propósito. En la de ruta es habitual una política `0.0.0.0/0` ↔ `0.0.0.0/0`, y si las rutas de los dos lados no casan, el tráfico puede ir cifrado en un sentido y no en el otro, o, en el peor caso, salir **en claro**. La contrapartida que reconoce NIST: en un *hub-and-spoke* con una política muy amplia (por ejemplo, todo `10.0.0.0/8`), la pasarela puede quedarse sin acceso a su propia LAN. En el Consorcio se ve enseguida: si la oficina `10.20.8.0/24` pusiera como red remota todo `10.20.0.0/16`, su propia red quedaría dentro de lo que «va a la sede».',
    },
    {
      t: 'p',
      md: '**GRE sobre IPsec.** **GRE** (*Generic Routing Encapsulation*, RFC 2784, actualizada por la 2890) es una encapsulación genérica: una cabecera pequeña con un campo **Protocol Type** que lleva un EtherType (**0x800** para IPv4) y que viaja sobre IPv4 como **protocolo IP 47**. Puede llevar cualquier protocolo, y el túnel aparece como un enlace con su siguiente salto, que es justo lo que necesita un protocolo de enrutamiento como OSPF, que busca vecinos por una interfaz y les habla por multidifusión. Lo que GRE **no** hace es proteger: la RFC 2784 no ofrece confidencialidad. De ahí la combinación: GRE forma el túnel que el enrutamiento entiende e IPsec lo cifra. La RFC 3884 explica por qué: los túneles IPsec en modo túnel chocan con el enrutamiento, que depende de interfaces y siguientes saltos; la alternativa es encapsular primero (IP-en-IP o GRE) y aplicar IPsec en **modo transporte** al paquete ya encapsulado, que es una de las dos excepciones de la RFC 4301 §4.1. La RFC 4459 confirma que apilar túneles así, GRE o L2TP sobre IPsec, es frecuente, y cada capa añade su cabecera al cálculo de la MTU.',
    },
    {
      t: 'table',
      headers: ['Aspecto', 'Por política', 'Por ruta (VTI, término de fabricante)', 'GRE sobre IPsec'],
      rows: [
        ['Qué decide lo que entra en el túnel', 'Los selectores de la SPD', 'La tabla de rutas, hacia la interfaz de túnel', 'Las rutas hacia la interfaz GRE; IPsec protege el GRE'],
        ['Selectores de tráfico típicos', 'Subredes concretas: `10.20.8.0/24` ↔ `10.20.72.0/21`', 'Todo: `0.0.0.0/0` ↔ `0.0.0.0/0` (SVTI de Cisco: «IP any any»)', 'Solo el GRE entre los dos extremos (protocolo 47)'],
        ['Protocolos de enrutamiento y multidifusión', 'No pasan como tales: solo lo que casa con los selectores', 'Sí, según la documentación del fabricante', 'Sí: GRE lleva cualquier protocolo y da un enlace con siguiente salto'],
        ['Qué dice NIST SP 800-77r1 §6.5', 'La **recomienda**, con subredes concretas', 'Riesgo: rutas que no casan, cifrado en un solo sentido o tráfico en claro', '(No lo trata aparte)'],
        ['Norma', 'RFC 4301 (SPD)', 'Ninguna RFC define VTI', 'RFC 2784 y 2890 para GRE; RFC 3884 para IPsec en transporte'],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'El Consorcio quisiera que OSPF aprendiera las redes de las oficinas también a través de los túneles de respaldo. Con un túnel por política cuyos selectores son solo 10.20.8.0/24 ↔ 10.20.72.0/21, eso no funciona. ¿Qué opción lo resuelve sin dejar el tráfico en claro?',
        choices: [
          'Montar GRE entre los dos encaminadores y protegerlo con IPsec, o una interfaz de túnel enrutable (VTI) si el fabricante la ofrece',
          'Pasar de ESP a AH, que sí lleva multidifusión',
          'Quitar IPsec y usar solo GRE, que ya cifra',
          'Ampliar la vida de la SA para que OSPF tenga tiempo de converger',
        ],
        answer: 0,
        explain:
          'OSPF necesita una interfaz con vecino y multidifusión; GRE se lo da y IPsec lo cifra (la RFC 3884 describe la variante con IPsec en transporte), y las VTI del fabricante ofrecen algo parecido. AH no cambia qué tráfico casa con los selectores y además no cruza NAT. GRE no ofrece confidencialidad según la RFC 2784. Y la vida de la SA no tiene que ver con qué tráfico entra en el túnel.',
      },
    },
    { t: 'h', text: 'MTU y MSS: lo que cabe por el túnel de respaldo' },
    {
      t: 'p',
      md: 'Cada capa de túnel añade octetos, y el paquete exterior tiene que caber en la **MTU** (*Maximum Transmission Unit*) del enlace. La **MTU del camino** (*Path MTU*, PMTU) es la menor de todos los saltos (RFC 1191). Para saber cuánto cabe hay que sumar con cuidado, y aquí conviene separar lo que dice la norma de lo que es supuesto:\n\n- **Dato del dossier.** ESP con `ENCR_AES_GCM_16` añade **de 34 a 37 octetos** (RFC 4106 §7): IV de 8, ICV de 16 y entre 10 y 13 de SPI (4), número de secuencia (4), relleno (de 0 a 3 aquí), longitud del relleno (1) y Next Header (1). Eso **no incluye** la cabecera IP exterior del modo túnel ni el UDP de NAT-T.\n- **Dato del dossier.** La cabecera UDP de NAT-T ocupa **8 octetos** (RFC 3948 §2.1). La cabecera TCP sin opciones, **20** (RFC 9293).\n- **Supuestos de este ejemplo.** MTU del acceso a Internet de la oficina: **1500** octetos. Cabecera IPv4 sin opciones: **20** octetos, tanto la exterior como la interior (la cifra no se ha leído de la RFC 791; sale implícita de la 9293, donde 576 − 40 = 536 con 20 de TCP).\n\nSe calcula con el **peor caso** de ESP (37), para que quepa siempre, y con y sin NAT-T, porque el canon no dice si el proveedor de respaldo pone un NAT delante de la oficina.',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Túnel de respaldo de la oficina 10.20.8.0/24 (198.51.100.31 -> 203.0.113.10), ESP en modo túnel con AES-GCM-16',
      text: `                                         Sin NAT    Con NAT-T
MTU del acceso a Internet (supuesto)        1500        1500
 - cabecera IPv4 exterior (supuesto)         -20         -20
 - UDP de NAT-T (RFC 3948)                     0          -8
 - ESP con AES-GCM-16, peor caso (RFC 4106)  -37         -37
 = paquete IP interior más grande           1443        1435
 - cabecera IPv4 interior (supuesto)         -20         -20
 - cabecera TCP sin opciones (RFC 9293)      -20         -20
 = MSS de TCP máximo                        1403        1395

Con el relleno mínimo (ESP de 34) cabrían 3 octetos más: 1446 / 1438 de paquete
interior y 1406 / 1398 de MSS. Se diseña con el peor caso.

Un puesto que envía un paquete de 1500 con DF activo:
  1500 + 20 + 8 + 37 = 1565 octetos con NAT-T  ->  no cabe en 1500.`,
    },
    {
      t: 'p',
      md: '¿Qué pasa con ese paquete de 1500? El **descubrimiento de la MTU del camino** (*Path MTU Discovery*, **PMTUD**, RFC 1191, que sigue siendo **Draft Standard**; para IPv6, la RFC 8201) funciona así: el origen envía con el bit **DF** (*Don\'t Fragment*) activo; el equipo que no puede reenviar sin fragmentar descarta el paquete y devuelve un ICMP **tipo 3, código 4** («fragmentation needed and DF set»), con la MTU del siguiente salto en el campo **Next-Hop MTU**, y el origen baja su tamaño. Si alguien filtra esos ICMP, la conexión se queda colgada: el saludo TCP pasa, porque sus paquetes son pequeños, y la transferencia se para en cuanto los paquetes crecen. La RFC 8201 llama a esto, en IPv6, «black-hole connection».\n\nLa RFC 4459 (§1) da cuatro salidas para los túneles: fragmentar el paquete ya encapsulado y reensamblar en el otro extremo; avisar a los orígenes para que envíen paquetes más pequeños (PMTUD); conseguir una MTU mayor de 1500 en la red que lleva los túneles (por Internet no está en manos del Consorcio), o fragmentar el paquete original antes de encapsular (solo IPv4). Y describe una quinta técnica, el ***MSS clamping***, que la propia RFC califica de «hack»: los extremos del túnel **rebajan el MSS** que anuncian las conexiones TCP al abrirse, para que nunca envíen segmentos que no quepan. Solo sirve para **TCP**, no para UDP, y exige que todo el tráfico pase por esos extremos. Con las cuentas de arriba, el tope sería **1395** con NAT-T; el valor concreto que se configure, y el comando, son **del fabricante** y del administrador. El propio IKE también sufre la MTU: un IKE_AUTH con certificados puede pasar de 1500 octetos y los cortafuegos suelen tirar los fragmentos; para eso existe la **fragmentación de IKE** (RFC 7383), cifrada en IKEv2 (SP 800-77r1 §3.5).',
    },
    {
      t: 'check',
      q: {
        q: 'Con las mismas suposiciones del ejemplo (MTU 1500, IPv4 de 20 octetos, TCP de 20, ESP con AES-GCM-16 en el peor caso de 37), la oficina 10.20.9.0/24 sale a Internet sin ningún NAT por medio. ¿Cuál es el MSS de TCP máximo que cabe por su túnel?',
        choices: ['1395', '1435', '1403', '1460'],
        answer: 2,
        explain:
          'Sin NAT no hay UDP de NAT-T: 1500 − 20 (IPv4 exterior) − 37 (ESP) = 1443 de paquete interior, y 1443 − 20 (IPv4 interior) − 20 (TCP) = 1403. El 1395 es el caso con NAT-T, que resta 8 octetos más. El 1435 es el paquete interior con NAT-T, no un MSS. Y 1460 es lo que queda en 1500 sin ningún túnel.',
      },
    },
    {
      t: 'links',
      title: 'Lo que ya está explicado en otras lecciones',
      items: [
        { label: 'Security+: VPN, TLS e IPsec, SD-WAN y SASE (sp3m5)', href: '/learn/sp3m5' },
        { label: 'Security+: criptografía simétrica y asimétrica, hashing y firmas (sp1m6)', href: '/learn/sp1m6' },
        { label: 'Security+: PKI y certificados (sp1m7)', href: '/learn/sp1m7' },
        { label: 'NAT estático, dinámico y PAT (op1m2)', href: '/learn/op1m2' },
        { label: 'Arquitecturas WAN: MPLS y el respaldo de las oficinas (op1m5)', href: '/learn/op1m5' },
        { label: 'Siguiente: acceso remoto (op2m3)', href: '/learn/op2m3' },
      ],
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Lo que más se confunde',
      md: '**Números:** AH es el protocolo IP **51**, ESP el **50**, GRE el **47**; IKE va por **UDP 500** y NAT-T por **UDP 4500** (nunca encapsular en el 500); sobre TCP, **TCP 4500** (RFC **9329**, que obsoleta la 8229). **SA** simplex: hacen falta **dos** para ida y vuelta. **SPI** de IPsec de **32 bits** (1–255 reservados, 0 local); los de IKE, de **8 octetos**. **AH** no cifra y **no cruza NAT**; para autenticar sin cifrar, **ESP con `ENCR_NULL`**. **Pasarela** de por medio: modo **túnel**. **IKEv2** arranca con **4** mensajes (IKE_SA_INIT + IKE_AUTH), **6** con COOKIE, y la **primera SA hija** sale de IKE_AUTH. **Vidas** de SA: en IKEv2 **no se negocian**; reclava el de vida más corta; sus valores por defecto no los fija ninguna RFC. **PFS** en las SA siguientes solo si CREATE_CHILD_SA lleva **KE**. **NAT-keepalive**: un octeto **0xFF** tras **20 s** sin tráfico, que **no** sirve para saber si el par vive. **Algoritmos:** grupo DH **14** MUST, grupo **1** MUST NOT, 2 y 5 SHOULD NOT; `ENCR_AES_GCM_16` MUST en ESP; **3DES** SHOULD NOT en ESP. **IKEv1** es histórico (RFC **9395**). **NIST SP 800-77r1** recomienda VPN **por política**; **VTI** no está en ninguna RFC. **GRE** no cifra. **ESP con AES-GCM-16**: **34–37** octetos sin contar la IP exterior ni el UDP; **MSS clamping** es TCP solo, la RFC 4459 lo llama «hack» y sus valores son del fabricante.',
    },
  ],
  quiz: [
    {
      id: 'op2m2q1',
      domain: 'Infraestructuras de comunicaciones',
      prompt:
        'El cortafuegos que hay delante del encaminador central (203.0.113.10) debe dejar pasar un túnel IKEv2 con ESP desde una oficina que llega sin ningún NAT por medio. ¿Qué tiene que permitir como mínimo?',
      choices: [
        'TCP 500 y el protocolo IP 51',
        'UDP 500 para IKE y el protocolo IP 50 para ESP',
        'Solo UDP 4500, porque IKEv2 siempre encapsula ESP en UDP',
        'El protocolo IP 47 y TCP 443',
      ],
      answer: 1,
      explain:
        'IKE va por **UDP 500** (RFC 7296 §2.23) y ESP es el **protocolo IP 50** (RFC 4303). El 4500 solo hace falta si hay NAT o si se decide usarlo desde el principio; sin NAT, ESP va directo sobre IP. El 51 es AH y el 47 es GRE; el TCP 443 aparece en NIST solo como salida de último recurso en redes que bloquean UDP.',
    },
    {
      id: 'op2m2q2',
      domain: 'Infraestructuras de comunicaciones',
      prompt:
        'En IKE_SA_INIT, el encaminador central recalcula el aviso NAT_DETECTION_DESTINATION_IP que le manda la oficina y el resultado no coincide. ¿Qué concluye y qué debe hacer?',
      choices: [
        'Que la oficina está detrás de un NAT; debe pasar a AH, que no usa puertos',
        'Que el mensaje es falso; debe descartarlo y cortar la negociación',
        'Que el emisor está detrás de un NAT; debe seguir por UDP 500 con ESP sin encapsular',
        'Que él mismo está detrás de un NAT; a partir de ahí, IKE y ESP van por UDP 4500, con ESP encapsulado en UDP',
      ],
      answer: 3,
      explain:
        'Según la RFC 7296 §2.23, si no casa el *hash* de destino, el **receptor** está detrás de un NAT (si no casa el de origen, lo está el emisor). Quien detecta el NAT debe pasar todo lo siguiente al **UDP 4500**, y con NAT los dos encapsulan ESP en UDP; la encapsulación **nunca** se hace en el 500. AH no sirve: no cruza NAT.',
    },
    {
      id: 'op2m2q3',
      domain: 'Infraestructuras de comunicaciones',
      prompt:
        'Durante un pico de intentos de conexión, el encaminador central responde a IKE_SA_INIT con un aviso COOKIE. ¿Cuántos mensajes tiene entonces el intercambio inicial hasta tener la primera SA hija?',
      choices: [
        'Seis: el iniciador repite IKE_SA_INIT con la cookie y luego viene IKE_AUTH',
        'Cuatro, igual que sin cookie',
        'Ocho, porque la cookie obliga a autenticar con EAP',
        'Tres, porque la cookie sustituye a la respuesta de IKE_SA_INIT',
      ],
      answer: 0,
      explain:
        'Con COOKIE (RFC 7296 §2.6) el iniciador recibe la cookie, repite IKE_SA_INIT con ella y solo entonces sigue con IKE_AUTH: **6 mensajes** en vez de 4. Los **8** son el ejemplo mínimo con EAP (§2.16), otro caso distinto. En IKEv2 todo son pares petición/respuesta, así que un número impar no puede ser.',
    },
    {
      id: 'op2m2q4',
      domain: 'Infraestructuras de comunicaciones',
      prompt:
        'La política de seguridad del Consorcio exige secreto perfecto hacia delante (PFS) también para las SA hijas que se crean al reclavar. ¿Qué tiene que llevar cada CREATE_CHILD_SA?',
      choices: [
        'Nada especial: toda SA hija de IKEv2 tiene PFS porque deriva de SK_d',
        'Un nuevo aviso COOKIE',
        'Un KE, es decir, un Diffie-Hellman nuevo; sin él, la SA hija sale de SK_d y no tiene PFS adicional',
        'Un INFORMATIONAL vacío antes de cada reclave',
      ],
      answer: 2,
      explain:
        'La RFC 7296 (§1.3 y §2.17) dice que la petición de CREATE_CHILD_SA **puede** llevar un KE para un DH adicional, y que eso es lo que da mayor PFS a la SA hija. Sin KE, las claves salen de `SK_d` y de los *nonces*, que es justo lo que tienta: creer que derivar de `SK_d` ya basta. La COOKIE es una defensa contra inundaciones y el INFORMATIONAL vacío, una comprobación de vida.',
    },
    {
      id: 'op2m2q5',
      domain: 'Infraestructuras de comunicaciones',
      prompt:
        'El encaminador de una oficina tiene configurada una vida de SA distinta de la del encaminador central, y los dos usan IKEv2. ¿Qué pasa?',
      choices: [
        'El túnel no se levanta, porque las vidas deben coincidir en la negociación',
        'Nada grave: en IKEv2 las vidas no se negocian, cada extremo aplica la suya y reclava el que la tenga más corta',
        'Se usa siempre la vida del iniciador',
        'Se aplica el valor por defecto que fija la RFC 7296',
      ],
      answer: 1,
      explain:
        'La RFC 7296 §2.8 marca la diferencia con IKEv1: allí la vida se negociaba; en IKEv2 **no**. Cada lado aplica su política y reclava el de vida más corta. La avería por «vidas que no coinciden» es de IKEv1. Y ninguna RFC fija un valor por defecto de vida: es política local o del fabricante.',
    },
    {
      id: 'op2m2q6',
      domain: 'Infraestructuras de comunicaciones',
      prompt:
        'Al revisar la configuración IKEv2 heredada de un túnel antiguo aparece esta propuesta. Según la RFC 8247, actualizada por la 9395, ¿qué elemento está prohibido (MUST NOT)?',
      choices: [
        'Cifrado ENCR_AES_CBC',
        'PRF_HMAC_SHA2_256',
        'Autenticación por clave compartida',
        'Grupo Diffie-Hellman 1 (768 bits)',
      ],
      answer: 3,
      explain:
        'En la RFC 8247 §2.4 el grupo **1** es **MUST NOT** (y 2 y 5, SHOULD NOT); el obligatorio es el **14**. `ENCR_AES_CBC` y `PRF_HMAC_SHA2_256` son **MUST** en IKEv2, y la clave compartida (*Shared Key Message Integrity Code*) también es **MUST** (§3.1). Que AES-CBC sea «viejo» tienta, pero sigue siendo obligatorio por compatibilidad.',
    },
    {
      id: 'op2m2q7',
      domain: 'Infraestructuras de comunicaciones',
      prompt:
        'Supón MTU de 1500 en el acceso de respaldo, cabeceras IPv4 de 20 octetos, NAT-T activo (UDP de 8) y ESP en modo túnel con AES-GCM-16 en el peor caso de 37 octetos. ¿Cuál es el paquete IP interior más grande que cabe sin fragmentar?',
      choices: ['1435 octetos', '1443 octetos', '1395 octetos', '1472 octetos'],
      answer: 0,
      explain:
        '1500 − 20 (IPv4 exterior) − 8 (UDP de NAT-T, RFC 3948) − 37 (ESP con AES-GCM-16, RFC 4106 §7) = **1435**. El 1443 olvida el UDP de NAT-T. El 1395 es el MSS de TCP, que resta además 20 de IPv4 interior y 20 de TCP. El 1472 resta la IP y el UDP pero se olvida de ESP.',
    },
    {
      id: 'op2m2q8',
      domain: 'Infraestructuras de comunicaciones',
      prompt:
        'Para los túneles entre pasarelas, ¿qué recomienda NIST SP 800-77r1 y por qué?',
      choices: [
        'La VPN por ruta con VTI, porque la VTI está definida en la RFC 4301',
        'La VPN por ruta con una política 0.0.0.0/0, porque simplifica la gestión sin riesgos',
        'La VPN por política con subredes concretas, porque no depende de cambios en las rutas que podrían dejar tráfico cifrado en un solo sentido o en claro',
        'GRE sin IPsec, porque GRE ya protege el tráfico',
      ],
      answer: 2,
      explain:
        'NIST SP 800-77r1 §6.5 recomienda la VPN **por política** con subredes concretas, aunque exija más gestión: en la de ruta, con su política habitual `0.0.0.0/0`, si las rutas de los dos lados no casan el tráfico puede ir cifrado en un sentido y no en el otro, o salir en claro. La VTI **no** está en ninguna RFC: es término de fabricante. Y GRE no ofrece confidencialidad (RFC 2784).',
    },
  ],
};
