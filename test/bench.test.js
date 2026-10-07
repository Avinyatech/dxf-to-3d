import test from 'node:test';
import assert from 'node:assert/strict';
import { tasks } from '../bench/tasks.mjs';
import { groundTruth, measureStl, score } from '../bench/score.mjs';
import { buildMessages, extractCode } from '../src/prompt.js';

// 10x20x30 box as ASCII STL (12 triangles)
function boxStl(x, y, z) {
  const c = [[0,0,0],[x,0,0],[x,y,0],[0,y,0],[0,0,z],[x,0,z],[x,y,z],[0,y,z]];
  const f = [[0,2,1],[0,3,2],[4,5,6],[4,6,7],[0,1,5],[0,5,4],[1,2,6],[1,6,5],[2,3,7],[2,7,6],[3,0,4],[3,4,7]];
  return f.map((t) => 'facet normal 0 0 0\nouter loop\n' + t.map((i) => `vertex ${c[i].join(' ')}`).join('\n') + '\nendloop\nendfacet').join('\n');
}

test('measureStl gets volume and bbox of a box', () => {
  const m = measureStl(boxStl(10, 20, 30));
  assert.ok(Math.abs(m.volume - 6000) < 1e-6);
  assert.deepEqual(m.bbox.max, [10, 20, 30]);
});
test('ground truth and scoring on the plate task', () => {
  const t = tasks[0];
  const g = groundTruth(t);
  assert.ok(Math.abs(g.volume - (6000 - 2 * Math.PI * 64) * 10) / g.volume < 0.01);
  assert.equal(score(g, measureStl(boxStl(100, 60, 10))).pass, false); // forgot holes -> volume off
  assert.equal(score(g, null).rendered, false);
});
test('all tasks parse into profiles', () => {
  for (const t of tasks) assert.ok(groundTruth(t).volume > 0, t.id);
});
test('prompts and code extraction', () => {
  for (const s of ['raw-dxf', 'structured', 'fewshot']) {
    const m = buildMessages(tasks[0].dxf, 10, s);
    assert.equal(m[0].role, 'system');
    assert.match(m.at(-1).content, /Extrusion depth: 10/);
  }
  assert.equal(extractCode('hi\n```openscad\ncube(1);\n```\nbye'), 'cube(1);');
});
