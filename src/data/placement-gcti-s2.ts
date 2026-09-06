import type { PlacementBlock } from '../lib/types';

// ---------------------------------------------------------------------------
// pl-s2 — Placement block for Section 2: Análisis de Intrusiones (GCTI)
//
// Coverage: s2m1 Cyber Kill Chain (3), s2m2 Courses of Action matrix (2),
// s2m3 Diamond Model (3), s2m4 activity threads y agrupación de intrusiones
// (2), s2m5 MITRE ATT&CK y la Pyramid of Pain (2).
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
        "Ardent Polymers installs a routine update for a licensed engineering plug-in, obtained from the vendor's own update service and signed with the vendor's certificate. The installer writes an extra library that the plug-in loads at every start, and that library begins contacting a rented server. Investigators establish that the actor had held access to the vendor's build system for two months and added the library there. Within the kill chain of the intrusion against Ardent Polymers, the actor's work on that build system corresponds to which phase?",
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
        "A sector information-sharing group warns Bellweather Water that a set of intrusions has been running since at least last autumn, and offers one distinguishing detail: the intruders' remote-access tool always creates a named pipe following a fixed pattern. Bellweather keeps a year of process and named-pipe records on its endpoints, its analytics tier can raise an alert within minutes of a new match, and its egress proxy can block destinations on request. Before anything else, the incident commander wants to establish whether this activity has been present in the estate since last autumn. Which course of action does that call for?",
      choices: ['Detect', 'Discover', 'Deny', 'Disrupt'],
      answer: 1,
      explain:
        'Establishing whether the pattern is already sitting in a year of stored telemetry is a retrospective search, which is Discover. Detect is the tempting choice, and the pattern should indeed become an alert as well, but an alert only covers matches from the moment it is written and says nothing about the months already elapsed.',
    },
    {
      id: 'pl-s2q5',
      domain: 'Intrusion Analysis',
      prompt:
        "Calder Rail's threat team has watched an intrusion for eleven days, mapping four compromised hosts, two rented servers and the actor's working hours, and now judges that little more will be learned by waiting. Continuing leaves the actor with access to signalling maintenance records for at least another fortnight; acting almost certainly ends the collection line, because this actor has rotated its infrastructure within hours of being touched before. The team has written up both options with the gain and the loss of each. Who should make the call to shut the intrusion down?",
      choices: [
        'The SOC shift lead, who owns the alerting and the containment tooling',
        'The threat intelligence team, which owns the collection plan and its priorities',
        'The executive accountable for risk to the affected business service',
        'The incident response manager, because ending an intrusion is a containment task',
      ],
      answer: 2,
      explain:
        "Choosing between more collection and immediate containment trades an operational risk to the railway against future visibility, so the call belongs to whoever is accountable for accepting that risk; the analysts' job is to price both sides of it, which they have done. The incident response manager is the tempting answer because containment is carried out there, but executing a decision is not the same as owning the exposure it creates.",
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
        'The operator role within the Adversary vertex',
        'The customer role within the Adversary vertex',
        'The Capability vertex',
        'The Infrastructure vertex',
      ],
      answer: 1,
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
        "Two intrusions six weeks apart, one at a ferry operator and one at a port authority, are being considered for grouping. Four things are shared: both victims are mid-sized operators in the same regulated sector; both intrusions opened with password spraying against an internet-facing webmail portal; both actors' servers were rented from the same large hosting provider; and both implants derive their configuration key from the same misspelled string constant. If only one of the four survived scrutiny, which one alone would still justify the grouping?",
      choices: [
        'The two victims being mid-sized operators in the same regulated sector',
        'The password spraying against an internet-facing webmail portal',
        'The servers rented from the same large hosting provider',
        'The misspelled string constant both implants use to derive a key',
      ],
      answer: 3,
      explain:
        "A misspelling carried inside both implants comes from the actor's own source code: it is rare, and removing it means touching the build the actor depends on, which is what makes a link strong enough to stand alone. Shared sector targeting is the next best of the four and would support a hypothesis, but plenty of unrelated actors work the same sector, while password spraying and a large hosting provider are shared by thousands of unrelated intrusions.",
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
        "A campaign report says of a group that it steals credentials by loading a signed driver of its own and reading the memory of the process that holds them, then reuses those credentials to reach file servers. An analyst is asked to place two parts of that sentence on ATT&CK's ladder of abstraction: 'steals credentials', and 'loads a signed driver of its own and reads the memory of the process that holds them'. Respectively, these are:",
      choices: [
        'A technique and a procedure',
        'A tactic and a technique',
        'A tactic and a procedure',
        'A procedure and a technique',
      ],
      answer: 2,
      explain:
        "'Steals credentials' names the adversary's goal for that step, and goals are tactics; the particular driver this group loads and the exact way it reads that process memory is one group's implementation, which is a procedure. 'A tactic and a technique' is the near miss — the technique level would be the general method, dumping credentials from operating-system memory, stated without this group's own driver.",
    },
    {
      id: 'pl-s2q12',
      domain: 'Intrusion Analysis',
      prompt:
        "One incident leaves a team four things it could write a detection on: the SHA-256 of the packed loader, the two domains the loader resolves at start-up, the mutex name it creates on every host it runs on, and the routine it uses to decode its own configuration, which the team has seen in this group's loaders for two years. Detecting on which of the four would cost the group the MOST to work around?",
      choices: [
        'The SHA-256 of the packed loader binary',
        'The two domains the loader resolves at start-up',
        'The mutex name it creates on every infected host',
        'The routine that decodes its configuration',
      ],
      answer: 3,
      explain:
        "The decoding routine identifies the tool itself, so evading a detection built on it means re-developing the loader rather than rebuilding it — the most expensive of the four adaptations. The mutex name is the tempting answer because it is equally under the group's control, but a mutex is a host artifact: renaming a string is an annoyance, not a redevelopment, and a new build or a new domain costs the group less still.",
    },
  ],
};
