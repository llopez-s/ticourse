import type { LabMeta } from './labs';

interface LabGuide {
  objectives: string[];
  prerequisites: string[];
  outcome: string;
  challengeId?: 'pivot' | 'report' | 'logs';
}

const guide = (prerequisites: string[], objectives: string[], outcome: string, challengeId?: LabGuide['challengeId']): LabGuide =>
  ({ prerequisites, objectives, outcome, challengeId });

export const LAB_GUIDES: Record<string, LabGuide> = {
  lab1a: guide(['s1m4'], ['Relacionar las fases del ciclo de inteligencia.', 'Distinguir colección, análisis y difusión.'], 'Reconstruir el ciclo completo y revisar la función de cada fase.'),
  lab1b: guide(['s1m5'], ['Distinguir necesidades de inteligencia de peticiones de datos.', 'Priorizar preguntas que orientan decisiones.'], 'Elegir los cuatro PIRs defendibles para Meridian.'),
  lab2a: guide(['s2m1'], ['Relacionar observaciones con fases de una intrusión.', 'Separar ejecución, persistencia y comunicación.'], 'Clasificar los eventos con al menos un 80% de aciertos.'),
  lab2b: guide(['s2m3'], ['Separar actor, capacidad, infraestructura y víctima.', 'Descomponer evidencia sin confundir sus roles.'], 'Asignar cada evidencia al vértice adecuado del Diamond Model.'),
  lab2c: guide(['s2m2'], ['Distinguir los efectos de las acciones defensivas.', 'Relacionar una medida con su objetivo operativo.'], 'Clasificar las medidas en su Course of Action.'),
  lab3a: guide(['s3m2', 's3m3'], ['Elegir pivotes con valor discriminante.', 'Distinguir relaciones técnicas de pertenencia al actor.'], 'Encontrar cuatro activos dentro del presupuesto de consultas.', 'pivot'),
  lab3b: guide(['s3m5'], ['Equilibrar detección y falsos positivos en un corpus.', 'Reconocer los límites de una simulación por etiquetas.'], 'Cubrir ambas variantes sin falsos positivos del corpus ficticio.'),
  lab3c: guide(['s3m1'], ['Relacionar requisitos con fuentes y disciplinas de colección.', 'Elegir la colección que responde a cada necesidad.'], 'Completar el CMF con fuentes adecuadas al requisito.'),
  lab4a: guide(['s4m1', 's4m2'], ['Reconocer sesgos y falacias analíticas.', 'Separar evidencia de interpretación.'], 'Identificar el sesgo de cada razonamiento y consultar su explicación.'),
  lab4b: guide(['s4m3'], ['Contrastar evidencias con hipótesis competidoras.', 'Priorizar inconsistencias y diagnosticidad.'], 'Alcanzar un 70% de acuerdo en la matriz y elegir la hipótesis que sobrevive.'),
  lab5a: guide(['s5m2'], ['Distinguir vocabulario estimativo y confianza.', 'Expresar probabilidades dentro de bandas explícitas.'], 'Completar el vocabulario y alcanzar ocho puntos en las estimaciones de escuela.'),
  lab5b: guide(['s5m1', 's5m2', 's5m3'], ['Presentar el juicio principal con BLUF.', 'Ajustar confianza y distribución al producto.'], 'Completar los siete pasos del informe guiado.', 'report'),
  spl1a: guide(['sp1m1'], ['Distinguir categorías de control.', 'Identificar qué aplica realmente una protección.'], 'Clasificar los doce controles con al menos un 80% de aciertos.'),
  spl1b: guide(['sp1m5'], ['Relacionar aprobación, ejecución y verificación de cambios.', 'Reconocer la documentación de cierre.'], 'Reconstruir el flujo completo de gestión de cambios.'),
  spl1c: guide(['sp1m6'], ['Elegir primitivas según la necesidad.', 'Separar confidencialidad, integridad y autenticidad.'], 'Seleccionar la herramienta criptográfica adecuada con al menos un 80%.'),
  spl2a: guide(['sp2m1'], ['Distinguir motivaciones y capacidades de actores.', 'Relacionar el escenario con el perfil de amenaza.'], 'Clasificar los escenarios según el actor más compatible.'),
  spl2b: guide(['sp2m2'], ['Reconocer vectores de entrada.', 'Separar engaño humano, aplicaciones y acceso técnico.'], 'Clasificar los vectores y revisar las evidencias de cada elección.'),
  spl2c: guide(['sp2m8'], ['Relacionar mitigaciones con amenazas concretas.', 'Priorizar controles que reducen la exposición del caso.'], 'Elegir el conjunto de mitigaciones requerido por el escenario.'),
  spl3a: guide(['sp3m4'], ['Distinguir zonas y fronteras de confianza.', 'Ubicar recursos según su exposición.'], 'Asignar los recursos del puerto a zonas de red adecuadas.'),
  spl3b: guide(['sp3m6'], ['Relacionar protección y estado del dato.', 'Distinguir controles de acceso y transformación del dato.'], 'Elegir la protección adecuada para cada necesidad.'),
  spl3c: guide(['sp3m7'], ['Ordenar opciones de continuidad por capacidad de recuperación.', 'Reconocer los compromisos entre preparación y tiempo.'], 'Reconstruir la escalera de continuidad del escenario.'),
  spl4a: guide(['sp4m6', 'sp4m11'], ['Elegir fuentes según la pregunta investigada.', 'Distinguir visibilidad de red, endpoint y autenticación.'], 'Seleccionar la fuente adecuada con al menos un 80% de aciertos.', 'logs'),
  spl4b: guide(['sp4m10'], ['Relacionar las fases de respuesta a incidentes.', 'Distinguir contención, erradicación y recuperación.'], 'Reconstruir las siete fases del proceso didáctico de respuesta.'),
  spl4c: guide(['sp4m4', 'sp4m5'], ['Priorizar hallazgos por exposición e impacto.', 'Considerar controles existentes y restricciones operativas.'], 'Elegir cuatro hallazgos para la ventana de remediación.'),
  spl5a: guide(['sp5m1'], ['Distinguir políticas, estándares, procedimientos y guías.', 'Relacionar documentos con decisiones de gobierno.'], 'Clasificar los documentos del programa de seguridad.'),
  spl5b: guide(['sp5m5'], ['Distinguir acuerdos y compromisos con proveedores.', 'Relacionar necesidades de negocio con instrumentos contractuales.'], 'Seleccionar el tipo de acuerdo adecuado para cada escenario.'),
  spl5c: guide(['sp5m3'], ['Calcular pérdida esperada por incidente y por año.', 'Separar valor del activo, exposición y frecuencia.'], 'Resolver las decisiones de riesgo cuantitativo del caso.'),
};

export function withLabGuide(meta: LabMeta): LabMeta {
  return { ...meta, ...LAB_GUIDES[meta.id] };
}
