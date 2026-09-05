import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// SP3M3 — IoT, ICS/SCADA, RTOS, embedded y consideraciones de arquitectura
// (SY0-701, objetivo 3.1)
// ---------------------------------------------------------------------------
const sp3m3: Module = {
  id: 'sp3m3',
  sectionId: 'sp3',
  title: 'IoT, ICS/SCADA, RTOS, embedded y consideraciones de arquitectura',
  minutes: 13,
  objectives: [
    'Describir los riesgos característicos de IoT, ICS/SCADA, RTOS y embedded systems, y por qué no se defienden como un servidor corriente',
    'Explicar por qué en entornos OT el orden de prioridad se invierte a availability, integrity y confidentiality',
    'Aplicar las doce consideraciones de arquitectura del objetivo 3.1 como criterios de decisión',
    'Elegir controles compensatorios cuando un sistema no se puede parchear ni reiniciar',
    'Distinguir risk transference de un control técnico y situar la high availability como propiedad de la arquitectura',
  ],
  blocks: [
    {
      t: 'p',
      md: 'Las dos lecciones anteriores hablaban de infraestructura que se puede apagar, clonar y volver a desplegar: máquinas virtuales, contenedores, redes definidas por software. Esta lección trata de lo contrario. En un puerto conviven sistemas que llevan **veinte años funcionando sin apagarse**, que mueven cargas de cuarenta toneladas sobre personas y que no se pueden reiniciar «para aplicar el parche del martes». El objetivo 3.1 los agrupa en cuatro familias —**IoT**, **ICS/SCADA**, **RTOS** y **embedded systems**— y añade una lista de **doce consideraciones** que el examen usa como criterios para elegir entre arquitecturas. Como analista, tu trabajo aquí no es endurecer el sistema hasta romperlo, sino reconocer qué limitación tienes delante y qué control es realista.',
    },
    { t: 'h', text: 'IoT: flotas enormes con mantenimiento inexistente' },
    {
      t: 'p',
      md: 'El **Internet of Things (IoT)** son dispositivos con propósito específico —cámaras, sensores de temperatura, cerraduras electrónicas, medidores, balizas— conectados a la red y gestionados casi siempre desde una nube del fabricante. Su perfil de riesgo se explica con tres rasgos. Primero, **credenciales por defecto**: llegan con usuario y contraseña de fábrica publicados en el manual, y en un despliegue de cientos de unidades nadie los cambia uno a uno. Segundo, **no hay canal de actualización**: muchos fabricantes no publican firmware nuevo, o lo publican pero la actualización es manual dispositivo a dispositivo, así que las vulnerabilidades conocidas se quedan abiertas durante años. Tercero, la **escala**: un fallo trivial multiplicado por mil unidades se convierte en una botnet, y la superficie de ataque crece cada vez que operaciones instala un sensor más sin avisar a seguridad. La defensa esperada nunca es «instalar antivirus en la cámara» —no cabe—, sino **inventario, cambio de credenciales, una VLAN propia sin salida a internet y monitorización del tráfico** que sale de esa red.',
    },
    {
      t: 'check',
      q: {
        q: 'The Halden Port Authority deploys 240 IP cameras across the container terminal. A scan shows that most still accept the vendor default administrator password and that the vendor released no firmware update in five years. Which combination of controls is MOST appropriate?',
        choices: [
          'Install an endpoint detection agent on each camera and enable automatic updates',
          'Change the default credentials and isolate the cameras in a dedicated VLAN with no internet access',
          'Replace all 240 cameras immediately before any other action is taken',
          'Accept the risk, because IoT devices are not part of the corporate attack surface',
        ],
        answer: 1,
        explain:
          'IoT devices cannot run endpoint agents and the vendor supplies no patches, so the realistic answer is to remove the easiest entry point and confine the fleet with network controls. Immediate replacement is the tempting distractor, but the exam expects compensating controls now rather than a purchase that may take months and does not protect the devices in the meantime.',
      },
    },
    { t: 'h', text: 'ICS y SCADA: cuando la disponibilidad manda' },
    {
      t: 'p',
      md: 'Los **industrial control systems (ICS)** son los sistemas que gobiernan procesos físicos: **PLC** (programmable logic controllers) que abren y cierran válvulas, **RTU** en instalaciones remotas, **HMI** desde donde una operadora supervisa el proceso y un **historian** que guarda las lecturas. **SCADA** (supervisory control and data acquisition) es la capa que reúne y supervisa esos controladores repartidos por una planta, una red eléctrica o, en Halden, las esclusas y las grúas del muelle. Este mundo —el **operational technology (OT)**— tiene tres rasgos que lo separan de la informática de oficina. Los **protocolos son heredados y no autentican**: Modbus, DNP3 o Profinet se diseñaron para redes aisladas y aceptan una orden de escritura de quien sea que la envíe. Los **ciclos de vida son de quince o veinticinco años**, así que el sistema operativo de la HMI puede llevar una década sin soporte. Y el proceso **no se puede detener**: una parada de la cinta de contenedores cuesta dinero, pero una parada de las bombas de una esclusa puede inundar un muelle. Por eso, cuando la pregunta habla de OT, **la prioridad se invierte**: primero **availability**, después **integrity** y al final **confidentiality**. Que un dato de caudal sea público importa poco; que la bomba se pare, muchísimo.',
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen: OT invierte la CIA y «no se puede parchear» tiene una respuesta fija',
      md: 'Dos automatismos que valen puntos. **Uno:** en cualquier escenario de ICS/SCADA/OT el orden de prioridad es **availability → integrity → confidentiality**; si una opción propone algo que interrumpe el proceso (reiniciar el PLC, cortar el tráfico con un IPS, forzar un parche en horario laboral), casi siempre es la incorrecta. **Dos:** cuando el enunciado dice que el sistema **no se puede parchear** —**inability to patch**, porque el fabricante desapareció, porque el parche invalida la certificación o porque no hay ventana de parada—, la respuesta esperada son **controles compensatorios**: segmentar y aislar la red OT, restringir el acceso a un único camino administrativo, monitorizar de forma pasiva y controlar los medios extraíbles. Nunca «parchearlo igualmente», nunca «reemplazarlo esta semana» y nunca «desconectarlo» si el proceso lo necesita. Y ojo con **risk transference**: es una decisión de gestión (seguro, cláusula contractual), no un control técnico, así que no reduce la vulnerabilidad, solo reparte la pérdida.',
    },
    {
      t: 'check',
      q: {
        q: 'A vulnerability is published for the PLCs that operate the Halden sluice gates. The vendor firmware fix requires a controller restart, and the sluice can only be taken out of service during the annual maintenance window, eight months away. What should the analyst recommend now?',
        choices: [
          'Apply the firmware update during the next night shift to close the vulnerability quickly',
          'Disconnect the PLCs from the network until the annual maintenance window',
          'Segment the PLC network, restrict administrative access and increase passive monitoring until the window',
          'Document the finding and take no further action, since the vendor has released a fix',
        ],
        answer: 2,
        explain:
          'When a control system cannot be patched within an acceptable timeframe, the expected answer is a set of compensating controls that reduce exposure while availability is preserved. Applying the update at night is the tempting distractor, but an unplanned restart of a safety-related process is exactly what OT priorities forbid.',
      },
    },
    { t: 'h', text: 'RTOS, embedded y alta disponibilidad' },
    {
      t: 'p',
      md: 'Un **real-time operating system (RTOS)** es un sistema operativo que garantiza que una tarea se ejecuta **dentro de un plazo determinista**: no basta con que la respuesta sea correcta, tiene que llegar a tiempo. El sistema anticolisión de una grúa pórtico debe reaccionar en milisegundos; si el planificador se retrasa, la carga sigue bajando. Eso tiene una consecuencia directa para la seguridad: **no puedes añadir procesos que compitan por la CPU** —ni agentes, ni escaneos, ni cifrado no previsto— y **no puedes reiniciar el dispositivo** para aplicar un cambio sin parar el proceso físico. Los **embedded systems** son la familia más amplia: hardware con firmware fijo y una única función, como básculas, lectores RFID, controladoras de acceso o los propios PLC. Su firmware suele venir **firmado por el fabricante** y solo él puede actualizarlo; si el producto llega a **end-of-life**, no vuelve a haber parches. Además tienen **compute** mínimo: procesador y memoria justos para su tarea, lo que descarta cualquier control basado en agentes. Frente a todo esto, la **high availability (HA)** no es un producto sino una **propiedad de la arquitectura**: se consigue duplicando lo que no puede fallar —controladores redundantes, fuentes de alimentación dobles, rutas de red alternativas— para que un fallo aislado no se convierta en una parada del proceso.',
    },
    {
      t: 'table',
      headers: ['Sistema', 'Qué es', 'Riesgo principal', 'Control realista'],
      rows: [
        [
          'IoT',
          'Cámaras, sensores, cerraduras y medidores conectados, en flotas de cientos o miles',
          'Credenciales por defecto, sin canal de actualización, telemetría hacia la nube del fabricante',
          'Inventario, cambio de credenciales, VLAN propia sin salida a internet, vigilancia del tráfico',
        ],
        [
          'ICS / SCADA',
          'PLC, RTU, HMI e historian que gobiernan y supervisan un proceso físico',
          'Protocolos heredados sin autenticación y ciclos de vida de 15-25 años; el proceso no se puede parar',
          'Segmentación OT estricta, un único camino administrativo, monitorización pasiva, control de medios',
        ],
        [
          'RTOS',
          'Sistema operativo con plazos deterministas: anticolisión, frenado, dosificación',
          'No admite carga extra ni reinicios; un retraso en la respuesta es un riesgo de seguridad física',
          'Redundancia, ventanas de parada planificadas, aislamiento en lugar de agentes',
        ],
        [
          'Embedded system',
          'Hardware de función única con firmware fijo: básculas, lectores RFID, controladoras de acceso',
          'Firmware solo actualizable por el fabricante, o ya sin soporte; compute insuficiente para agentes',
          'Verificar firmware firmado, restringir el acceso de red, controles compensatorios',
        ],
      ],
    },
    { t: 'h', text: 'Las doce consideraciones de arquitectura del objetivo 3.1' },
    {
      t: 'table',
      headers: ['Consideración', 'Pregunta que responde', 'Ejemplo en Halden'],
      rows: [
        [
          '**Availability**',
          '¿Puede este servicio dejar de estar disponible, y durante cuánto tiempo?',
          'Las bombas de las esclusas tienen que funcionar siempre; el portal de reservas puede caer una hora',
        ],
        [
          '**Resilience**',
          '¿Sigue funcionando cuando un componente falla?',
          'Dos controladores redundantes en las compuertas, cada uno con su alimentación y su ruta de red',
        ],
        [
          '**Cost**',
          '¿Cuánto cuesta comprarlo, operarlo, licenciarlo y sustituirlo?',
          'Duplicar toda la SCADA cuesta más que el día de parada que evitaría; se duplica solo la parte crítica',
        ],
        [
          '**Responsiveness**',
          '¿Responde dentro del plazo que exige el proceso?',
          'El anticolisión de la grúa necesita milisegundos; una inspección profunda en línea añadiría demasiada latencia',
        ],
        [
          '**Scalability**',
          '¿Aguanta si la carga se multiplica?',
          'Pasar de 200 a 2.000 sensores de contenedor sin rediseñar la recogida de telemetría',
        ],
        [
          '**Ease of deployment**',
          '¿Cuánto esfuerzo cuesta desplegarlo en todos los sitios donde hace falta?',
          'Un agente se instala en 40 PC de oficina en una tarde; en 600 lectores de muelle, no se instala en absoluto',
        ],
        [
          '**Risk transference**',
          '¿Puedo trasladar la pérdida económica a un tercero?',
          'Ciberseguro y cláusulas de responsabilidad en el contrato con el integrador de SCADA',
        ],
        [
          '**Ease of recovery**',
          '¿Con qué rapidez y con qué esfuerzo vuelvo al estado bueno conocido?',
          'Restaurar la imagen de una HMI lleva veinte minutos; reprogramar un PLC a mano, dos días con el fabricante',
        ],
        [
          '**Patch availability**',
          '¿El fabricante publica parches, con qué frecuencia y hasta cuándo?',
          'El fabricante de la báscula publicó su último firmware en 2016 y cerró la línea de producto',
        ],
        [
          '**Inability to patch**',
          '¿Qué hago si este sistema no se puede parchear nunca?',
          'El PLC de la esclusa solo se toca en la parada anual: segmentar, restringir accesos y vigilar',
        ],
        [
          '**Power**',
          '¿Cuánta energía necesita y qué ocurre cuando falla el suministro?',
          'Sensores de boya con batería solar; sala de control con SAI y generador probados',
        ],
        [
          '**Compute**',
          '¿Tiene CPU y memoria para el control que quiero desplegar?',
          'Un lector RFID no puede ejecutar el EDR corporativo: la protección tiene que venir de la red',
        ],
      ],
    },
    {
      t: 'callout',
      kind: 'tip',
      title: 'Cómo se leen estas doce en el examen',
      md: 'Las preguntas rara vez dicen el nombre de la consideración: describen una tensión y esperan que la nombres. **«Tiene que estar siempre en línea»** → availability. **«Aguanta el fallo de un nodo sin caer»** → resilience. **«Reacciona en milisegundos»** → responsiveness (no availability). **«Duplicar la carga sin rediseñar»** → scalability. **«Volver a producción rápido después del incidente»** → ease of recovery (no resilience: resilience evita la caída, recovery la repara). **«El fabricante ya no publica actualizaciones»** → patch availability; **«y además no podemos aplicarlas nunca»** → inability to patch. **«Contratamos un seguro»** → risk transference. **«El dispositivo no tiene CPU para el agente»** → compute; **«y funciona con batería»** → power. Cuando dudes entre availability y resilience, pregúntate si el escenario mide *tiempo en servicio* o *comportamiento ante un fallo*.',
    },
    {
      t: 'check',
      q: {
        q: 'The port wants to add environmental sensors on channel buoys. They will run on solar batteries, sit kilometres offshore and report over a low-bandwidth radio link. Which architecture consideration MOST directly limits the security controls that can be deployed on them?',
        choices: [
          'Risk transference',
          'Ease of recovery',
          'Power and compute',
          'Scalability',
        ],
        answer: 2,
        explain:
          'Battery operation and a minimal processor mean the devices cannot run agents, heavy cryptography or continuous logging, which is exactly what the power and compute considerations describe. Scalability is the tempting distractor because the fleet may grow, but the constraint in the scenario is what each individual device can physically sustain.',
      },
    },
    {
      t: 'p',
      md: 'Ya sabes qué sistemas especializados hay en un puerto y con qué criterios se comparan las arquitecturas. La siguiente lección baja al plano del cable: dónde se coloca cada dispositivo, cómo se dibujan las **security zones**, qué pasa cuando un equipo de seguridad falla —**fail-open** o **fail-closed**— y qué hace cada **network appliance** del objetivo 3.2, desde el **jump server** hasta el **IPS**. Verás que casi todo lo que decidas allí depende de las prioridades que acabas de aprender aquí.',
    },
  ],
  quiz: [
    {
      id: 'sp3m3q1',
      domain: 'Security Architecture',
      prompt:
        'A SCADA historian at a container terminal runs an operating system that reached end of life three years ago. The application vendor will not certify a newer platform, and the terminal cannot stop operating. Which approach BEST reflects SY0-701 guidance?',
      choices: [
        'Upgrade the operating system anyway and accept the loss of vendor certification',
        'Expose the historian only through a public web portal so it can be patched remotely',
        'Apply compensating controls such as network segmentation, restricted access and monitoring',
        'Transfer the risk by purchasing cyber insurance and leave the system unchanged',
      ],
      answer: 2,
      explain:
        'An unpatchable production system is handled with compensating controls that shrink its exposure while the process keeps running. Cyber insurance is the tempting distractor: risk transference moves the financial loss to a third party but leaves the vulnerability, and the exam expects a technical mitigation as well.',
    },
    {
      id: 'sp3m3q2',
      domain: 'Security Architecture',
      prompt:
        'When securing an operational technology environment such as the sluice control network of a port, how does the priority of the security triad usually change compared with a corporate IT network?',
      choices: [
        'Availability comes first, then integrity, then confidentiality',
        'Confidentiality comes first, then availability, then integrity',
        'The order is identical, because the triad never changes',
        'Integrity comes first, then confidentiality, then availability',
      ],
      answer: 0,
      explain:
        'In OT the process controls physical equipment, so an interruption can cause damage or injury and availability is placed above everything else, with integrity next and confidentiality last. The option claiming the order never changes is tempting because the triad itself is universal, but SY0-701 explicitly expects the inverted order for industrial control environments.',
    },
    {
      id: 'sp3m3q3',
      domain: 'Security Architecture',
      prompt:
        'A port authority signs a cyber insurance policy that would cover the revenue lost during an outage of the terminal operating system. Which architecture consideration does this decision represent?',
      choices: ['Resilience', 'Ease of recovery', 'Patch availability', 'Risk transference'],
      answer: 3,
      explain:
        'Buying insurance shifts the financial consequence of an incident to another party, which is the definition of risk transference. Resilience is the tempting distractor, but resilience is achieved by designing the system to survive a failure, and a policy changes nothing about how the system behaves.',
    },
    {
      id: 'sp3m3q4',
      domain: 'Security Architecture',
      prompt:
        'Which characteristic is MOST typical of IoT devices deployed at scale and explains why they are frequently recruited into botnets?',
      choices: [
        'They run full server operating systems that attract commodity malware',
        'They ship with well-known default credentials and often have no update path',
        'They are always placed on isolated networks that cannot be reached remotely',
        'They require a hardware security module before they can join a network',
      ],
      answer: 1,
      explain:
        'Published factory credentials plus firmware that is never updated make thousands of identical devices trivially compromisable, which is how large IoT botnets are built. The first option is wrong because IoT devices run minimal purpose-built firmware, not full server operating systems.',
    },
    {
      id: 'sp3m3q5',
      domain: 'Security Architecture',
      prompt:
        'Engineers reject a proposal to add an in-line inspection agent to the anti-collision controller of a quay crane because the controller must react within a guaranteed number of milliseconds. Which property of the system drives that decision?',
      choices: [
        'It is an unsupported system awaiting replacement',
        'It is an IoT device managed from a vendor cloud',
        'It transfers risk to the crane manufacturer',
        'It runs a real-time operating system with deterministic timing requirements',
      ],
      answer: 3,
      explain:
        'An RTOS guarantees that a task completes within a fixed deadline, so any additional processing that competes for CPU time can turn a safe response into an unsafe one. Calling it an unsupported system is the tempting distractor, but the scenario says nothing about vendor support: the blocker is the timing guarantee.',
    },
    {
      id: 'sp3m3q6',
      domain: 'Security Architecture',
      prompt:
        'A terminal plans to grow from 200 to 2,000 container sensors over two years, and the security team is assessing whether the telemetry collection design will still work at that size. Which consideration are they evaluating?',
      choices: ['Scalability', 'Responsiveness', 'Risk transference', 'Inability to patch'],
      answer: 0,
      explain:
        'Scalability asks whether the architecture keeps working when the load or the fleet grows by an order of magnitude, which is exactly the question being asked. Responsiveness is the tempting distractor, but it concerns how fast the system reacts to a single event, not how much total load it can absorb.',
    },
    {
      id: 'sp3m3q7',
      domain: 'Security Architecture',
      prompt:
        'A weighbridge controller is an embedded system whose firmware can only be signed and released by the manufacturer, which discontinued the product line in 2016. Which two considerations BEST describe the security problem?',
      choices: [
        'Cost and ease of deployment',
        'Responsiveness and scalability',
        'Patch availability and inability to patch',
        'Power and risk transference',
      ],
      answer: 2,
      explain:
        'No vendor is publishing fixes any more, which is a patch availability problem, and nobody else can sign firmware for the device, which makes it genuinely unpatchable. Cost and ease of deployment are tempting because replacing the unit is expensive, but they describe the difficulty of the remedy, not the security weakness itself.',
    },
  ],
};

// ---------------------------------------------------------------------------
// SP3M4 — Asegurar la infraestructura: colocación, zonas, failure modes y
// appliances (SY0-701, objetivo 3.2)
// ---------------------------------------------------------------------------
const sp3m4: Module = {
  id: 'sp3m4',
  sectionId: 'sp3',
  title: 'Asegurar la infraestructura: colocación, zonas, failure modes y appliances',
  minutes: 13,
  objectives: [
    'Explicar device placement y security zones y colocar cada sistema del puerto en la zona que le corresponde',
    'Relacionar la colocación de un dispositivo con la reducción de la attack surface y con las vías de conectividad',
    'Distinguir fail-open de fail-closed y elegir el modo correcto según prime la disponibilidad o la seguridad',
    'Diferenciar los atributos active/passive e inline/tap y sus consecuencias sobre el tráfico',
    'Identificar la función y la ubicación de jump server, proxy, IDS, IPS, load balancer y sensores',
  ],
  blocks: [
    {
      t: 'p',
      md: 'El objetivo 3.2 se resume en una frase: **dónde pones cada cosa importa tanto como qué compras**. Un cortafuegos de última generación colocado detrás del servidor al que debía proteger no sirve de nada, y un IDS conectado a un puerto espejo no va a detener ningún ataque por mucho que lo detecte. Esta lección organiza las decisiones de colocación en cuatro capas: las **security zones** que dividen la red, el **device placement** dentro de ellas, el **failure mode** que decide qué pasa cuando el equipo falla y el catálogo de **network appliances** con su función concreta. En Halden todo esto es visible: la web pública, la ofimática de aduanas y los PLC de las esclusas cuelgan hoy del mismo conmutador, y ese plano es el que vas a rediseñar.',
    },
    { t: 'h', text: 'Zonas de seguridad, colocación y superficie de ataque' },
    {
      t: 'p',
      md: 'Una **security zone** es un grupo de sistemas que comparten **nivel de confianza y política**; entre dos zonas siempre hay un punto de control que decide qué tráfico pasa. Definir zonas es lo que convierte una red plana en una red defendible: si alguien compromete un portátil de oficina, el daño se detiene en la frontera de la zona en lugar de llegar a una grúa. El **device placement** es la decisión concreta dentro de ese mapa: un servidor accesible desde internet va a la **DMZ**, no a la red interna; un **IPS** va en la ruta del tráfico que debe proteger; un **jump server** va donde pueda ser el **único camino** hacia los sistemas críticos. Cada decisión modifica la **attack surface**: cada servicio publicado, cada regla de excepción y cada camino alternativo la amplían. La **connectivity** es la otra mitad del plano, porque una zona bien dibujada se rompe por sus atajos: el cable de un contratista en una sala de reuniones, un punto de acceso **wireless** que alcanza el aparcamiento, un módem 4G que un integrador dejó conectado al PLC «para dar soporte» o un túnel de acceso remoto sin MFA. Antes de añadir appliances, la analista dibuja **todas** las vías de entrada de cada zona.',
    },
    {
      t: 'table',
      headers: ['Zona', 'Qué contiene', 'Confianza', 'Regla de colocación'],
      rows: [
        [
          '**Untrusted** / internet',
          'Clientes, navieras, transportistas, cualquiera fuera del control del puerto',
          'Ninguna',
          'Nada del puerto vive aquí; todo lo que entra se inspecciona',
        ],
        [
          '**DMZ** / perímetro',
          'Web pública del puerto, SFTP de manifiestos, reverse proxy, correo entrante',
          'Baja',
          'Servicios que internet debe alcanzar; jamás inician conexiones libres hacia la red interna',
        ],
        [
          '**Internal**',
          'Ofimática, ficheros de personal, aplicación de RRHH, impresión',
          'Media',
          'No accesible desde internet; su acceso hacia OT pasa por un control explícito',
        ],
        [
          '**OT / ICS**',
          'PLC de esclusas, HMI de SCADA, pasarelas de sensores de muelle',
          'Crítica, pero frágil (alta criticidad, no alta confianza)',
          'Segmento aislado; sin salida a internet y con una única vía de administración auditada',
        ],
        [
          '**Management**',
          'Jump server, interfaces de gestión de switches y firewalls, consola de backup',
          'Máxima',
          'Solo alcanzable desde el jump server, con MFA; nunca comparte VLAN con puestos de usuario',
        ],
        [
          '**Guest** / wireless de visitantes',
          'Portátiles de transportistas, móviles de visita',
          'Ninguna',
          'Aislada del resto; salida directa a internet y ningún camino hacia internal ni OT',
        ],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'The Halden Port Authority wants administrators to reach the SCADA management interfaces without exposing them. Where should the jump server be placed?',
        choices: [
          'In the DMZ, published to the internet so administrators can reach it from anywhere',
          'In the management zone, as the single hardened path from which administrative sessions to critical systems are opened',
          'Inside the OT segment on the same VLAN as the sluice PLCs',
          'On the guest wireless network, so contractors can use it as well',
        ],
        answer: 1,
        explain:
          'A jump server exists to concentrate administrative access into one hardened, logged and MFA-protected hop, so it belongs in the management zone with tightly controlled inbound access. Publishing it to the internet from the DMZ is the tempting distractor because it is convenient, but it turns the single point of control into a single internet-facing target.',
      },
    },
    { t: 'h', text: 'Failure modes: fail-open y fail-closed' },
    {
      t: 'p',
      md: 'Todo dispositivo de seguridad que se sitúa **en la ruta del tráfico** acabará fallando algún día: se le agota la memoria, se corrompe la actualización de firmas o simplemente se queda sin alimentación. La pregunta de diseño es qué debe ocurrir en ese momento. En **fail-open** el equipo deja pasar el tráfico sin inspeccionar: **gana la disponibilidad** y se pierde la protección durante la avería. En **fail-closed** (también llamado *fail-secure*) el tráfico se detiene: **gana la seguridad** y se acepta la interrupción del servicio. Ninguno es «el correcto»: la elección depende de lo que cueste más caro. Un cortafuegos que separa del resto de la red la base de datos con los datos de tarjeta de sus clientes se configura **fail-closed**, porque dejar pasar tráfico sin inspección sería peor que una parada. Un dispositivo que se interpone en el bus de control de las bombas de las esclusas se configura **fail-open**, o directamente se coloca fuera de la ruta, porque una parada del proceso es un problema de seguridad física. La distinción tiene además un primo físico que el examen mezcla a propósito: una puerta **fail-safe** se abre al cortarse la corriente para que la gente pueda salir, y una puerta **fail-secure** se bloquea para proteger el activo. En las personas manda la vida; en los datos, la protección.',
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen: bloquear exige estar inline y activo',
      md: 'La trampa más repetida del 3.2 es la diferencia entre **ver** y **detener**. Un **IPS** solo bloquea si está **inline** (todo el tráfico lo atraviesa) y **active** (puede modificar o descartar sesiones). Un despliegue en **tap** o **puerto espejo** es **passive**: recibe una copia del tráfico, así que puede alertar pero **nunca podrá parar un ataque**, aunque el producto se llame IPS. Traduce estas frases: **«no debe interrumpir el tráfico de producción bajo ningún concepto»** → tap/passive, es decir **IDS**; **«tiene que bloquear el exploit antes de que llegue al servidor»** → **IPS inline**; **«necesitamos visibilidad sin riesgo de caída»** → sensores pasivos y espejo de puertos. Y recuerda que el modo de fallo solo se pregunta para dispositivos **inline**: un IDS pasivo que se cae no corta nada, únicamente crea un punto ciego.',
    },
    {
      t: 'check',
      q: {
        q: 'An inline security appliance is going to be installed in front of the control network that operates the sluice pumps. Operations warns that stopping the pumps could flood a dock. Which failure mode should be configured, and why?',
        choices: [
          'Fail-closed, because blocking all traffic is always the safest default',
          'Fail-open, because in this OT process an interruption is a greater risk than uninspected traffic',
          'Fail-closed, because the sluice network handles confidential data',
          'The failure mode is irrelevant for appliances placed in an OT network',
        ],
        answer: 1,
        explain:
          'In an OT process where a stoppage can cause physical harm, availability outranks inspection, so the device must keep traffic flowing when it fails and the risk is covered with segmentation and monitoring. Fail-closed as an always-safe default is the tempting distractor: it is the right choice for a firewall guarding sensitive data, not for a safety-related industrial process.',
      },
    },
    { t: 'h', text: 'Atributos del dispositivo: active/passive e inline/tap' },
    {
      t: 'p',
      md: 'CompTIA describe cada appliance con dos ejes que conviene no confundir. El primero es **dónde se sitúa respecto al tráfico**: **inline** significa que el tráfico real pasa a través del dispositivo, de modo que puede modificarlo, retenerlo o descartarlo, a costa de añadir latencia y de convertirse en un punto de fallo; **tap o monitor** significa que recibe una **copia** del tráfico desde un derivador óptico o un puerto espejo, sin tocar el original. El segundo eje es **qué puede hacer con lo que ve**: un dispositivo **active** interviene —bloquea, redirige, reinicia la sesión, reescribe cabeceras—, mientras que uno **passive** solo observa, registra y alerta. Los dos ejes suelen ir juntos (inline + active, tap + passive), pero no son lo mismo: un IPS desplegado inline puede configurarse en modo de solo detección, y entonces está inline pero se comporta de forma pasiva. La consecuencia práctica es siempre la misma: **si el tráfico no atraviesa el dispositivo, ese dispositivo no puede detener nada**.',
    },
    { t: 'h', text: 'El catálogo de network appliances' },
    {
      t: 'p',
      md: 'El **jump server** —también *jump box* o *bastion host*— es un servidor endurecido que actúa como **único punto de entrada** para la administración de sistemas críticos: se accede a él con MFA, se registra la sesión y desde ahí se abren las conexiones hacia la red de gestión o hacia OT. Un **proxy server** se interpone en las conexiones: el **forward proxy** atiende a los usuarios internos que salen a internet, aplicando filtrado de URL, inspección y caché, mientras que el **reverse proxy** vive en la DMZ y recibe las peticiones que llegan de internet hacia los servidores publicados, terminando **TLS** y ocultando la infraestructura real. El **IDS** detecta y alerta; el **IPS** detecta y además bloquea. Un **load balancer** reparte las peticiones entre varios servidores, saca de rotación los nodos que no responden y aporta **high availability** y escalado horizontal. Y los **sensors** son los puntos de recogida repartidos por las zonas —taps, colectores de flujos, agentes de log— que alimentan al SIEM: no protegen por sí mismos, pero sin ellos las otras decisiones se toman a ciegas.',
    },
    {
      t: 'table',
      headers: ['Appliance', 'Dónde se coloca', 'Qué hace', 'Atributo y nota de failure mode'],
      rows: [
        [
          '**Jump server**',
          'Zona de gestión, como única vía hacia los sistemas críticos',
          'Concentra el acceso administrativo con MFA y grabación de sesión',
          'Activo; si cae se pierde la administración, así que se despliega redundado, no se rodea con excepciones',
        ],
        [
          '**Forward proxy**',
          'Entre los usuarios internos e internet',
          'Filtra URL y contenido saliente, cachea y oculta las IP internas',
          'Inline y activo; fail-closed deja a la plantilla sin internet, fail-open deja salir tráfico sin filtrar',
        ],
        [
          '**Reverse proxy**',
          'En la DMZ, delante de los servidores publicados',
          'Recibe el tráfico entrante, termina TLS y lo reenvía al servidor real',
          'Inline y activo; punto único de publicación, se despliega en pareja para no ser un single point of failure',
        ],
        [
          '**IDS**',
          'Fuera de la ruta, en un tap o puerto espejo',
          'Detecta patrones sospechosos y alerta',
          'Passive; su fallo crea un punto ciego pero nunca corta producción',
        ],
        [
          '**IPS**',
          'Inline, en la ruta del tráfico que protege',
          'Detecta y además bloquea o descarta la sesión',
          'Active; obliga a decidir fail-open o fail-closed, y un falso positivo corta tráfico legítimo',
        ],
        [
          '**Load balancer**',
          'Delante de un grupo de servidores equivalentes',
          'Reparte peticiones, comprueba salud y saca de rotación los nodos caídos',
          'Inline y activo; si no se despliega en alta disponibilidad se convierte él mismo en el punto único de fallo',
        ],
        [
          '**Sensor**',
          'Repartido por zonas: taps, espejos de puerto, colectores de flujos y logs',
          'Recoge telemetría y la envía al SIEM',
          'Passive por definición; su fallo produce ceguera, no cortes',
        ],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'A new detection appliance is connected to a switch mirror port on the terminal network. During an incident the analyst asks why it did not stop the malicious session. What is the correct explanation?',
        choices: [
          'The appliance was deployed passively on a copy of the traffic, so it can only observe and alert',
          'The appliance was configured fail-closed and therefore dropped the alert',
          'Mirror ports only forward encrypted traffic, so the session was invisible',
          'The appliance needed a load balancer in front of it to act on the session',
        ],
        answer: 0,
        explain:
          'Traffic on a mirror port is a copy, so the real packets never pass through the appliance and there is nothing for it to drop; it can only detect and alert. Fail-closed is the tempting distractor, but a failure mode only matters for inline devices that are actually carrying production traffic.',
      },
    },
    {
      t: 'p',
      md: 'Con las zonas dibujadas, los dispositivos colocados y el modo de fallo decidido, queda elegir **qué tecnología** pones en cada frontera. La siguiente lección entra en los tipos de cortafuegos —**WAF**, **UTM**, **NGFW** y el filtrado de **layer 4 frente a layer 7**—, en la seguridad de puerto con **802.1X** y **EAP**, y en la comunicación segura: **VPN** de sitio a sitio y de acceso remoto, túnel completo o dividido, **TLS** frente a **IPSec**, **SD-WAN** y **SASE**.',
    },
  ],
  quiz: [
    {
      id: 'sp3m4q1',
      domain: 'Security Architecture',
      prompt:
        'What is the PRIMARY security purpose of deploying a jump server in an enterprise network?',
      choices: [
        'To distribute incoming client requests across several application servers',
        'To provide a single hardened and monitored entry point for administrative access to sensitive systems',
        'To cache frequently requested web pages and reduce internet bandwidth usage',
        'To terminate TLS connections for internet-facing web applications',
      ],
      answer: 1,
      explain:
        'A jump server funnels all administrative sessions through one hardened host where strong authentication, logging and session recording can be enforced, shrinking the number of paths into critical systems. Terminating TLS for public web applications is the tempting distractor, but that is the job of a reverse proxy sitting in the DMZ.',
    },
    {
      id: 'sp3m4q2',
      domain: 'Security Architecture',
      prompt:
        'A firewall inspects all traffic between the corporate network and a database holding regulated payment data. The security policy states that unfiltered access to that database must never be possible. How should the firewall behave if it fails?',
      choices: [
        'Fail-open, so business operations continue while the device is repaired',
        'Fail-open, but only during business hours',
        'It should be moved to a tap so that a failure cannot affect traffic',
        'Fail-closed, so that traffic stops rather than passing uninspected',
      ],
      answer: 3,
      explain:
        'When protecting regulated data the policy prioritises confidentiality over uptime, so a failed device must block traffic instead of letting it through unexamined. Fail-open is the tempting distractor because it preserves availability, but here uninspected access to payment data is precisely the outcome the policy forbids.',
    },
    {
      id: 'sp3m4q3',
      domain: 'Security Architecture',
      prompt:
        'Which two conditions must both be met for an intrusion prevention system to actually block an attack?',
      choices: [
        'It must be deployed inline and configured in active mode',
        'It must be deployed on a tap and configured in passive mode',
        'It must be placed in the DMZ and use signature-based detection only',
        'It must run on the same host as the protected server and be fail-open',
      ],
      answer: 0,
      explain:
        'Only traffic that physically traverses the device can be dropped, and only an appliance allowed to act on sessions will drop it, so inline plus active is the requirement. A tap in passive mode is the classic distractor: it sees a copy of the traffic and can alert, but the original packets have already reached their destination.',
    },
    {
      id: 'sp3m4q4',
      domain: 'Security Architecture',
      prompt:
        'The operations manager of a container terminal insists that any new monitoring must never add latency or risk interrupting production traffic. Which deployment satisfies that requirement?',
      choices: [
        'An inline next-generation firewall in blocking mode',
        'An inline IPS configured fail-closed',
        'A passive sensor fed by a network tap or switch mirror port',
        'A reverse proxy placed in front of the terminal operating system',
      ],
      answer: 2,
      explain:
        'A tap or mirror port gives the sensor a copy of the traffic, so the production path is untouched and a sensor failure cannot stop anything. An inline IPS configured fail-closed is the most tempting wrong answer because it sounds cautious, yet fail-closed guarantees exactly the interruption the manager wants to avoid.',
    },
    {
      id: 'sp3m4q5',
      domain: 'Security Architecture',
      prompt:
        'A port authority publishes a shipping manifest portal to the internet. It wants to terminate TLS, hide the internal address of the application server and inspect incoming requests before they reach it. Which appliance, placed where, meets these needs?',
      choices: [
        'A forward proxy on the internal user network',
        'A jump server in the management zone',
        'A reverse proxy in the DMZ',
        'A load balancer inside the OT segment',
      ],
      answer: 2,
      explain:
        'A reverse proxy sits in front of published servers in the DMZ, accepts inbound connections from untrusted clients, terminates TLS and forwards only sanctioned requests to the hidden backend. A forward proxy is the tempting distractor because both are proxies, but a forward proxy handles outbound traffic from internal users rather than inbound traffic from the internet.',
    },
    {
      id: 'sp3m4q6',
      domain: 'Security Architecture',
      prompt:
        'During a network redesign, the analyst finds that the public port website, the customs office workstations and the sluice PLCs all share one flat VLAN. Which principle does the redesign into separate zones MOST directly apply?',
      choices: [
        'Reduction of the attack surface, by limiting what each compromised system can reach',
        'Risk transference, because liability moves to the network vendor',
        'Fail-open configuration, because each zone can fail independently',
        'Ease of deployment, because zones are quicker to install',
      ],
      answer: 0,
      explain:
        'Security zones place a control point between groups of different trust levels so that compromising one system does not grant a path to the rest, which directly shrinks the reachable attack surface. Ease of deployment is the tempting distractor, but segmentation usually makes deployment harder, not easier, and that is not why it is done.',
    },
    {
      id: 'sp3m4q7',
      domain: 'Security Architecture',
      prompt:
        'Which appliance distributes incoming requests across a pool of equivalent servers and removes failing nodes from rotation?',
      choices: ['Intrusion detection system', 'Jump server', 'Forward proxy', 'Load balancer'],
      answer: 3,
      explain:
        'A load balancer spreads live traffic across active nodes and uses health checks to stop sending requests to a server that is not responding, supporting both scaling and high availability. A forward proxy is the tempting distractor because it also stands between clients and servers, but it controls outbound user access rather than distributing inbound load.',
    },
    {
      id: 'sp3m4q8',
      domain: 'Security Architecture',
      prompt:
        'How do the device attributes active and passive differ in SY0-701 terminology?',
      choices: [
        'Active devices are physical appliances and passive devices are virtual machines',
        'An active device can modify or block the traffic it examines, while a passive device only observes and alerts',
        'Active devices are always fail-closed and passive devices are always fail-open',
        'Active devices operate at layer 7 and passive devices operate at layer 3',
      ],
      answer: 1,
      explain:
        'The active and passive attributes describe whether the device is allowed to act on traffic, so an active device drops or rewrites sessions and a passive one only records and raises alerts. Linking the attributes to failure modes is the tempting distractor: failure mode is a separate configuration choice that only applies to devices carrying production traffic.',
    },
  ],
};

export const SP3_PART2: Module[] = [sp3m3, sp3m4];
