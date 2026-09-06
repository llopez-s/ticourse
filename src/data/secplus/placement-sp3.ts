import type { PlacementBlock } from '../../lib/types';

// ---------------------------------------------------------------------------
// pl-sp3 — Placement block for Domain 3: Security Architecture (SY0-701)
//
// Coverage: 3.1 architecture models — cloud, IaC, serverless, microservices,
// network infrastructure (4); 3.2 secure design principles for enterprise
// infrastructure (3); 3.3 protecting data — classification, states, methods
// (3); 3.4 resilience and recovery (2).
//
// Every prompt below is original to this block — none reuse a prompt or
// worked example (check, quiz item, table row, or callout) from
// sp3-part1..4.ts. Each item was checked by hand against every table and
// callout in those four files before writing, and against the disjointness
// test in content.test.ts (which compares normalized quiz prompts).
//
// Design rule this block is built on: every stem supplies triggering facts
// for two or more of its options, so the candidate has to decide which
// concept applies MOST directly rather than matching English. Options stay
// short and unglossed for the same reason — the meaning of each term has to
// come from the candidate, not from the option text.
//
// Keyed index is spread across 0-3 (three each) so option position/length
// cannot be used to guess the answer without the material. See
// docs/superpowers/plans/2026-09-05-placement-test.md for the plan this
// block implements.
// ---------------------------------------------------------------------------
export const SP3_PLACEMENT: PlacementBlock = {
  id: 'pl-sp3',
  sectionId: 'sp3',
  domain: 'Security Architecture',
  title: 'Dominio 3 · Arquitectura de seguridad',
  blurb:
    'Modelos de arquitectura, principios de diseño seguro, protección de datos y resiliencia.',
  questions: [
    {
      id: 'pl-sp3q1',
      domain: 'Security Architecture',
      prompt:
        "A water utility's treatment plant runs control workstations on software whose vendor withdraws support if the operating system is updated. Those workstations must publish flow and chlorine readings every fifteen minutes to a reporting database that engineering and billing staff query from the office network, and the vendor's own technician opens a maintenance session on them once a month from outside the utility. The regulator asks the utility to show how it limits what a compromised workstation could reach. Which approach BEST fits these constraints?",
      choices: [
        'Physical isolation of the control workstations',
        'Logical segmentation with filtered zones',
        'Containerizing the control software on new hosts',
        'Software-defined networking across the plant',
      ],
      answer: 1,
      explain:
        'The readings have to keep reaching a database on the office network and a vendor technician has to reach the workstations monthly, so the design must permit named flows and deny everything else, which is what VLANs, subnets and filtered zones do. Physical isolation is the tempting distractor because the software cannot be patched and it is the strongest boundary there is, but it means no network path exists at all, so both the reporting and the maintenance session would have to stop.',
    },
    {
      id: 'pl-sp3q2',
      domain: 'Security Architecture',
      prompt:
        "A university is choosing how to host a research portal in the cloud. Its grant terms require the university itself to retain the audit logs written by the operating system underneath the portal, and to be able to state which patch level that operating system was running on any past date. The department also wants capacity to follow enrolment-week spikes without anyone ordering hardware in advance. Which cloud service model BEST fits these requirements?",
      choices: [
        'A SaaS research-portal product',
        'A PaaS application platform',
        'IaaS virtual machines',
        'Serverless functions',
      ],
      answer: 2,
      explain:
        "Only in IaaS does the customer rent the machine and therefore own the guest operating system, so it is the one model where the university can hold that system's own logs and decide its patch level, while cloud elasticity still absorbs the enrolment peak. Serverless is the tempting distractor because it answers the spike requirement most directly of all, but the provider owns and hides the operating system beneath a function, which is exactly the limited visibility that comes with that model.",
    },
    {
      id: 'pl-sp3q3',
      domain: 'Security Architecture',
      prompt:
        "A hosting team's quarterly review of its virtualization estate lists four conditions: forty powered-on guests that no team claims and that the patching service has never reached; the build template cloned for every new guest, last updated eighteen months ago; the hypervisor hosts themselves, last updated a year ago; and one production guest restored last month from a stored copy of its disk after a directory was deleted by mistake. A vulnerability the team closed across the whole estate in March is now being reported again on a three-year-old guest that is inventoried, owned and patched every week. Which condition explains that finding?",
      choices: [
        'The restore from a stored disk copy',
        'The age of the guest build template',
        'The unclaimed guests outside patching',
        'The hypervisor hosts a year behind',
      ],
      answer: 0,
      explain:
        "A stored disk copy holds the machine exactly as it was when the copy was taken, so putting it back reinstates every condition of that moment and discards everything applied since, including the fix the team rolled out in March — which is how one long-lived, well-managed guest regresses on its own. The stale build template is the tempting distractor because it really is out of date, but a template only shapes guests cloned from it and this machine has been in service for three years, and the hypervisors' own patch level does not change what is installed inside a guest.",
    },
    {
      id: 'pl-sp3q4',
      domain: 'Security Architecture',
      prompt:
        'A ticketing platform keeps its loyalty-points code, its seat inventory and its card payments in one codebase and starts as a single process, eight copies of which sit behind a load balancer. A memory leak in the loyalty code has twice exhausted that process and taken card payments down with it. Giving the loyalty code more room means standing up more copies of the whole thing, and a fix to the payment code cannot ship until the loyalty team finishes testing, because everything travels on one release train. Which change addresses all three complaints MOST directly?',
      choices: [
        'Adding more servers behind the existing load balancer',
        'Repackaging the platform as containers on a cluster',
        'Clustering the eight servers for automatic failover',
        'Splitting it into independently deployed services',
      ],
      answer: 3,
      explain:
        'Independent services can be scaled, released and made to fail one at a time, and that single property answers all three complaints: a leak that reaches payments, scaling that copies everything, and releases that must travel together. Containers are the tempting distractor because repackaging is the usual modernization step and does make deployments repeatable, but the same coupled code inside a container is still one process on one release train, so the leak still takes payments down with it.',
    },
    {
      id: 'pl-sp3q5',
      domain: 'Security Architecture',
      prompt:
        "A brokerage runs an inline appliance on the link that carries client orders from its trading floor to the exchange. Compliance policy has it inspect the free-text notes attached to those orders for the market-abuse phrases on its watch list, though the exchange archives every order it accepts and compliance reads that archive the same evening. A firmware fault last quarter left the appliance holding traffic for nine minutes, during which the firm could not close positions it had already opened. What should the replacement do when it fails?",
      choices: ['Fail-open', 'Fail-closed', 'Fail-safe', 'Fail-secure'],
      answer: 0,
      explain:
        'Nine minutes of held orders cost money the firm cannot get back, while the notes it could not inspect still reach the exchange archive that compliance reads that evening, so on this link availability outranks inspection and the appliance must keep passing traffic when it dies. Fail-closed is the tempting choice — it is the right answer where letting regulated data pass uninspected is worse than an outage — and fail-secure is simply another name for that same blocking behaviour. Fail-safe belongs to the physical door-lock pair, where a fail-safe lock releases so people can leave and a fail-secure lock stays engaged, prioritising the asset over convenient entry.',
    },
    {
      id: 'pl-sp3q6',
      domain: 'Security Architecture',
      prompt:
        'A bank administers the segment that holds its card-processing servers over three paths that all exist today: database administrators connect from their office desktops, the software vendor keeps a permanent tunnel into that segment for support, and an outsourced operations team signs in through the corporate remote-access service with an account its technicians share. An assessor asks which single change would MOST reduce the number of ways an attacker could reach those servers.',
      choices: [
        'Adding multi-factor authentication to the shared account',
        'Placing an intrusion prevention system in front of the segment',
        'Requiring all administrative access through a jump server',
        'Moving the card servers onto their own VLAN behind a firewall',
      ],
      answer: 2,
      explain:
        'Three independent routes into the segment is the finding, and a jump server collapses them into one hardened, logged and strongly authenticated hop that every administrative session has to cross before it reaches a card server. Multi-factor on the shared account is the tempting distractor because that account is the weakest of the three, but hardening one route leaves the other two exactly as they were, and the question is about how many routes exist.',
    },
    {
      id: 'pl-sp3q7',
      domain: 'Security Architecture',
      prompt:
        "A distribution company finds that a machine nobody owns has been communicating on its office network for three weeks. It sits on a jack in a records store room that has held nothing but boxes since the finance team moved out two years ago. Its network settings were typed in by hand rather than requested, and the identity its adapter reports matches nothing in the company's asset inventory. The company already runs a RADIUS service for its wireless network, and the network team is reviewing four wired measures it had costed and never implemented. Which one would have left this machine communicating exactly as it did?",
      choices: [
        'Filtering by hardware address on each access switch',
        'Reserving an address for each device in the DHCP table',
        '802.1X authentication on the wired access ports',
        'Shutting off switch ports that carry no traffic for a month',
      ],
      answer: 1,
      explain:
        'A reservation only fixes which address a device is handed when it asks for one, and this machine never asked, so the reservation table would never have seen it and it would have sat on that jack exactly as it did. Hardware-address filtering is the tempting distractor because it is the weakest of the four in general, defeated by any adapter told to report a known identity, but this one reported an identity the inventory has never seen, so the switch would have dropped its frames. Extending the RADIUS service to the wired ports would have kept each port unauthorised until a device proved who it was, and a port disabled for want of traffic would have been dead in a room empty for two years.',
    },
    {
      id: 'pl-sp3q8',
      domain: 'Security Architecture',
      prompt:
        'A pharmaceutical company files and publishes a patent describing the exact chemical process behind a new drug-delivery capsule, giving it the exclusive legal right to use that process for the next twenty years. Which data type BEST describes this information?',
      choices: [
        'A company trade secret',
        'Externally regulated data',
        'Confidential legal information',
        'Intellectual property',
      ],
      answer: 3,
      explain:
        'Once the process is patented and published, its protection comes from the legal right the patent grants, which is the defining trait of intellectual property, not from keeping it secret. Trade secret is the tempting distractor because it is the other type built around protecting valuable know-how, but a trade secret loses its status the moment it is filed in a public patent, which is exactly what happened here.',
    },
    {
      id: 'pl-sp3q9',
      domain: 'Security Architecture',
      prompt:
        "A university hospital must classify the register that links each participant in a genetic study to their identity, kept so a participant can have their samples withdrawn later. Three people in the ethics office may open it, and the study clinicians work from a copy in which identities are replaced by codes. The hospital judges that disclosure would let employers and insurers learn participants' inherited disease risks, which cannot be undone and which the ethics board rates as the worst outcome the study could produce. Losing the register would not stop the study, which continues from the coded copy. Which classification is MOST appropriate?",
      choices: ['Sensitive', 'Restricted', 'Confidential', 'Critical'],
      answer: 1,
      explain:
        'Classification follows the impact of disclosure, and here that impact is irreversible harm to identifiable people from information deliberately held to the smallest possible circle, which is the restricted tier. Sensitive is the tempting distractor because health data usually sits there, but sensitive covers exposure that causes moderate damage, and it does not describe an outcome the ethics board rates as the worst the study could produce. Critical would apply if losing or corrupting the register stopped the work, and the scenario says it would not.',
    },
    {
      id: 'pl-sp3q10',
      domain: 'Security Architecture',
      prompt:
        "An insurer's sixty claims handlers all belong to one group that can open every folder on the claims share, because the folders are arranged by year rather than by case. The drives holding that share cannot be read if one is pulled from the array, traffic between the claims floor and the rest of the company crosses a filtered path the auditor checked last month, and the claims application displays each medical annex in full on screen. A handler photographed annexes from cases she had never worked on, and it came to light only when she resigned. Which method would MOST directly have kept her out of the cases she had no part in?",
      choices: [
        'Permission restrictions',
        'Masking of the annex fields',
        'Segmentation of the claims network',
        'Encryption of the share at rest',
      ],
      answer: 0,
      explain:
        "Permission restrictions are how need to know is implemented: folders scoped to the cases a handler actually works, so opening someone else's file is refused rather than merely recorded afterwards. Masking is the tempting distractor because the annexes appear in full on screen, but masking hides part of a value from someone already entitled to open the record and would not have stopped her opening those records at all. Encrypted drives protect the array against a disk walking out and the filtered path protects the network; neither decides which of sixty handlers may open which case.",
    },
    {
      id: 'pl-sp3q11',
      domain: 'Security Architecture',
      prompt:
        'A payments company can afford to lose at most five minutes of transactions and must be processing again within an hour of losing its primary data centre. Its database sits on a storage array in that data centre, and it already rents a second site in another region with servers installed and ready to start. Today it takes one full backup each night to an appliance in the same building as production and copies that backup to a vault in the second region the following morning. Which change BEST meets both targets?',
      choices: [
        'Snapshots of the database volume on the production array',
        'An additional full backup sent to the offsite vault',
        'Replication to the standby site with a change journal',
        'Pre-loading the standby servers with the latest backup',
      ],
      answer: 2,
      explain:
        'Only a copy that leaves for the second region as the changes happen can hold the loss to five minutes, and the journal of those changes is what lets the standby be replayed to the exact moment the primary was lost, on servers that are already installed and ready to start. Pre-loading those servers is the tempting distractor because it aims squarely at the one-hour restart, but the newest backup the company holds was taken last night, so it would come back with a day of transactions missing. Snapshots revert a volume quickly yet sit on the array that disappears with the data centre, an extra full backup still measures its loss in hours, and the vault copy is kept alongside the replica because replication copies deletion and corruption just as faithfully as good data.',
    },
    {
      id: 'pl-sp3q12',
      domain: 'Security Architecture',
      prompt:
        "A ferry operator's recovery plan brings ticketing and berth scheduling back at a second site within four hours, and during a real outage last month it met that target exactly. Even so, not one vessel sailed during those four hours: the gate staff and the harbour office stopped as soon as the screens went dark, and waiting passengers were sent home. The board asks what the plan should have contained.",
      choices: [
        'A hot site so both systems recover in minutes rather than hours',
        'A tabletop exercise run before the next outage',
        "Capacity planning for the recovery team's staffing",
        'Continuity of operations for the essential port functions',
      ],
      answer: 3,
      explain:
        'Continuity of operations is the part of a plan that keeps the essential business functions going while the systems are down — a paper record of who has paid, radio to the berths, a manual boarding list — and it is what would have let the ferries sail during a technical recovery that legitimately took four hours. A hot site is the tempting distractor because it shrinks the outage to minutes, but some gap exists in every incident and the plan would still say nothing about how the port runs while it lasts. Capacity planning for people covers staffing and cross-training for the recovery effort itself, not running the business by hand.',
    },
  ],
};
