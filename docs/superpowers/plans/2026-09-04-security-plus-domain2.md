# Security+ Domain 2 Content Plan — Threats, Vulnerabilities & Mitigations

> Continuation of `2026-09-04-security-plus-track.md` (same engine, same rules). Section `sp2`,
> domain tag exactly `'Threats, Vulnerabilities & Mitigations'`, exam weight 22%.
> Writing rules are the same as Task 11 of the track plan: Spanish prose with **bold English exam
> terms**, learner addressed as "analista" (feminine), quiz questions/flashcards in English,
> 4 choices, 0-based `answer`, `explain` ≥ 2 sentences, varied correct index, ≥3 `check` blocks,
> ≥1 `table`, ≥1 `callout` kind `exam` per lesson, closing bridge paragraph.

## Files

| File | Export | Content |
|---|---|---|
| `src/data/secplus/sp2-part1.ts` | `SP2_PART1: Module[]` | sp2m1, sp2m2 |
| `src/data/secplus/sp2-part2.ts` | `SP2_PART2: Module[]` | sp2m3, sp2m4 |
| `src/data/secplus/sp2-part3.ts` | `SP2_PART3: Module[]` | sp2m5, sp2m6 |
| `src/data/secplus/sp2-part4.ts` | `SP2_PART4: Module[]` | sp2m7, sp2m8 |
| `src/data/secplus/sp2.ts` | `SP2_MODULES` | aggregator (already written) |
| `src/data/secplus/sp2-cards.ts` | `SP2_FLASHCARDS`, `SP2_GLOSSARY` | 28 cards `fcp201..fcp228`, 44 glossary terms, all `sectionId: 'sp2'` |
| `src/data/secplus/labs-sp2.ts` | `SP2_LABS`, `SP2_CLASSIFY_DATA`, `SP2_SELECT_DATA` | 3 labs |

## Lessons (SY0-701 objectives 2.1–2.5)

### sp2m1 — "Actores de amenaza y motivaciones" (2.1) · 7 quiz
Actors: **nation-state** (APT, espionage, well funded, patient), **unskilled attacker** (script
kiddie: uses others' tools, low sophistication), **hacktivist** (ideology, defacement/DDoS/leaks),
**insider threat** (intentional vs unintentional; has authorized access), **organized crime**
(financial: ransomware, fraud, BEC; structured, funded), **shadow IT** (unsanctioned systems
bought/run by staff; not malicious but expands attack surface). Attributes: **internal/external**,
**resources/funding**, **level of sophistication/capability**. Motivations: **data exfiltration,
espionage, service disruption, blackmail, financial gain, philosophical/political beliefs,
ethical (white hat/bug bounty), revenge, disruption/chaos, war**. Table: actor → typical
motivation → resources → sophistication → internal/external. Exam callout: "identify the actor
from the clue" (ideology→hacktivist; custom 0-day + years of patience→nation-state; employee
copying data before leaving→insider; unapproved SaaS→shadow IT). Checks: disgruntled admin;
defacement with political message; department buys its own cloud storage.

### sp2m2 — "Vectores de amenaza y superficie de ataque" (2.2, technical vectors) · 7 quiz
**Message-based** (email, SMS, IM), **image-based** (malicious images/steganography, SVG
scripts), **file-based** (macros, PDFs, executables), **voice call**, **removable device** (USB
drop), **vulnerable software**: **client-based** (agent installed, must be patched) vs
**agentless** (scanned/managed remotely), **unsupported systems/applications** (EOL, no patches),
**unsecure networks**: wireless (open/WEP/evil twin), wired (unsecured ports, no 802.1X),
Bluetooth (bluejacking/bluesnarfing), **open service ports**, **default credentials**, **supply
chain**: managed service providers (MSPs), vendors, suppliers (SolarWinds-style illustration
without naming real orgs is fine; keep generic). Attack surface = sum of entry points; reduce it.
Table: vector → example → first mitigation. Exam callout: "default credentials" and "open
ports" questions → change defaults / disable unused services; MSP compromise = supply chain.

### sp2m3 — "Ingeniería social" (2.2, human vectors) · 8 quiz
**Phishing**, **vishing** (voice), **smishing** (SMS), **spear phishing / whaling** (targeted /
executives), **misinformation vs disinformation** (false info spread unknowingly vs
deliberately), **impersonation**, **business email compromise (BEC)** (spoofed/compromised exec
mailbox asks finance for a transfer), **pretexting** (invented scenario to justify a request),
**watering hole** (compromise a site the target group visits), **brand impersonation**,
**typosquatting** (look-alike domains). Principles that make them work: authority, urgency,
scarcity, familiarity, trust, intimidation, consensus/social proof. Table: technique → channel →
tell-tale sign → control (training, MFA, callback verification, DMARC/SPF/DKIM mention only).
Exam callout: the answer to "how to prevent BEC-style transfers" = out-of-band verification +
dual approval, not "more antivirus". Checks: SMS with parcel link (smishing); CFO email urgent
wire (BEC); fake login page on look-alike domain (typosquatting + phishing).

### sp2m4 — "Vulnerabilidades I: aplicaciones, web, sistema operativo, hardware y zero-day" (2.3) · 7 quiz
**Application**: **memory injection**, **buffer overflow** (input exceeds buffer → overwrite
memory/execution), **race conditions** incl. **time-of-check to time-of-use (TOC/TOU)**,
**malicious update** (poisoned legitimate updater). **OS-based** (unpatched kernel/services,
misconfig). **Web-based**: **SQL injection (SQLi)**, **cross-site scripting (XSS)** (reflected,
stored). **Hardware**: **firmware**, **end-of-life**, **legacy**. **Zero-day** (unknown to vendor,
no patch; mitigate with defense in depth, segmentation, EDR, allow lists). Include `code` block
(lang text) showing a SQLi payload `' OR 1=1 --` and the parameterized-query fix in words. Table:
vuln → root cause → primary fix (input validation/parameterized queries/output encoding/patching/
firmware updates/replacement). Exam callout: "input validation" is the universal answer to
injection-family questions; "TOC/TOU" = race condition.

### sp2m5 — "Vulnerabilidades II: virtualización, cloud, supply chain, criptografía, misconfiguración y móviles" (2.3) · 7 quiz
**Virtualization**: **VM escape** (guest → hypervisor/host), **resource reuse** (data remnants in
reallocated memory/storage). **Cloud-specific** (misconfigured storage buckets, exposed APIs,
shared responsibility gaps, IAM sprawl). **Supply chain**: **service provider**, **hardware
provider** (tampered/counterfeit devices), **software provider** (compromised libraries/updates).
**Cryptographic** (weak/deprecated algorithms: DES, MD5, SHA-1, RC4; short keys; poor key
management; predictable IVs). **Misconfiguration** (default settings, open shares, verbose
errors, permissive ACLs). **Mobile device**: **side loading** (installing apps outside official
stores), **jailbreaking/rooting** (removing OS protections). Table: category → example →
mitigation. Exam callout: "shared responsibility": provider secures infrastructure, customer
secures configuration, data and identities.

### sp2m6 — "Malware e indicadores de actividad maliciosa" (2.4) · 8 quiz
Malware: **ransomware** (encrypts, extortion; double extortion), **trojan** (disguised as
legitimate; RAT), **worm** (self-propagating over network, no user action), **spyware**,
**bloatware** (unwanted preinstalled; not malicious but risk), **virus** (needs host file/user
action; fileless variants), **keylogger**, **logic bomb** (triggers on condition/date),
**rootkit** (kernel/boot-level hiding; hard to detect, reimage). Table: malware → propagation →
key indicator → response. General **indicators**: **account lockout**, **concurrent session
usage**, **blocked content**, **impossible travel**, **resource consumption**, **resource
inaccessibility**, **out-of-cycle logging**, **published/documented** (data on leak sites),
**missing logs**. Exam callout: "logins from two countries 10 minutes apart" = impossible travel;
"scheduled task that wipes data when an employee is removed from payroll" = logic bomb; "CPU
spikes + unknown process" = cryptomining/resource consumption.

### sp2m7 — "Ataques de red, aplicación, criptográficos y de contraseña" (2.4) · 8 quiz
**Physical**: **brute force** (physical), **RFID cloning**, **environmental** (power/HVAC
attacks). **Network**: **DDoS** incl. **amplified** (small request → big response, e.g. DNS/NTP)
and **reflected** (spoofed source so victim receives replies), **DNS attacks** (poisoning,
hijacking, domain shadowing? keep to poisoning/spoofing + hijacking), **wireless** (evil twin,
deauth, rogue AP), **on-path** (formerly man-in-the-middle; intercept/modify), **credential
replay**, **malicious code**. **Application**: **injection**, **buffer overflow**, **replay**,
**privilege escalation**, **forgery** (CSRF / SSRF), **directory traversal** (`../` sequences).
**Cryptographic**: **downgrade** (force weaker protocol/cipher), **collision** (two inputs same
hash), **birthday** (probability math behind finding collisions). **Password**: **spraying** (one
common password × many accounts; evades lockout), **brute force** (many passwords × one account).
Table: attack → indicator → mitigation. `code` block (lang text) showing a directory traversal
URL and a password-spraying log pattern. Exam callout: spraying vs brute force by the *pattern*
(many users, few passwords vs one user, many passwords); DNS amplification = reflected + amplified.

### sp2m8 — "Técnicas de mitigación y hardening" (2.5) · 8 quiz
**Segmentation** (VLANs, zones; limits lateral movement), **access control** (**ACL**,
**permissions**), **application allow list** (vs deny list), **isolation** (sandboxing, air
gap, quarantine), **patching**, **encryption**, **monitoring**, **least privilege**,
**configuration enforcement** (baselines, GPO/MDM, drift correction), **decommissioning**
(sanitize + remove from inventory/DNS/certs). **Hardening techniques**: encryption, **endpoint
protection** (EDR/AV), **host-based firewall**, **host-based intrusion prevention system
(HIPS)**, **disabling ports/protocols**, **default password changes**, **removal of unnecessary
software**. Table: scenario → BEST mitigation. Ordered `list`: a hardening checklist for a new
server. Exam callout: when a question describes lateral movement after one compromised host →
segmentation; "unknown executables keep running" → application allow list; "device leaves the
org" → decommissioning with sanitization. Bridge to Domain 3 (architecture).

## Labs (`labs-sp2.ts`)

```ts
export const SP2_LABS: LabMeta[] = [
  { id: 'spl2a', sectionId: 'sp2', title: 'Threat Actor Lineup', icon: '🎭', minutes: 10, xp: 100, kind: 'classify',
    brief: 'Doce incidentes en la Autoridad Portuaria de Halden. Identifica al actor de amenaza más probable en cada uno: nation-state, organized crime, hacktivist, insider, unskilled attacker o shadow IT. Necesitas ≥80%.',
    mission: { n: 2, briefing: 'Primera semana con el SOC del puerto en marcha y ya hay doce incidentes abiertos. El CISO quiere saber a quién se enfrenta el puerto antes de pedir presupuesto: no se defiende igual de un adolescente con un kit descargado que de un servicio de inteligencia. Atribuye cada incidente al actor más probable por sus motivaciones, recursos y sofisticación.' } },
  { id: 'spl2b', sectionId: 'sp2', title: 'Vector Triage', icon: '🎣', minutes: 10, xp: 100, kind: 'classify',
    brief: 'Clasifica 12 intentos de ingeniería social por técnica: phishing, smishing, vishing, BEC, pretexting, watering hole, typosquatting o impersonation. Necesitas ≥80%.' },
  { id: 'spl2c', sectionId: 'sp2', title: 'Mitigation Picker', icon: '🛠️', minutes: 8, xp: 75, kind: 'select',
    brief: 'Tras un incidente de movimiento lateral, elige las 4 mitigaciones que atacan la causa raíz. Cada elección viene con feedback.' },
];
```

- `SP2_CLASSIFY_DATA.spl2a`: categories ids `nation`, `crime`, `hacktivist`, `insider`, `unskilled`,
  `shadow` (labels "Nation-state", "Organized crime", "Hacktivist", "Insider threat", "Unskilled
  attacker", "Shadow IT"); 12 items, 2 per category; `passPct: 80`.
- `SP2_CLASSIFY_DATA.spl2b`: categories ids `phishing`, `smishing`, `vishing`, `bec`, `pretexting`,
  `watering`, `typosquat`, `impersonation` (labels "Phishing", "Smishing", "Vishing", "BEC",
  "Pretexting", "Watering hole", "Typosquatting", "Impersonation"); 12 items (BEC, phishing,
  pretexting ×2; the rest ×1 or ×2 to reach 12); `passPct: 80`.
- `SP2_SELECT_DATA.spl2c`: `pickN: 4`, prompt (Spanish) describing: an attacker phished one
  workstation, used the local admin password (identical on every PC) to reach the file server on the
  same flat network, and ran an unsigned tool that EDR did not block; 8 options, exactly 4 `good`
  (network segmentation; unique local admin passwords / LAPS-style rotation; application allow
  list; least privilege / remove local admin from users) and 4 plausible-but-wrong (buy a bigger
  firewall appliance; force 30-day password rotation for everyone; block all USB devices; move
  the file server to the cloud), each with a Spanish `why`.

## Flashcards & glossary (`sp2-cards.ts`)

28 flashcards `fcp201..fcp228` covering: 6 actor types (2 cards), actor attributes,
motivations list, message/file/image vectors, client-based vs agentless, supply chain vectors,
phishing family (phishing/spear/whaling), vishing vs smishing, BEC, pretexting, watering hole,
typosquatting, misinformation vs disinformation, buffer overflow, race condition TOC/TOU, SQLi,
XSS, VM escape, resource reuse, side loading vs jailbreaking, zero-day, ransomware, worm vs
virus vs trojan, logic bomb, rootkit, impossible travel, DDoS amplified vs reflected, on-path,
password spraying vs brute force, downgrade/collision/birthday, segmentation, allow list vs deny
list, hardening checklist, decommissioning.

44 glossary entries (`sectionId: 'sp2'`, English term, Spanish one-liner) covering every bold
term above.
