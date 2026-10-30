import { describe, expect, it } from 'vitest';
import parity from '../data/suricata-parity.json';
import corpus from '../../public/labs/suricata-practice/corpus.json';
import missions from '../../public/labs/suricata-practice/missions.json';
import { evaluate, loadRules, outcomeOf, parseHomeNet, type SensorMode, type SimEvent } from './suricataSim';

const events = corpus.events as SimEvent[];
const home = parseHomeNet(corpus.homeNet);

describe('Suricata simulator parity with the real engine', () => {
  it('was recorded against Suricata 7', () => {
    expect(parity.suricata).toMatch(/Suricata version 7\./);
    expect(parity.cases.length).toBeGreaterThan(80);
  });

  for (const c of parity.cases) {
    it(`${c.name} (${c.mode})`, () => {
      const { rules, issues } = loadRules(c.rules);
      const outside = new Set(issues.filter((i) => i.kind === 'unsupported').map((i) => i.line));
      // A line the simulator declines to model must be one Suricata also rejected, or the
      // simulator would be hiding a rule that works. Everything else has to agree exactly.
      for (const line of outside) expect(c.errorLines, `línea ${line} fuera del simulador`).toContain(line);
      const errors = issues.filter((i) => i.kind === 'error').map((i) => i.line);
      expect([...new Set([...errors, ...outside])].sort((a, b) => a - b)).toEqual(c.errorLines);
      const alerts = evaluate(rules, events, c.mode as SensorMode, home)
        .map((a) => `${a.event}:${a.sid}:${a.action}`);
      expect([...new Set(alerts)].sort()).toEqual(c.alerts);
    });
  }
});

describe('Suricata lab missions', () => {
  const reference = parity.cases.find((c) => c.name === 'reference-ids')!.rules;

  it('the reference rules meet every mission with no load issues', () => {
    const { rules, issues } = loadRules(reference);
    expect(issues).toEqual([]);
    for (const m of missions.missions) {
      const alerts = evaluate(rules, events, m.mode as SensorMode, home);
      for (const id of m.scope) {
        expect(outcomeOf(alerts, id), `${m.id}/${id}`).toBe((m.expect as Record<string, string>)[id] ?? 'none');
      }
    }
  });

  it('every mission has positives and controls, and scopes name real events', () => {
    const ids = new Set(events.map((e) => e.id));
    for (const m of missions.missions) {
      expect(m.scope.every((id) => ids.has(id)), m.id).toBe(true);
      expect(Object.keys(m.expect).every((id) => m.scope.includes(id)), m.id).toBe(true);
      expect(Object.keys(m.expect).length, m.id).toBeGreaterThan(0);
      expect(m.scope.length, m.id).toBeGreaterThan(Object.keys(m.expect).length);
    }
  });

  it('reports unsupported syntax instead of guessing', () => {
    const { issues } = loadRules('alert tcp any any -> any any (msg:"x"; content:"a"; sid:9;)\nalert tls any any -> any any (msg:"x"; tls.sni; pcre:"/a/"; sid:10;)');
    expect(issues.map((i) => i.kind)).toEqual(['unsupported', 'unsupported']);
  });
});
