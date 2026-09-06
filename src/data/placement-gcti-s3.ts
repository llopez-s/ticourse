import type { PlacementBlock } from '../lib/types';

// ---------------------------------------------------------------------------
// pl-s3 — Placement block for GCTI section 3: Fuentes de Colección
//
// Coverage: s3m1 collection management and the CMF (2) — matching a standing
// requirement to the source that actually answers it, and judging a source by
// coverage/timeliness/accuracy/completeness; s3m2 malware as a collection
// source (2) — static extraction when detonation yields nothing, and the OPSEC
// price of publishing a targeted sample; s3m3 infrastructure (3) — tenancy as
// the test of a pivot, temporal scoping of passive DNS, and the registration
// stage of the malicious domain lifecycle; s3m4 OSINT, TLP and communities (2)
// — choosing a marking for material you produce, and vendor visibility bias;
// s3m5 IOCs, STIX/TAXII and YARA (3) — what a YARA rule can and cannot see,
// what STIX carries versus what TAXII moves, and indicator durability.
//
// Every prompt is original. Each item was checked by hand against the lesson
// bodies of s3.ts, not just its question bank: the CMF extract for Meridian
// Dynamics, the GLASS VIPER sandbox report, the "pivote desde la muestra"
// chain, the WHOIS + passive DNS extract for the phishing domain, the incoming
// STIX indicator and the TLP fumble callout are all worked examples a learner
// can answer from recall, so no stem here dramatises one. Several items
// deliberately invert a drilled reflex: q5 keys co-residency on an address
// where the lesson trains "IP pivots are noisy" (the address has three
// tenants, and the alternatives are the mass-shared ones); q1 keys the mail
// gateway, which the CMF table never lists, against the proxy row it does.
//
// Design rule this block is built on: every stem supplies triggering facts for
// two or more of its options, so the candidate must decide which one applies
// MOST directly rather than match English. All four options in each item stay
// in the same category and medium — four sources, four source properties, four
// pivots, four TLP levels, four sample artifacts — so no option is deletable
// by someone who does not know the material.
//
// Keyed index is spread three each across 0-3, and in no item is the key the
// longest option. Prompts, choices and explanations are English, matching the
// s3 question bank; only title and blurb are Spanish, for the block card. See
// docs/superpowers/plans/2026-09-05-placement-test.md for the plan this block
// implements.
// ---------------------------------------------------------------------------
export const S3_PLACEMENT: PlacementBlock = {
  id: 'pl-s3',
  sectionId: 's3',
  domain: 'Collection',
  title: 'Sección 3 · Fuentes de Colección',
  blurb:
    'CMF y gaps de colección, malware, pivoteo de infraestructura, TLP, IOCs, STIX/TAXII y YARA.',
  questions: [
    {
      id: 'pl-s3q1',
      domain: 'Collection',
      prompt:
        "A regional airline's intelligence cell is asked to establish how many staff received a particular lure message, counting those who never opened it. The cell has endpoint agent telemetry across the workstation fleet, a web proxy that logs every outbound request, a passive DNS subscription, and thirty days of mail gateway records. Which source answers the question as asked MOST completely?",
      choices: [
        'Endpoint agent telemetry from the workstation fleet',
        'Web proxy logs of every outbound request',
        'Passive DNS history for the domain used in the lure',
        "The mail gateway's record of delivered messages",
      ],
      answer: 3,
      explain:
        'Only the mail gateway observes delivery itself, so it accounts for every recipient whether or not anyone opened or clicked. Proxy logs are the tempting choice because they show who reached the lure domain, but they capture only the subset that acted on the message and would undercount recipients by design.',
    },
    {
      id: 'pl-s3q2',
      domain: 'Collection',
      prompt:
        "An insurer's intelligence cell subscribes to a curated bulletin listing the command-and-control domains seen against firms in its sector. Analysts have never found an incorrect entry in it, and it treats the insurer's own sector in depth, though it says nothing about the reinsurance brokers the firm works through and gives bare domains with no supporting detail. It is published on the first Monday of each month and describes the previous month's activity. Measured against the cell's standing requirement to block the actor's domains before staff are exposed to them, which property of the source is the binding limitation?",
      choices: ['Coverage', 'Timeliness', 'Accuracy', 'Completeness'],
      answer: 1,
      explain:
        'A bulletin published monthly about the month before reaches the cell up to five weeks after the activity, so its domains have normally been burned by the time anyone could block them ahead of exposure. Coverage is the tempting answer because the reinsurance brokers fall outside the bulletin, but that gap would bite a different requirement; this one fails even if coverage were perfect.',
    },
    {
      id: 'pl-s3q3',
      domain: 'Collection',
      prompt:
        "A stage-one implant recovered from a compromised host at a seed-genetics firm terminates two seconds into detonation in the firm's own sandbox and opens no connections; an analyst who has met the family before says it checks whether the machine is domain-joined before doing anything else. The team needs the addresses the implant would have contacted, and the actor still has access. Which action is MOST likely to recover them?",
      choices: [
        'Re-run the sample in the same sandbox with a longer execution timeout',
        'Upload the sample to a public sandbox that presents a domain-joined environment',
        'Extract and decode the configuration embedded in the sample without running it',
        "Look the sample's hash up on a public multi-engine service and read any report",
      ],
      answer: 2,
      explain:
        'The addresses are carried inside the binary, so decoding its configuration statically recovers them whether or not the sample ever runs to completion, without having to defeat the environment check and without exposing the file. The public sandbox is the tempting option because it would satisfy that check, but uploading a targeted implant during a live intrusion tells an actor who watches for their own samples that they have been found.',
    },
    {
      id: 'pl-s3q4',
      domain: 'Collection',
      prompt:
        'Three weeks into an intrusion at a port operator, responders hold the loader, its C2 domains and a working detection. Two other operators in the sector are believed to be affected and have not yet been contacted, the actor still holds access somewhere in the environment, and the communications team wants a write-up out while the story is current. What is the BEST handling of the material?',
      choices: [
        'Pass the sample and detection to the sector ISAC under handling restrictions',
        'Upload the loader to a public multi-engine service so every vendor detects it',
        'Publish the write-up with the hashes and C2 domains while the activity is current',
        'Hold all of it internally until the actor has been evicted from the environment',
      ],
      answer: 0,
      explain:
        'A trusted sector channel reaches the two affected operators quickly while keeping the material out of the open sources the actor monitors, which is what sharing communities exist for. Publishing — like uploading the loader publicly — would warn the sector too, but it simultaneously tells the actor they are detected and buys rotation within hours, and holding everything until eviction leaves the other two victims blind for weeks.',
    },
    {
      id: 'pl-s3q5',
      domain: 'Collection',
      prompt:
        "A credential-harvesting domain used against a university has been taken out of service, and investigators want the actor's remaining staging domains before the next wave. The domain resolved to an address in a hosting provider's range on which passive DNS recorded only two other domains during the same period; its registrant is a privacy proxy service; its certificate came from an automated free CA; and it used the registrar's default nameservers. Which pivot is MOST likely to surface further infrastructure the actor controls?",
      choices: [
        'Other domains registered behind the same privacy proxy service',
        'The two other domains resolving to that address in that period',
        'Other certificates issued by that automated certificate authority',
        "Other domains that use the same registrar's default nameservers",
      ],
      answer: 1,
      explain:
        "Whether a shared resource discriminates depends on how many tenants it has, and an address carrying three domains in the relevant window is effectively dedicated, so co-residency there is a real link. The privacy proxy, the free CA and the default nameservers each cover millions of unrelated domains, so a pivot on any of them returns a crowd rather than the actor's estate.",
    },
    {
      id: 'pl-s3q6',
      domain: 'Collection',
      prompt:
        "An intrusion at a shipping company in March 2026 used a C2 address that also appears in a 2021 report on a different intrusion set. The address sits in a large hosting provider's range, and passive DNS records 60 domains on it between 2021 and 2023, none at all from 2023 to December 2025, and two since January 2026 — the C2 and one other. Which pivot from the address is MOST defensible for the March 2026 investigation?",
      choices: [
        'All 60 domains recorded on the address between 2021 and 2023',
        'The other addresses named in the 2021 report on the earlier intrusion set',
        'The one other domain that has resolved to the address since January 2026',
        'Other addresses inside the same hosting provider range as the C2',
      ],
      answer: 2,
      explain:
        "Addresses are reassigned, so passive DNS supports a link only when the observations are scoped to the window under investigation, and the single 2026 co-resident is the only one contemporaneous with this activity. The 2021 block is tempting because it is far larger, but a two-year silence between the two sets is the signature of a reassignment, and importing it would graft another intrusion set's estate onto this case.",
    },
    {
      id: 'pl-s3q7',
      domain: 'Collection',
      prompt:
        "A grocery chain's team finds eleven domains combining its brand with delivery-related words. All eleven were created inside a four-minute window at one registrar six weeks ago, point at the same parking nameservers, and have never resolved to a live host. Yesterday one of them delivered phishing to a competitor's staff. What is the MOST useful action for the remaining ten?",
      choices: [
        'Add all ten to blocking and detection now, ahead of any observed use',
        'Wait until each one resolves to a live host before adding it',
        "Act only on the domain used in yesterday's phishing, the one with observed activity",
        'Refer the batch to the registrar for abuse handling and take no detection action',
      ],
      answer: 0,
      explain:
        "Creation inside one window at one registrar followed by parking is the aging stage of a malicious domain's life, and the confirmed use of one member makes the batch one operation's inventory, which is exactly why registration patterns are worth watching. Waiting for each domain to resolve concedes the head start the actor bought by parking them, and an abuse referral protects nobody while it is pending.",
    },
    {
      id: 'pl-s3q8',
      domain: 'Collection',
      prompt:
        'A hospital group finishes a report on activity it is still responding to. It wants the twelve other members of its health-sector sharing group to act on it, and expects each of them to pass the detections to their own staff and to the clinics whose systems they run under contract. It does not want the report circulating in the wider community or reaching the press while the actor is active. Which marking BEST expresses that?',
      choices: ['TLP:RED', 'TLP:AMBER', 'TLP:AMBER+STRICT', 'TLP:GREEN'],
      answer: 1,
      explain:
        'AMBER lets each recipient organisation act internally and pass the material to the clients it serves on a need-to-know basis, which is exactly the reach described. AMBER+STRICT is the near neighbour, but it stops at the recipient organisation and would bar the contracted clinics, while GREEN would release the report to the whole community the group wants it kept from.',
    },
    {
      id: 'pl-s3q9',
      domain: 'Collection',
      prompt:
        'Two vendors publish on the same intrusion set five weeks apart, over reporting periods that overlap by four months. One sells endpoint agents and its customers are mostly European manufacturers; it describes a campaign against industrial firms. The other sells mail filtering to mostly North American banks; it describes the same loader and the same C2 naming convention used against financial institutions. A Latin American logistics operator is judging its own exposure. What is the BEST reading of the difference between the reports?',
      choices: [
        'The intrusion set shifted its targeting between the two reporting periods',
        'Two separate groups share the tooling, and each report describes one of them',
        'The endpoint vendor is the more reliable, given its richer telemetry source',
        "Each report shows only the slice of activity that vendor's customers saw",
      ],
      answer: 3,
      explain:
        'Each vendor observes only its own customer base, so two disjoint bases produce two partial views of one campaign — a sampling artifact rather than a finding about the actor. A targeting shift is the tempting reading, but the periods overlap and both reports describe the same loader and naming convention; and since neither vendor can see Latin American logistics, the operator cannot treat either one as evidence that it is out of scope.',
    },
    {
      id: 'pl-s3q10',
      domain: 'Collection',
      prompt:
        "After an intrusion at a brewery the team holds four artifacts of the implant: the interval and jitter of its beacon, the certificate its C2 server presented, the name of the scheduled task it creates, which it assembles at run time from the host name, and a decoding stub whose bytes are identical in every build recovered so far. The team wants a YARA rule that finds further copies of the implant on the fleet's disks. Which artifact is the BEST basis for that rule?",
      choices: [
        'The beacon interval and jitter seen in its network traffic',
        'The certificate presented by its command-and-control server',
        'The name of the scheduled task it creates on each host',
        'The decoding stub whose bytes are identical across builds',
      ],
      answer: 3,
      explain:
        'A YARA rule matches patterns in the contents of a file or of memory, so it can only use something actually present in the sample; the constant decoding stub is, and its stability across builds means it survives recompilation. Beacon timing and the certificate exist on the wire and on the C2 host rather than in the file, and the task name is assembled at run time, so no fixed byte sequence for it exists on disk to match.',
    },
    {
      id: 'pl-s3q11',
      domain: 'Collection',
      prompt:
        "An ISAC member publishes indicators that its partners' platforms poll and ingest without trouble, and every entry carries the same confidence value. Partners raise two problems: when an indicator fires they cannot tell what activity it belongs to, and old entries keep firing long after the infrastructure behind them has moved on. Which change to what is published MOST directly addresses both?",
      choices: [
        'Attach a relationship to the intrusion set and an expiry to each indicator',
        'Move the content from a polled collection onto a publish-subscribe channel',
        'Raise the confidence value carried on every indicator the feed publishes',
        'Publish the same indicators as YARA rules alongside the existing feed',
      ],
      answer: 0,
      explain:
        "Both complaints are about what the objects carry rather than how they travel: a relationship ties an indicator to the malware or intrusion set it belongs to, and an expiry tells the consumer when to stop acting on it. Switching to a publish-subscribe channel is the tempting fix, but transport is already delivering everything on time — that is TAXII's job, while the missing context and lifetime are fields of the STIX objects themselves.",
    },
    {
      id: 'pl-s3q12',
      domain: 'Collection',
      prompt:
        "An intrusion at a ferry operator yields four observables, all accurate today: the SHA-256 of the loader, the IP address it used for command and control, the domain that resolved to that address, and the format of the named pipe the loader opens on every host it runs on. The team must pick one to build detection around that it does not expect to revisit for a year. Which is MOST likely still to identify the actor's activity then?",
      choices: [
        'The SHA-256 file hash of the loader binary',
        'The IP address it used for command and control',
        'The format of the named pipe the loader opens',
        'The domain that resolved to that C2 address',
      ],
      answer: 2,
      explain:
        "One recompilation changes the file hash, and domains and addresses are registered, burned and reassigned continuously, so within a year all three will have decayed and may well point at whoever inherited them. The pipe naming belongs to the implant's own design, which the actor gives up only by reworking and retesting code — capability artifacts outlive infrastructure and file identity.",
    },
  ],
};
