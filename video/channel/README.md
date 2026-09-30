# Imagen del canal de YouTube «Alertópolis»

Foto de perfil y banner del canal `@Alertopolis`, dibujados con el tema del motor de vídeo (colores, fuentes y
el rombo `BrandMark` de la app). No es un vídeo de lección: no tiene `video.json`.

```bash
node video/channel/render.mjs
```

Escribe en `out/` (ignorado por git):

| Archivo | Tamaño | Dónde se sube |
|---|---|---|
| `alertopolis-avatar-800.png` | 800×800, < 4 MB | YouTube Studio → Personalización → Imagen de marca → Foto |
| `alertopolis-banner-2560x1440.png` | 2560×1440, < 6 MB | … → Imagen del banner |

El script falla si un PNG supera el límite de YouTube.

**Recortes del banner.** YouTube muestra la imagen entera en las teles, una franja de 2560×423 en el ordenador
y solo los 1546×423 centrales en el móvil (`SAFE` en `src/skyline.ts`). La marca, el lema y la baliza van dentro
de esa zona segura; el resto del skyline es un extra para pantallas anchas.

**Motivo.** Alertópolis es una ciudad de alertas: cada ventana es un evento (gris = rutina, cian = dato, ámbar =
aviso) y la baliza roja de la torre es la alerta que importa. Mismos significados de color que en los vídeos.
