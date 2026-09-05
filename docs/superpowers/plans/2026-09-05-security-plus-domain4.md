# Security+ Domain 4 Content Plan — Security Operations

> Continuation of the Domain 2/3 plans (same engine, same rules). Section `sp4`, domain tag
> exactly `'Security Operations'`, exam weight **28% — the largest single domain**, nine
> objectives (4.1–4.9), so it gets **11 lessons** instead of 7–8.
> Writing rules identical to Domain 3: Spanish prose with **bold English exam terms**, learner
> addressed as "analista" (feminine), quiz questions/flashcards in English, 4 choices, 0-based
> `answer`, `explain` ≥ 2 sentences (why the winner wins, why the tempting distractor loses),
> varied correct index, ≥3 `check` blocks, ≥1 `table`, ≥1 `callout` kind `exam` per lesson,
> 12–16 blocks, closing bridge paragraph. Scenarios use the Autoridad Portuaria de Halden.

## Files

| File | Export | Content |
|---|---|---|
| `src/data/secplus/sp4-part1.ts` | `SP4_PART1: Module[]` | sp4m1, sp4m2 |
| `src/data/secplus/sp4-part2.ts` | `SP4_PART2: Module[]` | sp4m3, sp4m4 |
| `src/data/secplus/sp4-part3.ts` | `SP4_PART3: Module[]` | sp4m5, sp4m6 |
| `src/data/secplus/sp4-part4.ts` | `SP4_PART4: Module[]` | sp4m7, sp4m8 |
| `src/data/secplus/sp4-part5.ts` | `SP4_PART5: Module[]` | sp4m9, sp4m10 |
| `src/data/secplus/sp4-part6.ts` | `SP4_PART6: Module[]` | sp4m11 |
| `src/data/secplus/sp4.ts` | `SP4_MODULES` | aggregator (scaffolded) |
| `src/data/secplus/sp4-cards.ts` | `SP4_FLASHCARDS`, `SP4_GLOSSARY` | 36 cards `fcp401..fcp436`, 55 glossary terms, all `sectionId: 'sp4'` |
| `src/data/secplus/labs-sp4.ts` | `SP4_LABS`, `SP4_CLASSIFY_DATA`, `SP4_ORDER_DATA`, `SP4_SELECT_DATA` | 3 labs |

## Lessons (SY0-701 objectives 4.1–4.9)

### sp4m1 — "Baselines seguros y hardening por tipo de objetivo" (4.1a) · 7 quiz
**Secure baseline** lifecycle: **establish** (a documented minimum config, from CIS/vendor
benchmarks and your own policy), **deploy** (GPO, MDM, images, IaC), **maintain** (drift
detection, review after each change). **Hardening targets** and what is specific to each:
**workstations** (EDR, disk encryption, no local admin), **servers**, **switches and routers**
(disable unused ports, change defaults, encrypted management, no telnet), **cloud
infrastructure** (IAM, logging, no public storage), **mobile devices**, **ICS/SCADA**
(segmentation and monitoring instead of patching), **embedded systems**, **RTOS**, **IoT
devices** (change defaults, isolate, replace when unsupported). **Sandboxing** (detonate the
unknown in an isolated environment) and **monitoring** as ongoing baseline enforcement. Table:
target → the two hardening steps that matter most → what usually goes wrong. Exam callout: the
expected first answer for a new device class is almost always "apply the secure baseline / change
default credentials", and for OT it is compensating controls, never "patch it". Checks: switch
still answering telnet; drift after an emergency change; sandbox use.

### sp4m2 — "Wireless, movilidad y seguridad de aplicaciones" (4.1b) · 7 quiz
**Wireless installation**: **site survey** (measure real coverage and interference before
deploying) and **heat map** (visualize signal strength; finds dead zones and over-reach beyond
the fence). **Wireless security settings**: **WPA3** (SAE replaces the WPA2 4-way-handshake
weakness, forward secrecy), **AAA/RADIUS** (enterprise mode: each user authenticates
individually), **cryptographic protocols** and **authentication protocols** (**EAP-TLS**
certificates on both sides — strongest; PEAP/EAP-TTLS tunnel the credentials). **Mobile
solutions**: **MDM** (policy, remote wipe, containerization), deployment models — **BYOD**
(cheapest, least control, privacy friction), **COPE** (corporate owned, personally enabled),
**CYOD** (choose from an approved list); **connection methods** cellular, Wi-Fi, Bluetooth.
**Application security**: **input validation** (server side, allow-list), **secure cookies**
(`Secure`, `HttpOnly`, `SameSite`), **static code analysis (SAST)** vs dynamic testing,
**code signing**. Table: model → ownership → control → typical risk. Exam callout: "personal
device, corporate data" → MDM with containerization plus a clear policy; "signal reaches the
car park" → site survey/heat map and power adjustment, not a stronger password. Checks: WPA3 vs
WPA2 enterprise; BYOD wipe dispute; where input validation belongs.

### sp4m3 — "Gestión de activos: adquisición, inventario y retirada" (4.2) · 7 quiz
**Acquisition/procurement**: security requirements in the purchase (supported lifetime, patch
commitments, vendor assessment) — buying is where you inherit risk. **Assignment/accounting**:
**ownership** (every asset has a named owner) and **classification**. **Monitoring/asset
tracking**: **inventory** and **enumeration** (you cannot protect what you do not know you have;
shadow IT and forgotten servers are inventory failures). **Disposal/decommissioning**:
**sanitization** (wipe/crypto-erase so data is unrecoverable, media reusable), **destruction**
(shred, degauss, incinerate), **certification** (a certificate of destruction is your evidence),
**data retention** (keep only as long as policy/law requires — and no longer). Table: medium →
sanitization method → when destruction is required instead. Exam callout: "the drive leaves the
organization" → sanitize or destroy **and get the certificate**; deleting files or a quick format
is never the right answer; **retention** limits are as binding as the obligation to keep data.
Checks: leased laptops returning to the vendor; an unknown server found during a scan; retention
after a project ends.

### sp4m4 — "Gestión de vulnerabilidades I: identificación" (4.3a) · 7 quiz
**Vulnerability scan** (credentialed vs non-credentialed, agent vs agentless), **application
security** testing — **static analysis (SAST)** on source, **dynamic analysis (DAST)** on the
running app, **package monitoring** (dependencies and SBOM). **Threat feeds**: **OSINT**,
**proprietary/third-party**, **information-sharing organizations** (ISAC), **dark web**
monitoring. **Penetration testing** (authorized simulated attack; scope and rules of engagement),
**responsible disclosure program / bug bounty**, **system and process audit**. Table: method →
what it finds that the others miss → cost/effort. Exam callout: a scanner finds *known* flaws, a
pentest finds *chains and business logic*; credentialed scans give far fewer false positives;
"how did they know before us?" points to threat feeds/dark web monitoring. Checks: choosing
credentialed vs non-credentialed; SAST vs DAST for a running third-party app; bug bounty vs
pentest.

### sp4m5 — "Gestión de vulnerabilidades II: análisis, respuesta y validación" (4.3b) · 8 quiz
**Confirmation**: **false positive** (reported but not real — wastes effort and credibility) vs
**false negative** (real but missed — the dangerous one). **Prioritization** inputs: **CVSS**
(severity score, not risk by itself), **CVE** (the identifier), **vulnerability classification**,
**exposure factor**, **environmental variables** (is it internet-facing? is it compensated?),
**industry/organizational impact**, **risk tolerance**. **Response and remediation**:
**patching**, **insurance** (transfer), **segmentation**, **compensating controls**,
**exceptions and exemptions** (documented, time-bounded, approved and reviewed). **Validation**:
**rescanning**, **audit**, **verification**. **Reporting** to owners and management. Table:
situation → the response CompTIA expects. `code` block (lang `text`) showing a short scan
finding with CVE, CVSS, asset exposure and the triage decision. Exam callout: CVSS 9.8 on an
isolated lab box can rank below CVSS 7.5 on the public portal — **context beats score**; a
remediation is not done until it is **revalidated**; an exception must have an owner and an
expiry. Checks: false positive vs false negative impact; unpatchable system response; proof of
remediation.

### sp4m6 — "Alerting y monitorización: actividades y herramientas" (4.4) · 7 quiz
**Monitoring computing resources**: systems, applications, infrastructure. **Activities**: **log
aggregation**, **alerting**, **scanning**, **reporting**, **archiving**, **alert response and
remediation/validation**, **quarantine**, **alert tuning** (cutting noise so real alerts are
seen — the cure for alert fatigue). **Tools**: **SIEM** (aggregate + correlate + alert),
**SCAP** (standard format so scanners and benchmarks interoperate), **benchmarks** (CIS),
**agents vs agentless**, **antivirus**, **DLP**, **SNMP traps**, **NetFlow** (who talked to whom,
how much — not content), **vulnerability scanners**. Table: tool → question it answers → its
blind spot. Exam callout: NetFlow gives **metadata**, a **packet capture** gives **content**;
a flood of identical benign alerts is solved by **tuning**, not by ignoring or by buying another
tool; archiving exists for investigations and compliance, not for daily use. Checks: SIEM vs
NetFlow for "what left the network"; alert tuning; agent vs agentless on an OT segment.

### sp4m7 — "Endurecer capacidades: firewall, IDS/IPS, filtrado, email, DLP, NAC y EDR/XDR" (4.5) · 8 quiz
**Firewall**: **rules** and **access lists**, **ports/protocols**, **screened subnet**; implicit
deny at the end. **IDS/IPS**: **signatures** (known patterns) vs **trends/anomaly**. **Web
filter**: **agent-based** vs **centralized proxy**, **URL scanning**, **content
categorization**, **block rules**, **reputation**. **Operating system security**: **group
policy** (Windows) and **SELinux** (mandatory access control on Linux). **Secure protocols**:
protocol selection (SSH not telnet, HTTPS not HTTP, SFTP not FTP, LDAPS not LDAP), port
selection, transport method. **DNS filtering** (block known-malicious domains before the
connection). **Email security**: **SPF** (which servers may send for the domain), **DKIM**
(signature proving the message was not altered), **DMARC** (policy + reporting that ties SPF and
DKIM to the visible From), **email gateway**. **File integrity monitoring (FIM)**. **DLP**.
**Network access control (NAC)**. **EDR/XDR**. **User behavior analytics (UBA)**. Table: goal →
capability → where it sits. Exam callout: SPF/DKIM/DMARC are the answer to spoofed sender
domains; **implicit deny** means a rule set ends by blocking what is not allowed; FIM answers
"who changed this file"; NAC answers "should this device be on the network at all". Checks:
DMARC vs DKIM alone; screened subnet placement; SELinux/group policy purpose.

### sp4m8 — "IAM: identidades, federación, control de acceso, MFA y PAM" (4.6) · 8 quiz
**Provisioning/deprovisioning** (joiner-mover-leaver; **deprovisioning on the same day** is the
exam answer), **permission assignments and implications** (group-based, permission creep),
**identity proofing**, **federation** (trust between organizations/IdPs), **SSO** with **LDAP**,
**OAuth** (authorization/delegation) and **SAML** (assertions for enterprise web SSO),
**interoperability**, **attestation** (periodic recertification: managers confirm who should
still have access). **Access control models**: **mandatory (MAC)**, **discretionary (DAC)**,
**role-based (RBAC)**, **rule-based**, **attribute-based (ABAC)**, **time-of-day restrictions**,
**least privilege**. **MFA**: implementations — **biometrics**, **hard and soft tokens**,
**security keys**; factors — **something you know / have / are / somewhere you are**.
**Password concepts**: length beats complexity, no reuse, modern guidance discourages forced
periodic expiration, **password managers**, **passwordless**. **PAM**: **just-in-time
permissions**, **password vaulting**, **ephemeral credentials**. Table: model → who decides →
typical use. Exam callout: two things you *have* are still one factor; OAuth authorizes, SAML
authenticates for web SSO; the leaver's account is disabled first, deleted later per retention.
Checks: RBAC vs ABAC; which pair is true MFA; JIT access.

### sp4m9 — "Automatización y orquestación" (4.7) · 7 quiz
**Use cases**: **user provisioning**, **resource provisioning**, **guard rails** (automated
policy that prevents an unsafe configuration), **security groups**, **ticket creation**,
**escalation**, **enabling/disabling services and access**, **continuous integration and
testing**, **integrations and APIs**. **Benefits**: **efficiency/time saving**, **enforcing
baselines**, **standard infrastructure configurations**, **scaling securely**, **employee
retention** (less drudgery), **reaction time**, **workforce multiplier**. **Other
considerations**: **complexity**, **cost**, **single point of failure**, **technical debt**,
**ongoing supportability**. Table: use case → what it removes → what it introduces. Exam
callout: automation's security value is **consistency**, not speed; the classic trap is that the
automation platform itself becomes a **single point of failure** and a privileged target, and
that scripts nobody maintains become **technical debt**. Checks: guard rails; SOAR playbook for
phishing triage; the risk of a credentialed automation account.

### sp4m10 — "Respuesta a incidentes: proceso, pruebas, RCA y threat hunting" (4.8a) · 8 quiz
The seven-phase **incident response process**: **preparation** (plan, roles, tools, training —
the phase that decides how the other six go), **detection**, **analysis**, **containment**
(short-term isolate vs long-term), **eradication** (remove the cause), **recovery** (restore and
monitor), **lessons learned**. **Training** and **testing**: **tabletop exercise** vs
**simulation**. **Root cause analysis** (fix the cause, not the symptom). **Threat hunting**
(proactive search on a hypothesis, without an alert). Ordered `list` of the seven phases with
what "done" looks like in each. Table: phase → goal → typical mistake. Exam callout: **contain
before you eradicate** — pulling the plug can destroy volatile evidence, so isolate (VLAN
quarantine, disable the account) first; "restore from backup" belongs to recovery, and you must
verify the backup predates the compromise. Checks: order of containment vs eradication; tabletop
vs simulation; hunting vs alerting.

### sp4m11 — "Forense digital y fuentes de datos para la investigación" (4.8b + 4.9) · 8 quiz
**Digital forensics**: **legal hold** (suspend deletion the moment litigation is anticipated),
**chain of custody** (who had the evidence, when, unbroken — otherwise it is inadmissible),
**acquisition** (bit-for-bit image, hash before and after, **order of volatility**: memory and
cache before disk), **preservation**, **reporting**, **e-discovery**. **Log data**: **firewall
logs**, **application logs**, **endpoint logs**, **OS-specific security logs**, **IDS/IPS
logs**, **network logs**, **metadata**. **Data sources**: **vulnerability scans**, **automated
reports**, **dashboards**, **packet captures**. `code` block (lang `text`) with a chain-of-custody
form excerpt and a hash-verification line. Table: investigation question → best data source →
why the others fall short. Exam callout: image first and work on the copy, never the original;
hash before and after to prove integrity; a **legal hold** overrides the retention schedule.
Bridge to Domain 5 (governance, risk and compliance).

## Labs (`labs-sp4.ts`)

```ts
export const SP4_LABS: LabMeta[] = [
  { id: 'spl4a', sectionId: 'sp4', title: 'Log Hunt', icon: '🔦', minutes: 10, xp: 100, kind: 'classify',
    brief: 'Doce preguntas de una investigación en el puerto. Para cada una, elige la fuente de datos que la responde: firewall logs, endpoint logs, OS security logs o packet capture. Necesitas ≥80%.',
    mission: { n: 4, briefing: 'Tres de la madrugada: el SOC del puerto detecta actividad rara en la red de la terminal de contenedores. Tienes SIEM, EDR, capturas y logs de todo — y una hora antes de que el CISO pida respuestas. No mires todo: elige para cada pregunta la fuente que de verdad la contesta.' } },
  { id: 'spl4b', sectionId: 'sp4', title: 'Incident Response Drill', icon: '🚨', minutes: 8, xp: 75, kind: 'order',
    brief: 'Ordena las 7 fases del proceso de respuesta a incidentes, de la preparación a las lecciones aprendidas.' },
  { id: 'spl4c', sectionId: 'sp4', title: 'Vulnerability Triage', icon: '🩺', minutes: 10, xp: 100, kind: 'select',
    brief: 'El escaneo mensual devuelve 8 hallazgos y solo hay ventana para 4 esta semana. Elige los 4 que de verdad tocan primero. Cada elección viene con feedback.' },
];
```

- `SP4_CLASSIFY_DATA.spl4a`: categories ids `firewall`, `endpoint`, `oslog`, `pcap` (labels
  "Firewall logs", "Endpoint / EDR logs", "OS security logs", "Packet capture"); 12 items, 3 per
  category, `passPct: 80`. Examples: which external IPs a host contacted and whether the
  connection was allowed → firewall; which process spawned the suspicious binary and its hash →
  endpoint; which account logged on interactively at 03:12 and whether it failed first → OS
  security log; what data was actually sent inside an unencrypted session → packet capture.
  `why` in Spanish naming the decisive reason and why the neighbouring source falls short.
- `SP4_ORDER_DATA.spl4b`: Spanish `prompt`; the 7 IR phases in order (Preparation → Detection →
  Analysis → Containment → Eradication → Recovery → Lessons learned), English `text`, Spanish
  `detail` saying what happens and why it sits there (containment before eradication; lessons
  learned feeds preparation again).
- `SP4_SELECT_DATA.spl4c`: `pickN: 4`, Spanish `prompt` describing the monthly scan of the port's
  systems; 8 options with realistic findings, exactly 4 `good` — the ones combining exposure and
  impact (internet-facing portal with a CVSS 9.1 RCE and a public exploit; the VPN concentrator
  missing an authentication-bypass patch; the domain controller with a privilege-escalation flaw;
  the internet-facing file transfer server with default credentials) — and 4 plausible-but-wrong
  (CVSS 9.8 on an isolated lab VM with no network path; a medium flaw on a system already behind
  a documented compensating control; an informational TLS 1.2 cipher notice; a high finding that
  the team has already confirmed as a false positive), each with a Spanish `why`.

## Flashcards & glossary (`sp4-cards.ts`)

36 flashcards `fcp401..fcp436` covering: baseline lifecycle, hardening per target, sandboxing,
site survey vs heat map, WPA3, EAP-TLS vs PEAP, MDM, BYOD/COPE/CYOD, input validation, secure
cookies, SAST vs DAST, code signing, procurement security, ownership/classification, inventory
and enumeration, sanitization vs destruction vs certification, retention, credentialed vs
non-credentialed scans, package monitoring, threat feeds, pentest vs bug bounty, false positive
vs false negative, CVE vs CVSS, exposure factor and environmental variables, exceptions and
exemptions, revalidation, log aggregation, alert tuning, quarantine, SIEM, SCAP/benchmarks,
agent vs agentless, DLP, SNMP traps, NetFlow vs packet capture, firewall implicit deny, screened
subnet, IDS signatures vs trends, web filter methods, group policy vs SELinux, secure protocol
substitutions, DNS filtering, SPF/DKIM/DMARC, FIM, NAC, EDR/XDR, UBA, provisioning and
deprovisioning, permission creep, federation, LDAP/OAuth/SAML, attestation, MAC/DAC/RBAC/
rule-based/ABAC, MFA factors, password best practices, passwordless, PAM (JIT, vaulting,
ephemeral), automation use cases and pitfalls, the seven IR phases, tabletop vs simulation, RCA,
threat hunting, legal hold, chain of custody, acquisition and order of volatility, e-discovery,
log types.

55 glossary entries (`sectionId: 'sp4'`, English term, Spanish one-liner) covering every bold
term above; closely related pairs may share one entry as long as every term is defined.
