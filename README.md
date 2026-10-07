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
