import test from 'node:test';
import assert from 'node:assert/strict';
import { overlapFromRender, iouValue } from '../bench/iou.mjs';

const measure = (stl) => (stl === 'box' ? { volume: 1000 } : null);

test('a successful intersection returns its volume', () => assert.equal(overlapFromRender({ stl: 'box' }, measure), 1000));
test('an empty intersection is a true zero', () => assert.equal(overlapFromRender({ error: 'Current top level object is empty.' }, measure), 0));
test('a timeout or other failure is unmeasured, never zero', () => {
  assert.equal(overlapFromRender({ error: 'render failed', timedOut: true }, measure), null);
  assert.equal(overlapFromRender({ error: 'CGAL error: assertion' }, measure), null);
  assert.equal(overlapFromRender({ error: 'empty but timed out', timedOut: true }, measure), null);
});
test('iouValue: identical, half overlap, disjoint, unmeasured', () => {
  assert.equal(iouValue(100, 100, 100), 1);
  assert.ok(Math.abs(iouValue(50, 100, 100) - 1 / 3) < 1e-12);
  assert.equal(iouValue(0, 100, 100), 0);
  assert.equal(iouValue(null, 100, 100), null);
});
