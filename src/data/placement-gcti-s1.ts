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
        "Thornbury Retail pays for a subscription sold to it as threat intelligence. Every morning it delivers a list of newly seen malicious domains, each with a first-seen timestamp, the malware family it has been observed serving, and a confidence score. The CISO asks whether the subscription settles his continuing worry about the chain's store payment terminals being targeted. The analyst says it does not, on its own. Which statement BEST explains why?",
      choices: [
        "The feed is information: nothing in it has been analysed against the retailer's own requirement",
        'The feed is raw data: a timestamp and a family label are not correlated facts',
        'The feed is intelligence, but payment-sector coverage sits in a higher tier',
        'The feed cannot be intelligence because a commercial vendor produced it, not the team',
      ],
      answer: 0,
      explain:
        "Each entry is already correlated — a domain tied to a family and a date — which is what makes it information rather than raw data; what is missing is analysis against this retailer's own question and a judgment the CISO can act on. Calling it raw data is the tempting error, but raw data would be the uncorrelated observations those entries were built from, and who collected it is irrelevant: analysis against a requirement is what makes intelligence.",
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
        'It estimates what the business would lose if the shipment files were taken',
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
        "Kestrel Mutual's hunt team is planning its next two months of work. It already ingests a daily list of malicious indicators straight into the SIEM, and it has the annual sector risk briefing the board commissioned last quarter. What it still cannot answer is which groups have been getting into insurers lately, the entry paths they favour, and what they do in the first hours inside. Which level of intelligence would fill that gap?",
      choices: ['Tactical', 'Operational', 'Strategic', 'Technical'],
      answer: 1,
      explain:
        'Group behaviour, entry paths and campaign patterns over a horizon of weeks to months are operational intelligence, produced for hunters and incident responders. Tactical is the tempting answer because hunters eventually turn it into detections, but tactical output is the indicator and rule material the team already receives daily, and it cannot describe how a group operates.',
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
        "At the start of the quarter a CTI team agreed a written requirement with a fraud director: which account-takeover methods are being used against mid-sized lenders. Collection ran as planned, and the judgments in the finished assessment were confirmed a month later by an industry report. The assessment reached the director eleven days after he had already committed next year's budget to a set of controls. Which phase of the lifecycle failed?",
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
        'Cut the report to a one-page summary and keep sending it every month',
        'Extend collection to the supplier networks and keep the monthly report going',
        'Meet him to establish what the reports missed and re-scope the requirement',
        'Redirect the report to the CISO, who reads it, and drop the operations copy',
      ],
      answer: 2,
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
        "A PIR is a single specific question whose answer changes a named decision maker's pending decision, and only the last one tells her what the move would expose her to and how the entry would be attempted. The disclosure count is the tempting distractor because it is specific and about the very platform under consideration, but a historical tally of advisories supports neither of the two options in front of her.",
    },
    {
      id: 'pl-s1q12',
      domain: 'Requirements',
      prompt:
        'A CTI team carries a PIR on which crews are reaching regional banks through their outsourced IT providers. Its funded collection is two commodity malware feeds and an open-source vulnerability tracker; a year of reporting from them has never once touched provider-borne access, and the feeds map to no requirement on the current list. Which step MOST directly serves the PIR?',
      choices: [
        'Task or buy sources that can see provider access, and map them to the PIR',
        'Retire both feeds, since no requirement on the list is being served by them',
        'Lower the PIR priority until the sources the team already funds can support it',
        'Answer the PIR from what the feeds hold and label the judgment low confidence',
      ],
      answer: 0,
      explain:
        'Requirements drive collection: a requirement with no source behind it is a collection gap, and the only step that moves it toward an answer is obtaining or tasking sources that can see the activity. Retiring the unused feeds is tempting and is genuinely correct housekeeping — a source serving no requirement is waste — but it frees budget without bringing the PIR any closer to an answer.',
    },
  ],
};
