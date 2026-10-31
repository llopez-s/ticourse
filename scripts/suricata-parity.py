"""Records how real Suricata treats scripts/suricata-parity-cases.rules over the lab capture.

python scripts/suricata-parity.py           rewrite src/data/suricata-parity.json
python scripts/suricata-parity.py --check   exit 1 if the recorded file is stale

suricataSim.test.ts replays the recording, so the browser simulator is held to the
engine's behaviour. Needs a local suricata binary (recorded with 7.0.3).
"""
import json
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LAB = ROOT / 'public' / 'labs' / 'suricata-practice'
OUT = ROOT / 'src' / 'data' / 'suricata-parity.json'
sys.path.insert(0, str(LAB))
import make_pcap  # noqa: E402
import verify  # noqa: E402


def cases():
    text = (ROOT / 'scripts' / 'suricata-parity-cases.rules').read_text(encoding='utf-8')
    reference = (LAB / 'reference.rules').read_text(encoding='utf-8')
    for chunk in text.split('### ')[1:]:
        head, _, body = chunk.partition('\n')
        name, *flags = head.split()
        body = body.rstrip('\n') + '\n'
        yield name, 'ips' if 'ips' in flags else 'ids', reference if body.strip() == '@reference' else body


def record():
    with tempfile.TemporaryDirectory() as tmp:
        pcap = Path(tmp) / 'capture.pcap'
        pcap.write_bytes(make_pcap.build(verify.load('corpus.json')))
        out = []
        for name, mode, rules in cases():
            path = Path(tmp) / f'{name}.rules'
            path.write_text(rules, encoding='utf-8')
            alerts, errors = verify.run_suricata(path, pcap, mode == 'ips')
            out.append({'name': name, 'mode': mode, 'rules': rules,
                        'alerts': sorted({f"{a['event']}:{a['sid']}:{a['action']}" for a in alerts}),
                        'errorLines': sorted({e['line'] for e in errors})})
    return {'suricata': verify.suricata_version('suricata'), 'cases': out}


def main():
    data = json.dumps(record(), ensure_ascii=False, indent=1) + '\n'
    if '--check' in sys.argv:
        current = OUT.read_text(encoding='utf-8') if OUT.exists() else ''
        print('al día' if current == data else 'desactualizado: ejecuta python scripts/suricata-parity.py')
        return 0 if current == data else 1
    OUT.write_text(data, encoding='utf-8')
    print(f'{OUT.relative_to(ROOT)}: {data.count(chr(34) + "name" + chr(34))} casos')
    return 0


if __name__ == '__main__':
    sys.exit(main())
