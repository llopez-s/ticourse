/**
 * The three findings of the 1-10 monthly scan, as every scene prints them (canon: storyboard.json + the V18 ficha,
 * «Canon nuevo»). Hosts, CVE numbers, CVSS vectors and versions are ON SCREEN ONLY: the voice never reads them.
 * Date idiom (decided once for the whole video, V12's): day-month without a leading zero, lower-case, date first —
 * «jueves 1-10 · 09:00», «lunes 5-10 · 08:30», «1-10 · 18:00», «1-04-2027» (the ficha's own canon string).
 * Severity words are English, as the storyboard writes them: 9.8 is CRITICAL, 8.1 is HIGH (never CRITICAL).
 * The CVE numbers are invented: they carry «datos ficticios».
 */

export type Sev = 'CRITICAL' | 'HIGH';

export interface Finding {
  host: string;
  /** Plain-words description under the host. */
  what: string;
  cve: string;
  score: string;
  sev: Sev;
  /** «CVSS v3.1». */
  version: string;
  vector: string;
}

export const SRV_MSG01: Finding = {
  host: 'srv-msg01',
  what: 'ejecución remota de código en el servicio de mensajería',
  cve: 'CVE-2026-40218',
  score: '9.8',
  sev: 'CRITICAL',
  version: 'CVSS v3.1',
  vector: 'AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
};

export const SRV_MSG02: Finding = { ...SRV_MSG01, host: 'srv-msg02' };

export const CAM_NVR02: Finding = {
  host: 'cam-nvr-02',
  what: 'grabador de las cámaras del recinto',
  cve: 'CVE-2026-38105',
  score: '8.1',
  sev: 'HIGH',
  version: 'CVSS v3.1',
  vector: 'AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:H',
};

export const FICTIONAL = 'datos ficticios';
