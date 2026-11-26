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
| **Duración estimada** | **9:24** según `build-timeline --estimate` tras las revisiones (564,6 s, 1280 palabras, sin avisos). Con la lectura de Lidia al 86–93 % del estimado saldría entre 8:06 y 8:45. |
| **Práctica relacionada** | **Ninguna**: las cuatro prácticas de fundamentos son de F1–F4 (`src/data/security/practicals.ts`). El cierre propone un hábito, no una práctica (ver F.4). |
| **Dónde va** | Al final de f02, entre «Ejemplo resuelto» y «Error que conviene evitar», como los otros (`src/data/security/foundation-videos.ts`, entrada `f02`, cuando esté publicado). |
| **Conceptos clave (5)** | cuatro piezas y sus señales · anfitrión, hipervisor e invitada (y lo que comparten) · encendido no es funcionando: proceso, puerto y petición real · instantánea frente a copia independiente y probada · fuera de soporte: excepción, no sistema al día. |
| **Se queda en las lecciones** | Kernel frente a aplicaciones (f02 lo nombra en sus objetivos; el vídeo dice «sistema operativo» y lo que hace); Windows frente a Linux (f02, y F3 lo trabaja con permisos); qué son los puertos de verdad, TCP/UDP y los números conocidos (f05, f08 y F1); procesos con PID y cuentas (f04 y F3); tipos de hipervisor, VM escape y resource reuse (sp2m5, V38); alta disponibilidad, réplicas y frecuencia de copias (sp3m7); gestión de vulnerabilidades y controles compensatorios (sp4m5). |

### El caso (fijo)

«Imagina · caso de entrenamiento · sin fecha · la oficina no es del puerto.» Una naviera con oficina en Halden (la
naviera sin nombre, cliente del puerto, de `reg:200`; la misma oficina de F1 y F2, `F1-viaje-conexion.md:59`), **fuera
del puerto**. Su servidor de ficheros, que en F1 es simplemente «el servidor de ficheros», aquí resulta ser una máquina
virtual; F1 no dice lo contrario. Fuera del puerto, así el vídeo no dibuja ni contradice el centro de datos del puerto, que el
registro ya fija (V46: máquinas virtuales «sin VM sprawl ni snapshots», `reg:343`; nadie ha dicho que el puerto tenga
snapshots ni réplica, `reg:1701-1703`).

| Elemento | Datos en pantalla |
|---|---|
| Servidor físico (anfitrión) | `hv-01` · 64 GB de RAM; luces verdes en el frontal |
| Máquinas virtuales (invitadas) | `vm-seguimiento` (web «Seguimiento de envíos», 8 GB) · `vm-ficheros` (servidor de ficheros de la oficina, 8 GB) |
| Servidor de reserva | `hv-02` (donde se restauran las dos VM en s08; desde entonces todo corre ahí) |
| El fallo del lunes | `systemctl status nginx` → `inactive (dead)`; `ss -ltn` sin `:443`; `curl` → `Connection refused`; `systemctl is-enabled nginx` → `disabled` |
| La causa | domingo: parche aplicado y reinicio de `vm-seguimiento`; el servicio no estaba en arranque automático |
| La instantánea | sacada el domingo antes del parche, guardada en el disco de `hv-01` |
| Un mes después | errores de lectura/escritura en el disco de `hv-01`; copia independiente fuera de `hv-01`, ya restaurada antes con éxito |
| Fuera de soporte | el sistema operativo de `vm-ficheros`, sin marca ni versión; un programa antiguo de contabilidad que solo funciona ahí; excepción «la acepta: Dirección · hasta: sustitución»; acceso «solo los puestos de la oficina que lo usan · sin acceso desde Internet» |

## B. Guion audiovisual por escenas

- **Carpeta** `video/donde-corre/` · perfil `principal-yt` · `"track": "secplus"` · sin `"lesson"` (el motor no admite
  ids `fNN`, como en F3) · sin adversario ni mensajes interceptados · voz `recording/lidia`, tempo 1 · música
  `Go On Going - Stayloose.mp3` · `"examTiming": "sentence-end"`.
- **Sello** desde s01: «Imagina · caso de entrenamiento · sin fecha · la oficina no es del puerto» y «Simulación
  educativa · datos ficticios». Sin personas con nombre: «tú» (quien lleva la informática de la naviera), «alguien», «los
  clientes».
- **Hilo visual: el servidor por capas.** El mismo esquema de `hv-01` crece escena a escena: hardware (s02), hipervisor y
  dos VM (s03), lo que comparten (s04), el servicio dentro de su VM (s05–s06), la instantánea a su lado (s07), la copia
  lejos (s08). En s10 se ve completo, de abajo arriba.
- **Imágenes** (una por concepto, rotuladas «imagen · no es la naviera»): la oficina (persona = CPU, mesa = RAM,
  archivador = disco, teléfono = red), la regleta (el anfitrión del que viven las VM; vuelve en s05), la casa con las luces
  encendidas a cuya puerta hay que llamar (el servicio que no se ve; vuelve en s06 con la petición real) y el llavero
  con la llave de repuesto (la instantánea en el mismo disco: una llave torcida en s07, el llavero perdido en s08).
  Búsqueda en `reg` del 2026-11-26: «regleta», «llavero», «llave de repuesto» y «luces encendidas» sin resultados. **La
  ventanilla, primera idea, está ocupada** (V16, «la ventanilla de navieras y transportistas», `reg:4501`, `reg:1413`) y
  se cambió; el timbre también (el de hospital es de V31), por eso se «llama a la puerta». La oficina en esquema existe en
  V37 (`reg:325`) con otro uso, el perímetro, y V30 llama «la foto» al baseline: no chocan, pero se anotan. El edificio de
  alquiler del hipervisor es de V38, la cocina de V35 y la tienda de barrio de V22.
- **Datos en pantalla** (nunca en la voz): los de la tabla del caso. La voz dice «un número concreto, que se llama puerto» y «lo tienes
  en pantalla»; el 443 y los comandos solo se ven, con el rótulo «no hace falta saber comandos todavía».
- **«Puerto».** En este vídeo la palabra solo significa puerto de red (s06 y s11). Halden se presenta como «una empresa de
  barcos con oficina en Halden», sin decir «el puerto», para no repetir el doble sentido que la revisión de naturalidad
  quitó de F1 (00-propuesta §8).

| Escena | Capítulo | Propósito didáctico | Pantalla (resumen; el detalle está en el `goal`) |
|---|---|---|---|
| s01 «El servidor está encendido» | 1 · Qué hay dentro de un servidor | pregunta central en 7 s; caso; promesa | web en blanco frente a luces verdes; título; sello; lunes 08:00 y teléfonos; tres chips |
| s02 «Cuatro piezas» | 1 | CPU, RAM, disco, red; una señal de fallo por pieza; cierre del capítulo | el servidor abierto; la oficina; cuatro señales; tarjeta 4.4 |
| s03 «Varias máquinas en un servidor» | 2 · Varias máquinas en un solo servidor | hipervisor (la idea antes del nombre), VM, host, guest; qué hace el sistema operativo | barra del hipervisor que reparte; dos VM con nombre; cuatro iconos del SO |
| s04 «Lo que comparten» | 2 | aisladas entre sí, dependientes del host; parches del host; cierre | pared entre VM; cable común; apagón conjunto; regleta; tarjeta 3.1 |
| s05 «Un programa sin ventana» | 3 · Encendido no es funcionando | servicio sin ventana; **pausa 1** | luces del host; engranajes; la casa iluminada; dos botones; la regleta que apagaría también ficheros |
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

Imagina que llevas la informática de una naviera, una empresa de barcos con oficina en Halden, el escenario de este curso.

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

Un programa reparte la CPU, la memoria y el disco del servidor entre varios ordenadores que solo existen dentro de él. Se llama hipervisor.

Cada uno de esos ordenadores es una máquina virtual. Lleva su propio sistema operativo, como Windows o Linux, y va como un equipo aparte.

Al servidor físico se le llama anfitrión, en inglés host. Y a cada máquina virtual, invitada, o guest.

Una lleva la web de seguimiento, y la otra, el servidor de ficheros, con las carpetas compartidas de la oficina.

Y el sistema operativo de cada una hace lo de siempre. Reparte su memoria, lleva sus programas y sus archivos, y decide quién puede tocar qué.

Las dos invitadas están separadas. Lo que pasa dentro de una no debería tocar a la otra.

Pero las dos viven del mismo anfitrión. Si el servidor físico se para, se paran las dos a la vez.

Es como una regleta. Cada aparato tiene su enchufe, pero si salta la regleta, se apagan todos.

Y como todo cuelga de él, el anfitrión necesita sus parches, las correcciones que publica el fabricante. Separar a las invitadas no lo protege a él.

O sea, que las máquinas virtuales se aíslan entre sí, pero caen juntas con su anfitrión.

#### Capítulo 3 · Encendido no es funcionando

Volvamos al lunes. Las luces verdes son del anfitrión. Dicen que el servidor físico está encendido, y poco más.

La web, en cambio, es un programa que funciona sin ventana, esperando a que alguien le pida algo. Eso es un servicio.

Igual que el programa que guarda los envíos, la base de datos. También trabaja sin que nadie la mire.

Es como una casa con las luces encendidas. Hasta que no llamas a la puerta y te abren, no sabes si hay alguien dentro.

Ahora decides tú. Los clientes siguen llamando y alguien propone reiniciar el servidor entero, que es rápido y suele funcionar. ¿Lo reinicias, o miras antes el servicio?

*(pausa para pensar)*

Primero se mira. Reiniciar el anfitrión es apagar la regleta, y se apagaría también el servidor de ficheros, que funcionaba bien.

Y aunque la web volviera, seguirías sin saber por qué se había caído. Así que toca mirar el servicio, dentro de su máquina virtual.

Compruebas tres cosas, en orden. Primero, si el programa está en marcha. Un programa en marcha es un proceso.

Y el de la web no está en marcha. Está detenido.

Segundo, si escucha en su número. Cada servicio espera las peticiones en un número concreto, que se llama puerto. El de la web lo tienes en pantalla.

Nadie escucha en ese número. Es lógico, si el programa está parado.

Y tercero, una petición de verdad. Llamas a la puerta, o sea, pides la página como lo haría un cliente. Y nadie abre.

¿Por qué estaba parado? El domingo se aplicó un parche y la máquina virtual se reinició. Pero el servicio no estaba puesto para arrancar solo. Reiniciar no lo habría arreglado.

Lo pones en marcha, lo dejas en arranque automático y vuelves a pedir la página. Esta vez, carga.

O sea, que un equipo encendido no es un servicio funcionando. La prueba es la petición real.

#### Capítulo 4 · Volver atrás no es recuperar

Antes del parche del domingo, alguien hizo algo sensato. Le sacó una foto a la máquina virtual, tal y como estaba.

Esa foto se llama instantánea, o snapshot. Si el parche estropea algo, vuelves a ella y en minutos estás como antes.

Para eso es estupenda, para deshacer un cambio que ha salido mal.

Pero fíjate dónde se guardó. En el mismo disco del anfitrión, al lado de la propia máquina virtual.

Pasa como con la llave de repuesto, que va en el mismo llavero. Si se te tuerce una llave, tiras de la otra.

Un mes después, el anfitrión empieza a dar errores al leer y al guardar. Ya sabes de qué pieza es esa señal.

Ahora decides tú. Si ese disco se muere del todo, ¿puedes recuperar la web con la instantánea del domingo?

*(pausa para pensar)*

No puedes. La instantánea estaba en ese disco, así que se pierde con él. Has perdido el llavero entero, con la de repuesto.

Lo que te salva es una copia independiente, guardada fuera de ese servidor. Y probada, porque alguien ya la ha restaurado y ha funcionado.

Con ella, restauras las dos máquinas en el otro servidor de la oficina, el de reserva. Y los clientes vuelven a ver la web.

O sea, que la instantánea sirve para volver atrás, y la copia independiente, para recuperar lo que has perdido.

#### Capítulo 5 · Sin parches, y tres preguntas

Queda un asunto con la otra invitada, el servidor de ficheros. Su sistema operativo es tan viejo que el fabricante ya lo ha abandonado.

Ya no publica parches para él, y si mañana aparece un fallo, el fabricante no lo va a corregir. Eso es estar fuera de soporte.

Y no se puede cambiar este mes, porque un programa antiguo de contabilidad solo funciona en ese sistema.

Haces tres cosas. Apuntas la excepción, o sea, que lo dejas así a sabiendas, quién lo acepta y hasta cuándo. Limitas quién puede llegar a esa máquina. Y planeas sustituirla.

Con eso el riesgo baja, pero el sistema no pasa a estar al día. Sigue sin parches, y hay que tenerlo presente.

Vuelve conmigo al lunes del principio. La web de seguimiento carga, y lo sabes porque has pedido la página, no por las luces.

Ya distingues las capas. El servidor físico, el hipervisor, cada máquina virtual con su sistema y, dentro, el servicio.

Antes de cada parche, una instantánea para volver atrás. Y fuera del servidor, una copia probada para cuando se pierde todo.

O sea, que cuando algo no funciona, primero averiguas en qué capa está el fallo, y luego lo arreglas ahí.

Te quedas con tres preguntas. Una. ¿Dónde corre el servicio? En qué máquina virtual y sobre qué anfitrión, porque si cae el anfitrión, caen todas.

Dos. ¿Funciona de verdad? Mira el proceso, el puerto y, sobre todo, una petición real. Las luces no lo dicen.

Tres. ¿Podrías recuperarlo si pierdes el servidor? La instantánea no basta. Hace falta una copia fuera, y probada.

La próxima vez que alguien te diga que está encendido, haz estas tres preguntas antes de reiniciar nada.

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
| Sí, con la instantánea | No | Es el error de f01 (`fund:8`): la instantánea vive en el mismo disco que la VM, así que se pierde con él. |
| No, hace falta otra copia | **Sí** | Una copia independiente, fuera de `hv-01`, y probada: sobrevive a la pérdida del origen y ya se sabe que se restaura. |

### D.2 Después del vídeo

Formato `SCENES` de `src/data/security/video-learning.ts`: id `video-donde-corre-N`, objetivo `pre-01` (f01) en las dos, primera `understand` y segunda `apply`. Contextos y cifras distintos de la
evaluación de salida (`fund:55-80`: dos VM con un solo host, ransomware que cifra VM y snapshot, host que responde con el
servicio de pedidos parado, fabricante que deja de corregir), de las prácticas y de los simulacros.

**D.2.1 · Comprensión · qué pieza da la señal**

- **ES:** En una academia de idiomas, la web de matrícula va muy lenta. El panel del servidor muestra la CPU al 100 % desde
  hace una hora; la memoria tiene margen, el disco tiene espacio libre y ningún error, y la red no pierde paquetes. ¿Qué pieza conviene investigar
  primero?
- **EN:** At a language school, the enrolment website is very slow. The server panel has shown the CPU at 100 % for an
  hour; the memory has headroom, the disk has free space and no errors, and the network drops no packets. Which component should be investigated
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
| A | Protege los datos si se pierde el disco donde está la máquina virtual | It protects the data if the disk holding the virtual machine is lost | La instantánea se guarda en ese mismo almacenamiento y se pierde con él; eso lo cubre la copia aparte. |
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
| s03 «Varias máquinas en un servidor» | 1:43 | 53,7 | 126 |
| s04 «Lo que comparten» | 2:37 | 42,2 | 96 |
| s05 «Un programa sin ventana» | 3:19 | 70,4 | 156 |
| s06 «Proceso, puerto y petición» | 4:29 | 67,7 | 157 |
| s07 «Una foto para volver atrás» | 5:37 | 40,9 | 95 |
| s08 «El día que falla el disco» | 6:18 | 61,0 | 131 |
| s09 «Sin más arreglos» | 7:19 | 50,6 | 117 |
| s10 «Vuelta al lunes» | 8:09 | 36,0 | 83 |
| s11 «Tres preguntas» | 8:45 | 38,7 | 81 |
| **Total** | | **564,6 (9:24)** | **1280** |

Capítulos: 1 en 0:00, 2 en 1:43, 3 en 3:19, 4 en 5:37, 5 en 7:19. 61 segmentos, 81 cues, 5 tarjetas de examen
(4.4 en s02, 3.1 en s04, 1.2 en s06, 3.4 en s08, 4.3 en s09), 2 pausas para pensar (s05, s08), `{title}` a los 7,0 s.
`targetSec` del storyboard = palabras / 2,7 + 2 s (+ 5,5 s por pausa); el motor estima a 2,5 palabras/s, así que todas
las escenas quedan 3–8 s por encima de su objetivo, como en F3.

### E.3 Información visual que la voz tiene que contar

| Escena | Lo que solo se ve | Cómo lo cubre la voz |
|---|---|---|
| s03 | nombres y memoria de las VM y del host | «Hay dos… una lleva la web de seguimiento, y la otra, el servidor de ficheros» |
| s06 | los comandos y sus respuestas, el 443 | «está detenido», «nadie escucha en ese número», «nadie abre», «no estaba puesto para arrancar solo» |
| s08 | `hv-02` y las dos VM restauradas | «restauras las dos máquinas en el otro servidor de la oficina, el de reserva» |
| s09 | la ficha de excepción | «quién lo acepta y hasta cuándo… limitas quién puede llegar a esa máquina» |

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
(la ficha no dice qué sistema lleva `vm-ficheros`); en s10 la instantánea va «antes de cada parche» (los fabricantes desaconsejan conservarlas mucho tiempo, porque el archivo de cambios crece; en el caso se conservó un mes, y no se dice); «el fabricante no lo va a corregir» deja fuera el soporte extendido de pago; el texto de `curl` en pantalla es el de curl 7.x, abreviado con «…»; «Windows o Linux» en s03 son ejemplos de sistema operativo, no los de la naviera.

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
| La naviera sin nombre, fuera del puerto | comprobado: `reg:200` (V11, V35); la oficina de F1 y F2 sale de sus guiones (`F1-viaje-conexion.md:59`) |
| El centro de datos del puerto no tiene snapshots en ningún vídeo | comprobado: `reg:343`, `reg:1701-1703` |
| `hv-01`, `hv-02`, `vm-seguimiento`, `vm-ficheros`, la web «Seguimiento de envíos» | propuesta; `canon-check`: `hv-01` y `hv-02` sin rastro; `08:00` tiene historia, pero en otro contexto (V10, V6, SIEM) y sin fecha aquí |
| Que las actividades no copian la evaluación, las prácticas ni los simulacros | comprobado para la evaluación (`fund:55-80`); simulacros por búsqueda de «snapshot» (`exam-seeds-advanced.ts`) |
| Imágenes libres en el registro | comprobado por búsqueda (B); la ventanilla estaba ocupada (V16) y se cambió por la casa iluminada |

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

### Revisiones aplicadas (2026-11-26)

Dos revisores de solo lectura, en paralelo (exactitud y naturalidad). El guion **sigue sin congelar**.

**Exactitud (todo aplicado).** (1) En s08 el disco se llevaba las dos VM, pero solo se restauraba la web, y s09 seguía
con `vm-ficheros` como si nada: s08-05 restaura «las dos máquinas» en `hv-02`, y el storyboard de s08–s09 las enciende
ahí (s10 vuelve al lunes y rotula solo «anfitrión»). (2) La ventanilla estaba ocupada (V16, `reg:4501`) y era justo de navieras: se cambió por la casa con las luces
encendidas. (3) «Solo Contabilidad» contradecía «el servidor de ficheros de la oficina»: el rótulo pasa a «solo los
puestos de la oficina que lo usan · sin acceso desde Internet». (4) D.2.2 A, ambigua con almacenamiento compartido:
ahora «si se pierde el disco donde está la máquina virtual». (5) D.2.1 dice que la memoria tiene margen. (6) s09-02:
«el fabricante no lo va a corregir». (7) s06-03: «un número concreto» en vez de «un número propio». (8) Simplificaciones nuevas en F.1 (sin rótulo en
pantalla: una segunda pasada vio que el caso guarda la instantánea un mes y lo contradecía). (9) Citas de `reg:200` y de F1 corregidas. El revisor
abrió la página de errores de libcurl y systemctl(1); los objetivos de CompTIA, NIST SP 800-125 y la documentación de
snapshots los comprobó de memoria (el PDF oficial pide el portal de socios).

**Naturalidad (aplicado, con estas diferencias).** Pausa 1 con presión real y una opción concreta («¿Lo reinicias, o
miras antes el servicio?») y su remate en s06-06 («Reiniciar no lo habría arreglado»). Pausa 2 sin la respuesta
anticipada: el llavero de s07 es ahora la llave torcida (deshacer un cambio) y la pérdida del llavero llega en s08-03,
después de la pregunta. «Sistema operativo» con ancla («como Windows o Linux»), «llevas la informática» en vez de
«Sistemas», «servicio» y «fuera de soporte» con la idea antes del nombre, la regleta vuelve en s05-06, la base de datos
explicada, «Y como todo cuelga de él» en s04-04, segunda persona en s06 y s09, y cambios menores en s03, s04, s10 y s11.
**No aplicado:** la ventanilla numerada para el puerto y la ventanilla de s06-05 (la imagen cambió por la revisión de
exactitud: en su lugar, «llamas a la puerta… y nadie abre»); la frase opcional de s07-03 sobre por qué no se usó la
instantánea el lunes; y glosar «corre», que es el título.

**Resultado.** `build-timeline --estimate` sin avisos: 564,6 s (9:24; antes 542,8), 1280 palabras, 61 segmentos, 81 cues.
`script-sheets` (hoja BORRADOR) y `canon-check` (3 tokens: `08:00` con historia en otro contexto, `hv-01` y `hv-02`
nuevos) sin cambios.

### Canon nuevo previsto (a registrar como «previsto» si se aprueba)

`hv-01` (64 GB) y `hv-02` (reserva), `vm-seguimiento` y `vm-ficheros` (8 GB cada una), la web «Seguimiento de envíos»
de la naviera, el programa antiguo de contabilidad y su excepción. Todo de la naviera, fuera del puerto, sin fecha.
