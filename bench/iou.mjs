// Overlap (IoU) helpers. A failed intersection is NOT the same as zero overlap:
//   OpenSCAD reports an empty intersection as an "empty" error -> overlap 0
//   a timeout or any other failure -> unmeasured (null), never scored as 0
export function overlapFromRender(x, measure) {
  if (x?.stl) return measure(x.stl)?.volume ?? 0;
  if (x?.error && /empty/i.test(x.error) && !x.timedOut) return 0;
  return null;
}
export function iouValue(inter, genVolume, truthVolume) {
  if (inter == null) return null;
  const union = genVolume + truthVolume - inter;
  return union > 0 ? Math.max(0, Math.min(1, inter / union)) : null;
}
