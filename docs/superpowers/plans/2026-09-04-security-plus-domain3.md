# Security+ Domain 3 Content Plan — Security Architecture

> Continuation of `2026-09-04-security-plus-track.md` and `...-domain2.md` (same engine, same
> rules). Section `sp3`, domain tag exactly `'Security Architecture'`, exam weight 18%.
> Writing rules identical to Domain 2: Spanish prose with **bold English exam terms**, learner
> addressed as "analista" (feminine), quiz questions/flashcards in English, 4 choices, 0-based
> `answer`, `explain` ≥ 2 sentences (why the winner wins, why the tempting distractor loses),
> varied correct index, ≥3 `check` blocks, ≥1 `table`, ≥1 `callout` kind `exam` per lesson,
> 12–16 blocks, closing bridge paragraph. Scenarios use the Autoridad Portuaria de Halden.

## Files

| File | Export | Content |
|---|---|---|
| `src/data/secplus/sp3-part1.ts` | `SP3_PART1: Module[]` | sp3m1, sp3m2 |
| `src/data/secplus/sp3-part2.ts` | `SP3_PART2: Module[]` | sp3m3, sp3m4 |
| `src/data/secplus/sp3-part3.ts` | `SP3_PART3: Module[]` | sp3m5, sp3m6 |
| `src/data/secplus/sp3-part4.ts` | `SP3_PART4: Module[]` | sp3m7 |
| `src/data/secplus/sp3.ts` | `SP3_MODULES` | aggregator (scaffolded) |
| `src/data/secplus/sp3-cards.ts` | `SP3_FLASHCARDS`, `SP3_GLOSSARY` | 30 cards `fcp301..fcp330`, 46 glossary terms, all `sectionId: 'sp3'` |
| `src/data/secplus/labs-sp3.ts` | `SP3_LABS`, `SP3_CLASSIFY_DATA`, `SP3_ORDER_DATA` | 3 labs |

## Lessons (SY0-701 objectives 3.1–3.4)

### sp3m1 — "Modelos de arquitectura: cloud, IaC, serverless y microservicios" (3.1) · 7 quiz
**Cloud**: responsibility matrix (**shared responsibility**: provider secures *of* the cloud,
customer secures *in* the cloud — data, identities, configuration), **hybrid considerations**
(two control planes, consistent policy, links), **third-party vendors** in the cloud supply
chain. **Infrastructure as code (IaC)**: config as versioned text → repeatable, reviewable,
drift-free; risk = a bad template deploys the same mistake everywhere, and **secrets in the
repo**. **Serverless**: no OS to patch (provider handles it), customer still owns code, IAM
roles and data; risks = vendor lock-in, limited visibility. **Microservices** vs monolith:
independent deploy/scale, blast-radius reduction, but many more east-west calls to authenticate
(service-to-service auth) and a bigger attack surface of APIs. Table: model → who patches what →
main security gain → main new risk. Exam callout: "who is responsible?" questions — in **IaaS**
the customer patches the guest OS; in **PaaS/serverless** the provider does; data and identities
are *always* the customer's. Checks: misconfigured storage bucket ownership; IaC template
secret; serverless patching responsibility.

### sp3m2 — "Red, on-premises, centralización, virtualización y contenedores" (3.1) · 7 quiz
**Network infrastructure**: **physical isolation / air-gapped** (no network path; transfer by
media — the strongest and the least convenient), **logical segmentation** (VLANs, subnets,
firewall zones), **software-defined networking (SDN)** (control plane separated from data plane,
policy pushed centrally). **On-premises** vs cloud trade-offs (control and latency vs capex and
scaling). **Centralized vs decentralized** (single console, consistent policy, single point of
failure vs local autonomy, inconsistent policy). **Virtualization** (hypervisor, VM isolation,
sprawl, escape) vs **containerization** (shared kernel → weaker isolation than VMs, image
provenance, registry trust, ephemeral). Table: approach → isolation strength → typical risk →
control. Exam callout: containers share the host kernel, so "stronger isolation" answers point
to VMs or physical separation; air gap beats segmentation only when there is truly no bridge
(and USB media becomes the vector). Checks: crane control network with no route to IT; container
escape vs VM escape; SDN benefit.

### sp3m3 — "IoT, ICS/SCADA, RTOS, embedded y consideraciones de arquitectura" (3.1) · 7 quiz
**IoT** (default credentials, no update path, huge fleets), **ICS/SCADA** (availability first,
safety, legacy protocols without authentication, decade-long lifecycles), **RTOS** (deterministic
timing; you cannot simply reboot to patch), **embedded systems** (fixed firmware, vendor-signed
updates or none). **High availability** as an architecture property. The full 3.1 consideration
list applied as decision criteria: **availability, resilience, cost, responsiveness,
scalability, ease of deployment, risk transference, ease of recovery, patch availability,
inability to patch, power, compute**. Table: consideration → question it answers → Halden
example. Exam callout: for OT/ICS the priority order flips to **availability → integrity →
confidentiality**; when a system **cannot be patched**, the expected answer is compensating
controls (segmentation, monitoring, strict access), never "patch it anyway" or "replace it
tomorrow". Also: **risk transference** = insurance/contract, not a technical control. Checks:
PLC that cannot be rebooted; IoT camera fleet with default passwords; which consideration a
scenario is really about.

### sp3m4 — "Asegurar la infraestructura: colocación, zonas, failure modes y appliances" (3.2) · 8 quiz
**Device placement** and **security zones** (untrusted/DMZ/internal/OT/management), **attack
surface**, **connectivity** (wired, wireless, remote paths). **Failure modes**: **fail-open**
(traffic keeps flowing — availability wins; safety systems, some OT) vs **fail-closed** (traffic
stops — security wins; a firewall protecting sensitive data). **Device attributes**: **active vs
passive**, **inline vs tap/monitor**. **Network appliances**: **jump server** (single hardened
entry point for admin access), **proxy server** (forward/reverse), **IDS vs IPS** (detect and
alert vs block; IPS must be inline), **load balancer**, **sensors**. Table: appliance → where it
sits → what it does → failure-mode note. Exam callout: an **IPS** only blocks if it is **inline**
and **active**; a **tap/passive** deployment can never stop an attack, only observe it. A
question that says "must not interrupt production traffic" points to passive/tap or IDS. Checks:
placing a jump server; fail-open vs fail-closed decision for a safety system; IDS placed on a tap.

### sp3m5 — "Firewalls, port security y comunicación segura: VPN, TLS/IPSec, SD-WAN y SASE" (3.2) · 8 quiz
**Firewall types**: **WAF** (HTTP/HTTPS, layer 7, blocks SQLi/XSS), **UTM** (all-in-one appliance
for small sites), **NGFW** (application awareness, user identity, IPS integrated), **layer 4 vs
layer 7** filtering (ports/IPs vs application content). **Port security**: **802.1X** (port-based
network access control; supplicant → authenticator → authentication server) and **EAP** (the
framework 802.1X carries; EAP-TLS uses certificates). **Secure communication/access**: **VPN**
(site-to-site vs remote access; full vs split tunnel), **tunneling** with **TLS** (application
layer, works through NAT/proxies) and **IPSec** (network layer, AH vs ESP, transport vs tunnel
mode), **SD-WAN** (policy-driven WAN over cheap links), **SASE** (SD-WAN + cloud-delivered
security, identity-driven, fits remote work). **Selection of effective controls**: match the
control to the actual risk. Table: need → control → layer. `code` block (lang `text`) sketching
the 802.1X exchange (supplicant → authenticator → RADIUS) and a split vs full tunnel diagram.
Exam callout: "attacks against a public web application" → WAF, not NGFW; "branch offices need
secure, cheap connectivity with cloud security" → SASE; "authenticate the *device* before it gets
an IP" → 802.1X. Checks: rogue laptop in a meeting-room port; WAF vs NGFW; split tunnel risk.

### sp3m6 — "Protección de datos: tipos, clasificaciones, estados y métodos" (3.3) · 8 quiz
**Data types**: **regulated** (law/standard applies: GDPR, PCI DSS), **trade secret**,
**intellectual property**, **legal information**, **financial information**, **human-readable vs
non-human-readable**. **Data classifications**: **public, private, sensitive, confidential,
restricted, critical** (ordered by impact of disclosure; the *owner* classifies).
**General considerations**: **data states** — **at rest** (storage → FDE, database encryption),
**in transit** (network → TLS, IPSec, VPN), **in use** (memory/processing → hardest; enclaves,
masking on screen, least privilege); **data sovereignty** (the law of the country where data
physically lives applies) and **geolocation**. **Methods to secure data**: **geographic
restrictions** (geofencing, region-locked storage), **encryption**, **hashing**, **masking**,
**tokenization**, **obfuscation**, **segmentation**, **permission restrictions**. Table: state →
threat → primary control. Exam callout: "data in use" is the state encryption at rest and TLS do
*not* cover; **sovereignty** questions are answered by *where the data is stored*, not where the
company is headquartered; masking hides part of a value for display, tokenization replaces it
with a reversible token held in a vault, hashing is one-way. Checks: card numbers shown as
****1234; storing EU citizen data in another region; which control protects data in transit.

### sp3m7 — "Resiliencia y recuperación: HA, sitios, backups, pruebas y energía" (3.4) · 8 quiz
**High availability**: **load balancing** (spreads live traffic across active nodes) vs
**clustering** (nodes act as one service, failover of the service itself). **Site
considerations**: **hot** (running, minutes), **warm** (hardware + partial data, hours),
**cold** (space and power only, days), **geographic dispersion** (far enough that one disaster
cannot hit both). **Platform diversity** and **multi-cloud** (one vendor bug or outage should not
take everything down). **Continuity of operations (COOP)** — the manual plan for when systems are
gone. **Capacity planning**: **people, technology, infrastructure**. **Testing**: **tabletop
exercise** (discussion, cheapest), **simulation**, **parallel processing** (DR runs alongside
production), **fail over** (real switch — the only test that proves it works). **Backups**:
**onsite/offsite**, **frequency**, **encryption**, **snapshots**, **recovery**, **replication**,
**journaling**. **Power**: **UPS** (bridges seconds/minutes, protects against sags) and
**generator** (hours/days, needs fuel and testing). Table: site type → cost → recovery time →
when to choose. Ordered `list`: activating a DR plan end to end. Exam callout: an **untested
backup is not a backup** — restore tests are the expected answer; UPS covers the gap *until* the
generator starts; a tabletop exercise validates the *plan*, a failover test validates the
*system*. Bridge to Domain 4 (Security Operations).

## Labs (`labs-sp3.ts`)

```ts
export const SP3_LABS: LabMeta[] = [
  { id: 'spl3a', sectionId: 'sp3', title: 'Zone Defense', icon: '🗺️', minutes: 10, xp: 100, kind: 'classify',
    brief: 'Coloca 12 sistemas de la Autoridad Portuaria en su zona de red correcta: DMZ, red interna, red OT/ICS o red de gestión. Necesitas ≥80%.',
    mission: { n: 3, briefing: 'El plano de red del puerto cabe en una servilleta: todo cuelga del mismo switch, desde la web pública hasta los PLC de las esclusas. Antes de que alguien vuelva a pasearse de una impresora a una grúa, rediseña la segmentación: cada sistema, en su zona.' } },
  { id: 'spl3b', sectionId: 'sp3', title: 'Data Guard', icon: '🗄️', minutes: 10, xp: 100, kind: 'classify',
    brief: 'Para cada situación, elige el método de protección de datos correcto: Encryption, Masking, Tokenization o Permission restrictions. Necesitas ≥80%.' },
  { id: 'spl3c', sectionId: 'sp3', title: 'Continuity Ladder', icon: '🪜', minutes: 8, xp: 75, kind: 'order',
    brief: 'Ordena los 8 pasos de una activación de plan de recuperación, desde la detección de la caída hasta la revisión posterior.' },
];
```

- `SP3_CLASSIFY_DATA.spl3a`: categories ids `dmz`, `internal`, `ot`, `mgmt` (labels "DMZ /
  perimeter", "Internal network", "OT / ICS segment", "Management network"); 12 items, 3 per
  category, `passPct: 80`. Items: public port website, public SFTP for shipping manifests, and
  the reverse proxy → `dmz`; staff file server, HR application, office print server → `internal`;
  crane PLC, lock/sluice SCADA HMI, dockside sensor gateway → `ot`; jump server, switch/router
  management interfaces, backup console → `mgmt`. `why` in Spanish explaining the decisive rule.
- `SP3_CLASSIFY_DATA.spl3b`: categories ids `encryption`, `masking`, `tokenization`,
  `permissions` (labels "Encryption", "Masking", "Tokenization", "Permission restrictions");
  12 items, 3 per category, `passPct: 80`. E.g. laptops that leave the building → encryption;
  support agents seeing only the last 4 digits → masking; storing card numbers for recurring
  billing without holding the PAN → tokenization; only the payroll team can open the salary
  share → permissions.
- `SP3_ORDER_DATA.spl3c`: Spanish `prompt`; 8 steps, English `text`, Spanish `detail`:
  Detect and confirm the outage → Declare the disaster and activate the plan → Notify
  stakeholders and staff roles → Fail over to the warm site → Restore the latest verified backup
  → Verify data integrity and service function → Redirect users to the DR site → Fail back and
  run the post-incident review.

## Flashcards & glossary (`sp3-cards.ts`)

30 flashcards `fcp301..fcp330` covering: shared responsibility per service model, IaC, serverless,
microservices vs monolith, air gap vs logical segmentation, SDN, centralized vs decentralized,
VM vs container isolation, IoT risks, ICS/SCADA priority order, RTOS/embedded patching, the 3.1
consideration list, risk transference, device placement/zones, fail-open vs fail-closed, active
vs passive, inline vs tap, jump server, proxy, IDS vs IPS, load balancer, WAF vs NGFW vs UTM,
layer 4 vs layer 7, 802.1X and EAP, VPN split vs full tunnel, TLS vs IPSec, SD-WAN vs SASE, data
types, data classifications, data states, sovereignty, masking vs tokenization vs hashing, load
balancing vs clustering, hot/warm/cold sites, geographic dispersion, testing types, backup
concepts, UPS vs generator.

46 glossary entries (`sectionId: 'sp3'`, English term, Spanish one-liner) covering every bold
term above; closely related pairs may share one entry as long as every term is defined.
