// Builds the benchmark gallery assets: one SVG per 2D drawing and outcomes.json (per drawing x strategy).
// Usage: node bench/gallery.mjs [dir=public/benchmark]
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tasks } from './tasks.mjs';
import { parseDxf } from '../src/pipeline.js';
import { signedArea } from '../src/geometry.js';
import { notes } from './notes.mjs';
import { engines } from './engines.mjs';
import { complexSuite } from './complex.mjs';
import { diagnose } from './diagnose.mjs';
import { existsSync, copyFileSync } from 'node:fs';

const dir = process.argv[2] || 'public/benchmark';
const suiteName = process.argv[3] || 'base';
const list = { engines, complex: complexSuite }[suiteName] || tasks;
mkdirSync(join(dir, 'drawings'), { recursive: true });
const results = JSON.parse(readFileSync(join(dir, 'results.json'), 'utf8'));

function svg(task) {
  const d = parseDxf(task.dxf), b = d.bounds, pad = Math.max(b.w, b.h) * 0.12, W = b.w + pad * 2, H = b.h + pad * 2;
  const path = d.loops.map((l) => 'M' + l.map((p) => `${(p.x - b.minX + pad).toFixed(3)},${(b.maxY - p.y + pad).toFixed(3)}`).join('L') + 'Z').join(' ');
  const fs = Math.max(b.w, b.h) * 0.065, sw = Math.max(b.w, b.h) * 0.01;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W.toFixed(2)} ${H.toFixed(2)}" role="img" aria-label="${task.name}">
<path d="${path}" fill="#cfe0ff" fill-rule="evenodd" stroke="#1e293b" stroke-width="${sw.toFixed(3)}" stroke-linejoin="round"/>
<g font-family="system-ui,sans-serif" font-size="${fs.toFixed(2)}" fill="#475569" text-anchor="middle">
<text x="${(W / 2).toFixed(2)}" y="${(pad * 0.6).toFixed(2)}">${b.w.toFixed(0)} mm</text>
<text transform="translate(${(pad * 0.45).toFixed(2)} ${(H / 2).toFixed(2)}) rotate(-90)">${b.h.toFixed(0)} mm</text></g></svg>\n`;
}

for (const t of list) writeFileSync(join(dir, 'drawings', `${t.id}.svg`), svg(t));

const outcomes = list.map((t) => {
  const d = parseDxf(t.dxf);
  const solid = d.profiles.reduce((s, p) => s + Math.abs(signedArea(p.outer)) - p.holes.reduce((a, h) => a + Math.abs(signedArea(h)), 0), 0);
  return {
    task: t.id, name: t.name, level: t.level, depth: t.depth, loops: d.loops.length, drawing: `drawings/${t.id}.svg`, expectedVolume: solid * t.depth,
    runs: results.results.filter((r) => r.task === t.id).map((r) => ({
      strategy: r.strategy, pass: !!r.pass, rendered: !!r.rendered, volErr: r.volErr ?? null, scad: r.scad,
      iou: r.iou ?? null, strictPass: !!r.strictPass,
      note: (suiteName === 'base' && notes[`${r.strategy}/${r.task}`]) || diagnose(r, r.scad && existsSync(join(dir, r.scad)) ? readFileSync(join(dir, r.scad), 'utf8') : ''),
    })),
  };
});
writeFileSync(join(dir, 'outcomes.json'), JSON.stringify({ model: results.model, date: results.date, outcomes }, null, 2));
if (suiteName !== 'base') {
  const page = readFileSync(new URL('../public/benchmark/index.html', import.meta.url), 'utf8')
    .replace('<title>LLM CAD Benchmark</title>', `<title>LLM CAD Benchmark: ${suiteName}</title>`)
    .replace('LLM benchmark: 2D CAD → 3D model code', `LLM benchmark (${suiteName} suite): 2D CAD → 3D model code`)
    .replace('href="../">← DXF to 3D app', 'href="../">← Benchmark home')
  const method = '<h2>Method</h2><ul class="muted"><li>Complicated mechanical parts as 2D DXF drawings, each with an extrusion depth. 3 prompt strategies: raw-dxf, structured, fewshot.</li><li><b>Pass</b> = renders, volume within 5% and bounding box within 2%. <b>Strict pass</b> additionally needs overlap (IoU) of at least 0.95 with the exact solid, measured by OpenSCAD intersection.</li><li>Executed on a GitHub-hosted CPU runner via Ollama, 4096-token context. Source: <code>bench/</code>.</li></ul>';
  const a = page.indexOf('<h2>Method</h2>'), b = page.indexOf('</ul>', a) + '</ul>'.length;
  writeFileSync(join(dir, 'index.html'), a >= 0 ? page.slice(0, a) + method + page.slice(b) : page);
}
console.log(`wrote ${list.length} drawings and outcomes.json (${outcomes.reduce((n, o) => n + o.runs.length, 0)} runs)`);
