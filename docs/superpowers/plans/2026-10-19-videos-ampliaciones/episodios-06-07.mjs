export const EPISODES_06_07 = [
  {
    id: 'AP06', slug: 'yara-prueba-entrega', track: 'gcti', lessons: ['s3m5', 's5m3'],
    sfx: { 'fx-check-1': 'check', 'fx-typing': 'typing', 'fx-error-1': 'error', 'fx-check-2': 'check', 'fx-error-2': 'error', 'fx-mail': 'mail' },
    title: 'Tu YARA compila: ahora demuestra qué detecta',
    promise: 'Validar una regla con un motor real y entregarla con resultados reproducibles y límites.',
    adversary: 'VELVET CICADA',
    concepts: ['Compilación y ejecución reales', 'Falsos positivos y negativos', 'Regresión, generalización y sobreajuste', 'Regla de muestra, familia y hunting', 'Entrega técnica y mantenimiento'],
    analogy: 'Un examen corregido contra su enunciado: acertar el conjunto de respuestas no prueba saber cualquier tema.',
    chapters: ['La prueba pendiente', 'Errores que importan', 'Cambiar el alcance', 'Preparar la entrega', 'Una conclusión reproducible'],
    sources: ['YARA: motor Python', 'Curso: verify.py y fixtures.py', 'Curso: reference.yar', 'Curso: s5m3, entrega técnica'],
    omitted: 'Instalación detallada de Python, problemas de sistema operativo, validación de producción con malware real y el flujo de Sigma de V27.',
    scenes: [
      {
        title: 'La sintaxis está bien', visual: 'Meridian, práctica inerte ALRTDEMO. Terminal rotulada motor real solo cuando se capture una ejecución real. Estado de la regla: sintaxis aceptada, resultados pendientes. Título y promesa tempranos.',
        text: [
          'Tu regla {fx-check-1}compila. Ahora vas a comprobar qué detecta, qué se le escapa y qué debes entregar para que otra persona pueda evaluarla.',
          'Estamos en el laboratorio didáctico de Meridian, una empresa aeroespacial. Los archivos son inertes. Una regla YARA expresa patrones y condiciones. Que el motor acepte su sintaxis no significa que cumpla el objetivo de detección.',
          'Usamos el mismo paquete de práctica que la lección. Incluye tres variantes dentro del alcance, controles parecidos y casos que revelan límites. No necesitas malware real ni una cuenta de pago. Lo que necesitas es comparar resultados esperados con resultados observados.',
        ],
      },
      {
        title: 'El motor y el archivo importan', visual: 'Captura real del comando documentado para regla del alumno y para reference.yar. Registrar YARA4.5.4 si es el motor capturado, sin fijar esa versión para siempre. Error sintaxis exit2 / discrepancia exit1 / conformidad exit0. No simular terminal como ejecución real.',
        card: 'Compilar valida sintaxis; ejecutar contrasta coincidencias',
        text: [
          'Primero {fx-typing}descargas la regla que has escrito. El editor del navegador no la ejecuta. El verificador local la compila con YARA real y la aplica al conjunto de archivos de prueba. Ese conjunto se llama corpus. El paquete explica cómo preparar el entorno.',
          'Registra qué motor y qué versión utilizaste. Conserva también la versión de la regla y los archivos de prueba. Si cambias la regla o el corpus, has cambiado la prueba. La evidencia anterior no cubre automáticamente el cambio.',
          'Un error de compilación no es una ausencia de coincidencia. La regla no llegó a {fx-error-1}evaluarse como esperabas. Una discrepancia significa otra cosa. El motor produjo un resultado que no coincide con la expectativa del caso. Esa diferencia debe quedar visible.',
        ],
      },
      {
        title: 'Acertar algo y detectar de más', visual: 'Matriz por archivo A/B/C/control ruta/control hex/manual. Etiquetas objetivo y match separadas. Regla ingenua amplia detecta controles. Mantener términos TP/FP/FN/TN en pantalla definidos, sin recitar lista de cuatro.',
        intercept: 'Cuantas más coincidencias salgan, mejor es la regla.',
        text: [
          'Más coincidencias pueden significar más errores. Si un archivo queda fuera de tu objetivo y la regla lo acepta, tienes un falso positivo. Si uno que debería entrar no coincide, tienes un falso negativo. Las etiquetas dependen del objetivo declarado.',
          'En el paquete hay controles con una ruta sola, un marcador solo o unos bytes coincidentes. Una condición demasiado permisiva puede aceptarlos. Si los aceptas por accidente, no has descubierto más variantes. Has ampliado la regla más de lo que justificaban tus datos.',
          'Por eso revisas cada archivo, incluidos los negativos. Una pantalla llena de aciertos parciales no basta. Necesitas saber qué se esperaba, qué ocurrió y por qué. El verificador compara resultados completos y devuelve un fallo cuando hay discrepancias.',
        ],
      },
      {
        title: 'Volver al ejemplo conocido', visual: 'C ya se usó al diseñar en AP05: cambia ruta, conserva marcador y hex. Exigir todo falla C; la referencia alternativa lo cubre. Tras la pausa, distinguir regresión de caso conocido y evaluación con casos nuevos. El paquete agrupa training6 / held-out5 / challenge1, pero todos son públicos y sus nombres no garantizan independencia del diseño.',
        think: { q: '¿Exigir todo mejora siempre la cobertura?', choices: ['Sí, más condiciones siempre ayuda', 'No, puede perder una variante'], answer: 1 },
        card: 'Una regla más restrictiva puede perder variantes',
        text: [
          'C cambia la ruta pero conserva otros rasgos del objetivo. Ya lo usamos al escribir la condición. Si ahora exiges todas las cadenas, ¿mejora siempre la regla o puedes perder una variante que querías detectar?',
          'Puedes perderla. Volver a probar C comprueba un ejemplo conocido. Es una prueba de regresión: ayuda a descubrir si un cambio rompe algo que antes funcionaba. No demuestra que la regla detecte variantes nuevas.',
          'Ajustar hasta memorizar ejemplos se llama sobreajuste. Para evaluar generalización, reserva casos nuevos que no hayan influido en el diseño. Aquí los archivos son públicos y sintéticos. Sus resultados enseñan el método, sin demostrar cobertura de malware real.',
        ],
      },
      {
        title: 'Tres reglas, tres trabajos', visual: 'Referencia Sample→A; Family→A/B/C; Hunt→A/B/C+benign-route/marker/hex. Casos y hash de corpus al pie. No describir Hunt con0FP. Diferenciar objetivos de sus etiquetas de evaluación.',
        text: [
          'El paquete incluye una regla estrecha para una muestra, otra para el conjunto de variantes y otra para buscar candidatos. La primera exige un rasgo concreto del archivo A. Es útil para ese alcance, pero pierde B y C.',
          'La regla de familia del ejercicio cubre A, B y C dentro del contrato sintético. No acredita cobertura de una familia real. La regla de hunting es más amplia. Recupera también controles que comparten un rasgo y necesitan revisión.',
          'La diferencia no se decide por un nombre bonito en la regla. Se decide por el objetivo, los requisitos y los resultados. Una regla amplia puede ser útil para investigar candidatos y ser inadecuada para bloquear automáticamente. La acción prevista forma parte de la entrega.',
        ],
      },
      {
        title: 'Doce de doce, con denominador', visual: 'Salida real12/12 conforme al alcance; mostrar que incluye no-matches. future-uncovered v2 queda sin match; límite4096bytes. Contrato v1 separado de objetivo ampliado v2. No usar100% malware real.',
        card: 'Doce resultados esperados no son cobertura universal',
        text: [
          'La referencia obtiene los {fx-check-2}doce resultados previstos del paquete. Eso incluye archivos que deben coincidir y archivos que no deben hacerlo. No significa que detecte doce infecciones. Tampoco significa que tenga una sensibilidad perfecta frente a una familia real.',
          'La variante futura del ejercicio cambia el marcador y la ruta. La referencia {fx-error-2}no la cubre. Si tu objetivo incluye esa versión, tienes un falso negativo conocido. Los archivos fuera del tamaño pactado también muestran un límite cuando amplías el objetivo.',
          'Conserva esos resultados al informar. Decir que todo salió conforme a un contrato pequeño es correcto. Convertirlo en una promesa de producción no lo es. Tu conclusión debe llevar el alcance con el que interpretaste cada coincidencia y cada ausencia.',
        ],
      },
      {
        title: 'Mandar la regla no basta', visual: 'Paquete de entrega: regla/version/hash, motor, corpus/hash, matriz, alcance/FP-FN, acción, responsable/revisión/derechos. Mensaje como atajo de método firmadoVELVET CICADA; no confesión ni adelanto de dossier.',
        intercept: 'Manda la regla y escribe cien por cien. Queda mejor.',
        text: [
          'Queda mejor hasta que otra persona necesita entender qué probaste. Entrega la regla versionada, el objetivo y la procedencia de sus patrones. Añade el motor, el corpus y la matriz de resultados. El receptor debe poder reproducir lo que afirmas.',
          'Explica las limitaciones y los errores conocidos. Di si una coincidencia necesita revisión humana o alguna acción específica. Una captura de YARA Forge solo demuestra la simulación por etiquetas. No sustituye una compilación y una ejecución reales de tu archivo.',
          'Revisa también quién puede recibir la evidencia y qué uso está permitido. Los datos sintéticos de este ejercicio no contienen secretos. Eso no permite olvidar los derechos y la protección de evidencias cuando entregas reglas apoyadas en material de terceros.',
        ],
      },
      {
        title: 'El receptor quiere bloquear', visual: 'Propuesta ficticia del SOC: desplegar a toda la flota por12/12. Pregunta laboratorio/producción. Resolver con validación representativa y acción autorizada sin exigir implementación en esta tanda.',
        think: { q: '¿Estos resultados justifican bloquear la flota?', choices: ['Sí, pasó todo el paquete', 'No, falta validar ese uso real'], answer: 1 },
        card: 'La validación tiene que corresponder al uso previsto',
        text: [
          'El receptor ve los doce resultados conformes y propone bloquear toda la flota. ¿El paquete sintético justifica ese uso, o necesitas una validación que corresponda a los archivos y a la acción de producción?',
          'Necesitas validar ese uso. El ejercicio demuestra la mecánica y los resultados de unos archivos preparados. Antes de una acción real necesitas controles representativos, cobertura adecuada y una respuesta autorizada. El coste de una coincidencia equivocada también cambia con la acción.',
          'No estás rechazando la regla por haber nacido en un laboratorio. Estás delimitando qué evidencia existe. Puedes entregarla como práctica o punto de partida. No puedes presentar el resultado sintético como prueba suficiente de eficacia en toda la organización.',
        ],
      },
      {
        title: 'Una entrega que puede mantenerse', visual: 'Ficha de entrega con versión1.0, fecha editorial, alcanceALRTDEMOv1; dueño didáctico; revisión ante nuevos fixtures. No inventar fecha de despliegue. Mostrar reejecución tras cambio y revisión de errores.',
        card: 'Versión, resultados, acción y responsable viajan juntos',
        text: [
          'Añade un responsable y un criterio de revisión. La regla puede dejar de cubrir lo que interesa o empezar a coincidir con contenido legítimo nuevo. Quien recibe la entrega necesita saber cómo comunicar esos errores y cuándo revisarla.',
          'Si cambias un patrón, conserva la versión anterior y repite las pruebas. Si cambias el corpus, registra qué se añadió y por qué. Los hashes ayudan a identificar los archivos exactos usados. No prueban por sí solos que el conjunto sea representativo.',
          'Así {fx-mail}entregas una detección que otra persona puede evaluar, repetir y mantener. El paquete permite reproducir resultados y discutir límites. Quien lo recibe no debería necesitar toda tu conversación para entender qué puede hacer con la regla.',
        ],
      },
      {
        title: 'De la regla al producto', visual: 'Tres reglas: compilar no es validar / medir positivos y negativos / entregar alcance y reproducción. Acción única: ejecutar verificador sobre MiRegla y completar una ficha de entrega. Aviso complementario y fuentes.',
        text: [
          'Tres reglas de cierre. Compilar valida sintaxis, no eficacia. Revisar positivos y negativos evita esconder errores. Y una entrega técnica necesita alcance, reproducción y acción prevista, además del archivo de la regla.',
          'El resultado útil no es una cifra grande. Es una afirmación concreta que otra persona puede comprobar. Si sabes dónde falla, dilo. Esa información ayuda a decidir cómo usarla y qué evidencia recoger después.',
          'Ejecuta ahora el verificador sobre tu regla descargada y prepara su ficha de entrega. Incluye los casos que no cubre. En la lección de diseminación tienes el modelo. Tu trabajo termina cuando la siguiente persona puede evaluar la detección sin adivinar tus supuestos.',
        ],
      },
    ],
  },
  {
    id: 'AP07', slug: 'stealers-metricas', track: 'gcti', lessons: ['s4m4', 's5m5'],
    sfx: { 'fx-ping-1': 'ping2', 'fx-ping-2': 'ping2', 'fx-check': 'check', 'fx-error': 'error' },
    title: 'El infostealer número uno depende de qué estés contando',
    promise: 'Comparar unidades y decidir relevancia para una organización sin fabricar un ranking permanente.',
    adversary: 'PAPER CRANE',
    concepts: ['Familia y roles del ecosistema', 'Unidades de medida distintas', 'Ventana, deduplicación y cobertura', 'Prevalencia observada y relevancia', 'Métricas del fenómeno frente a valor CTI'],
    analogy: 'Varias clasificaciones de la misma tabla; cambiar la columna cambia el ganador, no necesariamente el riesgo de Meridian.',
    chapters: ['El titular', 'Qué cuenta cada columna', 'Qué puede observar la fuente', 'Qué importa a Meridian', 'La conclusión útil'],
    sources: ['Curso: s4m4, dataset ficticio Bruma/Cobalto/Duna', 'Curso: s5m5, valor del equipo CTI', 'Curso: s3m1/s3m4, sesgo y reporting'],
    omitted: 'Rankings actuales de familias reales, cuotas globales, atribución de operadores y estimaciones poblacionales a partir de una fuente sin representatividad.',
    scenes: [
      {
        title: 'Tres ganadores en una tabla', visual: 'Dataset ficticio septiembre2026 UTC; Demo-P, dos regiones, sin cobertura global. Tres columnas aparecen por turnos, cada una con ganador distinto. Nada indica ranking vigente del mundo. Título temprano.',
        text: [
          'Una tabla tiene {fx-ping-1}tres ganadores distintos. Vas a ver cómo pasa y cuál de sus métricas ayuda a decidir una prioridad para tu organización.',
          'Comparas programas pensados para robar información del dispositivo. Ese tipo de malware se llama infostealer. Estamos en un ejercicio de Meridian, una empresa aeroespacial. Las familias Bruma, Cobalto y Duna son inventadas. Sus datos de septiembre tampoco son un ranking real.',
          'Una familia destaca por archivos distintos. Otra por dispositivos observados. La tercera por registros robados. Antes de preguntar cuál es la primera, pregunta qué estás contando. Esas columnas describen cosas diferentes y pueden conducir a decisiones diferentes.',
        ],
      },
      {
        title: 'El programa y quien lo usa', visual: 'Familia/código → varios operadores; operador → varias familias; distribuidor entrega; campaña agrupa actividad; broker vende acceso. Relaciones muchos-a-muchos. No atribuir a PAPERCRANE las familias ficticias por firmar mensajes.',
        card: 'Familia, operador y campaña no son equivalentes',
        text: [
          'Una familia de malware agrupa código o capacidades según unos criterios. Un operador usa ese malware. Un distribuidor lo entrega a objetivos. Una campaña agrupa actividad con alcance y periodo. Un broker comercializa acceso. No son nombres para la misma cosa.',
          'La misma familia puede estar en manos de varios operadores. Un operador puede usar más de una familia. Y quien anuncia unos datos puede no ser quien los obtuvo. El ecosistema no encaja en una fila con un programa y una persona.',
          'Por eso una etiqueta de familia no atribuye automáticamente al autor del robo ni al vendedor. Identificar el código ayuda, pero la autoría y las relaciones comerciales necesitan otras evidencias. Conserva ese límite cuando compares actividad y cuando escribas conclusiones.',
        ],
      },
      {
        title: 'Miles de registros no son miles de equipos', visual: 'Bruma1200muestras/130episodios/100dispositivos/8000registros/40organizaciones/4sector. Mostrar80registros por dispositivo como cociente del dataset, no todas las distribuciones individuales. Un equipo puede producir muchos registros.',
        intercept: 'Ocho mil registros. Ocho mil equipos infectados.',
        text: [
          'No son la misma unidad. En nuestra tabla, Bruma tiene ocho mil registros y cien dispositivos observados. Un equipo puede producir muchas entradas. Un paquete de datos robados tampoco equivale automáticamente a una credencial válida.',
          'Una muestra es un archivo contado con el criterio que declares, por ejemplo su hash. Un episodio de infección es otro tipo de evento. El mismo dispositivo puede tener varios. Cambiar el empaquetado puede generar muchos archivos sin sumar equipos afectados.',
          'También debes definir víctima. ¿Hablas de una persona o de una organización? Una empresa puede tener muchos dispositivos. Varias cuentas pueden corresponder a alguien. Si no dices qué cuenta una fila, el titular puede parecer exacto y estar comparando unidades incompatibles.',
        ],
      },
      {
        title: 'Ordenar otra columna', visual: 'Tabla exacta curso: Bruma1200/130/100/8000/40/4; Cobalto300/540/450/3000/60/90; Duna80/260/220/12000/100/22. Primero solo hashes, luego dispositivos. Pregunta no revela respuesta en título.',
        think: { q: 'Por dispositivos, ¿Bruma o Cobalto?', choices: ['Bruma', 'Cobalto'], answer: 1 },
        card: 'Muestras, dispositivos y registros cambian la clasificación',
        text: [
          'Bruma lidera por muestras. Ahora cambia la columna a dispositivos observados. ¿Sigue primera o pasa delante Cobalto? Mira la unidad antes de elegir. No necesitas convertir una cifra en otra para ordenar esa columna.',
          'Pasa Cobalto, con cuatrocientos cincuenta dispositivos, frente a los cien de Bruma. Por registros gana Duna. También tiene más organizaciones en esta tabla. No hay una contradicción. Cada clasificación responde a una pregunta distinta.',
          'Y no sumes organizaciones de varias familias como si fueran grupos separados. Una misma organización puede aparecer en más de una fila. Para calcular un total necesitas identificar y deduplicar esos solapamientos. La tabla no convierte automáticamente las poblaciones en independientes.',
        ],
      },
      {
        title: 'Una cifra necesita su método', visual: 'Ventana1–30septiembre2026 UTC. Claves: muestrasSHA256; episodios dispositivo/día; dispositivosID estable; registros dispositivo/artefacto/fecha obtención; organizacionesID validada. Señalar sesgos de identificadores, reventas y definiciones. No presentar como estándar universal.',
        text: [
          'El proveedor de ejemplo ve {fx-ping-2}dos regiones y una selección de anuncios. No observa todo el mundo. Las cifras describen esa cobertura. Para compararlas, necesitas la ventana temporal y la forma en que se han eliminado duplicados.',
          'Aquí los archivos se separan por hash. Los episodios se agrupan por equipo y día. Los dispositivos usan un identificador estable. Son decisiones del ejercicio, no reglas universales. Identificadores que cambian pueden dividir un mismo equipo o unir varios por error.',
          'Los registros repetidos se {fx-check}deduplican según dispositivo, artefacto y fecha de obtención. Una reventa no suma otra infección. Y obtener los datos, publicarlos y venderlos son momentos distintos. Confundir esas fechas puede hacer parecer reciente una exposición antigua.',
        ],
      },
      {
        title: 'Lo que ve el proveedor', visual: 'Demo-P: población parcial, clientes sectoriales y anuncios. No global. Comparación entre meses tachada si cambian sensores/etiquetas. Actividad reciente: Bruma10/Cobalto180/Duna20 dispositivos última semana, sin sumarla a totalmensual por ser subconjunto.',
        card: 'La prevalencia observada depende de cobertura y sesgo',
        text: [
          'Un proveedor puede observar más Cobalto porque tiene más clientes del sector donde aparece. Puede recibir más Bruma porque circulan muchos archivos reempaquetados. También puede recibir anuncios repetidos de Duna por reventas. Esos anuncios no deben aumentar los registros únicos de la tabla.',
          'Si añade sensores o cambia etiquetas entre meses, sus cifras pueden {fx-error}subir sin que haya crecido la amenaza. Antes de comparar, revisa si el método y la población siguen siendo comparables.',
          'Llamamos prevalencia observada a la frecuencia dentro de esa visibilidad y esa definición. No es automáticamente una cuota global. Tampoco es la prioridad de Meridian. Para esa decisión todavía falta conectar los datos con la exposición y las necesidades de la empresa.',
        ],
      },
      {
        title: 'La pregunta de Meridian', visual: 'Requisito: investigar exposición de sesión en su sector. Cobalto90dispositivossector/180últimasemana/capacidad de material sesión. Bruma4sector/10recientes; Duna22/20, archivosregistros. Capacidad no prueba materialrobado ni infección propia.',
        intercept: 'La que tiene más muestras es tu mayor riesgo.',
        text: [
          'No necesariamente. Meridian necesita investigar exposición de sesiones en su sector. Mira ahora los dispositivos del sector, la actividad reciente y las capacidades descritas. No todas las columnas responden igual a esa necesidad. Compara esas señales antes de elegir una familia.',
          'Nada de eso prueba que Meridian esté comprometida. Tampoco demuestra que todos esos operadores tengan las mismas capacidades o que las usaran en cada caso. Las fichas describen lo observado y sus límites. Después debes contrastarlo con exposición interna y otras fuentes.',
          'Si el requisito fuera recuperar archivos filtrados, Duna podría merecer otra prioridad. Si cambiaran las aplicaciones que usa Meridian, también cambiaría la relevancia. La primera posición de una tabla no sustituye una decisión sobre la organización concreta.',
        ],
      },
      {
        title: 'Qué investigar primero', visual: 'Pregunta con opciones «Bruma»/«Cobalto», sin color ni ranking de respuesta antes de la pausa. Mantener visibles las columnas sector, recencia y capacidad. Resolver prioridad Cobalto con confianza moderada y necesidad de corroboración. No pedir deshabilitar cuentas o bloquear por ranking.',
        think: { q: 'Para Meridian, ¿Bruma o Cobalto primero?', choices: ['Bruma', 'Cobalto'], answer: 1 },
        card: 'La relevancia combina capacidad, recencia y exposición',
        text: [
          'Bruma lidera por archivos. Cobalto destaca en otras señales que acabas de comparar. Si solo puedes empezar una revisión, ¿cuál investigarías primero para el requisito de Meridian? Elige con los datos de sector, actividad reciente y capacidad delante.',
          'Comparas esas señales y priorizas investigar Cobalto en este caso. La confianza es moderada por las limitaciones de fuente y método. Priorizar investigación no significa declarar una infección propia. Tampoco autoriza medidas automáticas sobre personas o sistemas.',
          'Escribe qué podría cambiar la prioridad. Una fuente independiente, nueva evidencia interna o una corrección de duplicados. Si llega esa información, revisas el juicio. La clasificación no es una etiqueta permanente que se queda pegada a la familia.',
        ],
      },
      {
        title: 'El equipo no vale más por recibir más muestras', visual: 'Dos paneles separados: métricas de amenaza / valor CTI. A la izquierda dispositivos/episodios/registros; derecha requisito/producto/decisión/resultado. Más volumen no produce flecha causal automática a menos riesgo.',
        card: 'Actividad de amenazas no mide por sí sola el valor CTI',
        text: [
          'Estas cifras describen el fenómeno que observa la fuente. Las métricas del equipo de inteligencia responden a otra pregunta. Si sus productos ayudan a resolver requisitos, orientar decisiones y mejorar resultados. No son intercambiables.',
          'Recibir más archivos no demuestra que el equipo aporte más valor. Recibir menos tampoco prueba que haya reducido el riesgo. Puede haber cambios de cobertura, de actividad o de colección. Necesitas conectar el trabajo con sus consumidores y sus decisiones.',
          'En la entrega, separa la clasificación de amenazas de la evaluación del programa. Explica qué observaste y qué decisión ayuda a tomar. Si no sabes qué parte del resultado depende del equipo, no conviertas una coincidencia temporal en una causa demostrada.',
        ],
      },
      {
        title: 'Un titular con sus bordes', visual: 'Tres reglas: unidad y ventana / método y cobertura / requisito y límites. Conclusión modelo acotada a Demo-Psept2026, sin ranking actual. Acción única: ordenar dataset s4m4 en dos métricas y justificar prioridad.',
        text: [
          'Tres reglas para que el titular no te engañe. Di qué cuentas y en qué periodo. Explica cómo se deduplica y qué parte del mundo observa la fuente. Después relaciona los datos con el requisito de la organización.',
          'Puedes decir que Bruma lidera por muestras y Cobalto por dispositivos en este dataset. También que investigarías antes Cobalto para esta necesidad de Meridian. Son afirmaciones compatibles porque sus unidades y sus propósitos están claros.',
          'Abre ahora el dataset de la lección de análisis. Ordénalo con dos métricas y justifica tu primera prioridad de investigación. Añade una limitación de cobertura y una evidencia que te haría cambiar. El número uno necesita apellidos antes de convertirse en una decisión.',
        ],
      },
    ],
  },
];
