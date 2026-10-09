// Usage: node bench/run.mjs --model deepseek-coder-v2:16b [--out public/benchmark] [--host http://localhost:11434]
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tasks as baseTasks } from './tasks.mjs';
import { engines } from './engines.mjs';
import { groundTruth, measureStl, score } from './score.mjs';
import { buildMessages, extractCode } from '../src/prompt.js';

const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const model = arg('model', 'deepseek-coder-v2:16b');
const host = arg('host', 'http://localhost:11434');
const out = arg('out', 'public/benchmark');
const suite = arg('suite', 'base');
const tasks = suite === 'engines' ? engines : baseTasks;
const numPredict = +arg('tokens', suite === 'engines' ? 1800 : 900), numCtx = 4096; // larger contexts exhausted runner memory
const strategies = ['raw-dxf', 'structured', 'fewshot'];
const openscad = process.env.OPENSCAD || 'openscad';
mkdirSync(join(out, 'scad'), { recursive: true });

async function chat(messages) {
  const t0 = Date.now();
  const res = await fetch(`${host}/api/chat`, {
    method: 'POST',
    body: JSON.stringify({ model, messages, stream: false, options: { temperature: 0, seed: 1, num_predict: numPredict, num_ctx: numCtx } }),
  });
  if (!res.ok) throw new Error(`ollama ${res.status}: ${await res.text()}`);
  const j = await res.json();
  return { text: j.message.content, seconds: (Date.now() - t0) / 1000, tokens: j.eval_count };
}

function render(scadPath, stlPath) {
  const args = ['-o', stlPath, scadPath];
  const cmd = process.env.XVFB ? 'xvfb-run' : openscad;
  const r = spawnSync(cmd, process.env.XVFB ? ['-a', openscad, ...args] : args, { encoding: 'utf8', timeout: 90000 });
  if (r.status !== 0) return { error: (r.stderr || r.error?.message || 'render failed').slice(0, 400) };
  try { return { stl: readFileSync(stlPath, 'utf8') }; } catch { return { error: 'no STL produced (empty geometry?)' }; }
}

const results = [];
for (const strategy of strategies) {
  for (const task of tasks) {
    const truth = groundTruth(task);
    const row = { strategy, task: task.id, level: task.level, truthVolume: truth.volume };
    try {
      const reply = await chat(buildMessages(task.dxf, task.depth, strategy));
      Object.assign(row, { seconds: reply.seconds, tokens: reply.tokens });
      const code = extractCode(reply.text);
      const base = `${strategy}__${task.id}`;
      const scadPath = join(out, 'scad', base + '.scad'), stlPath = join(out, 'scad', base + '.stl');
      writeFileSync(scadPath, code);
      row.scad = `scad/${base}.scad`;
      const r = render(scadPath, stlPath);
      if (r.error) Object.assign(row, { rendered: false, pass: false, error: r.error });
      else {
        const m = measureStl(r.stl);
        Object.assign(row, score(truth, m), { volume: m?.volume });
      }
      rmSync(stlPath, { force: true });
    } catch (e) {
      Object.assign(row, { rendered: false, pass: false, error: String(e.message).slice(0, 400) });
    }
    console.log(strategy.padEnd(11), task.id.padEnd(13), row.pass ? 'PASS' : 'FAIL', row.volErr != null ? `vol err ${(row.volErr * 100).toFixed(1)}%` : row.error?.split('\n')[0]);
    results.push(row);
  }
}

const agg = (rows) => ({
  runs: rows.length,
  rendered: rows.filter((r) => r.rendered).length,
  passed: rows.filter((r) => r.pass).length,
  passRate: rows.filter((r) => r.pass).length / rows.length,
  meanVolErr: (() => { const v = rows.filter((r) => r.volErr != null).map((r) => r.volErr); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null; })(),
  meanSeconds: rows.reduce((s, r) => s + (r.seconds || 0), 0) / rows.length,
  tokPerSec: (() => { const t = rows.filter((r) => r.tokens && r.seconds); return t.length ? t.reduce((s, r) => s + r.tokens, 0) / t.reduce((s, r) => s + r.seconds, 0) : null; })(),
});
const summary = {
  model, suite, date: new Date().toISOString(), runner: process.env.RUNNER_NAME ? 'GitHub Actions (CPU)' : 'local',
  overall: agg(results),
  byStrategy: Object.fromEntries(strategies.map((s) => [s, agg(results.filter((r) => r.strategy === s))])),
  byLevel: Object.fromEntries([...new Set(tasks.map((t) => t.level))].map((l) => [l, agg(results.filter((r) => r.level === l))])),
  results,
};
writeFileSync(join(out, 'results.json'), JSON.stringify(summary, null, 2));
console.log('\nOverall pass rate:', (summary.overall.passRate * 100).toFixed(0) + '%');
