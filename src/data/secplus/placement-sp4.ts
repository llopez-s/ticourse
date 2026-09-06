import type { PlacementBlock } from '../../lib/types';

// ---------------------------------------------------------------------------
// pl-sp4 — Placement block for Domain 4: Security Operations (SY0-701)
//
// Domain 4 is the largest domain on the exam (28%) and the largest section
// here — eleven lessons, sp4m1..sp4m11. Twelve questions cannot sample it
// evenly, so the selection targets the decisions that separate competence
// from familiarity rather than the definitions the lessons already drill.
//
// Coverage: 4.1-4.2 secure baselines and hardening (2); 4.3-4.4 vulnerability
// management and alerting/monitoring (3); 4.5-4.6 enterprise security
// capabilities and IAM (3); 4.7 automation and orchestration (1); 4.8
// incident response (2); 4.9 data sources for investigation (1).
//
// Every prompt is original to this block. Each item was checked by hand
// against the tables, callouts, worked examples, inline checks and quiz
// items of sp4-part1..6.ts before it was written, because Domain 4's lessons
// summarise heavily and a stem rebuilt from a summary row is answerable by
// recall alone. Several items deliberately invert a lesson's memorised
// mapping — an end-of-life appliance that should nonetheless be patched, a
// clean authenticated scan whose coverage is the defect, an offboarding done
// correctly that still leaves access — so that recall without reasoning
// produces a wrong answer.
//
// Design rule this block is built on: every stem supplies triggering facts
// for two or more of its options, so the candidate has to decide which
// concept applies MOST directly rather than match English. Controls already
// in place are stated operationally, never by naming the concept they
// implement, and all four options in each item stay in the same category so
// nothing is deletable by someone who does not know the material.
//
// Keyed index is spread three each across 0-3, and in no item is the key the
// longest option. See docs/superpowers/plans/2026-09-05-placement-test.md
// for the plan this block implements.
// ---------------------------------------------------------------------------
export const SP4_PLACEMENT: PlacementBlock = {
  id: 'pl-sp4',
  sectionId: 'sp4',
  domain: 'Security Operations',
  title: 'Dominio 4 · Operaciones de seguridad',
  blurb:
    'Hardening, gestión de vulnerabilidades, monitorización, IAM, automatización y respuesta a incidentes.',
  questions: [
    {
      id: 'pl-sp4q1',
      domain: 'Security Operations',
      prompt:
        "A regional airline has run a purchased crew-rostering platform for four years. In June the vendor issued an advisory for a component it embeds, rated critical, and told the airline that same week that its own installation was affected. The corrected build reached the airline in November, because the vendor gathers security work into a release it ships every six months; it has delivered every one of those releases on schedule since installation, still sells the platform, and would not discuss how it schedules that work. The airline held the flaw behind extra access restrictions for five months. Which requirement in the original contract would MOST directly have shortened those five months?",
      choices: [
        'Correction of top-severity flaws within a fixed number of days',
        'A right to audit how the vendor builds and releases its software',
        'Security updates guaranteed for a stated number of years',
        'A list of the third-party components in each release',
      ],
      answer: 0,
      explain:
        "A fixed correction window is the only term here that bounds how long the airline can be left exposed, because it turns the vendor's release calendar into an obligation with a date attached rather than a habit the customer has to absorb. The audit right is the tempting distractor, since the refusal to explain the release schedule is the most visible failure in the story, but an audit reveals what a practice is without obliging the vendor to change it. Guaranteed years of updates was already being met, as the releases arrived on schedule throughout, and a component list would only have restated what the vendor confirmed in the first week.",
    },
    {
      id: 'pl-sp4q2',
      domain: 'Security Operations',
      prompt:
        "A utility distributes a small in-house tool to its field engineers, who install it themselves from a folder on an internal file server. During an investigation, one engineer's laptop is found running a build of that tool that opens a connection nobody in the utility recognises. The build carries the same file name and version number as the current release, and the copy sitting on the file server is intact. The utility wants an altered build to fail to install on the laptop rather than proceed, without changing how engineers obtain the tool. Which measure achieves that?",
      choices: [
        'Publish a release hash for engineers to verify locally',
        'Sign the releases and allow only signed builds to run',
        'Detonate every release in a sandbox before publishing',
        'Restrict write access on the server to the build team',
      ],
      answer: 1,
      explain:
        'A signature binds each release to a key the utility holds, and a machine configured to run only signed builds refuses anything whose signature does not verify, which an altered build cannot produce without that private key. Publishing a hash is the tempting distractor because it also reveals alteration, but it depends on an engineer choosing to compare it, so the altered build still installs for anyone who skips the comparison. Sandboxing examines the legitimate release, which is not the copy that was changed, and tightening write access on the server does not help when the server copy is the intact one.',
    },
    {
      id: 'pl-sp4q3',
      domain: 'Security Operations',
      prompt:
        "A retailer runs an authenticated vulnerability scan every week covering every host in its configuration database, and no critical finding has stayed open longer than a fortnight in three months. A card-data incident is then traced to a server running a database engine that left vendor support in 2021. The server is powered on, reachable from the retailer's own network, appears in no scan report, and is recorded in no inventory. Which change would MOST likely have put that server in front of the scanner?",
      choices: [
        'Deploy the scanning agent to every managed host',
        'Add credentials for the database engine to the scan profile',
        'Scan the network address ranges, not the host list',
        'Raise the scan frequency from weekly to daily',
      ],
      answer: 2,
      explain:
        'The scan is only ever as wide as the list it is handed, so a host nobody recorded stays invisible no matter how good the credentials are, how often the scan runs or how many agents exist; sweeping the address ranges and reconciling the answer against the register is what brings an unrecorded host into scope. Deploying agents more widely is the tempting distractor because agents genuinely improve coverage of machines that are rarely reachable, but somebody has to install an agent, and nobody installs one on a server they do not know they own.',
    },
    {
      id: 'pl-sp4q4',
      domain: 'Security Operations',
      prompt:
        "A logistics operator's monthly scan flags a remotely exploitable flaw in the management console of the appliances that terminate its partner tunnels. The appliances run firmware 6.2; the vendor advisory lists 6.4 as unaffected, and 6.4 is published for this model, whose support ends next March. Replacement appliances were ordered in July and arrive in five months. The console answers only on each appliance's internal address, and two named engineers use it weekly. What should the operator do for the next five months?",
      choices: [
        "Limit the console to the two engineers' addresses and monitor it",
        'Log an exception owned by the head of infrastructure',
        'Bring the replacement programme forward by four months',
        'Move the appliances to the unaffected firmware release',
      ],
      answer: 3,
      explain:
        'A release that the advisory calls unaffected exists and is still published for this model, so the flaw can be removed outright instead of merely made harder to reach, and nothing in the replacement plan depends on leaving it open. Logging an exception is the tempting distractor because the model is close to end of support and new hardware is already on order, but an exception is how an organisation carries a risk it cannot remove, and this one it can. Restricting and watching the console leaves a remotely exploitable flaw live for five months on the device that terminates every partner tunnel.',
    },
    {
      id: 'pl-sp4q5',
      domain: 'Security Operations',
      prompt:
        'Over four months a paralegal at a conveyancing firm opened and exported around three hundred client files belonging to matters she has never been assigned. She worked from her own desk under her own account during office hours, took a handful of files on any given day, and never went above what her own caseload has her handling. Nothing reached the firm SOC, and she was found only when a client queried an unfamiliar name on a call note. Which addition to the monitoring would MOST likely have raised an alert while this was going on?',
      choices: [
        'A daily report of the users exporting the most client files',
        "Forward the case system's own access log to the platform",
        'Alerting when client files are copied to mail or USB devices',
        'Endpoint agents on every workstation on the legal floor',
      ],
      answer: 1,
      explain:
        'Only the case management system knows which matter each file belongs to and which matters the paralegal is assigned, so once its access records reach the platform a rule can compare the two and fire the first time she opens a file outside her own caseload. A report of the heaviest exporters is the tempting distractor, because three hundred files sounds like a volume anomaly, but she took a few files a day and never rose above what her own caseload has her handling. Watching mail and removable devices records how data leaves rather than which records were opened, and an endpoint agent sees an ordinary application session on a machine its user is entitled to use.',
    },
    {
      id: 'pl-sp4q6',
      domain: 'Security Operations',
      prompt:
        "A charity's staff keep receiving links to sites that were registered a day or two earlier, are used for a few hours and then abandoned. The charity's filter refuses a maintained list of known-bad addresses and refuses whole subject categories such as gambling and adult content. Neither has stopped any of these links, and the sites return no subject classification when they are checked. Which filtering technique addresses this pattern MOST directly?",
      choices: [
        'Category-based blocking with a stricter default set',
        'Explicit block rules maintained from incident reports',
        'Reputation scoring applied to the destination domain',
        'Scanning the full URL of each request for known patterns',
      ],
      answer: 2,
      explain:
        'Reputation judges a domain by what is known about it rather than by what it contains — how recently it was registered, what it is hosted alongside, what has been reported about it — so it can refuse a site that no list names and no category describes, which is precisely what a domain that exists for one afternoon looks like. Tightening the categories is the tempting distractor because the filter already works that way, but these sites come back with no classification to tighten, and a maintained list of known-bad addresses can only name what somebody has already reported.',
    },
    {
      id: 'pl-sp4q7',
      domain: 'Security Operations',
      prompt:
        'A distributor sets up each new warehouse supervisor by copying the permissions of a supervisor already in post, which the service desk says is quick and never leaves anyone unable to work. An access review six months later finds that every supervisor hired this year can approve credit notes — a permission that only one supervisor, the one whose account was used the first time, was ever meant to hold. Which provisioning practice would have prevented this?',
      choices: [
        'Requiring the hiring manager to approve each new account',
        'Correcting the permissions on the account used as a template',
        'Reviewing supervisor access at the end of each quarter',
        'Granting access through membership of defined groups',
      ],
      answer: 3,
      explain:
        'Assigning access through groups states in one visible place what a job is entitled to, so a permission that belongs to one individual cannot travel silently into every account created after them; copying an account reproduces whatever that account happens to hold, including the exception nobody remembers granting. Correcting the template account is the tempting distractor because that is where the extra permission came from, but the practice would carry across whatever the next account chosen as a template happens to hold, and a quarterly review finds the problem rather than preventing it.',
    },
    {
      id: 'pl-sp4q8',
      domain: 'Security Operations',
      prompt:
        "A charity's finance officer signs in to its cloud suite with a password and a hardware key. Reviewing her account, the security lead finds that an expenses application she approved eighteen months ago still holds an authorisation that lets it read and send mail as her, and that the application's vendor was breached last month. Sign-in records show her password and key have been used only by her, from her own devices. Which action MOST directly ends the exposure?",
      choices: [
        'Revoke the consent the officer gave that application',
        'Reset her password and re-enrol her hardware security key',
        'Sign her out of every device and require a fresh sign-in',
        "Block the vendor's mail servers at the email gateway",
      ],
      answer: 0,
      explain:
        "The application holds a delegated authorisation of its own, issued when the officer consented and separate from how she proves who she is; withdrawing that consent invalidates the tokens issued under it, and it is the only action here that touches the application at all. Resetting her password and re-enrolling her key is the tempting distractor because stolen credentials are the usual cause of mailbox abuse, but the sign-in records rule that out, and changing how she authenticates does not take back an authorisation she previously granted to somebody else's software.",
    },
    {
      id: 'pl-sp4q9',
      domain: 'Security Operations',
      prompt:
        "A telecoms operator has a workflow that disables a contractor's accounts within an hour of the contract system marking the engagement ended, and it has done so since March. In November an audit finds thirty-one contractor accounts still enabled, every one of them from an engagement that ended after 12 August. The interface the workflow reads from the contract system was replaced on 11 August. Nobody had reported a problem. Which control would have surfaced this SOONEST?",
      choices: [
        'An approval step before each account is disabled',
        'A quarterly review of contractor accounts and their status',
        'An alert raised when the workflow fails or stops running',
        'Version control and peer review of the workflow code',
      ],
      answer: 2,
      explain:
        'Broken automation stops producing work rather than producing visibly wrong work, so the failure is silent until somebody counts what should have happened; instrumenting the workflow so that a failed run, or the absence of any run, raises an alert turns three months of silence into a notification on 11 August. The quarterly review is the tempting distractor and is worth having, but it finds the accounts weeks after they should have gone. Version control governs changes to the workflow itself, and what changed here was the system on the other side of the interface.',
    },
    {
      id: 'pl-sp4q10',
      domain: 'Security Operations',
      prompt:
        "A wholesaler's SOC receives an endpoint alert on a warehouse workstation at 22:10 and, within four minutes, isolates the host from the network without powering it off, disables the account of the user signed in to it, and revokes her sessions. The workstation is a domain member; the backup service and the software deployment tool both run on it under accounts that also operate on the file servers. Six days later the intruder is found still active on two of those file servers. What did the response omit?",
      choices: [
        'Rotating the service account passwords used on that host',
        "Capturing the workstation's memory before isolating it",
        "Removing the attacker's persistence mechanisms from the host",
        'Rebuilding the workstation from the standard image',
      ],
      answer: 0,
      explain:
        'Isolation removes the machine from the network, not the credentials the machine held: accounts that run services on a compromised host can be recovered from it and stay valid everywhere else they are used, so containment is not finished until they are rotated. Capturing memory is the tempting distractor because preserving volatile evidence is exactly why the host was isolated rather than switched off, and it was preserved here, but an image of memory is evidence: it would have told the team which credentials were exposed without making them any less usable. Cleaning or rebuilding the workstation belongs to later phases and, either way, reaches only the host that alerted.',
    },
    {
      id: 'pl-sp4q11',
      domain: 'Security Operations',
      prompt:
        "A regional bank's crisis team has walked through its ransomware scenario in a conference room twice a year for three years, and the last two runs raised no findings. Its plan states that the payments platform can be brought up at the standby site within ninety minutes and that the SOC can revoke every administrator session in ten. Neither figure has come from anything but the plan's authors. The regulator asks the bank to evidence both figures. What should the bank schedule?",
      choices: [
        'A further walkthrough of the same scenario in the room',
        "An audit of the plan against the regulator's standard",
        'A penetration test of the payments platform',
        'A simulation of the failover and session revocation',
      ],
      answer: 3,
      explain:
        'Only an exercise that actually performs the failover and the revocation produces a measured time for each, which is what the regulator has asked for; a discussion can confirm that people know the steps, but it cannot show that the standby site comes up or that the revocation reaches every session. An audit is the tempting distractor because regulators do accept audit evidence, but an audit tests whether the plan and its records match a standard, and these two numbers have never been produced by anything an auditor could examine.',
    },
    {
      id: 'pl-sp4q12',
      domain: 'Security Operations',
      prompt:
        'An investigation holds a list of times and internal addresses taken from the perimeter firewall for one night three weeks ago. Addresses on that network are issued automatically from a pool and are reassigned within hours. The laptops connected that night are managed, run the endpoint agent, and each holds a computer account in the directory. The team must say which machines held those addresses at those times. Which source establishes that?',
      choices: [
        'The endpoint agent inventory of managed laptops',
        'The DHCP server logs for the night concerned',
        'The directory record of each computer account',
        'The firewall logs re-read for the same period',
      ],
      answer: 1,
      explain:
        'A pooled address identifies a machine only while that machine holds it, so the binding between an address and a host at a given hour survives only in the record of what was allocated to whom and when. The endpoint inventory is the tempting distractor because it does know the fleet and will report an address for every laptop, but it describes the state it last observed rather than the assignment in force three weeks ago. The directory records what a computer account is rather than what address it was using, and the firewall logs are where the addresses came from in the first place.',
    },
  ],
};
