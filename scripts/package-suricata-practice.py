"""Paquete reproducible del laboratorio de Suricata. --check no modifica archivos."""
import argparse
import hashlib
import importlib.util
import io
from pathlib import Path
import zipfile

ROOT = Path(__file__).resolve().parents[1]
LAB = ROOT / "public/labs/suricata-practice"
spec = importlib.util.spec_from_file_location("make_pcap", LAB / "make_pcap.py")
make_pcap = importlib.util.module_from_spec(spec)
spec.loader.exec_module(make_pcap)
SOURCES = ("README.txt", "corpus.json", "missions.json", "reference.rules", "make_pcap.py", "verify.py")
payload = {name: (LAB / name).read_bytes() for name in SOURCES}
payload["capture.pcap"] = make_pcap.build(make_pcap.json.loads(payload["corpus.json"]))
buffer = io.BytesIO()
with zipfile.ZipFile(buffer, "w", compression=zipfile.ZIP_DEFLATED) as archive:
    for name, data in sorted(payload.items()):
        info = zipfile.ZipInfo(f"suricata-practice/{name}", date_time=(2026, 10, 30, 0, 0, 0))
        info.compress_type = zipfile.ZIP_DEFLATED
        archive.writestr(info, data)
target = ROOT / "public/labs/suricata-practice.zip"
parser = argparse.ArgumentParser()
parser.add_argument("--check", action="store_true")
args = parser.parse_args()
if args.check:
    if not target.exists() or target.read_bytes() != buffer.getvalue():
        raise SystemExit("FAIL: regenerar ZIP con python scripts/package-suricata-practice.py")
    print(f"OK: ZIP coincide con las {len(SOURCES)} fuentes y la captura generada")
else:
    target.write_bytes(buffer.getvalue())
    print(f"ZIP generado: {len(payload)} archivos; SHA256 {hashlib.sha256(buffer.getvalue()).hexdigest()}")
