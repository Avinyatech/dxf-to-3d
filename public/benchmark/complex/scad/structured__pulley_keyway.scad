module circle_extrude(center, radius, height) {
    translate([center[0], center[1], 0]) {
        cylinder(h = height, r = radius);
    }
}

module polyline_extrude(vertices, height) {
    linear_extrude(height = height) {
        polygon(points = [v[0:2] for v in vertices]);
    }
}

height = 20;

circle_extrude([0, 0], 45, height);
polyline_extrude([[2, 9.798, 0], [2, 11.5, 0], [-2, 11.5, 0], [-2, 9.798, 9.899]], height);
circle_extrude([28, 0], 8, height);
circle_extrude([14, 24.249], 8, height);
circle_extrude([-14, 24.249], 8, height);
circle_extrude([-28, 0], 8, height);
circle_extrude([-14, -24.249], 8, height);
circle_extrude([14, -24.249], 8, height);