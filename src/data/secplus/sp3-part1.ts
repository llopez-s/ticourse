import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// SP3M1 — Modelos de arquitectura: cloud, IaC, serverless y microservicios
// (SY0-701, objetivo 3.1)
// ---------------------------------------------------------------------------
const sp3m1: Module = {
  id: 'sp3m1',
  sectionId: 'sp3',
  title: 'Modelos de arquitectura: cloud, IaC, serverless y microservicios',
  minutes: 13,
  objectives: [
    'Aplicar el modelo de **shared responsibility** para decidir quién protege qué en IaaS, PaaS, SaaS y serverless',
    'Explicar las hybrid considerations de un despliegue mixto: dos planos de control, política consistente y enlaces entre entornos',
    'Valorar el riesgo que introducen los third-party vendors en la cadena de suministro cloud',
    'Describir qué gana y qué arriesga una organización al definir su infraestructura como código (IaC)',
    'Comparar serverless y microservices frente al monolito en términos de superficie de ataque y blast radius',
  ],
  blocks: [
    {
      t: 'p',
      md: 'El dominio 3 empieza por lo más abstracto y lo más caro de corregir: **dónde vive la infraestructura y cómo está construida**. Una decisión de arquitectura no se revierte con un parche el martes siguiente; condiciona durante años qué controles puedes aplicar, qué visibilidad tienes y quién responde cuando algo falla. El objetivo 3.1 te pide, como analista, comparar modelos —cloud, on-premises, virtualización, contenedores, sistemas embebidos— y saber justificar sus **implicaciones de seguridad**. Esta lección cubre la mitad cloud y moderna: **shared responsibility**, **infrastructure as code**, **serverless** y **microservices**.',
    },
    { t: 'h', text: 'Responsabilidad compartida: lo *de* la nube y lo *en* la nube' },
    {
      t: 'p',
      md: 'La **responsibility matrix** (o **shared responsibility model**) es el contrato implícito de cualquier despliegue cloud, y el examen lo resume con una frase: el proveedor asegura **la** nube y tú aseguras lo que pones **en** la nube. El proveedor responde de las instalaciones físicas, la red troncal, el hardware y el software de virtualización que sostiene el servicio. La clienta responde siempre de tres cosas, y esto no cambia con el modelo: **sus datos**, **sus identidades y permisos** (usuarios, roles, claves) y **su configuración** (grupos de seguridad, políticas de acceso, cifrado activado o no). Lo que sí se desplaza según el modelo es la capa intermedia: sistema operativo, runtime y aplicación. En **IaaS** alquilas la máquina virtual, así que el **guest OS lo parcheas tú**; en **PaaS** el proveedor mantiene el sistema operativo y el runtime y tú solo subes código; en **SaaS** el proveedor lo mantiene prácticamente todo y a ti te queda quién entra, qué permisos tiene y qué datos suben. Casi todas las brechas de cloud que llegan a la prensa no son fallos del proveedor: son **misconfigurations** del cliente.',
    },
    {
      t: 'table',
      headers: ['Modelo', 'Quién parchea qué', 'Principal ventaja de seguridad', 'Principal riesgo nuevo'],
      rows: [
        [
          'On-premises',
          'Todo lo parcheas tú: hardware, hipervisor, OS, runtime, app',
          'Control total y visibilidad completa del entorno',
          'Todo el peso operativo recae en un equipo con recursos limitados',
        ],
        [
          '**IaaS**',
          'Proveedor: hardware e hipervisor · Cliente: **guest OS**, runtime y aplicación',
          'Elasticidad y recuperación rápida sin comprar hardware',
          'Máquinas sin parchear y grupos de seguridad abiertos por error',
        ],
        [
          '**PaaS**',
          'Proveedor: hardware, OS y runtime · Cliente: código y configuración',
          'Desaparece la carga de parcheo del sistema operativo',
          'Menos visibilidad; dependes del calendario del proveedor',
        ],
        [
          '**SaaS**',
          'Proveedor: toda la pila · Cliente: identidades, permisos y datos',
          'Superficie técnica mínima que administrar',
          'Sobrecompartición de datos, cuentas huérfanas, **shadow IT**',
        ],
        [
          '**Serverless (FaaS)**',
          'Proveedor: OS, runtime y escalado · Cliente: código, rol IAM y datos',
          'No hay servidores que parchear ni endurecer',
          '**Vendor lock-in**, visibilidad limitada, roles IAM demasiado permisivos',
        ],
      ],
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen: «¿de quién es la responsabilidad?»',
      md: 'El SY0-701 pregunta esto una y otra vez, y la regla es mecánica. **Datos, identidades y configuración son SIEMPRE de la clienta**, en todos los modelos: si el enunciado habla de un bucket público, de una clave filtrada o de un permiso excesivo, la respuesta correcta nunca es «el proveedor». El **guest OS** se parchea en **IaaS** (y solo ahí); en **PaaS**, **SaaS** y **serverless** lo parchea el proveedor. Cuidado con la trampa habitual: que el proveedor **ofrezca** cifrado, MFA o registro no significa que sea responsable de que estén **activados** — activarlos es configuración, y la configuración es tuya.',
    },
    {
      t: 'check',
      q: {
        q: 'The Halden Port Authority stores scanned shipping manifests in a cloud object storage bucket. An administrator sets the bucket to allow public read access, and a search engine indexes the files. Under the shared responsibility model, who is accountable for this exposure?',
        choices: [
          'The cloud provider, because it operates the storage service',
          'The customer, because access configuration of its own data is always the customer responsibility',
          'Neither party, because public access is a documented feature of the service',
          'The cloud provider, because it did not warn the customer about the setting',
        ],
        answer: 1,
        explain:
          'Configuration of access to customer data stays with the customer in every service model, so making the bucket public is the customer failure. Blaming the provider is tempting because the provider runs the storage platform, but its duty ends at keeping that platform secure and available, not at choosing who may read your files.',
      },
    },
    { t: 'h', text: 'Híbrido, terceros e infraestructura como código' },
    {
      t: 'p',
      md: 'Casi ninguna organización es puramente cloud o puramente local, y el examen llama **hybrid considerations** a los problemas propios de esa mezcla. El primero es que acabas con **dos planos de control**: una consola en el centro de datos y otra en el proveedor, cada una con su propio modelo de identidades, sus grupos y su registro. Si la política no se aplica igual en ambos lados, aparecen **huecos de política** —una regla de contraseñas estricta en el dominio interno y cuentas cloud sin MFA— y la monitorización se parte en dos silos que nadie correlaciona. El segundo problema es el **enlace** entre entornos: la VPN site-to-site o el circuito dedicado que une la red local con la nube es a la vez una dependencia de disponibilidad y un camino privilegiado que un atacante puede recorrer en ambos sentidos. A esto se suman los **third-party vendors**: el proveedor cloud, el integrador que despliega, el SaaS de facturación y el servicio de monitorización tienen cuentas, agentes o tokens dentro de tu entorno. Su seguridad se convierte en la tuya, así que forman parte de la **supply chain** que hay que evaluar antes de firmar y revisar después.',
    },
    {
      t: 'p',
      md: '**Infrastructure as code (IaC)** es definir redes, servidores, reglas de firewall y permisos en **ficheros de texto versionados** en lugar de crearlos a mano en una consola. La ventaja de seguridad es triple: los despliegues son **repetibles** (el entorno de pruebas y el de producción salen de la misma plantilla), son **revisables** (un cambio pasa por control de versiones y revisión de código igual que cualquier software) y eliminan el **configuration drift**, esa deriva silenciosa en la que un servidor lleva tres años con una regla temporal que nadie recuerda. Pero el mismo mecanismo amplifica los errores: una plantilla mal escrita **despliega el mismo fallo en cien sitios a la vez** y con una sola orden. El otro riesgo clásico es el de los **secrets in the repo** —contraseñas, claves de API o tokens escritos dentro de la plantilla y subidos al repositorio—, porque cualquiera con acceso al código, o al historial, se lleva las credenciales de producción. Las plantillas se tratan como código sensible: revisión obligatoria, análisis automático de configuración y secretos en un gestor externo referenciados por nombre, nunca en claro.',
    },
    {
      t: 'check',
      q: {
        q: 'A junior engineer commits an infrastructure-as-code template that provisions the port database. The template contains the production database password in plain text so the deployment works on the first try. Which risk does this introduce?',
        choices: [
          'Configuration drift, because the password will differ between environments',
          'Vendor lock-in, because the template only works with one provider',
          'Secret exposure, because anyone with read access to the repository or its history obtains production credentials',
          'Reduced availability, because plain-text values slow the deployment down',
        ],
        answer: 2,
        explain:
          'Hardcoding a credential in a versioned template hands production access to every reader of the repository, and it stays in the commit history even after someone deletes the line. Configuration drift is the tempting distractor because it is the other classic IaC term, but drift is what IaC prevents; here the problem is a secret stored where it does not belong.',
      },
    },
    { t: 'h', text: 'Serverless y microservicios' },
    {
      t: 'p',
      md: 'En **serverless** ejecutas funciones que el proveedor arranca bajo demanda: no hay servidor que aprovisionar, endurecer ni parchear, y el escalado es automático. Lo que desaparece es la administración del sistema operativo, **no la responsabilidad**. Tuyo sigue siendo el **código de la función** (con sus dependencias vulnerables y sus fallos de validación), el **rol IAM** que la función asume —el error más común es concederle permisos amplios «para que funcione», con lo que un fallo en el código se convierte en acceso completo a los datos— y, por supuesto, los **datos** que procesa. A cambio aceptas dos inconvenientes que el examen nombra: **vendor lock-in**, porque el código y los disparadores se atan al ecosistema de un proveedor concreto, y **visibilidad limitada**, porque no puedes instalar un agente ni capturar tráfico en una máquina que no existe: dependes de los registros que el proveedor te dé.',
    },
    {
      t: 'check',
      q: {
        q: 'The port authority replaces a virtual machine with a serverless function that resizes container photos. Who is responsible for patching the operating system that runs the function, and what remains with the port authority?',
        choices: [
          'The port authority patches the OS; the provider owns the function code',
          'The provider patches the OS; the port authority still owns the function code, its IAM role and its data',
          'The provider owns everything, including the code and the permissions of the function',
          'Nobody patches anything, because serverless functions run only for a few seconds',
        ],
        answer: 1,
        explain:
          'Serverless removes operating system maintenance from the customer, but code, identity and data never transfer to the provider. The idea that the provider owns everything is the usual trap: a vulnerable dependency or an over-permissive execution role is still entirely the customer problem.',
      },
    },
    {
      t: 'list',
      items: [
        '**Monolito** — una sola aplicación desplegada como una pieza. Sencilla de razonar y de monitorizar, pero un fallo o un despliegue defectuoso afecta a todo el sistema y escalarla obliga a replicarla entera.',
        '**Microservices** — muchos servicios pequeños, independientes y desplegables por separado. Cada uno se actualiza y escala solo, y eso reduce el **blast radius**: comprometer el servicio de facturación no entrega el de atraques.',
        '**Coste de seguridad** — donde antes había llamadas internas a funciones ahora hay decenas de **APIs** por la red. Cada una es superficie de ataque y cada llamada **este-oeste** debe autenticarse (**service-to-service authentication** con mTLS o tokens), no basta con vigilar el perímetro.',
        '**Coste operativo** — más componentes significan más registros que correlacionar, más secretos que rotar y más imágenes que mantener; la complejidad es, en sí misma, un riesgo.',
      ],
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'En la Autoridad Portuaria de Halden',
      md: 'El puerto ha partido su viejo sistema de atraques en seis **microservicios** desplegados con **IaC** sobre **IaaS**, y ha movido el portal público a **serverless**. La auditoría encuentra tres cosas: una plantilla de Terraform con la clave del proveedor de pagos en claro; las máquinas del clúster con **dos meses sin parchear**, porque el equipo daba por hecho que «eso lo hace la nube»; y un servicio interno que acepta peticiones de cualquier otro servicio sin autenticación, porque «están en la misma red». Tres hallazgos, tres lecciones del objetivo 3.1: los secretos fuera del repositorio, el **guest OS** en IaaS es tuyo, y en microservicios el tráfico este-oeste también se autentica.',
    },
    {
      t: 'p',
      md: 'Ya tienes la mitad moderna de la arquitectura. La siguiente lección baja al cable y al hipervisor: cómo se aísla una red con **air gap** o con **segmentación lógica**, qué aporta el **SDN**, qué se gana y se pierde quedándose **on-premises**, y por qué un **contenedor** nunca aísla tanto como una **máquina virtual**.',
    },
  ],
  quiz: [
    {
      id: 'sp3m1q1',
      domain: 'Security Architecture',
      prompt:
        'A port authority runs its cargo tracking application on virtual machines rented from a public cloud provider under an IaaS model. A critical vulnerability is announced in the Linux kernel used by those virtual machines. Who is responsible for applying the patch?',
      choices: [
        'The cloud provider, because it owns the physical hosts',
        'The cloud provider, because kernel updates are part of the platform',
        'The customer, because in IaaS the guest operating system belongs to the customer',
        'Neither party, because cloud virtual machines are patched automatically by design',
      ],
      answer: 2,
      explain:
        'In IaaS the provider secures the hardware and the hypervisor, while the customer rents and therefore maintains the guest operating system, its runtime and its application. Blaming the provider is tempting because it does patch the hosts underneath, but that responsibility stops at the virtualization layer and never reaches the tenant virtual machine.',
    },
    {
      id: 'sp3m1q2',
      domain: 'Security Architecture',
      prompt:
        'Which set of responsibilities remains with the customer in EVERY cloud service model, from IaaS to SaaS?',
      choices: [
        'Data, identities and access permissions, and service configuration',
        'Physical security, hypervisor patching and network hardware',
        'Operating system patching, runtime updates and application code',
        'Datacentre power, cooling and fire suppression',
      ],
      answer: 0,
      explain:
        'The responsibility matrix moves the operating system, runtime and application between the parties depending on the model, but data, identities and configuration are always the customer duty. Operating system and runtime maintenance is the tempting answer because it belongs to the customer in IaaS, yet it shifts to the provider in PaaS, SaaS and serverless.',
    },
    {
      id: 'sp3m1q3',
      domain: 'Security Architecture',
      prompt:
        'A security team wants every new environment to be built from the same reviewed definition, wants changes to go through version control, and wants to stop servers from silently diverging from the approved baseline. Which approach BEST meets these goals?',
      choices: [
        'Adopting a serverless platform for all workloads',
        'Moving the workloads from on-premises to SaaS',
        'Splitting the monolith into microservices',
        'Defining the infrastructure as code in versioned templates',
      ],
      answer: 3,
      explain:
        'Infrastructure as code expresses the environment as reviewable, versioned text, which makes deployments repeatable and eliminates configuration drift. Microservices is the tempting distractor because it is also a modernization step, but decomposing an application changes how it is built, not how consistently the infrastructure is provisioned.',
    },
    {
      id: 'sp3m1q4',
      domain: 'Security Architecture',
      prompt:
        'A single infrastructure-as-code module is reused to build forty environments. A review discovers that the module opens administrative access to the entire internet. Which characteristic of IaC does this incident illustrate?',
      choices: [
        'IaC removes the need to review configuration because templates are automatically validated',
        'A flawed template replicates the same misconfiguration everywhere it is deployed',
        'IaC prevents drift, so a mistake in a template cannot reach production',
        'Templates only affect the environment in which they were first executed',
      ],
      answer: 1,
      explain:
        'The strength of IaC, deploying identical environments from one definition, is also its main danger: one bad line becomes forty identical exposures in a single run. Saying that drift prevention stops the mistake from reaching production confuses two ideas, because IaC guarantees that environments match the template, not that the template is correct.',
    },
    {
      id: 'sp3m1q5',
      domain: 'Security Architecture',
      prompt:
        'An organization migrates a scheduled job to a serverless function. Which security concern is MOST specific to this architecture?',
      choices: [
        'The team must build a patching schedule for the underlying operating system',
        'Antivirus agents must be installed on each function instance',
        'An over-permissive IAM execution role turns a code flaw into broad access to cloud data',
        'The function requires a dedicated hypervisor that the team must harden',
      ],
      answer: 2,
      explain:
        'Serverless removes the servers, so what remains under customer control is the code and the identity the function assumes, and an execution role granted more rights than needed converts any code weakness into wide data access. Building a patching schedule is the classic trap answer, since the provider maintains the operating system and runtime for serverless workloads.',
    },
    {
      id: 'sp3m1q6',
      domain: 'Security Architecture',
      prompt:
        'A monolithic booking application is redesigned as a set of microservices. Which statement BEST describes the security trade-off of this change?',
      choices: [
        'Compromise of one service no longer implies compromise of the whole application, but the number of network-exposed APIs that must be authenticated grows',
        'The attack surface shrinks because each service is smaller than the monolith was',
        'Service-to-service calls can be trusted implicitly because they never leave the internal network',
        'Microservices remove the need for authentication, since the API gateway validates every user once',
      ],
      answer: 0,
      explain:
        'Independent services reduce the blast radius of a single compromise, yet every internal function call becomes a network API that must be authenticated and monitored. Trusting east-west traffic because it stays internal is exactly the assumption that lets an attacker pivot freely once inside, which is why service-to-service authentication is required.',
    },
    {
      id: 'sp3m1q7',
      domain: 'Security Architecture',
      prompt:
        'A hybrid deployment keeps the ERP on-premises and the analytics platform in a public cloud. Auditors find that password policy and multifactor requirements are enforced in the internal domain but not in the cloud tenant. Which hybrid consideration does this finding illustrate?',
      choices: [
        'Vendor lock-in caused by proprietary cloud services',
        'Inconsistent policy enforcement across two separate control planes',
        'Configuration drift inside the on-premises hypervisor cluster',
        'Loss of data sovereignty over the analytics dataset',
      ],
      answer: 1,
      explain:
        'A hybrid environment has two management planes with their own identity models, and security depends on applying equivalent policy in both, which is precisely what failed here. Vendor lock-in is a real hybrid concern but describes difficulty leaving a provider, not a gap between the rules enforced on each side.',
    },
  ],
};

// ---------------------------------------------------------------------------
// SP3M2 — Red, on-premises, centralización, virtualización y contenedores
// (SY0-701, objetivo 3.1)
// ---------------------------------------------------------------------------
const sp3m2: Module = {
  id: 'sp3m2',
  sectionId: 'sp3',
  title: 'Red, on-premises, centralización, virtualización y contenedores',
  minutes: 12,
  objectives: [
    'Diferenciar physical isolation (air-gapped) de logical segmentation y saber cuándo el examen pide cada una',
    'Explicar qué separa el software-defined networking (SDN) del enfoque tradicional y qué ventaja de seguridad aporta',
    'Comparar on-premises y cloud, y gestión centralizada frente a descentralizada, por sus ventajas e inconvenientes',
    'Contrastar la fuerza de aislamiento de la virtualización y la containerization, y sus riesgos propios',
    'Elegir el enfoque de aislamiento adecuado para un sistema de la Autoridad Portuaria según el escenario',
  ],
  blocks: [
    {
      t: 'p',
      md: 'La lección anterior te dejó en la nube; esta vuelve al cable, al switch y al hipervisor. El objetivo 3.1 espera que sepas ordenar las formas de **aislar** un sistema —de la separación física absoluta a un contenedor que comparte núcleo con sus vecinos— y que puedas defender una elección de arquitectura con argumentos de seguridad, coste y operación. Es el vocabulario que después sostiene todo el dominio 3: sin entender qué aísla de verdad, cualquier diseño de zonas o de recuperación se queda en un dibujo bonito.',
    },
    { t: 'h', text: 'Aislar la red: air gap, segmentación lógica y SDN' },
    {
      t: 'p',
      md: 'La **physical isolation** —lo que el examen llama un sistema **air-gapped**— significa que **no existe ningún camino de red** entre ese sistema y el resto: ni cable, ni Wi-Fi, ni un cortafuegos que «lo permita solo para mantenimiento». Es el aislamiento más fuerte que existe y también el más incómodo: actualizar, hacer copias o exportar datos exige mover **medios físicos**, y ese trasiego convierte al **USB** en el vector principal, junto al error humano de tender «un cablecito temporal» que nunca se retira. Un air gap con una excepción deja de ser un air gap. La alternativa habitual es la **logical segmentation**: la red sigue estando físicamente unida, pero se divide en **VLANs**, subredes y **zonas de firewall** con reglas que definen qué puede hablar con qué. Es flexible, barata y suficiente para la mayoría de los casos —limita el movimiento lateral y contiene un incidente en su segmento—, pero depende de una configuración correcta: una regla permisiva, una VLAN mal asignada o un salto de VLAN devuelven la conectividad que creías cortada.',
    },
    {
      t: 'check',
      q: {
        q: 'The crane control systems at the Halden Port Authority run on their own switches, have no cable, wireless link or firewall rule connecting them to the corporate network, and are updated from vendor media carried by an engineer. How is this network BEST described?',
        choices: [
          'Logically segmented with VLANs',
          'Physically isolated, or air-gapped',
          'Software-defined and centrally managed',
          'A demilitarized zone between two firewalls',
        ],
        answer: 1,
        explain:
          'No network path of any kind exists between the two environments, which is the definition of physical isolation or an air gap, and the use of removable media to update is its typical consequence. Logical segmentation is the tempting answer, but it always leaves a shared physical network with rules deciding what may cross.',
      },
    },
    {
      t: 'p',
      md: 'El **software-defined networking (SDN)** cambia la forma de administrar esa red. En el modelo tradicional cada switch y cada router toma sus propias decisiones y se configura uno a uno, así que la política real de la red es la suma de cientos de ficheros dispersos. El SDN **separa el control plane del data plane**: la inteligencia —qué se permite, qué ruta se toma, qué segmento existe— se concentra en un **controlador** central que **empuja la política** a los dispositivos, que se limitan a reenviar paquetes. La ventaja de seguridad es que la segmentación se vuelve programable y **consistente**: puedes aislar un segmento entero, o desplegar la misma regla en toda la red, en segundos y desde un único sitio, en lugar de tocar veinte equipos y olvidar el vigésimo primero. El precio es que ese controlador se convierte en un objetivo de altísimo valor y en un **punto único de fallo**: quien lo controla, controla la red.',
    },
    {
      t: 'check',
      q: {
        q: 'Which statement BEST describes the security advantage of software-defined networking?',
        choices: [
          'Network policy is defined centrally on a controller and pushed consistently to every device',
          'It encrypts all traffic between switches by default',
          'It removes the need for firewalls because routing decisions are made in software',
          'It physically separates operational technology from the corporate network',
        ],
        answer: 0,
        explain:
          'SDN splits the control plane from the data plane so that segmentation and rules come from one programmable source, which makes policy consistent and fast to change across the whole network. Claiming it removes the need for firewalls is wrong: SDN changes how policy is distributed, not whether traffic still has to be filtered and inspected.',
      },
    },
    { t: 'h', text: 'On-premises, cloud y el eje centralizado ↔ descentralizado' },
    {
      t: 'p',
      md: 'Quedarse **on-premises** significa que el hardware, la sala y la red son tuyos. Ganas **control total** (eliges cada componente, guardas los datos donde quieres, no compartes infraestructura con desconocidos), **latencia baja** hacia los sistemas locales —motivo decisivo cuando hay procesos industriales que no toleran un salto a internet— y una respuesta clara a las exigencias regulatorias de residencia de datos. Pagas con **capex**: comprar antes de usar, sobredimensionar por si acaso, sustituir el hardware cada pocos años y sostener un equipo que parchee, vigile y responda a las tres de la mañana; y escalar significa esperar semanas a que llegue un servidor. La nube invierte esa ecuación: **opex**, elasticidad inmediata y operaciones delegadas, a cambio de menos visibilidad y de depender de un tercero. La otra decisión, ortogonal a la anterior, es cómo se **gestiona**. Un modelo **centralizado** concentra administración, política y registro en una consola única: la política es **consistente**, la visibilidad es global y una respuesta se aplica a toda la organización de una vez, pero esa consola es un **single point of failure** y un objetivo prioritario, y puede ser un cuello de botella para las sedes remotas. Un modelo **descentralizado** da **autonomía local**: cada sede decide rápido y adapta sus controles a su realidad, y la caída de una no arrastra a las demás; el coste es una **política inconsistente**, duplicación de esfuerzos y unos registros que nadie correlaciona hasta que ya es tarde.',
    },
    { t: 'h', text: 'Virtualización y contenedores' },
    {
      t: 'p',
      md: 'La **virtualization** ejecuta varias **máquinas virtuales**, cada una con **su propio sistema operativo completo**, sobre un **hypervisor** que reparte el hardware. El aislamiento es fuerte porque cada VM cree tener su propia máquina y el hipervisor arbitra el acceso al hardware. Sus riesgos tienen nombre propio en el examen: el **VM escape**, la fuga desde una máquina virtual hacia el hipervisor o hacia otra VM —muy raro, pero catastrófico, porque compromete a todas las invitadas del anfitrión—; y el **VM sprawl**, la proliferación de máquinas creadas para una prueba y nunca retiradas, que quedan encendidas, sin parchear y sin dueño, fuera del inventario y del escaneo de vulnerabilidades. A eso se suma que **snapshots** y plantillas antiguas pueden reintroducir vulnerabilidades ya corregidas al restaurarse.',
    },
    {
      t: 'p',
      md: 'La **containerization** empaqueta una aplicación con sus dependencias, pero **todos los contenedores de un host comparten el mismo kernel**. Eso los hace ligerísimos y rapidísimos de arrancar —y, al ser **efímeros**, se reemplazan en lugar de parchearse: se reconstruye la imagen y se redespliega—, pero también significa que **su aislamiento es más débil que el de una VM**: una vulnerabilidad del kernel o un contenedor lanzado como privilegiado abren la puerta a un **container escape** hacia el host y hacia sus vecinos. Los controles propios de este modelo miran a la **imagen**: **image provenance** (de dónde viene y quién la firma), **registry trust** (usar registros internos y aprobados en lugar de descargar cualquier imagen pública), escaneo de vulnerabilidades de la imagen antes de desplegarla, y no ejecutar como root ni con privilegios innecesarios.',
    },
    {
      t: 'table',
      headers: ['Enfoque', 'Fuerza de aislamiento', 'Riesgo típico', 'Control clave'],
      rows: [
        [
          '**Physical isolation / air gap**',
          'Máxima: no hay ruta de red',
          'Medios extraíbles (USB) y puentes «temporales» no autorizados',
          'Control estricto de medios y verificación de que no existe ningún enlace',
        ],
        [
          '**Logical segmentation** (VLAN, subred, zona)',
          'Media: depende de la configuración',
          'Reglas permisivas, VLAN mal asignada, VLAN hopping',
          'Revisión periódica de reglas, mínimo privilegio de red, 802.1X',
        ],
        [
          '**SDN**',
          'Media-alta: política programable y uniforme',
          'El controlador es objetivo de alto valor y punto único de fallo',
          'Endurecer y aislar el controlador, MFA y registro de sus cambios',
        ],
        [
          '**Virtualization** (VM)',
          'Alta: cada VM tiene su propio kernel y OS',
          '**VM escape**, **VM sprawl**, snapshots obsoletos',
          'Parcheo del hipervisor, inventario y ciclo de vida de las VM',
        ],
        [
          '**Containerization**',
          'Menor que una VM: kernel compartido con el host',
          '**Container escape**, imágenes públicas comprometidas',
          'Imágenes firmadas de registros de confianza, escaneo, sin privilegios',
        ],
      ],
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen: quién aísla más y a qué precio',
      md: 'Memoriza el orden: **air gap > máquina virtual > contenedor**. Si el enunciado pide **«el aislamiento más fuerte»** entre cargas de trabajo, la respuesta apunta a **VMs** o a **separación física**, nunca a contenedores, porque **los contenedores comparten el kernel del host**. El **air gap** solo gana a la segmentación cuando **de verdad no queda ningún puente**: si el escenario menciona un portátil de mantenimiento, una VPN de proveedor o un USB, el air gap ya está roto y el control esperado pasa a ser el de los medios extraíbles. Y no confundas ejes: **on-premises frente a cloud** responde a *dónde vive* la infraestructura; **centralizado frente a descentralizado** responde a *quién la gestiona*. Si el enunciado se queja de políticas distintas en cada sede, la respuesta es **centralizar la gestión**; si se queja de que una consola caída deja a todos a ciegas, están describiendo el **single point of failure** de ese mismo modelo.',
    },
    {
      t: 'check',
      q: {
        q: 'A vulnerability lets an attacker break out of a workload and reach the host and its neighbouring workloads. Why is this outcome more likely with containers than with virtual machines?',
        choices: [
          'Containers always run with an outdated operating system',
          'Containers share the host kernel, while each virtual machine runs its own kernel behind a hypervisor',
          'Virtual machines are never affected by escape vulnerabilities',
          'Containers cannot be scanned for vulnerabilities before deployment',
        ],
        answer: 1,
        explain:
          'The kernel is the shared boundary in containerization, so a kernel flaw or an over-privileged container can reach the host and everything else on it, whereas a virtual machine has its own kernel and the hypervisor between it and the hardware. Saying virtual machines are immune is the trap: VM escape exists too, it is simply rarer and harder because the isolation boundary is stronger.',
      },
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'En la Autoridad Portuaria de Halden',
      md: 'El puerto tiene los tres modelos a la vez. Los **PLC de las esclusas** están **air-gapped** y se actualizan con medios del fabricante, así que el control real está en quién toca ese USB. Las aplicaciones de oficina viven en **VMs on-premises**, donde la auditoría encuentra once máquinas encendidas de un piloto de 2023 que nadie apagó: **VM sprawl** puro, sin parchear y fuera del inventario. Y el nuevo portal de reservas corre en **contenedores** construidos sobre una imagen base descargada de un registro público sin verificar, con un servicio ejecutándose como root. Tres arquitecturas, tres controles distintos: medios extraíbles, ciclo de vida de las VM y procedencia de las imágenes.',
    },
    {
      t: 'p',
      md: 'Con los modelos ya ordenados, el objetivo 3.1 se cierra en la próxima lección con los sistemas que no puedes rediseñar a voluntad: **IoT**, **ICS/SCADA**, **RTOS** y **embedded**, donde la disponibilidad manda y parchear a veces no es una opción. Allí verás también la lista completa de **consideraciones de arquitectura** —de la resiliencia al coste, de la escalabilidad a la **inability to patch**— que el examen usa para justificar cada decisión.',
    },
  ],
  quiz: [
    {
      id: 'sp3m2q1',
      domain: 'Security Architecture',
      prompt:
        'A regulator requires that a laboratory system storing classified test results have no possible network path to any other system. Which approach satisfies this requirement?',
      choices: [
        'Place the system in its own VLAN with a deny-all firewall rule',
        'Physically isolate the system so that no wired or wireless connection exists',
        'Deploy the system as a container on a dedicated host',
        'Manage the system from a central SDN controller with a restrictive policy',
      ],
      answer: 1,
      explain:
        'Only physical isolation, an air gap, guarantees that no network path exists, because there is no cable, radio or rule that could be changed to create one. A VLAN with a deny-all rule is the tempting answer, but the systems still share physical infrastructure and a single configuration change or a VLAN hopping attack can restore connectivity.',
    },
    {
      id: 'sp3m2q2',
      domain: 'Security Architecture',
      prompt:
        'An air-gapped process control network at a port becomes infected with malware even though it has never been connected to any other network. Which vector is MOST likely, and which control addresses it?',
      choices: [
        'A phishing email opened by an operator; email filtering',
        'A compromised cloud API key; identity governance',
        'Removable media used to transfer vendor updates; strict control of media and scanning on a kiosk',
        'A misconfigured firewall rule; quarterly rule review',
      ],
      answer: 2,
      explain:
        'Air-gapped environments still need updates and data exports, and those move on USB drives or optical media, which makes removable media the primary vector and media control the matching mitigation. A misconfigured firewall rule cannot be the answer here, because a genuine air gap has no firewall bridging the two environments at all.',
    },
    {
      id: 'sp3m2q3',
      domain: 'Security Architecture',
      prompt:
        'After an incident, a review shows that malware on an office printer VLAN was able to reach the finance file server because both sat in the same flat network. Which architectural change MOST directly limits this lateral movement in the future?',
      choices: [
        'Logical segmentation into separate VLANs and subnets with filtering between them',
        'Migrating the file server to a SaaS platform',
        'Converting the file server into a container image',
        'Decentralizing security management so each department sets its own rules',
      ],
      answer: 0,
      explain:
        'Splitting a flat network into segments with filtering between them is exactly what contains lateral movement, keeping a compromise inside its zone. Decentralizing management is the distractor that sounds like separation, but it divides who administers policy rather than what traffic can cross, and it usually makes rules less consistent.',
    },
    {
      id: 'sp3m2q4',
      domain: 'Security Architecture',
      prompt:
        'In a software-defined network, which component holds the logic that decides how traffic is allowed and forwarded?',
      choices: [
        'Each individual switch, configured device by device',
        'The endpoint agents installed on every host',
        'The centralized controller in the control plane, which pushes policy to the data plane',
        'The perimeter firewall, which distributes routes to the switches',
      ],
      answer: 2,
      explain:
        'SDN separates the control plane from the data plane so that a central controller holds the policy and the network devices simply forward packets according to what it pushes. Per-device configuration is precisely the traditional model that SDN replaces, which is why consistency and speed of change improve, at the cost of concentrating risk in the controller.',
    },
    {
      id: 'sp3m2q5',
      domain: 'Security Architecture',
      prompt:
        'A team must run two workloads from different customers on the same physical server and needs the STRONGEST isolation between them. Which option BEST meets the requirement?',
      choices: [
        'Two containers on the same host, each with its own network namespace',
        'Two virtual machines, each with its own guest operating system, on a hypervisor',
        'Two processes on the host with different user accounts',
        'One container per workload, both built from signed images',
      ],
      answer: 1,
      explain:
        'Virtual machines provide the stronger boundary because each has its own kernel and operating system and the hypervisor mediates access to the hardware. Signed container images improve supply chain trust but do nothing about the fundamental limitation, since all containers on a host still share one kernel.',
    },
    {
      id: 'sp3m2q6',
      domain: 'Security Architecture',
      prompt:
        'A vulnerability scan of a virtualization cluster finds dozens of powered-on virtual machines that are missing months of patches, have no documented owner, and were created for short-lived projects. Which virtualization risk does this describe?',
      choices: [
        'VM escape',
        'Container escape',
        'Vendor lock-in',
        'VM sprawl',
      ],
      answer: 3,
      explain:
        'Unmanaged virtual machines that outlive their purpose, stay powered on and fall outside inventory and patching are the definition of VM sprawl. VM escape is the tempting answer because it is the other well-known virtualization term, but it refers to breaking out of a guest into the hypervisor, which is not what the scan found.',
    },
    {
      id: 'sp3m2q7',
      domain: 'Security Architecture',
      prompt:
        'Each of five port terminals currently manages its own firewalls, antivirus and logging. Leadership wants uniform policy and a single view of alerts, and asks about the main drawback of consolidating management into one platform. Which answer is correct?',
      choices: [
        'The consolidated platform becomes a single point of failure and a high-value target',
        'Policy will become less consistent across the terminals',
        'Alerts from the terminals can no longer be correlated',
        'Each terminal will need to hire additional local administrators',
      ],
      answer: 0,
      explain:
        'Centralization delivers consistent policy and global visibility, and its price is that one console concentrates both the risk of outage and the value for an attacker who compromises it. Losing policy consistency and losing correlation are the drawbacks of the decentralized model, so they are exactly what the change is meant to fix.',
    },
  ],
};

export const SP3_PART1: Module[] = [sp3m1, sp3m2];
