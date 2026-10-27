import type { Block } from '../../lib/types';
import { check, code, complement, h, links, list, p, table, type LessonExpansion } from './shared';

const bullets = (...items: string[]): Block => ({ t: 'list', items });

// Threat hunting guided by intelligence, after FI-ISAC NL's TaHiTI 2.0 (CC BY 4.0), paraphrased.
export const HUNTING_EXPANSIONS: Record<string, LessonExpansion> = {
  s1m3: {
    minutes: 1,
    objectives: [],
    blocks: [
      p('En la Sliding Scale el threat hunting aparece como Active Defense. Al final de la sección 5 verás cómo se organiza un hunt guiado por inteligencia, cuando ya conozcas la Pyramid of Pain, los sesgos y el ACH que usa TaHiTI.'),
      links('Más adelante', [{ label: 's5m5 · Threat hunting guiado por inteligencia (TaHiTI)', href: '/learn/s5m5' }]),
    ],
  },
  s5m5: {
    minutes: 14,
    objectives: ['Complementario: planificar, ejecutar y cerrar un hunt guiado por inteligencia con la metodología TaHiTI'],
    blocks: [
      complement('Threat hunting guiado por inteligencia: TaHiTI'),
      p('Una de las métricas de valor de la tabla de arriba son los **hunts originados por inteligencia**. Esta cápsula explica cómo se hace uno con **TaHiTI** (*Targeted Hunting integrating Threat Intelligence*), la metodología que publicó en 2018 un grupo de bancos holandeses del FI-ISAC NL y que se actualizó en su versión 2.0 en octubre de 2026. No entra en el examen GCTI, pero junta casi todo lo que has visto en el curso.'),
      h('Qué es un hunt y qué no lo es'),
      p('Hacer hunting es salir a buscar, sin esperar a ninguna alerta, rastros de un atacante que ya ha pasado por delante de tus defensas. Parte de **asumir que ya te han entrado** y todavía no lo sabes. Su objetivo es acortar la **brecha de detección** (*breach detection gap*, o *dwell time*): el tiempo que pasa entre el compromiso inicial y el momento en que lo descubres. Casi siempre busca lo que se conoce a medias: técnicas conocidas usadas por un atacante que no conoces. Y de vez en cuando destapa algo que nadie había descrito.'),
      bullets(
        'Pasar una lista de IOCs por el SIEM **no** es un hunt: es detección. Los IOCs pueden dar una pista inicial o servir para acotar, pero el hunt mira comportamientos.',
        'Tampoco lo son un pentest ni un red team (prueban controles), la monitorización (vigila lo que ya está definido) ni la respuesta a incidentes (reacciona a algo que ya ha saltado).',
        'Lanzar una consulta suelta no es un hunt. Si una herramienta puede hacerlo sola, normalmente no es hunting.',
        'Un hunt no garantiza resultados. Uno sin hallazgos también aporta: confirma supuestos, enseña el entorno y descubre huecos de datos.',
      ),
      p('TaHiTI solo se ocupa del **hunting estructurado**, el que nace de una hipótesis. El no estructurado, el de bucear en los datos a ver qué sale, cuesta mucho y rinde poco. Ahí solo cuenta como fuente de ideas para un hunt estructurado. Y como trabaja sobre TTPs, se mueve en los tres escalones de arriba de la **Pyramid of Pain** (artefactos, herramientas y TTPs). Los de abajo (hashes, IPs y dominios) le sirven de pistas, pero nunca bastan para lanzar un hunt.'),
      table(['Nivel del Hunting Maturity Model (David Bianco)', 'Qué hace el equipo', '¿Es hunting para TaHiTI?'], [
        ['HMM0 · Inicial', 'Depende de las alertas automáticas', 'No'],
        ['HMM1 · Mínimo', 'Busca IOCs que le llegan de fuera', 'No: es detección'],
        ['HMM2 · Procedimental', 'Sigue procedimientos de hunting escritos por otros', 'Sí, si va más allá de los IOCs'],
        ['HMM3 · Innovador', 'Crea sus propios procedimientos y técnicas de análisis', 'Sí'],
        ['HMM4 · Líder', 'Convierte en automático lo que funciona y libera a la gente para buscar lo nuevo', 'Sí'],
      ]),
      h('Cinco formas en que la CTI y el hunting se alimentan'),
      list(
        '**Como punto de partida.** Un informe sobre un grupo que ataca tu sector y tu región dispara un hunt. Ojo: un grupo puede cambiar de sector y varios grupos comparten TTPs, así que no te quedes solo con «los míos».',
        '**Para dar contexto y guiar el hunt.** Si encuentras una técnica, la inteligencia te dice qué otras suelen ir con ella (por ejemplo, en ATT&CK). Es el pivoteo de la sección 3.',
        '**Para enriquecerlo.** Le aporta TTPs que se traducen en búsquedas, IOCs para acotar y **IoAs** (indicadores de ataque: relaciones entre procesos, líneas de comando o patrones de acceso). Los IoAs siguen sirviendo aunque el atacante cambie de infraestructura.',
        '**Al revés: el hunt genera inteligencia.** Una TTP nueva va al perfil del actor y, si se comparte con el ISAC, otros equipos pueden ir a buscarla también.',
        '**Para priorizar.** Las horas de hunting son pocas, así que la CTI decide qué va primero según el sector, la geografía, la tecnología que usas, las señales de que te tienen en el punto de mira, las vulnerabilidades que tienes expuestas, el impacto en el negocio y la intención y capacidad del adversario.',
      ),
      h('El proceso: iniciar, cazar y cerrar'),
      table(['Fase', 'Paso', 'Qué se hace'], [
        ['1 · Iniciar', '1.1 Disparo', 'Llega algo que merece un hunt: inteligencia, otro hunt, un hueco de cobertura de la monitorización, un incidente antiguo, una conclusión forense, un red team (TIBER, TLPT), el análisis de las joyas de la corona o el olfato del equipo.'],
        ['1 · Iniciar', '1.2 Resumen', 'Se apunta en el *backlog* un resumen de la investigación (*investigation abstract*): fecha, hipótesis inicial, qué lo disparó y su prioridad. Hay que revisar el backlog cada cierto tiempo, porque las prioridades cambian.'],
        ['2 · Cazar', '2.1 Afinar', 'Se completa el resumen: técnica en la Kill Chain, ATT&CK o ATLAS, actores y capacidades, incidentes previos, controles que ya existen, recursos necesarios. Se fija la hipótesis definitiva y se eligen fuentes de datos y técnicas de análisis.'],
        ['2 · Cazar', '2.2 Ejecutar', 'A veces primero se simula el ataque, para comprobar que se salta los controles y para tener datos de ejemplo. Luego se recogen y analizan los datos y se valida la hipótesis.'],
        ['3 · Cerrar', '3.1 a 3.3', 'Se documentan hallazgos, recomendaciones y lecciones aprendidas. Se actualiza el backlog y se pasa lo que toque a respuesta a incidentes, monitorización, CTI (idealmente al TIP), gestión de vulnerabilidades o arquitectura.'],
      ]),
      p('Una buena hipótesis es **clara**, **comprobable**, **acotada**, **coherente con lo que ya se sabe** y **se puede probar en un tiempo razonable**. «Los atacantes están sacando datos» no da por dónde empezar. «Los atacantes sacan datos por un canal encubierto sobre DNS» deja el hunt en el tráfico DNS. Y cuidado con las hipótesis sobre ausencias: si buscas «borran sus rastros» y no encuentras nada, no has demostrado que no lo hagan.'),
      p('El hunt acaba de una de tres maneras. **Confirmada**: hay un incidente y se avisa a respuesta a incidentes, aunque el hunt puede seguir buscando más sistemas mientras tanto. **Descartada**: es la conclusión más delicada, porque exige estar segura de que de verdad no hay nada. **No concluyente**: faltan datos, la técnica no era la buena, el alcance se quedó corto o la hipótesis estaba mal planteada. En ese caso se vuelve a afinar.'),
      p('Los sesgos de s4m1 aparecen aquí con nombre propio. Con el **de confirmación** solo ves lo que encaja con la hipótesis. Con el **anclaje** no sueltas lo primero que supiste. Y con el **de disponibilidad** investigas los datos que tienes, en vez de los que necesitas. Una hipótesis bien escrita, un equipo que se lleva la contraria y, en los equipos más maduros, el ACH de s4m3 ayudan a mantener la objetividad.'),
      h('Micro hunts'),
      p('Un **micro hunt** es la versión rápida del mismo proceso: una sola hipótesis, pocas fuentes de datos y un alcance cerrado de antemano. Se mide en horas. TaHiTI propone, como orientación, una hora para iniciar, de una a cuatro para cazar y otra hora para cerrar. Si aparecen varias hipótesis, hace falta otra ronda de afinado, se necesitan más fuentes, asoma actividad maliciosa o el alcance se desborda, se convierte en un hunt completo.'),
      h('Cómo se mide un programa de hunting'),
      p('Medir el hunting por los incidentes que encuentra es el error típico. Se parece mucho a contar IOCs en la tabla de arriba. Sirven mejor el **dwell time de lo que se encuentra** y su evolución, las detecciones nuevas o mejoradas, la cobertura de ATT&CK ganada, los huecos de datos cerrados, la inteligencia generada y los supuestos de riesgo confirmados o descartados. Un hunt sin compromisos que deja detecciones nuevas y un hueco de logs al descubierto puede ser todo un éxito. Para ver cómo funciona el programa sirven el tiempo medio por hunt, los hunts por trimestre y cuántos siguen las prioridades acordadas. Y antes de empezar hay que pactar el mandato con el área legal y de privacidad, porque bucear en los datos puede afectar a la privacidad de la plantilla.'),
      p('**Caso resuelto (ficticio, fuera de la campaña VELVET CICADA).** Norvik Industrial, un fabricante europeo de maquinaria, recibe un aviso del ISAC de su sector: un grupo saca datos de empresas industriales por túneles DNS. Paso 1, iniciar: el equipo lo apunta en el backlog con prioridad alta, porque es su sector y su región y el grupo tiene capacidad. Paso 2, afinar: la hipótesis queda en «algún servidor de Norvik saca datos por un canal encubierto sobre DNS». Las fuentes son los logs del resolver y los de proxy, y el plazo, tres días. Paso 3, ejecutar: el equipo ordena por volumen enviado a cada dominio, mira la relación entre lo que se pregunta y lo que se responde y busca ráfagas en el tiempo. Paso 4, resultado: no concluyente, porque el resolver solo guarda 30 días y el informe habla de actividad de hace dos meses. Paso 5, cerrar: el equipo recomienda ampliar la retención del DNS, entrega a monitorización una detección por la relación pregunta/respuesta y deja el hunt en el backlog para repetirlo cuando haya datos.'),
      code('Resumen de la investigación · plantilla abreviada', 'Fecha: 2026-10-27 · Hunter: equipo CTI\nHipótesis (afinada): servidores de Norvik sacan datos por un canal encubierto sobre DNS\nDisparo: aviso del ISAC sectorial (TLP:AMBER) · Prioridad: alta\nATT&CK: T1071.004 (DNS), T1048 (exfiltración por protocolo alternativo)\nActor: grupo ficticio del aviso · capacidad media-alta · campaña activa\nFuentes: resolver DNS (30 días), proxy (90 días)\nTécnicas: apilar volumen por dominio, relación pregunta/respuesta, ráfagas\nResultado: no concluyente (retención insuficiente)\nTraspaso: monitorización (nueva detección) · arquitectura (retención)'),
      check('Práctica · ¿Qué hipótesis está lista para guiar un hunt?', [
        'Hay atacantes dentro de la red',
        'Los atacantes borran sus rastros en los sistemas',
        'Algún servidor saca datos por un canal encubierto sobre DNS en los últimos 90 días',
        'Buscar los 400 IOCs del último feed en el SIEM',
      ], 2, 'La tercera es clara, acotada a una técnica y a un tipo de datos, coherente con la inteligencia y comprobable en un plazo. «Hay atacantes dentro» no da punto de partida; «borran sus rastros» trata de una ausencia que no se puede demostrar, y barrer IOCs es detección, no hunting.'),
      check('Práctica · El hunt del DNS no encuentra nada porque los logs solo cubren 30 días y la actividad descrita es de hace dos meses. ¿Cómo se cierra?', [
        'Hipótesis descartada: Norvik está limpia',
        'Hipótesis confirmada por precaución',
        'No concluyente: registrar el hueco de retención, recomendar ampliarla y dejar el hunt para repetirlo',
        'Borrar el resumen del backlog porque no salió nada',
      ], 2, 'Sin datos del periodo relevante no se puede descartar nada: la ausencia de evidencia no es evidencia de ausencia. El resultado es no concluyente, y lo que aporta es el hueco de logs y la recomendación. Confirmar sin pruebas sería inventar un incidente, y borrar el resumen tira la lección aprendida.'),
      check('Práctica · ¿Qué métrica muestra mejor el valor de un programa de hunting?', [
        'Número de consultas lanzadas en el trimestre',
        'Número de incidentes encontrados, y nada más',
        'Detecciones nuevas, huecos de datos cerrados y evolución del dwell time de los hallazgos',
        'Número de IOCs barridos en el SIEM',
      ], 2, 'Las métricas de resultado reflejan lo que el hunting cambia en la organización: detección, visibilidad y tiempo de permanencia del atacante. Contar consultas o IOCs mide actividad, y contar solo incidentes castiga los hunts que dejan detecciones o destapan huecos sin encontrar a nadie.'),
      links('Repasar lo que usa TaHiTI', [
        { label: 's1m3 · Sliding Scale: el hunting como Active Defense', href: '/learn/s1m3' },
        { label: 's2m5 · MITRE ATT&CK y la Pyramid of Pain', href: '/learn/s2m5' },
        { label: 's3m4 · OSINT, TLP y comunidades de compartición', href: '/learn/s3m4' },
        { label: 's4m1 · Sesgos cognitivos del analista', href: '/learn/s4m1' },
        { label: 's4m3 · Técnicas estructuradas y ACH', href: '/learn/s4m3' },
        { label: 'FI-ISAC NL · TaHiTI Threat Hunting Methodology v2.0 (PDF, CC BY 4.0)', href: 'https://www.nvb.nl/media/vw3iwzhb/tahiti-threat-hunting-methodology_v20.pdf' },
      ]),
      p('Resumen propio basado en *TaHiTI Threat Hunting Methodology*, versión 2.0, FI-ISAC NL (2026), publicada con licencia Creative Commons BY 4.0. El documento trae además una plantilla completa de investigación y una hoja de cálculo para registrar los hunts (*MaGMa for threat hunting*).'),
    ],
  },
};
