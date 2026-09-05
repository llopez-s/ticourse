import type { PlacementBlock } from '../../lib/types';

// ---------------------------------------------------------------------------
// pl-sp2 — Placement block for Domain 2: Threats, Vulnerabilities &
// Mitigations (SY0-701)
//
// Coverage: 2.1 threat actors and motivations (2), 2.2 threat vectors and
// attack surfaces (2), 2.3 vulnerability types (2), 2.4 indicators of
// malicious activity (3), 2.5 mitigation techniques (3).
//
// Every prompt below is original to this block — none reuse a lesson prompt
// or worked example (check callout, quiz item, table row, or story) from
// sp2-part1..4.ts, verified by hand against every check/quiz/table/callout in
// those four files before writing, and against the disjointness test in
// content.test.ts (which compares normalized quiz prompts).
//
// Keyed index is spread across 0-3 (three each) so option position/length
// cannot be used to guess the answer without the material. See
// docs/.superpowers/sdd/2026-09-05-placement-test/task-10-report.md for the
// table mapping each question to its final index.
// ---------------------------------------------------------------------------
export const SP2_PLACEMENT: PlacementBlock = {
  id: 'pl-sp2',
  sectionId: 'sp2',
  domain: 'Threats, Vulnerabilities & Mitigations',
  title: 'Dominio 2 · Amenazas, vulnerabilidades y mitigaciones',
  blurb:
    'Actores de amenaza, vectores, ingeniería social, vulnerabilidades, indicadores y mitigación.',
  questions: [
    {
      id: 'pl-sp2q1',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        "Three days before a cross-border military invasion begins, wiper malware disables the industrial control systems at several power substations inside the country about to be invaded. Forensic analysis shows the malware was custom-built for that specific vendor's equipment, and no ransom note ever appears, nor is any stolen data offered for sale afterward. Which threat actor is MOST likely responsible?",
      choices: ['Nation-state', 'Organized crime', 'Hacktivist', 'Unskilled attacker'],
      answer: 0,
      explain:
        "Malware custom-built for one vendor's equipment, timed precisely to a military invasion, and never monetized fits a nation-state pursuing a war-related objective rather than a payday. Organized crime is the tempting distractor because it can also field skilled developers, but a criminal group's operations are built around getting paid, and nothing here — no ransom note, no data for sale — points to money as the goal.",
    },
    {
      id: 'pl-sp2q2',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        "A dark web forum advertises a ransomware \"affiliate\" program: the developers supply the encryption tool and a negotiation portal, while independent affiliates pick their own targets and deploy the ransomware in exchange for a cut of whatever they collect. The developers never touch a victim's network themselves. Which threat actor MOST accurately describes this arrangement?",
      choices: ['Nation-state', 'Hacktivist', 'Unskilled attacker', 'Organized crime'],
      answer: 3,
      explain:
        "A revenue-sharing arrangement with developers, recruited affiliates, and a dedicated negotiation function is the business-like structure the exam associates with organized crime, whose goal is always a financial return. Nation-state is the tempting distractor because both can be well resourced, but a state actor pursuing espionage or war has no reason to split proceeds with independent affiliates recruited off a criminal marketplace.",
    },
    {
      id: 'pl-sp2q3',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        "A logistics technician's Bluetooth-enabled asset tag is left in discoverable mode at all times. During an audit, investigators find that someone nearby used a laptop to pull the tag's stored maintenance history without ever completing a pairing request and without any prompt appearing on the tag's companion app. Which threat vector was exploited?",
      choices: ['RFID card cloning', 'Bluesnarfing', 'Evil twin', 'Bluejacking'],
      answer: 1,
      explain:
        'Pulling data off a Bluetooth device by taking advantage of permissive visibility and weak pairing, without the owner ever noticing, is bluesnarfing. Bluejacking is the tempting distractor because it targets the same discoverable devices, but bluejacking only pushes unsolicited messages to a device — it never extracts data from it.',
    },
    {
      id: 'pl-sp2q4',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'An unfamiliar visitor wearing a badge that reads "Corporate IT — Onsite Support" tells a machine operator on a manufacturing floor that she needs to quickly check the operator\'s login on a shop-floor terminal. The operator steps aside and lets her type on the keyboard, and the visitor leaves minutes later. Which social engineering technique does this describe?',
      choices: ['Watering hole', 'Brand impersonation', 'Impersonation', 'Typosquatting'],
      answer: 2,
      explain:
        "Claiming a specific role — an IT support technician — to gain hands-on access to a system in person is impersonation. Brand impersonation is the tempting distractor because both borrow someone else's credibility, but brand impersonation copies an organization's logos and messaging in emails, texts, or fake sites, not one person adopting a role face to face.",
    },
    {
      id: 'pl-sp2q5',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        "A researcher discloses that a hospital infusion pump's device-level update mechanism — the layer that controls the pump before its operating system even starts — installs any file it is given, without checking a digital signature. Malicious code loaded this way survives a full factory reset and a complete reinstallation of the pump's operating system. Which category of vulnerability does this represent?",
      choices: [
        'Zero-day',
        'Legacy vulnerability',
        'Operating system vulnerability',
        'Firmware vulnerability',
      ],
      answer: 3,
      explain:
        'Code that lives beneath the operating system, in the layer that runs before the OS even loads, survives an OS reinstall and a factory reset precisely because neither action touches it — the hallmark of a firmware vulnerability. Zero-day is the tempting distractor because the flaw is newly disclosed, but zero-day specifically means a flaw already being exploited before the vendor knows about it or can patch it, and nothing here indicates active exploitation in the wild.',
    },
    {
      id: 'pl-sp2q6',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        "A code audit of a mobile banking app finds that its AES encryption key is written directly into the application's source code and has never been rotated since release three years ago, despite dozens of developers having had repository access in that time. Which vulnerability category BEST fits this finding?",
      choices: [
        'Cryptographic vulnerability',
        'Supply chain vulnerability',
        'Application misconfiguration',
        'Zero-day vulnerability',
      ],
      answer: 0,
      explain:
        "A key that is hardcoded and never rotated is a failure of key custody, which the exam classifies as a cryptographic vulnerability regardless of how strong the underlying algorithm is. Supply chain is the tempting distractor because the key sits in a shared repository, but the weakness is how the organization's own key is generated, stored, and rotated, not a component supplied or tampered with by an outside vendor.",
    },
    {
      id: 'pl-sp2q7',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        "A threat intelligence vendor notifies a bank that a criminal marketplace is selling a dataset of the bank's customer account numbers and passwords, three weeks before the bank's own security tools flag any unusual login activity. Which indicator of malicious activity does this represent?",
      choices: ['Missing logs', 'Published or documented', 'Resource consumption', 'Concurrent session usage'],
      answer: 1,
      explain:
        'Stolen data surfacing for sale on a criminal marketplace is the published/documented indicator, and it is often the first sign of a breach that internal monitoring never caught. Missing logs is the tempting distractor because both describe something monitoring failed to catch, but missing logs specifically means a log source has gone silent, not that data has turned up outside the organization.',
    },
    {
      id: 'pl-sp2q8',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        "On an internal office network, an analyst finds that two different physical machines on the same VLAN both answer ARP requests for the default gateway's IP address. Around the same time, employees start seeing certificate warnings when reaching internal HTTPS applications they normally reach without any warning. Which attack is MOST likely underway?",
      choices: ['DNS poisoning', 'Evil twin', 'On-path attack', 'Credential replay'],
      answer: 2,
      explain:
        'Two hosts both claiming to be the gateway is classic ARP poisoning, which lets an attacker sit between clients and the real gateway and relay traffic through its own certificate, producing exactly the warnings employees are seeing. DNS poisoning is the tempting distractor because it also redirects traffic, but it works by corrupting name resolution, not by forging ARP replies on the local subnet.',
    },
    {
      id: 'pl-sp2q9',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        "A help-desk technician's account, normally limited to resetting standard users' passwords, is observed creating new domain administrator accounts and editing group policy objects shortly after a phishing email was opened on that technician's workstation. Which indicator BEST describes what is happening to the account?",
      choices: [
        'Vertical privilege escalation',
        'Horizontal privilege escalation',
        'Concurrent session usage',
        'Credential replay',
      ],
      answer: 0,
      explain:
        'An account moving from a limited, standard-user function to administrative actions like creating domain admins is vertical privilege escalation — a jump up in privilege level. Horizontal privilege escalation is the tempting distractor because both describe unauthorized use of an account, but horizontal escalation means reaching another account at the same privilege level, not gaining rights the account never had.',
    },
    {
      id: 'pl-sp2q10',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        'A vulnerability scan flags a specific, publicly known CVE in the web application framework running in production. The vendor published a fix for that exact CVE two months ago, but the production environment has not been updated since. Which mitigation MOST directly addresses this finding?',
      choices: ['Application allow listing', 'Configuration enforcement', 'Isolation', 'Patching'],
      answer: 3,
      explain:
        "A known vulnerability with a fix already available calls for patching, which removes the flaw at its source instead of working around it. Configuration enforcement is the tempting distractor because it also keeps systems aligned to a standard, but it corrects drift away from an approved baseline — it does not supply the vendor's fix for one specific CVE.",
    },
    {
      id: 'pl-sp2q11',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        "A financial firm's nightly database backups are uploaded to cloud storage. A misconfigured storage policy left the backup files readable by anyone with the direct link for several hours, and logs confirm an unknown party downloaded them before the policy was corrected. Which mitigation, if it had already been in place, would have BEST kept the downloaded backups from being usable to that party?",
      choices: ['Monitoring', 'Encryption', 'Decommissioning', 'Configuration enforcement'],
      answer: 1,
      explain:
        'Data encrypted at rest stays unreadable to anyone who obtains a copy without the key, so even a successfully downloaded backup would have been worthless to whoever took it. Configuration enforcement is the tempting distractor because fixing the misconfigured policy would have stopped the exposure itself, but the question asks what protects the data once it is already out the door, which is exactly what encryption does.',
    },
    {
      id: 'pl-sp2q12',
      domain: 'Threats, Vulnerabilities & Mitigations',
      prompt:
        "During incident response, investigators determine that an attacker held valid access to a company's file servers for nearly eight months before anyone noticed, because none of the affected systems forwarded their authentication or file-access events anywhere for review. Which mitigation MOST directly addresses the gap that let the intrusion go unnoticed for so long?",
      choices: ['Least privilege', 'Patching', 'Monitoring', 'Segmentation'],
      answer: 2,
      explain:
        "Centralizing and reviewing logs — the core of monitoring — is what shortens dwell time by surfacing suspicious access instead of letting it run unseen for months. Segmentation is the tempting distractor because it also limits an intrusion's impact, but it would not have made anyone notice the activity sooner; it only would have limited where the attacker could go once inside.",
    },
  ],
};
