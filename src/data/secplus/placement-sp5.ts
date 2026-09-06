import type { PlacementBlock } from '../../lib/types';

// ---------------------------------------------------------------------------
// pl-sp5 — Placement block for Domain 5: Security Program Management &
// Oversight (SY0-701)
//
// Coverage: security governance, policies and data roles (2); the risk
// management process (3); third-party risk (2); compliance (2); audits,
// assessments and penetration testing (2); security awareness practices (1).
//
// Domain 5 is the definitional domain, so it is the one most exposed to two
// failure modes. The first is the "which term means X" item, which measures
// vocabulary rather than judgement; every stem here therefore describes a
// situation and asks for a decision, and no stem names the concept its key
// stands for. The second is the near-synonym set keyed ambiguously — policy
// vs standard vs procedure vs guideline, MOA vs MSA vs SLA vs BPA,
// RTO vs RPO vs MTTR vs MTBF, SLE vs ALE vs ARO. Where such a set is used,
// the stem is written so that exactly one member survives: q1 fixes
// technology-specific mandatory requirements under an approved
// technology-neutral document; q5 reports one commitment met and the other
// missed so only the data-loss lever applies; q6 has two companies dividing
// what one shared operation earns and loses, which is the single thing an
// umbrella contract, a memorandum or a service-level document does not
// govern, and its stem never uses the words partner, service level or
// confidentiality.
//
// Every prompt is original. Each item was checked by hand against the tables,
// callouts, worked examples, inline checks and quiz items of sp5-part1..4.ts,
// because those lessons summarise heavily and a stem rebuilt from a summary
// row or a memorisation callout is answerable by recall alone. Several items
// deliberately invert a drilled reflex so that recall without reasoning gives
// a wrong answer: q2 keys the steward where the lesson trains "the owner
// decides"; q8 keys automated coverage over an outside firm where the lessons
// train "independent beats self-assessed"; q12 keys acting on the copies of a
// confirmed phish that are already sitting in other mailboxes, where the
// drilled reflex is "the decisive step is going back to the reporter".
//
// Design rule this block is built on: every stem supplies triggering facts
// for two or more of its options, so the candidate must decide which concept
// applies MOST directly rather than match English. Arrangements already in
// place are stated operationally — "every remote-access grant has a recorded
// request and approval", never "a procedure was in place" — so that no
// distractor is deletable by someone who does not know the material, and all
// four options in each item stay in the same category and medium.
//
// Keyed index is spread three each across 0-3, and in no item is the key the
// longest option. See docs/superpowers/plans/2026-09-05-placement-test.md
// for the plan this block implements.
// ---------------------------------------------------------------------------
export const SP5_PLACEMENT: PlacementBlock = {
  id: 'pl-sp5',
  sectionId: 'sp5',
  domain: 'Security Program Management & Oversight',
  title: 'Dominio 5 · Gestión y supervisión del programa',
  blurb:
    'Gobernanza, gestión de riesgos, terceros, cumplimiento, auditoría y concienciación.',
  questions: [
    {
      id: 'pl-sp5q1',
      domain: 'Security Program Management & Oversight',
      prompt:
        "A logistics group's board approved a two-page information security document three years ago. It says that remote access to company systems must be protected in proportion to the sensitivity of what that access reaches, and it names no product, protocol or version. Every remote-access grant made since carries a recorded request and a recorded approval from the employee's manager, and an audit sampled forty of them without finding one missing. That audit also found that one business unit ends idle sessions after fifteen minutes and asks for a second factor, another allows unlimited session length with a password alone, and a third routes its staff through a supplier's portal the group has never examined. The board now wants all three units protected the same way. What does the group need to produce?",
      choices: [
        'A standard fixing the protocols, authentication and session limits',
        'A procedure setting out how a remote-access account is requested and approved',
        'A guideline describing the configuration the group recommends for remote access',
        'A revision of the approved document naming the technologies each unit may use',
      ],
      answer: 0,
      explain:
        'Making three units behave identically requires a requirement that is both mandatory and specific, and that is what a standard is: it takes its authority from the approved document above it and states the protocol, the authentication and the session limits every unit has to implement. Revising that approved document to name technologies is the tempting alternative because it would also be mandatory, but a document written at that level is meant to survive the next change of product and stops doing so the moment it fixes versions, which is precisely why the specific requirement belongs a level below it. A recommendation cannot produce uniformity, since nobody is obliged to follow one, and the request-and-approval steps are already being executed correctly, so restating them changes nothing about how the connections are configured.',
    },
    {
      id: 'pl-sp5q2',
      domain: 'Security Program Management & Oversight',
      prompt:
        'Two departments at a shipping terminal publish monthly berth-utilisation figures drawn from the same source system, and their totals differ by about a fifth. The extracts ran without error, each was pulled by someone whose access had been requested and approved, and one of the two reports is produced for the terminal by an analytics supplier working from written instructions the terminal gives it. The gap comes from one department counting a berth as occupied from the moment a vessel is scheduled and the other from the moment it is moored, and from a numeric column that one report reads as a berth identifier and the other as a length in metres. Whose remit covers putting this right?',
      choices: [
        'The data custodian',
        'The data steward',
        'The data owner',
        'The data processor',
      ],
      answer: 1,
      explain:
        'The dispute is about what the data means: when a berth counts as occupied, and what a column actually contains. Fixing a definition, keeping it consistent between the reports that rely on it and correcting a field being read two different ways is stewardship, which is the role concerned with the quality, the definition and the correct use of the data. The owner is the tempting answer, because the owner is accountable for the dataset and every access here went through that approval route, but ownership decides classification, who may use the data and what risk is accepted, and none of those is in question. Running the extracts and applying the permissions produced no errors at all, and a supplier acting on written instructions cannot settle what a figure means on its own.',
    },
    {
      id: 'pl-sp5q3',
      domain: 'Security Program Management & Oversight',
      prompt:
        "A port's risk committee has €40,000 a year to spend and two candidate purchases, each priced at exactly that and each expected to remove its risk entirely. The first covers a quay-crane controller: one failure would cost the port about €250,000, and the maintenance record suggests one failure roughly every ten years. The second covers the gate access controllers: one failure costs about €12,000, and they fail about six times a year. Which recommendation should the analyst put to the committee?",
      choices: [
        'The crane purchase, because one failure there costs about twenty times more',
        'Split the budget between the two in proportion to the cost of one failure',
        'The gate purchase, because the loss it removes each year exceeds its price',
        'Neither, because a per-failure cost cannot be weighed against a yearly price',
      ],
      answer: 2,
      explain:
        'Spread across a year the crane risk costs about €25,000 — €250,000 arriving once in ten years — and the gate risk about €72,000, which is €12,000 arriving six times, so the €40,000 buys more than it costs only on the gate and destroys value on the crane. The crane option is the tempting one because a single failure there is twenty times worse, but a rare severe event and a frequent modest one only become comparable once frequency is applied to both, which is exactly what turns a per-event figure into an annual one. Splitting the money in proportion to per-event cost would put most of it on the risk that is cheapest per year, and refusing to compare at all throws away the frequency figures the committee has been given.',
    },
    {
      id: 'pl-sp5q4',
      domain: 'Security Program Management & Oversight',
      prompt:
        'A register entry is being completed for the terminal operating system of a container port. The security analyst quantified the risk and drafted the entry. The infrastructure director runs the platform, applies its patches and holds its administrative credentials. The operations director decides whether the terminal keeps loading vessels while the system is down, and the terminal budget she controls pays for the platform. The finance director signed the cyber-insurance policy that would pay out for a prolonged outage. Who should the entry name as answerable for this risk?',
      choices: [
        'The operations director',
        'The infrastructure director',
        'The security analyst',
        'The finance director',
      ],
      answer: 0,
      explain:
        'A register entry is answerable to the person who can decide what happens to the risk and can pay for that decision, which is the business role whose service stops when the system does: the operations director chooses whether loading continues and holds the budget any change would come out of. The infrastructure director is the tempting answer because the platform, its patching and its credentials are hers, but running a system is executing decisions about it rather than owning them, and an operator cannot accept a risk on behalf of the business the risk belongs to. The analyst who quantified it has neither the authority to accept it nor the budget to act on it, and the insurance policy moves part of the financial consequence without moving the decision anywhere.',
    },
    {
      id: 'pl-sp5q5',
      domain: 'Security Program Management & Oversight',
      prompt:
        "A ferry operator's continuity plan for its booking platform commits to having the service running again within two hours of a failure and to losing no more than a quarter of an hour of confirmed bookings. A controller fails at 09:20 on a Friday. The standby site is brought up and the platform is serving passengers again at 10:30, though it runs at reduced throughput for the first hour, and twenty-five of those seventy minutes went on one engineer working through the runbook by hand. The database at the standby site is the copy taken at 23:00 the previous night, so every booking accepted after that had to be re-entered from printed manifests. It is the third controller failure this year. Which change does the plan MOST need?",
      choices: [
        'Rehearse the failover so less of it depends on one engineer and a runbook',
        'Add capacity at the standby site so it serves at full throughput from the start',
        'Replace the controllers with a model that fails less often',
        'Replicate the booking database to the standby site through the day',
      ],
      answer: 3,
      explain:
        'Both commitments have to be measured, and only one of them was missed: the platform was serving again seventy minutes after the failure, comfortably inside the two hours, while the standby copy was more than ten hours old, so the losses ran to a whole evening of bookings against a quarter of an hour allowed. How often the data is copied is the only thing that caps how much work disappears in a failure, so replicating through the day is what the missed commitment actually requires. Rehearsing the failover is the tempting answer, because a third of the recovery was one engineer working by hand and it would be worth doing anyway, but it buys back minutes against a target that was already met. Extra standby capacity and more reliable controllers improve the same target and the failure rate, not the amount of work lost.',
    },
    {
      id: 'pl-sp5q6',
      domain: 'Security Program Management & Oversight',
      prompt:
        'A river port has awarded the north quay to two container-handling companies that will run it as one terminal for the next five years. One of them puts in the cranes and the yard, the other the gate staff and the planning system, and neither invoices the other for what it puts in: every euro the terminal takes is divided sixty-forty between them, and a bad year is absorbed in the same proportions. Before they start they have to fix in writing who answers to a shipping line whose container is damaged, whose national law governs a dispute between the two of them, and how the forty-minute truck turnaround the terminal advertises will be delivered by two sets of employees. Which document do the two companies need between them?',
      choices: [
        'A master service agreement covering the whole five-year period',
        'A memorandum of agreement between the two companies',
        'A business partner agreement between the two companies',
        'A service level agreement for the quay operation',
      ],
      answer: 2,
      explain:
        "Two companies that each put their own assets and people into one operation and then divide what it earns and what it loses are not buying from one another, and the document written for that arrangement is the one that allocates responsibilities, resources, returns and risk across two sides of a joint operation. An umbrella contract is the tempting alternative, because liability, governing law and invoicing are exactly what an umbrella settles once for a long relationship, but it settles them between a buyer and a recurring supplier, and here neither company is buying. A memorandum records who has undertaken to provide and to do what, which covers the cranes and the gate staff but not the sixty-forty split, and a service-level document fixes what one party owes another and what follows when it falls short, which is the terminal's promise to its customers rather than the basis on which the two of them run it.",
    },
    {
      id: 'pl-sp5q7',
      domain: 'Security Program Management & Oversight',
      prompt:
        "A ferry operator moved its crew records off a supplier's platform two years ago and onto another one. At the time it exported everything, confirmed the migration was complete and closed the accounts the supplier's staff held on operator systems; a service account the supplier's platform used to pull rosters was left in place and disabled later that year. The old supplier has now been breached, and the records it lists as exposed include crew files from the operator's years on the platform. Which term of the exit would MOST directly have kept those files out of that list?",
      choices: [
        'Signed evidence that the supplier destroyed its copies, backups included',
        'A duty to notify the operator of any incident for a period after termination',
        'A confidentiality obligation binding the supplier after the contract ended',
        'Immediate revocation of the service account the supplier still held',
      ],
      answer: 0,
      explain:
        "Nothing the operator did at the exit removed the data from the supplier: taking an export and closing accounts leaves the original where it is, and a supplier still holding crew files two years later will disclose them when it is breached. Evidence of destruction, dated and covering the backups, is the only exit term that ends with those files gone rather than merely copied somewhere else as well. The notification duty is the tempting choice, because it is the term most often left out of an exit and it would have told the operator sooner, but being told about an exposure does not prevent one. A confidentiality obligation governs what the supplier itself may do with the data rather than what an intruder does with it, and revoking the service account closes a route into the operator's systems, which is not where these files were sitting.",
    },
    {
      id: 'pl-sp5q8',
      domain: 'Security Program Management & Oversight',
      prompt:
        "A haulier's contract with its largest customer requires every change to a delivery record to be logged, on all 900 servers that hold those records. Once a quarter a technician picks twelve of the servers at random and confirms by hand that the logging is on, and the February round found nothing wrong. In March the customer disputes what was delivered and the log that would settle it does not exist: on the three servers involved, logging had been off since late January, when the depot administrators who look after them rebuilt the machines from an old image. Which change would MOST likely have caught those three servers before the customer asked?",
      choices: [
        'Have an outside firm run that check every six months in place of the technician',
        'Have the technician cover fifty of the 900 servers instead of twelve',
        'Have each depot sign a quarterly statement that its servers are logging',
        'Check every server against the requirement automatically and continuously',
      ],
      answer: 3,
      explain:
        'Three machines in nine hundred will not turn up in a sample of twelve, which is why the February round passed; lifting that sample to fifty still leaves better than an eight-in-ten chance of missing all three again. Only a check that evaluates all nine hundred against the requirement every time it runs turns a rebuild in late January into an alert in late January, and moving the same twelve-machine check to an outside firm changes who performs it rather than how much of the estate it sees. The quarterly signed statement is the tempting alternative, because unlike the sample it does cover every depot, but a signature asserts that a condition holds instead of finding out whether it does, and administrators who never noticed the image was old would sign it in good faith.',
    },
    {
      id: 'pl-sp5q9',
      domain: 'Security Program Management & Oversight',
      prompt:
        "A haulage company's schedule says personnel case files are destroyed three years after the case closes, and a job runs every month to carry that out. A former driver has brought a claim the company must defend, and its lawyers asked the HR team to keep everything relating to him; HR moved his current file into a folder of its own. Last month two older files about the same driver reached three years and the monthly job destroyed them. What should the company change?",
      choices: [
        'Have the lawyers keep their own copies of anything they may need',
        'Check each file against the open preservation list before deleting',
        'Suspend the monthly destruction job for as long as any claim is open',
        'Extend the schedule for personnel files from three years to ten',
      ],
      answer: 1,
      explain:
        "A preservation obligation attaches to identified records wherever they sit, so it has to be enforced where the destruction actually happens: the job that deletes must consult the list of matters under preservation and skip anything on it, which is the only change here that would have saved two files nobody had thought to move. Suspending the job entirely whenever a claim is open is the tempting fix because it is simple and safe-sounding, but it keeps every other driver's file past the period the company committed to, which is its own compliance failure. Extending the schedule to ten years does the same thing on a larger scale and would still not protect a file that fell due during those ten years, and copies taken by the lawyers are not the company's own records that the obligation covers.",
    },
    {
      id: 'pl-sp5q10',
      domain: 'Security Program Management & Oversight',
      prompt:
        "A haulage group's internal audit team reports that the operations division has spent a year approving its own emergency changes. The operations director tells the head of internal audit that the wording is unfair and asks for it to be recorded as an observation instead. The head of internal audit reports to the chief operating officer, who also has the operations division in her line and who sets the head of audit's objectives and rating. Which arrangement would MOST directly protect findings like this one?",
      choices: [
        'Commission an outside firm to repeat the review of that division',
        'Have internal audit report to a committee of the board',
        'Have the chief executive countersign findings before they are issued',
        'Require the audited division to agree the wording of each finding',
      ],
      answer: 1,
      explain:
        'Internal audit can only report what it finds when the people it answers to are not the people it examines, and a committee of the board provides exactly that: it sits outside the executive line, receives the reports directly, and can require an action plan on a finding management would rather soften. Routing findings through the chief executive is the tempting fix, because it puts distance between audit and the operations division, but the chief executive runs that division through the same management chain, so the conflict is moved rather than removed. An outside firm would produce one independent opinion on one division and change nothing about the next finding, and letting the audited division agree the wording writes the pressure being complained about into the process itself.',
    },
    {
      id: 'pl-sp5q11',
      domain: 'Security Program Management & Oversight',
      prompt:
        "A tester engaged by a shipping line is working through the address ranges the line listed in the signed scope. On the third day a host inside one of those ranges answers with the name and content of a different company's application, and the tester's own checks show the address block was reassigned to that company nine months ago and that the line no longer uses it. Nothing in the signed document mentions the other company. What should the tester do?",
      choices: [
        'Continue, since the address is inside the range the client listed',
        'Continue with checks that only read, and note the ownership in the report',
        'Stop work on that host and raise it with the client before going further',
        'Finish the engagement as scoped and describe the ownership question at the end',
      ],
      answer: 2,
      explain:
        "Permission to test comes from the party that owns the system, never from the address block the system happens to sit in, so the moment ownership is in doubt the authorisation is too and any further probing reaches a company that has agreed to nothing. Stopping and taking it back to the client is the only step that re-establishes a lawful basis before anything else is touched. Limiting the work to checks that only read is the tempting compromise, because harmless-looking traffic feels defensible, but the tester would still be interacting with another company's system without its permission, and authorisation does not turn on whether a request reads or writes. Recording the question and carrying on defers the decision until well past the point where the harm would already be done.",
    },
    // Gates the 5.6 reporting circuit: a confirmed report has to reach the rest
    // of the estate, not only the person who sent it in.
    {
      id: 'pl-sp5q12',
      domain: 'Security Program Management & Oversight',
      prompt:
        "At 08:10 on a Monday a dispatcher at a haulage group uses the button in her mail client to flag a message asking her to reconfirm her payroll details on a page at a domain registered the previous Friday. The security team triages it, establishes by 08:25 that it is real, and finds that the same message was delivered that morning to 215 other people; the dispatcher is thanked for reporting it at 11:40. Three of the other recipients enter their credentials on the page at around 09:30. The reporting button is on every mail client in the group, the awareness module is repeated every quarter, and the share of staff who report a simulated lure has risen for three quarters running. Which change would MOST directly have prevented those three sets of credentials from reaching the page?",
      choices: [
        'Add a warning banner to messages that come from outside the group',
        'Block the domain the message was sent from at the mail gateway',
        'Return a verdict to the person who reported within minutes, not hours',
        'Take the message out of the mailboxes it had already reached',
      ],
      answer: 3,
      explain:
        'Triage had established by 08:25 that the message was real, which left more than an hour in which the copies sitting unopened in 215 mailboxes were the live part of the attack, and taking them out is the one change here that acts on those copies. Returning the verdict within minutes is the tempting change, because feedback is what keeps a reporting channel alive at all and this group waited until 11:40, but it reaches the one person who had already recognised the message and leaves every other copy where it is. Blocking the sending domain stops the next message from arriving rather than the 215 that already have, and a banner marking outside mail would have sat on this message exactly as it sits on the ordinary outside mail those three read all day.',
    },
  ],
};
