/**
 * s05-ocsp «Un justificante recién sellado» — on-screen strings (canon: out/scene-brief.md «Canon»,
 * s05). The console is OpenSSL's `-status`, «martes 10-11» (no stapled response) and «jueves 12-11»
 * (stapling on). The chain is fixed since 10-11 09:10, so no `depth=` / `Verify return code` line is
 * drawn here at all. Never a Responder Id, Produced At, serial, hash or signature: a gap stands in.
 * Next Update is 12-11 20:00 GMT (never Nov 19). Console times are GMT and are never relabelled.
 */

import { HOST } from './s04-revocar';

/** s05-01: «la otra dirección» = the OCSP URL from s04's console. */
export const OCSP_URL = '    OCSP - URI:http://ocsp.confianza.example';

/** s05-02: OCSP's three costs (the third is screen-only). */
export const COSTS = ['cola (latencia)', 'policía saturada (carga en la CA)', 'sabe dónde duerme cada cual (privacidad)'] as const;
export const NOW = 'al momento';

export const OCSP = { term: 'OCSP', sub: 'preguntar a la CA al momento' } as const;

/** s05-03: the receipt. */
export const NOTE = ['un justificante de la policía', 'sellado', 'de esta mañana'] as const;
/** Under «recepción»: it only checks the seal. */
export const SEAL_ONLY = 'solo comprueba el sello';

/** s05-04: the portal does the same. */
export const PORTAL = { cert: `CN = ${HOST}`, response: ['respuesta', 'OCSP'] } as const;
export const STAPLING = { term: 'OCSP STAPLING' } as const;

/** s05-05: the demo. */
/** The console's title stamp: Tuesday, then Thursday (the voice says «el martes», «el jueves»). */
export const DAY_BEFORE = '10-11';
export const DAY_AFTER = '12-11';
export const IMPROVEMENT = 'OCSP stapling en el portal · Infraestructura · 12-11';
export const CONSOLE_TITLE = 'consola';
export const CMD = `openssl s_client -connect ${HOST}:443 -status`;

/** 10-11: no stapled response. */
export const BEFORE = {
  texture: 'CONNECTED(00000003)',
  result: 'OCSP response: no response sent',
} as const;

/** 12-11: the stapled response (OpenSSL's header, then its 4-space indent). */
export const AFTER = {
  header: ['OCSP response:', '======================================', 'OCSP Response Data:'] as const,
  status: '    OCSP Response Status: successful (0x0)',
  good: '    Cert Status: good',
  thisUpdate: '    This Update: Nov 12 08:00:00 2026 GMT',
  nextUpdate: '    Next Update: Nov 12 20:00:00 2026 GMT',
} as const;

/** Where to look, beside the two dates and the response. */
export const FRESH = ['sellada esta mañana', 'caduca esta noche', 'el portal pide otra antes'] as const;
export const SIGNED = ['la firma la CA', 'la trae el portal (grapada)'] as const;
