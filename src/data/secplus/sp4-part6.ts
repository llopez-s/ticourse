import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// SP4M11 — Forense digital y fuentes de datos para la investigación
// (SY0-701, objetivos 4.8 —forensics— y 4.9)
// ---------------------------------------------------------------------------
const sp4m11: Module = {
  id: 'sp4m11',
  sectionId: 'sp4',
  title: 'Forense digital y fuentes de datos para la investigación',
  minutes: 13,
  objectives: [
    'Explicar cuándo nace un legal hold y por qué suspende el calendario de retención y cualquier borrado automático',
    'Ejecutar una acquisition defendible: order of volatility, imagen bit a bit, hash antes y después, y análisis siempre sobre la copia',
    'Mantener una chain of custody sin huecos y reconocer qué la rompe hasta hacer la evidencia inadmisible',
    'Situar preservation, reporting y e-discovery dentro del proceso forense y del proceso legal que lo envuelve',
    'Elegir la fuente de datos que responde a cada pregunta de investigación: firewall, application, endpoint, OS security, IDS/IPS y network logs, metadata, vulnerability scans, packet captures, dashboards y automated reports',
  ],
  blocks: [
    {
      t: 'p',
      md: 'La lección anterior terminó con el incidente contenido y erradicado. Esta empieza justo donde eso deja de bastar: cuando lo ocurrido puede acabar en un juzgado, en un expediente sancionador, en una reclamación al seguro o en un despido disciplinario. Ahí las prisas operativas y las exigencias legales tiran en direcciones opuestas —operaciones quiere el servidor limpio y en producción esta noche; el abogado quiere el disco intacto— y como **analista** tu papel es garantizar que la evidencia sobreviva a ambas presiones. El objetivo 4.8 llama a esto **digital forensics** y el 4.9 le pone la materia prima: las **fuentes de datos** que sostienen cualquier investigación. El examen no te va a pedir que manejes una herramienta forense concreta; te va a pedir dos cosas muy repetibles: **el orden correcto de los pasos** y **la fuente que de verdad responde a la pregunta**.',
    },
    { t: 'h', text: 'Antes de tocar nada: legal hold, preservación y e-discovery' },
    {
      t: 'p',
      md: 'El **legal hold** (o *litigation hold*) es una orden interna que **suspende la eliminación normal** de la información que puede ser relevante para un litigio. Su detalle de examen es *cuándo* nace: no cuando llega la demanda ni cuando lo pide un juez, sino en el momento en que la organización **anticipa razonablemente** el litigio —una carta de un despacho, una reclamación formal, un incidente que previsiblemente acabará en tribunales—. Desde ese instante, el hold **prevalece sobre la política de retención**: el buzón que se purga a los 90 días deja de purgarse, la rotación de logs que borra a los 30 días se detiene, las cintas que tocaba reutilizar se apartan y la máquina virtual que iba a destruirse se congela. Destruir evidencia relevante después de ese punto —aunque lo haga un job automático que nadie recordaba— se llama *spoliation* y se castiga con sanciones y con presunciones en contra. El hold se comunica por escrito a los **custodians** (las personas que tienen la información), se acusa recibo y se levanta también por escrito cuando el caso termina. Alrededor del hold giran otros tres términos. La **preservation** es su ejecución técnica: aislar, copiar y proteger la evidencia para que nadie la altere, empezando por la regla de oro de que **el sistema afectado no se reconstruye hasta haberlo capturado**. El **e-discovery** (*electronic discovery*) es el proceso legal de identificar, recopilar, filtrar y **entregar** a la otra parte la información electrónica pertinente: aquí la organización tiene que ser capaz de encontrar lo que le piden, y por eso el inventario y la clasificación del Dominio 3 y del objetivo 4.2 vuelven a pasar factura. Y el **reporting** es el producto final del trabajo forense: un informe que documenta el alcance, las herramientas y versiones usadas, los hashes, la línea temporal reconstruida, los hallazgos y —crucial— las **limitaciones**; escrito para que una tercera persona con las mismas herramientas pueda **reproducir** el resultado, y en un lenguaje que un juez o una directora puedan leer.',
    },
    {
      t: 'check',
      q: {
        q: 'A container terminal server at the Halden Port Authority is part of an active investigation and Legal has issued a hold on the incident data. Operations asks to wipe and rebuild the server tonight to restore service. What should the analyst do?',
        choices: [
          'Rebuild the server and rely on the logs already forwarded to the SIEM',
          'Acquire and verify a forensic image of the server first, then rebuild from clean media',
          'Postpone the rebuild indefinitely until the case is closed',
          'Rebuild the server, but export the local event logs to a text file beforehand',
        ],
        answer: 1,
        explain:
          'Preservation under a legal hold requires capturing the evidence before the system is altered, and a verified bit-for-bit image lets operations rebuild the same night without losing anything. Exporting the event logs is the tempting shortcut, but it abandons memory artefacts, deleted files, timestamps and unallocated space that the image would have preserved.',
      },
    },
    { t: 'h', text: 'Adquisición: orden de volatilidad, imagen bit a bit y hashes' },
    {
      t: 'p',
      md: 'La **acquisition** es la captura de la evidencia, y tiene dos reglas que el examen premia una y otra vez. La primera es el **order of volatility**: se recoge antes lo que antes desaparece. El orden práctico va de la **memoria RAM y la cache** (registros, procesos en ejecución, conexiones abiertas, claves de cifrado y código inyectado que solo vive ahí) a las **tablas de estado y conexiones de red**, de ahí a los **procesos y archivos temporales**, después al **disco**, luego a los **logs remotos y backups** y por último a la documentación en papel o los archivos históricos. La consecuencia incómoda es que **apagar o desconectar la máquina destruye la parte más valiosa** de la evidencia: si el escenario dice que el equipo sigue encendido y hay autorización para recoger, se captura memoria primero. La segunda regla es que se trabaja **sobre la copia**. Se conecta un **write blocker**, se calcula el **hash del original**, se genera una **imagen bit a bit** (sector a sector, incluido el espacio no asignado y los ficheros borrados, no una copia de carpetas), se **vuelve a hashear** la imagen y el original, y solo si los tres valores coinciden se acepta la copia como idéntica. El original vuelve al precinto y todo el análisis ocurre en una copia de trabajo, que además puede reproducirse tantas veces como haga falta.',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Extracto de formulario de cadena de custodia + verificación de integridad',
      text: `CADENA DE CUSTODIA — CASO IR-2026-0147  (Autoridad Portuaria de Halden)
Evidence ID:   HPA-EV-003
Descripcion:   SSD 512 GB, portatil de operaciones, S/N 8FQ2ZT3, terminal de contenedores
Incautado:     2026-09-04 04:12 CEST · sala de control, muelle 3
Incautado por: M. Aalto (SOC, credencial 2211)   Testigo: J. Rekola (Asesoria juridica)
Adquisicion:   Imagen bit a bit con bloqueador de escritura (write blocker WB-04)
Fichero:       HPA-EV-003.E01  (12 fragmentos, 476 GiB)

  #   Fecha/hora (CEST)   Entregado por     Recibido por        Motivo / ubicacion
  1   2026-09-04 04:12    (incautacion)     M. Aalto            Precinto 0091, bolsa antiestatica
  2   2026-09-04 05:40    M. Aalto          R. Sandoval (Lab)   Adquisicion de la imagen
  3   2026-09-04 09:55    R. Sandoval       Caja fuerte SOC     Custodia, precinto 0114
  4   2026-09-05 11:20    Caja fuerte SOC   R. Sandoval         Analisis (sobre la COPIA)

VERIFICACION DE INTEGRIDAD
  sha256(original, pre-adquisicion)   9f2b7c...41d0   registrado 05:41
  sha256(datos adq. HPA-EV-003.E01)       9f2b7c...41d0   calculado  07:58   -> MATCH
  sha256(original, post-adquisicion)  9f2b7c...41d0   registrado 08:02   -> MATCH
  Conclusion: la imagen es identica al original y el original no se altero durante
  la copia. Todo el analisis posterior se realiza sobre la copia de trabajo.`,
    },
    {
      t: 'p',
      md: 'Ese formulario es la **chain of custody**: el registro de **quién** tuvo la evidencia, **cuándo**, **de quién la recibió**, **a quién se la entregó** y **por qué**, desde el segundo de la incautación hasta la sala del juicio. Debe ser **ininterrumpida**: cada hueco sin justificar —una noche en un cajón sin cerrar, una entrega sin firma, un traslado sin anotar— permite sostener que la evidencia pudo alterarse, y con eso basta para que sea **inadmisible** por muy impecable que sea el análisis técnico. Se apoya en controles físicos aburridos y decisivos: bolsas antiestáticas **precintadas** con número de precinto anotado, etiquetas con identificador único, almacenamiento en caja fuerte o armario de evidencias con acceso restringido y registrado, fotografías del estado inicial y **relojes sincronizados** para que las horas del formulario, de los logs y del sistema cuenten la misma historia. Los hashes y la cadena de custodia se complementan: el **hash** demuestra que los **datos** no cambiaron; la **cadena** demuestra que el **objeto físico** estuvo siempre bajo control. Ninguno de los dos sustituye al otro.',
    },
    {
      t: 'check',
      q: {
        q: 'During verification, the SHA-256 of the working image does not match the hash recorded from the original drive before acquisition. What does this tell the analyst?',
        choices: [
          'The original drive was lawfully altered, so the case has to be dropped',
          'The image is acceptable as long as the chain of custody form is signed by both parties',
          'The image cannot be relied on as an exact copy, so the acquisition must be repeated and the discrepancy documented',
          'The algorithm is too weak for forensic work and should be replaced with MD5',
        ],
        answer: 2,
        explain:
          'Hashing before and after exists precisely so that a mismatch is detected: it proves the copy is not bit-for-bit identical, so the image loses its evidentiary value and the acquisition has to be redone and the anomaly recorded. The signed custody form is the tempting distractor because it is also an integrity control, but it documents possession of the physical item and cannot vouch for the fidelity of the copy.',
      },
    },
    { t: 'h', text: 'Fuentes de datos: cada pregunta tiene su log' },
    {
      t: 'p',
      md: 'Una investigación se gana eligiendo bien dónde mirar. El objetivo 4.9 lista las fuentes que CompTIA espera que sepas emparejar con una pregunta. Los **firewall logs** registran la decisión de la frontera: origen, destino, puerto, protocolo y **allow o deny**, con lo que responden a «con quién habló este host y se le dejó». Los **application logs** guardan la lógica de negocio —quién inició sesión en la aplicación, qué transacción ejecutó, qué exportó, qué error devolvió— y son insustituibles cuando la pregunta es sobre **lo que se hizo dentro** del sistema, no sobre la red. Los **endpoint logs** (incluidos los de **EDR**) reconstruyen la máquina por dentro: creación de procesos con su **proceso padre**, línea de comandos, **hash** del ejecutable, escritura de ficheros, cambios de persistencia. Los **OS-specific security logs** —el Security log de Windows, `auth.log` o los eventos de `auditd` en Linux— son los que responden a preguntas de **autenticación y autorización**: qué cuenta inició sesión, de qué tipo (interactiva, de red, de servicio), desde qué equipo, cuántos intentos fallaron antes, qué privilegio se usó, qué cuenta se creó o se añadió a un grupo. Los **IDS/IPS logs** aportan la interpretación: qué firma o anomalía se disparó, sobre qué tráfico y si se bloqueó o solo se registró. Los **network logs** cubren el resto de la infraestructura —conmutadores, routers, proxies, DHCP, DNS y registros de flujo tipo **NetFlow**—, que son sobre todo **metadatos** de conversación: quién habló con quién, cuánto y durante cuánto tiempo, pero no el contenido. Y la **metadata** propiamente dicha es la capa que describe a los datos sin ser los datos: propiedades de un documento (autor, fecha de creación y modificación), **EXIF** de una fotografía, **cabeceras de correo** con los servidores que lo retransmitieron, o el nombre, tamaño y marcas de tiempo de un fichero. Muchas veces es la metadata, y no el contenido, la que demuestra el fraude.',
    },
    {
      t: 'table',
      headers: [
        'Pregunta de la investigación',
        'Fuente que la responde',
        'Por qué las demás se quedan cortas',
      ],
      rows: [
        [
          '¿Con qué direcciones externas habló este host la semana pasada y se permitió o se denegó la conexión?',
          'Firewall logs',
          'El endpoint ve el proceso pero no la decisión del perímetro; el IDS solo registra lo que casó con una firma; una captura iniciada hoy no contiene la semana pasada.',
        ],
        [
          '¿Qué proceso lanzó el binario malicioso, con qué línea de comandos y qué hash tenía?',
          'Endpoint / EDR logs',
          'El firewall solo vio la conexión saliente; el log del sistema operativo registra el logon, no la cadena padre-hijo de procesos.',
        ],
        [
          '¿Qué cuenta inició sesión interactiva a las 03:12 y falló antes varias veces?',
          'OS-specific security logs',
          'Los application logs solo conocen los inicios de sesión de la aplicación; el EDR puede no conservar todos los eventos de autenticación del sistema.',
        ],
        [
          '¿Qué datos salieron realmente dentro de una sesión sin cifrar?',
          'Packet capture',
          'NetFlow y los network logs dan volumen, duración y extremos —metadatos—, nunca contenido; el firewall solo dice que se permitió.',
        ],
        [
          '¿Quién aprobó y exportó el manifiesto de carga, y con qué parámetros?',
          'Application logs',
          'El sistema operativo ve el proceso ejecutándose; la red ve una sesión cifrada; ninguno de los dos entiende la transacción de negocio.',
        ],
        [
          '¿Se detectó este patrón de ataque en la red y a qué hora se disparó?',
          'IDS/IPS logs',
          'El firewall aplica reglas, no firmas ni análisis de anomalías; el dashboard muestra el recuento agregado, no el evento concreto.',
        ],
        [
          '¿Cuándo se creó este documento, con qué cuenta y por qué servidores pasó el correo que lo envió?',
          'Metadata (propiedades de fichero, EXIF, cabeceras de correo)',
          'El contenido del documento no lo dice; los application logs no existen si el fichero se creó fuera de la organización.',
        ],
        [
          '¿Ese servidor ya tenía sin parchear la vulnerabilidad explotada antes del incidente?',
          'Vulnerability scans (histórico de escaneos)',
          'Los logs cuentan lo que ocurrió, no qué agujero existía; el informe forense del disco lo confirmaría mucho más despacio.',
        ],
        [
          '¿Cómo resumo dos semanas de actividad y de tendencia para el comité de dirección?',
          'Automated reports y dashboards',
          'Los logs en crudo y las capturas son ilegibles para ese público y no muestran evolución; sirven de soporte, no de comunicación.',
        ],
      ],
    },
    {
      t: 'p',
      md: 'Las cuatro últimas fuentes del objetivo 4.9 merecen un matiz. Los **vulnerability scans** son también evidencia histórica: un escaneo de hace tres semanas puede demostrar que la vulnerabilidad explotada ya estaba señalada y sin corregir, lo que cambia la conversación sobre responsabilidad. Los **automated reports** y los **dashboards** son **capas de presentación**: agregan y resumen para que la tendencia sea visible y para que la dirección o la auditoría reciban algo digerible, pero **no son la evidencia**; en una investigación sirven para orientar la búsqueda, nunca para sustituir el log de origen del que salieron. Y los **packet captures** son el extremo opuesto: contenido completo, por lo que responden a preguntas que ninguna otra fuente puede responder, a cambio de tres limitaciones que el examen adora —solo existen **si alguien estaba capturando** en ese punto en ese momento, ocupan un volumen enorme que obliga a retenciones cortas, y frente a tráfico **cifrado** te devuelven de nuevo solo metadatos—. Sobre todo ello planea un requisito transversal: sin **sincronización horaria** (NTP) y sin una **retención** suficiente, la correlación entre fuentes se vuelve imposible, y la mejor evidencia del mundo no sirve si el log que la confirmaba rotó hace nueve días.',
    },
    {
      t: 'check',
      q: {
        q: 'The investigation must establish which external IP addresses a suspicious host contacted over the past week, and whether each connection was allowed or denied at the perimeter. Which source answers this?',
        choices: [
          'Firewall logs',
          'The application log of the port community system',
          'The SIEM executive dashboard',
          'A packet capture started this morning',
        ],
        answer: 0,
        explain:
          'Firewall logs record source and destination addresses, ports and the allow or deny verdict for every connection crossing the perimeter, which is exactly the question being asked, and they cover the whole week. The packet capture is the tempting distractor because it carries far more detail per connection, but it only started this morning and therefore holds nothing about the previous week.',
      },
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen: los seis reflejos del 4.8 forense y del 4.9',
      md: 'Uno: **la imagen primero, el análisis sobre la copia**. Cualquier opción que trabaje sobre el original, arranque el equipo afectado o «revise rápido» las carpetas antes de adquirir la imagen es incorrecta. Dos: **hash antes y después**; los valores coincidentes son la prueba de integridad, y un hash que no cuadra invalida la copia, no la valida por tener firmas. Tres: la **chain of custody** tiene que ser ininterrumpida —un solo hueco documental convierte la evidencia en **inadmisible**—, y responde a la pregunta «¿quién la tuvo?», mientras que el hash responde a «¿cambiaron los datos?». Cuatro: el **legal hold** nace cuando el litigio es **razonablemente previsible**, no cuando llega la demanda, y **prevalece sobre la política de retención**: si el enunciado menciona un borrado automático, la respuesta es suspenderlo. Cinco: **order of volatility** — memoria y cache antes que disco; si la máquina sigue encendida, apagarla destruye evidencia. Seis: en el 4.9 la pregunta siempre es *qué fuente responde a esto*; memoriza los pares **metadatos vs contenido** (NetFlow o network logs frente a **packet capture**), **red vs máquina** (firewall frente a **endpoint/EDR**), **sistema vs aplicación** (**OS security log** para logons frente a **application log** para transacciones) y recuerda que **dashboards y automated reports no son evidencia**, solo presentación.',
    },
    {
      t: 'p',
      md: 'Con esta lección cierras el Dominio 4 completo: has endurecido los sistemas, gestionado los activos y las vulnerabilidades, montado la monitorización y las capacidades de defensa, ordenado las identidades y los accesos, automatizado lo repetitivo, respondido al incidente y —ahora— preservado la evidencia que lo demuestra. Y el propio proceso forense te empuja hacia el último dominio: quien decide que existe un legal hold, cuánto tiempo se retiene un log, quién es el **owner** de un dato, qué riesgo se acepta y qué obligación regulatoria hay que notificar no es el SOC, sino el **gobierno** de la organización. El **Dominio 5, Security Program Management and Oversight**, es exactamente eso: políticas, estándares y procedimientos; estructuras de gobernanza y roles de **owner**, **controller** y **processor**; el ciclo completo de **gestión del riesgo** con su análisis de impacto y sus estrategias de tratamiento; la **gestión de terceros** y sus contratos; el cumplimiento y la privacidad con sus consecuencias legales; las auditorías y las evaluaciones internas y externas; y la **concienciación** de las personas. Es el dominio que explica **por qué** existían todos los controles que has estudiado —y el que convierte a la analista técnica en alguien capaz de defender una decisión ante dirección, ante una auditora y, si hace falta, ante un juez.',
    },
  ],
  quiz: [
    {
      id: 'sp4m11q1',
      domain: 'Security Operations',
      prompt:
        'A workstation at the Halden Port Authority is confirmed compromised and is still powered on. The response team has authorization to collect evidence. Following the order of volatility, which source should be acquired FIRST?',
      choices: [
        'The contents of the system hard drive',
        'Archived backup tapes holding last month copies of the workstation',
        'The contents of RAM and cache, including running processes and open network connections',
        'Firewall logs already forwarded to the central SIEM',
      ],
      answer: 2,
      explain:
        'The order of volatility says to collect first whatever disappears soonest, and memory and cache vanish the moment the machine loses power, taking running processes, injected code, open connections and in-memory keys with them. The hard drive is the tempting distractor because it holds the bulk of the evidence, but disk contents survive a shutdown and can be imaged later, so taking them first would trade recoverable data for data lost forever.',
    },
    {
      id: 'sp4m11q2',
      domain: 'Security Operations',
      prompt:
        'The port authority receives a letter from a law firm announcing that a claim over a cargo damage incident is being prepared. The mail platform purges messages older than 90 days automatically. What should the organization do, and when?',
      choices: [
        'Issue a legal hold immediately, suspending the automatic purge for the custodians and data in scope',
        'Wait until the claim is formally filed in court, then export the relevant mailboxes',
        'Continue applying the retention policy as written, because a documented schedule is a defence in itself',
        'Stop all deletion across every system in the organization until the matter is resolved',
      ],
      answer: 0,
      explain:
        'The duty to preserve begins as soon as litigation is reasonably anticipated, so the legal hold goes out at once and overrides the routine deletion schedule for the custodians and data involved. Waiting for the formal filing is the tempting distractor because it sounds procedurally cautious, but the 90-day purge would destroy relevant messages in the meantime, and that is spoliation.',
    },
    {
      id: 'sp4m11q3',
      domain: 'Security Operations',
      prompt:
        'At a hearing, defence counsel demonstrates that an evidence drive spent one night in an unlocked drawer, with no entry in the custody log between two documented transfers. The forensic analysis itself is technically sound and the image hashes match. What is the MOST likely consequence?',
      choices: [
        'None, because the matching hashes prove the evidence was not modified',
        'The drive simply has to be re-imaged and the report resubmitted',
        'Only the timeline reconstruction is weakened; the remaining findings stand',
        'The evidence can be challenged as inadmissible, because the chain of custody is broken',
      ],
      answer: 3,
      explain:
        'Chain of custody must account for every holder and every transfer without gaps, and an unexplained period means nobody can testify that the item was not tampered with, which is enough to have it excluded. Matching hashes is the tempting distractor, but a hash only proves that the image matches the drive as it was when hashed; it says nothing about what happened to the physical drive while it was unaccounted for.',
    },
    {
      id: 'sp4m11q4',
      domain: 'Security Operations',
      prompt:
        'An analyst is about to acquire a suspect laptop for a case that may reach court. Which sequence BEST describes a defensible acquisition?',
      choices: [
        'Boot the laptop, copy the relevant folders to an evidence share, and hash the copied folders',
        'Attach a write blocker, hash the original, create a bit-for-bit image, hash the image and the original again, and analyse only the working copy',
        'Create a bit-for-bit image, analyse the original for speed, and hash both once the investigation ends',
        'Take a logical backup of the user profile, encrypt it, and place the laptop in the evidence safe',
      ],
      answer: 1,
      explain:
        'A defensible acquisition images the drive sector by sector through a write blocker and hashes before and after, so matching values prove the copy is identical and the original was never altered, and every subsequent step happens on the working copy. Imaging and then analysing the original is the tempting distractor because an image does exist, but examining the original changes it and destroys the value of the copy that was just made.',
    },
    {
      id: 'sp4m11q5',
      domain: 'Security Operations',
      prompt:
        'Investigators must establish exactly which customer records were transmitted to an external host during an unencrypted session. Flow records already show the connection, its duration and 240 MB transferred. Which data source answers the question?',
      choices: [
        'A packet capture covering that session',
        'NetFlow records kept with a longer retention period',
        'The firewall log entry for the outbound rule that allowed the traffic',
        'The most recent vulnerability scan of the source host',
      ],
      answer: 0,
      explain:
        'Only a full packet capture stores payload, so it is the single source that can show the actual records that crossed the wire during a cleartext session. NetFlow is the tempting distractor because it already told the team who talked to whom and how much moved, but flow data is metadata by design and never contains content, no matter how long it is retained.',
    },
    {
      id: 'sp4m11q6',
      domain: 'Security Operations',
      prompt:
        'The team needs to determine which account logged on interactively to a Windows server at 03:12, whether failed attempts preceded it, and which workstation the logon came from. Which log answers this MOST directly?',
      choices: [
        'The application log of the cargo management software',
        'The perimeter firewall log',
        'The IPS log for the server segment',
        'The operating system security log on that server',
      ],
      answer: 3,
      explain:
        'OS-specific security logs record authentication events with the account, the logon type, the source host and the preceding failures, which is precisely what the question asks for. The firewall log is the tempting distractor because it can show a connection reaching the server, but it identifies addresses and ports, not which account authenticated or whether earlier attempts failed.',
    },
    {
      id: 'sp4m11q7',
      domain: 'Security Operations',
      prompt:
        'A contract PDF is alleged to have been created after the tender deadline and sent from a spoofed address. Which source will MOST directly establish when the file was created and which servers relayed the message?',
      choices: [
        'The text of the document and of the message body',
        'File and email metadata, including document properties and message headers',
        'The mail gateway dashboard showing message volume for that day',
        'The endpoint log of the workstation that is claimed to have sent it',
      ],
      answer: 1,
      explain:
        'Metadata is the layer that describes the data rather than being it: document properties carry creation and modification timestamps and the authoring account, and the Received headers record every server that relayed the message. The endpoint log is the tempting distractor because it can show a process writing a file, but it will not exist at all if the document was created outside the organization, and it never reveals the mail relay path.',
    },
    {
      id: 'sp4m11q8',
      domain: 'Security Operations',
      prompt:
        'Analysts know a malicious binary executed on a terminal operator workstation. They need the parent process that launched it, the hash of the executable and the command line that was used. Which data source is the best fit?',
      choices: [
        'Network logs from the switch serving that VLAN',
        'The automated weekly security summary report',
        'Endpoint detection and response logs from that workstation',
        'The vulnerability scan of the workstation performed last month',
      ],
      answer: 2,
      explain:
        'Endpoint and EDR logs record process creation with parent-child relationships, command lines and file hashes, which is exactly the chain the analysts are trying to rebuild. The vulnerability scan is the tempting distractor because it concerns the same host, but it reports weaknesses that existed at scan time and says nothing about what actually executed during the incident.',
    },
  ],
};

export const SP4_PART6: Module[] = [sp4m11];
