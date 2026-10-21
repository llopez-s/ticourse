import { check, code, complement, h, links, list, p, table, video, type LessonExpansion } from './shared';

export const COLLECTION_EXPANSIONS: Record<string, LessonExpansion> = {
  s3m1: {
    minutes: 16,
    objectives: ['Complementario: diseñar un piloto de feeds con aceptación y renovación ligadas al requisito y al valor incremental'],
    blocks: [
      complement('Evaluar y contratar fuentes y feeds'),
      p('Un **feed** es un suministro recurrente de datos o información. Comprar uno no compra automáticamente inteligencia. Antes de comparar proveedores, formula la decisión y el **requisito de inteligencia** que debe ayudar a resolver. Meridian plantea R1: «¿Qué indicios de exposición de cuentas del sector aeroespacial debemos investigar en menos de 24 horas?». R2 es distinto: «¿Qué infraestructura de distribución deberíamos buscar retrospectivamente en 90 días?». La mejor combinación de fuentes puede cambiar entre ambos requisitos.'),
      h('Fuente fiable e información creíble son juicios distintos'),
      p('La **fiabilidad de la fuente** describe su historial, acceso y método: ¿ha observado lo que dice observar y suele documentarlo bien? La **credibilidad de una información** se juzga en ese caso: ¿es coherente, directa y corroborada? Un proveedor fiable puede publicar una afirmación débil; una fuente nueva puede aportar evidencia verificable. Separa ambos juicios y justifica cuándo no puedes evaluarlos. No conviertas una marca conocida en garantía para cada indicador.'),
      table(['Criterio', 'Cómo medirlo en el piloto'], [
        ['Cobertura', 'Porción del requisito que la fuente observa: sector, región, plataformas y tipos de artefacto. No confundir con tamaño del catálogo.'],
        ['Puntualidad', 'Retraso entre observación original y entrega utilizable, con mediana y percentil 95; registrar ambos relojes.'],
        ['Precisión', 'Proporción de elementos revisados que resultan pertinentes/correctos según una definición y adjudicación compartidas. Declarar muestra y casos desconocidos.'],
        ['Completitud', 'Porcentaje que incluye los campos necesarios: observación, fecha, procedencia, contexto, vigencia. No mide cuánto del mundo real se ha descubierto.'],
        ['Trazabilidad', 'Posibilidad de llegar a evidencia primaria, metodología y cadena de citas; registrar cuándo una evidencia no se puede compartir.'],
        ['Exclusividad y duplicación', 'Cuántos hallazgos útiles añade respecto a las fuentes ya disponibles, después de deduplicar y considerar anticipación.'],
        ['Sesgo de colección', 'Qué dispositivos, sectores y países ve el proveedor, qué excluye y cómo etiqueta; ausencia de datos no demuestra ausencia de amenaza.'],
        ['Coste total', 'Licencia + integración + mantenimiento + horas de triaje del analista. Considerar cuotas, estabilidad de API, exportación y derechos de retención y uso.'],
      ]),
      h('Tres feeds ficticios · el requisito determina la elección'),
      p('Piloto inventado de 30 días. Mismo catálogo de activos, criterios de adjudicación y reloj UTC. «Revisados» son elementos únicos muestreados; «útiles» responde al requisito indicado; «incrementales» no estaban en la línea base antes del plazo requerido. Los desconocidos se mantienen aparte. Las cifras son didácticas, no una comparación comercial.'),
      table(['Feed', 'R1: cuentas expuestas', 'R2: infraestructura histórica', 'Puntualidad / completitud / trazabilidad', 'Coste mensual + trabajo'], [
        ['Faro', '60 útiles/100 revisados; 40 incrementales; 10 desconocidos', '10 útiles/100; 2 incrementales', 'R1 p95 8 h; 95% con campos; evidencia directa documentada', '900 € + 6 h de triaje; integración inicial 8 h'],
        ['Atlas', '90 útiles/100; solo 3 incrementales; 0 desconocidos', '70 útiles/100; 45 incrementales', 'R1 p95 36 h; 99% con campos; historial y fuentes enlazadas', '600 € + 4 h; integración inicial 4 h'],
        ['Eco', '80 útiles/100; 1 incremental; 5 desconocidos', '50 útiles/100; 1 incremental', 'R1 p95 12 h; 70% con campos; suele citar a Faro/Atlas', '200 € + 18 h; integración inicial 2 h'],
      ]),
      p('Antes de la resolución, míralo contado: tres proveedores, dos requisitos y por qué el que entrega más no siempre es el que más aporta.'),
      video('Evaluar feeds por requisito y valor nuevo', 'vRin6Wc8kcw', 'feeds-requisito'),
      p('**Resolución paso a paso.** Para R1, Faro añade 40 hallazgos dentro de 24 h y satisface la necesidad de rapidez; Atlas tiene mayor precisión aparente en la muestra, pero casi todo duplica la línea base y llega tarde. Eco parece barato, pero añade poco y exige más triaje. Para R2, Atlas añade 45 hallazgos históricos y puede ser la elección razonable. Si ya tenemos Faro por otra vía con los mismos derechos y tiempos, su valor incremental debe recalcularse. Ninguno es «el mejor» para toda organización.'),
      p('En R1, usando útiles/revisados como precisión operacional del piloto: Faro 60%, Atlas 90%, Eco 80%. Los desconocidos siguen en el denominador para esta definición conservadora; no se etiquetan automáticamente como falsos. No interpretes estos porcentajes como tasa de detección global. Deduplica por entidad y evento (por ejemplo, dispositivo, cuenta, artefacto y ventana), no solo por texto o hash de una fila; conserva la procedencia y la primera hora de cada fuente para medir anticipación.'),
      list(
        'Antes del piloto: fijar requisito, línea base interna/externa, muestra de evaluación, campos obligatorios, definición de útil y responsable de adjudicación. Registrar supuestos y límites de visibilidad.',
        'Acordar por escrito criterios de aceptación. Ejemplo R1: al menos 20 hallazgos incrementales útiles en el mes, p95 de entrega <24 h, ≥90% de campos obligatorios y ≤8 h/mes de triaje. Son umbrales ficticios; ajustar al riesgo y presupuesto propios.',
        'Durante 30 días: importar de forma controlada, registrar indisponibilidad y cuotas, medir calidad, duplicación y esfuerzo. Revisar una muestra comparable y las discrepancias con dos analistas cuando sea posible. No usar el feed como única verdad de referencia.',
        'Al terminar: comparar resultados con aceptación y coste total. Faro cumple los umbrales ilustrativos para R1; Atlas incumple puntualidad e incremento; Eco incumple incremento, completitud y esfuerzo. La contratación depende además de presupuesto, uso permitido y contrato.',
        'Antes de renovar: repetir la comparación con la línea base actual, revisar cambios en cobertura, errores y horas de trabajo. Renovar, ajustar o cancelar por valor incremental demostrado. La integración ya pagada no obliga a seguir comprando un feed redundante.',
      ),
      check('Práctica · Meridian ya recibe casi todos los datos de Atlas, pero necesita alertas nuevas antes de 24 h. ¿Qué decisión sostiene el piloto?', [
        'Contratar Atlas porque 90% es siempre superior a 60%', 'Priorizar Faro para R1, sujeto a presupuesto y contrato; evaluar Atlas por separado para R2',
        'Contratar Eco porque la licencia es la menor', 'Contar las tres fuentes como tres confirmaciones independientes',
      ], 1, 'Faro aporta incremento y puntualidad para R1. La precisión aislada no resuelve ese requisito; el precio de Eco omite horas de triaje. Una fuente que cita a otra no crea una observación independiente. Atlas puede tener valor para el requisito histórico R2.'),
      check('Práctica · Un proveedor históricamente fiable reproduce un dato sin evidencia primaria. ¿Cómo lo registras?', [
        'Fuente fiable, por tanto información confirmada', 'Fuente e información se evalúan por separado; credibilidad pendiente y cadena de citas documentada',
        'Toda información de pago es exclusiva', 'Tres republicaciones bastan para elevar confianza',
      ], 1, 'El historial ayuda a juzgar fiabilidad, pero no corrobora esa afirmación. Pagar no implica exclusividad, y republicar una sola observación no la convierte en tres evidencias.'),
      links('Seguir la evaluación', [
        { label: 's3m4 · Leer reporting de proveedores', href: '/learn/s3m4' },
        { label: 's4m2 · Independencia y eco de feeds', href: '/learn/s4m2' },
        { label: 's5m5 · Métricas de valor del equipo CTI', href: '/learn/s5m5' },
      ]),
    ],
  },
  s3m2: {
    minutes: 20,
    objectives: ['Complementario: registrar un flujo de pivotes desde una muestra con candidatos, corroboración y límites de confianza'],
    blocks: [
      complement('De una muestra a candidatos relacionados'),
      p('**Pivotar** es usar una observación como clave para buscar otros elementos. El resultado es una lista de candidatos, no una atribución. Una **hipótesis** es una explicación que aún debes contrastar. El flujo completo es: **muestra inicial → observaciones → hipótesis → pivotes → candidatos → corroboración → conclusión y límites**. En este ejercicio solo leemos fichas ficticias; no descargamos ni ejecutamos malware.'),
      table(['Observación / pivote', 'Qué aporta', 'Límite y corroboración necesaria'], [
        ['SHA-256 exacto', 'Identifica los mismos bytes con altísima fiabilidad práctica', 'No identifica por sí solo familia, campaña o autor. Distinto hash no implica distinta familia.'],
        ['Imphash', 'Resume imports normalizados de un ejecutable PE: bibliotecas y funciones importadas', 'Binarios no relacionados pueden compartir imports; empaquetado, reconstrucción u orden de imports pueden cambiar el hash. No demuestra mismo compilador.'],
        ['Fuzzy hashing: ssdeep / TLSH', 'Compara rasgos aproximados para priorizar semejanzas', 'No es identidad ni probabilidad de parentesco. Los algoritmos y escalas difieren; empaquetado y bibliotecas compartidas sesgan resultados. No convertir distancia TLSH en porcentaje ssdeep.'],
        ['Cadenas distintivas y configuración', 'Pueden revelar constantes o estructura poco común', 'Código reutilizado, texto copiado y señuelos también coinciden; contrastar función y contexto.'],
        ['PDB (Program Database)', 'Ruta o identificador de símbolos de depuración conservado en ciertos binarios', 'Puede reflejar un proyecto, pero se puede copiar o manipular. Una ruta genérica tiene poco valor; no identifica a una persona.'],
        ['Firma de código y certificado', 'Agrupa archivos por datos del firmante o certificado', 'Separar firma criptográficamente válida de reputación; certificados robados o usados en varios productos no prueban un actor común. Comprobar huella y validez.'],
        ['Relaciones archivo ↔ infraestructura', 'Dominios incrustados/contactados, archivos descargados o soltados', 'Una cadena incrustada no prueba contacto. Contacto en sandbox no prueba control de la infraestructura; separar OCSP, servicios compartidos y C2 corroborado.'],
      ]),
      h('Consultas ilustrativas de VirusTotal'),
      p('Las consultas siguientes emplean modificadores documentados de **VirusTotal Intelligence**. Son sintaxis ilustrativa contrastada el 19-10-2026; los valores son ficticios y no prometen resultados. El acceso a búsquedas avanzadas, contenido, relaciones y descargas depende del producto, los permisos y los datos disponibles. La consulta por hash de un informe existente y la búsqueda avanzada son funciones distintas. No introduzcas secretos ni subas muestras privadas para hacer este ejercicio.'),
      code('Consultas ilustrativas · no se ejecutan desde el curso', 'SHA-256 exacto: pegar el hash completo en Search, sin subir el archivo\n\nimphash:11111111111111111111111111111111\nsimilar-to:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\nssdeep:"3072:ABCDEFGH:ABCD"\ncontent:"cicada-demo-v1"\nmetadata:"ldr.pdb"\nsignature:"Meridian Demo Signing"\ncontacted_ip:192.0.2.10'),
      p('**Cómo leerlas.** imphash busca ese valor de imports; similar-to busca similitud estructural respecto a un hash, y ssdeep usa un hash difuso. content busca bytes o texto; metadata puede encontrar un PDB indexado, pero también otros campos: hay que abrir el informe y comprobar la coincidencia. signature busca campos de firma, no una identidad de actor. contacted_ip recupera observaciones de contacto: la IP de documentación del ejemplo no representa un servidor adversario real. En Relations examina por separado archivos soltados, padres de ejecución y objetos de red, conservando dirección y fuente de la relación.'),
      p('**Sin premium o sin datos.** Usa la ficha y las relaciones visibles de un hash ya conocido, informes públicos con procedencia o el inventario interno autorizado. Para aprender aquí, usa la tabla siguiente y un registro local. En archivos benignos propios puedes comparar hashes y cadenas sin red. Si una relación o metadato no está visible, anota «no disponible»; no lo conviertas en «no existe» ni inventes un resultado. La falta de sandbox o una búsqueda vacía tampoco demuestra benignidad.'),
      p('Antes del caso resuelto, sigue una muestra en vídeo desde el hash hasta una relación que puedas defender, sin saltarte las dudas.'),
      video('Del hash a una relación defendible', 'lKLGa2eQSbg', 'muestra-candidatos'),
      h('Caso resuelto · candidatos fuertes, débiles y sin datos'),
      p('Datos completamente ficticios. La muestra inicial A presenta imports I1, cadena poco común DEMO-CFG-7, PDB de un proyecto demo y comportamiento descrito de envío a un endpoint de laboratorio. Hipótesis H1: parte de los candidatos pertenece al mismo conjunto de código que A. Hipótesis alternativa H2: comparten componentes públicos o infraestructura común. No identificamos actores.'),
      table(['Candidato', 'Observaciones', 'Decisión y razón'], [
        ['B', 'I1; DEMO-CFG-7; misma estructura de configuración; comportamiento y secuencia de carga concordantes en dos informes de origen distinto', 'Mantener como relacionado probable en un cluster de código, confianza moderada. Hay corroboración de varios rasgos y observaciones; falta validar más variantes y descartar reutilización. No prueba una campaña o actor.'],
        ['C', 'I1 y puntuación ssdeep 94; el resto corresponde a una biblioteca compartida, configuración distinta', 'Coincidencia débil. No incorporar al cluster por ahora; explicar la semejanza por la biblioteca y pedir evidencia adicional. El 94 no es 94% de probabilidad de misma familia.'],
        ['D', 'Solo comparte IP de alojamiento con A durante una ventana amplia; servidor con múltiples clientes', 'No unir por ese enlace. Prioridad baja: infraestructura compartida y tiempo poco preciso ofrecen escasa capacidad de distinguir hipótesis. Revisar resolución temporal en s3m3.'],
        ['E', 'Un informe menciona el mismo PDB, pero no aporta bytes, huella ni procedencia del dato', 'Datos insuficientes. Guardar como pista pendiente, confianza baja; pedir evidencia primaria. No clasificar como relacionado ni como descartado definitivo.'],
      ]),
      list(
        'Observaciones: separar lo visto en A de lo afirmado por informes. Asignar identificadores de evidencia y guardar fecha de observación y fecha de consulta.',
        'Hipótesis y pivotes: consultar imports, cadena, metadatos y relaciones. Registrar también búsquedas fallidas o no disponibles y los filtros utilizados.',
        'Corroboración: B sostiene mejor H1; C y D admiten H2; E no permite decidir. Revisar dependencia entre fuentes antes de elevar confianza.',
        'Conclusión: «B probablemente comparte código con A, con confianza moderada; C/D no se incorporan; E queda pendiente». Explicitar que familia, campaña y actor son niveles diferentes y qué evidencia cambiaría el juicio.',
      ),
      code('Registro de investigación · ejemplo ficticio', 'Consulta Q-01 | 2026-10-19 10:00 UTC | imphash:I1 (abreviación en la ficha)\nFuente: exportación didáctica; en una consulta real usar valor completo\nEvidencia E-01: candidatos B/C; procedencia y copia del informe conservadas\nQ-02: DEMO-CFG-7 → B; E-02 config y E-03 conducta, orígenes independientes\nQ-03: relaciones de E → no disponibles, no equivale a ausencia\nJuicio J-01: B probable relacionado por código, confianza moderada\nAlternativa: componente compartido; pendiente validar código y más variantes\nPróxima acción: contrastar DNS y tiempos; revisión por otra analista'),
      check('Práctica · C comparte imphash y ssdeep 94, explicado por una biblioteca común. ¿Qué haces?', [
        'Atribuir C al mismo actor con 94% de confianza', 'Añadir C a la campaña porque hay dos coincidencias',
        'Mantener C como candidato débil y buscar rasgos que distingan las hipótesis', 'Declarar C benigno porque no está confirmado',
      ], 2, 'Dos señales dependientes de un componente común no aportan dos corroboraciones independientes. La puntuación no mide probabilidad de atribución. Falta de confirmación tampoco equivale a benignidad.'),
      check('Práctica · Para E no hay informe accesible. ¿Qué escribes?', [
        'No tiene relaciones', 'Pertenece al cluster porque alguien lo citó', 'Dato no disponible; pista pendiente, procedencia insuficiente', 'La búsqueda demuestra que es benigno',
      ], 2, 'No disponible describe una limitación de colección. No demuestra ausencia de relaciones, pertenencia ni benignidad. La pista debe poder revisarse cuando llegue evidencia.'),
      links('Continuar con infraestructura y detección', [
        { label: 's3m3 · DNS, WHOIS y certificados: comprobar tiempos y servicios compartidos', href: '/learn/s3m3' },
        { label: 's3m5 · De cadenas observadas a una hipótesis YARA', href: '/learn/s3m5' },
        { label: 'VirusTotal · Modificadores de búsqueda de archivos', href: 'https://docs.virustotal.com/docs/file-search-modifiers' },
        { label: 'VirusTotal · Similitud de archivos', href: 'https://docs.virustotal.com/docs/file-similarity-search' },
        { label: 'VirusTotal · Consulta por hash y búsqueda', href: 'https://docs.virustotal.com/docs/searching' },
        { label: 'VirusTotal · Relaciones de un archivo', href: 'https://docs.virustotal.com/reference/files-relationships' },
      ]),
    ],
  },
  s3m3: {
    minutes: 3,
    objectives: ['Complementario: corroborar relaciones de una muestra con resolución temporal y alternativas de alojamiento compartido'],
    blocks: [
      complement('Volver de la infraestructura a la muestra'),
      p('El candidato D de la práctica de s3m2 comparte una IP con A. Antes de agruparlos, compara intervalos de resolución de DNS pasivo, fecha de observación de contacto y función del servidor. Un historial de meses no prueba uso simultáneo. Un certificado TLS del servidor identifica una relación de infraestructura; un certificado de firma de código se vincula a archivos firmados: son objetos diferentes. CDN, alojamiento compartido, servicios de validación y datos de registro protegidos pueden producir coincidencias débiles.'),
      check('Práctica · A y D resolvieron a una IP compartida con seis meses de diferencia. ¿Qué falta?', [
        'Nada: misma IP significa mismo operador', 'Contexto temporal, función del servicio y evidencias independientes', 'Solo el país de la IP para atribuir', 'Cambiar una cookie de sesión',
      ], 1, 'La coincidencia histórica puede deberse a reciclaje o múltiples clientes. El país no identifica operador. La cookie no responde a una hipótesis de infraestructura.'),
      links('Volver al flujo completo', [{ label: 's3m2 · Muestra → hipótesis → candidatos → límites', href: '/learn/s3m2' }]),
    ],
  },
  s3m4: {
    minutes: 4,
    objectives: ['Complementario: extraer procedencia, alcance y sesgos de reporting de proveedores antes de usarlo como corroboración'],
    blocks: [
      complement('Reporting de proveedores y trazabilidad'),
      p('Al leer un informe de proveedor, registra autor, fecha de publicación, periodo observado, población de sensores, método y referencias. Distingue observación propia, cita de terceros e interpretación. Si no explica denominador, deduplicación o cobertura, sus cifras pueden describir solo su visibilidad. El marketing de «más detectado» no sustituye una unidad de medida. Un informe puede ser útil aunque no sea independiente de tu feed: aporta contexto, pero no otra observación del mismo hecho.'),
      check('Práctica · Eco publica un informe y un feed que citan la misma observación de Faro. ¿Cuántas observaciones independientes del hecho tienes?', [
        'Tres, porque son tres documentos', 'Dos, porque Eco vende dos productos', 'Una observación de origen conocida, pendiente de verificar', 'Ninguna fuente comercial puede ser útil',
      ], 2, 'Cambiar formato o proveedor no cambia el origen. Los productos pueden aportar contexto o rapidez, pero no multiplican la corroboración. La dependencia no los vuelve inútiles para todo requisito.'),
      links('Evaluar el origen y las métricas', [
        { label: 's3m1 · Piloto y renovación de feeds', href: '/learn/s3m1' },
        { label: 's4m2 · Eco de fuentes', href: '/learn/s4m2' },
        { label: 's4m4 · Métricas del ecosistema de infostealers', href: '/learn/s4m4' },
      ]),
    ],
  },
};
