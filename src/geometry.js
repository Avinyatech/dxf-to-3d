// Pure 2D geometry: DXF entities -> closed loops -> outer profiles with holes.
const TOL = 1e-3;
const ARC_STEP = Math.PI / 36; // 5 degrees

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

function arcPoints(cx, cy, r, a0, a1, ccw = true) {
  let sweep = ccw ? a1 - a0 : a0 - a1;
  while (sweep <= 0) sweep += Math.PI * 2;
  const n = Math.max(2, Math.ceil(sweep / ARC_STEP));
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = a0 + (ccw ? 1 : -1) * (sweep * i) / n;
    pts.push({ x: cx + r * Math.cos(t), y: cy + r * Math.sin(t) });
  }
  return pts;
}

// DXF bulge = tan(theta/4) between two vertices
function bulgeSegment(p, q, bulge) {
  if (!bulge) return [p, q];
  const theta = 4 * Math.atan(bulge);
  const chord = dist(p, q);
  const r = chord / (2 * Math.sin(Math.abs(theta) / 2));
  const mx = (p.x + q.x) / 2, my = (p.y + q.y) / 2;
  const h = Math.sqrt(Math.max(r * r - (chord / 2) ** 2, 0));
  const dx = (q.x - p.x) / chord, dy = (q.y - p.y) / chord;
  const sign = bulge > 0 ? 1 : -1;
  const side = Math.abs(theta) > Math.PI ? -sign : sign;
  const cx = mx - dy * h * side, cy = my + dx * h * side;
  const a0 = Math.atan2(p.y - cy, p.x - cx);
  const a1 = Math.atan2(q.y - cy, q.x - cx);
  return arcPoints(cx, cy, r, a0, a1, bulge > 0);
}

function polylinePoints(vertices, closed) {
  const out = [];
  const n = vertices.length;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p = vertices[i], q = vertices[(i + 1) % n];
    const seg = bulgeSegment({ x: p.x, y: p.y }, { x: q.x, y: q.y }, p.bulge);
    out.push(...(out.length ? seg.slice(1) : seg));
  }
  return out;
}

// Convert a parsed dxf-parser entity into an open or closed point chain.
export function entityToChain(e) {
  switch (e.type) {
    case 'LINE':
      return { pts: [{ x: e.vertices[0].x, y: e.vertices[0].y }, { x: e.vertices[1].x, y: e.vertices[1].y }], closed: false };
    case 'LWPOLYLINE':
    case 'POLYLINE': {
      if (!e.vertices || e.vertices.length < 2) return null;
      const closed = !!e.shape;
      return { pts: polylinePoints(e.vertices, closed), closed };
    }
    case 'CIRCLE': {
      const pts = arcPoints(e.center.x, e.center.y, e.radius, 0, Math.PI * 2);
      pts.pop();
      return { pts, closed: true };
    }
    case 'ARC': {
      const a0 = e.startAngle, a1 = e.endAngle;
      return { pts: arcPoints(e.center.x, e.center.y, e.radius, a0, a1), closed: false };
    }
    case 'ELLIPSE': {
      const mx = e.majorAxisEndPoint, ratio = e.axisRatio;
      const a = Math.hypot(mx.x, mx.y), rot = Math.atan2(mx.y, mx.x);
      const full = Math.abs((e.endAngle ?? Math.PI * 2) - (e.startAngle ?? 0)) >= Math.PI * 2 - 1e-6;
      const t0 = e.startAngle ?? 0, t1 = e.endAngle ?? Math.PI * 2;
      const n = 72, pts = [];
      for (let i = 0; i <= n; i++) {
        const t = t0 + ((t1 - t0) * i) / n;
        const ex = a * Math.cos(t), ey = a * ratio * Math.sin(t);
        pts.push({ x: e.center.x + ex * Math.cos(rot) - ey * Math.sin(rot), y: e.center.y + ex * Math.sin(rot) + ey * Math.cos(rot) });
      }
      if (full) pts.pop();
      return { pts, closed: full };
    }
    default:
      return null;
  }
}

// Stitch open chains whose endpoints touch into closed loops.
export function buildLoops(chains) {
  const loops = [];
  let open = [];
  for (const c of chains) {
    if (c.closed) loops.push(dedupe(c.pts));
    else open.push(c.pts.slice());
  }
  while (open.length) {
    let cur = open.pop();
    let grew = true;
    while (grew && dist(cur[0], cur[cur.length - 1]) > TOL) {
      grew = false;
      for (let i = 0; i < open.length; i++) {
        const o = open[i];
        const h = cur[cur.length - 1], t = cur[0];
        if (dist(h, o[0]) < TOL) cur = cur.concat(o.slice(1));
        else if (dist(h, o[o.length - 1]) < TOL) cur = cur.concat(o.slice().reverse().slice(1));
        else if (dist(t, o[o.length - 1]) < TOL) cur = o.concat(cur.slice(1));
        else if (dist(t, o[0]) < TOL) cur = o.slice().reverse().concat(cur.slice(1));
        else continue;
        open.splice(i, 1);
        grew = true;
        break;
      }
    }
    if (cur.length >= 4 && dist(cur[0], cur[cur.length - 1]) < TOL) loops.push(dedupe(cur));
  }
  return loops.filter((l) => l.length >= 3);
}

function dedupe(pts) {
  const out = [];
  for (const p of pts) if (!out.length || dist(out[out.length - 1], p) > 1e-9) out.push(p);
  if (out.length > 1 && dist(out[0], out[out.length - 1]) < TOL) out.pop();
  return out;
}

export function signedArea(pts) {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i], q = pts[(i + 1) % pts.length];
    a += p.x * q.y - q.x * p.y;
  }
  return a / 2;
}

export function pointInPolygon(pt, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j];
    if (a.y > pt.y !== b.y > pt.y && pt.x < ((b.x - a.x) * (pt.y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}

// Group loops by nesting depth: even depth = solid outline, odd depth = hole in its parent.
export function buildProfiles(loops) {
  const items = loops.map((pts) => ({ pts, area: Math.abs(signedArea(pts)), parent: -1, depth: 0 }));
  items.forEach((it, i) => {
    let best = -1;
    items.forEach((other, j) => {
      if (i === j || other.area <= it.area) return;
      if (pointInPolygon(it.pts[0], other.pts) && (best < 0 || other.area < items[best].area)) best = j;
    });
    it.parent = best;
  });
  items.forEach((it) => {
    let d = 0, p = it.parent;
    while (p >= 0) { d++; p = items[p].parent; }
    it.depth = d;
  });
  const profiles = [];
  items.forEach((it, i) => {
    if (it.depth % 2 !== 0) return;
    const holes = items.filter((h) => h.parent === i && h.depth % 2 === 1).map((h) => h.pts);
    profiles.push({ outer: it.pts, holes });
  });
  return profiles;
}

export function bounds(loops) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const l of loops) for (const p of l) {
    minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
  }
  return { minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY };
}
