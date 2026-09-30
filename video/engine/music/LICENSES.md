# Música de biblioteca

Pistas que suenan bajo los vídeos (`video.json` → `"music"`, mezcladas por `scripts/master_mix.py --bed-style music`).
Los archivos van en `music/library/`, que git ignora: se pueden usar en los vídeos, pero no redistribuir en un
repositorio público. Esta lista sí se versiona, para saber qué es cada archivo y de dónde volver a bajarlo.

Para añadir una: YouTube Studio → Biblioteca de audio → Música, filtro **«Atribución no requerida»**
(«Attribution not required»); se descarga a mano, se deja en `music/library/` con su nombre tal cual y se apunta
aquí con su hash (`sha256sum`). Usarla implica aceptar las condiciones de la Biblioteca de audio de YouTube.

| Archivo | Pista · artista | Origen | Licencia | Descargada | SHA-256 | Vídeos |
|---|---|---|---|---|---|---|
| `Go On Going - Stayloose.mp3` | Go On Going · Stayloose (3:46, Dance and Electronic, Dramatic) | Biblioteca de audio de YouTube | Atribución no requerida | 2026-09-30 | `bed2d714393eb6b8893f1d6b4bd7a7754d2832f6a42d53aa21846733e192fdc2` | V4 `pivot-infra` |
