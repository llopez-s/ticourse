import type { PlacementBlock } from '../lib/types';

// ---------------------------------------------------------------------------
// pl-s2 — Placement block for Section 2: Análisis de Intrusiones (GCTI)
//
// Coverage: s2m1 Cyber Kill Chain (3), s2m2 Courses of Action matrix (2),
// s2m3 Diamond Model (3), s2m4 activity threads y agrupación de intrusiones
// (2), s2m5 MITRE ATT&CK — escalera tactic/technique/procedure y lectura de un
// mapa de cobertura (2). La Pyramid of Pain no se evalúa aquí: la durabilidad
// de indicadores se mide en el bloque pl-s3.
//
// Every prompt below is original to this block: none reuses a prompt, an
// inline checkpoint, a table row or a worked example from s2.ts. The scenarios
// deliberately avoid the VELVET CICADA / Meridian Dynamics / GLASS VIPER
// narrative so that nothing here can be answered by recall of the lesson
// story instead of by reasoning over the model.
//
// Keyed index is spread across 0-3 (three each) so option position or length
// cannot be used to guess the answer without the material. See
// docs/superpowers/plans/2026-09-05-placement-test.md for the plan this block
// implements.
// ---------------------------------------------------------------------------
export const S2_PLACEMENT: PlacementBlock = {
  id: 'pl-s2',
  sectionId: 's2',
  domain: 'Intrusion Analysis',
  title: 'Sección 2 · Análisis de Intrusiones',
  blurb:
    'Kill Chain, Courses of Action, Diamond Model, activity threads y ATT&CK con la Pyramid of Pain.',
  questions: [
    {
      id: 'pl-s2q1',
      domain: 'Intrusion Analysis',
      prompt:
        "Over three evenings the mail gateway at Thornbury Insurance records several hundred messages from one unfamiliar sender, addressed to a long run of names in the firm's standard address format; most are rejected as unknown recipients. Every message is a single line of plain text with no attachment and no link. Eleven days later, four of the addresses that did not bounce receive an archive whose contents run a loader when opened. Which Kill Chain phase do the earlier messages BEST represent?",
      choices: ['Reconnaissance', 'Weaponization', 'Delivery', 'Exploitation'],
      answer: 0,
      explain:
        "Nothing malicious was transmitted; what the sender obtained was a list of which mailboxes exist, which is research against the target's surface — Reconnaissance. Delivery is the tempting reading because the messages genuinely reached the mail platform, but Delivery is the transmission of the weaponized artifact, and that only happened eleven days later.",
    },
    {
      id: 'pl-s2q2',
      domain: 'Intrusion Analysis',
      prompt:
        "Ardent Polymers installs a routine update for a licensed engineering plug-in, obtained from the vendor's own update service and signed with the vendor's certificate. The installer writes an extra library that the plug-in loads at every start, and that library begins contacting a rented server. Investigators establish that the actor had held privileged access to the vendor's build system for two months and used it as their own staging environment, adding the library there. Within the kill chain of the intrusion against Ardent Polymers, the actor's work on that build system corresponds to which phase?",
      choices: ['Reconnaissance', 'Weaponization', 'Delivery', 'Installation'],
      answer: 1,
      explain:
        "Preparing the artifact happens in space the actor controls and reaches the victim only as something to be inferred from what arrived — that is Weaponization, even though the preparation physically took place on a third party's build system. Delivery is the near miss: the vendor's signed update service is what carried the artifact into Ardent, which is a later step and a different phase.",
    },
    {
      id: 'pl-s2q3',
      domain: 'Intrusion Analysis',
      prompt:
        "A proxy at Pelham Ceramics records a design workstation reaching a public code-hosting service every twenty minutes and retrieving a small text file from a repository created three weeks earlier; the request comes from a program that starts with the user's session. Twice in that period the same workstation pushed a 300 MB archive of tooling drawings and price lists to that repository. The user has no development role. Which phase does the twenty-minute retrieval BEST represent?",
      choices: [
        'Delivery',
        'Installation',
        'Actions on Objectives',
        'Command and Control',
      ],
      answer: 3,
      explain:
        'A short file fetched on a fixed interval from a location the actor controls is how an implant takes its instructions, which is Command and Control whatever service carries it. Actions on Objectives is the tempting reading because the same repository received the stolen drawings, but the phase follows the purpose of the action rather than the infrastructure it runs over: the pushes are the mission, the periodic fetch is the channel.',
    },
    {
      id: 'pl-s2q4',
      domain: 'Intrusion Analysis',
      prompt:
        "A supplier alert tells Kelbrook Pharmaceuticals that a group working its sector reaches file shares through a signed remote-support agent, always launched by a scripting host and always between 01:00 and 04:00. Kelbrook's helpdesk runs that same agent daily under a support contract, its egress proxy can throttle any destination on request, and the company keeps an unused administrative account it could seed as bait. Nothing indicates the group is inside the estate yet. Which course of action fits this behaviour BEST?",
      choices: ['Deny', 'Detect', 'Deceive', 'Degrade'],
      answer: 1,
      explain:
        "The group's use of the agent is separable from the helpdesk's by its parent process and its hour, so a rule that raises an alert on that combination is the action actually available here, and nothing has to be broken to get it. Deny is the tempting choice because the agent is the group's route to the shares, but the same signed tool carries contracted helpdesk work every day and cannot be denied to one party only.",
    },
    {
      id: 'pl-s2q5',
      domain: 'Intrusion Analysis',
      prompt:
        "Ashgrove Health's board sponsor for clinical systems approved a further week of monitored access after the threat team priced both options for her: what continued collection would add, against the exposure of leaving the actor in place. Four days in, the actor authenticates into a regional laboratory network that formed no part of the picture the sponsor approved, and begins listing its file shares. Visibility is intact and nothing has been taken. What should the threat team do FIRST?",
      choices: [
        "Contain the laboratory's hosts now, since the approved scope no longer describes the intrusion",
        'Continue to the end of the approved week, then report the laboratory access in the wrap-up',
        "Pass the decision to the laboratory's own IT manager, who owns the newly affected systems",
        'Put the changed exposure back to the sponsor with a revised gain-and-loss statement',
      ],
      answer: 3,
      explain:
        "The sponsor accepted a risk priced against a set of facts, and those facts have changed materially, so re-pricing them and handing the decision back is the analysts' half of that arrangement — and nothing irreversible has happened yet, so there is time to do it. Containing at once is the tempting move and would be right if data were leaving, but it substitutes the team's own risk appetite for that of the person accountable for the service.",
    },
    {
      id: 'pl-s2q6',
      domain: 'Intrusion Analysis',
      prompt:
        "A small architecture practice's website is compromised and quietly used to host a payload. Two weeks later an employee of Rowan Mutual follows a link in an email and downloads that payload from the practice's site. Analysts are documenting that download as a Diamond event. In this event, which vertex does the practice's web server occupy?",
      choices: ['Adversary', 'Capability', 'Infrastructure', 'Victim'],
      answer: 2,
      explain:
        "In the event being documented the server is the asset that carries the actor's tooling to the target, which is exactly what the Infrastructure vertex holds, whoever happens to own the machine. Victim is the tempting reading because the practice really was compromised — it is the victim of a separate, earlier event, but not of the one on the page.",
    },
    {
      id: 'pl-s2q7',
      domain: 'Intrusion Analysis',
      prompt:
        "Investigators image a server the actor used to stage stolen files and find, beside the collected documents, a spreadsheet listing document titles and part numbers to look for at three named engineering firms. It is dated three weeks before the first of the intrusions and written in a language that appears nowhere in the implant's build artifacts. Which element of the Diamond Model does the spreadsheet MOST directly inform?",
      choices: [
        'The Capability vertex, since the list defines what the tooling was built to collect',
        'The Infrastructure vertex, since the server was staging the collected files for the actor',
        'The customer role in the Adversary vertex, since the list records a tasking',
        'The operator role in the Adversary vertex, since the file sat on their own server',
      ],
      answer: 2,
      explain:
        'A collection requirement written before the intrusions began, in a language foreign to whoever built the implant, points at the party that tasked the operation and stands to benefit from it — the customer inside the Adversary vertex. The operator is the tempting answer because the file sat on a machine the operator ran, but the operator is the entity at the keyboard, and this artifact records what somebody else asked for.',
    },
    {
      id: 'pl-s2q8',
      domain: 'Intrusion Analysis',
      prompt:
        "Working from a single domain named in a partner's report, an analyst first pulls the two addresses that domain has resolved to, then queries a malware repository for samples that contact it and retrieves one implant; unpacking that implant reveals a second domain the report never mentioned. Which pivot describes the step that produced the implant?",
      choices: [
        'Infrastructure → Capability',
        'Capability → Infrastructure',
        'Victim → Capability',
        'Capability → Adversary',
      ],
      answer: 0,
      explain:
        'That step began at a domain, which is an Infrastructure feature, and returned a sample, which is a Capability, so it runs Infrastructure to Capability. Capability to Infrastructure is the tempting answer because the analyst performs that pivot too — but it is the later step, the one where the unpacked implant yielded a second domain.',
    },
    {
      id: 'pl-s2q9',
      domain: 'Intrusion Analysis',
      prompt:
        'A grouping memo at Corbray Analytics argues that two intrusions eleven days apart belong to one activity group, and rests that argument on four shared observations. A reviewer is told to strike whichever of them the grouping cannot rest any weight on. Which observation should be struck?',
      choices: [
        'Both loaders derive their mutex name from the same misspelled English word',
        'Both intrusions opened with a password spray against the same VPN brand',
        'Both victims are the only two licensed pilotage operators for that estuary',
        'Both C2 servers presented self-signed certificates with the same subject string',
      ],
      answer: 1,
      explain:
        'Password spraying is a universal technique and the appliance brand is a choice the two victims made, not anything the actor controls, so unrelated intrusions would share that observation just as readily — it carries no weight of its own. The targeting observation is the tempting strike, because sector overlap alone is weak, but two victims out of a licensed pair hit within eleven days is a specific tasking pattern, which the memo may legitimately count as support.',
    },
    {
      id: 'pl-s2q10',
      domain: 'Intrusion Analysis',
      prompt:
        'Vantia Foods has grouped three intrusions on the strength of a packer that appears in no public sample collection and an identical mistake in the way each implant pins its server certificate; the servers themselves were rented from three different providers in three countries. The board asks what the team can now say about who is behind them. The MOST defensible answer is that the evidence supports:',
      choices: [
        'A common operator or shared tool source, but not who tasked the intrusions',
        'A single state sponsor, since three separate intrusions agree on the tooling',
        'A profit-driven criminal group, since the tooling was purpose-built rather than bought',
        'No relationship at all, since the three sets of servers were unconnected',
      ],
      answer: 0,
      explain:
        'Rare tooling that the actor controls, repeated across intrusions, is what an activity group is built on: it points at the same hands or the same tool source. Naming a sponsor is the tempting jump, but who tasks and benefits from an operation is a separate question that shared code does not answer, and rented infrastructure is expected to differ between intrusions rather than to break the group.',
    },
    {
      id: 'pl-s2q11',
      domain: 'Intrusion Analysis',
      prompt:
        "A campaign report says of a group that 'it steals credentials by dropping its own signed driver hvsvc64.sys into System32\\drivers, opening a handle to lsass.exe through that driver and writing the dump to C:\\ProgramData\\hv.log', and then reuses those credentials to reach file servers. An analyst is asked to place two parts of that sentence on ATT&CK's ladder of abstraction: 'steals credentials', and the description of the driver, the handle and the dump file. Respectively, these are:",
      choices: [
        'A technique and a procedure',
        'A tactic and a technique',
        'A tactic and a procedure',
        'A procedure and a technique',
      ],
      answer: 2,
      explain:
        "'Steals credentials' names the adversary's goal for that step, and goals are tactics; a named driver file, the handle it opens and the path it writes to are this one group's implementation of that step, which is a procedure. 'A tactic and a technique' is the near miss — the technique level would be the general method, dumping credentials from operating-system memory, stated without this group's driver name, handle route and output path.",
    },
    {
      id: 'pl-s2q12',
      domain: 'Intrusion Analysis',
      prompt:
        'Tarnwick Logistics turns a cell of its ATT&CK coverage map green as soon as one deployed rule cites that technique. Most of those rules were written after a single incident last year and match the file paths, the service names and the command strings recorded in it, and the map itself was last rebuilt against an older ATT&CK release. Intelligence now reports that the group most likely to hit freight operators uses a technique whose cell is already green, and the detection lead closes the request for new work on that basis. What should happen before that request is closed?',
      choices: [
        "Confirm the technique appears on the group's public ATT&CK page before spending effort on it",
        'Rebuild the map against the current ATT&CK release so its cells match the report',
        "Recount the green cells and report the quarter's coverage growth to the board",
        'Test the existing rule against an implementation that uses none of the recorded strings',
      ],
      answer: 3,
      explain:
        "A green cell records that a rule exists, not that the technique would be caught in another form, and these rules were built around one incident's paths and strings — so the only thing that answers the request is whether the rule still fires when those change. Checking the group's ATT&CK page is the tempting step, but a group page reports only what has been publicly reported and says nothing about whether Tarnwick's rule covers the technique or just that one implementation.",
    },
  ],
};
