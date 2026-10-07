module shape() {
    polygon([[0,0],[100,0],[100,60],[0,60]]);
    circle(8, center=true, $fn=32);
    translate([20, 30]) circle(8, center=true, $fn=32);
    translate([80, 30]) circle(8, center=true, $fn=32);
}

linear_extrude(height=10) shape();