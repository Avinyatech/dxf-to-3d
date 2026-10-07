module circle_extrude(radius, height) {
    difference() {
        cylinder(h = height, r = radius);
        translate([0, 0, -1]) cylinder(h = height + 2, r = radius - 1);
    }
}

circle_extrude(20, 3);
circle_extrude(9, 3);