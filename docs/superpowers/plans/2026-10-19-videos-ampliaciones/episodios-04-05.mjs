export const EPISODES_04_05 = [
  {
    id: 'AP04', slug: 'muestra-candidatos', track: 'gcti', lessons: ['s3m2', 's3m3'],
    sfx: { 'fx-ping-1': 'ping2', 'fx-typing-1': 'typing', 'fx-ping-2': 'ping2', 'fx-check': 'check', 'fx-typing-2': 'typing' },
    title: 'Del hash a los candidatos: pivotar sin inventar parentescos',
    promise: 'Construir y documentar una relación defendible entre muestras, sin convertir una coincidencia en atribución.',
    adversary: 'HOLLOW LANTERN',
    concepts: ['Identidad exacta y similitud', 'Observaciones e hipótesis', 'Pivotes de archivo e infraestructura', 'Corroboración e independencia', 'Conclusión, confianza y límites'],
    analogy: 'Una pista abre una línea de investigación; no es una sentencia sobre quién la dejó.',
    chapters: ['Una muestra, varias preguntas', 'Buscar parecidos', 'Leer las relaciones', 'Decidir con alternativas', 'Dejar el razonamiento'],
    sources: ['VirusTotal: búsqueda por hash', 'VirusTotal: modificadores', 'VirusTotal: similitud', 'VirusTotal: relaciones', 'Curso: s3m2, candidatos B/C/D/E', 'Curso: s3m3, contexto temporal'],
    omitted: 'Detonación, descargas, uso de API o cuentas premium; métodos internos de cálculo de hashes difusos; ingeniería inversa; familia o actor reales.',
    scenes: [
      {
        title: 'El parecido no termina el caso', visual: 'Mesa didáctica de Meridian. Fichas A/B/C/D/E, distintas de las muestras históricas de GLASS VIPER. Sin hashes ni fechas del canon publicado. Flujo completo muestra/observaciones/hipótesis/pivotes/candidatos/corroboración/conclusión. Título y promesa tempranos.',
        text: [
          'Dos archivos se {fx-ping-1}parecen. ¿Son de la misma familia? Vas a seguir una muestra hasta una conclusión que puedas defender, sin saltarte las dudas.',
          'Trabajas con fichas inventadas en un ejercicio de Meridian, una empresa aeroespacial. No vas a descargar ni ejecutar malware. La muestra inicial se llama A. Lo que tenemos de ella son observaciones que pueden abrir otras búsquedas.',
          'Buscar a partir de una observación es pivotar. Pero lo que recuperas son candidatos. Después necesitas contrastarlos. El recorrido no termina cuando el buscador devuelve una lista. Termina cuando puedes explicar qué relación sostienes, con qué confianza y qué falta por comprobar.',
        ],
      },
      {
        title: 'Los mismos bytes o rasgos parecidos', visual: 'Hash criptográfico exacto frente a imphash y ssdeep. Animar cambio de un byte → hash distinto, sin deducir familia distinta. «Imphash = imports normalizados»; biblioteca compartida genera coincidencia débil.',
        card: 'Hash exacto identifica bytes; similitud genera candidatos',
        text: [
          'Puedes calcular una huella del contenido de un archivo. Se llama hash criptográfico y ayuda a reconocer los mismos bytes. Cambiar el contenido puede cambiar completamente esa huella. Otro hash no significa automáticamente otra familia.',
          'Algunos ejecutables toman funciones de otras bibliotecas. El imphash resume esas importaciones y ayuda a encontrar archivos que las comparten. No demuestra que se usara el mismo compilador. Programas no relacionados también pueden coincidir en ellas.',
          'Otros métodos buscan parecidos en lugar de una huella exacta. Lo llamamos hashing difuso. Ssdeep es uno de esos métodos. Prioriza semejanzas, sin asignar una probabilidad de parentesco. Una biblioteca común puede explicar parte del parecido. Necesitas contexto para concluir.',
        ],
      },
      {
        title: 'La etiqueta y la firma', visual: 'PDB explicado como Program Database/ruta de símbolos. Firma de código con huella/validación/contexto, separada de TLS. Strings/config distintivas. Compartir un rasgo no cambia automáticamente estado de candidato a familia.',
        intercept: 'Mismo PDB. Ya sabes quién lo escribió.',
        text: [
          'No sabes quién lo escribió solo por esa ruta. Un PDB es un archivo de símbolos de depuración. Algunos binarios conservan una ruta que puede dar pistas sobre el proyecto. Esa ruta también puede copiarse o falsearse.',
          'Las cadenas distintivas y la configuración aportan otras pistas. Una estructura poco común puede ser más útil que una palabra genérica. Aun así, considera código reutilizado y señuelos. Pregunta si el rasgo distingue de verdad las explicaciones que estás comparando.',
          'Con las firmas de código ocurre algo parecido. Comprueba el certificado y la validez de la firma. El material puede ser robado o compartido entre productos. Una firma no demuestra benignidad. Un mismo certificado tampoco demuestra por sí solo una familia, campaña o actor.',
        ],
      },
      {
        title: 'Qué significa ese noventa y cuatro', visual: 'C comparte imphash I1 y score ssdeep94. Mostrar biblioteca común, configuración distinta. Dos opciones antes de pausa; después mantener C en candidato débil, sin clasificar como benigno.',
        think: { q: '¿Confirmas C o buscas qué lo distingue?', choices: ['Confirmar misma familia', 'Buscar evidencia que discrimine'], answer: 1 },
        card: 'Dos señales dependientes no son dos corroboraciones',
        text: [
          'El candidato C comparte imports y tiene una puntuación alta de similitud. La ficha explica que ambos rasgos vienen de una biblioteca común. ¿Confirmas la familia o buscas evidencia que distinga esa explicación de un parentesco real?',
          'Buscas evidencia que las distinga. La cifra no dice que exista un noventa y cuatro por ciento de probabilidad de pertenecer a la familia. Y si dos señales salen del mismo componente, no tienes dos corroboraciones independientes.',
          'C queda como una coincidencia débil. No lo incorporas al conjunto por ahora. Tampoco lo declaras benigno. Has aprendido algo más limitado. Ese parecido concreto tiene una explicación alternativa que todavía no has descartado.',
        ],
      },
      {
        title: 'La consulta conserva su pregunta', visual: 'Consultas ilustrativas oficiales de VT en pantalla: imphash:11111111111111111111111111111111; content:"cicada-demo-v1"; metadata:"ldr.pdb"; signature:"Meridian Demo Signing". Valores ficticios, sin ejecución. Buscar hash exacto no sube archivo. Mostrar disponibilidad dependiente de producto/permisos.',
        text: [
          'En VirusTotal puedes partir del hash de un informe existente. Eso es distinto de subir el archivo. Las búsquedas avanzadas permiten usar imports, contenido o metadatos como claves. Aquí ves {fx-typing-1}consultas ilustrativas. Los valores son inventados y no las ejecutamos.',
          'Cada consulta debe responder una pregunta. Buscar una cadena concreta puede recuperar candidatos que la contienen. Buscar metadatos puede encontrar una ruta de depuración, pero también otros campos. Abre el resultado y comprueba qué coincidió antes de sacar conclusiones.',
          'El acceso a contenido, relaciones y búsquedas depende del producto, los permisos y los datos disponibles. Si no tienes esas funciones, usa las fichas del ejercicio o informes públicos con procedencia. No necesitas pagar para practicar el razonamiento ni subir datos sensibles para completar la lección.',
        ],
      },
      {
        title: 'Una línea no cuenta cómo ocurrió', visual: 'Relaciones: dominio incrustado / contacto observado / archivo soltado / padre de ejecución. Conservar dirección, tiempo y fuente. D comparte IP de alojamiento; resolver ventana temporal y multiinquilino. TLS de servidor separado del certificado de código.',
        card: 'Comprueba función, dirección y tiempo de la relación',
        text: [
          'Las relaciones también tienen significado. Una dirección escrita dentro de un archivo no prueba que se contactara. Un contacto observado no demuestra que ese servidor lo controle el atacante. Puede ser un servicio compartido o una comprobación legítima.',
          'D comparte una dirección de alojamiento con {fx-ping-2}A durante un intervalo amplio. El servidor tiene varios clientes. Esa coincidencia no basta para unirlos. Antes revisas cuándo resolvió cada dominio, qué servicio era y qué evidencia vincula realmente las actividades.',
          'Distingue también los certificados del servidor de los certificados de firma de código. Vinculan objetos diferentes. Mantén la dirección y la fuente de cada relación. Si dibujas todas las líneas iguales, el grafo parece más concluyente de lo que es.',
        ],
      },
      {
        title: 'El candidato que sí gana peso', visual: 'B: I1, cadena DEMO-CFG-7, configuración y conducta concordantes, dos orígenes de informes distintos. Hipótesis código compartido frente a componente público. Confianza moderada, no atribución a operador.',
        intercept: 'Si encaja en tu grafo, mételo ya en la campaña.',
        text: [
          'Encajar en el dibujo no basta. B comparte una cadena distintiva y la estructura de configuración. Además presenta una secuencia de carga y un comportamiento concordantes. Dos informes de origen distinto aportan observaciones que puedes contrastar.',
          'B sostiene mejor la hipótesis de código relacionado. Aun así, revisa si las fuentes son independientes y si un componente reutilizado explicaría las coincidencias. Puedes mantenerlo como {fx-check}relacionado probable con confianza moderada, dentro de ese alcance.',
          'No has demostrado que pertenezca a la misma campaña ni que lo use el mismo operador. Código, actividad y autoría son niveles diferentes. Tu conclusión debe nombrar el nivel que la evidencia permite, en lugar de subir todos los escalones de una vez.',
        ],
      },
      {
        title: 'La casilla vacía', visual: 'E solo tiene una mención de PDB sin bytes ni procedencia. Campo de relación «no disponible», distinto de «sin relaciones». Pregunta y luego pista pendiente/confianza baja. No intentar eludir acceso premium.',
        think: { q: '¿Sin relaciones o dato no disponible?', choices: ['No tiene relaciones', 'No hay dato accesible'], answer: 1 },
        card: 'No disponible no equivale a inexistente',
        text: [
          'Para E, alguien menciona la misma ruta de depuración, pero no aporta bytes ni procedencia del dato. No tienes acceso a un informe que permita contrastarlo. ¿Escribes que no tiene relaciones o que el dato no está disponible?',
          'Que no está disponible. Eso describe tu limitación de colección. No demuestra ausencia de relaciones, benignidad ni pertenencia al conjunto. Conservas E como una pista pendiente, con confianza baja, y pides la evidencia que falta.',
          'Una búsqueda sin resultados merece el mismo cuidado. Puede depender de la cobertura, los filtros o la falta de datos. No rellenes un hueco inventando un resultado. Registrar una limitación también es avanzar, porque deja claro qué necesitas para decidir.',
        ],
      },
      {
        title: 'Que otra persona pueda seguirte', visual: 'Bitácora consulta/filtros/fecha consulta/fecha observación/fuente/evidencia/juicio/confianza/alternativa/próxima acción. Ejemplo sin nuevos timestamps del canon. Resultado B probable; C y D no incorporados; E pendiente.',
        card: 'Registra consulta, evidencia, alternativas y confianza',
        text: [
          'Deja una bitácora que otra analista pueda seguir. Qué {fx-typing-2}consultaste, con qué filtros y cuándo. Qué fecha corresponde a la observación. Qué evidencia conservaste y cuál es su origen. Incluye las búsquedas fallidas y las funciones que no estaban disponibles.',
          'La conclusión del caso mantiene B como relacionado probable por código. C y D no se incorporan con la evidencia actual. E sigue pendiente. Esa decisión no mezcla un candidato débil con uno descartado para siempre.',
          'Escribe también qué cambiaría tu juicio. Validar más variantes, contrastar configuración o conseguir una observación independiente. La confianza no es una decoración del informe. Resume cuánto sostienen los datos y qué tan abiertas siguen las alternativas.',
        ],
      },
      {
        title: 'La investigación que puedes explicar', visual: 'Tres reglas: candidato no atribución / corroborar con alternativas / documentar límites. Acción única: resolver B/C/D/E en s3m2. Aviso no afiliado SANS/GIAC. No desvelar el Lab3A ni usar sus respuestas.',
        text: [
          'Tres reglas. El hash exacto identifica bytes y los pivotes generan candidatos. Las coincidencias necesitan contexto e independencia. Y tu conclusión debe conservar las dudas que los datos todavía no resuelven.',
          'No has perdido rigor por decir que algo falta. Lo pierdes si conviertes una puntuación, una ruta o una dirección compartida en una familia confirmada. El objetivo no es llenar el grafo. Es sostener una relación que resista las alternativas.',
          'Abre ahora el caso de candidatos de la lección de malware como colección. Decide qué harías con cada ficha y escribe el motivo. Si tu conclusión llega hasta un actor, revisa qué evidencia te permitió llegar tan lejos. Una línea en el grafo no lo decide por ti.',
        ],
      },
    ],
  },
  {
    id: 'AP05', slug: 'yara-condicion', track: 'gcti', lessons: ['s3m5'],
    sfx: { 'fx-check-1': 'check', 'fx-typing-1': 'typing', 'fx-block': 'block', 'fx-ping': 'ping2', 'fx-check-2': 'check', 'fx-typing-2': 'typing' },
    title: 'Escribir YARA: qué debe coincidir y qué puede cambiar',
    promise: 'Escribir una condición de detección y justificar sus patrones con un corpus inerte.',
    adversary: 'HOLLOW LANTERN',
    concepts: ['Hipótesis y alcance de una regla', 'Meta, strings y condition', 'ASCII, wide y nocase', 'Hex, comodines y agrupaciones', 'Restricciones y validación de la hipótesis'],
    analogy: 'Una descripción con rasgos necesarios y alternativas; los rasgos se contrastan, no se votan por cantidad.',
    chapters: ['Antes del código', 'Patrones que se pueden justificar', 'Combinar las evidencias', 'Los bordes del objetivo', 'Escribir y comprobar'],
    sources: ['YARA: sintaxis', 'YARA: módulo PE', 'Curso: corpus ALRTDEMO y reference.yar'],
    omitted: 'Regex avanzadas, módulos adicionales, escaneo de procesos, detección de malware real y la solución del Lab3B. Las pruebas completas y la entrega van a AP06.',
    scenes: [
      {
        title: 'Una regla con una promesa concreta', visual: 'Mesa de Meridian con editor YARA y corpus ALRTDEMO. Sello «Corpus sintético e inerte · no es malware». A/B/C como archivos de práctica, distintos de los candidatos de AP04. Título y promesa antes de 12 s.',
        text: [
          'Vas a escribir una regla YARA y explicar por qué exige esas coincidencias. Empezamos con archivos {fx-check-1}inertes, sin malware ni cuentas reales.',
          'El ejercicio acompaña a Meridian, una empresa aeroespacial. Aquí una regla expresa una hipótesis sobre el contenido de un archivo. No decide por sí sola si algo es malicioso. Detecta los patrones y condiciones que tú hayas definido.',
          'Trabajamos con un conjunto de archivos de prueba. Lo llamamos corpus. Queremos reconocer tres variantes de un formato de demostración y rechazar controles parecidos. Los archivos se llaman A, B y C en la explicación. Sus nombres no forman parte de la condición.',
        ],
      },
      {
        title: 'Tres partes con trabajos distintos', visual: 'Referencia real del laboratorio sin otras reglas todavía. Resaltar meta/strings/condition por turnos. No mostrar condiciones resueltas del lab guiado. Autoría, versión, fecha y alcance en meta, no como factores de match.',
        card: 'Meta documenta; strings define; condition decide',
        text: [
          'La regla tiene tres partes habituales. El contexto se escribe en meta. Documenta autoría, versión y alcance. No hace que el archivo coincida. Poner el nombre de una familia ahí no demuestra que la detectes.',
          'Los patrones se {fx-typing-1}declaran en strings. Cada uno recibe un identificador para poder usarlo después. Pueden ser cadenas textuales o secuencias de bytes, entre otras formas. Elegirlos necesita evidencia sobre lo que quieres reconocer.',
          'La decisión se expresa en condition. Ahí combinas los patrones y los límites que correspondan. Esa combinación es la promesa de la regla. Si dices que cubre variantes, deberás comprobar variantes. Que el texto parezca razonable todavía no lo demuestra.',
        ],
      },
      {
        title: 'Dos palabras corrientes no hacen una familia', visual: 'Control benign-common con Mozilla/5.0 y kernel32.dll. Condición ingenua «2 of them» coincide con ambas cadenas comunes. No marcar corpus como malware real. Contrastar con patrón distintivo y estructura.',
        intercept: 'Pon dos cadenas. Dos siempre es mejor que una.',
        text: [
          'Dos cadenas corrientes pueden aparecer juntas en mucho software legítimo. La cantidad no sustituye la elección. Primero necesitas explicar qué aporta cada patrón y qué controles podrían contenerlo sin pertenecer a tu objetivo.',
          'En nuestro corpus hay un archivo con dos nombres comunes. No queremos que {fx-block}coincida. Si solo cuentas cuántas cadenas aparecen, puedes detectar ese control. El problema no se arregla eligiendo un número por costumbre.',
          'Una regla estrecha para una muestra puede usar un rasgo muy específico. Una que busca variantes necesita justificar qué se conserva y qué puede cambiar. El objetivo y la evidencia mandan. Ningún umbral convierte por sí solo cadenas débiles en una identificación fiable.',
        ],
      },
      {
        title: 'El mismo texto, otros bytes', visual: 'A texto de un byte; B cadena CICADA-DEMO-V1 en UTF-16LE con 00 intercalados y ruta wide. Mostrar ascii wide nocase en código. Dos opciones para la pausa. Tras resolver, advertir que wide no implementa Unicode general.',
        think: { q: '¿B queda fuera o debes cubrir otra forma?', choices: ['Ignorar su representación', 'Contemplar la variación prevista'], answer: 1 },
        card: 'ASCII, wide y nocase amplían formas concretas',
        text: [
          'A conserva el marcador en texto sencillo. B lo lleva en mayúsculas y con bytes nulos intercalados. Sigue dentro del objetivo. ¿Lo dejarías fuera o necesitas expresar esa variación en el patrón?',
          'Necesitas contemplarla. Una cadena textual busca sus bytes y distingue mayúsculas por defecto. El modificador ascii busca la representación sencilla. Wide busca los caracteres con un byte nulo intercalado. Usar ambos contempla las dos formas de este ejemplo.',
          'Nocase permite ignorar las diferencias de mayúsculas y minúsculas del patrón. Aquí ayuda con B. Pero cada ampliación puede incluir más coincidencias. Y wide no interpreta todo Unicode. Estás cubriendo una representación concreta, no cualquier manera posible de escribir el texto.',
        ],
      },
      {
        title: 'El byte que cambia', visual: 'Comparar hex de A:41 4C 52 54 22 7F y C:41 4C 52 54 99 7F. Highlight solo el quinto byte. Patrón final41 4C 52 54 ?? 7F. Mostrar A? como nota de medio byte, sin ampliar a firmas reales.',
        text: [
          'Ahora compara la secuencia de bytes de A y C. Hay una posición que cambia. Una cadena hexadecimal permite describir bytes concretos y dejar una variación donde la evidencia la justifica. Fíjate en la posición que cambia en pantalla.',
          'En el patrón de pantalla, el {fx-ping}comodín de dos interrogaciones acepta cualquier valor para ese byte. El resto permanece fijo. También existen comodines para medio byte. Pero poner más comodines no es mejorar automáticamente la regla. Es permitir más contenido.',
          'En este ejercicio sabemos por qué dejamos variar esa posición. Con datos reales necesitarías una razón equivalente. Si el patrón queda demasiado amplio, controles ajenos pueden compartirlo. La condición tendrá que combinarlo con otras evidencias del objetivo.',
        ],
      },
      {
        title: 'La ruta cambia, el marcador permanece', visual: 'A/B marcador+ruta; C marcador+hex con ruta cambiada. Construir $family and ($route or $hex). Comparar brevemente ($family and $route) or $hex con control benign-hex. Identificadores y operadores se leen visualmente, sin narrar código carácter a carácter.',
        card: 'Exige el marcador y una alternativa justificada',
        text: [
          'Las tres variantes conservan el marcador. Dos tienen la misma ruta de demostración. C cambia esa ruta, pero conserva la secuencia de bytes con la variación que acabas de contemplar. Eso sugiere una condición con una parte necesaria y dos alternativas.',
          'Exiges el marcador y, {fx-check-2}además, la ruta o el patrón de bytes. Los paréntesis agrupan las alternativas. Si los colocas de otra manera, podrías permitir que los bytes solos bastaran. Y tenemos un control que contiene solo esos bytes.',
          'Esta es la hipótesis, dicha antes del código. Un marcador junto a una evidencia alternativa. No todas las cadenas a la vez, porque perderías C. Tampoco cualquiera de ellas, porque aceptarías controles. La combinación se justifica por el objetivo y los ejemplos.',
        ],
      },
      {
        title: 'El manual que copia los patrones', visual: 'benign-manual contiene todos los patrones pero ALRTDEMO no está en offset0. Cabecera inventada al inicio + filesize<4KB. Aviso no es PE, no ejecutable; MZ por sí solo no valida PE. Módulo pe.is_pe queda como nota visual con fuente.',
        intercept: 'Si contiene todas tus cadenas, ya está demostrado.',
        text: [
          'El manual del ejercicio copia todas las cadenas y sigue fuera del objetivo. Necesitamos mirar también dónde están y qué estamos describiendo. En este formato inventado, la cabecera debe estar al principio. En el manual no lo está.',
          'Añadimos ese requisito y un tamaño menor de cuatro kilobytes, porque forman parte del contrato del ejercicio. Ninguno demuestra malicia. Solo acotan el contenido que buscamos. Una restricción útil para este objetivo puede excluir algo relevante para otro.',
          'Esto no es una validación de ejecutables reales. La cabecera es inventada y los datos son inertes. Si el objetivo fueran ejecutables, justificarías una comprobación del formato. Ver solo las letras iniciales de un supuesto ejecutable no basta para validar toda su estructura.',
        ],
      },
      {
        title: 'Lo que dejas fuera también es una decisión', visual: 'Archivo de4096bytes y archivo mayor fuera de filesize<4KB. Pregunta dos opciones. Después diferenciar límite declarado de FN si objetivo ampliado. No ocultar future-uncovered v2.',
        think: { q: '¿Qué pasa con cuatro mil noventa y seis bytes?', choices: ['Cumple el límite estricto', 'Queda fuera del límite'], answer: 1 },
        card: 'Un límite también puede excluir variantes deseadas',
        text: [
          'La condición pide un tamaño menor de cuatro kilobytes. El siguiente archivo mide exactamente cuatro mil noventa y seis bytes. ¿Cumple ese límite estricto o queda fuera? La palabra menor también forma parte de la regla.',
          'Queda fuera. En este corpus es lo esperado por el alcance declarado. Pero si mañana te piden cubrir variantes más grandes, habrás encontrado una limitación que puede producir falsos negativos. No puedes mantener la misma promesa sin volver a comprobarla.',
          'Lo mismo ocurre si cambia el marcador. La regla no adivina que una versión nueva conserva la intención del programa. Solo evalúa las condiciones escritas. Necesitas revisar evidencia, objetivo y pruebas antes de ampliar lo que afirmas que detecta.',
        ],
      },
      {
        title: 'Escribir no es ejecutar', visual: 'Editor del curso con aviso no compila/ejecuta. ZIP inerte y regla descargada. Tres etapas escribir / compilar / ejecutar, con la última futura y no falsos resultados terminales. Forge rotulado simulación por etiquetas.',
        card: 'Escribir, compilar y ejecutar son comprobaciones distintas',
        text: [
          'Ahora puedes {fx-typing-2}escribir la regla en el editor de la lección. El navegador permite preparar y descargar texto. No lo compila ni lo ejecuta. YARA Forge es otra actividad. Simula resultados mediante etiquetas preparadas para su pequeño ejercicio.',
          'Para comprobar sintaxis y coincidencias necesitas un motor real. El paquete de la práctica incluye datos inertes, instrucciones y un verificador. Compilar comprueba la sintaxis para ese motor. Ejecutar aplica la regla a los archivos. Son comprobaciones distintas.',
          'Aunque compile, todavía puede fallar en lo que quieres detectar. Puede coincidir con controles o perder variantes. La validación exige resultados por archivo y una explicación de esos errores. Es lo que haremos al contrastar la regla completa.',
        ],
      },
      {
        title: 'Tu hipótesis, escrita', visual: 'Tres reglas: alcance antes del código / combinar con razones / medir límites. Acción única: escribir MiRegla sin copiar todavía la solución. No incluir resultado de ejecución nuevo; aviso de complementario y no afiliación.',
        text: [
          'Tres reglas antes de escribir. Define qué entra en el objetivo. Justifica los patrones y su combinación. Y trata cada restricción como una decisión de cobertura que tendrás que comprobar. No como una garantía automática de calidad.',
          'En este caso, la condición exige un marcador y una evidencia alternativa, dentro de un formato y un tamaño pactados. Eso explica por qué algunas cadenas son necesarias y otras pueden variar. La explicación tiene que sobrevivir a la lectura del código.',
          'Abre ahora el editor de la lección y escribe tu versión antes de desplegar la solución. Descárgala para conservarla. Si no puedes explicar por qué un control debería quedar fuera, vuelve al objetivo. La condición debe expresar una razón, no una cifra elegida por costumbre.',
        ],
      },
    ],
  },
];
