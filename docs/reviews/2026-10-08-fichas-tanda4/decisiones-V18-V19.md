# Fichas V18 y V19 (tanda 4): decisiones para aprobar en una ronda

Fecha: 8 de octubre de 2026. Las fichas completas, listas para pegar en el plan de vídeos
(`docs/superpowers/plans/2026-09-25-lesson-videos.md`, §5, tras V17), están en esta carpeta: `ficha-V18.md` y
`ficha-V19.md`. Aquí van las decisiones que cada ficha ya toma, con la alternativa descartada, y los riesgos que debe mirar
quien escriba el guion y quien lo revise. Basta con decir qué cambia; lo que no se diga, queda como está. Rutas relativas a
la raíz del repo; `sp/` = `src/data/secplus/`, `registro` = `docs/superpowers/canon/glass-harbor.md`.

Son dos cápsulas de Security+ (SY0-701), perfil `capsula-yt`, de las filas 18 y 19 del ranking (backlog). Se graban en la
misma sesión: V18 con SILENT PAGER (voz de máquina) y V19 con RED MARROW (voz de teléfono), que no se confunden.

**Estado:** propuestas, sin revisar todavía por los dos subagentes de solo lectura (exactitud y canon, y naturalidad). Los
límites del validador sí están contados con un script de Node (apartado final de cada ficha). Aprobación pendiente.

## Lo que se decide entre las dos fichas

1. **Calendario: V18 el 1-10 (jueves), con el rescan el 5-10; V19 el 5-11 (jueves), con su mejora el 13-11.** Los dos
   encajan en huecos que el registro deja libres, y no tocan nada de V17, que se ha leído en su rama
   (`video-fronteras-halden`, 23, 25 y 27-11; el registro todavía no tiene su canon).

   | Ocupado (registro §2 y V17) | Qué |
   |---|---|
   | 1-10 y 5-10 | **V18** (informe del escaneo mensual y rescan) |
   | 2-10, 5-10, 8-10, 9-10, 13-10, 15-10 y 16-10 | V5b: mesa, copia de contactos, simulacro, permiso de aislar, caza, regla del SOC y conexión de servidores |
   | 19-10, 20 al 21-10, 23-10, 27-10 y 28-10 | V6 (accesos, jubilación, bóveda, préstamo) y V10 (spraying, traversal, amplificación DNS) |
   | 31-10 | plazo más largo de V5 |
   | 3-11 | V11 (criptografía) |
   | 5-11 y 13-11 | **V19** (revisión previa a publicar y su mejora) |
   | 9 al 12-11 | V12 (certificado del portal, intermedia y stapling) |
   | 16-11 y 20-11 | V16 (plano de zonas y su aprobación) |
   | 23, 25 y 27-11 | V17 (toma, túnel y comité) |
   | 30-11 y 1-12 | MFA del proveedor de identidad (V10); inicio por fases del plan de zonas (V16) |

   **Para quien escriba V20 a V23** (no he visto sus fichas): lo que queda libre es el 6 y el 7-10, 12-10, 14-10, 22-10,
   26-10, 29 y 30-10, 2, 4 y 6-11, 17 al 19-11, 24 y 26-11, y desde el 2-12 (contando con que el plan de zonas ya va por fases
   desde el 1-12 y que la MFA del 30-11 no se ha enseñado cumplida). Si dos fichas de la tanda caen el mismo día, hay que
   decidir cuál se mueve. **Nada de lo que fijan V18 y V19 pasa después del 13-11, salvo la caducidad de la
   excepción de V18, que es una fecha de validez (1-04-2027), no un hecho.
2. **Cada ficha cierra con «responsable y fecha»,** como pide la revisión de la tanda 2 y hicieron V10, V12, V16 y V17: V18
   con «excepción del grabador · director de operaciones · caduca el 1-04-2027» y V19 con «consultas parametrizadas y
   codificación de salida · Desarrollo · 13-11». Descartado dejarlo sin dueño ni fecha: en V18 sería justo el error que
   enseña la ficha («una excepción sin fecha de caducidad no es una excepción», `sp/sp4-part3.ts:100`).
3. **Dos mensajes interceptados por cápsula, uno por capítulo, cada uno con un error concreto de la lección,** y ninguno que
   repita la mentira de un mensaje ya publicado del mismo adversario (V18: ni «Duerme tranquila» de V5b; V19: ni «cumple
   todas tus normas» ni «borra el texto» de V10).
4. **Las dos van en un hueco de la lección que ya ha enseñado todo lo que cuentan,** y antes del cierre o de la nota de
   examen que lo remata. Por eso ninguna necesita frase de puente.

## V18 · sp4m5 · «Triaje de vulnerabilidades: el contexto manda sobre el número»

1. **Historia: un informe nuevo, no el de septiembre.** Jueves 1-10, el escaneo mensual trae tres filas rojas y esa semana
   cabe un solo parche: dos son el mismo fallo en dos servidores, y la tercera es de un equipo sin parche. Descartado
   volver al escaneo del 1-9 de la lección (el FINDING #0147 del portal, el laboratorio 9.8 y el ejemplo de los 640
   hallazgos), por cuatro motivos: la lección se contradice sobre el WAF del portal (`sp/sp4-part3.ts:57`, «sin WAF delante»
   frente a `:65`, «regla de virtual patching en el WAF»); V10 ("Filtro, ninguno") y V16 dan por hecho que no había nada delante; el
   «#0147» se parece al caso `IR-2026-0147` y el registro prohíbe juntarlos (§5, «Mismo número, otra cosa»); y las cifras de
   septiembre (640, 180, 22, 6, 3) más los PLC de las esclusas son el terreno de V16 y del dosier de BLIND ARCHITECT.
   Descartado también fechar el vídeo en noviembre o diciembre: el plano de V16 dice que entre las VLAN de entonces nadie
   decide y que no funciona nada del plan antes del 1-12, así que «aislar» pediría explicar con qué, y diciembre arrastra la
   MFA del 30-11. El 1-10 es el día en que corre el escaneo mensual de la lección (el día 1) y queda libre.
2. **Tres conceptos, el orden en que trabaja la analista:** la nota CVSS frente al contexto, lo que no se puede parchear y
   cuándo se cierra un hallazgo. Son las tres reglas de la nota de examen (`sp/sp4-part3.ts:141-142`). Descartado un cuarto
   con el false negative: tiene su check y su pregunta (q2), pero el vídeo pasaría de tres conceptos y la asimetría no se
   enseña mejor en pantalla que en la lección. El false positive sí sale, en la práctica de s05.
3. **La variable que se aísla: el mismo CVE, la misma nota, dos servidores.** La lección ya enseña «9.8 aislado frente a
   7.5 expuesto» (check `:85`, q3, y el laboratorio spl4c): repetirlo sería repetir el orden, que es lo que penaliza el
   ranking (L). Con el mismo CVE en los dos, la nota y el exploit empatan, y se ve que solo el contexto desempata. Aporta
   además lo que la lección nunca enseña: que CVE y CVSS no son lo mismo, en la fila misma (q4).
4. **El servicio vulnerable es un servicio de red (mensajería), no una biblioteca de conversión de documentos.** Primera idea,
   descartada: un conversor de documentos, donde «escucha solo en el propio equipo» no impide que la aplicación le pase un
   documento de fuera, o sea, que se llegue igual. Un servicio con puerto sí queda fuera de alcance si solo escucha en local
   (hace falta ya estar dentro del equipo). Los CVE, los equipos (`srv-msg01`, `srv-msg02`, `cam-nvr-02`) y las versiones son
   inventados y no estaban en ningún archivo (comprobado con búsqueda en `src/`, `video/` y `docs/`).
5. **Lo que no tiene parche es un grabador de cámaras.** Descartados los PLC, las esclusas y las grúas (el dosier de BLIND
   ARCHITECT, que V16 respeta; el servidor de grúas de sp2m1; el check de la propia lección, `:145-158`; y la OT es el
   silencio de V16), el aparato de imagen médica (q5, `:236-249`), la megafonía de sp5 (`sp/sp5-part2.ts:367`, que ya es un
   ejemplo de «aceptar con dueño y fecha»), todo lo que lleve contratista o proveedor con nombre y el lector de matrículas
   de la puerta de camiones (los equipos de la puerta salen en V5b y no se quiere que parezcan parte de esta historia). El
   grabador existe en las lecciones como CCTV (`sp/sp1-part1.ts:46`, `:212`), no es OT y no roza nada.
6. **La excepción la firma el director de operaciones, caduca a los seis meses y se revisa cada 90 días.** Es el cargo sin
   nombre que ya firma la excepción de la lección (`:167`), aquí por un equipo distinto, y el formato copia la exclusión
   EXC-01 del SIEM (`video/siem/src/data/s07-tuning.ts:53-58`: qué, por qué, quién la aprobó, revisión), con lo que se
   ve igual que lo que ya conoce quien vio el SIEM. Descartado que la firme la analista (q6, `:251-264`) o el jefe de
   sistemas (R. Salas): Sistemas parchea y aplica los controles, el riesgo de negocio lo acepta Operaciones.
7. **El rescan contradice al parche por un banner viejo, no por un reinicio.** El callout de la lección, que va justo encima
   del vídeo, ya cuenta el caso del servidor que no se reinició (`:167`); repetirlo sería dar por nuevo algo que acaba de
   leer. La otra causa que nombra la lección (`:161`, «un banner que no se actualizó») es el false positive de la
   definición (`:27`): el vídeo lo deja en una comprobación (versión, paquete y servicio activo) y en un veredicto
   documentado. El reinicio se descarta en pantalla, con «servicio activo desde 01-10 18:12». **Alternativa si Lidia prefiere
   el reinicio, que es la causa más típica en examen:** cambiar solo las líneas de la consola de s05 (la versión que corre
   sería la vieja y el veredicto, «falta reiniciar»), sin tocar escenas, tarjeta ni pregunta; el precio es repetir el
   callout de encima.
8. **La pregunta para pensar es «Parcheado y sigue saliendo. ¿Qué haces primero?»** (comprobar la versión o volver a
   parchear). Descartado el «9.8 o 7.5» del check de la lección (`:85`) y el «¿cierras el ticket?» de la q7 (`:266-279`):
   los dos están en la lección con su respuesta. La pregunta nueva trabaja lo que la lección solo nombra (`:161`): qué hacer
   cuando el rescan contradice al parche.
9. **Imagen: el casco de un barco.** El agujero es la nota; el mar, el contexto (dique seco o alta mar). Vuelve en el concepto
   2 (mamparos, bombas de achique, el acta del armador, el seguro que paga la reparación pero no tapa el agujero) y en el 3
   (el parte del taller frente a la sentina). Descartados: el triaje de urgencias de un hospital (la palabra «triaje» ya
   lo usa todo el curso y mezclaría pacientes con servidores), el ancla (V12), la valla y la garita (V16), la ventanilla
   (V10) y «la etiqueta» (V1, V7 y las del taller de V13 a V15).
10. **SILENT PAGER, dos atajos:** «Mismo 9.8, misma prisa. Que decida una moneda.» y «¿Sin parche? Contrata un seguro y
    a otra cosa.» Descartado un tercer mensaje («Ya lo parchearon, cierra el ticket»): se pisaría con la pregunta de
    s05, y una cápsula admite dos. Descartado «Empieza por el 9.8» a secas: la ficha tiene dos 9.8, y la mentira útil es que
    el empate se resuelve al azar.
11. **Dónde va y qué se hace después.** Entre el callout de ejemplo y el párrafo que salta a sp4m6, como recomendaba la
    coordinación, y la tarea es el laboratorio spl4c (Vulnerability Triage), que practica justo esta decisión. Descartadas las
    8 preguntas de la lección: el vídeo toca casi todas (q1, q3, q4, q5, q6, q7 y q8), pero el laboratorio es la práctica que
    falta. Descartado ponerlo antes de la nota de examen: contestaría el check de las grúas (`:145-158`).

### Riesgos (V18)

- **CVSS 3.1 frente a 4.0.** La lección y el examen hablan de CVSS en general, y el informe de la lección usa el vector 3.1.
  En pantalla va `CVSS v3.1`, con vectores que he comprobado con la fórmula de la especificación (el 9.8 y el 8.1 salen
  tal cual). La voz no dice «la versión actual». El 8.1 lleva `AC:H`.
- **«La nota no sabe nada de tu red» solo vale para la nota base.** CVSS tiene métricas temporales y ambientales; la lección
  dice que el contexto lo suma la analista (`:47`). La voz y la pantalla dicen «la nota base», nunca «CVSS no puede
  incluir el contexto».
- **El dique seco no es «a salvo».** `srv-msg02` va a P3 y entra en el ciclo mensual; no se ignora. Nunca «no pasa nada», nunca
  «inalcanzable»: hace falta ya estar en el equipo. Y la P1 de `srv-msg01` es la ventana de 24 h de la lección (`:64`), no
  «la única»: «cabe un solo parche» habla de la capacidad de la semana y no contradice a una emergencia.
- **El exploit público es del CVE.** «Desde hace 9 días» está en las dos filas porque pertenece al fallo, no al servidor, y el
  vídeo no dice quién lo usa ni lo relaciona con SILENT PAGER.
- **El seguro.** Nunca «el seguro no sirve»: paga parte del golpe y el fallo sigue igual de explotable (q8, `:281-294`).
- **«Aislado», sin más.** Ni VLAN ni zona ni equipo de salto: el plan de V16 aún no funciona el 1-10, y la red que describe
  es otra. La voz dice «lo aíslas».
- **La excepción.** El dueño es de negocio; la voz dice «lo firma quien manda en el negocio, no tú». Caduca el 1-04-2027 y se
  revisa cada 90 días: en voz, «seis meses» y «cada tres meses».
- **Credentialed y banner.** La lección enseña el falso positivo por banner como propio del escaneo **sin** credenciales (`:27`),
  y el informe del 1-10 es `credentialed`. El vídeo lo dice: la fila de s05 lleva «comprobación remota del servicio, sin
  sesión» y la voz, «aunque el escaneo lleve credenciales, esta comprobación lee lo que el servicio anuncia por la red». La
  contradicción ya está en la lección (ver «Cambios propuestos», punto 1).
- **«Las dos cosas habituales».** La voz dice que antes de discutir se descartan dos cosas comunes (un reinicio que falta y un
  dato viejo), como la lección. No dice cuál es más frecuente.
- **Falso positivo documentado, no culpa de nadie.** No se culpa a Sistemas por el texto del banner. El false positive del
  laboratorio (nóminas) no sale.
- **La pregunta llega sin respuesta pintada:** la fila quieta, sin la versión ni el banner a la vista hasta que se contesta.
- **El título de s05 («Después del parche»)** no da la respuesta.
- **Títulos de capítulo.** El capítulo II de V18 («Sin parche y sin prueba») se inclina hacia la respuesta de la pregunta, pero no
  nombra ninguna de las dos opciones («volver a parchear» y «comprobar la versión»), así que pasa la regla del título (plan, §1).
- **La pregunta de s05 la contesta en parte el párrafo de justo encima** (`sp/sp4-part3.ts:161` lista los dos descartes). Es el
  patrón de V15, que la revisión de la tanda 3 aceptó: la pregunta es una decisión (volver a parchear o comprobar), la lección
  lista causas, y la pantalla oculta el método y la versión hasta la respuesta.
- **Orden del curso.** V18 es el **segundo** vídeo de SILENT PAGER en el orden del curso, tras V21 (sp4m2), y el primero de
  vulnerabilidades; va antes que el SIEM. Nada de «otra vez», ni de septiembre, ni del caso. SILENT PAGER se presenta con el
  anuncio del jefe de sp4 («cuenta con que tu SOC duerma», `sp/sections.ts:104`; la fórmula de V1), no con una paráfrasis, y la voz
  dice «la atacante» si la nombra.
- **Duración con dos mensajes.** Cada uno suma unos 4–5 s. Si el estimado pasa de 255 s, se recorta como dice la ficha.
- **Los servidores de V5b.** V5b habla de una central de 24 servidores, 22 con registros y 2 nunca conectados el 13-10. Los dos
  servidores y el grabador de V18 no salen en esa cuenta ni la contradicen (V5b solo nombra los dos servidores sin registros);
  el guion no dice si envían registros a la central.
- **El laboratorio spl4c.** Las reglas del vídeo contestan casi todo spl4c, porque la lección las enseña. El guion no usa
  ninguno de sus ocho escenarios ni juega a elegir cuatro de ocho (lista en la ficha).

## V19 · sp2m4 · «SQL injection y XSS: cuando un texto se vuelve orden»

1. **Historia: una revisión previa a publicar, sin ataque.** El 5-11 el equipo de desarrollo enseña a la analista la copia de
   pruebas del portal de citas de camiones, que la lección sp4m4 ya tiene en desarrollo (`sp/sp4-part2.ts:413`) y nunca
   salió en pantalla. Tres cajas, tres sorpresas: el login (SQL injection), el buscador (XSS reflejado) y las observaciones
   (XSS almacenado). Datos ficticios, nada explotado fuera de la revisión. Descartado:
   - **El login del portal de reservas** (`hpa-portal-web-01`): V11 enseña a las navieras entrando ahí el 3-11, V10 sacó
     `/etc/passwd` de ese equipo el 21-10 y el registro prohíbe decir qué pudo leer (§5, «Notas de V11»). Una SQL injection
     contra ese login haría pensar que las contraseñas de las navieras salieron.
   - **Un incidente con un atacante** (alguien que de verdad inyecta): obligaría a darle IP, dominio o fecha, y a RED
     MARROW un papel que su dosier no tiene.
   - **El portal de tickets y el foro** de los checks y la q3: son otros escenarios de la lección, ya contestados.
2. **Tres conceptos:** SQL injection (con su corrección), XSS (reflected y stored) y la defensa en el punto donde el dato
   se encuentra con el código. Son los de la fila del ranking y los dos reflejos de la nota de examen (`sp/sp2-part2.ts:337`).
   Se quedan en la lección buffer overflow, TOC/TOU, malicious update, sistema operativo y hardware, y zero-day. Descartado
   un cuarto con las cookies seguras o el WAF: dan para otros vídeos y el WAF se contradiría con sp3m5 si se menciona a
   medias (ver riesgos).
3. **Tres imágenes que no se pisan con V10 ni V11.** El formulario del puerto con su casilla (SQL injection), el panel de avisos
   con su cartel y su tablón (XSS) y la vitrina (output encoding). Descartado reutilizar:
   - la **nota en la ventanilla** de V10 (traversal): V10 dice en voz que el traversal «no es una inyección», y una imagen
     parecida mezclaría lo que ese vídeo separa;
   - los **restaurantes y el menú** (amplificación DNS), las **puertas y las llaves** (spraying), el **buzón y el sello**
     (V11) y las **pinturas** (V11);
   - el **tablón** sale en V4 (GCTI) para los registros públicos de certificados. Aquí es otra cosa y otra pista; si el
     revisor de naturalidad lo oye como eco, se cambia por «el corcho del pasillo».
4. **RED MARROW, dos consejos de amigo que son mentira, sin repetir los de V10.** «Cifra la base de datos y no se llevan
   nada» (el distractor de q2, `:395-408`) y «Si corre en el navegador, el fallo no es tuyo» (culpar al navegador, cuando la
   página la escribe el servidor). Descartado:
   - «Filtra las comillas» (la lección dice que no es la defensa, `:294`): es el mismo error que «borra los puntos y las
     barras» de V10 (filtrar el texto) en el mismo adversario;
   - «Contraseñas más largas»: V10 ya gastó su mensaje en contraseñas;
   - «Pon un cortafuegos delante»: sp3 enseña que un WAF sí frena estos ataques (`sp/sp3-part3.ts:66`, `:240`), así que
     tendría que decir «de red» y el mensaje se alargaría. Pasa a ser un riesgo, más abajo.
5. **La carga se queda en pantalla.** La voz dice «una comilla, una condición que siempre se cumple y dos guiones»; no hay
   excepción a «lo que se lee no se deletrea». La carga es la de la lección (`:303-304`) y, además, la de la q2.
6. **La pregunta para pensar es «¿Dónde corre el script: servidor o navegador?»,** con la página ya a la vista y los nombres
   XSS y REFLECTED todavía sin salir. Descartado «¿Reflected o stored?» (los términos aún no están explicados) y «¿Una
   contraseña más larga lo frena?» (sale en la nota de examen y se contesta sola). La respuesta separa el XSS de la SQL
   injection en una frase, que es lo que el examen mide.
7. **La fecha es el 5-11, con su mejora el 13-11.** Descartado hacerlo secuela de V10 («tras lo del portal, revisamos las
   demás webs»): ataría la historia a la noche del 21-10, que es canon cerrado. Descartado dejarlo sin fecha, como V9 y V15:
   aquí el vídeo trae una mejora con dueño y fecha, y sin fecha no se sostiene. Quien sigue el curso ve V19 (sp2m4) antes que
   V10 (sp2m7): RED MARROW se presenta con una frase, solo «que vive de engañar» (el «y sí, cumple las normas» de V10 es de su mensaje), y sin «otra vez».
8. **«Desarrollo» como área.** Es nuevo en pantalla, pero sale en la lección como «el desarrollo del portal de citas de
   camiones» (`sp/sp4-part2.ts:413`). Descartado «Sistemas», que parchea servidores y no escribe el portal, e «Infraestructura»,
   que hoy es de certificados y red.
9. **Dónde va y qué se hace después.** Entre el check del XSS almacenado y la nota de examen, para que la nota («dos reflejos
   automáticos») remate el vídeo, y la tarea es terminar la lección y sus preguntas: cinco de las siete tratan de lo que
   viene después. Ningún laboratorio de sp2 toca SQLi ni XSS. Descartado mandar a un laboratorio que no existe.

### Riesgos (V19)

- **El análisis de código del pipeline.** La lección sp4m4 dice que el desarrollo del portal de citas incorpora SAST. Una
  copia de pruebas con una SQL injection y dos XSS podría parecer incompatible. El vídeo no habla del pipeline ni del análisis
  de código (s01 solo dice que es una copia de pruebas «antes de publicar»), y nada dice que esta sea la versión que pasa
  por él. Si el revisor lo marca, la salida más barata es una frase: «las herramientas ayudan, pero nada sustituye a
  probar la web».
- **Orden del curso.** V19 se ve antes que V10; no dice que RED MARROW ya apareciera, ni «otra vez».
- **Título del capítulo II.** Se llama «Lo que devuelve la página», sin «servidor» ni «navegador»: s04 es su primera escena y la
  tarjeta de capítulo sale justo antes de la pregunta para pensar.
- **Ningún parecido con el portal de reservas:** ni nombre, ni dirección, ni cuentas de navieras, ni «el portal» a secas
  (en voz es siempre «la web de citas» o «el portal de citas»). Ningún ejemplo de datos que sugiera lo que leyó el traversal.
- **La carga y el comentario SQL.** `--` apaga el resto de la línea; en algunos motores necesita un espacio detrás. El vídeo
  sigue la lección (`:303-308`) y la voz no dice que valga «en cualquier base de datos». Tampoco «entra como administrador»:
  abre sesión sin contraseña.
- **Parameterized queries.** «El motor nunca interpreta el texto como SQL» es de la lección (`:314`); la voz no dice «imposible»
  ni «con eso basta»: los complementos (validar la entrada, permisos justos) van en pantalla.
- **XSS reflejado.** «Suele ir con phishing» (`:320`), no «siempre». El enlace es de prueba y no tiene dominio.
- **XSS almacenado.** «Sin engañar a nadie» no es «sin que nadie haga nada»: la persona abre su listado de siempre. La voz no
  pone el robo de la cookie como inevitable («pueden llevarse la cookie de sesión»).
- **Output encoding frente a input validation.** La voz no dice que validar la entrada «no sirva»: es complemento (`:321`), pero la nota de examen
  (`:337`) manda: si entre las opciones aparece input validation, esa es la respuesta, y el vídeo lo dice en pantalla (s05) y en voz
  (regla 3 del cierre). La CSP solo sale en pantalla, como complemento.
- **El WAF.** sp3m5 enseña que un WAF frena estos ataques mientras se corrige el código. El vídeo no lo dice y nunca afirma
  que «un cortafuegos no sirva»: el primer mensaje habla del cifrado de la base de datos. La nota de examen de sp2m4 dice «un firewall»
  a secas (`:337`); ver «Cambios propuestos».
- **«Cifrar no sirve» es falso.** La respuesta al primer mensaje dice que cifrar protege el disco si se lo llevan, y que no cambia la
  consulta. Que «la aplicación ve los datos descifrados» vale para el cifrado transparente de la base de datos y del disco;
  el revisor de exactitud debe mirar que no suene a otra cosa.
- **El script de pantalla no es una carga que funcione:** `enviar(...)` no existe y no hay ninguna dirección externa; «sitio
  externo» es un rótulo.
- **Cuentas de prueba:** ninguna se parece a las del registro (`r.haugen` y las cuatro del spraying) y la contraseña de
  prueba no es `Halden2026!`.
- **Densidad de s04** (52 s, con dos demos, una pregunta y una tarjeta). Si el borrador pasa de 255 s, se recorta primero
  las personas que abren el listado (quedan en pantalla) y después la frase de complementos de s05 (la línea del examen sobre input validation no se recorta).
- **RED MARROW sin dosier.** Sus dos mensajes son consejos; no ataca nada, no lanza los fallos ni los encuentra, y las
  víctimas son el personal de la puerta, no los operadores de grúas.

## Cambios propuestos a la lección o a los registros (solo propuestos; no se ha tocado nada)

0. **`sp/sp4-part3.ts:167` frente a `:53` y `sp/sp4-part2.ts:413`, texto (revisión del 2026-10-08).** El informe del 1-9 se rotula
   `credentialed` (`:53`), el escaneo mensual «pasa a ser credentialed» (`sp4-part2.ts:413`) y, aun así, el ejemplo atribuye los 180
   falsos positivos a «un escaneo sin credenciales» (`:167`). Mínimo: en `:167`, «un escaneo sin credenciales» pasa a «comprobaciones
   remotas que dedujeron la versión del banner». No toca ids, respuestas ni tests. Puede ir en el PR de V18. El vídeo no depende
   de ello (s05 ya lo dice).
1. **`sp/sp4-part3.ts:65`, opcional.** El informe de la lección dice «sin WAF delante» (`:57`) y propone como mitigación
   interina «una regla de virtual patching en el WAF» (`:65`). Solo puede ser cierto si el WAF se pone ahora. Mínimo:
   «mitigación interina: regla de virtual patching en un WAF que se pondría delante hasta el parche». El vídeo V18 no
   depende de ello, no usa el portal ni dice nada del WAF. Si se hace, debe ir en el PR de V18, y el registro anota que V10 y
   V16 siguen contando que el 21-10 y el 16-11 no había nada delante.
2. **`sp/sp2-part2.ts:337`, opcional y barato.** La nota de examen dice que «un firewall», «cifrar la base de datos» o
   «contraseñas más largas» no impiden que el input se interprete como código. Con sp3m5 por delante, que enseña que un WAF
   sí frena SQLi y XSS (`sp/sp3-part3.ts:66`), conviene «un firewall de red». Es solo texto, no cambia ningún id ni test. Iría
   en el PR de V19.
3. **Plan de vídeos, §5:** pegar las dos fichas tras V17, con una fila «Tanda 4» en la tabla de carpetas (`cvss-halden`, V18,
   se graba con V19; `inyeccion-halden`, V19, se graba con V18) y actualizar las filas 18 y 19 del ranking (§3) a «ficha».
4. **Registro de canon (paso 8 del orden de trabajo), al cerrar cada vídeo:**
   - V18: en §2, las filas del 1-10 (informe, decisión de triaje y excepción) y del 5-10 (rescan y false positive); en §3,
     los equipos nuevos `srv-msg01`, `srv-msg02` y `cam-nvr-02`, el cargo del director de operaciones firmando la excepción y
     el dato de que «el escaneo mensual corre cada día 1»; en §4, los dos mensajes de SILENT PAGER; en §5, «los CVE son
     inventados» y la nota de que el vídeo no entra en el WAF del portal.
   - V18: SILENT PAGER, segundo vídeo en el orden del curso (tras V21) y primero de vulnerabilidades.
   - V19: en §3, tres portales distintos (reservas, declaración de carga y citas de camiones) y el área «Desarrollo»; en §2, la fila del 5-11 (revisión previa a publicar) y la del 13-11 (mejora); en §3, el área «Desarrollo» y el
     portal de citas de camiones, primera vez en pantalla, copia de pruebas; en §4, los dos mensajes de RED MARROW y la nota
     de que V19 es su segunda aparición cronológica y la primera en el orden del curso; en §5, que ningún vídeo dice cómo se
     enlaza el portal de citas con el análisis de código del pipeline.
   - §6 (nombres libres): los tres equipos nuevos de V18 no son de relleno, salen en pantalla.
5. **`src/data/content.test.ts`,** al publicar cada vídeo: una línea `expect(youtubeVideos.find(...)?.module).toBe('sp4m5')` y
   otra con `'sp2m4'`, con su comentario, como las de V10 a V16.

**Orden de PR (revisión del 2026-10-08).** El plan de esta rama no tiene V17, así que «pegar tras V17» dará conflicto de fusión en el plan
y en el registro. Recomendado: fusionar V17 y cerrar V12 en el registro antes de abrir los PR de V18 a V21, y que cada ficha añada sus filas
en una sección distinta.

## Preguntas para Lidia

Ninguna que bloquee: se pueden aprobar tal cual. Tres elecciones con alternativa, por si quieres cambiar alguna:

- **¿La causa del rescan de V18 es el banner o el reinicio?** Recomendado: **el banner** (decisión 7 de V18), para no repetir el
  callout que va justo encima. Si prefieres el reinicio, cambian solo las líneas de la consola de s05.
- **¿«Desarrollo» como área del 13-11?** Recomendado: sí (sale en la lección). Si prefieres no inventar un área, la mejora de
  V19 se queda sin dueño en pantalla y se dice «el equipo del portal», que da menos precisión y no tiene apoyo en la lección.
- **Pronunciación:** «SQL» como «ese cu ele» (propuesta) o «síquel», y «XSS» como «equis ese ese». Se decide al grabar y el
  léxico se ajusta; no cambia el guion.

## Qué he comprobado y qué no

**Comprobado:**
- Contra las fuentes: leídos enteros el plan (§1, §3, §6, §8), las fichas de V5b, V10, V12, V15 y V17, las decisiones y las
  dos revisiones de la tanda 3 (`decisiones.md`, `revision-V11-V12.md`), el registro de canon entero (550 líneas), las dos
  lecciones (bloques, checks, quiz y notas de examen), los laboratorios de sp2 y de sp4, `sp/sections.ts`, la prueba de
  vídeos de `content.test.ts` y la narración entera de V10, los mensajes de SILENT PAGER de V1, V5, V5b y V6 con su configuración de voz, la configuración de voz de V11, V12 y V16, y los datos del SIEM que tocan al escáner y a los equipos de relleno (`s05-correlate`, `s06-fatigue`, `s07-tuning`). No he leído los datos en pantalla de V11, V12 ni V16: de ellos me fío del registro.
- V17 en su rama (`video-fronteras-halden`): el registro todavía no tiene su canon (el diff de `docs/superpowers/canon` está
  vacío); he leído su `narration.json` y las fechas de `s02-toma`, `s05-sedes`, `s09-tunel` y `s01-hook` (23, 25 y 27-11; 20-11
  del plan): no chocan con ninguna fecha de V18 ni de V19.
- Los nombres nuevos (`srv-msg01`, `srv-msg02`, `cam-nvr-02`, `msgq`, `CVE-2026-40218`, `CVE-2026-38105`) no aparecen en
  `src/`, `video/`, `docs/` ni en el registro. Que no coincidan con un CVE real de 2026 **no** lo he podido comprobar: son
  inventados y se anotan como tales.
- Los días de la semana, con Node: 1-10 jueves, 2-10 viernes, 5-10 lunes, 3-11 martes, 5-11 jueves, 9-11 lunes, 13-11
  viernes y 1-04-2027 jueves.
- Los vectores: 9.8 y 8.1 salen de la fórmula de CVSS 3.1 aplicada con Node.
- Los límites del perfil `capsula-yt`, contados con un script de Node (`[...texto].length`; el script vive en el scratchpad de
  la sesión, no en el repo): 6 escenas en 3 capítulos; 3 conceptos; 4 tarjetas por vídeo, una por escena de s02 a s05 y ninguna
  en s06, de 50, 51, 55 y 52 caracteres (V18) y de 53, 41, 53 y 44 (V19), todas de 58 o menos; 1 pregunta por vídeo, de 47 y de
  45 caracteres, ambas de 48 o menos; 2 mensajes por vídeo, uno por capítulo (I y II) y ninguno en la última escena, de 46 y
  46 (V18) y de 57 y 60 (V19), todos de 70 o menos, con `holdMs` 3800 (2500 a 4500); suma de `s` de **210 s** en los dos (la
  ventana de 190 a 260 s es de duración renderizada, y con los factores 0,89 y 1,22 de V5 y V4 da 187 a 256 s); `wordBudget`
  de 566 palabras en cada uno. Sin flechas, marcas, viñetas ni emoji en tarjetas, preguntas ni mensajes (patrón Unicode
  de Node), ni en las propias fichas.

**No comprobado:**
- No he escrito guion ni borrador de ninguna escena: los `wordBudget` y los 235–245 s renderizados previstos son extrapolación
  del cociente de V12 (210 s de suma), no una medida. El `build-timeline --estimate` solo se puede correr cuando exista la
  carpeta del vídeo.
- Los dos revisores (exactitud y naturalidad) y `canon-check.mjs` se corren con el guion, no con la ficha; faltan.
- No he visto las fichas de V20 a V23 (las escribe otra sesión): el calendario de arriba es lo que yo he ocupado, no un
  acuerdo.
- No he comprobado que `origin/main` siga igual: leí el registro y el plan de este worktree (que ya incluye V16 fusionado).
- El comportamiento real de escáneres con credenciales y banners (V18, s05) es plausible y coherente con la lección
  (`:27`, `:161`), pero no lo he contrastado con la documentación de un escáner concreto.

## Revisión del 2026-10-08 (`revision-secplus.md`): qué se aplicó y qué no

Aplicado en `ficha-V18.md`, `ficha-V19.md` y este documento:
- **V18:** la frase del falso positivo por banner en un escaneo `credentialed` («comprobación remota del servicio, sin sesión»), y la
  contradicción de la lección (`:53`, `:167`, `sp4-part2.ts:413`) como cambio propuesto 0; la cita falsa «nadie lea la cola»
  sustituida por «cuenta con que tu SOC duerma» (`sp/sections.ts:104`); V18 como segundo vídeo de SILENT PAGER en el orden del curso,
  tras V21; el segundo mensaje sin «De nada.» («¿Sin parche? Contrata un seguro y a otra cosa.», 46 caracteres); «segmentation»,
  «compensating controls» e «insurance» en los rótulos de s04; la línea del laboratorio en s06; y las notas 6 a 11 (gancho de s01,
  densidad de s04, capítulo II, «ancla», CVE ficticios).
- **V19:** cues renombrados para que cada `sfx` tenga cue (`bypass`, `blocked`, `cookie`, `vitrina`); input validation como respuesta del
  examen cuando aparece entre las opciones; y las notas de cookie y HttpOnly, «cifrado en reposo», SAST del pipeline (frase de s01),
  «Desarrollo» y los tres portales, «suele ir con phishing» junto a RED MARROW, el personal de la puerta y la presentación de RED
  MARROW («que vive de engañar» solo).
- **Entre fichas:** el orden de PR (V17 y V12 antes) y la coincidencia del 13-11 con V20 (aceptada en `decisiones-V20-V21.md`).

No aplicado: **nada se rechaza.** Dos matices: (1) «tres filas rojas, un solo parche» se deja en el gancho, con la salida de
reescritura anotada en las notas de V18, porque la tercera fila se entiende en s04; (2) el título del capítulo II de V18 se deja
(«Sin parche y sin prueba») con «Lo que no se puede parchear» como alternativa si el revisor de naturalidad lo oye como pista.
