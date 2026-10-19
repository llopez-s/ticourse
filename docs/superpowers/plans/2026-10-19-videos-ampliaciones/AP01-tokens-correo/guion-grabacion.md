# Guion para grabar · La sesión sigue abierta: identidad, permisos y tokens

**Versión definitiva** · guion congelado el 2026-10-19.

Lee de corrido y en orden, **a ritmo de conversación**: como si se lo contaras a una amiga, no como quien lee.
Entre frase y frase deja un respiro corto; los silencios se recortan solos y el vídeo se acelera un poco (×1,08) al montarlo.
Si algo sale mal, **calla un segundo y repite la oración que falló desde su principio** (no hace falta la frase entera) y sigue: el importador se queda con la última toma de cada oración.
No hagas pausas largas dentro de una frase: si necesitas respirar, termina antes la oración.
Al acabar la última frase, deja dos segundos de silencio antes de parar la grabación.
Guárdala como `video/engine/voices/tokens-correo lidia.wav`.
Lo que va entre paréntesis en cursiva es solo cómo pronunciar; la *dirección* de cada frase es orientativa.
Los mensajes interceptados y las preguntas para pensar salen en pantalla: **no se leen**. Los dominios, IP y correos tampoco: están en pantalla.

## 1. La aplicación de Ana

### La contraseña no cuenta toda la historia

**s01-01** · *con curiosidad* — Ana cambia su contraseña y la aplicación sigue mostrando correo. Vas a ver por qué puede pasar y qué necesitas comprobar.

**s01-02** · *cercana* — Estamos en un ejercicio de Halden, la autoridad portuaria. Ana usa una aplicación que resume el correo del turno. El caso es inventado.

**s01-03** · *concentrada* — No vamos a entrar en ninguna cuenta real.

**s01-04** · *tranquila* — La aplicación se llama Resumen del turno. Para explicar qué ocurre, separa dos decisiones. Una comprueba que quien entra es Ana.

**s01-05** · *segura* — La otra limita lo que la aplicación puede hacer. Son distintas, aunque aparezcan seguidas en la pantalla. **(pausa larga)**

### Entrar y tener permiso

**s02-01** · *pensativa* — Cuando el sistema comprueba quién eres, te está autenticando. Cuando decide qué puedes hacer, te está autorizando.

**s02-02** · *animada* — Ana puede demostrar su identidad perfectamente y seguir sin permiso para administrar el correo del puerto.

**s02-03** · *firme* — Piensa en un pase para una sala concreta. Que sepan quién eres no abre todas las puertas.

**s02-04** · *tranquilizadora* — Y que una aplicación tenga permiso para leer tampoco le permite enviar mensajes. Cada acción necesita la autorización que corresponda.

**s02-05** · *con curiosidad* — Aquí aparece OAuth. Es un marco para conceder acceso limitado a una aplicación sin darle la contraseña de Ana. No convierte a la aplicación en Ana.

**s02-06** · *cercana* — Le permite actuar dentro de una concesión que el sistema puede limitar. **(pausa larga)**

## 2. Quién concede el acceso

### Cuatro participantes en la misma pantalla

> *(En pantalla, no se lee: mensaje de SILENT PAGER — «Si Ana entra, mi aplicación puede hacerlo todo.». Tú contestas:)*

**s03-01** · *concentrada* — No, entrar no lo permite todo. Mira las cuatro columnas. Ana es la usuaria. Resumen del turno es la aplicación.

**s03-02** · *tranquila* — Microsoft Entra ID gestiona la identidad y emite las credenciales del acceso autorizado.

**s03-03** · *segura* — Microsoft Graph es la interfaz que recibe las peticiones al correo. La aplicación pide leer mensajes en nombre de Ana.

**s03-04** · *pensativa* — Esa concesión depende del consentimiento y las políticas del entorno de su organización.

**s03-05** · *animada* — Ana demuestra su identidad ante el servicio de identidad. La aplicación no necesita recoger su contraseña.

**s03-06** · *firme* — Después obtiene una credencial para pedir a Graph la lectura permitida. La identidad, la aplicación y el recurso siguen siendo cosas distintas. **(pausa larga)**

### ¿Qué presentarías al correo?

**s04-01** · *tranquilizadora* — Un sistema puede emitir una credencial digital para permitir una operación. La llamamos token. El de acceso se presenta al recurso.

**s04-02** · *con curiosidad* — El de renovación permite solicitar tokens nuevos al servicio que los emite. Para leer mensajes, ¿cuál presentarías a Graph?

> *(En pantalla: «Para leer correo, ¿acceso o renovación?». Deja cuatro segundos y medio de silencio; no leas las opciones.)*

**s04-03** · *cercana* — El de acceso, porque la petición va al recurso que recibe las solicitudes de correo. Graph comprueba si permite esa operación.

**s04-04** · *concentrada* — La renovación se pide al servidor de autorización.

**s04-05** · *tranquila* — En la imagen, uno es el pase limitado y el otro permite solicitar un pase nuevo. Solicitarlo no garantiza conseguirlo. El servidor puede rechazar la renovación.

**s04-06** · *segura* — No son dos llaves intercambiables, ni la segunda abre cualquier puerta. **(pausa larga)**

## 3. Qué lleva cada credencial

### Tres credenciales que se parecen desde fuera

**s05-01** · *pensativa* — La contraseña sirve para demostrar identidad ante el sistema que la verifica. Una cookie puede mantener una sesión web. Pero también puede guardar otras preferencias.

**s05-02** · *animada* — Encontrar una cookie no demuestra que hayas encontrado una sesión autenticada.

**s05-03** · *firme* — Hay además un token de identidad. Cuando se usa OpenID Connect, informa a la aplicación sobre la autenticación de la usuaria.

**s05-04** · *tranquilizadora* — Esa capa añade identidad sobre OAuth. El token de identidad no sustituye al de acceso para pedir mensajes.

**s05-05** · *con curiosidad* — Por eso la etiqueta token de Microsoft se queda corta. Necesitas saber qué artefacto es y para quién se emitió.

**s05-06** · *cercana* — También importa quién mantiene la sesión web. La aplicación puede tener una sesión propia, distinta de la del proveedor de identidad. **(pausa larga)**

### Un permiso con bordes

**s06-01** · *concentrada* — Ahora lee los límites del pase. Quién lo emite, a qué recurso va dirigido, qué permite y cuándo deja de ser válido.

**s06-02** · *tranquila* — Un token destinado a una interfaz no sirve automáticamente para todas las demás.

**s06-03** · *segura* — En el caso, la concesión permite leer correo en el contexto autorizado de Ana. No concede administración global. Tampoco permite enviar mensajes por tener lectura.

**s06-04** · *pensativa* — El recurso comprueba la credencial y decide si acepta la petición concreta.

**s06-05** · *animada* — No le pongas una hora fija por costumbre. La vigencia depende de cómo se emitió y de las políticas aplicables. Cuando caduca, la aplicación necesita otro.

**s06-06** · *firme* — Puede obtenerlo sin interacción o tener que pedir que Ana vuelva a identificarse. **(pausa larga)**

## 4. La sesión que continúa

### Después de la comprobación

> *(En pantalla, no se lee: mensaje de SILENT PAGER — «Ya pasaste el segundo factor. Ningún token robado sirve.». Tú contestas:)*

**s07-01** · *tranquilizadora* — El segundo factor no borra lo que ocurra después. La autenticación multifactor refuerza la comprobación de identidad.

**s07-02** · *con curiosidad* — Pero una credencial de sesión puede ser robada cuando esa comprobación ya terminó. Es otro momento del acceso.

**s07-03** · *cercana* — Muchos tokens de acceso pueden utilizarse por el hecho de tenerlos. Se llaman tokens de tipo bearer.

**s07-04** · *concentrada* — Aun así, deben seguir válidos y superar los controles aplicables. Hay que comprobar esos controles, no darlos por supuestos.

**s07-05** · *tranquila* — Esto no significa que cualquier token robado funcione. Puede estar caducado, revocado o limitado de otra manera. Tampoco prueba que alguien lo utilizara.

**s07-06** · *segura* — El riesgo de acceso y la evidencia de uso son conclusiones distintas. **(pausa larga)**

### ¿Qué demuestra la alerta?

**s08-01** · *pensativa* — La ficha dice que pudo exponerse un token de acceso destinado a Graph, con lectura delegada. No menciona un token de renovación.

**s08-02** · *animada* — ¿Concluyes acceso permanente a todo, o un alcance que todavía debes comprobar?

> *(En pantalla: «¿Acceso a todo o alcance por comprobar?». Deja cuatro segundos y medio de silencio; no leas las opciones.)*

**s08-03** · *firme* — Lo segundo. Hay un riesgo de lectura dentro de los permisos y la vigencia que resulten aplicables. Falta investigar si el recurso lo aceptó.

**s08-04** · *tranquilizadora* — También falta saber si había otras credenciales expuestas. La ficha no responde a todo.

**s08-05** · *con curiosidad* — Si apareciera un token de renovación, añadirías otra pregunta. ¿Se podía obtener con él un nuevo token bajo esa concesión? No asumirías acceso infinito.

**s08-06** · *cercana* — Y no comprobarías el riesgo reutilizando la credencial robada en una cuenta real. **(pausa larga)**

## 5. Explicar el riesgo

### Explicarlo sin prometer de más

**s09-01** · *concentrada* — Cuenta ahora el recorrido sin mezclar las columnas. Ana se identifica. El servicio de identidad aplica las condiciones y emite credenciales.

**s09-02** · *tranquila* — La aplicación presenta la de acceso a Graph. Graph permite las operaciones autorizadas.

**s09-03** · *segura* — Si hace falta renovar, la aplicación vuelve al servidor de autorización. Si la aplicación conserva además una sesión web, esa sesión tiene su propio funcionamiento.

**s09-04** · *pensativa* — Cerrar una de estas piezas no acredita que todas las demás estén cerradas.

**s09-05** · *animada* — Tu explicación puede ser sencilla sin ser absoluta. Di qué artefacto consta, qué recurso y permisos tiene, y qué evidencia falta.

**s09-06** · *firme* — El nombre del proveedor no amplía los permisos. Haber superado el segundo factor tampoco resuelve por sí solo un robo posterior. **(pausa larga)**

### Tres comprobaciones y una decisión

**s10-01** · *tranquilizadora* — Quédate con tres comprobaciones. Primero, identifica qué credencial tienes delante. Una contraseña, una cookie y un token no cuentan la misma historia.

**s10-02** · *con curiosidad* — Segundo, mira para quién se emitió y qué permite.

**s10-03** · *cercana* — Tercero, separa la posibilidad de acceso de la evidencia de que alguien accedió.

**s10-04** · *concentrada* — Esa diferencia evita tanto cerrar el caso demasiado pronto como anunciar un compromiso que todavía no has demostrado.

**s10-05** · *tranquila* — Abre ahora la práctica complementaria de identidad de la lección. Decide qué puedes afirmar sobre el acceso al correo de Ana.

**s10-06** · *segura* — Esta vez, antes de responder, vuelve a las cuatro columnas. Cada participante tiene su trabajo y cada credencial, su destino. **(pausa larga)**
