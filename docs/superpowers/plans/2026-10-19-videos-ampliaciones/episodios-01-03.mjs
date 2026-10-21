// Fuente editorial. La hoja de grabación y la ficha se generan desde estos textos.
export const EPISODES_01_03 = [
  {
    id: 'AP01', slug: 'tokens-correo', track: 'secplus', lessons: ['sp4m8'],
    sfx: { 'fx-mail': 'mail', 'fx-lock': 'lock', 'fx-error': 'error', 'fx-check': 'check', 'fx-ping': 'ping2' },
    title: 'La sesión sigue abierta: identidad, permisos y tokens',
    promise: 'Seguir el acceso al correo y distinguir qué permite cada credencial.',
    adversary: 'SILENT PAGER',
    concepts: ['Autenticación y autorización', 'Participantes de OAuth', 'Access, refresh e ID token', 'Audiencia, permisos y vigencia', 'MFA y robo posterior de sesión'],
    analogy: 'Un pase limitado para una sala y una autorización para pedir otro; nunca una llave maestra.',
    chapters: ['La aplicación de Ana', 'Quién concede el acceso', 'Qué lleva cada credencial', 'La sesión que continúa', 'Explicar el riesgo'],
    sources: ['Microsoft Graph: autenticación y autorización', 'Microsoft: access tokens', 'Microsoft: refresh tokens', 'Microsoft: ID tokens', 'Microsoft: scopes OIDC', 'Microsoft Graph: listar mensajes'],
    omitted: 'Flujos OAuth de implementación, formato interno de tokens, permisos de aplicación sin usuario y configuración real del tenant. El ejercicio de respuesta continúa en AP02.',
    scenes: [
      {
        title: 'La contraseña no cuenta toda la historia',
        visual: 'Sello permanente «Práctica complementaria · datos ficticios». Halden, ejercicio de formación sin fecha de incidente. Ana abre Resumen del turno. Dos preguntas separadas: quién eres / qué permite la aplicación. Título antes de 12 s. No mostrar credenciales ni un JWT de ejemplo.',
        text: [
          'Ana cambia su contraseña y la aplicación sigue mostrando {fx-mail}correo. Vas a ver por qué puede pasar y qué necesitas comprobar.',
          'Estamos en un ejercicio de Halden, la autoridad portuaria. Ana usa una aplicación que resume el correo del turno. El caso es inventado. No vamos a entrar en ninguna cuenta real.',
          'La aplicación se llama Resumen del turno. Para explicar qué ocurre, separa dos decisiones. Una comprueba que quien entra es Ana. La otra limita lo que la aplicación puede hacer. Son distintas, aunque aparezcan seguidas en la pantalla.',
        ],
      },
      {
        title: 'Entrar y tener permiso',
        visual: 'Ana se identifica ante el servicio de identidad. Un pase de lectura abre una sala concreta; la sala de administración queda cerrada. Definiciones en orden. La analogía termina aquí: el servicio aplica controles técnicos, no un vigilante humano.',
        card: 'Autenticar identifica; autorizar limita acciones',
        text: [
          'Cuando el sistema comprueba quién eres, te está autenticando. Cuando decide qué puedes hacer, te está autorizando. Ana puede demostrar su identidad perfectamente y seguir sin permiso para administrar el correo del puerto.',
          'Piensa en un pase para una sala concreta. Que sepan quién eres no abre todas las puertas. Y que una aplicación tenga permiso para leer tampoco le permite enviar mensajes. Cada acción necesita la autorización que corresponda.',
          'Aquí aparece OAuth. Es un marco para conceder acceso limitado a una aplicación sin darle la contraseña de Ana. No convierte a la aplicación en Ana. Le permite actuar dentro de una concesión que el sistema puede limitar.',
        ],
      },
      {
        title: 'Cuatro participantes en la misma pantalla',
        visual: 'Cuatro columnas persistentes: Ana / Resumen del turno / Entra ID / Microsoft Graph. Animar solicitud, autenticación y concesión. Mostrar Mail.Read solo en pantalla. No presentar consentimiento y autenticación como una sola acción.',
        intercept: 'Si Ana entra, mi aplicación puede hacerlo todo.',
        text: [
          'No, entrar no lo permite todo. Mira las cuatro columnas. Ana es la usuaria. Resumen del turno es la aplicación. Microsoft Entra ID gestiona la identidad y emite las credenciales del acceso autorizado.',
          'Microsoft Graph es la interfaz que recibe las peticiones al correo. La aplicación pide leer mensajes en nombre de Ana. Esa concesión depende del consentimiento y las políticas del entorno de su organización.',
          'Ana demuestra su identidad ante el servicio de identidad. La aplicación no necesita recoger su contraseña. Después obtiene una credencial para pedir a Graph la lectura permitida. La identidad, la aplicación y el recurso siguen siendo cosas distintas.',
        ],
      },
      {
        title: '¿Qué presentarías al correo?',
        visual: 'Mantener cuatro columnas. Pregunta con dos opciones «Access token» / «Refresh token», sin color de respuesta antes de terminar la pausa. Después iluminar aplicación → Graph para acceso y aplicación → Entra ID para renovación.',
        think: { q: 'Para leer correo, ¿acceso o renovación?', choices: ['Token de acceso', 'Token de renovación'], answer: 0 },
        card: 'Acceso a la API; renovación ante el emisor',
        text: [
          'Un sistema puede emitir una credencial digital para permitir una operación. La llamamos token. El de acceso se presenta al recurso. El de renovación permite solicitar tokens nuevos al servicio que los emite. Para leer mensajes, ¿cuál presentarías a Graph?',
          'El de acceso, porque la petición va al recurso que recibe las solicitudes de correo. Graph comprueba si permite esa operación. La renovación se pide al servidor de autorización.',
          'En la imagen, uno es el pase limitado y el otro permite solicitar un pase nuevo. Solicitarlo no garantiza conseguirlo. El servidor puede rechazar la renovación. No son dos llaves intercambiables, ni la segunda abre cualquier puerta.',
        ],
      },
      {
        title: 'Tres credenciales que se parecen desde fuera',
        visual: 'Tabla separada: contraseña / cookie de sesión / ID token. Identificar emisor y destinatario de cada uno. Resaltar «no toda cookie autentica» y «ID token dirigido al cliente». No usar material real ni secuencias con aspecto de token utilizable.',
        text: [
          'La contraseña sirve para demostrar identidad ante el sistema que la verifica. Una cookie puede mantener una sesión web. Pero también puede guardar otras preferencias. Encontrar una cookie no demuestra que hayas encontrado una sesión autenticada.',
          'Hay además un token de identidad. Cuando se usa OpenID Connect, informa a la aplicación sobre la autenticación de la usuaria. Esa capa añade identidad sobre OAuth. El token de identidad no sustituye al de acceso para pedir mensajes.',
          'Por eso la etiqueta token de Microsoft se queda corta. Necesitas saber qué artefacto es y para quién se emitió. También importa quién mantiene la sesión web. La aplicación puede tener una sesión propia, distinta de la del proveedor de identidad.',
        ],
      },
      {
        title: 'Un permiso con bordes',
        visual: 'Ficha conceptual sin datos de token: emisor=Entra ID; destinatario=Graph; permiso delegado=Mail.Read; vigencia=según emisión y política. El botón enviar permanece deshabilitado. Un reloj representa caducidad sin fijarla en una hora universal.',
        card: 'Destinatario, permisos y vigencia acotan el acceso',
        text: [
          'Ahora lee los límites del pase. Quién lo emite, a qué recurso va dirigido, qué permite y cuándo deja de ser válido. Un token destinado a una interfaz no sirve automáticamente para todas las demás.',
          'En el caso, la concesión permite leer correo en el contexto autorizado de Ana. No concede administración global. Tampoco permite enviar mensajes por tener lectura. El recurso comprueba la credencial y decide si acepta la petición concreta.',
          'No le pongas una hora fija por costumbre. La vigencia depende de cómo se emitió y de las políticas aplicables. Cuando {fx-lock}caduca, la aplicación necesita otro. Puede obtenerlo sin interacción o tener que pedir que Ana vuelva a identificarse.',
        ],
      },
      {
        title: 'Después de la comprobación',
        visual: 'MFA al inicio; después, emisión y uso del token. Separar robo hipotético posterior de prueba de uso. Contrato de lectura del buzón visible. Mensaje firmado por SILENT PAGER como atajo de método, no como confesión del caso de septiembre.',
        intercept: 'Ya pasaste el segundo factor. Ningún token robado sirve.',
        text: [
          'El segundo factor no borra lo que ocurra después. La autenticación multifactor refuerza la comprobación de identidad. Pero una credencial de sesión puede ser {fx-error}robada cuando esa comprobación ya terminó. Es otro momento del acceso.',
          'Muchos tokens de acceso pueden utilizarse por el hecho de tenerlos. Se llaman tokens de tipo bearer. Aun así, deben seguir válidos y superar los controles aplicables. Hay que comprobar esos controles, no darlos por supuestos.',
          'Esto no significa que cualquier token robado funcione. Puede estar caducado, revocado o limitado de otra manera. Tampoco prueba que alguien lo utilizara. El riesgo de acceso y la evidencia de uso son conclusiones distintas.',
        ],
      },
      {
        title: '¿Qué demuestra la alerta?',
        visual: 'Alerta sintética: «posible exposición de un access token de Graph con lectura delegada». Pregunta «¿Acceso a todo o alcance por comprobar?». Tras la pausa, abrir solo la zona de lectura y dejar interrogación en uso/renovación.',
        think: { q: '¿Acceso a todo o alcance por comprobar?', choices: ['Acceso a todo', 'Alcance por comprobar'], answer: 1 },
        card: 'Exposición no demuestra uso ni acceso permanente',
        text: [
          'La ficha dice que pudo exponerse un token de acceso destinado a Graph, con lectura delegada. No menciona un token de renovación. ¿Concluyes acceso permanente a todo, o un alcance que todavía debes comprobar?',
          'Lo segundo. Hay un riesgo de lectura dentro de los permisos y la vigencia que resulten aplicables. Falta investigar si el recurso lo aceptó. También falta saber si había otras credenciales expuestas. La ficha no responde a todo.',
          'Si apareciera un token de renovación, añadirías otra pregunta. ¿Se podía obtener con él un nuevo token bajo esa concesión? No asumirías acceso infinito. Y no comprobarías el riesgo reutilizando la credencial robada en una cuenta real.',
        ],
      },
      {
        title: 'Explicarlo sin prometer de más',
        visual: 'Reconstruir el flujo completo con cuatro participantes y dos destinos distintos para acceso/renovación. Mostrar una conclusión modelo con evidencia, alcance y pendiente. Borde complementario siempre visible.',
        card: 'El permiso concedido no prueba qué ocurrió después',
        text: [
          'Cuenta ahora el recorrido sin mezclar las columnas. {fx-check}Ana se identifica. El servicio de identidad aplica las condiciones y emite credenciales. La aplicación {fx-ping}presenta la de acceso a Graph. Graph permite las operaciones autorizadas.',
          'Si hace falta renovar, la aplicación vuelve al servidor de autorización. Si la aplicación conserva además una sesión web, esa sesión tiene su propio funcionamiento. Cerrar una de estas piezas no acredita que todas las demás estén cerradas.',
          'Tu explicación puede ser sencilla sin ser absoluta. Di qué artefacto consta, qué recurso y permisos tiene, y qué evidencia falta. El nombre del proveedor no amplía los permisos. Haber superado el segundo factor tampoco resuelve por sí solo un robo posterior.',
        ],
      },
      {
        title: 'Tres comprobaciones y una decisión',
        visual: 'Tres reglas sin tarjeta nueva: identificar artefacto / acotar permiso / buscar evidencia de uso. Acción única: checkpoint complementario de sp4m8. Créditos y descargo de CompTIA; no reproducir badges de examen.',
        text: [
          'Quédate con tres comprobaciones. Primero, identifica qué credencial tienes delante. Una contraseña, una cookie y un token no cuentan la misma historia. Segundo, mira para quién se emitió y qué permite.',
          'Tercero, separa la posibilidad de acceso de la evidencia de que alguien accedió. Esa diferencia evita tanto cerrar el caso demasiado pronto como anunciar un compromiso que todavía no has demostrado.',
          'Abre ahora la práctica complementaria de identidad de la lección. Decide qué puedes afirmar sobre el acceso al correo de Ana. Esta vez, antes de responder, vuelve a las cuatro columnas. Cada participante tiene su trabajo y cada credencial, su destino.',
        ],
      },
    ],
  },
  {
    id: 'AP02', slug: 'stealer-sesiones', track: 'secplus', lessons: ['sp2m6', 'sp4m10'],
    sfx: { 'fx-check-1': 'check', 'fx-alarm': 'alarm', 'fx-error': 'error', 'fx-lock': 'lock', 'fx-check-2': 'check' },
    title: 'Cambiar la contraseña no cierra todo: responder a un infostealer',
    promise: 'Separar lo que pudo robarse, lo que se usó y las acciones que realmente cortan el acceso.',
    adversary: 'SILENT PAGER',
    concepts: ['Capacidad, exposición y uso', 'Artefactos de autenticación distintos', 'Contención de dispositivo e identidad', 'Revocación y sesiones de aplicación', 'Verificación del alcance y recuperación'],
    analogy: 'Cerrar dos frentes del mismo incidente; la analogía del pase de AP01 solo reaparece para diferenciar permisos.',
    chapters: ['La alerta', 'Qué puede estar expuesto', 'Dos frentes de contención', 'Comprobar el corte', 'Cerrar con evidencia'],
    sources: ['Microsoft: refresh tokens', 'Microsoft: revocar acceso de emergencia', 'Microsoft Graph: revokeSignInSessions', 'Microsoft: evaluación continua del acceso'],
    omitted: 'Extracción o reutilización de credenciales, comandos administrativos, operación de tenants reales, análisis de muestras y decisiones legales de notificación.',
    scenes: [
      {
        title: 'La casilla verde', visual: 'Ejercicio independiente en Halden. Alerta ficticia de infostealer y casilla «contraseña cambiada». La ficha del equipo continúa abierta. Sin fechas, equipos ni cuentas del incidente publicado. Título y promesa antes de 12 s.',
        text: [
          'La contraseña ya está {fx-check-1}cambiada. ¿Puedes cerrar el incidente? Vas a comprobar qué falta cuando un programa roba información de un equipo.',
          'Estás en un ejercicio de respuesta de Halden, una autoridad portuaria. La {fx-alarm}alerta describe un infostealer. Es malware orientado a robar información del dispositivo. No todos estos programas buscan lo mismo, y sus capacidades cambian entre versiones.',
          'La ficha describe el equipo de Ana, datos de su navegador y su cuenta de correo. Todavía no sabemos qué salió ni si alguien lo utilizó. Necesitas separar esas preguntas para decidir cómo contener el riesgo.',
        ],
      },
      {
        title: 'Tres afirmaciones distintas', visual: 'Tres columnas: puede robar / hay evidencia de extracción / hay evidencia de uso. Mover evidencias ficticias sin rellenar automáticamente las siguientes columnas. Mostrar ausencia de datos como desconocido.',
        card: 'Capacidad, exposición y uso requieren evidencia distinta',
        text: [
          'Una ficha técnica dice que la familia puede robar contraseñas. Eso describe capacidad. Una evidencia del incidente puede mostrar que ciertos datos salieron del equipo. Eso describe exposición. Un registro del servicio puede mostrar un acceso posterior. Eso permite investigar uso.',
          'La primera afirmación no demuestra automáticamente las otras dos. Una detección en el equipo no identifica por sí sola todos los datos robados. Y un listado que alguien vende tampoco acredita un acceso reciente a tu organización.',
          'Necesitas fechas y procedencia. Un dato antiguo puede revenderse, duplicarse o estar mal atribuido. Mantén lo desconocido como desconocido. Eso no impide responder con prudencia. Impide presentar una sospecha como si ya fuera una secuencia demostrada.',
        ],
      },
      {
        title: 'No todas las credenciales abren igual', visual: 'Contraseña, cookie, access token y refresh token en filas distintas. Recurso, vigencia y controles como campos pendientes. No mostrar bytes ni secretos. El mensaje empuja una única acción insuficiente.',
        intercept: 'Con cambiar la contraseña ya has cerrado todo.',
        text: [
          'No has comprobado que todo esté cerrado. Una contraseña puede servir para iniciar una autenticación nueva. Una cookie de sesión puede mantener un acceso web existente. Un token de acceso permite operaciones sobre un recurso concreto mientras sea aceptado.',
          'Un token de renovación cumple otro trabajo. Se presenta al servidor de autorización para solicitar nuevos tokens bajo las condiciones aplicables. Si solo sabes que había credenciales, aún no sabes cuál de estas situaciones estás conteniendo.',
          'Por eso cambiar la contraseña puede ser necesario y seguir siendo insuficiente. Tampoco debes afirmar que todas las credenciales funcionan. Identifica el artefacto y su emisor. Después comprueba vigencia, permisos y controles, sin probar una credencial expuesta contra el servicio.',
        ],
      },
      {
        title: 'El equipo continúa comprometido', visual: 'Equipo afectado y dispositivo confiable separados. Dos opciones de decisión: cambiar secretos desde el afectado / contener y usar entorno confiable. Mostrar aislamiento autorizado, preservación y coordinación, sin instrucciones de extracción.',
        think: { q: '¿Cambias secretos desde el equipo afectado?', choices: ['Sí, es más rápido', 'No, usar un entorno confiable'], answer: 1 },
        card: 'Contener el equipo y proteger la identidad son dos tareas',
        text: [
          'El programa puede seguir activo. Tienes que cambiar secretos expuestos. ¿Lo harías desde el mismo equipo afectado, o prepararías un entorno confiable mientras contienes el dispositivo? Piensa también en lo que podría volver a observar el programa.',
          'Usas un entorno confiable y coordinas la contención del equipo. Si sigue comprometido, podría capturar los secretos nuevos. El procedimiento autorizado debe preservar las evidencias que hagan falta y limitar la capacidad de seguir causando daño.',
          'No confundas aislar el dispositivo con contener todas las identidades. Una sesión ya expuesta puede existir fuera de ese equipo. La respuesta tiene dos frentes. El dispositivo y las cuentas, aplicaciones y recursos que pudieron quedar afectados.',
        ],
      },
      {
        title: 'Ampliar el alcance con preguntas', visual: 'Línea temporal didáctica sin horas inventadas: posible extracción / detección / contención / accesos posteriores. Lista visual de fuentes: endpoint, identidad, aplicaciones, auditoría de correo. Un hueco de retención se marca como límite.',
        text: [
          'Construye una línea temporal con lo que sí conoces. Cuándo se detectó el programa, qué periodo pudo estar activo y qué ocurrió después. Diferencia la hora de observación de la hora en que recibiste una alerta.',
          'Revisa qué cuentas y aplicaciones estuvieron expuestas. Busca actividad de identidad y del recurso. En el correo pueden importar los accesos y cambios relevantes. En las aplicaciones, los permisos y consentimientos. Una dirección de red nueva, aislada, no basta para demostrar abuso.',
          'También registra lo que no puedes revisar. Tal vez los registros antiguos ya se hayan {fx-error}borrado al terminar su plazo de conservación. Ese hueco no demuestra que nada ocurriera. Afecta al alcance y a la confianza con que explicas el incidente. La investigación debe conservar ese límite.',
        ],
      },
      {
        title: 'Elegir la revocación que corresponde', visual: 'Matriz escenario/acción/verificación de sp4m10. Contraseña → rotación; sesión web → servicio emisor; refresh → revocación de renovación; access → controles del recurso. Consentimiento y credenciales de aplicación en fila aparte.',
        card: 'La acción depende del artefacto y del servicio emisor',
        text: [
          'Ahora eliges acciones según el escenario. Los secretos expuestos se cambian desde un entorno {fx-lock}confiable. Las sesiones se invalidan donde se gestionan. Una concesión sospechosa se revisa y retira cuando corresponde. Cada acción necesita su responsable y su comprobación.',
          'Impedir una renovación no demuestra que todos los tokens de acceso emitidos antes hayan dejado de funcionar. Y cerrar una sesión del proveedor de identidad no acredita cerrar todas las sesiones propias de las aplicaciones. Hay que comprobar ambos niveles.',
          'Si una aplicación accede sin un usuario presente, puede depender de permisos y credenciales propios. Cambiar la contraseña de una persona no los elimina. Vas cerrando las vías de acceso que indique la investigación y compruebas el efecto de cada medida.',
        ],
      },
      {
        title: 'El botón no es el resultado', visual: 'Panel conceptual Microsoft, sin interfaz real ni botones ejecutables. Revocación solicitada / efectos por verificar. Nombre revokeSignInSessions solo en pantalla. CAE con rótulo «recursos, clientes y eventos compatibles». Sin cronómetro universal de una hora.',
        intercept: 'Has pulsado revocar. Ya no necesitas mirar más.',
        text: [
          'Pulsarlo no demuestra su resultado en todas partes. En Microsoft, revocar las sesiones de inicio invalida tokens de renovación y cookies gestionadas por ese servicio. Puede haber un retraso. Las sesiones que una aplicación mantiene por su cuenta requieren atención específica.',
          'Algunos clientes y recursos compatibles pueden reaccionar a ciertos eventos antes de la caducidad ordinaria. Esa capacidad se llama evaluación continua del acceso. No significa que toda aplicación reaccione a cualquier evento ni que todo el acceso se corte al instante.',
          'También varían los efectos de cambiar una contraseña según el tipo de credencial y cómo se hizo el cambio. Por eso no sustituyas la verificación por una espera fija. Registra la acción y comprueba los efectos que deberían producirse en este escenario.',
        ],
      },
      {
        title: '¿Qué te permite avanzar?', visual: 'Dos evidencias: correo de confirmación del cambio / conjunto de controles y revisión comprobados. No presentar el segundo como garantía absoluta de ausencia. Pausa y después evidencia + límites + vigilancia.',
        think: { q: '¿Cambio confirmado o controles verificados?', choices: ['Correo de confirmación', 'Controles y actividad revisados'], answer: 1 },
        card: 'Verifica los efectos; documenta los límites',
        text: [
          'Tienes un correo que confirma el cambio de contraseña. También puedes revisar los controles aplicados, la actividad posterior y la recuperación del equipo. ¿Qué sostiene mejor una decisión de cierre? Elige la evidencia que responde al alcance investigado.',
          'El conjunto de comprobaciones. El correo confirma una acción concreta. No acredita el cierre de todas las sesiones. Necesitas valorar si las medidas fueron eficaces, qué acceso pudo persistir y qué dudas siguen abiertas por falta de datos.',
          'Eso no exige afirmar que sabes todo. Exige explicar qué verificaste y por qué puedes pasar a recuperación o cierre bajo el procedimiento del equipo. La vigilancia posterior y los criterios de reapertura también forman parte de una respuesta defendible.',
        ],
      },
      {
        title: 'Volver al caso de Ana', visual: 'Ana y Resumen del turno identificados como datos del ejercicio, sin elevarlos a incidente de GLASS HARBOR. Revisiones de equipo, identidad, Graph y sesión de aplicación separadas. Informe de conclusión breve.',
        card: 'Recuperación y cierre se apoyan en evidencia del caso',
        text: [
          'En el ejercicio de Ana, el equipo queda {fx-check-2}contenido y el cambio se hace desde otro dispositivo confiable. Después se revisan las sesiones del servicio de identidad, los permisos de la aplicación y la actividad de acceso al correo.',
          'La recuperación del equipo sigue el procedimiento autorizado. La revisión busca si las medidas funcionaron y si aparecen nuevas señales. No se reutiliza ninguna credencial expuesta para intentar entrar. El ejercicio enseña a responder, no a comprobar accesos robados.',
          'En el informe queda la diferencia entre lo confirmado, lo probable y lo que falta por observar. Así la siguiente persona entiende el alcance real. Una lista de acciones completadas ayuda, pero solo tiene sentido junto a sus efectos y sus límites.',
        ],
      },
      {
        title: 'Cerrar los dos frentes', visual: 'Tres reglas: distinguir evidencia / contener dispositivo e identidad / verificar efectos. Acción única: checkpoint complementario de sp4m10. Descargo independiente de CompTIA. Créditos de fuentes al final, sin narrar URLs.',
        text: [
          'Tres reglas para llevarte. La capacidad de robar no demuestra extracción ni uso. Aislar un equipo no cierra por sí solo todas las sesiones. Y cambiar una contraseña no prueba la invalidación inmediata de toda credencial.',
          'La respuesta une lo que le pasó al dispositivo con lo que pudieron hacer sus identidades y aplicaciones. Primero acotas el caso. Después eliges acciones adecuadas. Y antes de dar por logrado el corte, compruebas sus efectos.',
          'Ve ahora a la práctica complementaria de respuesta a incidentes. Decide qué evidencias necesitarías para cerrar el caso de Ana. Si tu respuesta solo dice contraseña cambiada, vuelve a mirar las sesiones y el equipo. Aún faltan preguntas.',
        ],
      },
    ],
  },
  {
    id: 'AP03', slug: 'feeds-requisito', track: 'gcti', lessons: ['s3m1', 's3m4', 's4m2'],
    sfx: { 'fx-mail': 'mail', 'fx-check-1': 'check', 'fx-ping': 'ping2', 'fx-error': 'error', 'fx-check-2': 'check' },
    title: 'Tres feeds, dos preguntas: comprar información que añada valor',
    promise: 'Elegir fuentes por el requisito y el valor incremental, y diseñar una decisión de renovación.',
    adversary: 'HOLLOW LANTERN',
    concepts: ['Requisito y cobertura', 'Fiabilidad y credibilidad', 'Valor incremental e independencia', 'Calidad, puntualidad y coste total', 'Piloto, aceptación y renovación'],
    analogy: 'Encargar respuestas a una pregunta concreta; no comprar más buzones llenos del mismo recorte.',
    chapters: ['La compra', 'Qué estamos midiendo', 'Comparar tres ofertas', 'Probar antes de renovar', 'La decisión'],
    sources: ['Curso: s3m1, comparación ficticia Faro/Atlas/Eco', 'Curso: s3m4, reporting de proveedores', 'Curso: s4m2, independencia y eco de feeds'],
    omitted: 'Puntuaciones universales de proveedores, tarifas reales, procesos jurídicos de contratación y recomendaciones de marcas comerciales.',
    scenes: [
      {
        title: 'Una oferta que parece ganadora', visual: 'Meridian, aeroespacial, ejercicio de compra. Tres ofertas ficticias Faro/Atlas/Eco. No usar logotipos reales. Mostrar dos sobres cerrados R1/R2 y mantener la tabla de resultados oculta hasta definir la pregunta.',
        text: [
          'Un proveedor entrega más {fx-mail}datos. Otro cuesta menos. ¿Cuál compras? Vas a elegir entre tres feeds sin confundir volumen con valor.',
          'Eres la analista de Meridian, una empresa aeroespacial. En este ejercicio comparas tres suministros de información. Los llamamos feeds porque entregan datos de forma recurrente. Faro, Atlas y Eco son inventados. No estamos recomendando marcas reales.',
          'La compra empieza antes de abrir las ofertas. Meridian necesita investigar exposición de cuentas con rapidez. También quiere buscar infraestructura en datos históricos. Son dos preguntas diferentes. Un proveedor puede ayudar mucho con una y poco con la otra.',
        ],
      },
      {
        title: 'Primero la pregunta', visual: 'R1 literal: investigar indicios sectoriales de cuentas expuestas en menos de 24 h. R2: investigar infraestructura retrospectivamente en 90 días. Matriz fuente/dato/requisito del CMF, con línea base existente visible.',
        card: 'Evalúa cada fuente contra un requisito concreto',
        text: [
          'La primera pregunta exige recibir indicios útiles antes de un día. La segunda necesita datos para mirar atrás. Esa diferencia cambia lo que valoras. Años de historial pueden servir para investigar el pasado y llegar demasiado tarde para una decisión urgente.',
          'El requisito de inteligencia deja claro para qué necesitas la fuente. Después miras la cobertura. Qué sector, regiones, plataformas y tipos de dato puede observar. Un catálogo grande no responde automáticamente a la pregunta de Meridian.',
          'Apunta también lo que ya tienes. Los registros internos, el intercambio sectorial y los feeds actuales forman tu línea base. Para justificar otra compra, necesitas saber qué añade respecto a esa base. Más documentos no siempre son más respuestas.',
        ],
      },
      {
        title: 'Conocido no significa confirmado', visual: 'Separar ficha de fuente y ficha de afirmación. Historial/acceso/método frente a evidencia/coherencia/corroboración. El mensaje del adversario no atribuye a Faro ningún fallo concreto.',
        intercept: 'Lo dice un proveedor conocido. Ya está confirmado.',
        text: [
          'Conocer al proveedor ayuda, pero no confirma cada dato. La fiabilidad de una fuente se apoya en su historial, su acceso y su método. La credibilidad de una información depende de la evidencia de esa afirmación concreta.',
          'Una fuente con buen historial puede publicar una pista débil. Una nueva puede aportar evidencia verificable. Por eso registras dos juicios. Qué confianza merece la fuente y qué sostiene este dato. No uses la reputación como sustituto de corroboración.',
          'En el informe busca periodo observado, población, método y referencias. Distingue observación propia de interpretación y cita. Si el proveedor no explica qué cuenta, no conviertas su porcentaje en una medida del mundo entero. Puede describir solo lo que sus sensores ven.',
        ],
      },
      {
        title: 'El mismo recorte en tres sobres', visual: 'Faro observa → Atlas cita → Eco reproduce → blog. Dos publicaciones no añaden una observación. Pregunta con dos opciones, origen marcado solo después. Conservar horas de entrega distintas para no borrar valor de anticipación.',
        think: { q: '¿Tres publicaciones o tres observaciones?', choices: ['Tres confirmaciones independientes', 'Una observación de origen'], answer: 1 },
        card: 'Sigue el origen; republicar no corrobora',
        text: [
          'Faro publica una observación. Atlas la cita y Eco reproduce la cita. ¿Tienes tres confirmaciones independientes o una observación que viajó por tres publicaciones? Antes de contar, sigue el origen de lo que estás leyendo.',
          'Una observación de origen conocida. Es como recibir el mismo recorte en tres sobres. Cambia el sobre, no el hecho observado. Conservas las publicaciones porque pueden añadir contexto o rapidez. Pero no multiplicas la corroboración por tres.',
          'Esto es el eco de feeds. Puede ocultar que todos dependen del mismo origen. Para medir lo nuevo, deduplicas entidades y eventos, conservando procedencia y tiempos. Dos filas con texto diferente pueden describir la misma exposición. Y dos alertas parecidas pueden corresponder a hechos distintos.',
        ],
      },
      {
        title: 'Abrimos los resultados', visual: 'Piloto ficticio de 30 días, 100 revisados por feed para R1: Faro 60 útiles/40 incrementales/10 desconocidos; Atlas 90/3/0; Eco 80/1/5. R2 incrementales Faro2/Atlas45/Eco1. Una columna a la vez; no mostrar rankings sin requisito.',
        text: [
          'Ahora sí, abre el piloto. Durante el mismo mes se revisaron cien elementos de cada feed con criterios compartidos. La tabla separa los útiles de los que además aportan algo nuevo a Meridian. A ese aporte nuevo lo llamamos incremental. Conservamos también los casos desconocidos.',
          'Faro aporta cuarenta {fx-check-1}hallazgos útiles que no estaban en la base dentro del plazo requerido. Atlas aporta tres y Eco, uno. Atlas tiene más elementos útiles en la muestra. Pero casi todos ya estaban disponibles por otras vías.',
          'Para investigar infraestructura histórica, la comparación cambia. Atlas añade cuarenta y cinco hallazgos. Los otros dos aportan mucho menos. No hemos encontrado un proveedor ganador para todo. Hemos encontrado aportaciones distintas frente a dos requisitos distintos.',
        ],
      },
      {
        title: 'El precio que no sale en la licencia', visual: 'Mostrar p95 de R1: Faro8h/Atlas36h/Eco12h. Completitud95/99/70%. Licencia900/600/200€; triaje6/4/18h mes; integración inicial8/4/2h. Definir p95 en texto y en voz. Evitar inferir p95 de R2.',
        card: 'Calidad, puntualidad y coste total importan',
        text: [
          'Mira el retraso de entrega. El percentil noventa y cinco indica el tiempo dentro del que llegó el noventa y cinco por ciento de los elementos. {fx-ping}Faro queda en ocho horas. Atlas, en treinta y seis. Para la pregunta urgente, llegar después del plazo pesa mucho.',
          'También miras si los elementos incluyen los campos necesarios y permiten rastrear la evidencia. Una dirección sin fecha ni contexto puede exigir más trabajo del que ahorra. El porcentaje de campos completos no mide cuánto del mundo ha descubierto el proveedor.',
          'Eco tiene la licencia más barata, pero revisar sus alertas exige {fx-error}dieciocho horas al mes en este ejercicio. Con Faro son seis. A la licencia le sumas integración, mantenimiento y trabajo del analista. Comprar barato y revisar lo mismo toda la semana también cuesta.',
        ],
      },
      {
        title: 'Antes de llamar éxito al piloto', visual: 'Criterios R1 fijados antes de observar resultados: ≥20 útiles incrementales, p95<24h, completitud≥90%, triaje≤8h/mes. Precio/contrato como condición separada. Símbolos solo en pantalla. Mostrar controles de calidad y adjudicación, no dar feed por verdad absoluta.',
        intercept: 'El piloto ha ido bien. Pon ahora los criterios.',
        text: [
          'Si eliges los criterios después, puedes hacer que gane quien prefieras. Acuérdalos antes de medir. Aquí se piden veinte hallazgos útiles incrementales, puntualidad suficiente y campos completos. También un esfuerzo de revisión que el equipo pueda sostener.',
          'También defines qué significa útil y cómo se resuelven los casos dudosos. Evalúas una muestra comparable. Conservas las discrepancias y los desconocidos. El propio feed no puede ser la única verdad con la que juzgas si el feed acierta.',
          'Durante el piloto registras errores de integración, indisponibilidad y cuotas. Compruebas los derechos de uso y retención. La compra necesita calidad y viabilidad. Un buen dato al que no puedes dar el uso necesario puede no resolver tu requisito.',
        ],
      },
      {
        title: 'Una decisión para cada requisito', visual: 'R1 se ilumina antes de preguntar. Opciones Faro/Atlas. Después resolución R1=Faro sujeto a presupuesto y contrato; R2=Atlas puede aportar más. Eco no se descarta por ser barato, sino por incumplimientos concretos.',
        think: { q: 'Para R1, ¿Faro o Atlas?', choices: ['Faro', 'Atlas'], answer: 0 },
        card: 'La elección depende del incremento útil y del plazo',
        text: [
          'Meridian ya recibe casi todos los datos de Atlas y necesita indicios nuevos antes de un día. Con este piloto, ¿priorizas Faro o Atlas para esa primera pregunta? No cambies el requisito a mitad de la decisión.',
          'Faro cumple los umbrales ilustrativos de incremento, rapidez, completitud y esfuerzo. La contratación sigue dependiendo del presupuesto y del contrato. Atlas puede aportar más a la investigación histórica. No se cancela una posibilidad solo porque responda peor a otra pregunta.',
          'Eco tampoco pierde por tener una licencia barata. Pierde para estos criterios porque añade muy poco, entrega campos incompletos y consume más revisión. La explicación compara evidencias con una necesidad concreta. No reparte medallas abstractas a proveedores.',
        ],
      },
      {
        title: 'La renovación cambia de base', visual: 'Mes del piloto / renovación futura sin fecha fija. Base inicial incorpora ahora otros datos; recalcular incremento. Tabla renovar/ajustar/cancelar y coste de integración hundido marcado como histórico, no obligación.',
        card: 'Renueva por valor actual, no por lo que ya pagaste',
        text: [
          'La compra de hoy no demuestra el valor del año que viene. Si otra fuente empieza a entregar lo mismo con derechos y tiempos equivalentes, el incremento cambia. Si el proveedor pierde cobertura o añade ruido, también cambia la decisión.',
          'Antes de renovar, repites una comparación con la base actual. Revisas calidad, tiempos y trabajo del equipo. Puedes renovar, ajustar o cancelar. Lo que ya costó integrar el feed no obliga a seguir pagando algo que dejó de aportar.',
          'Deja por escrito el requisito, los resultados y las limitaciones de colección. Si la evidencia depende de una sola cadena de citas, dilo. Y si no puedes evaluar una afirmación, no la conviertas en verdadera para que la tabla quede más bonita.',
        ],
      },
      {
        title: 'La compra que puedes defender', visual: 'Tres reglas: requisito primero / incremento con origen / piloto y coste total. Acción única: resolver comparación de feeds de s3m1. Aviso GCTI no afiliado, sin insignia de examen para contenido complementario.',
        text: [
          'Tres reglas. Empieza por la pregunta que hay que responder. Cuenta lo que añade la fuente, sin convertir citas en confirmaciones. Y decide con un piloto cuyos criterios y coste total estén claros antes de mirar quién gana.',
          'Así puedes explicar por qué compras {fx-check-2}Faro para una necesidad y valoras Atlas para otra. También puedes explicar por qué renovarías una fuente o dejarías de pagarla. La respuesta se apoya en utilidad observable, no en una marca ni en un porcentaje aislado.',
          'Vuelve ahora a la comparación de la lección de colección. Elige una fuente para cada requisito y escribe qué evidencia cambiaría tu elección. Si mañana cambia la base, la decisión también puede cambiar. Eso es evaluar una fuente, no casarte con ella.',
        ],
      },
    ],
  },
];
