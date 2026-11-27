# ◆ Alertópolis — Preparación GCTI · Security+

*Antes IntelForge Academy. Las claves de guardado del navegador (`intelforge-v1`, `intelforge-sync`) conservan el nombre antiguo a propósito, para no perder el progreso.*

Curso web interactivo y gamificado con **dos tracks** de certificación y una tercera pista de
redes y normativa para la administración pública, que comparten el mismo motor (XP, rachas, flashcards SM-2, bosses, simulacros):

| Track | Certificación | Estado |
|---|---|---|
| **CTI · GCTI** | GIAC GCTI (asociada a SANS FOR578: Cyber Threat Intelligence) | Completo: 27 lecciones, 174 preguntas, 12 labs, 102 flashcards, prueba de nivel y ampliaciones prácticas |
| **Security+** | CompTIA Security+ (SY0-701) | **Completo: los 5 dominios** — 41 lecciones + exam prep, 308 preguntas, 135 checkpoints base + 2 complementarios, 15 labs, 163 flashcards, 246 términos |
| **Redes y ENS** | Temarios TIC de la administración pública (sin certificación asociada) | **En construcción:** bloques 1 (redes de comunicaciones), 3 (servicios de red) y 6 (ENS y normativa) — 17 lecciones, 136 preguntas, 8 labs, 108 flashcards, 282 términos con el catalán donde está confirmado y 5 supuestos |

**▶ En vivo: https://llopez-s.github.io/ticourse/** — se despliega solo en cada
push a `main` (GitHub Actions: tests → build → Pages).

**Identidad visual.** La misma que la del canal de YouTube `@Alertopolis`, *ciberseguridad en español, con
chispa*: el rombo cian con la baliza rosa (favicon), el logotipo ALERT·ÓPOLIS de la barra lateral y la ciudad
nocturna del Panel, donde cada ventana es un evento (gris = rutina, cian = dato, ámbar = aviso) y la baliza de
la torre es la alerta que importa. `public/apple-touch-icon.png` y `public/og-image.png` (la vista previa al
compartir el enlace) son el avatar y un recorte del banner del canal.

Cambia de track con el selector de la barra lateral. El progreso de lecciones,
quizzes, labs, bosses y cartas es independiente por track; XP, nivel, racha y
misiones diarias son un único perfil compartido.

> **Material no oficial e independiente.** Todo el contenido es original, escrito
> desde cero y mapeado a los temas *públicos* de cada temario. No reproduce
> material de SANS, GIAC ni CompTIA, y no está afiliado a ninguna de ellas.
> FOR578 y GCTI son marcas de sus respectivos propietarios; CompTIA y Security+
> son marcas de CompTIA, Inc.

## 🚀 Arrancar

```bash
npm install
npm run dev      # → http://localhost:5173
```

Producción: `npm run build` (salida estática en `dist/`). Se publica en **GitHub
Pages** desde `.github/workflows/deploy.yml`: cada push a `main` ejecuta los
tests, construye y despliega. El HashRouter evita reglas de reescritura en el
servidor. El build asume la ruta `/ticourse/`; para servir desde la raíz de un
dominio, usa `BASE_PATH=/ npm run build`.

Tu progreso se guarda **en el navegador** (`localStorage`): sin cuentas y sin
registro. Puedes resetearlo desde *Perfil → Zona de peligro*.

### 🔄 Sincronizar entre dispositivos (opcional)

Por defecto **no sale nada de tu navegador**. Si quieres seguir estudiando en
otro dispositivo, en *Perfil → Sincronización* escribe un código privado; con el
mismo código en el otro dispositivo, ambos combinan su progreso.

- El código **no se envía nunca**: tu navegador calcula un hash SHA-256 y solo
  manda ese hash. El servidor no ve el código y guarda únicamente tu progreso de
  estudio (lecciones, puntuaciones, XP, racha, flashcards). Sin nombre, sin
  correo.
- **Trátalo como una contraseña**: quien lo conozca puede leer y sobrescribir ese
  progreso. Usa el botón *Generar* en lugar de inventarte uno corto.
- La combinación **nunca resta**: las lecciones y labs completados se unen, y las
  mejores puntuaciones, el XP y la racha se quedan con el valor más alto, así que
  sincronizar en cualquier orden no puede perder lo que ya habías ganado.
- El almacenamiento es **eventualmente consistente**: al conectar por primera vez
  en un dispositivo nuevo, dale unos segundos y pulsa *Sincronizar ahora* otra
  vez si aún no ves tu progreso.

## 📚 Qué incluye

Todo el contenido está en español con la terminología en inglés del examen; las
preguntas de quiz y las flashcards van en inglés, como en el examen real.

| Pieza | CTI · GCTI | Security+ (SY0-701) |
|---|---|---|
| **Lecciones** | 27 | 41 + exam prep |
| **Preguntas de quiz** | 174 | 308 |
| **Checkpoints en lección** | base + 12 complementarios opcionales | 135 base + 2 complementarios opcionales |
| **Labs interactivos** | 12 | 15 |
| **Flashcards (SM-2)** | 102 | 163 |
| **Glosario** | 113 términos | 246 términos |
| **Boss battles** | 5 | 5 |
| **Prueba de nivel** | 5 bloques · 60 preguntas | 5 bloques · 60 preguntas |

Las cifras de Security+ son solo del SY0-701. Además, la sección opcional SY0-801
(ver más abajo) añade 7 lecciones, 73 tarjetas y 102 términos, que no figuran
en la tabla.

- **Labs GCTI**: kill chain mapping, Diamond, Courses of Action, Pivot Hunt
  (grafo de infraestructura), YARA Forge, CMF, caza de sesgos, matriz ACH,
  calibración ICD 203, Report Forge.
- **Labs Security+**: matriz de controles, flujo de cambios, criptografía,
  actores de amenaza, triaje de vectores, mitigaciones, zonas de red, protección
  de datos, escalera de continuidad, caza en logs, respuesta a incidentes,
  triaje de vulnerabilidades, documentos de gobernanza, acuerdos con
  proveedores y cálculo de riesgo (SLE/ALE).
- **Examen de práctica**: cronometrado, sin feedback hasta el final, con
  muestreo por dominio (los pesos **oficiales** 12/22/18/28/20 en Security+),
  desglose de resultados por dominio e historial.
- **Prueba de nivel** (los dos tracks, opcional): un bloque de 12 preguntas
  propias por sección, nunca repetidas del temario. Supera el 80% y puedes convalidar
  la teoría de esa sección entera de un golpe — los labs y el boss siguen
  esperándote igual, nunca se dan por hechos. Es totalmente reversible: puedes
  anular una convalidación cuando quieras desde el perfil o desde la propia
  sección.

## Ampliaciones prácticas de identidad y CTI

Doce lecciones incorporan material nuevo: identidad, OAuth y sesiones (sp4m8),
infostealers y respuesta (sp2m6/sp4m10), evaluación de feeds (s3m1), pivoting
desde muestras (s3m2/s3m3), reporting e independencia de fuentes (s3m4/s4m2),
escritura y entrega de YARA (s3m5/s5m3), y métricas de infostealers en S4
(s4m4, conectada con s5m5). Incluyen casos resueltos, decisiones explicadas,
enlaces oficiales, objetivos y tiempos actualizados.

Los fundamentos de identidad y respuesta defensiva son base. Los detalles
Microsoft y las prácticas profesionales se identifican como **complementarios**:
sus checkpoints son opcionales y no se incorporan a simulacros, bosses ni pruebas
de nivel. Se conservan IDs, pesos, enlaces y progreso guardado.

**YARA Forge es una simulación por etiquetas.** La práctica de escritura libre
de s3m5 incorpora editor, descarga del borrador y un ZIP con corpus sintético
inerte, tres reglas de referencia y un verificador con YARA real. El navegador
no compila ni ejecuta las reglas. No se necesitan muestras maliciosas ni cuentas.

### Laboratorios: práctica guiada y retos

Los 27 labs incluyen objetivos, lecciones de apoyo, autoguardado local, exportación
del trabajo y un resumen que conserva el primer resultado y las correcciones.
Puedes reanudar al volver o empezar otro intento; se conservan hasta diez
intentos anteriores por laboratorio y caso. El editor YARA también conserva su
borrador en este dispositivo.

**Pivot Hunt, Report Forge y Log Hunt** añaden «Reto práctico · opcional», con dos
casos originales cada uno (20–30 minutos): investigación con presupuesto y citas,
informe escrito, y correlación de 32 registros con filtros y cronología editable.
Los checks corrigen datos verificables; el texto se revisa con una rúbrica de
autoevaluación y una solución comentada. «Entregado» no equivale a dominio
acreditado. Los retos no otorgan XP ni alteran el progreso de certificación.

**Borradores e historial solo se guardan en este navegador y dispositivo.** No
forman parte de la sincronización del perfil. Descarga el JSON del trabajo o la
entrega Markdown del reto para conservar una copia. Los casos son públicos y
sintéticos: sus variantes sirven para practicar, no como evaluación ciega.

Consulta la [guía de laboratorios](docs/laboratories.md).

Consulta el [mapa, las fuentes y el itinerario de 5 sesiones](docs/practical-curriculum.md)
y los [resultados de verificación](docs/reviews/2026-10-19-practical-curriculum.md).

## Novedades del SY0-801 (sección opcional de Security+)

CompTIA prepara el SY0-801 (Security+ V8), con lanzamiento previsto hacia el
17 de noviembre de 2026. Quien estudia aquí se prepara para el SY0-701, pero
puede querer ver qué añade el examen nuevo. La sección **S7 · SY0-801** reúne
7 lecciones (unas 2,4 horas), 73 tarjetas y 102 términos de glosario: el mapa
701 → 801, un bloque nuevo de IA (riesgos y ataques, e IA en las operaciones),
vectores e indicadores nuevos, código, repositorios y credenciales, arquitectura
y datos, y operaciones y gobierno.

Es **opcional y queda fuera de todo cálculo del 701**: no entra en el simulacro,
la prueba de nivel, los bosses, la campaña ni la preparación por dominio, y el
botón «Continuar» del panel nunca lleva a ella. Sus comprobaciones son opcionales
y no dan XP; leer una lección sí cuenta como lección. Se basa en el borrador de
objetivos v2.0 (previo al lanzamiento), que puede cambiar: tras el lanzamiento
conviene contrastarla con los objetivos finales. Diseño y plan en
`docs/superpowers/specs/2026-10-20-sy0-801-novedades-design.md` y
`docs/superpowers/plans/2026-10-21-sy0-801-novedades.md`.

## Redes y ENS (tercera pista, en construcción)

Pista para temarios de técnico/a TIC de la administración pública: redes, servicios de red,
infraestructuras, identidad corporativa y Esquema Nacional de Seguridad. **Material no oficial**: no está
afiliado a ninguna administración ni tribunal de selección y no sustituye a las bases de ninguna convocatoria.

- **Disponible:** bloque 1, *Redes de comunicaciones* (`op1`): modelos OSI y TCP/IP, direccionamiento IPv4 e
  IPv6 con cálculo de subredes, conmutación y VLAN 802.1Q, encaminamiento (estático, OSPF, BGP, VRRP) y
  arquitecturas WAN y WLAN. Dos labs: reparto VLSM y el recorrido de un paquete entre dos VLAN.
- **Disponible:** bloque 2, *Infraestructuras de comunicaciones* (`op2`, 2026-11-27): 5 lecciones (redes corporativas:
  diseño jerárquico, campus y CPD; VPN IPsec e IKEv2; acceso remoto y confianza cero; SD-WAN; conectividad entre centros:
  VPN MPLS de capa 3 y de capa 2, y la Red SARA), 40 preguntas, 28 checkpoints, 30 flashcards, 65 términos de glosario y
  tres labs (ordenar el arranque de IKEv2 con NAT-T, clasificar formas de unir sedes y decisiones de acceso remoto). Jefe:
  TÚNEL APAGADO / EL RESPALDO QUE NADIE PROBÓ. Dos supuestos: *Teletrabajar sin abrir la puerta* y *La excavadora y el
  túnel*. Fuentes: RFC (IKEv1 es histórico por la RFC 9395; la 9329 deja obsoleta la 8229; SD-WAN tiene la RFC 10090),
  NIST SP 800-207, 800-77r1 y 800-46r2, MEF 70.2 (hoy Mplify), la Red SARA en el PAe, el Real Decreto 4/2010 y su NTI.
- **Disponible:** bloque 3, *Servicios de red* (`op3`, 2026-11-26): 5 lecciones (DNS: cómo funciona, DNS en la
  organización, DHCP, NTP y la hora, servicios de conectividad), 40 preguntas, 26 checkpoints, 30 flashcards, 67
  términos de glosario y tres labs (ordenar el intercambio DORA con relay, clasificar registros DNS y clasificar averías
  por servicio). Jefe: NOMBRE EQUIVOCADO / EL RELOJ QUE ADELANTA. Dos supuestos: *El edificio anexo de la sede* y
  *Un lunes sin hora ni nombres*. Las fuentes son RFC (rfc-editor.org, IANA); DHCPv6 es la RFC 9915, que deja obsoleta
  la 8415, el failover de DHCPv4 y WPAD son borradores caducados y los valores de Microsoft e ISC se rotulan como tales
  (dossier en `docs/superpowers/sources/`).
- **Disponible:** bloque 4, *Balanceo y alta disponibilidad* (`op4`, 2026-11-27): 5 lecciones (alta disponibilidad:
  conceptos y cálculo; balanceo en capa 4; balanceo en capa 7 y persistencia de sesión; comprobaciones de salud;
  descarga de TLS y publicación de aplicaciones), 40 preguntas, 27 checkpoints, 30 flashcards, 59 términos de glosario
  y tres labs (¿capa 4 o capa 7?, ordenar la caída y la vuelta de un servidor, persistencia y modo de TLS). Jefe: SESIÓN
  PERDIDA / EL NODO QUE MIENTE. Dos supuestos: *El registro, sin una sola caída* y *El último día de plazo*. Fuentes:
  RFC (TLS 1.3 es ya la RFC 9846, ECH la 9849 y VRRP la 9568) y documentación oficial de HAProxy, NGINX, AWS y
  Microsoft, rotulada como valor del fabricante, porque casi nada del balanceo está normalizado.
- **Disponible:** bloque 6, *ENS y normativa* (`op6`, 2026-11-26): 7 lecciones (marco del ENS y roles,
  categorización, medidas del anexo II, conformidad, auditoría e incidentes, protección de datos RGPD/LOPDGDD,
  gobierno de la seguridad, firma e identificación electrónicas eIDAS), 56 preguntas con nivel de artículo y anexo,
  37 checkpoints, 48 flashcards, 104 términos de glosario y tres labs de clasificar (categorías, a quién se
  notifica, medidas del anexo II). Jefe: PAPEL MOJADO / EL CUMPLIMIENTO DE FACHADA. Toda la normativa sale de textos
  consolidados del BOE y EUR-Lex consultados el 2026-11-26 (dossier en `docs/superpowers/sources/`); NIS2 estaba
  pendiente de transposición a esa fecha y de las guías CCN-STIC no se afirma contenido alguno.
- **Pendiente:** identidad corporativa.
- A diferencia de las otras dos pistas, **todo está en español**, también las preguntas. El glosario añade el
  término en catalán (`cat.`) cuando está confirmado en TERMCAT o en la Viquipèdia, y se puede buscar por él.
- Lo que ya enseña Security+ (seguridad wifi, 802.1X, VPN) no se repite: las lecciones lo enlazan.
- **Supuestos prácticos**: casos con expediente de documentos y 4–6 fases encadenadas (cálculo, tablas, citar
  documentos, ordenar, redactar), en modo práctica o simulacro con reloj y nota sobre 10. Hay cinco:
  *La oficina comarcal nueva*, *El edificio anexo de la sede*, *Un lunes sin hora ni nombres*, *La sede electrónica del Consorcio* y *El cifrado del registro de entrada*. Guía para escribirlos: `docs/supuestos.md`.
- No tiene prueba de nivel y solo un logro propio, el de los supuestos (`sup-first-exam`). El simulacro reparte las preguntas entre los seis dominios
  del temario (*Redes de comunicaciones*, *Infraestructuras de comunicaciones*, *Servicios de red*, *Balanceo y alta
  disponibilidad*, *Identidad corporativa*, *ENS y normativa*) con pesos iguales (1/6); no existen pesos oficiales.

## 🎮 Gamificación

- **Apuestas de confianza** ⭐: cada respuesta se apuesta a confianza
  *Possible / Likely / Almost certain* (+5/0 · +10/−5 · +20/−15 XP). Tu
  precisión por nivel de confianza se registra en el Perfil — es entrenamiento
  directo del **lenguaje estimativo ICD 203**, la habilidad central del examen.
- **XP, niveles y 7 rangos** de analista: Trainee → … → CTI Director.
- **Campaña narrativa "Operación VELVET CICADA"**: eres la primera analista CTI
  de Meridian Dynamics; 5 labs son misiones y cada boss derrotado desbloquea un
  fragmento del dossier del caso.
- **Boss battles**: quiz cronometrado de 12 preguntas al final de cada sección
  (≥80% para vencer) con barra de vida del adversario. Recompensa: +200 XP y un
  *streak freeze*.
- **Racha diaria** con freezes, heatmap de actividad de 28 días.
- **Misiones diarias** rotatorias (3/día + bonus por completarlas todas).
- **29 logros** (23 generales + 3 de Security+ + 2 de la prueba de nivel + 1 de supuestos) y medidor de
  **exam readiness** por sección.
- **Campaña "Operación GLASS HARBOR"** en el track Security+: eres la primera
  analista de seguridad de la Autoridad Portuaria de Halden; 5 misiones y 5
  bosses (NULL CIPHER → RED MARROW → BLIND ARCHITECT → SILENT PAGER → PAPER
  GOVERNOR).

## 🗺️ Itinerario sugerido

**GCTI**
1. Secciones S1→S5 en orden: lecciones → quiz de cada lección → labs → boss.
2. Flashcards **todos los días** (es lo que mantiene la racha y la memoria).
3. S6: estrategia open-book + imprime el glosario como índice.
4. Simulacros de examen hasta superar el **85%** de forma estable
   (el corte real del GCTI ronda el 71% — verifica los datos vigentes en giac.org).

**Security+ (SY0-701)**
1. S1 Conceptos generales (12%): 7 lecciones → quizzes → 3 labs → boss NULL CIPHER.
2. S2 Amenazas, vulnerabilidades y mitigaciones (22%): 8 lecciones → quizzes → 3 labs → boss RED MARROW.
3. S3 Arquitectura de seguridad (18%): 7 lecciones → quizzes → 3 labs → boss BLIND ARCHITECT.
4. S4 Operaciones de seguridad (28%, el dominio más grande): 11 lecciones → quizzes → 3 labs → boss SILENT PAGER.
5. S5 Gestión y supervisión del programa (20%): 8 lecciones → quizzes → 3 labs → boss PAPER GOVERNOR.
6. S6: formato del examen y estrategia con PBQs.
7. Tres simulacros independientes de 90 elementos en 90 minutos, con PBQs y selección múltiple. El objetivo interno es 85% global y 80% por dominio y práctico; no equivale a puntos del examen oficial. Consulta los criterios de preparación del recorrido.

## 🧪 Tests

```bash
npm test         # vitest: integridad de contenido, muestreo de examen, migración del store
```

## 🛠️ Stack

Vite 7 · React 19 · TypeScript (strict) · Tailwind CSS 4 · Zustand (persist) ·
react-router 7 (HashRouter). El curso funciona **sin backend**; la sincronización
opcional usa un Worker de Cloudflare de ~100 líneas (`worker/`) que solo guarda
un blob de progreso por hash de código.

```
src/
  lib/         motor: tipos, XP/rangos, SRS SM-2, store persistente (v3, con track activo y prueba de nivel), markdown-lite
  data/        tracks.ts (registro de tracks), course.ts (helpers), course-gcti.ts + s1–s6 (GCTI),
               secplus/ (sections, sp1–sp6 en ficheros spN-partK, cards, glossary, labs por dominio),
               labs, achievements, quests
  components/  Layout (selector de track), Toasts, BlockRenderer, QuizEngine, labs/ (8 motores)
  pages/       Dashboard, Section, Module, Quiz, Lab, Boss, Exam, Cards, Glossary, Achievements, Profile
```

## Security+ desde cero: recorrido con vídeos

En el selector Security+, abre **Recorrido con vídeos** (`#/security/study`). Incluye un itinerario de 24 semanas a 5–6 horas semanales, doce fundamentos y cuatro prácticas iniciales; 52 vídeos localizados, de los cuales 45 están integrados con prerrequisitos, capítulos y dos actividades posteriores; un mapa de 28 objetivos y casos de aplicación; doce prácticas de seis familias y tres simulacros independientes de 90 elementos.

El panel separa **progreso de estudio** y **evidencias de preparación**. Repetir, consultar ayudas o importar intentos sirve para practicar y no genera evidencia nueva. Las notas internas no se convierten a puntos CompTIA. Los nuevos cuadernos son locales y exportables; la sincronización general y el progreso GCTI se conservan.

[Guía del recorrido y verificación](docs/security-learning.md). [Protocolo del piloto voluntario, pendiente de ejecución](docs/security-learning-pilot.md).
