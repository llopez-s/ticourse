"""Writes capture.pcap from corpus.json using only the Python standard library.

Every event becomes one flow from src:<40000 + index> so verify.py can map each
EVE alert back to its event. Timestamps, ports and payloads are fixed, so the
file is byte-for-byte reproducible.
"""
import json
import struct
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
BASE_TS = 1760425200  # 2025-10-14 07:00:00 UTC; the case says 2026, the clock does not matter
CLIENT_MAC = bytes.fromhex('020000000001')
SERVER_MAC = bytes.fromhex('020000000002')


def checksum(data: bytes) -> int:
    if len(data) % 2:
        data += b'\0'
    total = sum(struct.unpack('!%dH' % (len(data) // 2), data))
    while total >> 16:
        total = (total & 0xFFFF) + (total >> 16)
    return ~total & 0xFFFF


def ip4(addr: str) -> bytes:
    return bytes(int(part) for part in addr.split('.'))


def ip_packet(src: str, dst: str, proto: int, payload: bytes, ident: int) -> bytes:
    header = struct.pack('!BBHHHBBH4s4s', 0x45, 0, 20 + len(payload), ident, 0x4000, 64, proto, 0, ip4(src), ip4(dst))
    return header[:10] + struct.pack('!H', checksum(header)) + header[12:] + payload


def l4_checksum(src: str, dst: str, proto: int, segment: bytes) -> int:
    pseudo = ip4(src) + ip4(dst) + struct.pack('!BBH', 0, proto, len(segment))
    return checksum(pseudo + segment)


def udp(src, dst, sport, dport, payload, ident):
    seg = struct.pack('!HHHH', sport, dport, 8 + len(payload), 0) + payload
    seg = seg[:6] + struct.pack('!H', l4_checksum(src, dst, 17, seg)) + seg[8:]
    return ip_packet(src, dst, 17, seg, ident)


def tcp(src, dst, sport, dport, seq, ack, flags, payload, ident):
    seg = struct.pack('!HHIIBBHHH', sport, dport, seq, ack, 5 << 4, flags, 64240, 0, 0) + payload
    seg = seg[:16] + struct.pack('!H', l4_checksum(src, dst, 6, seg)) + seg[18:]
    return ip_packet(src, dst, 6, seg, ident)


def dns_query(name: str, txid: int) -> bytes:
    qname = b''.join(bytes([len(label)]) + label.encode('ascii') for label in name.split('.')) + b'\0'
    return struct.pack('!HHHHHH', txid, 0x0100, 1, 0, 0, 0) + qname + struct.pack('!HH', 1, 1)


def http_request(spec: dict) -> bytes:
    return (f"{spec['method']} {spec['uri']} HTTP/1.1\r\nHost: {spec['host']}\r\n"
            "User-Agent: alertopolis-demo/1.0\r\nContent-Length: 2\r\n\r\nok").encode('ascii')


HTTP_RESPONSE = b'HTTP/1.1 200 OK\r\nContent-Length: 0\r\n\r\n'


def tls_client_hello(sni: str) -> bytes:
    name = sni.encode('ascii')
    server_name = struct.pack('!BH', 0, len(name)) + name
    sni_ext = struct.pack('!HH', 0x0000, len(server_name) + 2) + struct.pack('!H', len(server_name)) + server_name
    body = (b'\x03\x03' + bytes(32) + b'\x00' + struct.pack('!H', 2) + b'\x13\x01' + b'\x01\x00'
            + struct.pack('!H', len(sni_ext)) + sni_ext)
    handshake = b'\x01' + struct.pack('!I', len(body))[1:] + body
    return b'\x16\x03\x01' + struct.pack('!H', len(handshake)) + handshake


def flow_packets(event: dict, index: int):
    src, dst, dport = event['src'], event['dst'], event['dport']
    sport = 40000 + index
    if event['proto'] == 'dns':
        return [(src, dst, udp(src, dst, sport, dport, dns_query(event['dns']['query'], 0x1000 + index), index * 8))]
    request = http_request(event['http']) if event['proto'] == 'http' else tls_client_hello(event['tls']['sni'])
    cseq, sseq = 1000, 5000
    out = [
        (src, dst, tcp(src, dst, sport, dport, cseq, 0, 0x02, b'', index * 8)),
        (dst, src, tcp(dst, src, dport, sport, sseq, cseq + 1, 0x12, b'', index * 8 + 1)),
        (src, dst, tcp(src, dst, sport, dport, cseq + 1, sseq + 1, 0x10, b'', index * 8 + 2)),
        (src, dst, tcp(src, dst, sport, dport, cseq + 1, sseq + 1, 0x18, request, index * 8 + 3)),
    ]
    reply = HTTP_RESPONSE if event['proto'] == 'http' else b''
    out.append((dst, src, tcp(dst, src, dport, sport, sseq + 1, cseq + 1 + len(request), 0x18 if reply else 0x10, reply, index * 8 + 4)))
    return out


def build(corpus: dict) -> bytes:
    out = bytearray(struct.pack('<IHHiIII', 0xA1B2C3D4, 2, 4, 0, 0, 65535, 1))
    tick = 0
    for index, event in enumerate(corpus['events']):
        for src, _dst, packet in flow_packets(event, index):
            client = src == event['src']
            frame = (SERVER_MAC + CLIENT_MAC if client else CLIENT_MAC + SERVER_MAC) + b'\x08\x00' + packet
            out += struct.pack('<IIII', BASE_TS + index, tick * 1000, len(frame), len(frame)) + frame
            tick += 1
    return bytes(out)


def main() -> int:
    corpus = json.loads((HERE / 'corpus.json').read_text(encoding='utf-8'))
    target = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE / 'capture.pcap'
    target.write_bytes(build(corpus))
    print(f'{target.name}: {len(corpus["events"])} eventos')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
