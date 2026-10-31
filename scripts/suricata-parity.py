"""Records how real Suricata treats scripts/suricata-parity-cases.rules over the lab capture.

python scripts/suricata-parity.py              rewrite src/data/suricata-parity-<major>.json
python scripts/suricata-parity.py --check      exit 1 if that recording is stale
python scripts/suricata-parity.py --digest     also print a compact digest to paste elsewhere
python scripts/suricata-parity.py --from-digest FILE
                                               rebuild a recording from a pasted digest and
                                               check it against the digest's SHA-256

One recording per Suricata major version. suricataSim.test.ts replays all of them:
where they agree the simulator must match exactly, and where they disagree it must
report the rule as version-dependent instead of picking a side.
"""
import hashlib
import json
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LAB = ROOT / 'public' / 'labs' / 'suricata-practice'
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


def target(version: str) -> Path:
    major = version.split('version', 1)[-1].strip().split('.')[0]
    return ROOT / 'src' / 'data' / f'suricata-parity-{major}.json'


def dump(data) -> str:
    return json.dumps(data, ensure_ascii=False, indent=1) + '\n'


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


def digest(data) -> str:
    lines = [f"VERSION {data['suricata']}", f"SHA256 {hashlib.sha256(dump(data).encode('utf-8')).hexdigest()}"]
    for case in data['cases']:
        lines.append(f"{case['name']}|{','.join(case['alerts'])}|{','.join(map(str, case['errorLines']))}")
    return '\n'.join(lines)


def from_digest(text: str):
    rows = [line.strip() for line in text.splitlines() if line.strip()]
    version = rows[0].removeprefix('VERSION ').strip()
    expected = rows[1].removeprefix('SHA256 ').strip()
    found = {}
    for row in rows[2:]:
        name, alerts, errors = row.split('|')
        found[name] = (alerts.split(',') if alerts else [], [int(n) for n in errors.split(',')] if errors else [])
    out = []
    for name, mode, rules in cases():
        if name not in found:
            raise SystemExit(f'el resumen no trae el caso {name}: vuelve a grabar con la versión actual de los casos')
        alerts, errors = found[name]
        out.append({'name': name, 'mode': mode, 'rules': rules, 'alerts': alerts, 'errorLines': errors})
    data = {'suricata': version, 'cases': out}
    actual = hashlib.sha256(dump(data).encode('utf-8')).hexdigest()
    if actual != expected:
        raise SystemExit(f'el hash no coincide ({actual} != {expected}): el resumen o los casos difieren')
    return data


def main():
    if '--from-digest' in sys.argv:
        data = from_digest(Path(sys.argv[sys.argv.index('--from-digest') + 1]).read_text(encoding='utf-8'))
    else:
        data = record()
    out = target(data['suricata'])
    text = dump(data)
    if '--check' in sys.argv:
        current = out.read_text(encoding='utf-8') if out.exists() else ''
        print('al día' if current == text else f'desactualizado: ejecuta python scripts/suricata-parity.py ({out.name})')
        return 0 if current == text else 1
    out.write_text(text, encoding='utf-8')
    print(f'{out.relative_to(ROOT)}: {len(data["cases"])} casos · {data["suricata"]}')
    if '--digest' in sys.argv:
        print('\n----- copia desde aquí -----')
        print(digest(data))
        print('----- hasta aquí -----')
    return 0


if __name__ == '__main__':
    sys.exit(main())
