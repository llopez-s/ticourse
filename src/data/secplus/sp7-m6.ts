import type { Module } from '../../lib/types';

/**
 * sp7m6 — Arquitectura y datos (optional SY0-801 supplement; draft objectives 3.2, 3.3, 3.4).
 * Original wording; nothing is copied from CompTIA's document. Optional checks only.
 */
export const SP7M6: Module = {
  id: 'sp7m6',
  sectionId: 'sp7',
  title: 'Arquitectura y datos',
  minutes: 25,
  objectives: [
    'Explicar los tres pilares de una Zero Trust architecture (usuario, dispositivo, acceso a la aplicación) y qué protege y qué no cada uno',
    'Situar Security Service Edge, end-to-end encrypted messaging y out-of-band management dentro de una arquitectura segura, con su límite principal',
    'Distinguir los seis roles de protección de datos (data owner, data custodian, data steward, data operator, data controller, data subprocessor)',
    'Recorrer el data management life cycle y comparar deidentification, data transpose, masking, tokenization, hashing, encryption y obfuscation',
    'Aplicar marking and labeling, geofencing, data location y data placement, y asociar cada tipo de dato con su presión de compliance',
    'Añadir autoscaling, immutability, restoration testing y capacity planning al diseño de resiliencia, y leer RTO, RPO, MTTR y MTBF como un conjunto',
  ],
  blocks: [
    {
      t: 'callout',
      kind: 'warn',
      title: 'Fuera del SY0-701 · novedad del SY0-801',
      md: 'Esta lección es material **complementario y opcional**. Los temas salen del borrador de objetivos del SY0-801 (documento v2.0, 2025), un listado **previo al lanzamiento** que puede cambiar: el examen se espera «on or around 17 November 2026», es decir, hacia el 17 de noviembre de 2026. No forma parte del SY0-701, no cuenta para tu progreso ni para ningún examen de Alertópolis, y que el 801 nombre o deje de nombrar un tema no cambia lo que cae en el 701. Alertópolis es un proyecto independiente, sin relación con CompTIA.',
    },
    {
      t: 'p',
      md: 'Los objetivos 3.2, 3.3 y 3.4 del borrador son los de **arquitectura**, **protección de datos** y **resiliencia**. Si has estudiado el Dominio 3 del 701, gran parte te sonará: Zero Trust, VPN, clasificación, backups, RTO. Lo que cambia es el **énfasis** y la lista de nombres. Esta lección recoge solo lo que el borrador pone en primer plano y que conviene mirar con calma, en tres partes: arquitectura, datos y resiliencia. En cada una aparece el mismo ejemplo de fondo: la Autoridad Portuaria de Halden, tratada de forma genérica, sin ningún dato nuevo de su historia.',
    },

    // ---------------------------------------------------------------- Parte 1
    { t: 'h', text: 'Parte 1 · Arquitectura: Zero Trust y comunicación segura' },
    {
      t: 'p',
      md: 'La **Zero Trust architecture** parte de una idea que ya conoces del 701 (sp1m3): ninguna petición es de confianza por venir de «dentro» de la red; cada acceso se decide con evidencia. El borrador la descompone en tres piezas que conviene tener separadas en la cabeza, porque cada una responde a una pregunta distinta.',
    },
    {
      t: 'p',
      md: '**User authentication** responde a «¿quién es?». Protege contra el uso de credenciales robadas porque exige pruebas fuertes y repetidas (MFA, señales de riesgo, sesiones que caducan) en lugar de una sola puerta de entrada. Su límite: demuestra la identidad, no la intención ni el estado del equipo; un usuario legítimo desde un portátil infectado sigue siendo un problema.',
    },
    {
      t: 'p',
      md: '**Device management** responde a «¿desde qué equipo?». El borrador nombra dos ejes. La **health** (salud) es el estado actual del dispositivo: parches, cifrado de disco, EDR activo, configuración conforme. El **inventory** (inventario) es saber que el dispositivo existe y es nuestro. Protege contra el equipo comprometido o no gestionado que se cuela con credenciales válidas. Su límite es doble: lo que no está en el inventario no se puede evaluar, y la salud se mide en un instante, de modo que un equipo puede comprometerse justo después de pasar la comprobación.',
    },
    {
      t: 'p',
      md: '**Application access control** responde a «¿a qué, y con qué permiso?». Se concede acceso a una aplicación concreta, con el mínimo privilegio, en lugar de a una red entera. Protege contra el movimiento lateral: quien entra a una aplicación no ve las demás. Su límite: si la política es demasiado amplia («todos los empleados, todas las apps») se queda en una puerta de red con otro nombre, y el coste de mantener las políticas finas crece con cada aplicación.',
    },
    {
      t: 'p',
      md: '**Security Service Edge (SSE)** agrupa los controles de seguridad que antes vivían en el perímetro y ahora se entregan **desde la nube**, cerca del usuario: típicamente filtrado web, control de aplicaciones en la nube y acceso Zero Trust a aplicaciones privadas, aunque el reparto exacto depende del fabricante. Si recuerdas SASE del 701 (sp3m5), SSE es la mitad de seguridad sin la mitad de red: SASE suma además la conectividad SD-WAN. Protege a las personas que trabajan fuera de la oficina con una política única, sin devolver todo su tráfico a una sede. Su límite: solo gobierna el tráfico que pasa por él (una aplicación a la que se llega por otro camino queda fuera) y deposita en un proveedor una dependencia crítica de disponibilidad.',
    },
    {
      t: 'p',
      md: 'El **end-to-end encrypted messaging** cifra el mensaje de modo que solo lo pueden leer los extremos: ni el proveedor del servicio ni la red intermedia tienen las claves. Protege la confidencialidad del contenido, por ejemplo cuando el equipo de guardia coordina un incidente por un canal que no debe leer nadie más. Sus límites son tres: un dispositivo comprometido lee el mensaje descifrado, los **metadatos** (quién habló con quién y cuándo) suelen seguir visibles, y la organización pierde parte de su capacidad de inspección, retención y e-discovery, porque tampoco ella puede abrir el contenido en el medio.',
    },
    {
      t: 'p',
      md: 'El **out-of-band management** administra los equipos por un canal **separado** del tráfico de producción: una red de gestión dedicada, un puerto de consola o un acceso independiente. Su valor aparece justo cuando la red principal falla o está bajo ataque: si un cambio de configuración corta la red, sigues pudiendo llegar al equipo para deshacerlo. Su límite: concentra mucho poder en un solo lugar, así que ese canal debe estar aislado, con MFA, registro y acceso mínimo; un canal de gestión mal protegido es la llave maestra. Ojo con el término: en el 701 también oirás «out-of-band» para verificar una petición por **otro** medio (llamar por teléfono antes de pagar una factura), y la idea común es la misma, usar un canal distinto del que puede estar comprometido.',
    },
    {
      t: 'check',
      q: {
        optional: true,
        q: 'The Halden port authority wants staff who work from home to reach cloud applications and the web with one filtering and access policy, without sending all their traffic back to a headquarters data center. Which technology best fits?',
        choices: [
          'A site-to-site IPSec tunnel to headquarters',
          'Security Service Edge delivering the security services from the cloud',
          'A bastion host placed in the DMZ',
          'End-to-end encrypted messaging for every employee',
        ],
        answer: 1,
        explain: 'SSE delivers filtering, application control and Zero Trust access from the cloud close to the user, so remote traffic is not backhauled. A site-to-site tunnel does the backhauling the requirement rejects.',
      },
    },
    {
      t: 'check',
      q: {
        optional: true,
        q: 'A configuration change on a core switch cuts the production network, and administrators can no longer reach the device to undo it. Which design choice would have kept them in control?',
        choices: [
          'A second production VLAN for administrators',
          'More aggressive health checks on the load balancer',
          'A longer password for the administrator account',
          'An out-of-band management channel separate from production traffic',
        ],
        answer: 3,
        explain: 'Out-of-band management reaches the device through a separate channel, so it still works when the production network is down. A VLAN or stronger password still depends on the same failing path.',
      },
    },

    // ---------------------------------------------------------------- Parte 2
    { t: 'h', text: 'Parte 2 · Datos: roles, ciclo de vida y técnicas' },
    {
      t: 'p',
      md: 'En el 701 ya viste owner, custodian y steward (sp3m6 y sp5m2) y también controller y processor (sp5m2). El borrador del 801 nombra seis roles: owner, custodian, steward, controller, data operator y data subprocessor. Los dos últimos no los define el borrador: vienen del lenguaje de la protección de datos personales y apuntan a una cadena de responsabilidad que sale de la organización. Una advertencia: los nombres cambian de una norma o empresa a otra, así que usa esta tabla como mapa de preguntas («¿quién decide?», «¿quién opera?», «¿quién responde?») más que como definición legal.',
    },
    {
      t: 'table',
      headers: ['Rol', 'Quién decide', 'Quién opera', 'Quién responde'],
      rows: [
        ['**Data owner**', 'Él: clasificación, quién accede, cuánto se conserva', 'Delega en otros', 'Ante la organización, de que el dato esté bien gobernado'],
        ['**Data custodian**', 'No decide el qué: aplica lo que fija el owner', 'Almacenamiento, copias, cifrado y accesos concedidos', 'De que los controles técnicos funcionen'],
        ['**Data steward**', 'Definiciones, calidad y reglas de uso del dato', 'Catálogo, metadatos, corrección de errores', 'De que el dato sea coherente y se entienda igual en todas partes'],
        ['**Data operator**', 'Nada: sigue instrucciones', 'Trata el dato en su trabajo diario, a menudo por cuenta de otro (el borrador no lo define; en algunas normas equivale al processor)', 'De usarlo según las reglas y el procedimiento'],
        ['**Data controller**', 'Para qué se tratan los datos personales y con qué medios', 'Directamente o a través de terceros', 'Ante el regulador y las personas afectadas'],
        ['**Data subprocessor**', 'Nada propio: trabaja por encargo de otro encargado', 'Parte del tratamiento, en nombre de la cadena anterior', 'Ante quien lo contrata, por contrato'],
      ],
    },
    {
      t: 'p',
      md: 'En Halden, imagina un conjunto de registros de mercancías. La dirección responsable del negocio es el **data owner**; el equipo de infraestructura es el **data custodian** (guarda, copia, cifra); una persona de operaciones que mantiene el catálogo de campos y corrige códigos mal escritos es la **data steward**; el personal de aduanas que introduce declaraciones es **data operator**. El borrador no define este rol: en algunas normas «operator» es sinónimo de processor, y en otras es quien maneja el dato a diario. Si el examen lo define, manda su definición. Si el registro incluye datos de personas, la Autoridad actúa como **data controller**; un proveedor logístico que trata esos datos por encargo es su **processor** (el término del 701), y la empresa de análisis en la nube a la que ese proveedor subcontrata una parte es un **data subprocessor**. El examen gira casi siempre en torno a una confusión: el custodian guarda, el steward da sentido, el owner decide.',
    },
    {
      t: 'check',
      q: {
        optional: true,
        q: 'At a port authority, one employee maintains the catalog that defines each customs field, fixes inconsistent codes and makes sure every department reads the data the same way. She does not decide who gets access. Which role is this?',
        choices: [
          'Data owner',
          'Data custodian',
          'Data steward',
          'Data subprocessor',
        ],
        answer: 2,
        explain: 'The steward looks after meaning and quality. The owner decides access and classification, and the custodian applies the technical controls; neither fits an employee who maintains definitions.',
      },
    },
    { t: 'h', text: 'El ciclo de vida del dato' },
    {
      t: 'p',
      md: 'El **data management life cycle** del borrador tiene cinco etapas. La utilidad práctica es preguntarse, en cada una, qué se puede romper y qué control lo evita.',
    },
    {
      t: 'table',
      headers: ['Etapa', 'Qué pasa', 'Control típico'],
      rows: [
        ['**Creation**', 'El dato nace o llega de fuera', 'Clasificar desde el origen; validar la entrada'],
        ['**Management**', 'Se almacena, se usa y se modifica', 'Control de acceso, cifrado, copias, registro de cambios'],
        ['**Distribution**', 'Se comparte con otros sistemas, socios o países', 'Cifrado en tránsito, DLP, acuerdos con terceros, geofencing'],
        ['**Retention**', 'Se conserva el tiempo que mandan negocio y normas', 'Política de conservación, legal hold, archivo'],
        ['**Disposal**', 'Se destruye cuando ya no hay motivo para guardarlo', 'Borrado seguro, destrucción de soportes, certificado de destrucción'],
      ],
    },
    {
      t: 'p',
      md: 'Dos fallos clásicos: conservar de más (cada dato guardado sin necesidad es riesgo y coste) y destruir demasiado pronto (un dato bajo obligación legal o investigación desaparece). Por eso la **retention** y el **disposal** se deciden por política, no por la prisa de quien limpia el almacenamiento.',
    },
    { t: 'h', text: 'Técnicas para proteger el dato' },
    {
      t: 'p',
      md: 'El borrador nombra ocho técnicas. Seis las conoces; las nuevas en el listado son **deidentification** y **data transpose**. La deidentification quita o altera los identificadores de un conjunto de datos para que no se pueda enlazar con una persona concreta, mediante supresión, generalización (la fecha exacta pasa a «la semana») o sustitución. Su límite es la reidentificación: cruzando datos «anónimos» con otras fuentes, a veces se vuelve a la persona. Sobre el **data transpose**, el documento lo nombra sin definirlo; aquí lo tratamos en su sentido habitual de **reordenar** el contenido (permutar posiciones de caracteres o de campos, o intercambiar filas y columnas) de modo que el original solo se reconstruye con la regla. Si el examen lo define de otra manera, manda su definición. Para ordenar todo, compara por la pregunta que más importa: ¿se puede volver al valor original?',
    },
    {
      t: 'table',
      headers: ['Técnica', 'Qué hace', '¿Reversible?', 'Uso típico'],
      rows: [
        ['**Masking**', 'Oculta parte del valor (XXXX XXXX 1234)', 'No, en la copia mostrada', 'Pantallas de soporte, entornos de prueba'],
        ['**Tokenization**', 'Sustituye el valor por un token sin sentido; el original queda en una bóveda', 'Sí, solo desde la bóveda', 'Referencias de pago'],
        ['**Hashing**', 'Calcula una huella de longitud fija', 'No (se compara, no se descifra)', 'Contraseñas almacenadas, integridad'],
        ['**Encryption**', 'Convierte el dato en ilegible sin la clave', 'Sí, con la clave', 'Datos en reposo y en tránsito'],
        ['**Obfuscation**', 'Hace el dato difícil de entender, sin garantía criptográfica', 'Depende; a menudo sí', 'Disuasión, código, ofuscar campos'],
        ['**Deidentification**', 'Quita o generaliza identificadores', 'Por diseño, no (con riesgo de reidentificación)', 'Compartir datos con investigadores'],
        ['**Data transpose**', 'Reordena el contenido según una regla', 'Sí, si se conoce la regla', 'Capa ligera de ocultación'],
        ['**Filtering**', 'Deja pasar o retiene datos según criterios', 'No aplica', 'Evitar que salgan campos sensibles'],
      ],
    },
    {
      t: 'check',
      q: {
        optional: true,
        q: 'Before giving a dataset of shipping delays to outside researchers, analysts remove names, replace exact timestamps with the week, and suppress rare vessel identifiers. Which concept best describes this work?',
        choices: [
          'Deidentification',
          'Tokenization with a secure vault',
          'Hashing for integrity',
          'Encryption at rest',
        ],
        answer: 0,
        explain: 'Removing and generalizing identifiers so records are hard to link to people is deidentification. Tokenization would keep a vault able to restore the originals, which is not what the researchers need.',
      },
    },
    { t: 'h', text: 'Manejo del dato y cumplimiento' },
    {
      t: 'p',
      md: 'El **data handling** es lo que se hace con el dato en su día a día. **Marking and labeling** pone la clasificación a la vista, en el documento y en sus metadatos, para que las personas y las herramientas de DLP sepan qué hacer sin adivinar. El **geofencing** restringe el acceso o el tratamiento según la ubicación geográfica, por ejemplo bloqueando accesos a un expediente desde fuera de ciertos países. La **data location** es dónde está físicamente el dato, que importa por la jurisdicción y las normas de residencia; la **data placement** es en qué sistema, zona o nivel de almacenamiento se coloca dentro de esa ubicación, de modo que el dato más sensible quede en el sitio mejor protegido. El borrador menciona también los **endpoints**: un dato bien gobernado en el servidor se escapa si se copia a un portátil sin cifrar.',
    },
    {
      t: 'p',
      md: 'Por último, el **compliance** cambia según el tipo de dato. El borrador lista categorías, no leyes concretas; los ejemplos de la tabla son orientativos y dependen de la jurisdicción.',
    },
    {
      t: 'table',
      headers: ['Tipo de dato', 'Ejemplo de régimen o estándar', 'Qué suele exigir'],
      rows: [
        ['**Standards**', 'Estándares sectoriales (PCI DSS, ISO 27001)', 'Controles y auditoría demostrables'],
        ['**Health data**', 'HIPAA en EE. UU.', 'Acceso mínimo necesario, registro, notificación de brechas'],
        ['**Personal information**', 'GDPR en la UE', 'Base legal, derechos de las personas, notificación'],
        ['**Financial**', 'Normas de pago y de banca', 'Protección de cuentas y tarjetas, trazabilidad'],
        ['**Child/minor data**', 'COPPA en EE. UU.', 'Consentimiento de los tutores, tratamiento restringido'],
        ['**Intellectual property**', 'Secretos comerciales, patentes, contratos', 'Confidencialidad, acuerdos y control de copias'],
        ['**Legal data**', 'Documentos bajo litigio o privilegio', 'Legal hold, cadena de custodia, no alteración'],
      ],
    },

    // ---------------------------------------------------------------- Parte 3
    { t: 'h', text: 'Parte 3 · Resiliencia: lo que se añade' },
    {
      t: 'p',
      md: 'Sitios hot, warm y cold, load balancing, clustering, UPS y generadores ya están en sp3m7. Aquí solo van las piezas que el borrador destaca. El **autoscaling** añade o retira instancias automáticamente según la demanda: protege la disponibilidad ante picos, como la llegada simultánea de varios buques, sin pagar capacidad ociosa. Sus límites: tarda en arrancar las instancias nuevas, no arregla servicios con estado, y un ataque de denegación de servicio puede disparar la factura, porque el sistema escala para atender tráfico que no debería existir.',
    },
    {
      t: 'p',
      md: 'En las copias de seguridad, el borrador subraya **retention**, **scope**, **immutability** y **restoration testing**. La **immutability** impide modificar o borrar una copia durante un periodo fijado (almacenamiento tipo WORM o bloqueo de objetos): protege frente al ransomware y frente a un administrador con credenciales robadas, que no pueden cifrar ni borrar las copias. Su límite: también conserva inmutable un dato erróneo o infectado, cuesta espacio y puede chocar con obligaciones de borrado. El **restoration testing** demuestra que la copia se puede restaurar de verdad y en el tiempo prometido; una copia que nadie ha restaurado es una hipótesis. Su límite: probar una muestra pequeña no garantiza restaurar todo en un día malo.',
    },
    {
      t: 'check',
      q: {
        optional: true,
        q: 'After a ransomware attack, the team discovers that the attacker, using a stolen administrator account, deleted the backup copies before encrypting production. Which backup property would have prevented that deletion for the retention period?',
        choices: [
          'A shorter backup interval',
          'Encryption of the backup catalog',
          'Immutability of the stored copies',
          'Compression of the backup files',
        ],
        answer: 2,
        explain: 'Immutable (WORM or object-locked) copies cannot be altered or deleted during the lock, even with administrator rights. A shorter interval or encryption does not stop deletion.',
      },
    },
    {
      t: 'check',
      q: {
        optional: true,
        q: 'The nightly backup job at the port authority has reported success for a full year, but nobody has ever restored from it. Which activity gives real evidence that recovery will meet the recovery time objective?',
        choices: [
          'Periodic restoration testing against the target RTO',
          'Keeping the backup job logs for longer',
          'Buying more storage for the backups',
          'Adding a second copy of the same job',
        ],
        answer: 0,
        explain: 'Only an actual restore shows that the data is complete and how long recovery takes. Logs, extra storage or a second copy of an untested job prove nothing about restoration.',
      },
    },
    {
      t: 'p',
      md: 'Para las **pruebas**, el borrador nombra tres: el **failover** pasa de verdad el servicio al sistema secundario; la **simulation** ensaya un escenario con el equipo, sin tocar producción; y el **parallel processing** ejecuta el entorno de recuperación a la vez que producción, para comparar resultados sin cortar el servicio. De menor a mayor riesgo para producción: simulación, procesamiento en paralelo, failover. La elección depende de cuánto pueda arriesgarse la organización en la prueba.',
    },
    {
      t: 'p',
      md: 'El **capacity planning** estima la capacidad que necesitará el negocio (personas, tecnología e infraestructura) y deja un margen, también para el escenario de recuperación. Se confunde con el autoscaling: el autoscaling es una reacción automática y de corto plazo; el capacity planning es una decisión anticipada, que mira la demanda futura y el coste. Sin plan de capacidad, el autoscaling puede toparse con un límite de cuota o de presupuesto que nadie había previsto.',
    },
    {
      t: 'p',
      md: 'Las **recovery metrics** quedan agrupadas en cuatro. Léelas como un conjunto: dos son objetivos que se prometen y dos son medidas que se observan.',
    },
    {
      t: 'table',
      headers: ['Métrica', 'Pregunta', 'Naturaleza', 'Lectura'],
      rows: [
        ['**RTO** (recovery time objective)', '¿Cuánto tarda en volver el servicio?', 'Objetivo', 'Tiempo máximo tolerable de caída'],
        ['**RPO** (recovery point objective)', '¿Cuántos datos se pierden?', 'Objetivo', 'Antigüedad máxima aceptable de la última copia'],
        ['**MTTR** (mean time to repair)', '¿Cuánto cuesta reparar de media?', 'Medida', 'Si supera el RTO, la promesa es falsa'],
        ['**MTBF** (mean time between failures)', '¿Cada cuánto falla de media?', 'Medida', 'Mide fiabilidad; guía mantenimiento y sustitución'],
      ],
    },
    {
      t: 'p',
      md: 'Con MTBF y MTTR se estima la disponibilidad: MTBF / (MTBF + MTTR). Un sistema con un MTBF de 1 000 horas y un MTTR de 4 horas está disponible aproximadamente el 99,6 % del tiempo. Para mejorar, puedes fallar menos (subir el MTBF) o reparar más deprisa (bajar el MTTR). Si el RTO acordado es de dos horas y el MTTR medido es de cinco, el diseño no cumple la promesa por más que el papel diga lo contrario; ahí es donde el restoration testing, el capacity planning y el out-of-band management se encuentran.',
    },
    {
      t: 'links',
      title: 'Complementa',
      items: [
        { label: 'Zero Trust: control plane y data plane', href: '/learn/sp1m3' },
        { label: 'Asegurar la infraestructura: colocación, zonas, failure modes y appliances', href: '/learn/sp3m4' },
        { label: 'Protección de datos: tipos, clasificaciones, estados y métodos', href: '/learn/sp3m6' },
        { label: 'Resiliencia y recuperación: HA, sitios, backups, pruebas y energía', href: '/learn/sp3m7' },
        { label: 'Gobernanza: roles sobre los datos (owner, controller, processor…)', href: '/learn/sp5m2' },
      ],
    },
  ],
  quiz: [],
};
