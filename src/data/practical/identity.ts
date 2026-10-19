import { check, code, complement, h, links, list, p, table, type LessonExpansion } from './shared';

const MS = 'https://learn.microsoft.com/en-us/';
export const IDENTITY_EXPANSIONS: Record<string, LessonExpansion> = {
  sp4m8: {
    minutes: 18,
    objectives: [
      'Base: distinguir autenticación, autorización y credenciales de sesión; explicar emisor, destinatario, permisos y caducidad de un token',
      'Complementario: seguir un acceso delegado a Microsoft Graph y razonar el riesgo de un token robado después de MFA',
    ],
    blocks: [
      h('Base · Identidad y sesiones desde cero'),
      p('**Autenticar** es comprobar quién solicita acceso: por ejemplo, Ana demuestra su identidad al iniciar sesión. **Autorizar** es decidir qué puede hacer esa identidad: Ana puede leer su buzón, pero no administrar el puerto. Una autenticación correcta no concede todos los permisos. La **autenticación multifactor (MFA)** combina factores de categorías distintas para reforzar esa comprobación.'),
      p('Un **token** es un artefacto emitido por un sistema en el que otro componente confía. Comunica afirmaciones o una concesión de acceso; no es necesariamente legible ni tiene siempre el mismo formato. En una autorización con **OAuth 2.0**, el servidor de autorización emite tokens para que una aplicación acceda a un recurso bajo condiciones. OAuth delega acceso; **OpenID Connect (OIDC)** añade una capa de autenticación sobre OAuth. No debes inferir que cualquier cadena denominada token sirve para cualquier servicio.'),
      table(['Artefacto', 'Quién lo emite / quién lo recibe', 'Finalidad y límite'], [
        ['Contraseña', 'Se establece con el servicio de identidad; la verifica el sistema de autenticación', 'Secreto para demostrar identidad. No describe por sí sola qué API ni qué permisos autoriza.'],
        ['Access token (token de acceso)', 'Servidor de autorización → aplicación → API destinataria', 'Concesión de acceso de duración limitada. La API valida que le corresponde y que permite la operación solicitada.'],
        ['Refresh token (token de renovación)', 'Servidor de autorización → aplicación; se devuelve al servidor de autorización', 'Permite solicitar nuevos tokens bajo la política vigente. No se envía a la API del correo; puede caducar o ser revocado.'],
        ['ID token (token de identidad)', 'Proveedor de identidad OIDC → aplicación cliente', 'Informa a la aplicación sobre la autenticación del usuario. Su destinataria es la aplicación; no sustituye un access token para leer correo.'],
        ['Cookie de sesión', 'Servicio web / aplicación → navegador', 'Mantiene una sesión web. Una cookie es un mecanismo del navegador: puede transportar un identificador opaco u otro dato. No equivale automáticamente a un token OAuth.'],
      ]),
      p('Para interpretar un token de acceso necesitas conocer **emisor**, **recurso destinatario**, **permisos**, **caducidad** y condiciones de uso. El destinatario o audiencia indica para qué API se emitió; un permiso de lectura no autoriza escritura. Al caducar, la aplicación debe obtener otro token: quizá pueda renovar sin interacción o quizá se exija autenticar de nuevo. El servidor puede denegar la renovación. No presupongas que todos los tokens duran una hora ni que todos son documentos JSON decodificables.'),
      p('Muchos access tokens son **bearer**: quien los posee puede presentarlos mientras sigan siendo válidos y se cumplan los controles aplicables. MFA protege el momento de autenticación; no vuelve inutilizable por sí sola una credencial de sesión robada después. Restricciones del dispositivo, vinculación del token, políticas y revocación pueden limitar el abuso, pero deben comprobarse. Robado no significa necesariamente utilizable, y utilizable no demuestra que haya sido utilizado.'),
      check('Authentication vs authorization: Ana signs in with MFA but cannot delete another team’s mailbox. Why?', [
        'MFA automatically grants administrator permissions', 'Authentication establishes identity; authorization still limits actions',
        'An ID token grants access to every API', 'A refresh token is the user’s password',
      ], 1, 'MFA refuerza la autenticación; los permisos siguen determinando las acciones permitidas. No concede administración. El ID token informa a la aplicación sobre el inicio de sesión, y un refresh token es una credencial distinta de la contraseña.', false),
      complement('Microsoft 365 y Microsoft Graph'),
      p('**Microsoft Graph** es la API que permite a aplicaciones autorizadas trabajar con recursos de Microsoft 365. En este ejemplo ficticio, Ana usa **Resumen del turno**, una aplicación que muestra asuntos de su correo laboral. **Microsoft Entra ID** actúa como proveedor de identidad y servidor de autorización. El **buzón** es el recurso al que se accede a través de Graph. Son responsabilidades distintas, aunque varias pertenezcan al mismo proveedor.'),
      table(['Participante', 'Responsabilidad en el caso'], [
        ['Ana, usuaria', 'Inicia el acceso y tiene un buzón. Su identidad no es la aplicación.'],
        ['Resumen del turno, aplicación cliente', 'Solicita acceso delegado y presenta a Graph el access token recibido. No necesita conocer la contraseña de Ana.'],
        ['Entra ID, proveedor de identidad y servidor de autorización', 'Autentica a Ana, aplica políticas y emite tokens según la autorización concedida.'],
        ['Microsoft Graph, API del recurso', 'Valida el acceso y permite solo operaciones autorizadas sobre el buzón. No recibe el refresh token.'],
      ]),
      list(
        'Ana abre Resumen del turno. La aplicación la dirige al servicio de identidad para iniciar sesión; allí puede exigirse MFA. La aplicación no recoge su contraseña.',
        'La aplicación solicita permiso delegado Mail.Read para leer mensajes en nombre de Ana. La concesión depende del consentimiento válido y de las políticas del tenant, el entorno organizativo de Microsoft. Iniciar sesión y conceder acceso son decisiones distintas.',
        'Tras el flujo autorizado, la aplicación obtiene un access token destinado a Graph. Si se usa OIDC puede recibir también un ID token dirigido al cliente. Si se solicitó offline_access y el flujo y la política lo permiten, puede obtener un refresh token.',
        'La aplicación pide los mensajes a Graph. Graph comprueba el token y los permisos. Mail.Read delegado permite lectura en el contexto autorizado de Ana; no convierte a la aplicación en administradora global ni permite enviar mensajes por tener permiso de lectura.',
        'Cuando el token de acceso caduca, la aplicación puede pedir otro al servidor de autorización usando el refresh token. La renovación no supone repetir MFA en cada petición, y puede fallar por revocación o política. La sesión propia de la aplicación tiene su ciclo de vida.',
      ),
      code('Flujo conceptual · sin tokens ni llamadas reales', 'Ana → Resumen del turno → Entra ID: inicio de sesión y autorización\nEntra ID → aplicación: access token para Graph (+ otros tokens según el flujo)\nAplicación → Graph: solicitud de lectura de /v1.0/me/messages\nGraph → aplicación: mensajes permitidos\nAplicación → Entra ID: renovación si está permitida'),
      p('**Caso resuelto.** Se sospecha que un stealer copió un access token de Graph de la aplicación de Ana. Paso 1: identificar qué artefacto era; la etiqueta «token Microsoft» es insuficiente. Paso 2: determinar destinatario, permisos, vigencia y controles a partir de registros autorizados. Paso 3: buscar actividad compatible, aplicaciones implicadas y alcance. Con Mail.Read podría haber riesgo de lectura mientras el token fuese aceptado; no puedes concluir envío de correo, administración ni renovación indefinida. Si lo copiado fuera un refresh token, habría que evaluar además la posibilidad de obtener nuevos access tokens. No se prueba su uso presentando la credencial robada.'),
      check('Práctica · Solo consta un access token destinado a Graph con lectura delegada del correo. ¿Qué juicio es defendible?', [
        'El atacante tiene acceso permanente a todos los servicios Microsoft', 'MFA garantiza que el token no puede ser utilizado',
        'Hay riesgo acotado por permisos, vigencia y controles; falta investigar uso y posible renovación', 'Cambiar la contraseña prueba que ya no hay riesgo',
      ], 2, 'La concesión está acotada y la evidencia de uso se busca en registros. Ni el nombre Microsoft amplía la audiencia a todos sus servicios, ni MFA neutraliza todo robo posterior. Cambiar la contraseña puede ayudar, pero no prueba revocación inmediata de todas las sesiones y tokens.'),
      links('Continuar el caso', [
        { label: 'sp2m6 · Qué puede robar un infostealer', href: '/learn/sp2m6' },
        { label: 'sp4m10 · Responder a un robo de sesión', href: '/learn/sp4m10' },
      ]),
      links('Documentación oficial · consultada el 19-10-2026', [
        { label: 'Microsoft · Autenticación y autorización en Graph', href: `${MS}graph/auth/auth-concepts` },
        { label: 'Microsoft · Access tokens', href: `${MS}entra/identity-platform/access-tokens` },
        { label: 'Microsoft · Refresh tokens', href: `${MS}entra/identity-platform/refresh-tokens` },
        { label: 'Microsoft · ID tokens', href: `${MS}entra/identity-platform/id-tokens` },
        { label: 'Microsoft · Listar mensajes y permisos', href: `${MS}graph/api/user-list-messages?view=graph-rest-1.0` },
      ]),
    ],
  },
  sp2m6: {
    minutes: 7,
    objectives: ['Base: reconocer el robo de información por infostealers y separar evidencia de exposición, acceso y uso'],
    blocks: [
      h('Base · Infostealers: qué se roba y qué demuestra'),
      p('Un **infostealer** es malware orientado a robar información del dispositivo: por ejemplo, credenciales guardadas, datos del navegador o archivos. Sus capacidades varían por familia y versión. Que una muestra sea clasificada como stealer no demuestra que extrajera todos esos datos en un incidente concreto. Separa **capacidad** del malware, **exposición** de datos y **uso posterior** por terceros.'),
      table(['Artefacto descrito en una alerta', 'Conclusión acotada', 'Lo que aún no sabemos'], [
        ['Contraseña guardada', 'Podría permitir un nuevo inicio de sesión si sigue vigente', 'Si funciona, si fue cambiada, si hay MFA u otros controles, o si se utilizó.'],
        ['Cookie de sesión', 'Podría exponer una sesión web existente y evitar repetir el inicio de sesión', 'Servicio emisor, caducidad, vinculación, revocación y aceptación efectiva. No todas las cookies son de autenticación.'],
        ['Access token', 'Podría dar acceso a la API destinataria con los permisos concedidos mientras sea aceptado', 'Audiencia, permisos, vigencia y evidencia de uso. No implica conocer la contraseña.'],
        ['Refresh token', 'Podría permitir solicitar nuevos tokens según el cliente, concesión y políticas', 'Si sigue válido o si los controles impiden renovarlo. No prueba acceso perpetuo.'],
        ['Registro anunciado por un vendedor', 'Es una afirmación que necesita procedencia y corroboración', 'Autenticidad, fecha, duplicación y correspondencia con un equipo real. Un anuncio no prueba un incidente nuevo.'],
      ]),
      p('**Caso ficticio Halden.** Una alerta de equipo describe un stealer y un listado externo menciona una cuenta del puerto. Paso 1: conservar la alerta y validar dispositivo y fecha. Paso 2: identificar si el listado solo contiene un usuario o si documenta un artefacto de autenticación. Paso 3: revisar evidencia autorizada de extracción y actividad de identidad. Paso 4: responder al alcance conocido y a la incertidumbre, sin intentar extraer o reutilizar credenciales. No atribuyas automáticamente cada acción posterior a la familia de malware.'),
      check('An endpoint alert identifies an infostealer. What can the analyst conclude immediately?', [
        'Every stored token has been used successfully', 'All passwords and sessions are certainly invalid now',
        'The device needs investigation; capability alone does not prove which artifacts were stolen or used', 'Only a password change is required',
      ], 2, 'La detección justifica investigar y contener según el procedimiento. No identifica por sí sola los datos extraídos ni su uso, y tampoco revoca nada. Cambiar la contraseña omite el dispositivo comprometido y las sesiones potencialmente expuestas.', false),
      links('Conectar conceptos y respuesta', [
        { label: 'sp4m8 · Tokens, cookies, MFA y ejemplo Graph', href: '/learn/sp4m8' },
        { label: 'sp4m10 · Contención y revocación según el escenario', href: '/learn/sp4m10' },
      ]),
    ],
  },
  sp4m10: {
    minutes: 10,
    objectives: ['Base: coordinar contención del equipo, alcance y respuesta de identidad', 'Complementario: distinguir revocación de renovación, access tokens y sesiones propias de aplicaciones Microsoft'],
    blocks: [
      h('Base · Responder al robo de credenciales y sesiones'),
      p('Un dispositivo con un stealer puede volver a robar credenciales si lo sigues usando. La respuesta combina **contención del equipo** y **contención de identidad**, coordinadas con el equipo de respuesta a incidentes. Conserva evidencias y registra cada cambio. El alcance incluye cuentas, navegadores, aplicaciones y recursos potencialmente expuestos; no termina en la primera contraseña encontrada.'),
      list(
        'Contener el dispositivo mediante el procedimiento autorizado, preservar evidencias y evaluar otros equipos o cuentas relacionados. Preparar la recuperación desde un entorno confiable.',
        'Construir una línea temporal: detección, posible extracción, autenticaciones, accesos al recurso y cambios en aplicaciones. Las horas, la retención y los huecos de registro limitan la conclusión.',
        'Revisar actividad de identidad y aplicaciones: inicios de sesión, accesos anómalos, consentimientos, permisos delegados o de aplicación, credenciales de aplicaciones y reglas de correo según el caso. Una IP nueva aislada no prueba abuso.',
        'Cambiar secretos expuestos y revocar sesiones o credenciales según el artefacto y el emisor. Si el riesgo lo requiere, restringir temporalmente el acceso o deshabilitar la cuenta. Revocar un consentimiento sospechoso no sustituye todas las demás acciones.',
        'Comprobar después la eficacia de los controles, restaurar o reinstalar el equipo según el procedimiento y vigilar recurrencia. No cerrar el incidente únicamente porque se pulsó un botón de revocación.',
      ),
      table(['Escenario', 'Acción que se debe valorar', 'Comprobación pendiente'], [
        ['Contraseña expuesta', 'Cambiarla desde un entorno confiable y revisar reutilización en otros servicios', 'Sesiones existentes y otras credenciales no quedan necesariamente cubiertas.'],
        ['Cookie o sesión web expuesta', 'Invalidar las sesiones en el servicio que las gestiona', 'La sesión del proveedor de identidad y la de la aplicación pueden ser diferentes.'],
        ['Access token expuesto', 'Aplicar controles del emisor y del recurso; evaluar restricción de acceso', 'Un token ya emitido puede seguir aceptándose hasta caducidad o intervención compatible.'],
        ['Refresh token expuesto', 'Revocar la capacidad de renovación según el emisor y revisar actividad posterior', 'La renovación denegada no demuestra que todo access token ya emitido haya dejado de funcionar.'],
        ['Aplicación o consentimiento comprometido', 'Revisar permisos, retirar la concesión abusiva y rotar credenciales de aplicación si procede', 'El acceso de una aplicación sin usuario no depende de la contraseña de ese usuario.'],
      ]),
      complement('Revocación en Microsoft'),
      p('En Microsoft Entra ID, **revokeSignInSessions** invalida los refresh tokens y cookies de sesión del usuario gestionados por ese servicio. Puede haber un retraso de unos minutos. No garantiza por sí solo el cierre de todas las sesiones que las aplicaciones hayan emitido por su cuenta; las cuentas externas requieren considerar su tenant de origen. Los access tokens ya emitidos y las sesiones de aplicaciones necesitan atención específica.'),
      p('La **evaluación continua del acceso (CAE)** permite que recursos y clientes compatibles reaccionen a ciertos eventos antes de la caducidad ordinaria. No presupongas que cualquier recurso o cliente la soporta, ni una revocación universal e instantánea. Los efectos de cambiar una contraseña varían según el tipo de token, el cliente y la acción de restablecimiento. Por eso «contraseña cambiada» no equivale a «todos los tokens invalidados inmediatamente».'),
      p('**Caso resuelto.** Halden aísla el equipo de Ana y cambia su contraseña desde otro dispositivo confiable. Paso 1: el equipo queda contenido, pero falta la identidad. Paso 2: se revocan las sesiones del servicio de identidad y se revisan permisos y consentimientos de Resumen del turno. Paso 3: se examinan accesos a Graph y las sesiones propias de la aplicación durante la ventana de riesgo. Paso 4: se verifica la revocación y se mantiene vigilancia según los tiempos y registros disponibles. Si hubo acceso de aplicación sin usuario, la respuesta incluye sus credenciales y permisos; resetear la contraseña de Ana no lo resuelve.'),
      check('Práctica · Tras cambiar la contraseña de Ana, ¿qué evidencia permite cerrar mejor el caso?', [
        'El correo de confirmación del cambio, sin revisar nada más', 'El simple transcurso de una hora para cualquier token',
        'Revocación y controles verificados, revisión de actividad y aplicaciones, equipo recuperado y límites documentados', 'Probar el token robado en Graph',
      ], 2, 'La respuesta debe acreditar efectos y alcance, con seguimiento. Un correo de cambio no acredita cierre de sesiones; una hora no es una caducidad universal. Reutilizar la credencial expuesta añade riesgo y no forma parte de esta práctica defensiva.'),
      links('Referencia y fundamentos', [
        { label: 'sp4m8 · Identidad, autorización y sesiones', href: '/learn/sp4m8' },
        { label: 'Microsoft · Revocar acceso en una emergencia', href: `${MS}entra/identity/users/users-revoke-access` },
        { label: 'Microsoft · revokeSignInSessions', href: `${MS}graph/api/user-revokesigninsessions` },
        { label: 'Microsoft · Tabla de revocación de refresh tokens', href: `${MS}entra/identity-platform/refresh-tokens` },
        { label: 'Microsoft · Evaluación continua del acceso', href: `${MS}entra/identity/conditional-access/concept-continuous-access-evaluation` },
      ]),
    ],
  },
};
