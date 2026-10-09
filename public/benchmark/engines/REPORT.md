# Benchmark: deepseek-coder-v2:16b on 2D CAD to 3D
Runner: GitHub Actions (CPU) - 2026-10-09T06:53:13.874Z

**Pass** = OpenSCAD code renders, volume within 5% of ground truth, bounding box within 2%.

## By prompt strategy
| | Pass | Rendered | Mean volume error | Mean time | tok/s |
|---|---|---|---|---|---|
| raw-dxf | 0/2 (0%) | 0/2 | n/a | 61 s | 6.9 |
| structured | 0/2 (0%) | 0/2 | n/a | 156 s | 9.2 |
| fewshot | 1/2 (50%) | 1/2 | 5% | 43 s | 7.7 |

## By difficulty
| | Pass | Rendered | Mean volume error | Mean time | tok/s |
|---|---|---|---|---|---|
| engine | 1/6 (17%) | 1/6 | 5% | 87 s | 8.4 |

## Every run
| Strategy | Task | Result | Volume error | Note |
|---|---|---|---|---|
| raw-dxf | engine_i3 | FAIL | - | fetch failed |
| raw-dxf | engine_i4 | FAIL | - | render failed |
| structured | engine_i3 | FAIL | - | render failed |
| structured | engine_i4 | FAIL | - | render failed |
| fewshot | engine_i3 | PASS | 4.9% |  |
| fewshot | engine_i4 | FAIL | - | fetch failed |
