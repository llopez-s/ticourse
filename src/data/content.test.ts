import { describe, expect, it } from 'vitest';
import { ALL_MODULES, ALL_PLACEMENT, ALL_QUESTIONS, contentSections, sectionById } from './course';
import { isYouTubeBlock, isYouTubeId } from '../lib/youtube';
import { CLASSIFY_DATA, LABS, ORDER_DATA, SELECT_DATA } from './labs';
import { TRACKS } from './tracks';
import { PLACEMENT_BLOCK_N } from '../lib/placement';

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();

describe('content integrity', () => {
  it('questions have 4 choices, a valid answer and an explanation', () => {
    for (const q of ALL_QUESTIONS) {
      expect(q.choices, q.id).toHaveLength(4);
      expect(q.answer, q.id).toBeGreaterThanOrEqual(0);
      expect(q.answer, q.id).toBeLessThan(4);
      expect(q.explain.length, q.id).toBeGreaterThan(20);
    }
  });

  it('inline checks have 4 choices and a valid answer', () => {
    for (const m of ALL_MODULES) {
      for (const b of m.blocks) {
        if (b.t !== 'check') continue;
        expect(b.q.choices, m.id).toHaveLength(4);
        expect(b.q.answer, m.id).toBeGreaterThanOrEqual(0);
        expect(b.q.answer, m.id).toBeLessThan(4);
      }
    }
  });

  it('modules, cards, glossary and labs point at existing sections', () => {
    for (const m of ALL_MODULES) {
      expect(sectionById(m.sectionId), m.id).toBeDefined();
    }
    for (const t of Object.values(TRACKS)) {
      for (const c of t.flashcards) {
        expect(sectionById(c.sectionId), c.id).toBeDefined();
      }
      for (const g of t.glossary) {
        expect(sectionById(g.sectionId), g.term).toBeDefined();
      }
      for (const l of t.labs) {
        expect(sectionById(l.sectionId), l.id).toBeDefined();
      }
    }
  });

  it('lab data exists for every classify/order/select lab', () => {
    for (const l of LABS) {
      if (l.kind === 'classify') expect(CLASSIFY_DATA[l.id], l.id).toBeDefined();
      if (l.kind === 'order') expect(ORDER_DATA[l.id], l.id).toBeDefined();
      if (l.kind === 'select') expect(SELECT_DATA[l.id], l.id).toBeDefined();
    }
  });

  it('classify items only use declared categories', () => {
    for (const [id, d] of Object.entries(CLASSIFY_DATA)) {
      const cats = new Set(d.categories.map((c) => c.id));
      for (const item of d.items) expect(cats.has(item.answer), `${id}: ${item.text}`).toBe(true);
    }
  });

  it('Security+ Domain 1 is complete', () => {
    const d1 = ALL_MODULES.filter((m) => m.sectionId === 'sp1');
    expect(d1.map((m) => m.id)).toEqual([
      'sp1m1', 'sp1m2', 'sp1m3', 'sp1m4', 'sp1m5', 'sp1m6', 'sp1m7',
    ]);
    const qs = d1.flatMap((m) => m.quiz);
    expect(qs.length).toBeGreaterThanOrEqual(40);
    for (const q of qs) expect(q.domain).toBe('General Security Concepts');
    for (const m of d1) {
      expect(m.blocks.filter((b) => b.t === 'check').length, m.id).toBeGreaterThanOrEqual(3);
      expect(m.quiz.length, m.id).toBeGreaterThanOrEqual(6);
    }
    expect(TRACKS.secplus.flashcards.length).toBeGreaterThanOrEqual(25);
    expect(TRACKS.secplus.glossary.length).toBeGreaterThanOrEqual(40);
    expect(TRACKS.secplus.labs.filter((l) => l.sectionId === 'sp1').map((l) => l.id)).toEqual(['spl1a', 'spl1b', 'spl1c']);
  });

  it('Security+ Domain 2 is complete', () => {
    const d2 = ALL_MODULES.filter((m) => m.sectionId === 'sp2');
    expect(d2.map((m) => m.id)).toEqual([
      'sp2m1', 'sp2m2', 'sp2m3', 'sp2m4', 'sp2m5', 'sp2m6', 'sp2m7', 'sp2m8',
    ]);
    const qs = d2.flatMap((m) => m.quiz);
    expect(qs.length).toBeGreaterThanOrEqual(56);
    for (const q of qs) expect(q.domain).toBe('Threats, Vulnerabilities & Mitigations');
    for (const m of d2) {
      expect(m.blocks.filter((b) => b.t === 'check').length, m.id).toBeGreaterThanOrEqual(3);
      expect(m.quiz.length, m.id).toBeGreaterThanOrEqual(7);
    }
    expect(TRACKS.secplus.flashcards.filter((c) => c.sectionId === 'sp2').length).toBeGreaterThanOrEqual(28);
    expect(TRACKS.secplus.glossary.filter((g) => g.sectionId === 'sp2').length).toBeGreaterThanOrEqual(44);
    expect(TRACKS.secplus.labs.filter((l) => l.sectionId === 'sp2').map((l) => l.id)).toEqual(['spl2a', 'spl2b', 'spl2c']);
  });

  it('Security+ Domain 3 is complete', () => {
    const d3 = ALL_MODULES.filter((m) => m.sectionId === 'sp3');
    expect(d3.map((m) => m.id)).toEqual([
      'sp3m1', 'sp3m2', 'sp3m3', 'sp3m4', 'sp3m5', 'sp3m6', 'sp3m7',
    ]);
    const qs = d3.flatMap((m) => m.quiz);
    expect(qs.length).toBeGreaterThanOrEqual(53);
    for (const q of qs) expect(q.domain).toBe('Security Architecture');
    for (const m of d3) {
      expect(m.blocks.filter((b) => b.t === 'check').length, m.id).toBeGreaterThanOrEqual(3);
      expect(m.quiz.length, m.id).toBeGreaterThanOrEqual(7);
    }
    expect(TRACKS.secplus.flashcards.filter((c) => c.sectionId === 'sp3').length).toBeGreaterThanOrEqual(30);
    expect(TRACKS.secplus.glossary.filter((g) => g.sectionId === 'sp3').length).toBeGreaterThanOrEqual(46);
    expect(TRACKS.secplus.labs.filter((l) => l.sectionId === 'sp3').map((l) => l.id)).toEqual(['spl3a', 'spl3b', 'spl3c']);
  });

  it('Security+ Domain 4 is complete', () => {
    const d4 = ALL_MODULES.filter((m) => m.sectionId === 'sp4');
    expect(d4.map((m) => m.id)).toEqual([
      'sp4m1', 'sp4m2', 'sp4m3', 'sp4m4', 'sp4m5', 'sp4m6',
      'sp4m7', 'sp4m8', 'sp4m9', 'sp4m10', 'sp4m11',
    ]);
    const qs = d4.flatMap((m) => m.quiz);
    expect(qs.length).toBeGreaterThanOrEqual(82);
    for (const q of qs) expect(q.domain).toBe('Security Operations');
    for (const m of d4) {
      expect(m.blocks.filter((b) => b.t === 'check').length, m.id).toBeGreaterThanOrEqual(3);
      expect(m.quiz.length, m.id).toBeGreaterThanOrEqual(7);
    }
    expect(TRACKS.secplus.flashcards.filter((c) => c.sectionId === 'sp4').length).toBeGreaterThanOrEqual(36);
    expect(TRACKS.secplus.glossary.filter((g) => g.sectionId === 'sp4').length).toBeGreaterThanOrEqual(55);
    expect(TRACKS.secplus.labs.filter((l) => l.sectionId === 'sp4').map((l) => l.id)).toEqual(['spl4a', 'spl4b', 'spl4c']);
  });

  it('Security+ Domain 5 is complete', () => {
    const d5 = ALL_MODULES.filter((m) => m.sectionId === 'sp5');
    expect(d5.map((m) => m.id)).toEqual([
      'sp5m1', 'sp5m2', 'sp5m3', 'sp5m4', 'sp5m5', 'sp5m6', 'sp5m7', 'sp5m8',
    ]);
    const qs = d5.flatMap((m) => m.quiz);
    expect(qs.length).toBeGreaterThanOrEqual(59);
    for (const q of qs) {
      expect(q.domain).toBe('Security Program Management & Oversight');
    }
    for (const m of d5) {
      expect(m.blocks.filter((b) => b.t === 'check').length, m.id).toBeGreaterThanOrEqual(3);
      expect(m.quiz.length, m.id).toBeGreaterThanOrEqual(7);
    }
    expect(TRACKS.secplus.flashcards.filter((c) => c.sectionId === 'sp5').length).toBeGreaterThanOrEqual(32);
    expect(TRACKS.secplus.glossary.filter((g) => g.sectionId === 'sp5').length).toBeGreaterThanOrEqual(48);
    expect(TRACKS.secplus.labs.filter((l) => l.sectionId === 'sp5').map((l) => l.id)).toEqual(['spl5a', 'spl5b', 'spl5c']);
  });

  it('the whole Security+ track is playable: every content section has questions', () => {
    for (const sec of TRACKS.secplus.sections) {
      if (!sec.boss) continue;
      const qs = ALL_MODULES.filter((m) => m.sectionId === sec.id).flatMap((m) => m.quiz);
      // boss battles draw 12 questions from the section
      expect(qs.length, sec.id).toBeGreaterThanOrEqual(12);
    }
  });

  it('order labs have at least 6 steps', () => {
    for (const [id, d] of Object.entries(ORDER_DATA)) {
      expect(d.steps.length, id).toBeGreaterThanOrEqual(6);
    }
  });

  it('select labs pick exactly pickN good options', () => {
    for (const [id, d] of Object.entries(SELECT_DATA)) {
      expect(d.options.filter((o) => o.good).length, id).toBe(d.pickN);
    }
  });

  it('every track section id carries its track', () => {
    for (const t of Object.values(TRACKS)) {
      for (const s of t.sections) expect(s.track).toBe(t.id);
    }
  });
});

describe('placement blocks', () => {
  it('hold exactly 12 well-formed questions in their own domain', () => {
    for (const b of ALL_PLACEMENT) {
      expect(b.title.length, b.id).toBeGreaterThan(0);
      expect(b.blurb.length, b.id).toBeGreaterThan(0);
      expect(b.questions, b.id).toHaveLength(PLACEMENT_BLOCK_N);
      for (const q of b.questions) {
        expect(q.choices, q.id).toHaveLength(4);
        expect(Number.isInteger(q.answer), q.id).toBe(true);
        expect(q.answer, q.id).toBeGreaterThanOrEqual(0);
        expect(q.answer, q.id).toBeLessThan(4);
        expect(q.explain.length, q.id).toBeGreaterThan(20);
        expect(q.prompt.length, q.id).toBeGreaterThan(0);
        expect(q.domain, q.id).toBe(b.domain);
      }
    }
  });

  it('question ids run contiguously from q1 to q12 with no gaps or extras', () => {
    for (const b of ALL_PLACEMENT) {
      const expected = Array.from({ length: PLACEMENT_BLOCK_N }, (_, i) => `${b.id}q${i + 1}`);
      expect(b.questions.map((q) => q.id), b.id).toEqual(expected);
    }
  });

  it('use the pl- id family and are globally unique', () => {
    const ids = ALL_PLACEMENT.flatMap((b) => [b.id, ...b.questions.map((q) => q.id)]);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id.startsWith('pl-'), id).toBe(true);
    const lesson = new Set([
      ...ALL_QUESTIONS.map((q) => q.id),
      ...ALL_MODULES.map((m) => m.id),
    ]);
    for (const id of ids) expect(lesson.has(id), id).toBe(false);
  });

  it('never reuse a lesson question', () => {
    const lesson = new Set(ALL_QUESTIONS.map((q) => norm(q.prompt)));
    for (const b of ALL_PLACEMENT) {
      for (const q of b.questions) {
        expect(lesson.has(norm(q.prompt)), q.id).toBe(false);
      }
    }
  });

  it('point at a section that exists', () => {
    for (const b of ALL_PLACEMENT) {
      expect(sectionById(b.sectionId), b.id).toBeDefined();
    }
  });

  // A track may ship with no placement test at all — the Dashboard, Profile and
  // /placement all check for that and degrade — but a half-covered one would
  // silently leave a section unskippable, so partial coverage is the failure.
  it('a track with a placement test has one block per content section, in order', () => {
    for (const t of Object.values(TRACKS)) {
      if (t.placement.length === 0) continue;
      const secs = contentSections(t.id).map((s) => s.id);
      expect(t.placement.map((b) => b.sectionId), t.id).toEqual(secs);
    }
  });

  it('both shipped tracks have one', () => {
    for (const t of Object.values(TRACKS)) {
      expect(t.placement.length, t.id).toBeGreaterThan(0);
    }
  });
});

describe('lesson videos', () => {
  // Only the fs calls this test needs, typed locally so the suite does not
  // depend on @types/node being installed.
  type Fs = {
    existsSync(path: URL): boolean;
    statSync(path: URL): { size: number };
    readFileSync(path: URL, encoding: 'utf8'): string;
  };
  const loadFs = async (): Promise<Fs> => import(/* @vite-ignore */ ['node', 'fs'].join(':'));
  const publicFile = (path: string) => new URL(`../../public/${path}`, import.meta.url);

  // Every t:'video' block of both tracks, with the lesson that embeds it.
  const allVideos = ALL_MODULES.flatMap((m) =>
    m.blocks.flatMap((b) => (b.t === 'video' ? [{ module: m.id, block: b }] : [])),
  );
  const videos = allVideos.flatMap((v) => (isYouTubeBlock(v.block) ? [] : [{ module: v.module, block: v.block }]));
  const youtubeVideos = allVideos.flatMap((v) => (isYouTubeBlock(v.block) ? [{ module: v.module, block: v.block }] : []));
  const moduleOf = (src: string) => videos.find((v) => v.block.src === src)?.module;

  it('the explainers sit in the lessons the video plan puts them in', () => {
    expect(moduleOf('videos/siem-blue-team.mp4')).toBe('sp4m6');
    expect(moduleOf('videos/forense-adquisicion.mp4')).toBe('sp4m11');
    expect(youtubeVideos.find((v) => v.block.youtube === 'rwMIu0XBoWQ')?.module).toBe('s2m3');
    // V4 continues V3's E7 pivots, before Lab 3A: the order is video, then lab
    expect(youtubeVideos.find((v) => v.block.youtube === '69gfP6duB00')?.module).toBe('s3m3');
    // V5 walks the Halden case through the phases, right after the table of phases and classic errors
    expect(youtubeVideos.find((v) => v.block.youtube === 'AvtZI9iylQc')?.module).toBe('sp4m10');
    // V5b tests the new plan and goes hunting, after the threat-hunting check and before the closing paragraph
    expect(youtubeVideos.find((v) => v.block.youtube === 'dzLWHM7VpsI')?.module).toBe('sp4m10');
    // V7 reads s2m5's process tree, right before the checks that ask about the same tree
    expect(youtubeVideos.find((v) => v.block.youtube === 'mRNyVVrRujw')?.module).toBe('s2m5');
    // V6 gathers identity and access in the port, after the MFA check and before the exam note
    expect(youtubeVideos.find((v) => v.block.youtube === 'RdUWXFQxOkY')?.module).toBe('sp4m8');
    // V8 closes s3m5's STIX/TAXII half, after the TAXII-vs-STIX check and before YARA
    expect(youtubeVideos.find((v) => v.block.youtube === 'jNqhrLgGFmY')?.module).toBe('s3m5');
    // V9 sums up s4m3 after its checks and hands over to Lab 4B: lesson, checks, video, lab
    expect(youtubeVideos.find((v) => v.block.youtube === 'Q2-pG0ALFKI')?.module).toBe('s4m3');
    // V23 sums up s4m5 (the three levels, false flags and when a name is worth it) after its checks, before the exam note
    expect(youtubeVideos.find((v) => v.block.youtube === 'Q2Xk9Lczm6U')?.module).toBe('s4m5');
    // V10 reads one night's three trails in sp2m7, after the 900-accounts check and before the closing paragraph
    expect(youtubeVideos.find((v) => v.block.youtube === 'k51SLJxEiPc')?.module).toBe('sp2m7');
    // V11 gathers sp1m6 at its end, after the steganography-to-blockchain list and before the paragraph that hands over to PKI
    expect(youtubeVideos.find((v) => v.block.youtube === 'SAx6KSeEOwU')?.module).toBe('sp1m6');
    // V12 replays sp1m7's chain and revocation in a console, after the OCSP stapling check and before key escrow
    expect(youtubeVideos.find((v) => v.block.youtube === 'IlOHl8Lmq_w')?.module).toBe('sp1m7');
    // V13 sums up s2m1 after the demo's checks and before the paragraph that hands over to Courses of Action and s2m4
    expect(youtubeVideos.find((v) => v.block.youtube === '5pGLeaGeT7c')?.module).toBe('s2m1');
    // V22 sums up s2m2 (the verbs, the matrix and the price of each action) after its checks and sends to Lab 2C
    expect(youtubeVideos.find((v) => v.block.youtube === 'ghNoHuq7GIk')?.module).toBe('s2m2');
    // V16 draws sp3m4's zones, placement and failure modes on the port, after the mirror-port check and before the
    // paragraph that hands over to firewalls and VPNs (sp3m5)
    expect(youtubeVideos.find((v) => v.block.youtube === '64jGEA0_ttM')?.module).toBe('sp3m4');
    // V17 walks sp3m5's three ways in (802.1X, site-to-site IPSec, remote access), after the full-tunnel check and
    // before the exam note
    expect(youtubeVideos.find((v) => v.block.youtube === 'HzzY9C4cDNw')?.module).toBe('sp3m5');
    // V20 replays sp1m3's flow in the port (a request to the ERP and who decides what), after the adaptive identity
    // check and before the paragraph that goes down to physical security
    expect(youtubeVideos.find((v) => v.block.youtube === 'u87izuH2GJc')?.module).toBe('sp1m3');
    // V21 shows sp4m2's wireless section in the port (the signal that spills, SAE, enterprise mode and EAP), after the
    // WPA3-Enterprise check and before mobile devices
    expect(youtubeVideos.find((v) => v.block.youtube === '9qoRWsqMzps')?.module).toBe('sp4m2');
    // V14 turns s2m4's events into threads and groups, after the last check (Victim 2's partial thread) and before
    // the campaign callout that sends the learner to Labs 2A and 2B
    expect(youtubeVideos.find((v) => v.block.youtube === 'pjGQiqy0CdE')?.module).toBe('s2m4');
    // V15 triages the sandbox report after the triage paragraph and before the four checks on its data
    expect(youtubeVideos.find((v) => v.block.youtube === 'Xbd_x8mOAqc')?.module).toBe('s3m2');
    // V18 triages a new report after sp4m5's September example and before the paragraph that closes the cycle
    expect(youtubeVideos.find((v) => v.block.youtube === 'P9nft88qkZs')?.module).toBe('sp4m5');
    // V19 walks sp2m4's three text boxes after the stored-XSS check and before the exam note on the two reflexes
    expect(youtubeVideos.find((v) => v.block.youtube === '5yD7BO4UYGQ')?.module).toBe('sp2m4');
    // V25 puts numbers on R-014 (SLE, ALE and the control against the ALE), after the last check of sp5m3 and before
    // the paragraph that hands over to the risk register
    expect(youtubeVideos.find((v) => v.block.youtube === 'KEDZnHP4rZE')?.module).toBe('sp5m3');
    // V26 replays sp5m4's BIA (what is promised and what is measured), after the last check and before the paragraph
    // that hands over to third parties
    expect(youtubeVideos.find((v) => v.block.youtube === 'szeeKG5zfYI')?.module).toBe('sp5m4');
    // V24 replays sp3m7's recovery in the port (sites, tests and the backup that is not a copy until restored), after
    // the ransomware check and before the paragraph that closes Domain 3
    expect(youtubeVideos.find((v) => v.block.youtube === 'JPPAYkZb_ds')?.module).toBe('sp3m7');
    // V27 reads s5m3's YARA condition and Sigma rule (what each one looks at and what breaks it), after the first
    // check (any of $s*) and before STIX/TAXII
    expect(youtubeVideos.find((v) => v.block.youtube === 'OHxUu9cjnVA')?.module).toBe('s5m3');
    // V28, the first case-and-exam video, puts sp1m1's two labels (category and type) on three port controls with three
    // exam-style questions, after the «Deterrent no es preventive» callout and before the paragraph that hands over to sp1m2
    expect(youtubeVideos.find((v) => v.block.youtube === 'y9bjWKwN5fg')?.module).toBe('sp1m1');
    // V29, a case-and-exam capsule, asks what each identification method can and cannot see (scans with and without an
    // account, SAST/DAST/SBOM, threat feeds), after sp4m4's «En la Autoridad Portuaria de Halden» callout and before the
    // paragraph that hands over to sp4m5
    expect(youtubeVideos.find((v) => v.block.youtube === 'TuXDvIcJOj0')?.module).toBe('sp4m4');
    // V30 takes sp4m1's baseline to the port (establish, deploy and maintain, each target by its channel, and OT
    // compensated until it can be patched) with three exam-style questions, after the Halden callout and before the
    // paragraph that hands over to sp4m2
    expect(youtubeVideos.find((v) => v.block.youtube === 'NO2ZOT2crCo')?.module).toBe('sp4m1');
    // V32 follows one network disk through sp4m3's asset life (found by enumeration, given an owner and a classification,
    // retired by sanitization or destruction with its certificate) with three exam-style questions, after the Halden
    // callout and before the paragraph that hands over to sp4m4
    expect(youtubeVideos.find((v) => v.block.youtube === '1JFdRT7Gkxs')?.module).toBe('sp4m3');
    // AP01 (practical series) follows the Graph flow of sp4m8's practical expansion, before the solved case and its check
    expect(youtubeVideos.find((v) => v.block.youtube === 'X8REnX3XQ7A')?.module).toBe('sp4m8');
    // AP02 closes sp4m10's practical expansion in the same way: after revocation and CAE, before the solved case
    expect(youtubeVideos.find((v) => v.block.youtube === 'Ucj3DFO_oak')?.module).toBe('sp4m10');
    // AP03 compares Faro, Atlas and Eco against two requirements, after s3m1's pilot table and before the step-by-step resolution
    expect(youtubeVideos.find((v) => v.block.youtube === 'Vh8xJjYALqQ')?.module).toBe('s3m1');
    // AP04 follows sample A from the hash to a defensible relation, after s3m2's «sin premium o sin datos» paragraph and before the solved case
    expect(youtubeVideos.find((v) => v.block.youtube === 'CB-TTDBRF3I')?.module).toBe('s3m2');
    // V35 sorts sp2m1's six threat actors into three pairs (the attributes give the pair, the motivation picks one of
    // the two) with three exam-style questions, after the Halden callout and before the paragraph that hands over to
    // sp2m2's vectors
    expect(youtubeVideos.find((v) => v.block.youtube === 'aODnqnaMy7w')?.module).toBe('sp2m1');
    // V36 draws sp2m2's map of ways in at the port (the attack surface, one path seen up close, the supplier nobody at
    // the desk controls) with three exam-style questions, after the managed-service-provider check and before the
    // paragraph that hands over to social engineering
    expect(youtubeVideos.find((v) => v.block.youtube === 'E0iZgu8LxHo')?.module).toBe('sp2m2');
    // V34, a case-and-exam principal, reads sp2m3's social engineering by how it arrives, what it asks for, who it
    // pretends to be and whether it knows it lies, with four exam-style questions, after the «Misinformation no es
    // disinformation» callout and before the paragraph that hands over to vulnerabilities
    expect(youtubeVideos.find((v) => v.block.youtube === '-a8r3pd_Ilo')?.module).toBe('sp2m3');
    // V38 asks where sp2m5's flaw was born (the shared machine, the cloud's layers, the phone in the pocket) with three
    // exam-style questions, after the «Cómo clasificar rápido en el examen» callout and before the rooting and side
    // loading check
    expect(youtubeVideos.find((v) => v.block.youtube === 'l0uQFtEGN4s')?.module).toBe('sp2m5');
    // V37 picks sp2m8's BEST mitigation by the cause (what really failed, where the device is, whether it should be
    // there at all) with three exam-style questions, after the «Nota de examen: tres reflejos» callout and before the
    // paragraph that closes Domain 2
    expect(youtubeVideos.find((v) => v.block.youtube === 'H7-dijBeFfs')?.module).toBe('sp2m8');
    // V45, now the first video of sp3 in course order, walks sp3m1's three decisions before a new cloud app (IaC with
    // the secrets outside, a serverless function and how to watch it, microservices that check who calls) with three
    // exam-style questions, after the Halden callout and before the paragraph that hands over to sp3m2
    expect(youtubeVideos.find((v) => v.block.youtube === 'vUBVKXDS9HM')?.module).toBe('sp3m1');
    // V46 takes sp3m2's proposal to move two office apps from VMs to containers (what is fixed in the image, what the
    // shared host kernel keeps, where it lives vs. who manages it) with three exam-style questions, after the Halden
    // callout and before the paragraph that hands over to sp3m3
    expect(youtubeVideos.find((v) => v.block.youtube === '8r0OvoLgKTk')?.module).toBe('sp3m2');
    // V33 names sp2m6's malware from what it does (how it moves, what it does inside, what it hides or waits for, what
    // betrays a machine) with five exam-style questions, after the «Halden, turno de noche» callout and before the
    // paragraph that hands over to sp2m7's attacks
    expect(youtubeVideos.find((v) => v.block.youtube === 'PbBKS_xuJ68')?.module).toBe('sp2m6');
    // V31 tells sp4m9's automation from its orchestration (one task or a whole flow, SOAR, what a failing flow costs) with
    // three exam-style questions, after the last check (the service account of the orchestration platform) and before the
    // paragraph that hands over to incident response
    expect(youtubeVideos.find((v) => v.block.youtube === 'G5ywhPJ7LbQ')?.module).toBe('sp4m9');
    // V49 takes sp1m2's four ideas (what breaks, who touches it, how much is missing) through a port case with three
    // exam-style questions, after the last check (the gap analysis after an acquisition) and before the paragraph that
    // hands over to Zero Trust
    expect(youtubeVideos.find((v) => v.block.youtube === 'X-ObxPQZZHc')?.module).toBe('sp1m2');
    // V50 walks sp1m4's plan from the street to the bait with three exam-style questions, after the «Un señuelo mal
    // aislado es una puerta real» callout and before the paragraph that hands over to change management
    expect(youtubeVideos.find((v) => v.block.youtube === 'DOxNzxPHibQ')?.module).toBe('sp1m4');
    // V51 follows one change from start to finish with three exam-style questions, after sp1m5's last check (the Git
    // repository of firewall configurations) and before the paragraph that hands over to cryptography
    expect(youtubeVideos.find((v) => v.block.youtube === 'ZLeS-1X4ypg')?.module).toBe('sp1m5');
    // V48 asks where the data is and what protects it with three exam-style questions, after the «los tres cortes que
    // más caen del 3.3» exam note and before the paragraph that hands over to sp3m7
    expect(youtubeVideos.find((v) => v.block.youtube === '7TqjjnbP56c')?.module).toBe('sp3m6');
    // V47 asks three questions of what must not stop (what rules, does it answer in time and fit, is there a patch and can
    // it go on) over a crane on the port's quay, with three exam-style questions, after sp3m3's last check (the buoy
    // sensors) and before the paragraph that hands over to sp3m4
    expect(youtubeVideos.find((v) => v.block.youtube === 'qANC8-P3v1Y')?.module).toBe('sp3m3');
    // V40 sorts four papers into policy, standard, procedure and guideline, with three exam-style questions, after the
    // port callout and before the paragraph that hands over to sp5m2
    expect(youtubeVideos.find((v) => v.block.youtube === 'OiJ6X0-nKGY')?.module).toBe('sp5m1');
    // V41 asks who decides, who applies and who answers over the passenger list, with three exam-style questions, after
    // sp5m2's last check and before the paragraph that hands over to sp5m3
    expect(youtubeVideos.find((v) => v.block.youtube === '1Im0etwQFE8')?.module).toBe('sp5m2');
    // V42 weighs a vendor's evidence, what falls before and after signing and what each paper fixes, with three
    // exam-style questions, after the port callout and before the paragraph that hands over to sp5m6
    expect(youtubeVideos.find((v) => v.block.youtube === 'gJ6zP3VOesw')?.module).toBe('sp5m5');
    // V43 looks before launching, cares afterwards and deletes on time, with three exam-style questions, after the port
    // callout and before the paragraph that hands over to sp5m7
    expect(youtubeVideos.find((v) => v.block.youtube === 'S9yW5SeLShc')?.module).toBe('sp5m6');
    // V39 tells declaring from proving and the four ways to test, with five exam-style questions, after the last check
    // of sp5m7 and before the paragraph that hands over to the awareness lesson
    expect(youtubeVideos.find((v) => v.block.youtube === 'mvQK4M8kc_8')?.module).toBe('sp5m7');
    // V44 asks why somebody did it, what is measured and for whom, with three exam-style questions, after sp5m8's last
    // check and before the paragraph that closes the five domains
    expect(youtubeVideos.find((v) => v.block.youtube === 'actmHdOKvEY')?.module).toBe('sp5m8');
    // V54 walks the triage assistant of Halden: what it may do, with which permissions and who checks it, after the
    // guided example and before the optional checks
    expect(youtubeVideos.find((v) => v.block.youtube === 'ZH078lxIDFs')?.module).toBe('sp7m3');
    // V57 maps the SY0-701 objectives onto the SY0-801 draft as a supermarket being refitted, after the gap analysis check
    // and before the short task its closing card points at
    expect(youtubeVideos.find((v) => v.block.youtube === 'uOraRdyoDWA')?.module).toBe('sp7m1');
    // V53 hides an order in a document for Halden's assistant and limits the damage outside the model, after the
    // «Idea para llevarte» callout and before the optional checks
    expect(youtubeVideos.find((v) => v.block.youtube === '9Jfuq0WloDc')?.module).toBe('sp7m2');
    // V55 follows a QR poster to a stolen session token and impossible travel, after the guided scenario's list and
    // before the optional checks
    expect(youtubeVideos.find((v) => v.block.youtube === 'kOotP93kQn8')?.module).toBe('sp7m4');
    // V52 practises how to answer five exam questions from different domains, after the check on the two domains that
    // make half the exam and before the study plan that sends the learner to the mock exam
    expect(youtubeVideos.find((v) => v.block.youtube === 'ArrQwo4oHeY')?.module).toBe('sp6m1');
    // V56 follows a key written in code to a public repository and secrets scanning, after «Para recordar» and before
    // the first check
    expect(youtubeVideos.find((v) => v.block.youtube === 'uavP1_CfUBI')?.module).toBe('sp7m5');
    // V58 reaches a cut-off device out of band and keeps backups immutable, after the backups paragraph and before the
    // checks of the last part
    expect(youtubeVideos.find((v) => v.block.youtube === 'KpabKLc4DgA')?.module).toBe('sp7m6');
    // V59 walks an extortion note through negotiation and notification, after the last check and before «Tarea breve»
    expect(youtubeVideos.find((v) => v.block.youtube === 'fgwIidduN64')?.module).toBe('sp7m7');
  });

  it('every video block points at relative public assets that exist', async () => {
    expect(videos.length).toBeGreaterThan(0);
    const fs = await loadFs();
    for (const { module, block } of videos) {
      const assets = [
        [block.src, /\.mp4$/],
        [block.poster, /\.(png|jpe?g|webp)$/],
        [block.transcript, /\.txt$/],
        [block.captions, /\.vtt$/],
      ] as const;
      for (const [path, ext] of assets) {
        const where = `${module}: ${path}`;
        expect(path, where).toMatch(ext);
        expect(path.startsWith('/') || path.includes('..'), where).toBe(false);
        expect(fs.existsSync(publicFile(path)), where).toBe(true);
      }
      expect(block.title.trim().length, module).toBeGreaterThan(0);
      expect(fs.statSync(publicFile(block.src)).size, block.src).toBeLessThan(50 * 1024 * 1024);
      expect(fs.readFileSync(publicFile(block.transcript), 'utf8').length, block.transcript).toBeGreaterThan(200);
      // WEBVTT header, a blank line, then the first cue (any identifier) and its timing.
      expect(fs.readFileSync(publicFile(block.captions), 'utf8'), block.captions).toMatch(
        /^WEBVTT\r?\n\r?\n[^\r\n]+\r?\n\d\d:\d\d:\d\d\.\d{3} --> /,
      );
    }
  });

  it('every YouTube video block has a valid id and its poster and transcript in public/', async () => {
    const fs = await loadFs();
    for (const { module, block } of youtubeVideos) {
      expect(isYouTubeId(block.youtube), `${module}: ${block.youtube}`).toBe(true);
      for (const [path, ext] of [[block.poster, /\.(png|jpe?g|webp)$/], [block.transcript, /\.txt$/]] as const) {
        expect(path, module).toMatch(ext);
        expect(path.startsWith('/') || path.includes('..'), module).toBe(false);
        expect(fs.existsSync(publicFile(path)), `${module}: ${path}`).toBe(true);
      }
      expect(fs.readFileSync(publicFile(block.transcript), 'utf8').length, block.transcript).toBeGreaterThan(200);
    }
  });

  it('no two video blocks share an asset', () => {
    const paths = [
      ...videos.flatMap(({ block }) => [block.src, block.poster, block.transcript, block.captions]),
      ...youtubeVideos.flatMap(({ block }) => [block.youtube, block.poster, block.transcript]),
    ];
    expect(new Set(paths).size).toBe(paths.length);
  });
});
