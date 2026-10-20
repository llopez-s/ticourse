ALERTÓPOLIS · ESCRITURA LIBRE YARA · PRÁCTICA COMPLEMENTARIA
Datos ficticios e inertes. No son malware ni ejecutables. Sin cuentas ni licencias.

Objetivo: detectar a.dat, b-wide.dat y c-heldout.dat; rechazar los demás dentro
del contrato v1 (<4096 bytes, formato de demostración ALRTDEMO).
Las cadenas y sus variantes están en fixtures.py. Empieza por los training;
reserva held-out para comprobar generalización. challenge revela un límite.

1. Escribe tu propia regla MiRegla en mi-regla.yar antes de mirar la solución.
2. Usa Python 3 y un entorno local: python -m venv .venv
3. Actívalo en Windows: .venv\Scripts\activate
   En macOS/Linux: source .venv/bin/activate
4. python -m pip install -r requirements.txt
5. python fixtures.py
6. python verify.py --rule mi-regla.yar --name MiRegla
7. python verify.py  (las tres reglas de referencia, motor YARA real)

El verificador compara conjuntos EXACTOS de resultados, también los negativos.
Con yara CLI: yara reference.yar corpus/a.dat
Esa ejecución confirma coincidencias en A, pero NO sustituye la matriz completa.
Se puede trabajar sin instalar nada: redacta y compara la solución comentada;
en ese caso no has compilado ni ejecutado la regla.

Solución razonada (reference.yar):
- meta documenta versión, fecha y alcance; no detecta nada por sí mismo.
- header at 0 evita que un manual que cita todos los patrones dé positivo.
- family es necesario: ruta o bytes aislados tienen colisiones deliberadas.
- route OR hex permite que C cambie la ruta sin exigir todos los patrones.
- ascii wide nocase contempla B; wide intercala 00, no traduce Unicode general.
- el comodín ?? permite variar un byte de nuestra firma inventada.
- filesize < 4KB evita archivos fuera de contrato; también causa FN si el objetivo
  pasa a incluir variantes grandes. La cabecera inventada NO verifica formato PE.
- para PE reales, justificar import "pe" y pe.is_pe, o validar cabeceras completas;
  comprobar solo MZ es insuficiente. No se utiliza PE en este corpus.
- Sample exige el build de A: útil para esa muestra, pierde B y C.
- Hunt amplía candidatos: benign-route, benign-marker y benign-hex requieren triaje.
- Future-uncovered cambia marcador y ruta. No se cubre; no ocultes este FN.

Training: 6 casos; held-out: 5; challenge: 1. Son ejemplos públicos, no un test
ciego ni una estimación de sensibilidad poblacional. 12/12 conforme al contrato
no equivale a 100% de detección de una familia real ni a regla de producción.
Registra motor, regla/version, hash del corpus, partición, TP/FP/FN/TN según
objetivo, resultados y límites antes de compartir (s5m3).
