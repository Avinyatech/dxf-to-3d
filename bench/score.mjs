// Ground truth from the app's own DXF pipeline + STL measurement + scoring.
import { parseDxf } from '../src/pipeline.js';
import { signedArea } from '../src/geometry.js';

export function groundTruth(task) {
  const d = parseDxf(task.dxf);
  let area = 0;
  for (const p of d.profiles) area += Math.abs(signedArea(p.outer)) - p.holes.reduce((s, h) => s + Math.abs(signedArea(h)), 0);
  const b = d.bounds;
  return { volume: area * task.depth, bbox: { min: [b.minX, b.minY, 0], max: [b.maxX, b.maxY, task.depth] } };
}

// Parse ASCII STL -> { volume, bbox }
export function measureStl(text) {
  const v = [...text.matchAll(/vertex\s+(\S+)\s+(\S+)\s+(\S+)/g)].map((m) => [+m[1], +m[2], +m[3]]);
  if (v.length < 3 || v.length % 3) return null;
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  let vol = 0;
  for (let i = 0; i < v.length; i += 3) {
    const [a, b, c] = [v[i], v[i + 1], v[i + 2]];
    vol += (a[0] * (b[1] * c[2] - b[2] * c[1]) - a[1] * (b[0] * c[2] - b[2] * c[0]) + a[2] * (b[0] * c[1] - b[1] * c[0])) / 6;
  }
  for (const p of v) for (let k = 0; k < 3; k++) { min[k] = Math.min(min[k], p[k]); max[k] = Math.max(max[k], p[k]); }
  return { volume: Math.abs(vol), bbox: { min, max } };
}

// pass = renders, volume within 5%, every bbox corner within 2% of the part's largest dimension
export function score(truth, measured) {
  if (!measured) return { rendered: false, pass: false };
  const volErr = Math.abs(measured.volume - truth.volume) / truth.volume;
  const size = Math.max(...truth.bbox.max.map((m, k) => m - truth.bbox.min[k]));
  let bboxErr = 0;
  for (let k = 0; k < 3; k++) {
    bboxErr = Math.max(bboxErr, Math.abs(measured.bbox.min[k] - truth.bbox.min[k]) / size, Math.abs(measured.bbox.max[k] - truth.bbox.max[k]) / size);
  }
  return { rendered: true, volErr, bboxErr, pass: volErr <= 0.05 && bboxErr <= 0.02 };
}
