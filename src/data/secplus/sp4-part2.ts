import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// SP4M3 — Gestión de activos: adquisición, inventario y retirada
// (SY0-701, objetivo 4.2)
// ---------------------------------------------------------------------------
const sp4m3: Module = {
  id: 'sp4m3',
  sectionId: 'sp4',
  title: 'Gestión de activos: adquisición, inventario y retirada',
  minutes: 13,
  objectives: [
    'Incorporar requisitos de seguridad en la **acquisition/procurement** de equipos, software y servicios',
    'Asignar **ownership** y **classification** a cada activo y justificar por qué un activo sin dueño queda sin proteger',
    'Sostener el **inventory** mediante **enumeration** continua para detectar shadow IT y servidores olvidados',
    'Elegir entre **sanitization**, **destruction** y **certification** según el destino del medio',
    'Aplicar la **data retention** como límite máximo y mínimo, no solo como obligación de guardar',
    'Resolver decisiones de decommissioning en la Autoridad Portuaria de Halden sin dejar datos recuperables',
  ],
  blocks: [
    {
      t: 'p',
      md: 'Las dos lecciones anteriores endurecían sistemas que ya estaban ahí. El objetivo 4.2 da un paso atrás y pregunta algo más incómodo: **¿sabes qué tienes, quién responde de ello y cómo termina su vida?** La gestión de activos no es un inventario contable con etiquetas de patrimonio; es el sustrato de todo lo demás. Un servidor que no figura en ninguna lista no se parchea, no se escanea, no aparece en el SIEM y nadie lo apaga cuando deja de hacer falta. Un disco retirado sin sanitizar se lleva a la calle todo lo que contuvo. El ciclo que te van a preguntar tiene cuatro tramos: **acquisition/procurement**, **assignment/accounting**, **monitoring/asset tracking** y **disposal/decommissioning**. Y el examen se apoya especialmente en los extremos, porque son los que la mayoría de las organizaciones descuidan.',
    },
    { t: 'h', text: 'Adquisición: el riesgo entra con la factura' },
    {
      t: 'p',
      md: 'La **acquisition** —o **procurement**, que es como suele aparecer en el enunciado— es el momento en que una organización **hereda riesgo**. Cuando firmas la compra de cien sensores de báscula o de una plataforma SaaS de gestión de atraques, estás aceptando durante años el diseño de otro: sus credenciales por defecto, su ritmo de parches, sus dependencias y su fecha de fin de soporte. Todo lo que no exijas ahí lo pagarás después con controles compensatorios. Por eso la seguridad se sienta en la mesa de compras y no solo en la de operaciones, y por eso el examen espera que reconozcas requisitos de seguridad **contractuales** frente a actividades operativas posteriores. La pregunta que ordena esta fase es sencilla: si el fabricante deja de publicar actualizaciones dentro de dieciocho meses, ¿qué vas a hacer con doscientos dispositivos instalados en muelles a la intemperie? La respuesta correcta es no comprarlos, no descubrirlo dentro de dieciocho meses.',
    },
    {
      t: 'list',
      items: [
        '**Supported lifetime** — cuántos años el fabricante se compromete a publicar actualizaciones de seguridad, y qué pasa en la fecha de **end of life**. Sin esto compras una vulnerabilidad con fecha de activación.',
        '**Patch commitments** — plazos comprometidos para corregir fallos críticos y canal por el que se notifican. «Publicamos parches cuando podemos» no es un compromiso.',
        '**Vendor assessment** — evaluación del proveedor antes de firmar: certificaciones, historial de incidentes, seguridad de su propia cadena de suministro y derecho de auditoría.',
        '**Configuración segura de partida** — el equipo debe permitir cambiar credenciales por defecto, cifrar, registrar y integrarse con tu autenticación central; si no lo permite, el problema es tuyo para siempre.',
        '**Inventario de componentes (SBOM)** — qué bibliotecas de terceros lleva dentro el producto, para saber a quién afecta el próximo fallo de una dependencia popular.',
        '**Cláusula de salida y retirada** — quién sanitiza o destruye los medios al terminar el contrato, con qué método y qué evidencia entrega. Se negocia al principio, cuando todavía tienes poder de negociación.',
      ],
    },
    { t: 'h', text: 'Asignación e inventario: cada activo con dueño y con nombre' },
    {
      t: 'p',
      md: 'El tramo de **assignment/accounting** convierte una caja en un activo gestionado, y descansa sobre dos ideas. La primera es el **ownership**: cada activo tiene una **persona nombrada** responsable de él y de los datos que contiene, alguien que aprueba los cambios, decide quién accede y responde cuando toca parchear o retirar. Un activo sin dueño es un activo que nadie mantiene, porque «todos» y «nadie» se comportan igual en una hoja de cálculo. La segunda es la **classification**: el mismo servidor no merece el mismo trato si guarda manifiestos públicos o datos personales de la tripulación, y la clasificación es lo que convierte una etiqueta en obligaciones concretas de cifrado, acceso, copia y retirada. El tramo siguiente, **monitoring/asset tracking**, mantiene esa foto viva mediante el **inventory** —el registro autorizado de lo que existe, con su dueño, su ubicación, su clasificación y su estado— y la **enumeration**, que es el descubrimiento continuo que compara la realidad de la red con ese registro. La frase que resume el objetivo es directa: **no puedes proteger lo que no sabes que tienes**. El **shadow IT** (la nube que contrató un departamento con su tarjeta), el servidor de pruebas que sigue encendido cinco años después y el portátil de una persona que ya no trabaja aquí no son problemas de firewall: son fallos de inventario.',
    },
    {
      t: 'check',
      q: {
        q: 'A discovery scan of the Halden Port Authority network answers on a host that appears in no inventory record, has no named owner, and runs an operating system that left vendor support two years ago. Which asset management failure does this represent?',
        choices: [
          'A retention failure, because data was kept longer than the policy allows',
          'A sanitization failure, because a decommissioned disk was never wiped',
          'A procurement failure, because the server was bought without a support contract',
          'A tracking failure: the asset was never enumerated, assigned an owner or classified',
        ],
        answer: 3,
        explain:
          'Nothing can be patched, monitored or retired if it does not appear in the inventory, so an unknown live host is a failure of enumeration and ownership before it is anything else. Procurement is the tempting answer because the machine entered the organization somehow, but the defect is that it was never recorded and assigned, not the terms under which it was purchased.',
      },
    },
    { t: 'h', text: 'Retirada: sanitizar, destruir y certificar' },
    {
      t: 'p',
      md: 'El **disposal/decommissioning** es donde más puntos se pierden, porque tres palabras que suenan parecidas significan cosas distintas. La **sanitization** deja los **datos irrecuperables mientras el medio sigue siendo utilizable**: sobrescritura verificada de un disco magnético, comando de borrado seguro del fabricante o **crypto erase**, que destruye la clave de cifrado y deja el resto como texto cifrado sin llave. Se usa cuando el soporte tiene que sobrevivir: equipos en renting que vuelven al proveedor, portátiles que pasan a otro departamento, cabinas que se revenden. La **destruction** va más allá y **termina físicamente con el medio**: triturado, desmagnetización de un disco magnético o incineración; el dato desaparece y el soporte también, así que se reserva para medios averiados, para lo que no admite borrado seguro y para las clasificaciones más altas. Y la **certification** es la tercera pata: un **certificate of destruction** o de sanitización, emitido por quien realizó el trabajo y con el **número de serie de cada unidad**, es la **evidencia** que presentas a auditoría o al regulador. Sin ese papel no puedes demostrar nada, aunque el trabajo se haya hecho bien; con él conviertes una promesa en un registro. Nunca son respuestas válidas en el examen borrar ficheros, vaciar la papelera ni hacer un **quick format**: los tres dejan los datos intactos y solo retiran las referencias.',
    },
    {
      t: 'table',
      headers: ['Medio', 'Sanitización habitual (el soporte sobrevive)', 'Cuándo toca destrucción en su lugar'],
      rows: [
        [
          'Disco magnético (**HDD**)',
          'Sobrescritura completa y **verificada** con herramienta reconocida',
          'El disco falla y no admite sobrescritura, o la clasificación exige destrucción: **degaussing** o triturado',
        ],
        [
          'Unidad de estado sólido (**SSD/NVMe**)',
          '**Crypto erase** o el comando de sanitizado seguro del firmware',
          'El firmware no soporta borrado seguro o el dato es crítico: triturado a partículas',
        ],
        [
          'Cinta de copia de seguridad',
          'Sobrescritura completa si la cinta se va a reutilizar',
          'Cinta defectuosa, ilegible o con datos cuya retención ya expiró: **degaussing**, incineración o triturado',
        ],
        [
          'Móvil o tableta corporativa',
          '**Remote wipe** y restablecimiento de fábrica sobre un cifrado que ya estaba activo',
          'El dispositivo no arranca, o el cifrado nunca se activó y el borrado no se puede verificar',
        ],
        [
          'Documentación en papel',
          'No aplica: el papel no se sanitiza',
          'Siempre: **shredding** de corte cruzado o incineración; una papelera no es un método',
        ],
        [
          'Almacenamiento en la nube o de un tercero',
          '**Crypto erase**: destruir las claves que controlas y ordenar el borrado contractual',
          'No puedes destruir hardware ajeno: exige **evidencia documental** del borrado y su alcance',
        ],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'Fifty leased laptops must be returned to the vendor at the end of the contract. Their disks are self-encrypting, and the vendor will refurbish and reuse the machines. What should the port authority do before handing them over?',
        choices: [
          'Delete the user profiles and run a quick format on each disk',
          'Physically shred the disks, because the data they held is confidential',
          'Sanitize each disk with a crypto erase and record the result against its serial number',
          'Nothing, because the leasing contract makes the vendor responsible for any residual data',
        ],
        answer: 2,
        explain:
          'The medium has to survive because it goes back to its owner, so the answer sits in the sanitization family, and a crypto erase destroys the key and leaves unreadable ciphertext behind. Shredding is tempting because it is the strongest option available, but destroying leased hardware breaks the contract, and a quick format only removes file references while every block remains recoverable.',
      },
    },
    {
      t: 'p',
      md: 'La **data retention** cierra el ciclo y suele malinterpretarse como una obligación en un solo sentido. Una política de retención fija cuánto tiempo **hay que** conservar cada tipo de dato —siete años para los registros contractuales, lo que marque la normativa marítima para los partes de escala— pero también **cuánto tiempo como máximo** puede conservarse. Ese techo es tan vinculante como el suelo: guardar datos personales de subcontratistas más allá de su finalidad no es prudencia, es exposición añadida, porque todo lo que sigue almacenado se puede filtrar, se puede pedir en un procedimiento judicial y hay que seguir protegiéndolo y pagándolo. Por eso la retención se implementa como **borrado programado**, no como buena intención: al vencer el plazo, el dato se sanitiza o se destruye y queda constancia. La única excepción que el examen reconoce es el **legal hold**, que congela el borrado en cuanto se anticipa un litigio o una investigación; mientras está activo, la retención se suspende y destruir esos datos deja de ser cumplimiento para convertirse en un problema serio.',
    },
    {
      t: 'check',
      q: {
        q: 'A dredging project closes. The retention schedule requires contract records to be kept for seven years and the personal data of subcontractor staff to be deleted after two. Three years later, both sets are still on the file share, and no legal hold is in force. Which statement is accurate?',
        choices: [
          'Both sets comply, because keeping data longer than required is never a violation',
          'The personal data is now held in breach of the retention policy, while the contract records are correctly retained',
          'The contract records should have been deleted, and the personal data should be kept for seven years',
          'Retention rules apply only to data under legal hold, so neither set is affected',
        ],
        answer: 1,
        explain:
          'A retention schedule sets a floor and a ceiling at the same time: the contract records are still inside their seven-year window, but the personal data passed its two-year limit and should already have been disposed of. Assuming that extra retention is harmless is the common trap, because data kept beyond its purpose still has to be protected and can still be breached or subpoenaed.',
      },
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen: cuando el soporte sale de la organización',
      md: 'Tres reglas resuelven casi todas las preguntas del 4.2. **Primera:** si el medio **sale de tu control** —renting devuelto, venta, reciclaje, proveedor externo— la respuesta correcta es **sanitizarlo o destruirlo y obtener el certificado**; borrar ficheros, vaciar la papelera o hacer un **quick format** nunca es la respuesta. **Segunda:** elige por el destino del soporte, no por la fuerza del método: si el medio debe seguir siendo utilizable, **sanitization**; si el medio está averiado, no admite borrado seguro o el dato es de máxima clasificación, **destruction**. **Tercera:** ante un activo desconocido, no clasificado o sin dueño, el examen busca la palabra **inventory/ownership**, no un control técnico; y ante una pregunta de plazos recuerda que la **retention** también pone un **máximo**, salvo que haya un **legal hold** activo que lo suspenda todo.',
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'En la Autoridad Portuaria de Halden',
      md: 'La renovación tecnológica del puerto deja tres montones en el almacén de la terminal. El primero, ochenta portátiles en renting que vuelven al proveedor la semana que viene: llevan disco autocifrado, así que **crypto erase**, verificación y hoja firmada por número de serie. El segundo, doce discos de la cabina antigua que ya no arrancan: no se pueden sanitizar, así que van a **destruction** con un gestor autorizado y **certificate of destruction** con el serial de cada unidad. El tercero, cajas de partes de escala en papel de un proyecto cerrado hace cuatro años: la política decía dos años, nadie programó el borrado, así que hay una brecha de **retention** que triturar y documentar. Y en el escaneo de descubrimiento aparece un servidor de pruebas montado en 2019 por un contratista que ya no existe, sin dueño y sin ficha: ese, antes que ningún parche, necesita un nombre en la casilla de **owner**.',
    },
    {
      t: 'p',
      md: 'Ya sabes qué tienes, de quién es y cómo termina. La siguiente lección se ocupa de lo que le pasa a un activo mientras vive: cómo se **identifican** sus vulnerabilidades. Verás escaneos con y sin credenciales, análisis estático y dinámico de aplicaciones, vigilancia de dependencias, fuentes de inteligencia y pruebas de intrusión, es decir, todas las maneras distintas de enterarte de un problema antes de que se entere otro.',
    },
  ],
  quiz: [
    {
      id: 'sp4m3q1',
      domain: 'Security Operations',
      prompt:
        'The Halden Port Authority is about to sign a five-year contract for wireless gate sensors. Which requirement belongs in the acquisition and procurement stage rather than in later operations?',
      choices: [
        'Scheduling the monthly vulnerability scan of the sensor network',
        'Deciding which analyst reviews the sensor alerts each morning',
        'A documented supported lifetime with committed security update timelines, backed by a vendor assessment',
        'Configuring the SIEM correlation rules that process sensor telemetry',
      ],
      answer: 2,
      explain:
        'Procurement is the point at which an organization inherits or refuses risk, so the supported lifetime and the vendor patch commitments have to be contractual before signature. Scheduling the monthly scan is tempting because it is a genuine security activity, but it only measures a risk that was already accepted the day the contract was signed.',
    },
    {
      id: 'sp4m3q2',
      domain: 'Security Operations',
      prompt:
        'An asset register lists a database server with its location and IP address, but the owner field is empty. Nobody approves changes to it, and it has missed the last three patch cycles. Which asset management practice is missing?',
      choices: [
        'Assignment of ownership, so a named person is accountable for the asset and its data',
        'Increasing the vulnerability scan frequency for that subnet',
        'Encrypting the database at rest',
        'Adding the server to the disaster recovery plan',
      ],
      answer: 0,
      explain:
        'Ownership is what turns an inventory row into something that is actually maintained, because a named person approves changes, decides access and answers for patching and disposal. Encryption at rest is a valid control, yet it protects the data without solving the reason the server was neglected in the first place.',
    },
    {
      id: 'sp4m3q3',
      domain: 'Security Operations',
      prompt:
        'A quarterly discovery scan of the port network reports 412 live hosts, while the authoritative asset inventory lists 380. Which asset management activity does this gap MOST directly show is failing?',
      choices: [
        'Data retention, because records are being kept beyond their required period',
        'Classification, because assets have not been labelled by sensitivity',
        'Sanitization, because retired media has not been wiped correctly',
        'Monitoring and asset tracking, because continuous enumeration is not keeping the inventory accurate',
      ],
      answer: 3,
      explain:
        'Enumeration exists precisely to compare what is really on the network against what the inventory claims, and a persistent gap of thirty-two hosts means that comparison is not driving updates. Classification is a tempting choice because it is also an asset management activity, but you cannot classify assets you have not yet discovered.',
    },
    {
      id: 'sp4m3q4',
      domain: 'Security Operations',
      prompt: 'Which statement BEST distinguishes sanitization from destruction?',
      choices: [
        'Sanitization physically breaks the medium, while destruction only removes the file table entries',
        'Sanitization makes the data unrecoverable while leaving the medium reusable, whereas destruction physically ends the medium itself',
        'Sanitization applies only to paper records, while destruction applies only to magnetic media',
        'They describe the same process, and the term used depends on the disposal vendor',
      ],
      answer: 1,
      explain:
        'The dividing line is the fate of the medium: sanitization keeps the hardware usable while removing any possibility of recovering the data, and destruction ends the hardware along with the data. The first option reverses the two definitions and adds the file-table description, which is neither method but simply deletion, and deletion never satisfies a disposal requirement.',
    },
    {
      id: 'sp4m3q5',
      domain: 'Security Operations',
      prompt:
        'A contractor collects two hundred failed drives from the port datacentre for shredding. Which document does the port authority need in order to close the disposal record and satisfy an auditor?',
      choices: [
        'A signed non-disclosure agreement with the contractor',
        'An updated network diagram showing the removed systems',
        'A certificate of destruction listing the serial numbers of the drives processed',
        'A copy of the contractor cyber insurance policy',
      ],
      answer: 2,
      explain:
        'Certification is the evidence step of disposal, and a certificate of destruction naming each serial number is what proves the work was done and which specific media it covered. A non-disclosure agreement is tempting because it is a real contractual safeguard, but it constrains what the contractor may reveal rather than documenting that the drives were actually destroyed.',
    },
    {
      id: 'sp4m3q6',
      domain: 'Security Operations',
      prompt:
        'A completed research project generated survey data that the retention policy requires to be deleted after three years. Four years later the dataset is still on an active file share, and no legal hold applies. How should this be assessed?',
      choices: [
        'It is acceptable, because keeping data longer is always the safer choice',
        'It satisfies the policy, because the minimum retention period has already elapsed',
        'It is acceptable if the data is moved to an offline archive and kept indefinitely',
        'It breaches the retention policy, because retention defines a maximum period as well as a minimum',
      ],
      answer: 3,
      explain:
        'Retention schedules bound the storage of data at both ends, so data held past its defined limit is a policy breach and an avoidable exposure that must still be protected, produced on request and paid for. Treating the minimum as the only requirement is the classic misreading, and moving the files to an archive changes the storage tier without changing the fact that the data should no longer exist.',
    },
    {
      id: 'sp4m3q7',
      domain: 'Security Operations',
      prompt:
        'A self-encrypting solid-state drive is being reassigned from the finance department to the operations department inside the same organization. Which method is MOST appropriate?',
      choices: [
        'Crypto erase, destroying the encryption key so the remaining ciphertext cannot be recovered',
        'A quick format of the partition followed by a new operating system installation',
        'Degaussing the drive with a strong magnetic field',
        'Deleting the finance folders and emptying the recycle bin',
      ],
      answer: 0,
      explain:
        'The drive has to keep working for its new owner, so sanitization is required, and crypto erase is both the fastest and the most complete option on a self-encrypting device because the data is unreadable once the key is gone. Degaussing is the tempting technical answer, but it only affects magnetic media and on a solid-state drive it destroys the electronics without reliably erasing the flash cells.',
    },
  ],
};

// ---------------------------------------------------------------------------
// SP4M4 — Gestión de vulnerabilidades I: identificación
// (SY0-701, objetivo 4.3)
// ---------------------------------------------------------------------------
const sp4m4: Module = {
  id: 'sp4m4',
  sectionId: 'sp4',
  title: 'Gestión de vulnerabilidades I: identificación',
  minutes: 13,
  objectives: [
    'Comparar **credentialed** y **non-credentialed scans**, y escaneo **agent-based** frente a **agentless**',
    'Distinguir **SAST**, **DAST** y **package monitoring** por lo que cada uno puede ver',
    'Explicar qué aportan los **threat feeds**: OSINT, fuentes propietarias, ISAC y **dark web monitoring**',
    'Diferenciar **penetration testing**, **bug bounty** y **audit** por alcance, continuidad y tipo de hallazgo',
    'Elegir el método de identificación adecuado para un escenario de la Autoridad Portuaria de Halden',
  ],
  blocks: [
    {
      t: 'p',
      md: 'El objetivo 4.3 se divide en dos mitades naturales y esta lección cubre la primera: **cómo te enteras**. Antes de priorizar, parchear o aceptar un riesgo hace falta que el hallazgo exista, y ninguna técnica los ve todos. Un escáner de red conoce lo **ya publicado**; el análisis de código ve lo que aún no se ha desplegado; la vigilancia de dependencias ve lo que tu propio código importa sin mirar; las fuentes de inteligencia ven lo que ocurre **fuera** de tu red; y una prueba de intrusión ve lo que solo aparece cuando alguien encadena tres cosas menores con criterio. La pregunta de examen casi nunca es «¿cuál es la mejor?», sino **cuál responde a esta situación concreta**, así que conviene tener claro el punto ciego de cada una.',
    },
    { t: 'h', text: 'Escanear: el barrido que encuentra lo conocido' },
    {
      t: 'p',
      md: 'El **vulnerability scan** compara lo que encuentra en un sistema con una base de vulnerabilidades conocidas y produce un listado de hallazgos. La primera decisión es cómo mira. Un **non-credentialed scan** no se autentica: ve lo mismo que vería una atacante externa —puertos abiertos, banners de servicio, certificados caducados, cabeceras— e **infiere** versiones a partir de esas pistas. Es útil porque enseña la superficie expuesta, pero produce **muchos falsos positivos** y no ve nada que no escuche en la red. Un **credentialed scan** inicia sesión en el sistema con una cuenta preparada y **lee directamente** el software instalado, el nivel de parche y la configuración: encuentra bastante más, y sobre todo **acierta bastante más**, porque confirma en lugar de suponer. El precio es que hay que custodiar esas credenciales de escaneo, que son privilegiadas y por tanto un objetivo goloso. La segunda decisión es cómo llega: el escaneo **agentless** se lanza desde un servidor central contra la red, sin instalar nada, y solo ve lo que está encendido y alcanzable en ese momento; el **agent-based** instala un componente en cada equipo que informa aunque el portátil esté en casa de la analista o en un hotel, y da continuidad, a cambio de tener que desplegar y mantener el agente, algo que en segmentos **OT** o en sistemas embebidos a menudo no es viable.',
    },
    {
      t: 'check',
      q: {
        q: 'The port authority wants to know exactly which security patches are missing on its internal Windows servers. Which scan configuration gives the most accurate answer?',
        choices: [
          'A non-credentialed scan launched from outside the perimeter firewall',
          'A credentialed scan that authenticates to each server and reads its installed patch level',
          'A non-credentialed scan launched from inside the server VLAN',
          'A port scan of every server followed by manual inspection of the service banners',
        ],
        answer: 1,
        explain:
          'Only an authenticated scan reads the installed software and patch state directly instead of inferring it, which is why credentialed scanning finds far more real issues and reports far fewer false positives. The internal non-credentialed scan is the tempting middle ground, but it still guesses from banners and stays blind to everything that does not listen on the network.',
      },
    },
    { t: 'h', text: 'Mirar dentro de la aplicación: SAST, DAST y dependencias' },
    {
      t: 'p',
      md: 'Cuando el activo es software propio, el escáner de red se queda corto y entra la **application security** del objetivo 4.3. El **static analysis (SAST)** **lee el código fuente** sin ejecutarlo y encuentra patrones peligrosos antes de que existan: concatenación de consultas SQL, validación ausente, secretos escritos en claro, uso de funciones criptográficas obsoletas. Es barato y muy temprano —cabe dentro del propio pipeline de integración continua—, pero genera ruido y necesita algo imprescindible: **tener el código**. El **dynamic analysis (DAST)** hace lo contrario: **ejercita la aplicación en marcha** enviándole peticiones y observando cómo responde, así que no necesita el fuente y encuentra lo que solo se manifiesta en ejecución —gestión de sesión, fallos de autenticación, configuración del servidor, cabeceras ausentes, comportamiento con entradas inesperadas—, a cambio de necesitar un entorno desplegado y una ventana de pruebas. La tercera pieza es el **package monitoring**: vigilar las **dependencias de terceros** que tu aplicación importa, apoyándose en un **SBOM** (el inventario de componentes del software) para poder responder en minutos, y no en semanas, a la pregunta «¿en cuáles de nuestras aplicaciones está esa biblioteca que acaban de reventar?».',
    },
    {
      t: 'check',
      q: {
        q: 'Halden operates a commercial berth-booking web application. The vendor does not release the source code, and the port wants to find flaws in the instance it is running. Which testing approach applies?',
        choices: [
          'Static analysis, because reading the code is always more thorough than testing behaviour',
          'Package monitoring of the vendor internal build pipeline',
          'Dynamic analysis against the running application',
          'Neither, because only the vendor is able to test its own product',
        ],
        answer: 2,
        explain:
          'DAST exercises the deployed application from the outside and needs no access to the source, which is exactly the constraint imposed by a third-party product. SAST is tempting because it inspects logic in depth, but without the source code there is simply nothing for it to analyse.',
      },
    },
    { t: 'h', text: 'Mirar fuera: threat feeds e inteligencia' },
    {
      t: 'p',
      md: 'Escanear te dice cómo estás **por dentro**; los **threat feeds** te dicen qué está pasando **fuera**, y a menudo llegan antes que cualquier hallazgo propio. El **OSINT** es inteligencia de fuentes abiertas: avisos de fabricantes y CERT, listas públicas de vulnerabilidades, blogs de investigación, repositorios de exploits. Es gratuito y abundante, y por eso exige filtrado: sin criterio, el volumen se vuelve inútil. Las **fuentes propietarias o de terceros** son feeds de pago de empresas de inteligencia, con indicadores curados, contexto de actor y, sobre todo, puntualidad; se paga precisamente por que alguien haga la criba. Las **information-sharing organizations** —los **ISAC** sectoriales, y para un puerto existe el marítimo y el de transporte— comparten entre organizaciones del mismo sector aquello que a nadie le apetece publicar: que a tres terminales del mismo país las está intentando el mismo grupo, con las mismas direcciones y el mismo señuelo. Y el **dark web monitoring** vigila mercados y foros cerrados buscando **tus** credenciales a la venta, **tus** datos publicados o menciones de tu organización como objetivo. Es la única fuente que responde a una pregunta que ninguna herramienta interna contesta: **¿alguien ya está usando esto contra nosotros?**',
    },
    { t: 'h', text: 'Poner a prueba: pentest, bug bounty y auditoría' },
    {
      t: 'p',
      md: 'El **penetration testing** es un **ataque simulado y autorizado**: personas expertas intentan comprometer el entorno como lo haría una adversaria real. Su valor no está en repetir lo que ya dice el escáner, sino en lo que ninguna herramienta puntúa: **encadenar** tres hallazgos menores hasta llegar a un dominio, o descubrir un fallo de **lógica de negocio** —que una usuaria pueda aprobar sus propias facturas de atraque— que técnicamente no es ninguna vulnerabilidad conocida. Es puntual y caro, y depende de dos documentos que el examen valora: el **scope** (qué sistemas entran y cuáles quedan fuera) y las **rules of engagement** (cuándo se prueba, qué técnicas están permitidas, a quién se avisa y cómo se para todo si algo se rompe). Sin autorización escrita, la misma actividad es un delito. El **responsible disclosure program** es el canal por el que cualquier persona ajena puede reportar un fallo sin miedo a represalias; cuando además se paga por hallazgo válido se llama **bug bounty**, y su virtud es la **continuidad y la diversidad**: muchos ojos independientes, todo el año, cobrando solo por resultados, a cambio de un triaje constante y de una cantidad razonable de ruido. Por último, el **system and process audit** no busca fallos técnicos sino **incumplimientos del proceso**: escaneos que se ejecutan pero que nadie revisa, excepciones sin aprobación, hallazgos cerrados sin revalidar. Es la técnica que descubre que el programa de vulnerabilidades existe **sobre el papel**.',
    },
    {
      t: 'table',
      headers: ['Método', 'Lo que encuentra y los demás no', 'Coste y esfuerzo'],
      rows: [
        [
          '**Non-credentialed scan**',
          'La superficie tal como la ve alguien de fuera: servicios expuestos, certificados caducados, servicios que sobran',
          'Bajo y rápido, pero muchos **falsos positivos** y ninguna profundidad',
        ],
        [
          '**Credentialed scan**',
          'Parches ausentes, configuración interna y software instalado que no escucha en red',
          'Medio: exige custodiar credenciales privilegiadas de escaneo',
        ],
        [
          '**Agent-based scan**',
          'El estado de equipos que casi nunca están en la red corporativa',
          'Medio: hay que desplegar y mantener el agente; inviable en muchos sistemas **OT**',
        ],
        [
          '**SAST**',
          'Fallos en el código fuente antes de desplegar: inyección, validación ausente, secretos en claro',
          'Bajo por ejecución, alto en ruido; imposible sin acceso al código',
        ],
        [
          '**DAST**',
          'Lo que solo existe en ejecución: sesión, autenticación, configuración del servidor',
          'Medio: necesita entorno desplegado y ventana de pruebas',
        ],
        [
          '**Package monitoring**',
          'Dependencias de terceros vulnerables que ningún escáner de red identifica',
          'Bajo y continuo si existe un **SBOM** mantenido',
        ],
        [
          '**Threat feeds y dark web**',
          'Que ya existe exploit público o que tus credenciales están a la venta',
          'Variable: el OSINT es gratis pero exige criba; los feeds propietarios se pagan',
        ],
        [
          '**Penetration test**',
          'Cadenas de fallos menores y errores de **lógica de negocio**',
          'Alto y puntual: requiere **scope** y **rules of engagement** por escrito',
        ],
        [
          '**Bug bounty**',
          'Hallazgos de una comunidad amplia de investigadores, de forma continua',
          'Variable: se paga por resultado, pero obliga a un triaje permanente',
        ],
        [
          '**Audit**',
          'Que el proceso escrito no se cumple: excepciones sin aprobar, hallazgos sin revalidar',
          'Medio: examina el proceso, no el sistema',
        ],
      ],
    },
    {
      t: 'check',
      q: {
        q: 'Which statement BEST distinguishes a penetration test from a bug bounty programme?',
        choices: [
          'A penetration test is an authorized engagement with a defined scope, timeline and rules of engagement, while a bug bounty invites ongoing submissions from independent researchers and pays for valid findings',
          'A penetration test is unauthorized by definition, while a bug bounty is the authorized equivalent',
          'A bug bounty produces a formal report for auditors, while a penetration test produces no documentation',
          'They are the same activity, and the only difference is the size of the budget',
        ],
        answer: 0,
        explain:
          'The real difference is structure and continuity: a pentest is a bounded, scheduled engagement governed by written rules, while a bounty is an open, continuous channel that rewards whoever finds something valid. Calling a penetration test unauthorized inverts a central point of the objective, since written authorization is exactly what separates a pentest from a crime.',
      },
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen: qué encuentra cada técnica',
      md: 'Cuatro atajos resuelven la mayoría de estas preguntas. **Uno:** un escáner encuentra fallos **conocidos**; una prueba de intrusión encuentra **cadenas y lógica de negocio**. Si el enunciado describe un compromiso que exigió combinar varias debilidades pequeñas, la respuesta es **pentest**. **Dos:** ante «demasiados falsos positivos» o «necesito saber qué parches faltan», la respuesta es **credentialed scan**; y para equipos que rara vez pisan la red corporativa, **agent-based**. **Tres:** **SAST** exige código fuente y actúa antes de desplegar; **DAST** no necesita el fuente y actúa sobre la aplicación en marcha, así que un producto de un tercero se prueba con **DAST**. **Cuatro:** si la pregunta es «¿cómo podríamos haberlo sabido antes de que nos lo contaran desde fuera?» —credenciales a la venta, exploit ya publicado, campaña contra tu sector—, la respuesta está en los **threat feeds**, el **dark web monitoring** o el **ISAC**, no en una herramienta interna.',
    },
    {
      t: 'callout',
      kind: 'example',
      title: 'En la Autoridad Portuaria de Halden',
      md: 'El puerto reconstruye su programa de identificación y cada pieza cubre un punto ciego distinto. El escaneo mensual pasa a ser **credentialed** y los mil doscientos hallazgos «potenciales» se convierten en cuatrocientos reales que nadie tiene que desmentir a mano. Los portátiles de la inspección de buques, que pasan semanas fuera, llevan **agente**. El desarrollo del portal de citas de camiones incorpora **SAST** en el pipeline y **package monitoring** con **SBOM**; la aplicación comercial de atraques, sin código disponible, se prueba con **DAST** en el entorno de preproducción. El puerto se une al **ISAC** marítimo y contrata **dark web monitoring**, que a las tres semanas avisa de un lote de credenciales VPN a la venta —el mismo lote que nadie habría encontrado escaneando—. Y una vez al año, un **pentest** con alcance firmado demuestra lo que ninguna herramienta puntuó: que un permiso heredado más un servicio olvidado más un formulario sin control permitían aprobar una escala sin pasar por operaciones.',
    },
    {
      t: 'p',
      md: 'Con esto ya tienes hallazgos, y probablemente demasiados. La siguiente lección aborda la mitad difícil del objetivo 4.3: confirmar si un hallazgo es real —**false positive** frente a **false negative**—, priorizarlo con **CVSS**, **CVE**, exposición y contexto de negocio, decidir la respuesta entre parche, segmentación, control compensatorio o **exception** documentada, y sobre todo **revalidar**, porque una vulnerabilidad no está cerrada hasta que un nuevo escaneo lo demuestra.',
    },
  ],
  quiz: [
    {
      id: 'sp4m4q1',
      domain: 'Security Operations',
      prompt:
        'A monthly scan of the port server farm returns hundreds of findings labelled as potentially vulnerable, and the team spends days manually disproving most of them. Which change would MOST improve the accuracy of the results?',
      choices: [
        'Increase the scan frequency from monthly to weekly',
        'Run the scan with valid credentials on the target systems',
        'Move the scanner outside the perimeter so it sees what an attacker sees',
        'Raise the minimum severity threshold shown in the report',
      ],
      answer: 1,
      explain:
        'A credentialed scan authenticates and reads the installed software and patch state directly, so it confirms findings rather than inferring them from banners, which collapses the false positive rate. Raising the severity threshold is tempting because the report immediately gets shorter, but it hides findings instead of making them more accurate.',
    },
    {
      id: 'sp4m4q2',
      domain: 'Security Operations',
      prompt:
        'The port authority needs continuous vulnerability data from inspection laptops that spend weeks connected only to hotel and vessel networks. Which approach fits BEST?',
      choices: [
        'A monthly agentless scan launched from the datacentre against the corporate subnets',
        'A non-credentialed scan of the public IP range of the organization',
        'A quarterly penetration test that includes the laptop fleet in scope',
        'Agent-based scanning, with a local agent reporting whenever the device has internet access',
      ],
      answer: 3,
      explain:
        'An installed agent evaluates the device wherever it happens to be and reports back when connectivity returns, which is the only way to keep visibility over machines that are rarely on the corporate network. The agentless datacentre scan is the natural first instinct, but it can only assess hosts that are powered on and reachable at the exact moment the scan runs.',
    },
    {
      id: 'sp4m4q3',
      domain: 'Security Operations',
      prompt:
        'Developers at the port want insecure patterns in their own application flagged before the code is ever deployed to an environment. Which technique matches this requirement?',
      choices: [
        'Static application security testing on the source code',
        'Dynamic application security testing against the running application',
        'A non-credentialed network scan of the build server',
        'Dark web monitoring for leaked application credentials',
      ],
      answer: 0,
      explain:
        'SAST reads the source without executing it, so it can flag unvalidated input, hardcoded secrets or unsafe query construction while the code is still in the pipeline. DAST is the tempting alternative because it also tests the application, but it requires something deployed and running, which is precisely what has not happened yet.',
    },
    {
      id: 'sp4m4q4',
      domain: 'Security Operations',
      prompt:
        'A critical flaw is announced in a widely used logging library. Which capability tells the port authority FASTEST which of its applications include that library?',
      choices: [
        'A non-credentialed external scan of the public web estate',
        'The report from the most recent annual penetration test',
        'Package monitoring against a maintained software bill of materials for each application',
        'A tabletop exercise with the development and operations teams',
      ],
      answer: 2,
      explain:
        'Package monitoring backed by an SBOM answers dependency questions as a lookup rather than an investigation, because the components of each application are already inventoried. The annual pentest report is tempting since it examined the same applications, but it is a snapshot of one moment and was never designed to enumerate third-party components.',
    },
    {
      id: 'sp4m4q5',
      domain: 'Security Operations',
      prompt:
        'A partner organization warns the port authority that VPN credentials belonging to its staff are being offered for sale on a closed forum. Which capability would have surfaced this internally instead?',
      choices: [
        'Credentialed vulnerability scanning of the VPN concentrator',
        'Static code analysis of the VPN web portal',
        'File integrity monitoring on the authentication servers',
        'Dark web monitoring as part of the threat intelligence programme',
      ],
      answer: 3,
      explain:
        'Dark web monitoring watches closed markets and forums for the credentials, data and mentions of your own organization, which is the only one of these sources that looks outside the network at all. Credentialed scanning is tempting because the VPN is the affected system, but a scan reports missing patches and weak configuration, never the fact that valid credentials are already circulating.',
    },
    {
      id: 'sp4m4q6',
      domain: 'Security Operations',
      prompt:
        'Which finding is a penetration test MOST likely to produce that an automated vulnerability scanner would not?',
      choices: [
        'A missing operating system patch on an internal file server',
        'A chain of individually low-severity issues plus a business logic flaw that together let a user approve their own berth invoices',
        'An expired TLS certificate on the public web server',
        'A list of open ports and running services on the perimeter firewall',
      ],
      answer: 1,
      explain:
        'Scanners match systems against a database of known flaws, so they excel at missing patches, expired certificates and exposed services, but they cannot reason about how weaknesses combine or about what the application is supposed to allow. The business logic path is exactly the class of finding that requires a human tester with context about the process being abused.',
    },
    {
      id: 'sp4m4q7',
      domain: 'Security Operations',
      prompt:
        'The port authority wants continuous external testing of its public portal by many independent researchers, and wants to pay only for findings that turn out to be valid. Which option matches this goal?',
      choices: [
        'A scheduled penetration test with a fixed scope and rules of engagement',
        'An internal audit of the secure development process',
        'A responsible disclosure programme with a bug bounty',
        'A weekly credentialed vulnerability scan of the portal servers',
      ],
      answer: 2,
      explain:
        'A bug bounty built on a responsible disclosure channel is continuous, open to a broad researcher community and paid per valid submission, which is precisely the model described. The scheduled penetration test is the tempting answer because it also uses skilled human testers, but it is a bounded engagement paid for by the day rather than an ongoing programme paid by result.',
    },
  ],
};

export const SP4_PART2: Module[] = [sp4m3, sp4m4];
