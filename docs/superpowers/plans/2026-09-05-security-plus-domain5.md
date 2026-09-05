# Security+ Domain 5 Content Plan — Security Program Management & Oversight

> Final domain of the Security+ track. Continuation of the Domain 3/4 plans (same engine, same
> rules). Section `sp5`, domain tag exactly `'Security Program Management & Oversight'`, exam
> weight 20%, six objectives (5.1–5.6) → **8 lessons**.
> Writing rules identical to Domain 4: Spanish prose with **bold English exam terms**, learner
> addressed as "analista" (feminine), quiz questions/flashcards in English, 4 choices, 0-based
> `answer`, `explain` ≥ 2 sentences (why the winner wins, why the tempting distractor loses),
> varied correct index, ≥3 `check` blocks, ≥1 `table`, ≥1 `callout` kind `exam` per lesson,
> 12–16 blocks, closing bridge paragraph. Scenarios use the Autoridad Portuaria de Halden.
> This domain closes the campaign: the last lesson bridges to the exam-prep section (`sp6`).

## Files

| File | Export | Content |
|---|---|---|
| `src/data/secplus/sp5-part1.ts` | `SP5_PART1: Module[]` | sp5m1, sp5m2 |
| `src/data/secplus/sp5-part2.ts` | `SP5_PART2: Module[]` | sp5m3, sp5m4 |
| `src/data/secplus/sp5-part3.ts` | `SP5_PART3: Module[]` | sp5m5, sp5m6 |
| `src/data/secplus/sp5-part4.ts` | `SP5_PART4: Module[]` | sp5m7, sp5m8 |
| `src/data/secplus/sp5.ts` | `SP5_MODULES` | aggregator (scaffolded) |
| `src/data/secplus/sp5-cards.ts` | `SP5_FLASHCARDS`, `SP5_GLOSSARY` | 32 cards `fcp501..fcp532`, 48 glossary terms, all `sectionId: 'sp5'` |
| `src/data/secplus/labs-sp5.ts` | `SP5_LABS`, `SP5_CLASSIFY_DATA`, `SP5_SELECT_DATA` | 3 labs |

## Lessons (SY0-701 objectives 5.1–5.6)

### sp5m1 — "Gobernanza: políticas, estándares, procedimientos y guidelines" (5.1a) · 7 quiz
The document hierarchy and why the exam loves it: **policy** (what and why — mandatory,
approved by leadership, technology-neutral), **standard** (the specific mandatory requirement:
password length, approved ciphers, access control, physical security), **procedure** (the
step-by-step how, including **playbooks**), **guideline** (recommended, *not* mandatory).
Named policies from the objective: **acceptable use policy (AUP)**, **information security
policies**, **business continuity**, **disaster recovery**, **incident response**, **SDLC**,
**change management**. Named procedures: **change management**, **onboarding/offboarding**,
**playbooks**. **Monitoring and revision** — documents have owners and review cycles; a policy
nobody reviews is a finding. Table: document type → mandatory? → who writes it → Halden example.
Exam callout: "employees must not install unapproved software" is a **policy**; "passwords must
be at least 14 characters" is a **standard**; "click here, then there to reset it" is a
**procedure**; "we suggest a passphrase of four words" is a **guideline**. Checks: classify three
statements; who approves a policy; why guidelines are not enforceable.

### sp5m2 — "Estructuras de gobernanza, roles sobre los datos y factores externos" (5.1b) · 7 quiz
**Governance structures**: **boards**, **committees**, **government entities**, **centralized vs
decentralized** governance (one policy for everyone vs local autonomy — speed against
consistency). **Roles and responsibilities for systems and data**: **data owner** (accountable,
classifies, approves access — a business role, not IT), **data controller** (decides the
purpose and means of processing), **data processor** (processes on the controller's
instructions), **data custodian/steward** (implements and maintains the controls day to day;
the steward looks after quality and context). **External considerations**: **regulatory**,
**legal**, **industry**, **local/regional**, **national**, **global** — the same port is subject
to national maritime rules, EU privacy law and industry standards at once. Table: role → decides
what → typical job title at Halden. Exam callout: when a question asks *who approves access to a
dataset*, the answer is the **owner**, never the custodian or the security team; a cloud provider
handling your data on your instructions is a **processor**. Checks: owner vs custodian; a payroll
SaaS's role; centralized vs decentralized trade-off.

### sp5m3 — "Gestión de riesgos I: identificación, evaluación y análisis" (5.2a) · 8 quiz
**Risk identification** (assets, threats, vulnerabilities, existing controls). **Risk
assessment** cadences: **ad hoc**, **recurring**, **one-time**, **continuous**. **Risk
analysis**: **qualitative** (high/medium/low, heat maps — fast, subjective) vs **quantitative**
(money). The formulas the exam expects, with worked numbers:
**SLE = asset value × exposure factor**, **ALE = SLE × ARO**, plus **probability**,
**likelihood**, **impact**. A control is worth buying when its annual cost is below the ALE it
removes. `code` block (lang `text`) with a worked example: the port's crane-scheduling server,
asset value €400,000, exposure factor 25%, ARO 0.5 → SLE €100,000, ALE €50,000, and a €20,000/yr
control → justified. Table: qualitative vs quantitative (input, output, effort, when to use).
Exam callout: exposure factor is the **percentage** of the asset lost in one event, ARO is
**events per year** (0.5 = once every two years), and ALE is the number you compare against the
annual cost of a control. Checks: compute an SLE; compute an ALE; qualitative vs quantitative
choice.

### sp5m4 — "Gestión de riesgos II: registro, apetito, estrategias, reporting y BIA" (5.2b) · 8 quiz
**Risk register**: the living inventory — each entry has a **risk owner**, a description, an
analysis, a response, **key risk indicators (KRIs)** and a **risk threshold**. **Risk
tolerance** (how much variance is acceptable in practice) vs **risk appetite**
(**expansionary / neutral / conservative** — the deliberate stance leadership sets).
**Risk management strategies**: **mitigate** (reduce), **transfer** (insurance, contract),
**accept** (documented, with **exemption/exception**), **avoid** (stop doing the activity).
**Risk reporting** to leadership. **Business impact analysis (BIA)**: **RTO** (how long until it
must be back), **RPO** (how much data you can afford to lose), **MTTR** (mean time to repair),
**MTBF** (mean time between failures). Table: strategy → what it does → Halden example → when it
is wrong. Exam callout: **RTO is time, RPO is data** — RPO drives backup frequency and RTO drives
recovery capability; buying insurance is **transfer**, not mitigation, and it never removes the
obligation; accepting a risk requires a named owner and a review date. Checks: RTO vs RPO from a
scenario; classify a response; who signs off an acceptance.

### sp5m5 — "Riesgo de terceros: evaluación, contratos y monitorización" (5.3) · 7 quiz
**Vendor assessment**: **penetration testing** of the vendor, **right-to-audit clause** (agreed
in the contract *before* you need it), **evidence of internal audits**, **independent
assessments** (SOC 2-style third-party reports), **supply chain analysis**. **Vendor
selection**: **due diligence** (verify before signing) and **conflict of interest**.
**Agreement types**: **SLA** (measurable service levels and penalties), **MOU/MOA**
(memorandum of understanding/agreement — intent, MOA closer to binding obligations), **MSA**
(master service agreement — the umbrella terms), **WO/SOW** (work order / statement of work —
the specific deliverables under the MSA), **NDA** (confidentiality), **BPA** (business partner
agreement — how two partners share responsibility and profit). **Vendor monitoring**,
**questionnaires**, **rules of engagement**. Table: agreement → binding? → what it fixes → when
you use it. Exam callout: an **SLA** is where uptime and response times live; you cannot audit a
vendor unless the **right-to-audit clause** was signed; due diligence is *before* the contract,
monitoring is *after*. Checks: which document defines deliverables; the audit-clause trap;
questionnaire vs independent assessment.

### sp5m6 — "Cumplimiento y privacidad" (5.4) · 7 quiz
**Compliance reporting**: **internal** (to management/board) vs **external** (to regulators,
customers, auditors). **Consequences of non-compliance**: **fines**, **sanctions**,
**reputational damage**, **loss of license**, **contractual impacts**. **Compliance
monitoring**: **due diligence** (investigate before) vs **due care** (act reasonably, ongoing),
**attestation and acknowledgement** (people sign that they have read and understood),
**internal and external** monitoring, **automation** (continuous compliance checks). **Privacy**:
legal implications at **local/regional, national and global** level; **data subject** (the
person the data is about); **controller vs processor** again, this time in the legal sense;
**ownership**; **data inventory and retention**; **right to be forgotten** (erasure on request,
with legal exceptions). Table: consequence → who imposes it → Halden example. Exam callout: **due
diligence = look before you leap, due care = keep acting responsibly**; the right to be forgotten
is not absolute — a legal hold or a statutory retention duty overrides it; you cannot protect or
delete data you have not inventoried. Checks: due care vs due diligence; a deletion request that
conflicts with retention; who the data subject is.

### sp5m7 — "Auditorías, evaluaciones y penetration testing" (5.5) · 8 quiz
**Attestation** (a formal signed statement that something is true). **Internal audits**:
**compliance** checks, the **audit committee**, **self-assessments**. **External**:
**regulatory** examinations, **independent third-party audits** — independence is what gives the
result weight. **Penetration testing** types: **physical**, **offensive** (red team),
**defensive** (blue team), **integrated** (purple team); environment knowledge — **known
environment** (white box), **partially known** (grey box), **unknown environment** (black box);
**reconnaissance**: **passive** (public sources, nothing touched) vs **active** (scanning and
probing, visible in the target's logs). Table: test type → what it simulates → what it proves.
Exam callout: **unknown environment** simulates an outsider with no inside knowledge but costs
more time; **passive reconnaissance** leaves no trace in the target's logs while active does; an
audit checks *compliance with a standard*, a penetration test checks *whether it can actually be
broken*. Checks: black box vs white box choice; passive vs active recon; audit vs pentest.

### sp5m8 — "Concienciación: programa, phishing y comportamiento anómalo" (5.6) · 7 quiz
**Phishing**: **campaigns** (simulated phishing to measure and teach), **recognizing an
attempt**, **responding to reported suspicious messages** (report → triage → feedback to the
reporter, so people keep reporting). **Anomalous behavior recognition**: **risky**,
**unexpected**, **unintentional**. **User guidance and training**: **policy/handbooks**,
**situational awareness**, **insider threat**, **password management**, **removable media and
cables**, **social engineering**, **operational security (OPSEC)**, **hybrid/remote work**.
**Reporting and monitoring**: **initial** and **recurring**; metrics that matter (report rate,
not just click rate). Program lifecycle: **development** then **execution**, then measure and
revise. Ordered `list`: building the awareness programme end to end. Table: audience → risk →
training focus. Exam callout: punishing people who click destroys the reporting culture — the
metric to raise is the **report rate**; awareness training is a **recurring** control, not a
one-off at onboarding. Closing paragraph: this completes the five domains — bridge to `sp6`
(exam format, PBQ strategy) and the timed simulacros.

## Labs (`labs-sp5.ts`)

```ts
export const SP5_LABS: LabMeta[] = [
  { id: 'spl5a', sectionId: 'sp5', title: 'Governance Docs', icon: '📚', minutes: 10, xp: 100, kind: 'classify',
    brief: 'Clasifica 12 documentos y frases del programa de seguridad del puerto: policy, standard, procedure o guideline. Necesitas ≥80%.',
    mission: { n: 5, briefing: 'Última misión. El consejo de la Autoridad Portuaria convoca una auditoría externa y pide «la documentación del programa de seguridad». Lo que hay es una carpeta compartida con 12 archivos sin clasificar. Ordénalos por lo que realmente son: solo así el auditor verá un programa y no un montón de papeles.' } },
  { id: 'spl5b', sectionId: 'sp5', title: 'Agreement Desk', icon: '📝', minutes: 10, xp: 100, kind: 'classify',
    brief: 'Doce situaciones con proveedores del puerto. Elige el acuerdo que corresponde: SLA, MOU, MSA, SOW, NDA o BPA. Necesitas ≥80%.' },
  { id: 'spl5c', sectionId: 'sp5', title: 'Risk Math', icon: '🧮', minutes: 8, xp: 75, kind: 'select',
    brief: 'Un riesgo cuantificado del puerto, ocho afirmaciones. Elige las 4 correctas sobre SLE, ALE y la decisión de control.' },
];
```

- `SP5_CLASSIFY_DATA.spl5a`: categories ids `policy`, `standard`, `procedure`, `guideline`
  (labels "Policy", "Standard", "Procedure", "Guideline"); 12 items, 3 per category,
  `passPct: 80`. English `text` quoting the document or sentence, Spanish `why` naming the
  decisive test (mandatory vs recommended; what/why vs how; specific technical requirement vs
  step-by-step instructions).
- `SP5_CLASSIFY_DATA.spl5b`: categories ids `sla`, `mou`, `msa`, `sow`, `nda`, `bpa` (labels
  "SLA", "MOU", "MSA", "SOW", "NDA", "BPA"); 12 items, 2 per category, `passPct: 80`.
- `SP5_SELECT_DATA.spl5c`: `pickN: 4`, Spanish `prompt` with the numbers: the port's container
  terminal management system is valued at **€400,000**; a ransomware event would destroy **25%**
  of its value (**exposure factor 0.25**) and is expected **once every two years**
  (**ARO 0.5**); an offered backup-and-EDR package costs **€20,000 per year**. Eight statements,
  exactly 4 `good`:
  - good: "The SLE for this risk is €100,000" (400,000 × 0.25);
  - good: "The ALE for this risk is €50,000" (100,000 × 0.5);
  - good: "At €20,000 per year the control is financially justified, because it costs less than
    the €50,000 annual expected loss";
  - good: "Buying cyber-insurance instead would be a risk transfer, and it would not remove the
    port's duty to protect the data";
  - wrong: "The SLE is €400,000, because that is what the system is worth";
  - wrong: "The ALE is €200,000" (mis-multiplying);
  - wrong: "An ARO of 0.5 means the event happens twice a year";
  - wrong: "Because the CVSS score of the underlying vulnerability is 9.8, the risk must be
    accepted as critical regardless of the numbers".
  Each with a Spanish `why` explaining the arithmetic or the concept.

## Flashcards & glossary (`sp5-cards.ts`)

32 flashcards `fcp501..fcp532` covering: policy vs standard vs procedure vs guideline, the named
policies, playbooks, monitoring and revision, governance structures, centralized vs
decentralized, data owner/controller/processor/custodian/steward, external considerations, risk
identification, assessment cadences, qualitative vs quantitative, EF, SLE, ARO, ALE, risk
register, KRI, risk threshold, risk tolerance vs appetite, the four strategies, exemption vs
exception, risk reporting, BIA, RTO, RPO, MTTR, MTBF, right-to-audit clause, due diligence vs due
care, independent assessment, supply chain analysis, SLA, MOU/MOA, MSA, SOW, NDA, BPA, vendor
monitoring, rules of engagement, compliance reporting, consequences of non-compliance,
attestation and acknowledgement, data subject, right to be forgotten, data inventory and
retention, internal vs external audit, audit committee, self-assessment, pentest types
(physical/offensive/defensive/integrated), known/partially known/unknown environment, passive vs
active reconnaissance, phishing campaigns, anomalous behavior categories, awareness training
topics, initial vs recurring reporting.

48 glossary entries (`sectionId: 'sp5'`, English term, Spanish one-liner) covering every bold
term above; closely related pairs may share one entry as long as every term is defined.

## After this domain

Domain 5 completes the Security+ track: all five content sections have lessons, so every boss is
playable, the campaign "Operación GLASS HARBOR" can be finished (achievement `sp-campaign`), and
the weighted 90-question mock exam samples from all five domains at their real weights. Update
`content.test.ts`, README, CLAUDE.md, PROJECTS.md and the memory note accordingly.
