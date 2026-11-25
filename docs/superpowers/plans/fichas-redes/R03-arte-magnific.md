# Piloto de arte con Magnific · `vlan-arcedo`

> Borrador del 2026-11-25. Prueba si las ilustraciones y dos clips generados con Magnific mejoran el vídeo piloto.
> Nada de esto cambia el guion. Si el piloto no convence, se descarta y las escenas se dibujan en código como siempre.

## Reglas

- Magnific pone **la imagen**; todo texto, número, rótulo o dato lo pone el motor encima. Los encargos piden siempre
  «sin texto, sin letras, sin números, sin logotipos».
- Ningún diagrama técnico se genera: tabla MAC, etiqueta 802.1Q, subredes y preguntas siguen en código.
- Sin personas reconocibles ni caras en primer plano; figuras pequeñas o siluetas.
- Un solo estilo para toda la serie, fijado con una imagen de referencia (o un estilo propio de Magnific).
- Paleta de la marca: fondo azul noche, cian como acento, ámbar para avisos y rosa para la baliza.
- Formato 16:9, 1920×1080 como mínimo; el motor las mueve despacio (acercamiento suave), así que conviene margen.
- Se apunta el gasto de créditos de cada pieza.

## Paso 1 · tres estilos sobre la misma escena (la planta diáfana)

Escena común: «una planta de oficina diáfana vista en perspectiva isométrica, de noche, con filas de mesas y
ordenadores encendidos; desde una mesa sale una onda que llega a todas las demás».

| Estilo | Encargo de estilo |
|---|---|
| A · Isométrico plano | ilustración vectorial isométrica, formas planas, bordes limpios, pocos colores, sin degradados |
| B · Maqueta | maqueta en miniatura de cartulina y papel recortado, luz de estudio suave, profundidad de campo corta |
| C · Línea luminosa | dibujo de línea fina cian sobre fondo azul noche, como un plano técnico iluminado, relleno mínimo |

Lidia elige uno. Esa imagen pasa a ser la referencia de estilo de la serie.

## Paso 2 · cuatro ilustraciones (en el estilo elegido)

| Escena | Cue | Qué se pide |
|---|---|---|
| s01-hook | `building` | un edificio de oficinas de dos plantas en corte lateral, de noche, con un armario de red por planta y, colgados de él, grupos de puestos, servidores y teléfonos; hueco libre arriba a la izquierda para el título |
| s02-difusion | `floor`, `walls` | dos versiones de la misma planta diáfana: sin tabiques, y con tabiques de cristal que la parten en cuatro zonas sin mover ninguna mesa |
| s04-etiqueta | `mail`, `tray` | una sala de correo interno: sobres sin marca dentro de un departamento y, junto al montacargas, sobres con una pegatina de color; al lado, una bandeja aparte |
| s06-capa3 | `wall`, `gw` | un tabique de cristal con una única puerta y un mostrador junto a ella |

## Paso 3 · dos clips de 4–6 s (imagen a vídeo, a partir de las ilustraciones)

| Clip | Parte de | Movimiento |
|---|---|---|
| Tabiques | s02 sin tabiques | los tabiques de cristal suben del suelo y parten la planta; cámara fija |
| Montacargas | s04 | los sobres con pegatina suben en el montacargas; cámara fija |

Cámara fija y sin cambios de plano, para poder poner rótulos encima sin que bailen.

## Paso 4 · miniatura

Fondo: la planta con tabiques, más contrastada y con un punto de luz en una de las zonas. El texto («VLAN», «¿por qué
no se ven?») lo compone el motor, no la IA.

## Paso 5 · comparación

Las mismas cuatro escenas, con y sin Magnific, lado a lado, y una tabla con los créditos gastados por pieza. El piloto
vale si Lidia prefiere la versión con Magnific, ningún texto en pantalla viene de la IA y el gasto permite repetirlo en
los otros cuatro vídeos.

## Cambios en el motor si el piloto vale

Carpeta `video/<slug>/public/art/`, un componente `Illustration` (imagen o clip con acercamiento suave y zonas libres
para rótulos) y una línea en la descripción de YouTube: «Ilustraciones generadas con IA».
