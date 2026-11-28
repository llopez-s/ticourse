# Vídeos de la pista «Redes y ENS» · bloques op2, op3, op4 y op6

> Diseño corto del 2026-11-28. Lidia pidió «prepara los guiones de los vídeos que faltan». Amplía el diseño del
> bloque 1 (`2026-11-24-redes-videos-casos-test-design.md`), cuyas reglas siguen valiendo: formato «casos con test»,
> todo en español, rótulo «pregunta tipo test · ejemplo», nunca «como en el examen», direcciones completas solo en
> pantalla, voz de Lidia a tempo 1, música «Go On Going - Stayloose.mp3», revisor de exactitud y de naturalidad.
> Lo marcado *(propuesta de Claude)* no lo ha dicho ella: lo aprueba o lo cambia al leer esto.

## 1. Qué falta

Las 22 lecciones publicadas de op2 (Infraestructuras), op3 (Servicios de red), op4 (Balanceo) y op6 (ENS y
normativa) no tienen vídeo ni guion. op5 (Identidad) aún no tiene lecciones y queda fuera.

## 2. Los 22 vídeos *(propuesta de Claude)*

Cápsula = `caso-yt` (240–330 s, 3 preguntas, 3–5 tarjetas). Principal = `caso-principal-yt` (420–600 s, 4–5
preguntas, 5–8 tarjetas). Principal solo donde la lección tiene más de tres confusiones que pesan.

| Lección | Carpeta | Tamaño | Plaquita | Lo que se confunde y el vídeo aclara |
|---|---|---|---|---|
| op2m1 Redes corporativas | `campus-arcedo` | cápsula | Infraestructuras | acceso, distribución y núcleo, y qué hace cada capa · dominio de fallo: qué cae con un aparato · sobresuscripción |
| op2m2 VPN IPsec | `ipsec-arcedo` | principal | Infraestructuras | SA, SPI y por qué hay dos · AH frente a ESP, transporte frente a túnel · IKEv2 y el NAT (UDP 4500) · reclave y PFS · MTU y MSS del túnel |
| op2m3 Acceso remoto | `remoto-arcedo` | cápsula | Infraestructuras | túnel completo frente a dividido · postura del equipo · confianza cero (SP 800-207): PDP/PEP · bastión y pasarela de escritorio remoto |
| op2m4 SD-WAN | `sdwan-arcedo` | cápsula | Infraestructuras | superposición frente a subyacente · edge, controlador y orquestador · camino elegido por aplicación · SASE/SSE son términos de analista |
| op2m5 VPN MPLS y Red SARA | `mpls-sara-arcedo` | principal | Infraestructuras | CE, PE y P · VRF, RD y Route Target · las dos etiquetas · VPLS/EVPN cuando se quiere capa 2 · qué es la Red SARA |
| op3m1 DNS: cómo funciona | `dns-arcedo` | cápsula | Servicios de red | recursiva frente a iterativa · caché, TTL y la caché negativa · primario, secundarios y transferencia de zona (UDP y TCP 53) |
| op3m2 DNS en la organización | `dns-ad-arcedo` | cápsula | Servicios de red | DNS interno frente a externo · registros SRV de Active Directory · DNSSEC firma pero no cifra; DoT/DoH cifran |
| op3m3 DHCP | `dhcp-arcedo` | principal | Servicios de red | DORA · T1 y T2 · el relay y giaddr · conmutación por error · SLAAC, flags M y O y DHCPv6 · snooping |
| op3m4 NTP y la hora | `hora-arcedo` | cápsula | Servicios de red | estratos · desfase y retardo con las cuatro marcas · la jerarquía de hora de la organización (canon §7c) |
| op3m5 Proxies, PAC/WPAD, IPAM y 802.1X | `proxy-arcedo` | cápsula | Servicios de red | proxy, gateway y túnel · cómo encuentra el navegador el proxy (PAC/WPAD y su riesgo) · 802.1X: suplicante, autenticador y RADIUS |
| op4m1 Alta disponibilidad | `nueves-arcedo` | principal | Balanceo | los «nueves» en minutos · MTBF y MTTR · serie frente a paralelo (cálculo) · quórum, testigo y cerebro dividido |
| op4m2 Balanceo en capa 4 | `capa4-arcedo` | cápsula | Balanceo | VIP, grupo y miembros · algoritmos · modos de reenvío: qué se reescribe y por dónde vuelve la respuesta |
| op4m3 Capa 7 y persistencia | `capa7-arcedo` | cápsula | Balanceo | qué ve la capa 7 · quién era el cliente (Forwarded, X-Forwarded-For, protocolo PROXY) · persistencia y lo que no salva |
| op4m4 Comprobaciones de salud | `salud-arcedo` | cápsula | Balanceo | niveles L3/L4/L7 · intervalo y umbrales: cuánto tarda en sacar un miembro · drenaje · comprobaciones que mienten |
| op4m5 Descarga de TLS y publicación | `tls-arcedo` | cápsula | Balanceo | terminar, recifrar o pasar el TLS · SNI y ALPN · TLS mutuo |
| op6m1 El ENS: marco y roles | `ens-arcedo` | principal | ENS y normativa | a quién se aplica · los principios básicos · política de seguridad · los cuatro responsables y su separación |
| op6m2 Categorizar un sistema | `categoria-arcedo` | principal | ENS y normativa | las cinco dimensiones · la regla del anexo I (la categoría la marca el nivel más alto) · quién valora y quién determina · Declaración de Aplicabilidad |
| op6m3 Las medidas del anexo II | `medidas-arcedo` | cápsula | ENS y normativa | marco organizativo, operacional y de protección · selección por categoría o por dimensión · compensatorias y complementarias |
| op6m4 Conformidad, auditoría e incidentes | `conformidad-arcedo` | cápsula | ENS y normativa | declarar o certificar · auditoría ordinaria y extraordinaria · notificar incidentes |
| op6m5 Protección de datos | `datos-arcedo` | principal | ENS y normativa | bases jurídicas de una administración · derechos · responsable y encargado · brechas y evaluación de impacto · DPD · a las administraciones no se las multa |
| op6m6 Gobierno de la seguridad | `gobierno-arcedo` | cápsula | ENS y normativa | política de seguridad y quién la aprueba · comité y roles · gestión de riesgos como proceso |
| op6m7 Firma e identificación electrónicas | `firma-arcedo` | cápsula | ENS y normativa | firma simple, avanzada y cualificada · sello y sistemas de identificación · eIDAS |

Cada fila es una propuesta: el escritor la ajusta tras leer la lección y lo justifica en la ficha.

## 3. Reglas que se añaden *(propuesta de Claude)*

- **Mismo caso.** El Consorcio Provincial de Arcedo, con los datos de su registro (`canon/arcedo.md` §1–7e). Los
  datos nuevos que salgan en pantalla van a §8; los huecos y contradicciones, a §9.
- **Hechos de la lección y del dosier del bloque** (`docs/superpowers/sources/2026-11-2*-opN-fuentes.md`), nunca de
  memoria. En op6, artículos, anexos y cifras salen del texto del BOE que cita la lección; si el vídeo afirma algo que
  la lección no trae, el revisor lo comprueba contra la fuente primaria. Números de RFC vigentes (9915, 9846, 9568,
  10090…) tal como los da el dosier.
- **Preguntas nuevas** frente al cuestionario de la lección, sus checks y los supuestos del bloque.
- **Cálculos** (nueves, serie/paralelo, MSS, T1/T2, desfase NTP, tiempos de las comprobaciones de salud) comprobados
  con un script.
- **Variedad entre vídeos del bloque**: ganchos, entradas de pregunta y cierres distintos.
- **Pronunciaciones nuevas** de siglas (IKE, SPI, PFS, SRV, DoH, PTP, VIP, SNI, ALPN, DPD…) quedan como pregunta
  abierta en la ficha; no se inventan entradas de léxico salvo las ya conocidas.

## 4. Orden

1. Este diseño. 2. Bloque op2 completo como piloto (fichas, guiones, revisión de exactitud, de naturalidad, segunda
pasada de exactitud sobre los arreglos). 3. op3, op4 y op6 con lo aprendido. 4. Una rama y un PR, sin congelar
(hojas «BORRADOR»). Escenas, grabación y render quedan fuera.
