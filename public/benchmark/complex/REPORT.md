# Benchmark: deepseek-coder-v2:16b on 2D CAD to 3D
Runner: GitHub Actions (CPU) - 2026-10-09T10:01:15.210Z

**Pass** = OpenSCAD code renders, volume within 5% of ground truth, bounding box within 2%.

## By prompt strategy
| | Pass | Strict pass (IoU >= 0.95) | Mean IoU | Rendered | Mean volume error | Mean time | tok/s |
|---|---|---|---|---|---|---|---|
| raw-dxf | 0/14 (0%) | 0/14 | 0.13 | 4/14 | 35% | 120 s | 7.3 |
| structured | 0/14 (0%) | 0/14 | 0.00 | 2/14 | 83% | 128 s | 7.9 |
| fewshot | 4/14 (29%) | 2/14 | 0.45 | 10/14 | 20% | 126 s | 7.6 |

## By difficulty
| | Pass | Strict pass (IoU >= 0.95) | Mean IoU | Rendered | Mean volume error | Mean time | tok/s |
|---|---|---|---|---|---|---|---|
| complex | 4/42 (10%) | 2/42 | 0.19 | 16/42 | 32% | 124 s | 7.6 |

## Every run
| Strategy | Task | Result | Volume error | Note |
|---|---|---|---|---|
| raw-dxf | gear_24t | FAIL | - | ollama 400: {"error":"the prompt is longer than the context length currently ava |
| raw-dxf | sprocket_18t | FAIL | - | ERROR: Parser error: syntax error in file public/benchmark/complex/scad/raw-dxf_ |
| raw-dxf | flange_8bolt | FAIL | - | ERROR: Parser error: syntax error in file public/benchmark/complex/scad/raw-dxf_ |
| raw-dxf | brake_disc | FAIL | - | ERROR: Parser error: syntax error in file public/benchmark/complex/scad/raw-dxf_ |
| raw-dxf | heat_sink | FAIL | 72.4% |  |
| raw-dxf | conrod | FAIL | 8.2% |  |
| raw-dxf | cam_plate | FAIL | - | ERROR: Parser error: syntax error in file public/benchmark/complex/scad/raw-dxf_ |
| raw-dxf | wheel_5spoke | FAIL | - | ERROR: Parser error: syntax error in file public/benchmark/complex/scad/raw-dxf_ |
| raw-dxf | tslot_2020 | FAIL | - | ERROR: Recursion detected calling module 'polygon' in file raw-dxf__tslot_2020.s |
| raw-dxf | pegboard | FAIL | 50.6% |  |
| raw-dxf | gusset_bracket | FAIL | 10.7% |  |
| raw-dxf | pulley_keyway | FAIL | - | render failed |
| raw-dxf | engine_i3 | FAIL | - | ERROR: Parser error: syntax error in file public/benchmark/complex/scad/raw-dxf_ |
| raw-dxf | engine_i4 | FAIL | - | WARNING: Unable to convert translate([3, undef, 0]) parameter to a vec3 or vec2  |
| structured | gear_24t | FAIL | - | ERROR: Parser error: syntax error in file public/benchmark/complex/scad/structur |
| structured | sprocket_18t | FAIL | - | ERROR: Parser error: syntax error in file public/benchmark/complex/scad/structur |
| structured | flange_8bolt | FAIL | - | WARNING: Ignoring unknown function 'circle' in file structured__flange_8bolt.sca |
| structured | brake_disc | FAIL | - | ERROR: Parser error: syntax error in file public/benchmark/complex/scad/structur |
| structured | heat_sink | FAIL | - | WARNING: Mixing 2D and 3D objects is not supported in file structured__heat_sink |
| structured | conrod | FAIL | 71.9% |  |
| structured | cam_plate | FAIL | - | ERROR: Unable to convert points[0] = [30, 0, 0] to a vec2 of numbers in file str |
| structured | wheel_5spoke | FAIL | - | ERROR: Parser error: syntax error in file public/benchmark/complex/scad/structur |
| structured | tslot_2020 | FAIL | 94.7% |  |
| structured | pegboard | FAIL | - | ERROR: Unable to convert points[0] = [0, 0, 0] to a vec2 of numbers in file stru |
| structured | gusset_bracket | FAIL | - | ERROR: Parser error: syntax error in file public/benchmark/complex/scad/structur |
| structured | pulley_keyway | FAIL | - | ERROR: Parser error: syntax error in file public/benchmark/complex/scad/structur |
| structured | engine_i3 | FAIL | - | ERROR: Parser error: syntax error in file public/benchmark/complex/scad/structur |
| structured | engine_i4 | FAIL | - | ERROR: Parser error: syntax error in file public/benchmark/complex/scad/structur |
| fewshot | gear_24t | FAIL | - | ERROR: Parser error: syntax error in file public/benchmark/complex/scad/fewshot_ |
| fewshot | sprocket_18t | FAIL | - | ERROR: Parser error: syntax error in file public/benchmark/complex/scad/fewshot_ |
| fewshot | flange_8bolt | FAIL | 19.6% |  |
| fewshot | brake_disc | FAIL | 12.1% |  |
| fewshot | heat_sink | PASS | 0.0% |  |
| fewshot | conrod | FAIL | 12.7% |  |
| fewshot | cam_plate | FAIL | 61.1% |  |
| fewshot | wheel_5spoke | FAIL | 53.5% |  |
| fewshot | tslot_2020 | FAIL | - | ERROR: Parser error: syntax error in file public/benchmark/complex/scad/fewshot_ |
| fewshot | pegboard | PASS | 0.0% |  |
| fewshot | gusset_bracket | PASS | 1.7% |  |
| fewshot | pulley_keyway | FAIL | 31.5% |  |
| fewshot | engine_i3 | PASS | 4.9% |  |
| fewshot | engine_i4 | FAIL | - | ERROR: Parser error: syntax error in file public/benchmark/complex/scad/fewshot_ |
