// Re-score saved benchmark results (no LLM): re-render each saved .scad and recompute the overlap (IoU).
// Usage: node bench/rescore.mjs <dir> <suite>   e.g. node bench/rescore.mjs public/benchmark/complex complex
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tasks as baseTasks } from './tasks.mjs';
import { engines } from './engines.mjs';
import { complexSuite } from './complex.mjs';
import { parseDxf } from '../src/pipeline.js';
import { toOpenSCAD } from '../src/openscad.js';
import { measureStl } from './score.mjs';
import { overlapFromRender, iouValue } from './iou.mjs';

const dir = process.argv[2] || 'public/benchmark/complex', suite = process.argv[3] || 'complex';
const list = { engines, complex: complexSuite }[suite] || baseTasks, byId = Object.fromEntries(list.map((t) => [t.id, t]));
const openscad = process.env.OPENSCAD || 'openscad';
function render(scad, stl, timeout) {
  const args = ['-o', stl, scad], cmd = process.env.XVFB ? 'xvfb-run' : openscad;
  const r = spawnSync(cmd, process.env.XVFB ? ['-a', openscad, ...args] : args, { encoding: 'utf8', timeout });
  if (r.status !== 0) return { error: [r.stderr, r.stdout].filter(Boolean).join('\n').slice(0, 300) || r.error?.message || 'render failed', timedOut: r.error?.code === 'ETIMEDOUT' };
  try { return { stl: readFileSync(stl, 'utf8') }; } catch { return { error: 'no STL produced (empty)' }; }
}
const results = JSON.parse(readFileSync(join(dir, 'results.json'), 'utf8')), truth = {};
const truthOf = (t) => {
  if (truth[t.id]) return truth[t.id];
  const p = join(dir, 'scad', `truth__${t.id}.scad`), s = join(dir, 'scad', `truth__${t.id}.stl`);
  writeFileSync(p, toOpenSCAD(parseDxf(t.dxf).profiles, { depth: t.depth }));
  const x = render(p, s, 120000);
  return (truth[t.id] = x.stl ? measureStl(x.stl) : null);
};
let changed = 0;
for (const row of results.results) {
  if (!row.rendered || !row.scad) continue;
  const t = byId[row.task], tr = t && truthOf(t), base = row.scad.replace(/^scad\//, '').replace(/\.scad$/, '');
  const genScad = join(dir, row.scad), genStl = join(dir, 'scad', `${base}.stl`);
  if (!tr || !existsSync(genScad)) continue;
  const g = render(genScad, genStl, 180000);
  let iou = null;
  if (g.stl) {
    const m = measureStl(g.stl), p = join(dir, 'scad', `iou__${base}.scad`), s = join(dir, 'scad', `iou__${base}.stl`);
    writeFileSync(p, `intersection() { import("${base}.stl"); import("truth__${t.id}.stl"); }\n`);
    iou = m ? iouValue(overlapFromRender(render(p, s, 600000), measureStl), m.volume, tr.volume) : null;
    rmSync(p, { force: true }); rmSync(s, { force: true });
  }
  rmSync(genStl, { force: true });
  const before = row.iou;
  row.iou = iou; row.strictPass = !!row.pass && iou != null && iou >= 0.95;
  if (before !== iou) changed++;
  console.log(row.strategy.padEnd(10), row.task.padEnd(16), 'iou', before == null ? 'n/a' : before.toFixed(2), '->', iou == null ? 'unmeasured' : iou.toFixed(2), row.strictPass ? 'STRICT' : row.pass ? 'pass' : '');
}
for (const t of list) rmSync(join(dir, 'scad', `truth__${t.id}.stl`), { force: true });
const agg = (rows) => ({ ...rows.length && {}, runs: rows.length, rendered: rows.filter((r) => r.rendered).length, passed: rows.filter((r) => r.pass).length, passRate: rows.filter((r) => r.pass).length / rows.length, strictPassed: rows.filter((r) => r.strictPass).length, meanIou: rows.reduce((s, r) => s + (r.iou || 0), 0) / rows.length, unmeasured: rows.filter((r) => r.rendered && r.iou == null).length, meanVolErr: (() => { const v = rows.filter((r) => r.volErr != null).map((r) => r.volErr); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null; })(), meanSeconds: rows.reduce((s, r) => s + (r.seconds || 0), 0) / rows.length, tokPerSec: results.overall?.tokPerSec ?? null });
const R = results.results;
results.overall = agg(R);
results.byStrategy = Object.fromEntries(Object.keys(results.byStrategy).map((k) => [k, agg(R.filter((r) => r.strategy === k))]));
results.byLevel = Object.fromEntries(Object.keys(results.byLevel).map((k) => [k, agg(R.filter((r) => r.level === k))]));
results.rescored = new Date().toISOString();
writeFileSync(join(dir, 'results.json'), JSON.stringify(results, null, 2));
console.log(`\nrescored: ${changed} overlap values changed; strict ${results.overall.strictPassed}/${results.overall.runs}, unmeasured ${results.overall.unmeasured}`);
