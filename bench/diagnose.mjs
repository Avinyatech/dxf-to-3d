// Plain-language reason for a benchmark outcome, from OpenSCAD's message, the score and the generated code.
export function diagnose(row, code = '') {
  if (row.strictPass) return 'Matches the drawing (overlap with the true solid is 95% or more).';
  if (row.pass && row.iou == null) return 'Passes the volume and bounding-box checks (overlap with the true solid was not measured in this run).';
  if (row.pass) return `Within the 5% volume tolerance, but the shape differs from the drawing (overlap ${(row.iou * 100).toFixed(0)}%).`;
  if (row.rendered) return `Renders, but the geometry is wrong: volume ${(row.volErr * 100).toFixed(0)}% off${row.iou != null ? `, overlap ${(row.iou * 100).toFixed(0)}%` : ''}.`;
  const err = row.error || '';
  if (row.truncated) return 'The answer was cut off at the token limit before the code was complete.';
  if (/ollama|fetch failed/i.test(err)) return 'Model server error (not a model failure).';
  if (/unknown (function|module)|ignoring unknown/i.test(err)) return 'Calls an OpenSCAD function or module that does not exist.';
  if (/parse|syntax/i.test(err)) return 'OpenSCAD syntax error.';
  if (code.trim().length < 20) return 'Empty answer.';
  if (!/linear_extrude|rotate_extrude|polyhedron|cube|cylinder|sphere/.test(code)) return 'No 3D operation: flat 2D shapes only, nothing extruded.';
  if (/polyhedron/.test(code)) return 'Built a polyhedron instead of an extrusion.';
  if (/empty|no STL/i.test(err)) return 'Produced empty geometry, so there was nothing to export (for example a polygon given 3-value points).';
  return 'OpenSCAD could not produce a solid from this code.';
}
