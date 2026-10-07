module extrude_lines(depth) {
    scale(1) {
        translate([0, 0, 0]) {
            // Define the lines
            polygon(points=[
                [0, 0],
                [100, 0],
                [100, 60],
                [0, 60],
                [0, 0]
            ]);
            polygon(points=[
                [100, 0],
                [100, 60],
                [0, 60],
                [0, 0]
            ]);
        }
        translate([20, 20, 0]) {
            circle(r=30);
        }
        translate([80, 80, 0]) {
            circle(r=30);
        }
    }
}

extrude_lines(10);