# Pista «Redes y ENS» · Bloque 1: Redes de comunicaciones (`op1`)

Fecha: 2026-11-24. Tercera pista de Alertópolis (`TrackId` `opo`), pensada para temarios de
técnico/a TIC de la administración pública (redes, servicios de red, ENS). Material no oficial.
Este plan cubre el motor mínimo y el primer bloque; los bloques 2–5 tendrán su propio plan.

## Pista

| Bloque | Sección | Dominio (`Domain`) | Estado |
|---|---|---|---|
| 1 | `op1` | `Redes de comunicaciones` | este plan |
| 2 | `op2` | `ENS y normativa` | pendiente (fuente primaria: BOE, CCN-STIC) |
| 3 | `op3` | `Servicios de red y balanceo` | pendiente |
| 4 | `op4` | `Infraestructuras de comunicaciones` | pendiente |
| 5 | `op5` | `Identidad corporativa` | pendiente |

Solo se registra la sección `op1`; las demás se añaden cuando tengan contenido.

## Convenciones de ids (únicos en toda la app)

- Sección `op1`; lecciones `op1m1`…`op1m5`; preguntas `op1m1q1`…; tarjetas `fco101`…; labs `opl1a`, `opl1b`.
- Archivos en `src/data/opo/`: `op1-m1.ts`…`op1-m5.ts` (una lección por archivo, exporta
  `export const OP1_M1: Module = {...}`), `op1.ts` (agregador), `op1-cards.ts`
  (`OP1_FLASHCARDS`, `OP1_GLOSSARY`), `labs-op1.ts` (`OP1_LABS`, `OP1_CLASSIFY_DATA`, `OP1_ORDER_DATA`).

## Reglas de contenido (distintas de GCTI y Security+)

- **Todo en español**, también preguntas, checks y tarjetas: el examen real no es en inglés. Los
  nombres de protocolos y siglas se dejan en su forma habitual (VLAN, OSPF, trunk → «enlace troncal (trunk)»).
- Español natural, sin calcos del inglés. Evitar «switchear», «rutear»: «conmutar», «encaminar».
  Usar «conmutador (switch)», «encaminador (router)» en la primera aparición y después la forma corta.
- Nivel: oposición de técnico superior. Más profundidad que Security+: campos de cabecera, números
  concretos (rangos, puertos, distancias administrativas, tamaños), cálculo y diseño.
- Escenario para ejemplos: el **Consorcio Provincial de Arcedo** (ficticio): sede central, 3 oficinas
  comarcales, CPD propio. Redes de ejemplo 10.20.0.0/16; IPs públicas de documentación
  (192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24) e IPv6 2001:db8::/32. Nada de marcas ni organismos reales.
- Exactitud: solo hechos de estándares (RFC, IEEE 802). Si un dato depende del fabricante (p. ej.
  distancias administrativas, que son valores de Cisco), decirlo. Nada inventado ni «aproximado».
- No repetir lo que ya enseña Security+: enlazar con `{ t: 'links', title, items: [{ label, href: '/learn/sp3m5' }] }`.

## Forma de cada lección (`Module`, ver `src/lib/types.ts` y el modelo `src/data/secplus/sp3-part3.ts`)

- `sectionId: 'op1'`, `minutes` 14–18, 4–5 `objectives`.
- `blocks`: 16–22 bloques: párrafo de entrada, 3–4 `h`, al menos 2 `table`, al menos 1 `code`
  (salidas o cálculos sintéticos), 1 `callout` `kind: 'exam'` («Cómo cae en un examen») y 1
  `callout` `kind: 'example'` con el Consorcio de Arcedo, y **4 `check`** repartidos (4 opciones, `explain`).
- `quiz`: **8 preguntas** `domain: 'Redes de comunicaciones'`, 4 opciones, `explain` de 2–4 frases
  que dice por qué acierta la correcta y por qué tienta el distractor principal. Al menos 3 de
  las 8 son de aplicar (cálculo, lectura de una salida, elegir diseño), no de definición.
  La posición de la respuesta correcta varía (no siempre la misma letra).
- Negrita `**…**` para términos clave; código en línea con acento grave.

## Lecciones

1. **`op1m1` · Modelos OSI y TCP/IP: de la trama al segmento.** Siete capas OSI y cuatro de TCP/IP,
   PDU y encapsulación; Ethernet II (campos, MTU 1500, MAC 48 bits); ARP; cabecera IPv4 (TTL,
   protocolo, fragmentación); ICMP (echo, TTL excedido, destino inalcanzable; cómo funcionan ping y
   traceroute); TCP (handshake de tres vías, flags, números de secuencia, ventana, cierre) frente a
   UDP; puertos (bien conocidos 0–1023, registrados, efímeros).
2. **`op1m2` · Direccionamiento IPv4 e IPv6 y cálculo de subredes.** Notación CIDR, máscara, red,
   difusión y rango de hosts; VLSM con un ejemplo completo del Consorcio; superredes y resumen de
   rutas; rangos privados (RFC 1918), APIPA 169.254.0.0/16, loopback, CGNAT 100.64.0.0/10;
   NAT estático, dinámico y PAT; IPv6: 128 bits, abreviación, tipos (global unicast 2000::/3,
   link-local fe80::/10, ULA fc00::/7, multidifusión ff00::/8), sin difusión, NDP y SLAAC, EUI-64,
   doble pila. /31 en enlaces punto a punto (RFC 3021).
3. **`op1m3` · LAN: conmutación Ethernet, VLAN y 802.1Q.** Tabla MAC (aprender, reenviar, inundar),
   dominios de colisión y de difusión; STP/RSTP (puente raíz, estados, para qué sirve; 802.1D/802.1w);
   VLAN: por qué segmentar, etiqueta 802.1Q (4 bytes, VID de 12 bits, 1–4094, PCP), puertos de acceso
   y troncales, VLAN nativa y su riesgo (doble etiquetado), VLAN de voz; encaminamiento entre VLAN
   (router-on-a-stick con subinterfaces, conmutador de capa 3 con SVI); agregación de enlaces LACP
   (802.1AX, antes 802.3ad); diseño jerárquico acceso/distribución/núcleo y spine-leaf en CPD.
4. **`op1m4` · Encaminamiento: estático, OSPF y BGP.** Tabla de rutas, coincidencia del prefijo
   más largo, ruta por defecto, métrica frente a distancia administrativa (valores de Cisco,
   indicándolo); rutas estáticas y flotantes; IGP frente a EGP; vector distancia (RIP, 15 saltos)
   frente a estado de enlace (OSPF: áreas, área 0, coste, DR/BDR, LSA, SPF de Dijkstra, protocolo IP 89);
   BGP (sistemas autónomos, eBGP/iBGP, TCP 179, vector de rutas, atributos AS_PATH y LOCAL_PREF a
   nivel conceptual); redundancia de puerta de enlace: VRRP (RFC 9568, que sustituye a la RFC 5798) y HSRP (propietario de Cisco).
5. **`op1m5` · Arquitecturas WAN y WLAN.** WAN: líneas dedicadas, MPLS (etiquetas, VPN de capa 3,
   calidad de servicio), acceso a Internet con VPN, fibra oscura y DWDM entre centros a nivel
   conceptual; SD-WAN solo se presenta (se desarrolla en el bloque 4; enlazar `sp3m5`). WLAN: 802.11
   a/b/g/n/ac/ax/be con banda y nombre Wi-Fi 4–7, canales no solapados 1-6-11 en 2,4 GHz, CSMA/CA
   frente a CSMA/CD, SSID/BSSID/ESS, puntos de acceso autónomos frente a gestionados por controlador
   (CAPWAP), itinerancia, PoE (802.3af/at/bt). La seguridad (WPA3, 802.1X) ya está en `sp4m2`: enlazar, no repetir.

## Laboratorios (`labs-op1.ts`)

- **`opl1a` · «Cada equipo en su subred»** (`classify`, 12 elementos, 4 categorías, ≥80 %, 100 XP,
  `mission: { n: 1, briefing }`): cuatro subredes VLSM del Consorcio (por ejemplo /25, /26, /27 y /30
  de 10.20.8.0/24) y doce direcciones IP que hay que asignar a su subred; el `why` muestra el cálculo.
- **`opl1b` · «De la VLAN 10 a la VLAN 20»** (`order`, 8 pasos, 75 XP): el recorrido de un paquete
  entre dos equipos de VLAN distintas a través de un conmutador de capa 3 (ARP a la puerta de enlace,
  trama etiquetada en el troncal, decisión de ruta, nueva trama con otras MAC, etc.).

## Tarjetas y glosario (`op1-cards.ts`)

- 30 tarjetas `fco101`–`fco130` (6 por lección), en español, respuesta de 1–3 frases con el dato exacto.
- Entradas de glosario (al final, 111: una por sigla usada) `sectionId: 'op1'`, con `ca` (término en catalán) solo cuando está confirmado. Toda sigla
  usada en lecciones, preguntas, tarjetas o labs lleva entrada que la contenga en `term`
  («VLAN (Virtual LAN)», «OSPF (Open Shortest Path First)»). Los términos `ca` se comprueban contra
  TERMCAT (Cercaterm) en la revisión; si no se puede confirmar uno, se deja sin `ca`.

## Motor

- `types.ts`: `TrackId` + `'opo'`; cinco `Domain` nuevos; `GlossaryEntry.ca?: string`.
- `data/opo/sections.ts`: dominios, pesos, rangos, sección `op1` con jefe.
- `tracks.ts`: entrada `opo`, `TRACK_IDS`; `labs.ts`: fusionar labs y datos; `lab-guides.ts`: guías.
- `practical/study-aids.ts`: claves vacías para `opo`.
- `GlossaryPage`: muestra y busca `ca`; subtítulo propio.
- Sin cambios en el store: `track` ya es texto y el progreso va por id. Sin migración.
- Tests: `opo.test.ts` (estructura del bloque, `ca` nunca vacío y en al menos 50 entradas), lista de siglas en
  `acronyms.test.ts`, y la prueba de nivel sigue siendo obligatoria solo para GCTI y Security+.
- Sin logros ni prueba de nivel propios por ahora; sin vídeos.

## Revisión

Un revisor de solo lectura comprueba exactitud técnica contra los estándares y los términos en
catalán contra TERMCAT. `npm test` y `npm run build` deben pasar.
