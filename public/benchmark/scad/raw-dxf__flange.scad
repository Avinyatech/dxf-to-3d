module rounded_rectangle(width, height, radius) {
    difference() {
        square([width, height], center=true);
        circle(r=radius, $fn=30);
    }
}

module rounded_circle(radius) {
    circle(r=radius, $fn=30);
}

width = 120;
height = 80;
radius = 5;

linear_extrude(height=12) {
    // Main rectangle
    square([width, height], center=true);

    // Holes
    translate([15, 15, 0]) rounded_circle(radius);
    translate([105, 15, 0]) rounded_circle(radius);
    translate([15, 65, 0]) rounded_circle(radius);
    translate([105, 65, 0]) rounded_circle(radius);

    // Inner rectangle
    translate([40, 25, 0]) square([width - 2 * radius, height - 2 * radius], center=true);
}