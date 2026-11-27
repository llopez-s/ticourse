import type { ClassifyData, LabMeta, OrderData } from '../labs';

// ---------------------------------------------------------------------------
// Redes y ENS · Bloque 2 (Infraestructuras de comunicaciones) — Consorcio Provincial de Arcedo
// Fuente única: docs/superpowers/sources/2026-11-27-op2-fuentes.md (ENS: dossier op6, op.acc.6 R8/R9)
// Canon: docs/superpowers/canon/arcedo.md §6 y §7e (encaminador central 203.0.113.10 termina los
// túneles IPsec de respaldo; accesos de respaldo 198.51.100.31/.32/.33; oficinas 10.20.8.0/24 y
// 10.20.9.0/24). Lo que sale de un fabricante va rotulado como tal.
// ---------------------------------------------------------------------------

export const OP2_LABS: LabMeta[] = [
  {
    id: 'opl2a',
    sectionId: 'op2',
    title: 'El túnel de respaldo levanta detrás de un NAT',
    icon: '🔐',
    minutes: 10,
    xp: 75,
    kind: 'order',
    brief:
      'Cae el acceso MPLS de una oficina y su encaminador levanta el túnel IPsec de respaldo hacia la sede con IKEv2, pero entre medias hay un NAT del proveedor de Internet. Ordena los 8 momentos, desde el primer mensaje IKE por UDP 500 hasta el keepalive que mantiene viva la entrada del NAT.',
  },
  {
    id: 'opl2b',
    sectionId: 'op2',
    title: '¿Cómo unimos estas sedes?',
    icon: '🌐',
    minutes: 12,
    xp: 100,
    kind: 'classify',
    brief:
      'Doce requisitos para unir sedes o centros. Elige la tecnología que pide cada uno: la VPN de capa 3 que presta el operador sobre MPLS, un túnel IPsec sobre accesos a Internet, una VPN de capa 2 del operador (VPLS o EVPN) o fibra oscura iluminada con DWDM. Clasifica el requisito, no el presupuesto. Necesitas ≥80 %.',
  },
  {
    id: 'opl2c',
    sectionId: 'op2',
    title: 'Teletrabajo: ¿por dónde va el tráfico?',
    icon: '🏠',
    minutes: 12,
    xp: 100,
    kind: 'classify',
    brief:
      'Doce situaciones de acceso remoto. Decide si piden túnel completo (todo el tráfico por la VPN), túnel dividido (solo el de la organización), acceso de confianza cero por aplicación (ZTNA) o escritorio remoto a través de una pasarela. Ojo con el túnel dividido: NIST SP 800-77r1 lo desaconseja con fuerza y SP 800-46r2 pide plantearse desactivarlo en redes no fiables, mientras que SP 800-207 quiere que el equipo remoto llegue a la nube sin volver por la VPN; ninguna respuesta vale sin contexto. El doble factor no decide: el ENS lo pide en todas las categorías (op.acc.6 R8 y R9). Necesitas ≥80 %.',
  },
];

// ---------------------------------------------------------------------------
// Order labs
// ---------------------------------------------------------------------------

export const OP2_ORDER_DATA: Record<string, OrderData> = {
  opl2a: {
    prompt:
      'Ha caído el acceso MPLS de la oficina comarcal 10.20.8.0/24. Su encaminador inicia el túnel IPsec de respaldo con IKEv2 hacia el encaminador central de la sede, que lo termina en 203.0.113.10. Supuesto: el acceso a Internet de la oficina está detrás de un NAT de su proveedor, que presenta el tráfico del encaminador con la dirección pública 198.51.100.31 y puede cambiarle el puerto de origen; la sede, en cambio, no tiene NAT delante. Toca los momentos en el orden en que ocurren.',
    steps: [
      {
        text: 'La oficina envía la petición IKE_SA_INIT a UDP 500 con los avisos de detección de NAT',
        detail:
          'Todo IKEv2 empieza con IKE_SA_INIT (RFC 7296 §1.2), en claro: HDR, SAi1 (las suites que ofrece), KEi (su parte del Diffie-Hellman) y Ni (su nonce). Justo detrás del nonce van los Notify NAT_DETECTION_SOURCE_IP y NAT_DETECTION_DESTINATION_IP: un SHA-1 de los SPI, la IP y el puerto de origen y de destino tal como los ve la oficina (RFC 7296 §2.23). El NAT del proveedor cambia la dirección de origen a 198.51.100.31 por el camino.',
      },
      {
        text: 'La sede contesta IKE_SA_INIT con la suite elegida, su KE, su nonce y sus avisos de detección de NAT',
        detail:
          'El respondedor elige una suite de las ofrecidas y responde HDR, SAr1, KEr, Nr y, si quiere, CERTREQ (RFC 7296 §1.2), con sus propios NAT_DETECTION_SOURCE_IP y NAT_DETECTION_DESTINATION_IP. Al procesar la petición, la sede ya ha visto que el hash de origen no casa con 198.51.100.31: el emisor está detrás de un NAT. La respuesta va al puerto de origen que traía el paquete, aunque el NAT lo haya cambiado (§2.23).',
      },
      {
        text: 'Los hashes no coinciden: la oficina sabe que está detrás de un NAT',
        detail:
          'La oficina recalcula el hash de destino con su propia dirección y no coincide con el NAT_DETECTION_DESTINATION_IP de la sede, que se calculó con 198.51.100.31: el receptor (la oficina) está detrás de un NAT y SHOULD enviar keepalives (RFC 7296 §2.23). A la vez, cada lado calcula SKEYSEED y de ahí las claves SK_e, SK_a y SK_d que protegerán lo que sigue (§1.2).',
      },
      {
        text: 'La oficina manda la petición IKE_AUTH desde UDP 4500, con cuatro octetos a cero delante',
        detail:
          'Quien detecta un NAT MUST mandar todo lo siguiente desde el puerto 4500, y la encapsulación en UDP nunca se hace en el 500 (RFC 7296 §2.23). En el 4500, IKE lleva el marcador no-ESP de cuatro octetos a cero antes de su cabecera (RFC 3948 §2.2). El mensaje va cifrado con las claves de IKE_SA_INIT: HDR, SK {IDi, [CERT,] AUTH, SAi2, TSi, TSr}; las identidades quedan ocultas a un espía pasivo.',
      },
      {
        text: 'La sede responde IKE_AUTH por UDP 4500 con su identidad, su AUTH y los selectores aceptados',
        detail:
          'Respuesta HDR, SK {IDr, [CERT,] AUTH, SAr2, TSi, TSr} (RFC 7296 §1.2), también con los cuatro octetos a cero delante y dirigida al puerto que el NAT haya asignado. Con esto se autentican los dos extremos y los mensajes anteriores. Si la SA hija fallara aquí (NO_PROPOSAL_CHOSEN, TS_UNACCEPTABLE), la SA IKE se crearía igual; si falla la autenticación (AUTHENTICATION_FAILED), no.',
      },
      {
        text: 'Queda establecida la SA hija: un par de SA ESP, una por sentido',
        detail:
          'La primera SA hija sale del propio IKE_AUTH, sin CREATE_CHILD_SA: cuatro mensajes en total (RFC 7296 §1.2). Una SA es simplex, así que hacen falta dos, una por sentido, cada una con su SPI de 32 bits elegido por el receptor (RFC 4301 §4.1, RFC 4303 §2.1). Sus claves se derivan de SK_d y de los nonces de IKE_SA_INIT (§2.17); los selectores dicen qué tráfico entre 10.20.8.0/24 y la sede va por ella.',
      },
      {
        text: 'Un paquete de 10.20.8.0/24 hacia la sede sale en ESP dentro de UDP 4500',
        detail:
          'Como hay NAT, los dos extremos MUST encapsular ESP en UDP (RFC 7296 §2.23), con los mismos puertos que IKE (RFC 3948 §2.1). Aquí no hay marcador: ESP va directamente tras la cabecera UDP de 8 octetos, y el receptor lo distingue de IKE porque el SPI nunca es 0. El protocolo IP 50 a secas no cruzaría bien el NAT.',
      },
      {
        text: 'Tras 20 s sin tráfico, la oficina envía un solo octeto 0xFF al puerto 4500',
        detail:
          'Es el NAT-keepalive de la RFC 3948 (§2.3 y §4): un octeto 0xFF que se SHOULD enviar si no ha salido otro paquete en M = 20 s (valor por defecto), solo para que el NAT no borre la entrada. MUST NOT usarse para saber si el otro extremo vive: eso se comprueba con un INFORMATIONAL vacío, que exige respuesta (RFC 7296 §2.4).',
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Classify labs
// ---------------------------------------------------------------------------

export const OP2_CLASSIFY_DATA: Record<string, ClassifyData> = {
  opl2b: {
    passPct: 80,
    categories: [
      { id: 'l3vpn', label: 'VPN MPLS de capa 3' },
      { id: 'ipsec', label: 'Túnel IPsec por Internet' },
      { id: 'l2vpn', label: 'VPN de capa 2 (VPLS/EVPN)' },
      { id: 'dwdm', label: 'Fibra oscura con DWDM' },
    ],
    items: [
      {
        text: 'La sede y las tres oficinas deben hablar todas con todas, con un solo acceso por sede y prioridad garantizada para la voz',
        answer: 'l3vpn',
        why: 'Es la elección del Consorcio para su WAN principal (op1m5): el operador encamina entre todas las sedes y ofrece una clase de servicio para la voz de extremo a extremo. Con líneas dedicadas harían falta seis circuitos, y por Internet nadie garantiza el retardo.',
      },
      {
        text: 'El encaminador de cada sede solo debe intercambiar rutas con el equipo del operador, nunca con los de las demás sedes',
        answer: 'l3vpn',
        why: 'En la RFC 4364 §1.2 el CE es par de enrutamiento del PE, no de los CE de otras sedes: el cliente no gestiona una troncal virtual y la propia RFC dice que no es un «overlay». Con túneles entre sedes, en cambio, cada extremo habla con el otro.',
      },
      {
        text: 'Dos organismos usan los mismos rangos de direcciones privadas, contratan el mismo operador y no deben verse entre sí, con encaminamiento IP entre sus sedes',
        answer: 'l3vpn',
        why: 'Las VPN sin sedes comunes pueden tener direcciones solapadas (RFC 4364 §1.3): cada circuito de acceso va a su VRF en el PE, y el RD de 8 bytes hace únicas las rutas de cada una (§4.1). Los P de la troncal no guardan nada por VPN (§1.5).',
      },
      {
        text: 'Cada oficina necesita un camino de respaldo barato hacia la sede, que solo se use si cae su acceso principal',
        answer: 'ipsec',
        why: 'Es el respaldo del Consorcio (op1m5 y canon §6): un acceso a Internet barato en cada oficina y un túnel cifrado hacia la sede, que termina en 203.0.113.10. Internet es de mejor esfuerzo, pero para un respaldo basta.',
      },
      {
        text: 'Una sede provisional para tres meses debe quedar unida a la sede en pocos días, con el acceso a Internet que haya disponible',
        answer: 'ipsec',
        why: 'El acceso a Internet con VPN es barato y rápido de desplegar (op1m5): basta una conexión corriente y levantar el túnel. Es la arquitectura gateway-to-gateway de NIST SP 800-77r1 §2.4, típica para unir una sucursal con la sede por Internet.',
      },
      {
        text: 'Un local alquilado solo tiene una conexión a Internet de un proveedor que lo pone detrás de su NAT, y el tráfico con la sede tiene que ir cifrado',
        answer: 'ipsec',
        why: 'IKEv2 detecta el NAT en IKE_SA_INIT y pasa a UDP 4500 con ESP encapsulado en UDP (RFC 7296 §2.23, RFC 3948), así que el túnel cruza el NAT. Ninguno de los servicios del operador llega a un local que solo tiene Internet.',
      },
      {
        text: 'Varias sedes deben quedar en el mismo segmento Ethernet, como si colgaran del mismo conmutador, con un servicio multipunto que presta el operador',
        answer: 'l2vpn',
        why: 'VPLS es una VPN de capa 2 multipunto que se comporta como una LAN Ethernet y aprende direcciones MAC (RFC 4761, RFC 4762). Una VPN de capa 3 encamina subredes distintas; no extiende un segmento.',
      },
      {
        text: 'Una aplicación heredada exige que servidores de dos sedes compartan VLAN y subred, y el operador debe aprender las direcciones MAC por su plano de control',
        answer: 'l2vpn',
        why: 'Compartir subred pide capa 2. Que el aprendizaje de MAC entre PE vaya por el plano de control (MP-BGP) y no por el de datos es lo que distingue a EVPN de VPLS (RFC 7432 §4). Ejemplo de otra red: el Consorcio no tiene este servicio.',
      },
      {
        text: 'Cada sede se conecta a dos equipos del operador a la vez, los dos reenviando su tráfico Ethernet, y la red del operador lo reparte como una sola LAN',
        answer: 'l2vpn',
        why: 'Es el modo All-Active de EVPN: un Ethernet Segment unido a varios PE que reenvían todos el unicast conocido (RFC 7432 §3), algo que VPLS hace mal (§1). Sigue siendo una VPN de capa 2.',
      },
      {
        text: 'La réplica de almacenamiento entre dos centros de datos de la misma ciudad necesita mucha capacidad y poder ampliarla sin cambiar de medio',
        answer: 'dwdm',
        why: 'Es el caso que op1m5 reserva a la fibra oscura: la capacidad se amplía añadiendo longitudes de onda sobre la misma fibra y la latencia es la del trazado. La VPN de las oficinas está dimensionada para tráfico de usuario. Supuesto: el Consorcio no tiene CPD de respaldo.',
      },
      {
        text: 'El cliente quiere alquilar solo el medio físico, sin equipos del operador, y poner su propia electrónica en los dos extremos',
        answer: 'dwdm',
        why: 'La fibra oscura es fibra óptica alquilada sin equipos del operador: el cliente pone la electrónica y decide la capacidad (op1m5). En los servicios VPN, en cambio, los PE y P son del operador (RFC 4364 §1.2).',
      },
      {
        text: 'Por un único par de fibras entre dos centros deben viajar a la vez varias señales independientes, cada una en su propia longitud de onda',
        answer: 'dwdm',
        why: 'Eso es DWDM: varias señales por la misma fibra, cada una en una longitud de onda distinta, con la rejilla de la recomendación UIT-T G.694.1 (op1m5). Es multiplexación óptica, no un servicio de VPN.',
      },
    ],
  },
  opl2c: {
    passPct: 80,
    categories: [
      { id: 'full', label: 'Túnel completo' },
      { id: 'split', label: 'Túnel dividido' },
      { id: 'ztna', label: 'Acceso de confianza cero (ZTNA)' },
      { id: 'rdgw', label: 'Escritorio remoto por pasarela' },
    ],
    items: [
      {
        text: 'Los portátiles del personal se conectan a menudo desde wifi públicas de hoteles y estaciones',
        answer: 'full',
        why: 'En redes no fiables, como las wifi públicas, NIST SP 800-46r2 §3.3.3 dice que las organizaciones «should consider disabling» el túnel dividido. Con todo por la VPN, el tráfico pasa por los controles de la organización. El doble factor lo pide igualmente op.acc.6 R8.',
      },
      {
        text: 'Toda la navegación del personal en teletrabajo debe pasar por el proxy y el cortafuegos de la sede, igual que cuando trabaja en la oficina',
        answer: 'full',
        why: 'Es la alternativa al túnel dividido que describe NIST SP 800-77r1 §2.4.2: todo el tráfico por la VPN y por el cortafuegos de la organización, cuando no se confía en que el equipo hable directamente con Internet.',
      },
      {
        text: 'Si un portátil estuviera comprometido, no debe poder hacer de puente entre Internet y la red interna',
        answer: 'full',
        why: 'El túnel dividido puede convertir el equipo en puente entre una red de confianza y otra que no lo es (SP 800-46r2 §3.3.3); prohibirlo limita el daño (SP 800-77r1 §7.2.1.2), que por eso lo «strongly discouraged». Aun así, wifi o datos móviles pueden saltárselo: conviene dejar activa solo la interfaz del túnel.',
      },
      {
        text: 'La salida a Internet de la sede se satura porque la navegación de cientos de teletrabajadores entra por la VPN y vuelve a salir, y la organización acepta el riesgo para equipos corporativos',
        answer: 'split',
        why: 'Menos tráfico ajeno y menos ancho de banda en la sede es la ventaja que reconoce NIST SP 800-77r1 §7.2.1.2 al túnel dividido, aunque lo desaconseje con fuerza: elegirlo es una decisión de riesgo documentada, no la opción por defecto.',
      },
      {
        text: 'El correo y la ofimática están en la nube y deben llegar ahí sin dar la vuelta por la sede; la red interna sigue alcanzándose por la VPN',
        answer: 'split',
        why: 'NIST SP 800-207 §3.4.1 (supuesto 8) quiere que un activo remoto llegue a los recursos sin pasar antes por la red corporativa, por ejemplo al correo en la nube. Con la VPN aún necesaria para la red interna, eso es mandar al túnel solo lo de la organización.',
      },
      {
        text: 'Solo el tráfico hacia 10.20.0.0/16 tiene que entrar en el túnel; las videollamadas de la plataforma en la nube, que sufren retardo al dar la vuelta, deben salir directas',
        answer: 'split',
        why: 'Es la definición de SP 800-77r1 §2.4.2: solo el tráfico de la organización va por la VPN. NIST lo desaconseja con fuerza y SP 800-46r2 pide plantearse desactivarlo en redes no fiables, así que conviene limitarlo a equipos gestionados.',
      },
      {
        text: 'Cada persona debe llegar solo a las aplicaciones internas que necesita, sin quedar conectada a la red interna, con su identidad y el estado de su equipo evaluados en cada sesión',
        answer: 'ztna',
        why: 'Acceso por sesión con mínimo privilegio y política dinámica (identidad, estado del equipo) son principios de NIST SP 800-207 §2.1. Gartner, citado por Mplify 117.1, llama ZTNA al perímetro lógico por identidad y contexto alrededor de un usuario y unas aplicaciones: el sustituto de la VPN. La SP 800-207 no usa la palabra ZTNA.',
      },
      {
        text: 'El acceso a una aplicación debe cortarse en mitad de la sesión si el equipo deja de cumplir la política, por ejemplo al desactivar el antivirus',
        answer: 'ztna',
        why: 'En SP 800-207 §3, el Policy Engine concede, deniega o revoca el acceso y el Policy Administrator ordena a los PEP cerrar el camino; la autenticación y la autorización se reevalúan de forma continua (§2.1). Una VPN de cliente decide al conectar, no aplicación por aplicación.',
      },
      {
        text: 'Estar conectado en la sede no debe dar más confianza que estar en casa: se exige el mismo control por sesión en cualquier lugar',
        answer: 'ztna',
        why: 'Principio 2 de SP 800-207 §2.1: toda comunicación se protege sea cual sea la ubicación, y estar en la red corporativa no da confianza. Mplify 117.1 (apéndice B) define ZTNA así, en cualquier lugar, también dentro de la red; ni un túnel completo ni uno dividido cambian la confianza de la red interna.',
      },
      {
        text: 'Desde casa, el personal debe manejar su propio puesto de la oficina por RDP sin abrir el 3389 a Internet ni montar una VPN',
        answer: 'rdgw',
        why: 'RD Gateway da acceso desde redes públicas a escritorios internos «without the need for a VPN», cifra el canal con TLS y solo pide TCP 443 y UDP 3391; el 3389 es el puerto por defecto de RDP en el equipo (valor del fabricante: Microsoft Learn).',
      },
      {
        text: 'Una aplicación de escritorio antigua solo funciona instalada en los puestos de la sede y hay que usarla desde casa sin instalarla allí',
        answer: 'rdgw',
        why: 'El escritorio remoto es uno de los cuatro tipos de acceso remoto de NIST SP 800-46r2 §2.2: el usuario controla un equipo interno donde la aplicación ya está. Publicado por una pasarela, no hace falta poner el equipo de casa en la red interna.',
      },
      {
        text: 'El usuario debe controlar un equipo interno a través de un servidor intermedio que lo autentica y une las dos conexiones',
        answer: 'rdgw',
        why: 'Es el escritorio remoto indirecto de SP 800-46r2 §2.2.3: un servidor intermedio, cuya seguridad es crítica porque autentica y ve el tráfico entre las dos conexiones. El directo, del cliente al equipo, suelen impedirlo cortafuegos y NAT.',
      },
    ],
  },
};
