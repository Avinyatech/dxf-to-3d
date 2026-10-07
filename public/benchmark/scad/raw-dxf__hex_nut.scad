module polygon(points) {
    polygon(points);
}

module circle(radius) {
    circle(r = radius);
}

points = [[15, 12.990381], [7.5, 12.990381], [0, 0], [-7.5, -12.990381], [-15, -12.990381], [-7.5, -12.990381], [0, 0], [7.5, 12.990381]];

polygon(points);

translate([0, 0, 10]) {
    polygon(points);
}