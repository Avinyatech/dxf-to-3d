import DxfParser from 'dxf-parser';
import { entityToChain, buildLoops, buildProfiles, bounds } from './geometry.js';

export function parseDxf(text) {
  const dxf = new DxfParser().parse(text);
  const chains = [];
  let skipped = 0;
  for (const e of dxf.entities || []) {
    const c = entityToChain(e);
    if (c) chains.push(c); else skipped++;
  }
  const loops = buildLoops(chains);
  const profiles = buildProfiles(loops);
  return { loops, profiles, bounds: loops.length ? bounds(loops) : null, skipped, entityCount: (dxf.entities || []).length };
}
