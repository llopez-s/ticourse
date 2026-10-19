"""Compila y contrasta con libyara real. Salida != 0 ante error o discrepancia."""
import argparse
from pathlib import Path
import sys

import yara
from fixtures import FAMILY, cases

parser = argparse.ArgumentParser()
parser.add_argument("--rule", type=Path, help="Archivo del alumno; por defecto reference.yar")
parser.add_argument("--name", default=FAMILY, help="Nombre de la regla del alumno")
args = parser.parse_args()
source = args.rule or Path(__file__).with_name("reference.yar")
try:
    rules = yara.compile(filepath=str(source), includes=False, error_on_warning=True)
    failures = []
    for name, data, split, expected, reason in cases():
        actual = {match.rule for match in rules.match(data=data, timeout=5)}
        if args.rule:
            wanted = {args.name} if FAMILY in expected else set()
        else:
            wanted = set(expected)
        if actual != wanted:
            failures.append(name)
        print(f"{'OK' if actual == wanted else 'FAIL'} {name} [{split}]: {sorted(actual)} | {reason}")
    print(f"YARA {yara.__version__}: {12 - len(failures)}/12 casos conformes al alcance declarado")
    print("No mide eficacia real. future-uncovered es un falso negativo conocido si se exige v2.")
    sys.exit(1 if failures else 0)
except (yara.Error, OSError) as error:
    print(f"ERROR de compilacion/ejecucion: {error}", file=sys.stderr)
    sys.exit(2)
