"""Runs a rules file through real Suricata against capture.pcap and checks every mission.

python verify.py                          reference.rules, all missions
python verify.py --rules mi-regla.rules   your rules
python verify.py --rules mi-regla.rules --mission m3

Exit codes: 0 every mission met, 1 some event differs, 2 a rule failed to load
or Suricata could not run. A rule that does not load is never "no alert".
"""
import argparse
import json
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
HOME_NET = '[10.0.0.0/8,172.16.0.0/12,192.168.0.0/16]'
ERROR_AT = re.compile(r'error parsing signature .* at line (\d+)')


def load(name):
    return json.loads((HERE / name).read_text(encoding='utf-8'))


def ensure_capture() -> Path:
    pcap = HERE / 'capture.pcap'
    if not pcap.exists():
        import importlib.util  # noqa: PLC0415 - only needed to regenerate the capture
        spec = importlib.util.spec_from_file_location('make_pcap', HERE / 'make_pcap.py')
        make_pcap = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(make_pcap)
        pcap.write_bytes(make_pcap.build(load('corpus.json')))
    return pcap


def suricata_version(binary: str) -> str:
    out = subprocess.run([binary, '-V'], capture_output=True, text=True, check=False)
    return (out.stdout + out.stderr).strip().splitlines()[-1] if (out.stdout or out.stderr) else 'desconocida'


def run_suricata(rules: Path, pcap: Path, ips: bool, binary: str = 'suricata', config: str | None = None):
    """Returns (alerts, errors). alerts: [{event, sid, action, signature}]; errors: [{line, message}]."""
    corpus = load('corpus.json')
    by_port = {40000 + i: event['id'] for i, event in enumerate(corpus['events'])}
    with tempfile.TemporaryDirectory() as logdir:
        cmd = [binary, '-S', str(rules), '-r', str(pcap), '-l', logdir,
               '--set', f'vars.address-groups.HOME_NET={HOME_NET}',
               '--set', 'vars.address-groups.EXTERNAL_NET=!$HOME_NET']
        if config:
            cmd[1:1] = ['-c', config]
        if ips:
            cmd.append('--simulate-ips')
        proc = subprocess.run(cmd, capture_output=True, text=True, check=False)
        errors, last = [], ''
        for line in (proc.stdout + proc.stderr).splitlines():
            if not line.startswith('E:'):
                continue
            found = ERROR_AT.search(line)
            if found:
                errors.append({'line': int(found.group(1)), 'message': last})
            else:
                last = line.split(':', 2)[-1].strip()
        eve = Path(logdir) / 'eve.json'
        if proc.returncode != 0 and not eve.exists():
            raise RuntimeError(f'Suricata terminó con código {proc.returncode}:\n{proc.stderr[-800:]}')
        alerts = []
        for raw in eve.read_text(encoding='utf-8').splitlines() if eve.exists() else []:
            event = json.loads(raw)
            if event.get('event_type') != 'alert':
                continue
            port = event['src_port'] if event.get('src_port') in by_port else event.get('dest_port')
            alerts.append({'event': by_port.get(port, '?'), 'sid': event['alert']['signature_id'],
                           'action': event['alert']['action'], 'signature': event['alert']['signature']})
        return alerts, errors


def outcome(alerts, event_id):
    actions = {a['action'] for a in alerts if a['event'] == event_id}
    return 'blocked' if 'blocked' in actions else 'allowed' if actions else 'none'


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--rules', default=str(HERE / 'reference.rules'))
    parser.add_argument('--mission', help='m1, m2, m3 o m4 (por defecto, todas)')
    parser.add_argument('--suricata', default='suricata', help='ruta al binario')
    parser.add_argument('--config', help='suricata.yaml, si el binario no encuentra el suyo')
    args = parser.parse_args()
    if not shutil.which(args.suricata) and not Path(args.suricata).exists():
        print(f'No encuentro el binario «{args.suricata}». Instala Suricata o usa --suricata RUTA.')
        return 2
    rules = Path(args.rules)
    missions = [m for m in load('missions.json')['missions'] if not args.mission or m['id'] == args.mission]
    if not missions:
        print(f'Misión desconocida: {args.mission}')
        return 2
    corpus = {e['id']: e for e in load('corpus.json')['events']}
    pcap = ensure_capture()
    print(f'{suricata_version(args.suricata)} · reglas: {rules.name} · captura: {pcap.name}')
    status = 0
    for mode in ('ids', 'ips'):
        selected = [m for m in missions if m['mode'] == mode]
        if not selected:
            continue
        try:
            alerts, errors = run_suricata(rules, pcap, mode == 'ips', args.suricata, args.config)
        except RuntimeError as exc:
            print(exc)
            return 2
        for err in errors:
            print(f'  ERROR línea {err["line"]}: {err["message"] or "regla no cargada"}')
        if errors:
            status = 2
        for mission in selected:
            misses = []
            print(f'\n{mission["id"]} · {mission["title"]} · sensor {"en línea (IPS)" if mode == "ips" else "SPAN (IDS)"}')
            for event_id in mission['scope']:
                want = mission['expect'].get(event_id, 'none')
                got = outcome(alerts, event_id)
                mark = 'OK ' if want == got else 'XX '
                if want != got:
                    misses.append(event_id)
                print(f'  {mark}{event_id:3} esperado={want:8} obtenido={got:8} {corpus[event_id]["note"]}')
            print(f'  → {"cumplida" if not misses else "pendiente: " + ", ".join(misses)}')
            if misses and status == 0:
                status = 1
    return status


if __name__ == '__main__':
    sys.exit(main())
