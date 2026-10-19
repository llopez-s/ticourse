# Guion para grabar · Cambiar la contraseña no cierra todo: responder a un infostealer

**Versión definitiva** · guion congelado el 2026-10-19.

Lee de corrido y en orden, **a ritmo de conversación**: como si se lo contaras a una amiga, no como quien lee.
Entre frase y frase deja un respiro corto; los silencios se recortan solos y el vídeo se acelera un poco (×1,08) al montarlo.
Si algo sale mal, **calla un segundo y repite la oración que falló desde su principio** (no hace falta la frase entera) y sigue: el importador se queda con la última toma de cada oración.
No hagas pausas largas dentro de una frase: si necesitas respirar, termina antes la oración.
Al acabar la última frase, deja dos segundos de silencio antes de parar la grabación.
Guárdala como `video/engine/voices/stealer-sesiones lidia.wav`.
Lo que va entre paréntesis en cursiva es solo cómo pronunciar; la *dirección* de cada frase es orientativa.
Los mensajes interceptados y las preguntas para pensar salen en pantalla: **no se leen**. Los dominios, IP y correos tampoco: están en pantalla.

## 1. La alerta

### La casilla verde

**s01-01** · *con curiosidad* — La contraseña ya está cambiada. ¿Puedes cerrar el incidente? Vas a comprobar qué falta cuando un programa roba información de un equipo.

**s01-02** · *cercana* — Estás en un ejercicio de respuesta de Halden, una autoridad portuaria. La alerta describe un infostealer. Es malware orientado a robar información del dispositivo.

**s01-03** · *concentrada* — No todos estos programas buscan lo mismo, y sus capacidades cambian entre versiones.

**s01-04** · *tranquila* — La ficha describe el equipo de Ana, datos de su navegador y su cuenta de correo. Todavía no sabemos qué salió ni si alguien lo utilizó.

**s01-05** · *segura* — Necesitas separar esas preguntas para decidir cómo contener el riesgo. **(pausa larga)**

### Tres afirmaciones distintas

**s02-01** · *pensativa* — Una ficha técnica dice que la familia puede robar contraseñas. Eso describe capacidad. Una evidencia del incidente puede mostrar que ciertos datos salieron del equipo.

**s02-02** · *animada* — Eso describe exposición. Un registro del servicio puede mostrar un acceso posterior. Eso permite investigar uso.

**s02-03** · *firme* — La primera afirmación no demuestra automáticamente las otras dos. Una detección en el equipo no identifica por sí sola todos los datos robados.

**s02-04** · *tranquilizadora* — Y un listado que alguien vende tampoco acredita un acceso reciente a tu organización.

**s02-05** · *con curiosidad* — Necesitas fechas y procedencia. Un dato antiguo puede revenderse, duplicarse o estar mal atribuido. Mantén lo desconocido como desconocido. Eso no impide responder con prudencia.

**s02-06** · *cercana* — Impide presentar una sospecha como si ya fuera una secuencia demostrada. **(pausa larga)**

## 2. Qué puede estar expuesto

### No todas las credenciales abren igual

> *(En pantalla, no se lee: mensaje de SILENT PAGER — «Con cambiar la contraseña ya has cerrado todo.». Tú contestas:)*

**s03-01** · *concentrada* — No has comprobado que todo esté cerrado. Una contraseña puede servir para iniciar una autenticación nueva. Una cookie de sesión puede mantener un acceso web existente.

**s03-02** · *tranquila* — Un token de acceso permite operaciones sobre un recurso concreto mientras sea aceptado.

**s03-03** · *segura* — Un token de renovación cumple otro trabajo. Se presenta al servidor de autorización para solicitar nuevos tokens bajo las condiciones aplicables.

**s03-04** · *pensativa* — Si solo sabes que había credenciales, aún no sabes cuál de estas situaciones estás conteniendo.

**s03-05** · *animada* — Por eso cambiar la contraseña puede ser necesario y seguir siendo insuficiente. Tampoco debes afirmar que todas las credenciales funcionan. Identifica el artefacto y su emisor.

**s03-06** · *firme* — Después comprueba vigencia, permisos y controles, sin probar una credencial expuesta contra el servicio. **(pausa larga)**

### El equipo continúa comprometido

**s04-01** · *tranquilizadora* — El programa puede seguir activo. Tienes que cambiar secretos expuestos. ¿Lo harías desde el mismo equipo afectado, o prepararías un entorno confiable mientras contienes el dispositivo?

**s04-02** · *con curiosidad* — Piensa también en lo que podría volver a observar el programa.

> *(En pantalla: «¿Cambias secretos desde el equipo afectado?». Deja cuatro segundos y medio de silencio; no leas las opciones.)*

**s04-03** · *cercana* — Usas un entorno confiable y coordinas la contención del equipo. Si sigue comprometido, podría capturar los secretos nuevos.

**s04-04** · *concentrada* — El procedimiento autorizado debe preservar las evidencias que hagan falta y limitar la capacidad de seguir causando daño.

**s04-05** · *tranquila* — No confundas aislar el dispositivo con contener todas las identidades. Una sesión ya expuesta puede existir fuera de ese equipo. La respuesta tiene dos frentes.

**s04-06** · *segura* — El dispositivo y las cuentas, aplicaciones y recursos que pudieron quedar afectados. **(pausa larga)**

## 3. Dos frentes de contención

### Ampliar el alcance con preguntas

**s05-01** · *pensativa* — Construye una línea temporal con lo que sí conoces. Cuándo se detectó el programa, qué periodo pudo estar activo y qué ocurrió después.

**s05-02** · *animada* — Diferencia la hora de observación de la hora en que recibiste una alerta.

**s05-03** · *firme* — Revisa qué cuentas y aplicaciones estuvieron expuestas. Busca actividad de identidad y del recurso. En el correo pueden importar los accesos y cambios relevantes.

**s05-04** · *tranquilizadora* — En las aplicaciones, los permisos y consentimientos. Una dirección de red nueva, aislada, no basta para demostrar abuso.

**s05-05** · *con curiosidad* — También registra lo que no puedes revisar. Tal vez los registros antiguos ya se hayan borrado al terminar su plazo de conservación.

**s05-06** · *cercana* — Ese hueco no demuestra que nada ocurriera. Afecta al alcance y a la confianza con que explicas el incidente. La investigación debe conservar ese límite. **(pausa larga)**

### Elegir la revocación que corresponde

**s06-01** · *concentrada* — Ahora eliges acciones según el escenario. Los secretos expuestos se cambian desde un entorno confiable. Las sesiones se invalidan donde se gestionan.

**s06-02** · *tranquila* — Una concesión sospechosa se revisa y retira cuando corresponde. Cada acción necesita su responsable y su comprobación.

**s06-03** · *segura* — Impedir una renovación no demuestra que todos los tokens de acceso emitidos antes hayan dejado de funcionar.

**s06-04** · *pensativa* — Y cerrar una sesión del proveedor de identidad no acredita cerrar todas las sesiones propias de las aplicaciones. Hay que comprobar ambos niveles.

**s06-05** · *animada* — Si una aplicación accede sin un usuario presente, puede depender de permisos y credenciales propios. Cambiar la contraseña de una persona no los elimina.

**s06-06** · *firme* — Vas cerrando las vías de acceso que indique la investigación y compruebas el efecto de cada medida. **(pausa larga)**

## 4. Comprobar el corte

### El botón no es el resultado

> *(En pantalla, no se lee: mensaje de SILENT PAGER — «Has pulsado revocar. Ya no necesitas mirar más.». Tú contestas:)*

**s07-01** · *tranquilizadora* — Pulsarlo no demuestra su resultado en todas partes. En Microsoft, revocar las sesiones de inicio invalida tokens de renovación y cookies gestionadas por ese servicio.

**s07-02** · *con curiosidad* — Puede haber un retraso. Las sesiones que una aplicación mantiene por su cuenta requieren atención específica.

**s07-03** · *cercana* — Algunos clientes y recursos compatibles pueden reaccionar a ciertos eventos antes de la caducidad ordinaria. Esa capacidad se llama evaluación continua del acceso.

**s07-04** · *concentrada* — No significa que toda aplicación reaccione a cualquier evento ni que todo el acceso se corte al instante.

**s07-05** · *tranquila* — También varían los efectos de cambiar una contraseña según el tipo de credencial y cómo se hizo el cambio.

**s07-06** · *segura* — Por eso no sustituyas la verificación por una espera fija. Registra la acción y comprueba los efectos que deberían producirse en este escenario. **(pausa larga)**

### ¿Qué te permite avanzar?

**s08-01** · *pensativa* — Tienes un correo que confirma el cambio de contraseña. También puedes revisar los controles aplicados, la actividad posterior y la recuperación del equipo.

**s08-02** · *animada* — ¿Qué sostiene mejor una decisión de cierre? Elige la evidencia que responde al alcance investigado.

> *(En pantalla: «¿Cambio confirmado o controles verificados?». Deja cuatro segundos y medio de silencio; no leas las opciones.)*

**s08-03** · *firme* — El conjunto de comprobaciones. El correo confirma una acción concreta. No acredita el cierre de todas las sesiones.

**s08-04** · *tranquilizadora* — Necesitas valorar si las medidas fueron eficaces, qué acceso pudo persistir y qué dudas siguen abiertas por falta de datos.

**s08-05** · *con curiosidad* — Eso no exige afirmar que sabes todo. Exige explicar qué verificaste y por qué puedes pasar a recuperación o cierre bajo el procedimiento del equipo.

**s08-06** · *cercana* — La vigilancia posterior y los criterios de reapertura también forman parte de una respuesta defendible. **(pausa larga)**

## 5. Cerrar con evidencia

### Volver al caso de Ana

**s09-01** · *concentrada* — En el ejercicio de Ana, el equipo queda contenido y el cambio se hace desde otro dispositivo confiable.

**s09-02** · *tranquila* — Después se revisan las sesiones del servicio de identidad, los permisos de la aplicación y la actividad de acceso al correo.

**s09-03** · *segura* — La recuperación del equipo sigue el procedimiento autorizado. La revisión busca si las medidas funcionaron y si aparecen nuevas señales.

**s09-04** · *pensativa* — No se reutiliza ninguna credencial expuesta para intentar entrar. El ejercicio enseña a responder, no a comprobar accesos robados.

**s09-05** · *animada* — En el informe queda la diferencia entre lo confirmado, lo probable y lo que falta por observar. Así la siguiente persona entiende el alcance real.

**s09-06** · *firme* — Una lista de acciones completadas ayuda, pero solo tiene sentido junto a sus efectos y sus límites. **(pausa larga)**

### Cerrar los dos frentes

**s10-01** · *tranquilizadora* — Tres reglas para llevarte. La capacidad de robar no demuestra extracción ni uso. Aislar un equipo no cierra por sí solo todas las sesiones.

**s10-02** · *con curiosidad* — Y cambiar una contraseña no prueba la invalidación inmediata de toda credencial.

**s10-03** · *cercana* — La respuesta une lo que le pasó al dispositivo con lo que pudieron hacer sus identidades y aplicaciones. Primero acotas el caso. Después eliges acciones adecuadas.

**s10-04** · *concentrada* — Y antes de dar por logrado el corte, compruebas sus efectos.

**s10-05** · *tranquila* — Ve ahora a la práctica complementaria de respuesta a incidentes. Decide qué evidencias necesitarías para cerrar el caso de Ana.

**s10-06** · *segura* — Si tu respuesta solo dice contraseña cambiada, vuelve a mirar las sesiones y el equipo. Aún faltan preguntas. **(pausa larga)**
