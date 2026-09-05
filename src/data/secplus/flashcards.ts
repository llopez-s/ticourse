import type { Flashcard } from '../../lib/types';
import { SP2_FLASHCARDS } from './sp2-cards';
import { SP3_FLASHCARDS } from './sp3-cards';
import { SP4_FLASHCARDS } from './sp4-cards';
import { SP5_FLASHCARDS } from './sp5-cards';

/** Security+ SY0-701 flashcards. Fronts and backs in English (exam language). */
export const SP_FLASHCARDS: Flashcard[] = [
  // ---- SP1: General Security Concepts (1.1–1.4) ---------------------------
  { id: 'fcp101', sectionId: 'sp1', front: 'Four security control CATEGORIES', back: 'Technical (implemented by systems: firewalls, encryption, ACLs), Managerial (policies, risk assessments, oversight), Operational (performed by people day to day: guard patrols, awareness training, backups), Physical (fences, locks, bollards, badge readers).' },
  { id: 'fcp102', sectionId: 'sp1', front: 'Six security control TYPES', back: 'Preventive (stops it before it happens), Deterrent (discourages the attempt), Detective (identifies it during/after), Corrective (restores after the fact), Compensating (alternative when the primary control is not feasible), Directive (tells people what to do: policies, signage).' },
  { id: 'fcp103', sectionId: 'sp1', front: 'Compensating control', back: 'A substitute control that reduces the same risk when the preferred control cannot be applied (cost, legacy system, business constraint). Example: network segmentation + monitoring around an unpatchable server.' },
  { id: 'fcp104', sectionId: 'sp1', front: 'CIA triad', back: 'Confidentiality = only authorized parties can read (encryption, ACLs). Integrity = data is unaltered and trustworthy (hashing, signatures). Availability = accessible when needed (redundancy, backups, DDoS protection).' },
  { id: 'fcp105', sectionId: 'sp1', front: 'Non-repudiation', back: 'Assurance that the originator of an action or message cannot later deny it. Achieved with digital signatures (private key only the signer holds) plus audit logs.' },
  { id: 'fcp106', sectionId: 'sp1', front: 'AAA', back: 'Authentication (prove who you are), Authorization (what you may do), Accounting (log what you did). Applies to people AND systems (certificates, device identity). Authorization models: role, attribute, rule, discretionary, mandatory.' },
  { id: 'fcp107', sectionId: 'sp1', front: 'Gap analysis', back: 'Compare the CURRENT security posture against a DESIRED state (framework, regulation, baseline); the differences are the gaps, prioritized into a remediation roadmap.' },
  { id: 'fcp108', sectionId: 'sp1', front: 'Zero Trust: CONTROL plane components', back: 'Adaptive identity, threat scope reduction, policy-driven access control, Policy Engine (decides grant/deny) + Policy Administrator (issues/revokes the session, instructs the PEP). Engine + Administrator = Policy Decision Point (PDP).' },
  { id: 'fcp109', sectionId: 'sp1', front: 'Policy Enforcement Point (PEP)', back: 'DATA plane component. Sits in the path between the subject and the resource; opens, monitors and closes the connection strictly as instructed by the Policy Administrator. It enforces, it never decides.' },
  { id: 'fcp110', sectionId: 'sp1', front: 'Adaptive identity', back: 'Zero Trust idea: identity is evaluated continuously with context (location, device health, time, behavior, risk score), not just once at login. Higher risk → step-up authentication or denial.' },
  { id: 'fcp111', sectionId: 'sp1', front: 'Access control vestibule', back: 'Two interlocked doors; the second opens only after the first closes and the person is verified. Defeats tailgating/piggybacking by admitting one person at a time (formerly "mantrap").' },
  { id: 'fcp112', sectionId: 'sp1', front: 'Physical sensor types', back: 'Infrared (body heat / motion), Pressure (weight on a floor plate or mat), Microwave (reflected radio waves detect movement, covers large areas, passes through some walls), Ultrasonic (reflected sound waves detect motion inside a room).' },
  { id: 'fcp113', sectionId: 'sp1', front: 'Honeypot vs honeynet vs honeyfile vs honeytoken', back: 'Honeypot = one decoy system. Honeynet = a network of decoy systems. Honeyfile = bait file (e.g. "passwords.xlsx") that alerts when opened. Honeytoken = fake data element (credential, API key, DB record) whose use reveals a breach.' },
  { id: 'fcp114', sectionId: 'sp1', front: 'Backout plan', back: 'Documented, tested steps to reverse a change and restore the previous working state if the change fails. Must exist BEFORE implementation and be part of the change request.' },
  { id: 'fcp115', sectionId: 'sp1', front: 'Maintenance window', back: 'A pre-agreed time period (usually low usage) in which approved changes are implemented, so any downtime has minimal business impact and users are forewarned.' },
  { id: 'fcp116', sectionId: 'sp1', front: 'Impact analysis (change management)', back: 'Assessment done before approval: which systems, dependencies, users and services the change affects, plus the risk if it fails. Feeds the CAB decision and the backout plan.' },
  { id: 'fcp117', sectionId: 'sp1', front: 'Symmetric vs asymmetric encryption', back: 'Symmetric: one shared key, fast, bulk data (AES); challenge = key distribution. Asymmetric: public/private key pair, slow, used for key exchange and signatures (RSA, ECC). Real systems combine both (hybrid).' },
  { id: 'fcp118', sectionId: 'sp1', front: 'Hashing', back: 'One-way function producing a fixed-length digest from any input (SHA-256). Same input → same hash; tiny change → completely different hash. Provides integrity, NOT confidentiality (no key, not reversible).' },
  { id: 'fcp119', sectionId: 'sp1', front: 'Salting', back: 'Appending a random, unique value to each password before hashing. Identical passwords yield different hashes and precomputed rainbow tables become useless.' },
  { id: 'fcp120', sectionId: 'sp1', front: 'Key stretching', back: 'Running a password through thousands of hash iterations (PBKDF2, bcrypt, scrypt) so each guess is expensive, slowing brute-force and dictionary attacks.' },
  { id: 'fcp121', sectionId: 'sp1', front: 'Digital signature: how and which key?', back: 'Sender hashes the message and encrypts the hash with their PRIVATE key. Receiver decrypts with the sender\'s PUBLIC key and compares hashes. Gives integrity, authentication and non-repudiation.' },
  { id: 'fcp122', sectionId: 'sp1', front: 'CRL vs OCSP', back: 'CRL: periodically published list of revoked certificate serials, downloaded in full, can be stale. OCSP: real-time query to the CA responder for ONE certificate\'s status. OCSP stapling: the server attaches a signed response to the TLS handshake.' },
  { id: 'fcp123', sectionId: 'sp1', front: 'CSR (Certificate Signing Request)', back: 'Message sent to a CA containing the applicant\'s PUBLIC key and identity details (CN, org), signed with the applicant\'s private key. The private key never leaves the requester. The CA validates and returns the signed certificate.' },
  { id: 'fcp124', sectionId: 'sp1', front: 'TPM vs HSM', back: 'TPM: chip on the motherboard, holds keys for that one device (BitLocker, secure boot, attestation). HSM: dedicated tamper-resistant appliance or card serving many systems, high-speed key generation/storage (CA root keys, payment systems).' },
  { id: 'fcp125', sectionId: 'sp1', front: 'Key escrow', back: 'Copies of private/decryption keys stored with a trusted third party or internal custodian so data can be recovered if the key is lost or for lawful access. Trade-off: one more party that must be protected.' },
  { id: 'fcp126', sectionId: 'sp1', front: 'Wildcard certificate', back: 'A certificate for *.example.com that secures all hosts at ONE subdomain level (mail., www., app.) but not deeper levels (a.b.example.com) nor the bare domain unless listed as a SAN. Convenient; compromise exposes every host it covers.' },

  // ---- SP2: Threats, Vulnerabilities & Mitigations ------------------------
  ...SP2_FLASHCARDS,

  // ---- SP3: Security Architecture -----------------------------------------
  ...SP3_FLASHCARDS,

  // ---- SP4: Security Operations -------------------------------------------
  ...SP4_FLASHCARDS,

  // ---- SP5: Security Program Management & Oversight ------------------------
  ...SP5_FLASHCARDS,
];
