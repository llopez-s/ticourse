# Revisión de exactitud y canon · V7, V8 y V9 (GCTI, VELVET CICADA)

> Revisión de la primera versión de las fichas. Sus arreglos ya están aplicados en el plan; se guarda por las citas
> (ruta:línea) que necesitará el revisor de exactitud del guion.

Revisión de solo lectura del 2026-10-01. Rutas relativas a `D:\LLM projects\TICourse`. Los límites numéricos no se
repiten: ya los comprobó el script.

**Cómo se lee la gravedad.**
- **bloquea**: algo falso en pantalla o en la voz que quien lo vea se llevaría al examen, o un dato de canon que un
  vídeo publicado dejaría congelado en contra de una lección.
- **conviene**: un arreglo correcto que se hace cambiando una frase, o una decisión del registro que hay que tomar
  antes de publicar.
- **menor**: pulido.

---

## V7 · s2m5 · «Del comando al TTP: ATT&CK y la Pyramid of Pain»

1. **bloquea · s05 «Tres días después» (y el cierre, si repite la idea).** En ámbar, como «la ropa», salen juntos
   **nombre, carpeta y hash**. Pero en la pirámide solo el hash está en la base. Las rutas y los nombres son
   artefactos, en el peldaño 4:
   - La tabla de la lección pone las rutas en ese peldaño: `src/data/s2.ts:1136` («reconfigurar artefactos
     (user-agents, **paths**, claves de registro)»).
   - El árbol manda el nombre de la tarea a Host artifact: `src/data/s2.ts:1170`.
   - La propia s04 de V7 sube `WindowsUpdateCheck` a Host artifacts, o sea, al «acento».
   - V3 ya dejó el «acento» para un artefacto que sobrevive a recompilar (`video/diamond-e7/narration.json:97`).

   Así, el mismo vídeo llamaría «acento» a un nombre (el de la tarea) y «ropa» a otro (el del ejecutable), justo en
   el concepto que se examina (s2m5q2, `src/data/s2.ts:1246-1255`).
   **Arreglo:** en ámbar, solo el hash, con la etiqueta «la ropa». El nombre y la carpeta van en un segundo tono, con
   la etiqueta «artefactos: también cambiaron, con más trabajo». En voz, algo como «cambió de ropa, y hasta de
   acento. Lo que no se ha cambiado es la forma de andar».

2. **conviene · s05 y «Canon nuevo» (dos compilaciones).** El vídeo presenta como un hecho que `4c81...b3` y
   `9f3a...e1` son «otra compilación del mismo loader». Pero lo único que V7 enseña igual en las dos fotos es el
   dominio. En S2 sí existe una prueba fuerte, el PDB (`src/data/s2.ts:37,840`), pero V7 no puede usarla sin tocar el
   dosier de BROKEN CHAIN (`src/data/course-gcti.ts:40`). Las que no lo tocan, el imphash y el ssdeep, llegan en s3m2
   (`src/data/s3.ts:329-330`). Así que la cautela no sale de que al curso le falte la idea, sino de la regla de no
   destripar el dosier. Un curso de CTI no debería sacar esa conclusión de un solo dominio compartido.
   **Arreglo:** que la voz lo diga con cautela: «otro binario, que habla con el mismo dominio; todo apunta a otra
   compilación del mismo programa». En el registro, «dos compilaciones» se apunta como la lectura del caso, no como
   algo que el vídeo demuestre. La lección de la pirámide no cambia: la regla por hash no ve el otro binario, sea
   cual sea su origen.

3. **conviene · s02 (escalera) y s03.** El peldaño dice `TECHNIQUE T1053.005`, pero `T1053.005` es una
   **sub-technique** de `T1053 Scheduled Task/Job`:
   - la lección habla de «Techniques/Sub-techniques» (`src/data/s2.ts:1109`);
   - un check usa «Sub-technique» como distractor (`src/data/s2.ts:1225`).

   **Arreglo:** cambiarlo solo en pantalla, así: «TECHNIQUE · T1053 Scheduled Task/Job · sub-technique .005
   Scheduled Task». La voz puede seguir diciendo «la técnica». No hace falta tocar ninguna tarjeta.

4. **menor · s04 (peldaños en gris).** «Tools» queda en gris «sin nada del árbol», pero el certutil renombrado es
   justo lo que s2m5q8 trata como un cambio de herramienta (`src/data/s2.ts:1335-1344`). Y la razón que da «No se
   toca» para dejar la IP fuera («no es un servidor del actor») mezcla la calidad del indicador con su peldaño: una IP
   compartida sigue siendo del peldaño IP, solo que es un mal indicador.
   **Arreglo:**
   - Que la voz no diga que no hay herramientas. Si cabe, `wcssvc.exe (CertUtil)` va en Tools.
   - La IP sale en gris porque el árbol no trae ninguna, no porque sea compartida. Esa razón no se dice en voz.

5. **menor · s05 (la regla).** En el árbol, `schtasks` cuelga de `winhlp.exe`, no de PowerShell
   (`src/data/s2.ts:1158-1167`). La regla «PowerShell lanzado por explorer crea una tarea programada no
   inventariada» (`src/data/s2.ts:1179`) solo encaja si se lee sobre toda la cadena.
   **Arreglo:** que la animación recorra la cadena entera, de `explorer` hasta `schtasks`, antes de que salte en
   `09:44:20`. La voz dice «en la cadena que arranca ese PowerShell».

Los riesgos que la ficha pedía comprobar y que quedan bien: la hora única `09:44:20` sale de `src/data/s2.ts:81`; el
dominio «de momento» no afirma nada del 5-3 que V3 no enseñe; que el equipo estuviera casi tres días dentro sin que
nadie lo viera cuadra con V3 («un dominio que nadie conoce», `video/diamond-e7/narration.json:21`).

---

## V8 · s3m5 · «¿Bloqueo este dominio? Indicadores, STIX y TAXII»

1. **conviene (pasa a bloquea si el guion mantiene la frase) · s03 y «Canon nuevo» (la búsqueda hacia atrás).** El
   rótulo dice «retro-hunt · correo, DNS y proxy · desde el 27-02» y la corrección al mensaje dice que «lo que hizo
   con ese dominio sigue en tus registros». Choca con el CMF de Meridian, que es de esta misma sección:
   - el proxy guarda **30 días** y el EDR **90** (`src/data/s3.ts:68-69`; el lab2c también habla de «90 days of EDR
     telemetry», `src/data/labs.ts:353`);
   - el dominio no se ve desde el 2026-04-18 (`src/data/s3.ts:776`).

   El 2026-07-02, el proxy solo guarda desde principios de junio: en el registro donde caería un acierto de dominio
   ya no queda nada.
   **Arreglo:**
   - Quitar «proxy» del rótulo, o dejarlo en gris con «30 días · ya no llega».
   - Voz: «lo que hizo con él puede seguir en tus registros, **hasta donde llegue lo que guardas**; por eso se busca
     ya».

   Además, es un momento de examen gratis: la búsqueda hacia atrás vale lo que dure lo que guardas.

2. **conviene · s03 (respuesta a la pregunta) y «Canon nuevo» (la revalidación).**
   - La respuesta dice que bloquearlo a ciegas «puede castigar a **quien lo tenga ahora**». El canon del propio V8
     fija que el registro no cambia hasta el 2027-02-27 (`src/data/s3.ts:765`): hoy no lo tiene nadie más. La lección
     dice «a quien **herede** ese dominio» (`src/data/s3.ts:1076`).
   - Si la revalidación incluye «el WHOIS sigue igual», la excepción de la lección («unless you re-validate the domain
     is still actor-controlled», `src/data/s3.ts:1084`) juega a favor de bloquear.

   **Arreglo:**
   - «a quien lo tenga ahora» pasa a ser «a quien lo herede».
   - La revalidación que se ve se queda en el passive DNS, como ya está en la ficha.
   - En el canon, la frase del WHOIS se apunta como límite de lo que puede decir la voz (solo «puede cambiar de
     manos»), no como algo que «cuadra» con el mensaje.

3. **conviene · Enfoque y s01 (la frase de puente).** «Hasta ahora su rastro lo seguías tú, y hoy te lo pasan otros»
   no es verdad en el caso:
   - el CMF ya tiene al ISAC como fuente de avisos y a los vendors como fuente de informes (`src/data/s3.ts:73`,
     `src/data/s3.ts:33`);
   - la prueba E4 de V9 se basa en un informe del ISAC (`src/data/s4.ts:431-432`).

   **Arreglo:** «hasta ahora lo seguías sobre todo con tus datos; hoy te llega un aviso de fuera, en STIX».

4. **menor · s02 (la tarjeta).** «Listo para ingerir: patrón, validez, confianza y fuente» sale antes de que se
   enseñe `valid_until`, y la regla es primero el ejemplo y después la tarjeta.
   **Arreglo:** que la tarjeta salga después del calendario y antes de la pregunta. O, sin moverla, que diga
   «...confianza, fuente y fecha» y que el calendario esté ya en pantalla.

5. **menor · s01 y s03 (a qué se refiere la decisión).** El 2026-07-02, el indicador propio de Meridian para este
   mismo dominio sigue vigente: es del 18-4, vale hasta el 18-7 y tiene confianza 80 (`src/data/s5.ts:600-606`). La
   ficha ya evita enseñar sus fechas.
   **Arreglo:** que la voz hable siempre de «**este aviso**» y nunca diga «el dominio no se bloquea». El botón que
   late, en la tarjeta del objeto entrante, no en el nodo del dominio.

### Los cambios que V8 propone para la lección

Los tres son correctos y los recomiendo. Solo tocan texto: no cambia ningún id, ni el número de opciones, ni ninguna
respuesta. `src/data/content.test.ts` no fija ningún texto (la suite de vídeos, `:248-320`, solo mira bloques y
archivos), así que no se rompe nada.

- **`used-by` pasa a `uses`.** STIX 2.1 no tiene ese tipo de relación: se dice `intrusion-set` `uses` `malware`. Hay
  que cambiarlo en dos sitios; en `src/` y en el registro de canon no aparece en ningún otro (el resto del repo no lo
  he buscado):
  - `src/data/s3.ts:1048`: «…con un objeto `malware` (el loader); a su vez, un `intrusion-set` (VELVET CICADA) se
    conecta con ese malware mediante otra `relationship` («uses»). El contexto viaja con el dato.»
  - La explicación de s3m5q10, `src/data/s3.ts:1294`: «indicator → indicates → malware, and intrusion-set → uses →
    malware.»
- **«empuja» pasa a «recoge».** La lección se contradice a sí misma: dice que el ISAC «empuja» (`src/data/s3.ts:1053`),
  pero después dice que el TIP hizo *pull* (`:1076`) y el check dice «polled a collection» (`:1096`). Texto nuevo para
  `:1053`: «El ISAC aeroespacial publica este objeto STIX 2.1 en una colección TAXII, y tu TIP lo recoge (*pull*).»
  Hay que cambiar también la fila del 2026-03-11 del registro (`docs/superpowers/canon/velvet-cicada.md:50`).
  `src/data/s5.ts:586` habla de «canales *push*»; los channels no están definidos en TAXII 2.1, pero es de otra
  sección y no afecta al vídeo, así que puede esperar.
- **Añadir `modified`.** STIX 2.1 lo exige en todos los objetos de ese tipo; es el único obligatorio que le falta al
  indicador. Se pone `"modified": "2026-03-11T08:00:00Z"` debajo de `created` en `src/data/s3.ts:1063`, y el vídeo
  lo enseña igual. Dos avisos:
  - **Justificarlo por lo que dice arriba**, obligatorio y examinable, no como «para que el JSON sea válido». Los
    identificadores (`…-meridian0052`, `identity--aero-isac-share-0001`) no son UUID, y
    `marking-definition--tlp-amber-strict` no es el identificador oficial de TLP 2.0. Son simplificaciones del curso
    y se pueden dejar.
  - Los JSON de S4 y S5 tienen el mismo hueco (`src/data/s4.ts:1013-1040` sin `created`/`modified`;
    `src/data/s5.ts:596-616` sin `modified`). Arreglarlos es opcional y no bloquea V8.

Los riesgos que la ficha pedía comprobar y que quedan bien:
- «Primera consulta» no choca con nada: el ISAC ya era fuente de avisos (`src/data/s3.ts:73`), pero no por TAXII.
- El 2026-07-02 es jueves.
- Una semana exacta entre el 25-6 y el 2-7.
- TLP:AMBER+STRICT quiere decir «solo dentro de la organización».
- La confianza va de 0 a 100 y no es una probabilidad.
- Las direcciones de `indicates` y `uses` son las buenas.

---

## V9 · s4m3 · «ACH: gana la hipótesis que no puedes tumbar»

1. **conviene · s01 (la pizarra).** La nota de E4 dice «certificado TLS compartido con una campaña de espionaje
   **del ISAC**». Así parece que la campaña es del ISAC. La lección dice «reportada por el ISAC»
   (`src/data/s4.ts:431-432`).
   **Arreglo:** «certificado TLS compartido con una campaña de espionaje que reportó el ISAC».

2. **conviene · s09 (la nota al CISO).** El campo «Confianza:» sale vacío, y dentro del documento del caso hay una
   remisión al curso («en la sección 5»). En cambio, la tarjeta del mismo vídeo y s4m3q6 (`src/data/s4.ts:590`) dicen
   que el informe lleva su confianza, y la lección ya habla de subirla o bajarla (`src/data/s4.ts:441`).
   **Arreglo:** «Confianza: moderada · 4 pruebas de un extracto; aguanta sin E4». La remisión a s5m2 va en una tira
   aparte, fuera de la nota.

3. **menor · la pregunta de s08.** La respuesta dice «E2 y E3 siguen tumbando a H2 y a H3», pero E2 no dice nada
   frente a H3 (es N; `src/data/s4.ts:429`).
   **Arreglo:** «E2 y E3 tumban a H2, y E3 tumba a H3: la cuenta queda en 0, 2 y 1».

**HALL OF MIRRORS.** Que la conclusión sea provisional basta; no hay que cambiar nada más:
- La lección ya da H1 como la menos inconsistente (`src/data/s4.ts:441`; s4m3q8, `:617-626`).
- La lección ya dice que PAPER CRANE ha sembrado señuelos (`src/data/s4.ts:441,507`).
- Lo que revela el dosier son las cadenas en cirílico, los horarios falsos y el «sistemático»
  (`src/data/course-gcti.ts:78`), y V9 no toca nada de eso.

Que el tercer mensaje salga pegado a la nota de E4 no sugiere que E4 se plantara más de lo que ya lo sugiere la
lección.

**Lab 4B.** Sí, V9 aporta el porqué y la demo sin repetir el laboratorio:
- `src/components/labs/AchLab.tsx` solo pide puntuar 24 celdas, llegar al 70 % de acuerdo con la solución y elegir.
  No toca los supuestos clave, el abogado del diablo, el razonamiento de la diagnosticidad, la sensibilidad ni el
  informe.
- La matriz que enseña V9 es la de la lección, con 12 celdas; no las 8 pruebas del laboratorio
  (`src/data/labs.ts:880-929`).
- El riesgo de la celda E3 frente a H3, que la ficha pedía mirar (I en la lección y N en la prueba parecida del
  laboratorio, `src/data/labs.ts:890`), no hay que tocarlo:
  - manda la lección;
  - es una celda de 24 y el laboratorio pide un 70 % de acuerdo (`src/components/labs/AchLab.tsx:36-37`);
  - la ficha ya evita dar una regla en voz para esa celda.

---

## Entre fichas

1. **¿Loader o implante? Son lo mismo.** El canon los usa como un solo objeto: «implante GLASS VIPER (stage-1
   loader)» (`src/data/s2.ts:576`), y V3 dice «es el implante GLASS VIPER, un loader»
   (`video/diamond-e7/narration.json:85`). El plan (P4) llama a `9f3a...e1` hash del implante; V7, compilación del
   loader: es la misma cosa.

   **Con s3m2 no choca.** La muestra `9f3a2c...e1` ya viene con variantes recompiladas (imphash compartido con 3
   muestras y un ssdeep del 94 %, `src/data/s3.ts:329-330`) y crea la misma tarea `WindowsUpdateCheck` (`:338`).

   **Con el Lab 3B no choca en pantalla**, pero hay que apuntarlo en el registro:
   - `9f3a` lleva el PDB (`src/data/s3.ts:332`), así que es la «variante 1, la del incidente de Meridian»
     (`src/data/labs.ts:775,819`).
   - `4c81` tiene que quedar como «rasgos estáticos sin definir, **no** es la v2», porque la v2 no es de Meridian
     (`src/data/labs.ts:826`).

   **Con V8 no choca**, porque V8 no enseña ningún hash.

   V7 exagera al decir que «resuelve el punto 1 de §5». Resuelve el nombre, la ruta y el hash, pero siguen abiertos
   el nombre `VC_Loader_v1.dll` del Lab 3B (§5.1) y cuántas muestras comparten PDB (§5.11,
   `docs/superpowers/canon/velvet-cicada.md:273-274`). Quien apunte V7 en el registro tiene que dejarlo dicho así.

   Que V7 no siga el «conviene unificarlos» de P4 (`docs/superpowers/plans/2026-09-25-lesson-videos.md:714`) está
   justificado: V3 ya tiene `updsvc.exe` en pantalla, y unificar el hash no arreglaría la ruta.

2. **Los nombres que V8 deja en pantalla: `malware · loader GLASS VIPER` e `intrusion-set · VELVET CICADA`.**
   - **Cuadra** con V7 (el loader, «el stage-1 de GLASS VIPER»), con V3 (un nombre de seguimiento del implante y de
     quien lo usa, `video/diamond-e7/narration.json:139`), con el texto que va justo al lado del vídeo
     (`src/data/s3.ts:1048`) y con `src/data/s3.ts:62,310,326`, `src/data/s4.ts:725` y `src/data/s4.ts:1001`.
   - **Choca** con `src/data/s4.ts:1016` (el intrusion set de STIX se llama «GLASS VIPER»), con `:1048` («you track as
     GLASS VIPER») y con S5 (`src/data/s5.ts:601,615`), donde el STIX propio de Meridian para **este mismo dominio**
     apunta directamente a ese intrusion set GLASS VIPER. Es el punto 9 de §5, pero V8 lo volvería concreto.

   La lectura que reconcilia más fuentes:
   - GLASS VIPER es el loader, más el nombre que usan los vendors y el ISAC (`src/data/s4.ts:814,932,1236`).
   - VELVET CICADA es el intrusion set en el modelo de Meridian.

   Con esa lectura, además, el `name` del JSON del ISAC que sale en V8 («GLASS VIPER phishing domain»,
   `src/data/s3.ts:1065`) tiene sentido.

   **Recomendación (conviene):** escribir esta decisión en el punto 9 de §5 antes de publicar V8. Aparte, va más allá
   de las fichas y lo decide Lidia: cambiar en `src/data/s4.ts:1016` el nombre a `"name": "VELVET CICADA"` y añadir
   `"aliases": ["GLASS VIPER"]`. `aliases` es una propiedad válida de `intrusion-set` en STIX 2.1. El enunciado de
   `:1048` pasaría a decir «you track as VELVET CICADA». Todo es texto: no cambia ningún id y ningún test se rompe.
   Con eso, el indicador de S5 apunta a un conjunto que se llama igual que en V8.

3. **El ISAC en V8 y en V9 es compatible.** V8 fija que la primera consulta TAXII es el 2-7, y la prueba E4 de V9
   viene de un informe del ISAC. Cuadra porque el ISAC ya mandaba avisos por otra vía (`src/data/s3.ts:73`). Hay que
   apuntarlo así en el registro: avisos del ISAC desde antes; TAXII, solo desde el 2026-07-02.

4. **menor · la llave sale en tres vídeos con tres sentidos distintos.** En V4 es el certificado («una llave hecha a
   mano», `video/pivot-infra/narration.json:186`). En V7 es la persistencia (la llave escondida en la maceta). En V9
   son los supuestos (palparse el bolsillo) y además es el icono de la promesa y del cierre. Quien vea el canal
   seguido puede liarse.
   **Arreglo:** que V9 cambie el icono, por ejemplo por una lista con una interrogación, y mantenga el gesto de
   palparse el bolsillo buscando el móvil o la cartera, no las llaves. La llave de V7 es la imagen que mejor encaja
   con su concepto.

5. **Lo que el registro tiene que recibir cuando se aprueben las fichas:**
   - «hoy = 2026-07-02 (jueves)» en la cronología;
   - la fila del 2026-03-11 cambiada de «empuja» a «publica / recoge»;
   - la resolución parcial del punto 1 de §5 que da V7, con lo que queda abierto (punto 1 de esta sección);
   - la decisión sobre el punto 9 de §5 (punto 2 de esta sección).
