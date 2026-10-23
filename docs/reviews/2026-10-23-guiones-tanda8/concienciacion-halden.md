# Revisión del guion · V44 `concienciacion-halden` (sp5m8, perfil `caso-yt`)

Revisor de solo lectura, 2026-10-23. Fuentes leídas: ficha `docs/superpowers/plans/fichas-tanda8/V44-sp5m8.md` y `_revision.md`; `video/concienciacion-halden/` (`storyboard.json`, `narration.json`, `video.json`, `lexicon.json`, `out/script-notes.md`, `out/canon-refs.md`); la lección `src/data/secplus/sp5-part4.ts:307-461` y su quiz (`:463-568`); `placement-sp5.ts` (`pl-sp5q12`), `sp5-cards.ts:49-51`, `sp2-part1.ts:92-96`; el diseño `2026-10-16-secplus-casos-examen-design.md` §4; el plan de vídeos §1 «Narración hablada»; las voces de `controles-halden`, `nube-halden`, `actores-halden`, `ingenieria-halden`.

Sobre el registro de canon (`glass-harbor.md`, 721 KB, 3024 líneas): leí enteras la cronología (§2), las secciones de adversarios y de contradicciones que tocan, las notas de V34, V35 y V36 y las imágenes ocupadas (V20, V21, V32, V38, V45), y busqué con grep, en todo el archivo, cada término del guion (concienciación, awareness, simulado, phishing, farola, camarero, instituto, comedor, extensión, pizarra, nóminas, Compras, Finanzas, Sistemas, Dirección, botón, buzón, trimestre, formación, risky/unexpected/unintentional, report/click rate, V44, sp5m8). No afirmo haber leído línea a línea las notas de los vídeos que no tienen relación (V10 a V19, V24 a V31, V33, V37, V38, V45 a V47 salvo lo citado).

Cifras del guion que he comprobado: 698 palabras leídas, ninguna frase pasa de 20 palabras, un solo `:` en s01-01, s03-02, s06-02 y s08-01 (4 de 29 segmentos, bajo el tercio), emociones sin repetir en segmentos consecutivos.

---

## A. EXACTITUD Y CANON

### Decisión de las dudas declaradas

- **Exactitud 1 (ficha y `script-notes`): risky frente a unintentional.** Decido: **la clave B se mantiene, pero el escenario tal como está deja una segunda lectura defendible y hay que endurecerlo** (hallazgo A-1). Razón: la lección separa risky de unintentional por el conocimiento del atajo (`sp5-part4.ts:351`: «la persona sabe que es un atajo y hace igual porque le resulta más cómoda»; q6, `:552`: «good intentions do not change the fact that a deliberate, avoidable action was taken»). Aquí el empleado actúa «para no esperar al técnico» (atajo) y «acepta el aviso de que no está aprobada» (lo sabe), así que por los criterios de la lección solo B es correcta. Pero «no está aprobada» no dice que esté prohibida, y el escenario subraya «él no lo sabía», que es justo la definición popular de unintentional. Quien no haya memorizado el criterio de la lección puede defender D sin ser torpe. El plan B de la ficha («sabía que la política lo prohíbe») no es una alternativa de último recurso: es la versión que hay que usar ya, porque el coste es cero y la trampa D sigue tentando (sigue sin saber lo que subía).
- **Exactitud 2: «un botón para avisar» como respuesta.** Decido: **válida**. Sale de la lista del programa de la lección (`:424`, «Hacer trivial el reporte: un botón en el cliente de correo») y del 5.6 «Responding to reported suspicious messages / Reporting and monitoring». El examen no nombra botones, pero la pregunta pide el cambio para un freno descrito en el propio escenario, que es lo que hace el examen. Hay un fallo de pantalla que sí corregir (A-3).
- **Exactitud 3: formación por audiencia.** Decido: **válida y sin contradicción**. La lección la dice dos veces (`:421`, tabla `:373-413`, y la nota de examen `:441` pide verificar por canal independiente). El 5.6 la cubre bajo «Development / Execution». Una sola reserva de redacción en A-7.
- **«Mayor red de avisos».** Correcta: es «red de sensores más grande» (`:326`) dicha en llano.
- **«Initial» y «recurring».** La lección los usa de dos formas (formación inicial y recurrente, `:423` y `:429`; «reporting and monitoring inicial» y «recurrente», `:435`). El guion usa la primera, que es la del quiz (q2) y la más común en el material de preparación. No hay error. Que la lección mezcle las dos lecturas es cosa de la lección, no del vídeo.
- **Pronunciación (`lexicon.json`).** Fuera de mi alcance de exactitud; las respeladas son coherentes. La define la primera toma.
- **`youtubeTitle` sin «CompTIA Security+ en español».** Sin impacto de exactitud; coincide con la práctica de V35/V28 (el sufijo lo añade `youtube-meta`). Se queda.

### Canon: resultado

Sin contradicciones ni duplicados. Comprobado contra el registro y los vídeos publicados:

- **Áreas** Seguridad, Compras, Finanzas, Sistemas y Dirección: ya existen como áreas, sin persona, en V5b, V34, V35, V36 y V32. El guion no pone personas, equipos, IP, dominios, cuentas, ficheros ni fechas (`canon-refs.md` vacío es coherente).
- **Cronología:** V44 no fecha nada. «Prepara su programa» y «su primera campaña» no chocan con nada: las seis mejoras de V5 (`reg` §3, casos) y las de V5b no incluyen concienciación, y el párrafo final de la lección («ya tiene un programa completo», `:460`) viene después del vídeo, en orden coherente.
- **Imágenes:** «la farola», «el inglés del instituto», «el camarero», «el comedor», «la extensión» no aparecen en ningún vídeo ni en el registro; las fichas de V45 y V48 ya las declaran ocupadas por V44. La farola no es el «foco que alumbra al vecino» de V21 (`reg:1198`) ni el semáforo de V31; el inglés no dice «aula» (V32).
- **«Nóminas»:** en s02 las abre una cuenta de Compras (acceso a datos) y en s04 sale como señuelo cruel; no tiene que ver con el pendrive «Nóminas 2027» de V36 (`reg:264`), con la aplicación de RR. HH. de V28 (`reg:242`) ni con la directora de Compras de V34 (que solo es lo que dice ser quien llama). La nómina la calcula un SaaS (sp5): V44 no dice quién la gestiona.
- **«Pizarra»:** la de V5 (`reg:351`, `:2290`) es el tablero de fases del incidente. La foto de s02 lleva otra pizarra, de oficina; basta con que en pantalla no lleve nombres de equipo legibles (garabatos o barras), como ya prevé la ficha.
- **Rótulos de «ejemplo»:** el guion pone «En otra empresa» (s03, s05) y «Una empresa» (s07), y s02 va en «imagina». Cumple §4.4 del diseño («en el puerto nada sale bien al atacante»): ninguna fuga, cuenta asaltada o pago ocurre en Halden.
- **Para el registro al cerrar el vídeo (canon nuevo, no es hallazgo):** el programa de concienciación del puerto y su primera campaña simulada «propuesta · ejemplo»; las tres situaciones supuestas de s02; las cinco audiencias de s06; las dos imágenes (farola; inglés del instituto, que con B-5 pasa a incluir «negociar un contrato»); las tres preguntas como «ejemplo, no hechos del puerto».
- **Cifras que no están en la lección** (punto 5 del encargo): «2 de cada 10», «1 de cada 10», «4 minutos», «dos minutos de explicación» (s04, solo pantalla, bajo «propuesta · ejemplo · datos ficticios»), «1 de cada 20» (Q2) y «cada trimestre» (Q3), todas de ejemplo y rotuladas como tal. Aceptables. La lección no tiene «dos minutos»; no es un hecho, es un detalle del ejemplo, pero conviene que el rótulo «datos ficticios» siga a la vista mientras esté ese texto.

### Hallazgos

**A-1 · CORREGIR · s03-01 (pantalla y voz), s03-02, s03-03 y tarjeta de s03 · Pregunta 1, risky frente a unintentional**
Qué está mal:
1. El escenario deja que «no lo sabía» (la fuga) pese más que «aceptó la advertencia» (la regla). Corrección en pantalla y voz abajo.
2. La resolución dice «lo que clasificas es lo que decidió», que es una frase abstracta y no da el criterio que sí da la lección: **sabía que no estaba permitido y siguió**. Y la voz de s02-04 define unintentional como «Fue sin querer», que es exactamente lo que el espectador puede aplicar a Q1. Hay que dejar dicho, una vez, que lo que decide es saber que se está rompiendo la regla, no saber lo que pasará después.
3. «aviso» choca con el sentido central del vídeo («avisar» es reportar). Ver B-1. Se propone «advertencia».

Corrección (un solo cambio coordinado):
- `question.scenario` (145): «Para no esperar, un empleado instala una extensión que la política prohíbe y acepta la advertencia. Subía cada documento fuera, y él no lo sabía.»
- `question.why` (79): «Se saltó una advertencia a sabiendas para ir más rápido: es un atajo consciente»
- `question.trapWhy` (74): «No sabía que subía los documentos, pero sí decidió saltarse la advertencia»
- s03-01 (voz), cambia la mitad central y la glosa de «MEJOR» (ver B-8): «<intrigued> {q1}En otra empresa, para no esperar al técnico, un empleado instala en el navegador una extensión que convierte documentos. La política no la permite, y él acepta la advertencia. Resulta que subía cada documento a un servidor de fuera, y él no lo sabía. ¿Cómo se clasifica mejor su comportamiento? {best}Ojo con ese «mejor». No busca una que valga, sino la que más sirve en este caso.»
- s03-02: «<firm> {ok-1}Es risky behavior, porque sabía que no estaba permitida y la instaló igual. {trap-1}Unintentional tienta, porque lo que subía no lo sabía. Pero se clasifica lo que decidió, no lo que pasó después.»
- s03-03: «<warm> {face-back}O sea, igual que quien reenvía documentos a su correo personal. Los dos sabían que no se podía.»
- Tarjeta de s03 (`exam.text`, 45, límite 58): «Saltarse una advertencia a sabiendas es risky»
- Storyboard s03: «acepta el aviso» pasa a «acepta la advertencia»; la línea de «MEJOR» de pantalla no cambia (es la de V28).
Con esto la clave B es la única defendible por los criterios de la lección; D sigue siendo una trampa real (el daño no lo sabía). Si Lidia prefiere no tocar la pantalla, el mínimo imprescindible es cambiar «no está aprobada» por «la política no la permite» en `scenario` y voz.

**A-2 · CORREGIR · s02-05, s08-01, tarjeta de s02 y frase final · «Busca la intención» no cubre unexpected**
La regla «clasifica por la intención, no por el daño» (también en la lección, `:351` y la nota `:441`) vale para risky frente a unintentional, pero no define unexpected: ese es lo que **no encaja con la línea base** de esa persona o ese puesto, y la propia lección dice que «no implica culpa» (`:351`). La voz de s08-01 resume la regla 1 solo como «mira la intención: si lo sabía, es risky», y la frase final del vídeo es «Busca la intención…»; quien recuerde eso ante un caso de unexpected (un acceso a las tres de la mañana) no tiene qué aplicar. La pantalla de s08 sí lleva la regla entera («si no encaja, se investiga»), pero la voz y la frase para el examen no. La lección es dudosa aquí, no el vídeo: «la clave para distinguirlas es la intención» es una simplificación que el vídeo hereda.
Corrección:
- s08-01: «<cheerful> {recap}Te llevas tres reglas. {rule-1}La primera, mira la intención: si lo sabía, es risky, y si no encaja, se investiga.»
- La tarjeta «Clasifica por la intención, no por el daño» (s02) y la frase final pueden quedarse tal cual si se acepta A-1 y este cambio de s08-01. Alternativa más limpia, si se admite tocar la frase final (cue `phrase`, mismo segmento s08-04): «Mira la intención o lo que no encaja, sube los avisos y forma a cada uno en su riesgo.»

**A-3 · CORREGIR · `question.scenario` de la pregunta 2 (s05) · pantalla y VTT sin el dato que hace a A falsa**
`trapWhy` («aquí ya lo reconocen») y la voz («porque la gente reconoce el señuelo») se apoyan en que reconocen el señuelo. El texto de pantalla («casi nadie pica») no lo dice, y «no pica» no equivale a «reconoce» (puede ser que ignoren el correo). Quien lea solo la pantalla o el VTT puede defender A («más formación para reconocer»). Es el mismo defecto que `_revision` A-6 corrigió en Q1.
Corrección (`scenario`, 157): «En los simulacros casi nadie pica, porque reconocen el señuelo. Pero solo avisa 1 de cada 20: hay que reenviar el correo a una dirección que pocos recuerdan.»
La voz de s05-01 ya lo dice y no cambia. Con esto, solo C es defendible: B castiga (q5 y la lección lo descartan) y D mide otra cosa.

**A-4 · CORREGIR · s06-03 (voz) y storyboard s06 · Sistemas: «no dar un acceso que no han pedido ellos»**
La lección dice para TI: «nunca aprobar un MFA que no has iniciado» (`:390`) y, en el tema de contraseñas, «no aprobar nunca una notificación que no has iniciado tú» (`:371`). La corrección D-2 de la revisión de la tanda cambió «MFA» por «peticiones de acceso que no has pedido»; el guion escribió «no dar un acceso que no han pedido ellos», que se oye al revés: un administrador de sistemas *da* accesos a otros a diario, y eso es su trabajo. Lo que no debe hacer es **aprobar** lo que le llega sin haberlo iniciado.
Corrección: voz «…A Sistemas, a cuidar sus credenciales y a no aprobar accesos que no han pedido ellos.» Pantalla (storyboard s06): «credenciales · no aprobar peticiones de acceso que no has pedido tú». Sigue sin decir MFA (D-2).

**A-5 · CORREGIR · s04-02 y s04-03 · el reflejo «hay que subir el report rate» está en la tarjeta y no en la voz**
La tarjeta de s04 dice «La métrica que hay que subir: report rate» y entra al terminar s04-02, pero ninguna frase de voz dice «subir». s04-03 empieza «El segundo avisa de un ataque real, y el castigo lo apaga»: «el segundo» (¿contador?) no «avisa», y «lo apaga» no tiene sujeto claro. Es el primer reflejo del 5.6 de la nota de examen (`:441`) y la voz tiene que decirlo.
Corrección s04-03: «<thoughtful> El que hay que subir es el segundo, porque es el que te avisa de un ataque real. Si castigas a quien pica, la gente deja de avisar. {no-names}Por eso no se publican nombres, y {coaching}a quien pica, una explicación en el momento.» (+9 palabras; s04 pasa a ~130 palabras sobre un presupuesto de 108, pero con los ~283 s previstos hay unos 45 s de margen hasta 330.)

**A-6 · OPCIONAL · s02-05 · «no un tipo de atacante»**
Un insider no intencional no es un atacante; la distinción que importa (V35, `reg` notas de V35) es con el **insider** como actor del 2.1. Además, la opción C de Q1 («Insider threat») es defendible por sp2m1 (`sp2-part1.ts:95`: el insider no intencional «causa el daño por error o negligencia»), y s02-05 es el momento de cerrarla. Redacción: «Y ojo, que aquí unintentional es un comportamiento, no un tipo de insider.»
Nota de lección (no se corrige aquí): sp2m1 `:95` pone «conecta un USB encontrado en el aparcamiento» como insider no intencional, y sp5m8 q6 (`:539-552`) pone el mismo acto como **risky**. Es una incoherencia del temario que V44 no puede resolver y que su segunda frase de s02-05 mitiga. La nota opcional de la ficha de V35 ya la apuntaba.

**A-7 · OPCIONAL · Pregunta 3 (s07) · opción C y justificación**
- La ficha descarta C («Prohibir a Finanzas abrir adjuntos») con «las facturas falsas no necesitan adjunto». No es sólido: las facturas llegan casi siempre como adjunto, y por eso C atrae. Sigue siendo peor que A (Finanzas necesita abrir facturas, y prohibirlo no es lo que pregunta «MEJOR» en un programa de concienciación), y la voz no la comenta, así que no hay error en el vídeo. Si se quiere una distractora sin esa ambigüedad, sustituir C por «Acortar el curso general para que lo acabe más gente» (35).
- Solapa de familia con V34 pregunta 2 (factura con cuenta nueva), donde la respuesta es el control de verificación fuera de banda y «Formación de concienciación una vez al año» es distractora. No es contradicción (aquí se pide formación *dirigida* en verificar), pero para que se oiga como continuación y no como giro, en la resolución de s07-02 (ver B-5): «verificar los pagos por otro canal».
- Escenario en pantalla, opcional, para que «mejora» tenga sujeto (154): «El mismo curso, cada trimestre, para toda la plantilla. Los resultados mejoran en todas las áreas menos en Finanzas, que sigue cayendo en facturas falsas.»

**A-8 · OPCIONAL · Pregunta 2 (s05) · paridad de las opciones**
B es la única en infinitivo («Sancionar a quien no avise») entre tres sustantivos que encajan con «¿Qué cambio…?», y A y C miden igual (40) mientras B y D miden 26 y 22: las dos largas parecen las serias. No afecta a la unicidad de la respuesta. Si se toca: B «Una sanción a quien no avise» (28).

Quedan comprobados y correctos, sin hallazgo: los ocho temas del objetivo en s06 (coinciden con el 5.6); «autorizada por escrito», «sin señuelos crueles: ni despidos, ni nóminas, ni resultados médicos» (`:331`); circuito de avisar y contestar siempre aunque sea un falso positivo (`:331`, `:426`); initial antes de dar accesos y recurring porque se olvida y los ataques cambian (`:423`, `:429`, q2); risky/unexpected/unintentional con sus respuestas (política y controles, investigar, diseño y formación); letras de clave (B, C, A) y de trampa (D, A, B) sin patrón; ninguna de las tres preguntas copia ni parafrasea el banco (`sp5m8q1`-`q7`), los tres checks ni `pl-sp5q12`.

---

## B. NATURALIDAD

**B-1 · CORREGIR · s02-01 a s02-04, s03-01 a s03-03 y tarjeta de s03 · «aviso» con tres sentidos, y «la primera» tras «avisos»**
En un vídeo cuya tesis es «que la gente avise» (reportar), «aviso» significa además: alerta que llega a Seguridad («tres avisos que llegan a Seguridad»), y advertencia que se salta el empleado de Q1 («aceptó el aviso», tarjeta «Saltarse un aviso a sabiendas es risky»). En voz, lo último puede oírse como «ignoró un reporte», lo contrario de la tesis. Además, tras «tres avisos» (masculino) la voz sigue con «La primera… La segunda… La tercera», que concuerda con «persona», no con «aviso»; las notas dicen que así se evita el género, pero «la primera» lo marca en femenino las tres veces. Corrección: llamar «casos» a lo que llega a Seguridad (la pantalla puede decir «Tres casos que llegan a Seguridad · imagina · sin fecha»; sigue distinto del marco de V35, que es lo que pedía C-9), y «advertencia» a lo del navegador (A-1).
- s02-01: «<engaging> Primero, por qué hace cada uno lo que hace. {faces}Imagina tres casos que llegan a Seguridad.»
- s02-02: «<clear> {risky}En el primero, alguien reenvía documentos de trabajo a su correo personal. Sabe que no se puede, y lo hace por comodidad. Es risky behavior, y se corrige con política y controles.»
- s02-03: «<thoughtful> {unexpected}En el segundo, una cuenta de Compras abre de pronto las nóminas de otra sección. No encaja con ella. Es unexpected behavior. No se acusa, se investiga.»
- s02-04: «<warm> {unintentional}En el tercero, alguien sube una foto del equipo, con una pizarra de sistemas al fondo. Ni se dio cuenta de lo que enseñaba. Es unintentional behavior, y se previene con diseño y formación.»
Con «Ni se dio cuenta de lo que enseñaba» el tercer caso queda frente a Q1 en el eje correcto (no sabía que era un riesgo frente a sabía que estaba prohibido). Palabras: s02 pasa de 117 a ~124; ya iba por encima del presupuesto y lo absorbe la ventana.

**B-2 · CORREGIR · s04-01 · «phishing simulado» sin explicar, y «ninguno es cruel» sin sujeto**
Regla 3 (primero la idea, luego el nombre): «una campaña de phishing simulado» es el concepto 2 entero y se nombra sin decir qué es; quien no haya leído la lección oye el término y sigue. Y «El señuelo es la nueva aplicación del comedor, y ninguno es cruel»: hay un solo señuelo, así que «ninguno» queda colgando.
Corrección: «<engaging> Segundo, qué se mide. {campaign}El puerto prepara su primera campaña de phishing simulado, o sea, correos falsos que manda él mismo y que autoriza por escrito. {lure}El señuelo es la nueva aplicación del comedor. {no-cruel}Nada cruel, a propósito.»

**B-3 · CORREGIR · s04-04 y s04-05 · el circuito se oye como lista telegráfica con jerga**
«Botón en el correo, triaje y, si era real, quitarlo de los demás buzones. Y contestar siempre, aunque fuera falso» son cuatro pasos en fragmentos (regla 8: una lista de más de tres va a pantalla), «triaje» no se ha explicado en el vídeo y «aunque fuera falso» deja dudar de qué es falso. La farola empieza con «Como avisar…», que es un fragmento.
Corrección s04-04: «<confident> {loop}Avisar tiene que costar un clic: un botón en el correo. Luego alguien lo revisa, y si era real, lo quita de los demás buzones. Y a quien avisó se le contesta siempre, aunque fuera una falsa alarma.»
Corrección s04-05: «<warm> {streetlight}Es como avisar al ayuntamiento de que la farola de tu calle no funciona. Nadie contesta, y a la tercera vez dejas de avisar.» («Ayuntamiento» sí en voz: sin destinatario, «avisar» no tiene a quién, y s05-03 vuelve con «el teléfono». «Triaje» y el resto del circuito se quedan en pantalla.)

**B-4 · CORREGIR · s06-03 y s06-04 · cinco audiencias leídas en cadena**
Diez fragmentos «sujeto, cosa» seguidos en dos segmentos («Finanzas, facturas falsas y verificar por otro canal. Sistemas, credenciales y… Dirección, lo que no se publica. Quien trabaja fuera, las redes de casa. Quien acaba de llegar, la política y a quién avisar»): se oye como la lista que la regla 8 manda a la pantalla, y «Los ocho temas, en pantalla» nombra «los ocho temas» sin que se haya dicho de qué. Para Q3 basta con tener dichos Finanzas y Sistemas. Propuesta (las otras tres siguen en pantalla, como ya hacen los ocho temas):
- s06-03: «<clear> {audiences}Y la formación se adapta a cada grupo, según su riesgo. A Finanzas le toca aprender a verificar una factura por otro canal. A Sistemas, a cuidar sus credenciales y a no aprobar accesos que no han pedido ellos.»
- s06-04: «<casual> Con Dirección, con quien trabaja fuera o con quien acaba de llegar pasa igual: cada grupo, lo suyo, y lo tienes en pantalla. {topics}Ahí también están los ocho temas que pide el examen.»
(Si se prefiere mantener las cinco en voz, reescribir cada una como frase con verbo: «Dirección tiene que saber qué no se publica», «quien trabaja fuera, cuidar las redes de casa», etc.)

**B-5 · CORREGIR · s07-03 · «Repetir el curso de camarero no te enseña a negociar» no se entiende**
La imagen del inglés solo se ha contado en s06-02 como «el inglés del instituto: lo aprobaste y hoy no pides ni un café». «Curso de camarero» y «negociar» no aparecen antes en la voz; solo estaban en el boceto de pantalla de la ficha. Es una analogía nueva en el último capítulo (regla 6: una por concepto y se mantiene, sin amontonar). Corrección, con la misma imagen y un solo elemento nuevo: «<warm> {english-back}Repetir el inglés del instituto no te enseña a negociar un contrato.» Storyboard s07 (`english-back`): «repetir el inglés del instituto no te enseña a negociar un contrato». Y en s07-02 añadir el canal: «<firm> {ok-3}Es formar a Finanzas en verificar los pagos por otro canal, porque cada grupo tiene su riesgo. {trap-3}Repetir tienta, pero esa empresa ya repite, y lo genérico no toca el riesgo de Finanzas.»

**B-6 · OPCIONAL · s01-02 y s02-01 · «por qué lo hizo cada uno»**
En el anuncio de las tres preguntas, «lo hizo» no tiene a quién referirse (todavía no hay nadie). Propuesta s01-02: «<confident> {title}Que la gente avise. {promise}Hoy, tres preguntas. Por qué hace cada uno lo que hace, qué se mide, y a quién se forma y cada cuánto.» El rótulo del capítulo «Por qué lo hizo» en pantalla puede quedarse.

**B-7 · OPCIONAL · frases sueltas**
- s01-01 «Su idea: la gente no es…» suena a ficha. «Y parte de una idea. La gente no es el eslabón más débil, sino la mayor red de avisos que tiene.»
- s05-02 «pero reconocerlo ya lo saben» es torpe: «Más formación tienta, pero ya saben reconocerlo.» Y «lo que frena es lo que cuesta avisar» mejor «…lo que frena es lo difícil que resulta avisar».
- s06-02 «La recurring dura todo el año» (lo que dura todo el año es el programa, la formación se repite): «La recurring se repite durante el año, porque se olvida y los ataques cambian. Es como el inglés del instituto: lo aprobaste, pero hoy no sabrías pedir ni un café.»
- s07-01, dos relativas apiladas («Finanzas, que sigue cayendo en facturas falsas que piden cambiar la cuenta bancaria») y «Todo mejora» sin sujeto: «Los resultados mejoran en todas las áreas, menos en Finanzas. Siguen cayendo en facturas falsas que piden cambiar la cuenta bancaria.»
- s08-03: «Y la tercera, la formación es de todo el año y de cada grupo.» (la voz de la regla 3 no menciona la audiencia, que es lo que pregunta Q3; la frase final sí).

**B-8 · OPCIONAL · muletillas de plantilla**
«tienta, pero…» abre la resolución de la trampa en las tres preguntas (s03-02, s05-02, s07-02), y la glosa de «MEJOR» («Ojo con ese «mejor». Pide la que más encaja aquí, aunque otra también suene bien») es casi la de V31 («…aunque otra también sea verdad en parte») y la de V30/V28; `_revision` G-4 pedía variarla. Propuesta de glosa distinta (la usa A-1): «Ojo con ese «mejor». No busca una que valga, sino la que más sirve en este caso.» Para uno de los «tienta»: s05-02 «Más formación parece lo lógico, pero ya saben reconocerlo.»

**B-9 · OPCIONAL · «la formación initial», «la recurring»**
Dos adjetivos ingleses con artículo femenino, la primera vez que se oyen, sin su equivalente (regla 3). s06-01: «La formación inicial, la initial del examen, es al entrar, antes de dar accesos.» Y s06-02 ya trae «la recurring».

---

## Veredicto

**Congelar tras corregir A-1, A-2, A-3, A-4, A-5 y B-1, B-2, B-3, B-4, B-5.**
Las cuatro correcciones de pantalla (A-1, A-3, A-4 y la línea de s07 de B-5) tocan `storyboard.json` y `narration.json`; el resto es solo de voz. Con A-1 aplicado, la clave de la pregunta 1 queda única. Tras los cambios, el guion gana unas 50 palabras (de 698 a ~750) y queda en torno a 300 s con la medida de Lidia (~0,89 del estimado; límite 330); conviene volver a pasar `build-timeline --estimate`.

Recuento: **0 bloqueantes · 10 CORREGIR (A-1 a A-5, B-1 a B-5) · 7 OPCIONAL (A-6, A-7, A-8, B-6, B-7, B-8, B-9)**.
