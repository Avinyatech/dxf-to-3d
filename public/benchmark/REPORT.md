# Benchmark: deepseek-coder-v2:16b on 2D CAD to 3D
Runner: GitHub Actions (CPU) - 2026-10-07T17:11:14.614Z

**Pass** = OpenSCAD code renders, volume within 5% of ground truth, bounding box within 2%.

## By prompt strategy
| | Pass | Rendered | Mean volume error | Mean time | tok/s |
|---|---|---|---|---|---|
| raw-dxf | 0/6 (0%) | 1/6 | 70% | 19 s | 9.0 |
| structured | 0/6 (0%) | 4/6 | 35% | 14 s | 10.8 |
| fewshot | 5/6 (83%) | 5/6 | 1% | 12 s | 8.2 |

## By difficulty
| | Pass | Rendered | Mean volume error | Mean time | tok/s |
|---|---|---|---|---|---|
| easy | 2/6 (33%) | 4/6 | 23% | 14 s | 7.6 |
| medium | 1/6 (17%) | 2/6 | 18% | 12 s | 10.5 |
| hard | 2/6 (33%) | 4/6 | 22% | 18 s | 9.9 |

## Every run
| Strategy | Task | Result | Volume error | Note |
|---|---|---|---|---|
| raw-dxf | plate_2holes | FAIL | - | render failed |
| raw-dxf | washer | FAIL | - | render failed |
| raw-dxf | l_bracket | FAIL | - | render failed |
| raw-dxf | hex_nut | FAIL | - | render failed |
| raw-dxf | slot_plate | FAIL | - | render failed |
| raw-dxf | flange | FAIL | 70.5% |  |
| structured | plate_2holes | FAIL | 9.9% |  |
| structured | washer | FAIL | 82.5% |  |
| structured | l_bracket | FAIL | - | render failed |
| structured | hex_nut | FAIL | 35.7% |  |
| structured | slot_plate | FAIL | 13.4% |  |
| structured | flange | FAIL | - | render failed |
| fewshot | plate_2holes | PASS | 0.0% |  |
| fewshot | washer | PASS | 0.0% |  |
| fewshot | l_bracket | FAIL | - | render failed |
| fewshot | hex_nut | PASS | 0.0% |  |
| fewshot | slot_plate | PASS | 2.8% |  |
| fewshot | flange | PASS | 0.0% |  |
