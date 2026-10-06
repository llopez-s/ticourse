/**
 * s02-cadena «Un solo eslabón» — on-screen strings (canon: out/scene-brief.md «Canon», s02). OpenSSL 3's output of
 * `s_client -showcerts` against the portal on Tuesday 10-11 at 08:40 (Halden time; the console's own times are GMT),
 * with only the leaf in the chain. The PEM block is invented and truncated (never a real certificate). No IP, no
 * «Connecting to» line, no session data. Leading spaces and the double space in `Nov  9` are OpenSSL's.
 */

export const HOST = 'reservas.haldenport.example';

/** Shared by s02 and s03: the same command, typed after the console's bare `$ `. */
export const SHOWCERTS_CMD = `openssl s_client -connect ${HOST}:443 -showcerts`;

export type RowTone = 'texture' | 'plain' | 'warn' | 'portal' | 'ca' | 'ok' | 'dim';

export interface ConsoleRowDef {
  /** Stable id the scene uses to light or keep a row. */
  id: string;
  text: string;
  tone: RowTone;
  /** A `(gap)` row: a short blank. */
  gap?: boolean;
}

export const S02 = {
  /** Console title bar: the day and time of the test (Halden time, never on a GMT line). */
  stamp: '10-11 · 08:40',
  rows: [
    { id: 'd0a', text: `depth=0 CN = ${HOST}`, tone: 'plain' },
    { id: 'err20', text: 'verify error:num=20:unable to get local issuer certificate', tone: 'warn' },
    { id: 'r1', text: 'verify return:1', tone: 'texture' },
    { id: 'd0b', text: `depth=0 CN = ${HOST}`, tone: 'plain' },
    { id: 'err21', text: 'verify error:num=21:unable to verify the first certificate', tone: 'warn' },
    { id: 'r2', text: 'verify return:1', tone: 'texture' },
    { id: 'd0c', text: `depth=0 CN = ${HOST}`, tone: 'plain' },
    { id: 'r3', text: 'verify return:1', tone: 'texture' },
    { id: 'sep1', text: '---', tone: 'texture' },
    { id: 'chain', text: 'Certificate chain', tone: 'plain' },
    { id: 's0', text: ` 0 s:CN = ${HOST}`, tone: 'portal' },
    { id: 'i0', text: '   i:CN = Confianza Global TLS Issuing CA 3', tone: 'ca' },
    { id: 'a0', text: '   a:PKEY: id-ecPublicKey, 256 (bit); sigalg: ecdsa-with-SHA384', tone: 'texture' },
    { id: 'v0', text: '   v:NotBefore: Nov  9 00:00:00 2026 GMT; NotAfter: May 27 23:59:59 2027 GMT', tone: 'texture' },
    { id: 'pemA', text: '-----BEGIN CERTIFICATE-----', tone: 'dim' },
    { id: 'pemB', text: 'MIIDKjCCArCgAwIBAgIQCx4r0Zq7Hs1dVnE2kPa9LTAKBggqhkjOPQQDAzBbMQsw…', tone: 'dim' },
    { id: 'pemC', text: '-----END CERTIFICATE-----', tone: 'dim' },
    { id: 'sep2', text: '---', tone: 'texture' },
    { id: 'gap', text: '', tone: 'texture', gap: true },
    { id: 'code21', text: 'Verify return code: 21 (unable to verify the first certificate)', tone: 'warn' },
  ] satisfies ConsoleRowDef[],
  /** Rows kept when the console folds to its evidence (s02-03 on). */
  keep: ['err20', 'chain', 's0', 'i0'],
  tags: {
    issuer: 'emisor',
    error20: 'no encuentro al emisor',
  },
  /** The two free cards (s02-03), then the think prompt's two buttons — «raíz» left, «intermedia» right. */
  options: { root: 'raíz', intermediate: 'intermedia' },
  /** The answer's tags (s02-05). */
  anchorTag: { name: 'raíz · Confianza Global Root', sub: 'ya está en tu equipo' },
  middleTag: { term: 'INTERMEDIATE CA', name: 'Issuing CA 3', missing: 'no ha llegado' },
  /** Exam names (s02-06 `names`). */
  names: { leaf: 'LEAF', root: 'ROOT CA', store: 'TRUST STORE', chain: 'CHAIN OF TRUST' },
  leafSub: HOST,
} as const;
