import { describe, expect, it } from 'vitest';
import type { Supuesto } from './supuesto';
import { freshRun, scoreRun } from './supuestoGrade';
import { buildReport, reportFilename } from './supuestoReport';

const s = {
  id: 'op1s1', track: 'secplus', sectionIds: ['sp1'], version: 1, title: 'Supuesto de prueba', brief: '', minutes: 60,
  prerequisites: [], sources: [],
  dossier: [{ id: 'd1', title: 'Acta de la reunión', kind: 'acta' }],
  phases: [{
    id: 'f1', title: 'Diagnóstico', context: '',
    tasks: [
      { id: 't1', kind: 'choice', prompt: 'Elige el protocolo', points: 3, explain: 'Porque sí.', refs: [{ label: 'Lección VLAN', href: '/learn/sp1m1' }],
        options: [{ id: 'a', text: 'Telnet' }, { id: 'b', text: 'SSH' }], answer: 'b' },
      { id: 't2', kind: 'numeric', prompt: 'Cuántos hosts', points: 3, explain: 'x', refs: [], answer: 254, unit: 'hosts' },
      { id: 't3', kind: 'cite', prompt: 'Cita el documento', points: 2, explain: 'x', refs: [], answerSets: [['d1']] },
      { id: 't4', kind: 'written', prompt: 'Redacta la conclusión', points: 2, explain: 'x', refs: [], model: 'Modelo de redacción',
        rubric: [{ id: 'r1', text: 'Menciona el riesgo', points: 2 }] },
    ],
  }],
} as unknown as Supuesto;

describe('buildReport', () => {
  const run = { ...freshRun('exam', new Date('2026-11-26T10:00:00.000Z')), answers: { t1: 'a', t3: ['d1'] } };
  const md = buildReport(s, run, scoreRun(s, run));

  it('has title, mode and a decimal-comma grade', () => {
    expect(md).toContain('# Supuesto de prueba');
    expect(md).toContain('Simulacro');
    expect(md).toContain('2,0 / 10');
  });
  it('lists prompts, given and correct answers as text', () => {
    expect(md).toContain('Elige el protocolo');
    expect(md).toContain('Tu respuesta: Telnet');
    expect(md).toContain('Respuesta correcta: SSH');
    expect(md).toContain('Tu respuesta: Acta de la reunión');
    expect(md).toContain('254 hosts');
    expect(md).toContain('Tu respuesta: sin responder');
  });
  it('includes the written model and the review list', () => {
    expect(md).toContain('Modelo de redacción');
    expect(md).toContain('Lección VLAN');
  });
  it('labels practice mode', () => {
    const p = { ...run, mode: 'practice' as const };
    expect(buildReport(s, p, scoreRun(s, p))).toContain('Práctica');
  });
});

describe('reportFilename', () => {
  it('uses id, mode slug and start date', () => {
    expect(reportFilename(s, freshRun('exam', new Date('2026-11-26T10:00:00Z')))).toBe('supuesto-op1s1-simulacro-2026-11-26.md');
    expect(reportFilename(s, freshRun('practice', new Date('2026-11-26T10:00:00Z')))).toBe('supuesto-op1s1-practica-2026-11-26.md');
  });
});
