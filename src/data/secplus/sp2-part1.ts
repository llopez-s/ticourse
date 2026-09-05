import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// SP2M1 — Actores de amenaza y motivaciones (SY0-701, objetivo 2.1)
// ---------------------------------------------------------------------------
const sp2m1: Module = {
  id: 'sp2m1',
  sectionId: 'sp2',
  title: 'Actores de amenaza y motivaciones',
  minutes: 13,
  objectives: [
    'Describir los seis actores de amenaza del SY0-701: nation-state, unskilled attacker, hacktivist, insider threat, organized crime y shadow IT',
    'Comparar actores por sus atributos: internal/external, resources/funding y level of sophistication',
    'Asociar cada actor con sus motivaciones más habituales, desde financial gain hasta espionage o war',
    'Distinguir el insider intencional del no intencional y explicar por qué shadow IT cuenta como amenaza',
    'Identificar al actor más probable a partir de las pistas de un escenario de examen',
  ],
  blocks: [
    {
      t: 'p',
      md: 'Un **threat actor** es la persona o el grupo que está detrás de un ataque, y conocerlo cambia por completo la defensa: no se protege igual un puerto contra un adolescente que descarga un kit de internet que contra un servicio de inteligencia con años de paciencia. El objetivo 2.1 te pide dos cosas como analista: **reconocer al actor** por sus rasgos y **explicar qué lo mueve**. CompTIA lo organiza en seis tipos de actor, tres atributos para compararlos y una lista de motivaciones que el examen usa como pistas.',
    },
    { t: 'h', text: 'Los seis actores del SY0-701' },
    {
      t: 'table',
      headers: ['Actor', 'Motivación típica', 'Recursos', 'Sofisticación', 'Interno / externo'],
      rows: [
        [
          'Nation-state',
          'Espionage, war, service disruption, data exfiltration',
          'Muy altos: presupuesto estatal, equipos dedicados',
          'Máxima: **APT**, zero-days propios, campañas de años',
          'Externo',
        ],
        [
          'Organized crime',
          'Financial gain: ransomware, fraude, BEC, venta de datos',
          'Altos: estructura empresarial, afiliados, infraestructura propia',
          'Alta: herramientas maduras y servicios compartidos',
          'Externo',
        ],
        [
          'Hacktivist',
          'Philosophical / political beliefs; a veces revenge',
          'Bajos o medios, pero con muchos voluntarios',
          'Variable: DDoS, defacement, filtraciones',
          'Externo',
        ],
        [
          'Insider threat',
          'Revenge, financial gain, o ninguna (error humano)',
          'Los de la propia organización',
          'Variable; su ventaja es el **acceso autorizado**',
          'Interno',
        ],
        [
          'Unskilled attacker',
          'Disruption / chaos, notoriedad, curiosidad',
          'Mínimos',
          'Baja: usa herramientas de otros sin entenderlas',
          'Externo',
        ],
        [
          'Shadow IT',
          'Ninguna maliciosa: productividad, comodidad',
          'Los del departamento que lo compra',
          'No aplica; el riesgo es la falta de control',
          'Interno',
        ],
      ],
    },
    {
      t: 'p',
      md: 'Los dos actores con más recursos se distinguen por el **objetivo final**. El **nation-state** trabaja para un gobierno: quiere información (espionage), posicionarse en infraestructuras críticas para un posible conflicto (war) o desestabilizar a un rival (service disruption). Tiene financiación estable, personal a tiempo completo y puede permitirse **meses o años** dentro de una red sin monetizar nada; por eso se le asocia con el término **advanced persistent threat (APT)**. El **organized crime**, en cambio, es una empresa: cada intrusión tiene que producir dinero, ya sea cifrando sistemas con **ransomware**, desviando pagos mediante **business email compromise** o vendiendo credenciales. Está bien organizado y financiado, pero su horizonte es más corto y su selección de víctimas es oportunista: ataca a quien pueda pagar.',
    },
    {
      t: 'callout',
      kind: 'tip',
      title: 'Hacktivist vs. unskilled attacker: mira el mensaje, no la técnica',
      md: 'Ambos pueden usar las mismas herramientas públicas de **DDoS** o el mismo exploit descargado. La diferencia está en el **porqué**: el **hacktivist** actúa por una causa y quiere que se sepa (deja un mensaje político en la web desfigurada, publica documentos para avergonzar a la organización). El **unskilled attacker** —el clásico *script kiddie*— actúa por diversión, reto o notoriedad, no elige a la víctima por ideología y suele dejar rastros torpes porque no comprende lo que ejecuta.',
    },
    {
      t: 'check',
      q: {
        q: 'The public website of a port authority is defaced overnight. The replaced homepage shows a manifesto against a new dredging project and links to leaked internal emails. Which threat actor is MOST likely responsible?',
        choices: ['Nation-state', 'Organized crime', 'Hacktivist', 'Unskilled attacker'],
        answer: 2,
        explain:
          'A defacement carrying a political message and leaks intended to embarrass the target is the signature of a hacktivist, whose motivation is ideological. An unskilled attacker might also deface a site, but would not build the attack around a cause or publish documents to support it.',
      },
    },
    { t: 'h', text: 'Insider threat y shadow IT: la amenaza que ya tiene acceso' },
    {
      t: 'p',
      md: 'El **insider threat** es cualquier persona con **acceso legítimo** —empleada, contratista, proveedor con cuenta— que lo usa contra la organización. El examen distingue dos variantes. El insider **intencional** actúa a propósito: la administradora despedida que borra backups por venganza, el comercial que copia la lista de clientes antes de irse a la competencia, quien vende su acceso a un grupo criminal. El insider **no intencional** causa el daño por error o negligencia: reenvía un fichero confidencial a la dirección equivocada, cae en un phishing, conecta un USB encontrado en el aparcamiento. En ambos casos el rasgo definitorio es el mismo: **los controles perimetrales no lo detienen**, porque ya está dentro y sus acciones parecen legítimas. **Shadow IT** es un caso especial: sistemas, aplicaciones o servicios cloud que un departamento **adquiere y usa sin aprobación ni conocimiento de TI**. Nadie lo hace con mala intención —se busca rapidez o una función que la herramienta corporativa no tiene—, pero el resultado es que existen datos de la organización en lugares que **nadie parchea, monitoriza ni incluye en los backups**. El SY0-701 lo lista como actor porque **amplía la attack surface** desde dentro: una cuenta de almacenamiento personal con documentos del puerto es un vector que el SOC ni siquiera sabe que debe vigilar.',
    },
    {
      t: 'check',
      q: {
        q: 'A systems administrator learns that her contract will not be renewed. Two days before her last day, she creates a hidden account with domain admin rights and schedules a script to delete the backup catalog a month later. Which threat actor does this describe?',
        choices: ['Unintentional insider', 'Intentional insider', 'Organized crime', 'Shadow IT'],
        answer: 1,
        explain:
          'She has authorized access and deliberately uses it to harm the organization out of revenge, which is the intentional insider. An unintentional insider causes damage by mistake or negligence, and here every step is planned.',
      },
    },
    {
      t: 'check',
      q: {
        q: 'The logistics department of the Halden Port Authority signs up for a consumer file-sharing service with a company credit card so that truck operators can download manifests from their phones. IT is never informed. What does this situation represent?',
        choices: ['Shadow IT', 'Unskilled attacker', 'Hacktivist', 'Nation-state'],
        answer: 0,
        explain:
          'An unsanctioned service purchased and run by a business unit outside IT control is shadow IT; the intent is productivity, but corporate data now lives where it is not monitored or protected. It is not an external attacker at all, which rules out the other three options.',
      },
    },
    { t: 'h', text: 'Atributos y motivaciones: el lenguaje de las pistas' },
    {
      t: 'p',
      md: 'Para comparar actores el examen usa tres **atributos**. **Internal/external**: si el actor ya tiene acceso autorizado (insider, shadow IT) o tiene que conseguirlo desde fuera. **Resources/funding**: cuánto dinero, infraestructura y personal puede dedicar; separa al estado y al crimen organizado del resto. **Level of sophistication/capability**: si desarrolla sus propias herramientas y exploits (nation-state) o depende de las de otros (unskilled attacker). Las **motivaciones** son la otra mitad del vocabulario, y cada una apunta a uno o dos actores concretos.',
    },
    {
      t: 'list',
      items: [
        '**Data exfiltration** — robar información valiosa: propiedad intelectual, datos personales, planos. Nation-state, organized crime, insider.',
        '**Espionage** — obtener secretos de otro gobierno o empresa de forma sostenida. Casi siempre nation-state.',
        '**Service disruption** — dejar fuera de servicio un sistema o infraestructura. Nation-state, hacktivist.',
        '**Blackmail** — amenazar con publicar datos o mantener el cifrado hasta que se pague. Organized crime (ransomware con doble extorsión).',
        '**Financial gain** — dinero directo: fraude, ransomware, BEC, venta de accesos. Organized crime, insider.',
        '**Philosophical/political beliefs** — atacar en nombre de una causa. Hacktivist.',
        '**Ethical** — encontrar fallos para reportarlos, normalmente bajo un **bug bounty** o contrato; el *white hat* es un actor con autorización.',
        '**Revenge** — devolver un agravio percibido. Insider (despidos, sanciones) y, a veces, hacktivist.',
        '**Disruption/chaos** — causar daño sin objetivo claro, por diversión o notoriedad. Unskilled attacker.',
        '**War** — apoyar un conflicto armado atacando infraestructuras críticas del adversario. Nation-state.',
      ],
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen: identifica al actor por la pista',
      md: 'El SY0-701 nunca te dice «es un nation-state»; te da un rasgo y espera que lo deduzcas. Memoriza estas correspondencias: **mensaje ideológico o protesta** → hacktivist; **exploit a medida, zero-day y años de persistencia** → nation-state; **exige un rescate o desvía pagos** → organized crime; **empleada que copia datos antes de marcharse** → insider intencional; **clic en un enlace o USB conectado por error** → insider no intencional; **herramienta descargada, sin objetivo claro, rastro torpe** → unskilled attacker; **SaaS o dispositivo contratado por un departamento sin aprobación** → shadow IT. Si dos opciones encajan, elige la que explique la **motivación** del escenario.',
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'En la Autoridad Portuaria de Halden',
      md: 'El SOC del puerto recibe tres alertas la misma semana. Un servidor de control de grúas lleva **catorce meses** comunicándose con un dominio que no aparece en ninguna lista pública, con un implante que nadie había visto antes: eso huele a **nation-state** interesado en la infraestructura. El departamento de aduanas recibe un correo del «director financiero» pidiendo cambiar la cuenta bancaria de un proveedor: patrón de **organized crime** por **financial gain**. Y un escaneo de puertos ruidoso desde una IP residencial, usando una herramienta con la firma por defecto: **unskilled attacker**. Mismo puerto, tres respuestas defensivas distintas.',
    },
    {
      t: 'p',
      md: 'Ya sabes quién ataca y por qué. La siguiente lección responde a la pregunta natural: **por dónde entra**. Verás los **threat vectors** técnicos del objetivo 2.2 —mensajes, ficheros, dispositivos extraíbles, software sin soporte, redes inseguras, puertos abiertos, credenciales por defecto y la **supply chain**— y cómo cada uno amplía la **attack surface** que como analista tienes que reducir.',
    },
  ],
  quiz: [
    {
      id: 'sp2m1q1',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'Forensic analysis of a compromised terminal operating system at a port reveals custom malware that exploited a previously unknown vulnerability and had been beaconing to its command server for almost two years without stealing money or disrupting operations. Which threat actor is MOST likely behind the intrusion?',
      choices: ['Organized crime', 'Unskilled attacker', 'Nation-state', 'Hacktivist'],
      answer: 2,
      explain:
        'A custom zero-day exploit combined with years of silent persistence and no monetization points to a well-funded, highly sophisticated nation-state pursuing espionage. Organized crime is the tempting distractor, but a criminal group would have monetized the access long before two years passed.',
    },
    {
      id: 'sp2m1q2',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'Which attribute BEST distinguishes an insider threat from every other threat actor category?',
      choices: [
        'The insider already has authorized access to systems or facilities',
        'The insider is always motivated by financial gain',
        'The insider uses more sophisticated tools than external attackers',
        'The insider is always acting on purpose',
      ],
      answer: 0,
      explain:
        'What defines an insider is legitimate, authorized access that perimeter controls cannot stop. Insiders can be intentional or unintentional and their motivations vary, so the options about always acting on purpose or always seeking money describe only some cases.',
    },
    {
      id: 'sp2m1q3',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'A group takes down a shipping company\'s booking portal with a distributed denial-of-service attack and posts a statement condemning the company\'s environmental record. Which motivation BEST explains the attack?',
      choices: ['Financial gain', 'Espionage', 'Ethical', 'Philosophical or political beliefs'],
      answer: 3,
      explain:
        'The attackers publicly justify the disruption with a cause, which is the philosophical or political motivation associated with hacktivists. Ethical is a tempting distractor because the statement invokes the environment, but the ethical motivation in SY0-701 refers to authorized testing such as bug bounties, not unauthorized attacks in the name of a cause.',
    },
    {
      id: 'sp2m1q4',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'A teenager downloads a freely available exploitation toolkit, runs it against random internet-facing servers without understanding how it works, and brags about the results on a forum. Which threat actor does this describe?',
      choices: ['Insider threat', 'Unskilled attacker', 'Organized crime', 'Nation-state'],
      answer: 1,
      explain:
        'Using tools built by others, choosing targets at random, and seeking notoriety are the hallmarks of an unskilled attacker with low sophistication and minimal resources. Organized crime is wrong because there is no financial structure or goal behind the activity.',
    },
    {
      id: 'sp2m1q5',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'A harbor pilot receives an email that appears to come from the port operations manager, opens the attached "updated schedule" and unknowingly installs malware that later spreads across the network. How should the pilot be classified?',
      choices: [
        'Shadow IT',
        'Intentional insider threat',
        'Unintentional insider threat',
        'Unskilled attacker',
      ],
      answer: 2,
      explain:
        'The pilot has legitimate access and caused harm through a mistake rather than malice, which is the unintentional insider. Intentional insider is the tempting distractor, but nothing in the scenario shows a deliberate decision to damage the organization.',
    },
    {
      id: 'sp2m1q6',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'Which of the following threat actors is BEST characterized by high funding, a business-like structure, and attacks that must produce a financial return?',
      choices: ['Organized crime', 'Hacktivist', 'Shadow IT', 'Unskilled attacker'],
      answer: 0,
      explain:
        'Organized crime groups operate like companies, with affiliates, infrastructure, and a focus on profit through ransomware, fraud, and data sales. Hacktivists may be numerous but are driven by ideology rather than financial return, and the other two options lack both funding and structure.',
    },
    {
      id: 'sp2m1q7',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'During an audit, the security team discovers that the engineering group has been storing crane maintenance drawings in a personal cloud account that IT never approved or configured. Why does SY0-701 treat this situation as a threat?',
      choices: [
        'Because the engineers are deliberately exfiltrating data to a competitor',
        'Because unmanaged systems expand the attack surface outside the security controls',
        'Because personal cloud accounts are always operated by nation-state actors',
        'Because the engineers lack the technical skill to use the corporate tools',
      ],
      answer: 1,
      explain:
        'Shadow IT is a threat because data ends up on systems that are not patched, monitored, backed up, or covered by policy, enlarging the attack surface without the security team knowing. The first option is the tempting distractor, but shadow IT is defined by lack of authorization and oversight, not by malicious intent.',
    },
  ],
};

// ---------------------------------------------------------------------------
// SP2M2 — Vectores de amenaza y superficie de ataque (SY0-701, objetivo 2.2)
// ---------------------------------------------------------------------------
const sp2m2: Module = {
  id: 'sp2m2',
  sectionId: 'sp2',
  title: 'Vectores de amenaza y superficie de ataque',
  minutes: 13,
  objectives: [
    'Definir threat vector y attack surface y explicar por qué reducir la superficie es la estrategia de fondo',
    'Reconocer los vectores basados en mensajes, imágenes, ficheros, voz y dispositivos extraíbles',
    'Diferenciar software client-based de agentless y explicar el riesgo de los sistemas sin soporte',
    'Identificar los vectores de red: wireless, wired, Bluetooth, puertos abiertos y credenciales por defecto',
    'Describir los vectores de supply chain: managed service providers, vendors y suppliers',
  ],
  blocks: [
    {
      t: 'p',
      md: 'Si la lección anterior explicaba **quién** ataca, esta explica **por dónde**. Un **threat vector** es el camino que usa el atacante para llegar hasta el objetivo: un correo, un USB, un puerto abierto, un proveedor. La **attack surface** es la suma de todos esos caminos posibles, es decir, cada punto por el que alguien podría entrar o interactuar con tus sistemas. La regla de fondo del objetivo 2.2 es sencilla de enunciar y difícil de cumplir: **cada vector que eliminas reduce la superficie**, y cada servicio, cuenta o dispositivo que añades sin control la amplía. Como analista, tu trabajo es conocer el catálogo de vectores lo bastante bien como para nombrar el primero que cerrarías en cada escenario.',
    },
    { t: 'h', text: 'Mensajes, imágenes, ficheros, voz y dispositivos extraíbles' },
    {
      t: 'list',
      items: [
        '**Message-based** — correo electrónico, **SMS** e **instant messaging**. Es el vector más usado porque llega directamente a la persona: enlaces a páginas falsas, adjuntos maliciosos, peticiones urgentes. El detalle de la ingeniería social lo verás en la siguiente lección.',
        '**Image-based** — una imagen aparentemente inocente que esconde código: ficheros **SVG** con scripts embebidos, o **steganography** para ocultar datos o instrucciones dentro de los píxeles. Los filtros de correo suelen dejar pasar imágenes sin inspeccionarlas.',
        '**File-based** — documentos con **macros**, PDFs con JavaScript, ejecutables renombrados. El fichero es el envoltorio; la carga se activa cuando la persona lo abre y habilita el contenido.',
        '**Voice call** — una llamada telefónica en la que el atacante se hace pasar por soporte, por un banco o por dirección. El canal es la voz, y el objetivo suele ser conseguir credenciales o una acción (**vishing**).',
        '**Removable device** — un USB, tarjeta SD o disco externo que llega a un equipo corporativo. El clásico **USB drop**: dejar unidades «perdidas» en el aparcamiento con la esperanza de que alguien las conecte. Un dispositivo puede además presentarse como teclado y escribir comandos sin que haya ningún fichero que abrir.',
      ],
    },
    {
      t: 'check',
      q: {
        q: 'Several unlabeled USB drives are found scattered in the visitor parking lot of the Halden Port Authority. One employee plugs a drive into a workstation to identify its owner and malware executes. Which threat vector was used?',
        choices: ['Message-based', 'Removable device', 'Image-based', 'Unsupported system'],
        answer: 1,
        explain:
          'The malicious payload arrived on physical media connected to the workstation, which is the removable device vector. No email or message was involved, so message-based does not apply even though curiosity was exploited.',
      },
    },
    { t: 'h', text: 'Software vulnerable: client-based, agentless y sistemas sin soporte' },
    {
      t: 'p',
      md: 'Todo software instalado es superficie de ataque, pero CompTIA quiere que distingas **cómo se gestiona** ese software, porque cambia la exposición. El software **client-based** requiere un **agente instalado** en cada equipo (un cliente VPN, un antivirus, un agente de backup): funciona aunque el equipo esté fuera de la red, pero **cada instancia es una pieza que hay que parchear**, y un agente vulnerable en mil portátiles son mil puertas. El software **agentless** no instala nada en el endpoint: se gestiona o escanea de forma remota mediante credenciales, APIs o protocolos de red. Reduce lo que hay que mantener en cada máquina, pero depende de que las credenciales y los servicios remotos que usa estén bien protegidos, y no llega a equipos apagados o desconectados. La pista de examen es el verbo: «se instala en cada equipo» → client-based, el riesgo es mantener cada instancia; «se escanea de forma remota con credenciales» → agentless, el riesgo se desplaza a esas credenciales. El caso extremo son los **unsupported systems and applications**: sistemas operativos o aplicaciones que han llegado a su **end-of-life (EOL)** y para los que el fabricante **ya no publica parches**. Cada vulnerabilidad que se descubra a partir de ese momento queda abierta para siempre. En un puerto es habitual encontrar controladores de grúas, básculas o sistemas de aduanas que llevan una década con el mismo sistema operativo porque el proveedor industrial nunca certificó una versión nueva. La respuesta ideal es reemplazar; cuando no es posible, entra en juego el **compensating control** del Dominio 1: aislar, segmentar y vigilar.',
    },
    {
      t: 'check',
      q: {
        q: 'A weighbridge control station still runs an operating system whose vendor ended all support four years ago. The station cannot be upgraded because the industrial software is not certified for newer versions. Which threat vector does this BEST represent?',
        choices: ['Agentless software', 'Open service port', 'Unsupported system', 'Default credentials'],
        answer: 2,
        explain:
          'An end-of-life operating system that no longer receives patches is the unsupported system vector; every new vulnerability stays exploitable indefinitely. Open ports or default credentials might also exist on the station, but the scenario describes only the lack of vendor support.',
      },
    },
    { t: 'h', text: 'Redes inseguras, puertos abiertos y credenciales por defecto' },
    {
      t: 'p',
      md: 'Las **unsecure networks** aparecen en tres sabores. En **wireless**, una red abierta o cifrada con **WEP** deja el tráfico a la vista, y un **evil twin** —un punto de acceso falso con el mismo nombre que el legítimo— captura credenciales de quien se conecta por error. En **wired**, un puerto de red activo en una sala de reuniones sin **802.1X** permite que cualquier visitante enchufe un portátil y aparezca dentro de la LAN. En **Bluetooth**, el **bluejacking** envía mensajes no solicitados a dispositivos cercanos y el **bluesnarfing** roba datos de ellos aprovechando emparejamientos débiles o visibilidad permanente. A esto se suman dos vectores que el examen adora porque la mitigación es trivial y aun así se descuida: los **open service ports** (servicios escuchando que nadie usa, como Telnet o un panel de administración expuesto a internet) y las **default credentials** (usuario y contraseña de fábrica en routers, cámaras, impresoras y aplicaciones).',
    },
    {
      t: 'table',
      headers: ['Vector', 'Ejemplo', 'Primera mitigación'],
      rows: [
        ['Message-based', 'Correo con enlace a un portal de login falso', 'Filtrado de correo, formación, MFA'],
        ['Image-based', 'SVG con script embebido en un adjunto', 'Bloquear o sanear formatos activos en el gateway'],
        ['File-based', 'Documento con macro que descarga un troyano', 'Deshabilitar macros por defecto, sandboxing'],
        ['Voice call', 'Llamada de «soporte» pidiendo la contraseña', 'Procedimiento de verificación por otro canal'],
        ['Removable device', 'USB abandonado en el aparcamiento', 'Bloquear puertos USB por política, formación'],
        ['Client-based software', 'Agente VPN vulnerable en todos los portátiles', 'Inventario y parcheo centralizado'],
        ['Unsupported system', 'Sistema operativo EOL en un controlador industrial', 'Reemplazar; si no, aislar y monitorizar'],
        ['Wireless', 'Evil twin en la terminal de pasajeros', 'WPA3/WPA2-Enterprise, formación'],
        ['Wired', 'Puerto de red activo en la sala de visitas', '802.1X, desactivar puertos sin uso'],
        ['Bluetooth', 'Bluesnarfing sobre un móvil visible', 'Modo no visible, desactivar cuando no se usa'],
        ['Open service port', 'Telnet y panel de administración expuestos', 'Deshabilitar servicios innecesarios, firewall'],
        ['Default credentials', 'Cámara IP con admin/admin', 'Cambiar credenciales antes de conectar'],
        ['Supply chain', 'Herramienta de un MSP comprometida', 'Due diligence, mínimo privilegio para terceros'],
      ],
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen: las respuestas «obvias» del 2.2',
      md: 'Cuando la pregunta menciona un dispositivo recién instalado que fue comprometido «con las credenciales de fábrica», la respuesta es **change default credentials** antes de conectarlo; no busques nada más sofisticado. Cuando describe un escaneo que encontró servicios que nadie utiliza, la respuesta es **disable unused services / close unnecessary ports**, y la lección subyacente es **reducir la attack surface**. Y cuando el atacante entra a través de la herramienta de gestión remota de un proveedor externo, el vector es **supply chain**, no «phishing» ni «insider»: el proveedor tenía acceso legítimo y fue el proveedor quien resultó comprometido.',
    },
    {
      t: 'check',
      q: {
        q: 'A vulnerability scan of the port network reports that a new network video recorder responds on Telnet and an HTTP administration page, both reachable from the office VLAN and still protected by the factory username and password. What should the analyst do FIRST to reduce the attack surface?',
        choices: [
          'Change the default credentials and disable the unused services',
          'Move the recorder to a cloud-hosted platform',
          'Install an endpoint agent on the recorder',
          'Replace the recorder with a newer model from the same vendor',
        ],
        answer: 0,
        explain:
          'Default credentials and open, unnecessary services are two textbook vectors whose first mitigation is to change the credentials and turn off what is not needed. Replacing or relocating the device is costly and does not address the immediate exposure, and most appliances cannot host an endpoint agent.',
      },
    },
    { t: 'h', text: 'Supply chain: cuando el vector es alguien de confianza' },
    {
      t: 'p',
      md: 'La **supply chain** es el conjunto de terceros de los que dependes para operar, y cada uno de ellos es un vector porque **ya tiene acceso o influencia** sobre tus sistemas. CompTIA distingue tres: los **managed service providers (MSPs)**, que administran tu red, tus backups o tu seguridad de forma remota y por tanto poseen credenciales privilegiadas sobre muchos clientes a la vez; los **vendors**, que te suministran software o hardware y cuyos mecanismos de actualización llegan directamente a tus servidores; y los **suppliers**, los proveedores de componentes y servicios más lejanos en la cadena, cuyos fallos heredas sin haberlos elegido. El patrón de ataque es siempre el mismo: en lugar de atacar a cien objetivos bien defendidos, el atacante compromete al **único proveedor** que los sirve a todos y aprovecha la confianza ya establecida. Un caso ilustrativo: un fabricante de software de monitorización de red sufre una intrusión, el atacante inserta código malicioso en una actualización legítima firmada por el fabricante, y miles de clientes lo instalan voluntariamente porque confían en el canal de actualización. En la Autoridad Portuaria de Halden el equivalente sería el MSP que administra los servidores del puerto con una consola de acceso remoto: si roban las credenciales de uno de sus técnicos, el atacante despliega ransomware en el puerto y en otras veinte organizaciones sin que nadie haga clic en nada. La mitigación no es formar más a las empleadas, sino exigir al MSP **MFA** en su consola, limitar sus privilegios al mínimo necesario y monitorizar sus sesiones como si fueran las de cualquier administrador.',
    },
    {
      t: 'check',
      q: {
        q: 'Ransomware appears simultaneously in dozens of unrelated companies. Investigation shows that every victim used the same outsourced IT provider and that the malware was pushed through the remote management console of that provider after its technician\'s account was compromised. Which threat vector does this describe?',
        choices: ['Insider threat', 'Message-based', 'Removable device', 'Supply chain (managed service provider)'],
        answer: 3,
        explain:
          'The attacker reached the victims through a trusted third party that legitimately manages their systems, which is the managed service provider form of the supply chain vector. Insider threat is the tempting distractor because the technician had access, but the technician belongs to an external provider and was compromised, not acting maliciously.',
      },
    },
    {
      t: 'p',
      md: 'Con el catálogo de vectores técnicos en la cabeza ya puedes mirar cualquier sistema del puerto y enumerar sus puntos de entrada. Falta el vector que ningún parche cierra: la **persona**. La siguiente lección cubre la segunda mitad del objetivo 2.2, la **ingeniería social** —phishing, vishing, smishing, business email compromise, pretexting, watering hole y typosquatting— y los principios psicológicos que hacen que funcione.',
    },
  ],
  quiz: [
    {
      id: 'sp2m2q1',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'Which of the following BEST describes an organization\'s attack surface?',
      choices: [
        'The list of threat actors most likely to target the organization',
        'The sum of all points through which an attacker could enter or interact with its systems',
        'The set of vulnerabilities discovered by the most recent scan',
        'The number of security controls deployed on the perimeter',
      ],
      answer: 1,
      explain:
        'The attack surface is the total of all possible entry points, whether or not a vulnerability is currently known for each one. The scan results are a tempting distractor, but they capture only the flaws found at one moment, not every path an attacker could use.',
    },
    {
      id: 'sp2m2q2',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'A customs officer receives a text message claiming a container release fee is overdue and containing a link to a payment page that harvests her credentials. Which threat vector was used?',
      choices: ['File-based', 'Voice call', 'Message-based', 'Image-based'],
      answer: 2,
      explain:
        'SMS is one of the channels in the message-based vector, alongside email and instant messaging. File-based would require an attachment to be opened, and here the attack relies on a link delivered in a message.',
    },
    {
      id: 'sp2m2q3',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'A security team compares two vulnerability management products. Product A installs a small service on every workstation, while Product B scans hosts remotely using administrative credentials. Which statement about the two approaches is CORRECT?',
      choices: [
        'Product A is agentless and requires no maintenance on the endpoints',
        'Product B is client-based because it uses credentials',
        'Product A is client-based, so each installed agent must itself be kept patched',
        'Product B can scan laptops that are powered off or disconnected',
      ],
      answer: 2,
      explain:
        'Software that installs a component on each host is client-based, and every one of those agents becomes something that must be updated and could be exploited. Product B is agentless, and an agentless scanner cannot reach a device that is switched off or away from the network, so the last option is wrong.',
    },
    {
      id: 'sp2m2q4',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'Passengers at a ferry terminal connect to a wireless network named exactly like the official terminal Wi-Fi, but it is operated from a laptop in a parked car and captures every login they type. Which threat vector does this describe?',
      choices: ['Wired network without port security', 'Evil twin on an unsecure wireless network', 'Bluesnarfing', 'Open service port'],
      answer: 1,
      explain:
        'A rogue access point that imitates the legitimate network name to intercept traffic is an evil twin, part of the unsecure wireless vector. Bluesnarfing is the tempting distractor because it also targets nearby devices, but it operates over Bluetooth pairing, not Wi-Fi.',
    },
    {
      id: 'sp2m2q5',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'An attacker walks into a conference room during a public tender event, plugs a laptop into an active wall jack and immediately obtains an internal IP address with access to the port authority file servers. Which control would have BEST prevented this?',
      choices: [
        'Disabling macros in office documents',
        'Changing default credentials on the file servers',
        'Blocking USB storage devices by policy',
        'Requiring 802.1X authentication on switch ports',
      ],
      answer: 3,
      explain:
        'The vector is an unsecured wired network, and 802.1X forces a device to authenticate before the switch port grants access. Changing default credentials on the servers is a good practice but would not stop the attacker from joining the network in the first place.',
    },
    {
      id: 'sp2m2q6',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'A monitoring software vendor is breached and the attacker inserts malicious code into a signed product update that thousands of customers install automatically. From the perspective of those customers, which threat vector was exploited?',
      choices: ['Supply chain', 'Removable device', 'Unsupported application', 'Default credentials'],
      answer: 0,
      explain:
        'The customers were compromised through a trusted vendor and its legitimate update channel, which is the software supply chain vector. Unsupported application is the tempting distractor, but the product was fully supported and up to date; the trust in the vendor was what the attacker abused.',
    },
    {
      id: 'sp2m2q7',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'A penetration tester reports that a newly deployed building access controller can be logged into with the manufacturer\'s published username and password, and that it exposes an FTP service nobody uses. Which pair of actions MOST directly reduces the attack surface of the device?',
      choices: [
        'Enable full-disk encryption and install antivirus on the controller',
        'Change the default credentials and disable the FTP service',
        'Move the controller to a public cloud and enable logging',
        'Purchase a support contract and schedule quarterly penetration tests',
      ],
      answer: 1,
      explain:
        'Default credentials and unnecessary open services are two distinct vectors, and their first mitigations are to change the credentials and turn the service off, both of which remove entry points. Encryption and antivirus protect data and detect malware but do not close either door, and a support contract changes nothing about the current exposure.',
    },
  ],
};

export const SP2_PART1: Module[] = [sp2m1, sp2m2];
