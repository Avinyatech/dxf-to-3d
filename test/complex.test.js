import test from 'node:test';
import assert from 'node:assert/strict';
import { complexSuite, complexParts } from '../bench/complex.mjs';
import { parseDxf } from '../src/pipeline.js';
import { groundTruth } from '../bench/score.mjs';
import { signedArea, pointInPolygon } from '../src/geometry.js';

const ringDist = (A, B) => { let m = Infinity; for (const p of A) for (let i = 0; i < B.length; i++) { const a = B[i], b = B[(i + 1) % B.length], dx = b.x - a.x, dy = b.y - a.y, l2 = dx * dx + dy * dy, t = l2 ? Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / l2)) : 0; m = Math.min(m, Math.hypot(p.x - a.x - t * dx, p.y - a.y - t * dy)); } return m; };

const crosses = (a, b, c, d) => { const o = (p, q, r) => (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x); return o(c, d, a) * o(c, d, b) < 0 && o(a, b, c) * o(a, b, d) < 0; };
const selfIntersections = (ring) => { let n = 0; for (let i = 0; i < ring.length; i++) for (let j = i + 2; j < ring.length; j++) { if (i === 0 && j === ring.length - 1) continue; if (crosses(ring[i], ring[(i + 1) % ring.length], ring[j], ring[(j + 1) % ring.length])) n++; } return n; };

test('at least 14 complicated drawings', () => { assert.ok(complexSuite.length >= 14); });

for (const t of complexSuite) {
  test(`${t.id}: expected loops, one profile, holes inside the outline and apart from each other`, () => {
    const r = parseDxf(t.dxf);
    assert.equal(r.loops.length, t.loops, `${t.id} loops`);
    assert.equal(r.profiles.length, 1);
    const { outer, holes } = r.profiles[0];
    assert.equal(holes.length, t.loops - 1);
    for (const h of holes) assert.ok(pointInPolygon(h[0], outer), 'hole inside outline');
    const both = [...holes];
    for (let i = 0; i < both.length; i++) for (let j = i + 1; j < both.length; j++) assert.ok(Math.min(ringDist(both[i], both[j]), ringDist(both[j], both[i])) > 0.5, `${t.id} holes ${i},${j} touch`);
    for (const h of holes) assert.ok(ringDist(h, outer) > 0.5, `${t.id} hole too close to outline`);
    assert.equal(selfIntersections(outer), 0, `${t.id} outline crosses itself`);
    holes.forEach((h, i) => assert.equal(selfIntersections(h), 0, `${t.id} hole ${i} crosses itself`));
    assert.ok(groundTruth(t).volume > 0);
  });
}

test('arcs over 180 degrees are parsed correctly (connecting rod and keyway)', () => {
  const rod = parseDxf(complexParts.find((p) => p.id === 'conrod').dxf).profiles[0].outer;
  // analytic area: sector of the small end + sector of the big end + two tangent trapezoids
  const r1 = 30, r2 = 15, d = 150, nx = -(r1 - r2) / d, ny = Math.sqrt(1 - nx * nx), phi = Math.atan2(ny, nx);
  const quad = [[0, 0], [nx * r1, ny * r1], [d + nx * r2, ny * r2], [d, 0]];
  let a = 0; for (let i = 0; i < 4; i++) { const p = quad[i], q = quad[(i + 1) % 4]; a += p[0] * q[1] - q[0] * p[1]; }
  const exact = 0.5 * r2 * r2 * 2 * phi + 0.5 * r1 * r1 * (2 * Math.PI - 2 * phi) + Math.abs(a);
  assert.ok(Math.abs(Math.abs(signedArea(rod)) - exact) / exact < 0.002, 'rod area within 0.2% of analytic');
  const xs = rod.map((p) => p.x), ys = rod.map((p) => p.y);
  assert.ok(Math.abs(Math.min(...xs) + 30) < 0.05 && Math.abs(Math.max(...xs) - 165) < 0.1);
  assert.ok(Math.abs(Math.max(...ys) - ny * r1) < 0.05);
  const key = parseDxf(complexParts.find((p) => p.id === 'pulley_keyway').dxf).profiles[0].holes.find((h) => Math.max(...h.map((p) => p.y)) > 11);
  assert.ok(key, 'keyway loop found');
  assert.ok(Math.abs(Math.abs(signedArea(key)) - 320) < 12, 'keyway bore area near pi*10^2 plus the notch');
});
