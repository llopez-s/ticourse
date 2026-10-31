/**
 * A deliberately small Suricata rule evaluator for the sp4m7 lab.
 *
 * It parses one subset of the rule language and runs it over the lab's synthetic
 * events. Anything outside that subset is reported as `unsupported`, never guessed:
 * real Suricata may accept such a rule, but this simulator cannot tell what it does.
 * suricataSim.test.ts replays src/data/suricata-parity-<major>.json, one recording per
 * Suricata major version: every supported behaviour here is one each engine was seen to
 * have, and where versions disagree the simulator says so instead of picking one.
 */

export type SimProto = 'dns' | 'http' | 'tls';
export type SensorMode = 'ids' | 'ips';
export type AlertAction = 'allowed' | 'blocked';

export interface SimEvent {
  id: string;
  proto: SimProto;
  src: string;
  dst: string;
  dport: number;
  dns?: { query: string };
  http?: { method: string; uri: string; host: string };
  tls?: { sni: string };
  note: string;
}

export interface RuleIssue {
  line: number;
  kind: 'error' | 'unsupported';
  message: string;
}

export interface SimAlert {
  event: string;
  sid: number;
  rev: number;
  action: AlertAction;
  signature: string;
  srcPort: number;
}

type Buffer = 'dns.query' | 'http.method' | 'http.uri' | 'http.host' | 'tls.sni';

interface Content {
  needle: string;
  negated: boolean;
  nocase: boolean;
  startswith: boolean;
  endswith: boolean;
}

interface Match {
  buffer: Buffer;
  dotprefix: boolean;
  contents: Content[];
}

interface AddrItem { negated: boolean; kind: 'any' | 'home' | 'external' | 'cidr'; base?: number; bits?: number }
interface PortSpec { any: boolean; negated: boolean; ports: Set<number> }

export interface ParsedRule {
  line: number;
  action: 'alert' | 'drop' | 'reject' | 'pass';
  proto: SimProto;
  src: AddrItem[][];
  srcPort: PortSpec;
  dst: AddrItem[][];
  dstPort: PortSpec;
  bidirectional: boolean;
  msg: string;
  sid: number;
  rev: number;
  established: boolean;
  matches: Match[];
}

const BUFFERS: Record<Buffer, SimProto> = {
  'dns.query': 'dns', 'http.method': 'http', 'http.uri': 'http', 'http.host': 'http', 'tls.sni': 'tls',
};
const BUFFER_NAME: Record<Buffer, string> = {
  'dns.query': 'dns_query', 'http.method': 'http_method', 'http.uri': 'http_uri', 'http.host': 'http_host', 'tls.sni': 'tls.sni',
};
const ACTIONS = ['alert', 'drop', 'reject', 'pass'] as const;
const OTHER_ACTIONS = ['rejectsrc', 'rejectdst', 'rejectboth', 'config'];
const OTHER_PROTOS = ['tcp', 'udp', 'ip', 'icmp', 'pkthdr', 'ssh', 'smb', 'ftp', 'smtp', 'http1', 'http2', 'dcerpc',
  'dnp3', 'modbus', 'enip', 'nfs', 'krb5', 'dhcp', 'snmp', 'sip', 'rfb', 'mqtt', 'rdp', 'ike', 'quic', 'tftp', 'ntp', 'pgsql'];
const IGNORED = new Set(['classtype', 'metadata', 'reference', 'priority', 'fast_pattern']);
/** Real keywords this simulator does not model: they get `unsupported`, not `unknown keyword`. */
const KNOWN_ELSEWHERE = new Set(['pcre', 'depth', 'offset', 'distance', 'within', 'isdataat', 'byte_test', 'byte_jump',
  'byte_extract', 'byte_math', 'dsize', 'threshold', 'detection_filter', 'flowbits', 'flowint', 'xbits', 'noalert',
  'tag', 'target', 'app-layer-protocol', 'app-layer-event', 'flow.age', 'stream_size', 'ttl', 'itype', 'icode',
  'http.user_agent', 'http.header', 'http.cookie', 'http.request_body', 'http.response_body', 'http.stat_code',
  'http.request_line', 'http.uri.raw', 'http.header_names', 'http.content_type', 'http.referer', 'file.data',
  'tls.cert_subject', 'tls.cert_issuer', 'tls.version', 'tls.subject', 'ja3.hash', 'ja3.string', 'ja3s.hash', 'ja4.hash',
  'dns.opcode', 'dns.answer.name', 'dns.queries.rrname', 'to_lowercase', 'to_uppercase', 'strip_whitespace',
  'compress_whitespace', 'to_md5', 'to_sha1', 'to_sha256', 'pcrexform', 'url_decode', 'xor', 'header_lowercase',
  'strip_pseudo_headers', 'from_base64', 'luajit', 'lua', 'filestore', 'fileext', 'filename', 'filemagic', 'bsize',
  'urilen', 'sameip', 'ip_proto', 'flags', 'seq', 'ack', 'window', 'rawbytes', 'requires', 'prefilter', 'base64_decode',
  'base64_data', 'iprep', 'datarep', 'dataset', 'geoip', 'id', 'gid', 'target']);

class RuleError extends Error {
  constructor(readonly kind: RuleIssue['kind'], message: string) { super(message); }
}
function fail(message: string): never { throw new RuleError('error', message); }
function outside(message: string): never { throw new RuleError('unsupported', message); }

// --------------------------------------------------------------------- addresses

function ipToInt(text: string): number | null {
  const parts = text.split('.');
  if (parts.length !== 4 || parts.some((p) => !/^\d{1,3}$/.test(p) || Number(p) > 255)) return null;
  return parts.reduce((acc, p) => acc * 256 + Number(p), 0);
}

function inCidr(ip: number, base: number, bits: number): boolean {
  const size = 2 ** (32 - bits);
  return Math.floor(ip / size) === Math.floor(base / size);
}

function parseAddress(text: string): AddrItem[][] {
  // Returns a list of alternatives (OR); each alternative is one item, possibly negated.
  const items = text.startsWith('[') ? splitList(text) : [text];
  return items.map((raw) => {
    const negated = raw.startsWith('!');
    const body = negated ? raw.slice(1) : raw;
    if (body === 'any') return negated ? fail('no se puede negar any') : [{ negated, kind: 'any' }];
    if (body === '$HOME_NET') return [{ negated, kind: 'home' }];
    if (body === '$EXTERNAL_NET') return [{ negated, kind: 'external' }];
    if (body.startsWith('$')) return outside(`la variable ${body} no existe en este simulador (solo $HOME_NET y $EXTERNAL_NET)`);
    if (body.startsWith('[')) return outside('las listas anidadas de direcciones quedan fuera del simulador');
    const [addr, mask] = body.split('/');
    const base = ipToInt(addr);
    const bits = mask === undefined ? 32 : Number(mask);
    if (base === null || !Number.isInteger(bits) || bits < 0 || bits > 32) {
      return addr.includes(':') ? outside('las direcciones IPv6 quedan fuera del simulador') : fail(`dirección no válida: ${raw}`);
    }
    return [{ negated, kind: 'cidr', base, bits }];
  });
}

function splitList(text: string): string[] {
  if (!text.endsWith(']')) fail(`lista sin cerrar: ${text}`);
  const inner = text.slice(1, -1).trim();
  if (!inner) fail('lista vacía');
  return inner.split(',').map((s) => s.trim());
}

function addressMatches(spec: AddrItem[][], ip: string, homeNet: [number, number][]): boolean {
  const n = ipToInt(ip)!;
  const isHome = homeNet.some(([base, bits]) => inCidr(n, base, bits));
  const one = (item: AddrItem): boolean => {
    const hit = item.kind === 'any' ? true : item.kind === 'home' ? isHome : item.kind === 'external' ? !isHome
      : inCidr(n, item.base!, item.bits!);
    return item.negated ? !hit : hit;
  };
  const positives = spec.flat().filter((i) => !i.negated);
  const negatives = spec.flat().filter((i) => i.negated);
  return (positives.length === 0 || positives.some(one)) && negatives.every(one);
}

function parsePorts(text: string): PortSpec {
  if (text === 'any') return { any: true, negated: false, ports: new Set() };
  const negated = text.startsWith('!');
  const body = negated ? text.slice(1) : text;
  const items = body.startsWith('[') ? splitList(body) : [body];
  const ports = new Set<number>();
  for (const item of items) {
    if (item.includes(':') || item.startsWith('!') || item.startsWith('$')) {
      outside('rangos, variables y negaciones dentro de listas de puertos quedan fuera del simulador');
    }
    if (!/^\d+$/.test(item) || Number(item) > 65535) fail(`puerto no válido: ${item}`);
    ports.add(Number(item));
  }
  return { any: false, negated, ports };
}

const portMatches = (spec: PortSpec, port: number) => spec.any || spec.ports.has(port) !== spec.negated;

// --------------------------------------------------------------------- options

interface Option { name: string; value: string | null; quoted: boolean; negated: boolean }

/** Splits "(a; b:"x\;y"; c:1;" into options, with Suricata's quoting and escape rules. */
function splitOptions(body: string): Option[] {
  const out: Option[] = [];
  let i = 0;
  while (i < body.length) {
    while (i < body.length && /\s/.test(body[i])) i++;
    if (i >= body.length) break;
    const start = i;
    while (i < body.length && body[i] !== ':' && body[i] !== ';') i++;
    const name = body.slice(start, i).trim();
    if (i >= body.length) fail('no terminating ";" found');
    if (body[i] === ';') {
      out.push({ name, value: null, quoted: false, negated: false });
      i++;
      continue;
    }
    i++; // ':'
    while (i < body.length && /\s/.test(body[i])) i++;
    let negated = false;
    if (body[i] === '!') { negated = true; i++; }
    if (body[i] === '"') {
      i++;
      let value = '';
      while (i < body.length && body[i] !== '"') {
        if (body[i] === '\\' && i + 1 < body.length) { value += body[i + 1]; i += 2; continue; }
        if (body[i] === ';') fail(`bad option value formatting (possible missing semicolon) for keyword ${name}`);
        value += body[i++];
      }
      if (i >= body.length) fail(`comillas sin cerrar en ${name}`);
      i++;
      while (i < body.length && /\s/.test(body[i])) i++;
      if (body[i] !== ';') fail(i >= body.length ? 'no terminating ";" found' : `falta «;» después del valor de ${name}`);
      i++;
      out.push({ name, value, quoted: true, negated });
      continue;
    }
    const vstart = i;
    while (i < body.length && body[i] !== ';') i++;
    if (i >= body.length) fail('no terminating ";" found');
    out.push({ name, value: (negated ? '!' : '') + body.slice(vstart, i).trim(), quoted: false, negated: false });
    i++;
  }
  return out;
}

function decodeContent(raw: string): string {
  // |68 61| hex sections become the bytes they name (all printable ASCII in this lab).
  return raw.replace(/\|([0-9A-Fa-f\s]*)\|/g, (_m, hex: string) => {
    const pairs = hex.replace(/\s+/g, '');
    if (pairs.length % 2) fail('contenido hexadecimal con un número impar de dígitos');
    return pairs.replace(/../g, (b) => String.fromCharCode(parseInt(b, 16)));
  });
}

function positiveInt(name: string, raw: string | null): number {
  if (raw === null || !/^-?\d+$/.test(raw)) fail(`invalid character as arg to ${name} keyword`);
  const n = Number(raw);
  if (n < 0 || n > 4294967295) fail(`${name} value too high, max 4294967295`);
  if (n === 0) fail(`${name} value 0 is invalid`);
  return n;
}

// --------------------------------------------------------------------- rule parser

const HEADER = /^(\S+)\s+(\S+)\s+(\S+|\[[^\]]*\])\s+(\S+|\[[^\]]*\])\s+(\S+)\s+(\S+|\[[^\]]*\])\s+(\S+|\[[^\]]*\])\s*\(([\s\S]*)$/;

export function parseRule(text: string, line: number): ParsedRule {
  const header = HEADER.exec(text.trim());
  if (!header) return fail('cabecera incompleta: acción protocolo origen puerto dirección destino puerto (opciones)');
  const [, actionRaw, proto, src, sport, dir, dst, dport, rest] = header;
  const action = actionRaw.toLowerCase();
  if (OTHER_ACTIONS.includes(action)) outside(`la acción ${action} queda fuera del simulador`);
  if (!(ACTIONS as readonly string[]).includes(action)) fail(`acción desconocida: ${actionRaw}`);
  if (proto !== 'dns' && proto !== 'http' && proto !== 'tls') {
    if (OTHER_PROTOS.includes(proto)) outside(`el protocolo ${proto} es válido en Suricata, pero este simulador solo evalúa dns, http y tls`);
    fail(`protocol "${proto}" cannot be used in a signature`);
  }
  if (dir !== '->' && dir !== '<>') fail(`dirección no válida: ${dir} (usa -> o <>)`);
  let body = rest.trimEnd();
  if (body.endsWith(')')) body = body.slice(0, -1);
  const rule: ParsedRule = {
    line, action: action as ParsedRule['action'], proto: proto as SimProto,
    src: parseAddress(src), srcPort: parsePorts(sport), dst: parseAddress(dst), dstPort: parsePorts(dport),
    bidirectional: dir === '<>', msg: '', sid: 0, rev: 1, established: false, matches: [],
  };
  let current: Match | null = null;
  let last: Content | null = null;
  let sidSeen = false;
  let msgSeen = false;
  let directed = false;
  const closeBuffer = () => {
    if (current && current.contents.length === 0) fail(`rule ${rule.sid || '?'} setup buffer ${BUFFER_NAME[current.buffer]} but didn't add matches to it`);
  };
  for (const opt of splitOptions(body)) {
    const { name, value } = opt;
    if (name === 'msg') {
      if (!opt.quoted) fail("invalid formatting to msg keyword: value must be double quoted 'msg'");
      if (msgSeen) outside('dos msg en la misma regla');
      rule.msg = value!; msgSeen = true;
    } else if (name === 'sid') {
      if (sidSeen) fail("duplicated 'sid' keyword detected");
      rule.sid = positiveInt('sid', value); sidSeen = true;
    } else if (name === 'rev') {
      rule.rev = positiveInt('rev', value);
    } else if (IGNORED.has(name)) {
      // Descriptive or performance-only keywords: they do not change what matches.
    } else if (name === 'flow') {
      const parts = (value ?? '').split(',').map((s) => s.trim());
      for (const part of parts) {
        if (part === 'established') rule.established = true;
        else if (part === 'to_server' || part === 'from_client') directed = true; // every event here is a client request
        else if (part === 'to_client' || part === 'from_server') {
          fail('rule mixes keywords with conflicting directions (este laboratorio solo inspecciona peticiones del cliente)');
        } else outside(`flow:${part} queda fuera del simulador`);
      }
    } else if (name in BUFFERS) {
      if (value !== null) fail(`${name} no lleva valor`);
      const buffer = name as Buffer;
      const app = BUFFERS[buffer];
      if (app !== rule.proto) fail(`can't set rule app proto to ${app}: already set to ${rule.proto}`);
      closeBuffer();
      current = { buffer, dotprefix: false, contents: [] };
      rule.matches.push(current);
      last = null;
    } else if (name === 'dotprefix') {
      if (!current) fail('transforms must directly follow stickybuffers');
      if (current.contents.length) outside('dotprefix después de un content: Suricata lo acepta, pero su efecto no es el que parece; colócalo justo tras el buffer');
      if (current.dotprefix) outside('dotprefix repetido queda fuera del simulador');
      current.dotprefix = true;
    } else if (name === 'content') {
      if (!opt.quoted) fail("invalid formatting to content keyword: value must be double quoted 'content'");
      if (!current) outside('content sin sticky buffer: Suricata real lo buscaría en el payload, que este simulador no modela; pon antes dns.query, http.method, http.uri, http.host o tls.sni');
      if (value === '') fail("bad input for keyword content: '\"'");
      const needle = decodeContent(value!);
      if (current.buffer === 'http.host' && needle !== needle.toLowerCase()) {
        fail('el buffer http.host está normalizado en minúsculas: un content con mayúsculas no puede coincidir y Suricata rechaza la regla');
      }
      last = { needle, negated: opt.negated, nocase: false, startswith: false, endswith: false };
      current.contents.push(last);
    } else if (name === 'nocase' || name === 'startswith' || name === 'endswith') {
      if (value !== null) fail(`${name} no lleva valor`);
      if (!last) fail(`${name} needs preceding content option`);
      if (name === 'nocase') {
        if (last.nocase) fail("can't use multiple nocase modifiers with the same content");
        if (current!.buffer === 'http.host') fail('http.host ya está en minúsculas: nocase no está permitido con este buffer');
        last.nocase = true;
      } else if (name === 'startswith') {
        if (last.startswith) fail("can't use multiple depth/startswith settings for the same content");
        last.startswith = true;
      } else {
        if (last.endswith) outside('endswith repetido: Suricata lo acepta, pero no coincide nada; quita el duplicado');
        last.endswith = true;
      }
    } else if (KNOWN_ELSEWHERE.has(name)) {
      outside(`la palabra clave ${name} existe en Suricata, pero queda fuera de este simulador`);
    } else {
      fail(`unknown rule keyword '${name}'.`);
    }
  }
  closeBuffer();
  if (!sidSeen) fail('Signature missing required value "sid".');
  // Recorded divergence: a buffer-less http/tls alert with flow:established plus a direction
  // fires on every request in Suricata 7.0.3 and on none in 8.0.8. The same pass rule behaves
  // alike in both, so pass is modelled; drop and reject were not recorded and stay declined.
  if (rule.matches.length === 0 && rule.established && directed && rule.proto !== 'dns' && rule.action !== 'pass') {
    outside('Suricata 7 y 8 responden distinto a esta regla: sin buffer, con flow:established y una dirección, la 7 alerta con cada petición y la 8 con ninguna. Añade un buffer (http.method, tls.sni…) o quita la dirección');
  }
  return rule;
}

// --------------------------------------------------------------------- file loader

export interface LoadedRules { rules: ParsedRule[]; issues: RuleIssue[] }

export function loadRules(text: string): LoadedRules {
  const rules: ParsedRule[] = [];
  const issues: RuleIssue[] = [];
  const sids = new Set<number>();
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const startLine = i + 1;
    let joined = lines[i];
    while (joined.trimEnd().endsWith('\\')) {
      if (i + 1 >= lines.length) {
        issues.push({ line: startLine, kind: 'unsupported', message: 'la última regla termina en «\\» y no continúa: Suricata la ignora sin avisar' });
        joined = '';
        break;
      }
      joined = joined.trimEnd().slice(0, -1) + lines[++i];
    }
    const trimmed = joined.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    try {
      const rule = parseRule(trimmed, startLine);
      // Suricata reports the line where a multi-line rule ends.
      rule.line = i + 1;
      if (sids.has(rule.sid)) fail(`Duplicate signature: sid ${rule.sid} ya está en uso`);
      sids.add(rule.sid);
      rules.push(rule);
    } catch (err) {
      if (!(err instanceof RuleError)) throw err;
      issues.push({ line: i + 1, kind: err.kind, message: err.message });
    }
  }
  return { rules, issues };
}

// --------------------------------------------------------------------- evaluation

function bufferValue(event: SimEvent, buffer: Buffer): string {
  switch (buffer) {
    case 'dns.query': return event.dns!.query;
    case 'http.method': return event.http!.method;
    case 'http.uri': return event.http!.uri;
    case 'http.host': return event.http!.host.toLowerCase();
    case 'tls.sni': return event.tls!.sni;
  }
}

function contentMatches(value: string, c: Content): boolean {
  const hay = c.nocase ? value.toLowerCase() : value;
  const needle = c.nocase ? c.needle.toLowerCase() : c.needle;
  const hit = c.startswith && c.endswith ? hay === needle
    : c.startswith ? hay.startsWith(needle)
      : c.endswith ? hay.endsWith(needle)
        : hay.includes(needle);
  return c.negated ? !hit : hit;
}

export function ruleMatches(rule: ParsedRule, event: SimEvent, srcPort: number, homeNet: [number, number][]): boolean {
  if (rule.proto !== event.proto) return false;
  const forward = addressMatches(rule.src, event.src, homeNet) && portMatches(rule.srcPort, srcPort)
    && addressMatches(rule.dst, event.dst, homeNet) && portMatches(rule.dstPort, event.dport);
  const backward = rule.bidirectional && addressMatches(rule.src, event.dst, homeNet) && portMatches(rule.srcPort, event.dport)
    && addressMatches(rule.dst, event.src, homeNet) && portMatches(rule.dstPort, srcPort);
  if (!forward && !backward) return false;
  // UDP has no handshake: a DNS query packet is never part of an established flow.
  if (rule.established && event.proto === 'dns') return false;
  return rule.matches.every((m) => {
    const raw = bufferValue(event, m.buffer);
    const value = m.dotprefix ? `.${raw}` : raw;
    return m.contents.every((c) => contentMatches(value, c));
  });
}

export const parseHomeNet = (cidrs: string[]): [number, number][] => cidrs.map((c) => {
  const [addr, bits] = c.split('/');
  return [ipToInt(addr)!, Number(bits)];
});

/** Runs loaded rules over every event, with Suricata's default action order: pass, drop, reject, alert. */
export function evaluate(rules: ParsedRule[], events: SimEvent[], mode: SensorMode, homeNet: [number, number][]): SimAlert[] {
  const alerts: SimAlert[] = [];
  events.forEach((event, index) => {
    const srcPort = 40000 + index;
    const hits = rules.filter((rule) => ruleMatches(rule, event, srcPort, homeNet));
    if (hits.some((rule) => rule.action === 'pass')) return;
    for (const rule of hits) {
      const action: AlertAction = rule.action === 'reject' || (rule.action === 'drop' && mode === 'ips') ? 'blocked' : 'allowed';
      alerts.push({ event: event.id, sid: rule.sid, rev: rule.rev, action, signature: rule.msg, srcPort });
    }
  });
  return alerts;
}

export type Outcome = AlertAction | 'none';

export function outcomeOf(alerts: SimAlert[], eventId: string): Outcome {
  const actions = new Set(alerts.filter((a) => a.event === eventId).map((a) => a.action));
  return actions.has('blocked') ? 'blocked' : actions.size ? 'allowed' : 'none';
}
