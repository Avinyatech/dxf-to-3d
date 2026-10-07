// Builds LLM prompts that ask for OpenSCAD code extruding a 2D DXF drawing into 3D.
import DxfParser from 'dxf-parser';

const r = (n) => +n.toFixed(3);
const pt = (p) => [r(p.x), r(p.y)];

// Compact, model-friendly summary of the drawing entities.
export function summarizeEntities(dxfText) {
  const dxf = new DxfParser().parse(dxfText);
  const out = [];
  for (const e of dxf.entities || []) {
    if (e.type === 'LINE') out.push({ type: 'LINE', from: pt(e.vertices[0]), to: pt(e.vertices[1]) });
    else if (e.type === 'CIRCLE') out.push({ type: 'CIRCLE', center: pt(e.center), radius: r(e.radius) });
    else if (e.type === 'ARC') out.push({ type: 'ARC', center: pt(e.center), radius: r(e.radius), start_deg: r((e.startAngle * 180) / Math.PI), end_deg: r((e.endAngle * 180) / Math.PI) });
    else if (e.type === 'LWPOLYLINE' || e.type === 'POLYLINE')
      out.push({ type: 'POLYLINE', closed: !!e.shape, vertices: e.vertices.map((v) => [r(v.x), r(v.y), r(v.bulge || 0)]), note: 'vertex = [x, y, bulge]; bulge = tan(angle/4) of the arc to the next vertex, 0 = straight line' });
  }
  return out;
}

export const SYSTEM = [
  'You are a mechanical CAD engineer who writes OpenSCAD.',
  'Convert the given 2D drawing into a 3D solid by extruding it along +Z from z=0.',
  'Rules: units are mm; keep X/Y coordinates exactly as in the drawing (do not recenter);',
  'closed shapes nested inside another closed shape are holes through the part;',
  'do not add features that are not in the drawing.',
  'Reply with exactly one ```openscad code block and nothing else.',
].join(' ');

const EXAMPLE = {
  entities: [
    { type: 'POLYLINE', closed: true, vertices: [[0, 0, 0], [30, 0, 0], [30, 20, 0], [0, 20, 0]] },
    { type: 'CIRCLE', center: [15, 10], radius: 4 },
  ],
  depth: 5,
  code: 'linear_extrude(height = 5)\n  difference() {\n    polygon([[0,0],[30,0],[30,20],[0,20]]);\n    translate([15,10]) circle(r = 4, $fn = 64);\n  }',
};

// strategy: 'raw-dxf' | 'structured' | 'fewshot'
export function buildMessages(dxfText, depth, strategy = 'structured') {
  const messages = [{ role: 'system', content: SYSTEM }];
  if (strategy === 'raw-dxf') {
    const body = dxfText.includes('ENTITIES') ? dxfText.slice(dxfText.indexOf('ENTITIES') - 10) : dxfText;
    messages.push({ role: 'user', content: `DXF drawing (ENTITIES section):\n${body}\nExtrusion depth: ${depth} mm.` });
    return messages;
  }
  if (strategy === 'fewshot') {
    messages.push({ role: 'user', content: `Drawing entities:\n${JSON.stringify(EXAMPLE.entities)}\nExtrusion depth: ${EXAMPLE.depth} mm.` });
    messages.push({ role: 'assistant', content: '```openscad\n' + EXAMPLE.code + '\n```' });
  }
  messages.push({ role: 'user', content: `Drawing entities:\n${JSON.stringify(summarizeEntities(dxfText))}\nExtrusion depth: ${depth} mm.` });
  return messages;
}

export function extractCode(reply) {
  const m = reply.match(/```(?:openscad|scad)?\s*\n([\s\S]*?)```/i);
  return (m ? m[1] : reply).trim();
}
