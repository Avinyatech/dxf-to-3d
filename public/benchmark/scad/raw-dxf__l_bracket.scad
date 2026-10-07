module lwpolyline_to_polygon(points) {
    polygon(points);
}

points = [
    [0, 0],
    [80, 0],
    [80, 15],
    [15, 15],
    [15, 10],
    [10, 10],
    [10, 0]
];

lwpolyline_to_polygon(points);

translate([0, 0, 0]) linear_extrude(height = 8) lwpolyline_to_polygon(points);