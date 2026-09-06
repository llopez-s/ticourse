import type { PlacementBlock } from '../lib/types';

// ---------------------------------------------------------------------------
// pl-s5 — Placement block for GCTI section s5: Diseminación y Atribución
//
// Coverage: s5m1 audience fit and the product catalogue (2), s5m2 written
// judgements and ICD 203 estimative language (3), s5m3 technical
// dissemination — indicator context, rules and TLP in practice (3), s5m4
// historical cases (2), s5m5 feedback, metrics and team maturity (2).
//
// Every prompt is original to this block. None reuses a prompt from s5.ts,
// and each item was checked by hand against that section's tables, callouts,
// worked examples, inline checks and quiz items, because the two structures
// most exposed to pure recall here are the ICD 203 band table and the
// audience -> product / SLA tables. No stem asks a candidate to convert a
// percentage into a band or to name the product a table row already pairs
// with an audience: the estimative item asks how a published pairing should
// move when the sourcing changes, its companion asks which drafted line a
// decision-maker can act on, and the audience items turn on a dated request
// and on a team whose consumers cannot tell what to ask for. The stems use
// organisations and situations unrelated to the section's
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
        'Requests reach an intelligence team by email, by chat and in corridor conversations. Each requester negotiates length and timing individually: two of them expect anything they ask for the same day, while a third waited eleven days for an answer an analyst had drafted in an afternoon. During the last incident the team spent its first hour arguing about what the alert should contain before anyone wrote a line of it. Which single change would MOST reduce this friction?',
      choices: [
        'Agree one turnaround time that every incoming request will be answered within',
        'Route all requests through a single ticket queue so nothing is agreed by email',
        'Publish the products the team makes, who each is for, and when each one lands',
        'Write a house style guide setting headings, tone and citation format for reports',
      ],
      answer: 2,
      explain:
        'Published products with named audiences, templates and turnaround times answer all three symptoms at once: requesters learn what they can ask for and what to expect, and the team stops designing a format under incident pressure. A single turnaround time is the tempting fix because the timing complaints are the loudest, but one number across every product either makes the urgent alert late or promises an assessment nobody can research that fast.',
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
        'Book a standing briefing with the committee chair before every monthly meeting',
      ],
      answer: 0,
      explain:
        'A judgement whose basis is not on the page forces the consumer to interrogate the analyst before acting, which is exactly the delay observed; the discipline is to own the judgement and, in the same breath, say what it is based on. Promoting the annexes is the tempting fix because the evidence does live there, but it makes the committee reconstruct the reasoning itself and buries the conclusion the product exists to deliver.',
    },
    {
      id: 'pl-s5q4',
      domain: 'Dissemination',
      prompt:
        'A committee decides this month whether to fund a second authentication factor on the supplier-facing payment platform, and it sent the previous draft back saying it could not tell what the team actually thought. The analyst has one solid finding — two supplier accounts were phished last month, and one of those suppliers administers that platform — and nothing showing the group has touched the platform itself. Which line BEST serves the committee?',
      choices: [
        'Two of the suppliers were phished last month and one administers the payment platform',
        'We assess the platform is likely to be targeted this quarter, at moderate confidence',
        'The group could conceivably move against the payment platform at some point this year',
        'It is believed across the industry that the payment platform is the most probable target',
      ],
      answer: 1,
      explain:
        'A line a committee can spend against names the event, commits to a probability band and marks how strong the analytic basis is — and that confidence marker reports the basis, never the size of the claim, so the two move independently. Restating the two findings is the tempting alternative because every word of it is defensible, but it hands the judging back to the reader; a line built on could and at some point is true of almost anything, so no decision can turn on it.',
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
        "Two hours after confirming an intrusion, a team publishes forty indicators to the sector's shared platform as a flat list of values, each carrying a first-seen date and nothing else. One of them is the address of a front end the actor used; it belongs to a large hosting provider that also fronts several members' own customer portals. Within a day three members had blocked traffic to their own services and a fourth had stopped ingesting the feed. Which change to how the set is published would MOST directly prevent a repeat?",
      choices: [
        'Attach an explicit expiry to each entry so that recipients retire it on time',
        'Hold the set back until a second analyst has reviewed it against the case notes',
        'Restrict the whole set to a smaller circle of members under a stricter handling marking',
        'Ship each entry with the actor it belongs to, its phase and a confidence value',
      ],
      answer: 3,
      explain:
        'An indicator travels with the context that tells a defender what a hit would mean: whose it is, where in the intrusion it sits, and how sure the producer is. That same address, shipped at low confidence as actor infrastructure sharing a host with third parties, gets hunted; shipped as a bare value it reads as a blocking instruction, which is how the members used it. A shorter expiry is the tempting fix because ageing is the other way an indicator set turns into a false-positive generator, but this entry did its damage the hour it shipped, well inside any validity window.',
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
        'The request is a content scan over files sitting on disk, which is what YARA examines, and because the loader is rebuilt for each operation a rule keyed on artefacts that survive a rebuild — the section layout, the constant stubs — also catches the builds nobody has collected, which a rule keyed on a hash cannot. The hash set is the tempting answer because it is exact and trivial to run, but it can only find the three samples already in hand — here that exactness is the limitation, not the strength.',
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
        'A private security firm is ready to name a foreign military unit as the operator of an intrusion set it has tracked for years, and counsel puts two questions to the board at once: whether a company rather than a government can make that call in public at all, and whether to publish the material the judgement rests on or state the conclusion and keep the basis in a closed annex. Part of the investigation was worked alongside a national law-enforcement agency, some of what convinced the analysts came from a partner that forbids republication, and a government contact has said its own conclusion may not be publishable for years. Which case in the public record is the closest precedent for the decision in front of the board?',
      choices: ['MOONLIGHT MAZE', 'Sony Pictures / Lazarus', 'APT1', 'APT10 / Cloud Hopper'],
      answer: 2,
      explain:
        'APT1 is the precedent for this decision: a private company attributed state espionage to a named military unit and published the evidence the attribution rested on, rather than asserting the conclusion and keeping its basis private. Sony is the tempting pick once counsel weighs the material that cannot be republished, but there the attribution came from a government and rested on sources the public never saw; Cloud Hopper came out of a joint public-private investigation followed by an indictment, and MOONLIGHT MAZE was a multi-agency investigation whose attribution arrived years later.',
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
        'Its analysts sit on the change-advisory board and review every supplier onboarding',
        'Its analysts hold seats in three sector sharing groups and speak at their meetings',
        'It has published a campaign report every month for two years without missing one',
        "Two of last quarter's spending decisions record its assessments as their basis",
      ],
      answer: 3,
      explain:
        'Maturity is integration: a programme has matured when the organisation decides differently because of it, and a spending decision that records an assessment as its basis is that integration on the record, in the form a finance committee can check. The change-advisory seat is the harder call, because sitting where decisions are made looks like the same thing, but presence with no outcome traceable to an assessment is participation — and unbroken monthly output is the same failure in another guise, since production no decision depends on is what a developing programme delivers.',
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
