import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// SP3M7 — Resiliencia y recuperación: HA, sitios, backups, pruebas y energía
// (SY0-701, objetivo 3.4)
// ---------------------------------------------------------------------------
const sp3m7: Module = {
  id: 'sp3m7',
  sectionId: 'sp3',
  title: 'Resiliencia y recuperación: HA, sitios, backups, pruebas y energía',
  minutes: 13,
  objectives: [
    'Distinguir load balancing de clustering y saber cuál responde a cada necesidad de high availability',
    'Comparar hot site, warm site y cold site por coste y tiempo de recuperación, y justificar la elección de geographic dispersion',
    'Explicar qué aportan la platform diversity, los multi-cloud systems y la continuity of operations, y en qué consiste el capacity planning de people, technology e infrastructure',
    'Elegir el tipo de prueba adecuado entre tabletop exercise, simulation, parallel processing y fail over',
    'Diseñar una estrategia de backups (onsite/offsite, frequency, encryption, snapshots, replication, journaling, recovery) y protegerla con UPS y generator',
  ],
  blocks: [
    {
      t: 'p',
      md: 'Todo el Dominio 3 ha girado alrededor de la confidencialidad y la integridad: zonas, firewalls, cifrado, clasificación. El objetivo 3.4 cierra el dominio con la tercera pata de la tríada, la **availability**, y lo hace desde la arquitectura: no «qué hago cuando se cae», sino «cómo diseño el sistema para que caerse duela poco». Como analista te van a pedir dos cosas en el examen: elegir el **mecanismo de resiliencia** que encaja con un requisito (tiempo, presupuesto, tipo de fallo) y detectar el eslabón que la organización cree tener cubierto y no lo está —casi siempre, un backup que nadie ha restaurado nunca—.',
    },
    { t: 'h', text: 'Alta disponibilidad: load balancing y clustering' },
    {
      t: 'p',
      md: 'Las dos técnicas de **high availability** que CompTIA nombra se confunden con facilidad porque ambas usan varios servidores, pero responden a preguntas distintas. El **load balancing** reparte el tráfico **en vivo** entre varios nodos activos que ofrecen el mismo servicio: mejora el rendimiento, permite crecer añadiendo nodos y, gracias a los **health checks**, deja de enviar peticiones al nodo que deja de responder. Es la respuesta natural para servicios sin estado, como el portal web público del puerto. El **clustering** va más allá: varios nodos se presentan como **un único sistema lógico** —almacenamiento compartido o replicado y una identidad de servicio que se mueve con el nodo activo— y el cluster gestiona el **failover** del servicio completo, incluido su estado. Un cluster puede ser **active/active** (todos los nodos trabajan) o **active/passive** (uno espera en reserva y toma el relevo). La regla práctica: si el escenario habla de **repartir carga** entre servidores equivalentes, es load balancing; si habla de que un **servicio con estado** (una base de datos, un servidor de ficheros) siga existiendo con la misma identidad cuando muere el nodo que lo alojaba, es clustering. Ninguna de las dos protege contra la pérdida del edificio entero: para eso hacen falta sitios alternativos.',
    },
    {
      t: 'check',
      q: {
        q: 'The Halden Port Authority runs its cargo manifest database on a single server. The requirement is that if that server fails, the database service must keep running under the same name and IP, with no data loss and no manual reconfiguration by clients. Which high availability technique meets this requirement?',
        choices: [
          'Load balancing across two web front ends',
          'Clustering the database servers with failover',
          'Taking hourly snapshots of the database volume',
          'Adding a second internet service provider',
        ],
        answer: 1,
        explain:
          'A cluster presents several nodes as one logical system with a shared identity and shared storage, so the stateful database service fails over to a surviving node transparently. Load balancing is the tempting distractor because it also uses multiple servers, but it distributes independent requests among equivalent nodes and does not carry a stateful service, or its identity, from a dead node to a live one.',
      },
    },
    { t: 'h', text: 'Sitios alternativos, dispersión geográfica y diversidad' },
    {
      t: 'p',
      md: 'Un **recovery site** es la instalación a la que te mudas cuando la principal deja de existir, y CompTIA los ordena por cuánto hay ya funcionando allí. Un **hot site** es una réplica operativa: hardware encendido, software instalado, datos replicados casi en tiempo real; conmutas en minutos y pagas por ello todo el año. Un **warm site** tiene el espacio, la conectividad y el hardware preparados, pero los datos hay que restaurarlos desde los backups o desde una replicación periódica: hablamos de horas o de un día. Un **cold site** es un local con electricidad, refrigeración y una acometida de red; el hardware y los datos los llevas tú, así que la recuperación se mide en días o semanas y es la opción más barata. La elección no es de gusto: se deriva del **RTO** (cuánto puede estar caído el servicio) y del **RPO** (cuántos datos puedes permitirte perder) que la organización fijó al analizar el riesgo. La **geographic dispersion** es la condición que hace útil a cualquiera de los tres: el sitio alternativo debe estar **lo bastante lejos** como para que un mismo suceso —una inundación en la dársena, un temporal, un corte regional de red eléctrica, un apagón del operador— no alcance a los dos. Un segundo CPD en el edificio de enfrente cumple el papeleo y no cumple el objetivo. El contrapeso es la latencia: cuanto más lejos, más difícil es la replicación síncrona.',
    },
    {
      t: 'table',
      headers: ['Tipo de sitio', 'Coste', 'Tiempo de recuperación', 'Cuándo elegirlo'],
      rows: [
        [
          'Hot site',
          'Muy alto (duplicas infraestructura y licencias todo el año)',
          'Minutos: todo está encendido y los datos replicados',
          'RTO/RPO cercanos a cero: servicios cuya caída para la operación portuaria o incumple un contrato o una norma',
        ],
        [
          'Warm site',
          'Medio: hardware y conectividad listos, sin datos en vivo',
          'Horas o un día: hay que restaurar backups y validar',
          'El equilibrio habitual: puedes tolerar una jornada de interrupción pero no una semana',
        ],
        [
          'Cold site',
          'Bajo: solo espacio, energía, refrigeración y una acometida',
          'Días o semanas: hay que llevar y montar hardware y datos',
          'Funciones no críticas, presupuesto muy ajustado o requisitos regulatorios de tener «algún» plan',
        ],
      ],
    },
    {
      t: 'p',
      md: 'Tener dos sitios no basta si los dos comparten el mismo punto débil. La **platform diversity** consiste en no depender de un único proveedor, sistema operativo, firmware o versión: si el hipervisor de producción y el de respaldo son idénticos, una vulnerabilidad crítica o una actualización defectuosa los tumba a la vez. Los **multi-cloud systems** aplican la misma idea a la nube —repartir cargas entre dos proveedores para sobrevivir a una caída regional o global de uno de ellos, y de paso evitar el *vendor lock-in*—, a cambio de mucha más complejidad: dos modelos de IAM, dos consolas, dos facturas y personal que domine ambos. La **continuity of operations (COOP)** es la capa que el examen olvida y la vida no: el plan para **seguir prestando las funciones esenciales sin los sistemas**. Formularios en papel para registrar la entrada de camiones, radio en vez de la aplicación de coordinación, líneas telefónicas alternativas, delegación de autoridad y orden de sucesión para que alguien pueda decidir aunque la directora esté ilocalizable. Y todo lo anterior se sostiene sobre el **capacity planning**, que CompTIA divide en tres: **people** (personal suficiente y formado, guardias, formación cruzada para que la recuperación no dependa de una sola persona), **technology** (CPU, almacenamiento, ancho de banda y licencias para absorber el pico o funcionar en el sitio de respaldo) e **infrastructure** (metros de rack, energía, refrigeración y espacio físico donde poner a la gente). Un plan de recuperación que dimensiona los servidores y no las personas falla la primera noche.',
    },
    {
      t: 'check',
      q: {
        q: 'The port authority replicates its virtualization cluster to a second data centre 40 km away. Both sites run the identical hypervisor version from the same vendor. A defective vendor update crashes every host at both sites simultaneously. Which resilience concept was missing?',
        choices: [
          'Geographic dispersion',
          'Continuity of operations',
          'Platform diversity',
          'Capacity planning',
        ],
        answer: 2,
        explain:
          'A single vendor and version shared by production and recovery is a common-mode failure, and platform diversity —different vendors, operating systems or firmware— is what prevents one flaw from taking down both. Geographic dispersion is the tempting distractor, but it was already in place and it only protects against events tied to a location, not against a defect that travels in software to every site at once.',
      },
    },
    { t: 'h', text: 'Pruebas, backups y energía' },
    {
      t: 'p',
      md: 'Un plan que nadie ha probado es una hipótesis. CompTIA lista cuatro formas de probarlo, ordenadas de menos a más realistas y de menos a más disruptivas. El **tabletop exercise** reúne a las personas implicadas alrededor de una mesa para recorrer un escenario hablando: es el más barato, no toca ningún sistema y sirve para validar el **plan** —roles, criterios de declaración, listas de contacto, decisiones—, no la tecnología. La **simulation** va un paso más allá y ejecuta un escenario con acciones reales pero controladas (un simulacro de evacuación, un ejercicio en el que el equipo responde a eventos inyectados) sin llegar a mover la producción. El **parallel processing** levanta los sistemas de recuperación y los hace procesar **en paralelo** los mismos datos que producción, comparando resultados: demuestra que el entorno de respaldo funciona **sin interrumpir** el servicio real. El **fail over** es la prueba definitiva: se conmuta de verdad la producción al sitio alternativo. Es la única que demuestra que la conmutación funciona extremo a extremo —DNS, certificados, integraciones, permisos— y también la más arriesgada, por lo que se planifica en ventana de mantenimiento y con un plan de vuelta atrás.',
    },
    {
      t: 'p',
      md: 'Los **backups** son la última red y tienen su propio vocabulario de examen. **Onsite** significa copias en la misma instalación: restauras rápido, pero el incendio que se lleva los servidores se lleva las cintas; **offsite** significa copias en otra ubicación o en la nube, que sobreviven al desastre a costa de tardar más en volver. La **frequency** se deriva del **RPO**: si puedes perder como mucho una hora de datos, no puedes hacer copia una vez al día. La **encryption** de los backups es obligatoria y se olvida constantemente: una cinta o un disco extraviado sin cifrar es una brecha de datos completa, y por eso la protección de la **clave** importa tanto como la de la copia. Los **snapshots** capturan el estado de un volumen o una máquina virtual en un instante y son rapidísimos para revertir un cambio, pero suelen vivir **en el mismo almacenamiento** que el original: son un mecanismo de recuperación cómodo, no una copia de seguridad. La **replication** mantiene una copia continua en otro sistema y protege frente a la pérdida de hardware o de sitio, pero replica **también** el borrado y el cifrado del ransomware, así que no sustituye a una copia aislada y con retención. El **journaling** guarda un registro ordenado de cada cambio, de modo que puedes reproducirlo sobre una copia anterior y recuperar hasta un **punto exacto en el tiempo**, minimizando la pérdida entre copias; es lo que usan las bases de datos y muchos sistemas de ficheros. Y la **recovery** es la parte que se demuestra, no se supone: pruebas de restauración periódicas, cronometradas y documentadas. Todo esto necesita corriente. El **UPS** es batería: aguanta de segundos a unos minutos, filtra bajadas y picos de tensión y da tiempo a apagar de forma ordenada o a que arranque el respaldo. El **generator** da horas o días, pero necesita combustible, contrato de suministro y pruebas con carga real; además tarda decenas de segundos en arrancar, y ese hueco lo cubre precisamente el UPS. Cuando la caída llega de verdad, el plan se activa siguiendo esta secuencia.',
    },
    {
      t: 'list',
      ordered: true,
      items: [
        'Detectar y **confirmar** la interrupción: correlacionar alertas y descartar un fallo de monitorización antes de mover nada.',
        'Evaluar el impacto contra los **criterios de declaración** del plan y decidir; la persona con autoridad para **declarar el desastre** está nombrada de antemano, igual que su suplente.',
        'Activar el plan y convocar al **equipo de recuperación** por el canal de comunicación alternativo (el corporativo puede ser parte de lo caído).',
        'Notificar a dirección, personal, clientes y —cuando aplique— aseguradora y reguladores, respetando los plazos legales de notificación.',
        'Poner en marcha la **continuity of operations**: procedimientos manuales para las funciones esenciales mientras dura la recuperación.',
        'Ejecutar el **failover** al sitio alternativo por **orden de prioridad** de servicios, empezando por los que sostienen las funciones críticas.',
        'Restaurar desde el **backup verificado** más reciente o promover la réplica, y aplicar el **journal** hasta el punto en el tiempo acordado.',
        'Verificar **integridad de datos** y funcionamiento de cada servicio **antes** de abrirlo a las usuarias.',
        'Redirigir a las usuarias (DNS, VPN, balanceador) y confirmar con cada área de negocio que la función está realmente de vuelta.',
        'Planificar el **fail back** a la instalación principal y cerrar con la **revisión posterior**, cuyas lecciones actualizan el plan, los tiempos objetivo y el calendario de pruebas.',
      ],
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen: los cinco reflejos del 3.4',
      md: 'Uno: **un backup que nunca se ha restaurado no es un backup**. Cuando la pregunta describe copias que se ejecutan «correctamente» cada noche y pide qué falta, la respuesta es una **prueba de restauración**, no más frecuencia ni más retención. Dos: **UPS y generator no compiten**, se encadenan —el UPS cubre los segundos hasta que el generador arranca y estabiliza—; si el escenario habla de *seconds* o de apagado ordenado, es UPS; si habla de *hours* o *days*, generador. Tres: **tabletop valida el plan, fail over valida el sistema**; si la pregunta exige demostrar que la conmutación funciona de verdad, ninguna prueba de mesa sirve, y si exige «sin interrumpir producción», la respuesta es **parallel processing**. Cuatro: los sitios se ordenan por **cuánto hay ya funcionando allí** —hot (minutos, carísimo), warm (horas), cold (días, barato)—, y el enunciado te da el tipo a través del **RTO** y del presupuesto. Cinco: distingue las tres «diversidades»: **geographic dispersion** (mismo diseño, sitios lejanos, protege del desastre local), **platform diversity** (distinto proveedor o versión, protege del fallo común) y **multi-cloud** (distinto proveedor de nube, protege de la caída de uno). Y recuerda que **replication y snapshots no son copias de seguridad**: propagan el borrado y el ransomware.',
    },
    {
      t: 'check',
      q: {
        q: 'A ransomware incident encrypts the port authority file server. The team finds that the storage snapshots taken every four hours were encrypted along with the volume, and that the replica in the second data centre received the encrypted blocks within seconds. Which backup characteristic would have MOST directly ensured a clean recovery?',
        choices: [
          'Increasing the snapshot frequency to every 30 minutes',
          'Enabling encryption of the replication link',
          'Keeping offsite backups that are isolated from production with a retention period',
          'Adding a third replica in another region',
        ],
        answer: 2,
        explain:
          'Only a copy that the compromised production environment cannot reach or overwrite, kept for a retention window, survives ransomware; that is the difference between a backup and a convenience copy. More replicas is the tempting distractor because it sounds like more resilience, but replication faithfully copies the encryption to every replica, and doing it three times just produces three unusable copies.',
      },
    },
    {
      t: 'p',
      md: 'Con esta lección cierras el Dominio 3: sabes elegir un modelo de arquitectura, colocar cada sistema en su zona, seleccionar el appliance y el túnel adecuados, proteger los datos según su estado y su clasificación, y diseñar la resiliencia que sostiene todo lo anterior. El Dominio 4, **Security Operations**, es el turno de vivir dentro de esa arquitectura día a día: endurecer y gestionar activos, ejecutar la gestión de vulnerabilidades, monitorizar y alertar con un SIEM, administrar identidades y accesos, automatizar tareas repetitivas y —cuando la prevención falla— responder al incidente y preservar la evidencia. Los planes que aquí has aprendido a diseñar y a probar son exactamente los que allí vas a tener que ejecutar bajo presión.',
    },
  ],
  quiz: [
    {
      id: 'sp3m7q1',
      domain: 'Security Architecture',
      prompt:
        'An organization needs a recovery site that keeps costs moderate. Management accepts that critical systems may be unavailable for up to eight hours after a disaster, and the site will hold pre-installed hardware and connectivity, with data restored from backups. Which site type matches this requirement?',
      choices: ['Hot site', 'Cold site', 'Warm site', 'Mobile site'],
      answer: 2,
      explain:
        'Pre-installed hardware and connectivity with data restored from backups, recovering in hours at a moderate cost, is the definition of a warm site. A hot site is the tempting distractor because it also has hardware ready, but a hot site keeps systems running with near-real-time data replication and recovers in minutes, at a far higher cost than the scenario allows.',
    },
    {
      id: 'sp3m7q2',
      domain: 'Security Architecture',
      prompt:
        'Which statement BEST describes the difference between load balancing and clustering?',
      choices: [
        'Load balancing distributes incoming requests across independent active nodes, while clustering makes several nodes act as one logical system that fails over the service itself',
        'Load balancing requires shared storage, while clustering requires a virtual IP address',
        'Load balancing is used only in cloud environments, while clustering is used only on premises',
        'Load balancing protects against site loss, while clustering protects against denial of service',
      ],
      answer: 0,
      explain:
        'Load balancing spreads live traffic across equivalent nodes and stops sending work to unhealthy ones, whereas clustering presents nodes as a single system so a stateful service can move between them without changing identity. The second option is the tempting distractor because it uses real terminology, but load balancing does not require shared storage, which is a clustering attribute, and a virtual IP is used by both designs, not to load balancing.',
    },
    {
      id: 'sp3m7q3',
      domain: 'Security Architecture',
      prompt:
        'A new disaster recovery plan has just been written. Management wants to validate that roles, escalation paths, and declaration criteria make sense before spending money on infrastructure tests, and cannot accept any impact on production. Which test type should be performed FIRST?',
      choices: [
        'Fail over test',
        'Parallel processing test',
        'Full simulation with the recovery team',
        'Tabletop exercise',
      ],
      answer: 3,
      explain:
        'A tabletop exercise walks the participants through the scenario in discussion form, which is exactly how you validate roles, decision criteria and escalation paths at the lowest cost and with zero production impact. A parallel processing test is the tempting distractor because it also avoids interrupting production, but it requires the recovery infrastructure to be built and running, which is precisely the spend management wants to justify first.',
    },
    {
      id: 'sp3m7q4',
      domain: 'Security Architecture',
      prompt:
        'An auditor requires proof that the recovery data centre can actually run the port authority\'s core application, including DNS, certificates, and third-party integrations, under real user load. Which test provides that proof?',
      choices: [
        'Tabletop exercise',
        'Fail over test',
        'Simulation exercise',
        'Reviewing the last successful backup report',
      ],
      answer: 1,
      explain:
        'Only a fail over test actually switches production to the alternate site, which is the single way to prove that name resolution, certificates, integrations and permissions all work end to end under real load. A simulation is the tempting distractor because it involves real activity, but it exercises the response scenario without transferring live production to the recovery site.',
    },
    {
      id: 'sp3m7q5',
      domain: 'Security Architecture',
      prompt:
        'Nightly backup jobs at the Halden Port Authority have reported success for two years. During an outage the team discovers that the backup set cannot be restored because a database agent had been silently writing unusable files. Which practice would have MOST likely revealed the problem beforehand?',
      choices: [
        'Encrypting the backup media at rest',
        'Moving the backups from onsite to offsite storage',
        'Performing periodic, documented restoration tests',
        'Increasing backup frequency from daily to hourly',
      ],
      answer: 2,
      explain:
        'A job that reports success only proves the job ran; regularly restoring the data and verifying it is the control that proves the backups are usable, and it would have surfaced the unusable files years earlier. Increasing frequency is the tempting distractor because it improves the recovery point objective, but hourly copies of unrestorable data are still unrestorable.',
    },
    {
      id: 'sp3m7q6',
      domain: 'Security Architecture',
      prompt:
        'A dockside control room must keep its servers running through a multi-day regional power failure, and must also survive the brief gap between the utility cutting out and the backup power source coming online. Which combination MOST appropriately meets both needs?',
      choices: [
        'Two independent utility feeds, with no on-site power equipment',
        'A UPS sized for 72 hours of runtime',
        'A generator alone, started manually when the outage is confirmed',
        'A UPS to bridge the start-up gap, backed by a fuelled and load-tested generator',
      ],
      answer: 3,
      explain:
        'The UPS carries the load for the seconds or minutes the generator needs to start and stabilize, and the generator then sustains operations for days as long as fuel and load testing are managed. A generator alone is the tempting distractor because it covers the multi-day requirement, but the systems would drop during the start-up delay, which is exactly the gap the question asks about.',
    },
    {
      id: 'sp3m7q7',
      domain: 'Security Architecture',
      prompt:
        'A company builds a second data centre two kilometres from the primary one, on the same river delta and fed by the same regional substation. A flood takes both offline. Which design principle was violated?',
      choices: [
        'Geographic dispersion',
        'Platform diversity',
        'Capacity planning',
        'Continuity of operations',
      ],
      answer: 0,
      explain:
        'Geographic dispersion requires that recovery sites be far enough apart that a single regional event cannot affect both, and a shared flood plain and substation defeat that. Platform diversity is the tempting distractor because it is also about avoiding a shared weakness, but it addresses shared technology such as an identical vendor or firmware, not shared physical location.',
    },
    {
      id: 'sp3m7q8',
      domain: 'Security Architecture',
      prompt:
        'A disaster recovery plan specifies redundant servers, replicated storage and a warm site, but the annual test fails because only one engineer knows how to bring up the recovery environment and she was unreachable. Which aspect of capacity planning was neglected?',
      choices: ['Technology', 'People', 'Infrastructure', 'Geographic dispersion'],
      answer: 1,
      explain:
        'Capacity planning for people covers staffing levels, on-call coverage and cross-training so that recovery never depends on a single individual, which is exactly what failed here. Technology is the tempting distractor because the failure happened during a technical procedure, but the servers, storage and site were all in place; the missing capacity was human.',
    },
  ],
};

export const SP3_PART4: Module[] = [sp3m7];
