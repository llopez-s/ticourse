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
        "An insurance company integrates a third-party claims-processing vendor and grants it a persistent API credential with write access to the insurer's own policy database, so approved claims update automatically. Eight months later the vendor discloses that attackers breached its systems and used stored customer integration credentials — including the insurer's — to alter records inside several client databases. Which architecture risk does this incident MOST directly illustrate?",
      choices: [
        "Configuration drift between the insurer's staging and production database schemas",
        'Third-party vendor risk from a supply-chain integration with internal access',
        'Vendor lock-in that makes it costly for the insurer to replace the claims vendor',
        'A hybrid policy gap between two control planes the insurer manages itself',
      ],
      answer: 1,
      explain:
        "The vendor's own compromised credential, already holding write access into the insurer's database, is exactly the third-party/supply-chain exposure this objective warns about: the vendor's security becomes the insurer's own. A hybrid policy gap is the tempting distractor because it also involves two systems interacting, but that concept describes inconsistent policy between an organization's own on-premises and cloud environments, not a breach that arrives through an external vendor's credential.",
    },
    {
      id: 'pl-sp3q2',
      domain: 'Security Architecture',
      prompt:
        "An online retailer rebuilds its order-confirmation workflow as serverless functions wired directly to one cloud provider's proprietary event triggers and storage notifications. Two years later, finance asks engineering to move the workload to a cheaper provider, and engineering reports that most of the event-handling code must be rewritten because it depends entirely on that provider's own trigger and integration APIs. Which serverless concern does this MOST directly illustrate?",
      choices: [
        "Vendor lock-in from building the workflow around one provider's proprietary triggers",
        'Reduced visibility from being unable to install monitoring agents on the runtime',
        'An execution role granted far more permissions than the function actually needs',
        "Configuration drift between the retailer's staging and production function definitions",
      ],
      answer: 0,
      explain:
        "Building event handling around one provider's own trigger and integration format is exactly the vendor lock-in this objective associates with serverless: leaving means rewriting the application, not just redeploying it. Reduced visibility is the tempting distractor because it is also a real serverless trade-off, but it concerns the inability to monitor the runtime layer, which has nothing to do with why this code resists moving to another provider.",
    },
    {
      id: 'pl-sp3q3',
      domain: 'Security Architecture',
      prompt:
        "A university's virtualization team patches every production virtual machine to close a critical vulnerability. Three months later, an administrator restores one of those machines from a snapshot taken before the patch, intending only to recover a deleted configuration file, and returns it to service. A vulnerability scan later finds the same critical flaw active again on that host. Which virtualization risk does this MOST directly illustrate?",
      choices: [
        'VM escape from the restored guest into the underlying hypervisor',
        'The restore brought back an already-patched vulnerability',
        'VM sprawl from virtual machines that were never decommissioned',
        'Container escape caused by a kernel vulnerability shared with the host',
      ],
      answer: 1,
      explain:
        "A snapshot freezes the system's state at the moment it was captured, so restoring one brings back every condition that existed then, including a vulnerability patched afterward — exactly what the scan found. VM sprawl is the tempting distractor because it also involves forgotten machine state causing exposure, but sprawl describes machines nobody tracks or retires, not a deliberate restore that rewinds a maintained, actively used host.",
    },
    {
      id: 'pl-sp3q4',
      domain: 'Security Architecture',
      prompt:
        "A manufacturing plant's robotic assembly line has a safety controller that must issue a stop command within a few milliseconds of a sensor trip, a delay that any round trip to a distant data center would exceed. The plant also wants to avoid the capital cost of owning a server room for its other, less time-sensitive back-office applications. Which combination BEST fits both needs?",
      choices: [
        'Keep the safety controller on-premises, and move the back-office applications to the cloud',
        'Move the safety controller to the cloud for elastic scaling, and keep back-office on-premises',
        'Move both the safety controller and the back-office applications to the cloud',
        'Keep both the safety controller and the back-office applications on-premises',
      ],
      answer: 0,
      explain:
        'Keeping the safety loop local avoids any network round trip that could blow the millisecond budget, while shifting the non-time-sensitive workload to the cloud trades capital expense for operating expense exactly where that trade is safe. Moving the safety controller to the cloud is the trap: no cloud region can guarantee a round trip low enough for a millisecond-scale safety stop, no matter how elastic its scaling is.',
    },
    {
      id: 'pl-sp3q5',
      domain: 'Security Architecture',
      prompt:
        "A physical security consultant is designing the electronic door lock for a data center that holds no life-safety equipment and sits nowhere on a fire evacuation route. Management's requirement is that an intruder who deliberately cuts power to the building must not be able to make the lock release. Which failure mode should the door be configured to use?",
      choices: [
        'Fail-safe, so the lock releases whenever power is lost',
        'A mechanical keyed override that bypasses the electronic lock entirely',
        'Fail-secure, so the lock stays engaged whenever power is lost',
        'A dual-custody lock that always requires two badges regardless of power',
      ],
      answer: 2,
      explain:
        'A lock engineered to stay engaged when power is cut is fail-secure, the right choice when protecting a room with no life-safety function outweighs briefly inconveniencing anyone trying to exit through that specific door. Fail-safe is the tempting distractor because it is the other failure mode taught for physical locks, but a fail-safe lock would release for the intruder exactly as they hoped, which is the outcome this design exists to prevent.',
    },
    {
      id: 'pl-sp3q6',
      domain: 'Security Architecture',
      prompt:
        "A law firm configures a site-to-site tunnel between two offices using IPSec with only the Authentication Header (AH) protocol, believing traffic between the offices is now fully protected. A packet capture taken between the two gateways later shows every packet's contents are still readable in plain text, even though each packet's origin and integrity can be verified. What did the firm overlook when choosing AH alone?",
      choices: [
        'AH authenticates the sender and checks integrity, not confidentiality',
        'AH can only run in transport mode and cannot connect two separate gateways',
        'AH requires a TLS certificate on each gateway that was never issued',
        "AH only protects traffic sent over UDP, and the firm's traffic used TCP",
      ],
      answer: 0,
      explain:
        'AH guarantees a packet came from the claimed sender and was not altered, but it was never designed to provide confidentiality, so the payload stays in clear text exactly as the capture shows; ESP is the IPSec protocol that adds encryption. Restricting AH to transport mode is the tempting distractor because both modes are real IPSec concepts, but AH can run in tunnel mode too — the gap here is confidentiality, not which mode was chosen.',
    },
    {
      id: 'pl-sp3q7',
      domain: 'Security Architecture',
      prompt:
        "A company places a single load balancer in front of five application servers to provide high availability and horizontal scaling. Six months later, that load balancer's power supply fails, and even though all five application servers stay healthy, the entire service becomes unreachable. Which design flaw does this outcome illustrate?",
      choices: [
        'The application servers were never configured for session persistence',
        'The load balancer had no redundant standby pair',
        'The health checks on the load balancer were tuned too aggressively',
        'The application servers should have been placed behind a reverse proxy',
      ],
      answer: 1,
      explain:
        "A load balancer exists to remove single points of failure among the servers behind it, but with only one load balancer in the design, that device becomes the very single point of failure the architecture was meant to eliminate. Session persistence is the tempting distractor because it is a real load-balancing concept, but it concerns keeping one user's requests on the same backend server, not what happens when the balancer itself loses power.",
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
        'A defense contractor limits access to the source code for its missile-guidance software to four named engineers, each of whom must pass an additional background check beyond their normal clearance before being added, and every access to the repository is logged and reviewed weekly by a compliance officer. Which classification level is this handling MOST consistent with?',
      choices: ['Confidential', 'Sensitive', 'Restricted', 'Critical'],
      answer: 2,
      explain:
        'A minimal, named circle of specially vetted people, combined with logged and periodically reviewed access, matches restricted, the level reserved for information whose exposure would be severe. Confidential is the tempting distractor because it also limits access to a defined group, but confidential handling stops at labeling and confidentiality agreements for a broader internal group, not named individuals cleared through extra vetting with recurring access review.',
    },
    {
      id: 'pl-sp3q10',
      domain: 'Security Architecture',
      prompt:
        "A consultant's laptop is stolen from a parked car. The laptop never had disk encryption enabled, and it held a local, unencrypted copy of a client's spreadsheet containing employee salary data. Which control, if it had been enabled beforehand, would have MOST directly kept the thief from reading that spreadsheet?",
      choices: [
        "A VPN client configured for the consultant's remote access",
        'Masking the salary figures within the spreadsheet application',
        'Tokenizing the employee identifiers in the spreadsheet',
        'Enabling full-disk encryption on the laptop',
      ],
      answer: 3,
      explain:
        "Once the laptop is out of the consultant's hands, only encrypting the data at rest keeps someone holding the physical drive from reading its contents, which is exactly what full disk encryption provides. A VPN is the tempting distractor because it is also a real control the consultant might use, but a VPN protects data while it travels across a network, and this file never had to travel anywhere to be exposed — it was sitting on the stolen disk the whole time.",
    },
    {
      id: 'pl-sp3q11',
      domain: 'Security Architecture',
      prompt:
        'An e-commerce company runs identical copies of its checkout service on two different public cloud providers, splitting live customer traffic between them so that a regional outage at either provider only removes half of total capacity rather than the whole service. Which resilience approach does this design represent?',
      choices: [
        'Platform diversity',
        'Continuity of operations',
        'Multi-cloud systems',
        'Geographic dispersion',
      ],
      answer: 2,
      explain:
        "Running the same service across two separate cloud providers so that one provider's outage cannot take down the whole system is the definition of a multi-cloud design. Platform diversity is the tempting distractor because it is also about avoiding a shared point of failure, but platform diversity means varying the vendor, OS or firmware within an otherwise similar deployment, not splitting live production across two distinct cloud providers.",
    },
    {
      id: 'pl-sp3q12',
      domain: 'Security Architecture',
      prompt:
        'A bank wants to prove that its disaster recovery environment can correctly process real transaction volume before trusting it during an actual failover, but compliance rules forbid interrupting the live production ledger to run the test. The team feeds the same live transactions to both the production system and the recovery environment at the same time and compares the results. Which type of test does this describe?',
      choices: [
        'A tabletop exercise walking through the scenario',
        'A live simulation exercise of the disaster scenario',
        'An actual fail over test to the recovery site',
        'A parallel processing test against production',
      ],
      answer: 3,
      explain:
        'Running the recovery environment against the same live data as production, without ever switching customers over, and comparing outputs is exactly what a parallel processing test does — it proves the backup system works while production keeps running untouched. A fail over test is the tempting distractor because it is the most rigorous test in this family, but fail over actually switches live production to the alternate site, which is precisely what the compliance rule here forbids.',
    },
  ],
};
