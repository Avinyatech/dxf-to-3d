# DXF to 3D

Turn open-format 2D CAD drawings (**DXF**) into 3D models in the browser.

- Parses DXF with [`dxf-parser`](https://github.com/gdsestimating/dxf-parser): LINE, ARC, CIRCLE, ELLIPSE, LWPOLYLINE/POLYLINE (with bulges)
- Stitches loose lines/arcs into closed loops, then detects holes and islands by nesting depth
- Extrudes profiles with [Three.js](https://threejs.org) and previews them with orbit controls
- Exports **STL**, **OBJ**, and generated **OpenSCAD** code (`linear_extrude` + `polygon` with holes)

## Run

```bash
npm install
npm run dev     # local dev server
npm test        # geometry tests
npm run build   # static site in dist/
```

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which tests, builds, and publishes to GitHub Pages
(enable it once under Settings → Pages → Source: GitHub Actions).

## Limits / roadmap

SPLINE, 3D entities, blocks/INSERT and text are not converted yet. Planned: revolve mode, per-layer depth, CadQuery code output.

MIT licensed.

## LLM benchmark: 2D CAD to 3D code

Live results: https://avinyatech.github.io/dxf-to-3d/benchmark/ (re-run via the *LLM benchmark (cloud)* workflow; `bench/` has the harness).

Setup: `deepseek-coder-v2:16b` (Ollama, GitHub-hosted CPU runner, ~9 tok/s), 6 DXF drawings x 3 prompt strategies = 18 runs, temperature 0.
A run passes if the generated OpenSCAD renders and its volume is within 5% and bounding box within 2% of ground truth.

| Prompt strategy | Pass |
|---|---|
| raw DXF text | 0/6 |
| parsed entity JSON | 0/6 |
| JSON + one worked example (few-shot) | 5/6 |

Takeaways: the model does not reliably produce an extrusion from raw DXF or from JSON alone (flat 2D output, single-face polyhedra, uncalled modules).
One worked example fixes most of it. Caveats: one model, one run per cell, small suite; treat as a pilot, not a ranking of models.

### Engine stress test (inline-3 and inline-4 block deck faces)
`bench/engines.mjs` generates representative engine-block deck-face drawings (20 and 25 closed loops: bores, head-bolt holes, coolant slots, oil returns, dowels, rounded corners; typical small-engine dimensions, not a specific manufacturer's drawing).
Run: `gh workflow run benchmark.yml -f suite=engines`; results land in `public/benchmark/engines/`.

| Prompt strategy | inline-3 (20 loops) | inline-4 (25 loops) |
|---|---|---|
| raw DXF text | FAIL (no solid) | FAIL (no solid) |
| parsed entity JSON | FAIL (no solid) | FAIL (no solid) |
| JSON + worked example | PASS, borderline (4.9% volume error; slots merged into the outline) | FAIL (no solid) |

1 of 6 passed, and that pass is within tolerance only because the benchmark allows 5% volume error. The model copied wrong numbers, invented OpenSCAD functions and misread bulge values.
Only the flat deck face is a valid 2D-to-3D extrusion target; real engines are mostly non-prismatic.
