// Complicated 2D drawings (DXF) of common mechanical parts, generated parametrically.
// Each is a flat profile that is a valid extrusion target: many loops, long outlines, arcs over 180 degrees.
// These are representative parts, not any manufacturer's drawing.
import { engines } from './engines.mjs';

const dxf = (e) => ['0', 'SECTION', '2', 'ENTITIES', ...e.flat(), '0', 'ENDSEC', '0', 'EOF'].join('\n') + '\n';
const R = (n) => +n.toFixed(4);
const circle = (x, y, r) => ['0', 'CIRCLE', '8', '0', '10', R(x), '20', R(y), '40', r];
const poly = (v) => ['0', 'LWPOLYLINE', '8', '0', '90', v.length, '70', 1, ...v.flatMap(([x, y, b = 0]) => ['10', R(x), '20', R(y), ...(b ? ['42', +b.toFixed(6)] : [])])];
const pol = (r, a) => [r * Math.cos(a), r * Math.sin(a)];
const deg = (d) => (d * Math.PI) / 180;
const slot = (cx, cy, l, w, vertical = false) => poly(vertical
  ? [[cx - w / 2, cy - l / 2], [cx + w / 2, cy - l / 2, 1], [cx + w / 2, cy + l / 2], [cx - w / 2, cy + l / 2, 1]]
  : [[cx - l / 2, cy - w / 2], [cx + l / 2, cy - w / 2, 1], [cx + l / 2, cy + w / 2], [cx - l / 2, cy + w / 2, 1]]);
const ring = (n, r, rh, start = 0, cx = 0, cy = 0) => Array.from({ length: n }, (_, i) => { const [x, y] = pol(r, start + (i * 2 * Math.PI) / n); return circle(cx + x, cy + y, rh); });

// Toothed wheel outline: trapezoid teeth, counter-clockwise
function toothed(N, rr, rp, ra, halfTip, halfPitch, halfRoot) {
  const P = (2 * Math.PI) / N, v = [];
  for (let i = 0; i < N; i++) {
    const a = i * P;
    v.push(pol(rr, a - halfRoot * P), pol(rp, a - halfPitch * P), pol(ra, a - halfTip * P), pol(ra, a + halfTip * P), pol(rp, a + halfPitch * P), pol(rr, a + halfRoot * P), pol(rr, a + 0.5 * P));
  }
  return poly(v);
}

// Connecting rod: two circles joined by external tangents (arcs with bulge, one over 180 degrees)
function conrod() {
  const r1 = 30, r2 = 15, d = 150, nx = -(r1 - r2) / d, ny = Math.sqrt(1 - nx * nx), phi = Math.atan2(ny, nx);
  // small-end arc runs CCW from -phi to +phi (sweep 2*phi, over 180 degrees); big-end arc CCW from phi to 2*pi-phi
  const smallBulge = Math.tan((2 * phi) / 4), bigBulge = Math.tan((2 * (Math.PI - phi)) / 4);
  return poly([[nx * r1, -ny * r1], [d + nx * r2, -ny * r2, smallBulge], [d + nx * r2, ny * r2], [nx * r1, ny * r1, bigBulge]]);
}

function cam() {
  const v = [];
  for (let i = 0; i < 120; i++) { const t = (i * 2 * Math.PI) / 120; v.push(pol(30 + 14 * Math.max(0, Math.sin(t)) ** 3, t)); }
  return poly(v);
}

function heatSink() {
  const v = [[0, 0], [100, 0], [100, 8]];
  for (let i = 11; i >= 0; i--) { const x0 = 6 + i * 7.5, x1 = x0 + 3; v.push([x1, 8], [x1, 38], [x0, 38], [x0, 8]); }
  v.push([0, 8]);
  return poly(v);
}

function tslot() {
  // cavity 9 wide, bottom at 5 mm from the centre, so neighbouring cavities do not overlap
  const side = [[-10, -10], [-3.1, -10], [-3.1, -8.2], [-4.5, -8.2], [-4.5, -5], [4.5, -5], [4.5, -8.2], [3.1, -8.2], [3.1, -10]];
  const v = [];
  for (let k = 0; k < 4; k++) side.forEach(([x, y]) => { let p = [x, y]; for (let j = 0; j < k; j++) p = [-p[1], p[0]]; v.push(p); });
  return poly(v);
}

function wheel() {
  const e = [circle(0, 0, 120), circle(0, 0, 20), ...ring(5, 34, 6, deg(36))];
  const d = deg(48), b = Math.tan(d / 4);
  for (let k = 0; k < 5; k++) {
    const t0 = deg(72 * k + 12), t1 = t0 + d;
    e.push(poly([[...pol(50, t0)], [...pol(50, t1), b], [...pol(100, t1)], [...pol(100, t0), -b]]));
  }
  return e;
}

function keywayBore() {
  const y = Math.sqrt(100 - 4), sweep = deg(360) - 2 * Math.atan2(2, y);
  return poly([[2, y], [2, 11.5], [-2, 11.5], [-2, y, Math.tan(sweep / 4)]]);
}

const grid = (nx, ny, px, py, x0, y0, r) => Array.from({ length: nx * ny }, (_, k) => circle(x0 + (k % nx) * px, y0 + Math.floor(k / nx) * py, r));

const part = (id, name, depth, entities, loops) => ({ id, name, level: 'complex', depth, loops, dxf: dxf(entities) });

export const complexParts = [
  part('gear_24t', 'Spur gear, 24 teeth, bore and 6 lightening holes', 12, [toothed(24, 32.5, 36, 39, 0.12, 0.22, 0.3), circle(0, 0, 10), ...ring(6, 22, 5)], 8),
  part('sprocket_18t', 'Chain sprocket, 18 teeth, bore and 5 holes', 8, [toothed(18, 52, 57, 62, 0.06, 0.16, 0.26), circle(0, 0, 14), ...ring(5, 34, 7)], 7),
  part('flange_8bolt', 'Round flange: 8 bolts on a circle, 4 dowels, bore', 15, [circle(0, 0, 90), circle(0, 0, 30), ...ring(8, 62, 7), ...ring(4, 45, 3, deg(22.5))], 14),
  part('brake_disc', 'Brake disc: 5 lugs, 36 cross-drilled holes in 2 rings', 10, [circle(0, 0, 140), circle(0, 0, 30), ...ring(5, 50, 8), ...ring(18, 85, 5), ...ring(18, 110, 5, deg(10))], 43),
  part('heat_sink', 'Heat sink: 12 fins on a base, 2 mounting holes', 25, [heatSink(), circle(10, 4, 2.5), circle(90, 4, 2.5)], 3),
  part('conrod', 'Connecting rod: tangent-arc body, 2 bores, lightening slot', 20, [conrod(), circle(0, 0, 22), circle(150, 0, 9), slot(75, 0, 40, 8)], 4),
  part('cam_plate', 'Cam plate: 120-point profile, bore, 2 holes', 15, [cam(), circle(0, 0, 9), circle(-18, 0, 3), circle(18, 0, 3)], 4),
  part('wheel_5spoke', 'Wheel: rim, 5 spoke windows with arcs, hub bore, 5 lugs', 8, wheel(), 12),
  part('tslot_2020', 'T-slot aluminium extrusion profile 20 x 20', 40, [tslot(), circle(0, 0, 2.1)], 2),
  part('pegboard', 'Perforated board: 40 grid holes and 4 corner holes', 3, [poly([[0, 0], [120, 0], [120, 80], [0, 80]]), ...grid(8, 5, 14, 14, 11, 12, 4), circle(4, 4, 3), circle(116, 4, 3), circle(4, 76, 3), circle(116, 76, 3)], 45),
  part('gusset_bracket', 'Gusset bracket: concave outline, 5 holes, vertical slot', 8, [poly([[0, 0], [120, 0], [120, 25], [45, 25], [25, 45], [25, 100], [0, 100]]), circle(20, 12.5, 5), circle(60, 12.5, 5), circle(100, 12.5, 5), circle(12.5, 55, 4), circle(12.5, 90, 4), slot(12.5, 72, 10, 6, true)], 7),
  part('pulley_keyway', 'Pulley: bore with keyway (arc over 300 degrees), 6 holes', 20, [circle(0, 0, 45), keywayBore(), ...ring(6, 28, 8)], 8),
];

export const complexSuite = [...complexParts, ...engines.map((e) => ({ ...e, level: 'complex' }))];
