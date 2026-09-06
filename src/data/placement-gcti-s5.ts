import type { PlacementBlock } from '../lib/types';

// ---------------------------------------------------------------------------
// pl-s5 — Placement block for GCTI section s5: Diseminación y Atribución
//
// Coverage: s5m1 products by audience (2), s5m2 BLUF and ICD 203 estimative
// language (3), s5m3 technical dissemination — indicators, rules and TLP in
// practice (3), s5m4 historical cases (2), s5m5 feedback, metrics and team
// maturity (2).
//
// Every prompt is original to this block. None reuses a prompt from s5.ts,
// and each item was checked by hand against that section's tables, callouts,
// worked examples, inline checks and quiz items, because the two structures
// most exposed to pure recall here are the ICD 203 band table and the
// audience -> product / SLA tables. No stem asks a candidate to convert a
// percentage into a band or to name the product a table row already pairs
// with an audience; the estimative items instead give an evidence picture and
// ask which probability/confidence pairing it supports, and the product items
// give a live situation in which two products are genuinely in play. The
// stems use organisations and situations unrelated to the section's
// "Operación VELVET CICADA" / Meridian Dynamics narrative so that nothing
// reads back as campaign recall; the two historical items are the deliberate
// exception, since those cases are real and are named as such.
//
// Keyed index is spread evenly across 0-3 (three each) and the four options
// of each item stay in the same category and roughly the same length, so
// neither position nor phrasing leaks the answer. See
// docs/superpowers/plans/2026-09-05-placement-test.md for the plan this block
// implements.
// ---------------------------------------------------------------------------
export const S5_PLACEMENT: PlacementBlock = {
  id: 'pl-s5',
  sectionId: 's5',
  domain: 'Dissemination',
  title: 'Sección 5 · Diseminación y Atribución',
  blurb:
    'Productos por audiencia, BLUF y lenguaje estimativo, IOCs, reglas y TLP, casos históricos y métricas.',
  questions: [
    {
      id: 'pl-s5q1',
      domain: 'Dissemination',
      prompt:
        'On Monday the head of payments at a clearing house emails the intelligence team: by Thursday she must decide whether to keep a legacy supplier pre-authorisation workflow in service, and she wants to know whether the group currently active against the sector has ever been observed abusing that kind of workflow. That same week the team finished consolidating the group into a single cluster, with its behaviours written up and an indicator set ready to push; the consolidated report is scheduled to publish on Friday. Which deliverable BEST serves the decision in front of her?',
      choices: [
        'The consolidated report publishing Friday, with the behaviours and the indicator annex',
        'The curated indicator set pushed to the detection platform over the agreed channel',
        'A strategic assessment of how sector-wide targeting should shape supplier policy',
        'A one-page response addressing only that workflow, delivered by Wednesday evening',
      ],
      answer: 3,
      explain:
        'A bounded question tied to a dated decision is served by an RFI response: scoped to the question and inside the deadline, with the recurring version of it later becoming a standing requirement. The consolidated report is the tempting choice because it is nearly finished and will contain the same finding, but it lands the day after the decision is made, and analysis that arrives after the decision has stopped being intelligence.',
    },
    {
      id: 'pl-s5q2',
      domain: 'Dissemination',
      prompt:
        'A quarterly assessment of espionage trends — twelve pages of judgements and their implications, with no technical annex — goes out at the end of each quarter to the executive committee and, on the same distribution list, to the SOC shift leads. The executive committee books a follow-up discussion every quarter. In two years no shift lead has referenced the document in a hunt, a ticket or a detection change. Which change would MOST directly make the material useful to the shift leads?',
      choices: [
        'Attach the raw indicator export that the assessment judgements were built from',
        'Compress the assessment to two pages and send that version to every recipient',
        'Derive a separate product naming the behaviours to hunt and the detections to build',
        'Send the assessment at the start of the quarter rather than at the end of it',
      ],
      answer: 2,
      explain:
        'The executives act on the document, so the analysis and the format already fit the decision they face; the shift leads need a different product built from the same analysis, in the verb they can act on. Attaching the indicator export is the tempting fix because the assessment carries no technical content, but an export with no prioritisation and no behaviour attached is precisely the uncontextualised dump operators learn to ignore.',
    },
    {
      id: 'pl-s5q3',
      domain: 'Dissemination',
      prompt:
        'A monthly assessment written for a fraud-risk committee is read closely and its judgements are not disputed. For three meetings running, however, the committee has stopped the discussion to ask how a particular judgement was reached, and twice it has deferred a decision to the following month while the analyst goes back to her case notes. Which change to how the assessment is written would MOST directly remove that delay?',
      choices: [
        'State the reasoning and the sources each judgement rests on alongside it',
        'Replace the likelihood wording with explicit numeric probability ranges',
        'Move the technical annexes ahead of the analytic section of the report',
        'Circulate the assessment a week before the meeting instead of on the day',
      ],
      answer: 0,
      explain:
        'A judgement whose basis is not on the page forces the consumer to interrogate the analyst before acting, which is exactly the delay observed; the discipline is to own the judgement and, in the same breath, say what it is based on. Promoting the annexes is the tempting fix because the evidence does live there, but it makes the committee reconstruct the reasoning itself and buries the conclusion the product exists to deliver.',
    },
    {
      id: 'pl-s5q4',
      domain: 'Dissemination',
      prompt:
        'A manufacturer asks whether the intrusion set that has been inside its network for a year is going to deploy destructive malware against it in the coming quarter. The team has four years of well-sourced visibility into the group: every operation on record has been collection-focused, the tooling has no destructive component, and the sponsor state has declared economic priorities. Last month a firm in the same sector was wiped by an unrelated actor. Which formulation BEST expresses the team judgement?',
      choices: [
        'Likely, with low confidence',
        'Unlikely, with high confidence',
        'Roughly an even chance, with high confidence',
        'Unlikely, with low confidence',
      ],
      answer: 1,
      explain:
        'Confidence reports the strength of the analytic basis, not the direction of the judgement, so four years of consistent, well-sourced visibility supports high confidence even though the assessed probability of the event is low. Hedging the confidence down because the event cannot be ruled out is the most tempting error, and lifting the band because a comparable firm was hit by somebody else is the same mistake from the other side: both collapse two independent axes into one dial.',
    },
    {
      id: 'pl-s5q5',
      domain: 'Dissemination',
      prompt:
        'A published line reads: "We assess it is likely (moderate confidence) that the group will move against the firm\'s logistics suppliers within 90 days." Since publication, a second collection source independent of the first has described the same tasking discussion, and a peer team\'s telemetry is consistent with it. Nothing new has been observed about the group acting on tasking of this kind, and no fresh targeting has appeared. Which revision is MOST appropriate?',
      choices: [
        'Very likely, with moderate confidence',
        'Almost certain, with moderate confidence',
        'Likely, with high confidence',
        'Very likely, with high confidence',
      ],
      answer: 2,
      explain:
        'Independent corroboration strengthens the foundation the judgement rests on, which is what the confidence level reports, so it moves from moderate to high. It says nothing new about whether the group will act, so the probability band stays where it was; pushing it up to "very likely" because the sourcing improved is the standard conflation of the two axes and is the option most analysts reach for first.',
    },
    {
      id: 'pl-s5q6',
      domain: 'Dissemination',
      prompt:
        "Two hours after confirming an intrusion, a team publishes its indicator set to the sector's shared platform. One entry is the address of the front end the actor used; it belongs to a large hosting provider that also fronts several members' own customer portals. Within a day three members have blocked traffic to their own services and a fourth has stopped ingesting the team's feed. Which practice on the producing side would MOST directly have prevented this?",
      choices: [
        'Shortening the validity window applied to every indicator in the set',
        'Restricting the set to a narrower handling marking before publishing it',
        'Publishing the set as structured objects rather than as a flat export',
        'Judging each indicator for specificity and holding back shared hosting addresses',
      ],
      answer: 3,
      explain:
        'The damage came from an indicator that cannot separate the actor from the legitimate tenants of the same infrastructure, so the control belongs at selection time: decide what a hit would actually mean before the entry leaves the building. A shorter validity window is the tempting answer because ageing is the other way indicators turn into false-positive generators, but this one was harmful the moment it shipped and would have caused the same self-inflicted outage well inside any expiry.',
    },
    {
      id: 'pl-s5q7',
      domain: 'Dissemination',
      prompt:
        "An incident responder at a member organisation has about four thousand executables recovered from a file server decommissioned eight months ago, and wants to know whether the actor's loader was ever staged on it. Her SIEM holds thirty days of process telemetry and her network logs for that period are gone. The loader is rebuilt for each operation; your collection holds three of its builds. Which deliverable BEST serves that request?",
      choices: [
        'A YARA rule matching the loader build artefacts and its section layout',
        'A Sigma rule matching the process creation behaviour seen at loader launch',
        'The set of file hashes for the three loader builds collected to date',
        'The list of command-and-control domains the loader has been seen contacting',
      ],
      answer: 0,
      explain:
        'The request is a content scan over files sitting on disk, which is what YARA examines, and because the loader is rebuilt for each operation a rule keyed on build artefacts also catches the builds nobody has collected. The hash set is the tempting answer because it is exact and trivial to run, but it can only find the three samples already in hand — here that exactness is the limitation, not the strength.',
    },
    {
      id: 'pl-s5q8',
      domain: 'Dissemination',
      prompt:
        "A team's platform ingests two open feeds plus a partner collection whose objects arrived restricted to the recipient organisation. An engineer has built a nightly job that exports every domain in the platform to the sector portal, carrying only the value and a first-seen date. Reviewing the job before it goes live, the team finds it will also export entries whose validity window has already closed, duplicates of the open feeds, and items the team itself scored as low confidence. Which gap must be closed FIRST?",
      choices: [
        'An expiry check applied to each object before it is exported',
        "A filter on the export path that honours each object's handling restriction",
        'A deduplication step that drops entries already present in the open feeds',
        'A minimum confidence threshold that objects must meet to be exported',
      ],
      answer: 1,
      explain:
        "Every object carries the handling restriction it arrived under, so an export path that ignores markings republishes a partner's material outside the boundary it was shared within — a disclosure failure that no later correction undoes and that costs the team the relationship. The stale entries and the duplicates are real defects in the same job and should be fixed too, but they degrade the recipients' signal-to-noise rather than breaching an agreement.",
    },
    {
      id: 'pl-s5q9',
      domain: 'Dissemination',
      prompt:
        'A vendor is deciding whether to publish an intrusion-set report that names a specific foreign military unit and puts the infrastructure ranges, operator personas, working-hour patterns and victimology in the body of the document rather than in a private annex. The intrusion it describes reached several victims through the firms that manage their infrastructure, and at one victim it destroyed data on the way out. Counsel asks which case in the public record is the closest precedent for the publication decision itself.',
      choices: ['MOONLIGHT MAZE', 'Sony Pictures / Lazarus', 'APT1', 'APT10 / Cloud Hopper'],
      answer: 2,
      explain:
        'APT1 is the case that set the standard the vendor is weighing: a private company attributing state espionage to a named military unit by publishing the evidence — infrastructure, operator detail, working patterns and victimology — instead of asserting the conclusion. Cloud Hopper is the tempting pick because this intrusion also reached victims through their providers, but that case is remembered for the supplier vector and the joint public-private investigation that followed, not for the publication standard.',
    },
    {
      id: 'pl-s5q10',
      domain: 'Dissemination',
      prompt:
        'An intrusion set has been exfiltrating internal correspondence from a trade body — board minutes, legal opinions, drafts of position papers — and nothing else. Three weeks from now the members vote on a standard that two of the largest of them have publicly opposed. A second, technically distinct cluster was found in the same network last quarter and is still tracked separately. Which implication should the assessment put in front of leadership FIRST?',
      choices: [
        'The take may be published to shape the vote, so plan for disclosure as well as containment',
        'The two clusters are probably coordinating and should be assessed and handled as one operation',
        'The choice of correspondence over payment data points to a crew intending to resell the archive',
        "Collection for the actor's own use means containment alone ends the organisation's exposure",
      ],
      answer: 0,
      explain:
        'Stolen material can be the weapon rather than the product: the DNC case turned a collection operation into an influence operation by publishing the take through leak personas and dedicated sites, and correspondence taken from a trade body three weeks before a contested vote fits that shape exactly. Assuming quiet exploitation is the tempting reading because it is the espionage norm, but it is the assumption that case broke, and it leaves leadership unprepared for the publication it should be planning around.',
    },
    {
      id: 'pl-s5q11',
      domain: 'Dissemination',
      prompt:
        'A CISO must justify keeping a five-person intelligence team through a budget freeze, and can put one line of evidence in front of the finance committee. Which of the following, if true of the team, is the STRONGEST evidence that the programme has matured?',
      choices: [
        'It maintains five commercial feed subscriptions and a platform that stores them',
        'Its analysts hold seats in three sector sharing groups and speak at their meetings',
        'It has published a campaign report every month for two years without missing one',
        "Two of last quarter's spending decisions record its assessments as their basis",
      ],
      answer: 3,
      explain:
        'Maturity is integration: a programme has matured when the organisation decides differently because of it, and a spending decision that records an assessment as its basis is that integration on the record. Unbroken monthly output is the tempting answer because it demonstrates a repeatable process, but regular production that no decision depends on is what a developing programme produces, not what a mature one delivers.',
    },
    {
      id: 'pl-s5q12',
      domain: 'Dissemination',
      prompt:
        "A team's flash alerts are acted on within the hour, and its indicator hit rate is the number its dashboard leads with. Its quarterly strategic assessments are opened by fewer than half of the executives they go to and have never been cited in a leadership meeting. Which change would MOST improve what the strategic line delivers?",
      choices: [
        'Publish the assessments monthly rather than quarterly so that they stay current',
        'Ask the executives which decisions they face and rebuild the product around them',
        'Add the indicator hit statistics to the assessment so that its value is visible',
        "Route the assessments through the SOC, which already acts on the team's products",
      ],
      answer: 1,
      explain:
        'The strategic line fails because nobody established which decisions it is meant to support, and the feedback phase exists to ask exactly that and feed the answer back into the requirements. Publishing more often is the tempting fix because the symptom looks like reach, but a product no consumer needed arriving three times as often is three times the waste, and the volume metrics on the dashboard will keep reporting success while it happens.',
    },
  ],
};
