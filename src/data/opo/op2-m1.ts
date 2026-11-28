import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// OP2M1 — Redes corporativas: diseño
// Fuentes: docs/superpowers/sources/2026-11-27-op2-fuentes.md §13 (Cisco, valor
// del fabricante; RFC 7938), §12.1 (RFC 4364 §3, VRF), §15 (mp.com.4) y §18
// (sin fuente: red fuera de banda, VRF-lite). Escenario: canon arcedo.md §3–§6, §7e.
// ---------------------------------------------------------------------------
export const OP2_M1: Module = {
  id: 'op2m1',
  sectionId: 'op2',
  title: 'Redes corporativas: diseño jerárquico, campus y CPD',
  minutes: 25,
  objectives: [
    'Describir las capas de acceso, distribución y núcleo de una red de campus y decidir cuándo basta un núcleo colapsado, como en la sede del Consorcio',
    'Razonar en términos de dominios de fallo: dónde poner la frontera entre capa 2 y capa 3 y qué redundancia evita que una avería se extienda',
    'Contrastar la red de campus con la de un CPD en hoja-espina (Clos plegado de 3 etapas) según la RFC 7938, con su numeración de niveles, ECMP y EBGP con ASN privados',
    'Elegir la herramienta de segmentación adecuada (VLAN, VRF, separación física) y situar la red de gestión del Consorcio, la VLAN 99, frente a una red fuera de banda',
    'Calcular una relación de sobresuscripción, compararla con los ejemplos de la guía de Cisco y prever cómo cambia cuando cae un enlace',
  ],
  blocks: [
    {
      t: 'p',
      md: 'Montar una red que funcione el primer día es fácil; lo difícil es que siga funcionando cuando se rompe un enlace, cuando se duplica el número de puestos o cuando alguien conecta un cable donde no debía. Esta lección va de **diseño**: cómo se organiza una red corporativa en capas, por qué cada capa hace lo que hace, cómo se reparte el riesgo en **dominios de fallo**, en qué se diferencia la red de un CPD de la de un edificio de oficinas, cómo se separan los tráficos y cómo se dimensionan los enlaces de subida. Casi todo lo que sigue es buena práctica de ingeniería y no norma: lo que viene de la guía de diseño de Cisco se rotula como **valor del fabricante**, y lo que viene de la **RFC 7938** se dice como tal, recordando que es una RFC **informativa** (describe una práctica, no obliga a nada). VLAN, árbol de expansión y LACP ya están explicados en la lección de LAN; aquí se dan por sabidos.',
    },
    { t: 'h', text: 'El modelo jerárquico: acceso, distribución y núcleo' },
    {
      t: 'p',
      md: 'La guía de diseño de campus de Cisco (*Campus LAN and Wireless LAN Design Guide*, valor del fabricante) reparte la red de un campus en tres capas, cada una con un trabajo distinto:\n\n- **Acceso** (*access*): donde se conectan los usuarios y los equipos, por cable o sin cable. Aquí viven la seguridad y la resiliencia de la conexión.\n- **Distribución** (*distribution*): agrega los conmutadores de acceso, da servicios y es la **frontera entre capa 2 y capa 3**. También es el sitio natural para **resumir rutas**, de modo que lo que pasa dentro de un bloque no se propague al resto.\n- **Núcleo** (*core*): une las distribuciones en una LAN grande. Según la guía, el núcleo es **solo capa 3**.\n\nNo toda red necesita las tres. La misma guía dice que un edificio puede apañarse con acceso y distribución, y que un campus de varios edificios suele pedir las tres.',
    },
    {
      t: 'table',
      headers: ['Capa', 'Qué hace (guía de Cisco)', 'Qué no suele hacer (práctica habitual, no de la guía)', 'En la sede del Consorcio'],
      rows: [
        ['Acceso', 'Conecta usuarios y equipos; seguridad y resiliencia de la conexión', 'Encaminar entre bloques o resumir rutas', 'Un conmutador de capa 2 por planta'],
        ['Distribución', 'Agrega los accesos, da servicios, frontera capa 2 / capa 3, resume rutas', 'Conectar usuarios finales directamente', 'DIST1 y DIST2, de capa 3, con una SVI por VLAN'],
        ['Núcleo', 'Une distribuciones en una LAN grande; solo capa 3', 'Llevar VLAN de usuario o aplicar políticas complejas', 'No hay núcleo dedicado: la distribución hace de núcleo'],
      ],
    },
    {
      t: 'p',
      md: 'Cuando no hay núcleo dedicado se habla de un diseño de **dos niveles** o de **núcleo colapsado** (*collapsed core*): la distribución hace también de núcleo, y puede albergar además la conexión WAN, la salida a Internet y las controladoras inalámbricas. Cisco lo presenta como la opción de las LAN pequeñas y recomienda un núcleo dedicado cuando hay **al menos tres** bloques de distribución que unir; menciona como otros factores la densidad de puertos, los puntos únicos de fallo, el riesgo de los cambios y la dispersión geográfica. Una explicación razonable (no la da la guía): con dos distribuciones basta un enlace (o un par) entre ellas, pero con tres o más, unirlas todas con todas multiplica los enlaces y cada cambio en una distribución toca a las demás.',
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'La sede del Consorcio: un núcleo colapsado',
      md: 'La sede central del Consorcio Provincial de Arcedo tiene **conmutadores de planta de capa 2** y **dos conmutadores de distribución de capa 3, DIST1 y DIST2**, con una SVI por VLAN (SVI es el nombre de Cisco para la interfaz virtual de VLAN). Las VLAN son la **10** Usuarios (`10.20.10.0/24`), la **20** Servidores (`10.20.20.0/24`), la **30** Voz (`10.20.30.0/24`), la **40** Impresoras y la **99** Gestión (`10.20.99.0/24`). No hay un tercer nivel: DIST1 y DIST2 encaminan entre las VLAN y hacen de núcleo. (Otra pieza del curso describe un momento en que un encaminador con subinterfaces comunicaba las VLAN por un único troncal; esta lección parte del diseño con DIST1 y DIST2.) Con un único bloque de distribución, es el caso en que la guía de Cisco considera suficiente el núcleo colapsado. El CPD, en una sala del mismo edificio y con su propio bloque `10.20.72.0/21`, tiene **dos conmutadores unidos por cuatro enlaces de 10 Gbit/s agrupados con LACP**. Cómo se une ese CPD con DIST1 y DIST2 no está fijado en este escenario; aunque se contara como un segundo bloque, seguirían siendo dos, por debajo de los tres a partir de los cuales Cisco recomienda un núcleo dedicado.',
    },
    {
      t: 'check',
      q: {
        q: 'Según la guía de diseño de campus de Cisco, ¿a partir de cuándo se recomienda pasar de un núcleo colapsado a un núcleo dedicado?',
        choices: [
          'En cuanto hay dos conmutadores de distribución, para no unirlos directamente',
          'Cuando hay al menos tres bloques de distribución que unir',
          'Cuando la red supera los 200 puestos de trabajo',
          'Nunca: la guía considera el núcleo colapsado válido para cualquier tamaño',
        ],
        answer: 1,
        explain:
          'La guía de Cisco (valor del fabricante) recomienda núcleo dedicado cuando hay al menos tres distribuciones, y añade otros factores como la densidad de puertos o la dispersión geográfica. Dos distribuciones se unen bien entre sí: es el caso típico del núcleo colapsado, como DIST1 y DIST2 en la sede del Consorcio. La guía no da ningún umbral en número de puestos; los 200 puestos son solo el tamaño de la sede del Consorcio.',
      },
    },
    { t: 'h', text: 'Dominios de fallo y redundancia' },
    {
      t: 'p',
      md: 'Un **dominio de fallo** es el trozo de red que se ve afectado cuando algo se rompe o se porta mal. Un bucle de capa 2, una tormenta de difusión o un error de configuración en una VLAN afectan a todos los conmutadores por los que se extiende esa VLAN. Por eso la frontera entre capa 2 y capa 3 importa tanto: cuanto más abajo se pone (en la distribución, o incluso en el acceso), más pequeños son los dominios de capa 2 y menos se propaga una avería. Lo que pasa en un bloque se queda en el bloque, y la distribución, resumiendo rutas, evita que cada cambio interno se anuncie hacia fuera.\n\nLa otra cara es la **redundancia**: que ningún equipo o enlace sea, por sí solo, el que tumba el servicio. En un campus jerárquico se consigue con piezas que ya conoces:\n\n- **Dos distribuciones** y cada conmutador de acceso con un enlace de subida a cada una.\n- **Enlaces agregados** con LACP entre equipos que se hablan mucho, como los dos conmutadores del CPD del Consorcio.\n- **Puerta de enlace redundante** con VRRP, para que los equipos de una VLAN no dependan de una sola SVI.\n- **Árbol de expansión** con el puente raíz elegido a propósito (en la sede, uno de los conmutadores de distribución con prioridad 4096), para que los caminos de reserva queden bloqueados de forma predecible y no se formen bucles.\n\nDoblar no basta si las dos mitades fallan juntas. Dos distribuciones en el mismo armario y con la misma alimentación comparten dominio de fallo físico: la lección de alta disponibilidad lo trata con detalle.',
    },
    {
      t: 'check',
      q: {
        q: 'En un campus, la VLAN de usuarios se extiende por los conmutadores de acceso de cinco plantas y por las dos distribuciones. Un puesto conectado mal provoca una tormenta de difusión en esa VLAN. ¿Qué cambio de diseño habría limitado más el alcance de la avería?',
        choices: [
          'Añadir una tercera distribución para repartir mejor la carga',
          'Usar una VLAN por planta, terminada en la distribución, y encaminar entre ellas en capa 3',
          'Aumentar la velocidad de los enlaces de subida de cada planta',
          'Poner la puerta de enlace de la VLAN en un solo conmutador de distribución',
        ],
        answer: 1,
        explain:
          'Una tormenta de difusión afecta a todo el dominio de capa 2 de la VLAN. Si cada planta tiene su propia VLAN y la distribución encamina entre ellas, la difusión se queda en la planta donde empezó: el dominio de fallo se encoge. Una tercera distribución o enlaces más rápidos no cambian el tamaño del dominio de capa 2. Dejar la puerta de enlace en un solo conmutador empeora la redundancia y no limita la tormenta.',
      },
    },
    { t: 'h', text: 'Campus y CPD: del árbol a la hoja-espina' },
    {
      t: 'p',
      md: 'En un campus, la mayor parte del tráfico sube del usuario hacia un servidor o hacia fuera y vuelve: se dice que es tráfico **norte-sur**. En un CPD moderno pesa mucho el tráfico **entre servidores**, el llamado **este-oeste** (*east-west*): una aplicación que consulta su base de datos, réplicas, copias. La **RFC 7938** (*Use of BGP for Routing in Large-Scale Data Centers*, informativa, agosto de 2016) describe cómo se resuelve eso en CPD grandes. Parte del CPD tradicional en **árbol**, con tres capas que llama *core*, *aggregation/distribution* y *access* (en su numeración, **Tier 1, 2 y 3**, con el núcleo como Tier 1), y propone en su lugar un **Clos plegado de 3 etapas**, la red **hoja-espina** (*leaf and spine*):\n\n- La **espina** (*spine*) es la etapa central: **Tier 1**.\n- Las **hojas** (*leaf*) son la entrada y la salida, donde se conectan los servidores: **Tier 2**.\n- Si hace falta más capacidad, se pasa a un **Clos de 5 etapas**, en el que los conmutadores de bastidor (*top of rack*, **ToR**) son **Tier 3**.\n\nCada hoja se conecta a todas las espinas. Entre dos servidores de hojas distintas hay tantos caminos como espinas, todos del mismo coste, y el tráfico servidor-servidor se reparte entre ellos con **ECMP** (*Equal-Cost Multi-Path*, varios caminos de igual coste). La RFC pide que el abanico de ECMP sea al menos igual al número de enlaces de subida, y advierte que cada espina tiene **un solo camino** hasta cada servidor, por lo que **resumir rutas** en ella es peligroso: si cae ese camino, el resumen seguiría atrayendo tráfico hacia un destino al que ya no llega.',
    },
    {
      t: 'p',
      md: 'Para encaminar, la RFC 7938 elige **EBGP como único protocolo** de la red, en lugar de combinar un protocolo interior con otro exterior, y numera los equipos con **números de sistema autónomo (ASN) privados**, del **64512 al 65534**; si no bastan, usa los de 4 bytes de la RFC 6793. BGP ya se vio en la lección de encaminamiento; aquí lo nuevo es usarlo **dentro** de un CPD, no solo hacia el operador.',
    },
    {
      t: 'table',
      headers: ['', 'Campus jerárquico (guía de Cisco)', 'CPD en hoja-espina (RFC 7938)'],
      rows: [
        ['Tráfico dominante', 'Norte-sur: usuario hacia servidores o hacia fuera', 'Este-oeste: servidor con servidor'],
        ['Estructura', 'Acceso, distribución y núcleo (o núcleo colapsado)', 'Clos plegado de 3 etapas: hojas (Tier 2) y espinas (Tier 1); 5 etapas con ToR en Tier 3'],
        ['Frontera capa 2 / capa 3', 'En la distribución', 'La RFC propone encaminar con EBGP en toda la red'],
        ['Caminos', 'Habitualmente uno activo y otro de reserva (práctica habitual; la guía de Cisco leída no lo fija)', 'Varios caminos de igual coste, repartidos con ECMP'],
        ['Resumen de rutas', 'Recomendado en la distribución', 'Peligroso en las espinas: un solo camino a cada servidor'],
        ['Encaminamiento', 'Protocolo interior en el campus (en el Consorcio, OSPF)', 'EBGP como único protocolo, ASN privados 64512–65534'],
      ],
    },
    {
      t: 'callout',
      kind: 'warn',
      title: 'El CPD del Consorcio no es una hoja-espina',
      md: 'El CPD del Consorcio son **dos conmutadores** unidos por cuatro enlaces de 10 Gbit/s con LACP: con 40 Gbit/s agregados entre los dos, si cae un enlace quedan 30. No tiene espinas ni hojas, ni un segundo centro: el Consorcio **no tiene CPD de respaldo**. La hoja-espina se estudia aquí porque es el diseño de referencia para CPD grandes; en las preguntas aparece siempre como «otra red». Y cuidado con la palabra *Tier*: en la RFC 7938, en el Clos de 3 etapas la espina es Tier 1 y la hoja Tier 2, y en el árbol tradicional Tier 1 es el núcleo. No tiene nada que ver con otras clasificaciones de CPD por niveles, que no se tratan en esta lección.',
    },
    {
      t: 'check',
      q: {
        q: 'Según la RFC 7938, en una red hoja-espina (Clos plegado de 3 etapas), ¿qué nivel ocupa cada tipo de conmutador?',
        choices: [
          'Las hojas son Tier 1 y las espinas Tier 2',
          'Las espinas son Tier 1 y las hojas Tier 2',
          'Las espinas son Tier 3, porque están en el centro del Clos',
          'Hojas y espinas son Tier 1; Tier 2 queda para los ToR',
        ],
        answer: 1,
        explain:
          'La RFC 7938 llama espina (Tier 1) a la etapa central y hoja (Tier 2) a la de entrada y salida. Invertirlo es la confusión más habitual, porque las hojas son las que están «abajo», cerca de los servidores. Tier 3 aparece solo en el Clos de 5 etapas, y ahí lo ocupan los ToR, no las espinas.',
      },
    },
    { t: 'h', text: 'Segmentación: VLAN, VRF y separación física' },
    {
      t: 'p',
      md: 'Segmentar es separar tráficos para que una avería o un intruso en una parte no alcance las demás, y para poder aplicar a cada parte su propia política. Hay tres herramientas, de menos a más separación:\n\n- **VLAN**: separa en capa 2. Cada VLAN es un dominio de difusión, pero todas comparten la misma tabla de rutas en el conmutador de capa 3. Entre la VLAN 10 y la VLAN 20 del Consorcio hay comunicación en cuanto DIST1 o DIST2 encaminan entre ellas, salvo que se filtre.\n- **VRF**: separa en capa 3. La RFC 4364 (§3) describe las **VRF** (*VPN Routing and Forwarding tables*) en los encaminadores de borde de un operador: cada una es una tabla de rutas y de reenvío propia, y cada interfaz se asocia por configuración a una de ellas. Lo que está en una VRF no ve las rutas de otra, y dos VRF pueden incluso usar las mismas direcciones. La idea se aplica también dentro de una red corporativa para aislar, por ejemplo, la gestión o la red de un tercero; esa aplicación en el campus no la fija ninguna norma de las que usa esta lección, y el detalle de las VRF de un operador está en la lección de conectividad entre centros.\n- **Separación física**: equipos y cables distintos. Es la más fuerte y la más cara.',
    },
    {
      t: 'table',
      headers: ['Herramienta', 'Qué separa', 'Comparte con el resto', 'Uso típico'],
      rows: [
        ['VLAN', 'Dominios de difusión (capa 2)', 'La tabla de rutas del conmutador de capa 3', 'Usuarios, servidores, voz, impresoras, gestión'],
        ['VRF', 'Tablas de rutas y de reenvío (capa 3)', 'El equipo físico', 'Clientes de un operador; dentro de una organización, tráficos que no deben verse ni por error'],
        ['Separación física', 'Todo: equipos, cables y alimentación si se quiere', 'Nada, salvo donde se interconecte a propósito', 'Redes de gestión fuera de banda o de máxima sensibilidad'],
      ],
    },
    {
      t: 'p',
      md: 'El ENS recoge esta preocupación en la medida **`mp.com.4` «Separación de flujos de información en la red»**, que se valora por la **categoría** del sistema: **no aplica en BÁSICA**, en **MEDIA** se exige con uno de los refuerzos **R1, R2 o R3**, y en **ALTA** con **R2 o R3, más R4**. El texto de cada refuerzo está en la norma y se repasa con las demás medidas en la lección del ENS enlazada al final.',
    },
    {
      t: 'check',
      q: {
        q: 'Las VLAN 10 Usuarios y 20 Servidores de la sede del Consorcio tienen sus SVI en DIST1 y DIST2, en la misma tabla de rutas. ¿Qué afirmación es correcta?',
        choices: [
          'Al estar en VLAN distintas, sus equipos nunca pueden comunicarse entre sí',
          'Comparten dominio de difusión, porque terminan en los mismos conmutadores',
          'Están separadas en capa 2, pero se comunican en capa 3 a través de DIST1 o DIST2 salvo que se filtre ese tráfico',
          'Están en VRF distintas, porque cada SVI crea su propia tabla de rutas',
        ],
        answer: 2,
        explain:
          'Cada VLAN es un dominio de difusión propio, así que la separación en capa 2 es real; pero las dos SVI están en la misma tabla de rutas y el conmutador encamina entre ellas, a menos que haya un filtro. Pensar que VLAN distintas nunca se hablan es el error tentador: la VLAN separa la difusión, no impide el encaminamiento. Una SVI no crea una VRF; para eso hay que definir la VRF y asociarle la interfaz.',
      },
    },
    { t: 'h', text: 'La red de gestión' },
    {
      t: 'p',
      md: 'Los conmutadores, encaminadores y demás equipos de red se administran por algún sitio. En el Consorcio ese sitio es la **VLAN 99 Gestión** (`10.20.99.0/24`): una VLAN propia para las interfaces de administración, separada de usuarios y servidores. Es gestión **dentro de banda** (*in-band*): viaja por los mismos conmutadores y enlaces que el tráfico que administra. Funciona bien mientras la red funciona, pero si un bucle o una tormenta satura esos enlaces, la VLAN 99 cae con ellos, justo cuando más falta hace entrar a los equipos.\n\nLa práctica habitual para resolverlo es una **red de gestión fuera de banda** (*out-of-band*): una red aparte, con sus propios conmutadores y cables (o con acceso por consola), que llega a los puertos de gestión de los equipos sin pasar por la red de datos. Es una práctica general de ingeniería, no una exigencia con número de ninguna norma que use esta lección, y el Consorcio **no tiene una fijada**: su gestión es la VLAN 99.',
    },
    {
      t: 'check',
      q: {
        q: 'Un bucle de capa 2 satura los troncales de la sede. Los técnicos intentan entrar a DIST1 por su dirección de la VLAN 99 y no responde. ¿Qué explica mejor el fallo?',
        choices: [
          'La VLAN 99 es gestión dentro de banda: comparte conmutadores y troncales con el tráfico saturado, así que cae con él',
          'La VLAN 99 no tiene puerta de enlace fijada, luego nunca ha funcionado',
          'DIST1 ha perdido su SVI de la VLAN 10 y con ella toda su configuración',
          'Las VLAN de gestión se bloquean automáticamente cuando el árbol de expansión detecta un bucle',
        ],
        answer: 0,
        explain:
          'La VLAN 99 viaja por los mismos troncales que el resto: si un bucle los satura, la gestión se queda sin camino. Esa es la razón de ser de una red fuera de banda, con medios propios. Que la puerta de enlace de la VLAN 99 no esté escrita en el escenario no significa que no exista, y el árbol de expansión no trata de forma especial a ninguna VLAN de gestión; si estuviera funcionando bien, de hecho, no habría bucle.',
      },
    },
    { t: 'h', text: 'Dimensionado: la sobresuscripción' },
    {
      t: 'p',
      md: 'Un conmutador de acceso tiene muchos puertos hacia los usuarios y pocos hacia arriba. Si todos los usuarios transmitieran a la vez a su velocidad máxima, los enlaces de subida no darían abasto. Como eso no pasa casi nunca, se acepta conscientemente: es la **sobresuscripción** (*oversubscription*), la relación entre la capacidad de bajada y la de subida, expresada como **N:1**. Se calcula sumando capacidades: **(puertos de bajada × velocidad) / (enlaces de subida × velocidad)**.',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Ejemplo resuelto: un conmutador de acceso supuesto (cifras del ejercicio, no del Consorcio)',
      text: `Conmutador de acceso: 48 puertos de 1 Gbit/s hacia los puestos
Subida: 2 enlaces de 10 Gbit/s, uno a cada distribución

Bajada  = 48 × 1 Gbit/s  = 48 Gbit/s
Subida  =  2 × 10 Gbit/s = 20 Gbit/s
Relación = 48 / 20 = 2,4  →  2,4:1

Si cae un enlace de subida:
Subida  =  1 × 10 Gbit/s = 10 Gbit/s
Relación = 48 / 10 = 4,8  →  4,8:1   (el doble: con la mitad de subida, la relación se duplica)

Con 4 enlaces de 10 Gbit/s:
Subida  =  4 × 10 Gbit/s = 40 Gbit/s
Relación = 48 / 40 = 1,2  →  1,2:1`,
    },
    {
      t: 'p',
      md: 'La guía de Cisco da ejemplos con sus propios equipos (valor del fabricante, no una norma). Entre acceso y distribución, para un conmutador con un máximo de 156 Gbit/s de bajada y 20 de subida, calcula **156:20 = 7,8:1**, y con un uso realista de los puertos, **72:20 = 3,6:1**; para una pila de conmutadores, **288:40 = 7,2:1**. Entre distribución y núcleo, **800:80 = 10:1** con enlaces de 40 Gbit/s u **800:200 = 4:1** con enlaces de 100 Gbit/s (el primer ejemplo supera la orientación general de 4:1; el segundo la alcanza). Como guía general, dice que se han implantado relaciones de **hasta 20:1** entre acceso y distribución y de **hasta 4:1** entre distribución y núcleo: cuanto más arriba, menos sobresuscripción, se entiende que porque cada enlace agrega el tráfico de más usuarios.',
    },
    {
      t: 'table',
      headers: ['Tramo', 'Ejemplo de la guía de Cisco', 'Relación', 'Orientación general de Cisco'],
      rows: [
        ['Acceso → distribución (un conmutador, máximo)', '156 Gbit/s : 20 Gbit/s', '7,8:1', 'Hasta 20:1'],
        ['Acceso → distribución (un conmutador, realista)', '72 : 20', '3,6:1', 'Hasta 20:1'],
        ['Acceso → distribución (pila, realista)', '288 : 40', '7,2:1', 'Hasta 20:1'],
        ['Distribución → núcleo (enlaces de 40 Gbit/s)', '800 : 80', '10:1', 'Hasta 4:1'],
        ['Distribución → núcleo (enlaces de 100 Gbit/s)', '800 : 200', '4:1', 'Hasta 4:1'],
      ],
    },
    {
      t: 'p',
      md: 'En un CPD la cuenta es la misma con otro nombre. La RFC 7938 (§3.2.2) llama **N** a los puertos de bajada de un conmutador Tier 2 y **M** a los de subida: la red es **sin bloqueo** si **M ≥ N**, y si no, está **sobresuscrita por N/M**. Por ejemplo, una hoja con 48 puertos de bajada y 16 de subida de la misma velocidad está sobresuscrita 48/16 = **3:1**; con 48 y 48, 1:1, sin bloqueo. La RFC añade que, en la práctica, la sobresuscripción se introduce en el **ToR** (Tier 3, en el Clos de 5 etapas) y se limita a una sola capa.',
    },
    {
      t: 'check',
      q: {
        q: 'Un conmutador de acceso tiene 24 puertos de 1 Gbit/s hacia los puestos y 2 enlaces de subida de 1 Gbit/s. ¿Qué relación de sobresuscripción tiene, y cuál queda si cae uno de los enlaces de subida?',
        choices: [
          '12:1 con los dos enlaces y 24:1 con uno solo',
          '12:1 con los dos enlaces y 6:1 con uno solo',
          '24:1 con los dos enlaces y 48:1 con uno solo',
          '2:1 con los dos enlaces y 1:1 con uno solo',
        ],
        answer: 0,
        explain:
          '24 × 1 / (2 × 1) = 12, es decir, 12:1; con un solo enlace, 24 / 1 = 24:1. Al perder la mitad de la subida, la relación se duplica, no se reduce a la mitad: el 6:1 sale de dividir en lugar de multiplicar. El 24:1 con los dos enlaces olvida que hay dos, y el 2:1 confunde el número de enlaces con la relación.',
      },
    },
    {
      t: 'links',
      title: 'Lo que ya está explicado en otras lecciones',
      items: [
        { label: 'VLAN, 802.1Q, árbol de expansión y LACP (lección op1m3)', href: '/learn/op1m3' },
        { label: 'OSPF, BGP y VRRP (lección op1m4)', href: '/learn/op1m4' },
        { label: 'Formas de unir sedes: líneas dedicadas, MPLS, VPN por Internet y fibra oscura (lección op1m5)', href: '/learn/op1m5' },
        { label: 'Alta disponibilidad: serie, paralelo y puntos únicos de fallo (lección op4m1)', href: '/learn/op4m1' },
        { label: 'Conectividad entre centros: VPN MPLS y Red SARA (lección op2m5)', href: '/learn/op2m5' },
        { label: 'Medidas del ENS, entre ellas mp.com.4 «Separación de flujos de información en la red» (lección op6m3)', href: '/learn/op6m3' },
      ],
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Lo que más se confunde',
      md: '**Capas (guía de Cisco, valor del fabricante):** el acceso conecta, la distribución agrega y es la frontera capa 2 / capa 3 y el sitio para resumir rutas, el núcleo une distribuciones y es solo capa 3. **Núcleo colapsado:** la distribución hace de núcleo; Cisco recomienda núcleo dedicado con **al menos tres** distribuciones. **Dominio de fallo:** una VLAN extendida por todo el edificio es un dominio de fallo enorme. **RFC 7938 (informativa):** hoja-espina = **Clos plegado de 3 etapas**; espina **Tier 1**, hoja **Tier 2**, ToR **Tier 3** en el de 5 etapas; ECMP; nada de resumir en las espinas; **EBGP** como único protocolo y ASN privados **64512–65534**. **Sobresuscripción:** bajada / subida; si cae la mitad de la subida, la relación **se duplica**; sin bloqueo si **M ≥ N**, si no **N/M**. Los **20:1** y **4:1** son ejemplos de Cisco, no norma. **VLAN** separa la difusión; **VRF** separa la tabla de rutas. **VLAN 99** es gestión dentro de banda; la red **fuera de banda** es práctica general y el Consorcio no la tiene. **`mp.com.4`:** n.a. en BÁSICA.',
    },
  ],
  quiz: [
    {
      id: 'op2m1q1',
      domain: 'Infraestructuras de comunicaciones',
      prompt:
        'Según la guía de diseño de campus de Cisco, ¿qué capa del modelo jerárquico es la frontera entre capa 2 y capa 3 y el punto indicado para resumir rutas?',
      choices: [
        'La capa de acceso',
        'La capa de núcleo',
        'La capa de distribución',
        'Ninguna: la guía deja la frontera a elección de cada red',
      ],
      answer: 2,
      explain:
        'La guía de Cisco (valor del fabricante) asigna a la **distribución** la agregación de los accesos, la frontera capa 2 / capa 3 y el resumen de rutas. El núcleo tienta porque «encamina», pero según la guía es **solo capa 3** y su trabajo es unir distribuciones, no ser frontera. El acceso conecta usuarios y equipos.',
    },
    {
      id: 'op2m1q2',
      domain: 'Infraestructuras de comunicaciones',
      cognitiveLevel: 'apply',
      prompt:
        'La sede del Consorcio tiene conmutadores de planta de capa 2 y dos conmutadores de distribución de capa 3, DIST1 y DIST2, que encaminan entre las VLAN. Un consultor propone añadir dos conmutadores de núcleo dedicados. Con la guía de Cisco en la mano, ¿qué se le responde?',
      choices: [
        'Que es imprescindible: sin núcleo dedicado el modelo jerárquico no es válido',
        'Que con un solo bloque de distribución basta el núcleo colapsado; Cisco recomienda núcleo dedicado a partir de tres distribuciones',
        'Que el núcleo debería ir en los conmutadores de planta, que son los que más tráfico generan',
        'Que hay que convertir DIST1 y DIST2 en conmutadores de capa 2 para que el núcleo haga todo el encaminamiento',
      ],
      answer: 1,
      explain:
        'La guía de Cisco presenta el diseño de dos niveles (núcleo colapsado) como adecuado para LAN pequeñas y recomienda núcleo dedicado cuando hay **al menos tres** distribuciones; la sede tiene un único bloque de distribución. Decir que sin núcleo el modelo no vale es el error tentador: la propia guía admite que un edificio se apañe con acceso y distribución. Pasar la distribución a capa 2 rompería la frontera capa 2 / capa 3 y agrandaría los dominios de fallo.',
    },
    {
      id: 'op2m1q3',
      domain: 'Infraestructuras de comunicaciones',
      cognitiveLevel: 'apply',
      prompt:
        'Un conmutador de acceso de otra red tiene 48 puertos de 1 Gbit/s hacia los puestos y 4 enlaces de subida de 10 Gbit/s. Cae uno de los enlaces de subida. ¿Qué relación de sobresuscripción queda?',
      choices: [
        '1,2:1',
        '4,8:1',
        '0,625:1',
        '1,6:1',
      ],
      answer: 3,
      explain:
        'Bajada: 48 × 1 = 48 Gbit/s. Con los cuatro enlaces, la subida es 40 Gbit/s y la relación 48 / 40 = **1,2:1**, que es la trampa: es la cifra de antes de la avería. Con tres enlaces quedan 30 Gbit/s y 48 / 30 = **1,6:1**. El 4,8:1 sería con un solo enlace de 10 Gbit/s, y el 0,625:1 sale de dividir al revés (30 / 48).',
    },
    {
      id: 'op2m1q4',
      domain: 'Infraestructuras de comunicaciones',
      prompt:
        'Según la guía de diseño de campus de Cisco, ¿qué relaciones de sobresuscripción se han implantado como orientación general entre acceso y distribución y entre distribución y núcleo?',
      choices: [
        'Hasta 20:1 entre acceso y distribución y hasta 4:1 entre distribución y núcleo',
        'Hasta 4:1 entre acceso y distribución y hasta 20:1 entre distribución y núcleo',
        '1:1 en todos los tramos, porque cualquier sobresuscripción es un error de diseño',
        'Las que fija la RFC 7938 para cualquier red: N/M en todos los tramos',
      ],
      answer: 0,
      explain:
        'La guía de Cisco (valor del fabricante, no norma) habla de hasta **20:1** en el acceso y hasta **4:1** entre distribución y núcleo: cuanto más arriba, menos sobresuscripción, porque cada enlace agrega más usuarios. Invertir las cifras es la trampa. La RFC 7938 da la fórmula N/M para un Clos de CPD, no unos valores para un campus, y la sobresuscripción es una decisión consciente, no un error.',
    },
    {
      id: 'op2m1q5',
      domain: 'Infraestructuras de comunicaciones',
      cognitiveLevel: 'apply',
      prompt:
        'Otra red, no la del Consorcio: en un CPD en hoja-espina, cada hoja tiene 48 puertos de bajada hacia los servidores y 16 de subida hacia las espinas, todos de la misma velocidad. Según la RFC 7938, ¿cómo está esa hoja?',
      choices: [
        'Sin bloqueo, porque cada hoja se conecta a todas las espinas',
        'Sobresuscrita 16/48, es decir, 1:3',
        'Sin bloqueo, porque ECMP reparte el tráfico entre todas las espinas',
        'Sobresuscrita 3:1, porque M es menor que N (N/M = 48/16)',
      ],
      answer: 3,
      explain:
        'La RFC 7938 (§3.2.2) llama N a los puertos de bajada y M a los de subida: la red es sin bloqueo si M ≥ N; si no, la sobresuscripción es **N/M**, aquí 48/16 = **3:1**. Conectar cada hoja a todas las espinas y repartir con ECMP da caminos de igual coste, pero no crea capacidad: con 16 puertos de subida no caben 48 de bajada a plena carga. El 1:3 es la fracción al revés.',
    },
    {
      id: 'op2m1q6',
      domain: 'Infraestructuras de comunicaciones',
      prompt:
        'La RFC 7938 describe el encaminamiento de CPD grandes en hoja-espina. ¿Qué propone?',
      choices: [
        'OSPF en las hojas y BGP solo en las espinas, con ASN públicos',
        'EBGP como único protocolo de la red, con números de sistema autónomo privados del 64512 al 65534',
        'IBGP con un único sistema autónomo para todo el CPD y reflectores de rutas en las hojas',
        'Rutas estáticas en cada hoja, porque la topología Clos no cambia',
      ],
      answer: 1,
      explain:
        'La RFC 7938 (§5.1 y §5.2.1) elige **EBGP** como único protocolo y numera los equipos con **ASN privados 64512–65534** (y los de 4 bytes si no bastan). La mezcla de un protocolo interior con otro exterior es justo lo que evita: tienta porque es lo habitual en un campus, donde el Consorcio usa OSPF. IBGP con un solo sistema autónomo y las rutas estáticas no son lo que propone la RFC.',
    },
    {
      id: 'op2m1q7',
      domain: 'Infraestructuras de comunicaciones',
      cognitiveLevel: 'analyze',
      prompt:
        'Una organización quiere que la red de un contratista conectada a sus conmutadores no pueda alcanzar las redes internas ni por un error de encaminamiento, aunque compartan los mismos equipos. Hoy cada una está en su VLAN, con las SVI en la misma tabla de rutas. ¿Qué cambio responde mejor a ese requisito?',
      choices: [
        'Cambiar el número de VLAN del contratista por uno más alto',
        'Poner la red del contratista en una VRF propia, con su tabla de rutas separada de la de las redes internas',
        'Activar el árbol de expansión en los puertos del contratista',
        'Agrupar con LACP los enlaces del contratista para que no compartan troncal',
      ],
      answer: 1,
      explain:
        'Con las SVI en la misma tabla de rutas, el conmutador encamina entre esas VLAN en cuanto no hay un filtro: la VLAN separa la difusión, no el encaminamiento. Una **VRF** da a la red del contratista su propia tabla de rutas y de reenvío (la idea de la RFC 4364 §3), de modo que no ve las rutas internas aunque comparta el equipo. Cambiar el número de VLAN no cambia nada, y el árbol de expansión y LACP resuelven bucles y capacidad, no aislamiento.',
    },
    {
      id: 'op2m1q8',
      domain: 'Infraestructuras de comunicaciones',
      prompt:
        'La medida del ENS mp.com.4 «Separación de flujos de información en la red» se valora por la categoría del sistema. ¿Cómo se aplica?',
      choices: [
        'Se exige tal cual en las tres categorías, sin refuerzos',
        'Solo en ALTA; en BÁSICA y MEDIA no aplica',
        'No aplica en BÁSICA; en MEDIA se exige con uno de los refuerzos R1, R2 o R3, y en ALTA con R2 o R3 más R4',
        'Se exige en BÁSICA y MEDIA, y en ALTA se sustituye por la medida de perímetro seguro',
      ],
      answer: 2,
      explain:
        'Según la tabla de aplicación del RD 311/2022, `mp.com.4` es **n.a.** en BÁSICA, **+ [R1 o R2 o R3]** en MEDIA y **+ [R2 o R3] + R4** en ALTA. «Solo en ALTA» tienta porque en BÁSICA no aplica, pero olvida que en MEDIA ya se exige. La que aplica en todas las categorías es `mp.com.1` «Perímetro seguro», que no sustituye a esta.',
    },
  ],
};
