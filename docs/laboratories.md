# Laboratorios de Alertópolis

Los 27 laboratorios conservan sus IDs, requisitos de superación y recompensas.
Cada uno presenta objetivos, lecciones recomendadas y el resultado esperado de
la práctica guiada. No es necesario completar las lecciones de apoyo para entrar.

## Guardar, reanudar y repetir

Las respuestas, las selecciones, las matrices y los pasos intermedios se guardan
en este navegador al interactuar. Volver al laboratorio o recargar lo reanuda.
Cada laboratorio, modalidad y caso tiene un cuaderno independiente. Cambiar del
caso A al B no reemplaza lo escrito en A.

«Nuevo intento» pide confirmar y archiva el cuaderno actual antes de empezar
vacío. Se conservan hasta diez intentos anteriores por cuaderno. Cada uno se puede
descargar desde «Historial local». «Exportar trabajo» descarga el borrador, los
resultados y el historial como JSON; no existe importación en esta primera versión.
Los retos también permiten descargar una entrega legible en Markdown.

Los borradores y resultados detallados no se sincronizan con otros dispositivos.
El progreso completado sigue usando la sincronización opcional habitual. Borrar
datos del navegador elimina los cuadernos locales: descarga una copia antes.
Si el navegador no permite guardar o agota su almacenamiento, se muestra un aviso;
se puede seguir trabajando en memoria y exportar antes de salir.

## Leer los resultados

El resumen conserva el primer resultado de cada paso y su última corrección.
No convierte puntuaciones diferentes en una nota global. La primera validación
queda registrada antes de mostrar las respuestas y explicaciones.

- «Resuelto sin ayuda»: el paso cumple su objetivo sin haber consultado una pista
  o corrección de ese paso.
- «Corregido con ayuda»: se alcanza el objetivo después de consultar ayuda o
  después de que el corrector haya revelado feedback del mismo paso.
- «Por repasar»: la última validación todavía no cumple el objetivo.

El feedback de un paso del informe no cuenta como ayuda para otro paso distinto.
Consultar una pista del reto o su solución afecta a las siguientes validaciones
de ese intento. Empezar un nuevo intento conserva el anterior en el historial.
Los textos abiertos tienen una autoevaluación declarada por el alumno; una nota
alta en ella no es una evaluación automática ni una acreditación profesional.

## Tres retos, seis casos

Se abren desde «Reto práctico · opcional» en el laboratorio correspondiente.
Son casos autónomos y públicos, con unos 25 minutos de trabajo orientativo.

| Laboratorio | Caso A | Caso B | Qué se comprueba automáticamente |
|---|---|---|---|
| Pivot Hunt (`lab3a`) | IP histórica y certificado corroborado | TLS compartido y CDN de segunda etapa | Valoración de cuatro candidatos y evidencias de soporte |
| Report Forge (`lab5b`) | Exfiltración documentada | Intento bloqueado y eco de fuentes | Alcance demostrado, confianza defendible, TLP acordado y fuentes pertinentes |
| Log Hunt (`spl4a`) | Cuenta de usuario y persistencia | Cuenta de servicio y acceso a credenciales | Equipo, cuenta y cinco eventos en orden temporal |

En Pivot Hunt, cada consulta tiene coste y algunas requieren abrir una evidencia
anterior. Hay doce queries y más consultas disponibles de las que permite el
presupuesto. Las referencias de la entrega deben proceder de registros consultados.
El corrector admite los conjuntos de evidencia documentados en cada caso; revisa
el razonamiento con la rúbrica, que permite discutir los límites de esos conjuntos.

En Log Hunt, se pueden filtrar los 32 registros por texto, campo, fuente y ventana
UTC. La cronología conserva el orden en que se añaden los eventos y se puede
reordenar con botones, también mediante teclado. Una conexión permitida no prueba
qué datos viajaron; una conexión bloqueada no resuelve por sí sola un compromiso.

Todos los retos requieren completar los campos antes de entregar. «Entregado»
significa que se presentó el trabajo, incluso si hay comprobaciones pendientes.
La redacción se contrasta con cuatro criterios de 0–2 puntos: evidencia,
razonamiento, incertidumbre y utilidad de la acción. Cada nivel incluye ejemplos.
Después de entregar se puede ver una solución comentada y corregir el trabajo.

Los casos difieren en relaciones, alcance y decisiones, no solo en nombres.
Como se distribuyen con la web estática y tienen soluciones públicas, no deben
considerarse una prueba ciega. No contienen malware ni consultan dominios reales.
No otorgan XP adicional ni modifican los indicadores de preparación de examen.

## YARA

YARA Forge sigue siendo una simulación por etiquetas. El enlace a s3m5 abre el
editor libre, que conserva el borrador en un cuaderno local separado. La descarga
de la regla y el ZIP con corpus y verificador siguen disponibles. Compilar y
ejecutar YARA real requiere el entorno local descrito en el ZIP; el navegador no
ejecuta reglas. El borrador no se envía a servicios externos.

## Verificación para mantenimiento

Ejecutar `npm test` y `npm run build`. Las pruebas nuevas cubren corrección,
presupuesto, referencias, variantes, filtros, persistencia, historial, fallos de
almacenamiento y compatibilidad con progreso y recompensas.

Para comprobar interacciones: ejecutar `node scripts/test-lab-browser.mjs` con
Playwright y Chrome disponibles. El script arranca Vite en el puerto 5174 con el
observador de archivos desactivado; esto evita explorar perfiles y cachés locales
durante la prueba y no afecta al modo de desarrollo habitual.
`PLAYWRIGHT_MODULE_PATH` permite usar un módulo Playwright externo al repositorio;
`LAB_TEST_URL` cambia la URL de la web Vite. El script usa un perfil de navegador
aislado, bloquea fuentes y vídeos externos y cierra el navegador al finalizar.
Verifica los ocho motores y seis casos, recargas, descargas, separación de casos,
reinicio archivado, borrador YARA, teclado, móvil y fallo de cuota. Guarda capturas
en `node_modules/.cache/lab-browser/` (o `LAB_TEST_ARTIFACTS`).
