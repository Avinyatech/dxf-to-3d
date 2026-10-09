// Define the circles
circle1 = circle(d=180); // Outer circle
circle2 = circle(d=60); // Inner circle
circle3 = circle(d=14); // Small circles
circle4 = circle(d=14);
circle5 = circle(d=14);
circle6 = circle(d=14);
circle7 = circle(d=14);
circle8 = circle(d=14);
circle9 = circle(d=14);
circle10 = circle(d=14);
circle11 = circle(d=6); // Smaller circles
circle12 = circle(d=6);
circle13 = circle(d=6);
circle14 = circle(d=6);
circle15 = circle(d=6);
circle16 = circle(d=6);

// Create the outer shape by subtracting the inner circle from the outer circle
difference() {
    circle(d=180);
    circle(d=60);
}

// Create the smaller circles and position them within the outer shape
for (i = [-62:14:62]) {
    for (j = [-62:14:62]) {
        if (i != 0 || j != 0) {
            translate([i, j]) circle(d=14);
        }
    }
}

// Extrude the shape to the desired depth
linear_extrude(height=15) {
    // The outer shape and smaller circles are already defined, so no additional code is needed here.
}