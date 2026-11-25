# Arte del piloto con Magnific · `vlan-arcedo`

Generado el 2026-11-25. Encargo: `docs/superpowers/plans/fichas-redes/R03-arte-magnific.md`.
Comparación con y sin Magnific: `docs/reviews/2026-11-25-magnific-piloto/comparacion.html`.

Plan Premium. Saldo antes: 240.000 créditos. Saldo después: 238.310. **Gasto del piloto: 1.690 créditos.**

Imágenes: Google Nano Banana 2.1, 16:9, 2k (2752×1536 px, PNG). Clips: Kling 2.5, 5 s, 1080p (1928×1072, 24 fps), sin
audio. Todos los encargos piden «sin texto, sin letras, sin números, sin logotipos» y sin personas; cada pieza se revisó
antes de guardarla y ninguna trae texto ni caras.

| Archivo | Cómo se hizo | Créditos | Nota |
|---|---|---|---|
| `estilos/estilo-A-isometrico.png` | texto a imagen | 65 | **estilo elegido**; referencia de la serie |
| `estilos/estilo-B-maqueta.png` | texto a imagen | 65 | descartado |
| `estilos/estilo-C-linea.png` | texto a imagen | 65 | descartado |
| `descartes/s01-hook-building-fondo-blanco.png` | texto a imagen + referencia de estilo A | 65 | salió con fondo blanco |
| `s01-hook-building.png` | edición de la anterior (a noche) | 65 | hueco libre arriba a la izquierda |
| `s02-difusion-floor.png` | edición del estilo A (sin la onda) | 65 | cue `floor`; inicio del clip |
| `s02-difusion-walls.png` | edición de `floor` (tabiques) | 65 | cue `walls`; final del clip; mismas mesas |
| `s04-etiqueta-mail.png` | texto a imagen + referencia de estilo A | 65 | cues `mail`, `tray`; tira algo más a línea |
| `s06-capa3-wall.png` | texto a imagen + referencia de estilo A | 65 | cues `wall`, `gw` |
| `clips/s02-tabiques.mp4` | imagen a vídeo, fotograma inicial `floor` y final `walls` | 325 | válido: cámara fija, los tabiques crecen |
| `descartes/s04-montacargas-sin-final.mp4` | imagen a vídeo, solo fotograma inicial `mail` | 325 | **no válido**: la pila crece y acaba flotando fuera del montacargas |
| `s04-etiqueta-mail-fin.png` | edición de `mail` (la pila arriba del hueco) | 65 | fotograma final del clip |
| `clips/s04-montacargas.mp4` | imagen a vídeo, fotograma inicial `mail` y final `mail-fin` | 325 | válido: cámara fija, la pila sube; se deforma un poco a mitad de subida |
| `thumb/miniatura-fondo.png` | edición de `walls` (contraste y foco ámbar) | 65 | el texto lo compone el motor |
| **Total** | | **1.690** | reintentos: 1 de imagen (65) y 1 de vídeo (65 + 325) |

## Lecciones

- Editar una imagen buena mantiene la composición (las mesas no se mueven); generar de cero con referencia de estilo se
  desvía más.
- Un clip necesita fotograma inicial **y** final para hacer lo pedido. Sin final, el modelo inventa.
- 2k deja un 43 % de margen sobre 1920 px, suficiente para el acercamiento suave; no hizo falta 4k.
- Si el arte entra en un vídeo publicado, la descripción de YouTube lleva «Ilustraciones generadas con IA».
