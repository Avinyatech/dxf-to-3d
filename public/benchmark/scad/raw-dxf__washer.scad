module circle_with_hole() {
    circle(d = 40);
    translate([0, 0, -10]) circle(d = 20);
}

circle_with_hole();