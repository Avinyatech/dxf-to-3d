module poly_extrude(vertices, height) {
    linear_extrude(height = height) {
        polygon(points = vertices);
    }
}

vertices = [[0, 0, 0], [80, 0, 0], [80, 15, 0], [15, 15, 0], [15, 60, 0], [0, 60, 0]];
height = 8;

poly_extrude(vertices, height);