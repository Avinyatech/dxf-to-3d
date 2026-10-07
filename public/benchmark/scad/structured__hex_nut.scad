module hexagon() {
    polygon(points=[[15,0],[7.5,12.99],[-7.5,12.99],[-15,0],[-7.5,-12.99],[7.5,-12.99]]);
}

module circle_at_origin(radius) {
    circle(r=radius);
}

difference() {
    linear_extrude(height=10) {
        hexagon();
    }
    translate([0, 0, -1]) {
        circle_at_origin(7);
    }
}