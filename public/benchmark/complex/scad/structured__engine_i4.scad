// Define the dimensions and extrusion depth
extrusion_depth = 30;

// Define the vertices for the polyline
vertices = [
    [12, 0, 0],
    [383, 0, 0.414],
    [395, 12, 0],
    [395, 198, 0.414],
    [383, 210, 0],
    [12, 210, 0.414],
    [0, 198, 0],
    [0, 12, 0.414]
];

// Define the circles
circles = [
    [62.5, 105, 40.5],
    [152.5, 105, 40.5],
    [242.5, 105, 40.5],
    [332.5, 105, 40.5],
    [17.5, 43, 5.5],
    [17.5, 167, 5.5],
    [107.5, 43, 5.5],
    [107.5, 167, 5.5],
    [197.5, 43, 5.5],
    [197.5, 167, 5.5],
    [287.5, 43, 5.5],
    [287.5, 167, 5.5],
    [377.5, 43, 5.5],
    [377.5, 167, 5.5]
];

// Define the inner circles
inner_circles = [
    [107.5, 135, 6],
    [287.5, 75, 6]
];

// Define the additional circles
additional_circles = [
    [29.5, 155, 4],
    [365.5, 55, 4]
];

// Define the polylines
polylines = [
    [
        [98.5, 57.5, 0],
        [116.5, 57.5, 1],
        [116.5, 64.5, 0],
        [98.5, 64.5, 1]
    ],
    [
        [98.5, 145.5, 0],
        [116.5, 145.5, 1],
        [116.5, 152.5, 0],
        [98.5, 152.5, 1]
    ],
    [
        [188.5, 57.5, 0],
        [206.5, 57.5, 1],
        [206.5, 64.5, 0],
        [188.5, 64.5, 1]
    ],
    [
        [188.5, 145.5, 0],
        [206.5, 145.5, 1],
        [206.5, 152.5, 0],
        [188.5, 152.5, 1]
    ],
    [
        [278.5, 57.5, 0],
        [296.5, 57.5, 1],
        [296.5, 64.5, 0],
        [278.5, 64.5, 1]
    ],
    [
        [278.5, 145.5, 0],
        [296.5, 145.5, 1],
        [296.5, 152.5, 0],
        [278.5, 152.5, 1]
    ]
];

// Function to create a circle
module circle(center, radius) {
    translate(center) circle(r = radius);
}

// Function to create a polyline
module polyline(vertices) {
    polygon(points = vertices);
}

// Create the base shape from the polyline vertices
module base_shape() {
    polyline(vertices);
}

// Create the circles
module circles_module() {
    for (circle = circles) {
        translate(circle[0:2]) circle(r = circle[2]);
    }
}

// Create the inner circles
module inner_circles_module() {
    for (circle = inner_circles) {
        translate(circle[0:2]) circle(r = circle[2]);
    }
}

// Create the additional circles
module additional_circles_module() {
    for (circle = additional_circles) {
        translate(circle[0:2]) circle(r = circle[2]);
    }
}

// Create the polylines
module polylines_module() {
    for (polyline = polylines) {
        polyline(polyline);
    }
}

// Main module to create the 3D solid
module main() {
    // Create the base shape
    base_shape();

    // Create the circles
    circles_module();

    // Create the inner circles
    inner_circles_module();

    // Create the additional circles
    additional_circles_module();

    // Create the polylines
    polylines_module();

    // Extrude the shape along +Z
    linear_extrude(height = extrusion_depth) {
        base_shape();
        circles_module();
        inner_circles_module();
        additional_circles_module();
        polylines_module();
    }
}

// Call the main module
main();