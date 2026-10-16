import assert from 'node:assert/strict';
import test from 'node:test';
import { trapRowDim } from '../../src/overlay/question-dim.ts';

const DIMMED = 0.4;
const ramp = Array.from({ length: 11 }, (_, k) => k / 10);

test('a trap marked on the same frame as the answer never dips', () => {
  for (const p of ramp) assert.equal(trapRowDim(p, p, DIMMED), 1);
});

test('a trap marked later dims with the others, then comes back up', () => {
  assert.equal(trapRowDim(0, 0, DIMMED), 1);
  assert.equal(trapRowDim(1, 0, DIMMED), DIMMED);
  assert.ok(Math.abs(trapRowDim(1, 0.5, DIMMED) - 0.7) < 1e-9);
  assert.equal(trapRowDim(1, 1, DIMMED), 1);
});
