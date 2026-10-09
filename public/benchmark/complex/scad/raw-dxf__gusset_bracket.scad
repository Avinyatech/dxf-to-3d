module poly_extrude(h, l_scale = 1) {
    linear_extrude(height = h, scale = l_scale) {
        polygon(points);
    }
}

points = [
    [0, 0], [120, 0], [120, 25], [45, 25], [45, 45], [25, 45], [25, 25], [0, 25],
    [0, 100], [25, 100], [25, 77], [15.5, 77], [15.5, 67], [9.5, 67], [9.5, 77], [0, 77]
];

poly_extrude(8, 1) {
    polygon(points);
}

translate([20, 12.5, 0]) {
    cylinder(h = 8, r = 5, $fn = 40);
}

translate([60, 12.5, 0]) {
    cylinder(h = 8, r = 5, $fn = 40);
}

translate([100, 12.5, 0]) {
    cylinder(h = 8, r = 5, $fn = 40);
}

translate([12.5, 20, 0]) {
    cylinder(h = 8, r = 4, $fn = 40);
}

translate([12.5, 60, 0]) {
    cylinder(h = 8, r = 4, $fn = 40);
}

translate([12.5, 100, 0]) {
    cylinder(h = 8, r = 4, $fn = 40);
}