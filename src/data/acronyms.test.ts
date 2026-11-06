import { describe, expect, it } from 'vitest';
import { TRACKS } from './tracks';
import type { TrackId } from '../lib/types';

/**
 * Siglas que aparecen en el contenido de cada itinerario (lecciones, preguntas, tarjetas, labs).
 * Cada una debe figurar, escrita tal cual, en el `term` de alguna entrada del glosario de su
 * itinerario: o con entrada propia («SOC (Security Operations Center)») o añadida al término del
 * concepto («Privileged access management (PAM)»). Si añades contenido con una sigla nueva,
 * añádela aquí y al glosario.
 * Quedan fuera a propósito: nombres en clave de campañas, palabras en mayúsculas de los
 * enunciados (BEST, MOST…), identificadores de casos/vídeos, unidades (MB, GB) y nombres
 * de marcas o certificaciones (CompTIA, GIAC, SANS).
 */
const ACRONYMS: Record<TrackId, string> = {
  gcti: `API APT ASCII ASN AV BIA CA CAD CDN CERT CIA CISO CN CoA CRL CSIRT CSV CT CTI CTL CVE
    CVSS DGA DLP EDR FN FP GEOINT GRU HR HTTPS IANA INT IP IR ISAO IT JSON KAC KPI LNK MASINT MD5
    MFA MSP MSS MZ NDA NS NTP OCSP OPSEC OS OT PDF PE PLA RAT SAN SaaS SHA-1 SHA-256 SIEM SLA SMB
    SOC SSO SVR TIP TLD TLS TLSH TN TP TTP URI URL USB UTC UTF-16LE VM VPN VPS XOR YAML pDNS`,
  secplus: `3DES AES AH AP API APK APT ARM ARP ASLR ASN AV BIOS BMC CASB CCTV CEO CERT CFO CIS CISO
    CN CPU CRM CSF CSP CSPM CSRF DBA DEP DES DH DHCP DISA DLL DMZ DNP3 DNSSEC DoH DoS DoT DR DSS
    EAP-TLS EAP-TTLS EAPOL ECC ECDH ECDHE EFS EOL ERP ESP EXIF FaaS FDE FIDO2 FIPS FTP FTPS GDPR
    GPG GPU gMSA HA HDD HIDS HIPS HMI HR HTTP HTTPS HVAC IaaS IAM iDRAC IdP IKE iLO IP ISAC ISO ISP
    IV JIT KDF KPI LAN LAPS LDAPS LTE MD5 MIME MPLS MSP mTLS NAT NFC NIST NTLM NTP NVMe OIDC OPSEC
    OT OTP PaaS PAN PBKDF2 PBQ PCI PDF PDP PEAP PIN PIR PLC PSK RA RAM RAT RC4 RCA RCE RDP RSA RTU
    SaaS SAE SAN SBOM SFTP SGX SHA-1 SHA-2 SHA-256 SHA-3 SHA-512 SIM SMBv1 SMS SMTP SNMPv1 SNMPv2c
    SNMPv3 SOAR SOC SPAN SPN SSD SSH SSID SSL SSRF STIG SWG TAP TCP TDE fTPM TTP TXT UDP UEBA UEFI
    USB VIP VLAN WEP WHOIS WIDS WIPS WMI WPA2 XML ZTNA`,
};

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\&/]/g, '\\$&');

describe('glossary acronyms', () => {
  for (const track of Object.keys(ACRONYMS) as TrackId[]) {
    it(`${track}: every acronym used in the content has a glossary term`, () => {
      const terms = TRACKS[track].glossary.map((g) => g.term);
      const missing = ACRONYMS[track]
        .split(/\s+/)
        .filter(Boolean)
        .filter((a) => {
          const re = new RegExp(`(^|[^A-Za-z0-9])${escape(a)}s?([^A-Za-z0-9]|$)`);
          return !terms.some((t) => re.test(t));
        });
      expect(missing).toEqual([]);
    });

    it(`${track}: glossary terms are unique`, () => {
      const terms = TRACKS[track].glossary.map((g) => g.term.toLowerCase());
      expect(terms.filter((t, i) => terms.indexOf(t) !== i)).toEqual([]);
    });
  }
});
