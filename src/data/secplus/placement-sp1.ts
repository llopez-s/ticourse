import type { PlacementBlock } from '../../lib/types';

// ---------------------------------------------------------------------------
// pl-sp1 — Placement block for Domain 1: General Security Concepts (SY0-701)
//
// Coverage: 1.1 control categories/types (2), 1.2 CIA/AAA/zero trust/deception
// (3), 1.3 change management (2), 1.4 cryptographic solutions (5).
// Every prompt below is original to this block — none reuse a lesson prompt
// from sp1-part1..4.ts, verified against the disjointness test in
// content.test.ts.
// ---------------------------------------------------------------------------
export const SP1_PLACEMENT: PlacementBlock = {
  id: 'pl-sp1',
  sectionId: 'sp1',
  domain: 'General Security Concepts',
  title: 'Dominio 1 · Conceptos generales de seguridad',
  blurb:
    'Tipos de control, CIA, AAA, zero trust, criptografía y PKI, gestión del cambio.',
  questions: [
    {
      id: 'pl-sp1q1',
      domain: 'General Security Concepts',
      prompt:
        'A finance manager who processes vendor payments has not taken time off in three years and always reconciles the accounts personally. The CFO now requires every employee on that team to take at least ten consecutive days of leave each year, during which someone else performs their duties. Which control type does this policy MOST directly represent?',
      choices: [
        'Preventive, because it stops the manager from being able to commit fraud',
        'Detective, because it creates an opportunity for someone else to notice irregularities the manager may have been concealing',
        'Corrective, because it restores financial records after fraud is discovered',
        'Compensating, because it substitutes for a control that cannot be implemented',
      ],
      answer: 1,
      explain:
        'Mandatory vacation is a classic detective control: having another employee perform the role for an extended period exposes discrepancies the original employee may have been hiding. It is not preventive, since nothing about the policy stops the manager from attempting fraud in the first place — the value comes entirely from someone else being exposed to the process afterward.',
    },
    {
      id: 'pl-sp1q2',
      domain: 'General Security Concepts',
      prompt:
        "A hospital's information security committee publishes a formal data classification schema — public, internal, confidential, and restricted — that every department must apply when labeling patient and business records. Which control category does the schema itself belong to?",
      choices: [
        'Managerial, because it is a governance decision that defines how data is classified across the organization',
        'Operational, because staff apply the labels to records every day',
        'Technical, because the classification is enforced by the records system',
        'Physical, because it governs how documents are stored',
      ],
      answer: 0,
      explain:
        'Creating the classification structure is an administrative, governance-level decision made by leadership, which makes it managerial. Operational is the tempting distractor because departments do apply the labels day to day, but that daily application is a separate, later activity from designing the schema itself.',
    },
    {
      id: 'pl-sp1q3',
      domain: 'General Security Concepts',
      prompt:
        "A hospital patient portal has a session-handling defect that occasionally shows one patient's lab results to a different, already-authenticated patient. No data is ever altered, and the portal remains fully available throughout. Which security property is MOST directly violated?",
      choices: [
        'Availability, because the defect affects how the portal serves data',
        'Integrity, because the wrong data appears on the screen',
        'Confidentiality, because information is disclosed to someone not authorized to see it',
        'Non-repudiation, because patients cannot prove who viewed their results',
      ],
      answer: 2,
      explain:
        "Disclosing one patient's data to a different patient is unauthorized disclosure, which is the definition of a confidentiality violation, regardless of how the exposure happened. Integrity would require the underlying data to be changed, and the scenario is explicit that nothing was altered and the service never went down, which rules out availability.",
    },
    {
      id: 'pl-sp1q4',
      domain: 'General Security Concepts',
      prompt:
        'A company rolls out Zero Trust for its finance application: every request is authenticated and explicitly authorized before access is granted. However, once a session is approved, it can reach every server on the finance VLAN for its full eight-hour duration, including systems unrelated to the requested application. Which Zero Trust principle is MOST clearly missing from this design?',
      choices: [
        'Adaptive identity',
        'Policy-driven access control',
        'Threat scope reduction',
        'The policy enforcement point',
      ],
      answer: 2,
      explain:
        'The design already authenticates and authorizes each request explicitly, so policy-driven access control is working; what is missing is limiting the blast radius of an approved session through segmentation and minimal scope, which is exactly threat scope reduction. The PEP is enforcing precisely what it was told to enforce — the problem is that the underlying policy grants too much reach, not that enforcement itself failed.',
    },
    {
      id: 'pl-sp1q5',
      domain: 'General Security Concepts',
      prompt:
        'A security team wants to observe how an attacker moves between systems after gaining an initial foothold — which internal services they probe, and in what order — without risking any real infrastructure. Which of the following is BEST suited to this goal?',
      choices: [
        'A single honeypot server exposed to the internet',
        'A honeyfile placed on a shared drive',
        'A honeynet simulating an entire internal network segment',
        'A honeytoken embedded in the customer database',
      ],
      answer: 2,
      explain:
        'Observing how an attacker pivots between systems requires more than one decoy host, which is exactly what a honeynet — a whole simulated network of honeypots — provides. A single honeypot can only show what happens to that one host, and a honeyfile or honeytoken only reveal that something was touched, not how an attacker moves across a network.',
    },
    {
      id: 'pl-sp1q6',
      domain: 'General Security Concepts',
      prompt:
        'During a scheduled migration of the email server, an unrelated team deploys a firewall rule change on the same subnet at the same time, without knowing about the migration. When the migration fails, engineers cannot determine which change caused the outage. Which change-management practice would have MOST directly prevented this confusion?',
      choices: [
        'A more detailed backout plan for the email migration',
        'Restricted activities that block unrelated changes to affected systems during the maintenance window',
        'Assigning a single change owner to both changes',
        'Extending the length of the maintenance window',
      ],
      answer: 1,
      explain:
        'Restricted activities freeze unrelated changes on affected systems during a maintenance window for exactly this reason: so any failure can be attributed to the one change in progress. A better backout plan would only help reverse the migration itself, and a longer window would not have stopped the second, unrelated change from being deployed at the same time.',
    },
    {
      id: 'pl-sp1q7',
      domain: 'General Security Concepts',
      prompt:
        'A configuration change passes every test in a staging environment that mirrors production hardware but uses a small, synthetic dataset. After deployment, the change causes production database queries to time out under real transaction volume. Which change-management element MOST likely failed to reveal this risk before implementation?',
      choices: [
        'The backout plan',
        'Test results gathered under conditions that did not reflect production load',
        "The change owner's sign-off",
        'The scheduling of the maintenance window',
      ],
      answer: 1,
      explain:
        'Test results are only useful if the test conditions resemble reality; a small synthetic dataset cannot reveal how the change behaves under real transaction volume, so the risk went undetected until deployment. A backout plan only helps after the problem occurs, and neither who signed off nor when the window was scheduled has any bearing on data volume.',
    },
    {
      id: 'pl-sp1q8',
      domain: 'General Security Concepts',
      prompt:
        'A file-sharing service publishes a SHA-1 hash next to every download so users can verify integrity. A researcher then demonstrates that two completely different files can be crafted to produce the identical SHA-1 hash. What is the PRACTICAL security implication of this demonstration for the service?',
      choices: [
        'Nothing changes in practice, because SHA-1 remains an acceptable choice for verifying downloads',
        'An attacker could craft a malicious file that produces the same published hash, defeating the integrity check',
        'User passwords hashed with SHA-1 can now be mathematically reversed to plaintext',
        "It is not exploitable unless the attacker also holds the file's original private key",
      ],
      answer: 1,
      explain:
        "A collision means two different inputs produce the same hash output, so an attacker who engineers a malicious file sharing the legitimate file's published hash defeats a hash-based integrity check entirely — which is exactly why SHA-1 is deprecated for this use. Hashing is one-way and uses no keys at all, so treating a hash as reversible or as requiring a private key are both category errors, not real obstacles to exploiting a collision.",
    },
    {
      id: 'pl-sp1q9',
      domain: 'General Security Concepts',
      prompt:
        "An e-commerce site's leaf TLS certificate is valid until 2027 and has never been modified. Six months after deployment, browsers begin showing chain validation errors even though the leaf certificate itself is unchanged. Investigation shows the issuing intermediate CA's own certificate expired the same day the errors began. Which of the following BEST explains the rejection?",
      choices: [
        "The expired intermediate certificate breaks the chain of trust regardless of the leaf's own remaining validity",
        'The root CA has revoked the leaf certificate through OCSP',
        "The leaf certificate's SAN no longer matches the site's hostname",
        "The web server's private key was compromised the same day",
      ],
      answer: 0,
      explain:
        "Chain validation checks every certificate from leaf to root, and each one must be within its own validity window; an expired intermediate invalidates everything it issued no matter how much time is left on the leaf. Revocation, a SAN mismatch, or a key compromise would each produce a different error, and none of them is implied by an expiration date lining up exactly with the intermediate's own expiry.",
    },
    {
      id: 'pl-sp1q10',
      domain: 'General Security Concepts',
      prompt:
        "A shared server hosts several departments' data as separate logical volumes on one physical disk. Compliance requires that only the HR volume be encrypted, using a key HR controls, while the operating system and other departments' volumes stay unencrypted for performance reasons. Which encryption level BEST satisfies this requirement?",
      choices: [
        'Full-disk encryption of the entire physical disk',
        'Volume-level encryption applied only to the HR partition',
        "Transport encryption between the departments' applications",
        "Record-level encryption of individual rows in HR's database",
      ],
      answer: 1,
      explain:
        "Volume-level encryption applies to one specific logical volume, letting HR's data be protected under its own key while every other volume on the same disk stays untouched, which exactly matches a mixed requirement like this one. Full-disk encryption would needlessly encrypt every other department's volume too, and record-level encryption only applies once the data already lives inside a database, not to a whole partition.",
    },
    {
      id: 'pl-sp1q11',
      domain: 'General Security Concepts',
      prompt:
        "A QA team needs a copy of the production customer database to test a new feature, but policy forbids QA staff from seeing real customers' phone numbers or emails. The DBA team delivers a copy where every phone number and email has been replaced with realistic but fake values, with no way to recover the originals from that copy, while record counts and formats stay unchanged. Which technique does this describe?",
      choices: ['Tokenization', 'Data masking', 'Steganography', 'Key escrow'],
      answer: 1,
      explain:
        "Data masking replaces sensitive values with realistic but fake ones while preserving structure and format for testing, which is exactly what the QA copy needed. Tokenization is the tempting distractor because it also substitutes values, but tokenization keeps a reversible mapping in a vault so the original can be recovered — the opposite of what this scenario asks for.",
    },
    {
      id: 'pl-sp1q12',
      domain: 'General Security Concepts',
      prompt:
        "An organization's PKI is designed so that a separate registration authority (RA) verifies the identity documents of every certificate requester, while the CA itself never interacts directly with applicants. From a security standpoint, what is the PRIMARY benefit of this separation?",
      choices: [
        'It lets the RA sign certificates faster than the CA could alone',
        "It isolates the CA's signing function from identity vetting, reducing the CA's exposure while still verifying every requester",
        'It removes the need to publish a certificate revocation list',
        'It allows certificates to be issued without a certificate signing request',
      ],
      answer: 1,
      explain:
        "Separating identity vetting (RA) from the signing operation (CA) limits who and what interacts with the CA's high-value signing function, reducing its exposure while still ensuring every applicant is verified before issuance. The RA never has signing authority and only forwards verified requests, so it cannot itself issue certificates, and this separation affects neither revocation nor the CSR requirement.",
    },
  ],
};
