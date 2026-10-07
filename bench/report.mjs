// Prints a Markdown report from results.json (also writes REPORT.md next to it).
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2] || 'public/benchmark';
const s = JSON.parse(readFileSync(join(dir, 'results.json'), 'utf8'));
const pct = (x) => (x == null ? 'n/a' : (x * 100).toFixed(0) + '%');
const row = (name, a) => `| ${name} | ${a.passed}/${a.runs} (${pct(a.passRate)}) | ${a.rendered}/${a.runs} | ${pct(a.meanVolErr)} | ${a.meanSeconds.toFixed(0)} s | ${a.tokPerSec ? a.tokPerSec.toFixed(1) : 'n/a'} |`;
const head = '| | Pass | Rendered | Mean volume error | Mean time | tok/s |\n|---|---|---|---|---|---|';
const lines = [
  `# Benchmark: ${s.model} on 2D CAD to 3D`,
  `Runner: ${s.runner} - ${s.date}`,
  '',
  '**Pass** = OpenSCAD code renders, volume within 5% of ground truth, bounding box within 2%.',
  '', '## By prompt strategy', head, ...Object.entries(s.byStrategy).map(([k, v]) => row(k, v)),
  '', '## By difficulty', head, ...Object.entries(s.byLevel).map(([k, v]) => row(k, v)),
  '', '## Every run', '| Strategy | Task | Result | Volume error | Note |', '|---|---|---|---|---|',
  ...s.results.map((r) => `| ${r.strategy} | ${r.task} | ${r.pass ? 'PASS' : 'FAIL'} | ${r.volErr != null ? (r.volErr * 100).toFixed(1) + '%' : '-'} | ${(r.error || '').split('\n')[0].slice(0, 80).replace(/\|/g, '/')} |`),
];
const md = lines.join('\n') + '\n';
writeFileSync(join(dir, 'REPORT.md'), md);
process.stdout.write(md);
