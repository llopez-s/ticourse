"""Datos inventados e inertes. Nunca abrir procesos, ejecutar muestras ni usar red."""
from pathlib import Path

FAMILY = "Alertopolis_Demo_Family"
SAMPLE = "Alertopolis_Demo_Sample"
HUNT = "Alertopolis_Demo_Hunt"
HEADER = b"ALRTDEMO\n"
MARKER = b"cicada-demo-v1"
ROUTE = b"route=/collect-demo"
HEX = bytes.fromhex("41 4c 52 54 22 7f")


def cases():
    """nombre, bytes, partición, coincidencias esperadas, justificación."""
    a = HEADER + MARKER + b"\n" + ROUTE + b"\n" + HEX + b"\nbuild=fixture-A"
    return [
        ("a.dat", a, "training", [FAMILY, SAMPLE, HUNT], "A: marcador + ruta + hex; build específico."),
        ("b-wide.dat", HEADER + "CICADA-DEMO-V1\nroute=/collect-demo".encode("utf-16le"), "training", [FAMILY, HUNT], "B: wide y nocase; otro build."),
        ("c-heldout.dat", HEADER + MARKER + b"\nroute=/changed\n" + bytes.fromhex("41 4c 52 54 99 7f"), "held-out", [FAMILY, HUNT], "C: ruta cambiada; rama hex y comodín conservados."),
        ("benign-route.dat", HEADER + ROUTE, "training", [HUNT], "Ruta sola: insuficiente para familia; hunting genera revisión."),
        ("benign-marker.dat", HEADER + MARKER, "training", [HUNT], "Marcador solo: insuficiente para familia."),
        ("benign-hex.dat", HEADER + HEX, "held-out", [HUNT], "Hex solo: colisión deliberada."),
        ("benign-manual.dat", b"Manual de laboratorio\n" + a, "training", [], "Todas las cadenas copiadas en un manual; cabecera fuera de offset 0."),
        ("benign-common.dat", HEADER + b"Mozilla/5.0 kernel32.dll", "training", [], "Dos cadenas comunes no definen una familia."),
        ("empty.dat", b"", "held-out", [], "Sin datos no significa evidencia positiva."),
        ("large.dat", a + b" " * 4096, "held-out", [], "Fuera del tamaño pactado; sería un FN si se ampliara el alcance."),
        ("future-uncovered.dat", HEADER + b"cicada-demo-v2\nroute=/new", "challenge", [], "Variante inventada fuera de cobertura: FN conocido si el objetivo incluye v2."),
        ("boundary-4096.dat", a.ljust(4096, b" "), "held-out", [], "La condición usa < 4KB: 4096 queda fuera."),
    ]


if __name__ == "__main__":
    target = Path(__file__).parent / "corpus"
    target.mkdir(exist_ok=True)
    for name, data, *_ in cases():
        (target / name).write_bytes(data)
    print(f"12 fixtures inertes en {target}")
