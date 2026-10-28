# F3 · «Quién puede hacer qué»

> **Estado: propuesta, 2026-10-28.** Sin congelar, sin escenas ni voz. Rutas relativas a la raíz del repo; `fund` =
> `src/data/security/foundations.ts`, `prac` = `src/data/security/practicals.ts`, `reg` =
> `docs/superpowers/canon/glass-harbor.md`, `plan` = `docs/superpowers/plans/2026-09-25-lesson-videos.md`. Decisiones
> comunes a los cuatro vídeos: [00-propuesta.md](00-propuesta.md) §6.

## A. Ficha didáctica

| | |
|---|---|
| **Título** | Quién puede hacer qué |
| **Título de YouTube** | Quién puede hacer qué: autenticación, autorización y permisos · Fundamentos para Security+ |
| **Pregunta central** | Si el sistema ya sabe quién eres, ¿por qué no te deja hacer algo? ¿Y cuánto acceso debería tener cada persona y cada programa? |
| **Objetivos observables** | Al terminar, quien lo ve puede: (1) ante un «acceso denegado» después de iniciar sesión, decir si falla la autenticación o la autorización; (2) explicar por qué los permisos se dan a grupos y arreglar el fallo de una cuenta sin ampliar el acceso de nadie más; (3) asignar leer, escribir o nada a cada rol según su tarea, aplicando mínimo privilegio y denegación implícita; (4) explicar que un proceso actúa con la identidad de su cuenta y elegir los permisos de una cuenta de servicio; (5) leer una línea de permisos de Linux (dueño, grupo, resto; r, w, x) y dar dos diferencias con una ACL de Windows. |
| **Prerrequisitos** | Lecciones f03 y f11 (`fund:13-16`, `fund:45-48`). Ayudan f02 (servicios) y f04 (procesos y PID). |
| **Duración estimada** | ~8:53 renderizados (1278 palabras de locución; cálculo en E.2). |
| **Práctica relacionada** | «Permisos de una carpeta» (`foundation-permissions`, `prac:131`), desde `#/security/study?view=practice&foundation=1`. Otra carpeta y otros grupos: el vídeo da el método, la práctica lo aplica. |
| **Dónde va** | Al final de f11, antes de la práctica (f03 se habrá leído antes). |
| **Conceptos clave (5)** | autenticación frente a autorización · permisos a grupos · leer, escribir, ejecutar y mínimo privilegio · procesos y cuentas de servicio · Windows y Linux, cada uno a su manera. |
| **Se queda en las lecciones** | MFA y categorías de factores, sesiones y tokens (f11), modelos de control de acceso (sp4m8), permisos del recurso compartido de red, elevación (UAC, sudo), setuid, sticky bit, la máscara de las ACL de POSIX. |

### El caso (fijo)

«Imagina · caso de entrenamiento · sin fecha · no ha pasado.» En el taller de grúas del puerto de Halden:

| Elemento | Datos en pantalla |
|---|---|
| Servidor de ficheros (Windows) | `srv-fich02` (nombre libre del canon, `reg:4494`) |
| Carpeta «Partes de avería» | ACL: Mantenimiento · Modificar (leer y escribir); Personal del taller · Lectura; Operaciones · Lectura; `svc_resumen` · Lectura. Nadie más. |
| Carpeta «Informes» | Jefatura del taller · Lectura. `svc_resumen` · Escritura, que **falta** al principio: por eso falla el resumen en s07. |
| Tu cuenta | «tu cuenta» (sin nombre), recién creada; está en Personal del taller, pero aún no en Mantenimiento. |
| El programa de resumen | proceso `resumen.exe`, PID 4120, cuenta `svc_resumen`, padre «programador de tareas»; cada viernes. |
| La copia en Linux | `drwxr-x--- 2 mant mantenimiento partes/` y `-rw-r----- 1 mant mantenimiento grua-04.txt` |

## B. Guion audiovisual por escenas

- **Carpeta** `video/quien-puede/` · perfil `principal-yt` · `"track": "secplus"` · `"lesson": "f11"` · sin adversario
  ni mensajes interceptados · voz `recording/lidia`, tempo 1 · música `Go On Going - Stayloose.mp3` ·
  `"examTiming": "sentence-end"`.
- **Sello** desde s02: «Autoridad Portuaria de Halden · imagina · caso de entrenamiento · sin fecha» y «Simulación
  educativa · datos ficticios». Sin personas con nombre: «tú», las áreas y las cuentas.
- **Hilo visual: la carpeta y su lista.** La carpeta «Partes de avería» con su lista de entradas debajo, siempre igual;
  cada escena enciende la fila que se explica. Al final se le suma la carpeta «Informes».
- **Imagen** (rotulada «imagen · no es del puerto»): el control de pasaportes y la tarjeta de embarque. Solo esa: el
  resto se ve en la lista real.
- **Datos en pantalla** (nunca en la voz): los de la tabla del caso. Los nombres de los permisos de Windows se
  escriben como en su versión en español (pendiente de confirmar, F.4).

### Capítulo 1 · Quién eres y qué puedes hacer

#### s01 · «Acceso denegado» · ~42 s · 106 palabras

- **Propósito didáctico:** la pregunta central y la promesa en 12 s; presentar el caso.
- **En pantalla:** una pantalla de inicio de sesión que acepta («Bienvenida/o» sin género: «Sesión iniciada»). El
  explorador abre «Partes de avería»; un parte nuevo, «Guardar», y el aviso «Acceso denegado». Al decir «¿Qué
  está fallando?», el título «Quién puede hacer qué» y dos chips: «¿quién eres?» · «¿qué puedes hacer?». Después, el
  taller de grúas en silueta, con el sello.
- **Acciones visuales:** el aviso tiembla una vez; el cursor se queda quieto encima.
- **Narración:**

> Inicias sesión sin problema, abres la carpeta de tu área, guardas tu primer documento y… acceso denegado. Tu contraseña era buena. ¿Qué está fallando?
> Hoy vas a separar dos preguntas que parecen la misma, quién eres y qué puedes hacer.
> Imagina que acabas de entrar en Mantenimiento, en el taller de grúas del puerto de Halden. Es tu primer día, y te acaba de pasar esto con la carpeta de los partes de avería. Ahí se apunta cada reparación de las grúas.
> Al terminar sabrás leer un permiso y decidir cuál necesita cada persona y cada programa. Y por qué nunca se arregla dando de más.

#### s02 · «Pasaporte y tarjeta de embarque» · ~47 s · 119 palabras

- **Propósito didáctico:** identidad, autenticación y autorización, con su imagen.
- **En pantalla:** «tu cuenta» como ficha; al decir «autenticación», un ✓ junto a «contraseña comprobada». Al decir
  «autorización», tres acciones de tu cuenta con su resultado: «abrir ✓ · guardar ✗ · borrar ✗». La imagen:
  un control de pasaportes (✓) y, detrás, varias puertas de embarque; la tarjeta solo abre una.
- **Acciones visuales:** la ficha de la cuenta pasa el control y se queda delante de la puerta «Partes de avería ·
  escribir», que no se abre.
- **Narración:**

> Tu cuenta es tu identidad en el sistema. Al escribir la contraseña, el sistema comprueba que eres tú. Eso es la autenticación.
> Después, cada vez que intentas algo, abrir, guardar o borrar, mira si esa identidad puede hacer eso, ahí. Eso es la autorización.
> Piensa en un aeropuerto. En el control de pasaportes comprueban quién eres, pero eso no te sube a cualquier avión.
> Para eso está la tarjeta de embarque, que dice a qué vuelo puedes subir.
> Tú has pasado el control. Si no, ni siquiera habrías entrado, y el sistema te diría que la contraseña no es buena.
> Lo que te falta es la tarjeta para escribir en esa carpeta. Así que el problema es de autorización.

- **Tarjeta de examen** (1.2): «Authentication: quién eres · Authorization: qué puedes».

#### s03 · «La carpeta que no se deja» · ~62 s · 145 palabras

- **Propósito didáctico:** permisos a grupos; el fallo de una cuenta se arregla en la cuenta. Primera pausa.
- **En pantalla:** la lista de «Partes de avería»: «Mantenimiento · leer y escribir» se ilumina; al lado, el grupo
  Mantenimiento con sus miembros en siluetas y un hueco vacío con «tu cuenta · aún no». Una cuenta atrás de altas y
  bajas: cien carpetas que habría que tocar una a una. Durante la pausa, dos botones: «Escritura para todos» y «Que te
  metan en Mantenimiento». Tras la respuesta, la opción de todos se ve en ámbar: todo el puerto, en siluetas, con un lápiz.
- **Acciones visuales:** tras la respuesta, tu ficha entra en el hueco del grupo y la puerta «escribir» se abre.
- **Narración:**

> ¿Y por qué no la tienes? Porque en el puerto los permisos no se dan persona a persona. Se dan a grupos.
> La carpeta deja escribir al grupo Mantenimiento, y tu cuenta todavía no está dentro.
> Tiene sentido. Si cada permiso fuera de una persona, cada alta, cada baja y cada cambio de puesto obligaría a tocar cien carpetas.
> Alguien propone una solución rápida, dar permiso de escritura a todo el personal del puerto. Así no vuelve a fallar. ¿Lo haces, o hay otra salida?

- **Pausa para decidir** (`think`, `holdMs` 4500): «¿Cómo lo arreglas?» · en pantalla: «Escritura para todos» /
  «Que te metan en Mantenimiento».

> No hace falta abrirla a todos. Lo que necesitas es que te metan en el grupo de Mantenimiento. Dar escritura a todos arregla tu caso y abre otro problema. Cualquier persona del puerto podría cambiar o borrar los partes.
> O sea, que el fallo de una cuenta se arregla en esa cuenta, no abriendo la carpeta a todo el mundo.

- **Tarjeta de examen** (4.6): «Permisos a grupos; cada cuenta, en el grupo de su puesto».

### Capítulo 2 · Lo justo para cada tarea

#### s04 · «Leer, escribir, ejecutar» · ~44 s · 112 palabras

- **Propósito didáctico:** los tres permisos básicos; asignarlos por tarea; denegación implícita.
- **En pantalla:** tres iconos grandes con su palabra, «leer · escribir · ejecutar», y debajo de «ejecutar», en
  pequeño, «en una carpeta: entrar o atravesar (según el sistema)». La lista completa de «Partes de avería»:
  Personal del taller · leer (por eso la abriste); Mantenimiento · leer y escribir (redacta); Operaciones · leer
  (planifica turnos); resumen · leer (lo verás). Debajo,
  una fila gris sin texto de permiso: «el resto del puerto · no aparece = no entra».
- **Acciones visuales:** cada fila se enciende junto a su motivo, en una columna «para qué».
- **Narración:**

> Ya estás en el grupo. Mira ahora la lista completa de la carpeta.
> Hay tres permisos básicos. Leer es ver el contenido. Escribir es poder cambiarlo. Y ejecutar es poner en marcha un programa.
> En una carpeta, según el sistema, ejecutar significa poder entrar en ella o atravesarla.
> Todo el personal del taller puede leer, y por eso pudiste abrirla. Mantenimiento, además, escribe, porque redacta los partes.
> Operaciones solo lee, porque los consulta para planificar los turnos de las grúas.
> Y un programa de resumen, que verás enseguida, también solo lee.
> ¿Y el resto del puerto? No aparece en la lista, así que no entra. Lo que no está concedido, se deniega.

#### s05 · «Por si acaso, no» · ~39 s · 98 palabras

- **Propósito didáctico:** mínimo privilegio, con el porqué; cerrar el capítulo.
- **En pantalla:** una petición, «Operaciones: ¿escritura, por si acaso?». A la izquierda, «qué pierde con leer:
  nada». A la derecha, dos riesgos en ámbar: un archivo arrastrado a otra carpeta sin querer, y un portátil
  cualquiera con un programa malicioso que estropea o secuestra todo lo que su cuenta puede escribir. La fila de Operaciones se queda
  en «leer».
- **Acciones visuales:** con «leer», el programa malicioso choca contra la carpeta y no cambia nada.
- **Narración:**

> Alguien de Operaciones pide escritura, por si acaso. Pero su trabajo es consultar, así que con leer no pierde nada.
> Y dársela sí trae riesgo. Un archivo arrastrado sin querer. O un programa malicioso en un portátil cualquiera, que estropea o secuestra todo lo que su cuenta puede escribir.
> Lo que no puedes escribir no lo puedes estropear.
> Eso es el mínimo privilegio. Cada uno, lo que necesita para su tarea, y nada más. Primero preguntas qué hace cada rol, y después das justo eso.
> O sea, que el permiso sale de la tarea, no de la comodidad.

- **Tarjeta de examen** (4.6): «Least privilege: lo necesario para la tarea, nada más».

### Capítulo 3 · Procesos y cuentas de servicio

#### s06 · «Los programas también tienen cuenta» · ~50 s · 128 palabras

- **Propósito didáctico:** proceso, PID, la cuenta con la que corre; cuenta de servicio y su responsable.
- **En pantalla:** un calendario con los viernes marcados; el programa de resumen lee los partes y deja un documento
  en «Informes». La lista de procesos del servidor con una fila resaltada: «`resumen.exe` · PID `4120` · cuenta
  `svc_resumen` · padre: programador de tareas». La cuenta `svc_resumen` como ficha con dos marcas: «no es de una
  persona · sin inicio de sesión interactivo» y «responsable: Sistemas».
- **Acciones visuales:** una flecha une el proceso con su cuenta y la cuenta con sus dos filas de la lista.
- **Narración:**

> Hasta ahora, personas. Pero en el servidor hay un programa que cada viernes lee todos los partes. Y deja un resumen para los jefes del taller.
> Cuando un programa está en marcha, es un proceso. Y un proceso siempre actúa con la identidad de una cuenta.
> Si abres la lista de procesos del servidor, lo ves en una fila. El programa, su número de proceso, que se llama PID, y la cuenta con la que corre.
> Este usa una cuenta de servicio, una cuenta que no es de ninguna persona, solo de ese programa. Por eso nadie debería iniciar sesión con ella a mano, y alguien tiene que responder de ella.
> La regla es sencilla. Lo que puede hacer el proceso es exactamente lo que puede su cuenta.

- **Tarjeta de examen** (4.6): «Un proceso puede lo que puede su cuenta».

#### s07 · «El viernes del resumen» · ~48 s · 108 palabras

- **Propósito didáctico:** mínimo privilegio para cuentas de servicio; segunda pausa.
- **En pantalla:** el resumen en rojo, «no puede guardar en Informes». Una propuesta: «`svc_resumen` →
  administradores». Durante la pausa, dos botones: «Administrador del servidor» / «Escribir en Informes». Tras la respuesta, en ámbar, lo que podría hacer el proceso
  con administrador: borrar «Partes de avería», tocar «Informes», el servidor entero. Después, la configuración buena,
  dos filas en verde: «Partes de avería · leer» y «Informes · escribir».
- **Acciones visuales:** una mano gris («si alguien maneja el programa») toma el proceso y llega exactamente hasta
  donde llega su cuenta, ni un paso más.
- **Narración:**

> Un viernes, el resumen falla porque no puede guardar su informe. Alguien propone meter su cuenta en administradores, que pueden con todo el servidor. ¿Qué le das a su cuenta?

- **Pausa para decidir** (`think`, `holdMs` 4500): «¿Qué le das a la cuenta del resumen?» · en pantalla:
  «Administrador del servidor» / «Escribir en Informes».

> Escribir en Informes, que es lo que le faltaba. Si el programa tiene un fallo, o alguien consigue manejarlo, hará lo que pueda su cuenta. Con administrador, podría borrar todos los partes, o tocar el servidor entero.
> El resumen necesita dos cosas, leer los partes y escribir en la carpeta de informes. Pues eso le das. Leer en una y escribir en otra.
> O sea, que una cuenta de servicio sigue el mínimo privilegio igual que una persona.

### Capítulo 4 · Windows y Linux, cada uno a su manera

#### s08 · «Windows: una lista que suma» · ~48 s · 123 palabras

- **Propósito didáctico:** la ACL de Windows: entradas por cuenta o grupo, permisos que se suman, denegación explícita,
  herencia.
- **En pantalla:** la ventana de seguridad de la carpeta en `srv-fich02`, con su lista: «Mantenimiento · Modificar»,
  «Operaciones · Lectura», «`svc_resumen` · Lectura». Un ejemplo aparte: una cuenta en dos grupos, uno con «Lectura» y
  otro con «Escritura», y el resultado «lee y escribe» (suma). Después, una entrada roja «Denegar · escribir» y el
  rótulo «en general, la denegación explícita pesa más». Al final, la subcarpeta «2026» con la lista heredada en gris
  y el rótulo «heredada».
- **Acciones visuales:** las dos filas de los dos grupos se funden en una barra que suma.
- **Narración:**

> Hasta aquí, la idea vale para cualquier sistema. La forma de aplicarla, no. Y conviene no mezclarlas.
> El servidor de ficheros del puerto es Windows. Esa lista que llevas viendo todo el vídeo tiene nombre, lista de control de acceso, o ACL. La llevan cada carpeta y cada archivo.
> Es una lista de entradas. Cada una dice una cuenta o un grupo, y lo que puede hacer.
> Si estás en dos grupos con permisos distintos, se suman. Si uno te deja leer y otro escribir, puedes hacer las dos cosas.
> También existe la denegación explícita, una entrada que le dice que no a alguien. En general, pesa más que los permisos.
> Y lo que hay dentro de una carpeta, normalmente, hereda su lista.

- **Tarjeta de examen** (4.6): «ACL: quién puede qué sobre un objeto, entrada a entrada».

#### s09 · «Linux: dueño, grupo y el resto» · ~61 s · 158 palabras

- **Propósito didáctico:** el modelo básico de Linux, que no es el de Windows: tres clases, se aplica una; la x en una
  carpeta; ACL de POSIX; root.
- **En pantalla:** la línea `-rw-r----- 1 mant mantenimiento grua-04.txt` en grande. Las nueve letras se separan en
  tres bloques con su rótulo: «dueño `rw-`» · «grupo `r--`» · «resto `---`». Después, un diagrama de decisión de tres
  pasos, «¿eres el dueño? → ¿estás en el grupo? → eres el resto», que se para en el primer sí. Un ejemplo contrario:
  un archivo cuyo dueño tiene `---` y el grupo `r--`; el dueño también está en el grupo y, aun así, no lee. Luego la
  carpeta `drwxr-x--- 2 mant mantenimiento partes/` con la `x` resaltada: «entrar». Al final, el rótulo «ACL de POSIX:
  más entradas, cuando hace falta» y una ficha de root con «se salta casi todo».
- **Acciones visuales:** el diagrama se recorre con una cuenta de Operaciones (ni dueña ni del grupo): acaba en «el
  resto» y no lee.
- **Narración:**

> Ahora, una copia de los partes en un servidor Linux. Aquí cada archivo tiene un dueño, un grupo y el resto.
> Y para cada uno, tres casillas, leer, escribir y ejecutar. Cada una es una letra, la tienes en pantalla.
> Mira esta línea. El dueño lee y escribe. El grupo, solo lee. El resto, nada.
> Y aquí va la diferencia importante. Con estas casillas, Linux no suma. Se pregunta primero si eres el dueño. Si no, si estás en el grupo. Y si tampoco, eres el resto.
> Se queda con la primera que encaja, aunque otra diera más.
> En una carpeta, la equis es poder entrar. Y cuando un solo grupo no basta, Linux también admite listas de control más completas.
> Ah, y root, el administrador de Linux, se salta casi todas estas comprobaciones. Por eso tampoco se trabaja como root por comodidad.
> O sea, que Windows suma entradas y Linux, con estas casillas, elige una sola clase.

- **Tarjeta de examen** (4.6): «Linux: dueño, grupo o resto; se aplica una sola clase».

### Capítulo 5 · Cada fallo, en su pieza

#### s10 · «Vuelta al taller» · ~37 s · 93 palabras

- **Propósito didáctico:** volver al caso resuelto; los permisos siguen al puesto.
- **En pantalla:** tu parte guardado; Operaciones lo abre en lectura; el viernes, el resumen lo recoge y deja el
  informe. La lista completa en verde. Después, tu ficha sale de Mantenimiento y entra en otro grupo; la lista no cambia.
- **Acciones visuales:** tres piezas separadas que se colocan: «identidad · grupo · permiso».
- **Narración:**

> Volvamos a tu primer día. Ya estás en Mantenimiento. Has vuelto a iniciar sesión, porque el sistema mira tus grupos al entrar, y guardas tu parte. Operaciones lo lee. El viernes, el resumen lo recoge con su cuenta de servicio.
> Y nadie tiene más de lo que necesita.
> El día que cambies de puesto, te sacarán de este grupo y te meterán en el nuevo. Los permisos siguen al puesto, no a la persona.
> O sea, que identidad, grupo y permiso son tres piezas distintas, y cada fallo se arregla en la suya.

#### s11 · «Tres reglas» · ~35 s · 88 palabras

- **Propósito didáctico:** cierre con tres reglas y una acción.
- **En pantalla:** tres tarjetas numeradas; la tarjeta final «Alertópolis · Quién puede hacer qué» con el botón
  «Práctica · Permisos de una carpeta».
- **Acciones visuales:** ninguna nueva; sin tarjeta de examen.
- **Narración:**

> Te quedas con tres reglas.
> Una. La autenticación dice quién eres, el pasaporte. La autorización, qué puedes hacer en cada sitio, la tarjeta de embarque.
> Dos. Permisos a grupos, y a cada grupo y a cada cuenta de servicio, lo justo para su tarea.
> Tres. Un proceso puede lo que puede su cuenta. Y antes de leer un permiso, mira el sistema. Windows suma, y Linux elige una sola clase.
> Ahora te toca a ti. Abre la práctica «Permisos de una carpeta» y decide qué necesita cada grupo.

## C. Texto de locución

#### Capítulo 1 · Quién eres y qué puedes hacer

Inicias sesión sin problema, abres la carpeta de tu área, guardas tu primer documento y… acceso denegado. Tu contraseña era buena. ¿Qué está fallando?

Hoy vas a separar dos preguntas que parecen la misma, quién eres y qué puedes hacer.

Imagina que acabas de entrar en Mantenimiento, en el taller de grúas del puerto de Halden. Es tu primer día, y te acaba de pasar esto con la carpeta de los partes de avería. Ahí se apunta cada reparación de las grúas.

Al terminar sabrás leer un permiso y decidir cuál necesita cada persona y cada programa. Y por qué nunca se arregla dando de más.

Tu cuenta es tu identidad en el sistema. Al escribir la contraseña, el sistema comprueba que eres tú. Eso es la autenticación.

Después, cada vez que intentas algo, abrir, guardar o borrar, mira si esa identidad puede hacer eso, ahí. Eso es la autorización.

Piensa en un aeropuerto. En el control de pasaportes comprueban quién eres, pero eso no te sube a cualquier avión.

Para eso está la tarjeta de embarque, que dice a qué vuelo puedes subir.

Tú has pasado el control. Si no, ni siquiera habrías entrado, y el sistema te diría que la contraseña no es buena.

Lo que te falta es la tarjeta para escribir en esa carpeta. Así que el problema es de autorización.

¿Y por qué no la tienes? Porque en el puerto los permisos no se dan persona a persona. Se dan a grupos.

La carpeta deja escribir al grupo Mantenimiento, y tu cuenta todavía no está dentro.

Tiene sentido. Si cada permiso fuera de una persona, cada alta, cada baja y cada cambio de puesto obligaría a tocar cien carpetas.

Alguien propone una solución rápida, dar permiso de escritura a todo el personal del puerto. Así no vuelve a fallar. ¿Lo haces, o hay otra salida?

No hace falta abrirla a todos. Lo que necesitas es que te metan en el grupo de Mantenimiento. Dar escritura a todos arregla tu caso y abre otro problema. Cualquier persona del puerto podría cambiar o borrar los partes.

O sea, que el fallo de una cuenta se arregla en esa cuenta, no abriendo la carpeta a todo el mundo.

#### Capítulo 2 · Lo justo para cada tarea

Ya estás en el grupo. Mira ahora la lista completa de la carpeta.

Hay tres permisos básicos. Leer es ver el contenido. Escribir es poder cambiarlo. Y ejecutar es poner en marcha un programa.

En una carpeta, según el sistema, ejecutar significa poder entrar en ella o atravesarla.

Todo el personal del taller puede leer, y por eso pudiste abrirla. Mantenimiento, además, escribe, porque redacta los partes.

Operaciones solo lee, porque los consulta para planificar los turnos de las grúas.

Y un programa de resumen, que verás enseguida, también solo lee.

¿Y el resto del puerto? No aparece en la lista, así que no entra. Lo que no está concedido, se deniega.

Alguien de Operaciones pide escritura, por si acaso. Pero su trabajo es consultar, así que con leer no pierde nada.

Y dársela sí trae riesgo. Un archivo arrastrado sin querer. O un programa malicioso en un portátil cualquiera, que estropea o secuestra todo lo que su cuenta puede escribir.

Lo que no puedes escribir no lo puedes estropear.

Eso es el mínimo privilegio. Cada uno, lo que necesita para su tarea, y nada más. Primero preguntas qué hace cada rol, y después das justo eso.

O sea, que el permiso sale de la tarea, no de la comodidad.

#### Capítulo 3 · Procesos y cuentas de servicio

Hasta ahora, personas. Pero en el servidor hay un programa que cada viernes lee todos los partes. Y deja un resumen para los jefes del taller.

Cuando un programa está en marcha, es un proceso. Y un proceso siempre actúa con la identidad de una cuenta.

Si abres la lista de procesos del servidor, lo ves en una fila. El programa, su número de proceso, que se llama PID, y la cuenta con la que corre.

Este usa una cuenta de servicio, una cuenta que no es de ninguna persona, solo de ese programa. Por eso nadie debería iniciar sesión con ella a mano, y alguien tiene que responder de ella.

La regla es sencilla. Lo que puede hacer el proceso es exactamente lo que puede su cuenta.

Un viernes, el resumen falla porque no puede guardar su informe. Alguien propone meter su cuenta en administradores, que pueden con todo el servidor. ¿Qué le das a su cuenta?

Escribir en Informes, que es lo que le faltaba. Si el programa tiene un fallo, o alguien consigue manejarlo, hará lo que pueda su cuenta. Con administrador, podría borrar todos los partes, o tocar el servidor entero.

El resumen necesita dos cosas, leer los partes y escribir en la carpeta de informes. Pues eso le das. Leer en una y escribir en otra.

O sea, que una cuenta de servicio sigue el mínimo privilegio igual que una persona.

#### Capítulo 4 · Windows y Linux, cada uno a su manera

Hasta aquí, la idea vale para cualquier sistema. La forma de aplicarla, no. Y conviene no mezclarlas.

El servidor de ficheros del puerto es Windows. Esa lista que llevas viendo todo el vídeo tiene nombre, lista de control de acceso, o ACL. La llevan cada carpeta y cada archivo.

Es una lista de entradas. Cada una dice una cuenta o un grupo, y lo que puede hacer.

Si estás en dos grupos con permisos distintos, se suman. Si uno te deja leer y otro escribir, puedes hacer las dos cosas.

También existe la denegación explícita, una entrada que le dice que no a alguien. En general, pesa más que los permisos.

Y lo que hay dentro de una carpeta, normalmente, hereda su lista.

Ahora, una copia de los partes en un servidor Linux. Aquí cada archivo tiene un dueño, un grupo y el resto.

Y para cada uno, tres casillas, leer, escribir y ejecutar. Cada una es una letra, la tienes en pantalla.

Mira esta línea. El dueño lee y escribe. El grupo, solo lee. El resto, nada.

Y aquí va la diferencia importante. Con estas casillas, Linux no suma. Se pregunta primero si eres el dueño. Si no, si estás en el grupo. Y si tampoco, eres el resto.

Se queda con la primera que encaja, aunque otra diera más.

En una carpeta, la equis es poder entrar. Y cuando un solo grupo no basta, Linux también admite listas de control más completas.

Ah, y root, el administrador de Linux, se salta casi todas estas comprobaciones. Por eso tampoco se trabaja como root por comodidad.

O sea, que Windows suma entradas y Linux, con estas casillas, elige una sola clase.

#### Capítulo 5 · Cada fallo, en su pieza

Volvamos a tu primer día. Ya estás en Mantenimiento. Has vuelto a iniciar sesión, porque el sistema mira tus grupos al entrar, y guardas tu parte. Operaciones lo lee. El viernes, el resumen lo recoge con su cuenta de servicio.

Y nadie tiene más de lo que necesita.

El día que cambies de puesto, te sacarán de este grupo y te meterán en el nuevo. Los permisos siguen al puesto, no a la persona.

O sea, que identidad, grupo y permiso son tres piezas distintas, y cada fallo se arregla en la suya.

Te quedas con tres reglas.

Una. La autenticación dice quién eres, el pasaporte. La autorización, qué puedes hacer en cada sitio, la tarjeta de embarque.

Dos. Permisos a grupos, y a cada grupo y a cada cuenta de servicio, lo justo para su tarea.

Tres. Un proceso puede lo que puede su cuenta. Y antes de leer un permiso, mira el sistema. Windows suma, y Linux elige una sola clase.

Ahora te toca a ti. Abre la práctica «Permisos de una carpeta» y decide qué necesita cada grupo.

## D. Actividades

### D.1 Durante el vídeo (pausas para decidir)

**Pausa 1 · s03 · «¿Cómo lo arreglas?»**

| Opción | Correcta | Feedback |
|---|---|---|
| Escritura para todos | No | Error plausible: arreglar el síntoma ampliando el acceso. Funciona para ti y deja que cualquier persona del puerto cambie o borre los partes (el error que señala f03, `fund:16`). |
| Que te metan en Mantenimiento | **Sí** | El permiso ya existe para tu puesto; lo que falta es que tu cuenta esté en el grupo. Se arregla la cuenta, no la carpeta. |

**Pausa 2 · s07 · «¿Qué le das a la cuenta del resumen?»**

| Opción | Correcta | Feedback |
|---|---|---|
| Administrador del servidor | No | Error plausible: dar de más para que algo funcione. Arregla el guardado, pero si el programa falla o alguien lo maneja, hará todo lo que pueda un administrador. |
| Escribir en Informes | **Sí** | Es justo lo que le faltaba. Con leer en «Partes de avería» y escribir en «Informes», el resumen funciona y no puede tocar nada más. |

### D.2 Después del vídeo

Formato `SCENES` de `src/data/security/video-learning.ts`: id `video-quien-puede-N`, objetivo `pre-03` (la primera) y
`pre-11` o `pre-03` (la segunda), primera `understand` y segunda `apply`.

**D.2.1 · Comprensión · la cuenta del proceso**

- **ES:** En un colegio, un programa publica cada mañana el menú del comedor en la web. Funciona como servicio con una
  cuenta que es administradora del servidor. Alguien aprovecha un fallo del programa y consigue darle órdenes. ¿Qué
  puede hacer a través de él?
- **EN:** At a school, a program publishes the canteen menu on the website every morning. It runs as a service under
  an account that is an administrator of the server. Someone exploits a flaw and gets the program to follow their
  commands. What can they do through it?

| | Opción (ES) | Option (EN) | Feedback |
|---|---|---|---|
| A | Solo lo que el programa hace cada mañana | Only what the program does every morning | El programa ya no hace solo su tarea: obedece a otra persona. El límite no es su función, es su cuenta. |
| B | **Lo que permita la cuenta con la que se ejecuta** | **Whatever its account is allowed to do** | **Correcta.** Un proceso actúa con la identidad de su cuenta. Con administrador, eso es casi todo el servidor; con lectura y escritura en una sola carpeta, muy poco. |
| C | Nada: una cuenta de servicio no inicia sesión | Nothing: a service account cannot sign in | Que no inicie sesión a mano no le quita permisos: el proceso ya está en marcha con esa cuenta. |
| D | Solo leer, porque el programa no suele escribir | Only read, because the program rarely writes | Lo que el programa suele hacer no limita lo que su cuenta puede hacer. |

- **Respuesta:** B. **Explicación:** el riesgo de una cuenta de servicio se mide por sus permisos, no por su tarea
  habitual. Por eso se le da lo justo: aquí, escribir en la carpeta del menú.

**D.2.2 · Aplicación · leer una línea de Linux**

- **ES:** En un servidor Linux de un laboratorio de análisis aparece esta línea: `-rw-r----- 1 ana tecnicos
  resultados.csv`. La cuenta `luis` pertenece al grupo `tecnicos`; la cuenta `eva`, no. Ninguna de las dos es `ana` ni
  root, y las carpetas de la ruta dejan pasar a las dos. ¿Qué pueden hacer con el archivo?
- **EN:** On a Linux server in an analysis lab you see: `-rw-r----- 1 ana tecnicos resultados.csv`. Account `luis`
  belongs to group `tecnicos`; account `eva` does not. Neither is `ana` or root, and the directories on the path let
  both through. What can they do with the file?

| | Opción (ES) | Option (EN) | Feedback |
|---|---|---|---|
| A | **`luis` lo lee; `eva` no puede abrirlo** | **`luis` can read it; `eva` cannot open it** | **Correcta.** `luis` no es el dueño pero sí del grupo: le toca `r--`. `eva` no es dueña ni del grupo: le toca el resto, `---`. |
| B | Los dos lo leen; ninguno lo puede modificar | Both can read it; neither can modify it | Acierta con `luis`, pero `eva` cae en «el resto», que no tiene ningún permiso. |
| C | `luis` lo lee y lo modifica; `eva` solo lo lee | `luis` can read and modify it; `eva` can only read it | La `w` es solo del dueño; el grupo tiene `r--` y el resto, nada. |
| D | Ninguno de los dos: solo accede la cuenta `ana` | Neither: only the `ana` account has access | El grupo también tiene lectura, y `luis` está en el grupo. |

- **Respuesta:** A. **Explicación:** se lee por bloques (dueño, grupo, resto) y se aplica el primero que encaja con la
  cuenta. Con las tres casillas básicas no se suman permisos de varias clases.

## E. Producción y accesibilidad

### E.1 Recursos

- **Reutilizados (comprobados en el repositorio):** el nombre libre `srv-fich02` (`reg:4494`); el estilo del árbol de
  procesos del EDR de V1 (`video/capas-halden/src/data/s07-edr.ts`) para la fila de s06, **sin sus datos** (son del
  incidente); iconos, tema, sellos, tarjetas y pausas del motor. **No** se reutilizan la tarjeta del inicio de sesión
  de las 01:52 (`video/iam-halden/src/scenes/parts/LogonCard.tsx`, es del incidente) ni la taquilla de V6 (imagen
  ocupada).
- **Nuevos:** la carpeta con su lista (componente propio); la ventana de seguridad de Windows simplificada; la línea
  de `ls -l` con sus tres bloques y el diagrama de decisión; la fila de la lista de procesos; la imagen del control de
  pasaportes y la tarjeta de embarque.
- **Efectos** (biblioteca del motor, `video/engine/sfx/sfx.json`): `error` en «acceso denegado» (s01), `lock` cuando
  tu ficha entra en el grupo y la puerta se abre (s03), `block` cuando el programa malicioso choca con la carpeta de
  solo lectura (s05).
- **Léxico:** ACL, POSIX, root, PID, Linux, Windows, «erre, uve doble y equis» (el guion ya lo escribe en palabras).

### E.2 Capítulos y duración (cálculo)

| Capítulo | Empieza en | Escenas |
|---|---|---|
| 1 · Quién eres y qué puedes hacer | 0:00 | s01–s03 |
| 2 · Lo justo para cada tarea | 2:31 | s04–s05 |
| 3 · Procesos y cuentas de servicio | 3:54 | s06–s07 |
| 4 · Windows y Linux, cada uno a su manera | 5:32 | s08–s09 |
| 5 · Cada fallo, en su pieza | 7:21 | s10–s11 |

| Escena | Palabras | Segundos |
|---|---|---|
| s01 «Acceso denegado» | 106 | 42 |
| s02 «Pasaporte y tarjeta de embarque» | 119 | 47 |
| s03 «La carpeta que no se deja» | 145 | 62 (incluye la pausa) |
| s04 «Leer, escribir, ejecutar» | 112 | 44 |
| s05 «Por si acaso, no» | 98 | 39 |
| s06 «Los programas también tienen cuenta» | 128 | 50 |
| s07 «El viernes del resumen» | 108 | 48 (incluye la pausa) |
| s08 «Windows: una lista que suma» | 123 | 48 |
| s09 «Linux: dueño, grupo y el resto» | 158 | 61 |
| s10 «Vuelta al taller» | 93 | 37 |
| s11 «Tres reglas» | 88 | 35 |
| **Suma de escenas** | **1278** | **513** |
| Márgenes de la tubería (entrada, transiciones, tarjeta final) | | 20 |
| **Renderizado estimado** | | **533 (8:53)** |

Cálculo: palabras / 2.7 + 2 s de aire por escena + 5.5 s por pausa para pensar (4,5 s de tarjeta y la entrada/salida), más 20 s de márgenes. Tarjetas de examen: 6. Pausas para pensar: 2. Es una estimación: con la grabación a tempo 1 la duración real puede moverse ±10 %, y se comprueba con `build-timeline --estimate` antes de congelar.

### E.3 Información visual que la voz y la transcripción tienen que contar

| Escena | Lo que solo se ve | Cómo lo cubre la voz | Línea en la transcripción |
|---|---|---|---|
| s04 | la lista completa de la carpeta | dice cada fila y su motivo | `[En pantalla: Partes de avería · Mantenimiento: Modificar; Personal del taller: Lectura; Operaciones: Lectura; svc_resumen: Lectura; nadie más]` |
| s06 | la fila del proceso | «el programa, su número de proceso… y la cuenta con la que corre» | `[En pantalla: resumen.exe, PID 4120, cuenta svc_resumen, iniciado por el programador de tareas]` |
| s07 | la configuración final | «leer en una y escribir en otra» | `[En pantalla: svc_resumen · Partes de avería: leer · Informes: escribir]` |
| s08 | la suma de grupos y la denegación | se dice | `[En pantalla: Lectura por un grupo + Escritura por otro = lee y escribe; una entrada Denegar escribir pesa más]` |
| s09 | la línea de Linux y el contraejemplo | «el dueño lee y escribe, el grupo solo lee, el resto nada… se queda con la primera que encaja» | `[En pantalla: -rw-r----- 1 mant mantenimiento grua-04.txt; drwxr-x--- 2 mant mantenimiento partes/; contraejemplo: dueño ---, grupo r--, el dueño está en el grupo y no lee]` |

## F. Revisión

### F.1 Errores conceptuales que el guion previene

| Error | Dónde se corrige |
|---|---|
| «Si la contraseña es buena, puedo hacer cualquier cosa» | s02 |
| «"Acceso denegado" significa que la contraseña está mal» | s01–s03 |
| «Para arreglar el fallo de una cuenta, se amplía el permiso a un grupo grande» | s03 (pausa 1); es el error de f03, `fund:16` |
| «Un permiso de más, por si acaso, no hace daño» | s05 |
| «Lo que no aparece en la lista tiene algún acceso por defecto» | s04 (denegación implícita, el modelo de f03, `fund:16`) |
| «Los programas no tienen identidad» o «actúan como el sistema» | s06; D.2.1 |
| «Con administrador, la cuenta de servicio deja de fallar y ya está» | s07 (pausa 2) |
| «Windows y Linux tienen el mismo modelo de permisos» | s08–s09 |
| «En Linux, los permisos de dueño, grupo y resto se suman» | s09; D.2.2 |
| «La x de una carpeta es "ejecutar la carpeta"» | s09 |
| «Trabajar como administrador o root es lo cómodo y da igual» | s07 y s09 |

**Simplificaciones conscientes:** «has vuelto a iniciar sesión, porque el sistema mira tus grupos al entrar» describe
Windows, que lee los grupos al iniciar sesión; «escribir es poder cambiarlo» (en Windows, borrar está en «Modificar» y no en
«Escritura»; en Linux, borrar un archivo depende de los permisos de la carpeta); en Windows solo se nombra la
denegación explícita «en general» (una denegación heredada puede ceder ante un permiso explícito) y no se mencionan los
permisos del recurso compartido; en Linux, root «se salta casi todas» las comprobaciones (para ejecutar necesita al
menos una x) y la máscara de las ACL de POSIX no se explica.

### F.2 Fuentes primarias

Abiertas por la revisión de exactitud del 2026-10-28: Microsoft Learn, «Order of ACEs in a DACL» y «How DACLs Control
Access to an Object» (los permisos de varias entradas se suman; las explícitas van antes que las heredadas; si nada
concede, se deniega), y `path_resolution(7)` (se aplica una sola clase; root necesita al menos un bit x para
ejecutar). Sin abrir: el resto de la lista. Los nombres de los permisos en el Windows en español no constan en ninguna
página de Microsoft encontrada: hay que mirarlos en un equipo.

- Microsoft Learn, «How DACLs Control Access to an Object» y «Order of ACEs in a DACL» (acumulación de permisos y
  orden: denegación explícita, permiso explícito, denegación heredada, permiso heredado).
- Microsoft Learn, permisos de archivos y carpetas NTFS (Control total, Modificar, Lectura y ejecución, Mostrar el
  contenido de la carpeta, Lectura, Escritura).
- Páginas de manual de Linux: `path_resolution(7)` (qué clase se aplica y cuándo) y `acl(5)` (ACL de POSIX);
  `capabilities(7)` para lo que se salta root.
- POSIX.1-2017, Base Definitions §4.5, «File Access Permissions».
- NIST SP 800-53 Rev. 5, AC-6 «Least Privilege».
- CompTIA Security+ SY0-701, objetivos 1.2 y 4.6 (documento 7.0).

### F.3 Comprobado en el repositorio frente a propuesta

| Dato | Estado |
|---|---|
| Modelo de la práctica: reglas aditivas, lo no concedido se deniega, la denegación explícita «más adelante» | comprobado: f03, `fund:16` |
| `srv-fich02`, servidor de ficheros, nombre libre | comprobado: `reg:4494` |
| Taller de grúas, carpetas, grupos, `svc_resumen`, PID 4120, la copia en Linux | propuesta, «imagina» |
| Que no choca con la evaluación ni la práctica | comprobado: la práctica usa facturas y Auditors/Editors/Visitors (`prac:131`); la evaluación, facturas, una copia de seguridad y un 403 (`fund:60-61`, `fund:76`). El vídeo y sus actividades usan partes de grúas, un menú escolar y un laboratorio |

### F.4 Pendiente de comprobar

- Los nombres de los permisos en la interfaz de Windows en español («Modificar», «Lectura», «Escritura»).
- Que el control de pasaportes y la tarjeta de embarque no choquen con las imágenes de aeropuerto ya ocupadas (la
  maleta en la cinta de V32 y el avión en vuelo de V30, `reg` §6): son otras piezas del aeropuerto y otro concepto.
- Que Lidia quiera «tú» como protagonista (persona de Mantenimiento sin nombre) y no una tercera persona.
- El objetivo de cada tarjeta de examen (00-propuesta §6).
- La duración real tras `build-timeline --estimate` y la grabación.
