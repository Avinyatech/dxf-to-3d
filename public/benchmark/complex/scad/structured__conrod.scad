module extrude_polyline(vertices, height) {
    linear_extrude(height = height) {
        polygon(points = vertices);
    }
}

module extrude_circle(center, radius, height) {
    translate(center) {
        linear_extrude(height = height) {
            circle(r = radius);
        }
    }
}

vertices1 = [
    [-3, -29.85, 0],
    [148.5, -14.925, 1.106],
    [148.5, 14.925, 0],
    [-3, 29.85, 0.905]
];

vertices2 = [
    [55, -4, 0],
    [95, -4, 1],
    [95, 4, 0],
    [55, 4, 1]
];

extrude_polyline(vertices1, 20);
extrude_circle([0, 0], 22, 20);
extrude_circle([150, 0], 9, 20);
extrude_polyline(vertices2, 20);