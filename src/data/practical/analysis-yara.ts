import { check, code, complement, h, links, list, p, table, video, type LessonExpansion } from './shared';

export const ANALYSIS_EXPANSIONS: Record<string, LessonExpansion> = {
  s3m5: {
    minutes: 30,
    objectives: ['Complementario: escribir y validar YARA sobre un corpus inerte, justificar combinaciones y declarar falsos positivos, negativos y alcance'],
    blocks: [
      complement('Escritura y validación de YARA'),
      p('Una regla **YARA** expresa una hipótesis de detección mediante patrones y una condición. **Compilar** comprueba que la sintaxis es válida para el motor. **Ejecutar** aplica esa regla a bytes o a memoria. Que compile no demuestra que detecte lo que buscas; que coincida no demuestra malicia ni atribución. Antes de escribir, define el objetivo, el corpus y qué resultado esperas de cada archivo.'),
      table(['Parte', 'Función', 'Decisión de diseño'], [
        ['meta', 'Documenta autoría, versión, fecha, origen y alcance', 'No modifica la coincidencia. Evitar que el nombre de una familia prometa una cobertura no medida.'],
        ['strings', 'Define patrones con identificadores como $marker', 'Elegir patrones justificables en la evidencia, estimar qué controles benignos podrían contenerlos.'],
        ['condition', 'Combina patrones y restricciones con lógica booleana', 'Usar and, or, not y paréntesis según el objetivo. La agrupación forma parte de la hipótesis.'],
      ]),
      code('Modificadores y bytes · fragmentos ilustrativos, no una regla completa', '$marker = "cicada-demo-v1" ascii wide nocase\n$route  = "route=/collect-demo" ascii wide\n$hex    = { 41 4C 52 54 ?? 7F }\n\n// Ejemplo de agrupación:\n$marker and ($route or $hex)', 'yara'),
      p('**ASCII** representa aquí el texto de un byte por carácter. Sin modificadores, una cadena textual busca esos bytes y distingue mayúsculas. **wide** busca los caracteres con un byte 00 intercalado, como texto ASCII representado en UTF-16LE; no interpreta todo Unicode. **ascii wide** permite ambas representaciones. **nocase** ignora diferencias de mayúsculas/minúsculas en esos patrones, ampliando cobertura y posibles coincidencias. En una cadena hexadecimal, cada par describe un byte; **??** acepta cualquier byte y un comodín de medio byte como A? acepta cualquier valor de su mitad baja. No añadas comodines sin explicar qué variación pretenden cubrir.'),
      p('La condición **$marker and ($route or $hex)** exige el marcador y al menos una evidencia alternativa. **($marker and $route) or $hex** permitiría que los bytes hexadecimales solos disparasen la regla: es una cobertura diferente. Un umbral como **2 of them** cuenta patrones, pero no comprueba que sean distintivos ni independientes; dos nombres de biblioteca comunes pueden producir muchos falsos positivos. La elección depende del corpus y de cómo esperas que varíe el artefacto.'),
      table(['Objetivo', 'Diseño razonable y límites'], [
        ['Una muestra', 'Exigir una constante específica de ese build puede ser útil en triaje exacto, pero fallará en otras variantes. Un hash exacto suele ser más simple para identidad de bytes.'],
        ['Familia / conjunto de código', 'Rasgos estables y combinaciones justificadas frente a variantes y controles; documentar qué versiones y formatos se ensayaron. Coincidir no prueba un actor.'],
        ['Hunting amplio', 'Patrones más permisivos para descubrir candidatos; aceptar y medir más ruido, siempre con revisión. No usar automáticamente como bloqueo.'],
      ]),
      h('Formato, tamaño y evaluación'),
      p('En esta práctica llamamos **fixture** a un archivo preparado para comprobar un resultado esperado. **Training** son los ejemplos de diseño; **held-out**, los reservados para validación; **challenge**, un caso que revela límites. Como todos son públicos y sintéticos, no constituyen una prueba ciega ni representan la distribución de una familia real.'),
      p('Si el objetivo solo incluye un formato, restringirlo puede reducir ruido y coste. Para ejecutables PE reales, puede justificarse el módulo pe y pe.is_pe; comprobar únicamente los bytes MZ no basta para validar PE. Una restricción **filesize < 4KB** excluye 4096 bytes y más: es útil solo si el alcance lo permite, y provoca falsos negativos si aparecen variantes grandes. filesize corresponde a escaneo de archivos, no debe trasladarse sin más a memoria. Nuestra práctica usa el formato inventado ALRTDEMO, sin código ejecutable.'),
      p('Un **falso positivo (FP)** es un control fuera del objetivo que coincide; un **falso negativo (FN)** es un elemento del objetivo que no coincide. Un verdadero positivo (TP) o negativo (TN) depende de las etiquetas y del alcance declarado. **Sobreajustar** es adaptar la regla a los ejemplos conocidos hasta perder generalización, como exigir un dominio que cambia en cada build. Separa datos de diseño y validación, incluye controles parecidos y declara los casos desconocidos. Un corpus sintético pequeño demuestra mecánica, no sensibilidad frente a malware real.'),
      p('Antes de abrir el editor, la regla del ejercicio escrita paso a paso: qué debe coincidir, qué puede cambiar y qué dejas fuera.'),
      {
        t: 'video',
        title: 'Escribir YARA: qué debe coincidir y qué puede cambiar',
        youtube: 'fl02bWFRSUc',
        poster: 'videos/yara-condicion-poster.png',
        transcript: 'videos/yara-condicion-transcript.txt',
      },
      list(
        'Diseña primero con A y B y los controles de training. Escribe en lenguaje natural qué debe ser necesario y qué puede variar.',
        'Escribe tu regla en el editor. Descárgala y ejecuta el verificador con YARA real siguiendo el README del ZIP. Anota versión del motor y resultado por archivo; un error de compilación no es un «no match».',
        'Prueba los casos held-out. C cambia la ruta y un byte; el manual contiene todos los patrones pero no tiene cabecera al inicio. Inspecciona por qué aciertas o fallas.',
        'Revisa el caso challenge: una variante futura cambia marcador y ruta. La referencia no la cubre. Si amplías el objetivo a v2, registra ese falso negativo y recoge nueva evidencia antes de modificar condiciones.',
        'Compara las tres referencias: Sample es estrecha, Family cubre A/B/C, Hunt añade controles a revisión. Explica la diferencia antes de compartir una regla según s5m3.',
      ),
      { t: 'yara-practice' },
      check('Práctica · Una regla exige $marker and ($route or $hex). C conserva marcador y hex pero cambia ruta. ¿Qué ocurre?', [
        'Coincide porque satisface la rama alternativa hex; exigir todas las cadenas perdería C', 'No coincide: or obliga a que ambas ramas estén presentes',
        'Coincide incluso sin marker porque hex siempre basta', 'La coincidencia atribuye C a un actor',
      ], 0, 'La agrupación obliga a marker y permite route o hex. or no exige ambas ramas. Con esta agrupación hex solo no basta. Detectar patrones tampoco identifica al autor.'),
      check('Práctica · La referencia obtiene todos los resultados previstos en los 12 archivos. ¿Qué puedes publicar?', [
        'Detección del 100% de la familia real', 'Regla de producción validada universalmente',
        'Conformidad con este corpus y alcance, versión del motor, límites y FN conocido si se incluye v2', 'Que YARA Forge la compiló en el navegador',
      ], 2, 'Los resultados se limitan a fixtures sintéticos y al objetivo v1. No estiman la población real ni justifican producción. YARA Forge es una simulación por etiquetas; la compilación real ocurre en el motor local del verificador.'),
      p('Cuando tu regla ya compila, el siguiente paso: ejecutarla con el motor real, leer los doce resultados y preparar una entrega que otra persona pueda evaluar.'),
      {
        t: 'video',
        title: 'Tu YARA compila: ahora demuestra qué detecta',
        youtube: '2KXShpLy67s',
        poster: 'videos/yara-prueba-entrega-poster.png',
        transcript: 'videos/yara-prueba-entrega-transcript.txt',
      },
      links('Práctica guiada y entrega técnica', [
        { label: 'Lab 3B · YARA Forge (simulación por etiquetas)', href: '/lab/lab3b' },
        { label: 's5m3 · Entregar una regla con evidencia y límites', href: '/learn/s5m3' },
        { label: 'YARA · Sintaxis oficial de reglas', href: 'https://yara.readthedocs.io/en/stable/writingrules.html' },
        { label: 'YARA · Compilación y ejecución desde Python', href: 'https://yara.readthedocs.io/en/stable/yarapython.html' },
      ]),
    ],
  },
  s4m2: {
    minutes: 5,
    objectives: ['Complementario: distinguir corroboración independiente de republicación y eco de feeds'],
    blocks: [
      complement('Independencia de fuentes y eco de feeds'),
      p('El **eco de feeds** ocurre cuando una misma observación circula por varios proveedores y vuelve a parecer evidencia nueva. «Tres informes lo dicen» no equivale a tres observaciones. Traza cada afirmación hasta su origen: quién observó, cuándo, mediante qué acceso y quién está citando a quién. Dos fuentes comerciales pueden compartir un upstream, y dos analistas internos pueden estar mirando el mismo registro.'),
      code('Cadena de citas ficticia', 'Sensor de Faro → informe Faro → feed Eco → blog Z\n                            ↘ Atlas cita el mismo informe\n\nPara ese hecho: una observación original conocida, varias publicaciones.\nOtro registro interno independiente puede corroborar parte del hecho,\npero solo si registra el mismo fenómeno y su procedencia está verificada.'),
      p('**Resolución.** Si Eco cita a Atlas y Atlas cita a Faro, conserva los tres documentos por su contexto, pero cuenta una sola observación de origen para el juicio. Si los registros internos muestran que un equipo propio contactó el endpoint durante la ventana indicada, corroboran ese contacto, no toda la atribución del informe. Una cadena circular sin evidencia original accesible debe figurar como limitación. Para un piloto, mide valor incremental después de deduplicar y preserva las horas originales.'),
      check('Práctica · Dos feeds y un blog citan el mismo informe sin nuevos datos. ¿Qué mejora la confianza?', [
        'Contarlos como tres sensores', 'Buscar evidencia de origen independiente que corrobore la afirmación concreta',
        'Eliminar las citas para que no se vea el eco', 'Usar la marca más conocida como prueba definitiva',
      ], 1, 'La independencia procede del método y origen, no del número de publicaciones. Ocultar citas destruye trazabilidad; la reputación orienta la fiabilidad, pero no confirma cada afirmación.'),
      links('Aplicarlo a compra y reporting', [
        { label: 's3m1 · Valor incremental y piloto de feeds', href: '/learn/s3m1' },
        { label: 's3m4 · Reporting de proveedores', href: '/learn/s3m4' },
      ]),
    ],
  },
  s4m4: {
    minutes: 18,
    objectives: ['Complementario: comparar infostealers por unidades, ventana, deduplicación y relevancia organizativa sin rankings permanentes'],
    blocks: [
      complement('Ecosistema y métricas de infostealers'),
      p('Esta ampliación de **Análisis y Producción** conecta el clustering con una decisión práctica: qué exposición investigar primero. Una **familia de malware** agrupa código o capacidades según criterios analíticos; un **operador** usa el malware; un **distribuidor** lo entrega a objetivos, quizá como servicio; una **campaña** agrupa actividad con alcance y periodo; un **broker de acceso** comercializa accesos obtenidos. Un operador puede usar varias familias, y una familia puede ser usada por muchos operadores. Un registro de datos robados no identifica automáticamente a quien los obtuvo ni a quien los vende.'),
      table(['Unidad', 'Qué cuenta', 'Por qué cambia el resultado'], [
        ['Muestras', 'Archivos únicos por un criterio, normalmente hash', 'Reempaquetados pueden multiplicar archivos sin aumentar dispositivos afectados.'],
        ['Infecciones', 'Episodios de compromiso/ejecución según una definición', 'Un mismo dispositivo puede sufrir varios episodios; una detección no siempre prueba infección exitosa.'],
        ['Dispositivos', 'Equipos únicos bajo un método de identificación', 'Identificadores inestables o compartidos pueden dividir o unir equipos erróneamente.'],
        ['Registros robados', 'Entradas o paquetes de datos según el proveedor', 'Un equipo produce muchos registros; pueden republicarse o revenderse. No son automáticamente credenciales válidas.'],
        ['Víctimas', 'Personas u organizaciones afectadas según la definición', 'Una organización puede tener muchos dispositivos; varias cuentas pueden corresponder a la misma persona. Declarar cuál se cuenta.'],
      ]),
      h('Dataset ficticio · la clasificación cambia con el denominador'),
      p('Ventana inventada: 1–30 de septiembre de 2026, UTC. Proveedor Demo-P ve endpoints de dos regiones y anuncios seleccionados; no tiene cobertura global. Las familias Bruma, Cobalto y Duna son ficticias. Se deduplican muestras por SHA-256, episodios por equipo y día, dispositivos por identificador estable y organizaciones por identidad validada. Registros se deduplican por dispositivo, artefacto y fecha de obtención; una reventa no suma otra infección. El cruce entre unidades se limita a los datos disponibles.'),
      table(['Familia ficticia', 'Muestras', 'Episodios', 'Dispositivos', 'Registros únicos', 'Organizaciones', 'Dispositivos del sector objetivo'], [
        ['Bruma', '1200', '130', '100', '8000', '40', '4'],
        ['Cobalto', '300', '540', '450', '3000', '60', '90'],
        ['Duna', '80', '260', '220', '12000', '100', '22'],
      ]),
      p('Antes de resolverlo, míralo contado: por qué la tabla tiene tres ganadores y qué columnas ayudan a decidir qué investigar primero.'),
      video('Medir infostealers y decidir relevancia', 'DBcK-Y0WItM', 'stealers-metricas'),
      p('**Paso 1: elegir la unidad.** Por muestras gana Bruma; por dispositivos y episodios gana Cobalto; por registros y organizaciones gana Duna. Ninguna columna se puede sustituir por otra. Calcular 8000/100 para Bruma da 80 registros por dispositivo observado; no 8000 equipos infectados. Las organizaciones pueden aparecer en varias familias: no sumes columnas como si fueran poblaciones disjuntas.'),
      table(['Familia', 'Capacidades observadas en este caso', 'Actividad reciente dentro de la ventana', 'Pregunta que falta resolver'], [
        ['Bruma', 'Robo de contraseñas descrito en fixtures del caso', '10 dispositivos observados en la última semana', '¿Está la exposición concentrada fuera del sector de Meridian?'],
        ['Cobalto', 'Contraseñas y material de sesión, según fichas técnicas ficticias', '180 dispositivos en la última semana', '¿Las aplicaciones afectadas coinciden con las usadas por Meridian?'],
        ['Duna', 'Archivos y registros de navegador; muchos registros por equipo', '20 dispositivos en la última semana; parte de los anuncios son reventas antiguas', '¿Cuál es la fecha de obtención, además de la fecha de venta?'],
      ]),
      p('**Paso 2: pasar de prevalencia observada a relevancia.** Meridian prioriza investigar exposición de sesión en su sector. Cobalto combina más dispositivos del sector objetivo, actividad reciente y capacidades pertinentes: merece la primera revisión. Esto no prueba que Meridian esté comprometida. Si el requisito fuera recuperación de archivos filtrados, Duna podría merecer otra prioridad. Cambiar el requisito, las aplicaciones usadas o la cobertura del proveedor puede cambiar la decisión.'),
      p('**Paso 3: auditar sesgos.** Demo-P puede contar más Bruma porque recibe muchos reempaquetados, observar más Cobalto porque su base de clientes incluye ese sector y obtener más registros de Duna por reventas. Compara periodos y métodos equivalentes. «Primero visto», «obtenido», «publicado» y «vendido» son fechas distintas. Si cambian sensores o etiquetas entre meses, una subida no demuestra crecimiento del ecosistema. Expresa incertidumbre y revisa los datos antes de comparar proveedores.'),
      code('Conclusión modelo · limitada a la ventana y fuente ficticias', 'En Demo-P, septiembre de 2026, Bruma lidera por hashes únicos,\nCobalto por dispositivos observados y Duna por registros/organizaciones.\nPara exposición de sesión en el sector de Meridian, priorizamos Cobalto\ncon confianza moderada por capacidad, recencia y coincidencia sectorial.\nLímites: dos regiones, sesgo de clientes, identificadores y ventas repetidas.\nNo estimamos cuota global ni atribuimos operadores por la familia.\nSiguiente paso: contrastar exposición interna y una fuente independiente.'),
      check('Práctica · Dirección pide «el stealer número uno». ¿Qué haces primero?', [
        'Elegir Bruma porque tiene más muestras', 'Elegir Duna y llamar infecciones a todos los registros',
        'Acordar requisito, unidad, ventana, cobertura y deduplicación antes de ordenar', 'Usar el ranking de septiembre de forma permanente',
      ], 2, 'Una clasificación necesita definición y alcance. Muestras y registros no equivalen a infecciones; septiembre no representa todo el futuro. La prioridad depende de la exposición de la organización.'),
      check('Práctica · ¿Qué evidencia apoya priorizar Cobalto para Meridian?', [
        'Mayor cantidad de hashes únicos', 'Exposición sectorial, actividad reciente y capacidades de sesión pertinentes, con límites de cobertura',
        'Certeza de que todos sus operadores son el mismo actor', 'Que ya se ha demostrado compromiso de Meridian',
      ], 1, 'Las tres señales responden al requisito, aunque aún requieran corroboración. Bruma lidera en hashes; una familia admite múltiples operadores y datos sectoriales no prueban un incidente propio.'),
      links('Conectar unidades, fuentes y valor del equipo', [
        { label: 'sp2m6 · Infostealers: artefactos y conclusiones defensivas', href: '/learn/sp2m6' },
        { label: 's3m1 · Cobertura, sesgo y evaluación de feeds', href: '/learn/s3m1' },
        { label: 's5m5 · Métricas del equipo CTI: utilidad y decisiones', href: '/learn/s5m5' },
      ]),
      p('Estas son **métricas del fenómeno observado**, no métricas de rendimiento del equipo CTI. En s5m5 se evalúan utilidad, decisiones y resultados del equipo; contar infecciones o muestras de un proveedor no mide por sí solo el valor de tu análisis. No se usan familias reales ni se publica un ranking que pretenda seguir siendo actual.'),
    ],
  },
  s5m3: {
    minutes: 8,
    objectives: ['Complementario: distribuir YARA con objetivo, versión, pruebas reproducibles, acciones y límites'],
    blocks: [
      complement('Diseminar una regla YARA verificable'),
      p('Una regla sin contexto traslada al receptor un riesgo que no puede evaluar. Entrega el objetivo y la evidencia junto a la sintaxis. Identifica si sirve para una muestra, una familia dentro de cobertura o hunting amplio. El nombre de la regla y su meta no prueban eficacia. El receptor debe saber qué hacer con una coincidencia y cuándo revisar o retirar la regla.'),
      table(['Elemento de entrega', 'Ejemplo del laboratorio sintético'], [
        ['Objetivo y procedencia', 'Fixtures ALRTDEMO v1 de s3m5, datos inventados; no acredita malware real.'],
        ['Versión y reproducibilidad', 'reference.yar v1.0, fecha, hash del archivo y corpus; versión de motor y comando python verify.py.'],
        ['Resultados y partición', 'A/B entrenamiento; C validación. Family debe coincidir con A/B/C y rechazar los controles v1; documentar cada archivo.'],
        ['Errores y límites', 'Manual, ruta sola y hex solo son controles; v2 es límite conocido. Sintaxis válida no sustituye evaluación.'],
        ['Acción operativa', 'Triaje de coincidencias; revisar contexto. Hunting no implica bloqueo ni atribución automática.'],
        ['Distribución y mantenimiento', 'Audiencia y permisos de uso, clasificación de información, responsable, fecha de revisión y canal para reportar errores.'],
      ]),
      code('Nota de entrega · solución ficticia', 'Producto: Alertopolis_Demo_Family v1.0 · alcance: fixtures inertes v1\nMotor: registrar la versión devuelta por el verificador\nReproducción: python verify.py\nEsperado: Family=A/B/C; Sample=A; Hunt=A/B/C + controles de un rasgo\nNo cubre v2 ni archivos >=4096 bytes. No estima sensibilidad real.\nAcción: práctica y triaje; no bloqueo automático ni atribución.\nAdjuntar regla, corpus, hashes, matriz por archivo y limitaciones.\nResponsable: equipo didáctico ficticio; revisar ante nuevos fixtures.'),
      p('**Caso resuelto.** Un receptor ve «12/12» y propone desplegar la regla a toda la flota. Paso 1: aclarar que mide conformidad con 12 expectativas, incluidas no coincidencias y un caso fuera del alcance v1. Paso 2: revisar falsos negativos respecto al objetivo real y controles benignos representativos. Paso 3: validar en entorno autorizado y definir respuesta y mantenimiento. No declarar una regla de producción a partir de este ejercicio. Para compartir fuentes de terceros, comprobar además derechos y procedencia.'),
      check('Práctica · ¿Qué entrega permite al receptor evaluar una regla?', [
        'Solo el nombre de familia y «funciona»', 'El porcentaje sin denominador ni corpus',
        'Regla versionada, objetivo, motor, corpus/matriz reproducibles, límites y acción prevista', 'Solo un pantallazo de YARA Forge',
      ], 2, 'El receptor necesita reproducir y entender cobertura y riesgo. Nombre, porcentaje y captura aislados no aportan ese contrato. Forge demuestra decisiones en una simulación, no compilación real.'),
      links('Reproducir la práctica', [
        { label: 's3m5 · Editor, corpus y solución YARA', href: '/learn/s3m5' },
        { label: 'YARA · Motor Python oficial', href: 'https://yara.readthedocs.io/en/stable/yarapython.html' },
      ]),
    ],
  },
  s5m5: {
    minutes: 2,
    objectives: ['Complementario: separar métricas del ecosistema de amenazas de las del valor del equipo CTI'],
    blocks: [
      complement('Dos preguntas de medición diferentes'),
      p('Los dispositivos, muestras y registros de s4m4 describen el ecosistema observado por una fuente. Aquí medimos qué valor aporta el equipo CTI a sus consumidores y decisiones. Más infecciones publicadas no significa más valor del equipo; menos muestras recibidas tampoco prueba que el programa haya reducido el riesgo. Conecta productos con requisitos, decisiones y resultados, explicando otros factores que puedan haber influido.'),
      links('Comparar unidades del fenómeno', [{ label: 's4m4 · Dataset de infostealers y rankings por métrica', href: '/learn/s4m4' }]),
    ],
  },
};
