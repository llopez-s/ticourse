# Ampliaciones prácticas de identidad y threat intelligence

Revisión: 19 de octubre de 2026. Material original e independiente; se conservan
los avisos de no afiliación a CompTIA, SANS y GIAC. Todos los casos y datasets
nuevos son ficticios. No requieren cuentas, tokens, malware ni licencias de pago.

## Mapa del contenido

Las ampliaciones se añaden al final de las lecciones existentes. La columna de
tiempo total incluye lectura y práctica; el incremento corresponde al material
nuevo, no a una modificación de los pesos del examen.

| Lección | Qué incorpora | Nivel | Incremento → total |
|---|---|---|---|
| sp4m7 · Capacidades (4.5) | Suricata: anatomía de una regla, sticky buffers, dotprefix/endswith, tráfico cifrado (DNS/SNI frente a URI), IDS frente a IPS inline, lectura de alertas EVE, validación con -T y -r sobre capturas positivas y de control; laboratorio interactivo de cuatro misiones | Complementario | +45 → 59 min |
| sp4m8 · IAM | Autenticación/autorización; emisor, audiencia, permisos, renovación; contraseña, cookies e ID/access/refresh tokens; MFA; caso Ana → aplicación → Entra ID → Graph | Fundamentos base; ejemplo Microsoft complementario | +18 → 31 min |
| sp2m6 · Malware | Infostealers; capacidades, exposición y uso; límites de cada artefacto | Base defensiva | +7 → 21 min |
| sp4m10 · Respuesta | Dispositivo, alcance, identidad, aplicaciones, revocación y verificación; límites específicos de Microsoft y CAE | Base defensiva; Microsoft complementario | +10 → 23 min |
| s3m1 · CMF | Fiabilidad/credibilidad; calidad, trazabilidad, coste y valor incremental; Faro/Atlas/Eco; piloto, aceptación y renovación | Complementario | +16 → 27 min |
| s3m2 · Malware como colección | Flujo observaciones/hipótesis/pivotes/candidatos/corroboración; consultas VT contrastadas, alternativas sin premium; B/C/D/E y bitácora | Complementario; correcciones en el contenido previo | +20 → 33 min |
| s3m3 · Infraestructura | Tiempo, alojamiento compartido, certificados TLS frente a firma de código | Complementario | +3 → 17 min |
| s3m4 · OSINT/reporting | Metodología de proveedores, fechas, denominadores, cobertura y procedencia | Complementario | +4 → 18 min |
| s3m5 · IOCs/STIX/YARA | Sintaxis, decisiones de diseño, FP/FN y sobreajuste; editor libre, corpus inerte y motor real; remisión a la cápsula de Suricata de sp4m7 | Complementario; corrección de la receta universal de umbrales | +33 → 46 min |
| s4m2 · Falacias | Independencia, cadena de citas y eco de feeds | Complementario | +5 → 16 min |
| s4m4 · Clustering | Ecosistema de infostealers y métricas, con Bruma/Cobalto/Duna; unidad, ventana, sesgo y relevancia | Complementario identificable de S4 | +18 → 30 min |
| s5m3 · Diseminación técnica | Entregar YARA con objetivo, versión, motor, matriz reproducible, límites y acción | Complementario | +8 → 23 min |
| s5m5 · Métricas CTI | Distinción entre métricas del fenómeno observado y valor del equipo; cápsula de threat hunting guiado por inteligencia (TaHiTI 2.0: proceso, hipótesis, resultados, micro hunts, métricas) | Complementario | +16 → 27 min |
| s1m3 · Sliding Scale | Remisión a la cápsula de hunting de s5m5 | Complementario | +1 → 14 min |

El bloque de infostealers permanece en s4m4, conectado al clustering. No se crea
un módulo adicional: mantiene las unidades de progreso y convalidación y permite
estudiar el complemento desde la propia S4. Total añadido estimado: 189 minutos,
80 en Security+ y 109 en GCTI.

Se añaden 24 flashcards (8 Security+, 16 GCTI) y 23 términos (9 Security+,
14 GCTI). Las tarjetas profesionales llevan «Complementary» y los bloques de
lección «Ampliación práctica complementaria». Los dos checkpoints elementales
nuevos son base; los 14 profesionales son opcionales, no otorgan XP ni bloquean
completar la lección. El inglés se conserva en tarjetas y preguntas base, y las
decisiones profesionales se practican en español.

## Compatibilidad y organización

- Contenido estructurado en `src/data/practical/`, compuesto desde `tracks.ts`.
- IDs existentes, orden de módulos, índices originales de `?block=`, IDs de
  preguntas y enlaces conservados. Las correcciones de exactitud mantienen IDs.
- No se añaden preguntas avanzadas a bancos de quiz, bosses, simulacros o pruebas
  de nivel. Pesos y 120 preguntas de nivel conservados.
- No cambia la estructura del estado, su migración, las claves de localStorage,
  los IDs de labs, la sincronización ni los datos guardados.
- Las lecciones ya completadas continúan completadas. Para nuevas lecturas se
  requieren únicamente checkpoints base; las ampliaciones opcionales se pueden
  estudiar sin ganar ni consumir progreso de certificación.
- La búsqueda indexa los nuevos bloques y enlaza al bloque correspondiente.
  Los enlaces cruzados usan el cambio de track ya existente.
- Los vídeos publicados de s3m2 (02:02) y sp4m8 (01:35) conservan su audio y
  enlaces. Sus simplificaciones sobre similitud/PDB y corte de sesiones tienen
  aclaración junto al vídeo y al inicio de la transcripción, sin alterar las
  palabras registradas del audio ni añadir índices de bloque intermedios.

## Laboratorio YARA reproducible

YARA Forge (lab3b) conserva su motor de simulación por etiquetas y su progreso,
con avisos y resultados reformulados para evitar afirmar compilación, ejecución
real o calidad de producción. Su botón es «Evaluar simulación».

En s3m5, el editor permite escribir libremente y descargar `mi-regla.yar`. No
ejecuta el texto ni lo envía a servicios. El borrador se guarda localmente en este
dispositivo, separado del perfil sincronizado. La solución desplegable importa el mismo archivo
`reference.yar` que usa el verificador.

El ZIP distribuido contiene 18 archivos: cinco fuentes/instrucciones, doce
fixtures inertes y un manifiesto con hashes, particiones y expectativas. Formato
inventado ALRTDEMO, sin cabecera ejecutable ni comportamiento. Seis ejemplos de
diseño, cinco de validación y uno que expone un límite. Son públicos y no son una
prueba ciega. La regla Family cubre A/B/C; Sample solo A; Hunt incluye además los
controles de un rasgo. Las reglas no acreditan detección de malware real.

Preparación local del motor, aislada del runtime de la web:

```powershell
python -m venv .venv-yara
.venv-yara\Scripts\python.exe -m pip install -r public/labs/yara-practice/requirements.txt
.venv-yara\Scripts\python.exe -X utf8 public/labs/yara-practice/verify.py
.venv-yara\Scripts\python.exe -X utf8 scripts/test-yara-practice.py
python scripts/package-yara-practice.py --check
npm test
npm run build
```

En macOS/Linux se usa `.venv-yara/bin/python`. El alumno puede seguir el README
del ZIP para trabajar fuera del repositorio. Para verificar su regla:

```text
python verify.py --rule mi-regla.yar --name MiRegla
```

El verificador usa libyara mediante `yara-python==4.5.4`, compila sin includes,
falla ante advertencias y aplica un timeout por archivo. Compara conjuntos
exactos de coincidencias, incluidos negativos. Sale con 0 si las expectativas
coinciden, 1 si hay discrepancias y 2 ante error de compilación/ejecución.

`future-uncovered.dat` es un FN conocido si el objetivo incluye v2. Los archivos
grandes también quedan fuera de cobertura; no se ocultan como éxitos de
detección. Un resultado «12/12» mide conformidad con el contrato sintético v1,
incluidas no coincidencias; no significa 100% de sensibilidad de una familia.

Para regenerar el ZIP tras cambiar fuentes o fixtures:
`python scripts/package-yara-practice.py`. `--check` detecta si el paquete está
desactualizado. No se incluye el entorno Python en el build.

## Laboratorio de Suricata (sp4m7)

Revisión: 30 de octubre de 2026. Cuatro misiones sobre una captura ficticia de Halden
(16 conexiones: d1–d7 DNS, h1–h5 HTTP, t1–t4 TLS con SNI; dominios `.example` y
direcciones RFC 5737), con un solo `local.rules` acumulativo:

1. DNS al dominio y sus subdominios, sin los parecidos. Errores que enseña: resolver
   interno fuera de `$EXTERNAL_NET`, mayúsculas, `endswith` sin `dotprefix`.
2. POST a `/collect-demo` en un puerto no estándar y sin Host, sin GET, imagen ni API.
3. El mismo envío por HTTPS: solo el SNI es visible.
4. Sensor en línea: `drop` del canal TLS, DNS y HTTP en alerta, `pass` acotado para el
   servidor de enriquecimiento del SOC (d7).

En la web, `src/lib/suricataSim.ts` evalúa un subconjunto del lenguaje (dns.query,
http.method, http.uri, http.host, tls.sni; content con nocase, startswith, endswith y
negación; dotprefix; flow; direcciones, listas, CIDR y puertos; alert, drop, reject,
pass con el orden de acciones por defecto). Lo que queda fuera se marca como «Fuera del
simulador», no se adivina. Los intentos se guardan en el cuaderno local
`sp4m7/suricata/v1`; no dan XP ni cuentan para la lección.

Paridad con el motor real: `scripts/suricata-parity-cases.rules` (99 casos: aciertos,
errores de carga, IDS/IPS, `pass`, `reject`, reglas duplicadas) se ejecuta con
`python scripts/suricata-parity.py`, que escribe una grabación por versión mayor:
`src/data/suricata-parity-7.json` (Suricata 7.0.3, Ubuntu 24.04) y
`src/data/suricata-parity-8.json` (8.0.8, ppa:oisf/suricata-stable, grabada el
31-10-2026 en el equipo de Lidia y traída con `--digest` / `--from-digest`, que comprueba
el SHA-256 del archivo completo). `suricataSim.test.ts` exige, donde las dos versiones
coinciden, las mismas alertas y las mismas líneas con error, y que el simulador solo
declare «fuera del simulador» líneas que Suricata también rechaza; donde no coinciden,
que el simulador lo avise en vez de elegir una. `--check` detecta una grabación
desactualizada para la versión instalada.
Hallazgos del motor que el texto recoge: `flow:established` nunca coincide con una
consulta DNS por UDP; `http.host` rechaza content con mayúsculas y `nocase`; `reject`
sale `blocked` también fuera de línea; una regla `alert` sobre un paquete descartado
sigue saliendo `allowed`. Única diferencia entre versiones: una alerta `http`/`tls` sin
buffer con `flow:established` y dirección (`to_server` o `from_client`) casa con cada
petición en la 7 y con ninguna en la 8; el mismo `pass` se comporta igual en ambas.
El paquete de la OISF deja `/etc/suricata` solo para root y el grupo `suricata`:
`verify.py` y el README del ZIP explican el «Permission denied» y su arreglo.

El ZIP (`scripts/package-suricata-practice.py`, `--check`) trae la captura, `corpus.json`,
`missions.json`, `reference.rules`, `make_pcap.py` (solo biblioteca estándar, salida
byte a byte reproducible) y `verify.py`, que ejecuta Suricata real con `-r`, fija
HOME_NET/EXTERNAL_NET con `--set`, usa `--simulate-ips` para la misión 4 y sale con 0, 1
o 2 como el verificador de YARA. Regenerar el ZIP tras cambiar cualquiera de esos seis
archivos, y la grabación de paridad tras cambiar la captura o los casos.

## Fuentes primarias consultadas

Consulta técnica: 19-10-2026. Las consultas de VirusTotal son ilustrativas: se
contrastó la sintaxis, sin ejecutarlas con cuentas ni prometer disponibilidad.
Los detalles del producto pueden cambiar; registrar fecha al repetir prácticas.

- [Microsoft Graph: conceptos de autenticación y autorización](https://learn.microsoft.com/en-us/graph/auth/auth-concepts).
- [Access tokens: audiencia, validación y vigencia](https://learn.microsoft.com/en-us/entra/identity-platform/access-tokens).
- [Refresh tokens: renovación y tabla de revocación](https://learn.microsoft.com/en-us/entra/identity-platform/refresh-tokens).
- [ID tokens y OIDC](https://learn.microsoft.com/en-us/entra/identity-platform/id-tokens).
- [Scopes OIDC y offline_access](https://learn.microsoft.com/en-us/entra/identity-platform/scopes-oidc).
- [Graph: listar mensajes y permisos](https://learn.microsoft.com/en-us/graph/api/user-list-messages?view=graph-rest-1.0).
- [Revocar acceso de emergencia y sesiones de aplicaciones](https://learn.microsoft.com/en-us/entra/identity/users/users-revoke-access).
- [revokeSignInSessions: alcance y retraso](https://learn.microsoft.com/en-us/graph/api/user-revokesigninsessions).
- [Evaluación continua del acceso](https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-continuous-access-evaluation).
- [VirusTotal: búsqueda por hash](https://docs.virustotal.com/docs/searching).
- [Modificadores de búsqueda de archivos](https://docs.virustotal.com/docs/file-search-modifiers): imphash, similar-to, ssdeep, content, metadata, signature y contacted_ip.
- [Similitud de archivos](https://docs.virustotal.com/docs/file-similarity-search).
- [Relaciones entre archivos y objetos](https://docs.virustotal.com/reference/files-relationships).
- [YARA: sintaxis de reglas](https://yara.readthedocs.io/en/stable/writingrules.html).
- [YARA: módulo PE e is_pe](https://yara.readthedocs.io/en/stable/modules/pe.html).
- [YARA: motor Python](https://yara.readthedocs.io/en/stable/yarapython.html).
- [Suricata: formato de reglas](https://docs.suricata.io/en/latest/rules/intro.html), [transformaciones](https://docs.suricata.io/en/latest/rules/transforms.html), [EVE JSON](https://docs.suricata.io/en/latest/output/eve/eve-json-format.html) y [modo IPS inline](https://docs.suricata.io/en/latest/setting-up-ipsinline-for-linux.html). Las reglas y la alerta EVE de sp4m7 se comprobaron el 30-10-2026 con Suricata 7.0.3 (`-T` y `-r` sobre capturas sintéticas de DNS, HTTP en el puerto 8081 y TLS con SNI): dotprefix + endswith coincide con el dominio y sus subdominios y no con evilharbor-sync.example, y una regla drop sobre una captura da `"action": "allowed"`.
- [FI-ISAC NL: TaHiTI Threat Hunting Methodology v2.0](https://www.nvb.nl/media/vw3iwzhb/tahiti-threat-hunting-methodology_v20.pdf) (octubre de 2026, CC BY 4.0), base de la cápsula de hunting de s5m5; resumen propio en español.

La comparación de feeds y el dataset de infostealers son ejercicios originales,
sin proveedores o familias reales ni rankings que pretendan vigencia permanente.

## Itinerario corto

1. **Identidad y defensa — 35 min de material nuevo.** sp4m8 → sp2m6 → sp4m10.
   Explica el flujo de Ana y decide qué debe contenerse y revocarse.
2. **Fuentes — 25 min.** s3m1 → s3m4 → s4m2. Elige un feed para R1 y para R2,
   y sigue las citas para no contar el mismo hecho varias veces.
3. **Investigación — 23 min.** s3m2 → s3m3. Justifica B, C, D y E y redacta una
   conclusión con alternativas y confianza.
4. **Detección y entrega — 38 min.** s3m5 → lab3b como simulación opcional → s5m3.
   Escribe la regla, pruébala con el motor real y adjunta límites a su entrega.
   El tiempo del lab guiado se suma si también lo completas.
5. **Prioridad analítica — 20 min.** s4m4 → s5m5. Ordena por diferentes unidades
   y explica por qué la prioridad para Meridian depende del requisito.

Los tiempos son orientativos y presuponen las bases de las lecciones. El curso
completo sigue disponible para quien necesite estudiarlas desde el principio.

## Guiones de vídeo de estas ampliaciones

La tanda [AP01–AP07](superpowers/plans/2026-10-19-videos-ampliaciones/README.md)
contiene siete guiones completos, con hoja de grabación, versión Voice Studio y
ficha visual. Cubre las doce lecciones de este mapa mediante casos narrativos,
dos decisiones por episodio y tarjetas de práctica complementaria. La preparación
editorial queda separada de la grabación y el montaje audiovisual.
