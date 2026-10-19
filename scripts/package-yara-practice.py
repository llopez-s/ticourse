"""Paquete reproducible del laboratorio. --check no modifica archivos."""
import argparse
import hashlib
import importlib.util
import io
import json
from pathlib import Path
import zipfile

ROOT = Path(__file__).resolve().parents[1]
LAB = ROOT / "public/labs/yara-practice"
spec = importlib.util.spec_from_file_location("fixtures", LAB / "fixtures.py")
fixtures = importlib.util.module_from_spec(spec)
spec.loader.exec_module(fixtures)
payload = {name: (LAB / name).read_bytes() for name in (
    "reference.yar", "fixtures.py", "verify.py", "requirements.txt", "README.txt"
)}
manifest = []
for name, data, split, expected, reason in fixtures.cases():
    payload[f"corpus/{name}"] = data
    manifest.append({"file": name, "split": split, "sha256": hashlib.sha256(data).hexdigest(),
                     "expected": expected, "reason": reason})
payload["manifest.json"] = json.dumps(manifest, ensure_ascii=False, indent=2).encode("utf-8")
buffer = io.BytesIO()
with zipfile.ZipFile(buffer, "w", compression=zipfile.ZIP_DEFLATED) as archive:
    for name, data in sorted(payload.items()):
        info = zipfile.ZipInfo(name, date_time=(2026, 10, 19, 0, 0, 0))
        info.compress_type = zipfile.ZIP_DEFLATED
        archive.writestr(info, data)
target = ROOT / "public/labs/yara-practice.zip"
parser = argparse.ArgumentParser()
parser.add_argument("--check", action="store_true")
args = parser.parse_args()
if args.check:
    if not target.exists() or target.read_bytes() != buffer.getvalue():
        raise SystemExit("FAIL: regenerar ZIP con python scripts/package-yara-practice.py")
    print("OK: ZIP coincide con las 5 fuentes, 12 fixtures y manifiesto de hashes")
else:
    target.write_bytes(buffer.getvalue())
    print(f"ZIP generado: {len(payload)} archivos; SHA256 {hashlib.sha256(buffer.getvalue()).hexdigest()}")
