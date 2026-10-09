// DXF drawing converted to OpenSCAD

// Define the extrusion depth
extrusion_depth = 30;

// Define the circles
circle_radius = 3;
circle_offset = 40;
circle_positions = [
    [17.5, 43], [17.5, 167], [107.5, 43], [107.5, 167],
    [197.5, 43], [197.5, 167], [287.5, 43], [287.5, 167],
    [377.5, 43], [377.5, 167], [62.5, 105], [152.5, 105],
    [242.5, 105], [332.5, 105]
];

// Define the polylines
polyline_points = [
    [[12, 0], [383, 0], [395, 12], [395, 198], [383, 210], [12, 210], [0, 198], [0, 12]],
    [[98.5, 57.5], [116.5, 57.5], [116.5, 64.5], [98.5, 64.5]],
    [[98.5, 145.5], [116.5, 145.5], [116.5, 152.5], [98.5, 152.5]],
    [[188.5, 57.5], [206.5, 57.5], [206.5, 64.5], [188.5, 64.5]],
    [[188.5, 145.5], [206.5, 145.5], [206.5, 152.5], [188.5, 152.5]],
    [[278.5, 57.5], [296.5, 57.5], [296.5, 64.5], [278.5, 64.5]],
    [[278.5, 145.5], [296.5, 145.5], [296.5, 152.5], [278.5, 152.5]]
];

// Function to create a circle
module circle(x, y) {
    translate([x, y, 0]) circle(circle_radius);
}

// Create circles
for (pos = circle_positions) {
    circle(pos[0], pos[1]);
}

// Function to create a polyline
module polyline(points) {
    polygon(points);
}

// Create polylines
for (points = polyline_points) {
    polyline(points);
}

// Extrude the shapes
module extrude_shapes() {
    for (points = polyline_points) {
        translate([0, 0, 0]) linear_extrude(height = extrusion_depth) polygon(points);
    }
}

// Main module
extrude_shapes();