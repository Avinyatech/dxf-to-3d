// One-line outcome notes, written by reading each generated OpenSCAD file (see public/benchmark/scad/).
// Key: "<strategy>/<task>". Passing runs fall back to a generic note in gallery.mjs.
export const notes = {
  'raw-dxf/plate_2holes': 'Only flat 2D polygons were written; nothing was extruded, and the holes became separate polygons.',
  'raw-dxf/washer': 'Two 2D circles only; no extrusion, and the inner circle was shifted in z instead of subtracted.',
  'raw-dxf/l_bracket': 'Extruded, but invented outline points ([15,10], [10,10], [10,0]) that do not match the L shape, so no valid solid.',
  'raw-dxf/hex_nut': 'Wrong hexagon vertices, 2D only, and modules named polygon/circle that call themselves.',
  'raw-dxf/slot_plate': 'Defined an extrude module but never called it; flat 2D shapes, slot not subtracted.',
  'raw-dxf/flange': 'Centred the rectangle on the origin (the drawing is corner-based), added the holes instead of subtracting them, window wrong size.',
  'structured/plate_2holes': 'Added the circles to the plate instead of subtracting them, plus an extra circle at the origin.',
  'structured/washer': 'Built two separate cylinders instead of a ring; the inner circle was never cut out of the outer.',
  'structured/l_bracket': 'Passed [x, y, bulge] triples to polygon(), which produces empty geometry, so no solid.',
  'structured/hex_nut': 'Hexagon was close, but the bore circle was subtracted as 2D outside the extrusion, so the hexagon was not cut.',
  'structured/slot_plate': 'Treated the slot as a second, mis-translated rectangle added to the plate instead of a cut.',
  'structured/flange': 'Built a single-face polyhedron instead of an extrusion; holes left as 2D circles.',
  'fewshot/l_bracket': 'Copied the worked example\'s [x, y, 0] point format into polygon(), which produces empty geometry.',
  'fewshot/slot_plate': 'Passes within tolerance, but drew the slot as a plain rectangle (the drawing has rounded ends); volume 2.8% off.',
};
