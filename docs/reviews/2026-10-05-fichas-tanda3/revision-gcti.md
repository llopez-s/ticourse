# Revisión de exactitud y canon · V13, V14 y V15 (GCTI, VELVET CICADA)

> Las citas `fichas/Vnn-…-ficha.md:NN` y `fichas/Vnn-…-decisiones.md:NN` remiten a los borradores que se revisaron,
> antes de aplicar esta revisión. Las fichas corregidas están en el plan de vídeos (§5) y sus decisiones en `decisiones.md`.

Revisión de solo lectura del 2026-10-05 sobre la primera versión de las fichas de la tanda 3. Rutas del repositorio
relativas a `D:\LLM projects\TICourse` (worktree `video-fichas-tanda3`, `origin/main` 3d81dda); las fichas, como
`fichas/Vnn-…md:línea` dentro del scratchpad. Los límites numéricos se han vuelto a contar con un script de Node
(`revisiones/count-gcti.mjs`): todas las tarjetas, preguntas y mensajes caben, ninguno lleva símbolos prohibidos
(`video/engine/scripts/lib/narration.mjs:23`), las sumas de escenas son 454, 454 y 218 s y los `wordBudget` cuadran
(1.225, 1.225 y 590 palabras). Aquí no se repiten.

**Cómo se lee la gravedad** (la misma de la tanda 2).
- **bloquea**: algo falso en pantalla o en la voz que quien lo vea se llevaría al examen, o un dato de canon que un
  vídeo dejaría congelado en contra de una lección o de otro vídeo publicado.
- **conviene**: un arreglo correcto que se hace cambiando una frase, o una decisión que hay que tomar antes del guion.
- **menor**: pulido.

**Días de la semana** (comprobados con Node): 2-3-2026 lunes, 4-3 miércoles, 5-3 jueves, 7-3 sábado, 9-3 lunes,
11-3 miércoles.

---

## V13 · s2m1 · «La Cyber Kill Chain: basta con romper un eslabón»

1. **conviene (pasa a bloquea si el guion dice que un eslabón roto acaba con el atacante) · s02, mensaje y marcadores.**
   La respuesta al primer mensaje (`fichas/V13-s2m1-ficha.md:114-117`) dice que el atacante «necesita acertar siete
   veces seguidas y en orden, y a ti te basta con que falle una», y en pantalla quedan «él: necesita las siete, en
   orden» · «tú: te basta con una» (`:86`). Dos cosas se pasan de la raya:
   - De las siete, dos no las puedes romper tú: Weaponization ocurre en su espacio y solo se infiere (s2m1q2,
     `src/data/s2.ts:132-144`), y Reconnaissance casi nunca se ve (`src/data/s2.ts:37`).
   - Romper un eslabón frustra **ese intento** (s2m1q4, `src/data/s2.ts:162-167`: «deny one required step and the
     objective fails»), no al atacante: puede mandar otra caja. Lo que gana el defensor es que tiene que empezar de
     nuevo, y que el primer intento le ha enseñado cómo trabaja.

   La tarjeta «Kill Chain: al defensor le basta romper un eslabón» **no se toca**: es la respuesta de s2m1q4. El
   arreglo va en la voz y en los marcadores.
   **Arreglo.**
   - Voz, respuesta al mensaje: «Para colarse una vez, quizá. Pero para llevarse los planos necesita que le salgan
     todos los pasos, y en orden. A ti te basta con cortar uno de los que tienes a tu alcance. ¿Que lo vuelve a
     intentar? Claro. Pero empieza de nuevo, y tú ya sabes cómo prepara la caja.»
   - Marcadores: «él: necesita las siete, en orden» · «tú: te basta con romper una a tu alcance».
   - Con la viñeta: «si nadie abre la caja, no hay llave escondida, ni aviso, ni planos»; puede mandar otra, pero
     **esta** se ha quedado en la puerta.

2. **conviene · s07 (llegar antes) y concepto 4.** La escena enseña alarmas que «se reparten hacia la izquierda y cada
   una que salta antes del C2 apaga todas las de su derecha» (`fichas/V13-s2m1-ficha.md:91`; concepto en `:77`). Ahí
   se mezclan dos cosas: detectar no es parar, y solo puedes detectar antes **donde tienes ojos**. La respuesta
   buena de s2m1q5 lo dice: «earlier-phase visibility is needed» (`src/data/s2.ts:176`). La lección habla de
   «cada control que dispare a la izquierda del C2» (`src/data/s2.ts:89`), es decir, un control que corta, no una
   alarma que nadie atiende.
   **Arreglo.**
   - Animación: la alarma que salta antes del C2 solo apaga las de su derecha cuando alguien actúa (un candado o una
     mano sobre ella). Una alarma que suena sola no apaga nada.
   - Chip nuevo, antes de mover las alarmas: «para saltar antes, hay que ver antes» (36). Debajo, en pequeño:
     «registros del correo · del equipo».
   - Voz: «Para que salte antes, primero tienes que ver antes: registros del correo, del equipo. Y cada paso que
     paras de verdad te ahorra todos los que venían detrás.»

3. **menor · s02 (la cuenta en pantalla).** «La viñeta de la caja abierta se rompe y las cuatro siguientes pasan a
   gris» (`fichas/V13-s2m1-ficha.md:86`). La caja abierta es Exploitation, la cuarta; detrás solo quedan tres
   (Installation, C2 y Actions on Objectives).
   **Arreglo:** «las tres siguientes».

4. **menor · s05, s06 y «Se queda fuera» («registros públicos»).** «Casi nunca la ves, salvo en tus registros públicos»
   (`fichas/V13-s2m1-ficha.md:76,90,139`) traduce «tus logs públicos» de la lección (`src/data/s2.ts:37`), pero en
   castellano «registros públicos» se entiende como el registro civil o el de la propiedad.
   **Arreglo:** «casi nunca la ves, salvo en los registros de lo que tienes cara a internet, como tu web». Mejor no
   nombrar la VPN: el escaneo de la pasarela VPN es un ítem del Lab 2A (`src/data/labs.ts:223`).

5. **menor · s04 (la respuesta de la pregunta).** La columna «Actions on Objectives: leer las carpetas de diseño,
   comprimirlas, sacarlas» (`fichas/V13-s2m1-ficha.md:88`) es s2m1q9 al pie de la letra (`src/data/s2.ts:233-235`),
   así que se puede. Pero el ítem más difícil del Lab 2A es «Actor enumerates file shares searching for CAD
   directories», que también es Actions on Objectives (`src/data/labs.ts:263-265`).
   **Arreglo:** que el guion se quede en «leer, comprimir y sacar» y no diga nunca «buscar» ni «recorrer» las carpetas.

6. **menor · s05 (opcional, por la imagen común del PDB).** Para que V14 y V15 hereden la imagen, la tercera pista de
   s05 («rutas de compilación (PDB)», `fichas/V13-s2m1-ficha.md:89`) puede llevar ya el dibujo de **la etiqueta del
   taller** (ver «Entre fichas», punto 1). En voz bastaría con media frase: «y a veces, por dentro, hasta la etiqueta
   del taller donde la montó». No añade concepto ni tarjeta.

**Lo que la ficha pedía comprobar y queda bien:**
- Las siete fases, con sus nombres de Lockheed Martin en pantalla y la voz contando la historia; Weaponization
  inferida y no observada (s2m1q2 y q8); la frontera visto, deducido y sin ver de `src/data/s2.ts:89`.
- Las dos trampas de examen bien dichas: el remitente que imita a Meridian es Delivery (s2m1q10,
  `src/data/s2.ts:254-255`) y la pasarela es un control de red, antes del equipo (s2m1q7, `src/data/s2.ts:212`).
- La alerta de s01 es la de V3 tal cual: «02:13», «UTC · 05-03-2026», `ENG-WS-041`, «ingeniería de propulsión» y
  «dominio desconocido» (`video/diamond-e7/src/scenes/S01Hook.tsx:196-197,277,286`). El 2-3 es lunes, como dice la
  cabecera del correo (`src/data/s2.ts:72`).
- «En lo que tienes, la séptima no aparece» cuadra con el check de la lección (`src/data/s2.ts:113`) y con V3, donde
  E9 es cuando el atacante «va a por lo que vino a buscar» (`video/diamond-e7/narration.json:329`).
- La imagen no falsea Exploitation: la caja solo hace daño cuando alguien la abre. La llave en la maceta es la misma
  de V7 (`video/attack-piramide/narration.json:47`).
- La pregunta de s04 repite el check que hay justo encima (`src/data/s2.ts:101-115`); pasa lo mismo en V9 y está
  bien así.
- Inserción entre `src/data/s2.ts:115` y `:116`: todo lo que enseña ya está antes en la lección.
- Producción: GLASS VIPER es el adversario de S2 (`src/data/course-gcti.ts:36`) y habla con la voz de V3 y V7, Pablo
  con `machine` (`video/diamond-e7/narration.json:6`; `video/attack-piramide/narration.json:11-15`); la música es la de
  V4 a V9 (`Go On Going - Stayloose.mp3`). No hace falta voz ni efecto nuevos.
- **Lab 2A no queda destripado.** El vídeo solo lee la reconstrucción de la lección, que ya trae cada línea con su
  fase; lo que da de más sale de las preguntas del quiz (q9, q10). No salen el escaneo de la VPN, las pruebas contra
  antivirus, el canal por la nube, la enumeración de recursos compartidos, los RAR, los 650 MB, los 90 s ni los
  cuatro buzones (`src/data/labs.ts:216-275`). Mandar al Lab 2A al final está bien.

---

## V14 · s2m4 · «De la foto a la película: activity threads y grupos»

1. **conviene (cambio de la lección) · la Víctima 1 del walkthrough.** El choque es real y la propuesta es buena. Lo
   que dice hoy la lección (`src/data/s2.ts:871-877`) va contra tres cosas:
   - **s2m1**: el correo de las 09:41 UTC con el CV y la cadena de `ENG-WS-041`, con `C:\ProgramData\winhlp.exe`
     (`src/data/s2.ts:68-85`).
   - **V7**: `image=C:\ProgramData\winhlp.exe` en pantalla (`video/attack-piramide/src/data/s05-otra-ropa.ts:19`) y
     «Así entró el atacante en un equipo de Meridian», en singular (`video/attack-piramide/narration.json:23`).
   - **V3**: E9, el 7-3, es cuando «ya no solo avisa de que está dentro. Ahora va a por lo que vino a buscar»
     (`video/diamond-e7/narration.json:323,329`). Una salida de 1,2 GB el 5-3 a las 01:47, antes de E7, lo
     contradice.

   Dos pruebas más que la ficha no usa y que refuerzan el cambio:
   - V8 tiene en pantalla una sola entrada: «incidente propio · correo del 02-03», colgada de `cdn-sync-status.example`,
     el relay del correo del CV (`video/stix-isac/src/data/s04-grafo.ts:32`).
   - La ficha de V7 ya descartó estas víctimas por el mismo motivo
     (`docs/superpowers/plans/2026-09-25-lesson-videos.md:1016-1017`).

   El texto propuesto (`fichas/V14-s2m4-decisiones.md:45-75`) es correcto y solo es texto: no hay id, opción ni
   respuesta que cambie, `src/data/content.test.ts` no fija texto de s2m4, y `j.alvarez` y la salida del 5-3 no salen
   en ningún otro sitio de `src/` ni de `video/` (solo en el registro). El párrafo `:887` («staging y exfil de
   1,2 GB») sigue valiendo. Tres notas para quien lo aplique:
   - **Zona horaria (menor, solo para el registro).** Poner 09:41 (fuente UTC) y 09:44 (cadena del EDR «sin zona»)
     en el mismo bloque da por hecho que el EDR de `ENG-WS-041` va en UTC. Encaja con V3, cuyas líneas del mismo
     sensor llevan `Z` (`video/diamond-e7/src/data/s03-victim.ts:25-45`), y cierra la advertencia de las filas 39-40
     del registro (§2). El registro tiene que decirlo así; la frase «nunca tres minutos después» de V13 puede quedarse.
   - **El 7-3 es sábado.** Staging a las 00:52 y salida a las 01:47 de la madrugada del sábado: verosímil, pero es un
     dato nuevo para §2.
   - **E9 decía «misma metodología»** que E7, y la metodología de E7 es «beacon HTTPS, jitter 60s»
     (`src/data/s2.ts:570`; `video/diamond-e7/src/scenes/S10Thread.tsx:83`). Una salida hacia
     `transfer-cdn-eu.example` es otro destino. Para no forzarlo, el vídeo deja la salida sin destino, como ya hace;
     el registro lo apunta como hueco menor.

2. **bloquea si se va por el plan B sin tocar E9 · s01, s02 y s08.** La ficha dice que la pantalla aguanta un «no»
   (`fichas/V14-s2m4-decisiones.md:21-25,79-83`), pero no del todo. Con la lección como está, la ficha de E9 diría
   «07-03 · Actions on Objectives · compresión en una carpeta temporal · salida grande»
   (`fichas/V14-s2m4-ficha.md:75`) justo debajo de un bloque que pone el staging el 4-3 y la salida el 5-3
   (`src/data/s2.ts:876-877`). Quien lea las dos cosas verá dos salidas de datos, o una contradicción.
   **Arreglo para el plan B:**
   - E9 es la ficha de V3 al pie de la letra: «E9 · 2026-03-07 · +2 días · misma metodología · Actions on Objectives»
     (`video/diamond-e7/src/scenes/S10Thread.tsx:80-84`), sin contenido.
   - En s08, lo que se proyecta sobre el hueco de Orbital es «lo que vino después en Meridian: Actions on Objectives»,
     y el plan de s09 sale del check de la lección («archive staging in temp paths and large outbound transfers»,
     `src/data/s2.ts:929`), sin fecha.
   - Con el plan A (Lidia dice que sí), la ficha se queda como está.

3. **conviene · concepto 4 y s08 («ya sabes qué escena viene»).** La imagen del concepto dice «ya sabes qué escena
   viene» (`fichas/V14-s2m4-ficha.md:67`). Lo que se hereda son **hipótesis que compruebas**, no lo que va a pasar:
   «testable hypotheses» (s2m4q5, `src/data/s2.ts:1011`). Además, la lección exagera en `:902` («te dice
   **exactamente** qué buscar»), y la voz no debe copiar ese «exactamente».
   **Arreglo:** «Ya tienes una buena pista de la escena que viene: no la sabes, la compruebas.» Las dos ramas
   discontinuas de s08 ya ayudan; el nombre ACTIVITY-ATTACK GRAPH debería caer cuando aparecen ellas («lo que podría
   hacer»), no sobre la superposición, que es heredar hipótesis del grupo.

4. **menor · s08 («las cuatro primeras fases coinciden»).** Las cuatro primeras de la kill chain son Reconnaissance,
   Weaponization, Delivery y Exploitation (`fichas/V14-s2m4-ficha.md:81`). Las que coinciden son de Delivery a C2.
   **Arreglo:** «las fases de la entrega a la llamada a casa coinciden y se enlazan».

5. **menor · s05 (detectar frente a agrupar).** «Para detectar: lo que le cuesta cambiar · para agrupar: además, que
   sea raro» (`fichas/V14-s2m4-ficha.md:78`). Para detectar también importa lo raro: una regla sobre algo que hace
   todo el mundo da falsos positivos. Lo que separa a V7 de esta lección es cuánto **dura** la detección.
   **Arreglo:** «para que una detección dure: lo que le cuesta cambiar · para agrupar: además, que sea raro».

6. **menor · tarjeta de s04.** «Enlace fuerte: raro y caro de cambiar, como un PDB» deja fuera la palabra que lo hace
   fuerte: la lección y s2m4q2 dicen «PDB path **único**» (`src/data/s2.ts:834,840,968`). Hay rutas PDB genéricas
   que no unen nada.
   **Arreglo:** «Enlace fuerte: raro y caro de cambiar, como un PDB único» (56).

7. **menor · plan de recorte.** «Se recorta primero s05 (las filas débiles caben en s04)»
   (`fichas/V14-s2m4-ficha.md:31`; decisiones `:119`). Fundir s05 en s04 junta dos tarjetas en una escena (s04 y s05
   llevan una cada una), y el límite es una por escena.
   **Arreglo:** si se funden, la tarjeta de s05 se cae (quedan 6, dentro de 5–8), o se recorta antes s07.

8. **menor · s03 (las flechas de Orbital).** Las líneas llevan «->» en ASCII (`src/data/s2.ts:880,883`). No es un
   símbolo prohibido, pero V7 y V13 dibujan la flecha como conector.
   **Arreglo:** conector dibujado, como en V7 (`video/attack-piramide/src/scenes/parts/ProcessTree.tsx:40`).

9. **menor · registro (Orbital comparte sus eventos).** Que Orbital le pase sus eventos a Meridian el 9-3 es puntual y
   no choca con el hueco PIR-3 del CMF de S3, «¿Algún proveedor de Meridian ha sido comprometido…? · SIN FUENTE»
   (`src/data/s3.ts:64,76`), siempre que no se presente como una fuente fija. La ficha ya dice «no se dice cómo ni
   quién» (`fichas/V14-s2m4-ficha.md:148`). El registro debe apuntarlo así.

10. **menor · registro (la variante 1 del Lab 3B).** Con el plan A, `4c81...b3` y `9f3a...e1` llevan la ruta PDB, así
    que la «variante 1, la del incidente de Meridian» (`src/data/labs.ts:819`) pasa a ser una familia de
    compilaciones, no un solo binario. El registro (§7, V7) dice hoy que la variante 1 es `9f3a`. Hay que reescribirlo
    como «la variante 1 = las compilaciones con PDB: `4c81` (2-3) y `9f3a` (5-3)». El nombre `VC_Loader_v1.dll` sigue
    abierto, como dice la ficha.

**Lo que la ficha pedía comprobar y queda bien:**
- «Hoy» = lunes 9-3: es lunes y no choca con el registro. Las fichas de E7 y E9 de s01 copian las de V3 campo por
  campo (`video/diamond-e7/src/scenes/S10Thread.tsx:66-86`). Lo siguiente del registro es el indicador del ISAC del
  11-3, que V14 no toca, y V9 no lleva fecha.
- Las definiciones: thread, uno por víctima y en orden de fase y tiempo (s2m4q1 y q8); grupo, hilos unidos por rasgos
  justificados (s2m4q6); agrupar no es atribuir (`src/data/s2.ts:859`); la ruta PDB es rara y cara de cambiar, nunca
  imposible; los dominios y el HTTPS al 443 no discriminan (`:895-896`).
- Los tres mensajes son errores reales, y el segundo encaja con «Mi nombre no lo sabrás» de V3
  (`video/diamond-e7/narration.json:142`).
- El grupo se queda sin nombre: VELVET CICADA no aparece hasta V8 (2-7) y su nombre es un hallazgo del Lab 3A
  (`src/data/labs.ts:688-691`). Cluster-A y Cluster-B no salen.
- Inserción entre el último check (`src/data/s2.ts:923-937`) y el callout de campaña (`:938-943`), sin destripar el
  «intenta decidir» de `:865`. La tarea, las preguntas de la lección, porque ningún laboratorio de S2 agrupa.
- Producción: GLASS VIPER con la voz de V3 y V7 (Pablo con `machine`) y la música de V4 a V9, como V13. La sesión
  con V15 no necesita ninguna voz nueva (V15 usa la de HOLLOW LANTERN en V4 y V8).
- Lab 2A, 2B y 2C sin tocar: ni RAR, ni 650 MB, ni la cuenta VPN, ni vértices, ni nombres de Courses of Action.

---

## V15 · s3m2 · «Lo que cuenta una muestra: triaje de malware en sandbox»

1. **conviene · tarjeta de s02.** «Muestra dirigida: busca el hash; subirla avisa al actor»
   (`fichas/V15-s3m2-ficha.md:90`) da por seguro lo que la lección dice con «puede»: subirla «**puede** avisar al
   adversario» (`src/data/s3.ts:316`). s3m2q10 habla de un equilibrio: «upload only if the intelligence gain
   outweighs…» (`src/data/s3.ts:551`). Una tarjeta es lo que se lleva quien estudia para el examen.
   **Arreglo:** «Muestra dirigida: busca el hash; subirla puede avisarle» (55). En voz, «nadie la ha subido nunca»
   (`fichas/V15-s3m2-ficha.md:181`) pasa a «nadie la ha subido **ahí**»: que no esté en un servicio no dice nada de los
   demás.

2. **menor · s05 (respuesta al segundo mensaje).** «Bloquea esos dos, analista. Tengo más esperando su turno.» La
   respuesta de la ficha (`fichas/V15-s3m2-ficha.md:106-112`) es buena, porque no promete que la muestra lleve a
   compilaciones futuras. Pero puede dejar la idea de que bloquear no sirve, y el triaje de s04 acaba justo
   bloqueando esos dos.
   **Arreglo:** empezar la respuesta con «Bloquearlos sigue valiendo: le obligas a gastar otro». Después, lo de la
   ficha.

3. **menor · imagen de s04 («la casa»).** «Las que la casa hace sola» (`fichas/V15-s3m2-ficha.md:74`) usa la palabra de
   la imagen principal de V13, donde la casa es Meridian, y las dos se graban en sesiones seguidas.
   **Arreglo:** «un teléfono de prestado donde apuntas cada llamada: las del invitado y las que el propio teléfono hace
   solo (poner la hora, comprobar si hay cobertura)». No cambia nada más de la escena.

4. **menor · s05 (el import `MapViewOfSection`).** La línea `Imports` del informe (`src/data/s3.ts:333`) trae
   `MapViewOfSection`, que no es una función que exporte Windows en modo usuario: existen `NtMapViewOfSection` y
   `ZwMapViewOfSection` (ntdll) y `MapViewOfFile` (kernel32). En el examen no cae, pero quien sepa de Windows lo verá
   en pantalla.
   **Arreglo (opcional, para el PR de V15):** `src/data/s3.ts:333` pasa a `NtMapViewOfSection, CreateNamedPipeA,
   CreateProcessA`, y el vídeo lo enseña igual. La regla YARA de S5 (`$api = "MapViewOfSection"`,
   `src/data/s5.ts:507`) sigue funcionando, porque YARA busca la cadena dentro de `NtMapViewOfSection`. Si Lidia no
   quiere tocar la lección, el vídeo copia la línea tal como está.

5. **menor · s05 (el imphash).** «El imphash agrupa la familia por toolchain» está bien como síntesis de la lección
   (`src/data/s3.ts:298,348`). En voz, mejor «**apunta** a la familia» que «demuestra»: con tablas de imports pequeñas
   o con binarios empaquetados, el imphash se repite en ficheros que no tienen nada que ver.

6. **menor · plan de recorte.** Si el estimado pasa de 255 s, la ficha quita primero la frase de la fecha de
   compilación (`fichas/V15-s3m2-ficha.md:44-46`; decisiones `:69-70`). Pero la regla 3 del cierre la nombra («la
   fecha de compilación, no»), y sin esa frase el cierre recordaría algo que nadie ha explicado.
   **Arreglo:** recortar en este orden:
   1. la frase del pipe de s03, que no es un concepto y la propia ficha ya da por prescindible (decisiones `:71-72`);
   2. la del C2 de repuesto de s04;
   3. solo al final, la fecha.

7. **menor · forma.**
   - El bloque de inserción lleva `title,` sin valor (`fichas/V15-s3m2-ficha.md:51`); debe ser `title: 'Lo que cuenta
     una muestra: triaje de malware en sandbox'`.
   - Los encabezados «Exam cards» y «Think prompt» (`:88,94`) son justo lo que el encargo de las fichas pide evitar:
     «Tarjetas de examen» y «Pregunta para pensar», como V13 y V14.
   - «Lista de certificados de Windows» (`:84,96`) para `ctldl.windowsupdate.com`: la lección dice «CRL/CTL»
     (`src/data/s3.ts:343`); más exacto, «certificados de confianza de Windows».

**Lo que la ficha pedía comprobar y queda bien:**
- Estático y dinámico, la regla de OPSEC, los cinco hosts, imphash, ssdeep, PDB y fecha de compilación: todo está en
  la lección antes de `src/data/s3.ts:349`. La fecha como enlace débil sale de s3m2q7 («trivially forged and weak as
  links», `src/data/s3.ts:512`).
- El PDB siempre en condicional y «si otra muestra trae la misma»: es más exacto que el «link fuerte» de un solo
  binario de `src/data/s3.ts:348`.
- Dejar fuera la evasión del sandbox: el plan no la pide (`docs/superpowers/plans/2026-09-25-lesson-videos.md:1524`) y
  la lección no la enseña.
- Lab 3B sin tocar: no salen `vc_stage2.bin`, ni los bytes, ni el user-agent, ni `kernel32.dll`, ni los nombres de
  las variantes (`src/data/labs.ts:771-842`). La ruta PDB ya la enseña la lección. Lab 3A y Lab 3C tampoco quedan
  destripados.
- Las voces y la música son las de V4 y V8 (Pablo con `machine`), y HOLLOW LANTERN es el adversario de S3. Los dos
  mensajes no contradicen sus cuatro mensajes publicados.

---

## Entre fichas

1. **La imagen del PDB, una sola para las tres: «la etiqueta del taller» (conviene).**
   - **Qué es.** Una etiqueta pequeña, por dentro, que dice dónde se hizo la pieza. Se dibuja con **un solo
     componente**, idéntico en los tres vídeos y con la ruta PDB en monoespaciada. Lo que cambia es dónde va: dentro
     de la caja en S2 (V13, V14) y cosida en el cuello de la prenda en S3 (V15). «Taller» sirve para las dos cosas
     (taller del ladrón y taller de costura), así que V15 cambia el sastre por el taller y conserva su prenda, que
     enlaza con la «ropa» de V7.
   - **Por qué esta y no otra.** El taller ya es el sitio de Weaponization en V13 (el entorno donde el atacante monta
     la caja), y la ruta PDB es justo eso, una huella del entorno de desarrollo (`src/data/s2.ts:840`). Se descartan:
     - «firma» y «sello», porque se confunden con la firma de código, que V15 deja fuera a propósito;
     - el «acento» de V7, porque mide lo que cuesta cambiar algo, no de dónde sale (V14 ya lo descarta por eso).
   - **Frase común en voz** (V14 en s04, V15 en s05, palabra por palabra): «Al compilar, a veces se queda escrita
     dentro la carpeta donde se hizo. Es como la etiqueta del taller, por dentro. No siempre la lleva. Pero si otra
     trae la misma, salen del mismo taller.» Solo V15, que la lleva en una prenda, añade «cosida en el cuello»; en la
     caja de V14 va pegada, y el verbo no se dice.
     V13, si se acepta el punto 6 de su sección: «y a veces, por dentro, hasta la etiqueta del taller donde la montó».
   - **En pantalla:** «la etiqueta del taller» y, para la regla, «si otra trae la misma: mismo taller · enlace fuerte».
   - **Nunca:**
     - «la etiqueta» a secas: V7 ya llamó así al disfraz del nombre de la tarea, «la llave con su etiqueta de
       "revisión del gas"» (`video/attack-piramide/narration.json:77`);
     - «etiqueta de envío» para las cabeceras del correo en V13 o V14: es la imagen de V1 (Security+,
       `video/capas-halden/narration.json:47`), y la caja acabaría con dos etiquetas;
     - «no la puede quitar» ni «todas la llevan».
   - **«No siempre la lleva» en V14 y en V15.** V14 dice hoy que «nunca dice que una variante pueda no llevarla»
     (`fichas/V14-s2m4-ficha.md:143-144`), y V15 la pone en condicional. Manda el condicional, por dos motivos:
     - es lo exacto, porque la ruta se puede quitar al compilar;
     - no destripa el Lab 3B: el laboratorio ya imprime «raro» y «(solo variante 1)» junto a esa cadena
       (`src/data/labs.ts:775`; `src/components/labs/YaraLab.tsx:86-90`), y su solución está en otra cadena.
   - **Líneas de las fichas que cambian:**
     - **V13:** `:65-70` (la imagen: «y dentro del aparato, a veces, la etiqueta del taller»; «el taller vuelve en
       V14 y V15»), `:76` (imagen del concepto 3), `:89` (s05: la tercera pista con el dibujo de la etiqueta) y `:168`
       (canon: «la etiqueta del taller = ruta PDB, también en V14 y V15»). En decisiones, `:18-21`.
     - **V14:** `:65-66` (añadir «no siempre la lleva»), `:77` (s04, la frase común), `:143-144` (Lab 3B: «dice "no
       siempre la lleva", que es exacto y el laboratorio ya lo enseña»). En decisiones, `:26-30` (imagen) y
       `:104-106`, `:116-118` (riesgos: la frase común en vez de la propia).
     - **V15:** `:75` («la etiqueta del sastre… provisional» pasa a «la etiqueta del taller, cosida en el cuello»),
       `:85` (s05: «mismo sastre» pasa a «mismo taller») y `:198-202` (canon: la imagen queda fijada). En
       decisiones, `:27-28` (decisión 4) y `:47-52` (el riesgo «a unificar» desaparece).

2. **La Víctima 1 de s2m4 (V14).** El choque está comprobado y la propuesta es correcta; ver V14, puntos 1 y 2.
   - **Si Lidia dice que sí:** el registro recibe lo que lista `fichas/V14-s2m4-decisiones.md:85-96`, más tres cosas:
     - las horas del EDR de `ENG-WS-041` pasan a UTC (V14, punto 1);
     - el staging y la salida, el sábado 7-3;
     - «PO revision» se queda como **el mismo señuelo, no la misma ola**: la campaña de S4 y el aviso de S5 son
       phishing de credenciales contra portales de proveedores (`src/data/s4.ts:1033-1035`;
       `src/data/s5.ts:56-58`), y lo de Orbital es un adjunto que ejecuta código (`src/data/s2.ts:880-881`).
   - **Si dice que no:** E9 se queda como la ficha de V3 (V14, punto 2).

3. **Lab 2A, «An HR analyst opens the LNK» (`src/data/labs.ts:243`), frente a la cadena en `ENG-WS-041`
   (`src/data/s2.ts:76-78`).** Confirmado: ningún vídeo se mete en eso.
   - **V13.** Ni «RR. HH.» en pantalla ni línea `To:`. La voz dice «en una estación de ingeniería, alguien lo abre»,
     que es lo que registra la lección en su EDR, sin persona ni puesto.
   - **V14.** «Se abre el adjunto». El texto propuesto para la lección dice «LNK runs on ENG-WS-041», sin
     destinatario (`fichas/V14-s2m4-decisiones.md:58-59`).
   - **El punto 5 de §5 sigue abierto,** pero ningún vídeo nuevo lo agrava. La tarea final de V13 (Lab 2A) no queda
     destripada (ver V13, punto 5 y «queda bien»).

4. **V15: firma, fecha de compilación, pipe y Lab 3B.**
   - **La firma: queda bien.** El extracto sin la línea `Signing cert` (`src/data/s3.ts:334`) es la salida correcta
     frente al `signed=false` de V3 (`video/diamond-e7/src/data/s03-victim.ts:32`). Explicarlo congelaría una lectura
     que el registro no ha decidido (§5, punto 2). Dos cuidados:
     - el rótulo del informe debe decir «extracto», porque el informe completo está justo encima, en la lección;
     - la tira de s01 va sin el campo `signed`, como V7.
   - **La fecha de compilación 2026-02-19 (`src/data/s3.ts:331`): queda bien.** V7 no dice cuál de las dos
     compilaciones es anterior (registro §7) y V15 no compara la fecha con nada. `4c81...b3` no sale.
   - **El pipe `vc_pipe_4f8a1c9e` junto al `vc_pipe_3a7f09c1` de E7: queda bien.** El registro ya da las dos instancias
     del formato `vc_pipe_%08x` (§3; `src/data/s3.ts:337`; `video/diamond-e7/src/data/s03-victim.ts:38`). Pero son dos
     ejecuciones de **la misma** compilación: no demuestran lo que dijo V3, que el patrón sigue ahí al recompilar
     (`video/diamond-e7/narration.json:97`). La voz no puede apoyarse en este par para eso: «mismo formato, otro
     número, en cada ejecución». Es la primera frase que se recorta (V15, punto 6).
   - **Lab 3B: queda bien,** con la regla del condicional del punto 1.

5. **El «hoy» de V14 (lunes 9-3) y el contenido de E9.**
   - **Fechas: cuadran.**
     - V3: E9 el 7-3, «+2 días», «misma metodología», Actions on Objectives.
     - V7: las dos fotos, del 2-3 y del 5-3.
     - V9: sin fecha.
     - El registro (§2) no tiene nada entre el 9-3 de Orbital y el 11-3 del ISAC.
   - **El contenido de E9 («compresión en una carpeta temporal · salida grande»):** solo con el plan A. Con el plan B,
     la ficha de V3 tal cual.
   - **Días de la semana:** el 9-3 es lunes; el 7-3, sábado.

6. **Las referencias a `src/data/s4.ts` del registro están desfasadas: confirmado.** El commit `e4d3a79` (el vídeo de
   V9) metió 7 líneas en `src/data/s4.ts:503-509`, y el registro, actualizado en ese mismo commit, no movió las
   referencias de más abajo. Las tres cifras del coordinador son buenas: intrusion set `:1023-1025` (`name` en `:1023`,
   `first_seen` en `:1025`) y campaña `:1033-1035`. Tabla completa, todas con +7:

   | Registro (línea) | Dice | Debe decir | Qué es |
   |---|---|---|---|
   | §2 `:27` | `s4.ts:1018` | `:1025` | `first_seen` del intrusion set |
   | §2 `:28`, `:52`; §5 `:279` | `s4.ts:732` | `:739` | fila «Actividad» de los clusters |
   | §2 `:36` | `s4.ts:1026-1028` | `:1033-1035` | campaña «PO-REVISION phishing wave» |
   | §3 `:82` | `s4.ts:723` | `:730` | «Orbital-2» |
   | §3 `:113` | `s4.ts:731` | `:738` | IP solapada, 300+ dominios |
   | §3 `:124` | `s4.ts:1026` | `:1033` | campaña STIX |
   | §3 `:166`; §5 `:288` | `s4.ts:1016` | `:1023` | `"name": "GLASS VIPER"` |
   | §3 `:171` | `s4.ts:1019-1020` | `:1026-1027` | `resource_level`, `primary_motivation` |
   | §3 `:172`; §7 `:513` | `s4.ts:722-737` | `:729-744` | tabla Cluster-A frente a Cluster-B |
   | §5 `:284` | `s4.ts:814,1016,1048` | `:821,1023,1055` | GLASS VIPER como grupo de vendor, set STIX y «you track as» |
   | §7 `:448` | `s4.ts:1013-1021` | `:1020-1028` | el objeto intrusion set entero |

   Las referencias anteriores a la línea 503 (`:420-437`, `:429`, `:431-432`, `:503`) están bien. Las de
   `src/data/s3.ts` y `src/data/s5.ts` que he comprobado también: `s3.ts:1048,1053,1063-1070,1076` y
   `s5.ts:47,56-58,312,497,502,509,531,555,600-605,615`.

7. **Resumen de lo que recibe el registro al aprobarse la tanda:**
   - las líneas de `s4.ts` de la tabla anterior;
   - la imagen común del PDB («la etiqueta del taller») en §7 de V13, V14 y V15;
   - con el plan A de V14, todo lo del punto 2 y la variante 1 del Lab 3B como familia (V14, punto 10);
   - en §5, punto 2, que V15 enseña el informe sin la línea del firmante.
