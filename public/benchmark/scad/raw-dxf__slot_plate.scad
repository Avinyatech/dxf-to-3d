module poly(points) {
    polygon(points);
}

module extrude(height) {
    linear_extrude(height) {
        poly(points);
    }
}

points1 = [[0, 0], [80, 0], [80, 40], [0, 40], [0, 0]];
points2 = [[25, 15], [55, 15], [55, 25], [25, 25], [25, 15]];

poly(points1);
translate([0, 0, 0]) poly(points2);