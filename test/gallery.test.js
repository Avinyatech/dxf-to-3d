import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { tasks } from '../bench/tasks.mjs';
import { notes } from '../bench/notes.mjs';

test('gallery assets exist for every benchmark drawing and outcomes cover every run', () => {
  const o = JSON.parse(readFileSync(new URL('../public/benchmark/outcomes.json', import.meta.url), 'utf8'));
  assert.equal(o.outcomes.length, tasks.length);
  for (const t of o.outcomes) {
    assert.ok(existsSync(new URL('../public/benchmark/' + t.drawing, import.meta.url)), t.drawing);
    assert.equal(t.runs.length, 3);
  }
});
test('every failing run has a specific note', () => {
  const o = JSON.parse(readFileSync(new URL('../public/benchmark/outcomes.json', import.meta.url), 'utf8'));
  for (const t of o.outcomes) for (const r of t.runs) if (!r.pass) assert.ok(notes[`${r.strategy}/${t.task}`], `${r.strategy}/${t.task}`);
});
