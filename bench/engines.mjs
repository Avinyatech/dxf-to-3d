// Representative inline 3- and 4-cylinder engine-block DECK-FACE drawings (plan view) as DXF.
// Dimensions are typical of small passenger-car engines; these are NOT a specific manufacturer's drawing.
// Only the flat deck profile is a valid 2D->3D extrusion target; real engines have non-prismatic geometry.
const dxf = (e) => ['0', 'SECTION', '2', 'ENTITIES', ...e.flat(), '0', 'ENDSEC', '0', 'EOF'].join('\n') + '\n';
const circle = (x, y, r) => ['0', 'CIRCLE', '8', '0', '10', +x.toFixed(4), '20', +y.toFixed(4), '40', r];
const poly = (v) => ['0', 'LWPOLYLINE', '8', '0', '90', v.length, '70', 1, ...v.flatMap(([x, y, b = 0]) => ['10', +x.toFixed(4), '20', +y.toFixed(4), ...(b ? ['42', +b.toFixed(6)] : [])])];
const K = Math.tan(Math.PI / 8); // bulge of a quarter-circle arc

// Rounded-corner rectangle, counter-clockwise, arcs on the corners
const roundRect = (L, W, r) => poly([[r, 0], [L - r, 0, K], [L, r], [L, W - r, K], [L - r, W], [r, W, K], [0, W - r], [0, r, K]]);
// Horizontal slot (stadium): length l between arc centres, width w
const slot = (cx, cy, l, w) => poly([[cx - l / 2, cy - w / 2], [cx + l / 2, cy - w / 2, 1], [cx + l / 2, cy + w / 2], [cx - l / 2, cy + w / 2, 1]]);

export function engineDeck({ cylinders, bore, pitch, width, endWall = 22, bolt = 11, boltRow = 62, thickness = 30 }) {
  const L = (cylinders - 1) * pitch + bore + 2 * endWall, cy = width / 2, xc = (i) => endWall + bore / 2 + i * pitch;
  const e = [roundRect(L, width, 12)];
  for (let i = 0; i < cylinders; i++) e.push(circle(xc(i), cy, bore / 2)); // cylinder bores
  const stations = [xc(0) - pitch / 2, ...Array.from({ length: cylinders }, (_, i) => xc(i) + pitch / 2)]; // between bores and at the ends
  for (const x of stations) for (const s of [-1, 1]) e.push(circle(x, cy + s * boltRow, bolt / 2)); // head-bolt holes
  for (let i = 0; i < cylinders - 1; i++) for (const s of [-1, 1]) e.push(slot(xc(i) + pitch / 2, cy + s * (boltRow - 18), 18, 7)); // coolant passages between bores
  e.push(circle(xc(0) + pitch / 2, cy + 30, 6), circle(xc(cylinders - 1) - pitch / 2, cy - 30, 6)); // oil return (clear of the coolant slots)
  e.push(circle(stations[0] + 12, cy + boltRow - 12, 4), circle(stations[stations.length - 1] - 12, cy - boltRow + 12, 4)); // dowels
  return { dxf: dxf(e), depth: thickness, length: L, width, loops: 1 + cylinders + 2 * stations.length + 2 * (cylinders - 1) + 4 };
}

export const engines = [
  { id: 'engine_i3', name: 'Inline-3 engine block deck face (1.0 L class)', level: 'engine', ...engineDeck({ cylinders: 3, bore: 74, pitch: 82, width: 190 }) },
  { id: 'engine_i4', name: 'Inline-4 engine block deck face (1.6 L class)', level: 'engine', ...engineDeck({ cylinders: 4, bore: 81, pitch: 90, width: 210 }) },
];
