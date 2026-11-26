# F5 · «Dónde corre de verdad un servicio»

> **Estado: propuesta, 2026-11-26.** Guion completo, **sin congelar**, sin escenas ni voz. Rutas relativas a la raíz del
> repo; `fund` = `src/data/security/foundations.ts`, `reg` = `docs/superpowers/canon/glass-harbor.md`, `plan` =
> `docs/superpowers/plans/2026-09-25-lesson-videos.md`. Decisiones comunes a los vídeos de fundamentos:
> [00-propuesta.md](00-propuesta.md) §6. Es el quinto vídeo que la propuesta dejaba apuntado en su §5 («Dónde corre de
> verdad un servicio», f01 + f02); Lidia pidió escribirlo el 2026-11-26.
>
> **La voz vigente es `video/donde-corre/narration.json`**; la parte C de esta ficha es su copia legible. La pantalla de
> cada escena está en `video/donde-corre/storyboard.json` (`goal`), con sus cues.

## A. Ficha didáctica

| | |
|---|---|
| **Título** | Dónde corre de verdad un servicio |
| **Título de YouTube** | Dónde corre de verdad un servicio: servidor, máquina virtual y copias (`video.json` → `youtubeTitle`, 69 caracteres; el motor añade el sufijo de la pista) |
| **Pregunta central** | El servidor está encendido y la web no carga: ¿está funcionando o no? ¿Y dónde está de verdad lo que falla? |
| **Objetivos observables** | Al terminar, quien lo ve puede: (1) nombrar CPU, RAM, disco y tarjeta de red, decir qué hace cada una y asociar una señal de fallo a cada pieza; (2) separar anfitrión (host), hipervisor y máquina virtual invitada (guest), y explicar por qué dos VM aisladas caen juntas si cae su anfitrión, y por qué el anfitrión necesita sus propios parches; (3) ante «está encendido», comprobar por orden proceso, puerto y petición real, y no reiniciar el anfitrión sin diagnosticar; (4) distinguir una instantánea (snapshot) en el mismo disco de una copia independiente y probada, y decir para qué sirve cada una; (5) ante un sistema fuera de soporte, proponer excepción apuntada, menos exposición y plan de sustitución, sin llamarlo «actualizado». |
| **Prerrequisitos** | Lecciones f01 y f02 (`fund:5-12`). Nada más: es el primer vídeo de los fundamentos en el orden del curso. |
| **Duración estimada** | **9:02** según `build-timeline --estimate` (542,8 s, 1226 palabras, sin avisos). Con la lectura de Lidia al 86–93 % del estimado saldría entre 7:47 y 8:25. |
| **Práctica relacionada** | **Ninguna**: las cuatro prácticas de fundamentos son de F1–F4 (`src/data/security/practicals.ts`). El cierre propone un hábito, no una práctica (ver F.4). |
| **Dónde va** | Al final de f02, entre «Ejemplo resuelto» y «Error que conviene evitar», como los otros (`src/data/security/foundation-videos.ts`, entrada `f02`, cuando esté publicado). |
| **Conceptos clave (5)** | cuatro piezas y sus señales · anfitrión, hipervisor e invitada (y lo que comparten) · encendido no es funcionando: proceso, puerto y petición real · instantánea frente a copia independiente y probada · fuera de soporte: excepción, no sistema al día. |
| **Se queda en las lecciones** | Kernel frente a aplicaciones (f02 lo nombra en sus objetivos; el vídeo dice «sistema operativo» y lo que hace); Windows frente a Linux (f02, y F3 lo trabaja con permisos); qué son los puertos de verdad, TCP/UDP y los números conocidos (f05, f08 y F1); procesos con PID y cuentas (f04 y F3); tipos de hipervisor, VM escape y resource reuse (sp2m5, V38); alta disponibilidad, réplicas y frecuencia de copias (sp3m7); gestión de vulnerabilidades y controles compensatorios (sp4m5). |

### El caso (fijo)

«Imagina · caso de entrenamiento · sin fecha · la oficina no es del puerto.» Una naviera que trabaja en Halden (la de
F1 y F2, `reg:200`), **fuera del puerto**: así el vídeo no dibuja ni contradice el centro de datos del puerto, que el
registro ya fija (V46: máquinas virtuales «sin VM sprawl ni snapshots», `reg:343`; nadie ha dicho que el puerto tenga
snapshots ni réplica, `reg:1701-1703`).

| Elemento | Datos en pantalla |
|---|---|
| Servidor físico (anfitrión) | `hv-01` · 64 GB de RAM; luces verdes en el frontal |
| Máquinas virtuales (invitadas) | `vm-seguimiento` (web «Seguimiento de envíos», 8 GB) · `vm-ficheros` (servidor de ficheros de la oficina, 8 GB) |
| Servidor de reserva | `hv-02` (donde se restaura en s08) |
| El fallo del lunes | `systemctl status nginx` → `inactive (dead)`; `ss -ltn` sin `:443`; `curl` → `Connection refused`; `systemctl is-enabled nginx` → `disabled` |
| La causa | domingo: parche aplicado y reinicio de `vm-seguimiento`; el servicio no estaba en arranque automático |
| La instantánea | sacada el domingo antes del parche, guardada en el disco de `hv-01` |
| Un mes después | errores de lectura/escritura en el disco de `hv-01`; copia independiente fuera de `hv-01`, ya restaurada antes con éxito |
| Fuera de soporte | el sistema operativo de `vm-ficheros`, sin marca ni versión; un programa antiguo de contabilidad que solo funciona ahí; excepción «la acepta: Dirección · hasta: sustitución»; acceso solo desde Contabilidad |

## B. Guion audiovisual por escenas

- **Carpeta** `video/donde-corre/` · perfil `principal-yt` · `"track": "secplus"` · sin `"lesson"` (el motor no admite
  ids `fNN`, como en F3) · sin adversario ni mensajes interceptados · voz `recording/lidia`, tempo 1 · música
  `Go On Going - Stayloose.mp3` · `"examTiming": "sentence-end"`.
- **Sello** desde s01: «Imagina · caso de entrenamiento · sin fecha · la oficina no es del puerto» y «Simulación
  educativa · datos ficticios». Sin personas con nombre: «tú» (Sistemas de la naviera), «alguien de la oficina», «los
  clientes».
- **Hilo visual: el servidor por capas.** El mismo esquema de `hv-01` crece escena a escena: hardware (s02), hipervisor y
  dos VM (s03), lo que comparten (s04), el servicio dentro de su VM (s05–s06), la instantánea a su lado (s07), la copia
  lejos (s08). En s10 se ve completo, de abajo arriba.
- **Imágenes** (una por concepto, rotuladas «imagen · no es la naviera»): la oficina (persona = CPU, mesa = RAM,
  archivador = disco, teléfono = red), la regleta (el anfitrión del que viven las VM), la ventanilla con la luz encendida
  (el servicio que no se ve) y el llavero con la llave de repuesto (la instantánea en el mismo disco). Ninguna está
  ocupada en el registro (búsqueda del 2026-11-26: «regleta», «llavero», «llave de repuesto», «ventanilla» sin
  resultados en `reg`; el edificio de alquiler del hipervisor es de V38, la cocina de V35 y la tienda de barrio de V22).
- **Datos en pantalla** (nunca en la voz): los de la tabla del caso. La voz dice «el número donde espera» y «lo tienes
  en pantalla»; el 443 y los comandos solo se ven, con el rótulo «no hace falta saber comandos todavía».
- **«Puerto».** En este vídeo la palabra solo significa puerto de red (s06 y s11). Halden se presenta como «una empresa de
  barcos que trabaja en Halden», sin decir «el puerto», para no repetir el doble sentido que la revisión de naturalidad
  quitó de F1 (00-propuesta §8).

| Escena | Capítulo | Propósito didáctico | Pantalla (resumen; el detalle está en el `goal`) |
|---|---|---|---|
| s01 «El servidor está encendido» | 1 · Qué hay dentro de un servidor | pregunta central en 7 s; caso; promesa | web en blanco frente a luces verdes; título; sello; lunes 08:00 y teléfonos; tres chips |
| s02 «Cuatro piezas» | 1 | CPU, RAM, disco, red; una señal de fallo por pieza; cierre del capítulo | el servidor abierto; la oficina; cuatro señales; tarjeta 4.4 |
| s03 «Varias máquinas en un servidor» | 2 · Varias máquinas en un solo servidor | hipervisor (la idea antes del nombre), VM, host, guest; qué hace el sistema operativo | barra del hipervisor que reparte; dos VM con nombre; cuatro iconos del SO |
| s04 «Lo que comparten» | 2 | aisladas entre sí, dependientes del host; parches del host; cierre | pared entre VM; cable común; apagón conjunto; regleta; tarjeta 3.1 |
| s05 «Un programa sin ventana» | 3 · Encendido no es funcionando | servicio sin ventana; **pausa 1** | luces del host; engranajes; ventanilla; dos botones; ficheros que caería |
| s06 «Proceso, puerto y petición» | 3 | las tres comprobaciones; la causa; el arreglo verificado; cierre | lista de tres casillas y terminal; calendario del domingo; web que carga; tarjeta 1.2 |
| s07 «Una foto para volver atrás» | 4 · Volver atrás no es recuperar | instantánea (la idea antes del nombre): para qué sirve y dónde se guardó | cámara y foto; flecha «volver»; mismo disco; llavero |
| s08 «El día que falla el disco» | 4 | **pausa 2**; copia independiente y probada; restaurar en otro servidor; cierre | errores de disco (señal de s02); dos botones; disco roto; copia fuera; `hv-02`; tarjeta 3.4 |
| s09 «Sin más arreglos» | 5 · Sin parches, y tres preguntas | fuera de soporte; excepción, menos exposición, sustitución; no es «al día» | etiqueta roja; buzón cerrado; ficha de excepción; valla; tarjeta 4.3 |
| s10 «Vuelta al lunes» | 5 | volver al caso; las capas; cierre del vídeo | web cargada por petición real; esquema completo |
| s11 «Tres preguntas» | 5 | tres reglas y un hábito | tres tarjetas; tarjeta final |

## C. Texto de locución

> Copia legible de `narration.json` (sin etiquetas de emoción ni cues). Si difieren, manda el JSON.

#### Capítulo 1 · Qué hay dentro de un servidor

La web no carga, pero el servidor está encendido, con todas sus luces verdes. ¿Está funcionando o no?

Imagina que trabajas en Sistemas de una naviera, una empresa de barcos que trabaja en Halden, el escenario de este curso.

Es lunes, ocho de la mañana. Los clientes llaman porque no pueden ver por dónde va su contenedor. Para eso está la web de seguimiento, y no carga.

Al terminar sabrás dónde corre de verdad un servicio, cómo comprobar si funciona y qué guardar para recuperarlo si todo falla.

Empecemos por el propio servidor. Por dentro es un ordenador como el tuyo, con cuatro piezas que importan.

El procesador, la CPU, ejecuta las instrucciones. La memoria, la RAM, guarda el trabajo que está en marcha.

El disco conserva los archivos aunque apagues. Y la tarjeta de red lo conecta con los demás equipos.

Piensa en una oficina. Quien trabaja es la CPU, la mesa es la RAM, el archivador es el disco, y el teléfono, la red.

Y cada pieza, cuando falla, avisa a su manera. Con la CPU al máximo, todo va lento. Si la memoria no da más, los programas se atascan o se cierran.

Si el disco falla, saltan errores al guardar o al leer. Y si cae la red, el equipo puede ir bien, pero no le llega nada.

O sea, que antes de echarle la culpa al servidor, mira qué pieza da la señal.

#### Capítulo 2 · Varias máquinas en un solo servidor

Pero en esta naviera, dentro del servidor no hay una sola máquina. Hay dos.

Hay un programa que reparte la CPU, la memoria y el disco del servidor entre varios ordenadores que solo existen en software. Se llama hipervisor.

Cada uno de esos ordenadores es una máquina virtual, con su propio sistema operativo, como si fuera un equipo aparte.

Al servidor físico se le llama anfitrión, en inglés host. Y a cada máquina virtual, invitada, o guest.

Aquí hay dos invitadas. Una lleva la web de seguimiento, y la otra, el servidor de ficheros de la oficina.

Y el sistema operativo de cada una hace lo de siempre. Reparte su memoria, lleva sus programas y sus archivos, y hace cumplir los permisos.

Las dos invitadas están separadas. Lo que pasa dentro de una no debería tocar a la otra.

Pero las dos viven del mismo anfitrión. Si el servidor físico se para, se paran las dos a la vez.

Es como una regleta. Cada aparato va por su lado, pero si salta la regleta, se apagan todos.

Por eso el anfitrión también necesita sus parches, las correcciones que publica el fabricante. Separar a las invitadas no lo protege a él.

O sea, que las máquinas virtuales se aíslan entre sí, pero caen juntas con su anfitrión.

#### Capítulo 3 · Encendido no es funcionando

Volvamos al lunes. Las luces verdes son del anfitrión. Dicen que el servidor físico está encendido, y poco más.

La web, en cambio, es un servicio, un programa que funciona sin ventana, esperando a que alguien le pida algo.

Como la base de datos que guarda los envíos, que también trabaja sin que nadie la mire.

Es como una ventanilla con la luz encendida. Hasta que no pides algo, no sabes si hay alguien detrás.

Ahora decides tú. Alguien propone reiniciar el servidor entero, que así arranca todo de nuevo. ¿Lo reinicias, o antes miras otra cosa?

*(pausa para pensar)*

Primero se mira. Reiniciar el anfitrión apagaría también el servidor de ficheros, que funcionaba bien.

Y aunque la web volviera, seguirías sin saber por qué se había caído. Así que toca mirar el servicio, dentro de su máquina virtual.

Se comprueban tres cosas, en orden. Primero, si el programa está en marcha. Un programa en marcha es un proceso.

Y el de la web no está en marcha. Está detenido.

Segundo, si escucha en su número. Cada servicio espera las peticiones en un número propio, que se llama puerto. El de la web lo tienes en pantalla.

Nadie escucha en ese número. Es lógico, si el programa está parado.

Y tercero, una petición de verdad. Pides la página como lo haría un cliente. Y no contesta.

¿Por qué estaba parado? El domingo se aplicó un parche y la máquina virtual se reinició. Pero el servicio no estaba puesto para arrancar solo.

Lo pones en marcha, lo dejas en arranque automático y vuelves a pedir la página. Esta vez, carga.

O sea, que un equipo encendido no es un servicio funcionando. La prueba es la petición real.

#### Capítulo 4 · Volver atrás no es recuperar

Antes del parche del domingo, alguien hizo algo sensato. Le sacó una foto a la máquina virtual, tal y como estaba.

Esa foto se llama instantánea, o snapshot. Si el parche estropea algo, vuelves a ella y en minutos estás como antes.

Para eso es estupenda, para deshacer un cambio que ha salido mal.

Pero fíjate dónde se guardó. En el mismo disco del anfitrión, al lado de la propia máquina virtual.

Es como guardar la llave de repuesto en el mismo llavero. Sirve si te equivocas de llave, no si pierdes el llavero.

Un mes después, el anfitrión empieza a dar errores al leer y al guardar. Ya sabes de qué pieza es esa señal.

Ahora decides tú. Si ese disco se pierde del todo, ¿te basta la instantánea para recuperar la web, o necesitas otra cosa?

*(pausa para pensar)*

No te basta. La instantánea estaba en ese disco, así que se pierde con él, igual que la máquina.

Lo que te salva es una copia independiente, guardada fuera de ese servidor. Y probada, porque alguien ya la ha restaurado y ha funcionado.

Con ella, restauras la web en el otro servidor de la oficina, el de reserva, y los clientes vuelven a verla.

O sea, que la instantánea sirve para volver atrás, y la copia independiente, para recuperar lo que has perdido.

#### Capítulo 5 · Sin parches, y tres preguntas

Queda la otra invitada, el servidor de ficheros. Su sistema operativo ya está fuera de soporte.

Eso quiere decir que el fabricante ya no publica parches para él. Si mañana aparece un fallo, nadie lo va a corregir.

Y no se puede cambiar este mes, porque un programa antiguo de contabilidad solo funciona en ese sistema.

Entonces se hacen tres cosas. Se apunta la excepción, quién la acepta y hasta cuándo. Se limita quién puede llegar a esa máquina. Y se planea sustituirla.

Con eso el riesgo baja, pero el sistema no pasa a estar al día. Sigue sin parches, y hay que tenerlo presente.

Volvamos al lunes por la mañana. La web de seguimiento carga, y lo sabes porque has pedido la página, no por las luces.

Ya distingues las capas. El servidor físico, el hipervisor, cada máquina virtual con su sistema y, dentro, el servicio.

Antes de cada parche, una instantánea para volver atrás. Y fuera del servidor, una copia probada para cuando se pierde todo.

O sea, que cuando algo no funciona, primero averiguas en qué capa está el fallo, y luego lo arreglas ahí.

Te quedas con tres preguntas. Una. ¿Dónde corre el servicio? En qué máquina virtual y sobre qué anfitrión, porque si cae el anfitrión, caen todas.

Dos. ¿Funciona de verdad? Mira el proceso, el puerto y, sobre todo, una petición real. Las luces no bastan.

Tres. ¿Podrías recuperarlo si pierdes el servidor? La instantánea no basta. Hace falta una copia fuera, y probada.

La próxima vez que oigas que el servidor está encendido, haz estas tres preguntas antes de reiniciar nada.

## D. Actividades

### D.1 Durante el vídeo (pausas para decidir)

**Pausa 1 · s05 · «¿Qué haces primero?»** (`think`, `holdMs` 4500; los botones los dibuja la escena)

| Opción | Correcta | Feedback |
|---|---|---|
| Reiniciar el servidor entero | No | Error plausible: «reiniciar lo arregla todo». Apaga también `vm-ficheros`, que funcionaba, y no explica por qué cayó la web. Aquí, además, no lo habría arreglado: el servicio no arranca solo. |
| Mirar antes el servicio | **Sí** | Las luces solo dicen que el anfitrión está encendido. Se diagnostica la pieza que falla (el servicio, dentro de su VM) antes de tocar las demás; es el ejemplo de f02 (`fund:12`). |

**Pausa 2 · s08 · «¿Te salva la instantánea?»**

| Opción | Correcta | Feedback |
|---|---|---|
| Basta la instantánea | No | Es el error de f01 (`fund:8`): la instantánea vive en el mismo disco que la VM, así que se pierde con él. |
| Hace falta otra copia | **Sí** | Una copia independiente, fuera de `hv-01`, y probada: sobrevive a la pérdida del origen y ya se sabe que se restaura. |

### D.2 Después del vídeo

Formato `SCENES` de `src/data/security/video-learning.ts`: id `video-donde-corre-N`, objetivos `pre-01` (la primera)
y `pre-01` o `pre-02` (la segunda), primera `understand` y segunda `apply`. Contextos y cifras distintos de la
evaluación de salida (`fund:55-80`: dos VM con un solo host, ransomware que cifra VM y snapshot, host que responde con el
servicio de pedidos parado, fabricante que deja de corregir), de las prácticas y de los simulacros.

**D.2.1 · Comprensión · qué pieza da la señal**

- **ES:** En una academia de idiomas, la web de matrícula va muy lenta. El panel del servidor muestra la CPU al 100 % desde
  hace una hora; el disco tiene espacio libre y ningún error, y la red no pierde paquetes. ¿Qué pieza conviene investigar
  primero?
- **EN:** At a language school, the enrolment website is very slow. The server panel has shown the CPU at 100 % for an
  hour; the disk has free space and no errors, and the network drops no packets. Which component should be investigated
  first?

| | Opción (ES) | Option (EN) | Feedback |
|---|---|---|---|
| A | El disco, porque guarda los datos de la web | The disk, because it stores the website data | Guarda los datos, pero no da ninguna señal: tiene espacio y no hay errores. |
| B | **La CPU, porque es la pieza que da la señal** | **The CPU, because it is the component showing the signal** | **Correcta.** Lentitud general con la CPU al máximo apunta al procesador (o a lo que la está ocupando). |
| C | La tarjeta de red, porque la web se usa desde fuera | The network card, because the site is used from outside | La red no pierde paquetes; si fallara, a la web no le llegarían las peticiones. |
| D | Ninguna: hay que restaurar la última copia | None: the last backup should be restored | Restaurar no arregla una CPU saturada y puede perder datos recientes. |

- **Respuesta:** B. **Explicación:** cada pieza avisa a su manera (f01, `fund:6`); antes de actuar, se mira cuál da la señal.

**D.2.2 · Aplicación · instantánea y copia**

- **ES:** Una gestoría va a aplicar esta noche un parche a la máquina virtual de nóminas. Tiene copias diarias en un
  equipo de almacenamiento aparte, y el mes pasado restauró una con éxito. ¿Qué le añade sacar una instantánea justo
  antes del parche?
- **EN:** An accounting office will patch its payroll virtual machine tonight. It keeps daily backups on separate storage
  and restored one successfully last month. What does taking a snapshot right before the patch add?

| | Opción (ES) | Option (EN) | Feedback |
|---|---|---|---|
| A | Protege los datos si se pierde el servidor | It protects the data if the server is lost | Si la instantánea está con la VM, se pierde con el servidor; eso lo cubre la copia aparte. |
| B | Sustituye a las copias diarias, que ya no hacen falta | It replaces the daily backups, which are no longer needed | Son cosas distintas: la instantánea no sobrevive a perder el origen. |
| C | Evita tener que comprobar después si el servicio funciona | It avoids checking afterwards whether the service works | Tras el parche hay que pedir una página real igual; la instantánea solo permite volver atrás. |
| D | **Volver en minutos al estado de antes si el parche sale mal** | **Rolling back in minutes to the previous state if the patch goes wrong** | **Correcta.** Es justo para lo que sirve: deshacer un cambio. La copia aparte sigue siendo la que recupera tras una pérdida. |

- **Respuesta:** D. **Explicación:** instantánea para volver atrás, copia independiente y probada para recuperar (f01, `fund:8`).

## E. Producción y accesibilidad

### E.1 Recursos

- **Reutilizables (a comprobar en la fase 2):** la naviera sin nombre (`reg:200`); iconos, tema, sellos, tarjetas y pausas
  del motor (`video/engine/src`); el estilo de terminal de otros vídeos para s06, **sin sus datos**.
- **Nuevos:** el esquema del servidor por capas (hardware → hipervisor → VM → servicio); la terminal de s06; las cuatro
  imágenes (oficina, regleta, ventanilla, llavero); la ficha de excepción de s09.
- **Efectos** (`narration.json` → `sfx`, biblioteca `video/engine/sfx/sfx.json`): `error` cuando la web no carga (s01,
  `blank`), `check` cuando vuelve a cargar (s06, `loads`), `glitch` cuando el disco se rompe con la instantánea dentro
  (s08, `gone`). El motor añade `ding` en cada tarjeta y `whoosh` al empezar capítulo.
- **Léxico** (`lexicon.json` y `lexicon.chatterbox.json`, iguales): `CPU` → «ce pe u», `RAM` → «ram». Pendiente de cómo lo
  dice Lidia (F.4).

### E.2 Capítulos y duración (de `build-timeline --estimate`)

| Escena | Empieza | Segundos | Palabras |
|---|---|---|---|
| s01 «El servidor está encendido» | 0:00 | 39,0 | 88 |
| s02 «Cuatro piezas» | 0:39 | 64,4 | 150 |
| s03 «Varias máquinas en un servidor» | 1:43 | 52,1 | 122 |
| s04 «Lo que comparten» | 2:35 | 41,4 | 94 |
| s05 «Un programa sin ventana» | 3:16 | 62,4 | 136 |
| s06 «Proceso, puerto y petición» | 4:19 | 63,6 | 147 |
| s07 «Una foto para volver atrás» | 5:22 | 40,5 | 94 |
| s08 «El día que falla el disco» | 6:03 | 59,4 | 127 |
| s09 «Sin más arreglos» | 7:02 | 45,8 | 105 |
| s10 «Vuelta al lunes» | 7:48 | 36,0 | 83 |
| s11 «Tres preguntas» | 8:24 | 38,3 | 80 |
| **Total** | | **542,8 (9:02)** | **1226** |

Capítulos: 1 en 0:00, 2 en 1:43, 3 en 3:16, 4 en 5:22, 5 en 7:02. 61 segmentos, 81 cues, 5 tarjetas de examen
(4.4 en s02, 3.1 en s04, 1.2 en s06, 3.4 en s08, 4.3 en s09), 2 pausas para pensar (s05, s08), `{title}` a los 7,0 s.
`targetSec` del storyboard = palabras / 2,7 + 2 s (+ 5,5 s por pausa); el motor estima a 2,5 palabras/s, así que todas
las escenas quedan 3–8 s por encima de su objetivo, como en F3.

### E.3 Información visual que la voz tiene que contar

| Escena | Lo que solo se ve | Cómo lo cubre la voz |
|---|---|---|
| s03 | nombres y memoria de las VM y del host | «dos invitadas… una lleva la web de seguimiento, y la otra, el servidor de ficheros» |
| s06 | los comandos y sus respuestas, el 443 | «está detenido», «nadie escucha en ese número», «no contesta», «no estaba puesto para arrancar solo» |
| s08 | `hv-02` | «el otro servidor de la oficina, el de reserva» |
| s09 | la ficha de excepción | «quién la acepta y hasta cuándo… se limita quién puede llegar» |

## F. Revisión

### F.1 Errores conceptuales que el guion previene

| Error | Dónde se corrige |
|---|---|
| «Si el servidor está encendido, el servicio funciona» (el error de f02, `fund:12`) | s01, s05–s06, s10–s11 |
| «Cualquier lentitud o fallo es "el servidor"» | s02 (una señal por pieza) |
| «Las VM están aisladas, así que no comparten nada» | s04 |
| «Si las VM están aisladas, el anfitrión no necesita parches» | s04 (f01, `fund:7`) |
| «Ante la duda, reinicia el servidor entero» | s05 (pausa 1) |
| «Un snapshot es una copia de seguridad» (el error de f01, `fund:8`) | s07–s08 (pausa 2) |
| «Una copia que nunca se ha restaurado vale igual» | s08 («probada») |
| «Con una excepción y menos exposición, el sistema ya está al día» | s09 (f02, `fund:12`) |

**Simplificaciones conscientes:** cuatro piezas (sin placa base, fuente ni GPU); las señales de cada pieza, en una frase
(la RAM llena puede ralentizar por paginación antes de que nada se cierre; «se atascan o se cierran» lo resume); el
hipervisor «reparte» (no se distinguen tipo 1 y tipo 2); «un programa en marcha es un proceso» (f04 y F3 lo amplían con
PID y cuenta); el puerto como «número donde espera» (f05/f08 y F1 lo amplían); el anfitrión con un solo disco: en un
servidor real suele haber discos en espejo o almacenamiento compartido, y la instantánea de muchos hipervisores no es
una copia completa sino un archivo de cambios que depende del disco original (lo que refuerza la idea, no la contradice);
restaurar en `hv-02` también exige red y licencias, que no se cuentan; `systemctl`/`nginx` porque la VM de la web es Linux
(la ficha no dice qué sistema lleva `vm-ficheros`).

### F.2 Fuentes primarias (para la revisión de exactitud)

- NIST SP 800-125 «Guide to Security for Full Virtualization Technologies» (hipervisor, host, guest; seguridad del host).
- NIST SP 800-34 Rev. 1 «Contingency Planning Guide» (copias, pruebas de restauración).
- Documentación de VMware/Hyper-V sobre snapshots/checkpoints: no son copias de seguridad.
- `systemctl(1)` y `systemd.unit(5)` (enable/start, `is-enabled`, `inactive (dead)`); `ss(8)`; `curl(1)` (código 7).
- CompTIA Security+ SY0-701, objetivos 1.2, 3.1, 3.4, 4.3 y 4.4.

### F.3 Comprobado en el repositorio frente a propuesta

| Dato | Estado |
|---|---|
| Contenido de f01 y f02 (recursos, hipervisor, snapshot, servicio, parches, fin de soporte) | comprobado: `fund:5-12` |
| La naviera sin nombre, fuera del puerto | comprobado: `reg:200`; F1 y F2 |
| El centro de datos del puerto no tiene snapshots en ningún vídeo | comprobado: `reg:343`, `reg:1701-1703` |
| `hv-01`, `hv-02`, `vm-seguimiento`, `vm-ficheros`, la web «Seguimiento de envíos» | propuesta; `canon-check`: `hv-01` y `hv-02` sin rastro; `08:00` tiene historia, pero en otro contexto (V10, V6, SIEM) y sin fecha aquí |
| Que las actividades no copian la evaluación, las prácticas ni los simulacros | comprobado para la evaluación (`fund:55-80`); simulacros por búsqueda de «snapshot» (`exam-seeds-advanced.ts`) |
| Imágenes libres en el registro | comprobado por búsqueda (B) |

### F.4 Pendiente de decidir o comprobar (con la opción recomendada)

1. **Dónde pasa el caso.** Recomendado: en la naviera, fuera del puerto (lo que hace el guion). La alternativa, dentro del
   puerto, obligaría a inventar snapshots y servidores en un centro de datos que el registro ya fija.
2. **Cómo dices CPU y RAM.** El léxico pone «ce pe u» y «ram».
3. **El cierre sin práctica.** Recomendado: el hábito de las tres preguntas (lo que hace el guion). Si se crea una
   práctica para f01–f02, s11-04 pasaría a «Abre la práctica…», como en F1–F4.
4. **Objetivo de cada tarjeta.** 4.4, 3.1, 1.2, 3.4 y 4.3, con la insignia por defecto. Es la misma decisión editorial
   de los otros cuatro (00-propuesta §6).
5. **Primer vídeo de los fundamentos.** Va antes que F1 en el orden del curso: el puerto de Halden se presenta aquí en
   una frase, sin la palabra «puerto».
6. **Integración en la app.** Una entrada `f02` en `foundation-videos.ts` cuando esté publicado; las actividades de la
   parte D siguen el formato de las demás y, como ellas, no están en la app.
7. **Duración real.** Se mide tras la grabación; no se recorta ni se rellena.

### Canon nuevo previsto (a registrar como «previsto» si se aprueba)

`hv-01` (64 GB) y `hv-02` (reserva), `vm-seguimiento` y `vm-ficheros` (8 GB cada una), la web «Seguimiento de envíos»
de la naviera, el programa antiguo de contabilidad y su excepción. Todo de la naviera, fuera del puerto, sin fecha.
