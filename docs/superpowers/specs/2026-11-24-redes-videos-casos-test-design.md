# Vídeos de la pista «Redes y ENS» · bloque 1 (redes)

> Diseño corto del 2026-11-24. Lidia pidió «prepara los vídeos del nuevo temario» y eligió el formato
> «casos con test». Lo marcado *(propuesta de Claude)* no lo ha dicho ella: lo aprueba o lo cambia al leer esto.

## 1. Qué y por qué

La pista `opo` tiene un bloque publicado, `op1` «Redes de comunicaciones», con cinco lecciones y ningún vídeo.
Cada lección tendrá un vídeo en el canal Alertópolis, enlazado en la lección, para entender los conceptos con un
caso y practicar con preguntas tipo test en español. Los bloques 2 a 5 no tienen contenido y quedan fuera.

## 2. Caminos considerados

| Camino | Qué da | Qué cuesta |
|---|---|---|
| **Casos con test** (elegido por Lidia) | Un caso del Consorcio de Arcedo en capítulos y preguntas tipo test en pantalla. Es el formato de Security+ («caso y examen»), ya construido en el motor | Guion más largo de escribir y revisar; el motor necesita conocer la pista |
| Explicativo sin preguntas | Se escribe antes; como los de fundamentos | No entrena la pregunta, y la primera lección repetiría «viaje-conexion» y «abrir-web» |
| Un solo vídeo resumen del bloque | Una sola grabación | Cinco lecciones de 14–18 min no caben; acabaría siendo una lista leída |

## 3. Los cinco vídeos *(propuesta de Claude)*

| Lección | Carpeta | Tamaño | Lo que se confunde y el vídeo aclara |
|---|---|---|---|
| op1m1 OSI y TCP/IP | `trama-arcedo` | cápsula (3 preguntas, 4–5,5 min) | qué envuelve a qué (trama, paquete, segmento) · ARP solo llega a la propia subred: fuera de ella se pregunta por la puerta de enlace · TCP frente a UDP |
| op1m2 Direccionamiento y subredes | `subredes-arcedo` | principal (4–5 preguntas, 7–10 min) | red, difusión y equipos de un prefijo · la subred más pequeña que sirve (VLSM) · rangos privados y especiales, y qué traduce PAT · IPv6: link-local frente a global, y que no hay difusión |
| op1m3 LAN, VLAN y 802.1Q | `vlan-arcedo` | cápsula | dominio de colisión frente a dominio de difusión · puerto de acceso frente a troncal y la VLAN nativa · entre dos VLAN hace falta capa 3 |
| op1m4 Encaminamiento | `rutas-arcedo` | principal | el orden de decisión: prefijo más largo, luego distancia administrativa, luego métrica · ruta estática flotante · OSPF y su área 0 frente a BGP entre sistemas autónomos · VRRP |
| op1m5 WAN y WLAN | `wan-wifi-arcedo` | cápsula | MPLS, VPN por Internet o fibra oscura según la necesidad · canales 1-6-11 · puntos de acceso autónomos frente a controlador |

El vídeo no cubre toda la lección: lo demás sigue en sus tablas, tarjetas y laboratorios. El de op1m1 va más hondo
que los dos de fundamentos (cabeceras, quién pregunta a quién) y no los repite.

## 4. Reglas propias de esta pista *(propuesta de Claude, salvo lo indicado)*

- **Todo en español**, preguntas incluidas (regla de la pista). Preguntas tipo test llanas: un supuesto corto, cuatro
  opciones y una correcta. Sin los calificadores en mayúsculas de CompTIA («MEJOR», «PRIMERO»), porque no sabemos
  que el examen real pregunte así.
- **Nunca «como en el examen»** en pantalla ni en la voz. El rótulo es «pregunta tipo test · ejemplo».
- **Preguntas nuevas**: ninguna copia ni parafrasea las 8 del cuestionario ni los 4 checks de su lección.
- **Números y direcciones.** Las direcciones IP, MAC y máscaras completas van en pantalla y la voz dice qué son («la
  subred de la planta baja», «la puerta de enlace»). La voz sí dice lo que se calcula de cabeza: «barra veintiséis»,
  «sesenta y dos equipos», «la VLAN diez», «el puerto cuatrocientos cuarenta y tres».
- **Exactitud.** Solo hechos de estándares (RFC, IEEE 802); lo que depende del fabricante se dice que lo es. Todo
  cálculo de subredes se comprueba con un script, no de cabeza.
- **El caso**: el Consorcio Provincial de Arcedo, con los rangos de las lecciones (sede 10.20.10/20/30/99.0/24,
  oficinas 10.20.8.0/22, CPD 10.20.72.0/21) e IP públicas de documentación. Sin adversario ni mensajes
  interceptados. Los datos que salgan en pantalla se recogen en un registro nuevo, `docs/superpowers/canon/arcedo.md`.
- **Plaquita de las tarjetas**: «EXAMEN · REDES Y ENS · Redes». No hay objetivos oficiales numerados y no se inventan.
- **Aviso**: «Simulación educativa con datos ficticios · Alertópolis — material independiente, no afiliado a ninguna
  administración pública».
- **En YouTube** (público, lo decide Lidia): título «… | Redes para oposiciones TIC» y lista «Redes y ENS para
  oposiciones TIC». Nada en el repositorio ni en el canal nombra una convocatoria concreta.
- **Lo de siempre**: narración hablada, 2,7 palabras/s, voz de Lidia a tempo 1, música «Go On Going - Stayloose.mp3»,
  3–6 efectos de sonido en momentos del caso además de los de acierto y trampa, revisor de exactitud y revisor de
  naturalidad.

## 5. Motor

Añadir la pista `opo` donde hoy solo existen `secplus` y `gcti` (`profiles.mjs`: aviso, plaquita y validación del
objetivo; `youtube-meta.mjs` y `youtube-api.mjs`: título, etiquetas y lista; `scene-brief.mjs`; `canon-check.mjs`:
registro de Arcedo y lecciones de `src/data/opo`), con sus pruebas. Los vídeos ya publicados no cambian.

## 6. Orden *(propuesta de Claude)*

1. Motor y registro de Arcedo.
2. Ficha y guion de los cinco, sin congelar (hojas de grabación en «BORRADOR»), con las dos revisiones.
3. Lidia lee y graba primero **`vlan-arcedo`** como piloto. Lo que cambie se lleva a los otros cuatro antes de
   congelarlos.
4. Escenas, cuando los guiones estén aprobados. Después, lo habitual: importar la voz, render, subida en privado,
   bloque en la lección y PR.

## 7. Fuera

Bloques 2 a 5, escenas y render en esta tanda, cambios en las lecciones, preguntas del vídeo en la app.
