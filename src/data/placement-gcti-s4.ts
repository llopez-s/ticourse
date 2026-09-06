import type { PlacementBlock } from '../lib/types';

// ---------------------------------------------------------------------------
// pl-s4 — Placement block for GCTI section s4: Análisis y Producción
//
// Coverage: s4m1 cognitive biases inside an analytic workflow (2), s4m2
// logical fallacies applied to CTI reporting (2), s4m3 structured techniques
// and ACH — diagnosticity, refutation-driven ranking, hypothesis-set
// completeness (3), s4m4 clustering hygiene, criteria drift and weak links
// (2), s4m5 attribution levels and campaign vs intrusion set (3).
//
// Every prompt below is original to this block: none reuses a lesson prompt,
// checkpoint, table row, callout or worked example from s4.ts, and no stem
// borrows the VELVET CICADA / Meridian Dynamics campaign material the lesson
// narrates. The keyed index is spread across 0-3 (three each) and the four
// options of every item stay in one category, so neither position nor length
// leaks the answer. See docs/superpowers/plans/2026-09-05-placement-test.md
// for the authoring rules this block implements.
// ---------------------------------------------------------------------------
export const S4_PLACEMENT: PlacementBlock = {
  id: 'pl-s4',
  sectionId: 's4',
  domain: 'Analysis',
  title: 'Sección 4 · Análisis y Producción',
  blurb: 'Sesgos, falacias, técnicas estructuradas y ACH, clustering y niveles de atribución.',
  questions: [
    {
      id: 'pl-s4q1',
      domain: 'Analysis',
      prompt:
        'Three weeks after attending a conference talk on a supplier-account compromise at a logistics firm, an analyst at Harlow Instruments opens an investigation into unusual authentication activity and records a working assessment that a supplier account has been abused. For the next month she pulls supplier-account authentication logs every morning. When a colleague reports an unsigned scheduled task created on a build server inside the same window, she files it as an administrator artifact and never examines the binary it launches. Which bias MOST directly explains her handling of the scheduled-task report?',
      choices: ['Availability bias', 'Confirmation bias', 'Anchoring', 'Mirror imaging'],
      answer: 1,
      explain:
        'Setting aside a finding that does not fit the standing assessment, without testing it, is confirmation bias: new evidence is weighed by whether it supports the hypothesis already held. The conference talk and the early working assessment explain where that hypothesis came from — availability and anchoring respectively — but neither accounts for what she did with a discordant piece of evidence a month later.',
    },
    {
      id: 'pl-s4q2',
      domain: 'Analysis',
      prompt:
        "An intruder spent three weeks inside Braewick Chemicals, exfiltrated a set of process-control configuration files, and never touched the customer payment database. The risk register, written a year earlier and used on day one to scope the investigation, ranks that payment database as the company's most valuable asset. A senior analyst concludes the operation was cut short before it achieved its aim, reasoning that an intruder holding that level of access would plainly have taken the payment records. Which bias MOST directly explains that conclusion?",
      choices: ['Anchoring', 'Availability bias', 'Hindsight bias', 'Mirror imaging'],
      answer: 3,
      explain:
        "Deciding the operation failed because the intruder ignored what Braewick considers valuable projects the analyst's own value system onto the adversary, whose collection requirement may have been the control-system files from the start. Anchoring is the closest competitor, since the risk register framed the investigation from day one, but the defective step is not that the register came first — it is the assumption that the intruder ranks assets the way the defender does.",
    },
    {
      id: 'pl-s4q3',
      domain: 'Analysis',
      prompt:
        "A detection engineer derives a rule from the registry keys and service names observed in the four incidents a team has labelled Cluster-K. The rule is deployed, and from then on the SOC labels an incident Cluster-K when the rule fires on it. The quarterly report cites the rule's perfect hit rate against Cluster-K incidents as evidence that it characterises the cluster precisely. Which reasoning failure MOST directly undermines that claim?",
      choices: [
        'Circular reasoning',
        'Hasty generalization',
        'Post hoc ergo propter hoc',
        'Appeal to authority',
      ],
      answer: 0,
      explain:
        'The hit rate is guaranteed by construction: cluster membership is now decided by the rule that was derived from the cluster, so the conclusion is already inside the premise. Hasty generalization is the closest competitor, since four incidents is a thin basis for any general claim — but a hundred incidents labelled this way would still produce a perfect hit rate, which is what makes the reasoning circular rather than merely under-sampled.',
    },
    {
      id: 'pl-s4q4',
      domain: 'Analysis',
      prompt:
        "Two reports on the same intrusion reach a CTI team in one week. The first comes from a vendor that has twice published attributions it later withdrew; the team reads its telemetry appendix line by line and then accepts its central finding. The second is a technical write-up with reproducible artifacts from a researcher with no institutional affiliation; the team sets it aside without reading past the summary, on the grounds that unaffiliated researchers cannot be relied on. Which assessment of the team's handling is correct?",
      choices: [
        "Both are fallacious, because the source's identity influenced the team in each decision",
        "Only the first is fallacious, because past withdrawals say nothing about a vendor's current data",
        "Only the second is fallacious: there the source's standing replaced looking at the evidence",
        'Neither is fallacious, because source reliability is a legitimate input to both decisions',
      ],
      answer: 2,
      explain:
        'Letting a track record set how hard you scrutinise a source is source evaluation and is legitimate; refusing to read the evidence because of who produced it is ad hominem, and that is the second case. The tempting answer is that both fail, since identity enters both decisions — but in the first it only set the level of scrutiny, and the finding was accepted on the telemetry rather than on the vendor name.',
    },
    {
      id: 'pl-s4q5',
      domain: 'Analysis',
      prompt:
        'A team is weighing two hypotheses for an intrusion at Vantree Utilities: an espionage set positioning for long-term collection, or a criminal crew preparing an extortion event. Everything gathered so far — the phishing lure, a signed remote-management agent used for persistence, and domain enumeration on the first day — sits comfortably with both. Which collection request would do the MOST to separate the two hypotheses?',
      choices: [
        'Recover further copies of the loader and its configuration from the remaining hosts',
        'Establish whether the intruder touched engineering documents or the backup servers',
        'Identify the registrar and the registration dates of the command-and-control domains',
        'Retrieve the full headers of the phishing message that carried the initial access',
      ],
      answer: 1,
      explain:
        'What the intruder went after discriminates: an extortion operation has to reach the backups to hold any leverage, while a collection operation has no use for them, so the answer moves one hypothesis without moving the other. Registration data and additional loader copies would enrich the picture but fit both hypotheses equally, which is exactly what low diagnostic value means.',
    },
    {
      id: 'pl-s4q6',
      domain: 'Analysis',
      prompt:
        'Ahead of a board briefing, an intelligence lead assigns each of three analysts one hypothesis and asks each to assemble the strongest possible case for it. The team will then compare the three cases and adopt whichever comes out best supported. Which objection to this design is MOST serious?',
      choices: [
        'It ranks hypotheses by the support each attracts, when what separates them is contradictory evidence',
        "It is a form of devil's advocacy, which should be run by an outside reviewer rather than by team members",
        'It fixes the team on three hypotheses before the evidence has been listed and rated against them',
        'It gives each analyst sole ownership of one hypothesis, so nobody works across the whole evidence base',
      ],
      answer: 0,
      explain:
        'A hypothesis is eliminated by evidence inconsistent with it, because consistent evidence accumulates for several hypotheses at once; a contest of best cases therefore rewards whichever hypothesis the most evidence happens to fit rather than the one that survives attempts to refute it. Divided ownership is a real weakness too, but a single shared matrix scored this way would fail identically, which places the defect in the ranking rule rather than in who holds the pen.',
    },
    {
      id: 'pl-s4q7',
      domain: 'Analysis',
      prompt:
        'A team scores a matrix on an intrusion at Coldbay Marine against two hypotheses — state-linked espionage and a criminal intrusion — and reports espionage as the least inconsistent. A reviewer notes that a business unit had contracted an adversary-simulation engagement in the same window without telling security, that the conclusion rests almost entirely on one unverified third-party claim, and that a second item was scored as strong support although it fits both hypotheses. Which is the MOST serious defect in the exercise?',
      choices: [
        'One unverified item carries the conclusion, so a single error in it would overturn the result',
        'An item that fits both hypotheses equally was credited as support for one of them',
        'Only two hypotheses were scored, which is too few for inconsistency counts to be meaningful',
        'A plausible explanation of the activity was never entered into the matrix as a hypothesis',
      ],
      answer: 3,
      explain:
        'A matrix can only rank the hypotheses it contains, so its output is always "least inconsistent among those considered"; if the simulation engagement was never a column, no amount of careful scoring could have surfaced it. The linchpin item is a genuine weakness and sensitivity analysis exists to flag it, but it lowers confidence in a conclusion drawn from the right candidate set, whereas a missing hypothesis can make the whole answer wrong.',
    },
    {
      id: 'pl-s4q8',
      domain: 'Analysis',
      prompt:
        'A cluster opened eighteen months ago with four intrusions linked by a bespoke loader and a distinctive domain-registration pattern. Six more were added later because they hit the same sector, and four after that because a commodity RAT appeared in each. The cluster profile now spans the full 24 hours, victims in four sectors, and two subsets that share no infrastructure with one another. Which BEST explains what has gone wrong?',
      choices: [
        'The cluster was founded on capability, which cannot anchor a cluster over a long period',
        'The cluster has outgrown the size at which one analytic construct can stay coherent',
        'Members were admitted under successively weaker criteria, so no single standard holds',
        'The spread reflects genuine expansion by the actor rather than a problem with the cluster',
      ],
      answer: 2,
      explain:
        'The founding four were linked by rare, actor-controlled features, while the later additions came in on a shared sector and a commodity tool that many unrelated actors buy, so the cluster now aggregates activity that was never linked to the same standard. Real expansion is the tempting reading, and actors do change targeting, but expansion would not produce two subsets with no infrastructure in common — that pattern says the criteria moved, not the adversary.',
    },
    {
      id: 'pl-s4q9',
      domain: 'Analysis',
      prompt:
        'While remediating an intrusion attributed to a tracked cluster, responders at Ferrand Aviation find a second foothold on one of the same servers: a different loader, command and control at a hosting provider the cluster has never used, and hands-on activity in a different part of the day. The incident lead proposes recording it under the tracked cluster, since one server is unlikely to host two separate operations. What is the BEST call?',
      choices: [
        'Record it under the tracked cluster, since a shared victim host is a strong enough link',
        'Track it as a separate cluster, since the tradecraft differs at every observed feature',
        'Record it as a second campaign by the tracked cluster, run with different tooling',
        'Hold it unattributed until the tracked cluster is confirmed to have changed tooling',
      ],
      answer: 1,
      explain:
        'Two unrelated actors reaching the same victim, and even the same host, is a documented occurrence, and a shared victim is among the weakest links available; here every feature that could carry a link — loader, infrastructure, operating rhythm — differs. Calling it a second campaign is the trap, because a campaign is a bounded operation of the same actor, so that label quietly asserts the attribution the evidence does not support.',
    },
    {
      id: 'pl-s4q10',
      domain: 'Analysis',
      prompt:
        "Two operations two years apart share a bespoke downloader and a domain-registration pattern seen nowhere else. The address used to register three of those domains also opened a criminal-forum account in 2019 under a handle whose posts describe an uncommon technique used in both operations, and that handle has posted from the same self-managed hosting account used to stage the second operation. Both victim sets sit in a sector named as a national priority in one government's published industrial strategy. Which is the STRONGEST claim this evidence supports?",
      choices: [
        'A single operator or small operator team ran both of these operations',
        'Both operations were run from a common set of hosts and tooling',
        'A state intelligence service tasked both operations against that sector',
        'A commercial competitor in that sector commissioned the operator team',
      ],
      answer: 0,
      explain:
        'Alias reuse that ties a forum account to the hosting account used to stage the operation is a human opsec failure, and that is the kind of evidence that carries an assessment up from "the same machines and tools" to "the same people". The tooling and registration overlap is also true but is the weaker of the two statements, and a sector matching a published priority is consistent with state tasking without showing it — direction and funding leave no trace in defender telemetry.',
    },
    {
      id: 'pl-s4q11',
      domain: 'Analysis',
      prompt:
        "A team has tracked SLATE HERON for three years across several operations against energy suppliers, linked throughout by a bespoke loader and a consistent domain-registration routine. Between 4 March and 15 April, activity using that same loader and routine aims solely at harvesting credentials for one hospital group's supplier portal, and stops once the portal is rebuilt. How should the team record this activity?",
      choices: [
        'As a new intrusion set, since the targeting departs from three years of victimology',
        "As a continuation of SLATE HERON's previous operation, given the identical tooling",
        'As unattributed activity until the change of sector has been accounted for',
        'As a campaign attributed to SLATE HERON, the attribution carrying its own confidence',
      ],
      answer: 3,
      explain:
        'A campaign is activity bounded in time and objective, while the intrusion set is the persistent pattern of behaviour and resources running across several campaigns, so a six-week operation with a single objective belongs inside the set rather than beside it. Opening a new set is the tempting move because the sector changes, but victimology is one linkage feature among several, and the bespoke loader and registration routine are precisely the enduring features the set is built on.',
    },
    {
      id: 'pl-s4q12',
      domain: 'Analysis',
      prompt:
        "A vendor report concludes that a foreign intelligence service directed a three-year intrusion campaign. Its evidence is a downloader seen only in this activity, a registrant pattern unique to it, four years of victimology matching one state's published collection priorities, and an operator handle reused throughout the period. Which limitation bears MOST directly on the nation-state conclusion specifically?",
      choices: [
        'Handles reused over several years are among the cheapest artifacts for an actor to fabricate',
        'Victimology sustained over years can be produced by any actor reselling access to several buyers',
        'Nothing in defender telemetry can show tasking, funding or direction by an organisation',
        'Downloaders seen in one activity set are traded openly, so they cannot support a linkage',
      ],
      answer: 2,
      explain:
        "Every item listed is observable in a defender's own data and can support an enduring, well-resourced set with a stable operator team — but who tasked and paid that team is not visible there at all, which is why sponsor-level claims normally need SIGINT, HUMINT or financial records. Sustained victimology is the most tempting objection, since access resale does happen, yet multi-year targeting aligned to one state's priorities is expensive to fake and counts as genuine medium-weight evidence; the unsupported step is the leap from that evidence to direction.",
    },
  ],
};
