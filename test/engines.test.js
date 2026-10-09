import test from 'node:test';
import assert from 'node:assert/strict';
import { engines } from '../bench/engines.mjs';
import { parseDxf } from '../src/pipeline.js';
import { groundTruth } from '../bench/score.mjs';

for (const e of engines) {
  test(`${e.id}: parses to the expected loops, one profile, positive volume`, () => {
    const r = parseDxf(e.dxf);
    assert.equal(r.loops.length, e.loops);
    assert.equal(r.profiles.length, 1);
    assert.equal(r.profiles[0].holes.length, e.loops - 1);
    assert.ok(groundTruth(e).volume > 1e6);
  });
}
