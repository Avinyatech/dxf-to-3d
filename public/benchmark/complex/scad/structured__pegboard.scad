module circle_with_hole(center, radius, hole_radius) {
    difference() {
        circle(radius);
        circle(hole_radius);
    }
}

module circle_at_point(center, radius) {
    translate(center) circle(radius);
}

module polyline_to_polygon(vertices) {
    polygon(points = vertices);
}

height = 3;

vertices = [
    [0, 0, 0],
    [120, 0, 0],
    [120, 80, 0],
    [0, 80, 0]
];

polyline_to_polygon(vertices);

for (i = [11, 25, 39, 53, 67, 81, 95, 109]) {
    translate([i, 12, 0]) circle_with_hole([0, 0, 0], 4, 1);
}

for (i = [11, 25, 39, 53, 67, 81, 95, 109]) {
    translate([i, 26, 0]) circle_with_hole([0, 0, 0], 4, 1);
}

for (i = [11, 25, 39, 53, 67, 81, 95, 109]) {
    translate([i, 40, 0]) circle_with_hole([0, 0, 0], 4, 1);
}

for (i = [11, 25, 39, 53, 67, 81, 95, 109]) {
    translate([i, 54, 0]) circle_with_hole([0, 0, 0], 4, 1);
}

for (i = [11, 25, 39, 53, 67, 81, 95, 109]) {
    translate([i, 68, 0]) circle_with_hole([0, 0, 0], 4, 1);
}

translate([4, 4, 0]) circle_with_hole([0, 0, 0], 3, 1);
translate([116, 4, 0]) circle_with_hole([0, 0, 0], 3, 1);
translate([4, 76, 0]) circle_with_hole([0, 0, 0], 3, 1);
translate([116, 76, 0]) circle_with_hole([0, 0, 0], 3, 1);

linear_extrude(height = height) {
    union() {
        polygon(points = vertices);
        for (i = [11, 25, 39, 53, 67, 81, 95, 109]) {
            translate([i, 12, 0]) circle(4);
        }
        for (i = [11, 25, 39, 53, 67, 81, 95, 109]) {
            translate([i, 26, 0]) circle(4);
        }
        for (i = [11, 25, 39, 53, 67, 81, 95, 109]) {
            translate([i, 40, 0]) circle(4);
        }
        for (i = [11, 25, 39, 53, 67, 81, 95, 109]) {
            translate([i, 54, 0]) circle(4);
        }
        for (i = [11, 25, 39, 53, 67, 81, 95, 109]) {
            translate([i, 68, 0]) circle(4);
        }
        translate([4, 4, 0]) circle(3);
        translate([116, 4, 0]) circle(3);
        translate([4, 76, 0]) circle(3);
        translate([116, 76, 0]) circle(3);
    }
}