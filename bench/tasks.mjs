// Benchmark suite: 2D CAD drawings (DXF) of increasing difficulty, each with an extrusion depth.
const dxf = (entities) => ['0', 'SECTION', '2', 'ENTITIES', ...entities.flat(), '0', 'ENDSEC', '0', 'EOF'].join('\n') + '\n';
const line = (a, b, c, d) => ['0', 'LINE', '8', '0', '10', a, '20', b, '11', c, '21', d];
const circle = (x, y, r) => ['0', 'CIRCLE', '8', '0', '10', x, '20', y, '40', r];
// verts: [x, y, bulge]
const poly = (verts) => [
  '0', 'LWPOLYLINE', '8', '0', '90', verts.length, '70', 1,
  ...verts.flatMap(([x, y, b = 0]) => ['10', x, '20', y, ...(b ? ['42', b] : [])]),
];
const rect = (x0, y0, x1, y1) => poly([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]);
const hex = (R) => poly([0, 1, 2, 3, 4, 5].map((i) => [+(R * Math.cos((i * Math.PI) / 3)).toFixed(6), +(R * Math.sin((i * Math.PI) / 3)).toFixed(6)]));

export const tasks = [
  { id: 'plate_2holes', name: 'Plate with two holes', depth: 10, level: 'easy',
    dxf: dxf([line(0, 0, 100, 0), line(100, 0, 100, 60), line(100, 60, 0, 60), line(0, 60, 0, 0), circle(20, 30, 8), circle(80, 30, 8)]) },
  { id: 'washer', name: 'Washer (circle in circle)', depth: 3, level: 'easy',
    dxf: dxf([circle(0, 0, 20), circle(0, 0, 9)]) },
  { id: 'l_bracket', name: 'L-bracket polygon', depth: 8, level: 'medium',
    dxf: dxf([poly([[0, 0], [80, 0], [80, 15], [15, 15], [15, 60], [0, 60]])]) },
  { id: 'hex_nut', name: 'Hex nut', depth: 10, level: 'medium',
    dxf: dxf([hex(15), circle(0, 0, 7)]) },
  { id: 'slot_plate', name: 'Plate with bulge-arc slot', depth: 6, level: 'hard',
    dxf: dxf([rect(0, 0, 80, 40), poly([[25, 15], [55, 15, 1], [55, 25], [25, 25, 1]])]) },
  { id: 'flange', name: 'Flange: 4 holes + rectangular window', depth: 12, level: 'hard',
    dxf: dxf([rect(0, 0, 120, 80), circle(15, 15, 5), circle(105, 15, 5), circle(15, 65, 5), circle(105, 65, 5), rect(40, 25, 80, 55)]) },
];
