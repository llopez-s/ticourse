import type { PlacementBlock } from '../lib/types';

// ---------------------------------------------------------------------------
// pl-s1 — Placement block for section s1: Fundamentos de CTI y Requirements
//
// Coverage: s1m1 data/information/intelligence and the collection disciplines
// (2), s1m2 the threat triad and where CTI sits in the risk equation (2),
// s1m3 levels of CTI and the Sliding Scale of Cyber Security (3), s1m4 the
// intelligence lifecycle and its per-phase failure modes (3), s1m5 writing
// requirements and PIRs (2).
// Every prompt below is original to this block — none reuses a lesson prompt,
// checkpoint, table row or worked example from s1.ts, and none reuses the
// VELVET CICADA / Meridian Dynamics campaign narrative.
//
// Keyed index is spread across 0-3 (three each) so option position or length
// cannot be used to guess the answer without the material. See
// docs/superpowers/plans/2026-09-05-placement-test.md for the plan this block
// implements.
// ---------------------------------------------------------------------------
export const S1_PLACEMENT: PlacementBlock = {
  id: 'pl-s1',
  sectionId: 's1',
  domain: 'Requirements',
  title: 'Sección 1 · Fundamentos de CTI y Requirements',
  blurb:
    'Data frente a intelligence, los INTs, amenaza y riesgo, niveles y Sliding Scale, ciclo de inteligencia y PIRs.',
  questions: [
    {
      id: 'pl-s1q1',
      domain: 'Requirements',
      prompt:
        "A CTI team at Verity Health is trying to confirm whether a batch of patient records advertised on a criminal forum came from its own systems. The seller's post is readable by anyone and lists column headers and a record count. To obtain the small verification sample the team needs, an analyst spends three days negotiating in private messages under a persona the forum has known for two years. Which collection discipline does that negotiation MOST directly represent?",
      choices: ['OSINT', 'SIGINT', 'GEOINT', 'HUMINT'],
      answer: 3,
      explain:
        'Working a human source — even one reached through a keyboard under an assumed persona — is HUMINT, because the discipline is defined by a person deciding what to hand over. OSINT is the tempting answer since the post itself is openly readable, but no amount of reading public content produces the sample: it exists only because someone was persuaded to send it.',
    },
    {
      id: 'pl-s1q2',
      domain: 'Requirements',
      prompt:
        "Thornbury Retail buys a subscription that arrives every morning as a list of newly seen malicious domains, each carrying a first-seen timestamp, the malware family observed serving it and a confidence score. The CISO's standing worry is whether the chain's store payment terminals are being targeted, and he asks the CTI team to build him something out of the subscription that speaks to it. Which output would be intelligence rather than more information?",
      choices: [
        'A nightly count of how many of the listed domains resolved inside the store network',
        'An answer to whether those families could reach the terminals as segmented today',
        'A view of the list filtered to families known to target payment software',
        'A weekly firewall push blocking every listed domain across the store estate',
      ],
      answer: 1,
      explain:
        "Intelligence is the analysed product that ends in a judgment the consumer can act on, and whether anything on that list could actually reach a terminal is what he is uncertain about. Filtering the list to payment-targeting families is the tempting answer because it is finally aimed at his requirement, but selecting rows is not analysing them — the output is still a list of domains, just as the count of which ones resolved on the store network is still a correlated fact, which is what makes both of them information.",
    },
    {
      id: 'pl-s1q3',
      domain: 'Requirements',
      prompt:
        'For two years PALE HERON has published extortion notices naming freight and logistics victims, and every documented intrusion has used the same commodity remote-access tool the group has run since it first appeared. Alder Point Logistics operated none of the products the group is known to break into, until last month it opened a supplier portal on the appliance PALE HERON has repeatedly exploited elsewhere. Alder Point now lists the group as a threat for the first time. Which component MOST directly explains that change?',
      choices: ['Intent', 'Capability', 'Opportunity', 'Consequence'],
      answer: 2,
      explain:
        'A threat exists only when intent, capability and opportunity coincide; the extortion notices and the long-running tooling show the first two were already present and unchanged, so what completed the triad was Alder Point exposing something the group can reach and exploit. Capability is the tempting answer because the appliance is what the group attacks, but the group has held that capability all along — the only thing that moved was the exposure on the defender side.',
    },
    {
      id: 'pl-s1q4',
      domain: 'Requirements',
      prompt:
        'Fenwick Shipping learns of a critical flaw disclosed two days ago in the file-transfer appliance that carries its customer shipment files, with no exploitation reported anywhere yet. Its CTI team separately holds three months of evidence that a data-theft crew is entering shipping firms of the same size using VPN credentials staff had reused on other sites. The security director has one engineering week and must choose where it goes. What does the CTI team MOST directly contribute to that decision?',
      choices: [
        'It ranks the severity of the new appliance flaw against the findings already open',
        'It shows which of the two exposures comparable firms are currently being entered through',
        'It compares how prominently each exposure has been covered in the security press this month',
        'It checks whether the reused staff credentials breach the company password policy',
      ],
      answer: 1,
      explain:
        'In risk = f(threat x vulnerability x consequence), CTI owns the threat factor: evidence on which adversaries are actually operating against organisations like this one and how they get in, which is what separates a flaw nobody has used from a method in use this quarter. Ranking the flaw is tempting because the disclosure is the newest fact on the table, but severity describes the weakness and belongs to vulnerability management; it says nothing about who is exploiting it.',
    },
    {
      id: 'pl-s1q5',
      domain: 'Requirements',
      prompt:
        'A detection engineer at Wrenfield Utilities turns a vendor indicator list into SIEM blocks the same morning it arrives. Over three months the blocks she has written against one intrusion set keep going dead within a fortnight, because the group registers fresh domains and moves hosting faster than she can publish. She now wants rules that fire on what the group does once it is inside, whatever infrastructure it is renting that week. Which level of intelligence would she need?',
      choices: ['Technical', 'Strategic', 'Operational', 'Tactical'],
      answer: 2,
      explain:
        "The level is fixed by the question being answered and its horizon, not by the consumer's team: how a group behaves once inside, tracked across months, is operational intelligence, and it is the only material behaviour-based rules can be written from. Tactical is the tempting answer because she is a detection engineer shipping SIEM content, but tactical product is the indicator list she already receives every morning — the thing whose shelf life is the problem.",
    },
    {
      id: 'pl-s1q6',
      domain: 'Requirements',
      prompt:
        'After an intruder reached the production floor from an office workstation, Halcyon Freight funds three items at once: a monthly analyst-led sweep of endpoint telemetry looking for adversary activity, the renewal of the endpoint protection agents on every host, and a project that removes the direct route between the office and production networks and retires an unsupported jump host. On the Sliding Scale of Cyber Security, where does the third item sit?',
      choices: ['Architecture', 'Passive Defense', 'Active Defense', 'Intelligence'],
      answer: 0,
      explain:
        'Building and maintaining systems so they are defensible — segmentation, hardening, retiring what can no longer be patched — is Architecture, the leftmost and highest-return category of the scale. Passive Defense is the tempting answer because the new separation will stop traffic with nobody in the loop, but that category covers protective systems added on top of the architecture, such as the endpoint agents renewed alongside it.',
    },
    {
      id: 'pl-s1q7',
      domain: 'Requirements',
      prompt:
        "Days after data theft at Northgate Ceramics, the executive team weighs three responses: blocking the actor's staging server at the perimeter, leaving it reachable and watching what else it serves, and paying a contractor to log into that server and delete the stolen files. Which Sliding Scale of Cyber Security category does the third response belong to?",
      choices: ['Active Defense', 'Passive Defense', 'Offense', 'Intelligence'],
      answer: 2,
      explain:
        "Offense covers action taken against the adversary's own infrastructure; it sits at the far end of the scale and is nearly the exclusive territory of states that hold the legal authority to act. Active Defense is the tempting answer because this is the most active of the three proposals, but that category means analysts working inside terrain you own — the watching option here — not reaching into someone else's host.",
    },
    {
      id: 'pl-s1q8',
      domain: 'Requirements',
      prompt:
        'Ashfield Bank is two weeks from signing the purchase of a smaller lender. The CTI lead sits with the deal counsel and the CISO, turns "are we buying a compromised company" into three questions the team commits to answer before signature, and notes for each one whether the sources the team already runs can reach it. Which lifecycle phase is she carrying out?',
      choices: [
        'Collection',
        'Planning & Direction',
        'Processing & Exploitation',
        'Analysis & Production',
      ],
      answer: 1,
      explain:
        'Agreeing answerable requirements with the people who own the decision, and working out what those questions will demand of collection, is Planning & Direction — the phase that opens the cycle and whose absence turns collection into hoarding. Collection is the tempting answer because she is discussing sources, but nothing is being obtained yet: she is deciding what will have to be obtained, and against which question.',
    },
    {
      id: 'pl-s1q9',
      domain: 'Requirements',
      prompt:
        "At the start of the quarter a CTI team agreed a written requirement with a fraud director — which account-takeover methods are being used against mid-sized lenders — for delivery two weeks ahead of the meeting where he would set next year's control budget. Collection ran as planned, and the judgments in the finished assessment were confirmed a month later by an industry report. The finished assessment then sat unsent in the team's publication queue, and reached the director eleven days after he had already committed the budget. Which phase of the lifecycle failed?",
      choices: ['Planning & Direction', 'Collection', 'Analysis & Production', 'Dissemination'],
      answer: 3,
      explain:
        'Dissemination is not merely sending the product: it is getting the right product to the right consumer while the decision is still open, and an assessment that lands after the money is committed fails that condition however good it is. Analysis is the tempting answer whenever a report goes unused, but this one was independently borne out — nothing in the reasoning was wrong, only its arrival.',
    },
    {
      id: 'pl-s1q10',
      domain: 'Requirements',
      prompt:
        'For six months a CTI team has sent a nine-page monthly ransomware report to the head of manufacturing operations, and nobody has ever replied to one. Asking around, the analyst learns he stopped opening them after the second month: he had settled his shutdown criteria by then, and what occupies him now is whether suppliers can still be reached during an outage. Which action would MOST directly repair the cycle?',
      choices: [
        'Meet him to establish what the reports missed and re-scope the requirement',
        'Cut the report to a one-page summary and keep sending it every month',
        'Extend collection to the supplier networks and keep the monthly report going',
        'Add a read receipt to each report and track his open rate every month',
      ],
      answer: 0,
      explain:
        'Feedback is the phase that asks the consumer whether the product met the need and rewrites the requirement when it did not, which is exactly what a consumer who quietly stopped reading is signalling. Extending collection is tempting because his new worry is a real one, but collecting against a question nobody has agreed repeats the mistake that produced six unread reports.',
    },
    {
      id: 'pl-s1q11',
      domain: 'Requirements',
      prompt:
        "Northgate Ceramics' operations director must decide within six weeks whether to move order processing onto a single external platform or keep it on the servers her own team maintains; a competitor in the same trade was shut down by ransomware last year. The decision is hers, and she has asked the CTI team for one requirement's worth of support. Which requirement BEST qualifies as a PIR here?",
      choices: [
        'How many vulnerabilities have been disclosed in that platform and its components since 2019?',
        'Which of our own servers still run software versions the vendor no longer supports?',
        'Which ransomware families claimed the most victims worldwide over the past quarter?',
        'Which groups have broken into order-processing platforms at manufacturers our size, and how?',
      ],
      answer: 3,
      explain:
        "A PIR is a single specific question whose answer changes a named decision maker's pending decision, and only the last one tells her what the move would expose her to and how the entry would be attempted. The unsupported-software question is the genuine competitor, since it is specific and does bear on keeping the work in house, but it asks which of her own systems are weak — a vulnerability-management question her platform team answers without any intelligence at all.",
    },
    {
      id: 'pl-s1q12',
      domain: 'Requirements',
      prompt:
        "Cranmore Regional's CTI team has carried one PIR since January, agreed with the chief operating officer ahead of an outsourcing renewal four months from now: which crews are reaching community banks through their outsourced IT providers. The team funds two commodity malware feeds and an open-source vulnerability tracker, and a year of reporting off them has produced a great deal on commodity loaders and nothing on how anyone reached a bank through a provider. Which step MOST directly serves the PIR?",
      choices: [
        'Buy or task sources that can see provider-borne access into banks',
        'Answer the PIR from what the funded sources hold, at low confidence',
        'Re-scope the PIR to the malware families the funded feeds do report on',
        'Lower the PIR below the requirements the current sources already support',
      ],
      answer: 0,
      explain:
        "Requirements drive collection, not the other way round: a PIR the funded sources cannot see is a collection gap, and the only step that brings an answer closer before the renewal is obtaining or tasking sources that can observe the activity. Re-scoping onto what the feeds already report is the tempting move because it produces reporting immediately, but it quietly swaps the decision maker's question for one nobody needed answered.",
    },
  ],
};
