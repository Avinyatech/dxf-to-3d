module extrude_polyline(vertices, height) {
    points = [for (v = vertices) [v[0], v[1], 0]];
    polyhedron(points, [[0, 1, 2, 3]]);
}

module extrude_circle(center, radius, height) {
    translate([center[0], center[1], 0]) circle(r = radius, $fn = 100);
}

height = 12;

extrude_polyline([[0,0,0],[120,0,0],[120,80,0],[0,80,0]], height);
extrude_circle([15,15], 5, height);
extrude_circle([105,15], 5, height);
extrude_circle([15,65], 5, height);
extrude_circle([105,65], 5, height);
extrude_polyline([[40,25,0],[80,25,0],[80,55,0],[40,55,0]], height);