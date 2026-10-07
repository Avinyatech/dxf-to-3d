import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseDxf } from '../src/pipeline.js';
import { toOpenSCAD } from '../src/openscad.js';

const r = parseDxf(readFileSync(new URL('../public/sample.dxf', import.meta.url), 'utf8'));

test('stitches lines, circles and polyline into loops', () => {
  assert.equal(r.loops.length, 5); // plate, 2 holes, slot, island
});
test('nesting: plate with 3 holes, plus an island inside a hole', () => {
  assert.equal(r.profiles.length, 2);
  const plate = r.profiles.find((p) => p.holes.length > 1);
  assert.equal(plate.holes.length, 3);
});
test('bounds match the plate', () => {
  assert.ok(Math.abs(r.bounds.w - 100) < 1e-6 && Math.abs(r.bounds.h - 60) < 1e-6);
});
test('openscad output has extrude + polygon paths', () => {
  const s = toOpenSCAD(r.profiles, { depth: 5 });
  assert.match(s, /linear_extrude/);
  assert.match(s, /paths = /);
});
